// Cheers (task-completion pop-ups), fourth wave part H. See docs/WRITING-BRIEF.md, "Cheers".
// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Work ----------------
 emma:{
  cheers:[
   {open:['Two hours of real work. No phone, no tabs, no excuses. I checked, obviously. Now look up, darling. I’ve waited long enough for your attention.'],opts:[
    {t:'Same again tomorrow.',r:['Good. Consistency is so much more attractive than talent.']},
    {t:'You checked?',r:['Darling, I always check. You should be flattered I bothered.']}]},
   {open:['* Emma flicks a speck of lint off your collar.','You sent the hard email. No hedging, no “just checking in.” Finally. Decisive. I like that. Apply it to asking me to dinner.'],opts:[
    {t:'I’ll keep it sharp.',r:['Do. Sloppy emails are how empires fall. Ask any of my former rivals.']},
    {t:'It took me nine drafts.',r:['Nobody needs to know that. Except me. I already knew.']}]},
   {open:['You looked at the budget instead of hoping it would fix itself. How grown-up of you. Put the figures away. I’d rather you appreciated the woman opposite you.'],opts:[
    {t:'Every week from now on.',r:['Mm. Keep talking like that and I may have to take you to dinner.']},
    {t:'It was terrifying.',r:['Numbers are only frightening until you rule them. Then they’re just furniture.']}]},
   {open:['You finished the thing you’d been avoiding. I felt the relief from across the Market. Loud thoughts, darling. You have my undivided attention. I do not offer that casually.'],opts:[
    {t:'Next one’s already on the list.',r:['* A slow, approving smile.','Now that is the man I invested in.']},
    {t:'Sorry for the noise.',r:['Don’t be. It was the most pleasant thing I heard all day.']}]}],
  codex:'You wrote this down, apparently in a clear-headed moment. Read it. Then act like the man who wrote it.',
  ack:'There you are. I knew you were in there somewhere.',
  done:{open:['Close the laptop, darling. I’ve been very patient about sharing you with it. My turn.'],opts:[
   {t:'Tomorrow too.',r:['Then I’ll save the kiss for tomorrow. Gives you something to work toward.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She steps close enough to lower her voice. “There. Now you’re giving me exactly the attention I wanted.”']}]},
 },

 // ---------------- Hobbies ----------------
 jubilee:{
  cheers:[
   {open:['* She sets her own work aside and turns toward you.','You read a chapter for fun. I’d like to hear what you thought. Dinner would give us plenty of time.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me outside the studio. I’ve got dinner plans, and they involve you.']}]},
   {open:['You made something instead of scrolling. I like the look on your face when you show me what you’ve finished.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me outside the studio. I’ve got dinner plans, and they involve you.']}]},
   {open:['You practiced after a long workday. Come find me when you’re done. I’ve been looking forward to seeing you.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me outside the studio. I’ve got dinner plans, and they involve you.']}]},
   {open:['You played with the kids and left the phone alone. I like your full attention. I’d enjoy a little of it tonight.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me outside the studio. I’ve got dinner plans, and they involve you.']}]}],
  codex:'Okay, okay, you wrote this one, Boss Man. Read it. It’s actually kinda good.',
  ack:'Heck yeah! That’s my guy.',
  done:{open:['All done? I’ve booked dinner. Just you and me, and enough time to find out what this feels like.'],opts:[
   {t:'Tomorrow too.',r:['* A burst of sparks lights up the sky.','Then tomorrow I’m bringing the big paffs too!']},
   {t:'I’d like that. Stay with me.',r:['* She takes your hand and smiles. “I wanted a date. I want another. And I’d really like to kiss you.”']}]},
 },

 // ---------------- Faith ----------------
 kamala:{
  cheers:[
   {open:['You prayed before opening your phone. I understand how much that quiet matters. Come walk with me afterward.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['I’d like that. Let’s take a walk after evening prayers.']}]},
   {open:['* She sets her own work aside and turns toward you.','You read your scripture today. I’d like to hear what stayed with you. I’ve been looking forward to talking tonight.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['I’d like that. Let’s take a walk after evening prayers.']}]},
   {open:['You wrote down what you’re grateful for. You’ve been on my mind, too. I thought I should tell you.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['I’d like that. Let’s take a walk after evening prayers.']}]},
   {open:['You prayed with the kids. Those memories matter. When the evening settles, I’d like a little time with you.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['I’d like that. Let’s take a walk after evening prayers.']}]}],
  codex:'Hey, you wrote this one down. Read it again, slowly. Past-you was really onto something.',
  ack:'Yes! Okay, that was really cool. You’re doing great.',
  done:{open:['Everything finished. Come walk with me. I want to spend the evening getting to know you better.'],opts:[
   {t:'Same again tomorrow.',r:['Then I’m writing a sequel. You’re getting a whole chapter.']},
   {t:'I’d like that. Stay with me.',r:['* She leaves her hand in yours, smiling. “I like you. I’m glad we called this a date.”']}]},
 },
};
