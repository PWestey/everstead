// Fourth-wave moments, part F: Family Anna, Elsa and Helen (visits and gifts).
// See docs/WRITING-BRIEF.md. Romantic and flirty, PG-13. Anna and Helen are married in canon: keep it warm and teasing.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Anna (Marriage) ----------------
 anna:{
  visit:[
   {open:['* Anna is at a Rose Café table with three plates of chocolate in front of her and a guilty look.','Okay, before you say anything, these are research. For a date night. Not mine. Yours. Sort of mine. Sit down.'],opts:[
    {t:'Research, huh?',r:['Very serious research. Kristoff says I “research” every dessert in the kingdom. He’s not wrong. Try the dark one.']},
    {t:'Whose date night?',r:['Yours! With your wife! Obviously. I just like being near the planning part. It’s the best part. Well, second best.']}]},
   {open:['You took her out tonight. Actually out. Phone in your pocket the whole time? Don’t lie, I have a sister who can tell.'],opts:[
    {t:'Whole time. I swear.',r:['* Anna squeals and grabs both your hands across the table.','Yes! That’s it! That’s the whole trick! You just look at them like they’re the only person in the room.']},
    {t:'Mostly the whole time.',r:['Mostly. Hmm. Kristoff once checked on Sven during our anniversary dinner. Twice. I forgave him. Eventually. Do better.']}]},
   {open:['* Late. The café is empty except for Anna, curled in a chair by the window with a cup of cocoa and her boots off.','Come sit. I can’t sleep. Olaf told me a story about summer and now I’m all wound up.'],opts:[
    {t:'What was the story?',r:['Honestly? I lost track. Something about a sandcastle with feelings. He’s very sweet. Very long-winded.']},
    {t:'Is that cocoa for two?',r:['* She slides the mug toward you, then pulls it back with a grin.','Half. You get half. I’m a queen, I’m very generous, but I’m not a saint.']}]},
   {open:['You know what I learned the hard way? The guy who sweeps you off your feet in one night is usually not the one.','The one is the guy who comes back every day with a sled and a reindeer that smells weird. That’s love. Smelly, loyal love.'],opts:[
    {t:'Kristoff’s a lucky man.',r:['* She goes pink right up to her braids.','He is. Don’t tell him I said so, his head’s big enough. You’re pretty lucky too, you know. She picked you.']},
    {t:'Did Sven really smell?',r:['Oh, SO bad. Still does. I love him. I also keep a window open. Marriage is compromise!']}]},
   {open:['* Anna fixes your collar, then keeps her hands there a beat too long, then jumps back like she touched a stove.','Sorry! Habit. I do that to Kristoff. You just had a, there was a, it was crooked. It’s fine now. You look nice.'],opts:[
    {t:'You’re blushing.',r:['* She stays close after the dance. “I want another kiss. I’m being very clear. It feels rather good.”']},
    {t:'Thanks. You look nice too.',r:['* She laughs, flustered, and tucks a strand of hair behind her ear.','Okay, wow. Now I see why she married you. Go home and say that to her.']}]}],
  gift:[
   'You remembered. I love it. And I’d very much like to kiss you before I say twelve more things.',
   'For me? Really? Nobody gives the queen anything, they just give her paperwork. I love it. I love you. Not like that. Okay, a little like that.',
   '* She throws her arms around your neck and plants a quick kiss on your cheek, then pulls back, laughing. “Don’t tell Kristoff. Actually, tell him. He should step it up.”']},

 // ---------------- Elsa (Discipline) ----------------
 elsa:{
  visit:[
   {open:['* Elsa sits alone at a Library table, a single snowflake turning slowly above her open palm.','Twenty minutes. I hold it still for twenty minutes every morning. It used to be ten seconds.'],opts:[
    {t:'Twenty minutes. Every day?',r:['Every day. Including the days I don’t want to. Especially those, actually.']},
    {t:'Can I try?',r:['* A faint smile. She lets the flake drift onto the back of your hand, where it doesn’t melt.','There. Don’t move. See how long you last.']}]},
   {open:['You left the phone in the other room last night. I heard you didn’t even go looking for it.'],opts:[
    {t:'Took everything I had.',r:['I believe it. I spent years with my hands in gloves so I wouldn’t touch anything. You’re doing it the better way.']},
    {t:'Who told you?',r:['Anna. Anna tells me everything. Usually before I ask, and often while I’m trying to read.']}]},
   {open:['* Night. The Library is cold, and it isn’t the weather. Elsa stands at the window, frost feathering the glass where her fingers rest.','Sorry. It gets away from me when I’m tired. Less than it used to.'],opts:[
    {t:'I don’t mind the cold.',r:['* She glances back at you, and the frost on the glass softens into delicate little ferns.','You keep saying things like that. I’m starting to think you mean them.']},
    {t:'What helps?',r:['Routine. Sleep. Not pretending I’m fine when I’m not. And sometimes company.']}]},
   {open:['People think control means holding everything in. I tried that. I froze a whole kingdom.','It’s practice. Small things, done every day, until the big thing listens to you.'],opts:[
    {t:'Small like what?',r:['Making the bed. Walking before breakfast. Putting the book down when I said I would. Boring things. They add up.']},
    {t:'A whole kingdom, though.',r:['In July. Yes. I’m aware. Anna brings it up at every family dinner.']}]},
   {open:['* Elsa steps close, close enough that you can feel the chill coming off her, and straightens a book on the shelf behind your head.','You’ve been steady lately. I notice steady. I don’t get to see it very often.'],opts:[
    {t:'You’re pretty steady yourself.',r:['* She holds your gaze for a long, quiet moment.','* She leaves her hand in yours. “I want to kiss you. I’m tired of hoping you’ll guess.”']},
    {t:'You’re standing very close.',r:['I am. Is that a problem? I can step back.','* She doesn’t step back.']}]}],
  gift:[
   'You remembered. Thank you. I’d like to take your hand for a moment, if that’s all right.',
   'You didn’t have to. I’m not used to people giving me things. Usually they give me room. This is nicer.',
   '* She brushes a cool fingertip along your jaw, and a single perfect snowflake settles on your collar. “Keep that. It won’t melt unless I let it.”']},

 // ---------------- Helen (Fatherhood) ----------------
 helen:{
  visit:[
   {open:['* Helen is at the Hearth Inn with one arm stretched clear across the room to grab a teapot, the other packing three lunches at once.','Don’t mind me. School run in ten. Somebody always forgets their shoes. It’s usually the fast one, ironically.'],opts:[
    {t:'Need a hand?',r:['I’ve got plenty of hands. Reach, actually. But sit and talk to me, that I could use.']},
    {t:'How do you do all that at once?',r:['Practice. And a deep refusal to let Bob pack the lunches. He sent Dash to school with a whole raw onion once.']}]},
   {open:['You read to them tonight. All the voices. I heard the dragon from out here. Very menacing.'],opts:[
    {t:'I did a good dragon.',r:['You did a great dragon. Bob does every voice the same, like a guy reading the weather. Don’t tell him I said that.']},
    {t:'They wanted three more chapters.',r:['Of course they did. That’s how you know you did it right. One more, then lights out. Be firm. Be a firm dragon.']}]},
   {open:['* The Inn is quiet. Helen is on the couch with her feet tucked under her and a glass of wine, looking more tired than she’d admit.','Jack-Jack set the curtains on fire. Then turned into a little goo. Then went to sleep like an angel.'],opts:[
    {t:'Want some company?',r:['* She pats the cushion next to her.','I could use a grown-up who isn’t on fire. Sit.']},
    {t:'Is he okay?',r:['He’s fine. The curtains are not. Babies, honestly. You think you’ve seen everything and then they pass through a wall.']}]},
   {open:['People think the hero part is the hard part. It’s not. Hero work, you know who the bad guy is.','Parenting, you’re just making it up and hoping nobody notices. Everybody is. You too. And you’re doing fine.'],opts:[
    {t:'I don’t feel like I’m doing fine.',r:['Nobody does. That’s how you know you care. The dads who think they’ve nailed it are the ones I worry about.']},
    {t:'Even Elastigirl makes it up?',r:['Especially Elastigirl. I once negotiated with a supervillain more calmly than with Violet about curfew.']}]},
   {open:['* Helen leans over the back of your chair, her arm stretching just a little longer than it should to rest on your shoulder.','You look good tonight. Present. That’s a good look on a dad.'],opts:[
    {t:'Does Bob know you say that to people?',r:['Bob knows I have eyes. He also knows I married him. Both things can be true.','* She turns toward you on the couch. “Stay. I’d like another kiss before the rest of the world finds us.”']},
    {t:'You’re stretching.',r:['I’m flexible. Professionally. Don’t make it weird.','* She’s smiling when she says it.']}]}],
  gift:[
   'For me? That’s lovely. Come here, I want to kiss you before the kettle or somebody’s shoes interrupts us.',
   'For me? Not for the kids, not for the house? Huh. I forgot what that feels like. Thank you.',
   '* She pulls you into a hug, warm and a bit longer than polite, and her voice drops near your ear. “If anyone asks, I hugged you for the kids.”']},
};
