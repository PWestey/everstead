// Third-wave moments: Fellows Dalinar, Ragnar and Sevro (level every 5th level, star 1..5) and
// Family Virginia and Victra (visits and gifts). See docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{level:any[],star:any[]}>} */
export const FELLOW_MOMENTS={
 // ---------------- Dalinar (Discipline) ----------------
 dalinar:{
  level:[
   {open:['* Dalinar sits at a Library table, a single page open in front of him. He is reading it slowly, finger under each word.','You put the screen away at the hour you said you would. I noticed.'],opts:[
    {t:'It was harder than it sounds.',r:['It always is. The Thrill never asks loudly. It asks often. You answer it the same way, every time, until it tires of asking.']},
    {t:'You noticed that?',r:['I notice every small surrender, {name}. Mine and other men’s. I have learned to notice the small victories too.']}]},
   {open:['When I was young, I thought strength was what you did on the battlefield.','Now I think it is what you do at the end of a long day, when nobody would blame you for quitting.']},
   {open:['* He slides a worn notebook across the table. Each page holds one line, written in a careful, heavy hand.','Every morning I write one thing I will not do today. Every night I check it.'],opts:[
    {t:'What did you write today?',r:['* He turns the page so you can see it. One word: Wait.','I am impatient with men who are slow to change. I forget how slow I was.']},
    {t:'Only one thing?',r:['One kept promise is worth more than ten good intentions. Start with one. Add another when the first stops costing you.']}]},
   {open:['* You find him in the training courtyard before dawn, running forms with a practice sword, sweat already on his brow.','A man does not become better once. He becomes better this morning. Then again tomorrow. Join me.']}],
  star:[
   {open:['* He studies the star for a long moment, then closes his big hand around it.','I have worn the crowns of princes. None of them weighed this much.']},
   {open:['There was a version of me who would have despised you, {name}. Who would have called your routines weakness.','He was wrong. I buried him. Some days I still have to check the grave.'],opts:[
    {t:'How do you keep him buried?',r:['By doing the next right thing. Then the next. He cannot climb out while my hands are busy with the work.']},
    {t:'I have one of those too.',r:['Every man worth knowing does. The question is not whether he exists. It is whether he gets the morning.']}]},
   {open:['* He sets two cups of tea on the table and pushes one toward you.','I used to drink to forget. Now I drink tea, and remember. It is less exciting. I sleep far better.'],opts:[
    {t:'To remembering.',r:['* He touches his cup to yours, solemn as a vow.','To remembering. And to the men who would not let us forget.']},
    {t:'Does it get easier?',r:['No. You get stronger. From the inside, that feels the same.']}]},
   {open:['* Dalinar watches you finish your evening routine without a word. Then he nods once, a general to a soldier.','You did not need me to tell you to do that. That is the moment discipline becomes character.']},
   {open:['* In the Library at night, he lays a sword across the table between you, hilt toward your hand.','In my homeland, a man gave his Shardblade only to someone he trusted with his life. I am giving you my word instead. It is worth more now than it once was.','You are my brother, {name}. The kind I chose.'],opts:[
    {t:'Take his hand.',r:['* His grip is iron. He doesn’t let go quickly.','Unite them, my brother. Your habits, your house, your heart. I will stand beside you while you do.']},
    {t:'I don’t deserve that.',r:['Neither did I, when someone first offered it. That is what makes it a gift. Take my hand and stop arguing with a highprince.']}]}]},

 // ---------------- Ragnar (Home) ----------------
 ragnar:{
  level:[
   {open:['* Ragnar sits on an overturned crate in the Workshop, a tiny paintbrush lost in his enormous hand, touching up a windowsill.','The house told me you fixed the hinge on its back door. It sings less now. It is grateful.'],opts:[
    {t:'Houses can be grateful?',r:['Everything that is cared for is grateful, little brother. Watch how it holds you when the wind comes.']},
    {t:'It took me three tries.',r:['Then the door got three visits from you. That is not failure. That is courtship.']}]},
   {open:['Where I was born there were no homes. Only ice, and the gods who lied to us.','Now I know a home is a thing you build with small hands, every day. Even very large small hands.']},
   {open:['* He holds up a carved wooden bowl, still rough at the edges.','I am making one for each person in your house. So every one of them knows they have a place at the table.'],opts:[
    {t:'That’s beautiful, Ragnar.',r:['* He looks embarrassed, which on a man his size is like watching a mountain blush.','It is only wood. And time. The time is the gift.']},
    {t:'Teach me to carve.',r:['* He hands you a knife and the smallest block of wood you have ever seen in his palm.','Slowly. With the grain. Like tending a family.']}]},
   {open:['* You sweep the Workshop floor together at sunset, his broom strokes three times the length of yours.','A warrior guards the gate. A father guards the hearth. You did both this week. I saw.']}],
  star:[
   {open:['* He holds the star up to the light, his eyes shining.','My mother said the stars were the fires of every home in the sky. Now I have one of yours.']},
   {open:['* Ragnar stands in your doorway, head bowed so he fits, looking at the clean floor and folded blankets.','You do this for them. Not for praise. I know because nobody praises this. Let me be the first.'],opts:[
    {t:'It’s just chores.',r:['Chores are love with its sleeves rolled up. Do not shrink it, brother. I will not let you.']},
    {t:'Thank you, Ragnar.',r:['* He puts a hand on your head, the way you would with a child, then remembers himself and laughs.','Forgive me. On Obsidian ice, that means I am proud of you.']}]},
   {open:['I have killed many enemies. I am not proud of it, but I am not ashamed either. They came for my people.','What I am proud of is the roof I patched for my sister. It still does not leak.'],opts:[
    {t:'A roof is a kind of shield.',r:['* He looks at you a long time.','Yes. You understand. A poet, hiding in a busy man.']},
    {t:'What was your sister like?',r:['Fierce. Funny. She called me a mountain with a soft middle. She was right about the middle.']}]},
   {open:['* Ragnar hums a low northern song while he fixes a chair leg, and teaches you the words, one at a time.','We sing while we work so the work remembers it was done with joy.']},
   {open:['* At dusk he lays a heavy fur cloak over your shoulders, still warm from the Workshop fire.','Among my people, this is given to the one who keeps the hearth. The one who stays.','You are my brother of the hearth, {name}. Your house is my house. Anyone who threatens it meets me first.'],opts:[
    {t:'Wear it proudly.',r:['* He grins, wide and wild, and claps both your shoulders hard enough to rattle you.','Good! Now you look like a man who could carry a sofa up a mountain. Come. The gutters need us.']},
    {t:'You’re already part of my house.',r:['* His great chest heaves once. He looks away, toward the hills.','You will make an old giant weep in front of the whole village. Fine. Let them see.']}]}]},

 // ---------------- Sevro (Fatherhood) ----------------
 sevro:{
  level:[
   {open:['* Sevro drops out of a tree outside the Hearth Inn and lands in a crouch, wolfcloak flapping.','Heard you did bedtime stories tonight. Voices and everything. You absolute gorydamn legend.'],opts:[
    {t:'I did the dragon voice.',r:['The dragon voice! Ha! Kids remember the dragon voice forever. Electra still asks for my dying-goblin noise. Fifteen times a night.']},
    {t:'How do you know that?',r:['I’m a Howler. We know things. Also your kid told me. Loudly. Kid’s a terrible spy. I love that kid.']}]},
   {open:['Used to think being a dad meant being a hero. Big speeches. Big swords.','Turns out it’s mostly snacks. And showing up. Showing up is the whole bloodydamn trick.']},
   {open:['* Sevro is sprawled on the Inn floor with a pile of wooden toys, building a terrible little fortress.','Get down here. Kids are watching. If you build on the floor, you’re a dad. If you watch from the chair, you’re furniture.'],opts:[
    {t:'Get on the floor.',r:['* He hands you a block with great ceremony.','Welcome to the pack, chief engineer. The east wall is weak. Like Darrow’s jokes.']},
    {t:'My knees disagree.',r:['Your knees are cowards. Ignore them. Electra climbs me like a cliff every morning and I’m only mostly broken.']}]},
   {open:['* He flicks a pebble at your boot, grinning.','You put the phone away at dinner. Saw it. Proud of you, you sentimental slagger. Don’t make me say it twice.']}],
  star:[
   {open:['* Sevro bites the star like a coin, then tucks it into his cloak.','Real. Shiny. Mine now. Don’t tell Darrow, he gets jealous of my loot.']},
   {open:['My dad wasn’t there. Not really. Not when it counted.','So I decided I’d be there so hard it makes up for it. Every scraped knee. Every bad dream. Every gorydamn tea party.'],opts:[
    {t:'You’re a great dad, Sevro.',r:['* He looks away fast and rubs his nose.','Shut up. Pollen. There’s pollen. Anyway, so are you. Shut up about that too.']},
    {t:'Tea parties?',r:['Pinky out, crown on, best manners in the bloodydamn worlds. Electra runs a tight ship. I’d die for that tea party.']}]},
   {open:['* He hops onto the bar of the Hearth Inn and sits cross-legged, suddenly serious.','Real talk. Some nights you’ll be tired and short with them. You’ll feel like garbage.','Fix it before bed. Say sorry. Kids don’t need a perfect dad. They need one who comes back.'],opts:[
    {t:'I’ve had nights like that.',r:['Course you have. Me too. Last week I yelled about a spilled cup. Then I spilled mine on purpose so she’d laugh. Repair, chief.']},
    {t:'That’s wise, for you.',r:['I contain multitudes. Mostly snacks and crimes. But some wisdom, yeah.']}]},
   {open:['* Sevro sneaks up behind you and drapes a ragged wolf pelt over your head.','Trying it on for size. Not saying anything. Just measuring.']},
   {open:['* At the Inn, Sevro gathers every Howler-looking misfit in the village around the fire, then howls at the moon until they all join in.','Okay. Shut it, everyone. This is a ceremony. Look serious.','* He throws a wolfcloak over your shoulders, gruff and clumsy.','You’re a Howler now, {name}. Pack for life. Anybody messes with your kids, they answer to all of us.'],opts:[
    {t:'Howl with them.',r:['* You howl. It is terrible. The whole Inn cheers anyway.','That’s it! That’s the worst howl I’ve ever heard. Perfect. You’re family, brother.']},
    {t:'I’m honored, Sevro.',r:['* He pulls you into a hug that is mostly headlock.','Yeah, yeah. Don’t get soppy. Electra already calls you uncle. I didn’t teach her that. I totally taught her that.']}]}]},
};

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Virginia (Work) ----------------
 virginia:{
  visit:[
   {open:['* Virginia is perched on the edge of a Market counting table, reading your ledger upside down and faster than you could right side up.','Three deep work blocks this week. Not bad. I’ve seen senators manage two, and they had staff.'],opts:[
    {t:'You read my ledger?',r:['I read everything. It saves time. Yours was the most interesting thing on the table. You still are.']},
    {t:'Only three?',r:['Ambitious. I like that. Make it four and I’ll stop pretending I’m here for the numbers.']}]},
   {open:['* She slides a game piece across a board in the corner of the counting house. You didn’t realize you were already playing.','Your move. Don’t think too long. I’ve already planned for six of your options.'],opts:[
    {t:'Make a bold move.',r:['* Her eyebrow arches, and the smile that follows is slow and pleased.','Reckless. Darrow plays like that. It worked on me once, too.']},
    {t:'Plan carefully.',r:['Careful men build things that last. I find that very attractive in a man. And in a portfolio.']}]},
   {open:['* Late evening. Virginia has kicked her shoes off under the Market table, golden hair loose for once, a glass of wine untouched beside her.','Even a Sovereign needs one hour where nobody asks her for anything. Sit. Don’t ask me for anything.'],opts:[
    {t:'Sit quietly beside her.',r:['* After a while she leans sideways until her head rests on your shoulder.','See? You can be taught. That’s my favorite quality in a man.']},
    {t:'Not even a dance?',r:['* She looks at you over the rim of her glass for a long moment.','Ask me again in five minutes. I want to enjoy deciding.']}]},
   {open:['You know what I find irresistible? Not muscles. Not titles. A man who does the hard, boring thing every morning because he said he would.','So naturally, I’ve been watching you all week.'],opts:[
    {t:'Watching me work?',r:['* She steps close and straightens your collar, fingertips lingering at your throat.','Watching you win. Quietly. It’s very distracting, {name}.']},
    {t:'Should I be nervous?',r:['Yes. I’m very good at getting what I want. Luckily for you, I want you to succeed.']}]},
   {open:['* Virginia locks the counting house door, turns, and leans back against it.','I’ve negotiated treaties between planets. I’ve outmaneuvered every Gold who tried to kill me.','But I have not figured out how to stop thinking about you. It’s infuriating.'],opts:[
    {t:'Then stop thinking.',r:['* She laughs, low, and pulls you in by your shirt. The kiss is unhurried and very sure of itself.','That’s the first bad strategy I’ve ever loved.','* She blows out the lantern.']},
    {t:'Maybe I planned this.',r:['* Her eyes narrow, delighted.','Did you? Then I concede the field. Come here and collect your terms.','* She kisses you like a Sovereign signing a decree, and the rest is classified.']}]}],
  gift:['For me? You know I can buy anything I want. That’s exactly why this one matters. Come here.','Hm. Thoughtful, well-timed and a little bold. You’re learning how to win me. Keep going.','Careful. Keep giving me things like this and I’ll have to start a whole new ministry just for you.']},

 // ---------------- Victra (Marriage) ----------------
 victra:{
  visit:[
   {open:['* Victra is lounging in the best seat at the Rose Café, legs crossed, dressed like she owns the building. She probably bought it this morning.','There he is. Took you long enough. I was about to send Sevro to drag you here by the ankles.'],opts:[
    {t:'You missed me.',r:['Obviously. I don’t pretend about things I want. It wastes a woman’s good years.','* She pats the seat beside her. It is not a request.']},
    {t:'You’d really send Sevro?',r:['He’d enjoy it far too much. That’s why I came myself. Sit.']}]},
   {open:['You took her out tonight. Your wife. Flowers, a real table, your full attention. The whole village is talking.','Good. A man who courts the woman he already has. That’s the only kind worth a second look.'],opts:[
    {t:'You were spying?',r:['Julii don’t spy. We observe, expensively. And I liked what I saw.']},
    {t:'She deserves it.',r:['* Something softens in her sharp face for half a second.','Yes. Every woman does. Most men forget. You don’t. Don’t start.']}]},
   {open:['* Victra pours two glasses of something very red and very old, then hands you one.','My mother taught me love is a weapon. She was wrong. It’s a shield. You hold it up for the people you choose.'],opts:[
    {t:'Who do you hold it for?',r:['Few people. A goblin, a reaper, a little girl with my temper. And lately, against my better judgment, you.']},
    {t:'To shields.',r:['* She clinks her glass against yours and holds your gaze over the rim.','To shields. And to the men brave enough to stand behind them.']}]},
   {open:['* Victra traces one red fingernail slowly down the front of your shirt.','I do love a man who keeps his promises. It’s rarer than diamonds, and I would know. I own a lot of diamonds.'],opts:[
    {t:'Catch her hand.',r:['* She lets you, and her smile turns dangerous.','Oh, good. You have nerve. I was beginning to worry you were only charming.']},
    {t:'Are you flirting with me?',r:['Darling, if I were flirting, you’d need to sit down. This is me being polite.']}]},
   {open:['* The Rose Café is empty except for candles. Victra rises, tall and gleaming, and crosses to you without hurrying.','I’m not subtle. I’ve never seen the point. So listen closely, {name}.','You are good, and you are loyal, and it makes me want to ruin your evening in the best possible way.'],opts:[
    {t:'Then ruin it.',r:['* She takes your face in both hands and kisses you like a declaration of war.','Mm. There. Now you’re ruined for anyone less fierce.','* She snuffs the nearest candle between two fingers, smiling.']},
    {t:'You’re terrifying.',r:['Yes. And you’re still standing here. That’s why I like you.','* She pulls you down by your collar, and the candles burn very low before anyone leaves.']}]}],
  gift:['A gift? For me? I’m a Julii. I have everything. Except, apparently, this. Come here, you clever thing.','I’ll wear it in front of everyone and tell them exactly who gave it to me. Loudly.','Careful, darling. Spoil me like this and I start getting ideas. Expensive, wonderful ideas.']},
};
