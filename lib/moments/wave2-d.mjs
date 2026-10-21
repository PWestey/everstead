// Family "visit" and "gift" moments, wave 2 part D: Megan, Leia, Hermione, Ana.
// visit: pops up once a day on "Spend time together". gift: one reaction line when he gives her a gift.
// M = {open:[lines], opts:[{t:'player line', r:[reply lines]}]}. Lines starting "* " are narration.
// Megan is based on a real person: warm, sweet and romantic only (hand-holding, a cheek kiss, prayer, laughter).
// Hermione is written strictly as an adult in her Ministry years.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 megan:{
  visit:[
   {open:['* Megan is lighting the Chapel lamps one by one. She hands you a taper, and her fingers stay on yours a second longer than they need to.','Help me with the last few? It goes faster with two. Also, I just like having you here.'],opts:[
    {t:'Light them with her.',r:['* You work side by side until the whole Chapel glows. She steps back next to you to admire it, her shoulder against yours.','Okay, look at that. That’s pretty. We make a good team.']},
    {t:'I’d rather watch you.',r:['* She raises an eyebrow and laughs.','Oh, is that right? Grab a taper, mister. You can watch and work at the same time.']}]},
   {open:['I prayed for you this morning. And then I just kept thinking about you for a while after the amen. Oops.','* She grins, not even a little sorry.'],opts:[
    {t:'What were you thinking?',r:['That’s between me and the Light. Ask me again at supper and maybe I’ll tell you.']},
    {t:'Pray with me now?',r:['* She takes both your hands, laces her fingers through yours and bows her head.','Thank You for today, and for him. Help him keep going. And help me pay attention. Amen.','* She doesn’t let go right away.']}]},
   {open:['* She’s on the Chapel steps at dusk with two cups of tea and a blanket over her knees.','I had a feeling you’d come by. Sit close, it’s getting chilly.'],opts:[
    {t:'Sit beside her.',r:['* She tucks half the blanket over you and leans her head on your shoulder.','This is my favorite kind of quiet. The kind where nobody needs anything from either of us.']},
    {t:'It’s not that cold.',r:['* She laughs and pulls you down next to her anyway.','I know. I just wanted an excuse. Keep up.']},
    {t:'You always know.',r:['I just leave the door open and hope you walk through it. You always do. I love that about you.']}]},
   {open:['You did your quiet time every single day this week. Don’t think I didn’t notice.','* She steps up and straightens your collar, taking her sweet time about it.'],opts:[
    {t:'Some days it was hard.',r:['Honestly, those are the ones that count most. The easy days don’t take any faith.','* She pats your collar flat with both hands. “I’m proud of you, {name}.”']},
    {t:'Do I get a reward?',r:['* She tilts her head, pretending to think it over.','Hmm. Patience is a virtue. But you have been very good…','* She kisses your cheek, quick and warm, and laughs at the look on your face.']}]},
   {open:['* An evening walk through the orchard. Megan slips her hand into yours as the light fades, then stops under the tallest tree.','Can I tell you something? I’ve been looking forward to this all day.'],opts:[
    {t:'Tell me.',r:['* She squeezes your hand and leans her head against your arm.','Just this. Walking with you. The lamps can wait. Walk me home the long way?']},
    {t:'Looking forward to what?',r:['* She grins and swings your joined hands.','This, silly. You. Any more questions, or are you finally out?']}]}],
  gift:['You remembered what I like. Let me put this down so I can kiss you properly.','This is so thoughtful. Keep spoiling me like this and I’m going to start expecting it.','For me? You sweet man. Come here, that’s worth a kiss on the cheek.']},

 leia:{
  visit:[
   {open:['* Leia has a map of the Market spread across a crate, pins stuck in every stall.','Good, you’re here. I need someone who can read a ledger and won’t argue with me. Well. Argue a little.'],opts:[
    {t:'I’ll argue a lot.',r:['* She looks up, one eyebrow raised, very obviously fighting a smile.','Of course you will. I keep collecting men who argue. Sit down. Let’s see if you can keep up.']},
    {t:'Show me the plan.',r:['* She walks you through it, leaning over your shoulder, one hand on your arm.','Supply, timing, who owes who. Like running a rebellion, minus the stormtroopers. You won the morning today. Nice work.']}]},
   {open:['You did your deep work today. No distractions. Don’t deny it, you’ve got that look.','* She plants her hands on her hips and looks you over.'],opts:[
    {t:'What look?',r:['The look of a man who gets things done. It’s my favorite look. Don’t let it go to your head, laserbrain.']},
    {t:'You were watching me?',r:['I was supervising. Generals supervise. It’s completely professional.','* It is not completely professional.']}]},
   {open:['* Late night. The Market is empty, and Leia’s still at her desk, signing the last of the orders.','Don’t tell me to go to bed. I get enough of that from Threepio. Tell me something useful.'],opts:[
    {t:'You’re beautiful when you’re stubborn.',r:['* She sets the pen down very slowly.','That’s not useful. That’s distracting. …Say it again.']},
    {t:'Let me take half.',r:['* You split the stack and finish together. She leans back with a satisfied sigh.','Partners. I could get used to that word.']},
    {t:'Go to bed.',r:['Bold. Nobody gives me orders. You might be the exception. Tonight.']}]},
   {open:['I’ve led a rebellion, sat in the Senate and stared down a battle station the size of a moon. Know what still scares me?','* She fiddles with the cuff of your sleeve.'],opts:[
    {t:'What?',r:['Wanting something that isn’t a cause. Someone. It’s terrifying.','* She doesn’t let go of your sleeve.']},
    {t:'Nothing scares you.',r:['That’s what I let people think. You get to know better. Lucky you.']}]},
   {open:['* She catches you by the collar outside the counting house and pulls you into the shade of the awning.','You hit your savings goal. I read the ledger. Twice.'],opts:[
    {t:'Is that why you grabbed me?',r:['* She kisses you, quick and fierce, then steps back like nothing happened.','That was a commendation. Don’t make me issue another one in public.']},
    {t:'I had good motivation.',r:['Oh? Keep it up, flyboy. There’s more where that came from.']}]}],
  gift:['You remembered. Set it down a second. I’ve got a thank-you you won’t need to file.','I don’t need presents. I’ll keep this one, though. And you, apparently.','Well, look at you. Somebody figured out how to impress a princess. It’s rarer than you’d think.']},

 hermione:{
  visit:[
   {open:['* Hermione is buried behind a tower of Ministry files in the Library, quill scratching away.','Don’t touch that stack, it’s alphabetized by department. Actually, sit. I want company. Quiet company.'],opts:[
    {t:'Sit and read beside her.',r:['* An hour later her foot finds your ankle under the table. She doesn’t look up from her parchment.','Concentrate. I certainly am.']},
    {t:'Can I help?',r:['You can cross-reference these. And you can stop being so handsome while I’m working. Only one of those is optional.']}]},
   {open:['You kept your routine all week. Up on time, screens off, the lot. So naturally I made a chart.','* She unrolls a color-coded chart with enormous pride.'],opts:[
    {t:'You made me a chart?',r:['Obviously. I make charts for things I care about. Honestly, keep up.','* She hears what she just said and goes pink.']},
    {t:'What’s the gold star for?',r:['Thursday. You put the phone away and read instead. I very nearly kissed you over it.']},
    {t:'Marry me, nerd.',r:['* She whacks you lightly with the rolled-up chart.','Ask me again when you’ve kept it up a month. I’m counting. There’s a column.']}]},
   {open:['* After hours at the Ministry. The corridors are empty, and her office lamp is the only light on the floor.','All of Magical Law Enforcement went home hours ago. I suppose that makes you my only witness.'],opts:[
    {t:'Witness to what?',r:['* She sets down her wand, loosens the collar of her robes and steps around the desk.','To me finally taking a break. Don’t tell Kingsley.']},
    {t:'Come home. The work will keep.',r:['The work will. I’m not sure I will. Walk me out?','* She takes your arm at the lift and doesn’t let go.']}]},
   {open:['I used to think discipline meant doing everything myself, perfectly, before anyone else had even started.','* She closes her book and studies you.'],opts:[
    {t:'And now?',r:['Now I think it’s doing the boring thing every day, next to someone who does the same. You’re rather good at that, you know.']},
    {t:'You’re still the brightest witch I know.',r:['Flattery. Very effective flattery. Come here and say it closer.']}]},
   {open:['* A rainy evening by the Library fire. Hermione is curled in the armchair with a book she’s pretending to read.','I’ve read this page four times. You’re terribly distracting, just sitting there breathing.'],opts:[
    {t:'Should I leave?',r:['Don’t you dare.','* She closes the book on her lap. “I’d like you to kiss me again. That’s the whole request.”']},
    {t:'Read it to me.',r:['* She reads aloud, slower and softer every page, until the book slips shut and her head is resting on your chest.']}]}],
  gift:['You listened. That’s maddeningly attractive. Put it down before I make a speech instead of kissing you.','A gift? I had today scheduled to the quarter hour and you’ve just ruined it. Thank you.','This is perfect. I’m going to research exactly how to thank you. Thoroughly.']},

 ana:{
  visit:[
   {open:['* Ana bursts out of the Guildhall, wand in one hand, a fiddle in the other.','I charmed this to play itself! Badly! Dance with me before it gets worse!'],opts:[
    {t:'Dance with her.',r:['* The fiddle squeals, she spins you, and you both end up breathless and laughing against the wall.','See? Awful music. Great company. Totally worth it.']},
    {t:'Fix the charm first.',r:['Boring! Correct, but boring. Fine. Then you owe me a dance, and I charge interest.']}]},
   {open:['Truth or dare. Gryffindors always take dare, but I’ll let you pick. I’m generous like that.','* She twirls her wand, grinning like trouble.'],opts:[
    {t:'Dare.',r:['I dare you to learn one new thing this week and show me. Then kiss me after. Second part’s not negotiable.']},
    {t:'Truth.',r:['Coward! Okay. Truth: I get to the Guildhall early just to catch you. Your turn to go red.']}]},
   {open:['* Three broomsticks, a sketchbook and a half-built model ship are scattered across the Guildhall floor.','I pick up a new hobby every week. You actually stick with yours. It’s unfairly attractive.'],opts:[
    {t:'Pick one and I’ll do it with you.',r:['* She hands you the sketchbook, then sits close enough to steal your pencil.','Draw me. Flatter me. I’ll know if you don’t.']},
    {t:'Stick with me, then.',r:['Oh, smooth. Very smooth. Did you practice that? Because it worked.']},
    {t:'Teach me to fly.',r:['* On the broom she wraps her arms around your waist from behind.','Lean forward. Trust me. I won’t let you fall. Much.']}]},
   {open:['You read every night this week. Actual books, not three lines and a nap. I checked your bookmark.','* She waggles the bookmark at you.'],opts:[
    {t:'You stole my bookmark?',r:['Borrowed. With love. I left a note inside. Do not read it in front of me, I will combust.']},
    {t:'Proud of me?',r:['Ridiculously. Come here, you’re getting a reward. It’s a kiss. The reward is a kiss.']}]},
   {open:['* Stars over the Guildhall roof. Ana conjures a little flock of glowing birds that circle your heads.','I used to do this to show off. Now I do it because I like your face when I do.'],opts:[
    {t:'Do it again.',r:['* She does. Then she leans in and kisses you while you’re still looking up.','Gotcha. Brave of me, right? Very Gryffindor.']},
    {t:'Show me how.',r:['* She guides your wand hand with hers, close enough that you can feel her heartbeat.','Swish, flick, and don’t look at me or you’ll lose focus. …You looked.']}]}],
  gift:['You remembered. Excellent. I was hoping for a reason to kiss you, and this is a very good one.','Oh, this is brilliant! I’m showing it off to the whole Guildhall. And you with it.','A present? Right. Now I have to top it. Prepare to be outdone, mister.']},
};
