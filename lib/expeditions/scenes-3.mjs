// Expedition first-visit scenes, part 3: Fremennik Province and the Wilderness (lib/expedition-data.mjs).
// Same format as lib/expeditions/scenes.mjs. See docs/WRITING-BRIEF.md.
// Scene = {open:[lines], opts:[{t:'player choice', r:[reply lines]}]}.
// A plain line is narration; "<castId>: text" or "player: text" is someone speaking.

/** @type {Record<string,{open:string[],opts:{t:string,r:string[]}[]}>} */
export const EXPEDITION_SCENES={
 // ================= Fremennik Province =================
 'rock-crabs':{
  open:[
   'The beach outside Rellekka is cold, grey and covered in rocks. Several of the rocks are watching you.',
   'A Fremennik fisherman spits into the surf and calls you an outerlander, which is the closest thing they have to hello.',
   'thor: Ha! A beach where the stones fight back! Why does Asgard not have one of these?',
   'thor: Come, friend. We shall wake them all, and then we shall have a feast, and then perhaps we shall wake them again.',
  ],
  opts:[
   {t:'Stand in the middle and let them all come.',r:['Rock after rock lurches up on crab legs. You keep swinging until the tide turns and your arms hum.','thor: You did not stop once! That is the spirit of a warrior. Or a very stubborn man. In my experience, the same thing.']},
   {t:'Make it a game. Most crabs wins.',r:['thor: A contest! I accept! I will warn you, I have never lost a contest. Except to Loki. And Hulk. And once, a horse.','You win by three. Thor demands a rematch, then hugs you hard enough to rattle your armour.']},
   {t:'Sit on a rock and fish for a while. Surely that one’s a rock.',r:['It is not a rock. It is extremely offended.','thor: Ha! Even your rest has adventure in it! Never change.']},
  ]},
 'trollheim':{
  open:[
   'Trollheim is a mountain that throws things. Boulders, mostly. Sometimes trolls.',
   'Mountain trolls name themselves after the first thing they see or eat. You pass Rock, Stick and a very large one called Pee Hat.',
   'logan: Somewhere up top there’s a troll champion. The others call him Dad. I’m gonna have opinions about that.',
   'logan: Prisoners in the stronghold, too. Somebody’s kid, somebody’s old man. We don’t leave without them, bub.',
  ],
  opts:[
   {t:'Climb straight up. Dodge the boulders.',r:['You take the steep path, rocks whistling past your ears, and reach the summit wheezing and whole.','logan: Not bad. Most guys would’ve turned back. You kept climbing like somebody was waiting at the top.']},
   {t:'Sneak into the stronghold and free the prisoners.',r:['You slip past snoring trolls with a stolen key. The old prisoner weeps when the cell swings open.','logan: That’s the job. Not the fight. Getting folks home to the people who need ’em.']},
   {t:'Challenge Dad. Show him what a real one looks like.',r:['The troll champion is enormous and very proud of his name. He lands one blow. You land the rest.','logan: Huh. Turns out being a dad’s got nothing to do with size. Don’t tell anyone I said that.']},
  ]},
 'fremennik-slayer-dungeon':{
  open:[
   'Inside the cliffs east of Rellekka, the Slayer dungeon drips and clicks. Things in here only die one particular way.',
   'Rockslugs want salt. Cockatrices want a mirror shield. And deep at the bottom, the kurask laugh at anything without a leaf-shaped blade.',
   'laezel: Finally. A place that punishes the unprepared. I feel at home.',
   'laezel: Check your kit, istik. Salt, shield, leaf-blade. Twice. If you forget something, I will not carry you out. Probably.',
  ],
  opts:[
   {t:'Check the kit twice, like she said.',r:['Everything is where it should be. The kurask do not laugh for long.','laezel: Correct. Preparation is the blade before the blade. I find competence very… distracting.']},
   {t:'Take on the cockatrice with the mirror shield.',r:['You fight it entirely backwards, watching its reflection, and the creature turns to stone on its own stare.','laezel: You did not flinch. Not once. Come here and let me look at you properly.']},
   {t:'Work the whole dungeon top to bottom. No shortcuts.',r:['Hours later, you climb out filthy, salted and very good at your job.','laezel: Tch. Most humans quit at the pyrefiends. You are… not most humans. Do not let it go to your head.']},
  ]},
 'waterbirth-island':{
  open:[
   'A boatman named Jarvald ferries you to Waterbirth, a grey island where the sea gives up its monsters.',
   'Dagannoth crawl out of the surf. Rock lobsters argue on the shore. Somewhere below, ancient doors are carved with things nobody worships anymore.',
   'lys: I brought tea. It is very windy for tea. I brought it anyway, because some habits are worth keeping in bad weather.',
   'lys: The Fremennik pray to the spirits of the sea before they come here. Would you pray with me first? Your hand is warm. I’ll keep it.',
  ],
  opts:[
   {t:'Pray with her on the shore before the fight.',r:['The wind drops for a moment while you pray. Then the dagannoth come, and you meet them with a quiet heart.','lys: You never rush the small devotions. I love that about you. Among other things.']},
   {t:'Hold the line while she shelters by the rocks.',r:['Wave after wave of dagannoth breaks against you. Not one gets past.','lys: You stood between me and the sea. A woman remembers that. Come and drink your tea before it’s cold.']},
   {t:'Share the tea first. The monsters can wait.',r:['You sit on a rock with her, sharing one cup, watching the grey water. It is the best part of the trip.','lys: Most men would have charged in. You stayed. I think I’ll keep you.']},
  ]},
 'dagannoth-kings':{
  open:[
   'Below Waterbirth, past doors that only open for the patient and the clever, the deepest cave smells of salt and old bones.',
   'Three shapes rise from the dark water. Rex, who only respects magic. Prime, who only fears arrows. Supreme, who only falls to steel.',
   'geralt: Three kings. Each one guards the other’s weakness. Hit the wrong one with the wrong thing, you’ll feel it.',
   'geralt: Their mother was the thing under the lighthouse. Big family. Protective. Can’t say I blame them.',
   'The kings roar together, and the whole cave shakes. Somewhere, a rock lobster wisely leaves.',
   'geralt: You trained for this. Every morning. Every rep you didn’t want to do. Now it pays. Ready?',
  ],
  opts:[
   {t:'Right weapon for each king. One at a time.',r:['Magic for Rex, arrows for Prime, steel for Supreme. Each king falls in turn, and the cave goes quiet.','geralt: Hm. Know your enemy, prepare, then strike. That’s the whole trade. You’ve got it.']},
   {t:'Fight back to back with Geralt.',r:['He takes two, you take one. Swords flash in the dark until the last king crashes into the water and does not rise.','geralt: Good fight. You kept up. Ciri would like you. That’s rare.']},
   {t:'Think of your kids. Go through all three.',r:['You do not stop. Rex, then Prime, then Supreme, each one falling before the last can turn. The water stills.','geralt: Fathers fight differently. Harder. Go home and tell them a story. Leave out the smell.']},
  ]},

 // ================= The Wilderness =================
 'chaos-temple':{
  open:[
   'Past the ditch, the grass turns grey and the sky turns mean. Deep in the Wilderness stands a black temple to Zamorak.',
   'Robed druids mutter among the ruins. Bones lie scattered on the altar. An old man in a red hood offers to help, which is the most suspicious thing yet.',
   'kaladin: Everyone out here is watching everyone else. Keep your eyes open and your pack light. Only bring what you can afford to lose.',
   'kaladin: The altar doesn’t care who it serves. Doesn’t matter. What matters is who you serve.',
  ],
  opts:[
   {t:'Offer the bones, but say your own prayer.',r:['You kneel at a Zamorakian altar and pray to your own God. The bones burn clean. Nothing here touches you.','kaladin: That’s it. You keep your oath even in a place built to break it. That’s a Windrunner thing to do.']},
   {t:'Clear out the chaos druids.',r:['The druids throw curses and herbs in about equal measure. You end up with a pack full of both.','kaladin: Steady hands, steady feet. You didn’t chase them too far. Most men do, out here. They don’t come back.']},
   {t:'Watch the ridge. Someone always comes.',r:['A skulled raider crests the hill, sees two men waiting calmly, and decides to be somewhere else.','kaladin: Discipline isn’t only doing things. Sometimes it’s just not blinking first.']},
  ]},
 'lava-maze':{
  open:[
   'The Lava Maze is a field of black rock and rivers of fire. Every path bends, and every bend has a dragon.',
   'Black dragons sun themselves on the hot stone, eyes half closed, waiting for something foolish to wander in.',
   'jaina: Anti-dragon shield. Antifire potion. And me. You’re very well equipped for a man walking into a furnace.',
   'jaina: I’ve mapped the safe route. Follow my lead, and try not to look at me that way while I’m concentrating.',
  ],
  opts:[
   {t:'Follow her route. Plan the work, work the plan.',r:['The path twists through the fire exactly as she drew it. You reach the far side with every eyebrow intact.','jaina: A man who listens to the plan. Do you know how rare that is? Come here. You’ve earned this.']},
   {t:'Fight the black dragons for their hides.',r:['Shield up, fire washing over it, you cut down two dragons and carry their hides out on your back.','jaina: That’s a month of income in one afternoon. And you didn’t complain once about the heat. I did, a little.']},
   {t:'Let her freeze the lava while you cross.',r:['A ribbon of ice cracks across the fire. You run it together, hand in hand, steam everywhere.','jaina: Romantic, isn’t it? Fire, ice, mortal danger. I do know how to plan a date.']},
  ]},
 'revenant-caves':{
  open:[
   'Under the deep Wilderness, the Revenant Caves hold the ghosts of soldiers who died in the God Wars and never noticed.',
   'They still guard their old treasure: emblems, totems and statuettes worth a small fortune. Every raider in the land knows it.',
   'natasha: Two exits. Three blind corners. A raider behind that pillar who thinks he’s clever. He isn’t.',
   'natasha: Rule one, handsome: never carry more than you can afford to lose. Rule two: stay close to me. I made up rule two just now.',
  ],
  opts:[
   {t:'Bank what you find, often. Play it safe.',r:['You run the loot to safety twice, never carrying too much. The raiders get nothing but a long walk.','natasha: Discipline’s the sexiest thing there is. Don’t tell anyone I said that.']},
   {t:'Fight the revenant knight for its artifact.',r:['The ghost swings old iron with old hate. You put it back to rest and take its ancient emblem home.','natasha: Not bad. I’ve seen trained agents hesitate with that thing. You didn’t.']},
   {t:'Let her deal with the raider.',r:['She vanishes. There is a short, surprised noise behind the pillar. She returns, fixing her hair.','natasha: Handled. Now, where were we? Ah, yes. You were standing very close to me.']},
  ]},
 'mage-arena':{
  open:[
   'In the far north of the Wilderness, a walled arena hums with old magic. Battle mage Kolodion waits in the middle.',
   'He promises to test your nerve. He then turns into an ogre, a spider, a ghost and a demon, in that order, without asking.',
   'harry: Right. So he shapeshifts. Fine. Totally fine. I’ve had worse days. I’ve had worse Tuesdays.',
   'harry: Beat him and the statues outside let you pick a god. And a cape. The cape’s honestly the best bit.',
  ],
  opts:[
   {t:'Keep casting through every form. Don’t panic.',r:['Ogre, spider, ghost, demon. You keep your nerve and your spells, and Kolodion bows at last.','harry: Brilliant! That was like a duel and a Boggart at the same time. You were incredible.']},
   {t:'Make it a duel. Harry takes half.',r:['You trade off forms, laughing harder every time Kolodion becomes something stranger. He yields, half amused himself.','harry: See, that’s the thing. Magic’s always better with a mate. Same with everything, really.']},
   {t:'Pray at Saradomin’s statue for the cape.',r:['The statue glows and a blue-and-white cape settles on your shoulders.','harry: Suits you. Proper hero stuff. Wear it home and see if the kids salute.']},
  ]},
 'king-black-dragon':{
  open:[
   'Deep in the Lava Maze, an old lever drops you into the dark. The heat hits first, then the smell of scorched bone.',
   'Something enormous breathes in the black. Three great heads lift from the lava glow, each one watching you with the same ancient hate.',
   'The King Black Dragon. Older than kingdoms. The oldest fear in Gielinor, and it has never once been told no.',
   'violet: Tairn says it is very old and very angry. Tairn is also very old and very angry, so he would know.',
   'violet: I wasn’t built to be the strongest one in the room. Neither were you. We were built to prepare, and we did. Every single morning.',
   'All three heads draw breath at once. The cavern turns orange.',
   'violet: Shield up. Antifire down. And when this is over, you and I are having a very long talk. Somewhere quiet. Somewhere warm.',
  ],
  opts:[
   {t:'Raise the shield and walk straight into the fire.',r:['Dragonfire breaks over your shield like a wave. You keep walking, and when you reach it, you do not stop swinging until the King falls.','violet: You walked into dragonfire for this. For them. For us. Come here. I’m kissing you, and Tairn can look away.']},
   {t:'Call Tairn down. Fight dragon with dragon.',r:['The cavern roof cracks and Tairn crashes through, roaring. Three heads turn to meet him, and in that heartbeat your blade finds the King’s heart.','violet: Riders and dragons. Nothing like it. You’re shaking. So am I. Hold me until we both stop.']},
   {t:'Think of home. End it for every night they sleep safe.',r:['Your wife’s laugh. Your kids at bedtime. You fight like a man with somewhere to be, and the King Black Dragon crashes down and does not rise.','violet: That’s the strongest thing I’ve ever seen. Go home, hero. Tell them the dragon’s gone. Then come find me.']},
  ]},
};
