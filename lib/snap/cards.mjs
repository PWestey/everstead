// The Marvel Snap launch pool (Starter, Series 1, Series 2, Collection Level and Recruit Season cards),
// 97 cards, stats and text as published by marvelsnapzone.com, plus the tokens they create.
//
// Hooks a card may define (ctx = { state, p, li, card, h }):
//   onReveal(ctx + target)         ongoing(o) -> delta for o.target      selfPower(ctx) -> delta for itself
//   locAdd({state,self,selfLoc,p,li}) -> power added to owner's total at li
//   onDestroyed, onDiscarded, onAnyDestroyed(ctx, victim, victimLi), onAnyDiscarded(ctx, card)
//   afterPlayHere(ctx, played), afterPlayAny(ctx, played), onMoveHere(ctx, mover), onSelfMoved(ctx, fromLi)
//   endOfTurn(ctx), onHandAdded(ctx, card), canPlayCard(state, p, card), targets(state, p, li)
// Flags: kind:"ongoing", blocksReveal, blocksDestroy, blocksPlays, locks, cantDestroy, cantMove, cantReduce,
//        doublesHere, onslaught, moveable:"once"|"always", drawRule:"opening"|"turn2", seer, flies, token
import { SERIES3 } from "./cards-series3.mjs";
import { SERIES4 } from "./cards-series4.mjs";
import { SERIES5 } from "./cards-series5.mjs";
import { locCap } from "./engine.mjs"; // circular, but only used at call time

const sameSide = (o) => o.selfOwner === o.targetOwner;
const here = (o) => o.selfLoc === o.targetLoc;
const isOngoing = (card) => CARDS[card.id].kind === "ongoing" && !card.silenced;
const oppPlayedHere = ({ state, p, li }) => state.players[1 - p].playedThisTurn[li] > 0;
const plusIfOppPlayed = (n) => (ctx) => { if (oppPlayedHere(ctx)) ctx.h.addPower(ctx.card, n); };

export const CARDS = {
  // ---------------- 1-cost ----------------
  Agent13: { name: "Agent 13", cost: 1, power: 3, text: "On Reveal: Add a random card to your hand.",
    onReveal: ({ h, p }) => { const id = h.randomPoolId(); if (id) h.addToHand(p, h.make(id, p)); } },
  AmericaChavez: { name: "America Chavez", cost: 1, power: 2, text: "On Reveal: Give the top card of your deck +3 Power.",
    onReveal: ({ state, p, h }) => { const c = state.players[p].deck[0]; if (c) h.addPower(c, 3); } },
  AntMan: { name: "Ant Man", cost: 1, power: 1, kind: "ongoing", text: "Ongoing: If your side of this location is full, +4 Power.",
    selfPower: ({ state, li, p }) => state.locations[li].cards[p].length >= locCap(state, li) ? 4 : 0 },
  Blade: { name: "Blade", cost: 1, power: 3, text: "On Reveal: Discard the rightmost card from your hand.",
    onReveal: ({ state, p, h }) => { const hand = state.players[p].hand; if (hand.length) h.discard(p, hand[hand.length - 1]); } },
  EbonyMaw: { name: "Ebony Maw", cost: 1, power: 7, kind: "ongoing", text: "You can't play this after turn 3. Ongoing: You can't play cards here.",
    canPlayCard: (state) => state.turn <= 3, blocksPlays: true },
  Elektra: { name: "Elektra", cost: 1, power: 2, text: "On Reveal: Destroy an enemy 1-Cost card here.",
    onReveal: ({ h, p, li }) => { const t = h.pick(h.cards(1 - p, li).filter(c => c.cost === 1)); if (t) h.destroy(1 - p, li, t.uid); } },
  Hawkeye: { name: "Hawkeye", cost: 1, power: 1, text: "On Reveal: If you play a card at this location next turn, +4 Power.",
    onReveal: ({ state, p, li, card }) => state.pending.push({ kind: "ifPlayed", p, li, uid: card.uid, turn: state.turn + 1, amount: 4 }) },
  Iceman: { name: "Iceman", cost: 1, power: 2, text: "On Reveal: Give a card in your opponent's hand +1 Cost. (maximum 6)",
    onReveal: ({ state, p, h }) => { const c = h.pick(state.players[1 - p].hand.filter(c => c.cost < 6)); if (c) c.cost += 1; } },
  IronFist: { name: "Iron Fist", cost: 1, power: 3, text: "On Reveal: After you play your next card, move it one location to the left.",
    onReveal: ({ state, p }) => { state.players[p].nextCardMoveLeft = true; } },
  Korg: { name: "Korg", cost: 1, power: 2, text: "On Reveal: Shuffle a Rock into your opponent's deck.",
    onReveal: ({ state, p, h }) => { const d = state.players[1 - p].deck; d.push(h.make("Rock", 1 - p)); h.shuffle(d); } },
  Mantis: { name: "Mantis", cost: 1, power: 3, text: "On Reveal: If your opponent played any cards here this turn, copy one of them into your hand.",
    onReveal: ({ state, p, li, h }) => { const id = h.pick(state.players[1 - p].playedCards[li]); if (id) h.addToHand(p, h.make(id, p)); } },
  MistyKnight: { name: "Misty Knight", cost: 1, power: 3, text: "" },
  Nightcrawler: { name: "Nightcrawler", cost: 1, power: 3, text: "Moveable once.", moveable: "once" },
  Nova: { name: "Nova", cost: 1, power: 1, text: "When Destroyed: Give your cards +1 Power.",
    onDestroyed: ({ h, p }) => h.board(p).forEach(({ card }) => h.addPower(card, 1)) },
  Quicksilver: { name: "Quicksilver", cost: 1, power: 2, text: "Starts in your opening hand.", drawRule: "opening" },
  RocketRaccoon: { name: "Rocket Raccoon", cost: 1, power: 1, text: "On Reveal: If your opponent played a card here this turn, +4 Power.", onReveal: plusIfOppPlayed(4) },
  SquirrelGirl: { name: "Squirrel Girl", cost: 1, power: 2, text: "On Reveal: Add a 1-Power Squirrel to each other location.",
    onReveal: ({ h, p, li }) => { for (let l = 0; l < 3; l++) if (l !== li) h.spawn("Squirrel", p, l); } },
  Sunspot: { name: "Sunspot", cost: 1, power: 0, text: "End of Turn: Gain +1 Power for each unspent Energy.",
    endOfTurn: ({ state, p, card, h }) => h.addPower(card, Math.max(0, state.players[p].energy)) },
  Swarm: { name: "Swarm", cost: 1, power: 3, text: "When Discarded: Add two copies of this that cost 0 to your hand.",
    onDiscarded: ({ h, p, card }) => { for (let i = 0; i < 2; i++) h.addToHand(p, h.make("Swarm", p, { cost: 0, power: card.power })); } },
  Uatu: { name: "Uatu the Watcher", cost: 1, power: 2, text: "Game Start: You can see the unrevealed locations.", seer: true },
  Vulture: { name: "Vulture", cost: 1, power: 3, text: "When this card moves, +4 Power.", onSelfMoved: ({ h, card }) => h.addPower(card, 4) },
  Yondu: { name: "Yondu", cost: 1, power: 2, text: "On Reveal: Banish the card that costs the least in your opponent's deck.",
    onReveal: ({ state, p }) => { const d = state.players[1 - p].deck; if (!d.length) return; let bi = 0; for (let i = 1; i < d.length; i++) if (d[i].cost < d[bi].cost) bi = i; d.splice(bi, 1); } },

  // ---------------- 2-cost ----------------
  Angel: { name: "Angel", cost: 2, power: 4, text: "When one of your cards is destroyed, this flies out of your hand or deck to replace it.", flies: true },
  Angela: { name: "Angela", cost: 2, power: 3, text: "After you play a card here, +1 Power.", afterPlayHere: ({ h, card }) => h.addPower(card, 1) },
  Armor: { name: "Armor", cost: 2, power: 3, kind: "ongoing", text: "Ongoing: Cards here can't be destroyed.", blocksDestroy: true },
  BuckyBarnes: { name: "Bucky Barnes", cost: 2, power: 2, text: "When Destroyed: Replace this with the Winter Soldier.",
    onDestroyed: ({ h, p, li }) => h.spawn("WinterSoldier", p, li) },
  Cable: { name: "Cable", cost: 2, power: 4, text: "On Reveal: Draw a card from your opponent's deck.",
    onReveal: ({ state, p, h }) => { const c = state.players[1 - p].deck.shift(); if (c && !h.addToHand(p, c)) { c.owner = 1 - p; state.players[1 - p].deck.unshift(c); } } },
  Carnage: { name: "Carnage", cost: 2, power: 2, text: "On Reveal: Destroy your other cards here. +2 Power for each destroyed.",
    onReveal: ({ h, p, li, card }) => { let n = 0; for (const c of h.others(p, li, card)) if (h.destroy(p, li, c.uid)) n++; h.addPower(card, 2 * n); } },
  Cloak: { name: "Cloak", cost: 2, power: 4, text: "On Reveal: Next turn, all cards are Moveable to this location.",
    onReveal: ({ state, li }) => { state.cloak = { turn: state.turn + 1, li }; } },
  Colossus: { name: "Colossus", cost: 2, power: 4, kind: "ongoing", text: "Ongoing: Can't be destroyed, moved, or have its Power reduced.", cantDestroy: true, cantMove: true, cantReduce: true },
  DoctorStrange: { name: "Doctor Strange", cost: 2, power: 4, text: "On Reveal: Move your highest-Power card(s) to this location.",
    onReveal: ({ h, p, li }) => { // highest among all your cards, himself included: if it is already here nothing moves
      const mine = h.board(p).map(x => ({ ...x, pw: h.cardPower(x.li, p, x.card) }));
      const mx = Math.max(...mine.map(x => x.pw));
      for (const x of mine) if (x.pw === mx && x.li !== li) h.move(p, x.li, li, x.card);
    } },
  Domino: { name: "Domino", cost: 2, power: 3, text: "You always draw this card on turn 2, and not before.", drawRule: "turn2" },
  Forge: { name: "Forge", cost: 2, power: 2, text: "On Reveal: Give the next card you play +2 Power.", onReveal: ({ state, p }) => { state.players[p].nextCardBuff += 2; } },
  Hulkbuster: { name: "Hulkbuster", cost: 2, power: 3, text: "On Reveal: Merge this into one of your cards here.",
    targets: (s, p, li) => s.locations[li].cards[p].map(c => c.uid),
    onReveal: ({ h, p, li, card, target }) => {
      const others = h.others(p, li, card);
      const t = others.find(c => c.uid === target) ?? h.pick(others);
      if (t) h.merge(card, t);
    } },
  Kraven: { name: "Kraven", cost: 2, power: 3, text: "When a card moves here, this gains +2 Power.", onMoveHere: ({ h, card }) => h.addPower(card, 2) },
  Lizard: { name: "Lizard", cost: 2, power: 6, kind: "ongoing", text: "Ongoing: -4 Power if your opponent has 4 cards here.",
    selfPower: ({ state, li, p }) => state.locations[li].cards[1 - p].length >= 4 ? -4 : 0 },
  Medusa: { name: "Medusa", cost: 2, power: 2, text: "On Reveal: If this is at the middle location, +3 Power.", onReveal: ({ h, li, card }) => { if (li === 1) h.addPower(card, 3); } },
  MrSinister: { name: "Mister Sinister", cost: 2, power: 2, text: "On Reveal: Add a Sinister Clone here with the same Power.",
    onReveal: ({ h, p, li, card }) => h.spawn("SinisterClone", p, li, { power: card.power }) },
  Morbius: { name: "Morbius", cost: 2, power: 0, kind: "ongoing", text: "Ongoing: +2 Power for each time you discarded a card this game.",
    selfPower: ({ state, p }) => 2 * state.discards[p] },
  MultipleMan: { name: "Multiple Man", cost: 2, power: 4, text: "When this moves, add a copy to the old location.",
    onSelfMoved: ({ h, p, card }, from) => h.spawn("MultipleMan", p, from, { power: card.power }) },
  Okoye: { name: "Okoye", cost: 2, power: 3, text: "On Reveal: Give every card in your deck +1 Power.", onReveal: ({ state, p, h }) => state.players[p].deck.forEach(c => h.addPower(c, 1)) },
  Rhino: { name: "Rhino", cost: 2, power: 5, text: "On Reveal: Add a Rock to your side of this location.", onReveal: ({ h, p, li }) => h.spawn("Rock", p, li) },
  ScarletWitch: { name: "Scarlet Witch", cost: 2, power: 3, text: "On Reveal: Replace this location with a new one.", onReveal: ({ h, li }) => h.replaceLocation(li) },
  Scorpion: { name: "Scorpion", cost: 2, power: 3, text: "On Reveal: Afflict cards in your opponent's hand with -1 Power.",
    onReveal: ({ state, p, h }) => state.players[1 - p].hand.forEach(c => h.addPower(c, -1)) },
  Sentinel: { name: "Sentinel", cost: 2, power: 3, text: "On Reveal: Add another Sentinel to your hand.", onReveal: ({ h, p }) => h.addToHand(p, h.make("Sentinel", p)) },
  Shocker: { name: "Shocker", cost: 2, power: 4, text: "" },
  Starlord: { name: "Star-Lord", cost: 2, power: 2, text: "On Reveal: If your opponent played a card here this turn, +4 Power.", onReveal: plusIfOppPlayed(4) },
  TheCollector: { name: "The Collector", cost: 2, power: 3, text: "When a card enters your hand from anywhere (except your deck), +1 Power.",
    onHandAdded: ({ h, card }) => h.addPower(card, 1) },
  Wolverine: { name: "Wolverine", cost: 2, power: 3, text: "When Discarded or Destroyed: Regenerate this with +2 Power at a random location.",
    onDiscarded: ({ h, p, card }) => regenerate(h, p, card), onDestroyed: ({ h, p, card }) => regenerate(h, p, card) },

  // ---------------- 3-cost ----------------
  Bishop: { name: "Bishop", cost: 3, power: 2, text: "After you play a card, this gains +1 Power.", afterPlayAny: ({ h, card }) => h.addPower(card, 1) },
  CaptainAmerica: { name: "Captain America", cost: 3, power: 3, kind: "ongoing", text: "Ongoing: Your other Ongoing cards here have +2 Power.",
    ongoing: (o) => here(o) && sameSide(o) && isOngoing(o.target) ? 2 : 0 },
  Cosmo: { name: "Cosmo", cost: 3, power: 3, kind: "ongoing", text: "Ongoing: On Reveal abilities won't happen here.", blocksReveal: true },
  Cyclops: { name: "Cyclops", cost: 3, power: 5, text: "" },
  Deathlok: { name: "Deathlok", cost: 3, power: 6, text: "On Reveal: Destroy your other cards here.",
    onReveal: ({ h, p, li, card }) => h.others(p, li, card).forEach(c => h.destroy(p, li, c.uid)) },
  Groot: { name: "Groot", cost: 3, power: 5, text: "On Reveal: If your opponent played a card here this turn, +4 Power.", onReveal: plusIfOppPlayed(4) },
  Ironheart: { name: "Ironheart", cost: 3, power: 0, text: "On Reveal: Give 2 of your other cards +3 Power.",
    onReveal: ({ h, p, card }) => { const pool = h.board(p).filter(x => x.card.uid !== card.uid); h.shuffle(pool); pool.slice(0, 2).forEach(x => h.addPower(x.card, 3)); } },
  Killmonger: { name: "Killmonger", cost: 3, power: 3, text: "On Reveal: Destroy ALL 1-Cost cards.",
    onReveal: ({ h }) => h.board().filter(x => x.card.cost === 1).forEach(x => h.destroy(x.p, x.li, x.card.uid)) },
  LadySif: { name: "Lady Sif", cost: 3, power: 6, text: "On Reveal: Discard the card that costs the most from your hand.",
    onReveal: ({ state, p, h }) => { const hand = state.players[p].hand; if (!hand.length) return; const mx = Math.max(...hand.map(c => c.cost)); h.discard(p, h.pick(hand.filter(c => c.cost === mx))); } },
  MrFantastic: { name: "Mister Fantastic", cost: 3, power: 1, kind: "ongoing", text: "Ongoing: Adjacent locations have +3 Power.",
    locAdd: ({ selfLoc, li }) => Math.abs(selfLoc - li) === 1 ? 3 : 0 },
  Morph: { name: "Morph", cost: 3, power: 0, text: "On Reveal: Become a copy of a card in your opponent's hand.",
    onReveal: ({ state, p, card, h }) => { // a copy as it is in their hand (Cost and Power changes included); its On Reveal does not fire
      const src = h.pick(state.players[1 - p].hand.filter(c => !CARDS[c.id].skill)); if (!src) return;   // a character: Morph stays on the board
      h.transform(card, src.id); card.cost = src.cost; card.power = src.power; h.log(`Morph becomes ${CARDS[src.id].name}`);
    } },
  Nakia: { name: "Nakia", cost: 3, power: 4, text: "On Reveal: Give all cards in your hand +1 Power.", onReveal: ({ state, p, h }) => state.players[p].hand.forEach(c => h.addPower(c, 1)) },
  Punisher: { name: "Punisher", cost: 3, power: 3, kind: "ongoing", text: "Ongoing: +1 Power for each enemy card here.", selfPower: ({ state, li, p }) => state.locations[li].cards[1 - p].length },
  Sabretooth: { name: "Sabretooth", cost: 3, power: 5, text: "When Destroyed: Return this to your hand. It costs 0.",
    onDestroyed: ({ h, p, card }) => h.addToHand(p, h.make("Sabretooth", p, { cost: 0, power: card.power, created: false })) },
  Storm: { name: "Storm", cost: 3, power: 1, text: "On Reveal: Flood this location. Next turn is the last turn cards can be played here.",
    onReveal: ({ state, h, li }) => { if (state.locations[li].id !== "Flooded") h.replaceLocation(li, "Flooded"); state.locations[li].closedAfter = state.turn + 1; } },
  StrongGuy: { name: "Strong Guy", cost: 3, power: 4, kind: "ongoing", text: "Ongoing: +6 Power if your hand has 1 or fewer cards.", selfPower: ({ state, p }) => state.players[p].hand.length <= 1 ? 6 : 0 },
  SwordMaster: { name: "Sword Master", cost: 3, power: 7, text: "On Reveal: Discard an odd-costed card from your hand.",
    onReveal: ({ state, p, h }) => { const c = h.pick(state.players[p].hand.filter(c => c.cost % 2 === 1)); if (c) h.discard(p, c); } },
  WhiteQueen: { name: "White Queen", cost: 3, power: 5, text: "On Reveal: Copy the card that costs the most from your opponent's hand into your hand.",
    onReveal: ({ state, p, h }) => { const hand = state.players[1 - p].hand; if (!hand.length) return; const mx = Math.max(...hand.map(c => c.cost)); const src = h.pick(hand.filter(c => c.cost === mx)); h.addToHand(p, h.make(src.id, p, { cost: src.cost, power: src.power })); } },
  Wolfsbane: { name: "Wolfsbane", cost: 3, power: 2, text: "On Reveal: +2 Power for each other card you have here.", onReveal: ({ h, p, li, card }) => h.addPower(card, 2 * h.others(p, li, card).length) },

  // ---------------- 4-cost ----------------
  JessicaJones: { name: "Jessica Jones", cost: 4, power: 5, text: "On Reveal: If you don't play a card at this location next turn, +5 Power.",
    onReveal: ({ state, p, li, card }) => state.pending.push({ kind: "ifNotPlayed", p, li, uid: card.uid, turn: state.turn + 1, amount: 5 }) },
  Jubilee: { name: "Jubilee", cost: 4, power: 1, text: "On Reveal: Add the top card of your deck to this location.",
    onReveal: ({ state, p, li, h }) => { // added, not played: no play triggers, respects locks / blocked additions
      if (!h.canPlace(p, li)) return;
      const deck = state.players[p].deck; const c = deck.find(c => !CARDS[c.id].skill); if (!c) return;   // characters only
      deck.splice(deck.indexOf(c), 1);
      if (!h.place(p, li, c)) { deck.unshift(c); return; }
      if (CARDS[c.id].onReveal) h.revealAgain(p, li, c);
    } },
  KaZar: { name: "Ka-Zar", cost: 4, power: 6, kind: "ongoing", text: "Ongoing: Your 1-Cost cards have +1 Power.", ongoing: (o) => sameSide(o) && o.target.cost === 1 ? 1 : 0 },
  Klaw: { name: "Klaw", cost: 4, power: 3, kind: "ongoing", text: "Ongoing: The location to the right has +6 Power.", locAdd: ({ selfLoc, li }) => li === selfLoc + 1 ? 6 : 0 },
  Leech: { name: "Leech", cost: 4, power: 5, text: "On Reveal: Remove the text from 6-Cost or more cards in your opponent's hand.",
    onReveal: ({ state, p, h }) => state.players[1 - p].hand.filter(c => c.cost >= 6).forEach(c => h.silence(c)) },
  MoonGirl: { name: "Moon Girl", cost: 4, power: 5, text: "On Reveal: Copy your hand.",
    onReveal: ({ state, p, h }) => { for (const c of [...state.players[p].hand]) h.addToHand(p, h.make(c.id, p, { cost: c.cost, power: c.power })); } },
  Namor: { name: "Namor", cost: 4, power: 6, kind: "ongoing", text: "Ongoing: +5 Power if this is your only card here.", selfPower: ({ state, li, p }) => state.locations[li].cards[p].length === 1 ? 5 : 0 },
  ShangChi: { name: "Shang-Chi", cost: 4, power: 3, text: "On Reveal: Destroy an enemy card here that has 10 or more Power.",
    onReveal: ({ h, p, li }) => { const big = h.cards(1 - p, li).filter(c => h.cardPower(li, 1 - p, c) >= 10); if (!big.length) return; const t = big.reduce((a, b) => h.cardPower(li, 1 - p, b) > h.cardPower(li, 1 - p, a) ? b : a); h.destroy(1 - p, li, t.uid); } },
  TheThing: { name: "The Thing", cost: 4, power: 7, text: "" },
  Warpath: { name: "Warpath", cost: 4, power: 5, kind: "ongoing", text: "Ongoing: If any of your locations are empty, +5 Power.",
    selfPower: ({ state, p }) => state.locations.some(L => L.cards[p].length === 0) ? 5 : 0 },

  // ---------------- 5-cost ----------------
  Abomination: { name: "Abomination", cost: 5, power: 9, text: "" },
  BlueMarvel: { name: "Blue Marvel", cost: 5, power: 3, kind: "ongoing", text: "Ongoing: Your other cards have +1 Power.", ongoing: (o) => sameSide(o) ? 1 : 0 },
  DevilDinosaur: { name: "Devil Dinosaur", cost: 5, power: 4, kind: "ongoing", text: "Ongoing: +2 Power for each card in your hand.", selfPower: ({ state, p }) => 2 * state.players[p].hand.length },
  Enchantress: { name: "Enchantress", cost: 5, power: 8, text: "On Reveal: Remove the abilities from all Ongoing cards here.",
    onReveal: ({ h, li, card }) => { for (let q = 0; q < 2; q++) for (const c of h.cards(q, li)) if (c.uid !== card.uid && isOngoing(c)) h.silence(c); } },
  Gamora: { name: "Gamora", cost: 5, power: 8, text: "On Reveal: If your opponent played a card here this turn, +4 Power.", onReveal: plusIfOppPlayed(4) },
  Hobgoblin: { name: "Hobgoblin", cost: 5, power: -8, text: "On Reveal: Switch sides.", onReveal: ({ h, li, card }) => h.switchSides(li, card) },
  IronMan: { name: "Iron Man", cost: 5, power: 0, kind: "ongoing", text: "Ongoing: Your total Power is doubled here.", doublesHere: true },
  ProfessorX: { name: "Professor X", cost: 5, power: 2, kind: "ongoing", text: "Ongoing: Moving is the only way to add or remove a character from here.", locks: true },
  Sandman: { name: "Sandman", cost: 5, power: 8, text: "On Reveal: Next turn, cards cost 1 more. (maximum 6)", onReveal: ({ state }) => { state.costModTurn = state.turn + 1; } },
  SpiderWoman: { name: "Spider-Woman", cost: 5, power: 8, text: "On Reveal: Afflict all enemy cards here with -1 Power.", onReveal: ({ h, p, li }) => h.cards(1 - p, li).forEach(c => h.addPower(c, -1)) },
  Vision: { name: "Vision", cost: 5, power: 9, text: "Moveable", moveable: "always" },
  WhiteTiger: { name: "White Tiger", cost: 5, power: 1, text: "On Reveal: Add a 10-Power Tiger to another location.",
    onReveal: ({ h, p, li }) => { const opts = [0, 1, 2].filter(l => l !== li && h.canPlace(p, l)); const l = h.pick(opts); if (l != null) h.spawn("TigerSpirit", p, l); } },

  // ---------------- 6-cost ----------------
  Apocalypse: { name: "Apocalypse", cost: 6, power: 10, text: "When Discarded: Put this back with +4 Power.",
    onDiscarded: ({ h, p, card }) => h.addToHand(p, h.make("Apocalypse", p, { power: card.power + 4, created: false })) },
  Heimdall: { name: "Heimdall", cost: 6, power: 10, text: "On Reveal: Move your other cards one location to the left.",
    onReveal: ({ h, p, card }) => { for (let l = 1; l < 3; l++) for (const c of [...h.cards(p, l)]) if (c.uid !== card.uid) h.move(p, l, l - 1, c); } },
  Hulk: { name: "Hulk", cost: 6, power: 14, text: "" },
  Odin: { name: "Odin", cost: 6, power: 10, text: "On Reveal: Repeat the On Reveal abilities of your other cards here.",
    onReveal: ({ h, p, li, card }) => { for (const c of [...h.others(p, li, card)]) if (CARDS[c.id].onReveal) h.revealAgain(p, li, c); } },
  Onslaught: { name: "Onslaught", cost: 6, power: 8, kind: "ongoing", text: "Ongoing: Your other Ongoing effects here apply an additional time.", onslaught: true },
  Spectrum: { name: "Spectrum", cost: 6, power: 7, text: "On Reveal: Give your Ongoing cards +2 Power.", onReveal: ({ h, p }) => h.board(p).filter(x => isOngoing(x.card)).forEach(x => h.addPower(x.card, 2)) },
  Infinaut: { name: "The Infinaut", cost: 6, power: 20, text: "If you played a card last turn, you can't play this.", canPlayCard: (state, p) => !state.players[p].playedLastTurn },

  // ---------------- tokens ----------------
  Squirrel: { name: "Squirrel", cost: 1, power: 1, text: "", token: true },
  Rock: { name: "Rock", cost: 1, power: 0, text: "", token: true },
  SinisterClone: { name: "Sinister Clone", cost: 2, power: 2, text: "", token: true },
  TigerSpirit: { name: "Tiger Spirit", cost: 5, power: 10, text: "", token: true },
  WinterSoldier: { name: "Winter Soldier", cost: 2, power: 8, text: "", token: true },
  Monster: { name: "Monster", cost: 6, power: 10, text: "", token: true },
  Raptor: { name: "Raptor", cost: 1, power: 1, text: "", token: true },
  Vibranium: { name: "Vibranium", cost: 1, power: 4, text: "Ongoing: Can't be destroyed.", kind: "ongoing", cantDestroy: true, token: true },
  // location tokens (Pizza Place, Taco Truck, Noor Dimension, Shadowland, Klyntar)
  PizzaSlice: { name: "Pizza Slice", cost: 0, power: 1, text: "On Reveal: Merge this into one of your cards here.", token: true, onReveal: ({ h, p, li, card }) => { const t = h.pick(h.others(p, li, card)); if (t) h.merge(card, t); } },
  Chimichanga: { name: "Chimichanga", cost: 0, power: 2, text: "On Reveal: Merge this into one of your cards here.", token: true, onReveal: ({ h, p, li, card }) => { const t = h.pick(h.others(p, li, card)); if (t) h.merge(card, t); } },
  Djinn: { name: "Djinn", cost: 0, power: 1, text: "On Reveal: Next turn, you get +2 Energy.", token: true, onReveal: ({ state, p }) => { state.players[p].energyNext += 2; } },
  Ninja: { name: "Ninja", cost: 1, power: -2, text: "", token: true },
  Symbiote: { name: "Symbiote", cost: 4, power: 0, text: "", token: true },
};

function regenerate(h, p, card) {
  const opts = [0, 1, 2].filter(l => h.canPlace(p, l));   // any location with room, revealed or not
  const l = h.pick(opts);
  if (l != null) h.spawn("Wolverine", p, l, { power: card.power + 2, created: false });
}

Object.assign(CARDS, SERIES3, SERIES4, SERIES5);
export const CARD_IDS = Object.keys(CARDS);
export const POOL_IDS = CARD_IDS.filter(id => !CARDS[id].token);
for (const id of CARD_IDS) CARDS[id].id = id;
