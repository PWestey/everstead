// Fellow moments, wave 2 batch C: pop-ups when the player levels a Fellow (every 5th level) or gives him a star.
// Shape: {open:[lines], opts?:[{t, r:[lines]}]}. Lines starting "* " are narration.

/** @type {Record<string,{level:any[],star:any[]}>} */
export const FELLOW_MOMENTS={
 // ---------------- Rocket (Hobbies) ----------------
 rocket:{
  level:[
   {open:['* Rocket is sprawled under a half-built contraption in the Guildhall, only his tail sticking out.','That you? Pass me the thing. The shiny thing. No, the other shiny thing. Good. You’re learning.'],
    opts:[
     {t:'What is it this time?',r:['A toaster. That also flies. And maybe shoots. Still deciding. That’s the fun part.']},
     {t:'Should I be worried?',r:['Always. But not about this. Probably.']}]},
   {open:['* He tosses you a lumpy little gadget with a single blinking light.','Made you a bookmark. It beeps when you’ve been away from the book too long. You’re welcome.']},
   {open:['You know what I like about you? You pick stuff up and actually stick with it. Most people quit at the boring middle.','The boring middle is where the good stuff gets built.'],
    opts:[
     {t:'The boring middle is boring.',r:['Yeah. That’s why only stubborn people get through it. Congrats, you’re stubborn.']},
     {t:'Learned that from you.',r:['Obviously. I’m a great influence. Don’t check with anybody on that.']}]},
   {open:['* Rocket squints at your hobby log, scribbled on the back of a schematic.','Huh. That’s a lot of days in a row, {name}. Keep it up and I might have to stop calling you rookie.']},
  ],
  star:[
   {open:['A star? For me? What am I supposed to do with that?','* He pockets it immediately and very carefully.','Don’t tell anybody. I’ve got a reputation.']},
   {open:['* Rocket sets down his tools and, for once, just watches you work on your own project.','You’re doing that part wrong. No, keep going. Doing it wrong is how you find out what right looks like.'],
    opts:[
     {t:'Show me how you’d do it.',r:['Nah. Then it’d be mine. Figure it out. You will. I’ve seen you.']},
     {t:'Thanks for not taking over.',r:['Took everything I had, pal. Everything.']}]},
   {open:['People see the raccoon and think pest. Took me a long time to stop caring.','You see a guy who builds stuff. I noticed that. Just so you know. Not a big deal.']},
   {open:['* He hands you a small wooden figure, carved rough, of a tree with a tiny face.','Made it for my buddy once. Made a spare. He’d want you to have it. Don’t ask why I made a spare.'],
    opts:[
     {t:'I am honored.',r:['* Rocket blinks hard and looks away.','Yeah, well. He says that a lot too. Different words. Same thing.']},
     {t:'Why did you make a spare?',r:['I said don’t ask. I always make a spare. Things break. People leave. Spares help.']}]},
   {open:['* Late night in the Guildhall. The tools are quiet. Rocket sits on the bench beside you, legs swinging.','I built a lot of stuff to feel like I mattered. Guns, ships, bombs. Turns out the best thing I ever built was a family.','You’re in it now, {name}. No take-backs. I checked the warranty.'],
    opts:[
     {t:'No take-backs.',r:['* He bumps your shoulder with his.','Good. Now hand me that wrench before I say something sappy.']},
     {t:'You’re a big softie, Rocket.',r:['Say that again and I wire your boots to a battery. …I’m kidding. Mostly. Get some sleep.']}]},
  ],
 },
};
