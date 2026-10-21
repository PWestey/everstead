// Quests for Faith (Obi-Wan, Matt, T’Challa) and Marriage (Tavi, Steve). Format: see lib/dialogue.mjs (iron-body trees).

/** @type {Record<string,any>} */
export const QUESTS={
 'the-quiet-hour':{name:'The Quiet Hour',area:'faith',giver:'obiwan',tier:1,blurb:'Obi-Wan has counted how many times you’ve hurried past the Chapel today. He’d like a word, if you can spare one.',say:['Talk to Obi-Wan at the Chapel.','Report back to Obi-Wan.','Meet Obi-Wan at the river stones below the Chapel at dusk.']},
 'a-candle-in-the-dark':{name:'A Candle in the Dark',area:'faith',giver:'matt',tier:2,blurb:'Matt Murdock heard you walk out of the Chapel halfway through. He’s blind, not deaf, and he has questions.',say:['Talk to Matt at the Chapel.','Report back to Matt.','Meet Matt in the dark Chapel after midnight.']},
 'the-ancestral-plane':{name:'The Ancestral Plane',area:'faith',giver:'tchalla',tier:3,blurb:'T’Challa wants to know who taught you to pray, and whether you ever told them thank you.',say:['Talk to T’Challa at the Chapel.','Report back to T’Challa.','Meet T’Challa in the field of purple flowers beyond the village.']},
 'the-argument-you-lose':{name:'The Argument You Lose',area:'marriage',giver:'tavi',tier:1,blurb:'Tavi watched you win an argument with your wife outside the café. He thinks it was a tactical disaster.',say:['Talk to Tavi at the Rose Café.','Report back to Tavi.','Meet Tavi on the café terrace at closing time.']},
 'the-promised-dance':{name:'The Promised Dance',area:'marriage',giver:'steve',tier:2,blurb:'Steve Rogers was seventy years late for a dance once. He’d rather you weren’t.',say:['Talk to Steve at the Rose Café.','Report back to Steve.','Meet Steve by the fountain in the village square at dusk.']},
};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- The Quiet Hour (Obi-Wan, Faith, tier 1: 3 habits, 3 days) ----------------
 'the-quiet-hour-1':{who:'obiwan',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Obi-Wan sits on the Chapel steps, hands tucked into the sleeves of a robe that still has Tatooine sand in the hem. He looks entirely unbothered by the wait.',next:'b'},
  b:{s:'obiwan',t:'Ah, there you are. Fourth time past this door today. I was beginning to think you were patrolling it.',next:'c'},
  c:{s:'obiwan',t:'Forgive an old man’s curiosity. Where exactly are you rushing off to?',opts:[
   {t:'Everything. There’s never enough time.',next:'time'},
   {t:'I’m not sure, honestly.',next:'unsure'},
   {t:'I’m not running. I’m busy.',next:'busy'}]},
  time:{s:'obiwan',t:'Mm. I had a student who said that. Constantly. He was usually rushing toward something he’d later regret.',next:'d'},
  unsure:{s:'obiwan',t:'Well, that’s refreshingly honest. Most of my students would have invented something heroic.',next:'d'},
  busy:{s:'obiwan',t:'Of course. I was terribly busy once. Then I spent twenty years on a moisture farm with nothing but time and sand.',next:'d'},
  d:{s:'obiwan',t:'Qui-Gon used to make me sit by a pond until I stopped fidgeting. It took most of a season. I was not a natural.',next:'offer'},
  offer:{s:'obiwan',t:'So, a small proposal. Three quiet moments. A prayer, a page of scripture, a minute of thanks before bed. Then come find me.',opts:[
   {t:'Three. I can do that. (Start “The Quiet Hour”)',next:'yes',do:[{quest:['the-quiet-hour','start']}]},
   {t:'Maybe another day.',next:'no'}]},
  yes:{s:'obiwan',t:'Splendid. Oh, and do try not to sprint through them. That would rather miss the point.',end:true},
  no:{s:'obiwan',t:'Quite all right. I’ve had a great deal of practice at waiting. These steps are comfortable enough.',end:true}}},

 'the-quiet-hour-2':{who:'obiwan',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Obi-Wan stands by the fountain, watching the water the way other men watch a holo-drama.',next:'b'},
  b:{s:'obiwan',t:'Three. I could tell before you opened your mouth. You walked over here instead of marching.',next:'c'},
  c:{s:'obiwan',t:'So tell me. When it finally went quiet, what did you hear?',opts:[
   {t:'Mostly my own worries, shouting.',next:'worry'},
   {t:'Something like peace. Just for a second.',next:'peace',do:[{flag:'obiwan-peace'}]},
   {t:'Nothing at all.',next:'nothing'}]},
  worry:{s:'obiwan',t:'Ha. Yes. Mine still do that. They shout loudest right before they give up. Sit through them a bit longer next time.',next:'d'},
  peace:{s:'obiwan',t:'Only a second? That’s a second more than I managed my first year. Now you know it’s there.',next:'d'},
  nothing:{s:'obiwan',t:'Nothing. Hm. Don’t be so quick to dismiss that. Some days nothing is exactly what you needed to hear.',next:'d'},
  d:{s:'obiwan',t:'Now, the trickier part. Three moments in one afternoon is easy. I’d like one on each of three different days.',next:'e'},
  e:{s:'obiwan',t:'It’s the coming back that does the work. Anyone can be calm once. Ask any Sith.',opts:[
   {t:'Three days. I’ll keep it lit.',next:'f',do:[{quest:['the-quiet-hour','advance']}]}]},
  f:{s:'obiwan',t:'Good. Now sit with me a moment. No, you don’t need to say anything. That’s rather the idea.',next:'g'},
  g:{s:'narrator',t:'You sit by the fountain in silence. A bell rings somewhere across the village. For once, you don’t reach for your phone to check the time.',end:true,do:[{xp:['faith',300]}]}}},

 'the-quiet-hour-3':{who:'obiwan',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At dusk Obi-Wan waits by the river below the Chapel, rolling a small, smooth grey stone between his fingers.',next:'b'},
  b:{s:'obiwan',t:'Three days. Even the loud one, when the kids were up past bedtime. You still came back to it. I’m genuinely impressed.',next:'c'},
  c:{s:'obiwan',t:'I picked this up in the Jundland Wastes. On the bad nights out there, I held it until I remembered why I’d stayed.',opts:[
   {t:'That’s too precious to give away.',next:'refuse'},
   {t:'What do I do with it?',next:'what'}]},
  refuse:{s:'obiwan',t:'Precious? It’s a rock, my friend. And clinging to things was always Anakin’s trouble. I’d rather not take it up now.',next:'take'},
  what:{s:'obiwan',t:'Pocket it. When your hand finds it, stop and thank God for one thing. Just one. Don’t make a production of it.',next:'take'},
  take:{s:'narrator',t:'He sets the stone in your palm. It’s warm from his hand, and worn smooth by years of the same small prayer.',next:'try'},
  try:{s:'narrator',t:'Your fingers close around it. You think of one thing you’re grateful for, and the river seems to slow down to listen.',next:'d'},
  d:{s:'obiwan',t:'A little stillness every day, {name}. And do stop patrolling my door.',end:true,do:[{quest:['the-quiet-hour','complete']}]}}},

 // ---------------- A Candle in the Dark (Matt, Faith, tier 2: 5 habits, 4 days) ----------------
 'a-candle-in-the-dark-1':{who:'matt',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Matt Murdock sits in the back pew, red glasses on, head already tilted toward you before you’ve made a sound.',next:'b'},
  b:{s:'matt',t:'You bailed halfway through last time. Heart going like you’d just been cross-examined.',next:'c'},
  c:{s:'player',t:'You could hear that?',next:'d'},
  d:{s:'matt',t:'I can hear the guy three blocks over burning his toast. So. What were you running from?',opts:[
   {t:'Felt like a hypocrite sitting here.',next:'hypocrite'},
   {t:'I didn’t feel anything, so I left.',next:'empty'},
   {t:'None of your business, counselor.',next:'business'}]},
  hypocrite:{s:'matt',t:'Join the club. I put on a mask and beat people up most nights, then sit right here Sunday. Father Lantom just sighs at me.',next:'offer'},
  empty:{s:'matt',t:'Yeah. Some weeks all I feel in here is my ribs. I come anyway. Catholic guilt’s good for something.',next:'offer'},
  business:{s:'matt',t:'Objection noted. Overruled. You’re still standing here, so part of you wants me to keep talking.',next:'offer'},
  offer:{s:'matt',t:'Here’s my offer. Five times. Pray, read, say thanks, whatever’s real. Including the nights you feel like a fraud.',opts:[
   {t:'Five. Even the empty ones. (Start “A Candle in the Dark”)',next:'yes',do:[{quest:['a-candle-in-the-dark','start']}]},
   {t:'I’m not ready for this yet.',next:'no'}]},
  yes:{s:'matt',t:'Good. And don’t fudge the numbers. I can hear you lie. Foggy hates it.',end:true},
  no:{s:'matt',t:'Nobody ever is. Door doesn’t lock, by the way. Trust me, I’ve checked. At two in the morning.',end:true}}},

 'a-candle-in-the-dark-2':{who:'matt',bg:'ui-scenes/Bg_City_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'You find Matt on a rooftop at night, legs over the ledge, a split lip and a completely calm face.',next:'b'},
  b:{s:'matt',t:'Five. You sound different. Steadier. Don’t pretend you didn’t notice.',next:'c'},
  c:{s:'matt',t:'You okay? You came up those stairs like you’re carrying something.',opts:[
   {t:'You first. What happened to your lip?',next:'lip'},
   {t:'Rough week, actually.',next:'week'}]},
  lip:{s:'matt',t:'Three guys, one alley, a difference of opinion. I won. Mostly. I’ll confess the parts I enjoyed.',next:'d'},
  week:{s:'matt',t:'I know. I could hear it on you. And you still showed up five times. Don’t shrug that off.',next:'d',do:[{flag:'matt-honest'}]},
  d:{s:'matt',t:'My dad was a boxer. Took a beating most nights. The part I remember is him getting up for breakfast after.',next:'e'},
  e:{s:'matt',t:'So next round’s about mornings. Four different days. Not four in one panicked Sunday. Four days.',next:'f'},
  f:{s:'matt',t:'Anybody can pray when they feel it. I want to see you do it when you don’t.',opts:[
   {t:'Four days. I’ll get up.',next:'g',do:[{quest:['a-candle-in-the-dark','advance']}]}]},
  g:{s:'matt',t:'Great. Now help me off this ledge. My ribs are filing a motion.',next:'h'},
  h:{s:'narrator',t:'You help him to the stairwell. He leans on you harder than he’d ever admit and says thanks like it’s nothing.',end:true,do:[{xp:['faith',500]}]}}},

 'a-candle-in-the-dark-3':{who:'matt',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'After midnight the Chapel is dark except for one rack of candles. Matt kneels in front of it, a wooden rosary wound around his fingers.',next:'b'},
  b:{s:'matt',t:'Four days. Including Tuesday, which I know was bad. I heard you sit down out front and not leave.',next:'c'},
  c:{s:'matt',t:'Funny thing about candles. Haven’t seen one since I was nine. But I feel the heat on my face. I know it’s lit.',next:'d'},
  d:{s:'matt',t:'That’s about as close as I can get to explaining faith. You can’t see it. You feel the warmth, and you trust it.',opts:[
   {t:'Light one with me.',next:'light'},
   {t:'Who do you light them for?',next:'who'}]},
  who:{s:'matt',t:'My dad, usually. Some nights the people I didn’t get to in time. Some nights me. Tonight, you.',next:'light'},
  light:{s:'narrator',t:'You light a candle together. Matt holds his palm over the flame for a moment, smiling at a warmth only he seems to notice.',next:'e'},
  e:{s:'matt',t:'This was my dad’s rosary. I’ve worn half the beads smooth. I want you to hang onto it for a while.',next:'f'},
  f:{s:'player',t:'Matt, I can’t take your father’s rosary.',next:'g'},
  g:{s:'matt',t:'You’re not taking it. It’s a loan. Which means you have to keep coming back in here to return it. Lawyer trick.',next:'h'},
  h:{s:'matt',t:'Keep getting up, {name}. Especially on the nights you don’t want to.',end:true,do:[{quest:['a-candle-in-the-dark','complete']}]}}},

 // ---------------- The Ancestral Plane (T’Challa, Faith, tier 3: 8 habits, 5 days) ----------------
 'the-ancestral-plane-1':{who:'tchalla',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'T’Challa stands before the Chapel altar, perfectly still, the way a king stands when he is the one doing the listening.',next:'b'},
  b:{s:'tchalla',t:'I have been watching. Obi-Wan’s stone in your pocket. Murdock’s rosary on your wrist. You are collecting teachers.',next:'c'},
  c:{s:'tchalla',t:'So let me ask what no one else has. Who taught you to pray?',opts:[
   {t:'My parents. Or my grandparents.',next:'family'},
   {t:'Nobody. I’m figuring it out alone.',next:'alone'},
   {t:'I’d rather not talk about that.',next:'rather'}]},
  family:{s:'tchalla',t:'Then they are with you every time you bow your head. Tell me, have you ever thanked them for it?',next:'d'},
  alone:{s:'tchalla',t:'I doubt that. Someone prayed over your crib. You simply never learned their name.',next:'d'},
  rather:{s:'tchalla',t:'I understand. I did not like hearing the truth about my father either. We will go slowly.',next:'d'},
  d:{s:'tchalla',t:'In Wakanda, faith is not something you invent. It is handed down, like the throne. My sister would say like a bad joke.',next:'e'},
  e:{s:'tchalla',t:'Your children are watching how you pray. Not what you tell them about it. How you actually do it.',next:'offer'},
  offer:{s:'tchalla',t:'Eight acts of faith. Pray, read, give thanks. And once, say aloud the name of someone who believed before you did.',opts:[
   {t:'Eight. I will honor them. (Start “The Ancestral Plane”)',next:'yes',do:[{quest:['the-ancestral-plane','start']}]},
   {t:'Give me some time to think on it.',next:'no'}]},
  yes:{s:'tchalla',t:'Good. Go on, then. And stand up straighter. You have more people behind you than you think.',end:true},
  no:{s:'tchalla',t:'Take your time. Zuri made me wait a whole year before he told me certain things. I was furious. He was right.',end:true}}},

 'the-ancestral-plane-2':{who:'tchalla',bg:'facility-scenes/northern.webp',start:'a',nodes:{
  a:{s:'narrator',t:'T’Challa meets you on the north road, where the mountains turn violet in the last of the light.',next:'b'},
  b:{s:'tchalla',t:'Eight. And you did not just count them. I watched you mean them.',next:'c'},
  c:{s:'tchalla',t:'Whose name did you say?',opts:[
   {t:'A grandparent I lost too soon.',next:'grand',do:[{flag:'tchalla-named'}]},
   {t:'My father.',next:'father',do:[{flag:'tchalla-named'}]},
   {t:'I couldn’t. It hurt too much.',next:'couldnt'}]},
  grand:{s:'tchalla',t:'Then they heard you. Where I come from, the dead are not gone. Most of them are only waiting for someone to ask.',next:'d'},
  father:{s:'tchalla',t:'Fathers. For a year after Vienna I could not say mine without anger in my throat. It does get lighter.',next:'d'},
  couldnt:{s:'tchalla',t:'That is all right. If it still hurts, the love is still there. We will try again another night.',next:'d'},
  d:{s:'tchalla',t:'Now I ask you what I ask of myself. Five different days. Not one burst of fervor. A rhythm.',next:'e'},
  e:{s:'tchalla',t:'Shuri teases me that I pray like I am filing a report. Every morning, same time. She is right. It works.',opts:[
   {t:'Five days. A rhythm, not a rush.',next:'f',do:[{quest:['the-ancestral-plane','advance']}]}]},
  f:{s:'tchalla',t:'Walk with me to the ridge. I want you to see the village from up there.',next:'g'},
  g:{s:'narrator',t:'From the ridge, Everstead is a scatter of warm windows. T’Challa is quiet a long time. Then: “Every one of those is somebody’s answered prayer.”',end:true,do:[{xp:['faith',800]}]}}},

 'the-ancestral-plane-3':{who:'tchalla',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Beyond the village, a field of purple flowers glows in the dusk. T’Challa kneels in the middle of it, waiting.',next:'b'},
  b:{s:'tchalla',t:'Five days. Something in you settled. The way the drummers lock in once the dancer finds the beat.',next:'c'},
  c:{s:'tchalla',t:'After my father died, I went somewhere like this to ask him how to be king. He did not make it easy. Kneel with me.',next:'d'},
  d:{s:'narrator',t:'You kneel. The wind moves through the flowers and, for a moment, it sounds like many voices speaking very softly at once.',next:'e'},
  e:{s:'tchalla',t:'If the people who prayed before you could see you now, what would you want them to know?',opts:[
   {t:'That I kept it. That it didn’t end with me.',next:'kept'},
   {t:'That I’m sorry it took me so long.',next:'sorry'}]},
  kept:{s:'tchalla',t:'Good. That is what a man owes his ancestors. And it is exactly what he hands his children.',next:'gift'},
  sorry:{s:'tchalla',t:'They are not keeping score. My father told me so, in a place very much like this one. They are only glad you came home.',next:'gift'},
  gift:{s:'narrator',t:'T’Challa slips a single dark bead from his wrist, carved with a small panther’s head, and threads it onto Matt’s rosary beside Obi-Wan’s stone.',next:'f'},
  f:{s:'tchalla',t:'Shuri carved that from a vibranium offcut. Do not tell her I gave it away. Now you carry three teachers on one string.',next:'g'},
  g:{s:'tchalla',t:'Each morning, touch the bead and say one name. Then thank God for them. That is the whole of it.',next:'h'},
  h:{s:'tchalla',t:'You are part of the line now, {name}. Hold on. Somebody small is holding on to you.',end:true,do:[{quest:['the-ancestral-plane','complete']}]}}},

 // ---------------- The Argument You Lose (Tavi, Marriage, tier 1: 3 habits, 3 days) ----------------
 'the-argument-you-lose-1':{who:'tavi',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Tavi has a corner table at the Rose Café, boots up on a chair, eating somebody else’s pastry with a perfectly innocent face.',next:'b'},
  b:{s:'tavi',t:'Sit, sit. I saw you and your wife outside yesterday. You won that argument. Congratulations. Awful strategy.',next:'c'},
  c:{s:'tavi',t:'So what did you capture, exactly?',opts:[
   {t:'Being right, I suppose.',next:'right'},
   {t:'A very quiet dinner.',next:'quiet'},
   {t:'Hey, she started it.',next:'started'}]},
  right:{s:'tavi',t:'Right. I out-argued a Senate once. Kitai still made me sleep with the horses. Being right is a very small hill.',next:'d'},
  quiet:{s:'tavi',t:'Oh, the quiet dinner. I’ve faced the Vord with better odds. Did she do the thing where she says “fine”?',next:'d'},
  started:{s:'tavi',t:'Bold. Stupid, but bold. Max used to say that too. Max has slept in a lot of barns.',next:'d'},
  d:{s:'tavi',t:'Here’s what took me far too long. She’s not the other army. It’s you and her against everything else.',next:'offer'},
  offer:{s:'tavi',t:'So, a campaign. Three things for her. Real time, a kind word, the phone face down while she talks. Then report.',opts:[
   {t:'Three. For her. (Start “The Argument You Lose”)',next:'yes',do:[{quest:['the-argument-you-lose','start']}]},
   {t:'Let me cool off first.',next:'no'}]},
  yes:{s:'tavi',t:'Good man. And if she asks why you’re being so nice, do not say Tavi told you to. She’ll smell a plan.',end:true},
  no:{s:'tavi',t:'Cool off, fine. Just don’t sit on it overnight. Stubborn sets like mortar. Ask my uncle Bernard.',end:true}}},

 'the-argument-you-lose-2':{who:'tavi',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Tavi is sitting on a fence at the edge of the village, sporting a fresh bruise and an enormous grin.',next:'b'},
  b:{s:'tavi',t:'Kitai and I sparred. I let her win. She knew I let her win. Hence the bruise. Anyway. Three? Report.',next:'c'},
  c:{s:'tavi',t:'How’d she take it?',opts:[
   {t:'She smiled at me like she used to.',next:'smile',do:[{flag:'tavi-smile'}]},
   {t:'She asked what I wanted.',next:'suspicious'},
   {t:'Honestly, I’m not sure she noticed.',next:'notice'}]},
  smile:{s:'tavi',t:'Ha! There it is. I’ve held a crown, and I’d trade it for that smile without blinking. Don’t tell the Senate.',next:'d'},
  suspicious:{s:'tavi',t:'Ouch. That means it’s been a while. Don’t sulk about it. Keep going. Suspicion runs out of fuel.',next:'d'},
  notice:{s:'tavi',t:'Oh, she noticed. They always notice. She’s waiting to see if it lasts past Thursday.',next:'d'},
  d:{s:'tavi',t:'Anyone can be charming for an afternoon. I want you to pick her on three different days. No big gesture.',next:'e'},
  e:{s:'tavi',t:'Grand gestures are for the bards. Marriages get built on ordinary Tuesdays.',opts:[
   {t:'Three days. Built in Tuesdays.',next:'f',do:[{quest:['the-argument-you-lose','advance']}]}]},
  f:{s:'kitai',t:'Aleran. Stop teaching him your bad habits. One of you is enough.',next:'g'},
  g:{s:'narrator',t:'Kitai drops from the tree overhead, flicks Tavi on the ear, and walks off. He watches her go like a man still completely lost.',end:true,do:[{xp:['marriage',300]}]}}},

 'the-argument-you-lose-3':{who:'tavi',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'At closing time the café terrace is empty except for Tavi, two cups of tea, and a small square of folded paper.',next:'b'},
  b:{s:'tavi',t:'Three days. You picked her even when you were wiped out. That’s the whole trick. Please don’t spread it around.',next:'c'},
  c:{s:'tavi',t:'Did you two fight again?',opts:[
   {t:'We did. I let her be right.',next:'lost'},
   {t:'We did. I said sorry first.',next:'sorry'}]},
  lost:{s:'tavi',t:'Ha! You lost on purpose. Hardest maneuver there is. My grandfather would’ve given you a legion.',next:'d'},
  sorry:{s:'tavi',t:'First one to say sorry wins. Every time. Took me ten years and one very cold stable to figure that out.',next:'d'},
  d:{s:'tavi',t:'This is the first note I ever wrote Kitai. Dreadful poem. She keeps it in her boot. She thinks I don’t know.',next:'e'},
  e:{s:'tavi',t:'You’re not getting this one. She’d gut me. You’re getting the idea. Write your wife a note. Short. True. No angle.',next:'f'},
  f:{s:'narrator',t:'He slides a blank sheet and a pencil across the table, then sips his tea and pretends not to watch you think.',next:'g'},
  g:{s:'tavi',t:'Lose more arguments, {name}. That’s an order from the First Lord. I rarely give those.',end:true,do:[{quest:['the-argument-you-lose','complete']}]}}},

 // ---------------- The Promised Dance (Steve, Marriage, tier 2: 5 habits, 4 days) ----------------
 'the-promised-dance-1':{who:'steve',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Steve sits alone by the café window while an old big-band record plays low behind the counter. His coffee’s gone cold.',next:'b'},
  b:{s:'steve',t:'Hey. Pull up a chair. Mind if I ask you something personal? When’s the last time you took your wife dancing?',next:'c'},
  c:{s:'steve',t:'Or anything like it. Just the two of you. No kids, no rushing home after.',opts:[
   {t:'I honestly can’t remember.',next:'cant'},
   {t:'We keep meaning to. Life gets busy.',next:'busy'},
   {t:'I don’t really dance.',next:'dance'}]},
  cant:{s:'steve',t:'Well, at least you’re honest about it. I can tell you to the day how long I kept somebody waiting.',next:'d'},
  busy:{s:'steve',t:'Sure. For me it was a war. Then another one. There’s always something. That’s exactly the trap.',next:'d'},
  dance:{s:'steve',t:'Me neither. Two left feet, back in Brooklyn. I asked a girl anyway. Then I didn’t make it. Saturday, eight o’clock.',next:'d'},
  d:{s:'steve',t:'I was late for that dance by about seventy years. You’re not. She’s right there, down the lane.',next:'offer'},
  offer:{s:'steve',t:'So here’s what I’m asking. Five things for her. A date, an evening without your phone, whatever she’d call love. Then tell me how it went.',opts:[
   {t:'Five. No more “someday.” (Start “The Promised Dance”)',next:'yes',do:[{quest:['the-promised-dance','start']}]},
   {t:'Not this week, Cap.',next:'no'}]},
  yes:{s:'steve',t:'Atta boy. And hey. Be on time. Trust me on that one.',end:true},
  no:{s:'steve',t:'Okay. Just don’t let “not this week” turn into seventy years. I know a guy.',end:true}}},

 'the-promised-dance-2':{who:'steve',bg:'facility-scenes/raphael.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Steve is in the Training Yard, steadying a heavy bag for nobody in particular. He lets it go when he spots you.',next:'b'},
  b:{s:'steve',t:'Five! Somebody told me she laughed so loud at the café the whole room turned around. Nice work.',next:'c'},
  c:{s:'steve',t:'So how’s it feel?',opts:[
   {t:'Like I’ve been away a long time.',next:'away',do:[{flag:'steve-homecoming'}]},
   {t:'Good. A little scary, actually.',next:'scary'}]},
  away:{s:'steve',t:'Yeah. I know that one better than most. Good news is, she waited. Now make it worth the wait.',next:'d'},
  scary:{s:'steve',t:'It ought to be. If it scares you a little, that means you’ve got something worth losing.',next:'d'},
  d:{s:'steve',t:'Here’s the tough part. This isn’t a mission you finish and go home from. It’s a post. You hold it.',next:'e'},
  e:{s:'steve',t:'Four different days. Show up for her on every one. No heroics. Just steady.',opts:[
   {t:'Four days. I’ll hold the post.',next:'f',do:[{quest:['the-promised-dance','advance']}]}]},
  f:{s:'steve',t:'And one more thing. Learn a dance. Doesn’t have to be good. Bucky was the dancer. I just stood near the punch.',next:'g'},
  g:{s:'narrator',t:'Steve walks you through a box step right there in the dirt. He’s stiff, you’re worse, and by the end you’re both laughing.',end:true,do:[{xp:['marriage',500]}]}}},

 'the-promised-dance-3':{who:'steve',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'At dusk the square is strung with paper lanterns. Steve sits on the fountain’s edge with an old brass compass open in his hand.',next:'b'},
  b:{s:'steve',t:'Four days. You held the post. I’m proud of you, and I don’t throw that word around.',next:'c'},
  c:{s:'steve',t:'I kept her picture in here. Every mission. Didn’t need it for north. I needed it to remember where home was.',next:'d'},
  d:{s:'steve',t:'I’d like you to have it. Put your wife’s picture inside. When the world starts pulling, open it up.',opts:[
   {t:'Steve, this is your whole story.',next:'story'},
   {t:'I’ll put her picture in tonight.',next:'tonight'}]},
  story:{s:'steve',t:'It was. I did get that dance in the end, you know. So now it can go help somebody else get theirs.',next:'e'},
  tonight:{s:'steve',t:'Good. And look at it before you walk in the door, not after. Nobody told me that part.',next:'e'},
  e:{s:'narrator',t:'He presses the compass into your hand. The needle shivers, then settles, pointing toward the lane that leads to your house.',next:'f'},
  f:{s:'steve',t:'Oh, and that box step? Go home and use it. Kitchen floor counts. Music’s optional.',next:'g'},
  g:{s:'steve',t:'Don’t keep her waiting, {name}. Go get your dance.',end:true,do:[{quest:['the-promised-dance','complete']}]}}},
};
