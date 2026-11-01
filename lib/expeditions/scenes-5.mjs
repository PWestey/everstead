// Expedition first-visit scenes, part 5: Misthalin, Crandor, Tirannwn and Darkmeyer (lib/expedition-data.mjs).
// Same format as lib/expeditions/scenes.mjs. See docs/WRITING-BRIEF.md.
// Scene = {open:[lines], opts:[{t:'player choice', r:[reply lines]}]}.
// A plain line is narration; "<castId>: text" or "player: text" is someone speaking.

/** @type {Record<string,{open:string[],opts:{t:string,r:string[]}[]}>} */
export const EXPEDITION_SCENES={
 // ================= Misthalin =================
 'varrock-sewers':{
  open:[
   'The Varrock Sewers. A manhole behind the east bank, a ladder slick with something, and a smell that gets into the wool.',
   'Rats the size of dogs. Spiders the size of rats. Moss giants somewhere further on, by the sound of it.',
   'bruce: Okay. Deep breaths. Low light, close walls, that’s fine. I’ve worked in worse labs. I had a tin roof in Calcutta for a year.',
   'bruce: Just, if a spider jumps at my face, give me a second before you say anything. The other guy doesn’t love surprises.',
  ],
  opts:[
   {t:'Clear the spiders room by room.',r:['You go slow. Torch up, blade ready, one chamber at a time. The red spiders go down before they get anywhere near Bruce’s face.','bruce: That was… tidy. Method. I like method. You do the same thing at your desk, I bet. One thing, finished, then the next. Works down here too.']},
   {t:'Ask Bruce what he’s writing in that notebook.',r:['bruce: Pulse. Breathing. What set me off, what didn’t. Boring stuff. Boring is how I stay me. Seven years of boring notes and no cities flattened.','He tucks the pencil behind his ear and nearly stabs himself with it. “Anyway. Keep a log of something. It’s how you catch yourself slipping.”']},
   {t:'Head for the moss giants. Get it over with.',r:['The giants are big and slow and there are three of them. The third gets a hand on Bruce and his eyes go green for half a second.','bruce: I’m fine. I’m fine. Tea when we get out. Chamomile. You’re buying. Fastest I’ve ever hit the brakes, and you didn’t even flinch. Good.']},
  ]},
 'stronghold-of-security':{
  open:[
   'The Stronghold of Security, under the Barbarian Village. Four floors down, and every door asks you a question before it opens.',
   'A goblin pokes you with a spear and asks who you’d give your password to. The spear is less worrying than the quiz.',
   'hermione: Oh, this is wonderful. A dungeon that tests whether you’ve been paying attention. I’d have built one myself if the Ministry would fund it.',
   'hermione: The questions get harder lower down. The monsters too, honestly. Ankous on the fourth floor. I’ve read about them. I have not met them.',
  ],
  opts:[
   {t:'Answer every door honestly. No guessing.',r:['Floor by floor the doors ask about passwords, strangers, promises. You answer straight and the doors open straight.','hermione: You didn’t guess once. Most people guess. I used to think clever was the point. It isn’t. It’s doing the small right thing when nobody but a door is watching.']},
   {t:'Skip the questions. Find a way around.',r:['There isn’t one. You spend twenty minutes proving there isn’t one while Hermione leans on the wall with her arms folded.','hermione: Finished? Lovely. I did say. Honestly, you remind me of Ron. Go on, scowl. I married him, so take it as a compliment.']},
   {t:'Ask Hermione why she came down here with you.',r:['hermione: Because you asked. And because I needed one afternoon that wasn’t a committee. Also I wanted to see the ankous. That’s three reasons. I like lists.','On the fourth floor she takes your hand before the last door, doesn’t explain it, and doesn’t let go for the whole fight.']},
  ]},
 'wizards-tower':{
  open:[
   'The Wizards’ Tower, on its island south of Draynor. Books to the ceiling, a lot of beards, and a basement that hums through the floorboards.',
   'A wizard in blue asks if you’ve come about the runes. Nobody has come about anything else in a hundred years.',
   'magni: Och, feel that? The hum. That’s the stone talkin’. Ever since the diamond I hear it everywhere. Most folk just hear a draught.',
   'magni: Books’ll tell ye what a rune is. The rock’ll tell ye what it wants tae be. Let’s go down and ask it.',
  ],
  opts:[
   {t:'Go down to the basement and find the hum.',r:['Under the tower, a rune essence portal flickers between the shelves. The hum is a mine’s worth of stone, waiting to be shaped.','magni: There she is. Raw essence. Doesnae do a thing until somebody hauls it to an altar and puts the work in. Same as every job I ever had. Same as yours.']},
   {t:'Help the wizards with their reading. There’s a lot of it.',r:['You spend an afternoon sorting scrolls by age. Magni reads one aloud in a dwarf’s idea of a wizard voice and a very old man laughs for the first time in years.','magni: Hah! Paperwork. Dinnae tell Brann I did paperwork. Still, somebody keeps the ledger or the forge goes cold. Ye’ll know that one from yer own desk.']},
   {t:'Ask Magni what it’s like, hearing the planet.',r:['magni: Loud. Lonely, some days. Like bein’ the only one at the table who can hear the host. But the smithin’ helps. Hands busy, head quiet.','He knocks on the tower wall with a diamond knuckle. “Find a thing ye make with yer hands, lad. Doesnae matter what. The hum goes quieter.”']},
  ]},
 'edgeville-dungeon':{
  open:[
   'Edgeville Dungeon. A trapdoor in a ruined house, a ladder, and then the smell of hill giants and old bones.',
   'Somewhere further in is a shrine that is definitely cursed and definitely not something you should touch.',
   'kate: Okay, Lucky, stay. No, stay. He’s coming. Great. One-eyed dog in a giant dungeon, this is going to go so well.',
   'kate: Trick with big guys is distance. I shoot, you get hit, we both get credit. Kidding. Mostly. Here, hold the torch, I need both hands.',
  ],
  opts:[
   {t:'Take the giants head on while Kate shoots.',r:['The first giant swings a club the size of a door. You duck inside it and Kate puts three arrows in its shoulder before it finishes the swing.','kate: See? Teamwork. You tanked a hill giant. Clint would be impressed, and he doesn’t do impressed. I do. I’m impressed. A little. Okay, a lot.']},
   {t:'Clean out the bones. Make the place less awful.',r:['You and Kate stack bones, kick out the rubbish, and prop up a wall that was going to fall on somebody. Lucky helps by eating something.','kate: I know. Who cleans a dungeon. But you ever come home to a place you fixed? Feels different. Fix the squeaky door at yours this week, trust me.']},
   {t:'Ask Kate about Lucky’s eye.',r:['kate: Tracksuit guys. Long story, pizza was involved. He’s fine. He’s better than fine, he’s the best boy in New York. Aren’t you? Aren’t you.','Lucky licks your hand. Kate watches this happen and says, quietly, that he doesn’t do that for just anybody.']},
  ]},
 'bryophyta':{
  open:[
   'The end of the Varrock Sewers, behind a mossy door. Bryophyta, the moss giantess, has been growing here since before the city had a wall.',
   'The floor is spongy. Something is budding. The air tastes like a houseplant nobody watered.',
   'deadpool: Oh wow. Okay. So my apartment has a situation under the sink that looks exactly like this, and I’ve been calling it “Steve.”',
   'deadpool: Big moss lady, loves the damp, hits like a wet mattress full of bricks. I’ve dated worse. Shall we?',
  ],
  opts:[
   {t:'Fight her straight up. Blade work.',r:['She is slow and she is enormous and every hit grows back a little. You keep cutting until the regrowth stops keeping up.','deadpool: Look at those forearms go! Somebody’s been doing their push-ups! I can tell, because I never do mine and look at me. Don’t look at me.']},
   {t:'Cut the vines first. Stop the regrowth.',r:['Each time she sprouts a spore, you slash it before it roots. Deadpool narrates like a sports announcer who has been drinking.','deadpool: Smart! Kill the source, not the symptom. That’s what Al says about my laundry pile. Al’s blind, by the way. She still knows about the pile.']},
   {t:'Ask Wade about the thing under his sink.',r:['deadpool: Fine, it’s mold. It’s a lot of mold. I keep meaning to deal with it and then a guy needs stabbing and the week’s gone. You know how it is.','He pulls a sponge out of a pouch that should have held grenades. “Tell you what. You take the giantess, I’ll go home and scrub. Trade? Trade.”']},
  ]},
 // ================= Crandor =================
 'port-sarim':{
  open:[
   'Port Sarim. Tar, salt, gulls, and a row of taverns with the same three sailors in all of them.',
   'Captain Ned has a ship, a grudge against Crandor, and no intention of sailing anywhere near it.',
   'tavi: He’s already said no twice. That’s fine. The first two noes are just finding out how much he wants to be asked.',
   'tavi: I talked a Canim warmaster into an alliance once with less than this. Kitai says it was the Canim’s idea. She is wrong, and I will never win that argument.',
  ],
  opts:[
   {t:'Let Tavi talk. Watch how he does it.',r:['He doesn’t argue. He asks the captain about his old ship, his old crew, the island. By the third drink Ned is asking what time you want to sail.','tavi: Never push on the thing they’ve dug in on. Find the thing they already want. Works on captains. Works on First Lords. Works on my wife, about once a year.']},
   {t:'Buy the captain a drink and make the case yourself.',r:['You keep it short. The dragon, the crew that died, the chance to go back on his own terms. He stares at his rum a long time and says fine.','tavi: You didn’t oversell it. Good. People can smell a pitch. You told him the truth and let him come to it. Do that at work and you’ll end up running the place.']},
   {t:'Ask Tavi how he and Kitai argue without it getting ugly.',r:['tavi: Loudly. Then we go after the thing instead of each other. Took years. She throws things, I use long words. The trick is we’re on the same side of the table.','He turns his cup. “Next time you two disagree about something at home, sit next to her, not across. Sounds stupid. Try it.”']},
  ]},
 'melzars-maze':{
  open:[
   'Melzar’s Maze, north of Rimmington. A wizard went mad in here and the house went with him. Every door needs a key and every key is in a worse room.',
   'Zombies on the ground floor. Ghosts upstairs. Something laughing in the basement, and it isn’t Melzar.',
   'rumi: Ugh. This place is loud. Not loud loud. Like a song in the wrong key, under everything. I can’t turn it off.',
   'rumi: Sorry. Occupational thing. Demon hunter ears. Okay. Keys, doors, don’t touch the walls. I’ve got your back. And a vocal warm-up, if it helps.',
  ],
  opts:[
   {t:'Work through the rooms in order. Key by key.',r:['Red key, orange, yellow. Each room is worse and each key is in it. By the blue door you are moving like you have done this before.','rumi: You didn’t skip a single one. That’s how I rehearse. Scales, every day, even the ones I hate. Boring is how you get good. Don’t tell my fans I said boring.']},
   {t:'Ask Rumi to sing. See what it does to the maze.',r:['She hesitates, then sings two bars, low. The ghosts upstairs stop drifting. The laughing in the basement goes quiet.','rumi: Okay. That worked. Don’t make a big thing of it. It’s a hobby that happens to also exorcise things. Everyone should have one. The hobby part, I mean.']},
   {t:'Ask Rumi what the song under everything is saying.',r:['rumi: Nothing nice. The same thing it says to everyone with something to hide. I’ve got a lot of practice ignoring it. Some days more than others.','She finds your hand in the dark hallway and squeezes it once. “Thanks for not asking what I’m hiding. Ask me another day. I might even tell you.”']},
  ]},
 'entrana':{
  open:[
   'Entrana. The holy island. The monks search you at the dock and take every blade, every bow, every sharp thing, and they are polite about it.',
   'Inside there are gardens, a glassblower, and a quiet so complete that your boots sound rude.',
   'ariane: I left my staff on the boat. I feel a bit naked without it. Sorry, that came out wrong. I mean I’m used to having something to hold.',
   'ariane: It’s lovely here, though, isn’t it? The light’s different. The Tower never had light like this. Shall we just… walk?',
  ],
  opts:[
   {t:'Walk the island with her. No plan.',r:['You walk. Past the chapel, past the beehives, down to the beach where the water is almost clear. Neither of you says much, and it isn’t awkward.','ariane: This is what prayer feels like when it goes right. Just being somewhere with your hands empty. You could do this at home. Five minutes, before the day starts.']},
   {t:'Sit in the chapel for a while.',r:['The monks don’t mind. Ariane sits one place along from you, then after a bit, closer. The candle burns down a finger’s width.','ariane: I didn’t expect you to sit that long. Most people get restless. You didn’t. I like that about you. I might like a lot about you, actually.']},
   {t:'Ask Ariane why she left the Wizards’ Tower.',r:['ariane: They wanted me to be brilliant. I wanted to be useful. There’s a village with a chapel that needed its lamps lit. So I went and lit them. Less glamorous. Better.','She tucks her hair back and looks at you. “If you ever want help lighting something, I’m good at it. The lamps, I mean. Also, not only the lamps.”']},
  ]},
 'crandor-shore':{
  open:[
   'The Crandor shore. The ship grinds onto black sand and the volcano stands over everything, breathing a little.',
   'Hobgoblins on the ridge. Ash on the wind. Somewhere inland, a cave that goes down.',
   'hera: Hull’s fine. Just a scrape. I’ve put the Ghost down on worse ground with a Star Destroyer behind me. This is a beach.',
   'hera: All right. Ridge first, then the cave. Stay in sight. I’ve lost people on rocks like this, and I don’t plan on losing you.',
  ],
  opts:[
   {t:'Climb the ridge and clear the hobgoblins.',r:['The climb is loose ash and worse footing. You take the ridge at a run, three hobgoblins at the top, and the fourth decides to go home.','hera: You ran up that. In this air. I had Zeb for that kind of thing and he complained the whole way. Keep your legs like that. Jacen would make you race him.']},
   {t:'Secure the ship first. Make sure there’s a way home.',r:['You and Hera drag the boat higher, tie it off twice, and stack stones so you can find it in the dark. It takes an hour. It is the right hour.','hera: Good. Always know how you get home before you go anywhere. That’s captain stuff. It’s also parent stuff, turns out. Same instinct.']},
   {t:'Ask Hera about Jacen.',r:['hera: Green eyes, his father’s grin, and he already thinks he can fly. He can’t. I let him sit in the chair anyway. You have to let them sit in the chair.','She checks the lashings again, mostly for something to do with her hands. “Go home after this. Let yours sit in the chair. Whatever the chair is.”']},
  ]},
 'elvarg':{
  open:[
   'The cave under Crandor’s volcano. A wall, a door, and behind it the green dragon that burned the island.',
   'Elvarg lifts her head. The heat arrives before the fire does.',
   'roy: A DRAGON. An actual dragon! I’ve only seen one in a book, and the book was wrong about the smell.',
   'roy: Okay okay okay. Shield up. The fire’s the thing, right? Everything else is just a big lizard. A big lizard. I’m ready. I think I’m ready.',
  ],
  opts:[
   {t:'Shield up and meet the fire.',r:['The first breath hits the shield like a wave. Your arm goes numb. You step in under the second breath and get the blade where it counts.','roy: You walked INTO it! Nobody walks into it! I’m gonna train so hard after this. Push-ups every morning. Starting tomorrow. Starting today. Right now, hang on.']},
   {t:'Tire her out. Make her chase you.',r:['You run the cave in circles. Elvarg is fast but old and angry, and angry gets tired. When she slows, you turn.','roy: That was like a gym match. Dodge, dodge, dodge, then hit when they’re gassed. You’ve done this before. Not the dragon. The running. It shows.']},
   {t:'Ask Roy if he’s scared.',r:['roy: Yeah. Loads. My mom said that’s fine, being scared is just your body getting ready. She said a lot of stuff before I left. I think about it when it gets like this.','He grips the shield till his knuckles go white, then grins anyway. “My mom prays before my matches. Says it works at a distance. Bet someone’s doing that for you. Let’s go.”']},
  ]},
 // ================= Tirannwn =================
 'isafdar':{
  open:[
   'The Isafdar forest. Elven country. Tripwires between the roots, pits under the leaves, and Mourners in gas masks walking the only paths.',
   'The trees are old enough to have opinions. The light comes down green.',
   'alleria: Stop. Left foot. There is a wire across the path at the height of your shin. Lift. Good. Now listen, and do not step where I have not stepped.',
   'alleria: I have hunted forests older than this one. The traps are not clever. They only need you to be careless once.',
  ],
  opts:[
   {t:'Follow exactly in her footsteps.',r:['Three hours. You never once put a foot where she didn’t. Two wires, a pit, a spiked branch that would have taken your head. None of them go off.','alleria: Not one. Do you know how rare that is? Attention is a muscle. You have one. Most people let theirs go slack by noon and call it a long day.']},
   {t:'Take down the Mourners on the path.',r:['Two of them, masked and sure of themselves. Alleria’s arrow takes the first before he hears the string. You deal with the second close and quiet.','alleria: Clean. You waited for my shot. Centuries with the Farstriders and I can count the men who waited on one hand. I may need the other hand now.']},
   {t:'Ask Alleria how she keeps her focus so long.',r:['alleria: I decided, a very long time ago, what mattered. Everything else is noise. It is not a gift. It is a habit I practise the way you draw a bow. Daily.','She touches the leaf of a tree that has been dead a hundred years and still stands. “Put your phone in a drawer tonight. See how long you can hear the forest.”']},
  ]},
 'lletya':{
  open:[
   'Lletya. An elf village folded into the trees where the trees agreed to it. Lanterns, looms, and a harp playing from somewhere you can’t see.',
   'Arianwyn says he has been expecting you. Elves say that to everyone. It still works.',
   'mira: Okay, stop. Do you hear the harp? Listen to the timing. That’s a seven count. Nobody does a seven count. I need to find whoever that is.',
   'mira: Sorry. Rehearsal brain. This place is quiet in a way that makes me want to move. Which is weird. Come on, I want to see all of it.',
  ],
  opts:[
   {t:'Find the harpist with her.',r:['The harpist is an elf older than the village with nine fingers. Mira sits at her feet and counts under her breath for an hour. Then she dances, once, on the moss.','mira: I needed that. I’ve been choreographing other people’s songs for months. You forget what it feels like to do it just for you. Don’t forget. Whatever yours is.']},
   {t:'Help the elves mend the lanterns and the walkways.',r:['Rope, resin and a lot of climbing. The walkways sing a little when they are strung right, which is how the elves check the work.','mira: You fix things. Properly. Not the way the girls fix things, which is put it in a drawer. Your place must be nice. Is your place nice? I’m asking for a reason.']},
   {t:'Ask Mira why she guards her rehearsal time so hard.',r:['mira: Because if I don’t, there’s no me left by Friday. Rumi gets the fans, Zoey gets the words, I get a locked studio for two hours. It’s how I stay sharp. And kind, honestly.','She leans back against the tree beside you, closer than she needs to. “Lock a door for yourself sometime. Then maybe unlock it for me.”']},
  ]},
 'underground-pass':{
  open:[
   'The Underground Pass. A tunnel from West Ardougne to the elf lands that nobody has walked quickly. Dark, wet, long, and the spiders in here have names.',
   'Something called Kalrag lives near the bottom. Something worse lives below Kalrag.',
   'keyleth: Okay. Okay. I can’t feel any growing things down here. That’s fine. That’s normal for a cave. It’s just usually there’s moss or, or lichen, or something.',
   'keyleth: Sorry. I’m fine. Vox Machina went through worse and I only cried a little. Stay close, don’t touch the webs, and if I turn into a bear, that’s on purpose.',
  ],
  opts:[
   {t:'Push through the whole pass without stopping.',r:['Hours. Ledges, rope bridges, a chamber of swinging blades. Keyleth keeps a light going on her palm and you keep moving until the dark finally thins.','keyleth: We did it. We actually did it. My legs are, um, not legs anymore. How are you still walking? You train, right? That’s what that is. I should train.']},
   {t:'Deal with Kalrag. End the spiders at the source.',r:['Kalrag is the size of a cart and fast. Keyleth goes bear halfway through and the fight is suddenly a lot shorter.','keyleth: Was that too much? That was too much. I panicked. Well, I bear-panicked. Thank you for not running. People run. You just, you stayed.']},
   {t:'Ask Keyleth what she holds onto in a place like this.',r:['keyleth: The Ashari say the wind doesn’t stop just because you can’t feel it. So I breathe, and I figure it’s still out there, and I’m still part of it. It’s a small faith. It fits in a cave.','She lets the light on her palm go a little brighter and leans into your shoulder. “What’s yours? The thing you breathe when it’s dark. Keep breathing it.”']},
  ]},
 'prifddinas':{
  open:[
   'Prifddinas. The crystal city, rebuilt after a thousand years in the dark. The walls sing a little when the sun hits them.',
   'Beneath it, in the mines, a stone golem called Zalcano throws rocks at anyone who comes for the ore.',
   'carol: Okay, this is the prettiest city I’ve ever seen, and I’ve seen Hala. Don’t tell the Kree I said that. Actually, do.',
   'carol: Golem in the basement, though. Figures. Every nice place has a basement. Let’s go see what she’s throwing.',
  ],
  opts:[
   {t:'Go straight down and fight Zalcano.',r:['The mine is all light and falling rock. Zalcano hurls boulders, you mine the glowing ore and throw it back, and the golem cracks one piece at a time.','carol: Pickaxe, throw, dodge, repeat. You didn’t get fancy. Every pilot I ever trusted did the checklist the boring way. You’d have made the program.']},
   {t:'Learn the crystal singing from the elves first.',r:['An elf shows you how to sing a seed into a bow. It takes all afternoon and your voice cracks on the last note and the bow comes out anyway.','carol: You spent four hours making a thing you could have bought. I get it. Maria and I used to rebuild engines that worked fine. You need a thing like that. Keep it.']},
   {t:'Ask Carol about the time she kept getting back up.',r:['carol: Which time? Flight school, the bike, the bar in Louisiana. Every time I went down somebody told me I didn’t belong. I got up anyway. Got good at it. Still am.','She bumps your shoulder with hers, not gently. “Whatever you fell off this week. Back on it tomorrow. I’ll know if you don’t. I’ve got a face for knowing.”']},
  ]},
 'hunllef':{
  open:[
   'The Gauntlet, beneath Prifddinas. A ring of crystal rooms, a timer nobody can see, and a corrupted beast at the centre called the Hunllef.',
   'You go in with nothing. No armour, no weapon, no food. Everything you fight with, you make in there.',
   'kira: Oh, I love this. No gear, no backup, just you and whatever you can scrape together. This is every Tuesday I had on Nar Shaddaa.',
   'kira: Clock’s running. Fish, chop, mine, build, then the big guy. Move. And when it starts stomping, you jump. I’m not carrying you out.',
  ],
  opts:[
   {t:'Gather fast, build well, then fight.',r:['Ore, bark, fish, herbs. You build a bow and a bit of armour out of crystal with the minutes left, and the Hunllef finds you ready, which annoys it.','kira: You prepped. Properly. Most people rush in half-built because the clock scares them. The clock scares everybody. You did the work anyway. That’s the whole trick.']},
   {t:'Dodge the stomp. Make it miss you forty times.',r:['The floor tiles light up before it stomps. You read them, step, step, step, and the beast wears itself out trying to catch you.','kira: Your footwork’s decent. Decent! From me, that’s a parade. Keep running stairs or whatever you do, it shows. I notice. I notice a lot.']},
   {t:'Ask Kira what she outran.',r:['kira: A voice in my head that wasn’t mine. Long story. Short version, I trained every day until I was louder than it. It’s still there. It just lost.','She twirls the saber hilt once and catches it without looking. “Yours is quieter than mine. Train anyway. Then come find me. I spar better with people I like.”']},
  ]},
 // ================= Darkmeyer =================
 'slayer-tower':{
  open:[
   'The Slayer Tower, north of Canifis. Three floors of crawling hands and banshees, and on the top floor the abyssal demons stop pretending.',
   'A gargoyle on the stairs stares at you like it has all week. It does.',
   'bruce: So. Demons. Specifically the kind that teleport behind you. I want to say upfront that this is not an ideal environment for me.',
   'bruce: But I’ve been doing the work. The breathing, the counting. Tony calls it my “little yoga.” I call it the reason Tony still has a tower. Let’s go up.',
  ],
  opts:[
   {t:'Take the floors one at a time. No rushing.',r:['Hands, then banshees, then the long stair. You clear each floor before you climb and Bruce never once has to close his eyes.','bruce: Floor, done. Floor, done. That’s the whole method. You know you run your week like that? I’ve seen your list. It’s a good list. Stay on it.']},
   {t:'Go straight for the abyssal demons.',r:['The demons blink in behind you and Bruce’s shirt goes tight across the shoulders. He breathes. Counts. You take the first demon before he gets to four.','bruce: Four. I got to four. Last year I wouldn’t have made two. And you didn’t stop to check on me. You trusted the count. Thanks for that. Really.']},
   {t:'Ask Bruce what he counts.',r:['bruce: Primes, mostly. Then the elements if the primes aren’t working. Then Betty, once, and that’s a bad sign. It’s a system. Everybody needs a boring system.','He adjusts his glasses, which are already straight. “Whatever your version of counting is, do it before the hard thing. Not during. Before.”']},
  ]},
 'slepe':{
  open:[
   'Slepe. A fishing town on the Morytanian coast where everybody fell asleep one night and never got up. Doors open. Bread going green on the tables.',
   'The priests in the church are the only ones awake, and they look like they haven’t been for long.',
   'ariane: Oh. Oh, that’s awful. Look, they were halfway through supper. Someone set two places and then just… didn’t finish.',
   'ariane: There’s something feeding on them. Light helps, a bit. I’ll keep one going in the church. You see if anyone can be woken. Gently.',
  ],
  opts:[
   {t:'Go house to house. Try to wake who you can.',r:['Most don’t stir. One old woman does, for a minute, and asks you to finish her washing before she drops off again. You finish her washing.','ariane: You did her washing. I saw. You have no idea how much that is. Keeping a house going for somebody who can’t. That’s most of what love is, I think.']},
   {t:'Help Ariane hold the light in the church.',r:['You sit with her through the night. The lamp gutters twice and you both reach for it at the same time and your hands land together.','ariane: Sorry. Not sorry. Um. The light held because there were two of us. I’ll say it plainly, since it’s dark: I liked sitting up with you.']},
   {t:'Ask Ariane what she thinks is eating the dreams.',r:['ariane: Something that only has power while people sleep through their lives. That’s what it looks like from here. I’ve met people it got without any monster at all.','She lifts the lamp a little higher. “Wake up for your morning, {name}. Properly. Pray, stretch, whatever it is. Don’t let anything get a meal out of you.”']},
  ]},
 'darkmeyer-streets':{
  open:[
   'The Streets of Darkmeyer. The vampyre capital, all black stone and silk. Nobody here walks. They glide, and the Vyrewatch on the rooftops notice anyone who doesn’t.',
   'You are wearing a stolen noble’s cloak. It is a size too big and smells of somebody else’s perfume.',
   'tavi: Shoulders back. Don’t look up at the Vyrewatch, they count that. You are bored and important and you belong here. Kitai would laugh herself sick at us.',
   'tavi: I spent two years in the Legions as a nobody with a borrowed name. Being someone else is easy. Staying yourself while you do it, that’s the trick.',
  ],
  opts:[
   {t:'Play the part. Walk the whole city without a fight.',r:['Three streets, the arena, the market where the goods are things you don’t look at. The Vyrewatch glance down and glance away. You belong.','tavi: Not one of them looked twice. You held it for an hour. Holding a face for an hour is a discipline. Holding your temper at a dinner table is the same one.']},
   {t:'Drop the act when a Vyrewatch gets too close.',r:['It gets close. You get closer. The fight is short and ugly and over before the rooftops notice, and Tavi drags you into a doorway.','tavi: Well. That was one way to do it. Max would have done exactly that. Max is also missing part of an ear. Next time, breathe first. Then stab.']},
   {t:'Ask Tavi what Kitai would say about the cloak.',r:['tavi: She’d say I look like a Citizen who lost a bet. Then she’d steal it. Then she’d wear it to bed to annoy me. And I’d let her, because that’s the whole marriage, honestly.','He straightens your collar like a man who has done it for a wife a hundred times. “Go home and let her win one. On purpose. It’s cheaper than you think.”']},
  ]},
 'ver-sinhaza':{
  open:[
   'Ver Sinhaza. The castle above Slepe, Lord Drakan’s own, and under its foundations the nylocas are swarming. Thousands of them.',
   'The ground hums. The walls drip. Something in the dark says “Verzik” like a prayer.',
   'kira: Okay. Spiders. Lots of spiders. Little ones, big ones, ones that change what they are halfway through biting you. Fun.',
   'kira: Rule one, don’t stand still. Rule two, match the colour. Blade the green, shoot the blue, hit the white with whatever’s left. Rule three, I already said. Move.',
  ],
  opts:[
   {t:'Hold the chokepoint and let them come.',r:['A doorway, two of you, a tide of legs. You swap stances as the colours change and your arms are jelly by the time the last one stops twitching.','kira: Your arms are shaking. Good. That’s the fun kind. Eat something when we’re out, actual food, and sleep. Recovery is half of it. I learned that the stupid way.']},
   {t:'Push through fast. Don’t let the swarm build.',r:['You don’t stop to fight what you can outrun. Kira keeps pace with a grin and the swarm never quite closes behind you.','kira: You’ve got legs on you. I notice legs. Professionally. Keep running wherever you run and I’ll keep noticing. That’s the deal.']},
   {t:'Ask Kira what she’d tell a kid about fear.',r:['kira: That it’s not a stop sign, it’s a gauge. Shows you the thing matters. My Master taught me that, right before sending me into something I was scared of. He was right. I hate that.','She shrugs, sharper than she means to. “You’ve got kids? Tell them that. Then go be scared of something with them. They’ll remember the with.”']},
  ]},
 'the-nightmare':{
  open:[
   'The Sisterhood Sanctuary, below Slepe. The Nightmare of Ashihama lies here in a bed of its victims’ dreams, and it is not asleep so much as waiting.',
   'The air thickens. Shapes move at the edge of sight. Somewhere a child is laughing in a way that children should not.',
   'malfurion: I know this one. Not this creature. This kind. I spent ten thousand years in a dream that turned rotten around me, and I did not notice for too long.',
   'malfurion: Tyrande kept the world while I slept. Every night. Alone. I will never make that right. But I can make sure this thing does not do it to anyone else.',
  ],
  opts:[
   {t:'Fight it through every form it takes.',r:['The Nightmare spawns husks, parasites, a copy of your own face. You keep swinging at the real one. Malfurion’s roots pin it long enough to end it.','malfurion: You did not chase the copies. Good. The Dream was full of copies. I chased every one, and that is how I lost a century.']},
   {t:'Wake the dreamers first. Then face it.',r:['You and the archdruid go cot by cot, calling names, shaking shoulders. Half the town comes up gasping. The Nightmare, starved, comes at you angry and thin.','malfurion: Weaker. You starved it by waking them. There is a lesson in that for every man who has ever let a house sleep around him. I include myself.']},
   {t:'Ask Malfurion what he said to Tyrande when he woke.',r:['malfurion: Nothing clever. “I am sorry. I am here.” Then I stayed. That was the only part that counted. Ten thousand years of words would not have.','He plants his staff and the ground goes green under it, even here. “Go home tonight and be there, {name}. Not near her. There. The rest follows.”']},
  ]},
};
