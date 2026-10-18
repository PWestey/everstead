// Everstead's world data: six life areas, and for each one a Fellow, a Family member and a village
// building. Everything here is original to Everstead. Names, titles and bios are placeholders until
// the owner's character art arrives; renaming someone is a one-line change here and nowhere else.
//
// Art lives at public/assets/cast/<id>.webp (full-screen portrait, ~1024x1536, transparent).
// A missing file falls back to a drawn placeholder, so the game is playable before any art exists.

/** The six life areas. Habits, stats, Fellows, Family and buildings all hang off these ids. */
export const AREAS=[
 {id:'faith',name:'Faith',color:'#e9c46a',stat:'Spirit',blurb:'Prayer, scripture, gratitude, reflection.'},
 {id:'family',name:'Family',color:'#e76f51',stat:'Heart',blurb:'Marriage, fatherhood, friends and the people at your table.'},
 {id:'fitness',name:'Fitness',color:'#2a9d8f',stat:'Might',blurb:'Training, sleep, food, movement.'},
 {id:'work',name:'Work',color:'#457b9d',stat:'Craft',blurb:'Career, leadership, deep work, money.'},
 {id:'home',name:'Home',color:'#8a5a44',stat:'Hearth',blurb:'Chores, upkeep, planning, the house itself.'},
 {id:'discipline',name:'Discipline',color:'#7b5ea7',stat:'Will',blurb:'Focus, boundaries, learning, hobbies done on purpose.'},
];
export const AREA_IDS=AREAS.map(a=>a.id);
/** @type {(id:string)=>any} */
export const areaById=id=>AREAS.find(a=>a.id===id);

const art=id=>'cast/'+id+'.webp';

/** Fellows bring Power. One per life area; habits in that area recruit them and earn their star sigils. */
export const FELLOWS=[
 {id:'aldric',area:'faith',name:'Aldric',title:'Chapel Warden',rarity:'SSR',description:'A soft-spoken knight who keeps the chapel lamps lit through every storm. He believes strength is borrowed, never owned.'},
 {id:'bram',area:'family',name:'Bram',title:'Hearthguard',rarity:'SSR',description:'A broad-shouldered shieldbearer with three daughters and endless patience. He guards the people, not the walls.'},
 {id:'darrow',area:'fitness',name:'Darrow',fullName:'Darrow of Lykos',title:'The Reaper',rarity:'SSR',description:'A miner who was told he would always be small, and carved himself into a warrior anyway. He believes the body is forged in the hours nobody sees.'},
 {id:'corin',area:'work',name:'Corin',title:'Quartermaster',rarity:'SSR',description:'A sharp-eyed strategist who turns chaos into ledgers and ledgers into victories.'},
 {id:'tobin',area:'home',name:'Tobin',title:'Master Builder',rarity:'SSR',description:'A cheerful carpenter-warrior who swings a hammer as well as an axe. Every fixed hinge is a small win to him.'},
 {id:'kaladin',area:'discipline',name:'Kaladin',fullName:'Kaladin Stormblessed',title:'Windrunner',rarity:'SSR',description:'A spearman who has carried others through his darkest days by keeping his word one step at a time. To him, discipline is a promise you keep even when you feel nothing.'},
].map(f=>({...f,kind:'fellow',art:art(f.id),portrait:art(f.id)}));

/** Family bring Blessings: a bonus to their linked Fellow, a smaller bonus to everyone, and income for their building. */
export const FAMILY=[
 {id:'ariane',area:'faith',name:'Ariane',fullName:'Ariane Lumenhart',title:'Wizard of Light',rarity:'SSR',description:'Ariane left the great Wizards’ Tower to tend the chapel of a small village. She believes faith is a light you carry for other people, and she keeps hers burning on purpose, every day.'},
 {id:'tyrande',area:'family',name:'Tyrande',fullName:'Tyrande Whisperwind',title:'High Priestess of the Moon',rarity:'SSR',description:'An ancient priestess who has guarded her people for ten thousand years and loved one husband through all of them. To her, family is the vow you keep every single night, not just the one you made once.'},
 {id:'kira',area:'fitness',name:'Kira',fullName:'Kira Carsen',title:'Blade Dancer',rarity:'SSR',description:'A sharp-tongued warrior who trains hard and jokes harder. She left a rough past behind by outworking it, one session at a time.'},
 {id:'shallan',area:'work',name:'Shallan',fullName:'Shallan Davar',title:'Scholar & Artist',rarity:'SSR',description:'A quick-witted scholar who never goes anywhere without a sketchbook. She draws what she sees to understand it, and works hardest on the days she would rather hide.'},
 {id:'kate',area:'home',name:'Kate',fullName:'Kate Bishop',title:'Archer',rarity:'SSR',description:'A scrappy archer who never misses and never quits. She fixes her own roof, feeds her own dog and keeps her place in order, because a home you take care of is the one that takes care of you.'},
 {id:'violet',area:'discipline',name:'Violet',fullName:'Violet Sorrengail',title:'Dragon Rider',rarity:'SSR',description:'Trained to be a scribe, forged into a rider. She was never the strongest in the room, so she became the most prepared: daggers sharpened, books read, every morning earned.'},
].map(f=>({...f,kind:'family',art:art(f.id),portrait:art(f.id)}));

/** Village buildings, one per area. `sprite` reuses an existing village building image. */
export const BUILDINGS=[
 {id:'chapel',area:'faith',name:'Chapel',sprite:'Building_1701',x:78,y:40,description:'Quiet stone and warm light. Faith habits fill its bell tower.'},
 {id:'inn',area:'family',name:'Hearth Inn',sprite:'Building_101',x:6,y:56.5,description:'The long table where the village gathers. Family habits keep the fire going.'},
 {id:'yard',area:'fitness',name:'Training Yard',sprite:'Building_801',x:43,y:78.9,description:'Targets, sandbags and a very honest scale. Fitness habits train here.'},
 {id:'market',area:'work',name:'Market',sprite:'Building_1001',x:52,y:76.1,description:'Stalls, coin and gossip. Work habits keep trade moving.'},
 {id:'workshop',area:'home',name:'Workshop',sprite:'Building_301',x:17,y:49.7,description:'Sawdust and fresh paint. Home habits fix what is broken.'},
 {id:'library',area:'discipline',name:'Library',sprite:'Building_401',x:23,y:70,description:'Shelves to the rafters. Discipline habits sharpen the mind here.'},
];

/** @type {(id:string)=>any} */
export const fellowById=id=>FELLOWS.find(f=>f.id===id);
/** @type {(id:string)=>any} */
export const familyById=id=>FAMILY.find(f=>f.id===id);
/** @type {(id:string)=>any} */
export const characterById=id=>fellowById(id)||familyById(id);
/** @type {(id:string)=>any} */
export const fellowForArea=area=>FELLOWS.find(f=>f.area===area);
/** @type {(id:string)=>any} */
export const familyForArea=area=>FAMILY.find(f=>f.area===area);
/** @type {(id:string)=>any} */
export const buildingForArea=area=>BUILDINGS.find(b=>b.area===area);

/** The player's five looks. Art at public/assets/cast/player-<n>.webp; `level` is the player level that unlocks it. */
export const PLAYER_STAGES=[
 {stage:1,level:1,title:'Wanderer',art:'cast/player-1.webp'},
 {stage:2,level:8,title:'Squire',art:'cast/player-2.webp'},
 {stage:3,level:18,title:'Knight',art:'cast/player-3.webp'},
 {stage:4,level:32,title:'Champion',art:'cast/player-4.webp'},
 {stage:5,level:50,title:'Legend of Everstead',art:'cast/player-5.webp'},
];

/** Blights are the vices that creep over Everstead. Each week one rises; habits in its opposing areas push it back hardest. */
export const BLIGHTS=[
 {id:'sloth',name:'Sloth',title:'The Heavy Fog',opposed:['fitness','home'],description:'A grey fog that settles on the farm and makes every task feel like tomorrow’s.'},
 {id:'distraction',name:'Distraction',title:'The Chattering Swarm',opposed:['discipline','work'],description:'A buzzing swarm that pulls eyes away from what matters, one shiny thing at a time.'},
 {id:'doubt',name:'Doubt',title:'The Cracked Well',opposed:['faith','discipline'],description:'Cracks spread through the village well, and the water starts to taste like worry.'},
 {id:'neglect',name:'Neglect',title:'The Creeping Ivy',opposed:['family','home'],description:'Ivy that grows over doors nobody opens, and over people nobody calls.'},
 {id:'pride',name:'Pride',title:'The Gilded Mask',opposed:['faith','family'],description:'A golden mask that whispers you never needed anyone’s help.'},
 {id:'excess',name:'Excess',title:'The Hungry Feast',opposed:['fitness','discipline'],description:'A feast that never ends, where one more always becomes ten more.'},
];
/** @type {(id:string)=>any} */
export const blightById=id=>BLIGHTS.find(b=>b.id===id);
