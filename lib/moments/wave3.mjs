// Third-wave moments: Fellows Dalinar, Ragnar and Sevro (level every 5th level, star 1..5) and
// Family Virginia and Victra (visits and gifts). See docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{level:any[],star:any[]}>} */
export const FELLOW_MOMENTS={
 // ---------------- Dalinar (Discipline) ----------------
 dalinar:{
  level:[
   {open:['* Dalinar sits at a Library table with a single page in front of him, reading slowly, one thick finger under each word.','You put the screen away at the hour you set. I noticed. Navani says I notice too much. She’s probably right.'],opts:[
    {t:'It was harder than it sounds.',r:['It always is. The Thrill never shouted at me. It just asked. Every day. You give it the same answer until it gets tired.']},
    {t:'You noticed that?',r:['I notice every small surrender, {name}. Mine first. Noticing the small wins took me longer.']}]},
   {open:['When I was young, I thought strength was something you proved on a battlefield. Ask anyone in Alethkar. They’d agree.','Now I think it’s doing the dishes when you’re tired and nobody would blame you for leaving them.']},
   {open:['* He slides a worn notebook across the table. Each page holds a single line in a careful, heavy hand.','Every morning I write one thing I won’t do today. Every night I check. Navani taught me the letters. The rest I had to teach myself.'],opts:[
    {t:'What did you write today?',r:['* He turns the page so you can see. One word: Wait.','I get impatient with men who are slow to change. I forget how slow I was.']},
    {t:'Only one thing?',r:['One promise kept beats ten good intentions. Start with one. Add another when the first stops hurting.']}]},
   {open:['* You find him in the training yard before dawn, running forms with a practice sword, already sweating.','Morning. Grab a sword. I don’t get better once a year. I get better this morning. So do you.']}],
  star:[
   {open:['* He looks at the star a long moment, then closes his big hand around it.','I’ve worn a highprince’s crown. It weighed less than this. Storms, I mean that.']},
   {open:['There was a version of me who would have laughed at you, {name}. Called your routines soft.','He was a drunk and a butcher. I buried him. Some mornings I still go check the grave.'],opts:[
    {t:'How do you keep him buried?',r:['Next right thing. Then the next one. He can’t climb out while my hands are busy.']},
    {t:'I have one of those too.',r:['Every man worth knowing does. The question isn’t whether he’s there. It’s whether he gets your morning.']}]},
   {open:['* He sets two cups of tea on the table and pushes one toward you.','I used to drink so I wouldn’t remember Evi. Now I drink tea, and remember her. Less exciting. I sleep much better.'],opts:[
    {t:'To remembering.',r:['* He touches his cup to yours, solemn as an oath.','To remembering. And to the people who wouldn’t let us forget.']},
    {t:'Does it get easier?',r:['No. You get stronger. From the inside, it feels about the same.']}]},
   {open:['* Dalinar watches you finish your evening routine without a word, then nods once, a general to a soldier.','Nobody told you to do that tonight. Not even me. That’s when it stops being discipline and starts being you.']},
   {open:['* In the Library at night, he lays a sword on the table between you, hilt toward your hand.','Back home, a man only handed his Shardblade to someone he trusted with his life. I gave mine up long ago. My word’s worth more now anyway.','You’re my brother, {name}. The kind I chose.'],opts:[
    {t:'Take his hand.',r:['* His grip is iron, and he doesn’t let go quickly.','Unite them, brother. Your habits, your house, your heart. I’ll stand next to you while you do.']},
    {t:'I don’t deserve that.',r:['Neither did I, the first time someone offered. That’s why it’s a gift. Take my hand and stop arguing with a highprince.']}]}]},

 // ---------------- Ragnar (Home) ----------------
 ragnar:{
  level:[
   {open:['* Ragnar sits on an overturned crate in the Workshop, a tiny paintbrush lost in his huge hand, touching up a windowsill.','Your house told me you fixed the hinge on its back door. It sings less now. It is grateful.'],opts:[
    {t:'Houses can be grateful?',r:['Anything cared for is grateful, little brother. Watch how it holds you when the winter wind comes.']},
    {t:'It took me three tries.',r:['Then the door had three visits from you. That is not failure. Among my people, that is courtship.']}]},
   {open:['Where I was born, there were no houses. Only ice, and Golds who called themselves gods, and lied.','Now I know a home is built by hands, every day. Small hands. Even very large small hands.']},
   {open:['* He holds up a carved wooden bowl, still rough at the rim.','I am making one for each person in your house. So each one knows there is a place at the table for them.'],opts:[
    {t:'That’s beautiful, Ragnar.',r:['* He looks embarrassed, which on a man his size is like watching a mountain blush.','It is wood. And hours. The hours are the gift.']},
    {t:'Teach me to carve.',r:['* He hands you a knife and the smallest block of wood you have ever seen, at least in his palm.','Slow. Go with the grain. Do not fight it. It is the same with children.']}]},
   {open:['* You sweep the Workshop floor together at sunset. Each of his broom strokes covers three of yours.','Sefi says a warrior guards the gate and a father guards the fire. You did both this week. I watched.']}],
  star:[
   {open:['* He holds the star up to the light. His pale eyes shine.','My mother said the stars were the hearth fires of the dead. Now I carry one from a living house. Yours.']},
   {open:['* Ragnar stands in your doorway, stooped so he fits, looking at the swept floor and the folded blankets.','You do this for them. Not for praise. I know, because no one praises folded blankets. So I will be the first.'],opts:[
    {t:'It’s just chores.',r:['Chores are love with its sleeves rolled up. Do not make it small, brother. I will not allow it.']},
    {t:'Thank you, Ragnar.',r:['* He puts a hand on your head, the way you would with a child, then remembers himself and laughs.','Forgive me. On the ice, that means I am proud of you.']}]},
   {open:['I have killed many enemies. I am not proud of it. I am not ashamed. They came for my people.','What I am proud of is the roof I patched for my sister Sefi. It still does not leak. She checks.'],opts:[
    {t:'A roof is a kind of shield.',r:['* He looks at you for a long time.','Yes. You understand. There is a poet hiding inside this busy man.']},
    {t:'What’s your sister like?',r:['Quiet. Fierce. She called me a mountain with a soft middle. She was right about the middle.']}]},
   {open:['* Ragnar hums a low song from the ice while he fixes a chair leg, and teaches you the words one at a time.','We sing while we work, so the work remembers it was done gladly.']},
   {open:['* At dusk he lays a heavy fur cloak over your shoulders, still warm from the Workshop fire.','Among my people, this goes to the one who keeps the fire. The one who stays.','You are my brother of the hearth, {name}. Your house is my house. Anyone who comes for it meets me first.'],opts:[
    {t:'Wear it proudly.',r:['* He grins, wide and wild, and claps both your shoulders hard enough to rattle your teeth.','Good! Now you look like a man who could carry a sofa up a mountain. Come. The gutters need us.']},
    {t:'You’re already part of my house.',r:['* His great chest heaves once. He looks away, toward the hills.','You will make a giant weep in front of the whole village. Fine. Let them look.']}]}]},

 // ---------------- Sevro (Fatherhood) ----------------
 sevro:{
  level:[
   {open:['* Sevro drops out of a tree outside the Hearth Inn and lands in a crouch, wolfcloak flapping.','Heard you did bedtime stories tonight. Voices and everything. You absolute gorydamn legend.'],opts:[
    {t:'I did the dragon voice.',r:['The dragon voice! Ha! Kids remember the dragon voice forever. Electra still makes me do my dying-goblin noise. Fifteen times a night. I die so much.']},
    {t:'How do you know that?',r:['I’m a Howler. We know things. Also your kid told me. Loudly. Terrible spy. Love that kid.']}]},
   {open:['Used to think being a dad meant being a hero. Big speeches. Big razors. Very Reaper.','Turns out it’s mostly snacks. And being in the room. Being in the room is the whole bloodydamn trick.']},
   {open:['* Sevro is sprawled on the Inn floor with a pile of wooden toys, building a truly ugly little fortress.','Get down here. Kids are watching. Floor means you’re a dad. Chair means you’re furniture.'],opts:[
    {t:'Get on the floor.',r:['* He hands you a block with enormous ceremony.','Welcome to the pack, chief engineer. East wall’s weak. Like Darrow’s jokes.']},
    {t:'My knees disagree.',r:['Your knees are cowards. Ignore ’em. Electra climbs me like a cliff every morning and I’m only mostly broken.']}]},
   {open:['* He flicks a pebble off your boot, grinning.','Phone stayed in your pocket at dinner. Saw it. Proud of you, you sentimental slagger. Don’t make me say it twice.']}],
  star:[
   {open:['* Sevro bites the star like a coin, then stuffs it in his cloak.','Real. Shiny. Mine now. Don’t tell Reap, he gets weird about my loot.']},
   {open:['My dad wasn’t around. Not when it counted. Too busy being Ares.','So I decided I’d be there so hard it makes up for it. Every scraped knee. Every bad dream. Every gorydamn tea party.'],opts:[
    {t:'You’re a great dad, Sevro.',r:['* He looks away fast and rubs his nose.','Shut up. Pollen. There’s pollen. Anyway, so are you. Shut up about that too.']},
    {t:'Tea parties?',r:['Pinky out, crown on, best manners in the bloodydamn worlds. Electra runs a tight ship. Victra takes notes.']}]},
   {open:['* He hops up onto the bar of the Hearth Inn and sits cross-legged, suddenly serious.','Real talk. Some nights you’ll be tired and short with ’em. You’ll feel like slag after.','Fix it before bed. Say sorry. Kids don’t need a perfect dad. They need one who comes back in the room.'],opts:[
    {t:'I’ve had nights like that.',r:['Course you have. Me too. Last week I yelled over a spilled cup. Then I spilled mine on purpose so she’d laugh. Repair, chief.']},
    {t:'That’s wise, for you.',r:['I contain multitudes. Mostly snacks and crimes. Bit of wisdom in there though, yeah.']}]},
   {open:['* Sevro sneaks up behind you and drops a ragged wolf pelt over your head.','Just checking the size. Not saying anything. Measuring. Shut up.']},
   {open:['* At the Inn, Sevro rounds up every misfit in the village around the fire, then howls at the moon until they all join in.','Okay! Shut it, everyone. This is a ceremony. Look serious. Serious, I said.','* He throws a wolfcloak over your shoulders, gruff and clumsy.','You’re a Howler now, {name}. Pack for life. Anybody messes with your kids, they answer to all of us.'],opts:[
    {t:'Howl with them.',r:['* You howl. It’s terrible. The whole Inn cheers anyway.','That’s it! Worst howl I’ve ever heard. Perfect. You’re family, brother.']},
    {t:'I’m honored, Sevro.',r:['* He pulls you into a hug that’s mostly headlock.','Yeah, yeah. Don’t get soppy. Electra already calls you uncle. I didn’t teach her that. I totally taught her that.']}]}]},
};

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Virginia (Work) ----------------
 virginia:{
  visit:[
   {open:['* Virginia is perched on the edge of a Market counting table, reading your ledger upside down, faster than you read it right side up.','Three deep work blocks this week. Not bad. I know senators who manage two, and they have staff.'],opts:[
    {t:'You read my ledger?',r:['I read everything. Saves time. Yours was the most interesting thing on the table. You still are.']},
    {t:'Only three?',r:['Ambitious. I like that. Make it four and I’ll stop pretending I came for the numbers.']}]},
   {open:['* She slides a piece across a game board in the corner of the counting house. You hadn’t realized you were already playing.','Your move. Don’t take all night. I’ve planned for six of your options. The seventh is cute.'],opts:[
    {t:'Make a bold move.',r:['* Her eyebrow goes up, and the smile after it is slow and pleased.','Reckless. Very Institute. It worked on me once, against my better judgment.']},
    {t:'Plan carefully.',r:['Careful men build things that last. I find that attractive in a man. And in a treaty.']}]},
   {open:['* Late evening. Virginia has kicked her shoes off under the Market table, golden hair loose for once, a glass of wine untouched beside her.','Even a Sovereign gets one hour where nobody asks her for anything. Sit. Don’t ask me for anything.'],opts:[
    {t:'Sit quietly beside her.',r:['* After a while she tips sideways until her head rests on your shoulder.','See? You can be taught. That’s my favorite quality in a man.']},
    {t:'Not even a dance?',r:['* She looks at you over the rim of her glass for a long moment.','Ask me again in five minutes. I want to enjoy deciding.']}]},
   {open:['Want to know what I find hard to resist? Not muscles. Not titles. I grew up drowning in both.','A man who does the hard, boring thing every morning because he said he would. So, yes. I’ve been watching you all week.'],opts:[
    {t:'Watching me work?',r:['* She steps close and fixes your collar, fingertips lingering at your throat.','Watching you win. Quietly. It’s very distracting, {name}.']},
    {t:'Should I be nervous?',r:['Yes. I always get what I want. Lucky for you, what I want is for you to win.']}]},
   {open:['* Virginia locks the counting house door, turns, and leans back against it.','I’ve brokered peace between planets. I’ve outplayed every Gold who tried to kill me, my own father included.','What I can’t seem to do is stop thinking about you. It’s infuriating.'],opts:[
    {t:'Then stop thinking.',r:['* She laughs, low, and pulls you in by your shirt. The kiss is unhurried and very sure of itself.','Worst strategy I’ve ever loved.','* She blows out the lantern.']},
    {t:'Maybe I planned this.',r:['* Her eyes narrow, delighted.','Did you? Then I concede the field. Come collect your terms.','* She kisses you like she’s signing a decree, and the rest is classified.']}]}],
  gift:['Well chosen. I’m beginning to think you understand exactly how to get my attention. Keep it.','Hm. Thoughtful, well timed, a little bold. You’re learning how to win me. Don’t stop.','Careful. Keep this up and I’ll have to found a whole new ministry just to deal with you.']},

 // ---------------- Victra (Marriage) ----------------
 victra:{
  visit:[
   {open:['* Victra is lounging in the best seat at the Rose Café, legs crossed, dressed like she owns the place. She may have bought it this morning.','There he is. Took you long enough. I was about to send Sevro to drag you here by the ankles.'],opts:[
    {t:'You missed me.',r:['Obviously. I don’t pretend about things I want. I leave pretending to my sister.','* She pats the seat beside her. It isn’t a request.']},
    {t:'You’d really send Sevro?',r:['He’d enjoy it far too much. He’d bring rope. That’s why I came myself. Sit.']}]},
   {open:['You took her out tonight. Your wife. Flowers, a real table, your full attention. The whole village is talking about it.','Good. A man who still courts the woman he already has. That’s the only kind worth a second look.'],opts:[
    {t:'You were spying?',r:['Julii don’t spy, darling. We observe, expensively. And I liked what I saw.']},
    {t:'She deserves it.',r:['* Something softens in her sharp face for half a second.','Yes. She does. Most men forget. You don’t. Don’t start.']}]},
   {open:['* Victra pours two glasses of something very red and very old, then hands you one.','Mother raised me to think love was a weapon. Mother was wrong about most things. It’s a shield.'],opts:[
    {t:'Who do you hold it for?',r:['Not many. A goblin. A reaper. Two little girls with my temper. And lately, against my better judgment, you.']},
    {t:'To shields.',r:['* She clinks her glass against yours and holds your eyes over the rim.','To shields. And to the men brave enough to stand behind them.']}]},
   {open:['* Victra drags one red fingernail slowly down the front of your shirt.','I do love a man who keeps his promises. They’re rarer than diamonds, and I would know. I own a frightening number of diamonds.'],opts:[
    {t:'Catch her hand.',r:['* She lets you, and her smile turns dangerous.','Oh, good. You have nerve. I was starting to worry you were only charming.']},
    {t:'Are you flirting with me?',r:['Darling, if I were flirting, you’d need to sit down. This is me being polite.']}]},
   {open:['* The Rose Café is empty except for candles. Victra rises, tall and gleaming, and crosses to you without hurrying.','I’m not subtle. Never saw the point. So listen closely, {name}.','You’re good, and you’re loyal, and it makes me want to ruin your evening in the best possible way.'],opts:[
    {t:'Then ruin it.',r:['* She takes your face in both hands and kisses you like a declaration of war.','Mm. There. Now you’re ruined for anyone less fierce.','* She pinches out the nearest candle between two fingers, smiling.']},
    {t:'You’re terrifying.',r:['Yes. And you’re still standing here. That’s why I like you.','* She pulls you down by your collar, and the candles burn very low before anyone leaves.']}]}],
  gift:['Darling, I can buy jewelry. I cannot buy the look on your face when you give it to me. Come closer.','I’m wearing this in front of everyone and telling them exactly who gave it to me. Loudly. Sevro will sulk.','Careful, darling. Spoil me like this and I start getting ideas. Expensive, wonderful ideas.']},
};
