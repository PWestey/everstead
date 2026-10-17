// Everstead's game core. One save object, one act() dispatcher, and formulas short enough to read.
// The rule this file exists to protect: every game system is fed by real habits. See DESIGN.md.
import {AREAS,AREA_IDS,FELLOWS,FAMILY,BUILDINGS,BLIGHTS,PLAYER_STAGES,fellowById,familyById,fellowForArea,familyForArea,buildingForArea} from './cast.mjs';
import {habitAction,settleHabits,starterHabits,freshHabits,validHabits,habitEarnings,habitDay,habitPeriod,HABIT_DOMAINS} from './habits.mjs';
import {parseSaveJSON} from './save-format.mjs';
import {roamScene} from './stories.mjs';

export const SAVE_KEY='everstead-save-v1';
export const SAVE_VERSION=1;
export const OFFLINE_CAP_MS=12*3600*1000;

// ---------------------------------------------------------------------------------------------
// Formulas. Change numbers here; nothing else in the game hard-codes them.
// ---------------------------------------------------------------------------------------------
const pts={easy:1,med:2,hard:3};
/** XP needed to go from level L to L+1. Cumulative XP for level L is 30·L·(L−1). */
export const xpForLevel=level=>60*level;
export const playerLevel=xp=>{let L=1;while(30*(L+1)*L<=xp)L++;return L};
export const playerLevelProgress=xp=>{const L=playerLevel(xp),floor=30*L*(L-1),need=xpForLevel(L);return {level:L,into:xp-floor,need}};
/** @type {(level:number)=>{stage:number,level:number,title:string,art:string}} */
export const playerStage=level=>PLAYER_STAGES.filter(s=>level>=s.level).at(-1)??PLAYER_STAGES[0];
export const playerPower=level=>150*level;

/** Fellow Power = 100 × Level × (1 + 0.25 × Stars). */
export const fellowBasePower=(level,stars)=>Math.round(100*level*(1+0.25*stars));
export const fellowLevelCap=stars=>20+20*stars;
export const fellowLevelCost=level=>Math.round(50*level**1.5);
export const MAX_STARS=5;
/** Star n costs 15·n² sigils of the Fellow's own area. */
export const starCost=nextStar=>15*nextStar*nextStar;

/** Family Bond level from bond XP; level L→L+1 costs 100·L. */
export const bondLevel=xp=>{let L=1;while(50*(L+1)*L<=xp)L++;return L};
export const bondProgress=xp=>{const L=bondLevel(xp),floor=50*L*(L-1);return {level:L,into:xp-floor,need:100*L}};
/** Blessings per Bond level: linked Fellow, every Fellow, and the area's building income. */
export const BLESS_LINKED=0.03,BLESS_ALL=0.005,BLESS_BUILDING=0.02;

/** Building income in gold per second at a level; upgrade cost from level L. */
export const buildingBaseRate=level=>level>0?0.02*level:0;
export const buildingUpgradeCost=level=>Math.round(200*1.5**(level-1));
export const BUILDING_OPEN_COST=150;
/** Today's habits in an area boost its building: +5% per habit point, capped at +50%. */
export const AREA_BOOST_PER_POINT=0.05,AREA_BOOST_CAP=0.5;

/** Stage n needs 300 × 1.12^(n−1) Roster Power. */
export const stagePower=n=>Math.round(300*1.12**(n-1));
export const stageReward=n=>({gold:100*n,crystals:n%5===0?10:0});

/** Blight HP for a tier; habit points in opposed areas deal double. */
export const blightHp=tier=>Math.round(60*(1+0.25*tier));
export const blightReward=tier=>({crystals:30*(tier+1),sigils:10});

/** Recruiting: habit points needed in an area before its Fellow or Family member can join. */
export const FELLOW_JOIN_POINTS=3,FAMILY_JOIN_POINTS=15,FAMILY_JOIN_LEVEL=3;

export const ROAM_CAP=10;
export const GIFTS={posy:{name:'Wildflower posy',gold:500,bond:50},sweets:{name:'Honey sweets',gold:2000,bond:180},jewel:{name:'Starlight pendant',crystals:40,bond:400}};
export const VISIT_BOND=30;

// ---------------------------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------------------------
const empty=keys=>Object.fromEntries(keys.map(k=>[k,0]));
export function fresh(now=Date.now()){return {version:SAVE_VERSION,createdAt:now,lastAt:now,playerName:'Wayfarer',gold:300,crystals:0,earned:0,xp:0,
 fellows:{},family:{},sigils:empty(AREA_IDS),buildings:Object.fromEntries(BUILDINGS.map(b=>[b.id,{level:0}])),
 stage:{cleared:0},blights:{tiers:empty(BLIGHTS.map(b=>b.id)),claimed:[]},roam:{charges:3,seen:[]},visits:{},stories:{seen:[]},
 habits:starterHabits(now)}}
export const startingSave=fresh;
/** New Journey: the village starts over, the habit journal (tasks, history, streaks) is kept. */
export function newJourney(state,now=Date.now()){return {...fresh(now),habits:structuredClone(state.habits||freshHabits(now))}}

// ---------------------------------------------------------------------------------------------
// Derived values
// ---------------------------------------------------------------------------------------------
export const areaPoints=(state,area)=>state.habits?.totals?.[area]?.points||0;
/** Player stats for the radar: lifetime habit points per area. */
export const playerStats=state=>Object.fromEntries(AREA_IDS.map(a=>[a,areaPoints(state,a)]));
export const familyBond=(state,id)=>bondLevel(state.family[id]?.bond||0);
/** Total Family blessing percentages.
 * @returns {{all:number,linked:Record<string,number>,building:Record<string,number>}} */
export function blessings(state){let all=0;/** @type {Record<string,number>} */const linked={};/** @type {Record<string,number>} */const building={};for(const f of FAMILY){if(!state.family[f.id])continue;const L=familyBond(state,f.id);all+=BLESS_ALL*L;linked[fellowForArea(f.area).id]=BLESS_LINKED*L;building[f.area]=BLESS_BUILDING*L}return {all,linked,building}}
export function fellowPower(state,id){const f=state.fellows[id];if(!f)return 0;const b=blessings(state);return Math.round(fellowBasePower(f.level,f.stars)*(1+(b.linked[id]||0))*(1+b.all))}
export function rosterPower(state){const b=blessings(state);return Math.round(playerPower(playerLevel(state.xp))*(1+b.all))+Object.keys(state.fellows).reduce((n,id)=>n+fellowPower(state,id),0)}
/** Power breakdown for the details panel.
 * @returns {any} */
export function powerBreakdown(state){const b=blessings(state),L=playerLevel(state.xp);return {player:Math.round(playerPower(L)*(1+b.all)),fellows:FELLOWS.filter(f=>state.fellows[f.id]).map(f=>({id:f.id,name:f.name,base:fellowBasePower(state.fellows[f.id].level,state.fellows[f.id].stars),linked:b.linked[f.id]||0,power:fellowPower(state,f.id)})),all:b.all,total:rosterPower(state)}}

function todayAreaPoints(state,now){const day=habitDay(now),out=empty(AREA_IDS),h=state.habits?.history||[];for(let i=h.length-1;i>=0;i--){const x=h[i];if(x.day!==day){if(x.at<now-36*3600e3)break;continue}if(x.kind==='complete'&&out[x.domain]!==undefined)out[x.domain]+=x.points}return out}
export const areaBoost=(state,area,now)=>Math.min(AREA_BOOST_CAP,AREA_BOOST_PER_POINT*todayAreaPoints(state,now)[area]);
export const momentum=(state,now)=>habitEarnings(state.habits,now).multiplier;
export function buildingRate(state,id,now=state.lastAt){const b=BUILDINGS.find(x=>x.id===id),lvl=state.buildings[id]?.level||0;if(!lvl)return 0;const staff=state.fellows[fellowForArea(b.area).id]?1.25:1;return buildingBaseRate(lvl)*staff*(1+(blessings(state).building[b.area]||0))*(1+areaBoost(state,b.area,now))}
export const baseRate=(state,now=state.lastAt)=>BUILDINGS.reduce((n,b)=>n+buildingRate(state,b.id,now),0);
export const totalRate=(state,now=state.lastAt)=>baseRate(state,now)*momentum(state,now);

/** The blight rising this week: rotates through the six by week number.
 * @returns {any} */
export function currentBlight(state,now){const week=habitPeriod('weekly',now),n=Math.floor(new Date(week.slice(2)+'T12:00:00').getTime()/(7*864e5));const b=BLIGHTS[((n%BLIGHTS.length)+BLIGHTS.length)%BLIGHTS.length],tier=state.blights.tiers[b.id]||0,hp=blightHp(tier);
 let damage=0;for(const x of state.habits?.history||[]){if(x.kind!=='complete'||habitPeriod('weekly',x.at)!==week)continue;damage+=x.points*(b.opposed.includes(x.domain)?2:1)}
 const claimed=state.blights.claimed.includes(week+':'+b.id);return {...b,week,tier,hp,damage:Math.min(damage,hp),defeated:damage>=hp,claimed}}

/** Who is ready to join, by habit points in their area. */
export const fellowReady=(state,f)=>!state.fellows[f.id]&&areaPoints(state,f.area)>=FELLOW_JOIN_POINTS;
export const familyReady=(state,f)=>!state.family[f.id]&&areaPoints(state,f.area)>=FAMILY_JOIN_POINTS&&playerLevel(state.xp)>=FAMILY_JOIN_LEVEL;
export const fellowCanImprove=(state,id)=>{const f=state.fellows[id];if(!f)return false;const def=fellowById(id);return (f.level<fellowLevelCap(f.stars)&&state.gold>=fellowLevelCost(f.level))||(f.stars<MAX_STARS&&state.sigils[def.area]>=starCost(f.stars+1))};

// ---------------------------------------------------------------------------------------------
// Validation and decoding
// ---------------------------------------------------------------------------------------------
const obj=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const num=(x,a=0,b=1e15)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b;
const int=(x,a=0,b=1e15)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
export function valid(s){try{return obj(s)&&s.version===SAVE_VERSION&&int(s.createdAt)&&int(s.lastAt)&&typeof s.playerName==='string'&&s.playerName.length<=30&&num(s.gold)&&int(s.crystals)&&num(s.earned)&&int(s.xp)
 &&obj(s.fellows)&&Object.entries(s.fellows).every(([id,f])=>fellowById(id)&&obj(f)&&int(f.level,1,10000)&&int(f.stars,0,MAX_STARS))
 &&obj(s.family)&&Object.entries(s.family).every(([id,f])=>familyById(id)&&obj(f)&&int(f.bond))
 &&obj(s.sigils)&&AREA_IDS.every(a=>int(s.sigils[a]))
 &&obj(s.buildings)&&BUILDINGS.every(b=>obj(s.buildings[b.id])&&int(s.buildings[b.id].level,0,10000))
 &&obj(s.stage)&&int(s.stage.cleared)&&obj(s.blights)&&obj(s.blights.tiers)&&BLIGHTS.every(b=>int(s.blights.tiers[b.id]))&&Array.isArray(s.blights.claimed)
 &&obj(s.roam)&&int(s.roam.charges,0,ROAM_CAP)&&Array.isArray(s.roam.seen)&&obj(s.visits)&&obj(s.stories)&&Array.isArray(s.stories.seen)
 &&obj(s.habits)&&validHabits(s)}catch{return false}}
export function decode(raw){const s=typeof raw==='string'?parseSaveJSON(raw):raw;if(!obj(s))throw Error('That file is not an Everstead save.');if(s.version!==SAVE_VERSION)throw Error('This save is from a different version of the game.');const merged={...fresh(s.createdAt||Date.now()),...s};if(!valid(merged))throw Error('This save failed its checks and was not loaded.');return merged}

// ---------------------------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------------------------
/** Accrue building income since lastAt (capped), and roll the habit journal forward. */
export function settle(state,now=Date.now()){if(now<=state.lastAt)return state;const span=Math.min(now-state.lastAt,OFFLINE_CAP_MS)/1000,gain=totalRate(state,state.lastAt)*span;const s=settleHabits(state,now);return {...s,gold:s.gold+gain,earned:s.earned+gain,lastAt:now}}

// ---------------------------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------------------------
const ok=(state,message,extra={})=>({state,message,...extra});
const no=(state,error)=>({state,error});
const floorGold=s=>({...s,gold:Math.max(0,s.gold)});

/** Area rewards for completed-habit rows: star sigils, Family bond and roam charges. */
function areaRewards(state,rows){const s=structuredClone(state);for(const r of rows){if(!AREA_IDS.includes(r.domain))continue;s.sigils[r.domain]+=r.points;const fam=familyForArea(r.domain);if(s.family[fam.id])s.family[fam.id].bond+=r.points*10;if(r.period.startsWith('d:'))s.roam.charges=Math.min(ROAM_CAP,s.roam.charges+1)}return s}
function reverseAreaRewards(state,rows){const s=structuredClone(state);for(const r of rows){if(!AREA_IDS.includes(r.domain))continue;s.sigils[r.domain]=Math.max(0,s.sigils[r.domain]-r.points);const fam=familyForArea(r.domain);if(s.family[fam.id])s.family[fam.id].bond=Math.max(0,s.family[fam.id].bond-r.points*10);if(r.period.startsWith('d:'))s.roam.charges=Math.max(0,s.roam.charges-1)}return s}
const completeRows=h=>(h?.history||[]).filter(x=>x.kind==='complete');

/** What a habit action changed in arrivals: new recruits become "ready" as area points grow. */
function newlyReady(before,after){const out=[];for(const f of FELLOWS)if(!fellowReady(before,f)&&fellowReady(after,f))out.push({id:f.id,name:f.name,kind:'fellow'});for(const f of FAMILY)if(!familyReady(before,f)&&familyReady(after,f))out.push({id:f.id,name:f.name,kind:'family'});return out}

export function act(state,kind,now=Date.now(),target=null,value=null){
 const s=settle(state,now);
 if(kind==='collect')return ok(s,'');
 if(kind.startsWith('habit')){
  const beforeRows=completeRows(s.habits);
  const r=habitAction(s,kind,target,value,now);if(!r)return no(s,'Unknown action');if(r.error)return no(s,r.error);
  let next=r.state;const afterRows=completeRows(next.habits);
  if(afterRows.length>beforeRows.length)next=areaRewards(next,afterRows.slice(beforeRows.length));
  else if(kind==='habitUndo'&&afterRows.length<beforeRows.length)next=reverseAreaRewards(next,beforeRows.slice(afterRows.length));
  const levelBefore=playerLevel(s.xp),levelAfter=playerLevel(next.xp);
  const message=r.message+(levelAfter>levelBefore?` · You reached level ${levelAfter}!`:'');
  return ok(next,message,{arrivals:newlyReady(s,next),levelUp:levelAfter>levelBefore?levelAfter:0});
 }
 switch(kind){
  case 'recruitFellow':{const f=fellowById(target);if(!f)return no(s,'Unknown Fellow');if(s.fellows[f.id])return no(s,f.name+' has already joined');if(!fellowReady(s,f))return no(s,`Complete ${FELLOW_JOIN_POINTS} points of ${AREAS.find(a=>a.id===f.area).name} habits to meet ${f.name}`);
   return ok({...s,fellows:{...s.fellows,[f.id]:{level:1,stars:0}}},f.name+' joined Everstead!',{recruited:f.id,story:'intro:'+f.id})}
  case 'recruitFamily':{const f=familyById(target);if(!f)return no(s,'Unknown Family member');if(s.family[f.id])return no(s,f.name+' is already family');if(!familyReady(s,f))return no(s,`Reach level ${FAMILY_JOIN_LEVEL} and ${FAMILY_JOIN_POINTS} ${AREAS.find(a=>a.id===f.area).name} points to welcome ${f.name}`);
   return ok({...s,family:{...s.family,[f.id]:{bond:0}}},f.name+' joined your family!',{welcomed:f.id,story:'intro:'+f.id})}
  case 'levelUp':{const f=s.fellows[target];if(!f)return no(s,'Recruit this Fellow first');const times=value==='max'?10000:Math.max(1,Math.min(10000,Number(value)||1));let lvl=f.level,gold=s.gold,n=0;const cap=fellowLevelCap(f.stars);
   while(n<times&&lvl<cap&&gold>=fellowLevelCost(lvl)){gold-=fellowLevelCost(lvl);lvl++;n++}
   if(!n)return no(s,lvl>=cap?`Level cap ${cap}. Earn a star to raise it.`:`Need ${fellowLevelCost(lvl).toLocaleString()} gold`);
   return ok({...s,gold,fellows:{...s.fellows,[target]:{...f,level:lvl}}},`${fellowById(target).name} reached level ${lvl}`)}
  case 'starUp':{const f=s.fellows[target],def=fellowById(target);if(!f)return no(s,'Recruit this Fellow first');if(f.stars>=MAX_STARS)return no(s,'Already at max stars');const cost=starCost(f.stars+1);if(s.sigils[def.area]<cost)return no(s,`Need ${cost} ${AREAS.find(a=>a.id===def.area).name} sigils`);
   return ok({...s,sigils:{...s.sigils,[def.area]:s.sigils[def.area]-cost},fellows:{...s.fellows,[target]:{...f,stars:f.stars+1}}},`${def.name} earned star ${f.stars+1}!`)}
  case 'buildingUpgrade':{const b=BUILDINGS.find(x=>x.id===target);if(!b)return no(s,'Unknown building');const lvl=s.buildings[b.id].level,cost=lvl?buildingUpgradeCost(lvl):BUILDING_OPEN_COST;if(s.gold<cost)return no(s,`Need ${cost.toLocaleString()} gold`);
   return ok({...s,gold:s.gold-cost,buildings:{...s.buildings,[b.id]:{level:lvl+1}}},lvl?`${b.name} upgraded to level ${lvl+1}`:`${b.name} is open for business`)}
  case 'challenge':{const n=s.stage.cleared+1,need=stagePower(n),power=rosterPower(s);if(power<need)return no(s,`Stage ${n} needs ${need.toLocaleString()} Power. You have ${power.toLocaleString()}.`);const r=stageReward(n);
   return ok({...s,gold:s.gold+r.gold,earned:s.earned+r.gold,crystals:s.crystals+r.crystals,stage:{cleared:n}},`Stage ${n} cleared! +${r.gold} gold${r.crystals?` · +${r.crystals} crystals`:''}`,{cleared:n})}
  case 'blightClaim':{const b=currentBlight(s,now);if(!b.defeated)return no(s,`${b.name} still stands. Keep up your habits.`);if(b.claimed)return no(s,'Already claimed this week');const r=blightReward(b.tier),sig={...s.sigils};for(const a of b.opposed)sig[a]+=r.sigils;
   return ok({...s,crystals:s.crystals+r.crystals,sigils:sig,blights:{tiers:{...s.blights.tiers,[b.id]:b.tier+1},claimed:[...s.blights.claimed.slice(-60),b.week+':'+b.id]}},`${b.name} is pushed back! +${r.crystals} crystals · +${r.sigils} sigils each for ${b.opposed.map(a=>AREAS.find(x=>x.id===a).name).join(' and ')}`)}
  case 'roam':{if(s.roam.charges<1)return no(s,'No roams left. Complete daily habits to earn more.');const scene=roamScene(s,now);if(!scene)return no(s,'Nobody to meet yet. Recruit a Fellow first.');let next={...s,roam:{charges:s.roam.charges-1,seen:[...s.roam.seen.slice(-200),scene.id]}};
   if(scene.kind==='family'&&next.family[scene.with])next={...next,family:{...next.family,[scene.with]:{bond:next.family[scene.with].bond+scene.bond}}};
   if(scene.gold)next={...next,gold:next.gold+scene.gold,earned:next.earned+scene.gold};
   return ok(next,scene.summary,{scene})}
  case 'gift':{const f=s.family[target],g=GIFTS[value];if(!f||!g)return no(s,'Choose a family member and a gift');if(g.gold&&s.gold<g.gold)return no(s,`Need ${g.gold.toLocaleString()} gold`);if(g.crystals&&s.crystals<g.crystals)return no(s,`Need ${g.crystals} crystals`);
   return ok({...s,gold:s.gold-(g.gold||0),crystals:s.crystals-(g.crystals||0),family:{...s.family,[target]:{bond:f.bond+g.bond}}},`${familyById(target).name} loved the ${g.name.toLowerCase()} · +${g.bond} bond`)}
  case 'visit':{const f=s.family[target];if(!f)return no(s,'Welcome them to your family first');const day=habitDay(now);if(s.visits[target]===day)return no(s,'You already spent time together today');
   return ok({...s,visits:{...s.visits,[target]:day},family:{...s.family,[target]:{bond:f.bond+VISIT_BOND}}},`You spent time with ${familyById(target).name} · +${VISIT_BOND} bond`)}
  case 'rename':{const name=String(value||'').trim().slice(0,30);if(!name)return no(s,'Choose a name');return ok({...s,playerName:name},'Your name is now '+name)}
  case 'storySeen':{if(typeof target!=='string'||s.stories.seen.includes(target))return ok(s,'');return ok({...s,stories:{seen:[...s.stories.seen,target]}},'')}
  default:return no(s,'Unknown action');
 }
}
export {floorGold,HABIT_DOMAINS};
