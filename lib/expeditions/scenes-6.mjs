// Expedition first-visit scenes, part 6: the Dragonkin’s Trail, the Southern Seas, the Kebos Lowlands and the Deep Roads (lib/expedition-data.mjs).
// Same format as lib/expeditions/scenes.mjs. See docs/WRITING-BRIEF.md.
// Scene = {open:[lines], opts:[{t:'player choice', r:[reply lines]}]}.
// A plain line is narration; "<castId>: text" or "player: text" is someone speaking.

/** @type {Record<string,{open:string[],opts:{t:string,r:string[]}[]}>} */
export const EXPEDITION_SCENES={
 // ================= The Dragonkin’s Trail =================
 'fossil-island':{
  open:[
   'Fossil Island. The Varrock Museum has a camp of tents on the beach, and ammonite crabs that look like rocks until you sit on one.',
   'A scholar hands you a trowel and points at a cliff full of bones older than any god anyone still prays to.',
   'rocket: Okay. Bones. Big bones. You know what you can build out of a bone that size? Me neither, but I’m gonna find out.',
   'rocket: Hey, don’t touch that crab. It’s a crab. It looks like a rock. Everything here looks like a rock. Trust the raccoon. Don’t call me that.',
  ],
  opts:[
   {t:'Dig. Carefully. The museum wants whole fossils.',r:['You spend the afternoon brushing dirt off a skull the size of a cart. Rocket gets bored, then interested, then stops talking, which is new.','rocket: Fine, fine. Slow’s not my thing but that’s a clean dig. Groot would plant something in it. You got a shelf at home for this stuff? Get one.']},
   {t:'Fight the ammonite crabs for the shells.',r:['Nine crabs. They are mostly shell and bad attitude. You come out with a sack of them and a bruise shaped like a spiral.','rocket: Ha! You got clipped by a rock with legs. I’m gonna tell Quill. Okay, hand me the shells, I think I can make ’em explode.']},
   {t:'Ask Rocket what he’d build with the bones.',r:['rocket: A chair, first. Then a gun. Then a chair that’s also a gun. Look, I don’t plan. I pick stuff up and the plan shows up later.','He is already wiring something to a vertebra. “You do stuff like this? Not the gun part. The messing around part. You should. Keeps the head quiet.”']},
  ]},
 'lithkren':{
  open:[
   'The Lithkren Vault, under the island’s north cliffs. A door the dragonkin built to keep something in, and it has held since before the gods fell.',
   'Behind it, the museum crew whispers, are metal dragons. Steel, mithril, adamant. Nobody has been past the first room.',
   'virginia: A locked door, a dead civilisation and a secret everybody wants. I grew up in a house like this. Fewer dragons. Marginally.',
   'virginia: Darrow would already be through the door. I’d rather know what’s behind it first. Humor me. Read the walls before you kick them.',
  ],
  opts:[
   {t:'Read the walls. Find the vault’s pattern.',r:['The dragonkin wrote their locks into the stone. You find the sequence while Virginia reads over your shoulder and corrects your translation twice.','virginia: There. Half an hour of reading saved us a day of bleeding. That’s how I run a Republic, and how you should run a week. Plan first, then charge.']},
   {t:'Kick the door. Fight whatever answers.',r:['The adamant dragon answers. It is slow, enormous and breathes heat that cooks the moss off the walls. You put it down the hard way.','virginia: Reckless. Effective. You and my husband would get on far too well. Don’t make me manage two of you.']},
   {t:'Ask Mustang what she’d do with a vault like this.',r:['virginia: Open it, catalogue it, and never let one person own the key. Power that sits with one man rots. I learned that from my father. Badly.','She traces a sigil with one finger. “Your work, whatever it is. Who holds the key when you’re not there? Think about it.”']},
  ]},
 'myths-guild':{
  open:[
   'The Myths’ Guild on the west coast. Dragon slayers only, says the sign. The basement has the dragons they practise on.',
   'Upstairs is a bar and a wall of trophies. Downstairs, a rune dragon snores in a cage that looks far too thin.',
   'megan: I lit a candle before we came in. Don’t laugh. I light one for every trip and I’ve never lost anyone yet.',
   'megan: I know, dragons. But look at this place. They built a whole guild around getting back up. That’s a kind of church too.',
  ],
  opts:[
   {t:'Go down and face the rune dragon.',r:['The cage opens. The dragon is awake after all. It takes everything you have and a shield that is suddenly much thinner.','megan: You came back up. I knew you would, and I still held my breath the whole time. Come here. I don’t care who’s watching.']},
   {t:'Sit with Megan in the bar first.',r:['megan: Good. Me first, dragon after. Two minutes. Tell me one thing you’re thankful for today. I write mine down every night, you know that.','You tell her. She writes it in her little book with the others. “That’s going in the list. Now go be brave. I’ll be right here.”']},
   {t:'Read the trophy wall. Learn who came before.',r:['Names, dates, teeth. One slayer wrote “third attempt” beside his trophy and underlined it.','megan: Third attempt. I love that. He didn’t carve the first two over. He kept them. That’s honest. That’s you, some weeks.']},
  ]},
 'ungael':{
  open:[
   'Ungael. A dead island north of Rellekka, ice on every rock, and zombified spawn still crawling up out of it.',
   'The fisherman who rowed you here will not step off the boat. He is already untying it.',
   'varian: Dead things that won’t stay down. I’ve buried enough to know the feeling. Stay off the ice where it’s dark. That’s where it’s thin.',
   'varian: Anduin would be writing a poem about this place. I’d have mocked him for it, once. I’d give a lot to hear it now.',
  ],
  opts:[
   {t:'Clear the spawn, one at a time.',r:['They come in twos and threes. You hold the shore with Varian at your back and the ice goes quiet by dusk.','varian: Clean work. No wasted swings. You fight like a man who has somewhere to be after. Keep it that way.']},
   {t:'Scout the island before anything else.',r:['You walk the whole frozen rim first. Varian says nothing until you point out the crater where the big one sleeps.','varian: I used to charge first and think later. It cost me a wife and nearly a son. Looking first is not cowardice. It’s what I should have done.']},
   {t:'Ask Varian about his son.',r:['varian: Anduin. Hates swords, loves books, braver than I ever was. I thought I could shout him into being me. I was wrong, and I’m glad.','He kicks a spawn’s skull off the path. “Whatever your kids are, let them be it. Then stand behind them. That part never changes.”']},
  ]},
 'vorkath':{
  open:[
   'Vorkath. The dragon Zorgoth left dead on Ungael, and dead is clearly a loose term. It is blue, it is awake, and it is already breathing acid.',
   'The ground between you is pocked with pools that smoke. Somewhere under the ice, a zombified spawn is being born.',
   'vannaka: Vorkath. Hardest thing I ever put on a slayer slip. Half of ’em hand the slip back. I keep the slips.',
   'vannaka: Acid on the ground, don’t stand in it. Spawn comes up, kill it before it blows. Fire, you pray. That’s the whole briefing.',
  ],
  opts:[
   {t:'Stand and trade blows. Move only for the acid.',r:['You plant your feet and only step when the ground smokes. It takes a long time and every bit of your arms.','vannaka: Stood your ground. Most don’t. Same thing as a morning run in the rain, really. Boring, horrible, and it’s what separates you.']},
   {t:'Kite it. Keep it moving, keep it tired.',r:['You run the dragon in circles across the ice until its breath comes slow. Then you turn around.','vannaka: Huh. Didn’t take you for a runner. Fine. Whatever gets the job done, so long as the job gets done.']},
   {t:'Ask Vannaka why he keeps the failed slips.',r:['vannaka: So when they come back a year later, stronger, I can hand ’em the same slip. Most do come back. That’s the part nobody tells you.','He stuffs a slip into your hand. It has your name on it. “Go on. Finish it or bring it back. Either way, I’ll be here.”']},
  ]},
 // ================= The Southern Seas =================
 'mos-le-harmless':{
  open:[
   'Mos Le’Harmless. A pirate town on a pirate island, with a tavern, a bar fight in progress, and a cave full of cave horrors under the lot.',
   'Someone is singing a shanty badly. Someone else is trying to fix it. Nobody is drinking anything you would call safe.',
   'zoey: Okay, I’m writing this down. “The rum is the least dangerous thing.” That’s a hook. That’s a whole chorus, actually.',
   'zoey: Also those guys are about to fight. Also I kind of want to hear the end of that song first. Priorities, right?',
  ],
  opts:[
   {t:'Go down into the cave. Clear the horrors.',r:['The cave horrors come at you out of the dark with faces that are not faces. Zoey hums the whole time. It helps more than it should.','zoey: You were so calm down there. I had a verse ready in case you died. Super dramatic. Now I’ll have to rewrite it as a love song. Fine.']},
   {t:'Fix the shanty with Zoey.',r:['zoey: Yes! Okay, the second line’s wrong, it needs a rhyme for “Harmless” and I have never had a harder job. Hold my notebook.','By midnight the whole tavern is singing your version. One pirate cries. Zoey writes down why.']},
   {t:'Work the docks for a day. Earn a pirate’s pay.',r:['You haul crates and splice rope and get paid in coins that are mostly real. Zoey sits on a barrel and writes about your hands.','zoey: A full day of work and you didn’t get stabbed once. That’s like, a hit song in this town. Carry me home? Not tired. Just want you to.']},
  ]},
 'braindeath-island':{
  open:[
   'Braindeath Island. The rum comes from here, the pirates are sick from it, and the brewery is run by a man who thinks the rum is fine.',
   'Fever spiders in the cellar. Something in the vats. The captain who brought you keeps saying “just one more” to nobody.',
   'thrall: I have seen a whole Horde drink itself stupid. Then I watched it try to build a city. One of those is harder.',
   'thrall: Aggra would have poured this whole island into the sea. She would have been right, too. Come. Let us see what they put in the vat.',
  ],
  opts:[
   {t:'Clear the cellar and fix the brew.',r:['You go down among the spiders with a torch and come up with the cure, and the brewer finally admits the rum was not fine.','thrall: Good. A thing that poisons a whole crew is not worth saving, no matter how much it is loved. I had to learn that about a warchief’s chair.']},
   {t:'Pour it all out. Every barrel.',r:['The pirates howl. Thrall stands in the doorway and the howling stops. You roll the barrels into the sea one by one.','thrall: Hard, and loud, and right. At home there is probably something you keep saying “one more” about. You know what to do with it.']},
   {t:'Ask Thrall what he gave up for Aggra.',r:['thrall: The Horde. The title. Easier to drop than I feared. Harder was learning to shut my mouth and hear her. An orc is not built for it. I practise.','He lifts a barrel like it is empty. “Listen to your wife tonight, {name}. Properly. It is the bravest thing I do all day.”']},
  ]},
 'crash-island':{
  open:[
   'Crash Island. The gnome gliders aim for it and mostly hit it. The wrecks are stacked on the beach like firewood.',
   'Monkey archers in the trees. A clear trail up the ridge that nobody has run in years.',
   'fannie: Oh wow. Wrecks, cliffs, a trail nobody’s mapped. Goggles on. Who wants to race to the top? That’s you. You want to.',
   'fannie: Also there are monkeys with bows. So, like, zig-zag. Running’s better with a reason anyway.',
  ],
  opts:[
   {t:'Race Fannie to the ridge.',r:['You lose by a lot. You also make it to the top without stopping, which, going by Fannie’s face, is the actual win.','fannie: You didn’t stop! Not once! Okay, next time we go further. I like having someone to chase me. I like it a lot, actually.']},
   {t:'Clear the archers out of the trees.',r:['The monkeys are fast and rude. You work the treeline with a shield up and Fannie calling shots from the beach.','fannie: Left, no, your other left! You got them though. All of them. Come here, you’ve got a leaf in your hair. Leave it. It suits you.']},
   {t:'Salvage the gliders. Someone could use the parts.',r:['fannie: Ooh, practical. Fine, fine. I’ll carry. Not because I’m being nice. I just like watching you lift things.','You stack a cart with wings and struts. A gnome pilot nearly weeps. Fannie claims the goggles off a wreck and wears two pairs now.']},
  ]},
 'ape-atoll':{
  open:[
   'Ape Atoll. A kingdom of monkeys with a king, a temple, a jail, and guards who put humans in the jail on sight.',
   'From the hill you can see the whole patrol route. The guards walk it like clockwork and never look up.',
   'caitlyn: Patrols on a timer. Blind spots at the corners. Give me a rifle and an hour and I could take that gate. We won’t. But I could.',
   'caitlyn: We go slow. You move when I say move. Not before. I’ve lost people to “not before.”',
  ],
  opts:[
   {t:'Wait for Caitlyn’s signal. Every time.',r:['Four patrols. Four waits that feel like an hour each. You never move early and the monkeys never see you. It is agonising and it works.','caitlyn: That. That’s the whole skill. Wait, breathe, then act. It works on a rooftop and it works on a phone at nine at night. Try it.']},
   {t:'Rush the gate and fight through.',r:['You go loud. The guards are better than they look and the jail is closer than it looks. Caitlyn gets you out with a borrowed key and an expression.','caitlyn: Well. We learned something about patience today. Mostly I learned about yours. Next time, we try it my way, and you owe me dinner.']},
   {t:'Climb to the temple and sit a while.',r:['The monkeys pray in the temple, hands folded, eyes closed, in perfect silence. You and Caitlyn sit at the back and nobody notices or minds.','caitlyn: I don’t pray. Didn’t. But there’s something in a room full of people who all shut up at once. I could get used to it. With you.']},
  ]},
 'jungle-demon':{
  open:[
   'The mad gnome Glough’s last gift to the world. A demon in a stone circle on Crash Island, fat on an island’s fear.',
   'The monkeys will not come near. The gnomes will not come near. Something in the circle laughs when it sees you.',
   'lilian: A demon. Fine. I’ve been dead. I was raised wrong, I was raised twice, and the Light still picks up when I call. Let it laugh.',
   'lilian: Don’t pray pretty. There’s no time. Say what you mean and swing. That’s how I do it and I’m still standing.',
  ],
  opts:[
   {t:'Fight it straight. No tricks.',r:['The demon is enormous and old. You take its hits and give yours back until the circle cracks and the fear drains out of the island.','lilian: Ugly fight. Good one. You didn’t flinch when it called you by name. Most do. I did, once. Then I came back and did it right.']},
   {t:'Say a prayer first. Out loud.',r:['lilian: Right. Out loud, then. I’ll say mine, you say yours. No, I’m not shy. I’m just not used to company.','The two prayers are nothing alike. The demon hears both. It stops laughing and you both go in.']},
   {t:'Ask Lilian what dying was like.',r:['lilian: Quiet. Then loud. Then my father’s voice telling me to kneel to the wrong thing. I didn’t. That’s the whole story.','She rolls her shoulders. “You get one life at a time, {name}. Spend it on something. The demon’s waiting.”']},
  ]},
 // ================= The Kebos Lowlands =================
 'kebos-swamp':{
  open:[
   'The Kebos Swamp, west of Kourend. Mud to the knee, crabs the size of carts, and a mist that never quite lifts.',
   'Your boots are already lost. One crab watches you with an expression you do not care for.',
   'ororo: Give me a moment. I can lift this fog if you like. Or we can walk in it. I grew up in a city with worse air. Cairo at noon.',
   'ororo: The crabs don’t bother me. The mud does. A home should be dry at the floor. Anything else is a swamp with a roof.',
  ],
  opts:[
   {t:'Fight through the crabs.',r:['The crabs are armored and slow. You take them one at a time with Ororo calling the wind to keep the mist off your eyes.','ororo: You are soaked and smiling. Good. Tomorrow you will ache. Welcome it. Then wash the floor, because I know you tracked this in.']},
   {t:'Build a boardwalk across the worst of it.',r:['You cut reeds and lash planks for most of an afternoon. The swamp fights back. The boardwalk holds.','ororo: Patient work. Unglamorous. This is how I keep my garden, you know. One row at a time, before the sun gets high. Come see it some morning.']},
   {t:'Ask Ororo to clear the sky.',r:['ororo: As you wish. Stand behind me.','Her eyes go white, the mist tears open, and for a moment the whole swamp is lit gold. “There. Don’t ask again until you’ve earned it,” she says, fondly.']},
  ]},
 'molch':{
  open:[
   'Molch. A lizardman town in the lowlands, built around a shaman’s hut, and every brute in it has already noticed you.',
   'The Shayzien want the town cleared. The lizardmen want you gone. Both parties have a point.',
   'caitlyn: Right. Shamans in the centre, brutes on the edge. That’s a bad layout for them and a good one for us.',
   'caitlyn: We take the edge quietly before the centre ever hears about it. Rifle up, mouth shut. I know, I know. You can talk after.',
  ],
  opts:[
   {t:'Work the edges quietly, as Caitlyn says.',r:['Brute by brute, from the long grass. The shamans never raise the alarm because there is nobody left to raise it.','caitlyn: Clean. Tidy. Not one wasted shot. I’d hire you. I wouldn’t pay you much, but I’d hire you.']},
   {t:'Take the shaman first and let the rest scatter.',r:['You cut straight through to the hut. The shaman splits into little spawn that explode in your face, which is as pleasant as it sounds.','caitlyn: That was not the plan. It worked. Enforcers do that too. Vi does it every day. I spend my afternoons filling in the forms.']},
   {t:'Ask Caitlyn how she keeps a city in order.',r:['caitlyn: Lists. Patrols. Doing the boring report before the exciting chase, every time. The chase is a reward. Not the job.','She reloads without looking. “Your work has a boring report in it too. Do it first. Then come find me and we’ll chase something.”']},
  ]},
 'karuulm-dungeon':{
  open:[
   'The Karuulm Slayer Dungeon, under the volcano. Stone boots again. The wyrms coil in the heat and do not seem to mind it.',
   'Something drips from the ceiling that is probably not water. The air tastes like a struck match.',
   'jester: Okay so it is SO hot in here. Like, cupcake-oven hot. Which, honestly, I have a cupcake in my bag and I think it’s done now.',
   'jester: The Traveler says the wyrms are grumpy because nobody ever visits. I think he’s messing with me. He does that. I love it.',
  ],
  opts:[
   {t:'Fight the wyrms. All of them.',r:['They lunge, you dodge, the boots hold. By the fourth one you are soaked through and grinning like an idiot.','jester: You look SO gross right now. Sweaty and gross and amazing. Do you do this every day? The sweating part? You should, it’s working.']},
   {t:'Paint the wyrms. Jester has brushes.',r:['jester: YES. Okay, you do the big one, I’ll do the little one, and if they wake up we just run really fast.','The wyrms wake up halfway through. You run really fast. Jester finishes her painting at the top of the stairs from memory. It has a hat on it.']},
   {t:'Prank the slayer master on the way out.',r:['Jester draws a very small, very rude picture on the back of Konar’s task slip. You distract Konar. It takes a lot of distracting.','jester: She didn’t even notice! Oh my gosh. We’re criminals now. We’re definitely bound together. Forever. You can kiss me later for it.']},
  ]},
 'forthos-dungeon':{
  open:[
   'The Forthos Dungeon, beneath the ruined temple in the Hosidius hills. Red dragons sleep in the lower halls. Something older is below them.',
   'A broken altar at the entrance. Someone has left fresh flowers on it anyway.',
   'baine: Flowers on a broken altar. My father would have liked that. The Earth Mother does not care if the roof is gone.',
   'baine: Red dragons sleep light. We walk quiet, we fight only what wakes, and we come back out. Cairne taught me the order. I teach it the same.',
  ],
  opts:[
   {t:'Walk quiet. Fight only what wakes.',r:['Two dragons stir. You take them with Baine and leave the rest sleeping, and the dungeon lets you pass like it was expecting you.','baine: As it should be. A son watches what you do, not what you say. Do it the same way every time, and he will too. Even in a dragon’s den.']},
   {t:'Stop at the altar first.',r:['You kneel beside the flowers. Baine lowers his great head and says a few words to the Earth Mother in Taurahe. He does not translate.','baine: Thank you for waiting. My people say the first step down any road belongs to the ancestors. A small habit. It holds up large ones.']},
   {t:'Ask Baine about Cairne.',r:['baine: Big. Slow to anger. Slower to speak. He died before I could tell him I understood. So I live as if I had, and I hope it reaches him.','He lays a hand on the altar stone. “Tell your father while he can hear it. Tell your children before they stop listening. Then we go down.”']},
  ]},
 'sarachnis':{
  open:[
   'The Forthos crypt. Webs thick as sailcloth, egg sacs in every corner, and the spider queen Sarachnis coiled on the throne.',
   'Her children swarm the walls. She does not move until one of them is threatened. Then she moves very fast.',
   'tyrande: A mother defending her brood. I have no quarrel with that. I have waited ten thousand years for my husband. I understand fierce.',
   'tyrande: But she has taken the crypt, and the dead deserve their rest. Elune’s light, and your blade. Together, as it should be.',
  ],
  opts:[
   {t:'Clear the spawn first. Draw her off the throne.',r:['You cut the little ones from the walls and Sarachnis comes screaming. Tyrande’s moonlight finds the gap in her carapace.','tyrande: You fought beside me, not ahead of me. Malfurion took centuries to learn that. You, one night. I notice these things.']},
   {t:'Go straight for the queen.',r:['She is faster than anything that size has a right to be. You take two bites you will feel for a week and put her down anyway.','tyrande: Reckless. Brave. Both. Let me see the bite. No, hold still. I have tended wounds longer than your people have had a word for them.']},
   {t:'Ask Tyrande how she waited so long.',r:['tyrande: Badly, some nights. I prayed. I worked. I led, because someone had to. And I did not let anyone tell me the waiting was foolish.','She touches your hand, lightly. “Your wife is waiting for you tonight. Not ten thousand years. One evening. Do not make her wait badly.”']},
  ]},
 // ================= The Deep Roads =================
 'keldagrim':{
  open:[
   'Keldagrim. The dwarven city under the mountains east of Rellekka, with a river through it, a palace over it, and eight companies arguing about all of it.',
   'A chaos dwarf stumbles out of a side tunnel, eyes red, and the guards sigh like it happens daily. It does.',
   'magni: Ha! A proper dwarven city. Forges on the river, trade in the square, politics in the palace. Ironforge with better plumbing. Don’t tell them I said so.',
   'magni: Now. Yon chaos dwarf is somebody’s cousin gone wrong. We sort him, then we see what the companies are fighting over. It’ll be gold. It’s always gold.',
  ],
  opts:[
   {t:'Deal with the chaos dwarf.',r:['He is quick and mad and swings a hand cannon. You get the cannon off him and the guards take him somewhere with a bed and a lock.','magni: Done right. No blood on the forge floor. A good smith keeps his workshop clean, and a good man keeps his house the same. Mind that.']},
   {t:'Sit in on the consortium. Learn the trade.',r:['Eight directors, one table, a lot of shouting. You keep your mouth shut and your ears open and leave knowing who actually runs Keldagrim.','magni: Listened, did ye? Good. I was king of Ironforge a long while and the best I ever did was shut up in a meeting. Rare skill. Use it at work.']},
   {t:'Ask Magni what the diamond did to him.',r:['magni: Made me still. Then made me listen. Azeroth herself talks to me now, and she talks like a hurt child. Ye don’t forget that.','He raps his knuckles on his own arm. It rings. “Enough. Forges are lit. Go hammer something honest and I’ll buy the ale.”']},
  ]},
 'dorgesh-kaan':{
  open:[
   'Dorgesh-Kaan, the cave goblin city, lit by lamps the surface has never seen. Lifts, markets, and a hundred goblins who want to know what rain is.',
   'A small goblin tugs your sleeve and asks if the sky is heavy. You do not have a good answer.',
   'wanda: Look at this place. Every light is a question somebody asked. I’d have loved to bring the boys here. They’d have asked ten each.',
   'wanda: The little one wants to know about rain. Tell him. Properly. Children know when you’re giving them the short version.',
  ],
  opts:[
   {t:'Sit down and answer every question the goblin has.',r:['Rain. Clouds. Why birds. Why not more birds. It takes an hour and a crowd gathers. Wanda sits beside you and adds the parts you miss.','wanda: You didn’t rush him once. Do that at bedtime. The questions are the point. The sleep is just what happens after.']},
   {t:'Explore the city. Find out what powers the lamps.',r:['Down a lift, through a workshop, into a cave of glowing moss and a generator that hums like a hive. The engineer is delighted to explain. At length.','wanda: You lit up more than the goblin did. I like watching you learn something for no reason. Tell me about it on the way home. All of it.']},
   {t:'Ask Wanda about the boys.',r:['wanda: Billy and Tommy. I made them a world to grow up in. It wasn’t real. They were. I’d give anything to tuck them in once more, in a real house.','She presses her palm flat to your chest, like she is checking you are solid. “Go home tonight. Be solid for yours. That’s all I ever wanted.”']},
  ]},
 'swamp-caves':{
  open:[
   'The Lumbridge Swamp Caves. Dark, wet, full of gas that goes up if your lamp isn’t shielded, and walls that reach out and grab you.',
   'A wall beast takes a swing at your head from a crack in the rock. It misses. The crack looks innocent again.',
   'fannie: Okay, I have been in a LOT of caves and this is the first one that tried to eat me. Lamp’s shielded. Goggles on. Let’s go fast.',
   'fannie: Not too fast. The gas. Okay, medium fast. Steady fast. You pick the pace, I’ll match it. I always match it.',
  ],
  opts:[
   {t:'Set a steady pace and keep it through the whole cave.',r:['You walk the full loop without once stopping or sprinting. Fannie counts the wall beasts. Seven. You dodge all seven.','fannie: That was a perfect pace. Like, textbook. Boring to watch. I loved it. Same pace tomorrow morning, before work? I’ll knock.']},
   {t:'Hunt the wall beasts. Every crack.',r:['Spiky helmet on, you walk the walls and let them swing. Each one that grabs you gets a very short lesson.','fannie: You walked INTO them. On purpose. You’re insane. I’m into it. Give me the helmet, my turn.']},
   {t:'Ask Fannie why she runs everything.',r:['fannie: Because a map with a line on it is better than a map with a blank. And because I think better moving. And because sometimes you run with me.','She bumps your shoulder with hers, harder than she needs to. “Mostly that last one. Come on, there’s a blank up ahead.”']},
  ]},
 'zanaris':{
  open:[
   'Zanaris. The lost city of the fairies, reached through a shed in Lumbridge Swamp, which is the kind of joke the fairies find hilarious.',
   'Mushroom houses, a market, a fairy queen missing from her throne, and rings in the grass that go everywhere at once.',
   'cal: BD, scan the rings. Please don’t beep at them. He beeped at them. Okay. A whole hidden city with a shed for a door. I’ve lived in worse hideouts.',
   'cal: The queen’s gone and nobody wants to say who took her. I know that silence. The Mantis crew used to go quiet like that before a job went bad.',
  ],
  opts:[
   {t:'Find the queen. Whatever it takes.',r:['The trail runs through three rings and a dark fairy’s hideout. You bring her back to the throne with Cal covering the door and BD-1 narrating.','cal: You didn’t stop asking until somebody answered. That’s the whole job. That’s also, uh, most of marriage, from what Greez tells me. Loudly.']},
   {t:'Help the fairies rebuild the market first.',r:['cal: Good call. People before quests. Cere used to say that and I’d roll my eyes. I don’t roll them anymore.','You spend the day lifting mushroom roofs back onto houses. The fairies pay you in a song you cannot get out of your head.']},
   {t:'Ask Cal how he trusts people again.',r:['cal: Slowly. Then all at once. I hid for five years and the Mantis crew pulled me out in about a week. You just let them, in the end.','BD-1 chirps something. Cal laughs. “He says you’ve got people at home who’d do the same. Don’t make them pull. Just go home and let them.”']},
  ]},
 'tanglefoot':{
  open:[
   'The fairy gardens of Zanaris, gone wrong. Vines through every bed, roots lifting the stones, and in the middle of it all a thing called Tanglefoot.',
   'It was a weed once. Now it is the size of a house and still growing, strangling the gardens from the roots up.',
   'ororo: I know this one. Not by name. Every garden has it. The thing you did not pull when it was small, come back to collect.',
   'ororo: Magic will not fix it. Secateurs will. And a little lightning, if it argues. Take the blade. I will take the sky.',
  ],
  opts:[
   {t:'Cut it back from the roots.',r:['You work the roots with a magic blade while Ororo keeps the vines off you with wind. It fights the whole way and dies honestly.','ororo: Roots first. Always roots first. The mess in a house, the mess in a week. You do not trim the top and call it done. Now you have seen it.']},
   {t:'Call the storm and burn it out.',r:['ororo: As you say. Stand back further than that. Further.','Lightning walks across the garden three times. Tanglefoot is ash. So is a fence, a shed and most of a fairy’s hat. The fairy forgives you, eventually.']},
   {t:'Replant the beds after. Make it a garden again.',r:['You spend the evening on your knees in the dirt with a fairy’s seed bag, Ororo at the next bed over, not talking. It is the best hour of the trip.','ororo: My rooftop in New York, every morning, is exactly this. Nobody sees it. It is mine. Come and see it. I don’t invite many.']},
  ]},
};
