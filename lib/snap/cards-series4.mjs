// Marvel Snap Series 4 (91 cards), stats and text as published by marvelsnapzone.com, plus their tokens.
// New hook vocabulary (see engine.mjs): skill (non-character, resolves and leaves), afterSkill, onDrawn, onAnyDraw,
// afterDrawTurn, onEmpowered, onMerged, objective, gameStart, startOfTurnInHand, onAnyDiscardedInHand, onEnemyDestroyed,
// onAnyMove, jailsEnemies, elsa, galacta, blocksAdditions, tribunal, locAddEnemy, protectsDestroy, doublesReductions,
// doublesIncreases, doubleDiscounts, revealBonusHere, repeatsOneCostReveals, webs, anywhere, playAnywhere, mimicsCheap.
import { CARDS } from "./cards.mjs";
import { cardPower } from "./engine.mjs";

const sameSide = (o) => o.selfOwner === o.targetOwner;
const here = (o) => o.selfLoc === o.targetLoc;
const lowestBy = (arr, f) => arr.length ? arr.reduce((a, b) => f(b) < f(a) ? b : a) : null;
const highestBy = (arr, f) => arr.length ? arr.reduce((a, b) => f(b) > f(a) ? b : a) : null;
const regenerate = (h, p, id, power) => { const l = h.pick(h.openLocs(p)); if (l != null) h.spawn(id, p, l, { power, created: false }); };
const doubleDaken = (state, h, p) => { for (const c of [...h.board(p).map(x => x.card), ...state.players[p].hand]) if (c.id === "Daken" && c.power > 0) h.addPower(c, c.power); };
export const GUARDIANS = ["Starlord", "RocketRaccoon", "Groot", "Gamora", "Drax", "Mantis"];   // the six cards Major Victory's page lists
const replaceWith = (h, p, li, pred, over) => { // Wade Wilson / Air-Walker: pull a matching card from hand or deck onto the board
  const pl = h.state.players[p];
  const opts = [pl.hand, pl.deck].flatMap(zone => zone.filter(c => !CARDS[c.id].skill && pred(c)).map(c => ({ c, zone }))); // one pick across both zones
  const x = h.pick(opts); if (!x || !h.canPlace(p, li)) return;
  x.zone.splice(x.zone.indexOf(x.c), 1); if (over.power) h.addPower(x.c, over.power);
  if (!h.place(p, li, x.c)) x.zone.push(x.c);
};

export const SERIES4 = {
  // ---------------- 1-cost ----------------
  Agony: { name: "Agony", cost: 1, power: 2, text: "After you play a card here, merge this into it.", afterPlayHere: ({ h, card }, played) => h.merge(card, played) },
  Batroc: { name: "Batroc the Leaper", cost: 1, power: 2, text: "When a card moves, follow it to gain +2 Power. (once per turn)",
    onAnyCardMove: ({ state, h, p, li, card }, moved, mover, from, to) => { if (card.leapTurn === state.turn || to === li) return; if (h.move(p, li, to, card)) { card.leapTurn = state.turn; h.addPower(card, 2); } } },
  BlackKnight: { name: "Black Knight", cost: 1, power: 2, text: "After you discard a card, add the Ebony Blade to your hand with that card's Power. (once per game)",
    onAnyDiscarded: ({ h, p, card }, gone) => { if (card.bladeMade) return; card.bladeMade = true; h.addToHand(p, h.make("EbonyBlade", p, { power: gone.power })); } },
  EbonyBlade: { name: "Ebony Blade", cost: 4, power: 0, kind: "ongoing", token: true, text: "Ongoing: Can't be destroyed.", cantDestroy: true },
  DeafeningChord: { name: "Deafening Chord", cost: 1, power: 0, skill: true, text: "On Reveal: Remove the text of a 3-Cost or lower enemy character here.",
    onReveal: ({ h, p, li }) => { const t = h.pick(h.cards(1 - p, li).filter(c => c.cost <= 3)); if (t) h.silence(t); } },
  JJonahJameson: { name: "J. Jonah Jameson", cost: 1, power: 3, kind: "ongoing", text: "Ongoing: Your text emotes are ruder." },
  KingEitri: { name: "King Eitri", cost: 1, power: 3, text: "Activate: Draw a created card from your deck.", activate: ({ h, p }) => h.draw(p, 1, c => c.created) },
  Loki: { name: "Loki", cost: 1, power: 2, text: "On Reveal: Replace your deck with your opponent's starting deck. Give those cards -1 Cost.",
    onReveal: ({ state, h, p }) => { const ids = state.players[1 - p].startDeck ?? []; state.players[p].deck = ids.map(id => h.make(id, p, { cost: Math.max(0, CARDS[id].cost - 1), created: false })); h.shuffle(state.players[p].deck); } },
  MadThinker: { name: "Mad Thinker", cost: 1, power: 3, text: "Start of Turn (after drawing): +2 Power if your hand is full.",
    afterDrawTurn: ({ state, h, p, card }) => { if (state.players[p].hand.length >= 7) h.addPower(card, 2); } },
  MajesticWingbeat: { name: "Majestic Wingbeat", cost: 1, power: 0, skill: true, text: "On Reveal: Give the leftmost card in your hand +3 Power. If it's 5-Cost or more, -1 Cost too.",
    onReveal: ({ state, h, p }) => { const c = state.players[p].hand[0]; if (c) { h.addPower(c, 3); if (c.cost >= 5) c.cost -= 1; } } },
  Miek: { name: "Miek", cost: 1, power: 1, text: "When you discard a card, this gains +1 Power and Moveable next turn.",
    onAnyDiscarded: ({ state, h, card }) => { h.addPower(card, 1); card.moveableTurn = state.turn + 1; } },
  NicholasScratch: { name: "Nicholas Scratch", cost: 1, power: 3, text: "After you play a skill, +1 Power.", afterSkill: ({ h, card }) => h.addPower(card, 1) },
  TheHunger: { name: "The Hunger", cost: 1, power: 0, skill: true, text: "On Reveal: Horde +3.", onReveal: ({ h, p, li }) => h.horde(p, 3, li) },
  UncleBen: { name: "Uncle Ben", cost: 1, power: 2, text: "When Destroyed: Replace this with Spider-Man.", onDestroyed: ({ h, p, li }) => h.spawn("SpiderMan", p, li) },
  WebSling: { name: "Web Sling", cost: 1, power: 0, skill: true, text: "On Reveal: Next turn, one of your cards here is Moveable and gets +1 Power when it moves. (your choice)",
    targets: (s, p, li) => s.locations[li].cards[p].map(c => c.uid),
    onReveal: ({ state, h, p, li, target }) => { const mine = h.cards(p, li); const c = mine.find(c => c.uid === target) ?? h.pick(mine); if (c) { c.moveableTurn = state.turn + 1; c.moveBonus = 1; } } },
  X23: { name: "X-23", cost: 1, power: 1, text: "When Discarded or Destroyed: Regenerate this at a random location and you get +1 Energy next turn.",
    onDiscarded: ({ state, h, p, card }) => { regenerate(h, p, "X23", card.power); state.players[p].energyNext += 1; },
    onDestroyed: ({ state, h, p, card }) => { regenerate(h, p, "X23", card.power); state.players[p].energyNext += 1; } },

  // ---------------- 2-cost ----------------
  Askanison: { name: "Askani'son", cost: 2, power: 3, text: "Activate: Create a 1-Cost card at another location. Increase the Cost each time you're winning here as the turn starts.",
    startOfTurn: ({ h, p, li, card }) => { if (h.winnerAt(li) === p) card.createCost = (card.createCost ?? 1) + 1; },
    activate: ({ h, p, li, card }) => { const l = h.pick(h.otherLocs(li, p)); const id = h.randomCharId(d => d.cost === (card.createCost ?? 1)); if (l != null && id) h.spawn(id, p, l); } },
  AwesomeAndy: { name: "Awesome Andy", cost: 2, power: 3, text: "Activate: Give one of your cards at each other location +2 Power.",
    activate: ({ h, p, li }) => { for (let l = 0; l < 3; l++) if (l !== li) { const c = h.pick(h.cards(p, l)); if (c) h.addPower(c, 2); } } },
  Cobra: { name: "Cobra", cost: 2, power: 3, text: "Activate: Destroy an enemy created card here.",
    activate: ({ h, p, li }) => { const t = h.pick(h.cards(1 - p, li).filter(c => c.created)); if (t) h.destroy(1 - p, li, t.uid); } },
  DoctorOctopusFracturedFrontier: { name: "Doctor Octopus Fractured Frontier", cost: 2, power: 2, text: "On Reveal: Put your leftmost card in hand on top of your deck to get a random character. Give both +3 Power.",
    onReveal: ({ state, h, p }) => { const pl = state.players[p]; const c = pl.hand[0]; if (!c) return; h.addPower(c, 3); pl.hand.shift(); pl.deck.unshift(c); const id = h.randomPoolId(d => !d.skill); if (!id) return; const n = h.make(id, p); if (h.addToHand(p, n)) h.addPower(n, 3); } },
  FastballSpecial: { name: "Fastball Special", cost: 2, power: 0, skill: true, text: "On Reveal: Destroy your highest-Power card here to afflict an enemy card here with that much negative Power.",
    onReveal: ({ h, p, li }) => { const v = highestBy(h.cards(p, li), c => h.cardPower(li, p, c)); if (!v) return; const pw = h.cardPower(li, p, v); if (h.destroy(p, li, v.uid)) { const t = h.pick(h.cards(1 - p, li)); if (t && pw > 0) h.addPower(t, -pw); } } },
  Gorgon: { name: "Gorgon", cost: 2, power: 3, kind: "ongoing", text: "Ongoing: Your opponent's created cards cost 1 more. (maximum 6)", oppHandCostMod: (s, p, c) => c.created && c.cost < 6 ? 1 : 0 },
  GrandMaster: { name: "Grand Master", cost: 2, power: 3, text: "On Reveal: Move one of your other On Reveal cards here to the middle location. Its ability happens again.",
    onReveal: ({ h, p, li, card }) => { const t = h.pick(h.others(p, li, card).filter(c => CARDS[c.id].onReveal)); if (!t || li === 1) return; if (h.move(p, li, 1, t)) h.revealAgain(p, 1, t); } },
  JenniferKale: { name: "Jennifer Kale", cost: 2, power: 3, text: "Activate: Next turn, you get +1 Energy.", activate: ({ state, p }) => { state.players[p].energyNext += 1; } },
  Lasher: { name: "Lasher", cost: 2, power: 2, text: "Activate: Afflict an enemy card here with negative Power equal to this card's Power.",
    activate: ({ h, p, li, card }) => { const t = h.pick(h.cards(1 - p, li)); const pw = h.cardPower(li, p, card); if (t && pw > 0) h.addPower(t, -pw); } },
  Marrow: { name: "Marrow", cost: 2, power: 3, text: "When Discarded or Destroyed: Randomly split -7 Power among enemy cards.",
    onDiscarded: ({ h, p }) => splitAfflict(h, 1 - p, 7), onDestroyed: ({ h, p }) => splitAfflict(h, 1 - p, 7) },
  Pixie: { name: "Pixie", cost: 2, power: 3, text: "On Reveal: Shuffle the base Costs of all cards in your deck that started there.",
    onReveal: ({ state, h, p }) => { const cs = state.players[p].deck.filter(c => !c.created); const costs = h.shuffle(cs.map(c => c.cost)); cs.forEach((c, i) => { c.cost = costs[i]; }); } },
  Quicksand: { name: "Quicksand", cost: 2, power: 4, text: "The next time your opponent would start a turn with bonus Energy, they don't get it.", startOfTurn: ({ state, p, card }) => { const o = state.players[1 - p]; if (!card.quicksandUsed && o.energyNext > 0) { o.energyNext = 0; card.quicksandUsed = true; } } },
  RavonnaRenslayer: { name: "Ravonna Renslayer", cost: 2, power: 2, kind: "ongoing", text: "Ongoing: Your cards with 1 or less Power cost 1 less. (minimum 1)", handCostMod: (s, p, c) => c.power <= 1 && c.cost > 1 ? -1 : 0 },
  RedShift: { name: "Red Shift", cost: 2, power: 3, text: "On Reveal: Discard the leftmost card in your hand to add a random card with the same Cost to your hand.",
    onReveal: ({ state, h, p }) => { const c = state.players[p].hand[0]; if (!c) return; const k = c.cost; h.discard(p, c); const id = h.randomPoolId(d => d.cost === k); if (id) h.addToHand(p, h.make(id, p)); } },
  Sandstorm: { name: "Sandstorm", cost: 2, power: 0, skill: true, text: "On Reveal: Add 2 Rocks to your hand. Give them +1 Power for each of your front-Row characters.",
    onReveal: ({ h, p }) => { let n = 0; for (let l = 0; l < 3; l++) n += h.frontRow(p, l).length; for (let i = 0; i < 2; i++) h.addToHand(p, h.make("Rock", p, { power: n })); } },
  Starhawk: { name: "Starhawk", cost: 2, power: 3, text: "On Reveal: +1 Power to your cards at the left location if it's an odd turn, otherwise give to the right location.",
    onReveal: ({ state, h, p }) => h.cards(p, state.turn % 2 === 1 ? 0 : 2).forEach(c => h.addPower(c, 1)) },
  GhostTheFirstRider: { name: "The First Ghost Rider", cost: 2, power: 8, text: "On Reveal: Discard the lowest-Power character from your hand. Remove that card's Power from this.",
    onReveal: ({ state, h, p, card }) => { const c = lowestBy(state.players[p].hand.filter(c => !CARDS[c.id].skill), c => c.power); if (c) { h.discard(p, c); h.addPower(card, -c.power); } } },
  Tombstone: { name: "Tombstone", cost: 2, power: 5, text: "On Reveal: Destroy your lowest-Power card at each other location.",
    onReveal: ({ h, p, li }) => { for (let l = 0; l < 3; l++) if (l !== li) { const t = lowestBy(h.cards(p, l), c => h.cardPower(l, p, c)); if (t) h.destroy(p, l, t.uid); } } },
  Topaz: { name: "Topaz", cost: 2, power: 4, text: "After you play a card here, move it to the middle location.", afterPlayHere: ({ h, p, li }, played) => { if (li !== 1) h.move(p, li, 1, played); } },
  ToxieDoxie: { name: "Toxie Doxie", cost: 2, power: 3, text: "On Reveal: Give 2 characters in your hand +2 Power. You can't play them next turn.",
    onReveal: ({ state, h, p }) => { const hand = h.shuffle([...state.players[p].hand.filter(c => !CARDS[c.id].skill)]).slice(0, 2); for (const c of hand) { h.addPower(c, 2); c.lockedTurn = state.turn + 1; } } },
  Valentina: { name: "Valentina", cost: 2, power: 3, text: "On Reveal: Add a random 6-Cost card to your hand. Give it -2 Cost and -2 Power.",
    onReveal: ({ h, p }) => { const id = h.randomPoolId(d => d.cost === 6); if (id) h.addToHand(p, h.make(id, p, { cost: 4, power: CARDS[id].power - 2 })); } },
  WadeWilson: { name: "Wade Wilson", cost: 2, power: 2, text: "When Destroyed: Replace this with a 1-Cost card from your hand or deck with +2 Power.",
    onDestroyed: ({ h, p, li }) => replaceWith(h, p, li, c => c.cost === 1, { power: 2 }) },
  WildChild: { name: "Wild Child", cost: 2, power: 1, kind: "ongoing", text: "Ongoing: +4 Power if you've discarded a card. +4 Power if one of your cards has been destroyed.",
    selfPower: ({ state, p }) => (state.discards[p] > 0 ? 4 : 0) + (state.destroyed[p] > 0 ? 4 : 0) },
  ZombiePowerMan: { name: "Zombie Power Man", cost: 2, power: 4, text: "End of Turn: If you're winning here, discard the leftmost card from your hand.",
    endOfTurn: ({ state, h, p, li }) => { if (h.winnerAt(li) === p && state.players[p].hand.length) h.discard(p, state.players[p].hand[0]); } },
  ZombieSentry: { name: "Zombie Sentry", cost: 2, power: 1, text: "On Reveal: Horde +1 for each of your cards at the right location.", onReveal: ({ h, p, li }) => h.horde(p, h.cards(p, 2).length, li) },

  // ---------------- 3-cost ----------------
  AirWalker: { name: "Air-Walker", cost: 3, power: 4, text: "When Destroyed: Replace this with a 4-Cost card from your hand or deck.",
    onDestroyed: ({ h, p, li }) => replaceWith(h, p, li, c => c.cost === 4, {}) },
  AstralProjection: { name: "Astral Projection", cost: 3, power: 0, skill: true, text: "On Reveal: Copy the text of an On Reveal card in your hand.",   // a Skill: it uses the copied On Reveal where it was played, with 0 Power
    onReveal: ({ state, h, p, li, card }) => { const c = h.pick(state.players[p].hand.filter(c => CARDS[c.id].onReveal && !CARDS[c.id].skill)); if (c) h.useReveal(c.id, p, li, card); } },
  Chameleon: { name: "Chameleon", cost: 3, power: 3, text: "On Reveal: Copy the text of another card here you revealed this turn.",
    onReveal: ({ state, h, p, li, card }) => { const t = h.pick(h.others(p, li, card).filter(c => c.playedTurn === state.turn || c.spawnedTurn === state.turn)); if (t) { h.copyText(card, t.id); if (CARDS[t.id].onReveal) h.revealAgain(p, li, card); } } },
  CorvusGlaive: { name: "Corvus Glaive", cost: 3, power: 5, text: "On Reveal: Discard 2 cards from your hand to get +1 Max Energy.",
    onReveal: ({ state, h, p }) => { const hand = state.players[p].hand; if (hand.length < 2) return; for (const c of h.shuffle([...hand]).slice(0, 2)) h.discard(p, c); state.players[p].maxEnergyBonus += 1; } },   // both cards are chosen when he resolves: nothing a discard creates or returns can be the second
  Daken: { name: "Daken", cost: 3, power: 4, text: "On Reveal: Add the Muramasa Shard to your hand.", onReveal: ({ h, p }) => h.addToHand(p, h.make("MuramasaShard", p)) },
  ElsaBloodstone: { name: "Elsa Bloodstone", cost: 3, power: 5, text: "Each card you play to fill your side of a location gains +2 Power.", elsa: true },
  EntropicHavok: { name: "Entropic Havok", cost: 3, power: 4, text: "Start of Turn: Steal 1 bonus Energy from your opponent. (if they have any)",
    startOfTurn: ({ state, p }) => { const o = state.players[1 - p]; if (o.energyNext > 0) { o.energyNext--; state.players[p].energyNext++; } } },
  Gladiator: { name: "Gladiator", cost: 3, power: 8, text: "On Reveal: Add a card from your opponent's deck to their side of this location. If it has less Power, destroy it.",
    onReveal: ({ state, h, p, li, card }) => { const q = 1 - p; const dk = state.players[q].deck; const c = dk.find(c => !CARDS[c.id].skill); if (!c || !h.canPlace(q, li)) return; dk.splice(dk.indexOf(c), 1); if (!h.place(q, li, c)) { dk.unshift(c); return; } if (h.cardPower(li, q, c) < h.cardPower(li, p, card)) h.destroy(q, li, c.uid); } },
  HellcowFracturedFrontier: { name: "Hellcow Fractured Frontier", cost: 3, power: 3, text: "End of Turn: Afflict ALL other cards here with -1 Power. Then destroy your other cards here with 0 Power or less.",
    endOfTurn: ({ h, p, li, card }) => { for (let q = 0; q < 2; q++) for (const c of h.cards(q, li)) if (c.uid !== card.uid) h.addPower(c, -1); for (const c of [...h.others(p, li, card)]) if (h.cardPower(li, p, c) <= 0) h.destroy(p, li, c.uid); } },
  HitMonkey: { name: "Hit-Monkey", cost: 3, power: 3, text: "On Reveal: Gain +2 Power for each other card you played this turn.", onReveal: ({ state, h, p, card }) => h.addPower(card, 2 * Math.max(0, state.players[p].playedCount + (state.turnQueue?.[p].length ?? 0) - (card.playedTurn === state.turn ? 1 : 0))) },
  MajorVictory: { name: "Major Victory", cost: 3, power: 5, text: "On Reveal: Add 2 members of the Guardians crew to your hand.",
    onReveal: ({ h, p }) => { for (let i = 0; i < 2; i++) { const id = h.pick(GUARDIANS.filter(x => CARDS[x])); h.addToHand(p, h.make(id, p)); } } },
  Mercury: { name: "Mercury", cost: 3, power: 4, kind: "ongoing", text: "Moveable once. Ongoing: Enemy cards here can't move.", moveable: "once", jailsEnemies: true },
  MoleMan: { name: "Mole Man", cost: 3, power: 4, text: "On Reveal: Banish the top card of your deck. Add 2 Rocks to your hand. Set their Power to the banished card's Cost.",
    onReveal: ({ state, h, p }) => { const c = state.players[p].deck.shift(); const pw = c ? c.cost : 0; for (let i = 0; i < 2; i++) h.addToHand(p, h.make("Rock", p, { power: pw })); } },
  Phastos: { name: "Phastos", cost: 3, power: 4, text: "On Reveal: Give each card in your deck -1 Cost or +2 Power.",
    onReveal: ({ state, h, p }) => state.players[p].deck.forEach(c => { if (c.cost > 0 && h.rand() < 0.5) c.cost -= 1; else h.addPower(c, 2); }) },
  SebastianShaw: { name: "Sebastian Shaw", cost: 3, power: 5, text: "When this is Empowered, gain an additional +2 Power. (if in hand, in deck, or in play)", empoweredInDeck: true, onEmpowered: ({ card }) => { card.power += 2; card.buffed += 2; } },
  SilverSurferFirstSteps: { name: "Silver Surfer First Steps", cost: 3, power: 5, text: "End of Turn: If you're winning this location with an On Reveal card, copy its text.",
    endOfTurn: ({ h, p, li, card }) => { if (h.winnerAt(li) !== p || card.alias) return; const t = h.pick(h.others(p, li, card).filter(c => CARDS[c.id].onReveal)); if (t) h.copyText(card, t.id); } },
  SuperAdaptoid: { name: "Super-Adaptoid", cost: 3, power: 5, text: "On Reveal: Steal the text from an enemy Activate card here.",
    onReveal: ({ h, p, li, card }) => { const t = h.pick(h.cards(1 - p, li).filter(c => CARDS[c.id].activate && !c.silenced)); if (t) { h.copyText(card, t.id); h.silence(t); } } },
  Terrax: { name: "Terrax the Tamer", cost: 3, power: 4, text: "On Reveal: For each location, shuffle a Rock into the losing player's deck.",
    onReveal: ({ state, h }) => { for (let l = 0; l < 3; l++) { const w = h.winnerAt(l); if (w === -1) continue; const d = state.players[1 - w].deck; d.push(h.make("Rock", 1 - w)); h.shuffle(d); } } },
  TheInversion: { name: "The Inversion", cost: 3, power: 0, skill: true, text: "On Reveal: Invert the Power of the lowest-Power card(s) here. (positive becomes negative and vice versa)",
    onReveal: ({ h, li }) => { const all = []; for (let q = 0; q < 2; q++) for (const c of h.cards(q, li)) all.push({ c, pw: h.cardPower(li, q, c) }); if (!all.length) return; const mn = Math.min(...all.map(x => x.pw)); all.filter(x => x.pw === mn).forEach(({ c }) => h.addPower(c, -2 * c.power)); } },
  Triton: { name: "Triton", cost: 3, power: 6, text: "On Reveal: Give the last character EACH player played last turn +3 Power.",
    onReveal: ({ state, h }) => { for (let q = 0; q < 2; q++) { const uid = state.players[q].lastPlayedByTurn?.[state.turn - 1]; const c = uid && h.find(uid); if (c && !CARDS[c.id].skill) h.addPower(c, 3); } } },
  WerewolfByNight: { name: "Werewolf By Night", cost: 3, power: 3, text: "After you play a card, move there to gain +2 Power if it has an On Reveal.",
    afterPlayAny: ({ h, p, li, card }, played, to) => { if (CARDS[played.id].onReveal && to !== li && h.move(p, li, to, card)) h.addPower(card, 2); } },

  // ---------------- 4-cost ----------------
  BetaRayBill: { name: "Beta Ray Bill", cost: 4, power: 6, text: "On Reveal: Shuffle Stormbreaker into your deck.", onReveal: ({ state, h, p }) => { state.players[p].deck.push(h.make("Stormbreaker", p)); h.shuffle(state.players[p].deck); } },
  CullObsidian: { name: "Cull Obsidian", cost: 4, power: 10, text: "You can only play this where you have a 1-Cost card.", canPlayAtLoc: (s, p, li) => s.locations[li].cards[p].some(c => c.cost === 1) },
  Danger: { name: "Danger", cost: 4, power: 6, text: "Activate: Destroy an enemy card here with less Power.",
    activate: ({ h, p, li, card }) => { const t = h.pick(h.cards(1 - p, li).filter(c => h.cardPower(li, 1 - p, c) < h.cardPower(li, p, card))); if (t) h.destroy(1 - p, li, t.uid); } },
  FanFei: { name: "Fan Fei", cost: 4, power: 5, text: "Activate: Give your other cards here +1 Power and move them to the right.",
    activate: ({ h, p, li, card }) => { for (const c of [...h.others(p, li, card)]) { h.addPower(c, 1); if (li < 2) h.move(p, li, li + 1, c); } } },
  Fantasticar: { name: "Fantasticar", cost: 4, power: 5, text: "Activate: Give your End of Turn cards +2 Power.", // by the card's text, not by its hook: Nebula and Iron Patriot use an endOfTurn hook, Black Cat an in-hand one
    activate: ({ h, p }) => h.board(p).forEach(x => { if (!x.card.silenced && /\bEnd of Turn:/.test(h.def(x.card).text)) h.addPower(x.card, 2); }) },
  Firelord: { name: "Firelord", cost: 4, power: 7, text: "On Reveal: Revive one of your discarded or destroyed 3-Cost cards here.",
    onReveal: ({ state, h, p, li }) => { const piles = [state.discardPile[p], state.destroyedPile[p]]; const opts = piles.flatMap(pile => pile.filter(c => c.cost === 3 && !CARDS[c.id].skill).map(c => ({ c, pile }))); const x = h.pick(opts); if (x && h.canPlace(p, li)) { x.pile.splice(x.pile.indexOf(x.c), 1); h.place(p, li, x.c); } } },
  Ikari: { name: "Ikari", cost: 4, power: 12, text: "You can only play this where an enemy is afflicted with negative Power.", canPlayAtLoc: (s, p, li) => s.locations[li].cards[1 - p].some(c => c.afflicted > 0) },
  IronLad: { name: "Iron Lad", cost: 4, power: 7, text: "On Reveal: Copy the text of your deck's top card.",
    onReveal: ({ state, h, p, li, card }) => { const c = state.players[p].deck[0]; if (c && !CARDS[c.id].skill) { h.copyText(card, c.id); if (CARDS[c.id].onReveal) h.revealAgain(p, li, card); } } },
  Laufey: { name: "Laufey", cost: 4, power: 5, text: "On Reveal: Steal 1 Power from each other card here.",
    onReveal: ({ h, li, card }) => { for (let q = 0; q < 2; q++) for (const c of h.cards(q, li)) if (c.uid !== card.uid) h.steal(c, card, 1); } },
  ManThing: { name: "Man-Thing", cost: 4, power: 7, kind: "ongoing", text: "Ongoing: 3-Cost or less cards here have -2 Power.", ongoing: (o) => here(o) && o.target.cost <= 3 ? -2 : 0 },
  MotherAskani: { name: "Mother Askani", cost: 4, power: 4, text: "On Reveal: Copy the leftmost card in your hand. Give the copy -1 Cost and +2 Power.",
    onReveal: ({ state, h, p }) => { const c = state.players[p].hand[0]; if (!c) return; const n = h.make(c.id, p, { cost: Math.max(0, c.cost - 1), power: c.power }); if (h.addToHand(p, n)) h.addPower(n, 2); } },
  MsMarvel: { name: "Ms. Marvel", cost: 4, power: 5, kind: "ongoing", text: "Ongoing: Your adjacent locations with 2+ cards and no repeated Costs have +6 Power.",
    locAdd: ({ state, selfLoc, p, li }) => { if (Math.abs(selfLoc - li) !== 1) return 0; const cs = state.locations[li].cards[p]; return cs.length >= 2 && new Set(cs.map(c => c.cost)).size === cs.length ? 6 : 0; } },
  KarimaShapandar: { name: "Omega Sentinel", cost: 4, power: 3, text: "Activate: Afflict the highest-Power enemy card with -7 Power.",
    activate: ({ h, p }) => { const t = highestBy(h.board(1 - p), x => h.cardPower(x.li, 1 - p, x.card)); if (t) h.addPower(t.card, -7); } },
  ThePhoenixForce: { name: "Phoenix Force", cost: 4, power: 5, text: "On Reveal: Revive one of your destroyed cards and merge this into it. It gains Moveable.",
    onReveal: ({ state, h, p, li, card }) => {
      const pile = state.destroyedPile[p]; const c = h.pick(pile); if (!c) return;
      pile.splice(pile.indexOf(c), 1);
      const mine = state.locations[li].cards[p];
      if (h.hasRoom(p, li)) { if (!h.place(p, li, c)) { pile.push(c); return; } }
      else { // Phoenix Force fills the slot: step off the board so the revived card can take it, then merge in
        h.remove(p, li, card.uid);
        if (!h.place(p, li, c)) { pile.push(c); mine.push(card); return; }
        mine.push(card); // over the cap for an instant; h.merge removes it right away and fires the merge hooks
      }
      c.phoenix = true; h.merge(card, c);
    } },
  Stick: { name: "Stick", cost: 4, power: 3, text: "On Reveal: Give the next card you play Power equal to this card's Power.", onReveal: ({ state, p, card }) => { state.players[p].nextCardPower = card.power; } },
  Supergiant: { name: "Supergiant", cost: 4, power: 5, text: "On Reveal: All cards played next turn don't reveal until the game ends.",
    onReveal: ({ state, card }) => { state.noRevealTurn = card.heldTurn = state.turn + 1; },
  },

  // ---------------- 5-cost ----------------
  Annihilus: { name: "Annihilus", cost: 5, power: 8, text: "On Reveal: Your cards with Power below 0 switch sides. Destroy those that can't.",
    onReveal: ({ h, p }) => { for (const x of h.board(p)) if (h.cardPower(x.li, p, x.card) < 0 && !h.switchSides(x.li, x.card)) h.destroy(p, x.li, x.card.uid); } },
  Cannonball: { name: "Cannonball", cost: 5, power: 5, text: "On Reveal: Move the highest-Power enemy card here away. If you can't, destroy it with a Rock.",
    onReveal: ({ h, p, li }) => { const t = highestBy(h.cards(1 - p, li), c => h.cardPower(li, 1 - p, c)); if (!t) return; const l = h.pick(h.otherLocs(li, 1 - p)); if (l == null || !h.move(1 - p, li, l, t)) { if (h.destroy(1 - p, li, t.uid)) h.spawn("Rock", 1 - p, li); } } },
  Darkhawk: { name: "Darkhawk", cost: 5, power: 3, kind: "ongoing", text: "Ongoing: +2 Power for each card in your opponent's deck.", selfPower: ({ state, p }) => 2 * state.players[1 - p].deck.length },
  DragonLord: { name: "Dragon Lord", cost: 5, power: 5, text: "On Reveal: Put a card from your hand here.",
    onReveal: ({ state, h, p, li }) => { const c = h.pick(state.players[p].hand.filter(c => !CARDS[c.id].skill)); if (c && h.canPlace(p, li)) { state.players[p].hand.splice(state.players[p].hand.indexOf(c), 1); h.place(p, li, c); } } },
  Hellion: { name: "Hellion", cost: 5, power: 8, text: "On Reveal: Next turn, your cards are Moveable to this location.", onReveal: ({ state, p, li }) => { state.players[p].moveableTo = { turn: state.turn + 1, li }; } },
  HydroMan: { name: "Hydro-Man", cost: 5, power: 10, text: "On Reveal: Set the Cost of EACH deck's top card to 1.", onReveal: ({ state }) => state.players.forEach(pl => { if (pl.deck[0]) pl.deck[0].cost = 1; }) },
  Legion: { name: "Legion", cost: 5, power: 7, text: "On Reveal: Replace each other location with this one.",
    onReveal: ({ state, h, li }) => { const id = state.locations[li].id; const closedAfter = state.locations[li].closedAfter; for (let l = 0; l < 3; l++) if (l !== li) { h.replaceLocation(l, id); if (closedAfter != null) state.locations[l].closedAfter = closedAfter; } } },
  Ozymandias: { name: "Ozymandias", cost: 5, power: 9, kind: "ongoing", text: "Ongoing: Your Rocks have +3 Power.", ongoing: (o) => sameSide(o) && o.target.id === "Rock" ? 3 : 0 },
  SpiderSense: { name: "Spider Sense", cost: 5, power: 0, skill: true, text: "On Reveal: Give your characters here +3 Power. Costs 1 less for each Moveable card you've played.",
    onReveal: ({ h, p, li }) => h.cards(p, li).forEach(c => h.addPower(c, 3)), costMod: (s, p) => -s.players[p].moveablePlayed },
  ZombieGiantMan: { name: "Zombie Giant-Man", cost: 5, power: 4, text: "On Reveal: Horde +2, then this gains Power equal to your Zombie Horde.", onReveal: ({ h, p, li, card }) => { const hc = h.horde(p, 2, li); if (hc) h.addPower(card, Math.max(0, hc.power)); } },

  // ---------------- 6-cost and up ----------------
  Blob: { name: "Blob", cost: 6, power: 0, text: "On Reveal: Merge cards from your deck into this until it gains 13 or more Power.",
    onReveal: ({ state, h, p, card }) => { let gained = 0; const d = state.players[p].deck; while (gained < 13 && d.length) { const c = d.shift(); gained += c.power; card.power += c.power; } } },
  Sasquatch: { name: "Sasquatch", cost: 6, power: 11, text: "Costs 1 less for each card you played last turn.", costMod: (s, p) => -s.players[p].playedCountLast },
  LivingTribunal: { name: "The Living Tribunal", cost: 6, power: 9, kind: "ongoing", text: "Ongoing: Split your total Power evenly among all locations.", tribunal: true },
  Skaar: { name: "Skaar", cost: 7, power: 12, text: "Costs 2 less for each of your cards that has 10 or more Power.",
    costMod: (s, p) => { let n = 0; s.locations.forEach((L, li) => { for (const c of L.cards[p]) if (cardPower(s, li, p, c) >= 10) n++; }); return -2 * n; } },

  // ---------------- tokens ----------------
  MuramasaShard: { name: "Muramasa Shard", cost: 1, power: 1, token: true, text: "When this is discarded or destroyed, double Daken's Power.",
    onDiscarded: ({ state, h, p }) => doubleDaken(state, h, p), onDestroyed: ({ state, h, p }) => doubleDaken(state, h, p) },
  Stormbreaker: { name: "Stormbreaker", cost: 0, power: 4, token: true, text: "On Reveal: Double Beta Ray Bill's Power.",
    onReveal: ({ h, p }) => h.board(p).forEach(x => { if (x.card.id === "BetaRayBill" && !x.card.alias && x.card.power > 0) h.addPower(x.card, x.card.power); }) },
};

function splitAfflict(h, q, total) {
  const targets = h.board(q);
  if (!targets.length) return;
  for (let i = 0; i < total; i++) h.addPower(h.pick(targets).card, -1);
}
