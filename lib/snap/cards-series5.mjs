// Marvel Snap Series 5 (189 cards), stats and text as published by marvelsnapzone.com, plus their tokens.
// Definitions that still simplify something carry an `approx` note saying what.
import { CARDS } from "./cards.mjs";
import { cardPower, locCap as LOCCAP } from "./engine.mjs";

const sameSide = (o) => o.selfOwner === o.targetOwner;
const here = (o) => o.selfLoc === o.targetLoc;
const lowestBy = (arr, f) => arr.length ? arr.reduce((a, b) => f(b) < f(a) ? b : a) : null;
const highestBy = (arr, f) => arr.length ? arr.reduce((a, b) => f(b) > f(a) ? b : a) : null;
const chars = (hand) => hand.filter(c => !CARDS[c.id].skill);
const idx = (state, li, p, card) => state.locations[li].cards[p].findIndex(c => c.uid === card.uid);
const once = (card, fn) => { if (card.objDone) return; card.objDone = true; fn(); };
const stonePlayed = ({ state, p, card }) => { const pl = state.players[p]; pl.stonesPlayed = pl.stonesPlayed ?? []; if (!pl.stonesPlayed.includes(card.id)) pl.stonesPlayed.push(card.id); };
const STONES = ["PowerStone", "TimeStone", "SpaceStone", "MindStone", "RealityStone", "SoulStone"];
const SHOTS = ["Space", "Reality", "Time", "Mind", "Power", "Soul"];   // also the order they fire in
const NICO_SPELLS = ["it becomes a Demon.", "destroy it to draw two cards.", "move it one location to the right.", "give it +2 Power.", "replace that card's location.", "add a copy of it to your hand.", "double this card's Power."];
const HERBIE = [
  { text: "Activate: Next turn, you get +2 Energy.", run: ({ state, p }) => { state.players[p].energyNext += 2; } },
  { text: "Activate: Give 2 of your cards at each other location +1 Power.", run: ({ h, p, li }) => { for (let l = 0; l < 3; l++) if (l !== li) h.shuffle([...h.cards(p, l)]).slice(0, 2).forEach(c => h.addPower(c, 1)); } },
  { text: "Activate: Create a Rock here. Set its Power to 4.", run: ({ h, p, li }) => { h.spawn("Rock", p, li, { power: 4 }); } },
  { text: "Activate: Double this card's Power.", run: ({ h, card }) => { if (card.power > 0) h.addPower(card, card.power); } },
];
const ARROWS = ["AcidArrow", "BasicArrow", "GrappleArrow", "PymParticleArrow"];
const TOOLS = ["FlightHarness", "RemoteMines", "VibroShockGauntlets"];
const INCANTATIONS = ["OmniversalPresence", "OnceAndFuture", "Polymorph"];
const everywhere = (state, h, p) => [...h.board(p).map(x => x.card), ...state.players[p].hand, ...state.players[p].deck];
const addRule = (state, p, id) => { const pl = state.players[p]; pl.rules = pl.rules ?? []; if (!pl.rules.includes(id)) pl.rules.push(id); };
// The published list of On Reveals Rama-Tut can use (107 cards; it cites a datamine and is not official).
const RAMA_NAMES = new Set("The Hood|Deafening Chord|Silver Sable|The Hunger|America Chavez|Iceman|Korg|Loki|Selene|Agent 13|Maria Hill|Surge|Zombie Sentry|Forge|Mister Sinister|Psylocke|Grand Master|Hawkeye Kate Bishop|Iron Patriot|Mirage|Okoye|Peni Parker|Quake|Red Shift|Scarlet Witch|Scorpion|Sentinel|Valentina|Cable|Doctor Strange|Spider-Man|Cassandra Nova|Ironheart|Sage|Storm|Brood|Red Guardian|Silver Surfer|Wolfsbane|Frigga|Gambit|Hazmat|Hit-Monkey|Moon Knight|Venom|Esme Cuckoo|Mole Man|Nakia|Phastos|Prowler|Shanna|Terrax the Tamer|Viper|Agent Coulson|Baron Zemo|Corvus Glaive|Electro|Polaris|White Queen|Crystal|Luna Snow|Wave|Gladiator|Jubilee|Bastion|Shang-Chi|Shuri|Gwenpool|Juggernaut|Laufey|Rockslide|Malekith|Silver Samurai|Anti-Venom|Ares|Kahhori|Stegron|Doctor Octopus|Sentry|Man-Spider|White Tiger|Zombie Giant-Man|Black Panther|Cannonball|The Fallen One|Cosmic Ghost Rider|Legion|M.O.D.O.K.|Sersi|Black Bolt|Blink|Hellion|Spider-Woman|Aero|Gilgamesh|Hydro-Man|Arnim Zola|Blob|Taskmaster|Aurora|Doctor Doom|Leader|Alioth|Heimdall|Odin|Magneto|Destroyer".split("|").map(n => n.toLowerCase().replace(/[^a-z0-9]/g, "")));
export const ramaPool = () => Object.keys(CARDS).filter(id => !CARDS[id].token && !CARDS[id].skill && CARDS[id].onReveal && RAMA_NAMES.has(CARDS[id].name.toLowerCase().replace(/[^a-z0-9]/g, "")));
const findDormammu = (state, h, p) => everywhere(state, h, p).find(c => c.id === "Dormammu") ?? null;
const SKILLS = () => Object.keys(CARDS).filter(id => CARDS[id].skill && !CARDS[id].token);

export const SERIES5 = {
  // ---------------- 1-cost ----------------
  Arana: { name: "Araña", cost: 1, power: 2, text: "Activate: After you play your next card, give it +1 Power and move it to the right.", activate: ({ state, p }) => { state.players[p].nextCardMoveRight = true; } },
  Clea: { name: "Clea", cost: 1, power: 3, text: "When this is Empowered, add Flames of the Faltine to your hand. (if in hand or in play)", onEmpowered: ({ h, p }) => h.addToHand(p, h.make("FlamesOfTheFaltine", p)) },
  Headpool: { name: "Headpool", cost: 1, power: 1, text: "When Destroyed: Return this to your hand, then give all cards in your hand +1 Power.",
    onDestroyed: ({ state, h, p, card }) => { if (h.addToHand(p, h.make("Headpool", p, { power: card.power, created: false }))) state.players[p].hand.forEach(c => h.addPower(c, 1)); } },
  HydraBob: { name: "Hydra Bob", cost: 1, power: 4, text: "End of Turn: This moves if a player Snapped.",
    endOfTurn: ({ state, h, p, li, card }) => { if (state.snappedThisTurn) { const l = h.pick(h.otherLocs(li, p)); if (l != null) h.move(p, li, l, card); } } },
  JimHammond: { name: "Jim Hammond Human Torch", cost: 1, power: 2, text: "Start of Turn: +1 Power for each bonus Energy you have.",
    afterDrawTurn: ({ state, h, p, card }) => h.addPower(card, Math.max(0, state.players[p].energy - state.turn)) },
  MoiraX: { name: "Moira X", cost: 1, power: 2, text: "When Destroyed: Get a copy of your opening hand.",
    onDestroyed: ({ state, h, p }) => { for (const id of state.players[p].openingHand ?? []) h.addToHand(p, h.make(id, p)); } },
  NicoMinoru: { name: "Nico Minoru", cost: 1, power: 2, text: "On Reveal: After you play your next card, cast a spell. (The spell changes each turn.)",
    // seven spells in a random order per game; the spell of the turn is the one shown while she is in hand. A Nico made outside the deck has none.
    gameStart: ({ h, card }) => { card.spells = h.shuffle([1, 2, 3, 4, 5, 6, 7]); },
    dynText: (card, state) => card.spells ? `On Reveal: After you play your next card, ${NICO_SPELLS[card.spells[(Math.max(1, state.turn) - 1) % 7] - 1]}` : null,
    onReveal: ({ state, p, card }) => { if (card.spells) state.players[p].nextCardSpell = { n: card.spells[(state.turn - 1) % 7], uid: card.uid }; } },
  Scorn: { name: "Scorn", cost: 1, power: 2, text: "When Discarded: Put this back and give +2 Power to itself and one of your cards in play.",
    onDiscarded: ({ state, h, p, card }) => { const pile = state.discardPile[p]; const i = pile.findIndex(c => c.uid === card.uid); if (i < 0) return; pile.splice(i, 1); if (!h.addToHand(p, card)) { pile.push(card); return; } h.addPower(card, 2); const t = h.pick(h.board(p)); if (t) h.addPower(t.card, 2); } },
  SilverSable: { name: "Silver Sable", cost: 1, power: 0, text: "On Reveal: Steal 2 Power from the top character of your opponent's deck.",
    onReveal: ({ state, h, p, card }) => { const c = chars(state.players[1 - p].deck)[0]; if (c) h.steal(c, card, 2); } },
  SpiderManBrandNewDay: { name: "Spider-Man Brand New Day", cost: 1, power: 2, text: "Moveable twice. After this moves to a location, give one of your other cards there +1 Power. (even unrevealed ones)", moveable: "twice",
    onSelfMoved: ({ h, p, li, card }) => { const staged = h.playedThisTurnBy(p).filter(x => !x.revealed && x.li === li && !h.def(x.card).skill).map(x => x.card); const t = h.pick([...h.others(p, li, card), ...staged]); if (t) h.addPower(t, 1); } },
  SubMariner: { name: "Sub-Mariner", cost: 1, power: 2, text: "When this is Empowered, add a random 1-Cost character to your hand with that same increase. (if in hand or in play)",
    onEmpowered: ({ h, p }, n) => { const id = h.randomPoolId(d => d.cost === 1 && !d.skill); if (id) h.addToHand(p, h.make(id, p, { power: CARDS[id].power + n })); } },

  // ---------------- 2-cost ----------------
  AgentVenom: { name: "Agent Venom", cost: 2, power: 5, text: "On Reveal: Set the Power of all cards in your deck to 3.", onReveal: ({ state, p }) => state.players[p].deck.forEach(c => { c.power = 3; }) },
  ArchangelHorseman: { name: "Archangel Horseman of Death", cost: 2, power: 4, text: "Objective: Your cards are destroyed 4 times Resurrect one here with +5 Power. (0/4)",
    objective: ({ state, h, p, li, card }) => { if (card.objDone || state.destroyed[p] < 4 || !h.canPlace(p, li)) return; const pile = state.destroyedPile[p]; const c = h.pick(pile); if (!c) return; card.objDone = true; pile.splice(pile.indexOf(c), 1); h.place(p, li, c); h.addPower(c, 5); } },
  AuntMay: { name: "Aunt May", cost: 2, power: 4, text: "End of Turn: If you used a Moveable ability, give a Moveable card in your hand -1 Cost and +2 Power.",
    endOfTurn: ({ state, h, p }) => { if (state.players[p].usedMove !== state.turn) return; const c = h.pick(state.players[p].hand.filter(c => CARDS[c.id].moveable)); if (c) { c.cost = Math.max(0, c.cost - 1); h.addPower(c, 2); } } },
  BlackSwan: { name: "Black Swan", cost: 2, power: 3, text: "Activate: Until the end of next turn, your 1-Cost cards cost 0.", activate: ({ state, p }) => { state.players[p].zeroCostOnes = state.turn + 1; } },
  Boomerang: { name: "Boomerang", cost: 2, power: 2, text: "When this returns to your hand, randomly steal 4 Power from characters in your opponent's hand. Activate: Return this to your hand.",
    onReturned: ({ state, h, p, card }) => { const hand = chars(state.players[1 - p].hand); for (let i = 0; i < 4 && hand.length; i++) h.steal(h.pick(hand), card, 1); },
    activate: ({ h, p, li, card }) => { if (h.returnToHand(p, li, card)) card.activated = false; } },   // back in hand: a fresh card, it can Activate again once replayed
  BruceBanner: { name: "Bruce Banner", cost: 2, power: 1, text: "End of Turn: If you have unspent Energy, 33% chance to HULK OUT!",
    endOfTurn: ({ state, h, p, card }) => { if (state.players[p].energy > 0 && h.rand() < 0.33) h.transform(card, "Hulk"); } },
  Chamber: { name: "Chamber", cost: 2, power: 1, text: "Activate: +2 Power for each 5-Cost or more card you have here and in hand.",
    activate: ({ state, h, p, li, card }) => h.addPower(card, 2 * (h.cards(p, li).filter(c => c.cost >= 5).length + state.players[p].hand.filter(c => c.cost >= 5).length)) },
  Elixir: { name: "Elixir", cost: 2, power: 3, text: "On Reveal: One of your cards destroyed last turn gets revived here.",
    onReveal: ({ state, h, p, li }) => { const pile = state.destroyedPile[p]; const c = h.pick(pile.filter(c => c.destroyedTurn === state.turn - 1)); if (c && h.canPlace(p, li)) { pile.splice(pile.indexOf(c), 1); h.place(p, li, c); } } },
  EzekielSims: { name: "Ezekiel Sims", cost: 2, power: 2, text: "After you play a card with higher Power here, give this +2 Power and move this to another location.",
    afterPlayHere: ({ h, p, li, card }, played) => { if (h.cardPower(li, p, played) > h.cardPower(li, p, card)) { h.addPower(card, 2); const l = h.pick(h.otherLocs(li, p)); if (l != null) h.move(p, li, l, card); } } },
  Firehair: { name: "Firehair", cost: 2, power: 4, text: "When one of your cards is destroyed, this uses that card's On Reveal.",
    onAnyDestroyed: ({ h, p, li, card }, victim) => { if (CARDS[victim.id].onReveal && !victim.silenced) h.useReveal(victim.id, p, li, card); } },
  Goliath: { name: "Goliath", cost: 2, power: 1, kind: "ongoing", text: "Ongoing: +1 Power for each other Ongoing card you have in play.",
    selfPower: ({ state, p, card }) => { let n = 0; for (const L of state.locations) for (const c of L.cards[p]) if (c.uid !== card.uid && CARDS[c.id].kind === "ongoing" && !c.silenced) n++; return n; } },
  Herbie: { name: "H.E.R.B.I.E.", cost: 2, power: 3, text: "Each turn this is in play, swap to a new Activate ability until one is used.",
    // four programs offered in a random order without repeats; a fifth turn starts a fresh order
    startOfTurn: ({ h, card }) => { if (card.activated) return; if (!card.progOrder?.length) card.progOrder = h.shuffle([1, 2, 3, 4]); card.program = card.progOrder.shift(); },
    dynText: (card) => card.program ? HERBIE[card.program - 1].text + (card.activated ? " (used)" : "") : null,
    activateIf: (s, p, card) => card.program != null,
    activate: (ctx) => HERBIE[ctx.card.program - 1].run(ctx) },
  KateBishop: { name: "Hawkeye Kate Bishop", cost: 2, power: 3, text: "On Reveal: Add 2 Arrows to your hand.", onReveal: ({ h, p }) => { for (const id of h.shuffle([...ARROWS]).slice(0, 2)) h.addToHand(p, h.make(id, p)); } },
  IronPatriot: { name: "Iron Patriot", cost: 2, power: 3, text: "On Reveal: Add a random 4-Cost or more card to your hand. If you're winning here after next turn, give it -3 Cost.",
    onReveal: ({ state, h, p, card }) => { const id = h.randomPoolId(d => d.cost >= 4 && !d.skill); if (!id) return; const c = h.make(id, p); if (h.addToHand(p, c)) { card.ipUid = c.uid; card.ipTurn = state.turn + 1; } },
    endOfTurn: ({ state, h, p, li, card }) => { if (card.ipTurn !== state.turn || h.winnerAt(li) !== p) return; const c = state.players[p].hand.find(c => c.uid === card.ipUid); if (c) c.cost = Math.max(0, c.cost - 3); } },
  JeffTheBabyDolphin: { name: "Jeff the Baby Dolphin!?", cost: 2, power: 2, text: "Your cards reveal here with +1 Power. Moveable once.", revealBonusHere: 1, moveable: "once" },
  JeffTheBabyLandShark: { name: "Jeff the Baby Land Shark", cost: 2, power: 4, text: "Moveable once. Nothing can stop you from moving or playing this to any location.", moveable: "once", anywhere: true },
  JoaquinTorres: { name: "Joaquin Torres Falcon II", cost: 2, power: 3, kind: "ongoing", text: "Ongoing: The On Reveal abilities of your 1-Cost cards here repeat.", repeatsOneCostReveals: true },
  JuggernautHorseman: { name: "Juggernaut Horseman of War", cost: 2, power: 2, text: "Objective: Have 6 different Powers among your other cards in play +6 Power. (0/6)",
    objective: ({ h, p, card }) => { const set = new Set(h.board(p).filter(x => x.card.uid !== card.uid).map(x => h.cardPower(x.li, p, x.card))); if (set.size >= 6) once(card, () => h.addPower(card, 6)); } },
  KidOmega: { name: "Kid Omega", cost: 2, power: 1, text: "Activate: Destroy the next card you play this turn to gain its Power.", activate: ({ state, p }) => { state.players[p].kidOmega = true; } },
  LadyBullseye: { name: "Lady Bullseye", cost: 2, power: 3, text: "On Reveal: Afflict an enemy card with -2 Power. Repeat on a different enemy for each of your unspent Energy.",
    onReveal: ({ state, h, p }) => { const targets = h.shuffle(h.board(1 - p)); const n = 1 + Math.max(0, state.players[p].energy); targets.slice(0, n).forEach(x => h.addPower(x.card, -2)); } },
  LinLie: { name: "Lin Lie Iron Fist", cost: 2, power: 3, text: "On Reveal: Add the Sword of Fu Xi to another location.", onReveal: ({ h, p, li }) => { const l = h.pick(h.otherLocs(li, p)); if (l != null) h.spawn("SwordOfFuXi", p, l); } },
  Lockheed: { name: "Lockheed", cost: 2, power: 2, text: "End of Turn: If you played a 1-Cost card this turn, afflict an enemy card here with -2 Power.", approx: "reads the card's own Cost; there is no ruling on cards discounted to 1",
    endOfTurn: ({ state, h, p, li }) => { if (!state.players[p].playedCards.flat().some(id => CARDS[id].cost === 1)) return; const t = h.pick(h.cards(1 - p, li)); if (t) h.addPower(t, -2); } },
  MadameWeb: { name: "Madame Web", cost: 2, power: 1, kind: "ongoing", text: "Ongoing: Each turn, one of your other cards here is Moveable. (your choice)", webs: true },   // one move a turn from her location (engine.moveKind)
  Magus: { name: "Magus", cost: 2, power: 4, text: "Activate: Copy the text of a character in your deck with Cost equal to your unspent Energy. (without using its On Reveal)",
    activate: ({ state, h, p, card }) => { const c = h.pick(state.players[p].deck.filter(c => c.cost === state.players[p].energy && !CARDS[c.id].skill)); if (c) h.copyText(card, c.id); } },
  Merlin: { name: "Merlin", cost: 2, power: 2, text: "Start of Turn: Add an Incantation to your hand.", startOfTurn: ({ h, p }) => h.addToHand(p, h.make(h.pick(INCANTATIONS), p)) },
  Moondragon: { name: "Moondragon", cost: 2, power: 1, text: "End of Turn: +2 Power if you played 1 card this turn and spent all your Energy.",
    endOfTurn: ({ state, h, p, card }) => { const pl = state.players[p]; if (pl.playedCount === 1 && pl.energy === 0) h.addPower(card, 2); } },
  FrankieRaye: { name: "Nova Frankie Raye", cost: 2, power: 3, text: "After the next time you play a 6-Cost card, double this card's Power.",
    afterPlayAny: ({ h, card }, played) => { if (played.cost === 6) once(card, () => h.addPower(card, card.power)); } },
  PeniParker: { name: "Peni Parker", cost: 2, power: 3, text: "On Reveal: Add SP//dr to your hand. When this merges, you get +1 Energy next turn.", onReveal: ({ h, p }) => h.addToHand(p, h.make("SPdr", p)),
    onMerged: ({ state, p }) => { state.players[p].energyNext += 1; }, onMergedAway: ({ state, p }) => { state.players[p].energyNext += 1; } },
  PolarisHorseman: { name: "Polaris Horseman of Pestilence", cost: 2, power: 2, text: "Objective: Cards in play are afflicted with -5 Power Put a card from your hand here. (0/5)",
    objective: ({ state, h, p, li, card }) => { let n = 0; for (const x of h.board()) n += x.card.afflicted; if (n >= 5) once(card, () => { const c = h.pick(chars(state.players[p].hand)); if (c && h.canPlace(p, li)) { state.players[p].hand.splice(state.players[p].hand.indexOf(c), 1); h.place(p, li, c); } }); } },
  PunisherWarMachine: { name: "Punisher War Machine", cost: 2, power: 2, text: "When drawn, mark one of your empty locations. Objective: Win that location +1 Max Energy.",
    onDrawn: ({ state, h, p, card }) => { const l = h.pick([0, 1, 2].filter(l => state.locations[l].cards[p].length === 0)); card.mark = l ?? 0; },
    objective: ({ state, h, p, card }) => { if (card.mark != null && h.winnerAt(card.mark) === p) once(card, () => { state.players[p].maxEnergyBonus += 1; }); } },
  RedWolfFracturedFrontier: { name: "Red Wolf Fractured Frontier", cost: 2, power: 1, text: "On Reveal: +1 Power for each card in your hand. Quickdraw: Give your hand +1 Power.",
    onReveal: ({ state, h, p, card, quickdraw }) => { h.addPower(card, state.players[p].hand.length); if (quickdraw) state.players[p].hand.forEach(c => h.addPower(c, 1)); } },
  SamWilson: { name: "Sam Wilson Captain America", cost: 2, power: 2, kind: "ongoing", text: "On Reveal: Add Cap's Shield to another location. Ongoing: Cap's Shield is Moveable.",
    onReveal: ({ h, p, li }) => { const l = h.pick(h.otherLocs(li, p)); if (l != null) h.spawn("CapsShield", p, l); } },
  Scream: { name: "Scream", cost: 2, power: 1, text: "When an enemy card moves, steal 2 Power from it. (once per turn)",
    onAnyCardMove: ({ state, h, p, card }, moved, mover) => { if (mover === p || card.screamTurn === state.turn) return; card.screamTurn = state.turn; h.steal(moved, card, 2); } },
  ShadowlandsDaredevil: { name: "Shadowlands Daredevil", cost: 2, power: 3, text: "On Reveal: Shuffle in 3 Demons. When you draw a card with 6 or more Power, +2 Power.",
    onReveal: ({ state, h, p }) => { for (let i = 0; i < 3; i++) state.players[p].deck.push(h.make("Demon", p)); h.shuffle(state.players[p].deck); },
    onAnyDraw: ({ h, card }, drawn) => { if (drawn.power >= 6) h.addPower(card, 2); } },
  Sparky: { name: "Sparky", cost: 2, power: 2, text: "Activate: Give your card that last moved +2 Power and move it back to its previous location.",
    activate: ({ state, h, p }) => { const c = state.players[p].lastMoved && h.find(state.players[p].lastMoved); const w = c && h.where(c.uid); if (w && w.p === p) { h.addPower(c, 2); if (c.prevLoc != null) h.move(p, w.li, c.prevLoc, c); } } },
  StrangeSupreme: { name: "Strange Supreme", cost: 2, power: 2, text: "Gains +2 Power from merging. End of Turn: Merge one of your created cards into this.",
    endOfTurn: ({ h, p, card }) => { const t = h.pick(h.board(p).filter(x => x.card.created && x.card.uid !== card.uid)); if (t) h.merge(t.card, card); }, onMerged: ({ h, card }) => h.addPower(card, 2) },
  Surge: { name: "Surge", cost: 2, power: 1, text: "On Reveal: Give the top card of your deck -1 Cost and +1 Power. After you play it, repeat this ability.",
    onReveal: ({ state, h, p }) => { const c = state.players[p].deck[0]; if (c) { c.cost = Math.max(0, c.cost - 1); h.addPower(c, 1); c.surged = true; } },
    afterPlayAny: ({ state, h, p, card }, played) => { if (played.surged) { played.surged = false; const c = state.players[p].deck[0]; if (c) { c.cost = Math.max(0, c.cost - 1); h.addPower(c, 1); c.surged = true; } } } },
  Tarantula: { name: "Tarantula", cost: 2, power: 2, text: "End of Turn: If you have the highest Power among cards in play, give this and 2 characters in your hand +1 Power.",
    endOfTurn: ({ state, h, p, card }) => { if (h.highestPowerInPlay().owner !== p) return; h.addPower(card, 1); h.shuffle(chars(state.players[p].hand)).slice(0, 2).forEach(c => h.addPower(c, 1)); } },
  TechnoOrganicVirus: { name: "Techno-Organic Virus", cost: 2, power: 0, skill: true, text: "On Reveal: Infect your other cards here (replace their text). Copy this to your hand.",
    onReveal: ({ h, p, li }) => { h.cards(p, li).forEach(c => h.silence(c)); h.addToHand(p, h.make("TechnoOrganicVirus", p)); } },
  ThaddeusRoss: { name: "Thaddeus Ross", cost: 2, power: 2, text: "End of Turn: If your opponent has unspent Energy, draw a card with 10 or more Power.",
    endOfTurn: ({ state, h, p }) => { if (state.players[1 - p].energy > 0) h.draw(p, 1, c => c.power >= 10); } },
  Thena: { name: "Thena", cost: 2, power: 0, text: "End of Turn: +3 Power if you played (exactly) 2 cards.", endOfTurn: ({ state, h, p, card }) => { if (state.players[p].playedCount === 2) h.addPower(card, 3); } },
  Toxin: { name: "Toxin", cost: 2, power: 2, text: "On Reveal: Return your other cards here to your hand. +2 Power for each returned.",
    onReveal: ({ h, p, li, card }) => { let n = 0; for (const c of [...h.others(p, li, card)]) if (h.returnToHand(p, li, c)) n++; h.addPower(card, 2 * n); } },
  USAgent: { name: "U.S. Agent", cost: 2, power: 3, kind: "ongoing", text: "Ongoing: 4-Cost or more cards here have -3 Power.", ongoing: (o) => here(o) && o.target.cost >= 4 ? -3 : 0 },
  VictoriaHand: { name: "Victoria Hand", cost: 2, power: 2, kind: "ongoing", text: "Ongoing: Your cards that were created in your hand have +2 Power.", ongoing: (o) => sameSide(o) && o.target.createdInHand ? 2 : 0 },
  WeaponXWolverine: { name: "Weapon X Wolverine", cost: 2, power: 3, text: "After one of your other cards is destroyed, +1 Power. After every 3rd time, improve this effect by 1. (0/3)",
    onAnyDestroyed: ({ h, card }) => { card.wxGain = card.wxGain ?? 1; h.addPower(card, card.wxGain); card.wxCount = (card.wxCount ?? 0) + 1; if (card.wxCount % 3 === 0) card.wxGain++; } },
  WhiteWidow: { name: "White Widow", cost: 2, power: 2, text: "On Reveal: Add a Widow's Kiss to your opponent's side of this location.", onReveal: ({ h, p, li }) => h.spawn("WidowsKiss", 1 - p, li) },
  Xorn: { name: "Xorn", cost: 2, power: 3, text: "After ANY 3 or 4-Cost card is played here, move it to another location.",
    afterAnyPlayHere: ({ h, li }, played, owner) => { if (played.cost === 3 || played.cost === 4) { const l = h.pick(h.otherLocs(li, owner)); if (l != null) h.move(owner, li, l, played); } } },
  ZombieBlade: { name: "Zombie Blade", cost: 2, power: 3, text: "End of Turn: If you played an On Reveal, your Zombie Horde steals 1 Power from a character in your opponent's hand. (Horde first if necessary)",
    endOfTurn: ({ state, h, p, li }) => { if (!state.players[p].playedCards.flat().some(id => CARDS[id].onReveal)) return; const c = h.pick(chars(state.players[1 - p].hand)); const hc = h.horde(p, 0, li); if (c && hc) h.steal(c, hc, 1); } },
  ZombieMisterFantastic: { name: "Zombie Mister Fantastic", cost: 2, power: 2, text: "On Reveal: Horde +2. Activate: Give 4 of your created cards +1 Power.",
    onReveal: ({ h, p, li }) => h.horde(p, 2, li), activate: ({ h, p }) => h.shuffle(h.board(p).filter(x => x.card.created)).slice(0, 4).forEach(x => h.addPower(x.card, 1)) },

  // ---------------- 3-cost ----------------
  BaronZemo: { name: "Baron Zemo", cost: 3, power: 5, text: "On Reveal: Recruit a card that costs the least from your opponent's deck to your side of this location.",
    onReveal: ({ state, h, p, li }) => { const d = state.players[1 - p].deck; const c = lowestBy(chars(d), c => c.cost); if (c && h.canPlace(p, li)) { d.splice(d.indexOf(c), 1); h.place(p, li, c); } } },
  Bullseye: { name: "Bullseye", cost: 3, power: 2, text: "Activate: Discard all cards that cost 1 or less from your hand. Afflict that many different enemy cards with -2 Power.",
    activate: ({ state, h, p }) => { let n = 0; for (const c of state.players[p].hand.filter(c => c.cost <= 1)) if (h.discard(p, c)) n++; h.shuffle(h.board(1 - p)).slice(0, n).forEach(x => h.addPower(x.card, -2)); } },
  Caiera: { name: "Caiera", cost: 3, power: 5, kind: "ongoing", text: "Ongoing: Your 1 and 6-Cost cards can't be destroyed.", protectsDestroy: (c) => c.cost === 1 || c.cost === 6 },
  CalibanHorseman: { name: "Caliban Horseman of Pestilence", cost: 3, power: 4, text: "Objective: Have 3 cards that are 4-Cost or more in play Afflict the highest-Cost enemy card with -6 Power. (0/3)",
    objective: ({ h, p, card }) => { if (h.board(p).filter(x => x.card.cost >= 4).length >= 3) once(card, () => { const t = highestBy(h.board(1 - p), x => x.card.cost); if (t) h.addPower(t.card, -6); }); } },
  CaptainCarter: { name: "Captain Carter", cost: 3, power: 2, kind: "ongoing", text: "Ongoing: Add this card's Power to your back-row cards here. (can't add to itself)",
    ongoing: (o) => here(o) && sameSide(o) && idx(o.state, o.targetLoc, o.targetOwner, o.target) >= 2 ? o.self.power : 0 },
  CassandraNova: { name: "Cassandra Nova", cost: 3, power: 0, text: "On Reveal: Steal 1 Power from each card in your opponent's deck.", onReveal: ({ state, h, p, card }) => state.players[1 - p].deck.forEach(c => h.steal(c, card, 1)) },
  ColonelAmerica: { name: "Colonel America", cost: 3, power: 4, kind: "ongoing", text: "Ongoing: Your other cards here have +1 Power for each turn you've discarded a card. (0 turns.)",
    ongoing: (o) => here(o) && sameSide(o) ? o.state.players[o.selfOwner].discardTurns.length : 0 },
  Copycat: { name: "Copycat", cost: 3, power: 5, text: "When you draw this, copy the text from the bottom card of your opponent's deck.",
    onDrawn: ({ state, h, p, card }) => { const d = state.players[1 - p].deck; const c = d[d.length - 1]; if (c && !c.hidden && !CARDS[c.id].skill) h.copyText(card, c.id); } },
  Diamondback: { name: "Diamondback", cost: 3, power: 3, kind: "ongoing", text: "Ongoing: Enemy cards here afflicted with negative Power have an additional -2 Power.", ongoing: (o) => here(o) && !sameSide(o) && o.target.afflicted > 0 ? -2 : 0 },
  DragonOfTheMoon: { name: "Dragon of the Moon", cost: 3, power: 4, text: "On Reveal: Steal 1 Power from even-costed cards in ALL hands.",
    onReveal: ({ state, h, card }) => state.players.forEach(pl => pl.hand.filter(c => !c.hidden && c.cost % 2 === 0).forEach(c => h.steal(c, card, 1))) },
  DraxAvatarOfLife: { name: "Drax, Avatar Of Life", cost: 3, power: 3, text: "End of Turn: +3 Power if your opponent played a card with greater Power this turn. Move to that card if you'd be winning its location.",
    endOfTurn: ({ state, h, p, li, card }) => {
      const big = h.board(1 - p).filter(x => x.card.playedTurn === state.turn && h.cardPower(x.li, 1 - p, x.card) > h.cardPower(li, p, card));
      if (!big.length) return;
      h.addPower(card, 3);
      const mine = h.cardPower(li, p, card);
      const to = h.pick([...new Set(big.map(x => x.li))].filter(l => l !== li && h.hasRoom(p, l) && h.locPower(l, p) + mine > h.locPower(l, 1 - p)));   // several: a random one
      if (to != null) h.move(p, li, to, card);
    } },
  EsmeCuckoo: { name: "Esme Cuckoo", cost: 3, power: 4, text: "On Reveal: Copy a card from your deck into your hand. Set its Cost to 3 and Power to 4.",
    onReveal: ({ state, h, p }) => { const c = h.pick(chars(state.players[p].deck)); if (c) h.addToHand(p, h.make(c.id, p, { cost: 3, power: 4 })); } },
  FenrisWolf: { name: "Fenris Wolf", cost: 3, power: 4, text: "Activate: Resurrect your opponent's highest-Power discarded or destroyed card on your side of this location.",
    activate: ({ state, h, p, li }) => { const q = 1 - p; const opts = [...chars(state.discardPile[q]).map(c => ({ c, pile: state.discardPile[q] })), ...state.destroyedPile[q].map(c => ({ c, pile: state.destroyedPile[q] }))]; const x = highestBy(opts, x => x.c.power); if (x && h.canPlace(p, li)) { x.pile.splice(x.pile.indexOf(x.c), 1); h.place(p, li, x.c); } } },
  FriendlyNeighborhoodCarnage: { name: "Friendly Neighborhood Carnage", cost: 3, power: 4, text: "On Reveal: Move your other cards here to the right. +2 Power for each moved.",
    onReveal: ({ h, p, li, card }) => { if (li === 2) return; let n = 0; for (const c of [...h.others(p, li, card)]) if (h.move(p, li, li + 1, c)) n++; h.addPower(card, 2 * n); } },
  Frigga: { name: "Frigga", cost: 3, power: 3, text: "On Reveal: Add a copy of the last card you played to your hand. (if able)",
    // a card still in play is copied as it stands (guides say the copy keeps its boosted Power); otherwise a plain copy
    onReveal: ({ state, h, p, card }) => { const info = state.players[p].lastPlayedInfo; if (!info || info.uid === card.uid) return; const liveCard = h.find(info.uid); h.addToHand(p, liveCard ? h.make(liveCard.id, p, { cost: liveCard.cost, power: liveCard.power }) : h.make(info.id, p)); } },
  HopeSummers: { name: "Hope Summers", cost: 3, power: 4, text: "After you play a card here, you get +1 Energy next turn.", afterPlayHere: ({ state, p }) => { state.players[p].energyNext += 1; } },
  HumanTorchFirstSteps: { name: "Human Torch First Steps", cost: 3, power: 2, text: "End of Turn: +1 Power. Once per game, if your side here is full, double this card's Power instead.",
    endOfTurn: ({ h, p, li, card }) => { if (!card.objDone && h.cards(p, li).length >= h.cap(li)) { card.objDone = true; h.addPower(card, card.power); } else h.addPower(card, 1); } },
  HydraStomper: { name: "Hydra Stomper", cost: 3, power: 3, kind: "ongoing", text: "Ongoing: +1 Power for each time one of your cards moved this game.", selfPower: ({ state, p }) => state.players[p].movesThisGame },
  InvisibleWomanFirstSteps: { name: "Invisible Woman First Steps", cost: 3, power: 3, text: "Activate: This turn, your End of Turn abilities repeat.", activate: ({ state, p }) => { state.players[p].repeatEndOfTurn = state.turn; } },
  JackFlag: { name: "Jack Flag", cost: 3, power: 3, kind: "ongoing", text: "Ongoing: Your cards here with increased Power have +2 Power.", ongoing: (o) => here(o) && sameSide(o) && o.target.buffed > 0 ? 2 : 0, selfPower: ({ card }) => card.buffed > 0 ? 2 : 0 },
  JaneFosterFracturedFrontier: { name: "Jane Foster Fractured Frontier", cost: 3, power: 3, text: "On Reveal: Judge 4 other random characters. +1 Power (if yours) or -1 Power (enemies). Quickdraw: Judge the worthy again.",
    onReveal: ({ h, p, card, quickdraw }) => { const judged = h.shuffle(h.board().filter(x => x.card.uid !== card.uid)).slice(0, 4); const judge = () => judged.forEach(x => h.addPower(x.card, x.p === p ? 1 : -1)); judge(); if (quickdraw) judge(); } },
  Jocasta: { name: "Jocasta", cost: 3, power: 3, text: "Activate: Immediately Activate your other cards here. (without using up their Activate abilities)",
    activate: ({ state, h, p, li, card }) => { for (const c of [...h.others(p, li, card)]) if (c.id !== "Jocasta" && CARDS[c.id].activate && !c.silenced && h.where(c.uid)?.li === li) CARDS[c.id].activate({ state, p, li, card: c, h }); } },
  Kang: { name: "Kang", cost: 3, power: 4, text: "Game Start: Replace this with 4 Kangs with text from random cards that Cost 3 or more.",
    // four created 3/4 Kangs (a 15-card deck), each with a different character's text; Game Start texts are left out
    gameStart: ({ state, h, p, card }) => { const d = state.players[p].deck; const i = d.indexOf(card); if (i < 0) return; d.splice(i, 1); const used = [];
      for (let k = 0; k < 4; k++) { const c = h.make("Kang", p); const id = h.randomPoolId(x => x.cost >= 3 && !x.skill && x.text && !x.gameStart && !/Game Start/.test(x.text) && x.id !== "Kang" && !used.includes(x.id)); if (id) { used.push(id); h.copyText(c, id); } d.push(c); } h.shuffle(d); } },
  Kraglin: { name: "Kraglin", cost: 3, power: 5, text: "On Reveal: Banish the top card of your deck. If it was 4-Cost or more, +2 Energy next turn, otherwise give this +4 Power.",
    onReveal: ({ state, h, p, card }) => { const c = state.players[p].deck.shift(); if (!c) return; if (c.cost >= 4) state.players[p].energyNext += 2; else h.addPower(card, 4); } },
  LunaSnow: { name: "Luna Snow", cost: 3, power: 6, text: "On Reveal: Add an Ice Cube to each side of this location.", onReveal: ({ h, li }) => { h.spawn("IceCube", 0, li); h.spawn("IceCube", 1, li); } },
  Makkari: { name: "Makkari", cost: 3, power: 3, text: "End of Turn: Runs from your hand to a random location. (if possible)",
    endOfTurnInHand: ({ state, h, p, card }) => { const hand = state.players[p].hand, i = hand.indexOf(card); if (i < 0) return; const l = h.pick(h.openLocs(p).filter(l => h.canPlace(p, l))); if (l != null) { hand.splice(i, 1); h.place(p, l, card); } } },
  MarvelBoy: { name: "Marvel Boy", cost: 3, power: 2, text: "End of Turn: Give 3 of your 1-Cost cards +1 Power.", endOfTurn: ({ h, p }) => h.shuffle(h.board(p).filter(x => x.card.cost === 1)).slice(0, 3).forEach(x => h.addPower(x.card, 1)) },
  MaryJane: { name: "Mary Jane", cost: 3, power: 3, text: "End of Turn: Give each of your cards that moved this turn +1 Power.", endOfTurn: ({ state, h, p }) => h.board(p).forEach(x => { if (x.card.movedTurn === state.turn) h.addPower(x.card, 1); }) },
  Maverick: { name: "Maverick", cost: 3, power: 2, text: "Activate: Give the next card you play Power equal to this card's Power.", activate: ({ state, p, card }) => { state.players[p].nextCardPower = card.power; } },
  MrFantasticFirstSteps: { name: "Mister Fantastic First Steps", cost: 3, power: 5, text: "End of Turn: Give a card in your hand -1 Cost or +3 Power.",
    // a random card, then a random buff it can take: skills only take the Cost, 0-Cost cards only the Power
    endOfTurn: ({ state, h, p }) => { const c = h.pick(state.players[p].hand); if (!c) return; const opts = []; if (c.cost > 0) opts.push("cost"); if (!CARDS[c.id].skill) opts.push("power"); const o = h.pick(opts); if (o === "cost") c.cost -= 1; else if (o === "power") h.addPower(c, 3); } },
  MorganLeFay: { name: "Morgan le Fay", cost: 3, power: 4, text: "On Reveal: Return all your discarded and destroyed cards to hand with +3 Power.",
    onReveal: ({ state, h, p }) => { for (const pile of [state.discardPile[p], state.destroyedPile[p]]) while (pile.length && state.players[p].hand.length < 7) { const c = pile.shift(); h.addPower(c, 3); h.addToHand(p, c); } } },
  Muse: { name: "Muse", cost: 3, power: 3, kind: "ongoing", text: "Ongoing: +3 Power for each location where one of your cards has been destroyed.", selfPower: ({ state, p }) => 3 * state.destroyedAt[p].filter(n => n > 0).length },
  Namorita: { name: "Namorita", cost: 3, power: 5, text: "When you draw a card, give it -1 Cost if this is your only card here.", onAnyDraw: ({ state, p, li }, drawn) => { if (state.locations[li].cards[p].length === 1) drawn.cost = Math.max(0, drawn.cost - 1); } },
  Nightmare: { name: "Nightmare", cost: 3, power: 1, text: "On Reveal: Replace the text of each card in your hand with text from a random card of the same Cost.",
    onReveal: ({ state, h, p }) => chars(state.players[p].hand).forEach(c => { const id = h.randomPoolId(d => d.cost === c.cost && !d.skill && d.id !== c.id); if (id) h.copyText(c, id); }) },
  Nocturne: { name: "Nocturne", cost: 3, power: 5, text: "Moveable once. When this moves, replace its location with a random new one.", moveable: "once", onSelfMoved: ({ h, li }) => h.replaceLocation(li) },
  Prodigy: { name: "Prodigy", cost: 3, power: 4, text: "On Reveal: If this is in the back row, copy the text of the card in front of it.",
    onReveal: ({ state, h, p, li, card }) => { const i = idx(state, li, p, card); if (i >= 2) { const front = state.locations[li].cards[p][i - 2]; if (front) { h.copyText(card, front.id); if (CARDS[front.id].onReveal) h.revealAgain(p, li, card); } } } },
  Prowler: { name: "Prowler", cost: 3, power: 4, text: "On Reveal: Add 2 Thief's Tools to your hand. Set their Costs to 0 if a card moved last turn.",
    onReveal: ({ state, h, p }) => { for (let i = 0; i < 2; i++) h.addToHand(p, h.make(h.pick(TOOLS), p, state.movedLastTurn ? { cost: 0 } : {})); } },
  PsylockeFracturedFrontier: { name: "Psylocke Fractured Frontier", cost: 3, power: 4, text: "On Reveal: Give cards in your hand that are 5-Cost or more -1 Cost. Quickdraw: Your whole hand instead.",
    onReveal: ({ state, p, quickdraw }) => state.players[p].hand.forEach(c => { if ((quickdraw || c.cost >= 5) && c.cost > 0) c.cost -= 1; }) },
  RedGuardian: { name: "Red Guardian", cost: 3, power: 2, text: "On Reveal: Afflict the lowest-Power enemy card here with -2 Power and remove its text.",
    onReveal: ({ h, p, li }) => { const t = lowestBy(h.cards(1 - p, li), c => h.cardPower(li, 1 - p, c)); if (t) { h.addPower(t, -2); h.silence(t); } } },
  RedHulkFracturedFrontier: { name: "Red Hulk Fractured Frontier", cost: 3, power: 8, text: "On Reveal: -1 Power for each enemy card here. Quickdraw: +1 Power instead.",
    onReveal: ({ h, p, li, card, quickdraw }) => h.addPower(card, (quickdraw ? 1 : -1) * h.cards(1 - p, li).length) },
  Redwing: { name: "Redwing", cost: 3, power: 5, text: "The first time this moves, add a card from your hand to the old location.",
    onSelfMoved: ({ state, h, p, card }, from) => once(card, () => { const c = h.pick(chars(state.players[p].hand)); if (c && h.canPlace(p, from)) { state.players[p].hand.splice(state.players[p].hand.indexOf(c), 1); h.place(p, from, c); } }) },
  RocketAndGroot: { name: "Rocket and Groot", cost: 3, power: 3, text: "Moveable once. After your opponent plays a card here, steal 1 Power from it.", moveable: "once",
    afterAnyPlayHere: ({ h, p, card }, played, owner) => { if (owner !== p) h.steal(played, card, 1); } },
  Sage: { name: "Sage", cost: 3, power: 0, text: "On Reveal: +2 Power for each different Power among all other cards here.",
    onReveal: ({ h, li, card }) => { const set = new Set(); for (let q = 0; q < 2; q++) for (const c of h.cards(q, li)) if (c.uid !== card.uid) set.add(h.cardPower(li, q, c)); h.addPower(card, 2 * set.size); } },
  ScarletWitchQueenOfChaos: { name: "Scarlet Witch Queen of Chaos", cost: 3, power: 3, text: "Start of Turn: Add an EXTREMELY random skill to your hand. It costs 0 this turn.",
    startOfTurn: ({ state, h, p }) => { const id = h.pick(SKILLS()); if (id) h.addToHand(p, h.make(id, p, { cost: 0, costRestore: CARDS[id].cost, costUntil: state.turn + 1 })); } },
  ShangChiMasterOfTheRings: { name: "Shang-Chi, Master of the Rings", cost: 3, power: 5, text: "Game Start: The Ten Rings starts in your hand. On Reveal: Unlock their potential.",   // the Rings take an opening-hand slot like Quicksilver; unlocking upgrades them wherever they are (in play is confirmed, hand and deck assumed)
    gameStart: ({ state, h, p }) => { state.players[p].hand.push(h.make("TenRings", p)); },   // a created card (anything beyond the starting deck is), though not "created in hand"
    onReveal: ({ state, h, p }) => { for (const c of [...state.players[p].hand, ...state.players[p].deck, ...h.board(p).map(x => x.card)]) if (c.id === "TenRings") { h.transform(c, "TenRingsUpgrade", { keepPower: true }); c.power += 1; } } },
  Speed: { name: "Speed", cost: 3, power: 3, kind: "ongoing", text: "Ongoing: +1 Power for each turn in which you spent all your Energy.", selfPower: ({ state, p }) => state.players[p].spentAllTurns },
  SpiderPunk: { name: "Spider-Punk", cost: 3, power: 3, text: "Moveable once. When this moves to a location, steal 2 Power from the highest-Power enemy there.", moveable: "once",
    onSelfMoved: ({ h, p, li, card }) => { const t = highestBy(h.cards(1 - p, li), c => h.cardPower(li, 1 - p, c)); if (t) h.steal(t, card, 2); } },
  Starbrand: { name: "Starbrand", cost: 3, power: 10, kind: "ongoing", text: "Ongoing: Your opponent has +3 Power at each other location.", locAddEnemy: ({ selfLoc, li }) => li !== selfLoc ? 3 : 0 },
  StormHorseman: { name: "Storm Horseman of Famine", cost: 3, power: 1, text: "Objective: End 2 turns in a row with unspent Energy Give your other cards here and in your hand +2 Power. (0/2)",
    objective: ({ state, h, p, li, card }) => { if (state.players[p].unspentStreak >= 2) once(card, () => { h.others(p, li, card).forEach(c => h.addPower(c, 2)); state.players[p].hand.forEach(c => h.addPower(c, 2)); }); } },
  SuperiorSpiderMan: { name: "Superior Spider-Man", cost: 3, power: 4, text: "Start of Turn: +1 Energy if you have any cards with increased Power in play.",
    startOfTurn: ({ state, h, p }) => { if (h.board(p).some(x => x.card.buffed > 0)) state.players[p].energyNext += 1; } },
  Surtur: { name: "Surtur", cost: 3, power: 5, text: "After you play a card with 10 or more Power, this gains +2 Power.", afterPlayAny: ({ h, p, card }, played, pli) => { const w = h.where(played.uid); const pw = w ? h.cardPower(w.li, p, played) : h.cardPower(pli, p, played); if (pw >= 10) h.addPower(card, 2); } },
  TheAncientOne: { name: "The Ancient One", cost: 3, power: 5, text: "On Reveal: Add Tao Mandala to your hand.", onReveal: ({ h, p }) => h.addToHand(p, h.make("TaoMandala", p)) },
  Venus: { name: "Venus", cost: 3, power: 2, text: "When your cards in play are Empowered, give those cards an additional +1 Power.", venus: true },
  Viv: { name: "Viv Vision", cost: 3, power: 4, text: "Start of Turn: Give all cards in your hand +1 Power if you're winning here. Otherwise, move this to another location.",
    startOfTurn: ({ state, h, p, li, card }) => { if (h.winnerAt(li) === p) state.players[p].hand.forEach(c => h.addPower(c, 1)); else { const l = h.pick(h.otherLocs(li, p)); if (l != null) h.move(p, li, l, card); } } },
  Warlock: { name: "Warlock", cost: 3, power: 4, text: "Activate: For each unspent Energy, give a card in your hand -1 Cost.",
    activate: ({ state, h, p }) => { for (let i = 0; i < state.players[p].energy; i++) { const c = h.pick(state.players[p].hand.filter(c => c.cost > 0)); if (c) c.cost -= 1; } } },
  ZombieScarletWitch: { name: "Zombie Scarlet Witch", cost: 3, power: 4, text: "After you play a card here, Horde +2.", afterPlayHere: ({ h, p, li }) => h.horde(p, 2, li) },
  ZombieVenom: { name: "Zombie Venom", cost: 3, power: 3, text: "On Reveal: Destroy your first other card here. After one of your other cards is destroyed, Horde +3.",
    onReveal: ({ h, p, li, card }) => { const t = h.others(p, li, card)[0]; if (t) h.destroy(p, li, t.uid); }, onAnyDestroyed: ({ h, p, li }) => h.horde(p, 3, li) },

  // ---------------- 4-cost ----------------
  AdamantiumInfusion: { name: "Adamantium Infusion", cost: 4, power: 0, skill: true, text: "On Reveal: Banish this to revive your highest-Power destroyed card here with its Power doubled.",
    onReveal: ({ state, h, p, li }) => { const pile = state.destroyedPile[p]; const c = highestBy(pile, c => c.power); if (c && h.canPlace(p, li)) { pile.splice(pile.indexOf(c), 1); c.power *= 2; h.place(p, li, c); } } },
  AntiVenom: { name: "Anti-Venom", cost: 4, power: 7, text: "On Reveal: Set the Cost and Power of your deck's top card to 0.", onReveal: ({ state, p }) => { const c = state.players[p].deck[0]; if (c) { c.cost = 0; c.power = 0; } } },
  Ares: { name: "Ares", cost: 4, power: 7, text: "On Reveal: Compare the Power of the top 3 cards of both decks. If your total is higher, +6 Power.",
    onReveal: ({ state, h, p, card }) => { const sum = (q) => state.players[q].deck.slice(0, 3).reduce((s, c) => s + (c.power ?? 0), 0); if (sum(p) > sum(1 - p)) h.addPower(card, 6); } },
  Bastion: { name: "Bastion", cost: 4, power: 3, text: "On Reveal: Add copies of your other cards here to your hand. Set their Costs to 2 and Power to 3.",
    onReveal: ({ h, p, li, card }) => h.others(p, li, card).forEach(c => h.addToHand(p, h.make(c.id, p, { cost: 2, power: 3 }))) },
  Doom2099: { name: "Doctor Doom 2099", cost: 4, power: 6, text: "End of Turn: Add a DoomBot 2099 to a random location if you played (exactly) 1 card.",
    endOfTurn: ({ state, h, p }) => { if (state.players[p].playedCount === 1) { const l = h.pick(h.openLocs(p)); if (l != null) h.spawn("DoomBot2099", p, l); } } },
  EnSabahNur: { name: "En Sabah Nur", cost: 4, power: 5, text: "Objective: Have a full front row at each location Transform into Apocalypse, Celestials' Chosen. (0/6)",
    objective: ({ state, h, p, card }) => { if ([0, 1, 2].every(l => state.locations[l].cards[p].length >= 2)) once(card, () => h.transform(card, "ApocalypseCelestialsChosen")); } },
  Fantomex: { name: "Fantomex", cost: 4, power: 7, text: "Activate: If you've had cards discarded and destroyed, afflict front-row enemy cards at each location with -2 Power.",
    activate: ({ state, h, p }) => { if (state.discards[p] > 0 && state.destroyed[p] > 0) for (let l = 0; l < 3; l++) h.frontRow(1 - p, l).forEach(c => h.addPower(c, -2)); } },
  Galacta: { name: "Galacta", cost: 4, power: 6, text: "Each turn, the first card you play at another location reveals with +2 Power.", galacta: true },
  GambitHorseman: { name: "Gambit Horseman of Death", cost: 4, power: 6, text: "Objective: Play 6 total Cost of created cards Randomly destroy up to 3 total Cost of enemy cards. (0/6)",
    objective: ({ state, h, p, card }) => { if ((state.players[p].createdCostPlayed ?? 0) >= 6) once(card, () => { let budget = 3; for (const x of h.shuffle(h.board(1 - p))) if (x.card.cost <= budget) { if (h.destroy(1 - p, x.li, x.card.uid)) budget -= x.card.cost; } }); } },
  Gwenpool: { name: "Gwenpool", cost: 4, power: 5, text: "On Reveal: Pick a random character in your hand 3 times. Give +2 Power each time.",
    onReveal: ({ state, h, p }) => { for (let i = 0; i < 3; i++) { const c = h.pick(chars(state.players[p].hand)); if (c) h.addPower(c, 2); } } },
  HighEvolutionary: { name: "High Evolutionary", cost: 4, power: 7, text: "Game Start: Unlock the potential of your cards with no abilities.",
    gameStart: ({ state, h, p }) => { for (const c of state.players[p].deck) if (CARDS["Evolved" + c.id]) h.transform(c, "Evolved" + c.id); } },
  Isca: { name: "Isca the Unbeaten", cost: 4, power: 2, text: "End of Turn: If you're losing this location, double this card's Power.", endOfTurn: ({ h, p, li, card }) => { if (h.winnerAt(li) !== 1 - p) return; const pw = h.cardPower(li, p, card); if (pw > 0) h.addPower(card, pw); else if (pw < 0) card.power += pw; } },
  JubileeSilverSurfer: { name: "Jubilee Silver Surfer", cost: 4, power: 3, text: "When you draw a card, add this card's Power to it.", onAnyDraw: ({ h, card }, drawn) => h.addPower(drawn, card.power) },
  Kahhori: { name: "Kahhori", cost: 4, power: 7, text: "On Reveal: Each card in your hand gives one of your other cards in play +1 Power.",
    onReveal: ({ state, h, p, card }) => { const others = h.board(p).filter(x => x.card.uid !== card.uid); for (const _ of state.players[p].hand) { const t = h.pick(others); if (t) h.addPower(t.card, 1); } } },
  KarenPage: { name: "Karen Page", cost: 4, power: 5, text: "On Reveal: Give one of your 1, 2, and 3-Cost characters +2 Power each.",
    onReveal: ({ h, p, card }) => { const all = h.board(p).map(x => x.card).filter(c => c.uid !== card.uid); for (const k of [1, 2, 3]) { const t = h.pick(all.filter(c => c.cost === k)); if (t) h.addPower(t, 2); } } },   // characters in play
  Malekith: { name: "Malekith", cost: 4, power: 6, text: "On Reveal: Add a 3-Cost or less card from your deck here, but don't reveal it until the game ends.",
    onReveal: ({ state, h, p, li }) => { const d = state.players[p].deck; const c = h.pick(chars(d).filter(c => c.cost <= 3)); if (c && h.canPlace(p, li)) { d.splice(d.indexOf(c), 1); c.hiddenUntilEnd = true; h.place(p, li, c); } }, },
  Misery: { name: "Misery", cost: 4, power: 8, text: "On Reveal: Repeat the On Reveal abilities of your other cards here, then destroy them.",
    onReveal: ({ h, p, li, card }) => { const others = [...h.others(p, li, card)]; for (const c of others) if (CARDS[c.id].onReveal && h.where(c.uid)) h.revealAgain(p, li, c); for (const c of others) if (h.where(c.uid)) h.destroy(p, h.where(c.uid).li, c.uid); } },
  Moonstone: { name: "Moonstone", cost: 4, power: 6, kind: "ongoing", text: "Ongoing: Has the Ongoing effects of your 3-Cost or less cards here.", mimicsCheap: true },
  ProximaMidnight: { name: "Proxima Midnight", cost: 4, power: 7, text: "When Discarded: This jumps to your lowest-Power location. (that isn't full)",
    onDiscarded: ({ state, h, p, card }) => { const opts = h.openLocs(p).filter(l => h.canPlace(p, l)); const l = lowestBy(opts, l => h.locPower(l, p)); if (l != null) { state.discardPile[p].pop(); h.place(p, l, card); } } },
  RamaTut: { name: "Rama-Tut", cost: 4, power: 5, text: "On Reveal: Use 3 On Reveals from cards released before Rama-Tut's time.", approx: "three different On Reveals from the published 107-card list, which cites a datamine",
    onReveal: ({ h, p, li, card }) => { for (const id of h.shuffle(ramaPool()).slice(0, 3)) if (h.where(card.uid)) { h.log(`Rama-Tut uses ${CARDS[id].name}`); h.useReveal(id, p, h.where(card.uid).li, card); } } },
  RedOnslaught: { name: "Red Onslaught", cost: 4, power: 4, kind: "ongoing", text: "Ongoing: Has 3 random Ongoing abilities.",
    gameStart: ({ h, card }) => { card.mimics = []; for (let i = 0; i < 3; i++) { const id = h.randomPoolId(d => (d.ongoing || d.selfPower) && !card.mimics.includes(d.id)); if (id) card.mimics.push(id); } } },
  ScarletSpider: { name: "Scarlet Spider", cost: 4, power: 5, text: "Activate: Add an exact clone of this to another location.", activate: ({ h, p, li, card }) => { const l = h.pick(h.otherLocs(li, p)); if (l != null) h.spawn("ScarletSpider", p, l, { power: card.power, activated: true }); } },
  SeleneHorseman: { name: "Selene Horseman of Famine", cost: 4, power: 4, text: "Objective: Have 3 cards with no abilities in play Steal 5 Power from an enemy card here. (0/3)",
    objective: ({ h, p, li, card }) => { if (h.board(p).filter(x => !CARDS[x.card.id].text).length >= 3) once(card, () => { const t = h.pick(h.cards(1 - p, li)); if (t) h.steal(t, card, 5); }); } },
  SpiderManNoir: { name: "Spider-Man Noir", cost: 4, power: 5, text: "On Reveal: Set the top character of your deck's Power to 8. If your other cards in play cost exactly 8 total, add it here. (0/8)",
    onReveal: ({ state, h, p, li, card }) => { const d = state.players[p].deck; const c = chars(d)[0]; if (!c) return; c.power = 8; const total = h.board(p).filter(x => x.card.uid !== card.uid).reduce((s, x) => s + x.card.cost, 0); if (total === 8 && h.canPlace(p, li)) { d.splice(d.indexOf(c), 1); h.place(p, li, c); } } },
  Stardust: { name: "Stardust", cost: 4, power: 6, kind: "ongoing", text: "Ongoing: Cards can't be added to locations except by playing or moving them.", blocksAdditions: true },
  Stryfe: { name: "Stryfe", cost: 4, power: 6, text: "Objective: Play 3 On Reveal cards Use the highest-Cost On Reveal in your hand. (0/3)",
    objective: ({ state, h, p, li, card }) => { if ((state.players[p].onRevealsPlayed ?? 0) >= 3) once(card, () => { const c = highestBy(state.players[p].hand.filter(c => CARDS[c.id].onReveal), c => c.cost); if (c) h.useReveal(c.id, p, li, card); }); } },
  SymbioteSpiderMan: { name: "Symbiote Spider-Man", cost: 4, power: 7, text: "Activate: Merge your lowest-Cost card here into this. Copy its text like it just revealed.",
    activate: ({ h, p, li, card }) => { const t = lowestBy(h.others(p, li, card), c => c.cost); if (!t) return; const id = t.id; h.merge(t, card); if (!CARDS[id].skill) { h.copyText(card, id); if (CARDS[id].onReveal) h.revealAgain(p, li, card); } } },
  VampireDeaconFrost: { name: "Vampire Deacon Frost", cost: 4, power: 5, text: "Objective: 3 of your cards have stolen Power Transform into Crimson Behemoth. (0/3)",
    objective: ({ h, p, li, card }) => { if (h.board(p).filter(x => x.card.stolen > 0).length >= 3) once(card, () => { h.transform(card, "CrimsonBehemoth"); h.revealAgain(p, li, card); }); } },
  Wiccan: { name: "Wiccan", cost: 4, power: 6, text: "On Reveal: If you've spent all your Energy on previous turns, +2 Max Energy.", onReveal: ({ state, p }) => { if (state.players[p].unspentTurns === 0) state.players[p].maxEnergyBonus += 2; } },
  WolverineHorseman: { name: "Wolverine Horseman of War", cost: 4, power: 4, text: "Objective: This has 6 or more Power Give one of your cards at each location +4 Power. (4/6)",
    objective: ({ h, p, li, card }) => { if (h.cardPower(li, p, card) >= 6) once(card, () => { for (let l = 0; l < 3; l++) { const c = h.pick(h.cards(p, l)); if (c) h.addPower(c, 4); } }); } },
  ZombieCaptainMarvel: { name: "Zombie Captain Marvel", cost: 4, power: 6, text: "Activate: Destroy your other cards here to get +3 Power for each. Move to a location you're losing.",
    activate: ({ h, p, li, card }) => { let n = 0; for (const c of [...h.others(p, li, card)]) if (h.destroy(p, li, c.uid)) n++; h.addPower(card, 3 * n); const l = h.pick(h.otherLocs(li, p).filter(l => h.winnerAt(l) === 1 - p)); if (l != null) h.move(p, li, l, card); } },

  // ---------------- 5-cost ----------------
  Agamotto: { name: "Agamotto", cost: 5, power: 10, text: "Game Start: Shuffle 4 Ancient Arcana into your deck.",
    gameStart: ({ state, h, p }) => { for (const id of ["Spell01Agamotto", "Spell02Agamotto", "Spell03Agamotto", "Spell04Agamotto"]) state.players[p].deck.push(h.make(id, p)); h.shuffle(state.players[p].deck); } },
  Ajax: { name: "Ajax", cost: 5, power: 7, kind: "ongoing", text: "Ongoing: +1 Power for each card in play afflicted with negative Power.", selfPower: ({ state }) => { let n = 0; for (const L of state.locations) for (const q of [0, 1]) for (const c of L.cards[q]) if (c.afflicted > 0) n++; return n; } },
  Blink: { name: "Blink", cost: 5, power: 8, text: "On Reveal: Swap the last card you played with a card that costs the same or more from your deck.",
    onReveal: ({ state, h, p }) => { const last = state.players[p].lastPlayed && h.find(state.players[p].lastPlayed); const w = last && h.where(last.uid); if (!w || w.p !== p) return;   // a card that switched sides is no longer yours to swap
      const d = state.players[p].deck; const c = h.pick(chars(d).filter(c => c.cost >= last.cost)); if (!c) return; d.splice(d.indexOf(c), 1); h.remove(p, w.li, last.uid); h.playCard(p, w.li, c); d.push(last); h.shuffle(d); } },   // pull, resolve the pulled card, then shuffle the old one in
  CosmicGhostRider: { name: "Cosmic Ghost Rider", cost: 5, power: 6, text: "On Reveal: Remove the text from front-row enemy cards here.", onReveal: ({ h, p, li }) => h.frontRow(1 - p, li).forEach(c => h.silence(c)) },
  DeathFracturedFrontier: { name: "Death Fractured Frontier", cost: 5, power: 9, text: "On Reveal: Resurrect all your destroyed characters to random locations.",
    onReveal: ({ state, h, p }) => { const pile = state.destroyedPile[p]; while (pile.length) { const l = h.pick(h.openLocs(p).filter(l => h.canPlace(p, l))); if (l == null) break; h.place(p, l, pile.shift()); } } },
  Gilgamesh: { name: "Gilgamesh", cost: 5, power: 9, text: "On Reveal: +1 Power for each of your other cards in play with increased Power.", onReveal: ({ h, p, card }) => h.addPower(card, h.board(p).filter(x => x.card.uid !== card.uid && x.card.buffed > 0).length) },
  InfinityUltron: { name: "Infinity Ultron", cost: 5, power: 6, text: "On Reveal: Add 2 of Ultron's Stones to your hand.",
    onReveal: ({ h, p }) => h.shuffle(["UltronMindStone", "UltronPowerStone", "UltronRealityStone", "UltronSoulStone", "UltronSpaceStone", "UltronTimeStone"]).slice(0, 2).forEach(id => h.addToHand(p, h.make(id, p))) },
  Kluh: { name: "Kluh", cost: 5, power: 11, text: "On Reveal: EACH player randomly gives a card in their hand -1 Cost for each different Cost among their cards in play.",
    onReveal: ({ h }) => { for (let q = 0; q < 2; q++) { const n = new Set(h.board(q).map(x => x.card.cost)).size; for (let i = 0; i < n; i++) { const c = h.pick(h.state.players[q].hand.filter(c => !c.hidden && c.cost > 0)); if (c) c.cost -= 1; } } } },
  ManSpider: { name: "Man-Spider", cost: 5, power: 1, text: "On Reveal: Merge the last card you played into this. When this merges, double its Power.",
    onReveal: ({ state, h, p, card }) => { const last = state.players[p].lastPlayed && h.find(state.players[p].lastPlayed); if (last && last.uid !== card.uid) h.merge(last, card); },
    onMerged: ({ h, card }) => h.addPower(card, Math.max(0, card.power)) },
  Namora: { name: "Namora", cost: 5, power: 7, text: "On Reveal: Give +5 Power to each of your cards alone at another location.",
    onReveal: ({ h, p, li }) => { for (let l = 0; l < 3; l++) if (l !== li && h.cards(p, l).length === 1) h.addPower(h.cards(p, l)[0], 5); } },
  RogueScionOfDivision: { name: "Rogue Scion of Division", cost: 5, power: 5, text: "On Reveal: Steal the text of the highest-Cost card in your opponent's hand.",
    onReveal: ({ state, h, p, card }) => { const c = highestBy(chars(state.players[1 - p].hand), c => c.cost); if (c) { h.copyText(card, c.id); h.silence(c); } } },
  Sersi: { name: "Sersi", cost: 5, power: 7, text: "On Reveal: Transform your other characters here into random ones that cost 1 more. (if possible)",
    onReveal: ({ h, p, li, card }) => h.others(p, li, card).forEach(c => { const id = h.randomPoolId(d => d.cost === CARDS[c.id].cost + 1 && !d.skill); if (id) h.transform(c, id); }) },
  ShouLao: { name: "Shou-Lao the Undying", cost: 5, power: 8, text: "On Reveal: Give the last character you played +2 Power for each turn you played 2 or more cards. (+0)",
    onReveal: ({ state, h, p }) => { const c = state.players[p].lastPlayed && h.find(state.players[p].lastPlayed); if (c) h.addPower(c, 2 * (state.players[p].twoPlusTurns ?? 0)); } },
  StarlordMasterOfTheSun: { name: "Star-Lord, Master of the Sun", cost: 5, power: 7, text: "On Reveal: Next turn, you get +1 Energy for each turn you've ended with unspent Energy. (0 turns.)",
    onReveal: ({ state, p }) => { state.players[p].energyNext += state.players[p].unspentTurns; } },
  SuperiorIronMan: { name: "Superior Iron Man", cost: 5, power: 8, kind: "ongoing", text: "Double Cost reductions to this. Ongoing: Double Power increases to this.", doubleDiscounts: true, doublesIncreases: true },
  ThanosFracturedFrontier: { name: "Thanos Fractured Frontier", cost: 5, power: 7, text: "Game Start: Your cards have \"Quickdraw: Thanos loads an Infinity Shot.\" On Reveal: Fire all loaded Shots.",
    // a card played on the turn it was drawn loads a random Shot not yet loaded or fired; they fire in a fixed order (one source)
    gameStart: ({ state, p }) => { addRule(state, p, "ThanosFracturedFrontier"); state.players[p].shots = []; state.players[p].shotsSpent = []; },
    dynText: (card, state) => { const s = state.players[card.owner]?.shots; return s?.length ? `On Reveal: Fire all loaded Shots. (Loaded: ${SHOTS.filter(x => s.includes(x)).join(", ")})` : null; },
    ruleBeforeReveal: ({ state, p, h }, card) => { const pl = state.players[p]; if (card.drawnTurn !== state.turn || card.silenced) return; const s = h.pick(SHOTS.filter(x => !pl.shots.includes(x) && !pl.shotsSpent.includes(x))); if (s) { pl.shots.push(s); h.log(`Thanos loads the ${s} Shot`); } },
    onReveal: ({ state, h, p, card }) => {
      const pl = state.players[p]; if (!pl.shots) return;
      const loaded = SHOTS.filter(x => pl.shots.includes(x)); pl.shots = [];
      for (const s of loaded) {
        pl.shotsSpent.push(s);
        const w = h.where(card.uid); if (!w) continue;
        h.log(`${s} Shot`);
        if (s === "Space") { h.addPower(card, 1); card.moveableTurn = state.turn + 1; }
        if (s === "Reality") { const t = lowestBy(chars(h.others(w.p, w.li, card)), c => c.cost); if (t) h.spawn(t.id, w.p, w.li, { power: t.power, cost: t.cost }); }
        if (s === "Time") for (const c of pl.hand) c.cost = Math.max(0, c.cost - 1);
        if (s === "Mind") h.draw(p);
        if (s === "Power") h.addPower(card, 3);
        if (s === "Soul") { const t = lowestBy(h.cards(1 - w.p, w.li), c => h.cardPower(w.li, 1 - w.p, c)); if (t) h.destroy(1 - w.p, w.li, t.uid); }
      }
    } },
  FallenOne: { name: "The Fallen One", cost: 5, power: 5, text: "On Reveal: Set your Max Energy equal to this card's Power.", onReveal: ({ state, p, card }) => { state.players[p].maxEnergyBonus = card.power - state.turn; } },   // Max Energy becomes his Power now, and still grows by one next turn (guides)
  TheThingFirstSteps: { name: "The Thing First Steps", cost: 5, power: 6, text: "End of Turn: +2 Power. Once per game, if your side here is full, destroy an enemy card here with less Power.",
    endOfTurn: ({ h, p, li, card }) => { h.addPower(card, 2); if (!card.objDone && h.cards(p, li).length >= h.cap(li)) { const t = h.pick(h.cards(1 - p, li).filter(c => h.cardPower(li, 1 - p, c) < h.cardPower(li, p, card))); if (t) { card.objDone = true; h.destroy(1 - p, li, t.uid); } } } },
  WarMachine: { name: "War Machine", cost: 5, power: 9, kind: "ongoing", text: "Ongoing: Nothing can stop you from playing cards anywhere.", playAnywhere: true },
  WilsonFisk: { name: "Wilson Fisk", cost: 5, power: 8, text: "Costs 3 if you have the highest Power among cards in play.",
    costMod: (s, p, c) => { let mx = -Infinity, mine = -Infinity; for (let li = 0; li < 3; li++) for (const q of [0, 1]) for (const x of s.locations[li].cards[q]) { const pw = cardPower(s, li, q, x); if (pw > mx) mx = pw; if (q === p && pw > mine) mine = pw; } return mine > -Infinity && mine >= mx ? Math.min(0, 3 - c.cost) : 0; } },

  // ---------------- 6-cost and up ----------------
  Alioth: { name: "Alioth", cost: 6, power: 7, text: "On Reveal: Remove the text from all unrevealed enemy characters here.",
    onReveal: ({ h, p, li }) => { h.playedThisTurnBy(1 - p).forEach(x => { if (!x.revealed && x.li === li) h.silence(x.card); }); for (const c of h.cards(1 - p, li)) if (c.hiddenUntilEnd) h.silence(c); } },   // face-down cards from earlier turns are unrevealed too
  AntiPolarMagneto: { name: "Anti-Polar Magneto", cost: 6, power: 8, text: "On Reveal: Add a 3 or 4-Cost card from your hand to each other location.",
    onReveal: ({ state, h, p, li }) => { for (let l = 0; l < 3; l++) if (l !== li) { const c = h.pick(chars(state.players[p].hand).filter(c => c.cost === 3 || c.cost === 4)); if (c && h.canPlace(p, l)) { state.players[p].hand.splice(state.players[p].hand.indexOf(c), 1); h.place(p, l, c); } } } },
  Aurora: { name: "Aurora", cost: 6, power: 5, text: "On Reveal: Give one of your other On Reveal cards at each location +2 Power. Repeat for Ongoing, Activate, and End of Turn.",
    onReveal: ({ h, p, card }) => { for (const k of ["On Reveal:", "Ongoing:", "Activate:", "End of Turn:"]) for (let l = 0; l < 3; l++) { const t = h.pick(h.cards(p, l).filter(c => c.uid !== card.uid && !c.silenced && CARDS[c.id].text.includes(k))); if (t) h.addPower(t, 2); } } },
  Hulkling: { name: "Emperor Hulkling", cost: 6, power: 12, text: "Game Start: Copy the text of a random 6-Cost card.",
    gameStart: ({ h, card }) => { const id = h.randomPoolId(d => d.cost === 6 && !d.skill && d.id !== "Hulkling"); if (id) h.copyText(card, id); } },
  Eson: { name: "Eson", cost: 6, power: 10, text: "End of Turn: Put a created card from your hand here.",
    endOfTurn: ({ state, h, p, li }) => { const c = h.pick(state.players[p].hand.filter(c => c.created && !CARDS[c.id].skill)); if (c && h.canPlace(p, li)) { state.players[p].hand.splice(state.players[p].hand.indexOf(c), 1); h.place(p, li, c); } } },
  Galactus: { name: "Galactus", cost: 6, power: 6, text: "On Reveal: If you're winning this location and this is your only card here, destroy all other locations.",
    onReveal: ({ state, h, p, li }) => { if (h.winnerAt(li) !== p || h.cards(p, li).length !== 1) return; for (let l = 0; l < 3; l++) if (l !== li) { for (let q = 0; q < 2; q++) for (const c of [...h.cards(q, l)]) h.destroy(q, l, c.uid, { force: true }); h.replaceLocation(l, "Ruins"); state.locations[l].closedAfter = state.turn - 1; } } },
  GalactusFirstSteps: { name: "Galactus First Steps", cost: 6, power: 11, text: "My Herald is the next character I see you play. End of Turn: +2 Power if you're winning my Herald's location. (if in hand or in play)",
    // the first character revealed while he is in hand or in play; it stays the Herald wherever it goes, and counts only on your side
    afterPlayAny: ({ card }, played) => { if (!card.herald && !CARDS[played.id].skill && played.uid !== card.uid) card.herald = played.uid; },
    afterPlayAnyInHand: (ctx, played) => CARDS.GalactusFirstSteps.afterPlayAny(ctx, played),
    endOfTurn: ({ h, p, card }) => { const w = card.herald && h.where(card.herald); if (w && w.p === p && h.winnerAt(w.li) === p) h.addPower(card, 2); },
    endOfTurnInHand: (ctx) => CARDS.GalactusFirstSteps.endOfTurn(ctx) },
  Gorr: { name: "Gorr the God Butcher", cost: 6, power: 1, kind: "ongoing", text: "Ongoing: +2 Power for EACH On Reveal card in play.", selfPower: ({ h, state }) => { let n = 0; for (const L of state.locations) for (const q of [0, 1]) for (const c of L.cards[q]) if (CARDS[c.id].text.includes("On Reveal:") && !c.silenced) n++; return 2 * n; } },
  Khonshu: { name: "Khonshu", cost: 6, power: 5, text: "When Discarded: Return in its next phase. On Reveal: Resurrect a character you discarded to another location with its Power set to 5.",
    onDiscarded: ({ state, h, p, card }) => { state.discardPile[p].pop(); h.transform(card, "KhonshuWaxing"); h.addToHand(p, card); },
    moon: ({ state, h, p, li }, power) => { const pile = state.discardPile[p]; const c = h.pick(chars(pile)); const l = h.pick(h.otherLocs(li, p).filter(l => h.canPlace(p, l))); if (c && l != null) { pile.splice(pile.indexOf(c), 1); c.power = power; h.place(p, l, c); } },
    onReveal: (ctx) => CARDS.Khonshu.moon(ctx, 5) },
  Mockingbird: { name: "Mockingbird", cost: 6, power: 9, text: "Costs 1 less for each of your created cards in play.", costMod: (s, p) => { let n = 0; for (const L of s.locations) for (const c of L.cards[p]) if (c.created) n++; return -n; } },
  RedHulk: { name: "Red Hulk", cost: 6, power: 10, text: "End of Turn: If your opponent has unspent Energy, +3 Power. (if in hand or in play)",
    endOfTurn: ({ state, h, p, card }) => { if (state.players[1 - p].energy > 0) h.addPower(card, 3); }, endOfTurnInHand: ({ state, h, p, card }) => { if (state.players[1 - p].energy > 0) h.addPower(card, 3); } },
  ScorpionBrandNewDay: { name: "Scorpion Brand New Day", cost: 6, power: 6, kind: "ongoing", text: "Ongoing: Double the Power reductions on all enemy cards.", ongoing: (o) => !sameSide(o) ? -o.target.afflicted : 0 },
  SinisterSix: { name: "Sinister Six", cost: 6, power: 12, text: "Game Start: The first 6 characters you draw are EVIL! After you play them all, merge them into this and add this to the last one's location. (0/6)",
    // the opening hand counts as drawn; this card itself and cards made during the game are never EVIL; merged cards keep only their Power
    approx: "no ruling for an EVIL card that is discarded (the merge then never happens) or for this card being gone when the sixth is played (no merge)",
    gameStart: ({ state, p }) => { addRule(state, p, "SinisterSix"); state.players[p].evil = []; },
    dynText: (card, state) => { const pl = state.players[card.owner]; return pl?.evil ? CARDS.SinisterSix.text.replace("(0/6)", `(${pl.evilPlayed ?? 0}/6)`) : null; },
    ruleOnDraw: ({ state, p }, card) => { const pl = state.players[p]; if (pl.evil.length >= 6 || CARDS[card.id].skill || card.id === "SinisterSix" || card.created) return; card.evil = true; pl.evil.push(card.uid); },
    ruleAfterPlay: ({ state, p, h }, card, li) => {
      const pl = state.players[p];
      if (card.evil && !card.evilPlayed) { card.evilPlayed = true; pl.evilPlayed = (pl.evilPlayed ?? 0) + 1; }
      if (pl.evilDone || pl.evil.length < 6 || (pl.evilPlayed ?? 0) < 6) return;
      pl.evilDone = true;
      const six = everywhere(state, h, p).find(c => c.id === "SinisterSix");
      if (!six) return;
      const at = h.where(card.uid)?.li ?? li;
      for (const uid of pl.evil) {
        const w = h.where(uid);
        if (w && w.p === p) { const c = h.remove(p, w.li, uid); six.power += c.power; continue; }
        const i = state.destroyedPile[p].findIndex(c => c.uid === uid);
        if (i >= 0) six.power += state.destroyedPile[p].splice(i, 1)[0].power;
      }
      h.log("The Sinister Six assemble");
      const w = h.where(six.uid);
      if (w) { if (w.li !== at) h.move(p, w.li, at, six, { force: true }); return; }
      if (!h.canPlace(p, at)) return;   // stays where it was
      for (const zone of [pl.hand, pl.deck]) { const i = zone.indexOf(six); if (i >= 0) zone.splice(i, 1); }
      h.place(p, at, six);
    } },
  Thanos: { name: "Thanos", cost: 6, power: 12, text: "Game Start: Shuffle the six Infinity Stones into your deck.",
    gameStart: ({ state, h, p }) => { for (const id of STONES) state.players[p].deck.push(h.make(id, p)); h.shuffle(state.players[p].deck); } },
  VampireEnchantress: { name: "Vampire Enchantress", cost: 6, power: 7, text: "On Reveal: For each different Cost among your cards in play, steal 1 Power from an enemy card here.",
    onReveal: ({ h, p, li, card }) => { const n = new Set(h.board(p).map(x => x.card.cost)).size; for (let i = 0; i < n; i++) { const t = h.pick(h.cards(1 - p, li)); if (t) h.steal(t, card, 1); } } },
  Arishem: { name: "Arishem", cost: 7, power: 7, text: "Game Start: Shuffle 12 new cards into your deck. On turn 3, get +1 Max Energy.",
    gameStart: ({ state, h, p }) => { for (let i = 0; i < 12; i++) state.players[p].deck.push(h.make(h.randomPoolId(d => !d.skill), p)); h.shuffle(state.players[p].deck); state.players[p].arishem = true; } },
  Dormammu: { name: "Dormammu", cost: 7, power: 13, text: "Game Start: Begin a Summoning Ritual. (Add step 1 to hand.)",
    approx: "no ruling for a step that cannot fully resolve: here it is spent and the ritual stops",
    gameStart: ({ state, h, p }) => { const pl = state.players[p]; (pl.startExtras = pl.startExtras ?? []).push(h.make("SummoningRitual01Dormammu", p)); } },
  FinFangFoom: { name: "Fin Fang Foom", cost: 7, power: 14, text: "On Reveal: Gain the Power of a front-row enemy card here.", onReveal: ({ h, p, li, card }) => { const t = h.pick(h.frontRow(1 - p, li)); if (t) h.addPower(card, Math.max(0, h.cardPower(li, 1 - p, t))); } },
  WeaponH: { name: "Weapon H", cost: 7, power: 14, text: "When Discarded: Put this back with -2 Cost.",
    onDiscarded: ({ state, h, p, card }) => { const pile = state.discardPile[p]; const i = pile.findIndex(c => c.uid === card.uid); if (i < 0) return; pile.splice(i, 1); card.cost = Math.max(0, card.cost - 2); if (!h.addToHand(p, card)) pile.push(card); } },
  ZombieGalacti: { name: "Zombie Galacti", cost: 7, power: 5, text: "Game Start: Choose 6 other characters in your deck. On Reveal: Transform those cards into copies of this.",
    // the game marks six at random when the game starts; copies take his Power as it stands
    gameStart: ({ state, h, p, card }) => { for (const c of h.shuffle(chars(state.players[p].deck).filter(c => c.uid !== card.uid)).slice(0, 6)) c.zg = true; },
    onReveal: ({ state, h, p, card }) => { for (const c of everywhere(state, h, p)) if (c.zg) { delete c.zg; h.transform(c, "ZombieGalacti"); c.power = card.power; } } },
  MonstroOctopus: { name: "Monstro", cost: 8, power: 8, text: "This card's cost is reduced by the cost of your deck's top card.", costMod: (s, p) => -(s.players[p].deck[0]?.cost ?? 0) },

  // ---------------- tokens ----------------
  FlamesOfTheFaltine: { name: "Flames of the Faltine", cost: 1, power: 0, skill: true, token: true, text: "On Reveal: Afflict an enemy card here with -3 Power.", onReveal: ({ h, p, li }) => { const t = h.pick(h.cards(1 - p, li)); if (t) h.addPower(t, -3); } },
  AcidArrow: { name: "Acid Arrow", cost: 1, power: -2, token: true, text: "On Reveal: Switch sides.", onReveal: ({ h, li, card }) => { h.switchSides(li, card); } },
  BasicArrow: { name: "Basic Arrow", cost: 1, power: 1, token: true, text: "On Reveal: If you play a card at this location next turn, +4 Power.", onReveal: ({ state, p, li, card }) => state.pending.push({ kind: "ifPlayed", p, li, uid: card.uid, turn: state.turn + 1, amount: 4 }) },
  GrappleArrow: { name: "Grapple Arrow", cost: 1, power: 3, token: true, text: "On Reveal: After you play your next card, move it to this location.", onReveal: ({ state, p, li }) => { state.players[p].nextCardMoveTo = li; } },
  PymParticleArrow: { name: "PymParticle Arrow", cost: 1, power: 1, token: true, kind: "ongoing", text: "Ongoing: If your side of this location is full, +3 Power.", selfPower: ({ state, li, p }) => state.locations[li].cards[p].length >= (LOCCAP(state, li)) ? 3 : 0 },
  SwordOfFuXi: { name: "Sword of Fu Xi", cost: 2, power: 2, token: true, kind: "ongoing", text: "Ongoing: If Lin Lie Iron Fist is here, he has +8 Power.", ongoing: (o) => sameSide(o) && here(o) && o.target.id === "LinLie" ? 8 : 0 },
  CapsShield: { name: "Cap's Shield", cost: 0, power: 0, token: true, kind: "ongoing", text: "Ongoing: This can't be destroyed. Give your Cap +2 Power when this moves to Cap's location.", cantDestroy: true, moveable: "always", moveableIf: (s, p) => s.locations.some(L => L.cards[p].some(c => c.id === "SamWilson" && !c.silenced)),
    onSelfMoved: ({ h, p, li }) => h.cards(p, li).forEach(c => { if (c.id === "SamWilson") h.addPower(c, 2); }) },
  SPdr: { name: "SP//dr", cost: 3, power: 5, token: true, text: "On Reveal: Merge this into one of your cards here. It's Moveable next turn.",
    onReveal: ({ state, h, p, li, card }) => { const t = h.pick(h.others(p, li, card)); if (t) { h.merge(card, t); t.moveableTurn = state.turn + 1; } } },
  // Prowler's Thief's Tools
  FlightHarness: { name: "Flight Harness", cost: 1, power: 0, skill: true, token: true, text: "On Reveal: Give your highest-Power card here +1 Power and move it to the right.",
    onReveal: ({ h, p, li }) => { const t = highestBy(h.cards(p, li), c => h.cardPower(li, p, c)); if (!t) return; h.addPower(t, 1); if (li < 2) h.move(p, li, li + 1, t); } },
  RemoteMines: { name: "Remote Mines", cost: 1, power: 0, skill: true, token: true, text: "On Reveal: Afflict the 2 highest-Power enemy cards here with -2 Power.",
    onReveal: ({ h, p, li }) => [...h.cards(1 - p, li)].sort((a, b) => h.cardPower(li, 1 - p, b) - h.cardPower(li, 1 - p, a)).slice(0, 2).forEach(c => h.addPower(c, -2)) },
  VibroShockGauntlets: { name: "Vibro-Shock Gauntlets", cost: 1, power: 0, skill: true, token: true, text: "On Reveal: Give your highest-Power card here +2 Power. You get +1 Energy next turn.",
    onReveal: ({ state, h, p, li }) => { const t = highestBy(h.cards(p, li), c => h.cardPower(li, p, c)); if (t) h.addPower(t, 2); state.players[p].energyNext += 1; } },
  IceCube: { name: "Ice Cube", cost: 1, power: 0, token: true, text: "Start of turn: +1 Energy. Then destroy this if your side is full here.",
    startOfTurn: ({ state, h, p, li, card }) => { state.players[p].energyNext += 1; if (!h.hasRoom(p, li)) h.destroy(p, li, card.uid); } },
  WidowsKiss: { name: "Widow's Kiss", cost: 0, power: -4, token: true, text: "Destroy this when your side of this location is full.",
    afterAnyPlayHere: ({ h, p, li, card }) => { if (!h.hasRoom(p, li)) h.destroy(p, li, card.uid); }, endOfTurn: ({ h, p, li, card }) => { if (!h.hasRoom(p, li)) h.destroy(p, li, card.uid); } },
  // Merlin's Incantations
  OmniversalPresence: { name: "Omniversal Presence", cost: 1, power: 0, skill: true, token: true, text: "On Reveal: Replace this location with a new one and give Merlin +1 Power.",
    onReveal: ({ h, p, li }) => { h.replaceLocation(li); for (const x of h.board(p)) if (x.card.id === "Merlin") h.addPower(x.card, 1); } },
  OnceAndFuture: { name: "Once And Future", cost: 1, power: 0, skill: true, token: true, text: "On Reveal: Shuffle your lowest-Power card here into your deck to get +2 Energy next turn.",
    onReveal: ({ state, h, p, li }) => { const t = lowestBy(h.cards(p, li), c => h.cardPower(li, p, c)); if (!t) return; h.remove(p, li, t.uid); state.players[p].deck.push(t); h.shuffle(state.players[p].deck); state.players[p].energyNext += 2; } },
  Polymorph: { name: "Polymorph", cost: 1, power: 0, skill: true, token: true, text: "On Reveal: Transform your lowest-Power character here into one that costs 1 more.",
    onReveal: ({ h, p, li }) => { const t = lowestBy(h.cards(p, li), c => h.cardPower(li, p, c)); if (!t) return; const id = h.randomCharId(d => d.cost === t.cost + 1); if (id) h.transform(t, id); } },
  // Dormammu's ritual. Each step hands over the next only if it fully resolves; the third brings him in from the hand or deck.
  SummoningRitual01Dormammu: { name: "Summoning Ritual 1", cost: 0, power: 0, skill: true, token: true, text: "On Reveal: Merge your highest-Power destroyed card into Dormammu to continue. (step 1/3)",
    onReveal: ({ state, h, p }) => { const d = findDormammu(state, h, p), pile = state.destroyedPile[p]; const t = highestBy(chars(pile), c => c.power); if (!d || !t) return; pile.splice(pile.indexOf(t), 1); d.power += t.power; h.log(`${h.name(t)} merges into Dormammu`); h.addToHand(p, h.make("SummoningRitual02Dormammu", p)); } },
  SummoningRitual02Dormammu: { name: "Summoning Ritual 2", cost: 1, power: 0, skill: true, token: true, text: "On Reveal: Dormammu steals 1 Power from EACH card here to continue. (step 2/3)",
    onReveal: ({ state, h, p, li }) => { const d = findDormammu(state, h, p); const here = [...h.cards(0, li), ...h.cards(1, li)].filter(c => c !== d); if (!d || !here.length) return; for (const c of here) h.steal(c, d, 1); h.addToHand(p, h.make("SummoningRitual03Dormammu", p)); } },
  SummoningRitual03Dormammu: { name: "Summoning Ritual 3", cost: 2, power: 0, skill: true, token: true, text: "On Reveal: Destroy 2 of your characters here to summon Dormammu. (step 3/3)",
    onReveal: ({ state, h, p, li }) => { const d = findDormammu(state, h, p); const pl = state.players[p]; const two = h.shuffle(h.cards(p, li).filter(c => c !== d)).slice(0, 2); if (!d || two.length < 2) return; let n = 0; for (const c of two) if (h.destroy(p, li, c.uid)) n++; if (n < 2 || h.where(d.uid) || !h.canPlace(p, li)) return; for (const zone of [pl.hand, pl.deck]) { const i = zone.indexOf(d); if (i >= 0) zone.splice(i, 1); } h.place(p, li, d); h.log("Dormammu is summoned"); } },
  TaoMandala: { name: "Tao Mandala", cost: 3, power: 0, skill: true, token: true, text: "On Reveal: Copy the text of one of your Ongoing cards here onto your other characters here.",
    onReveal: ({ h, p, li, card }) => { const own = h.others(p, li, card); const src = h.pick(own.filter(c => CARDS[c.id].kind === "ongoing" && !c.silenced)); if (!src) return; for (const c of own) if (c.uid !== src.uid && !CARDS[c.id].skill) h.copyText(c, src.id); } },
  // Agamotto's four Ancient Arcana
  Spell01Agamotto: { name: "Winds of Watoomb", cost: 2, power: 0, skill: true, token: true, text: "On Reveal: Afflict an enemy card here with -5 Power and move it right.",
    onReveal: ({ h, p, li }) => { const t = h.pick(h.cards(1 - p, li)); if (t) { h.addPower(t, -5); h.move(1 - p, li, li + 1, t); } } },
  Spell02Agamotto: { name: "Temporal Manipulation", cost: 1, power: 0, skill: true, token: true, text: "On Reveal: Give Agamotto +3 Power. Put him into your hand if he's not in play.",
    onReveal: ({ state, h, p }) => { const pl = state.players[p]; const a = h.board(p).find(x => x.card.id === "Agamotto")?.card ?? pl.hand.find(c => c.id === "Agamotto") ?? pl.deck.find(c => c.id === "Agamotto"); if (!a) return; h.addPower(a, 3); if (pl.deck.includes(a) && h.addToHand(p, a)) pl.deck.splice(pl.deck.indexOf(a), 1); } },
  Spell03Agamotto: { name: "Images of Ikonn", cost: 4, power: 0, skill: true, token: true, text: "On Reveal: Transform your other cards here into copies of the highest-Power one.",
    onReveal: ({ h, p, li }) => { const top = highestBy(h.cards(p, li), c => h.cardPower(li, p, c)); if (top) for (const c of h.cards(p, li)) if (c.uid !== top.uid) { h.transform(c, top.id); c.cost = top.cost; c.power = top.power; } } },
  Spell04Agamotto: { name: "Bolts of Balthakk", cost: 3, power: 0, skill: true, token: true, text: "On Reveal: Next turn, you get +4 Energy.", onReveal: ({ state, p }) => { state.players[p].energyNext += 4; } },
  // Infinity Ultron's six stones
  UltronMindStone: { name: "Ultron Mind Stone", cost: 2, power: 2, token: true, kind: "ongoing", text: "Ongoing: Your On Reveal abilities here repeat.", repeatsReveals: true },
  UltronPowerStone: { name: "Ultron Power Stone", cost: 2, power: 1, token: true, text: "On Reveal: Double Infinity Ultron's Power.",
    onReveal: ({ h, p }) => { const u = h.board(p).find(x => x.card.id === "InfinityUltron")?.card; if (u && u.power > 0) h.addPower(u, u.power); } },
  UltronRealityStone: { name: "Ultron Reality Stone", cost: 2, power: 1, token: true, text: "On Reveal: Add a Drone here. Set its Power to Infinity Ultron's.",
    onReveal: ({ h, p, li }) => { const u = h.board(p).find(x => x.card.id === "InfinityUltron")?.card; const d = h.spawn("Drone", p, li); if (d && u) d.power = u.power; } },
  UltronSoulStone: { name: "Ultron Soul Stone", cost: 2, power: 3, token: true, text: "On Reveal: For each of your full locations, give one of your cards there +3 Power.",
    onReveal: ({ h, p }) => { for (let l = 0; l < 3; l++) if (h.cards(p, l).length >= h.cap(l)) { const t = h.pick(h.cards(p, l)); if (t) h.addPower(t, 3); } } },
  UltronSpaceStone: { name: "Ultron Space Stone", cost: 2, power: 6, token: true, text: "On Reveal: Move the lowest-Power enemy card here to the location of Infinity Ultron.",
    onReveal: ({ h, p, li }) => { const u = h.board(p).find(x => x.card.id === "InfinityUltron"); const t = lowestBy(h.cards(1 - p, li), c => h.cardPower(li, 1 - p, c)); if (u && t) h.move(1 - p, li, u.li, t); } },
  UltronTimeStone: { name: "Ultron Time Stone", cost: 2, power: 4, token: true, text: "On Reveal: Put a card from your hand here.",
    onReveal: ({ state, h, p, li }) => { const hand = state.players[p].hand; const c = h.pick(chars(hand)); if (c && h.canPlace(p, li)) { hand.splice(hand.indexOf(c), 1); h.place(p, li, c); } } },
  TenRings: { name: "The Ten Rings", cost: 2, power: 2, token: true, text: "On Reveal: Give one of your other cards here +1 Power.", onReveal: ({ h, p, li, card }) => { const t = h.pick(h.others(p, li, card)); if (t) h.addPower(t, 1); } },
  TenRingsUpgrade: { name: "The Ten Rings Upgraded", cost: 2, power: 3, token: true, text: "End of Turn: Give your other cards here +1 Power.", endOfTurn: ({ h, p, li, card }) => h.others(p, li, card).forEach(c => h.addPower(c, 1)) },
  // Infinity Stones. Each records itself as played so the Power Stone can count all six.
  PowerStone: { name: "Power Stone", cost: 1, power: 3, kind: "ongoing", token: true, text: "Ongoing: If you've played all 6 stones, Thanos has +10 Power. (wherever he is)", approx: "the +10 counts in play and shows on a Thanos in hand; effects that compare the Power of cards in hand or deck do not see it",
    anywhereBonus: (state, p, card) => card.id === "Thanos" && STONES.every(id => (state.players[p].playedIds ?? []).includes(id)) ? 10 : 0,
    ongoing: (o) => sameSide(o) && o.target.id === "Thanos" && STONES.every(id => (o.state.players[o.selfOwner].playedIds ?? []).includes(id)) ? 10 : 0 },
  TimeStone: { name: "Time Stone", cost: 1, power: 1, token: true, text: "On Reveal: Draw a card. Give Thanos -1 Cost.",
    onReveal: (ctx) => { stonePlayed(ctx); const { state, h, p } = ctx; h.draw(p); for (const c of [...state.players[p].hand, ...state.players[p].deck]) if (c.id === "Thanos") c.cost = Math.max(0, c.cost - 1); } },
  SpaceStone: { name: "Space Stone", cost: 1, power: 3, kind: "ongoing", token: true, text: "On Reveal: Draw Thanos. Ongoing: Nothing can stop you from playing Thanos.", freesThanos: true,
    onReveal: (ctx) => { stonePlayed(ctx); ctx.h.draw(ctx.p, 1, c => c.id === "Thanos"); } },
  MindStone: { name: "Mind Stone", cost: 1, power: 1, token: true, text: "On Reveal: Draw 2 stones from your deck.", onReveal: (ctx) => { stonePlayed(ctx); ctx.h.draw(ctx.p, 2, c => STONES.includes(c.id)); } },
  RealityStone: { name: "Reality Stone", cost: 1, power: 2, token: true, text: "On Reveal: Replace this location with a new one.", onReveal: (ctx) => { stonePlayed(ctx); ctx.h.replaceLocation(ctx.li); } },
  SoulStone: { name: "Soul Stone", cost: 1, power: 1, kind: "ongoing", token: true, text: "On Reveal: Draw a card. Ongoing: Thanos can't be discarded or destroyed.",
    onReveal: (ctx) => { stonePlayed(ctx); ctx.h.draw(ctx.p); }, protectsDestroy: (card) => card.id === "Thanos", protectsDiscard: (card) => card.id === "Thanos" },
  KhonshuWaxing: { name: "Khonshu Waxing", cost: 6, power: 8, token: true, text: "When Discarded: Return in its final phase. On Reveal: Resurrect a character you discarded to another location with its Power set to 8.",
    onDiscarded: ({ state, h, p, card }) => { state.discardPile[p].pop(); h.transform(card, "KhonshuFull"); h.addToHand(p, card); }, onReveal: (ctx) => CARDS.Khonshu.moon(ctx, 8) },
  KhonshuFull: { name: "Khonshu Full", cost: 6, power: 12, token: true, text: "On Reveal: Resurrect a character you discarded to another location with its Power set to 12.", onReveal: (ctx) => CARDS.Khonshu.moon(ctx, 12) },
  ZombieHorde: { name: "Zombie Horde", cost: 0, power: 0, token: true, text: "" },
  DoomBot2099: { name: "DoomBot 2099", cost: 4, power: 0, token: true, kind: "ongoing", text: "Ongoing: Your other DoomBots and Doom have +1 Power.",
    ongoing: (o) => sameSide(o) && o.target.uid !== o.self.uid && ["DoomBot", "DoomBot2099", "DrDoom", "Doom2099"].includes(o.target.id) ? 1 : 0 },
  CrimsonBehemoth: { name: "Crimson Behemoth", cost: 4, power: 9, token: true, text: "On Reveal: Steal all the Power of a front-row enemy card here.",
    onReveal: ({ h, p, li, card }) => { const t = h.pick(h.frontRow(1 - p, li)); if (t && t.power > 0) h.steal(t, card, t.power); } },
  ApocalypseCelestialsChosen: { name: "Apocalypse, Celestials' Chosen", cost: 4, power: 8, token: true, text: "On Reveal: Swap the lowest-Power character in your front row at any location with one from your deck.",
    onReveal: ({ state, h, p, card }) => { const deck = state.players[p].deck; const front = [0, 1, 2].flatMap(l => h.frontRow(p, l).filter(c => c.uid !== card.uid).map(c => ({ c, l }))); const t = lowestBy(front, x => h.cardPower(x.l, p, x.c)); const d = h.pick(chars(deck)); if (!t || !d) return; const row = h.cards(p, t.l); const i = row.indexOf(t.c); deck.splice(deck.indexOf(d), 1); row.splice(i, 1, d); d.owner = p; deck.push(t.c); h.shuffle(deck); h.log(`${h.name(t.c)} is swapped for ${h.name(d)}`); } },
  // High Evolutionary's evolved cards
  EvolvedWasp: { name: "Evolved Wasp", cost: 0, power: 1, token: true, text: "On Reveal: Afflict an enemy card here with -1 Power.", onReveal: ({ h, p, li }) => { const t = h.pick(h.cards(1 - p, li)); if (t) h.addPower(t, -1); } },
  EvolvedMistyKnight: { name: "Evolved Misty Knight", cost: 1, power: 3, token: true, text: "End of Turn: If you have unspent Energy, give one of your other cards +1 Power.",
    endOfTurn: ({ state, h, p, card }) => { if (state.players[p].energy > 0) { const t = h.pick(h.board(p).filter(x => x.card.uid !== card.uid)); if (t) h.addPower(t.card, 1); } } },
  EvolvedShocker: { name: "Evolved Shocker", cost: 2, power: 4, token: true, text: "On Reveal: Give the leftmost card in your hand -1 Cost.", onReveal: ({ state, p }) => { const c = state.players[p].hand[0]; if (c && c.cost > 0) c.cost -= 1; } },
  EvolvedCyclops: { name: "Evolved Cyclops", cost: 3, power: 5, token: true, text: "End of Turn: If you have unspent Energy, afflict 2 enemy cards here with -1 Power.",
    endOfTurn: ({ state, h, p, li }) => { if (state.players[p].energy > 0) h.shuffle([...h.cards(1 - p, li)]).slice(0, 2).forEach(c => h.addPower(c, -1)); } },
  EvolvedTheThing: { name: "Evolved The Thing", cost: 4, power: 7, token: true, text: "On Reveal: Afflict 3 enemy cards here with -1 Power.", onReveal: ({ h, p, li }) => h.shuffle([...h.cards(1 - p, li)]).slice(0, 3).forEach(c => h.addPower(c, -1)) },
  EvolvedAbomination: { name: "Evolved Abomination", cost: 5, power: 9, token: true, text: "Costs 1 less for each enemy card in play that's afflicted with negative Power.",
    costMod: (s, p) => { let n = 0; for (const L of s.locations) for (const c of L.cards[1 - p]) if (c.afflicted > 0) n++; return -n; } },
  EvolvedHulk: { name: "Evolved Hulk", cost: 6, power: 14, token: true, text: "End of Turn: If you have unspent Energy, +2 Power. (if in hand or in play)",
    endOfTurn: ({ state, h, p, card }) => { if (state.players[p].energy > 0) h.addPower(card, 2); }, endOfTurnInHand: ({ state, h, p, card }) => { if (state.players[p].energy > 0) h.addPower(card, 2); } },
  // ---------------- released after the first snapshot (added by the update pass of 2026-11-10) ----------------
  CaptainBritain: { name: "Captain Britain", cost: 2, power: 2, text: "After you play a 4-Cost or more card, give it +1 Power and a card in your hand -1 Cost.",
    afterPlayAny: ({ state, h, p }, played) => { if (played.cost < 4) return; if (h.where(played.uid)) h.addPower(played, 1); const c = h.pick(state.players[p].hand.filter(c => c.cost > 0)); if (c) c.cost -= 1; },
    afterSkill: (ctx, played) => CARDS.CaptainBritain.afterPlayAny(ctx, played) },
  MerlinOfAvalon: { name: "Merlin of Avalon", cost: 1, power: 2, text: "On Reveal: Add The Grand Design to your hand.", onReveal: ({ h, p }) => h.addToHand(p, h.make("TheGrandDesign", p)) },
  TheGrandDesign: { name: "The Grand Design", cost: 6, power: 0, skill: true, token: true, text: "Costs 1 less per created card played. On Reveal: Give one of your cards at each other location +5 Power.",
    costMod: (s, p) => -(s.players[p].createdPlayed ?? 0),
    onReveal: ({ h, p, li }) => { for (let l = 0; l < 3; l++) if (l !== li) { const t = h.pick(h.cards(p, l)); if (t) h.addPower(t, 5); } } },
  VampireKillmonger: { name: "Vampire Killmonger", cost: 2, power: 2, text: "End of Turn: If you spent all your Energy, get a Vampiric Spear.",
    endOfTurn: ({ state, h, p }) => { if (state.players[p].energy === 0) h.addToHand(p, h.make("VampiricSpear", p)); } },
  VampiricSpear: { name: "Vampiric Spear", cost: 1, power: 0, skill: true, token: true, text: "On Reveal: Vampire Killmonger steals 2 Power from a character in your opponent's hand.",
    onReveal: ({ state, h, p }) => { const vk = h.board(p).find(x => x.card.id === "VampireKillmonger")?.card ?? state.players[p].hand.find(c => c.id === "VampireKillmonger"); const t = h.pick(chars(state.players[1 - p].hand)); if (vk && t) h.steal(t, vk, 2); } },
  ZombieBlackCat: { name: "Zombie Black Cat", cost: 3, power: 5, text: "When Discarded: Discard another When Discarded card. Jump to your location with the fewest cards.",
    onDiscarded: ({ state, h, p, card }) => {
      const other = h.pick(state.players[p].hand.filter(c => c.uid !== card.uid && CARDS[c.id].onDiscarded && !c.silenced)); if (other) h.discard(p, other);
      const pile = state.discardPile[p]; const i = pile.findIndex(c => c.uid === card.uid); if (i < 0) return;
      const l = lowestBy([0, 1, 2].filter(l => h.canPlace(p, l)), l => h.cards(p, l).length); if (l == null) return;
      pile.splice(i, 1); h.place(p, l, card); h.log(`${h.name(card)} jumps in`);
    } },
};
