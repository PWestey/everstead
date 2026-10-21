// Second-wave quests for Faith (Uther, Saradomin), Marriage (Malfurion, Thrall, Cal) and Fatherhood (Varian, Baine).
// Format: see lib/dialogue.mjs (iron-body trees) and lib/quests.mjs.
// Tier counts: 3 = 8 habits / 5 days, 4 = 12 / 7, 5 = 15 / 10.

/** @type {Record<string,any>} */
export const QUESTS={
 'the-silver-hand':{name:'The Silver Hand',area:'faith',giver:'uther',tier:4,
  blurb:'Uther the Lightbringer has noticed the keepsakes you’ve picked up at the Chapel. He wants to know if you still pray when it feels like a chore.',
  say:['Talk to Uther at the Chapel.','Report back to Uther.','Meet Uther at the Chapel altar before dawn.']},
 'the-star-of-saradomin':{name:'The Star of Saradomin',area:'faith',giver:'saradomin',tier:5,
  blurb:'The god of order has turned up at the Chapel in person. He doesn’t want you great. He wants you faithful.',
  say:['Answer Saradomin’s summons at the Chapel.','Report back to Saradomin.','Climb the Chapel bell tower at dawn, where Saradomin waits.']},
 'waking-from-the-dream':{name:'Waking from the Dream',area:'marriage',giver:'malfurion',tier:3,
  blurb:'Malfurion slept ten thousand years while Tyrande kept watch. He saw you at dinner with your wife last night, and he doesn’t think you were there.',
  say:['Talk to Malfurion at the Rose Café.','Report back to Malfurion.','Meet Malfurion and Tyrande in the moonlit grove beyond the village.']},
 'setting-down-the-mantle':{name:'Setting Down the Mantle',area:'marriage',giver:'thrall',tier:4,
  blurb:'Thrall carried a whole people alone until Aggra made him put it down. He can see you hauling everything yourself and telling her nothing.',
  say:['Talk to Thrall at the Rose Café.','Report back to Thrall.','Meet Thrall at the fire circle on the northern road.']},
 'the-choice-you-keep':{name:'The Choice You Keep',area:'marriage',giver:'cal',tier:5,
  blurb:'Cal Kestis can feel the echoes left on objects. He grabbed your compass by accident, and now he has a question about your wife.',
  say:['Talk to Cal at the Rose Café.','Report back to Cal.','Meet Cal on the café terrace on the night of the lantern festival.']},
 'the-lion-and-the-cub':{name:'The Lion and the Cub',area:'fatherhood',giver:'varian',tier:4,
  blurb:'Varian Wrynn nearly lost his son to his own temper and his long absences. He’s heard the Dad Council at the Hearth Inn, and he has a harder lesson to add.',
  say:['Talk to Varian at the Hearth Inn.','Report back to Varian.','Meet Varian in the Training Yard after dark.']},
 'footprints-on-the-plains':{name:'Footprints on the Plains',area:'fatherhood',giver:'baine',tier:5,
  blurb:'Baine Bloodhoof walks in his father Cairne’s footprints every day. He wants to know what kind you’re leaving for your kids.',
  say:['Talk to Baine at the Hearth Inn.','Report back to Baine.','Meet Baine and the Dad Council on the open plains at sunset.']},
};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- The Silver Hand (Uther, Faith, tier 4: 12 habits, 7 days) ----------------
 'the-silver-hand-1':{who:'uther',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A man in dented plate kneels at the Chapel altar, a warhammer laid flat beside him. He gets up the way old knees do, and the floorboards complain.',next:'b'},
  b:{s:'uther',t:'A stone, a rosary, a panther bead. Three teachers already. Kenobi tells me you listen. We’ll see.',next:'c'},
  c:{s:'uther',t:'Here’s what they were too polite to ask. The mornings the Light feels a mile off. What do you actually do?',opts:[
   {t:'Honestly? I skip it.',next:'skip'},
   {t:'I pray anyway. It feels like talking to a wall.',next:'hollow'},
   {t:'It never feels far away.',next:'never'}]},
  skip:{s:'uther',t:'At least you didn’t lie. Half my recruits did. A paladin who skips his vigil when he’s tired is a man in very expensive armor.',next:'d'},
  hollow:{s:'uther',t:'Walls listen better than you’d think. I prayed through a whole Hearthglen winter and heard nothing. Kept at it. Spring came.',next:'d'},
  never:{s:'uther',t:'Hm. Then you’re a saint or you’re new. I’ve met one saint in my life. Archbishop Faol. He’d have laughed at you.',next:'d'},
  d:{s:'uther',t:'The Light isn’t a mood, son. It’s a job. You haul it up the hill whether you feel holy that morning or not.',next:'e'},
  e:{s:'uther',t:'I trained a prince once. Gifted. Proud. Impatient. He wanted the Light to make him great. Not faithful. Great.',opts:[
   {t:'What happened to him?',next:'arthas'},
   {t:'Why are you telling me this?',next:'why'}]},
  arthas:{s:'uther',t:'Stratholme happened. He burned a city to win a war, and lost himself in the ashes. I won’t say his name in here.',next:'offer'},
  why:{s:'uther',t:'Because you’re doing well. That’s exactly when pride pulls up a chair. I’ve watched it happen to better men than either of us.',next:'offer'},
  offer:{s:'uther',t:'Twelve. Prayer, scripture, giving thanks. At least three spent on somebody other than yourself. Then come back and tell me.',opts:[
   {t:'Twelve. I’ll carry it. (Start “The Silver Hand”)',next:'yes',do:[{quest:['the-silver-hand','start']}]},
   {t:'Uther, I’m not paladin material.',next:'no'}]},
  yes:{s:'uther',t:'Good. Off you go. And mind the step on the way out. Pride isn’t the only thing that trips people in here.',end:true},
  no:{s:'uther',t:'Nobody is. I wasn’t. The vigil starts anyway. I’ll be in this pew when you change your mind.',end:true}}},

 'the-silver-hand-2':{who:'uther',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Uther is knee-deep in mud behind a farmer’s cart, plate armor and all. He doesn’t look up when you arrive.',next:'b'},
  b:{s:'uther',t:'Twelve, is it? Good. Get the other side. On three. Reports go better when your hands are busy.',next:'c'},
  c:{s:'narrator',t:'You heave. The cart comes loose with a wet sucking noise. The farmer blesses you both twice and hurries off before you can ask him to help.',next:'d'},
  d:{s:'uther',t:'So. When you prayed for somebody else. Who was it?',opts:[
   {t:'My wife and kids.',next:'family',do:[{flag:'uther-intercede'}]},
   {t:'Somebody I can’t stand.',next:'enemy',do:[{flag:'uther-intercede'}]},
   {t:'Mostly myself, if I’m honest.',next:'self'}]},
  family:{s:'uther',t:'Good. Your first parish is your own dinner table. Guard it on your knees before you go guarding it with your fists.',next:'e'},
  enemy:{s:'uther',t:'Ha! Hardest prayer there is. I prayed for the orcs in the internment camps once. It changed me more than it changed them.',next:'e'},
  self:{s:'uther',t:'Well, now you know where your eyes are. Point them outward this week. Faol used to say the Light grows where you give it away. Constantly.',next:'e'},
  e:{s:'uther',t:'Now the real vigil. Seven different days. Not seven prayers in one burst of zeal on a Sunday. Seven separate mornings.',next:'f'},
  f:{s:'uther',t:'We didn’t hold Lordaeron with one glorious charge. We held it with a watch kept every night, by men who were cold and tired.',opts:[
   {t:'Seven days. I’ll keep the watch.',next:'g',do:[{quest:['the-silver-hand','advance']}]}]},
  g:{s:'uther',t:'Right. Now hand me that wheel. Faith with no sweat in it is just talking.',next:'h'},
  h:{s:'narrator',t:'You fix the wheel together in the muck. Uther hums an old Lordaeron hymn, badly off-key, and doesn’t care who hears.',end:true,do:[{xp:['faith',900]}]}}},

 'the-silver-hand-3':{who:'uther',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Before dawn the Chapel is cold enough to see your breath. Uther kneels at the altar, hammer upright, forehead resting on the haft.',next:'b'},
  b:{s:'uther',t:'Seven days. I heard about the morning you were sick as a dog and knelt anyway. I’d wager the Light heard too.',next:'c'},
  c:{s:'uther',t:'Down here beside me. A vigil ends how it starts. On your knees, with nothing to prove to anybody.',next:'d'},
  d:{s:'narrator',t:'You kneel. The stone bites through your knees. Uther prays for your house by name, one person at a time, slowly, like he means each one.',next:'e'},
  e:{s:'uther',t:'When Faol and I founded the Order, every paladin got one of these. A silver hand. Open. Not a fist.',next:'f'},
  f:{s:'narrator',t:'He presses a small silver medallion into your palm, shaped like an open hand. The fingertips are worn smooth.',opts:[
   {t:'Why open? Why not a fist?',next:'open'},
   {t:'Uther, I’m not a paladin.',next:'nopaladin'}]},
  open:{s:'uther',t:'A fist protects. An open hand serves, and it can take what it’s given. You’ll need to know how to do all of it.',next:'g'},
  nopaladin:{s:'uther',t:'A paladin keeps a vow when it costs him. You did that seven days running. Argue with me later. I’m old, and I’ll win.',next:'g'},
  g:{s:'uther',t:'Hang it with the rest. Every morning, open hand on your chest: “I’ll carry it today.” Then go and actually do it.',next:'h'},
  h:{s:'narrator',t:'You thread the silver hand onto the chain beside the stone, the beads and the panther. A heavy gauntlet lands on your shoulder.',next:'i'},
  i:{s:'uther',t:'Up you get, {name}. Faithful, not great. That’s the whole order of business. The Light can handle the rest.',end:true,do:[{quest:['the-silver-hand','complete']}]}}},

 // ---------------- The Star of Saradomin (Saradomin, Faith, tier 5: 15 habits, 10 days) ----------------
 'the-star-of-saradomin-1':{who:'saradomin',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Chapel bell rings with nobody on the rope. Inside, every candle is lit, and a tall figure in white and gold stands in the altar light.',next:'b'},
  b:{s:'saradomin',t:'Peace. I am Saradomin. Your chapel is small, but I hear it from a long way off. Lately I have been hearing you.',next:'c'},
  c:{s:'player',t:'A god. In Everstead. Who’s heard me praying in my bathrobe.',next:'d'},
  d:{s:'saradomin',t:'Do not look so alarmed. Zamorak would have kicked the door in. I prefer to knock. Your little lamp has burned very steadily.',opts:[
   {t:'Why would a god bother with my little prayers?',next:'small'},
   {t:'I’m not sure I’m worth your time.',next:'worth'},
   {t:'What do you want from me?',next:'want'}]},
  small:{s:'saradomin',t:'Little things done in order hold the world up. Chaos likes loud and grand. I like quiet, daily and very small.',next:'e'},
  worth:{s:'saradomin',t:'Worth is not what I measure. A great knight who wavers is less use to me than a plain man who keeps coming back.',next:'e'},
  want:{s:'saradomin',t:'Very little, and everything. Not greatness. I have had my fill of heroes. Faithfulness, until it is simply who you are.',next:'e'},
  e:{s:'saradomin',t:'Kenobi taught you stillness. Murdock, the dark. T’Challa, your fathers. Uther, the chore of it. Those were stairs. I am the top.',next:'f'},
  f:{s:'saradomin',t:'I fought a war across Gielinor against chaos. Yours is smaller, and it is fought every morning: the prayer, or the glowing screen.',next:'offer'},
  offer:{s:'saradomin',t:'Fifteen acts of faith. Pray, read, give thanks, serve. Not in a burst. As a pattern I can see from Entrana.',opts:[
   {t:'Fifteen. Let it become who I am. (Start “The Star of Saradomin”)',next:'yes',do:[{quest:['the-star-of-saradomin','start']}]},
   {t:'That’s a lot. Give me some time.',next:'no'}]},
  yes:{s:'saradomin',t:'So be it. Walk in order. You will find the road has more company on it than it looks.',end:true},
  no:{s:'saradomin',t:'Time I have rather a lot of. Take what you need. The candles will keep.',end:true}}},

 'the-star-of-saradomin-2':{who:'saradomin',bg:'facility-scenes/museum.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Saradomin waits in a hall of relics under glass. He is studying a cracked blue-and-white kiteshield as if he remembers the arm behind it.',next:'b'},
  b:{s:'saradomin',t:'Fifteen. I saw each one. A prayer in a parked car. Thanks muttered at the kitchen sink. They all count. They all reach me.',next:'c'},
  c:{s:'saradomin',t:'Now tell me. Where is chaos still winning in you?',opts:[
   {t:'Mornings. The phone gets to me before God does.',next:'phone',do:[{flag:'saradomin-confess'}]},
   {t:'My temper, when I’m tired.',next:'temper',do:[{flag:'saradomin-confess'}]},
   {t:'Honestly? I think I’m doing pretty well.',next:'well'}]},
  phone:{s:'saradomin',t:'Then restore the order. First word to me, then the world. One sentence before the screen moves the whole battle line.',next:'d'},
  temper:{s:'saradomin',t:'Tired, short-tempered men. That is precisely where Zamorak does his recruiting. Pray at the front door. A breath, a name, a thanks.',next:'d'},
  well:{s:'saradomin',t:'You are. And Uther told you what follows that thought. I will not repeat him. He would be unbearable about it for a week.',next:'d'},
  d:{s:'saradomin',t:'Every shield in this room belonged to a White Knight of Falador who was never great. Only faithful. They held for centuries.',next:'e'},
  e:{s:'saradomin',t:'Now the last stretch, and the longest. Ten different days. Not perfect ones. Faithful ones. That is how a habit becomes a vow.',opts:[
   {t:'Ten days. I’ll hold the line.',next:'f',do:[{quest:['the-star-of-saradomin','advance']}]}]},
  f:{s:'saradomin',t:'Stand here a moment, among the ones who came before you. They do not get many visitors.',next:'g'},
  g:{s:'narrator',t:'The hall goes silent. Then every relic glints at once, as if a thousand old knights had nodded.',end:true,do:[{xp:['faith',1000]}]}}},

 'the-star-of-saradomin-3':{who:'saradomin',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At dawn you climb the bell tower. Saradomin stands at the top with the bell rope in one hand and the whole valley gold beneath him.',next:'b'},
  b:{s:'saradomin',t:'Ten days. The bright ones and the grey ones. I watched from very far away, and the pattern held.',next:'c'},
  c:{s:'narrator',t:'Down in the square, small figures have gathered. Obi-Wan. Matt with his cane. T’Challa. Uther, hammer over his shoulder. All looking up.',next:'d'},
  d:{s:'saradomin',t:'They came to watch you finish. Teachers enjoy that. Uther will pretend he does not.',next:'e'},
  e:{s:'saradomin',t:'Show me what you carry.',opts:[
   {t:'Hold up the chain: stone, rosary, panther, silver hand.',next:'chain'},
   {t:'Just my two hands. That’s all I’ve got.',next:'hands'}]},
  chain:{s:'saradomin',t:'Stillness. The dark. Your fathers. Duty. Four teachers on one chain. There is room for one more.',next:'star'},
  hands:{s:'saradomin',t:'Hands are what faith was always made of. The trinkets only remind them. Still, I did bring you one.',next:'star'},
  star:{s:'narrator',t:'He opens his hand. A small eight-pointed star of blue and gold sits in his palm, warm as a coal and humming faintly like the bell.',next:'f'},
  f:{s:'saradomin',t:'My star. I give it to the faithful, not the great. Hang it last. It keeps the others in order. Naturally.',next:'g'},
  g:{s:'saradomin',t:'Now the ritual. Every morning, before the screen, the inbox, anyone else’s voice: one prayer. Then the day may have you.',opts:[
   {t:'Every morning. First word to You.',next:'ring'},
   {t:'And if I miss a morning?',next:'miss'}]},
  miss:{s:'saradomin',t:'Then the next morning you begin again. Order is not never falling. It is always coming back. Kenobi told you that first, I believe.',next:'ring'},
  ring:{s:'saradomin',t:'Take the rope. Let the valley hear it.',next:'h'},
  h:{s:'narrator',t:'You pull. The bell rolls out over Everstead. Down in the square, four men raise a hand. Somewhere a kid shrieks with laughter.',next:'i'},
  i:{s:'saradomin',t:'Faithful, {name}. It is the highest word I have for anyone. Go in order, and go in peace.',end:true,do:[{quest:['the-star-of-saradomin','complete']}]}}},

 // ---------------- Waking from the Dream (Malfurion, Marriage, tier 3: 8 habits, 5 days) ----------------
 'waking-from-the-dream-1':{who:'malfurion',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'An enormous night elf with antlers and a long green beard lowers himself into a café chair built for someone half his size. Vines start up its legs at once.',next:'b'},
  b:{s:'malfurion',t:'Apologies for the vines. They follow me around. Sit. I saw you last night, at the window table, with your wife.',next:'c'},
  c:{s:'malfurion',t:'You sat across from her for an hour. I would guess you were actually there for about a minute of it.',opts:[
   {t:'Work was on my mind.',next:'work'},
   {t:'I checked my phone a few times, sure.',next:'phone'},
   {t:'We were fine. It was a quiet night.',next:'fine'}]},
  work:{s:'malfurion',t:'For me it was the fate of the world. I told myself that mattered more. It did nothing to warm the empty chair beside her.',next:'d'},
  phone:{s:'malfurion',t:'A little glowing dream in the palm of your hand. I know dreams. I slept in the Emerald one for ten thousand years.',next:'d'},
  fine:{s:'malfurion',t:'Perhaps. But quiet and absent look identical from across a room. Only she knows which it was. You could ask her.',next:'d'},
  d:{s:'malfurion',t:'I left Tyrande to keep watch alone. Century after century. Always meaning to be back soon. “Soon.” I have come to hate that word.',next:'e'},
  e:{s:'malfurion',t:'She waited. She should not have had to. Neither should your wife, even through one dinner.',next:'offer'},
  offer:{s:'malfurion',t:'Eight times, be awake with her. A date. A real conversation. The phone face down in another room. Then come and tell me.',opts:[
   {t:'Eight. I’ll wake up. (Start “Waking from the Dream”)',next:'yes',do:[{quest:['waking-from-the-dream','start']}]},
   {t:'I’m stretched too thin right now.',next:'no'}]},
  yes:{s:'malfurion',t:'Good. Start tonight. The trees can wait. They are very good at it. She should not have to be.',end:true},
  no:{s:'malfurion',t:'I said that for the first thousand years. I will be here. I am, regrettably, extremely patient.',end:true}}},

 'waking-from-the-dream-2':{who:'malfurion',bg:'facility-scenes/apothecary.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Malfurion kneels in the apothecary garden, coaxing a drooping rose upright with two fingers and a low, rumbling hum.',next:'b'},
  b:{s:'malfurion',t:'Eight. I felt it from here. The roses by the café opened a little wider this week. Roses are terrible gossips.',next:'c'},
  c:{s:'malfurion',t:'So. When you were actually in the room with her. What changed?',opts:[
   {t:'She talked more. Stuff I didn’t know.',next:'talked',do:[{flag:'malfurion-awake'}]},
   {t:'She asked if something was wrong.',next:'wrong'},
   {t:'Honestly, it was awkward at first.',next:'awkward'}]},
  talked:{s:'malfurion',t:'She was always talking. You were simply awake enough to hear it. There is a whole country in her you have not visited yet.',next:'d'},
  wrong:{s:'malfurion',t:'Ha! When I woke from the Dream, Tyrande asked if I was ill. Attention is a shock. Keep at it until it stops being one.',next:'d'},
  awkward:{s:'malfurion',t:'Naturally. Waking up is stiff work. Every limb remembers sleeping. Stretch anyway.',next:'d'},
  d:{s:'malfurion',t:'Now the harder part. Five different days. A druid does not water a sapling once and call it a forest.',next:'e'},
  e:{s:'malfurion',t:'Five separate days, present with her. Small is fine. A walk after dinner. A real question. Ten minutes with empty hands.',opts:[
   {t:'Five days. Awake for every one.',next:'f',do:[{quest:['waking-from-the-dream','advance']}]}]},
  f:{s:'malfurion',t:'Here. Hold this rose. Tell me what you see.',next:'g'},
  g:{s:'narrator',t:'You actually look. Every petal is a slightly different red. Malfurion smiles into his beard. “That. Look at her like that.”',end:true,do:[{xp:['marriage',800]}]}}},

 'waking-from-the-dream-3':{who:'malfurion',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'In a moonlit grove past the village, Malfurion sits on a mossy stone. A tall woman with silver eyes stands at his shoulder, a bow across her back.',next:'b'},
  b:{s:'malfurion',t:'Five days, awake for all of them. You learned in a few weeks what took me ten thousand years.',next:'c'},
  c:{s:'tyrande',t:'Ten thousand and three. I kept count. Someone had to.',next:'d'},
  d:{s:'narrator',t:'Malfurion looks at her like a man seeing the sun after a very long winter. She rests a hand on his antler, just for a moment.',next:'e'},
  e:{s:'tyrande',t:'Your wife doesn’t need a hero. She’s had plenty of those in stories. She needs you at the table, actually there.',opts:[
   {t:'How did you keep waiting all that time?',next:'wait'},
   {t:'How do I make up for the times I wasn’t there?',next:'makeup'}]},
  wait:{s:'tyrande',t:'Every night, under Elune, I chose him again. Some nights I was furious while I did it. I chose him anyway.',next:'f'},
  makeup:{s:'tyrande',t:'Not with one grand evening. He tried that. It was very grand. Do it the way he finally learned. Present. Again. Again.',next:'f'},
  f:{s:'malfurion',t:'Take this. An acorn from the oldest tree I ever tended. It has waited a long time for the right ground.',next:'g'},
  g:{s:'malfurion',t:'Plant it with her. Both of your hands in the dirt. Water it together on the days you choose to be there.',next:'h'},
  h:{s:'narrator',t:'The acorn is warm and faintly green, as if something inside is already stretching. Tyrande folds your fingers over it.',next:'i'},
  i:{s:'malfurion',t:'Stay awake, {name}. The Dream is beautiful. She is better. Go home.',end:true,do:[{quest:['waking-from-the-dream','complete']}]}}},

 // ---------------- Setting Down the Mantle (Thrall, Marriage, tier 4: 12 habits, 7 days) ----------------
 'setting-down-the-mantle-1':{who:'thrall',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A broad green orc in a plain shaman’s robe sits by the café hearth. A huge black hammer leans on the wall behind him like an old friend who retired.',next:'b'},
  b:{s:'thrall',t:'Lok’tar, friend. Sit. You walked in like a warchief. Shoulders up, jaw tight, eyes already on the next fire.',next:'c'},
  c:{s:'thrall',t:'When the day flattens you, does your wife know?',opts:[
   {t:'No. She’s got enough going on.',next:'protect'},
   {t:'She guesses. I don’t say much.',next:'guess'},
   {t:'I tell her everything.',next:'everything'}]},
  protect:{s:'thrall',t:'I said those exact words about Aggra. She hit me. Not hard. Hard enough to make the point.',next:'d'},
  guess:{s:'thrall',t:'Then she carries your silence on top of her own load. The spirits told me silence is heavy. Aggra told me louder.',next:'d'},
  everything:{s:'thrall',t:'Then you are wiser than I was. Ask me again in a week, after you have watched yourself honestly.',next:'d'},
  d:{s:'thrall',t:'I led the Horde. I held Azeroth together with my bare hands. And the elements stopped answering, because I was alone inside all of it.',next:'e'},
  e:{s:'thrall',t:'Aggra said, “Here you are not Warchief. You are Go’el. Put it down.” Only then did my feet find the ground again.',next:'offer'},
  offer:{s:'thrall',t:'Twelve deeds for your marriage. Time, attention, a date. And at least once, tell her something you have been carrying alone.',opts:[
   {t:'Twelve. I’ll set it down. (Start “Setting Down the Mantle”)',next:'yes',do:[{quest:['setting-down-the-mantle','start']}]},
   {t:'I don’t want to dump that on her.',next:'no'}]},
  yes:{s:'thrall',t:'Good. It will feel like weakness. It is not. Go on. Walk lighter.',end:true},
  no:{s:'thrall',t:'It is not dumping. It is letting her stand under it with you. Aggra would explain that with her fist. I am using words.',end:true}}},

 'setting-down-the-mantle-2':{who:'thrall',bg:'facility-scenes/northern.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Thrall sits cross-legged on the north road in the wind, eyes shut, one hand flat on the dirt.',next:'b'},
  b:{s:'thrall',t:'Twelve. The wind told me you were coming. The wind is a dreadful gossip. Sit.',next:'c'},
  c:{s:'thrall',t:'The thing you told her. How did she take it?',opts:[
   {t:'She held my hand and didn’t say anything.',next:'held',do:[{flag:'thrall-shared'}]},
   {t:'She was hurt I didn’t tell her sooner.',next:'hurt',do:[{flag:'thrall-shared'}]},
   {t:'I haven’t managed it yet.',next:'notyet'}]},
  held:{s:'thrall',t:'A council of two. The best council I ever sat on. Fewer speeches than Orgrimmar, and nobody named Garrosh.',next:'d'},
  hurt:{s:'thrall',t:'Aggra was the same. That hurt is love finding out it was locked out of a room. Open the door. It heals.',next:'d'},
  notyet:{s:'thrall',t:'Then that is your work this week. Not a speech. One true sentence. She will help with the rest. They usually do.',next:'d'},
  d:{s:'thrall',t:'A horde has campaigns, and campaigns end. A home does not. There is only tomorrow, and then the day after.',next:'e'},
  e:{s:'thrall',t:'Seven different days. Ask about her day like it is a report from the front. Then listen to the whole report.',opts:[
   {t:'Seven days. A council every one.',next:'f',do:[{quest:['setting-down-the-mantle','advance']}]}]},
  f:{s:'thrall',t:'Hand on the ground. Feel that? It carries everything and does not complain. It also does not do it alone.',next:'g'},
  g:{s:'narrator',t:'Under your palm the ground is steady and faintly warm. Thrall nods once, as if the earth just agreed with him.',end:true,do:[{xp:['marriage',900]}]}}},

 'setting-down-the-mantle-3':{who:'thrall',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At the fire circle on the north road, Thrall feeds a small fire with sweetgrass. Two flat river stones sit on a blanket beside him.',next:'b'},
  b:{s:'thrall',t:'Seven days. I hear she laughed at your report on Thursday. In all my years, nobody laughed at mine. Mostly they bowed.',next:'c'},
  c:{s:'thrall',t:'When Aggra and I were joined in Nagrand, the elder gave us two stones from the river. Worn smooth by the same water.',next:'d'},
  d:{s:'thrall',t:'These came from that river. I asked the water for them. It said yes, which it does not always do.',opts:[
   {t:'Why two stones?',next:'two'},
   {t:'What do we do with them?',next:'do'}]},
  two:{s:'thrall',t:'Because a marriage is two weights side by side, not one man holding both. The river carried them together. That is why they are smooth.',next:'ritual'},
  do:{s:'thrall',t:'Ah. That is the good part. Listen.',next:'ritual'},
  ritual:{s:'thrall',t:'Once a week, sit with her. You each hold a stone and name one thing you are carrying. Then you trade.',next:'e'},
  e:{s:'thrall',t:'You will not fix anything. That is not the point. Nobody carries it alone. Durak learns that just by watching us.',next:'f'},
  f:{s:'narrator',t:'He places the stones in your hands. They click softly together, like they know each other.',opts:[
   {t:'Thank you, Thrall. Really.',next:'thanks'},
   {t:'So I’m Go’el’s student now?',next:'goel'}]},
  thanks:{s:'thrall',t:'Thank her. She is the one who will make it work. I only carried the rocks up the road.',next:'g'},
  goel:{s:'thrall',t:'Ha! Then here is Go’el’s last lesson. Leave the mantle at the front door. Every night. It will still be there in the morning.',next:'g'},
  g:{s:'thrall',t:'Walk lighter, {name}. And walk beside her. Lok’tar.',end:true,do:[{quest:['setting-down-the-mantle','complete']}]}}},

 // ---------------- The Choice You Keep (Cal, Marriage, tier 5: 15 habits, 10 days) ----------------
 'the-choice-you-keep-1':{who:'cal',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A young guy in a patched poncho sits at the café bar, a little round droid on his shoulder. He’s holding Steve’s compass. Your compass.',next:'b'},
  b:{s:'cal',t:'Oh. Sorry. You left it on the table and I grabbed it before I thought. I, uh, feel echoes on stuff. What people felt holding it.',next:'c'},
  c:{s:'cal',t:'This one’s loud. A soldier who was late for a dance. And you, looking at her picture before you went in your front door.',opts:[
   {t:'That’s kind of invasive, Cal.',next:'invasive'},
   {t:'What else did you pick up?',next:'else'},
   {t:'Give that back.',next:'back'}]},
  invasive:{s:'cal',t:'Yeah. Merrin says that too. A lot. I’m working on asking first. Here.',next:'d'},
  else:{s:'cal',t:'Tavi’s notes. An acorn in your coat. Two river stones. Good teachers. And you’re still a little scared. Sorry. Here.',next:'d'},
  back:{s:'cal',t:'Right. Yep. Sorry. Here.',next:'d'},
  d:{s:'narrator',t:'He hands it back. The droid on his shoulder lets out a string of beeps that is very obviously a scolding.',next:'e'},
  e:{s:'cal',t:'After the Purge I hid for years. Later I found a planet nobody could reach, and I honestly thought about staying. Safe. Alone. Forever.',next:'f'},
  f:{s:'cal',t:'Marriages have their own hiding spot. Routine. Roommate mode. Love doesn’t usually blow up. It just goes quiet and hides.',next:'offer'},
  offer:{s:'cal',t:'So, fifteen times, choose her on purpose. A date, a note, actually paying attention. Like you’re picking her for the first time.',opts:[
   {t:'Fifteen. No more hiding. (Start “The Choice You Keep”)',next:'yes',do:[{quest:['the-choice-you-keep','start']}]},
   {t:'I don’t think we’re hiding.',next:'no'}]},
  yes:{s:'cal',t:'Great. BD says he believes in you. Mostly. He specifically said “mostly.”',end:true},
  no:{s:'cal',t:'Maybe you’re not. Nobody ever thinks they are. I’m around if you want to check.',end:true}}},

 'the-choice-you-keep-2':{who:'cal',bg:'facility-scenes/roaming.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Cal is halfway up a cliff outside the village with no rope. He drops the last few meters, rolls, and pops up beside you grinning.',next:'b'},
  b:{s:'cal',t:'Fifteen! BD logged every single one. He’s weirdly invested in your marriage. Okay, so am I.',next:'c'},
  c:{s:'cal',t:'Which one felt the most like choosing her?',opts:[
   {t:'Asking her out like we were dating again.',next:'date',do:[{flag:'cal-chosen'}]},
   {t:'Doing the chore she hates so she didn’t have to.',next:'chore',do:[{flag:'cal-chosen'}]},
   {t:'Just listening. Like, really listening.',next:'listen',do:[{flag:'cal-chosen'}]}]},
  date:{s:'cal',t:'Yes! She’s not a mission you already finished. She’s someone you still get to chase. That doesn’t expire.',next:'d'},
  chore:{s:'cal',t:'Love with its sleeves rolled up. Merrin never says thanks for that stuff. She just looks at me different for a day.',next:'d'},
  listen:{s:'cal',t:'That’s the hard one. Took me ages with the crew. Greez still says I zone out when he talks about the cantina.',next:'d'},
  d:{s:'cal',t:'Thing I learned on the Mantis. Family isn’t a choice you made once, years ago. You make it again every morning. Even on Greez’s cooking days.',next:'e'},
  e:{s:'cal',t:'So, the long climb. Ten different days. Choose her on every one. Some big, mostly tiny. They all count.',opts:[
   {t:'Ten days. I’ll choose her every one.',next:'f',do:[{quest:['the-choice-you-keep','advance']}]}]},
  f:{s:'cal',t:'Cool. Now climb this with me. Trust your hands. Don’t look down. Just look at the next hold.',next:'g'},
  g:{s:'narrator',t:'You climb. It’s terrifying, and then it isn’t. At the top Cal points: you can see your own roof from here, and the kitchen light on.',end:true,do:[{xp:['marriage',1000]}]}}},

 'the-choice-you-keep-3':{who:'cal',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'It’s the night of the lantern festival. The café terrace glows with paper lights. Cal sits on the rail, BD-1 asleep in his hood.',next:'b'},
  b:{s:'cal',t:'Ten days. You didn’t hide once. Not even the night you were wrecked. You still asked how her day went. I saw.',next:'c'},
  c:{s:'cal',t:'Can I? Just the compass. See, I’m asking this time.',opts:[
   {t:'Go ahead. Tell me what you feel.',next:'read'},
   {t:'Look at you, asking first. Merrin would be proud.',next:'merrin'}]},
  merrin:{s:'cal',t:'Ha. Don’t tell her. She’ll be smug for a month. Okay. Here goes.',next:'read'},
  read:{s:'narrator',t:'Cal holds the compass and shuts his eyes. He’s quiet a long moment, then laughs under his breath.',next:'d'},
  d:{s:'cal',t:'It’s different now. The scared part’s gone. It’s just you choosing her, over and over. Like a song stuck on repeat. A good one.',next:'e'},
  e:{s:'narrator',t:'Across the square, Tavi raises a cup. Steve touches two fingers to his brow. Malfurion and Thrall stand by the fountain, nodding.',next:'f'},
  f:{s:'cal',t:'I made you something. A little kyber shard in a pendant. It only hums when two people hold it at the same time.',next:'g'},
  g:{s:'cal',t:'It’s for her. But say something when you give it. Not a speech. Just the thing you’d choose again.',opts:[
   {t:'I’d choose her. Every single time.',next:'again'},
   {t:'What if I say it wrong?',next:'wrong'}]},
  wrong:{s:'cal',t:'You won’t. She’s not grading you. She’s been waiting to hear it in your voice. Any words work.',next:'again'},
  again:{s:'cal',t:'Then say exactly that. And once a year, on this night, say it again. New words if you’ve got them. Same ones are fine too.',next:'h'},
  h:{s:'narrator',t:'BD-1 wakes, chirps, and projects a tiny flickering heart above the pendant. Cal very loudly pretends he didn’t teach him that.',next:'i'},
  i:{s:'cal',t:'Go find her, {name}. Stop hiding. Keep choosing. That’s it. That’s the whole thing.',end:true,do:[{quest:['the-choice-you-keep','complete']}]}}},

 // ---------------- The Lion and the Cub (Varian, Fatherhood, tier 4: 12 habits, 7 days) ----------------
 'the-lion-and-the-cub-1':{who:'varian',bg:'facility-scenes/stories.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A scarred man with a king’s bearing sits at the Hearth Inn’s long table, polishing a sword that very clearly doesn’t need it.',next:'b'},
  b:{s:'varian',t:'So you’re the one the Dad Council won’t shut up about. The Mandalorian. The Wolverine. The one who sings.',next:'c'},
  c:{s:'varian',t:'They taught you to show up. Fine. I’m here for what happens after you blow it. And you will.',opts:[
   {t:'I already did. Last week.',next:'already'},
   {t:'I try hard not to.',next:'try'},
   {t:'What did you do?',next:'what'}]},
  already:{s:'varian',t:'Good. I mean that. Now you can learn the part that counts. The morning after.',next:'d'},
  try:{s:'varian',t:'So did I. Then came a war, a bad day, my temper. Not falling is good. Knowing how to get back up is better.',next:'d'},
  what:{s:'varian',t:'I was gone for most of my son’s childhood. Then I came back angry, and I shouted at a boy who just wanted his father.',next:'d'},
  d:{s:'varian',t:'Anduin wanted to be a priest, not a warrior. I took it as a failure. His or mine, I couldn’t have told you which.',next:'e'},
  e:{s:'varian',t:'Took me years to say two sentences to him. “I’m sorry.” And “I’m proud of you, exactly as you are.” Years.',next:'offer'},
  offer:{s:'varian',t:'Twelve things for your kids. Time, play, bedtime. And at least once, say both sentences to one of them. Out loud. Not in your head.',opts:[
   {t:'Twelve. Both sentences. (Start “The Lion and the Cub”)',next:'yes',do:[{quest:['the-lion-and-the-cub','start']}]},
   {t:'Apologizing to a kid feels weird.',next:'no'}]},
  yes:{s:'varian',t:'Good man. It’ll feel like losing a fight. It isn’t. It’s the only fight that matters.',end:true},
  no:{s:'varian',t:'Felt weird to me too. Weirder was a son who stopped expecting me to. Think on it.',end:true}}},

 'the-lion-and-the-cub-2':{who:'varian',bg:'facility-scenes/school.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Varian stands at the back of the village schoolroom after hours, staring at one small desk with a look you can’t quite read.',next:'b'},
  b:{s:'varian',t:'Twelve. Your youngest told the whole schoolyard Dad built a fort in the living room. Couch cushions and everything. Well done.',next:'c'},
  c:{s:'varian',t:'Did you say them? Both sentences?',opts:[
   {t:'I said sorry. Got a hug.',next:'sorry',do:[{flag:'varian-sorry'}]},
   {t:'I said I was proud. They went really quiet.',next:'proud',do:[{flag:'varian-sorry'}]},
   {t:'I couldn’t get the words out.',next:'couldnt'}]},
  sorry:{s:'varian',t:'Kids forgive faster than kings do. Don’t take that as the debt being paid. Take it as a second chance.',next:'d'},
  proud:{s:'varian',t:'Quiet means it landed. Anduin didn’t say a word for a whole day after I told him. Then he asked me to spar.',next:'d'},
  couldnt:{s:'varian',t:'They stuck in my throat for years. So write them. A note on the pillow counts. Try again.',next:'d'},
  d:{s:'varian',t:'Now the hard part. One good week doesn’t rebuild trust. I learned that at the gates of Stormwind, with my boy watching me.',next:'e'},
  e:{s:'varian',t:'Seven different days. The same father every morning. Not good-dad Monday and gone-again Thursday. That’s what trust is built from.',opts:[
   {t:'Seven days. The same father, every one.',next:'f',do:[{quest:['the-lion-and-the-cub','advance']}]}]},
  f:{s:'varian',t:'And find the thing your kid loves that you don’t get. Ask them to teach you. Then shut up and learn it.',next:'g'},
  g:{s:'narrator',t:'Varian runs a calloused thumb over the little desk. “He sat here once. I missed it.” Then he squares his shoulders and walks out.',end:true,do:[{xp:['fatherhood',900]}]}}},

 'the-lion-and-the-cub-3':{who:'varian',bg:'facility-scenes/raphael.webp',start:'a',nodes:{
  a:{s:'narrator',t:'In the Training Yard after dark, Varian sits on a bench with two wooden practice swords, one full size and one very small.',next:'b'},
  b:{s:'varian',t:'Seven days. Your kid taught you their favorite game, you lost badly, and you laughed. The whole inn heard.',next:'c'},
  c:{s:'varian',t:'Sit. I carved this for Anduin when he was small. Never once used it with him. I was always on my way out the door.',next:'d'},
  d:{s:'varian',t:'He grew up to heal what I broke. A priest. A better man than me. I got proud of him too late to say it often.',opts:[
   {t:'You told him, though. In the end.',next:'end'},
   {t:'Why give it to me?',next:'why'}]},
  end:{s:'varian',t:'I did. And I’d trade Shalamayne to have said it ten thousand more times. Don’t ration it.',next:'e'},
  why:{s:'varian',t:'Because it never got used. That’s one waste I can still fix. Through you.',next:'e'},
  e:{s:'narrator',t:'He hands you the small sword. A lion is carved on the hilt, its mane worn soft by a thumb that rubbed it on long nights.',next:'f'},
  f:{s:'varian',t:'Take it home. Let them pick the game. Swords, dolls, a book. Doesn’t matter. The lion’s just there to remind you.',next:'g'},
  g:{s:'varian',t:'And every night at bedtime, one of the two sentences. Sorry when you owe it. Proud when you don’t.',opts:[
   {t:'Every night. I’ll say it.',next:'h'},
   {t:'What if I’m proud and sorry at the same time?',next:'both'}]},
  both:{s:'varian',t:'Then say both. A man who can say both is tougher than any gladiator I fought in Dire Maul. And I fought plenty.',next:'h'},
  h:{s:'varian',t:'Go home, {name}. Your cub’s waiting. Don’t make him wait the way I made mine.',end:true,do:[{quest:['the-lion-and-the-cub','complete']}]}}},

 // ---------------- Footprints on the Plains (Baine, Fatherhood, tier 5: 15 habits, 10 days) ----------------
 'footprints-on-the-plains-1':{who:'baine',bg:'facility-scenes/stories.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A tauren chieftain ducks under the Hearth Inn door, horns scraping the lintel. He lowers himself onto the long bench. It creaks, and holds.',next:'b'},
  b:{s:'baine',t:'Peace, friend. I am Baine. My father was Cairne. I walk in his hoofprints every day, and every day they are a little too big.',next:'c'},
  c:{s:'baine',t:'The others taught you to show up, stay calm, stay put, make it right. I have one question left. What will you leave behind?',opts:[
   {t:'I haven’t thought that far ahead.',next:'far'},
   {t:'I want my kids to turn out better than me.',next:'better'},
   {t:'That’s a heavy question for a Tuesday.',next:'heavy'}]},
  far:{s:'baine',t:'Few do, until it is late. My father did. That is why I still know what to do on the hard days.',next:'d'},
  better:{s:'baine',t:'A good wish. But calves do not grow into what we wish. They grow into what we do on ordinary days.',next:'d'},
  heavy:{s:'baine',t:'Ha. Tuesdays are where legacies get made. Nobody builds one at a feast. They only eat at them.',next:'d'},
  d:{s:'baine',t:'My father died in the Mak’gora. Garrosh’s axe, Magatha’s poison on the blade. He lost the fight. He had already won what mattered.',next:'e'},
  e:{s:'baine',t:'Your children will forget most of your speeches. They will remember what your Tuesdays looked like.',next:'offer'},
  offer:{s:'baine',t:'Fifteen things for your children. Presence, play, bedtime, teaching. Pick each one as if they will tell their own children about it.',opts:[
   {t:'Fifteen. Footprints worth following. (Start “Footprints on the Plains”)',next:'yes',do:[{quest:['footprints-on-the-plains','start']}]},
   {t:'I need to sit with this a while.',next:'no'}]},
  yes:{s:'baine',t:'Then walk well. The Earth Mother sees every step. So do they.',end:true},
  no:{s:'baine',t:'Sit, then. The plains are patient. Children are less so. Do not sit too long.',end:true}}},

 'footprints-on-the-plains-2':{who:'baine',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Baine walks the tall grass outside the village, slow and steady, a great totem staff in one hand. Behind him the grass springs back up.',next:'b'},
  b:{s:'baine',t:'Fifteen. I watched your oldest copy the way you lace your boots. They did not know you saw. I did.',next:'c'},
  c:{s:'baine',t:'Which of your ways do you hope they take with them?',opts:[
   {t:'Showing up, even when I’m tired.',next:'tired',do:[{flag:'baine-legacy'}]},
   {t:'Being kind to their mother.',next:'mother',do:[{flag:'baine-legacy'}]},
   {t:'Faith. Praying before the day starts.',next:'faith',do:[{flag:'baine-legacy'}]}]},
  tired:{s:'baine',t:'My father gave me that one. Up before the sun every day, old and aching. I still wake at dawn in Thunder Bluff. I cannot help it.',next:'d'},
  mother:{s:'baine',t:'Wise. Sons learn how to love by watching their fathers. Daughters learn what to expect. Both are watching.',next:'d'},
  faith:{s:'baine',t:'My father knelt to the Earth Mother every dawn. As a calf I thought it was dull. I do not think so now. Yours will come around.',next:'d'},
  d:{s:'baine',t:'Look behind me. The grass stands back up. One walk leaves no trail. The kodo paths in Mulgore were walked every day for a thousand years.',next:'e'},
  e:{s:'baine',t:'Ten different days. Walk the same path for them each time. Long enough that the grass gives up.',opts:[
   {t:'Ten days. A path, not a footprint.',next:'f',do:[{quest:['footprints-on-the-plains','advance']}]}]},
  f:{s:'baine',t:'Walk with me to the hill and back. Do not talk. Just walk.',next:'g'},
  g:{s:'narrator',t:'You walk beside him. On the way back you notice your steps have fallen exactly into his. Baine notices too, and smiles.',end:true,do:[{xp:['fatherhood',1000]}]}}},

 'footprints-on-the-plains-3':{who:'baine',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At sunset on the open plains, a tall wooden totem stands freshly raised. Din, Logan, Quill and Varian sit around a fire. Baine waits by the totem.',next:'b'},
  b:{s:'baine',t:'Ten days. The path is real now. Even the grass has given up. Come. The council is here.',next:'c'},
  c:{s:'quill',t:'Full Dad Council! I made a playlist. Nobody will let me put it on.',next:'d'},
  d:{s:'baine',t:'Among my people, when a father has walked the path, his children are carved into the totem. So anyone passing knows whose they are.',next:'e'},
  e:{s:'narrator',t:'Already carved into the wood: a horned signet, a dog tag, a cassette, a small lion. Your teachers’ marks. Below them the wood is bare.',next:'f'},
  f:{s:'baine',t:'Take the knife. Carve a mark for each of your children. Whatever shape is theirs.',opts:[
   {t:'Carve slowly, one child at a time.',next:'slow'},
   {t:'Ask the others how they chose their marks.',next:'ask'}]},
  ask:{s:'din',t:'You don’t choose it. You already know. Carve.',next:'slow'},
  slow:{s:'narrator',t:'You carve one mark for each child. It takes a long time. Nobody hurries you. When you look up, Logan is staring off, jaw tight.',next:'g'},
  g:{s:'baine',t:'This was my father’s. He carved it for me with his own hands. I carved another for my son. This one is for yours.',next:'h'},
  h:{s:'narrator',t:'He sets a palm-sized totem in your hands. It is warm, and smells of cedar and smoke and very old summers.',next:'i'},
  i:{s:'baine',t:'Once a year, sit with each child and carve one new notch together. Tell them what you saw them become that year.',opts:[
   {t:'Every year. Until they carve for their own kids.',next:'j'},
   {t:'What if someday I’m not there to do it?',next:'gone'}]},
  gone:{s:'baine',t:'Then they will carve it themselves and hear your voice in every stroke. My father taught me that by leaving.',next:'j'},
  j:{s:'varian',t:'To the path. And the cubs who’ll walk it. Someone get Quill a drink before he finds a lute.',next:'k'},
  k:{s:'baine',t:'Your footprints are worth following, {name}. Go home and keep walking. They are right behind you.',end:true,do:[{quest:['footprints-on-the-plains','complete']}]}}},
};
