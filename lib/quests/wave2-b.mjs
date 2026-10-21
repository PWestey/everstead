// Second-wave quests: Vannaka (Fitness), Magni and Duradel (Work), Albus and Wade (Home), Revan (Discipline), Wise Old Man (Hobbies).
// Steps and rewards are built by the engine from `tier`.

/** @type {Record<string,any>} */
export const QUESTS={
 'the-slayer-task':{name:'The Slayer Task',area:'fitness',giver:'vannaka',tier:5,
  blurb:'Darrow, Roy, Grog and Geralt all put in a word for you. Vannaka keeps a ledger of slayer tasks, and he just wrote your name in it.',
  say:['Talk to Vannaka beneath the Training Yard.','Report back to Vannaka in the dungeon below the Yard.','Meet Vannaka in the Training Yard at dawn.']},
 'strike-by-strike':{name:'Strike by Strike',area:'work',giver:'magni',tier:4,
  blurb:'A dwarf king has dragged an anvil to the edge of the Market. He wants to know if you take any pride in your work.',
  say:['Talk to Magni at his anvil in the Market.','Report back to Magni at the mine furnace.','Meet Magni by the forge when the last shift ends.']},
 'results-only':{name:'Results Only',area:'work',giver:'duradel',tier:5,
  blurb:'Duradel doesn’t train beginners. Magni told him you aren’t one. He’s standing in the Market, waiting to find out if that’s true.',
  say:['Talk to Duradel in the Market.','Report back to Duradel.','Meet Duradel on the hill outside the Market at dusk.']},
 'the-open-door':{name:'The Open Door',area:'home',giver:'dumbledore',tier:3,
  blurb:'A young wizard named Albus is losing an argument with a Workshop hinge. He suspects you know something his books don’t.',
  say:['Talk to Albus in the Workshop doorway.','Report back to Albus on the Workshop floor.','Meet Albus at your own front door at nightfall.']},
 'maximum-effort':{name:'Maximum Effort',area:'home',giver:'deadpool',tier:4,
  blurb:'There’s a red couch stuck in the Workshop door and a man in a red suit lying on it. He wants a team-up. His apartment needs a miracle.',
  say:['Talk to Wade on the couch in the Workshop door.','Report back to Wade at the fountain.','Visit Wade’s apartment above the Workshop.']},
 'who-you-decide':{name:'Who You Decide to Be',area:'discipline',giver:'revan',tier:4,
  blurb:'A hooded Jedi has been reading your record in the Library. He was somebody else once, and he chose his way back.',
  say:['Talk to Revan in the Library’s quietest corner.','Report back to Revan in the Library courtyard.','Meet Revan on the hill above the village at night.']},
 'ninety-nine':{name:'Ninety-Nine',area:'hobbies',giver:'wiseoldman',tier:4,
  blurb:'The Wise Old Man maxed every skill there is, purely for fun. He reckons it’s time you learned how to learn.',
  say:['Talk to the Wise Old Man at the Guildhall pond.','Report back to the Wise Old Man at his Guildhall workbench.','Visit the Wise Old Man’s cottage at the edge of the village.']},
};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- The Slayer Task (Vannaka, Fitness, tier 5) ----------------
 'the-slayer-task-1':{who:'vannaka',bg:'facility-scenes/raphael.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Under the Training Yard, a stair winds down into torchlit stone that smells like Edgeville Dungeon. A grizzled man in a horned helm sits behind a desk of task scrolls.',next:'b'},
  b:{s:'vannaka',t:'You. Geralt says you don’t quit. Everybody says that about somebody. Name’s Vannaka. I hand out tasks.',next:'c'},
  c:{s:'vannaka',t:'Darrow gave you iron. Roy gave you miles. Grog gave you weight. Geralt gave you an edge. I’m the long haul.',opts:[
   {t:'What’s the task?',next:'what'},
   {t:'I’ve already done four trials.',next:'done'},
   {t:'Do I get to pick?',next:'pick'}]},
  what:{s:'vannaka',t:'Everybody asks. Answer’s always the same. Whatever’s in front of you. Could be hill giants. Could be a treadmill.',next:'offer'},
  done:{s:'vannaka',t:'And you want what, a medal? Four trials means you’re ready for a fifth. That’s all a trial ever buys you.',next:'offer'},
  pick:{s:'vannaka',t:'Ha! No. You get what I give you and you finish it. Turael lets people pick. Go see Turael if you want a hug.',next:'offer'},
  offer:{s:'vannaka',t:'Your task: fifteen real training sessions. Lift, run, walk, stretch. Then we talk about the ten days after that.',next:'offer2'},
  offer2:{s:'vannaka',t:'And no skipping. Half the adventurers in Gielinor burn points to skip the hard tasks. Not on my ledger.',opts:[
   {t:'Assign it. (Start “The Slayer Task”)',next:'yes',do:[{quest:['the-slayer-task','start']}]},
   {t:'Not today, Vannaka.',next:'no'}]},
  yes:{s:'narrator',t:'He scratches your name into the ledger. Under “Task” he writes one word: Everything. Under “Amount” he writes: Yes.',end:true},
  no:{s:'vannaka',t:'Come back when you’re ready. The task’ll still be here. They always are.',end:true}}},

 'the-slayer-task-2':{who:'vannaka',bg:'facility-scenes/mine.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Deep in the dungeon, Vannaka is sharpening a sword that has never once needed it. He doesn’t look up.',next:'b'},
  b:{s:'vannaka',t:'Fifteen. Logged. Most come back with eleven and a story about their knee. You came back with fifteen and no story. I like that.',next:'c'},
  c:{s:'vannaka',t:'So. Which one nearly had you?',opts:[
   {t:'The first one after a bad night’s sleep.',next:'tired',do:[{flag:'vannaka-tired'}]},
   {t:'None. I just kept going.',next:'none'},
   {t:'The one I almost quit halfway through.',next:'half'}]},
  tired:{s:'vannaka',t:'Always is. Your legs were fine. The bed was the monster. Worse than a greater demon. You killed it anyway. Counts double.',next:'d'},
  none:{s:'vannaka',t:'Liar. Decent liar, though. Fine. Keep your secrets. Keep your streak.',next:'d'},
  half:{s:'vannaka',t:'Halfway’s where tasks go to die. Like the last forty kills on a long one. You didn’t let it. That’s the whole trade.',next:'d'},
  d:{s:'vannaka',t:'Now the real task. Ten different days. Not ten sessions crammed into a weekend. Ten days, spread out, every one honest.',next:'e'},
  e:{s:'vannaka',t:'Young slayers come in bright, blow everything and vanish. Old slayers just kept turning up with food in the pack. Be an old slayer.',opts:[
   {t:'Ten days. I’ll be an old slayer.',next:'f',do:[{quest:['the-slayer-task','advance']}]}]},
  f:{s:'narrator',t:'He hands you a slate with ten empty boxes chalked on it, then goes back to his sword like you were never there.',end:true,do:[{xp:['fitness',800]}]}}},

 'the-slayer-task-3':{who:'vannaka',bg:'facility-scenes/journey.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Training Yard is empty at dawn except for Vannaka, Darrow and Grog, standing by the weapon rack.',next:'b'},
  b:{s:'vannaka',t:'Ten days. Fifteen sessions. Not one skip. Task complete.',next:'c'},
  c:{s:'darrow',t:'He said “complete.” I’ve heard him say that word to three people. Ever.',next:'d'},
  d:{s:'vannaka',t:'Four. I don’t count Grog. Grog ate his task scroll.',next:'e'},
  e:{s:'grog',t:'It was a delicious task. Bit dry.',next:'f'},
  f:{s:'vannaka',t:'Here’s the bit nobody warns you about. A task ends and you stand there wondering what you’re for. So what do you do tomorrow?',opts:[
   {t:'Train anyway.',next:'anyway'},
   {t:'Rest, then train.',next:'rest'},
   {t:'Ask for another task.',next:'another'}]},
  anyway:{s:'vannaka',t:'Right answer. The task was never the point. The fella who finishes it is.',next:'g'},
  rest:{s:'vannaka',t:'Smart. Rest is part of the task. Skip it and you end up as somebody else’s task.',next:'g'},
  another:{s:'vannaka',t:'Greedy. Good. There’s always another one. That’s the secret nobody tells you.',next:'g'},
  g:{s:'narrator',t:'He presses a small green gem into your palm. It’s warm, and it hums faintly.',next:'h'},
  h:{s:'vannaka',t:'Enchanted gem. Slayers use it to ask their master for a task. Every morning, hold it and ask. You’ll get the same answer every time.',next:'i'},
  i:{s:'player',t:'Let me guess. Train.',next:'j'},
  j:{s:'vannaka',t:'Train. Now get out of my yard, {name}. You’ve got a task.',end:true,do:[{quest:['the-slayer-task','complete']}]}}},

 // ---------------- Strike by Strike (Magni, Work, tier 4) ----------------
 'strike-by-strike-1':{who:'magni',bg:'facility-scenes/trading.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Clang. Clang. A stout dwarf with a braided bronze beard has set up an anvil at the edge of the Market. The merchants have given up complaining.',next:'b'},
  b:{s:'magni',t:'Ah! The lad with the habit board! Tony says ye finish things. Kelsier says ye plan. Bruce says ye’ve stopped losin’ yer temper. Mostly.',next:'c'},
  c:{s:'magni',t:'All grand. But I’ve one question and I want it straight. Do ye take pride in yer work?',opts:[
   {t:'Some days.',next:'some'},
   {t:'Not really. It’s just work.',next:'just',do:[{flag:'magni-just-work'}]},
   {t:'Isn’t pride dangerous?',next:'danger'}]},
  some:{s:'magni',t:'Honest! Some days the metal sings. Some days it fights ye like a cranky ram. Ye strike it either way.',next:'offer'},
  just:{s:'magni',t:'“Just work!” Lad, I was King of Ironforge. A crown’s just work too, and heavy with it. It’s yer hands make it honest.',next:'offer'},
  danger:{s:'magni',t:'Aye, the puffed-up kind. Cost me plenty. But the quiet kind, that checks the seam twice before it goes out the door? That’s a smith’s pride.',next:'offer'},
  offer:{s:'magni',t:'So. Twelve pieces of work, done well enough ye’d stamp yer name on them. Not fast. Well.',next:'offer2'},
  offer2:{s:'magni',t:'Every one a strike on the anvil. Manage that, and we’ll talk about temperin’.',opts:[
   {t:'Hand me the hammer. (Start “Strike by Strike”)',next:'yes',do:[{quest:['strike-by-strike','start']}]},
   {t:'Not right now, Magni.',next:'no'}]},
  yes:{s:'magni',t:'Ha! That’s the spirit. Off ye go. And mind yer eyebrows. The sparks are hungry today.',end:true},
  no:{s:'magni',t:'Fair enough. The forge’ll keep. The Great Forge has kept a good few thousand years.',end:true}}},

 'strike-by-strike-2':{who:'magni',bg:'facility-scenes/mine.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Magni meets you at the mine furnace. He hands you a pair of tongs without a word and nods at a bar of steel glowing orange.',next:'b'},
  b:{s:'magni',t:'Twelve pieces, all signed. I checked a few. Don’t give me that face. A king checks.',next:'c'},
  c:{s:'magni',t:'Right. Strike that bar. Go on, it won’t bite. Much.',opts:[
   {t:'Hit it as hard as you can.',next:'hard'},
   {t:'Hit it carefully, again and again.',next:'careful'},
   {t:'Ask him how first.',next:'ask'}]},
  hard:{s:'magni',t:'Ha! Sparks everywhere and a dent right where ye didn’t want one. Muscle’s grand, lad. Aim’s better.',next:'d'},
  careful:{s:'magni',t:'There! See how it moves for ye? Ye don’t beat the metal. Ye talk it round. One strike at a time.',next:'d'},
  ask:{s:'magni',t:'Askin’ first! By my beard. Half of Ironforge’s disasters never would’ve happened if more dwarves asked first. Brann, mostly.',next:'d'},
  d:{s:'magni',t:'Now, temperin’. Heat it, cool it. Heat it, cool it. That’s what lets steel hold an edge instead of shatterin’ on the first hard day.',next:'e'},
  e:{s:'magni',t:'Work’s the same. Seven different days. Show up, strike well, go home and cool off. Then do it again.',opts:[
   {t:'Seven days. Heat and cool.',next:'f',do:[{quest:['strike-by-strike','advance']}]}]},
  f:{s:'narrator',t:'He quenches the bar with a hiss. Steam rolls up between you, and he grins through it like a man in a sauna.',end:true,do:[{xp:['work',700]}]}}},

 'strike-by-strike-3':{who:'magni',bg:'facility-scenes/treasure.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The forge has burned down to embers. Magni sits on an upturned bucket, a small cloth bundle on his knee.',next:'b'},
  b:{s:'magni',t:'Seven days. Tempered proper. I could ring a bell with ye now.',next:'c'},
  c:{s:'magni',t:'I’ll tell ye something. I once read some old titan tablets I’d no business readin’. Tried to hear the heart of the world. It turned me to diamond.',next:'d'},
  d:{s:'magni',t:'Stood in me own throne room like a statue for years. Took bein’ stone to teach me what my hands were for.',opts:[
   {t:'What were they for?',next:'for'},
   {t:'That sounds lonely.',next:'lonely'}]},
  for:{s:'magni',t:'For the work in front of them. Not glory. The next good strike, for the folk who need it.',next:'e'},
  lonely:{s:'magni',t:'Aye. It was. Moira ran the city while I stood there. Work that cuts ye off from yer people isn’t work. It’s a cage with a nice view.',next:'e'},
  e:{s:'narrator',t:'He unwraps the cloth. Inside is a small hammer, its head stamped with a bronze beard.',next:'f'},
  f:{s:'magni',t:'Keep it on yer desk. Before the day’s first real job, tap it once. One strike. Reminds ye the work’s yours.',opts:[
   {t:'Every morning.',next:'g'},
   {t:'Can I tap it twice on bad days?',next:'twice'}]},
  twice:{s:'magni',t:'Tap it as many times as it takes, lad. Just make the last one count.',next:'g'},
  g:{s:'magni',t:'And when the day’s done, set it down. Even a king’s hammer gets a rest. Go have a pint. Or a cup of tea, if ye must.',next:'h'},
  h:{s:'magni',t:'Ye’ve a smith’s heart, {name}. I can hear it ringin’. Ironforge’s doors are open to ye. The ale’s on Brann.',end:true,do:[{quest:['strike-by-strike','complete']}]}}},

 // ---------------- Results Only (Duradel, Work, tier 5) ----------------
 'results-only-1':{who:'duradel',bg:'facility-scenes/recruit.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A tall man in a feathered headdress stands dead still in the middle of the Market crowd. People step around him. He steps around nobody.',next:'b'},
  b:{s:'duradel',t:'I am Duradel. Shilo Village. I do not train beginners. The dwarf says you are not one.',next:'c'},
  c:{s:'duradel',t:'Tony taught you to finish. Kelsier, to plan. Bruce, calm. Magni, craft. I care about none of it. Show me what it made.',opts:[
   {t:'Results. Got it.',next:'got'},
   {t:'Effort counts for something.',next:'effort'},
   {t:'What if I fail?',next:'fail'}]},
  got:{s:'duradel',t:'Do not say it. Show it.',next:'offer'},
  effort:{s:'duradel',t:'Effort is the price. Results are what you bought. Nobody admires a man for how much he paid.',next:'offer'},
  fail:{s:'duradel',t:'Then you tell me what you learned, and you go again. Failure is a result. An excuse is not.',next:'offer'},
  offer:{s:'duradel',t:'Fifteen pieces of work. Each must change something. A problem gone. A number moved. A thing that exists now and did not before.',next:'offer2'},
  offer2:{s:'duradel',t:'Results. Not hours. Do you take the task?',opts:[
   {t:'I accept. (Start “Results Only”)',next:'yes',do:[{quest:['results-only','start']}]},
   {t:'I’m not ready.',next:'no'}]},
  yes:{s:'duradel',t:'Good. Go.',end:true},
  no:{s:'duradel',t:'Honest. That is a result too. Come back when it changes.',end:true}}},

 'results-only-2':{who:'duradel',bg:'facility-scenes/northern.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Duradel is standing exactly where you left him. A pigeon has settled on his headdress. Neither of them seems bothered.',next:'b'},
  b:{s:'duradel',t:'Fifteen. Show me what changed.',opts:[
   {t:'List all fifteen, one by one.',next:'list'},
   {t:'Show him the one that mattered most.',next:'one'},
   {t:'Admit two of them were busywork.',next:'admit',do:[{flag:'duradel-honest'}]}]},
  list:{s:'narrator',t:'He listens to all fifteen without blinking. At the end he nods once. It feels like being handed a medal.',next:'c'},
  one:{s:'duradel',t:'Good. Most men show me everything to hide that nothing mattered. You led with what mattered.',next:'c'},
  admit:{s:'duradel',t:'Thirteen, then. And one honest man. That is worth more to me than two fake results.',next:'c'},
  c:{s:'duradel',t:'Now the hardest task I give. Ten different days of real results. Not a burst. Not a sprint the night before a deadline.',next:'d'},
  d:{s:'duradel',t:'Anyone produces once. A master produces on a Tuesday, tired, with nobody watching. Steel dragons do not care how you feel.',opts:[
   {t:'Ten days. Results, every one.',next:'e',do:[{quest:['results-only','advance']}]}]},
  e:{s:'narrator',t:'He hands you a scrap of hide with ten blank lines. At the top, in his blunt hand: RESULTS. NOTHING ELSE.',next:'f'},
  f:{s:'duradel',t:'Go. Faster than that.',end:true,do:[{xp:['work',900]}]}}},

 'results-only-3':{who:'duradel',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At dusk Duradel waits on the hill outside the Market. Tony and Magni have come too, keeping a respectful distance.',next:'b'},
  b:{s:'duradel',t:'Ten days. I read every line. All earned.',next:'c'},
  c:{s:'tony',t:'That’s it? That’s the speech? I say more than that to my coffee machine.',next:'d'},
  d:{s:'duradel',t:'Then you waste words. He does not waste days.',next:'e'},
  e:{s:'magni',t:'Ha! That’s Duradel gushin’, lad. Ye’ll not hear it louder than that this side of Karamja.',next:'f'},
  f:{s:'duradel',t:'One question. When your working years are done, what result do you want left behind?',opts:[
   {t:'A family that was taken care of.',next:'family'},
   {t:'Work that helped people.',next:'help'},
   {t:'I don’t know yet.',next:'unknown'}]},
  family:{s:'duradel',t:'Right target. Aim at it every day.',next:'g'},
  help:{s:'duradel',t:'Good. Then measure yourself by them. Not by the hours.',next:'g'},
  unknown:{s:'duradel',t:'Then find out. A slayer with no target swings at air and goes home tired.',next:'g'},
  g:{s:'narrator',t:'He pulls a carved tally stick from his belt, crowded with hundreds of notches worn smooth by years of thumbs. Then he hands you a fresh one, cut from the same wood.',next:'h'},
  h:{s:'duradel',t:'Each evening, cut one notch for one real result. Not effort. Result. The first notch is cut already. That one is for the ten days.',next:'i'},
  i:{s:'duradel',t:'Task complete, {name}. I do not say it twice.',end:true,do:[{quest:['results-only','complete']}]}}},

 // ---------------- The Open Door (Albus, Home, tier 3) ----------------
 'the-open-door-1':{who:'dumbledore',bg:'facility-scenes/school.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A young man with long auburn hair and a stack of books under each arm stands in the Workshop doorway, frowning at a broken hinge as if it were a riddle.',next:'b'},
  b:{s:'dumbledore',t:'Ah, hello! Albus. I’ve read eleven books on transfiguration and not one on hinges, which now seems a grave oversight. Probably mine.',next:'c'},
  c:{s:'dumbledore',t:'Peter tells me you mend fences these days. Piotr says your porch is the best-painted in the valley. He was rather insistent.',next:'d'},
  d:{s:'dumbledore',t:'I hope to teach one day. And I’m beginning to suspect the hardest magic isn’t done with a wand. It’s making a place feel safe.',opts:[
   {t:'What makes a place safe?',next:'what'},
   {t:'Your school will be fine. You’re brilliant.',next:'fine'},
   {t:'My house could use some of that.',next:'mine'}]},
  what:{s:'dumbledore',t:'Small things, I think. A door that shuts. A lamp left lit. A floor you can cross barefoot in the dark. My brother keeps goats, so that last one is aspirational.',next:'offer'},
  fine:{s:'dumbledore',t:'Kind of you. But cleverness builds towers. It takes chores to build a home. I’m learning that slowly, and with some embarrassment.',next:'offer'},
  mine:{s:'dumbledore',t:'Then we have the same homework. How marvelous. I always study better with company. Elphias falls asleep.',next:'offer'},
  offer:{s:'dumbledore',t:'Eight chores, then. Nothing grand. The dishes, the laundry, the squeaky step. Each one a small spell of safety.',opts:[
   {t:'Eight small spells. (Start “The Open Door”)',next:'yes',do:[{quest:['the-open-door','start']}]},
   {t:'Maybe another time, Albus.',next:'no'}]},
  yes:{s:'dumbledore',t:'Splendid. I shall now attempt this hinge. Wish me luck. It looks smug.',end:true},
  no:{s:'dumbledore',t:'Of course. The hinge and I will continue our standoff. I believe it is winning.',end:true}}},

 'the-open-door-2':{who:'dumbledore',bg:'facility-scenes/stories.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Albus is sitting cross-legged on the Workshop floor. The hinge is fixed. Thirty-one books lie open around him, and none of them helped.',next:'b'},
  b:{s:'dumbledore',t:'Eight chores! I fixed one hinge, by hand, in three days, and needed a plaster afterward. I believe you’re winning.',next:'c'},
  c:{s:'dumbledore',t:'Tell me. When you’d finished, who noticed?',opts:[
   {t:'Nobody, really.',next:'nobody'},
   {t:'My wife did.',next:'wife'},
   {t:'My kids walked right past it.',next:'kids',do:[{flag:'albus-kids-walked-past'}]}]},
  nobody:{s:'dumbledore',t:'Ah, then it worked. Safety is invisible. People only notice it when it’s gone.',next:'d'},
  wife:{s:'dumbledore',t:'Then you gave her something terribly rare: a job she didn’t have to carry. That’s very quiet magic.',next:'d'},
  kids:{s:'dumbledore',t:'Of course they did. Children walk past safety like fish past water. They grow up in it. That’s rather the point.',next:'d'},
  d:{s:'dumbledore',t:'Our house in Godric’s Hollow wasn’t always peaceful. My sister was unwell, and Mother held it together with small things. I see that now.',next:'e'},
  e:{s:'dumbledore',t:'So, the next lesson. Five different days. A home stays safe the same way it gets safe: a little, often.',opts:[
   {t:'Five days. A little, often.',next:'f',do:[{quest:['the-open-door','advance']}]}]},
  f:{s:'narrator',t:'He snaps a book shut with a happy sigh and offers you a sherbet lemon from his pocket. It has a bit of lint on it.',end:true,do:[{xp:['home',600]}]}}},

 'the-open-door-3':{who:'dumbledore',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At nightfall Albus walks with you to your own front door. Peter waves from a nearby roof. Piotr nods from the road.',next:'b'},
  b:{s:'dumbledore',t:'Five days. Can you feel it? A house breathes differently once it’s been looked after.',next:'c'},
  c:{s:'dumbledore',t:'One more thing, and then I’ll leave you in peace. Every good keeper of a house has a closing ritual.',opts:[
   {t:'A spell?',next:'spell'},
   {t:'Like locking up?',next:'lock'}]},
  spell:{s:'dumbledore',t:'In a way. Though the wand is entirely optional. As it is, I suspect, for most of the best spells.',next:'d'},
  lock:{s:'dumbledore',t:'Exactly that, and a little more.',next:'d'},
  d:{s:'dumbledore',t:'Last thing at night, walk through the house. Put one thing right. Check the doors. Leave one light on for whoever wakes.',next:'e'},
  e:{s:'narrator',t:'He hands you a small brass lamp. When he taps it, a soft gold flame blooms inside and doesn’t flicker.',next:'f'},
  f:{s:'dumbledore',t:'It lights for anyone who needs it, and never for anyone who means harm. I’m rather proud of that one. Took me most of a term.',next:'g'},
  g:{s:'dumbledore',t:'Who do you think it’ll light for first?',opts:[
   {t:'My kids, after a bad dream.',next:'kids'},
   {t:'My wife, coming home late.',next:'wife'},
   {t:'Me, honestly.',next:'me'}]},
  kids:{s:'dumbledore',t:'Then it will be the best spell I ever cast. And I have cast some terrible show-offs.',next:'h'},
  wife:{s:'dumbledore',t:'Then keep it in the window. People ought to see from the road that someone is waiting up.',next:'h'},
  me:{s:'dumbledore',t:'Good. The keeper of a house needs a light too. People forget that. I forget it constantly.',next:'h'},
  h:{s:'dumbledore',t:'Goodnight, {name}. Your house is a safe place now. Keep it that way, one small spell at a time.',end:true,do:[{quest:['the-open-door','complete']}]}}},

 // ---------------- Maximum Effort (Wade, Home, tier 4) ----------------
 'maximum-effort-1':{who:'deadpool',bg:'facility-scenes/habits.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Someone has wedged a red couch into the Workshop doorway. A man in a red suit is lying on it, eating a chimichanga.',next:'b'},
  b:{s:'deadpool',t:'Oh hey, it’s the main character! Love the little quest marker over your head. Very slimming. Is that a ring light?',next:'c'},
  c:{s:'deadpool',t:'I’m Wade. I’m the home quest after the wizard. I know. Following Dumbledore is like following fireworks with a kazoo solo. A sad kazoo.',next:'d'},
  d:{s:'deadpool',t:'Here’s my pitch. My apartment looks like a raccoon threw a rave. Not Rocket. Different raccoon. My roommate Al is blind and she still complains.',opts:[
   {t:'Why not just clean it?',next:'why'},
   {t:'How bad is bad?',next:'bad'},
   {t:'Who are you winking at behind me?',next:'wall'}]},
  why:{s:'deadpool',t:'Because cleaning is boring and I have the attention span of a... ooh, butterfly. Wait. What were we doing?',next:'e'},
  bad:{s:'deadpool',t:'I found a sock that had developed opinions. Political ones. We don’t talk anymore.',next:'e'},
  wall:{s:'deadpool',t:'Just the folks reading this. Say hi. No? Rude. Tough crowd tonight.',next:'e'},
  e:{s:'deadpool',t:'Okay, real talk for one second, don’t get used to it. Vanessa’s coming over next week. I want it to look like somebody who loves her lives there.',next:'offer'},
  offer:{s:'deadpool',t:'So, team-up. Twelve chores each. Loser buys chimichangas. Winner also buys chimichangas. I just really want chimichangas.',opts:[
   {t:'Team-up. (Start “Maximum Effort”)',next:'yes',do:[{quest:['maximum-effort','start']}]},
   {t:'Hard pass, Wade.',next:'no'}]},
  yes:{s:'deadpool',t:'Yes! Montage! Somebody cue the eighties synth. Wham, ideally.',end:true},
  no:{s:'deadpool',t:'Wow. Rejected by the protagonist. I’ll just be here. On the couch. In the door. Forever. Like a metaphor.',end:true}}},

 'maximum-effort-2':{who:'deadpool',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Wade waits at the fountain in yellow rubber gloves pulled on over his suit. They squeak when he waves.',next:'b'},
  b:{s:'deadpool',t:'Twelve chores! Look at you go. I did nine and a half. The half was the oven. The oven won. The oven always wins.',next:'c'},
  c:{s:'deadpool',t:'Quick poll for the folks at home. Least favorite chore? Go.',opts:[
   {t:'Dishes.',next:'dishes'},
   {t:'Laundry. It never ends.',next:'laundry'},
   {t:'The bathroom. Don’t ask.',next:'bath'}]},
  dishes:{s:'deadpool',t:'Dishes are a hydra. Wash one, two more show up in the sink. I respect the dishes. I fear the dishes.',next:'d'},
  laundry:{s:'deadpool',t:'Laundry is the one enemy I can’t out-heal. And I once regrew a whole leg. It was a baby leg for a while. Long story.',next:'d'},
  bath:{s:'deadpool',t:'Not asking. Not asking so hard. I am the reigning champion of not asking.',next:'d'},
  d:{s:'deadpool',t:'But here’s what I figured out between oven rounds. It’s not one big clean. Big cleans are for trailers.',next:'e'},
  e:{s:'deadpool',t:'It’s the boring sequel nobody asked for. Seven different days. A little every day, so it never gets back to raccoon rave.',opts:[
   {t:'Seven days. The boring sequel.',next:'f',do:[{quest:['maximum-effort','advance']}]}]},
  f:{s:'deadpool',t:'That’s the spirit! And hey. Thanks for not making me do this alone. That part isn’t a bit. Okay. Moment over.',end:true,do:[{xp:['home',700]}]}}},

 'maximum-effort-3':{who:'deadpool',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Wade’s apartment is clean. Actually clean. There’s a candle on the table and a bowl of fruit that is not plastic.',next:'b'},
  b:{s:'deadpool',t:'Don’t say anything. I know. I cried a little when I saw the floor. It’s wood! Who knew? Colossus knew. He’s been very smug.',next:'c'},
  c:{s:'deadpool',t:'She came over. She sat on the couch. Nothing stuck to her. Best night of my life, and I’ve been to space. Twice. Once on purpose.',opts:[
   {t:'Proud of you, Wade.',next:'proud'},
   {t:'Was it worth it?',next:'worth'},
   {t:'Is the oven okay?',next:'oven'}]},
  proud:{s:'deadpool',t:'Stop. The mask isn’t waterproof. Okay, it is, but not emotionally.',next:'d'},
  worth:{s:'deadpool',t:'Every sock. The place felt like somebody wanted her there. Turns out that’s what clean actually means. Colossus knew that too. Ugh.',next:'d'},
  oven:{s:'deadpool',t:'We’ve reached a ceasefire. It’s tense. There are treaties. Al is mediating.',next:'d'},
  d:{s:'deadpool',t:'Seven days, you and me. Here’s the part they cut from the trailer. You didn’t clean just for you either, did you?',opts:[
   {t:'No. I did it for my family.',next:'family'},
   {t:'A little for me, too.',next:'me'}]},
  family:{s:'deadpool',t:'Yeah. Thought so. Big tough guys mopping floors for the people they love. That’s the real superhero stuff. Don’t tell Logan I said that.',next:'e'},
  me:{s:'deadpool',t:'Good. You live there too, champ. You deserve a floor you can see.',next:'e'},
  e:{s:'narrator',t:'He hands you a poster board. It’s a chore chart, covered in glitter, unicorn stickers and a drawing of Wade giving a thumbs-up.',next:'f'},
  f:{s:'deadpool',t:'The Ten-Minute Tidy. Every night, one loud song, clean till it ends. Dancing is mandatory. I will know. I always know.',next:'g'},
  g:{s:'deadpool',t:'Maximum effort, {name}. In tiny doses. Roll credits! Stay for the post-credits scene. Kidding. There isn’t one. Go home. It’s clean.',end:true,do:[{quest:['maximum-effort','complete']}]}}},

 // ---------------- Who You Decide to Be (Revan, Discipline, tier 4) ----------------
 'who-you-decide-1':{who:'revan',bg:'facility-scenes/museum.webp',start:'a',nodes:{
  a:{s:'narrator',t:'In the Library’s quietest corner sits a figure in a dark hooded robe. A battered mask rests on the table, face down.',next:'b'},
  b:{s:'revan',t:'Sit. I’ve been reading your file. Kaladin’s oath. Stephen’s drills. Patience from Anakin, of all people. I’d have liked to see that.',next:'c'},
  c:{s:'revan',t:'I was someone else once. A conqueror. Then the Council took my memory, my name, all of it, and I had to choose who to be with nothing to lean on.',opts:[
   {t:'How did you choose?',next:'how'},
   {t:'Do you still think about who you were?',next:'past'},
   {t:'Why is the mask face down?',next:'mask'}]},
  how:{s:'revan',t:'Not once. Every day. On the Ebon Hawk I chose it again each morning, with Malak out there somewhere hunting me.',next:'offer'},
  past:{s:'revan',t:'Every day. He doesn’t get to steer anymore. But I keep him close, so I remember the road I came back on.',next:'offer'},
  mask:{s:'revan',t:'I don’t need to see it to remember. I keep it near so I never get to pretend it wasn’t me.',next:'offer'},
  offer:{s:'revan',t:'Your trial. Twelve disciplined acts. A screen left dark. A routine kept. A temptation turned down. Each one on purpose.',next:'offer2'},
  offer2:{s:'revan',t:'Not willpower in a burst. Choice. Will you take it?',opts:[
   {t:'I’ll take it. (Start “Who You Decide to Be”)',next:'yes',do:[{quest:['who-you-decide','start']}]},
   {t:'Not yet.',next:'no'}]},
  yes:{s:'revan',t:'Then go. Watch for the moment right before each choice. That moment is where you live now.',end:true},
  no:{s:'revan',t:'That’s a choice too. I respect it. I’ll be here when you decide.',end:true}}},

 'who-you-decide-2':{who:'revan',bg:'facility-scenes/roaming.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Revan is in the Library courtyard, moving through slow forms with a training staff. He finishes the set before he speaks.',next:'b'},
  b:{s:'revan',t:'Twelve. I watched a few. You hesitated on some. Good. Hesitating means you were choosing, not coasting.',next:'c'},
  c:{s:'revan',t:'Which one was hardest?',opts:[
   {t:'Putting the phone down at night.',next:'phone'},
   {t:'Getting up when the alarm went off.',next:'alarm'},
   {t:'Keeping my temper.',next:'temper',do:[{flag:'revan-temper'}]}]},
  phone:{s:'revan',t:'The little glowing thing that wants every minute you have. The Sith would have loved it. Put it down and you get your evening back.',next:'d'},
  alarm:{s:'revan',t:'The first choice of the day decides more than it looks like. Win that one and the rest stand on it.',next:'d'},
  temper:{s:'revan',t:'I know that fight. Anger feels like strength. It’s a loan. Malak took it out in full, and I watched what the interest did to him.',next:'d'},
  d:{s:'revan',t:'The dark side promises speed. Power now. Discipline is slower: who you turn into after a hundred quiet choices nobody saw.',next:'e'},
  e:{s:'revan',t:'Seven different days. The same deliberate choices, until the man you’re choosing is just who you are.',opts:[
   {t:'Seven days. I’ll choose it each time.',next:'f',do:[{quest:['who-you-decide','advance']}]}]},
  f:{s:'narrator',t:'He nods once and tosses you the staff. You catch it. He looks almost pleased, which for Revan is practically a parade.',end:true,do:[{xp:['discipline',700]}]}}},

 'who-you-decide-3':{who:'revan',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Night on the hill above the village. Revan stands with his hood down and the mask in his hands, looking up at the stars.',next:'b'},
  b:{s:'revan',t:'Seven days. You chose the same self every morning. That isn’t a habit anymore. That’s you.',next:'c'},
  c:{s:'revan',t:'I used to think light and dark were a war out there. Malachor, the Star Forge. They weren’t. It was a choice I made each morning. Like you.',opts:[
   {t:'Do you ever slip?',next:'slip'},
   {t:'What did you choose, in the end?',next:'chose'}]},
  slip:{s:'revan',t:'Of course. Slipping isn’t falling. Falling is deciding to stay down. I get back up. Bastila made sure of that.',next:'d'},
  chose:{s:'revan',t:'Not the Jedi. Not the Sith. Myself. The one who protects what he loves. Every day, on purpose.',next:'d'},
  d:{s:'narrator',t:'He turns the mask over. A crack runs down its center. From it he pries a small crystal glowing soft violet.',next:'e'},
  e:{s:'revan',t:'The last piece of who I was. I want it to go somewhere better. Violet. Between the blue and the red. Fitting, isn’t it.',next:'f'},
  f:{s:'revan',t:'Every morning, hold it and say one sentence: who you’re deciding to be today. Then go be him.',opts:[
   {t:'Today I’ll be a man who keeps his word.',next:'word'},
   {t:'Today I’ll be present for my family.',next:'present'},
   {t:'Out loud? That feels odd.',next:'odd'}]},
  word:{s:'revan',t:'Good. Say it again tomorrow, and the day after. That’s the whole secret. There isn’t a better one.',next:'g'},
  present:{s:'revan',t:'Then that’s where your discipline points. Not at a list. At them.',next:'g'},
  odd:{s:'revan',t:'Then whisper it. The crystal doesn’t care about volume. You care about the words.',next:'g'},
  g:{s:'revan',t:'You were someone. Now you decide who you are. May the Force be with you, {name}.',end:true,do:[{quest:['who-you-decide','complete']}]}}},

 // ---------------- Ninety-Nine (Wise Old Man, Hobbies, tier 4) ----------------
 'ninety-nine-1':{who:'wiseoldman',bg:'facility-scenes/fishing.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A man with a magnificent white beard is fishing at the Guildhall pond. He is also knitting, and reading a book propped on his tackle box.',next:'b'},
  b:{s:'wiseoldman',t:'Don’t mind me. Fishing, crafting and reading at once. At ninety-nine the real skill is not getting bored.',next:'c'},
  c:{s:'wiseoldman',t:'You’re the one Thor threw a feast for! Ash’s badge, Harry’s Snitch. Splendid. You’ve learned to play. Now let’s learn to learn.',next:'d'},
  d:{s:'wiseoldman',t:'I’ve got ninety-nine in every skill there is. Not for the cape. Well. Partly for the cape. Mostly because each one made the world bigger.',opts:[
   {t:'Every skill? That’s absurd.',next:'absurd'},
   {t:'Which one was your favorite?',next:'fav'},
   {t:'Didn’t you rob a bank once?',next:'bank'}]},
  absurd:{s:'wiseoldman',t:'Absurd and true, my favorite combination. Took decades and I loved nearly every hour. Except agility. Nobody loves agility.',next:'offer'},
  fav:{s:'wiseoldman',t:'Whichever one I’m training next. Always. The day you pick a favorite, you stop climbing.',next:'offer'},
  bank:{s:'wiseoldman',t:'Allegedly! A small misunderstanding with a vault in Draynor. The party hat was already in my bag when I got there. Moving on!',next:'offer'},
  offer:{s:'wiseoldman',t:'Your task: twelve sessions of a hobby. Read, build, draw, play, practice. Something you’d do even if nobody ever saw it.',opts:[
   {t:'Teach me. (Start “Ninety-Nine”)',next:'yes',do:[{quest:['ninety-nine','start']}]},
   {t:'Maybe later.',next:'no'}]},
  yes:{s:'wiseoldman',t:'Excellent! And pick at least one thing you’re bad at. Being a beginner is the most fun a grown man can legally have.',end:true},
  no:{s:'wiseoldman',t:'Ah well. I have time. I have, frankly, an alarming amount of time.',end:true}}},

 'ninety-nine-2':{who:'wiseoldman',bg:'facility-scenes/apothecary.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Wise Old Man has taken over a Guildhall workbench. He is grinding herbs with one hand and fletching arrows with the other.',next:'b'},
  b:{s:'wiseoldman',t:'Twelve sessions! Tell me everything. No, tell me the best bit. I’m old, not immortal. Mostly not.',next:'c'},
  c:{s:'wiseoldman',t:'What surprised you?',opts:[
   {t:'How fast the time went.',next:'fast'},
   {t:'How bad I was at the new thing.',next:'bad',do:[{flag:'wom-beginner'}]},
   {t:'That I missed it on the days I skipped.',next:'missed'}]},
  fast:{s:'wiseoldman',t:'That’s the sign. When the hours vanish, you’ve found something that feeds you. Guard it like a rare drop.',next:'d'},
  bad:{s:'wiseoldman',t:'Wonderful! Being bad is the entry fee. At level one, every fumble is experience. You level up just by trying.',next:'d'},
  missed:{s:'wiseoldman',t:'Ah. Then it isn’t just a hobby anymore. It’s part of you. That’s how all of mine started. Except runecrafting. That was spite.',next:'d'},
  d:{s:'wiseoldman',t:'Now, the grind. Every ninety-nine I have was built on ordinary afternoons, not heroic weekends.',next:'e'},
  e:{s:'wiseoldman',t:'Seven different days. A little practice each. The experience piles up whether you watch the bar or not.',opts:[
   {t:'Seven days. Let’s grind.',next:'f',do:[{quest:['ninety-nine','advance']}]}]},
  f:{s:'narrator',t:'He tosses you a fresh arrow. “For luck,” he says. “Also I made ninety of them and I need the room.”',end:true,do:[{xp:['hobbies',700]}]}}},

 'ninety-nine-3':{who:'wiseoldman',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'The Wise Old Man’s cottage is crammed with trophies: a dragon’s head, a stuffed fish, and a suspicious number of party hats.',next:'b'},
  b:{s:'wiseoldman',t:'Seven days! You’re a proper student now. Ash will be unbearable about it. Thor is already planning a second feast.',next:'c'},
  c:{s:'wiseoldman',t:'Here’s the secret of the cape. Every master started as somebody who simply wouldn’t stop being curious.',opts:[
   {t:'I’ll never master everything.',next:'never'},
   {t:'Will I ever be as good as you?',next:'good'}]},
  never:{s:'wiseoldman',t:'Neither will I! They keep adding new skills. That isn’t the tragedy. That’s the gift.',next:'d'},
  good:{s:'wiseoldman',t:'Better, perhaps. You have people to share it with. I spent far too many years alone in a bank vault. Ahem. A library.',next:'d'},
  d:{s:'narrator',t:'From a chest he draws a long scarf stitched from scraps of every color, skill after skill woven end to end. The last foot of it is blank.',next:'e'},
  e:{s:'wiseoldman',t:'Every thread is something I learned. The blank part is yours. Each time you learn something new, stitch one thread.',next:'f'},
  f:{s:'wiseoldman',t:'So. What’ll you stitch first?',opts:[
   {t:'Something I can share with my kids.',next:'kids'},
   {t:'Something just for me.',next:'me'},
   {t:'The thing I was worst at.',next:'worst'}]},
  kids:{s:'wiseoldman',t:'Oh, the best kind. A skill shared with a child grows twice. Theirs and yours.',next:'g'},
  me:{s:'wiseoldman',t:'Good. A man needs something that’s only his. It keeps the rest of him generous.',next:'g'},
  worst:{s:'wiseoldman',t:'Ha! A true adventurer. Start where it’s hardest. That thread will be the proudest one on there.',next:'g'},
  g:{s:'wiseoldman',t:'Off you go, {name}. Keep learning for the fun of it. And if anyone asks about the bank, you never met me.',end:true,do:[{quest:['ninety-nine','complete']}]}}},
};
