// Fourth-wave moments, part E: Family Poppy (Fitness), Lulu (Hobbies) and Syl (Discipline) (visits and gifts).
// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Poppy (Fitness) ----------------
 poppy:{
  visit:[
   {open:['* Poppy sets her hammer against the wall and pulls out the chair beside her.','I’ve walked enough roads alone. I’d like company at dinner. Yours, specifically.'],opts:[
    {t:'I’d like that.',r:['Good. I picked somewhere quiet. I want to hear you without a whole tavern shouting over us.']},
    {t:'You’re asking me out?',r:['Yes.','I’ve had a long time to learn what I like. I like you.']}]},
   {open:['You kept up today. I enjoyed that. I’d enjoy a walk with you afterward, too.'],opts:[
    {t:'Lead the way.',r:['Come on, then. Take my hand. The invitation isn’t complicated.']},
    {t:'Without the hammer?',r:['It can stay here. I’m quite capable of choosing an evening for myself.']}]},
   {open:['* Poppy polishes the hammer carefully, then sets the cloth down.','I’ve spent years looking after someone else’s promise. I’d like to make a little room for this.'],opts:[
    {t:'For us?',r:['Yes. I’d like to find out what it’s like to come home looking forward to seeing you.']},
    {t:'You deserve that.',r:['I think so too.','That’s why I’m asking you to stay for a while.']}]},
   {open:['I thought we could walk somewhere neither of us has work to do.'],opts:[
    {t:'Sounds like a date.',r:['It is. I was hoping you’d recognize one when I planned it.']},
    {t:'Where are we going?',r:['Toward the river. After that, we can decide together. I like the sound of that.']}]},
   {open:['* Poppy offers you her hand before you leave.','I enjoyed tonight. I’d like another evening with you, and a kiss before this one ends.'],opts:[
    {t:'I’d like a kiss too.',r:['Come sit beside me, then.','That’s much better than guessing what we both want.']},
    {t:'Another evening, definitely.',r:['Good. I’ll make the time. I want this to have room to grow.']}]}],
  gift:[
   'You chose this for me. Thank you. Would you stay for dinner? I’d like that to be a date.',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 // ---------------- Lulu (Hobbies) ----------------
 lulu:{
  visit:[
   {open:['* Lulu sets two cups on the terrace table and sends Pix to inspect the garden.','I wanted a quiet evening with you. The garden can survive without my supervision.'],opts:[
    {t:'And without Pix’s opinions?',r:['Especially those. I’d rather hear what you think of me for a change.']},
    {t:'A date, then?',r:['Yes. I’ve had centuries to practice being mysterious. Tonight I’d rather be clear.']}]},
   {open:['I’ve been trying to read. You keep giving me a better reason to look up.'],opts:[
    {t:'Come sit beside me.',r:['I was hoping you’d ask. I might even remember what chapter I’m on tomorrow.']},
    {t:'Am I distracting you?',r:['Delightfully. Please continue at a slightly shorter distance.']}]},
   {open:['* Lulu puts away her paints, leaving the evening light on the terrace.','I’ve finished my work. I’d like to take you somewhere that stays open late.'],opts:[
    {t:'You know a place?',r:['Several. One has very good wine and nobody asking me to fix their weather.']},
    {t:'I’d like that.',r:['Good. I’ve been looking forward to having you to myself for a little while.']}]},
   {open:['I like surprising people. I’m finding I also like knowing you’ll be here.'],opts:[
    {t:'I like coming back.',r:['Then keep coming back. I’d like to have something to look forward to tomorrow as well.']},
    {t:'You could just ask me.',r:['Stay for dinner. There. That was much easier than an elaborate spell.']}]},
   {open:['* Lulu sets her cup down and offers you her hand.','I’d like to kiss you. No charm, no trick. I’m asking because I want to.'],opts:[
    {t:'I’d like that.',r:['Then come closer. I’ve been patient enough for one evening.']},
    {t:'I’m glad you asked.',r:['So am I. I know what I want. There’s no need to hide all of it behind mischief.']}]}],
  gift:[
   'You remembered. How lovely. Let me put this down so I can give you a proper thank-you kiss.',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 // ---------------- Syl (Discipline) ----------------
 syl:{
  visit:[
   {open:['* Syl settles into a woman’s form beside the Library window, her light soft in the evening.','I’ve kept enough company from the rafters. I’d like to sit beside you tonight.'],opts:[
    {t:'I saved you a place.',r:['I noticed. I was hoping it meant what I wanted it to mean.']},
    {t:'You mean a date?',r:['Yes. I’ve had a long life, and I can still choose something new.']}]},
   {open:['You keep your promises. I like that. I’d like one of them to be dinner with me.'],opts:[
    {t:'Tomorrow evening?',r:['Tomorrow evening. I’ll look forward to it. That’s rather the point of asking.']},
    {t:'I’d like that too.',r:['Good. Neither of us needs to pretend this is only about the books.']}]},
   {open:['* Syl takes the seat beside you and watches you put your work away.','I wanted your attention. Now I have it, I find I’d like to keep it a while.'],opts:[
    {t:'You have it.',r:['Then stay. Tell me something about your day that isn’t on a list.']},
    {t:'What did you want to ask?',r:['Whether you’d take a walk with me. And whether I might hold your hand while we do.']}]},
   {open:['* The Library has gone quiet. She remains beside you rather than drifting away.','I know what it means to choose someone’s company. I’m choosing yours tonight.'],opts:[
    {t:'I’m choosing yours too.',r:['I’m glad. I wanted to hear you say it in your own words.']},
    {t:'Stay with me.',r:['I will. I’ve been looking forward to this part of the evening.']}]},
   {open:['* She turns toward you, her hand offered rather than taken.','I like you. I’d like this to be a date, and I’d like to kiss you.'],opts:[
    {t:'I’d like that.',r:['Come closer. There’s no promise beyond tonight unless we both want one.']},
    {t:'Let’s have another evening too.',r:['Yes. I would like something with you to look forward to.']}]}],
  gift:[
   'You thought of me. I love that. I’d like an evening with you, too. Shall we call it a date?',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']}
};
