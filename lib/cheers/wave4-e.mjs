// Cheers (task-completion pop-ups), fourth wave part E: Poppy (Fitness), Lulu (Hobbies), Syl (Discipline).
// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Fitness ----------------
 poppy:{
  cheers:[
   {open:['* She sets her own work aside and turns toward you.','You finished the last set. I noticed you wanted to stop. Come sit beside me while you catch your breath.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Come sit with me. I’d like to get to know you outside the Yard.']}]},
   {open:['You went for a walk instead of staying in. I’ve covered a lot of ground that way. I’d like to share a route with you.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Come sit with me. I’d like to get to know you outside the Yard.']}]},
   {open:['You stretched afterward. I learned that lesson over a long life of travel. I’d like to keep walking beside you.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Come sit with me. I’d like to get to know you outside the Yard.']}]},
   {open:['You trained on a tired day. I respect that. I’m also looking forward to seeing you when neither of us has work left.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Come sit with me. I’d like to get to know you outside the Yard.']}]}],
  codex:'You wrote this down for yourself. I’m just delivering it. Read it!',
  ack:'Yes! That’s it. You keep carrying it, I’ll keep cheering.',
  done:{open:['Everything finished? I’ve put the hammer away. Come spend the evening with me. I’d like your company.'],opts:[
   {t:'Same again tomorrow.',r:['Same again! I’ll be at the gate early. With the hammer. Obviously.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She meets your eyes with a steady smile. “I’d like to kiss you. I can ask for what I want.”']}]}},

 // ---------------- Hobbies ----------------
 lulu:{
  cheers:[
   {open:['You read tonight. I’m curious what kept you turning pages. Come sit beside me and tell me.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Find me on the terrace. I’ll send Pix ahead so we can actually talk.']}]},
   {open:['* She sets her own work aside and turns toward you.','You made something with your hands. I like watching you concentrate. It makes distracting you terribly tempting.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Find me on the terrace. I’ll send Pix ahead so we can actually talk.']}]},
   {open:['You practiced the song. I heard the part you finally got right. I’d like to hear the next one from the seat beside you.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Find me on the terrace. I’ll send Pix ahead so we can actually talk.']}]},
   {open:['You learned something because you wanted to. Centuries of curiosity, and I still find that attractive. Come talk to me.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Find me on the terrace. I’ll send Pix ahead so we can actually talk.']}]}],
  codex:'Pix found this in your notes! You wrote it yourself. Read it out loud. In a funny voice.',
  ack:'Hooray! Pix is doing a little loop. That means yes.',
  done:{open:['The day’s finished. I’ve sent Pix ahead. Come have dinner with me. I’d like you to myself for a while.'],opts:[
   {t:'Same again tomorrow.',r:['Yes! And we’ll have leftover cake. Huge leftover cake.']},
   {t:'I’d like that. Stay with me.',r:['* She takes your hand, smiling. “I know what I want tonight. Your company, and another kiss if you’d like.”']}]}},

 // ---------------- Discipline ----------------
 syl:{
  cheers:[
   {open:['* She sets her own work aside and turns toward you.','You put the phone away when you said you would. I noticed. I’d like some of the evening you’ve made room for.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Walk with me. I’d like your company, freely chosen.']}]},
   {open:['You got up on the first alarm. I like knowing you keep your word. I’d like one of your plans to be a date with me.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Walk with me. I’d like your company, freely chosen.']}]},
   {open:['You did the difficult thing first. Now you have a little time. Would you spend some of it beside me?'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Walk with me. I’d like your company, freely chosen.']}]},
   {open:['You went to bed when you planned. Before you go tonight, come say goodnight. I was hoping for a kiss.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Walk with me. I’d like your company, freely chosen.']}]}],
  codex:'You made a promise to yourself and wrote it here. I remember promises. Read it.',
  ack:'Good. I heard that. Spren never forget a promise, you know.',
  done:{open:['Promises kept. Come walk with me. I want to spend some time with you that isn’t about reminding you of anything.'],opts:[
   {t:'Same again tomorrow.',r:['Then it’s a promise. And I’ll be right here to make sure. Happily.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She settles beside you, her smile warm. “I like you. I’d rather tell you than make you keep guessing.”']}]}}
};
