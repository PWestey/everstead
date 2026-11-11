// Four AI tiers. Each exposes choose(view, p) -> { plays, moves, action, winProb }.
// `view` is what the player can see (engine.viewFor); the AI never reads the hidden hand.
import { CARDS, POOL_IDS } from "./cards.mjs";
import { LOCATION_IDS } from "./locations.mjs";
import * as E from "./engine.mjs";
import { BOARD_MODEL, RAW_MODEL } from "./calibration.mjs";

// ---------- shared: enumerate legal submissions ----------
// Returns an array of { plays: [{uid, li, target}], moves: [{uid, to}] }.
export function enumeratePlays(state, p, { limit = 300, rng = Math.random } = {}) {
  const hand = state.players[p].hand;
  const energy = state.players[p].energy;
  // single moves and single activates (the engine allows several; one per turn is enough for the search)
  const moveOptions = [{ moves: [], activates: [], delta: [0, 0, 0] }];
  for (let from = 0; from < 3; from++) for (const c of state.locations[from].cards[p]) {
    for (let to = 0; to < 3; to++) if (E.canMove(state, p, c, from, to)) { const delta = [0, 0, 0]; delta[from]--; delta[to]++; moveOptions.push({ moves: [{ uid: c.uid, to }], activates: [], delta }); }
    if (E.canActivate(state, p, c)) moveOptions.push({ moves: [], activates: [c.uid], delta: [0, 0, 0] });
  }
  // pairs of those (two moves, two Activates, or one of each), and every Activate at once
  const singles = moveOptions.slice(1);
  const legalCombo = (o) => { try { return E.validatePlays(state, p, [], o.moves, o.activates); } catch { return false; } };
  const combos = [];
  for (let a = 0; a < singles.length && combos.length < 12; a++) for (let b = a + 1; b < singles.length && combos.length < 12; b++) {
    const A = singles[a], B = singles[b];
    const uids = [...A.moves.map(m => m.uid), ...A.activates, ...B.moves.map(m => m.uid), ...B.activates];
    if (new Set(uids).size !== uids.length) continue;
    const o = { moves: [...A.moves, ...B.moves], activates: [...A.activates, ...B.activates], delta: A.delta.map((d, i) => d + B.delta[i]) };
    if (legalCombo(o)) combos.push(o);
  }
  const allActs = singles.flatMap(o => o.activates);
  if (allActs.length > 2) { const o = { moves: [], activates: allActs, delta: [0, 0, 0] }; if (legalCombo(o)) combos.push(o); }
  moveOptions.push(...combos);
  const maxPlays = E.maxPlaysFor(state, p);
  const forced = E.forcedFirstLoc(state, p);
  const out = [];
  for (const mo of moveOptions) {
    const added = [...mo.delta];
    out.push({ plays: [], moves: mo.moves, activates: mo.activates });
    // costs as they will be once this option's Activates have run (Black Swan and friends)
    let cs = state;
    if (mo.activates.length) { try { cs = E.previewActivates(state, p, mo.activates); } catch { cs = state; } }
    const costOf = (card) => { const c2 = cs === state ? card : cs.players[p].hand.find(c => c.uid === card.uid); return c2 ? E.effCost(cs, p, c2) : Infinity; };
    const budget = cs === state ? energy : Math.max(0, cs.players[p].energy);
    const rec = (start, left, acc) => {
      if (acc.length >= maxPlays) return;
      for (let i = start; i < hand.length; i++) {
        const card = hand[i];
        const cost = costOf(card);
        if (cost > left) continue;
        for (let li = 0; li < 3; li++) {
          if (!E.canPlayAt(state, li, p, card) || !E.hasRoom(state, li, p, added[li])) continue;
          if (acc.length === 0 && E.ldef(state, li).notFirstPlay) continue;
          if (acc.length === 0 && forced >= 0 && li !== forced && E.canPlayAt(state, forced, p, card)) continue;
          const def = CARDS[card.id];
          let targets = def.targets ? def.targets(state, p, li) : [null];
          if (targets.length === 0) targets = [null];
          for (const target of targets) {
            acc.push({ uid: card.uid, li, target }); added[li]++;
            // a set that leans on an Activate for its Energy has to pass the engine's own check
            let fine = true;
            if (cs !== state && acc.reduce((s, x) => s + E.effCost(state, p, hand.find(c => c.uid === x.uid)), 0) > energy) { try { fine = E.validatePlays(state, p, acc, mo.moves, mo.activates); } catch { fine = false; } }
            if (fine) out.push({ plays: [...acc], moves: mo.moves, activates: mo.activates });
            rec(i + 1, left - cost, acc);
            acc.pop(); added[li]--;
          }
        }
      }
    };
    rec(0, budget, []);
  }
  if (out.length <= limit) return out;
  const simple = (s) => s.plays.length <= 1 && s.moves.length === 0 && s.activates.length === 0;
  const keep = out.filter(simple);
  const rest = out.filter(s => !simple(s));
  for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
  return keep.concat(rest.slice(0, Math.max(0, limit - keep.length)));
}

// ---------- shared: board evaluation ----------
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
// Soft saturation: a 12-point lead is good, a 30-point lead is not much better, but never worthless.
export const leadScore = (lead) => 12 * Math.tanh(lead / 9) + (lead > 0 ? 6 : lead < 0 ? -6 : 0);
// Board-only score. Deliberately ignores state.over: when we simulate our own plays with the
// opponent passing, "ahead on turn 6" is not a win yet, the margin still matters.
export function evaluate(state, p) {
  let s = 0;
  for (let li = 0; li < 3; li++) {
    if (!E.locCounts(state, li)) continue;
    let lead = E.locPower(state, li, p) - E.locPower(state, li, 1 - p);
    if (E.ldef(state, li).leastWins) lead = -lead;
    s += leadScore(lead);
  }
  return s;
}
// Features the win-probability model sees. `eval` is the board score, `handDiff` the hand-size
// edge, `disc` the total energy discount sitting in our hand (Zabu, Sera, Quinjet...), `pow` the
// raw power in hand per remaining turn (what we can still put down).
export function features(view, p) {
  const me = view.players[p], opp = view.players[1 - p];
  let disc = 0, pow = 0;
  for (const c of me.hand) { disc += Math.max(0, CARDS[c.id].cost - E.effCost(view, p, c)); pow += Math.max(0, c.power); }
  const left = Math.max(0, E.finalTurn(view) - view.turn);
  return { eval: evaluate(view, p), handDiff: me.hand.length - opp.hand.length, disc, pow: pow / (left + 1), turn: view.turn, left };
}
// Per-turn logistic models fitted by fit.mjs from recorded games (calibrate.mjs). Turn 7 (Limbo) reuses turn 6.
const modelFor = (model, turn) => model[turn] ?? model[6] ?? null;
const applyModel = (m, f) => sigmoid(m.bias + Object.keys(m).reduce((s, k) => k === "bias" ? s : s + m[k] * f[k], 0));
export function heuristicWinProb(view, p) {
  const f = features(view, p);
  const m = modelFor(BOARD_MODEL, view.turn);
  if (m) return applyModel(m, f);
  const scale = 8 + 3 * Math.max(0, E.finalTurn(view) - view.turn);
  return sigmoid(f.eval / scale);
}
// Rollout's own estimate (average playout result) corrected by the fitted model, if there is one.
function calibratedRollout(view, p, raw) {
  const m = modelFor(RAW_MODEL, view.turn);
  if (!m) return raw;
  return applyModel(m, { ...features(view, p), raw: (raw - 0.5) * 2 });
}
// Cube policy. Retreat when the expected cubes from staying are worse than the retreat cost:
// staying is worth (2p-1) x the stake at the end (doubled once more if the final turn is still ahead),
// retreating costs the current stake (half of it on the final turn, which only doubles for players who stay).
export const POLICY = { snap: 0.62, retreatMargin: 0.05, snapFrom: 2 };
function pickAction(view, p, winProb, policy = POLICY) {
  const turn = view.turn, fin = E.finalTurn(view);
  const sEnd = view.stake * (turn < fin ? 2 : 1);
  const sRetreat = view.finalDoubled && turn >= fin ? view.stake / 2 : view.stake;
  if ((2 * winProb - 1) * sEnd < -sRetreat - policy.retreatMargin * sEnd) return "retreat";
  if (!view.snapped[p] && winProb > policy.snap && turn >= policy.snapFrom) return "snap";
  return "none";
}
const result = (sub, action, winProb, raw = winProb) => ({ plays: sub.plays, moves: sub.moves, activates: sub.activates ?? [], action, winProb, raw });

// ---------- tier 0: random ----------
export const randomAI = {
  name: "random",
  choose(view, p, rng = Math.random) {
    const sets = enumeratePlays(view, p, { rng });
    return result(sets[Math.floor(rng() * sets.length)], "none", 0.5);
  },
};

// ---------- tier 1: greedy (raw power, no effect simulation) ----------
export function greedyPlays(state, p, rng = Math.random, limit = 60) {
  const sets = enumeratePlays(state, p, { limit, rng });
  const mine = [0, 1, 2].map(li => E.locPower(state, li, p));
  const theirs = [0, 1, 2].map(li => E.locPower(state, li, 1 - p));
  let best = null, bestScore = -Infinity;
  for (const set of sets) {
    const add = [0, 0, 0];
    for (const pl of set.plays) add[pl.li] += state.players[p].hand.find(c => c.uid === pl.uid).power;
    for (const mv of set.moves) { const from = E.findCard(state, p, mv.uid); const c = state.locations[from].cards[p].find(c => c.uid === mv.uid); add[from] -= c.power; add[mv.to] += c.power; }
    for (const pl of state.known?.plays ?? []) { const c = state.players[1 - p].hand.find(c => c.uid === pl.uid); if (c) add[pl.li] -= c.power; }
    let s = 0;
    for (let li = 0; li < 3; li++) {
      if (!E.locCounts(state, li)) continue;
      let lead = mine[li] + add[li] - theirs[li];
      if (E.ldef(state, li).leastWins) lead = -lead;
      s += leadScore(lead);
    }
    s += 0.05 * set.plays.length;
    if (s > bestScore) { bestScore = s; best = set; }
  }
  return best;
}
export const greedyAI = {
  name: "greedy",
  choose(view, p, rng = Math.random) {
    const winProb = heuristicWinProb(view, p);
    return result(greedyPlays(view, p, rng), pickAction(view, p, winProb, this.policy), winProb);
  },
};

// ---------- tier 2: lookahead (simulate own plays incl. effects, opponent passes) ----------
function simulateOwn(view, p, sub) {
  const st = determinize(view, p, Math.random);
  const subs = [{ plays: [], moves: [], action: "none" }, { plays: [], moves: [], action: "none" }];
  subs[p] = { ...sub, action: "none" };
  if (view.known) subs[1 - p] = { ...view.known, action: "none" };   // Daredevil: the opponent's turn is known
  delete st.known;
  return E.resolveTurn(st, subs);
}
function orderings(sub) {
  if (sub.plays.length < 2) return [sub];
  return [sub, { ...sub, plays: [...sub.plays].reverse() }];
}
// Score of a simulated outcome. With `useModel`, the fitted board model's weights price the hand-side
// terms (cards drawn, energy discounts in hand) in board-score units; otherwise the old fixed weights.
function scoreOutcome(view, st, p, sub, useModel) {
  const drawn = st.players[p].hand.length - (view.players[p].hand.length - sub.plays.length);
  const m = useModel ? modelFor(BOARD_MODEL, Math.min(view.turn + 1, 6)) : null;
  if (!m || !m.eval) return evaluate(st, p) + 0.05 * sub.plays.length + 0.3 * drawn;
  const f = features(st, p);
  return f.eval + (m.handDiff * drawn + m.disc * f.disc) / m.eval + 0.05 * sub.plays.length;
}
export function makeLookaheadAI({ useModel = false } = {}) {
  return {
    name: useModel ? "lookahead_m" : "lookahead",
    choose(view, p, rng = Math.random) {
      const sets = enumeratePlays(view, p, { rng });
      let best = sets[0], bestScore = -Infinity;
      for (const set of sets) for (const sub of orderings(set)) {
        let st;
        try { st = simulateOwn(view, p, sub); } catch { continue; }
        const s = scoreOutcome(view, st, p, sub, useModel);
        if (s > bestScore) { bestScore = s; best = sub; }
      }
      const winProb = heuristicWinProb(view, p);
      return result(best, pickAction(view, p, winProb, this.policy), winProb);
    },
  };
}
export const lookaheadAI = makeLookaheadAI();

// ---------- tier 3: rollout (determinized Monte Carlo) ----------
// Fill in the hidden information with a random sample consistent with what we can see.
export function determinize(view, p, rng = Math.random) {
  const st = E.clone(view);
  const q = 1 - p;
  const opp = st.players[q];
  if (opp.hidden) {
    const shown = new Set();
    for (let li = 0; li < 3; li++) for (const c of st.locations[li].cards[q]) shown.add(c.id);
    const pool = POOL_IDS.filter(id => !shown.has(id));
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const hn = opp.hand.length, dn = opp.deck.length;
    let k = 0;
    const hand = opp.hand.map(c => c.id ? c : E.makeCard(pool[k++], q));   // cards we were shown (Daredevil) stay as they are
    pool.splice(0, k);
    const deck = pool.slice(0, dn).map(id => E.makeCard(id, q));
    st.players[q] = { ...opp, hidden: false, deck, hand };
  }
  // unrevealed locations are unknown too
  const used = new Set(st.locations.map(L => L.id).filter(Boolean));
  for (const L of st.locations) if (!L.id) {
    const opts = LOCATION_IDS.filter(id => !used.has(id));
    L.id = opts[Math.floor(rng() * opts.length)]; used.add(L.id);
  }
  // our own deck order is unknown
  const mine = st.players[p].deck;
  for (let i = mine.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [mine[i], mine[j]] = [mine[j], mine[i]]; }
  st.rng = Math.floor(rng() * 2 ** 32);
  delete st.viewer;
  return st;
}

function playoutFrom(state, rng) {
  let st = state;
  while (!st.over) {
    st = E.startTurn(st);
    const subs = [0, 1].map(q => ({ ...greedyPlays(st, q, rng, 40), action: "none" }));
    st = E.resolveTurn(st, subs);
  }
  return st;
}

export function makeRolloutAI({ samples = 16, candidates = 24 } = {}) {
  return {
    name: `rollout(${samples}x${candidates})`,
    choose(view, p, rng = Math.random) {
      let sets = enumeratePlays(view, p, { rng });
      if (sets.length > candidates) {
        const scored = sets.map(set => {
          let s = -Infinity;
          try { s = evaluate(simulateOwn(view, p, set), p); } catch { /* skip */ }
          return { set, s };
        }).sort((a, b) => b.s - a.s);
        sets = scored.slice(0, candidates).map(x => x.set);
      }
      let best = sets[0], bestAvg = -Infinity;
      for (const set of sets) {
        let total = 0, n = 0;
        for (let k = 0; k < samples; k++) {
          const st = determinize(view, p, rng);
          const subs = [null, null];
          subs[p] = { ...set, action: "none" };
          subs[1 - p] = view.known ? { ...view.known, action: "none" } : { ...greedyPlays(st, 1 - p, rng, 40), action: "none" };
          delete st.known;
          let end;
          try { end = playoutFrom(E.resolveTurn(st, subs), rng); } catch { continue; }
          const w = end.result.winner;
          total += w === -1 ? 0 : (w === p ? 1 : -1);
          n++;
        }
        const avg = n ? total / n : -Infinity;
        if (avg > bestAvg) { bestAvg = avg; best = set; }
      }
      const raw = bestAvg === -Infinity ? 0.5 : (bestAvg + 1) / 2;
      const winProb = calibratedRollout(view, p, raw);
      return result(best, pickAction(view, p, winProb, this.policy), winProb, raw);
    },
  };
}

// Agatha Harkness plays her owner's even turns. The real one is close to random; here the greedy tier stands in for her.
const withAgatha = (ai) => ai === greedyAI || ai === randomAI ? ai : { ...ai, choose(view, p, rng) { return E.agathaControls(view, p) || E.egoControls(view) ? greedyAI.choose(view, p, rng) : ai.choose.call(this, view, p, rng); } };
export const AIS = {
  random: randomAI,
  greedy: greedyAI,
  lookahead: withAgatha(lookaheadAI),
  lookahead_m: withAgatha(makeLookaheadAI({ useModel: true })),
  rollout: withAgatha(makeRolloutAI()),
  rollout_big: withAgatha(makeRolloutAI({ samples: 40, candidates: 40 })),
};
