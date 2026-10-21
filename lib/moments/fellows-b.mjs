// Fellow moments, batch B: pop-ups when the player levels a Fellow (every 5th level) or gives him a star.
// Shape: {open:[lines], opts?:[{t, r:[lines]}]}. Lines starting "* " are narration.

/** @type {Record<string,{level:any[],star:any[]}>} */
export const FELLOW_MOMENTS={
 // ---------------- Tony (Work) ----------------
 tony:{
  level:[
   {open:['* Tony is elbow-deep in a half-built gauntlet in the Market’s back room. He tosses you a wrench without looking up.','Hold that. No, other end. Okay, you just outperformed my last three assistants. Low bar, but still.'],
    opts:[
     {t:'What are we building?',r:['No idea yet. That’s the fun part. You finish a piece, it tells you what the next piece is.']},
     {t:'Who were the other three?',r:['Dum-E, U, and Happy. Dum-E set me on fire once. Happy’s worse with a wrench. Don’t tell him.']}]},
   {open:['* He slides a cheeseburger across the counter at you. It’s still warm.','You paid for this upgrade with two solid hours of deep work, no email. I checked the ledger. Eat. Even geniuses need carbs.']},
   {open:['My first suit? Built in a cave, out of scrap and a box of missile parts, with a guy pointing a gun at me.','So, no, you don’t need the perfect desk. Start with the box of scraps.'],
    opts:[
     {t:'That’s a lot of pressure.',r:['Pressure’s just a deadline with better PR. You hit yours this week. Saw it. Mildly impressed. Don’t frame that.']},
     {t:'So I should work in a cave?',r:['God, no. The Wi-Fi’s terrible and the hosts are worse. Just quit rearranging your desk and build something.']}]},
   {open:['* Tony squints at a hologram of your work log and flicks it bigger.','See this line? Goes up. I love a line that goes up. Keep feeding it, {name}. FRIDAY, save that. I want to gloat later.']},
  ],
  star:[
   {open:['A star? For me? I mean, obviously deserved. But it’s nice when someone else does the noticing.','Here’s one back: you actually finish things. I have a garage full of half-built suits that say that’s rare.']},
   {open:['* He taps your chest twice, right where his arc reactor would sit.','You’ve got something running in there now. Steady output, low noise. Don’t let anybody tell you it’s small.'],
    opts:[
     {t:'Learned it from you.',r:['Flattery. Excellent. Keep it coming, it pairs nicely with the work.']},
     {t:'Some days it’s barely on.',r:['Mine too. Palladium poisoning, long story. Barely on still flies the suit. Keep it charged.']}]},
   {open:['I used to think I had to do it all myself. Design it, build it, fly it, crash it, fix it.','Then Pepper ran the company, Rhodey took a suit, and stuff actually got finished. You’re on my team now. Don’t make it weird.']},
   {open:['* Tony hands you a small, perfectly machined bolt with your initials laser-etched on the head.','First piece of your suit. Every time you close out real work, I add one. At this rate you’ll be fully armored by spring.'],
    opts:[
     {t:'That’s a lot of bolts.',r:['That’s the point. Go. I hate idle hands. Especially mine. Especially at three in the morning.']},
     {t:'Thanks, Tony. Really.',r:['Nope. Don’t. I’ll get emotional, and then I’ll have to build something to cope. Probably a toaster with lasers.']}]},
   {open:['* Late night in the workshop. The tools are quiet for once. Tony doesn’t look up from the bench.','Spent years building armor to keep people safe. Took me embarrassingly long to figure out the best thing I ever made was the people.','You’re one of them, {name}. Family. Don’t argue, I already ran the numbers. Twice.'],
    opts:[
     {t:'Brothers, then.',r:['* He finally looks up, grinning, goggles pushed onto his forehead.','Brothers. Now hand me the soldering iron before I get sappy all over the circuit board.']},
     {t:'You’ll make me cry on the circuitry.',r:['Join the club. I waterproofed it after the Pepper birthday incident. We don’t talk about it.']}]},
  ],
 },

 // ---------------- Kelsier (Work) ----------------
 kelsier:{
  level:[
   {open:['* Kelsier spreads a map across the café table, pinned down by two mugs and a single coin.','Every good job has three plans. The plan, the backup plan, and the one I don’t tell Dox. So. What’s your job this week?'],
    opts:[
     {t:'Get the hard project done.',r:['Lovely. Now slice it thin. One piece a day. Nobody robs a vault in one go. Well. I did once. Don’t copy me.']},
     {t:'I don’t really have one.',r:['Then that’s tonight’s heist. Ten minutes, a pencil, something to drink. Thieves plan. Marks hope.']}]},
   {open:['* He flicks a coin into the air, nudges it sideways with a little Allomantic push, and catches it.','You earned that gold the honest way. Odd thing to watch. I think I approve. Don’t tell Breeze.']},
   {open:['In Luthadel, smiling was practically a crime. So I smiled constantly. Drove the obligators mad.','Do your work well and cheerfully, my friend. It’s the most irritating thing you can do to a bad week.']},
   {open:['* Kelsier leans against the Market wall, watching traders haggle like he’s counting their pockets.','A crew lives or dies on whoever does the unglamorous part. Ham. Clubs. You, this week. I noticed.'],
    opts:[
     {t:'I’m not that quiet.',r:['No, you talk plenty. Your best work’s quiet, though. That’s the part that pays.']},
     {t:'Who’s the loudest?',r:['Me, obviously. Someone has to be the distraction. I’m very good at it. Ask the Lord Ruler.']}]},
  ],
  star:[
   {open:['A star. For a thief. You do know how to make a man feel respectable.','Don’t worry, it won’t go to my head. My head’s quite full already.']},
   {open:['* He hands you a folded note. A plan, in his elegant handwriting, with your name at the top.','Every job I’ve run had a part for someone I trusted. This one has yours. Don’t read the back. The back is for Dox.'],
    opts:[
     {t:'What’s my part?',r:['Do your piece every day and let the crew do theirs. When a crew holds, the impossible gets boring.']},
     {t:'You trust me?',r:['I trust what you do. Words are cheap. I’d know. I sell them.']}]},
   {open:['I survived the Pits of Hathsin. A place built to grind people into ash. I walked out laughing.','So your rotten Monday? Make it pay out. A bad day’s only wasted if you let it be.']},
   {open:['* Kelsier is quiet for once, watching the sun set over the rooftops. No ash falling here. He keeps glancing up anyway.','I’ve been plenty of things. Thief. Legend. Ghost story. Friend is the one I’ve had the least practice at.','Thanks for letting me practice.'],
    opts:[
     {t:'You’re good at it.',r:['Don’t spread that around. It ruins the mystique.']},
     {t:'Practice makes perfect.',r:['* He laughs, the real kind, not the one he uses on marks.','Throwing my own lines back at me. You’re learning.']}]},
   {open:['* He presses his old coin into your palm and folds your fingers over it.','There’s always another secret. Here’s my last one: I’d run every job again if it ended with a crew like this.','You’re my brother, {name}. That was the heist. We already pulled it off.'],
    opts:[
     {t:'Best job you ever ran.',r:['Best job I ever ran. And for once I didn’t steal a thing. Vin will be so disappointed.']},
     {t:'Keep the coin.',r:['No, you keep it. Flip it on the bad mornings. Heads, you work. Tails, you work smiling. It’s a rigged coin, by the way.']}]},
  ],
 },

 // ---------------- Bruce (Work) ----------------
 bruce:{
  level:[
   {open:['* Bruce is hunched over a notebook, pencil behind his ear, glasses sliding down his nose.','Oh. Hey. Sorry. I’ve been, uh, logging your work output. Purely scientific. You’re trending up. Nicely.'],
    opts:[
     {t:'Is that good?',r:['It’s consistent, which is better. Good is a spike. Consistent is a curve. I like curves. Data curves. Moving on.']},
     {t:'You log everything?',r:['Keeps me calm. Numbers don’t yell at you. Except Tony’s. Tony’s numbers yell.']}]},
   {open:['* Bruce hands you a mug of chamomile, holding his own with both hands.','When I feel the pressure building, I step away, breathe, count, then go back in. Try it before that big meeting tomorrow.']},
   {open:['Funny story. I once wrecked an entire lab because someone moved my coffee.','Well. Not funny for the lab. Point is, now I have routines, so I never have to find out how angry I can get.'],
    opts:[
     {t:'Who moved the coffee?',r:['Tony. It’s always Tony. He said he was “testing a hypothesis.”']},
     {t:'Routines saved you?',r:['Every day. Boring breakfast, same desk, notes at five. Yours are doing the same for you. You just can’t see it yet.']}]},
   {open:['* On a walk by the river, Bruce suddenly stops and smiles at nothing in particular.','Sorry. I just noticed I’m not stressed. That almost never happens. Finished work does that. You’ve been finishing a lot.']},
  ],
  star:[
   {open:['A star? For me? Huh. People usually give me a wide berth. Like, a really wide one.','Thanks. Really. It means more than you’d think.']},
   {open:['* Bruce cleans his glasses on his shirt, then puts them back on to look at you properly.','You know what I respect? You don’t flame out. You just do the next careful thing. Then the next one.'],
    opts:[
     {t:'Slow and steady.',r:['Slow and steady built every lab I ever worked in. Including the few that are still standing.']},
     {t:'Sometimes I want to smash things.',r:['Oh, I know the feeling. Work first. Then go hit a sandbag. In that order. Ask me how I know.']}]},
   {open:['I spent years running. Hiding in Calcutta, treating people out of a shack. Then I figured both halves of me could be useful.','You’ve got your own big guy in there. Some stubborn, angry part. Point him at the work.']},
   {open:['* He slides a battered notebook across the table. Inside, page after page of notes on your progress. Some charts. One very small doodle.','I’ve run a lot of experiments. This is my favorite. The subject keeps beating my predictions. It’s annoying. Great, but annoying.'],
    opts:[
     {t:'Am I the subject?',r:['You’re the subject. And the scientist. Best kind of experiment. No ethics board.']},
     {t:'Can I keep it?',r:['Keep it. Add to it. I want to read volume two. Maybe skip the doodle page.']}]},
   {open:['* Bruce sits on the workshop steps, shoulders finally down from around his ears.','For a long time I thought I was too dangerous to have friends. Then you just kept knocking on my door anyway.','You’re my friend, {name}. My brother. Both of me agree on that. Which is rare. We don’t agree on lunch.'],
    opts:[
     {t:'Both of you?',r:['* Something rumbles low in his chest. It might be a laugh. It might be the other guy.','Big guy says you “strong.” That’s high praise. He usually just says “puny.”']},
     {t:'You were never too dangerous.',r:['* He looks at the ground for a long moment, then pushes his glasses up.','Thanks. You keep reminding me, and I’ll keep trying to deserve it.']}]},
  ],
 },

 // ---------------- Peter (Home) ----------------
 peter:{
  level:[
   {open:['* Peter is hanging upside down from the Workshop rafters, swapping out a light bulb.','Oh hey! Don’t mind me. Your chores paid for this bulb, by the way. So you’re literally lighting up the place. Get it?'],
    opts:[
     {t:'Do you ever use a ladder?',r:['Ladders are for people without web fluid. Kidding. I fell off one at Ned’s once. Long story.']},
     {t:'That’s a terrible pun.',r:['It’s a great pun. You’re just jealous. Ned laughed. Okay, Ned laughs at everything.']}]},
   {open:['* He hands you half his sandwich. It’s squished. He apologizes for the squish.','Aunt May always said a clean kitchen is a kind of love. I used to roll my eyes. You did the dishes before bed all week, though. So. You get it.']},
   {open:['Real talk? Stopping a bank robbery is easy compared to remembering the laundry.','So you keeping the whole house running, like, every day? That’s hero stuff, man. Seriously.'],
    opts:[
     {t:'It’s just chores.',r:['That’s what everyone says. Then nobody does them. Then the sink smells. You do them.']},
     {t:'What’s your secret?',r:['If it takes two minutes, do it right now. If it waits, it grows legs. Sometimes literally. Don’t ask about my old fridge.']}]},
   {open:['* Peter swings past, does a double take, and circles back to land next to you.','Wait, you fixed the fence yourself? Dude! That’s awesome. My spider-sense says you’re on a streak. It doesn’t, but it should.']},
  ],
  star:[
   {open:['You’re giving me a star? Oh man. Okay. Okay. I’m gonna play it cool.','* He does not play it cool. He backflips off the porch and nearly takes out the mailbox.']},
   {open:['Somebody taught me that if you can help, you kinda have to. Every day. Not just the fun days.','You’re like that with your house. Your family counts on it, and you just keep doing it.'],
    opts:[
     {t:'Sometimes I don’t want to.',r:['Same. I still go. Wanting to is optional. Doing it isn’t. Ugh, I sound like my aunt.']},
     {t:'Who taught you that?',r:['My uncle. I’ll tell you the whole story someday. Not today. Today’s a good day.']}]},
   {open:['* Peter shows you a selfie of the two of you in front of the Workshop. Both thumbs up. His eyes are closed.','For the wall! Every hero needs a team photo. I’ll retake it. No I won’t, I love it.']},
   {open:['Everybody thinks the hard part of being me is the bad guys. Nope. It’s being tired and going anyway. Also homework.','You do that. Tired, and you go anyway. Makes me want to do it better.'],
    opts:[
     {t:'You inspire me too.',r:['Stop. I’m gonna tell everyone. I’m texting Ned right now.']},
     {t:'We’re both tired.',r:['Tired Heroes Club. We should get jackets. Mr. Quill keeps saying that too, so I think it’s happening.']}]},
   {open:['* Peter pulls off his mask and sits beside you on the porch. Just a kid from Queens with wrecked hair.','I’ve lost a lot of people. So when I find somebody good, I kinda hold on.','You’re my guy, {name}. Like, my brother. Is that weird? That’s weird. I don’t care.'],
    opts:[
     {t:'Not weird. Brothers.',r:['* His whole face lights up. He tries to be cool about it and completely fails.','Okay. Okay! Best day. Wanna get pizza? It won’t be as good as Queens. Nothing is. But still.']},
     {t:'Little brother, maybe.',r:['Hey! I’ll take it. I will totally take it. Dibs on the front seat, though.']}]},
  ],
 },

 // ---------------- Piotr (Home) ----------------
 piotr:{
  level:[
   {open:['* Piotr stirs a huge pot of borscht in the Workshop kitchen, apron on, sleeves pushed up over steel forearms.','Sit. Eat. A man who keeps his home well should eat well. This is the rule in my house. I made it, but it is a good rule.'],
    opts:[
     {t:'It smells amazing.',r:['It is my mother’s recipe. She also scrubbed the floor while it cooked. I tell you this as a hint.']},
     {t:'Can I help?',r:['Of course. Wash as we go. The kitchen should end cleaner than it started. Mother was very strict.']}]},
   {open:['* He holds up a small canvas: your house, in thick strokes of paint, every window glowing.','I paint it from memory each week. Each week, it looks better. The gutters, the porch, the garden. This is your doing, comrade.']},
   {open:['On the collective farm, chores were not a choice. The cows did not care how we felt.','When I do not want to fix something, I think of those cows. Then I fix it. You also, da?'],
    opts:[
     {t:'Da.',r:['Ha! Your accent is very bad. Your gutters are very good.']},
     {t:'You had cows?',r:['Many cows. Very rude cows. One kicked me before I was steel. I have forgiven her. Mostly.']}]},
   {open:['* Piotr lifts the old wardrobe with one hand so you can sweep underneath.','You see? Strong body is good. Strong habit is better. Now sweep. I cannot hold this all day. Well. I can. But it is boring.']},
  ],
  star:[
   {open:['* Piotr turns the star over in his huge steel fingers, very gently, like a bird’s egg.','This is kind. I will put it on the shelf I built. Next to the crooked one you built. I like the crooked one more.']},
   {open:['Everyone thinks my power is the steel. It is not. My power is that I choose to be gentle with it.','You choose also. Every chore done quietly so your wife does not have to. This is strength.'],
    opts:[
     {t:'It doesn’t feel like strength.',r:['Real strength almost never does. It feels like Tuesday. And a mop.']},
     {t:'You’re the gentlest guy I know.',r:['Do not tell Logan. I have a reputation for throwing him at things.']}]},
   {open:['* He shows you a freshly painted porch rail. Low down, your initials and his are carved side by side.','When we are old men, this will still stand. Because we took care of it.']},
   {open:['I miss my sister, Illyana. My home, very far away. Sometimes I build things here to feel close to there.','You make your home warm. It makes me feel less far. Spasibo.'],
    opts:[
     {t:'This is your home too.',r:['* He is quiet a long moment, then nods slowly.','Then I will keep it as well as you keep yours. This is a promise.']},
     {t:'Tell me about her.',r:['Another night. With borscht. Too much borscht. It is tradition. Also she would want me to exaggerate.']}]},
   {open:['* Piotr sets down his paintbrush and pulls you into a bear hug that could bend a girder.','In my village they say a brother is the wall that keeps out the winter wind.','You are my wall, {name}. I am yours. Always. This is not negotiable.'],
    opts:[
     {t:'Can’t... breathe...',r:['* He booms out a laugh and puts you back on your feet.','Sorry! Sorry. Steel hugs. I forget. Kitty says this also.']},
     {t:'Always, brother.',r:['Good. Now come. We eat, then we fix the gutter. Together. Then more borscht.']}]},
  ],
 },

 // ---------------- Kaladin (Discipline) ----------------
 kaladin:{
  level:[
   {open:['* Kaladin is on the Library roof at dawn, spear across his knees, watching the sky like he’s waiting for a storm.','You’re up. Good. Syl bet you’d sleep in. She owes me a… I don’t actually know what spren pay with.']},
   {open:['* He tosses you a training spear, old and worn smooth.','Spar. Not to win. To keep your guard up when you’re tired. That’s the whole lesson. Took me years to learn it.'],
    opts:[
     {t:'I’m always tired.',r:['Then you’re practicing the right thing. Guard up. Again.']},
     {t:'Go easy on me.',r:['No. But I’ll be there when you go down. That’s better.']}]},
   {open:['On the bridge crews we lived by doing one thing at a time. Lift. Run. Set it down. Don’t look at the chasm.','You’ve got a full week ahead. Don’t look at the week. Look at tomorrow morning. Then the next one.']},
   {open:['* Kaladin shares a bowl of stew with you, the thick, too-spicy kind Rock used to make for the crew.','You kept your routine through a rotten week. I saw. Bridge Four would’ve given you a patch for that.'],
    opts:[
     {t:'How did you know it was bad?',r:['I’ve had a lot of bad weeks. I know what they look like from the outside. The shoulders give it away.']},
     {t:'It wasn’t pretty.',r:['It never is. Pretty isn’t the goal. You got it done. Rock would make you eat seconds.']}]},
  ],
  star:[
   {open:['* Kaladin turns the star over, then looks up, surprised.','You didn’t have to do that. Thanks. Syl’s going to be insufferable about it.']},
   {open:['I’ve had days where I felt nothing. Gray. Where getting out of bed was the whole fight.','Those days I just kept my word. Small promises. You do that too. I can tell by your mornings.'],
    opts:[
     {t:'How do you get through them?',r:['One promise at a time. And people who won’t let me quit. Bridge Four. Syl. You’re on that list now.']},
     {t:'I have those days too.',r:['I know. And you still got up and did the thing. That’s braver than any charge I ever ran.']}]},
   {open:['* Wind tugs at your coats on the hill above Everstead. He leans into it like it’s an old friend.','I protect people because once I couldn’t. You protect your family by being steady. Same fight. Different spear.']},
   {open:['My men followed me because I carried the bridge with them. Not out front. Under it, with them.','You carry your own load every day, {name}. I’d run a bridge with you.'],
    opts:[
     {t:'That’s a big compliment.',r:['Biggest one I’ve got. Don’t waste it.']},
     {t:'I’d carry it with you.',r:['* One short nod. A sergeant’s nod.','Then you’re Bridge Four.']}]},
   {open:['* Night. Kaladin sits beside you at the fire, quieter than usual. Syl is curled on his shoulder, for once not talking.','When the dark came for me, it was my brothers who pulled me out. Not speeches. Just them, sitting with me. Staying.','You stayed too. Every day you kept your word. You’re my brother now. For life.'],
    opts:[
     {t:'For life.',r:['* He clasps your forearm, the way Bridge Four does it.','Then we get up tomorrow. Together. And the day after that.']},
     {t:'You stayed for me too.',r:['That’s how it works. You hold the bridge for me, I hold it for you. That’s all it’s ever been.']}]},
  ],
 },

 // ---------------- Stephen (Discipline) ----------------
 stephen:{
  level:[
   {open:['* Stephen floats cross-legged in the Library, three books slowly orbiting his head like moons.','You’re late. Kidding. You’re early, which is irritating. I had a whole lecture prepared.'],
    opts:[
     {t:'Lecture me anyway.',r:['Fine. Repetition is the price of mastery. Pay daily, no refunds. That’s it. Wong says I should work on brevity.']},
     {t:'I’ll take irritating.',r:['So will I. Sit. Wong’s on the good cushion, take the bad one.']}]},
   {open:['* He hands you a cup of tea that pours itself, mostly into the cup.','It took me months to make one spark at Kamar-Taj. Months. You’ve kept your routine three weeks straight. Don’t let it go to your head. That’s my job.']},
   {open:['My arrogance cost me everything. My hands. My career. Most of my personality. Practice gave it back, piece by piece.','So put the phone down. I’m not asking. I’m prescribing.'],
    opts:[
     {t:'Doctor’s orders?',r:['Former neurosurgeon’s orders. Also the Sorcerer Supreme’s. Double authority. Very hard to argue with.']},
     {t:'You sound like my wife.',r:['Then she’s clearly brilliant. Listen to both of us. Mainly her.']}]},
   {open:['* Stephen’s cloak drifts off his shoulders and settles over yours like a blanket while he reads.','Traitor. It doesn’t do that for anyone. Apparently it’s noticed you keep your bedtime. It has opinions about consistency.']},
  ],
  star:[
   {open:['A star. How very… sentimental of you.','* He sighs, then tucks it very carefully into an inner pocket of his robe.']},
   {open:['I looked at fourteen million possible futures once. In the good ones, people did the boring thing every day.','You’re doing the boring thing. That’s how you end up in a good one.'],
    opts:[
     {t:'How many futures?',r:['Fourteen million and change. You’re in the decent ones. Keep it that way.']},
     {t:'Boring sounds bad.',r:['Boring is underrated. Boring is how surgeons don’t leave sponges inside people.']}]},
   {open:['* Stephen traces a small orange circle in the air. Through it, a younger you, looking lost and holding a phone.','Look how far you’ve come. Don’t tell Wong I did that. It breaks several rules and at least one dimension.']},
   {open:['I used to think I was the smartest man in any room. Then a bald woman in Kathmandu knocked me out of my own body in about four seconds.','You’re humble enough to keep learning. That’s rarer than talent. Trust me, I had talent.'],
    opts:[
     {t:'Who humbled you?',r:['The Ancient One. Someone wiser than me. Which, I’ve since learned, is not a short list.']},
     {t:'You’re still pretty arrogant.',r:['Improving. Not cured. Like your discipline. That’s rather the point.']}]},
   {open:['* Stephen sits beside you on the Library steps. No magic. Just a tired man flexing scarred hands.','I gave up a great deal to protect people. I didn’t expect to find a friend in the bargain.','You kept going when it was dull and hard. I value that more than any spell in Kamar-Taj. You’re my brother, {name}.'],
    opts:[
     {t:'Brother, Doctor.',r:['* He smiles. Not the smirk. The real one, which almost nobody gets.','Stephen. For you, just Stephen.']},
     {t:'Would you have seen this coming?',r:['In a few futures. This is my favorite one.']}]},
  ],
 },

 // ---------------- Anakin (Discipline) ----------------
 anakin:{
  level:[
   {open:['* Anakin spins a training saber, bouncing on his heels.','Come on, faster. Wait. No. Slower. Obi-Wan always said I rushed. He said it a lot. Like, daily.'],
    opts:[
     {t:'Working on it how?',r:['Same as you. A little every day. It’s maddening. It also works. Don’t tell him I said that.']},
     {t:'We’ll both slow down.',r:['Fine. But I’m still faster. Just so we’re clear.']}]},
   {open:['* He’s got a speeder engine in pieces all over the Library courtyard. There’s grease on his face.','Don’t tell the librarian. Your discipline points bought these parts, so technically you’re an accomplice.']},
   {open:['I could do almost anything with the Force. Except wait. Patience was always the training I failed.','You’ve kept your bedtime twelve nights straight. I’m a little jealous, honestly.'],
    opts:[
     {t:'It doesn’t come easy to me either.',r:['Good. Then it’s really yours. Talent got me far. It didn’t get me home.']},
     {t:'You’re jealous?',r:['Don’t let it go to your head. Mine went to my head. Ask anyone. Ask Ahsoka.']}]},
   {open:['* Anakin races you to the top of the hill, wins easily, then actually waits for you.','Again tomorrow? Same time. And don’t be late. I hate waiting. Obviously.']},
  ],
  star:[
   {open:['* Anakin looks at the star like it might be a trap.','Nobody gives me things just for trying. Usually there’s a catch. Thanks. I mean it.']},
   {open:['I let anger and fear make my choices for a while. It nearly cost me everything.','So when you pick the hard, steady thing over the easy thing? That matters to me. More than you know.'],
    opts:[
     {t:'It almost cost you?',r:['I’d rather not talk about it. Just don’t copy my mistakes. Make your own, better ones.']},
     {t:'I pick wrong sometimes too.',r:['Then pick again tomorrow. That’s the part I’m still learning.']}]},
   {open:['* He hands you a cracked podracing goggle strap, patched with wire.','From when I was a kid on Tatooine. I won my freedom in a race nobody thought I could finish. You remind me of that kid.']},
   {open:['Obi-Wan used to call me his brother. I didn’t listen enough.','I’m listening now. And you’ve stuck with this longer than I ever stuck with anything slow.'],
    opts:[
     {t:'He was right about you.',r:['* Anakin looks off toward the hills, jaw tight, and finally nods.','Yeah. He was. Don’t tell him. He’ll be unbearable.']},
     {t:'We learn together.',r:['Together. Yeah. I was always trying to do it all alone. Didn’t go great.']}]},
   {open:['* Twilight. Anakin sits with his mechanical hand open on his knee, flexing the fingers.','I almost became the thing I was most afraid of. What pulled me back was somebody who wouldn’t give up on me.','You never gave up on yourself. That’s the same light. You’re my brother, {name}. I’m not losing this one.'],
    opts:[
     {t:'You won’t.',r:['* He grips your shoulder with the metal hand, very gently.','Then we keep each other honest. Every day.']},
     {t:'Neither will I.',r:['Good. Then the dark side can go take a long walk off a short landing platform.']}]},
  ],
 },

 // ---------------- Ash (Hobbies) ----------------
 ash:{
  level:[
   {open:['* Ash bursts through the Guildhall doors, cap backwards, Pikachu hanging onto his shoulder for dear life.','You did your hobby again today? Awesome! Let’s see it! Pikachu wants to see it too!'],
    opts:[
     {t:'It’s not that good yet.',r:['Who cares? My first Gym battle was a total disaster. Onix flattened us. You get good by doing it a ton!']},
     {t:'Wanna do it with me?',r:['Uh, YES. Teach me! I learn fast. Well. I learn loud. Pikachu, you in? He’s in.']}]},
   {open:['* Ash shares a rice ball with you on the riverbank. Pikachu steals the other half.','You know what I love? Every single day there’s something new to try. You’re getting like that too!']},
   {open:['I lost a ton of tournaments. Like, a TON. Indigo, Johto, Hoenn… I kept going ’cause I loved it.','That’s the trick! If you love it, losing’s just practice. Keep doing your thing!'],
    opts:[
     {t:'How many is a ton?',r:['Don’t count! Counting makes it sound bad. Okay, it was a lot. Pikachu’s holding up fingers. Stop it, buddy.']},
     {t:'Did you ever win?',r:['Eventually! Like, years later! Totally worth every single loss.']}]},
   {open:['* Ash high-fives you so hard your palm is still stinging a minute later.','Level up! You’re evolving! Okay, I’ve wanted to say that to a person for SO long.']},
  ],
  star:[
   {open:['A star?! For ME?! This is like winning a Gym badge!','* He holds it up to the sky and strikes a pose. Pikachu strikes the same pose.']},
   {open:['People say I never change. But I learned something every single journey. Like, a LOT.','You’re doing that too. Every time you pick up your hobby, you get a little better. I can tell!'],
    opts:[
     {t:'What do you think I learned?',r:['That fun counts! That’s, like, the biggest lesson ever.']},
     {t:'You’ve changed a lot.',r:['Thanks! My hat’s still the same, though. Some things are already perfect.']}]},
   {open:['* Ash pulls a dented old badge case from his backpack and shows you every badge, with a story for each one.','Each one took forever! I want you to have a case like this someday. For your stuff. The things you make.']},
   {open:['My best friends were always the ones who loved stuff as much as me. Brock and his cooking. Goh and catching everything.','And that’s you now! You love your stuff! It makes me so happy!'],
    opts:[
     {t:'You’re easy to love stuff around.',r:['Ha! I know, right? It’s contagious! Like Pikachu’s static.']},
     {t:'Best friends?',r:['Best friends! Duh! Since, like, level five.']}]},
   {open:['* Sunset over the meadow. Ash flops down in the grass next to you, Pikachu asleep on his chest.','I left Pallet Town when I was ten to chase my dream. I never stopped. And I never stopped making friends on the way.','You’re my partner now, {name}. For real. Brothers on the same journey.'],
    opts:[
     {t:'Partners. For real.',r:['* He fist-bumps you, grinning so wide that Pikachu copies him.','Then let’s go! There’s so much more out there!']},
     {t:'Where do we go next?',r:['Everywhere! But tomorrow first. Do your hobby. I’ll be there. Pikachu too.']}]},
  ],
 },

 // ---------------- Harry (Hobbies) ----------------
 harry:{
  level:[
   {open:['* Harry hands you a broom in the Guildhall yard. It’s an old Cleansweep with a wonky tail.','Fancy a fly? You’ve earned a bit of fun. Ron says you’ve been at your hobbies every night this week.'],
    opts:[
     {t:'I’ve never flown.',r:['Neither had I. First time, I just sort of went. Turned out I was all right at it. Don’t look down. Well, look down a bit.']},
     {t:'Is it safe?',r:['Mostly. Hermione would say no. Hermione’s usually right. Let’s go anyway.']}]},
   {open:['* Harry shares a box of Chocolate Frogs with you by the fire. Yours hops off the table.','Best thing about a hobby? Nobody can take it off you. Not even on a rubbish day.']},
   {open:['I spent my childhood in a cupboard. Hobbies weren’t exactly encouraged. Neither was dinner, some nights.','So seeing you make time for what you love? Brilliant. Don’t stop.'],
    opts:[
     {t:'A cupboard?',r:['Under the stairs. Long story. Spiders. My aunt and uncle. I’ve moved on. Mostly.']},
     {t:'I won’t stop.',r:['Good. Life’s too short. Trust me, I’ve had a few close calls. Seven or so.']}]},
   {open:['* Harry flicks his wand and every candle in the Guildhall lights at once. He looks slightly surprised it worked.','Your evenings paid for these, you know. Felt right to light them for you.']},
  ],
  star:[
   {open:['* Harry tucks the star into his pocket, looking a bit embarrassed.','Cheers. Feels a bit like house points. Fifty to Gryffindor. McGonagall would be appalled.']},
   {open:['People thought I was special because of a scar. What actually helped was practice. Loads of it.','Ask Hermione. She practiced everything. Twice. You’re a bit like her, honestly.'],
    opts:[
     {t:'I’ll take that.',r:['You should. It’s the best compliment I’ve got. Don’t tell Ron I said it.']},
     {t:'More like Ron.',r:['Ron’s brilliant too. He just complains more while he does it.']}]},
   {open:['* Harry shows you a photo where everything moves. You’re both in it, laughing, and photo-you keeps elbowing him.','For the wall. Every good memory deserves one. Hagrid made me a whole album once.']},
   {open:['I know what it’s like not to have family. Mates became mine. The Weasleys sort of adopted me without asking.','You’re one of mine now. I don’t say that to just anyone.'],
    opts:[
     {t:'Same here, Harry.',r:['* He rubs the back of his neck and grins at the floor.','Right. Good. Butterbeer, then.']},
     {t:'You’re easy to be friends with.',r:['Not according to a few dark wizards. But cheers.']}]},
   {open:['* Night by the pond. Harry skips stones and goes quiet for a while.','Spent so long fighting I nearly forgot what I was fighting for. Quidditch. Mates. Sunday dinners. This.','You remind me, {name}. You’re my brother. Like Ron. Family I picked.'],
    opts:[
     {t:'Family I chose too.',r:['* Harry claps you on the shoulder, a bit awkwardly.','Then we look out for each other. That’s how it works.']},
     {t:'Does Ron mind sharing?',r:['Ron will mind loudly, then Mrs. Weasley will knit you a jumper, and that’ll be that.']}]},
  ],
 },

 // ---------------- Thor (Hobbies) ----------------
 thor:{
  level:[
   {open:['* Thor slams a tankard onto the Guildhall table hard enough to spill everyone’s drinks.','My friend! You have done your hobby AGAIN? Excellent! This calls for a feast!'],
    opts:[
     {t:'Every day?',r:['Every victory deserves a feast. That is Asgardian law. I invented it just now, but it is ancient in spirit.']},
     {t:'Just a small one.',r:['Small feasts are for small gods. Fine. A medium feast. With only one boar.']}]},
   {open:['* Thor hands you a board game, slightly scorched by lightning.','I lost. Badly. To Loki. He cheated, I am certain of it. We must train so I can beat him. Bring snacks.']},
   {open:['I once believed being worthy meant being the strongest. I was very wrong. Father threw me out of Asgard to make the point.','Worthy is keeping your heart open and enjoying life with your people. You do both.'],
    opts:[
     {t:'Can I lift the hammer?',r:['* Thor considers this very seriously, stroking his beard.','Not yet. But you are closer than most. Closer than Stark. Do not tell him.']},
     {t:'Where did you learn that?',r:['In a desert town on Midgard, with no powers, being hit by a van. Twice. A very humbling teacher.']}]},
   {open:['* Thor drapes a heavy arm across your shoulders.','You read your book last night instead of staring at that glowing rectangle. Fun is not laziness, friend! Fun is fuel!']},
  ],
  star:[
   {open:['A STAR! For me?! I accept with great honor and even greater volume!','* The Guildhall windows rattle. Somewhere, a dog starts barking.']},
   {open:['I have lived a very long time. The best moments were never the battles.','They were the feasts, the games, the laughing. You are making more of those. Good.'],
    opts:[
     {t:'What was your favorite?',r:['Playing cards with friends on a ship. We lost terribly and laughed for hours. The rabbit cheated.']},
     {t:'More battles, though?',r:['Some. A god must stay sharp. But never forget the feast after. Never.']}]},
   {open:['* Thor tosses you a drinking horn carved with your name in runes. He has spelled it slightly wrong.','In Asgard, a carved horn means you have a seat at the table forever. The spelling is a tradition. Probably.']},
   {open:['I have lost much. My mother. My father. My brother, more than once. A whole home.','What remains is laughing with friends. You give me that. Thank you.'],
    opts:[
     {t:'You give it to me too.',r:['Then it is an even trade! The finest kind!']},
     {t:'I’m sorry for your losses.',r:['Thank you. The love has to go somewhere. So I spend it on my friends. Loudly.']}]},
   {open:['* Thor raises his hammer to the sky. Lightning crackles across the clouds. He lowers it, grinning.','In Asgard, warriors become brothers once they have fought, feasted and laughed together.','We have done all three, {name}. You are my brother now, and I will stand beside you until the end of days.'],
    opts:[
     {t:'Until the end of days.',r:['* He pulls you into a hug that lifts you clean off the ground.','Now! A FEAST! ANOTHER!']},
     {t:'Can we start with a small feast?',r:['NO. A great one. Brothers do not do small feasts. Bring everyone.']}]},
  ],
 },
};
