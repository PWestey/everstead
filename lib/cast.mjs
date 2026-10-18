// Everstead's world data: eight life areas, and for each one a Fellow, a Family member and a village
// building. The owner picks the cast; renaming or swapping someone is a change here and in
// lib/stories.mjs, plus their art file. Old ids are mapped forward in lib/game.mjs (RENAMED) so saves keep loading.
//
// Art lives at public/assets/cast/<id>.webp (full-screen portrait, ~1024x1536, transparent).
// A missing file falls back to a drawn placeholder, so the game is playable before any art exists.

/** The eight life areas. Habits, stats, Fellows, Family and buildings all hang off these ids. */
export const AREAS=[
 {id:'faith',name:'Faith',color:'#e9c46a',stat:'Spirit',blurb:'Prayer, scripture, gratitude, reflection.'},
 {id:'marriage',name:'Marriage',color:'#e76f51',stat:'Heart',blurb:'Your wife: time, attention, date nights, partnership.'},
 {id:'fatherhood',name:'Fatherhood',color:'#f4a261',stat:'Legacy',blurb:'Your kids: presence, play, teaching, bedtime.'},
 {id:'fitness',name:'Fitness',color:'#2a9d8f',stat:'Might',blurb:'Training, sleep, food, movement.'},
 {id:'work',name:'Work',color:'#457b9d',stat:'Craft',blurb:'Career, leadership, deep work, money.'},
 {id:'home',name:'Home',color:'#8a5a44',stat:'Hearth',blurb:'Chores, upkeep, planning, the house itself.'},
 {id:'discipline',name:'Discipline',color:'#7b5ea7',stat:'Will',blurb:'Focus, boundaries, screens, routines.'},
 {id:'hobbies',name:'Hobbies',color:'#43aa8b',stat:'Joy',blurb:'Reading, learning, creating, play done on purpose.'},
];
export const AREA_IDS=AREAS.map(a=>a.id);
/** @type {(id:string)=>any} */
export const areaById=id=>AREAS.find(a=>a.id===id);

const art=id=>'cast/'+id+'.webp';

/** Fellows bring Power. One per life area; habits in that area recruit them and earn their star sigils. */
export const FELLOWS=[
 {id:'obiwan',area:'faith',name:'Obi-Wan',fullName:'Obi-Wan Kenobi',title:'Jedi Master',rarity:'SSR',description:'A calm, patient master who trusts in something bigger than himself. He believes peace is practised daily, not found once.'},
 {id:'bram',area:'marriage',name:'Bram',title:'Hearthguard',rarity:'SSR',description:'A broad-shouldered shieldbearer who has loved the same woman for twenty years and still courts her every week. He guards the people, not the walls.'},
 {id:'din',area:'fatherhood',name:'Din',fullName:'Din Djarin',title:'The Mandalorian',rarity:'SSR',description:'A bounty hunter who became a father by choice and never looked back. Wherever he goes, the little one comes too.'},
 {id:'darrow',area:'fitness',name:'Darrow',fullName:'Darrow of Lykos',title:'The Reaper',rarity:'SSR',description:'A miner who was told he would always be small, and carved himself into a warrior anyway. He believes the body is forged in the hours nobody sees.'},
 {id:'tony',area:'work',name:'Tony',fullName:'Tony Stark',title:'Artificer',rarity:'SSR',description:'A genius inventor who builds his way out of every problem. Brilliant, restless, and learning that the best work is the work you finish.'},
 {id:'peter',area:'home',name:'Peter',fullName:'Peter Parker',title:'Web-Slinger',rarity:'SSR',description:'The friendly neighbour who fixes things for everyone, then remembers to take out his own trash. Small acts of responsibility are his superpower.'},
 {id:'kaladin',area:'discipline',name:'Kaladin',fullName:'Kaladin Stormblessed',title:'Windrunner',rarity:'SSR',description:'A spearman who has carried others through his darkest days by keeping his word one step at a time. To him, discipline is a promise you keep even when you feel nothing.'},
 {id:'jory',area:'hobbies',name:'Jory',title:'Wandering Bard',rarity:'SSR',description:'A cheerful bard who plays, paints, reads and fishes, and insists that joy is a skill worth practising.'},
].map(f=>({...f,kind:'fellow',art:art(f.id),portrait:art(f.id)}));

/** Family bring Blessings: a bonus to their linked Fellow, a smaller bonus to everyone, and income for their building. */
export const FAMILY=[
 {id:'ariane',area:'faith',name:'Ariane',fullName:'Ariane Lumenhart',title:'Wizard of Light',rarity:'SSR',description:'Ariane left the great Wizards’ Tower to tend the chapel of a small village. She believes faith is a light you carry for other people, and she keeps hers burning on purpose, every day.'},
 {id:'tyrande',area:'marriage',name:'Tyrande',fullName:'Tyrande Whisperwind',title:'High Priestess of the Moon',rarity:'SSR',description:'An ancient priestess who has guarded her people for ten thousand years and loved one husband through all of them. To her, a marriage is the vow you keep every single night, not just the one you made once.'},
 {id:'vin',area:'fatherhood',name:'Vin',title:'Mistborn',rarity:'SSR',description:'A street orphan who grew up with nobody to trust, until a crew became her family. She knows better than anyone what a child needs most: someone who keeps showing up.'},
 {id:'kira',area:'fitness',name:'Kira',fullName:'Kira Carsen',title:'Blade Dancer',rarity:'SSR',description:'A sharp-tongued warrior who trains hard and jokes harder. She left a rough past behind by outworking it, one session at a time.'},
 {id:'fannie',area:'fitness',name:'Fannie',title:'Explorer',rarity:'SSR',description:'A sunny, restless explorer who runs every trail she can find. She treats movement like a map: the more you do, the more of the world opens up.'},
 {id:'shallan',area:'work',name:'Shallan',fullName:'Shallan Davar',title:'Scholar & Artist',rarity:'SSR',description:'A quick-witted scholar who never goes anywhere without a sketchbook. She draws what she sees to understand it, and works hardest on the days she would rather hide.'},
 {id:'kate',area:'home',name:'Kate',fullName:'Kate Bishop',title:'Archer',rarity:'SSR',description:'A scrappy archer who never misses and never quits. She fixes her own roof, feeds her own dog and keeps her place in order, because a home you take care of is the one that takes care of you.'},
 {id:'violet',area:'discipline',name:'Violet',fullName:'Violet Sorrengail',title:'Dragon Rider',rarity:'SSR',description:'Trained to be a scribe, forged into a rider. She was never the strongest in the room, so she became the most prepared: daggers sharpened, books read, every morning earned.'},
 {id:'misty',area:'hobbies',name:'Misty',title:'Water Trainer',rarity:'SSR',description:'A fiery, fearless trainer who loves swimming, fishing and anything near the water. She will drag you out to the lake and you will be glad she did.'},
].map(f=>({...f,kind:'family',art:art(f.id),portrait:art(f.id)}));

/** Village buildings, one per area. `sprite` reuses an existing village building image; x/y place it on the ground. */
export const BUILDINGS=[
 {id:'chapel',area:'faith',name:'Chapel',sprite:'Building_1701',x:78,y:40,description:'Quiet stone and warm light. Faith habits fill its bell tower.'},
 {id:'cafe',area:'marriage',name:'Rose Café',sprite:'Building_701',x:38,y:54.1,description:'Candlelit tables for two. Marriage habits keep the roses blooming.'},
 {id:'inn',area:'fatherhood',name:'Hearth Inn',sprite:'Building_101',x:6,y:56.5,description:'The long table where the little ones eat first. Fatherhood habits keep the fire going.'},
 {id:'yard',area:'fitness',name:'Training Yard',sprite:'Building_801',x:43,y:78.9,description:'Targets, sandbags and a very honest scale. Fitness habits train here.'},
 {id:'market',area:'work',name:'Market',sprite:'Building_1001',x:52,y:76.1,description:'Stalls, coin and gossip. Work habits keep trade moving.'},
 {id:'workshop',area:'home',name:'Workshop',sprite:'Building_301',x:17,y:49.7,description:'Sawdust and fresh paint. Home habits fix what is broken.'},
 {id:'library',area:'discipline',name:'Library',sprite:'Building_401',x:23,y:70,description:'Shelves to the rafters. Discipline habits sharpen the mind here.'},
 {id:'guildhall',area:'hobbies',name:'Guildhall',sprite:'Building_901',x:71,y:77.6,description:'Music, paint and fishing rods by the door. Hobby habits fill its halls with life.'},
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
 {id:'neglect',name:'Neglect',title:'The Creeping Ivy',opposed:['marriage','fatherhood'],description:'Ivy that grows over doors nobody opens, and over people nobody makes time for.'},
 {id:'pride',name:'Pride',title:'The Gilded Mask',opposed:['faith','marriage'],description:'A golden mask that whispers you never needed anyone’s help.'},
 {id:'excess',name:'Excess',title:'The Hungry Feast',opposed:['fitness','discipline'],description:'A feast that never ends, where one more always becomes ten more.'},
 {id:'burnout',name:'Burnout',title:'The Ashen Hearth',opposed:['hobbies','fatherhood'],description:'Ash that settles on everything you used to love, until even play feels like work.'},
];
/** @type {(id:string)=>any} */
export const blightById=id=>BLIGHTS.find(b=>b.id===id);

// Several characters can share an area. They join in list order: the first early, later ones at higher habit totals.
/** @type {(area:string)=>any[]} */
export const fellowsInArea=area=>FELLOWS.filter(f=>f.area===area);
/** @type {(area:string)=>any[]} */
export const familyInArea=area=>FAMILY.filter(f=>f.area===area);
/** A character's place in their area's queue (0 = first to join). @type {(c:any)=>number} */
export const queueIndex=c=>(c.kind==='family'?familyInArea(c.area):fellowsInArea(c.area)).findIndex(x=>x.id===c.id);
