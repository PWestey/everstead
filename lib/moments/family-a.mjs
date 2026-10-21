// Family "Spend time together" visits and gift reactions (set A).
// Shape: {id:{visit:[5 moments], gift:[3 lines]}}. Lines starting "* " are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Ariane, Wizard of Light (Faith) ----------------
 ariane:{
  visit:[
   {open:['* The chapel’s empty. Ariane is lighting the evening candles with a spark off her fingertip, muttering rune syllables under her breath.','Don’t tell the Tower I light candles with a fire spell. They’d call it a waste of runes. Hello, by the way. I knew it was you.'],
    opts:[
     {t:'How’d you know it was me?',r:['You hum on the steps. Badly. It’s become my favorite noise in the building.','* She sets the taper down and her fingers brush yours. Every wick in the room flares at once. “That wasn’t me. Probably.”']},
     {t:'Light one with me.',r:['* She guides your hand to the wick, palm warm, taking far longer than one candle needs.','There. That one’s yours. If it goes out, I’ll know you skipped your prayers, {name}.']},
     {t:'Should I stand farther back?',r:['Absolutely not. I’ve calculated the correct distance.','* She hooks your sleeve and tugs you in, close enough to feel her laugh. “That’s the correct distance.”']}]},
   {open:['Walk with me? Years in a tower and I still can’t see the stars properly through a window.','* She leads you up the hill behind the chapel, dimming her lantern step by step until there’s only moonlight.'],
    opts:[
     {t:'What do you see up there?',r:['Saradomin’s order. Guthix’s balance. And one very wonky constellation I swear somebody drew drunk.','* She leans her head on your shoulder and doesn’t move for a long time.']},
     {t:'I’d rather look at you.',r:['That is a terrible line. I’ve read better in first-year spellbooks.','* It works anyway. She goes very quiet and doesn’t let go of your hand.']}]},
   {open:['I’ve been working on a new spell. Healing, sort of. I need a volunteer. You.','* Little motes of light drift off her fingers and settle along your jaw, your collar, the back of your hand.'],
    opts:[
     {t:'What does it do?',r:['It finds where you’re sore. Shoulder. Lower back. You did push-ups this morning, didn’t you?','* She kisses your temple, then your knuckles. “Part of the spell,” she insists, cheeks pink.']},
     {t:'I volunteer. Every time.',r:['Noted. In ink. You can’t take it back now.','* The light fades. She doesn’t step back.']},
     {t:'Is that actually a spell?',r:['* She bites her lip and loses the fight with her smile.','It’s… mostly a spell. Partly an excuse. Don’t write that down.']}]},
   {open:['* Rain. Ariane sits on the chapel steps under a shimmering dome of light, and she lifts one edge for you.','Get in, you’re soaked. I made it for one and a half people. The half is negotiable.'],
    opts:[
     {t:'One and a half sounds perfect.',r:['* You duck in. Her shoulder fits against your chest and the rain hisses off the light above you.','I may have done the sums on purpose.']},
     {t:'You could make it bigger.',r:['I could. I’m choosing not to.','* She grabs your collar and pulls you under.']}]},
   {open:['There you are. I’m stealing you for an hour. The Tower can file a complaint.','* She pulls you into the little library behind the altar and shuts the door with a flick of light.'],
    opts:[
     {t:'Who are we hiding from?',r:['Old Mrs. Hendry. She wants a blessing for her goat again. I want you.','* She steals a kiss, quick and bright, and looks extremely pleased with herself.']},
     {t:'Ariane, the candles…',r:['Will survive an hour. Candles are very resilient. I’ve checked. Will you?','* She takes your face in both hands, and the room fills with warm gold light.']},
     {t:'Steal away.',r:['See, this is why I like you. No paperwork.','* She laughs against your mouth before she kisses you.']}]}],
  gift:['You remembered. Come closer, I want to thank you without shouting across the chapel.','* Her cheeks glow. Literally glow. She hides behind the gift and laughs at herself.','I’m putting it by the altar. I’ll see it every time I pray, which is… a lot. You planned that.']},

 // ---------------- Ahsoka, Wandering Jedi (Faith) ----------------
 ahsoka:{
  visit:[
   {open:['* Ahsoka tosses you a training saber. Hers ignites, white and humming.','You’ve been up early every day this week. I noticed. Let’s see if your reflexes noticed too.'],
    opts:[
     {t:'Don’t go easy on me.',r:['Wasn’t planning to.','* Three moves and you’re flat on your back in the grass. She drops down beside you, grinning. “Again?”']},
     {t:'Maybe I’ll win this time.',r:['* You nearly do. She ends up backed against a tree with your blade at her shoulder, both of you breathing hard.','Huh. Didn’t see that coming. Skyguy would’ve been insufferable about it. I kind of like it.']}]},
   {open:['Sit. Close your eyes. Reach out and tell me what you feel. No peeking.','* She sits cross-legged facing you, knees touching yours.'],
    opts:[
     {t:'You. Very close.',r:['* A long pause. When you open your eyes, she’s watching you instead of meditating.','That’s… not the exercise. But I won’t mark it wrong.']},
     {t:'Calm. For once.',r:['Good. Hang on to it. It slips if you don’t practice. Took me years to figure that out.','* Her hand finds yours in the grass and stays.']}]},
   {open:['* You find her on the mill roof, watching the sky like she’s waiting for a ship that isn’t coming.','I spent most of my life between stars. Some nights I miss it. Most nights I don’t.'],
    opts:[
     {t:'What made you stop?',r:['A village. A few people. One in particular, if you’re fishing.','* The stripes on her montrals darken a shade. She doesn’t look at you, but she smiles.']},
     {t:'I’m glad you landed here.',r:['Me too. Don’t tell anyone I said that.','* She shifts until her shoulder rests against yours, and you watch the sky together.']}]},
   {open:['I picked up a dance on Shili, years ago. Togruta thing. You’re leading.','* She doesn’t wait for an answer. She puts your hand on her waist herself.'],
    opts:[
     {t:'I don’t know the steps.',r:['Nobody does the first time. Feel where I’m going. Same as sparring.','* By the end you know the steps, and she’s forgotten to let go.']},
     {t:'Is this actually a dance?',r:['On Shili, it’s also how you tell someone you’ve picked them.','* She spins out, spins back, and lands against your chest. “Too much?”']},
     {t:'I’ll lead. Keep up.',r:['Oh, is that how it is?','* She laughs, fierce and delighted, and matches you step for step until you’re both dizzy.']}]},
   {open:['* Ahsoka grabs your wrist as you pass the stable and pulls you into the shadow behind it.','Shh. The kids are hunting me. I promised them a clone trooper story and I need five minutes.'],
    opts:[
     {t:'Five minutes of what?',r:['Take a guess.','* She kisses you, quick and certain, the way she does everything. Then she’s around the corner, laughing.']},
     {t:'I could give you away.',r:['You could. You won’t. You’re too soft on those kids.','* She presses a finger to your lips until the footsteps pass. She’s slow to take it away.']}]}],
  gift:['You pay attention. I like that. And I like you. Neither of those is a secret.','* She turns it over in her hands, then looks at you a beat longer than she needs to.','You remembered. Most people don’t. Rex always did. That’s good company to be in.']},

 // ---------------- Lys, Temple Keeper (Faith) ----------------
 lys:{
  visit:[
   {open:['* Lys has two cups poured before you reach the top step. One’s already going cold, because she poured it too early.','You’re late. No, you’re not, I’m early. Sit. Yours has honey. Two spoons. You’ve had a long week.'],
    opts:[
     {t:'How do you always know?',r:['You walk heavier when you’re tired. I listen for it.','* She says it lightly, then hears herself, and hides behind her teacup.']},
     {t:'You spoil me.',r:['Somebody has to. You give it all away by suppertime.','* She tucks her feet up and leans into your side, warm as the tea.']}]},
   {open:['Help me sweep the courtyard? It takes twice as long alone. And it’s boring alone.','* Petals keep drifting down from the old cherry tree, undoing your work as fast as you do it.'],
    opts:[
     {t:'This is a losing battle.',r:['Mm-hm. Sweep anyway. Same as dishes. Same as prayers. It’s never done. That’s sort of the point.','* A petal lands in your hair. She plucks it free, and her fingers stay on your cheek a moment.']},
     {t:'Drop the broom. Dance with me.',r:['In the courtyard? The bell-ringer will gossip for a month.','* She drops hers first. You turn slow circles under the petals while the bells sway.']}]},
   {open:['* It’s late. The lanterns are low and Lys is still kneeling at the little shrine, in her socks.','Oh! I didn’t think anyone would come up this late. I’m glad it’s you. Mind the cat.'],
    opts:[
     {t:'What are you praying for?',r:['The harvest. Old Bren’s knee. The roof leak. You. Mostly you lately, which is very distracting.','* She doesn’t look away this time.']},
     {t:'Can I kneel with you?',r:['* You kneel side by side. After a while her hand slips into yours, and neither of you gets around to amen.']}]},
   {open:['I made you something. Close your eyes. No, properly closed.','* She ties a thin red cord around your wrist, fingers careful and slow, tongue poking out in concentration.'],
    opts:[
     {t:'What is it?',r:['A blessing knot. It means somebody’s thinking about you. Me. I’m the somebody.','* She kisses the knot, then your palm. Her face goes very red.']},
     {t:'Can I open my eyes?',r:['Not yet. Hold still.','* Something soft brushes your lips, quick as a falling petal. “Now you can.” She’s already pretending to sweep.']}]},
   {open:['* Lys tugs you behind the temple to the hot spring, steam curling under the stars.','Feet only. That’s the rule. Don’t make that face at me.'],
    opts:[
     {t:'What face?',r:['That one. The one you’re making right now. Stop it. Okay, don’t stop.','* She sets her cup down. “I’d like another kiss. I’m trying to get better at asking.”']},
     {t:'Feet only. Sure.',r:['I’m a temple keeper. I have rules. Several.','* Her toes find yours under the water. The rules appear to be flexible.']},
     {t:'This is perfect.',r:['Isn’t it? Stay till the steam runs out.','* You do. Somewhere in there, she falls asleep against your arm.']}]}],
  gift:['You’ve been thinking of me? Good. I was beginning to feel rather outnumbered by my own thoughts.','* She holds it to her chest and smiles so wide her eyes nearly close.','You didn’t have to. I’m so glad you did. Come here, let me hug you before I cry.']},

 // ---------------- Keyleth, Druid of the Air Ashari (Faith) ----------------
 keyleth:{
  visit:[
   {open:['Okay, don’t freak out, but I asked the oak about you. Is that weird? That’s weird. Grog says it’s weird.','* Keyleth twists a strand of hair around her finger. The leaves overhead rustle suspiciously like giggling.'],
    opts:[
     {t:'What did the oak say?',r:['That you’re steady. And that I talk about you way too much. Which, rude, but fair.','* She buries her face in her hands. The tips of her ears go bright red.']},
     {t:'A little weird. I like it.',r:['You do? Oh, thank the Wildmother.','* She throws her arms around your neck and nearly takes you both down.']}]},
   {open:['Want to go flying? Well, I fly. You hold on. Tight. Really tight. I’m mostly good at landings now.','* She shifts into a huge eagle and lowers one wing.'],
    opts:[
     {t:'Absolutely.',r:['* You soar over the village. When she lands and shifts back, she’s still in your arms, breathless and laughing.','Okay, so that’s my favorite thing now. That’s just a fact.']},
     {t:'Mostly good at landings?',r:['I said mostly! If you fall, I catch you. I’m a druid. That’s, like, the whole thing.','* She hugs you after, way too long for it to be about flying.']}]},
   {open:['* Keyleth lies in the meadow while flowers slowly grow up around her like she’s a garden bed.','Lie down with me? I’m practicing being still. My dad says a good leader can sit still. I can’t.'],
    opts:[
     {t:'You’re already a good leader.',r:['You really think so? Like, really?','* Flowers burst open all around you both. She covers her face. “That was an accident! Mostly.”']},
     {t:'Lie still. I’ll stay.',r:['* You lie together while vines curl gently around your joined hands. Neither of you minds.']}]},
   {open:['I made a wind spell that only plays music. Totally useless. Scanlan would be so proud. Dance with me anyway?','* A soft breeze hums a melody through the reeds.'],
    opts:[
     {t:'Not useless at all.',r:['* You dance barefoot in the grass. She steps on your foot twice and apologizes four times.','Okay, I’m better at being a bird. But this is nicer.']},
     {t:'I’m a terrible dancer.',r:['Great! Me too! We match! That’s compatibility!','* She stumbles into your chest and doesn’t step back. The wind goes very quiet.']}]},
   {open:['* Keyleth grabs your hand and tugs you through a curtain of willow branches.','Okay. Nobody can see us here. I checked. With the trees. Twice. One of them lied, but I sorted it out.'],
    opts:[
     {t:'Why can’t anyone see us?',r:['Because I want to kiss you and I’m nervous and I don’t want an audience. Is that okay? You can say no. Please don’t say no.','* It’s okay. She tastes like rain and wildflowers, and the willow sighs around you.']},
     {t:'You’re cute when you’re nervous.',r:['I’m not nervous! I’m… okay, I’m extremely nervous.','* She kisses your cheek, squeaks, and hides her face in your shoulder.']},
     {t:'Kiss her first.',r:['* She makes a tiny surprised sound, then melts.','Oh. Okay. Yes. That was the plan. You just did the plan first.']}]}],
  gift:['Oh, you remembered. I had a thank-you planned. It was a kiss. Still interested?','* A sprig of clover pops right out of the ground at your feet. She doesn’t notice.','The trees are going to be so jealous. I’m telling every single one of them.']},

 // ---------------- Shadowheart, Cleric of Selûne (Faith) ----------------
 shadowheart:{
  visit:[
   {open:['* Shadowheart sits on the old stone wall, swinging her legs, watching the moon come up.','You again. Don’t let it go to your head, but I may have been waiting.'],
    opts:[
     {t:'Your secret’s safe with me.',r:['I’ve kept a lot of secrets. Most of them weren’t mine. You, I don’t mind keeping.','* She pats the wall. You sit. Her knee leans into yours.']},
     {t:'Waiting for me?',r:['The moon’s better with company. Don’t make me say that twice. I won’t.','* She glances at you, then away, then back again.']}]},
   {open:['Spar with me. I’m rusty, and Lae’zel only spars to humiliate people.','* She spins her mace once, with a grin that isn’t entirely holy.'],
    opts:[
     {t:'You’re on.',r:['* It ends with her pinning you to the grass, dark hair falling around your face.','Well. That went better than I planned. Or worse. I genuinely can’t tell.']},
     {t:'I’ll go easy on you.',r:['Go easy on me and I’ll never forgive you.','* She sweeps your legs. Then she offers a hand up and conveniently forgets to let go.']}]},
   {open:['* You find her in her little garden, tending night orchids that shine silver under the moon.','These only open after dark. I used to think that made them Shar’s. Turns out they were just shy.'],
    opts:[
     {t:'Like you.',r:['Careful. Sweet talk is how I got tangled up with the last goddess.','* But she’s smiling, and she lets you tuck a bloom behind her ear.']},
     {t:'Teach me their names.',r:['* She does, one by one, guiding your hand to each petal. By the last one she’s barely whispering.']}]},
   {open:['Can’t sleep. Sit by the fire with me? I won’t talk about my past. Much. Maybe a little.','* The fire crackles. She hands you a cup of something warm and spiced. It’s actually good.'],
    opts:[
     {t:'You can, if you want.',r:['I know. That’s exactly why I don’t have to.','* She leans against your shoulder and closes her eyes. Selûne, she admits, feels nearer here.']},
     {t:'Then let’s just sit.',r:['Thank you. I mean it. I’m bad at saying that.','* Sometime past midnight, her fingers lace through yours.']}]},
   {open:['* Shadowheart pulls you into the shadow of the chapel doorway, a finger to her lips.','Festival. Everyone’s drunk or dancing. I have roughly one minute of courage left.'],
    opts:[
     {t:'Then use it.',r:['* She does. The kiss is soft and fierce and over far too fast.','There. Now I’ll be thinking about that all night. Thanks so much.']},
     {t:'I’ll wait for the second minute.',r:['Patient. Annoying. Weirdly attractive.','* She kisses you anyway, slower this time, like she’s made up her mind.']},
     {t:'Courage for what?',r:['Don’t be dense. It doesn’t suit you.','* She tugs your collar down and shows you exactly what for.']}]}],
  gift:['Thoughtful. Dangerous habit, learning exactly what makes me smile. Come here.','* She hides a smile and tucks it away somewhere close to her heart.','I spent years in the dark. You keep bringing me little lights. Stop it. Don’t stop it.']},

 // ---------------- Tyrande, High Priestess of the Moon (Marriage) ----------------
 tyrande:{
  visit:[
   {open:['* Tyrande waits at the edge of the moonwell, silver light rippling across her face.','I have stood watch for ten thousand years. Tonight, Elune will forgive me if I sit.'],
    opts:[
     {t:'Then sit with me.',r:['* She draws you down to the water’s edge and rests her palm over your heart.','Steady. Good. You hide nothing from me, mortal. I find that I like it.']},
     {t:'Ten thousand years is a long watch.',r:['Every night of it chosen. Do the same at home, with your wife, and you will last as long as I have.','* Her eyes glint, warm and amused, and she does not release your hand.']}]},
   {open:['Ride with me. My nightsaber is restless. So, I confess, am I.','* She swings up behind you and wraps her arms around your waist.'],
    opts:[
     {t:'Faster.',r:['* The forest blurs. Her laughter, low and wild, is right in your ear.','You surprise me, mortal. No one has surprised me since the Third War.']},
     {t:'Slower. I want this to last.',r:['Wise.','* The great cat pads through silver glades. Tyrande rests her cheek against your back the whole way.']}]},
   {open:['Draw your bow. My Sentinels train for decades before I let them near a target. You have tonight.','* She stands behind you, guiding your arms, her breath warm at your ear.'],
    opts:[
     {t:'Hard to focus like this.',r:['That is the lesson. Focus anyway.','* You loose. It strikes true. She murmurs something approving in Darnassian against your neck.']},
     {t:'Show me how it’s done.',r:['* She looses three arrows in one breath. All three split the same mark.','Now. One kiss per arrow. I keep count.']}]},
   {open:['* Tyrande is unbraiding her long hair by the fire, moonlight caught in every strand.','Help me with this. Malfurion used to, when he was not asleep in the Dream for a century. A small thing. It matters.'],
    opts:[
     {t:'Gladly.',r:['* You work slowly. She closes her eyes and hums something older than your whole kingdom.','The small rituals are what hold. Brush your wife’s hair tonight. See what it does.']},
     {t:'You still miss him.',r:['Every time he wanders off into the Dream. And still I live. Love that cages is not love.','* She turns and kisses your knuckles, gentle and grave.']}]},
   {open:['The temple is empty tonight. The Mother Moon is all the light we need.','* She leads you up the steps by the hand, eyes never leaving yours.'],
    opts:[
     {t:'Lead the way, Priestess.',r:['* The doors close behind you on a sea of moonlight.','* She draws you close and waits for your answer. “Yes? Then let the moon keep our company.”']},
     {t:'You’re going to be trouble.',r:['I led armies before your ancestors learned fire. Yes. I am trouble.','* She kisses you beneath the open roof, unhurried as the moon.']},
     {t:'Stay here with me instead.',r:['Bold. I approve of bold.','* She sinks onto the steps beside you and pulls you into a long, silvered kiss.']}]}],
  gift:['I accept your gift. And if you are offering your company, I would like that even more.','* She presses it to her lips, then to yours, and smiles like a secret older than mountains.','You remembered what I love. Most mortals remember only that I am frightening.']},

 // ---------------- Padmé, Senator of Naboo (Marriage) ----------------
 padme:{
  visit:[
   {open:['* Padmé leaves the council hall and pulls the pins out of her elaborate hair one by one, with a groan.','Six hours on grain tariffs. Take me somewhere nobody says the word “motion.” I’m begging.'],
    opts:[
     {t:'The lake. Right now.',r:['* You row her out to the middle. She trails her fingers in the water and finally laughs.','There was a lake house at Varykino. I used to swim out to the island. I forgot I needed this.']},
     {t:'Picnic in the meadow?',r:['Yes. You bring the food. I’ll bring myself, minus three pounds of hairpins.','* She lies in the grass beside you, hair loose, and steals your bread without apology.']}]},
   {open:['Teach me a village dance. Not court steps. Something people do when they’re actually happy.','* She kicks off her slippers and holds out both hands.'],
    opts:[
     {t:'Follow my lead.',r:['* She does, laughing as you spin her across the barn floor, skirts flying.','My handmaidens would faint. This is so much better than a state banquet.']},
     {t:'You lead. You were a queen.',r:['I was elected. It’s not the same. But fine.','* She leads you right into a corner and kisses you there, slightly out of breath.']}]},
   {open:['* Padmé sits in the window seat of the old library, a letter in her lap.','I used to write letters I never sent. I hid them in the lining of my travel cloak.'],
    opts:[
     {t:'Who were they for?',r:['Someone I loved too much and told too little. I’m trying to get better at the telling part.','* She folds the letter and presses it into your hand. “That one’s yours. Read it later. Not in front of me.”']},
     {t:'Write me one.',r:['I already did. Check your pocket.','* She’s slipped it in while you weren’t looking, and her hand rests on your chest a moment longer than it needs to.']}]},
   {open:['Every window on this street has a face in it. I’ve spent my whole life being careful.','* She walks beside you through the market, close enough to brush your arm.'],
    opts:[
     {t:'Then stop being careful.',r:['* She threads her arm through yours, chin up, in full view of everyone.','Let them talk. I’ve faced down the whole Senate. I can survive the baker.']},
     {t:'Let’s give them something to talk about.',r:['* She grins and kisses your cheek in the middle of the square.','Senator Amidala, causing a scandal by the vegetable stall. Finally.']}]},
   {open:['* At dusk, Padmé takes your hand and leads you out onto a balcony above the village.','No sessions tomorrow. No messengers. I told my staff I was ill. I’ve never lied to them before.'],
    opts:[
     {t:'Then we have all night.',r:['All of it. Every hour.','* She rises on her toes and kisses you as the lamps below flicker on one by one.']},
     {t:'You’re beautiful in this light.',r:['You say that in every light. I’ve started keeping track.','* She laughs softly and pulls you down by the collar.']},
     {t:'Hold her close.',r:['* She sighs and rests against you, listening to your heartbeat.','This. This is what all those speeches were supposed to be for.']}]}],
  gift:['You chose this yourself. That’s why I love it. And why I’d like you to come closer.','* She wraps both hands around it like it might slip away, and kisses your cheek.','It’s perfect. Thoughtful, and no favor wanted in return. You have no idea how rare that is in politics.']},

 // ---------------- Yennefer, Sorceress (Marriage) ----------------
 yennefer:{
  visit:[
   {open:['* A portal crackles open and Yennefer steps out, smelling of lilac and gooseberries, brushing off her sleeve.','You have one hour. Most men bore me in twenty minutes, so don’t squander it.'],
    opts:[
     {t:'Dinner. I cooked.',r:['You cooked. For a sorceress. That’s either brave or suicidal.','* She tries it, raises one eyebrow, then takes your plate too. “Acceptable. Annoyingly acceptable.”']},
     {t:'I’ll make it worth two.',r:['Arrogant. Good. Humble men bore me to tears.','* She hooks a finger in your belt and pulls you closer. “Prove it.”']}]},
   {open:['I’m bored. Spar with me. Swords, no magic. I want it fair.','* She draws a slim blade with a smile that promises nothing about this will be fair.'],
    opts:[
     {t:'Don’t cheat.',r:['I don’t cheat. I simply refuse to lose.','* She disarms you in three moves and lays the blade flat against your chest. “Now kiss me.”']},
     {t:'Fair is boring.',r:['Finally. Someone with sense.','* Sparks spit from her fingertips. You end up laughing, tangled together in the grass.']}]},
   {open:['* You find her in her tower, black hair loose, a glass of Est Est in her hand.','Come in. Shut the door. I’ve warded the stairs. Nobody interrupts me twice.'],
    opts:[
     {t:'What kind of interruptions?',r:['All of them. The last bard who knocked spent a week as a very confused frog.','* She sets down the wine and stands very close. “Any other questions?”']},
     {t:'You planned this.',r:['I plan everything. You were on the list. Near the top.','* She pours you a glass, then drinks from yours instead, eyes on you the whole time.']}]},
   {open:['I have no patience for half-hearted love. So. Honestly. How are things with your wife?','* She watches you over the rim of her cup, violet eyes sharp.'],
    opts:[
     {t:'I’m showing up. Every day.',r:['Good. Keep choosing her. Especially when it’s inconvenient. That’s the only kind that counts.','* Her voice gentles. She touches your cheek, briefly, like she didn’t mean to.']},
     {t:'Better than it was.',r:['Better is where you start, not where you stop.','* She leans in close enough to whisper. “Do better. Take her somewhere tomorrow.”']}]},
   {open:['* Yennefer grabs your wrist and steps backward through a shimmering portal.','Somewhere quiet. Just us. If you get portal-sick on my boots, I’m leaving you there.'],
    opts:[
     {t:'Where are we?',r:['I said don’t ask. Oh, I didn’t? Well. Don’t.','* She kisses you, then stays close. “Yes, again. I thought I’d made myself clear.”']},
     {t:'You’re dangerous.',r:['You’re only noticing now? I’m almost insulted.','* She kisses you like a storm coming in off the sea.']},
     {t:'Follow without a word.',r:['Look at that. Obedience. It suits you.','* Her laugh echoes as the portal snaps shut behind you.']}]}],
  gift:['Excellent taste. In gifts, too. Come here and accept a less restrained thank-you.','* She inspects it, unimpressed, then quietly slips it into her pocket.','It isn’t lilac. It isn’t gooseberries. It’s… lovely, actually. Thank you. Don’t make me repeat it.']},

 // ---------------- Briget, Rose Princess (Marriage) ----------------
 briget:{
  visit:[
   {open:['* Briget is setting a tiny table in the rose garden: two cups, one candle, and far too many flowers.','Every day deserves a little ceremony! I named today. It’s Tuesday the Splendid. Sit, darling.'],
    opts:[
     {t:'You did all this?',r:['I did! I also cut three roses I wasn’t supposed to. Don’t tell the gardener.','* She pours, then leans across the table to kiss the tip of your nose.']},
     {t:'Only if you sit on my lap.',r:['Shameless!','* She does it anyway, cheeks pink, and feeds you a sugared petal.']}]},
   {open:['Dance with me. Here, in the kitchen. There’s no orchestra, but I’ve never once needed one.','* She slips her hand into yours and begins to sway.'],
    opts:[
     {t:'Hum something.',r:['* She hums an old palace waltz against your shoulder. The kettle starts screaming. Neither of you moves.']},
     {t:'Dip her.',r:['Oh!','* She laughs, breathless, arms locked around your neck. “Again! Do it again, and lower!”']}]},
   {open:['* There’s a letter under your door. It smells of roses and is sealed with entirely too much wax.','“Meet me at the bridge at sunset. Wear something nice. Bring your heart. Not literally. Love, B.”'],
    opts:[
     {t:'Go to the bridge.',r:['* She’s waiting in a gown the color of dusk. She curtsies perfectly, then flings herself at you.','You came! I rehearsed that curtsy for an hour in case you didn’t.']},
     {t:'Write one back first.',r:['* You leave your reply on her windowsill. Later she runs to you clutching it, eyes shining.','Nobody has ever written back! I’m having it framed. Both sides.']}]},
   {open:['I’ve been pruning the roses. They sulk if you skip a day. So do I, honestly.','* There’s a fresh thorn scratch across her thumb.'],
    opts:[
     {t:'Kiss it better.',r:['* You do. She forgets to breathe for a second.','That is not how medicine works. Do it again.']},
     {t:'Let me help.',r:['* You work side by side till dusk. Petals in your hair, dirt on your hands.','You know, if you did this with your wife on Saturday, she’d swoon. Just a thought. A very good thought.']}]},
   {open:['* Briget pulls you through a hidden gate behind the castle hedges.','This is my secret garden. You’re the first person in. Mind the rose called Lord Prickles.'],
    opts:[
     {t:'It’s beautiful.',r:['So are you, standing in it. That was romantic, wasn’t it? I practiced.','* She kisses you under an arch of white roses.']},
     {t:'Why show me?',r:['Because a secret only gets good once you share it with the right person.','* She takes your face in her gloved hands and kisses you, slow.']},
     {t:'What else are you hiding?',r:['Wouldn’t you like to find out?','* She tugs you down onto the bench, giggling, and the roses close in around you.']}]}],
  gift:['Oh, darling. Set it on the table. I want both your hands for my thank-you.','* She curtsies deeply, then ruins it entirely by flinging her arms around you.','I’ll press a rose beside it so I remember the date. You spoil me. Please never stop.']},

 // ---------------- Kitai, Marat Warrior (Marriage) ----------------
 kitai:{
  visit:[
   {open:['* Kitai drops out of a tree directly in front of you, grinning.','Aleran. You walk like a gargant. I could have killed you three times on the way here.'],
    opts:[
     {t:'And yet you didn’t.',r:['I was bored. Also, you are more entertaining alive. Slightly.','* She bumps your shoulder hard enough to stagger you, then catches your arm.']},
     {t:'Teach me to be quieter.',r:['Ha! You will regret asking.','* She runs you ragged through the woods, then tackles you into a pile of leaves, laughing.']}]},
   {open:['Wrestle me. If you win, I do your chores for a week. If I win, you do mine. And you will.','* She’s already circling, crouched low, eyes bright.'],
    opts:[
     {t:'Deal.',r:['* You lose. Spectacularly. She sits on your chest, smug and breathless.','I am going to enjoy this week very much, chala.']},
     {t:'What if I don’t want to win?',r:['Then you are smarter than most Alerans. That is a low fence to jump.','* She pins you anyway and kisses you hard, then hops off. “Chores still apply.”']}]},
   {open:['* Kitai lies in the grass watching the clouds, chewing on a stem.','Your people spend all day inside boxes. Lie down. Be useless with me. It is good for you.'],
    opts:[
     {t:'Useless sounds wonderful.',r:['Good. There is hope for you.','* She rolls onto her side and rests her head on your chest, humming something wild and old.']},
     {t:'I have work to do.',r:['It will still be there. I may get bored and leave.','* She grabs your shirt and drags you down into the grass beside her.']}]},
   {open:['I borrowed a horse. Do not look at me like that. The Horse Clan does not steal. We borrow loudly.','* She’s already up, bareback, one hand held out to you.'],
    opts:[
     {t:'Climb on.',r:['* You ride hard across the fields. She whoops like a wild thing the whole way.','Your heart is pounding. Good. So is mine.']},
     {t:'We’re going to be in trouble.',r:['You say that as if it is a bad thing.','* She hauls you up behind her, laughing, and you’re off.']}]},
   {open:['* Kitai catches you by the collar and drags you around the back of the smithy.','I missed you today. I do not like missing things. Fix it.'],
    opts:[
     {t:'How?',r:['Like this, foolish Aleran.','* She kisses you fiercely, nips your lip, then lets you go. “Better.”']},
     {t:'I missed you too.',r:['Good. That is correct.','* For one rare moment her eyes go soft. She presses her forehead to yours.']},
     {t:'You’re very bossy.',r:['And you like it. Do not lie. I can smell it on you.','* She doesn’t wait for an answer. She doesn’t need one.']}]}],
  gift:['A courting gift. Good. I prefer a man who makes his intentions clear. Here are mine: stay.','* She sniffs it suspiciously, then grins like a wolf.','Not bad, Aleran. Not bad at all. Come here. I will thank you properly.']},

 // ---------------- Vin, Mistborn (Fatherhood) ----------------
 vin:{
  visit:[
   {open:['* Vin drops off a rooftop, mistcloak tassels trailing, and lands without a sound in front of you.','You’re late. Come on. City looks better from the top. Fewer people.'],
    opts:[
     {t:'I can’t fly like you.',r:['It’s not flying. It’s Pushing. Hold on and don’t scream.','* She wraps an arm around your waist, drops a coin, and Pushes. The whole village falls away beneath you.']},
     {t:'Lead the way.',r:['* She drags you up a ladder to the bell tower. The mists curl below like a river.','I used to sit up here alone. I don’t hate it with you here.']}]},
   {open:['Spar with me. I want to see if you trust your gut.','* She circles you, light on her feet, a glass dagger flicking between her fingers.'],
    opts:[
     {t:'Ready.',r:['* She’s on you in a blur, then has you pinned against the wall, face inches from yours.','Your instincts are awful. Your face is fine, though.']},
     {t:'You’ll win anyway.',r:['Probably. Doesn’t matter. You came. Most people don’t come back after the first time.','* She bumps her shoulder into yours, softly. For Vin, that’s nearly a hug.']}]},
   {open:['* You find Vin in the kitchen, staring at a loaf of bread like it might run off.','Old habit. On the street you hid food or you didn’t eat. Reen taught me that. Hard to unlearn.'],
    opts:[
     {t:'There’s always enough here.',r:['I know. You make sure of it. Every night, your kids eat first. I watch.','* She tears the loaf in half and hands you the bigger piece. That’s Vin for “I love you.”']},
     {t:'Hide it with me, then.',r:['* She laughs, surprised, and drags you into the pantry. You split the loaf in the dark, knees touching.']}]},
   {open:['There’s a ball tonight. I hate balls. Too many nobles, not enough exits. I want to go with you anyway.','* She’s in a gown and looks deeply uncomfortable and beautiful about it.'],
    opts:[
     {t:'You look stunning.',r:['Don’t. If I blush, I lose my cover.','* She blushes anyway and takes your arm.']},
     {t:'Let’s skip it and dance here.',r:['Oh, thank the Survivor.','* She kicks off her shoes and steps onto your feet, swaying slowly in the mist.']}]},
   {open:['* Vin pulls you into a dark alley and presses her back to the wall.','Someone’s tailing us. Act like we’re… you know. Together. Closer. Closer than that.'],
    opts:[
     {t:'Pretend?',r:['* She looks up at you. The pretending doesn’t last long.','* She holds your hand firmly. “I’m not looking for an exit tonight. I want to stay.”']},
     {t:'Who’s following?',r:['Nobody. I lied. I wanted an excuse. I’m bad at asking.','* She kisses you, quick and sure, then slips away into the mists.']},
     {t:'Kiss her.',r:['* She tenses, then melts, fingers curling into your shirt.','I don’t trust people. Ever. I trust you. That’s… terrifying, actually.']}]}],
  gift:['You picked this for me. Not because you needed something. Come sit down. I want to be close to you.','* She turns it over and over, suspicious, then smiles like sun breaking through ash.','I’m keeping this somewhere safe. Not hidden. Just safe. That’s new.']},

 // ---------------- Hera, Captain of the Ghost (Fatherhood) ----------------
 hera:{
  visit:[
   {open:['* Hera’s flat on her back under the Ghost, grease on one cheek, a hydrospanner in hand.','Hand me the other spanner, love. And stop staring. Actually, keep staring. Chopper’s no fun to be watched by.'],
    opts:[
     {t:'You’ve got grease on your face.',r:['Do I? Well, fix it, then.','* You wipe it off with your thumb. She catches your wrist and holds it there a moment.']},
     {t:'Need a hand under there?',r:['Always. Slide in, there’s room if you don’t mind Chopper’s elbow.','* You lie shoulder to shoulder under the hull. She doesn’t need help. She wanted company. Chopper beeps something rude.']}]},
   {open:['Fly with me? Short hop. Jacen’s finally asleep and I need some sky.','* The Ghost hums to life. She pats the co-pilot’s seat.'],
    opts:[
     {t:'Punch it.',r:['* She grins and throws the throttle forward. You climb out of the clouds into starlight.','There. Now I can breathe.']},
     {t:'Take it slow.',r:['* She glides low over the moonlit fields. Her hand finds yours on the console.','Steady hands. That’s all a crew needs. A family, too. You’ve got them.']}]},
   {open:['* Hera sits on the Ghost’s ramp, watching the stars.','Some days I wonder if I’m enough for them. The crew. My boy. You ever feel that way?'],
    opts:[
     {t:'Every day.',r:['Then you’re a good dad. The bad ones never ask.','* She rests her head on your shoulder. “You’re doing better than you think. I see it.”']},
     {t:'You’re an amazing mother.',r:['And you’re a good father. No, don’t argue with your captain.','* She kisses your cheek, then looks back out at the stars, smiling.']}]},
   {open:['Spar with me. Captain’s orders. Zeb’s too big and Sabine cheats.','* She cracks her knuckles, mischief bright in her green eyes.'],
    opts:[
     {t:'Yes, Captain.',r:['* She flips you neatly onto your back and leans over you, laughing.','You’re supposed to dodge, love. That’s rule one.']},
     {t:'Make me.',r:['* She does. You end up tangled together on the hangar floor, breathless.','Mm. We should put this on the schedule. Weekly.']}]},
   {open:['* Hera pulls you into the Ghost’s cockpit and seals the hatch.','The crew can wait. For once, so can the Rebellion.'],
    opts:[
     {t:'What did you have in mind?',r:['Captain’s privilege. Look it up.','* She brushes your hand with hers. “Stay, love. I’m asking as Hera. No captain’s orders.”']},
     {t:'The whole Rebellion?',r:['The whole thing. Tonight you outrank it.','* She kisses you, slow and warm, while the stars drift past the viewport.']},
     {t:'Pull her close.',r:['* She laughs softly and leans into you.','Mm. Steady hands. I called that the first day.']}]}],
  gift:['That’s thoughtful, love. Put it somewhere safe. Then give me a minute of your full attention.','* She tucks it inside her flight jacket, right over her heart.','Thank you, love. You’re a good man. Don’t let anyone talk you out of it. Especially you.']},

// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
 liko:{
  visit:[
   {open:['* Liko returns from a survey with rain on her coat and a neatly annotated map.','I found a quiet place by the harbor. I’d like to take you there tonight.'],
    opts:[
     {t:'A date?',r:['Yes. I’ve been trying to find a graceful way to ask.','Apparently asking works.']},
     {t:'Tell me about the place.',r:['Good tea, a view of the boats, and no one rushing us.','I thought you’d like it. I know I’d like you there.']}]},
   {open:['* She spreads a map across the table, then leaves the chair beside her free.','I’ve crossed this valley a dozen times. I’d like to see it with you.'],
    opts:[
     {t:'Show me your favorite route.',r:['Here, along the water.','We can take our time. I’m more interested in the company than the distance.']},
     {t:'What makes it your favorite?',r:['It’s quiet enough to hear someone think.','I’d like to know what’s on your mind.']}]},
   {open:['* Liko closes her field notebook when you arrive.','I’ve spent the afternoon writing. I’d rather listen to you for a while.'],
    opts:[
     {t:'I thought you’d be busy.',r:['I was. Now I’m choosing to stop.','Sit beside me. I’ve been looking forward to this.']},
     {t:'You saved me a seat.',r:['I did.','I’m getting better at being obvious about wanting your company.']}]},
   {open:['* She leans on the harbor railing, watching the boats settle for the evening.','I used to confuse being quiet with not asking for anything. I’m done with that.'],
    opts:[
     {t:'What would you like?',r:['Dinner with you.','And another evening like this, if tonight goes well.']},
     {t:'You can ask me.',r:['Then stay a while.','I like you. That part isn’t complicated.']}]},
   {open:['* Liko puts away her notebook and offers you her hand.','I enjoyed our evening. I’d like another, and I’d like to kiss you before you go.'],
    opts:[
     {t:'I’d like that.',r:['Good. Come closer.','I’m glad neither of us has to guess anymore.']},
     {t:'Another date, definitely.',r:['I’ll pick somewhere new. Though I’m rather pleased with the company I’ve already found.']}]}],
  gift:['You remembered my favorite color. I’m keeping this, and I’d like to keep your company tonight.','I remembered you on my way home, too. I was hoping you’d have time for dinner with me.','* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 // ---------------- Wanda, Scarlet Witch (Fatherhood) ----------------
 wanda:{
  visit:[
   {open:['* Wanda’s in her kitchen, scarlet light floating plates into place.','Sit. I made paprikash. Don’t ask where the boys are. They’re fine. Asleep. Mostly.'],
    opts:[
     {t:'Smells amazing.',r:['It’s my mother’s recipe. I only make it for people I…','* She stops, hearing what she was about to say, then serves you anyway with a small smile.']},
     {t:'You didn’t have to.',r:['I wanted to. That’s different. Eat before it gets cold.','* She sits across from you, chin in hand, and watches you eat like it’s her favorite show.']}]},
   {open:['Dance with me? I always wanted to dance in a living room. Like the old sitcoms. Black and white.','* A record player starts up on its own. Red sparks flicker at her fingertips.'],
    opts:[
     {t:'Like the old sitcoms.',r:['* She laughs and twirls into your arms. The lights dim themselves. Somewhere, a studio audience sighs.','I like this episode best.']},
     {t:'Let me lead.',r:['* She leans her head on your chest and sways, eyes closed.','You make it feel real. Not like something I made up.']}]},
   {open:['* Wanda sits on the porch at dusk, hands glowing faintly red.','Some days it’s too loud. All of it. Will you just sit with me until it’s quiet?'],
    opts:[
     {t:'As long as you need.',r:['* You sit. Slowly the glow fades. She rests her head on your shoulder.','Thank you. You’re very… solid. Pietro was like that. Fast, but solid.']},
     {t:'Take my hand.',r:['* She does. The scarlet light winds around both your fingers like a ribbon.','It’s never done that before. It likes you. So do I.']}]},
   {open:['I made us a little world. Only for an hour, I promise. Come look.','* The air ripples. Suddenly you’re in a sunlit meadow with a picnic blanket waiting.'],
    opts:[
     {t:'This is incredible.',r:['It’s a borrowed hour. I’ll give it back. But I wanted you in it.','* She lies back on the blanket and pulls you down beside her.']},
     {t:'Is this real?',r:['Real enough. You’re real. That’s the part I care about.','* She kisses you softly, and the sun seems to brighten.']}]},
   {open:['* Wanda takes your hand and leads you up the stairs of her quiet house.','The boys are asleep. Actually asleep, I checked twice. I want one minute that’s just mine.'],
    opts:[
     {t:'It’s yours.',r:['* She leans in the doorway, looking up at you, a soft red glow in her eyes.','* Her fingers settle in yours. “No spell. I wanted to kiss you, and you wanted to stay.”']},
     {t:'What will you do with it?',r:['This.','* She kisses you slowly, and the hallway lights fade one by one to warm scarlet.']},
     {t:'Pull her close.',r:['* She sighs and melts into you.','How do you always know when? It’s a little unfair.']}]}],
  gift:['You thought of me while you were out. I like knowing I was on your mind. You’ve been on mine.','* A faint scarlet glow surrounds the gift for a moment. She’s smiling.','I’ll keep it on the windowsill. I’ll see it every morning while I make the boys breakfast.']},

 // ---------------- Jean, Phoenix (Fatherhood) ----------------
 jean:{
  visit:[
   {open:['* Jean is grading papers on the schoolhouse porch. She smiles up at you before you’ve said a word.','Hi. I heard you from the gate. Telepathically. You’re projecting, by the way. Loudly.'],
    opts:[
     {t:'Sorry about that.',r:['Don’t be. It beats Logan’s inner monologue. That’s mostly swearing.','* She tucks a red curl behind her ear and pats the step beside her.']},
     {t:'What am I thinking now?',r:['* She tilts her head, then goes pink to the roots of her hair.','That’s… very specific. Sit down before I lose my place in this essay.']}]},
   {open:['Help with the evening class? The kids get twice as much done when you visit. Half the noise, too.','* She floats a stack of books over to you with a flick of two fingers.'],
    opts:[
     {t:'Of course.',r:['* You teach together. She keeps catching your eye over the kids’ heads.','You’re good with them. You actually listen. The Professor would like you.']},
     {t:'Only if I get a reward after.',r:['In front of the children? Bold.','* She laughs, and later, after class, kisses you in the empty hallway.']}]},
   {open:['* Jean floats cross-legged above the lake, eyes closed, hair drifting in a wind that isn’t there.','Come up. I’ve got you. I’ve lifted the Blackbird. I can lift you.'],
    opts:[
     {t:'I trust you.',r:['* You rise gently into the air. She takes both your hands, and you hang together above the reflected stars.','See? Nothing to be scared of. Breathe.']},
     {t:'Don’t drop me.',r:['Never.','* She pulls you into her arms instead, laughing. “There. Now you can’t fall.”']}]},
   {open:['Spar with me? The Danger Room’s booked. Telekinesis versus your reflexes. I’ll go easy.','* Leaves lift and swirl around her.'],
    opts:[
     {t:'Don’t go easy.',r:['* She doesn’t. You end up gently pinned to a tree by an invisible hand, Jean smirking inches away.','I win. Again. That’s four.']},
     {t:'Easy is fine.',r:['Smart man. Most of my students take years to learn that.','* She tugs you forward with her mind and catches you in a kiss.']}]},
   {open:['* Jean pulls you into the empty schoolhouse and the door clicks shut by itself.','Kids are gone. Staff’s gone. It’s just us. And I can hear exactly what you want.'],
    opts:[
     {t:'Then you already know.',r:['* She smiles slowly and walks you back until you bump the bookshelf.','* She sets the books aside. “Tell me you’d like another kiss. I want to hear it.”']},
     {t:'Stop reading my mind.',r:['Then stop thinking about kissing me. You’re really bad at hiding it.','* You don’t stop. Neither does she.']},
     {t:'Kiss her.',r:['* Warmth floods the room, soft gold and red, and every lamp flares at once.','Okay. That’s better than reading about it.']}]}],
  gift:['I could have peeked. I didn’t. I like being surprised by you. Especially like this.','* Her cheeks go as red as her hair. She hugs it close.','It’s going on my desk. The kids will ask, and I’ll tell them it’s from someone special. They’ll groan.']},
};
