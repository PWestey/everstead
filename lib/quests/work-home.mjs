// Quests for Work (Tony, Kelsier, Bruce) and Home (Peter, Piotr). Steps and rewards are built by the engine from `tier`.

/** @type {Record<string,any>} */
export const QUESTS={
 'shipped':{name:'Shipped',area:'work',giver:'tony',tier:1,
  blurb:'Tony’s Market stall is buried in brilliant, half-built inventions. He wants to know if you can actually finish something.',
  say:['Talk to Tony at the Market.','Report back to Tony.','Meet Tony at his stall after the Market closes.']},
 'the-long-con':{name:'The Long Con',area:'work',giver:'kelsier',tier:2,
  blurb:'Kelsier has been watching you work the Market. He says he is putting together a crew, and every crew needs a plan.',
  say:['Talk to Kelsier at the Market.','Report back to Kelsier.','Meet Kelsier on the rooftops above the Market when the mist rolls in.']},
 'steady-hands':{name:'Steady Hands',area:'work',giver:'bruce',tier:3,
  blurb:'Bruce noticed you snapping at a supplier in the Market. He knows that look, and he wants to help before it costs you.',
  say:['Talk to Bruce at the Market.','Report back to Bruce.','Meet Bruce in the quiet back room of the Museum.']},
 'friendly-neighbor':{name:'Your Friendly Neighbor',area:'home',giver:'peter',tier:1,
  blurb:'Peter fixed half the village’s fences this week and forgot his own. He thinks you might have the same problem.',
  say:['Talk to Peter at the Workshop.','Report back to Peter.','Meet Peter on the Workshop roof at dusk.']},
 'the-painted-porch':{name:'The Painted Porch',area:'home',giver:'piotr',tier:2,
  blurb:'Piotr is repainting the Workshop porch one careful board at a time. He has a spare brush, and an opinion about your house.',
  say:['Talk to Piotr at the Workshop.','Report back to Piotr.','Join Piotr for Sunday borscht on the Workshop porch.']},
};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- Shipped (Tony, Work, tier 1) ----------------
 'shipped-1':{who:'tony',bg:'facility-scenes/expo.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Tony’s stall at the Market is a glittering mess: brass gauntlets, a singing kettle, three clocks with no hands. Every one of them is half done.',next:'b'},
  b:{s:'tony',t:'Don’t touch the kettle. It has opinions. Also, you’re the guy with the habit board, right? Love a dashboard.',next:'c'},
  c:{s:'tony',t:'Here’s my problem. I start nine brilliant things a week and finish none of them. Genius is cheap. Done is expensive.',opts:[
   {t:'Sounds like my work week.',next:'same'},
   {t:'So finish one.',next:'finish'},
   {t:'Maybe you need fewer ideas.',next:'fewer'}]},
  same:{s:'tony',t:'Ha. Misery loves a co-founder. Okay, so we both have a shipping problem.',next:'offer'},
  finish:{s:'tony',t:'Wow. Blunt. I respect it. I hate it, but I respect it.',next:'offer'},
  fewer:{s:'tony',t:'Fewer ideas? Wash your mouth out. No. Fewer open tabs. Same thing, sounds better.',next:'offer'},
  offer:{s:'tony',t:'Deal. You finish three real pieces of work. Not started. Finished. A task closed, a report sent, a bill paid.',next:'offer2'},
  offer2:{s:'tony',t:'I’ll finish one of these gadgets in the meantime. First one back buys coffee.',opts:[
   {t:'You’re on. (Start “Shipped”)',next:'yes',do:[{quest:['shipped','start']}]},
   {t:'Not right now, Tony.',next:'no'}]},
  yes:{s:'tony',t:'Great. Go. I’m already losing, and I hate losing.',end:true},
  no:{s:'tony',t:'Fine. The kettle and I will be here, not finishing things. Come back when you’re ready to win.',end:true}}},

 'shipped-2':{who:'tony',bg:'facility-scenes/businesses.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Tony is hunched over the bench. The singing kettle is in pieces. He looks up with grease on his nose.',next:'b'},
  b:{s:'tony',t:'Three finished? Already? Okay, coffee’s on me. Don’t make it weird.',next:'c'},
  c:{s:'tony',t:'Real question. When you closed them out, how did it feel?',opts:[
   {t:'Lighter. Like I put something down.',next:'light',do:[{flag:'tony-lighter'}]},
   {t:'Honestly, a little boring.',next:'boring'},
   {t:'I kept wanting to start something new.',next:'itch'}]},
  light:{s:'tony',t:'That’s it. Unfinished work is a weight you carry in your head. Shipping is how you put it down.',next:'d'},
  boring:{s:'tony',t:'Yeah. The last ten percent is always boring. That’s why it’s worth so much. Nobody else does it.',next:'d'},
  itch:{s:'tony',t:'Oh, I know that itch. I built a whole suit to avoid writing one email once. Doesn’t work. The email’s still there.',next:'d'},
  d:{s:'tony',t:'Now the hard part. Anyone can sprint for an afternoon. I want you doing real work on three different days.',next:'e'},
  e:{s:'tony',t:'Not three things in one burst. Three days. That’s the difference between a demo and a product.',opts:[
   {t:'Three days. I’ll ship every one.',next:'f',do:[{quest:['shipped','advance']}]}]},
  f:{s:'tony',t:'And I’ll finish this kettle. Probably. Shut up.',next:'g'},
  g:{s:'narrator',t:'He hands you a coffee and turns back to the bench. For once, he picks up the same project he put down.',end:true,do:[{xp:['work',400]}]}}},

 'shipped-3':{who:'tony',bg:'ui-scenes/Bg_City_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'The Market has closed for the night. Tony’s stall is lit by one warm lamp, and the bench is almost clear.',next:'b'},
  b:{s:'tony',t:'Three days. You showed up and you finished. You know how rare that is? I hire geniuses. I need finishers.',next:'c'},
  c:{s:'narrator',t:'On the bench sits the kettle, whole for the first time. Tony looks at it like it might bite him.',next:'d'},
  d:{s:'tony',t:'I finished it. Took me four years and one stubborn customer. It sings in tune now. Mostly.',opts:[
   {t:'Proud of you, Tony.',next:'proud'},
   {t:'Does it actually make coffee?',next:'coffee'}]},
  proud:{s:'tony',t:'Okay, don’t. I’ll get something in my eye and blame the solder fumes.',next:'e'},
  coffee:{s:'tony',t:'It makes tea. Badly. Finishing it isn’t the same as making it perfect. Write that down.',next:'e'},
  e:{s:'tony',t:'So here. I made you something. Small. Finished.',next:'f'},
  f:{s:'narrator',t:'He presses a brass stamp into your hand. The face of it reads SHIPPED in neat block letters.',next:'g'},
  g:{s:'tony',t:'Every time you close something out, you get to use it. Start is cheap, {name}. Done is the whole game.',end:true,do:[{quest:['shipped','complete']}]}}},

 // ---------------- The Long Con (Kelsier, Work, tier 2) ----------------
 'the-long-con-1':{who:'kelsier',bg:'facility-scenes/trading.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A man in a mistcloak leans against a spice stall, flipping a coin across his knuckles. He has been watching you for a while.',next:'b'},
  b:{s:'kelsier',t:'Relax. If I wanted your purse, it would already be gone. I’m Kelsier. I put together crews.',next:'c'},
  c:{s:'kelsier',t:'I’ve watched you work this Market. You’re good. But you work like a man who thinks he has to do it alone.',opts:[
   {t:'I usually do have to.',next:'alone'},
   {t:'What’s the job?',next:'job'},
   {t:'Why are you smiling like that?',next:'smile'}]},
  alone:{s:'kelsier',t:'That’s the lie that breaks good men. Nobody pulls off anything big alone. Not me. Not you.',next:'offer'},
  job:{s:'kelsier',t:'Straight to business. I like you already. The job is your own work. We steal back the hours you keep losing.',next:'offer'},
  smile:{s:'kelsier',t:'Because I’ve survived worse than a hard week. Smiling is a choice. It’s also excellent for morale.',next:'offer'},
  offer:{s:'kelsier',t:'Every good heist starts with a plan. Write tomorrow’s work down tonight. Then do five real pieces of it.',next:'offer2'},
  offer2:{s:'kelsier',t:'Five. Planned, then done. Show me you can run a job before I trust you with a bigger one.',opts:[
   {t:'Count me in. (Start “The Long Con”)',next:'yes',do:[{quest:['the-long-con','start']}]},
   {t:'I’ll think about it.',next:'no'}]},
  yes:{s:'kelsier',t:'Excellent. Welcome to the crew. Try not to look so honest, it unsettles the merchants.',end:true},
  no:{s:'kelsier',t:'Think fast, then. A crew waits for no one. Well. It waits for you. Once.',end:true}}},

 'the-long-con-2':{who:'kelsier',bg:'facility-scenes/northern.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Kelsier meets you at the edge of the Market at dusk, two cups of something hot in his hands and a folded map under his arm.',next:'b'},
  b:{s:'kelsier',t:'Five jobs, planned and pulled. Tony says you finish things now. I told him I knew that already.',next:'c'},
  c:{s:'kelsier',t:'So tell me. What happened to the plan when the day actually started?',opts:[
   {t:'It fell apart by lunch.',next:'apart',do:[{flag:'kelsier-plan-broke'}]},
   {t:'It held. Mostly.',next:'held'},
   {t:'I didn’t really plan. I just worked.',next:'noplan'}]},
  apart:{s:'kelsier',t:'Good. Every plan does. The point isn’t a perfect plan. It’s knowing what matters when the floor drops out.',next:'d'},
  held:{s:'kelsier',t:'Mostly is a fine word in my trade. Mostly is how we stay alive. Next time, mostly gets better.',next:'d'},
  noplan:{s:'kelsier',t:'And you still got it done. Talented. Dangerous, too. Talent without a plan burns out fast. Trust me.',next:'d'},
  d:{s:'kelsier',t:'Now the long con. A heist isn’t one night. It’s months of small moves nobody notices.',next:'e'},
  e:{s:'kelsier',t:'I want you working on four different days. Plan each one the night before. That’s how empires fall, and careers rise.',opts:[
   {t:'Four days. Planned. I’m in.',next:'f',do:[{quest:['the-long-con','advance']}]}]},
  f:{s:'kelsier',t:'There it is. That look. That’s a man who’s about to surprise a lot of people.',next:'g'},
  g:{s:'narrator',t:'He unfolds the map. It isn’t a map of a vault. It is your week, drawn in his neat hand, with four days circled.',end:true,do:[{xp:['work',500]}]}}},

 'the-long-con-3':{who:'kelsier',bg:'facility-scenes/roaming.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Mist curls over the Market rooftops. Kelsier sits on a chimney, legs dangling, watching the lamps go out below.',next:'b'},
  b:{s:'kelsier',t:'Four days. Planned and pulled, every one. Do you know how many crews I’ve seen fall apart by day two?',next:'c'},
  c:{s:'kelsier',t:'I lost a lot, once. Everything, really. What got me back up wasn’t rage. It was a plan, and people to run it with.',next:'d'},
  d:{s:'kelsier',t:'So. Who’s your crew, {name}? Who do you work for, when the work gets ugly?',opts:[
   {t:'My family. Always.',next:'family'},
   {t:'The people on my team.',next:'team'},
   {t:'Honestly, I’m not sure anymore.',next:'unsure'}]},
  family:{s:'kelsier',t:'Then that’s the real job. Every paycheck is a heist pulled off for them. Never let the work forget who it’s for.',next:'e'},
  team:{s:'kelsier',t:'Good answer. A leader who remembers his crew is worth ten who remember their titles.',next:'e'},
  unsure:{s:'kelsier',t:'That’s honest. Find out. A man who knows why he works can survive almost anything.',next:'e'},
  e:{s:'narrator',t:'He flips his coin one last time and catches it. Then he holds it out to you.',next:'f'},
  f:{s:'kelsier',t:'Carry it. Each night, flip it and name tomorrow’s one big job. Heads or tails, you still do the job. That’s the joke.',next:'g'},
  g:{s:'kelsier',t:'Welcome to the crew. Permanently. Now smile. We just pulled off something nobody thought we could.',end:true,do:[{quest:['the-long-con','complete']}]}}},

 // ---------------- Steady Hands (Bruce, Work, tier 3) ----------------
 'steady-hands-1':{who:'bruce',bg:'facility-scenes/apothecary.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Bruce is sorting glass vials behind the apothecary stall. He doesn’t look up, but he speaks the moment you arrive.',next:'b'},
  b:{s:'bruce',t:'I saw you with the grain supplier this morning. Jaw tight, voice low. I know that voice. I used to have it too.',next:'c'},
  c:{s:'bruce',t:'I’m not judging. I’m asking. How long has work been making you that angry?',opts:[
   {t:'Longer than I’d like to admit.',next:'long',do:[{flag:'bruce-honest'}]},
   {t:'I’m fine. It was one bad morning.',next:'fine'},
   {t:'He deserved it.',next:'deserved'}]},
  long:{s:'bruce',t:'Thank you for saying it. That’s the hardest part, and you just did it.',next:'d'},
  fine:{s:'bruce',t:'Maybe. I said “I’m fine” for about ten years. Ask the lab I broke how fine I was.',next:'d'},
  deserved:{s:'bruce',t:'Maybe he did. But anger doesn’t only land on him. It comes home with you. Trust me on that one.',next:'d'},
  d:{s:'bruce',t:'Tony taught you to finish. Kelsier taught you to plan. I want to teach you something less exciting. How to stay steady.',next:'e'},
  e:{s:'bruce',t:'Here’s the experiment. Eight pieces of real work. Before each one, one slow breath. After each one, one line in a notebook.',next:'f'},
  f:{s:'bruce',t:'What you did, and how you felt. That’s it. Data, not drama. Will you try it?',opts:[
   {t:'I’ll try it. (Start “Steady Hands”)',next:'yes',do:[{quest:['steady-hands','start']}]},
   {t:'Not this week, Bruce.',next:'no'}]},
  yes:{s:'bruce',t:'Good. Eight is enough to see a pattern. Bring me what you find.',end:true},
  no:{s:'bruce',t:'Okay. No pressure. That’s sort of the whole point. I’ll be here when you want to try.',end:true}}},

 'steady-hands-2':{who:'bruce',bg:'facility-scenes/school.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Bruce has turned an empty schoolroom into a quiet lab. A kettle hums. He pours two cups of tea before you sit down.',next:'b'},
  b:{s:'bruce',t:'Eight pieces of work, eight notes. Can I see them? Only if you want.',opts:[
   {t:'Hand him the notebook.',next:'show'},
   {t:'Just tell him what you found.',next:'tell'}]},
  show:{s:'narrator',t:'He reads slowly, nodding, tapping a line here and there. He doesn’t say a word until he reaches the end.',next:'c'},
  tell:{s:'bruce',t:'That works too. The notes were for you, not me. What pattern did you see?',next:'c'},
  c:{s:'bruce',t:'Most people find the same thing. The anger isn’t really about the work. It shows up when we’re tired, rushed or skipped lunch.',next:'d'},
  d:{s:'player',t:'So the fix isn’t trying harder. It’s noticing sooner.',next:'e'},
  e:{s:'bruce',t:'Exactly. You can’t out-muscle it. Believe me, I’ve tried. You just notice it early and you choose what to do with it.',next:'f'},
  f:{s:'bruce',t:'Next phase. Five different days of work, same rules. Breathe first, note after. Consistency is where the real results are.',opts:[
   {t:'Five days. Breath and notes.',next:'g',do:[{quest:['steady-hands','advance']}]}]},
  g:{s:'bruce',t:'Good. And if you have a bad day, write that down too. Bad data is still data.',next:'h'},
  h:{s:'narrator',t:'He refills your tea without asking. It is the calmest you have felt in a working week in a long time.',end:true,do:[{xp:['discipline',400]}]}}},

 'steady-hands-3':{who:'bruce',bg:'facility-scenes/museum.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Museum’s back room is dim and still. Bruce sits at a long table with a worn, cracked notebook in front of him.',next:'b'},
  b:{s:'bruce',t:'Five days. Steady. I watched you in the Market on Thursday. Somebody pushed you, and you just breathed.',next:'c'},
  c:{s:'bruce',t:'I want to show you something I don’t show many people.',next:'d'},
  d:{s:'narrator',t:'He opens the old notebook. Page after page of tiny handwriting: dates, tasks, moods. Some pages are torn. Some are scorched.',next:'e'},
  e:{s:'bruce',t:'Years of notes. Every day I stayed in control, and every day I didn’t. This book is the reason I can still do my work.',opts:[
   {t:'Why show me this?',next:'why'},
   {t:'The scorched pages. Those were bad days?',next:'scorched'}]},
  why:{s:'bruce',t:'Because you think steady people are born calm. They aren’t. They just keep notes and keep going.',next:'f'},
  scorched:{s:'bruce',t:'The worst ones. I kept them anyway. You don’t get to only keep the good pages.',next:'f'},
  f:{s:'bruce',t:'Tony gave you a stamp for finishing. Kelsier gave you a coin for planning. Mine’s less flashy.',next:'g'},
  g:{s:'narrator',t:'He slides a fresh notebook across the table. On the first page, in his small careful hand: “Breathe first. Note after. Keep the bad pages.”',next:'h'},
  h:{s:'bruce',t:'Fill it, {name}. The people waiting at home deserve the steady version of you. So do you.',end:true,do:[{quest:['steady-hands','complete']}]}}},

 // ---------------- Your Friendly Neighbor (Peter, Home, tier 1) ----------------
 'friendly-neighbor-1':{who:'peter',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Peter is halfway up a ladder outside the Workshop, fixing someone else’s shutter. His own front gate is hanging off one hinge.',next:'b'},
  b:{s:'peter',t:'Oh hey! Hi. Sorry, hands full. Mrs. Abernathy’s shutter. And Tom’s fence. And the baker’s chimney. It’s been a week.',next:'c'},
  c:{s:'player',t:'Peter. Your gate is falling off.',next:'d'},
  d:{s:'peter',t:'Yeah. Yep. I know. I’ll get to it. I always say that. My aunt says I’m everybody’s handyman except my own.',opts:[
   {t:'I know the feeling.',next:'same'},
   {t:'Your aunt sounds smart.',next:'aunt'},
   {t:'Want help with the gate?',next:'help'}]},
  same:{s:'peter',t:'Right? Big jobs feel heroic. Taking out the trash feels like nothing. Except then the trash piles up.',next:'offer'},
  aunt:{s:'peter',t:'She’s the smartest person I know. She says small chores are how you love the people you live with.',next:'offer'},
  help:{s:'peter',t:'That’s really nice. But I’ve got a better idea. Let’s both fix our own stuff first. Race you.',next:'offer'},
  offer:{s:'peter',t:'Three chores at your own place. Real ones. Dishes, the leaky tap, that drawer you keep kicking shut. I’ll fix my gate.',opts:[
   {t:'Deal. (Start “Your Friendly Neighbor”)',next:'yes',do:[{quest:['friendly-neighbor','start']}]},
   {t:'Maybe later, Peter.',next:'no'}]},
  yes:{s:'peter',t:'Awesome! Okay. Gate. Me. Now. Before somebody else’s cat gets stuck in a tree.',end:true},
  no:{s:'peter',t:'No worries. I’ll be here. Probably up a ladder. You know where to find me.',end:true}}},

 'friendly-neighbor-2':{who:'peter',bg:'facility-scenes/habits.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Peter’s gate swings shut with a satisfying click. He opens it and closes it again, just to hear it.',next:'b'},
  b:{s:'peter',t:'Listen to that. Click. I fixed it in ten minutes. I put it off for three months. Ten minutes!',next:'c'},
  c:{s:'peter',t:'How about you? Did anybody at home notice your three?',opts:[
   {t:'My wife noticed. She smiled.',next:'wife',do:[{flag:'peter-home-noticed'}]},
   {t:'Nobody noticed at all.',next:'nobody'},
   {t:'I noticed. That was enough.',next:'me'}]},
  wife:{s:'peter',t:'See? That’s the secret. It’s not about the dishes. It’s about the person who doesn’t have to do them now.',next:'d'},
  nobody:{s:'peter',t:'Ha. Yeah, that’s the job. Nobody throws a parade for a clean sink. You do it anyway. That’s the responsibility part.',next:'d'},
  me:{s:'peter',t:'That’s a good sign. When the house feels lighter, your head does too. At least mine does.',next:'d'},
  d:{s:'peter',t:'Okay, next level. Three different days. Something for the house each day, even small. Especially small.',next:'e'},
  e:{s:'peter',t:'One big cleaning day is a rescue. Three small days is how you never need rescuing.',opts:[
   {t:'Three days. You’re on.',next:'f',do:[{quest:['friendly-neighbor','advance']}]}]},
  f:{s:'peter',t:'Yes! Okay, I gotta go. Mrs. Abernathy’s shutter fell off again. Kidding. Mostly kidding.',next:'g'},
  g:{s:'narrator',t:'He swings off toward the rooftops, then doubles back to latch his gate properly. He gives you a thumbs up.',end:true,do:[{xp:['home',300]}]}}},

 'friendly-neighbor-3':{who:'peter',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At dusk you find Peter sitting on the Workshop roof, eating a sandwich and watching the village lamps come on.',next:'b'},
  b:{s:'peter',t:'Hey! Come up. Watch the loose shingle. I’m fixing it tomorrow. For real this time.',next:'c'},
  c:{s:'peter',t:'Three days. You did it. So did I, actually. My place hasn’t looked this good since my aunt last visited.',next:'d'},
  d:{s:'peter',t:'Can I tell you something? Sometimes I think the big stuff is the important stuff. Then I remember who actually raised me.',opts:[
   {t:'Your aunt?',next:'aunt'},
   {t:'The small stuff adds up.',next:'small'}]},
  aunt:{s:'peter',t:'Yeah. She never saved the city. She just fixed my lunch and patched my jeans every single day. That was the real superpower.',next:'e'},
  small:{s:'peter',t:'It really does. A thousand little fixes is a whole house. A whole life, maybe.',next:'e'},
  e:{s:'narrator',t:'He digs into his pocket and pulls out a spare key on a ring of tough, silvery thread.',next:'f'},
  f:{s:'peter',t:'I made the ring. Don’t ask how. It’s for your house key. Every time you grab it, remember: home first, then the world.',next:'g'},
  g:{s:'peter',t:'You’re a good neighbor, {name}. Now go home. Somebody there would love to see you.',end:true,do:[{quest:['friendly-neighbor','complete']}]}}},

 // ---------------- The Painted Porch (Piotr, Home, tier 2) ----------------
 'the-painted-porch-1':{who:'piotr',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Piotr kneels on the Workshop porch, painting one board at a time with a brush that looks tiny in his huge hand.',next:'b'},
  b:{s:'piotr',t:'Ah. Hello, friend. Careful. Wet paint. I did that board three times. It is finally right.',next:'c'},
  c:{s:'piotr',t:'I walked past your house yesterday. It is a good house. But it is tired. I think you are tired too, da?',opts:[
   {t:'Is it that obvious?',next:'obvious'},
   {t:'Peter already got me started.',next:'peter'},
   {t:'It’s fine. Houses get messy.',next:'messy'}]},
  obvious:{s:'piotr',t:'Only to someone who looks. A house and a man, they wear the same face. Both need care.',next:'offer'},
  peter:{s:'piotr',t:'Peter is a good boy. He fixes the little things. Now we go one step further. We keep them fixed.',next:'offer'},
  messy:{s:'piotr',t:'Yes. Messy is life. But messy and neglected are different. One is lived in. The other is given up on.',next:'offer'},
  offer:{s:'piotr',t:'Here. Take a brush. Not for my porch. For your house. Five jobs. Real ones. The gutter. The closet. The paint that peels.',next:'offer2'},
  offer2:{s:'piotr',t:'Slowly, carefully, like this board. Then come back and tell me about them.',opts:[
   {t:'Five jobs. I’ll do them right. (Start “The Painted Porch”)',next:'yes',do:[{quest:['the-painted-porch','start']}]},
   {t:'Not this week, big man.',next:'no'}]},
  yes:{s:'piotr',t:'Good. Do not rush. A job done slowly is done once. A job done fast is done twice.',end:true},
  no:{s:'piotr',t:'That is okay. The brush will wait. I will be here, painting. There are many boards.',end:true}}},

 'the-painted-porch-2':{who:'piotr',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Workshop smells of beets and dill. Piotr is stirring a huge pot, an apron straining across his shoulders.',next:'b'},
  b:{s:'piotr',t:'Five jobs! Sit. Eat. My mother’s borscht. You do good work, you eat good food. This is the rule.',next:'c'},
  c:{s:'piotr',t:'Tell me. Which job did you like most?',opts:[
   {t:'Fixing something that had been broken for ages.',next:'broken'},
   {t:'Clearing out a cluttered room.',next:'clutter',do:[{flag:'piotr-cleared-room'}]},
   {t:'Honestly? None of them. But I did them.',next:'none'}]},
  broken:{s:'piotr',t:'Yes! The thing you walk past every day and sigh. When it is fixed, the sigh goes away. The house breathes.',next:'d'},
  clutter:{s:'piotr',t:'Ah. Empty space is a gift. To your family, to yourself. Room to sit. Room to think. Room to dance, maybe.',next:'d'},
  none:{s:'piotr',t:'Ha! Honest man. That is fine. Love is not always a feeling. Sometimes it is a mop.',next:'d'},
  d:{s:'piotr',t:'In my family, Sunday was the day for the house. Everybody helped. Then we ate together. Work, then table.',next:'e'},
  e:{s:'piotr',t:'Now you build a rhythm. Something for your house on four different days. Not one big storm. Small, steady rain.',opts:[
   {t:'Four days. Steady rain.',next:'f',do:[{quest:['the-painted-porch','advance']}]}]},
  f:{s:'piotr',t:'Good. And when you finish, you come for Sunday. I will make more borscht. I always make more borscht.',next:'g'},
  g:{s:'narrator',t:'He fills your bowl a second time without asking. You do not argue.',end:true,do:[{gold:200}]}}},

 'the-painted-porch-3':{who:'piotr',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Sunday afternoon. The Workshop porch gleams with fresh paint. Piotr has set a small table on it with two bowls and a covered dish.',next:'b'},
  b:{s:'piotr',t:'Four days. I walked past your house again this week. It looks different. Not new. Loved.',next:'c'},
  c:{s:'piotr',t:'When I was a boy, our farm was small and poor. But my father kept every fence straight. He said a straight fence is a promise.',next:'d'},
  d:{s:'piotr',t:'A promise to your family that someone is watching over them. That someone cares about the small things.',opts:[
   {t:'I want my kids to remember a home like that.',next:'kids'},
   {t:'Do you miss that farm?',next:'miss'}]},
  kids:{s:'piotr',t:'They will. Children do not remember the big days. They remember the feel of the house. Warm. Safe. Cared for.',next:'e'},
  miss:{s:'piotr',t:'Every day. But I carry it. Every porch I paint is a little piece of home. That is how you never lose it.',next:'e'},
  e:{s:'narrator',t:'He lifts the cloth from the dish. Underneath is a small square tile, hand painted: your own house, with a straight fence and a lit window.',next:'f'},
  f:{s:'piotr',t:'I painted it slowly. Like the porch. Hang it by your door, {name}. When you come home tired, it reminds you what you are keeping.',next:'g'},
  g:{s:'piotr',t:'And every Sunday, you do something for the house. Then you eat with your family. Work, then table. Promise me.',end:true,do:[{quest:['the-painted-porch','complete']}]}}},
};
