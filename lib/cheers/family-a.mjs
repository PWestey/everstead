// Cheers (task-completion pop-ups) for Family set A.
// Shape: {id:{cheers:[4 moments], codex:'line', ack:'line', done:moment}}. Each moment has exactly 2 opts.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Ariane, Wizard of Light (Faith) ----------------
 ariane:{
  cheers:[
   {open:['You prayed! I felt the chapel candles flicker. Okay, that might’ve been a draft. I’m choosing to believe it was you. I was hoping you’d come find me afterward.'],
    opts:[{t:'It was me. Same time tomorrow.',r:['Good. I’m saving you a candle. Right by mine.']},{t:'Maybe it was the draft.',r:['Hush. Let a wizard have her theories.']}]},
   {open:['Scripture before breakfast? The Tower made us memorize runes at dawn and I never once looked that happy about it. Stay a moment. You’re rather good for my concentration. Well, no. Terrible.'],
    opts:[{t:'I’m keeping this one going.',r:['* Her fingertips spark gold. “Sorry. That happens when I’m proud.”']},{t:'Happy is a strong word.',r:['Fine. Determined. Determined is very attractive too.']}]},
   {open:['You wrote down three things you’re grateful for. Can I guess if I’m one of them? No. Don’t tell me. Tell me. You’re on mine. I’m getting less subtle about it.'],
    opts:[{t:'Every night, Ariane. I’m in.',r:['* She glows. Actually glows. “That’s… a yes to both, isn’t it.”']},{t:'You were number four.',r:['Number four. I’ll take it. I’m coming for number three.']}]},
   {open:['I lit a little light for you this morning before you even got up. Looks like it worked. I wanted an excuse to see you. There, now you know.'],
    opts:[{t:'Keep it lit. I’ll keep coming.',r:['Deal. Candles are cheap. You’re worth a whole box.']},{t:'Is that how it works?',r:['Mostly. The rest was you. Don’t tell the Tower.']}]}],
  codex:'You wrote this down once. I kept it by the altar. Read it again.',
  ack:'There. Now it’s a promise, and I’m holding you to it.',
  done:{open:['The lamps can wait. I’d like an evening with you, and I’m finally asking.'],
   opts:[{t:'Tomorrow I do it all again.',r:['And I’ll be right here lighting the candles when you do.']},{t:'I’d like that. Stay with me.',r:['* She takes your hand, smiling now. “I meant the whole evening. Walk home with me.”']}]}},

 // ---------------- Ahsoka, Wandering Jedi (Faith) ----------------
 ahsoka:{
  cheers:[
   {open:['You sat still and prayed. Most people can’t manage five minutes without checking something. I noticed. Now that your mind’s quiet, I’d like your attention.'],
    opts:[{t:'Tomorrow too. Same spot.',r:['I’ll be there. Probably on the roof, but I’ll be there.']},{t:'I peeked at my phone once.',r:['Once is progress. Skyguy couldn’t make it thirty seconds.']}]},
   {open:['You read this morning. Good. The quiet before the day starts is where you hear things. I saved you a place beside me. That was deliberate.'],
    opts:[{t:'I’m not skipping it again.',r:['I believe you. Don’t make me come find you at dawn.']},{t:'Mostly I heard the kids.',r:['That counts. The Force is in noisy places too.']}]},
   {open:['Gratitude list. Short, honest. That’s the right way to do it. You don’t have to guess whether I enjoy your company. I do.'],
    opts:[{t:'Count me in, every night.',r:['* A small smile. “Then I’ll keep listening.”']},{t:'I ran out after two.',r:['Two true ones beat ten you don’t mean.']}]},
   {open:['I can feel it when you do this. You’re steadier. Calmer around the edges. Come find me later. No sabers this time.'],
    opts:[{t:'I’m holding onto this.',r:['Good. It slips if you let it. I’ll remind you.']},{t:'You can feel that?',r:['Togruta. Jedi. Very nosy. Pick one.']}]}],
  codex:'You told yourself something important once. Read it slowly.',
  ack:'That’s it. Say it, then live it. That’s the whole trick.',
  done:{open:['Training’s over. Walk with me. I’ve wanted you to myself all day.','* She holds your gaze, waiting for your answer.'],
   opts:[{t:'Same again tomorrow.',r:['I know. That’s why I’m still here.']},{t:'I’d like that. Stay with me.',r:['* She holds your gaze. “I’m staying right here.” Her next kiss is unhurried.']}]}},

 // ---------------- Lys, Temple Keeper (Faith) ----------------
 lys:{
  cheers:[
   {open:['You said your prayers. I put the kettle on the second I heard. Jasmine, two honeys. I’ve been saving the seat right next to mine.'],
    opts:[{t:'Pour me one tomorrow too.',r:['I’ll pour it too early. I always do. You’ll come anyway.']},{t:'You heard? From the temple?',r:['I listen for you. That sounded less strange in my head.']}]},
   {open:['A thank-you list. Oh, I love those. Small ones are my favorite. The good coffee. The kids laughing. One of mine is the way you look at me when you think I’m busy.'],
    opts:[{t:'Every night. I promise.',r:['* She tucks the promise away like a pressed flower. “I’ll ask.”']},{t:'Mine had “coffee” three times.',r:['Then you’re very grateful for coffee. That’s allowed.']}]},
   {open:['You read a little scripture before the day got loud. That’s the best time. The cups are still warm. Stay for another cup. I haven’t had enough of you yet.'],
    opts:[{t:'I’m making it a habit.',r:['Then I’m making it a habit to wait for you.']},{t:'It was one verse.',r:['One verse, every day, adds up to a whole book.']}]},
   {open:['You look lighter. You always do after you pray. I notice. I notice too much, probably. I like having you close. Tea’s just my excuse.'],
    opts:[{t:'Keep noticing. I’ll keep at it.',r:['* She hides her smile behind her teacup and fails completely.']},{t:'It’s the tea.',r:['It is partly the tea. I’ll accept partial credit.']}]}],
  codex:'Sit. You wrote this on a better day. Read it with me.',
  ack:'There. I’ll leave a cup out tomorrow so you remember.',
  done:{open:['Everything’s settled. Come sit beside me. Closer than yesterday, please.'],
   opts:[{t:'I’ll do it all again tomorrow.',r:['I know. I’ll have the kettle on.']},{t:'I’d like that. Stay with me.',r:['* She sets her cup down. “I’d like another kiss. I’m trying to get better at asking.”']}]}},

 // ---------------- Keyleth, Druid of the Air Ashari (Faith) ----------------
 keyleth:{
  cheers:[
   {open:['You prayed! The oak told me. Okay, it rustled. I interpreted. I think it was impressed? Come sit with me? I promise to actually look at you this time.'],
    opts:[{t:'Tell the oak I’ll be back tomorrow.',r:['Oh, it’ll love that. It doesn’t get a lot of visitors. Neither do I. Wait.']},{t:'You talk to trees a lot.',r:['They’re good listeners! Better than Grog. Way better than Grog.']}]},
   {open:['Gratitude list done! Mine has, like, forty things on it. Is that too many? Vex says that’s too many. You’re on mine. No, I’m not taking that back.'],
    opts:[{t:'Not too many. I’m doing mine every night.',r:['Every night? Okay. Okay! Me too. Pact. Druid pact.']},{t:'Mine had three.',r:['Three is great! Three is a very balanced number. Nature likes three.']}]},
   {open:['You read this morning. I tried to, but a squirrel needed advice. You’re more consistent than me. I saved you a spot under the willow. Just us.'],
    opts:[{t:'I’m sticking with it.',r:['* She beams, then trips on a root. “I’m fine! Proud of you!”']},{t:'What did the squirrel need?',r:['Relationship stuff. It’s complicated. Squirrels are dramatic.']}]},
   {open:['I always worry I’m not doing enough. Then I see you just keep showing up, a little every day, and I think maybe that’s it? I like you. That’s what I’ve been trying to say. There.'],
    opts:[{t:'That’s it. And I’m not stopping.',r:['Okay. Good. Me neither. I mean it this time. I always mean it.']},{t:'Also snacks help.',r:['Snacks always help. Druid wisdom. Write that down.']}]}],
  codex:'Okay, so you wrote this, and I read it, sorry, and it’s really good. Read it again?',
  ack:'Yes! See, that’s what I mean. You make it look easy. It’s not easy.',
  done:{open:['All done? Good. I’ve been working up the nerve to ask you out all afternoon.'],
   opts:[{t:'Again tomorrow. Count on it.',r:['I will! I’ll tell the trees. They’ll be so smug.']},{t:'I’d like that. Stay with me.',r:['* She takes a breath and meets your eyes. “I’m nervous. I still want to kiss you.”']}]}},

 // ---------------- Shadowheart, Cleric of Selûne (Faith) ----------------
 shadowheart:{
  cheers:[
   {open:['You prayed. Even on a long day. That’s the part nobody claps for. I noticed anyway. Now come keep me company. Yes, that is an invitation.'],
    opts:[{t:'Every night. I’m choosing it.',r:['* She almost smiles. “Careful. That’s the kind of thing I remember.”']},{t:'It was a short one.',r:['Short is fine. Selûne isn’t counting words.']}]},
   {open:['Gratitude list. Hm. I used to think that sort of thing was soft. Turns out it’s the hard part. You’re making it difficult to pretend I wasn’t waiting for you.'],
    opts:[{t:'I’m keeping it up.',r:['I know you will. It’s irritatingly admirable.']},{t:'Soft is underrated.',r:['Don’t push your luck.','* She’s smiling though.']}]},
   {open:['You read before the house woke up. Quiet like that is rare. You actually used it. I rather like being the reason you stay up a little later.'],
    opts:[{t:'Tomorrow, same hour.',r:['Then I’ll be up under the moon too. Purely coincidence.']},{t:'The coffee helped.',r:['Hah. Even clerics have their small rituals.']}]},
   {open:['Faith isn’t a feeling. It’s a choice you make again, tonight. You made it. Good. You can stop wondering. I noticed you long before tonight.'],
    opts:[{t:'And I’ll make it tomorrow.',r:['* She brushes your hand, just once. “I’ll hold you to that.”']},{t:'That was almost a speech.',r:['Don’t get used to it. I have a reputation.']}]}],
  codex:'You wrote this down in a clearer moment. Read it. Mean it.',
  ack:'Good. Words are easy. You’re making them true.',
  done:{open:['Everything done. Come have a glass with me. I’ve been trying to remember why I keep pretending I don’t want you here.'],
   opts:[{t:'Every day, same as today.',r:['I believe you. That’s new for me.']},{t:'I’d like that. Stay with me.',r:['* Her smile settles. “I want another kiss. I thought I might try asking before I lose the nerve.”']}]}},

 // ---------------- Megan, Priestess of the Light (Faith) — sweet only ----------------
 megan:{
  cheers:[
   {open:['You prayed this morning! I saw it on the board and did a little happy dance. Nobody saw. Probably. I’ve been looking forward to having you to myself tonight.'],
    opts:[{t:'I’ll be back at it tomorrow.',r:['I know you will. I’ll be praying right alongside you.']},{t:'I want to see the dance.',r:['Ha! Maybe later. If you’re lucky.']}]},
   {open:['Gratitude list done. Want to know what’s on mine tonight? You. Every single night, you. And yes, I still get distracted watching you walk into a room.'],
    opts:[{t:'I’m writing mine every night too.',r:['Then we’ll compare at supper. I bet we have some of the same ones.']},{t:'Only once? Every night?',r:['Okay, sometimes twice. Don’t let it go to your head.']}]},
   {open:['You read this morning before the kids got up. That’s not easy. I know how tired you are. Come find me when the house is quiet. I miss us.'],
    opts:[{t:'Worth it. I’m keeping this going.',r:['* She squeezes your hand. “I love seeing you like this.”']},{t:'The coffee did the heavy lifting.',r:['Then I’ll keep the coffee coming. Teamwork.']}]},
   {open:['I keep a lamp lit for you in the Chapel. It looked extra bright today. Just saying. I love you. I also want a proper date with you, soon.'],
    opts:[{t:'Keep it lit. I’m not stopping.',r:['It’s not going anywhere. Neither am I.']},{t:'Did you just trim the wick?',r:['Okay, maybe I trimmed the wick. It still counts.']}]}],
  codex:'Hey. You wrote this down once. I think you need it today.',
  ack:'That’s my guy. I’m so proud of you.',
  done:{open:['Everything’s done. Come here. I want a long kiss and an evening where we get to finish a conversation.'],
   opts:[{t:'Same again tomorrow. Together.',r:['Together. I like the sound of that every time.']},{t:'I’d like that. Stay with me.',r:['* She takes your hand. “I missed this. Just you and me. Stay close.”']}]}},

 // ---------------- Tyrande, High Priestess of the Moon (Marriage) ----------------
 tyrande:{
  cheers:[
   {open:['You gave your wife your full attention tonight. I waited ten thousand years for that kind of attention. Do not waste it. That kind of attention is difficult to resist. I am not immune.'],
    opts:[{t:'I won’t. Tomorrow too.',r:['Good. Elune sees vows kept. So do I.']},{t:'Ten thousand years is a lot of waiting.',r:['Malfurion napped through most of it. You will not.']}]},
   {open:['A date night. Planned, not improvised. I approve. Even Malfurion learned that eventually. You may find me at the moonwell later. I’ll save you a place.'],
    opts:[{t:'Another one’s already on the calendar.',r:['* A slow, pleased smile. “Now you sound like a husband.”']},{t:'He had a lot of time to learn.',r:['He did. You don’t need ten millennia. Just Thursdays.']}]},
   {open:['You put the phone away and listened to her. Truly listened. That is rarer than moonwells. Now look at me like that. Yes. Exactly like that.'],
    opts:[{t:'I’m keeping it away.',r:['Then she will feel it. Women always do.']},{t:'I only checked it once.',r:['Once. I will allow it. Barely.']}]},
   {open:['A marriage is a vow you keep every night, not once. You kept it tonight. I saw. I have watched enough evenings pass. Tonight, stay a little.'],
    opts:[{t:'Every night. That’s my vow.',r:['* Her silver eyes soften. “Then she is a fortunate woman.”']},{t:'You were watching?',r:['I am a priestess of the moon. I watch everything after dark.']}]}],
  codex:'Read what you wrote. Words spoken under the moon should not be forgotten.',
  ack:'Then it is sworn. Elune heard it as well.',
  done:{open:['The watch is over. Walk beneath the moon with me. I have waited long enough to ask.'],
   opts:[{t:'Tomorrow, the same.',r:['I expected nothing less of you.']},{t:'I’d like that. Stay with me.',r:['* She draws you close and waits for your answer. “Yes? Then let the moon keep our company.”']}]}},

 // ---------------- Padmé, Senator of Naboo (Marriage) ----------------
 padme:{
  cheers:[
   {open:['You told her the truth about your day. Even the hard part. That’s what keeps two people close. It’s very hard to remain diplomatic when you smile like that.'],
    opts:[{t:'No secrets. I’m committed.',r:['* She smiles, a little sad, a little proud. “Then you’re wiser than I was.”']},{t:'The hard part was the dishes.',r:['Honestly? That’s still a hard part. On Naboo too.']}]},
   {open:['A real date. You planned it, you showed up, you paid attention. On Coruscant that would be front-page news. I’d like a dance with you before the evening ends.'],
    opts:[{t:'Next one’s already planned.',r:['Good. Don’t let the calendar decide for you.']},{t:'Do senators get date nights?',r:['Secret ones. On balconies. It’s complicated.']}]},
   {open:['You took a few minutes just for her. No phone, no work. She noticed. I promise she noticed. Now you have my full attention. What will you do with it?'],
    opts:[{t:'Tomorrow too. Every day.',r:['Then she’ll never have to wonder. That’s the gift.']},{t:'It was only ten minutes.',r:['Ten minutes, every day, is a whole life together.']}]},
   {open:['Love needs time and attention or it slips away. You gave it both today. There’s a seat beside me. I’ve been keeping it for you.'],
    opts:[{t:'I’m not letting it slip.',r:['* She touches your arm. “I believe you. Keep proving it.”']},{t:'Is that from a speech?',r:['It might end up in one. You inspired it.']}]}],
  codex:'You wrote this down. Read it again. Some things are worth repeating.',
  ack:'That’s a promise I’d put my name to. And I don’t do that lightly.',
  done:{open:['No more meetings tonight. I want your company, somewhere I can forget to be careful with every word.'],
   opts:[{t:'Same again tomorrow.',r:['I know. That’s why I trust you.']},{t:'I’d like that. Stay with me.',r:['* She leaves her hand in yours. “I’m not hiding this smile. You can take credit for it.”']}]}},

 // ---------------- Yennefer, Sorceress (Marriage) ----------------
 yennefer:{
  cheers:[
   {open:['You actually planned a date night. With a reservation. I’m almost impressed. Almost. Competence is attractive. You’re becoming terribly inconvenient.'],
    opts:[{t:'And I’ll plan the next one.',r:['Good. Half-hearted men bore me. You’re not boring tonight.']},{t:'Almost?',r:['Don’t fish. It’s unattractive. Mostly.']}]},
   {open:['You listened to her without fixing anything. Do you know how rare that is? Geralt took decades. Now apply that attention here. I dislike repeating invitations.'],
    opts:[{t:'I’m going to keep listening.',r:['* A lilac-scented smirk. “See that you do.”']},{t:'I wanted to fix it a little.',r:['Of course you did. You held back. That’s the point.']}]},
   {open:['A note for your wife. Handwritten. Sentimental. I hate how much I like that. You do understand I’m looking at you, not the stationery?'],
    opts:[{t:'There’ll be more.',r:['Then she’s luckier than most. Don’t make me regret saying it.']},{t:'You hate it?',r:['Passionately. Write another one.']}]},
   {open:['Love isn’t a destiny. It’s a choice, every day, out loud. You chose today. I’ve made time for you tonight. Don’t make me waste it.'],
    opts:[{t:'I choose it tomorrow too.',r:['Good answer. The only answer, in fact.']},{t:'Was that sincere? From you?',r:['Tell anyone and I’ll turn you into a toad.']}]}],
  codex:'You wrote this. Read it and stop looking so surprised you were right.',
  ack:'Finally. Commitment suits you. Don’t ruin it.',
  done:{open:['You’re finished? Good. I’ve spent all evening wanting to kiss you. Set that down.'],
   opts:[{t:'Save it. I’ll do it all again tomorrow.',r:['We’ll see. I have a long memory.']},{t:'I’d like that. Stay with me.',r:['* She takes your offered hand. “I want you to myself tonight. Is that sufficiently clear?”']}]}},

 // ---------------- Briget, Rose Princess (Marriage) ----------------
 briget:{
  cheers:[
   {open:['Flowers for your wife! On a Tuesday! For no reason! Oh, I could kiss you. I won’t. I could. I’ve been picturing a dance with you. Rather vividly.'],
    opts:[{t:'There’ll be flowers next week too.',r:['A man with a standing flower order. Be still, my heart.']},{t:'It was a grocery store bouquet.',r:['Darling, it’s the gesture. Roses don’t care where they came from.']}]},
   {open:['You danced with her in the kitchen. Don’t deny it, I have spies. The spies are me. Save the next dance for me. I want the slow one.'],
    opts:[{t:'I’m doing it again.',r:['* She twirls once, delighted. “Every week. That’s an order.”']},{t:'I stepped on her feet.',r:['Charming. That’s how you know it was a real dance.']}]},
   {open:['Date night done. Was there candlelight? Tell me there was candlelight. I arranged two places. You can probably guess why.'],
    opts:[{t:'Next time, candles. I promise.',r:['Good. Romance needs a little ceremony. I’ll lend you mine.']},{t:'There was a pizza box.',r:['A pizza box can be very romantic. In the right light.']}]},
   {open:['A little letter for her, just because. That’s my favorite kind of letter. You make it terribly difficult to behave with royal dignity.'],
    opts:[{t:'I’ll write another next week.',r:['Make it a habit and she’ll fall in love all over again.']},{t:'It was three sentences.',r:['Three perfect sentences. Shakespeare used more and meant less.']}]}],
  codex:'Ooh, a note in your hand. Read it to me, slowly, like a proclamation.',
  ack:'Signed and sealed. I’m having it framed. Metaphorically.',
  done:{open:['Enough ceremony. Come dance with me. I want you close, and I’m done inventing reasons.'],
   opts:[{t:'Again tomorrow. Bring the fanfare.',r:['Oh, I’ll bring a whole orchestra.']},{t:'I’d like that. Stay with me.',r:['* She rests her hands on your shoulders. “Kiss me again. We can let the orchestra finish without us.”']}]}},

 // ---------------- Kitai, Marat Warrior (Marriage) ----------------
 kitai:{
  cheers:[
   {open:['Aleran. You took your mate somewhere nice. On purpose. I thought your kind forgot how. Now look at me, Aleran. I am also asking for your attention.'],
    opts:[{t:'Not forgetting. Next week too.',r:['Good. Tavi forgets. I remind him. Loudly.']},{t:'We did go somewhere nice.',r:['I know. I followed you. You walk like a gargant.']}]},
   {open:['You put away your little glowing rock and talked to her. Finally. She was waiting. I like a man who means what he says. Especially when he says my name.'],
    opts:[{t:'It stays away. I mean it.',r:['* She grins, all teeth. “We will see, Aleran.”']},{t:'My phone isn’t a rock.',r:['It is a rock that steals husbands. I would smash it.']}]},
   {open:['You helped her without being asked. Among my people that is how you show love. Also hunting. Come walk with me. I want you near enough to hear me without shouting.'],
    opts:[{t:'I’m doing it every day.',r:['Then you are almost Marat. Almost.']},{t:'Should I go hunting too?',r:['You would scare off everything. Do the dishes.']}]},
   {open:['You are not as hopeless as I thought. Your wife is lucky. Tell her I said that. You have my attention. Do something interesting with it.'],
    opts:[{t:'Tomorrow I’ll be even better.',r:['A challenge? Good. I will be watching.']},{t:'That was a compliment?',r:['From me, the best you will get. Treasure it.']}]}],
  codex:'You scratched this into your little book. Read it, Aleran.',
  ack:'Hm. Good. Now do it. Talking is for Alerans.',
  done:{open:['Work is finished. Come here, Aleran. I have missed you, and I intend to do something about it.'],
   opts:[{t:'Same tomorrow. Try and stop me.',r:['I will try. That is the fun part.']},{t:'I’d like that. Stay with me.',r:['* She holds out her hand. “A kiss, if you want one. Then a walk. Then we see how long you can make me laugh.”']}]}},

 // ---------------- Victra, The Julii Heiress (Marriage) ----------------
 victra:{
  cheers:[
   {open:['You took your wife out. Flowers, real table, your full attention. Good. A man who courts what he already has. I do admire a man who follows through. Up close, preferably.'],
    opts:[{t:'And I’ll keep courting her.',r:['That’s the right answer. Sevro would be jealous. Of me, for spotting you.']},{t:'It was mostly her idea.',r:['And you said yes like you meant it. That counts.']}]},
   {open:['You told her she was beautiful. Out loud. Without being prompted. Most men are cowards about that. Now say something bold to me. I want to hear your voice change.'],
    opts:[{t:'I’ll tell her every day.',r:['* A wicked smile. “Then you’re not most men. Lucky her.”']},{t:'She already knows.',r:['Knowing and hearing are different things, darling.']}]},
   {open:['Put the phone down and had dinner like a person. Good. I was about to throw it in the lake. I like your attention on the person in front of you. Especially when that’s me.'],
    opts:[{t:'It stays down at dinner now.',r:['Excellent. I’ll only threaten you once a week.']},{t:'Please don’t throw my phone.',r:['Then don’t give me reasons. Simple.']}]},
   {open:['I judge every husband in this village. You’re climbing the list. Don’t get smug. Keep looking at me like that. I enjoy a little nerve.'],
    opts:[{t:'Top of the list. Watch me.',r:['Oh, I’m watching. I’m always watching.']},{t:'Who’s at the top?',r:['Sevro. Loudly. Embarrassingly. Then you, maybe.']}]}],
  codex:'Read what you wrote. Then do it. I hate men who only talk.',
  ack:'Good. Loyalty looks good on you.',
  done:{open:['Come here, darling. I’ve been well behaved all day, and I’m tired of it. You have time for a very long kiss?'],
   opts:[{t:'Same again tomorrow.',r:['I’ll have the drink waiting. For both of you.']},{t:'I’d like that. Stay with me.',r:['* She smiles slowly. “Good. I have plans for this evening. They start with you sitting beside me.”']}]}},

 // ---------------- Vin, Mistborn (Fatherhood) ----------------
 vin:{
  cheers:[
   {open:['You were home for bedtime. Read the book. Did the voices. Nobody did that for me. They’re lucky. Stay a while afterward. I like knowing you’re close.'],
    opts:[{t:'I’ll be there tomorrow night too.',r:['* She looks away fast. “Good. That matters more than you think.”']},{t:'I’m bad at the voices.',r:['They don’t care. They care that it’s you doing them.']}]},
   {open:['You played with them. Actually played, on the floor. Kelsier would’ve called that a crew-building exercise. I was hoping you’d save a little time for me, too.'],
    opts:[{t:'I’m showing up every day.',r:['That’s it. That’s the whole thing. Keep doing it.']},{t:'My knees disagree.',r:['Burn some pewter. Oh, right. Just stretch, then.']}]},
   {open:['You listened when they talked. Even the boring stuff about some game. Kids notice who listens. You can listen to me now. I’ve been wanting to ask you somewhere.'],
    opts:[{t:'I’m always going to listen.',r:['They’ll remember that. I remember who didn’t.']},{t:'It really was boring.',r:['Ha. Yeah. Listen anyway. You did.']}]},
   {open:['I grew up not trusting anyone. Your kids won’t. Because of days like today. I don’t say this easily. I want you here.'],
    opts:[{t:'Not on my watch.',r:['* A rare smile. “No. Not on yours.”']},{t:'That’s a heavy thing to say.',r:['I don’t do small talk. You know that.']}]}],
  codex:'You wrote something down. Read it. Then go hug them.',
  ack:'Good. Keep your word to them. That’s everything.',
  done:{open:['The rooftops are quiet. Come up with me. I’m asking because I want you there.'],
   opts:[{t:'Same again tomorrow.',r:['I know. You’re not the leaving kind.']},{t:'I’d like that. Stay with me.',r:['* She holds your hand firmly. “I’m not looking for an exit tonight. I want to stay.”']}]}},

 // ---------------- Hera, Captain of the Ghost (Fatherhood) ----------------
 hera:{
  cheers:[
   {open:['Dinner at the table with the kids. Everyone fed, everyone talking. That’s how you keep a crew together. When the crew settles, come find your captain.'],
    opts:[{t:'Every night I can. Count me in.',r:['That’s what I like to hear. Steady hands on the controls.']},{t:'Somebody spilled milk.',r:['Somebody always spills something. Zeb spilled a lot worse.']}]},
   {open:['You made time for each kid, one at a time. That’s good flying. Nobody gets left on the ramp. I saved the co-pilot’s seat. I’d rather look over and find you in it.'],
    opts:[{t:'Nobody gets left behind.',r:['* She grins. “Now you sound like a captain.”']},{t:'I’m running low on fuel.',r:['Then refuel and go again. That’s the job, love.']}]},
   {open:['You stayed patient when they melted down. I know that took everything you had. Let someone take care of you for a change. I’m volunteering.'],
    opts:[{t:'I’ll stay patient tomorrow too.',r:['I believe you. Jacen would’ve liked you.']},{t:'I counted to ten. Twice.',r:['Twice is fine. I’ve counted to fifty on the Ghost.']}]},
   {open:['Bedtime handled, story read, lights out. Smooth landing. Good landing. Now come keep me company on the ramp.'],
    opts:[{t:'Same landing tomorrow.',r:['Copy that. Ghost’s proud to have you aboard.']},{t:'Smooth-ish.',r:['Any landing you walk away from counts.']}]}],
  codex:'You logged this once. Good pilots read their own logs.',
  ack:'Course locked in. I’m proud of you.',
  done:{open:['Crew’s settled. Ship’s quiet. I’d like you beside me for the part of the night that’s ours.'],
   opts:[{t:'Ready to fly again tomorrow.',r:['That’s my favorite answer. Get some sleep first.']},{t:'I’d like that. Stay with me.',r:['* She brushes your hand with hers. “Stay, love. I’m asking as Hera. No captain’s orders.”']}]}},

// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
 liko:{
  cheers:[
   {open:['You played with the kids today. They were still talking about it at dinner. I was hoping you’d save a little time for me afterward.'],
    opts:[{t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},{t:'I’d like some time with you tonight.',r:['Come walk with me afterward. I’ve been looking forward to it.']}]},
   {open:['You read the bedtime story all the way through. I like hearing you do the voices. Come tell me a story of your own later.'],
    opts:[{t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},{t:'I’d like some time with you tonight.',r:['Come walk with me afterward. I’ve been looking forward to it.']}]},
   {open:['You listened instead of rushing them. I noticed. I’d like to hear about your day with the same attention.'],
    opts:[{t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},{t:'I’d like some time with you tonight.',r:['Come walk with me afterward. I’ve been looking forward to it.']}]},
   {open:['You took them outside. I found a new trail you might enjoy together. There’s also a quieter one I’d like to walk with you.'],
    opts:[{t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},{t:'I’d like some time with you tonight.',r:['Come walk with me afterward. I’ve been looking forward to it.']}]}],
  codex:'Um, you wrote this before. I think it’s really good. Read it?',
  ack:'Yeah! That’s the stuff. You’re like a real hero.',
  done:{open:['All finished? I booked a table by the harbor. I’d like to take you out, if you’re free.'],
   opts:[{t:'Again tomorrow!',r:['Okay! I’ll be cheering. Really loud.']},{t:'I’d like that. Stay with me.',r:['* She takes your hand with a quiet smile. “I wanted this to be a date. I’m glad you did too.”']}]}},

 // ---------------- Wanda, Scarlet Witch (Fatherhood) ----------------
 wanda:{
  cheers:[
   {open:['You tucked them in tonight. That’s all I ever wanted. Don’t you dare take it for granted. When the house settles, I’d like a little time that belongs to us.'],
    opts:[{t:'I won’t. Every night I can.',r:['* Her eyes shine a little. “Good. Go kiss them goodnight again.”']},{t:'They wanted three glasses of water.',r:['Of course they did. Billy wanted four.']}]},
   {open:['You played with them. No magic, no screens, just you. That’s better than anything I could make. I keep thinking about our last dance. The part when you stayed close.'],
    opts:[{t:'Just me. Tomorrow too.',r:['That’s exactly right. Just you.']},{t:'I could use a little magic.',r:['Coffee. That’s my magic most mornings.']}]},
   {open:['You said yes to the silly game. Even though you were tired. I saw. You have no idea how much I like that smile. Or perhaps you do.'],
    opts:[{t:'I’ll keep saying yes.',r:['They’ll remember the yeses. I promise you that.']},{t:'I said yes to five silly games.',r:['* She laughs. “And you survived. Barely.”']}]},
   {open:['An evening with your kids. Nothing anyone can conjure is worth more than that. Tonight I’d like to be someone you come looking for.'],
    opts:[{t:'I know. I’m not missing it.',r:['Then you’re richer than any witch.']},{t:'Not even paprikash?',r:['Okay. Paprikash comes close. Second place.']}]}],
  codex:'You wrote this. Read it. Hold it close, like they’re asleep on your chest.',
  ack:'Good. Keep that promise. It’s the realest thing there is.',
  done:{open:['All done. I kept replaying our last dance while I did the dishes. Come give me something new to remember.'],
   opts:[{t:'Same again tomorrow.',r:['I know. Go check on them first.']},{t:'I’d like that. Stay with me.',r:['* She puts on a record. “Just us tonight. I’ve been looking forward to that more than I meant to.”']}]}},

 // ---------------- Jean, Phoenix (Fatherhood) ----------------
 jean:{
  cheers:[
   {open:['You told your kid exactly what you love about them. Out loud. They’ll carry that for years. And now you’re thinking about me. You could just say hello.'],
    opts:[{t:'I’ll tell them again tomorrow.',r:['Good. Kids need to hear it more than once. So do grown-ups.']},{t:'They rolled their eyes.',r:['And smiled after. I felt it from here.']}]},
   {open:['You helped with homework and didn’t lose your patience. I’ve run a school. That’s heroic. I’ve been trying to concentrate. Your smile hasn’t helped.'],
    opts:[{t:'Patience every time. I’m in.',r:['* She smiles. “I believe you. You’re thinking it loudly.”']},{t:'I lost a little patience.',r:['A little. Then you found it again. That counts.']}]},
   {open:['You noticed something small about them today. That’s how kids know they’re seen. I noticed something about you, too. Ask me when we’re alone.'],
    opts:[{t:'I’ll keep noticing.',r:['That’s the most important thing a teacher learns. Or a dad.']},{t:'Are you reading my mind?',r:['Only a little. You’re projecting. It’s sweet.']}]},
   {open:['Bedtime done, story read, lights off. Somewhere a kid just fell asleep feeling safe. Come sit with me. I’d rather hear you say what’s on your mind.'],
    opts:[{t:'Every night I can.',r:['Then they’ll grow up brave. I’ve seen it happen.']},{t:'Somewhere one is still awake.',r:['Ha. Okay, almost asleep. Close enough.']}]}],
  codex:'You wrote this down. I can feel you meant it. Read it again.',
  ack:'There. Now I can hear it in your head too. Loud and clear.',
  done:{open:['You’re finished. Good. I was trying not to think about kissing you while you worked. It wasn’t going well.'],
   opts:[{t:'Again tomorrow. I mean it.',r:['I know you do. I can tell.']},{t:'I’d like that. Stay with me.',r:['* She sets her book aside. “Come here. I’d much rather hear what you want than guess.”']}]}},

 // ---------------- Kira, Blade Dancer (Fitness) ----------------
 kira:{
  cheers:[
   {open:['Workout done? Look at you, sweaty and smug. I trained you well. Okay, you trained you. I watched. I tried to keep my eyes on your form. I got distracted.'],
    opts:[{t:'Again tomorrow. Bring the saber.',r:['Oh, I’ll bring both ends. Don’t drop your guard.']},{t:'You definitely just watched.',r:['Watching is a skill. I’m very good at it. Ask anyone.']}]},
   {open:['You actually went for that run. In the cold. You’re either dedicated or a little unhinged. I like both. Keep smiling at me like that and dinner’s going to turn into a date.'],
    opts:[{t:'Dedicated. I’m going tomorrow too.',r:['* She grins. “Unhinged it is. Can I come?”']},{t:'Mostly unhinged.',r:['The best Jedi are. Don’t tell the Council.']}]},
   {open:['Push-ups done. You kept your form. I was ready to make fun of you and you ruined it. You’ve still got energy? Good. I was hoping you’d walk me home.'],
    opts:[{t:'Get used to it.',r:['Ugh. Fine. I’ll find something else to tease.']},{t:'My arms are noodles.',r:['Noodle arms that did the reps. Respect.']}]},
   {open:['I outran my past one session at a time. You’re doing the same thing. Just with less Sith. I’m looking forward to seeing you tonight. Yes, you specifically.'],
    opts:[{t:'One more session tomorrow.',r:['That’s the spirit. See you at the fence.']},{t:'Much less Sith, hopefully.',r:['Zero Sith. Strict policy. I checked.']}]}],
  codex:'You wrote this. Read it. Then stop stalling and stretch.',
  ack:'Good. Now I believe you. Mostly.',
  done:{open:['Done already? Great. I’ve got dinner plans, and they involve you sitting very close to me.'],
   opts:[{t:'Tomorrow too. And I’m winning.',r:['Big talk. I love big talk. Back it up.']},{t:'I’d like that. Stay with me.',r:['* She catches your hand, grinning. “Stay. I like you, and I’m done making you guess.”']}]}},

 // ---------------- Fannie, Explorer (Fitness) ----------------
 fannie:{
  cheers:[
   {open:['You ran! I’m adding your route to my map. It’s getting so big! Okay, I’m drawing a little flag on it. I saved the sunset trail for us. There’s a reason I picked the quiet one.'],
    opts:[{t:'Add another flag tomorrow.',r:['Yes! New trail, new flag. We’re gonna fill the whole map.']},{t:'Make the flag rainbow.',r:['Obviously rainbow. Matches my goggles.']}]},
   {open:['Workout done and your cheeks are all pink! That’s the best look. Trust me, I’m an expert. I’m enjoying the view from here. Yes, I mean you.'],
    opts:[{t:'I’m out there again tomorrow.',r:['* She bounces on her toes. “Can I come? Please say yes.”']},{t:'It’s mostly windburn.',r:['Windburn means you went somewhere! Counts double.']}]},
   {open:['You went for a walk! Did you see anything cool? Birds? Weird rocks? A suspicious duck? Next time, take me. I’d like an excuse to hold your hand.'],
    opts:[{t:'I’ll go looking again tomorrow.',r:['Report every duck. I mean it.']},{t:'There was a suspicious duck.',r:['I KNEW it. They’re everywhere this season.']}]},
   {open:['Every run makes the world a little bigger. And your mood a little better. I’ve done the science! I like the way your face lights up when you see me coming.'],
    opts:[{t:'Then I’m running every day.',r:['Yes! Best mood in the whole village. Watch out.']},{t:'Was there actual science?',r:['There was a chart. With stickers. Science.']}]}],
  codex:'You wrote this on the trail once! Read it, explorer.',
  ack:'Woo! That one’s going on the map in big letters.',
  done:{open:['Everything done? Meet me at the ridge. I brought a blanket and very specific hopes about the company.'],
   opts:[{t:'More tomorrow. Let’s go.',r:['Let’s go! Boots by the door!']},{t:'I’d like that. Stay with me.',r:['* She puts her map away. “For once I know exactly where I want to be. Right here with you.”']}]}},

 // ---------------- Rey, Scavenger Jedi (Fitness) ----------------
 rey:{
  cheers:[
   {open:['You lifted today. Good. On Jakku I hauled scrap all day just to eat. You’re doing it for fun. Mostly fun. You’ve got my attention. And it isn’t just the lifting.'],
    opts:[{t:'Again tomorrow. Heavier.',r:['Heavier. I like that. You’d have done well on Jakku.']},{t:'Mostly not fun.',r:['Ha. Try carrying a hull plate in a sandstorm.']}]},
   {open:['You ran. In the heat? You’re tougher than you look. And you look pretty tough. Come sit beside me when you catch your breath. I saved you room.'],
    opts:[{t:'Tomorrow too. Same pace.',r:['* She grins. “I’ll keep up. Probably pass you.”']},{t:'Was that a compliment?',r:['It was. Don’t make it weird.']}]},
   {open:['A long walk with a heavy pack. That’s my whole childhood. It’s strange seeing someone choose it. I like sharing the walk with you more than reaching the top.'],
    opts:[{t:'I’m choosing it every day.',r:['Then you’ll get strong the honest way. A thousand ordinary days.']},{t:'My pack was groceries.',r:['Groceries count. Ever haul a sack of salvage for one portion of bread?']}]},
   {open:['You stretched afterward. Good. I didn’t, for years. My back still remembers. I was hoping you’d stay afterward. No drills, just us.'],
    opts:[{t:'I’ll keep stretching.',r:['Smart. Smarter than I was.']},{t:'Your back seems fine.',r:['You’re staring at my back? Hm. Fair.']}]}],
  codex:'You scratched this down somewhere. Read it. Then go lift something.',
  ack:'Good. Words are light. Carry them anyway.',
  done:{open:['Training’s done. I’ve made supper for two. I’d rather you stayed than found somewhere else to be.'],
   opts:[{t:'Same again tomorrow.',r:['I know. You don’t quit. Neither do I.']},{t:'I’d like that. Stay with me.',r:['* She takes your hand and holds it. “I want this. I don’t have to wait for someone to tell me that.”']}]}},

// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
 nemona:{
  cheers:[
   {open:['Workout finished. I kept the training chart, yes, I laminated it. Now I’d rather hear what you’re doing tonight.'],
    opts:[{t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},{t:'I’d like some time with you tonight.',r:['Dinner. Just us. I’m not leaving that invitation to chance.']}]},
   {open:['You went for a run without me. I’ll forgive that if you join me for dinner. I’ve been wanting to ask.'],
    opts:[{t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},{t:'I’d like some time with you tonight.',r:['Dinner. Just us. I’m not leaving that invitation to chance.']}]},
   {open:['More push-ups than yesterday. I noticed your form. Then I got distracted by the grin afterward.'],
    opts:[{t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},{t:'I’d like some time with you tonight.',r:['Dinner. Just us. I’m not leaving that invitation to chance.']}]},
   {open:['You stretched and trained. Good. I like knowing you’ll look after yourself. I’d like your company for a long time.'],
    opts:[{t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},{t:'I’d like some time with you tonight.',r:['Dinner. Just us. I’m not leaving that invitation to chance.']}]}],
  codex:'You wrote this down! It’s like a strategy guide! Read it!',
  ack:'Locked in! Now let’s battle!',
  done:{open:['Everything finished? Good. No training tonight. I want a date, and I want it with you.'],
   opts:[{t:'Going for another tomorrow!',r:['Two badges! The collection begins!']},{t:'I’d like that. Stay with me.',r:['* She takes your hand, her grin softening. “I like you. I’m competitive, not subtle.”']}]}},

 // ---------------- Karlach, Tiefling Barbarian (Fitness) ----------------
 karlach:{
  cheers:[
   {open:['WORKOUT DONE! Soldier, that’s what I like to see! Come here, high five. Careful, my hands are toasty. You look good, soldier. I’m allowed to say it. You look really good.'],
    opts:[{t:'Same time tomorrow, soldier.',r:['Hell yeah! I’ll bring the heavy stuff!']},{t:'How toasty are we talking?',r:['Eh, mild burns. Builds character.']}]},
   {open:['You went for a run? Oh, I love that. I spent ten years running from devils. Yours is way more fun. I’ve been waiting to get my arms around you all afternoon.'],
    opts:[{t:'I’m running again tomorrow.',r:['* She thumps your back. Hard. “That’s my soldier!”']},{t:'I ran from a dog once.',r:['Ha! Did you win? You won. I believe in you.']}]},
   {open:['Lifting heavy things is basically a party. You just had a party. I’m so proud. Want to celebrate over dinner? I’m asking. Properly. It’s a date.'],
    opts:[{t:'Party again tomorrow.',r:['YES! I’ll bring snacks! Lots of snacks!']},{t:'A sweaty party.',r:['Best kind! The engine likes it too.']}]},
   {open:['Hear that? My engine’s purring. Seeing you train does that. Don’t think too hard about it. Come closer. I like this part where neither of us has to hurry away.'],
    opts:[{t:'I’ll keep the engine purring.',r:['Oh, you’d better. I’m counting on it, soldier.']},{t:'Is that safe?',r:['Absolutely not! Totally worth it!']}]}],
  codex:'Soldier! You wrote this down! Read it out loud. Louder!',
  ack:'That’s it! Now go break something. Not literally. Okay, a little.',
  done:{open:['Finally! Come here, soldier. I’ve been thinking about that kiss since breakfast.'],
   opts:[{t:'And tomorrow I do it all again.',r:['That’s the spirit! Best soldier in the whole camp!']},{t:'I’d like that. Stay with me.',r:['* She laughs softly. “Yeah? Good. Because I’d really like another. A long one.”']}]}},

 // ---------------- Shallan, Scholar & Artist (Work) ----------------
 shallan:{
  cheers:[
   {open:['You did your deep work block. No distractions. I tried that once. I drew seventeen chulls instead. I drew you instead of finishing my own work. You’re a terrible influence.'],
    opts:[{t:'Another block tomorrow.',r:['Good. I’ll sketch you working. Very serious face. Very handsome.']},{t:'Seventeen?',r:['They were very good chulls. Pattern liked them.']}]},
   {open:['You finished the thing you’d been putting off. I know that feeling. It’s like taking off a mask you hated. I like that look on your face. Hold it. No, come closer instead.'],
    opts:[{t:'No more putting things off.',r:['* She hugs her sketchbook. “I believe you. Mostly. Pattern believes you more.”']},{t:'I procrastinated first.',r:['Of course you did. Everyone does. Then you did it. That’s the part that counts.']}]},
   {open:['You looked at the money. Budget and all. Numbers are just very unromantic sketches, really. There’s a page in my sketchbook I’d like to show you. Privately.'],
    opts:[{t:'I’m staying on top of it.',r:['Look at you. Responsible. It’s weirdly attractive.']},{t:'Unromantic is right.',r:['I could draw little hearts in the margins. Helps me.']}]},
   {open:['Pattern says you were very focused today. He hummed about it. He hums when he approves. Mmm. Pattern noticed me staring. I told him to develop some discretion.'],
    opts:[{t:'Tell him tomorrow too.',r:['He’s already humming. Ugh. You two are insufferable.']},{t:'Does he hum at you?',r:['Constantly. Mostly when I lie. So, constantly.']}]}],
  codex:'You wrote this down. I’d have drawn it, but your words are better. Read it.',
  ack:'Good. That’s the real you talking. I can tell.',
  done:{open:['Work’s finished. Come sit for me. I mean with me. Both, actually. I’ve been looking forward to both.'],
   opts:[{t:'Again tomorrow. Draw me then too.',r:['I’ll need a bigger sketchbook.']},{t:'I’d like that. Stay with me.',r:['* She shuts the sketchbook. “I’d rather remember this without a drawing. Kiss me again?”']}]}},
};
