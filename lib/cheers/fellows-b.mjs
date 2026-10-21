// Cheers, Fellows batch B: task-completion pop-ups. See docs/WRITING-BRIEF.md "Cheers".
// M = {open:['1-2 lines'], opts:[{t:'player reply', r:['one-line answer']} x2]}

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Ash (Hobbies) ----------------
 ash:{
  cheers:[
   {open:['Whoa, you actually made time for the fun stuff today! Pikachu, did you see that?','* Pikachu’s ears go straight up.'],
    opts:[
     {t:'Same time tomorrow!',r:['Yes! That’s the spirit! Pikachu, we’ve got a rival now!']},
     {t:'Pikachu was watching?',r:['He’s always watching. He judges me when I skip training too.']}]},
   {open:['I’ve been chasing the same dream since I was ten. You know what keeps it fun? Doing a little every day.'],
    opts:[
     {t:'I’m in it for the long haul.',r:['Then we’re gonna be the very best! Okay, maybe second best. After me.']},
     {t:'Since you were ten? For how long?',r:['Honestly? I’ve lost count. Time’s weird in Pallet Town.']}]},
   {open:['You’re getting better at this! I can tell. You’ve got that look Brock gets before he cooks something amazing.'],
    opts:[
     {t:'Next round’s mine.',r:['Ha! Bring it! I never turn down a battle!']},
     {t:'Is Brock’s cooking really that good?',r:['Best I’ve ever had. Don’t tell my mom.']}]},
   {open:['Hey, slow down a sec. Did you have fun? Like, actually fun?','Because that’s the whole point.'],
    opts:[
     {t:'I really did.',r:['Then you’re doing it right! Same thing tomorrow, deal?']},
     {t:'Mostly I lost.',r:['I lost my first league too. And my second. Losing is just practice with a scoreboard.']}]},
  ],
  codex:'Hey! You wrote this down a while back. It’s like a badge. Read it again!',
  ack:'Alright! That’s what I’m talking about!',
  done:{open:['Every single thing today? All of it?!','Pikachu, Thunderbolt! No, not at them! Celebrate!'],
   opts:[
    {t:'I am committed!',r:['I knew it! You’ve got the heart of a champion, {name}!']},
    {t:'Please don’t Thunderbolt me.',r:['He only does it to people he likes. Mostly me.']}]},
 },

 // ---------------- Harry (Hobbies) ----------------
 harry:{
  cheers:[
   {open:['You took an hour for yourself. Good. I spent eleven years in a cupboard, so I’m fairly big on that.'],
    opts:[
     {t:'Same again tomorrow.',r:['Brilliant. Ron will want to know your secret. Tell him it’s just turning up.']},
     {t:'A cupboard? Really?',r:['Under the stairs. Spiders and all. Long story. Go enjoy your evening.']}]},
   {open:['Ginny says I’m impossible after a Sunday Quidditch game. Too happy. You’ve got the same face right now.'],
    opts:[
     {t:'Count me in for next Sunday.',r:['Keeper position’s open. Ron’s been dropping the Quaffle again.']},
     {t:'I don’t fly, mate.',r:['Nobody does at first. Neville fell off his broom on day one. Look at him now.']}]},
   {open:['Hermione would say you learned something today. I’d say you had fun. We’re both right, annoyingly.'],
    opts:[
     {t:'I’m keeping this going.',r:['Good. I’ll tell Hermione. She’ll make a revision schedule for you. Sorry in advance.']},
     {t:'Please don’t tell Hermione.',r:['Too late. She already knows. She always knows.']}]},
   {open:['I catch dark wizards all week. Know what saves me? Doing something daft and fun on purpose.'],
    opts:[
     {t:'I’ll keep making time for it.',r:['Good man. Fun’s not extra. It’s what keeps you sane.']},
     {t:'Like what?',r:['Last week? Wizard chess with Ron. Lost horribly. Best night all month.']}]},
  ],
  codex:'You wrote this. Bit like reading your own Marauder’s Map. Have a look.',
  ack:'Yeah. That’s it, mate.',
  done:{open:['Everything ticked off. Proper Gryffindor stuff, that.','Butterbeer’s on me at the Three Broomsticks. Well. The Inn. Close enough.'],
   opts:[
    {t:'Tomorrow too.',r:['Knew you’d say that. Ron owes me a Sickle.']},
    {t:'Make it a large one.',r:['Large it is. Just don’t tell Madam Rosmerta I said the Inn’s better.']}]},
 },

 // ---------------- Thor (Hobbies) ----------------
 thor:{
  cheers:[
   {open:['HA! You did a thing purely for joy! That is the Asgardian way!','* He thumps you on the back. It hurts.'],
    opts:[
     {t:'Another!',r:['ANOTHER! Yes! You understand me perfectly!']},
     {t:'Ow. My spine.',r:['Sorry. I forget my own strength. Mostly on purpose.']}]},
   {open:['On Asgard we feasted, we sparred, we told outrageous stories. You’re doing the Midgard version. I approve.'],
    opts:[
     {t:'Same time tomorrow, Odinson.',r:['Then I shall prepare a rematch! Bring snacks.']},
     {t:'Outrageous how?',r:['I once told Loki I fought a dragon. He stabbed me. Classic brother stuff.']}]},
   {open:['You know what my father never understood? A king needs play too. Otherwise he gets grumpy. And then wars happen.'],
    opts:[
     {t:'I’m committed to the fun.',r:['A noble oath! I shall hold you to it with my hammer. Gently.']},
     {t:'So fun prevents wars?',r:['Mostly. The rest Valkyrie handles with a sword.']}]},
   {open:['I tried your Midgardian game with the little controller. I was terrible. I loved it. Did you have fun today?'],
    opts:[
     {t:'Loads. More tomorrow.',r:['Excellent! We’ll go together. I will lose loudly.']},
     {t:'Which game?',r:['Something with a plumber. I threw the controller. Banner made me apologize to it.']}]},
  ],
  codex:'You carved these words yourself, friend! Like runes! Read them aloud!',
  ack:'HA! Well spoken!',
  done:{open:['Every task, conquered! This calls for a feast!','I’ll get the mead. You get the… actually I’ll get everything.'],
   opts:[
    {t:'I am committed!',r:['YES! That’s what heroes say! Sit, eat!']},
    {t:'Just a small feast.',r:['There is no such thing. But I’ll pretend for you.']}]},
 },

 // ---------------- Uther (Faith) ----------------
 uther:{
  cheers:[
   {open:['You knelt today. Good. The Light doesn’t ask for grand speeches. It asks you to show up.'],
    opts:[
     {t:'By the Light, tomorrow too.',r:['Then I’ll expect you at dawn. Don’t make me come looking.']},
     {t:'Even when I’m tired?',r:['Especially then. I prayed in plate armor with a cracked rib once. You’ll live.']}]},
   {open:['Most men pray when the town is burning. You prayed on a quiet Tuesday. That’s rarer.'],
    opts:[
     {t:'Every day. Not just bad ones.',r:['Spoken like a paladin of the Silver Hand. Mean it, and keep meaning it.']},
     {t:'It’s Wednesday, actually.',r:['Hmph. Arthas used to correct me too. Never mind.']}]},
   {open:['* Uther nods once, the closest he gets to applause.','The gratitude you wrote down. Keep writing it. Hearts go hard without it.'],
    opts:[
     {t:'I’ll keep at it.',r:['I know you will. That’s why I bothered nodding.']},
     {t:'Was that a smile?',r:['No. A paladin’s face does not smile. It merely… unclenches.']}]},
   {open:['You read scripture before your phone this morning. I noticed. Light knows I wish more of my knights had.'],
    opts:[
     {t:'Phone stays down. Light first.',r:['Good. A man’s first words of the day shape the rest of them.']},
     {t:'Your knights had phones?',r:['No. They had ale and gossip. Same problem.']}]},
  ],
  codex:'You wrote this, in your own hand. A man should keep his own vows. Read it.',
  ack:'Then hold to it. I’ll be watching.',
  done:{open:['Every duty done today. I don’t say this often.','Well fought, {name}.'],
   opts:[
    {t:'I stand with the Light.',r:['And it stands with you. Rest well. Rise early.']},
    {t:'Say it again, slower.',r:['Absolutely not. Once a day is my limit.']}]},
 },

 // ---------------- Saradomin (Faith) ----------------
 saradomin:{
  cheers:[
   {open:['* The light softens around you.','Thank you for talking with me, little one. I liked that part about your kids.'],
    opts:[
     {t:'I’ll talk with you again tomorrow.',r:['I’ll be here. I’m always here. It’s rather the job.']},
     {t:'You were listening to that?',r:['To every word. Even the one you sneezed through.']}]},
   {open:['Falador’s knights polish their armor every morning. You polished your heart instead. Better use of time.'],
    opts:[
     {t:'Keep my faith polished. Got it.',r:['Lovely. It doesn’t need to shine. It just needs to be cared for.']},
     {t:'My armor’s a bathrobe.',r:['So was mine for an age or two. Nobody tells you that about gods.']}]},
   {open:['You said thank you today. For small things. The coffee. The quiet. That pleased me more than a cathedral.'],
    opts:[
     {t:'More thank-yous tomorrow.',r:['Then tomorrow will be a good day before it even starts.']},
     {t:'The coffee was really good.',r:['I know. I helped. Don’t tell Guthix.']}]},
   {open:['I don’t need you to be great, little one. I need you faithful. Today you were.'],
    opts:[
     {t:'Faithful it is.',r:['Then we understand each other perfectly.']},
     {t:'Great would be nice too.',r:['* He laughs.','Faithful first. Great tends to wander in afterward.']}]},
  ],
  codex:'You wrote this, once, in a quieter hour. I kept it safe for you.',
  ack:'Good. I’ll hold you to it, gently.',
  done:{open:['* Saradomin sits on the step beside you as the sun goes down.','Everything done. Order, kept. Rest now, little one.'],
   opts:[
    {t:'I’ll be faithful tomorrow too.',r:['I know. I’ve already seen it. It’s lovely.']},
    {t:'Can gods get tired?',r:['Only of Zamorak. Never of you.']}]},
 },

 // ---------------- Malfurion (Marriage) ----------------
 malfurion:{
  cheers:[
   {open:['You spent real time with her today. Not distracted time. Real.','I slept ten thousand years once. Tyrande still reminds me.'],
    opts:[
     {t:'I’m not sleeping through mine.',r:['Good. Wake up every day and choose her. That’s the whole secret.']},
     {t:'Ten thousand? Seriously?',r:['Give or take. The Emerald Dream is bad at clocks.']}]},
   {open:['* An owl lands on Malfurion’s antler. He ignores it.','You listened to her today. Actually listened. Tyrande would approve. She does not approve of much.'],
    opts:[
     {t:'I’ll keep listening.',r:['Then you are already wiser than I was for most of my life.']},
     {t:'There’s an owl on your head.',r:['He comes and goes. Like my sense of humor.']}]},
   {open:['A marriage is like a grove. Ignore it a season and it doesn’t die. But it notices.'],
    opts:[
     {t:'I tend it every day.',r:['Then it will grow taller than you ever expected.']},
     {t:'That was your wise line, wasn’t it?',r:['It was. Tyrande lets me have one per day.']}]},
   {open:['Date night? Good. Go. Bring flowers. Not from my grove. I’ll know.'],
    opts:[
     {t:'Next date’s already planned.',r:['Look at you. Coming home before anyone has to come find you.']},
     {t:'Your grove has the best ones.',r:['* He sighs.','Take one. Just one. And tell her it’s from me.']}]},
  ],
  codex:'You wrote this about her once. Read it slowly. I wish I’d written more.',
  ack:'Good. Go home to her.',
  done:{open:['Every task finished. And the day is still young enough to spend with her.','Don’t waste it on me.'],
   opts:[
    {t:'Heading home now.',r:['That’s all I ever needed to hear. Go.']},
    {t:'You’re not that interesting anyway.',r:['Tyrande says the same. Usually with a bow drawn.']}]},
 },

 // ---------------- Thrall (Marriage) ----------------
 thrall:{
  cheers:[
   {open:['You put your wife ahead of your own plans today. I led a Horde. That was easier.'],
    opts:[
     {t:'She comes first. Always.',r:['Lok’tar. Aggra would like you. She doesn’t like anyone.']},
     {t:'Easier how?',r:['Armies take orders. Wives ask if you heard what they said. Different battle.']}]},
   {open:['Aggra told me once I was always talking and never listening. She was right. Took me a long time to admit it.','Sounds like you listened today.'],
    opts:[
     {t:'Listening more every day.',r:['Then you’re a better husband than most Warchiefs.']},
     {t:'Did you listen after that?',r:['Mostly. Ask her. Actually don’t.']}]},
   {open:['* Thrall sets down a carved wooden wolf, half-finished.','My son wanted one of these. My wife wanted me home to make it. Both got their wish. You understand.'],
    opts:[
     {t:'I’ll keep showing up for her.',r:['Good. Titles fade. She won’t forget the time you gave her.']},
     {t:'Can I have a wolf?',r:['Get in line behind Durak. He’s very serious about it.']}]},
   {open:['You did a small kind thing for her today. The elements noticed. So did I.'],
    opts:[
     {t:'More tomorrow, for her.',r:['For the Horde. No, wait. For her. Good.']},
     {t:'The elements are watching me?',r:['They watch everyone. Earth is a gossip.']}]},
  ],
  codex:'You wrote this. In your own words. Strong words. Read them again.',
  ack:'Lok’tar ogar, brother. Go to her.',
  done:{open:['Every task complete. Strength and honor.','Now set down your axe and go sit with your wife.'],
   opts:[
    {t:'For her, I’m committed.',r:['That’s the only oath that matters.']},
    {t:'I don’t own an axe.',r:['Then set down your phone. Same thing.']}]},
 },

 // ---------------- Cal (Marriage) ----------------
 cal:{
  cheers:[
   {open:['* BD-1 chirps from Cal’s shoulder.','BD says you did something nice for your wife. I say same. Nice work.'],
    opts:[
     {t:'Tomorrow too.',r:['BD’s already logging it. He’s very thorough.']},
     {t:'Tell BD thanks.',r:['* BD-1 does a little spin.','He says you’re welcome. He also wants a battery.']}]},
   {open:['I spent years running. Hiding. Then Merrin, Cere, Greez… they made me want to stay put.','You stayed put tonight. With her. That counts.'],
    opts:[
     {t:'I’m not running anymore.',r:['Yeah. Me neither. Feels good, right?']},
     {t:'Greez seems like a lot.',r:['Four arms, all of them pointing at the mess I left. He’s great.']}]},
   {open:['You put the phone down when she was talking. I saw. Small thing. Huge thing.'],
    opts:[
     {t:'Phone down, eyes up. Every time.',r:['That’s it. That’s the whole move.']},
     {t:'You were spying on me?',r:['BD was. I just get the reports.']}]},
   {open:['Date nights don’t have to be fancy. Merrin and I just sit on the Mantis roof and look at stars.'],
    opts:[
     {t:'Count me in for star-watching.',r:['Bring a blanket. Space roofs are cold.']},
     {t:'Is Merrin your girlfriend?',r:['Uh. We don’t really… okay, yeah. Probably.']}]},
  ],
  codex:'Hey. You wrote this about her. BD saved it. Take a look.',
  ack:'Yeah. That’s what matters.',
  done:{open:['That’s everything for today. BD’s doing his happy beep.','Go find her. I mean it.'],
   opts:[
    {t:'I am committed!',r:['* BD-1 beeps twice.','That means he believes you. So do I.']},
    {t:'What’s his sad beep like?',r:['You don’t want to know. Very dramatic droid.']}]},
 },

 // ---------------- Varian (Fatherhood) ----------------
 varian:{
  cheers:[
   {open:['You were there for your kids today. Really there.','I missed years of Anduin’s life. Don’t you dare miss yours.'],
    opts:[
     {t:'I won’t miss a day.',r:['Good. You’ll never regret the hours. Only the missing ones.']},
     {t:'You sound angry.',r:['At myself. Always. It keeps me honest.']}]},
   {open:['Anduin never liked swords. Liked books and the Light. Took me years to stop pushing and just be proud.'],
    opts:[
     {t:'Proud of mine every day.',r:['Tell them. Out loud. They need to hear it from you.']},
     {t:'Did you tell him?',r:['Eventually. Late. Do it sooner than I did.']}]},
   {open:['* Varian leans on his sword, Shalamayne, like a walking stick.','Bedtime story? Good. That’s more courage than the arena ever needed.'],
    opts:[
     {t:'Same story tomorrow night.',r:['Do the voices. Kids remember the voices.']},
     {t:'You did bedtime stories?',r:['Badly. Anduin corrected my history. Every time.']}]},
   {open:['You played with them. On the floor. In the mess. A king should be so lucky.'],
    opts:[
     {t:'I’m committed to them.',r:['Then you’re already more of a father than I was at your age.']},
     {t:'My knees disagree.',r:['A gladiator’s knees disagree with everything. Ignore them.']}]},
  ],
  codex:'You wrote this down about your children. Read it. Then go hug them.',
  ack:'Good man. Go on.',
  done:{open:['Every task done. Now no excuses.','Go spend the evening with your kids.'],
   opts:[
    {t:'For the Alliance. And them.',r:['For them first. The Alliance can wait.']},
    {t:'They’re asleep.',r:['Then check on them anyway. I wish I had.']}]},
 },

 // ---------------- Baine (Fatherhood) ----------------
 baine:{
  cheers:[
   {open:['My father said children learn from your feet, not your mouth. Where you walk, they follow.','Today you walked well.'],
    opts:[
     {t:'I’ll keep walking it.',r:['Then they’ll know the way when you’re not there.']},
     {t:'Your father sounds wise.',r:['Cairne was. I quote him too much. He’d laugh at me.']}]},
   {open:['* Baine sits on a log, slowly sharpening a small wooden spear for a child.','You gave your kids time. Without hurrying. That’s the gift.'],
    opts:[
     {t:'More time tomorrow.',r:['Good. Time is the only thing they’ll remember you giving.']},
     {t:'Who’s the spear for?',r:['A little one in Thunder Bluff. He’s fierce. I’m afraid of him.']}]},
   {open:['You were patient when they weren’t. I saw it. That’s hard.'],
    opts:[
     {t:'Patient again tomorrow.',r:['Earth Mother will give you the strength. I’ll give you a nod.']},
     {t:'Barely patient.',r:['Barely still counts. Cairne’s patience was barely, most days.']}]},
   {open:['Children hear what you say. But they keep what you do. You did good things today.'],
    opts:[
     {t:'I’m committed to them.',r:['I believe you. Cairne would too.']},
     {t:'Do you have kids?',r:['A whole people, in a way. They’re louder than you’d think.']}]},
  ],
  codex:'You put this into words once. My father would have kept it close. Read it.',
  ack:'Walk with the Earth Mother, friend.',
  done:{open:['All of it, done. A quiet evening is waiting for you.','Spend it with them.'],
   opts:[
    {t:'They’ll have all of me.',r:['Then they have more than enough.']},
    {t:'Can I bring a tauren pie?',r:['Bring two. One for the kids. One for whoever stays up.']}]},
 },

 // ---------------- Vannaka (Fitness) ----------------
 vannaka:{
  cheers:[
   {open:['Task done. Good. Don’t look at me like that. I’m not giving you a medal.'],
    opts:[
     {t:'Next task.',r:['That’s what I like to hear. Tomorrow, same time. Bring sweat.']},
     {t:'Not even a little one?',r:['No. Here’s a nod. That’s your medal.']}]},
   {open:['You worked out. Fine. Most adventurers whine about sore legs. I hate whiners.'],
    opts:[
     {t:'No whining. Tomorrow too.',r:['Good. You’re learning. Slowly.']},
     {t:'My legs are VERY sore.',r:['That’s them getting stronger. Stop whining.']}]},
   {open:['* Vannaka grunts, looking you up and down.','You’re less soft than last week. Barely.'],
    opts:[
     {t:'Count me in for harder.',r:['Hah. Careful what you ask for. I’ve got moss giants.']},
     {t:'Was that a compliment?',r:['No. It was an observation. Get out of my dungeon.']}]},
   {open:['Most of my adventurers quit after day three. You keep coming back. I don’t understand you.'],
    opts:[
     {t:'I am committed!',r:['Then stop talking and go do your stretches.']},
     {t:'I like your dungeon.',r:['It smells like goblins. You’re strange.']}]},
  ],
  codex:'You wrote this. Read it. Then go lift something heavy.',
  ack:'Good. Now move.',
  done:{open:['All tasks finished. Even the boring ones.','Get some sleep. Muscles grow in bed, not at the bar.'],
   opts:[
    {t:'New task tomorrow.',r:['Already writing it. You’ll hate it.']},
    {t:'Can I have a cookie?',r:['One. Eat it slowly. I’m watching.']}]},
 },

 // ---------------- Magni (Work) ----------------
 magni:{
  cheers:[
   {open:['Ha! Got yer work done, did ye? That’s the way, lad!','One honest swing after another. That’s how ye make a good blade.'],
    opts:[
     {t:'Next swing.',r:['Aye! That’s what I like to hear!']},
     {t:'My arm’s tired.',r:['Ale’ll fix that. Or rest. Mostly ale.']}]},
   {open:['* Magni wipes soot off his beard.','Ye didn’t rush it today. Good. Rushed work cracks in the cold.'],
    opts:[
     {t:'Steady work, every day.',r:['That’s a dwarf’s motto right there. I’ll have it carved.']},
     {t:'Is that soot or beard?',r:['Both. Always both.']}]},
   {open:['Azeroth herself told me ye worked well today. She doesn’t compliment many. Mostly she grumbles.'],
    opts:[
     {t:'Count me in tomorrow.',r:['Good lad! I’ll tell her. She’ll grumble happily.']},
     {t:'The planet talks to you?',r:['Aye, constantly. I can’t get a moment’s peace.']}]},
   {open:['Ye’re saving yer coin, aren’t ye? Smart. Ironforge wasn’t built by spendin’ it all on mead.'],
    opts:[
     {t:'Saving more tomorrow.',r:['Ha! Ye’ve the makings of a dwarf banker!']},
     {t:'Some on mead.',r:['Well, some. A dwarf’s not made of stone. Not anymore.']}]},
  ],
  codex:'Ye wrote this yerself, lad. Sturdy words. Read ’em again.',
  ack:'That’s the spirit! Now back to the forge.',
  done:{open:['Every job done! The forge can cool off for the night.','Pull up a stool. First round’s mine.'],
   opts:[
    {t:'I am committed!',r:['Ha! Spoken like a true son of Ironforge!']},
    {t:'Make mine a small one.',r:['Small? Ye wound me. I’ll pour it short. Ish.']}]},
 },

 // ---------------- Duradel (Work) ----------------
 duradel:{
  cheers:[
   {open:['Task complete. Good.'],
    opts:[
     {t:'Next task.',r:['Hm. Ready when you are.']},
     {t:'That’s it?',r:['That is all I have for you. Results speak.']}]},
   {open:['* Duradel nods once.','You finished the hard part first. Smart.'],
    opts:[
     {t:'Hard part first, always.',r:['Then you’ll outlast most I train.']},
     {t:'Was that a nod?',r:['It was.']}]},
   {open:['Three hours of deep work. No interruptions. I noticed.'],
    opts:[
     {t:'Tomorrow, four.',r:['Bold. I’ll hold you to it.']},
     {t:'You were counting?',r:['I count everything. It is my job.']}]},
   {open:['You did what you said. Rare.'],
    opts:[
     {t:'I keep my word.',r:['Good. That is the only skill I value.']},
     {t:'Rare how?',r:['Most adventurers who climb to Shilo die. You keep showing up alive.']}]},
  ],
  codex:'You wrote this. Read it. Then work.',
  ack:'Good.',
  done:{open:['All tasks done. Rest.'],
   opts:[
    {t:'Same tomorrow.',r:['Then we’ll get along.']},
    {t:'Any praise?',r:['That was praise.']}]},
 },

 // ---------------- Dumbledore (Home) ----------------
 dumbledore:{
  cheers:[
   {open:['A tidy kitchen! Do you know, I once spent three days trying to charm my socks into folding themselves. They revolted.'],
    opts:[
     {t:'Doing it again tomorrow.',r:['Splendid. You’ll be a better housekeeper than any wizard I know.']},
     {t:'They revolted?',r:['Utterly. Aberforth still laughs about it.']}]},
   {open:['You fixed something around the house today. That matters more than you think.','Home is where people feel safe. Every repair is a promise.'],
    opts:[
     {t:'Keeping that promise every day.',r:['Then you’re wiser than I was at your age.']},
     {t:'That was very deep.',r:['I’m allowed one deep line per conversation. That was it.']}]},
   {open:['* Young Albus stands in your doorway with a book under his arm.','You did the dishes. I always forgot. My sister noticed. I wish I hadn’t forgotten.'],
    opts:[
     {t:'I won’t forget.',r:['Good. Do it for the people under your roof.']},
     {t:'What book is that?',r:['Something on transfiguration. And one on sock rebellions.']}]},
   {open:['Little chores build a big home, I’ve found. Took me longer than it should have to learn that.'],
    opts:[
     {t:'Count me in on the little chores.',r:['Excellent! I’ll find you a self-sweeping broom. Partly self-sweeping.']},
     {t:'Can you charm my laundry?',r:['I could. But it would revolt too. Better to do it yourself.']}]},
  ],
  codex:'Ah! Your own words. A bit like a Pensieve. Have a look.',
  ack:'Splendid. Off you go then.',
  done:{open:['Everything finished! Your home will sleep soundly tonight.','So should you.'],
   opts:[
    {t:'Tomorrow, the same.',r:['I believe you. I usually do.']},
    {t:'Lemon drop?',r:['* He produces one from nowhere.','Always.']}]},
 },

 // ---------------- Deadpool (Home) ----------------
 deadpool:{
  cheers:[
   {open:['YOU DID THE DISHES?! Okay. Okay. I need a moment. I’ve been in apartments where the dishes have dishes.'],
    opts:[
     {t:'Doing them again tomorrow!',r:['A man of commitment! Swoon. Don’t tell Vanessa.']},
     {t:'Your apartment sounds gross.',r:['It’s a crime scene. Literally. Twice.']}]},
   {open:['Folded laundry! Little corners! Do you know what I fold? Nothing. Wolverine folds my stuff. Under protest.'],
    opts:[
     {t:'I’m committed to the folding!',r:['Say that again. Slower. Into the camera.']},
     {t:'Wolverine folds your laundry?',r:['He’s great at it. Very gentle claws. Don’t tell him I said gentle.']}]},
   {open:['* Wade pops up from behind the couch with a vacuum.','Hey! You cleaned the house! I helped. By watching. And narrating. Mostly narrating.'],
    opts:[
     {t:'Count me in tomorrow.',r:['Tomorrow! Same channel! Bring snacks. I ate yours.']},
     {t:'Is that vacuum plugged in?',r:['It doesn’t need to be. It’s a prop. Like my self-esteem.']}]},
   {open:['Okay serious face. You took out the trash without being asked. That’s, like, ninety percent of marriage.'],
    opts:[
     {t:'Without being asked. Always.',r:['That’s my guy. Okay serious face over.']},
     {t:'What’s the other ten?',r:['Remembering anniversaries. And chimichangas.']}]},
  ],
  codex:'Oh look, you wrote something sincere! Read it. I’ll pretend not to cry.',
  ack:'Aww. Okay. I’m crying. It’s fine.',
  done:{open:['EVERYTHING DONE! The whole list! You know what this means?','Chimichangas. It always means chimichangas.'],
   opts:[
    {t:'I am committed!',r:['To chimichangas? Same. Also to the house. Mostly chimichangas.']},
    {t:'It doesn’t mean that.',r:['It always means that. Read the fine print.']}]},
 },

 // ---------------- Revan (Discipline) ----------------
 revan:{
  cheers:[
   {open:['You kept to your routine today. I lost my memory once. Had to rebuild myself from nothing.','Routines help. Trust me.'],
    opts:[
     {t:'Same routine tomorrow.',r:['Good. Every day you choose it, it gets easier to choose.']},
     {t:'From nothing?',r:['Nothing but a name and a ship. Long story. Bastila tells it better.']}]},
   {open:['* Revan pulls his mask off, sets it on the table.','You put the phone down when you said you would. That’s the whole fight, right there.'],
    opts:[
     {t:'I’ll put it down again tomorrow.',r:['Then you’re winning. Slowly. That’s the only way.']},
     {t:'Why the mask?',r:['Habit. Bad one. I’m working on it.']}]},
   {open:['I fell once. Hard. Getting up didn’t happen once. It happened every morning.'],
    opts:[
     {t:'Every morning. I’m in.',r:['Good. I’ll meet you at the start of each one.']},
     {t:'You fell? Off what?',r:['The light side. And once off the Ebon Hawk. HK-47 laughed.']}]},
   {open:['You skipped the scroll tonight. I noticed. Small choice. Big pattern.'],
    opts:[
     {t:'Light side, every time.',r:['Not every time. But more often than not. That’s enough.']},
     {t:'Scroll is fine sometimes.',r:['Sometimes. Just make sure you choose it. Don’t let it choose you.']}]},
  ],
  codex:'You wrote this when your head was clear. Read it. Remember who you chose to be.',
  ack:'Good. Hold to that.',
  done:{open:['Everything done. Every choice made.','That’s who you are now.'],
   opts:[
    {t:'I choose it again tomorrow.',r:['Then I’ll see you there.']},
    {t:'Can I have the mask?',r:['No. Get your own bad habits.']}]},
 },

 // ---------------- Wise Old Man (Hobbies) ----------------
 wiseoldman:{
  cheers:[
   {open:['Splendid! You learned something new today! Being a beginner is the finest thing there is, lad.'],
    opts:[
     {t:'More tomorrow!',r:['That’s the spirit! I’ll find you a cape. Eventually.']},
     {t:'I felt pretty clumsy.',r:['Good! Clumsy means you’re learning. I fell in the river fishing for years.']}]},
   {open:['* He holds up a fishing rod, a book and a rune all at once.','Do you know how many hobbies I have? All of them. Because I couldn’t stop.'],
    opts:[
     {t:'I can’t stop either.',r:['Ha! Then we’re a matched set!']},
     {t:'How do you hold all that?',r:['Practice. And three hands. Don’t ask about the third.']}]},
   {open:['You read a chapter tonight! I can tell. You’ve got that look. Smug and sleepy.'],
    opts:[
     {t:'Another chapter tomorrow.',r:['Excellent. Don’t skip ahead. I always skip ahead.']},
     {t:'Mostly sleepy.',r:['That’s how the best chapters end. Off to bed now.']}]},
   {open:['Ninety-nine in fishing took me forever. Wouldn’t trade a minute.','Keep at it, lad.'],
    opts:[
     {t:'Count me in.',r:['Wonderful. We’ll go fishing together. You bring the bait.']},
     {t:'Ninety-nine what?',r:['Levels, lad. Levels. Ask me about Runecrafting sometime.']}]},
  ],
  codex:'You wrote this down! Like a quest log! Read it again!',
  ack:'Ha! Wonderful!',
  done:{open:['Everything finished today! You’ve earned a nap. Or a new hobby.','Both, ideally.'],
   opts:[
    {t:'Tomorrow, more learning.',r:['That’s the spirit! I’ll prepare a book.']},
    {t:'Nap first.',r:['Wise choice. I’m napping too. Right here, in fact.']}]},
 },

 // ---------------- Rocket (Hobbies) ----------------
 rocket:{
  cheers:[
   {open:['You built somethin’ today? Huh. Not bad. For a human.'],
    opts:[
     {t:'Building more tomorrow.',r:['Yeah, yeah. Bring the good screwdriver this time.']},
     {t:'Is that a compliment?',r:['Don’t get used to it.']}]},
   {open:['* Rocket tosses you a gear.','Here. You made time for your hobby. Most guys just whine about not havin’ time.'],
    opts:[
     {t:'Count me in, Rocket.',r:['Good. Tomorrow we build a bomb. A fun bomb.']},
     {t:'What’s this gear for?',r:['No idea. That’s the best part.']}]},
   {open:['Learnin’ new stuff? Smart. Groot learned three words. Took years. Still uses ’em.'],
    opts:[
     {t:'Learning more tomorrow.',r:['Good. Don’t take as long as Groot.']},
     {t:'Three words?',r:['Well, the same three. In different orders. Mostly.']}]},
   {open:['You played a game today, didn’t ya? Just for fun? Nice.','Quill plays his tapes. You play yours.'],
    opts:[
     {t:'I am committed!',r:['Committed to havin’ fun? That’s my kinda guy.']},
     {t:'What tapes?',r:['Awesome Mix. He won’t shut up about it.']}]},
  ],
  codex:'Ya wrote this. Read it. Then go build somethin’.',
  ack:'Yeah, yeah. Good.',
  done:{open:['Everything done? Whoa. Didn’t expect that.','Guess I owe Drax five credits.'],
   opts:[
    {t:'Same tomorrow.',r:['Ugh. Then I owe him ten.']},
    {t:'You bet against me?',r:['Always. I bet against everyone. Keeps life interesting.']}]},
 },

 // ---------------- Dalinar (Discipline) ----------------
 dalinar:{
  cheers:[
   {open:['You kept your discipline today. I noticed.','Navani says I notice too much.'],
    opts:[
     {t:'Tomorrow too.',r:['Good. One more day. That’s how it’s done.']},
     {t:'Navani’s probably right.',r:['She usually is. Don’t tell her.']}]},
   {open:['* Dalinar sets down a cup of water. Only water.','You said no to something today. Small refusal. Still counts.'],
    opts:[
     {t:'Saying no again tomorrow.',r:['Every no is a step. I’ve taken thousands. Still taking them.']},
     {t:'Just water?',r:['Just water. For many years now. Some days it’s still a fight.']}]},
   {open:['You held the line on your phone. I know how that pull feels. Mine was wine. And war.'],
    opts:[
     {t:'I’m holding the line.',r:['Then stand with me. One more step.']},
     {t:'Which was worse?',r:['Both. The Thrill was louder. The wine was quieter. Quiet ones are harder.']}]},
   {open:['You followed your routine today. Even when it was boring.','I used to hate boring. Now boring keeps me alive.'],
    opts:[
     {t:'Count me in on boring.',r:['Ha. You’re a strange recruit. I like it.']},
     {t:'Is war boring?',r:['Not boring. Just exhausting. Routine is gentler.']}]},
  ],
  codex:'You wrote this. In your own hand. Read it slowly.',
  ack:'Good. Then we take the next step together.',
  done:{open:['Everything done today. Every refusal kept.','You’re becoming the man you chose to be.'],
   opts:[
    {t:'Another step tomorrow.',r:['Then I’ll walk it with you.']},
    {t:'Can I have wine now?',r:['* Dalinar slides a glass of water toward you.','Here. This is better.']}]},
 },

 // ---------------- Ragnar (Home) ----------------
 ragnar:{
  cheers:[
   {open:['Your house is cleaner, little brother. It breathes easier now.'],
    opts:[
     {t:'I’ll keep it breathing.',r:['Then it will hold you gently in winter.']},
     {t:'Houses breathe?',r:['Anything cared for breathes. Listen closely.']}]},
   {open:['* Ragnar carefully sweeps a corner with a tiny broom in his huge hand.','You fixed the leak. I heard. The home is grateful.'],
    opts:[
     {t:'Fixing more tomorrow.',r:['Good. A small repair today saves a flood tomorrow.']},
     {t:'That broom is tiny.',r:['It was a gift. From a child. I treasure it.']}]},
   {open:['You made your home a safe place today. Your family will feel that. Even if they don’t know why.'],
    opts:[
     {t:'Safe home, every day.',r:['Then they will sleep without fear. That is everything.']},
     {t:'They might notice the dishes.',r:['Ha. They will notice the dishes too.']}]},
   {open:['I was born for war. I chose a home instead. You chose your home today too.'],
    opts:[
     {t:'I am committed.',r:['Then we are brothers in this.']},
     {t:'Do you like war?',r:['No. I am good at it. I prefer to paint windowsills.']}]},
  ],
  codex:'You wrote this, little brother. Read it. Words are like walls.',
  ack:'Good. Keep your walls strong.',
  done:{open:['Everything done. The house is quiet. It rests.','So should you.'],
   opts:[
    {t:'I’ll care for it again tomorrow.',r:['I know you will. It knows too.']},
    {t:'Will you paint my windowsill?',r:['Only if you make tea.']}]},
 },

 // ---------------- Sevro (Fatherhood) ----------------
 sevro:{
  cheers:[
   {open:['You played with your kids today? Gorydamn right you did! Electra would love you.'],
    opts:[
     {t:'Tomorrow too!',r:['That’s the spirit! Howlers forever!']},
     {t:'Who’s Electra?',r:['My daughter. Terrifying. Beautiful. Bit like me.']}]},
   {open:['* Sevro hangs upside down from a branch.','Bedtime done. Voices and everything? Please say voices.'],
    opts:[
     {t:'Every voice. Every night.',r:['YES! The dragon voice is mandatory. Write that down.']},
     {t:'Just one voice.',r:['Weak. Do more voices. I do fifteen. Electra’s a critic.']}]},
   {open:['You know what nobody tells you about being a dad? It’s better than war. And louder.'],
    opts:[
     {t:'I’m all in on being a dad.',r:['Good. Kids don’t need perfect. They need you showing up loud.']},
     {t:'Louder than war?',r:['Way louder. War stops sometimes.']}]},
   {open:['You put the phone away when they wanted you. That’s a dad move, man.'],
    opts:[
     {t:'Phone down for them, always.',r:['Hell yeah. Darrow’s proud too. Pretty sure.']},
     {t:'I still checked it once.',r:['Once is fine. Twice and I bite you.']}]},
  ],
  codex:'Yo, you wrote this about your kids. Read it again. Then go tickle ’em.',
  ack:'Hell yes. Go get ’em.',
  done:{open:['Every task done. Every single one.','You absolute gorydamn legend.'],
   opts:[
    {t:'I am committed!',r:['Howlers forever, brother!']},
    {t:'Can I go to sleep now?',r:['Sleep? Dads don’t sleep. We just blink slower.']}]},
 },
};
