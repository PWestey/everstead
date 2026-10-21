// Expedition first-visit scenes: shown the first time the player runs each adventure or boss
// (lib/expedition-data.mjs). Later runs are a one-tap result card. See docs/WRITING-BRIEF.md.
// Scene = {open:[lines], opts:[{t:'player choice', r:[reply lines]}]}.
// A plain line is narration; "<castId>: text" or "player: text" is someone speaking.

/** @type {Record<string,{open:string[],opts:{t:string,r:string[]}[]}>} */
export const EXPEDITION_SCENES={
 // ================= Lumbridge =================
 'cow-field':{
  open:[
   'The field east of Lumbridge. Grass, river, and a smell that is mostly cow.',
   'A farmer leans on a broken gate. Nearby, a goblin is trying to milk a bull. The bull has notes.',
   'peter: Okay, full honesty? Closest I’ve been to a cow before today was the milk aisle at the bodega. Queens is not big on cows.',
   'peter: So his gate’s busted, the herd keeps wandering off and he’s got hides to haul. I said we’d help. I say that a lot. Aunt May says too much.',
  ],
  opts:[
   {t:'Grab the hammer. Gate first.',r:['peter: Yes. Okay. Nobody writes songs about gates, but this is like the cabinet hinge at home. Ten minutes and nobody yells at it ever again.','The gate swings true. The farmer nods once, which in Lumbridge counts as a parade.']},
   {t:'Help the goblin. He’s clearly having a day.',r:['peter: Hey, little guy. Buddy. Pal. That one has horns. Horns mean no milk. I learned that like two minutes ago, so no judgment.','The goblin leaves with an empty bucket and roughly the same dignity he arrived with.']},
   {t:'Carry the hides. All of them. One trip.',r:['peter: One trip? Oh, you’re a one-trip-with-the-groceries guy. Respect. I’ll be over here holding the ice pack.','You make it to the shed without dropping a single hide. Peter applauds. The cows do not.']},
  ]},
 'goblin-village':{
  open:[
   'North of the Falador road, the goblin village is having its usual argument.',
   'Half the tribe is painted red. Half is painted green. The reasons were lost generations ago. The shouting was not.',
   'grog: Little green guys! Little red guys! Which ones are we hitting?',
   'player: Maybe nobody. It’s a fight about colours.',
   'grog: Oh. Grog has a favourite colour. It is red. Red is blood. Also apples. Both good.',
  ],
  opts:[
   {t:'Settle it properly. Arm wrestling.',r:['grog: ARM WRESTLING! Okay, you go, then Grog goes, then Grog goes again because Grog wants another turn.','By sundown you have beaten both generals twice. The tribe declares your colour the official one. Nobody asks what it is.']},
   {t:'Walk away. Not our fight.',r:['grog: Hm. Pike says that. Pike says picking the fight is the hard part, not the hitting. Grog thinks hitting is also hard. On the knuckles.','grog: Okay. You picked good, little buddy. Now Grog is hungry. Is there a tavern? Or a cow? A cow is basically a tavern.']},
  ]},
 'lumbridge-swamp':{
  open:[
   'South of the castle the ground goes soft. Fog sits on the water, and the giant frogs stare like you owe them money.',
   'Past the reeds, two old mines dig into the hill. A sign says “Danger.” Someone has scratched “mostly” underneath.',
   'shallan: Oh, that light. Don’t move. Not you, the frog. Actually, you too. You’re the better subject, and the frog knows it.',
   'shallan: Pattern says the cave gas goes boom near an open flame. He hummed it very pointedly. In your direction.',
  ],
  opts:[
   {t:'Mine the copper and tin. Steady work, steady pay.',r:['shallan: Swing, step, swing. You do the dull part like it matters. That’s an infuriatingly attractive quality, I’ll have you know.','When the fog lifts your pack is full of ore and her sketchbook is full of you.']},
   {t:'Sit and sketch the swamp with her for a while.',r:['shallan: You put the pickaxe down. For me. Hold that face. I want it on paper before you remember your to-do list.','She settles against your shoulder and draws. Even the frogs seem to give you some privacy.']},
   {t:'Bring a lantern into the cave. What could happen?',r:['A small boom. Not a big one. Your eyebrows are now a talking point.','shallan: I got all of it. The flash, your face, the little hop. This is going on the wall. Pattern says it’s the truest thing I’ve drawn.']},
  ]},
 'draynor-manor':{
  open:[
   'The manor on the hill has its own thunderstorm. It keeps it running on sunny days, out of tradition.',
   'The front door slams shut behind you. Locally, this counts as a welcome.',
   'matt: Six heartbeats in here besides ours. Two of them aren’t human. One’s so slow I’m not sure it counts.',
   'matt: Something under the floor smells like a crypt and old pennies. Father Lantom would say pray first. Foggy would say leave. Foggy’s usually outvoted.',
  ],
  opts:[
   {t:'Say the prayer with him. Then go in.',r:['matt: Scared? Good. Me too. You say the words anyway, and then you don’t stay in the hallway. That’s the whole trick.','The halls are just as dark. They feel a lot smaller now.']},
   {t:'Help the professor find his lost machine parts.',r:['Professor Oddenstein thanks you, explains his chicken machine for twenty minutes, then calls you Gerald.','matt: Sweet guy. Terrible ideas. Half my clients in Hell’s Kitchen, honestly.']},
   {t:'Pull the lever marked “DO NOT PULL.”',r:['A bookcase grinds open. Somewhere below, something old rolls over in its sleep.','matt: And now it knows we’re here. Great. Little tip, {name}: when the sign says don’t, ask the blind guy first.']},
  ]},
 'count-draynor':{
  open:[
   'The cellar stairs go down further than the house should allow. The air tastes of dust and old coins.',
   'In the middle of the room sits a coffin. The lid is already open, which is never good news.',
   'shadowheart: Garlic, stake, hammer. And a prayer, if you’ve one to spare. Selûne doesn’t do half-measures, so neither do we.',
   'shadowheart: He traded everything for forever. I know a thing or two about bad bargains with the dark. Don’t ever let me catch you making one.',
   'A pale figure unfolds from the shadows. Count Draynor smiles with far too many teeth and announces that supper has arrived.',
   'shadowheart: Stay close. Closer. There. Now I can keep you alive and enjoy the view.',
  ],
  opts:[
   {t:'Throw the garlic and charge.',r:['The Count recoils, hissing like a kettle with a grudge. Your stake goes home, and he collapses into dust and one very surprised bat.','shadowheart: Well. Remind me to kiss you once you stop smelling like a garlic farm.']},
   {t:'Let her call down Selûne’s light first.',r:['Silver light floods the cellar. The Count, blinded for the first time in centuries, falls to one clean strike.','shadowheart: She answered. She doesn’t always, you know. I think she likes you. I might, too. Come here.']},
   {t:'Tell him you’ve got a family waiting. He’s making you late.',r:['The Count laughs, right up until you hit him harder than anyone has in an age. The coffin lid slams on an empty box.','shadowheart: Go home to them. Hug the kids. And save a little of that fire for me, would you?']},
  ]},

 // ================= Asgarnia =================
 'dwarven-mine':{
  open:[
   'Under Ice Mountain, the Dwarven Mine goes in every direction a pickaxe ever dreamed of.',
   'Dwarves glare from behind their ore carts. One mutters about humans and their “wee arms.”',
   'tony: Okay, initial review. Ventilation, criminal. Rail work, gorgeous. That guy’s beard, honestly, aspirational.',
   'tony: Mithril down deep, iron up top, and a dwarf selling a pickaxe I would love to take apart. For science. And a little bit of spite.',
  ],
  opts:[
   {t:'Mine iron until your shoulders burn.',r:['tony: No suit, no thrusters, just a guy and a rock. I’m not saying I’m impressed. I’m saying I’d hire you.','The muttering stops. One dwarf grudgingly calls you “lad,” which down here is a promotion.']},
   {t:'Trade the dwarves something they actually need.',r:['You fix a busted cart wheel, and the foreman tells you where the good seam is.','tony: That’s business. Find their problem, fix their problem, get the map. Also, that handshake. I think he rearranged my knuckles.']},
   {t:'Go deep for the mithril.',r:['It is dark, hot and very far down. You come back up with blue-green ore and a new appreciation for the sun.','tony: My first suit got built in a cave out of junk, so I’ve got a soft spot for holes in the ground. Nice haul.']},
  ]},
 'ice-mountain':{
  open:[
   'The climb up Ice Mountain is wind, white, and ice warriors standing about like statues with grudges.',
   'At the summit an old woman sits beside a fire that has no business burning up here. The Oracle.',
   'obiwan: Do you know, I’ve met several people who claimed to see the future. None of them lived anywhere this inconvenient. Well. Except Yoda.',
   'The Oracle looks at you, then the sky, and mutters something about small things done daily outweighing great things done once.',
  ],
  opts:[
   {t:'Ask the Oracle what it means.',r:['obiwan: Oh, I suspect you already know. You just wanted to hear it from someone with icicles in her hair.','obiwan: Keep the small promises, {name}. I spent twenty years on Tatooine doing very little else. It was enough.']},
   {t:'Fight your way back down through the ice warriors.',r:['obiwan: Breathe. Let the cold go through you, not into you. Rather like sand, only less coarse.','At the bottom you are frozen, aching and grinning like a fool. Obi-Wan’s robes are not even rumpled.']},
  ]},
 'black-knights-fortress':{
  open:[
   'The Black Knights’ Fortress squats on a cliff north of Falador, black stone over a very long drop.',
   'The White Knights want to know what is cooking inside. Literally. There is talk of a secret potion and an enormous cauldron.',
   'kelsier: A fortress, a secret plan and a pot. Now this is my kind of afternoon. Ask me how my last few jobs went. Actually, don’t.',
   'kelsier: Borrowed armour, shoulders back, look bored. Nobody stops a man who looks like he’s counting the minutes till dinner at home.',
  ],
  opts:[
   {t:'Stand in the grill vent and listen. Patiently.',r:['Two hours of knights complaining about the rations. Then the entire plan, word for word.','kelsier: Everyone wants to be the one leaping off the rooftop. The job’s actually won by the fellow in the vent. Don’t tell Vin I said that.']},
   {t:'Drop a cabbage in their cauldron.',r:['A wet, ugly bubbling. Then a smell. Then a great deal of shouting about whose turn it was to watch the pot.','kelsier: Sabotage by vegetable. I’ve toppled noble houses with less style. Well. Not less. Different.']},
   {t:'Let Kelsier talk you past the gate.',r:['kelsier: Evening, lads. Inspection. Your captain says the armour’s scuffed. I didn’t want to believe him, but look at this.','Nobody argues. You walk in, take the plans and walk out, and Kelsier grins the whole way down the hill.']},
  ]},
 'taverley-dungeon':{
  open:[
   'Below the druids’ sleepy village, stone steps lead down into the warm, damp dark of Taverley Dungeon.',
   'Poison spiders. Black knights who took a wrong turn. And further in, slow, enormous breathing.',
   'karlach: Oh, I love it already. Hot, smelly, full of teeth. It’s like Avernus, minus the part where everyone wants my soul.',
   'karlach: Anti-dragon shield up, soldier. I am not losing that face to a big blue lizard with heartburn.',
  ],
  opts:[
   {t:'Take on the blue dragon head-on.',r:['karlach: YES! Through the fire! Hit it like it owes you money! Hit it like it owes ME money!','The dragon goes down hard enough to shake dust off the ceiling. Karlach goes in for a hug, remembers the engine, and gives you the hottest high five of your life.']},
   {t:'Take the long way round through the agility pipe.',r:['You wriggle through the narrow pipe and come out the far side filthy and triumphant.','karlach: Okay, that was hot. The wiggling. Not the pipe. Stop looking at me like that, I’m a soldier, I notice form.']},
  ]},
 'giant-mole':{
  open:[
   'Falador Park. Fountains, roses, a bench in the sun. The ideal spot for a quiet afternoon with someone you love.',
   'padme: I packed lunch. I brought the blanket. I wore the blue dress you like. Then the lawn started to move.',
   'Molehills burst up across the grass. The gardener is in tears. A rose bush simply leaves.',
   'Under the park the earth rumbles. Something is digging, and it is roughly the size of a cottage.',
   'padme: I’ve sat across the table from the Trade Federation. I can handle a mole. I’d just rather handle it with you.',
   'The turf heaves and the Giant Mole surfaces, blinking, furious that anyone would interrupt its tunnelling.',
  ],
  opts:[
   {t:'Light a candle and follow it into the tunnels.',r:['It burrows off again and again. You keep after it, stubborn as a leaky tap you refuse to pay someone to fix, until it slumps and the park goes quiet.','padme: You missed lunch. I forgive you. Slowly. Probably over dinner.']},
   {t:'Protect the picnic. Some things are worth defending.',r:['The mole charges the blanket and meets you instead. You do not give an inch. It tips over and stays there.','padme: You just defended a sandwich like it was the throne room on Naboo. I don’t think I’ve ever wanted to kiss someone more.']},
   {t:'Let her distract it while you strike.',r:['Padmé flicks a napkin and dances clear with the poise of a queen. The mole turns its head, and your blow lands.','padme: We make a good team, you and I. I think we should practise more. Somewhere without moles.']},
  ]},

 // ================= Morytania =================
 'canifis':{
  open:[
   'Across the River Salve, Canifis huddles under a sky that never quite gets round to daylight.',
   'The locals smile with a lot of teeth. The barman’s eyebrows meet in the middle. Everyone is very curious how long you plan to stay.',
   'vex: Relax, darling. I’ve tracked worse than this. Granted, Trinket was usually with me, and he’s far better at growling.',
   'vex: When the moon comes up, don’t run. Running makes them chase. Stand still and keep your hand on my waist. Purely tactical.',
  ],
  opts:[
   {t:'Stay calm and keep your hand where she put it.',r:['The moon rises. Fur sprouts all over the tavern. You don’t flinch, and nobody fancies testing a man that steady.','vex: Not even a twitch. I could get very used to watching you not panic.']},
   {t:'Buy a round for the whole tavern.',r:['Werewolves, it turns out, love a free drink. The room relaxes by several teeth.','vex: You spent gold. On strangers. Willingly. I can’t decide whether to scold you or kiss you.']},
   {t:'Leave before dark. Home is better.',r:['You take her hand and head for the gate while the sun is still a smudge on the hills.','vex: Knowing when to leave. Most men stay for one more drink. You’re not most men, are you?']},
  ]},
 'mort-myre':{
  open:[
   'Mort Myre is a swamp that gave up trying to be anything else. The water is black. The trees lean in to listen.',
   'Ghouls pick through the reeds. Somewhere ahead is the druids’ grotto and a little warmth, if you can reach it.',
   'din: Step where I step. The ground lies here.',
   'din: The kid would eat these frogs. He’s done it before. I had to apologise to a lady.',
  ],
  opts:[
   {t:'Ask him about his kid.',r:['din: He’s small. He’s stubborn. He uses the Force to steal snacks. He’s the best thing I’ve done.','din: Get through this swamp. Then go home and put yours to bed yourself. That’s the job.']},
   {t:'Fill a druid pouch and push for the grotto.',r:['The ghouls rush you. Din steps in front without a word, the way fathers do.','You reach the grotto’s warm light together. Din nods once. From him, that’s a speech.']},
  ]},
 'port-phasmatys':{
  open:[
   'Port Phasmatys sits on the coast like a held breath. Its people are see-through, polite and very, very tired.',
   'Without an amulet of ghostspeak, all they say is “woo.” With one, it turns out they mostly want to go home.',
   'tchalla: When I visit my ancestors, they wait beneath an acacia under a violet sky. They are at peace. These people are not.',
   'tchalla: Someone has kept them here, feeding on their rest. My sister would call it a design flaw. I call it a crime.',
  ],
  opts:[
   {t:'Fill the Ectofuntus and earn their release.',r:['Bones ground, slime hauled, the green tower glows. One by one the ghosts nod, smile and fade.','tchalla: Grinding bones and carrying buckets. No one will sing of it, {name}. In Wakanda, that is how we know it was real service.']},
   {t:'Listen to the ghosts’ stories first.',r:['A fisherman tells you about his wife. A baker tells you about her bread. They just needed someone to hear them out.','tchalla: A king spends most of his days listening. You would be surprised how few people can do it. You can.']},
  ]},
 'vampyre-hunt':{
  open:[
   'Under a ruined pub in Canifis, a handful of tired rebels call themselves the Myreque. Their swords are sharp. Their odds are not.',
   'The Drakans rule this land and bleed it dry. Tonight the Myreque hit back, and they want you along.',
   'vin: Mist, rooftops, and a lord who thinks nobody will ever come for him. I know this night. I’ve had it before.',
   'vin: Reen used to say trust gets you killed. Then I watched you tuck your kids in. Every night. I’m still working out what to do with that.',
  ],
  opts:[
   {t:'Take point. Draw the vampyres out.',r:['They come fast out of the dark. You meet them faster, and the ambush falls apart while the Myreque cheer.','vin: You didn’t even check for the exits first. I always check the exits. Hold still, you’ve got mist on your collar.']},
   {t:'Guard the Myreque’s children in the hideout.',r:['While the fight rages overhead, you sit with the little ones and tell stories until they stop shaking.','vin: When I was that size, nobody stayed. They’ll remember that you did. Not the swords. You.']},
   {t:'Race her across the rooftops.',r:['She is a blur of mist and cloak. You are a great many heavy boots. You almost keep up.','vin: Almost. I was burning pewter, so that was cheating. Rematch somewhere quieter. No vampyres.']},
  ]},
 'barrows':{
  open:[
   'The Barrows rise out of the Morytanian marsh: six mounds, six crypts, six brothers who swore they would never be beaten.',
   'Ahrim, Karil, Guthan, Torag, Verac. One by one their tombs crack open behind you. The sixth is very, very quiet.',
   'darrow: Brothers who won’t stay dead. Sevro would want to paint wolves on them. I just want them to lie down.',
   'darrow: Dharok has the greataxe. The more you hurt him, the harder he swings. So we don’t hurt him slowly.',
   'The sixth tomb opens. Dharok the Wretched rises, axe dragging on the stone, eyes like dead coals.',
   'darrow: Every early alarm you hated. Every rep. Every night you went to bed instead of scrolling. That was for this. Now, brother.',
  ],
  opts:[
   {t:'Go in fast and finish it before he gets angry.',r:['Three hits before the axe even lifts. Dharok staggers, the greataxe clatters to the stone and the crypt goes silent.','darrow: Bloodydamn, that was quick. Hail, brother. The Howlers would’ve howled the roof down.']},
   {t:'Pray first. Then take him down.',r:['The prayer slows your heart. The axe bites only air, your counter lands clean and the last brother falls.','darrow: Eo used to sing before the hard shifts in the mine. You pray. Same thing, I think. Break the chain, {name}.']},
   {t:'Fight side by side with Darrow.',r:['Darrow takes the left, you take the right. Dharok can’t watch you both, and folds into dust and old iron.','darrow: Chest is yours. I just wanted to fight next to you. Feels like the Institute, minus the starving.']},
  ]},
};
