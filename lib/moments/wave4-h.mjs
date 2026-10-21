// Fourth-wave moments, part H: Family Emma, Jubilee and Kamala (visits and gifts). See docs/WRITING-BRIEF.md.
// Emma: romantic and flirty, PG-13. Jubilee and Kamala: STRICTLY PLATONIC, friend / little-sister energy.
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
   '* Emma turns it over once, inspecting it the way she’d inspect a merger, then sets it down very carefully.',
   'Well. You have taste after all. I was beginning to worry I’d have to teach that too.',
   '* She leans in and kisses your cheek, slow and cool, then murmurs against your ear. “Don’t tell anyone I liked it.”']},

 // ---------------- Jubilee (Hobbies) ----------------
 jubilee:{
  visit:[
   {open:['* Jubilee bursts into the Guildhall in her yellow coat, sunglasses on her head, a bag of pretzels in one hand.','Okay, Boss Man, you’ve got exactly one free hour and I have a plan. It involves skee-ball.'],opts:[
    {t:'I’m in.',r:['YES. Loser buys the slushies. Fair warning, I am a skee-ball prodigy. Logan won’t even play me anymore.']},
    {t:'I was going to read.',r:['Okay, fine, read. But read out loud, and do the voices. I’ll know if you skip the voices.']}]},
   {open:['You picked the guitar back up this week. I heard you through the wall. You were… getting there!'],opts:[
    {t:'Be honest.',r:['Honestly? First night was a cat fight. Last night was almost a song. That’s, like, huge progress, dude.']},
    {t:'Want a private concert?',r:['Obviously. I’ll do lights. Small paffs, I promise. Nobody’s eyebrows are at risk this time.']}]},
   {open:['* She snaps her fingers and a little shower of pink sparks fizzes over the table and pops out.','Ta-da. That’s what your face does when you finish a book, by the way. Little paffs.'],opts:[
    {t:'That’s weirdly sweet.',r:['I’m weirdly sweet! It’s my whole thing. That, and blowing stuff up. Both, really.']},
    {t:'Do it again.',r:['* She does, bigger, and a passing villager yelps.','Oops. Okay, that one was for me.']}]},
   {open:['Hey, so. Bring the kids to the mall Saturday? I’ll teach ’em air hockey. You can hold the coats like a dad.'],opts:[
    {t:'They’d love that.',r:['Duh. I’m the cool aunt now. It’s official. I’m having shirts made.']},
    {t:'I play air hockey too.',r:['Oh, you think you can take me? Okay, Boss Man. Okay. Saturday. Bring your A-game and tissues.']}]},
   {open:['* Jubilee is lying on the Guildhall floor staring at the rafters, chewing a straw.','Logan says hobbies are for people with time. Then he spent all Sunday whittling a duck. A duck!'],opts:[
    {t:'Was it a good duck?',r:['It was a GREAT duck. That’s the worst part. Don’t tell him I said that, he’ll get smug.']},
    {t:'So what’s your hobby?',r:['Besides bugging you? Roller skating. Arcade high scores. Making sure you actually do yours. Busy girl.']}]}],
  gift:[
   '* Jubilee shrieks, loud enough to turn heads across the Guildhall, and holds it up like a trophy.',
   'Are you kidding? This is the best thing anyone’s given me since Logan bought me a corn dog and didn’t complain about it.',
   '* She bumps your fist, then sets off one tiny celebratory paff over your head. “Thanks, Boss Man. Seriously.”']},

 // ---------------- Kamala (Faith) ----------------
 kamala:{
  visit:[
   {open:['* Kamala is on the Chapel steps with a notebook full of doodles and a backpack covered in Captain Marvel pins.','Oh! Hi! Sorry, I was writing. Don’t look. It’s fan fiction. It’s very good. Don’t look.'],opts:[
    {t:'I won’t look.',r:['Okay, thank you. Actually, wait, you can read the part where Carol saves a bus. That part’s perfect.']},
    {t:'Who’s it about?',r:['Carol Danvers, obviously. And the Avengers. And a cool new hero from Jersey City who is definitely not me.']}]},
   {open:['You prayed this morning before the kids woke up. I saw the light on. That’s the hardest one, honestly.'],opts:[
    {t:'It was quiet.',r:['Right? Fajr at my house is the only time nobody’s yelling. Even my brother Aamir is quiet. Kind of a miracle.']},
    {t:'I almost hit snooze.',r:['Same. Every single day. My mom says the blanket is the first test. I fail it like twice a week.']}]},
   {open:['* Her hand embiggens to the size of a door, very carefully, and she uses it to shade you both from the sun.','Sorry, it’s hot. Is this weird? This is a little weird.'],opts:[
    {t:'It’s actually great.',r:['Thank you! Bruno says it’s gross. Bruno doesn’t appreciate shade technology.']},
    {t:'A bit weird.',r:['* The hand shrinks back with a squishy noise.','Yeah, okay, fair. Super useful, low on dignity.']}]},
   {open:['My Abbu always says you don’t pray because you’re perfect. You pray because you’re not, and you keep coming back.','I was mad when he first said that. Now I kind of love it.'],opts:[
    {t:'Your dad sounds wise.',r:['He is! Don’t tell him I said so, he’ll get emotional and make everyone hug.']},
    {t:'Why were you mad?',r:['Because I wanted to be perfect first and then pray. Turns out that’s backwards. Big plot twist.']}]},
   {open:['Friday prayers are tomorrow, and then my mom’s making biryani. You should bring the kids for dinner. She’ll overfeed them.'],opts:[
    {t:'We’d love to come.',r:['Yes! Okay, warning, she will ask your kids about school for an hour and send you home with leftovers forever.']},
    {t:'How much overfeeding?',r:['Like, worrying amounts. Bring containers. Bring a wagon. I’m serious.']}]}],
  gift:[
   '* Kamala stares at it, then at you, and makes a sound that is mostly a squeak.',
   'For me? Seriously? Okay, this is going on my shelf right next to my signed Captain Marvel poster. That’s the top shelf. That’s VIP.',
   '* She gives you a quick, awkward side-hug and grins. “You’re a good guy, you know that? Like, actually.”']},
};
