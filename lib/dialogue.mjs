// Dialogue trees. A tree has a backdrop, a starting node and nodes:
//   {s:'darrow'|'player'|'narrator', t:'text', next:'key'}                      a line, then the next node
//   {s, t, opts:[{t:'choice', next:'key', do:[...]}]}                          a choice
//   {s, t, end:true}                                                          the last line
// Any node or option may carry `do`, a list of effects the game applies (once per save for story
// trees, every time for adventures): {flag}, {gold}, {xp:[area,amount]}, {sigils:[area,amount]},
// {bond:[familyId,amount]}, {quest:[questId,'start'|'advance'|'complete']}, {adventure:true}.
// `{name}` in text is replaced with the player's name.

import {TREES as T_FAITH_MARRIAGE} from './quests/faith-marriage.mjs';
import {TREES as T_FATHERHOOD_FITNESS} from './quests/fatherhood-fitness.mjs';
import {TREES as T_WORK_HOME} from './quests/work-home.mjs';
import {TREES as T_DISCIPLINE_HOBBIES} from './quests/discipline-hobbies.mjs';
import {TREES as T_WAVE2_A} from './quests/wave2-a.mjs';
import {TREES as T_WAVE2_B} from './quests/wave2-b.mjs';
import {TREES as T_WAVE2_C} from './quests/wave2-c.mjs';
import {TREES as T_WAVE3} from './quests/wave3.mjs';
import {MOMENT_TREES,treeFor} from './moments.mjs';
import {cheerMoment} from './cheers.mjs';
import {TREES as S1} from './story/chapters-1.mjs';
import {TREES as S2} from './story/chapters-2.mjs';
import {TREES as S3} from './story/chapters-3.mjs';
import {REGIONS} from './expedition-data.mjs';
import {EXPEDITION_SCENES as X1} from './expeditions/scenes.mjs';
import {EXPEDITION_SCENES as X2} from './expeditions/scenes-2.mjs';
import {EXPEDITION_SCENES as X3} from './expeditions/scenes-3.mjs';
const EXPEDITION_SCENES={...X1,...X2,...X3};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- The Iron Body (Darrow, Fitness) ----------------
 'iron-body-1':{who:'darrow',bg:'facility-scenes/raphael.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Darrow is alone in the Training Yard, shirt soaked through, running the same blade form he ran at dawn. He doesn’t stop when you walk up.',next:'b'},
  b:{s:'darrow',t:'You again. Most people come to a yard like this once, look at the sandbags, and decide they’re busy.',next:'c'},
  c:{s:'darrow',t:'On Lykos we drilled helium-3 two miles down in suits that cooked you. You got strong or the mine kept you. Simple.',opts:[
   {t:'Teach me to train like that.',next:'teach'},
   {t:'Isn’t that a hard way to live?',next:'hard'},
   {t:'I’m just here to stretch.',next:'stretch'}]},
  teach:{s:'darrow',t:'Ha. Sevro said the same thing to me once. Then he bit a man. Say it again in a month and I’ll believe you.',next:'offer'},
  hard:{s:'darrow',t:'Hardest thing I know. My uncle Narol drank to get through it. I trained instead. Better trade.',next:'offer'},
  stretch:{s:'darrow',t:'Stretching’s fine. My first day in the Institute I couldn’t touch my toes. Gold kids laughed. They stopped laughing.',next:'offer'},
  offer:{s:'darrow',t:'So here’s the deal. Three real sessions. A workout, a long walk, a dinner you’re not ashamed of. Then find me.',opts:[
   {t:'I’ll do it. (Start “The Iron Body”)',next:'yes',do:[{quest:['iron-body','start']}]},
   {t:'Not today.',next:'no'}]},
  yes:{s:'darrow',t:'Don’t promise me. I’ve heard a lot of promises from men in fancy robes. Just go do it.',end:true},
  no:{s:'darrow',t:'Fine. I’m here every morning anyway. Ask anyone. Ask the sandbags.',end:true}}},

 'iron-body-2':{who:'darrow',bg:'facility-scenes/journey.webp',start:'a',nodes:{
  a:{s:'narrator',t:'Darrow is waiting at the foot of the hill road with two canvas packs stuffed with river stones.',next:'b'},
  b:{s:'darrow',t:'Three. You actually came back. I had a bet with myself. I lost, and I’m glad.',next:'c'},
  c:{s:'darrow',t:'Be honest with me. What was the worst part?',opts:[
   {t:'Starting. Every single time.',next:'start',do:[{flag:'darrow-truth'}]},
   {t:'Honestly? It felt good.',next:'good'},
   {t:'Finding the time.',next:'time'}]},
  start:{s:'darrow',t:'Same for me. Every shift, standing at the lift, not wanting to go down. You go down anyway. It never got easier. I got quicker.',next:'d'},
  good:{s:'darrow',t:'Good. Hang on to that. Some morning you’ll want to roll over, and that feeling’s the only thing that’ll argue back.',next:'d'},
  time:{s:'darrow',t:'Nobody has time. Steal it. Twenty minutes off the phone at night is a whole workout.',next:'d'},
  d:{s:'darrow',t:'Next part’s the real test. Any idiot can kill himself in the yard once. I want three separate days.',next:'e'},
  e:{s:'darrow',t:'Three days, not three sessions on a Saturday because you felt guilty. Spread out. That’s what makes it stick.',opts:[
   {t:'Three days. Done.',next:'f',do:[{quest:['iron-body','advance']}]}]},
  f:{s:'darrow',t:'Grab a pack. Up the hill and back. I’ll carry the other one so you can’t complain.',next:'g'},
  g:{s:'narrator',t:'You haul the stones to the top. Your legs are shaking the whole way down. Darrow doesn’t say a word, but he waits at the bottom.',end:true,do:[{xp:['fitness',500]}]}}},

 'iron-body-3':{who:'darrow',bg:'ui-scenes/Bg_Level_03_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'At sunrise Darrow sits on a rock by the river, turning a plain iron band over and over in his fingers.',next:'b'},
  b:{s:'darrow',t:'Three days. Tired days too, I could tell. You didn’t make a speech about it. You just did it. That’s rarer than you think.',next:'c'},
  c:{s:'darrow',t:'I hammered this out of a broken drill bit when I was sixteen. First thing I owned that the Society didn’t hand me.',opts:[
   {t:'I can’t take that.',next:'refuse'},
   {t:'Thank you, Darrow.',next:'take'}]},
  refuse:{s:'darrow',t:'Sure you can. Mustang would tell you I’m sentimental and she’d be right. It’s just iron. Take it.',next:'take'},
  take:{s:'narrator',t:'He drops the iron band into your palm. It’s heavier than it looks, and still warm from his hand.',next:'d'},
  d:{s:'darrow',t:'Wear it when you train, {name}. You know where to find me. Same yard, same time.',end:true,do:[{quest:['iron-body','complete']}]}}},

 // ---------------- Training Yard adventures (repeatable; each costs one roam) ----------------
 'yard-sandbags':{who:null,bg:'facility-scenes/raphael.webp',adventure:true,start:'a',nodes:{
  a:{s:'narrator',t:'The heavy bags hang in a row, patched with every color of canvas the village owns. Somebody’s already grunting through rounds.',next:'b'},
  b:{s:'narrator',t:'Your wraps are on. What’s the plan?',opts:[
   {t:'Go hard: ten all-out rounds.',next:'hard',do:[{adventure:true},{xp:['fitness',600]}]},
   {t:'Steady: perfect form, slow and clean.',next:'steady',do:[{adventure:true},{xp:['fitness',400]},{xp:['discipline',200]}]},
   {t:'Coach the beginners instead.',next:'coach',do:[{adventure:true},{xp:['fitness',250]},{gold:200}]}]},
  hard:{s:'narrator',t:'Round eight, your arms are wet sand. Round ten, you’re laughing for no reason. The bag keeps swinging after you sit down.',end:true},
  steady:{s:'narrator',t:'Jab, cross, reset. Slow enough to feel your feet. Every punch lands where you meant it to. Nobody notices but you.',end:true},
  coach:{s:'narrator',t:'A farmhand keeps bending his wrist. You fix it. His next punch smacks clean and the yard whoops. He pays you in coin and a jar of honey.',end:true}}},
 'yard-hill':{who:null,bg:'ui-scenes/Bg_Level_03_Mid.jpg',adventure:true,start:'a',nodes:{
  a:{s:'narrator',t:'The hill road climbs past the river and the old standing stones. The village runners swear the view’s worth the lungs.',next:'b'},
  b:{s:'narrator',t:'Halfway up, the path forks.',opts:[
   {t:'Take the steep goat track.',next:'steep',do:[{adventure:true},{xp:['fitness',700]}]},
   {t:'Take the long, gentle path and enjoy it.',next:'gentle',do:[{adventure:true},{xp:['fitness',350]},{xp:['hobbies',250]}]},
   {t:'Help a traveller carry their pack up.',next:'help',do:[{adventure:true},{xp:['fitness',400]},{gold:150}]}]},
  steep:{s:'narrator',t:'Hands on your knees, chest on fire, you crest the top. The whole valley is down there, smoke rising from breakfast chimneys.',end:true},
  gentle:{s:'narrator',t:'No rush. Wildflowers, a fox who stares you down, a stream cold enough to hurt your teeth. You reach the top barely winded and grinning.',end:true},
  help:{s:'narrator',t:'She’s a pot seller with far too many pots. At the top she pays you in coins and the worst joke you’ve heard all year.',end:true}}},
 'yard-forge':{who:null,bg:'ui-scenes/Bg_Village_01_Mid.jpg',adventure:true,start:'a',nodes:{
  a:{s:'narrator',t:'The smith’s apprentice is down with a cold. There’s a cart of iron bars to unload and bellows nobody’s working.',next:'b'},
  b:{s:'narrator',t:'The smith wipes soot off her forehead and gives you a look that says “please.”',opts:[
   {t:'Unload the whole cart yourself.',next:'cart',do:[{adventure:true},{xp:['fitness',500]},{gold:100}]},
   {t:'Work the bellows and learn the trade.',next:'bellows',do:[{adventure:true},{xp:['work',400]},{xp:['fitness',200]}]},
   {t:'Fix the cart’s broken wheel first.',next:'wheel',do:[{adventure:true},{xp:['home',400]},{gold:150}]}]},
  cart:{s:'narrator',t:'Forty bars, one at a time. Your shoulders are screaming by the end and the smith is laughing at how fast you went.',end:true},
  bellows:{s:'narrator',t:'She teaches you to read the heat by the color: cherry, orange, straw. You leave smelling like smoke and knowing something new.',end:true},
  wheel:{s:'narrator',t:'A wedge, a mallet, and some swearing under your breath. The wheel runs true. She pays you double for saving her afternoon.',end:true}}},
};
// Quest conversations live beside their quests in lib/quests/*.mjs; moments are built in lib/moments.mjs.
Object.assign(TREES,T_FAITH_MARRIAGE,T_FATHERHOOD_FITNESS,T_WORK_HOME,T_DISCIPLINE_HOBBIES,T_WAVE2_A,T_WAVE2_B,T_WAVE2_C,T_WAVE3,MOMENT_TREES,S1,S2,S3);
// Expedition first-visit scenes: tree x:<place id>, with the place's backdrop and its creature as the portrait.
for(const r of REGIONS)for(const e of [...r.adventures,r.boss])if(EXPEDITION_SCENES[e.id])TREES['x:'+e.id]=treeFor(null,EXPEDITION_SCENES[e.id],e.bg||r.bg,{art:e.art,title:e.title});
/** Adventures by location (building id). Each is a tree above, shown as an art card. */
/** @type {Record<string,{id:string,title:string,blurb:string,art:string,skills:string[]}[]>} */
export const ADVENTURES={
 yard:[
  {id:'yard-sandbags',title:'Sandbag Rounds',blurb:'Wrap your hands and work the heavy bags with the village fighters.',art:'facility-scenes/raphael.webp',skills:['fitness','discipline']},
  {id:'yard-hill',title:'The Hill Road',blurb:'Beat the sun to the top of the valley, then earn your breakfast.',art:'ui-scenes/Bg_Level_03_Mid.jpg',skills:['fitness','hobbies']},
  {id:'yard-forge',title:'Help at the Forge',blurb:'The smith’s apprentice is sick, and those iron bars won’t lift themselves.',art:'ui-scenes/Bg_Village_01_Mid.jpg',skills:['fitness','work','home']},
 ],
};
/** Builds (once) the dialogue tree for a cheer from pickCheer and returns its id. Cheers show the cut-out extra large. */
export function cheerTree(c){const id=`c:${c.who}:${c.kind}:${c.i}:${c.cardId||''}`;if(!TREES[id]){const m=cheerMoment(c);if(!m)return null;TREES[id]=treeFor(c.who,m,undefined,{big:true})}return id}
export const adventureById=id=>Object.values(ADVENTURES).flat().find(a=>a.id===id);
/** All effects attached to a node and (optionally) one of its options. */
export function effectsAt(treeId,nodeKey,optIndex=null){const n=TREES[treeId]?.nodes?.[nodeKey];if(!n)return null;return optIndex===null?(n.do||[]):(n.opts?.[optIndex]?.do||null)}
