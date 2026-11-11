// Snap rules engine, fourth pass: launch pool + Series 3/4/5 mechanics.
// State is plain JSON; startTurn / resolveTurn return new states. Effects are keyed by card/location id.
import { CARDS, POOL_IDS } from "./cards.mjs";
import { LOCATIONS, LOCATION_IDS } from "./locations.mjs";

export const DEFAULT_CAP = 4;
export const HAND_MAX = 7;
export const FRONT_ROW = 2; // the first two cards on a side are the front row, the rest the back row

// ---------- RNG ----------
function nextRand(state) {
  let t = (state.rng += 0x6D2B79F5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export function randInt(state, n) { return Math.floor(nextRand(state) * n); }
export function shuffle(state, arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = randInt(state, i + 1); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}
export const clone = (s) => JSON.parse(JSON.stringify(s));

// ---------- defs ----------
export const cdef = (card) => CARDS[card.id];
// Unrevealed locations behave as blank: their def only applies once revealed (cards can still be played, moved and added there).
export const ldef = (state, li) => {
  const L = state.locations[li];
  const d = (L.revealed && LOCATIONS[L.id]) || LOCATIONS.unknown;
  if (state.ignoreLocsUntil != null && state.turn <= state.ignoreLocsUntil && !d.noRandom) return { ...LOCATIONS.unknown, name: d.name };
  return d;
};
const live = (card) => !card.silenced && !card.hiddenUntilEnd;
const has = (card, k) => live(card) && !!cdef(card)[k];
// an Ongoing card's flag (Cosmo, Armor, Professor X, Goose...) is off at a location that disables Ongoing
const liveAt = (state, card, li, k) => {
  if (!live(card) || textDisabledAt(state, li)) return false;
  const def = cdef(card);
  if (def[k]) return !(def.kind === "ongoing" && ongoingDisabledAt(state, li));
  if (!def.mimicsEnemies && !def.mimicsCheap && !card.mimics) return false;
  return !ongoingDisabledAt(state, li) && mirrored(state, card, li, card.owner).some(m => m.kind === "ongoing" && m[k] === true);
};
export const isOngoing = (card) => cdef(card).kind === "ongoing";
export const isOnRevealCard = (def) => !!def.onReveal && /On Reveal/.test(def.text ?? "");
export const hasText = (card) => !!cdef(card).text;
export const cardName = (card) => card.alias ?? cdef(card).name;
export const cardText = (state, card) => cdef(card).dynText?.(card, state) ?? cdef(card).text;
// Player-wide rules that a Game Start card switched on (Sinister Six, Thanos Fractured Frontier): pl.rules holds card ids
// whose defs carry ruleOnDraw / ruleBeforeReveal / ruleAfterPlay.
function rules(state, h, p, k, ...args) { for (const id of state.players[p].rules ?? []) CARDS[id][k]?.({ state, p, h }, ...args); }
// Agatha Harkness plays her owner's even turns; Daredevil shows his owner the opponent's turn-5 plays.
export const agathaControls = (state, p) => !!state.players[p].agatha && state.turn % 2 === 0;
// Ego: while it is revealed, both players' turns are played for them.
export const egoControls = (state) => state.locations.some((L, li) => !!ldef(state, li).ego);
const hasDaredevil = (state, p) => state.turn === 5 && state.locations.some((L, li) => L.cards[p].some(c => liveAt(state, c, li, "seesPlays")));
export const seesPlays = (state, p) => hasDaredevil(state, p) && !hasDaredevil(state, 1 - p);
// the card a player's next ordinary draw would take
export const topOfDeck = (state, p) => { const d = state.players[p].deck; return (state.turn === 1 && d.find(c => cdef(c).drawRule === "turn2")) || d.find(c => cdef(c).drawRule !== "turn2") || null; };

// ---------- setup ----------
let uidCounter = 0;
export function makeCard(id, owner, over = {}) {
  const def = CARDS[id];
  if (!def) throw new Error(`unknown card ${id}`);
  const c = { id, uid: `${id}#${owner}#${++uidCounter}`, owner, cost: def.cost, power: def.power, basePower: def.power, silenced: false, moved: false, moveCount: 0, created: false, activated: false, buffed: 0, afflicted: 0, stolen: 0, ...over };
  if (over.power != null && over.basePower == null) c.basePower = over.power;
  return c;
}
const newPlayer = (deck) => ({
  deck, hand: [], energy: 0, energyNext: 0, maxEnergyBonus: 0, unspentLastTurn: 0, horde: 0,
  nextCardBuff: 0, nextCardMoveLeft: false, nextCardSilence: false, nextCardMoveRight: false, nextCardPower: null, nextCardSpell: false, kidOmega: false,
  shuriLi: null, lockjaw: false, lastPlayed: null, lastPlayedPrev: null, zeroCostOnes: null, quicksand: false, moveableTo: null,
  playedLastTurn: false, playedThisTurn: [0, 0, 0], playedCards: [[], [], []], lastPlayedTurnAt: [0, 0, 0],
  playedCount: 0, playedCountLast: 0, spentAllTurns: 0, unspentTurns: 0, unspentStreak: 0, discardTurns: [], movesThisGame: 0, moveablePlayed: 0, galactaTurn: 0,
});

export function createGame({ decks, seed = 1, locationIds = null }) {
  const state = {
    rng: seed >>> 0, turn: 0, maxTurn: 6, endAfter: null, finalDoubled: false, stake: 1, snapped: [false, false],
    over: false, result: null, log: [], destroyed: [0, 0], destroyedPower: 0, discards: [0, 0], discardPile: [[], []], destroyedPile: [[], []], destroyedAt: [[0, 0, 0], [0, 0, 0]],
    pending: [], costModTurn: null, waveUntil: null, cloak: null, noRetreatAfter: null, movedThisTurn: false, movedLastTurn: false, noRevealTurn: null,
    players: decks.map((ids, p) => ({ ...newPlayer(ids.map(id => makeCard(id, p))), startDeck: [...ids], createdCostPlayed: 0, twoPlusTurns: 0 })),
    locations: [],
  };
  for (const pl of state.players) shuffle(state, pl.deck);
  const ids = locationIds ?? shuffle(state, [...LOCATION_IDS]).slice(0, 3);
  state.locations = ids.map(id => ({ id, revealed: false, cards: [[], []], closedAfter: null, flags: {} }));
  const h = makeHelpers(state);
  for (let p = 0; p < 2; p++) for (const c of [...state.players[p].deck]) if (has(c, "gameStart")) cdef(c).gameStart({ state, p, card: c, h });
  for (let p = 0; p < 2; p++) {
    const pl = state.players[p];
    for (let i = pl.deck.length - 1; i >= 0; i--) if (cdef(pl.deck[i]).drawRule === "opening") { const c = pl.deck.splice(i, 1)[0]; pl.hand.push(c); rules(state, h, p, "ruleOnDraw", c); }
    while (pl.hand.length < 3 && pl.deck.length) drawCard(state, p);
    for (let i = pl.deck.length - 1; i >= 0; i--) if (cdef(pl.deck[i]).drawRule === "extra") { const c = pl.deck.splice(i, 1)[0]; pl.hand.push(c); rules(state, h, p, "ruleOnDraw", c); }
    pl.hand.push(...(pl.startExtras ?? [])); delete pl.startExtras;
    pl.openingHand = pl.hand.map(c => c.id);
  }
  return state;
}

// ---------- low-level helpers ----------
function drawCard(state, p, pred = null) {
  const pl = state.players[p];
  if (pl.hand.length >= HAND_MAX) return null;
  if (pl.hand.some(c => has(c, "blocksDraw"))) return null;   // Widow's Bite
  if (pl.copyNextDraw && pl.lastDrawn) {   // Time Theater: this draw is a copy of the last card drawn instead
    pl.copyNextDraw = false;
    const src = [...pl.hand, ...pl.deck, ...state.locations.flatMap(L => L.cards[p])].find(c => c.uid === pl.lastDrawn.uid);
    const copy = makeCard(pl.lastDrawn.id, p, { created: true, ...(src && src.id === pl.lastDrawn.id ? { cost: src.cost, power: src.power } : {}) });
    makeHelpers(state).addToHand(p, copy);
    return copy;
  }
  let idx = -1;
  if (pred) idx = pl.deck.findIndex(pred);
  else {
    const dom = pl.deck.findIndex(c => cdef(c).drawRule === "turn2");
    if (state.turn === 2 && dom >= 0) idx = dom;
    else idx = pl.deck.findIndex(c => cdef(c).drawRule !== "turn2");
  }
  if (idx < 0) return null;
  const [card] = pl.deck.splice(idx, 1);
  card.drawnTurn = state.resolving ? state.turn + 1 : state.turn;
  pl.hand.push(card);
  pl.lastDrawn = { id: card.id, uid: card.uid };
  const h = makeHelpers(state);
  rules(state, h, p, "ruleOnDraw", card);
  if (has(card, "onDrawn")) cdef(card).onDrawn({ state, p, card, h });
  for (let li = 0; li < 3; li++) for (const o of state.locations[li].cards[p]) if (liveAt(state, o, li, "onAnyDraw")) cdef(o).onAnyDraw({ state, p, li, card: o, h }, card);
  return card;
}
export function locCap(state, li) { return ldef(state, li).cap ?? DEFAULT_CAP; }
const stagedAt = (state, li, p) => { let n = 0; for (const e of state.turnQueue?.[p] ?? []) if (e.li === li && !cdef(e.card).skill) n++; return n; };
export function hasRoom(state, li, p, extra = 0) {
  return state.locations[li].cards[p].length + stagedAt(state, li, p) + extra < locCap(state, li);
}
function anyAt(state, li, flag, owner = null) {
  for (let q = 0; q < 2; q++) {
    if (owner !== null && q !== owner) continue;
    for (const c of state.locations[li].cards[q]) if (liveAt(state, c, li, flag)) return true;
  }
  return false;
}
function flagFns(state, o, l, k) {
  if (!live(o) || textDisabledAt(state, l)) return [];
  const def = cdef(o), out = [];
  if (def[k] && !(def.kind === "ongoing" && ongoingDisabledAt(state, l))) out.push(def[k]);
  if ((def.mimicsEnemies || def.mimicsCheap || o.mimics) && !ongoingDisabledAt(state, l)) for (const m of mirrored(state, o, l, o.owner)) if (m.kind === "ongoing" && typeof m[k] === "function") out.push(m[k]);
  return out;
}
function boardHas(state, p, flag) {
  for (let li = 0; li < 3; li++) for (const c of state.locations[li].cards[p]) if (liveAt(state, c, li, flag)) return true;
  return false;
}
export function locked(state, li) { return anyAt(state, li, "locks"); }
export function revealBlocked(state, li) { return anyAt(state, li, "blocksReveal") || !!ldef(state, li).noReveal; }
export function ongoingDisabledAt(state, li) { return !!ldef(state, li).noOngoing; }
export function textDisabledAt(state, li) { return !!ldef(state, li).noText; }
export const isFrontRow = (state, li, p, card) => state.locations[li].cards[p].findIndex(c => c.uid === card.uid) < FRONT_ROW;

const MIN1_DISCOUNTS = new Set(["Sera", "Quinjet", "RavonnaRenslayer"]);   // their text says "(minimum 1)"
let min1Fns = null;
const MIN1_FNS = () => min1Fns ?? (min1Fns = new Set([...MIN1_DISCOUNTS].map(id => CARDS[id]?.handCostMod).filter(Boolean)));
// A card's Power as it should read in hand: Ongoing effects that reach a card "wherever it is" (the Power Stone).
export function handPower(state, p, card) {
  let pw = card.power;
  for (let li = 0; li < 3; li++) for (const o of state.locations[li].cards[p]) for (const f of flagFns(state, o, li, "anywhereBonus")) pw += f(state, p, card);
  return pw;
}
export function effCost(state, p, card) {
  const def = cdef(card);
  let base = card.cost, inc = 0, dec = 0, decMin1 = 0;
  if (live(card) && def.costMod) { const d = def.costMod(state, p, card); if (d > 0) inc += d; else dec -= d; }
  if (card.discountTurn === state.turn) dec += 1;
  if (state.costModTurn === state.turn && base < 6) inc += 1;
  const pl = state.players[p];
  if (pl.zeroCostOnes != null && state.turn <= pl.zeroCostOnes && base === 1) dec += 1;
  for (let li = 0; li < 3; li++) {
    if (!state.locations[li].revealed) continue;
    const d = ldef(state, li);
    if (d.costMod) { const x = d.costMod(state, p, card); if (x > 0) inc += x; else dec -= x; }
    if (ongoingDisabledAt(state, li)) continue;
    for (const o of state.locations[li].cards[p]) for (const f of flagFns(state, o, li, "handCostMod")) { const x = f(state, p, card); if (x > 0) inc += x; else if (MIN1_FNS().has(f)) decMin1 -= x; else dec -= x; }
    for (const o of state.locations[li].cards[1 - p]) for (const f of flagFns(state, o, li, "oppHandCostMod")) { const x = f(state, p, card); if (x > 0) inc += x; else dec -= x; }
  }
  if (decMin1 > 0) dec += Math.min(decMin1, Math.max(0, base + inc - dec - 1));   // "(minimum 1)" discounts
  if (live(card) && def.doubleDiscounts) dec *= 2;
  if (boardHas(state, p, "mobius")) inc = 0;
  if (boardHas(state, 1 - p, "mobius")) dec = 0;
  let c = base + inc - dec;
  if (state.waveUntil != null && state.turn <= state.waveUntil) c = Math.min(c, 4);
  return Math.max(0, c);
}

export function canPlayAt(state, li, p, card = null) {
  const L = state.locations[li];
  const free = (card && has(card, "anywhere")) || boardHas(state, p, "playAnywhere") || (card && card.id === "Thanos" && boardHas(state, p, "freesThanos"));
  if (!free) {
    if (L.closedAfter != null && state.turn > L.closedAfter) return false;
    const d = ldef(state, li);
    if (d.canPlay && !d.canPlay(state, li, p, card)) return false;
    if (locked(state, li) && !(card && cdef(card).skill)) return false;   // Professor X ignores skills completely
    if (anyAt(state, li, "blocksPlays", p)) return false;
    for (let l = 0; l < 3; l++) if (l !== li && state.locations[l].revealed && ldef(state, l).mustPlay?.(state, l, p)) return false;
    if (card) for (let q = 0; q < 2; q++) for (const o of L.cards[q]) if (liveAt(state, o, li, "blocksPlayHere") && cdef(o).blocksPlayHere(state, li, p, card)) return false;
  }
  if (card) {
    const cd = cdef(card);
    if (card.lockedTurn === state.turn) return false;
    if (live(card) && cd.canPlayCard && !cd.canPlayCard(state, p, card)) return false;
    if (live(card) && cd.canPlayAtLoc && !free && !cd.canPlayAtLoc(state, p, li, card)) return false;
  }
  return true;
}
export function maxPlaysFor(state, p) {
  let m = 99;
  for (let l = 0; l < 3; l++) if (state.locations[l].revealed) m = Math.min(m, ldef(state, l).maxPlays?.(state, l) ?? 99);
  for (let l = 0; l < 3; l++) for (const o of state.locations[l].cards[p]) if (liveAt(state, o, l, "maxPlays")) m = Math.min(m, cdef(o).maxPlays);
  return m;
}
export function forcedFirstLoc(state, p) {
  for (let l = 0; l < 3; l++) if (anyAt(state, l, "forcesFirstPlay") && canPlayAt(state, l, p) && hasRoom(state, l, p)) return l;
  return -1;
}
function additionsBlocked(state) { return boardHas(state, 0, "blocksAdditions") || boardHas(state, 1, "blocksAdditions"); }

export function makeHelpers(state) {
  const log = (m) => state.log.push(m);
  const h = {
    state, log, def: cdef, isOngoing, hasText, name: cardName,
    rand: () => nextRand(state), randInt: (n) => randInt(state, n), pick: (arr) => arr.length ? arr[randInt(state, arr.length)] : null,
    shuffle: (arr) => shuffle(state, arr),
    cards: (p, li) => state.locations[li].cards[p],
    others: (p, li, card) => state.locations[li].cards[p].filter(c => c.uid !== card.uid),
    board: (p = null) => { const out = []; for (let q = 0; q < 2; q++) if (p === null || q === p) for (let l = 0; l < 3; l++) for (const c of state.locations[l].cards[q]) out.push({ card: c, li: l, p: q }); return out; },
    where: (uid) => { for (let q = 0; q < 2; q++) for (let l = 0; l < 3; l++) if (state.locations[l].cards[q].some(c => c.uid === uid)) return { li: l, p: q }; return null; },
    find: (uid) => { for (let q = 0; q < 2; q++) for (let l = 0; l < 3; l++) { const c = state.locations[l].cards[q].find(c => c.uid === uid); if (c) return c; } return null; },
    hasRoom: (p, li) => hasRoom(state, li, p),
    cap: (li) => locCap(state, li),
    otherLocs: (li, p = null) => [0, 1, 2].filter(l => l !== li && (p === null || hasRoom(state, l, p))),
    openLocs: (p) => [0, 1, 2].filter(l => hasRoom(state, l, p)),
    frontRow: (p, li) => state.locations[li].cards[p].slice(0, FRONT_ROW),
    backRow: (p, li) => state.locations[li].cards[p].slice(FRONT_ROW),
    make: (id, p, over) => makeCard(id, p, { created: true, ...over }),
    // every power change goes through here so affliction, empowerment and their listeners are tracked
    addPower: (card, n) => {
      if (n === 0) return;
      if (n < 0) {
        const w = h.where(card.uid);
        if ((w ? liveAt(state, card, w.li, "cantReduce") : has(card, "cantReduce") && cdef(card).kind !== "ongoing") || (w && boardHas(state, card.owner, "protectsReduce") && isFrontRow(state, w.li, card.owner, card))) return;
        if (w && ldef(state, w.li).doubleChanges) n *= 2;
        card.power += n; card.afflicted += -n;
        return;
      }
      const w = h.where(card.uid);
      if (w && liveAt(state, card, w.li, "doublesIncreases")) n *= 2;
      if (w && ldef(state, w.li).doubleChanges) n *= 2;
      if (w && boardHas(state, card.owner, "venus")) n += 1;
      card.power += n; card.buffed += n;
      if (has(card, "onEmpowered") && (w || state.players[card.owner].hand.some(c => c.uid === card.uid) || (cdef(card).empoweredInDeck && state.players[card.owner].deck.some(c => c.uid === card.uid)))) cdef(card).onEmpowered({ state, p: card.owner, li: w ? w.li : -1, card, h }, n);
    },
    steal: (from, to, n) => { const before = from.power; h.addPower(from, -n); const taken = before - from.power; if (taken > 0) { h.addPower(to, taken); to.stolen += taken; } return taken; },
    draw: (p, n = 1, pred = null) => { let last = null; for (let i = 0; i < n; i++) last = drawCard(state, p, pred) ?? last; return last; },
    addToHand: (p, card) => {
      if (state.players[p].hand.length >= HAND_MAX) return false;
      card.owner = p;
      if (card.created && !card.spawned && card.playedTurn == null) card.createdInHand = true;
      state.players[p].hand.push(card);
      for (const { card: o, li } of h.board(p)) if (liveAt(state, o, li, "onHandAdded")) cdef(o).onHandAdded({ state, p, li, card: o, h }, card);
      return true;
    },
    place: (p, li, card) => {
      if (cdef(card).skill) return false;
      if (!hasRoom(state, li, p) || locked(state, li) || additionsBlocked(state) || ldef(state, li).noAdd?.(state, li)) return false;
      card.owner = p; state.locations[li].cards[p].push(card); return true;
    },
    spawn: (id, p, li, over = {}) => {
      if (!CARDS[id] || CARDS[id].skill) return null;
      if (!hasRoom(state, li, p) || locked(state, li) || additionsBlocked(state) || ldef(state, li).noAdd?.(state, li)) return null;
      const c = makeCard(id, p, { created: true, spawned: true, spawnedTurn: state.turn, ...over });
      if (ldef(state, li).createdBonus) c.power += ldef(state, li).createdBonus;
      state.locations[li].cards[p].push(c);
      return c;
    },
    banish: (p, card) => { // leave the game from the hand, deck or board
      const pl = state.players[p];
      for (const zone of [pl.hand, pl.deck]) { const i = zone.findIndex(c => c.uid === card.uid); if (i >= 0) { zone.splice(i, 1); return true; } }
      const w = h.where(card.uid); if (w) { h.remove(w.p, w.li, card.uid); return true; }
      return false;
    },
    discard: (p, card) => {
      const hand = state.players[p].hand;
      const i = hand.findIndex(c => c.uid === card.uid);
      if (i < 0) return false;
      for (let l = 0; l < 3; l++) for (const o of state.locations[l].cards[p]) if (flagFns(state, o, l, "protectsDiscard").some(f => f(card))) return false;
      hand.splice(i, 1);
      state.discards[p]++;
      state.discardPile[p].push(card);
      const pl = state.players[p];
      if (!pl.discardTurns.includes(state.turn)) pl.discardTurns.push(state.turn);
      log(`P${p} discards ${cardName(card)}`);
      if (live(card)) cdef(card).onDiscarded?.({ state, p, card, h });
      for (const { card: o, li } of h.board(p)) if (liveAt(state, o, li, "onAnyDiscarded")) cdef(o).onAnyDiscarded({ state, p, li, card: o, h }, card);
      for (const o of pl.hand) if (has(o, "onAnyDiscardedInHand")) cdef(o).onAnyDiscardedInHand({ state, p, card: o, h }, card);
      return true;
    },
    destroy: (p, li, uid, { force = false } = {}) => {
      const arr = state.locations[li].cards[p];
      const i = arr.findIndex(c => c.uid === uid);
      if (i < 0) return false;
      const card = arr[i];
      if (!force) {
        if (liveAt(state, card, li, "cantDestroy") || anyAt(state, li, "blocksDestroy") || ldef(state, li).noDestroy || locked(state, li)) return false;
        for (let l = 0; l < 3; l++) for (const o of state.locations[l].cards[p]) if (flagFns(state, o, l, "protectsDestroy").some(f => f(card))) return false;
      }
      arr.splice(i, 1);
      state.destroyed[p]++;
      state.destroyedPower += card.power;
      state.destroyedPile[p].push(card);
      state.destroyedAt[p][li]++;
      card.destroyedTurn = state.turn;
      log(`${cardName(card)} is destroyed`);
      const ctx = { state, p, li, card, h };
      if (live(card) && !textDisabledAt(state, li)) cdef(card).onDestroyed?.(ctx);
      ldef(state, li).onDestroyedHere?.(ctx);
      for (const { card: o, li: l } of h.board(p)) if (liveAt(state, o, l, "onAnyDestroyed")) cdef(o).onAnyDestroyed({ state, p, li: l, card: o, h }, card, li);
      for (const { card: o, li: l } of h.board(1 - p)) if (liveAt(state, o, l, "onEnemyDestroyed")) cdef(o).onEnemyDestroyed({ state, p: 1 - p, li: l, card: o, h }, card, li);
      const pl = state.players[p];
      for (const zone of [pl.hand, pl.deck]) {
        const ai = zone.findIndex(c => has(c, "flies"));
        if (ai >= 0 && hasRoom(state, li, p) && !locked(state, li)) { const [angel] = zone.splice(ai, 1); state.locations[li].cards[p].push(angel); log(`${cardName(angel)} flies in`); break; }
      }
      return true;
    },
    remove: (p, li, uid) => {
      const arr = state.locations[li].cards[p];
      const i = arr.findIndex(c => c.uid === uid);
      if (i < 0) return null;
      return arr.splice(i, 1)[0];
    },
    returnToHand: (p, li, card) => { if (state.players[p].hand.length >= HAND_MAX) return false; const c = h.remove(p, li, card.uid); if (!c) return false; c.activated = false; c.ownMoves = 0; h.addToHand(p, c); if (has(c, "onReturned")) cdef(c).onReturned({ state, p, card: c, h }); return true; },
    merge: (src, into) => { // src disappears, its power joins `into`
      const w = h.where(src.uid); if (!w) return false;
      h.remove(w.p, w.li, src.uid); into.power += src.power;
      log(`${cardName(src)} merges into ${cardName(into)}`);
      if (has(into, "onMerged")) cdef(into).onMerged({ state, p: into.owner, li: h.where(into.uid)?.li ?? -1, card: into, h }, src);
      if (has(src, "onMergedAway")) cdef(src).onMergedAway({ state, p: src.owner, card: src, h }, into);
      return true;
    },
    transform: (card, id, { keepPower = false } = {}) => { if (!CARDS[id] || (CARDS[id].skill && h.where(card.uid))) return false; card.id = id; card.cost = CARDS[id].cost; if (!keepPower) card.power = CARDS[id].power; delete card.alias; card.silenced = false; },
    move: (p, from, to, card, { force = false } = {}) => {
      if (from === to || to < 0 || to > 2) return false;
      if (has(card, "anywhere")) force = true;
      if (!hasRoom(state, to, p) || (!force && ldef(state, to).noAdd?.(state, to))) return false;
      if (!force && (liveAt(state, card, from, "cantMove") || ldef(state, from).noMoveOut || anyAt(state, from, "jailsEnemies", 1 - p))) return false;
      const src = state.locations[from].cards[p];
      const i = src.findIndex(c => c.uid === card.uid);
      if (i < 0) return false;
      src.splice(i, 1);
      state.locations[to].cards[p].push(card);
      card.moved = true; card.moveCount++; card.movedTurn = state.turn; card.prevLoc = from;
      state.movedThisTurn = true; state.players[p].movesThisGame++; state.players[p].lastMoved = card.uid;
      log(`${cardName(card)} moves to ${ldef(state, to).name}`);
      if (liveAt(state, card, to, "onSelfMoved")) cdef(card).onSelfMoved({ state, p, li: to, card, h }, from);
      for (let q = 0; q < 2; q++) for (const o of [...state.locations[to].cards[q]]) if (o.uid !== card.uid && liveAt(state, o, to, "onMoveHere")) cdef(o).onMoveHere({ state, p: q, li: to, card: o, h }, card);
      for (const { card: o, li: l } of h.board(p)) if (o.uid !== card.uid && liveAt(state, o, l, "onAnyMove")) cdef(o).onAnyMove({ state, p, li: l, card: o, h }, card, from, to);
      for (const { card: o, li: l, p: q } of h.board()) if (o.uid !== card.uid && liveAt(state, o, l, "onAnyCardMove")) cdef(o).onAnyCardMove({ state, p: q, li: l, card: o, h }, card, p, from, to);
      ldef(state, to).onMoveHere?.({ state, p, li: to, card, h });
      return true;
    },
    switchSides: (li, card) => {
      const w = h.where(card.uid); if (!w || w.li !== li) return false;
      const q = 1 - w.p;
      if (!hasRoom(state, li, q)) return false;
      h.remove(w.p, li, card.uid); card.owner = q; state.locations[li].cards[q].push(card);
      log(`${cardName(card)} switches sides`); return true;
    },
    silence: (card) => { card.silenced = true; },
    horde: (p, n, li = null) => {
      state.players[p].horde += n;
      const all = h.board(p).filter(x => x.card.id === "ZombieHorde").map(x => x.card);
      let hc = all[0];
      if (all.length > 1) { if (n > 0) for (const c of all) h.addPower(c, n); return all.reduce((a, b) => b.power > a.power ? b : a); }
      if (!hc) {
        const l = [li, 0, 1, 2].find(l => l != null && hasRoom(state, l, p) && !locked(state, l));
        if (l == null) return null;
        hc = h.spawn("ZombieHorde", p, l);
        if (!hc) return null;
        log(`P${p} raises a Zombie Horde`);
      }
      if (n > 0) h.addPower(hc, n);
      return hc;
    },
    randomCharId: (pred = () => true) => h.pick(POOL_IDS.filter(id => !CARDS[id].skill && pred(CARDS[id]))),
    // a destroyed location takes its cards with it
    ruin: (li) => {
      for (let q = 0; q < 2; q++) for (const c of [...state.locations[li].cards[q]]) h.destroy(q, li, c.uid, { force: true });
      h.replaceLocation(li, "Ruins");
    },
    canPlace: (p, li) => hasRoom(state, li, p) && !locked(state, li) && !additionsBlocked(state) && !ldef(state, li).noAdd?.(state, li),
    effCost: (p, card) => effCost(state, p, card),
    replaceLocation: (li, id = null) => {
      const used = new Set(state.locations.map(L => L.id));
      const pool = LOCATION_IDS.filter(x => !used.has(x) && !LOCATIONS[x].noRandom);
      const nid = id ?? h.pick(pool);
      if (!nid) return;
      state.locations[li] = { ...state.locations[li], id: nid, closedAfter: null, flags: {}, revealed: true };
      log(`Location becomes ${LOCATIONS[nid].name}`);
      LOCATIONS[nid].onReveal?.(state, li, h);
    },
    triggerLocation: (li) => { const L = state.locations[li]; const d = LOCATIONS[L.id]; if (L.revealed && d && !d.onFlaggedPlay) d.onReveal?.(state, li, h); },
    swapLocations: (a, b) => {
      const t = state.locations[a]; state.locations[a] = state.locations[b]; state.locations[b] = t;
      const re = (x) => x === a ? b : x === b ? a : x;
      for (const pl of state.players) {
        for (const k of ["playedThisTurn", "playedCards", "lastPlayedTurnAt"]) { const arr = pl[k]; [arr[a], arr[b]] = [arr[b], arr[a]]; }
        if (pl.shuriLi != null) pl.shuriLi = re(pl.shuriLi);
        if (pl.moveableTo) pl.moveableTo.li = re(pl.moveableTo.li);
      }
      for (const q of state.turnQueue ?? []) for (const e of q) e.li = re(e.li);
      for (const x of state.pending ?? []) if (x.li != null) x.li = re(x.li);
      if (state.cloak) state.cloak.li = re(state.cloak.li);
    },
    randomPoolId: (pred = () => true) => h.pick(POOL_IDS.filter(id => pred(CARDS[id]))),
    playCard: (p, li, card, target = null) => revealCard(state, h, p, li, card, { target, fromHand: false }),
    revealAgain: (p, li, card) => runOnReveal(state, h, p, li, card, null),
    // run another card's On Reveal text as if `card` had it
    useReveal: (id, p, li, card) => { const d = CARDS[id]; if (d?.onReveal) d.onReveal({ state, p, li, card, target: null, h, quickdraw: false }); },
    copyText: (card, fromId) => { if (!CARDS[fromId] || (CARDS[fromId].skill && h.where(card.uid))) return false; card.alias = card.alias ?? cdef(card).name; card.id = fromId; },
    locPower: (li, p) => locPower(state, li, p),
    cardPower: (li, p, card) => cardPower(state, li, p, card),
    winnerAt: (li) => winnerAt(state, li),
    leader: () => leader(state),
    endGame: () => { state.endAfter = state.turn; },
    playedThisTurnBy: (q) => {
      const out = [];
      for (const x of h.board(q)) if (x.card.playedTurn === state.turn) out.push({ card: x.card, li: x.li, revealed: true });
      for (const e of (state.turnQueue?.[q] ?? [])) out.push({ card: e.card, li: e.li, revealed: false, entry: e });
      return out;
    },
    highestPowerInPlay: () => { let mx = -Infinity, who = -1; for (const x of h.board()) { const pw = h.cardPower(x.li, x.p, x.card); if (pw > mx) { mx = pw; who = x.p; } else if (pw === mx && x.p !== who) who = -1; } return { power: mx, owner: who }; },
  };
  return h;
}

const revealing = new Set();
function runOnReveal(state, h, p, li, card, target) {
  const key = card.uid + ":" + card.id;   // a card that copied another text may run the copied On Reveal
  if (revealing.has(key)) return;
  revealing.add(key);
  try { runOnRevealInner(state, h, p, li, card, target); } finally { revealing.delete(key); }
}
function runOnRevealInner(state, h, p, li, card, target) {
  const def = cdef(card);
  if (!def.onReveal || !live(card) || textDisabledAt(state, li) || revealBlocked(state, li)) return;
  let times = ldef(state, li).repeatReveal ? 2 : 1;
  for (const o of state.locations[li].cards[p]) if (o.uid !== card.uid && liveAt(state, o, li, "repeatsReveals")) times++;
  if (card.cost === 1) for (const o of state.locations[li].cards[p]) if (o.uid !== card.uid && liveAt(state, o, li, "repeatsOneCostReveals")) times++;
  const quickdraw = card.drawnTurn === state.turn;
  for (let k = 0; k < times; k++) {
    const w = h.where(card.uid);
    if (!w) return;
    def.onReveal({ state, p: w.p, li: w.li, card, target, h, quickdraw });
  }
}

// Place a card and run the whole reveal sequence. Returns the card's location or -1.
function revealCard(state, h, p, li, card, { target = null, fromHand = true } = {}) {
  const pl = state.players[p];
  const L = state.locations[li];
  const d = ldef(state, li);
  const def = cdef(card);
  card.owner = p; card.playedTurn = state.turn;
  if (!def.skill && locCap(state, li) === 0) { state.destroyedPile[p].push(card); state.log.push(`${cardName(card)} is lost with ${d.name}`); return -1; }
  if (def.skill) { // skills resolve and leave the game
    state.log.push(`P${p} plays ${cardName(card)} at ${d.name}`);
    if (fromHand) rules(state, h, p, "ruleBeforeReveal", card, li);
    if (live(card) && def.onReveal && !textDisabledAt(state, li) && !revealBlocked(state, li)) def.onReveal({ state, p, li, card, target, h, quickdraw: card.drawnTurn === state.turn });
    for (const { card: o, li: l } of h.board(p)) if (liveAt(state, o, l, "afterSkill")) cdef(o).afterSkill({ state, p, li: l, card: o, h }, card);
    for (const { card: o, li: l } of h.board(p)) { if (l === li && liveAt(state, o, l, "afterPlayHere")) cdef(o).afterPlayHere({ state, p, li: l, card: o, h }, card); if (liveAt(state, o, l, "afterPlayAny")) cdef(o).afterPlayAny({ state, p, li: l, card: o, h }, card, li); }
    pl.playedCount++;
    if (card.created) pl.createdPlayed = (pl.createdPlayed ?? 0) + 1;
    rules(state, h, p, "ruleAfterPlay", card, li);
    return -1;
  }
  L.cards[p].push(card);
  state.log.push(`P${p} plays ${cardName(card)} at ${d.name}`);
  pl.playedCount++;
  (pl.playedIds = pl.playedIds ?? []).push(card.id);
  if (def.moveable) pl.moveablePlayed++;
  if (card.created) { pl.createdCostPlayed = (pl.createdCostPlayed ?? 0) + card.cost; pl.createdPlayed = (pl.createdPlayed ?? 0) + 1; }
  if (fromHand) {
    if (pl.nextCardBuff) { h.addPower(card, pl.nextCardBuff); pl.nextCardBuff = 0; }
    if (pl.nextCardPower != null) { card.power = pl.nextCardPower; pl.nextCardPower = null; }
    if (pl.nextCardSilence) { card.silenced = true; pl.nextCardSilence = false; }
    if (pl.shuriLi != null) { if (pl.shuriLi === li) card.power *= 2; pl.shuriLi = null; }
    if (d.revealBonus) card.power += d.revealBonus;
    for (const o of L.cards[p]) if (o.uid !== card.uid && liveAt(state, o, li, "revealBonusHere")) h.addPower(card, cdef(o).revealBonusHere);
    // Galacta: the first card you play at a location other than hers each turn reveals with +2
    if (pl.galactaTurn !== state.turn) for (const { card: g, li: gl } of h.board(p)) if (liveAt(state, g, gl, "galacta") && gl !== li) { h.addPower(card, 2); pl.galactaTurn = state.turn; break; }
    // Elsa Bloodstone: a card that fills your side gains +2
    if (L.cards[p].length >= locCap(state, li) && boardHas(state, p, "elsa")) h.addPower(card, 2);
  }
  const nx = fromHand ? { left: pl.nextCardMoveLeft, right: pl.nextCardMoveRight, spell: pl.nextCardSpell, to: pl.nextCardMoveTo } : {};
  if (fromHand) { pl.nextCardMoveLeft = false; pl.nextCardMoveRight = false; pl.nextCardSpell = false; pl.nextCardMoveTo = null; rules(state, h, p, "ruleBeforeReveal", card, li); }
  if (fromHand) d.beforeReveal?.({ state, p, li, card, h });   // locations that change a card as it is played (Black Vortex, Josie's Bar, Dark Dimension)
  // P. cards held face down (Supergiant, Invisible Woman) reveal at the end of the game
  if (fromHand && (state.noRevealTurn === state.turn || L.cards[p].some(o => o.uid !== card.uid && liveAt(state, o, li, "hidesPlays")))) { card.hiddenUntilEnd = true; state.log.push(`${cardName(card)} stays face down`); }
  runOnReveal(state, h, p, li, card, target);
  // Vormir, Castle Zemo, Aunt May's: the charge is spent only on a card that is still there after its On Reveal
  if (fromHand) { const L2 = state.locations[li], w = h.where(card.uid); if (L2.flags.nextPlay?.[p] && w && w.li === li && w.p === p) { const f = L2.flags.nextPlay[p]; L2.flags.nextPlay[p] = null; ldef(state, li).onFlaggedPlay?.({ state, p, li, card, h }, f); } }
  if (h.where(card.uid)) d.afterPlay?.({ state, p, li, card, h });
  for (const { card: o, li: l } of h.board(p)) {
    if (o.uid === card.uid) continue;
    if (l === li && liveAt(state, o, l, "afterPlayHere")) cdef(o).afterPlayHere({ state, p, li: l, card: o, h }, card);
    if (liveAt(state, o, l, "afterPlayAny")) cdef(o).afterPlayAny({ state, p, li: l, card: o, h }, card, li);
  }
  for (const o of [...pl.hand]) if (has(o, "afterPlayAnyInHand")) cdef(o).afterPlayAnyInHand({ state, p, li: -1, card: o, h }, card, li);
  { const listeners = []; for (let q = 0; q < 2; q++) for (const o of state.locations[li].cards[q]) if (o.uid !== card.uid && liveAt(state, o, li, "afterAnyPlayHere")) listeners.push(o);
    for (const o of listeners) { const w = h.where(o.uid); if (w && w.li === li) cdef(o).afterAnyPlayHere({ state, p: w.p, li, card: o, h }, card, p); } }
  for (let l = 0; l < 3; l++) if (state.locations[l].revealed) ldef(state, l).afterPlayAnywhere?.({ state, p, li: l, card, h }, li);
  if (nx.left) { const w = h.where(card.uid); if (w && w.li > 0) h.move(p, w.li, w.li - 1, card); }
  if (nx.right) { h.addPower(card, 1); const w = h.where(card.uid); if (w && w.li < 2) h.move(p, w.li, w.li + 1, card); }
  if (nx.to != null) { const w = h.where(card.uid); if (w && w.p === p && w.li !== nx.to) h.move(p, w.li, nx.to, card); }
  if (fromHand && pl.kidOmega) { pl.kidOmega = false; const w = h.where(card.uid); const ko = h.board(p).find(x => x.card.id === "KidOmega"); if (w && ko) { const pw = card.power; if (h.destroy(p, w.li, card.uid)) h.addPower(ko.card, pw); } }
  if (nx.spell) { castSpell(state, h, p, card, nx.spell); }
  if (fromHand && pl.lockjaw) {
    pl.lockjaw = false;
    const w = h.where(card.uid);
    if (w && w.p === p && pl.deck.length) {   // a card that switched sides is not yours to swap
      const idx = randInt(state, pl.deck.length);
      const [next] = pl.deck.splice(idx, 1);
      h.remove(p, w.li, card.uid); pl.deck.push(card); shuffle(state, pl.deck);
      state.log.push(`Lockjaw swaps ${cardName(card)} for ${cardName(next)}`);
      revealCard(state, h, p, w.li, next, { fromHand: false });
    }
  }
  pl.lastPlayedPrev = pl.lastPlayed; pl.lastPlayed = card.uid;
  pl.lastPlayedByTurn = pl.lastPlayedByTurn ?? {}; pl.lastPlayedByTurn[state.turn] = card.uid;
  pl.lastPlayedInfo = { uid: card.uid, id: card.id, power: cdef(card).power, cost: card.cost, turn: state.turn, li };
  if (isOnRevealCard(cdef(card)) && !cdef(card).skill) pl.onRevealsPlayed = (pl.onRevealsPlayed ?? 0) + 1;
  rules(state, h, p, "ruleAfterPlay", card, li);
  const w = h.where(card.uid);
  return w ? w.li : -1;
}
// Nico Minoru's spell on the card just played. spell = { n: 1..7, uid: Nico's uid }
function castSpell(state, h, p, card, spell) {
  const w = h.where(card.uid);
  h.log(`Nico's spell ${spell.n}`);
  if (spell.n === 7) { const pl = state.players[p]; const nico = h.find(spell.uid) ?? [...pl.hand, ...pl.deck].find(c => c.uid === spell.uid); if (nico && nico.power > 0) h.addPower(nico, nico.power); return; }
  if (!w) return;
  switch (spell.n) {
    case 1: h.transform(card, "Demon"); break;
    case 2: if (h.destroy(w.p, w.li, card.uid)) h.draw(p, 2); break;
    case 3: if (w.li < 2) h.move(w.p, w.li, w.li + 1, card); break;
    case 4: h.addPower(card, 2); break;
    case 5: h.replaceLocation(w.li); break;
    case 6: h.addToHand(p, h.make(card.id, p, { cost: card.cost, power: card.power })); break;
  }
}

// ---------- power ----------
function mult(state, li, p) {
  let m = 1;
  if (ldef(state, li).onslaught) m++;
  if (!ongoingDisabledAt(state, li)) for (const c of state.locations[li].cards[p]) if (liveAt(state, c, li, "onslaught")) m++;
  return m;
}
function applyOngoing(state, pw, o, odef, lj, q, card, li, p) {
  const dd = odef.ongoing({ state, self: o, selfLoc: lj, selfOwner: q, target: card, targetLoc: li, targetOwner: p });
  if (dd < 0 && (liveAt(state, card, li, "cantReduce") || (boardHas(state, p, "protectsReduce") && isFrontRow(state, li, p, card)))) return pw;
  return dd ? pw + dd * (odef.onslaught ? 1 : mult(state, lj, q)) : pw;
}
// Which other cards' Ongoing texts a card mirrors (Super-Skrull, Moonstone, Red Onslaught)
function mirrored(state, o, lj, q) {
  const odef = cdef(o);
  const out = [];
  if (odef.mimicsEnemies) for (let l = 0; l < 3; l++) for (const c of state.locations[l].cards[1 - q]) if (live(c) && !cdef(c).mimicsEnemies && !cdef(c).mimicsCheap) out.push(cdef(c));
  if (odef.mimicsCheap) for (const c of state.locations[lj].cards[q]) if (c.uid !== o.uid && live(c) && c.cost <= 3 && !cdef(c).mimicsEnemies && !cdef(c).mimicsCheap) out.push(cdef(c));
  if (o.mimics) for (const id of o.mimics) out.push(CARDS[id]);
  return out;
}
export function cardPower(state, li, p, card) {
  if (card.hiddenUntilEnd) return 0;
  let pw = card.power;
  const d = ldef(state, li);
  if (d.power) pw += d.power(state, li, p, card);
  const def = cdef(card);
  const ongoingOk = !ongoingDisabledAt(state, li) && !textDisabledAt(state, li);
  if (ongoingOk && live(card)) {
    if (def.selfPower) pw += def.selfPower({ state, li, p, card }) * (def.onslaught ? 1 : mult(state, li, p));
    for (const m of mirrored(state, card, li, p)) if (m.selfPower) pw += m.selfPower({ state, li, p, card });
  }
  for (let q = 0; q < 2; q++) for (let lj = 0; lj < 3; lj++) {
    if (ongoingDisabledAt(state, lj) || textDisabledAt(state, lj)) continue;
    for (const o of state.locations[lj].cards[q]) {
      if (o.uid === card.uid || !live(o)) continue;
      const odef = cdef(o);
      if (odef.ongoing) pw = applyOngoing(state, pw, o, odef, lj, q, card, li, p);
      for (const m of mirrored(state, o, lj, q)) if (m.ongoing) pw = applyOngoing(state, pw, o, m, lj, q, card, li, p);
    }
  }
  for (let lj = 0; lj < 3; lj++) if (lj !== li && ldef(state, lj).clubhouse && state.locations[lj].cards[p].length >= locCap(state, lj)) pw += 1;
  if (d.washington && !def.text) pw += 3;
  if (d.smithsonian) pw += state.locations[li].cards[p].filter(c => isOngoing(c)).length;
  return pw;
}
function locBase(state, li, p) {
  let s = 0;
  const d = ldef(state, li);
  const mine = state.locations[li].cards[p].map(c => cardPower(state, li, p, c));
  if (d.throne) {
    const theirs = state.locations[li].cards[1 - p].map(c => cardPower(state, li, 1 - p, c));
    const mx = Math.max(-Infinity, ...mine, ...theirs);
    for (let i = 0; i < mine.length; i++) if (mine[i] === mx) mine[i] *= 2;
  }
  for (const v of mine) s += v;
  for (let lj = 0; lj < 3; lj++) {
    if (ongoingDisabledAt(state, lj) || textDisabledAt(state, lj)) continue;
    for (const o of state.locations[lj].cards[p]) {
      if (has(o, "locAdd")) s += cdef(o).locAdd({ state, self: o, selfLoc: lj, p, li }) * mult(state, lj, p);
      if (live(o)) for (const m of mirrored(state, o, lj, p)) if (m.locAdd) s += m.locAdd({ state, self: o, selfLoc: lj, p, li });
    }
    for (const o of state.locations[lj].cards[1 - p]) if (has(o, "locAddEnemy")) s += cdef(o).locAddEnemy({ state, self: o, selfLoc: lj, p: 1 - p, li });
  }
  if (d.locAdd) s += d.locAdd(state, li, p);
  return s;
}
function doublingsAt(state, li, p) {
  if (ongoingDisabledAt(state, li) || textDisabledAt(state, li)) return 0;
  let n = 0;
  for (const c of state.locations[li].cards[p]) {
    if (has(c, "doublesHere")) n += mult(state, li, p);
    else if (live(c) && mirrored(state, c, li, p).some(m => m.doublesHere)) n += 1;
  }
  return n;
}
function spread(state, li, p) { // The Living Tribunal: total power split evenly
  if (!boardHas(state, p, "tribunal")) return locBase(state, li, p);
  let total = 0; for (let l = 0; l < 3; l++) total += locBase(state, l, p);
  return Math.floor(total / 3) + (li < ((total % 3) + 3) % 3 ? 1 : 0);
}
// a location's total before bonuses that other locations hand out
const ownTotal = (state, li, p) => spread(state, li, p) * 2 ** doublingsAt(state, li, p);
export function locPower(state, li, p) {
  let s = spread(state, li, p);
  for (let lj = 0; lj < 3; lj++) {
    if (lj === li || !state.locations[lj].revealed) continue;
    const d = ldef(state, lj);
    if (d.crossBonus) s += d.crossBonus(state, lj, li, p, ownTotal(state, lj, p), ownTotal(state, lj, 1 - p));
  }
  return s * 2 ** doublingsAt(state, li, p);
}
export function baseLead(state, li, p) { return locBase(state, li, p) - locBase(state, li, 1 - p); }
export function locCounts(state, li) { return !ldef(state, li).ignoreWin; }
export function winnerAt(state, li) {
  const a = locPower(state, li, 0), b = locPower(state, li, 1);
  if (a === b) return -1;
  const least = !!ldef(state, li).leastWins;
  return (a > b) !== least ? 0 : 1;
}
export function locationsWon(state, p) {
  let n = 0;
  for (let li = 0; li < 3; li++) if (locCounts(state, li) && winnerAt(state, li) === p) n++;
  return n;
}
export function totalPower(state, p) { let s = 0; for (let li = 0; li < 3; li++) if (locCounts(state, li)) s += locPower(state, li, p); return s; }
export function leader(state) {
  const a = locationsWon(state, 0), b = locationsWon(state, 1);
  if (a !== b) return a > b ? 0 : 1;
  const ta = totalPower(state, 0), tb = totalPower(state, 1);
  return ta === tb ? -1 : (ta > tb ? 0 : 1);
}
export function finalTurn(state) {
  let max = state.maxTurn, end = state.endAfter;
  for (let li = 0; li < 3; li++) { const d = ldef(state, li); if (d.extraTurn) max = Math.max(max, 7); if (d.endsAfter != null) end = end == null ? d.endsAfter : Math.min(end, d.endsAfter); }
  return end != null ? Math.min(max, end) : max;
}
export function retreatAllowed(state) {
  let cut = state.noRetreatAfter ?? 99;
  for (let li = 0; li < 3; li++) cut = Math.min(cut, ldef(state, li).noRetreatAfter ?? 99);
  return state.turn <= cut;
}

// ---------- turn flow ----------
export function startTurn(input) {
  const state = clone(input);
  const h = makeHelpers(state);
  state.resolving = false;
  state.turn++;
  state.movedLastTurn = state.movedThisTurn; state.movedThisTurn = false;
  if (state.turn <= 3 && !state.locations[state.turn - 1].revealed) {
    const li = state.turn - 1;
    state.locations[li].revealed = true;
    state.log.push(`${ldef(state, li).name} is revealed`);
    ldef(state, li).onReveal?.(state, li, h);
  }
  if (state.turn === finalTurn(state) && !state.finalDoubled) { state.stake *= 2; state.finalDoubled = true; state.log.push(`Final turn: stakes double to ${state.stake}`); }
  for (let li = 0; li < 3; li++) if (state.locations[li].revealed) ldef(state, li).onStartTurn?.(state, li, h);
  for (let p = 0; p < 2; p++) {
    const pl = state.players[p];
    for (const zone of [pl.hand, pl.deck]) for (const c of zone) if (c.costUntil != null && state.turn >= c.costUntil) { c.cost = c.costRestore; delete c.costUntil; delete c.costRestore; }
    if (pl.arishem && state.turn === 3) pl.maxEnergyBonus += 1;
    pl.kidOmega = false;
  }
  for (const { card, li, p } of h.board()) if (liveAt(state, card, li, "startOfTurn")) cdef(card).startOfTurn({ state, p, li, card, h });
  for (let p = 0; p < 2; p++) for (const c of [...state.players[p].hand]) if (has(c, "startOfTurnInHand")) cdef(c).startOfTurnInHand({ state, p, card: c, h });
  for (let p = 0; p < 2; p++) {
    const pl = state.players[p];
    pl.bonusEnergy = Math.max(0, pl.maxEnergyBonus + pl.energyNext);
    let e = state.turn + pl.maxEnergyBonus + pl.energyNext;
    pl.energyNext = 0;
    for (let li = 0; li < 3; li++) if (state.locations[li].revealed && ldef(state, li).energyBonus) e += ldef(state, li).energyBonus(state, li, p, h);
    pl.energy = Math.max(0, e);
    pl.playedThisTurn = [0, 0, 0]; pl.playedCards = [[], [], []];
    pl.playedCountLast = pl.playedCount; pl.playedCount = 0;
    drawCard(state, p);
  }
  for (let li = 0; li < 3; li++) if (state.locations[li].revealed) ldef(state, li).afterDraw?.(state, li, h);
  for (const { card, li, p } of h.board()) if (liveAt(state, card, li, "afterDrawTurn")) cdef(card).afterDrawTurn({ state, p, li, card, h });
  state.log.push(`--- Turn ${state.turn} ---`);
  return state;
}

export function canMove(state, p, card, from, to) { return moveKind(state, p, card, from, to) !== null; }
function moveKind(state, p, card, from, to) {
  if (from === to || !hasRoom(state, to, p) || ldef(state, to).noAdd?.(state, to)) return null;
  const free = has(card, "anywhere");
  if (!free && (liveAt(state, card, from, "cantMove") || ldef(state, from).noMoveOut || anyAt(state, from, "jailsEnemies", 1 - p))) return null;
  const def = cdef(card);
  const lv = live(card) && !textDisabledAt(state, from), own = card.ownMoves ?? 0;
  if (lv && def.moveable === "always" && (!def.moveableIf || def.moveableIf(state, p, card))) return "own";
  if (lv && def.moveable === "once" && own < 1) return "own";
  if (lv && def.moveable === "twice" && own < 2) return "own";
  if (card.moveableTurn === state.turn || card.phoenix) return "own";
  if (state.cloak && state.cloak.turn === state.turn && state.cloak.li === to) return "own";
  const pl = state.players[p];
  if (pl.moveableTo && pl.moveableTo.turn === state.turn && pl.moveableTo.li === to) return "own";
  if (ldef(state, to).moveableTo?.(state, to)) return "own";
  if (state.locations[from].cards[p].some(o => o.uid !== card.uid && liveAt(state, o, from, "webs"))) return "web"; // Madame Web: one per turn
  return null;
}
export function canActivate(state, p, card) { const li = findCardOwner(state, p, card.uid); return has(card, "activate") && !card.activated && !(li >= 0 && textDisabledAt(state, li)) && (cdef(card).activateIf?.(state, p, card) ?? true); }
export function validatePlays(state, p, plays, moves = [], activates = []) {
  const pl = state.players[p];
  let energy = pl.energy;
  const added = [0, 0, 0], webUsed = [false, false, false];
  const seen = new Set();
  for (const uid of activates) {
    const w = findCardOwner(state, p, uid);
    if (w < 0 || seen.has(uid)) return false;
    if (!canActivate(state, p, state.locations[w].cards[p].find(c => c.uid === uid))) return false;
    seen.add(uid);
  }
  for (const mv of moves) {
    const w = findCardOwner(state, p, mv.uid);
    if (w < 0 || seen.has(mv.uid)) return false;
    const card = state.locations[w].cards[p].find(c => c.uid === mv.uid);
    const kind = moveKind(state, p, card, w, mv.to);
    if (!kind) return false;
    if (kind === "web") { if (webUsed[w]) return false; webUsed[w] = true; }
    if (!hasRoom(state, mv.to, p, Math.max(0, added[mv.to]))) return false;   // two moves cannot share the last free slot
    seen.add(mv.uid); added[mv.to]++; added[w]--;
  }
  if (plays.length > maxPlaysFor(state, p)) return false;
  const forced = forcedFirstLoc(state, p);
  for (let i = 0; i < plays.length; i++) {
    const pay = plays[i];
    const card = pl.hand.find(c => c.uid === pay.uid);
    if (!card || seen.has(pay.uid)) return false;
    seen.add(pay.uid);
    const skill = !!cdef(card).skill;
    if (!canPlayAt(state, pay.li, p, card) || (!skill && !hasRoom(state, pay.li, p, added[pay.li]))) return false;
    if (i === 0 && ldef(state, pay.li).notFirstPlay) return false;
    if (i === 0 && forced >= 0 && pay.li !== forced && canPlayAt(state, forced, p, card)) return false;
    energy -= effCost(state, p, card);
    if (!skill) added[pay.li]++;
  }
  if (energy >= 0) return true;
  if (!activates.length) return false;
  // not affordable up front: try it with this turn's Activates applied
  const ps = clone(state);
  const q = stagePlays(ps, p, plays);
  ps.turnQueue = [[], []]; ps.turnQueue[p] = q;
  runActivates(ps, makeHelpers(ps), p, activates);
  settlePlays(ps, p, q);
  return ps.players[p].energy >= 0;
}
// Take the played cards out of the hand and charge their cost as it stands before any Activate.
function stagePlays(state, p, plays) {
  const pl = state.players[p], out = [];
  for (const pay of plays) {
    const i = pl.hand.findIndex(c => c.uid === pay.uid);
    const card = pl.hand.splice(i, 1)[0];
    const paid = effCost(state, p, card);
    pl.energy -= paid;
    pl.playedThisTurn[pay.li]++;
    pl.playedCards[pay.li].push(card.id);
    pl.lastPlayedTurnAt[pay.li] = state.turn;
    out.push({ card, li: pay.li, target: pay.target ?? null, paid });
  }
  return out;
}
function runActivates(state, h, p, uids) {
  for (const uid of uids) {
    const li = findCardOwner(state, p, uid);
    if (li < 0) continue;
    const card = state.locations[li].cards[p].find(c => c.uid === uid);
    card.activated = true;
    state.log.push(`P${p} activates ${cardName(card)}`);
    cdef(card).activate({ state, p, li, card, h });
    state.players[p].usedActivate = state.turn;
  }
}
// Refund whatever this turn's Activates took off the staged cards' costs.
function settlePlays(state, p, staged) {
  for (const e of staged) { const now = effCost(state, p, e.card); if (now < e.paid) { state.players[p].energy += e.paid - now; e.paid = now; } }
}

export function resolveTurn(input, subs) {
  const state = clone(input);
  const h = makeHelpers(state);
  const canRetreat = retreatAllowed(state);
  const retreats = subs.map(s => canRetreat && s.action === "retreat");
  if (retreats[0] || retreats[1]) {
    state.over = true;
    if (retreats[0] && retreats[1]) state.result = { winner: -1, cubes: 0, reason: "both retreated" };
    else {
      // Retreating on the final turn costs the stake from before the final-turn doubling.
      const cost = state.finalDoubled && state.turn >= finalTurn(state) ? state.stake / 2 : state.stake;
      const loser = retreats[0] ? 0 : 1; state.result = { winner: 1 - loser, cubes: cost, reason: `player ${loser} retreated` };
    }
    state.log.push(state.result.reason);
    return state;
  }
  let snappedNow = false;
  for (let p = 0; p < 2; p++) if (subs[p].action === "snap" && !state.snapped[p]) {
    state.snapped[p] = true; state.stake *= 2; snappedNow = true; state.log.push(`Player ${p} snaps! Stakes: ${state.stake}`);
  }
  state.snappedThisTurn = snappedNow;
  for (let p = 0; p < 2; p++) if (!validatePlays(state, p, subs[p].plays, subs[p].moves ?? [], subs[p].activates ?? [])) throw new Error(`invalid submission for player ${p}: ${JSON.stringify(subs[p])}`);
  // staged cards leave the hand and hold their slots while Activates and moves resolve
  const queued = [0, 1].map(p => stagePlays(state, p, subs[p].plays));
  state.turnQueue = queued;
  state.resolving = true;
  {
    const due = state.pending.filter(x => x.turn === state.turn);
    state.pending = state.pending.filter(x => x.turn !== state.turn);
    for (const x of due) {
      const card = h.find(x.uid);
      if (!card) continue;
      const played = state.players[x.p].playedThisTurn[x.li] > 0;
      if (x.kind === "ifPlayed" && played) h.addPower(card, x.amount);
      if (x.kind === "ifNotPlayed" && !played) h.addPower(card, x.amount);
    }
  }
  for (let p = 0; p < 2; p++) { runActivates(state, h, p, subs[p].activates ?? []); settlePlays(state, p, queued[p]); state.players[p].energy = Math.max(0, state.players[p].energy); }
  for (let p = 0; p < 2; p++) for (const mv of subs[p].moves ?? []) {
    const from = findCardOwner(state, p, mv.uid);
    if (from < 0) continue;   // an Activate this turn removed it
    const card = state.locations[from].cards[p].find(c => c.uid === mv.uid);
    if (card.moveableTurn === state.turn && card.moveBonus) h.addPower(card, card.moveBonus);
    if (h.move(p, from, mv.to, card, { force: true })) card.ownMoves = (card.ownMoves ?? 0) + 1;
    state.players[p].usedMove = state.turn;
  }
  const first = state.forceFirst ?? (() => { const l = leader(state); return l === -1 ? (state.turn % 2 === 1 ? 0 : 1) : l; })();
  for (const p of [first, 1 - first]) {
    while (queued[p].length) {
      const q = queued[p].shift();
      revealCard(state, h, p, q.li, q.card, { target: q.target });
    }
    state.players[p].playedLastTurn = subs[p].plays.length > 0;
  }
  delete state.turnQueue;
  // end of turn
  const eotRepeat = [0, 1].map(p => state.players[p].repeatEndOfTurn === state.turn ? 2 : 1);
  for (const { card, li, p } of h.board()) if (liveAt(state, card, li, "endOfTurn")) for (let k = 0; k < eotRepeat[p]; k++) if (h.find(card.uid)) cdef(card).endOfTurn?.({ state, p, li: h.where(card.uid).li, card, h });
  for (let p = 0; p < 2; p++) for (const c of [...state.players[p].hand]) if (has(c, "endOfTurnInHand")) for (let k = 0; k < eotRepeat[p]; k++) if (state.players[p].hand.some(x => x.uid === c.uid)) cdef(c).endOfTurnInHand({ state, p, card: c, h });
  for (let li = 0; li < 3; li++) if (state.locations[li].revealed) ldef(state, li).onEndTurn?.(state, li, h);
  for (let li = 0; li < 3; li++) if (state.locations[li].revealed) ldef(state, li).onEndTurnLate?.(state, li, h);   // after every location's End of Turn (Starlight Citadel reorders them)
  for (let p = 0; p < 2; p++) {
    const pl = state.players[p];
    pl.unspentLastTurn = Math.max(0, pl.energy);
    if (pl.energy > 0) { pl.unspentTurns++; pl.unspentStreak++; } else { pl.spentAllTurns++; pl.unspentStreak = 0; }
    if (pl.playedCount >= 2) pl.twoPlusTurns = (pl.twoPlusTurns ?? 0) + 1;
  }
  for (const { card, li, p } of h.board()) if (liveAt(state, card, li, "objective")) cdef(card).objective({ state, p, li, card, h });
  if (state.turn >= finalTurn(state)) {
    state.noRevealTurn = null; state.ignoreLocsUntil = null;   // location abilities resume when the game ends
    for (const { card, li, p } of h.board()) if (card.hiddenUntilEnd) { delete card.hiddenUntilEnd; state.log.push(`${cardName(card)} is revealed`); runOnReveal(state, h, p, li, card, null); }
    for (const { card, li, p } of h.board()) if (liveAt(state, card, li, "endOfGame") && h.find(card.uid)) cdef(card).endOfGame({ state, p, li: h.where(card.uid).li, card, h });
    for (let p = 0; p < 2; p++) for (const c of [...state.players[p].deck]) if (has(c, "endOfGameInDeck")) cdef(c).endOfGameInDeck({ state, p, card: c, h });
    state.over = true;
    const w = leader(state);
    state.result = { winner: w, cubes: w === -1 ? 0 : state.stake, reason: w === -1 ? "draw" : `player ${w} wins ${state.stake} cubes` };
    state.log.push(state.result.reason);
  }
  return state;
}

export function findCardOwner(state, p, uid) {
  for (let li = 0; li < 3; li++) if (state.locations[li].cards[p].some(c => c.uid === uid)) return li;
  return -1;
}
export const findCard = findCardOwner;

export function cubesFor(state, p) {
  if (!state.over || !state.result) return 0;
  const { winner, cubes } = state.result;
  return winner === -1 ? 0 : (winner === p ? cubes : -cubes);
}

// The position as it would stand once these Activates have run (for planning what they make affordable).
export function previewActivates(state, p, uids) {
  const ps = clone(state);
  ps.turnQueue = [[], []];
  runActivates(ps, makeHelpers(ps), p, uids);
  delete ps.turnQueue;
  return ps;
}
// Daredevil: the view of a player who gets to see the opponent's plays for this turn. The cards the opponent is
// playing are shown; the rest of their hand stays hidden. `oppSub` is the opponent's locked-in submission.
export function viewWithPlays(state, p, oppSub) {
  const v = viewFor(state, p);
  const real = state.players[1 - p].hand;
  v.players[1 - p].hand = real.map(c => oppSub.plays.some(pl => pl.uid === c.uid) ? clone(c) : { hidden: true });
  v.known = { plays: clone(oppSub.plays), moves: clone(oppSub.moves ?? []), activates: clone(oppSub.activates ?? []) };
  return v;
}

// ---------- hidden-information view ----------
export function viewFor(state, p) {
  const v = clone(state);
  const opp = v.players[1 - p];
  v.players[1 - p] = { ...opp, hidden: true, hand: opp.hand.map(() => ({ hidden: true })), deck: opp.deck.map(() => ({ hidden: true })) };
  const seer = [...v.players[p].hand, ...v.players[p].deck].some(c => has(c, "seer")) || state.locations.some(L => L.cards[p].some(c => has(c, "seer")));
  for (const L of v.locations) if (!L.revealed && !seer) L.id = null;
  v.viewer = p;
  return v;
}
