// Expedition world data: regions on the map, each with four adventures and a boss. Art is Old School
// RuneScape's (public/assets/osrs/). Numbers come from the formulas in lib/expeditions.mjs; this file is
// only places, names and which life areas an adventure trains. Scenes live in lib/expeditions/scenes.mjs.

/** @type {{id:string,name:string,blurb:string,bg:string,perk:{text:string,roamCap?:number,income?:number,power?:number},
 *   adventures:{id:string,title:string,blurb:string,art:string,bg?:string,areas:string[]}[],
 *   boss:{id:string,title:string,blurb:string,art:string,bg?:string,areas:string[]}}[]} */
export const REGIONS=[
 {id:'lumbridge',name:'Lumbridge',blurb:'Green fields, a castle on the river and goblins who never learn.',bg:'osrs/bg-lumbridge.webp',
  perk:{text:'+2 Roam storage (you can hold 12)',roamCap:2},
  adventures:[
   {id:'cow-field',title:'The Cow Field',blurb:'Hides, milk and a farmer who needs a hand.',art:'osrs/cow.webp',areas:['home','fitness']},
   {id:'goblin-village',title:'Goblin Village',blurb:'The goblins are arguing about colours again.',art:'osrs/goblin.webp',areas:['fitness','discipline']},
   {id:'lumbridge-swamp',title:'Lumbridge Swamp',blurb:'Fog, frogs and a mine nobody admits to owning.',art:'osrs/giant-frog.webp',bg:'osrs/bg-lumbridge-swamp.webp',areas:['work','hobbies']},
   {id:'draynor-manor',title:'Draynor Manor',blurb:'The house on the hill. The doors close behind you.',art:'osrs/draynor-manor.webp',bg:'osrs/bg-draynor-manor.webp',areas:['faith','discipline']},
  ],
  boss:{id:'count-draynor',title:'Count Draynor',blurb:'The vampyre in the basement wakes up hungry.',art:'osrs/count-draynor.webp',bg:'osrs/bg-draynor-manor.webp',areas:['faith','fitness']}},
 {id:'asgarnia',name:'Asgarnia',blurb:'White stone Falador, the frozen mountain and the knights who guard both.',bg:'osrs/bg-falador.webp',
  perk:{text:'+10% gold from every building',income:0.1},
  adventures:[
   {id:'dwarven-mine',title:'The Dwarven Mine',blurb:'Ore, dark tunnels and dwarves with opinions.',art:'osrs/dwarf.webp',bg:'osrs/bg-dwarven-mine.webp',areas:['work','fitness']},
   {id:'ice-mountain',title:'Ice Mountain',blurb:'A climb, a hermit and warriors made of frost.',art:'osrs/ice-warrior.webp',bg:'osrs/bg-ice-mountain.webp',areas:['fitness','faith']},
   {id:'black-knights-fortress',title:'Black Knights’ Fortress',blurb:'Sneak in, listen close, get out with the plans.',art:'osrs/black-knight.webp',areas:['discipline','work']},
   {id:'taverley-dungeon',title:'Taverley Dungeon',blurb:'Below the druids’ village, something breathes fire.',art:'osrs/blue-dragon.webp',bg:'osrs/bg-taverley.webp',areas:['fitness','hobbies']},
  ],
  boss:{id:'giant-mole',title:'The Giant Mole',blurb:'Falador Park has a very, very large problem.',art:'osrs/giant-mole.webp',bg:'osrs/bg-falador-park.webp',areas:['home','marriage']}},
 {id:'morytania',name:'Morytania',blurb:'A dark land across the Salve, where the faithful hold the line.',bg:'osrs/bg-canifis.webp',
  perk:{text:'+10% to all your Power',power:0.1},
  adventures:[
   {id:'canifis',title:'Canifis by Night',blurb:'The villagers are friendly. Until the moon rises.',art:'osrs/werewolf.webp',areas:['discipline','marriage']},
   {id:'mort-myre',title:'Mort Myre Swamp',blurb:'Ghouls in the reeds and a temple worth reaching.',art:'osrs/ghoul.webp',bg:'osrs/bg-mort-myre.webp',areas:['faith','fatherhood']},
   {id:'port-phasmatys',title:'Port Phasmatys',blurb:'A town of ghosts who just want to rest.',art:'osrs/ghost.webp',bg:'osrs/bg-port-phasmatys.webp',areas:['faith','home']},
   {id:'vampyre-hunt',title:'The Vampyre Hunt',blurb:'Join the Myreque and take the fight to the night.',art:'osrs/vampyre.webp',areas:['fitness','fatherhood']},
  ],
  boss:{id:'barrows',title:'The Barrows Brothers',blurb:'Six crypts. Six brothers. One very famous armour set.',art:'osrs/dharok.webp',bg:'osrs/bg-barrows.webp',areas:['discipline','fitness']}},
];
export const ADVENTURE_IDS=REGIONS.flatMap(r=>[...r.adventures.map(a=>a.id),r.boss.id]);
