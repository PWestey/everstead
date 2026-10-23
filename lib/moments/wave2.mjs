// Second-wave moments: Fellows (level every 5th level, star 1..5) and Kay's family visits and gifts.
// See docs/WRITING-BRIEF.md. M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{level:any[],star:any[]}>} */
export const FELLOW_MOMENTS={
 // ---------------- Uther (Faith) ----------------
 uther:{
  level:[
   {open:['* Uther is polishing his warhammer on the chapel steps. He doesn’t look up.','You were up before the sun to pray. Good. Forty years I’ve told squires the Light keeps no hours for their comfort.'],opts:[
    {t:'Half the time I’m barely awake for it.',r:['So were half my squires. Kneel anyway. The meaning catches up with you. It did with me, eventually.']},
    {t:'You saw that?',r:['I see everything from these steps. Old habit from Northshire. Most of my squires disappointed me. Not you. Not yet.']}]},
   {open:['When we founded the Silver Hand, it was five of us and a borrowed chapel. Archbishop Faol gave us a year.','We met every morning anyway. That’s the entire secret, and nobody ever believes me.']},
   {open:['* He pushes a battered libram into your hands. The spine is held together with twine.','One page a day. Not ten. I know your type. Ten on Monday, nothing by Friday.'],opts:[
    {t:'Just one page?',r:['One. Read it at breakfast, chew on it at work, argue with it at supper. Then turn the page.']},
    {t:'This is yours, though.',r:['I know every word. I’ve had it since Lordaeron still had a king. Better it falls apart in your hands than on my shelf.']}]},
   {open:['* You stand watch together at the village gate as the light goes gold.','Nothing came last night either, {name}. We stand here anyway. Same as your prayers. I’ve seen you standing.']}],
  star:[
   {open:['A star. Hm. King Terenas pinned a medal on me once. I lost it inside a week.','I won’t lose this. And you’ll not tell the squires I said so.']},
   {open:['* He’s kneeling at the chapel altar when you come in. He shifts over to make room without a word.','Kneel. Not because I said so. A man ought to remember now and then he isn’t the biggest thing in the room. Me included.'],opts:[
    {t:'Kneel beside him.',r:['* You pray in silence. When you stand, he gives you one short nod, the one he saves for soldiers who held the line.']},
    {t:'What do you pray for?',r:['Strength. And names. People I failed. Stratholme, mostly. The list is longer than I like.']}]},
   {open:['I trained a prince once. Quick, brave, the whole kingdom adored him. I won’t say his name in a chapel.','I saw him slipping and kept my mouth shut too long. If you start to slip, I will say something. Loudly.'],opts:[
    {t:'Deal. And I’ll say something to you.',r:['Good. Be blunt. I can take it. I’m told bluntness is my best and worst quality, usually by the same people.']},
    {t:'You’d really call me out?',r:['In front of witnesses, if that’s what it takes. That’s what love looks like on a paladin. Not pretty. Loud.']}]},
   {open:['* Uther raps his gauntlet against your breastplate and listens to the ring.','Sound. Better than half the plate in Stormwind. You keep your small promises, and it shows in how you stand.']},
   {open:['* At dusk Uther leads you into the chapel. Candles burn along every wall.','I’ve knighted plenty of men for one brave afternoon. You I’m knighting for a few hundred dull mornings. They count more.','Kneel, brother.'],opts:[
    {t:'Kneel.',r:['* The hammer touches each shoulder, lighter than you expected.','Rise, Knight of the Silver Hand. I’ve said that to a lot of men. I meant it more this time.']},
    {t:'I don’t deserve this.',r:['None of us do. That’s rather the point of grace. Now kneel, before I lose my patience and my composure both.','* His voice cracks on the last word. He doesn’t bother hiding it.']}]}]},

 // ---------------- Saradomin (Faith) ----------------
 saradomin:{
  level:[
   {open:['* The air by the chapel goes still and very bright. Saradomin is sitting on the step, as if he always was.','Hello, little one. You talked to me this morning before your coffee. I heard all of it. I hear all of it.'],opts:[
    {t:'Even the mumbling?',r:['Especially the mumbling. Zamorak’s lot shout. Mine mumble into pillows. I prefer the pillows.']},
    {t:'That’s a lot, honestly.',r:['* His laugh is warm, like sun on Falador’s white walls.','It ought to be. And yet here I am on your step, getting dust on my robes. Both are true.']}]},
   {open:['I fought a war that lasted four thousand years. Guthix finally threw us all out of the world for squabbling.','And what I came back to find moving is a man praying every morning without being told to. Forgive me. I’m fond of it.']},
   {open:['* He holds out his palm. A small white star sits in it, glowing like an ember that doesn’t burn.','People think order means rules and walls. Ask a gardener. It’s a trellis. You grow up it.'],opts:[
    {t:'So what’s growing?',r:['You. Your children. Your marriage. Half this village leans on what you do when nobody’s looking.']},
    {t:'Can I keep the star?',r:['You already have one. I put it there before you were born. I only dropped by to see if it was lit. It is.']}]},
   {open:['Do you know why I ask for faithfulness and not greatness?','Great servants get ideas. More than one has tried for my throne. The faithful ones just keep praying. I prefer them.']}],
  star:[
   {open:['* For a moment the whole sky over Everstead seems to lean in.','For me? I’ve had armies kneel on command. Nobody commanded this. That’s why I’m keeping it.']},
   {open:['You doubted me last Tuesday. Don’t look so startled. I notice that too.','* There’s no anger in it. Only a patience older than the Wilderness.'],opts:[
    {t:'I’m sorry.',r:['Don’t be. Doubt is a door. You walked back through it on your own. That’s rather the whole of faith, little one.']},
    {t:'Do you ever doubt?',r:['I doubted mortals would ever choose order on their own. Then I met a few like you. Being wrong was a nice change.']}]},
   {open:['* He walks beside you through the fields. The wheat bows as he passes, and he looks a little pleased about it.','I spent ages fighting over Gielinor. I’d do it again for one family saying grace over cold potatoes.']},
   {open:['I see the man you were and the man you’re turning into. I love them both.','I’ll admit I’m fonder of the second. He prays on time.'],opts:[
    {t:'Did a god just make a joke?',r:['Who do you think invented laughter? Not Zamorak, I promise you. I just ration it.']},
    {t:'I want to keep becoming him.',r:['Then come back tomorrow morning. I’ll be here. In several thousand years I have never once been late.']}]},
   {open:['* Light fills the chapel. Not blinding, just everywhere. Saradomin kneels so his eyes are level with yours.','I have icyene, white knights, priests by the thousand. I didn’t come tonight looking for another servant.','I came to ask if I might call you friend. Will you have me?'],opts:[
    {t:'Always.',r:['* He rests a huge, gentle hand on your head, and everything you’re carrying gets lighter.','Then walk with me, friend. Every morning you’ve got left. I’m not letting go.']},
    {t:'Why me?',r:['Because you kept picking me when nobody was watching. I was. I always am.','* Somewhere above, a bell rings that no hand has touched.']}]}]},

 // ---------------- Malfurion (Marriage) ----------------
 malfurion:{
  level:[
   {open:['* Malfurion kneels by a moonwell, antlers catching the last of the evening light.','Home before dark three nights this week. Your wife noticed. So did I.'],opts:[
    {t:'How do you know that?',r:['The trees talk. Dreadful gossips, every one of them. Lately it’s mostly about you.']},
    {t:'It’s harder than it sounds.',r:['I know. I slept through centuries in the Dream while Tyrande held the line alone. Staying awake for yours is no small thing.']}]},
   {open:['Tyrande has waited for me more times than I can count. Some of it was duty. Some of it, honestly, was me hiding in the Dream.','Don’t make her wait, {name}. Not even on a Tuesday.']},
   {open:['* He presses a seed into the soil between you. It sprouts while you watch.','Cenarius taught me this. Plant it, then come back every day. Miss a week and the weeds start having opinions.'],opts:[
    {t:'What’s the best fertilizer?',r:['Attention. Listening without trying to fix it. Flowers for no reason. I learned every one of those late.']},
    {t:'You make it sound simple.',r:['It is simple. It isn’t easy. Took me about ten thousand years to learn the difference.']}]},
   {open:['* You walk the edge of the forest together at moonrise.','The last time I woke from the Dream, I looked for her face before I looked for my staff. Be the face she looks for.']}],
  star:[
   {open:['A star. Young me would have studied it for a century and written three scrolls. Old me will just say thank you.']},
   {open:['I once asked Tyrande what she wanted most from me. I was braced for something heroic.','She said supper. Me, at the table, on time. Ten thousand years of study, and the answer was supper.'],opts:[
    {t:'Were you home for supper?',r:['Not nearly enough. That’s why I’m telling you. Learn from an old fool. It’s cheaper.']},
    {t:'I’ll be home for supper.',r:['* His eyes glow a soft silver.','Then you’re ahead of where I was at your age. And I was Cenarius’s best student.']}]},
   {open:['* He hands you a moonflower, petals still wet with dew.','For your wife. Leave me out of it. Say you saw it and thought of her. With luck, by the time you get home that’ll be true.']},
   {open:['You’ve been asking her about her day. And then actually staying for the answer. The grove noticed.','That’s the slow kind of magic. It outlasts anything I can do with a staff.'],opts:[
    {t:'I’m trying to be awake for it.',r:['That’s all it is, brother. Awake. In the room. You’re doing it.']},
    {t:'Teach me more.',r:['Kiss her before you leave the house. Every time. I missed thousands of those. I count them now.']}]},
   {open:['* Under the great tree, Malfurion lays a hand on the bark, and every leaf above you turns silver at once.','I had one brother, and Illidan… well. You know how that went. I didn’t expect to trust another.','You’ve shown me the husband I should have been. One who stays awake.'],opts:[
    {t:'You’re my brother, Malfurion.',r:['* He grips your forearm, and the whole grove seems to hum.','Then this grove is yours too. Bring her here some evening. It will bloom for her. I’ll see to it.']},
    {t:'You came home in the end.',r:['I did. And she was still there. You get that chance every single evening. Don’t waste one.']}]}]},

 // ---------------- Thrall (Marriage) ----------------
 thrall:{
  level:[
   {open:['* Thrall is splitting firewood outside his hut. The Doomhammer leans against the wall, ignored.','Warchief or husband, the axe swings the same. Grab one, brother. Aggra wants this pile done by dark.'],opts:[
    {t:'Pick up an axe.',r:['* You split wood side by side until the pile is taller than you are.','Aggra says a man who chops wood for his family thinks clearer. She’s usually right. Don’t tell her I said so.']},
    {t:'You could lift that hammer instead.',r:['I could. The stove doesn’t care how mighty my arm is. It cares whether somebody fed it.']}]},
   {open:['I led my people out of the internment camps. I thought nothing would ever be harder.','Then Aggra told me, in front of half of Nagrand, that I wasn’t listening. She was right. I’ve fought easier wars.']},
   {open:['* He sits cross-legged by the fire, eyes closed, palms open.','The elements talk if you’re quiet enough. So does your wife. You’ve been quieter lately. The good kind.'],opts:[
    {t:'What do you mean?',r:['Fewer distractions. More eyes on her. A shaman notices. So does a wife, believe me.']},
    {t:'I’m learning to listen.',r:['Good. It’s the oldest magic I know. Even the earth listens before it moves.']}]},
   {open:['On a battlefield, courage is easy. At home it’s saying “I was wrong” before she has to.','You did that this week. I can tell. You’re walking lighter.']}],
  star:[
   {open:['* Thrall grins, tusks and all.','A star for an old orc? Lok’tar, brother. Aggra will say it’s gone to my head. She’ll be right.']},
   {open:['I gave up being Warchief to raise Durak and stand beside Aggra. Plenty called it weakness. Garrosh said it loudest.','Look where his road went. I don’t regret mine.'],opts:[
    {t:'Do you miss leading?',r:['Some days. Then Durak laughs at breakfast and Aggra steals my bread, and I remember why I chose this.']},
    {t:'I’m trying to make the same choice.',r:['I know. I see it in your days. You keep picking your home over the noise. I respect that more than any title.']}]},
   {open:['* He hands you a wolf-tooth charm on a leather cord.','In Nagrand a husband gives his mate one of these when he renews his vow. I won’t tell you which night. Just make it a good one.']},
   {open:['Aggra and I fought, early on. Loud. The kind that scares the wolves off.','Then we learned to fight the problem, not each other. You and your wife are on the same side, brother. Remember that when it gets loud.'],opts:[
    {t:'Same side. Always.',r:['Good. I’ve seen what breaks a Horde. Two people standing together at home are harder to break.']},
    {t:'Who wins when you argue?',r:['* He laughs loud enough to scatter the crows.','Aggra. Every time. I’ve never been happier to lose anything.']}]},
   {open:['* Thrall lights a fire on the hill. The flames jump high, crackling with something older than wood.','The spirits asked me tonight who stands with me. I told them your name. They seemed to know it already.','You keep your word, {name}. To her, to your children, to yourself. That’s what I look for in a brother.'],opts:[
    {t:'For the home. For the family.',r:['* He raises the Doomhammer, and thunder answers out of a clear sky.','Lok’tar ogar, brother! We choose victory. Every day, at every supper table!']},
    {t:'I stand with you, Go’el.',r:['* He pulls you into a crushing hug that lifts your feet off the ground.','Only family calls me that. You’re family now. I don’t hand that name out.']}]}]},

 // ---------------- Cal (Marriage) ----------------
 cal:{
  level:[
   {open:['* Cal is crouched by a speeder with BD-1 on his shoulder, beeping running commentary.','BD says you made it home on time all week. He’s impressed. He’s hard to impress. He’s still mad about Greez’s soup.'],opts:[
    {t:'Tell BD thanks.',r:['* BD-1 chirps and does a little hop.','He says you’re welcome. Also your posture’s bad. He’s very honest. It’s a problem.']},
    {t:'Is BD keeping tabs on me?',r:['He keeps tabs on everybody. He’s a scanner droid with opinions. Mostly about snacks and my haircut.']}]},
   {open:['After the Purge I kept my head down for years. Didn’t let anybody close, because losing people hurts.','Then Merrin showed up and I figured out keeping everyone at arm’s length hurts more. Took me a while.']},
   {open:['* He’s stitching a torn poncho seam, slowly, like it really matters.','Merrin picked this one out. I can’t sew. Doing it anyway. Pretty sure that’s most of love. Small stuff, done badly, on purpose.'],opts:[
    {t:'That’s weirdly wise.',r:['Don’t tell anyone. I mostly learned it from people yelling at me on a ship.']},
    {t:'Want help?',r:['Please. I’ve stabbed myself four times. BD’s laughing. Droids can laugh, by the way. It’s rude.']}]},
   {open:['* You sit on the Mantis ramp, watching the stars come out.','Hiding’s easier. I did it for five years on a scrapyard. You’re not hiding from her. I can tell.']}],
  star:[
   {open:['A star? Whoa. Okay. BD, are you getting this? He’s getting this. That’s the happy beep. You got the happy beep.']},
   {open:['I used to think love just happened to you. Like a blaster bolt you didn’t see coming.','Now I think it’s more like climbing. You pick it every morning. One handhold, then the next one.'],opts:[
    {t:'You climb a lot.',r:['I climb everything. Walls, cliffs, giant frogs, my feelings. The feelings are the worst.']},
    {t:'I choose her every morning.',r:['Yeah, I can tell. You look at her the way the crew looks at Greez when dinner actually turns out. Grateful. Little scared.']}]},
   {open:['* He hands you a tiny holoprojector. A blue heart blinks above it.','BD made this. For your wife. He wants you to say it’s from you. He takes no credit. He’ll bring it up later, though.']},
   {open:['Cere told me once the Order didn’t fall because the Jedi loved too much. They didn’t love enough.','You’ve got that part figured out. Your whole family can see it.'],opts:[
    {t:'I’m still learning.',r:['Same. I’m a Jedi and I still say the dumbest stuff. Merrin forgives me. Usually after laughing at me for a while.']},
    {t:'Thanks, Cal.',r:['Hey, that’s what crew’s for. You’re crew now. No take-backs. BD already logged it.']}]},
   {open:['* Cal ignites his lightsaber in the dark, and the blue light catches both your faces.','I lost everybody once. My master, my friends, all of it. I really thought that was it for me.','Then I got a crew. And now you. So, yeah. Brother.'],opts:[
    {t:'You’ll always have me.',r:['* He grins, eyes a little wet, and taps his saber hilt against your chest.','Then let’s keep each other honest. Pick our families every day. Both of us. Deal?']},
    {t:'Welcome home, Cal.',r:['* BD-1 hops onto your shoulder and gives a soft chirp.','Yeah. Home. BD agrees. He never agrees with me about anything.']}]}]},

 // ---------------- Varian (Fatherhood) ----------------
 varian:{
  level:[
   {open:['* Varian is swinging Shalamayne in the yard. The blade hums every time it cuts the air.','You were there for bedtime every night this week. Don’t look surprised. A king notices who keeps his post.'],opts:[
    {t:'Bedtime is the best part.',r:['It is. I missed years of Anduin’s, bleeding in an arena under another name. Don’t you dare repeat that.']},
    {t:'You’re watching me?',r:['I’m watching to see if you’re a better father than I was. So far you are. It’s infuriating.']}]},
   {open:['Anduin asked me once why I never told him I was proud of him. He was about twelve.','I had no answer. I was proud every day. Just never said it. Say it to yours. Tonight. Out loud.']},
   {open:['* He sits on a crate sharpening the blade, and his voice drops.','Rage made me a great gladiator. Made me a lousy father. Patience is the harder sword. I’m still bad with it.'],opts:[
    {t:'I lose my temper sometimes.',r:['So do I. What matters is that you come back. Get down to their height and say sorry. A king can do it. So can you.']},
    {t:'How did you learn patience?',r:['Badly. Slowly. Mostly from Anduin, who was more patient with me than I ever was with him.']}]},
   {open:['Stormwind will remember me for my wars. Anduin remembers whether I came to his room when he had nightmares.','You keep going to their rooms. Trust me, that’s the part they hold on to.']}],
  star:[
   {open:['A star. Hah. In the arena they called me Lo’Gosh. Ghost wolf. You can just call me Varian. Friends do.']},
   {open:['* He watches the children play tag across the village green, arms crossed.','Anduin was a gentle boy in a rough world. I tried to harden him. He softened me instead. Still annoyed about it.'],opts:[
    {t:'Did that bother you?',r:['At first. Then it saved us both. Let your kids change you. That’s half the job.']},
    {t:'Mine are changing me too.',r:['Good. Means you’re listening. Took me far too long to start.']}]},
   {open:['* He hands you a wooden practice sword, sized for a child.','For your little one. Teach them to stand their ground. Then teach them when to put the sword down. I only ever taught the first part.']},
   {open:['I wasn’t there when Anduin needed me. Spent years trying to make it right.','You’re there now. Don’t let a single year slide. They go faster than any battle I ever fought.'],opts:[
    {t:'I won’t miss it.',r:['See that you don’t. I’ll hold you to it, brother. I have a long memory and a very loud voice.']},
    {t:'Did Anduin forgive you?',r:['He did. Long before I forgave myself. Kids do that. Humbles a king, I’ll tell you.']}]},
   {open:['* On the village wall at dusk, Varian unbuckles Shalamayne and holds it out between you, hilt first.','I’ve fought beside a lot of men. Not many I’d trust with my son. You I’d trust with Stormwind.','For the Alliance, and for the ones at home. Brother.'],opts:[
    {t:'For the ones at home.',r:['* He grips your forearm and roars it at the sky, loud enough for the whole village to hear.','For the Alliance! For our kids! Let them grow up knowing their fathers were there!']},
    {t:'I can’t take your sword.',r:['Not to keep. To swear on. Hand on the hilt. Swear you’ll be there for them, every night you can.','* You do. He nods, and something in his scarred face eases for good.']}]}]},

 // ---------------- Baine (Fatherhood) ----------------
 baine:{
  level:[
   {open:['* Baine sits under a big tree on the hillside, turning a carved totem over in his hands.','The Earth Mother sees what happens under your roof, my friend. She seems pleased. So am I.'],opts:[
    {t:'How can you tell?',r:['Your children laugh louder when you walk past. A father leaves tracks. I was raised by a very good tracker.']},
    {t:'I’m just trying to be around more.',r:['That’s all my father did. Cairne was just… around. Always. It was enough to make me.']}]},
   {open:['My father told me a chieftain is measured by the hands he holds, not the heads he takes. I was young. I rolled my eyes.','He held mine through every storm in Mulgore anyway. Hold your children’s.']},
   {open:['* He hands you a little carved kodo, worn smooth by years of small hands.','My father carved this when I was a calf. Make your children something with your own hands. They’ll keep it longer than anything you buy.'],opts:[
    {t:'I’m not very crafty.',r:['Neither was he. Look at the legs. A crooked toy from Father beats a perfect one from the market.']},
    {t:'You should keep this.',r:['I keep it in here. Carry it a while. Then give it to your little one.']}]},
   {open:['* You walk the plains together as the sun sets red over the grass.','My father’s been gone years, and I still catch myself walking the way he walked. Yours will copy your walk too. Make it a good one.']}],
  star:[
   {open:['A star? My father would laugh from the belly at this. So I’ll laugh for him. Thank you, friend.']},
   {open:['Magatha poisoned the blade that killed my father. For a long while after, anger was all I had.','Then I remembered something he said by the cook fire. Anger is for cooking the meal, not burning down the village.'],opts:[
    {t:'Your father sounds wise.',r:['He was. Stubborn too. Every day I try to measure up. Your kids will say the same of you someday. Hopefully less stubborn.']},
    {t:'I’m sorry he’s gone.',r:['He walks with the Earth Mother now. And with me, every time I choose patience over the spear.']}]},
   {open:['* Baine kneels to help a small child tie a boot. His huge fingers somehow manage the laces.','You do this too. I’ve seen it. Kneeling down. Waiting while they try it themselves. It matters more than you think.']},
   {open:['You’ve been reading to them. Playing on the floor. Being silly when you’re tired and would rather sit.','That was my father’s real strength. Not his arms. His patience.'],opts:[
    {t:'Patience is the hard part.',r:['Patience is all of it. Strength comes free when you’re young. Patience you earn, one evening at a time.']},
    {t:'I learned from watching you.',r:['Then my father’s lessons keep traveling. Him to me, me to you, you to your little ones. He’d like that.']}]},
   {open:['* On the bluff, Baine lights a small fire and scatters cornmeal into the flames.','I asked the Earth Mother to watch over my brothers tonight. Then I asked her for you. Your children. Theirs.','My father would have called you kin. So I will.'],opts:[
    {t:'Kin, then. Always.',r:['* He sets a great, gentle hand on your shoulder.','Then Bloodhoof is your tribe. Walk with the Earth Mother, brother. And walk your children home.']},
    {t:'Your father would be proud of you.',r:['* He says nothing for a long moment. His eyes shine in the firelight.','Thank you, brother. I needed that. From someone who understands.']}]}]},

 // ---------------- Vannaka (Fitness) ----------------
 vannaka:{
  level:[
   {open:['* Vannaka stands at the Edgeville Dungeon entrance, arms crossed, scowling at nothing in particular.','You finished your task. On time. All of it. I’m nearly suspicious.'],opts:[
    {t:'I want another task.',r:['Good. Your new task: fifty push-ups and a walk before supper. Come back when they’re dead.']},
    {t:'Nearly suspicious?',r:['Most adventurers quit by day three. You’re on day forty. I’ve run out of reasons to doubt you. Annoying.']}]},
   {open:['I don’t do compliments. I do tasks.','But I’ll say this once. You’re less soft than when you first came down those stairs. Keep going.']},
   {open:['* He drops a lumpy sack at your feet. It clanks.','Carry that to the well and back. Twice. Don’t drag it.'],opts:[
    {t:'Pick it up.',r:['* It’s heavy. You carry it anyway. Twice.','Hm. Acceptable. Tomorrow I put more rocks in.']},
    {t:'What’s in it?',r:['Rocks. Broken bronze daggers. The excuses of every adventurer who quit before you. Carry it.']}]},
   {open:['Sleep. Water. Food that grew out of the ground. Training that makes you sweat.','No magic. No shortcut. It’s a task like any other. Finish it.']}],
  star:[
   {open:['A star. Hrmph. I don’t take gifts from adventurers. Usually they’re trying to get out of a task. You aren’t. Fine.']},
   {open:['* He flips through a ledger of names. Most are crossed out.','Every name with a line through it quit. Some on day one. Yours is still here. In ink.'],opts:[
    {t:'I don’t plan to quit.',r:['Nobody plans to quit. They just stop coming down the stairs. Don’t stop. That’s the whole plan.']},
    {t:'How many are left?',r:['A handful. Tough ones. You’re turning into one. Don’t make me get the quill out.']}]},
   {open:['You skipped a workout last week. I saw. Then you did two the next day.','I hate skipping. I respect coming back angry.']},
   {open:['I’ve given tasks to heroes who killed dragons. Half of them couldn’t keep a daily habit to save their lives.','You keep yours. That’s rarer than a dragon.'],opts:[
    {t:'Was that a compliment?',r:['It was a fact. I give facts and tasks. Here’s your next task.']},
    {t:'Give me the hardest task you have.',r:['* For a second, Vannaka very nearly smiles.','Come back tomorrow. And the day after. That’s the one nobody finishes.']}]},
   {open:['* Vannaka leads you to the deepest chamber of the dungeon and points at a wall carved with names.','These ones never quit. I carve every name myself. Takes ages. My hands hate it.','* He holds the chisel out to you.'],opts:[
    {t:'Carve your name next to mine.',r:['* He hesitates, then scratches his own name in beside yours.','There. Same wall. Now get out. Your task is to come back tomorrow stronger.']},
    {t:'I earned this?',r:['You earned it. No excuses, no skipped reps. I counted.','* He grips your shoulder like a vice and doesn’t let go for a while.']}]}]},

 // ---------------- Magni (Work) ----------------
 magni:{
  level:[
   {open:['* Magni’s at the forge, sparks flying, sleeves rolled up, beard tucked into his belt for safety.','Ah, there ye are! Finished yer work early, did ye? That’s a lad after me own heart!'],opts:[
    {t:'Teach me to swing a hammer.',r:['* He hands you one, heavy and warm from the fire.','Steady, now. Don’t rush it. A good blade takes as long as it takes. Same as good work.']},
    {t:'How did you know?',r:['The world tells me things now. Mostly she grumbles. But she said ye did good work today.']}]},
   {open:['I was King o’ Ironforge once. Big throne. Bigger crown. Gave me a crick in the neck.','Best days o’ me life were still at the anvil. Honest work, honest sweat, honest pint after.']},
   {open:['* He holds up a fresh axe head, still glowing orange.','See this? Thousands o’ strikes. Each one wee. Each one counted. Yer job’s the same, lad.'],opts:[
    {t:'That’s a lot of strikes.',r:['Aye. And ye’ve put in a fair few already. Keep at it, and one day ye’ll look down and find a masterwork in yer hands.']},
    {t:'What about the bad strikes?',r:['Ye hit it again. A bad strike only ruins a blade if ye walk away after it.']}]},
   {open:['Some folk think deep work’s dull. Sittin’ quiet, doin’ one thing for hours.','That’s just smithin’ for the head, lad. And ye’ve got the knack.']}],
  star:[
   {open:['A star! Ha! I’ll have it set in a mithril ring! Nay, I’ll drink to it first. Then the ring. Then another drink.']},
   {open:['* He leans on the anvil. The tip of his beard is singed again.','Azeroth talks to me now. She’s tired, lad, and hurtin’. But she says folk like ye give her a bit o’ hope.'],opts:[
    {t:'The world thinks about me?',r:['She thinks about everyone who builds instead o’ breaks. Yer on the right side o’ the ledger.']},
    {t:'That’s heavy, Magni.',r:['Aye. I carry it. Sleep a wee bit better knowin’ there’s good workers about. Like yerself.']}]},
   {open:['* He tosses you a jingling pouch of coin.','Yer pay. For good work. Don’t let anyone tell ye honest work isn’t worth its wage. Whoever says that never swung a hammer.']},
   {open:['I let me work swallow me whole for a while. Moira paid for it. Me lass grew up wonderin’ where her da was.','Don’t ye do that. Work hard, then go home. The forge’ll still be here in the mornin’.'],opts:[
    {t:'I’ll keep the balance.',r:['Good. A dwarf who works himself to death gets a grand tomb and a sad family. Pick the better endin’.']},
    {t:'Did your family forgive you?',r:['Moira did. Took years. Worth every one. Go home on time tonight, lad. I mean it.']}]},
   {open:['* Magni plunges a blade into the quench, and steam boils up in a great cloud. He lifts it, shining.','Made this for ye. Took me a week. Every strike, I thought about how hard ye’ve been graftin’.','Ye’re a craftsman now, lad. Brother o’ the forge.'],opts:[
    {t:'To the forge, brother!',r:['* He shoves a tankard into your hand and clanks his against it.','To the forge! To honest work! To brothers who build things! Drink up, ye’ve earned it!']},
    {t:'I can’t accept this.',r:['Ye’ll accept it or I’ll be cross, and nobody wants a cross dwarf. Take it.','* He wipes his eyes and blames the forge smoke.']}]}]},

 // ---------------- Duradel (Work) ----------------
 duradel:{
  level:[
   {open:['* Duradel sits in his hut in Shilo Village, eyes narrowed, perfectly still.','Task complete. On time. Good. I don’t spend words on anything less than results.'],opts:[
    {t:'Give me something harder.',r:['Bold. Three hours of deep work. No interruptions. Then report back.']},
    {t:'Results are what I’m after.',r:['Then we’ll get on. Most who climb up here want praise. All I have is harder tasks.']}]},
   {open:['I don’t take weak adventurers. You need a hundred combat just to speak to me.','You aren’t weak anymore. That’s as close to a compliment as you’ll get.']},
   {open:['* He hands you an enchanted gem. It glows faintly.','Your task: the hardest job on your list. First. Before the inbox.'],opts:[
    {t:'Why the hardest first?',r:['A task you leave alive hunts you all day. Kill it early.']},
    {t:'Consider it done.',r:['I’ll consider it done when it’s done. Go.']}]},
   {open:['A slayer doesn’t stop mid-fight to check his messages.','Phone down. Door shut. One job. That’s how abyssal demons die.']}],
  star:[
   {open:['A star. Hm. You bring me something instead of asking for a task. Unusual. Acceptable.']},
   {open:['* He points at a row of skulls on the shelf, each labeled in small, neat letters.','Every one was a task. Some took days. Some took years. All finished.'],opts:[
    {t:'What’s the oldest one?',r:['The one I nearly gave up on. I didn’t. It sits there to remind me.']},
    {t:'I want my own shelf someday.',r:['Then keep finishing. Every project you close is a skull on the shelf. Metaphorically. Mostly.']}]},
   {open:['You took a hard job this week. Finished it. Didn’t complain.','That I respect. Nothing else.']},
   {open:['Most adventurers want glory. Or loot. You want to provide for your family.','I’ve watched greed eat good slayers. Remember why you work.'],opts:[
    {t:'I work for them.',r:['Then you won’t run out of reasons. Good.']},
    {t:'You have family?',r:['Had. Long ago. I chose the work. Don’t make my choice. Work for them, not instead of them.']}]},
   {open:['* Duradel stands up from his chair. It happens so rarely the whole village seems to hold its breath.','I’ve trained many. Few earned my respect. Fewer earned my name.','You’ve earned both. Brother in the hunt.'],opts:[
    {t:'Brother in the hunt.',r:['* He grips your hand. It’s like shaking hands with a gargoyle.','Then we hunt together. Every task. Every day. None left alive.']},
    {t:'What’s my next task?',r:['* Something like a laugh rumbles in his chest.','Ha. That’s why. Your next task is sleep. Even slayers sleep.']}]}]},

 // ---------------- Albus (Home) ----------------
 dumbledore:{
  level:[
   {open:['* A young Albus is floating a dozen odd socks into a tidy pile, humming something slightly off-key.','You did the dishes before bed. I find that genuinely admirable. Most wizards wave a wand and hope for the best.'],opts:[
    {t:'Teach me that sock spell.',r:['I would, but you’d lose the socks anyway. Everyone does. I suspect a conspiracy. Possibly gnomes.']},
    {t:'You’re humming?',r:['Chores go better with music. Aberforth throws boots at me for it, but Aberforth throws boots at everything.']}]},
   {open:['I grew up in Godric’s Hollow, in a house that was mostly arguments and goats. Aberforth’s goats.','Yours sounds warmer. You smile when you talk about it. I notice these things.']},
   {open:['* He clears a cluttered table with one patient sweep of his hand.','I spent my youth chasing enormous ideas. I very nearly missed what was right in front of me.'],opts:[
    {t:'What was in front of you?',r:['My sister. My brother. A house that needed me home. I learned it too late. You’re learning it in time.']},
    {t:'Grand ideas are fun, though.',r:['Oh, enormously. But a tidy kitchen and children who feel safe beat most of mine. Some of mine were rather bad.']}]},
   {open:['Hogwarts became my home because I decided it would be. One classroom, one student, one cup of tea.','You’re doing it with an actual house. Much harder. Far fewer house-elves.']}],
  star:[
   {open:['* He beams, eyes bright behind his spectacles.','A star! How marvelous. It’s going in my collection of curious objects, between the socks and a rather rude Chocolate Frog card.']},
   {open:['Do you know what the most powerful magic is? People always guess something with a wand.','It’s making a place where people feel safe. You’ve been doing it all week, mostly with a sponge.'],opts:[
    {t:'I just cleaned the kitchen.',r:['Exactly. A clean kitchen says “I thought of you” to whoever walks in next. That’s a charm, whether you meant it or not.']},
    {t:'You make chores sound noble.',r:['Well, they are. I’d knit them a banner if I had the wool. I do enjoy a good knitting pattern.']}]},
   {open:['* He hands you a small enchanted broom that sweeps by itself, slightly crooked.','For the corners. It isn’t perfect. It veers left. But it keeps trying, which I find rather endearing.']},
   {open:['I used to believe I was meant for great things. It turns out the great things were mostly small.','Fixing the porch. Making the bed. Being home for supper. Nobody writes books about it, which is a pity.'],opts:[
    {t:'You sound different from your stories.',r:['I’m younger here. Still learning, and wrong rather often. Perhaps you’re teaching me as much as I’m teaching you.']},
    {t:'Small things matter.',r:['They do. And you keep doing them. I’m very proud of you, {name}. Sherbet lemon?']}]},
   {open:['* In the warm glow of the workshop, Albus lifts his wand, and every candle in the village lights at once.','I’ve known brilliant wizards. Very few understood what you seem to understand without being told.','A home is the greatest magic there is. You’re rather good at it. Brother.'],opts:[
    {t:'Brother.',r:['* He clasps your hand in both of his, warm and smudged with ink.','Then let’s keep making homes where people feel safe. I can’t think of better work.']},
    {t:'This is beautiful.',r:['That part’s yours. I only lit the candles. You built the house they’re shining on.','* A phoenix sings somewhere above, and the night feels very gentle.']}]}]},

 // ---------------- Deadpool (Home) ----------------
 deadpool:{
  level:[
   {open:['* Wade is upside down on the couch, feet on the wall, scrolling his phone.','Oh hey! You leveled me up! Do you know how weird it is being a character in a HABIT TRACKER? I love it. I feel so seen. And so tracked.'],opts:[
    {t:'You know you’re in a game?',r:['Buddy, I always know. There’s an XP bar right there. Next to your laundry pile. Which you FOLDED. Tiny corners and everything!']},
    {t:'Get off my couch.',r:['Your couch? This is MY workshop now. I live here. I’m the Home guy. Check the cast file, I’m in it. Kind of near the bottom.']}]},
   {open:['Real talk. My apartment looks like a chimichanga exploded in it. Because one did. Blind Al still finds bits.','But YOU took the trash out. On trash day. I’m tearing up. It’s allergies. No. It’s you.']},
   {open:['* He holds a mop like a katana.','Proposal. We clean the whole house. To music. Dramatic slow-mo. Ready?'],opts:[
    {t:'Hit the music.',r:['* He blasts an eighties power ballad and mops like it’s a fight scene.','Best montage I’ve ever been in. And I’ve been in, like, nine. Budget was way smaller on the others.']},
    {t:'Can we skip the slow-mo?',r:['No. Slow-mo is the whole point. It’s in my contract. Probably. I didn’t read it.']}]},
   {open:['Hey. You. Yes, you, holding the phone. You did the chores today. I can tell, your hands smell like lemon.','Don’t open another app after this. Go hug your kids. Wade’s orders. Wade outranks the app.']}],
  star:[
   {open:['A STAR? For me? Oh, you shouldn’t have. No wait, you totally should have. Gimme. It’s going next to my unicorn.']},
   {open:['* Wade sits on the porch with two sodas and hands you one.','Know what nobody tells you about home? It’s boring. And boring is GREAT. Boring means nobody’s shooting you in the face.'],opts:[
    {t:'You like boring?',r:['I LOVE boring. Folded towels, full fridge, people who like you all squished on one couch. Boring is the dream, man.']},
    {t:'Cheers to boring.',r:['* He clinks his can against yours.','To boring. To dishes. To you, you magnificent chore machine.']}]},
   {open:['Okay, little confession. I don’t really have a home. More like a rotating list of places I crash. Dopinder’s back seat, mostly.','Watching you build one? Gives me hope. Gross. Feelings. Moving on. Moving ON.']},
   {open:['* Wade straightens a crooked picture frame very, very carefully, tongue poking out.','You fixed the porch step. THE porch step. The one the narrator keeps bringing up. You actually did it.'],opts:[
    {t:'The narrator?',r:['The asterisk guy. Every line that starts with a star. Nice fella. Bit dramatic. Says hi.']},
    {t:'It only took three weeks.',r:['Three weeks is FAST for a porch. I’ve had a broken toaster since 2016. It’s not a toaster anymore. It’s a lifestyle.']}]},
   {open:['* Wade pulls his mask off. No joke comes. For a long moment, nothing comes.','So. I do a lot of bits because the real stuff is scary.','The real stuff is, you made a home I actually want to be in. You’re my brother. No punchline.'],opts:[
    {t:'You’re my brother too, Wade.',r:['* He pulls you into a giant hug and sniffles loudly, on purpose, then very much not on purpose.','Okay. Okay. That’s enough. Somebody pause the game, I need a minute. Love you, man.']},
    {t:'No punchline? Who are you?',r:['* He laughs and tugs the mask back on.','Fine. Punchline: you owe me a chimichanga. But for real. Brothers. Saved to the cloud. Backed up twice.']}]}]},

 // ---------------- Revan (Discipline) ----------------
 revan:{
  level:[
   {open:['* Revan stands in the Library, mask hanging from his belt, reading a datapad.','You put the phone down at night. Every night this week. That isn’t luck. That’s the same decision, made seven times.'],opts:[
    {t:'It was hard.',r:['It should be. Malak never once found it hard to do what he wanted. That was his whole problem.']},
    {t:'How did you know?',r:['I watch patterns. It’s how I won the Mandalorian Wars. Yours is getting better.']}]},
   {open:['I was a Jedi. Then a Sith Lord. Then the Council took my memory and I had to choose all over again.','So I know a little about picking who you are each morning. You picked well today.']},
   {open:['* He hands you an old datapad, scratched and dented.','Write down tomorrow. What you’ll do, and when. Then do it. That’s all discipline is. A promise to yourself, kept.'],opts:[
    {t:'That’s it?',r:['That’s it. Ten thousand times. That’s how a man rebuilds himself. Ask me how I know.']},
    {t:'What did you write?',r:['Meditate. Train. Talk to Bastila. Keep HK-47 out of the cantina. Same list most days.']}]},
   {open:['People still bring up what I did. I can’t change it. I can only change what I do next.','Same for you. Yesterday doesn’t get a vote. The next choice does.']}],
  star:[
   {open:['A star. I’ve been called savior, conqueror, traitor. HK calls me master and means meatbag. Friend is better. Thank you.']},
   {open:['* He sits cross-legged on the training room floor, eyes closed.','Every habit has a light side and a dark side. That screen in your pocket can serve you or own you.'],opts:[
    {t:'Which side am I on?',r:['The right one, more days than not. That’s all any of us manage. Keep tipping it.']},
    {t:'How do you stay on the light?',r:['I don’t, always. I fell once. Hard. Discipline is how I climbed back. It’ll hold you too.']}]},
   {open:['* Revan puts a wooden training saber in your hands and steps back.','Same form. Again. Boredom is how the body learns. Again.']},
   {open:['Bastila told me once that discipline without compassion is just cruelty you aim at yourself.','So be disciplined. And go easier on yourself on the bad days. She’d insist.'],opts:[
    {t:'I’m hard on myself.',r:['I know. It shows. Stop. The man who forgives himself gets back up faster.']},
    {t:'She sounds wise.',r:['She saved my life, then argued with me about it for a year. Let someone save you sometimes.']}]},
   {open:['* On the deck of the Ebon Hawk, Revan holds out his old mask.','I wore this when I was lost. I keep it now so I remember that I chose my way back.','You’ve been choosing too. Every focused morning. Every night the phone stays in the other room. Brother.'],opts:[
    {t:'Brother.',r:['* He sets the mask aside and grips your forearm, steady as durasteel.','Then let’s walk it together. From who we were to who we decide to be.']},
    {t:'You came back. That’s what matters.',r:['* He looks at you a long time, then smiles for the first time you can remember.','You get it. Most don’t. T3 beeps that the Force brought me here. T3 beeps a lot of things. This time he’s right.']}]}]},

 // ---------------- Wise Old Man (Hobbies) ----------------
 wiseoldman:{
  level:[
   {open:['* The Wise Old Man, in his adventuring prime, is fishing off the dock with a book open on his knee.','You read today! An actual book! Splendid. Learning things for fun is the finest skill there is.'],opts:[
    {t:'You have every skill, though.',r:['Every one, lad. Not because anyone made me. Because I couldn’t stop. That’s the secret.']},
    {t:'What are you reading?',r:['A guide to Runecrafting. I wrote it. Checking for typos. Found three. Ha!']}]},
   {open:['Know how long it takes to master a skill? Ages. Know how long it takes to enjoy one?','One afternoon. So go enjoy it.']},
   {open:['* He hands you a battered fishing rod.','Fish with me. No goal. No XP. Just sit.'],opts:[
    {t:'Cast a line.',r:['* You catch nothing for an hour. It’s the best hour of your week.','See? Not a single shrimp. Lovely, wasn’t it?']},
    {t:'Aren’t you supposed to be training?',r:['I am. Training my patience. And my tan. Sit down.']}]},
   {open:['Every master was a beginner once who simply refused to quit.','You picked the guitar up again. I heard you from the dock. Terrible. Wonderful. Keep going.']}],
  star:[
   {open:['A star! For me? Splendid! Straight into my bank. Don’t ask what else is in there. Certainly nothing from Draynor’s vault.']},
   {open:['* He shows you a cape covered in embroidered emblems, one for every skill.','Earned these one day at a time. Never rushed a single one. Where’s the fun in rushing?'],opts:[
    {t:'That’s amazing.',r:['It’s a cape. The amazing bit is the thousand afternoons behind it. You’re stitching your own.']},
    {t:'Which was your favorite?',r:['Agility. Hated it for years. Every hobby has a dull stretch. Push through and it gets good.']}]},
   {open:['You made time to play this week. On purpose! That’s rarer than a party hat.','Most folk forget how. You remembered.']},
   {open:['People say I know everything. Nonsense. I just know learning never gets old.','Neither do you, if you keep at it. Look at me. Well, this me. You know what I mean.'],opts:[
    {t:'Teach me something new.',r:['* His eyes light up.','Gladly! Sit. We’ve got all afternoon. This is my favorite bit.']},
    {t:'Do you ever get bored?',r:['Never! There’s always another skill. Another book. Another lake. Gielinor’s very big, lad.']}]},
   {open:['* At sunset on the hill above Draynor, the Wise Old Man unfurls a cape stitched with every emblem and drapes it over your shoulders.','Made this for you. It isn’t finished. It never will be. That’s the point.','A friend who keeps learning is the best kind. Brother adventurer.'],opts:[
    {t:'Brother adventurer.',r:['* He claps your shoulder and laughs, bright as a boy.','Then let’s go learn something tomorrow! And the day after! I’ll bring sandwiches!']},
    {t:'I’ll keep learning.',r:['I know you will. I’ve seen your face when you start something new. Guard that.','* He hums a little tune all the way down the hill.']}]}]},
};

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 kay:{
  visit:[
  {
    "open": [
      "I’m off the job. You can stop looking suspicious and start looking at me like you want to kiss me."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yeah. That’s the look I meant."
        ]
      },
      {
        "t": "Ask her to dinner.",
        "r": [
          "A real date? No running? I could get very used to that."
        ]
      }
    ]
  },
  {
    "open": [
      "I found a place that won’t ask for our names. Romantic lighting, decent food. Come with me?"
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Look at you. Making a respectable evening out of this."
        ]
      },
      {
        "t": "Ask about afterward.",
        "r": [
          "I was hoping you’d walk me home. Slowly."
        ]
      }
    ]
  },
  {
    "open": [
      "Nix is asleep. The ship’s quiet. I finally get you to myself, and you’re standing all the way over there."
    ],
    "opts": [
      {
        "t": "Sit close.",
        "r": [
          "Better. I like you within reach."
        ]
      },
      {
        "t": "Pull her into an embrace.",
        "r": [
          "Oh. Yeah, that works. Stay there."
        ]
      }
    ]
  },
  {
    "open": [
      "I was going to play it cool, but I’ve been thinking about kissing you since breakfast."
    ],
    "opts": [
      {
        "t": "Help her out.",
        "r": [
          "Thanks. Keeping up appearances is exhausting."
        ]
      },
      {
        "t": "Tell her you’ve thought about it.",
        "r": [
          "You could’ve said something. We wasted a perfectly good breakfast."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I have food, a comfortable bunk to sit on, and absolutely no desire to watch you leave yet."
    ],
    "opts": [
      {
        "t": "Stay with her.",
        "r": [
          "Good. Come here. I missed you today."
        ]
      },
      {
        "t": "Offer a late walk.",
        "r": [
          "As long as we come back together. I’m enjoying this evening."
        ]
      }
    ]
  }
],
  gift:['You bought it instead of stealing it. Sweet. Now come closer so I can thank you without an audience.','I’d have stolen this, but you gave it to me. Somehow that’s better. Come here so I can say thanks properly.','Okay, you’re dangerous. Keep this up and I’ll forget how to leave.']},
};
