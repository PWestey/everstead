// Family "visit" and "gift" moments, part B.
// visit: pops up once a day on "Spend time together". gift: one reaction line when he gives her a gift.
// M = {open:[lines], opts:[{t:'player line', r:[reply lines]}]}. Lines starting "* " are narration.
// Nemona, Gwen and Misty are platonic (see docs/WRITING-BRIEF.md).

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 kira:{
  visit:[
   {open:['* Kira tosses you a practice saber hilt and twirls her own.','Best of three. Loser makes dinner. Winner gets to be smug about it all night.'],opts:[
    {t:'You’re on.',r:['* She wins the first round, loses the second, then pins you to the fence on the third.','Huh. Pretty sure I won. Pretty sure I don’t care about dinner anymore.']},
    {t:'What if I want to lose?',r:['Then you’re smarter than you look. Which is saying something, handsome.']},
    {t:'Go easy on me.',r:['Absolutely not. Easy is how I got into trouble. Hard work is how I got out.']}]},
   {open:['* You find her on the roof of the Training Yard, legs dangling, watching the sunset.','Took you long enough. I saved you the warm spot.'],opts:[
    {t:'Sit beside her.',r:['* She leans her head on your shoulder like it’s nothing. It isn’t nothing.','Don’t move. I’m comfortable. That’s an order, by the way.']},
    {t:'Did you come up here to brood?',r:['Jedi don’t brood. We contemplate. With snacks. Want one?']}]},
   {open:['You did the work today, didn’t you? I can tell. You stand taller.','* She steps in close and straightens your collar, slower than strictly necessary.'],opts:[
    {t:'You noticed?',r:['I notice everything about you. Occupational hazard. Very distracting hazard.']},
    {t:'Keep straightening.',r:['* She laughs and tugs you down by the collar instead.','Better?']}]},
   {open:['* Rain hammers the yard. Kira drags you under the barn eaves, both of you soaked.','So much for a run. Guess we’re stuck here. Together. Tragic.'],opts:[
    {t:'Tragic indeed.',r:['* Her hand finds yours. She doesn’t let go when the rain stops.']},
    {t:'We could still run in it.',r:['Ha! There it is. That’s why I like you. Race you to the well!']},
    {t:'You planned this.',r:['I can sense a lot of things. The weather is one of them. Guilty.']}]},
   {open:['I used to think nobody stays. You keep showing up anyway. It’s annoying. In a good way.'],opts:[
    {t:'I’m not going anywhere.',r:['* She kisses your cheek, quick, then shoves you like it never happened.','Don’t make it weird. Okay, make it a little weird.']},
    {t:'Someone has to keep up with you.',r:['Nobody keeps up with me. You just get close. Closer every day, actually.']}]}],
  gift:['For me? Careful, I could get used to being spoiled. Keep going.','Oh, I love it. I love that you thought of me more, though. Come here.','A gift? You’re making it really hard to stay sarcastic around you.']},

 fannie:{
  visit:[
   {open:['* Fannie grabs your wrist the second she sees you.','There’s a trail over the ridge nobody’s mapped yet. Come on, before the light goes!'],opts:[
    {t:'Lead the way.',r:['* At the top she spreads her arms at the view, then turns and looks at you instead.','Huh. The view’s better on this side.']},
    {t:'Can I hold your hand on the steep parts?',r:['Only the steep parts? Bold of you to assume there’ll be flat ones.']}]},
   {open:['I drew you on my map. Little star, right there. It means “worth coming back to.”'],opts:[
    {t:'What else is on that map?',r:['Waterfalls, caves, one very rude goose. And you. You’re my favorite landmark.']},
    {t:'Then come back often.',r:['* She marks a second star right next to yours.','Every day, explorer’s promise.']}]},
   {open:['* She’s waist-deep in the creek, boots on the bank, waving you in.','It’s freezing! It’s perfect! Get in here!'],opts:[
    {t:'Wade in after her.',r:['* She splashes you, shrieks when you splash back, then grabs you for balance and stays there.']},
    {t:'I’ll guard the boots.',r:['Coward! Cute coward. Fine, but you’re warming me up after.']}]},
   {open:['Sunrise run tomorrow? I know a hill where the whole valley turns gold.','* She bounces on her toes, already halfway there in her head.'],opts:[
    {t:'It’s a date.',r:['A date! You said date. I heard it. No take-backs.']},
    {t:'Only if you slow down for me.',r:['I’ll slow down. Mostly so I can look at you. Shh.']}]},
   {open:['* Night. Fannie lies in the meadow pointing out stars like they’re trail markers.','That one’s the way home. That one’s the way to adventure. And that one’s you.'],opts:[
    {t:'Which way are you going?',r:['* She rolls onto her side, close enough to feel her breath.','Whichever way you are.']},
    {t:'Which one’s you?',r:['The bright one right next to yours. Obviously. I picked it.']}]}],
  gift:['Ooh! This is going straight in my pack. I’m taking it everywhere. Like you, someday.','You found this for me? Okay, now I have to kiss you. Explorer rules.','Best treasure I’ve ever found, and I didn’t even have to dig. Thank you!']},

 rey:{
  visit:[
   {open:['* Rey spins her staff and plants it in the dirt.','Spar with me? I’ll go easy. Probably.'],opts:[
    {t:'Pick up a staff.',r:['* Three exchanges in, she sweeps your legs and lands on top of you, laughing.','You’re getting better. I’m getting distracted.']},
    {t:'I’d rather watch you.',r:['* She flushes and swings a little harder than she needs to.','Then watch closely.']}]},
   {open:['I used to eat alone every night in the desert. Half a portion. Counting days.','* She sets two bowls by the fire.'],opts:[
    {t:'Not alone tonight.',r:['* She scoots closer until your shoulders touch.','No. Not anymore.']},
    {t:'Full portions from now on.',r:['Careful. Feed a scavenger and she never leaves.']}]},
   {open:['Close your eyes. Reach out. Feel everything around you.','* Her hands rest over yours, warm and steady.'],opts:[
    {t:'All I feel is you.',r:['* She goes very still, then laughs softly.','That’s cheating. But it’s not wrong.']},
    {t:'I feel the trees, the wind…',r:['Good. You’re listening. Most people never do. I like that you do.']}]},
   {open:['* She’s up to her elbows in a broken waterwheel, grease on her cheek.','Hand me that wrench? And maybe don’t stare. I’m working.'],opts:[
    {t:'Wipe the grease off her cheek.',r:['* She freezes under your thumb.','Missed a spot. Try again. Slower.']},
    {t:'I can stare and help.',r:['Multitasking. Very impressive. Hold this, and keep staring, I suppose.']}]},
   {open:['Strength is built from ordinary days. I’ve watched you build yours.','* She steps up, hands on your chest.','I’m proud of you. And I want to do this.'],opts:[
    {t:'Do what?',r:['* She kisses you, quick and fierce, then steps back with a grin.','That.']},
    {t:'Then do it.',r:['* She does. When she pulls back her eyes are bright.','You’re a very good reason to stay put.']}]}],
  gift:['Nobody ever gave me anything I didn’t have to dig out of sand first. I’ll treasure it.','Oh. Oh, it’s beautiful. Come here, you.','I’m keeping this somewhere safe. Close to me. Like you.']},

 nemona:{
  visit:[
   {open:['* Nemona sprints up, already in a battle stance.','Battle! Right now! Or a race! Or both! Which one?!'],opts:[
    {t:'Both.',r:['YES. This is why you’re my favorite rival! Three, two, go!']},
    {t:'Can we warm up first?',r:['Warm-ups are just battles with your own legs. Fine! Stretch with me!']}]},
   {open:['I’ve been tracking your training! You’re way stronger than last month. I made a chart!'],opts:[
    {t:'You made a chart?',r:['A really good chart. It has stickers. Every sticker is a day you didn’t quit.']},
    {t:'You’re a great coach.',r:['Coach AND rival. Double role. I’m very busy and very happy about it!']}]},
   {open:['* She hands you a sandwich stacked impossibly high.','Picnic break! Champions need fuel. That’s the rule. I made the rule.'],opts:[
    {t:'How do I even eat this?',r:['With determination! Same as everything else. Big bite!']},
    {t:'Thanks, Nemona.',r:['Anytime! Friends feed friends. Then they race them.']}]},
   {open:['Okay, real talk. What’s the hardest part of your training right now?'],opts:[
    {t:'Getting started every day.',r:['Same! So let’s make starting fun. I’ll show up and yell your name. Problem solved.']},
    {t:'Not giving up.',r:['You haven’t, though. I’ve watched. You’re tougher than you think!']}]},
   {open:['* Nemona flops onto the grass after a race, laughing and out of breath.','You almost had me! Almost! I love almost!'],opts:[
    {t:'Next time I’ll win.',r:['I hope so! Then I get to try even harder. Everybody wins!']},
    {t:'You’re impossible to beat.',r:['Nope. Just impossible to discourage. Big difference. You’ve got it too.']}]}],
  gift:['For me?! This is amazing! I’m putting it in my bag right next to my badges!','You’re the best! I’m giving you a gift back. It’s a battle. Tomorrow. Be ready!','Thank you! Friends who give gifts are the best kind of friends. Second only to rivals!']},

 karlach:{
  visit:[
   {open:['* Karlach scoops you clean off the ground in a hug.','There you are! Missed you! Careful, I’m running hot today. Worth it.'],opts:[
    {t:'Hug her back.',r:['* Her engine-heart thrums loud enough to feel through your ribs.','Hear that? That’s what you do to me.']},
    {t:'You’re literally steaming.',r:['That’s just me being happy to see you, soldier. Get used to it.']}]},
   {open:['Arm wrestle. Winner picks the next meal, loser carries the winner there.'],opts:[
    {t:'Deal.',r:['* She wins, of course, and doesn’t let go of your hand afterward.','Hope you’re ready to carry me. Gently. Romantically.']},
    {t:'I just want to hold your hand.',r:['* She goes bright red, which on her is impressive.','Oh. Oh, that’s a cheat code. Fine. Hold it.']}]},
   {open:['* Late night. Karlach stretches out by the fire, the flames leaning toward her.','Ten years in hell and the thing I missed most was this. Quiet. Company. You.'],opts:[
    {t:'Lie down beside her.',r:['* She pulls you in against her warm side and sighs.','Best night in years. Don’t you dare fall asleep first.']},
    {t:'Tell me about the good days.',r:['Good days are the ones I spend with you, mate. Easy question.']}]},
   {open:['You trained today. I can tell. You’ve got that pumped-up swagger.','* She pokes your arm, then squeezes it.'],opts:[
    {t:'Like what you see?',r:['Love what I see. Gonna keep seeing it, too. Every day, alright?']},
    {t:'Swagger?',r:['Swagger. Strut. Big gorgeous confidence. Keep it up and I’ll be useless.']}]},
   {open:['Know what I love about touching you? I can. No burning. No pulling away.','* She cups your face in both hands, warm as a hearth.'],opts:[
    {t:'Then don’t pull away.',r:['* She kisses you, long and warm.','Never again. Not from you.']},
    {t:'You deserve this.',r:['* Her eyes go glassy.','Stop it. You’ll make me cry and then I’ll steam. Kiss me instead.']}]}],
  gift:['A present?! For me?! Oh, I’m going to squeeze you so hard. Brace yourself.','You absolute sweetheart. My heart’s doing the loud thing again.','I love it! Not as much as I love that you thought of me, but it’s close.']},

 shallan:{
  visit:[
   {open:['* Shallan sits with her sketchbook, glancing up at you, then down, then up.','Hold still. You keep moving your face. Faces are hard. Especially handsome ones.'],opts:[
    {t:'Let me see it.',r:['* She clutches the book to her chest.','Absolutely not. It’s… flattering. Too flattering. It’s a disaster.']},
    {t:'Draw me any way you like.',r:['Dangerous offer for a woman with my imagination. Accepted.']}]},
   {open:['I made a word up today. “Swoonstruck.” Means looking at someone so long you forget to work.','Not that I’d know.'],opts:[
    {t:'Who struck you?',r:['Some fellow with good habits and a nice jaw. Never mind. Don’t look at me.']},
    {t:'I’ve been swoonstruck too.',r:['* She drops her charcoal.','Oh. Well. That’s mutually inconvenient.']}]},
   {open:['* She leads you to a cluttered library corner, mostly hidden.','Nobody comes back here. I checked. Thoroughly. For academic reasons.'],opts:[
    {t:'What are we studying?',r:['* She pulls you closer by your shirt.','Proximity. Let’s run some experiments.']},
    {t:'You planned a secret meeting?',r:['I plan everything. I just pretend I don’t. It’s my best illusion.']}]},
   {open:['Some days I want to hide behind someone else’s face. Days like today.','* Her voice is quieter than usual.'],opts:[
    {t:'I like your real face best.',r:['* She looks at you for a long time.','That’s the most dangerous thing anyone’s ever said to me. Say it again.']},
    {t:'Then hide here with me.',r:['* She curls into your side.','Ten minutes. Then I’m brave again. Probably.']}]},
   {open:['* She snaps her fingers. The air shimmers into a candlelit ballroom, just for two.','Dance with me? It’s not real. Well. This part is.'],opts:[
    {t:'Take her hand.',r:['* She steps on your foot twice and laughs both times.','I should have illusioned better shoes.']},
    {t:'Which part is real?',r:['* She kisses you softly.','That part.']}]}],
  gift:['For me? I’m drawing this. Then I’m drawing you giving it to me. Then I’m blushing.','Oh, this is lovely. I’m speechless, which is extremely rare. Enjoy it.','You have impeccable taste. In gifts. And in women, apparently.']},

 jaina:{
  visit:[
   {open:['* Jaina stands at the harbor railing, the wind pulling at her white hair.','The sea calms me. So, I’m starting to notice, do you.'],opts:[
    {t:'Stand beside her.',r:['* She threads her arm through yours without looking.','Stay a while. The kingdom can wait an hour.']},
    {t:'Only starting to notice?',r:['I’m an archmage. I like to be thorough before drawing conclusions.']}]},
   {open:['You put in a good day’s work. Most people mistake busy for productive. You don’t.'],opts:[
    {t:'I learned from the best.',r:['Flattery. How unlike you. Keep going, though. I’m enjoying it.']},
    {t:'Reward me?',r:['* A small, wry smile.','Name the reward. Within reason. Within unreason, possibly.']}]},
   {open:['* She traces frost patterns on the window with one finger, then signs your initials into it.','Don’t tell anyone the Lord Admiral doodles.'],opts:[
    {t:'Draw a heart around it.',r:['* She hesitates, then does, and the frost glows faintly blue.','There. Now it’s classified.']},
    {t:'Your secret’s safe.',r:['I know. That’s why I trust you with the others.']}]},
   {open:['Come. I want to show you somewhere.','* A flash of arcane light, and you’re both on a quiet cliff above a moonlit sea.'],opts:[
    {t:'Where are we?',r:['Somewhere nobody needs anything from me. Except, perhaps, you.']},
    {t:'You teleported us on a date?',r:['It’s faster than walking, and I didn’t want to share you with the road.']}]},
   {open:['* She removes her heavy mantle and sits beside you by the fire.','I carry so much, all the time. It’s strange how light I feel near you.'],opts:[
    {t:'Let me carry some of it.',r:['* She rests her head against your shoulder.','You already do. You just don’t know it.']},
    {t:'Then stay close.',r:['* She leans in and kisses you, cool lips, warm intent.','I intend to.']}]}],
  gift:['How thoughtful. I’ll keep it in my study, where I can see it while I work.','Oh. You remembered. That means more to me than you know.','You spoil me, and I am entirely too old and too powerful to protest. Thank you.']},

 nash:{
  visit:[
   {open:['* Nash spins a revolver and holsters it.','Got a job tonight. Tracking job. You wanna ride along, partner?'],opts:[
    {t:'Saddle up.',r:['* She grins and pats the seat behind her.','Hold on tight. Tighter. There ya go.']},
    {t:'Is this a date or a job?',r:['Why not both? I bill for jobs. Dates are on the house.']}]},
   {open:['You hit your marks today. On time, too. A man who’s punctual is real attractive, you know.'],opts:[
    {t:'Is that so?',r:['Mm-hm. Shows a man respects my time. I respect his back.']},
    {t:'I try to impress you.',r:['Workin’. Don’t stop now, I’m invested.']}]},
   {open:['* Back of the saloon, she slides a drink your way and leans on the bar.','Rule of the trade: never let a mark see you smile. You keep breakin’ that rule for me.'],opts:[
    {t:'So I’m your mark?',r:['Bounty on your head’s pretty high. Think I’ll keep you instead of turnin’ you in.']},
    {t:'Smile anyway.',r:['* She does, slow and crooked.','Happy now? Don’t tell the other hunters.']}]},
   {open:['Teach you to shoot? You hold it like it owes you money.'],opts:[
    {t:'Show me.',r:['* She steps behind you, arms around yours, chin on your shoulder.','Breathe out. Squeeze. Focus. Not on me, sweetheart. On the target.']},
    {t:'You just want an excuse to get close.',r:['Caught me. Least I’m honest about my motives.']}]},
   {open:['* Starlight. Nash lies back on the hood of her hover-rig, boots crossed.','Most nights I count stars and payouts. Tonight I’m just countin’ on you to stay.'],opts:[
    {t:'I’m staying.',r:['* She tips her hat over both your faces and kisses you under it.','Good. Paid in full.']},
    {t:'What’s the payout?',r:['Me. Best deal in the sector. Limited time offer. Get up here.']}]}],
  gift:['Well now. I usually get paid to show up. This is a nice change.','Shiny. I like it. I like who gave it to me even more.','Keepin’ this. You just bought yourself a whole lotta goodwill, partner.']},

 carol:{
  visit:[
   {open:['* Carol lands in a burst of light right in front of you.','Wanna go up? I’ve got you. I promise I won’t drop you. Much.'],opts:[
    {t:'Take me up.',r:['* Above the clouds, she spins you once, laughing.','Best view on the planet, right? I meant the clouds. Mostly.']},
    {t:'I prefer the ground.',r:['Then I’ll come down to you. I can be very down to earth.']}]},
   {open:['You finished everything on your list today. That’s mission complete, soldier.','* She salutes, then smirks.'],opts:[
    {t:'Do I get a medal?',r:['* She kisses your cheek.','Better than a medal. Don’t let it go to your head.']},
    {t:'Higher. Further. Faster.',r:['Okay, that’s my line, and you saying it is weirdly hot.']}]},
   {open:['* Her cat jumps into your lap. Carol stares.','He doesn’t like anybody. He likes you. That’s a huge red flag. For me.'],opts:[
    {t:'Why for you?',r:['Because it means I’m going to like you even more. Dangerous.']},
    {t:'Pets have good instincts.',r:['Yeah. So do pilots. Mine say stay right here with you.']}]},
   {open:['Arm wrestle me. I’ll use no powers. Honest. Pilot’s honor.'],opts:[
    {t:'Accept.',r:['* She wins anyway, then lets your hand go slowly.','Okay, I used a little. I wanted to hold your hand longer.']},
    {t:'You’ll cheat.',r:['Me? Never. Okay, maybe. You’re fun to cheat with.']}]},
   {open:['* Late night on the airfield, her glow dimmed to a soft gold.','I’m always flying somewhere. With you, I finally want to land.'],opts:[
    {t:'Then land.',r:['* She steps into your arms and kisses you, warm and certain.','Touchdown.']},
    {t:'I’ll be your runway.',r:['That is the cheesiest thing anyone’s said to me. I love it. Come here.']}]}],
  gift:['Aw, for me? Okay, you just earned some serious wingman points.','Love it. Got it. Never letting it go. Kind of like you.','You know I can buy anything, right? This is way better. You picked it.']},

 gamora:{
  visit:[
   {open:['* Gamora spars alone, blade flashing. She stops when she sees you.','You’re late. I don’t forgive lateness. I’m considering an exception.'],opts:[
    {t:'Spar with me.',r:['* She disarms you in two moves and holds the blade under your chin.','Yield? Or should I keep you here a while?']},
    {t:'I’m worth the exception.',r:['Bold. Annoyingly true. Don’t let it happen again.']}]},
   {open:['There’s music playing in the square. People are dancing. I don’t dance.'],opts:[
    {t:'Offer your hand.',r:['* She stares at it, then takes it.','One song. If you tell anyone, I will deny it with violence.']},
    {t:'Then just stand with me.',r:['* She steps closer, swaying slightly despite herself.','This isn’t dancing. This is… standing. Rhythmically.']}]},
   {open:['You did your work properly today. No shortcuts. I noticed. I notice everything.'],opts:[
    {t:'High praise from you.',r:['It is. Don’t waste it. I don’t give it twice.']},
    {t:'What else did you notice?',r:['* She steps close, eyes level with yours.','That you’re staring at my mouth. Again.']}]},
   {open:['* She sits on the rooftop edge, sharpening her sword under the stars.','I was raised to trust no one. You’re making that very difficult.'],opts:[
    {t:'Sit beside her.',r:['* She lets her shoulder rest against yours.','This is a tactical position. Purely.']},
    {t:'Trust me a little.',r:['I trust you a lot. That’s what frightens me.']}]},
   {open:['* She stops you in the hallway, a hand flat on your chest.','I’ve thought about this tactically. I’ve decided.'],opts:[
    {t:'Decided what?',r:['* She kisses you, precise and unhurried.','That. Any objections?']},
    {t:'Tell me your plan.',r:['Step one, close the distance. Step two, you’ll figure out step two.']}]}],
  gift:['Practical. Well made. I approve. Of the gift and the giver.','I don’t receive many gifts that aren’t weapons. I like this better.','Thank you. I will guard it with my life. Possibly yours, too.']},

 kate:{
  visit:[
   {open:['* Kate’s on the roof with a hammer and a mouthful of nails.','Hold the ladder? And no looking up. Okay, a little looking up.'],opts:[
    {t:'Hold the ladder.',r:['* She climbs down straight into your arms, grinning.','Oops. Totally slipped. Completely accidental.']},
    {t:'I’ll fix it, you hold the ladder.',r:['A man who does his own repairs? Stop it. You’re making me swoon on a roof.']}]},
   {open:['Archery date. I bet I can hit the bullseye blindfolded.','* She ties a scarf over her eyes.'],opts:[
    {t:'Prove it.',r:['* Thunk. Dead center. She pulls the scarf down, smug.','Your turn. I’ll stand behind you and fix your form. Strictly professional.']},
    {t:'Kiss her while she can’t see.',r:['* She laughs into it.','Okay, I did not see that coming. Literally. Do it again.']}]},
   {open:['* Her dog flops at your feet and demands belly rubs.','He’s decided you’re family. That’s a big deal. He has standards. So do I.'],opts:[
    {t:'And do I meet yours?',r:['Mostly. You’d meet more if you kissed me right now.']},
    {t:'Good boy.',r:['Him or you? Because honestly, both apply today.']}]},
   {open:['You cleaned the whole kitchen today? Without being asked? Marry me. Wait. You’re taken. Ugh.'],opts:[
    {t:'You can still admire me.',r:['Oh, I’m admiring. Loudly. Constantly. Look at that clean counter.']},
    {t:'It’s just chores.',r:['Just chores is how you keep a home. Also hot. Very hot.']}]},
   {open:['* Late, on her fire escape, sharing a slice of cold pizza.','This is my favorite kind of night. Simple. Quiet. You.'],opts:[
    {t:'Share the last bite.',r:['* She takes it, then kisses the crumbs off your lip.','Fair trade.']},
    {t:'Same time tomorrow?',r:['Same time every day. That’s how good things work.']}]}],
  gift:['Oh, I love it! I’m putting it right on the shelf I built myself. With you in mind.','Wait, you got me something? I’m so bad at receiving. Hug me before I make it weird.','Perfect. Absolutely bullseye. You know me way too well.']},

 gwen:{
  visit:[
   {open:['* Gwen spins a drumstick and points it at you.','Band practice! You’re on tambourine. No arguments. It’s a very important role.'],opts:[
    {t:'I’m ready.',r:['That’s the spirit! Off-beat, though. So off-beat. I love it anyway.']},
    {t:'Can I just listen?',r:['Sure! Front row. Biggest fan seat. Clap really loud.']}]},
   {open:['Did you make your bed this morning? Be honest. I’ll know.'],opts:[
    {t:'I did!',r:['Yes! See? One small boring thing. That’s how the world gets saved.']},
    {t:'…No.',r:['Ha! Go fix it. I’ll wait. Hero rules apply to everyone.']}]},
   {open:['* Gwen hangs upside down from the porch beam, hood up.','Hey! You look like you need a snack and a pep talk. I brought both.'],opts:[
    {t:'Snack first.',r:['* She tosses you a granola bar.','Pep talk: you’re doing great, and your house looks amazing. Done!']},
    {t:'Get down from there.',r:['Nope! Best view in town. You should try it. Maybe don’t.']}]},
   {open:['Chores are kind of like drumming. Same beat over and over until it sounds like something.'],opts:[
    {t:'That’s actually smart.',r:['I have my moments! Usually right before I trip over something.']},
    {t:'So I’m keeping the beat?',r:['Totally. Your house rhythm is solid. Way better than your tambourine.']}]},
   {open:['* She sits next to you on the porch steps, swinging her feet.','You’re a good guy, you know that? Like, a really good one.'],opts:[
    {t:'Thanks, Gwen.',r:['Just saying it. People don’t say it enough. Okay, back to being cool.']},
    {t:'You’re pretty great too.',r:['I know. Kidding! Thanks. That’s nice to hear.']}]}],
  gift:['Wait, for me? That’s so cool! You’re officially my favorite neighbor!','Thank you! I’m putting this right next to my drum kit. Place of honor!','No way! Okay, I owe you a song now. Prepare to be serenaded. Badly.']},

 ororo:{
  visit:[
   {open:['* Ororo kneels in her rooftop garden, sleeves pushed up, soil on her hands.','Help me with the tomatoes? They respond to gentle hands.'],opts:[
    {t:'Kneel beside her.',r:['* Her fingers guide yours into the soil, lingering.','Gentle. Patient. Yes. Just like that.']},
    {t:'Do I have gentle hands?',r:['I suspect so. I may need to test that further.']}]},
   {open:['* A warm breeze wraps around you both, from nowhere.','I made it for you. The weather is mine to command. Today, it obeys my mood.'],opts:[
    {t:'And what’s your mood?',r:['* She steps closer, eyes faintly white with power.','Warm. Very warm.']},
    {t:'Make it rain.',r:['* Soft rain falls. She doesn’t move to shelter.','Now we’re both soaked. Whatever shall we do.']}]},
   {open:['Your home was very tidy when I passed by. A man who tends his house tends his heart.'],opts:[
    {t:'You noticed?',r:['I notice the things that are cared for. You care well.']},
    {t:'I wanted you to notice.',r:['* She smiles slowly.','Then you succeeded. Come tend to me a while.']}]},
   {open:['* Night. Ororo lies on the rooftop, lightning dancing silently on the horizon.','Watch. I’ll make them spell something.'],opts:[
    {t:'What will they spell?',r:['* The sky flickers into the shape of a heart.','Subtle, no? I am a goddess, not a poet.']},
    {t:'I’d rather watch you.',r:['* She turns her face to yours, lightning in her eyes.','Then watch closely.']}]},
   {open:['Small spaces still frighten me. But I feel the open sky when I’m near you. Strange.','* She takes your hand.'],opts:[
    {t:'I’ll be your sky.',r:['* She kisses you, slow as rising wind.','You already are.']},
    {t:'You’re safe with me.',r:['I know. That is the most precious thing I own.']}]}],
  gift:['How lovely. I’ll plant something beside it, so it has company. As I do now.','Thank you. Gifts given with care grow into something more.','You are thoughtful. The sky brightens when you smile like that. I did not do that one.']},

 annamarie:{
  visit:[
   {open:['* Anna Marie pats the porch swing and hands you sweet tea.','Sit a spell, sugar. I made too much on purpose.'],opts:[
    {t:'Sit close.',r:['* She tucks her feet under her and leans into your side.','That’s better. Now we’re talkin’.']},
    {t:'On purpose?',r:['I’m a Southern woman. I always make extra for the fella I hope comes by.']}]},
   {open:['* She peels off one glove, slow, finger by finger.','I can’t touch skin. But I can do this.'],opts:[
    {t:'Do what?',r:['* She lays her bare palm over your shirt, right on your heartbeat.','Feels like it’s runnin’ fast, darlin’.']},
    {t:'Put that glove back on before I faint.',r:['Oh, I like you flustered. Might take the other one off too.']}]},
   {open:['Your house was spotless today. A man who keeps a good home is a man worth keepin’.'],opts:[
    {t:'You keeping me?',r:['Honey, I’m considerin’ it very seriously.']},
    {t:'I learned from your porch.',r:['Well, ain’t you sweet. Sweeter than this tea, even.']}]},
   {open:['* She grabs your hand and flies you up into the evening air.','Hold on, sugar! Don’t look down! Okay, look down. It’s pretty.'],opts:[
    {t:'Hold her tighter.',r:['* She laughs against your ear.','I was hopin’ you’d do that.']},
    {t:'Don’t you dare drop me.',r:['Drop you? I’d never. I’m keepin’ you close.']}]},
   {open:['* By the kitchen stove, a scarf held between her lips and yours.','Silk’s thin. It’s the closest I can get. Is that alright?'],opts:[
    {t:'It’s perfect.',r:['* She kisses you through the silk, and somehow it’s enough.','Darlin’, that was worth the wait.']},
    {t:'Anything with you is alright.',r:['* Her eyes shine.','Well, you just made a Southern girl blush.']}]}],
  gift:['Well, I declare! For me? You sweet thing.','Oh, honey, it’s perfect. I’ll keep it right by my bed.','You spoil me, sugar. Keep doin’ it. I like bein’ spoiled by you.']},

 violet:{
  visit:[
   {open:['* Violet sits on the training mat, wrapping her wrists.','Spar with me. And don’t you dare go easy because I’m small.'],opts:[
    {t:'I won’t go easy.',r:['* She pins you on the third throw and doesn’t get up right away.','Good. I hate easy. I don’t hate this.']},
    {t:'You’re not small. You’re terrifying.',r:['Correct answer. You may live.']}]},
   {open:['I read all night. A whole book on dragon courtship rituals. For research.'],opts:[
    {t:'What did you learn?',r:['That they circle each other for days before admitting anything. Sound familiar?']},
    {t:'Research for what?',r:['* She goes red.','For… dragons. Obviously. Stop smirking.']}]},
   {open:['* She hands you a dagger, then steps behind you.','Your grip is wrong. Here.','* Her hands slide over yours, steady and warm.'],opts:[
    {t:'Better?',r:['Much. Now stop breathing like that, it’s distracting.']},
    {t:'You’re distracting.',r:['That’s the point of a lesson. Learn to focus anyway.']}]},
   {open:['You kept your routine every day this week. Do you know how rare that is? I do.'],opts:[
    {t:'You inspire me.',r:['* She looks at you a long moment.','Don’t say things like that unless you mean them. I believe words.']},
    {t:'You’re not so bad yourself.',r:['Not so bad? I’ll show you not so bad.']}]},
   {open:['* Lightning crackles across the sky. She pulls you into the archive stacks, out of sight.','Storms make my power restless. Stay with me till it passes?'],opts:[
    {t:'Stay.',r:['* She kisses you as thunder rolls, electric and certain.','It’s passing. I’m not letting go.']},
    {t:'Is it the storm, or me?',r:['Both. It’s always both, with you.']}]}],
  gift:['A book? Or… not a book. Still lovely. I’ll treasure it like a book.','You thought of me. That’s the gift. Thank you.','I’m keeping this right next to my daggers. Highest honor I can give.']},

 alleria:{
  visit:[
   {open:['* Alleria nocks an arrow and nods toward a distant target.','Show me your patience. Then I’ll show you mine.'],opts:[
    {t:'Take the shot.',r:['* You miss. She smiles, close at your ear.','Again. Slower. I have centuries. I can wait.']},
    {t:'Show me yours first.',r:['* She looses without looking away from you. Bullseye.','Patience. Practice. Focus. Mostly on you.']}]},
   {open:['I’ve lived a long time. I have seldom found someone so worth watching.'],opts:[
    {t:'Watching?',r:['Your focus. Your stubbornness. Your hands when you work. Yes. Watching.']},
    {t:'I’ll try to stay interesting.',r:['You needn’t try. That’s rather the point.']}]},
   {open:['* She leads you deep into the forest, to a glade lit with silver moths.','My people come here to make promises. I brought you to make none. Just to be.'],opts:[
    {t:'Sit together in the quiet.',r:['* Her fingers find yours in the grass.','Quiet suits you.']},
    {t:'It’s beautiful.',r:['So I’ve been told. I wanted to see it beside you.']}]},
   {open:['You kept your discipline when no one was watching. That is the only discipline that counts.'],opts:[
    {t:'Someone was watching.',r:['* A sly look.','Perhaps. I am a ranger-captain. I watch everything.']},
    {t:'I learned it from you.',r:['Then I have been a good teacher. Come claim your reward.']}]},
   {open:['* The shadows around her ripple faintly with void power. She steadies herself.','The darkness whispers sometimes. Near you, it’s quieter.'],opts:[
    {t:'Hold her.',r:['* She lets you, forehead to yours.','Light and shadow. Both. And you.']},
    {t:'Then stay near me.',r:['* She kisses you, slow and wild as the forest.','I intend to.']}]}],
  gift:['A fine gift. I will carry it into the woods with me.','You remembered what I like. Few do.','Thank you. I will think of you when I see it. Often.']},

 vex:{
  visit:[
   {open:['* Vex flips a gold coin across her knuckles.','Heads, you buy me dinner. Tails, I buy you dinner and you owe me.'],opts:[
    {t:'Flip it.',r:['* Heads. She grins.','Oh, darling. It was always going to be heads. Both sides are.']},
    {t:'Why not both?',r:['Two dinners? My, you are generous. I like that in a man.']}]},
   {open:['* Her bear sniffs at you, then flops over for belly scratches.','He likes you. He has excellent taste. Mostly mine.'],opts:[
    {t:'Scratch the bear.',r:['* She watches, chin on her hand.','You’re very good with your hands. Just noting it.']},
    {t:'And do you like me?',r:['A lady never tells. A ranger, however, might hint.']}]},
   {open:['You stayed in budget this week? Darling, you’ve no idea how attractive that is.'],opts:[
    {t:'Tell me.',r:['* She leans in close.','A man with focus and coin to spare? I might swoon.']},
    {t:'It wasn’t easy.',r:['The best things never are. I should know. I’m one of them.']}]},
   {open:['* She hops onto her broom and holds out a hand.','Come on. I know a cliff with a view nobody’s charging admission for yet.'],opts:[
    {t:'Hop on.',r:['* You fly over the treetops. She leans back into you.','Hold tight. Tighter. Perfect.']},
    {t:'Is the broom safe?',r:['Absolutely not. That’s what makes it fun.']}]},
   {open:['Stay still. There’s a leaf in your hair.','* She plucks it out, then doesn’t step back.'],opts:[
    {t:'Was there really a leaf?',r:['There was. I may have put it there. A clever ranger makes her own chances.']},
    {t:'Kiss her.',r:['* She kisses back, smiling.','Well. That was worth more than gold.']}]}],
  gift:['Oh, I love it! Is it valuable? Doesn’t matter. It’s from you. Priceless.','Darling, you shouldn’t have. You should, however, do it again.','How generous. I’m keeping this, and you, very carefully.']},

 laezel:{
  visit:[
   {open:['* Lae’zel blocks your path, arms crossed.','You. Train with me. Now. I will not ask twice.'],opts:[
    {t:'Yes, ma’am.',r:['* She knocks you down, then offers her hand.','Acceptable. You may come to my tent tonight to discuss your form.']},
    {t:'And if I say no?',r:['Then I will drag you. Which I would also enjoy.']}]},
   {open:['Your discipline is improving. Tsk. It is irritating. I have fewer reasons to scold you.'],opts:[
    {t:'You’ll find new ones.',r:['I always do. It is one of my many talents.']},
    {t:'Do you like scolding me?',r:['* Her eyes narrow, then glint.','Very much. Do not make me say more.']}]},
   {open:['* She hands you a cup of something steaming and suspicious.','Githyanki tea. Drink. Do not make the face.'],opts:[
    {t:'Drink it.',r:['* It burns. You don’t flinch. She looks impressed.','Good. You may be worthy after all.']},
    {t:'Make the face.',r:['Chk. I told you. Weak. Endearing. Weak.']}]},
   {open:['I have decided we will spend the evening together. It is efficient.'],opts:[
    {t:'Efficient how?',r:['We both want it. Why waste time pretending? Come.']},
    {t:'Romantic, you mean.',r:['* A flush crosses her face.','Do not use that word. It is unseemly. Accurate. Unseemly.']}]},
   {open:['* By the fire, she sharpens her blade, glancing at you between strokes.','My people say softness is weakness. I begin to suspect they are wrong.'],opts:[
    {t:'Take her hand.',r:['* She allows it, then laces her fingers through yours.','Do not tell anyone. Ever.']},
    {t:'Softness takes courage.',r:['Then I am very brave tonight. Kiss me before I reconsider.']}]}],
  gift:['A gift. Acceptable. More than acceptable. Do not let it go to your head.','Tsk. Sentiment. I will keep it anyway.','You honor me. I will repay it with a very rigorous training session.']},

 natasha:{
  visit:[
   {open:['* Natasha leans in the doorway, arms crossed.','You’ve been followed all day. By me. You didn’t notice.'],opts:[
    {t:'I noticed.',r:['No you didn’t. But I like that you lie for me.']},
    {t:'Why follow me?',r:['Surveillance. Professional curiosity. Mostly the view.']}]},
   {open:['Spar with me. No rules, no holding back.'],opts:[
    {t:'Accept.',r:['* She flips you and pins you flat, entirely unbothered.','You’re getting better. I’m still better.']},
    {t:'I’ll lose.',r:['Probably. But you’ll lose with style. Come on.']}]},
   {open:['* An empty studio. She laces up old ballet shoes.','I don’t do this for anyone. Sit.','* She dances, slow and precise, eyes on you the whole time.'],opts:[
    {t:'That was beautiful.',r:['It used to be a weapon. With you watching, it’s just dancing.']},
    {t:'Dance with me.',r:['* She pulls you up, leads, and doesn’t step back when the music ends.']}]},
   {open:['You ran your drills at dawn every day this week. Discipline looks good on you.'],opts:[
    {t:'Learning from the best.',r:['Smooth. I taught you that too, didn’t I.']},
    {t:'What else looks good on me?',r:['* A slow smile.','I’ll tell you later. Somewhere private.']}]},
   {open:['* Midnight. She finds you on the roof, two cups of tea.','I don’t trust easily. You know that. I trust you.'],opts:[
    {t:'I won’t waste it.',r:['* She kisses you, brief and serious.','I know. That’s why.']},
    {t:'Tell me something real.',r:['Your ledger is clean. Mine isn’t. You make me want to keep writing anyway.']}]}],
  gift:['Thoughtful. You’ve been watching me closer than I thought.','Thank you. Few people surprise me. You do.','I’ll keep it. Somewhere only I know.']},

 misty:{
  visit:[
   {open:['* Misty waves a fishing rod at you.','Lake day! No excuses! You need fresh air and I need someone to beat at fishing!'],opts:[
    {t:'You’re on.',r:['Ha! Watch and learn, rookie. Biggest catch wins bragging rights forever!']},
    {t:'I’ll bring snacks.',r:['Deal! Snacks and fishing. Best combo ever.']}]},
   {open:['Race you to the dock and back! Last one in buys ice cream!'],opts:[
    {t:'Race her.',r:['* She wins by a splash.','Victory! Don’t worry, I’ll share my sprinkles.']},
    {t:'I’ll buy anyway.',r:['Aw, you’re a good friend. Still racing, though!']}]},
   {open:['* She plops onto the dock, feet in the water.','You’ve been reading every day? That’s awesome! Hobbies keep you sane, trust me.'],opts:[
    {t:'You keep me motivated.',r:['That’s what friends are for! I’ll keep yelling encouragement.']},
    {t:'What’s your favorite hobby?',r:['Water, duh! Swimming, fishing, splashing people. Like this!']}]},
   {open:['My duck got into the picnic basket again. Help me catch him before he eats everything!'],opts:[
    {t:'Chase the duck.',r:['* You both tumble into the grass laughing.','Got him! Mostly. He kept the sandwich.']},
    {t:'Let him have it.',r:['Fine! But you owe me a sandwich then!']}]},
   {open:['* She skips a stone across the lake. Five bounces.','Beat that!'],opts:[
    {t:'Try.',r:['* Two bounces.','Ha! Practice makes perfect. Same time tomorrow?']},
    {t:'Teach me.',r:['Okay, flick your wrist like this. There! Way better!']}]}],
  gift:['Whoa, this is so cool! Thanks! I’m showing everyone!','For me? You’re the best! I’ll take it to the lake!','No way! I owe you a fishing lesson for this one!']},

 rumi:{
  visit:[
   {open:['* Rumi hums a melody while stretching.','Help me rehearse? I need someone to sing to. Someone who won’t laugh.'],opts:[
    {t:'I won’t laugh.',r:['* She sings softly, stepping close until the last note is a whisper.','How was that?']},
    {t:'Sing to me, then.',r:['Careful. Idols are very good at making people fall for them.']}]},
   {open:['Dance practice, now. Step with me. One, two, closer.'],opts:[
    {t:'Follow her lead.',r:['* She spins out, back into your arms, breathless.','Good. Very good. We should practice that move more.']},
    {t:'I have two left feet.',r:['Then just stand there and look handsome. I’ll dance around you.']}]},
   {open:['* She sits on the stage edge, sleeves pulled down over her wrists.','Some days I hide parts of myself. Not with you, though. It’s weird.'],opts:[
    {t:'Show me.',r:['* She slowly pushes up a sleeve. Faint glowing marks. You don’t look away.','You didn’t flinch.']},
    {t:'You’re safe with me.',r:['I know. That’s the scariest part. I like it.']}]},
   {open:['You practiced your hobby every day this week? That’s idol-level dedication.'],opts:[
    {t:'You inspire me.',r:['Stop, I’ll get a big head. Okay, keep going.']},
    {t:'Want to practice together?',r:['Duets are my favorite. Especially with cute partners.']}]},
   {open:['* After the concert, backstage, she pulls you into a quiet corner.','I sang that last song for you. Did you notice?'],opts:[
    {t:'I noticed.',r:['* She kisses you, still breathless from the stage.','Good. Encore later.']},
    {t:'Sing it again.',r:['Here? Just for you?','* She hums it against your ear.']}]}],
  gift:['Oh, I love it! Fans give me gifts all the time. This one actually means something.','For me? That’s so sweet. I’m writing a song about it.','Thank you! I’m putting it in my dressing room. Right where I can see it.']},

 jester:{
  visit:[
   {open:['* Jester bounces over with a basket of pastries.','I baked! Taste test! Also, one of these is a prank. Guess which!'],opts:[
    {t:'Eat one.',r:['* It’s full of hot pepper. She cackles.','The Traveler says hi! Here, have a real one. And a kiss to make it better.']},
    {t:'You eat one first.',r:['Ooh, suspicious! I like that. Smart and cute!']}]},
   {open:['Let me paint you! I promise it’ll be very tasteful. Mostly.'],opts:[
    {t:'Pose dramatically.',r:['* She giggles and paints furiously.','Oh, this is going to be a masterpiece. A slightly scandalous masterpiece.']},
    {t:'What do you mean, mostly?',r:['Artistic license! It’s a real thing! Hold still, handsome.']}]},
   {open:['* She leads you by the hand to a hidden corner of the garden.','Shh! It’s a secret spot. Nobody can find us here.'],opts:[
    {t:'What are we doing here?',r:['* She kisses your nose, then your cheek.','Being sneaky! And cute! Mostly cute!']},
    {t:'Pull her close.',r:['* She squeaks and grins.','Oh! Okay! I like where this is going!']}]},
   {open:['You read a whole book this week? That’s so cool! I drew you a bookmark!','* It’s a little doodle of you, surrounded by hearts.'],opts:[
    {t:'I love it.',r:['Yay! I’m so glad! I drew a lot of hearts. Maybe too many. No such thing!']},
    {t:'Why all the hearts?',r:['* She goes very blue.','Artistic reasons! Shhh!']}]},
   {open:['* By the fire, Jester tucks her tail around your ankle.','You make everything more fun. Like really, really fun.'],opts:[
    {t:'You too.',r:['* She kisses you quick and giggles.','That was fun too! Again?']},
    {t:'Stay close.',r:['Oh, I’m not going anywhere. You’re stuck with me now!']}]}],
  gift:['Oh my gosh! I love it! I love you! I mean, I love it! Both!','A present? For me? I’m going to sketch this right now!','You’re so sweet! The Traveler is going to be so jealous!']},

 mira:{
  visit:[
   {open:['* Mira leans against the studio mirror, arms folded.','Rehearsal. You’re my test audience. Don’t blink.'],opts:[
    {t:'Watch carefully.',r:['* She dances, every move precise, ending inches from your face.','Well? Breathe, handsome.']},
    {t:'Dance with me.',r:['Oh? Think you can keep up? Let’s see.']}]},
   {open:['I made a new routine. It’s about wanting someone you shouldn’t.'],opts:[
    {t:'Who inspired it?',r:['* She just smirks and walks away slowly.']},
    {t:'Show me.',r:['* The dance is all heat and restraint. She ends with her hand on your chest.','Inspired by real events.']}]},
   {open:['* She’s on the rooftop with a bottle of soda and two straws.','Sit. Don’t talk. Just exist with me.'],opts:[
    {t:'Sit beside her.',r:['* She leans her head on you after a while.','This is nice. Don’t ruin it.']},
    {t:'Talk anyway.',r:['Ugh. Fine. You have a nice voice. Keep going.']}]},
   {open:['You actually stuck to your hobby every day? I’m impressed. Slightly. Very slightly.'],opts:[
    {t:'Only slightly?',r:['Okay, a lot. Don’t make me repeat it.']},
    {t:'Impressed enough for a kiss?',r:['* She rolls her eyes, then kisses you anyway.','You’re lucky you’re cute.']}]},
   {open:['* After practice, sweaty and grinning, she pulls you out the back door.','Come on. I need air. And you.'],opts:[
    {t:'Follow her.',r:['* In the alley, she pins you to the wall with a kiss.','Better.']},
    {t:'Just air and me?',r:['Mostly you. Air’s overrated.']}]}],
  gift:['Not bad. Okay, it’s great. Don’t tell anyone I said that.','Hm. Thoughtful. You get points. Big points.','You remembered. That’s kind of hot. Thanks.']},

 zoey:{
  visit:[
   {open:['* Zoey waves her notebook.','I wrote a verse about you! It’s kinda corny. Want to hear it?'],opts:[
    {t:'Rap it for me.',r:['* She raps fast, then ends with a wink.','Rhymed “handsome” with “ransom.” Genius, right?']},
    {t:'Corny’s fine.',r:['Corny is my brand! Okay, here goes.']}]},
   {open:['Let’s write a song together! You do the beat, I do the words!'],opts:[
    {t:'Tap a beat.',r:['* She bounces along, scribbling.','Oh, this is good! You’re a natural! Kiss for the producer!']},
    {t:'I can’t write.',r:['Everyone can write! Just one word. Then another! Like me and you.']}]},
   {open:['* She sits on the steps, notebook open, chewing her pen.','Writer’s block. Distract me?'],opts:[
    {t:'Kiss her.',r:['* She squeaks, then grins.','Okay, that worked. I have like five verses now.']},
    {t:'Tell her a joke.',r:['* She cracks up.','Okay, that’s going in a song. You’re getting credited.']}]},
   {open:['You wrote something every day this week? Look at you! Fellow writer!'],opts:[
    {t:'Inspired by you.',r:['Stop, I’m blushing. Okay don’t stop.']},
    {t:'Some days were just words.',r:['Words count! Every single one. That’s my motto.']}]},
   {open:['* Late night, she’s humming a new melody, notebook pressed to her chest.','This one’s private. About you. Promise not to laugh?'],opts:[
    {t:'Promise.',r:['* She sings it softly, then kisses your cheek.','Okay that was really embarrassing. And really honest.']},
    {t:'Laugh a little.',r:['Hey! Rude! Okay, I’m laughing too. Come here.']}]}],
  gift:['Ahhh! I love it! I’m writing a song about this right now!','For me? You’re the sweetest! Hugs!','I’m putting this right on my notebook so I see it every day!']},
};
