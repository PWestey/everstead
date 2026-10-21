// Quests for Discipline (Kaladin, Stephen, Anakin) and Hobbies (Ash, Harry, Thor).
// The engine builds steps and rewards from `tier`; these trees follow the iron-body format in lib/dialogue.mjs.

/** @type {Record<string,any>} */
export const QUESTS={
 'the-first-promise':{name:'The First Promise',area:'discipline',giver:'kaladin',tier:1,
  blurb:'Kaladin has been counting your mornings at the Library. Old bridgeman habit. He wants to see if you can keep a promise to yourself.',
  say:['Talk to Kaladin on the Library steps.','Report back to Kaladin on the Library roof.','Meet Kaladin on the old footbridge as the storm rolls in.']},
 'the-humble-hand':{name:'The Humble Hand',area:'discipline',giver:'stephen',tier:2,
  blurb:'Stephen heard you kept your word to Kaladin. He is unimpressed by one promise. He wants to see a pattern.',
  say:['Talk to Stephen in the Library’s back room.','Report back to Stephen at his reading table.','Meet Stephen in the village museum after closing.']},
 'the-patient-flame':{name:'The Patient Flame',area:'discipline',giver:'anakin',tier:3,
  blurb:'Anakin doesn’t want to teach you. He wants a training partner who won’t let him skip the slow parts.',
  say:['Talk to Anakin behind the Library.','Report back to Anakin in the Library courtyard.','Meet Anakin at the edge of the wheat field at sunset.']},
 'the-first-badge':{name:'The First Badge',area:'hobbies',giver:'ash',tier:1,
  blurb:'Ash nearly flattened you at the Guildhall door, and now he really, really wants to know what your thing is.',
  say:['Talk to Ash at the Guildhall.','Report back to Ash on the Guildhall fence.','Meet Ash at the fishing pond at dawn.']},
 'the-room-for-joy':{name:'The Room for Joy',area:'hobbies',giver:'harry',tier:2,
  blurb:'Harry wants to know when you last did something just because you liked it, and he won’t accept “I don’t remember.”',
  say:['Talk to Harry in the Guildhall yard.','Report back to Harry in the meadow.','Meet Harry by the fountain under the stars.']},
 'a-feast-worth-having':{name:'A Feast Worth Having',area:'hobbies',giver:'thor',tier:3,
  blurb:'Thor heard about Ash’s badge and Harry’s golden ball, and he is openly jealous. He wants a story of his own, and a feast to end it.',
  say:['Talk to Thor at the Guildhall.','Report back to Thor down at the river.','Join Thor at the Guildhall feast.']},
};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- The First Promise (Kaladin, Discipline, tier 1) ----------------
 'the-first-promise-1':{who:'kaladin',bg:'facility-scenes/apothecary.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Kaladin sits on the Library steps, not inside. A spear leans beside him. He’s watching storm clouds build in the east, like he’s timing them.',next:'b'},
  b:{s:'kaladin',t:'You’re the one who comes here every morning. Eleven days running. I count things. Old bridgeman habit.',next:'c'},
  c:{s:'kaladin',t:'Used to think discipline was for men with something to lose. Then I lost everything. Routine was the only thing that got me off the floor.',opts:[
   {t:'What kept you going?',next:'kept'},
   {t:'Some days I don’t feel like trying.',next:'feel'},
   {t:'You don’t seem like a Library man.',next:'lib'}]},
  kept:{s:'kaladin',t:'Nothing grand. Get up. Carry the bridge. Eat Rock’s stew. Do it again. You don’t promise to win. Just the next step.',next:'offer'},
  feel:{s:'kaladin',t:'Good. Me neither, most days. Some mornings it storms in my head. I still walk out.',next:'offer'},
  lib:{s:'kaladin',t:'I’m not. Too many walls. Syl likes it, though. And the people here keep their word to themselves. I like being near that.',next:'offer'},
  offer:{s:'kaladin',t:'So here’s one for you. Three things you said you’d do. Phone down, routine kept, focus held. Then come find me.',opts:[
   {t:'You have my word. (Start “The First Promise”)',next:'yes',do:[{quest:['the-first-promise','start']}]},
   {t:'Not yet.',next:'no'}]},
  yes:{s:'kaladin',t:'Don’t give it to me. Give it to yourself. I’m just the one who’ll notice.',end:true},
  no:{s:'kaladin',t:'Then not yet. At least that’s honest. I’ll be here. These steps aren’t going anywhere.',end:true}}},

 'the-first-promise-2':{who:'kaladin',bg:'facility-scenes/northern.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Kaladin is up on the Library roof now, legs over the edge, wind tugging at his blue coat. He waves you up the ladder.',next:'b'},
  b:{s:'kaladin',t:'Three. You kept all three. Syl’s been insufferable about it. She bet on you.',next:'c'},
  c:{s:'kaladin',t:'Be straight with me. What almost stopped you?',opts:[
   {t:'My phone. It’s always right there.',next:'phone',do:[{flag:'kaladin-phone'}]},
   {t:'Being tired. Just tired.',next:'tired'},
   {t:'Nothing. It was easier than I thought.',next:'easy'}]},
  phone:{s:'kaladin',t:'Then put distance between you. In the chasms we didn’t carry anything we didn’t need. Leave it in another room.',next:'d'},
  tired:{s:'kaladin',t:'I know tired. Tired lies. It tells you tomorrow will be easier. It never is. You carry today’s load, that’s all.',next:'d'},
  easy:{s:'kaladin',t:'It was easy because you started small. Remember that the next time you want to promise the whole world on a Monday.',next:'d'},
  d:{s:'kaladin',t:'Now the harder part. Not three things in one push. Three separate days. Do it, sleep, do it again.',next:'e'},
  e:{s:'kaladin',t:'With Bridge Four, day two was always worse than day one. Day three, that’s when you find out who you are.',opts:[
   {t:'Three days. I’ll be there.',next:'f',do:[{quest:['the-first-promise','advance']}]}]},
  f:{s:'narrator',t:'He presses a smooth river stone into your palm. One side has a single short line scratched into it with a knife.',next:'g'},
  g:{s:'kaladin',t:'One line for today. Bring it back with two more.',end:true,do:[{xp:['discipline',500]}]}}},

 'the-first-promise-3':{who:'kaladin',bg:'facility-scenes/journey.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Thunder rolls over the hills. Kaladin stands in the middle of the old footbridge, rain running down his face. He looks almost happy.',next:'b'},
  b:{s:'kaladin',t:'Three days. Let’s see the stone.',next:'c'},
  c:{s:'narrator',t:'You hold it out. Three lines now. Kaladin runs his thumb across them slowly, the way a soldier checks a strap before a march.',next:'d'},
  d:{s:'kaladin',t:'At my lowest, there were men who needed me to get up. Teft. Rock. The rest of Bridge Four. I didn’t get up for me. Not at first.',opts:[
   {t:'Who do you get up for now?',next:'who'},
   {t:'I think I get up for my family.',next:'family'}]},
  who:{s:'kaladin',t:'Them. Me. My little brother, still. The man I want to be next year. The answer changes. Getting up doesn’t.',next:'e'},
  family:{s:'kaladin',t:'Then you’re ahead of me. Took me a long time to figure that out. On the dark days, picture their faces. It helps.',next:'e'},
  e:{s:'narrator',t:'He unwinds a strip of worn leather from the grip of his spear and knots it around the stone.',next:'f'},
  f:{s:'kaladin',t:'Keep it in your pocket. When you want to quit, feel the lines. You kept your word before. You can do it again.',opts:[
   {t:'I’ll carry it.',next:'carry'},
   {t:'And when I break the streak?',next:'break'}]},
  carry:{s:'kaladin',t:'I know. I’ve been watching.',next:'g'},
  break:{s:'kaladin',t:'Then you start again the next morning. I’ve fallen more times than I can count. Staying down is the only real loss.',next:'g'},
  g:{s:'kaladin',t:'Storm’s passing. Go home, {name}. Kiss your kids. I’ll be on the steps, counting.',end:true,do:[{quest:['the-first-promise','complete']}]}}},

 // ---------------- The Humble Hand (Stephen, Discipline, tier 2) ----------------
 'the-humble-hand-1':{who:'stephen',bg:'facility-scenes/school.webp',start:'a',nodes:{
  a:{s:'narrator',t:'In the Library’s back room, Stephen traces the same glowing circle in the air. Again. Again. His scarred hands tremble, and he starts over.',next:'b'},
  b:{s:'stephen',t:'Don’t hover. If you’re going to watch, be useful. Hand me that book. No, the other one. The one that isn’t growling.',next:'c'},
  c:{s:'stephen',t:'I was the best surgeon on the eastern seaboard. Then I lost my hands and discovered I was spectacularly bad at being a beginner.',opts:[
   {t:'You still look like an expert to me.',next:'expert'},
   {t:'Being a beginner is hard at my age too.',next:'beginner'},
   {t:'Why the same circle over and over?',next:'circle'}]},
  expert:{s:'stephen',t:'Flattery. Charming. Useless. Wong tried that once, briefly. Experts are just beginners who got over the embarrassment.',next:'d'},
  beginner:{s:'stephen',t:'Of course it is. It’s humiliating. That’s rather the point. You have to put your pride down before you can pick anything up.',next:'d'},
  circle:{s:'stephen',t:'Because one of these, eventually, opens a door. The first several thousand are just me paying the toll.',next:'d'},
  d:{s:'stephen',t:'Kaladin says you kept a promise to yourself. Lovely. One promise is a coin toss. Show me a pattern.',next:'e'},
  e:{s:'stephen',t:'Five acts of discipline. Routines, boundaries, focus. No grand gestures. Reps. Then tell me what you noticed.',opts:[
   {t:'Five. Consider it done. (Start “The Humble Hand”)',next:'yes',do:[{quest:['the-humble-hand','start']}]},
   {t:'Let me think about it.',next:'no'}]},
  yes:{s:'stephen',t:'Don’t consider it done. Do it. Then it’s done. Precision matters. I used to open people up for a living.',end:true},
  no:{s:'stephen',t:'Think quickly. Time is the one thing I’ve promised not to bend for anyone. Long story.',end:true}}},

 'the-humble-hand-2':{who:'stephen',bg:'facility-scenes/apothecary.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Stephen sits at a reading table buried in books, a cup of cold tea at his elbow. The red cloak over his chair twitches when you walk in.',next:'b'},
  b:{s:'stephen',t:'Five. Good. Now, what did you notice? And don’t say “it was hard.” Hard is the baseline. I want specifics.',opts:[
   {t:'How often I reach for distraction.',next:'reach',do:[{flag:'stephen-distraction'}]},
   {t:'That I wanted credit for it.',next:'credit'},
   {t:'That it got quieter in my head.',next:'quiet'}]},
  reach:{s:'stephen',t:'Good. You can’t treat what you haven’t diagnosed. Most people never notice. They just wonder where the evening went.',next:'d'},
  credit:{s:'stephen',t:'Ha. Now that’s honest. I wanted applause for every suture I ever tied. The work doesn’t clap. Do it anyway.',next:'d'},
  quiet:{s:'stephen',t:'That quiet is the useful part. Most people fill it immediately. Phone, noise, anything. Don’t.',next:'d'},
  d:{s:'stephen',t:'Next, four days. Four separate days. I’m not asking for perfect. I’m asking you to come back.',next:'e'},
  e:{s:'stephen',t:'At Kamar-Taj they had me reading and sweeping for months before anyone let me near a real spell. Coming back is the whole curriculum.',opts:[
   {t:'Four days. I’ll return.',next:'f',do:[{quest:['the-humble-hand','advance']}]}]},
  f:{s:'narrator',t:'He flicks his wrist. A ring of amber sparks hangs in the air for a heartbeat, then fades. His hand barely shakes.',next:'g'},
  g:{s:'stephen',t:'Years of circles for that. Go. Your road is shorter than mine was. Fewer interdimensional threats, for one.',end:true,do:[{xp:['discipline',600]}]}}},

 'the-humble-hand-3':{who:'stephen',bg:'facility-scenes/museum.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The village museum after closing. Stephen stands before a glass case. Inside is nothing but a cracked, ordinary wristwatch.',next:'b'},
  b:{s:'stephen',t:'Four days. You came back every time. Before I give you anything, I wanted you to see this.',next:'c'},
  c:{s:'stephen',t:'Christine gave me that watch. It broke the night I lost my hands. I never fixed it. Every crack is a day I wanted to quit and didn’t.',opts:[
   {t:'Why keep something broken?',next:'why'},
   {t:'What finally made you stop quitting?',next:'stop'}]},
  why:{s:'stephen',t:'Because the man I was would have thrown it out and bought a nicer one. Keeping it is how I remember I’m not him.',next:'d'},
  stop:{s:'stephen',t:'The Ancient One told me to set my ego aside. I resented her enormously. She was right. Good advice is usually irritating.',next:'d'},
  d:{s:'stephen',t:'Kaladin gave you a rock. Sentimental soldier. I’m giving you something with an actual function.',next:'e'},
  e:{s:'narrator',t:'He sets a small brass hourglass on the case. The sand inside glows faintly gold, like the sparks from his fingers.',next:'f'},
  f:{s:'stephen',t:'Fifteen minutes. Turn it when you sit down to focus. No screens, no wandering until it runs out. Then turn it again, if you’re brave.',opts:[
   {t:'Is it magic?',next:'magic'},
   {t:'Thank you, Stephen. Truly.',next:'thanks'}]},
  magic:{s:'stephen',t:'It’s sand and glass. The magic is you sitting still for fifteen minutes. Tell no one I said anything that sincere.',next:'g'},
  thanks:{s:'stephen',t:'Accepted. Now stop looking at me like that. The cloak is getting ideas.',next:'g'},
  g:{s:'stephen',t:'You’ve earned the right to call yourself a student, {name}. From me, that’s practically a parade.',end:true,do:[{quest:['the-humble-hand','complete']}]}}},

 // ---------------- The Patient Flame (Anakin, Discipline, tier 3) ----------------
 'the-patient-flame-1':{who:'anakin',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Behind the Library, Anakin has a little training droid split open on a workbench. Parts everywhere. Sand in some of them, somehow. He’s glaring at it.',next:'b'},
  b:{s:'anakin',t:'It won’t hold still long enough for me to fix it. Which is funny. Obi-Wan used to say that about me. Constantly.',next:'c'},
  c:{s:'anakin',t:'Stephen says you study. Kaladin says you keep your word. Everyone talks about you like you’re patient. It’s a little annoying.',opts:[
   {t:'I’m not. I just keep showing up.',next:'showing'},
   {t:'And you’re not patient?',next:'notpatient'},
   {t:'I’m trying. Some days it’s a fight.',next:'fight'}]},
  showing:{s:'anakin',t:'That’s more than I’ve ever managed. Give me a burning ship and I’m fine. A normal Tuesday? That’s what beats me.',next:'d'},
  notpatient:{s:'anakin',t:'Me? I was building droids out of junk and winning podraces at nine. Talent made me fast. It never made me patient.',next:'d'},
  fight:{s:'anakin',t:'Same. Every day. The trick, apparently, is not letting the fight turn into anger. Still working on that part.',next:'d'},
  d:{s:'anakin',t:'Look, honestly? I don’t need to teach you. I need somebody to train next to. Someone who won’t let me skip the slow parts.',next:'e'},
  e:{s:'anakin',t:'Eight disciplines. The boring ones. Routines, screens, focus. I do mine, you do yours. We compare when you’re done.',opts:[
   {t:'Deal. We train together. (Start “The Patient Flame”)',next:'yes',do:[{quest:['the-patient-flame','start']}]},
   {t:'I don’t have it in me right now.',next:'no'}]},
  yes:{s:'anakin',t:'Good. And if you finish first, don’t gloat. I will, if I win. Fair warning.',end:true},
  no:{s:'anakin',t:'I get it. Rest is part of it too, or so I keep being told. Find me when you’re ready. I’ll still be fixing this thing.',end:true}}},

 'the-patient-flame-2':{who:'anakin',bg:'ui-scenes/Bg_City_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Anakin is pacing the Library courtyard. The training droid floats beside him, whole again, humming steadily.',next:'b'},
  b:{s:'anakin',t:'Eight. You beat me. I got to six, then stayed up all night rebuilding an engine nobody asked for. It’s very fast now.',next:'c'},
  c:{s:'anakin',t:'I always do this. I pour everything into one thing and let the rest fall apart. You ever do that?',opts:[
   {t:'All the time. I go all in, then I crash.',next:'crash',do:[{flag:'anakin-crash'}]},
   {t:'Less than it used to.',next:'less'},
   {t:'You fixed the droid, though.',next:'droid'}]},
  crash:{s:'anakin',t:'Then we’ve got the same enemy. It’s not laziness. It’s running way too hot, then going cold.',next:'d'},
  less:{s:'anakin',t:'Then you’ve learned something I haven’t. Hold on to it. I’ve seen what happens when someone stops watching himself.',next:'d'},
  droid:{s:'anakin',t:'I did. And I skipped meditation to do it. Obi-Wan would give me that look. The beard-stroking look.',next:'d'},
  d:{s:'anakin',t:'So the next test is for both of us. Five days. Not your best day ever. Just enough, five times, steady.',next:'e'},
  e:{s:'anakin',t:'Steady is the hardest thing in the galaxy. Harder than the Boonta Eve. And I’ve won the Boonta Eve.',opts:[
   {t:'Five days. Steady. Together.',next:'f',do:[{quest:['the-patient-flame','advance']}]}]},
  f:{s:'narrator',t:'He sets the droid spinning. It fires a soft sting of light at your arm. You flinch. Anakin laughs out loud.',next:'g'},
  g:{s:'anakin',t:'Lesson one. Breathe before you react. Don’t look at me like that, I’m practicing it too.',end:true,do:[{xp:['discipline',800]}]}}},

 'the-patient-flame-3':{who:'anakin',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Two lanterns at the edge of the wheat field. Anakin sits cross-legged in the grass, eyes closed. Obi-Wan stands a little apart, hands tucked in his sleeves.',next:'b'},
  b:{s:'obiwan',t:'Five days, and he hasn’t taken a single thing apart in anger. I confess I didn’t believe it until I saw it myself.',next:'c'},
  c:{s:'anakin',t:'He’s exaggerating. The other two times I took things apart very calmly.',next:'d'},
  d:{s:'anakin',t:'You did it, {name}. Steady, every day. Watching you made me want to be steadier. That’s never happened before. Don’t spread it around.',next:'e'},
  e:{s:'anakin',t:'When I was a kid, I thought if I got strong enough, I could stop every bad thing from happening. Turns out that’s not how it works.',opts:[
   {t:'What do you believe now?',next:'believe'},
   {t:'You don’t have to carry everything.',next:'carry'}]},
  believe:{s:'anakin',t:'That I can’t control everything. Just what I do next. Maybe that’s all discipline is. Picking the next thing, calmly.',next:'f'},
  carry:{s:'anakin',t:'Obi-Wan tells me that all the time. It lands different from someone who actually trained next to me.',next:'f'},
  f:{s:'narrator',t:'Anakin holds out the little training droid. It hums softly and settles into your palm.',next:'g'},
  g:{s:'anakin',t:'Had it since I was a youngling. I rebuilt it for you. It goes quiet when you’ve been still long enough.',opts:[
   {t:'You built this for me?',next:'built'},
   {t:'It’ll sit beside Kaladin’s stone and Stephen’s hourglass.',next:'shelf'}]},
  built:{s:'anakin',t:'Every night this week. Slowly. No skipped steps. You taught me that, so it seemed fair.',next:'h'},
  shelf:{s:'anakin',t:'A rock, an hourglass and a droid. Weird collection. It suits you.',next:'h'},
  h:{s:'obiwan',t:'Well done, both of you. Patience looks good on you, Anakin. Do try to keep it past breakfast.',next:'i'},
  i:{s:'anakin',t:'Go home. Sleep. Do it again tomorrow. That’s the whole secret, and I hate how simple it is.',end:true,do:[{quest:['the-patient-flame','complete']}]}}},

 // ---------------- The First Badge (Ash, Hobbies, tier 1) ----------------
 'the-first-badge-1':{who:'ash',bg:'facility-scenes/expo.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Guildhall doors bang open and Ash barrels out, cap on backwards, Pikachu clinging to his shoulder. He nearly knocks you flat.',next:'b'},
  b:{s:'ash',t:'Whoa, sorry! Hey, you’re new at the Guildhall, right? So what’s your thing? Everybody here’s got a thing!',next:'c'},
  c:{s:'ash',t:'Mine’s training! Since I was ten. I overslept my first day leaving Pallet Town, and I’ve still never had a boring morning since.',opts:[
   {t:'I used to love reading. I don’t have time anymore.',next:'reading'},
   {t:'I’m not sure I have a thing.',next:'nothing'},
   {t:'I like lots of things. I never stick with one.',next:'many'}]},
  reading:{s:'ash',t:'Used to? Nope. No way. If you loved it once, it’s still in there. You just gotta go find it again!',next:'offer'},
  nothing:{s:'ash',t:'Everybody’s got a thing! Maybe you just haven’t met yours yet. That’s the best part. You get to go look!',next:'offer'},
  many:{s:'ash',t:'That’s not a problem, that’s a whole region to explore! You don’t need just one. You just gotta actually show up for them.',next:'offer'},
  offer:{s:'ash',t:'Okay, challenge time! Three hobby things. Read, play, make something, learn something. Then come show me!',opts:[
   {t:'You’re on! (Start “The First Badge”)',next:'yes',do:[{quest:['the-first-badge','start']}]},
   {t:'Maybe later, Ash.',next:'no'}]},
  yes:{s:'ash',t:'Yes! I knew it! Pikachu, you hear that? Okay, go, go, go!',end:true},
  no:{s:'ash',t:'Aw, man. Okay. But I’m gonna ask again. I always ask again!',end:true}}},

 'the-first-badge-2':{who:'ash',bg:'facility-scenes/roaming.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Ash is perched on the Guildhall fence with a half-eaten sandwich, explaining type matchups to a very patient crow.',next:'b'},
  b:{s:'ash',t:'You did three! That’s awesome! Okay, okay, which one was the best?',opts:[
   {t:'Honestly? The one I almost skipped.',next:'skipped'},
   {t:'Doing something just for fun. I forgot how that felt.',next:'fun',do:[{flag:'ash-fun'}]},
   {t:'They were all kind of hard to fit in.',next:'hard'}]},
  skipped:{s:'ash',t:'Ha! That happens to me all the time. The day I don’t feel like training is always the day I learn something new.',next:'d'},
  fun:{s:'ash',t:'Right?! That feeling is the whole reason! Grown-ups forget it. Brock says I never grew up. I think that’s a compliment.',next:'d'},
  hard:{s:'ash',t:'Yeah. But you fit them in, so they fit! You make room and the room gets bigger. That’s how it works. I think.',next:'d'},
  d:{s:'ash',t:'Okay, round two! Three different days. Anybody can do something cool once. A real trainer comes back the next day too.',next:'e'},
  e:{s:'ash',t:'I lost my first League. And a bunch after that. Kept coming back. Honestly the losses taught me more than the badges did.',opts:[
   {t:'Three days. Let’s go.',next:'f',do:[{quest:['the-first-badge','advance']}]}]},
  f:{s:'ash',t:'That’s the spirit! Hey, want half my sandwich? It’s a really good sandwich. Brock made it.',end:true,do:[{xp:['hobbies',500]}]}}},

 'the-first-badge-3':{who:'ash',bg:'facility-scenes/fishing.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Dawn at the fishing pond. Ash is already here, practically bouncing. Misty sits on the dock beside him with a rod, rolling her eyes.',next:'b'},
  b:{s:'misty',t:'He’s been up since four. He wouldn’t stop talking about you. Please take him. I’m trying to fish.',next:'c'},
  c:{s:'ash',t:'Three days! You did it! Okay, okay, I made you something. Close your eyes!',opts:[
   {t:'Close your eyes.',next:'closed'},
   {t:'Sneak a peek.',next:'peek'}]},
  closed:{s:'narrator',t:'Something small and cool lands in your hand. Ash is breathing very loudly.',next:'d'},
  peek:{s:'narrator',t:'You peek. Ash is hiding something behind his back, grinning so wide it looks like it hurts. He shoves it into your hand anyway.',next:'d'},
  d:{s:'narrator',t:'It’s a badge hammered out of a bottle cap and painted Guildhall green. It’s a little lopsided. It’s perfect.',next:'e'},
  e:{s:'ash',t:'The official Everstead Guildhall Badge! There’s only one in the whole world. Every trainer remembers their first badge. I sure do.',next:'f'},
  f:{s:'misty',t:'He was up all night on it. He hit his thumb with the hammer. Twice. I heard it from my tent.',next:'g'},
  g:{s:'ash',t:'Totally worth it! So? So? What do you think?',opts:[
   {t:'It’s perfect. Thank you, Ash.',next:'perfect'},
   {t:'So what’s the next badge?',next:'next'}]},
  perfect:{s:'ash',t:'You earned it! I just made it. That’s different.',next:'h'},
  next:{s:'ash',t:'Ha! That’s the right question! There’s always a next one. That’s the best part!',next:'h'},
  h:{s:'ash',t:'Keep doing the thing you love, {name}. Every single morning. That’s my only rule!',end:true,do:[{quest:['the-first-badge','complete']}]}}},

 // ---------------- The Room for Joy (Harry, Hobbies, tier 2) ----------------
 'the-room-for-joy-1':{who:'harry',bg:'facility-scenes/expo.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Harry is in the Guildhall yard, mending the twigs of an old broom with a pocketknife. His glasses keep sliding down his nose.',next:'b'},
  b:{s:'harry',t:'Ash says you got one of his bottle-cap badges. He’s made four for himself, you know. Yours is the first he’s given away.',next:'c'},
  c:{s:'harry',t:'Can I ask you something? When did you last do something just because you liked it? Not because it was useful.',opts:[
   {t:'I honestly can’t remember.',next:'cant'},
   {t:'This week, thanks to Ash.',next:'week'},
   {t:'Fun feels selfish when there’s so much to do.',next:'selfish'}]},
  cant:{s:'harry',t:'Yeah. I grew up in a cupboard under the stairs. Fun wasn’t really on offer. When I finally found some, I hung on with both hands.',next:'d'},
  week:{s:'harry',t:'Good. That’s a start. The tricky bit is keeping it when everything gets loud. And it does get loud.',next:'d'},
  selfish:{s:'harry',t:'I used to think that. Then I watched people fight so the rest of us could have ordinary, happy days. Wasting them felt rude.',next:'d'},
  d:{s:'harry',t:'What I’ve worked out is, it doesn’t just happen. You have to guard it. Like Quidditch practice. Wood never let us skip.',next:'e'},
  e:{s:'harry',t:'Five hobby things. A chapter, a game, something you make. Guard the time like it’s match day, because honestly it is.',opts:[
   {t:'I’ll guard it. (Start “The Room for Joy”)',next:'yes',do:[{quest:['the-room-for-joy','start']}]},
   {t:'Not this week.',next:'no'}]},
  yes:{s:'harry',t:'Brilliant. Find me after. I’ll be the one covered in broom twigs.',end:true},
  no:{s:'harry',t:'Fair enough. The broom’s not going anywhere. Neither am I.',end:true}}},

 'the-room-for-joy-2':{who:'harry',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Harry is in the meadow behind the Guildhall, tossing a small gold ball into the air and catching it without looking.',next:'b'},
  b:{s:'harry',t:'Five! Ron owes me a Sickle. He bet you’d get dragged off by work.',opts:[
   {t:'Work did try to steal it. I said no.',next:'guard',do:[{flag:'harry-guarded'}]},
   {t:'I nearly did get distracted.',next:'almost'},
   {t:'Who’s Ron?',next:'ron'}]},
  guard:{s:'harry',t:'Brilliant. Saying no is the spell nobody teaches at Hogwarts. Most useful one there is.',next:'d'},
  almost:{s:'harry',t:'Nearly doesn’t count. You came back. That’s the bit that counts.',next:'d'},
  ron:{s:'harry',t:'My best mate, back home. He’d like you. He’d also eat all your food and then ask what’s for pudding.',next:'d'},
  d:{s:'harry',t:'Now the trick is making it normal. Four different days. Not one huge binge on a Saturday. A bit of fun on a Tuesday, too.',next:'e'},
  e:{s:'harry',t:'My best days at school weren’t the big matches. They were dull evenings in the common room with Ron and Hermione. Exploding Snap, mostly.',opts:[
   {t:'Four days. Ordinary joy.',next:'f',do:[{quest:['the-room-for-joy','advance']}]}]},
  f:{s:'narrator',t:'He tosses you the gold ball. It flutters tiny silver wings once in your palm, then goes still.',next:'g'},
  g:{s:'harry',t:'Hang on to that for now. You’ll see what it’s for.',end:true,do:[{xp:['hobbies',600]}]}}},

 'the-room-for-joy-3':{who:'harry',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Night at the village fountain. Harry sits on the rim, his wand lit like a little lamp, broom propped beside him.',next:'b'},
  b:{s:'harry',t:'Four days. You did it. And I don’t reckon you even noticed it getting easier.',next:'c'},
  c:{s:'harry',t:'Did you bring the ball?',opts:[
   {t:'Right here.',next:'here'},
   {t:'It kept flying off. I nearly lost it twice.',next:'lost'}]},
  lost:{s:'harry',t:'Ha! That’s a good sign. It only wanders off for people who are actually having fun. Mine used to escape during Potions.',next:'here'},
  here:{s:'narrator',t:'You hold it out. It wakes, wings blurring, and hovers just above your hand.',next:'d'},
  d:{s:'harry',t:'It’s a practice Snitch. Mine, from first year. It only wakes up for someone playing because they love it. Not to win. Just to play.',next:'e'},
  e:{s:'harry',t:'I want you to have it. If it stops moving for a while, that’s your sign. You’ve let everything get too loud again.',opts:[
   {t:'I can’t take your first-year ball.',next:'refuse'},
   {t:'I’ll keep it moving. I promise.',next:'promise'}]},
  refuse:{s:'harry',t:'You can. I’ve got the real one now. Dumbledore left it to me, long story. Besides, you need the reminder more than I do.',next:'f'},
  promise:{s:'harry',t:'Good. And let your kids see it fly. That’s how they learn fun is allowed.',next:'f'},
  f:{s:'narrator',t:'The little ball does a lazy loop around your head and tucks itself into your coat pocket like it’s always lived there.',next:'g'},
  g:{s:'harry',t:'Go on, then. Go play something, {name}. And yes, I’m pulling rank. Boy Who Lived and all that.',end:true,do:[{quest:['the-room-for-joy','complete']}]}}},

 // ---------------- A Feast Worth Having (Thor, Hobbies, tier 3) ----------------
 'a-feast-worth-having-1':{who:'thor',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'A crash from the Guildhall. Thor fills the doorway, holding a lute with a snapped string, looking delighted and extremely guilty.',next:'b'},
  b:{s:'thor',t:'Friend! I was attempting music. Music has won this round. I shall win the next. Possibly with a gentler grip.',next:'c'},
  c:{s:'thor',t:'Young Ash says you earned his badge. Harry says a little golden ball lives in your pocket now! I’m jealous. I want a story too!',next:'d'},
  d:{s:'thor',t:'Tell me. What did you love as a boy, before the world told you to be serious?',opts:[
   {t:'Building things. Models, forts, anything.',next:'build'},
   {t:'Stories. I could read for days.',next:'stories'},
   {t:'Games with my friends. Hours of them.',next:'games'}]},
  build:{s:'thor',t:'A maker! Excellent! The dwarves of Nidavellir would buy you a drink. A very small drink. Very strong.',next:'e'},
  stories:{s:'thor',t:'A lover of sagas! Asgard’s skalds would have fought over you. I have many stories. Some of them are even true.',next:'e'},
  games:{s:'thor',t:'Ha! A warrior of games! I once lost an entire feast’s worth of riddles to my brother. He cheated. He always cheated.',next:'e'},
  e:{s:'thor',t:'I have lost a great deal. A home. A father. A brother, several times. Do you know what kept me standing? Joy. Stubborn, foolish joy.',next:'f'},
  f:{s:'thor',t:'So, a quest! Eight deeds of joy. Read, build, play, learn. Do them with your whole heart, and then we feast!',opts:[
   {t:'For the feast! (Start “A Feast Worth Having”)',next:'yes',do:[{quest:['a-feast-worth-having','start']}]},
   {t:'I’m too busy for this right now, Thor.',next:'no'}]},
  yes:{s:'thor',t:'That is the spirit! Go! And if you see a spare lute string, bring it to me. Or several.',end:true},
  no:{s:'thor',t:'Busy! The great enemy of mortals. Very well. The feast will wait. I am patient. Mostly. Not really.',end:true}}},

 'a-feast-worth-having-2':{who:'thor',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Thor is skipping stones across the river. Each one bounces far farther than it has any right to, with a faint crackle of thunder.',next:'b'},
  b:{s:'thor',t:'Eight! You have done it! Tell me, which deed brought you the most joy?',opts:[
   {t:'The one I did with my kids.',next:'kids',do:[{flag:'thor-kids'}]},
   {t:'The one I actually finished. I don’t finish much.',next:'finish'},
   {t:'The one that was hard to learn.',next:'learn'}]},
  kids:{s:'thor',t:'Ah! The best kind. Joy with little ones counts twice. Someday they will tell that story at a feast of their own.',next:'d'},
  finish:{s:'thor',t:'Then you have slain a beast most never face: the unfinished thing. Mount its head on your wall!',next:'d'},
  learn:{s:'thor',t:'Good! Being terrible at something is how it starts. You should hear me on that lute. You will, actually. It is still terrible.',next:'d'},
  d:{s:'thor',t:'Now the harder part. A feast is not one great meal. It is many good days. Five different days of joy, my friend.',next:'e'},
  e:{s:'thor',t:'Not grim duty. Not another chore wearing a fun hat. Real joy. If it feels like work, you are doing it wrong.',opts:[
   {t:'Five days of real joy. Done.',next:'f',do:[{quest:['a-feast-worth-having','advance']}]}]},
  f:{s:'narrator',t:'Thor hands you a flat river stone. You skip it. It sinks immediately. He laughs so hard he has to sit down in the mud.',next:'g'},
  g:{s:'thor',t:'Practice! That is your first deed of the five. I insist.',end:true,do:[{xp:['hobbies',800]}]}}},

 'a-feast-worth-having-3':{who:'thor',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Guildhall is full of light and noise. Long tables groan with food. Ash, Harry and half the village are already here.',next:'b'},
  b:{s:'thor',t:'THERE HE IS! The hero of the feast! Sit, sit! You have earned the head of the table! Someone bring him a plate the size of a shield!',next:'c'},
  c:{s:'ash',t:'I told everyone about your badge! Harry told everyone about the Snitch! Thor told everyone about everything!',next:'d'},
  d:{s:'harry',t:'He also told them about your stone skipping. Both stones sank. He did the sound effects. Twice.',next:'e'},
  e:{s:'narrator',t:'Thor sets a carved drinking horn in front of you. Runes wind around it. One of them, you realize, spells your name.',next:'f'},
  f:{s:'thor',t:'In Asgard every warrior had a horn. You raise it for what you made, what you learned, and who you shared it with. Then you drink.',opts:[
   {t:'To the people I love.',next:'love'},
   {t:'To starting again, every morning.',next:'again'},
   {t:'To Thor, who wouldn’t let me stay serious.',next:'tothor'}]},
  love:{s:'thor',t:'The finest toast! Joy with no one to share it is just noise. Drink!',next:'g'},
  again:{s:'ash',t:'Every morning! That’s my rule! He stole my rule! Thor, he stole my rule!',next:'g'},
  tothor:{s:'thor',t:'Ha! I accept! And I never will, my friend. Never!',next:'g'},
  g:{s:'narrator',t:'The whole hall raises its cups. In the corner, Thor finally strikes a lute chord that is almost right. Nobody has the heart to tell him.',next:'h'},
  h:{s:'thor',t:'Remember this night, {name}. When the days go grey, remember: joy isn’t the reward for the work. It’s the point of it.',end:true,do:[{quest:['a-feast-worth-having','complete']}]}}},
};
