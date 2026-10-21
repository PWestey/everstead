// Fellow moments, wave 2 batch C: pop-ups when the player levels a Fellow (every 5th level) or gives him a star.
// Shape: {open:[lines], opts?:[{t, r:[lines]}]}. Lines starting "* " are narration.

/** @type {Record<string,{level:any[],star:any[]}>} */
export const FELLOW_MOMENTS={
 // ---------------- Rocket (Hobbies) ----------------
 rocket:{
  level:[
   {open:['* Rocket is sprawled under a half-built contraption in the Guildhall. Only his tail is sticking out.','That you? Pass me the thing. The shiny thing. No, the OTHER shiny thing. There ya go. Quill never gets that right.'],
    opts:[
     {t:'What is it this time?',r:['A toaster. That flies. Might shoot. Haven’t decided. Deciding’s the fun part.']},
     {t:'Should I be worried?',r:['Always. Not about this, though. Probably. Stand a little further back.']}]},
   {open:['* He tosses you a lumpy little gadget with one blinking light.','Made you a bookmark. Beeps if you ignore your book too long. Gets louder every day. You’re welcome.']},
   {open:['Know what I like about you? You pick a thing up and actually keep at it. Most people bail the second it gets boring.','The boring part’s where the good stuff gets built. Ask anybody who’s rewired a ship at three in the morning.'],
    opts:[
     {t:'The boring part is boring, though.',r:['Yeah. That’s why only stubborn jerks get through it. Congrats, you’re a stubborn jerk.']},
     {t:'Learned that from you.',r:['Obviously. I’m a great influence. Don’t ask Quill. Or Gamora. Or Drax. Or anybody.']}]},
   {open:['* Rocket squints at your hobby log, scribbled on the back of one of his schematics.','Huh. That’s a lotta days in a row, {name}. Keep it up and I gotta stop calling you rookie. Which I’ll hate.']},
  ],
  star:[
   {open:['A star? For me? What am I supposed to do with that?','* He pockets it immediately, and very carefully.','Don’t tell anybody. I got a reputation.']},
   {open:['* Rocket puts his tools down and, for once, just watches you work on your own project.','You’re doing that wrong. No, keep going. Doing it wrong is how you find out what right looks like.'],
    opts:[
     {t:'Show me how you’d do it.',r:['Nah. Then it’s mine. Figure it out. You will. I’ve seen ya.']},
     {t:'Thanks for not taking over.',r:['Took everything I had, pal. Everything. Look, my paws are shaking.']}]},
   {open:['People see a raccoon and think trash panda. Took me a long time to stop wanting to shoot ’em for it.','You look at me and see a guy who builds stuff. I noticed. Just sayin’. Not a big deal. Shut up.']},
   {open:['* He hands you a little wooden figure, roughly carved: a tree with a tiny face.','Made it for my buddy once. Made a spare. He’d want you to have it. Don’t ask why I made a spare.'],
    opts:[
     {t:'I am honored.',r:['* Rocket blinks hard and looks away.','Yeah, well. Three words. He only ever used three words too. Same thing, really.']},
     {t:'Why did you make a spare?',r:['I said don’t ask. I always make a spare. Stuff breaks. People leave. Spares help.']}]},
   {open:['* Late night in the Guildhall. The tools are quiet. Rocket sits on the bench next to you, legs swinging.','I built a lotta stuff to feel like I mattered. Guns. Ships. A bomb or twelve. Best thing I ever built was a family, and I didn’t even need a wrench.','You’re in it now, {name}. No take-backs. I checked the warranty.'],
    opts:[
     {t:'No take-backs.',r:['* He bumps your shoulder with his.','Good. Now hand me that wrench before I say something sappy.']},
     {t:'You’re a big softie, Rocket.',r:['Say that again and I wire your boots to a battery. …Kidding. Mostly. Go to bed.']}]},
  ],
 },
};
