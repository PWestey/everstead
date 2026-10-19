// Quests for Discipline (Kaladin, Stephen, Anakin) and Hobbies (Ash, Harry, Thor).
// The engine builds steps and rewards from `tier`; these trees follow the iron-body format in lib/dialogue.mjs.

/** @type {Record<string,any>} */
export const QUESTS={
 'the-first-promise':{name:'The First Promise',area:'discipline',giver:'kaladin',tier:1,
  blurb:'Kaladin has been counting your mornings at the Library. He wants to see if you can keep a promise to yourself.',
  say:['Talk to Kaladin on the Library steps.','Report back to Kaladin on the Library roof.','Meet Kaladin on the old footbridge as the storm rolls in.']},
 'the-humble-hand':{name:'The Humble Hand',area:'discipline',giver:'stephen',tier:2,
  blurb:'Stephen heard you kept your word to Kaladin. One promise is a coin toss; he wants to see a pattern.',
  say:['Talk to Stephen in the Library’s back room.','Report back to Stephen at his reading table.','Meet Stephen in the village museum after closing.']},
 'the-patient-flame':{name:'The Patient Flame',area:'discipline',giver:'anakin',tier:3,
  blurb:'Anakin doesn’t want to teach you. He wants a training partner who won’t let him skip the slow parts.',
  say:['Talk to Anakin behind the Library.','Report back to Anakin in the Library courtyard.','Meet Anakin at the edge of the wheat field at sunset.']},
 'the-first-badge':{name:'The First Badge',area:'hobbies',giver:'ash',tier:1,
  blurb:'Ash nearly knocked you over at the Guildhall door, and now he wants to know what your thing is.',
  say:['Talk to Ash at the Guildhall.','Report back to Ash on the Guildhall fence.','Meet Ash at the fishing pond at dawn.']},
 'the-room-for-joy':{name:'The Room for Joy',area:'hobbies',giver:'harry',tier:2,
  blurb:'Harry wants to know when you last did something just because you liked it, and he won’t accept “I don’t remember.”',
  say:['Talk to Harry in the Guildhall yard.','Report back to Harry in the meadow.','Meet Harry by the fountain under the stars.']},
 'a-feast-worth-having':{name:'A Feast Worth Having',area:'hobbies',giver:'thor',tier:3,
  blurb:'Thor has heard about Ash’s badge and Harry’s golden ball. He wants a story of joy too, and a feast to end it.',
  say:['Talk to Thor at the Guildhall.','Report back to Thor down at the river.','Join Thor at the Guildhall feast.']},
};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- The First Promise (Kaladin, Discipline, tier 1) ----------------
 'the-first-promise-1':{who:'kaladin',bg:'facility-scenes/apothecary.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Kaladin sits on the Library steps, not inside. A spear leans beside him. He is watching storm clouds gather in the east.',next:'b'},
  b:{s:'kaladin',t:'You’re the one who comes here every morning. I’ve been counting. I count everything. Old habit.',next:'c'},
  c:{s:'kaladin',t:'I used to think discipline was for men with something to lose. Then I lost everything, and it was the only thing that kept me breathing.',opts:[
   {t:'What kept you going?',next:'kept'},
   {t:'Some days I don’t feel like trying.',next:'feel'},
   {t:'You don’t seem like a Library man.',next:'lib'}]},
  kept:{s:'kaladin',t:'One step. Then the next one. You don’t promise to win. You promise to take the next step.',next:'offer'},
  feel:{s:'kaladin',t:'Good. Neither do I. Feelings are weather. A promise is the ground you stand on while it storms.',next:'offer'},
  lib:{s:'kaladin',t:'I’m not. Too many walls. But the people who come here keep their word to themselves. I like being near that.',next:'offer'},
  offer:{s:'kaladin',t:'So here’s a promise for you. Three things you said you’d do: a screen put away, a routine kept, a focus held. Then find me.',opts:[
   {t:'You have my word. (Start “The First Promise”)',next:'yes',do:[{quest:['the-first-promise','start']}]},
   {t:'Not yet.',next:'no'}]},
  yes:{s:'kaladin',t:'Don’t give your word to me. Give it to yourself. I’ll just be the one who notices.',end:true},
  no:{s:'kaladin',t:'Then not yet. That’s honest, at least. The steps will still be here.',end:true}}},

 'the-first-promise-2':{who:'kaladin',bg:'facility-scenes/northern.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Kaladin is on the Library roof now, legs over the edge, wind tugging at his coat. He waves you up the ladder.',next:'b'},
  b:{s:'kaladin',t:'Three. You kept all three. Do you know how rare that is?',next:'c'},
  c:{s:'kaladin',t:'Be honest with me. What almost stopped you?',opts:[
   {t:'My phone. It’s always right there.',next:'phone',do:[{flag:'kaladin-phone'}]},
   {t:'Being tired. Just tired.',next:'tired'},
   {t:'Nothing. It was easier than I thought.',next:'easy'}]},
  phone:{s:'kaladin',t:'Then put distance between you and it. A bridge is easier to carry when you stop looking back every ten steps.',next:'d'},
  tired:{s:'kaladin',t:'I know tired. Tired lies. It says tomorrow will be easier. It never is. Today is the only load you get to carry.',next:'d'},
  easy:{s:'kaladin',t:'It was easy because you started small. Remember that when you’re tempted to promise too much at once.',next:'d'},
  d:{s:'kaladin',t:'Now the harder part. Not three things in one burst. Three different days. Show up, rest, then show up again.',next:'e'},
  e:{s:'kaladin',t:'My men learned that the second day hurts more than the first. The third day is when you find out who you are.',opts:[
   {t:'Three days. I’ll be there.',next:'f',do:[{quest:['the-first-promise','advance']}]}]},
  f:{s:'narrator',t:'He presses a smooth river stone into your hand. One side is scratched with a single short line.',next:'g'},
  g:{s:'kaladin',t:'One line for today. Bring it back with two more.',end:true,do:[{xp:['discipline',500]}]}}},

 'the-first-promise-3':{who:'kaladin',bg:'facility-scenes/journey.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Thunder rolls over the hills. Kaladin stands in the middle of the old footbridge, rain on his face, completely calm.',next:'b'},
  b:{s:'kaladin',t:'Three days. Show me the stone.',next:'c'},
  c:{s:'narrator',t:'You hold it out. Three lines now, one for each day. Kaladin runs his thumb over them slowly, like they mean something. They do.',next:'d'},
  d:{s:'kaladin',t:'At my lowest, there were men who needed me to get up. I didn’t get up for me. Not at first.',opts:[
   {t:'Who do you get up for now?',next:'who'},
   {t:'I think I get up for my family.',next:'family'}]},
  who:{s:'kaladin',t:'Them. Me. The man I want to be next year. The answer changes. The getting up doesn’t.',next:'e'},
  family:{s:'kaladin',t:'Then you already know more than I did. Hold on to them. On the dark days, they’re the reason.',next:'e'},
  e:{s:'narrator',t:'He unwinds a strip of worn leather from the grip of his spear and ties it around the stone.',next:'f'},
  f:{s:'kaladin',t:'Keep it in your pocket. When you want to quit, feel the lines. You’ve kept your word before. You can keep it again.',opts:[
   {t:'I’ll carry it.',next:'carry'},
   {t:'And when I break the streak?',next:'break'}]},
  carry:{s:'kaladin',t:'I know you will. I’ve watched you.',next:'g'},
  break:{s:'kaladin',t:'You start again the next morning. A broken streak isn’t the end. Staying down is.',next:'g'},
  g:{s:'kaladin',t:'The storm’s passing. Go home, {name}. I’ll be on the Library steps, counting.',end:true,do:[{quest:['the-first-promise','complete']}]}}},

 // ---------------- The Humble Hand (Stephen, Discipline, tier 2) ----------------
 'the-humble-hand-1':{who:'stephen',bg:'facility-scenes/school.webp',start:'a',nodes:{
  a:{s:'narrator',t:'In the Library’s back room, Stephen Strange traces the same circle in the air. Again. Again. His scarred hands tremble, and he starts over.',next:'b'},
  b:{s:'stephen',t:'Don’t hover. If you’re going to watch, be useful. Hand me that book. No, the other one.',next:'c'},
  c:{s:'stephen',t:'I was the best surgeon alive. Then I lost my hands, and I discovered I was very bad at being a beginner.',opts:[
   {t:'You still look like an expert to me.',next:'expert'},
   {t:'Being a beginner is hard at my age too.',next:'beginner'},
   {t:'Why the same circle over and over?',next:'circle'}]},
  expert:{s:'stephen',t:'Flattery. Charming. Also useless. Experts are just beginners who refused to stay embarrassed.',next:'d'},
  beginner:{s:'stephen',t:'Yes. It’s humiliating. That’s the point. Pride is the first thing you put down if you want to pick up anything new.',next:'d'},
  circle:{s:'stephen',t:'Because the ten-thousandth circle is the one that opens the door. The first nine thousand are just paying the toll.',next:'d'},
  d:{s:'stephen',t:'Kaladin tells me you kept a promise to yourself. Fine. One promise is a coin toss. Let’s see a pattern.',next:'e'},
  e:{s:'stephen',t:'Five habits of discipline. Routines, boundaries, focus. No grand gestures. Repetition. Then tell me what you noticed.',opts:[
   {t:'Five. Consider it done. (Start “The Humble Hand”)',next:'yes',do:[{quest:['the-humble-hand','start']}]},
   {t:'Let me think about it.',next:'no'}]},
  yes:{s:'stephen',t:'Don’t consider it done. Do it. Then it’s done. Words matter.',end:true},
  no:{s:'stephen',t:'Think quickly, then. Time is the one thing I won’t bend for you.',end:true}}},

 'the-humble-hand-2':{who:'stephen',bg:'facility-scenes/apothecary.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Stephen sits at a reading table buried in books, a cup of cold tea at his elbow. He doesn’t look up.',next:'b'},
  b:{s:'stephen',t:'Five. Good. Now tell me what you noticed. And don’t say “it was hard.” Everything worth doing is hard.',opts:[
   {t:'How often I reach for distraction.',next:'reach',do:[{flag:'stephen-distraction'}]},
   {t:'That I wanted credit for it.',next:'credit'},
   {t:'That it got quieter in my head.',next:'quiet'}]},
  reach:{s:'stephen',t:'Good. You can’t fight what you can’t see. Most people never see it. They just wonder where the evening went.',next:'d'},
  credit:{s:'stephen',t:'Ha. Now that is honest. I wanted applause for every stitch I ever made. The work doesn’t clap. Do it anyway.',next:'d'},
  quiet:{s:'stephen',t:'That quiet is where the real work happens. Most people fill it immediately. Don’t.',next:'d'},
  d:{s:'stephen',t:'Now I want four days. Four separate days of discipline. Not perfection. Return.',next:'e'},
  e:{s:'stephen',t:'I swept a mountain temple’s floors for months before anyone let me near a spell. Returning is the whole curriculum.',opts:[
   {t:'Four days. I’ll return.',next:'f',do:[{quest:['the-humble-hand','advance']}]}]},
  f:{s:'narrator',t:'He flicks his wrist. A ring of amber sparks hangs in the air for a heartbeat, then fades. His hand is barely shaking.',next:'g'},
  g:{s:'stephen',t:'Years of circles for that. Go. Your road is shorter than mine was.',end:true,do:[{xp:['discipline',600]}]}}},

 'the-humble-hand-3':{who:'stephen',bg:'facility-scenes/museum.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The village museum after closing. Stephen stands before a glass case that holds nothing but a cracked, ordinary wristwatch.',next:'b'},
  b:{s:'stephen',t:'Four days. You came back each time. I wanted to show you this before I gave you anything.',next:'c'},
  c:{s:'stephen',t:'That watch was a gift. I wear it broken now. Every crack is a day I wanted to quit and didn’t.',opts:[
   {t:'Why keep something broken?',next:'why'},
   {t:'What finally made you stop quitting?',next:'stop'}]},
  why:{s:'stephen',t:'Because the man I was would have thrown it away. Keeping it is how I remember I’m not him anymore.',next:'d'},
  stop:{s:'stephen',t:'A teacher told me to set my ego aside. I resented her for it. She was right. Most good advice is annoying.',next:'d'},
  d:{s:'stephen',t:'Kaladin gave you a stone. Sentimental soldier. I’m giving you something more practical.',next:'e'},
  e:{s:'narrator',t:'He sets a small brass hourglass on the case. The sand inside glows faintly gold, like the sparks from his hands.',next:'f'},
  f:{s:'stephen',t:'Fifteen minutes. Turn it when you sit down to focus. No screens, no wandering, until it runs out. Then turn it again, if you dare.',opts:[
   {t:'Is it magic?',next:'magic'},
   {t:'Thank you, Stephen. Truly.',next:'thanks'}]},
  magic:{s:'stephen',t:'It’s sand and glass. The magic is you sitting still. Tell no one I said anything that sincere.',next:'g'},
  thanks:{s:'stephen',t:'Gratitude accepted. Now stop looking at me like that.',next:'g'},
  g:{s:'stephen',t:'You’ve earned the right to call yourself a student, {name}. From me, that is high praise.',end:true,do:[{quest:['the-humble-hand','complete']}]}}},

 // ---------------- The Patient Flame (Anakin, Discipline, tier 3) ----------------
 'the-patient-flame-1':{who:'anakin',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Behind the Library, Anakin has a small training droid split open on a workbench. Parts everywhere. He is glaring at it.',next:'b'},
  b:{s:'anakin',t:'It won’t hold still long enough for me to fix it. Which is funny. Obi-Wan used to say the same thing about me.',next:'c'},
  c:{s:'anakin',t:'Stephen says you study. Kaladin says you keep your word. Everyone talks about you like you’re patient.',opts:[
   {t:'I’m not. I just keep showing up.',next:'showing'},
   {t:'And you’re not patient?',next:'notpatient'},
   {t:'I’m trying. Some days it’s a fight.',next:'fight'}]},
  showing:{s:'anakin',t:'That’s more than I ever managed. I’m good at the big moments. It’s the ordinary days that beat me.',next:'d'},
  notpatient:{s:'anakin',t:'Me? I could fly anything before I could read properly. Talent made me fast. It never made me patient.',next:'d'},
  fight:{s:'anakin',t:'Every day is a fight for me too. The trick, apparently, is not letting the fight turn into anger. Still learning that.',next:'d'},
  d:{s:'anakin',t:'I’ll be honest. I don’t need to teach you. I need someone to train beside. Someone who won’t let me skip the slow parts.',next:'e'},
  e:{s:'anakin',t:'Eight disciplines. The boring ones. Your routines, your screens, your focus. I’ll do mine. We compare when you’re done.',opts:[
   {t:'Deal. We train together. (Start “The Patient Flame”)',next:'yes',do:[{quest:['the-patient-flame','start']}]},
   {t:'I don’t have it in me right now.',next:'no'}]},
  yes:{s:'anakin',t:'Good. And if you finish first, don’t gloat. I will, if I win.',end:true},
  no:{s:'anakin',t:'I get it. Rest is part of it too, they keep telling me. Come find me when you’re ready. I’ll still be fixing this thing.',end:true}}},

 'the-patient-flame-2':{who:'anakin',bg:'ui-scenes/Bg_City_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Anakin is pacing the Library courtyard. The training droid floats beside him, whole again, humming steadily.',next:'b'},
  b:{s:'anakin',t:'Eight. You beat me. I got to six, then spent a whole night rebuilding an engine nobody asked for.',next:'c'},
  c:{s:'anakin',t:'I always do this. I pour everything into one thing and let the rest fall apart. Does that ever happen to you?',opts:[
   {t:'All the time. I go all in, then I crash.',next:'crash',do:[{flag:'anakin-crash'}]},
   {t:'Less than it used to.',next:'less'},
   {t:'You fixed the droid, though.',next:'droid'}]},
  crash:{s:'anakin',t:'Then we have the same enemy. It isn’t laziness. It’s burning too hot and then going cold.',next:'d'},
  less:{s:'anakin',t:'Then you’ve learned what I haven’t. Don’t lose it. I’ve seen what happens when someone stops guarding himself.',next:'d'},
  droid:{s:'anakin',t:'I did. And I skipped meditation to do it. Obi-Wan would give me that look. You know the one.',next:'d'},
  d:{s:'anakin',t:'So the next test is for both of us. Five days. Not the most you can do in one day. Just enough, five times, steady.',next:'e'},
  e:{s:'anakin',t:'Steady is the hardest thing in the galaxy. Harder than any podrace.',opts:[
   {t:'Five days. Steady. Together.',next:'f',do:[{quest:['the-patient-flame','advance']}]}]},
  f:{s:'narrator',t:'He sets the droid spinning. It fires a soft sting of light at your arm. You flinch. Anakin laughs.',next:'g'},
  g:{s:'anakin',t:'Lesson one. Breathe before you react. I’ll be practicing that one too.',end:true,do:[{xp:['discipline',800]}]}}},

 'the-patient-flame-3':{who:'anakin',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Two lanterns burn at the edge of the wheat field. Anakin sits cross-legged in the grass, eyes closed. Obi-Wan stands a little apart, watching.',next:'b'},
  b:{s:'obiwan',t:'Five days, and he hasn’t taken anything apart in anger. I confess I didn’t believe it until I saw it.',next:'c'},
  c:{s:'anakin',t:'He’s exaggerating. The other two times I took things apart very calmly.',next:'d'},
  d:{s:'anakin',t:'You did it, {name}. Steady, every day. Watching you made me want to be steadier. That’s never happened to me before.',next:'e'},
  e:{s:'anakin',t:'As a boy I thought if I was strong enough, I could stop every bad thing from happening. I was wrong about that.',opts:[
   {t:'What do you believe now?',next:'believe'},
   {t:'You don’t have to carry everything.',next:'carry'}]},
  believe:{s:'anakin',t:'That I can’t control everything. Only what I do next. Maybe that’s all discipline is. Choosing the next thing calmly.',next:'f'},
  carry:{s:'anakin',t:'Obi-Wan keeps telling me that. It sounds different coming from someone who trained beside me.',next:'f'},
  f:{s:'narrator',t:'Anakin holds out the little training droid. It hums softly and settles into your palm.',next:'g'},
  g:{s:'anakin',t:'It was mine when I was a youngling. I rebuilt it for you. It goes quiet when you’ve been still long enough.',opts:[
   {t:'You built this for me?',next:'built'},
   {t:'It’ll sit beside Kaladin’s stone and Stephen’s hourglass.',next:'shelf'}]},
  built:{s:'anakin',t:'Every night this week. Slowly. No skipped steps. You taught me that, so it seemed fair.',next:'h'},
  shelf:{s:'anakin',t:'A stone, an hourglass and a droid. Strange shrine. It suits you.',next:'h'},
  h:{s:'obiwan',t:'Well done, both of you. Patience suits you, Anakin. Do try to keep it past breakfast.',next:'i'},
  i:{s:'anakin',t:'Go home and rest. Then do it again tomorrow. That’s the whole secret. I hate how simple it is.',end:true,do:[{quest:['the-patient-flame','complete']}]}}},

 // ---------------- The First Badge (Ash, Hobbies, tier 1) ----------------
 'the-first-badge-1':{who:'ash',bg:'facility-scenes/expo.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Guildhall doors bang open and Ash barrels out, cap on backwards, nearly knocking you flat.',next:'b'},
  b:{s:'ash',t:'Whoa, sorry! Hey, you’re new around the Guildhall, right? What’s your thing? Everybody here has a thing!',next:'c'},
  c:{s:'ash',t:'Mine’s training. Has been since I was ten. I still wake up every morning like it’s the very first day.',opts:[
   {t:'I used to love reading. I don’t have time anymore.',next:'reading'},
   {t:'I’m not sure I have a thing.',next:'nothing'},
   {t:'I like lots of things. I never stick with one.',next:'many'}]},
  reading:{s:'ash',t:'Used to? No way. If you loved it once, it’s still in there. You just have to go find it again.',next:'offer'},
  nothing:{s:'ash',t:'Everybody’s got a thing! Sometimes you just haven’t met it yet. That’s the best part. You get to go looking!',next:'offer'},
  many:{s:'ash',t:'That’s not a problem, that’s an adventure! You don’t need just one. You just need to actually show up for them.',next:'offer'},
  offer:{s:'ash',t:'Okay, challenge time! Three hobby habits. Read, play, make something, learn something. Then come show me!',opts:[
   {t:'You’re on! (Start “The First Badge”)',next:'yes',do:[{quest:['the-first-badge','start']}]},
   {t:'Maybe later, Ash.',next:'no'}]},
  yes:{s:'ash',t:'Yes! I knew it! Okay, go, go, go!',end:true},
  no:{s:'ash',t:'Aw, okay. But I’m gonna ask again. I always ask again!',end:true}}},

 'the-first-badge-2':{who:'ash',bg:'facility-scenes/roaming.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Ash is perched on the Guildhall fence with a half-eaten sandwich, explaining battle strategy to a very patient crow.',next:'b'},
  b:{s:'ash',t:'You did three! That’s awesome! So which one was the best?',opts:[
   {t:'Honestly? The one I almost skipped.',next:'skipped'},
   {t:'Doing something just for fun. I forgot how that felt.',next:'fun',do:[{flag:'ash-fun'}]},
   {t:'They were all kind of hard to fit in.',next:'hard'}]},
  skipped:{s:'ash',t:'Ha! Happens to me all the time. The day I don’t want to train is always the day I learn something.',next:'d'},
  fun:{s:'ash',t:'Right?! That feeling is the whole reason. Grown-ups forget it. Don’t you forget it again.',next:'d'},
  hard:{s:'ash',t:'Yeah. But you fit them in, so they fit! That’s how it works. You make room and the room gets bigger.',next:'d'},
  d:{s:'ash',t:'Okay, round two! Three different days. Anybody can do something cool once. A real trainer shows up the next day too.',next:'e'},
  e:{s:'ash',t:'I lost a lot of league battles. I kept coming back. That’s what made me who I am, not the wins.',opts:[
   {t:'Three days. Let’s go.',next:'f',do:[{quest:['the-first-badge','advance']}]}]},
  f:{s:'ash',t:'That’s the spirit! Hey, want half my sandwich? It’s a really good sandwich.',end:true,do:[{xp:['hobbies',500]}]}}},

 'the-first-badge-3':{who:'ash',bg:'facility-scenes/fishing.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Dawn at the fishing pond. Ash is already there, practically bouncing. Misty sits on the dock beside him with a rod, rolling her eyes.',next:'b'},
  b:{s:'misty',t:'He’s been up since four. He would not stop talking about you. Please take him off my hands.',next:'c'},
  c:{s:'ash',t:'Three days! You did it! Okay, okay, I made you something. Close your eyes!',opts:[
   {t:'Close your eyes.',next:'closed'},
   {t:'Sneak a peek.',next:'peek'}]},
  closed:{s:'narrator',t:'Something small and cool is pressed into your hand.',next:'d'},
  peek:{s:'narrator',t:'You peek. Ash is hiding something behind his back, grinning so wide it looks painful. He presses it into your hand anyway.',next:'d'},
  d:{s:'narrator',t:'It’s a badge hammered out of a bottle cap and painted green, the Guildhall’s color. It’s a little lopsided.',next:'e'},
  e:{s:'ash',t:'The Everstead Guildhall Badge! There’s only one in the whole world. Every trainer remembers their first badge.',next:'f'},
  f:{s:'misty',t:'He spent all night on that. He hammered his thumb. Twice.',next:'g'},
  g:{s:'ash',t:'Totally worth it! So? What do you think?',opts:[
   {t:'It’s perfect. Thank you, Ash.',next:'perfect'},
   {t:'So what’s the next badge?',next:'next'}]},
  perfect:{s:'ash',t:'You earned it! I just made it.',next:'h'},
  next:{s:'ash',t:'Ha! That’s the right question! There’s always a next one. That’s the best part.',next:'h'},
  h:{s:'ash',t:'Keep doing the thing you love, {name}. Every morning. That’s the only rule!',end:true,do:[{quest:['the-first-badge','complete']}]}}},

 // ---------------- The Room for Joy (Harry, Hobbies, tier 2) ----------------
 'the-room-for-joy-1':{who:'harry',bg:'facility-scenes/expo.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Harry is in the Guildhall yard, mending the bristles of an old broom with a pocketknife and a great deal of patience.',next:'b'},
  b:{s:'harry',t:'Ash says you got his bottle-cap badge. He’s made four of those for himself, you know. Yours is the first he’s given away.',next:'c'},
  c:{s:'harry',t:'Can I ask you something? When did you last do something just because you liked it? Not because it was useful.',opts:[
   {t:'I honestly can’t remember.',next:'cant'},
   {t:'This week, thanks to Ash.',next:'week'},
   {t:'Fun feels selfish when there’s so much to do.',next:'selfish'}]},
  cant:{s:'harry',t:'Yeah. I grew up in a cupboard. Nobody let me have fun. When I finally found some, I swore I’d never let it go.',next:'d'},
  week:{s:'harry',t:'Good. That’s the start. The hard part is keeping it when life gets loud. It always gets loud.',next:'d'},
  selfish:{s:'harry',t:'I used to think that too. Then I watched people fight for the right to be happy. Joy isn’t selfish. It’s what you’re protecting.',next:'d'},
  d:{s:'harry',t:'Here’s what I learned. Joy doesn’t just happen. You have to guard it, like anything worth having.',next:'e'},
  e:{s:'harry',t:'Five hobby habits. Read a chapter, play a game, make something. Guard the time like it matters, because it does.',opts:[
   {t:'I’ll guard it. (Start “The Room for Joy”)',next:'yes',do:[{quest:['the-room-for-joy','start']}]},
   {t:'Not this week.',next:'no'}]},
  yes:{s:'harry',t:'Brilliant. Come find me after. I’ll be the one covered in broom bristles.',end:true},
  no:{s:'harry',t:'Fair enough. The broom isn’t going anywhere. Neither am I.',end:true}}},

 'the-room-for-joy-2':{who:'harry',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Harry is in the meadow behind the Guildhall, tossing a small gold ball into the air and catching it without looking.',next:'b'},
  b:{s:'harry',t:'Five! Ron owes me a sickle. He bet you’d get dragged off by work.',opts:[
   {t:'Work did try to steal it. I said no.',next:'guard',do:[{flag:'harry-guarded'}]},
   {t:'I nearly did get distracted.',next:'almost'},
   {t:'Who’s Ron?',next:'ron'}]},
  guard:{s:'harry',t:'Saying no is the spell nobody teaches at school. It’s the most useful one there is.',next:'d'},
  almost:{s:'harry',t:'Nearly doesn’t count. You came back. That’s what counts.',next:'d'},
  ron:{s:'harry',t:'My best mate, back home. He’d like you. He’d also eat all your food.',next:'d'},
  d:{s:'harry',t:'Now the trick is making it part of you. Four different days. Not a binge on a Saturday. Joy on a Tuesday, too.',next:'e'},
  e:{s:'harry',t:'My best days at school weren’t the big matches. They were ordinary evenings by the fire with my friends.',opts:[
   {t:'Four days. Ordinary joy.',next:'f',do:[{quest:['the-room-for-joy','advance']}]}]},
  f:{s:'narrator',t:'He tosses you the gold ball. It flutters tiny silver wings once in your palm, then goes still.',next:'g'},
  g:{s:'harry',t:'Hang on to that for now. You’ll see what it’s for.',end:true,do:[{xp:['hobbies',600]}]}}},

 'the-room-for-joy-3':{who:'harry',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Night at the village fountain. Harry sits on the rim by the glow of his wand, broom propped beside him.',next:'b'},
  b:{s:'harry',t:'Four days. You did it, and I don’t think you even noticed it getting easier.',next:'c'},
  c:{s:'harry',t:'Did you bring the ball?',opts:[
   {t:'Right here.',next:'here'},
   {t:'It kept flying off. I nearly lost it twice.',next:'lost'}]},
  lost:{s:'harry',t:'Ha! That’s a good sign. It only flies for people who are actually having fun.',next:'here'},
  here:{s:'narrator',t:'You hold it out. It wakes, wings blurring, and hovers just above your hand.',next:'d'},
  d:{s:'harry',t:'It’s a practice ball. Mine from first year. It only wakes for someone playing for the joy of it. Not to win. Just to play.',next:'e'},
  e:{s:'harry',t:'I want you to keep it. When it stops moving for a while, that’s your sign. You’ve let life get too loud again.',opts:[
   {t:'I can’t take your first-year ball.',next:'refuse'},
   {t:'I’ll keep it moving. I promise.',next:'promise'}]},
  refuse:{s:'harry',t:'You can. I’ve got the real thing now. Besides, you need the reminder more than I do.',next:'f'},
  promise:{s:'harry',t:'Good. And let your kids see it move. That’s how they learn joy is allowed.',next:'f'},
  f:{s:'narrator',t:'The little ball does a lazy loop around your head and settles into your coat pocket like it has always lived there.',next:'g'},
  g:{s:'harry',t:'Go on, then. Go play something, {name}. That’s an order from the Boy Who Lived.',end:true,do:[{quest:['the-room-for-joy','complete']}]}}},

 // ---------------- A Feast Worth Having (Thor, Hobbies, tier 3) ----------------
 'a-feast-worth-having-1':{who:'thor',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'A crash from the Guildhall. Thor fills the doorway, holding a lute with a snapped string, looking delighted and very guilty.',next:'b'},
  b:{s:'thor',t:'Friend! I was attempting music. Music has won this round. I shall win the next.',next:'c'},
  c:{s:'thor',t:'Young Ash says you earned his badge. Harry says a little golden ball lives in your pocket now. I am jealous! I want a story too!',next:'d'},
  d:{s:'thor',t:'Tell me. What did you love as a boy, before the world asked you to be serious?',opts:[
   {t:'Building things. Models, forts, anything.',next:'build'},
   {t:'Stories. I could read for days.',next:'stories'},
   {t:'Games with my friends. Hours of them.',next:'games'}]},
  build:{s:'thor',t:'A maker! Excellent. My people built ships and halls and songs. A man who makes things is never truly lost.',next:'e'},
  stories:{s:'thor',t:'A lover of sagas! The skalds of Asgard would have adored you. We would have been friends there too.',next:'e'},
  games:{s:'thor',t:'Ha! A warrior of games! I once lost a whole feast’s worth of riddles to my brother. He cheated. Probably.',next:'e'},
  e:{s:'thor',t:'I have lost a great deal. A home. A father. A brother, more than once. Do you know what saved me? Joy. Stubborn, foolish joy.',next:'f'},
  f:{s:'thor',t:'So, a quest! Eight deeds of joy. Read, build, play, learn. Do them with your whole heart, and then we feast!',opts:[
   {t:'For the feast! (Start “A Feast Worth Having”)',next:'yes',do:[{quest:['a-feast-worth-having','start']}]},
   {t:'I’m too busy for this right now, Thor.',next:'no'}]},
  yes:{s:'thor',t:'That is the spirit! Go! And if you see a spare lute string, bring it to me.',end:true},
  no:{s:'thor',t:'Busy! The great enemy of mortals. Very well. The feast will wait. I am patient. Mostly.',end:true}}},

 'a-feast-worth-having-2':{who:'thor',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Thor is skipping stones across the river, each one bouncing far farther than it has any right to.',next:'b'},
  b:{s:'thor',t:'Eight! You have done it! Tell me, which deed brought you the most joy?',opts:[
   {t:'The one I did with my kids.',next:'kids',do:[{flag:'thor-kids'}]},
   {t:'The one I actually finished. I don’t finish much.',next:'finish'},
   {t:'The one that was hard to learn.',next:'learn'}]},
  kids:{s:'thor',t:'Ah. Then you have found the best kind. Joy shared with little ones is worth twice as much, and they never forget it.',next:'d'},
  finish:{s:'thor',t:'Then you have slain a beast many never face: the unfinished thing. Hang it on your wall like a trophy!',next:'d'},
  learn:{s:'thor',t:'Good! Being bad at something is how it begins. You should hear me with that lute. You will, actually. It is still bad.',next:'d'},
  d:{s:'thor',t:'Now the harder part. A feast is not one great meal. It is a life of good days. Five different days of joy, my friend.',next:'e'},
  e:{s:'thor',t:'Not grim duty. Not one more chore. Real joy. If it feels like work, you are doing it wrong.',opts:[
   {t:'Five days of real joy. Done.',next:'f',do:[{quest:['a-feast-worth-having','advance']}]}]},
  f:{s:'narrator',t:'Thor hands you a flat river stone. You skip it. It sinks at once. He laughs so hard he has to sit down.',next:'g'},
  g:{s:'thor',t:'Practice! That is your first deed of the five.',end:true,do:[{xp:['hobbies',800]}]}}},

 'a-feast-worth-having-3':{who:'thor',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Guildhall is full of light and noise. Long tables groan with food. Ash, Harry and half the village are already here.',next:'b'},
  b:{s:'thor',t:'THERE HE IS! The hero of the feast! Sit, sit! You have earned the head of the table!',next:'c'},
  c:{s:'ash',t:'I told everyone about your badge! Harry told everyone about the golden ball! Thor told everyone about everything!',next:'d'},
  d:{s:'harry',t:'He also told them about your stone skipping. Both stones sank. He did the sound effects.',next:'e'},
  e:{s:'narrator',t:'Thor sets a carved drinking horn in front of you. Runes wind around it. One of them, you realize, spells your name.',next:'f'},
  f:{s:'thor',t:'In Asgard, every warrior had a horn. You raise it for what you made, what you learned, and who you shared it with.',opts:[
   {t:'To the people I love.',next:'love'},
   {t:'To starting again, every morning.',next:'again'},
   {t:'To Thor, who wouldn’t let me stay serious.',next:'tothor'}]},
  love:{s:'thor',t:'The finest toast! Joy without people is just noise.',next:'g'},
  again:{s:'ash',t:'Every morning! That’s my rule! He stole my rule!',next:'g'},
  tothor:{s:'thor',t:'Ha! I accept! And I never will, my friend. Never.',next:'g'},
  g:{s:'narrator',t:'The whole hall raises its cups with you. In the corner, Thor finally plays a lute chord that is almost right.',next:'h'},
  h:{s:'thor',t:'Remember this night, {name}. When life turns grey, remember that joy is not the reward. It is the point.',end:true,do:[{quest:['a-feast-worth-having','complete']}]}}},
};
