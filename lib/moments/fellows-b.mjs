// Fellow moments, batch B: pop-ups when the player levels a Fellow (every 5th level) or gives him a star.
// Shape: {open:[lines], opts?:[{t, r:[lines]}]}. Lines starting "* " are narration.

/** @type {Record<string,{level:any[],star:any[]}>} */
export const FELLOW_MOMENTS={
 // ---------------- Tony (Work) ----------------
 tony:{
  level:[
   {open:['* Tony is elbow-deep in a half-built gauntlet in the Market’s back room. He tosses you a wrench without looking.','Hold that. No, the other end. Okay, you’re officially more useful than my last three assistants.'],
    opts:[
     {t:'What are we building?',r:['Honestly? Not sure yet. That’s the fun part. You figure it out by finishing pieces.']},
     {t:'Who were the other three?',r:['Two robots and a guy named Happy. Don’t tell him I ranked him.']}]},
   {open:['* He slides a cheeseburger across the counter at you.','You paid for this upgrade with real work. Deep work. I checked the ledger. Eat. Geniuses need fuel too.']},
   {open:['You know what my first real suit was built from? Scraps, in a cave, on a deadline that was literally life or death.','You don’t need a perfect setup. You need to start with what you’ve got.'],
    opts:[
     {t:'That’s a lot of pressure.',r:['Pressure’s just a deadline with better PR. You handled yours this week. I noticed.']},
     {t:'So I should work in a cave?',r:['Please don’t. The Wi-Fi is terrible. Just stop waiting for the perfect desk.']}]},
   {open:['* Tony squints at a hologram of your habit chart.','See this line? It goes up. I love lines that go up. Keep feeding it, {name}.']},
  ],
  star:[
   {open:['A star? For me? I mean, obviously. But it’s nice when someone else notices.','Here’s mine back: you show up. In my line of work, that’s rarer than vibranium.']},
   {open:['* He taps your chest twice, right where his arc reactor would be.','You’ve got something running in there now. Steady output. Don’t let anyone tell you it’s small.'],
    opts:[
     {t:'Learned it from you.',r:['Flattery. Excellent. Keep it coming, it pairs well with the work.']},
     {t:'Some days it’s barely on.',r:['Mine too. Barely on still powers the suit. You just keep it charged.']}]},
   {open:['I used to think I had to do everything alone. Build it, fly it, fix it, all me.','Then I got a team. Turns out a team finishes things. You’re on mine now. Don’t make it weird.']},
   {open:['* Tony hands you a small, perfectly machined bolt with your initials etched on it.','First piece of the suit I’m building you. Every time you finish real work, I add one. You’re going to be heavily armored.'],
    opts:[
     {t:'That’s a lot of bolts.',r:['That’s the point. Get to work, I hate idle hands. Especially my own.']},
     {t:'Thanks, Tony. Really.',r:['Don’t. I’ll get emotional and then I’ll have to build something to cope.']}]},
   {open:['* Late night at the workshop. The tools are quiet for once. Tony doesn’t look up from the bench.','I spent years building armor to protect people. Took me forever to learn the best thing I made was the people around me.','You’re one of those, {name}. You’re family. Don’t argue, I already ran the numbers.'],
    opts:[
     {t:'Brothers, then.',r:['* He grins and finally looks up.','Brothers. Now help me with this thing before I cry on the circuitry.']},
     {t:'You’ll make me cry on the circuitry.',r:['Join the club. It’s waterproof. I made sure.']}]},
  ],
 },

 // ---------------- Kelsier (Work) ----------------
 kelsier:{
  level:[
   {open:['* Kelsier spreads a map across the café table, weighted down with two mugs and a coin.','Every great job has three plans. The plan, the backup plan, and the one you don’t tell the crew. What’s your plan this week?'],
    opts:[
     {t:'Get the hard project done.',r:['Good. Now break it into pieces small enough to steal one a day.']},
     {t:'I don’t really have one.',r:['Then that’s tonight’s job. Ten minutes and a pencil. Thieves plan. Victims hope.']}]},
   {open:['* He flips a coin across his knuckles and catches it mid-air.','You earned that gold the honest way. Strange feeling for me. I think I like it.']},
   {open:['I used to smile because the world told me not to. Smiling was rebellion.','Same goes for work, my friend. Do it well and do it cheerfully. Drives the gloom absolutely mad.']},
   {open:['* Kelsier leans against the Market wall, watching traders haggle.','A crew is only as good as its quietest member doing his part. You’ve been doing yours. I see it.'],
    opts:[
     {t:'I’m not that quiet.',r:['No, you’re not. But your best work is. That’s the part that counts.']},
     {t:'Who’s the loudest?',r:['Me, obviously. Someone has to be the distraction.']}]},
  ],
  star:[
   {open:['A star. For a thief. You know how to make a man feel respectable.','Don’t worry, it won’t go to my head. Much.']},
   {open:['* He hands you a folded note: a plan, in his elegant handwriting, with your name at the top.','Every job I’ve ever planned had a part for someone I trusted. This one has yours.'],
    opts:[
     {t:'What’s my part?',r:['Keep showing up. The rest falls into place. It always does when the crew holds.']},
     {t:'You trust me?',r:['I trust what you do, which is better than anything you could say.']}]},
   {open:['I survived a place built to break people. What kept me alive was deciding I’d make it mean something.','Your hard days can mean something too. Make them pay out.']},
   {open:['* Kelsier is quiet for once, watching the sun go down over the rooftops.','I’ve been a lot of things. Liar, legend, ghost. Friend is the one I’m least practised at.','Thanks for letting me practise.'],
    opts:[
     {t:'You’re good at it.',r:['Don’t spread that around. Ruins my reputation.']},
     {t:'Practice makes perfect.',r:['* He laughs, the real kind.','Using my own lessons against me. You’re learning.']}]},
   {open:['* He presses his old coin into your palm and closes your fingers over it.','I always kept one secret back. One last plan. This is it: I’d do every job again if it meant ending up with a crew like this.','You’re my brother, {name}. That’s the heist. We already pulled it off.'],
    opts:[
     {t:'Best job you ever ran.',r:['Best job I ever ran. And I didn’t even have to steal anything.']},
     {t:'Keep the coin.',r:['No. You keep it. Flip it on the hard mornings. Heads, you work. Tails, you work smiling.']}]},
  ],
 },

 // ---------------- Bruce (Work) ----------------
 bruce:{
  level:[
   {open:['* Bruce is hunched over a notebook, pencil behind his ear, glasses slipping down his nose.','Oh, hey. Sorry. I’ve been logging your output. Strictly scientific. You’re trending up.'],
    opts:[
     {t:'Is that good?',r:['It’s consistent. Consistent is better than good. Good is a spike. Consistent is a curve.']},
     {t:'You log everything?',r:['Helps me stay calm. Numbers don’t yell at you. Mostly.']}]},
   {open:['* Bruce hands you a cup of chamomile tea.','When I feel the pressure building, I step back, breathe, then go again. Try it before your next big task.']},
   {open:['Funny story. I once broke a whole lab because someone moved my coffee.','Point is, I learned. Now I build routines so I never have to find out how angry I can get.'],
    opts:[
     {t:'Who moved the coffee?',r:['Tony. It’s always Tony.']},
     {t:'Routines saved you?',r:['They still do. Every day. Same as yours are saving you, even when it doesn’t feel like it.']}]},
   {open:['* On a walk past the river, Bruce suddenly stops and smiles at nothing.','Sorry. Just realized I’m not stressed. Doesn’t happen often. Good work does that. You should know, you’ve been doing a lot of it.']},
  ],
  star:[
   {open:['A star? For me? Huh. Usually people give me a wide berth.','Thank you. Really. That means more than you think.']},
   {open:['* Bruce cleans his glasses, then puts them back on to look at you properly.','You know what I respect? You don’t burn out in a blaze. You just keep doing the next careful thing.'],
    opts:[
     {t:'Slow and steady.',r:['Slow and steady built every lab I ever worked in. Including the ones that survived.']},
     {t:'Sometimes I want to smash things.',r:['Me too. Do the work first. Then go punch a sandbag. In that order.']}]},
   {open:['I spent years running. Hiding from what I was. Then I stopped and decided both halves of me could be useful.','You’ve got your own big guy inside. Point him at the work.']},
   {open:['* He slides a battered notebook to you. Inside, page after page of notes on your progress.','I’ve tracked a lot of experiments. This one’s my favorite. The subject keeps exceeding expectations.'],
    opts:[
     {t:'Am I the subject?',r:['You’re the subject. And the scientist. That’s the best kind of experiment.']},
     {t:'Can I keep it?',r:['Keep it. Add to it. I want to read volume two.']}]},
   {open:['* Bruce sits on the workshop steps, shoulders finally loose.','For a long time I thought I was too dangerous to have friends. Then you kept showing up anyway.','You’re my friend, {name}. My brother. Both of me agree on that.'],
    opts:[
     {t:'Both of you?',r:['* A low rumble, almost a laugh, from somewhere deep in his chest.','Big guy says you’re strong. That’s high praise. He doesn’t say that to anyone.']},
     {t:'You were never too dangerous.',r:['* He looks at the ground for a long moment.','Thanks. Keep proving it to me. I’ll keep proving it to you.']}]},
  ],
 },

 // ---------------- Peter (Home) ----------------
 peter:{
  level:[
   {open:['* Peter is hanging upside down from the Workshop rafters, fixing a light.','Oh hey! Don’t mind me. Your chores paid for this bulb, by the way. You’re literally lighting up the place.'],
    opts:[
     {t:'Do you ever use a ladder?',r:['Ladders are for people who don’t have web fluid. Kidding. Mostly.']},
     {t:'That’s a terrible pun.',r:['It’s a great pun. You’re just jealous you didn’t think of it.']}]},
   {open:['* He hands you half his sandwich.','Aunt May always said a clean kitchen is a kind of love. I didn’t get it as a kid. You get it now, huh?']},
   {open:['Real talk: saving the city is easy compared to remembering laundry.','So when I see you keeping your house going, day after day? That’s hero stuff, man.'],
    opts:[
     {t:'It’s just chores.',r:['That’s what everyone says. Then nobody does them. You do them.']},
     {t:'What’s your secret?',r:['Small stuff right away. Two minutes, done. If it waits, it grows legs.']}]},
   {open:['* Peter swings past, then circles back to land next to you.','Wait, did you fix the fence yourself? Dude. That’s awesome. Spider-sense says you’re on a streak.']},
  ],
  star:[
   {open:['You’re giving me a star? Oh man. Okay, I’m gonna play it cool.','* He does not play it cool. He does a backflip.']},
   {open:['I learned the hard way that being able to help means you kinda have to help. Every day.','You’ve got that too. Your family counts on your house. And you keep showing up for it.'],
    opts:[
     {t:'Sometimes I don’t want to.',r:['Same. I still go. Wanting to is optional. Doing it isn’t.']},
     {t:'Who taught you that?',r:['My uncle. Someday I’ll tell you the whole story. Not today. Today’s a good day.']}]},
   {open:['* Peter shows you a selfie of the two of you in front of the Workshop. Your thumbs are both up.','For the wall. Every hero needs a team photo.']},
   {open:['People think the hard part of being me is the bad guys. Nah. It’s being tired and showing up anyway.','You do that. I see it. It makes me want to do it better.'],
    opts:[
     {t:'You inspire me too.',r:['Stop, I’m gonna tell everyone. I’m telling everyone.']},
     {t:'We’re both tired.',r:['Tired heroes club. We should get jackets.']}]},
   {open:['* Peter pulls off his mask and sits beside you on the porch, just a kid from Queens.','I’ve lost a lot of people. So when I find someone good, I hold on.','You’re my guy, {name}. Like, my brother. Is that weird? I don’t care if it’s weird.'],
    opts:[
     {t:'Not weird. Brothers.',r:['* He grins so hard his eyes crinkle.','Okay. Okay! Best day. Wanna get pizza?']},
     {t:'Little brother, maybe.',r:['Hey! I’ll take it. I’ll totally take it.']}]},
  ],
 },

 // ---------------- Piotr (Home) ----------------
 piotr:{
  level:[
   {open:['* Piotr stirs a huge pot of borscht in the Workshop kitchen.','Sit. Eat. A man who keeps his home well should eat well. That is the rule in my house.'],
    opts:[
     {t:'It smells amazing.',r:['It is my mother’s recipe. She also cleaned while it cooked. You should try that.']},
     {t:'Can I help?',r:['Of course. Wash the dishes as we go. The kitchen should end cleaner than it started.']}]},
   {open:['* He holds up a small painting of your house, every window glowing.','I painted it from memory. It looks better every week. That is your doing, comrade.']},
   {open:['Back home on the farm, chores were not a choice. The cows did not care how we felt.','I think of this when I do not want to fix something. Then I fix it. Same for you, da?'],
    opts:[
     {t:'Da.',r:['Ha! Your accent is terrible. Your work is not.']},
     {t:'You had cows?',r:['Many cows. Very rude cows. They taught me patience.']}]},
   {open:['* Piotr effortlessly lifts the old wardrobe so you can sweep underneath.','You see? Strong body is good. Strong habit is better. Now sweep, I cannot hold it all day. Well, I can. But still.']},
  ],
  star:[
   {open:['* Piotr turns the star over in his huge steel fingers, very gently.','This is kind. I will put it on the shelf I built. Next to the one you built.']},
   {open:['Many think my power is the steel. No. My power is that I choose to be gentle with it.','You choose too. Every chore done quietly for your family. This is strength.'],
    opts:[
     {t:'It doesn’t feel like strength.',r:['Real strength rarely does. It feels like Tuesday.']},
     {t:'You’re the gentlest guy I know.',r:['Do not tell the others. I have a reputation for punching.']}]},
   {open:['* He shows you a fresh-painted porch rail. Your initials and his are carved together near the bottom.','When we are old, this will still stand. Because we took care of it.']},
   {open:['I miss my sister. My home far away. Sometimes I build here to feel close to there.','You make your home warm. It makes me feel less far away. Spasibo.'],
    opts:[
     {t:'This is your home too.',r:['* He is quiet a long moment.','Then I will keep it as well as you do. That is a promise.']},
     {t:'Tell me about her.',r:['Another night. With borscht. Too much borscht. It is tradition.']}]},
   {open:['* Piotr sets down his paintbrush and pulls you into a bear hug that could bend iron.','In my country we say a brother is the wall that keeps the wind out.','You are my wall, {name}. And I am yours. Always.'],
    opts:[
     {t:'Can’t... breathe...',r:['* He laughs and sets you down.','Sorry! Sorry. Steel hugs. I forget.']},
     {t:'Always, brother.',r:['Good. Now come. We will eat, and then we will fix the gutter. Together.']}]},
  ],
 },

 // ---------------- Kaladin (Discipline) ----------------
 kaladin:{
  level:[
   {open:['* Kaladin is on the Library roof at dawn, spear across his knees, watching the sky.','You’re up early. Good. The hardest part of any day is the first step. You took it.']},
   {open:['* He tosses you a training spear.','Spar. Not to win. Just to keep your guard up when you’re tired. That’s the whole lesson.'],
    opts:[
     {t:'I’m always tired.',r:['Then you’re practising the right thing. Guard up. Again.']},
     {t:'Go easy on me.',r:['No. But I’ll be there when you fall. That’s better.']}]},
   {open:['On the bridge crews, we survived by doing one thing at a time. Carry. Rest. Carry again.','Your habits are your bridge. Don’t look at the whole chasm. Look at the next step.']},
   {open:['* Kaladin shares a bowl of stew with you, the thick kind he made for his crew.','You kept your routine through a bad week. I noticed. That’s what a soldier does.'],
    opts:[
     {t:'How did you know it was bad?',r:['I’ve had a lot of bad weeks. I know what they look like from the outside.']},
     {t:'It wasn’t pretty.',r:['It never is. Pretty isn’t the goal. Done is the goal.']}]},
  ],
  star:[
   {open:['* Kaladin turns the star over, then looks at you with surprise.','You didn’t have to. Thanks. I’ll carry it.']},
   {open:['I’ve had days where I felt nothing. Where getting up was the whole battle.','Those days, I just kept my word. You do the same. I can see it in your habits.'],
    opts:[
     {t:'How do you get through them?',r:['One promise at a time. And people who won’t let me quit. You’re one of mine.']},
     {t:'I have those days too.',r:['I know. And you still showed up. That’s the bravest thing there is.']}]},
   {open:['* Wind tugs at your coats as you stand on the hill above Everstead.','I protect people because I couldn’t, once. You protect your family by being steady. Same fight, different spear.']},
   {open:['My men followed me because I carried the bridge with them. Not ahead. With.','You carry your own load every day, {name}. I’d follow you onto a bridge.'],
    opts:[
     {t:'That’s a big compliment.',r:['It’s the biggest one I’ve got. Don’t waste it.']},
     {t:'I’d carry it with you.',r:['* He nods once, the way a sergeant does.','Then we’re a crew.']}]},
   {open:['* Night. Kaladin sits beside you by the fire, quieter than usual.','When the dark came for me, it was my brothers who pulled me out. Not speeches. Just them, staying.','You stayed. Every day you kept your word, you stayed. You’re my brother now. For life.'],
    opts:[
     {t:'For life.',r:['* He grips your forearm, warrior to warrior.','Then rise with me. Tomorrow, and every day after.']},
     {t:'You stayed for me too.',r:['That’s how it works. We hold the line for each other. Always.']}]},
  ],
 },

 // ---------------- Stephen (Discipline) ----------------
 stephen:{
  level:[
   {open:['* Stephen floats cross-legged in the Library, three books orbiting his head.','You’re late. Kidding. You’re early, which is irritating. I was going to lecture you.'],
    opts:[
     {t:'Lecture me anyway.',r:['Fine. Repetition is the price of mastery. Pay it daily. Lecture over.']},
     {t:'I’ll take irritating.',r:['As will I. Sit. We have reps to do.']}]},
   {open:['* He hands you a cup of tea that pours itself.','I once spent months trying to light a single spark. Months. You’re doing better than I did.']},
   {open:['My arrogance cost me everything. Hands, career, ego. Practice gave it back, piece by piece.','So, put the phone down. I’m not asking, I’m prescribing.'],
    opts:[
     {t:'Doctor’s orders?',r:['Former neurosurgeon’s orders. Also sorcerer’s. Double authority.']},
     {t:'You sound like my wife.',r:['Then she’s clearly brilliant. Listen to both of us.']}]},
   {open:['* Stephen’s cloak drapes a blanket over your shoulders while he reads.','The cloak likes you. It doesn’t like anyone. That says something about your consistency.']},
  ],
  star:[
   {open:['A star. How… sentimental.','* He tucks it carefully into his robe anyway.']},
   {open:['I’ve seen millions of possible futures. In the good ones, people do the boring thing every day.','You’re doing the boring thing. That’s how you get the good future.'],
    opts:[
     {t:'How many futures?',r:['A lot. You’re in the decent ones. Keep it that way.']},
     {t:'Boring sounds bad.',r:['Boring is underrated. Boring is how surgeons don’t kill people.']}]},
   {open:['* Stephen opens a small portal. Through it, a younger version of you, looking lost.','Look how far you’ve come. Don’t tell anyone I did that. It breaks several rules.']},
   {open:['I used to think I was the smartest man in every room. Then a monk humbled me in a week.','You’re humble enough to keep learning. That’s rarer than talent.'],
    opts:[
     {t:'Who humbled you?',r:['Someone wiser than me. Which, I’ve since learned, is not a short list.']},
     {t:'You’re still pretty arrogant.',r:['Improving, not cured. Same as your discipline. That’s the point.']}]},
   {open:['* Stephen sits beside you on the Library steps, no magic, just a tired man with scarred hands.','I gave up a lot to protect people. I didn’t expect to find a friend in the bargain.','You kept going when it was dull and hard. I respect that more than any spell. You’re my brother, {name}.'],
    opts:[
     {t:'Brother, Doctor.',r:['* A rare, real smile.','Just Stephen. For you.']},
     {t:'Would you have seen this coming?',r:['In some futures. This is my favorite one.']}]},
  ],
 },

 // ---------------- Anakin (Discipline) ----------------
 anakin:{
  level:[
   {open:['* Anakin spins a training saber, impatient.','Come on, faster. Wait. No. Slower. My master always said I rushed. I’m working on it.'],
    opts:[
     {t:'Working on it how?',r:['Same as you. Little bit every day. It’s maddening. It also works.']},
     {t:'We’ll both slow down.',r:['Fine. But I’m still faster.']}]},
   {open:['* He has a speeder engine in pieces in the Library courtyard.','Don’t tell the librarian. Your discipline points bought the parts, so technically you’re an accomplice.']},
   {open:['I could do anything with the Force. Except be patient. Patience was always the hardest training.','You’ve been patient with your routines. I’m a little jealous, honestly.'],
    opts:[
     {t:'It doesn’t come easy to me either.',r:['Good. Then it’s really yours. Talent fades. Habits stay.']},
     {t:'You’re jealous?',r:['Don’t let it go to your head. I had to learn that one the hard way.']}]},
   {open:['* Anakin races you to the top of the hill and wins, then waits.','Again tomorrow? Same time. Showing up is the whole race.']},
  ],
  star:[
   {open:['* Anakin looks at the star like it might be a trick.','Nobody gives me things just for trying. Thanks. I mean it.']},
   {open:['I let my anger and my fear make choices for me. It almost cost me everything.','So when you pick the hard, steady thing instead of the easy thing? That matters to me.'],
    opts:[
     {t:'It almost cost you?',r:['I don’t like to talk about it. Just don’t make my mistakes. Make better ones.']},
     {t:'I pick wrong sometimes too.',r:['Then you pick again tomorrow. That’s what I’m still learning.']}]},
   {open:['* He hands you an old pod-racing goggle strap.','From when I was a kid. I won my freedom in a race nobody thought I could win. You remind me of that kid.']},
   {open:['Obi-Wan used to say I was his brother. I didn’t listen enough.','I’m listening now. You’ve stuck with this longer than I ever stuck with patience.'],
    opts:[
     {t:'He was right about you.',r:['* Anakin looks away, jaw tight, then nods.','Yeah. He was.']},
     {t:'We learn together.',r:['Together. I like that. I never did enough together.']}]},
   {open:['* Twilight. Anakin sits with his mechanical hand open on his knee.','I almost became the thing I feared most. What pulled me back was someone who refused to give up on me.','You never gave up on yourself. That’s the same light. You’re my brother, {name}. I won’t lose this one.'],
    opts:[
     {t:'You won’t.',r:['* He grips your shoulder with the metal hand, gently.','Then let’s keep each other honest. Every day.']},
     {t:'Neither will I.',r:['Good. Then the dark side can go take a long walk.']}]},
  ],
 },

 // ---------------- Ash (Hobbies) ----------------
 ash:{
  level:[
   {open:['* Ash bursts through the Guildhall doors, cap backward.','You did your hobby again today? That’s awesome! Let’s go, I wanna see what you made!'],
    opts:[
     {t:'It’s not that good yet.',r:['Who cares? My first battles were a disaster. You get good by doing it a bunch!']},
     {t:'Wanna do it with me?',r:['Uh, YES. Teach me. I learn fast. Well, I learn loud.']}]},
   {open:['* Ash shares a rice ball with you on the riverbank.','You know what I love? Every day there’s something new to try. You’re like that now too.']},
   {open:['I lost a ton of tournaments. Like, a TON. I kept going because I loved it.','That’s the trick. If you love it, losing’s just practice. Keep doing your thing!'],
    opts:[
     {t:'How many is a ton?',r:['Don’t count! Counting makes it sound bad. Okay, it was a lot.']},
     {t:'Did you ever win?',r:['Eventually! Took forever. Worth it. Every single loss.']}]},
   {open:['* Ash high-fives you so hard your palm stings.','Level up! You’re evolving! Okay, I always wanted to say that to a person.']},
  ],
  star:[
   {open:['A star?! For me?! This is like getting a badge!','* He holds it up to the sky like it’s the greatest prize in the world.']},
   {open:['People think I never change. But I learned something every journey. Like, a lot.','You’re doing that too. Every hobby day, you learn something. I can tell!'],
    opts:[
     {t:'What do you think I learned?',r:['That fun counts! That’s like the biggest lesson ever.']},
     {t:'You’ve changed a lot.',r:['Thanks! My hat’s still the same though. Some things are perfect already.']}]},
   {open:['* Ash pulls a dented old badge case from his pack and shows you every badge.','Each one took forever. I want you to have a case like this someday. For your stuff.']},
   {open:['My best friends were always the ones who loved stuff as much as me.','That’s you now. You love your things. It makes me so happy!'],
    opts:[
     {t:'You’re easy to love stuff around.',r:['Ha! I know, right? It’s contagious.']},
     {t:'Best friends?',r:['Best friends! Duh! Since like level five.']}]},
   {open:['* Sunset over the meadow. Ash flops down in the grass next to you.','I left home when I was ten to chase my dream. I never stopped. And I never stopped finding friends.','You’re my partner now, {name}. Like, for real. Brothers on the same journey.'],
    opts:[
     {t:'Partners. For real.',r:['* He fist-bumps you, grinning ear to ear.','Then let’s go! There’s so much more to do!']},
     {t:'Where do we go next?',r:['Everywhere! But tomorrow first. Do your hobby. I’ll be there.']}]},
  ],
 },

 // ---------------- Harry (Hobbies) ----------------
 harry:{
  level:[
   {open:['* Harry hands you a broom in the Guildhall yard.','Fancy a fly? You’ve earned a bit of fun. Ron says you’ve been keeping at your hobbies.'],
    opts:[
     {t:'I’ve never flown.',r:['Neither had I. First time, I just went. Turned out I was alright at it.']},
     {t:'Is it safe?',r:['Mostly. Hermione would say no. Hermione is usually right. Let’s go anyway.']}]},
   {open:['* Harry shares a box of chocolate frogs with you by the fire.','Best thing about a hobby? Nobody can take it from you. Not even the worst day.']},
   {open:['I spent my childhood in a cupboard. Hobbies weren’t exactly encouraged.','So when I see you making time for what you love? Brilliant. Don’t stop.'],
    opts:[
     {t:'A cupboard?',r:['Under the stairs. Long story. It had spiders. I’ve moved on. Mostly.']},
     {t:'I won’t stop.',r:['Good. Life’s too short. Trust me, I’ve had a few close calls.']}]},
   {open:['* Harry flicks his wand and the Guildhall candles light up.','Your work paid for these, you know. Feels right to light them for you.']},
  ],
  star:[
   {open:['* Harry pockets the star with a sheepish grin.','Thanks. Feels a bit like house points. Gryffindor would be proud.']},
   {open:['People thought I was special because of a scar. But what actually helped was practice.','Ask Hermione. She practised everything. You’re a bit like her, honestly.'],
    opts:[
     {t:'I’ll take that.',r:['You should. It’s the best compliment I’ve got.']},
     {t:'More like Ron.',r:['Ron’s brilliant too. He just complains more while doing it.']}]},
   {open:['* Harry shows you a photo that moves. You’re both in it, laughing.','For the wall. Every good memory deserves one.']},
   {open:['I know what it’s like to not have family. Friends became mine.','You’ve become one of mine. I don’t say that lightly.'],
    opts:[
     {t:'Same here, Harry.',r:['* He looks away, smiling.','Right. Good. Let’s get butterbeer.']},
     {t:'You’re easy to be friends with.',r:['Not according to a few dark wizards. But thanks.']}]},
   {open:['* Night by the lake. Harry skips stones, quiet for a while.','I spent so long fighting, I almost forgot what I was fighting for. Joy. People. This.','You remind me, {name}. You’re my brother. Like Ron. Like family I chose.'],
    opts:[
     {t:'Family I chose too.',r:['* Harry claps your shoulder.','Then we look after each other. That’s the deal.']},
     {t:'Does Ron mind sharing?',r:['Ron will mind loudly, then adopt you. That’s how it works.']}]},
  ],
 },

 // ---------------- Thor (Hobbies) ----------------
 thor:{
  level:[
   {open:['* Thor slams a tankard down on the Guildhall table.','My friend! You’ve done your hobby AGAIN? Excellent! This calls for a feast!'],
    opts:[
     {t:'Every day?',r:['Every day there is a victory, there is a feast. That is Asgardian law. I just made it up.']},
     {t:'Just a small one.',r:['Small feasts are for small gods. Fine. A medium feast.']}]},
   {open:['* Thor hands you a lightning-scorched board game.','I lost. Badly. To Loki. We must train so I can beat him next time. Bring snacks.']},
   {open:['I once thought being worthy meant being the strongest. I was wrong.','Worthy means you keep your heart open, and enjoy life with your friends. You do both.'],
    opts:[
     {t:'Can I lift the hammer?',r:['* Thor considers this very seriously.','Not yet. But you are closer than most.']},
     {t:'Where did you learn that?',r:['Being thrown out of Asgard. Long story. Very humbling. Good teacher.']}]},
   {open:['* Thor drapes an arm across your shoulders.','Fun is not lazy, friend. Fun is fuel. You remember that, and you will never run dry.']},
  ],
  star:[
   {open:['A STAR! For me?! I accept with great honor and greater volume!','* The Guildhall windows rattle.']},
   {open:['I have lived for a very long time. The best moments were never the battles.','They were feasts, games, laughter. You are making more of those. Good.'],
    opts:[
     {t:'What was your favorite?',r:['A game of cards with friends on a ship. We lost, and laughed for hours.']},
     {t:'More battles, though?',r:['Some. A god must stay sharp. But never forget the feast after.']}]},
   {open:['* Thor tosses you a horn of mead, carved with your name in runes.','In Asgard, a carved horn means you have a seat at the table forever.']},
   {open:['I have lost much. Mother, father, a whole home.','What remains is laughter with friends. You give me that. Thank you.'],
    opts:[
     {t:'You give it to me too.',r:['Then it is a fair trade. The best kind.']},
     {t:'I’m sorry for your losses.',r:['Thank you. Grief is love with nowhere to go. So I give it to my friends.']}]},
   {open:['* Thor raises his hammer to the sky. Lightning crackles, then he lowers it, smiling.','In Asgard, warriors become brothers when they have fought, feasted and laughed together.','We have done all three, {name}. You are my brother. I will stand with you until the end of days.'],
    opts:[
     {t:'Until the end of days.',r:['* He pulls you into a crushing hug.','Now. A FEAST!']},
     {t:'Can we start with a small feast?',r:['NO. A great one. Brothers do not do small feasts.']}]},
  ],
 },
};
