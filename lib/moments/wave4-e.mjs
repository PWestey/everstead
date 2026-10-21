// Fourth-wave moments, part E: Family Poppy (Fitness), Lulu (Hobbies) and Syl (Discipline) (visits and gifts).
// See docs/WRITING-BRIEF.md. STRICTLY PLATONIC: warm, funny, cheerful friends who cheer him on. No romance.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Poppy (Fitness) ----------------
 poppy:{
  visit:[
   {open:['* Poppy drags her hammer across the Training Yard, leaving a groove in the dirt. It’s twice her size. She doesn’t seem to notice.','Oh! Hi! I’m not training. I’m just… keeping the hammer warm. For the real hero. Whoever that is.'],opts:[
    {t:'You swing it every morning, Poppy.',r:['Well, yeah. Somebody has to keep it from getting rusty. That’s not the same as being a hero. Is it?']},
    {t:'Can I try it?',r:['* You get it about an inch off the ground.','Ha! See? It’s heavy. I’m only good at it because I’ve carried it a really long way. That’s all.']}]},
   {open:['You did your workout and then you still played tag with your kids after? Your legs must be noodles.'],opts:[
    {t:'Complete noodles.',r:['Noodle legs are the best legs. They mean you didn’t save anything. In Bandle City we call that “stubborn.”']},
    {t:'The kids won, obviously.',r:['They always do. Bring them by sometime. I’ll let them ride on the hammer. Very slowly. With a helmet.']}]},
   {open:['* Poppy sits on an overturned bucket, polishing the hammer’s head with her sleeve.','Can I tell you something embarrassing? I practice what I’ll say when I find the hero. Out loud. To a fence post.'],opts:[
    {t:'What do you say?',r:['“Hello, I’ve brought your hammer, sorry it took so long, please don’t be a jerk.” It needs work.']},
    {t:'Maybe the hero’s already here.',r:['* She squints at you, then at the hammer, then laughs.','Nice try. You’re just trying to get out of carrying it. I see you.']}]},
   {open:['I tried running with you this morning. I have very short legs. Did you notice I took, like, four steps for every one of yours?'],opts:[
    {t:'You kept up the whole way.',r:['I did, didn’t I! Okay, I fell in the creek once. But I got out. Getting out counts.']},
    {t:'Want me to slow down?',r:['No way. Then I’d never get faster. Just wait at the top of the hill and pretend you’re tying your shoe.']}]},
   {open:['* Dusk. Poppy leans on her hammer at the Yard gate, watching you stretch.','You know what I like? You don’t make a big speech about it. You just do the thing. Every day. Even the boring days.'],opts:[
    {t:'Kind of like you.',r:['* She goes pink to the tips of her ears.','Pfft. I’m just a delivery yordle. But… thanks. Same time tomorrow?']},
    {t:'Boring days are most days.',r:['Exactly! Heroes in stories skip those. I think the boring days are where the actual muscles come from.']}]}],
  gift:[
   '* Poppy holds it up with both hands like it’s the treasure of Bandle City. For me? Not for the hero? Oh. Oh, okay. Wow.',
   'I’m going to keep this right next to the hammer. Don’t tell the hammer. It gets jealous.',
   '* She gives you a quick, rib-creaking hug around the middle. Sorry! Sorry. Strong arms. Thank you!']},

 // ---------------- Lulu (Hobbies) ----------------
 lulu:{
  visit:[
   {open:['* A teacup on the Guildhall shelf is suddenly the size of a bathtub. Lulu is sitting in it, waving.','Pix said the cup looked lonely! So I made it bigger. Now it’s less lonely and more… roomy!'],opts:[
    {t:'Can you make it small again?',r:['Probably! Eventually. Pix, do you remember the small word? He says no. That’s fine. We’ll use it as a boat.']},
    {t:'Room for one more?',r:['Always! Bring your little ones too. We’ll sail to the bookshelf. It’s very far when you’re a teacup.']}]},
   {open:['You finished a whole chapter of your book tonight! I could tell. You had the face. The “one more page” face.'],opts:[
    {t:'It was a really good chapter.',r:['Was there a dragon? There should always be a dragon. Or a squirrel that’s secretly a dragon. Pix wants to know.']},
    {t:'I stayed up too late.',r:['Too late is a made-up time. Like Tuesday! Okay, Tuesday’s real. But you should sleep. Dream about the book.']}]},
   {open:['* Lulu is painting the Guildhall door purple. Half of it. The other half has stars.','I got bored of brown. Brown is a nap color. Do you paint? You should paint. Badly! Badly is the fun part.'],opts:[
    {t:'I’m terrible at it.',r:['Perfect! Terrible paintings are my favorite. They have opinions. Here, take a brush. Make the sky green.']},
    {t:'My kids would love this.',r:['Then bring them! We’ll do the other door. I’ll make the paint sparkle. Only a little. Medium. Okay, a lot.']}]},
   {open:['Pix says you were learning a new song on your guitar today and you messed it up twelve times. He counted. He loves counting.'],opts:[
    {t:'Thirteen, actually.',r:['Thirteen! Pix is going to be so upset. He’ll recount. He always recounts. You kept going, though! That’s the music part.']},
    {t:'I’ll get it eventually.',r:['Of course you will. Then I’ll make you giant and you can play it for the whole village. From the sky!']}]},
   {open:['* Evening. Lulu lies on the Guildhall rug, kicking her feet, watching tiny glowing moths circle a candle.','You know what grown-ups forget? That playing is serious. Very serious. I take it extremely seriously.'],opts:[
    {t:'You’re right.',r:['I know! Pix says I’m wrong about almost everything else. But I’m right about that. Go play something tomorrow.']},
    {t:'Did you make those moths?',r:['Maybe. They were beetles. They seemed sad about it. Now they glow and nobody’s sad. Except maybe the beetles’ moms.']}]}],
  gift:[
   '* Lulu gasps so loudly that Pix falls off her hat. For me? Can I make it bigger? Just a little? Okay, I won’t. Yet.',
   'This is the best thing anyone’s given me since Pix gave me a button. It was a very good button. This is better. Shh, don’t tell him.',
   '* She sprinkles a pinch of glitter on your shoulder as a thank-you. It never quite comes off. That seems to be the point.']},

 // ---------------- Syl (Discipline) ----------------
 syl:{
  visit:[
   {open:['* A ribbon of pale blue light loops twice around the Library lamp and settles on your shoulder as a tiny figure, legs crossed.','You put your phone in a drawer! A whole drawer! I watched. I think the drawer was surprised too.'],opts:[
    {t:'It was hard, Syl.',r:['I know. You glared at the drawer for ten minutes. Very dramatic. Kaladin glares at clouds the same way.']},
    {t:'Don’t tell anyone.',r:['Too late. I told a windspren. They tell everybody. It’s their whole thing.']}]},
   {open:['Question. Why do humans set an alarm and then press the “snooze” button? Isn’t that just promising to wake up, then not?'],opts:[
    {t:'It’s… complicated.',r:['Hmm. It sounds like lying to a clock. Honorspren don’t lie to clocks. You didn’t press it today, though! I noticed.']},
    {t:'I quit snoozing this week.',r:['Really? Good. The clock seems happier. I’m mostly guessing. Clocks are hard to read.']}]},
   {open:['* Syl zips around the Library shelves, turning into a leaf, then a little flag, then a falling star.','Kaladin says I’m distracting. I say I’m “practicing.” Did you do the boring thing yet? The list thing?'],opts:[
    {t:'Finished the whole list.',r:['The whole thing? Ooh. You said you would and then you did. Do you know how rare that is? It’s my favorite thing.']},
    {t:'Halfway there.',r:['Halfway is still more than none! Go finish it. I’ll be a leaf on your shoulder. A very encouraging leaf.']}]},
   {open:['I asked Kaladin once why he keeps getting up on the bad days. He just grunted. Very helpful. Then he got up anyway.','You do that too. I’ve seen it.'],opts:[
    {t:'Some days I don’t feel like it.',r:['Feeling like it is optional. The getting up part isn’t. That’s what a promise is, I think. You keep it when you’re grumpy.']},
    {t:'Does he know you watch him?',r:['He knows. He pretends not to. Humans are funny like that. You do it too! Don’t make that face. That one.']}]},
   {open:['* Evening. Syl sits on top of a stack of books, swinging her legs, glowing softly.','You told your kids you’d play after dinner and you did, even with the game on. That was a promise. Small, but a real one.'],opts:[
    {t:'They’d have remembered if I didn’t.',r:['Kids keep score better than spren do. And they’ll remember you showing up. That’s the good kind of score.']},
    {t:'You count small promises?',r:['I count all of them! Small ones are how big ones get built. Don’t tell Kaladin I said something wise. He’ll be insufferable.']}]}],
  gift:[
   '* Syl circles it three times as a streak of light before landing beside it. A present? For a spren? I can’t even hold it! I love it anyway.',
   'I’m going to tell every spren in the village about this. Most of them won’t understand. Windspren will pretend to. That’s fine.',
   '* She turns into a tiny bow on top of it, then giggles. There. Now it’s wrapped. Gifts are supposed to be wrapped, right?']}
};
