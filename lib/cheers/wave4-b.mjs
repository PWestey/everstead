// Cheers (task-completion pop-ups), fourth wave part B. See docs/WRITING-BRIEF.md, "Cheers".
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Fatherhood ----------------
 moira:{
  cheers:[
   {open:['You got down on the floor and played. Properly. Not with one eye on your phone.','Dagran would’ve crowned you for that. I’ve been waiting for a quiet minute with you afterward.'],opts:[
    {t:'Tomorrow too.',r:['Aye, you will. And I’ll be on the stairs pretending not to watch.']},
    {t:'My knees disagree.',r:['Your knees will live. Dwarves kneel at forges all day and we’re fine. Mostly.']}]},
   {open:['* Moira leans in the Inn doorway, arms folded, smiling.','Bedtime, on time, story and all. Do you know how many kings can manage that? None. I’ve met them. Come sit beside me. I saved you the warm side of the bench.'],opts:[
    {t:'Same time tomorrow.',r:['Good. I’ll have the tea ready after. You’ll need it.']},
    {t:'They made me do the voices.',r:['Of course they did. I heard the troll one. It was terrible. I loved it.']}]},
   {open:['You listened to the whole long story about the bug in the garden. Every word. That’s love, that is. I like that smile. Bring it closer where I can see it properly.'],opts:[
    {t:'I’ll keep listening.',r:['That’s the job. Half of it, anyway. The other half is snacks.']},
    {t:'It was a very long bug.',r:['* She laughs, low and warm.','They always are. Dagran once told me about a rock for an hour.']}]},
   {open:['You lost your temper, then went back and made it right. My da took forty years to learn that. You did it before supper. You’ve caught my attention. Now stop hovering at the door.'],opts:[
    {t:'I’ll own it every time.',r:['Then they’ll grow up knowing how. That’s worth more than any crown.']},
    {t:'Don’t tell Magni I’m faster.',r:['Oh, I’m telling him. Over ale. Loudly.']}]}],
  codex:'You wrote this down when your head was clear. Read it, then go kiss their foreheads.',
  ack:'Good. That’s the father I keep finding excuses to see.',
  done:{open:['Everything settled? Sit beside me. I’m having one evening that belongs to Moira, and I want you in it.'],opts:[
   {t:'Same again tomorrow.',r:['Aye. You and me, stubborn as Dark Iron. I like that.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She catches your hand. “Stay a little longer. Aye, I’m asking you. I thought that was clear.”']}]}},

 // ---------------- Fitness ----------------
 quinn:{
  cheers:[
   {open:['* Valor screeches from the fence.','He says that was a good run. I say it was a great one. You kept your pace on the hill. I kept hoping you’d look over. I wanted you to catch me smiling.'],opts:[
    {t:'Next run’s faster.',r:['Then I’ll have to stop holding back. Fair warning.']},
    {t:'Tell Valor thanks.',r:['He heard. He’s pretending he didn’t. Classic bird.']}]},
   {open:['You stretched afterward without me nagging. I nearly fell off the fence. Come walk with me afterward. No patrol, just you and me.'],opts:[
    {t:'Every time now.',r:['Good. Your hamstrings just sent me a thank-you note.']},
    {t:'You nag nicely.',r:['I know. I’ve had practice. Mostly on Valor.']}]},
   {open:['You walked instead of driving. Short trip, I know. Rangers count every mile. I’d like your company on the next one. And at dinner after.'],opts:[
    {t:'Count me in.',r:['Already did. You’re on the patrol roster for good now.']},
    {t:'It was a very short mile.',r:['Still a mile. Valor flew it with you. He won, obviously.']}]},
   {open:['You worked out tired. Those are the ones that matter. Anyone runs on a good day. You’ve got my attention. I’d rather you knew that.'],opts:[
    {t:'I’ll do it tired again.',r:['That’s a ranger talking. Come here, you’re dripping. I don’t care.']},
    {t:'I want a nap now.',r:['Earned. Lie in the grass. I’ll keep watch.']}]}],
  codex:'You wrote this on a good day. Read it like a trail marker.',
  ack:'Then we head out at dawn. I’ll wait at the gate.',
  done:{open:['Patrol’s finished. Walk the fields with me. I’d like to hold your hand without inventing a reason.'],opts:[
   {t:'Tomorrow too.',r:['Good. Same path, same time. I’ll be there first.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She turns toward you at the gate. “I wanted this to be a date. I’d like to end it with a kiss.”']}]}},

 samira:{
  cheers:[
   {open:['Workout done and you didn’t even complain. That’s style. I enjoyed watching. Come over here and enjoy being noticed.'],opts:[
    {t:'Next set’s mine.',r:['Ooh, cocky. I like it. Show me tomorrow.']},
    {t:'I complained inside.',r:['Inside doesn’t count. Outside, you looked great.']}]},
   {open:['* Samira spins a pistol and holsters it.','You hit a new weight today. I saw your face. That little smirk? Very good look. That smile suits you. I want to see it across a dinner table.'],opts:[
    {t:'Heavier next week.',r:['That’s what I want to hear. Keep chasing it.']},
    {t:'You were staring.',r:['Of course I was. It was the best thing happening in the Yard.']}]},
   {open:['You said no to the second helping. Dull. Smart. Kind of hot. I like knowing you can choose. Choose a seat beside me tonight.'],opts:[
    {t:'Again tomorrow.',r:['Good. Discipline looks better on you than dessert.']},
    {t:'I wanted it so bad.',r:['I know. Wanting it and walking away? That’s the real thrill.']}]},
   {open:['Eight hours of sleep. Look at you, all rested. Your reflexes will thank you. Good. I want you awake enough to enjoy our date.'],opts:[
    {t:'Early night again.',r:['Perfect. A rested partner is a fast partner.']},
    {t:'Sleep is boring.',r:['Sleep is how I land a flip. Trust me. Go to bed.']}]}],
  codex:'You wrote this when you were feeling bold. Read it. Be bold again.',
  ack:'Now that’s style. I’ll be watching.',
  done:{open:['Full list finished. I’m buying dinner. You’re bringing that smile. I’d like a night worth remembering.'],opts:[
   {t:'Same again tomorrow.',r:['Then I’ll save a seat in the front row.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She sets her hat aside. “I’m done performing for the room. I want to kiss you. Interested?”']}]}},

 vi:{
  cheers:[
   {open:['Workout done. You looked like you were punching something personal. Good. That’s the point. You look good when you stop doubting yourself. Come here.'],opts:[
    {t:'Next round.',r:['That’s what I like to hear. Tape up, tough guy.']},
    {t:'It was my inbox.',r:['Ha. Mine’s Caitlyn’s paperwork. Same energy.']}]},
   {open:['* Vi bumps your fist with a gauntlet. Gently, for her.','You trained even though you had a rough day. That’s the stuff that counts. I like a man who turns up. Especially when I’m waiting for him.'],opts:[
    {t:'Bad days too.',r:['Yeah. That’s the guy I want next to me in a fight.']},
    {t:'Hitting stuff helps.',r:['Told you. Cheaper than therapy. Mostly.']}]},
   {open:['You drank water instead of the fourth coffee. Cupcake would be proud. I’m only a little proud. I was going to ask you for a drink. Dinner sounds better.'],opts:[
    {t:'Water tomorrow too.',r:['Look at you. All hydrated and stuff. It’s working.']},
    {t:'I miss the coffee.',r:['So do I. We’ll mourn it together.']}]},
   {open:['You went to bed instead of scrolling. Recovery’s half of training. Nobody tells you that in Zaun. Good. Come see me tomorrow. I want you rested enough to keep up with my terrible flirting.'],opts:[
    {t:'Lights out again tonight.',r:['Good. I like you rested. You hit harder.']},
    {t:'I scrolled a little.',r:['A little. Fine. Phone in the drawer next time, or I’m taking it.']}]}],
  codex:'You wrote this down. Read it. Then go hit something.',
  ack:'Yeah? Good. Let’s go.',
  done:{open:['Everything done. Gloves off. I want a date with you, somewhere nobody needs punching.'],opts:[
   {t:'Tomorrow too.',r:['Then I’ll see you at the bag. Bring snacks.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She rests her hand on yours. “I like you. I want you here. That’s the whole sentence.”']}]}},

 // ---------------- Work ----------------
 kelsey:{
  cheers:[
   {open:['Task done! Clean entry, clean exit, nobody hurt. SI:7 would hire you on the spot. You’ve got my attention. I’d like a little of yours after work.'],opts:[
    {t:'Next job.',r:['Ooh, I love when you say that. I’ve got the plans ready.']},
    {t:'Do I get a badge?',r:['You get a sticker. It’s a tiny dagger. It’s adorable.']}]},
   {open:['* Kelsey pops up from behind a crate.','You did the scary task first. Before coffee! Who even are you? That deserves dinner. With me. No disguises or secret passwords.'],opts:[
    {t:'Scary first again tomorrow.',r:['That’s my partner. I’m so proud I could blow something up.']},
    {t:'Please don’t blow anything up.',r:['No promises. Small booms only.']}]},
   {open:['You worked a full block with your phone face down. I didn’t even have to steal it. I was hoping you’d look up. I’ve been trying to catch your eye.'],opts:[
    {t:'Phone down tomorrow too.',r:['Then I’ll steal your heart instead. Kidding. Mostly.']},
    {t:'I almost picked it up.',r:['Almost. But didn’t. That’s a clean job.']}]},
   {open:['You cleared your inbox. Every last message. That’s basically a vault heist. Now clear a little time for me. I’m asking you out, very officially.'],opts:[
    {t:'I’ll keep it clean.',r:['Good. Shaw would weep. He’s never cleared his.']},
    {t:'It felt like a heist.',r:['Because it was. You’re a master thief now. Of time.']}]}],
  codex:'You hid this note for yourself. Very spy. Read it.',
  ack:'Copy that, partner. Moving out.',
  done:{open:['All finished. I booked a table for two. This invitation is from me, not SI:7.'],opts:[
   {t:'Same again tomorrow.',r:['Yes! New plans at dawn. I’ll bring pastries.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She sets the dossier aside. “I’d like to kiss you. No mission, no cover story. Just me asking.”']}]}},

 missfortune:{
  cheers:[
   {open:['Job done, on time. That’s how I like my crew. And my men. I like a man who delivers. Come let the captain buy you dinner.'],opts:[
    {t:'Next one’s mine.',r:['Hungry. Good. Keep that and you’ll own this Market.']},
    {t:'Do I get a cut?',r:['You get a wink. Captain’s rates.']}]},
   {open:['* Sarah tips her hat.','You put money away instead of spending it. That’s how empires start. Ask me. Enough counting coins. I’d rather see you smiling at me.'],opts:[
    {t:'More next week.',r:['That’s my kind of man. Patient and dangerous.']},
    {t:'I wanted the new thing.',r:['You’ll get it. Later, and paid in full. Feels better that way.']}]},
   {open:['You handled the hard meeting. Calm, sharp, no blinking. Gangplank never managed that. That composure is attractive. I’d enjoy testing it over a drink.'],opts:[
    {t:'I’ll keep my head.',r:['Good. A cool head wins more than a hot pistol.']},
    {t:'My hands were shaking.',r:['Nobody saw. That’s what matters. Mine shake too, sometimes.']}]},
   {open:['You finished the boring part first. That’s the whole secret. Don’t tell the other captains. Come see me when the market closes. I have an invitation that’s entirely personal.'],opts:[
    {t:'Boring first, always.',r:['Smart. Very attractive habit, that.']},
    {t:'It was so boring.',r:['Boring pays, love. Then we have fun with the profits.']}]}],
  codex:'You wrote this in your own logbook. A captain reads her logs. Read yours.',
  ack:'That’s a deal. I’ll hold you to it.',
  done:{open:['Books balanced. Crew paid. Now come here, love. I’ve had enough of admiring you from across the room.'],opts:[
   {t:'Same again tomorrow.',r:['Then we sail at dawn. Don’t be late.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She sets down her hat. “I’d like a kiss. Take your time. The captain’s in no hurry tonight.”']}]}},

 talanji:{
  cheers:[
   {open:['A hard task, finished well. My father would have nodded at you. He did not nod often. You have my respect. I would also like your company over dinner.'],opts:[
    {t:'Tomorrow too.',r:['Good. A kingdom is built one finished day at a time, mon.']},
    {t:'Just a nod?',r:['From Rastakhan? That was a parade.']}]},
   {open:['* Talanji sets down her scroll.','You planned tomorrow before you left today. That is how Zandalar survives its wars. I left a little time free tonight. I was hoping you would share it.'],opts:[
    {t:'I’ll plan again tonight.',r:['Then sleep well after. A queen needs rested advisors.']},
    {t:'Is that how you sleep?',r:['Barely. You do it better than me. Teach me.']}]},
   {open:['You checked your work twice before you sent it. Careful hands. I trust careful hands. Steady hands are attractive. Come sit close enough for me to take one.'],opts:[
    {t:'Always twice.',r:['Then I will always trust you. That is not a small thing for me.']},
    {t:'I found a mistake.',r:['Good. Better you than your enemies. Or your boss.']}]},
   {open:['You stopped at a sensible hour. Bwonsamdi will be disappointed. I am not. Good. I do not want to spend our evening talking to your exhaustion.'],opts:[
    {t:'Home on time again.',r:['Good. Your family is your kingdom. Go rule it.']},
    {t:'There was more to do.',r:['There is always more. Tomorrow’s work belongs to tomorrow.']}]}],
  codex:'You wrote this for yourself. Read it like a royal decree.',
  ack:'So it is decreed. I am proud of you.',
  done:{open:['Every task finished. Walk with me. Tonight I would like your company without a court between us.'],opts:[
   {t:'Same again tomorrow.',r:['Then I will see you at the market at sunrise.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She takes your hand and smiles. “I asked you to stay because I want you here. You may ask me the same.”']}]}},

 // ---------------- Home ----------------
 maggie:{
  cheers:[
   {open:['Dishes done and dried! And put away! I nearly dropped my ladle. Now come sit with me, love. I like a man who stays after the washing up.'],opts:[
    {t:'Every night now.',r:['Oh, you’ll make some house very happy. Yours, mainly.']},
    {t:'I hid a pan in the oven.',r:['Course you did. Fetch it out, love. I’ll wait.']}]},
   {open:['* Maggie waves her spoon.','You took the bins out before anyone asked. That’s a proper man, that is. I’ve been looking forward to that face at my table all afternoon.'],opts:[
    {t:'Before they ask, always.',r:['Ooh. Keep talking like that and I’ll make you stew every night.']},
    {t:'The bins smelled.',r:['They do that. So does my cow. You get used to it.']}]},
   {open:['You fixed the drippy tap at last. I could hear it from my cauldron. You’ve earned my attention. Oh, you had it already. Come closer.'],opts:[
    {t:'The loose shelf is next.',r:['Look at you. Tool belt and all. Very fetching.']},
    {t:'It took three tries.',r:['Three tries and it works. That’s how my stew happens too.']}]},
   {open:['Floor swept, laundry folded. You know what that is? Love. The quiet kind. I saved you a place. It’s suspiciously close to mine.'],opts:[
    {t:'Tomorrow too.',r:['Good lad. A warm house is the best gift you can give them.']},
    {t:'I folded the socks wrong.',r:['Nobody folds socks right. Not even me. Ball them up and call it done.']}]}],
  codex:'You wrote this down, love. Read it while I stir.',
  ack:'That’s my lad. I’ll have the pot warm.',
  done:{open:['Kitchen’s shut. Come sit beside me. I’d like your company without having to pass you a bowl first.'],opts:[
   {t:'Same again tomorrow.',r:['Then I’ll keep the fire going for you.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She dries her hands and takes yours. “Stay, love. I’d like another kiss, and I’m not shy about asking.”']}]}},
};
