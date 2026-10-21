// Cheers (task-completion pop-ups), fourth wave part I. See docs/WRITING-BRIEF.md, "Cheers".
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Discipline ----------------
 vampanna:{
  cheers:[
   {open:['* Anna glances up from her book, one eyebrow raised.','Phone in the other room all evening. You didn’t even go check it “just once.” I’m impressed, and I don’t impress easily.'],opts:[
    {t:'Tomorrow too.',r:['Then I’ll be watching tomorrow too. From a respectable distance. Mostly.']},
    {t:'I checked it with my eyes.',r:['Staring at the door isn’t opening it, darling. I’ve stared at a lot of doors.']}]},
   {open:['Up on the first alarm. No snooze, no bargaining. In Canifis even the werewolves can’t manage that.'],opts:[
    {t:'First ring, every day.',r:['Bold promise. I’ll hold you to it, and I have a very long memory.']},
    {t:'I bargained a little. Internally.',r:['Internally is allowed. The Drakans bargain out loud. That’s the difference between us.']}]},
   {open:['* She closes the pantry door you left open, slowly, with one gloved finger.','You walked away from the midnight snack. I heard you think about it. Loudly.'],opts:[
    {t:'I’ll keep walking away.',r:['Good. Hunger’s a liar. I’ve listened to mine for four centuries and it’s never once been right.']},
    {t:'It was leftover pizza.',r:['* A small, wicked smile.','Then your restraint is even more attractive than I thought.']}]},
   {open:['You sat down, did the hard thing, and didn’t wander off. A whole hour. I timed it by the candle.'],opts:[
    {t:'Count me in tomorrow.',r:['I’ll light a fresh candle. A long one. Don’t make me waste it.']},
    {t:'I wandered off in my head.',r:['So long as your feet stayed put. Minds wander. Mine wanders to you, regrettably often.']}]}],
  codex:'Your own words, written on a night you meant them. Read them slowly. I’ll wait. I’m very good at waiting.',
  ack:'There he is. Steady hands, steady will. Come here.',
  done:{open:['Everything done, and the sun’s barely down. Come sit by my candle. I saved you the chair out of the draft.'],opts:[
   {t:'Same again tomorrow.',r:['I know. That’s what makes you dangerous, darling. You keep your word.']},
   {t:'Just you and the candle.',r:['* She draws the curtains and pats the cushion beside her.','Then sit close. I promise to behave. Within reason.']}]}},
};
