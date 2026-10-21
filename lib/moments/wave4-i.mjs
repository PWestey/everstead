// Fourth-wave moments, part I: Family Anna, the vampyre of Morytania (visits and gifts).
// See docs/WRITING-BRIEF.md. Romantic and flirty, PG-13.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Anna (Discipline) ----------------
 vampanna:{
  visit:[
   {open:['* Anna has taken the darkest corner of the Library, curtains drawn, a candle burning and a book on Morytanian law open in her gloved hands.','You’re letting the sun in. Close the door, darling. Then come sit where I can see you.'],opts:[
    {t:'Sorry. Does it actually hurt?',r:['It stings. Like a bad review. I’ve survived four hundred years of both.']},
    {t:'You can see me fine from there.',r:['* She turns a page without looking down.','I can. I’d simply prefer to see you closer. Humor me.']}]},
   {open:['You put the phone face down at dinner. I counted. Eleven minutes before your hand drifted back.','In Darkmeyer that would be considered a feast of restraint. Here it’s a start.'],opts:[
    {t:'Eleven is a personal best.',r:['Then I’ll expect twelve tomorrow. I’m a patient woman, not an easy one.']},
    {t:'You were watching me eat?',r:['* A slow smile, all very white teeth.','Darling, I watch everyone eat. You were simply the most interesting.']}]},
   {open:['* Late. The candle is nearly a stub. Anna stands at the window, watching the village lights go out one by one.','In Canifis the werewolves howl at this hour. Here it’s just you, rattling around the pantry.'],opts:[
    {t:'I wasn’t in the pantry.',r:['You had crumbs on your shirt when you walked in. I notice things. Brush them off. Or let me.']},
    {t:'Just one snack. A small one.',r:['That’s what the Drakans say about the blood tithe. “Just a little, from each village.” It never stays little.']}]},
   {open:['The Drakans fill their cellars with whatever the villages are forced to give. I’ve never taken a drop I wasn’t offered.','People think that makes me weak. It’s the hardest thing I do every night, {name}.'],opts:[
    {t:'That’s not weak. That’s brave.',r:['* She looks at you for a long moment, and something in her face softens.','Careful. Say things like that and I’ll start believing them.']},
    {t:'Has anyone ever offered?',r:['* Her gaze drops, very briefly, to your collar.','Not yet. And don’t you dare. I like you far too much awake.']}]},
   {open:['* She closes her book and sets it on the table with the care of someone setting down a glass of very old wine.','You got up with the alarm this morning. First ring. No bargaining. I heard it through the wall.'],opts:[
    {t:'Barely. I wanted to throw it.',r:['* She sets the book aside. “Another kiss, darling. I find I’m in no hurry to say goodnight.”']},
    {t:'You were awake at six?',r:['I’m awake at every hour, darling. Six is just when I go to bed. You were my lullaby.']}]}],
  gift:[
   'A gift, freely given. How lovely. Come closer, darling. I would like to thank you without rushing.',
   'A gift, freely given. Do you know how rare that is where I’m from? Everything in Morytania is taken. I’ll keep this somewhere the sun can’t reach.',
   '* She leans in and kisses you, cool and unhurried, and pulls away exactly one heartbeat before you want her to. Restraint, she’d call it.']},
};
