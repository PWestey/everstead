// Quests for Work (Tony, Kelsier, Bruce) and Home (Peter, Piotr). Steps and rewards are built by the engine from `tier`.

/** @type {Record<string,any>} */
export const QUESTS={
 'shipped':{name:'Shipped',area:'work',giver:'tony',tier:1,
  blurb:'Tony’s Market stall is buried in brilliant, half-built gadgets, including a kettle with opinions. He wants to know if you can actually finish something.',
  say:['Talk to Tony at the Market.','Report back to Tony.','Meet Tony at his stall after the Market closes.']},
 'the-long-con':{name:'The Long Con',area:'work',giver:'kelsier',tier:2,
  blurb:'A smiling stranger in a mistcloak has been watching you work the Market. He says he’s putting a crew together, and every crew needs a plan.',
  say:['Talk to Kelsier at the Market.','Report back to Kelsier.','Meet Kelsier on the rooftops above the Market when the mist rolls in.']},
 'steady-hands':{name:'Steady Hands',area:'work',giver:'bruce',tier:3,
  blurb:'Bruce saw you snap at a supplier in the Market. He knows that look a little too well, and he’d like to help before it costs you.',
  say:['Talk to Bruce at the Market.','Report back to Bruce.','Meet Bruce in the quiet back room of the Museum.']},
 'friendly-neighbor':{name:'Your Friendly Neighbor',area:'home',giver:'peter',tier:1,
  blurb:'Peter fixed half the village’s fences this week and forgot his own gate. He has a hunch you’ve got the same problem.',
  say:['Talk to Peter at the Workshop.','Report back to Peter.','Meet Peter on the Workshop roof at dusk.']},
 'the-painted-porch':{name:'The Painted Porch',area:'home',giver:'piotr',tier:2,
  blurb:'Piotr is repainting the Workshop porch one careful board at a time. He has a spare brush, and a gentle opinion about your house.',
  say:['Talk to Piotr at the Workshop.','Report back to Piotr.','Join Piotr for Sunday borscht on the Workshop porch.']},
};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- Shipped (Tony, Work, tier 1) ----------------
 'shipped-1':{who:'tony',bg:'facility-scenes/expo.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Tony’s stall is a landslide of brass: gauntlets, a kettle that hums show tunes, three clocks with no hands. Nothing on the bench is finished.',next:'b'},
  b:{s:'tony',t:'Don’t touch the kettle, it bites. Hey, you’re the habit-board guy. Love a dashboard. Mine has forty open projects and a coffee ring.',next:'c'},
  c:{s:'tony',t:'Okay, confession. I start nine things a week and finish zero. Pepper calls it my launch-and-abandon phase. It’s been a long phase.',opts:[
   {t:'Sounds like my work week.',next:'same'},
   {t:'So finish one.',next:'finish'},
   {t:'Maybe you need fewer ideas.',next:'fewer'}]},
  same:{s:'tony',t:'Ha. Misery loves a co-founder. Great, two guys with a shipping problem. That’s either a support group or a startup.',next:'offer'},
  finish:{s:'tony',t:'Wow. Okay. Blunt. You sound like Rhodey. I hate it. Keep doing it.',next:'offer'},
  fewer:{s:'tony',t:'Fewer ideas. Did you just say that out loud, in my stall? No. Fewer open tabs. Same thing, better branding.',next:'offer'},
  offer:{s:'tony',t:'Here’s the bet. You close three real pieces of work. Closed, not started. Email sent, report filed, bill paid. Done done.',next:'offer2'},
  offer2:{s:'tony',t:'Meanwhile I finish one of these. Pick one. Not the kettle. Fine, the kettle. Loser buys coffee.',opts:[
   {t:'You’re on. (Start “Shipped”)',next:'yes',do:[{quest:['shipped','start']}]},
   {t:'Not right now, Tony.',next:'no'}]},
  yes:{s:'tony',t:'Great. Go. Clock’s running. I’m already behind, and I don’t do behind.',end:true},
  no:{s:'tony',t:'Fine. Me and the kettle will be over here, not shipping. Come back when you feel like winning something.',end:true}}},

 'shipped-2':{who:'tony',bg:'facility-scenes/businesses.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Tony is elbow-deep in the kettle, a screwdriver in his teeth and grease on his nose. Two of the clocks have hands now. One runs backwards.',next:'b'},
  b:{s:'tony',t:'Three? Already? Huh. Okay, coffee’s on me. Don’t make that face, I pay my debts. Eventually. Happy usually reminds me.',next:'c'},
  c:{s:'tony',t:'Serious question, and I’ll pretend I’m not taking notes. When you closed them out, what did that feel like?',opts:[
   {t:'Lighter. Like I put something down.',next:'light',do:[{flag:'tony-lighter'}]},
   {t:'Honestly, a little boring.',next:'boring'},
   {t:'I kept wanting to start something new.',next:'itch'}]},
  light:{s:'tony',t:'Yes. That. Open loops sit in your chest like shrapnel. Every one you close is one less thing pinging you at three a.m.',next:'d'},
  boring:{s:'tony',t:'Yeah, the last ten percent is dull. That’s the trick. Everybody bails right there, so whoever doesn’t, wins.',next:'d'},
  itch:{s:'tony',t:'Oh, I know that itch. I once built jet boots to avoid answering one email. Still had to answer it. In the boots.',next:'d'},
  d:{s:'tony',t:'Now the hard part. Anybody can go nuts for one afternoon. I want real work out of you on three separate days.',next:'e'},
  e:{s:'tony',t:'Not three tasks in one sugar rush. Three days. One sprint is a demo. Three days is something you can actually sell.',opts:[
   {t:'Three days. I’ll ship every one.',next:'f',do:[{quest:['shipped','advance']}]}]},
  f:{s:'tony',t:'And I finish the kettle. Probably. Don’t look at me like that, I can feel it.',next:'g'},
  g:{s:'narrator',t:'He slides a coffee across the bench and turns back to the kettle. For once, he picks up the same thing he put down yesterday.',end:true,do:[{xp:['work',400]}]}}},

 'shipped-3':{who:'tony',bg:'ui-scenes/Bg_City_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'The Market is shut and dark. Tony’s stall has one warm lamp on, and for the first time you can see the actual surface of his bench.',next:'b'},
  b:{s:'tony',t:'Three days, every one shipped. I can hire geniuses anywhere, they’re everywhere. Finishers? I can count them on one gauntlet.',next:'c'},
  c:{s:'narrator',t:'The kettle sits in the middle of the bench, whole and polished. Tony keeps a respectful distance from it.',next:'d'},
  d:{s:'tony',t:'Finished it. Four years and one very annoying customer. It hums in key now. It refuses to do AC/DC, which feels personal.',opts:[
   {t:'Proud of you, Tony.',next:'proud'},
   {t:'Does it actually make coffee?',next:'coffee'}]},
  proud:{s:'tony',t:'Nope. Don’t. That’s solder smoke in my eye. Totally normal workshop hazard.',next:'e'},
  coffee:{s:'tony',t:'It makes tea. Bad tea. Finished and perfect are two different words, look it up. Then go finish something.',next:'e'},
  e:{s:'tony',t:'Anyway. I made you a thing. Small. Finished. Don’t get used to it.',next:'f'},
  f:{s:'narrator',t:'He drops a heavy brass stamp in your palm. The face reads SHIPPED in block letters. The P is a little crooked. He clearly noticed and left it.',next:'g'},
  g:{s:'tony',t:'Close something, stamp it. That’s the rule. Starting’s free, {name}. Done is the whole game.',end:true,do:[{quest:['shipped','complete']}]}}},

 // ---------------- The Long Con (Kelsier, Work, tier 2) ----------------
 'the-long-con-1':{who:'kelsier',bg:'facility-scenes/trading.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A man in a tasseled mistcloak leans on a spice stall, walking a coin across his knuckles. He has clearly been watching you for a while.',next:'b'},
  b:{s:'kelsier',t:'Relax, friend. If I wanted your purse, you’d already be wondering where it went. Kelsier. I put crews together.',next:'c'},
  c:{s:'kelsier',t:'I’ve watched you work this Market. You’re sharp. You also carry every job yourself, like someone told you that was noble.',opts:[
   {t:'I usually do have to.',next:'alone'},
   {t:'What’s the job?',next:'job'},
   {t:'Why are you smiling like that?',next:'smile'}]},
  alone:{s:'kelsier',t:'I heard that a lot in the Pits. Mostly from men who didn’t walk out. Nobody pulls the big job alone. Not even me.',next:'offer'},
  job:{s:'kelsier',t:'Straight to it. Oh, I like you. The job is your own work. We steal back the hours that keep vanishing on you.',next:'offer'},
  smile:{s:'kelsier',t:'Because I’ve survived worse than a bad week, and smiling annoys the people who’d rather I hadn’t. Also, morale.',next:'offer'},
  offer:{s:'kelsier',t:'Every job I’ve ever pulled started with a plan on a table. Tonight, write tomorrow’s work down. Then pull off five real pieces of it.',next:'offer2'},
  offer2:{s:'kelsier',t:'Five. Planned, then done. Dox would want to see you run a small job before I hand you a big one. So would I.',opts:[
   {t:'Count me in. (Start “The Long Con”)',next:'yes',do:[{quest:['the-long-con','start']}]},
   {t:'I’ll think about it.',next:'no'}]},
  yes:{s:'kelsier',t:'Wonderful. Welcome to the crew. Do try to look a little less honest. It makes the merchants nervous.',end:true},
  no:{s:'kelsier',t:'Think fast, then. Crews don’t wait. Well. This one will wait for you. Once.',end:true}}},

 'the-long-con-2':{who:'kelsier',bg:'facility-scenes/northern.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Kelsier finds you at the edge of the Market at dusk, two steaming cups in hand and a folded paper tucked under one arm.',next:'b'},
  b:{s:'kelsier',t:'Five jobs, planned and pulled. Tony’s telling people you finish things now. I told him I spotted it first. He hated that.',next:'c'},
  c:{s:'kelsier',t:'So. Tell me what happened to your lovely plan once the day actually started.',opts:[
   {t:'It fell apart by lunch.',next:'apart',do:[{flag:'kelsier-plan-broke'}]},
   {t:'It held. Mostly.',next:'held'},
   {t:'I didn’t really plan. I just worked.',next:'noplan'}]},
  apart:{s:'kelsier',t:'Of course it did. Mine fall apart constantly. A plan isn’t meant to survive. It tells you what to grab when the building’s on fire.',next:'d'},
  held:{s:'kelsier',t:'Mostly is a lovely word. In my trade, mostly is how you live to the next job. Let’s make it a bigger mostly.',next:'d'},
  noplan:{s:'kelsier',t:'And you still pulled it off. Talented. Also dangerous. I’ve buried a few talented men who thought planning was for other people.',next:'d'},
  d:{s:'kelsier',t:'Now, the long con. The good ones aren’t one night. They’re months of little moves nobody notices until it’s far too late.',next:'e'},
  e:{s:'kelsier',t:'Work four different days. Plan each one the night before. That’s how you topple an empire. Or, you know, get promoted.',opts:[
   {t:'Four days. Planned. I’m in.',next:'f',do:[{quest:['the-long-con','advance']}]}]},
  f:{s:'kelsier',t:'There. That look. That’s a man about to surprise a lot of people who stopped paying attention to him.',next:'g'},
  g:{s:'narrator',t:'He unfolds the paper. It isn’t a vault plan. It’s your week, sketched in his tidy hand, with four days circled in ink.',end:true,do:[{xp:['work',500]}]}}},

 'the-long-con-3':{who:'kelsier',bg:'facility-scenes/roaming.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Mist curls over the Market rooftops. Kelsier sits on a chimney, legs dangling, watching the lamps below go out one by one.',next:'b'},
  b:{s:'kelsier',t:'Four days. Planned and pulled, all of them. You know how many crews I’ve watched fall apart by day two? Breeze used to take bets.',next:'c'},
  c:{s:'kelsier',t:'I lost everything once. My wife. A year in a pit. What got me out wasn’t rage. Well. Not only rage. It was a plan, and friends.',next:'d'},
  d:{s:'kelsier',t:'So. Who’s your crew, {name}? When the job gets ugly, who are you actually doing it for?',opts:[
   {t:'My family. Always.',next:'family'},
   {t:'The people on my team.',next:'team'},
   {t:'Honestly, I’m not sure anymore.',next:'unsure'}]},
  family:{s:'kelsier',t:'Good. Then every paycheck is a heist you pulled for them. Don’t let the office forget that. Don’t you forget it either.',next:'e'},
  team:{s:'kelsier',t:'Good answer. A man who remembers his crew gets followed into the mists. One who only remembers his title gets followed by nobody.',next:'e'},
  unsure:{s:'kelsier',t:'Honest. I respect that, though I rarely indulge. Go find out. Knowing why you work makes the bad weeks a lot shorter.',next:'e'},
  e:{s:'narrator',t:'He flips the coin one last time, catches it without looking, and holds it out to you.',next:'f'},
  f:{s:'kelsier',t:'Keep it. Every night, flip it and name tomorrow’s one big job. Heads or tails, you do the job anyway. That’s the joke. I love that joke.',next:'g'},
  g:{s:'kelsier',t:'Welcome to the crew. Permanently. Now smile. We just pulled off something nobody thought we could, and that’s supposed to be fun.',end:true,do:[{quest:['the-long-con','complete']}]}}},

 // ---------------- Steady Hands (Bruce, Work, tier 3) ----------------
 'steady-hands-1':{who:'bruce',bg:'facility-scenes/apothecary.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Bruce is sorting glass vials behind the apothecary stall, glasses pushed up on his head. He doesn’t look up, but he knows you’re there.',next:'b'},
  b:{s:'bruce',t:'Saw you with the grain supplier this morning. Jaw tight, voice real quiet. I, uh, know that voice. Intimately.',next:'c'},
  c:{s:'bruce',t:'Not judging. Honest. Just asking. How long has work been getting you that wound up?',opts:[
   {t:'Longer than I’d like to admit.',next:'long',do:[{flag:'bruce-honest'}]},
   {t:'I’m fine. It was one bad morning.',next:'fine'},
   {t:'He deserved it.',next:'deserved'}]},
  long:{s:'bruce',t:'Okay. Thank you. That’s genuinely the hardest part, and you just did it standing next to a rack of cough syrup.',next:'d'},
  fine:{s:'bruce',t:'Sure. I said “I’m fine” for about ten years. There’s a lab in New Mexico that would like a word.',next:'d'},
  deserved:{s:'bruce',t:'Maybe he did. But it doesn’t stay with him. You take it home. It sits down at dinner with you. Trust me on that.',next:'d'},
  d:{s:'bruce',t:'Tony taught you to finish. Kelsier, to plan. I’ve got something way less exciting. How to stay level.',next:'e'},
  e:{s:'bruce',t:'Here’s the experiment. Eight pieces of real work. One slow breath before each. One line in a notebook after.',next:'f'},
  f:{s:'bruce',t:'What you did, how you felt. That’s it. Just data. Nobody’s grading it. Will you try?',opts:[
   {t:'I’ll try it. (Start “Steady Hands”)',next:'yes',do:[{quest:['steady-hands','start']}]},
   {t:'Not this week, Bruce.',next:'no'}]},
  yes:{s:'bruce',t:'Good. Eight gives us a pattern. Bring me whatever you find, even the ugly stuff. Especially that.',end:true},
  no:{s:'bruce',t:'Okay. No pressure. That’s, uh, kind of the entire point. I’ll be here.',end:true}}},

 'steady-hands-2':{who:'bruce',bg:'facility-scenes/school.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Bruce has turned an empty schoolroom into a quiet little lab. A kettle hums on a burner. He’s poured two cups of tea before you sit.',next:'b'},
  b:{s:'bruce',t:'Eight pieces of work, eight notes. Can I see? Only if you want. It’s your data.',opts:[
   {t:'Hand him the notebook.',next:'show'},
   {t:'Just tell him what you found.',next:'tell'}]},
  show:{s:'narrator',t:'He reads slowly, nodding, tapping a line here and there with his pen. He doesn’t say a word until the last page.',next:'c'},
  tell:{s:'bruce',t:'That works. The notes were for you anyway. So what jumped out?',next:'c'},
  c:{s:'bruce',t:'Here’s what most people find. It isn’t really the work. It spikes when you’re tired, rushed, or you skipped lunch. Did you skip lunch?',next:'d'},
  d:{s:'player',t:'So I don’t need to try harder. I need to catch it sooner.',next:'e'},
  e:{s:'bruce',t:'Yeah. Exactly that. You can’t out-muscle it. Believe me. I have run that experiment at a very large scale.',next:'f'},
  f:{s:'bruce',t:'Next phase. Five separate days of work, same protocol. Breath first, note after. One good day is a fluke. Five is a result.',opts:[
   {t:'Five days. Breath and notes.',next:'g',do:[{quest:['steady-hands','advance']}]}]},
  g:{s:'bruce',t:'And if a day goes bad, write it down. Bad data’s still data. Honestly, it’s usually the interesting data.',next:'h'},
  h:{s:'narrator',t:'He tops up your tea without asking. It’s the calmest you’ve felt on a work day in a long while.',end:true,do:[{xp:['discipline',400]}]}}},

 'steady-hands-3':{who:'bruce',bg:'facility-scenes/museum.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Museum’s back room is dim and still. Bruce sits at a long table, a battered, cracked notebook in front of him.',next:'b'},
  b:{s:'bruce',t:'Five days. Level. I saw you in the Market Thursday. Guy got right in your face, and you just breathed. I was impressed. Little jealous.',next:'c'},
  c:{s:'bruce',t:'I want to show you something. I don’t, uh, show this to a lot of people.',next:'d'},
  d:{s:'narrator',t:'He opens the old notebook. Page after page of cramped handwriting: dates, tasks, heart rates. Some pages are torn. A few are scorched.',next:'e'},
  e:{s:'bruce',t:'Years of these. The days I held it together, and the days I didn’t. This book is why anybody still lets me near a lab.',opts:[
   {t:'Why show me this?',next:'why'},
   {t:'The scorched pages. Those were bad days?',next:'scorched'}]},
  why:{s:'bruce',t:'Because I think you think calm people come out of the box that way. We don’t. We take notes and keep going.',next:'f'},
  scorched:{s:'bruce',t:'The worst ones. I kept them anyway. You don’t get to tear out the bad pages. They’re part of the study.',next:'f'},
  f:{s:'bruce',t:'Tony gave you a stamp. Kelsier gave you a coin. Mine is, uh, less flashy. Sorry in advance.',next:'g'},
  g:{s:'narrator',t:'He slides a fresh notebook across. On the first page, in his small careful hand: “Breathe first. Note after. Keep the bad pages.”',next:'h'},
  h:{s:'bruce',t:'Fill it up, {name}. Your family deserves the guy who walks in the door level. Honestly, so do you.',end:true,do:[{quest:['steady-hands','complete']}]}}},

 // ---------------- Your Friendly Neighbor (Peter, Home, tier 1) ----------------
 'friendly-neighbor-1':{who:'peter',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Peter is halfway up a ladder outside the Workshop, fixing someone else’s shutter. His own front gate hangs off one hinge.',next:'b'},
  b:{s:'peter',t:'Oh! Hey! Hi. Sorry, hands full. Mrs. Abernathy’s shutter. Then Tom’s fence. Then the baker’s chimney. It’s been a whole week.',next:'c'},
  c:{s:'player',t:'Peter. Your gate is falling off.',next:'d'},
  d:{s:'peter',t:'Yeah. Yep. Totally aware. I’ll get to it. I say that a lot. May says I’m the whole neighborhood’s handyman except my own.',opts:[
   {t:'I know the feeling.',next:'same'},
   {t:'Your aunt sounds smart.',next:'aunt'},
   {t:'Want help with the gate?',next:'help'}]},
  same:{s:'peter',t:'Right? Big stuff feels heroic. Taking out the trash feels like nothing. Then it’s Thursday and the kitchen smells like a crime scene.',next:'offer'},
  aunt:{s:'peter',t:'She’s the smartest person I know. Don’t tell Mr. Stark. She says little chores are how you love the people you live with.',next:'offer'},
  help:{s:'peter',t:'Aw, that’s really nice. But, okay, better idea. We each fix our own stuff first. Race you. Winner gets bragging rights.',next:'offer'},
  offer:{s:'peter',t:'Three chores at your place. Real ones. Dishes, that dripping tap, the drawer you keep hip-checking shut. I do my gate.',opts:[
   {t:'Deal. (Start “Your Friendly Neighbor”)',next:'yes',do:[{quest:['friendly-neighbor','start']}]},
   {t:'Maybe later, Peter.',next:'no'}]},
  yes:{s:'peter',t:'Awesome! Okay. Gate. Me. Now. Before somebody’s cat gets stuck in a tree again. It’s always the same cat.',end:true},
  no:{s:'peter',t:'No worries! I’ll be around. Probably up a ladder. Or a wall. You know where to find me.',end:true}}},

 'friendly-neighbor-2':{who:'peter',bg:'facility-scenes/habits.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Peter’s gate swings shut with a crisp click. He opens it and shuts it again, just to hear it.',next:'b'},
  b:{s:'peter',t:'Hear that? Click. Ten minutes. It took ten minutes, and I walked past it for three months. Three months!',next:'c'},
  c:{s:'peter',t:'Okay, your turn. Did anybody at your place notice your three?',opts:[
   {t:'My wife noticed. She smiled.',next:'wife',do:[{flag:'peter-home-noticed'}]},
   {t:'Nobody noticed at all.',next:'nobody'},
   {t:'I noticed. That was enough.',next:'me'}]},
  wife:{s:'peter',t:'Okay, that’s the best version. It’s not really about the dishes. It’s about her not having to do them tonight.',next:'d'},
  nobody:{s:'peter',t:'Ha. Yeah. Welcome to the job. Nobody throws a parade for a clean sink. Trust me, I’d know. You do it anyway.',next:'d'},
  me:{s:'peter',t:'That counts! When the house is less messy, my head’s less messy. Ned says that’s not science. It’s totally science.',next:'d'},
  d:{s:'peter',t:'Okay, level two. Three different days. Something for the house each day. Even small. Especially small.',next:'e'},
  e:{s:'peter',t:'One giant cleaning day is a rescue mission. Three little days and nobody ever needs rescuing.',opts:[
   {t:'Three days. You’re on.',next:'f',do:[{quest:['friendly-neighbor','advance']}]}]},
  f:{s:'peter',t:'Yes! Okay, I gotta go, Mrs. Abernathy’s shutter fell off again. Kidding. Mostly kidding. I should check.',next:'g'},
  g:{s:'narrator',t:'He’s off toward the rooftops, then doubles back to latch his gate properly. Thumbs up. Then he’s gone.',end:true,do:[{xp:['home',300]}]}}},

 'friendly-neighbor-3':{who:'peter',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At dusk you find Peter on the Workshop roof with a sandwich, watching the village lamps flick on one at a time.',next:'b'},
  b:{s:'peter',t:'Hey! Come up! Watch that shingle, it’s loose. I’m fixing it tomorrow. Actually tomorrow. I wrote it on my hand.',next:'c'},
  c:{s:'peter',t:'Three days. You did it. So did I, which, wow. My place hasn’t looked this good since May visited and inspected the fridge.',next:'d'},
  d:{s:'peter',t:'Can I tell you something kind of dumb? I used to think the big stuff was what mattered. Then I think about who actually raised me.',opts:[
   {t:'Your aunt?',next:'aunt'},
   {t:'The small stuff adds up.',next:'small'}]},
  aunt:{s:'peter',t:'Yeah. May never fought anybody on a bridge. She packed my lunch and patched my jeans every single day. That’s the real superpower.',next:'e'},
  small:{s:'peter',t:'It really does. Like, a thousand tiny fixes and suddenly it’s a whole house. Maybe a whole life. Okay, that got deep. Sandwich?',next:'e'},
  e:{s:'narrator',t:'He digs in his pocket and pulls out a spare key on a ring of tough, silvery thread that feels faintly sticky.',next:'f'},
  f:{s:'peter',t:'I made the ring. Please don’t ask how. It’s for your house key. Every time you grab it: home first, then everybody else.',next:'g'},
  g:{s:'peter',t:'You’re a good neighbor, {name}. Now go home. Somebody there wants to see you, and it’s not me.',end:true,do:[{quest:['friendly-neighbor','complete']}]}}},

 // ---------------- The Painted Porch (Piotr, Home, tier 2) ----------------
 'the-painted-porch-1':{who:'piotr',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Piotr kneels on the Workshop porch, painting one board at a time. The brush looks like a toothpick in his enormous hand.',next:'b'},
  b:{s:'piotr',t:'Ah. Hello, my friend. Careful, wet paint. This board I paint three times. Now it is right.',next:'c'},
  c:{s:'piotr',t:'Yesterday I walk past your house. Is a good house. But tired. I think maybe you are also tired, da?',opts:[
   {t:'Is it that obvious?',next:'obvious'},
   {t:'Peter already got me started.',next:'peter'},
   {t:'It’s fine. Houses get messy.',next:'messy'}]},
  obvious:{s:'piotr',t:'Only to someone who looks. On our farm, my father said you can read a man by his fence. Both need care.',next:'offer'},
  peter:{s:'piotr',t:'Peter is good boy. He fixes small things for everybody. Now we go one step more. We keep them fixed.',next:'offer'},
  messy:{s:'piotr',t:'Da, messy is life. Illyana leaves boots everywhere. But messy and neglected are different. One is lived in. One is given up.',next:'offer'},
  offer:{s:'piotr',t:'Here. Take brush. Not for my porch. For your house. Five jobs, real ones. The gutter. The closet. The paint that peels.',next:'offer2'},
  offer2:{s:'piotr',t:'Slowly. Carefully. Like this board. Then you come back and tell me.',opts:[
   {t:'Five jobs. I’ll do them right. (Start “The Painted Porch”)',next:'yes',do:[{quest:['the-painted-porch','start']}]},
   {t:'Not this week, big man.',next:'no'}]},
  yes:{s:'piotr',t:'Good. Do not rush. Job done slow, you do once. Job done fast, you do twice. Logan never learns this.',end:true},
  no:{s:'piotr',t:'Is okay. Brush will wait. I will be here, painting. There are many boards.',end:true}}},

 'the-painted-porch-2':{who:'piotr',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Workshop smells of beets and dill. Piotr stirs a huge pot, an apron straining across shoulders as wide as a doorframe.',next:'b'},
  b:{s:'piotr',t:'Five jobs! Sit. Eat. My mother’s borscht. In my house, good work gets good food. This is the rule.',next:'c'},
  c:{s:'piotr',t:'So. Tell me. Which job you like most?',opts:[
   {t:'Fixing something that had been broken for ages.',next:'broken'},
   {t:'Clearing out a cluttered room.',next:'clutter',do:[{flag:'piotr-cleared-room'}]},
   {t:'Honestly? None of them. But I did them.',next:'none'}]},
  broken:{s:'piotr',t:'Yes! The thing you walk past every day and sigh. You fix it, the sigh goes away. Whole house breathes better.',next:'d'},
  clutter:{s:'piotr',t:'Ah. Empty space is gift. For family, for you. Room to sit. Room to think. Room to dance, maybe, if you are brave.',next:'d'},
  none:{s:'piotr',t:'Ha! Honest man! Is fine. Love is not always feeling. Sometimes love is a mop.',next:'d'},
  d:{s:'piotr',t:'On our farm, Sunday was day for the house. Everybody helps, even little Illyana. Then we eat together. Work, then table.',next:'e'},
  e:{s:'piotr',t:'Now you make rhythm. Something for house on four different days. Not one big storm. Small, steady rain.',opts:[
   {t:'Four days. Steady rain.',next:'f',do:[{quest:['the-painted-porch','advance']}]}]},
  f:{s:'piotr',t:'Good. And when you finish, you come Sunday. I make more borscht. I always make too much borscht. Kitty says this is how I say I love you.',next:'g'},
  g:{s:'narrator',t:'He fills your bowl a second time without asking. You don’t argue.',end:true,do:[{gold:200}]}}},

 'the-painted-porch-3':{who:'piotr',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Sunday afternoon. The Workshop porch gleams with fresh paint. Piotr has set out a small table: two bowls and a dish under a cloth.',next:'b'},
  b:{s:'piotr',t:'Four days. Again this week I walk past your house. It looks different. Not new. Loved.',next:'c'},
  c:{s:'piotr',t:'When I am boy in Siberia, our farm was small and poor. But my father kept every fence straight. He said straight fence is a promise.',next:'d'},
  d:{s:'piotr',t:'Promise that somebody is watching. That somebody minds the little things, so the family does not have to.',opts:[
   {t:'I want my kids to remember a home like that.',next:'kids'},
   {t:'Do you miss that farm?',next:'miss'}]},
  kids:{s:'piotr',t:'They will. Children do not remember big days so much. They remember how house feels. Warm. Safe. Somebody cares.',next:'e'},
  miss:{s:'piotr',t:'Every day. But I carry it. Every porch I paint, little piece of home. This is how you do not lose it.',next:'e'},
  e:{s:'narrator',t:'He lifts the cloth. Underneath is a small hand-painted tile: your own house, with a straight fence and one lit window.',next:'f'},
  f:{s:'piotr',t:'I paint it slowly. Like porch. Hang it by your door, {name}. When you come home tired, it reminds you what you are keeping.',next:'g'},
  g:{s:'piotr',t:'And every Sunday, something for the house. Then you eat with your family. Work, then table. You promise me, da?',end:true,do:[{quest:['the-painted-porch','complete']}]}}},
};
