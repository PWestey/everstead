// Cheers (task-completion pop-ups) for Family set A.
// Shape: {id:{cheers:[4 moments], codex:'line', ack:'line', done:moment}}. Each moment has exactly 2 opts.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Ariane, Wizard of Light (Faith) ----------------
 ariane:{
  cheers:[
   {open:['You prayed! I felt the chapel candles flicker. Okay, that might’ve been a draft. I’m choosing to believe it was you.'],
    opts:[{t:'It was me. Same time tomorrow.',r:['Good. I’m saving you a candle. Right by mine.']},{t:'Maybe it was the draft.',r:['Hush. Let a wizard have her theories.']}]},
   {open:['Scripture before breakfast? The Tower made us memorize runes at dawn and I never once looked that happy about it.'],
    opts:[{t:'I’m keeping this one going.',r:['* Her fingertips spark gold. “Sorry. That happens when I’m proud.”']},{t:'Happy is a strong word.',r:['Fine. Determined. Determined is very attractive too.']}]},
   {open:['You wrote down three things you’re grateful for. Can I guess if I’m one of them? No. Don’t tell me. Tell me.'],
    opts:[{t:'Every night, Ariane. I’m in.',r:['* She glows. Actually glows. “That’s… a yes to both, isn’t it.”']},{t:'You were number four.',r:['Number four. I’ll take it. I’m coming for number three.']}]},
   {open:['I lit a little light for you this morning before you even got up. Looks like it worked.'],
    opts:[{t:'Keep it lit. I’ll keep coming.',r:['Deal. Candles are cheap. You’re worth a whole box.']},{t:'Is that how it works?',r:['Mostly. The rest was you. Don’t tell the Tower.']}]}],
  codex:'You wrote this down once. I kept it by the altar. Read it again.',
  ack:'There. Now it’s a promise, and I’m holding you to it.',
  done:{open:['Every single one, done. I’m closing up the chapel early. Come sit with me on the steps?'],
   opts:[{t:'Tomorrow I do it all again.',r:['And I’ll be right here lighting the candles when you do.']},{t:'Only if you bring the tea.',r:['I always bring the tea. You always drink mine.']}]}},

 // ---------------- Ahsoka, Wandering Jedi (Faith) ----------------
 ahsoka:{
  cheers:[
   {open:['You sat still and prayed. Most people can’t manage five minutes without checking something. I noticed.'],
    opts:[{t:'Tomorrow too. Same spot.',r:['I’ll be there. Probably on the roof, but I’ll be there.']},{t:'I peeked at my phone once.',r:['Once is progress. Skyguy couldn’t make it thirty seconds.']}]},
   {open:['You read this morning. Good. The quiet before the day starts is where you hear things.'],
    opts:[{t:'I’m not skipping it again.',r:['I believe you. Don’t make me come find you at dawn.']},{t:'Mostly I heard the kids.',r:['That counts. The Force is in noisy places too.']}]},
   {open:['Gratitude list. Short, honest. That’s the right way to do it.'],
    opts:[{t:'Count me in, every night.',r:['* A small smile. “Then I’ll keep listening.”']},{t:'I ran out after two.',r:['Two true ones beat ten you don’t mean.']}]},
   {open:['I can feel it when you do this. You’re steadier. Calmer around the edges.'],
    opts:[{t:'I’m holding onto this.',r:['Good. It slips if you let it. I’ll remind you.']},{t:'You can feel that?',r:['Togruta. Jedi. Very nosy. Pick one.']}]}],
  codex:'You told yourself something important once. Read it slowly.',
  ack:'That’s it. Say it, then live it. That’s the whole trick.',
  done:{open:['All of it, done. You didn’t rush. That’s what I liked.','Come watch the sky with me for a bit.'],
   opts:[{t:'Same again tomorrow.',r:['I know. That’s why I’m still here.']},{t:'Only if you don’t push me off the roof.',r:['No promises. You did leave yourself open.']}]}},

 // ---------------- Lys, Temple Keeper (Faith) ----------------
 lys:{
  cheers:[
   {open:['You said your prayers. I put the kettle on the second I heard. Jasmine, two honeys.'],
    opts:[{t:'Pour me one tomorrow too.',r:['I’ll pour it too early. I always do. You’ll come anyway.']},{t:'You heard? From the temple?',r:['I listen for you. That sounded less strange in my head.']}]},
   {open:['A thank-you list. Oh, I love those. Small ones are my favorite. The good coffee. The kids laughing.'],
    opts:[{t:'Every night. I promise.',r:['* She tucks the promise away like a pressed flower. “I’ll ask.”']},{t:'Mine had “coffee” three times.',r:['Then you’re very grateful for coffee. That’s allowed.']}]},
   {open:['You read a little scripture before the day got loud. That’s the best time. The cups are still warm.'],
    opts:[{t:'I’m making it a habit.',r:['Then I’m making it a habit to wait for you.']},{t:'It was one verse.',r:['One verse, every day, adds up to a whole book.']}]},
   {open:['You look lighter. You always do after you pray. I notice. I notice too much, probably.'],
    opts:[{t:'Keep noticing. I’ll keep at it.',r:['* She hides her smile behind her teacup and fails completely.']},{t:'It’s the tea.',r:['It is partly the tea. I’ll accept partial credit.']}]}],
  codex:'Sit. You wrote this on a better day. Read it with me.',
  ack:'There. I’ll leave a cup out tomorrow so you remember.',
  done:{open:['Everything finished. Look at you. Come in, the tea’s getting cold and I saved you the good cushion.'],
   opts:[{t:'I’ll do it all again tomorrow.',r:['I know. I’ll have the kettle on.']},{t:'Is there cake?',r:['There is always cake. I’m not a monster.']}]}},

 // ---------------- Keyleth, Druid of the Air Ashari (Faith) ----------------
 keyleth:{
  cheers:[
   {open:['You prayed! The oak told me. Okay, it rustled. I interpreted. I think it was impressed?'],
    opts:[{t:'Tell the oak I’ll be back tomorrow.',r:['Oh, it’ll love that. It doesn’t get a lot of visitors. Neither do I. Wait.']},{t:'You talk to trees a lot.',r:['They’re good listeners! Better than Grog. Way better than Grog.']}]},
   {open:['Gratitude list done! Mine has, like, forty things on it. Is that too many? Vex says that’s too many.'],
    opts:[{t:'Not too many. I’m doing mine every night.',r:['Every night? Okay. Okay! Me too. Pact. Druid pact.']},{t:'Mine had three.',r:['Three is great! Three is a very balanced number. Nature likes three.']}]},
   {open:['You read this morning. I tried to, but a squirrel needed advice. You’re more consistent than me.'],
    opts:[{t:'I’m sticking with it.',r:['* She beams, then trips on a root. “I’m fine! Proud of you!”']},{t:'What did the squirrel need?',r:['Relationship stuff. It’s complicated. Squirrels are dramatic.']}]},
   {open:['I always worry I’m not doing enough. Then I see you just keep showing up, a little every day, and I think maybe that’s it?'],
    opts:[{t:'That’s it. And I’m not stopping.',r:['Okay. Good. Me neither. I mean it this time. I always mean it.']},{t:'Also snacks help.',r:['Snacks always help. Druid wisdom. Write that down.']}]}],
  codex:'Okay, so you wrote this, and I read it, sorry, and it’s really good. Read it again?',
  ack:'Yes! See, that’s what I mean. You make it look easy. It’s not easy.',
  done:{open:['You did all of it! The whole day! The wind literally just changed direction. That was me. I got excited.'],
   opts:[{t:'Again tomorrow. Count on it.',r:['I will! I’ll tell the trees. They’ll be so smug.']},{t:'Can you do that again?',r:['* A warm breeze tousles your hair. She looks very pleased with herself.']}]}},

 // ---------------- Shadowheart, Cleric of Selûne (Faith) ----------------
 shadowheart:{
  cheers:[
   {open:['You prayed. Even on a long day. That’s the part nobody claps for. I noticed anyway.'],
    opts:[{t:'Every night. I’m choosing it.',r:['* She almost smiles. “Careful. That’s the kind of thing I remember.”']},{t:'It was a short one.',r:['Short is fine. Selûne isn’t counting words.']}]},
   {open:['Gratitude list. Hm. I used to think that sort of thing was soft. Turns out it’s the hard part.'],
    opts:[{t:'I’m keeping it up.',r:['I know you will. It’s irritatingly admirable.']},{t:'Soft is underrated.',r:['Don’t push your luck.','* She’s smiling though.']}]},
   {open:['You read before the house woke up. Quiet like that is rare. You actually used it.'],
    opts:[{t:'Tomorrow, same hour.',r:['Then I’ll be up under the moon too. Purely coincidence.']},{t:'The coffee helped.',r:['Hah. Even clerics have their small rituals.']}]},
   {open:['Faith isn’t a feeling. It’s a choice you make again, tonight. You made it. Good.'],
    opts:[{t:'And I’ll make it tomorrow.',r:['* She brushes your hand, just once. “I’ll hold you to that.”']},{t:'That was almost a speech.',r:['Don’t get used to it. I have a reputation.']}]}],
  codex:'You wrote this down in a clearer moment. Read it. Mean it.',
  ack:'Good. Words are easy. You’re making them true.',
  done:{open:['All done. The moon’s up. Walk with me a while, before I change my mind about being sentimental.'],
   opts:[{t:'Every day, same as today.',r:['I believe you. That’s new for me.']},{t:'You won’t change your mind.',r:['No. I won’t. Don’t tell anyone.']}]}},

 // ---------------- Megan, Priestess of the Light (Faith) — sweet only ----------------
 megan:{
  cheers:[
   {open:['You prayed this morning! I saw it on the board and did a little happy dance. Nobody saw. Probably.'],
    opts:[{t:'I’ll be back at it tomorrow.',r:['I know you will. I’ll be praying right alongside you.']},{t:'I want to see the dance.',r:['Ha! Maybe later. If you’re lucky.']}]},
   {open:['Gratitude list done. Want to know what’s on mine tonight? You. Every single night, you.'],
    opts:[{t:'I’m writing mine every night too.',r:['Then we’ll compare at supper. I bet we have some of the same ones.']},{t:'Only once? Every night?',r:['Okay, sometimes twice. Don’t let it go to your head.']}]},
   {open:['You read this morning before the kids got up. That’s not easy. I know how tired you are.'],
    opts:[{t:'Worth it. I’m keeping this going.',r:['* She squeezes your hand. “I love seeing you like this.”']},{t:'The coffee did the heavy lifting.',r:['Then I’ll keep the coffee coming. Teamwork.']}]},
   {open:['I keep a lamp lit for you in the Chapel. It looked extra bright today. Just saying.'],
    opts:[{t:'Keep it lit. I’m not stopping.',r:['It’s not going anywhere. Neither am I.']},{t:'Did you just trim the wick?',r:['Okay, maybe I trimmed the wick. It still counts.']}]}],
  codex:'Hey. You wrote this down once. I think you need it today.',
  ack:'That’s my guy. I’m so proud of you.',
  done:{open:['Everything done today. All of it. Come here, I want to give you a hug before the next thing needs us.'],
   opts:[{t:'Same again tomorrow. Together.',r:['Together. I like the sound of that every time.']},{t:'Can the hug be a long one?',r:['It can be as long as you want. The lamps can wait.']}]}},

 // ---------------- Tyrande, High Priestess of the Moon (Marriage) ----------------
 tyrande:{
  cheers:[
   {open:['You gave your wife your full attention tonight. I waited ten thousand years for that kind of attention. Do not waste it.'],
    opts:[{t:'I won’t. Tomorrow too.',r:['Good. Elune sees vows kept. So do I.']},{t:'Ten thousand years is a lot of waiting.',r:['Malfurion napped through most of it. You will not.']}]},
   {open:['A date night. Planned, not improvised. I approve. Even Malfurion learned that eventually.'],
    opts:[{t:'Another one’s already on the calendar.',r:['* A slow, pleased smile. “Now you sound like a husband.”']},{t:'He had a lot of time to learn.',r:['He did. You don’t need ten millennia. Just Thursdays.']}]},
   {open:['You put the phone away and listened to her. Truly listened. That is rarer than moonwells.'],
    opts:[{t:'I’m keeping it away.',r:['Then she will feel it. Women always do.']},{t:'I only checked it once.',r:['Once. I will allow it. Barely.']}]},
   {open:['A marriage is a vow you keep every night, not once. You kept it tonight. I saw.'],
    opts:[{t:'Every night. That’s my vow.',r:['* Her silver eyes soften. “Then she is a fortunate woman.”']},{t:'You were watching?',r:['I am a priestess of the moon. I watch everything after dark.']}]}],
  codex:'Read what you wrote. Words spoken under the moon should not be forgotten.',
  ack:'Then it is sworn. Elune heard it as well.',
  done:{open:['Every task complete. The moon is rising. Go to her now, while the night is still young.'],
   opts:[{t:'Tomorrow, the same.',r:['I expected nothing less of you.']},{t:'Are you dismissing me?',r:['I am sending you somewhere better. There is a difference.']}]}},

 // ---------------- Padmé, Senator of Naboo (Marriage) ----------------
 padme:{
  cheers:[
   {open:['You told her the truth about your day. Even the hard part. That’s what keeps two people close.'],
    opts:[{t:'No secrets. I’m committed.',r:['* She smiles, a little sad, a little proud. “Then you’re wiser than I was.”']},{t:'The hard part was the dishes.',r:['Honestly? That’s still a hard part. On Naboo too.']}]},
   {open:['A real date. You planned it, you showed up, you paid attention. On Coruscant that would be front-page news.'],
    opts:[{t:'Next one’s already planned.',r:['Good. Don’t let the calendar decide for you.']},{t:'Do senators get date nights?',r:['Secret ones. On balconies. It’s complicated.']}]},
   {open:['You took a few minutes just for her. No phone, no work. She noticed. I promise she noticed.'],
    opts:[{t:'Tomorrow too. Every day.',r:['Then she’ll never have to wonder. That’s the gift.']},{t:'It was only ten minutes.',r:['Ten minutes, every day, is a whole life together.']}]},
   {open:['Love needs time and attention or it slips away. You gave it both today.'],
    opts:[{t:'I’m not letting it slip.',r:['* She touches your arm. “I believe you. Keep proving it.”']},{t:'Is that from a speech?',r:['It might end up in one. You inspired it.']}]}],
  codex:'You wrote this down. Read it again. Some things are worth repeating.',
  ack:'That’s a promise I’d put my name to. And I don’t do that lightly.',
  done:{open:['Every single thing, finished. Go home. Somebody’s waiting for you, and you’ve earned the evening.'],
   opts:[{t:'Same again tomorrow.',r:['I know. That’s why I trust you.']},{t:'Walk me to the gate first?',r:['* She takes your arm. “Just to the gate.”']}]}},

 // ---------------- Yennefer, Sorceress (Marriage) ----------------
 yennefer:{
  cheers:[
   {open:['You actually planned a date night. With a reservation. I’m almost impressed. Almost.'],
    opts:[{t:'And I’ll plan the next one.',r:['Good. Half-hearted men bore me. You’re not boring tonight.']},{t:'Almost?',r:['Don’t fish. It’s unattractive. Mostly.']}]},
   {open:['You listened to her without fixing anything. Do you know how rare that is? Geralt took decades.'],
    opts:[{t:'I’m going to keep listening.',r:['* A lilac-scented smirk. “See that you do.”']},{t:'I wanted to fix it a little.',r:['Of course you did. You held back. That’s the point.']}]},
   {open:['A note for your wife. Handwritten. Sentimental. I hate how much I like that.'],
    opts:[{t:'There’ll be more.',r:['Then she’s luckier than most. Don’t make me regret saying it.']},{t:'You hate it?',r:['Passionately. Write another one.']}]},
   {open:['Love isn’t a destiny. It’s a choice, every day, out loud. You chose today.'],
    opts:[{t:'I choose it tomorrow too.',r:['Good answer. The only answer, in fact.']},{t:'Was that sincere? From you?',r:['Tell anyone and I’ll turn you into a toad.']}]}],
  codex:'You wrote this. Read it and stop looking so surprised you were right.',
  ack:'Finally. Commitment suits you. Don’t ruin it.',
  done:{open:['Everything done. Hm. I had a whole lecture prepared. Now I’ll have to save it.'],
   opts:[{t:'Save it. I’ll do it all again tomorrow.',r:['We’ll see. I have a long memory.']},{t:'Give me the lecture anyway.',r:['Go home to your wife. That’s the lecture.']}]}},

 // ---------------- Briget, Rose Princess (Marriage) ----------------
 briget:{
  cheers:[
   {open:['Flowers for your wife! On a Tuesday! For no reason! Oh, I could kiss you. I won’t. I could.'],
    opts:[{t:'There’ll be flowers next week too.',r:['A man with a standing flower order. Be still, my heart.']},{t:'It was a grocery store bouquet.',r:['Darling, it’s the gesture. Roses don’t care where they came from.']}]},
   {open:['You danced with her in the kitchen. Don’t deny it, I have spies. The spies are me.'],
    opts:[{t:'I’m doing it again.',r:['* She twirls once, delighted. “Every week. That’s an order.”']},{t:'I stepped on her feet.',r:['Charming. That’s how you know it was a real dance.']}]},
   {open:['Date night done. Was there candlelight? Tell me there was candlelight.'],
    opts:[{t:'Next time, candles. I promise.',r:['Good. Romance needs a little ceremony. I’ll lend you mine.']},{t:'There was a pizza box.',r:['A pizza box can be very romantic. In the right light.']}]},
   {open:['A little letter for her, just because. That’s my favorite kind of letter.'],
    opts:[{t:'I’ll write another next week.',r:['Make it a habit and she’ll fall in love all over again.']},{t:'It was three sentences.',r:['Three perfect sentences. Shakespeare used more and meant less.']}]}],
  codex:'Ooh, a note in your hand. Read it to me, slowly, like a proclamation.',
  ack:'Signed and sealed. I’m having it framed. Metaphorically.',
  done:{open:['Every task done! This deserves a little ceremony. Petals, perhaps. A fanfare.'],
   opts:[{t:'Again tomorrow. Bring the fanfare.',r:['Oh, I’ll bring a whole orchestra.']},{t:'Just a small fanfare.',r:['* She hums one, very off-key, and curtsies.']}]}},

 // ---------------- Kitai, Marat Warrior (Marriage) ----------------
 kitai:{
  cheers:[
   {open:['Aleran. You took your mate somewhere nice. On purpose. I thought your kind forgot how.'],
    opts:[{t:'Not forgetting. Next week too.',r:['Good. Tavi forgets. I remind him. Loudly.']},{t:'We did go somewhere nice.',r:['I know. I followed you. You walk like a gargant.']}]},
   {open:['You put away your little glowing rock and talked to her. Finally. She was waiting.'],
    opts:[{t:'It stays away. I mean it.',r:['* She grins, all teeth. “We will see, Aleran.”']},{t:'My phone isn’t a rock.',r:['It is a rock that steals husbands. I would smash it.']}]},
   {open:['You helped her without being asked. Among my people that is how you show love. Also hunting.'],
    opts:[{t:'I’m doing it every day.',r:['Then you are almost Marat. Almost.']},{t:'Should I go hunting too?',r:['You would scare off everything. Do the dishes.']}]},
   {open:['You are not as hopeless as I thought. Your wife is lucky. Tell her I said that.'],
    opts:[{t:'Tomorrow I’ll be even better.',r:['A challenge? Good. I will be watching.']},{t:'That was a compliment?',r:['From me, the best you will get. Treasure it.']}]}],
  codex:'You scratched this into your little book. Read it, Aleran.',
  ack:'Hm. Good. Now do it. Talking is for Alerans.',
  done:{open:['All of it done. I did not even have to throw anything at you today.'],
   opts:[{t:'Same tomorrow. Try and stop me.',r:['I will try. That is the fun part.']},{t:'Race you home?',r:['* She’s already gone. You hear her laughing from the trees.']}]}},

 // ---------------- Victra, The Julii Heiress (Marriage) ----------------
 victra:{
  cheers:[
   {open:['You took your wife out. Flowers, real table, your full attention. Good. A man who courts what he already has.'],
    opts:[{t:'And I’ll keep courting her.',r:['That’s the right answer. Sevro would be jealous. Of me, for spotting you.']},{t:'It was mostly her idea.',r:['And you said yes like you meant it. That counts.']}]},
   {open:['You told her she was beautiful. Out loud. Without being prompted. Most men are cowards about that.'],
    opts:[{t:'I’ll tell her every day.',r:['* A wicked smile. “Then you’re not most men. Lucky her.”']},{t:'She already knows.',r:['Knowing and hearing are different things, darling.']}]},
   {open:['Put the phone down and had dinner like a person. Good. I was about to throw it in the lake.'],
    opts:[{t:'It stays down at dinner now.',r:['Excellent. I’ll only threaten you once a week.']},{t:'Please don’t throw my phone.',r:['Then don’t give me reasons. Simple.']}]},
   {open:['I judge every husband in this village. You’re climbing the list. Don’t get smug.'],
    opts:[{t:'Top of the list. Watch me.',r:['Oh, I’m watching. I’m always watching.']},{t:'Who’s at the top?',r:['Sevro. Loudly. Embarrassingly. Then you, maybe.']}]}],
  codex:'Read what you wrote. Then do it. I hate men who only talk.',
  ack:'Good. Loyalty looks good on you.',
  done:{open:['Everything done. I’d buy you a drink, but you should go home to her. Go on.'],
   opts:[{t:'Same again tomorrow.',r:['I’ll have the drink waiting. For both of you.']},{t:'Just one drink?',r:['No. Home. I’m terrifying when I repeat myself.']}]}},

 // ---------------- Vin, Mistborn (Fatherhood) ----------------
 vin:{
  cheers:[
   {open:['You were home for bedtime. Read the book. Did the voices. Nobody did that for me. They’re lucky.'],
    opts:[{t:'I’ll be there tomorrow night too.',r:['* She looks away fast. “Good. That matters more than you think.”']},{t:'I’m bad at the voices.',r:['They don’t care. They care that it’s you doing them.']}]},
   {open:['You played with them. Actually played, on the floor. Kelsier would’ve called that a crew-building exercise.'],
    opts:[{t:'I’m showing up every day.',r:['That’s it. That’s the whole thing. Keep doing it.']},{t:'My knees disagree.',r:['Burn some pewter. Oh, right. Just stretch, then.']}]},
   {open:['You listened when they talked. Even the boring stuff about some game. Kids notice who listens.'],
    opts:[{t:'I’m always going to listen.',r:['They’ll remember that. I remember who didn’t.']},{t:'It really was boring.',r:['Ha. Yeah. Listen anyway. You did.']}]},
   {open:['I grew up not trusting anyone. Your kids won’t. Because of days like today.'],
    opts:[{t:'Not on my watch.',r:['* A rare smile. “No. Not on yours.”']},{t:'That’s a heavy thing to say.',r:['I don’t do small talk. You know that.']}]}],
  codex:'You wrote something down. Read it. Then go hug them.',
  ack:'Good. Keep your word to them. That’s everything.',
  done:{open:['All done. Kids asleep? Come up on the roof. City looks better at night.'],
   opts:[{t:'Same again tomorrow.',r:['I know. You’re not the leaving kind.']},{t:'I’ll take the stairs.',r:['Slowpoke. I’ll wait. Barely.']}]}},

 // ---------------- Hera, Captain of the Ghost (Fatherhood) ----------------
 hera:{
  cheers:[
   {open:['Dinner at the table with the kids. Everyone fed, everyone talking. That’s how you keep a crew together.'],
    opts:[{t:'Every night I can. Count me in.',r:['That’s what I like to hear. Steady hands on the controls.']},{t:'Somebody spilled milk.',r:['Somebody always spills something. Zeb spilled a lot worse.']}]},
   {open:['You made time for each kid, one at a time. That’s good flying. Nobody gets left on the ramp.'],
    opts:[{t:'Nobody gets left behind.',r:['* She grins. “Now you sound like a captain.”']},{t:'I’m running low on fuel.',r:['Then refuel and go again. That’s the job, love.']}]},
   {open:['You stayed patient when they melted down. I know that took everything you had.'],
    opts:[{t:'I’ll stay patient tomorrow too.',r:['I believe you. Jacen would’ve liked you.']},{t:'I counted to ten. Twice.',r:['Twice is fine. I’ve counted to fifty on the Ghost.']}]},
   {open:['Bedtime handled, story read, lights out. Smooth landing.'],
    opts:[{t:'Same landing tomorrow.',r:['Copy that. Ghost’s proud to have you aboard.']},{t:'Smooth-ish.',r:['Any landing you walk away from counts.']}]}],
  codex:'You logged this once. Good pilots read their own logs.',
  ack:'Course locked in. I’m proud of you.',
  done:{open:['Every task complete. Ship’s quiet, crew’s fed. Sit down a minute. You earned it.'],
   opts:[{t:'Ready to fly again tomorrow.',r:['That’s my favorite answer. Get some sleep first.']},{t:'Is there caf?',r:['There’s always caf. Chopper might’ve sabotaged it.']}]}},

 // ---------------- Liko, Young Explorer (Fatherhood) — platonic ----------------
 liko:{
  cheers:[
   {open:['You played with your kids today! I wrote it in my notebook. Under “really good stuff.”'],
    opts:[{t:'Write it down again tomorrow.',r:['Okay! I’ll save a whole page. Maybe two.']},{t:'You have a notebook for that?',r:['I have a notebook for everything. Sprigatito chewed one.']}]},
   {open:['Um, you read them a bedtime story? My grandma used to do that. It made the dark less scary.'],
    opts:[{t:'Every night I can.',r:['* She hugs her notebook. “They’re really lucky. Just so you know.”']},{t:'I fell asleep halfway.',r:['Ha! That still counts. I think. It counts.']}]},
   {open:['You listened to them for a long time. When I was little, that meant everything. It still does.'],
    opts:[{t:'I’m always going to listen.',r:['Okay. Good. That’s… really good.']},{t:'You’re still little.',r:['I’m not that little! I’m on an adventure!']}]},
   {open:['You went outside with them! Did you find any cool bugs? Please say you found bugs.'],
    opts:[{t:'Next time, bugs. Promise.',r:['Yes! Report back. I need data.']},{t:'We found a worm.',r:['A worm counts! Worms are amazing!']}]}],
  codex:'Um, you wrote this before. I think it’s really good. Read it?',
  ack:'Yeah! That’s the stuff. You’re like a real hero.',
  done:{open:['You did everything today! Like, everything! Sprigatito, look!'],
   opts:[{t:'Again tomorrow!',r:['Okay! I’ll be cheering. Really loud.']},{t:'Is Sprigatito impressed?',r:['He’s asleep. But in an impressed way.']}]}},

 // ---------------- Wanda, Scarlet Witch (Fatherhood) ----------------
 wanda:{
  cheers:[
   {open:['You tucked them in tonight. That’s all I ever wanted. Don’t you dare take it for granted.'],
    opts:[{t:'I won’t. Every night I can.',r:['* Her eyes shine a little. “Good. Go kiss them goodnight again.”']},{t:'They wanted three glasses of water.',r:['Of course they did. Billy wanted four.']}]},
   {open:['You played with them. No magic, no screens, just you. That’s better than anything I could make.'],
    opts:[{t:'Just me. Tomorrow too.',r:['That’s exactly right. Just you.']},{t:'I could use a little magic.',r:['Coffee. That’s my magic most mornings.']}]},
   {open:['You said yes to the silly game. Even though you were tired. I saw.'],
    opts:[{t:'I’ll keep saying yes.',r:['They’ll remember the yeses. I promise you that.']},{t:'I said yes to five silly games.',r:['* She laughs. “And you survived. Barely.”']}]},
   {open:['An evening with your kids. Nothing anyone can conjure is worth more than that.'],
    opts:[{t:'I know. I’m not missing it.',r:['Then you’re richer than any witch.']},{t:'Not even paprikash?',r:['Okay. Paprikash comes close. Second place.']}]}],
  codex:'You wrote this. Read it. Hold it close, like they’re asleep on your chest.',
  ack:'Good. Keep that promise. It’s the realest thing there is.',
  done:{open:['Everything done. The house is quiet. Sit with me a minute and just breathe.'],
   opts:[{t:'Same again tomorrow.',r:['I know. Go check on them first.']},{t:'Is there paprikash left?',r:['There’s always paprikash. I made extra. On purpose.']}]}},

 // ---------------- Jean, Phoenix (Fatherhood) ----------------
 jean:{
  cheers:[
   {open:['You told your kid exactly what you love about them. Out loud. They’ll carry that for years.'],
    opts:[{t:'I’ll tell them again tomorrow.',r:['Good. Kids need to hear it more than once. So do grown-ups.']},{t:'They rolled their eyes.',r:['And smiled after. I felt it from here.']}]},
   {open:['You helped with homework and didn’t lose your patience. I’ve run a school. That’s heroic.'],
    opts:[{t:'Patience every time. I’m in.',r:['* She smiles. “I believe you. You’re thinking it loudly.”']},{t:'I lost a little patience.',r:['A little. Then you found it again. That counts.']}]},
   {open:['You noticed something small about them today. That’s how kids know they’re seen.'],
    opts:[{t:'I’ll keep noticing.',r:['That’s the most important thing a teacher learns. Or a dad.']},{t:'Are you reading my mind?',r:['Only a little. You’re projecting. It’s sweet.']}]},
   {open:['Bedtime done, story read, lights off. Somewhere a kid just fell asleep feeling safe.'],
    opts:[{t:'Every night I can.',r:['Then they’ll grow up brave. I’ve seen it happen.']},{t:'Somewhere one is still awake.',r:['Ha. Okay, almost asleep. Close enough.']}]}],
  codex:'You wrote this down. I can feel you meant it. Read it again.',
  ack:'There. Now I can hear it in your head too. Loud and clear.',
  done:{open:['All done. You’re humming in your head, you know. Loudly. It’s nice.'],
   opts:[{t:'Again tomorrow. I mean it.',r:['I know you do. I can tell.']},{t:'What am I humming?',r:['Something off-key. Very off-key. I love it.']}]}},

 // ---------------- Kira, Blade Dancer (Fitness) ----------------
 kira:{
  cheers:[
   {open:['Workout done? Look at you, sweaty and smug. I trained you well. Okay, you trained you. I watched.'],
    opts:[{t:'Again tomorrow. Bring the saber.',r:['Oh, I’ll bring both ends. Don’t drop your guard.']},{t:'You definitely just watched.',r:['Watching is a skill. I’m very good at it. Ask anyone.']}]},
   {open:['You actually went for that run. In the cold. You’re either dedicated or a little unhinged. I like both.'],
    opts:[{t:'Dedicated. I’m going tomorrow too.',r:['* She grins. “Unhinged it is. Can I come?”']},{t:'Mostly unhinged.',r:['The best Jedi are. Don’t tell the Council.']}]},
   {open:['Push-ups done. You kept your form. I was ready to make fun of you and you ruined it.'],
    opts:[{t:'Get used to it.',r:['Ugh. Fine. I’ll find something else to tease.']},{t:'My arms are noodles.',r:['Noodle arms that did the reps. Respect.']}]},
   {open:['I outran my past one session at a time. You’re doing the same thing. Just with less Sith.'],
    opts:[{t:'One more session tomorrow.',r:['That’s the spirit. See you at the fence.']},{t:'Much less Sith, hopefully.',r:['Zero Sith. Strict policy. I checked.']}]}],
  codex:'You wrote this. Read it. Then stop stalling and stretch.',
  ack:'Good. Now I believe you. Mostly.',
  done:{open:['Everything done today. Show-off. Want to spar for fun? Loser buys dinner.'],
   opts:[{t:'Tomorrow too. And I’m winning.',r:['Big talk. I love big talk. Back it up.']},{t:'I’ll just buy dinner.',r:['Coward. Charming coward. I want noodles.']}]}},

 // ---------------- Fannie, Explorer (Fitness) ----------------
 fannie:{
  cheers:[
   {open:['You ran! I’m adding your route to my map. It’s getting so big! Okay, I’m drawing a little flag on it.'],
    opts:[{t:'Add another flag tomorrow.',r:['Yes! New trail, new flag. We’re gonna fill the whole map.']},{t:'Make the flag rainbow.',r:['Obviously rainbow. Matches my goggles.']}]},
   {open:['Workout done and your cheeks are all pink! That’s the best look. Trust me, I’m an expert.'],
    opts:[{t:'I’m out there again tomorrow.',r:['* She bounces on her toes. “Can I come? Please say yes.”']},{t:'It’s mostly windburn.',r:['Windburn means you went somewhere! Counts double.']}]},
   {open:['You went for a walk! Did you see anything cool? Birds? Weird rocks? A suspicious duck?'],
    opts:[{t:'I’ll go looking again tomorrow.',r:['Report every duck. I mean it.']},{t:'There was a suspicious duck.',r:['I KNEW it. They’re everywhere this season.']}]},
   {open:['Every run makes the world a little bigger. And your mood a little better. I’ve done the science!'],
    opts:[{t:'Then I’m running every day.',r:['Yes! Best mood in the whole village. Watch out.']},{t:'Was there actual science?',r:['There was a chart. With stickers. Science.']}]}],
  codex:'You wrote this on the trail once! Read it, explorer.',
  ack:'Woo! That one’s going on the map in big letters.',
  done:{open:['You finished EVERYTHING. That’s a whole new region unlocked. I’m so proud I could do a cartwheel.'],
   opts:[{t:'More tomorrow. Let’s go.',r:['Let’s go! Boots by the door!']},{t:'Do the cartwheel.',r:['* She does. Badly. Into a bush. “Nailed it!”']}]}},

 // ---------------- Rey, Scavenger Jedi (Fitness) ----------------
 rey:{
  cheers:[
   {open:['You lifted today. Good. On Jakku I hauled scrap all day just to eat. You’re doing it for fun. Mostly fun.'],
    opts:[{t:'Again tomorrow. Heavier.',r:['Heavier. I like that. You’d have done well on Jakku.']},{t:'Mostly not fun.',r:['Ha. Try carrying a hull plate in a sandstorm.']}]},
   {open:['You ran. In the heat? You’re tougher than you look. And you look pretty tough.'],
    opts:[{t:'Tomorrow too. Same pace.',r:['* She grins. “I’ll keep up. Probably pass you.”']},{t:'Was that a compliment?',r:['It was. Don’t make it weird.']}]},
   {open:['A long walk with a heavy pack. That’s my whole childhood. It’s strange seeing someone choose it.'],
    opts:[{t:'I’m choosing it every day.',r:['Then you’ll get strong the honest way. A thousand ordinary days.']},{t:'My pack was groceries.',r:['Groceries count. Ever haul a sack of salvage for one portion of bread?']}]},
   {open:['You stretched afterward. Good. I didn’t, for years. My back still remembers.'],
    opts:[{t:'I’ll keep stretching.',r:['Smart. Smarter than I was.']},{t:'Your back seems fine.',r:['You’re staring at my back? Hm. Fair.']}]}],
  codex:'You scratched this down somewhere. Read it. Then go lift something.',
  ack:'Good. Words are light. Carry them anyway.',
  done:{open:['All done for today. Sit. I’ll share my portion bread. It’s terrible. It’s yours.'],
   opts:[{t:'Same again tomorrow.',r:['I know. You don’t quit. Neither do I.']},{t:'Is it really terrible?',r:['Awful. You’ll eat it anyway. Everybody does.']}]}},

 // ---------------- Nemona, Champion Rival (Fitness) — platonic ----------------
 nemona:{
  cheers:[
   {open:['You worked out! YES! I’m updating the chart! The laminated one!'],
    opts:[{t:'Update it again tomorrow!',r:['I’ll need more lamination! This is the best problem!']},{t:'Do you sleep?',r:['Sometimes! Between battles! Pawmot makes me!']}]},
   {open:['You went for a run?! Without me?! Okay, I’m proud AND jealous. Rematch tomorrow?'],
    opts:[{t:'Rematch tomorrow. I’ll be there.',r:['YES! My rival! Pawmot, did you hear that?!']},{t:'I needed a head start.',r:['Smart! Sneaky! I respect it! Still winning though!']}]},
   {open:['Push-ups? How many? More than yesterday? Tell me it was more than yesterday!'],
    opts:[{t:'More every day. That’s the plan.',r:['THAT’S my rival! You’re gonna be a Champion at this!']},{t:'Same as yesterday.',r:['Same is great! Same means you didn’t skip!']}]},
   {open:['You stretched AND worked out? Okay, you’re basically training like a gym leader now.'],
    opts:[{t:'Gym leader? Let’s go further.',r:['Champion rank! I knew it! Battle me!']},{t:'Basically a gym leader?',r:['Basically! Don’t let it go to your head! Okay, a little!']}]}],
  codex:'You wrote this down! It’s like a strategy guide! Read it!',
  ack:'Locked in! Now let’s battle!',
  done:{open:['Everything done?! That’s a perfect run! I’m giving you a badge! I made it out of a bottle cap!'],
   opts:[{t:'Going for another tomorrow!',r:['Two badges! The collection begins!']},{t:'Is it a good bottle cap?',r:['The BEST bottle cap! Pawmot picked it!']}]}},

 // ---------------- Karlach, Tiefling Barbarian (Fitness) ----------------
 karlach:{
  cheers:[
   {open:['WORKOUT DONE! Soldier, that’s what I like to see! Come here, high five. Careful, my hands are toasty.'],
    opts:[{t:'Same time tomorrow, soldier.',r:['Hell yeah! I’ll bring the heavy stuff!']},{t:'How toasty are we talking?',r:['Eh, mild burns. Builds character.']}]},
   {open:['You went for a run? Oh, I love that. I spent ten years running from devils. Yours is way more fun.'],
    opts:[{t:'I’m running again tomorrow.',r:['* She thumps your back. Hard. “That’s my soldier!”']},{t:'I ran from a dog once.',r:['Ha! Did you win? You won. I believe in you.']}]},
   {open:['Lifting heavy things is basically a party. You just had a party. I’m so proud.'],
    opts:[{t:'Party again tomorrow.',r:['YES! I’ll bring snacks! Lots of snacks!']},{t:'A sweaty party.',r:['Best kind! The engine likes it too.']}]},
   {open:['Hear that? My engine’s purring. Seeing you train does that. Don’t think too hard about it.'],
    opts:[{t:'I’ll keep the engine purring.',r:['Oh, you’d better. I’m counting on it, soldier.']},{t:'Is that safe?',r:['Absolutely not! Totally worth it!']}]}],
  codex:'Soldier! You wrote this down! Read it out loud. Louder!',
  ack:'That’s it! Now go break something. Not literally. Okay, a little.',
  done:{open:['EVERYTHING done?! Come here, I’m lifting you up. Yep, already doing it.'],
   opts:[{t:'And tomorrow I do it all again.',r:['That’s the spirit! Best soldier in the whole camp!']},{t:'Put me down?',r:['Nope! Victory lap first!']}]}},

 // ---------------- Shallan, Scholar & Artist (Work) ----------------
 shallan:{
  cheers:[
   {open:['You did your deep work block. No distractions. I tried that once. I drew seventeen chulls instead.'],
    opts:[{t:'Another block tomorrow.',r:['Good. I’ll sketch you working. Very serious face. Very handsome.']},{t:'Seventeen?',r:['They were very good chulls. Pattern liked them.']}]},
   {open:['You finished the thing you’d been putting off. I know that feeling. It’s like taking off a mask you hated.'],
    opts:[{t:'No more putting things off.',r:['* She hugs her sketchbook. “I believe you. Mostly. Pattern believes you more.”']},{t:'I procrastinated first.',r:['Of course you did. Everyone does. Then you did it. That’s the part that counts.']}]},
   {open:['You looked at the money. Budget and all. Numbers are just very unromantic sketches, really.'],
    opts:[{t:'I’m staying on top of it.',r:['Look at you. Responsible. It’s weirdly attractive.']},{t:'Unromantic is right.',r:['I could draw little hearts in the margins. Helps me.']}]},
   {open:['Pattern says you were very focused today. He hummed about it. He hums when he approves. Mmm.'],
    opts:[{t:'Tell him tomorrow too.',r:['He’s already humming. Ugh. You two are insufferable.']},{t:'Does he hum at you?',r:['Constantly. Mostly when I lie. So, constantly.']}]}],
  codex:'You wrote this down. I’d have drawn it, but your words are better. Read it.',
  ack:'Good. That’s the real you talking. I can tell.',
  done:{open:['You finished everything. Every single thing. I’m drawing you right now. Don’t move. Okay, move a little.'],
   opts:[{t:'Again tomorrow. Draw me then too.',r:['I’ll need a bigger sketchbook.']},{t:'Can I see the drawing?',r:['Absolutely not. It’s… flattering. Too flattering.']}]}},
};
