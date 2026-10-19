// Quests for Faith (Obi-Wan, Matt, T’Challa) and Marriage (Tavi, Steve). Format: see lib/dialogue.mjs (iron-body trees).

/** @type {Record<string,any>} */
export const QUESTS={
 'the-quiet-hour':{name:'The Quiet Hour',area:'faith',giver:'obiwan',tier:1,blurb:'Obi-Wan has noticed you rushing past the Chapel, and he thinks you have forgotten how to be still.',say:['Talk to Obi-Wan at the Chapel.','Report back to Obi-Wan.','Meet Obi-Wan at the river stones below the Chapel at dusk.']},
 'a-candle-in-the-dark':{name:'A Candle in the Dark',area:'faith',giver:'matt',tier:2,blurb:'Matt Murdock heard you leave the Chapel early, and he wants to know what you were running from.',say:['Talk to Matt at the Chapel.','Report back to Matt.','Meet Matt in the dark Chapel after midnight.']},
 'the-ancestral-plane':{name:'The Ancestral Plane',area:'faith',giver:'tchalla',tier:3,blurb:'T’Challa asks who taught you to pray, and whether you have ever thanked them.',say:['Talk to T’Challa at the Chapel.','Report back to T’Challa.','Meet T’Challa in the field of purple flowers beyond the village.']},
 'the-argument-you-lose':{name:'The Argument You Lose',area:'marriage',giver:'tavi',tier:1,blurb:'Tavi caught you winning an argument with your wife and wants to teach you why that was a mistake.',say:['Talk to Tavi at the Rose Café.','Report back to Tavi.','Meet Tavi on the café terrace at closing time.']},
 'the-promised-dance':{name:'The Promised Dance',area:'marriage',giver:'steve',tier:2,blurb:'Steve Rogers knows what it costs to put off a dance, and he won’t let you make his mistake.',say:['Talk to Steve at the Rose Café.','Report back to Steve.','Meet Steve by the fountain in the village square at dusk.']},
};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- The Quiet Hour (Obi-Wan, Faith, tier 1: 3 habits, 3 days) ----------------
 'the-quiet-hour-1':{who:'obiwan',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Obi-Wan sits on the Chapel steps with his hands folded in his sleeves. He looks like he has been waiting all morning and doesn’t mind at all.',next:'b'},
  b:{s:'obiwan',t:'Hello there. You’ve walked past this door four times today. Always in a hurry.',next:'c'},
  c:{s:'obiwan',t:'May I ask what you’re running toward?',opts:[
   {t:'Everything. There’s never enough time.',next:'time'},
   {t:'I’m not sure, honestly.',next:'unsure'},
   {t:'I’m not running. I’m busy.',next:'busy'}]},
  time:{s:'obiwan',t:'There is exactly enough time. There is rarely enough stillness. The two are easy to confuse.',next:'d'},
  unsure:{s:'obiwan',t:'An honest answer. That’s a better start than most of my students ever managed.',next:'d'},
  busy:{s:'obiwan',t:'Ah. I said that once too. Then I spent twenty years in a desert learning what it meant.',next:'d'},
  d:{s:'obiwan',t:'Peace isn’t something you find once, like a lost boot. It’s something you practise. Small, and daily.',next:'offer'},
  offer:{s:'obiwan',t:'Give me three quiet moments. A prayer, a page of scripture, a minute of real thanks. Whatever is true for you. Then come back.',opts:[
   {t:'Three. I can do that. (Start “The Quiet Hour”)',next:'yes',do:[{quest:['the-quiet-hour','start']}]},
   {t:'Maybe another day.',next:'no'}]},
  yes:{s:'obiwan',t:'Good. And try not to rush them. That would rather defeat the purpose.',end:true},
  no:{s:'obiwan',t:'Of course. I’ve become quite good at waiting. The steps will still be here.',end:true}}},

 'the-quiet-hour-2':{who:'obiwan',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Obi-Wan is by the fountain, watching the water as if it might tell him something.',next:'b'},
  b:{s:'obiwan',t:'Three quiet moments. I could feel the difference in you before you said a word.',next:'c'},
  c:{s:'obiwan',t:'Tell me. What did you hear when it got quiet?',opts:[
   {t:'Mostly my own worries, shouting.',next:'worry'},
   {t:'Something like peace. Just for a second.',next:'peace',do:[{flag:'obiwan-peace'}]},
   {t:'Nothing at all.',next:'nothing'}]},
  worry:{s:'obiwan',t:'That’s normal. The noise is always loudest right before it settles. Stay a little longer next time.',next:'d'},
  peace:{s:'obiwan',t:'A second is enough to know it’s real. Now you know where to look for it.',next:'d'},
  nothing:{s:'obiwan',t:'Nothing is not the same as empty. Sometimes the quiet is the answer.',next:'d'},
  d:{s:'obiwan',t:'Now the harder part. Three moments in one afternoon is easy. I want one on each of three different days.',next:'e'},
  e:{s:'obiwan',t:'A light you only light once is a candle. A light you keep lit is a lamp.',opts:[
   {t:'Three days. I’ll keep it lit.',next:'f',do:[{quest:['the-quiet-hour','advance']}]}]},
  f:{s:'obiwan',t:'Sit with me a moment first. No, don’t talk. Just breathe.',next:'g'},
  g:{s:'narrator',t:'You sit by the fountain in silence. Somewhere a bell rings. For once, you don’t check what time it is.',end:true,do:[{xp:['faith',300]}]}}},

 'the-quiet-hour-3':{who:'obiwan',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At dusk Obi-Wan waits by the river below the Chapel, turning a small, smooth grey stone in his fingers.',next:'b'},
  b:{s:'obiwan',t:'Three days. You came back to the quiet even when the day was loud. That is all faith asks of us, really. Return.',next:'c'},
  c:{s:'obiwan',t:'I carried this stone through a very long exile. Whenever I forgot why I was there, I held it until I remembered.',opts:[
   {t:'That’s too precious to give away.',next:'refuse'},
   {t:'What do I do with it?',next:'what'}]},
  refuse:{s:'obiwan',t:'Precious things are meant to be passed on. Holding on too tightly was always my old friend’s trouble, not mine.',next:'take'},
  what:{s:'obiwan',t:'Keep it in your pocket. When your hand finds it, stop and give thanks for one thing. Only one. That’s the whole ritual.',next:'take'},
  take:{s:'narrator',t:'He places the stone in your palm. It is warm from his hand, and worn smooth by years of the same small prayer.',next:'try'},
  try:{s:'narrator',t:'Your fingers close around it. You think of one thing to be grateful for, and the river seems to slow down to listen.',next:'d'},
  d:{s:'obiwan',t:'Be still a little every day, {name}. The rest will follow. It always does.',end:true,do:[{quest:['the-quiet-hour','complete']}]}}},

 // ---------------- A Candle in the Dark (Matt, Faith, tier 2: 5 habits, 4 days) ----------------
 'a-candle-in-the-dark-1':{who:'matt',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Matt Murdock sits in the back pew, red glasses on, head tilted toward you before you’ve made a sound.',next:'b'},
  b:{s:'matt',t:'You left early last time. Halfway through. Your heart was going like you’d been caught at something.',next:'c'},
  c:{s:'player',t:'You could hear that?',next:'d'},
  d:{s:'matt',t:'I hear everything. Occupational hazard. So what were you running from?',opts:[
   {t:'Felt like a hypocrite sitting here.',next:'hypocrite'},
   {t:'I didn’t feel anything, so I left.',next:'empty'},
   {t:'None of your business, counselor.',next:'business'}]},
  hypocrite:{s:'matt',t:'Welcome to the club. Every person in these pews is one. That’s why we come. You don’t bring a clean shirt to the laundry.',next:'offer'},
  empty:{s:'matt',t:'Faith isn’t a feeling. Some weeks I feel nothing but bruises. I show up anyway. That’s the part that counts.',next:'offer'},
  business:{s:'matt',t:'Fair. Objection noted. But you’re still standing here, so I think part of you wants me to keep talking.',next:'offer'},
  offer:{s:'matt',t:'Here’s my case. Five times you show up for it. Prayer, scripture, gratitude, whatever’s real. Even on the nights you feel nothing.',opts:[
   {t:'Five. Even the empty ones. (Start “A Candle in the Dark”)',next:'yes',do:[{quest:['a-candle-in-the-dark','start']}]},
   {t:'I’m not ready for this yet.',next:'no'}]},
  yes:{s:'matt',t:'Good. And don’t lie to me about it. I’ll know.',end:true},
  no:{s:'matt',t:'Nobody ever is. The door doesn’t lock, by the way. Never has.',end:true}}},

 'a-candle-in-the-dark-2':{who:'matt',bg:'ui-scenes/Bg_City_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'You find Matt on a rooftop at night, sitting on the ledge with a split lip and a calm face.',next:'b'},
  b:{s:'matt',t:'Five. Your voice is steadier than it was. Don’t tell me you didn’t notice.',next:'c'},
  c:{s:'matt',t:'Rough night?',opts:[
   {t:'You first. What happened to your lip?',next:'lip'},
   {t:'Rough week, actually.',next:'week'}]},
  lip:{s:'matt',t:'Disagreement with three guys about whose neighborhood this is. I won. Mostly. I’ll confess the parts I enjoyed on Sunday.',next:'d'},
  week:{s:'matt',t:'I know. I could hear it on you. And you still showed up five times. That’s not nothing. That’s the whole thing.',next:'d',do:[{flag:'matt-honest'}]},
  d:{s:'matt',t:'My father got knocked down for a living. What made him a hero wasn’t the punch. It was getting up the next morning.',next:'e'},
  e:{s:'matt',t:'So the next round is about mornings. Show up on four different days. Not four times in one burst of guilt. Four days.',next:'f'},
  f:{s:'matt',t:'Faith that only works when you feel it is just weather. I want to see it when you don’t.',opts:[
   {t:'Four days. I’ll get up.',next:'g',do:[{quest:['a-candle-in-the-dark','advance']}]}]},
  g:{s:'matt',t:'Good. Now help me down off this ledge. My ribs are filing a complaint.',next:'h'},
  h:{s:'narrator',t:'You help him to the stairs. He leans on you harder than he’d ever admit, and thanks you like it costs him nothing.',end:true,do:[{xp:['faith',500]}]}}},

 'a-candle-in-the-dark-3':{who:'matt',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'After midnight the Chapel is dark except for one rack of candles. Matt kneels in front of it, a wooden rosary wound around his fingers.',next:'b'},
  b:{s:'matt',t:'Four days. Including Tuesday, which I know was bad. I heard you sit down out front and not leave.',next:'c'},
  c:{s:'matt',t:'You know why I light candles? I can’t see them. Never have. But I can feel the heat. I know they’re burning.',next:'d'},
  d:{s:'matt',t:'That’s faith, for me. You don’t see it. You feel the warmth, and you trust it’s there in the dark.',opts:[
   {t:'Light one with me.',next:'light'},
   {t:'Who do you light them for?',next:'who'}]},
  who:{s:'matt',t:'My dad. Some nights, the people I couldn’t save. Some nights, me. Tonight it’s for you.',next:'light'},
  light:{s:'narrator',t:'You light a candle together. Matt holds his hand over the flame a moment, smiling at the warmth only he seems to really notice.',next:'e'},
  e:{s:'matt',t:'This was my father’s rosary. I’ve worn the beads half smooth. I want you to carry it a while.',next:'f'},
  f:{s:'player',t:'Matt, I can’t take your father’s rosary.',next:'g'},
  g:{s:'matt',t:'You’re not taking it. You’re borrowing it. Which means you have to keep coming back here to return it. See what I did there?',next:'h'},
  h:{s:'matt',t:'Keep getting up, {name}. In the dark. Especially in the dark.',end:true,do:[{quest:['a-candle-in-the-dark','complete']}]}}},

 // ---------------- The Ancestral Plane (T’Challa, Faith, tier 3: 8 habits, 5 days) ----------------
 'the-ancestral-plane-1':{who:'tchalla',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'T’Challa stands before the Chapel altar, very still, the way a king stands when he is the one listening.',next:'b'},
  b:{s:'tchalla',t:'I have watched you these weeks. Obi-Wan’s stone in your pocket. Murdock’s rosary on your wrist. You are gathering.',next:'c'},
  c:{s:'tchalla',t:'Now tell me something no one has asked you. Who taught you to pray?',opts:[
   {t:'My parents. Or my grandparents.',next:'family'},
   {t:'Nobody. I’m figuring it out alone.',next:'alone'},
   {t:'I’d rather not talk about that.',next:'rather'}]},
  family:{s:'tchalla',t:'Then their hands are on yours every time you fold them. Have you ever thanked them for that?',next:'d'},
  alone:{s:'tchalla',t:'No one is alone in this. Someone prayed for you before you could speak. You simply have not met them yet.',next:'d'},
  rather:{s:'tchalla',t:'I understand. My father’s story was not easy for me to hear either. We can walk to it slowly.',next:'d'},
  d:{s:'tchalla',t:'In Wakanda, we do not believe faith begins with us. We are the newest link in a very long chain.',next:'e'},
  e:{s:'tchalla',t:'Your sons and daughters will learn faith by watching yours. So we make it worth watching.',next:'offer'},
  offer:{s:'tchalla',t:'Eight acts of faith. Pray, read, give thanks. And at least once, say aloud the name of someone who carried faith before you.',opts:[
   {t:'Eight. I will honor them. (Start “The Ancestral Plane”)',next:'yes',do:[{quest:['the-ancestral-plane','start']}]},
   {t:'Give me some time to think on it.',next:'no'}]},
  yes:{s:'tchalla',t:'Then go. And walk like someone who is being watched over. Because you are.',end:true},
  no:{s:'tchalla',t:'Take the time. A king who rushes his people’s traditions does not keep them long.',end:true}}},

 'the-ancestral-plane-2':{who:'tchalla',bg:'facility-scenes/northern.webp',start:'a',nodes:{
  a:{s:'narrator',t:'T’Challa meets you on the north road, where the mountains turn violet in the late light.',next:'b'},
  b:{s:'tchalla',t:'Eight. You did more than count them. I could see you meant each one.',next:'c'},
  c:{s:'tchalla',t:'Whose name did you speak?',opts:[
   {t:'A grandparent I lost too soon.',next:'grand',do:[{flag:'tchalla-named'}]},
   {t:'My father.',next:'father',do:[{flag:'tchalla-named'}]},
   {t:'I couldn’t. It hurt too much.',next:'couldnt'}]},
  grand:{s:'tchalla',t:'Then they heard you. In my tradition, the dead are not gone. They are waiting to be asked.',next:'d'},
  father:{s:'tchalla',t:'Fathers. I said mine aloud for a year before I could say it without anger. It gets lighter. It does.',next:'d'},
  couldnt:{s:'tchalla',t:'Grief is love with nowhere to go. That you could not say it means it is still alive. We will try again.',next:'d'},
  d:{s:'tchalla',t:'Now I ask for something a king asks of himself. Five different days. Not a season of fervor. A rhythm.',next:'e'},
  e:{s:'tchalla',t:'My ancestors did not build a nation in one great night of prayer. They built it in ordinary mornings.',opts:[
   {t:'Five days. A rhythm, not a rush.',next:'f',do:[{quest:['the-ancestral-plane','advance']}]}]},
  f:{s:'tchalla',t:'Walk with me to the ridge. I want you to see how far the village looks from here.',next:'g'},
  g:{s:'narrator',t:'From the ridge, Everstead is a scatter of warm windows. T’Challa says nothing for a long time. Then: “Each one is someone’s prayer, answered.”',end:true,do:[{xp:['faith',800]}]}}},

 'the-ancestral-plane-3':{who:'tchalla',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Beyond the village, a field of purple flowers glows in the dusk. T’Challa kneels in the middle of it, waiting.',next:'b'},
  b:{s:'tchalla',t:'Five days. A rhythm. I felt it change in you, the way the drums change when a dancer finds the beat.',next:'c'},
  c:{s:'tchalla',t:'When I lost my father, I went to a place like this to ask him how to be a king. Kneel with me.',next:'d'},
  d:{s:'narrator',t:'You kneel. The wind moves through the flowers and, for a moment, it sounds like many voices speaking very softly at once.',next:'e'},
  e:{s:'tchalla',t:'If the ones who carried faith before you could see you now, what would you want them to know?',opts:[
   {t:'That I kept it. That it didn’t end with me.',next:'kept'},
   {t:'That I’m sorry it took me so long.',next:'sorry'}]},
  kept:{s:'tchalla',t:'That is the best thing a man can tell his ancestors. And the best thing he can hand his children.',next:'gift'},
  sorry:{s:'tchalla',t:'They are not keeping a tally. They are only glad you came home. My father told me the same, in this kind of place.',next:'gift'},
  gift:{s:'narrator',t:'T’Challa takes a single dark bead from his wrist, carved with a small panther’s head, and threads it onto Matt’s rosary beside Obi-Wan’s stone.',next:'f'},
  f:{s:'tchalla',t:'In my country we carry our ancestors on our wrists. Now you carry three teachers, and everyone who came before you.',next:'g'},
  g:{s:'tchalla',t:'Each morning, touch the bead and say one name. Then thank God for them. That is all. It is enough.',next:'h'},
  h:{s:'tchalla',t:'You are a link in the chain now, {name}. Hold fast. Someone small is holding on to you.',end:true,do:[{quest:['the-ancestral-plane','complete']}]}}},

 // ---------------- The Argument You Lose (Tavi, Marriage, tier 1: 3 habits, 3 days) ----------------
 'the-argument-you-lose-1':{who:'tavi',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Tavi is at a corner table in the Rose Café, feet up, eating someone else’s pastry with a perfectly innocent face.',next:'b'},
  b:{s:'tavi',t:'Sit. I saw you and your wife outside yesterday. You won that argument. Congratulations. Terrible tactics.',next:'c'},
  c:{s:'tavi',t:'What did winning get you?',opts:[
   {t:'Being right, I suppose.',next:'right'},
   {t:'A very quiet dinner.',next:'quiet'},
   {t:'Hey, she started it.',next:'started'}]},
  right:{s:'tavi',t:'Being right. I conquered a kingdom being right. Kitai still made me sleep in the stables. Right is a small, cold prize.',next:'d'},
  quiet:{s:'tavi',t:'Ah, the quiet dinner. The most dangerous battlefield in any realm. I’ve lost whole legions there.',next:'d'},
  started:{s:'tavi',t:'Says every man who ever slept on a couch. Who started it doesn’t matter. Who ends it well does.',next:'d'},
  d:{s:'tavi',t:'Here’s what I learned the hard way. In a marriage, you’re not opponents. You’re a legion of two. You win together or not at all.',next:'offer'},
  offer:{s:'tavi',t:'So here’s your campaign. Three things for her. Real time, a kind word, your full attention. Then report to me, soldier.',opts:[
   {t:'Three. For her. (Start “The Argument You Lose”)',next:'yes',do:[{quest:['the-argument-you-lose','start']}]},
   {t:'Let me cool off first.',next:'no'}]},
  yes:{s:'tavi',t:'Good man. And if she asks why you’re being so nice, don’t say Tavi told you. She’ll know it was a strategy.',end:true},
  no:{s:'tavi',t:'Cool off, sure. But don’t let it set. Stubborn hardens fast. I would know.',end:true}}},

 'the-argument-you-lose-2':{who:'tavi',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Tavi is sitting on a fence at the edge of the village, wearing a fresh bruise and an enormous grin.',next:'b'},
  b:{s:'tavi',t:'Kitai and I sparred. I let her win. She knew I let her win. That’s how I got this. Anyway, three. Report.',next:'c'},
  c:{s:'tavi',t:'How did she take it?',opts:[
   {t:'She smiled at me like she used to.',next:'smile',do:[{flag:'tavi-smile'}]},
   {t:'She asked what I wanted.',next:'suspicious'},
   {t:'Honestly, I’m not sure she noticed.',next:'notice'}]},
  smile:{s:'tavi',t:'There it is. Worth more than any crown, that smile. Trust me, I’ve had both.',next:'d'},
  suspicious:{s:'tavi',t:'Ha. That means it’s been a while. Don’t be hurt. Be consistent. Suspicion melts if you keep showing up.',next:'d'},
  notice:{s:'tavi',t:'She noticed. They always notice. She’s just waiting to see if it lasts. So let’s make it last.',next:'d'},
  d:{s:'tavi',t:'Anyone can be charming for an afternoon. I want you to choose her on three different days. Three days, not one big gesture.',next:'e'},
  e:{s:'tavi',t:'Grand gestures are for the songs. Marriages are built in Tuesdays.',opts:[
   {t:'Three days. Built in Tuesdays.',next:'f',do:[{quest:['the-argument-you-lose','advance']}]}]},
  f:{s:'kitai',t:'Aleran. Stop teaching him your bad habits.',next:'g'},
  g:{s:'narrator',t:'Kitai drops from the tree above, flicks Tavi on the ear, and walks off. He watches her go with the look of a man still entirely lost.',end:true,do:[{xp:['marriage',300]}]}}},

 'the-argument-you-lose-3':{who:'tavi',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'At closing time the café terrace is empty except for Tavi, two cups of tea, and a small folded square of paper.',next:'b'},
  b:{s:'tavi',t:'Three days. You chose her when it was easy and when you were tired. That’s the whole secret. Don’t tell anyone.',next:'c'},
  c:{s:'tavi',t:'Did you two argue again?',opts:[
   {t:'We did. I let her be right.',next:'lost'},
   {t:'We did. I said sorry first.',next:'sorry'}]},
  lost:{s:'tavi',t:'Ha! Lost on purpose. The hardest maneuver in any campaign. I’m proud of you.',next:'d'},
  sorry:{s:'tavi',t:'First apology wins the war. Every time. It took me a decade to learn that.',next:'d'},
  d:{s:'tavi',t:'This is the first note I ever wrote Kitai. Terrible poem. She keeps it in her boot. She thinks I don’t know.',next:'e'},
  e:{s:'tavi',t:'I’m not giving you this one. She’d skin me. I’m giving you the habit. Write your wife a note. Short. True. No strategy.',next:'f'},
  f:{s:'narrator',t:'He slides a blank sheet of paper and a pencil across the table, and sips his tea while you think of what to write.',next:'g'},
  g:{s:'tavi',t:'Lose more arguments, {name}. Win the marriage. That’s an order from the First Lord.',end:true,do:[{quest:['the-argument-you-lose','complete']}]}}},

 // ---------------- The Promised Dance (Steve, Marriage, tier 2: 5 habits, 4 days) ----------------
 'the-promised-dance-1':{who:'steve',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Steve sits alone at a café table near the window, an old record playing low behind the counter. He’s not drinking his coffee.',next:'b'},
  b:{s:'steve',t:'Sit down, soldier. Can I ask you something personal? When did you last take your wife dancing?',next:'c'},
  c:{s:'steve',t:'Or anything like it. Just the two of you, no plans after.',opts:[
   {t:'I honestly can’t remember.',next:'cant'},
   {t:'We keep meaning to. Life gets busy.',next:'busy'},
   {t:'I don’t really dance.',next:'dance'}]},
  cant:{s:'steve',t:'That’s an honest answer. Better than mine would’ve been. I can tell you exactly how long I made someone wait.',next:'d'},
  busy:{s:'steve',t:'Yeah. There was a war on, for me. There’s always a war on. That’s the trap.',next:'d'},
  dance:{s:'steve',t:'Neither did I. I asked a girl anyway. Then I didn’t show up. I’d give a lot for a do-over.',next:'d'},
  d:{s:'steve',t:'I promised someone a dance and I was late by about seventy years. Don’t make my mistake. You’ve got her right here.',next:'offer'},
  offer:{s:'steve',t:'Five things for her. Time, a date, real attention, whatever she’d call love. Then come tell me about it.',opts:[
   {t:'Five. No more “someday.” (Start “The Promised Dance”)',next:'yes',do:[{quest:['the-promised-dance','start']}]},
   {t:'Not this week, Cap.',next:'no'}]},
  yes:{s:'steve',t:'That’s the spirit. And hey. Show up on time.',end:true},
  no:{s:'steve',t:'I understand. Just don’t let “not this week” turn into seventy years. Ask me how I know.',end:true}}},

 'the-promised-dance-2':{who:'steve',bg:'facility-scenes/raphael.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Steve is in the Training Yard, holding a heavy bag steady for no one in particular. He lets it go when he sees you.',next:'b'},
  b:{s:'steve',t:'Five. I heard she laughed at something you said at the café. The whole room turned around.',next:'c'},
  c:{s:'steve',t:'How’s it feel?',opts:[
   {t:'Like I’ve been away a long time.',next:'away',do:[{flag:'steve-homecoming'}]},
   {t:'Good. A little scary, actually.',next:'scary'}]},
  away:{s:'steve',t:'I know that one. Waking up and the world moved on. Good news is, she waited. Now you make the waiting worth it.',next:'d'},
  scary:{s:'steve',t:'It should be. Caring this much is supposed to scare you a little. Means you’ve got something to lose.',next:'d'},
  d:{s:'steve',t:'Now here’s the hard part. Love isn’t a mission you complete. It’s a post you hold. Day after day.',next:'e'},
  e:{s:'steve',t:'Four different days. Show up for her on each one. No sprinting. Just steady, like you mean it.',opts:[
   {t:'Four days. I’ll hold the post.',next:'f',do:[{quest:['the-promised-dance','advance']}]}]},
  f:{s:'steve',t:'And one more order. Learn one dance. Doesn’t have to be good. Mine wasn’t going to be.',next:'g'},
  g:{s:'narrator',t:'Steve shows you a basic box step right there in the yard. He’s stiff, and you’re worse, and you’re both laughing by the end.',end:true,do:[{xp:['marriage',500]}]}}},

 'the-promised-dance-3':{who:'steve',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'At dusk the village square is lit with paper lanterns. Steve sits on the fountain’s edge with an old brass compass open in his hand.',next:'b'},
  b:{s:'steve',t:'Four days. You held the post. I’m proud of you, and I don’t say that lightly.',next:'c'},
  c:{s:'steve',t:'I kept her picture in this compass. Every mission. It wasn’t for finding north. It was for finding home.',next:'d'},
  d:{s:'steve',t:'I want you to have it. Put her picture inside. When the world pulls you away, open it and come back.',opts:[
   {t:'Steve, this is your whole story.',next:'story'},
   {t:'I’ll put her picture in tonight.',next:'tonight'}]},
  story:{s:'steve',t:'It was. I finally got my dance, you know. Now it should help someone else get to theirs. That’s what it’s for.',next:'e'},
  tonight:{s:'steve',t:'Good. And look at it before you open the door, not after. That’s the trick nobody told me.',next:'e'},
  e:{s:'narrator',t:'He presses the compass into your hand. The needle shivers, then settles, pointing toward the lane that leads to your house.',next:'f'},
  f:{s:'steve',t:'One last thing. That box step I taught you? Go home and use it. Kitchen floor counts. Music optional.',next:'g'},
  g:{s:'steve',t:'Don’t keep her waiting, {name}. Go get your dance.',end:true,do:[{quest:['the-promised-dance','complete']}]}}},
};
