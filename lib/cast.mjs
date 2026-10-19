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

/** Fellows bring Power. Several per area; habits in that area recruit them (in list order) and earn their star sigils. */
export const FELLOWS=[
 {id:'obiwan',area:'faith',name:'Obi-Wan',fullName:'Obi-Wan Kenobi',title:'Jedi Master',rarity:'SSR',description:'A calm, patient master who trusts in something bigger than himself. He believes peace is practised daily, not found once.'},
 {id:'matt',area:'faith',name:'Matt',fullName:'Matt Murdock',title:'Daredevil',rarity:'SSR',description:'A blind lawyer and devout Catholic who confesses every week and fights for his neighbourhood every night. His faith is not comfortable; it is the thing that keeps him getting back up.'},
 {id:'tchalla',area:'faith',name:'T’Challa',title:'Black Panther',rarity:'SSR',description:'The king of Wakanda, who seeks the counsel of his ancestors and carries his people’s traditions with quiet dignity. He leads from a deep, rooted faith.'},
 {id:'tavi',area:'marriage',name:'Tavi',fullName:'Gaius Octavian',title:'First Lord of Alera',rarity:'SSR',description:'A clever, stubborn leader who won a kingdom with his wits and married the woman who never let him win an argument. He knows a strong marriage is built on respect and good-natured stubbornness.'},
 {id:'steve',area:'marriage',name:'Steve',fullName:'Steve Rogers',title:'Captain America',rarity:'SSR',description:'A soldier out of time who never stopped waiting for the dance he promised. Loyal to the bone, he believes love is a promise you keep across any distance.'},
 {id:'din',area:'fatherhood',name:'Din',fullName:'Din Djarin',title:'The Mandalorian',rarity:'SSR',description:'A bounty hunter who became a father by choice and never looked back. Wherever he goes, the little one comes too.'},
 {id:'logan',area:'fatherhood',name:'Logan',fullName:'James “Logan” Howlett',title:'Wolverine',rarity:'SSR',description:'A gruff, battle-scarred loner who found out late that he would do anything for the kid who needed him. Being a father softened him in all the right places.'},
 {id:'quill',area:'fatherhood',name:'Quill',fullName:'Peter Quill',title:'Star-Lord',rarity:'SSR',description:'A space outlaw raised by a terrible father figure who still turned out to be the dad he needed. He knows fatherhood is about who shows up, not whose blood you share.'},
 {id:'darrow',area:'fitness',name:'Darrow',fullName:'Darrow of Lykos',title:'The Reaper',rarity:'SSR',description:'A miner who was told he would always be small, and carved himself into a warrior anyway. He believes the body is forged in the hours nobody sees.'},
 {id:'roy',area:'fitness',name:'Roy',title:'Rising Trainer',rarity:'SSR',description:'An eager young trainer who never walks when he can run. He turns every day into an adventure and every setback into another try.'},
 {id:'grog',area:'fitness',name:'Grog',fullName:'Grog Strongjaw',title:'Goliath Barbarian',rarity:'SSR',description:'A huge, cheerful barbarian who loves lifting things, eating things and his friends, in roughly that order. Strength is simple to him: pick it up, put it down, again.'},
 {id:'geralt',area:'fitness',name:'Geralt',fullName:'Geralt of Rivia',title:'The White Wolf',rarity:'SSR',description:'A monster hunter who trains, meditates and sharpens his swords every single day, because the one day he skips is the day it matters. Few words, steady habits.'},
 {id:'tony',area:'work',name:'Tony',fullName:'Tony Stark',title:'Artificer',rarity:'SSR',description:'A genius inventor who builds his way out of every problem. Brilliant, restless, and learning that the best work is the work you finish.'},
 {id:'kelsier',area:'work',name:'Kelsier',title:'Survivor of Hathsin',rarity:'SSR',description:'A charming master planner who never walks into a job without a plan, a backup plan and a smile. He believes the best work is done by a crew that trusts each other.'},
 {id:'bruce',area:'work',name:'Bruce',fullName:'Bruce Banner',title:'The Hulk',rarity:'SSR',description:'A brilliant scientist with a very big temper he has learned to work with instead of against. He does his best work with steady habits, careful notes and a calm head.'},
 {id:'peter',area:'home',name:'Peter',fullName:'Peter Parker',title:'Web-Slinger',rarity:'SSR',description:'The friendly neighbour who fixes things for everyone, then remembers to take out his own trash. Small acts of responsibility are his superpower.'},
 {id:'piotr',area:'home',name:'Piotr',fullName:'Piotr Rasputin',title:'Colossus',rarity:'SSR',description:'A gentle giant of steel who would rather paint, cook borscht and fix the porch than fight. He keeps the mansion tidy and expects you to do the same.'},
 {id:'kaladin',area:'discipline',name:'Kaladin',fullName:'Kaladin Stormblessed',title:'Windrunner',rarity:'SSR',description:'A spearman who has carried others through his darkest days by keeping his word one step at a time. To him, discipline is a promise you keep even when you feel nothing.'},
 {id:'stephen',area:'discipline',name:'Stephen',fullName:'Stephen Strange',title:'Sorcerer Supreme',rarity:'SSR',description:'A proud surgeon who lost everything and rebuilt himself through years of humbling, repetitive study. Mastery, he learned, is ego set aside and practice repeated.'},
 {id:'anakin',area:'discipline',name:'Anakin',fullName:'Anakin Skywalker',title:'Jedi Knight',rarity:'SSR',description:'The most gifted Jedi of his generation, still learning that talent without patience burns out. Training with him is a lesson in discipline, for both of you.'},
 {id:'ash',area:'hobbies',name:'Ash',fullName:'Ash Ketchum',title:'Pokémon Trainer',rarity:'SSR',description:'A trainer who has spent his whole life chasing the thing he loves, and still gets excited every single morning. Passion, practised daily, becomes mastery.'},
 {id:'harry',area:'hobbies',name:'Harry',fullName:'Harry Potter',title:'The Boy Who Lived',rarity:'SSR',description:'A wizard who has faced dark lords and still thinks the best thing in the world is a good Quidditch match with his friends. Joy, to him, is worth protecting.'},
 {id:'thor',area:'hobbies',name:'Thor',fullName:'Thor Odinson',title:'God of Thunder',rarity:'SSR',description:'A cheerful god who loves feasts, games, good company and a long adventure. He reminds everyone that a full life needs some fun in it.'},
].map(f=>({...f,kind:'fellow',art:art(f.id),portrait:art(f.id)}));

/** Family bring Blessings: a bonus to every Fellow in their area, a smaller bonus to everyone, and income for their building. */
export const FAMILY=[
 {id:'ariane',area:'faith',name:'Ariane',fullName:'Ariane Lumenhart',title:'Wizard of Light',rarity:'SSR',description:'Ariane left the great Wizards’ Tower to tend the chapel of a small village. She believes faith is a light you carry for other people, and she keeps hers burning on purpose, every day.'},
 {id:'ahsoka',area:'faith',name:'Ahsoka',fullName:'Ahsoka Tano',title:'Wandering Jedi',rarity:'SSR',description:'A former Jedi who walks her own path but never lost her faith in the Force. She listens more than she speaks, and acts when it matters.'},
 {id:'lys',area:'faith',name:'Lys',title:'Temple Keeper',rarity:'SSR',description:'A gentle keeper of an old temple who greets every visitor with tea and a smile. She believes small daily devotions hold up the whole world.'},
 {id:'keyleth',area:'faith',name:'Keyleth',title:'Druid of the Air Ashari',rarity:'SSR',description:'A druid who talks to trees, frets about being good enough, and grows a little wiser every season. Her faith is rooted in the living world.'},
 {id:'shadowheart',area:'faith',name:'Shadowheart',title:'Cleric of Selûne',rarity:'SSR',description:'A guarded cleric who found her true faith after years of doubt. She knows belief is not a feeling; it is a choice you make again each morning.'},
 {id:'tyrande',area:'marriage',name:'Tyrande',fullName:'Tyrande Whisperwind',title:'High Priestess of the Moon',rarity:'SSR',description:'An ancient priestess who has guarded her people for ten thousand years and loved one husband through all of them. To her, a marriage is the vow you keep every single night, not just the one you made once.'},
 {id:'padme',area:'marriage',name:'Padmé',fullName:'Padmé Amidala',title:'Senator of Naboo',rarity:'SSR',description:'A queen turned senator who gave her whole heart to one person. She knows love needs tending, honesty and time, or it slips away.'},
 {id:'yennefer',area:'marriage',name:'Yennefer',fullName:'Yennefer of Vengerberg',title:'Sorceress',rarity:'SSR',description:'A fierce, proud sorceress who chose one man over and over, through every storm. She has no patience for half-hearted love.'},
 {id:'briget',area:'marriage',name:'Briget',title:'Rose Princess',rarity:'SSR',description:'A graceful princess who believes every marriage deserves a little ceremony: flowers on the table, a dance in the kitchen, a letter for no reason.'},
 {id:'kitai',area:'marriage',name:'Kitai',title:'Marat Warrior',rarity:'SSR',description:'A fierce, sharp-tongued Marat warrior bonded to her husband heart and soul. She teases him mercilessly and would cross the world for him without a second thought.'},
 {id:'vin',area:'fatherhood',name:'Vin',title:'Mistborn',rarity:'SSR',description:'A street orphan who grew up with nobody to trust, until a crew became her family. She knows better than anyone what a child needs most: someone who keeps showing up.'},
 {id:'hera',area:'fatherhood',name:'Hera',fullName:'Hera Syndulla',title:'Captain of the Ghost',rarity:'SSR',description:'A pilot, a rebel captain and a mother who kept a whole crew of misfits together. She leads with warmth, patience and steady hands.'},
 {id:'liko',area:'fatherhood',name:'Liko',title:'Young Explorer',rarity:'SSR',description:'A shy, curious young explorer setting out into the world for the first time. She is a reminder of how big everything looks when you are young, and how much a steady parent matters.'},
 {id:'wanda',area:'fatherhood',name:'Wanda',fullName:'Wanda Maximoff',title:'Scarlet Witch',rarity:'SSR',description:'A powerful witch whose deepest wish was always simply a family of her own. She knows children are the most precious thing you will ever protect.'},
 {id:'jean',area:'fatherhood',name:'Jean',fullName:'Jean Grey',title:'Phoenix',rarity:'SSR',description:'A teacher and mentor who helped raise a whole school of young mutants. She believes every child needs someone who sees who they really are.'},
 {id:'kira',area:'fitness',name:'Kira',fullName:'Kira Carsen',title:'Blade Dancer',rarity:'SSR',description:'A sharp-tongued warrior who trains hard and jokes harder. She left a rough past behind by outworking it, one session at a time.'},
 {id:'fannie',area:'fitness',name:'Fannie',title:'Explorer',rarity:'SSR',description:'A sunny, restless explorer who runs every trail she can find. She treats movement like a map: the more you do, the more of the world opens up.'},
 {id:'rey',area:'fitness',name:'Rey',title:'Scavenger Jedi',rarity:'SSR',description:'A scavenger who grew strong climbing wrecks in the desert heat. She knows strength is built from a thousand ordinary days.'},
 {id:'nemona',area:'fitness',name:'Nemona',title:'Champion Rival',rarity:'SSR',description:'A relentlessly cheerful champion who wants to battle, race or spar with anyone, any time. She makes training feel like the best game in the world.'},
 {id:'karlach',area:'fitness',name:'Karlach',title:'Tiefling Barbarian',rarity:'SSR',description:'A huge-hearted tiefling barbarian with an engine for a heart and boundless enthusiasm. She thinks a good workout is basically a party.'},
 {id:'shallan',area:'work',name:'Shallan',fullName:'Shallan Davar',title:'Scholar & Artist',rarity:'SSR',description:'A quick-witted scholar who never goes anywhere without a sketchbook. She draws what she sees to understand it, and works hardest on the days she would rather hide.'},
 {id:'jaina',area:'work',name:'Jaina',fullName:'Jaina Proudmoore',title:'Lord Admiral & Archmage',rarity:'SSR',description:'An archmage who leads a kingdom and still makes time to study. She carries heavy responsibility with a clear head and a long view.'},
 {id:'nash',area:'work',name:'Nash',fullName:'Nash Durango',title:'Bounty Hunter',rarity:'SSR',description:'A wisecracking hunter who always gets the job done and gets paid on time. Professional, punctual and impossible to rattle.'},
 {id:'carol',area:'work',name:'Carol',fullName:'Carol Danvers',title:'Captain Marvel',rarity:'SSR',description:'A test pilot turned hero who takes every job seriously and always finishes the mission. She leads from the front and expects excellence, starting with herself.'},
 {id:'gamora',area:'work',name:'Gamora',title:'Deadliest Woman in the Galaxy',rarity:'SSR',description:'A precise, no-nonsense professional who does the job right the first time. She has no patience for sloppy work, and endless loyalty for her crew.'},
 {id:'kate',area:'home',name:'Kate',fullName:'Kate Bishop',title:'Archer',rarity:'SSR',description:'A scrappy archer who never misses and never quits. She fixes her own roof, feeds her own dog and keeps her place in order, because a home you take care of is the one that takes care of you.'},
 {id:'gwen',area:'home',name:'Gwen',fullName:'Gwen Stacy',title:'Spider-Woman',rarity:'SSR',description:'A drummer and hero who still makes her bed every morning. She says the world gets saved one small, boring, responsible thing at a time.'},
 {id:'ororo',area:'home',name:'Ororo',fullName:'Ororo Munroe',title:'Storm',rarity:'SSR',description:'A calm, regal woman who commands the weather and still tends her rooftop garden every morning. She believes a home is something you grow, with care and patience.'},
 {id:'annamarie',area:'home',name:'Anna Marie',title:'Rogue',rarity:'SSR',description:'A Southern belle with a big heart who makes any house feel like home. Sweet tea on the porch, a warm meal and a door that is always open.'},
 {id:'violet',area:'discipline',name:'Violet',fullName:'Violet Sorrengail',title:'Dragon Rider',rarity:'SSR',description:'Trained to be a scribe, forged into a rider. She was never the strongest in the room, so she became the most prepared: daggers sharpened, books read, every morning earned.'},
 {id:'alleria',area:'discipline',name:'Alleria',fullName:'Alleria Windrunner',title:'Ranger-Captain',rarity:'SSR',description:'A ranger-captain with centuries of practice behind every arrow. Her focus is legendary, and so is her patience.'},
 {id:'vex',area:'discipline',name:'Vex',fullName:'Vex’ahlia',title:'Ranger of Vox Machina',rarity:'SSR',description:'A sharp-eyed ranger who never wastes an arrow or a coin. She keeps her focus, her budget and her promises.'},
 {id:'laezel',area:'discipline',name:'Lae’zel',title:'Githyanki Warrior',rarity:'SSR',description:'A fierce githyanki warrior raised in relentless discipline. She trains every day, judges everyone, and slowly learns that discipline can be kind too.'},
 {id:'natasha',area:'discipline',name:'Natasha',fullName:'Natasha Romanoff',title:'Black Widow',rarity:'SSR',description:'A spy shaped by brutal training who chose her own path. She runs her drills every morning, wastes nothing and always has a plan.'},
 {id:'misty',area:'hobbies',name:'Misty',title:'Water Trainer',rarity:'SSR',description:'A fiery, fearless trainer who loves swimming, fishing and anything near the water. She will drag you out to the lake and you will be glad she did.'},
 {id:'rumi',area:'hobbies',name:'Rumi',title:'Idol & Demon Hunter',rarity:'SSR',description:'A K-pop idol who sings, dances and hunts demons on the side. Music is how she stays herself, and she practises every single day.'},
 {id:'jester',area:'hobbies',name:'Jester',fullName:'Jester Lavorre',title:'Cleric of Pranks',rarity:'SSR',description:'A bubbly cleric who paints, sketches, pranks and makes pastries. She believes fun is sacred and refuses to let anyone forget it.'},
 {id:'mira',area:'hobbies',name:'Mira',title:'Idol & Demon Hunter',rarity:'SSR',description:'The cool, sharp-witted dancer of her idol group, who choreographs every move herself. She says the hobby you practise is the one that keeps you sane.'},
 {id:'zoey',area:'hobbies',name:'Zoey',title:'Idol & Demon Hunter',rarity:'SSR',description:'The bubbly lyricist and rapper of her idol group, who writes in a notebook every single day. Some days it is a hit song; most days it is just words. Both count.'},
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

/** The player's seven armour tiers (RuneScape style). Art at public/assets/cast/player-<n>.webp; `level` is the TOTAL level that unlocks it.
 *  At ~4 habit points a day in every area: Iron in ~3 days, Mithril ~2 weeks, Rune ~5 weeks, Dragon ~3 months, Barrows ~6 months, Saradomin ~10 months. */
export const PLAYER_STAGES=[
 {stage:1,level:8,title:'Bronze Recruit',art:'cast/player-1.webp'},
 {stage:2,level:150,title:'Iron Squire',art:'cast/player-2.webp'},
 {stage:3,level:280,title:'Mithril Knight',art:'cast/player-3.webp'},
 {stage:4,level:360,title:'Rune Champion',art:'cast/player-4.webp'},
 {stage:5,level:440,title:'Dragon Slayer',art:'cast/player-5.webp'},
 {stage:6,level:490,title:'Barrows Warlord',art:'cast/player-6.webp'},
 {stage:7,level:540,title:'Saradomin’s Chosen',art:'cast/player-7.webp'},
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
