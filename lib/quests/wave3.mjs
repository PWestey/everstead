// Third-wave capstone quests: Discipline (Dalinar), Home (Ragnar) and Fatherhood (Sevro).
// Format: see lib/dialogue.mjs (iron-body trees) and lib/quests.mjs.
// Tier counts: 5 = 15 habits / 10 days, 6 = 20 habits / 14 days.

/** @type {Record<string,any>} */
export const QUESTS={
 'the-next-step':{name:'The Next Step',area:'discipline',giver:'dalinar',tier:5,
  blurb:'Dalinar Kholin once lived for the Thrill and the bottle. He spent years choosing to be someone else, and he has heard you are trying to do the same.',
  say:['Talk to Dalinar in the Library reading room.','Report back to Dalinar in the Library courtyard.','Meet Dalinar on the hill above the village at first light.']},
 'under-my-roof':{name:'Under My Roof',area:'home',giver:'ragnar',tier:5,
  blurb:'A giant from the frozen south has come to the Workshop, stooping under every beam. Ragnar wants to know who sleeps under your roof, and how well you keep it.',
  say:['Talk to Ragnar at the Workshop.','Report back to Ragnar at the Workshop forge.','Meet Ragnar at your own front door at nightfall.']},
 'the-last-howl':{name:'The Last Howl',area:'fatherhood',giver:'sevro',tier:6,
  blurb:'A small, scarred man in a ratty wolf cloak has taken over the Hearth Inn. Sevro au Barca has heard about the Dad Council, and he has one final lesson. It is a loud one.',
  say:['Talk to Sevro at the Hearth Inn.','Report back to Sevro behind the Hearth Inn.','Meet Sevro and the whole Dad Council in the field past the Hearth Inn at dusk.']},
};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- The Next Step (Dalinar, Discipline, tier 5: 15 habits, 10 days) ----------------
 'the-next-step-1':{who:'dalinar',bg:'facility-scenes/school.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A broad, grey-haired man in a blue uniform sits in the Library reading room with a closed book in his scarred hands. He is not reading it.',next:'b'},
  b:{s:'dalinar',t:'You. Kaladin’s friend. Sit. Read me the first page of this. My eyes were never trained for letters, and my pride took longer to train than my sword.',next:'c'},
  c:{s:'narrator',t:'You read him a few lines about a king who chose to walk instead of ride. Dalinar listens with his eyes closed, as if it were a prayer.',next:'d'},
  d:{s:'dalinar',t:'Kaladin taught you promises. Stephen, humility. Anakin, patience. Revan, choosing who you are. Good men. I am the one who failed at all four first.',opts:[
   {t:'What do you mean, failed?',next:'failed'},
   {t:'You don’t look like a man who fails.',next:'look'}]},
  failed:{s:'dalinar',t:'I lived for the Thrill. The red joy of the fight. When there was no fight, I drank until there was nothing at all.',next:'e'},
  look:{s:'dalinar',t:'Then you have not met who I was. They called me the Blackthorn. Men feared me, and my sons barely knew me.',next:'e'},
  e:{s:'dalinar',t:'Tell me, {name}. What is your Thrill? The thing that pulls you away from the man you want to be?',opts:[
   {t:'My phone. I pick it up without thinking.',next:'phone'},
   {t:'Putting things off until it’s too late.',next:'delay'},
   {t:'Anger, when I’m worn out.',next:'anger'}]},
  phone:{s:'dalinar',t:'A small glowing cup that never empties. I know that pull. It promises you will feel alive, and leaves you hollow.',next:'f'},
  delay:{s:'dalinar',t:'Tomorrow is a very comfortable lie. I told it for years about the wine. Tomorrow I will stop. Tomorrow never came on its own.',next:'f'},
  anger:{s:'dalinar',t:'Then we are brothers. The Thrill fed on exactly that. It never once made me stronger. Only louder.',next:'f'},
  f:{s:'dalinar',t:'I did not become a better man in a day. I became one on the next day, and the one after. Never the whole road. Only the step in front of me.',next:'offer'},
  offer:{s:'dalinar',t:'Fifteen acts of discipline. Screens down, routines kept, focus held. Each one a step. Then come tell me what fought you.',opts:[
   {t:'Fifteen steps. I’ll take them. (Start “The Next Step”)',next:'yes',do:[{quest:['the-next-step','start']}]},
   {t:'I’ve tried before. I keep falling.',next:'no'}]},
  yes:{s:'dalinar',t:'Good. Do not look at the fifteenth. Look at the first. That is the only one a man can ever take.',end:true},
  no:{s:'dalinar',t:'So did I, a hundred times. Falling is not the end of the road. Lying there is. Come back when you are ready to stand.',end:true}}},

 'the-next-step-2':{who:'dalinar',bg:'facility-scenes/recruit.webp',start:'a',nodes:{
  a:{s:'narrator',t:'In the Library courtyard, Dalinar is running sword forms with a heavy practice blade. Kaladin leans on a pillar with a spear, watching.',next:'b'},
  b:{s:'kaladin',t:'Fifteen. I told him you’d get there. He bet me you would come back sooner.',next:'c'},
  c:{s:'dalinar',t:'I bet on a man doing it right, not fast. Fifteen honest steps. Now tell me. Which one nearly beat you?',opts:[
   {t:'A late night. I almost gave in.',next:'night',do:[{flag:'dalinar-confess'}]},
   {t:'A morning I wanted to quit everything.',next:'morning',do:[{flag:'dalinar-confess'}]},
   {t:'None, really. It went smoothly.',next:'smooth'}]},
  night:{s:'dalinar',t:'Night is when my old self always came calling. The house quiet, the cup within reach. You didn’t answer. That matters more than you know.',next:'d'},
  morning:{s:'dalinar',t:'And yet you got up and took the step. That is the whole art. Not wanting it. Doing it while you don’t.',next:'d'},
  smooth:{s:'kaladin',t:'Enjoy it. The smooth stretch is when you build the wall. The storm always comes later.',next:'d'},
  d:{s:'dalinar',t:'When I first gave up the wine, I asked a strange power to take the pain of my past away. It took more than I meant. I would not do it again.',next:'e'},
  e:{s:'dalinar',t:'A man must carry his failures, not erase them. They are the reason he keeps walking. They are the weight that makes him careful.',opts:[
   {t:'That’s a heavy way to live.',next:'heavy'},
   {t:'So I don’t get to forget who I was?',next:'forget'}]},
  heavy:{s:'kaladin',t:'It is. You get stronger carrying it. Trust a bridgeman on that.',next:'f'},
  forget:{s:'dalinar',t:'No. You get to remember, and choose differently anyway. That is worth more than forgetting.',next:'f'},
  f:{s:'dalinar',t:'Now the long road. Ten different days. Some will be good. Some will be grey. Walk all of them.',opts:[
   {t:'Ten days. One step at a time.',next:'g',do:[{quest:['the-next-step','advance']}]}]},
  g:{s:'dalinar',t:'Good. Now take a blade. A disciplined mind lives in a body that knows its forms.',next:'h'},
  h:{s:'narrator',t:'You run the forms beside him until your arms burn. Kaladin calls out every mistake. Dalinar only says, “Again.”',end:true,do:[{xp:['discipline',1000]}]}}},

 'the-next-step-3':{who:'dalinar',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'First light on the hill above the village. Dalinar stands alone, a small stoppered flask in his hand, watching the sun climb over the fields.',next:'b'},
  b:{s:'dalinar',t:'Ten days. Some of them you walked tired. Some of them you walked angry. You walked them all. I am proud of you.',next:'c'},
  c:{s:'narrator',t:'Below, at the bottom of the hill, Kaladin, Stephen, Anakin and Revan stand together, watching. Kaladin raises his spear in salute.',next:'d'},
  d:{s:'dalinar',t:'This flask held the last wine I ever bought. I never opened it. I poured it out years ago and kept the flask, so I would remember.',opts:[
   {t:'Remember what?',next:'remember'},
   {t:'Why keep something like that?',next:'why'}]},
  remember:{s:'dalinar',t:'That I was once a man who needed it. And that every day since, I have chosen not to be.',next:'e'},
  why:{s:'dalinar',t:'Because a soldier keeps the broken shield that saved him. This empty flask saved me, one morning at a time.',next:'e'},
  e:{s:'dalinar',t:'It is yours now. Not for wine. For the thing you are leaving behind. Whatever pulls you from the man you want to be.',next:'f'},
  f:{s:'narrator',t:'He presses the empty flask into your hand. The leather is worn smooth where his thumb has rubbed it ten thousand times.',next:'g'},
  g:{s:'dalinar',t:'The ritual. Each morning, hold it and name one step for today. Not the whole road. One step. Then take it before anything else.',opts:[
   {t:'And if I fall?',next:'fall'},
   {t:'One step. Every morning.',next:'h'}]},
  fall:{s:'dalinar',t:'Then you hold it again and name the next step. A man is never measured by how far he fell. Only by the step he takes after.',next:'h'},
  h:{s:'narrator',t:'You set the flask on the chain beside your other teachers’ marks. Dalinar lays a heavy hand on your shoulder and turns you toward the village.',next:'i'},
  i:{s:'dalinar',t:'Go down there and take the next step, Blackthorn’s friend. Then the next. That is all any of us have ever done.',end:true,do:[{quest:['the-next-step','complete']}]}}},

 // ---------------- Under My Roof (Ragnar, Home, tier 5: 15 habits, 10 days) ----------------
 'under-my-roof-1':{who:'ragnar',bg:'facility-scenes/businesses.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Workshop door is too short for him. A pale giant with a braided white beard ducks inside, bone talismans clicking, and sits very carefully on a crate.',next:'b'},
  b:{s:'ragnar',t:'Peace, little brother. I am Ragnar, of the Obsidian. I was told a man here learned hinges from a wizard and floors from a fool in red.',next:'c'},
  c:{s:'player',t:'That’s me. Peter, Piotr, Albus and Wade. Mostly Wade’s floors.',next:'d'},
  d:{s:'ragnar',t:'Good teachers. Now I ask a different question. Who sleeps under your roof?',opts:[
   {t:'My wife and my kids.',next:'family'},
   {t:'Why does that matter for chores?',next:'chores'}]},
  family:{s:'ragnar',t:'Then they are your tribe, and the house is the hall that keeps them. Every swept floor is a shield raised over them.',next:'e'},
  chores:{s:'ragnar',t:'Because a home is not walls. Walls are only the skin. The people inside are the heart. You clean for the heart.',next:'e'},
  e:{s:'ragnar',t:'Where I was born, under the ice, my people had nothing that was theirs. Not even their names. We were kept, not home.',next:'f'},
  f:{s:'ragnar',t:'When I broke free, I swore my sisters would sleep warm, under a roof they chose. A home is a promise. Chores are how you keep it.',opts:[
   {t:'I hadn’t thought of it that way.',next:'thought'},
   {t:'Most days it just feels like dishes.',next:'dishes'}]},
  thought:{s:'ragnar',t:'Few men do. They see the mess. A warrior sees what the mess is guarding.',next:'offer'},
  dishes:{s:'ragnar',t:'Ha! Dishes, yes. And yet a clean bowl says, someone here was thinking of you. Is that not a good thing to say?',next:'offer'},
  offer:{s:'ragnar',t:'Fifteen tasks for your hall. Sweep, mend, wash, set things in order. Each one for someone under your roof. Then come back to me.',opts:[
   {t:'Fifteen. For my tribe. (Start “Under My Roof”)',next:'yes',do:[{quest:['under-my-roof','start']}]},
   {t:'Not now, Ragnar. I’m worn out.',next:'no'}]},
  yes:{s:'ragnar',t:'Good. Go gently, little brother. A home is kept by soft hands as often as strong ones.',end:true},
  no:{s:'ragnar',t:'Rest, then. Even giants sleep. My crate and I will be here.',end:true}}},

 'under-my-roof-2':{who:'ragnar',bg:'facility-scenes/mine.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Ragnar is at the Workshop forge, hammering a long iron bar with blows that shake the tools on the wall. He stops when he sees you and grins.',next:'b'},
  b:{s:'ragnar',t:'Fifteen! The village talks. A man was seen carrying out trash before anyone asked. The women nodded like it was a miracle.',next:'c'},
  c:{s:'ragnar',t:'Tell me. When you did these tasks, did anyone under your roof notice?',opts:[
   {t:'My wife did. She seemed lighter.',next:'wife',do:[{flag:'ragnar-noticed'}]},
   {t:'One of my kids helped me.',next:'kid',do:[{flag:'ragnar-noticed'}]},
   {t:'Nobody noticed at all.',next:'nobody'}]},
  wife:{s:'ragnar',t:'Yes. A load lifted from her is a load lifted from the whole hall. You gave her a shield she did not have to raise herself.',next:'d'},
  kid:{s:'ragnar',t:'Ha! Then you are teaching. A child who sweeps beside his father will one day keep his own hall.',next:'d'},
  nobody:{s:'ragnar',t:'Good. The best guarding goes unseen. My people say the strongest shield is the one no one knows was there.',next:'d'},
  d:{s:'ragnar',t:'This bar is a bolt for a door. When it is done, it will hold against any storm. But a bolt is nothing if no one slides it each night.',next:'e'},
  e:{s:'ragnar',t:'So too your house. Once is a deed. Many days is a wall.',opts:[
   {t:'You’re saying I need to keep at it.',next:'keep'},
   {t:'What happened to your sisters?',next:'sisters'}]},
  keep:{s:'ragnar',t:'I am saying more gently what Piotr would say with a frown. Yes. Keep at it.',next:'f'},
  sisters:{s:'ragnar',t:'They live. One leads our people now. I fought so they would. That is the only story I want told of me.',next:'f'},
  f:{s:'ragnar',t:'Ten different days. Small tasks, many mornings. Make the hall a habit, not a festival.',opts:[
   {t:'Ten days. I’ll keep the hall.',next:'g',do:[{quest:['under-my-roof','advance']}]}]},
  g:{s:'ragnar',t:'Good. Now hold the bar while I strike. Do not flinch. I have only missed once, and he forgave me.',next:'h'},
  h:{s:'narrator',t:'You hold. He strikes. Sparks fly and the iron rings. You do not flinch, and Ragnar laughs like a rockslide.',end:true,do:[{xp:['home',1000]}]}}},

 'under-my-roof-3':{who:'ragnar',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At nightfall Ragnar waits outside your own front door, the forged iron bolt across his shoulders. Warm light spills from your windows.',next:'b'},
  b:{s:'ragnar',t:'Ten days, little brother. I walked past your house each one. It changed. It looks like someone lives here who is loved.',next:'c'},
  c:{s:'ragnar',t:'Before I go in, I will ask what my people ask at every new hall. Who are you guarding?',opts:[
   {t:'Name them one by one.',next:'names'},
   {t:'Everyone inside that door.',next:'everyone'}]},
  names:{s:'narrator',t:'You say each name. Your wife. Each of your children. Ragnar repeats them slowly, as if carving them into stone.',next:'d'},
  everyone:{s:'ragnar',t:'Good. But tonight, say their names too. A guardian who knows the names fights harder than one who knows the number.',next:'d'},
  d:{s:'narrator',t:'He fits the iron bolt to your door. It slides home with a deep, satisfied click.',next:'e'},
  e:{s:'ragnar',t:'This is my gift to the hall. And this one is for you.',next:'f'},
  f:{s:'narrator',t:'He unties one bone talisman from his beard, a small raven carved from pale bone, and presses it into your palm.',opts:[
   {t:'Your talisman? I can’t take that.',next:'cant'},
   {t:'What does the raven mean?',next:'raven'}]},
  cant:{s:'ragnar',t:'You can. A gift refused is a door shut. I have many. You have one hall, and now one raven to watch it.',next:'g'},
  raven:{s:'ragnar',t:'Among my people, the raven watches over the sleeping. It is the guardian who never boasts. Only watches, and keeps.',next:'g'},
  g:{s:'ragnar',t:'The ritual. Each night, walk your hall. Set one thing in order. Touch each door where your people sleep, and say their names.',opts:[
   {t:'Every night. Their names, one by one.',next:'h'},
   {t:'Even on nights I’m exhausted?',next:'tired'}]},
  tired:{s:'ragnar',t:'Those nights most of all. The walk takes two minutes. The names take less. The home it builds lasts a lifetime.',next:'h'},
  h:{s:'narrator',t:'You thread the raven onto your chain. Through the window you see your family moving in the warm light. Ragnar puts a hand on the doorframe.',next:'i'},
  i:{s:'ragnar',t:'Go in, {name}. Bolt the door. Sleep well under your own roof. The raven and I will keep watch tonight.',end:true,do:[{quest:['under-my-roof','complete']}]}}},

 // ---------------- The Last Howl (Sevro, Fatherhood, tier 6: 20 habits, 14 days) ----------------
 'the-last-howl-1':{who:'sevro',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Hearth Inn is chaos. A small, wiry man in a mangy wolf cloak stands on a table, teaching three village children to howl. They are very good at it.',next:'b'},
  b:{s:'sevro',t:'Oi! You! The Dad Council guy. Din, Logan, Quill, Varian, Baine. Five dads and not one of them can howl. It’s embarrassing.',next:'c'},
  c:{s:'sevro',t:'Sevro au Barca. Goblin. Howler. Husband to the most terrifying woman alive. And father to Electra, who is perfect and also a gorydamn menace.',opts:[
   {t:'You seem like a fun dad.',next:'fun'},
   {t:'Why are you teaching kids to howl in an inn?',next:'why'}]},
  fun:{s:'sevro',t:'I’m the best dad. Ask anyone. Don’t ask Victra. She’ll say I’m the second-best dad and that she’s the first.',next:'d'},
  why:{s:'sevro',t:'Because kids should be loud somewhere that isn’t a shelter or a war. Wait. That got dark. Forget I said war.',next:'d'},
  d:{s:'sevro',t:'Real talk, though. My dad was around my whole life, and I never knew it. He hid behind a mask, playing the hero. I found out too late.',next:'e'},
  e:{s:'sevro',t:'So I swore Electra would never wonder. Not once. She’d know where I was, who I was and that I was hers. Every gorydamn day.',opts:[
   {t:'Do my kids know that about me?',next:'know'},
   {t:'I’m sorry about your dad.',next:'sorry'}]},
  know:{s:'sevro',t:'That’s the question, isn’t it? That’s the only question. Let’s find out.',next:'offer'},
  sorry:{s:'sevro',t:'Yeah. Me too. He loved me loads. He just loved me from behind a wall. Don’t build walls, mate. Build forts. With blankets.',next:'offer'},
  offer:{s:'sevro',t:'Twenty. Twenty times you show up for your kids. Play, bedtime, pancakes, listening. No phone. No mask. Then come find me.',opts:[
   {t:'Twenty. No masks. (Start “The Last Howl”)',next:'yes',do:[{quest:['the-last-howl','start']}]},
   {t:'Twenty is a lot, Sevro.',next:'no'}]},
  yes:{s:'sevro',t:'Ha! There he is. Go on, then. And practice your howl in the cart. You’re going to need it.',end:true},
  no:{s:'sevro',t:'Twenty’s nothing. Electra asks me for twenty things before breakfast. Come back when you’re feeling brave, primus.',end:true}}},

 'the-last-howl-2':{who:'sevro',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Behind the Hearth Inn, Sevro is building an enormous blanket fort. Darrow holds up one corner, looking very much like a man who lost a bet.',next:'b'},
  b:{s:'sevro',t:'Twenty! Reaper, he did twenty! Pay up. And hold that corner straight, you giant gorydamn lamppost.',next:'c'},
  c:{s:'darrow',t:'He said you’d quit at twelve. I said you were stubborn. Mostly I’m here because he locked my boots in this fort.',next:'d'},
  d:{s:'sevro',t:'Right. Dad Council report. Tell me the best one. The one you’ll still remember when you’re old and smelly.',opts:[
   {t:'A bedtime where they told me everything.',next:'bedtime',do:[{flag:'sevro-best-moment'}]},
   {t:'We played until we were all crying laughing.',next:'laugh',do:[{flag:'sevro-best-moment'}]},
   {t:'A quiet one. I just sat and listened.',next:'quiet',do:[{flag:'sevro-best-moment'}]}]},
  bedtime:{s:'sevro',t:'The bedtime confessions. Gorydamn gold. They save the real stuff for the dark, right when you’re desperate to leave. Don’t leave.',next:'e'},
  laugh:{s:'sevro',t:'YES. That’s the stuff. Kids don’t remember the toys. They remember Dad on the floor, wheezing, pretending to be a horse.',next:'e'},
  quiet:{s:'sevro',t:'Huh. Look at you, being all wise. Yeah. Sometimes the bravest thing is shutting up. Victra says I should try it.',next:'e'},
  e:{s:'darrow',t:'He won’t tell you this, so I will. He went to war with Electra’s drawings sewn inside his armor. Every one she ever made.',next:'f'},
  f:{s:'sevro',t:'Oi! That was classified. And also true. Shut up, Reaper.',opts:[
   {t:'That’s actually beautiful, Sevro.',next:'beautiful'},
   {t:'I’d do the same.',next:'same'}]},
  beautiful:{s:'sevro',t:'Don’t. I’ve got a reputation. I’m a goblin. Goblins don’t do beautiful. Goblins do... fine, a bit beautiful.',next:'g'},
  same:{s:'sevro',t:'I know you would. That’s why you’re getting the last lesson. Not everyone does.',next:'g'},
  g:{s:'sevro',t:'Here’s the big one. Fourteen different days. Two whole weeks of showing up. Not a burst. A rhythm they can count on.',opts:[
   {t:'Fourteen days. They’ll never wonder.',next:'h',do:[{quest:['the-last-howl','advance']}]}]},
  h:{s:'sevro',t:'Ha! Now get in the fort. Reaper, you too. Nobody leaves until we’ve told one scary story and eaten all the snacks.',next:'i'},
  i:{s:'narrator',t:'Three grown men cram into a blanket fort. Darrow’s feet stick out the end. Sevro tells a terrible ghost story, and laughs the whole way through.',end:true,do:[{xp:['fatherhood',1000]}]}}},

 'the-last-howl-3':{who:'sevro',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At dusk, in the field past the Hearth Inn, a bonfire burns. Din, Logan, Quill, Varian and Baine sit around it. Victra leans against a cart, arms crossed, smiling.',next:'b'},
  b:{s:'sevro',t:'Fourteen days. FOURTEEN. Two weeks and you never once left them wondering. Gorydamn legend.',next:'c'},
  c:{s:'victra',t:'He has talked about nothing else for two weeks. I had to hear your name at dinner. Electra thinks you are a famous warrior.',next:'d'},
  d:{s:'sevro',t:'Six of us, now. The full Dad Council. Din found a kid. Logan softened. Quill sang. Varian came home. Baine walked the path. And you showed up.',opts:[
   {t:'I couldn’t have done it without all of you.',next:'all'},
   {t:'What did you do, Sevro?',next:'you'}]},
  all:{s:'logan',t:'Yeah, you could. You just would’ve been grumpier about it. Like me.',next:'e'},
  you:{s:'sevro',t:'I stopped hiding. Every bit of me. The wild, the scared, the dumb jokes. I gave Electra all of it, so she’d never have to guess.',next:'e'},
  e:{s:'sevro',t:'This is the last lesson, and then I’m done being serious forever. Your kids won’t remember what you said. They’ll remember that you were there.',next:'f'},
  f:{s:'narrator',t:'Sevro unclasps his wolf cloak. From its edge he cuts a strip of grey fur and ties it into a small braided band.',next:'g'},
  g:{s:'sevro',t:'My Howler cloak. Wore it through every war. This piece is yours. Your kids are Howlers now. Honorary. It’s legally binding. I checked.',opts:[
   {t:'Your cloak? Sevro, that’s too much.',next:'much'},
   {t:'They’re going to love this.',next:'love'}]},
  much:{s:'victra',t:'Take it. He has been cutting pieces off it for weeks, practicing. It is barely a cloak now.',next:'h'},
  love:{s:'sevro',t:'Course they will. I’m a gorydamn delight. And so are you, when you’re on the floor with them.',next:'h'},
  h:{s:'sevro',t:'The ritual. Every night, before the lights go out, you howl with them. Loud and stupid. Then you tell each one, “I’m right here. I’m yours.”',opts:[
   {t:'Every night. Howl, then the words.',next:'i'},
   {t:'What about the nights I’m away?',next:'away'}]},
  away:{s:'sevro',t:'Then you call and howl down the line. People will stare. Let them. My kid never once fell asleep wondering where I was.',next:'i'},
  i:{s:'narrator',t:'You tie the band of grey fur onto your chain, beside the signet, the dog tag, the cassette, the lion and the totem. Your teachers’ marks, all of them.',next:'k'},
  k:{s:'narrator',t:'“Last howl,” says Sevro. Six fathers howl at the rising moon, Din in his helmet. Across the village, faintly, your children howl back.',next:'l'},
  l:{s:'sevro',t:'Hear that, {name}? That’s the sound of kids who know exactly where their dad is. Now go home. Get on the floor. Be there.',end:true,do:[{quest:['the-last-howl','complete']}]}}},
};
