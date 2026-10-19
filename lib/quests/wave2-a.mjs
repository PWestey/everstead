// Second-wave quests for Faith (Uther, Saradomin), Marriage (Malfurion, Thrall, Cal) and Fatherhood (Varian, Baine).
// Format: see lib/dialogue.mjs (iron-body trees) and lib/quests.mjs.
// Tier counts: 3 = 8 habits / 5 days, 4 = 12 / 7, 5 = 15 / 10.

/** @type {Record<string,any>} */
export const QUESTS={
 'the-silver-hand':{name:'The Silver Hand',area:'faith',giver:'uther',tier:4,
  blurb:'Uther the Lightbringer has watched you gather keepsakes at the Chapel. He wants to know if you will carry the Light when it is heavy.',
  say:['Talk to Uther at the Chapel.','Report back to Uther.','Meet Uther at the Chapel altar before dawn.']},
 'the-star-of-saradomin':{name:'The Star of Saradomin',area:'faith',giver:'saradomin',tier:5,
  blurb:'The god of order has come to the Chapel himself. He asks nothing great of you, only that you be faithful.',
  say:['Answer Saradomin’s summons at the Chapel.','Report back to Saradomin.','Climb the Chapel bell tower at dawn, where Saradomin waits.']},
 'waking-from-the-dream':{name:'Waking from the Dream',area:'marriage',giver:'malfurion',tier:3,
  blurb:'Malfurion slept ten thousand years while Tyrande kept watch. He has seen you sitting beside your wife without being there.',
  say:['Talk to Malfurion at the Rose Café.','Report back to Malfurion.','Meet Malfurion and Tyrande in the moonlit grove beyond the village.']},
 'setting-down-the-mantle':{name:'Setting Down the Mantle',area:'marriage',giver:'thrall',tier:4,
  blurb:'Thrall once carried a whole people alone, until Aggra made him set it down. He sees you carrying everything, and telling her nothing.',
  say:['Talk to Thrall at the Rose Café.','Report back to Thrall.','Meet Thrall at the fire circle on the northern road.']},
 'the-choice-you-keep':{name:'The Choice You Keep',area:'marriage',giver:'cal',tier:5,
  blurb:'Cal Kestis can read the echoes left on things. He has touched the keepsakes in your pocket, and he has one question about your wife.',
  say:['Talk to Cal at the Rose Café.','Report back to Cal.','Meet Cal on the café terrace on the night of the lantern festival.']},
 'the-lion-and-the-cub':{name:'The Lion and the Cub',area:'fatherhood',giver:'varian',tier:4,
  blurb:'Varian Wrynn nearly lost his son to his own temper and absence. He heard the Dad Council at the Hearth Inn, and he has a harder lesson to add.',
  say:['Talk to Varian at the Hearth Inn.','Report back to Varian.','Meet Varian in the Training Yard after dark.']},
 'footprints-on-the-plains':{name:'Footprints on the Plains',area:'fatherhood',giver:'baine',tier:5,
  blurb:'Baine Bloodhoof walks in his father’s footprints every day. He asks what footprints you are leaving for your children.',
  say:['Talk to Baine at the Hearth Inn.','Report back to Baine.','Meet Baine and the Dad Council on the open plains at sunset.']},
};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- The Silver Hand (Uther, Faith, tier 4: 12 habits, 7 days) ----------------
 'the-silver-hand-1':{who:'uther',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A man in heavy plate kneels before the Chapel altar, a great warhammer laid flat beside him. When he rises, the floor seems to brace for it.',next:'b'},
  b:{s:'uther',t:'Stone, rosary, a panther’s bead. Three good men have taught you to pray. I am told you listen well.',next:'c'},
  c:{s:'uther',t:'So I will ask what they were too kind to ask. What do you do on the mornings the Light feels far away?',opts:[
   {t:'Honestly? I skip it.',next:'skip'},
   {t:'I pray anyway, but it feels hollow.',next:'hollow'},
   {t:'It never feels far away.',next:'never'}]},
  skip:{s:'uther',t:'Honest. Good. A paladin who skips his vigil when he is tired is not a paladin. He is a man in a costume.',next:'d'},
  hollow:{s:'uther',t:'Hollow is not failure. A hollow bell still rings. You are closer than you think.',next:'d'},
  never:{s:'uther',t:'Then you are either a saint or young in it. I have known very few saints.',next:'d'},
  d:{s:'uther',t:'The Light is not a feeling, son. It is a duty. You carry it up the hill whether the sun is out or not.',next:'e'},
  e:{s:'uther',t:'I trained a prince once. Gifted. Proud. He wanted the Light to make him great, not faithful. I watched him fall.',opts:[
   {t:'What happened to him?',next:'arthas'},
   {t:'Why tell me this?',next:'why'}]},
  arthas:{s:'uther',t:'He burned a city to win a war, and lost himself. I will not speak his name in a chapel. Learn from him so I need not.',next:'offer'},
  why:{s:'uther',t:'Because you are doing well. That is exactly when pride walks in and sits down beside you.',next:'offer'},
  offer:{s:'uther',t:'Twelve acts of faith. Prayer, scripture, thanks. And at least three of them for someone else, not yourself. Then report.',opts:[
   {t:'Twelve. I’ll carry it. (Start “The Silver Hand”)',next:'yes',do:[{quest:['the-silver-hand','start']}]},
   {t:'I’m not ready for a paladin’s vigil.',next:'no'}]},
  yes:{s:'uther',t:'Then go with the Light. And mind your pride on the way out. It trips more men than stairs.',end:true},
  no:{s:'uther',t:'Nobody is. The vigil begins anyway. I will be here when you are.',end:true}}},

 'the-silver-hand-2':{who:'uther',bg:'ui-scenes/Bg_Village_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Uther is helping a farmer lift a broken cart out of the mud, plate armour and all. He does not stop when you arrive.',next:'b'},
  b:{s:'uther',t:'Twelve. Grab the other side. A paladin’s report is better given with his hands busy.',next:'c'},
  c:{s:'narrator',t:'You heave together. The cart comes free with a wet groan. The farmer blesses you both and hurries off.',next:'d'},
  d:{s:'uther',t:'Who did you pray for, when you prayed for someone else?',opts:[
   {t:'My wife and kids.',next:'family',do:[{flag:'uther-intercede'}]},
   {t:'Someone I don’t get along with.',next:'enemy',do:[{flag:'uther-intercede'}]},
   {t:'I mostly prayed for myself, if I’m honest.',next:'self'}]},
  family:{s:'uther',t:'Good. A man’s first parish is his own table. Guard it on your knees before you guard it with your fists.',next:'e'},
  enemy:{s:'uther',t:'Ha. That is the hardest prayer there is. I prayed for a few orcs once. It changed me more than it changed them.',next:'e'},
  self:{s:'uther',t:'Then you know where your eyes are. Turn them outward this next stretch. The Light grows where it is given away.',next:'e'},
  e:{s:'uther',t:'Now the vigil proper. Seven different days. Not seven prayers in one fit of zeal. Seven mornings, one after another.',next:'f'},
  f:{s:'uther',t:'The Silver Hand did not hold back the dark with one great charge. We held it with a watch kept every night.',opts:[
   {t:'Seven days. I’ll keep the watch.',next:'g',do:[{quest:['the-silver-hand','advance']}]}]},
  g:{s:'uther',t:'Good. Now help me with this wheel. Faith with no sweat in it is just talk.',next:'h'},
  h:{s:'narrator',t:'You fix the wheel together in the mud. Uther hums an old hymn under his breath, badly, and does not care who hears.',end:true,do:[{xp:['faith',900]}]}}},

 'the-silver-hand-3':{who:'uther',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Before dawn the Chapel is cold and dark. Uther kneels at the altar with his hammer upright before him, head bowed against the haft.',next:'b'},
  b:{s:'uther',t:'Seven days. You kept the watch. I heard about the morning you were sick and knelt anyway. So did the Light.',next:'c'},
  c:{s:'uther',t:'Kneel beside me. A vigil ends the way it begins. On your knees, with nothing to prove.',next:'d'},
  d:{s:'narrator',t:'You kneel. The stone is cold through your knees. Uther says a short prayer for your house, by name, one person at a time.',next:'e'},
  e:{s:'uther',t:'When I founded the Order, every paladin received one of these. A silver hand. Open, not a fist.',next:'f'},
  f:{s:'narrator',t:'He presses a small silver medallion into your palm, shaped like an open hand. It is worn at the fingertips.',opts:[
   {t:'Why open, and not a fist?',next:'open'},
   {t:'I’m no paladin, Uther.',next:'nopaladin'}]},
  open:{s:'uther',t:'A fist protects. An open hand serves, and receives. A man of faith must know how to do both.',next:'g'},
  nopaladin:{s:'uther',t:'A paladin is a man who keeps a vow when it costs him. You have done that seven days running. Argue with me later.',next:'g'},
  g:{s:'uther',t:'Hang it with the others. Each morning, open your hand on your chest and say: “I will carry it today.” Then do.',next:'h'},
  h:{s:'narrator',t:'You thread the silver hand onto the chain beside the stone, the beads and the panther. Uther lays a heavy gauntlet on your shoulder.',next:'i'},
  i:{s:'uther',t:'Rise, {name}. Faithful, not great. Carry the Light. The rest is up to it.',end:true,do:[{quest:['the-silver-hand','complete']}]}}},

 // ---------------- The Star of Saradomin (Saradomin, Faith, tier 5: 15 habits, 10 days) ----------------
 'the-star-of-saradomin-1':{who:'saradomin',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The Chapel bell rings on its own. When you step inside, every candle is lit and a tall figure in white and gold stands where the altar light falls.',next:'b'},
  b:{s:'saradomin',t:'Be at peace. I am Saradomin. I have watched this little chapel for a long time. Lately, I have watched you.',next:'c'},
  c:{s:'player',t:'A god. In Everstead. Watching me.',next:'d'},
  d:{s:'saradomin',t:'You seem surprised. Gods are drawn to faithfulness the way moths are drawn to lamps. Yours has been burning steadily.',opts:[
   {t:'Why would a god care about my small prayers?',next:'small'},
   {t:'I’m not sure I’m worth a god’s time.',next:'worth'},
   {t:'What do you want from me?',next:'want'}]},
  small:{s:'saradomin',t:'Small things done in order hold up the world. Chaos is loud and grand. Order is quiet, daily and very small.',next:'e'},
  worth:{s:'saradomin',t:'Worth is not my measure. Faithfulness is. A great man who wavers serves me less than a plain one who returns.',next:'e'},
  want:{s:'saradomin',t:'Very little, and everything. Not greatness. Faithfulness. Day after day, until it is simply who you are.',next:'e'},
  e:{s:'saradomin',t:'Obi-Wan taught you stillness. Murdock, the dark. T’Challa, your fathers. Uther, duty. They were the steps. I am the stair’s end.',next:'f'},
  f:{s:'saradomin',t:'There is a war between order and chaos in every man. In you it is fought each morning, between prayer and the scroll of a screen.',next:'offer'},
  offer:{s:'saradomin',t:'Fifteen acts of faith. Pray, read, give thanks, serve. Not as a burst. As a pattern I can see from very far away.',opts:[
   {t:'Fifteen. Let it become who I am. (Start “The Star of Saradomin”)',next:'yes',do:[{quest:['the-star-of-saradomin','start']}]},
   {t:'This is a lot. Give me time.',next:'no'}]},
  yes:{s:'saradomin',t:'So be it. Walk in order, and you will find you are never walking alone.',end:true},
  no:{s:'saradomin',t:'Time I have in abundance. Take what you need. The candles will stay lit.',end:true}}},

 'the-star-of-saradomin-2':{who:'saradomin',bg:'facility-scenes/museum.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Saradomin waits in a quiet hall of old relics, each one under glass. He is looking at a cracked shield as if he remembers the arm that held it.',next:'b'},
  b:{s:'saradomin',t:'Fifteen. I saw each one. A prayer in a parked cart. Thanks muttered over the dishes. They all count. They all reach me.',next:'c'},
  c:{s:'saradomin',t:'Tell me. Where is chaos winning in you still?',opts:[
   {t:'My mornings. The phone gets there before God does.',next:'phone',do:[{flag:'saradomin-confess'}]},
   {t:'My temper, when I’m tired.',next:'temper',do:[{flag:'saradomin-confess'}]},
   {t:'I think I’m doing pretty well, actually.',next:'well'}]},
  phone:{s:'saradomin',t:'Then put the order back. First word to Me, then the world. Even one sentence moves the line of battle.',next:'d'},
  temper:{s:'saradomin',t:'Tired men are where my brother Zamorak recruits. Pray before you walk in the door. A breath, a name, a thanks.',next:'d'},
  well:{s:'saradomin',t:'You are. And Uther warned you what follows that thought. I will not repeat him. He would be insufferable about it.',next:'d'},
  d:{s:'saradomin',t:'Every shield here belonged to a knight who was not great. Only faithful. They held the line for a thousand years.',next:'e'},
  e:{s:'saradomin',t:'Now the last trial, and the longest. Ten different days. Not perfect days. Faithful ones. That is how a habit becomes a vow.',opts:[
   {t:'Ten days. I’ll hold the line.',next:'f',do:[{quest:['the-star-of-saradomin','advance']}]}]},
  f:{s:'saradomin',t:'Then stand here a moment, among the faithful who came before you. They are glad of the company.',next:'g'},
  g:{s:'narrator',t:'The hall is silent. For a second every relic glints at once, as though a thousand old knights had nodded.',end:true,do:[{xp:['faith',1000]}]}}},

 'the-star-of-saradomin-3':{who:'saradomin',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At dawn you climb the Chapel bell tower. Saradomin stands at the top, the whole valley gold below him, the bell rope in his hand.',next:'b'},
  b:{s:'saradomin',t:'Ten days. Faithful on the good ones and the grey ones. I watched the pattern hold from very far away. It held.',next:'c'},
  c:{s:'narrator',t:'Below, in the square, small figures have gathered. Obi-Wan. Matt with his cane. T’Challa. Uther, hammer on his shoulder. All looking up.',next:'d'},
  d:{s:'saradomin',t:'They came to see you finish. Teachers like to see the thing they started become a thing that lasts.',next:'e'},
  e:{s:'saradomin',t:'Show me what you carry.',opts:[
   {t:'Hold up the chain: stone, rosary, panther, silver hand.',next:'chain'},
   {t:'Just my two hands. That’s all I have.',next:'hands'}]},
  chain:{s:'saradomin',t:'Stillness. The dark. Your fathers. Duty. Four teachers on one chain. There is room for one more thing.',next:'star'},
  hands:{s:'saradomin',t:'Hands are what faith was always made of. The keepsakes are only reminders. Still, there is one more for you.',next:'star'},
  star:{s:'narrator',t:'He opens his hand. A small eight-pointed star of blue and gold rests there, warm as a coal, and humming faintly like the bell.',next:'f'},
  f:{s:'saradomin',t:'My star. Given only to those who have proven faithful, not great. Hang it last. It holds the others in order.',next:'g'},
  g:{s:'saradomin',t:'And now the ritual. Every morning, before any screen, any task, any voice: one prayer. Then the day may have you.',opts:[
   {t:'Every morning. First word to You.',next:'ring'},
   {t:'What if I miss a morning?',next:'miss'}]},
  miss:{s:'saradomin',t:'Then the next morning, you begin again. Order is not never falling. It is always returning. Obi-Wan told you that first.',next:'ring'},
  ring:{s:'saradomin',t:'Take the rope. Let the valley hear that one more man has chosen order.',next:'h'},
  h:{s:'narrator',t:'You pull. The great bell rolls out over Everstead. Down in the square, four men raise a hand. Somewhere a child laughs.',next:'i'},
  i:{s:'saradomin',t:'Faithful, {name}. That is the highest thing I call anyone. Go in order, and go in peace.',end:true,do:[{quest:['the-star-of-saradomin','complete']}]}}},

 // ---------------- Waking from the Dream (Malfurion, Marriage, tier 3: 8 habits, 5 days) ----------------
 'waking-from-the-dream-1':{who:'malfurion',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'An enormous night elf with antlers and a long green beard folds himself into a café chair far too small for him. Vines have begun curling up its legs.',next:'b'},
  b:{s:'malfurion',t:'Forgive the vines. They follow me. Sit. Last night I watched you at that window table with your wife.',next:'c'},
  c:{s:'malfurion',t:'You were across from her for an hour. I do not think you were there for more than a minute of it.',opts:[
   {t:'Work was on my mind.',next:'work'},
   {t:'I was on my phone a bit, sure.',next:'phone'},
   {t:'We were fine. It was a quiet night.',next:'fine'}]},
  work:{s:'malfurion',t:'Mine was the fate of the world. I told myself it mattered more. It did not make the empty chair any warmer for her.',next:'d'},
  phone:{s:'malfurion',t:'A little glowing dream in your hand. I know dreams. I slept in one for ten thousand years.',next:'d'},
  fine:{s:'malfurion',t:'Perhaps. But quiet and absent look the same from the outside. Only she knows which it was. Ask her.',next:'d'},
  d:{s:'malfurion',t:'I left Tyrande to keep watch alone. Century after century. I always meant to come back soon. Soon is the cruelest word I know.',next:'e'},
  e:{s:'malfurion',t:'She waited. She should not have had to. Your wife should not have to either, even for an evening.',next:'offer'},
  offer:{s:'malfurion',t:'Eight acts of presence. Time with her, attention, a date, phone face down. Be awake in the room. Then come tell me.',opts:[
   {t:'Eight. I’ll wake up. (Start “Waking from the Dream”)',next:'yes',do:[{quest:['waking-from-the-dream','start']}]},
   {t:'I’m too stretched right now.',next:'no'}]},
  yes:{s:'malfurion',t:'Good. Start tonight. The grove can wait. She should not.',end:true},
  no:{s:'malfurion',t:'That is what I said, the first thousand years. I will be here. I am, unfortunately, very patient.',end:true}}},

 'waking-from-the-dream-2':{who:'malfurion',bg:'facility-scenes/apothecary.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Malfurion is in the apothecary garden, coaxing a wilted rose upright with two fingers and a low, patient hum.',next:'b'},
  b:{s:'malfurion',t:'Eight. I felt it from here. The roses outside the café opened a little wider this week. They notice these things.',next:'c'},
  c:{s:'malfurion',t:'What changed, when you were truly in the room with her?',opts:[
   {t:'She talked more. Things I didn’t know.',next:'talked',do:[{flag:'malfurion-awake'}]},
   {t:'She asked if something was wrong.',next:'wrong'},
   {t:'It was awkward at first.',next:'awkward'}]},
  talked:{s:'malfurion',t:'She was always talking. You were only now awake enough to hear it. There is a whole world in her you have not visited.',next:'d'},
  wrong:{s:'malfurion',t:'Ha. When I woke, Tyrande asked if I was ill. Attention is a shock to the system. Keep at it until it isn’t.',next:'d'},
  awkward:{s:'malfurion',t:'Of course. Waking is stiff work. Every limb remembers sleeping. Stretch anyway.',next:'d'},
  d:{s:'malfurion',t:'Now the harder part. Not eight moments, but five different days. A druid does not water a tree once and call it a forest.',next:'e'},
  e:{s:'malfurion',t:'Be present with her on five separate days. Small is fine. A walk. A real question. Ten minutes with nothing in your hands.',opts:[
   {t:'Five days. Awake every one.',next:'f',do:[{quest:['waking-from-the-dream','advance']}]}]},
  f:{s:'malfurion',t:'Here. Hold this rose. Tell me what you see.',next:'g'},
  g:{s:'narrator',t:'You look properly. Every petal is a slightly different red. Malfurion smiles. “That. Look at her like that.”',end:true,do:[{xp:['marriage',800]}]}}},

 'waking-from-the-dream-3':{who:'malfurion',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'In a moonlit grove beyond the village, Malfurion sits on a mossy stone. A tall woman with silver eyes stands at his shoulder, bow across her back.',next:'b'},
  b:{s:'malfurion',t:'Five days. Awake for every one. You have learned in weeks what took me ten thousand years.',next:'c'},
  c:{s:'tyrande',t:'He exaggerates. It took him ten thousand and three. I counted.',next:'d'},
  d:{s:'narrator',t:'Malfurion looks at her the way a man looks at the sun after a long winter. She lets her hand rest on his antler, just for a moment.',next:'e'},
  e:{s:'tyrande',t:'Your wife does not need you to be a hero. She needs you to be here. That is the whole of it.',opts:[
   {t:'How did you keep waiting all that time?',next:'wait'},
   {t:'How do I make up for the times I wasn’t?',next:'makeup'}]},
  wait:{s:'tyrande',t:'Every night I chose him again, under the moon. Love is not a feeling you wait out. It is a vow you renew.',next:'f'},
  makeup:{s:'tyrande',t:'You do not repay it in one grand night. You repay it the way he did. Present. Again. And again.',next:'f'},
  f:{s:'malfurion',t:'Then take this. An acorn from the oldest tree I ever tended. It has waited a very long time for the right ground.',next:'g'},
  g:{s:'malfurion',t:'Plant it with her. Both your hands in the soil. Water it together on the days you choose to be present.',next:'h'},
  h:{s:'narrator',t:'The acorn is warm and faintly green, as if something inside is already stretching. Tyrande folds your fingers over it.',next:'i'},
  i:{s:'malfurion',t:'Stay awake, {name}. The dream is lovely. She is lovelier. Go home.',end:true,do:[{quest:['waking-from-the-dream','complete']}]}}},

 // ---------------- Setting Down the Mantle (Thrall, Marriage, tier 4: 12 habits, 7 days) ----------------
 'setting-down-the-mantle-1':{who:'thrall',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A broad green orc in a plain shaman’s robe sits by the café hearth, a heavy hammer leaned against the wall behind him like a retired friend.',next:'b'},
  b:{s:'thrall',t:'Lok’tar, friend. Sit. You carry yourself like a warchief. Shoulders up. Jaw set. Eyes on the next fire.',next:'c'},
  c:{s:'thrall',t:'Tell me. When the day crushes you, does your wife know?',opts:[
   {t:'No. She has enough on her plate.',next:'protect'},
   {t:'She guesses. I don’t say much.',next:'guess'},
   {t:'I tell her everything.',next:'everything'}]},
  protect:{s:'thrall',t:'I said those exact words about Aggra. She hit me. Not hard. Hard enough.',next:'d'},
  guess:{s:'thrall',t:'Then she is carrying your silence as well as her own load. Silence is heavier than the truth. Ask any shaman.',next:'d'},
  everything:{s:'thrall',t:'Then you are wiser than I was. But tell me again in a week, when you have watched yourself closely.',next:'d'},
  d:{s:'thrall',t:'I led the Horde. I held the world together with my hands. And the elements would not answer me, because I was alone inside it.',next:'e'},
  e:{s:'thrall',t:'Aggra told me: you are not the Warchief here. You are Go’el. Set it down. Only then did I find my footing.',next:'offer'},
  offer:{s:'thrall',t:'Twelve deeds for your marriage. Time, attention, dates. And at least once, tell her a weight you have been carrying alone.',opts:[
   {t:'Twelve. I’ll set it down. (Start “Setting Down the Mantle”)',next:'yes',do:[{quest:['setting-down-the-mantle','start']}]},
   {t:'I’m not ready to put that on her.',next:'no'}]},
  yes:{s:'thrall',t:'Good. It will feel like weakness. It is the opposite. Go, and walk lighter.',end:true},
  no:{s:'thrall',t:'You are not putting it on her. You are letting her stand beside you under it. Think on that.',end:true}}},

 'setting-down-the-mantle-2':{who:'thrall',bg:'facility-scenes/northern.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Thrall waits on the north road, sitting cross-legged in the wind, eyes closed, a hand flat on the earth.',next:'b'},
  b:{s:'thrall',t:'Twelve. The wind told me you came. The wind is a terrible gossip. Sit.',next:'c'},
  c:{s:'thrall',t:'The weight you told her. How did she take it?',opts:[
   {t:'She held my hand and didn’t say anything.',next:'held',do:[{flag:'thrall-shared'}]},
   {t:'She was hurt I hadn’t told her sooner.',next:'hurt',do:[{flag:'thrall-shared'}]},
   {t:'I didn’t manage it yet.',next:'notyet'}]},
  held:{s:'thrall',t:'That is a council of two. The best one I ever sat on. Fewer speeches than the Horde, too.',next:'d'},
  hurt:{s:'thrall',t:'Aggra was the same. Hurt is what love feels like when it learns it was locked out. Let her in, and it heals.',next:'d'},
  notyet:{s:'thrall',t:'Then that is your work this next stretch. Not a speech. One true sentence. She will help with the rest.',next:'d'},
  d:{s:'thrall',t:'Now. Leading a home is harder than leading a horde, because there is no end of the campaign. Only the next day.',next:'e'},
  e:{s:'thrall',t:'Seven different days. Show up for her on each. Ask about her day like it is a report from the front. Listen to the whole thing.',opts:[
   {t:'Seven days. A council every one.',next:'f',do:[{quest:['setting-down-the-mantle','advance']}]}]},
  f:{s:'thrall',t:'Put your hand on the earth. Feel that? It carries everything, and it does not complain. It also does not do it alone.',next:'g'},
  g:{s:'narrator',t:'Under your palm the ground is steady and faintly warm. Thrall nods once, as if the earth just agreed with him.',end:true,do:[{xp:['marriage',900]}]}}},

 'setting-down-the-mantle-3':{who:'thrall',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At the fire circle on the northern road, Thrall feeds a small fire with sweetgrass. Two flat river stones sit on a blanket beside him.',next:'b'},
  b:{s:'thrall',t:'Seven days. A council every one. I hear she laughed at your report on Thursday. A warchief never gets that.',next:'c'},
  c:{s:'thrall',t:'When Aggra and I were joined, the elder gave us two stones from the river in Nagrand. Smooth from the same water.',next:'d'},
  d:{s:'thrall',t:'These came from that river. I asked the water for them. It agreed, which it does not always.',opts:[
   {t:'Why two stones?',next:'two'},
   {t:'What do we do with them?',next:'do'}]},
  two:{s:'thrall',t:'Because a marriage is two weights, side by side. Not one man holding both. The river made them smooth by carrying them together.',next:'ritual'},
  do:{s:'thrall',t:'That is the good part. Listen.',next:'ritual'},
  ritual:{s:'thrall',t:'Once a week, sit with her. Each of you hold a stone, and name one thing you are carrying. Then trade stones.',next:'e'},
  e:{s:'thrall',t:'You will not fix it. That is not the point. The point is that neither of you carries it alone.',next:'f'},
  f:{s:'narrator',t:'He places the stones in your hands. They click softly together, like they know each other.',opts:[
   {t:'Thank you, Thrall. Truly.',next:'thanks'},
   {t:'Call me Go’el’s student, then.',next:'goel'}]},
  thanks:{s:'thrall',t:'Thank her. She will be the one to make it work. I only carried the stones up the road.',next:'g'},
  goel:{s:'thrall',t:'Ha. Then here is your last lesson from Go’el. Set down the mantle at the front door. Every night.',next:'g'},
  g:{s:'thrall',t:'Walk lighter, {name}. And walk beside her. Lok’tar.',end:true,do:[{quest:['setting-down-the-mantle','complete']}]}}},

 // ---------------- The Choice You Keep (Cal, Marriage, tier 5: 15 habits, 10 days) ----------------
 'the-choice-you-keep-1':{who:'cal',bg:'facility-scenes/banquets.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A young man in a patched poncho sits at the café bar, a little round droid perched on his shoulder. He is holding Steve’s compass. Your compass.',next:'b'},
  b:{s:'cal',t:'Sorry. You left it on the table. I touched it before I thought. I can feel echoes on things. What people felt holding them.',next:'c'},
  c:{s:'cal',t:'This one’s loud. A soldier who was late. And you, looking at her picture before you opened your front door.',opts:[
   {t:'That’s a little invasive, Cal.',next:'invasive'},
   {t:'What else did you feel?',next:'else'},
   {t:'Give that back.',next:'back'}]},
  invasive:{s:'cal',t:'Yeah. Merrin says the same. I’m working on asking first. Here.',next:'d'},
  else:{s:'cal',t:'Tavi’s note habit. An acorn in your coat. Two river stones. You’ve had good teachers. And you’re still a little scared.',next:'d'},
  back:{s:'cal',t:'Fair. Sorry. Here.',next:'d'},
  d:{s:'narrator',t:'He hands the compass back. The droid on his shoulder chirps something that sounds suspiciously like a scolding.',next:'e'},
  e:{s:'cal',t:'I spent years hiding. I found a place nobody could reach me, and I thought about staying there forever. Safe. Alone.',next:'f'},
  f:{s:'cal',t:'Marriages have a hiding place too. Routine. Being roommates. Love doesn’t die loud. It goes quiet and hides.',next:'offer'},
  offer:{s:'cal',t:'Fifteen times, choose her on purpose. Dates, time, attention, a note. Like you’re picking her for the first time.',opts:[
   {t:'Fifteen. No more hiding. (Start “The Choice You Keep”)',next:'yes',do:[{quest:['the-choice-you-keep','start']}]},
   {t:'I don’t think we’re hiding.',next:'no'}]},
  yes:{s:'cal',t:'Great. BD says he believes in you. Mostly. He says “mostly.”',end:true},
  no:{s:'cal',t:'Maybe you’re not. Nobody thinks they are. I’ll be here when you want to check.',end:true}}},

 'the-choice-you-keep-2':{who:'cal',bg:'facility-scenes/roaming.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Cal is halfway up a cliff outside the village, climbing with no rope. He drops the last few meters and lands beside you, grinning.',next:'b'},
  b:{s:'cal',t:'Fifteen! BD logged every one. He’s weirdly invested in your marriage. So am I.',next:'c'},
  c:{s:'cal',t:'Which one felt most like choosing her?',opts:[
   {t:'Asking her out like we were dating again.',next:'date',do:[{flag:'cal-chosen'}]},
   {t:'Doing the thing she hates so she didn’t have to.',next:'chore',do:[{flag:'cal-chosen'}]},
   {t:'Just listening. Really listening.',next:'listen',do:[{flag:'cal-chosen'}]}]},
  date:{s:'cal',t:'Yes. She’s not a done mission. She’s someone you still get to pursue. That never stops being true.',next:'d'},
  chore:{s:'cal',t:'That’s love with its sleeves rolled up. Merrin’s never said thank you for that stuff. She just looks at me different.',next:'d'},
  listen:{s:'cal',t:'Hardest one. Took me years with my crew. Listening is how you tell someone they’re not alone.',next:'d'},
  d:{s:'cal',t:'Here’s the thing I learned on the Mantis. Family isn’t one choice you made back then. It’s one you make every morning.',next:'e'},
  e:{s:'cal',t:'So, the long climb. Ten different days. Choose her on each one. Some days big. Most days tiny. Every one counts.',opts:[
   {t:'Ten days. I’ll choose her every one.',next:'f',do:[{quest:['the-choice-you-keep','advance']}]}]},
  f:{s:'cal',t:'Cool. Now climb this with me. Trust your hands. Don’t look down, look at the next hold.',next:'g'},
  g:{s:'narrator',t:'You climb. It is terrifying and then it isn’t. At the top, Cal points: from here you can see your own roof, and the light on in the kitchen.',end:true,do:[{xp:['marriage',1000]}]}}},

 'the-choice-you-keep-3':{who:'cal',bg:'facility-scenes/fountain.webp',start:'a',nodes:{
  a:{s:'narrator',t:'It is the night of the lantern festival. The café terrace glows with paper lights. Cal sits on the rail, BD-1 dozing in his hood.',next:'b'},
  b:{s:'cal',t:'Ten days. You didn’t hide once. Not even the night you were exhausted. You still asked how her day went.',next:'c'},
  c:{s:'cal',t:'Can I? Just the compass.',opts:[
   {t:'Go ahead. Tell me what you feel.',next:'read'},
   {t:'You’re asking first. Merrin would be proud.',next:'merrin'}]},
  merrin:{s:'cal',t:'Ha. Don’t tell her. She’ll get smug. Okay, here goes.',next:'read'},
  read:{s:'narrator',t:'Cal holds the compass and closes his eyes. He is quiet a long moment, then laughs softly.',next:'d'},
  d:{s:'cal',t:'It’s different now. The fear’s gone. It’s just you, choosing her. Over and over. Like a song on repeat.',next:'e'},
  e:{s:'narrator',t:'Across the square, Tavi raises a cup. Steve lifts two fingers to his brow. Malfurion and Thrall stand together by the fountain, nodding.',next:'f'},
  f:{s:'cal',t:'I made you something. A tiny kyber shard, set in a pendant. It hums when two people hold it at once. Only then.',next:'g'},
  g:{s:'cal',t:'It’s for her. Give it with words, though. Not a speech. Just tell her the thing you would choose again.',opts:[
   {t:'I’d choose her. Every single time.',next:'again'},
   {t:'What if I get the words wrong?',next:'wrong'}]},
  wrong:{s:'cal',t:'You won’t. She’s not grading you. She’s been waiting to hear it in your voice. Any words will do.',next:'again'},
  again:{s:'cal',t:'Then say that. Exactly that. And make it a ritual: once a year, on this night, say it again. New words if you have them.',next:'h'},
  h:{s:'narrator',t:'BD-1 wakes, chirps, and projects a tiny flickering heart into the air above the pendant. Cal pretends not to have taught him that.',next:'i'},
  i:{s:'cal',t:'Go find her, {name}. Stop hiding. Keep choosing. That’s the whole thing.',end:true,do:[{quest:['the-choice-you-keep','complete']}]}}},

 // ---------------- The Lion and the Cub (Varian, Fatherhood, tier 4: 12 habits, 7 days) ----------------
 'the-lion-and-the-cub-1':{who:'varian',bg:'facility-scenes/stories.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A scarred man with a king’s bearing sits at the long table in the Hearth Inn, cleaning a sword he clearly does not need to clean.',next:'b'},
  b:{s:'varian',t:'So you’re the one the Dad Council keeps talking about. The Mandalorian. The Wolverine. The singing pirate.',next:'c'},
  c:{s:'varian',t:'They taught you to show up. Good. I’m here to talk about what happens after you blow it. Because you will.',opts:[
   {t:'I already have. Last week.',next:'already'},
   {t:'I try hard not to.',next:'try'},
   {t:'What did you do?',next:'what'}]},
  already:{s:'varian',t:'Good. I mean it. Now you can learn the part that matters. What you do the morning after.',next:'d'},
  try:{s:'varian',t:'So did I. Then a war, a bad day, a temper. Trying not to fall is good. Knowing how to get up is better.',next:'d'},
  what:{s:'varian',t:'I was gone for most of my son’s childhood. Then I came back angry. I shouted at a boy who only wanted his father.',next:'d'},
  d:{s:'varian',t:'Anduin wanted to be a priest, not a warrior. I took it as a failure. Mine, or his. I couldn’t tell which.',next:'e'},
  e:{s:'varian',t:'It took me years to say two sentences to him. “I’m sorry.” And “I’m proud of you, exactly as you are.”',next:'offer'},
  offer:{s:'varian',t:'Twelve acts for your kids. Time, play, bedtime. And at least once, say both of those sentences to one of them. Out loud.',opts:[
   {t:'Twelve. Both sentences. (Start “The Lion and the Cub”)',next:'yes',do:[{quest:['the-lion-and-the-cub','start']}]},
   {t:'Apologizing to a kid feels strange.',next:'no'}]},
  yes:{s:'varian',t:'Good man. It will feel like losing a fight. It isn’t. It’s the only fight that matters.',end:true},
  no:{s:'varian',t:'It felt strange to me too. Stranger still was a son who stopped expecting me to. Think on it.',end:true}}},

 'the-lion-and-the-cub-2':{who:'varian',bg:'facility-scenes/school.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Varian stands at the back of the village schoolroom after hours, looking at a small desk with an expression you can’t quite read.',next:'b'},
  b:{s:'varian',t:'Twelve. I heard your youngest telling the whole schoolyard that Dad built a fort in the living room. Well done.',next:'c'},
  c:{s:'varian',t:'Did you say them? The two sentences?',opts:[
   {t:'I said sorry. They hugged me.',next:'sorry',do:[{flag:'varian-sorry'}]},
   {t:'I said I was proud. They went very quiet.',next:'proud',do:[{flag:'varian-sorry'}]},
   {t:'I couldn’t get the words out.',next:'couldnt'}]},
  sorry:{s:'varian',t:'Children forgive faster than kings. Don’t mistake that for a debt cancelled. Mistake it for a second chance.',next:'d'},
  proud:{s:'varian',t:'Quiet means it landed. Anduin was silent for a whole day after I said it. Then he asked me to spar.',next:'d'},
  couldnt:{s:'varian',t:'They stuck in my throat for years. Write them down, then. A note on a pillow counts. Try again.',next:'d'},
  d:{s:'varian',t:'Now the hard part. One good week doesn’t rebuild trust. I learned that standing at the gate of Stormwind with my boy watching.',next:'e'},
  e:{s:'varian',t:'Seven different days. Show up for them on each. Let them see the same father every morning. That is what trust is made of.',opts:[
   {t:'Seven days. The same father, every one.',next:'f',do:[{quest:['the-lion-and-the-cub','advance']}]}]},
  f:{s:'varian',t:'And find the thing your kid loves that you don’t understand. Ask them to teach you. Then shut up and learn.',next:'g'},
  g:{s:'narrator',t:'Varian runs a calloused thumb over the little desk. “He sat here once. I missed it.” Then he squares his shoulders and leaves.',end:true,do:[{xp:['fatherhood',900]}]}}},

 'the-lion-and-the-cub-3':{who:'varian',bg:'facility-scenes/raphael.webp',start:'a',nodes:{
  a:{s:'narrator',t:'In the Training Yard after dark, Varian sits on a bench with two wooden practice swords, one full size and one very small.',next:'b'},
  b:{s:'varian',t:'Seven days. Your kid taught you that game they love, and you lost badly, and you laughed. I heard. The whole inn heard.',next:'c'},
  c:{s:'varian',t:'Sit. When Anduin was small, I carved him this. I never once used it with him. I was always on the way out the door.',next:'d'},
  d:{s:'varian',t:'Years later, he became the man who healed what I broke. A priest. Better than me. I was proud of him too late to tell him often.',opts:[
   {t:'You told him, though. In the end.',next:'end'},
   {t:'Why give this to me?',next:'why'}]},
  end:{s:'varian',t:'I did. And I would give a kingdom to have said it ten thousand more times. Don’t ration it.',next:'e'},
  why:{s:'varian',t:'Because it never got used. That’s a waste I can still fix, through you.',next:'e'},
  e:{s:'narrator',t:'He hands you the small sword. A lion is carved on the hilt, worn soft at the mane by a thumb that rubbed it on long nights.',next:'f'},
  f:{s:'varian',t:'Take it home. Let them choose the game. Sword, dolls, a book, it doesn’t matter. The lion is just there to remind you.',next:'g'},
  g:{s:'varian',t:'And the ritual. Every night at bedtime, one of the two sentences. Sorry when you owe it. Proud when you don’t.',opts:[
   {t:'Every night. I’ll say it.',next:'h'},
   {t:'What if I’m proud and sorry both?',next:'both'}]},
  both:{s:'varian',t:'Then say both. A father who can say both is a stronger man than any gladiator I ever fought.',next:'h'},
  h:{s:'varian',t:'Go home, {name}. Your cub is waiting. Don’t make him wait the way I made mine.',end:true,do:[{quest:['the-lion-and-the-cub','complete']}]}}},

 // ---------------- Footprints on the Plains (Baine, Fatherhood, tier 5: 15 habits, 10 days) ----------------
 'footprints-on-the-plains-1':{who:'baine',bg:'facility-scenes/stories.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A tauren chieftain ducks under the Hearth Inn door, horns scraping the lintel. He sits carefully at the long table, and it creaks, and holds.',next:'b'},
  b:{s:'baine',t:'Peace, friend. I am Baine. My father was Cairne. Every day I walk in his footprints, and every day they are a little too big.',next:'c'},
  c:{s:'baine',t:'The others taught you to show up, to stay calm, to stay, to repair. I have one question left. What will you leave behind?',opts:[
   {t:'I haven’t thought that far ahead.',next:'far'},
   {t:'I want my kids to be better than me.',next:'better'},
   {t:'That’s a heavy question for a Tuesday.',next:'heavy'}]},
  far:{s:'baine',t:'Few men do, until it is late. My father did. That is why I still know what to do on the hard days.',next:'d'},
  better:{s:'baine',t:'A good wish. But children do not become what we wish. They become what we do, every ordinary day.',next:'d'},
  heavy:{s:'baine',t:'Ha. Tuesdays are where legacies are made. Nobody builds one at a feast.',next:'d'},
  d:{s:'baine',t:'My father was killed by a coward’s poisoned blade. He lost the fight. But he had already won the thing that mattered. Me.',next:'e'},
  e:{s:'baine',t:'Your children will not remember your speeches. They will remember the shape of your days. That is the footprint.',next:'offer'},
  offer:{s:'baine',t:'Fifteen acts for your children. Presence, play, bedtime, teaching. Choose each one as if they will tell their own children about it.',opts:[
   {t:'Fifteen. Footprints worth following. (Start “Footprints on the Plains”)',next:'yes',do:[{quest:['footprints-on-the-plains','start']}]},
   {t:'I need to sit with this a while.',next:'no'}]},
  yes:{s:'baine',t:'Then walk well. The Earth Mother sees every step, and so do they.',end:true},
  no:{s:'baine',t:'Sit, then. The plains are patient. Children are less so. Do not sit too long.',end:true}}},

 'footprints-on-the-plains-2':{who:'baine',bg:'ui-scenes/Bg_Field_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'Baine walks the tall grass outside the village, slowly, a great totem staff in one hand. Behind him the grass springs back up.',next:'b'},
  b:{s:'baine',t:'Fifteen. I watched your oldest copy the way you tie your boots. They did not know you saw. I did.',next:'c'},
  c:{s:'baine',t:'Which of your habits do you hope they take with them?',opts:[
   {t:'Showing up, even when I’m tired.',next:'tired',do:[{flag:'baine-legacy'}]},
   {t:'Kindness to their mother.',next:'mother',do:[{flag:'baine-legacy'}]},
   {t:'Faith. Prayer before the day.',next:'faith',do:[{flag:'baine-legacy'}]}]},
  tired:{s:'baine',t:'That one my father gave me. He rose before the sun, every day, old and aching. I rise early still. I cannot help it.',next:'d'},
  mother:{s:'baine',t:'Wise. Sons learn how to love from watching their fathers love. Daughters learn what to expect. Both are watching.',next:'d'},
  faith:{s:'baine',t:'My father knelt to the Earth Mother each dawn. I did not understand it as a calf. I do now. Yours will too.',next:'d'},
  d:{s:'baine',t:'Look behind me. The grass stands back up. A single walk leaves no trail. Only a path walked every day does.',next:'e'},
  e:{s:'baine',t:'Ten different days. Walk the same path for them on each one. Long enough that the grass gives up and the path remains.',opts:[
   {t:'Ten days. A path, not a footprint.',next:'f',do:[{quest:['footprints-on-the-plains','advance']}]}]},
  f:{s:'baine',t:'Walk with me to the hill and back. Say nothing. Just walk.',next:'g'},
  g:{s:'narrator',t:'You walk beside him. On the way back you notice your steps have fallen exactly into his. Baine notices too, and smiles.',end:true,do:[{xp:['fatherhood',1000]}]}}},

 'footprints-on-the-plains-3':{who:'baine',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At sunset on the open plains, a tall wooden totem stands freshly raised. Around a fire sit Din, Logan, Quill and Varian. Baine waits by the totem.',next:'b'},
  b:{s:'baine',t:'Ten days. The path is real now. Even the grass knows it. Come. The council is all here.',next:'c'},
  c:{s:'quill',t:'Full Dad Council. I made a playlist. Nobody let me play it.',next:'d'},
  d:{s:'baine',t:'Among my people, when a father has walked the path, his children are carved into the totem. So all who pass will know whose they are.',next:'e'},
  e:{s:'narrator',t:'Carved into the wood already: a horned signet, a dog tag, a cassette, a small lion. Your teachers’ marks. Below them, the wood is bare.',next:'f'},
  f:{s:'baine',t:'Take the knife. Carve a mark for each of your children. Whatever shape is theirs.',opts:[
   {t:'Carve slowly, one child at a time.',next:'slow'},
   {t:'Ask the others how they chose their marks.',next:'ask'}]},
  ask:{s:'din',t:'You don’t choose it. You already know it. Carve.',next:'slow'},
  slow:{s:'narrator',t:'You carve one mark for each child. It takes a long time. Nobody hurries you. When you look up, Logan has looked away, jaw tight.',next:'g'},
  g:{s:'baine',t:'This was my father’s. A small totem, carved by his own hand for me. I have carved another for my son. This one is for yours.',next:'h'},
  h:{s:'narrator',t:'He places a palm-sized totem in your hands. It is warm, and smells of cedar and smoke and very old summers.',next:'i'},
  i:{s:'baine',t:'The ritual: once a year, sit with each child and carve one new notch together. Tell them what you saw them become.',opts:[
   {t:'Every year. Until they carve for their own kids.',next:'j'},
   {t:'What if I’m not there someday to do it?',next:'gone'}]},
  gone:{s:'baine',t:'Then they will carve it themselves, and hear your voice in every stroke. That is a legacy. My father taught me that by leaving.',next:'j'},
  j:{s:'varian',t:'To the path. And to the cubs who’ll walk it.',next:'k'},
  k:{s:'baine',t:'Your footprints are worth following, {name}. Go home and keep walking. They are right behind you.',end:true,do:[{quest:['footprints-on-the-plains','complete']}]}}},
};
