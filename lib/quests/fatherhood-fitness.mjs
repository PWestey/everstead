// Quests for Fatherhood (Din, Logan, Quill) and Fitness (Roy, Grog, Geralt). Format: see lib/dialogue.mjs and lib/quests.mjs.
// Tier counts: 1 = 3 habits / 3 days, 2 = 5 / 4, 3 = 8 / 5, 4 = 12 / 7.

/** @type {Record<string,any>} */
export const QUESTS={
 'wherever-i-go':{name:'Wherever I Go',area:'fatherhood',giver:'din',tier:1,
  blurb:'Din has heard your kids tearing around the Hearth Inn. He didn’t say much. He rarely does. But he wants a word.',
  say:['Talk to Din at the Hearth Inn.','Report back to Din.','Meet Din in the field past the Hearth Inn at dusk.']},
 'sheathe-the-claws':{name:'Sheathe the Claws',area:'fatherhood',giver:'logan',tier:2,
  blurb:'Logan watched you bring a bad day home and dump it on your kids. He’s done the same, and he’s not letting it go.',
  say:['Talk to Logan on the back step of the Hearth Inn.','Report back to Logan.','Meet Logan under the old pine on the ridge.']},
 'the-mixtape':{name:'The Mixtape',area:'fatherhood',giver:'quill',tier:3,
  blurb:'Quill found out Din and Logan have been giving you dad advice, and he is extremely offended nobody invited him.',
  say:['Talk to Quill at the Hearth Inn.','Report back to Quill.','Meet Quill on the Hearth Inn roof under the stars.']},
 'the-long-run':{name:'The Long Run',area:'fitness',giver:'roy',tier:2,
  blurb:'Roy heard you finished Darrow’s trial and has decided you’re his new training buddy. He did not ask.',
  say:['Talk to Roy at the Training Yard.','Report back to Roy.','Meet Roy where the meadow road runs out.']},
 'pick-it-up':{name:'Pick It Up, Put It Down',area:'fitness',giver:'grog',tier:3,
  blurb:'Grog thinks you could be Grog strong. His rock, Kevin, is less sure.',
  say:['Talk to Grog at the Training Yard.','Report back to Grog at the Hearth Inn.','Meet Grog at the old quarry.']},
 'steel-and-habit':{name:'Steel and Habit',area:'fitness',giver:'geralt',tier:4,
  blurb:'Geralt has been watching you train for weeks without a word. Now he’s got a few.',
  say:['Talk to Geralt at the Training Yard after dark.','Report back to Geralt by the river.','Meet Geralt at the mountain pass above the village.']},
};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- Wherever I Go (Din, Fatherhood, tier 1) ----------------
 'wherever-i-go-1':{who:'din',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Din sits at the end of the long table in the Hearth Inn, helmet on, sneaking bits of bread to a small green hand under the table.',next:'b'},
  b:{s:'din',t:'You’re the one with the kids. I’ve heard them. Loud. Good lungs.',next:'c'},
  c:{s:'din',t:'I was a foundling. The clan took me in. Now I’ve got this one. Nobody gave me instructions.',opts:[
   {t:'Nobody handed me one either.',next:'same'},
   {t:'How do you do it, in all that armor?',next:'armor'},
   {t:'Mine wear me out.',next:'tired'}]},
  same:{s:'din',t:'Then we figure it out the same way. Keep them close. Keep your eyes on them.',next:'d'},
  armor:{s:'din',t:'Beskar stops blaster bolts. Doesn’t do much for a nightmare. That part I do with my hands.',next:'d'},
  tired:{s:'din',t:'He bites. Eats things he shouldn’t. Pulls the knob off my ship’s controls. I’m tired too. I wouldn’t trade it.',next:'d'},
  d:{s:'din',t:'He doesn’t remember the jobs. He remembers riding up front with me. That’s what sticks.',next:'e'},
  e:{s:'din',t:'Three times. A game on the floor. A story at bedtime. No screen. Then come find me.',opts:[
   {t:'Three times. I’ll be there. (Start “Wherever I Go”)',next:'yes',do:[{quest:['wherever-i-go','start']}]},
   {t:'Not right now.',next:'no'}]},
  yes:{s:'din',t:'Good. I’ll be here.',next:'wave'},
  wave:{s:'narrator',t:'A small clawed hand pokes out from under the table and waves at you.',end:true},
  no:{s:'din',t:'Your call. They won’t stay small, though.',end:true}}},

 'wherever-i-go-2':{who:'din',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Din stands by the village fountain while the little one splashes at the shallow edge. The visor never turns away from him.',next:'b'},
  b:{s:'din',t:'Three. I could tell. You walked in lighter.',next:'c'},
  c:{s:'din',t:'What did they do, when you were really there?',opts:[
   {t:'My youngest wouldn’t let me off the floor.',next:'floor',do:[{flag:'din-floor'}]},
   {t:'They didn’t notice at first. Then they did.',next:'notice'},
   {t:'Honestly? I caught myself reaching for my phone.',next:'phone'}]},
  floor:{s:'din',t:'Good. When they hang on like that, you did it right.',next:'d'},
  notice:{s:'din',t:'They wait to see if you’ll stay. He did. Then one day he climbed in my lap and fell asleep.',next:'d'},
  phone:{s:'din',t:'I get a job on the comm, I want to take it. I leave it on the ship now. Put yours in a drawer.',next:'d'},
  d:{s:'din',t:'Mandalorians keep the creed every day. Not when it suits us. Raising him is the same.',next:'e'},
  e:{s:'din',t:'Three different days. Not three times in one afternoon. They need to see you come back.',opts:[
   {t:'Three days. They’ll have me.',next:'f',do:[{quest:['wherever-i-go','advance']}]}]},
  f:{s:'narrator',t:'Din lifts the little one out of the water and holds him out to you. He’s damp, light as a loaf of bread, and coos at you.',next:'g'},
  g:{s:'din',t:'He likes you. He doesn’t like anybody. Go home.',end:true,do:[{xp:['fatherhood',500]}]}}},

 'wherever-i-go-3':{who:'din',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At dusk Din waits in the field past the Hearth Inn. The little one is asleep in a satchel against his chest plate.',next:'b'},
  b:{s:'din',t:'Three days. Tired nights too. You still sat on the floor.',next:'c'},
  c:{s:'din',t:'They won’t remember what you said. They’ll remember you were there.',next:'d'},
  d:{s:'narrator',t:'He unclips a small disc of bright beskar from his belt, stamped with a horned mudhorn, and holds it out.',next:'e'},
  e:{s:'din',t:'Clan signet. The Armorer made me two. Said I’d know who the second was for. Your house is a clan now.',opts:[
   {t:'I don’t know if I’m worthy of that.',next:'worthy'},
   {t:'My kids are going to love this.',next:'love'}]},
  worthy:{s:'din',t:'I didn’t think I was either. You don’t earn it once. You earn it every bedtime.',next:'f'},
  love:{s:'din',t:'Show them. Tell them what it means. Their father comes back. Every time.',next:'f'},
  f:{s:'narrator',t:'The little one stirs, reaches out, pats the signet in your hand, and falls back asleep.',next:'g'},
  g:{s:'din',t:'Go home, {name}. Where you go, they go. That’s the way.',end:true,do:[{quest:['wherever-i-go','complete']}]}}},

 // ---------------- Sheathe the Claws (Logan, Fatherhood, tier 2) ----------------
 'sheathe-the-claws-1':{who:'logan',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Logan sits on the Hearth Inn’s back step with a beer and an unlit cigar, watching kids chase fireflies across the yard.',next:'b'},
  b:{s:'logan',t:'Saw you come home yesterday. Bad day at work. And your kids caught the back end of it. Am I wrong?',opts:[
   {t:'Yeah. I snapped at them.',next:'snapped'},
   {t:'That’s none of your business.',next:'business'},
   {t:'It wasn’t that bad.',next:'notbad'}]},
  snapped:{s:'logan',t:'Huh. You just said it. Took me about a hundred and fifty years to say it once.',next:'d'},
  business:{s:'logan',t:'Ha. Said that to Chuck for twenty years. He was usually right too. Annoying.',next:'d'},
  notbad:{s:'logan',t:'Bub, kids don’t grade on a curve. They remember the yelling way longer than you do.',next:'d'},
  d:{s:'logan',t:'I spent a long, ugly life fighting. Then a little girl showed up with my claws and my temper. Scared me worse than any war.',next:'e'},
  e:{s:'logan',t:'Laura didn’t need me tough. Had plenty of tough. She needed me to stay put and not blow up.',next:'f'},
  f:{s:'logan',t:'So. Five times. Sit down with your kids on purpose. Play, read, listen. Leave the claws on the porch.',opts:[
   {t:'Five times. Claws at the door. (Start “Sheathe the Claws”)',next:'yes',do:[{quest:['sheathe-the-claws','start']}]},
   {t:'Not right now.',next:'no'}]},
  yes:{s:'logan',t:'Good. And if you blow it, go back in and say sorry. That counts too.',end:true},
  no:{s:'logan',t:'Suit yourself. Fireflies’ll be back tomorrow. Your kids won’t be this little for long.',end:true}}},

 'sheathe-the-claws-2':{who:'logan',bg:'facility-scenes/northern.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Logan is splitting firewood behind the inn, shirt sleeves pushed up. He buries the axe in the stump when he sees you.',next:'b'},
  b:{s:'logan',t:'Five. Heard your kids howling laughing through the wall the other night. That you?',next:'c'},
  c:{s:'logan',t:'Straight answer. You lose your temper?',opts:[
   {t:'Once. Then I apologized.',next:'sorry',do:[{flag:'logan-sorry'}]},
   {t:'Not once. I counted to ten a lot.',next:'counted'},
   {t:'I wanted to. I stepped outside first.',next:'walked'}]},
  sorry:{s:'logan',t:'That’s the whole thing right there. A dad who says sorry teaches ’em more than one who’s never wrong.',next:'d'},
  counted:{s:'logan',t:'Ten’s good. Some days I had to get to about four hundred. Usually with a beer.',next:'d'},
  walked:{s:'logan',t:'Smart. Walk it off, come back human. Saved more people than the claws ever did.',next:'d'},
  d:{s:'logan',t:'Now the long haul. Laura didn’t need one good week out of me. She needed to know I’d be there tomorrow.',next:'e'},
  e:{s:'logan',t:'Four different days. Be with your kids four separate days. Not a sprint. Just a thing you do.',opts:[
   {t:'Four days. I’ll be there.',next:'f',do:[{quest:['sheathe-the-claws','advance']}]}]},
  f:{s:'narrator',t:'Logan hands you the axe. You split the next log clean. He grunts, which from Logan counts as a speech.',next:'g'},
  g:{s:'logan',t:'Go on, get outta here. They’re waiting on you.',end:true,do:[{xp:['fatherhood',500]}]}}},

 'sheathe-the-claws-3':{who:'logan',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Logan sits under an old pine on the ridge above the village. Below, the Hearth Inn’s chimney is smoking.',next:'b'},
  b:{s:'logan',t:'Four days. Saw your kid tear down the hall when you came through the door. Didn’t even put his shoes on.',next:'c'},
  c:{s:'logan',t:'Know how long it took me to get that? Most of a very long life. You’re getting it now, while it counts.',next:'d'},
  d:{s:'narrator',t:'He pulls a battered metal tag on a chain out of his jacket. The stamped letters are worn almost smooth.',next:'e'},
  e:{s:'logan',t:'Had this since before I could remember my own name. Wore it through more wars than I can count. It’s yours.',opts:[
   {t:'Logan, this is yours.',next:'his'},
   {t:'What do I do with it?',next:'what'}]},
  his:{s:'logan',t:'Was. Now it’s proof even a guy like me can turn it around. Take it before I get sappy.',next:'f'},
  what:{s:'logan',t:'Next time you feel yourself about to bark at your kids, grab it. Breathe. Then go be their dad.',next:'f'},
  f:{s:'narrator',t:'The tag is cold in your fist, then warm.',next:'g'},
  g:{s:'logan',t:'Proud of you, {name}. Don’t make me say it twice.',end:true,do:[{quest:['sheathe-the-claws','complete']}]}}},

 // ---------------- The Mixtape (Quill, Fatherhood, tier 3) ----------------
 'the-mixtape-1':{who:'quill',bg:'facility-scenes/stories.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Quill is behind the Hearth Inn bar, fixing an old tape player with a fork. Music crackles, cuts out, crackles again.',next:'b'},
  b:{s:'quill',t:'{name}! Perfect timing. Hold this. No, the other end. Yeah. Don’t breathe on it. Why are you breathing on it?',next:'c'},
  c:{s:'quill',t:'So. Word is you’ve been getting dad advice from Din and Logan. A Dad Council. Without me? Wow. Genuinely hurt.',next:'d'},
  d:{s:'quill',t:'Okay, context. My biological dad? Literally a planet. Big jerk. The guy who raised me was a blue space pirate who threatened to eat me.',next:'e'},
  e:{s:'quill',t:'And the pirate was the real dad. Yondu. Because he stuck around. Took me way too long to get that.',opts:[
   {t:'What did he do right?',next:'right'},
   {t:'Sounds like a rough childhood.',next:'rough'},
   {t:'You turned out okay.',next:'okay'}]},
  right:{s:'quill',t:'He showed up! Badly. Loudly. With a whistling arrow. But he showed up. Kids forgive a lot if you keep showing up.',next:'f'},
  rough:{s:'quill',t:'Rough? Sure. Also I had a Walkman, so. The good stuff is what I kept. You get to pick what your kids keep.',next:'f'},
  okay:{s:'quill',t:'Okay? I turned out awesome, thank you. Mostly. Gamora would say partly. Point is, somebody stayed.',next:'f'},
  f:{s:'quill',t:'So, mission. Eight real moments with your kids. Dance in the kitchen. Read the dumb dinosaur book twice. Do the voices.',opts:[
   {t:'Eight moments. Let’s go. (Start “The Mixtape”)',next:'yes',do:[{quest:['the-mixtape','start']}]},
   {t:'Maybe later.',next:'no'}]},
  yes:{s:'quill',t:'Yes! Okay, I’m playing you out. Imagine an incredible song right now. Louder. Little louder. There it is.',end:true},
  no:{s:'quill',t:'Fine. But this thing is gonna work eventually, and you’re gonna want a song when it does.',end:true}}},

 'the-mixtape-2':{who:'quill',bg:'facility-scenes/expo.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The tape player works. Quill is dancing alone in the inn’s empty common room and does not stop when you walk in.',next:'b'},
  b:{s:'quill',t:'Eight! Din told me. Din doesn’t tell anybody anything, so that’s basically a parade with fireworks.',next:'c'},
  c:{s:'quill',t:'Okay, real question. Which one are they gonna remember?',opts:[
   {t:'The kitchen dance party.',next:'dance'},
   {t:'Bedtime. They asked me to stay longer.',next:'bedtime',do:[{flag:'quill-bedtime'}]},
   {t:'I don’t know. Maybe none of them.',next:'none'}]},
  dance:{s:'quill',t:'Correct. Nobody forgets their dad dancing badly. I once danced to save the galaxy. Long story. It worked.',next:'d'},
  bedtime:{s:'quill',t:'Oh, man. That one gets you. Stay longer. Always stay longer. The dishes don’t care.',next:'d'},
  none:{s:'quill',t:'Maybe not any one. But all of ’em together? That’s the soundtrack. That’s what sticks.',next:'d'},
  d:{s:'quill',t:'My mom made me a tape before she died. Songs she loved. I played it till it wore thin. It was proof she thought about me.',next:'e'},
  e:{s:'quill',t:'Next part. Five different days. Be the guy who shows up five separate days, so they never have to wonder.',opts:[
   {t:'Five days. They won’t wonder.',next:'f',do:[{quest:['the-mixtape','advance']}]}]},
  f:{s:'narrator',t:'Quill pops the tape out, flips it, and grins at you like you’re both in on something.',next:'g'},
  g:{s:'quill',t:'Okay, go. I’ve got a tape to make. Don’t ask. Do not tell Rocket.',end:true,do:[{xp:['fatherhood',500]}]}}},

 'the-mixtape-3':{who:'quill',bg:'ui-scenes/Bg_City_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Quill is lying on the roof of the Hearth Inn, hands behind his head, pointing out stars he swears he’s been to.',next:'b'},
  b:{s:'quill',t:'Five days. You know what that makes you? The guy who stays. Best title in the galaxy. Better than Star-Lord. Barely.',next:'c'},
  c:{s:'narrator',t:'Din sits at the edge of the roof. Logan leans on the chimney, arms crossed. Neither will admit they came for you.',next:'d'},
  d:{s:'logan',t:'Kid’s right for once. Don’t tell him.',next:'e'},
  e:{s:'quill',t:'I made you something. Well. I made it blank. That’s the point. Hang on, it’s a whole thing.',next:'f'},
  f:{s:'narrator',t:'He hands you a cassette. The label is empty except for one line in his messy writing: “For the little ones. From Dad.”',next:'g'},
  g:{s:'quill',t:'You fill it. Songs, stories, your voice. Every time you show up, that’s a track. Someday they’ll play it till it wears thin.',opts:[
   {t:'Why blank? Why not your songs?',next:'blank'},
   {t:'I don’t know what to say.',next:'nosay'}]},
  blank:{s:'quill',t:'Because it’s not my tape, man. My mom’s songs got me through. Yours are gonna get them through.',next:'h'},
  nosay:{s:'quill',t:'You don’t have to say anything. Just keep hitting record. Okay, I’m getting emotional. Din, look away.',next:'h'},
  h:{s:'din',t:'Fill it well.',next:'i'},
  i:{s:'narrator',t:'Quill hits play. Somewhere below, one of your kids laughs in their sleep. Three cups rise toward you in the dark.',end:true,do:[{quest:['the-mixtape','complete']}]}}},

 // ---------------- The Long Run (Roy, Fitness, tier 2) ----------------
 'the-long-run-1':{who:'roy',bg:'facility-scenes/roaming.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Roy sprints three laps around the Training Yard, skids to a stop in front of you, and nearly falls over.',next:'b'},
  b:{s:'roy',t:'You’re the one who did Darrow’s iron thing, right? Everybody’s talking about it! The hill! The rocks! The ring!',next:'c'},
  c:{s:'roy',t:'I want in! Not on the ring. On the training. I wanna see how far we can go. Like, actually how far.',opts:[
   {t:'How far do you usually go?',next:'far'},
   {t:'Darrow said not to rush it.',next:'rush'},
   {t:'Do you ever stop?',next:'stop'}]},
  far:{s:'roy',t:'Until I fall over! Then I get up and go a little farther. Fuecoco says that’s not a plan. It’s totally a plan.',next:'d'},
  rush:{s:'roy',t:'Okay, yeah, Darrow’s right. I only rush the fun parts! The boring parts I do slow. Ish. Mostly.',next:'d'},
  stop:{s:'roy',t:'Fuecoco asks me that too! Then he eats like ten berries and naps for six hours. So we balance out.',next:'d'},
  d:{s:'roy',t:'My grandpa told me stories about a legendary Pokémon past the edge of the map. You only find stuff like that if you keep moving!',next:'e'},
  e:{s:'roy',t:'So, a challenge! Five sessions. Run, lift, walk, eat an actual vegetable, go to bed on time. Then race me back here!',opts:[
   {t:'You’re on. Five sessions. (Start “The Long Run”)',next:'yes',do:[{quest:['the-long-run','start']}]},
   {t:'I’ll pass this time.',next:'no'}]},
  yes:{s:'roy',t:'Yes! Okay! I’m gonna go tell everybody. Wait, no. You do the sessions, I tell everybody. Good plan!',end:true},
  no:{s:'roy',t:'That’s okay! I’ll ask again tomorrow. And the day after. Liko says I’m very persistent.',end:true}}},

 'the-long-run-2':{who:'roy',bg:'facility-scenes/journey.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Roy is waiting at the village gate with a bag of apples and way too much energy.',next:'b'},
  b:{s:'roy',t:'Five! You did five! I counted. I maybe told Grog, and he cheered so loud a bird fell off the roof. It’s okay! The bird’s fine!',next:'c'},
  c:{s:'roy',t:'Which one felt the best? I need to know. For science.',opts:[
   {t:'The one I almost skipped.',next:'skip',do:[{flag:'roy-almost'}]},
   {t:'The hard one. I was wrecked after.',next:'hard'},
   {t:'Honestly, the walk with my family.',next:'walk'}]},
  skip:{s:'roy',t:'Those are the best ones! The ones you almost don’t do are the ones that change you. Captain Pikachu taught me that. Kind of.',next:'d'},
  hard:{s:'roy',t:'Wrecked is awesome! It means you hit the edge. Now we push the edge out a little more!',next:'d'},
  walk:{s:'roy',t:'That counts double! Moving with people you love is the whole dream. That’s why I travel with my friends.',next:'d'},
  d:{s:'roy',t:'Okay. Darrow asked for three days. I’m asking for four! Four different days moving your body. It’s an adventure, not a test!',next:'e'},
  e:{s:'roy',t:'You in? Say you’re in.',opts:[
   {t:'Four days. Let’s find out how far.',next:'f',do:[{quest:['the-long-run','advance']}]}]},
  f:{s:'roy',t:'Apple? For the road. Every good adventure starts with a snack. Fuecoco taught me that one for real.',next:'g'},
  g:{s:'narrator',t:'He tosses you an apple and takes off toward the hill road, yelling over his shoulder: “First one to the top wins!”',end:true,do:[{xp:['fitness',500]}]}}},

 'the-long-run-3':{who:'roy',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Roy stands where the meadow road runs out and the hills begin. He’s breathing hard and smiling harder.',next:'b'},
  b:{s:'roy',t:'Four days! Guess what I figured out? You don’t get faster by trying super hard once. You get faster by coming back!',next:'c'},
  c:{s:'roy',t:'When I left the island, Grandpa gave me this old Poké Ball that won’t open for anybody. I take it everywhere.',next:'d'},
  d:{s:'roy',t:'I can’t give you that one. It’s kinda important. But I brought you this!',next:'e'},
  e:{s:'narrator',t:'He presses a red cloth ribbon into your hand. It’s frayed at one end, like it’s been tied and retied a hundred times.',next:'f'},
  f:{s:'roy',t:'My first race ribbon! I came in last. I kept it anyway, ’cause I finished.',opts:[
   {t:'Last place? And you kept it?',next:'last'},
   {t:'I’ll tie it on my shoes.',next:'shoes'}]},
  last:{s:'roy',t:'Last is still finishing! Everybody who passed me started the same race. I just didn’t quit.',next:'g'},
  shoes:{s:'roy',t:'Yes! Then every time you lace up, you’ll remember. You don’t have to win. You just keep going!',next:'g'},
  g:{s:'roy',t:'Darrow gave you iron. I’m giving you a ribbon. Mine’s lighter, so you can run with it!',next:'h'},
  h:{s:'roy',t:'Race you back, {name}? Loser does tomorrow’s workout too. Wait. That’s both of us. Perfect!',end:true,do:[{quest:['the-long-run','complete']}]}}},

 // ---------------- Pick It Up, Put It Down (Grog, Fitness, tier 3) ----------------
 'pick-it-up-1':{who:'grog',bg:'facility-scenes/raphael.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Grog is holding a boulder over his head in the middle of the Training Yard. He appears to be talking to it.',next:'b'},
  b:{s:'grog',t:'Oh! Hi! This is Kevin. Kevin’s a rock. I lift Kevin every day. Kevin is my best friend. After Pike. Don’t tell Kevin.',next:'c'},
  c:{s:'grog',t:'Little Roy says you run a lot. Darrow says you got an iron ring. Nobody tells Grog nothin’, but Grog hears stuff.',next:'d'},
  d:{s:'grog',t:'You wanna get strong? Like, Grog strong?',opts:[
   {t:'That’s the dream.',next:'dream'},
   {t:'I’d settle for not being sore.',next:'sore'},
   {t:'Can I lift Kevin?',next:'kevin'}]},
  dream:{s:'grog',t:'Good dream! Best dream. Second best is the one where the tavern has free ale and nobody makes me pay for the table I broke.',next:'e'},
  sore:{s:'grog',t:'Sore means it’s workin’! Then you eat a whole chicken and sleep like a bear. That’s the secret. Mostly.',next:'e'},
  kevin:{s:'grog',t:'Not yet. Kevin has to like you first. Kevin is very picky. He didn’t like Scanlan at all.',next:'e'},
  e:{s:'grog',t:'Strong is easy. Pick it up. Put it down. Eat. Sleep. Again. Smart people make it hard. I am not smart people.',next:'f'},
  f:{s:'grog',t:'Eight times. Train eight times. Lifting, running, eating good, sleeping proper. All counts. Then come show Grog.',opts:[
   {t:'Eight times. Grog strong. (Start “Pick It Up, Put It Down”)',next:'yes',do:[{quest:['pick-it-up','start']}]},
   {t:'Not today, big guy.',next:'no'}]},
  yes:{s:'grog',t:'YES! Kevin, didja hear? Kevin is very excited. You can’t tell. But he is.',end:true},
  no:{s:'grog',t:'Okay! Me and Kevin will be right here. We’re always here. Except lunch. And second lunch.',end:true}}},

 'pick-it-up-2':{who:'grog',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Grog has taken over the longest table in the Hearth Inn. There’s a roast, three loaves and a suspicious number of potatoes.',next:'b'},
  b:{s:'grog',t:'EIGHT! Sit! Eat! Food is the other half of strong. Nobody believes me. Vex says I just like food. That’s also true.',next:'c'},
  c:{s:'grog',t:'So what was the hardest part? Tell Grog. Grog will punch it.',opts:[
   {t:'Eating right. I love bad food.',next:'food'},
   {t:'Getting enough sleep.',next:'sleep',do:[{flag:'grog-sleep'}]},
   {t:'Nothing. I want more.',next:'more'}]},
  food:{s:'grog',t:'Me too! Bad food is delicious. But you can’t lift Kevin on cake. I tried. Kevin was not impressed.',next:'d'},
  sleep:{s:'grog',t:'Ohhh. Pike says muscles grow when you sleep. Pike is real smart. She’s a cleric. Go to bed earlier, little buddy.',next:'d'},
  more:{s:'grog',t:'HA! Grog likes you! But more isn’t always better. Sometimes the strong thing is a nap.',next:'d'},
  d:{s:'grog',t:'Okay. Big test. Five different days. Not all at once. Five days you do somethin’ good for your body.',next:'e'},
  e:{s:'grog',t:'Can you do it? You can. Say you can.',opts:[
   {t:'Five days. Pass the potatoes.',next:'f',do:[{quest:['pick-it-up','advance']}]}]},
  f:{s:'narrator',t:'Grog slides a plate of roast and greens toward you, then quietly moves the third dessert out of your reach.',next:'g'},
  g:{s:'grog',t:'Greens first. Then we talk about pie. Pike made me say that.',end:true,do:[{xp:['fitness',500]}]}}},

 'pick-it-up-3':{who:'grog',bg:'facility-scenes/mine.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Grog waits at the old quarry outside the village. Kevin the rock sits beside him on a blanket, like a guest.',next:'b'},
  b:{s:'grog',t:'Five days! You came back every day. Even the rainy one. Grog saw. Grog sees everything. Except stuff behind him.',next:'c'},
  c:{s:'grog',t:'I used to think strong meant hittin’ stuff the hardest. Then my friends got hurt, and I couldn’t fix it by hittin’.',next:'d'},
  d:{s:'grog',t:'So now I think strong is also bein’ there tomorrow. Carryin’ your people. You do both. That’s good.',next:'e'},
  e:{s:'grog',t:'Kevin has decided. Kevin likes you.',next:'f'},
  f:{s:'narrator',t:'Grog sets a smaller stone in your hands, smooth and grey, with a crooked grin scratched into it. It’s surprisingly heavy.',next:'g'},
  g:{s:'grog',t:'That’s Kevin’s little brother. His name is also Kevin. Lift him every day, and you always got a friend at training.',opts:[
   {t:'I’ll take good care of him.',next:'care'},
   {t:'Grog, it’s a rock.',next:'rock'}]},
  care:{s:'grog',t:'I know you will. You take care of your people. Kevin’s your people now.',next:'h'},
  rock:{s:'grog',t:'It’s a rock that believes in you. That’s more than most rocks. Most rocks don’t care about nothin’.',next:'h'},
  h:{s:'grog',t:'Now pick it up. Put it down. Again. Forever. Proud of you, {name}.',end:true,do:[{quest:['pick-it-up','complete']}]}}},

 // ---------------- Steel and Habit (Geralt, Fitness, tier 4) ----------------
 'steel-and-habit-1':{who:'geralt',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Geralt is in a corner of the Training Yard after dark, running sword forms by lantern light. Slow. Exact. Again.',next:'b'},
  b:{s:'geralt',t:'Hm. Still at it. Darrow said you’d be back. Roy said you’d never stop. Grog said a lot about a rock.',next:'c'},
  c:{s:'geralt',t:'Witchers train every day. Not for fun. Skip one, and that’s the night something crawls out of the swamp.',opts:[
   {t:'Do you ever take a day off?',next:'off'},
   {t:'I’ve been training a while now.',next:'while'},
   {t:'What kind of monster?',next:'monster'}]},
  off:{s:'geralt',t:'Rest days. Meditate. Mend the armor. Rest is part of it. Stopping isn’t.',next:'d'},
  while:{s:'geralt',t:'I know. I’ve watched. Good start. Starts are cheap.',next:'d'},
  monster:{s:'geralt',t:'Yours won’t have fangs. Bad back. Long days at a desk. A man who used to be able to carry his kids up the stairs.',next:'d'},
  d:{s:'geralt',t:'Trained at Kaer Morhen. Vesemir ran us up the same mountain path every morning. The ones who quit didn’t last.',next:'e'},
  e:{s:'geralt',t:'Twelve sessions. Train, eat right, sleep, stretch the old injuries. Twelve. Then we talk.',opts:[
   {t:'Twelve. I’ll count them. (Start “Steel and Habit”)',next:'yes',do:[{quest:['steel-and-habit','start']}]},
   {t:'Not yet.',next:'no'}]},
  yes:{s:'geralt',t:'Good. Don’t make a fuss about it. Just do it.',end:true},
  no:{s:'geralt',t:'Hm. Your back won’t wait. I will.',end:true}}},

 'steel-and-habit-2':{who:'geralt',bg:'facility-scenes/fishing.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Geralt sits cross-legged on the riverbank, eyes closed, a sword across his knees. Roach crops grass behind him. He speaks without looking.',next:'b'},
  b:{s:'geralt',t:'Twelve. Your breathing’s changed. Slower. Good.',next:'c'},
  c:{s:'geralt',t:'Sit. What’s different?',opts:[
   {t:'I sleep better.',next:'sleep'},
   {t:'My kids watch me train now.',next:'kids',do:[{flag:'geralt-kids'}]},
   {t:'Nothing hurts as much.',next:'hurt'}]},
  sleep:{s:'geralt',t:'Sleep’s better than any potion I brew. And it won’t turn your eyes black.',next:'d'},
  kids:{s:'geralt',t:'Hm. Ciri watched me train for months before she ever picked up a sword. They copy what you do. Not what you say.',next:'d'},
  hurt:{s:'geralt',t:'Bodies forgive a lot. If you ask every day. Not all at once on a Sunday.',next:'d'},
  d:{s:'geralt',t:'Darrow got you coming back. Roy made it fun. Grog fed you. My part’s simpler. Don’t stop.',next:'e'},
  e:{s:'geralt',t:'Seven different days. Train on every one. I’ve heard every excuse. Don’t bother.',opts:[
   {t:'Seven days. I won’t stop.',next:'f',do:[{quest:['steel-and-habit','advance']}]}]},
  f:{s:'narrator',t:'Geralt hands you a whetstone and nods at the sword on his knees. You sharpen it in silence until the light goes.',next:'g'},
  g:{s:'geralt',t:'Not bad. Hm.',end:true,do:[{xp:['fitness',500]}]}}},

 'steel-and-habit-3':{who:'geralt',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Geralt waits at the mountain pass above the village, Roach grazing nearby. Darrow, Roy and Grog are there too.',next:'b'},
  b:{s:'geralt',t:'Seven days. Twelve sessions before that. Didn’t miss when it was cold. Didn’t miss when it would’ve been easy to.',next:'c'},
  c:{s:'roy',t:'He’s not gonna say it, so I will. That was AMAZING!',next:'d'},
  d:{s:'grog',t:'Kevin also says it was amazing. Kevin is in my bag.',next:'e'},
  e:{s:'darrow',t:'Still wearing the band? Good. Feels lighter now, doesn’t it? That’s you, not the iron.',next:'f'},
  f:{s:'narrator',t:'Geralt unrolls a worn leather wrap. Inside is a small whetstone, black and smooth from years of use.',next:'g'},
  g:{s:'geralt',t:'Few strokes every morning. Not to sharpen anything. To remember. Steel dulls a little each day. So do you.',opts:[
   {t:'So does a man.',next:'man'},
   {t:'I’ll use it every morning.',next:'morning'}]},
  man:{s:'geralt',t:'Mm. So you sharpen before you need it. Not after.',next:'h'},
  morning:{s:'geralt',t:'I know. That’s why it’s yours.',next:'h'},
  h:{s:'narrator',t:'The four of them stand with you as the sun clears the peaks. Nobody gives a speech. Roy almost does. Grog sits on him.',next:'i'},
  i:{s:'geralt',t:'Stay sharp, {name}. See you in the yard.',end:true,do:[{quest:['steel-and-habit','complete']}]}}},
};
