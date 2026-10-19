// Quests for Fatherhood (Din, Logan, Quill) and Fitness (Roy, Grog, Geralt). Format: see lib/dialogue.mjs and lib/quests.mjs.
// Tier counts: 1 = 3 habits / 3 days, 2 = 5 / 4, 3 = 8 / 5, 4 = 12 / 7.

/** @type {Record<string,any>} */
export const QUESTS={
 'wherever-i-go':{name:'Wherever I Go',area:'fatherhood',giver:'din',tier:1,
  blurb:'Din has heard your kids in the Hearth Inn. A father by choice, he wants to know what kind of father you are.',
  say:['Talk to Din at the Hearth Inn.','Report back to Din.','Meet Din in the field past the Hearth Inn at dusk.']},
 'sheathe-the-claws':{name:'Sheathe the Claws',area:'fatherhood',giver:'logan',tier:2,
  blurb:'Logan saw you bring a bad day home to your kids. He has been there, and he won’t let it slide.',
  say:['Talk to Logan on the back step of the Hearth Inn.','Report back to Logan.','Meet Logan under the old pine on the ridge.']},
 'the-mixtape':{name:'The Mixtape',area:'fatherhood',giver:'quill',tier:3,
  blurb:'Quill heard about your talks with Din and Logan, and he refuses to be left out of the Dad Council.',
  say:['Talk to Quill at the Hearth Inn.','Report back to Quill.','Meet Quill on the Hearth Inn roof under the stars.']},
 'the-long-run':{name:'The Long Run',area:'fitness',giver:'roy',tier:2,
  blurb:'Roy heard you finished Darrow’s trial, and he wants to find out how far the two of you can go.',
  say:['Talk to Roy at the Training Yard.','Report back to Roy.','Meet Roy where the meadow road runs out.']},
 'pick-it-up':{name:'Pick It Up, Put It Down',area:'fitness',giver:'grog',tier:3,
  blurb:'Grog thinks you could be Grog strong. His rock, Kevin, is less sure.',
  say:['Talk to Grog at the Training Yard.','Report back to Grog at the Hearth Inn.','Meet Grog at the old quarry.']},
 'steel-and-habit':{name:'Steel and Habit',area:'fitness',giver:'geralt',tier:4,
  blurb:'Geralt has watched you train for weeks. Now he wants to see if you can make it a life.',
  say:['Talk to Geralt at the Training Yard after dark.','Report back to Geralt by the river.','Meet Geralt at the mountain pass above the village.']},
};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- Wherever I Go (Din, Fatherhood, tier 1) ----------------
 'wherever-i-go-1':{who:'din',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Din sits at the end of the long table in the Hearth Inn, helmet on, passing bits of bread to a small green hand under the table.',next:'b'},
  b:{s:'din',t:'You’re the one with kids. I’ve heard them. Loud. Good lungs.',next:'c'},
  c:{s:'din',t:'I was a foundling. Someone chose me. Now I’ve chosen him. Nobody handed me a manual.',opts:[
   {t:'Nobody handed me one either.',next:'same'},
   {t:'How do you do it, in all that armor?',next:'armor'},
   {t:'Mine wear me out.',next:'tired'}]},
  same:{s:'din',t:'Then we learn the same way. One day at a time, with them in sight.',next:'d'},
  armor:{s:'din',t:'The armor keeps him safe. It doesn’t keep him close. That part I do with my hands.',next:'d'},
  tired:{s:'din',t:'Mine bites. Steals snacks. Throws things with his mind. Tired is the price. I’d pay it every time.',next:'d'},
  d:{s:'din',t:'Here’s what I learned on the road. A kid doesn’t remember the bounty. He remembers who was in the cockpit with him.',next:'e'},
  e:{s:'din',t:'Three times, be in the cockpit. A game on the floor. A story at bedtime. Full attention, no screen. Then come tell me.',opts:[
   {t:'Three times. I’ll be there. (Start “Wherever I Go”)',next:'yes',do:[{quest:['wherever-i-go','start']}]},
   {t:'Not right now.',next:'no'}]},
  yes:{s:'din',t:'Good. I’ll be here.',next:'wave'},
  wave:{s:'narrator',t:'A small clawed hand waves at you from under the table.',end:true},
  no:{s:'din',t:'I understand. The table’s not going anywhere. Neither are they. Not yet.',end:true}}},

 'wherever-i-go-2':{who:'din',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Din is at the village fountain, letting the little one splash at the shallow edge. He never takes his eyes off him.',next:'b'},
  b:{s:'din',t:'Three times. I could tell. You walked in lighter.',next:'c'},
  c:{s:'din',t:'What did they do when you were all the way there?',opts:[
   {t:'My youngest wouldn’t let me off the floor.',next:'floor',do:[{flag:'din-floor'}]},
   {t:'They didn’t notice at first. Then they did.',next:'notice'},
   {t:'Honestly? I caught myself reaching for my phone.',next:'phone'}]},
  floor:{s:'din',t:'Then you did it right. When they hold on, that’s the pay.',next:'d'},
  notice:{s:'din',t:'Kids test whether you’re staying. Once they believe it, they start talking.',next:'d'},
  phone:{s:'din',t:'Me too. A comm, a tracker, a job. I leave mine in the ship. Yours can go in a drawer.',next:'d'},
  d:{s:'din',t:'My clan keeps its rites every day, not when it’s convenient. Fathering is the same.',next:'e'},
  e:{s:'din',t:'Be with them on three different days. Not three moments in one afternoon. Three days. They need to learn you come back.',opts:[
   {t:'Three days. They’ll have me.',next:'f',do:[{quest:['wherever-i-go','advance']}]}]},
  f:{s:'narrator',t:'Din lifts the little one out of the water and holds him out to you. He is damp, light, and makes a happy cooing noise.',next:'g'},
  g:{s:'din',t:'He likes you. That doesn’t happen. Go home.',end:true,do:[{xp:['fatherhood',500]}]}}},

 'wherever-i-go-3':{who:'din',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At dusk Din waits in the field beyond the Hearth Inn. The little one is asleep in a satchel against his chest.',next:'b'},
  b:{s:'din',t:'Three days. You showed up for them when it was easy and when it wasn’t.',next:'c'},
  c:{s:'din',t:'Do you know what they’ll remember? Not what you said. That you were there.',next:'d'},
  d:{s:'narrator',t:'He unclips a small disc of bright steel from his belt, stamped with a horned beast, and holds it out.',next:'e'},
  e:{s:'din',t:'A clan signet. I forged a second one in case I ever met someone worth it. Your house is a clan now. Keep it on you.',opts:[
   {t:'I don’t know if I’m worthy of that.',next:'worthy'},
   {t:'My kids are going to love this.',next:'love'}]},
  worthy:{s:'din',t:'Neither did I. Worth isn’t something you have. It’s something you do, every night, at bedtime.',next:'f'},
  love:{s:'din',t:'Then show them. Tell them what it means: a father who comes back. Every time.',next:'f'},
  f:{s:'narrator',t:'The little one stirs, reaches out, pats the signet in your hand, and falls back asleep.',next:'g'},
  g:{s:'din',t:'Go home, {name}. Wherever you go, they go. That is the way.',end:true,do:[{quest:['wherever-i-go','complete']}]}}},

 // ---------------- Sheathe the Claws (Logan, Fatherhood, tier 2) ----------------
 'sheathe-the-claws-1':{who:'logan',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Logan sits on the back step of the Hearth Inn, an unlit cigar in his teeth, watching kids chase fireflies across the yard.',next:'b'},
  b:{s:'logan',t:'Saw you come home yesterday. Rough day. You took a little of it out on the kids, didn’t you?',opts:[
   {t:'Yeah. I snapped at them.',next:'snapped'},
   {t:'That’s none of your business.',next:'business'},
   {t:'It wasn’t that bad.',next:'notbad'}]},
  snapped:{s:'logan',t:'At least you’ll say it. Took me about a hundred years to say it once.',next:'d'},
  business:{s:'logan',t:'Ha. Fair. I said that to a lot of people. Most of ’em were right about me anyway.',next:'d'},
  notbad:{s:'logan',t:'Kids don’t grade on a curve, bub. They remember the bark longer than you do.',next:'d'},
  d:{s:'logan',t:'I lived a long, mean life. Then a kid turned up with my claws and my temper. Scared me worse than any war.',next:'e'},
  e:{s:'logan',t:'Turned out she didn’t need me tough. She needed me to stay. And to stay calm.',next:'f'},
  f:{s:'logan',t:'So. Five times. Show up for your kids on purpose. Play, read, listen. Leave the claws at the door.',opts:[
   {t:'Five times. Claws at the door. (Start “Sheathe the Claws”)',next:'yes',do:[{quest:['sheathe-the-claws','start']}]},
   {t:'Not right now.',next:'no'}]},
  yes:{s:'logan',t:'Good. And if you blow it, you go back and say sorry. That counts too.',end:true},
  no:{s:'logan',t:'Suit yourself. The fireflies’ll be here tomorrow. Kids grow up faster than you think.',end:true}}},

 'sheathe-the-claws-2':{who:'logan',bg:'facility-scenes/northern.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Logan is splitting firewood behind the inn. He sets the axe down when he sees you.',next:'b'},
  b:{s:'logan',t:'Five. Heard ’em laughing through the wall the other night. That was you?',next:'c'},
  c:{s:'logan',t:'Tell me straight. Did you lose your temper?',opts:[
   {t:'Once. Then I apologized.',next:'sorry',do:[{flag:'logan-sorry'}]},
   {t:'Not once. I counted to ten a lot.',next:'counted'},
   {t:'I wanted to. I stepped outside first.',next:'walked'}]},
  sorry:{s:'logan',t:'That’s the whole move. A father who says sorry teaches ’em more than one who’s never wrong.',next:'d'},
  counted:{s:'logan',t:'Ten’s a good number. Some days I had to get to about four hundred.',next:'d'},
  walked:{s:'logan',t:'Smart. Walk it off, come back human. Saved me more times than the metal ever did.',next:'d'},
  d:{s:'logan',t:'Now the long haul. The kid I raised didn’t need one good week. She needed to know I’d be there tomorrow.',next:'e'},
  e:{s:'logan',t:'Four different days. Be with your kids on four separate days. Not a sprint. A habit.',opts:[
   {t:'Four days. I’ll be there.',next:'f',do:[{quest:['sheathe-the-claws','advance']}]}]},
  f:{s:'narrator',t:'Logan hands you the axe. You split the next log clean. He grunts, which from Logan is a speech.',next:'g'},
  g:{s:'logan',t:'Go on. They’re waiting.',end:true,do:[{xp:['fatherhood',500]}]}}},

 'sheathe-the-claws-3':{who:'logan',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Logan sits under an old pine on the ridge above the village. Below, the Hearth Inn’s chimney is smoking.',next:'b'},
  b:{s:'logan',t:'Four days. You kept showing up. I saw your kid run to the door when you got home.',next:'c'},
  c:{s:'logan',t:'You know how long it took me to earn that? Most of my life. You’re doing it now, while it counts.',next:'d'},
  d:{s:'narrator',t:'He pulls a battered metal tag on a chain from his pocket. The stamped letters are worn nearly smooth.',next:'e'},
  e:{s:'logan',t:'Wore this through more wars than I can count. I want you to have it.',opts:[
   {t:'Logan, this is yours.',next:'his'},
   {t:'What do I do with it?',next:'what'}]},
  his:{s:'logan',t:'It was. Now it’s proof that even the worst of us can change. Take it before I get sentimental.',next:'f'},
  what:{s:'logan',t:'When you feel the claws coming out with your kids, grip it. Breathe. Then go be their dad.',next:'f'},
  f:{s:'narrator',t:'The tag is cold in your fist, then warm.',next:'g'},
  g:{s:'logan',t:'Proud of you, {name}. Don’t make me say it twice.',end:true,do:[{quest:['sheathe-the-claws','complete']}]}}},

 // ---------------- The Mixtape (Quill, Fatherhood, tier 3) ----------------
 'the-mixtape-1':{who:'quill',bg:'facility-scenes/stories.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Quill is behind the bar of the Hearth Inn, fixing an old tape player with a fork. Music crackles, cuts out, crackles again.',next:'b'},
  b:{s:'quill',t:'{name}! Perfect timing. Hold this. No, the other end. Yeah. Don’t breathe on it.',next:'c'},
  c:{s:'quill',t:'So I hear you’ve been having talks with Din and Logan. A Dad Council. Without me? I’m hurt. Genuinely.',next:'d'},
  d:{s:'quill',t:'Look. My real father was a planet-sized jerk. The guy who actually raised me was a blue pirate who threatened to eat me.',next:'e'},
  e:{s:'quill',t:'And the pirate was the real dad. Because he stayed. Took me way too long to figure that out.',opts:[
   {t:'What did he do right?',next:'right'},
   {t:'Sounds like a rough childhood.',next:'rough'},
   {t:'You turned out okay.',next:'okay'}]},
  right:{s:'quill',t:'He showed up. Badly, loudly, with a whistling arrow. But he showed up. Kids forgive a lot if you keep showing up.',next:'f'},
  rough:{s:'quill',t:'Rough? Sure. But the good parts are what I kept. That’s the thing. You get to choose what they keep.',next:'f'},
  okay:{s:'quill',t:'I turned out awesome, thank you. Mostly. Point is, somebody stuck around long enough to make that happen.',next:'f'},
  f:{s:'quill',t:'So here’s the mission. Eight real moments with your kids. Dance in the kitchen. Read the dumb book twice. Make memories.',opts:[
   {t:'Eight moments. Let’s go. (Start “The Mixtape”)',next:'yes',do:[{quest:['the-mixtape','start']}]},
   {t:'Maybe later.',next:'no'}]},
  yes:{s:'quill',t:'Yes! Okay. I’m playing you out. Imagine an incredible song right now. Louder. There you go.',end:true},
  no:{s:'quill',t:'Fine. But this thing’s gonna work eventually, and you’re gonna want a song when it does.',end:true}}},

 'the-mixtape-2':{who:'quill',bg:'facility-scenes/expo.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The tape player works. Quill is dancing alone in the inn’s empty common room and doesn’t stop when you walk in.',next:'b'},
  b:{s:'quill',t:'Eight! Din told me. Din doesn’t tell anybody anything, so that’s basically a parade.',next:'c'},
  c:{s:'quill',t:'Okay, real question. Which one are they gonna remember?',opts:[
   {t:'The kitchen dance party.',next:'dance'},
   {t:'Bedtime. They asked me to stay longer.',next:'bedtime',do:[{flag:'quill-bedtime'}]},
   {t:'I don’t know. Maybe none of them.',next:'none'}]},
  dance:{s:'quill',t:'Correct answer. Nobody ever forgets their dad dancing badly. It’s a law of the universe.',next:'d'},
  bedtime:{s:'quill',t:'Oh, that one gets you. Stay longer. Always stay longer. The dishes won’t remember you.',next:'d'},
  none:{s:'quill',t:'Maybe none on their own. But all of them together? That’s the soundtrack. That’s what sticks.',next:'d'},
  d:{s:'quill',t:'My mom left me a tape. Songs she loved. I played it till it wore thin, because it was proof she was thinking about me.',next:'e'},
  e:{s:'quill',t:'Next part. Five different days. Be the guy who shows up five separate days, so they never have to wonder.',opts:[
   {t:'Five days. They won’t wonder.',next:'f',do:[{quest:['the-mixtape','advance']}]}]},
  f:{s:'narrator',t:'Quill pops out the tape, flips it, and grins at you like you’re both in on something.',next:'g'},
  g:{s:'quill',t:'Okay, go. I’ve got a tape to make. Don’t ask.',end:true,do:[{xp:['fatherhood',500]}]}}},

 'the-mixtape-3':{who:'quill',bg:'ui-scenes/Bg_City_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Quill is lying on the roof of the Hearth Inn, hands behind his head, pointing out stars he swears he’s been to.',next:'b'},
  b:{s:'quill',t:'Five days. You know what that makes you? The guy who stays. Best title in the galaxy.',next:'c'},
  c:{s:'narrator',t:'Din sits at the edge of the roof. Logan leans on the chimney, arms crossed. Neither will admit they came for you.',next:'d'},
  d:{s:'logan',t:'Kid’s got a point. Don’t let it go to his head.',next:'e'},
  e:{s:'quill',t:'I made you something. Well. I made it blank. That’s the point.',next:'f'},
  f:{s:'narrator',t:'He hands you a cassette. The label is empty except for one line in his messy writing: “For the little ones. From Dad.”',next:'g'},
  g:{s:'quill',t:'You fill it. Songs, stories, your voice. Every time you show up, that’s a track. One day they’ll play it till it wears thin.',opts:[
   {t:'Why blank? Why not your songs?',next:'blank'},
   {t:'I don’t know what to say.',next:'nosay'}]},
  blank:{s:'quill',t:'Because it’s not my tape. My mom’s songs saved me. Yours are gonna carry them.',next:'h'},
  nosay:{s:'quill',t:'You don’t have to say anything. You just have to keep pressing record.',next:'h'},
  h:{s:'din',t:'Fill it well.',next:'i'},
  i:{s:'narrator',t:'Quill hits play. Somewhere below, one of your kids laughs in their sleep. Three cups rise toward you in the dark.',end:true,do:[{quest:['the-mixtape','complete']}]}}},

 // ---------------- The Long Run (Roy, Fitness, tier 2) ----------------
 'the-long-run-1':{who:'roy',bg:'facility-scenes/roaming.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Roy sprints three laps around the Training Yard, skids to a stop in front of you and nearly falls over.',next:'b'},
  b:{s:'roy',t:'You’re the one who did Darrow’s iron thing, right? Everybody’s talking about it! The river! The sunrise! The band!',next:'c'},
  c:{s:'roy',t:'I want in. Not on the band. On the training. I want to see how far we can go. Like, actually how far.',opts:[
   {t:'How far do you usually go?',next:'far'},
   {t:'Darrow said not to rush it.',next:'rush'},
   {t:'Do you ever stop?',next:'stop'}]},
  far:{s:'roy',t:'Until I fall down! Then I get up and see if I can go a little farther. That’s the whole plan.',next:'d'},
  rush:{s:'roy',t:'Darrow’s right. I just rush the fun parts. The boring parts I do slow. Ish. Mostly.',next:'d'},
  stop:{s:'roy',t:'My partner asks me that too. Then he naps for six hours. We balance out.',next:'d'},
  d:{s:'roy',t:'My grandpa used to tell me stories about what’s past the edge of the map. The only way to find out is to keep moving.',next:'e'},
  e:{s:'roy',t:'So, a challenge! Five sessions. Run, lift, walk, eat a real vegetable, sleep on time. Then race me back here!',opts:[
   {t:'You’re on. Five sessions. (Start “The Long Run”)',next:'yes',do:[{quest:['the-long-run','start']}]},
   {t:'I’ll pass this time.',next:'no'}]},
  yes:{s:'roy',t:'Yes! Okay! I’m gonna go tell everybody. No, wait. You do the sessions. I tell everybody. Good plan.',end:true},
  no:{s:'roy',t:'That’s okay! I’ll ask again tomorrow. And the day after. I’m very persistent.',end:true}}},

 'the-long-run-2':{who:'roy',bg:'facility-scenes/journey.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Roy is waiting at the village gate with a satchel of apples and far too much energy.',next:'b'},
  b:{s:'roy',t:'Five! You did five! I counted. I may have told Grog, and he cheered so loud a bird fell off the roof.',next:'c'},
  c:{s:'roy',t:'Which one felt best? I need to know. For science.',opts:[
   {t:'The one I almost skipped.',next:'skip',do:[{flag:'roy-almost'}]},
   {t:'The hard one. I was wrecked after.',next:'hard'},
   {t:'Honestly, the walk with my family.',next:'walk'}]},
  skip:{s:'roy',t:'Those are the best ones! The ones you almost don’t do are the ones that change you.',next:'d'},
  hard:{s:'roy',t:'Wrecked is good! Wrecked means you found the edge. Now we push the edge out a little.',next:'d'},
  walk:{s:'roy',t:'That counts double in my book. Moving with people you love? That’s the whole dream.',next:'d'},
  d:{s:'roy',t:'Okay. Darrow asked for three days. I’m asking for four. Four different days moving your body. It’s an adventure, not a test!',next:'e'},
  e:{s:'roy',t:'You in?',opts:[
   {t:'Four days. Let’s find out how far.',next:'f',do:[{quest:['the-long-run','advance']}]}]},
  f:{s:'roy',t:'Apple? For the road. Every great journey starts with a snack.',next:'g'},
  g:{s:'narrator',t:'He tosses you an apple and takes off toward the hill road, shouting over his shoulder: “First to the top!”',end:true,do:[{xp:['fitness',500]}]}}},

 'the-long-run-3':{who:'roy',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Roy stands where the meadow road runs out and the hills begin. He’s breathing hard and smiling harder.',next:'b'},
  b:{s:'roy',t:'Four days! You know what I figured out? You don’t get faster by trying really hard once. You get faster by coming back.',next:'c'},
  c:{s:'roy',t:'When I left home, Grandpa gave me an old ball that never opened for anybody. I carry it everywhere.',next:'d'},
  d:{s:'roy',t:'I can’t give you that one. But I brought you this.',next:'e'},
  e:{s:'narrator',t:'He presses a red cloth ribbon into your hand. It’s frayed at one end, like it’s been tied and retied a hundred times.',next:'f'},
  f:{s:'roy',t:'My first race ribbon. I came in last. I kept it anyway, because I finished.',opts:[
   {t:'Last place? And you kept it?',next:'last'},
   {t:'I’ll tie it on my shoes.',next:'shoes'}]},
  last:{s:'roy',t:'Last is still a finish! Everybody who passed me started the same race. I just didn’t quit.',next:'g'},
  shoes:{s:'roy',t:'Perfect! Then every time you lace up, you’ll remember. You don’t have to win. You just have to keep going.',next:'g'},
  g:{s:'roy',t:'Darrow gave you iron. I’m giving you a reason to keep running. Same lesson, more fun.',next:'h'},
  h:{s:'roy',t:'Race you back, {name}? Loser does tomorrow’s workout too. Wait. That’s both of us. Perfect!',end:true,do:[{quest:['the-long-run','complete']}]}}},

 // ---------------- Pick It Up, Put It Down (Grog, Fitness, tier 3) ----------------
 'pick-it-up-1':{who:'grog',bg:'facility-scenes/raphael.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Grog is holding a boulder over his head in the middle of the Training Yard. He appears to be talking to it.',next:'b'},
  b:{s:'grog',t:'Oh! Hi! This is Kevin. Kevin is a rock. I lift Kevin every day. Kevin is my best friend, after Pike.',next:'c'},
  c:{s:'grog',t:'Little Roy says you run a lot. Darrow says you got an iron ring. Nobody tells Grog nothin’, but Grog hears things.',next:'d'},
  d:{s:'grog',t:'You wanna get strong? Like, Grog strong?',opts:[
   {t:'That’s the dream.',next:'dream'},
   {t:'I’d settle for not being sore.',next:'sore'},
   {t:'Can I lift Kevin?',next:'kevin'}]},
  dream:{s:'grog',t:'Good dream! Best dream. Second best is the one where the tavern has free pie.',next:'e'},
  sore:{s:'grog',t:'Sore means it’s working! Then you eat a big meal and sleep like a bear. That’s the secret, mostly.',next:'e'},
  kevin:{s:'grog',t:'Not yet. Kevin has to like you first. Kevin is picky.',next:'e'},
  e:{s:'grog',t:'Strong is simple. Pick it up. Put it down. Eat. Sleep. Do it again. Smart people make it hard. I am not smart people.',next:'f'},
  f:{s:'grog',t:'Eight times. Train eight times. Lifting, running, eating good, sleeping proper. All counts. Then come show Grog.',opts:[
   {t:'Eight times. Grog strong. (Start “Pick It Up, Put It Down”)',next:'yes',do:[{quest:['pick-it-up','start']}]},
   {t:'Not today, big guy.',next:'no'}]},
  yes:{s:'grog',t:'YES! Kevin, did you hear? Kevin is very excited. You can’t tell, but he is.',end:true},
  no:{s:'grog',t:'Okay! Me and Kevin will be here. We’re always here. Except lunch.',end:true}}},

 'pick-it-up-2':{who:'grog',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Grog has taken over the longest table in the Hearth Inn. There is a roast, three loaves and a suspicious amount of potatoes.',next:'b'},
  b:{s:'grog',t:'EIGHT! Sit! Eat! Food is the other half of strong. Nobody believes me.',next:'c'},
  c:{s:'grog',t:'So what was hardest? Tell Grog. Grog will punch it.',opts:[
   {t:'Eating right. I love bad food.',next:'food'},
   {t:'Getting enough sleep.',next:'sleep',do:[{flag:'grog-sleep'}]},
   {t:'Nothing. I want more.',next:'more'}]},
  food:{s:'grog',t:'Me too! Bad food is delicious. But you can’t lift Kevin on pastry. I tried. Kevin was not impressed.',next:'d'},
  sleep:{s:'grog',t:'Ahh. Sleep is when the muscles grow. Pike told me that. Pike is very smart. Go to bed earlier, little buddy.',next:'d'},
  more:{s:'grog',t:'Ha! Grog likes you! But more is not always better. Sometimes rest is the strongest thing.',next:'d'},
  d:{s:'grog',t:'Here’s the big test. Five different days. Not all at once. Five days you do something good for your body.',next:'e'},
  e:{s:'grog',t:'Can you do it?',opts:[
   {t:'Five days. Pass the potatoes.',next:'f',do:[{quest:['pick-it-up','advance']}]}]},
  f:{s:'narrator',t:'Grog slides a plate of roast and greens toward you, then quietly moves the third dessert out of your reach.',next:'g'},
  g:{s:'grog',t:'Greens first. Then we talk about pie.',end:true,do:[{xp:['fitness',500]}]}}},

 'pick-it-up-3':{who:'grog',bg:'facility-scenes/mine.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Grog waits at the old quarry outside the village. Kevin the rock sits beside him on a blanket, like a guest.',next:'b'},
  b:{s:'grog',t:'Five days! You came back every day. Even the rainy one. Grog saw. Grog sees everything. Mostly.',next:'c'},
  c:{s:'grog',t:'I used to think strong meant hitting things hardest. Then my friends got hurt, and I couldn’t fix it by hitting.',next:'d'},
  d:{s:'grog',t:'So I learned strong is also being there tomorrow. Carrying your people. You’re doing both.',next:'e'},
  e:{s:'grog',t:'Kevin has decided. Kevin likes you.',next:'f'},
  f:{s:'narrator',t:'Grog sets a smaller stone in your hands, smooth and grey, with a crooked grin scratched into it. It is surprisingly heavy.',next:'g'},
  g:{s:'grog',t:'That’s Kevin’s little brother. His name is also Kevin. Lift him every day, and you’ll always have a friend at training.',opts:[
   {t:'I’ll take good care of him.',next:'care'},
   {t:'Grog, it’s a rock.',next:'rock'}]},
  care:{s:'grog',t:'I know you will. You take care of your people. Kevin is your people now.',next:'h'},
  rock:{s:'grog',t:'It’s a rock that believes in you. That’s more than most rocks.',next:'h'},
  h:{s:'grog',t:'Now pick it up. Put it down. Again. Forever. Proud of you, {name}.',end:true,do:[{quest:['pick-it-up','complete']}]}}},

 // ---------------- Steel and Habit (Geralt, Fitness, tier 4) ----------------
 'steel-and-habit-1':{who:'geralt',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Geralt is in a corner of the Training Yard after dark, running sword forms by lantern light. Slow. Exact. Again.',next:'b'},
  b:{s:'geralt',t:'Hm. You’re still here. Darrow said you’d be back. Roy said you’d never stop. Grog said a lot about a rock.',next:'c'},
  c:{s:'geralt',t:'Witchers train every day. Not because we like it. Because the one day we skip is the day the monster comes.',opts:[
   {t:'Do you ever take a day off?',next:'off'},
   {t:'I’ve been training a while now.',next:'while'},
   {t:'What kind of monster?',next:'monster'}]},
  off:{s:'geralt',t:'Rest days, yes. Meditation. Mending. But the habit never stops. Rest is part of the habit.',next:'d'},
  while:{s:'geralt',t:'I know. I’ve watched. Good start. But a start isn’t a life.',next:'d'},
  monster:{s:'geralt',t:'Yours won’t have fangs. It’ll look like long days, a bad back, and a man who used to be strong.',next:'d'},
  d:{s:'geralt',t:'I was trained in an old keep in the mountains. The ones who made it learned one thing. Consistency is survival.',next:'e'},
  e:{s:'geralt',t:'Twelve sessions. Train, eat clean, sleep right, stretch the old hurts. Twelve. Then we talk.',opts:[
   {t:'Twelve. I’ll count them. (Start “Steel and Habit”)',next:'yes',do:[{quest:['steel-and-habit','start']}]},
   {t:'Not yet.',next:'no'}]},
  yes:{s:'geralt',t:'Good. Don’t tell anyone. Just do it.',end:true},
  no:{s:'geralt',t:'Hm. The monster won’t wait. I will.',end:true}}},

 'steel-and-habit-2':{who:'geralt',bg:'facility-scenes/fishing.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Geralt sits cross-legged on the riverbank, eyes closed, a sword across his knees. He speaks without opening them.',next:'b'},
  b:{s:'geralt',t:'Twelve. Your breathing’s different. Slower. Good.',next:'c'},
  c:{s:'geralt',t:'Sit. Tell me what changed.',opts:[
   {t:'I sleep better.',next:'sleep'},
   {t:'My kids watch me train now.',next:'kids',do:[{flag:'geralt-kids'}]},
   {t:'Nothing hurts as much.',next:'hurt'}]},
  sleep:{s:'geralt',t:'Sleep is the first potion. Witchers who skip it don’t get old.',next:'d'},
  kids:{s:'geralt',t:'Hm. I trained a girl once. She watched me long before she held a blade. They copy what you do, not what you say.',next:'d'},
  hurt:{s:'geralt',t:'The body forgives a lot if you keep asking it nicely. Every day. Not all at once.',next:'d'},
  d:{s:'geralt',t:'Darrow taught you to come back. Roy taught you to enjoy it. Grog taught you to eat. I’ll teach you not to stop.',next:'e'},
  e:{s:'geralt',t:'The trial. Seven different days, you train. A week’s worth of mornings. No excuses I haven’t already heard.',opts:[
   {t:'Seven days. I won’t stop.',next:'f',do:[{quest:['steel-and-habit','advance']}]}]},
  f:{s:'narrator',t:'Geralt hands you a whetstone and nods at the sword on his knees. You sharpen it in silence until the light goes.',next:'g'},
  g:{s:'geralt',t:'Not bad.',end:true,do:[{xp:['fitness',500]}]}}},

 'steel-and-habit-3':{who:'geralt',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Geralt waits at the mountain pass above the village, his horse grazing nearby. Darrow, Roy and Grog are there too.',next:'b'},
  b:{s:'geralt',t:'Seven days. Twelve sessions before that. You didn’t miss when it was cold. You didn’t miss when it was easy to.',next:'c'},
  c:{s:'roy',t:'He doesn’t say much, so I’ll say it. That was amazing!',next:'d'},
  d:{s:'grog',t:'Kevin also says it was amazing. Kevin is in my bag.',next:'e'},
  e:{s:'darrow',t:'Still wearing the band? Good. It feels lighter now. That’s you, not the iron.',next:'f'},
  f:{s:'narrator',t:'Geralt unrolls a worn leather wrap. Inside is a small whetstone, black and smooth from years of use.',next:'g'},
  g:{s:'geralt',t:'Every morning, a few strokes. Not to sharpen. To remember. A blade dulls a little every day. So does a body.',opts:[
   {t:'So does a man.',next:'man'},
   {t:'I’ll use it every morning.',next:'morning'}]},
  man:{s:'geralt',t:'Yes. That’s why you sharpen every day. Not when you need it. Before.',next:'h'},
  morning:{s:'geralt',t:'I know. That’s why it’s yours.',next:'h'},
  h:{s:'narrator',t:'The four of them stand with you as the sun clears the peaks. Nobody gives a speech. Nobody needs to.',next:'i'},
  i:{s:'geralt',t:'Stay sharp, {name}. I’ll see you in the yard.',end:true,do:[{quest:['steel-and-habit','complete']}]}}},
};
