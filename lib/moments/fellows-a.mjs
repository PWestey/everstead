// Fellow moments, set A: short pop-ups when the player levels a Fellow (every 5th level, in rotation)
// or gives him a star (star 1..5 in order). See docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; lines starting "* " are narration.

/** @type {Record<string,{level:any[],star:any[]}>} */
export const FELLOW_MOMENTS={
 // ---------------- Obi-Wan (Faith) ----------------
 obiwan:{
  level:[
   {open:['* Obi-Wan tosses you a training staff. There’s still Tatooine sand in the hem of his robe.','Shall we? I’ll go easy on you. Relatively speaking.'],opts:[
    {t:'Don’t go easy.',r:['Oh, very well. Don’t say I didn’t warn you.','* Four moves and you’re on your back. He offers a hand. “Your footwork’s improved. Your guard hasn’t.”']},
    {t:'You always say that.',r:['And I always mean it, right up until I don’t. Anakin never fell for it either.']}]},
   {open:['* He’s on the village steps with a chipped teapot, and pours you a cup before you can say no.','You prayed before you touched your phone this morning. I noticed. That’s the hard part, you know. The first five minutes.']},
   {open:['Qui-Gon used to tell me to mind the present moment. I spent years minding everything else.','You, on the other hand, actually put the phone down at dinner. Twice. I’m almost jealous.'],opts:[
    {t:'What changed for you?',r:['I buried people. Grief is a terrible teacher. Very thorough. I’d rather you skipped that course.']},
    {t:'That was almost a compliment.',r:['Almost. The Council frowned on the full ones. Something about attachment.']}]},
   {open:['* You walk the long way around the pond. He hums something tuneless and says nothing for a good while.','Sorry. Twenty years in a hut on Tatooine and you forget to make conversation. Still, you didn’t reach for your pocket once. Well done.']}],
  star:[
   {open:['A star. Well. I’ve been called a great many things. “Worth investing in” is a new one.','I’ll try not to make you regret it. My record with apprentices is… mixed.']},
   {open:['* He’s meditating by the fountain and cracks one eye open.','You kept your quiet time on Tuesday. The day the kids were sick and nothing went right. That one counted triple.'],opts:[
    {t:'Some days it feels like talking to the ceiling.',r:['I spent years talking to a master who’d died and didn’t answer. Then one day he did. Keep talking.']},
    {t:'I’m learning from you.',r:['Learn faster than I did, please. I had the whole Jedi Temple and still took the scenic route.']}]},
   {open:['I trained a boy once. More gifted than I’ll ever be. I wasn’t enough for him.','So forgive me if I fuss over you. You actually listen. It’s very disorienting.']},
   {open:['* He drapes a worn brown cloak over your shoulders. It smells of woodsmoke and dust.','I wore that through a long wait in the desert. You don’t have to wait for anything. It’s all here. Your wife, your kids, this village.'],opts:[
    {t:'I can’t take your cloak.',r:['Of course you can. I lose them constantly. I’ve left at least four on various battlefields.']},
    {t:'Thank you, Master.',r:['Please don’t. “Master” is for students. You’re a friend. Much harder to come by, in my experience.']}]},
   {open:['* Obi-Wan watches the sunset from the edge of the training ground. “Only one sun,” he mutters. “Still not used to it.”','I had a brother once, you know. I loved him, and I lost him, and I’ve carried it ever since.','I didn’t think I’d get another. Then you kept turning up. Every early prayer, every quiet morning. I saw all of it.'],opts:[
    {t:'You’re my brother too, Ben.',r:['* He laughs, and blinks hard, and pretends it’s the dust.','Ben. Nobody’s called me that in years. All right, then. Brothers. Let’s not waste it this time.']},
    {t:'I’m not going anywhere.',r:['No. I don’t suppose you are. That’s what makes it different.','* He grips your shoulder hard and keeps his hand there a long moment.']}]}]},

 // ---------------- Matt Murdock (Faith) ----------------
 matt:{
  level:[
   {open:['* Matt is taping his knuckles in the boxing shed. His head tilts toward you before you’re through the door.','Your resting heart rate dropped. Don’t look at me like that, I can hear it. Whatever you’re doing, keep doing it.'],opts:[
    {t:'Spar with me?',r:['Sure. I’ll fight blindfolded to make it fair. Oh, right.','* He grins and slips three jabs without moving his feet. “Your left drops when you’re tired. Fix that.”']},
    {t:'You can hear that?',r:['I can hear the baker two streets over burning the rolls again. Your heart’s a nicer story. Fewer swear words.']}]},
   {open:['Foggy and I used to eat cheap lo mein on the fire escape and argue about whether God has a sense of humor.','I say He does. Look at me. Blind lawyer who punches people at night. Grab a plate, counselor.']},
   {open:['I go to confession every Saturday. Father Lantom says I’m his most exhausting parishioner.','You keep praying on the days you don’t feel it. That’s the job. The feelings show up late. Like Foggy.']},
   {open:['* He walks the village wall with you at dusk, fingertips trailing the stones.','My dad was a boxer. Battlin’ Jack. He said the trick is getting up before your legs agree to it.'],opts:[
    {t:'How many times have you been knocked down?',r:['This week, or lifetime? I lost count somewhere around the third building that fell on me.']},
    {t:'I’ve been getting up.',r:['I know. I heard your alarm at five-thirty. And the groan. Mostly the groan. Still counts.']}]}],
  star:[
   {open:['A star? Careful. I’m Catholic. Now I get to spend all week feeling guilty that I don’t deserve it.']},
   {open:['You prayed every morning this week. Even Thursday, when you overslept. You came out here humming. Off key.'],opts:[
    {t:'Was I humming?',r:['Like a garbage truck backing up. God doesn’t grade on pitch. I do, a little.']},
    {t:'Some mornings it’s hard to believe.',r:['Some mornings I don’t believe a word of it. I go anyway. Usually by the second coffee, I do again.']}]},
   {open:['* He’s on the chapel steps, coat folded beside him. He pats the stone.','Father Lantom told me the devil likes you alone. So I try not to be. You make that easy. Sit, you’re blocking the sun I can’t see.']},
   {open:['Closing argument, {name}. The guy who walked into this village and the guy standing here? Different heartbeat. Different man.','The defense rests.'],opts:[
    {t:'Objection. I’m still a mess.',r:['Overruled. Everybody’s a mess. You’re a mess who keeps his word to his kids. The jury’s convinced.']},
    {t:'You’ve got a good case.',r:['I usually do. I don’t usually win. Nelson and Murdock: very noble, very broke. This one I’m winning.']}]},
   {open:['* Matt finds you at the chapel after dark. He takes off the red glasses, which he never does around people.','I’ve had one brother my whole life. Foggy. He found out what I really was and stuck around anyway. Yelled a lot. Stuck around.','Looks like I’ve got two now. God help me.'],opts:[
    {t:'You do. I’ve got your back.',r:['I know. Your heartbeat didn’t even skip. You can’t lie to me, you realize. It drives everyone crazy.','* He hauls you into a rough hug and thumps your back twice, like a boxer in the clinch.']},
    {t:'Does Foggy know he has competition?',r:['* He cracks up, head back, the real laugh he never uses in court.','He’s going to want a seat at dinner. And he will absolutely bring a binder about you. Tabs. Color-coded.']}]}]},

 // ---------------- T’Challa (Faith) ----------------
 tchalla:{
  level:[
   {open:['* T’Challa circles you on the training sand, barefoot, smiling like he knows something you do not.','At Warrior Falls we fought for the throne. Here we fight over the last of the honey bread. Come.'],opts:[
    {t:'You’re going to win.',r:['Probably. But you lasted longer than some of my guards. Do not tell Okoye I said that. She will make them run until dawn.']},
    {t:'Winner cooks.',r:['Then you have doomed yourself. Shuri says my cooking violates several treaties.']}]},
   {open:['My father told me a man who forgets where he comes from will not know where he is going.','You pray before you open your calendar. He would have liked you. He would have told you so at great length.']},
   {open:['* He shares a bowl of spiced stew with you by the fire, and says a quiet blessing over it first.','In Wakanda we give thanks before we eat. You thanked God for this stew before I could. You are getting faster than me.']},
   {open:['Do not tell Shuri I said this. I have been watching your week the way she watches her machines.','Closely. And with more pride than I allow my face to show.'],opts:[
    {t:'Does she laugh at you a lot?',r:['Every day. She calls me “old man.” It is good for a king. Find someone who laughs at you, {name}, and keep them close.']},
    {t:'Pride from a king. I’ll take it.',r:['You should. I do not hand it out freely. Ask M’Baku. He has been waiting for years.']}]}],
  star:[
   {open:['A gift. In Wakanda we answer a gift from a friend with loyalty. I am afraid you are stuck with me now.','That is not a threat. Mostly.']},
   {open:['* He stands at the edge of the village garden at dawn, eyes closed, bare feet in the dew.','When I am faithful in small things, I hear my ancestors more clearly. You prayed every morning this week. I suspect you hear more, too.'],opts:[
    {t:'I wish I heard more.',r:['The first time I went to the ancestral plane, I heard nothing for a long while. Then, my father. Keep listening.']},
    {t:'I think I am starting to.',r:['Then do not rush it. I rushed my ancestors once. My father lectured me for what felt like a full day.']}]},
   {open:['My father died before I was ready to wear the crown. I was certain I would never be ready.','Readiness is not handed to you. It is laid down day after day, like stone. You have been laying stone.']},
   {open:['* He hands you a woven band of purple thread, like those worn at the Wakandan court.','We give this to those who stand with the throne. Wear it, or keep it in a drawer. It is yours either way.'],opts:[
    {t:'I’ll wear it.',r:['Good. When people ask, tell them the Black Panther calls you friend. Then watch their faces. It is very funny.']},
    {t:'I don’t deserve this.',r:['That is not your decision. A king decides whom he honors. Also, I already told Shuri, so it is too late.']}]},
   {open:['* At sunset, T’Challa kneels and presses his palm to the earth, then rises to face you.','When I visit the ancestral plane, I walk among the people who made me. One day I will speak of you there.','Not as a guest of my house. As my brother.'],opts:[
    {t:'Wakanda forever.',r:['* He crosses his arms over his chest, and you do the same.','Forever. And this little village with it. Do not tell my council I called it “little.”']},
    {t:'Brother.',r:['* He pulls you in, forehead to forehead, and holds it a moment.','Brother. Now go home. Your children are waiting, and a king does not keep children waiting. They complain to the queen.']}]}]},

 // ---------------- Tavi (Marriage) ----------------
 tavi:{
  level:[
   {open:['* Tavi is playing ludus against himself and losing. He looks very relieved to see you.','Sit down. Please. I’ve been outmaneuvered by me three times now and it’s terrible for morale.'],opts:[
    {t:'I don’t know the rules.',r:['Perfect. I didn’t know the rules of half the battles I won. Move the little horse. No, the other little horse.']},
    {t:'Prepare to lose.',r:['* Twenty minutes later, he’s lost. He stares at the board.','Don’t tell Kitai. She’ll declare a holiday.']}]},
   {open:['You took your wife to dinner on Friday. Small village. Everybody knows. Max told me twice.','Good. A marriage is a wall you walk every day. Cities don’t fall in the big battle. They fall at the gate someone forgot to check.']},
   {open:['Growing up in the Calderon Valley, every kid could call a fury. Wind, earth, fire. I couldn’t light a candle.','So I learned to pay attention instead. Works on wives, too. Better than fire, honestly.']},
   {open:['* He walks the orchard path with you, eating an apple very loudly.','Kitai once made me run halfway across Alera to prove a point. I did it. She was waiting at the end, not even winded. Infuriating woman.'],opts:[
    {t:'Was it worth it?',r:['Every blister. She married me, didn’t she? You win her by running. You keep her by staying. You’ve been staying.']},
    {t:'That sounds exhausting.',r:['It was. Being married to a Marat beats any Legion training camp. I assume you’ve noticed something similar.']}]}],
  star:[
   {open:['A star? For me? You realize I’m going to boast about this to Kitai. Loudly. At dinner. For a week.']},
   {open:['You’ve been listening to her. Actually listening. You stopped handing her solutions the second she starts talking.','Took me years to learn that. Kitai had to throw a cup at me.'],opts:[
    {t:'She told me I was doing better.',r:['“Better”? From a wife? Frame it. I’ve worn a crown that meant less.']},
    {t:'I’m still learning.',r:['Good. The day you think you’ve got her figured out, she redraws the whole map. Mine does it monthly.']}]},
   {open:['* He leans on the fence, watching the village lamps come on one by one.','I won a war and an empire, and I barely remember the parades. I remember coming home and her asking if I’d eaten. Don’t miss that part.']},
   {open:['You know what makes a decent First Lord? Not furies. Not crowns. Being willing to apologize first.','You did that on Tuesday. I saw. Painful to watch. Very impressive.'],opts:[
    {t:'Apologizing first is hard.',r:['Hardest thing a proud man does. That’s why it works. Pride never once kept me warm in a Calderon winter.']},
    {t:'Coming from you, that means a lot.',r:['It should. I don’t say it to many people. Mostly I say it to Max, and he never listens.']}]},
   {open:['* Tavi meets you at the village gate and grips your forearm in the old legion clasp.','I stood in the line with some of the best men Alera ever produced. I’d have put you right there with them.','You fight for her every single day. That’s a longer campaign than any I ran.'],opts:[
    {t:'I learned it from you.',r:['No, you learned it from her. I just shouted advice from the walls. Go home, brother. She’s waiting, and she knows how long the walk takes.']},
    {t:'Brothers in the line.',r:['* His grip tightens. One short nod, legion style.','In the line. Always. Now, are you staying for dinner, or do I have to out-argue you? I warn you, I’ve been practicing on a Marat.']}]}]},

 // ---------------- Steve Rogers (Marriage) ----------------
 steve:{
  level:[
   {open:['* Steve is running laps around the pond. He slows down beside you, barely breathing hard.','On your left. Sorry. Sam says I have to quit doing that. Want to keep going?'],opts:[
    {t:'One more lap.',r:['Atta boy. One more is how I got through basic. Ask me about the flagpole sometime.']},
    {t:'You’re making me look bad.',r:['Pal, I used to weigh ninety pounds with my boots on. You look like a guy putting in the work. That’s all I see.']}]},
   {open:['Found an old record player at the market. It’s yours. Put on something slow tonight and ask your wife to dance.','Don’t wait for the right time. Trust me. I waited a while.']},
   {open:['* He’s frying eggs over the fire with his sleeves rolled up, humming Glenn Miller.','You spent last night with her instead of with your phone. I noticed. Back home we called that courting. Still works.']},
   {open:['I promised a girl a dance once. Saturday, eight o’clock, the Stork Club. Took me about seventy years to show up.','You get to keep yours tonight. Lucky guy.'],opts:[
    {t:'Did you ever make it?',r:['I did. Eventually. She was worth every one of those years. Don’t you spend any of yours.']},
    {t:'I’ll keep it.',r:['I know you will. You kept every one this week. Date night, the dishes, the call at lunch. I’ve been keeping score.']}]}],
  star:[
   {open:['A star? Gosh. I’ll hang it up next to the shield. It’s in good company.']},
   {open:['Know what I admire about you? You still court her. Flowers on a Wednesday, for no reason. Most fellas quit that after the wedding.','Don’t quit.'],opts:[
    {t:'She makes it easy.',r:['Then she’s a swell gal and you’re smart for noticing. Go tell her that, too. Out loud.']},
    {t:'Some days I forget.',r:['Everybody forgets. The guy who remembers the next morning, that’s the guy worth marrying. That’s you.']}]},
   {open:['* Steve shows you a faded photograph tucked inside an old compass. A woman with red lipstick and a no-nonsense look.','I carried her picture into every fight. You don’t need a picture. You get the real thing at breakfast. Don’t ever take that lightly.']},
   {open:['In the war, I could tell who’d hold the line just by how they talked about the folks back home.','You’d hold the line, {name}. No question.'],opts:[
    {t:'I’d hold it with you.',r:['I know. And I’d want you there. I don’t say that to just anybody. Bucky, Sam, Peggy. Short list.']},
    {t:'You give me too much credit.',r:['No, sir. I give you what you’ve earned. That’s the only kind of credit I hand out. Ask Tony, he hated it.']}]},
   {open:['* Steve finds you on the hill above the village, the shield set down beside him for once.','I lost almost everybody. Woke up in a world that didn’t know me. Bucky was the one who remembered.','Didn’t think I’d find another friend like that. Then here you are, loving your family, keeping your word. I’m with you till the end of the line.'],opts:[
    {t:'Till the end of the line.',r:['* He grins, that old Brooklyn grin, and grabs your hand. Then he pulls you into a hug.','That’s my guy. Brothers.']},
    {t:'Bucky’s going to be jealous.',r:['* He laughs so hard he has to sit down on the grass.','He’ll get over it. Probably by punching you. Affectionately. Mostly.']}]}]},

 // ---------------- Din Djarin (Fatherhood) ----------------
 din:{
  level:[
   {open:['* Din crouches, showing Grogu how to throw a pebble. It sails backwards over the kid’s ears. Grogu coos, very proud.','Again.'],opts:[
    {t:'Can I help?',r:['You can try. He only listens to people he trusts. Sometimes not them either.','* The kid wraps his tiny claw around your finger. Din nods once.']},
    {t:'He’s getting better.',r:['He is. Took him six tries to stop eating the pebbles. Patience.']}]},
   {open:['You put your kids down on time this week. Read the long book. Did the voices.','Good. That’s the Way.']},
   {open:['* He eats alone, helmet turned away, but leaves a second bowl on the bench beside him.','Sit. Clan of two. Three, with him. He’ll steal from your bowl.']},
   {open:['I was a foundling. Mandalorians took me in when droids burned my village. Now I do the same.','Blood doesn’t make a father. Being there does. You’re there.'],opts:[
    {t:'What do I do when I’m tired?',r:['Go tired. He doesn’t need you sharp. He needs you in the room.']},
    {t:'Who taught you?',r:['The Armorer, some. Mostly I learned by getting it wrong. You’re getting it wrong less.']}]}],
  star:[
   {open:['* Din turns the star over in his gloved hand for a long moment.','I’ve been paid in credits, beskar, frog eggs. This is the first thing I don’t want to spend.']},
   {open:['You were on the floor with your kids yesterday. Blocks. Some kind of tower. It fell. They laughed.','I saw it. Good work.'],opts:[
    {t:'You were watching?',r:['I watch everything. Old habit. That was worth watching.']},
    {t:'It was the best part of my day.',r:['It should be. Don’t let a job take that spot. I almost did.']}]},
   {open:['* The kid waddles over and grabs your boot with both hands. Din doesn’t pull him back.','He doesn’t do that with strangers. He bit the last one.']},
   {open:['* Din holds out a small beskar plate, hammered by hand, stamped with a mudhorn.','Your signet. Your clan. You and the kids.'],opts:[
    {t:'I’m honored.',r:['You earned it. Bedtimes. Breakfasts. Every game of hide-and-seek. That’s what it’s forged from.']},
    {t:'I’m not Mandalorian.',r:['Neither is he. Clan isn’t armor. It’s who you protect.']}]},
   {open:['* By the fire, Din reaches up and, for one breath, lifts his helmet off. You see his face.','I don’t do this. Not for anyone outside my clan.','You’re clan now. We’re brothers.'],opts:[
    {t:'This is the Way.',r:['This is the Way. Brother.','* He settles the helmet back on, and keeps a hand on your shoulder until the fire burns down to coals.']},
    {t:'Thank you for trusting me.',r:['You let me listen to your kids’ bedtime stories every night. I can show you my face. Fair trade.']}]}]},

 // ---------------- Logan (Fatherhood) ----------------
 logan:{
  level:[
   {open:['* Logan’s splitting wood. He tosses you the second axe without looking.','Wanna get strong? Split that. Quit talkin’.'],opts:[
    {t:'Who’s talking?',r:['* He grunts. It might be a laugh. Hard to tell with him.']},
    {t:'You split twice as fast.',r:['Got a century and change on you, bub. And metal bones. I’m cheatin’ a little.']}]},
   {open:['Saw you down at the creek with your kid. Skippin’ stones. You let him win.','Good. Kids remember that a lot longer than anything you buy ’em. Trust me, I been around a while.']},
   {open:['* He hands you a bottle of something brown with no label and drops onto the porch step like his back hurts.','You’re doin’ alright, bub. That’s all you’re gettin’. Drink.']},
   {open:['Spent a long time figurin’ I was only good for one thing. Claws out. Then a kid showed up who needed me.','Changes you. You know. I can see it on ya.'],opts:[
    {t:'What was her name?',r:['Laura. Meaner than me. Faster, too. Don’t you dare tell her I said that.']},
    {t:'You’re softer than you look.',r:['Say that one more time.','* Snikt. A beat. Then the claws slide back in. He doesn’t mean it. Probably.']}]}],
  star:[
   {open:['A star. For me. Huh. Somebody get me a cigar before I do somethin’ embarrassing.']},
   {open:['Your kid ran at you yesterday. Didn’t look around first. Didn’t check your face. Just ran.','That’s trust, bub. You built that, one bedtime at a time.'],opts:[
    {t:'I hope I keep it.',r:['You will. Keep showin’ up. Kids forgive about anything except you not bein’ there.']},
    {t:'Did you have that with Laura?',r:['Took a while. Took a lotta stab wounds. Worth every one.']}]},
   {open:['* He’s sitting on the fence rail staring at the horizon, and doesn’t look at you when he talks.','Lost too many people ’cause I wasn’t there. You’re there. Every night. Don’t you ever stop.']},
   {open:['I don’t trust a lotta people. Short list. Most of ’em are dead.','Congrats. You’re on it.'],opts:[
    {t:'That’s cheerful.',r:['I’m a ray of sunshine. Ask anybody. Then run.']},
    {t:'I’m honored.',r:['Don’t be honored. Be careful. Folks on my list get dragged into fights. And bars.']}]},
   {open:['* Logan finds you at the edge of the woods, claws in, eyes tired and honest.','Had family before. Lost ’em. Figured that was it for me.','Then this place. Then you. Watchin’ you raise those kids right… I got a brother again. Don’t you dare make me bury another one.'],opts:[
    {t:'You won’t lose me.',r:['* He looks at you a long time, then pulls you into a hug that cracks your spine.','Good. ’Cause I heal. You don’t. Eat a vegetable once in a while.']},
    {t:'Brothers, then.',r:['Yeah. Brothers. And anybody messes with your kids, they deal with me. And the claws.']}]}]},

 // ---------------- Peter Quill (Fatherhood) ----------------
 quill:{
  level:[
   {open:['* Quill’s got his headphones on, dancing badly to something from 1979. He doesn’t stop when he sees you.','Dance-off. Right now. Loser does the dishes. Those are the rules. I didn’t make ’em. Okay, I made ’em.'],opts:[
    {t:'You’re on.',r:['* Two minutes in, a crowd has gathered. Nobody can say who won. You both end up doing the dishes.']},
    {t:'I don’t dance.',r:['Dude. Everybody dances. Your kids want to see you dance so bad. It’s, like, their whole thing.']}]},
   {open:['Yondu was the worst dad in the galaxy. Threatened to eat me, like, weekly. Also kind of the best. Turns out you can be both.','You’re way better than both, by the way. Zero eating threats.']},
   {open:['* He hands you a cassette. On the label, in marker: “AWESOME MIX FOR THE KIDS.”','Make ’em a mixtape. I’m serious. They’ll keep it forever. I kept mine through, like, four space battles.']},
   {open:['You skipped working late to take the kids for ice cream? Dude. That’s outlaw-level behavior. Legendary.'],opts:[
    {t:'It was just ice cream.',r:['It’s never just ice cream. It’s “Dad picked me over the work thing.” That’s the whole galaxy right there.']},
    {t:'Outlaw, huh?',r:['Star-Lord, legendary outlaw. And you’re… Snack-Lord? Dad-Lord. We’ll workshop it.']}]}],
  star:[
   {open:['A star? For me? Okay, I’m telling Gamora. She’s gonna roll her eyes so hard. Rocket’s gonna try to steal it.']},
   {open:['Real talk for a sec. My mom used to call me her little light. Your kids feel like that around you.','I can tell. They do this thing where they look for you in a crowd.'],opts:[
    {t:'I hope they do.',r:['They do. Kids are like Groot. Look like they’re not paying attention. They are totally paying attention.']},
    {t:'Your mom sounds great.',r:['She was. Best person I ever knew. She’d have loved you. She had a thing for good dads. Not, like, a thing thing. You know.']}]},
   {open:['* He tosses you his old Walkman. It’s held together with duct tape and hope.','Borrow it. Not forever. Okay, a while. Play something good with the kids. Not the ballads. Okay, one ballad.']},
   {open:['I’m not a great guy, {name}. I steal stuff. I talk too much. I once had a dance-off to distract a guy who wanted to end the universe.','But I’m there for my people. So are you. That’s kinda our thing.'],opts:[
    {t:'Our thing.',r:['Our thing. We should get jackets. Matching. Maroon. Names on the back.']},
    {t:'You’re a great guy.',r:['* He looks away fast and rubs his eye.','Shut up. You’re a great guy. Ugh. Okay. Moving on. Nobody saw that.']}]},
   {open:['* Quill sits next to you on the tavern roof, staring up like he’s trying to find one particular star.','Spent my whole life looking for a dad. Figured out who he was too late to tell him.','Found brothers, though. Rocket, Drax, Groot. And now you. Not waiting too long this time. You’re family, man.'],opts:[
    {t:'We’re Guardians.',r:['* He grins and grabs your shoulder.','Guardians of Everstead. Somebody get us a ship. And snacks. Mostly snacks.']},
    {t:'You didn’t wait too late.',r:['* He’s quiet a while, then lets out a soft laugh and sniffs.','Yeah. Yeah, I didn’t. Thanks, brother. Now don’t make me cry on a roof. Drax will notice. Drax notices everything, loudly.']}]}]},

 // ---------------- Darrow (Fitness) ----------------
 darrow:{
  level:[
   {open:['* Darrow tosses you a wooden blade without warning. You catch it. Barely.','Good hands. Helldiver hands. Now let’s see if your feet keep up.'],opts:[
    {t:'Bring it.',r:['* He brings it. You end up on your back in the dirt, laughing.','You got up. On Lykos, that was the only thing that ever mattered.']},
    {t:'Can we start slow?',r:['Slow’s fine. Stopping gets you killed. Go.']}]},
   {open:['I counted. Four workouts this week. Not three. Four.','Three’s a good week. Four is a man deciding who he is. Do it again.']},
   {open:['* He drops down beside you after the run, both of you blowing hard, and splits his bread and salt fish with you.','Eo would’ve liked you. She had no patience for talkers. You just laced your boots and went.']},
   {open:['Sevro once told me I had the charm of a rock and the stubbornness of a slightly bigger rock.','From Sevro, that’s a love letter. I’m passing it on.'],opts:[
    {t:'I’ll take it.',r:['Good. Rocks don’t quit. You don’t either. I checked.']},
    {t:'Is he as crazy as they say?',r:['Worse. Paints his face, howls at the moon, on purpose. Best friend I ever had. You’d love him.']}]}],
  star:[
   {open:['A star. I grew up under a mile of rock. We never saw stars. Not once.','This one I’m keeping.']},
   {open:['You know the difference between a Red and a Gold? Lies. That’s all. Lies, and the will to climb anyway.','And you climb, {name}. Every morning.'],opts:[
    {t:'I fall a lot.',r:['So did I. Fell more times at the Institute than Sevro will ever let me forget. Every fall showed me a new handhold.']},
    {t:'I learned from you.',r:['No. You learned from you. I just pointed at the hill and yelled.']}]},
   {open:['* He presses something into your palm. A small iron ring, rough, still black with mine dust.','From Lykos. Reminds me what I was, and what I made of it anyway. It’s yours now. Don’t clean it.']},
   {open:['I had a pack once. The Howlers. Mud, blood, wolf cloaks. We swore we’d never leave one behind.','You’d have fit. You smell better than most of them did.'],opts:[
    {t:'I’d have been proud to.',r:['Then you’re sworn. We break, we break together.']},
    {t:'I can’t howl.',r:['* He laughs, which he almost never does.','Neither could half of them. Sevro did it anyway. Loud. Terrible. Every single time.']}]},
   {open:['* At dawn, Darrow is waiting on the ridge where you first hauled stones. He has two packs again.','I watched you go from barely making this hill to running it. Nobody saw those mornings. I did.','I don’t call many men brother. Eo taught me to break the chains. You reminded me why.'],opts:[
    {t:'Brother.',r:['* He grips your forearm, hard as iron.','Brother. Pick up your pack. We climb together today.']},
    {t:'Break the chains.',r:['* He tips his head back and howls at the rising sun. After a second, so do you.','There it is. That’s what a free man sounds like.']}]}]},

 // ---------------- Roy (Fitness) ----------------
 roy:{
  level:[
   {open:['* Roy sprints up so fast he nearly skids past you. Fuecoco is panting along behind him.','Race you to the windmill! Ready, set… go! Wait, you weren’t ready. Okay, redo! Go!'],opts:[
    {t:'You’re on!',r:['* He wins by a mile, then runs all the way back to cheer you over the line.','You beat your time from last week! I counted! In my head! Mostly!']},
    {t:'Give me a head start.',r:['Okay! Ten steps! No, five! No, ten! Fuecoco, stop eating the finish line!']}]},
   {open:['You worked out three days in a row?! That’s like a training montage! Fuecoco, do you hear music? I hear music!']},
   {open:['* He shares his packed lunch with you on a hill and talks about clouds the whole time. One looks like a Wingull.','Food tastes way better after training. It’s science. Probably. Liko says it’s not science.']},
   {open:['My grandpa says adventures don’t wait for you to be ready. You just gotta start walking.','And you start every morning! Even when it’s freezing!'],opts:[
    {t:'You’re pretty wise for a kid.',r:['I know! Wait. Was that a compliment? I’m counting it as a compliment!']},
    {t:'Your grandpa sounds smart.',r:['He’s the smartest! He’d say you’re a real trainer now. Not a Pokémon trainer. A you trainer!']}]}],
  star:[
   {open:['A STAR?! For me?! I’m telling everybody! The whole village! Hold on, I’m telling you again. A STAR!!']},
   {open:['You keep going on the tired days too. I saw you walking super slow yesterday, but you didn’t stop.','That’s, like, the coolest thing ever.'],opts:[
    {t:'Slow still counts?',r:['Slow totally counts! Slow is just fast taking the long way!']},
    {t:'You keep me going.',r:['Really?! Okay, then I gotta keep running so you keep running. Pinky promise? Deal!']}]},
   {open:['* Roy holds out a smooth, glowing pebble in both hands, like it’s really, really important.','I found it on my very first adventure! It’s lucky! You should have it. You’re lucky too. Well, not lucky. Hard-working. That’s basically lucky!']},
   {open:['When I grow up I wanna be strong like you. Not just muscles. The kind where you keep your promises to your kids.'],opts:[
    {t:'You already are.',r:['* He grins so wide it looks like it hurts.','Then we’re both strong! Team Strong! I’m making a flag!']},
    {t:'Keep training and you will be.',r:['I will! And you keep training so I have someone to chase!']}]},
   {open:['* Roy sits beside you at sunset, unusually quiet, swinging his feet.','I always wanted a big brother. Somebody to run with. Somebody who waits at the finish line.','You always wait for me. Even when I’m super slow at the hard stuff.'],opts:[
    {t:'I’ll always wait for you.',r:['* He leans on your arm for a second, grinning, then jumps up.','Then come on! One more lap, big brother! Last one there is a Slowpoke!']},
    {t:'You’re my little brother now.',r:['* He fist-pumps so hard he almost falls off the bench.','YES! Best day ever! Wait till I tell Grandpa! And Fuecoco! Fuecoco, wake up!']}]}]},

 // ---------------- Grog (Fitness) ----------------
 grog:{
  level:[
   {open:['* Grog is holding a boulder over his head, for no reason, while eating a sandwich with his other hand.','Oi! You wanna hold the rock? It’s a real good rock. I named it Rock.'],opts:[
    {t:'Hand it over.',r:['* He plops it into your arms. Your knees buckle, but you hold it.','HAH! Look at you! Little arms got big! Grog approves!']},
    {t:'Why are you holding a rock?',r:['Why AREN’T you holdin’ a rock? Think about it. Take your time.']}]},
   {open:['You did the liftin’ thing loads this week. I counted. On my fingers. Ran outta fingers. Used Scanlan’s.','That’s loads. Good job, buddy.']},
   {open:['* He drops a whole roast chicken onto your plate, then three onto his.','Muscles need meat. Meat needs eatin’. Eat. That’s the whole plan.']},
   {open:['Pike says I should think before I punch. Tried it once. Got punched first. Didn’t like it.','But you do the thinkin’ AND the liftin’. That’s two things. At once!'],opts:[
    {t:'You’re smarter than you let on.',r:['Shh! Don’t tell nobody. Scanlan’ll start makin’ me read stuff.']},
    {t:'Who’s Pike?',r:['Best friend. Real little. Real holy. Hits real hard with a mace. She’d heal you, then yell at you.']}]}],
  star:[
   {open:['A shiny thing? For ME? Goin’ in my special pouch. With the other shiny things. And a tooth. Not my tooth.']},
   {open:['Your arms are gettin’ bigger. Grog notices arms. Grog always notices arms.','Arm wrestle. Now.'],opts:[
    {t:'Let’s do it.',r:['* He wins, but slowly, and his face goes red.','Grog had to TRY! Nobody makes Grog try! Again! Again!']},
    {t:'I value my arm.',r:['Smart. Real smart. Grog respects it. Grog’s gonna ask again tomorrow, though.']}]},
   {open:['* He hands you a battered tankard, dented and roughly the size of your head.','My drinkin’ cup. Means you’re in the crew. Vox Machina, honorary. Don’t lose it. Don’t let Scanlan drink outta it.']},
   {open:['Most folks get scared of Grog. You didn’t. You just kept comin’ round and liftin’ stuff with me.','That’s the best kinda people.'],opts:[
    {t:'You’re not scary.',r:['* He looks deeply offended.','Grog is VERY scary! Grog is also nice! Grog is BOTH!']},
    {t:'Thanks, big guy.',r:['You’re welcome, little guy. Little strong guy. Medium guy, soon.']}]},
   {open:['* Grog sits down heavily beside you, then, very carefully, puts one huge arm around your shoulders.','I don’t got a lotta words. Scanlan does the words. Words are his thing. But I got one.','Brother. You’re my brother. That’s it. That’s the word.'],opts:[
    {t:'Brother.',r:['* He squeezes. Something in your back pops. It feels great.','Good. Now we eat. Brothers eat together. That’s a rule. I just made it.']},
    {t:'That’s perfect, Grog.',r:['Yeah? I practiced. On the rock. Don’t tell nobody I practiced.']}]}]},

 // ---------------- Geralt (Fitness) ----------------
 geralt:{
  level:[
   {open:['* Geralt is running sword drills in silence. He nods at a second blade lying in the grass.','Steel one. Pick it up.'],opts:[
    {t:'Teach me.',r:['* Three forms. He kicks your back foot into place twice. Not one other word.','Better.']},
    {t:'Do I get a warning?',r:['Drowners don’t warn you. Neither do I.']}]},
   {open:['Seven days. Didn’t skip one.','Hm.']},
   {open:['* He shares stew and dark bread with you, eating slowly, the way he does everything.','Ciri used to complain about the food on the road. Every night. Miss that. Eat with your kids while they still complain.']},
   {open:['Witchers meditate before a hunt. Clears the head. Keeps you from walking into a nest.','Saw you leave your phone in the other room at dinner. Same idea.'],opts:[
    {t:'Did you just compliment me?',r:['Hm. Won’t happen again.']},
    {t:'Will you show me how to meditate?',r:['Sit. Breathe. Don’t talk. You failed step three.']}]}],
  star:[
   {open:['* He turns the star over, sniffs it, then pockets it.','Hm. Not bad. Yen’s going to ask where I got it.']},
   {open:['Saw you out running Monday. In the sleet. Didn’t look like you wanted to be there.','Went anyway. Hm. Good.'],opts:[
    {t:'Is that the witcher way?',r:['Only way. Mutations help. Habits help more. Mutations hurt more, too.']},
    {t:'I don’t always want to.',r:['Nobody wants to. Wanting’s got nothing to do with it.']}]},
   {open:['* Geralt tosses you a little vial. It smells like something died in a swamp.','Drink. Don’t ask. Not Thunderbolt, that’d kill you. It’s for sore muscles. You’ve earned sore.']},
   {open:['Roach doesn’t like people. Bit Jaskier twice. Let you brush her yesterday.','From her, that’s high praise. Higher than mine.'],opts:[
    {t:'I’ll take Roach’s approval.',r:['You should. Better judgment than me. Hates Jaskier too.']},
    {t:'What about yours?',r:['* Long silence. He tightens a strap that didn’t need tightening.','You have it. Don’t make me say it twice.']}]},
   {open:['* At dusk Geralt finds you on the training ground, swords on his back, and leans on the fence beside you.','Witchers don’t have brothers. Trained apart. Most of us die on the road. Alone.','But I’d stand next to you. Against anything. That’s it. That’s the speech.'],opts:[
    {t:'Same here, Geralt.',r:['* He nods once. Then, unexpectedly, the corner of his mouth lifts.','Good. Dawn. Bring water.']},
    {t:'That’s a lot of words for you.',r:['* He snorts. Might be a laugh.','Used up a month’s worth. Worth it. Don’t tell Jaskier. He’ll write a song.']}]}]},
};
