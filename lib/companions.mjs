// Companions: 32 creatures (16 Pokémon, 16 Aniimo), four per life area. Each one grows from the habits of its
// area and from treats, evolves along its line, and boosts every Fellow of its area. One starter per area; the
// rest are found on the Expedition Map (boss first-wins and every 8th run) and at Gauntlet milestones.
// Art lives at public/assets/companions/<stage id>.webp (scripts/companion-art.mjs). Each line is one entry:
// {id, area, source, starter, stages:[{id,name}]} where stages run from the base form to the final evolution.

const L=(area,source,starter,...stages)=>({id:stages[0].toLowerCase(),area,source,starter,stages:stages.map(n=>({id:n.toLowerCase().replace(/[^a-z]/g,''),name:n}))});
/** @type {{id:string,area:string,source:'Pokémon'|'Aniimo',starter:boolean,stages:{id:string,name:string}[]}[]} */
export const COMPANIONS=[
 L('faith','Pokémon',true,'Riolu','Lucario'),
 L('faith','Pokémon',false,'Dratini','Dragonair','Dragonite'),
 L('faith','Aniimo',false,'Lunara'),
 L('faith','Aniimo',false,'Helion'),
 L('marriage','Pokémon',true,'Seel','Dewgong'),
 L('marriage','Pokémon',false,'Bulbasaur','Ivysaur','Venusaur'),
 L('marriage','Aniimo',false,'Flutternym','Gracewing','Somniwing'),
 L('marriage','Aniimo',false,'Iris','Irisal','Irisalis'),
 L('fatherhood','Pokémon',true,'Lillipup','Herdier','Stoutland'),
 L('fatherhood','Pokémon',false,'Snorlax'),
 L('fatherhood','Aniimo',false,'Cubbo','Grizbo'),
 L('fatherhood','Aniimo',false,'Susuta','Popota','Panpanta'),
 L('fitness','Pokémon',true,'Scorbunny','Raboot','Cinderace'),
 L('fitness','Pokémon',false,'Machop','Machoke','Machamp'),
 L('fitness','Aniimo',false,'Emberpup','Flameruff','Scorchhowl'),
 L('fitness','Aniimo',false,'Bolty','Blazen'),
 L('work','Pokémon',true,'Cufant','Copperajah'),
 L('work','Pokémon',false,'Squirtle','Wartortle','Blastoise'),
 L('work','Aniimo',false,'Shelly','Sheldon','Sherro'),
 L('work','Aniimo',false,'Fentuft','Fenmane'),
 L('home','Pokémon',true,'Growlithe','Arcanine'),
 L('home','Pokémon',false,'Wailmer','Wailord'),
 L('home','Aniimo',false,'Skippy','Pranky','Glacy'),
 L('home','Aniimo',false,'Nimbi','Turbo'),
 L('discipline','Pokémon',true,'Froakie','Frogadier','Greninja'),
 L('discipline','Pokémon',false,'Maschiff','Mabostiff'),
 L('discipline','Aniimo',false,'Bonesky','Fenrier','Glynsera'),
 L('discipline','Aniimo',false,'Wisptis','Fulmintis'),
 L('hobbies','Pokémon',true,'Charmander','Charmeleon','Charizard'),
 L('hobbies','Pokémon',false,'Chikorita','Bayleef','Meganium'),
 L('hobbies','Aniimo',false,'Celestis','Stellarys'),
 L('hobbies','Aniimo',false,'Eko','Eklue'),
];
export const companionById=id=>COMPANIONS.find(c=>c.id===id);
export const companionsInArea=area=>COMPANIONS.filter(c=>c.area===area);
export const companionArt=(c,stage)=>'companions/'+c.stages[Math.min(stage,c.stages.length)-1].id+'.webp';
export const companionName=(c,stage)=>c.stages[Math.min(stage,c.stages.length)-1].name;

// Formulas
export const COMPANION_CAP=40;
/** EXP to go from level L to L+1. */
export const companionLevelCost=L=>Math.round(25*L**1.5);
/** Stage 2 opens at level 10, stage 3 at level 25. */
export const EVOLVE_AT=[10,25];
export const HABIT_EXP=25;
export const TREAT_EXP=100;
/** Level from lifetime EXP (levels are never bought: EXP simply accrues). */
export function companionLevel(exp){let L=1,spent=0;while(L<COMPANION_CAP&&spent+companionLevelCost(L)<=exp){spent+=companionLevelCost(L);L++}return L}
/** EXP already spent reaching the current level. */
export function companionLevelFloor(level){let n=0;for(let L=1;L<level;L++)n+=companionLevelCost(L);return n}
/** Companion milestones: ×1.15 at 10 and 25 (the evolution levels), ×1.25 at the cap. */
export const COMPANION_MILESTONES=[[10,1.15],[25,1.15],[40,1.25]];
export const companionMilestoneMult=level=>COMPANION_MILESTONES.reduce((m,[at,x])=>level>=at?m*x:m,1);
/** Power boost one companion gives every Fellow of its area: 0.4% × Level^1.15 × milestones + 5% per evolution. */
export const companionBoost=(level,stage)=>0.004*level**1.15*companionMilestoneMult(level)+0.05*(stage-1);
export const canEvolve=(c,state)=>{const o=state.companions?.[c.id];return !!o&&o.stage<c.stages.length&&companionLevel(o.exp)>=EVOLVE_AT[o.stage-1]};
/** Total companion boost for an area. */
export function areaCompanionBoost(state,area){let n=0;for(const c of companionsInArea(area)){const o=state.companions?.[c.id];if(o)n+=companionBoost(companionLevel(o.exp),o.stage)}return n}
/** Day a companion turns up on its own: starters day 1, then 10, 20, 30 for the rest of the area. */
export const companionDay=c=>c.starter?1:10*(companionsInArea(c.area).filter(x=>!x.starter).indexOf(c)+1);
export const freshCompanions=()=>Object.fromEntries(COMPANIONS.filter(c=>c.starter).map(c=>[c.id,{exp:0,stage:1}]));
/** Give the first unowned companion, preferring the given areas. Returns [state, line|null]. */
export function findCompanion(state,areas=[]){const pool=[...areas.flatMap(companionsInArea),...COMPANIONS].find(c=>!state.companions?.[c.id]);if(!pool)return [state,null];
 return [{...state,companions:{...state.companions,[pool.id]:{exp:0,stage:1}}},pool]}
/** Add EXP to every owned companion of an area. */
export function feedArea(state,area,exp){const out={...state.companions};for(const c of companionsInArea(area))if(out[c.id])out[c.id]={...out[c.id],exp:Math.max(0,out[c.id].exp+exp)};return {...state,companions:out}}
