// Fourth-wave moments, part D: Family Amah, Thalyssra, Valeera, Liadrin, Yrel, Zilyana, Ellamaria and Nieve
// (visits and gifts). See docs/WRITING-BRIEF.md. Romantic and flirty, PG-13.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Amah (Fatherhood) ----------------
 amah:{
  visit:[
   {open:['* Amah is at the Hearth Inn hearth, flour up to her elbows, patting out cornbread the size of a kodo’s ear.','Sit. You look like a man who ate standing up again. Don’t lie to me, I raised six.'],opts:[
    {t:'Guilty. Cold toast in the car.',r:['Cold toast. Earth Mother forgive him. Here, hot from the stones. Eat it slowly or I’ll know.']},
    {t:'Six? How did you survive?',r:['* She laughs so loud a mug rattles on the shelf.','I didn’t. The old Amah is buried somewhere in Mulgore. This one is louder and sleeps less.']}]},
   {open:['You let the little one help you cook tonight. Egg on the ceiling, I heard. Good.','Calves learn by making a mess next to someone patient. You were patient. Mostly.'],opts:[
    {t:'Mostly is generous.',r:['Mostly is plenty. My mate once yelled at a kodo for an hour. The kodo won. Kids forgive faster than kodos.']},
    {t:'There’s still egg up there.',r:['Leave it. In ten years you’ll point at that stain and miss the day it got there.']}]},
   {open:['* Late. The fire is low. Amah has her hooves up on a stool and a blanket over her knees, and she lifts one corner of it for you.','Come. The Inn gets cold when the kids are asleep. Don’t make an old cow ask twice.'],opts:[
    {t:'You’re not old.',r:['* She bumps your shoulder with hers, warm and heavy.','Ha. Keep saying things like that and I’ll keep the blanket big enough for two.']},
    {t:'Just for a minute.',r:['Mm-hm. That’s what they all say. Then I find them snoring on my shoulder at dawn. I don’t mind.']}]},
   {open:['Baine still lets me straighten his collar, you know. Chieftain of all the tauren. Stands there like a calf.','Your kids will be like that. Big and grown, and still wanting you to fix their collar.'],opts:[
    {t:'I hope so.',r:['I know so. You’re building that now, one bedtime at a time. Even the ones that go badly.']},
    {t:'Does he know you tell people that?',r:['He does not, and you won’t tell him. I have cornbread and I know where you sleep.']}]},
   {open:['* She catches your face in both big hands and turns it toward the firelight, frowning.','You’re tired in the eyes. Not the body, the eyes. Who looks after the father, hm?'],opts:[
    {t:'Nobody, usually.',r:['Wrong answer. Tonight, me. Sit, eat, and let someone fuss over you for once.']},
    {t:'You, apparently.',r:['* Her thumb lingers on your cheek a moment longer than it needs to.','Apparently. Don’t look so pleased about it. Fine. Look a little pleased.']}]}],
  gift:[
   '* Amah holds it up to the light and goes quiet, which for her is a rare and alarming thing. Then she pulls you into a hug that lifts you off your feet.',
   'For me? Not for the calves? Oh, you sweet fool. Nobody brings the mother anything. I’m keeping this by my bed.',
   '* She plants a big warm kiss on your forehead, then a smaller one, lower, near the corner of your mouth. “Don’t tell the Inn.”']},

 // ---------------- Thalyssra (Work) ----------------
 thalyssra:{
  visit:[
   {open:['* Thalyssra has commandeered a Market stall and covered it in ledgers, ley-line maps and three cups of cooling arcwine.','Ah. You. Sit. I need someone who can read a budget without weeping.'],opts:[
    {t:'I can read a budget. Weeping’s optional.',r:['Excellent. Half my council could do neither. Here, tell me where the gold is leaking.']},
    {t:'Is that arcwine at noon?',r:['It is a working lunch. In Suramar we drank it at breakfast. You see where that got us.']}]},
   {open:['You finished the hard thing first today. Before the easy messages. I noticed.','In the rebellion I learned that the task you avoid is usually the one that wins the war.'],opts:[
    {t:'It wasn’t pretty.',r:['Nothing is, early. My first plan to retake Suramar was scribbled on a ration wrapper. Pretty comes later.']},
    {t:'You were watching me work?',r:['* One violet eyebrow lifts, very slowly.','I watch competence the way other women watch sunsets. Don’t let it go to your head.']}]},
   {open:['* Night over the Market. Thalyssra leans on the stall, glowing faintly, the lanterns dim beside her.','Elisande ruled for ten thousand years and never once took an evening off. Look how that ended.'],opts:[
    {t:'So you’re taking one?',r:['I am considering it. It depends entirely on the company. You are being evaluated.']},
    {t:'How am I doing on the evaluation?',r:['* She steps close and straightens your collar with long fingers.','Promising. I want to see more data before I commit.']}]},
   {open:['When the Nightwell was cut off, I watched my people wither. Starving for something they’d stopped earning themselves.','That is why I care how you work, {name}. Build something that feeds you, not only the hunger.'],opts:[
    {t:'That’s heavy for a market stall.',r:['I am a nightborne. Everything is heavy. Buy me a pastry and I’ll be lighter.']},
    {t:'I’m trying to build that.',r:['I know. That is the only reason I tell you things like this. Mostly.']}]},
   {open:['* She slides a sealed scroll across the counter, then pins it under one fingertip before you can take it.','Your plan for the week. I took the liberty of reading it. You underestimate yourself on Thursday.'],opts:[
    {t:'You read my notes?',r:['I read everything. It is a terrible habit. It is also why I am alive. Thursday, more ambition.']},
    {t:'What’s my reward if I hit it?',r:['* Her smile is slow and entirely unofficial.','Dinner. Suramar style. Candles, arcwine, and no talking about ledgers at all.']}]}],
  gift:[
   '* Thalyssra turns it over with the care of someone handling a relic. Her ears twitch, just slightly, which is as close to a blush as a First Arcanist gets.',
   'This is thoughtful. Truly. In Suramar a gift like this would come with a political motive. I hope yours does too.',
   '* She kisses you once, precisely, as if she has planned it for days. Possibly she has.']},

 // ---------------- Valeera (Discipline) ----------------
 valeera:{
  visit:[
   {open:['* Valeera is sitting on top of a Library bookcase, spinning a dagger on one fingertip. She didn’t use the ladder.','Oh good, you’re here. The librarian keeps glaring at me. Look busy with me.'],opts:[
    {t:'How did you even get up there?',r:['Same way I get into everything. Quietly, and before anyone thinks to stop me.']},
    {t:'Put the dagger down.',r:['* She flips it, catches it, sheathes it in one motion.','Bossy. Varian used to say that too. I liked him anyway.']}]},
   {open:['You left your phone in the other room tonight. Whole evening.','I know what it’s like to want something every minute of the day. Fel’s worse, but the itch is the same.'],opts:[
    {t:'I reached for it eleven times.',r:['And didn’t pick it up eleven times. That’s eleven fights won. I used to count mine too.']},
    {t:'How did you quit?',r:['Badly, then less badly. One day at a time, someone holding the door shut. You don’t have to do it alone either.']}]},
   {open:['* She drops down from the shelf, light as a cat, and lands close. Too close for the Library.','You’re reading the same page for the third time. Distracted?'],opts:[
    {t:'You’re very distracting.',r:['* A sly grin spreads across her face.','I know. I trained for years to be invisible. You’re the first one I want to notice me.']},
    {t:'It’s a hard page.',r:['Liar. Your eyes keep going to the door. Waiting for someone, hm?']}]},
   {open:['Varian and I fought in the Crimson Ring. Slaves with swords. He didn’t remember who he was, and I didn’t care who I was.','He found his way back. I went the long way. We both got there.'],opts:[
    {t:'You miss him.',r:['Every day. He was my brother in everything but blood. He’d have liked you. He’d have punched you first.']},
    {t:'What was the long way?',r:['Mana, then fel, then nothing. Then waking up every morning and choosing. Still doing it.']}]},
   {open:['* She leans against the shelf beside you, arms crossed, watching you shut a book you finished.','Up before the alarm. Bed on time. Who are you and what did you do with the old one?'],opts:[
    {t:'He’s gone. Good riddance.',r:['Ha. Good. I liked him, but this one’s got better posture.']},
    {t:'Still me. Just tired of losing.',r:['* She bumps your shoulder, then leaves her arm against yours.','Yeah. I know that feeling. It looks good on you.']}]}],
  gift:[
   '* Valeera turns it over, suspicious, like it might be trapped. Then she tucks it somewhere inside her armor and it simply vanishes.',
   'Nobody gives a rogue presents. They usually just check their pockets after I leave. Thanks. Really.',
   '* Quick as a pickpocket, she kisses your cheek, and is three shelves away before you can react.']},

 // ---------------- Liadrin (Faith) ----------------
 liadrin:{
  visit:[
   {open:['* Liadrin kneels at the Chapel altar in red and gold, sword laid flat before her, hair falling loose over one shoulder.','You can sit. I won’t bite. Not in a chapel, anyway.'],opts:[
    {t:'Am I interrupting?',r:['No. I was arguing with the Light again. It usually wins. Sit with me.']},
    {t:'Not in a chapel?',r:['* The corner of her mouth curls.','I was a priestess, not a saint. There’s a difference. Sit.']}]},
   {open:['You prayed this morning before anything else. Before the coffee. I was here, I saw you.','I gave up praying once. For years. Getting back to it felt like learning to walk again.'],opts:[
    {t:'What brought you back?',r:['The Sunwell, burning again. I fell to my knees in front of it and wept like a girl. Pride doesn’t survive that.']},
    {t:'Some mornings I’m just mumbling.',r:['Mumbling counts. Half my prayers in Silvermoon were me mumbling at the ceiling. The Light listens anyway.']}]},
   {open:['* Evening. The Chapel candles throw red-gold light across her armor. She takes off her gauntlets and flexes her fingers.','Blood Knights don’t take these off for just anyone. Consider yourself honored.'],opts:[
    {t:'I’m honored.',r:['Good. Now give me your hand. I want to see if a man who prays every day has calluses.']},
    {t:'What else don’t they take off?',r:['* She laughs, surprised, and swats your arm.','Careful. I have a sword, and a very short temper with clever men.']}]},
   {open:['We did a terrible thing once. Drained a naaru to fuel our power. I led it. I believed I was right.','When the Light came back to me anyway, I stopped thinking faith was something you earn by being good.'],opts:[
    {t:'Then what is it?',r:['Showing up broken and asking again. Every day. You know this. You do it every morning.']},
    {t:'That’s a lot to carry.',r:['It is. I carry it here, where I can kneel and set it down for a while. You do the same.']}]},
   {open:['* She meets you at the Chapel door, blocking it with one arm against the frame, eyes bright.','You missed yesterday. Don’t look away. I’m not scolding. I want to know why.'],opts:[
    {t:'I was tired. No good reason.',r:['Honest. I’ll take that over a pretty excuse. Come in. Today counts more.']},
    {t:'Did you miss me?',r:['* She lowers her arm, slowly, but doesn’t step back.','Ask me again after vespers. If you stay that long.']}]}],
  gift:[
   '* Liadrin holds it in both hands like an offering, and for a moment the proud Matriarch looks very young.',
   'Silvermoon taught me to expect gifts with strings. This doesn’t have any, does it? No. I can tell.',
   '* She presses her lips to your knuckles, then lingers, eyes lifting to yours over your hand.']},

 // ---------------- Yrel (Fitness) ----------------
 yrel:{
  visit:[
   {open:['* Yrel is at the Training Yard working through mace drills, tail swishing, a plain wooden practice weapon in her hands.','Oh! Sorry. I didn’t hear you. When I train I forget the whole world exists.'],opts:[
    {t:'Don’t stop on my account.',r:['I won’t. But you could join me. Pick up a mace. Yes, that one. It’s heavier than it looks.']},
    {t:'That mace looks old.',r:['It is. Maraad gave it to me. Well. He gave me a much heavier one first, to teach me humility.']}]},
   {open:['You ran today. In the cold. I heard you come back wheezing.','I did that every morning in Karabor. Wheezing is just your body learning a new song.'],opts:[
    {t:'A very bad song.',r:['* She laughs, bright and unguarded.','The first verses always are. By the tenth one you’ll be humming it.']},
    {t:'How long until it’s easy?',r:['It never gets easy. You just get stronger. That’s the honest answer. I’m sorry.']}]},
   {open:['* Sunset over the Training Yard. Yrel sits on the fence, legs swinging, hooves bare, armor in a pile beside her.','Did you know I was a nobody? A girl with a lantern, hiding in the hills while the orcs burned Shadowmoon.'],opts:[
    {t:'You were never a nobody.',r:['Maraad said that too. I didn’t believe him. I’m starting to believe you.']},
    {t:'What changed?',r:['Somebody handed me a weapon and expected me to lift it. Every day. Until I could.']}]},
   {open:['Stretch with me? Velen says flexibility is a virtue. I think he just likes watching people fall over.','* She sits in the grass and reaches for her toes, and tilts her head at you.'],opts:[
    {t:'I can’t reach my toes.',r:['Not yet. Here, let me help.','* Her hand is warm on your back, pressing gently, and she doesn’t take it away.']},
    {t:'I’ll fall over for you.',r:['* Her cheeks go a faint, glowing violet.','That was very sweet and very silly. Come here and do it properly.']}]},
   {open:['* She meets you at the gate, out of breath and grinning, holding two wooden maces.','Spar with me. Five rounds. If you win one, I’ll do anything you ask.'],opts:[
    {t:'Anything?',r:['* She blushes and raises her chin.','Within reason. Exarchs keep their promises, so choose carefully. Now guard up.']},
    {t:'And if I lose all five?',r:['Then you come back tomorrow and try again. That’s the whole secret, really.']}]}],
  gift:[
   '* Yrel’s eyes widen and her tail flicks happily behind her. She holds it to her chest like she’s afraid someone will take it.',
   'For me? I was a refugee for so long, I forgot what it was like to just be given something. Thank you.',
   '* She rises on her toes and kisses your cheek, quick and shy, and then laughs at herself for doing it.']},

 // ---------------- Zilyana (Faith) ----------------
 zilyana:{
  visit:[
   {open:['* Commander Zilyana stands in the Chapel doorway as if guarding it, Saradomin’s blade at her hip, her white robes unmoving.','You are late. Prayer at dawn means dawn, not when the kettle boils.'],opts:[
    {t:'The kettle was very slow.',r:['Then rise before the kettle. Saradomin does not wait for tea, and neither do I.']},
    {t:'You waited for me?',r:['* She looks away, very briefly.','I was guarding the Chapel. You happened to be the one I was waiting for. That is different.']}]},
   {open:['You read your scripture before the house woke. Then you prayed for the people you’re short with. I heard.','In the dungeon we fight for Saradomin every hour. You fight for him in smaller hours. Those count too.'],opts:[
    {t:'They feel small.',r:['Order is built of small things. A single sword stroke, repeated ten thousand times. Do not despise small.']},
    {t:'What’s the dungeon like?',r:['Loud. Bandos’s brutes shouting, Armadyl’s birds screeching. My chamber is the only quiet place in it.']}]},
   {open:['* She sits beside you on the Chapel pew, back straight, the light catching the edges of her armor.','Adventurers come to my chamber by the hundreds. They want my sword. Not one has ever asked my name.'],opts:[
    {t:'What’s your name, then?',r:['* A long pause. Then, softer:','It is Zilyana. You know that. But thank you for asking it like that.']},
    {t:'Their loss.',r:['Their death, usually. But yes. Their loss.']}]},
   {open:['Faith without discipline is a feeling. Pleasant. Useless. It burns out by spring.','You pray every day, even when you feel nothing. That is the kind Saradomin trusts.'],opts:[
    {t:'Some days I feel nothing at all.',r:['Then you are being tested, not abandoned. Keep the watch. Dawn always comes.']},
    {t:'Do you ever feel nothing?',r:['* She hesitates.','Yes. Then I pray harder. And lately I have found that sitting here with you helps.']}]},
   {open:['* She rises as you enter, and for once doesn’t reach for her sword. She reaches for your hand.','I have commanded armies. I have never asked a mortal to stay. Stay a while.'],opts:[
    {t:'I’ll stay.',r:['* Her fingers tighten around yours, firm as a sword grip.','Good. Order says I should let go now. I am choosing not to.']},
    {t:'Is that an order, Commander?',r:['It is a request. The first I have made in a thousand years. Do not make me regret it.']}]}],
  gift:[
   '* Zilyana inspects it as if checking it for curses, then sets it carefully on the altar, beside Saradomin’s star.',
   'A gift. For me. Not for my god. I do not know quite what to do with this feeling. Thank you.',
   '* She bows her head and touches her brow to yours, very still, for one long breath.']},

 // ---------------- Ellamaria (Home) ----------------
 ellamaria:{
  visit:[
   {open:['* Queen Ellamaria kneels in the Workshop yard in a gardening apron, crown set on an upturned bucket, potting a rose.','Don’t tell Roald. He thinks I’m at a council meeting. I’m much happier with dirt.'],opts:[
    {t:'Your secret’s safe.',r:['Good. Now pass me that trowel. And don’t look at my hands, they’re filthy.']},
    {t:'Want help?',r:['A gentleman who gardens. I may have to have you knighted. Grab the watering can.']}]},
   {open:['You fixed the wobbly cupboard door. Finally. I heard you swearing at it on Tuesday.','Small things like that make a house a home. It’s the same with roses. You prune, you tend, you wait.'],opts:[
    {t:'It only took three tries.',r:['Three is nothing. I replanted my white tree four times before it took. Patience, darling.']},
    {t:'I wasn’t swearing much.',r:['* She laughs behind a dirty glove.','You were. Very creatively. I wrote some of them down for Roald.']}]},
   {open:['* Evening. The Workshop smells of sawdust and the lavender she brought. She sits on the workbench, swinging her feet.','The palace has two hundred rooms, and not one of them feels like this. Small, warm, used.'],opts:[
    {t:'Used is a nice way of saying messy.',r:['Messy means lived in. My throne room is spotless and I’ve never once been happy in it.']},
    {t:'Stay as long as you like.',r:['* She tilts her head, crown slightly askew.','Careful. A queen might take that as an invitation and never leave.']}]},
   {open:['I once had an adventurer fill my whole garden for me. Flowers from every corner of Gielinor. Took him weeks.','I cried when it was done. A queen, crying over marigolds. Roald still teases me.'],opts:[
    {t:'That’s lovely, not silly.',r:['You would say that. You cried over your kids’ finger-painting. I saw the fridge.']},
    {t:'I could bring you flowers.',r:['* She looks at you a moment too long.','You could. But then I’d have to explain to the King why I keep smiling.']}]},
   {open:['* She takes your hand and leads you around the house, pointing at things you fixed this month.','The gate. The shelf. The leak under the sink. Do you see it? You’ve been making this a home.'],opts:[
    {t:'I hadn’t noticed.',r:['Men never do. That’s why we have queens. To notice things and tell you how wonderful you are.']},
    {t:'And who notices you?',r:['* Her cheeks pink.','At the moment? Apparently you. Keep doing it.']}]}],
  gift:[
   '* Ellamaria clasps it to her chest, delighted, then looks around guiltily as if a courtier might be watching.',
   'Oh, you shouldn’t have. Really. Roald gives me jewelry. This is so much better.',
   '* She kisses your cheek and leaves a faint smudge of garden soil there. She does not apologize for it.']},

 // ---------------- Nieve (Fitness) ----------------
 nieve:{
  visit:[
   {open:['* Nieve is at the Training Yard, perched on a barrel with a slayer helm under her arm and a list in her hand.','Your task today: thirty squats, a run around the village and a stretch. No skipping. I’ll know.'],opts:[
    {t:'And if I skip?',r:['Then your task streak resets to zero and I make fun of you to Vannaka. He laughs like a goblin.']},
    {t:'You’re a slayer master. I’m a dad.',r:['Same job. Some of your enemies are just named “the couch” and “one more episode.”']}]},
   {open:['You got up early and lifted before work. In the dark. I watched you from the wall.','In the Stronghold, the gnomes thought I was mad for training at dawn. I thought they were short.'],opts:[
    {t:'They are short.',r:['* She grins.','Very. Excellent architects, though. Their stairs nearly killed me the first year.']},
    {t:'You watched me?',r:['It’s my job. Partly. The rest is because you look good doing it. Don’t get a big head.']}]},
   {open:['* Sunset. Nieve unlaces her boots on the Training Yard fence and stretches her arms over her head.','Duradel hands out the hard tasks. I hand out the right ones. There’s a difference.'],opts:[
    {t:'What’s my right task?',r:['Today? Sleep eight hours. I can see it in your eyes, you’re running on fumes.']},
    {t:'Is Duradel jealous?',r:['Of me? Constantly. He’ll never admit it. He doesn’t admit anything. It’s very tiring.']}]},
   {open:['People think fitness is about the big fights. The dragons. Actually it’s mostly turning up for the boring ones.','Ten thousand goblins before you ever see a dragon. That’s the job.'],opts:[
    {t:'I’m on goblin three hundred.',r:['Good. Keep going. Goblins are where the strength comes from. Dragons are just the receipt.']},
    {t:'When do I get a dragon?',r:['* She pokes your chest.','When you stop asking. Then one day you’ll look down and it’s dead and you won’t even remember fighting.']}]},
   {open:['* She hops off the barrel and stands close, hands on her hips, looking up at you.','You hit every workout this week. Every single one. I should give you slayer points.'],opts:[
    {t:'What can I buy with them?',r:['* Her grin turns sly.','Depends how many you earn. I’ve got a very exclusive rewards list. Some of it isn’t written down.']},
    {t:'Just a smile is fine.',r:['Ugh. That was so sweet I need a protein bar. Fine. Here’s your smile. Earned it.']}]}],
  gift:[
   '* Nieve weighs it in one hand like she’s judging a weapon drop, then breaks into a wide, delighted grin.',
   'This beats a rune scimitar. Don’t tell the adventurers I said that, they’d riot.',
   '* She tugs you down by the collar and kisses your cheek, hard and quick, the way she does everything.']},
};
