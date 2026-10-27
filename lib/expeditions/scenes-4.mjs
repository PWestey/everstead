// Expedition first-visit scenes, part 4: Kandarin, Great Kourend and the God Wars Dungeon (lib/expedition-data.mjs).
// Same format as lib/expeditions/scenes.mjs. See docs/WRITING-BRIEF.md.
// Scene = {open:[lines], opts:[{t:'player choice', r:[reply lines]}]}.
// A plain line is narration; "<castId>: text" or "player: text" is someone speaking.

/** @type {Record<string,{open:string[],opts:{t:string,r:string[]}[]}>} */
export const EXPEDITION_SCENES={
 // ================= Kandarin =================
 'ardougne-market':{
  open:[
   'East Ardougne’s market square. Silk, spice, cake, and a guard on every corner pretending not to watch the stalls.',
   'A pickpocket bumps you, apologises, and walks off with nothing. He looks genuinely confused about it.',
   'vin: He went for your left pocket. Amateur. Reen would’ve clipped him for that. I moved your purse before he got close.',
   'vin: Look, I don’t steal anymore. Mostly. But I can still read a square. The baker’s short-changing. The silk man is honest. The guards are bored.',
  ],
  opts:[
   {t:'Help the baker. Honest work, honest pay.',r:['You haul flour, mend the stall, and the baker pays you in coin and a loaf still warm.','vin: Huh. You just did a shift. No trick, no angle. Elend would like you. I think I might too, don’t let it go to your head.']},
   {t:'Catch the pickpocket. Teach him something.',r:['You find him behind the stalls. He is fourteen and hungry. You buy him a pie and show him how a lock actually works.','vin: That’s… not what I expected. Nobody did that for me at his age. Okay. Okay, that was good.']},
   {t:'Ask Vin to show you how she reads a crowd.',r:['vin: Fine. Watch hands, not faces. Faces lie. Hands tell you who’s nervous, who’s rich, who’s about to run.','You spend an hour watching hands. By the end you spot the next pickpocket before Vin does. She pretends not to be impressed.']},
  ]},
 'grand-tree':{
  open:[
   'The Grand Tree. A whole gnome city grown into one trunk, with gliders launching from the top like paper darts.',
   'King Narnode frets on his throne. The tree is dying, and his head gardener Glough has a smile you do not trust.',
   'quill: Okay, a city in a tree. Groot is gonna be so jealous. Don’t tell him. Actually tell him, I want to see his face.',
   'quill: The gardener guy’s lying. I know lying. I was raised by a blue guy who lied for a living and he lied better than this.',
  ],
  opts:[
   {t:'Follow Glough. Find out what he’s hiding.',r:['You tail him to a locked room full of maps and a very angry note about “filthy humans.” Case closed.','quill: Called it. See, the thing about liars is they always keep receipts. Yondu taught me that. Then he stole my receipts.']},
   {t:'Help the king first. The tree is dying.',r:['You dig out the roots and find the stone that is poisoning them. The gnomes cheer in a pitch only dogs should hear.','quill: Look at you, saving the tree. Very Groot of you. He’d give you a thumbs up. He’s got one thumb. It’s a whole thing.']},
   {t:'Take a glider. For science.',r:['quill: YES. Okay, hold the bar, lean into it, and do not scream, it scares the gnomes.','You scream. The gnomes are scared. The landing is terrible and you want to go again immediately.']},
  ]},
 'camelot':{
  open:[
   'Camelot Castle, north of Seers’ Village. Banners, a round table, and Merlin stuck inside a crystal on the top floor.',
   'The knights have formed a committee about it. The committee has formed a subcommittee.',
   'steve: Knights of the round table. I read about these guys in a library on Flatbush Avenue when I was nine. Never thought I’d meet one.',
   'steve: Merlin’s in a crystal, Mordred’s got the sword that breaks it, and the knights are arguing about who holds the ladder. Let’s go.',
  ],
  opts:[
   {t:'Go get the sword from Mordred.',r:['Mordred’s fort is cold and loud. You take the blade off him the hard way and bring it back before the subcommittee adjourns.','steve: That’s how you do it. Nobody said it would be easy. They just said it was right. The crystal cracks first swing.']},
   {t:'Ask Steve about Peggy. He went quiet when the knights mentioned a vow.',r:['steve: I promised her a dance. Then I put a plane in the ice for seventy years. Keeping a promise late is still keeping it. I think about that a lot.','He turns the shield over in his hands. “Whatever you promised someone at home, go dance. Don’t wait for the ice.”']},
   {t:'Sit at the round table. Just for a second.',r:['A knight clears his throat. You stay seated anyway. Steve sits next to you.','steve: Round table. No head, no foot. Everyone equal, everyone accountable. Bucky would’ve hated it. I kind of love it.']},
  ]},
 'yanille':{
  open:[
   'Yanille, the walled town at the edge of the ogre lands. The wizards on the Watchtower keep a shield up. Most nights.',
   'Tonight an ogre is testing the south gate with his head. The gate is losing.',
   'ragnar: Big fellow. Thick skull. Among my people we would call him “cousin.” I was bred to break walls like that one. I prefer to mend them now.',
   'ragnar: A home is only a home if the door holds. Come, {name}. The wizards may keep their shield. We will keep the gate.',
  ],
  opts:[
   {t:'Brace the gate with Ragnar.',r:['You set your shoulder beside his. The ogre hits. The gate holds. The ogre sits down, confused, and eventually wanders home.','ragnar: Good. Brute strength is nothing. Strength that stays is everything. Your family has a door like this. You are the brace.']},
   {t:'Climb the Watchtower and fix the shield.',r:['The wizards are missing one crystal. You find it in a goblin’s pocket, which is exactly where everyone said it would be.','ragnar: Now the wall sings again. I like a wall that sings. Among the Obsidian we would have written a poem. A short one. We are not patient poets.']},
   {t:'Go out and talk to the ogres.',r:['ragnar: Ha! Yes. Nobody talks to the ogres. Everyone fights the ogres. Let us be the strange ones.','The ogre chief wants Yanille’s wizards to stop turning his hunters into chickens. It is a fair complaint. You pass it along.']},
  ]},
 'kraken':{
  open:[
   'Kraken Cove, west of Piscatoris. The water is black, the boat is small, and something very large is moving under both.',
   'Tentacles the size of trees rise around the hull and the fishermen on the shore stop pretending to fish.',
   'vannaka: Kraken. Big one. I assign this task to maybe three people a year, and two of them come back saying it was “too wet.”',
   'vannaka: Rules are simple. Hit the tentacles first. Then the head. Don’t fall in. If you fall in, don’t bother coming back to my dungeon.',
  ],
  opts:[
   {t:'Take the tentacles one at a time.',r:['Four tentacles. Four fights. The last one nearly tips the boat and you hang on to the mast with your knees.','vannaka: Methodical. Good. Most of ’em panic and swing at everything. You did the task the way the task wants doing.']},
   {t:'Go straight for the head.',r:['The head rises. It has an opinion of you. You drive the spear in between its eyes and the sea goes still.','vannaka: Reckless. Worked. Don’t make a habit of it. Actually, make a habit of the part where it worked.']},
   {t:'Ask Vannaka why he keeps doing this.',r:['vannaka: Somebody’s got to send people at the things in the dark. Better it’s someone who checks they came back. Now stop chatting and hit the tentacle.','He writes your name in his book without looking up. It is the closest thing to a compliment he owns.']},
  ]},
 // ================= Great Kourend =================
 'wintertodt':{
  open:[
   'The Wintertodt camp, far north of Kourend. Four braziers, a dozen pyromancers, and a cold that gets into your teeth.',
   'The Todt howls over the wall. The braziers gutter. Someone shoves a bundle of kindling into your arms.',
   'dumbledore: Fascinating. A creature that is simply cold, held off by people who simply keep a fire lit. There is a lesson there, I expect. I am ignoring it for now.',
   'dumbledore: Chop, light, feed the brazier, repeat. Do not stop to admire anything. I did. Twice. My eyebrows will recover.',
  ],
  opts:[
   {t:'Take a brazier and keep it lit. No matter what.',r:['The Todt throws snow. The brazier dies. You light it again. It dies. You light it again. On the fourth time, it stays.','dumbledore: You simply kept going. Do you know how rare that is? I knew a brilliant boy who could never do it. I was that boy, for a time.']},
   {t:'Help the pyromancer who collapsed.',r:['dumbledore: Yes. The fire can wait. He can’t. I have a potion for cold in my left pocket. Or my right. Possibly my hat.','The pyromancer wakes up coughing and furious about her brazier. She is fine. The brazier is less fine.']},
   {t:'Ask Albus why he came to the cold.',r:['dumbledore: Because I was warm at home, and young, and had a letter from a friend that I should not have answered. Sometimes a man needs a wall and a fire and a job to do.','He stacks the kindling neatly. “Go home to your fire, {name}. Keep it lit. It is the whole trick.”']},
  ]},
 'lizardman-canyon':{
  open:[
   'Lizardman Canyon. Shayzien soldiers hold a line of stakes and shields while lizardmen come up the gullies in waves.',
   'The captain has lost two men this morning and has not sat down since.',
   'dalinar: This is a holding action. I have fought a hundred of them. The line only breaks when the men in it decide it already has.',
   'dalinar: I was a different man once. I would have charged and called it glory. Today we hold, and we bring everyone home. Take the left flank.',
  ],
  opts:[
   {t:'Hold the left flank. Do not give a step.',r:['Three waves. Your shield arm goes numb and you hold anyway. The lizardmen break first.','dalinar: You did not move. Not once. Some men are born with that. Most of us have to choose it every morning. Choose it again tomorrow.']},
   {t:'Pull the captain back and make him rest.',r:['He argues. You outrank him by about a foot and he sits. Ten minutes later he is a better captain.','dalinar: Good. A leader who will not rest is a liability dressed as a hero. I know. I was one. Wine was my rest, and it was no rest at all.']},
   {t:'Lead a counter-push up the gully.',r:['dalinar: Then we go together, and we go back together. No one stays in the gully. Say it.','You say it. The push breaks the shaman’s nest and every soldier walks back. Dalinar counts them twice.']},
  ]},
 'catacombs':{
  open:[
   'The Catacombs of Kourend, beneath the castle. The dead of five houses, stacked in the dark, and some of them not staying dead.',
   'At the heart of it, behind an altar, a demon named Skotizo breathes in the shadow.',
   'uther: Hold your light high. Not for the demon. For yourself. A man who cannot see his own hands forgets what they are for.',
   'uther: I have faced worse than this. I have also failed at worse than this. Both are true. We go forward anyway.',
  ],
  opts:[
   {t:'Face Skotizo at the altar.',r:['The demon is enormous and old and laughs at your light. You keep it lit, keep swinging, and the laugh stops first.','uther: The Light is not a weapon. It is a reason to keep swinging. You understood that in there. I have seen paladins who never did.']},
   {t:'Lay the restless dead to rest first.',r:['You go crypt by crypt with Uther, speaking the old words. It takes hours. The dark gets quieter.','uther: Slow, unseen work. Nobody will sing of it. Your children will not know you did it. They will only know the house was peaceful. That is the job.']},
   {t:'Ask Uther what he regrets.',r:['uther: A student I loved, whom I did not stop when I should have. I taught him strength and forgot to teach him patience. Teach your children both.','He says nothing else for a long time. Then he lifts the hammer. “Come. The demon is still there, and so are we.”']},
  ]},
 'mount-karuulm':{
  open:[
   'Mount Karuulm. The ground is hot enough to melt boots, the air stinks of sulphur, and the slayer dungeon in the mountain is worse.',
   'Below, in a vat of green, a hydra regrows every head you cut off and does not seem to mind.',
   'duradel: Boots of stone. Put ’em on. Yes, they’re ugly. Yes, you’ll thank me. I don’t hand out hydra tasks to people I expect to lose.',
   'duradel: It changes shape. Fire, then lightning, then poison. You change with it or it eats you. Simple as any job, really.',
  ],
  opts:[
   {t:'Fight the hydra through every form.',r:['Fire. Lightning. Poison. You swap stance each time it changes and it runs out of heads before you run out of patience.','duradel: That’s a slayer. Not the strongest fella in the room. The one who adapts quickest and keeps his boots on. Task complete.']},
   {t:'Study it first. Learn the pattern.',r:['You watch three cycles from the ledge before you step down. By then you know the hydra better than it knows itself.','duradel: Smart. Most of ’em just jump in. Smart gets old. Old is the whole point of this job.']},
   {t:'Ask Duradel about Shilo Village.',r:['duradel: Jungle, undead, my wife yelling at me to come in for dinner. Best place in the world. You married? Go home for dinner. Hydra’ll keep.','He checks your boots again anyway. “Right. Dinner after. Hydra now.”']},
  ]},
 'great-olm':{
  open:[
   'The Chambers of Xeric, deep under Mount Quidamortem. Puzzle rooms, crab statues, ice demons, and at the very bottom a thing called Olm.',
   'The Great Olm uncoils from the wall. Two hands the size of doors. A head that remembers Xeric.',
   'wiseoldman: Ah, the Olm. I came here once with a full inventory of brews and left with a full inventory of regret. Good times.',
   'wiseoldman: Hands first. Left hand, right hand, then the head wakes up properly. Do not stand in the acid. I say this as a man who stood in the acid.',
  ],
  opts:[
   {t:'Take the hands, then the head. By the book.',r:['Left hand. Right hand. The head rises and screams the old names. You keep to the plan and it goes down in the dust it came from.','wiseoldman: Textbook. I wrote a textbook, you know. Nobody bought it. I should have put a picture of you on the cover.']},
   {t:'Ask the Wise Old Man how he got all those capes.',r:['wiseoldman: One level at a time, young man, and a long time at it. There’s no trick. Well, there’s one trick. I did a bit every day even when I was tired of it.','He adjusts his hat. “Now, the Olm. It is also a bit every day. Just a louder bit.”']},
   {t:'Solve the puzzle rooms first. Slow and clean.',r:['Crabs, keystones, ice. You take each room without a scratch and the Olm finds you rested and annoying.','wiseoldman: Preparation! My favourite word after “bank” and “pie.” The fight takes half as long when you arrive whole.']},
  ]},
 // ================= God Wars Dungeon =================
 'armadyl-eyrie':{
  open:[
   'The God Wars Dungeon, frozen in a mountain. Four armies, one war, nobody ever told them it ended.',
   'Up the grapple and across the ledge, aviansie wheel in the cold air and Kree’arra screams from the eyrie.',
   'ash: Bird Pokémon! Wait. Those aren’t Pokémon. Those are just… really big angry birds. Pikachu, maybe don’t.',
   'ash: Okay. Ranged, right? Like Pidgeot. You don’t run at a Pidgeot, you make it come to you. I learned that the hard way. Twice.',
  ],
  opts:[
   {t:'Take the eyrie with ranged attacks, like Ash says.',r:['Kree’arra dives. You hold the ground, loose bolt after bolt, and the general lands hard enough to shake the ice.','ash: YES! That’s how you do it! See, strategy! Misty said I never use strategy. I’m gonna tell her about this. Twice.']},
   {t:'Climb. Get above the birds.',r:['You scramble the ice wall with the aviansie snapping at your boots and come down on Kree’arra from above.','ash: You CLIMBED it? That’s insane. That’s so cool. Pikachu thinks it’s cool too, he just does that face when he’s worried.']},
   {t:'Ask Ash why he’s still chasing the same dream.',r:['ash: Because I haven’t caught it yet. And because the chasing’s the best part. Every town, every gym, every new friend. You’ve got a thing like that, right? Keep chasing it.','Pikachu nods, then points urgently at the very large bird behind you.']},
  ]},
 'bandos-stronghold':{
  open:[
   'Bandos’ Stronghold. Ogres, orks and goblins packed into one roaring hall, and at the back of it General Graardor, hitting things for fun.',
   'The door is a heap of iron. Someone has hung a sign on it that says “NO.”',
   'sevro: Oh, I like this guy. Big, loud, dumb, hits like a dropship. Reminds me of me before the kids.',
   'sevro: Here’s the plan. There’s no plan. We go in howling and we come out holding whatever’s shiny. The Howlers never needed more than that.',
  ],
  opts:[
   {t:'Go in howling with Sevro.',r:['The hall turns. Sevro howls, you howl, Graardor roars, and for a minute nobody can hear anything at all. Then he goes down.','sevro: HA! You howled! Badly! I love it! Darrow howls worse than that and look what he did. Big things come from bad howling.']},
   {t:'Draw Graardor out of the hall. Fight him alone.',r:['You bang the iron door until the general stomps out, furious, and the rest of the army stays inside laughing at him.','sevro: Smart. I hate smart. Okay, I don’t hate smart. Electra says I should like smart. Fine. Smart. Good job.']},
   {t:'Ask Sevro about the kids.',r:['sevro: Three of ’em. All gremlins. Best thing I ever did and I once stabbed a Praetor. Being a dad’s the fight that doesn’t end. You just keep showing up to it.','He wipes his nose on his sleeve. “Anyway. Ogre general. Let’s go hit him.”']},
  ]},
 'saradomin-encampment':{
  open:[
   'Saradomin’s Encampment, down the rope in the ice. White-winged guards, a chapel of crystal, and a commander drilling them who never seems to miss.',
   'Commander Zilyana looks up from the line, sees who you brought, and goes very still.',
   'saradomin: Zilyana. At ease. I am not here as your god today. I am here with a friend who keeps his promises, and I wanted you to meet him.',
   'zilyana: My lord. Of course. And you must be {name}. He speaks of you. Often. I was beginning to think you were a parable.',
  ],
  opts:[
   {t:'Train with the encampment. Earn the commander’s respect.',r:['Zilyana sets you against her best three. You lose the first, hold the second, win the third on sheer stubbornness.','zilyana: Not elegant. But you got back up each time, and that is the only thing I have ever asked of anyone. Welcome to the line.']},
   {t:'Ask Saradomin why he brought you here.',r:['saradomin: Because order is not a rule. It is people who show up for each other, every day, even in the ice. I wanted you to see it with your own eyes.','zilyana: He says that to all the recruits. He means it every time. That is why we stay.']},
   {t:'Help Zilyana with the wounded.',r:['You spend the afternoon in the crystal chapel binding wings and setting bones. Zilyana works beside you and says nothing for an hour.','zilyana: Thank you. Most who come here come for the fight. You came for the fallen. Come back sometime. I will save you a sword, and a seat.']},
  ]},
 'zamorak-fortress':{
  open:[
   'Zamorak’s Fortress, across the bridge over nothing. The ice walls run with heat, and the demons inside like it that way.',
   'K’ril Tsutsaroth bellows from the throne room. Imps scatter. Something in the air tastes like the Abyss.',
   'anakin: Demons. Heat. Everyone shouting. Feels like a Tuesday. Stay close, don’t get cocky, and don’t listen when the big one starts talking.',
   'anakin: They always start talking. About power. About how easy it’d be. I’ve heard the speech. Trust me, the speech is the trap.',
  ],
  opts:[
   {t:'Rush K’ril before he can start the speech.',r:['You are across the hall before the demon finishes his first word. He is impressed, then he is on the floor.','anakin: Fast. Good. Sometimes fast is right. Obi-Wan would say “sometimes” about four more times. He’d also be right. Annoying.']},
   {t:'Let him talk. Then answer.',r:['K’ril offers you everything. You tell him you already have a village and a bed and people who wait up. He does not have a reply for that.','anakin: You didn’t even flinch. I flinched. I always flinch. Whatever you’ve got at home, hold onto it. Hold tighter than I did.']},
   {t:'Ask Anakin how he keeps his temper here.',r:['anakin: I don’t, mostly. I count. I breathe. I think about who’s waiting for me. It works about half the time. Half is a lot better than it used to be.','He rolls his shoulders. “Okay. Demon. Let’s count to three and go.”']},
  ]},
 'nex':{
  open:[
   'The Ancient Prison, under the whole frozen war. Four sealed doors, four dead guardians, and behind the last one, Nex.',
   'Zaros’ general opens her eyes for the first time in an age and asks, politely, who woke her.',
   'revan: I know what she is. An old loyalty, locked away, still certain she was right. I was her once. I still carry the memory of it.',
   'revan: Here is the truth, {name}. You do not beat a thing like Nex by being stronger. You beat her by knowing who you are when she asks.',
  ],
  opts:[
   {t:'Fight her through every phase. Do not stop.',r:['Smoke. Shadow. Blood. Ice. Each time she changes you change with her, and when the last phase breaks the prison goes silent.','revan: Every phase, and you never lost yourself. That is the whole war, in one room. The rest of it was practice.']},
   {t:'Tell Nex who you are before you draw.',r:['You say your name, your village, the people who wait for you. She listens the way a sword listens. Then she comes at you, and you are ready.','revan: She wanted a stranger to break. You gave her a man who knows his own house. Good. Now finish it.']},
   {t:'Ask Revan what it cost to come back.',r:['revan: Everything, once. Then a little, every day, forever. A choice is not a moment. It is a habit. You know this. You live it. Draw your blade.','The doors behind you seal. Ahead, Nex rises, and Revan steps up beside you without being asked.']},
  ]},
};
