// Cheers, Fellows set A: pop-ups when the player checks off a habit in the character's life area.
// See docs/WRITING-BRIEF.md ("Cheers"). M = {open:['1-2 lines'], opts:[{t,r:[one line]},{t,r:[one line]}]}

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Obi-Wan (Faith) ----------------
 obiwan:{
  cheers:[
   {open:['Prayed before the coffee? Hm. Took me twenty years in a desert hut to manage that.'],opts:[
    {t:'Same time tomorrow, Master.',r:['Good. I’ll put the kettle on. Don’t tell anyone I said “good.”']},
    {t:'The coffee was right there, though.',r:['So was the Dark Side, usually. Coffee’s the gentler test.']}]},
   {open:['You read scripture with the kids in the room. Bold. I could never get Anakin to sit still for a holocron.'],opts:[
    {t:'I’ll keep reading. Every day.',r:['Then they’ll remember your voice reading it. That outlasts most lessons.']},
    {t:'They mostly asked for snacks.',r:['Younglings always do. It still goes in. Trust me.']}]},
   {open:['A gratitude list. Three things, written down. I tried that once. Wrote “sand” by mistake.'],opts:[
    {t:'I’m committed. Three more tomorrow.',r:['Splendid. Avoid “sand.” It doesn’t hold up on reread.']},
    {t:'One of mine was coffee.',r:['Perfectly valid. The Force works in caffeinated ways.']}]},
   {open:['* He brushes dust off his robe and nods at you.','Quiet time, done. On a day like this one? I’m impressed. Genuinely.'],opts:[
    {t:'I’ll find the quiet again tomorrow.',r:['Then I’ll be there, being quiet with you. I’m very good at it.']},
    {t:'You looked shocked.',r:['I’ve been shocked before. Usually by explosions. This was nicer.']}]}],
  codex:'You wrote this down once. I kept old notes in the hut too. Read it again, slowly.',
  ack:'Good. Something written and remembered is half a lesson learned.',
  done:{open:['Every task done, and it’s still daylight. Qui-Gon would have smiled. I’m attempting it now.'],opts:[
   {t:'Do it all again tomorrow?',r:['Of course. Same sun. Well, one sun. I’m still adjusting.']},
   {t:'Is that your smile?',r:['It’s rusty. Give it time. You’ve given me reasons to practice.']}]}},

 // ---------------- Matt Murdock (Faith) ----------------
 matt:{
  cheers:[
   {open:['Heard you pray this morning. Not the words. Just your heart slowing down. Nice.'],opts:[
    {t:'Tomorrow too, counselor.',r:['I’ll be listening. In the least creepy way possible.']},
    {t:'You were eavesdropping?',r:['I eavesdrop on the whole village. You’re the only one praying. The baker’s just swearing.']}]},
   {open:['You read the Psalms on a bad day. I can smell the burnt toast, so I know it was a bad day.'],opts:[
    {t:'I’m not skipping the hard days.',r:['That’s the whole thing. Father Lantom would buy you a beer for that.']},
    {t:'The toast was a casualty.',r:['There’s always a casualty. Ask my sparring bag.']}]},
   {open:['Gratitude list, huh? Foggy made me do one once. I wrote “Foggy” three times so he’d stop asking.'],opts:[
    {t:'I am committed to this.',r:['Good. Mean it on paper and you start meaning it out loud.']},
    {t:'Did he stop asking?',r:['No. He framed it. It’s in the office. I can’t see it, but I know.']}]},
   {open:['* He taps his cane on the step twice.','You went to church tired. Showed up anyway. That’s my whole religion, basically.'],opts:[
    {t:'I’ll be in the pew next week.',r:['Save me a seat. I’ll find it. I always do.']},
    {t:'I yawned during the homily.',r:['Twice. I counted. Still counts.']}]}],
  codex:'Your own words, counselor. Read them back like it’s closing argument.',
  ack:'Case made. I’d sign that.',
  done:{open:['Everything checked off. Your heart’s calm. Mine never is. Tell me your secret.'],opts:[
   {t:'Same verdict tomorrow.',r:['Then I rest my case. And my knuckles.']},
   {t:'Less rooftop fighting.',r:['Yeah, I keep hearing that. Doesn’t take.']}]}},

 // ---------------- T'Challa (Faith) ----------------
 tchalla:{
  cheers:[
   {open:['You sat in stillness this morning. In Wakanda we would call that speaking with the ancestors.'],opts:[
    {t:'I’ll be back at dawn.',r:['Then I will meet you there. Bring nothing but yourself.']},
    {t:'Mine were mostly quiet.',r:['Mine talk constantly. Quiet is a blessing, my friend.']}]},
   {open:['Scripture before work. My father kept the old rites before any council. You remind me of him.'],opts:[
    {t:'That’s a habit I’m keeping.',r:['Good. A king who forgets what he answers to does not stay a king.']},
    {t:'Did he have a phone to ignore?',r:['He had Zuri. Far more distracting. Far louder.']}]},
   {open:['* He presses a fist to his chest.','You gave thanks out loud at dinner. Your children heard it. That is how a people is built.'],opts:[
    {t:'Every meal. I am committed.',r:['Then your table will feel like a throne room. A warm one.']},
    {t:'The kids giggled.',r:['Shuri giggled at my coronation. It still counted.']}]},
   {open:['You prayed for someone who hurt you. That is harder than any challenge at Warrior Falls.'],opts:[
    {t:'I’ll keep at it, even when it stings.',r:['That is strength. The quiet kind, which is the rarer kind.']},
    {t:'Can I just fight him instead?',r:['I have tried that. Prayer leaves fewer bruises.']}]}],
  codex:'You wrote this in a quiet moment. Read it again, as your ancestors would want.',
  ack:'Good. My father would have liked you. Shuri already does.',
  done:{open:['All your work is done today. My people would light a fire for that. I will settle for a nod.'],opts:[
   {t:'Light it again tomorrow.',r:['I will. You keep giving me reasons.']},
   {t:'Just a nod?',r:['A king’s nod. Very rare. Ask Okoye.']}]}},

 // ---------------- Tavi (Marriage) ----------------
 tavi:{
  cheers:[
   {open:['You asked about her day and actually listened? Kitai would call that suspicious. I call it tactics.'],opts:[
    {t:'I’ll ask again tomorrow.',r:['Excellent. Never fight the same campaign with less attention.']},
    {t:'I only half understood the work drama.',r:['Half is a strong opening position. Ask a follow-up.']}]},
   {open:['Date night on the calendar. Written down. I once planned a siege with less forethought.'],opts:[
    {t:'Every week. Count on me.',r:['Good. The Legions run on schedules. So do marriages, it turns out.']},
    {t:'She picked the restaurant.',r:['Wise. Never pick the battlefield if she knows the ground better.']}]},
   {open:['You apologized first. No conditions. Do you know how hard that is? I’ve watched Kitai win by waiting.'],opts:[
    {t:'I’m committed to going first.',r:['Then you’ll win the war and lose every skirmish. Best trade there is.']},
    {t:'She still won, didn’t she?',r:['They always win. The trick is you both stop losing.']}]},
   {open:['* He’s grinning at a crumpled note.','You left her a note on the counter. Kitai left me one once. It said “Idiot.” I kept it.'],opts:[
    {t:'Another note tomorrow.',r:['Do it. Mix it up. Maybe skip “idiot.”']},
    {t:'Mine had a heart on it.',r:['Show-off. I’m telling Kitai. She’ll be furious. And impressed.']}]}],
  codex:'Your own field notes. Read them like a battle plan. Then go home.',
  ack:'Good. Plans are nothing until somebody moves the little horse.',
  done:{open:['Every daily done. If the Senate worked this hard, Alera would be peaceful by Tuesday.'],opts:[
   {t:'I’ll run it back tomorrow.',r:['That’s how you hold a line. One day at a time.']},
   {t:'The Senate’s a low bar.',r:['Fair. You cleared it by a mile, though.']}]}},

 // ---------------- Steve Rogers (Marriage) ----------------
 steve:{
  cheers:[
   {open:['You took her out dancing? Or at least the kitchen counts. Trust me, I know what a missed dance costs.'],opts:[
    {t:'I’ll never miss one.',r:['That’s a promise worth keeping. Keep it on the ordinary nights too.']},
    {t:'I stepped on her feet.',r:['Peggy would’ve said that’s half the fun. She’d be right.']}]},
   {open:['Phone in the drawer through dinner. You looked at her the whole time. That’s old-school, pal. I like it.'],opts:[
    {t:'Old-school every night.',r:['Good man. They didn’t have phones in ’41 and we did okay.']},
    {t:'She asked if I was okay.',r:['Ha! Keep it up and she’ll stop asking. In a good way.']}]},
   {open:['You did the dishes without being asked. Small thing. It isn’t, really. It’s the whole thing.'],opts:[
    {t:'I’m committed. Dishes are mine.',r:['Then I’d follow you into any kitchen, soldier.']},
    {t:'There were a lot of dishes.',r:['There always are. That’s how you know it matters.']}]},
   {open:['* He straightens his jacket like he’s about to salute.','You told her she looked beautiful. Out loud. On a Tuesday. Proud of you.'],opts:[
    {t:'I’ll say it again tomorrow.',r:['Say it every day. Seventy years is too long to wait to say things.']},
    {t:'She laughed at me.',r:['Laughed or blushed? Because those are both a win, buddy.']}]}],
  codex:'You wrote this down. I keep a notebook too. Read it again. It’s worth it.',
  ack:'Atta boy. That’s how it’s done.',
  done:{open:['All done for the day. Every one. Brooklyn would be proud. I sure am.'],opts:[
   {t:'Again tomorrow. I’m in.',r:['Then I’ll see you on the line. Like always.']},
   {t:'Can I nap now?',r:['Earned it. Even I sleep. Sometimes for decades.']}]}},

 // ---------------- Din Djarin (Fatherhood) ----------------
 din:{
  cheers:[
   {open:['* The helmet tilts.','You put the kid to bed and stayed until he fell asleep. Good. That’s the job.'],opts:[
    {t:'Every night. That’s the way.',r:['It is. I’ll tell the little one you said so.']},
    {t:'He asked for six stories.',r:['Mine only asks for the frog. Every time. I don’t ask why.']}]},
   {open:['You let them help in the kitchen. Messy. Slow. I teach mine the same way. Beside me.'],opts:[
    {t:'I’ll keep them close.',r:['Good. That’s how they learn. Not from words.']},
    {t:'There’s flour on the ceiling.',r:['Grogu got a thermal detonator once. Flour is fine.']}]},
   {open:['You played on the floor with them. No phone. I saw.'],opts:[
    {t:'I’m committed to being there.',r:['I know. I watched you mean it.']},
    {t:'My knees are done for.',r:['Beskar doesn’t help knees. I checked.']}]},
   {open:['* He sets a small toy ship on the table.','You answered every question at bedtime. Even the hard ones. That’s a clan worth having.'],opts:[
    {t:'I’ll answer tomorrow too.',r:['Then they’ll keep asking. That’s the good part.']},
    {t:'One was about where stars go.',r:['I wouldn’t have known that one either.']}]}],
  codex:'You wrote this. Read it again.',
  ack:'Good. That’s the way.',
  done:{open:['Everything’s done. Rest. The little ones need you rested.'],opts:[
   {t:'Tomorrow, same as today.',r:['I’ll be here. So will they.']},
   {t:'Can I see under the helmet now?',r:['No.']}]}},

 // ---------------- Logan (Fatherhood) ----------------
 logan:{
  cheers:[
   {open:['* He cracks a beer and doesn’t offer you one.','You made it to the game. Front row. The kid looked for you and you were there. Good.'],opts:[
    {t:'I’ll be there every time.',r:['Yeah. You will. That’s what matters. Not the score.']},
    {t:'They lost by twelve.',r:['Who cares. They’ll remember the guy yelling their name.']}]},
   {open:['Bedtime story. Voices and everything. Don’t ever tell anyone I said this, bub. That was a good thing.'],opts:[
    {t:'Voices every night.',r:['Alright, alright. Don’t make it weird.']},
    {t:'You want to do one?',r:['I do one voice. It’s this one. Kids hate it.']}]},
   {open:['You put the phone down when the kid wanted to talk. I spent a hundred years not listening. Don’t copy me.'],opts:[
    {t:'I’m in. No more half-listening.',r:['Good. Healing factor doesn’t fix that kind of thing.']},
    {t:'It was about dinosaurs. For an hour.',r:['Dinosaurs are important. Ask any eight-year-old.']}]},
   {open:['You took the kid out, just you two. Pancakes, right? I can smell the syrup on you.'],opts:[
    {t:'Next week too.',r:['Make it a thing. They don’t forget those.']},
    {t:'You can smell that?',r:['I can smell everything. It’s a curse. Mostly.']}]}],
  codex:'You wrote this down. Read it again, bub. Don’t make me say it twice.',
  ack:'Yeah. Now go hug your kid.',
  done:{open:['All done, huh? Every last one. Not bad, kid. Not bad at all.'],opts:[
   {t:'I’ll do it again tomorrow.',r:['Course you will. Stubborn. I like that.']},
   {t:'Now can I have a beer?',r:['Get your own. I’m out after this one.']}]}},

 // ---------------- Peter Quill (Fatherhood) ----------------
 quill:{
  cheers:[
   {open:['You danced with your kid in the kitchen! Dude. That’s the whole job. Yondu never danced. Ever.'],opts:[
    {t:'Dance party every night.',r:['YES. I’ll make you a mixtape. Cassette only, obviously.']},
    {t:'I can’t dance.',r:['Nobody can dance. You just do it until someone laughs. Then you won.']}]},
   {open:['You taught them a song from when you were a kid? Okay, now I’m emotional. Give me a sec.'],opts:[
    {t:'One song a week. Count me in.',r:['That’s how it goes. Your music becomes their music. Best thing ever.']},
    {t:'They said it was old.',r:['It’s CLASSIC. Kids. They’ll get it in twenty years.']}]},
   {open:['You stayed for bedtime and didn’t rush it. Rocket says I rush everything. Rocket’s wrong. Mostly.'],opts:[
    {t:'I am committed!',r:['Hell yeah you are. Star-Lord approved.']},
    {t:'They stalled for twenty minutes.',r:['Professional stalling. Respect the craft.']}]},
   {open:['You took them outside to look at stars. Bro. That’s my move. I respect it.'],opts:[
    {t:'Again next clear night.',r:['Show them the big ones. Maybe make up names. I always do.']},
    {t:'They wanted to go back inside.',r:['Snacks next time. Snacks fix everything.']}]}],
  codex:'Okay, you wrote this. It’s like a mixtape from past you. Hit play.',
  ack:'Awesome mix, man.',
  done:{open:['Everything done? All of it? That’s a legendary outlaw move right there.'],opts:[
   {t:'Running it back tomorrow.',r:['Track two. Same energy. Let’s go.']},
   {t:'Do I get a codename?',r:['Working on it. “Dad-Lord” is in the running.']}]}},

 // ---------------- Darrow (Fitness) ----------------
 darrow:{
  cheers:[
   {open:['Up before the sun and you lifted. In the mines we drilled at that hour. You’d have made a fine helldiver.'],opts:[
    {t:'Same hour tomorrow.',r:['Good. I’ll be in the Yard. Don’t be late.']},
    {t:'My arms are noodles.',r:['Noodles are a start. Clay first, then iron.']}]},
   {open:['You ran in that wind? Sevro would call you mad. I call you Red.'],opts:[
    {t:'I’ll break the wind tomorrow too.',r:['Ha. We break things. That’s what we do.']},
    {t:'I almost turned back.',r:['Almost doesn’t count. You didn’t.']}]},
   {open:['* He wipes sweat from his brow and tosses you a towel.','Eight hours of sleep. Don’t laugh. Even the Reaper sleeps. Mustang made me.'],opts:[
    {t:'I am committed to the grind.',r:['Then grind with me. Rest is part of it.']},
    {t:'You sleep?',r:['Badly. Better than I did. Keep at it.']}]},
   {open:['You picked the water over the soda. Small thing. In Lykos we had neither. Make it count.'],opts:[
    {t:'I’ll do it again tomorrow.',r:['Every small choice is a step up from the mines.']},
    {t:'I miss the soda.',r:['I miss Eo. We live with missing things.']}]}],
  codex:'Your words. Carved into you once. Read them again.',
  ack:'Good. Now up. The Yard’s cold and it won’t warm itself.',
  done:{open:['All of it done. Every task. I’ve seen Golds quit at less.'],opts:[
   {t:'I’ll be in the Yard tomorrow.',r:['I’ll be there. Bring your worst.']},
   {t:'I want a nap.',r:['Take it. Then get up. That’s the rhythm.']}]}},

 // ---------------- Roy (Fitness) ----------------
 roy:{
  cheers:[
   {open:['WHOA! You did your workout! Fuecoco, did you see that? He did the whole thing!'],opts:[
    {t:'Tomorrow too, Roy!',r:['YES! I’ll be ready! I’ll warm up tonight! Is that allowed?']},
    {t:'I’m very tired.',r:['That’s how you know it worked! My grandpa says that!']}]},
   {open:['You walked all the way around the village? That’s like, a journey! A real one!'],opts:[
    {t:'Next walk, you’re coming.',r:['Really?! I’m gonna bring snacks! And Fuecoco! And more snacks!']},
    {t:'It was a short loop.',r:['Short loops add up! That’s how you get to be the strongest!']}]},
   {open:['You did push-ups! How many? Wait, don’t tell me, let me guess. Fifty? A hundred? A MILLION?'],opts:[
    {t:'I’m committed. More tomorrow!',r:['Me too! I’ll do one more than you! Okay, maybe two less!']},
    {t:'Fifteen.',r:['Fifteen is SO many! That’s more than my whole crew!']}]},
   {open:['* He bounces on his toes.','You stretched! Grandpa says stretching is what heroes do when nobody’s looking!'],opts:[
    {t:'I’ll stretch every morning.',r:['Me too! Let’s race! Wait, you can’t race stretching. Can you?']},
    {t:'My back cracked.',r:['That’s a power-up sound! I think!']}]}],
  codex:'You wrote this down! Like a trainer’s journal! Read it again, it’s so cool!',
  ack:'YEAH! Let’s go! Me and you!',
  done:{open:['You did EVERYTHING today?! You’re like a real champion! I’m gonna be just like you!'],opts:[
   {t:'We’ll do it again tomorrow, partner.',r:['PARTNER! Did you hear that, Fuecoco? He called me partner!']},
   {t:'I need a nap.',r:['Champions nap! I think! I’m gonna nap too! Right after I run!']}]}},

 // ---------------- Grog (Fitness) ----------------
 grog:{
  cheers:[
   {open:['You lifted heavy stuff! GOOD! Grog likes it when friends lift heavy stuff!'],opts:[
    {t:'Heavier stuff tomorrow!',r:['YES! Bring it! I’ll find a bigger rock!']},
    {t:'It was groceries.',r:['Groceries is heavy stuff! And then you EAT it! Best workout!']}]},
   {open:['You went for a run? Why? Nothing was chasing you. Weird. But Grog respects it.'],opts:[
    {t:'I’m running again tomorrow.',r:['Okay! I’ll chase you! For motivation!']},
    {t:'There might have been a dog.',r:['HA! Good dog! Grog likes that dog!']}]},
   {open:['You ate a vegetable. Pike says that’s good. Grog doesn’t believe her. But okay.'],opts:[
    {t:'I am committed!',r:['RAAAH! Committed! That’s a good word! What’s it mean?']},
    {t:'It was broccoli.',r:['Tiny trees. Grog eats them when nobody looks.']}]},
   {open:['* He slaps you on the back hard enough to rattle your teeth.','You did the sweaty thing! Smell bad! That means it worked!'],opts:[
    {t:'I’ll stink again tomorrow.',r:['GOOD! We stink together! Brothers!']},
    {t:'I need a shower.',r:['Showers are for wimps! Okay, also for Pike. Go.']}]}],
  codex:'Oi! You wrote words! Grog can’t read good. Read it out loud!',
  ack:'YEAH! Smart AND strong!',
  done:{open:['All the tasks! ALL OF THEM! Time to celebrate with a big beer and a bigger sandwich!'],opts:[
   {t:'Same again tomorrow, big guy.',r:['YES! And the beer! Every day!']},
   {t:'Sandwich sounds good.',r:['Grog makes the best sandwich! It’s mostly meat!']}]}},

 // ---------------- Geralt (Fitness) ----------------
 geralt:{
  cheers:[
   {open:['Hm. Trained before breakfast. Not bad.'],opts:[
    {t:'Same tomorrow.',r:['Good. Monsters don’t wait for breakfast.']},
    {t:'Just “not bad”?',r:['Hm. Fine. Good.']}]},
   {open:['Ran in the rain. Roach would’ve refused.'],opts:[
    {t:'Rain or shine, I’m running.',r:['Hm. Roach still won’t.']},
    {t:'I got soaked.',r:['You’ll dry. Most things do.']}]},
   {open:['* He nods once.','Slept eight hours. Good. Ever tried a fight on four? Don’t.'],opts:[
    {t:'I am committed to sleep.',r:['Wise. Even witchers meditate.']},
    {t:'You meditate standing up?',r:['Kneeling. Standing’s for show-offs.']}]},
   {open:['Stretched. Good. Saved my back after the griffin.'],opts:[
    {t:'Tomorrow too.',r:['Mm. Keep at it.']},
    {t:'What griffin?',r:['Long story. Bad ending. For the griffin.']}]}],
  codex:'You wrote this. Read it.',
  ack:'Hm. Good.',
  done:{open:['All done. Rare. Good work.'],opts:[
   {t:'Again tomorrow.',r:['Hm. I’ll be here.']},
   {t:'Was that a smile?',r:['No.']}]}},

 // ---------------- Tony Stark (Work) ----------------
 tony:{
  cheers:[
   {open:['Deep work block, finished. No tab-switching. I literally can’t do that. Show-off.'],opts:[
    {t:'Another block tomorrow.',r:['Look at you. Building the suit one bolt at a time.']},
    {t:'I checked email once.',r:['Once. That’s practically monk-level. I’d have checked eight times.']}]},
   {open:['You shipped it. The thing. The actual thing, not the prototype. I’m proud. Write that down.'],opts:[
    {t:'I am committed to finishing.',r:['Good. Finishing is the hard part. Starting’s easy. Ask my workshop.']},
    {t:'It has bugs.',r:['Everything has bugs. Mark one had bugs. It still got me out of a cave.']}]},
   {open:['Budget check, done. Pepper would hug you. I’d just nod. A lot.'],opts:[
    {t:'Same time next week.',r:['Great. Set a reminder. JARVIS style.']},
    {t:'Math is boring.',r:['Math is a superpower. Boring is just its disguise.']}]},
   {open:['* He spins a screwdriver between his fingers.','You said no to a pointless meeting. Real growth. Took me three suits to learn that.'],opts:[
    {t:'I’m keeping my calendar clean.',r:['That’s the spirit. Calendar’s like armor. Protect it.']},
    {t:'They were annoyed.',r:['They’ll get over it. I annoy people professionally.']}]}],
  codex:'You took notes. Love that. Past you left future you a schematic. Read it.',
  ack:'Yep. That’s genius-level work right there.',
  done:{open:['Everything done? You beat my record. My record’s bad, but still.'],opts:[
   {t:'Running it back tomorrow.',r:['Version two. Better. Let’s go.']},
   {t:'Can I borrow a suit now?',r:['No. But I respect the ask.']}]}},

 // ---------------- Kelsier (Work) ----------------
 kelsier:{
  cheers:[
   {open:['* He flips a coin and catches it without looking.','You planned the day before you touched it. That’s a heist plan, my friend.'],opts:[
    {t:'Tomorrow, same plan.',r:['Ha! Now you’re talking like crew.']},
    {t:'It went sideways by noon.',r:['Every job goes sideways. Good crews adapt. You did.']}]},
   {open:['You finished the hard task first. Smart. Always rob the biggest vault while the guards are sleepy.'],opts:[
    {t:'Biggest vault first. Always.',r:['That’s the spirit. The Lord Ruler never saw it coming.']},
    {t:'I just wanted it over with.',r:['Same motive. Different words. Still brilliant.']}]},
   {open:['Saved money. Put it aside. Dockson would cry. I’d steal it. Kidding. Mostly.'],opts:[
    {t:'I’m committed to saving.',r:['Good. A crew with coin can do anything.']},
    {t:'Please don’t steal it.',r:['I would never. I would plan to, but never.']}]},
   {open:['You asked for help instead of grinding alone. That’s how heists work. Nobody goes solo.'],opts:[
    {t:'I’ll build my crew.',r:['Good. Pick ones who make you laugh. You’ll need it.']},
    {t:'I felt dumb asking.',r:['Dumb is pretending you know everything. You didn’t.']}]}],
  codex:'Your own plan. I love a plan. Read it again before the job.',
  ack:'Perfect. The crew’s ready.',
  done:{open:['Every task done. That, my friend, is a perfect job. Not a single coin out of place.'],opts:[
   {t:'Next job, tomorrow.',r:['Smile. We’re going to rob the day blind.']},
   {t:'What do we do now?',r:['Now? We celebrate. Then we plan the next one.']}]}},

 // ---------------- Bruce Banner (Work) ----------------
 bruce:{
  cheers:[
   {open:['* He adjusts his glasses.','You worked two hours straight without getting angry? That’s, um, that’s my whole thing. Nice job.'],opts:[
    {t:'Calm again tomorrow.',r:['Good. Tea helps. I can recommend a few.']},
    {t:'I got a little angry.',r:['A little’s normal. Just don’t turn green. You didn’t.']}]},
   {open:['You took notes in the meeting. Careful notes. I do that. Keeps the big guy quiet.'],opts:[
    {t:'I’ll keep the notebook going.',r:['Good. A good notebook beats a smash every time.']},
    {t:'I drew a doodle.',r:['Doodles count. Mine are mostly gamma diagrams.']}]},
   {open:['You took a break before you burned out. That’s, honestly, really smart.'],opts:[
    {t:'I am committed to steady work.',r:['Steady wins. Every time. Trust me on this one.']},
    {t:'I just needed a snack.',r:['Snacks are science. Low blood sugar is how things get smashed.']}]},
   {open:['You cleared the inbox. All of it? Wow. Okay. That’s better than my lab.'],opts:[
    {t:'I’ll keep it clean.',r:['Good. Clean desk, calm mind. Mostly.']},
    {t:'I archived half without reading.',r:['That’s, um, a strategy. Not a bad one.']}]}],
  codex:'You wrote this down. Let’s, uh, read it again. Calmly.',
  ack:'Good. Steady. That’s the way.',
  done:{open:['Everything done? No smashing? Wow. That’s a good day for both of us.'],opts:[
   {t:'Again tomorrow, doc.',r:['Same time. I’ll bring the chamomile.']},
   {t:'I wanted to smash once.',r:['Me too. Every day. We didn’t. That’s the win.']}]}},

 // ---------------- Peter Parker (Home) ----------------
 peter:{
  cheers:[
   {open:['You took out the trash! On trash night! Do you know how many times Aunt May yelled at me about that?'],opts:[
    {t:'Every trash night. I’ve got it.',r:['Okay, you’re officially more responsible than me. Don’t tell May.']},
    {t:'It smelled terrible.',r:['They always do. That’s how you know it’s heroic.']}]},
   {open:['Dishes done before bed? Dude. I usually web them to the ceiling and forget.'],opts:[
    {t:'Clean sink every night.',r:['Look at you. Neighborhood friendly dishwasher.']},
    {t:'Webbing them sounds easier.',r:['It is not. Ask May. She’s still mad.']}]},
   {open:['You fixed the squeaky door! I heard it! Okay, I didn’t hear it. That’s the point!'],opts:[
    {t:'I am committed to the fix-it list.',r:['Responsibility, man. It’s mostly squeaky doors.']},
    {t:'I used too much WD-40.',r:['There’s no such thing. Okay, there is. But still.']}]},
   {open:['* He hangs upside down from the porch beam.','Laundry folded? Actually folded? Not just dumped in a pile? Wow.'],opts:[
    {t:'I’ll fold again tomorrow.',r:['That’s amazing. I can’t fold a fitted sheet. Nobody can.']},
    {t:'I gave up on the fitted sheet.',r:['Same. It’s the real villain.']}]}],
  codex:'Hey, you wrote this down! Like a to-do list from your past self. Read it again!',
  ack:'Awesome. With great chores comes great… yeah, you know.',
  done:{open:['Everything done? All of it? Okay. You’re, like, way better at this than me.'],opts:[
   {t:'Tomorrow too. Count me in.',r:['Then I’ll swing by and see. Maybe help. Maybe.']},
   {t:'Can you do my chores next time?',r:['I would, but I’m behind on May’s. Sorry!']}]}},

 // ---------------- Piotr Rasputin (Home) ----------------
 piotr:{
  cheers:[
   {open:['* He wipes his hands on an apron.','You swept the porch. Good. My mother swept every morning. The farm was poor, but clean.'],opts:[
    {t:'Every morning. I promise.',r:['Good. A home you sweep is a home you love.']},
    {t:'There was a lot of dust.',r:['There is always dust. That is why we sweep, my friend.']}]},
   {open:['You fixed the leaking faucet? With your own hands? I am very proud. Truly.'],opts:[
    {t:'I am committed to fixing things.',r:['Good. A man who fixes things is a man people trust.']},
    {t:'I watched a video first.',r:['That is fine. I learned borscht from a book.']}]},
   {open:['You made the bed. Corners and all? Please say corners and all.'],opts:[
    {t:'Corners. Tomorrow too.',r:['Ah. You are a good man. I knew it.']},
    {t:'Mostly corners.',r:['Mostly is a start. We work on the rest.']}]},
   {open:['You cooked dinner for the family. I could smell it from the Workshop. It smelled like home.'],opts:[
    {t:'I’ll cook again this week.',r:['Good. Food is love you can eat. My mother said that.']},
    {t:'It was a frozen pizza.',r:['Pizza is still dinner. You put it in the oven. That counts.']}]}],
  codex:'You wrote this. Please, read it again. It is good to remember.',
  ack:'Good. Now we keep the house tidy, yes?',
  done:{open:['Every task done. The house is happy. I am happy. Even my steel skin is happy.'],opts:[
   {t:'We do it again tomorrow.',r:['Yes. Together. Like family.']},
   {t:'Is there borscht?',r:['There is always borscht. Come, I made a pot.']}]}},

 // ---------------- Kaladin (Discipline) ----------------
 kaladin:{
  cheers:[
   {open:['You left the phone in the other room. That’s harder than carrying a bridge. I would know.'],opts:[
    {t:'Tomorrow too. I keep my word.',r:['Good. Syl’s going to be smug about you. Brace yourself.']},
    {t:'I checked it once.',r:['Once is better than twenty. Progress is progress.']}]},
   {open:['You got up on time on a grey day. When you didn’t feel like it. That’s the one that counts.'],opts:[
    {t:'I’ll get up again tomorrow.',r:['Then I’ll be up too. We do it together.']},
    {t:'I felt awful.',r:['I know that feeling. You did it anyway. That’s the whole thing.']}]},
   {open:['* Syl zips around your head like a ribbon of light.','You stuck to the routine. Syl says she’s proud. I am too. Don’t tell her I said it.'],opts:[
    {t:'I am committed to the routine.',r:['Good. Routines carried me out of the chasm.']},
    {t:'Tell her thanks.',r:['She heard. She’s doing loops now. Great.']}]},
   {open:['You said no to the extra screen time. Small step. They always are. Then one day you’re flying.'],opts:[
    {t:'One more step tomorrow.',r:['Then the next one. That’s how you climb.']},
    {t:'It was a really good show.',r:['I believe you. You still turned it off. That’s strength.']}]}],
  codex:'You wrote this. Read it again. Sometimes your own words are the ones you need.',
  ack:'Good. Words you keep on a grey day weigh the most. Syl agrees.',
  done:{open:['Every task done. On a day like this one. Syl’s crying. Okay, I might be too.'],opts:[
   {t:'Again tomorrow, brother.',r:['Then I’ll be there. Always.']},
   {t:'Are you actually crying?',r:['It’s the highstorm. Probably.']}]}},

 // ---------------- Stephen Strange (Discipline) ----------------
 stephen:{
  cheers:[
   {open:['* He flicks a spark of orange light from his fingers.','You stuck to your morning routine. Fourteen million futures and in most of them you skip it. Not this one.'],opts:[
    {t:'Tomorrow too. I’m in.',r:['Good. You just shifted the odds. Slightly.']},
    {t:'Only most of them?',r:['Don’t ask about the rest. You won’t like them.']}]},
   {open:['You read for thirty minutes instead of scrolling. Wong would approve. Wong never approves.'],opts:[
    {t:'I’ll keep reading.',r:['Good. Kamar-Taj wasn’t built on scrolling.']},
    {t:'It was a comic book.',r:['Reading is reading. Mostly. Don’t tell Wong.']}]},
   {open:['You meditated for ten minutes. I couldn’t do one without complaining. My ego was louder then.'],opts:[
    {t:'I am committed to the basics.',r:['Good. Mastery is repetition. Boring, infuriating repetition.']},
    {t:'I fell asleep.',r:['That counts as a very deep state. Technically.']}]},
   {open:['You went to bed on time. No arguments. A rare act of self-control. I’m genuinely impressed.'],opts:[
    {t:'Lights out on time again.',r:['Good. A tired mind makes bad spells.']},
    {t:'I argued a little.',r:['With yourself? Normal. I argue with myself constantly.']}]}],
  codex:'Your notes. Read them again. Even I review mine. Occasionally.',
  ack:'Good. The basics, done.',
  done:{open:['Every task done. I’ve looked at the timelines. This is one of the good ones.'],opts:[
   {t:'Let’s make tomorrow a good one too.',r:['That’s the plan. I’ll keep an eye on it.']},
   {t:'Show me the bad ones.',r:['No. Some things you don’t need to see.']}]}},

 // ---------------- Anakin Skywalker (Discipline) ----------------
 anakin:{
  cheers:[
   {open:['You stayed on task without rushing? I can never do that. Obi-Wan used to lecture me for hours.'],opts:[
    {t:'Tomorrow too. Patience.',r:['Patience. Right. You make it sound easy. It isn’t.']},
    {t:'You’d lose patience on hour one.',r:['Hour one? Try minute one. Don’t tell Obi-Wan.']}]},
   {open:['You kept the boundary. Didn’t say yes to everything. That takes more control than piloting a podracer.'],opts:[
    {t:'I’ll hold the line.',r:['Good. I never could. Maybe you can show me.']},
    {t:'I almost caved.',r:['Almost isn’t caving. I know the difference. Trust me.']}]},
   {open:['* He paces, restless.','You stuck to your schedule. All day. How? Teach me.'],opts:[
    {t:'I am committed to the schedule.',r:['Then I’ll try too. No promises. Okay, one promise.']},
    {t:'Lots of coffee.',r:['That’s not discipline. That’s chemistry.']}]},
   {open:['You turned off the screens when you said you would. That’s, uh, actually impressive.'],opts:[
    {t:'Same time tomorrow.',r:['I’ll hold you to it. And myself. Maybe.']},
    {t:'It was hard.',r:['The hard ones are the ones that count. Obi-Wan said that.']}]}],
  codex:'You wrote this down. Read it again. I should do that more.',
  ack:'Good. Control. I’m working on it too.',
  done:{open:['Everything done. You did it calmly. Without rushing. I’m almost jealous.'],opts:[
   {t:'We’ll do it again tomorrow.',r:['Together. Slowly. I’ll try.']},
   {t:'Almost?',r:['Fine. Completely jealous.']}]}},
};
