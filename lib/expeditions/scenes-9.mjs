// Expedition first-visit scenes, part 9: the Tombs of Amascut, the Theatre of Blood, the Inferno and the Last Gates (lib/expedition-data.mjs).
// Same format as lib/expeditions/scenes.mjs. See docs/WRITING-BRIEF.md.
// Scene = {open:[lines], opts:[{t:'player choice', r:[reply lines]}]}.
// A plain line is narration; "<castId>: text" or "player: text" is someone speaking.

/** @type {Record<string,{open:string[],opts:{t:string,r:string[]}[]}>} */
export const EXPEDITION_SCENES={
 // ================= The Tombs of Amascut =================
 'path-of-apmeken':{
  open:[
   'The Necropolis, under the desert sun. Down the first stair the air smells of fruit and fur, and something big has been throwing rocks at the walls.',
   'Baboons. Dozens of them. Some hold sticks. Some hold stones. One at the back is the size of a cart and holds a boulder like it’s an apple.',
   'baine: Ba-Ba. The old ones say Apmeken’s children went mad when she was taken. Doesn’t make the rocks any softer.',
   'baine: My father fought something like this in Mulgore. He told me to watch the hands, not the mouth. The mouth is for noise. Hands tell you when the throw comes.',
  ],
  opts:[
   {t:'Draw the big one out. Dodge the boulder, then close in.',r:['Ba-Ba heaves. The boulder lands where you were standing a breath ago, and you are already inside his reach.','baine: Good. You waited for the throw. Most charge early and eat a rock. Same trick works when a little one is mid-tantrum, by the way. Wait for the throw.']},
   {t:'Deal with the little ones first. Sticks and stones hurt.',r:['Thirty baboons is a bad number. You put your back to a pillar and make it twenty, then ten, then just the big one glaring.','baine: Hm. Clearing the small troubles so the big one has nowhere to hide. That’s how I run a council. And a bedtime, truth be told.']},
   {t:'Ask Baine what Cairne would have made of this place.',r:['baine: He’d have laughed. Then he’d have asked why a god’s children were left alone long enough to go mad like this. Children do what they see, {name}.','He shoulders his totem. “Yours see you. Make sure what they see is worth copying. Now, the one with the boulder.”']},
  ]},
 'path-of-scabaras':{
  open:[
   'The Path of Scabaras. Stone panels that light when you step on them, a wall of glyphs, and scarabs the size of dogs rattling in the dark.',
   'Somewhere past the puzzles, Kephri the scarab queen sits in her hole and lets her dung beetles do the fighting.',
   'thalyssra: Light panels. Matching tiles. An obelisk that wants a specific order. Whoever built this was bored, brilliant, or both.',
   'thalyssra: I rebuilt Suramar from a plan on a napkin. We can solve a hallway. Don’t step on anything until I’ve counted it.',
  ],
  opts:[
   {t:'Let Thalyssra plan. Step where she says.',r:['She counts, mutters in Shalassian, and points. You step. Nothing explodes. Six panels later the door grinds open.','thalyssra: See? Ten minutes of counting saves an hour of scarabs. Try it at your desk tomorrow. Plan first, then touch things. I’ll check.']},
   {t:'Skip the puzzle. Break the wall.',r:['The wall is old and the mace is new. It comes down in a cloud of dust and furious beetles.','thalyssra: Well. That was not elegant. It was fast, though. I’ll allow it. Once. And I’ll admit I enjoyed watching you swing.']},
   {t:'Go straight for Kephri. The queen is the problem.',r:['Kephri ducks into her shell and the beetles come in waves. You crack the shell three times before she stops hiding.','thalyssra: You went to the source instead of swatting at symptoms. That is leadership. Exhausting, sticky leadership, but still.']},
  ]},
 'path-of-het':{
  open:[
   'The Path of Het. A beam of light runs down the hall, mirrors on pivots, and a statue that needs the beam to hit it just right.',
   'Akkha waits past the mirrors. A guardian who blinks from corner to corner and changes what he’s weak to every few breaths.',
   'liadrin: Light through mirrors. Angled, bent, aimed. I knelt in front of the Sunwell once and asked it to do exactly this for me. It said no, for a while.',
   'liadrin: Line up the mirrors. Then we deal with the one that dances. He’s fast. The Light is faster, if you stop second-guessing it.',
  ],
  opts:[
   {t:'Turn the mirrors until the beam lands.',r:['Pivot, step back, squint, pivot. The beam finds the statue and the hall goes gold. Liadrin almost smiles.','liadrin: Patient work. Most of my Blood Knights would have smashed a mirror by now. A morning prayer is the same thing. Small turns until the light lands.']},
   {t:'Fight Akkha. Match him style for style.',r:['He flickers to a corner. You switch. He flickers again. You switch again. On the fourth corner you’re waiting for him.','liadrin: You read him. Good. I was a healer before I was a knight, and healers learn to read people. I’ve been reading you all morning. I like what I see.']},
   {t:'Ask Liadrin what it was like, losing the Light.',r:['liadrin: Quiet. That was the worst of it. I prayed and heard nothing, so I stopped praying. Stupid. The silence was the test, not the answer.','She touches the mirror. “If your mornings go quiet, keep showing up to them anyway. It came back for me. On its own schedule, naturally.”']},
  ]},
 'path-of-crondis':{
  open:[
   'The Path of Crondis. A river of brown water, palm trees along the bank that look thirsty, and ripples that are not the wind.',
   'Zebak surfaces. A crocodile the length of a barge, with a grin to match. He wants you in the water. The water agrees.',
   'ellamaria: Oh, those poor palms. Half dead. Somebody built a shrine to the goddess of making do and then forgot to water her garden.',
   'ellamaria: I came along for the gardens, not the crocodile. But I run a palace, so I suppose I can run a crocodile. Hand me that waterskin.',
  ],
  opts:[
   {t:'Water the palms first. Make the path safe.',r:['You carry water up and down the bank while Zebak glares. The palms straighten. The crossing stones rise out of the mud.','ellamaria: There. Tend the small things and the big crossing takes care of itself. My garden works the same way. So does a kitchen, I’m told.']},
   {t:'Face Zebak head on. Rocks, waves and all.',r:['He slaps the river into a wall of water. You duck behind a boulder, come up swinging, and get the teeth out of the way one at a time.','ellamaria: Mercy. You just fought a river. Roald would have sent four guards and a letter. Come by the palace garden. I owe you lunch, and I’d like to see you dry.']},
   {t:'Ask the queen why she’d rather be in the garden than on the throne.',r:['ellamaria: Because a garden tells the truth. Neglect it a week and it shows. A throne lets you pretend for years. Your house is a garden, not a throne, dear.','She wrings out the hem of her gown. “Now. The crocodile has been patient. Let’s not test him.”']},
  ]},
 'wardens':{
  open:[
   'The bottom of the Tombs. Two stone giants stand either side of an obelisk, Tumeken’s and Elidinis’ Wardens, and something else wears their faces.',
   'Amascut. The Devourer. She speaks through both of them at once and tells you the climb was pointless.',
   'dalinar: Don’t listen. I spent years listening to a voice that told me the next drink was fine. Its only trick is sounding reasonable.',
   'dalinar: Two Wardens. One obelisk. Break the stone they draw from and they are just statues. Stay on the plan when she starts talking.',
  ],
  opts:[
   {t:'Hit the obelisk. Ignore the Wardens until it cracks.',r:['The Wardens swing, the floor lights up in patterns you have to dance around, and you keep hitting the obelisk until it splits.','dalinar: You held to the plan with two giants trying to change your mind. That’s the whole of discipline, honestly. Nothing clever about it.']},
   {t:'Answer the Devourer. Tell her what the climb was for.',r:['You tell her about the baboons, the mirrors, the river, and who you’ll go home to tonight. She calls it small. You agree. She does not like that.','dalinar: She wanted you ashamed of small. Small is a man reading to his children. Small is a wall that holds. Good answer.']},
   {t:'Ask Dalinar if the old voice ever goes away.',r:['dalinar: No. It gets quieter. Some mornings it’s a whisper and some mornings it’s a shout, and you choose anyway. That’s the job. The Wardens are easier.','He lifts his sword. The Wardens turn as one. “With me. Obelisk first.”']},
  ]},
 // ================= The Theatre of Blood =================
 'maiden':{
  open:[
   'Ver Sinhaza, and under it the Theatre of Blood. The seats are full of vampyres. Someone passes you a programme with your name on it.',
   'The first act: the Maiden of Sugadinti. A bride on a throne, pale and furious, with blood spawn crawling up the walls to defend her.',
   'cal: BD-1 says there are about forty of those things in the walls. He also says the bride hasn’t moved in years. Both are bad news.',
   'cal: She was supposed to leave with someone, I think. And she never got to. I know a bit about waiting on a promise. Let’s not make her wait longer.',
  ],
  opts:[
   {t:'Clear the spawn from the walls before touching her.',r:['Blood spawn pop like wet sacks. The nylocas come in from the sides and you cut them down before they can reach her.','cal: Clean. You handled the small stuff so the main thing didn’t get worse. Merrin would say that’s how you keep a crew together. She’s usually right.']},
   {t:'Go straight for the Maiden.',r:['She screams, the walls answer, and for a minute you are fighting in three directions. Then her throne cracks and the theatre goes quiet.','cal: Fast and messy. Worked. Cere used to tell me I only had one speed. Guess we have the same problem.']},
   {t:'Ask Cal what a promise means to him.',r:['cal: Greez made me a seat on the Mantis and never once asked if I was leaving. That’s what it is, I think. Staying when you could run. Do that at home, {name}.','BD-1 beeps something rude at the Maiden. Cal laughs. “He says the second act is worse. He’s probably right.”']},
  ]},
 'bloat':{
  open:[
   'Second act. A room of four pillars and a thing called the Pestilent Bloat, dragging itself around the edge in a cloud of flies.',
   'It walks. It stops. When it stops, you hit it. When it walks, you get behind a pillar or it walks through you.',
   'nieve: Ugh. Smell that? That’s a slayer task I never assign because nobody comes back smelling right.',
   'nieve: Rules. Move when it moves. Hit when it stops. If you get lazy and stand in the open, that’s on you, not the Bloat.',
  ],
  opts:[
   {t:'Pillar to pillar, hit only when it stops.',r:['Walk, hide, hit. Walk, hide, hit. Your legs burn from the sprints. The Bloat slumps on the fourth stop and doesn’t get up.','nieve: That’s intervals. Sprint, rest, sprint. You just did a full session in a sewer. I’ll put it in your log. Don’t skip tomorrow.']},
   {t:'Stand and trade blows with it.',r:['It walks into you. Flies in your mouth, limbs falling off the ceiling, your ribs creaking. You hit it anyway and it goes down a second before you do.','nieve: Stupid. Brave, but stupid. Next time use the pillars. Strong is good. Strong and smart lives longer, and I’d prefer you alive.']},
   {t:'Ask Nieve why she bothers running the slayer tower.',r:['nieve: Because somebody has to tell people the truth about their fitness. Most of them hate me for a week and thank me for a year. You’re on week two, I think.','She checks her list. “You’ve stopped skipping. I noticed. Don’t let it go to your head, but I noticed.”']},
  ]},
 'sotetseg':{
  open:[
   'Third act. Sotetseg, a beast that looks like the dark learned to walk. It throws a red orb, then drags you into a maze where the floor is mostly missing.',
   'In the maze there is one safe path. From the stage, someone has to see it and call it out.',
   'nico: Okay, this is the most goth thing I’ve ever seen and I own a lot of black. A monster that makes you solve a maze. Love her. Hate her. Both.',
   'nico: The Staff only lets me cast each spell once, so I don’t get to say “light” twice. Pick wisely. Also don’t catch the red ball. Obviously.',
  ],
  opts:[
   {t:'Go into the maze. Trust Nico’s calls.',r:['The floor vanishes. Nico’s voice comes from somewhere above: left, left, straight, right, now. You step where she says and the stone holds.','nico: You actually listened. Nobody listens to me. Chase doesn’t listen to me. Okay, let’s never do that again. Can we do that again?']},
   {t:'Stay on stage and call the path for her.',r:['Nico vanishes into the dark and you squint at the glowing tiles. “Right. No, your right.” She swears at you and makes it anyway.','nico: Your directions were terrible and I’m alive, so, thanks. That’s every band I’ve been in. Somebody who can’t play keeping time for everyone else.']},
   {t:'Ask Nico why she never casts the same spell twice.',r:['nico: Staff rules. Say a word once, it’s gone. So I keep a notebook of words I haven’t used. It’s the best hobby I have. You keep a notebook of anything?','She sketches a sigil in the air that fizzles. “See, that one’s spent. Start the notebook. Tonight. Sotetseg can wait a second.”']},
  ]},
 'xarpus':{
  open:[
   'Fourth act. Xarpus. A thing in a pit that spits poison in pools, and when the pools cover the floor, it turns and stares at you.',
   'When it stares, you stand behind it. Where you stand matters more than anything you swing.',
   'helen: Poison pools and a staring contest. Honestly, this is a Tuesday in my kitchen with Jack-Jack.',
   'helen: Don’t fight where it wants you to fight. Move. I’ve spent years stretching across three kids and a husband. Positioning is the whole job.',
  ],
  opts:[
   {t:'Dance around the pools. Hit it from the clean ground.',r:['Spit, step, hit. Spit, step, hit. The floor fills up with green until there’s only a strip left and you are standing on it.','helen: You kept moving and kept your feet dry. That’s dinner time with toddlers. Nobody wins. You just stay out of the splash.']},
   {t:'When it turns, get behind it. Fast.',r:['Xarpus swings its head, searching. You are already behind it. It does not find you until it is too late to matter.','helen: Oh, that was smooth. Bob would have stood in front and taken it on the chest. You went around. I like a man who goes around.']},
   {t:'Ask Helen how she keeps three kids and a city.',r:['helen: Badly, some days. Dash is at a meet, Violet won’t talk, Jack-Jack is on fire. I stretch. I don’t get it all. I get the one who needs me most, that hour. Then the next.','She flexes an arm back into shape. “Pick the kid who needs you tonight. The rest keeps. Now, poison.”']},
  ]},
 'verzik':{
  open:[
   'The final act. The curtain lifts and Lady Verzik Vitur rises from her seat, a vampyre noble who has waited all night for her turn.',
   'Her guests lean forward. Someone pours a glass. Beside you, a pale woman in dark velvet does not touch hers.',
   'vampanna: Verzik. We have met. She serves her guests. I prefer to keep mine. A small difference, in her eyes. A great one, in mine.',
   'vampanna: She will change twice. Webs, then the spider. Each time she grows hungrier, and each time she loses her manners. Do not lose yours.',
  ],
  opts:[
   {t:'Fight her through every form. Keep your head.',r:['Lightning. Webs. The spider, finally, with the whole theatre shrieking. You take her down one shape at a time and never once run.','vampanna: Composed. Through all three. Do you know how rare that is in a mortal? I have lived four centuries and I would still like to see you do it again.']},
   {t:'Cut the webs first. Deny her the trap.',r:['Every web she throws, you cut. She has to come to you in the end, and she is not used to coming to anyone.','vampanna: You made the hostess walk to her guest. Delicious. I am going to think about that for a long while. Perhaps over a drink. Not that kind.']},
   {t:'Ask Anna how she keeps her hunger on a leash.',r:['vampanna: Every evening I decide, before the hunger does. Decide early and the leash holds. Decide late and there is no leash. Your phone, your desserts. Same leash.','She steps closer than she needs to. “Verzik never learned that. You seem to be learning. Come find me after, and show me.”']},
  ]},
 // ================= The Inferno =================
 'inferno-archers':{
  open:[
   'Mor Ul Rek, the hidden city of the TzHaar, and under it the Inferno. Obsidian, lava, and pillars you learn to love very quickly.',
   'The first waves: Jal-Xil. Rangers that sit on the far side of the cave and put spikes through anyone who stands in the open.',
   'wasp: Okay, hot. Very hot. My suit’s rated for this, mostly. Tip from someone who’s been shot at by better archers: don’t be where they aimed.',
   'wasp: Pillar, peek, sting, pillar. Small target, fast feet. I’ve been doing this at two inches tall since before you could lift a sword.',
  ],
  opts:[
   {t:'Pillar to pillar. Never in the open.',r:['You cross the cave in bursts. Spikes shatter on the obsidian behind you each time. The last ranger falls with you still half behind a rock.','wasp: Footwork! Finally someone with footwork. That’s a cardio day, by the way. Lava room, sprints, no excuses tomorrow because “it was hot.”']},
   {t:'Rush them. Close the gap before they can aim.',r:['You sprint the whole cave with spikes thudding into the floor around your feet and reach the first ranger out of breath and furious.','wasp: That was reckless and kind of great. Hank would have had a chart about why it was wrong. I’m just going to say it looked good on you.']},
   {t:'Ask Janet why she designs her own costumes.',r:['wasp: Because if I’m going to get shot at I’m going to look fantastic doing it. Also nobody else makes a suit that shrinks. You train, you might as well train in something you like.','She shrinks, zips behind a pillar and back. “Buy the good shoes. I mean it. Now, archers.”']},
  ]},
 'inferno-mages':{
  open:[
   'Deeper in. Jal-Zek. Mages that float at the back and, worse, bring back the things you already killed.',
   'A ranger you put down two waves ago stands up and looks offended about it.',
   'emma: Oh, I despise that. Finishing a task and having someone undo it. I fired a vice president for less.',
   'emma: Mages first. Always. Kill the thing that keeps making more work and the rest of the work gets smaller. This is management, darling, with more lava.',
  ],
  opts:[
   {t:'Kill the mages first. Then whatever is left.',r:['You ignore the revived ranger and go through the heat for the mages. When the last one drops, nothing gets back up again.','emma: Priorities. Correct ones. You would be surprised how few people on my board can pick the one problem that causes the others.']},
   {t:'Clear the revived ones as they come. Keep the field clean.',r:['Every corpse that stands, you put back down. It is slow, hot and thankless, and the mages run out of bodies to use.','emma: Grinding it out. Not elegant. Effective. I turned to diamond to survive a bad quarter once. Sometimes you just endure. Then you fire someone.']},
   {t:'Ask Emma how she runs a company and a school.',r:['emma: Ruthlessly, and with a list. Every morning. Three things that must happen, written down, and I do not read a single message until the first is done. Try it.','She brushes ash from a white sleeve. “You are doing well, by the way. I would tell you if you weren’t. I enjoy telling people. I enjoy telling you more.”']},
  ]},
 'inferno-meleers':{
  open:[
   'Jal-ImKot. The ground rumbles and a shape goes under it like a fish under a pond. It comes up where you are standing.',
   'You learn to watch the floor. The floor is where they live.',
   'yrel: Burrowers. We had something like these on Draenor, in the Spires. The trick was never standing still long enough to be under.',
   'yrel: I trained with a plain mace until it felt like part of my arm. You do not need a better weapon. You need to be where it comes up, with the mace already moving.',
  ],
  opts:[
   {t:'Keep moving. Hit it the moment it surfaces.',r:['Rumble. Step. Burst of obsidian. Mace down. Again. By the sixth one your timing is better than the Inferno expected.','yrel: That is what the training is for. Not the fight. The timing. Your morning sessions bought you this, whether you felt them paying out or not.']},
   {t:'Plant your feet. Make it come to you.',r:['It comes up under you. It regrets it. The fight is short, loud and mostly on your terms.','yrel: Hm. Standing your ground when I told you to move. The Exarchs scolded me for that once. Then I beat them. I like your odds. I like you, a little.']},
   {t:'Ask Yrel where she came from.',r:['yrel: A village nobody remembers. I carried water. Then I carried a mace. Then they called me Exarch and I still get up and carry water, because that is who I am.','She rolls her shoulders. “Carry your water, {name}. Whatever the small heavy thing is. The rest follows. Here comes another one.”']},
  ]},
 'inferno-jad':{
  open:[
   'The cave goes quiet, which is worse. Then JalTok-Jad. Three of him. Each one the height of a house, and each one with little healers crowding to keep it alive.',
   'Jad stomps when he means melee, rears when he means magic, and the sound comes before the hit. If you listen.',
   'sue: Three at once. Right. I raised Franklin and Valeria with Reed in the lab and Johnny in the house. Three at once is just Wednesday.',
   'sue: I can hold a field over us, but only one direction at a time. You tell me which one is winding up. Watch the shoulders. Children and giants both telegraph.',
  ],
  opts:[
   {t:'Watch their stances. Call each attack before it lands.',r:['Stomp, field. Rear, field. You call them, Sue holds them, and the third Jad goes down to the sound of its own healers complaining.','sue: You read all three. Same skill as noticing which kid is about to melt down. You already have it. Use it at home before the stomp, next time.']},
   {t:'Take out the healers first.',r:['The little healers scatter when you chase them, which means Jad has nobody to lean on. One by one, the giants stop getting back up.','sue: Smart. The quiet ones holding everything together are the ones who matter most. I would know. Nobody looks at the invisible one until she’s gone.']},
   {t:'Ask Sue how she keeps a family of geniuses from falling apart.',r:['sue: I don’t keep them from it. I catch them when they do. Reed forgets dinner, Johnny forgets rent, and I remember both and still make it to Valeria’s recital. Mostly.','Her field flickers and holds. “Show up to the recital. Whatever your version is. Now, which Jad is stomping?”']},
  ]},
 'tzkal-zuk':{
  open:[
   'The last wave. The cave opens into a lake of fire and TzKal-Zuk rises out of it, taller than the ceiling should allow.',
   'A shield of rock slides along the edge of the lake. Stay behind it and you live. Fall behind it and you don’t.',
   'magik: I rule Limbo. Hell, basically. This is a big campfire with a big man in it. Cute. The shield trick is new.',
   'magik: Keep pace with the rock. Not ahead, not behind. It is dull and it is everything. I learned that in a place much worse than this, and I was younger than you.',
  ],
  opts:[
   {t:'Walk with the shield. Every step.',r:['Left. Left. Left. Zuk hurls fire and the shield eats it. The healers come and you cut them without ever leaving its shadow. Then he falls.','magik: That is what will looks like from the outside. Boring. You walked at the speed of a rock for ten minutes and a demon lord died. Good.']},
   {t:'Break from the shield to kill the healers.',r:['You dash out, cut two healers down, and nearly cook for it. You make it back behind the rock with your cloak smoking.','magik: Reckless. I have done worse. Still, I like you with eyebrows. Next time, let them come to the shield. They always do.']},
   {t:'Ask Illyana what Limbo taught her.',r:['magik: That nobody is coming to save you, so you had better learn the routine. Wake up. Sharpen the soulsword. Do the next ugly thing. Every day, for years. That is how you get out.','She twirls the sword. “Your version is smaller. Still counts. Keep the routine and the demons get smaller too. Now, step. The rock is moving.”']},
  ]},
 // ================= The Last Gates =================
 'royal-titans':{
  open:[
   'The Last Gates. The far end of everything. First door: a throne room split down the middle, ice on one side and fire on the other.',
   'Branda the Fire Queen and Eldric the Ice King, two giants who share a room and refuse to share anything else.',
   'anna: Oh no. Oh, I know this one. Ice on one side, somebody shouting on the other, nobody talking. I grew up in this room. Different castle, same problem.',
   'anna: You can’t fight them one at a time. They freeze the floor, they burn the floor, and the only safe spot is where they both just were.',
  ],
  opts:[
   {t:'Fight them both. Keep to the middle.',r:['Fire. Ice. You stand on the line where the two meet and take turns hitting whichever one is closest. They go down nearly together.','anna: In the middle. Where they both are. That is marriage, basically. Kristoff calls it “a tough spot.” He means it nicely. So do I.']},
   {t:'Take the king first. The queen is bluster.',r:['Eldric falls with a sound like a lake cracking. Branda, furious, burns twice as hot. You get there anyway.','anna: Okay, so, the loud one was not the dangerous one. Huh. I married a man who talks to a reindeer, so I know a thing about quiet ones.']},
   {t:'Ask Anna how she and Kristoff keep from freezing each other out.',r:['anna: We don’t let a door stay closed. That’s the rule. Either of us can be upset. Neither of us gets to go quiet for a week. I did the knocking as a kid. I know what silence costs.','She takes your hand on the ice line. “Knock tonight. On whatever door it is. Now, come on, the queen is lighting the throne again.”']},
  ]},
 'doom-of-mokhaiotl':{
  open:[
   'The second gate. A dome of stone, and below it a stair that goes down floor by floor. Mokhaiotl waits at every one, and gets stronger each time.',
   'On the third floor it says your name. Nobody told it your name.',
   'xalatath: Oh, this is charming. It learns you. Each floor it knows a little more about where you flinch. I do the same thing, only I am better at it.',
   'xalatath: You could stop at this floor. Nobody would blame you. Three floors is respectable. Say the word and we turn around. I am simply offering.',
  ],
  opts:[
   {t:'Go down another floor. Then another.',r:['Floor four. Floor five. The demon is faster, louder, and knows your mother’s name now. You keep going until it has nothing left to learn.','xalatath: You kept going while I offered you the door. Every floor. Hm. I so rarely lose that game. I think I will remember you. That is not a threat. Mostly.']},
   {t:'Stop at this floor. Enough for today.',r:['You turn around with Mokhaiotl screaming below. The stair is longer going up. It will be here tomorrow, and so will you.','xalatath: Sensible. Dull, but sensible. Know that you stopped because you chose to, not because I asked. There is a difference. Keep track of it. Then come back and go deeper.']},
   {t:'Ask Xalatath why she bothers tempting you.',r:['xalatath: Because when you say no, it is the only truly interesting thing a mortal does. The rest is eating and sleeping. You said no to the couch this morning, didn’t you? I noticed.','She trails a cold finger down your arm. “Keep saying it. I will keep asking. It is the longest game I have, and I would like to lose it to you.”']},
  ]},
 'araxxor':{
  open:[
   'Third gate: the araxyte hollow, under Morytania. Webs thick as rope, and eggs. Everywhere. Pale, swollen, humming slightly.',
   'Araxxor drops from the ceiling on a thread. It is bigger than the hollow should allow. The eggs twitch when it lands.',
   'shuri: Do NOT pop the eggs. I scanned one. Acid. Also baby spiders. Also the acid has baby spiders in it. I’m so excited, this is disgusting.',
   'shuri: I have a whole lab for this. Kinetic absorption, sonic pulse. Or you could, you know, hit it with a sharp stick. Your call. Mine is the lab.',
  ],
  opts:[
   {t:'Fight Araxxor in the clear ground. Mind the eggs.',r:['You pick your way through the clutch like a drunk in a china shop and fight the spider in the one clear patch. It takes forever. Nothing pops.','shuri: Not one egg. Not one! My brother steps on things. You did not step on things. I am putting that in the report. The report is a group chat.']},
   {t:'Let Shuri try the sonic pulse.',r:['She hums a note into a bracelet and the webs shiver apart. Araxxor hates it. The eggs hate it more. You cover her until the pulse finishes.','shuri: It WORKED. First try! Well, third try, the lab doesn’t count. Tinkering is the only hobby where failing is literally the point. Get a hobby like that.']},
   {t:'Ask Shuri why she builds things for fun.',r:['shuri: Because the fun ones end up saving someone. The sneakers were a joke. Then the sneakers were silent on a mission. Make something useless this week. See what it becomes.','She tosses a bead at the spider that goes off like a firecracker. “That one was useless. Now it’s a distraction. Go.”']},
  ]},
 'corporeal-beast':{
  open:[
   'The fourth gate. A cave hung with spirit light, and in it the Corporeal Beast. A soul that got tired of being one and grew a body. The body is mostly teeth.',
   'Its core drifts out of its chest now and then, a dark little thing that hunts for you on its own.',
   'geralt: Hm. Spirit given flesh. Vesemir had a word for these. Forgot the word. Didn’t forget the lesson. Only spears get through the hide. Swords skid.',
   'geralt: Drink this. Tastes like Roach’s saddle. It’ll keep you upright when it stomps. Watch the core. Core goes for the weakest thing in the room. Don’t be that.',
  ],
  opts:[
   {t:'Spear it. Keep the core off you.',r:['Spear in, spear out, kick the core away, spear in. The beast screams in a voice that isn’t a voice. It takes a long time. It ends.','geralt: Steady work. That’s all a contract is. Potions, the right weapon, no hero moves. You’d have made a bad witcher. Good hunter, though.']},
   {t:'Chase the core down first.',r:['The core slides through the stone. You follow, stamp on it, and the beast staggers like you kicked its heart. Because you did.','geralt: Huh. Went for the heart. Didn’t think of that. Ciri would’ve. She usually finds the shortcut I’m too stubborn to look for.']},
   {t:'Ask Geralt about Ciri.',r:['geralt: Found her in a forest. Didn’t want a kid. Got one anyway. Taught her the sword. She taught me… don’t know. To care, I guess. Hm. Your kids remember who was there. Be there.','He checks the potion bottle. Empty. “Spear. Core. No hero moves.”']},
  ]},
 'yama':{
  open:[
   'The last gate. Beneath every cave and tomb and theatre, a court of black stone, and on its throne a demon lord who has been expecting you.',
   'Yama does not rise. He asks what you brought. Not weapons. He wants to know what you brought.',
   'obiwan: Interesting question. I spent twenty years in a hut on Tatooine with a few robes and a boy to watch. It turns out that is enough to bring.',
   'obiwan: Think of what got you to this door. The mornings. The small, dull, faithful things. He cannot see them, and they are the only reason you are standing here.',
   'obiwan: This is the end of the map, {name}. Not the end of the walk. Draw when you are ready. I will be right beside you, as I should have been more often.',
  ],
  opts:[
   {t:'Fight Yama with everything the road taught you.',r:['Every path, every wave, every pillar. You fight the way you lived this last year: one thing at a time, done properly. The demon lord finds nothing to buy and nothing to break.','obiwan: Well. That was the whole journey, done again in one room. There is no map after this. There is tomorrow morning. I suspect you already know what to do with it.']},
   {t:'Answer him. Say what you brought.',r:['You list it. A wife who waited up. Children asleep upstairs. A body that works. Work finished. A quiet morning prayer. Yama has a throne and none of those, and he knows it.','obiwan: You said it out loud. Good. That list is the only treasure in this place worth carrying out. Guard it tomorrow. And the day after. That is the trick, really.']},
   {t:'Ask Obi-Wan what he would do after the last gate.',r:['obiwan: Go home. Make tea. Sit with the quiet. Then get up the next morning and do the ordinary things again, because the ordinary things are what the gate was for.','He smiles the tired smile of a man who has seen a lot of endings. “Nothing ends here, you know. You simply get to go home. Now. He is waiting.”']},
  ]},
};
