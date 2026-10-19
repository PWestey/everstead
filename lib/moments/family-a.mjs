// Family "Spend time together" visits and gift reactions (set A).
// Shape: {id:{visit:[5 moments], gift:[3 lines]}}. Lines starting "* " are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Ariane, Wizard of Light (Faith) ----------------
 ariane:{
  visit:[
   {open:['* The chapel is empty. Ariane is lighting the evening candles one by one, and she doesn’t look up when you come in.','I knew it was you. The flames lean toward you when you walk in. They’ve been doing it for weeks.'],
    opts:[
     {t:'Maybe they know something you don’t.',r:['Oh, they know plenty. They’re terrible at keeping secrets.','* She sets the taper down and lets her fingers brush yours. Every candle in the room flares at once.']},
     {t:'Light one with me.',r:['* She guides your hand to the wick. Her palm is warm, and she takes far longer than one candle needs.','There. Now it’s ours. Don’t let it go out, {name}.']},
     {t:'Should I stand farther away, then?',r:['Don’t you dare.','* She catches your sleeve and pulls you back to her side, close enough that you can feel her laugh.']}]},
   {open:['Walk with me? I need to see the stars without a tower in the way.','* She leads you up the hill behind the chapel, her lantern glowing softer with every step until there’s only moonlight.'],
    opts:[
     {t:'Tell me what you see up there.',r:['Small lights that keep burning whether anyone’s watching or not. Like your prayers this week.','* She leans her head on your shoulder and stays there.']},
     {t:'I’d rather look at you.',r:['That line should not work on a wizard of my standing.','* It works. She is very quiet for a while, and she doesn’t let go of your hand.']}]},
   {open:['I’ve been practicing a new spell. It needs a willing subject.','* Little motes of light drift from her fingers and settle along your jaw, your collar, the back of your hand.'],
    opts:[
     {t:'What does it do?',r:['It shows me where you’re tired. I’m going to fix each spot.','* She kisses your temple. Then your knuckles. “Healing magic,” she insists, cheeks pink.']},
     {t:'I volunteer. Every time.',r:['Careful. I’ll hold you to that.','* The light fades, but she doesn’t step back.']},
     {t:'Is this actually a spell?',r:['* She bites her lip and fails to hide a smile.','It’s a very old spell. Mostly it’s an excuse to stand this close.']}]},
   {open:['* It’s raining. Ariane is on the chapel steps under a shimmering dome of light, and she lifts one side of it for you.','Get in here before you’re soaked. There’s just enough room for two. Barely.'],
    opts:[
     {t:'Barely sounds perfect.',r:['* You duck in. Her shoulder fits against your chest and the rain hisses off the light above you.','I may have made it small on purpose.']},
     {t:'You could make it bigger.',r:['I could. I won’t.','* She hooks a finger in your collar and draws you under.']}]},
   {open:['You came. Good. I’m stealing you for an hour.','* She pulls you into the tiny library behind the altar and shuts the door with a flick of light.'],
    opts:[
     {t:'What are we hiding from?',r:['The whole village. They all want a blessing. I just want you.','* She steals a kiss, quick and bright, then looks very pleased with herself.']},
     {t:'Ariane, the candles…',r:['Will survive an hour without me. Will you?','* She takes your face in both hands, and the room fills with warm, golden light.']},
     {t:'Steal away.',r:['That’s the spirit.','* She laughs against your mouth before she kisses you.']}]}],
  gift:['For me? You’re making it very hard to keep my mind on holy things.','* Her cheeks glow, quite literally. She hides her face behind the gift and laughs.','I’ll keep it by the altar. Then I’ll think of you every time I pray, which is… often.']},

 // ---------------- Ahsoka, Wandering Jedi (Faith) ----------------
 ahsoka:{
  visit:[
   {open:['* Ahsoka tosses you a training saber hilt. Hers ignites with a soft hum.','You’ve been showing up every day. Let’s see if your reflexes have kept pace with your discipline.'],
    opts:[
     {t:'Don’t go easy on me.',r:['I never do.','* Three moves later you’re flat on your back and she’s straddling the grass beside you, grinning. “Again?”']},
     {t:'Maybe I’ll win this time.',r:['* You almost do. She ends up pinned against a tree, your blade at her shoulder, both of you breathing hard.','Huh. I didn’t see that coming. I don’t hate it.']}]},
   {open:['Sit with me. Close your eyes. Reach out and tell me what you feel.','* She sits cross-legged facing you, knees touching yours.'],
    opts:[
     {t:'I feel you. Very close.',r:['* A long pause. When you open your eyes, she’s watching you instead of meditating.','That’s… not what I meant. But it’s not wrong.']},
     {t:'Calm. For once.',r:['Good. Hold on to that. It takes practice, same as prayer.','* Her hand finds yours on the grass and stays.']}]},
   {open:['* You find her on the roof of the mill, watching the sky like she’s waiting for a ship.','The stars never stop moving. Some nights I miss that. Most nights I’m glad I stopped.'],
    opts:[
     {t:'What made you stop?',r:['A village. Some people. One person in particular.','* Her montrals darken a shade. She doesn’t look at you, but she smiles.']},
     {t:'I’m glad you stopped here.',r:['So am I.','* She shifts closer until her shoulder rests on yours, and you watch the sky together.']}]},
   {open:['I picked something up on my travels. A dance from Shili. You lead.','* She doesn’t wait for an answer. She takes your hands and puts one on her waist.'],
    opts:[
     {t:'I don’t know the steps.',r:['Neither does anyone the first time. Trust me. I’ll guide you.','* She does. By the end you’ve learned the steps, and she’s forgotten to let go.']},
     {t:'Is this really a dance?',r:['On Shili it’s also how you tell someone they’re yours.','* She spins out, spins back, and lands against your chest. “Too forward?”']},
     {t:'I’ll lead. Keep up.',r:['Oh, you think so?','* She laughs, fierce and delighted, and matches every step until you’re both dizzy.']}]},
   {open:['* Ahsoka catches you by the wrist as you pass the stable and pulls you into the shadows behind it.','Shh. The children are hunting for me. I promised them a story and I need five minutes.'],
    opts:[
     {t:'Five minutes of what?',r:['Of this.','* She kisses you, quick and certain, the way she does everything. Then she’s gone around the corner, laughing.']},
     {t:'I could give you away.',r:['You could. You won’t.','* She presses a finger to your lips and holds it there until the footsteps pass. She doesn’t move it right away.']}]}],
  gift:['Snips would’ve said something clever. I’m just going to say thank you, and mean it.','* She turns it over in her hands, then looks at you a beat longer than she needs to.','You remembered. People usually don’t. I like that you do.']},

 // ---------------- Lys, Temple Keeper (Faith) ----------------
 lys:{
  visit:[
   {open:['* Lys has two cups of tea poured before you even reach the temple steps.','I felt you coming up the path. Sit. Yours is the one with honey. I made it the way you like.'],
    opts:[
     {t:'How do you always know?',r:['I pay attention to the things I love.','* She says it lightly, then realizes what she said, and hides behind her teacup.']},
     {t:'You spoil me.',r:['Someone should. You give so much all day.','* She tucks her feet up and leans into your side, warm as the tea.']}]},
   {open:['Help me sweep the courtyard? It goes faster with two. And it’s nicer.','* Petals keep drifting down from the old cherry tree, undoing all your work.'],
    opts:[
     {t:'This is a losing battle.',r:['That’s the point. You sweep anyway. Every day. Like prayer.','* A petal lands in your hair. She plucks it free and lets her fingers linger on your cheek.']},
     {t:'Toss the broom. Dance with me.',r:['In the temple courtyard? Scandalous.','* She drops her broom first. You turn slow circles under the petals while the bells sway.']}]},
   {open:['* It’s late. The lanterns are low, and Lys is still kneeling at the little shrine.','Oh. I didn’t think anyone would come so late. I’m glad it’s you.'],
    opts:[
     {t:'What are you praying for?',r:['For the village. The harvest. And you. Mostly you, lately.','* She doesn’t look away this time.']},
     {t:'Can I kneel with you?',r:['* You kneel side by side. After a while her hand slips into yours, and neither of you says amen for a long time.']}]},
   {open:['I made you something. Close your eyes.','* You feel her tie a thin red cord around your wrist, her fingers careful and slow.'],
    opts:[
     {t:'What is it?',r:['A blessing knot. It means someone is keeping you in her thoughts.','* She kisses the knot, then your palm. Her face is very red.']},
     {t:'Can I open my eyes?',r:['Not yet.','* Something soft brushes your lips, quick as a falling petal. “Now you can.” She’s already pretending to sweep.']}]},
   {open:['* Lys pulls you behind the temple to the hot spring, where steam curls under the stars.','Just our feet. That’s all. Don’t look at me like that.'],
    opts:[
     {t:'Like what?',r:['Like you’re thinking what I’m thinking.','* She splashes you, giggling, then leans her head on your shoulder and sighs.']},
     {t:'Just our feet. Sure.',r:['I’m a temple keeper. I have standards.','* Her toes find yours under the water. Her standards seem to be negotiable.']},
     {t:'This is perfect.',r:['It is, isn’t it? Stay a while.','* You do. The steam rises, and she falls asleep against your arm.']}]}],
  gift:['Oh! I’ll put it on the shrine. No, wait. I’m keeping this one for myself.','* She holds it to her chest and smiles so wide her eyes nearly close.','You didn’t have to. But I’m so happy you did. Come here.']},

 // ---------------- Keyleth, Druid of the Air Ashari (Faith) ----------------
 keyleth:{
  visit:[
   {open:['Okay, don’t freak out, but I asked the oak about you. Is that weird? That’s weird.','* Keyleth twists a strand of hair around her finger. Leaves rustle overhead like laughter.'],
    opts:[
     {t:'What did the oak say?',r:['That you’re steady. And that I talk about you way too much. Rude, honestly.','* She buries her face in her hands. You can see her ears going red.']},
     {t:'It’s a little weird. I like it.',r:['You do? Oh thank goodness.','* She throws her arms around your neck and nearly knocks you over.']}]},
   {open:['Want to fly? I mean, I fly. You hold on. Really tight.','* She shifts into a great eagle and lowers one wing.'],
    opts:[
     {t:'Absolutely.',r:['* You soar over the village. When she lands and shifts back, she’s still in your arms, breathless and laughing.','So… that’s my favorite thing now.']},
     {t:'What if I fall?',r:['Then I catch you. Obviously. I’m a druid. That’s like, the whole thing.','* She hugs you after, a little too long to be about flying.']}]},
   {open:['* Keyleth is lying in the meadow with flowers growing slowly up around her.','Lie down with me. I’m trying to be still. It’s supposed to help me be a better leader.'],
    opts:[
     {t:'You’re already a good leader.',r:['You really think so?','* Flowers bloom all around you both in a sudden burst. She covers her face. “That was an accident.”']},
     {t:'Lie still. I’ll stay.',r:['* You lie together while the vines curl gently around your joined hands. Neither of you minds.']}]},
   {open:['I made a wind spell that only plays music. Pointless, right? Dance with me anyway.','* A soft breeze hums a melody through the reeds.'],
    opts:[
     {t:'Not pointless at all.',r:['* You dance barefoot in the grass. She steps on your foot twice and apologizes four times.','Okay, I’m better at flying. But this is nicer.']},
     {t:'I’m a terrible dancer.',r:['Great! Me too! We match!','* She stumbles into your chest and doesn’t step back. The wind goes very quiet.']}]},
   {open:['* Keyleth grabs your hand and tugs you through a curtain of willow branches.','Okay. Nobody can see us here. I checked. With the trees. Twice.'],
    opts:[
     {t:'Why does nobody need to see us?',r:['Because I want to kiss you and I’m nervous and I don’t want an audience. Is that okay?','* It’s okay. She tastes like rain and wildflowers, and the willow sighs around you.']},
     {t:'You’re adorable when you’re nervous.',r:['I’m not nervous! I’m… okay, I’m very nervous.','* She kisses your cheek, squeaks, and hides her face in your shoulder.']},
     {t:'Kiss her first.',r:['* She makes a tiny sound of surprise, then melts.','Oh. Okay. Yes. That was the plan. You just went first.']}]}],
  gift:['For me? Oh no. Oh, I love it. I’m going to cry. I’m fine. I’m crying.','* A little sprig of clover sprouts right out of the ground at your feet. She doesn’t notice.','The trees are going to be so jealous. I’m bragging about this to all of them.']},

 // ---------------- Shadowheart, Cleric of Selûne (Faith) ----------------
 shadowheart:{
  visit:[
   {open:['* Shadowheart is sitting on the old stone wall, swinging her legs, watching the moon rise.','You again. Don’t tell anyone, but I was hoping you’d come.'],
    opts:[
     {t:'Your secret’s safe with me.',r:['I have a lot of secrets. You’re the only one I like keeping.','* She pats the wall beside her. You sit. Her knee leans into yours.']},
     {t:'Why hoping?',r:['Because the moon is better with company. Don’t make me say it twice.','* She glances at you, then away, then back.']}]},
   {open:['Spar with me. I’m out of practice, and I need someone who won’t let me win.','* She spins her mace once, grinning in a way that isn’t entirely innocent.'],
    opts:[
     {t:'You’re on.',r:['* It ends with her pinning you to the grass, her hair falling around your face.','Well. That went better than I planned. Or worse. I can’t decide.']},
     {t:'I’ll go easy on you.',r:['You absolutely will not.','* She sweeps your legs. Then she offers a hand up and doesn’t let go of it.']}]},
   {open:['* You find her tending night-blooming flowers in her little garden, silver in the moonlight.','These only open in the dark. Like most things worth seeing.'],
    opts:[
     {t:'Like you.',r:['Careful. Flattery is how the last god got me.','* But she’s smiling, and she lets you tuck one of the blooms behind her ear.']},
     {t:'Teach me their names.',r:['* She does, one by one, her hand guiding yours to each petal. By the last name, she’s barely whispering.']}]},
   {open:['I can’t sleep. Sit by the fire with me? I won’t talk about my past. Much.','* The fire crackles. She hands you a cup of something warm and spiced.'],
    opts:[
     {t:'You can, if you want.',r:['I know. That’s why I don’t need to.','* She leans against your shoulder and closes her eyes. Her faith, she says, feels lighter here.']},
     {t:'Then let’s just sit.',r:['Thank you. Truly.','* Somewhere past midnight, her fingers lace through yours.']}]},
   {open:['* Shadowheart pulls you into the shadow of the chapel doorway, a finger raised to her lips.','There’s a festival going on. Everyone’s distracted. I have about one minute of courage.'],
    opts:[
     {t:'Then use it.',r:['* She does. The kiss is soft and fierce and over far too soon.','There. Now I’ll be thinking about that all night. Thanks a lot.']},
     {t:'I’ll wait for the second minute.',r:['Patient. Annoying. Attractive.','* She kisses you anyway, slow this time, like she’s decided something.']},
     {t:'Courage for what?',r:['Don’t be dense.','* She tugs your collar down and shows you exactly what for.']}]}],
  gift:['Hm. Fine. It’s lovely. Don’t look so smug about it.','* She hides a smile and tucks it away somewhere close to her heart.','Selûne gives light in the dark. Apparently, so do you.']},

 // ---------------- Tyrande, High Priestess of the Moon (Marriage) ----------------
 tyrande:{
  visit:[
   {open:['* Tyrande waits at the edge of the moonwell, silver light rippling across her face.','I have kept watch ten thousand nights. Tonight I would rather keep company.'],
    opts:[
     {t:'Then let me keep you company.',r:['* She draws you to the water’s edge and rests her hand over your heart.','Steady. Good. That is how a vow should beat.']},
     {t:'Ten thousand nights is a lot.',r:['And every one of them, a choice. Make yours every night too.','* Her eyes glint, warm and amused, and she does not let go of your hand.']}]},
   {open:['Ride with me. My nightsaber grows restless, and so do I.','* She swings up behind you and wraps her arms around your waist.'],
    opts:[
     {t:'Faster.',r:['* The forest blurs. Her laughter, low and wild, rings in your ear.','You surprise me, mortal. I do not surprise easily.']},
     {t:'Slower. I want this to last.',r:['Wise.','* The cat pads through silver glades. Tyrande rests her cheek against your back the whole way.']}]},
   {open:['Draw your bow. Let us see if your aim matches your devotion.','* She stands behind you, her hands guiding your arms, her breath at your ear.'],
    opts:[
     {t:'Hard to focus like this.',r:['That is rather the point. Focus anyway.','* You loose the arrow. It strikes true. She murmurs approval against your neck.']},
     {t:'Show me how it’s done.',r:['* She looses three arrows in a single breath. All three split the same mark.','Now you owe me a kiss for every one.']}]},
   {open:['* Tyrande is unbraiding her long hair beside the fire, moonlight in every strand.','Help me with this. My husband used to. It is a small thing that means everything.'],
    opts:[
     {t:'Gladly.',r:['* You work slowly, carefully. She closes her eyes and hums an ancient elven song.','Small rituals hold a marriage together. Remember that at home.']},
     {t:'You still miss him.',r:['Always. And still I live. Love is not a cage. It is a lantern.','* She turns and kisses your knuckles, gentle and grave.']}]},
   {open:['The temple is empty tonight. Elune’s light is all we need.','* She leads you up the steps by the hand, her eyes never leaving yours.'],
    opts:[
     {t:'Lead the way, Priestess.',r:['* The doors close behind you on a sea of moonlight.','Ten thousand years, and I still know how to make a night remarkable.']},
     {t:'You’re going to be trouble.',r:['I have always been trouble. I merely hide it under a priestess’s robes.','* She kisses you beneath the open sky, unhurried as the moon.']},
     {t:'Stay here with me instead.',r:['Bold. I like bold.','* She sinks onto the steps beside you and pulls you down into a long, silvered kiss.']}]}],
  gift:['A gift given under the moon is a promise. I accept your promise.','* She presses it to her lips, then to yours, and smiles like an ancient secret.','You remembered what I love. That is rarer than any jewel.']},

 // ---------------- Padmé, Senator of Naboo (Marriage) ----------------
 padme:{
  visit:[
   {open:['* Padmé steps out of a long council meeting and pulls her elaborate headdress free with a sigh.','Take me somewhere with no politics. Please. I’m begging you.'],
    opts:[
     {t:'The lake. Now.',r:['* You row her out to the middle of the lake. She trails her fingers in the water and finally laughs.','Naboo had lakes like this. I forgot how much I needed one.']},
     {t:'How about a picnic in the meadow?',r:['Perfect. You bring the food. I’ll bring myself, without the headdress.','* She lies in the grass beside you, hair loose, and steals your bread.']}]},
   {open:['Teach me to dance like your village does. Not a court dance. A real one.','* She kicks off her slippers and holds out her hands.'],
    opts:[
     {t:'Follow my lead.',r:['* She does, laughing as you spin her through the barn, skirts swirling.','This is much better than state functions.']},
     {t:'You lead. You’re a queen.',r:['Former queen. But fine.','* She leads you right into a corner and kisses you there, a little out of breath.']}]},
   {open:['* Padmé is sitting in a window seat in the old library, a letter in her lap.','I used to write letters I couldn’t send. Secret ones. Hidden in the lining of my coat.'],
    opts:[
     {t:'Who were they for?',r:['Someone I loved too much and told too little. I’m trying to do it differently now.','* She folds the letter and presses it into your hand. “For you. Read it later.”']},
     {t:'Write me one.',r:['I already did.','* She tucks it into your pocket, and her hand rests against your chest a moment too long.']}]},
   {open:['There are people watching from every window. I’m tired of being careful.','* She walks beside you through the market, close enough to brush your arm.'],
    opts:[
     {t:'Then don’t be careful.',r:['* She threads her arm through yours, chin high, in front of everyone.','Let them talk. Honesty is a kind of courage too.']},
     {t:'Let’s give them something to talk about.',r:['* She grins and kisses your cheek, right in the middle of the square.','Senator Amidala, causing a scandal. Finally.']}]},
   {open:['* Padmé takes your hand at dusk and leads you onto a balcony overlooking the village.','Love needs time. Tonight, let’s give it all the time it wants.'],
    opts:[
     {t:'All of it?',r:['All of it.','* She lifts onto her toes and kisses you as the lamps below flicker on one by one.']},
     {t:'You’re beautiful in this light.',r:['You say that in every light.','* She laughs softly and pulls you in by the collar.']},
     {t:'Hold her close.',r:['* She sighs and rests against you, listening to your heartbeat.','This. This is what I fought for.']}]}],
  gift:['You shouldn’t have. No, I’m lying. I’m so glad you did.','* She wraps both hands around it as if it might slip away, and kisses your cheek.','It’s perfect. Simple and thoughtful. Like you.']},

 // ---------------- Yennefer, Sorceress (Marriage) ----------------
 yennefer:{
  visit:[
   {open:['* Yennefer appears out of a crackling portal, smelling of lilac and gooseberries.','You have one hour of my time. Make it worth it.'],
    opts:[
     {t:'Dinner. I cooked.',r:['You cooked? For me?','* She tries the dish, raises an eyebrow, and steals the rest of your plate. “Acceptable. Very acceptable.”']},
     {t:'I’ll make it worth two.',r:['Arrogant. I like that.','* She hooks a finger in your belt and pulls you closer. “Prove it.”']}]},
   {open:['I’m bored. Spar with me. Swords, not spells. I want it to be fair.','* She draws a slim blade with a smile that says nothing about her will be fair.'],
    opts:[
     {t:'Don’t cheat.',r:['I never cheat. I simply win.','* She disarms you in three moves and presses the blade flat against your chest. “Now kiss me.”']},
     {t:'Fair is boring.',r:['Finally, someone who understands.','* Sparks fly from her fingertips. You both end up laughing, tangled together in the grass.']}]},
   {open:['* You find her in her tower, dark hair loose, a glass of wine in her hand.','Come in. Close the door. I’ve warded the stairs against interruptions.'],
    opts:[
     {t:'What kind of interruptions?',r:['Every kind.','* She sets down the wine and stands very close. “Any further questions?”']},
     {t:'You planned this.',r:['I plan everything. Including you.','* She pours you a glass, then drinks from yours instead, eyes on you.']}]},
   {open:['Half-hearted love bores me. So tell me, honestly. How is your marriage?','* She watches you over the rim of her cup, sharp-eyed.'],
    opts:[
     {t:'I’m showing up. Every day.',r:['Good. Keep choosing her. Over and over. That is the only love worth having.','* Her voice softens. She touches your cheek, briefly.']},
     {t:'Better than it was.',r:['Better is a beginning. Not an ending.','* She leans in, close enough to whisper. “Do better.”']}]},
   {open:['* Yennefer grabs your wrist and steps backward through a shimmering portal.','Somewhere quiet. Just us. Don’t ask where.'],
    opts:[
     {t:'Where are we?',r:['I said don’t ask.','* A starlit beach. She kicks off her boots and pulls you down onto the warm sand.']},
     {t:'You’re dangerous.',r:['I’m the most dangerous thing you’ll ever love. Get used to it.','* She kisses you like a storm rolling in.']},
     {t:'Follow without a word.',r:['Good. Obedience suits you.','* Her laughter echoes as the portal snaps shut behind you.']}]}],
  gift:['Hm. Taste. I didn’t expect that. Don’t let it go to your head.','* She examines it, unimpressed, then quietly pockets it.','Lilac and gooseberries would have done. But this is… lovely. Thank you.']},

 // ---------------- Briget, Rose Princess (Marriage) ----------------
 briget:{
  visit:[
   {open:['* Briget is setting a little table in the rose garden, two cups, one candle, a vase of fresh flowers.','Every day deserves a little ceremony. Sit, my love.'],
    opts:[
     {t:'You did all this?',r:['For you. Of course.','* She pours tea, then leans across the table to kiss the tip of your nose.']},
     {t:'Only if you sit on my lap.',r:['Shameless!','* She does it anyway, cheeks rosy, and feeds you a sugared petal.']}]},
   {open:['Dance with me. Right here in the kitchen. There’s no music, but we don’t need it.','* She slips her hand into yours and sways.'],
    opts:[
     {t:'Hum something.',r:['* She hums an old waltz against your shoulder. The kettle starts whistling. Neither of you moves.']},
     {t:'Dip her.',r:['Oh!','* She laughs, breathless, her arms locked around your neck. “Again. Do it again.”']}]},
   {open:['* You find a letter tucked under your door. It smells of roses.','“Meet me at the bridge at sunset. Wear something nice. Bring your heart. — B.”'],
    opts:[
     {t:'Go to the bridge.',r:['* She’s waiting in a gown the color of dusk. She curtsies, then throws her arms around you.','You came! I was so nervous you wouldn’t.']},
     {t:'Write one back first.',r:['* You leave your reply on her windowsill. Later she runs to you clutching it, eyes shining.','No one has ever written me back. Ever.']}]},
   {open:['I’ve been pruning the roses. They grow better when someone tends them every day.','* There’s a thorn scratch on her thumb.'],
    opts:[
     {t:'Kiss it better.',r:['* You do. She stops breathing for a second.','That is not how first aid works. Do it again.']},
     {t:'Let me help.',r:['* You work side by side till dusk. Petals in your hair, dirt on your hands.','A marriage is a garden. You know that, don’t you?']}]},
   {open:['* Briget pulls you through a hidden gate behind the castle hedges.','This is my secret garden. No one has ever been in here but me.'],
    opts:[
     {t:'It’s beautiful.',r:['So are you, standing in it.','* She kisses you under an arch of white roses.']},
     {t:'Why show me?',r:['Because a secret is better when you share it with the right person.','* She takes your face in her gloved hands and kisses you slowly.']},
     {t:'What else are you hiding?',r:['Wouldn’t you like to know.','* She tugs you down onto the bench, giggling, and the roses close around you.']}]}],
  gift:['Oh! This deserves a ceremony all its own. Hold still, I’m going to kiss you.','* She curtsies deeply, then ruins it by flinging her arms around you.','I’ll press a rose with it to remember the day. You spoil me, and I adore it.']},

 // ---------------- Kitai, Marat Warrior (Marriage) ----------------
 kitai:{
  visit:[
   {open:['* Kitai drops from a tree directly in front of you. She is grinning.','Aleran. You’re slow. I could have killed you three times on the walk here.'],
    opts:[
     {t:'And yet you didn’t.',r:['I am feeling generous. Also, you would have been no fun dead.','* She bumps your shoulder hard enough to stagger you, then catches your arm.']},
     {t:'Teach me to be faster, then.',r:['Ha! You’ll regret that.','* She runs you ragged through the woods, then tackles you into a pile of leaves, laughing.']}]},
   {open:['Wrestle me. If you win, I’ll do your chores for a week. If I win, you do mine.','* She’s already circling, crouched low, eyes bright.'],
    opts:[
     {t:'Deal.',r:['* You lose. Spectacularly. She sits on your chest, smug and breathless.','I’m going to enjoy this week very much, chala.']},
     {t:'What if I don’t want to win?',r:['Then you’re smarter than you look.','* She pins you anyway and kisses you hard, then hops off. “Chores still apply.”']}]},
   {open:['* Kitai is lying in the grass watching the clouds, chewing on a blade of grass.','Your people waste so much time indoors. Lie down. Be useless with me.'],
    opts:[
     {t:'Useless sounds wonderful.',r:['Good. You’re learning.','* She rolls onto her side and rests her head on your chest. She hums something wild and old.']},
     {t:'I have work to do.',r:['And it will still be there. I may not.','* She grabs your shirt and pulls you down into the grass beside her.']}]},
   {open:['I stole a horse. Don’t look at me like that. I’ll give it back. Probably.','* She’s already mounted, bareback, a hand held out to you.'],
    opts:[
     {t:'Climb on.',r:['* You ride hard across the fields. She whoops like a wild thing the whole way.','Your heart is racing. Good. Mine too.']},
     {t:'We’re going to be in trouble.',r:['You say that like it’s a bad thing.','* She hauls you up behind her, laughing, and you’re off.']}]},
   {open:['* Kitai catches you by the collar and drags you around the back of the smithy.','I missed you today. I don’t like missing things. Fix it.'],
    opts:[
     {t:'How?',r:['Like this, stupid Aleran.','* She kisses you fiercely, then bites your lip gently and lets you go. “Better.”']},
     {t:'I missed you too.',r:['Good. You should.','* Her eyes soften for one rare moment. She presses her forehead to yours.']},
     {t:'You’re very bossy.',r:['And you love it.','* She doesn’t wait for an answer. She’s right.']}]}],
  gift:['Is this a courting gift? Among my people that means something. I’m keeping it.','* She sniffs it suspiciously, then grins like a wolf.','Not bad, Aleran. Not bad at all. Come here, I’ll thank you properly.']},

 // ---------------- Vin, Mistborn (Fatherhood) ----------------
 vin:{
  visit:[
   {open:['* Vin drops down from a rooftop, mistcloak trailing, and lands lightly in front of you.','Took you long enough. Come on. I’ll show you the city from the top.'],
    opts:[
     {t:'I can’t fly like you.',r:['You don’t have to. Hold on.','* She wraps an arm around your waist and Pushes off a coin. The whole village drops away beneath you.']},
     {t:'Lead the way.',r:['* She grabs your hand and pulls you up a ladder to the bell tower. The mists swirl below.','I used to sit up here alone. It’s better with you.']}]},
   {open:['Spar with me. I want to see if you trust your instincts.','* She circles you, light on her feet, a small dagger flipping between her fingers.'],
    opts:[
     {t:'Ready.',r:['* She’s on you in a blur, then has you pinned to the wall, her face inches from yours.','Your instincts are terrible. I like your face, though.']},
     {t:'You’ll win anyway.',r:['Probably. That’s not the point. The point is you showed up.','* She bumps her shoulder into yours, softly. It’s almost a hug.']}]},
   {open:['* You find Vin in the kitchen, staring at a loaf of bread like it might vanish.','Old habit. I used to hide food. Sometimes I still want to.'],
    opts:[
     {t:'There’s always enough here.',r:['I know. You keep making sure of that.','* She tears the bread in half and gives you the bigger piece. That’s how she says “I love you.”']},
     {t:'Hide it with me, then.',r:['* She laughs, surprised, and drags you into the pantry. You split the loaf in secret, knees touching in the dark.']}]},
   {open:['There’s a ball tonight. I hate balls. But I want to go with you.','* She is wearing a dress and looks deeply uncomfortable and beautiful about it.'],
    opts:[
     {t:'You look stunning.',r:['Don’t. I’ll blush and ruin my disguise.','* She blushes anyway, and takes your arm.']},
     {t:'Let’s skip it and dance here.',r:['Oh, thank goodness.','* She kicks off her shoes and steps onto your feet, swaying slowly in the mist.']}]},
   {open:['* Vin pulls you into a shadowy alley and presses her back to the wall.','Someone’s following us. Pretend we’re… you know. Together. Close.'],
    opts:[
     {t:'Pretend?',r:['* She looks up at you. The pretending stops pretty quickly.','Okay. Maybe nobody was following us.']},
     {t:'Who’s following?',r:['No one. I lied. I just wanted an excuse.','* She kisses you, quick and sure, then slips away into the mists.']},
     {t:'Kiss her.',r:['* She tenses, then melts, and her fingers curl into your shirt.','I’ve never trusted anyone enough for this. I trust you.']}]}],
  gift:['For me? You didn’t want anything back for it? Okay. Okay. Thank you.','* She turns it over and over, suspicious, then smiles like the sun coming out.','I’ll keep this somewhere safe. Not hidden. Just safe. That’s new for me.']},

 // ---------------- Hera, Captain of the Ghost (Fatherhood) ----------------
 hera:{
  visit:[
   {open:['* Hera is sprawled under her ship, grease on her cheek, a spanner in hand.','Hand me that hydrospanner, love. And stop staring. Actually, keep staring.'],
    opts:[
     {t:'You’ve got grease on your face.',r:['Do I? Fix it, then.','* You wipe it away with your thumb. She catches your wrist and holds it there a moment.']},
     {t:'Need help under there?',r:['Always. Slide in.','* You lie shoulder to shoulder under the ship. She doesn’t really need help. She just wanted company.']}]},
   {open:['Come fly with me. Just a short hop. The kids are asleep and I need the sky.','* The Ghost hums to life. She pats the co-pilot’s seat.'],
    opts:[
     {t:'Punch it.',r:['* She grins and throws the throttle forward. You climb above the clouds into starlight.','There. Now we can breathe.']},
     {t:'Take it slow.',r:['* She cruises gently over the moonlit fields. Her hand finds yours on the console.','Steady hands. That’s all a crew needs. A family too.']}]},
   {open:['* Hera is sitting on the ramp of the Ghost, watching the stars.','Some days I wonder if I’m doing enough for them. The crew. My son. Do you ever feel that?'],
    opts:[
     {t:'Every day.',r:['Then we’re in good company.','* She rests her head on your shoulder. “You’re doing better than you think, you know.”']},
     {t:'You’re an amazing mother.',r:['So are you a father. Don’t argue.','* She kisses your cheek, then looks out at the stars again, smiling.']}]},
   {open:['Spar with me. Captain’s orders. I need to stay sharp.','* She cracks her knuckles, a mischievous gleam in her green eyes.'],
    opts:[
     {t:'Yes, Captain.',r:['* She flips you neatly onto your back and leans over you, laughing.','You’re supposed to dodge, love.']},
     {t:'Make me.',r:['* She does. You end up tangled together on the hangar floor, breathless.','Mm. Maybe we should do this more often.']}]},
   {open:['* Hera pulls you into the Ghost’s cockpit and locks the hatch.','The crew can wait. For once, so can the galaxy.'],
    opts:[
     {t:'What did you have in mind?',r:['A captain’s privilege.','* She sits on the console and pulls you close by your collar.']},
     {t:'The whole galaxy?',r:['The whole galaxy. You’re my priority tonight.','* She kisses you, slow and warm, as the stars drift by the viewport.']},
     {t:'Pull her close.',r:['* She laughs softly and leans into you.','Mm. Steady hands. I knew it.']}]}],
  gift:['For me? You know I can’t fly anything with this. I love it anyway.','* She tucks it into her flight jacket, right over her heart.','Thank you, love. You’re a good man. Don’t let anyone tell you otherwise.']},

 // ---------------- Liko, Young Explorer (Fatherhood) — PLATONIC, little-sister energy ----------------
 liko:{
  visit:[
   {open:['* Liko waves wildly from the edge of the field, a battered notebook clutched to her chest.','You came! Okay, I found a weird bug, and I need a second opinion. A grown-up opinion.'],
    opts:[
     {t:'Let’s see this bug.',r:['* You crouch together in the grass. She takes notes on everything you say, very seriously.','You notice stuff. My dad was like that. I like that you’re like that too.']},
     {t:'You’re the expert here.',r:['Me? I mean… yeah. Okay, yeah, I kind of am!','* She stands a little taller the whole rest of the afternoon.']}]},
   {open:['I want to climb the big hill and see the whole valley. But I don’t want to go alone.','* She shuffles her feet, trying not to look nervous.'],
    opts:[
     {t:'Race you to the top.',r:['* She wins. Barely. She flops on the grass at the top, laughing and out of breath.','I’ve never seen it from up here! Thanks for coming.']},
     {t:'We’ll go slow together.',r:['* You walk side by side. She chatters the whole way up about everything she sees.','It doesn’t feel so big with someone next to you.']}]},
   {open:['* Liko is sitting under a tree, frowning hard at a map.','I think I got us lost. Well. Me lost. I don’t know how to read this thing.'],
    opts:[
     {t:'Let me show you.',r:['* You trace the roads with your finger. Her frown slowly turns into a grin.','Oh! That’s easy! Why didn’t anyone explain it like that before?']},
     {t:'Getting lost is how you find things.',r:['Really? Huh. That’s a good way to look at it.','* She scribbles it in her notebook. “Rule number seven,” she announces.']}]},
   {open:['Can I tell you something? Sometimes I get really scared, but I keep going anyway. Is that brave or dumb?','* She pokes at the dirt with a stick.'],
    opts:[
     {t:'That’s exactly what brave is.',r:['Really? Okay. Then I’m gonna keep doing it.','* She bumps your shoulder, grinning. “You do it too, don’t you? Every day.”']},
     {t:'I get scared too.',r:['You do? But you’re a grown-up! Okay, that makes me feel way better.','* She hands you half her snack, very solemnly, like a treaty.']}]},
   {open:['* Liko bounces up to you with a fishing rod twice her size.','Teach me to fish? Pleeeease? I promise I’ll be quiet. Mostly quiet.'],
    opts:[
     {t:'Grab some bait.',r:['* She catches a tiny fish and shrieks with joy, scaring away every other fish in the lake.','Best day ever! Can we come back tomorrow?']},
     {t:'Only if you tell me your adventures.',r:['* She talks the whole time. You don’t catch a single fish. Neither of you cares.']}]}],
  gift:['For me?! This is going straight into my explorer’s pack. Best present ever!','* She holds it up to the sun, eyes huge, and does a little happy dance.','Thank you! I’m gonna show everyone. Seriously. Everyone.']},

 // ---------------- Wanda, Scarlet Witch (Fatherhood) ----------------
 wanda:{
  visit:[
   {open:['* Wanda is in her kitchen, scarlet light floating dishes into place.','Sit. I made dinner. Just for the two of us. Don’t ask where the kids are. They’re fine.'],
    opts:[
     {t:'Smells amazing.',r:['It’s my mother’s recipe. I only make it for people I love.','* She stops, realizing what she said, then smiles and serves you anyway.']},
     {t:'You didn’t have to.',r:['I wanted to. That’s different.','* She sits across from you, chin in her hand, and watches you eat with a soft smile.']}]},
   {open:['Dance with me? I always wanted to dance in a living room. Like on TV.','* A record player starts up by itself. Scarlet sparks flicker at her fingertips.'],
    opts:[
     {t:'Like on TV.',r:['* She laughs and twirls into your arms. The lights dim themselves.','I like this channel best.']},
     {t:'Let me lead.',r:['* She leans her head against your chest and sways, her eyes closed.','You make it feel real. Not like a dream.']}]},
   {open:['* Wanda is sitting on the porch at dusk, her hands glowing faintly red.','Sometimes the power is too loud. Will you just sit with me until it’s quiet again?'],
    opts:[
     {t:'As long as you need.',r:['* You sit. Slowly, the glow fades. She rests her head on your shoulder.','Thank you. You’re very… grounding.']},
     {t:'Take my hand.',r:['* She does. The scarlet light wraps gently around both your fingers like a ribbon.','It’s never done that before. It likes you.']}]},
   {open:['I made us a little world. Just for an hour. Come see.','* The air ripples. Suddenly you’re in a sunlit meadow, a picnic blanket waiting.'],
    opts:[
     {t:'This is incredible.',r:['It’s a borrowed hour. But I wanted you in it.','* She lies back on the blanket and pulls you down beside her.']},
     {t:'Is this real?',r:['It’s real enough. And you’re real. That’s what matters.','* She kisses you softly, and the sun seems to brighten.']}]},
   {open:['* Wanda takes your hand and leads you up the stairs of her quiet house.','The kids are asleep. I just want one moment that’s only mine.'],
    opts:[
     {t:'It’s yours.',r:['* She leans against the doorway, looking up at you, a soft red glow in her eyes.','Ours. Even better.']},
     {t:'What will you do with it?',r:['This.','* She kisses you slowly, and the hallway lights flicker one by one into warm scarlet.']},
     {t:'Pull her close.',r:['* She sighs and melts into you.','You always know. How do you always know?']}]}],
  gift:['Oh. No one gives me things. Not like this. Thank you.','* A soft scarlet glow surrounds the gift for a moment. She’s smiling.','I’ll keep it by the window. So I can see it every morning and think of you.']},

 // ---------------- Jean, Phoenix (Fatherhood) ----------------
 jean:{
  visit:[
   {open:['* Jean is grading papers on the porch of the schoolhouse. She looks up and smiles before you’ve said a word.','I heard you coming. In my head, I mean. You think very loudly about me.'],
    opts:[
     {t:'Sorry about that.',r:['Don’t be. It’s flattering.','* She tucks a red curl behind her ear and pats the seat beside her.']},
     {t:'What am I thinking now?',r:['* She tilts her head, then blushes deeply.','That’s… very specific. Sit down before I lose my place.']}]},
   {open:['Help me with the evening lesson? The kids love it when you visit.','* She floats a stack of books over to you with a flick of her fingers.'],
    opts:[
     {t:'Of course.',r:['* You teach together. She keeps catching your eye over the children’s heads.','You’re good with them. You see who they really are. That matters.']},
     {t:'Only if I get a reward after.',r:['Bold. In front of the children?','* She laughs, and later, after class, kisses you in the empty hallway.']}]},
   {open:['* Jean is floating cross-legged above the lake, eyes closed, hair drifting in an unseen wind.','Join me. I’ll hold you up. Trust me.'],
    opts:[
     {t:'I trust you.',r:['* You rise gently into the air. She takes both your hands, and you hang together above the stars’ reflection.','See? Nothing to be afraid of.']},
     {t:'Don’t drop me.',r:['Never.','* She pulls you into her arms instead, laughing. “There. Now you can’t fall.”']}]},
   {open:['Spar with me. Telekinesis against your reflexes. I promise to go easy.','* Leaves lift and swirl around her.'],
    opts:[
     {t:'Don’t go easy.',r:['* She doesn’t. You end up gently pinned against a tree by an invisible hand, Jean smirking inches away.','I win. Again.']},
     {t:'Easy is fine.',r:['Smart man.','* She tugs you forward with her mind and catches you in a kiss.']}]},
   {open:['* Jean pulls you into the empty schoolhouse and the door clicks shut on its own.','The kids are gone. The professors are gone. It’s just us. And I can hear exactly what you want.'],
    opts:[
     {t:'Then you already know.',r:['* She smiles slowly and walks you back until you’re against the bookshelf.','Phoenix fire, remember. Careful what you wish for.']},
     {t:'Stop reading my mind.',r:['Then stop thinking about kissing me.','* You don’t. Neither does she.']},
     {t:'Kiss her.',r:['* Warmth floods the room, soft gold and red, and every lamp flares at once.','Okay. That’s better than reading it.']}]}],
  gift:['For me? You’re very thoughtful. I could hear you planning this for days.','* Her cheeks go as red as her hair. She hugs it close.','I’ll keep it on my desk. The kids will ask, and I’ll tell them it’s from someone special.']},
};
