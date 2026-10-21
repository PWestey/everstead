// Cheers (task-completion pop-ups), fourth wave part H. See docs/WRITING-BRIEF.md, "Cheers".
// Emma: flirty, PG-13. Jubilee and Kamala: strictly platonic.
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Work ----------------
 emma:{
  cheers:[
   {open:['Two hours of real work. No phone, no tabs, no excuses. I checked, obviously.'],opts:[
    {t:'Same again tomorrow.',r:['Good. Consistency is so much more attractive than talent.']},
    {t:'You checked?',r:['Darling, I always check. You should be flattered I bothered.']}]},
   {open:['* Emma flicks a speck of lint off your collar.','You sent the hard email. No hedging, no “just checking in.” Finally.'],opts:[
    {t:'I’ll keep it sharp.',r:['Do. Sloppy emails are how empires fall. Ask any of my former rivals.']},
    {t:'It took me nine drafts.',r:['Nobody needs to know that. Except me. I already knew.']}]},
   {open:['You looked at the budget instead of hoping it would fix itself. How grown-up of you.'],opts:[
    {t:'Every week from now on.',r:['Mm. Keep talking like that and I may have to take you to dinner.']},
    {t:'It was terrifying.',r:['Numbers are only frightening until you rule them. Then they’re just furniture.']}]},
   {open:['You finished the thing you’d been avoiding. I felt the relief from across the Market. Loud thoughts, darling.'],opts:[
    {t:'Next one’s already on the list.',r:['* A slow, approving smile.','Now that is the man I invested in.']},
    {t:'Sorry for the noise.',r:['Don’t be. It was the most pleasant thing I heard all day.']}]}],
  codex:'You wrote this down, apparently in a clear-headed moment. Read it. Then act like the man who wrote it.',
  ack:'There you are. I knew you were in there somewhere.',
  done:{open:['Every task done. Not one loose end. I could almost kiss you for it.'],opts:[
   {t:'Tomorrow too.',r:['Then I’ll save the kiss for tomorrow. Gives you something to work toward.']},
   {t:'Almost?',r:['* She steps closer and straightens your collar, unhurried.','Almost. I like to leave a little room for negotiation.']}]},
 },

 // ---------------- Hobbies ----------------
 jubilee:{
  cheers:[
   {open:['* A tiny pink paff pops over your head.','You read a whole chapter! For fun! Look at you, Boss Man, being a nerd. Love it.'],opts:[
    {t:'Next chapter tomorrow.',r:['Yesss. And tell me what happens, I refuse to read it myself.']},
    {t:'Was the paff necessary?',r:['The paff is ALWAYS necessary. It’s basically confetti with attitude.']}]},
   {open:['You actually made something today instead of scrolling. That’s so cool. Like, actually cool.'],opts:[
    {t:'Making more tomorrow.',r:['Okay, but show me first. I wanna be your number one fan. Logan can be number two.']},
    {t:'It’s kind of ugly.',r:['Ugly-cool! That’s a whole style. The mall sells it for forty bucks.']}]},
   {open:['You practiced! Even though it was a weeknight and you were tired! Who even are you?'],opts:[
    {t:'Count me in again.',r:['Counting you in. Writing it down. In glitter pen. Permanent.']},
    {t:'A very tired dad.',r:['A tired dad who still did his thing. That’s, like, superhero stuff, dude.']}]},
   {open:['You played a game with the kids and didn’t even check your phone once. I was watching. Arcade-level focus.'],opts:[
    {t:'Rematch tomorrow.',r:['Ooh, rivalry. I love a family rivalry. I’m on the kids’ team, sorry.']},
    {t:'They destroyed me.',r:['Good! That means you’re raising little champions. Bring ’em to skee-ball.']}]}],
  codex:'Okay, okay, you wrote this one, Boss Man. Read it. It’s actually kinda good.',
  ack:'Heck yeah! That’s my guy.',
  done:{open:['Every single thing done today?! Okay, this calls for a big one. Cover your ears.'],opts:[
   {t:'Tomorrow too.',r:['* A burst of sparks lights up the sky.','Then tomorrow I’m bringing the big paffs too!']},
   {t:'Please don’t burn the village.',r:['No promises! Kidding. Mostly kidding. Small fireworks. Tiny. Promise.']}]},
 },

 // ---------------- Faith ----------------
 kamala:{
  cheers:[
   {open:['You prayed before checking your phone! That’s honestly the hardest part of the whole morning.'],opts:[
    {t:'Tomorrow too.',r:['Tomorrow too! I’ll try to beat you. Fair warning, my alarm is very loud.']},
    {t:'The phone was right there.',r:['I know, it’s like it calls your name. You won though. Point for you.']}]},
   {open:['* Kamala gives you an enthusiastic thumbs up that briefly embiggens to the size of a stop sign.','You read your scripture today! Okay, sorry, the hand thing just happens when I’m excited.'],opts:[
    {t:'Reading more tomorrow.',r:['Yes! My Abbu says a little every day beats a lot once a month. He’s annoyingly right.']},
    {t:'Big hand, big feelings.',r:['Exactly! That’s literally my whole power. Feelings, but bigger.']}]},
   {open:['You wrote down what you’re grateful for. My mom makes us do that at dinner. I used to groan. Now I kind of love it.'],opts:[
    {t:'I’m keeping it up.',r:['Awesome. I’m grateful you’re my friend, by the way. That one’s free.']},
    {t:'One was “coffee.”',r:['Coffee counts! Ammi’s chai is on my list every single day.']}]},
   {open:['You prayed with the kids tonight. Like, together. That’s the stuff they remember, I promise. I remember every one.'],opts:[
    {t:'We’ll do it again.',r:['Yes! Okay, I’m not crying. You’re crying. Nobody’s crying.']},
    {t:'They kept giggling.',r:['Same with me and Aamir. My dad pretended to be mad. He was not mad.']}]}],
  codex:'Hey, you wrote this one down. Read it again, slowly. Past-you was really onto something.',
  ack:'Yes! Okay, that was really cool. You’re doing great.',
  done:{open:['You did EVERYTHING today? Okay, that’s Carol-Danvers-level stuff. I’m putting it in my fan fic.'],opts:[
   {t:'Same again tomorrow.',r:['Then I’m writing a sequel. You’re getting a whole chapter.']},
   {t:'Make me sound cool.',r:['Obviously! You’re getting a cape. And a theme song. Maybe a sidekick.']}]},
 },
};
