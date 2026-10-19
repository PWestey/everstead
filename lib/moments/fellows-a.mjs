// Fellow moments, set A: short pop-ups when the player levels a Fellow (every 5th level, in rotation)
// or gives him a star (star 1..5 in order). See docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; lines starting "* " are narration.

/** @type {Record<string,{level:any[],star:any[]}>} */
export const FELLOW_MOMENTS={
 // ---------------- Obi-Wan (Faith) ----------------
 obiwan:{
  level:[
   {open:['* Obi-Wan sets down a pair of training staffs and offers you one.','Shall we? I promise to go easy. Mostly.'],opts:[
    {t:'Don’t go easy.',r:['Ah. Then I’ll go slightly less easy.','* He disarms you in four moves, then helps you up. “Better than last week.”']},
    {t:'You always say that.',r:['And I’m always lying. It’s good for your humility. Mine is beyond saving.']}]},
   {open:['* He’s sharing a pot of tea on the village steps and pours you a cup without asking.','You prayed this morning before anything else. I noticed. Small things, done daily, are what hold a man together.']},
   {open:['I had a master once who told me to keep my focus on the here and now.','I ignored him for years. Don’t be like me. Be like you’ve been this week.'],opts:[
    {t:'What changed for you?',r:['I lost people. Grief teaches what wisdom couldn’t. I’d rather you learn it the gentler way.']},
    {t:'That was almost a compliment.',r:['Almost. I’m a Jedi. We ration them.']}]},
   {open:['* You walk the long way around the pond together. He doesn’t speak for a while.','Stillness isn’t doing nothing. It’s choosing what matters before the noise chooses for you. Keep choosing.']}],
  star:[
   {open:['Well. A star. I’ve been called many things, but rarely worth the investment.','Let’s see that it isn’t wasted. On either of us.']},
   {open:['* He’s meditating by the fountain when you arrive and opens one eye.','You’ve been showing up to your quiet time even on the hard days. That’s the whole secret. There’s no other one.'],opts:[
    {t:'Some days it feels like talking to the ceiling.',r:['Some days it is. Faith is staying in the room anyway. The answers come on their own schedule.']},
    {t:'I’m learning from you.',r:['Then learn faster than I did. I had a head start and still took the long road.']}]},
   {open:['I once trained a boy who was stronger than me in every way. I failed him.','You remind me why I keep teaching anyway. You listen. And you come back.']},
   {open:['* He lays a worn brown cloak across your shoulders.','I spent years in the desert waiting for something that mattered. You don’t have to wait. It’s already here, in this village.'],opts:[
    {t:'I can’t take your cloak.',r:['It’s a cloak, not a kingdom. I have three. Keep it.']},
    {t:'Thank you, Master.',r:['Don’t call me that. Not because you haven’t earned a master. Because you’ve earned a friend.']}]},
   {open:['* Obi-Wan stands at the edge of the training ground, watching the sunset, and doesn’t turn when you join him.','I had a brother once. I loved him and I lost him, and I’ve carried that a long time.','I didn’t think I’d be given another. Then you kept showing up. Every prayer, every quiet morning. I saw all of it.'],opts:[
    {t:'You’re my brother too, Ben.',r:['* He laughs, and his eyes are wet.','Then let’s not waste it. The Force put us in the same village for a reason. I intend to find out what.']},
    {t:'I’m not going anywhere.',r:['I know. That’s what makes it different this time.','* He grips your shoulder, hard, and doesn’t let go for a long moment.']}]}]},

 // ---------------- Matt Murdock (Faith) ----------------
 matt:{
  level:[
   {open:['* Matt is wrapping his knuckles in the boxing shed. He tilts his head toward you before you say a word.','Your heartbeat’s steadier than it was a month ago. Whatever you’re doing, don’t stop.'],opts:[
    {t:'Spar with me?',r:['Sure. I’ll even keep my eyes closed. Oh, wait.','* He grins and slips your first three jabs without moving his feet.']},
    {t:'You can hear that?',r:['I can hear the baker two streets over burning the rolls. Your heart’s the more inspiring story.']}]},
   {open:['Foggy and I used to eat cheap food on a fire escape and argue about whether God had a sense of humor.','I think He does. He made me a lawyer. Grab a plate, counselor.']},
   {open:['Confession’s on Saturdays. I go every week. Not because I’m a good man. Because I’m trying to be one.','You’re doing the same thing, I think. Showing up even when you don’t feel holy.']},
   {open:['* He walks the village wall with you at dusk, one hand trailing the stones.','The thing about getting knocked down is you have to decide to get up before you feel ready. Every time.'],opts:[
    {t:'How many times have you been knocked down?',r:['This week? Or total? I stopped counting. The getting up is what I count.']},
    {t:'I’ve been getting up.',r:['I know. I heard you. You’ve got a real stubborn streak. I respect that in a client.']}]}],
  star:[
   {open:['A star? Careful. I’m Catholic. You’ll give me a guilt complex about deserving it.']},
   {open:['You kept your prayers this week. Even the morning you overslept. I could tell, you came out here humming.'],opts:[
    {t:'Was I humming?',r:['Badly. God doesn’t grade on pitch. Neither do I.']},
    {t:'Some mornings it’s hard to believe.',r:['Some mornings I don’t. I go anyway. Faith that’s never been tested is just a habit you haven’t needed yet.']}]},
   {open:['* He sits on the chapel steps, coat folded beside him, and pats the stone.','Father Lantom told me once that the devil wants you alone. So I make sure I’m not. Thanks for being one of the ones who shows up.']},
   {open:['Here’s my closing argument, {name}. The man I met when you first came here and the man in front of me now? Not the same.','I rest my case.'],opts:[
    {t:'Objection. I’m still a mess.',r:['Overruled. Everyone’s a mess. You’re a mess who keeps his promises. That’s rarer.']},
    {t:'You’ve got a good case.',r:['I always do. Doesn’t mean I always win. This one I’m winning.']}]},
   {open:['* Matt finds you at the chapel after dark. He takes off his glasses, something he never does around people.','I’ve had one brother in my life. Foggy. He saw who I really was and stayed anyway.','I think I’ve got two now.'],opts:[
    {t:'You do. I’ve got your back.',r:['I know. I can hear you mean it. That’s the thing about me, you can’t lie to me even if you wanted to.','* He pulls you into a rough hug and claps your back twice.']},
    {t:'Does Foggy know he has competition?',r:['* He laughs, really laughs.','He’ll demand a seat at the next dinner. Be ready. He’ll bring a spreadsheet about you.']}]}]},

 // ---------------- T’Challa (Faith) ----------------
 tchalla:{
  level:[
   {open:['* T’Challa circles you on the sand, claws sheathed, eyes bright.','In Wakanda we fight at the waterfall for the throne. Here we fight for breakfast. Come. Defend your bread.'],opts:[
    {t:'You’re going to win.',r:['Of course. But you will make me work for it, and that is what I came for.']},
    {t:'Winner cooks.',r:['Then you have chosen a hard fate for yourself. My sister says my cooking is a war crime.']}]},
   {open:['My father taught me that a king must remember where he comes from before he decides where he goes.','You pray before you plan your day. That is the same wisdom. Keep it.']},
   {open:['* He shares a bowl of spiced stew with you by the fire, saying a quiet blessing first.','Gratitude is not weakness. It is the root that keeps a tree standing in the storm.']},
   {open:['Shuri would laugh at me for saying this, but I have been watching your progress the way she watches her machines.','Carefully. And with great pride.'],opts:[
    {t:'Does she laugh at you a lot?',r:['Constantly. It is good for a king. Find someone who laughs at you, {name}. Then keep them close.']},
    {t:'Pride from a king. I’ll take it.',r:['As you should. I do not give it to people who have not earned it.']}]}],
  star:[
   {open:['You honor me. In my country, a gift from a friend is answered with loyalty.','You have mine.']},
   {open:['* He stands with you at the edge of the village garden at dawn, eyes closed.','My ancestors speak to me in silence. I hear them better when I have been faithful in small things. So do you, I think.'],opts:[
    {t:'I wish I heard more.',r:['Listening is a practice before it is a gift. You are practicing. That is enough for now.']},
    {t:'I think I am starting to.',r:['Then do not rush it. A king who rushes his ancestors gets a lecture. Trust me.']}]},
   {open:['My father died before I was ready to be king. I thought I would never be ready.','Then I learned that readiness is built, day after day. You are building it. I see it.']},
   {open:['* He presents you with a woven band of purple thread, the kind worn by his people.','This is given to those who stand with the throne. Wear it or do not. It is yours either way.'],opts:[
    {t:'I’ll wear it.',r:['Good. Then when people ask, tell them the Black Panther calls you friend.']},
    {t:'I don’t deserve this.',r:['That is not your decision to make. A king decides whom he honors. I have decided.']}]},
   {open:['* At sunset, T’Challa kneels and presses his palm to the earth, then rises and faces you.','When I visit the ancestral plane, I walk among the people who made me. One day, you will be among the people I speak of.','Not as a subject. As a brother.'],opts:[
    {t:'Wakanda forever.',r:['* He crosses his arms over his chest in salute, and you mirror him.','Forever. And this village with it.']},
    {t:'Brother.',r:['* He pulls you in, forehead to forehead, a moment of quiet.','Brother. Now go. Your family is waiting, and a king does not keep a family waiting.']}]}]},

 // ---------------- Tavi (Marriage) ----------------
 tavi:{
  level:[
   {open:['* Tavi is losing a game of ludus to himself and looks relieved to see you.','Sit. Play. I need someone to beat who isn’t me.'],opts:[
    {t:'I don’t know the rules.',r:['Excellent. Neither did I when I won Alera. Clever beats experienced more often than you’d think.']},
    {t:'Prepare to lose.',r:['* Twenty minutes later, he’s lost.','Huh. Don’t tell Kitai. She’ll never stop.']}]},
   {open:['You took your wife out last week. I heard about it. Small village. Big ears.','That’s the right move. A marriage is a city you defend every single day, not once with a big battle.']},
   {open:['I had no furycrafting growing up. None. Everyone else could bend wind and fire, and I had to think my way through.','Turns out thinking is a fine weapon. So is paying attention to your wife. Same skill, really.']},
   {open:['* He walks you along the orchard path, chewing an apple.','Kitai once made me run sixty miles to prove I meant something. I did. Then she made me run back.'],opts:[
    {t:'Was it worth it?',r:['Every step. Some loves you earn by distance. Most you earn by staying. You’re doing the staying part well.']},
    {t:'That sounds exhausting.',r:['It was. Marriage to a stubborn woman is the best workout there is. You’ve noticed, I assume.']}]}],
  star:[
   {open:['A star, for me? You understand I’m going to boast about this to Kitai. Loudly. For weeks.']},
   {open:['You’ve been listening to her. Really listening. I can tell because you stopped bringing her problems solutions first.','Took me five years to learn that. You learned it faster.'],opts:[
    {t:'She told me I was doing better.',r:['Then frame that. A wife saying “better” is worth more than any crown I’ve worn.']},
    {t:'I’m still learning.',r:['We all are. The day you think you’ve finished learning your wife is the day she becomes a stranger.']}]},
   {open:['* He leans on the fence, watching the village lights come on.','I won a war and an empire. Neither one mattered as much as coming home to someone who knew me. Remember that on the busy days.']},
   {open:['You know what makes a good First Lord? Not power. Loyalty, and the nerve to apologize first.','You’ve got both. I’ve watched.'],opts:[
    {t:'Apologizing first is hard.',r:['It’s the hardest thing a proud man does. Which is why it works. Pride never kept anyone warm at night.']},
    {t:'Coming from you, that means a lot.',r:['It should. I don’t say it to many people. I mostly say it to mirrors.']}]},
   {open:['* Tavi finds you at the village gate and, without a word, clasps your forearm in the old legion grip.','I fought beside some of the best men in Alera. I’d have trusted you in that line.','You fight for her every day. That’s a harder battle than any I won.'],opts:[
    {t:'I learned it from you.',r:['No. You learned it from her. I just cheered from the walls. Go home, brother. She’s waiting.']},
    {t:'Brothers in the line.',r:['* He tightens his grip and nods once.','Brothers in the line. Now and always. Now, are you staying for dinner, or do I have to win you over with logic?']}]}]},

 // ---------------- Steve Rogers (Marriage) ----------------
 steve:{
  level:[
   {open:['* Steve is running laps around the village pond. He slows to match your pace.','On your left. Sorry. Old joke. Want to keep going?'],opts:[
    {t:'One more lap.',r:['That’s the spirit. One more is how I’ve gotten through everything.']},
    {t:'You’re making me look bad.',r:['I was a skinny kid from Brooklyn once. You don’t look bad. You look like you’re working.']}]},
   {open:['I found an old record player in the market. Thought I’d give it to you. Put on something slow and ask your wife to dance.','Don’t wait for the right time. I learned that one the hard way.']},
   {open:['* He’s cooking eggs over a fire, sleeves rolled up, humming something from the forties.','You spent the evening with her instead of on your phone. I noticed. That’s how you win the long war.']},
   {open:['I made a promise once to a woman. A dance, Saturday, eight o’clock. Took me seventy years to keep it.','You get to keep yours tonight. Lucky man.'],opts:[
    {t:'Did you ever make it?',r:['I did. In the end. And it was worth every lost year. Don’t lose any of yours.']},
    {t:'I’ll keep it.',r:['I know you will. You’ve kept every one this week. I’ve been counting.']}]}],
  star:[
   {open:['A star? I’m flattered. Truly. I’ll put it next to the shield. It’s in good company.']},
   {open:['You know what I admire about you? You still court her. After years. Most men stop.','Keep doing that.'],opts:[
    {t:'She makes it easy.',r:['Then she’s a good woman, and you’re a smart man for noticing. Tell her that, too.']},
    {t:'Some days I forget.',r:['Everyone does. The man who remembers the next day is the one worth marrying. That’s you.']}]},
   {open:['* Steve hands you a faded photograph. A girl in a red dress.','I carried her picture everywhere. You don’t need a picture. You have the real thing every morning. Don’t take that lightly.']},
   {open:['Back in the war, I knew who would hold the line just by watching how they treated the people they loved.','You’d hold the line, {name}.'],opts:[
    {t:'I’d hold it with you.',r:['I know. And I’d want you there. That’s not something I say lightly.']},
    {t:'You give me too much credit.',r:['No. I give you what you’ve earned. That’s the only kind of credit I hand out.']}]},
   {open:['* Steve finds you on the hill overlooking the village, the shield set down beside him for once.','I lost almost everyone I knew. Woke up in a world that didn’t remember me. Bucky was the one who did.','I didn’t expect to find another friend like that. But here you are. Showing up, loving your family. I’m with you till the end of the line.'],opts:[
    {t:'Till the end of the line.',r:['* He grins, that old Brooklyn grin, and offers his hand. You take it, and he pulls you into a hug.','That’s my brother.']},
    {t:'Bucky’s going to be jealous.',r:['* He laughs so hard he has to sit down.','He’ll get over it. Probably by punching you. Affectionately.']}]}]},

 // ---------------- Din Djarin (Fatherhood) ----------------
 din:{
  level:[
   {open:['* Din is teaching the little one to throw a pebble. The pebble goes backwards. The little one coos.','Again.'],opts:[
    {t:'Can I help?',r:['You can try. He only listens to people he trusts.','* The little one reaches for your finger. Din nods once.']},
    {t:'He’s getting better.',r:['He is. Patience. That’s the whole job.']}]},
   {open:['You put your kids to bed on time this week. Read to them. I heard.','That is the Way.']},
   {open:['* He eats alone, helmet tilted away, but leaves a second bowl on the bench for you.','A clan of two is still a clan. Sit.']},
   {open:['I was a foundling. Someone took me in when I had nothing. Now I do the same.','Fatherhood isn’t blood. It’s showing up. You show up.'],opts:[
    {t:'What do I do when I’m tired?',r:['You show up tired. The kid doesn’t need you perfect. He needs you there.']},
    {t:'Who taught you?',r:['No one. I learned by failing. You’re learning faster.']}]}],
  star:[
   {open:['* Din stares at the star for a long moment.','I’ve been paid in a lot of things. This is the first one I don’t want to spend.']},
   {open:['You were on the floor with your kids yesterday. Building something. Laughing.','I saw. Good.'],opts:[
    {t:'You were watching?',r:['I watch everything. It’s a habit. That one was worth watching.']},
    {t:'It was the best part of my day.',r:['It should be. Never let anything take that spot.']}]},
   {open:['* The little one toddles over and grabs your boot. Din doesn’t pull him back.','He doesn’t do that with strangers. You’re not a stranger anymore.']},
   {open:['* Din holds out a small beskar plate, hand-hammered, stamped with a mudhorn.','A signet. For your clan. You and your kids.'],opts:[
    {t:'I’m honored.',r:['You earned it. Every bedtime. Every game. That’s what it’s made from.']},
    {t:'I’m not Mandalorian.',r:['Neither is he. Clan isn’t about armor. It’s about who you protect.']}]},
   {open:['* By the fire, Din reaches up and, for just a moment, lifts his helmet. You see his face.','I don’t do that. Ever. Not for anyone outside my clan.','You’re in my clan now. We’re brothers. That is the Way.'],opts:[
    {t:'This is the Way.',r:['This is the Way.','* He sets the helmet back on, but rests his hand on your shoulder the whole time the fire burns down.']},
    {t:'Thank you for trusting me.',r:['You trusted me with your kids’ stories. Every night. I trust you with my face. It’s a fair trade.']}]}]},

 // ---------------- Logan (Fatherhood) ----------------
 logan:{
  level:[
   {open:['* Logan’s chopping wood. He tosses you the second axe.','You want to be strong? Split that. Don’t talk.'],opts:[
    {t:'Who’s talking?',r:['* He grunts. You think it might be a laugh.']},
    {t:'You split twice as fast.',r:['I’ve had two hundred years of practice, bub. Give it time.']}]},
   {open:['Saw you at the creek with your kid. Skipping stones. You let him win.','Good. Kids remember that stuff longer than anything you buy ’em.']},
   {open:['* He hands you a beer that is very much not a beer, then sits on the porch like a man who has seen everything.','You’re doin’ alright. Don’t make me say it twice.']},
   {open:['Spent a long time thinking I was only good for one thing. Then a kid came along and needed me.','Changes a man. You know that already. I see it on you.'],opts:[
    {t:'What was her name?',r:['Laura. She’s tougher than me. Don’t tell her I said that.']},
    {t:'You’re softer than you look.',r:['Say that again and I’ll show you how soft I am.','* He doesn’t mean it. Probably.']}]}],
  star:[
   {open:['A star. For me. Huh. Somebody hand me a cigar before I get sentimental.']},
   {open:['Your kid ran up to you yesterday. Didn’t even look around first. Just ran.','That’s trust, bub. You built that.'],opts:[
    {t:'I hope I keep it.',r:['You will. Just keep showin’ up. Kids forgive almost everything except absence.']},
    {t:'Did you have that with Laura?',r:['Took a while. Worth every scar. And I got plenty.']}]},
   {open:['* He’s sitting on the fence, staring at the horizon, and doesn’t look at you when he talks.','I lost too many people because I wasn’t there. You’re there. Every night. Don’t ever stop.']},
   {open:['I don’t trust many people. Short list. Mostly dead.','You’re on it.'],opts:[
    {t:'That’s cheerful.',r:['I’m a cheerful guy. Ask anybody. Then run.']},
    {t:'I’m honored.',r:['Don’t be honored. Be careful. People on my list tend to get dragged into fights.']}]},
   {open:['* Logan finds you at the edge of the woods, claws sheathed, eyes tired and honest.','I’ve had family before. Lost ’em. Figured I was done.','Then this village. Then you. Watchin’ you raise those kids right… I got a brother again. Don’t you dare make me lose another one.'],opts:[
    {t:'You won’t lose me.',r:['* He looks at you a long time, then pulls you into a hug that cracks your back.','Good. ’Cause I heal. You don’t. Be careful with yourself.']},
    {t:'Brothers, then.',r:['Yeah. Brothers. And if anybody messes with your kids, they answer to me.']}]}]},

 // ---------------- Peter Quill (Fatherhood) ----------------
 quill:{
  level:[
   {open:['* Quill has his headphones on, dancing badly. He doesn’t stop when he sees you.','Dance-off. Right now. Loser does the dishes.'],opts:[
    {t:'You’re on.',r:['* Two minutes in, a crowd has gathered. Nobody can tell who won. You both do the dishes.']},
    {t:'I don’t dance.',r:['Everybody dances, man. Your kids definitely want to see you dance. Trust me on this.']}]},
   {open:['Yondu was the worst dad in the galaxy. Also kind of the best. Turns out you can be both.','You’re doing a lot better than both, by the way.']},
   {open:['* He hands you a cassette labeled “For the Kids.”','Make ’em a mixtape. Seriously. They’ll keep it forever. I kept mine.']},
   {open:['You took the kids out for ice cream instead of working late. That’s legendary behavior. I’m talking outlaw level.'],opts:[
    {t:'It was just ice cream.',r:['It’s never just ice cream. It’s “Dad picked me.” That’s the whole galaxy, right there.']},
    {t:'Outlaw, huh?',r:['Star-Lord. Legendary outlaw. And you, my friend, are Super-Dad. Not as cool a name, but close.']}]}],
  star:[
   {open:['A star? For me? Oh, I’m gonna tell Gamora. She’s gonna roll her eyes so hard.']},
   {open:['Real talk for a sec. My mom always said I was the light of her life. Your kids feel that from you.','I can tell.'],opts:[
    {t:'I hope they do.',r:['They do. Kids are like radar. They know who’s actually there.']},
    {t:'Your mom sounds great.',r:['She was. Best person I ever knew. You’d have gotten along. She liked good dads.']}]},
   {open:['* He tosses you his old Walkman.','Borrow it. Not forever. Okay, maybe a while. Just play something good with your kids, alright?']},
   {open:['I’m not a great guy, {name}. I steal stuff. I talk too much. I dance at the worst times.','But I show up. So do you. That’s our thing.'],opts:[
    {t:'Our thing.',r:['Our thing. We should get jackets. Matching. With names on the back.']},
    {t:'You’re a great guy.',r:['* He looks away fast and wipes his eye.','Shut up. You’re a great guy. Ugh. Okay. Moving on.']}]},
   {open:['* Quill sits next to you on the roof of the tavern, looking up at the stars.','I spent my whole life looking for a dad. Found one too late to tell him.','Found brothers, though. Guardians. And now you. I’m not gonna wait too late this time. You’re family, man.'],opts:[
    {t:'We’re Guardians.',r:['* He grins, then grabs your shoulder.','Guardians of Everstead. Somebody get us a ship. And snacks.']},
    {t:'You didn’t wait too late.',r:['* He’s quiet a while, then laughs softly.','Yeah. Yeah, I didn’t. Thanks, brother. Now don’t make me cry on a roof.']}]}]},

 // ---------------- Darrow (Fitness) ----------------
 darrow:{
  level:[
   {open:['* Darrow tosses you a wooden blade without warning. You catch it.','Fast. You’re getting fast. Now let’s see if you can hold it.'],opts:[
    {t:'Bring it.',r:['* He brings it. You end up on your back, laughing.','You’re still here. That’s the part that counts.']},
    {t:'Can we start slow?',r:['Slow is fine. Stopping is not.']}]},
   {open:['I counted. You trained four days this week. Not three. Four.','That’s how a burst becomes a habit. And a habit becomes a man.']},
   {open:['* He sits with you after the run, both of you breathing hard, eating bread and salted fish.','Eo would’ve liked you. She liked people who did things instead of talking about them.']},
   {open:['Sevro once told me I had the charm of a rock and the stubbornness of a bigger rock.','He meant it as a compliment. I’m passing it to you.'],opts:[
    {t:'I’ll take it.',r:['Good. Rocks don’t quit. Neither do you.']},
    {t:'Is he as crazy as they say?',r:['Worse. Best friend I ever had. You’d love him.']}]}],
  star:[
   {open:['A star. I was born in the dark, under a mountain. Nobody gave us stars.','I’ll keep this one.']},
   {open:['You know what separates a Red from a Gold? Nothing. Only the will to keep climbing.','You climb, {name}.'],opts:[
    {t:'I fall a lot.',r:['So did I. Every time I hit the ground I learned where the cracks were. Falling is part of climbing.']},
    {t:'I learned from you.',r:['No. You learned from yourself. I just pointed at the hill.']}]},
   {open:['* He presses something into your palm. A small iron ring, rough-forged.','Mine. From the mines. Reminds me I was nothing, and made myself something anyway. Now it’s yours.']},
   {open:['I had a howler’s pack once. Brothers in blood and mud. We swore we’d never leave one behind.','I think you’d have fit right in.'],opts:[
    {t:'I’d have been proud to.',r:['Then consider yourself sworn. Break and we break together.']},
    {t:'I can’t howl.',r:['* He laughs, which he rarely does.','Neither could Sevro. He did it anyway. Badly. Loudly.']}]},
   {open:['* At dawn, Darrow is waiting on the ridge where you first carried stones. He’s holding two packs again.','I watched you go from barely making the hill to running it. You did that. Every morning nobody saw.','I don’t call many people brother. Eo taught me to break the chains. You helped me remember why.'],opts:[
    {t:'Brother.',r:['* He grips your forearm, iron on iron.','Brother. Now pick up your pack. We climb together today.']},
    {t:'Break the chains.',r:['* He lifts his chin and howls at the rising sun. After a second, so do you.','That’s it. That’s the sound of a free man.']}]}]},

 // ---------------- Roy (Fitness) ----------------
 roy:{
  level:[
   {open:['* Roy sprints up to you so fast he almost skids past.','Race you to the windmill! Ready, set… go! Wait, you weren’t ready. Okay, go again!'],opts:[
    {t:'You’re on!',r:['* He wins by a mile, then jogs back to cheer you across the line.','You were way faster than last time! I mean it!']},
    {t:'Give me a head start.',r:['Okay! Ten steps! No, five! Okay, ten! Go go go!']}]},
   {open:['You worked out three days in a row?! That’s like a training montage! Do you hear music? I hear music.']},
   {open:['* He shares his packed lunch with you on a hill, chattering the whole time about the clouds.','Training makes food taste a hundred times better. That’s science. Probably.']},
   {open:['My grandpa told me adventures don’t start when you’re ready. They start when you take the first step.','You take lots of first steps! Every morning!'],opts:[
    {t:'You’re pretty wise for a kid.',r:['I know! Wait. Is that a compliment? I’m taking it as a compliment!']},
    {t:'Your grandpa sounds smart.',r:['He’s the smartest! You should meet him. He’d say you’re a real trainer now.']}]}],
  star:[
   {open:['A STAR?! For me?! I’m gonna tell everyone! I’m gonna tell the whole village! Hold on, I’m gonna tell you again. A STAR!']},
   {open:['You keep going even on the tired days. I saw you walking slow, but you still walked.','That’s like the coolest thing.'],opts:[
    {t:'Slow still counts?',r:['Slow totally counts! Slow is just fast that’s taking its time!']},
    {t:'You keep me going.',r:['Really?! Okay, I’m gonna keep running then. So you keep running. Deal?']}]},
   {open:['* Roy holds out a smooth, glowing stone.','I found it on my first adventure. It’s lucky. You should have it now. You’re lucky, too. Well, not lucky. Hardworking. Same thing!']},
   {open:['When I grow up I wanna be strong like you. Not just muscles strong. The kind of strong where you keep promises.'],opts:[
    {t:'You already are.',r:['* He beams so hard he might float away.','Then we’re both strong! Team strong!']},
    {t:'Keep training and you will be.',r:['I will! And you keep training so I have someone to catch up to!']}]},
   {open:['* Roy sits beside you at sunset, unusually quiet, kicking his feet.','I always wanted a big brother. Somebody to run with. Somebody who’d wait at the finish line.','You always wait for me. Even when I’m way too slow at the hard stuff.'],opts:[
    {t:'I’ll always wait for you.',r:['* He leans against your arm, grinning, then jumps up.','Then let’s go! One more lap, big brother! Last one there is a slowpoke!']},
    {t:'You’re my little brother now.',r:['* He fist-pumps so hard he nearly falls off the bench.','Yes! Best day ever! Wait till I tell my grandpa!']}]}]},

 // ---------------- Grog (Fitness) ----------------
 grog:{
  level:[
   {open:['* Grog is holding a boulder over his head, for no reason, while eating a sandwich.','Oi! Wanna hold the rock? It’s a good rock.'],opts:[
    {t:'Hand it over.',r:['* He sets it in your arms. Your knees buckle, but you hold it.','Hah! See? You got strong! Grog approves.']},
    {t:'Why are you holding a rock?',r:['Why aren’t you holding a rock? That’s the real question.']}]},
   {open:['You did the lifting thing a bunch this week. I counted. On my fingers. Twice.','Lots. It was lots.']},
   {open:['* He drops a whole roast chicken onto your plate and one onto his own.','Muscles need food. Food needs eating. Eat.']},
   {open:['Pike says I should think before I punch. I tried it once. Didn’t like it.','But you think AND lift. That’s like two good things at once.'],opts:[
    {t:'You’re smarter than you let on.',r:['Shh. Don’t tell nobody. It’ll ruin my reputation.']},
    {t:'Who’s Pike?',r:['Best friend. Little. Holy. Hits really hard with a mace. You’d like her. She’d like you.']}]}],
  star:[
   {open:['A shiny thing? For ME? I’m gonna keep it in my special pouch. With the other shiny things. And a tooth.']},
   {open:['You’re getting bigger arms. Grog notices arms.','Wanna arm wrestle?'],opts:[
    {t:'Let’s do it.',r:['* He wins, but slowly, and you swear he’s trying.','Grog had to try! Nobody makes Grog try!']},
    {t:'I value my arm.',r:['Smart. Very smart. Grog respects that. Grog will still ask tomorrow.']}]},
   {open:['* He hands you a battered tankard, dented and enormous.','My drinkin’ cup. Means you’re part of the crew now. Vox Machina, honorary member. Don’t lose it.']},
   {open:['Most people get scared of Grog. You didn’t. You just kept showin’ up and liftin’ stuff.','That’s the best kind of people.'],opts:[
    {t:'You’re not scary.',r:['* He looks offended.','Grog is VERY scary. But also nice. Both!']},
    {t:'Thanks, big guy.',r:['You’re welcome, little guy. Little strong guy.']}]},
   {open:['* Grog sits down heavily beside you, then, very gently, puts one massive arm around your shoulders.','I don’t got many words. Scanlan does the words. But I got this one.','Brother. You’re my brother. That’s it. That’s all.'],opts:[
    {t:'Brother.',r:['* He squeezes, and your ribs creak in the best way.','Good. Now we eat. Brothers eat together. That’s a rule.']},
    {t:'That’s perfect, Grog.',r:['Yeah? I practiced. Don’t tell nobody I practiced.']}]}]},

 // ---------------- Geralt (Fitness) ----------------
 geralt:{
  level:[
   {open:['* Geralt is running sword drills in silence. He nods once at a second sword lying on the ground.','Pick it up.'],opts:[
    {t:'Teach me.',r:['* He walks you through three forms. Corrects your feet twice. Says nothing else.','Better.']},
    {t:'Do I get a warning?',r:['Monsters don’t warn. Neither do I.']}]},
   {open:['Trained every day this week. Good.','Hm.']},
   {open:['* He shares a meal of stew and dark bread with you, carefully, the way he does everything.','Ciri used to complain about the food on the road. I miss that. Don’t take your table for granted.']},
   {open:['Witchers meditate. Clears the head. Stops the mistakes.','You stopped looking at your phone at dinner. Same thing.'],opts:[
    {t:'Did you just compliment me?',r:['Hm. Don’t get used to it.']},
    {t:'Will you show me how to meditate?',r:['Sit. Breathe. Don’t talk. You failed the third part already.']}]}],
  star:[
   {open:['* He looks at the star, then at you.','Hm. Not bad.']},
   {open:['Most men train when they feel like it. You train when you don’t.','That’s the difference.'],opts:[
    {t:'Is that the witcher way?',r:['It’s the only way. Mutations help. Habits help more.']},
    {t:'I don’t always want to.',r:['Nobody does. Want doesn’t matter. Showing up does.']}]},
   {open:['* Geralt tosses you a small vial of something that smells terrible.','Swallow. Don’t ask. You’ll feel it in the morning. Means you’re working hard enough to need it.']},
   {open:['Roach trusts very few people. She let you brush her yesterday.','That’s high praise. Higher than mine.'],opts:[
    {t:'I’ll take Roach’s approval.',r:['You should. She has better judgment than I do.']},
    {t:'What about yours?',r:['* A long silence.','You have it. Don’t make me say it again.']}]},
   {open:['* Geralt finds you on the training ground at dusk, his swords on his back, and sits beside you on the fence.','I don’t have brothers. Witchers are trained apart. Most of us die alone.','But I’d stand beside you. Against anything. That’s all I’ve got to say.'],opts:[
    {t:'Same here, Geralt.',r:['* He nods once. Then, unexpectedly, he smiles.','Good. Then we train at dawn. Together.']},
    {t:'That’s a lot of words for you.',r:['* He snorts.','Used up my month’s supply. Worth it.']}]}]},
};
