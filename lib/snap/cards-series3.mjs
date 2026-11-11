// Marvel Snap Series 3 (125 cards), stats and text as published by marvelsnapzone.com, plus their tokens.
// Same hook vocabulary as cards.mjs, with these additions handled by the engine:
//   activate(ctx)                       player action, once per card (submission.activates)
//   costMod(state, p, card) -> delta    this card's own dynamic cost
//   handCostMod(state, p, card) -> delta  ongoing: changes the cost of the owner's hand cards
//   startOfTurn(ctx), endOfTurnInHand(ctx), endOfGame(ctx)
//   afterAnyPlayHere(ctx, played, owner)  any card by anyone revealed at this location
//   canPlayAtLoc(state, p, li, card), blocksPlayHere(state, li, p, card), forcesFirstPlay, maxPlays
//   flags: mobius, protectsReduce, repeatsReveals, mimicsEnemies, approx (not fully implemented)
import { CARDS } from "./cards.mjs";
import { cardPower, effCost, locCap, locPower, winnerAt } from "./engine.mjs";

const sameSide = (o) => o.selfOwner === o.targetOwner;
const here = (o) => o.selfLoc === o.targetLoc;
const oppPlayedHere = ({ state, p, li }) => state.players[1 - p].playedThisTurn[li] > 0;
const lowestBy = (arr, f) => arr.length ? arr.reduce((a, b) => f(b) < f(a) ? b : a) : null;
const highestBy = (arr, f) => arr.length ? arr.reduce((a, b) => f(b) > f(a) ? b : a) : null;
const discardLowest = (h, state, p, f) => { const c = lowestBy(state.players[p].hand, f); if (c) h.discard(p, c); };
const randomTo = (h, p, li) => h.pick(h.otherLocs(li, p));
// id of the last card `p` played: the live card if it is still in play, else the snapshot the engine kept when it was played
const lastPlayedId = (state, h, p) => { const pl = state.players[p]; const live = pl.lastPlayed && h.find(pl.lastPlayed); return live ? live.id : (pl.lastPlayedInfo?.id ?? null); };

export const SERIES3 = {
  // ---------------- 0 / 1-cost ----------------
  Wasp: { name: "Wasp", cost: 0, power: 1, text: "" },
  Yellowjacket: { name: "Yellowjacket", cost: 0, power: 2, text: "On Reveal: Afflict your other cards here with -1 Power.",
    onReveal: ({ h, p, li, card }) => h.others(p, li, card).forEach(c => h.addPower(c, -1)) },
  Bast: { name: "Bast", cost: 1, power: 1, text: "On Reveal: Set the Power of all cards in your hand to 3.",
    onReveal: ({ state, p }) => state.players[p].hand.forEach(c => { c.power = 3; }) },
  BlackCat: { name: "Black Cat", cost: 1, power: 4, text: "End of Turn: Discard this from your hand.",
    endOfTurnInHand: ({ h, p, card }) => h.discard(p, card) },
  Deadpool: { name: "Deadpool", cost: 1, power: 1, text: "When Destroyed: Return this to your hand with double the Power.",
    onDestroyed: ({ h, p, card }) => h.addToHand(p, h.make("Deadpool", p, { power: card.power * 2, created: false })) },
  Echo: { name: "Echo", cost: 1, power: 2, text: "After your opponent plays an Ongoing card here, remove its abilities.",
    afterAnyPlayHere: ({ h, p }, played, owner) => { if (owner !== p && h.isOngoing(played)) h.silence(played); } },
  GhostSpider: { name: "Ghost-Spider", cost: 1, power: 3, text: "On Reveal: The last card you played moves here.",
    onReveal: ({ state, h, p, li }) => { const uid = state.players[p].lastPlayed; const w = uid && h.where(uid); if (w && w.li !== li) h.move(w.p, w.li, li, h.find(uid)); } }, // nothing to move when that card has left play
  HowardTheDuck: { name: "Howard the Duck", cost: 1, power: 2, kind: "ongoing", text: "Ongoing: Tap this to see the top card of your deck.", showsTopDeck: true },   // the board shows it
  Kingpin: { name: "Kingpin", cost: 1, power: 3, text: "When an enemy card moves here, afflict it with -2 Power.",
    onMoveHere: ({ h, p }, mover) => { if (mover.owner !== p) h.addPower(mover, -2); } },
  KittyPryde: { name: "Kitty Pryde", cost: 1, power: 1, text: "Start of Turn: Return this to your hand. When this returns to your hand, +1 Power.",
    startOfTurn: ({ h, p, li, card }) => { h.returnToHand(p, li, card); },
    onReturned: ({ h, card }) => h.addPower(card, 1) },   // whoever returns her: herself, Beast, Falcon, Luke's Bar
  MBaku: { name: "M'Baku", cost: 1, power: 3, text: "At the end of the game, this jumps from your deck to your lowest-Power location. (that isn't full)",
    endOfGameInDeck: ({ state, h, p, card }) => { const l = lowestBy([0, 1, 2].filter(l => h.canPlace(p, l)), l => h.locPower(l, p)); if (l == null) return; const d = state.players[p].deck; d.splice(d.indexOf(card), 1); h.place(p, l, card); h.log(`${h.name(card)} jumps in`); } },
  MariaHill: { name: "Maria Hill", cost: 1, power: 3, text: "On Reveal: Add a random 2-Cost card to your hand.",
    onReveal: ({ h, p }) => { const id = h.randomPoolId(d => d.cost === 2); if (id) h.addToHand(p, h.make(id, p)); } },
  Martyr: { name: "Martyr", cost: 1, power: 5, text: "At the end of the game, move to a location that LOSES you the game. (if possible)",
    endOfGame: ({ h, p, li, card }) => { if (h.leader() !== p) return; for (const l of h.otherLocs(li, p)) { const st = h.state; const src = st.locations[li].cards[p]; const i = src.findIndex(c => c.uid === card.uid); src.splice(i, 1); st.locations[l].cards[p].push(card); if (h.leader() === 1 - p) { h.log(`${h.name(card)} moves to lose`); return; } st.locations[l].cards[p].pop(); src.splice(i, 0, card); } } },
  Nebula: { name: "Nebula", cost: 1, power: 1, text: "Each turn your opponent doesn't play a card here, +2 Power. (except the turn you play this)",
    // the game's card adds "(except the turn you play this)"
    endOfTurn: ({ state, h, p, li, card }) => { if (card.playedTurn !== state.turn && state.players[1 - p].playedThisTurn[li] === 0) h.addPower(card, 2); } },
  Quinjet: { name: "Quinjet", cost: 1, power: 1, kind: "ongoing", text: "Ongoing: Your created cards cost 1 less. (minimum 1)",
    handCostMod: (s, p, c) => c.created && c.cost > 1 ? -1 : 0 },
  Sauron: { name: "Sauron", cost: 1, power: 2, text: "On Reveal: Remove the abilities from all Ongoing cards in your deck.",
    onReveal: ({ state, h, p }) => state.players[p].deck.filter(c => h.isOngoing(c)).forEach(c => h.silence(c)) },
  Selene: { name: "Selene", cost: 1, power: 2, text: "On Reveal: Afflict the lowest-Power card in each player's hand with -3 Power.",
    onReveal: ({ state }) => { for (let q = 0; q < 2; q++) { const c = lowestBy(state.players[q].hand, c => c.power); if (c) c.power -= 3; } } },
  Snowguard: { name: "Snowguard", cost: 1, power: 2, text: "On Reveal: Add the Hawk and Bear auroras to your hand.",
    onReveal: ({ h, p }) => { h.addToHand(p, h.make("SnowguardHawk", p)); h.addToHand(p, h.make("SnowguardBear", p)); } },
  SpiderHam: { name: "Spider-Ham", cost: 1, power: 1, text: "Activate: Replace the text of a random character in your opponent's hand with \"oink!\"",
    activate: ({ state, h, p }) => { const c = h.pick(state.players[1 - p].hand.filter(c => !CARDS[c.id].skill)); if (c) h.silence(c); } },
  Hood: { name: "The Hood", cost: 1, power: -3, text: "On Reveal: Add a Demon to your hand.", onReveal: ({ h, p }) => h.addToHand(p, h.make("Demon", p)) },
  Titania: { name: "Titania", cost: 1, power: 5, text: "After ANY card is played here, this card switches sides.",
    // once per card played: the engine offers a play to each side's cards in turn, so a card that has just changed sides is offered it again
    afterAnyPlayHere: ({ state, h, li, card }, played) => { const key = `${state.turn}:${played.uid}`; if (card.switchedFor === key) return; card.switchedFor = key; h.switchSides(li, card); } },
  Zabu: { name: "Zabu", cost: 1, power: 1, text: "On Reveal: Give each 4-Cost card in your deck -1 Cost.",
    onReveal: ({ state, p }) => state.players[p].deck.filter(c => c.cost === 4).forEach(c => { c.cost = 3; }) },
  Zero: { name: "Zero", cost: 1, power: 3, text: "On Reveal: Remove the abilities on the next card you play.", onReveal: ({ state, p }) => { state.players[p].nextCardSilence = true; } },

  // ---------------- 2-cost ----------------
  AdamWarlock: { name: "Adam Warlock", cost: 2, power: 0, text: "End of Turn: Draw a card if you're winning here. Otherwise, +1 Power.",
    endOfTurn: ({ h, p, li, card }) => { if (h.winnerAt(li) === p) h.draw(p); else h.addPower(card, 1); } },
  BaronMordo: { name: "Baron Mordo", cost: 2, power: 3, text: "On Reveal: The top card of your opponent's deck costs 6 until turn 6.",
    onReveal: ({ state, p }) => { const c = state.players[1 - p].deck[0]; if (c && state.turn < 6) { c.costRestore = c.cost; c.costUntil = 6; c.cost = 6; } } },
  ColleenWing: { name: "Colleen Wing", cost: 2, power: 5, text: "On Reveal: Discard the card that costs the least from your hand.",
    onReveal: ({ state, h, p }) => discardLowest(h, state, p, c => c.cost) },
  Dagger: { name: "Dagger", cost: 2, power: 2, text: "When this moves to a location, +2 Power for each enemy card there.",
    onSelfMoved: ({ h, p, li, card }) => h.addPower(card, 2 * h.cards(1 - p, li).length) },
  Daredevil: { name: "Daredevil", cost: 2, power: 3, text: "On turn 5, you get to see your opponent's plays before you make your own.", seesPlays: true },   // engine.seesPlays; the board plays turn 5 in sequence
  Dazzler: { name: "Dazzler", cost: 2, power: 2, kind: "ongoing", text: "Ongoing: +2 Power for each location that's full on your side.",
    selfPower: ({ state, p }) => 2 * state.locations.filter((L, l) => L.cards[p].length >= locCap(state, l)).length },
  Falcon: { name: "Falcon", cost: 2, power: 3, text: "On Reveal: Return your 1-Cost cards to your hand.",
    onReveal: ({ h, p }) => { for (const { card, li } of h.board(p).filter(x => x.card.cost === 1)) h.returnToHand(p, li, card); } },
  Goose: { name: "Goose", cost: 2, power: 2, kind: "ongoing", text: "Ongoing: Nobody can play cards that cost 4 or more here.",
    blocksPlayHere: (s, li, p, card) => effCost(s, p, card) >= 4 },
  Havok: { name: "Havok", cost: 2, power: 1, text: "End of Turn: You lose 1 Max Energy and this gains +3 Power.",
    endOfTurn: ({ state, h, p, card }) => { state.players[p].maxEnergyBonus -= 1; h.addPower(card, 3); } },
  InvisibleWoman: { name: "Invisible Woman", cost: 2, power: 4, kind: "ongoing", text: "Ongoing: Cards you play here are not revealed until the game ends.", hidesPlays: true },
  Lockjaw: { name: "Lockjaw", cost: 2, power: 3, text: "Activate: After you play your next character, swap it with one from your deck.",
    activate: ({ state, p }) => { state.players[p].lockjaw = true; } },
  LukeCage: { name: "Luke Cage", cost: 2, power: 2, kind: "ongoing", text: "Ongoing: Your front-row cards can't have their Power reduced.", protectsReduce: true },
  MasterMold: { name: "Master Mold", cost: 2, power: 3, text: "On Reveal: Add 2 Sentinel to your opponent's hand.",
    onReveal: ({ h, p }) => { h.addToHand(1 - p, h.make("Sentinel", 1 - p)); h.addToHand(1 - p, h.make("Sentinel", 1 - p)); } },
  Maximus: { name: "Maximus", cost: 2, power: 6, text: "On Reveal: Your opponent draws 2 cards.", onReveal: ({ h, p }) => h.draw(1 - p, 2) },
  Mirage: { name: "Mirage", cost: 2, power: 3, text: "On Reveal: Copy the character that costs the least from your opponent's hand into your hand. Give it +2 Power.",
    onReveal: ({ state, h, p }) => { const src = lowestBy(state.players[1 - p].hand.filter(c => !CARDS[c.id].skill), c => c.cost); if (src) h.addToHand(p, h.make(src.id, p, { cost: src.cost, power: src.power + 2 })); } },
  Mojo: { name: "Mojo", cost: 2, power: 2, kind: "ongoing", text: "Ongoing: If both sides here are full, +6 Power.",
    selfPower: ({ state, li }) => { const cap = locCap(state, li); return state.locations[li].cards[0].length >= cap && state.locations[li].cards[1].length >= cap ? 6 : 0; } },
  Mysterio: { name: "Mysterio", cost: 2, power: 5, text: "On Reveal: Add an Illusion to another location. Activate: Swap Power with it.",
    onReveal: ({ h, p, li, card }) => { const l = randomTo(h, p, li); if (l != null) { const il = h.spawn("MysterioIllusion", p, l); if (il) card.illusionUid = il.uid; } },
    activate: ({ h, card }) => { const il = card.illusionUid && h.find(card.illusionUid); if (il) { const t = card.power; card.power = il.power; il.power = t; } } },
  Psylocke: { name: "Psylocke", cost: 2, power: 2, text: "On Reveal: Next turn, you get +1 Energy.", onReveal: ({ state, p }) => { state.players[p].energyNext += 1; } },
  Quake: { name: "Quake", cost: 2, power: 3, text: "On Reveal: Swap the positions of the other two locations.",
    onReveal: ({ h, li }) => { const [a, b] = [0, 1, 2].filter(l => l !== li); h.swapLocations(a, b); } },
  Silk: { name: "Silk", cost: 2, power: 5, text: "After ANY card is played here, move this to another location.",
    afterAnyPlayHere: ({ h, p, li, card }) => { const l = randomTo(h, p, li); if (l != null) h.move(p, li, l, card); } },
  SpiderMan: { name: "Spider-Man", cost: 2, power: 4, text: "On Reveal: Move to another location and pull an enemy card from here to there.",
    onReveal: ({ h, p, li, card }) => { const l = randomTo(h, p, li); if (l == null) return; const victim = h.pick(h.cards(1 - p, li)); if (h.move(p, li, l, card) && victim) h.move(1 - p, li, l, victim); } },

  // ---------------- 3-cost ----------------
  AgentCoulson: { name: "Agent Coulson", cost: 3, power: 5, text: "On Reveal: Add a random 4-Cost and 5-Cost card to your hand.",
    onReveal: ({ h, p }) => { for (const k of [4, 5]) { const id = h.randomPoolId(d => d.cost === k); if (id) h.addToHand(p, h.make(id, p)); } } },
  Beast: { name: "Beast", cost: 3, power: 5, text: "On Reveal: Return your other cards here to your hand. They cost 1 less next turn.",
    onReveal: ({ state, h, p, li, card }) => { for (const c of h.others(p, li, card)) if (h.returnToHand(p, li, c)) c.discountTurn = state.turn + 1; } },
  BlackWidow: { name: "Black Widow", cost: 3, power: 3, text: "Activate: Add a Widow's Bite to your opponent's hand.",
    activate: ({ h, p }) => h.addToHand(1 - p, h.make("WidowsBite", 1 - p)) },
  Brood: { name: "Brood", cost: 3, power: 2, text: "On Reveal: Add 2 Broodlings here with the same Power.",
    onReveal: ({ h, p, li, card }) => { h.spawn("Broodling", p, li, { power: card.power }); h.spawn("Broodling", p, li, { power: card.power }); } },
  Cerebro: { name: "Cerebro", cost: 3, power: 0, kind: "ongoing", text: "Ongoing: Your highest-Power cards have +3 Power.",
    ongoing: (o) => sameSide(o) && isTopPower(o.state, o.targetOwner, o.targetLoc, o.target) ? 3 : 0,
    selfPower: ({ state, li, p, card }) => isTopPower(state, p, li, card) ? 3 : 0 },   // he is one of "your cards" too
  Crystal: { name: "Crystal", cost: 3, power: 6, text: "On Reveal: Each player draws a card.", onReveal: ({ h }) => { h.draw(0); h.draw(1); } },
  Debrii: { name: "Debrii", cost: 3, power: 7, text: "On Reveal: Add a Rock to each other location.",
    onReveal: ({ h, p, li }) => { for (let l = 0; l < 3; l++) if (l !== li) h.spawn("Rock", p, l); } },   // her own side only since the November 2025 change
  Electro: { name: "Electro", cost: 3, power: 5, kind: "ongoing", text: "On Reveal: +1 Max Energy. Ongoing: You can only play 1 card a turn.",
    onReveal: ({ state, p }) => { state.players[p].maxEnergyBonus += 1; }, maxPlays: 1 },
  Gambit: { name: "Gambit", cost: 3, power: 3, text: "On Reveal: Discard a card from your hand to destroy a random enemy card.",
    onReveal: ({ state, h, p }) => { const c = h.pick(state.players[p].hand); if (!c) return; h.discard(p, c); const t = h.pick(h.board(1 - p)); if (t) h.destroy(1 - p, t.li, t.card.uid); } },
  Ghost: { name: "Ghost", cost: 3, power: 5, text: "On Reveal: Remove the abilities from all End of Turn cards here.",
    // by the card's text, not by its hook: Nebula and Attuma both use an endOfTurn hook, only Attuma is an "End of Turn:" card
    onReveal: ({ h, li }) => { for (let q = 0; q < 2; q++) for (const c of h.cards(q, li)) if (h.def(c).text.includes("End of Turn:")) h.silence(c); } },
  GreenGoblin: { name: "Green Goblin", cost: 3, power: -4, text: "On Reveal: Switch sides.", onReveal: ({ h, li, card }) => h.switchSides(li, card) },
  Hazmat: { name: "Hazmat", cost: 3, power: 3, text: "On Reveal: Afflict all other cards with -1 Power.",
    onReveal: ({ h, card }) => h.board().forEach(x => { if (x.card.uid !== card.uid) h.addPower(x.card, -1); }) },
  Hellcow: { name: "Hellcow", cost: 3, power: 5, text: "Activate: Discard a card from your hand.",
    activate: ({ state, h, p }) => { const c = h.pick(state.players[p].hand); if (c) h.discard(p, c); } },
  Hercules: { name: "Hercules", cost: 3, power: 5, text: "The first time another one of your cards moves here each turn, move it to another location.",
    onMoveHere: ({ state, h, p, li, card }, mover) => { if (mover.owner !== p || card.hercTurn === state.turn) return; card.hercTurn = state.turn; const l = randomTo(h, p, li); if (l != null) h.move(p, li, l, mover); } },
  HumanTorch: { name: "Human Torch", cost: 3, power: 2, text: "When this moves, double its Power.", onSelfMoved: ({ card }) => { card.power *= 2; } },
  JeanGrey: { name: "Jean Grey", cost: 3, power: 4, kind: "ongoing", text: "Ongoing: Players must play their first card here each turn. (if possible)", forcesFirstPlay: true },
  Magik: { name: "Magik", cost: 3, power: 2, text: "On Reveal: Replace this location with 'Limbo'. Doesn't work after turn 5.",
    onReveal: ({ state, h, li }) => { if (state.turn <= 5 && state.locations[li].id !== "Limbo") h.replaceLocation(li, "Limbo"); } },
  MobiusMMobius: { name: "Mobius M. Mobius", cost: 3, power: 3, kind: "ongoing", text: "Ongoing: Your Costs can't be increased. Your opponent's Costs can't be reduced.", mobius: true },
  MoonKnight: { name: "Moon Knight", cost: 3, power: 3, text: "On Reveal: Discard an even-costed card from each player's hand.",
    onReveal: ({ state, h }) => { for (let q = 0; q < 2; q++) { const c = h.pick(state.players[q].hand.filter(c => c.cost % 2 === 0)); if (c) h.discard(q, c); } } },
  Mystique: { name: "Mystique", cost: 3, power: 1, text: "On Reveal: If the last card you played has an Ongoing, copy its text. (if able)",
    onReveal: ({ state, h, p, card }) => { const id = lastPlayedId(state, h, p); if (id && CARDS[id].kind === "ongoing") h.copyText(card, id); } },
  Patriot: { name: "Patriot", cost: 3, power: 2, kind: "ongoing", text: "Ongoing: Your cards with no abilities have +2 Power.",
    ongoing: (o) => sameSide(o) && !CARDS[o.target.id].text ? 2 : 0 },
  Polaris: { name: "Polaris", cost: 3, power: 5, text: "On Reveal: Move an enemy 1 or 2-Cost card to this location.",
    onReveal: ({ h, p, li }) => { const t = h.pick(h.board(1 - p).filter(x => x.li !== li && (x.card.cost === 1 || x.card.cost === 2))); if (t) h.move(1 - p, t.li, li, t.card); } },
  Rogue: { name: "Rogue", cost: 3, power: 3, text: "On Reveal: Steal the text from an enemy Ongoing card here.",
    onReveal: ({ h, p, li, card }) => { const t = h.pick(h.cards(1 - p, li).filter(c => h.isOngoing(c) && !c.silenced)); if (t) { h.copyText(card, t.id); h.silence(t); } } },
  ShadowKing: { name: "Shadow King", cost: 3, power: 4, text: "On Reveal: Reset all cards here to their original Power.",
    onReveal: ({ h, li, card }) => { for (let q = 0; q < 2; q++) for (const c of h.cards(q, li)) if (c.uid !== card.uid) { c.power = originalPower(c); c.buffed = 0; c.afflicted = 0; c.stolen = 0; } } },   // "Reset" strips every modifier, so a created card goes back to its definition's printed Power
  Shanna: { name: "Shanna", cost: 3, power: 4, text: "On Reveal: Add a random 1-Cost character to each location.",
    onReveal: ({ h, p }) => { for (let l = 0; l < 3; l++) { const id = h.randomCharId(d => d.cost === 1); if (id) h.spawn(id, p, l); } } },
  SilverSurfer: { name: "Silver Surfer", cost: 3, power: 2, text: "On Reveal: Give your other 3-Cost cards +2 Power.",
    onReveal: ({ h, p, card }) => h.board(p).forEach(x => { if (x.card.uid !== card.uid && x.card.cost === 3) h.addPower(x.card, 2); }) },
  Thor: { name: "Thor", cost: 3, power: 5, text: "On Reveal: Shuffle Mjolnir into your deck.",
    onReveal: ({ state, h, p }) => { state.players[p].deck.push(h.make("Mjolnir", p)); h.shuffle(state.players[p].deck); } },
  Venom: { name: "Venom", cost: 3, power: 3, text: "On Reveal: Destroy your other cards here. Add their Power to this card.",
    onReveal: ({ h, p, li, card }) => { let s = 0; for (const c of h.others(p, li, card)) { const pw = c.power; if (h.destroy(p, li, c.uid)) s += pw; } h.addPower(card, s); } },
  Viper: { name: "Viper", cost: 3, power: 4, text: "On Reveal: One of your other cards here with the lowest Power switches sides.",
    onReveal: ({ h, p, li, card }) => { const t = lowestBy(h.others(p, li, card), c => h.cardPower(li, p, c)); if (t) h.switchSides(li, t); } },
  Wave: { name: "Wave", cost: 3, power: 6, text: "On Reveal: All cards cost a maximum of 4 until the end of next turn.", onReveal: ({ state }) => { state.waveUntil = state.turn + 1; } },

  // ---------------- 4-cost ----------------
  AbsorbingMan: { name: "Absorbing Man", cost: 4, power: 5, text: "On Reveal: If the last card you played has an On Reveal, copy its text. (if able)",
    // runs the copied text once per call: Wong / repeat locations already call this hook again, so revealAgain here would multiply the repeats
    onReveal: ({ state, h, p, li, card }) => { const id = lastPlayedId(state, h, p); if (id && CARDS[id].onReveal && id !== "AbsorbingMan") { h.copyText(card, id); h.useReveal(id, p, li, card); } } },
  Attuma: { name: "Attuma", cost: 4, power: 10, text: "End of Turn: Destroy one of your cards here with less Power.",
    endOfTurn: ({ h, p, li, card }) => { const t = h.pick(h.others(p, li, card).filter(c => h.cardPower(li, p, c) < h.cardPower(li, p, card))); if (t) h.destroy(p, li, t.uid); } },
  CaptainMarvel: { name: "Captain Marvel", cost: 4, power: 6, text: "At the end of the game, move to a location that wins you the game. (If possible)",
    endOfGame: ({ h, p, li, card }) => { if (h.leader() === p) return; for (const l of h.otherLocs(li, p)) { const st = h.state; const src = st.locations[li].cards[p]; const i = src.findIndex(c => c.uid === card.uid); src.splice(i, 1); st.locations[l].cards[p].push(card); if (h.leader() === p) { h.log(`${h.name(card)} moves to win`); return; } st.locations[l].cards[p].pop(); src.splice(i, 0, card); } } },
  Crossbones: { name: "Crossbones", cost: 4, power: 10, text: "You can only play this at locations where you are winning.", canPlayAtLoc: (s, p, li) => locPower(s, li, p) > locPower(s, li, 1 - p) },
  DoctorOctopus: { name: "Doctor Octopus", cost: 4, power: 8, text: "On Reveal: Pull the lowest-Power character from your opponent's hand to their side of this location.",
    onReveal: ({ state, h, p, li }) => { const q = 1 - p; const c = lowestBy(state.players[q].hand.filter(c => !CARDS[c.id].skill), c => c.power); if (!c || !h.canPlace(q, li)) return; state.players[q].hand.splice(state.players[q].hand.indexOf(c), 1); h.place(q, li, c); } },
  Dracula: { name: "Dracula", cost: 4, power: 2, text: "At the end of the game, discard a card from your hand to gain its Power.",
    endOfGame: ({ state, h, p, card }) => { const c = h.pick(state.players[p].hand); if (c) { h.discard(p, c); h.addPower(card, c.power); } } },
  Drax: { name: "Drax", cost: 4, power: 6, text: "On Reveal: If your opponent played a card here this turn, +4 Power.", onReveal: (ctx) => { if (oppPlayedHere(ctx)) ctx.h.addPower(ctx.card, 4); } },
  GhostRider: { name: "Ghost Rider", cost: 4, power: 5, text: "On Reveal: Bring back one of your discarded cards to this location.",
    onReveal: ({ state, h, p, li }) => { const pile = state.discardPile[p]; const c = h.pick(pile.filter(c => !CARDS[c.id].skill)); if (!c || !h.canPlace(p, li)) return; pile.splice(pile.indexOf(c), 1); h.place(p, li, c); } },
  Juggernaut: { name: "Juggernaut", cost: 4, power: 5, text: "On Reveal: Move away all enemy cards played here this turn. (including unrevealed cards)",
    onReveal: ({ state, h, p, li }) => { for (const x of h.playedThisTurnBy(1 - p)) { if (x.li !== li) continue; const l = h.pick(h.otherLocs(li, 1 - p)); if (l == null) continue; if (x.revealed) h.move(1 - p, li, l, x.card); else { x.entry.li = l; redirectPlay(state, 1 - p, x.card.id, li, l); } } } },
  MilesMorales: { name: "Miles Morales Spider-Man", cost: 4, power: 6, text: "If a card moved last turn, this costs 1.", costMod: (s, p, c) => s.movedLastTurn ? -(c.cost - 1) : 0 },
  MrNegative: { name: "Mister Negative", cost: 4, power: -1, text: "On Reveal: Swap the Power and Cost of all cards in your deck.",
    onReveal: ({ state, p }) => state.players[p].deck.forEach(c => { const t = c.cost; c.cost = Math.max(0, Math.min(6, c.power)); c.power = t; }) },
  NegasonicTeenageWarhead: { name: "Negasonic Teenage Warhead", cost: 4, power: 4, text: "After an enemy character is played here, destroy it. (once per game)",
    afterAnyPlayHere: ({ h, p, li, card }, played, owner) => { if (owner === p || card.ntwUsed) return; const w = h.where(played.uid); if (w && h.destroy(w.p, w.li, played.uid)) card.ntwUsed = true; } },
  NickFury: { name: "Nick Fury", cost: 4, power: 6, text: "On Reveal: Add 3 random 6-Cost cards to your hand.",
    onReveal: ({ h, p }) => { for (let i = 0; i < 3; i++) { const id = h.randomPoolId(d => d.cost === 6); if (id) h.addToHand(p, h.make(id, p)); } } },
  OmegaRed: { name: "Omega Red", cost: 4, power: 6, kind: "ongoing", text: "Ongoing: If you're winning here, +3 Power to other locations.",
    locAdd: ({ state, selfLoc, p, li }) => li !== selfLoc && winningAt(state, selfLoc, p) ? 3 : 0,
    approx: "with two Omega Reds in play, each one's 'winning here' ignores the other's bonus (recursion guard)" },
  Rescue: { name: "Rescue", cost: 4, power: 4, text: "On Reveal: If you play a card at this location next turn, +5 Power.",
    onReveal: ({ state, p, li, card }) => state.pending.push({ kind: "ifPlayed", p, li, uid: card.uid, turn: state.turn + 1, amount: 5 }) },
  Rockslide: { name: "Rockslide", cost: 4, power: 5, text: "On Reveal: Shuffle 2 Rocks into your opponent's deck.",
    onReveal: ({ state, h, p }) => { const d = state.players[1 - p].deck; d.push(h.make("Rock", 1 - p), h.make("Rock", 1 - p)); h.shuffle(d); } },
  Sentry: { name: "Sentry", cost: 4, power: 9, text: "You can't play this at the right location. On Reveal: Add a -9 Power Void to the right location.",
    canPlayAtLoc: (s, p, li) => li !== 2, onReveal: ({ h, p }) => { h.spawn("TheVoid", p, 2); } },
  Shuri: { name: "Shuri", cost: 4, power: 3, text: "On Reveal: If you play your next card at this location, double its Power.", onReveal: ({ state, p, li }) => { state.players[p].shuriLi = li; } },
  SilverSamurai: { name: "Silver Samurai", cost: 4, power: 6, text: "On Reveal: Each player discards the lowest-Power character from their hand.",
    onReveal: ({ state, h }) => { for (let q = 0; q < 2; q++) { const c = lowestBy(state.players[q].hand.filter(c => !CARDS[c.id].skill), c => c.power); if (c) h.discard(q, c); } } },
  SpiderMan2099: { name: "Spider-Man 2099", cost: 4, power: 5, text: "Moveable once. When this moves to a location, afflict an enemy card there with -3 Power.", moveable: "once",
    onSelfMoved: ({ h, p, li }) => { const t = h.pick(h.cards(1 - p, li)); if (t) h.addPower(t, -3); } },
  Stegron: { name: "Stegron", cost: 4, power: 7, text: "On Reveal: Move an enemy card here one location to the right.",
    onReveal: ({ h, p, li }) => { const t = h.pick(h.cards(1 - p, li)); if (t && li < 2) h.move(1 - p, li, li + 1, t); } },
  SuperSkrull: { name: "Super-Skrull", cost: 4, power: 2, kind: "ongoing", text: "Ongoing: Has the Ongoing effects of all enemy cards.", mimicsEnemies: true },   // mirrors Power effects, location totals, rule flags, protections and cost changes (no developer ruling on how protections scope; each text is read as if printed on him)
  TyphoidMary: { name: "Typhoid Mary", cost: 4, power: 10, kind: "ongoing", text: "Ongoing: Your other cards here have -2 Power.", ongoing: (o) => here(o) && sameSide(o) ? -2 : 0 },
  Wong: { name: "Wong", cost: 4, power: 2, kind: "ongoing", text: "Ongoing: Your On Reveal abilities here repeat.", repeatsReveals: true },

  // ---------------- 5-cost ----------------
  Aero: { name: "Aero", cost: 5, power: 9, text: "On Reveal: The last card your opponent played moves to this location.",
    // a play still waiting to reveal is the latest one and is redirected; otherwise it is the last card they revealed, this turn or earlier
    onReveal: ({ state, h, p, li }) => {
      const q = 1 - p, x = h.playedThisTurnBy(q).filter(x => !x.revealed).at(-1);
      if (x) { if (x.li !== li && h.hasRoom(q, li)) { const from = x.li; x.entry.li = li; redirectPlay(state, q, x.card.id, from, li); } return; }
      const uid = state.players[q].lastPlayed, w = uid && h.where(uid);
      if (w && w.li !== li) h.move(w.p, w.li, li, h.find(uid));
    } },
  BlackBolt: { name: "Black Bolt", cost: 5, power: 8, text: "On Reveal: Discard the card that costs the least from your opponent's hand.",
    onReveal: ({ state, h, p }) => discardLowest(h, state, 1 - p, c => c.cost) },
  BlackPanther: { name: "Black Panther", cost: 5, power: 5, text: "On Reveal: Double this card's Power.", onReveal: ({ h, card }) => h.addPower(card, card.power) },
  JaneFoster: { name: "Jane Foster Mighty Thor", cost: 5, power: 9, text: "On Reveal: Draw all cards that cost 0 from your deck.",
    onReveal: ({ state, h, p }) => { while (state.players[p].deck.some(c => c.cost === 0) && h.draw(p, 1, c => c.cost === 0)); } },
  LadyDeathstrike: { name: "Lady Deathstrike", cost: 5, power: 7, text: "On Reveal: Destroy each card here with 3 or less Power.",
    onReveal: ({ h, li, card }) => { for (let q = 0; q < 2; q++) for (const c of [...h.cards(q, li)]) if (c.uid !== card.uid && h.cardPower(li, q, c) <= 3) h.destroy(q, li, c.uid); } },
  Modok: { name: "M.O.D.O.K.", cost: 5, power: 7, text: "On Reveal: Discard your hand.", onReveal: ({ state, h, p }) => { for (const c of [...state.players[p].hand]) h.discard(p, c); } },
  Nimrod: { name: "Nimrod", cost: 5, power: 6, text: "When Destroyed: Add a copy of this to each other location.",
    onDestroyed: ({ h, p, li, card }) => { for (let l = 0; l < 3; l++) if (l !== li) h.spawn("Nimrod", p, l, { power: card.power }); } },
  RedSkull: { name: "Red Skull", cost: 5, power: 14, kind: "ongoing", text: "Ongoing: Enemy cards here have +2 Power.", ongoing: (o) => here(o) && !sameSide(o) ? 2 : 0 },
  Ronan: { name: "Ronan the Accuser", cost: 5, power: 5, kind: "ongoing", text: "Ongoing: +2 Power for each card in your opponent's hand.", selfPower: ({ state, p }) => 2 * state.players[1 - p].hand.length },
  Sera: { name: "Sera", cost: 5, power: 5, kind: "ongoing", text: "Ongoing: Cards in your hand cost 1 less. (minimum 1)", handCostMod: (s, p, c) => c.cost > 1 ? -1 : 0 },
  Stature: { name: "Stature", cost: 5, power: 7, text: "Costs 1 if your opponent discarded a card this game.", costMod: (s, p, c) => s.discards[1 - p] > 0 ? -(c.cost - 1) : 0 },
  Valkyrie: { name: "Valkyrie", cost: 5, power: 3, text: "On Reveal: Set ALL cards here to 3 Power.", onReveal: ({ h, li }) => { for (let q = 0; q < 2; q++) for (const c of h.cards(q, li)) { if (c.power > 3) h.addPower(c, 3 - c.power); else c.power = 3; } } },   // setting a card lower is a reduction (Luke Cage stops it)

  // ---------------- 6-cost and up ----------------
  AgathaHarkness: { name: "Agatha Harkness", cost: 6, power: 12, text: "Game Start: Draw Agatha. She controls your cards on even turns.", drawRule: "extra",
    gameStart: ({ state, p }) => { state.players[p].agatha = true; } },   // engine.agathaControls; the board and the AIs hand her even turns to the greedy AI
  ArnimZola: { name: "Arnim Zola", cost: 6, power: 0, text: "On Reveal: Destroy one of your other cards here to copy it at the other locations.",
    targets: (s, p, li) => s.locations[li].cards[p].map(c => c.uid),
    onReveal: ({ h, p, li, card, target }) => { const others = h.others(p, li, card); const t = others.find(c => c.uid === target) ?? h.pick(others); if (!t) return; const { id, power } = t; if (h.destroy(p, li, t.uid)) for (let l = 0; l < 3; l++) if (l !== li) h.spawn(id, p, l, { power }); } },
  Destroyer: { name: "Destroyer", cost: 6, power: 18, text: "On Reveal: Destroy your cards at other locations.",
    onReveal: ({ h, p, li }) => { const all = h.board(p).filter(x => x.li !== li).sort((a, b) => (a.card.playedTurn ?? 0) - (b.card.playedTurn ?? 0)); for (const x of all) h.destroy(p, x.li, x.card.uid); } },   // in the order they were played: a Caiera played earlier goes first and protects nothing after
  DrDoom: { name: "Doctor Doom", cost: 6, power: 5, text: "On Reveal: Add a 5-Power DoomBot to each other location.", onReveal: ({ h, p, li }) => { for (let l = 0; l < 3; l++) if (l !== li) h.spawn("DoomBot", p, l); } },
  Giganto: { name: "Giganto", cost: 6, power: 16, text: "You can only play this at the left location.", canPlayAtLoc: (s, p, li) => li === 0 },
  Hela: { name: "Hela", cost: 6, power: 6, text: "On Reveal: For each different Cost among them, resurrect a card you discarded to a random location.",
    onReveal: ({ state, h, p }) => { const pile = state.discardPile[p]; const costs = [...new Set(pile.filter(c => !CARDS[c.id].skill).map(c => c.cost))]; for (const k of costs) { const opts = pile.filter(c => c.cost === k && !CARDS[c.id].skill); const c = h.pick(opts); const l = h.pick([0, 1, 2].filter(l => h.canPlace(p, l))); if (c && l != null) { pile.splice(pile.indexOf(c), 1); h.place(p, l, c); } } } },
  Helicarrier: { name: "Helicarrier", cost: 6, power: 12, text: "When Discarded: Fill your hand with random cards.",
    onDiscarded: ({ h, p }) => { while (h.state.players[p].hand.length < 7) h.addToHand(p, h.make(h.randomPoolId(), p)); } },
  Knull: { name: "Knull", cost: 6, power: 0, kind: "ongoing", text: "Ongoing: Has the combined Power of all cards destroyed this game.", selfPower: ({ state }) => state.destroyedPower },
  Leader: { name: "Leader", cost: 6, power: 5, text: "On Reveal: Copy the enemy card(s) with the highest Power played this turn, but on your side.",
    onReveal: ({ h, p }) => { const plays = h.playedThisTurnBy(1 - p).filter(x => x.revealed); if (!plays.length) return; const pw = plays.map(x => h.cardPower(x.li, 1 - p, x.card)); const mx = Math.max(...pw); plays.forEach((x, i) => { if (pw[i] === mx) h.spawn(x.card.id, p, x.li, { power: x.card.power }); }); } },
  Magneto: { name: "Magneto", cost: 6, power: 12, text: "On Reveal: Move all enemy 3 and 4-Cost cards to this location.",
    onReveal: ({ h, p, li }) => { for (const x of h.board(1 - p)) if (x.li !== li && (x.card.cost === 3 || x.card.cost === 4)) h.move(1 - p, x.li, li, x.card); } },
  Orka: { name: "Orka", cost: 6, power: 11, kind: "ongoing", text: "Ongoing: +7 Power if this is your only card here.", selfPower: ({ state, li, p }) => state.locations[li].cards[p].length === 1 ? 7 : 0 },
  SheHulk: { name: "She-Hulk", cost: 6, power: 10, text: "Costs 1 less for each unspent Energy last turn.", costMod: (s, p) => -s.players[p].unspentLastTurn },
  Taskmaster: { name: "Taskmaster", cost: 6, power: 0, text: "On Reveal: Set this card's Power equal to that of the last card you played. (if able)",
    onReveal: ({ state, h, p, card }) => { const pl = state.players[p]; const live = pl.lastPlayed && h.find(pl.lastPlayed); if (live) card.power = live.power; else if (pl.lastPlayedInfo) card.power = pl.lastPlayedInfo.power; } }, // live card: its current Power; gone: its printed Power
  Ultron: { name: "Ultron", cost: 6, power: 8, text: "On Reveal: Deploy four 2-Power Drones to each other location.",
    onReveal: ({ h, p, li }) => { for (let l = 0; l < 3; l++) if (l !== li) for (let i = 0; i < 4; i++) h.spawn("Drone", p, l); } },
  Death: { name: "Death", cost: 8, power: 12, text: "Costs 1 less for each card destroyed this game.", costMod: (s) => -(s.destroyed[0] + s.destroyed[1]) },

  // ---------------- tokens ----------------
  Demon: { name: "Demon", cost: 1, power: 6, text: "", token: true },
  SnowguardHawk: { name: "Snowguard Hawk", cost: 3, power: 3, token: true, text: "On Reveal: Ignore all location abilities until the end of next turn. (They resume if the game ends.)", onReveal: ({ state }) => { state.ignoreLocsUntil = state.turn + 1; } },
  SnowguardBear: { name: "Snowguard Bear", cost: 3, power: 4, token: true, text: "On Reveal: Trigger the effect of this location.",   // only effects a location fires by itself; passive, turn-gated and "next card" locations have nothing to trigger
    onReveal: ({ h, li }) => h.triggerLocation(li) },
  WidowsBite: { name: "Widow's Bite", cost: 0, power: -1, text: "While this is in your hand, you can't draw cards.", blocksDraw: true, token: true },
  Broodling: { name: "Broodling", cost: 3, power: 2, text: "", token: true },
  MysterioIllusion: { name: "Illusion!", cost: 2, power: 0, text: "", token: true },
  Mjolnir: { name: "Mjolnir", cost: 0, power: 0, text: "On Reveal: Give Thor +7 Power.", token: true,
    onReveal: ({ state, h, p }) => { h.board(p).forEach(x => { if (x.card.id === "Thor" && !x.card.alias) h.addPower(x.card, 7); }); for (const c of state.players[p].hand) if (c.id === "Thor" && !c.alias) h.addPower(c, 7); } },   // a card that only copied Thor's text is "not worthy"
  TheVoid: { name: "The Void", cost: 4, power: -9, text: "", token: true },
  DoomBot: { name: "DoomBot", cost: 6, power: 5, text: "", token: true },
  Drone: { name: "Drone", cost: 1, power: 2, text: "", token: true },
};

// Printed Power of the card's original identity (a copied text keeps the original name in `alias`).
function originalPower(c) {
  if (c.alias) { const orig = Object.keys(CARDS).find(k => CARDS[k].name === c.alias); if (orig) return CARDS[orig].power; }
  return CARDS[c.id].power;
}
// An unrevealed play of `q` is redirected from `from` to `to`: keep the per-location play bookkeeping in step with the queue entry.
function redirectPlay(state, q, id, from, to) {
  const pl = state.players[q];
  pl.playedThisTurn[from] = Math.max(0, pl.playedThisTurn[from] - 1); pl.playedThisTurn[to]++;
  const i = pl.playedCards[from].indexOf(id); if (i >= 0) pl.playedCards[to].push(pl.playedCards[from].splice(i, 1)[0]);
  pl.lastPlayedTurnAt[to] = state.turn;
}
// Omega Red's "winning here" by the real location totals. Those totals ask every Omega Red for his bonus again,
// so while one check is running any nested one answers "no" instead of recursing.
let checkingWin = false;
function winningAt(state, li, p) {
  if (checkingWin) return false;
  checkingWin = true;
  try { return winnerAt(state, li) === p; } finally { checkingWin = false; }
}
// Cerebro: is this one of p's highest-Power cards? Power as shown, Ongoing effects included, but before any Cerebro bonus:
// while the ranking runs, a nested Cerebro question answers "no", which also stops the recursion through cardPower.
let rankingPower = false;
function isTopPower(state, p, li, card) {
  if (rankingPower) return false;
  rankingPower = true;
  try {
    let mx = -Infinity;
    state.locations.forEach((L, l) => { for (const c of L.cards[p]) mx = Math.max(mx, cardPower(state, l, p, c)); });
    return cardPower(state, li, p, card) === mx;
  } finally { rankingPower = false; }
}
