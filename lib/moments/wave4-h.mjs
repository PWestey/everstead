// Fourth-wave moments, part H: Family Emma, Jubilee and Kamala (visits and gifts). See docs/WRITING-BRIEF.md.
// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Emma (Work) ----------------
 emma:{
  visit:[
   {open:['* Emma has claimed the best table at the Market, all white silk and a glass of something pale. She doesn’t look up from her tablet.','You’re late. Two minutes. I noticed, which means everyone noticed.'],opts:[
    {t:'Sorry. Inbox ambush.',r:['Then you answered it standing up. Sit. Nobody negotiates well while hovering like a waiter.']},
    {t:'You were counting?',r:['* She finally looks up, and the corner of her mouth moves.','Darling, I’m a telepath. I was counting before you left the house.']}]},
   {open:['You closed the laptop at six last night. On purpose. I was almost proud.','Don’t let it go to your head. One evening isn’t a habit.'],opts:[
    {t:'Two evenings, then.',r:['Look at you, negotiating. Two, then. Make it three and I’ll say something nice. Possibly.']},
    {t:'Almost proud?',r:['Almost. Pride is expensive, and I don’t spend it on one good Tuesday.']}]},
   {open:['* She turns her hand over and it shifts to diamond, light splitting off it in little rainbows across your papers.','I go like this when I need to think without feeling anything. Your report, by the way. Sloppy on page three.'],opts:[
    {t:'Fair. I rushed it.',r:['I know. Fix it tonight, not tomorrow. Tomorrow-you is always an optimist and always wrong.']},
    {t:'Can I touch it?',r:['* A pause. She lets you. Cold, flawless, and then warm again as the diamond melts back to skin under your fingers.','That was a privilege. Don’t make it weird.']}]},
   {open:['I ran Frost International at twenty-something with a board of old men who wanted me gone. They’re gone. I’m not.','You remind me of that version of me. Stubborn. Underpaid.'],opts:[
    {t:'Underpaid is accurate.',r:['Then ask. Clearly, with numbers, and without apologizing. You apologize far too much in emails.']},
    {t:'Is that a compliment?',r:['It’s the closest thing you’ll get before dinner. After dinner, we’ll see.']}]},
   {open:['* Late. The Market stalls are dark. Emma leans against a pillar, heels in one hand, and for once she looks tired.','Don’t read too much into this. I simply wanted company that doesn’t need to be taught anything.'],opts:[
    {t:'I can stay.',r:['* She hands you her shoes without a word, slips her arm through yours, and lets her head tip against your shoulder for exactly three steps.','Good. Walk me home. Slowly.']},
    {t:'Rough day at the school?',r:['Scott, four teenagers, and a fire alarm. I don’t want to talk about it. I want you to talk about anything else. Go.']}]}],
  gift:[
   'You listened. That is far rarer than good taste. Come closer, darling. I intend to thank you.',
   'Well. You have taste after all. I was beginning to worry I’d have to teach that too.',
   '* She leans in and kisses your cheek, slow and cool, then murmurs against your ear. “Don’t tell anyone I liked it.”']},

 // ---------------- Jubilee (Hobbies) ----------------
 jubilee:{
  visit:[
   {open:['* Jubilee finishes locking the studio and slips the keys into her jacket.','I’ve had enough noise for one day. Come have dinner with me. Somewhere I can hear you.'],opts:[
    {t:'I’d like that.',r:['Good. I’ve been looking forward to asking you since lunch.']},
    {t:'A date, then?',r:['Yes. I’m trying this thing where I say what I want instead of making you guess.']}]},
   {open:['You’ve been practicing. I like hearing the progress through the wall. I’d like to hear it from here.'],opts:[
    {t:'Stay and listen.',r:['Gladly. I like having a reason to sit this close to you.']},
    {t:'No criticism?',r:['Honest criticism. Though I’m pretty distracted by your smile right now.']}]},
   {open:['* A small spray of light fades over the terrace. Jubilee lowers her hand.','I’ve spent years making an entrance. I rather like not having to do that with you.'],opts:[
    {t:'You already have my attention.',r:['Good. I’d like to keep it for a while. Dinner tomorrow?']},
    {t:'I like the quiet part too.',r:['Then stay.','I’ve been wanting an evening that feels like this.']}]},
   {open:['I used to hide nerves under a lot of noise. Tonight I’m just going to say I’m glad you came.'],opts:[
    {t:'I’m glad you asked.',r:['Me too. Come sit beside me. I want to hear about your day.']},
    {t:'You look lovely.',r:['Thank you. I was rather hoping you would notice.']}]},
   {open:['* Jubilee walks you to the gate and keeps your hand in hers.','I had a good evening. I’d like another, and I’d like to kiss you.'],opts:[
    {t:'I’d like that.',r:['Come closer. I’m glad we finally stopped hinting at each other.']},
    {t:'Another evening, definitely.',r:['Good. I’ll make the time. I want more than one good night to remember.']}]}],
  gift:[
   'You remembered. I love it. I’d like to kiss you, if you’d like that too. No fireworks necessary.',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 // ---------------- Kamala (Faith) ----------------
 kamala:{
  visit:[
   {open:['* Kamala closes her notebook after evening prayers and joins you outside.','I’ve been wanting to ask you for a walk. As a date, if you’d like that.'],opts:[
    {t:'I’d like that.',r:['I’m glad. I kept looking for the perfect way to ask. Plainly seems to work.']},
    {t:'Where shall we go?',r:['Along the river. I’d like somewhere quiet enough to get to know you.']}]},
   {open:['I like the way you make time for what matters. I’d like to be part of your evening.'],opts:[
    {t:'You already are.',r:['I was hoping that’s what this meant. I wanted to hear you say it, though.']},
    {t:'Stay for tea.',r:['Gladly. I’ve been looking forward to talking with you all day.']}]},
   {open:['* Kamala sets two cups on the terrace table, then puts her phone away.','No interruptions. I’d like to give this evening my full attention.'],opts:[
    {t:'I’ll put mine away too.',r:['Thank you. I want to hear about the parts of your day that made you happy.']},
    {t:'You planned this for us?',r:['Yes.','I like you. Planning a date seemed better than waiting for you to guess.']}]},
   {open:['* She watches the last light on the river, her hand resting beside yours.','My faith matters to me. So does being honest about what I want from someone.'],opts:[
    {t:'What do you want?',r:['Time to know you properly. And another date, if tonight means the same thing to you.']},
    {t:'You can be honest with me.',r:['Then I’d like to hold your hand. I’ve been thinking about asking all evening.']}]},
   {open:['I’ve enjoyed tonight. I’d like to see you again. May I kiss you before you go?'],opts:[
    {t:'I’d like that.',r:['Come closer. I’m glad we called this a date.']},
    {t:'I’d like another evening too.',r:['So would I. Let’s pick a day, rather than leaving it to chance.']}]}],
  gift:[
   'You remembered. That means a lot. Would you stay for tea? I’d like to ask you on a proper date.',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},
};
