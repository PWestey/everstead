// Second-wave moments: Fellows (level every 5th level, star 1..5) and Kay's family visits and gifts.
// See docs/WRITING-BRIEF.md. M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{level:any[],star:any[]}>} */
export const FELLOW_MOMENTS={
 // ---------------- Uther (Faith) ----------------
 uther:{
  level:[
   {open:['* Uther is polishing his warhammer on the chapel steps. He doesn’t look up.','You prayed before dawn today. Good. The Light does not wait for the convenient hour, and neither should we.'],opts:[
    {t:'Some mornings I barely mean it.',r:['Then mean it barely. A paladin’s oath is kept on the cold mornings, not the warm ones.']},
    {t:'You were watching?',r:['I watch everyone. It is a habit from training young knights. Most of them disappointed me. You have not, yet.']}]},
   {open:['The Silver Hand was five men and a vow when it began. Nobody thought it would last.','Small, faithful, daily. That is how an order is built. A soul too.']},
   {open:['* He hands you a worn libram, its spine cracked from use.','Read one page a day. Not ten. One. Then live it.'],opts:[
    {t:'Only one page?',r:['Ten pages read is knowledge. One page lived is faith. I know which one holds a man up.']},
    {t:'This is yours.',r:['It was. I have it memorized. Better it wears out in your hands than gathers dust in mine.']}]},
   {open:['* You stand guard together at the village gate as the light goes gold.','Duty is not glamorous, {name}. It is standing where you said you would stand. You have been standing. I see it.']}],
  star:[
   {open:['A star. Hm. I have been given medals by kings and meant less to them than this means to me.','Do not tell anyone I said that.']},
   {open:['* He’s kneeling at the chapel altar when you enter, and makes room beside him without a word.','Kneel. Not because you must. Because it is good to remember you are not the biggest thing in the room.'],opts:[
    {t:'Kneel beside him.',r:['* You pray together in silence. When you rise, he nods once, the way a commander nods at a soldier who held the line.']},
    {t:'What do you pray for?',r:['Strength to be faithful. And the people I failed. There are more of them than I like to count.']}]},
   {open:['I once trained a prince. Brilliant, brave, beloved. He lost his way and took everything with him.','I was too proud to see it. Promise me you will let your brothers tell you when you stray.'],opts:[
    {t:'I promise.',r:['Good. And I promise to tell you. Bluntly. I am told it is my best and worst quality.']},
    {t:'Would you tell me?',r:['Loudly. In front of witnesses. That is what love looks like in a paladin.']}]},
   {open:['* Uther raps his gauntlet against your breastplate, testing it.','Sound armor. Sounder heart. The Light shines through a man who keeps his small promises.']},
   {open:['* At dusk Uther leads you into the chapel, where candles burn along every wall.','I knighted many men. Most for courage in one bright moment. You I knight for a hundred quiet ones.','Kneel, brother.'],opts:[
    {t:'Kneel.',r:['* The hammer touches each shoulder, light as a blessing.','Rise, Knight of the Silver Hand. My brother in the Light, now and after. I am proud of you.']},
    {t:'I’m not worthy of this.',r:['None of us are. That is why it is called grace. Kneel, before I lose my patience and my composure both.','* His voice breaks on the last word. He doesn’t pretend it didn’t.']}]}]},

 // ---------------- Saradomin (Faith) ----------------
 saradomin:{
  level:[
   {open:['* The air near the chapel goes very still, and very bright. Saradomin is simply there, as if he always was.','Little one. You spoke to me this morning. I heard every word. I hear all of them.'],opts:[
    {t:'Even the half-awake ones?',r:['Especially those. A prayer mumbled into a pillow is still a prayer. I am not difficult to reach.']},
    {t:'That’s a little overwhelming.',r:['* His laugh is warm, like sun on stone.','It should be. And yet here I sit on your step. Both things are true.']}]},
   {open:['I have watched mountains rise and seas move. I have watched empires choose themselves into ruin.','Nothing I have seen is more beautiful than a man who keeps a small promise to me every day.']},
   {open:['* He holds out a hand. In it, a single white star glows like a coal that does not burn.','Order is not a cage. It is a trellis. Your habits are where the vine climbs toward the light.'],opts:[
    {t:'What grows on it?',r:['You do. Your children. Your marriage. The whole village leans on what you build in the quiet.']},
    {t:'Can I keep the star?',r:['You already carry one. I put it there before you were born. I only came to see it shine.']}]},
   {open:['Do you know why I ask for faithfulness, not greatness?','Greatness is a storm. It passes. Faithfulness is the tide. It shapes every shore it touches.']}],
  star:[
   {open:['* For a moment the whole sky above Everstead seems to lean closer.','You honor me, child. I have been worshipped by armies. This means more. It was freely given.']},
   {open:['You doubted me last week. I noticed that too.','* There is no anger in it. Only a patience older than the hills.'],opts:[
    {t:'I’m sorry.',r:['Do not be. Doubt is a door. You walked back through it. That is the whole of faith, little one.']},
    {t:'Do you ever doubt?',r:['I doubted that mortals would ever choose order freely. Then I met men like you. I was glad to be wrong.']}]},
   {open:['* He walks beside you through the fields, and the wheat bends toward him like a bow.','I fought a long war for this world. I would fight it again for one family who prays at their supper table.']},
   {open:['I see the man you were and the man you are becoming. They are both mine, and both loved.','But I am fond of the second one. He prays on time.'],opts:[
    {t:'Did a god just make a joke?',r:['I invented joy, little one. Who do you think made laughter? I simply use it sparingly.']},
    {t:'I want to keep becoming him.',r:['Then keep showing up. I will meet you there every morning. I have never once been late.']}]},
   {open:['* Light floods the chapel, not blinding, just everywhere. Saradomin kneels so his eyes meet yours.','I have many servants. Knights, priests, angels with wings of white fire. I did not come for a servant tonight.','I came to call you friend. Will you have me?'],opts:[
    {t:'Always.',r:['* He rests a vast, gentle hand on your head, and every burden you carry feels suddenly light enough.','Then walk with me, friend. Through every dawn you have left. I will not let go.']},
    {t:'Why me?',r:['Because you kept choosing me when no one was watching. I was watching. I always was.','* Somewhere above, a bell rings that no hand has touched.']}]}]},

 // ---------------- Malfurion (Marriage) ----------------
 malfurion:{
  level:[
   {open:['* Malfurion is tending a moonwell, antlers catching the evening light.','You were home before dark three nights this week. Your wife noticed. So did I.'],opts:[
    {t:'How do you know that?',r:['The trees talk. They are terrible gossips. Mostly about you, lately.']},
    {t:'It’s harder than it sounds.',r:['Being present always is. I slept through centuries of my own marriage. Being awake for yours is a gift.']}]},
   {open:['Tyrande waited ten thousand years for me. Some of that was my duty. Some of it was my excuse.','Do not make her wait for you, {name}. Not even an evening.']},
   {open:['* He plants a seed in the soil between you and it sprouts, slowly, as you watch.','Love is a grove, not a single tree. You tend it daily or the weeds tend it for you.'],opts:[
    {t:'What’s the best fertilizer?',r:['Attention. Listening without fixing. Flowers for no reason. Ask any druid.']},
    {t:'You make it sound simple.',r:['It is simple. It is not easy. Those are different things, and I learned it slowly.']}]},
   {open:['* You walk the edge of the forest together at moonrise.','When I woke from the Dream, the first thing I looked for was her face. Make sure yours is the face she looks for too.']}],
  star:[
   {open:['A star. In my youth I would have studied it for a century. Now I will simply say thank you, and mean it.']},
   {open:['I asked Tyrande what she wanted most from me once. Not power. Not heroics.','She wanted me home for supper. Ten thousand years of wisdom, and the answer was supper.'],opts:[
    {t:'Were you home for supper?',r:['Not nearly enough. That is why I am telling you. Learn from an old fool’s regrets.']},
    {t:'I’ll be home for supper.',r:['* His eyes glow softly.','Then you are wiser than I was at your age. And I was a demigod’s student.']}]},
   {open:['* He hands you a moonflower, silver petals still dewy.','Give this to your wife. Do not say it is from me. Say you saw it and thought of her. That will be true soon enough.']},
   {open:['You have been planning date nights. Noticing her. Asking about her day and staying for the answer.','That is the slow magic. It outlasts every spell I know.'],opts:[
    {t:'I’m trying to be awake for it.',r:['That is the whole of it, brother. Awake. Present. Here. You are doing it.']},
    {t:'Teach me more.',r:['Kiss her before you leave. Every time. I missed a thousand of those. I count them now.']}]},
   {open:['* Under the great tree, Malfurion lays a hand on the trunk and the leaves above you bloom silver all at once.','I have had few brothers. One betrayed the world. I did not think I would trust another so fully.','You have shown me what I should have been. A husband who stays awake.'],opts:[
    {t:'You’re my brother, Malfurion.',r:['* He clasps your forearm, druid to friend, and the grove hums around you.','Then this grove is yours too. Bring your wife here. It will bloom for her.']},
    {t:'You came home in the end.',r:['I did. And she was still waiting. You have that chance every single evening. Do not waste one.']}]}]},

 // ---------------- Thrall (Marriage) ----------------
 thrall:{
  level:[
   {open:['* Thrall is splitting firewood outside his hut, the Doomhammer leaning against the wall.','Warchief or husband, the axe swings the same. Grab one, brother.'],opts:[
    {t:'Pick up an axe.',r:['* You split wood side by side until the pile is high.','Aggra says a man who chops wood for his family thinks clearer. She is usually right. Do not tell her.']},
    {t:'You could lift that hammer instead.',r:['I could. The fire does not care how mighty the arm. It cares that it was fed.']}]},
   {open:['I led a whole people out of chains. I thought nothing could be harder.','Then Aggra told me I was not listening. She was right. Listening is harder than any war.']},
   {open:['* He sits cross-legged by the fire, eyes closed.','The elements speak if you are quiet enough. So does your wife. You have been quieter lately, in the good way.'],opts:[
    {t:'What do you mean?',r:['Fewer distractions. More eyes on her. A shaman notices such things. So does a wife.']},
    {t:'I’m learning to listen.',r:['Then you are learning the oldest magic there is. Even the earth listens before it moves.']}]},
   {open:['Courage on the battlefield is easy. Courage at home is saying “I was wrong” first.','You did that this week. I know because you look lighter.']}],
  star:[
   {open:['* Thrall grins, tusks and all.','A star for an old orc? Lok’tar, brother. I will wear it with honor.']},
   {open:['I set down the mantle of Warchief to raise my son and love my wife. Many called it weakness.','It was the strongest thing I ever did.'],opts:[
    {t:'Do you miss leading?',r:['Sometimes. Then Durak laughs at breakfast and Aggra steals my bread, and I remember what I chose.']},
    {t:'I’m trying to make the same choice.',r:['I know. I see it in your days. You choose your home over the noise. That is a warrior’s choice.']}]},
   {open:['* He hands you a wolf-tooth charm on a leather cord.','In Nagrand, a husband gives his mate a token on the night he renews his vow. Make it a night she remembers.']},
   {open:['Aggra and I fought, early. Loud. Then we learned to fight the problem, not each other.','You and your wife are on the same side, brother. Never forget it.'],opts:[
    {t:'Same side. Always.',r:['Good. Then nothing in this world can break your home. I have seen what can break a horde. This is stronger.']},
    {t:'Who wins when you argue?',r:['* He laughs, loud enough to scatter birds.','Aggra. Every time. And I have never been happier to lose.']}]},
   {open:['* Thrall lights a fire on the hill and the flames leap high, crackling with something older than wood.','The spirits asked me tonight who stands with me. I gave them your name.','You keep your vows, {name}. To her, to your children, to yourself. That is the mark of a true brother.'],opts:[
    {t:'For the home. For the family.',r:['* He raises the Doomhammer to the sky and thunder answers.','Lok’tar ogar, brother! Victory or death, and we choose victory, every single day!']},
    {t:'I stand with you, Go’el.',r:['* He pulls you into a crushing embrace.','Few call me that. Only family. You are family now, and I do not give that name lightly.']}]}]},

 // ---------------- Cal (Marriage) ----------------
 cal:{
  level:[
   {open:['* Cal is crouched by a speeder, BD-1 perched on his shoulder, beeping commentary.','BD says you’ve been home on time all week. He’s very impressed. He doesn’t impress easy.'],opts:[
    {t:'Tell BD thanks.',r:['* BD-1 chirps and does a little hop.','He says you’re welcome, and also that your posture needs work. He’s honest.']},
    {t:'Is BD keeping tabs on me?',r:['He keeps tabs on everyone. He’s a scanner droid with opinions. Mostly about snacks.']}]},
   {open:['For years I kept my head down. Didn’t let anyone close because losing them would hurt.','Then Merrin showed up and I realized not letting anyone close hurts worse.']},
   {open:['* He’s fixing a broken poncho seam, carefully, like it matters.','Merrin made this. I’m terrible at sewing. I do it anyway. Love’s mostly doing small stuff badly but on purpose.'],opts:[
    {t:'That’s weirdly wise.',r:['I had good teachers. Mostly people yelling at me on a ship. Same thing.']},
    {t:'Want help?',r:['Please. I’ve stabbed myself four times. BD is laughing at me. Droids can laugh, by the way.']}]},
   {open:['* You sit on the Mantis ramp, watching the stars come out.','Hiding is easier. Showing up is better. You’re showing up for her. I can tell.']}],
  star:[
   {open:['A star? Whoa. Okay. BD, are you seeing this? He’s seeing this. He’s doing the happy beep.']},
   {open:['I used to think love was something that happened to you. Like getting shot.','Now I think it’s a choice. Every morning. Kind of like climbing. One handhold at a time.'],opts:[
    {t:'You climb a lot.',r:['I climb everything. Walls, cliffs, emotional baggage. The last one’s hardest.']},
    {t:'I choose her every morning.',r:['Yeah. I can see it. You look at her like the Mantis crew looks at Greez’s cooking. Grateful and a little scared.']}]},
   {open:['* He hands you a tiny holoprojector. It shows a simple, blinking heart.','BD made it. For your wife. He says to tell her it’s from you. He takes no credit. Mostly.']},
   {open:['Cere told me once that the Order didn’t fail because they loved too much. It was because they didn’t love enough.','You’re loving enough. Your whole family can see it.'],opts:[
    {t:'I’m still learning.',r:['We all are. I’m a Jedi and I still say the wrong thing. Merrin forgives me. Usually after laughing.']},
    {t:'Thanks, Cal.',r:['Hey, that’s what crew is for. You’re crew now. No take-backs. BD already logged it.']}]},
   {open:['* Cal ignites his lightsaber in the dark and the blue glow lights both your faces.','I lost my whole family once. Master, friends, everyone. I thought I’d never have that again.','Then I found a crew. And now I’ve got you, too. A brother.'],opts:[
    {t:'You’ll always have me.',r:['* He grins, eyes a little wet, and taps his saber hilt to your chest.','Then let’s keep each other honest. Choose them every day. Both of us. Deal?']},
    {t:'Welcome home, Cal.',r:['* BD-1 hops onto your shoulder and chirps softly.','Yeah. Home. That’s exactly what this is.']}]}]},

 // ---------------- Varian (Fatherhood) ----------------
 varian:{
  level:[
   {open:['* Varian is swinging Shalamayne in the yard, blade humming.','You were at your child’s bedside every night this week. A king notices who keeps his post.'],opts:[
    {t:'Bedtime is the best part.',r:['It is. I missed too many. I fought in arenas while my son grew up without me. Do not repeat my mistake.']},
    {t:'You’re watching me?',r:['I am watching to see if you are better than I was. So far, you are. Infuriating.']}]},
   {open:['Anduin once asked me why I never told him I was proud of him.','I had no answer. I was always proud. I simply never said it. Say it to yours. Out loud.']},
   {open:['* He sits on a crate, sharpening his blade, and his voice drops.','Rage made me a fine gladiator and a poor father. Patience is the harder sword to swing.'],opts:[
    {t:'I lose my temper sometimes.',r:['We all do. The question is whether you come back and make it right. Kneel to your child’s height and apologize. It is not weakness.']},
    {t:'How did you learn patience?',r:['Badly. Slowly. With my son teaching me more than I taught him. Let yours teach you too.']}]},
   {open:['A kingdom remembers its king for his wars. A son remembers his father for whether he showed up.','You keep showing up. That is the only crown worth having.']}],
  star:[
   {open:['A star. Hah. In the arena they called me Lo’Gosh. Ghost wolf. You may call me friend. That suits me better.']},
   {open:['* He watches children play tag across the village green, arms crossed.','Anduin was a gentle boy in a hard world. I wanted to make him tough. He made me gentle instead.'],opts:[
    {t:'Did that bother you?',r:['At first. Then it saved us both. Let your children change you. That is half of being a father.']},
    {t:'Mine are changing me too.',r:['Good. That means you are listening. The best kings I knew were taught by their children.']}]},
   {open:['* He hands you a wooden practice sword, child-sized.','For your little one. Teach them to stand their ground. Then teach them when to put the sword down. That is the harder lesson.']},
   {open:['I was not there when my son needed me. I spent years making it right.','You are there now. Do not let a single year slip. They go faster than any battle.'],opts:[
    {t:'I won’t miss it.',r:['See that you do not. I will hold you to it, brother. I have a long memory and a loud voice.']},
    {t:'Did Anduin forgive you?',r:['He did. Before I forgave myself. Children are like that. Their mercy humbles even kings.']}]},
   {open:['* On the castle wall at dusk, Varian unbuckles Shalamayne and holds it out between you, hilt first.','I have fought beside many men. Few I would trust with my son. You I would trust with my kingdom.','For the Alliance, and for the ones at home. Brother.'],opts:[
    {t:'For the ones at home.',r:['* He grips your forearm and roars it to the sky, and the whole village hears.','For the Alliance! For our children! Let them grow up knowing their fathers stood!']},
    {t:'I can’t take your sword.',r:['Not to keep. To swear on. Put your hand on it and swear you will be there for them. Every night.','* You do. He nods, and something in his hard face softens for good.']}]}]},

 // ---------------- Baine (Fatherhood) ----------------
 baine:{
  level:[
   {open:['* Baine sits beneath a great tree on the hillside, a carved totem in his hands.','The Earth Mother sees what you do in your home, my friend. And she is pleased. So am I.'],opts:[
    {t:'How can you tell?',r:['Your children laugh more when you walk by. A father’s presence leaves tracks you can follow.']},
    {t:'I’m just trying to show up.',r:['That is all my father ever did. It was enough to make me who I am.']}]},
   {open:['My father, Cairne, told me once that a chieftain is measured by the hands he holds, not the heads he takes.','He held mine through every storm. Hold your children’s.']},
   {open:['* He hands you a small carved bull, smooth from handling.','My father made this for me when I was a calf. Give your children something you made with your hands. They will keep it forever.'],opts:[
    {t:'I’m not very crafty.',r:['It does not matter. A crooked toy made by a father beats a perfect one bought in a market.']},
    {t:'You should keep this.',r:['I have it in my heart. Carry it a while. Then give it to your little one.']}]},
   {open:['* You walk the plains together as the sun sets red.','A father’s example walks ahead of his children long after he is gone. Make sure yours leads somewhere good.']}],
  star:[
   {open:['A star? My father would laugh, deep from the belly. I will laugh for him. Thank you, friend.']},
   {open:['I lost my father to treachery. For a long time, I only knew how to be angry.','Then I remembered what he taught me: anger is a fire. You need it to cook, not to burn your village.'],opts:[
    {t:'Your father sounds wise.',r:['He was. Every day I try to live up to him. Your children will say the same of you one day.']},
    {t:'I’m sorry he’s gone.',r:['He is not gone. He walks with the Earth Mother. And he walks in me, every time I choose patience.']}]},
   {open:['* Baine kneels to help a small child tie a boot, slow and careful.','You do this too. I have seen it. Small acts of patience. They are the bricks a child builds a life on.']},
   {open:['You have been reading to your children. Playing on the floor. Being silly when you are tired.','That is the strength my father had. Not in his arms. In his patience.'],opts:[
    {t:'Patience is the hard part.',r:['Patience is the whole part. Strength comes free when you are young. Patience you earn.']},
    {t:'I learned from watching you.',r:['Then my father’s lessons travel on. Through me, to you, to your little ones. That is a legacy.']}]},
   {open:['* At the top of the bluff, Baine lights a small fire and sprinkles cornmeal into the flames.','I ask the Earth Mother to bless my brothers. Tonight I asked her to bless you, and your children, and theirs.','My father would have called you kin. I call you kin too.'],opts:[
    {t:'Kin, then. Always.',r:['* He sets a great, gentle hand on your shoulder.','The tribe of Bloodhoof is yours. Walk with the Earth Mother, brother. And walk your children home.']},
    {t:'Your father would be proud of you.',r:['* For a long moment he says nothing, then his eyes shine in the firelight.','Thank you, brother. I needed to hear that from someone who understands.']}]}]},

 // ---------------- Vannaka (Fitness) ----------------
 vannaka:{
  level:[
   {open:['* Vannaka stands in the dungeon entrance, arms crossed, scowling.','You finished your training task. On time. I am almost suspicious.'],opts:[
    {t:'I want another task.',r:['Good. Fifty push-ups and a walk before supper. Do not come back with excuses.']},
    {t:'Almost suspicious?',r:['Most adventurers quit by day three. You are on day forty. I have run out of reasons to doubt you.']}]},
   {open:['I do not hand out compliments. I hand out tasks.','But you have earned this one: you are less soft than when you came in. Keep going.']},
   {open:['* He drops a heavy sack in front of you.','Carry this to the well and back. Twice. Strength is earned one honest task at a time.'],opts:[
    {t:'Pick it up.',r:['* It is heavy. You carry it anyway. Twice.','Hm. Acceptable. Tomorrow it gets heavier.']},
    {t:'What’s in it?',r:['Rocks. Disappointment. The excuses of every adventurer who quit before you. Carry it.']}]},
   {open:['Sleep. Water. Food that grew from the ground. Training that makes you sweat.','None of it is magic. All of it is a task. Complete your tasks, adventurer.']}],
  star:[
   {open:['A star. Hrmph. I do not usually accept gifts from adventurers. You are not usual. Fine.']},
   {open:['* He flips through a ledger of names, most crossed out.','Every name here quit. Some on the first day. Yours is still here. In ink, not pencil.'],opts:[
    {t:'I don’t plan to quit.',r:['Nobody plans to quit. They just stop. Do not stop. That is the whole plan.']},
    {t:'How many are left?',r:['Few. Strong ones. You are becoming one of them. Do not make me cross you out.']}]},
   {open:['You skipped a workout last week. Then you did two the next day.','I hate it when adventurers skip. I respect it when they come back harder.']},
   {open:['I have trained heroes who fought dragons. Most of them could not keep a simple daily habit.','You keep yours. That is a rarer kind of strength.'],opts:[
    {t:'Was that a compliment?',r:['It was a fact. I do not give compliments. I give facts and tasks. Here is your next task.']},
    {t:'Give me the hardest task you have.',r:['* For the first time, Vannaka almost smiles.','Show up tomorrow. And the day after. That is the hardest task there is.']}]},
   {open:['* Vannaka leads you to the deepest chamber of the dungeon and gestures at the wall, carved with names.','These are the ones who never quit. I carve them myself. It takes a long time.','* He hands you the chisel.'],opts:[
    {t:'Carve your name next to mine.',r:['* He hesitates, then carves his own beside yours.','Brothers in the grind. Now go. Your task is to come back tomorrow stronger.']},
    {t:'I earned this?',r:['You earned it. No excuses. No shortcuts. Every rep counted.','* He grips your shoulder like a vice and does not let go for a long moment.']}]}]},

 // ---------------- Magni (Work) ----------------
 magni:{
  level:[
   {open:['* Magni is at the forge, sparks flying, sleeves rolled to the elbow.','Ah, there ye are! Ye finished yer work early today. That’s a man after me own heart!'],opts:[
    {t:'Teach me to swing a hammer.',r:['* He hands you one, heavy and warm.','Strike true, strike steady. Don’t rush. A good blade takes as long as it takes. So does good work.']},
    {t:'How did you know?',r:['The earth tells me things now. Mostly she complains. But she said ye did good work.']}]},
   {open:['I was a king once. Ruled Ironforge from a throne.','Best days of me life were still the ones at the anvil. Honest work, honest sweat, honest pint after.']},
   {open:['* He holds up a freshly forged axe head, still glowing.','See this? Ten thousand strikes. Each one small. Each one counted. Yer career is the same, lad.'],opts:[
    {t:'Ten thousand is a lot.',r:['Aye, it is. And ye’ve done a fair few already. Keep at it, and one day ye’ll look down and see a masterwork.']},
    {t:'What about the bad strikes?',r:['Ye strike again. A bad strike only ruins the blade if ye stop there.']}]},
   {open:['Some folk think deep work is boring. Sittin’ quiet, doin’ one thing.','That’s just smithin’ for the mind, lad. Ye’ve got the knack for it.']}],
  star:[
   {open:['A star! Ha! I’ll have it set into a mithril ring. Nay, I’ll drink to it first. Then the ring!']},
   {open:['* He leans on the anvil, beard singed at the tip.','Azeroth speaks to me now. She says she’s tired, and hurtin’. But she says folk like ye give her hope.'],opts:[
    {t:'The world thinks about me?',r:['She thinks about everyone who builds instead of breaks. Yer on the right side of the ledger, lad.']},
    {t:'That’s heavy, Magni.',r:['Aye. I carry it. But I sleep better knowin’ there are good workers out there. Like ye.']}]},
   {open:['* He tosses you a bag of coin.','Yer pay. For good work. Never let anyone tell ye honest work isn’t worth its wage. It’s worth more.']},
   {open:['I made mistakes with me own family. Let me work swallow me whole for a time.','Don’t do that, lad. Work hard, then go home. The forge’ll be there tomorrow.'],opts:[
    {t:'I’ll keep the balance.',r:['Good. A dwarf who works himself to death has a fine tomb and a sad family. Choose the better ending.']},
    {t:'Did your family forgive you?',r:['Me daughter did. Took years. Worth every one. Go home on time tonight, lad.']}]},
   {open:['* Magni plunges a blade into the quench and steam rises in a great cloud. He lifts it high, shining.','Forged this for ye. Took me a week. Every strike, I thought about how hard ye’ve been workin’.','Ye’re a craftsman now, lad. And a brother of the forge.'],opts:[
    {t:'To the forge, brother!',r:['* He slams a tankard into your hand and clanks his against it.','To the forge! To honest work! To brothers who build! Drink up, lad, ye’ve earned it!']},
    {t:'I can’t accept this.',r:['Ye’ll accept it or I’ll be cross, and nobody wants a cross dwarf. Take it. Ye’ve earned it, every strike.','* He wipes his eyes and blames the forge smoke.']}]}]},

 // ---------------- Duradel (Work) ----------------
 duradel:{
  level:[
   {open:['* Duradel sits in his hut in Shilo Village, eyes narrowed.','You completed your tasks. On time. Good. I do not waste words on anything less than results.'],opts:[
    {t:'Give me something harder.',r:['A bold request. Three hours of deep work, no distractions. Then come back.']},
    {t:'Results are what I’m after.',r:['Then we will get along. Most who seek me want praise. I offer only harder work.']}]},
   {open:['I do not take on weak adventurers. You are no longer weak.','That is the closest thing to a compliment you will get from me.']},
   {open:['* He hands you a slayer gem, glowing faintly.','Your task: finish the hardest thing on your list first. Before anything else.'],opts:[
    {t:'Why the hardest first?',r:['Because the hardest thing is the one that hunts you all day if you leave it. Slay it early.']},
    {t:'Consider it done.',r:['I will consider it done when it is done. Not before. Go.']}]},
   {open:['A slayer does not get distracted mid-task. Neither should you.','Phone down. Door closed. One job at a time. That is how monsters fall.']}],
  star:[
   {open:['A star. Hm. You give me something instead of asking for a task. Unusual. Acceptable.']},
   {open:['* He points to a row of skulls on the shelf, each labeled.','Every one was a task. Some took days. Some took years. All of them were finished.'],opts:[
    {t:'What’s the oldest one?',r:['The one I nearly gave up on. I did not. Now it sits there to remind me. Finish what you start.']},
    {t:'I want my own shelf someday.',r:['Then keep finishing. Every project you complete is a skull on your shelf. Metaphorically.']}]},
   {open:['You took on a hard job this week and finished it. No complaints. No shortcuts.','That is what I respect. Only that.']},
   {open:['Most adventurers want glory. You want to provide for your family. That is a worthier goal.','I have seen what greed does to slayers. Stay focused on why you work.'],opts:[
    {t:'I work for them.',r:['Then you will never run out of reasons to keep going. That is the best motivation there is.']},
    {t:'You have family?',r:['Once. Long ago. I chose the work. Do not make my choice. Work for them, not instead of them.']}]},
   {open:['* Duradel rises from his chair, rare enough that the whole village seems to hold its breath.','I have trained many. Few earned my respect. Fewer earned my name.','You have earned both. Brother in the hunt.'],opts:[
    {t:'Brother in the hunt.',r:['* He grips your hand, hard as stone.','Then we hunt together. Every task, every day. And we finish them all.']},
    {t:'What’s my next task?',r:['* Something like a laugh rumbles in his chest.','Ha. That is why I respect you. Your next task is to rest tonight. Even slayers sleep.']}]}]},

 // ---------------- Albus (Home) ----------------
 dumbledore:{
  level:[
   {open:['* A young Albus is levitating a dozen socks into a tidy pile, humming.','You did the dishes before bed. I find that deeply admirable. Most wizards just wave a wand and hope.'],opts:[
    {t:'Teach me that sock spell.',r:['I would, but I suspect you would lose the socks anyway. Everyone does. It is one of life’s great mysteries.']},
    {t:'You’re humming?',r:['Chores are better with music. And sherbet lemons. Would you like one?']}]},
   {open:['A home is not the walls. It is the warmth that makes people want to stay.','You have been making yours warmer. I can tell. You smile more when you talk about it.']},
   {open:['* He sweeps a cluttered table clear with one patient gesture.','I spent my youth chasing grand ideas. I nearly missed what was right in front of me.'],opts:[
    {t:'What was in front of you?',r:['My family. My little sister. I learned too late. You are learning in time.']},
    {t:'Grand ideas are fun, though.',r:['They are. But a tidy kitchen and a happy family are the grandest idea of all.']}]},
   {open:['Hogwarts became my home because I chose to make it one. One room, one student, one cup of tea at a time.','Your home is the same. Keep choosing it.']}],
  star:[
   {open:['* He beams, eyes twinkling behind half-moon spectacles.','A star! How marvelous. I shall put it with my collection of curious things. Right between the socks.']},
   {open:['Do you know what the most powerful magic is?','Not wands, or spells. It is making a place where people feel safe. You have been doing it all week.'],opts:[
    {t:'I just cleaned the kitchen.',r:['Ah, but a clean kitchen is a love letter to everyone who walks in. That is magic, my friend.']},
    {t:'You make chores sound noble.',r:['They are noble. Every tidy room says “I care about you” without a word.']}]},
   {open:['* He hands you a small enchanted broom that sweeps by itself, slightly crooked.','For the corners. It is not perfect. Neither are we. It keeps trying, which is the important part.']},
   {open:['I once believed I was meant for great things. Turns out the great things were small all along.','Fixing the porch. Making the bed. Being home for supper.'],opts:[
    {t:'You sound different from your stories.',r:['I am younger here. Still learning. Perhaps you are teaching me as much as I teach you.']},
    {t:'Small things matter.',r:['They do. And you have been doing them. I am very proud of you, {name}.']}]},
   {open:['* In the warm glow of the workshop, Albus raises his wand and every candle in the village lights at once.','I have known great wizards. Brilliant ones. Very few understood what you understand.','A home is the greatest magic. And you, my friend, are a master of it. Brother.'],opts:[
    {t:'Brother.',r:['* He clasps your hand in both of his, warm and wrinkled with ink.','Then let us keep making homes where people feel safe. That is the only work worth doing.']},
    {t:'This is beautiful.',r:['It is your doing. I merely lit the candles. You built the home they shine on.','* A phoenix sings somewhere above, and the night feels very gentle.']}]}]},

 // ---------------- Deadpool (Home) ----------------
 deadpool:{
  level:[
   {open:['* Wade is upside down on the couch, scrolling something.','Oh hey! You leveled me up! Do you know how weird it is to be a character in a HABIT TRACKER? I love it. I feel so seen.'],opts:[
    {t:'You know you’re in a game?',r:['Buddy, I always know. I can see the XP bar. It’s right there. Next to your laundry pile. Which, by the way, you folded. Proud of you.']},
    {t:'Get off my couch.',r:['Your couch? This is MY workshop now. I live here. I’m the home Fellow. Read the cast file.']}]},
   {open:['Real talk: my apartment looks like a chimichanga exploded in it. Because one did.','But YOU? You took out the trash. On time. I’m tearing up. It’s probably allergies. No, it’s you.']},
   {open:['* He holds up a mop like a sword.','I have a proposal. We clean the whole house. To music. Dramatic slow-mo. Ready?'],opts:[
    {t:'Hit the music.',r:['* He blasts a power ballad and mops like it’s a fight scene.','This is the best montage I’ve ever been in. And I’ve been in a LOT.']},
    {t:'Can we skip the slow-mo?',r:['No. Slow-mo is the whole point. The writers gave me this. Let me have it.']}]},
   {open:['Hey, you. Yes, you. Holding the phone. You did your chores today, didn’t you? I can tell.','Don’t check your messages after this. Go hug your family. Wade’s orders.']}],
  star:[
   {open:['A STAR? For me? Oh, you shouldn’t have. No, really, you should have. Gimme. I’m keeping this forever.']},
   {open:['* Wade sits on the porch with two sodas, handing you one.','You know what nobody tells you about home? It’s boring. And boring is GREAT. Boring means nobody’s shooting at you.'],opts:[
    {t:'You like boring?',r:['I LOVE boring. Boring is folded towels and a full fridge and people who love you sitting in the same room. Boring is the dream.']},
    {t:'Cheers to boring.',r:['* He clinks his can on yours.','Cheers. To boring. And dishes. And you, you magnificent chore machine.']}]},
   {open:['Okay, little confession. I don’t have a home. Not really. Just a lot of places I crash.','Watching you build yours? It gives me hope. Gross. Feelings. Moving on.']},
   {open:['* Wade straightens a crooked picture frame very, very carefully.','You fixed the porch step. You know the one. The one the narrator keeps mentioning. You actually did it.'],opts:[
    {t:'The narrator?',r:['Yeah, the asterisk guy. Every line that starts with a star. He’s nice. Bit dramatic. Says hi.']},
    {t:'It only took three weeks.',r:['Three weeks is FAST for a porch. I’ve had a broken toaster for six years. It’s a lifestyle.']}]},
   {open:['* Wade pulls off his mask. He doesn’t say a joke. For a long moment, he doesn’t say anything.','So here’s the thing. I make a lot of jokes because the real stuff is scary.','The real stuff is you made a home I actually want to be in. You’re my brother. No punchline.'],opts:[
    {t:'You’re my brother too, Wade.',r:['* He pulls you into a massive hug and sniffles, loudly.','Okay. Okay. That’s enough. Somebody pause the game, I need a minute. Love you, man.']},
    {t:'No punchline? Who are you?',r:['* He laughs and puts the mask back on.','Fine. Punchline: you still owe me a chimichanga. But seriously. Brothers. Forever. Saved to the cloud.']}]}]},

 // ---------------- Revan (Discipline) ----------------
 revan:{
  level:[
   {open:['* Revan stands in the library, mask hanging from his belt, reading.','You put your phone down at night. Every night this week. That is discipline, not luck.'],opts:[
    {t:'It was hard.',r:['Good. If it were easy, it would not change you. The hard things are the ones that forge who you become.']},
    {t:'How did you know?',r:['I notice patterns. It is how I won wars. It is how you will win yours.']}]},
   {open:['I was a Jedi. Then I was something else. Then I chose to be a Jedi again.','Every day you choose who you are. Not once. Every day. You chose well today.']},
   {open:['* He hands you an old datapad, scratched and worn.','Write down what you will do tomorrow. Then do it. That is all discipline is: a promise kept.'],opts:[
    {t:'Only that?',r:['Only that. Repeated ten thousand times. That is how a man remakes himself.']},
    {t:'What did you write?',r:['Meditate. Train. Remember who I chose to be. The same list every day. It works.']}]},
   {open:['Your past does not decide your future. Your next choice does.','Make the next one count.']}],
  star:[
   {open:['A star. I have been called many things: savior, conqueror, traitor. Friend is better. Thank you.']},
   {open:['* He sits cross-legged in the training room, eyes closed.','The Force has a light side and a dark side. So does every habit. Screens can serve you or rule you.'],opts:[
    {t:'Which side am I on?',r:['The right side, more days than not. That is all any of us manage. Keep tipping the scale.']},
    {t:'How do you stay on the light?',r:['I don’t, always. I fell once. Discipline is how I climbed back. It will carry you too.']}]},
   {open:['* Revan sets a wooden training saber in your hands.','Repetition is not boring. It is how you carve a new path in the mind. Again.']},
   {open:['Bastila once told me that discipline without compassion is just cruelty to yourself.','Be disciplined. Also be kind to yourself on the bad days.'],opts:[
    {t:'I’m hard on myself.',r:['I know. I see it. Stop. A man who forgives himself gets back up faster.']},
    {t:'She sounds wise.',r:['She was. She saved me. Let someone save you sometimes. That is discipline too.']}]},
   {open:['* On the deck of the Ebon Hawk, Revan holds his old mask out to you.','I wore this when I was lost. I keep it now to remember that I chose my way back.','You have chosen too. Every focused morning. Every boundary held. Brother.'],opts:[
    {t:'Brother.',r:['* He sets the mask aside and grips your forearm, steady as durasteel.','Then let us walk the bridge together. From who we were to who we decide to be.']},
    {t:'You came back. That’s what matters.',r:['* He looks at you a long time, then smiles for the first time you can remember.','You understand. Few do. I am glad the Force brought me to this village.']}]}]},

 // ---------------- Wise Old Man (Hobbies) ----------------
 wiseoldman:{
  level:[
   {open:['* The Wise Old Man, in his adventuring prime, is fishing off the dock with a book open on his knee.','You read today! A real book! Splendid. Learning for the fun of it is the finest skill of all.'],opts:[
    {t:'You have every skill, though.',r:['Aye, every one. Not because I had to. Because I loved learning them. That is the secret.']},
    {t:'What are you reading?',r:['A guide to crafting runes. I wrote it. Just checking my work. Ha!']}]},
   {open:['Do you know how long it takes to master a skill? A long time. Do you know how long it takes to enjoy one?','One afternoon. Start enjoying.']},
   {open:['* He hands you a battered fishing rod.','Fish with me. No goal. Just for the joy of it.'],opts:[
    {t:'Cast a line.',r:['* You catch nothing for an hour. It is the best hour of your week.','See? No XP needed. Just good company.']},
    {t:'Aren’t you supposed to be training?',r:['I am training. Training my patience. And my tan. Sit down.']}]},
   {open:['Every master was once a beginner who refused to quit.','You picked up that guitar again. I heard you. Terrible. Wonderful. Keep going.']}],
  star:[
   {open:['A star! For me? Splendid! I shall add it to my collection. I have a bank full of curious things.']},
   {open:['* He shows you a cape covered in embroidered emblems, one for each skill.','I earned each of these one day at a time. Not in a rush. In joy.'],opts:[
    {t:'That’s amazing.',r:['It is a cape. What is amazing is the thousand afternoons it stands for. You are building your own.']},
    {t:'Which was your favorite?',r:['The one I nearly gave up on. Every hobby has a dull stretch. Push through it.']}]},
   {open:['You made time to play this week. On purpose. That is rarer than mastery.','Most folk forget how to play. You remembered.']},
   {open:['Some say I know everything. I do not. I only know that learning never gets old.','Neither do you, if you keep at it.'],opts:[
    {t:'Teach me something new.',r:['* His eyes light up.','Gladly! Sit down. We have all afternoon. This is my favorite part.']},
    {t:'Do you ever get bored?',r:['Never. There is always another skill. Another book. Another lake to fish. The world is very big.']}]},
   {open:['* At sunset on the hill above Draynor, the Wise Old Man unfurls a cape stitched with every emblem, and drapes it on your shoulders.','I made this for you. It is not finished. It never will be. That is the point.','A friend who keeps learning is the best friend of all. Brother adventurer.'],opts:[
    {t:'Brother adventurer.',r:['* He claps your shoulder and laughs, bright as a boy.','Then let us go learn something tomorrow! And the day after! The adventure never ends, my friend!']},
    {t:'I’ll keep learning.',r:['I know you will. I have seen it in your eyes. The joy is there. Guard it well.','* He hums a little tune all the way down the hill.']}]}]},
};

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 kay:{
  visit:[
   {open:['* Kay is leaning on her speeder, Nix curled on her shoulder, flipping a credit chip across her knuckles.','Look who finally showed up. Nix was starting to think you forgot about us.'],opts:[
    {t:'Never.',r:['* Nix chitters and leaps onto your shoulder. Kay grins.','Traitor. He likes you more than me. Can’t blame him.']},
    {t:'Did you miss me?',r:['Miss you? Please. I counted the hours, and that’s different.','* She doesn’t look away when she says it.']}]},
   {open:['* Kay is fixing a loose panel on her ship, a smudge of grease on her cheek.','You fixed the gutter today. Watched you do it. Nice form, by the way.'],opts:[
    {t:'You were watching?',r:['Hard not to. You roll your sleeves up when you work. It’s distracting.','* She wipes her cheek and makes the smudge worse. You don’t tell her.']},
    {t:'Want help with that panel?',r:['* She hands you the wrench and leans close, her hand over yours on the bolt.','There. That’s how you do it. Slow. Steady. Don’t let go.']}]},
   {open:['* Kay is sprawled on the cockpit seat, boots up, when you step aboard.','I’ve spent my whole life running. First place I ever wanted to come back to was here. Don’t make it weird.'],opts:[
    {t:'Too late. It’s weird.',r:['* She throws a ration bar at your head, laughing.','Fine. It’s weird. Come sit down before I change my mind.']},
    {t:'I’m glad you stayed.',r:['* She pulls you down beside her by your collar.','Yeah. Me too. Nix, go away. Grown-up talk.']}]},
   {open:['* Night. Kay stands at the window of her ship, looking out at the stars.','I used to look out there and see escape routes. Now I look out there and think about coming home. To you.'],opts:[
    {t:'Step up behind her.',r:['* She leans back into you, and your arms close around her like they belong there.','Okay. Stay right there. Don’t move. That’s an order, scoundrel to scoundrel.']},
    {t:'Then come home.',r:['* She turns, close enough that her breath catches yours.','Careful. Say things like that and I might never leave.']}]},
   {open:['* Kay locks the ship’s door behind you and leans against it, eyes bright and dangerous.','I’ve pulled a lot of heists. Never stole anything as good as this.','* She steps toward you.'],opts:[
    {t:'What are you stealing?',r:['* Her hand slides flat against your chest, and she pulls you down into a slow kiss.','You. Obviously. Nix, lights.','* The cabin goes dark, and the rest of the night is nobody’s business.']},
    {t:'You’re trouble.',r:['The best kind. And you’ve been asking for it all week.','* She kisses you, long and unhurried, and doesn’t let you catch your breath.']}]}],
  gift:['For me? Huh. Nobody gives a scoundrel gifts. Nix, he’s spoiling me. Do something.','I’d steal this, but you gave it to me. That’s even better. Come here so I can thank you properly.','Okay, you’re dangerous. Keep this up and I’ll never fly away.']},
};
