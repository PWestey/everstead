// Fourth-wave moments, part G: Family Jessica, Magik, Mystique, Nico, Shuri, Sue, Wasp, Moana and Vanellope
// (visits and gifts). See docs/WRITING-BRIEF.md. Romantic and flirty, PG-13, except Moana and Vanellope,
// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Jessica (Work) ----------------
 jessica:{
  visit:[
   {open:['* Jessica has her boots up on a Market crate, a paper cup of something brown that is definitely not coffee in one hand and a case file in the other.','Don’t. Whatever the speech is, don’t. I’ve had four clients today and they all had speeches.'],opts:[
    {t:'No speech. Just sitting.',r:['* She looks at you for a long second, then nudges a second crate over with her heel.','Fine. Sitting I can do. Sitting’s underrated.']},
    {t:'Is that whiskey?',r:['It’s a beverage. It’s noon somewhere. Mind your business, detective.']}]},
   {open:['You closed out that project today. The ugly one you’ve been dodging for two weeks.','I know dodging. I did it professionally for a year. Then I opened an office with a broken door and started closing cases.'],opts:[
    {t:'Your door’s still broken?',r:['The glass says Alias Investigations. Mostly. Some of it’s on the floor. It’s a vibe.']},
    {t:'It felt good to finish.',r:['Yeah. Best feeling there is. Second best. Shut up, you know what I mean.']}]},
   {open:['* Late. She’s on the Market steps, collar up, watching the street like she’s waiting for someone to cheat on someone.','Stakeout. Guy owes his landlord three months. Want to keep me awake?'],opts:[
    {t:'I brought snacks.',r:['* She takes the bag without looking and digs in.','Okay. You can stay. Don’t talk during the good part.']},
    {t:'How do I keep you awake?',r:['* One corner of her mouth goes up. Not quite a smile. Close.','Keep asking questions like that and you won’t have to try very hard.']}]},
   {open:['Luke told me once I’m allowed to be good at something without it being a whole thing.','Took me years to believe him. So. You’re good at your job. It’s not a whole thing. Take the win.'],opts:[
    {t:'That’s nice of you.',r:['I’m not nice. I’m accurate. There’s a difference, and it matters in my line of work.']},
    {t:'Luke sounds smart.',r:['Luke’s a big sweetheart with unbreakable skin. Don’t tell him I said sweetheart.']}]},
   {open:['* She slides a manila folder across the crate. Your name’s on the tab.','I ran a background on you. Habit. Don’t get weird about it.'],opts:[
    {t:'What did you find?',r:['* She leaves your collar alone and takes your hand. “Stay. I liked that kiss. I’d like another.”']},
    {t:'You investigated me?',r:['* She leans in close enough that you smell the whiskey and the rain on her jacket.','I investigate everybody I’m interested in. Draw your own conclusions.']}]}],
  gift:[
   'You remembered. Okay. That got me. Come here before I cover up a perfectly good thank-you with sarcasm.',
   'Huh. Nobody gets me stuff. Usually they get me subpoenas. This is better. Way better. I’m keeping it in the desk drawer with the good bottle.',
   '* She grabs your collar, kisses you once, quick and hard, then shoves you back a step. “That didn’t happen. Get out of my office.” She’s smiling.']},

 // ---------------- Magik (Discipline) ----------------
 magik:{
  visit:[
   {open:['* Illyana is sitting cross-legged on a Library table, soulsword laid across her knees, glowing faintly against the old books. The librarian has stopped protesting.','You’re late. I’ve been waiting six minutes. In Limbo that’s about a year.'],opts:[
    {t:'Sorry. Traffic.',r:['Traffic. I fought demons for a decade with a sword I made out of my own soul. And you had traffic.']},
    {t:'Is that thing safe in here?',r:['* She runs a fingertip along the blade.','It only cuts what’s magic or what’s rotten. You’re fine. Probably.']}]},
   {open:['You got up when the alarm went off. First time this week. No snooze.','Small. But I know how small things go. One morning you give in, and then Limbo gets a little bigger inside you.'],opts:[
    {t:'It was brutal.',r:['Good. Brutal means you did it on purpose. Easy mornings don’t count.']},
    {t:'That’s dark, Illyana.',r:['I’m from hell, literally. Dark is my resting state. But I mean it nicely. Mostly.']}]},
   {open:['Piotr thinks I’m too hard on you.','He also thinks borscht fixes everything and once apologized to a door for slamming it. Big brother is soft.'],opts:[
    {t:'Are you too hard on me?',r:['* Her blue eyes narrow, then soften, just barely.','No. I’m exactly as hard as you can take. That’s different. That’s respect.']},
    {t:'Should I tell him you said that?',r:['Tell him and I teleport you to a very cold part of Limbo. With no phone. Actually that might help you.']}]},
   {open:['* Night. The Library lamps are low. She’s by the window, sword gone, just a girl in black leather with her arms folded.','Everyone thinks I like being alone. I’m good at it. That’s not the same thing.'],opts:[
    {t:'You’re not alone right now.',r:['* She doesn’t turn around, but she steps back until her shoulder rests against your chest.','No. I noticed.']},
    {t:'Want company?',r:['I want you to stop asking and just stand here. You’re terrible at reading a room, you know that?']}]},
   {open:['You left the phone downstairs again. Whole evening. I could feel it, like a demon that didn’t get fed.','Starve them. That’s the trick. They get small and whiny and then they go away.'],opts:[
    {t:'Are you calling my phone a demon?',r:['* She stays beside you. “I want another kiss. I can say that without opening a portal.”']},
    {t:'It’s getting easier.',r:['* She flicks your forehead, almost fond.','Told you. Will is a muscle. I should know. Mine’s huge.']}]}],
  gift:[
   'No contract. Just a gift. Thank you. I’d like to kiss you, and I won’t disappear afterward.',
   'No catch? You’re sure? No little clause where I owe you my soul? Hm. I don’t know what to do with that.',
   '* She rises on her toes and kisses your cheek, quick, then blinks away in a flash of light before you can see her face. Her laugh echoes a second later from somewhere behind you.']},

 // ---------------- Mystique (Work) ----------------
 mystique:{
  visit:[
   {open:['* The merchant at the spice stall winks at you with gold eyes. Then the face ripples blue, and Raven is leaning on the counter, smiling like a cat.','You walked right past me twice. That’s sweet. Also sloppy.'],opts:[
    {t:'How long were you watching?',r:['Since breakfast. You ate standing up and answered three emails with your mouth full. I take notes.']},
    {t:'Please don’t do that.',r:['Do what? Be interesting? Darling, it’s the only thing I’m good at.']}]},
   {open:['You took that meeting and didn’t say yes to everything. You let them wait. Made them come to you.','I’ve run whole governments that way. Never show your hand. Never show your real face.'],opts:[
    {t:'Is that your advice for work?',r:['It’s my advice for life. For work, I’d add: always know where the exits are and who signs the checks.']},
    {t:'I felt like a fraud.',r:['Everyone does. The trick is feeling like a fraud and doing it beautifully anyway. I would know.']}]},
   {open:['* Raven sits on the Market fountain edge, her real face on, blue skin and red hair in the lamplight. She doesn’t do that often.','Irene used to see the future. She said I’d meet someone who didn’t need me to be anyone else.','She was usually right. It was very annoying.'],opts:[
    {t:'Was she right this time?',r:['* Her eyes hold yours, steady and unreadable.','Ask me again in a month. I like to verify my sources.']},
    {t:'You miss her.',r:['Every day. Don’t make it soft. I don’t do soft in public.']}]},
   {open:['Anna Marie stopped by. She says you fixed her porch step without being asked.','She’s my girl, you know. Not by blood. By choice. It’s complicated, and if you ask I’ll lie to you.'],opts:[
    {t:'I won’t ask.',r:['Good. A man who knows when not to dig. You’re rarer than you think.']},
    {t:'She says nice things about you.',r:['* Something flickers across Raven’s face, quick, then gone.','Does she. Well. Don’t tell her it worked.']}]},
   {open:['* She plucks the pen from your hand and reads your plan for the week upside down.','Thursday is weak. Move the hard call to Tuesday, while they still think you’re nice.'],opts:[
    {t:'You’re ruthless.',r:['* Her face stays her own. “I’d like another kiss. From you. There’s nothing to decipher.”']},
    {t:'And what do I get if it works?',r:['* She leans close and her face shifts, briefly, into something devastating, then back to blue.','I’ll let you pick the face for dinner. Or not. The real one’s been getting more requests lately.']}]}],
  gift:[
   'You chose this for the woman, not the face. Come closer, darling. I’d like to thank you as myself.',
   'People give gifts to the face I’m wearing. You gave this to me. I can tell. That’s… unusual.',
   '* She kisses you, and halfway through you realize she let her real face come back. She doesn’t explain it. She doesn’t have to.']},

 // ---------------- Nico (Hobbies) ----------------
 nico:{
  visit:[
   {open:['* Nico is in the Guildhall corner with black nail polish, a stack of comics and the Staff of One leaning against the wall like an umbrella.','Oh, hey. Don’t touch the staff. Last guy who touched it turned into a very confused pigeon. For an hour.'],opts:[
    {t:'Noted. Hands in pockets.',r:['Good call. You have nice hands. Would be a shame if they had feathers.']},
    {t:'Did he get better?',r:['Mostly. He still bobs his head when he walks. I feel kind of bad. Kind of.']}]},
   {open:['You actually finished that book. The one you’ve been carrying around like a prop since spring.','Honestly I was starting to think it was a spellbook and you were scared of it.'],opts:[
    {t:'It was good.',r:['See? Hobbies are magic. You put in time and something weird and wonderful comes out. Like spells, minus the blood.']},
    {t:'Spells need blood?',r:['Mine do. Tiny bit. A pinprick. Don’t look at me like that. You do reading. I do bleeding. We all have stuff.']}]},
   {open:['The rule with the Staff is I can’t cast the same spell twice. Ever. So I had to get creative or die.','I think hobbies work like that too. Do the same thing forever and it stops working.'],opts:[
    {t:'So I should try something new?',r:['Duh. Try drawing. Or that guitar in your closet. Yes, I know about the guitar. I know about everything.']},
    {t:'How do you remember which spells you used?',r:['Notebook. A super gothic one with a skull on it. Gert made fun of it. Gert was wrong.']}]},
   {open:['* Night in the Guildhall. Nico sits on the windowsill with her knees pulled up, eyeliner smudged, a little more tired than she lets on.','The Runaways were the first people who ever got me. Kids with terrible parents and nowhere to go. We made our own thing.'],opts:[
    {t:'You made a family.',r:['Yeah. Messy and loud and kind of broken. You’d have fit right in.']},
    {t:'Come sit with me.',r:['* She hops down and sits close, shoulder to shoulder, and lets her head fall against you.','Okay. But I’m not saying anything sappy. This is me not saying anything sappy.']}]},
   {open:['* She hands you a sketchbook. Inside, a drawing of you, badly hunched over your hobby, tongue out in concentration.','I’ve been watching you work on your thing. You make a face. It’s really cute. I had to document it.'],opts:[
    {t:'I do not make that face.',r:['* She lowers her hood and stays close. “I want another kiss. I’m not going to pretend I didn’t.”']},
    {t:'You think I’m cute?',r:['* Her pale cheeks go slightly pink under all the black.','I said the face was cute. Don’t twist my words. Okay, also you. Ugh.']}]}],
  gift:[
   'This is really thoughtful. I’m trying not to hide behind a joke. Thank you. Can I kiss you?',
   'Okay. This is really cool. Like actually cool, not ironic cool. I’m going to keep it on my altar. It’s a shelf. I call it an altar.',
   '* She kisses you on the cheek, then the corner of your mouth, then pulls her hood up and walks off fast. “I didn’t do that. You can’t prove anything.”']},

 // ---------------- Shuri (Hobbies) ----------------
 shuri:{
  visit:[
   {open:['* Shuri has taken over a Guildhall workbench with a hologram projector, two drones and a vibranium bracelet in pieces.','Ah, finally, someone with thumbs. Hold this. Do not drop it. It is worth more than your village.'],opts:[
    {t:'No pressure, then.',r:['Pressure is good! Pressure makes diamonds. Also makes things explode, so steady hands, okay?']},
    {t:'What is it?',r:['A bracelet that tells you when you’ve been on your phone too long. Then it shocks you. Gently. Mostly gently.']}]},
   {open:['You built that thing in your garage? With actual tools? No YouTube tutorial halfway through crying?','I’m impressed. I will deny that statement if you repeat it to my brother.'],opts:[
    {t:'There was a little crying.',r:['Ha! Good. Every great inventor cries in the workshop. I melted my first lab coat at nine.']},
    {t:'What’s wrong with telling T’Challa?',r:['He will make a face. The proud king face. It’s unbearable. He’ll tell my mother. Then there will be a feast.']}]},
   {open:['* Shuri is scrolling through a projection of your week, eyebrows climbing.','You spent three hours on a hobby this week. Three! I expected forty minutes, minimum, of doom-scrolling.'],opts:[
    {t:'You tracked me?',r:['I track everything. It’s called data. In Wakanda we call it Tuesday.']},
    {t:'Three hours is good, right?',r:['Three hours is very good. For a man with seventeen open browser tabs. Do four next week.']}]},
   {open:['* Night. The Guildhall is empty except for Shuri, goggles pushed up into her hair, soldering by lamplight.','Everyone thinks I’m just the genius little sister. Brilliant, annoying, cute.','I am all three. But I’m not little anymore.'],opts:[
    {t:'I noticed.',r:['* She sets the iron down and looks at you for a long beat.','Good. Took you long enough.']},
    {t:'You’re brilliant and annoying.',r:['And? You skipped one. Say the third one. Say it.']}]},
   {open:['* She tosses you a pair of glasses. When you put them on, the room is overlaid with little glowing tags.','Prototype. It tags everything you’ve started and never finished. Look at your shelf.'],opts:[
    {t:'Oh no. That’s a lot of tags.',r:['* She sets her bracelet aside. “I wanted your attention. Now I have it, I’d like to kiss you.”']},
    {t:'Can it tag you?',r:['* She laughs and steals the glasses back.','It says I am an unfinished project you should spend more time on. Weird. Must be a bug.']}]}],
  gift:[
   'No tech, no favor. You just thought of me. I love it. Come here before I start explaining instead of thanking you.',
   'No vibranium. No tech. Just something you picked because you thought of me. That’s so primitive. I love it.',
   '* She kisses you, quick and bright, then immediately starts explaining how she’s going to upgrade it. You let her talk. She keeps holding your hand the whole time.']},

 // ---------------- Sue (Fatherhood) ----------------
 sue:{
  visit:[
   {open:['* Sue is at a Hearth Inn table with a stack of picture books, a juice box and a faint shimmer around a toddler’s cup so it can’t tip over.','Force field. Best parenting trick I ever learned. Valeria’s spilled exactly zero drinks this year.'],opts:[
    {t:'I need that power.',r:['You have the other one. The one where you sit down and pay attention. Honestly, that’s the stronger power.']},
    {t:'That feels like cheating.',r:['Every parent cheats. Mine just glows. Yours probably involves snacks and a tablet. No judgment.']}]},
   {open:['You took them to the park and left your phone in the car. I saw.','Reed would’ve brought a notebook and invented something on a swing. I love him. But you were just there. That matters.'],opts:[
    {t:'They wore me out.',r:['That’s the job. Franklin once wore out a cosmic being. Literally. I had to make him a sandwich after.']},
    {t:'Does Reed ever put the notebook down?',r:['* She smiles, rueful and fond.','Sometimes. When I make him. I’m very persuasive. Invisible hands help.']}]},
   {open:['* Late. The kids are asleep upstairs. Sue sits by the fire, shoes off, a glass of wine she’s barely touched.','Sixty seconds of quiet. Don’t ruin it. Sit, though. You can share the quiet.'],opts:[
    {t:'I can do quiet.',r:['* She tucks her feet under her and leans into the couch beside you.','Mm. A man who can do quiet. Reed should take notes. Don’t tell him I said that.']},
    {t:'You look tired.',r:['I look like a woman who has kept a family of geniuses and hotheads alive for twenty years. Tired is a compliment.']}]},
   {open:['Johnny set the kitchen on fire again. Ben made it worse. Reed made a robot to fix it, and the robot made it worse.','And then I fixed it. Like always. Sound familiar?'],opts:[
    {t:'Very familiar.',r:['Thought so. Being the glue isn’t glamorous. But nobody holds together without it. Nobody.']},
    {t:'Your family sounds exhausting.',r:['They are. I wouldn’t trade a single one of them. Well. Maybe Johnny on Tuesdays.']}]},
   {open:['* She brushes some crumbs off your shoulder, then leaves her hand there a moment.','You did bedtime alone tonight. Two stories and a glass of water and a monster check. All of it.'],opts:[
    {t:'Three stories, actually.',r:['* She stays beside you, visible and smiling. “I want another kiss. No disappearing afterward, either.”']},
    {t:'Someone had to.',r:['* She squeezes your shoulder, warm.','That’s what I always say. It’s nice to hear it from someone else for a change.']}]}],
  gift:[
   'You thought of me. That means a lot. Come closer, I want to thank you without talking across the room.',
   'Sorry. Old habit. Nobody gets the mom anything. They get the genius and the hothead and the kids presents. This is lovely.',
   '* She kisses your cheek, soft and lingering, and her laugh is a little shaky. “Reed’s going to be so jealous. Good. Let him be.”']},

 // ---------------- Wasp (Fitness) ----------------
 wasp:{
  visit:[
   {open:['* Something buzzes past your ear. Then Janet is full size beside you on the Training Yard fence, in a black and yellow outfit that definitely didn’t come off a rack.','Like it? Designed it this morning. You can’t do burpees in something ugly, it’s bad for morale.'],opts:[
    {t:'It looks great.',r:['I know! But it’s nice to hear. Now show me what you’re wearing to train. Oh. Oh, honey, no.']},
    {t:'You designed it this morning?',r:['Before breakfast. Then I flew three miles at bug size. That’s like a marathon for you. I’m very fit.']}]},
   {open:['You ran this morning. In the dark. In the cold. I watched from a leaf.','Hank would’ve said it was inefficient. Hank says that about everything that isn’t ants.'],opts:[
    {t:'It was miserable.',r:['Miserable and done! That’s the best combo. Miserable and not done is the worst one.']},
    {t:'You watched from a leaf?',r:['I’m tiny, I can watch from anywhere. It’s a whole perk. Don’t worry, I only watch the good parts.']}]},
   {open:['* Janet is stretching on a mat, one leg straight up against the post, chatting like this is easy.','Founding Avenger, you know. I named the team. Nobody remembers that. Everyone remembers Thor’s hair.'],opts:[
    {t:'You named the Avengers?',r:['Yep. Sounded snappy. Took me two seconds. The best ideas do. Okay, your turn, twenty lunges, go.']},
    {t:'Thor’s hair is pretty great.',r:['It is pretty great. I’ve asked him what conditioner he uses. He said “lightning.” Useless.']}]},
   {open:['* Sunset over the Yard. Janet sits on a hay bale, wings folded, sweaty and grinning.','I don’t stop moving. Ever. People think it’s energy. Sometimes it’s just easier than sitting still with my thoughts.'],opts:[
    {t:'You can sit still with me.',r:['* She scoots over and leans against you, still buzzing a little.','Okay. Two minutes. Then I’m doing pull-ups. Maybe three minutes.']},
    {t:'Same, honestly.',r:['I figured. Takes one to know one. At least we’re hot about it.']}]},
   {open:['* She shrinks, zips around your head twice, and lands on your shoulder, tiny and laughing.','You’re slouching! I can see it from up here. Shoulders back, chest out, there you go. Handsome.'],opts:[
    {t:'Did you just call me handsome?',r:['* She pops back to full size, very close, still holding your shoulder.','* She stays at your side, smiling. “I’d like another kiss. We can both be still for that.”']},
    {t:'Get off my shoulder.',r:['Rude. Fine. But I’m coming back during deadlifts to check your form. And for the view.']}]}],
  gift:[
   'You remembered my taste. That’s attractive. Come here before I turn the thank-you into a fashion lecture.',
   'Oh, this is good. This goes with everything. You have taste. I would never have guessed from the gym shorts.',
   '* She kisses you on the cheek, shrinks, buzzes around your head once, and grows back to kiss the other cheek. “Symmetry. Very important.”']},

// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
 moana:{
  visit:[
   {open:['* Moana finishes checking the harbor boats and sets her ledger aside.','The crews are home. Come have dinner with me. I’d like the rest of the evening with you.'],opts:[
    {t:'I’d like that.',r:['Good. I picked a place where I can actually hear you over the water.']},
    {t:'A date?',r:['A date. I can navigate an ocean. I can ask you out without sailing around the question.']}]},
   {open:['* She waits for you on the beach after the morning walk.','I like sharing the route with you. I’d like to share an evening, too.'],opts:[
    {t:'When are you free?',r:['Tonight. I’ve already made the time. I was hoping you would want it.']},
    {t:'I was hoping you’d ask.',r:['Then we’ve both spent enough time hoping. Let’s plan it.']}]},
   {open:['* Moana checks a knot, satisfied, then comes to sit beside you.','Gramma Tala taught me to trust my judgment. Mine says I’d like to know you better.'],opts:[
    {t:'I’d like that too.',r:['Good. Tell me something I won’t learn by watching you train.']},
    {t:'What do you want to know?',r:['What makes you laugh when nobody’s expecting you to be useful. I’d like to see that side of you.']}]},
   {open:['* She stows the last of the supplies and offers you a place on the canoe.','No expedition tonight. Just a short sail and dinner where the village can’t interrupt.'],opts:[
    {t:'You planned this for us?',r:['Yes. I wanted time with you. I’m getting less subtle about it.']},
    {t:'Take my hand.',r:['Gladly. I’ve been looking forward to asking you to come closer.']}]},
   {open:['* Moana ties up the canoe and stays beside you on the dock.','I had a good evening. I’d like to kiss you before we say goodnight.'],opts:[
    {t:'I’d like that.',r:['Come here, then. I’m glad we stopped pretending this was only about sailing.']},
    {t:'Let’s do this again.',r:['Yes. I’ll make the time. I want more evenings with you.']}]}],
  gift:[
   'You remembered. I’ll keep this safe. Come sit with me, I’d like to thank you and ask you on a date.',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
 vanellope:{
  visit:[
   {open:['* Vanellope closes her racing garage, wiping the last of the oil from her hands.','I’ve been here since dawn. Come have dinner with me. I want some of tonight to be ours.'],opts:[
    {t:'I’d like that.',r:['Good. I booked a table. I can plan more than a racing line.']},
    {t:'You’re asking me out?',r:['Yes. I like you. I’d rather say it than keep inventing reasons to see you.']}]},
   {open:['* She sets her own engine plans beside your project sketch.','You kept working on this. I like that. I also like the face you make when it finally works.'],opts:[
    {t:'You’ve been watching me?',r:['Yes, and enjoying it. Come sit beside me. I want to see what you’re making.']},
    {t:'Show me your plans too.',r:['Gladly. Then we put them away and take a proper evening off together.']}]},
   {open:['* A brief flicker carries her to the other end of the workbench. She steadies herself, amused.','Years of racing, and that still surprises people. You don’t look surprised anymore.'],opts:[
    {t:'I’m getting to know you.',r:['I like that. I’d like to get to know you somewhere we aren’t both covered in grease.']},
    {t:'Come back over here.',r:['That’s a better invitation. I’d rather sit beside you than show off across the room.']}]},
   {open:['* She puts the final tool away and leans beside you at the garage door.','I used to fill every quiet hour with another lap. I’m finding I like this better.'],opts:[
    {t:'Quiet company?',r:['Your company. There’s a difference. I wanted you to hear it.']},
    {t:'I can stay a while.',r:['Please do. I’ve got nowhere else I’d rather be tonight.']}]},
   {open:['* Vanellope sets her helmet on the bench and takes your hand.','I want another date. I’d also like a kiss before we spend all night talking about the next one.'],opts:[
    {t:'Then kiss me.',r:['Come closer. That was worth slowing down for.']},
    {t:'Tomorrow evening?',r:['Tomorrow evening. I’ll close the garage early. I want this to have my full attention.']}]}],
  gift:[
   'You remembered. Nice. I was going to pretend I’m hard to impress, but I’d rather kiss you.',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},
};
