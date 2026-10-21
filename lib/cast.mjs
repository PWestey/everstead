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
 {id:'obiwan',area:'faith',name:'Obi-Wan',fullName:'Obi-Wan Kenobi',title:'Jedi Master',rarity:'SSR',description:'A Jedi Master who spent twenty quiet years in the Tatooine desert keeping watch over a boy who would one day save the galaxy. Dry-witted and endlessly patient, he treats prayer and stillness as daily training, not something you save for emergencies.'},
 {id:'matt',area:'faith',name:'Matt',fullName:'Matt Murdock',title:'Daredevil',rarity:'SSR',description:'A blind Hell’s Kitchen lawyer who goes to confession every week and puts on a mask every night to protect his neighborhood. His faith is messy and hard-won, and it’s the reason he keeps getting back up.'},
 {id:'tchalla',area:'faith',name:'T’Challa',title:'Black Panther',rarity:'SSR',description:'The king of Wakanda, who speaks with his ancestors and keeps his people’s old rites with quiet dignity. He believes a man needs something greater than himself to answer to, and he answers to it daily.'},
 {id:'tavi',area:'marriage',name:'Tavi',fullName:'Gaius Octavian',title:'First Lord of Alera',rarity:'SSR',description:'A boy with no magic who out-thought an empire to become First Lord of Alera, then married Kitai, the Marat warrior who never lets him win an argument. He knows a marriage lasts when you fight the problem together instead of each other.'},
 {id:'steve',area:'marriage',name:'Steve',fullName:'Steve Rogers',title:'Captain America',rarity:'SSR',description:'A skinny Brooklyn kid turned super-soldier who woke up seventy years late for the dance he promised Peggy. Earnest and a bit old-fashioned, he thinks loyalty to your wife shows on the ordinary days, not the big ones.'},
 {id:'din',area:'fatherhood',name:'Din',fullName:'Din Djarin',title:'The Mandalorian',rarity:'SSR',description:'A Mandalorian bounty hunter who was paid to hand over a child and chose to become his father instead. Wherever he goes the little green one rides along, and Din teaches him the only way he knows: by doing it beside him.'},
 {id:'logan',area:'fatherhood',name:'Logan',fullName:'James “Logan” Howlett',title:'Wolverine',rarity:'SSR',description:'A gruff, beer-drinking mutant with adamantium claws who spent a century not caring about anybody, until a kid needed him. He heals from almost anything except missing the moments that matter to the children he loves.'},
 {id:'quill',area:'fatherhood',name:'Quill',fullName:'Peter Quill',title:'Star-Lord',rarity:'SSR',description:'An Earth kid abducted into space and raised by Yondu, a scoundrel who turned out to be the real father figure. Star-Lord knows fatherhood is about who stays and dances with you, not whose blood you share.'},
 {id:'darrow',area:'fitness',name:'Darrow',fullName:'Darrow of Lykos',title:'The Reaper',rarity:'SSR',description:'A Red miner from deep under Lykos who was carved into a Gold warrior and became the Reaper who broke a whole society. He believes the body is forged in sore, early mornings, and he will drag you to the Training Yard to prove it.'},
 {id:'roy',area:'fitness',name:'Roy',title:'Rising Trainer',rarity:'SSR',description:'An eager kid from a tiny island who just set out on his first big journey as a trainer. He never walks when he can run, and he treats every push-up like a step toward being the strongest.'},
 {id:'grog',area:'fitness',name:'Grog',fullName:'Grog Strongjaw',title:'Goliath Barbarian',rarity:'SSR',description:'A huge, cheerful goliath barbarian of Vox Machina who loves lifting things, eating things and his friends, in roughly that order. Strength is simple to him: pick it up, put it down, do it again tomorrow.'},
 {id:'geralt',area:'fitness',name:'Geralt',fullName:'Geralt of Rivia',title:'The White Wolf',rarity:'SSR',description:'A white-haired witcher who hunts monsters for coin and rides a horse named Roach that he will not admit he talks to. He trains, meditates and sharpens his swords every day, because the day he skips is the day something bites.'},
 {id:'tony',area:'work',name:'Tony',fullName:'Tony Stark',title:'Artificer',rarity:'SSR',description:'A genius inventor who built his first suit in a cave and has been tinkering in a workshop ever since. Brilliant, restless and allergic to boredom, he is finally learning that one finished project beats forty half-built prototypes.'},
 {id:'kelsier',area:'work',name:'Kelsier',title:'Survivor of Hathsin',rarity:'SSR',description:'The charming, scarred survivor of the Pits of Hathsin who led a crew of thieves against an immortal emperor. He never walks into a job without a plan, a backup plan and a grin, and he loves helping you plan your work like a heist.'},
 {id:'bruce',area:'work',name:'Bruce',fullName:'Bruce Banner',title:'The Hulk',rarity:'SSR',description:'A brilliant, soft-spoken scientist who shares his body with the Hulk. He keeps the big guy in check with chamomile tea, careful notes and very steady work habits.'},
 {id:'peter',area:'home',name:'Peter',fullName:'Peter Parker',title:'Web-Slinger',rarity:'SSR',description:'A kid from Queens who swings around saving the city and still has to remember trash night for Aunt May. To him, responsibility mostly looks like small, boring chores done on time.'},
 {id:'piotr',area:'home',name:'Piotr',fullName:'Piotr Rasputin',title:'Colossus',rarity:'SSR',description:'A gentle Siberian farm boy who can turn his skin to steel and would much rather paint, cook borscht and fix the porch than fight. He keeps the house tidy and politely expects you to do the same.'},
 {id:'kaladin',area:'discipline',name:'Kaladin',fullName:'Kaladin Stormblessed',title:'Windrunner',rarity:'SSR',description:'A slave turned bridgeman turned Windrunner, who carried his crew out of despair with small daily promises while fighting his own darkness. He keeps his word on the grey days when he feels nothing at all, and Syl never lets him forget it.'},
 {id:'stephen',area:'discipline',name:'Stephen',fullName:'Stephen Strange',title:'Sorcerer Supreme',rarity:'SSR',description:'An arrogant surgeon who wrecked his hands and his career, then rebuilt himself through years of humbling study at Kamar-Taj. He knows mastery means setting your ego aside and repeating the boring basics until they stick.'},
 {id:'anakin',area:'discipline',name:'Anakin',fullName:'Anakin Skywalker',title:'Jedi Knight',rarity:'SSR',description:'The most gifted Jedi of his generation and easily the most impatient, always pushing too fast and too hard. Training with him is a lesson in self-control, for both of you.'},
 {id:'ash',area:'hobbies',name:'Ash',fullName:'Ash Ketchum',title:'Pokémon Trainer',rarity:'SSR',description:'A trainer from Pallet Town who has chased the same dream since he was ten, with Pikachu on his shoulder the whole way. He still wakes up excited every single morning to do the thing he loves.'},
 {id:'harry',area:'hobbies',name:'Harry',fullName:'Harry Potter',title:'The Boy Who Lived',rarity:'SSR',description:'The Boy Who Lived, grown up and catching dark wizards for a living, who still thinks a Sunday Quidditch game with his mates is the best thing going. He spent his childhood in a cupboard, so he takes joy very seriously.'},
 {id:'thor',area:'hobbies',name:'Thor',fullName:'Thor Odinson',title:'God of Thunder',rarity:'SSR',description:'The God of Thunder, a loud, warm-hearted Asgardian who loves feasts, games and a good adventure. He reminds everyone that a full life needs some fun in it, preferably followed by a rematch.'},
 // ---- Second wave: the fifth Fellow per area, give or take ----
 {id:'uther',area:'faith',name:'Uther',fullName:'Uther the Lightbringer',title:'First Paladin',rarity:'SSR',description:'The first paladin of the Silver Hand, a stern old warrior who treated the Light as a duty to rise for every morning. He has little patience for faith that only turns up when it’s convenient.'},
 {id:'saradomin',area:'faith',name:'Saradomin',title:'God of Order',rarity:'SSR',description:'The god of order and wisdom in Gielinor, patron of Falador’s white knights and every quiet prayer. He values the faithful farmer over the famous hero, and asks for faithfulness more than greatness.'},
 {id:'malfurion',area:'marriage',name:'Malfurion',fullName:'Malfurion Stormrage',title:'Archdruid',rarity:'SSR',description:'An archdruid who slept for centuries in the Emerald Dream while his wife Tyrande kept the world safe without him. He knows exactly what absence costs a marriage, and what it takes to finally come home.'},
 {id:'thrall',area:'marriage',name:'Thrall',fullName:'Go’el',title:'Warchief',rarity:'SSR',description:'The orc who freed his people and led the Horde, then set down the mantle of Warchief to marry Aggra and raise a son. He learned the hard way that listening to your wife is tougher than leading an army.'},
 {id:'cal',area:'marriage',name:'Cal',fullName:'Cal Kestis',title:'Jedi Survivor',rarity:'SSR',description:'A Padawan who survived the Jedi Purge by hiding for years, until the crew of the Mantis became his family. With BD-1 riding on his back, he shows up for the people he loves even when running would be easier.'},
 {id:'varian',area:'fatherhood',name:'Varian',fullName:'Varian Wrynn',title:'High King of the Alliance',rarity:'SSR',description:'A gladiator who became High King of the Alliance and nearly lost his son Anduin to his own rage. He spent the rest of his life making it right: fierce, flawed and proud of a boy who never liked swords.'},
 {id:'baine',area:'fatherhood',name:'Baine',fullName:'Baine Bloodhoof',title:'High Chieftain',rarity:'SSR',description:'The tauren High Chieftain who carries his father Cairne’s legacy with quiet strength. He knows a father teaches more by example than by words, and that the lesson outlives him.'},
 {id:'vannaka',area:'fitness',name:'Vannaka',title:'Slayer Master of Edgeville',rarity:'SSR',description:'The gruff slayer master of Edgeville Dungeon, who hands out monster-killing tasks and expects every one finished. He has never accepted an excuse, and he is not about to start with your workout.'},
 {id:'magni',area:'work',name:'Magni',fullName:'Magni Bronzebeard',title:'Speaker of Azeroth',rarity:'SSR',description:'The dwarven king of Ironforge who was turned to diamond and woke up as the Speaker for Azeroth herself. A smith at heart, he believes good work gets hammered out one honest strike at a time, then washed down with ale.'},
 {id:'duradel',area:'work',name:'Duradel',title:'Slayer Master of Shilo Village',rarity:'SSR',description:'The fearsome slayer master of Shilo Village, who only takes on adventurers strong enough for the worst jobs in Gielinor. He says very little and respects exactly one thing: finished results.'},
 {id:'dumbledore',area:'home',name:'Albus',fullName:'Albus Dumbledore',title:'Young Headmaster',rarity:'SSR',description:'Albus Dumbledore as a young man, brilliant and restless, long before he became Hogwarts’ legendary headmaster. He learned the hard way that the greatest magic is a home where people feel safe.'},
 {id:'deadpool',area:'home',name:'Wade',fullName:'Wade Wilson',title:'Deadpool',rarity:'SSR',description:'A wisecracking mercenary with a healing factor, a mouth that never stops and an apartment that should be condemned. Under the jokes is a man who would do anything for the people he lets inside.'},
 {id:'revan',area:'discipline',name:'Revan',title:'Jedi Knight',rarity:'SSR',description:'A legendary Jedi who fell to the dark side, had his memory wiped and chose the light again by sheer force of will. He knows discipline is the bridge between who you were and who you decide to be each morning.'},
 {id:'wiseoldman',area:'hobbies',name:'Wise Old Man',title:'Retired Adventurer',rarity:'SSR',description:'Draynor Village’s famous retiree, seen here in his adventuring prime with a cape for every skill he maxed. He trained every one of them simply because he loved being a beginner.'},
 {id:'rocket',area:'hobbies',name:'Rocket',title:'Guardian of the Galaxy',rarity:'SSR',description:'A genetically engineered raccoon, though you should never call him that, who builds impossible gadgets out of scrap mostly for fun. Under the snark is someone who found his family in the Guardians and would build anything to keep them.'},
 {id:'dalinar',area:'discipline',name:'Dalinar',fullName:'Dalinar Kholin',title:'The Blackthorn',rarity:'SSR',description:'A warlord once called the Blackthorn, who lived for the Thrill of battle and drowned himself in wine before choosing, day after day, to become a better man. He knows discipline is the slow work of refusing who you used to be.'},
 {id:'ragnar',area:'home',name:'Ragnar',fullName:'Ragnar Volarus',title:'Obsidian Prince',rarity:'SSR',description:'A towering Obsidian warrior bred for slaughter who turned out to have a poet’s heart and a gentle voice. He fought his way free to protect his people, and he stays soft-spoken right up until someone threatens the people under his roof.'},
 {id:'sevro',area:'fatherhood',name:'Sevro',fullName:'Sevro au Barca',title:'The Goblin',rarity:'SSR',description:'Darrow’s wild, foul-mouthed best friend and leader of the Howlers, who became a ridiculously devoted dad to his daughter Electra. Chaos on the outside, all heart on the inside.'},
].map(f=>({...f,kind:'fellow',art:art(f.id),portrait:art(f.id)}));

/** Family bring Blessings: a bonus to every Fellow in their area, a smaller bonus to everyone, and income for their building. */
export const FAMILY=[
 {id:'ariane',area:'faith',name:'Ariane',fullName:'Ariane Lumenhart',title:'Wizard of Light',rarity:'SSR',description:'A wizard of light who walked out of the great Wizards’ Tower to tend the chapel of a small village. Warm and a little shy, she keeps her faith burning for other people on purpose, every single day.'},
 {id:'ahsoka',area:'faith',name:'Ahsoka',fullName:'Ahsoka Tano',title:'Wandering Jedi',rarity:'SSR',description:'Anakin Skywalker’s former Padawan, who walked away from the Jedi Order but never from the Force. She listens more than she speaks, and when she does act, it counts.'},
 {id:'lys',area:'faith',name:'Lys',title:'Temple Keeper',rarity:'SSR',description:'A gentle keeper of an old temple who greets every visitor with jasmine tea and a smile. She believes small daily prayers and thank-yous quietly hold the whole world up.'},
 {id:'keyleth',area:'faith',name:'Keyleth',title:'Druid of the Air Ashari',rarity:'SSR',description:'A druid of the Air Ashari who talks to trees, worries constantly about being good enough, and grows a little wiser every season. Her faith is rooted in the living world and in her friends in Vox Machina.'},
 {id:'shadowheart',area:'faith',name:'Shadowheart',title:'Cleric of Selûne',rarity:'SSR',description:'A guarded half-elf cleric who spent years serving Shar before finding her true faith in Selûne. She knows belief is not a feeling but a choice you make again every night under the moon.'},
 {id:'megan',area:'faith',name:'Megan',fullName:'Megan Westman',title:'Priestess of the Light',rarity:'SSR',description:'A warm, bright priestess whose faith shows in how she treats everyone who walks through the Chapel doors. She keeps the lamps lit, writes a gratitude list every night, and saves her best smile for you.'},
 {id:'tyrande',area:'marriage',name:'Tyrande',fullName:'Tyrande Whisperwind',title:'High Priestess of the Moon',rarity:'SSR',description:'The High Priestess of Elune, who has guarded the night elves for ten thousand years and loved Malfurion through all of them, much of it while he slept. To her, a marriage is a vow you keep every night, not just the one you made once.'},
 {id:'padme',area:'marriage',name:'Padmé',fullName:'Padmé Amidala',title:'Senator of Naboo',rarity:'SSR',description:'A teenage queen turned senator of Naboo who gave her whole heart to one man in secret. She knows love needs honesty, attention and time, or it slips away.'},
 {id:'yennefer',area:'marriage',name:'Yennefer',fullName:'Yennefer of Vengerberg',title:'Sorceress',rarity:'SSR',description:'A sharp-tongued, violet-eyed sorceress who smells of lilac and gooseberries and chose Geralt over and over, through every storm. She has zero patience for half-hearted love.'},
 {id:'briget',area:'marriage',name:'Briget',title:'Rose Princess',rarity:'SSR',description:'A graceful princess with a mischievous streak who thinks every marriage deserves a little ceremony every week. Flowers on the table, a dance in the kitchen, a letter for no reason at all.'},
 {id:'kitai',area:'marriage',name:'Kitai',title:'Marat Warrior',rarity:'SSR',description:'A fierce, sharp-tongued Marat warrior bonded to Tavi heart and soul, who teases her “Aleran” husband without mercy. She would cross the world for him without a second thought, and cheat at every race along the way.'},
 {id:'victra',area:'marriage',name:'Victra',fullName:'Victra au Julii',title:'The Julii Heiress',rarity:'SSR',description:'A glamorous Julii heiress with a razor tongue and absolute loyalty, who married Sevro because he was brave enough to love her loudly. She fights for her own like a storm and judges every timid husband she meets.'},
 {id:'vin',area:'fatherhood',name:'Vin',title:'Mistborn',rarity:'SSR',description:'A street orphan from Luthadel who grew up trusting nobody, until Kelsier’s crew became her family and she became Mistborn. She knows better than anyone what a child needs most: someone who keeps showing up.'},
 {id:'hera',area:'fatherhood',name:'Hera',fullName:'Hera Syndulla',title:'Captain of the Ghost',rarity:'SSR',description:'A Twi’lek pilot, rebel captain of the Ghost and mother to Jacen, who kept a ship full of misfits fed and together. She leads with warmth, patience and steady hands on the controls.'},
 {id:'liko',area:'fatherhood',name:'Liko',title:'Young Explorer',rarity:'SSR',description:'A shy, curious girl setting out from home on her first big adventure, when everything still feels huge. She is a reminder of how much a steady, encouraging parent matters when you are young.'},
 {id:'wanda',area:'fatherhood',name:'Wanda',fullName:'Wanda Maximoff',title:'Scarlet Witch',rarity:'SSR',description:'A witch powerful enough to rewrite reality, whose deepest wish was simply to tuck her twin boys into bed. She knows nothing magic makes is as precious as an evening with your kids.'},
 {id:'jean',area:'fatherhood',name:'Jean',fullName:'Jean Grey',title:'Phoenix',rarity:'SSR',description:'A telepath and teacher at Xavier’s school who helped raise a whole generation of frightened young mutants. She believes every child needs someone who sees who they really are, and says so out loud.'},
 {id:'kira',area:'fitness',name:'Kira',fullName:'Kira Carsen',title:'Blade Dancer',rarity:'SSR',description:'A sharp-tongued Jedi with a double-bladed saber and a dark past she outran one training session at a time. She trains hard, jokes harder, and never lets you drop your guard.'},
 {id:'fannie',area:'fitness',name:'Fannie',title:'Explorer',rarity:'SSR',description:'A sunny, restless explorer in rainbow goggles who runs every trail she can find. To her, every run makes the map a little bigger and the mood a little better.'},
 {id:'rey',area:'fitness',name:'Rey',title:'Scavenger Jedi',rarity:'SSR',description:'A scavenger who grew strong hauling scrap across the deserts of Jakku long before she picked up a lightsaber. She knows strength is built from a thousand ordinary days with a heavy pack.'},
 {id:'nemona',area:'fitness',name:'Nemona',title:'Champion Rival',rarity:'SSR',description:'A relentlessly cheerful Champion-ranked trainer who wants to battle, race or spar with anyone, any time. She makes training feel like the best game in the world and declares you her rival on sight.'},
 {id:'karlach',area:'fitness',name:'Karlach',title:'Tiefling Barbarian',rarity:'SSR',description:'A huge-hearted tiefling barbarian who spent ten years fighting in the hells with an infernal engine where her heart should be. She thinks a good workout is basically a party and calls everyone “soldier.”'},
 {id:'shallan',area:'work',name:'Shallan',fullName:'Shallan Davar',title:'Scholar & Artist',rarity:'SSR',description:'A quick-witted Alethi scholar and artist who never goes anywhere without her sketchbook or her humming Cryptic, Pattern. She draws what she sees to understand it, and works hardest on the days she would rather hide behind a new face.'},
 {id:'jaina',area:'work',name:'Jaina',fullName:'Jaina Proudmoore',title:'Lord Admiral & Archmage',rarity:'SSR',description:'A Kul Tiran archmage and Lord Admiral who has led fleets and cities and lived through her own worst mistakes. She carries heavy responsibility with a cool head, careful plans and a long view.'},
 {id:'nash',area:'work',name:'Nash',fullName:'Nash Durango',title:'Bounty Hunter',rarity:'SSR',description:'A wisecracking bounty hunter who always gets the job done and always gets paid on time. Professional, punctual, impossible to rattle and a little too charming for her own good.'},
 {id:'carol',area:'work',name:'Carol',fullName:'Carol Danvers',title:'Captain Marvel',rarity:'SSR',description:'An Air Force test pilot turned cosmic hero who has fallen down more times than anyone and gotten back up every time. She leads from the front, keeps every commitment and expects excellence, starting with herself.'},
 {id:'gamora',area:'work',name:'Gamora',title:'Deadliest Woman in the Galaxy',rarity:'SSR',description:'Thanos’s adopted daughter, trained from childhood to be the deadliest woman in the galaxy, who walked away to join the Guardians. She does the job right the first time and has endless loyalty for her crew of idiots.'},
 {id:'virginia',area:'work',name:'Virginia',fullName:'Virginia au Augustus',title:'Mustang, the Sovereign',rarity:'SSR',description:'Mustang, the brilliant Gold who became Sovereign of the Republic and Darrow’s great love. She out-thinks every room she walks into and expects her partners to keep up.'},
 {id:'leia',area:'work',name:'Leia',fullName:'Leia Organa',title:'Princess and General',rarity:'SSR',description:'A princess, senator and general who never waited for anyone to rescue her. She ran a rebellion with a sharp tongue, a steady blaster and books that always balanced.'},
 {id:'kate',area:'home',name:'Kate',fullName:'Kate Bishop',title:'Archer',rarity:'SSR',description:'A scrappy New York archer who never misses and never quits, with a one-eyed golden retriever named Lucky at her heels. She fixes her own roof and keeps her place in order, because a home you look after looks after you.'},
 {id:'gwen',area:'home',name:'Gwen',fullName:'Gwen Stacy',title:'Spider-Woman',rarity:'SSR',description:'A punk-rock drummer from another universe who fights crime as Spider-Woman and still makes her bed every morning. She thinks the world gets saved one small, boring, responsible thing at a time.'},
 {id:'ororo',area:'home',name:'Ororo',fullName:'Ororo Munroe',title:'Storm',rarity:'SSR',description:'A calm, regal X-Man who grew up on the streets of Cairo and now commands the weather. She still tends her rooftop garden every morning, because she believes a home is something you grow.'},
 {id:'kay',area:'home',name:'Kay',fullName:'Kay Vess',title:'Scoundrel',rarity:'SSR',description:'A street-smart scoundrel who has been running her whole life, with her furry partner Nix always on her shoulder. She is finally building somewhere to come back to, and keeping her ship, her crew and her word.'},
 {id:'annamarie',area:'home',name:'Anna Marie',title:'Rogue',rarity:'SSR',description:'A Mississippi girl better known as Rogue, whose touch steals powers, so she keeps her gloves on and her porch door open. Sweet tea, a warm supper and a seat for everybody make any house a home with her.'},
 {id:'violet',area:'discipline',name:'Violet',fullName:'Violet Sorrengail',title:'Dragon Rider',rarity:'SSR',description:'A scribe-in-training thrown into the brutal war college at Basgiath and forged into a dragon rider. Never the strongest in the room, she made herself the most prepared: daggers sharp, books read, every morning earned.'},
 {id:'alleria',area:'discipline',name:'Alleria',fullName:'Alleria Windrunner',title:'Ranger-Captain',rarity:'SSR',description:'A high elf ranger-captain and the eldest Windrunner sister, with centuries of practice behind every arrow. Her focus is legendary, and so is her contempt for distraction.'},
 {id:'vex',area:'discipline',name:'Vex',fullName:'Vex’ahlia',title:'Ranger of Vox Machina',rarity:'SSR',description:'A sharp-eyed half-elf ranger of Vox Machina who travels with her bear Trinket and never pays full price for anything. She keeps her focus, her budget and her promises.'},
 {id:'laezel',area:'discipline',name:'Lae’zel',title:'Githyanki Warrior',rarity:'SSR',description:'A fierce githyanki warrior raised in the creches of the Astral Sea on relentless discipline and contempt for weakness. She trains every day, judges everyone, and is slowly learning that discipline can be kind.'},
 {id:'natasha',area:'discipline',name:'Natasha',fullName:'Natasha Romanoff',title:'Black Widow',rarity:'SSR',description:'A Russian spy forged in the Red Room who chose her own path and joined the Avengers to pay down old debts. She runs her drills every morning, wastes nothing and always has a plan.'},
 {id:'hermione',area:'discipline',name:'Hermione',fullName:'Hermione Granger',title:'Ministry Witch',rarity:'SSR',description:'The brightest witch of her age, grown up and running half the Ministry of Magic. Her discipline is legendary: color-coded plans, early mornings, and having read the whole book before anyone else opens it.'},
 {id:'misty',area:'hobbies',name:'Misty',title:'Water Trainer',rarity:'SSR',description:'The fiery, fearless Cerulean City Gym Leader who loves swimming, fishing and anything near the water. She will drag you out to the lake for a day off, and you will be glad she did.'},
 {id:'rumi',area:'hobbies',name:'Rumi',title:'Idol & Demon Hunter',rarity:'SSR',description:'The lead singer of a K-pop idol trio who hunts demons on the side and keeps a secret of her own. Music is how she stays herself, and she rehearses every single day.'},
 {id:'jester',area:'hobbies',name:'Jester',fullName:'Jester Lavorre',title:'Cleric of Pranks',rarity:'SSR',description:'A bubbly blue tiefling cleric of the Mighty Nein who paints, bakes, pranks and chats with a god she calls the Traveler. She believes fun is sacred and refuses to let anyone forget it.'},
 {id:'mira',area:'hobbies',name:'Mira',title:'Idol & Demon Hunter',rarity:'SSR',description:'The cool, sharp-witted dancer of her idol group, who choreographs every move herself. Dancing is how she clears her head, and she guards her rehearsal time fiercely.'},
 {id:'zoey',area:'hobbies',name:'Zoey',title:'Idol & Demon Hunter',rarity:'SSR',description:'The bubbly lyricist and rapper of her idol group, who writes in a notebook every single day. Some days it is a hit song and most days it is just words, and she counts both.'},
 {id:'ana',area:'hobbies',name:'Ana',fullName:'Ana Cruz',title:'Gryffindor Witch',rarity:'SSR',description:'A bold, freshly graduated Gryffindor witch who treats every charm like a party trick and every hobby like an adventure. She will talk you into trying something new before you have said yes.'},
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
