// Family "visit" and "gift" moments, wave 2 part D: Megan, Leia, Hermione, Ana.
// visit: pops up once a day on "Spend time together". gift: one reaction line when he gives her a gift.
// M = {open:[lines], opts:[{t:'player line', r:[reply lines]}]}. Lines starting "* " are narration.
// Megan is based on a real person: warm, sweet and romantic only (hand-holding, a cheek kiss, prayer, laughter).
// Hermione is written strictly as an adult in her Ministry years.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 megan:{
  visit:[
   {open:['* Megan is lighting the Chapel lamps one by one. She hands you a taper and lets her fingers linger on yours.','Help me with the last few? It goes faster with two. And I like the company.'],opts:[
    {t:'Light them with her.',r:['* You work side by side until the whole Chapel glows. She steps close to admire it, close enough to feel her warmth.','Look at that. You make everything brighter. Including me.']},
    {t:'I’d rather watch you.',r:['* She raises an eyebrow and smiles slowly.','Careful. Staring at a priestess in her own Chapel? That’s going to take a very long confession.']}]},
   {open:['I prayed for you this morning. Then I caught myself thinking about you for a good while after the amen.','* She bites her lip, not even a little sorry.'],opts:[
    {t:'What were you thinking?',r:['That’s between me and the Light. Ask me again after sunset and I might tell you.']},
    {t:'Pray with me now?',r:['* She takes both your hands, laces her fingers through yours and bows her head.','Thank You for this day, and for him. Help him keep going. And help me behave. Amen.','* She doesn’t let go right away.']}]},
   {open:['* She’s on the Chapel steps at dusk with two cups of tea, her robes loosened against the warm evening.','I had a feeling you’d come by. Sit close. It’s getting cold.'],opts:[
    {t:'Sit beside her.',r:['* She leans into you and rests her head on your shoulder, her hand drifting onto your knee.','This is my favourite kind of quiet. The kind where I can hear your heart going faster.']},
    {t:'It’s not that cold.',r:['* She laughs and pulls you down next to her anyway.','I know. I was just looking for an excuse. Try to keep up.']},
    {t:'You always know.',r:['I leave the door open and hope you’ll walk through it. You always do. I love that about you.']}]},
   {open:['You kept your quiet time every single day this week. I noticed.','* She steps right up to you and straightens your collar, taking her time about it.'],opts:[
    {t:'Some days it was hard.',r:['Those are the days that count the most. Showing up when it’s hard is where faith lives.','* She smooths your collar flat with both palms. I’m proud of you, {name}.']},
    {t:'Do I get a reward?',r:['* She leans in until her lips are almost at your ear.','Patience is a virtue. But since you’ve been so good…','* She kisses you, soft and slow, right there in the doorway.']}]},
   {open:['* An evening walk through the orchard. Megan slips her hand into yours as the light fades, then pulls you behind the tallest tree.','Can I tell you something? I’ve wanted to do this all day.'],opts:[
    {t:'Then do it.',r:['* She rises on her toes and kisses you, then again, slower, her hands on your chest.','The lamps can light themselves tonight. Walk me home?']},
    {t:'Do what?',r:['* She grins, grabs your collar and shows you.','That. Any more questions, or are you finally out of them?']}]}],
  gift:['Oh, you didn’t have to! Come here. A thank-you this nice deserves a kiss.','This is so thoughtful. You keep spoiling me and I might start expecting it. Every night.','For me? You’re sweet. Close your eyes, I want to thank you properly.']},

 leia:{
  visit:[
   {open:['* Leia has a map of the Market spread across a crate, pins in every stall.','Good, you’re here. I need someone who can read a ledger and won’t argue with me. Well. Argue a little.'],opts:[
    {t:'I’ll argue a lot.',r:['* She looks up, one brow raised, very much fighting a smile.','Promises, promises. Sit down, scoundrel. Let’s see if you can keep up.']},
    {t:'Show me the plan.',r:['* She walks you through it, leaning over your shoulder, her hand on your arm.','Supply, demand, timing. Win the morning and you win the war. You did, today.']}]},
   {open:['You did your deep work today. No distractions. I can tell, you’ve got that look.','* She steps closer, hands on her hips, appraising.'],opts:[
    {t:'What look?',r:['The look of a man who gets things done. It’s my favorite look. Don’t let it go to your head.']},
    {t:'You were watching me?',r:['I was supervising. Generals supervise. It’s entirely professional.','* It is not entirely professional.']}]},
   {open:['* Late night. The Market’s empty, and Leia’s still at her desk, signing the last of the orders.','Don’t tell me to go to bed. Tell me something useful.'],opts:[
    {t:'You’re beautiful when you’re stubborn.',r:['* She sets the pen down very slowly.','That is not useful. That is distracting. Say it again.']},
    {t:'Let me take half.',r:['* You split the stack. You finish together, and she leans back with a satisfied sigh.','Partners. I could get used to that word.']},
    {t:'Go to bed.',r:['Bold. Nobody gives me orders. You may be the exception. Tonight.']}]},
   {open:['I’ve led rebels, run a senate and stared down a moon-sized battle station. You know what still scares me?','* She toys with the cuff of your sleeve.'],opts:[
    {t:'What?',r:['Wanting something that isn’t a cause. Someone. It’s terrifying.','* She doesn’t let go of your sleeve.']},
    {t:'Nothing scares you.',r:['That’s what I let people think. You get to know better. Lucky you.']}]},
   {open:['* She catches you by the collar outside the counting house and pulls you into the shadow of the awning.','You hit your savings goal. I read the ledger. Twice.'],opts:[
    {t:'Is that why you grabbed me?',r:['* She kisses you, quick and fierce, then steps back like nothing happened.','That was a commendation. Don’t make me issue another one in public.']},
    {t:'I had good motivation.',r:['Oh? Keep it up, flyboy. The motivation has more where that came from.']}]}],
  gift:['For me? You’re full of surprises. Keep it up and I might start believing in you.','I don’t need presents. But I’ll keep this one. And you, apparently.','Well, look at you. Somebody’s learning how to impress a princess.']},

 hermione:{
  visit:[
   {open:['* Hermione is buried behind a tower of Ministry files in the Library, quill flying.','Don’t move that stack, it’s alphabetized by department. Actually, sit. I want company. Quiet company.'],opts:[
    {t:'Sit and read beside her.',r:['* An hour later her stockinged foot finds your ankle under the table. She doesn’t look up from her parchment.','Concentrate. I certainly am.']},
    {t:'Can I help?',r:['You can cross-reference these. And you can stop being so handsome while I’m working. Only one of those is optional.']}]},
   {open:['You kept to your routine all week. Up on time, screens off, the lot. I made a chart.','* She unrolls a color-coded chart with genuine pride.'],opts:[
    {t:'You made me a chart?',r:['Of course I did. I make charts for things I care about. Do keep up.','* She realizes what she just said and turns pink.']},
    {t:'What’s the gold star for?',r:['That’s for Thursday, when you put the phone away and read instead. I nearly kissed you over it.']},
    {t:'Marry me, nerd.',r:['* She whacks you lightly with the rolled-up chart.','Ask me again when you’ve kept it up a month. I’m keeping count.']}]},
   {open:['* After hours at the Ministry. The corridors are empty and her office lamp is the only light on the floor.','Everyone else went home hours ago. I suppose that makes you my only witness.'],opts:[
    {t:'Witness to what?',r:['* She sets down her wand, loosens her robes at the collar and steps around the desk.','To me finally taking a break.']},
    {t:'Come home. The work will keep.',r:['It will. I’m not sure I will. Walk me out?','* She takes your arm at the door and doesn’t let go.']}]},
   {open:['I used to think discipline meant doing everything alone, perfectly, before anyone else.','* She closes her book and studies you.'],opts:[
    {t:'And now?',r:['Now I think it means showing up every day. Beside someone who does the same. You’re rather good at it, you know.']},
    {t:'You’re still the brightest witch I know.',r:['Flattery. Very effective flattery. Come here and say it closer.']}]},
   {open:['* A rainy evening by the Library fire. Hermione is curled in the armchair with a book she’s pretending to read.','I’ve read the same page four times. You’re terribly distracting, sitting there.'],opts:[
    {t:'Should I leave?',r:['Don’t you dare.','* She marks her page, sets the book aside and pulls you down beside her.']},
    {t:'Read it to me.',r:['* She reads aloud, slower and softer each page, until the book slips shut and her head rests on your chest.']}]}],
  gift:['Oh! You remembered I wanted this. You actually listen. That’s maddeningly attractive.','A gift? I had a whole schedule for today and you’ve just ruined it. Thank you.','This is perfect. I’m going to research exactly how to thank you properly.']},

 ana:{
  visit:[
   {open:['* Ana bursts out of the Guildhall with her wand in one hand and a fiddle in the other.','I enchanted this to play itself. Badly. Dance with me before it gets worse!'],opts:[
    {t:'Dance with her.',r:['* The fiddle squeaks, she spins you, and you both end up breathless and laughing against the wall.','See? Terrible music, perfect company.']},
    {t:'Fix the charm first.',r:['Boring! Correct, but boring. Fine. Then you owe me a dance, and I collect with interest.']}]},
   {open:['Truth or dare. Gryffindors always pick dare, so I’ll let you choose.','* She twirls her wand, grinning like trouble.'],opts:[
    {t:'Dare.',r:['I dare you to learn one new thing this week and show me. Then kiss me after. That second part’s non-negotiable.']},
    {t:'Truth.',r:['Coward! Okay. Truth: I come to the Guildhall early just to catch you. Your turn to blush.']}]},
   {open:['* She has three broomsticks, a sketchbook and a half-built model ship scattered across the Guildhall floor.','I start a new hobby every week. You actually stick with yours. It’s unfairly attractive.'],opts:[
    {t:'Pick one and I’ll do it with you.',r:['* She hands you the sketchbook, then sits close enough to steal your pencil.','Draw me. Flatter me. I’ll know if you don’t.']},
    {t:'Stick with me, then.',r:['Oh, smooth. Very smooth. Did you practice that? Because it worked.']},
    {t:'Teach me to fly.',r:['* On the broom she wraps her arms around your waist from behind.','Lean forward. Trust me. I won’t let you fall. Much.']}]},
   {open:['You read every night this week. Real books, not just a page. I checked your bookmark.','* She waggles the bookmark at you.'],opts:[
    {t:'You stole my bookmark?',r:['Borrowed. With love. I left you a note inside. Don’t read it in front of me, I’ll explode.']},
    {t:'Proud of me?',r:['Unreasonably. Come here, I’m giving you house points. Kisses count as house points.']}]},
   {open:['* Stars over the Guildhall roof. Ana conjures a little flock of glowing birds that circle your heads.','I used to do this to show off. Now I do it because I like seeing your face when I do.'],opts:[
    {t:'Do it again.',r:['* She does. Then she leans in and kisses you while you’re still looking up.','Gotcha. Brave of me, right?']},
    {t:'Show me how.',r:['* She guides your wand hand with hers, close enough to feel her heartbeat.','Swish, flick, and don’t look at me or you’ll lose focus.']}]}],
  gift:['For me? You’re trouble. The good kind. I love it.','Oh, this is brilliant! I’m showing it off to the whole Guildhall. And you with it.','A present? Right, now I have to top it. Prepare to be outdone.']},
};
