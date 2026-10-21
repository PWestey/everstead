// Everstead's game core. One save object, one act() dispatcher, and formulas short enough to read.
// The rule this file exists to protect: every game system is fed by real habits. See DESIGN.md.
import {AREAS,AREA_IDS,FELLOWS,FAMILY,BUILDINGS,BLIGHTS,PLAYER_STAGES,fellowById,familyById,fellowsInArea,familyInArea,queueIndex} from './cast.mjs';
import {habitAction,settleHabits,starterHabits,freshHabits,validHabits,habitEarnings,habitDay,habitPeriod,HABIT_DOMAINS,HABIT_ALIASES} from './habits.mjs';
import {parseSaveJSON} from './save-format.mjs';
import {roamScene} from './stories.mjs';
import {totalLevel,levelUps,skillLevel} from './skills.mjs';
import {QUESTS,questStatus,advanceQuests} from './quests.mjs';
import {TREES,effectsAt} from './dialogue.mjs';
import {momentId} from './moments.mjs';
import {REGIONS} from './expedition-data.mjs';
import {codexCard,codexQueue,codexMastered,reviewed,cardArea} from './codex.mjs';
import {pickCheer} from './cheers.mjs';

export const SAVE_KEY='everstead-save-v1';
export const SAVE_VERSION=1;
export const OFFLINE_CAP_MS=12*3600*1000;

// ---------------------------------------------------------------------------------------------
// Formulas. Change numbers here; nothing else in the game hard-codes them.
// ---------------------------------------------------------------------------------------------
const pts={easy:1,med:2,hard:3};
/** Your armour tier comes from your total level (see lib/skills.mjs).
 * @type {(total:number)=>{stage:number,level:number,title:string,art:string}} */
export const playerStage=total=>PLAYER_STAGES.filter(s=>total>=s.level).at(-1)??PLAYER_STAGES[0];
/** Hero Power = 25 × total level × (1 + 0.15 per armour tier above Bronze). */
export const heroPowerFor=(total,stage)=>Math.round(25*total*(1+0.15*(stage-1)));
/** Total Power = (Hero + Roster) × (1 + 0.2 × balance), balance = smaller half ÷ larger half. Balanced halves earn up to +20%. */
export const combinePower=(hero,roster)=>Math.round((hero+roster)*(1+0.2*(Math.max(hero,roster)?Math.min(hero,roster)/Math.max(hero,roster):0)));

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

/** Expeditions. Step k counts every adventure and boss on the map in order (region r, slot i: k = 5r + i; the boss is slot 4).
 *  Power needed = 400 × 1.3^k. Loot per run: gold 150 × 1.3^k, sigils 3 × 1.15^k and XP 250 × 1.3^k in each of its two areas; bosses pay double. */
const sig2=x=>{const p=10**Math.max(0,Math.floor(Math.log10(x))-1);return Math.round(x/p)*p};
export const expeditionNeed=k=>sig2(400*1.3**k);
export const expeditionLoot=(k,boss=false)=>{const m=boss?2:1;return {gold:sig2(150*1.3**k)*m,sigils:Math.round(3*1.15**k)*m,xp:sig2(250*1.3**k)*m}};
/** How a run goes: Power ÷ need under 1 is locked; under 1.5 a Success (1× loot); under 3 Great (1.5×); 3 or more Overwhelming (2×). */
export const expeditionOutcome=ratio=>ratio<1?null:ratio<1.5?{key:'success',label:'Success',mult:1}:ratio<3?{key:'great',label:'Great',mult:1.5}:{key:'overwhelm',label:'Overwhelming',mult:2};

/** The Codex (knowledge cards in the Archives). Each review pays 10 minutes of your current village income (at least
 *  50 gold) plus 150 XP in the card's area, the same whether you remembered it or not, so honest answers never cost you.
 *  Only the first 40 reviews a day pay; new cards arrive 15 a day. Every 25 cards mastered (box 7) adds +2% building income. */
export const CODEX_REVIEW_SECONDS=600,CODEX_MIN_GOLD=50,CODEX_XP=150,CODEX_PAID_PER_DAY=40,CODEX_NEW_PER_DAY=15,CODEX_MASTERY_STEP=25,CODEX_MASTERY_INCOME=0.02;
export const codexReward=state=>Math.max(CODEX_MIN_GOLD,Math.round(totalRate(state,state.lastAt)*CODEX_REVIEW_SECONDS));

/** Stage n needs 300 × 1.12^(n−1) Roster Power. (Retired: the Watchtower became the Expedition map.) */
export const stagePower=n=>Math.round(300*1.12**(n-1));
export const stageReward=n=>({gold:100*n,crystals:n%5===0?10:0});

/** Blight HP for a tier; habit points in opposed areas deal double. */
export const blightHp=tier=>Math.round(60*(1+0.25*tier));
export const blightReward=tier=>({crystals:30*(tier+1),sigils:10});

/** Recruiting: lifetime habit points needed in their area, by place in the area's queue (1st, 2nd, 3rd…). Family also need a total level. */
export const FELLOW_JOIN=[3,30,90,180,300,450,650,900];
export const FAMILY_JOIN=[15,60,150,280,450,650,900,1200];
export const FAMILY_JOIN_LEVEL=i=>20+40*i;
export const FELLOW_JOIN_POINTS=FELLOW_JOIN[0];
/** What a character needs to join. @returns {{points:number,level:number}} */
export function joinNeed(c){const i=Math.max(0,queueIndex(c)),last=a=>a[Math.min(i,a.length-1)]+(i>=a.length?300*(i-a.length+1):0);return c.kind==='family'?{points:last(FAMILY_JOIN),level:FAMILY_JOIN_LEVEL(i)}:{points:last(FELLOW_JOIN),level:1}}

export const ROAM_CAP=10;
export const GIFTS={posy:{name:'Wildflower posy',gold:500,bond:50},sweets:{name:'Honey sweets',gold:2000,bond:180},jewel:{name:'Starlight pendant',crystals:40,bond:400}};
export const VISIT_BOND=30;

// ---------------------------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------------------------
const empty=keys=>Object.fromEntries(keys.map(k=>[k,0]));
export function fresh(now=Date.now()){return {version:SAVE_VERSION,createdAt:now,lastAt:now,playerName:'Wayfarer',gold:300,crystals:0,earned:0,xp:0,
 fellows:{},family:{},sigils:empty(AREA_IDS),buildings:Object.fromEntries(BUILDINGS.map(b=>[b.id,{level:0}])),
 stage:{cleared:0},blights:{tiers:empty(BLIGHTS.map(b=>b.id)),claimed:[]},roam:{charges:3,seen:[],gateDay:'',advDays:{}},visits:{},stories:{seen:[]},
 bonusXp:empty(AREA_IDS),quests:{},flags:{'roam-refund-1':true},expeditions:{runs:{},bosses:[]},codex:{cards:{},newDay:'',newCount:0,paidDay:'',paidCount:0},
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
export function blessings(state){let all=0;/** @type {Record<string,number>} */const linked={};/** @type {Record<string,number>} */const building={};for(const f of FAMILY){if(!state.family[f.id])continue;const L=familyBond(state,f.id);all+=BLESS_ALL*L;for(const fl of fellowsInArea(f.area))linked[fl.id]=(linked[fl.id]||0)+BLESS_LINKED*L;building[f.area]=(building[f.area]||0)+BLESS_BUILDING*L}return {all,linked,building}}
export function fellowPower(state,id){const f=state.fellows[id];if(!f)return 0;const b=blessings(state);return Math.round(fellowBasePower(f.level,f.stars)*(1+(b.linked[id]||0))*(1+b.all))}
export const heroPower=state=>{const t=totalLevel(state);return heroPowerFor(t,playerStage(t).stage)};
/** The roster half: every recruited Fellow's Power (Family blessings already included). */
export const rosterHalf=state=>Object.keys(state.fellows).reduce((n,id)=>n+fellowPower(state,id),0);
/** Total Power, used by stages and every Power check. */
export function rosterPower(state){return Math.round(combinePower(heroPower(state),rosterHalf(state))*(1+perks(state).power))}
export const totalPower=rosterPower;
/** Power breakdown for the details panel.
 * @returns {any} */
/** Permanent rewards from defeated region bosses, added up. @returns {{roamCap:number,income:number,power:number,loot:number}} */
export function perks(state){const out={roamCap:0,income:0,power:0,loot:0};for(const r of REGIONS)if(state.expeditions?.bosses?.includes(r.boss.id)){out.roamCap+=r.perk.roamCap||0;out.income+=r.perk.income||0;out.power+=r.perk.power||0;out.loot+=r.perk.loot||0}out.income+=CODEX_MASTERY_INCOME*Math.floor(codexMastered(state)/CODEX_MASTERY_STEP);return out}
export const roamCap=state=>ROAM_CAP+perks(state).roamCap;
/** Every place on the map in order, with its step k, region and whether it's the boss. */
export const EXPEDITIONS=REGIONS.flatMap((r,ri)=>[...r.adventures.map((a,i)=>({...a,k:ri*5+i,region:r,boss:false})),{...r.boss,k:ri*5+4,region:r,boss:true}]);
export const expeditionById=id=>EXPEDITIONS.find(e=>e.id===id);
/** A region is open once the previous region's boss is down. */
export const regionOpen=(state,ri)=>ri===0||!!state.expeditions?.bosses?.includes(REGIONS[ri-1].boss.id);
/** Everything the map shows for one place: need, your outcome, loot at that outcome, runs so far. @returns {any} */
export function expeditionView(state,id){const e=expeditionById(id),need=expeditionNeed(e.k),power=rosterPower(state),open=regionOpen(state,REGIONS.indexOf(e.region)),outcome=open?expeditionOutcome(power/need):null,base=expeditionLoot(e.k,e.boss),m=(outcome?.mult||1)*(1+perks(state).loot);
 return {...e,need,power,open,outcome,runs:state.expeditions?.runs?.[id]||0,defeated:e.boss&&!!state.expeditions?.bosses?.includes(id),loot:{gold:Math.round(base.gold*m),sigils:Math.round(base.sigils*m),xp:Math.round(base.xp*m)}}}

export function powerBreakdown(state){const b=blessings(state),t=totalLevel(state),hero=heroPower(state),roster=rosterHalf(state);return {total:rosterPower(state),hero,roster,totalLevel:t,stage:playerStage(t),balance:Math.max(hero,roster)?Math.min(hero,roster)/Math.max(hero,roster):0,fellows:FELLOWS.filter(f=>state.fellows[f.id]).map(f=>({id:f.id,name:f.name,base:fellowBasePower(state.fellows[f.id].level,state.fellows[f.id].stars),linked:b.linked[f.id]||0,power:fellowPower(state,f.id)})),all:b.all}}

function todayAreaPoints(state,now){const day=habitDay(now),out=empty(AREA_IDS),h=state.habits?.history||[];for(let i=h.length-1;i>=0;i--){const x=h[i];if(x.day!==day){if(x.at<now-36*3600e3)break;continue}if(x.kind==='complete'&&out[x.domain]!==undefined)out[x.domain]+=x.points}return out}
export const areaBoost=(state,area,now)=>Math.min(AREA_BOOST_CAP,AREA_BOOST_PER_POINT*todayAreaPoints(state,now)[area]);
export const momentum=(state,now)=>habitEarnings(state.habits,now).multiplier;
export function buildingRate(state,id,now=state.lastAt){const b=BUILDINGS.find(x=>x.id===id),lvl=state.buildings[id]?.level||0;if(!lvl)return 0;const staff=1+0.25*fellowsInArea(b.area).filter(f=>state.fellows[f.id]).length;return buildingBaseRate(lvl)*staff*(1+(blessings(state).building[b.area]||0))*(1+areaBoost(state,b.area,now))*(1+perks(state).income)}
export const baseRate=(state,now=state.lastAt)=>BUILDINGS.reduce((n,b)=>n+buildingRate(state,b.id,now),0);
export const totalRate=(state,now=state.lastAt)=>baseRate(state,now)*momentum(state,now);

/** The blight rising this week: rotates through the six by week number.
 * @returns {any} */
export function currentBlight(state,now){const week=habitPeriod('weekly',now),n=Math.floor(new Date(week.slice(2)+'T12:00:00').getTime()/(7*864e5));const b=BLIGHTS[((n%BLIGHTS.length)+BLIGHTS.length)%BLIGHTS.length],tier=state.blights.tiers[b.id]||0,hp=blightHp(tier);
 let damage=0;for(const x of state.habits?.history||[]){if(x.kind!=='complete'||habitPeriod('weekly',x.at)!==week)continue;damage+=x.points*(b.opposed.includes(x.domain)?2:1)}
 const claimed=state.blights.claimed.includes(week+':'+b.id);return {...b,week,tier,hp,damage:Math.min(damage,hp),defeated:damage>=hp,claimed}}

/** Who is ready to join, by habit points in their area. */
export const fellowReady=(state,f)=>!state.fellows[f.id]&&areaPoints(state,f.area)>=joinNeed(f).points;
export const familyReady=(state,f)=>{if(state.family[f.id])return false;const n=joinNeed(f);return areaPoints(state,f.area)>=n.points&&totalLevel(state)>=n.level};
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
 &&obj(s.roam)&&int(s.roam.charges,0,ROAM_CAP+20)&&obj(s.expeditions)&&obj(s.expeditions.runs)&&Array.isArray(s.expeditions.bosses)&&obj(s.codex)&&obj(s.codex.cards)&&Array.isArray(s.roam.seen)&&obj(s.visits)&&obj(s.stories)&&Array.isArray(s.stories.seen)
 &&obj(s.bonusXp)&&AREA_IDS.every(a=>int(s.bonusXp[a]))&&obj(s.quests)&&Object.entries(s.quests).every(([id,q])=>QUESTS[id]&&obj(q)&&int(q.step,0,99)&&int(q.at))&&obj(s.flags)
 &&obj(s.habits)&&validHabits(s)}catch{return false}}
/** Characters that were swapped out: old id -> new id. Anyone not listed here or in the cast is dropped on load. */
export const RENAMED={kael:'darrow',ren:'kaladin',sable:'kira',elise:'shallan',isolde:'violet',liora:'ariane',maren:'tyrande',wren:'kate',aldric:'obiwan',corin:'tony',tobin:'peter'};
const domainFix=d=>HABIT_DOMAINS.includes(d)?d:HABIT_ALIASES[d]||'general';
/** Bring an older save up to the current cast and areas: rename or drop characters, remap habit areas, fill new fields. */
export function migrate(s,now=Date.now()){const base=fresh(s.createdAt||now),out={...base,...s};
 const remap=(map,exists)=>Object.fromEntries(Object.entries(map||{}).map(([id,v])=>[RENAMED[id]||id,v]).filter(([id])=>exists(id)));
 out.fellows=remap(s.fellows,fellowById);out.family=remap(s.family,familyById);
 out.sigils={...base.sigils};for(const [k,v] of Object.entries(s.sigils||{})){const a=domainFix(k);if(a in out.sigils)out.sigils[a]+=Number(v)||0}
 out.buildings={...base.buildings};for(const b of BUILDINGS)if(s.buildings?.[b.id])out.buildings[b.id]=s.buildings[b.id];
 out.blights={...base.blights,...(s.blights||{}),tiers:{...base.blights.tiers,...(s.blights?.tiers||{})}};
 out.bonusXp={...base.bonusXp};for(const [k,v] of Object.entries(s.bonusXp||{}))if(k in out.bonusXp)out.bonusXp[k]+=Number(v)||0;
 out.quests=Object.fromEntries(Object.entries(s.quests||{}).filter(([id])=>QUESTS[id]));
 if(s.habits){const h=structuredClone(s.habits);for(const x of h.items||[])x.domain=domainFix(x.domain);for(const x of h.history||[])x.domain=domainFix(x.domain);
  if(h.taskBackup?.items)for(const x of h.taskBackup.items)x.domain=domainFix(x.domain);
  const totals=Object.fromEntries(HABIT_DOMAINS.map(k=>[k,{actions:0,points:0}]));for(const [k,v] of Object.entries(h.totals||{})){const a=domainFix(k);totals[a].actions+=v.actions||0;totals[a].points+=v.points||0}h.totals=totals;
  if(h.undo)h.undo=null;out.habits=h}
 // One-time: Roams spent at the Village Gate before the Map existed come back as a full bar. New saves start with the flag set.
 if(!s.flags?.['roam-refund-1']){out.roam={...out.roam,charges:Math.max(out.roam.charges,roamCap(out))};out.flags={...out.flags,'roam-refund-1':true}}
 return out}
export function decode(raw){const s=typeof raw==='string'?parseSaveJSON(raw):raw;if(!obj(s))throw Error('That file is not an Everstead save.');if(s.version!==SAVE_VERSION)throw Error('This save is from a different version of the game.');const merged=migrate(s);if(!valid(merged))throw Error('This save failed its checks and was not loaded.');return merged}

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
function areaRewards(state,rows){const s=structuredClone(state);for(const r of rows){if(!AREA_IDS.includes(r.domain))continue;s.sigils[r.domain]+=r.points;for(const fam of familyInArea(r.domain))if(s.family[fam.id])s.family[fam.id].bond+=r.points*10;if(r.period.startsWith('d:'))s.roam.charges=Math.min(roamCap(s),s.roam.charges+1)}return s}
function reverseAreaRewards(state,rows){const s=structuredClone(state);for(const r of rows){if(!AREA_IDS.includes(r.domain))continue;s.sigils[r.domain]=Math.max(0,s.sigils[r.domain]-r.points);for(const fam of familyInArea(r.domain))if(s.family[fam.id])s.family[fam.id].bond=Math.max(0,s.family[fam.id].bond-r.points*10);if(r.period.startsWith('d:'))s.roam.charges=Math.max(0,s.roam.charges-1)}return s}
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
  const q=advanceQuests(next,now);next=q.state;
  const ups=levelUps(s,next),tierBefore=playerStage(totalLevel(s)).stage,tierAfter=playerStage(totalLevel(next)).stage;
  const message=r.message+(q.moved.length?` · Quest updated: ${q.moved.join(', ')}`:'');
  const cheer=afterRows.length>beforeRows.length?pickCheer(s,next,afterRows.slice(beforeRows.length),now):null;
  return ok(next,message,{arrivals:newlyReady(s,next),levelUps:ups,newTier:tierAfter>tierBefore?tierAfter:0,cheer});
 }
 if(kind==='dialogue')return dialogueAct(s,target,value,now);
 switch(kind){
  case 'recruitFellow':{const f=fellowById(target);if(!f)return no(s,'Unknown Fellow');if(s.fellows[f.id])return no(s,f.name+' has already joined');if(!fellowReady(s,f))return no(s,`Reach ${joinNeed(f).points} ${AREAS.find(a=>a.id===f.area).name} habit points to meet ${f.name}`);
   return ok({...s,fellows:{...s.fellows,[f.id]:{level:1,stars:0}}},f.name+' joined Everstead!',{recruited:f.id,story:'intro:'+f.id})}
  case 'recruitFamily':{const f=familyById(target);if(!f)return no(s,'Unknown Family member');if(s.family[f.id])return no(s,f.name+' is already family');if(!familyReady(s,f))return no(s,`Reach level ${joinNeed(f).level} and ${joinNeed(f).points} ${AREAS.find(a=>a.id===f.area).name} points to welcome ${f.name}`);
   return ok({...s,family:{...s.family,[f.id]:{bond:0}}},f.name+' joined your family!',{welcomed:f.id,story:'intro:'+f.id})}
  case 'levelUp':{const f=s.fellows[target];if(!f)return no(s,'Recruit this Fellow first');const times=value==='max'?10000:Math.max(1,Math.min(10000,Number(value)||1));let lvl=f.level,gold=s.gold,n=0;const cap=fellowLevelCap(f.stars);
   while(n<times&&lvl<cap&&gold>=fellowLevelCost(lvl)){gold-=fellowLevelCost(lvl);lvl++;n++}
   if(!n)return no(s,lvl>=cap?`Level cap ${cap}. Earn a star to raise it.`:`Need ${fellowLevelCost(lvl).toLocaleString()} gold`);
   // Every 5th level he has something to say (one moment per purchase, however many levels it bought).
   const talk=Math.floor(lvl/5)>Math.floor(f.level/5)?momentId(target,'level',Math.floor(lvl/5)-1):null;
   return ok({...s,gold,fellows:{...s.fellows,[target]:{...f,level:lvl}}},`${fellowById(target).name} reached level ${lvl}`,{talk})}
  case 'starUp':{const f=s.fellows[target],def=fellowById(target);if(!f)return no(s,'Recruit this Fellow first');if(f.stars>=MAX_STARS)return no(s,'Already at max stars');const cost=starCost(f.stars+1);if(s.sigils[def.area]<cost)return no(s,`Need ${cost} ${AREAS.find(a=>a.id===def.area).name} sigils`);
   return ok({...s,sigils:{...s.sigils,[def.area]:s.sigils[def.area]-cost},fellows:{...s.fellows,[target]:{...f,stars:f.stars+1}}},`${def.name} earned star ${f.stars+1}!`,{talk:momentId(target,'star',f.stars)})}
  case 'buildingUpgrade':{const b=BUILDINGS.find(x=>x.id===target);if(!b)return no(s,'Unknown building');const lvl=s.buildings[b.id].level,cost=lvl?buildingUpgradeCost(lvl):BUILDING_OPEN_COST;if(s.gold<cost)return no(s,`Need ${cost.toLocaleString()} gold`);
   return ok({...s,gold:s.gold-cost,buildings:{...s.buildings,[b.id]:{level:lvl+1}}},lvl?`${b.name} upgraded to level ${lvl+1}`:`${b.name} is open for business`)}
  case 'expedition':{const e=expeditionById(target);if(!e)return no(s,'Unknown place');const v=expeditionView(s,target);if(!v.open)return no(s,'Defeat the last region’s boss to open '+e.region.name);
   if(!v.outcome)return no(s,`${e.title} needs ${v.need.toLocaleString('en-US')} Power. You have ${v.power.toLocaleString('en-US')}.`);if(s.roam.charges<1)return no(s,'No Roams left. Complete daily habits to earn more.');
   const sig={...s.sigils},bx={...s.bonusXp};for(const a of e.areas){sig[a]+=v.loot.sigils;bx[a]=(bx[a]||0)+v.loot.xp}
   const firstWin=e.boss&&!v.defeated;let next={...s,gold:s.gold+v.loot.gold,earned:s.earned+v.loot.gold,sigils:sig,bonusXp:bx,roam:{...s.roam,charges:s.roam.charges-1},
    expeditions:{runs:{...s.expeditions.runs,[target]:v.runs+1},bosses:firstWin?[...s.expeditions.bosses,target]:s.expeditions.bosses}};
   const ups=levelUps(s,next);
   return ok(next,`${v.outcome.label}! +${v.loot.gold.toLocaleString('en-US')} gold`,{expedition:{id:target,title:e.title,outcome:v.outcome,loot:v.loot,areas:e.areas,first:v.runs===0,perk:firstWin?e.region.perk.text:null,opened:firstWin?REGIONS[REGIONS.indexOf(e.region)+1]?.name||null:null},levelUps:ups})}
  case 'challenge':{const n=s.stage.cleared+1,need=stagePower(n),power=rosterPower(s);if(power<need)return no(s,`Stage ${n} needs ${need.toLocaleString()} Power. You have ${power.toLocaleString()}.`);const r=stageReward(n);
   return ok({...s,gold:s.gold+r.gold,earned:s.earned+r.gold,crystals:s.crystals+r.crystals,stage:{cleared:n}},`Stage ${n} cleared! +${r.gold} gold${r.crystals?` · +${r.crystals} crystals`:''}`,{cleared:n})}
  case 'blightClaim':{const b=currentBlight(s,now);if(!b.defeated)return no(s,`${b.name} still stands. Keep up your habits.`);if(b.claimed)return no(s,'Already claimed this week');const r=blightReward(b.tier),sig={...s.sigils};for(const a of b.opposed)sig[a]+=r.sigils;
   return ok({...s,crystals:s.crystals+r.crystals,sigils:sig,blights:{tiers:{...s.blights.tiers,[b.id]:b.tier+1},claimed:[...s.blights.claimed.slice(-60),b.week+':'+b.id]}},`${b.name} is pushed back! +${r.crystals} crystals · +${r.sigils} sigils each for ${b.opposed.map(a=>AREAS.find(x=>x.id===a).name).join(' and ')}`)}
  // The Village Gate is free once a day; Roams are only spent on the Expedition Map.
  case 'roam':{const day=habitDay(now);if(s.roam.gateDay===day)return no(s,'You’ve walked the village today. Come back tomorrow.');const scene=roamScene(s,now);if(!scene)return no(s,'Nobody to meet yet. Recruit a Fellow first.');let next={...s,roam:{...s.roam,gateDay:day,seen:[...s.roam.seen.slice(-200),scene.id]}};
   if(scene.kind==='family'&&next.family[scene.with])next={...next,family:{...next.family,[scene.with]:{bond:next.family[scene.with].bond+scene.bond}}};
   if(scene.gold)next={...next,gold:next.gold+scene.gold,earned:next.earned+scene.gold};
   return ok(next,scene.summary,{scene})}
  case 'gift':{const f=s.family[target],g=GIFTS[value];if(!f||!g)return no(s,'Choose a family member and a gift');if(g.gold&&s.gold<g.gold)return no(s,`Need ${g.gold.toLocaleString()} gold`);if(g.crystals&&s.crystals<g.crystals)return no(s,`Need ${g.crystals} crystals`);
   return ok({...s,gold:s.gold-(g.gold||0),crystals:s.crystals-(g.crystals||0),family:{...s.family,[target]:{bond:f.bond+g.bond}}},`${familyById(target).name} loved the ${g.name.toLowerCase()} · +${g.bond} bond`,{talk:momentId(target,'gift',Math.floor(f.bond))})}
  case 'visit':{const f=s.family[target];if(!f)return no(s,'Welcome them to your family first');const day=habitDay(now);if(s.visits[target]===day)return no(s,'You already spent time together today');
   return ok({...s,visits:{...s.visits,[target]:day},family:{...s.family,[target]:{bond:f.bond+VISIT_BOND}}},`You spent time with ${familyById(target).name} · +${VISIT_BOND} bond`,{talk:momentId(target,'visit',Math.floor(f.bond/VISIT_BOND))})}
  case 'rename':{const name=String(value||'').trim().slice(0,30);if(!name)return no(s,'Choose a name');return ok({...s,playerName:name},'Your name is now '+name)}
  // A Codex review: value is true ("got it") or false ("forgot"). Pays the same either way, for the first 40 a day.
  case 'codexReview':{const card=codexCard(target);if(!card)return no(s,'Unknown card');const day=habitDay(now),prog=s.codex.cards[target];
   if(!codexQueue(s,day,CODEX_NEW_PER_DAY).queue.some(k=>k.id===target))return no(s,prog?'That card isn’t due yet':'No more new cards today. More arrive tomorrow.');
   const paidCount=s.codex.paidDay===day?s.codex.paidCount:0,paid=paidCount<CODEX_PAID_PER_DAY,gold=paid?codexReward(s):0,area=cardArea(card);
   const after=reviewed(prog,!!value,day),newlyMastered=after.mastered&&!prog?.mastered;
   const next={...s,gold:s.gold+gold,earned:s.earned+gold,bonusXp:paid?{...s.bonusXp,[area]:(s.bonusXp[area]||0)+CODEX_XP}:s.bonusXp,
    codex:{...s.codex,cards:{...s.codex.cards,[target]:after},paidDay:day,paidCount:paidCount+(paid?1:0),
     newDay:day,newCount:(s.codex.newDay===day?s.codex.newCount:0)+(prog?0:1)}};
   return ok(next,paid?`+${gold.toLocaleString('en-US')} gold · +${CODEX_XP} XP`:'Reviewed (today’s paid reviews are used up)',{codex:{gold,xp:paid?CODEX_XP:0,area,mastered:newlyMastered},levelUps:levelUps(s,next)})}
  case 'storySeen':{if(typeof target!=='string'||s.stories.seen.includes(target))return ok(s,'');return ok({...s,stories:{seen:[...s.stories.seen,target]}},'')}
  default:return no(s,'Unknown action');
 }
}
/** Apply the effects of a dialogue node or choice. Story trees pay out once per save; adventures
 *  pay every time but cost a roam. Quest effects check the quest is really at that conversation. */
function dialogueAct(s,treeId,value,now){
 const tree=TREES[treeId];const node=value?.node,opt=value?.opt??null;const fx=tree?effectsAt(treeId,node,opt):null;
 if(!tree||!fx)return no(s,'Unknown conversation');if(!fx.length)return ok(s,'');
 const claim=`${treeId}:${node}:${opt??'n'}`;if(!tree.adventure&&s.flags[claim])return ok(s,'');
 let n={...s,flags:tree.adventure?s.flags:{...s.flags,[claim]:true},bonusXp:{...s.bonusXp},sigils:{...s.sigils}};const notes=[];let questDone=null;
 for(const e of fx){
  if(e.adventure){const day=habitDay(now);if(n.roam.advDays?.[treeId]===day)return no(s,'You’ve done this one today. Come back tomorrow.');n={...n,roam:{...n.roam,advDays:{...(n.roam.advDays||{}),[treeId]:day}}}}
  else if(e.flag)n={...n,flags:{...n.flags,[e.flag]:true}};
  else if(e.gold){n={...n,gold:n.gold+e.gold,earned:n.earned+e.gold};notes.push(`+${e.gold} gold`)}
  else if(e.xp){const [a,x]=e.xp;n.bonusXp[a]=(n.bonusXp[a]||0)+x;notes.push(`+${x.toLocaleString()} ${AREAS.find(z=>z.id===a)?.name} XP`)}
  else if(e.sigils){const [a,x]=e.sigils;n.sigils[a]+=x;notes.push(`+${x} ${AREAS.find(z=>z.id===a)?.name} sigils`)}
  else if(e.bond){const [id,x]=e.bond;if(n.family[id])n={...n,family:{...n.family,[id]:{bond:n.family[id].bond+x}}}}
  else if(e.quest){const [qid,op]=e.quest,q=QUESTS[qid],st=questStatus(n,qid);if(!q)return no(s,'Unknown quest');
   const atThisTalk=st.step?.type==='talk'&&st.step.tree===treeId;
   if(op==='start'){if(st.status!=='available'||!atThisTalk)return no(s,'That quest isn’t available yet');n={...n,quests:{...n.quests,[qid]:{step:1,at:now}}};notes.push(`Quest started: ${q.name}`)}
   else if(op==='advance'){if(st.status!=='active'||!atThisTalk)return no(s,'That conversation isn’t needed right now');n={...n,quests:{...n.quests,[qid]:{step:st.stepIndex+1,at:now}}};n=advanceQuests(n,now).state}
   else if(op==='complete'){if(st.status!=='active'||!atThisTalk)return no(s,'That conversation isn’t needed right now');
    n={...n,quests:{...n.quests,[qid]:{step:q.steps.length,at:now,done:true}},gold:n.gold+(q.rewards.gold||0),earned:n.earned+(q.rewards.gold||0)};
    for(const [a,x] of q.rewards.xp||[])n.bonusXp[a]=(n.bonusXp[a]||0)+x;for(const [a,x] of q.rewards.sigils||[])n.sigils[a]+=x;questDone=qid}}
 }
 const ups=levelUps(s,n),tierBefore=playerStage(totalLevel(s)).stage,tierAfter=playerStage(totalLevel(n)).stage;
 return ok(n,notes.join(' · '),{levelUps:ups,questDone,newTier:tierAfter>tierBefore?tierAfter:0});
}
export {floorGold,HABIT_DOMAINS,skillLevel};
