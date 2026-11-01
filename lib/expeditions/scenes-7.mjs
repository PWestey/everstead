// Expedition first-visit scenes, part 7: Troll Country, Zul-Andra, the Deep Wilderness and the Slayer Masters’ Haunts (lib/expedition-data.mjs).
// Same format as lib/expeditions/scenes.mjs. See docs/WRITING-BRIEF.md.
// Scene = {open:[lines], opts:[{t:'player choice', r:[reply lines]}]}.
// A plain line is narration; "<castId>: text" or "player: text" is someone speaking.

/** @type {Record<string,{open:string[],opts:{t:string,r:string[]}[]}>} */
export const EXPEDITION_SCENES={
 // ================= Troll Country =================
 'death-plateau':{
  open:[
   'Death Plateau, above Burthorpe. The trolls on the ridge have run out of insults and started on boulders.',
   'One lands close enough to spray your boots with gravel. The troll who threw it is named Rock. Of course he is.',
   'roy: Did you SEE that? He just picked it up like it was nothing! Okay, okay, I’m not scared, I’m excited. Those are different.',
   'roy: There’s a goat path on the left. The guards said nobody uses it because it’s steep. Steep is good. Steep is training. Come on!',
  ],
  opts:[
   {t:'Take the goat path. Climb straight up.',r:['Your legs are jelly by the halfway mark. Roy is ahead of you, yelling encouragement at a goat.','roy: You didn’t stop! Not even once! That’s the whole thing, you know? You just don’t stop. Tomorrow my legs are gonna hate me and I can’t wait.']},
   {t:'Wait for the boulders to run out. Then move.',r:['Trolls get bored fast. By the time Rock wanders off to find lunch, the ridge is empty and the path is yours.','roy: Huh. I would’ve just run at it. That’s… actually smarter. Don’t tell anybody I said that. Okay, tell everybody, it’s fine.']},
   {t:'Walk up and introduce yourself to Rock.',r:['roy: Wait, what? Okay. Okay! I’m right behind you. Way behind you. Supportively behind you.','Rock squints at you, says your name back wrong, and decides you are too small to be worth a boulder. It is the kindest thing a troll has ever done.']},
  ]},
 'troll-stronghold':{
  open:[
   'The Troll Stronghold, carved into the mountain under a sky the colour of slate. Somewhere inside, two prisoners are waiting on anybody at all.',
   'The front gate is a slab of granite and a sleeping troll. The troll is louder.',
   'magni: Hmph. Honest stonework, I’ll give ’em that. Crooked, but honest. A dwarf would’ve put a door in it. Trolls just hit it till it opened.',
   'magni: Right. Prisoners first, loot after, and we don’t leave till the job’s done. That’s how Ironforge got built, lad. One stubborn shift at a time.',
  ],
  opts:[
   {t:'Find a second way in. Trolls only ever guard one.',r:['Magni taps the cliff with his knuckles until one patch rings hollow. Ten minutes with a pick and you are inside, behind the guards.','magni: See that? Ye didn’t charge the big door like a hero. Ye found the crack and worked it. Any smith’ll tell ye that’s where the real work gets done.']},
   {t:'Go for the prisoners first, straight through.',r:['You come down the stair swinging. The trolls are big and slow and surprised. The prisoners are in the lowest cell, cold and very glad to see a dwarf.','magni: Good man. Ye said prisoners first, and ye did prisoners first. Half the kings I’ve met couldn’t hold a plan through lunch.']},
   {t:'Ask Magni about Moira.',r:['magni: My daughter. We didn’t speak for years, and that was my doing, not hers. Pride’s a cold thing to go to bed with. I know, I was a diamond for a while.','He clears his throat. “Yer own wee ones, whatever ye said last, go back an’ say the next thing. Don’t let the silence set like mortar.”']},
  ]},
 'weiss':{
  open:[
   'Weiss. A troll town buried in snow at the top of the world, with a wall, a gate, and a very polite sign asking you to go away.',
   'Inside, trolls are chopping wood and arguing about soup. Nobody has thrown anything at you yet. It is unsettling.',
   'deadpool: Okay, a troll town that just wants to be left alone? Relatable. My apartment has the same sign and nobody respects it either.',
   'deadpool: Nobody’s attacking us, which means either they’re nice or we’re the plot twist. I vote nice. I never vote nice. Write this down.',
  ],
  opts:[
   {t:'Help with the woodpile. Earn a seat by the fire.',r:['You chop till your hands blister and a troll named Snowflake grunts approval. It is the warmest you have been in days.','deadpool: Look at you. Chores. Voluntarily. You know I’ve had the same stack of dishes since I was legally alive? I’m gonna go home and… think about them. Progress.']},
   {t:'Find out what Weiss actually needs.',r:['The town is low on firewood, high on snow, and the old chieftain wants a word with Burthorpe that does not involve a rock. You carry the message.','deadpool: Diplomacy. With trolls. In a blizzard. Honestly this is the healthiest thing I’ve done all year and I didn’t even stab anybody. Yet. The day is young.']},
   {t:'Ask Wade why he keeps joking.',r:['deadpool: Because the alternative is being a guy whose face looks like a dropped lasagna, alone in a bad apartment, and quiet. I don’t do quiet. Quiet gets in.','He kicks a snowdrift. “That’s the one serious thing you get. Keep your place warm and keep people in it. Now let’s go find the soup, {name}.”']},
  ]},
 'neitiznot':{
  open:[
   'Neitiznot, the Fremennik island out past Rellekka. Yaks in every yard, snow on every roof, and a bridge the ice trolls keep walking across like they own it.',
   'The jarl is gone and his wife is keeping the whole place running on stubbornness and salted fish.',
   'briget: Oh, I adore this. A jarl who leaves and a wife who holds the whole island together. I want to bring her flowers. Does one bring flowers to a Fremennik?',
   'briget: And a bridge the trolls keep crossing. Darling, every home has a bridge like that. You either mend it or you learn to love the trolls.',
  ],
  opts:[
   {t:'Mend the bridge with the islanders.',r:['Rope, yak hair, half a longboat for planks. By sunset the bridge has a gate and the trolls have a grievance.','briget: You spent a whole day fixing someone else’s bridge without being asked. When did you last do that at home? Do it this week. I’ll know if you don’t.']},
   {t:'Sit with the jarl’s wife. Hear the whole story first.',r:['She talks for an hour. Her husband left to fight the trolls and sends word twice a year. She keeps his chair at the table anyway.','briget: Twice a year. Twice. If you ever leave me a chair and a letter twice a year, I shall burn the chair. Write to your wife more than the jarl does. It is a low bar.']},
   {t:'Take Briget to see the yaks.',r:['briget: The yaks? Oh, you are terrible and I am going. Hold my hand, the ice is dreadful. Hold it anyway, actually, the ice is fine.','A yak eats her ribbon. She laughs so hard she has to lean on you, and then she does not stop leaning.']},
  ]},
 'ice-troll-king':{
  open:[
   'The ice caves under Neitiznot. The troll king sits on a throne of frozen boat parts and has not stood up in living memory.',
   'His children have crossed the bridge for years. He just sits there and sends them. Something in you does not like that.',
   'grog: BIG CHAIR. Big guy in it. He’s just sitting? Why’s he sitting? I never sit. Sitting makes your legs sad.',
   'grog: I bet I can lift him AND the chair. Not the point? Okay. What’s the point? Oh. Hit him. Yeah. I like that point.',
  ],
  opts:[
   {t:'Fight the king on his throne.',r:['He finally stands and the cave shakes. Grog laughs with pure joy. You take turns, two swings each, and the king sits back down for good.','grog: WE DID A LIFT. A king lift! Darrow’s gonna be so jealous. Hey, you were out of breath. That’s good. Out of breath means you did a thing.']},
   {t:'Go after the trolls on the bridge first. Save the king for last.',r:['One at a time, troll by troll, until the bridge is empty and the king is alone in his cave. He looks smaller without them.','grog: Smart. Like Vex smart. Pike says I should do things in order. I don’t. But you did! Order! Can we hit the big one now?']},
   {t:'Ask Grog why the sitting king bothers him.',r:['grog: My uncle just sat around and sent us out to hurt people. Never went himself. A dad who sits? Nah. You stand up for your little ones. Even when they’re big ones.','He cracks his knuckles, which echoes. “That’s all I got. I’m not good at wise. Let’s go stand him up, {name}.”']},
  ]},
 // ================= Zul-Andra =================
 'port-tyras':{
  open:[
   'Port Tyras, at the bottom of Tirannwn. King Tyras marched his army into elf country, built a camp, and never marched it home.',
   'The soldiers drill in the rain. Their boots are rotting and their lines are perfect.',
   'leia: Posted to the end of the world with no supply line and no orders. I’ve run bases like this. The trick is nobody gets to feel sorry for themselves.',
   'leia: Look at the quartermaster. He’s counting arrows he doesn’t have. That’s the one holding this camp together. Let’s make his day easier.',
  ],
  opts:[
   {t:'Help the quartermaster sort the camp.',r:['Ledgers, crates, a fish stall that owed the army a month of catch. By dusk the books balance for the first time in a year.','leia: Nobody writes songs about the man who fixed the inventory. I’ve commanded enough to know which one keeps people alive. Do your boring work. It counts.']},
   {t:'Drill with the soldiers. Show up in the rain.',r:['You run the line until your legs stop asking questions. The sergeant says nothing, which from a Tyras guard is a medal.','leia: You stood in the rain next to men who didn’t know you. That’s how you earn a room. Han never figured that out. Luke took about ten years.']},
   {t:'Ask Leia how she kept a rebellion fed.',r:['leia: I didn’t. A thousand people I never thanked did, one crate at a time. I just made sure every crate had somewhere to go. That’s leadership. It’s mostly logistics.','She tucks a wet strand of hair back and looks at the camp. “Your work has a crate that needs somewhere to go. Go find it, General.”']},
  ]},
 'poison-waste':{
  open:[
   'The Poison Waste. A forest once, elf country, green to the horizon. Now black water, red spiders, and a smell that gets into your clothes.',
   'The elves will not say what happened here. The ground says it for them.',
   'morgana: They poisoned their own garden and walked away from it. I know the look. I wore it for a thousand years. Pride, then shame, then silence.',
   'morgana: Nothing here is beyond grace. Not the water, not the elves, not the spiders. Stay close to me. The air lies.',
  ],
  opts:[
   {t:'Clear the red spiders from the old road.',r:['They come in swarms, and Morgana’s chains sing through them. By the end the old elven road is visible again under the muck.','morgana: Cruel work, and you did it without cruelty. That matters more than you know. A road is a small mercy. Someone will walk it home.']},
   {t:'Find clean water and plant something.',r:['One spring, deep in, still runs clear. You carry the water to a patch of ground and set a single seed in it. It is almost nothing.','morgana: Almost nothing. That is what a prayer looks like from the outside. You do it anyway, every day, and a forest comes back a thousand years later. Or sooner.']},
   {t:'Ask Morgana what she walked away from.',r:['morgana: A sister. A war in heaven over who deserved mercy. I said everyone. She said no one. I lost, and I fell, and I would fall again for the same answer.','Her wings fold around you both against the wind. “Whoever you have not forgiven this week, do it before the ground goes black. It goes quickly.”']},
  ]},
 'zul-andra-shrine':{
  open:[
   'The Shrine of Zul-Andra. Torches on poles in the marsh, a wooden dock, and priests who paint their faces and keep the boats ready for the serpent.',
   'One of them is carving a new oar. He has carved, by his count, four hundred. The god eats boats too.',
   'soraka: Listen. They hum while they work. Four hundred oars and they still hum. Mortals do that. It is one of the things I gave up the stars to be near.',
   'soraka: Their god takes and takes. Ours gives. I would like to show them the difference, gently, and I would like your hands to help.',
  ],
  opts:[
   {t:'Carve an oar with the priest.',r:['Your first oar is lopsided. Your second is less so. The priest hums and you catch yourself humming back.','soraka: You made something with your hands for no reason but the making. Keep a thing like that at home, a little hobby that hums. It keeps the heart from going quiet.']},
   {t:'Heal the priests the serpent has bitten.',r:['Soraka kneels in the mud. Starlight pools in her palms and the venom leaves one priest after another. You hold the lamp. It takes all night.','soraka: Thank you for staying. Most people watch the first one and wander off. You held the light until the last. That is a kind of prayer too, you know.']},
   {t:'Ask Soraka if she misses the sky.',r:['soraka: Every night. Then someone brings me a child with a fever and I forget for a while. Missing something and choosing something else can live in the same chest.','She touches your cheek with one cool hand. “You chose a village and a bed and a morning routine over a hundred wilder things. I see you. The stars do too.”']},
  ]},
 'serpent-pools':{
  open:[
   'The Serpent’s Pools, behind the shrine. Snakelings in every shallow, and the shallows go down a lot further than the word suggests.',
   'A boat is tied to the dock. Someone has carved “good luck” into the side, and then crossed it out.',
   'samira: Oh, I like this place. Everything in it wants to kill us and the lighting is fantastic. Try to keep up, handsome. I don’t slow down for an audience.',
   'samira: Rules. Don’t stand in the water. Don’t stand still. And if you’re going to fall in, fall in with style. I will be grading.',
  ],
  opts:[
   {t:'Take the pools fast, with Samira.',r:['She goes in guns first, laughing. You go in after her, and for ten loud minutes the two of you are the most dangerous thing in the swamp.','samira: Now THAT was a date. You’re sweating. Good. I only trust a man who sweats. Come back tomorrow, I want to see if you can do it twice.']},
   {t:'Clear the shallows methodically. One pool at a time.',r:['Pool, then the next pool, then the next. The snakelings never get to swarm. By the end the dock is quiet and your boots are dry.','samira: Careful and thorough? Boring. Effective, though. After ten years of wild, careful might be what I want next. Don’t make it weird. Buy me a drink.']},
   {t:'Ask Samira what she’s chasing.',r:['samira: The next rush. Always was. Then I met a man who did the same boring workout every morning for a year and wasn’t chasing anything. Couldn’t stop thinking about him.','She holsters a pistol and leans in, close enough that you can smell gunsmoke. “Keep your morning routine, {name}. Then come find me. I’ll be the rush.”']},
  ]},
 'zulrah':{
  open:[
   'Zulrah rises out of the pool at the end of the world. Green, then red, then blue. A rhythm older than the priests who feed it.',
   'The sacrificial boat rocks. The serpent opens one eye at you and opens its mouth at the whole boat.',
   'riven: Three forms. One pattern. It changes, you move. Simple to say. Simple is not easy. I broke a sword learning that.',
   'riven: Here is the only training that ever worked for me. Don’t beat the serpent. Beat the next form. Then the next. Count them. Never count the end.',
  ],
  opts:[
   {t:'Learn the pattern. Move before it changes.',r:['Green, east. Red, south. Blue, west. You miss once and the cloud eats a year off your life. You do not miss again.','riven: You read it. Most people fight the serpent in front of them and die to the one behind. You fought the pattern. That’s all discipline is. Reading. Then moving.']},
   {t:'Hold your ground and trade blows.',r:['It is loud and brave and nearly kills you twice. On the third form you finally learn to step, and the serpent sinks.','riven: Stubborn. I was that. It took a whole army dying around me to learn to step aside. You learned in two forms. Cheaper tuition. Take it.']},
   {t:'Ask Riven about the broken blade.',r:['riven: It was whole once. So was I. I serve what I broke now, one morning at a time, with reps nobody counts. Not glory. Not forgiveness. Just the next rep.','She looks at you longer than she means to. “You know that already. I see it on you. Keep going. I would like to see what you become.”']},
  ]},
 // ================= The Deep Wilderness =================
 'rogues-castle':{
  open:[
   'Rogues’ Castle, in the far north of the Wilderness. A ruin full of thieves guarding chests they robbed from each other last week.',
   'Every rogue has a knife and a plan. The plans are all the same plan. Nobody has thought past the chest.',
   'garona: Thieves with no discipline. They steal, they drink, they get stolen from, they call it a life. I had masters like that. I killed them.',
   'garona: We go in, we get what we came for, and we don’t stop to drink with anyone. Keep your eyes on your goal. Mine were on mine for twenty years.',
  ],
  opts:[
   {t:'Go in quiet. Take the chest, leave the rogues.',r:['Garona moves through the ruin like smoke. You follow her shadow exactly. The chest is open and you are gone before a single knife is drawn.','garona: Clean. No fight you didn’t need. That’s what focus looks like. Most people confuse it with anger. Anger is loud. Focus is quiet and leaves.']},
   {t:'Take the whole castle, room by room.',r:['Rogue after rogue, until the last one surrenders from behind a curtain. The chests are yours. All of them. Most contain other chests.','garona: Thorough. Exhausting. Fine. Now you have a castle of junk and a sore arm. Next time decide what you came for and stop when you have it. Even at work.']},
   {t:'Ask Garona what freedom was like at first.',r:['garona: Terrifying. Nobody told me what to do and I nearly fell apart. So I made my own orders. Wake, train, eat, work, sleep. Same every day. The chain I chose.','She checks the hall both ways, then meets your eyes. “You have chains like that. Good ones. Don’t let anyone, even me, talk you out of them.”']},
  ]},
 'scorpion-pit':{
  open:[
   'The Scorpion Pit, a crack in the Wilderness floor. The sides crawl with scorpions and the bottom is Scorpia, who is all of their mother.',
   'The climb down is a rope somebody left. The rope has opinions about your weight.',
   'quinn: Valor’s circling. He says the pit goes deeper than it looks and the big one’s awake. He also says you’re slow. He says that about everyone.',
   'quinn: Pace yourself. It’s not a sprint, it’s a scout. Down, hit, up, breathe. I’ve done sixty-mile patrols on less rest than you had last night. Let’s go.',
  ],
  opts:[
   {t:'Climb down and face Scorpia head on.',r:['The pit floor is a nest. Scorpia lunges, her little ones swarm, and Valor dives screaming through the middle of all of it.','quinn: You held your breathing the whole fight. I was watching. That’s not strength, that’s training. Somebody taught you to keep going when it burns. Keep it.']},
   {t:'Work the rim first. Thin the swarm.',r:['You and Quinn walk the edge for an hour, picking off scorpions as they climb. By the time you go down, Scorpia is alone.','quinn: Patient. Valor approves, which is rare. He approves of me and fresh rabbit. Patient hunters eat. The rest run out of arrows.']},
   {t:'Ask Quinn how she keeps going on the long patrols.',r:['quinn: Every morning I thank Valor, I thank Demacia, and I thank my legs. Out loud. Sounds stupid. On day six of a patrol it’s the only thing that works.','She whistles the eagle down to her glove. “Say thank you tomorrow morning. Anything. The legs listen better after.”']},
  ]},
 'venenatis-web':{
  open:[
   'The Web of Venenatis. East of the Wilderness, a whole forest spun shut in silk, and a spider the size of a barn sitting in the middle of it.',
   'Every strand hums when the wind moves. It would be beautiful if it were not also a pantry.',
   'kay: Nix. Nix, no. We are not touching the shiny web. I know. I know it’s shiny. Sorry, he gets like this. Giant spider, by the way, so, great.',
   'kay: I’ve been in worse. Honestly, this is kind of homey? No, it’s not. I just miss my ship. Let’s burn a path and get out before she notices.',
  ],
  opts:[
   {t:'Burn a path straight to the spider.',r:['Fire, silk, and a shriek like torn metal. Venenatis drops from above and Nix bites her on the one leg that matters.','kay: Nix! Good boy! Okay, that was a lot. I usually run from things that size. You just walked in. Remind me to be on your side forever.']},
   {t:'Cut the web carefully. Save the forest under it.',r:['Strand by strand, you and Kay cut silk until trees show through. Nix carries the scraps off to build something in the corner.','kay: Look at that. There was a forest under all that mess. I’m building a place to come back to, and it’s got a lot of silk on it too. Guess I start cutting this week.']},
   {t:'Ask Kay about the place she’s building.',r:['kay: It’s nothing yet. A room, a cot, a window Nix can sit in. Nobody’s ever waited for me anywhere. I want to find out what that’s like.','She bumps your shoulder with hers and leaves it there a second. “You’ve got a place people wait at. Take care of it. Then maybe show me how.”']},
  ]},
 'bone-yard':{
  open:[
   'The Bone Yard. Graves to the horizon, most of them old, some of them new, and Vet’ion walking the rows with a shovel and a grudge.',
   'He is not burying anyone. He is counting. Every so often he stops at a stone and nods, like he knew them.',
   'jean: He’s grieving. All of it. I can feel it from here, it’s like standing next to a furnace. Whoever he was, he lost a lot of people and never put it down.',
   'jean: I’ve taught children who carried that. The trick isn’t making them put it down. It’s standing close enough that they don’t carry it alone.',
  ],
  opts:[
   {t:'Fight Vet’ion in the graves.',r:['He comes at you with the shovel and a scream that cracks headstones. Jean lifts the bones around you both and holds them still. He goes down among his own dead.','jean: He’s quiet now. Really quiet. Thank you for not making it cruel. Scott would have. He’d have called it mercy. You didn’t need to call it anything.']},
   {t:'Lay the restless graves to rest first.',r:['Row by row, you right the fallen stones and read the names where you can. Jean walks beside you with her eyes closed, listening.','jean: Every name you read, something settled. I could feel it. Your kids won’t remember you did this. They’ll just be calmer. That’s most of fatherhood.']},
   {t:'Ask Jean what the children at the school needed most.',r:['jean: Someone to see them. Not fix them, not frighten them. Just look right at them and say “I know you.” Scared kids can tell the difference in a second.','She takes your hand without looking, warm and sure. “Yours can tell too. Tonight, look right at them. Then come tell me about it.”']},
  ]},
 'callisto':{
  open:[
   'The frozen plateau in the far north. Callisto stands in the snow, taller than a house, and his eyes are the wrong kind of sad for a bear.',
   'He was a man once. Something in the way he looks at the two of you says he remembers what two people standing together looks like.',
   'victra: Gods, he’s enormous. And miserable. I’ve met senators with that exact face. At least the bear’s honest about it.',
   'victra: A husband once, I’d wager. Something took him from it. If anything tries that with Sevro I will burn the sky down. Stand up straight, we’re being watched.',
  ],
  opts:[
   {t:'Fight the bear with everything you have.',r:['Callisto charges. The plateau shakes. Victra fights like a Julii, all teeth and laughter, and the bear finally kneels in the snow and goes still.','victra: You didn’t flinch when he roared. Good. I have no use for men who flinch. Sevro would’ve howled back. You just stood there. I may like that more.']},
   {t:'Try to reach the man inside first.',r:['You say the old word for “friend” the druids taught you. The bear stops. Just for a breath. Then it is a bear again, and it is grief, and you finish it gently.','victra: Soft. I expected to hate that. I didn’t. Soft men bore me, but you were soft on purpose, with a blade in your hand. That is a different animal entirely.']},
   {t:'Ask Victra why she married a goblin.',r:['victra: Because he loves out loud. No games, no waiting to see what I’d do first. He said what he wanted and kept saying it. Most men whisper. Sevro howls.','She steps close, gloved fingers flat on your chest. “Go home and tell your wife what you want. Loudly. If you need practice, {name}, I am a demanding audience.”']},
  ]},
 // ================= The Slayer Masters’ Haunts =================
 'smoke-dungeon':{
  open:[
   'The Smoke Dungeon, under the Kharidian desert. A facemask, a lit lantern, and smoke so thick the devils inside breathe it like air.',
   'Something in the dark laughs with four mouths. The lantern flickers. You check the mask straps again.',
   'bruce: Okay. Okay. Breathe slow, through the mask. I’m counting. Not for you, for me. The other guy doesn’t like smoke and I don’t like the other guy.',
   'bruce: Smoke devils go for the light. So we keep the lantern steady and we don’t rush. Rushing is how I lose a lab. Or a city block. Slow and careful.',
  ],
  opts:[
   {t:'Go slow. Clear the dungeon one chamber at a time.',r:['Chamber, lantern, breathe. Chamber, lantern, breathe. The devils come one at a time and go down one at a time, and nobody turns green.','bruce: That was… that was really good. Nothing happened! That’s my favourite outcome. Steady work, nothing on fire. I should frame it.']},
   {t:'Rush the nest while the lantern holds.',r:['You sprint the tunnel with the light swinging. The devils swarm, Bruce yells something that is not quite a word, and the big one goes down just as the lantern dies.','bruce: Don’t. Do that. Again. Please. I had to count to a hundred. I know, it worked. Lots of things work until they don’t. Ask Harlem.']},
   {t:'Ask Bruce how he keeps the other guy quiet.',r:['bruce: Routine. Tea, notes, the same wake-up time every day, even when the world’s ending. Especially then. It sounds dull. Dull is the whole point. Dull is the fence.','He adjusts his glasses and looks at your lantern. “What’s your fence? The thing you do every day so the rest doesn’t get out? Keep it up. Mine saved a lot of people.”']},
  ]},
 'the-abyss':{
  open:[
   'The Abyss. Not a place so much as the gap between places. Everything is purple and wet and the leeches drift like thoughts you were trying not to have.',
   'The Zamorakian mages who sent you here looked far too pleased about it.',
   'morgana: I know this darkness. Not this one exactly, but its cousins. It wants you to feel lost so you’ll stop looking for the door. There is always a door.',
   'morgana: Stay in the light I carry. Not because the dark is evil. Because you are tired, and tired men follow leeches.',
  ],
  opts:[
   {t:'Fight through the leeches to the nearest rift.',r:['They come in waves, fat and whispering. Morgana’s chains cut through them and you follow the light until a rift opens into cold, blessed air.','morgana: You kept walking. In the dark, with things on your back, you kept walking toward a door you couldn’t see. That is what I call faith. Nothing fancier.']},
   {t:'Sit still. Let the Abyss show you what it wants.',r:['You stop. The leeches gather. The whispering turns into a voice that sounds like your own worst morning. Morgana says nothing and holds the light.','morgana: There. You heard it and you didn’t follow it. Most never find out they could do that. Whatever that voice says tomorrow at dawn, you already beat it once.']},
   {t:'Ask Morgana what she whispers when she prays.',r:['morgana: “Not yet.” Every night for a thousand years. Not yet to despair, not yet to giving up on her, not yet to becoming what she said I was. It is enough.','She draws you against her for a moment, warm in all that cold. “Find your two words. Say them on the bad days. I will be listening.”']},
  ]},
 'stronghold-slayer-cave':{
  open:[
   'The Stronghold Slayer Cave, under the gnome trees. Nechryaels prowl the lower chambers, and every one you cut down spits out two little death spawn to finish the job.',
   'A gnome at the entrance hands you a tally sheet. The record is 212. The gnome does not say who set it.',
   'roy: Two hundred and twelve! Who did that?! Okay, I’m not competitive. I’m a little competitive. We’re beating that. We are beating that today.',
   'roy: The little ones come out after the big one goes down. So it’s like… a combo! Big one, two little ones, breathe, next! I love this already.',
  ],
  opts:[
   {t:'Go for the record. Big one, two small, next.',r:['Nechryael, spawn, spawn, next. By the hundredth your arms are shaking and Roy is counting out loud. At 213 the gnome drops his tea.','roy: WE DID IT! You were dying at 150, I saw you, and you kept going! That’s the stuff! That’s the exact stuff! What are we beating tomorrow?!']},
   {t:'Fight clean, not fast. Protect your energy.',r:['You take each one properly, never letting the death spawn get behind you. The tally is lower and your legs still work at the end.','roy: You didn’t even try for the record? You just did it right? That’s… huh. My gran says that. “Do it right, Roy.” Okay. Doing it right. Starting tomorrow. Probably.']},
   {t:'Ask Roy why he left the island.',r:['roy: Because my dad never did. He’s great! He’s just… there. Same beach, same boat, every day. I wanted to be the strongest somewhere he could hear about it.','He gets quiet, then grins. “You do the dad stuff AND the training. Both. That’s way harder than a gym badge. Don’t tell anybody I said that, {name}.”']},
  ]},
 'cerberus-lair':{
  open:[
   'The Lair of Cerberus, under Taverley. Hellhounds first, a long dark stair, and at the bottom a dog with three heads guarding a door that does not want to be guarded.',
   'The air smells of brimstone and, strangely, of something cooking. Anna Marie sniffs it and frowns.',
   'annamarie: Hellhounds. Sugar, I have had a whole life of trouble and I still don’t care for a dog that’s on fire.',
   'annamarie: Three heads, one dog. I grew up in a house with four kids and one supper table, so trust me, this is manageable. Mind my gloves. Mind yours, too.',
  ],
  opts:[
   {t:'Fight through the hounds to Cerberus.',r:['The hounds come howling and go down. Cerberus is bigger than the stories, and all three heads are angry at once. Anna Marie takes one. You take two.','annamarie: Well, look at you. You took the ugly heads and left me the cute one. That’s manners. That’s a man who sets the table before he sits.']},
   {t:'Find out why Cerberus is guarding the door at all.',r:['A soul, bound to a key. The dog is not angry. It is tired. You take the key out of its mouth and all three heads sigh and lie down.','annamarie: Darlin’, you walked into hell and found a dog that needed some rest. That’s the whole of keeping a home. Somebody’s tired. You notice. You fix it.']},
   {t:'Ask Anna Marie about the open porch door.',r:['annamarie: Because I can’t touch anybody without hurtin’ ’em, so I feed ’em instead. Door’s open, tea’s sweet, there’s a chair. Nobody leaves my porch hungry or alone.','She tugs one glove tight and gives you a long look. “You keep a door open at home? Good. Someday I’d like to walk through it. Supper’s on me, {name}.”']},
  ]},
 'abyssal-sire':{
  open:[
   'The Sire’s nexus, in the deepest fold of the Abyss. Four tentacles, four respiratory vents, and the father of every abyssal demon snoring in the middle of it.',
   'He is asleep. He has been asleep for an age. The vents breathe for him. Waking him is the whole task, and the worst idea anyone has had today.',
   'garona: We wake him, we disorient him, we strike while he staggers. Then he gets up, and we do it again. And again. The pattern is the fight. Learn it.',
   'garona: I spent years hunting men who were awake and ready. A sleeping thing that fights back is just honest. I prefer honest.',
  ],
  opts:[
   {t:'Follow Garona’s pattern. Vents, stagger, strike, repeat.',r:['Vents. He stirs. You hit while he reels. He rises. Vents again. The third cycle he does not get up.','garona: Perfect repetition. Nothing clever, nothing wasted. Every cycle like the last. You know who fights like that? Someone with a morning routine. Don’t deny it.']},
   {t:'Try to end it fast, before he fully wakes.',r:['You go for the heart while he is still rising. He wakes all at once and the room goes white. Garona drags you clear by the collar and you start over, properly.','garona: Haste. I told you the pattern is the fight. You tried to skip it. Every man who ever owned me tried to skip the pattern too. Now get up, and do it right.']},
   {t:'Ask Garona what she holds on to.',r:['garona: Nothing. No one. For a long time. Then I found I could hold on to a rule. Mine. Not a master’s. Wake, train, eat, work. The rule held when nothing else did.','She wipes abyssal ichor from her blade and looks at you sideways. “Your rules are kinder than mine. Keep them anyway. The Sire is waking. Pattern.”']},
  ]},
};
