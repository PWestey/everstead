// Fourth-wave moments, part B: Family Moira, Quinn, Samira, Vi, Kelsey, Sarah (Miss Fortune), Talanji and Maggie
// (visits and gifts). See docs/WRITING-BRIEF.md. Romantic and flirty, PG-13.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Moira (Fatherhood) ----------------
 moira:{
  visit:[
   {open:['* Moira sits by the Hearth Inn fire with a small boot in her lap, stitching the toe closed with a jeweler’s patience.','Dagran kicks through boots like they owe him gold. Don’t laugh. Yours do the same, I’ve seen them.'],opts:[
    {t:'They go through two pairs a season.',r:['Only two? Lucky. Mine went through a stone floor once. Takes after his grandfather.']},
    {t:'Want help with that?',r:['* She hands you the needle and watches your hands a little too closely.','Steady. Not bad, for a man who isn’t a Dark Iron. Not bad at all.']}]},
   {open:['You sat on the floor with your little ones tonight. Blocks, silly voices, the lot. I heard it from the stairs.','My da never sat on a floor in his life. Ironforge kings don’t, apparently.'],opts:[
    {t:'Magni seems the floor type now.',r:['Now. Took him getting turned to diamond to learn it. You learned it cheaper. I like that in a man.']},
    {t:'Floors are where the good stuff is.',r:['Aye. Crumbs, lost toys, and the occasional honest father. I’ve been looking for one of those.']}]},
   {open:['* Late. The Inn has gone quiet. Moira comes down the stairs barefoot, hair loose from its braids, crown left somewhere upstairs.','He’s finally asleep. Three stories and a song about lava. Don’t tell the court I sing.'],opts:[
    {t:'Your secret’s safe.',r:['* She sits close enough that her shoulder rests against yours.','Good. I’ve a few more. You might earn one or two of them, if you stay up.']},
    {t:'Sing it for me?',r:['* She laughs, low, and lets her hand rest on your knee a moment.','Not a chance. Well. Maybe one verse. Ask me again when the fire’s lower.']}]},
   {open:['People in Ironforge thought I married Dagran’s father to spite mine. Maybe I did, at first.','Then I had a son, and nobody’s opinion mattered again. Funny how a wee face does that.'],opts:[
    {t:'Kids reset everything.',r:['Aye. Every bit of pride I had, gone, the first time he grabbed my finger. You know the feeling.']},
    {t:'Did your da ever come round?',r:['Eventually. Stubborn old rock. He holds Dagran now like he’s made of glass. It undoes me a little.']}]},
   {open:['* She catches your sleeve as you head for the door, then lets go slowly.','You were short with them this morning. And then you went back and said sorry. I watched you do it.'],opts:[
    {t:'I hated how I sounded.',r:['* She catches your hand. “Stay a little longer. Aye, I’m asking you. I thought that was clear.”']},
    {t:'You were watching me?',r:['* Her smile is slow and not at all regal.','I watch a lot of things in this Inn. You’re the one I keep coming back to.']}]}],
  gift:[
   'For me, then. You do know how to make a queen smile. Come here and let me thank you.',
   'For me? Not for Dagran? Huh. It’s been a long while since anyone remembered I’m more than a mother. Thank you.',
   '* She kisses your cheek, quick, and pretends very hard it was an accident of the firelight.']},

 // ---------------- Quinn (Fitness) ----------------
 quinn:{
  visit:[
   {open:['* Valor drops onto the Training Yard fence with a screech. Quinn jogs in a step behind, barely winded.','He spotted you running the ridge path at dawn. Told me all about it. He’s a terrible gossip.'],opts:[
    {t:'What did he say?',r:['That your form was sloppy on the hill and you didn’t quit anyway. High praise. He doesn’t like anyone.']},
    {t:'You sent your bird to spy on me?',r:['Scout. Not spy. Demacian rangers have standards. Okay, I sent him. You looked good out there.']}]},
   {open:['Stretch with me. No, really. Ten minutes. Rangers who skip stretching end up rangers who walk funny.'],opts:[
    {t:'Sit down and stretch with her.',r:['* She presses your shoulder down gently, her hand warm through your shirt.','There. Breathe. See, you can be still. I had my doubts.']},
    {t:'Ten minutes? I’m fine.',r:['You’re stiff as a Demacian guard captain. Down. Now. I’ll be nice about it. Mostly.']}]},
   {open:['* Quinn sits on a hay bale, unlacing her boots, rolling an ankle that’s seen too many miles.','I used to run because Caleb was gone and moving felt better than thinking. Now I run because I like it. Took years.'],opts:[
    {t:'What do you think about when you run?',r:['Wind direction. Footing. Where Valor is. And lately, whether you’ll be on the path. Don’t make that face.']},
    {t:'I’m sorry about your brother.',r:['* She’s quiet, then bumps your knee with hers.','Thanks. He’d have liked you. He liked anyone who could keep up.']}]},
   {open:['Race you to the old oak. Loser carries the water buckets tomorrow. Valor’s judging.'],opts:[
    {t:'Go!',r:['* She wins by a stride and turns, laughing, cheeks flushed, close enough to catch you as you stumble in.','You’re getting faster. That’s annoying. Do it again tomorrow.']},
    {t:'Valor’s biased.',r:['Completely. He thinks I’m perfect. He also thinks you smell like jerky. Run anyway.']}]},
   {open:['* Evening. Quinn leans on the Yard gate, watching the sun go down over the fields, Valor asleep on her shoulder.','You did the workout even after that long day. I know you were tired. Your shoulders said so.'],opts:[
    {t:'I almost skipped it.',r:['* She turns toward you at the gate. “I wanted this to be a date. I’d like to end it with a kiss.”']},
    {t:'You notice a lot.',r:['* She glances at you, then away, and smiles at the horizon.','Ranger’s job. I notice everything. I just look longer at some things.']}]}],
  gift:[
   'I’ll keep it in my pack. Come walk with me. I’d like to thank you where Valor isn’t commenting.',
   'You didn’t have to. I mean it. But I’m keeping it. It goes in the pack I never take off.',
   '* She squeezes your hand, quick and hard, like a ranger’s promise. Then she doesn’t let go right away.']},

 // ---------------- Samira (Fitness) ----------------
 samira:{
  visit:[
   {open:['* Samira spins a pistol on one finger, sitting backward on a Training Yard bench like she owns it.','You did the whole workout without checking your phone once. That’s style. Boring, sweaty style. But style.'],opts:[
    {t:'Rate it.',r:['Mm. A solid B. Do the last set faster and smile at the end and I’ll bump you up.']},
    {t:'You were watching the whole time?',r:['Of course. Best show in the village. Don’t let it go to your head, desert flower.']}]},
   {open:['Back in Shurima I learned to run on sand. It eats your legs alive. Makes you fast on anything else.','Want to see how fast? Try to keep up.'],opts:[
    {t:'Chase her across the Yard.',r:['* She lets you catch her at the fence, breathless and laughing, her hand on your chest to stop you.','Not bad. You almost had me. Almost is very attractive on you.']},
    {t:'I’ll just watch.',r:['Watching’s not a workout, handsome. Though I admit it’s a decent view from both sides.']}]},
   {open:['* She’s on the ground doing a slow, careful stretch routine, nothing flashy at all.','What? The flips only look easy because I do the dull stuff every single day. Don’t tell anyone.'],opts:[
    {t:'Your secret’s safe.',r:['It’d better be. My whole reputation rests on looking like I never try.']},
    {t:'Show me the dull stuff.',r:['* She pats the mat beside her with a wicked smile.','Get down here, then. I’ll correct your form. Very hands-on. I’m a thorough teacher.']}]},
   {open:['Noxus paid me to fight. I said yes because I got bored. You train for your kids, your wife, your knees. Way better reason.'],opts:[
    {t:'And for fun.',r:['Ah, there it is. Now you sound like me. Careful, that’s how the trouble starts.']},
    {t:'My knees thank you.',r:['Your knees should. They’ve been carrying a lot of style lately. Keep them happy.']}]},
   {open:['* At dusk Samira sits on the Yard wall, boots swinging, rolling a single bullet between her fingers.','I live for the rush. You live for the long haul. I’m starting to think yours is the bigger thrill.'],opts:[
    {t:'You could try it.',r:['* She leans in until her nose nearly brushes yours, then pulls back, grinning.','* She sets her hat aside. “I’m done performing for the room. I want to kiss you. Interested?”']},
    {t:'You? Slowing down?',r:['Never. But I can sit still for one sunset. If you sit with me.']}]}],
  gift:[
   'Now that has style. So does the man who brought it. Come closer and let me appreciate both.',
   'Oh, that’s got style. You’ve got taste after all. I knew there was a reason I kept looking.',
   '* She blows you a kiss with a flick of her fingers, and then, as you turn, a real one lands on your cheek.']},

 // ---------------- Vi (Fitness) ----------------
 vi:{
  visit:[
   {open:['* Vi is beating a sandbag so hard the chain creaks. She stops, shakes out her gauntlets, and looks you over.','You actually went to the gym in that rain. Idiot. Respect. Wanna hit something?'],opts:[
    {t:'Hold the bag for me.',r:['* She plants her shoulder behind it and grins over the top.','Go on, then. Harder. I’ve been punched by Zaunite thugs gentler than that.']},
    {t:'I hit enough today.',r:['Fair. Sit. I’ll do the hitting, you do the admiring. You’re good at that part.']}]},
   {open:['Caitlyn says I should do “mobility work.” Sounds fake. Then I tried it and my back stopped yelling at me. Don’t tell Cupcake she was right.'],opts:[
    {t:'I’m telling her.',r:['You wouldn’t. Then again, I like it when you’re brave. Do it and see what happens.']},
    {t:'Teach me the stretches.',r:['* She pushes you into a lunge, hands firm on your hips.','Lower. Stop laughing. You’re worse than me, and that’s saying something.']}]},
   {open:['* Vi sits on the Yard steps with her gauntlets off, knuckles taped and raw, staring at nothing.','Training’s the only time my head goes quiet. Powder, Vander, all of it. Just breathing and hitting.'],opts:[
    {t:'Want company?',r:['* She shifts over without looking at you. After a minute, she leans into your shoulder.','Yeah. You’re okay at quiet. Don’t ruin it.']},
    {t:'Same for me, honestly.',r:['Figured. You’ve got that look. The one where the run’s about more than running.']}]},
   {open:['Spar me. Gloves on, no gauntlets. I’ll go easy. Probably.'],opts:[
    {t:'Square up.',r:['* She pins you in four seconds flat and grins down at you, closer than she needs to be.','Okay, you lasted longer than most. Kinda cute when you’re losing.']},
    {t:'Probably?',r:['Probably’s the best you get in the Undercity, pal. Up you get.']}]},
   {open:['* Vi tosses you a waterskin and drops onto the bench beside you, sweaty and pleased.','Four workouts this week. Four. Who even are you? I kinda like this guy.'],opts:[
    {t:'You’re a good influence.',r:['* She rests her hand on yours. “I like you. I want you here. That’s the whole sentence.”']},
    {t:'He’s been here all along.',r:['* She knocks her knee into yours and leaves it there.','Yeah? Then quit hiding him. I like the look.']}]}],
  gift:[
   'Nobody usually gets me things. Let me try this properly: thank you. Can I kiss you?',
   'Huh. Nobody gives me stuff unless it’s a warrant. I’m keeping this. Don’t make it weird.',
   '* She punches your shoulder, light for her, then hooks a finger in your collar and kisses your cheek. Fast. Like it never happened.']},

 // ---------------- Kelsey (Work) ----------------
 kelsey:{
  visit:[
   {open:['* Kelsey drops from a Market awning onto your table, scattering your notes, and lands in a perfect crouch.','Sorry! Practicing entrances. Ooh, is that your task list? Three done before noon? Very sneaky of you.'],opts:[
    {t:'Want to help with the rest?',r:['Do I want to help? I brought grappling hooks to a bake sale once. Hand me that pen, partner.']},
    {t:'You scattered my notes.',r:['Reorganized. Spatially. You’re welcome. Also, your handwriting’s adorable.']}]},
   {open:['Mathias Shaw makes us plan every job in five steps. Get in, get it, get out, don’t get caught, file the report.','Your big project? Same thing. What’s step one?'],opts:[
    {t:'Get in. Open the file.',r:['Yes! Look at you, a natural. I’d recruit you for SI:7 if you weren’t so busy being lovely.']},
    {t:'Step one is coffee.',r:['Correct. Shaw doesn’t know that, but it’s true. I’ll fetch it. Two sugars?']}]},
   {open:['* She’s up on a crate at the Market, tinkering with a little clockwork mouse, tongue between her teeth.','It’s supposed to carry notes. Right now it mostly carries itself into walls. Very relatable.'],opts:[
    {t:'Kind of like my afternoons.',r:['Ha! Then we fix you both. One focus block. No walls. I’ll wind you up personally.']},
    {t:'Can I try?',r:['* She hands it over and leans on your arm to watch, very close.','Gentle. Gentle! Gnome engineering likes a soft touch. So do gnomes.']}]},
   {open:['Real talk? People see a tiny rogue and think I can’t handle the big stuff. So I just do it. Every time. Quietly.','You do that too. At your job. I noticed.'],opts:[
    {t:'It doesn’t feel quiet inside.',r:['It never does. Gnomeregan was loud inside me for years. You still did the work. That counts double.']},
    {t:'You noticed me?',r:['I’m a spy, silly. I notice everything. You I notice on purpose.']}]},
   {open:['* Kelsey is sitting on your desk when you arrive, swinging her boots, holding your finished report like a prize.','Delivered on time. Didn’t even need my lockpicks. Honestly it’s a little disappointing. I’m kidding. I’m so proud.'],opts:[
    {t:'Reward?',r:['* She hops up, kisses the tip of your nose, and is gone before you can blink.','Payment rendered. SI:7 always pays its contacts.']},
    {t:'Next one’s harder.',r:['Good. I get bored easy. Bring me the scary ones and we’ll steal the deadline right out from under them.']}]}],
  gift:[
   'A gift with no mission attached. I like that. Come sit at my height so I can thank you properly.',
   'For me? No mission attached? No catch? You’re either very sweet or a very good spy. I hope both.',
   '* She climbs onto the crate beside you to get the height right, and plants a kiss on your cheek. Mission accomplished.']},

 // ---------------- Sarah Fortune (Work) ----------------
 missfortune:{
  visit:[
   {open:['* Sarah has her boots up on a Market counter, hat tipped low, counting coins into neat stacks without looking.','A full day’s work and the books are balanced. You know how rare that is in Bilgewater? Rarer than an honest captain.'],opts:[
    {t:'Present company excepted?',r:['Oh, I’m not honest, sweetheart. I’m reliable. Big difference. Very profitable difference.']},
    {t:'I could use a first mate.',r:['* She tips her hat back with one finger and gives you a long look.','Bold. Rafen would sulk. I might let you try out anyway.']}]},
   {open:['People think I got where I am with the pistols. The pistols helped.','Mostly I got up earlier than everyone else and planned better. Same as you, from what I hear.'],opts:[
    {t:'Who’s been talking about me?',r:['Everyone at this Market. The ones who matter say you deliver. That’s all the reputation you need.']},
    {t:'The pistols didn’t hurt.',r:['They never do. Well. They do for some people. Not for you. You’re on my good side.']}]},
   {open:['* At the Market at dusk, she sits on a barrel, hat in her lap, watching the gulls.','You know what kills a crew? Not a storm. One man who thinks the rules are for everyone else. You’re not him.'],opts:[
    {t:'How can you tell?',r:['You do the dull jobs first. The ones nobody sees. I’ve hired fifty men. I know the look. I like it on you.']},
    {t:'I try not to be.',r:['Trying’s how it starts. Doing it every day is how it finishes. Sit with me a minute. The gulls are good company.']}]},
   {open:['I took Bilgewater from a man who thought I was a little girl he’d forgotten. Took me years. Patience is a weapon, love.','Your work’s like that. Slow. Then all at once.'],opts:[
    {t:'I’m in the slow part.',r:['Then be dangerous in the slow part. Every task’s a cannonball you’re loading. Nobody sees until the boom.']},
    {t:'You blew him up, right?',r:['* She grins, all teeth.','Allegedly. I prefer to say he left in a hurry. Very loud hurry.']}]},
   {open:['* Sarah tosses you a gold coin. It lands warm in your palm.','For the big project you finished. A captain pays her people. Even the ones she’s just flirting with.'],opts:[
    {t:'Just flirting?',r:['* She steps close, closes your fingers around the coin, and holds your hand a beat too long.','* She takes off her hat and holds your gaze. “Stay. I’d like another kiss before we say goodnight.”']},
    {t:'I’ll spend it wisely.',r:['Of course you will. That’s what’s so maddening about you. Most men buy rum.']}]}],
  gift:[
   'No strings? Good. I prefer invitations to bargains. Mine is dinner tonight, just us.',
   'A gift with no strings? In Bilgewater we’d call that suspicious. Here I’ll call it sweet. Thank you.',
   '* She tips her hat to you, then leans down and leaves a kiss on your cheek that smells faintly of gunpowder and salt.']},

 // ---------------- Talanji (Work) ----------------
 talanji:{
  visit:[
   {open:['* Talanji walks the Market in gold and jade, stopping at your stall to read your plans for the week.','You put the hardest thing first. My father ruled that way. Rastakhan never wasted a morning, mon.'],opts:[
    {t:'He sounds like a great king.',r:['He was. I miss him every day. I think he would have liked you. He liked people who do the work.']},
    {t:'Some mornings I fail.',r:['So do queens. Then we try again the next morning. That is the whole secret of thrones.']}]},
   {open:['Bwonsamdi keeps telling me I work too hard. A death loa giving me advice about rest. Can you imagine?'],opts:[
    {t:'Maybe he has a point.',r:['* She sighs and sits beside you, close.','Maybe. Do not tell him. He is smug enough. Rest with me a little, then.']},
    {t:'He just wants you on his schedule.',r:['Ha! Yes. He is always counting. Me, I prefer to count the good work we do. Yours today was very good.']}]},
   {open:['* Late at the Market, Talanji’s crown sits on the table beside her. She rubs her temples.','So many decisions today. Trade, war, a temple roof. I made them all carefully. It is tiring, being careful.'],opts:[
    {t:'Want me to rub your shoulders?',r:['* She hesitates, then turns her back to you and lets her head drop.','A queen should say no. Mm. A queen should say many things. Do not stop.']},
    {t:'You did well.',r:['* She looks at you a long time, her eyes soft.','No one says that to a queen. They only say what is next. Thank you.']}]},
   {open:['Zul betrayed us. Someone I trusted with everything. I learned a hard thing: you check the work, even from friends.','You review your own work twice. I see it. That is how Zandalar survived.'],opts:[
    {t:'I’ll keep checking.',r:['Good. Careful hands build empires that last. Yours are very careful. I notice.']},
    {t:'That must have hurt.',r:['It still does. But here, with you, I do not feel I have to watch my back. That is a rare gift.']}]},
   {open:['* She hands you a carved jade token shaped like a raptor.','Every great one of Dazar’alor gets a token. Yours is for the deadline you met when everyone else was late.'],opts:[
    {t:'I’ll wear it.',r:['* She ties it at your wrist herself, slowly, her fingers lingering.','* She takes your hand and smiles. “I asked you to stay because I want you here. You may ask me the same.”']},
    {t:'Do I get a temple too?',r:['Ha! Perhaps a very small one. With a window. So I can look in on you.']}]}],
  gift:[
   'You ask nothing of me. That is rare. Stay a moment. I would like to ask something of you: dinner.',
   'You give a queen a gift and ask nothing for it. In Zandalar, that is how love begins. Be careful, mon.',
   '* She presses her forehead to yours for a moment, warm and still, the way the Zandalari do with someone close.']},

 // ---------------- Maggie (Home) ----------------
 maggie:{
  visit:[
   {open:['* Maggie stirs her big iron cauldron behind the Workshop, the cow grazing nearby like it owns the place.','You took the rubbish out without being asked. I saw. In Gielinor that’s near enough a proposal.'],opts:[
    {t:'Then I accept.',r:['* She laughs, cheeks pink from the steam, and swats you with her spoon.','Cheeky. Fetch me some firewood first, then we’ll talk terms.']},
    {t:'What’s in the pot?',r:['Bit of this, bit of that. Mostly love. Also turnips. Here, taste. Careful, it bites back.']}]},
   {open:['I’ve parked this cauldron outside Varrock, Draynor, all over. Home’s not the walls, love. It’s who keeps the fire lit.'],opts:[
    {t:'I fixed the hinge on the back door.',r:['Did you? Oh, that squeak’s been driving your wife barmy, I bet. Good lad. Very good lad.']},
    {t:'Is the cow part of home?',r:['The cow is the most important part of home. She’ll tell you so herself, if you listen long enough.']}]},
   {open:['* Maggie sits on an upturned bucket, sleeves rolled, scrubbing a pot with grim determination.','Nobody sings songs about scrubbing pots. They should. Half of every adventure is the washing up after.'],opts:[
    {t:'Grab a rag and help.',r:['* She bumps you with her hip as you work side by side.','Look at that. A man who dries. Don’t tell the other women in the village. They’ll all want you.']},
    {t:'I did my dishes tonight.',r:['Course you did. I could smell the soap on you when you walked up. Smells better than any perfume.']}]},
   {open:['You know what makes a house warm? Not the fire. Folk folding laundry together and arguing about it.','Do that with your wife tonight. Then come tell me who won.'],opts:[
    {t:'She always wins.',r:['Smart woman. Smart man, for letting her. That’s a happy house, that is.']},
    {t:'You’d fold with me?',r:['* She gives you a slow, sideways look over the steam.','I’d fold with you. I’d also make you do the fitted sheets. Fair warning.']}]},
   {open:['* At dusk she ladles out a steaming bowl and presses it into your hands, her fingers wrapped over yours.','For the lad who cleaned his whole workshop today. Eat it all. I’ll know if you don’t.'],opts:[
    {t:'You spoil me.',r:['* She dries her hands and takes yours. “Stay, love. I’d like another kiss, and I’m not shy about asking.”']},
    {t:'What’s in this one?',r:['Secret recipe. If I told you, you’d stop coming round. And I like you coming round.']}]}],
  gift:[
   'Oh, love. You remembered. Put it down and give me your hands. I’ve got a proper thank-you for you.',
   'Oh, you shouldn’t have. You really should have, mind. I’ll put it by the cauldron where I can see it.',
   '* She plants a big, warm kiss on your cheek that smells of woodsmoke and stew. Then another, for luck.']},
};
