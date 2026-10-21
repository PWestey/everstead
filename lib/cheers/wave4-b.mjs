// Cheers (task-completion pop-ups), fourth wave part B. See docs/WRITING-BRIEF.md, "Cheers".
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Fatherhood ----------------
 moira:{
  cheers:[
   {open:['You got down on the floor and played. Properly. Not with one eye on your phone.','Dagran would’ve crowned you for that.'],opts:[
    {t:'Tomorrow too.',r:['Aye, you will. And I’ll be on the stairs pretending not to watch.']},
    {t:'My knees disagree.',r:['Your knees will live. Dwarves kneel at forges all day and we’re fine. Mostly.']}]},
   {open:['* Moira leans in the Inn doorway, arms folded, smiling.','Bedtime, on time, story and all. Do you know how many kings can manage that? None. I’ve met them.'],opts:[
    {t:'Same time tomorrow.',r:['Good. I’ll have the tea ready after. You’ll need it.']},
    {t:'They made me do the voices.',r:['Of course they did. I heard the troll one. It was terrible. I loved it.']}]},
   {open:['You listened to the whole long story about the bug in the garden. Every word. That’s love, that is.'],opts:[
    {t:'I’ll keep listening.',r:['That’s the job. Half of it, anyway. The other half is snacks.']},
    {t:'It was a very long bug.',r:['* She laughs, low and warm.','They always are. Dagran once told me about a rock for an hour.']}]},
   {open:['You lost your temper, then went back and made it right. My da took forty years to learn that. You did it before supper.'],opts:[
    {t:'I’ll own it every time.',r:['Then they’ll grow up knowing how. That’s worth more than any crown.']},
    {t:'Don’t tell Magni I’m faster.',r:['Oh, I’m telling him. Over ale. Loudly.']}]}],
  codex:'You wrote this down when your head was clear. Read it, then go kiss their foreheads.',
  ack:'Good. That’s the father I keep finding excuses to see.',
  done:{open:['Every task done. Kids fed, house standing, you still upright. Sit by the fire with me before you fall over.'],opts:[
   {t:'Same again tomorrow.',r:['Aye. You and me, stubborn as Dark Iron. I like that.']},
   {t:'Just the fire and you.',r:['* She pats the bench beside her.','Then sit closer. The fire’s small tonight.']}]}},

 // ---------------- Fitness ----------------
 quinn:{
  cheers:[
   {open:['* Valor screeches from the fence.','He says that was a good run. I say it was a great one. You kept your pace on the hill.'],opts:[
    {t:'Next run’s faster.',r:['Then I’ll have to stop holding back. Fair warning.']},
    {t:'Tell Valor thanks.',r:['He heard. He’s pretending he didn’t. Classic bird.']}]},
   {open:['You stretched afterward without me nagging. I nearly fell off the fence.'],opts:[
    {t:'Every time now.',r:['Good. Your hamstrings just sent me a thank-you note.']},
    {t:'You nag nicely.',r:['I know. I’ve had practice. Mostly on Valor.']}]},
   {open:['You walked instead of driving. Short trip, I know. Rangers count every mile.'],opts:[
    {t:'Count me in.',r:['Already did. You’re on the patrol roster for good now.']},
    {t:'It was a very short mile.',r:['Still a mile. Valor flew it with you. He won, obviously.']}]},
   {open:['You worked out tired. Those are the ones that matter. Anyone runs on a good day.'],opts:[
    {t:'I’ll do it tired again.',r:['That’s a ranger talking. Come here, you’re dripping. I don’t care.']},
    {t:'I want a nap now.',r:['Earned. Lie in the grass. I’ll keep watch.']}]}],
  codex:'You wrote this on a good day. Read it like a trail marker.',
  ack:'Then we head out at dawn. I’ll wait at the gate.',
  done:{open:['Every task done. I’ve seen scouts do less on a full patrol. Walk the fields with me before dark?'],opts:[
   {t:'Tomorrow too.',r:['Good. Same path, same time. I’ll be there first.']},
   {t:'Slowly this time.',r:['* She takes your hand.','Slowly. I can do slow. With you.']}]}},

 samira:{
  cheers:[
   {open:['Workout done and you didn’t even complain. That’s style.'],opts:[
    {t:'Next set’s mine.',r:['Ooh, cocky. I like it. Show me tomorrow.']},
    {t:'I complained inside.',r:['Inside doesn’t count. Outside, you looked great.']}]},
   {open:['* Samira spins a pistol and holsters it.','You hit a new weight today. I saw your face. That little smirk? Very good look.'],opts:[
    {t:'Heavier next week.',r:['That’s what I want to hear. Keep chasing it.']},
    {t:'You were staring.',r:['Of course I was. It was the best thing happening in the Yard.']}]},
   {open:['You said no to the second helping. Dull. Smart. Kind of hot.'],opts:[
    {t:'Again tomorrow.',r:['Good. Discipline looks better on you than dessert.']},
    {t:'I wanted it so bad.',r:['I know. Wanting it and walking away? That’s the real thrill.']}]},
   {open:['Eight hours of sleep. Look at you, all rested. Your reflexes will thank you.'],opts:[
    {t:'Early night again.',r:['Perfect. A rested partner is a fast partner.']},
    {t:'Sleep is boring.',r:['Sleep is how I land a flip. Trust me. Go to bed.']}]}],
  codex:'You wrote this when you were feeling bold. Read it. Be bold again.',
  ack:'Now that’s style. I’ll be watching.',
  done:{open:['Every task done. Full combo, no misses. I might give you a ten. Might.'],opts:[
   {t:'Same again tomorrow.',r:['Then I’ll save a seat in the front row.']},
   {t:'Do I get a prize?',r:['* She blows you a kiss.','That’s the prize. For now.']}]}},

 vi:{
  cheers:[
   {open:['Workout done. You looked like you were punching something personal. Good. That’s the point.'],opts:[
    {t:'Next round.',r:['That’s what I like to hear. Tape up, tough guy.']},
    {t:'It was my inbox.',r:['Ha. Mine’s Caitlyn’s paperwork. Same energy.']}]},
   {open:['* Vi bumps your fist with a gauntlet. Gently, for her.','You trained even though you had a rough day. That’s the stuff that counts.'],opts:[
    {t:'Bad days too.',r:['Yeah. That’s the guy I want next to me in a fight.']},
    {t:'Hitting stuff helps.',r:['Told you. Cheaper than therapy. Mostly.']}]},
   {open:['You drank water instead of the fourth coffee. Cupcake would be proud. I’m only a little proud.'],opts:[
    {t:'Water tomorrow too.',r:['Look at you. All hydrated and stuff. It’s working.']},
    {t:'I miss the coffee.',r:['So do I. We’ll mourn it together.']}]},
   {open:['You went to bed instead of scrolling. Recovery’s half of training. Nobody tells you that in Zaun.'],opts:[
    {t:'Lights out again tonight.',r:['Good. I like you rested. You hit harder.']},
    {t:'I scrolled a little.',r:['A little. Fine. Phone in the drawer next time, or I’m taking it.']}]}],
  codex:'You wrote this down. Read it. Then go hit something.',
  ack:'Yeah? Good. Let’s go.',
  done:{open:['Every task done. Every one. Okay, I’m impressed. Don’t make me say it twice.'],opts:[
   {t:'Tomorrow too.',r:['Then I’ll see you at the bag. Bring snacks.']},
   {t:'Say it twice.',r:['* She grins and pokes you in the chest.','Impressed. There. Now buy me a drink.']}]}},

 // ---------------- Work ----------------
 kelsey:{
  cheers:[
   {open:['Task done! Clean entry, clean exit, nobody hurt. SI:7 would hire you on the spot.'],opts:[
    {t:'Next job.',r:['Ooh, I love when you say that. I’ve got the plans ready.']},
    {t:'Do I get a badge?',r:['You get a sticker. It’s a tiny dagger. It’s adorable.']}]},
   {open:['* Kelsey pops up from behind a crate.','You did the scary task first. Before coffee! Who even are you?'],opts:[
    {t:'Scary first again tomorrow.',r:['That’s my partner. I’m so proud I could blow something up.']},
    {t:'Please don’t blow anything up.',r:['No promises. Small booms only.']}]},
   {open:['You worked a full block with your phone face down. I didn’t even have to steal it.'],opts:[
    {t:'Phone down tomorrow too.',r:['Then I’ll steal your heart instead. Kidding. Mostly.']},
    {t:'I almost picked it up.',r:['Almost. But didn’t. That’s a clean job.']}]},
   {open:['You cleared your inbox. Every last message. That’s basically a vault heist.'],opts:[
    {t:'I’ll keep it clean.',r:['Good. Shaw would weep. He’s never cleared his.']},
    {t:'It felt like a heist.',r:['Because it was. You’re a master thief now. Of time.']}]}],
  codex:'You hid this note for yourself. Very spy. Read it.',
  ack:'Copy that, partner. Moving out.',
  done:{open:['Every task done! Full sweep! I’m doing a little dance. Don’t look. Okay, look.'],opts:[
   {t:'Same again tomorrow.',r:['Yes! New plans at dawn. I’ll bring pastries.']},
   {t:'Dance with me.',r:['* She hops onto a crate to reach your shoulders.','Only if you lead. I keep stepping on toes.']}]}},

 missfortune:{
  cheers:[
   {open:['Job done, on time. That’s how I like my crew. And my men.'],opts:[
    {t:'Next one’s mine.',r:['Hungry. Good. Keep that and you’ll own this Market.']},
    {t:'Do I get a cut?',r:['You get a wink. Captain’s rates.']}]},
   {open:['* Sarah tips her hat.','You put money away instead of spending it. That’s how empires start. Ask me.'],opts:[
    {t:'More next week.',r:['That’s my kind of man. Patient and dangerous.']},
    {t:'I wanted the new thing.',r:['You’ll get it. Later, and paid in full. Feels better that way.']}]},
   {open:['You handled the hard meeting. Calm, sharp, no blinking. Gangplank never managed that.'],opts:[
    {t:'I’ll keep my head.',r:['Good. A cool head wins more than a hot pistol.']},
    {t:'My hands were shaking.',r:['Nobody saw. That’s what matters. Mine shake too, sometimes.']}]},
   {open:['You finished the boring part first. That’s the whole secret. Don’t tell the other captains.'],opts:[
    {t:'Boring first, always.',r:['Smart. Very attractive habit, that.']},
    {t:'It was so boring.',r:['Boring pays, love. Then we have fun with the profits.']}]}],
  codex:'You wrote this in your own logbook. A captain reads her logs. Read yours.',
  ack:'That’s a deal. I’ll hold you to it.',
  done:{open:['Every task done. Books balanced, crew paid. Come on. Captain’s buying.'],opts:[
   {t:'Same again tomorrow.',r:['Then we sail at dawn. Don’t be late.']},
   {t:'Just one drink.',r:['* She takes your arm.','One. Then we’ll see.']}]}},

 talanji:{
  cheers:[
   {open:['A hard task, finished well. My father would have nodded at you. He did not nod often.'],opts:[
    {t:'Tomorrow too.',r:['Good. A kingdom is built one finished day at a time, mon.']},
    {t:'Just a nod?',r:['From Rastakhan? That was a parade.']}]},
   {open:['* Talanji sets down her scroll.','You planned tomorrow before you left today. That is how Zandalar survives its wars.'],opts:[
    {t:'I’ll plan again tonight.',r:['Then sleep well after. A queen needs rested advisors.']},
    {t:'Is that how you sleep?',r:['Barely. You do it better than me. Teach me.']}]},
   {open:['You checked your work twice before you sent it. Careful hands. I trust careful hands.'],opts:[
    {t:'Always twice.',r:['Then I will always trust you. That is not a small thing for me.']},
    {t:'I found a mistake.',r:['Good. Better you than your enemies. Or your boss.']}]},
   {open:['You stopped at a sensible hour. Bwonsamdi will be disappointed. I am not.'],opts:[
    {t:'Home on time again.',r:['Good. Your family is your kingdom. Go rule it.']},
    {t:'There was more to do.',r:['There is always more. Tomorrow’s work belongs to tomorrow.']}]}],
  codex:'You wrote this for yourself. Read it like a royal decree.',
  ack:'So it is decreed. I am proud of you.',
  done:{open:['Every task done. The whole list. In Dazar’alor we would light the great braziers for you.'],opts:[
   {t:'Same again tomorrow.',r:['Then I will see you at the market at sunrise.']},
   {t:'Just sit with me.',r:['* She sets her crown aside.','Gladly. A queen can sit too.']}]}},

 // ---------------- Home ----------------
 maggie:{
  cheers:[
   {open:['Dishes done and dried! And put away! I nearly dropped my ladle.'],opts:[
    {t:'Every night now.',r:['Oh, you’ll make some house very happy. Yours, mainly.']},
    {t:'I hid a pan in the oven.',r:['Course you did. Fetch it out, love. I’ll wait.']}]},
   {open:['* Maggie waves her spoon.','You took the bins out before anyone asked. That’s a proper man, that is.'],opts:[
    {t:'Before they ask, always.',r:['Ooh. Keep talking like that and I’ll make you stew every night.']},
    {t:'The bins smelled.',r:['They do that. So does my cow. You get used to it.']}]},
   {open:['You fixed the drippy tap at last. I could hear it from my cauldron.'],opts:[
    {t:'The loose shelf is next.',r:['Look at you. Tool belt and all. Very fetching.']},
    {t:'It took three tries.',r:['Three tries and it works. That’s how my stew happens too.']}]},
   {open:['Floor swept, laundry folded. You know what that is? Love. The quiet kind.'],opts:[
    {t:'Tomorrow too.',r:['Good lad. A warm house is the best gift you can give them.']},
    {t:'I folded the socks wrong.',r:['Nobody folds socks right. Not even me. Ball them up and call it done.']}]}],
  codex:'You wrote this down, love. Read it while I stir.',
  ack:'That’s my lad. I’ll have the pot warm.',
  done:{open:['Everything done. Every last chore. Come have a bowl before it goes cold.'],opts:[
   {t:'Same again tomorrow.',r:['Then I’ll keep the fire going for you.']},
   {t:'Just sit with you.',r:['* She pats the stool beside her.','Best part of the day, this.']}]}},
};
