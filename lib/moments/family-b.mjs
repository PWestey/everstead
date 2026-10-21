// Family "visit" and "gift" moments, part B.
// visit: pops up once a day on "Spend time together". gift: one reaction line when he gives her a gift.
// M = {open:[lines], opts:[{t:'player line', r:[reply lines]}]}. Lines starting "* " are narration.
// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 kira:{
  visit:[
   {open:['* Kira tosses you a practice saber and gives hers a showy twirl.','Best of three. Loser makes dinner. Winner gets to be smug. I’ve been practicing smug.'],opts:[
    {t:'You’re on.',r:['* She takes the first round, loses the second, then pins you to the fence on the third.','So I won. I think. Honestly, I’ve stopped caring about dinner.']},
    {t:'What if I want to lose?',r:['Then you’re smarter than you look. Which, for the record, is pretty smart, handsome.']},
    {t:'Go easy on me.',r:['Ha. No. The Empire went easy on nobody, and I turned out great. Mostly.']}]},
   {open:['* You find her on the Training Yard roof, legs dangling, watching the sunset.','Took you long enough. I kept your spot warm. Mostly by sitting in it.'],opts:[
    {t:'Sit beside her.',r:['* She leans her head on your shoulder like it’s nothing. It isn’t nothing.','Don’t move. I’m comfy. That’s an order. I outrank you. I just decided.']},
    {t:'Did you come up here to brood?',r:['Jedi don’t brood. We contemplate. Dramatically. With snacks. Want one?']}]},
   {open:['You trained today, didn’t you? I can tell. You’re doing the walk.','* She steps in close and fixes your collar, way slower than it needs.'],opts:[
    {t:'You noticed?',r:['I notice everything about you. Jedi thing. Very distracting Jedi thing.']},
    {t:'Keep straightening.',r:['* She snorts and tugs you down by the collar instead.','Better?']}]},
   {open:['* Rain hammers the yard. Kira hauls you under the barn eaves, both of you soaked.','Well, there goes our run. Guess we’re stuck. Together. Awful. Truly awful.'],opts:[
    {t:'Tragic indeed.',r:['* Her hand finds yours. When the rain stops, she conveniently doesn’t notice.']},
    {t:'We could still run in it.',r:['Ha! There it is. That’s why I keep you around. Race you to the well! Loser’s wet. Well, wetter.']},
    {t:'You planned this.',r:['I sensed rain coming and didn’t mention it. That’s not planning. That’s opportunism.']}]},
   {open:['Where I grew up, people just vanished. I figured nobody stays. You keep showing up. It’s annoying. The good kind.'],opts:[
    {t:'I’m not going anywhere.',r:['* She kisses your cheek, fast, then shoves you like it never happened.','Don’t make it weird. Okay. Make it a little weird.']},
    {t:'Someone has to keep up with you.',r:['Nobody keeps up with me. You just get closer. A lot closer lately, actually.']}]}],
  gift:['You’re making sarcasm difficult. Fine. I love it. Now come here and make it impossible.','Okay, I love it. I love that you thought of me even more. Get over here.','A present? You’re making it really hard to stay sarcastic. I’ll manage, though.']},

 fannie:{
  visit:[
   {open:['* Fannie grabs your wrist the second she spots you. Her boots are already muddy.','There’s a trail past the ridge that isn’t on any map. Mine included! Come on, before the light goes!'],opts:[
    {t:'Lead the way.',r:['* At the top she throws her arms wide at the view, then turns and looks at you instead.','Huh. Turns out the view’s better this direction.']},
    {t:'Can I hold your hand on the steep parts?',r:['Only the steep parts? Cute that you think there are flat ones.']}]},
   {open:['I put you on my map. Little star, right there by the creek. It means “worth coming back to.”'],opts:[
    {t:'What else is on that map?',r:['Two waterfalls, a cave, one extremely rude goose. And you. You’re my favorite landmark. Don’t tell the goose.']},
    {t:'Then come back often.',r:['* She inks a second star right next to yours.','Every day. Explorer’s honor. That’s legally binding.']}]},
   {open:['* She’s knee-deep in the creek, boots abandoned on the bank, waving you in.','It’s freezing! It’s amazing! Get in, it’s good for your legs after a run!'],opts:[
    {t:'Wade in after her.',r:['* She splashes you, shrieks when you splash back, then grabs you for balance and forgets to let go.']},
    {t:'I’ll guard the boots.',r:['Coward! Cute coward. Fine. But you’re warming me up after.']}]},
   {open:['Sunrise run tomorrow? I know a hill where the whole valley goes gold. Like, ridiculous gold.','* She’s bouncing on her toes, already halfway up the hill in her head.'],opts:[
    {t:'It’s a date.',r:['A date! You said date! I heard it, the goose heard it, no take-backs!']},
    {t:'Only if you slow down for me.',r:['I’ll slow down. Mostly so I can look at you. Shh. Pretend I didn’t say that.']}]},
   {open:['* Night. Fannie lies in the meadow pointing out stars like trail markers.','That one points home. That one points to trouble. And that one, I named after you.'],opts:[
    {t:'Which way are you going?',r:['* She rolls onto her side, close enough that you can feel her breath.','* She puts her map away. “For once I know exactly where I want to be. Right here with you.”']},
    {t:'Which one’s you?',r:['The bright one right beside yours. I picked it. Finders keepers.']}]}],
  gift:['I’ve crossed half the map for good company. You keep making me want to stay in one place.','You found this for me? Okay, now I have to kiss you. Explorer rules. I don’t make them.','Best treasure I’ve ever found, and I didn’t even have to dig! Thank you!']},

 rey:{
  visit:[
   {open:['* Rey spins her staff and plants it in the dirt.','Spar with me? I’ll go easy. Probably. I grew up hitting things for food, so no promises.'],opts:[
    {t:'Pick up a staff.',r:['* Three exchanges in, she sweeps your legs and lands on top of you, laughing.','You’re getting better. I’m getting distracted. Both of those are a problem.']},
    {t:'I’d rather watch you.',r:['* She goes pink and swings a bit harder than she needs to.','Then watch properly.']}]},
   {open:['On Jakku I ate alone every night. Half a portion. Scratching marks on the wall.','* She sets two bowls by the fire.'],opts:[
    {t:'Not alone tonight.',r:['* She scoots over until your shoulders touch.','No. Not anymore. That’s still strange to say out loud.']},
    {t:'Full portions from now on.',r:['Careful. Feed a scavenger once and she never leaves. Ask Finn.']}]},
   {open:['Close your eyes. Breathe. Reach out. Tell me what’s around you.','* Her hands settle over yours, warm and steady.'],opts:[
    {t:'All I feel is you.',r:['* She goes very still, then laughs under her breath.','That’s cheating. It’s not wrong, though.']},
    {t:'I feel the trees, the wind…',r:['Good. You’re listening. Luke said most people never do. I like that you do.']}]},
   {open:['* She’s up to her elbows in a broken waterwheel, grease on her cheek.','Hand me that hydrospanner? Well, it’s a wrench. Same idea. And stop staring, I’m working.'],opts:[
    {t:'Wipe the grease off her cheek.',r:['* She freezes under your thumb.','Missed a bit. Try again. Slower.']},
    {t:'I can stare and help.',r:['Multitasking. Very impressive. Hold this. And, fine, keep staring.']}]},
   {open:['I’ve watched you this month. Up early, out the door, every day. Even the rotten ones.','* She steps in, hands on your chest.','I’m proud of you. And I’ve wanted to do this for a while.'],opts:[
    {t:'Do what?',r:['* She kisses you, quick and fierce, then steps back grinning.','That.']},
    {t:'Then do it.',r:['* She does. When she pulls back, her eyes are bright.','You’re a very good reason not to go back to the desert.']}]}],
  gift:['Something I didn’t have to salvage. You really do listen. Come here. I want to kiss you.','Oh. Oh, that’s beautiful. I don’t even know what to trade you for it.','It’s going somewhere safe. Close to me. Like you, honestly.']},

 nemona:{
  visit:[
   {open:['* Nemona sets her training schedule aside and turns her chair toward you.','I’ve planned enough battles this week. I want a date. With you.'],opts:[
    {t:'I was hoping you’d ask.',r:['I nearly asked yesterday. Then I decided I was being ridiculous waiting for the perfect moment.']},
    {t:'You’re very direct.',r:['Yes. I like you. I don’t see how making that difficult to understand helps either of us.']}]},
   {open:['You’ve been consistent all week. It’s attractive. I wanted to say that plainly.'],opts:[
    {t:'You’ve been watching me?',r:['Yes, and enjoying it. I’d like to see you somewhere that doesn’t smell like a gym.']},
    {t:'Pick the place.',r:['Dinner by the square. I’ll book it. You bring that smile.']}]},
   {open:['* Nemona unpacks a picnic on the quiet side of the lake.','I left the battle gear at home. I want to hear about you for a change.'],opts:[
    {t:'No rematch?',r:['Not tonight. I’d rather get close enough to hear you without shouting across a field.']},
    {t:'Sit beside me.',r:['Gladly. That was rather the point of bringing one blanket.']}]},
   {open:['I like being challenged. I also like this, when I can stop proving anything.'],opts:[
    {t:'You can relax with me.',r:['I’m beginning to notice. I’d like more evenings that feel like this.']},
    {t:'I like this side of you.',r:['Then stay and get to know it. I’m not in a hurry to go anywhere.']}]},
   {open:['* Nemona walks you to the gate and keeps your hand in hers.','I had a good evening. I want another. And I’d like to kiss you.'],opts:[
    {t:'You don’t have to ask twice.',r:['Good. I was hoping you’d say that. Come closer.']},
    {t:'I’d like another evening too.',r:['Then we’ll arrange it. I’m not leaving a date with you to chance.']}]}],
  gift:['You remembered what I like. Your turn: I’d like to take you out tonight. My treat.','I remembered you on my way home, too. I was hoping you’d have time for dinner with me.','* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 karlach:{
  visit:[
   {open:['* Karlach scoops you clean off your feet in a hug.','There you are! Missed you! Careful, engine’s running a bit hot today. Totally worth it.'],opts:[
    {t:'Hug her back.',r:['* Her infernal engine thrums hard enough to feel through your ribs.','Hear that? That’s you, that is. Every time.']},
    {t:'You’re literally steaming.',r:['That’s just me being chuffed to see you, soldier. Get used to it.']}]},
   {open:['Arm wrestle. Winner picks dinner. Loser gives the winner a piggyback all the way there.'],opts:[
    {t:'Deal.',r:['* She wins, obviously, and doesn’t let go of your hand afterward.','Hope your back’s ready. Gently, mind. Romantically.']},
    {t:'I just want to hold your hand.',r:['* She goes bright red, which on a tiefling is really saying something.','Oh. Oh, that’s cheating. Fine. Hold it. Don’t let go.']}]},
   {open:['* Late. Karlach stretches out by the fire, the flames leaning toward her like old friends.','Ten years in Avernus, and what I missed most was this. Quiet. Company. You.'],opts:[
    {t:'Lie down beside her.',r:['* She tugs you in against her warm side and sighs.','Best night in ages. Don’t you dare fall asleep first.']},
    {t:'Tell me about the good days.',r:['Easy. The good days are the ones you turn up for. Next question.']}]},
   {open:['You trained today. I can tell. You’ve got that post-workout swagger.','* She pokes your arm, then gives it a squeeze.'],opts:[
    {t:'Like what you see?',r:['Love what I see. And I want to keep seeing it. Every day, yeah? Promise me.']},
    {t:'Swagger?',r:['Swagger. Strut. Big gorgeous confidence. Keep that up and I’ll be useless all day.']}]},
   {open:['Know what I love about touching you? I can. No burning. Nobody flinching.','* She cups your face in both hands, warm as a forge.'],opts:[
    {t:'Then don’t pull away.',r:['* She kisses you, long and warm.','Not pulling away. Not ever. Not from you, soldier.']},
    {t:'You deserve this.',r:['* Her eyes go glassy.','Stop it. You’ll make me cry, and then I’ll steam, and it’s a whole thing. Kiss me instead.']}]}],
  gift:['For me? You sweetheart. Let me put it somewhere safe. I want to kiss you with both hands free.','You absolute sweetheart. My engine’s doing the loud thing again.','I love it! Not as much as I love that you thought of me. But close. Really close.']},

 shallan:{
  visit:[
   {open:['* Shallan has her sketchbook up, glancing at you, then down, then up.','Hold still. You keep moving your face. Faces are hard. Handsome ones are harder. Pattern, stop humming.'],opts:[
    {t:'Let me see it.',r:['* She clutches the book to her chest.','Absolutely not. It’s… flattering. Deeply flattering. It’s a catastrophe.']},
    {t:'Draw me any way you like.',r:['That’s a dangerous offer to make a woman with my imagination. Accepted. Immediately.']}]},
   {open:['I made up a word today. “Swoonstruck.” It means staring at someone so long you forget your work.','Not that I would know. Purely theoretical.'],opts:[
    {t:'Who struck you?',r:['Some fellow with good habits and a nice jaw. Never mind. Pattern, stop buzzing. I am not lying.']},
    {t:'I’ve been swoonstruck too.',r:['* She drops her charcoal.','Oh. Well. Storms. That’s mutually inconvenient.']}]},
   {open:['* She leads you to a cluttered library corner, half hidden behind a shelf of Vorin theology.','Nobody comes back here. I checked. Thoroughly. For scholarly reasons.'],opts:[
    {t:'What are we studying?',r:['* She pulls you closer by your shirt.','Proximity. Very important field. Badly underfunded.']},
    {t:'You planned a secret meeting?',r:['I plan everything. I just pretend I don’t. It’s my best illusion, honestly.']}]},
   {open:['Some days I want to wear somebody else’s face. Veil’s. Radiant’s. Anyone’s. Today’s one of those.','* Her voice is quieter than usual.'],opts:[
    {t:'I like your real face best.',r:['* She looks at you for a long time.','You can’t just say that to an illusionist. It ruins everything. Say it again.']},
    {t:'Then hide here with me.',r:['* She curls into your side.','Ten minutes. Then I’ll be brave again. Probably. Ish.']}]},
   {open:['* She breathes out Stormlight, and the air shimmers into a candlelit ballroom for two.','Dance with me? It’s not real. Well. This bit is.'],opts:[
    {t:'Take her hand.',r:['* She steps on your foot twice and laughs both times.','* She shuts the sketchbook. “I’d rather remember this without a drawing. Kiss me again?”']},
    {t:'Which part is real?',r:['* She kisses you softly.','That part. Obviously. Keep up.']}]}],
  gift:['Oh, you remembered. I’ll draw it later. Right now I’d rather find out how you kiss.','Oh, this is lovely. I’m speechless, which happens about once a year. Savor it.','You have excellent taste. In gifts, I mean. Also in company. Mostly in company.']},

 jaina:{
  visit:[
   {open:['* Jaina stands at the harbor railing, the wind tugging at her white hair.','Kul Tiran blood. The sea settles me. I’m beginning to suspect you do too.'],opts:[
    {t:'Stand beside her.',r:['* She threads her arm through yours without looking.','Stay a while. The kingdom has survived worse than an hour without me.']},
    {t:'Only beginning to suspect?',r:['I’m an archmage. I don’t draw conclusions without a great deal of evidence. Keep providing it.']}]},
   {open:['You did good work today. Most people confuse busy with useful. Dalaran is full of them. You aren’t one.'],opts:[
    {t:'I learned from the best.',r:['Flattery. Transparent. Continue, please, I’m enjoying it.']},
    {t:'Reward me?',r:['* A small, dry smile.','Name it. Within reason. Possibly slightly outside it.']}]},
   {open:['* She traces frost on the window with one fingertip, then writes your initials in it.','Tell anyone the Lord Admiral doodles and I will deny it and freeze your boots to the floor.'],opts:[
    {t:'Draw a heart around it.',r:['* She hesitates, then does, and the frost glows faintly blue.','There. That’s classified now. Kirin Tor level.']},
    {t:'Your secret’s safe.',r:['I know. That’s why you get the others too.']}]},
   {open:['Come. I want to show you something. Don’t lock your knees. It helps.','* A flash of arcane light, and you’re both on a quiet cliff above a moonlit sea.'],opts:[
    {t:'Where are we?',r:['Somewhere nobody needs anything from me. Except, perhaps, you. That’s acceptable.']},
    {t:'You teleported us on a date?',r:['Walking is slow, and the road would have wanted your attention. I didn’t feel like sharing.']}]},
   {open:['* She sets aside her heavy mantle and sits beside you by the fire.','I carry Theramore with me everywhere. It’s strange how much lighter it gets when you’re here.'],opts:[
    {t:'Let me carry some of it.',r:['* She rests her head against your shoulder.','* She leaves her mantle on the chair. “I’m staying. Tell me if you’d like another kiss.”']},
    {t:'Then stay close.',r:['* She leans in and kisses you, cool lips, warm intent.','I intend to. I’m very stubborn. Ask Thrall.']}]}],
  gift:['Thoughtful, and chosen for me rather than the Lord Admiral. I’d like to thank you somewhere quieter.','Oh. You remembered. That means more than you know. More than I’ll say, anyway.','You spoil me, and I’m far too old and far too powerful to object. Thank you.']},

 nash:{
  visit:[
   {open:['* Nash spins her blaster on one finger and drops it into the holster.','Got a job tonight. Trackin’ a skip out past the ridge. Wanna ride along, partner?'],opts:[
    {t:'Saddle up.',r:['* She grins and pats the seat behind her.','Arms around me. Tighter. Atta boy.']},
    {t:'Is this a date or a job?',r:['Why not both? Jobs I bill for. Dates are on the house. Don’t get used to free.']}]},
   {open:['You hit every deadline today. On time, too. Punctual man’s real attractive in my line of work.'],opts:[
    {t:'Is that so?',r:['Mm-hm. Means he respects my time. And I got real little patience for folks who don’t.']},
    {t:'I try to impress you.',r:['It’s workin’. Don’t quit now, I got credits ridin’ on you.']}]},
   {open:['* Back of the cantina, she slides a drink your way and leans on the bar.','First rule of huntin’: never let the mark see you smile. You keep makin’ me break it.'],opts:[
    {t:'So I’m your mark?',r:['Bounty on you’s pretty steep. Reckon I’ll keep you instead of turnin’ you in.']},
    {t:'Smile anyway.',r:['* She does, slow and crooked.','Happy? Don’t tell the other hunters. I got a rep.']}]},
   {open:['Lemme teach you to shoot. You hold that thing like it owes you money.'],opts:[
    {t:'Show me.',r:['* She steps in behind you, arms over yours, chin on your shoulder.','Breathe out. Squeeze. Eyes on the target, sweetheart. Not on me. Target.']},
    {t:'You just want an excuse to get close.',r:['Caught me. Least I’m honest about my motives. Most hunters ain’t.']}]},
   {open:['* Starlight. Nash lies back on the hood of her speeder, boots crossed at the ankle.','Most nights I count stars and payouts. Tonight I’m countin’ on you stickin’ around.'],opts:[
    {t:'I’m staying.',r:['* She tips her hat over both your faces and kisses you under it.','Good. Consider that contract closed.']},
    {t:'What’s the payout?',r:['Me. Best deal this side of the Rim. Limited time. Get up here.']}]}],
  gift:['No contract attached? I like that. Let me take you out and say thank you properly.','Shiny. I like it. Like the fella who gave it to me even more.','Keepin’ this. You just bought yourself a whole lotta goodwill, partner. Don’t spend it all at once.']},

 carol:{
  visit:[
   {open:['* Carol touches down in a burst of light right in front of you.','Wanna go up? I’ve got you. I won’t drop you. Probably. I’ve only ever dropped one guy, and he was a Skrull.'],opts:[
    {t:'Take me up.',r:['* Above the clouds, she spins you once, laughing.','Best view on the planet, right? I meant the clouds. Mostly the clouds.']},
    {t:'I prefer the ground.',r:['Then I’ll come down to you. I can be very down to earth. That was a joke. You can laugh.']}]},
   {open:['You cleared your whole list today. That’s mission complete, flyboy.','* She snaps off a salute, then smirks.'],opts:[
    {t:'Do I get a medal?',r:['* She kisses your cheek.','Better than a medal. Don’t let it go to your head. Okay, a little.']},
    {t:'Higher. Further. Faster.',r:['Hey, that’s my line. And you saying it is weirdly hot. Say it again.']}]},
   {open:['* Her cat jumps into your lap and settles in. Carol stares.','Goose doesn’t like anybody. He likes you. That is a huge red flag. For me.'],opts:[
    {t:'Why for you?',r:['Because now I’m going to like you even more. Dangerous. Fury would call it a security risk.']},
    {t:'Pets have good instincts.',r:['Yeah. So do pilots. Mine are telling me not to move.']}]},
   {open:['Arm wrestle me. No powers. Honest. Pilot’s honor. Maria would vouch for me. Okay, she wouldn’t.'],opts:[
    {t:'Accept.',r:['* She wins anyway, then lets go of your hand very slowly.','Okay, I used a little. I wanted to hold your hand longer. Sue me.']},
    {t:'You’ll cheat.',r:['Me? Never. Okay, maybe. You’re fun to cheat against.']}]},
   {open:['* Late night on the airfield, her glow dimmed to a soft gold.','I’m always flying somewhere. Always another mission. With you, I actually want to land.'],opts:[
    {t:'Then land.',r:['* She steps into your arms and kisses you, warm and certain.','Touchdown.']},
    {t:'I’ll be your runway.',r:['That is the cheesiest thing anyone has ever said to me, and I’ve been to Hala. Come here.']}]}],
  gift:['You chose something just for me. No mission, no medal. Come closer, I want to thank you.','Love it. Got it. Never letting it go. Kinda like you.','You know I can fly anywhere and buy anything, right? This is better. You picked it.']},

 gamora:{
  visit:[
   {open:['* Gamora is drilling alone, blade flashing. She stops when she sees you.','You’re late. I don’t forgive lateness. I am considering an exception. Don’t ask why.'],opts:[
    {t:'Spar with me.',r:['* She disarms you in two moves and rests the blade under your chin.','Do you yield? Or should I keep you here a while?']},
    {t:'I’m worth the exception.',r:['Arrogant. Irritatingly accurate. Do not do it again.']}]},
   {open:['There’s music in the square. People are dancing. I don’t dance. Quill tried to make me. It went badly for him.'],opts:[
    {t:'Offer your hand.',r:['* She stares at your hand like it might be a trap, then takes it.','One song. If you tell anyone, I will deny it. Violently.']},
    {t:'Then just stand with me.',r:['* She steps closer, swaying a little despite herself.','This isn’t dancing. This is standing. Rhythmically.']}]},
   {open:['You did your work properly today. No shortcuts. I noticed. Nebula would have taken shortcuts.'],opts:[
    {t:'High praise from you.',r:['It is. Don’t waste it. I don’t repeat myself.']},
    {t:'What else did you notice?',r:['* She steps in, eyes level with yours.','That you keep looking at my mouth. Again.']}]},
   {open:['* She sits on the edge of the roof, sharpening her sword under the stars.','Thanos raised me to trust no one. You are making that very inconvenient.'],opts:[
    {t:'Sit beside her.',r:['* She lets her shoulder rest against yours.','This is a tactical position. Good sightlines. That is all.']},
    {t:'Trust me a little.',r:['I trust you a lot. That is what frightens me. Nothing frightens me.']}]},
   {open:['* She stops you in the hallway with one hand flat on your chest.','I’ve assessed this from every angle. I’ve made a decision.'],opts:[
    {t:'Decided what?',r:['* She kisses you, precise and unhurried.','That. Objections?']},
    {t:'Tell me your plan.',r:['Step one: close the distance. Step two: you figure out step two. I have faith in you.']}]}],
  gift:['You chose well. I would like to thank you with a kiss. Is that clear enough?','People usually give me weapons. Or try to stab me with them. I prefer this.','Thank you. I will guard it with my life. And possibly with yours.']},

 kate:{
  visit:[
   {open:['* Kate’s on the roof with a hammer and a mouthful of nails.','Hold the ladder? And no looking up. Okay. A little looking up. Lucky, stop licking his shoes.'],opts:[
    {t:'Hold the ladder.',r:['* She climbs down straight into your arms, grinning.','Whoops. Totally slipped. Super accidental. Ten out of ten landing, though.']},
    {t:'I’ll fix it, you hold the ladder.',r:['A guy who does his own repairs? Stop. You’re making me swoon on a roof. That’s a safety issue.']}]},
   {open:['Archery date. I bet you a pizza I can hit the bullseye blindfolded.','* She ties a scarf over her eyes.'],opts:[
    {t:'Prove it.',r:['* Thunk. Dead center. She pulls the scarf down, extremely smug.','Your turn. I’ll stand behind you and fix your form. Strictly professional. Ish.']},
    {t:'Kiss her while she can’t see.',r:['* She laughs into it.','Okay, did not see that coming. Literally. Do it again.']}]},
   {open:['* Lucky flops at your feet and demands belly rubs.','He’s decided you’re family. That’s huge. He has standards. Well. He eats crusts off the floor. But still.'],opts:[
    {t:'And do I meet yours?',r:['Mostly. You’d meet more of them if you kissed me right now.']},
    {t:'Good boy.',r:['Him or you? Honestly, both apply today.']}]},
   {open:['You cleaned the whole kitchen today? Without being asked? Marry me. Wait. You’re taken. Ugh. Respect.'],opts:[
    {t:'You can still admire me.',r:['Oh, I’m admiring. Loudly. Look at that counter. Clint’s counter has never once looked like that.']},
    {t:'It’s just chores.',r:['Just chores is literally how you keep a home. Also? Hot. Very hot.']}]},
   {open:['* Late, on her fire escape, splitting a slice of cold pizza.','This is my favorite kind of night. Simple. Quiet. Pizza. You. In that order. Kidding. Mostly.'],opts:[
    {t:'Share the last bite.',r:['* She takes it, then kisses the crumbs off your lip.','Fair trade. Very fair.']},
    {t:'Same time tomorrow?',r:['Same time every day. That’s how good things work. Bring better pizza.']}]}],
  gift:['Okay, you remembered. That’s unfairly attractive. Can I kiss you before I say anything less composed?','Wait, you got me something? I’m terrible at receiving. Hug me before I make it weird.','Perfect. Total bullseye. You know me way too well.']},

 gwen:{
  visit:[
   {open:['* Gwen finishes a sound check and rests her drumsticks on the stool.','The band’s done for tonight. Want to get dinner with me? Just us.'],opts:[
    {t:'I’d like that.',r:['Good. I’ve been looking for a reason to get you out of the audience and beside me.']},
    {t:'You mean a date?',r:['I do. I can manage a drum solo in front of strangers. I can ask you out.']}]},
   {open:['You took care of the house today. I like a man who notices what needs doing.'],opts:[
    {t:'You noticed me too?',r:['More than once. I’ve been trying not to make staring my main hobby.']},
    {t:'Want some help here?',r:['Yes, then dinner. I’d rather spend some of tonight enjoying your company than inventing repairs.']}]},
   {open:['* Gwen sits on her apartment steps, a takeout bag beside her.','I got enough for two. I was hoping you’d come by.'],opts:[
    {t:'You could have called.',r:['I know. Next time I will.','I’m trying to get better at asking for the things I want.']},
    {t:'Sit close, then.',r:['Gladly. I’m done spending the whole evening across the room from you.']}]},
   {open:['I can keep a beat in any room. You’re proving rather distracting.'],opts:[
    {t:'I can move my hand.',r:['I’d rather you didn’t. I like finding out what it feels like to stop performing for a minute.']},
    {t:'Good distraction?',r:['Very. Stay and let me get used to it.']}]},
   {open:['* After the set, Gwen puts her jacket on and walks toward you.','I was looking for you during the last song. I’d like to finish the night together.'],opts:[
    {t:'Walk home with me.',r:['Yes. Take the longer route. I’m enjoying this.']},
    {t:'Can I kiss you first?',r:['I was hoping you would. No mask tonight. Just me.']}]}],
  gift:['You remembered. I was going to play it cool. I’d rather take your hand and ask you out.','I remembered you on my way home, too. I was hoping you’d have time for dinner with me.','* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 ororo:{
  visit:[
   {open:['* Ororo kneels in her rooftop garden, sleeves pushed up, soil on her hands.','Help me with the tomatoes? They respond to gentle hands. And to a little rain, when I am in a good mood.'],opts:[
    {t:'Kneel beside her.',r:['* Her fingers guide yours into the soil, lingering.','Gentle. Patient. Yes. Like that.']},
    {t:'Do I have gentle hands?',r:['I suspect so. I may need to test the theory further.']}]},
   {open:['* A warm breeze curls around you both out of a clear sky.','I made this for you. The weather answers to me. Today it answers to my mood.'],opts:[
    {t:'And what’s your mood?',r:['* She steps closer, her eyes going faintly white.','Warm. Dangerously warm.']},
    {t:'Make it rain.',r:['* Soft rain begins to fall. She makes no move toward shelter.','There. Now we are both soaked. Whatever shall we do?']}]},
   {open:['I passed your house this morning. Porch swept, gutters clear. A man who tends his home tends his heart.'],opts:[
    {t:'You noticed?',r:['I notice what is cared for. You care well. Charles would approve.']},
    {t:'I wanted you to notice.',r:['* She smiles, slowly.','Then you succeeded. Come and tend to me a while.']}]},
   {open:['* Night. Ororo lies on the rooftop while lightning dances silently along the horizon.','Watch. I will make it spell something.'],opts:[
    {t:'What will it spell?',r:['* The sky flickers into the shape of a heart.','Subtle, no? I was once worshipped as a goddess, not a poet.']},
    {t:'I’d rather watch you.',r:['* She turns to you, lightning still in her eyes.','Then watch closely. I do not do this for everyone.']}]},
   {open:['Small spaces still frighten me. Since Cairo. But near you I can feel open sky. It is strange.','* She takes your hand.'],opts:[
    {t:'I’ll be your sky.',r:['* She kisses you, slow as rising wind.','Careful. I take promises about the sky very seriously.']},
    {t:'You’re safe with me.',r:['I know. I have not said that about many places. Or many people.']}]}],
  gift:['How thoughtful. Set it by the flowers. I would rather hold your hands for a moment.','Thank you. A gift given with care grows into something. Like a seed. Like this.','You are thoughtful. The sky brightens when you smile like that. That one was not me.']},

 annamarie:{
  visit:[
   {open:['* Anna Marie pats the porch swing and hands you a sweating glass of sweet tea.','Sit a spell, sugar. I made too much. On purpose. Don’t tell nobody.'],opts:[
    {t:'Sit close.',r:['* She tucks her feet under her and leans into your side, gloves and all.','There. Now we’re talkin’.']},
    {t:'On purpose?',r:['I’m a Mississippi girl, darlin’. We always make extra for the fella we’re hopin’ shows up.']}]},
   {open:['* She peels off one glove, slow, finger by finger.','Can’t touch skin. You know that. But I can do this much.'],opts:[
    {t:'Do what?',r:['* She lays her bare palm over your shirt, right on your heartbeat.','Feels like it’s runnin’ mighty fast, sugar.']},
    {t:'Put that glove back on before I faint.',r:['Oh, I like you flustered. Might take the other one off too, just to see.']}]},
   {open:['Your house was spotless today. Mama always said a man who keeps a good home is a man worth keepin’.'],opts:[
    {t:'You keeping me?',r:['Honey, I’m considerin’ it real serious.']},
    {t:'I learned from your porch.',r:['Well, ain’t you sweet. Sweeter than this tea, and I put a whole lotta sugar in it.']}]},
   {open:['* She grabs your hand and lifts you both into the evening air.','Hold on, sugar! Don’t look down! Okay, look down. It’s real pretty.'],opts:[
    {t:'Hold her tighter.',r:['* She laughs against your ear.','Was hopin’ you’d do that.']},
    {t:'Don’t you dare drop me.',r:['Drop you? Never. I’m keepin’ you right close.']}]},
   {open:['* By the kitchen stove, she holds a silk scarf between her lips and yours.','Silk’s thin. It’s the closest I can get without hurtin’ you. That alright?'],opts:[
    {t:'It’s perfect.',r:['* She kisses you through the silk, and somehow it’s enough.','Darlin’, that was worth every year of waitin’.']},
    {t:'Anything with you is alright.',r:['* Her eyes shine.','Well. You just made a Southern girl blush clear to her ears.']}]}],
  gift:['Oh, sugar. You remembered. Sit beside me. I’ve got a long thank-you and nowhere I need to rush off to.','Oh, honey, it’s perfect. It’s goin’ right on my nightstand.','You spoil me, sugar. Keep on doin’ it. I like bein’ spoiled by you.']},

 violet:{
  visit:[
   {open:['* Violet sits on the training mat, wrapping her wrists tight.','Spar with me. And if you go easy because I’m small, I’ll know, and I’ll stab you. A little.'],opts:[
    {t:'I won’t go easy.',r:['* She pins you on the third throw and takes her time getting up.','Good. I hate easy. This, I don’t hate.']},
    {t:'You’re not small. You’re terrifying.',r:['Correct answer. You get to live.']}]},
   {open:['I read all night. A whole book on dragon courtship rituals. For research. Tairn says I’m pathetic.'],opts:[
    {t:'What did you learn?',r:['They circle each other for weeks before admitting anything. Sound familiar? Don’t answer that.']},
    {t:'Research for what?',r:['* She goes red.','For… dragons. Obviously. Stop smirking. Tairn, stop laughing.']}]},
   {open:['* She hands you a dagger, then steps behind you.','Your grip’s wrong. Here.','* Her hands slide over yours, steady and warm.'],opts:[
    {t:'Better?',r:['Much. Now stop breathing like that. It’s distracting.']},
    {t:'You’re distracting.',r:['That’s the lesson. Focus anyway. Nobody at Basgiath waits till you’re ready.']}]},
   {open:['You kept your routine every single day this week. Do you know how rare that is? I do. I count.'],opts:[
    {t:'You inspire me.',r:['* She looks at you a long moment.','Don’t say that unless you mean it. I believe what people tell me. It’s a flaw.']},
    {t:'You’re not so bad yourself.',r:['Not so bad? I’ll show you not so bad. Mat. Now.']}]},
   {open:['* Lightning splits the sky. She pulls you into the archive stacks, out of sight.','Storms make my signet restless. Stay with me till it passes? Paper burns easy.'],opts:[
    {t:'Stay.',r:['* She kisses you as thunder rolls, electric and certain.','Storm’s passing. I’m still not letting go.']},
    {t:'Is it the storm, or me?',r:['Both. With you, it’s always both.']}]}],
  gift:['You paid attention. That’s far more dangerous than any dagger on my shelf. Come here.','You thought of me. That’s the actual gift. Thank you.','It’s going right next to my daggers. That’s the most honored shelf I own.']},

 alleria:{
  visit:[
   {open:['* Alleria nocks an arrow and nods at a target you can barely see.','Show me your patience. Then I will show you mine. Mine is several centuries deep.'],opts:[
    {t:'Take the shot.',r:['* You miss. She smiles, close at your ear.','Again. Slower. I have outwaited the Burning Legion. I can wait for you.']},
    {t:'Show me yours first.',r:['* She looses without taking her eyes off you. Bullseye.','Patience. Practice. Focus. Mostly on you, as it happens.']}]},
   {open:['I have lived a very long time. I have rarely found anyone so worth watching.'],opts:[
    {t:'Watching?',r:['Your focus. Your stubbornness. Your hands when you work. Yes. Watching. Rangers watch.']},
    {t:'I’ll try to stay interesting.',r:['You needn’t try. That is rather the point. Trying is for my sisters.']}]},
   {open:['* She leads you deep into the forest, to a glade lit with silver moths.','My people came to places like this to make vows. I brought you to make none. Only to be.'],opts:[
    {t:'Sit together in the quiet.',r:['* Her fingers find yours in the grass.','Quiet suits you. It suits very few humans.']},
    {t:'It’s beautiful.',r:['So I’m told. Eversong was lovelier, once. I wanted to see this one beside you.']}]},
   {open:['You kept your discipline when no one was watching. That is the only kind that counts.'],opts:[
    {t:'Someone was watching.',r:['* A sly look.','Perhaps. I was a ranger-captain before your grandfather was born. I watch everything.']},
    {t:'I learned it from you.',r:['Then I am a better teacher than Vereesa claims. Come and collect your reward.']}]},
   {open:['* The shadows around her ripple with void power. She steadies herself on your arm.','The Void whispers, some nights. Near you it whispers less. I don’t know why. I don’t mind.'],opts:[
    {t:'Hold her.',r:['* She lets you, forehead resting on yours.','* She lowers her bow and takes your hand. “I chose this evening for us. I would like you to stay.”']},
    {t:'Then stay near me.',r:['* She kisses you, slow and wild as the forest.','I had already decided to.']}]}],
  gift:['A thoughtful gift. I have something to ask in return: spend the evening with me.','You remembered what I like. Few do. My own sisters forget.','Thank you. I will think of you whenever I see it. Which will be often.']},

 vex:{
  visit:[
   {open:['* Vex walks a gold coin across her knuckles.','Heads, you buy me dinner. Tails, I buy you dinner and you owe me. With interest.'],opts:[
    {t:'Flip it.',r:['* Heads. She grins.','Oh, darling. It was always going to be heads. Both sides are. I had it made.']},
    {t:'Why not both?',r:['Two dinners? My, aren’t you generous. Generous is my favorite quality in a man.']}]},
   {open:['* Trinket sniffs you thoroughly, then flops over for belly scratches.','He likes you. He has excellent taste. He gets it from me.'],opts:[
    {t:'Scratch the bear.',r:['* She watches, chin on her hand.','You’re very good with your hands. Just making a note.']},
    {t:'And do you like me?',r:['A lady never tells. A ranger, however, might drop a hint or two.']}]},
   {open:['You stayed under budget this week? Darling, you have no idea how attractive that is.'],opts:[
    {t:'Tell me.',r:['* She leans in close.','Focus, and coin left over at the end of the week? I might actually swoon.']},
    {t:'It wasn’t easy.',r:['The best things never are, darling. I’d know. I’m one of them.']}]},
   {open:['* She hops on her broom and holds out a hand.','Come on. I know a cliff with a view nobody’s charging admission for. Yet. I’m working on it.'],opts:[
    {t:'Hop on.',r:['* You fly over the treetops. She leans back against you.','Hold on, darling. Tighter. Mm, perfect.']},
    {t:'Is the broom safe?',r:['Absolutely not. That’s rather the fun of it.']}]},
   {open:['Hold still. There’s a leaf in your hair.','* She plucks it out, then doesn’t step back.'],opts:[
    {t:'Was there really a leaf?',r:['* She sets her coin down. “No wager. I want you to stay because you want to. Do you?”']},
    {t:'Kiss her.',r:['* She kisses back, smiling.','Well. That was worth more than gold, and I don’t say that lightly.']}]}],
  gift:['Darling, you remembered. That’s worth much more than the price. Come claim a proper thank-you.','Darling, you shouldn’t have. Do it again anyway. Often.','How generous. I’m keeping this, and you, very carefully. Vax would call it hoarding. Vax is jealous.']},

 laezel:{
  visit:[
   {open:['* Lae’zel blocks your path, arms crossed.','You. Train with me. Now. I do not ask twice. I barely asked once.'],opts:[
    {t:'Yes, ma’am.',r:['* She knocks you flat, then offers her hand.','Acceptable. Come to my tent tonight. We will discuss your form. At length.']},
    {t:'And if I say no?',r:['Then I drag you. Which I would also enjoy. Tsk’va.']}]},
   {open:['Your discipline is improving. Tch. It is irritating. I have fewer reasons to scold you.'],opts:[
    {t:'You’ll find new ones.',r:['I always do. It is one of my many talents. Most of them involve scolding.']},
    {t:'Do you like scolding me?',r:['* Her eyes narrow, then glint.','Very much. Do not make me say more, istik.']}]},
   {open:['* She hands you a cup of something steaming and suspicious.','Githyanki tea. Drink it. Do not make the face.'],opts:[
    {t:'Drink it.',r:['* It burns all the way down. You don’t flinch. She looks impressed.','Good. Perhaps you are not entirely worthless.']},
    {t:'Make the face.',r:['Chk. I warned you. Weak. Endearingly weak, but weak.']}]},
   {open:['I have decided we will spend this evening together. It is efficient.'],opts:[
    {t:'Efficient how?',r:['We both want it. Why waste time pretending otherwise? Come. Walk faster.']},
    {t:'Romantic, you mean.',r:['* A flush crosses her face.','Do not say that word. It is unseemly. Accurate. But unseemly.']}]},
   {open:['* By the fire, she sharpens her blade, glancing at you between strokes.','In the crèche, softness was weakness. I begin to suspect they lied about many things.'],opts:[
    {t:'Take her hand.',r:['* She allows it, then laces her fingers through yours.','* She puts down her blade. “Yes, I want this. Say what you want. We need not guess.”']},
    {t:'Softness takes courage.',r:['Then I am very brave tonight. Kiss me before I come to my senses.']}]}],
  gift:['You brought this for me. I accept. Now tell me if you would welcome a kiss.','Tch. Sentiment. I will keep it anyway. For tactical reasons.','You honor me. I will repay it with an extremely rigorous training session. At dawn.']},

 natasha:{
  visit:[
   {open:['* Natasha leans in the doorway, arms crossed.','You were followed all day. By me. You didn’t notice once.'],opts:[
    {t:'I noticed.',r:['No, you didn’t. But I like that you’d lie for me.']},
    {t:'Why follow me?',r:['Habit. Professional curiosity. Honestly? The view.']}]},
   {open:['Spar with me. No rules. Clint always asks for rules. Don’t be Clint.'],opts:[
    {t:'Accept.',r:['* She flips you and pins you flat, completely unbothered.','You’re getting better. I’m still better. That won’t change.']},
    {t:'I’ll lose.',r:['Probably. But you’ll lose with style. Come on, up.']}]},
   {open:['* An empty studio. She laces up a pair of old ballet shoes.','I don’t do this in front of people. Sit.','* She dances, slow and precise, eyes on you the whole time.'],opts:[
    {t:'That was beautiful.',r:['The Red Room made it a weapon. With you watching, it’s just dancing again.']},
    {t:'Dance with me.',r:['* She pulls you up, leads, and doesn’t step back when the music stops.']}]},
   {open:['You ran your drills at dawn every day this week. No phone, no excuses. Discipline looks good on you.'],opts:[
    {t:'Learning from the best.',r:['Smooth. I taught you that too, didn’t I?']},
    {t:'What else looks good on me?',r:['* A slow smile.','I’ll tell you later. Somewhere without windows.']}]},
   {open:['* Midnight. She finds you on the roof with two cups of tea.','I don’t trust easy. You know that. I trust you.'],opts:[
    {t:'I won’t waste it.',r:['* She kisses you, brief and serious.','I know. I checked.']},
    {t:'Tell me something real.',r:['My ledger’s still got a lot of red in it. Being around you makes me want to keep paying it down.']}]}],
  gift:['You remembered a small detail. That matters to me. Let me thank you where nobody needs a disguise.','Thank you. Very few people surprise me. You keep doing it.','I’ll keep it. Somewhere nobody else knows about. Not even Fury.']},

 misty:{
  visit:[
   {open:['* Misty locks the Gym office and slips the keys into her coat.','That’s the last report. Come have dinner with me. I’ve been looking forward to asking.'],opts:[
    {t:'I’d like that.',r:['Good. I picked a place by the water. I’d like a table where I can sit beside you.']},
    {t:'A date, then?',r:['A date. I can run a Gym. I can say I like you without turning it into a competition.']}]},
   {open:['No race tonight. I want time with you without keeping score.'],opts:[
    {t:'You planned all this?',r:['Yes.','I thought you’d like it. I wanted to see that smile when you arrived.']},
    {t:'Sit beside me.',r:['I intended to. I’ve spent enough time finding excuses to get close.']}]},
   {open:['* Misty sets her book down when you arrive.','You’ve been reading every evening. I’d like to hear what kept your attention.'],opts:[
    {t:'Sit close and I’ll tell you.',r:['Gladly. I like hearing your voice when neither of us is in a hurry.']},
    {t:'You want the whole story?',r:['I want to hear you enjoy telling it. That’s usually my favorite part.']}]},
   {open:['I’ve managed the Gym for years. I’m used to people needing things. I like you just being here.'],opts:[
    {t:'I like being here.',r:['Then stay.','I’ve got nowhere else I want to be tonight.']},
    {t:'You can ask for things too.',r:['All right. Take me out again. I’d like to keep getting to know you.']}]},
   {open:['* Misty takes your hand as the last light settles on the lake.','I’ve been thinking about kissing you all evening. I’d rather stop thinking about it.'],opts:[
    {t:'Then kiss me.',r:['Come closer.','That’s a much better way to end the evening.']},
    {t:'I’d like to see you again.',r:['Good. Tomorrow, if you’re free. I’m not going to pretend I need a fishing partner to ask.']}]}],
  gift:['You remembered what I like. Good. I’d like dinner with you next. I’m asking, not dropping hints.','I remembered you on my way home, too. I was hoping you’d have time for dinner with me.','* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 rumi:{
  visit:[
   {open:['* Rumi hums a melody while she stretches.','Help me rehearse? I need someone to sing at. Someone who won’t laugh. Zoey laughs.'],opts:[
    {t:'I won’t laugh.',r:['* She sings softly, stepping closer until the last note is nearly a whisper.','So? How was that? Be honest. No, be nice.']},
    {t:'Sing to me, then.',r:['Careful. Idols are professionally good at making people fall for them.']}]},
   {open:['Dance practice. Now. Step with me. One, two, closer. No, closer.'],opts:[
    {t:'Follow her lead.',r:['* She spins out and back into your arms, breathless.','Good. Very good. We should drill that move. A lot.']},
    {t:'I have two left feet.',r:['Then stand there and look handsome. I’ll dance around you. I’ve worked with worse.']}]},
   {open:['* She sits on the edge of the stage, sleeves pulled down over her wrists.','Some days I hide parts of me. From the fans. From the girls, even. Not from you, though. Weird.'],opts:[
    {t:'Show me.',r:['* She slowly pushes up one sleeve. Faint glowing patterns. You don’t look away.','You didn’t flinch. Nobody… okay. You didn’t flinch.']},
    {t:'You’re safe with me.',r:['I know. That’s the scary part. I kind of like it.']}]},
   {open:['You practiced every single day this week? That’s trainee-level dedication. Celine would actually be impressed.'],opts:[
    {t:'You inspire me.',r:['Stop, I’ll get a big head. Okay. Keep going a little.']},
    {t:'Want to practice together?',r:['Duets are my favorite. Especially with cute partners. Especially you.']}]},
   {open:['* After the show, backstage, she pulls you into a quiet corner, still in her stage jacket.','That last song. I sang it for you. Did you notice?'],opts:[
    {t:'I noticed.',r:['* She kisses you, still breathless from the stage.','Good. There’s an encore. Private one.']},
    {t:'Sing it again.',r:['Here? Right now? Just you?','* She hums it against your ear, and it’s better than the whole show.']}]}],
  gift:['This one’s personal. I can tell. Come sit beside me. I’d like to give you my full attention.','For me? That’s so sweet. I’m writing a song about it. Don’t tell Zoey, she’ll want co-writing credit.','Thank you! It’s going in my dressing room, right by the mirror, where I see it every show.']},

 jester:{
  visit:[
   {open:['* Jester bounces over with a basket of pastries.','I baked! Taste test! Also, one of these is a prank. Guess which! You won’t!'],opts:[
    {t:'Eat one.',r:['* It’s full of hot pepper. She cackles.','The Traveler says hi! Here, have a real one. And a kiss to make it better. Mwah!']},
    {t:'You eat one first.',r:['Ooh, suspicious! I like that. Smart AND cute! Caleb never suspects me.']}]},
   {open:['Let me paint you! I promise it’ll be super tasteful. Mostly. Like seventy percent.'],opts:[
    {t:'Pose dramatically.',r:['* She giggles and paints furiously, tongue sticking out.','Oh, this is going to be a masterpiece. A slightly scandalous masterpiece. Beau is going to die.']},
    {t:'What do you mean, mostly?',r:['Artistic license! It’s a real thing! My mama has one! Hold still, handsome.']}]},
   {open:['* She tugs you by the hand to a hidden corner of the garden.','Shhh! It’s a secret spot. Nobody can find us here. Not even Nott.'],opts:[
    {t:'What are we doing here?',r:['* She kisses your nose, then your cheek.','Being sneaky! And cute! Mostly cute! Okay, also sneaky!']},
    {t:'Pull her close.',r:['* She squeaks and grins.','Oh! Okay! I like where this is going! Keep going there!']}]},
   {open:['You read a whole book this week? That’s so cool! I made you a bookmark!','* It’s a little doodle of you, surrounded by hearts. And one tiny, suspicious mustache.'],opts:[
    {t:'I love it.',r:['Yay! I drew a lot of hearts. Maybe too many. No, there’s no such thing!']},
    {t:'Why all the hearts?',r:['* She turns a very deep blue.','Artistic reasons! Shhh! Don’t look at me!']}]},
   {open:['* By the fire, Jester curls her tail around your ankle.','You make everything more fun. Like, really, really fun. Even boring stuff! Even chores!'],opts:[
    {t:'You too.',r:['* She kisses you quick and giggles.','Ooh, that was the most fun one! Again?']},
    {t:'Stay close.',r:['Oh, I’m not going anywhere. You’re stuck with me now! Forever! That’s a threat. A nice one.']}]}],
  gift:['Oh, I love it. Come here. I want to kiss you, and I’m trying not to hide it behind a pastry.','A present? For me? I’m sketching it right now! Hold it up! Higher!','You’re so sweet! The Traveler is going to be sooo jealous! Don’t tell him I said that.']},

 mira:{
  visit:[
   {open:['* Mira leans against the studio mirror, arms folded.','Rehearsal. You’re my test audience. Don’t blink. Don’t clap in the wrong place.'],opts:[
    {t:'Watch carefully.',r:['* She dances, every move razor precise, ending inches from your face.','Well? You can breathe now.']},
    {t:'Dance with me.',r:['Oh? Think you can keep up? Cute. Let’s see.']}]},
   {open:['I made a new routine. It’s about wanting someone you really shouldn’t.'],opts:[
    {t:'Who inspired it?',r:['* She just smirks and walks away. Slowly. On purpose.']},
    {t:'Show me.',r:['* It’s all heat and restraint. She finishes with her palm flat on your chest.','Based on real events. Don’t ask which ones.']}]},
   {open:['* She’s on the rooftop with one bottle of soda and two straws.','Sit. Don’t talk. Just exist next to me. Rumi and Zoey never shut up.'],opts:[
    {t:'Sit beside her.',r:['* After a while, she leans her head on you.','Okay. This is nice. Don’t ruin it by saying so.']},
    {t:'Talk anyway.',r:['Ugh. Fine. You have a nice voice. Annoyingly. Keep going.']}]},
   {open:['You actually stuck with your hobby every day? I’m impressed. Slightly. Very, very slightly.'],opts:[
    {t:'Only slightly?',r:['Okay, a lot. Don’t make me say it twice.']},
    {t:'Impressed enough for a kiss?',r:['* She rolls her eyes, then kisses you anyway.','You’re lucky you’re cute. Really lucky.']}]},
   {open:['* After practice, sweaty and grinning, she drags you out the back door.','Come on. I need air. And you. Mostly you.'],opts:[
    {t:'Follow her.',r:['* In the alley, she backs you into the wall with a kiss.','Better.']},
    {t:'Just air and me?',r:['Mostly you. Air’s overrated. My parents can keep their fancy air.']}]}],
  gift:['You remembered. Put it down for a second. I want to kiss you before I get distracted by talking.','Hm. Thoughtful. That’s points. Big points.','You remembered. Nobody remembers. That’s… kind of hot. Thanks.']},

 zoey:{
  visit:[
   {open:['* Zoey waves her notebook over her head.','I wrote a verse about you! It’s kinda corny. Okay, it’s very corny. Wanna hear it?'],opts:[
    {t:'Rap it for me.',r:['* She raps, fast and bouncy, and finishes with a wink.','Rhymed “handsome” with “ransom.” Genius, right? Mira said no. Mira’s wrong.']},
    {t:'Corny’s fine.',r:['Corny is my whole brand! Okay. Ahem. Here goes.']}]},
   {open:['Let’s write a song together! You do the beat, I do the words! It’s gonna be a banger!'],opts:[
    {t:'Tap a beat.',r:['* She bounces along, scribbling.','Oh, this is good! You’re a natural! Kiss for the producer! That’s industry standard!']},
    {t:'I can’t write.',r:['Everyone can write! One word. Then another one! Like me, then you. See? Song.']}]},
   {open:['* She sits on the steps, notebook open, chewing her pen to bits.','Writer’s block. Total brick wall. Distract me?'],opts:[
    {t:'Kiss her.',r:['* She squeaks, then grins.','Okay, that worked. I have like five verses now. Six. Seven.']},
    {t:'Tell her a joke.',r:['* She cracks up.','Okay, that’s going in a song. You’re getting credited. Small font.']}]},
   {open:['You wrote something every day this week? Look at you! Fellow writer! Notebook buddies!'],opts:[
    {t:'Inspired by you.',r:['Stop, I’m blushing. Okay, don’t stop.']},
    {t:'Some days were just words.',r:['Words count! Every single one. Half my notebook is just “ugh.” Still counts.']}]},
   {open:['* Late night, she’s humming a new melody, notebook pressed to her chest.','This one’s private. It’s about you. Promise you won’t laugh?'],opts:[
    {t:'Promise.',r:['* She sings it softly, then kisses your cheek.','Okay, that was really embarrassing. And really honest. Mostly honest.']},
    {t:'Laugh a little.',r:['Hey! Rude! Okay, I’m laughing too. Come here, you.']}]}],
  gift:['You remembered. I love that. I’d like to kiss you before I turn this into three verses.','For me? You’re the sweetest! Hug! Big hug! Bigger!','It’s going right on my notebook cover so I see it every single day!']},
};
