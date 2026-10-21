// Expedition first-visit scenes, part 3: Fremennik Province and the Wilderness (lib/expedition-data.mjs).
// Same format as lib/expeditions/scenes.mjs. See docs/WRITING-BRIEF.md.
// Scene = {open:[lines], opts:[{t:'player choice', r:[reply lines]}]}.
// A plain line is narration; "<castId>: text" or "player: text" is someone speaking.

/** @type {Record<string,{open:string[],opts:{t:string,r:string[]}[]}>} */
export const EXPEDITION_SCENES={
 // ================= Fremennik Province =================
 'rock-crabs':{
  open:[
   'The beach outside Rellekka is cold, grey and strewn with rocks. Some of the rocks are breathing.',
   'A Fremennik fisherman spits into the surf and calls you “outerlander,” which is as close as they get to hello.',
   'thor: A beach where the stones fight back! Why did Asgard never have one of these? We had many beaches. Very lazy stones.',
   'thor: Come! We wake them all, then we feast, then we wake them again. Then possibly a nap. Then more feasting.',
  ],
  opts:[
   {t:'Stand in the middle and let them all come.',r:['Rock after rock lurches up on crab legs. You keep swinging until the tide turns and your arms hum.','thor: You did not stop once! That is either a warrior or a very stubborn man. In my experience, the same fellow.']},
   {t:'Make it a game. Most crabs wins.',r:['thor: A contest! Accepted! I should warn you, I have never lost a contest. Except to Loki. And Banner. And once, to a horse.','You win by three. Thor demands a rematch, then hugs you hard enough to rattle your armour.']},
   {t:'Sit on a rock and fish for a while. Surely that one’s a rock.',r:['It is not a rock. It is deeply offended.','thor: HA! Even your fishing trips have battles in them! I love this! Another!']},
  ]},
 'trollheim':{
  open:[
   'Trollheim is a mountain that throws things. Boulders, mostly. Occasionally trolls.',
   'Mountain trolls name themselves after the first thing they see. You pass Rock, Stick and a very large one called Pee Hat.',
   'logan: Troll champion up top. The others call him “Dad.” I got some thoughts on that.',
   'logan: Prisoners in the stronghold, too. Somebody’s kid, somebody’s old man. We ain’t leavin’ without ’em, bub.',
  ],
  opts:[
   {t:'Climb straight up. Dodge the boulders.',r:['You take the steep path, rocks whistling past your ears, and reach the top wheezing but whole.','logan: Huh. Figured you’d quit halfway. You climbed like somebody was waitin’ up top. Somebody is. Back home.']},
   {t:'Sneak into the stronghold and free the prisoners.',r:['You slip past snoring trolls with a stolen key. The old prisoner weeps when the cell swings open.','logan: That’s the job. Not the fight. Gettin’ folks home to the ones who need ’em. Took me about a hundred years to figure that out.']},
   {t:'Challenge Dad. Show him what a real one looks like.',r:['The troll champion is enormous and extremely proud of his name. He lands one blow. You land the rest.','logan: Bein’ a dad ain’t about size. It’s about showin’ up for bedtime. Tell anybody I said that and I’ll pop the claws.']},
  ]},
 'fremennik-slayer-dungeon':{
  open:[
   'Inside the cliffs east of Rellekka, the Slayer Dungeon drips and clicks. Everything in here dies one particular way, or not at all.',
   'Rockslugs want salt. Cockatrices want a mirror shield. And at the bottom the kurask laugh at anything that isn’t leaf-bladed.',
   'laezel: Tsk. Finally, a place that punishes the unprepared. It is almost like home. Fewer red dragons.',
   'laezel: Check your kit, istik. Salt. Shield. Leaf-blade. Twice. Forget one and I will leave you for the slugs.',
  ],
  opts:[
   {t:'Check the kit twice, like she said.',r:['Everything is where it should be. The kurask do not laugh for long.','laezel: Correct. You listened. In the crèche, half the hatchlings did not, and they are not with us. I find competence… distracting.']},
   {t:'Take on the cockatrice with the mirror shield.',r:['You fight it entirely backwards, watching the reflection, and the creature turns to stone on its own stare.','laezel: You did not flinch once. Chk. Come here. I want to look at you properly.']},
   {t:'Work the whole dungeon top to bottom. No shortcuts.',r:['Hours later you climb out filthy, salted and very good at your job.','laezel: Most of your kind quit at the pyrefiends. You are not most of your kind. Do not let that swell your head, istik.']},
  ]},
 'waterbirth-island':{
  open:[
   'A boatman named Jarvald ferries you out to Waterbirth, a grey island where the sea coughs up its monsters.',
   'Dagannoth crawl from the surf. Rock lobsters squabble on the shore. Below, old doors are carved with gods nobody remembers.',
   'lys: I brought tea. It is much too windy for tea. I brought it anyway. The wind does not get a vote.',
   'lys: The Fremennik pray to the sea before they land here. Would you pray with me? Your hand is warm. I’m keeping it, by the way.',
  ],
  opts:[
   {t:'Pray with her on the shore before the fight.',r:['The wind drops while you pray. Then the dagannoth come, and you meet them with a quiet heart.','lys: You never skip the little prayers, do you? Even with monsters on the beach. I noticed. I always notice.']},
   {t:'Hold the line while she shelters by the rocks.',r:['Wave after wave of dagannoth breaks against you. Not one gets by.','lys: You stood between me and the whole sea. Sit. Drink your tea before it goes cold, and let me fuss over you.']},
   {t:'Share the tea first. The monsters can wait.',r:['You sit on a rock and share one cup, watching the grey water. It turns out to be the best part of the trip.','lys: Most men would have charged in. You sat with me instead. I think I’ll keep you. Here, you have the last sip.']},
  ]},
 'dagannoth-kings':{
  open:[
   'Below Waterbirth, past doors that only open for the patient and the clever, the deepest cave smells of salt and old bones.',
   'Three shapes rise from the black water. Rex fears only magic. Prime fears only arrows. Supreme fears only steel.',
   'geralt: Three of them. Each covers another’s weakness. Wrong weapon on the wrong one, you’ll feel it.',
   'geralt: Their mother lived under the lighthouse. Big family. Protective. Can’t blame them. Still a contract.',
   'The kings roar together and the cave shakes. Somewhere, a rock lobster wisely leaves.',
   'geralt: You put the mornings in. Now they pay. Ready?',
  ],
  opts:[
   {t:'Right weapon for each king. One at a time.',r:['Magic for Rex, arrows for Prime, steel for Supreme. Each king falls in turn, and the cave goes quiet.','geralt: Know the monster. Pick the right oil. Strike. That’s the whole trade. You’ve got it.']},
   {t:'Fight back to back with Geralt.',r:['He takes two, you take one. Swords flash in the dark until the last king crashes into the water and stays there.','geralt: Good fight. You kept up. Few do. Lambert never has.']},
   {t:'Think of your kids. Go through all three.',r:['You do not stop. Rex, then Prime, then Supreme, each one falling before the next can turn. The water stills.','geralt: Fathers fight different. Harder. Go home. Tell them a story. Skip the smell.']},
  ]},

 // ================= The Wilderness =================
 'chaos-temple':{
  open:[
   'Past the ditch, the grass turns grey and the sky turns mean. Deep in the Wilderness squats a black temple to Zamorak.',
   'Robed druids mutter in the ruins. Bones lie scattered across the altar. An old man in a red hood offers to help, which is the most alarming thing so far.',
   'kaladin: Everyone out here is watching everyone else. Like the warcamps, except nobody bothers pretending to be friendly. Pack light.',
   'kaladin: Syl says the altar doesn’t care who uses it. She’s right. What matters is who you’re praying to.',
  ],
  opts:[
   {t:'Offer the bones, but say your own prayer.',r:['You kneel at a Zamorakian altar and pray to your own God. The bones burn clean. Nothing here touches you.','kaladin: You kept your word in a place built to make you break it. Storms. Syl’s going to be insufferable about you now.']},
   {t:'Clear out the chaos druids.',r:['The druids throw curses and herbs in roughly equal measure. You leave with a pack full of both.','kaladin: You didn’t chase them over the ridge. Good. Men who chase out here end up like the ones I couldn’t carry back.']},
   {t:'Watch the ridge. Someone always comes.',r:['A skulled raider crests the hill, sees two men waiting calmly, and decides to be somewhere else.','kaladin: Teft would’ve liked that. Sometimes discipline’s just standing there and not blinking first.']},
  ]},
 'lava-maze':{
  open:[
   'The Lava Maze is black rock and rivers of fire. Every path bends, and every bend has a dragon on it.',
   'Black dragons sun themselves on the hot stone, eyes half closed, waiting for something foolish to wander in.',
   'jaina: Anti-dragon shield. Antifire potion. And a frost mage from Kul Tiras. You came well dressed for a furnace.',
   'jaina: I’ve mapped a safe route. Follow it, and please stop looking at me like that. I’m trying to concentrate.',
  ],
  opts:[
   {t:'Follow her route. Plan the work, work the plan.',r:['The path twists through the fire exactly as she drew it. You reach the far side with both eyebrows.','jaina: You actually followed the plan. Arthas never once did. Come here. You’ve earned this.']},
   {t:'Fight the black dragons for their hides.',r:['Shield up, fire washing over it, you cut down two dragons and haul their hides out on your back.','jaina: A month’s income in one afternoon. Any Kul Tiran merchant would weep. And you didn’t complain about the heat once. I did. Quietly.']},
   {t:'Let her freeze the lava while you cross.',r:['A ribbon of ice cracks across the fire. You run it together, hand in hand, steam everywhere.','jaina: Fire, ice, mortal peril. I do know how to plan a date. In Dalaran it was mostly libraries.']},
  ]},
 'revenant-caves':{
  open:[
   'Beneath the deep Wilderness, the Revenant Caves are full of soldiers who died in the God Wars and never got the message.',
   'They still guard their old loot: emblems, totems and statuettes worth a small fortune. Every raider for miles knows it.',
   'natasha: Two exits. Three blind corners. One guy behind that pillar who thinks he’s clever. He’s not.',
   'natasha: Rule one: never carry more than you can afford to lose. Rule two: stay close to me. I just made up rule two.',
  ],
  opts:[
   {t:'Bank what you find, often. Play it safe.',r:['You run the loot out twice, never carrying too much. The raiders get nothing but a long walk.','natasha: Small, boring, every single time. That’s how you stay alive. It’s also how Clint keeps that farmhouse standing.']},
   {t:'Fight the revenant knight for its artifact.',r:['The ghost swings old iron with old hate. You put it back to rest and carry its emblem home.','natasha: I’ve watched trained agents freeze up on that thing. You didn’t. I’m putting that in your file.']},
   {t:'Let her deal with the raider.',r:['She vanishes. There is a short, surprised noise behind the pillar. She comes back fixing her hair.','natasha: Handled. So. Where were we? Oh, right. You were standing very close to me.']},
  ]},
 'mage-arena':{
  open:[
   'In the far north of the Wilderness, a walled arena hums with old magic. The battle mage Kolodion waits in the middle.',
   'He promises to test your nerve. He then becomes an ogre, a spider, a ghost and a demon, in that order, without asking.',
   'harry: So he changes shape. Fine. Brilliant. I sat through a year of Lockhart teaching Defence, I can sit through this.',
   'harry: Beat him and the statues outside let you pick a god and a cape. Honestly, the cape’s the best bit. Ron would want an orange one.',
  ],
  opts:[
   {t:'Keep casting through every form. Don’t panic.',r:['Ogre, spider, ghost, demon. You keep your nerve and your spells, and at last Kolodion bows.','harry: That was a duel and a Boggart at the same time! Lupin would’ve given you a whole bar of chocolate.']},
   {t:'Make it a duel. Harry takes half.',r:['You trade off forms, laughing harder every time Kolodion turns into something stranger. Eventually he yields, half amused himself.','harry: See? Magic’s better with a mate. Most things are. That’s basically how the DA worked.']},
   {t:'Pray at Saradomin’s statue for the cape.',r:['The statue glows, and a blue-and-white cape settles on your shoulders.','harry: Suits you. Proper hero stuff. Wear it home and see if the kids salute. Mine would just try to fly in it.']},
  ]},
 'king-black-dragon':{
  open:[
   'Deep in the Lava Maze, an old lever drops you into the dark. The heat hits first, then the smell of scorched bone.',
   'Something enormous breathes in the black. Three heads lift into the lava glow, each one watching you with the same old hate.',
   'The King Black Dragon. Older than kingdoms, the oldest fear in Gielinor, and nobody has ever once told it no.',
   'violet: Tairn says it’s very old and very angry. Tairn is also very old and very angry, so I trust his read.',
   'violet: I was never the strongest one in the room. I made up for it by being the most prepared. So did you. Every boring morning.',
   'All three heads draw breath at once. The cavern turns orange.',
   'violet: Shield up. Antifire down. Afterwards you owe me a very long talk somewhere quiet and warm. Tairn, stop listening.',
  ],
  opts:[
   {t:'Raise the shield and walk straight into the fire.',r:['Dragonfire breaks over your shield like a wave. You keep walking, and when you reach it you do not stop swinging until the King falls.','violet: You walked into dragonfire for the people waiting at home. Come here. I’m kissing you, and Tairn can look away.']},
   {t:'Call Tairn down. Fight dragon with dragon.',r:['The roof cracks and Tairn smashes through, roaring. Three heads turn to meet him, and in that heartbeat your blade finds the King’s heart.','violet: Tairn says you were “adequate.” From him, that’s a love poem. You’re shaking. So am I. Just hold on a minute.']},
   {t:'Think of home. End it for every night they sleep safe.',r:['Your wife’s laugh. The kids at bedtime. You fight like a man with somewhere to be, and the King Black Dragon crashes down and does not rise.','violet: I’ve survived Threshing, and that’s the strongest thing I’ve ever seen. Go home. Tell them the dragon’s gone. Then come find me.']},
  ]},
};
