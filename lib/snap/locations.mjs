// Marvel Snap locations (text as published by marvelsnapzone.com). A subset chosen because the engine
// can represent them faithfully; the rest of the 183 are listed in the README as not yet implemented.
//
// Hooks: power(state, li, p, card) per-card delta; locAdd(state, li, p); crossBonus(state, selfLi, li, p, myBase, theirBase)
//   canPlay(state, li, p, card); costMod(state, p, card); energyBonus(state, li, p); maxPlays(state, li); mustPlay(state, li)
//   onReveal(state, li, h); onStartTurn(state, li, h); onEndTurn(state, li, h); afterPlay(ctx); afterPlayAnywhere(ctx, playedLi)
//   onFlaggedPlay(ctx, flag); onMoveHere(ctx); onDestroyedHere(ctx); moveableTo(state, li)
//   beforeReveal(ctx) as a card is played here, before its On Reveal; afterDraw(state, li, h) once the turn's cards are drawn;
//   onEndTurnLate(state, li, h) after every location's onEndTurn
// Flags: cap, leastWins, ignoreWin, throne, clubhouse, noOngoing, noText, noReveal, repeatReveal, onslaught,
//   noDestroy, noMoveOut, doubleChanges, createdBonus, revealBonus, notFirstPlay, noRandom

import { effCost, hasRoom, cardPower, ldef, locCap, HAND_MAX } from "./engine.mjs";
import { GUARDIANS } from "./cards-series4.mjs";

const afterTurn = (n, fn) => (s, li, h) => { if (s.turn === n) fn(s, li, h); };
const each = (s, li, fn) => { for (let p = 0; p < 2; p++) for (const c of [...s.locations[li].cards[p]]) fn(c, p); };
const loser = (h, li) => { const w = h.winnerAt(li); return w === -1 ? null : 1 - w; };
const elsewhere = (s, h, li, p) => h.pick([0, 1, 2].filter(x => x !== li && hasRoom(s, x, p) && !ldef(s, x).noAdd?.(s, x)));   // a random other location p's card can move to
const thisTurn = (s, li) => s.locations[li].flags.turn === s.turn;   // true on the turn the location was revealed
const markTurn = (s, li) => { s.locations[li].flags.turn = s.turn; };
// put a random character from p's hand on p's side of li (Sakaar, Grand Central, Otto's Lab): placed, not played, like Doctor Octopus
const putFromHand = (s, h, li, p) => { const hand = s.players[p].hand; const c = h.pick(hand.filter(c => !h.def(c).skill)); if (!c || !h.canPlace(p, li)) return; hand.splice(hand.indexOf(c), 1); h.place(p, li, c); };
// "First to ...": checked after each play here (the player who just played has priority) and at the end of the turn; paid once
const firstTo = (s, li, h, test, pref, prize) => { const F = s.locations[li].flags; if (F.won) return; const who = [0, 1].filter(p => test(s.locations[li].cards[p].length, locCap(s, li))); if (!who.length) return; F.won = true; prize(s, who.includes(pref) ? pref : h.pick(who), h); };
const race = (test, prize) => ({ afterPlay: ({ state, li, p, h }) => firstTo(state, li, h, test, p, prize), onEndTurn: (s, li, h) => firstTo(s, li, h, test, null, prize) });
// Sanctum Infinitum: a player whose side is full gets the card the location discarded back with +5 Power
const infinitum = (s, li, h) => { const F = s.locations[li].flags; for (let p = 0; p < 2; p++) { const uid = F.held?.[p]; if (!uid || s.locations[li].cards[p].length < locCap(s, li)) continue; const pile = s.discardPile[p]; const i = pile.findIndex(c => c.uid === uid); if (i < 0) { F.held[p] = null; continue; } if (s.players[p].hand.length >= HAND_MAX) continue; const [c] = pile.splice(i, 1); F.held[p] = null; h.addToHand(p, c); h.addPower(c, 5); } };
let tunnelling = false;   // Quantum Tunnel is playing the card it pulled from the deck
let measuring = false;   // Monster Metropolis compares real Power; its own +3 is left out while it measures

export const LOCATIONS = {
  unknown: { name: "Unrevealed", text: "", noRandom: true },
  Ruins: { name: "Ruins", text: "", noRandom: true, cap: 0 },
  Flooded: { name: "Flooded", text: "Cards can't be played here.", canPlay: (s, li) => s.locations[li].closedAfter != null, noRandom: true },

  // ---- flat power ----
  Xandar: { name: "Xandar", text: "Cards here have +1 Power.", power: () => 1 },
  SewerSystem: { name: "Sewer System", text: "Cards here have -1 Power.", power: () => -1 },
  Necrosha: { name: "Necrosha", text: "Cards here have -2 Power.", power: () => -2 },
  NegativeZone: { name: "Negative Zone", text: "Cards here have -3 Power.", power: () => -3 },
  Nidavellir: { name: "Nidavellir", text: "Cards here have +5 Power.", power: () => 5 },
  LakeHellas: { name: "Lake Hellas", text: "1-Cost cards here have +2 Power.", power: (s, li, p, c) => c.cost === 1 ? 2 : 0 },
  WashingtonDC: { name: "Washington D.C.", text: "Cards here with no abilities have +3 Power.", washington: true },
  Atlantis: { name: "Atlantis", text: "If you only have one card here, it has +5 Power.", power: (s, li, p) => s.locations[li].cards[p].length === 1 ? 5 : 0 },
  Proscenium: { name: "Proscenium", text: "Cards reveal here with +2 Power.", revealBonus: 2 },
  MonsterMetropolis: { name: "Monster Metropolis", text: "The card(s) with the highest Power here get +3 Power.",
    power: (s, li, p, c) => {
      if (measuring) return 0;
      measuring = true;
      try { let mx = -Infinity; each(s, li, (x, q) => { mx = Math.max(mx, cardPower(s, li, q, x)); }); return cardPower(s, li, p, c) === mx ? 3 : 0; } finally { measuring = false; }
    } },
  SmithsonianMuseum: { name: "Smithsonian Museum", text: "Your cards here have +1 Power for each Ongoing among them.", smithsonian: true },

  // ---- win rules and cross-location ----
  BarWithNoName: { name: "Bar With No Name", text: "Whoever has the least Power here wins.", leastWins: true },
  Cancun: { name: "Cancun", text: "Power here doesn't count toward winning the game.", ignoreWin: true },
  Mojoworld: { name: "Mojoworld", text: "Whoever has more cards here gets +100 Power.",
    locAdd: (s, li, p) => s.locations[li].cards[p].length > s.locations[li].cards[1 - p].length ? 100 : 0 },
  BaxterBuilding: { name: "Baxter Building", text: "Whoever is winning this location gets +4 Power at the others.",
    crossBonus: (s, self, li, p, mine, theirs) => mine > theirs ? 4 : 0 },
  CrownCity: { name: "Crown City", text: "Whoever is winning here gets +4 Power at adjacent locations.",
    crossBonus: (s, self, li, p, mine, theirs) => mine > theirs && Math.abs(self - li) === 1 ? 4 : 0 },
  TheNexus: { name: "The Nexus", text: "Your Power here is granted to other locations as well.", crossBonus: (s, self, li, p, mine) => mine },
  WakandanThroneRoom: { name: "Throne Room", text: "The highest-Power card(s) here have their Power doubled.", throne: true },
  Clubhouse: { name: "Clubhouse", text: "Fill this to give your cards at other locations +1 Power.", clubhouse: true },

  // ---- rule changes ----
  IsleOfSilence: { name: "Isle of Silence", text: "Ongoing effects are disabled here.", noOngoing: true },
  DeepSpace: { name: "Deep Space", text: "Card text is disabled here.", noText: true, noOngoing: true, noReveal: true },
  Knowhere: { name: "Knowhere", text: "On Reveal effects do not happen at this location.", noReveal: true },
  KamarTaj: { name: "Kamar-Taj", text: "On Reveal effects at this location repeat.", repeatReveal: true },
  OnslaughtsCitadel: { name: "Onslaught's Citadel", text: "Ongoing effects here apply an additional time.", onslaught: true },
  Wakanda: { name: "Wakanda", text: "Cards here can't be destroyed.", noDestroy: true },
  IslandPrison: { name: "Island Prison", text: "Cards here can't move.", noMoveOut: true },
  Hospice: { name: "Hospice", text: "Changes to card Power are doubled here.", doubleChanges: true },
  Panoptichron: { name: "Panoptichron", text: "Created cards here have +2 Power.", power: (s, li, p, c) => c.created ? 2 : 0 },
  FiskTower: { name: "Fisk Tower", text: "When a card moves here, afflict it with -4 Power.", onMoveHere: ({ h, card }) => h.addPower(card, -4) },
  KunLun: { name: "K'un-Lun", text: "When a card moves here, give it +2 Power.", onMoveHere: ({ h, card }) => h.addPower(card, 2) },
  NewYork: { name: "New York", text: "On turn 6, cards are Moveable to here.", moveableTo: (s) => s.turn === 6 },
  Limbo: { name: "Limbo", text: "There is a turn 7 this game.", extraTurn: true },
  Sandcastle: { name: "Sandcastle", text: "After turn 5, end the game.", endsAfter: 5 },
  Tva: { name: "TVA", text: "After turn 4, end the game.", endsAfter: 4 },
  MountVesuvius: { name: "Mount Vesuvius", text: "Players can't retreat after turn 5.", noRetreatAfter: 5 },
  Mindscape: { name: "Mindscape", text: "At the start of turn 6, swap hands.",
    onStartTurn: (s) => { if (s.turn === 6) { const a = s.players[0].hand, b = s.players[1].hand; s.players[0].hand = b.map(c => ({ ...c, owner: 0 })); s.players[1].hand = a.map(c => ({ ...c, owner: 1 })); } } },
  Westview: { name: "Westview", text: "Turns into a new location on turn 4.", onStartTurn: (s, li, h) => { if (s.turn === 4) h.replaceLocation(li); } },
  WorldForge: { name: "World Forge", text: "Replace one of the other locations each turn.",
    onStartTurn: (s, li, h) => { const o = h.pick([0, 1, 2].filter(l => l !== li)); if (o != null) h.replaceLocation(o); } },
  Worldship: { name: "Worldship", text: "Destroy the other locations.", onReveal: (s, li, h) => { for (let l = 0; l < 3; l++) if (l !== li) h.ruin(l); } },
  LosDiablos: { name: "Los Diablos Base", text: "After turn 3, ruin a random location.", onEndTurn: afterTurn(3, (s, li, h) => h.ruin(h.randInt(3))) },

  // ---- play restrictions ----
  TheBigHouse: { name: "The Big House", text: "Cards that cost 4 or more can't be played here.", canPlay: (s, li, p, c) => !c || effCost(s, p, c) < 4 },
  CrimsonCosmos: { name: "Crimson Cosmos", text: "Cards that cost 3 or less can't be played here.", canPlay: (s, li, p, c) => !c || effCost(s, p, c) > 3 },
  HellfireClub: { name: "Hellfire Club", text: "Cards that cost 1 can't be played here.", canPlay: (s, li, p, c) => !c || effCost(s, p, c) !== 1 },
  PitOfExile: { name: "Pit of Exile", text: "Cards with 10 or more Power can't be played here.", canPlay: (s, li, p, c) => !c || c.power < 10 },
  Kyln: { name: "Kyln", text: "You can't play cards here after turn 4.", canPlay: (s) => s.turn <= 4 },
  Vault: { name: "The Vault", text: "On turn 6, cards can't be played here.", canPlay: (s) => s.turn !== 6 },
  SanctumSanctorum: { name: "Sanctum Sanctorum", text: "Cards can't be played here.", canPlay: () => false },
  MiniaturizedLab: { name: "Miniaturized Lab", text: "On turns 3, 4, and 5, no cards can be added here.", canPlay: (s) => s.turn < 3 || s.turn > 5, noAdd: (s) => s.turn >= 3 && s.turn <= 5 },
  BrooklynBridge: { name: "Brooklyn Bridge", text: "You can't play cards here 2 turns in a row.", canPlay: (s, li, p) => s.turn === 1 || s.players[p].lastPlayedTurnAt[li] !== s.turn - 1 },
  Morag: { name: "Morag", text: "You can't play your first card here each turn.", notFirstPlay: true },
  SpaceThrone: { name: "The Space Throne", text: "Only one card can be here for each player.", cap: 1 },
  AvengersCompound: { name: "Avengers Compound", text: "On turn 5, all cards must be played here.", mustPlay: (s) => s.turn === 5 },
  ParkerIndustries: { name: "Parker Industries", text: "+2 Energy this turn, but you can only play 1 card.",
    onReveal: (s, li) => { s.locations[li].flags.turn = s.turn; }, energyBonus: (s, li) => thisTurn(s, li) ? 2 : 0, maxPlays: (s, li) => thisTurn(s, li) ? 1 : 99 },

  // ---- cost and energy ----
  Elysium: { name: "Elysium", text: "Cards cost 1 less.", costMod: () => -1 },
  Titan: { name: "Titan", text: "6-Cost cards cost 1 less.", costMod: (s, p, c) => c.cost === 6 ? -1 : 0 },
  Utopia: { name: "Utopia", text: "3 and 4-Cost cards cost 1 less.", costMod: (s, p, c) => c.cost === 3 || c.cost === 4 ? -1 : 0 },
  DreamDimension: { name: "Dream Dimension", text: "On turn 5, cards cost 1 more.", costMod: (s) => s.turn === 5 ? 1 : 0 },
  ProjectPegasus: { name: "Project Pegasus", text: "+5 Energy this turn.", onReveal: (s, li) => { s.locations[li].flags.turn = s.turn; }, energyBonus: (s, li) => thisTurn(s, li) ? 5 : 0 },
  TinkerersWorkshop: { name: "Tinkerer's Workshop", text: "+1 Energy this turn.", onReveal: (s, li) => { s.locations[li].flags.turn = s.turn; }, energyBonus: (s, li) => thisTurn(s, li) ? 1 : 0 },
  EmpireStateUniversity: { name: "Empire State University", text: "On turn 6, get +2 Energy.", energyBonus: (s) => s.turn === 6 ? 2 : 0 },
  ReedsLab: { name: "Reed's Lab", text: "+1 Energy each turn if your side here is full.", energyBonus: (s, li, p) => s.locations[li].cards[p].length >= 4 ? 1 : 0 },
  CastleBlackstone: { name: "Castle Blackstone", text: "The player winning here gets +1 Energy each turn.", energyBonus: (s, li, p, h) => h.winnerAt(li) === p ? 1 : 0 },
  Superflow: { name: "The Superflow", text: "If you have no cards here, +1 energy each turn.", energyBonus: (s, li, p) => s.locations[li].cards[p].length === 0 ? 1 : 0 },
  Feast: { name: "F.E.A.S.T.", text: "After you play a card here, ALL players get +1 Energy next turn.", afterPlay: ({ state }) => state.players.forEach(pl => { pl.energyNext += 1; }) },
  AltarOfDeath: { name: "Altar of Death", text: "After you play a card here, destroy it to get +2 Energy next turn.",
    afterPlay: ({ state, p, card, h }) => { const w = h.where(card.uid); if (h.destroy(w.p, w.li, card.uid)) state.players[p].energyNext += 2; } },

  // ---- on reveal ----
  CentralPark: { name: "Central Park", text: "Add a Squirrel to each location.", onReveal: (s, li, h) => { for (let l = 0; l < 3; l++) for (let p = 0; p < 2; p++) h.spawn("Squirrel", p, l); } },
  NovaRoma: { name: "Nova Roma", text: "Draw a card.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) h.draw(p); } },
  Olympia: { name: "Olympia", text: "Draw 2 cards.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) h.draw(p, 2); } },
  HellsKitchen: { name: "Hell's Kitchen", text: "Draw a 1-Cost card from your deck.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) h.draw(p, 1, c => c.cost === 1); } },
  FrontierOutpost: { name: "Frontier Outpost", text: "Draw a 3-Cost card from your deck.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) h.draw(p, 1, c => c.cost === 3); } },
  Subterranea: { name: "Subterranea", text: "Shuffle 4 rocks into each deck.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) { for (let i = 0; i < 4; i++) s.players[p].deck.push(h.make("Rock", p)); h.shuffle(s.players[p].deck); } } },
  TheHub: { name: "The Hub", text: "Add a random card to each player's hand.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) h.addToHand(p, h.make(h.randomPoolId(), p)); } },
  CampLehigh: { name: "Camp Lehigh", text: "Add a random 3-Cost card to each player's hand.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) h.addToHand(p, h.make(h.randomPoolId(d => d.cost === 3), p)); } },
  GreatPortal: { name: "Great Portal", text: "Add a random card with 10 or more Power to your hand.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) h.addToHand(p, h.make(h.randomPoolId(d => d.power >= 10), p)); } },
  MonsterIsland: { name: "Monster Island", text: "Add a 10-Power Monster here for each player.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) h.spawn("Monster", p, li); } },
  SavageLand: { name: "Savage Land", text: "Add two Raptors on each side of this location.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) { h.spawn("Raptor", p, li); h.spawn("Raptor", p, li); } } },
  Sokovia: { name: "Sokovia", text: "Discard a card from each player's hand.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) { const c = h.pick(s.players[p].hand); if (c) h.discard(p, c); } } },
  WakandanEmbassy: { name: "Wakandan Embassy", text: "Give +2 Power to cards in players' hands.", onReveal: (s) => s.players.forEach(pl => pl.hand.forEach(c => { c.power += 2; })) },
  Weirdworld: { name: "Weirdworld", text: "Draw 2 cards from your opponent's deck.",
    onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) for (let i = 0; i < 2; i++) { const c = s.players[1 - p].deck.shift(); if (!c) break; if (!h.addToHand(p, c)) { c.owner = 1 - p; s.players[1 - p].deck.unshift(c); } } } },
  WhitePalace: { name: "White Palace", text: "Copy the highest-Cost card in your opponent's hand.",
    onReveal: (s, li, h) => { const hands = s.players.map(pl => [...pl.hand]); for (let p = 0; p < 2; p++) { const hand = hands[1 - p]; if (!hand.length) continue; const mx = Math.max(...hand.map(c => c.cost)); const src = h.pick(hand.filter(c => c.cost === mx)); h.addToHand(p, h.make(src.id, p, { cost: src.cost, power: src.power })); } } },
  DailyBugle: { name: "Daily Bugle", text: "Get a copy of a card in your opponent's hand.",
    onReveal: (s, li, h) => { const hands = s.players.map(pl => [...pl.hand]); for (let p = 0; p < 2; p++) { const src = h.pick(hands[1 - p]); if (src) h.addToHand(p, h.make(src.id, p, { cost: src.cost, power: src.power })); } } },
  TheIceBox: { name: "The Ice Box", text: "Give a card in each player's hand +1 Cost.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) { const hand = s.players[p].hand; const low = hand.filter(c => c.cost < 6); const c = h.pick(low.length ? low : hand); if (c) c.cost += 1; } } },   // avoids 6-Cost cards unless there is nothing else

  // ---- after you play here ----
  DeathsDomain: { name: "Death's Domain", text: "After you play a card here, destroy it.", afterPlay: ({ h, card }) => { const w = h.where(card.uid); h.destroy(w.p, w.li, card.uid); } },
  ShurisLab: { name: "Shuri's Lab", text: "After you play a card here, double its Power.", afterPlay: ({ card }) => { card.power *= 2; } },
  LukesBar: { name: "Luke's Bar", text: "After you play a card here, return it to your hand.", afterPlay: ({ h, p, li, card }) => h.returnToHand(p, li, card) },
  CloningVats: { name: "Cloning Vats", text: "After you play a card here, add a copy to your hand.", afterPlay: ({ h, p, card }) => h.addToHand(p, h.make(card.id, p, { cost: card.cost, power: card.power })) },
  Machineworld: { name: "Machineworld", text: "After you play a card here, add a copy to the opponent's hand.", afterPlay: ({ h, p, card }) => h.addToHand(1 - p, h.make(card.id, 1 - p, { cost: card.cost, power: card.power })) },
  SinisterLondon: { name: "Sinister London", text: "After you play a card here, add a copy to another location.",
    afterPlay: ({ h, p, li, card }) => { const l = h.pick([0, 1, 2].filter(x => x !== li && h.canPlace(p, x))); if (l != null) h.spawn(card.id, p, l, { cost: card.cost, power: card.power }); } },
  OrchisForge: { name: "Orchis Forge", text: "After you play a card here, add a Sentinel to your hand.", afterPlay: ({ h, p }) => h.addToHand(p, h.make("Sentinel", p)) },
  BarSinister: { name: "Bar Sinister", text: "After you play a card here, fill this location with copies of it.", afterPlay: ({ h, li, card }) => { const side = h.where(card.uid).p; while (h.spawn(card.id, side, li, { cost: card.cost, power: card.power })); } },
  SpiderIsland: { name: "Spider Island", text: "After you play a card here, move it.",
    afterPlay: ({ state, h, p, li, card }) => { const l = elsewhere(state, h, li, p); if (l != null) h.move(p, li, l, card); } },
  DangerRoom: { name: "Danger Room", text: "Cards played here have a 25% chance to be destroyed.", afterPlay: ({ h, p, li, card }) => { if (h.rand() < 0.25) h.destroy(p, li, card.uid); } },
  QuantumRealm: { name: "Quantum Realm", text: "After you play a card here, set its base Power to 2.", afterPlay: ({ card }) => { card.power = 2; } },
  HotelInferno: { name: "Hotel Inferno", text: "After you play a card here this turn, banish the top card of your opponent's deck.", onReveal: (s, li) => { s.locations[li].flags.turn = s.turn; },
    afterPlay: ({ state, p, li }) => { if (state.locations[li].flags.turn === state.turn) state.players[1 - p].deck.shift(); } },
  Lechuguilla: { name: "Lechuguilla", text: "After you play a card here, shuffle 3 rocks into your deck.", afterPlay: ({ state, p, h }) => { for (let i = 0; i < 3; i++) state.players[p].deck.push(h.make("Rock", p)); h.shuffle(state.players[p].deck); } },
  AsteroidM: { name: "Asteroid M", text: "After you play a 3 or 4-Cost card, move it here.",
    afterPlayAnywhere: ({ h, p, li, card }, from) => { if (from !== li && (card.cost === 3 || card.cost === 4)) h.move(p, from, li, card); } },
  Vormir: { name: "Vormir", text: "The next card you play here is destroyed.", onReveal: (s, li) => { s.locations[li].flags.nextPlay = ["destroy", "destroy"]; },
    onFlaggedPlay: ({ h, p, li, card }, f) => { if (f === "destroy") h.destroy(p, li, card.uid); } },
  CastleZemo: { name: "Castle Zemo", text: "The next card you play here switches sides.", onReveal: (s, li) => { s.locations[li].flags.nextPlay = ["switch", "switch"]; },
    onFlaggedPlay: ({ h, li, card }, f) => { if (f === "switch") h.switchSides(li, card); } },
  AuntMays: { name: "Aunt May's", text: "The next card you play here gains +3 Power and moves.", onReveal: (s, li) => { s.locations[li].flags.nextPlay = ["mays", "mays"]; },
    onFlaggedPlay: ({ state, h, p, li, card }, f) => { if (f !== "mays") return; h.addPower(card, 3); const l = elsewhere(state, h, li, p); if (l != null) h.move(p, li, l, card); } },

  // ---- end of turn ----
  MuirIsland: { name: "Muir Island", text: "End of Turn: Give cards here +1 Power.", onEndTurn: (s, li, h) => each(s, li, c => h.addPower(c, 1)) },
  Jotunheim: { name: "Jotunheim", text: "End of Turn: Cards here lose 1 Power.", onEndTurn: (s, li, h) => each(s, li, c => h.addPower(c, -1)) },
  Madripoor: { name: "Madripoor", text: "End of Turn: Give each highest-Cost card here +2 Power.",
    onEndTurn: (s, li, h) => { let mx = -1; each(s, li, c => { mx = Math.max(mx, c.cost); }); each(s, li, c => { if (c.cost === mx) h.addPower(c, 2); }); } },
  Boardwalk: { name: "Boardwalk", text: "End of Turn: Give the lowest-Power card(s) here +1 Power.",
    onEndTurn: (s, li, h) => { const low = []; let mn = Infinity; each(s, li, (c, p) => { const pw = h.cardPower(li, p, c); if (pw < mn) { mn = pw; low.length = 0; } if (pw === mn) low.push(c); }); low.forEach(c => h.addPower(c, 1)); } },
  RicketyBridge: { name: "Rickety Bridge", text: "End of Turn: If there is more than one card here, destroy them.",
    onEndTurn: (s, li, h) => { if (s.locations[li].cards[0].length + s.locations[li].cards[1].length > 1) each(s, li, (c, p) => h.destroy(p, li, c.uid)); } },
  WarriorFalls: { name: "Warrior Falls", text: "End of Turn: Cards here FIGHT! Destroy the weakest one(s).",
    onEndTurn: (s, li, h) => { const all = []; each(s, li, (c, p) => all.push({ c, p, pw: h.cardPower(li, p, c) })); if (all.length < 2) return; const mn = Math.min(...all.map(x => x.pw)); all.filter(x => x.pw === mn).forEach(x => h.destroy(x.p, li, x.c.uid)); } },
  Yggdrasil: { name: "Yggdrasil", text: "End of Turn: Give ALL cards at another location +1 Power.",
    onEndTurn: (s, li, h) => { const l = h.pick([0, 1, 2].filter(x => x !== li)); if (l != null) each(s, l, c => h.addPower(c, 1)); } },
  Murderworld: { name: "Murderworld", text: "After turn 3, destroy all cards here.", onEndTurn: afterTurn(3, (s, li, h) => each(s, li, (c, p) => h.destroy(p, li, c.uid))) },
  GammaLab: { name: "Gamma Lab", text: "After turn 3, transform all cards here into the Hulk.", onEndTurn: afterTurn(3, (s, li, h) => each(s, li, c => h.transform(c, "Hulk"))) },
  Hala: { name: "Hala", text: "After turn 4, destroy all cards on the losing side here.", onEndTurn: afterTurn(4, (s, li, h) => { const l = loser(h, li); if (l != null) for (const c of [...s.locations[li].cards[l]]) h.destroy(l, li, c.uid); }) },
  Genosha: { name: "Genosha", text: "After turn 5, all but your highest-Cost here are destroyed.",
    onEndTurn: afterTurn(5, (s, li, h) => { for (let p = 0; p < 2; p++) { const cs = s.locations[li].cards[p]; if (!cs.length) continue; const mx = Math.max(...cs.map(c => c.cost)); for (const c of [...cs]) if (c.cost !== mx) h.destroy(p, li, c.uid); } }) },
  StarkTower: { name: "Stark Tower", text: "After turn 5, give all cards here +2 Power.", onEndTurn: afterTurn(5, (s, li, h) => each(s, li, c => h.addPower(c, 2))) },
  ThunderboltsTower: { name: "Thunderbolts Tower", text: "After turn 5, give all cards here -2 Power.", onEndTurn: afterTurn(5, (s, li, h) => each(s, li, c => h.addPower(c, -2))) },
  RocketPad: { name: "Rocket Pad", text: "After turn 4, give cards on the winning side here +1 Power.", onEndTurn: afterTurn(4, (s, li, h) => { const w = h.winnerAt(li); if (w !== -1) s.locations[li].cards[w].forEach(c => h.addPower(c, 1)); }) },
  OscorpTower: { name: "Oscorp Tower", text: "After turn 3, all cards here switch sides.",
    onEndTurn: afterTurn(3, (s, li, h) => { const a = s.locations[li].cards[0], b = s.locations[li].cards[1]; s.locations[li].cards = [b.map(c => ({ ...c, owner: 0 })), a.map(c => ({ ...c, owner: 1 }))]; }) },
  Bifrost: { name: "The Bifrost", text: "After turn 4, move all cards one location to the right.",
    onEndTurn: afterTurn(4, (s, li, h) => { for (let l = 1; l >= 0; l--) for (let p = 0; p < 2; p++) for (const c of [...s.locations[l].cards[p]]) h.move(p, l, l + 1, c); }) },
  StrangeAcademy: { name: "Strange Academy", text: "After turn 5, move all cards here to other random locations.",
    onEndTurn: afterTurn(5, (s, li, h) => each(s, li, (c, p) => { const l = elsewhere(s, h, li, p); if (l != null) h.move(p, li, l, c); })) },
  Asgard: { name: "Asgard", text: "After turn 4, whoever is winning here draws 2 cards.", onEndTurn: afterTurn(4, (s, li, h) => { const w = h.winnerAt(li); if (w !== -1) h.draw(w, 2); }) },
  EternityRange: { name: "Eternity Range", text: "After turn 3, add a Rock to the losing player's side.", onEndTurn: afterTurn(3, (s, li, h) => { const l = loser(h, li); if (l != null) h.spawn("Rock", l, li); }) },
  StarkIndustries: { name: "Stark Industries", text: "After turn 4, split +8 Power among ALL cards here.",
    onEndTurn: afterTurn(4, (s, li, h) => { const all = []; each(s, li, c => all.push(c)); if (!all.length) return; for (let i = 0; i < 8; i++) h.addPower(all[i % all.length], 1); }) },
  Camelot: { name: "Camelot", text: "After turn 5, set all cards here to 5 Power.", onEndTurn: afterTurn(5, (s, li) => each(s, li, c => { c.power = 5; })) },
  Attilan: { name: "Attilan", text: "After turn 3, shuffle your hand into your deck. Draw 3 cards.",
    onEndTurn: afterTurn(3, (s, li, h) => { for (let p = 0; p < 2; p++) { const pl = s.players[p]; pl.deck.push(...pl.hand); pl.hand = []; h.shuffle(pl.deck); h.draw(p, 3); } }) },
  XMansion: { name: "X-Mansion", text: "After turn 3, add a random card here for each player.", onEndTurn: afterTurn(3, (s, li, h) => { for (let p = 0; p < 2; p++) h.spawn(h.randomCharId(), p, li); }) },
  CaveOfTheDragon: { name: "Cave of The Dragon", text: "After turn 4, add a random 5-Cost+ card to each side.", onEndTurn: afterTurn(4, (s, li, h) => { for (let p = 0; p < 2; p++) h.spawn(h.randomCharId(d => d.cost >= 5), p, li); }) },
  AsgardBesieged: { name: "Asgard Besieged", text: "After turn 3, add The Destroyer to the winning side.", onEndTurn: afterTurn(3, (s, li, h) => { const w = h.winnerAt(li); if (w !== -1) h.spawn("Destroyer", w, li); }) },
  Valhalla: { name: "Valhalla", text: "After turn 4, cards here repeat their On Reveal abilities.", onEndTurn: afterTurn(4, (s, li, h) => each(s, li, (c, p) => h.revealAgain(p, li, c))) },

  // =====================================================================================================
  // second batch: the remaining released locations
  // =====================================================================================================
  // ---- rule changes ----
  Ego: { name: "Ego", text: "Ego takes over and plays your cards for you.", ego: true },   // engine.egoControls: the AI plays both sides while this is revealed
  DarkDimension: { name: "Dark Dimension", text: "Cards here are not revealed until the game ends.",
    beforeReveal: ({ card, h }) => { if (!card.hiddenUntilEnd) { card.hiddenUntilEnd = true; h.log(`${h.name(card)} stays face down`); } } },
  Lemuria: { name: "Lemuria", text: "No cards are revealed this turn.", onReveal: (s) => { s.noRevealTurn = s.turn; } },
  FogwellsGym: { name: "Fogwell's Gym", text: "Both players get double Boosters this game." },   // Boosters are outside the match: no gameplay effect
  Flooding: { name: "Flooding", text: "This is the last turn cards can be played here.", noRandom: true,   // Storm's intermediate location, never a starting one
    onReveal: (s, li) => { const L = s.locations[li]; if (L.closedAfter == null) L.closedAfter = s.resolving ? s.turn + 1 : s.turn; } },
  UtnapishtimsArk: { name: "Eternals' Ark", text: "After turn 5, flood the other locations.", onEndTurn: afterTurn(5, (s, li, h) => { for (let l = 0; l < 3; l++) if (l !== li && s.locations[l].id !== "Flooded") h.replaceLocation(l, "Flooded"); }) },
  MirrorDimension: { name: "Mirror Dimension", text: "On turn 4, transform into one of the other locations.",
    onStartTurn: (s, li, h) => { if (s.turn !== 4) return; const o = h.pick([0, 1, 2].filter(l => l !== li && s.locations[l].id !== "Ruins")); if (o == null) return; const src = s.locations[o]; h.replaceLocation(li, src.id); s.locations[li].closedAfter = src.closedAfter; } },
  StarlightCitadel: { name: "Starlight Citadel", text: "After turn 4, swap the position of each location.",
    onEndTurnLate: (s, li, h) => { if (s.turn !== 4 || s.citadelTurn === s.turn) return; s.citadelTurn = s.turn; h.swapLocations(0, 1); h.swapLocations(h.rand() < 0.5 ? 0 : 1, 2); } },   // two different swaps: every location ends up somewhere new
  PetAvengersMansion: { name: "Pet Mansion", text: "This turn, all cards must be played here.", onReveal: markTurn, mustPlay: (s, li) => thisTurn(s, li) },
  TheSandbar: { name: "The Sandbar", text: "Created cards cost 1 more. (max 6)", costMod: (s, p, c) => c.created && c.cost < 6 ? 1 : 0 },
  FracturedFrontier: { name: "Fractured Frontier", text: "Your rightmost card has -2 Cost this turn.", onReveal: markTurn,
    afterDraw: (s, li) => { if (thisTurn(s, li)) for (const pl of s.players) { const c = pl.hand[pl.hand.length - 1]; if (c) c.frontierTurn = s.turn; } },   // the rightmost card once the turn's draw is in hand
    costMod: (s, p, c) => c.frontierTurn === s.turn ? -2 : 0 },
  StarBrandCrater: { name: "Star Brand Crater", text: "If you have 10 or more Power here, +1 Energy each turn.", energyBonus: (s, li, p, h) => h.locPower(li, p) >= 10 ? 1 : 0 },
  JosiesBar: { name: "Josie's Bar", text: "Playing 2 cards here in a turn reveals them with +2 Power.", beforeReveal: ({ state, p, li, card, h }) => { if (state.players[p].playedThisTurn[li] >= 2) h.addPower(card, 2); } },
  TimeTheater: { name: "Time Theater", text: "Instead of your next draw, copy the last card you drew.", onReveal: (s) => s.players.forEach(pl => { pl.copyNextDraw = true; }) },   // engine drawCard

  // ---- on reveal ----
  Ebonshire: { name: "Ebonshire", text: "Draw the bottom card of your deck.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) { const d = s.players[p].deck; const last = d[d.length - 1]; if (last) h.draw(p, 1, c => c === last); } } },
  ChronosphereSphinx: { name: "Chronosphere Sphinx", text: "Copy the highest-Cost card in your deck into your hand.",
    onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) { const d = s.players[p].deck; if (!d.length) continue; const mx = Math.max(...d.map(c => c.cost)); const src = h.pick(d.filter(c => c.cost === mx)); h.addToHand(p, h.make(src.id, p, { cost: src.cost, power: src.power })); } } },
  CelestialBurialGround: { name: "Celestial Burial Ground", text: "Discard a card. Replace it with one of the same Cost.",
    onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) { const c = h.pick(s.players[p].hand); if (!c || !h.discard(p, c)) continue; const id = h.randomPoolId(d => d.cost === c.cost && d.id !== c.id); if (id) h.addToHand(p, h.make(id, p)); } } },
  WeaponXFacility: { name: "Weapon X Facility", text: "Discard a card to draw a card.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) { const c = h.pick(s.players[p].hand); if (c && h.discard(p, c)) h.draw(p); } } },
  SanctumInfinitum: { name: "Sanctum Infinitum", text: "Discard a card. Fill this to return it with +5 Power.",
    onReveal: (s, li, h) => { const held = [null, null]; for (let p = 0; p < 2; p++) { const c = h.pick(s.players[p].hand); if (c && h.discard(p, c)) held[p] = c.uid; } s.locations[li].flags.held = held; infinitum(s, li, h); },
    afterPlay: ({ state, li, h }) => infinitum(state, li, h), onEndTurn: infinitum, onStartTurn: infinitum },
  ThePeak: { name: "The Peak", text: "Steal the leftmost card from your opponent's hand.",
    onReveal: (s, li, h) => { const a = s.players[0].hand.shift(), b = s.players[1].hand.shift(); if (b && !h.addToHand(0, b)) { b.owner = 1; s.players[1].hand.unshift(b); } if (a && !h.addToHand(1, a)) { a.owner = 0; s.players[0].hand.unshift(a); } } },
  Triskelion: { name: "The Triskelion", text: "Fill each player's hand with random cards.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) for (let i = 0; i < HAND_MAX && s.players[p].hand.length < HAND_MAX; i++) h.addToHand(p, h.make(h.randomPoolId(), p)); } },
  Milano: { name: "Milano", text: "Add a member of the Guardians crew to your hand.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) h.addToHand(p, h.make(h.pick(GUARDIANS), p)); } },
  PizzaPlace: { name: "Pizza Place", text: "Add 2 Pizza Slices to your hand.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) for (let i = 0; i < 2; i++) h.addToHand(p, h.make("PizzaSlice", p)); } },
  TacoTruck: { name: "Taco Truck", text: "Add a Chimichanga to your hand.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) h.addToHand(p, h.make("Chimichanga", p)); } },
  DestroyedMansion: { name: "Destroyed Mansion", text: "Add a Rock here and a Vibranium to your hand.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) { h.spawn("Rock", p, li); h.addToHand(p, h.make("Vibranium", p)); } } },
  Shadowland: { name: "Shadowland", text: "Add a Ninja to each side with -2 Power.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) h.spawn("Ninja", p, li); } },
  Kvch: { name: "Kvch", text: "Add a random Activate card here for each player.", onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) { const id = h.randomCharId(d => !!d.activate); if (id) h.spawn(id, p, li); } } },
  ZennLa: { name: "Zenn-La", text: "Add a 3-Cost card from your deck here.",
    onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) { const d = s.players[p].deck; const c = h.pick(d.filter(c => c.cost === 3 && !h.def(c).skill)); if (c && h.canPlace(p, li)) { d.splice(d.indexOf(c), 1); h.place(p, li, c); } } } },
  CollapsedMine: { name: "Collapsed Mine", text: "Fill this location with Rocks. Skip a turn to destroy your Rocks.",
    onReveal: (s, li, h) => { for (let p = 0; p < 2; p++) while (h.spawn("Rock", p, li)); },
    // a skipped turn has no play, move or Activate; it clears your Rocks at every location (developer answers)
    onEndTurn: (s, li, h) => { for (let p = 0; p < 2; p++) { const pl = s.players[p]; if (pl.playedLastTurn || pl.usedMove === s.turn || pl.usedActivate === s.turn) continue; for (const x of h.board(p)) if (x.card.id === "Rock") h.destroy(p, x.li, x.card.uid); } } },
  Sakaar: { name: "Sakaar", text: "After this turn, put a card from each player's hand here.", onReveal: markTurn, onEndTurn: (s, li, h) => { if (thisTurn(s, li)) for (let p = 0; p < 2; p++) putFromHand(s, h, li, p); } },
  AstralPlane: { name: "Astral Plane", text: "After this turn, add a 0-Power copy of a card from hand here.", onReveal: markTurn,
    onEndTurn: (s, li, h) => { if (thisTurn(s, li)) for (let p = 0; p < 2; p++) { const c = h.pick(s.players[p].hand.filter(c => !h.def(c).skill)); if (c) h.spawn(c.id, p, li, { cost: c.cost, power: 0 }); } } },

  // ---- the next card you play here ----
  BlackVortex: { name: "Black Vortex", text: "The next card you play here becomes a random 6-Cost card.", onReveal: (s, li) => { s.locations[li].flags.vortex = [true, true]; },
    // it changes as it is played, so the new card's On Reveal is the one that happens
    beforeReveal: ({ state, p, li, card, h }) => { const F = state.locations[li].flags; if (!F.vortex?.[p]) return; F.vortex[p] = false; const id = h.randomCharId(d => d.cost === 6 && d.id !== card.id); if (id) h.transform(card, id); } },
  Krakoa: { name: "Krakoa", text: "Your next play here adds its Power to the top of your deck.", onReveal: (s, li) => { s.locations[li].flags.nextPlay = ["krakoa", "krakoa"]; },
    onFlaggedPlay: ({ state, h, p, card }, f) => { const top = state.players[p].deck[0]; if (f === "krakoa" && top) h.addPower(top, card.power); } },
  OttosLab: { name: "Otto's Lab", text: "The next card you play here pulls a card to the enemy side from their hand.", onReveal: (s, li) => { s.locations[li].flags.nextPlay = ["otto", "otto"]; },
    onFlaggedPlay: ({ state, h, p, li }, f) => { if (f === "otto") putFromHand(state, h, li, 1 - p); } },

  // ---- after you play here ----
  MotherMold: { name: "Mother Mold", text: "When you play a card here, add a Sentinel to your hand.", afterPlay: ({ h, p }) => h.addToHand(p, h.make("Sentinel", p)) },
  NoorDimension: { name: "Noor Dimension", text: "After you play a card here, add a Djinn to your hand.", afterPlay: ({ h, p }) => h.addToHand(p, h.make("Djinn", p)) },
  VibraniumMines: { name: "Vibranium Mines", text: "After you play here, shuffle 3 Vibranium into your deck.", afterPlay: ({ state, p, h }) => { for (let i = 0; i < 3; i++) state.players[p].deck.push(h.make("Vibranium", p)); h.shuffle(state.players[p].deck); } },
  Tarnax: { name: "Tarnax IV", text: "After you play a character here, transform it into another one of the same Cost.", afterPlay: ({ h, card }) => { const id = h.randomCharId(d => d.cost === card.cost && d.id !== card.id); if (id) h.transform(card, id); } },
  QuantumTunnel: { name: "Quantum Tunnel", text: "After you play a card here, swap it with a card in your deck.",
    afterPlay: ({ state, h, p, li, card }) => {
      if (tunnelling) return;   // the card that comes out is not swapped again
      const pl = state.players[p], w = h.where(card.uid);
      const next = h.pick(pl.deck.filter(c => !h.def(c).skill));
      if (!next || !w || w.p !== p || w.li !== li) return;
      pl.deck.splice(pl.deck.indexOf(next), 1); h.remove(p, li, card.uid); pl.deck.push(card); h.shuffle(pl.deck);
      h.log(`Quantum Tunnel swaps ${h.name(card)} for ${h.name(next)}`);
      tunnelling = true; try { h.playCard(p, li, next); } finally { tunnelling = false; }
    } },

  // ---- first to ... ----
  TheAbbey: { name: "The Abbey", text: "First to put exactly 2 cards here draws a card.", ...race(n => n === 2, (s, p, h) => h.draw(p)) },
  Raft: { name: "The Raft", text: "First to fill this breaks out a 6-Cost card. It costs 0.", ...race((n, cap) => n >= cap, (s, p, h) => { const id = h.randomPoolId(d => d.cost === 6); if (id) h.addToHand(p, h.make(id, p, { cost: 0 })); }) },
  SacredTimeline: { name: "The Sacred Timeline", text: "First to fill this gets a copy of their opening hand.", ...race((n, cap) => n >= cap, (s, p, h) => { for (const id of s.players[p].openingHand ?? []) h.addToHand(p, h.make(id, p)); }) },
  WhiteHotRoom: { name: "White Hot Room", text: "First to fill this gets +3 Max Energy.", ...race((n, cap) => n >= cap, (s, p) => { s.players[p].maxEnergyBonus += 3; }) },

  // ---- end of turn ----
  MoshPit: { name: "Mosh Pit", text: "End of Turn: Give front-row cards here +1 Power.", onEndTurn: (s, li, h) => { for (let p = 0; p < 2; p++) for (const c of h.frontRow(p, li)) h.addPower(c, 1); } },
  TheDeadlands: { name: "The Deadlands", text: "End of Turn: Horde +1.", onEndTurn: (s, li, h) => { for (let p = 0; p < 2; p++) h.horde(p, 1, li); } },
  TaLo: { name: "Ta Lo", text: "End of Turn: +1 Power to a character in each hand.", onEndTurn: (s, li, h) => { for (let p = 0; p < 2; p++) { const c = h.pick(s.players[p].hand.filter(c => !h.def(c).skill)); if (c) h.addPower(c, 1); } } },
  StarkIsland: { name: "Stark Island", text: "End of Turn: Give a card in each hand -1 Cost.", onEndTurn: (s, li, h) => { for (let p = 0; p < 2; p++) { const c = h.pick(s.players[p].hand.filter(c => c.cost > 0)); if (c) c.cost -= 1; } } },
  PyramidOfRamaTut: { name: "Pyramid of Rama-Tut", text: "End of Turn: Add a 3-Power Rock to hand if you have none there.", onEndTurn: (s, li, h) => { for (let p = 0; p < 2; p++) if (!s.players[p].hand.some(c => c.id === "Rock")) h.addToHand(p, h.make("Rock", p, { power: 3 })); } },
  GreatWeb: { name: "Great Web", text: "End of Turn: Move one card to the Web for a random player.",
    // a player who has a card that can move here, then one of that player's cards (developer answer)
    onEndTurn: (s, li, h) => { for (const p of h.shuffle([0, 1])) { if (!hasRoom(s, li, p)) continue; for (const x of h.shuffle(h.board(p).filter(x => x.li !== li))) if (h.move(p, x.li, li, x.card)) return; } } },
  GrandCentral: { name: "Grand Central", text: "After turn 5, put a card from each player's hand here.", onEndTurn: afterTurn(5, (s, li, h) => { for (let p = 0; p < 2; p++) putFromHand(s, h, li, p); }) },
  CelestialCircuit: { name: "Celestial Circuit", text: "After turn 4, give your hand -1 Cost if 12+ Power here.", onEndTurn: afterTurn(4, (s, li, h) => { for (let p = 0; p < 2; p++) if (h.locPower(li, p) >= 12) for (const c of s.players[p].hand) c.cost = Math.max(0, c.cost - 1); }) },
  SakaarGrandPrix: { name: "Sakaar Grand Prix", text: "After turn 4, the winner here gets +1 Max Energy.", onEndTurn: afterTurn(4, (s, li, h) => { const w = h.winnerAt(li); if (w !== -1) s.players[w].maxEnergyBonus += 1; }) },
  SurvivorsCamp: { name: "Survivor's Camp", text: "After turn 4, draw if you're winning here. If not, Horde +2.", onEndTurn: afterTurn(4, (s, li, h) => { const w = h.winnerAt(li); for (let p = 0; p < 2; p++) { if (w === p) h.draw(p); else h.horde(p, 2, li); } }) },
  EssexsLab: { name: "EssexsLab", text: "After turn 4, destroy a card. Your others here split its Power.",
    onEndTurn: afterTurn(4, (s, li, h) => { for (let p = 0; p < 2; p++) { const v = h.pick(s.locations[li].cards[p]); if (!v) continue; const pw = v.power; if (!h.destroy(p, li, v.uid)) continue; const rest = [...s.locations[li].cards[p]]; if (rest.length) for (let i = 0; i < pw; i++) h.addPower(rest[i % rest.length], 1); } }) },
  Klyntar: { name: "Klyntar", text: "After turn 4, merge your cards here into a Symbiote.",
    // the Symbiote is a 4/0 that receives the merged cards' Power as a modifier (developer answer)
    onEndTurn: afterTurn(4, (s, li, h) => { for (let p = 0; p < 2; p++) { const side = s.locations[li].cards[p]; const cs = [...side]; if (!cs.length) continue; const total = cs.reduce((a, c) => a + c.power, 0); side.length = 0; const sym = h.spawn("Symbiote", p, li); if (!sym) { side.push(...cs); continue; } h.log(`P${p}'s cards merge into a Symbiote`); h.addPower(sym, total); } }) },
  ValleyOfTheHand: { name: "Valley Of The Hand", text: "After turn 5, your destroyed cards revive here.",
    onEndTurn: afterTurn(5, (s, li, h) => { for (let p = 0; p < 2; p++) for (const c of [...s.destroyedPile[p]]) { if (h.def(c).skill) continue; if (!h.canPlace(p, li)) break; const pile = s.destroyedPile[p]; pile.splice(pile.indexOf(c), 1); h.place(p, li, c); } }) },
};

export const LOCATION_IDS = Object.keys(LOCATIONS).filter(id => !LOCATIONS[id].noRandom);
for (const id of Object.keys(LOCATIONS)) LOCATIONS[id].id = id;
