// Cheers (task-completion pop-ups), fourth wave part E: Poppy (Fitness), Lulu (Hobbies), Syl (Discipline).
// See docs/WRITING-BRIEF.md, "Cheers". STRICTLY PLATONIC: cheerful friends who cheer him on.
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Fitness ----------------
 poppy:{
  cheers:[
   {open:['* Poppy drops her hammer with a thud and claps.','You finished the workout! The whole thing! Even the last set that looked really mean.'],opts:[
    {t:'Next swing.',r:['Yes! Next swing! Okay, I’m stealing that. Hammer and I are saying it now.']},
    {t:'The last set was mean.',r:['So mean. I’d have bonked it with the hammer. You just did it instead.']}]},
   {open:['You went for a walk when you could’ve sat on the couch. That’s how I got here, you know. One walk at a time. Very long walk.'],opts:[
    {t:'Tomorrow too.',r:['Then I’ll walk with you. My legs are short, so leave early.']},
    {t:'Couch was calling.',r:['Couches are sneaky. They look soft. Then it’s three hours later.']}]},
   {open:['You stretched afterward! Most heroes in stories never stretch. That’s why they get hurt in act two.'],opts:[
    {t:'Every time.',r:['Good. Your knees just thanked you. I heard it. Little creaky thank-you.']},
    {t:'Am I a hero now?',r:['Ha! Don’t get a big head. But… maybe a little bit. Don’t tell the hammer.']}]},
   {open:['You worked out tired. I could tell. You made the face I make when I carry the hammer up a hill.'],opts:[
    {t:'Count me in again.',r:['Counted! I wrote it on the fence. There’s a lot of marks on the fence now.']},
    {t:'I need a snack.',r:['Earned! I have a carrot. It’s a little bit squashed. It’s yours.']}]}],
  codex:'You wrote this down for yourself. I’m just delivering it. Read it!',
  ack:'Yes! That’s it. You keep carrying it, I’ll keep cheering.',
  done:{open:['Every daily, done! I’d carry you around the Yard on the hammer but you’re very big. Want a high five instead?'],opts:[
   {t:'Same again tomorrow.',r:['Same again! I’ll be at the gate early. With the hammer. Obviously.']},
   {t:'High five.',r:['* Her high five nearly knocks you over.','Oops. Strong arms. Sorry! Great day, though!']}]}},

 // ---------------- Hobbies ----------------
 lulu:{
  cheers:[
   {open:['You read tonight! Pix saw you turn the pages. He thinks books are tiny paper houses. He’s not totally wrong.'],opts:[
    {t:'One more chapter tomorrow.',r:['Yay! Pix is already guessing what happens. He thinks a pancake is the villain.']},
    {t:'It was a slow chapter.',r:['Slow chapters are where the story naps. It’ll wake up soon. They always do.']}]},
   {open:['* Purple sparkles burst over your head.','You made something! With your hands! Can I make it bigger? Just a little?'],opts:[
    {t:'Count me in for more.',r:['More! More things! The village is going to be so full of your stuff. I love it.']},
    {t:'Please don’t make it bigger.',r:['Okay. Medium, then. Kidding! Mostly. Pix says I’m kidding.']}]},
   {open:['You practiced your song. It sounded like a happy duck. That’s a compliment! Ducks are wonderful.'],opts:[
    {t:'Tomorrow too.',r:['Then tomorrow it’ll sound like a happy goose. That’s even bigger!']},
    {t:'A duck?',r:['A very talented duck. Pix danced. Pix doesn’t dance for just anybody.']}]},
   {open:['You learned something new today just because you wanted to. That’s the best reason. That’s my only reason!'],opts:[
    {t:'Next thing tomorrow.',r:['Ooh, pick something weird. Weird things are the most fun to learn.']},
    {t:'My brain is full.',r:['Brains stretch! Like taffy. Go to sleep and let it get stretchy.']}]}],
  codex:'Pix found this in your notes! You wrote it yourself. Read it out loud. In a funny voice.',
  ack:'Hooray! Pix is doing a little loop. That means yes.',
  done:{open:['Every daily, done! That deserves a party. A small one. A medium one. Okay, I’m making the cake huge.'],opts:[
   {t:'Same again tomorrow.',r:['Yes! And we’ll have leftover cake. Huge leftover cake.']},
   {t:'Can the kids come?',r:['Of course! Kids are the best at cake. Bring them all!']}]}},

 // ---------------- Discipline ----------------
 syl:{
  cheers:[
   {open:['* A ribbon of light loops around your head.','You put the phone down when you said you would. Exactly when! I was counting.'],opts:[
    {t:'I keep my word.',r:['You do! That’s my favorite sentence in any language. Say it again tomorrow.']},
    {t:'It kept buzzing.',r:['Let it buzz. Buzzing isn’t a promise. You are.']}]},
   {open:['You got up on the first alarm! No snooze! I didn’t even have to make my scary noise.'],opts:[
    {t:'Tomorrow too.',r:['Then I’ll save the scary noise for Kaladin. He deserves it more.']},
    {t:'What’s your scary noise?',r:['It’s sort of a tea kettle and a seagull. Very effective. Don’t make me use it.']}]},
   {open:['You did the boring thing first. The one you always put off. I saw you sigh and then just start.'],opts:[
    {t:'Count me in again.',r:['Counted. I keep a list. It’s getting long. That’s a good thing!']},
    {t:'It really was boring.',r:['So boring. I turned into a leaf to stay awake. You did it anyway. That’s the whole trick.']}]},
   {open:['You went to bed on time. Humans need so much sleep. It’s strange. But you said you would, and you did.'],opts:[
    {t:'Same time tomorrow.',r:['I’ll be on the windowsill. Not watching! Just… nearby. Glowing.']},
    {t:'I wanted one more episode.',r:['I know. You stared at the screen like it owed you money. You still turned it off.']}]}],
  codex:'You made a promise to yourself and wrote it here. I remember promises. Read it.',
  ack:'Good. I heard that. Spren never forget a promise, you know.',
  done:{open:['Every daily, done. Every single promise for today, kept. I might actually burst. Can spren burst?'],opts:[
   {t:'Same again tomorrow.',r:['Then it’s a promise. And I’ll be right here to make sure. Happily.']},
   {t:'Please don’t burst.',r:['* She spins into a tiny shower of light and reforms, giggling.','Close one. Good day, {name}. A really good one.']}]}}
};
