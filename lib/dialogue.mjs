// Dialogue trees. A tree has a backdrop, a starting node and nodes:
//   {s:'darrow'|'player'|'narrator', t:'text', next:'key'}                      a line, then the next node
//   {s, t, opts:[{t:'choice', next:'key', do:[...]}]}                          a choice
//   {s, t, end:true}                                                          the last line
// Any node or option may carry `do`, a list of effects the game applies (once per save for story
// trees, every time for adventures): {flag}, {gold}, {xp:[area,amount]}, {sigils:[area,amount]},
// {bond:[familyId,amount]}, {quest:[questId,'start'|'advance'|'complete']}, {adventure:true}.
// `{name}` in text is replaced with the player's name.

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- The Iron Body (Darrow, Fitness) ----------------
 'iron-body-1':{who:'darrow',bg:'facility-scenes/raphael.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Darrow is alone in the Training Yard, running the same blade form he ran at dawn. He doesn’t stop when you walk up.',next:'b'},
  b:{s:'darrow',t:'You keep coming here. Most people visit a training yard once, the way they visit a grave.',next:'c'},
  c:{s:'darrow',t:'Where I grew up, we dug in the dark until our hands bled. Strength wasn’t a hobby. It was the only thing nobody could take from us.',opts:[
   {t:'Teach me to train like that.',next:'teach'},
   {t:'Isn’t that a hard way to live?',next:'hard'},
   {t:'I’m just here to stretch.',next:'stretch'}]},
  teach:{s:'darrow',t:'Ha. Everyone says that on the first day. Say it again on the thirtieth and I’ll believe you.',next:'offer'},
  hard:{s:'darrow',t:'It was. But hard isn’t the same as wrong. Iron gets hammered before it’s worth anything.',next:'offer'},
  stretch:{s:'darrow',t:'Stretching is how it starts. Everything worth having starts small and keeps going.',next:'offer'},
  offer:{s:'darrow',t:'Here’s my offer. No speeches. Three real sessions. Whatever counts for you: a workout, a long walk, eating right. Then come find me.',opts:[
   {t:'I’ll do it. (Start “The Iron Body”)',next:'yes',do:[{quest:['iron-body','start']}]},
   {t:'Not today.',next:'no'}]},
  yes:{s:'darrow',t:'Good. Don’t tell me you’ll do it. Show me.',end:true},
  no:{s:'darrow',t:'Then go. The yard will still be here. So will I.',end:true}}},

 'iron-body-2':{who:'darrow',bg:'facility-scenes/journey.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Darrow is waiting at the foot of the hill road with two packs of river stones.',next:'b'},
  b:{s:'darrow',t:'Three sessions. You came back. Most don’t.',next:'c'},
  c:{s:'darrow',t:'Tell me the truth. What was hardest?',opts:[
   {t:'Starting. Every single time.',next:'start',do:[{flag:'darrow-truth'}]},
   {t:'Honestly? It felt good.',next:'good'},
   {t:'Finding the time.',next:'time'}]},
  start:{s:'darrow',t:'Then you already know the secret. The first step never gets easier. You just get better at taking it anyway.',next:'d'},
  good:{s:'darrow',t:'Remember that feeling. On the bad days it’s the only argument that works.',next:'d'},
  time:{s:'darrow',t:'Nobody finds time. You take it from something weaker and give it to something stronger.',next:'d'},
  d:{s:'darrow',t:'Now the real test. Anyone can push hard once. I want to see you show up on three different days.',next:'e'},
  e:{s:'darrow',t:'Not three in one day. Three days. That is the difference between a burst and a habit.',opts:[
   {t:'Three days. Done.',next:'f',do:[{quest:['iron-body','advance']}]}]},
  f:{s:'darrow',t:'Take a pack. Carry it up the hill and back. We start now.',next:'g'},
  g:{s:'narrator',t:'You carry the stones to the top. Your legs shake the whole way down. Darrow says nothing, but he waits for you at the bottom.',end:true,do:[{xp:['fitness',500]}]}}},

 'iron-body-3':{who:'darrow',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At sunrise Darrow is sitting on a rock by the river, a plain iron band turning in his fingers.',next:'b'},
  b:{s:'darrow',t:'Three days. You showed up when it was easy and when it wasn’t. That is the whole thing. That is all strength ever was.',next:'c'},
  c:{s:'darrow',t:'This band was the first thing I ever earned that nobody gave me. I want you to have it.',opts:[
   {t:'I can’t take that.',next:'refuse'},
   {t:'Thank you, Darrow.',next:'take'}]},
  refuse:{s:'darrow',t:'You can, and you will. It isn’t a gift. It’s a reminder. Iron is just a stone that refused to stay soft.',next:'take'},
  take:{s:'narrator',t:'He presses the iron band into your palm. It is heavier than it looks.',next:'d'},
  d:{s:'darrow',t:'Keep showing up, {name}. I’ll be in the yard. I always am.',end:true,do:[{quest:['iron-body','complete']}]}}},

 // ---------------- Training Yard adventures (repeatable; each costs one roam) ----------------
 'yard-sandbags':{who:null,bg:'facility-scenes/raphael.webp',adventure:true,start:'a',nodes:{
  a:{s:'narrator',t:'The heavy sandbags hang in a row, patched and re-patched by a hundred hands. A few villagers are already working through rounds.',next:'b'},
  b:{s:'narrator',t:'How do you want to train today?',opts:[
   {t:'Go hard: ten all-out rounds.',next:'hard',do:[{adventure:true},{xp:['fitness',600]}]},
   {t:'Steady: perfect form, slow and clean.',next:'steady',do:[{adventure:true},{xp:['fitness',400]},{xp:['discipline',200]}]},
   {t:'Coach the beginners instead.',next:'coach',do:[{adventure:true},{xp:['fitness',250]},{gold:200}]}]},
  hard:{s:'narrator',t:'By round eight your arms are lead. By round ten you are grinning. The bag swings for a long time after you stop.',end:true},
  steady:{s:'narrator',t:'Slow is smooth and smooth is fast. Every punch lands exactly where you aim it. Nobody notices but you.',end:true},
  coach:{s:'narrator',t:'You show a nervous farmhand how to keep his wrist straight. He lands his first clean punch and the whole yard cheers. He insists on paying you.',end:true}}},
 'yard-hill':{who:null,bg:'ui-scenes/Bg_Level_03_Mid.jpg',adventure:true,start:'a',nodes:{
  a:{s:'narrator',t:'The hill road climbs past the river and the old stones. Runners say the view from the top is worth every step.',next:'b'},
  b:{s:'narrator',t:'The path splits halfway up.',opts:[
   {t:'Take the steep goat track.',next:'steep',do:[{adventure:true},{xp:['fitness',700]}]},
   {t:'Take the long, gentle path and enjoy it.',next:'gentle',do:[{adventure:true},{xp:['fitness',350]},{xp:['hobbies',250]}]},
   {t:'Help a traveller carry their pack up.',next:'help',do:[{adventure:true},{xp:['fitness',400]},{gold:150}]}]},
  steep:{s:'narrator',t:'Hands on knees, lungs on fire, you reach the top. The whole valley spreads out below you in the morning light.',end:true},
  gentle:{s:'narrator',t:'You take your time. Wildflowers, a fox, a cold stream. You reach the top barely tired and very happy.',end:true},
  help:{s:'narrator',t:'The traveller is a merchant with far too many pots. At the top she presses a few coins on you and tells you a terrible joke.',end:true}}},
 'yard-forge':{who:null,bg:'ui-scenes/Bg_Village_01_Mid.jpg',adventure:true,start:'a',nodes:{
  a:{s:'narrator',t:'The village smith is short-handed. A cart of iron bars needs unloading, and the bellows need pumping.',next:'b'},
  b:{s:'narrator',t:'The smith wipes her brow and looks at you hopefully.',opts:[
   {t:'Unload the whole cart yourself.',next:'cart',do:[{adventure:true},{xp:['fitness',500]},{gold:100}]},
   {t:'Work the bellows and learn the trade.',next:'bellows',do:[{adventure:true},{xp:['work',400]},{xp:['fitness',200]}]},
   {t:'Fix the cart’s broken wheel first.',next:'wheel',do:[{adventure:true},{xp:['home',400]},{gold:150}]}]},
  cart:{s:'narrator',t:'Forty bars, one at a time. By the end your shoulders burn and the smith is laughing at how fast you went.',end:true},
  bellows:{s:'narrator',t:'She shows you how the colour of the fire tells you the heat. You leave smelling of smoke and knowing something new.',end:true},
  wheel:{s:'narrator',t:'A wedge, a mallet and some patience. The wheel turns true again. The smith pays you double for saving her afternoon.',end:true}}},
};
/** Adventures by location (building id). Each is a tree above, shown as an art card. */
/** @type {Record<string,{id:string,title:string,blurb:string,art:string,skills:string[]}[]>} */
export const ADVENTURES={
 yard:[
  {id:'yard-sandbags',title:'Sandbag Rounds',blurb:'Work the heavy bags with the village fighters.',art:'facility-scenes/raphael.webp',skills:['fitness','discipline']},
  {id:'yard-hill',title:'The Hill Road',blurb:'Climb to the top of the valley before breakfast.',art:'ui-scenes/Bg_Level_03_Mid.jpg',skills:['fitness','hobbies']},
  {id:'yard-forge',title:'Help at the Forge',blurb:'The smith is short-handed and the iron is heavy.',art:'ui-scenes/Bg_Village_01_Mid.jpg',skills:['fitness','work','home']},
 ],
};
export const adventureById=id=>Object.values(ADVENTURES).flat().find(a=>a.id===id);
/** All effects attached to a node and (optionally) one of its options. */
export function effectsAt(treeId,nodeKey,optIndex=null){const n=TREES[treeId]?.nodes?.[nodeKey];if(!n)return null;return optIndex===null?(n.do||[]):(n.opts?.[optIndex]?.do||null)}
