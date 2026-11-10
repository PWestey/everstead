// Everstead's game core. One save object, one act() dispatcher, and formulas short enough to read.
// The rule this file exists to protect: every game system is fed by real habits. See DESIGN.md.
import {AREAS,AREA_IDS,FELLOWS,FAMILY,BUILDINGS,BLIGHTS,PLAYER_STAGES,fellowById,familyById,characterById,fellowsInArea,familyInArea,queueIndex} from './cast.mjs';
import {habitAction,settleHabits,starterHabits,freshHabits,validHabits,habitEarnings,habitDay,habitPeriod,HABIT_DOMAINS,HABIT_ALIASES} from './habits.mjs';
import {parseSaveJSON} from './save-format.mjs';
import {roamScene} from './stories.mjs';
import {totalLevel,levelUps,skillLevel,MAX_TOTAL} from './skills.mjs';
import {QUESTS,questStatus,advanceQuests} from './quests.mjs';
import {TREES,effectsAt} from './dialogue.mjs';
import {momentId} from './moments.mjs';
import {REGIONS} from './expedition-data.mjs';
import {COMPANIONS,companionById,companionName,companionLevel,canEvolve,areaCompanionBoost,freshCompanions,findCompanion,feedArea,companionDay,HABIT_EXP,TREAT_EXP,EVOLVE_AT} from './companions.mjs';
import {codexCard,codexQueue,codexMastered,reviewed,cardArea} from './codex.mjs';
import {pickCheer} from './cheers.mjs';
import {modeAct,freshModes,seeded} from './modes.mjs';
import {specOf,roleOf,squadSet,relicById,relicsOfTier,legendaryOfBoss,RELICS,FRANCHISE,SPECS} from './traits.mjs';

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
/** Hero Power: 25 × total level × armour, then ×1.01 per total level past the max cape (792). Level is the log of XP and Map XP grows 30% a step, so this is about ×1.23 a step: slower than the needs. */
export const HERO_COMPOUND=1.01;
export const heroPowerFor=(total,stage)=>Math.round(25*total*(1+0.15*(stage-1))*HERO_COMPOUND**Math.max(0,total-MAX_TOTAL));
/** Total Power = (Hero + Roster) × (1 + 0.2 × balance), balance = smaller half ÷ larger half. Balanced halves earn up to +20%. */
export const combinePower=(hero,roster)=>Math.round((hero+roster)*(1+0.2*(Math.max(hero,roster)?Math.min(hero,roster)/Math.max(hero,roster):0)));

/** Power milestones: reaching one of these levels multiplies a Fellow's Power for good (×1.25 at 10, 25, 50 and 75; ×1.5 at 99). */
export const MILESTONES=[[10,1.25],[25,1.25],[50,1.25],[75,1.25],[99,1.5]];
/** Past 99 a milestone comes every 25 levels (125, 150, …), each ×1.25. There is no last one. */
export const milestoneMult=(level,list=MILESTONES)=>list.reduce((m,[at,x])=>level>=at?m*x:m,1)*(level>=125?1.25**Math.floor((level-100)/25):1);
export const nextMilestone=(level,list=MILESTONES)=>list.find(([at])=>at>level)||[125+25*Math.floor((Math.max(level,100)-100)/25),1.25];
export const LEVEL_CURVE=1.15;
/** Fellow Power = 100 × Level^1.15 × milestones × (1 + 0.25 × Stars). */
export const fellowBasePower=(level,stars)=>Math.round(100*level**LEVEL_CURVE*milestoneMult(level)*(1+0.25*stars));
/** Fellow levels cost Fellow EXP (earned on the Map, the Rift, the Spire, the Arena and the Gauntlet): 50 × Level^1.65 (the extra 0.15 pays for the Power curve, so milestones are the real bonus). */
export const fellowLevelCost=level=>Math.round(50*level**1.65*1.25**(level/25));
/** Building staff: slots open with the building's level (1, then +1 every 3 levels, max 4). Each worker adds +25%, plus +25% per doubling of his Power past 10,000. */
export const staffSlots=level=>level>0?Math.min(4,1+Math.floor((level-1)/3)):0;
export const staffBonus=power=>0.25+0.25*Math.log2(1+power/10000);
/** Power feeds the village: every open building earns +1 gold/s per 40,000 total Power, before its multipliers. */
export const POWER_INCOME=1/40000;
/** Stars shown as glyphs; past five the count is written out. Stars never stop: star n costs 15·n² sigils and raises the cap by 20. */
export const MAX_STARS=5;
/** Star n costs 15·n² sigils of the Fellow's own area. */
export const starCost=nextStar=>15*nextStar*nextStar;

/** Family Bond level from bond XP: level L→L+1 costs 100 × L^1.5. No cap: gifts cost 5% more per level, so bond grows with the log of your gold. */
export const bondNeed=L=>Math.round(100*L**1.5);
/** Bond used up by the levels below L, from a table that grows as far as anyone has climbed. */
const BOND_SPENT=[0,0];
export const bondSpent=L=>{while(BOND_SPENT.length<=L)BOND_SPENT.push(BOND_SPENT[BOND_SPENT.length-1]+bondNeed(BOND_SPENT.length-1));return BOND_SPENT[L]};
/** Level L holds while bondSpent(L) <= xp < bondSpent(L+1); found by doubling then halving, since this runs for every Family member on every Power check. */
export const bondLevel=xp=>{let hi=2;while(bondSpent(hi)<=xp)hi*=2;let lo=1;while(hi-lo>1){const m=(lo+hi)>>1;if(bondSpent(m)<=xp)lo=m;else hi=m}return lo};
/** Remembers the last answer while the parts of the save it was worked out from are the same objects. Those parts are replaced, never changed in place, and the
 * once-a-second income tick leaves them alone, so Power and blessings are worked out once per real change instead of dozens of times a second. */
const remember=(parts,work)=>{let last=null,value;return state=>{const p=parts(state);if(last&&p.every((x,i)=>x===last[i]))return value;value=work(state);last=p;return value}};
export const bondProgress=xp=>{const L=bondLevel(xp);let floor=0;for(let l=1;l<L;l++)floor+=bondNeed(l);return {level:L,into:xp-floor,need:bondNeed(L)}};
/** A gift's price for someone at this bond level: 5% more per level, so gold never outruns bond. */
export const GIFT_MARKUP=1.05;
export const giftPrice=(g,level)=>Math.round((g.gold||g.crystals)*GIFT_MARKUP**(level-1));
/** Blessings per Bond level: linked Fellow, every Fellow, and the area's building income. */
export const BLESS_LINKED=0.03,BLESS_ALL=0.0012,BLESS_DECAY=0.85,BLESS_BUILDING=0.02;
/** Everyone's share of the village-wide blessing: bond levels ranked highest first, the k-th weighted 0.85^(k-1), so every member counts, welcoming someone never costs Power, and the total can never pass 6.7 × the best bond. */
export const blessAll=levels=>BLESS_ALL*[...levels].sort((a,b)=>b-a).reduce((t,l,i)=>t+l*BLESS_DECAY**i,0);
/** One member's current share of it, given her rank (0 = closest) among the family. */
export const blessShare=(level,rank)=>BLESS_ALL*level*BLESS_DECAY**rank;

/** Specialties, roles, sets, paths and relics (data in lib/traits.mjs). A specialist counts ×1.25 in her own mode; at level (or bond) 50 and 100 a character picks a path: Focus (+0.25 to that ×) or Steady (+5% Power everywhere).
 * A Provider in the squad adds +5% gold, a Mentor +5% Fellow EXP; a Guardian holds one more wave on a Front and makes Gauntlet wounds 2 lighter. Three of a franchise in one squad fight ×1.2. */
export const SPEC_MULT=1.25,PATH_AT=[50,100],PATH_FOCUS=0.25,PATH_STEADY=0.05,ROLE_PROVIDER=0.05,ROLE_MENTOR=0.05,GUARD_WAVE=1,GUARD_WOUND=2,SET_SIZE=3,SET_MULT=1.2;
/** Relics drop from Map runs (5%, bosses 15%), by tier common 60 / rare 30 / epic 10; a boss drops its own legendary 4% of the time and surely on every 25th run of it. Gauntlet floors 10, 25 (rare) and 50 (epic) and every 25th Spire floor (epic) always drop one. */
export const RELIC_DROP=0.05,RELIC_BOSS_DROP=0.15,RELIC_TIERS=[['common',0.6],['rare',0.3],['epic',0.1]],RELIC_LEGENDARY=0.04,RELIC_PITY=25;
export const pathsOf=(s,id)=>s.paths?.[id]||[];
export const steadyMult=(s,id)=>(1+PATH_STEADY)**pathsOf(s,id).filter(p=>p==='steady').length;
/** Each drop rolls once: its affix is the catalogue value × (0.8 + 0.4 × roll), so the best roll is ×1.2 the worst ×0.8; 95%+ is "perfect". The Forge (in the Workshop) salvages an unworn relic into shards by tier,
 * rerolls one for twice its shards, or ascends one a tier (common→rare 5, rare→epic 15 shards; epics and legendaries stay). A reroll or ascension rolls afresh. Shards come only from relics, so only from Roams. */
export const ROLL_MIN=0.8,ROLL_SPAN=0.4,ROLL_PERFECT=0.95,SHARDS={common:1,rare:3,epic:10,legendary:30},REROLL_MULT=2,ASCEND={common:5,rare:15},TIER_UP={common:'rare',rare:'epic'};
export const rolled=(r,roll)=>r.value*(ROLL_MIN+ROLL_SPAN*roll);
export const rollPct=roll=>Math.round(roll*100)+'%';
/** One owned relic: its catalogue entry with the rolled value, plus uid and roll. */
export const relicAt=(s,uid)=>{const it=s.relics?.items?.[uid],r=it&&relicById(it.id);return r?{...r,uid,roll:it.roll,value:rolled(r,it.roll)}:null};
export const relicsOwned=s=>Object.keys(s.relics?.items||{}).map(uid=>relicAt(s,uid)).filter(Boolean);
export const isWorn=(s,uid)=>Object.values(s.relics?.worn||{}).includes(uid);
export const wornRelic=(s,id)=>relicAt(s,s.relics?.worn?.[id]);
/** Spares: unworn relics that are not the best roll of their kind. */
export const relicSpares=s=>{const best={};for(const r of relicsOwned(s))if(!best[r.id]||r.roll>best[r.id].roll)best[r.id]=r;return relicsOwned(s).filter(r=>!isWorn(s,r.uid)&&best[r.id].uid!==r.uid)};
export const ascendsTo=r=>TIER_UP[r.tier]?RELICS.find(x=>x.kind===r.kind&&x.tier===TIER_UP[r.tier]&&!x.boss)||null:null;
/** A relic's affix of one kind on its wearer; a legendary counts double on one of its own franchise. */
export const relicBonus=(s,id,kind)=>{const r=wornRelic(s,id);return r&&r.kind===kind?r.value*(r.franchise&&FRANCHISE[id]===r.franchise?2:1):0};
/** How much more a character counts in a mode: her specialty (plus Focus paths) and a relic for that mode. */
export const specMult=(s,id,mode)=>(specOf(id)===mode?SPEC_MULT+PATH_FOCUS*pathsOf(s,id).filter(p=>p==='focus').length:1)*(1+relicBonus(s,id,mode));
export const setMult=ids=>squadSet(ids,SET_SIZE)?SET_MULT:1;
export const squadGoldMult=(s,ids)=>1+ids.reduce((n,id)=>n+(roleOf(id)==='provider'?ROLE_PROVIDER:0)+relicBonus(s,id,'gold'),0);
export const squadExpMult=(s,ids)=>1+ids.reduce((n,id)=>n+(roleOf(id)==='mentor'?ROLE_MENTOR:0)+relicBonus(s,id,'exp'),0);
export const guardians=ids=>ids.filter(id=>roleOf(id)==='guardian').length;

/** Building income in gold per second at a level; upgrade cost from level L. */
export const buildingBaseRate=level=>level>0?0.02*level:0;
/** Building level multiplies its income: +15% per level, and every 10th level is a milestone worth ×1.25 on top (cost is ×1.5 per level, so each level
 * is dearer than the last; without the milestones a level past 40 is worth about 2% and upgrading stops being a decision). */
export const BUILDING_LEVEL_BONUS=0.15,BUILDING_MILESTONE=10,BUILDING_MILESTONE_MULT=1.25;
export const buildingLevelMult=level=>(1+BUILDING_LEVEL_BONUS*level)*BUILDING_MILESTONE_MULT**Math.floor(level/BUILDING_MILESTONE);
export const buildingUpgradeCost=level=>Math.round(200*1.5**(level-1));
export const BUILDING_OPEN_COST=150;
/** Today's habits in an area boost its building: +5% per habit point, capped at +50%. */
export const AREA_BOOST_PER_POINT=0.05,AREA_BOOST_CAP=0.5;

/** Expeditions. Step k counts every adventure and boss on the map in order (region r, slot i: k = 5r + i; the boss is slot 4).
 *  Power needed = 400 × MAP_GROWTH^k. Loot per run: gold 150 × g^k, Fellow EXP 50 × g^k, sigils 3 + k/5, XP 250 × g^k in each of its two areas; bosses pay double. */
const sig2=x=>{const p=10**Math.max(0,Math.floor(Math.log10(x))-1);return Math.round(x/p)*p};
/** How much harder (and how much richer) each Map step is than the last. Needs, loot and the lap multiplier all follow it.
 * 1.2 paces the 150-step lap at about 7 months for an 8-habit player and 11 for a 4-habit one; at 1.3 neither reached the last 15 regions in a year. */
export const MAP_GROWTH=1.2;
export const expeditionNeed=k=>sig2(400*MAP_GROWTH**k);
export const expeditionLoot=(k,boss=false)=>{const m=boss?2:1;return {gold:sig2(150*MAP_GROWTH**k)*m,exp:sig2(50*MAP_GROWTH**k)*m,sigils:(3+Math.floor(k/5))*m,xp:sig2(250*MAP_GROWTH**k)*m}};
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
export function fresh(now=Date.now()){return {version:SAVE_VERSION,createdAt:now,lastAt:now,playerName:'Wayfarer',gold:300,fellowExp:1500,treats:3,companions:freshCompanions(),crystals:0,earned:0,xp:0,relics:{items:{},worn:{},shards:0,next:1},paths:{},
 fellows:{},family:{},sigils:empty(AREA_IDS),buildings:Object.fromEntries(BUILDINGS.map(b=>[b.id,{level:0}])),
 stage:{cleared:0},blights:{tiers:empty(BLIGHTS.map(b=>b.id)),claimed:[]},roam:{charges:3,seen:[],gateDay:'',advDays:{}},visits:{},familyTalks:{},stories:{seen:[]},
 bonusXp:empty(AREA_IDS),quests:{},flags:{'roam-refund-1':true,'map-30-1':true,'sigils-fair-1':true,'sigils-fair-2':true},expeditions:{runs:{},bosses:[],lap:1,lapBosses:[]},codex:{cards:{},newDay:'',newCount:0,paidDay:'',paidCount:0},modes:freshModes(),trainer:{fellows:0,family:0,auto:false},
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
export const blessings=remember(s=>[s.family],function(state){/** @type {Record<string,number>} */const best={};const levels=[];for(const f of FAMILY){if(!state.family[f.id])continue;const L=familyBond(state,f.id);levels.push(L);best[f.area]=Math.max(best[f.area]||0,L)}
 const all=blessAll(levels);/** @type {Record<string,number>} */const linked={};/** @type {Record<string,number>} */const building={};for(const [area,L] of Object.entries(best)){building[area]=BLESS_BUILDING*L;for(const fl of fellowsInArea(area))linked[fl.id]=BLESS_LINKED*L}return {all,linked,building}});
export function fellowPower(state,id){const f=state.fellows[id];if(!f)return 0;const b=blessings(state);return Math.round(fellowBasePower(f.level,f.stars)*(1+(b.linked[id]||0))*(1+areaCompanionBoost(state,fellowById(id).area))*(1+b.all)*steadyMult(state,id)*(1+relicBonus(state,id,'power')))}
/** The level a path counts: a Fellow's level, a Family member's bond level. */
export const pathLevel=(s,id)=>s.fellows[id]?s.fellows[id].level:s.family[id]?bondLevel(s.family[id].bond):0;
export const pathsOpen=(s,id)=>Math.max(0,PATH_AT.filter(at=>pathLevel(s,id)>=at).length-pathsOf(s,id).length);
/** Copies of a relic nobody is wearing. */
export const relicFree=(s,id)=>relicsOwned(s).filter(r=>r.id===id&&!isWorn(s,r.uid)).length;
/** Adds one rolled relic: [state, the owned relic]. */
const addRelic=(s,r,roll)=>{const rel=s.relics||fresh().relics,uid='r'+(rel.next||1),relics={...rel,items:{...rel.items,[uid]:{id:r.id,roll}},worn:{...rel.worn},next:(rel.next||1)+1};return [{...s,relics},relicAt({relics},uid)]};
const dropRelic=(s,uid,shards)=>{const items={...s.relics.items};delete items[uid];return {...s,relics:{...s.relics,items,worn:{...s.relics.worn},shards:(s.relics.shards||0)+shards}}};
const setRelic=(s,uid,it,shards)=>({...s,relics:{...s.relics,items:{...s.relics.items,[uid]:it},worn:{...s.relics.worn},shards:(s.relics.shards||0)+shards,next:(s.relics.next||1)+1}});
const forgeRoll=s=>seeded(`forge:${s.createdAt}:${s.relics.next}`)();
/** What a Map run drops, fixed by the save and the run count so a batch equals the same runs one by one. */
export function relicDrop(s,e,runs){const r=seeded(`relic:${s.createdAt}:${e.id}:${runs}`),leg=e.boss?legendaryOfBoss(e.id):null;
 if(leg&&(runs%RELIC_PITY===0||r()<RELIC_LEGENDARY))return {...leg,roll:r()};if(r()>=(e.boss?RELIC_BOSS_DROP:RELIC_DROP))return null;
 let x=r();const tier=RELIC_TIERS.find(([,p])=>(x-=p)<0)?.[0]||'common',pool=relicsOfTier(tier);return {...pool[Math.floor(r()*pool.length)],roll:r()}}
/** A sure drop of a tier (War Table milestones): [state, the owned relic]. */
export function grantRelic(s,tier,key){const pool=relicsOfTier(tier),r=seeded(`relic:${s.createdAt}:${key}`),pick=pool[Math.floor(r()*pool.length)];return addRelic(s,pick,r())}
export const heroPower=state=>{const t=totalLevel(state);return heroPowerFor(t,playerStage(t).stage)};
/** The roster half: every recruited Fellow's Power (Family blessings already included). */
export const rosterHalf=remember(s=>[s.fellows,s.family,s.companions,s.paths,s.relics],state=>Object.keys(state.fellows).reduce((n,id)=>n+fellowPower(state,id),0));
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
/** Laps: after the last boss the map starts over with every need and loot × LAP, a whole lap's worth of steps, so lap 2's Lumbridge
 * picks up right where the last boss left off. Bosses of the current lap open regions; perks are earned once. */
export const LAP=Math.round(MAP_GROWTH**(REGIONS.length*5));
export const lapOf=state=>state.expeditions?.lap||1;
export const lapMult=state=>LAP**(lapOf(state)-1);
export const lapBeaten=state=>lapOf(state)>1?(state.expeditions.lapBosses||[]):(state.expeditions?.bosses||[]);
export const regionOpen=(state,ri)=>ri===0||lapBeaten(state).includes(REGIONS[ri-1].boss.id);
/** Everything the map shows for one place: need, your outcome, loot at that outcome, runs so far. @returns {any} */
export function expeditionView(state,id){const e=expeditionById(id),need=Math.round(expeditionNeed(e.k)*lapMult(state)),power=rosterPower(state),open=regionOpen(state,REGIONS.indexOf(e.region)),outcome=open?expeditionOutcome(power/need):null,base=expeditionLoot(e.k,e.boss),m=(outcome?.mult||1)*(1+perks(state).loot);
 return {...e,need,power,open,outcome,runs:state.expeditions?.runs?.[id]||0,defeated:e.boss&&lapBeaten(state).includes(id),loot:{gold:Math.round(base.gold*m*lapMult(state)),exp:Math.round(base.exp*m*lapMult(state)),sigils:Math.round(base.sigils*m),xp:Math.round(base.xp*m)}}}

export function powerBreakdown(state){const b=blessings(state),t=totalLevel(state),hero=heroPower(state),roster=rosterHalf(state);return {total:rosterPower(state),hero,roster,totalLevel:t,stage:playerStage(t),balance:Math.max(hero,roster)?Math.min(hero,roster)/Math.max(hero,roster):0,fellows:FELLOWS.filter(f=>state.fellows[f.id]).map(f=>({id:f.id,name:f.name,base:fellowBasePower(state.fellows[f.id].level,state.fellows[f.id].stars),linked:b.linked[f.id]||0,power:fellowPower(state,f.id)})),all:b.all}}

function todayAreaPoints(state,now){const day=habitDay(now),out=empty(AREA_IDS),h=state.habits?.history||[];for(let i=h.length-1;i>=0;i--){const x=h[i];if(x.day!==day){if(x.at<now-36*3600e3)break;continue}if(x.kind==='complete'&&out[x.domain]!==undefined)out[x.domain]+=x.points}return out}
export const areaBoost=(state,area,now)=>Math.min(AREA_BOOST_CAP,AREA_BOOST_PER_POINT*todayAreaPoints(state,now)[area]);
export const momentum=(state,now)=>habitEarnings(state.habits,now).multiplier;
/** Who works in a building: the chosen staff, or (until you choose) the area's strongest recruited Fellows. */
export function buildingStaff(state,id){const b=BUILDINGS.find(x=>x.id===id),slots=staffSlots(state.buildings[id]?.level||0),set=state.buildings[id]?.staff;
 const ok=fellowsInArea(b.area).filter(f=>state.fellows[f.id]).map(f=>f.id);return (Array.isArray(set)?set.filter(x=>ok.includes(x)):ok.sort((x,y)=>fellowPower(state,y)-fellowPower(state,x))).slice(0,slots)}
export function buildingRate(state,id,now=state.lastAt){const b=BUILDINGS.find(x=>x.id===id),lvl=state.buildings[id]?.level||0;if(!lvl)return 0;const staff=1+buildingStaff(state,id).reduce((n,fid)=>n+staffBonus(fellowPower(state,fid)),0);return (buildingBaseRate(lvl)+rosterPower(state)*POWER_INCOME)*buildingLevelMult(lvl)*staff*(1+(blessings(state).building[b.area]||0))*(1+areaBoost(state,b.area,now))*(1+perks(state).income)}
export const baseRate=(state,now=state.lastAt)=>BUILDINGS.reduce((n,b)=>n+buildingRate(state,b.id,now),0);
export const totalRate=(state,now=state.lastAt)=>baseRate(state,now)*momentum(state,now);

/** The blight rising this week: rotates through the six by week number.
 * @returns {any} */
export function currentBlight(state,now){const week=habitPeriod('weekly',now),n=Math.floor(new Date(week.slice(2)+'T12:00:00').getTime()/(7*864e5));const b=BLIGHTS[((n%BLIGHTS.length)+BLIGHTS.length)%BLIGHTS.length],tier=state.blights.tiers[b.id]||0,hp=blightHp(tier);
 let damage=0;for(const x of state.habits?.history||[]){if(x.kind!=='complete'||habitPeriod('weekly',x.at)!==week)continue;damage+=x.points*(b.opposed.includes(x.domain)?2:1)}
 if(state.modes?.strike?.week===week)damage+=state.modes.strike.dmg||0;
 const claimed=state.blights.claimed.includes(week+':'+b.id);return {...b,week,tier,hp,damage:Math.min(damage,hp),defeated:damage>=hp,claimed}}

/** Who is ready to join, by habit points in their area. */
/** Day of play, counting from the save's creation (day 1 is the first day). */
export const dayOf=state=>Math.floor((state.lastAt-state.createdAt)/864e5)+1;
/** Everyone has arrived by day 30: the k-th of n in an area is ready on day ⌈30 × k / n⌉, whatever the habit points say. */
export const joinDay=c=>Math.ceil(30*(queueIndex(c)+1)/(c.kind==='family'?familyInArea(c.area):fellowsInArea(c.area)).length);
export const fellowReady=(state,f)=>!state.fellows[f.id]&&(areaPoints(state,f.area)>=joinNeed(f).points||dayOf(state)>=joinDay(f));
export const familyReady=(state,f)=>{if(state.family[f.id])return false;const n=joinNeed(f);return (areaPoints(state,f.area)>=n.points&&totalLevel(state)>=n.level)||dayOf(state)>=joinDay(f)};
/** The Training Grounds: raise every recruited Fellow below `target` toward it, lowest first, while Fellow EXP lasts. Returns the state unchanged when nothing happens. */
export function trainFellows(s,target){const fellows={...s.fellows},ids=Object.keys(fellows);let exp=s.fellowExp||0,n=0;
 for(;;){let pick=null;for(const id of ids){const l=fellows[id].level;if(l<target&&(pick===null||l<fellows[pick].level))pick=id}
  if(pick===null)break;const c=fellowLevelCost(fellows[pick].level);if(exp<c)break;exp-=c;fellows[pick]={...fellows[pick],level:fellows[pick].level+1};n++}
 return n?{state:{...s,fellowExp:exp,fellows},levels:n}:{state:s,levels:0}}
/** Bond every Family member below `target` toward it with honey sweets (the best bond per gold), lowest first, while gold lasts. */
export const TRAIN_GIFT='sweets';
/** Gifts are bought a level at a time: every sweet up to the next level costs the same, so one batch is priced once (the same gold and bond as buying them one by one, without a loop per sweet). */
export function trainFamily(s,target){const g=GIFTS[TRAIN_GIFT],family={...s.family},ids=Object.keys(family),lv={},sp={};for(const id of ids){lv[id]=bondLevel(family[id].bond);sp[id]=bondSpent(lv[id])}let gold=s.gold,n=0;
 for(;;){let pick=null;for(const id of ids)if(lv[id]<target&&(pick===null||lv[id]<lv[pick]))pick=id;if(pick===null)break;
  const p=giftPrice(g,lv[pick]);if(gold<p)break;const k=Math.min(Math.ceil((sp[pick]+bondNeed(lv[pick])-family[pick].bond)/g.bond),Math.floor(gold/p));gold-=k*p;n+=k;
  const b=family[pick].bond+k*g.bond;family[pick]={...family[pick],bond:b};while(b>=sp[pick]+bondNeed(lv[pick])){sp[pick]+=bondNeed(lv[pick]);lv[pick]++}}
 return n?{state:{...s,gold,family},gifts:n}:{state:s,gifts:0}}
/** What reaching the marks would take from here: Fellow EXP and gold, and how many of each roster are below their mark. */
export function trainCost(s,{fellows=0,family=0}){let exp=0,nf=0,gold=0,nm=0;const g=GIFTS[TRAIN_GIFT];
 for(const f of Object.values(s.fellows))if(f.level<fellows){nf++;for(let l=f.level;l<fellows;l++)exp+=fellowLevelCost(l)}
 for(const f of Object.values(s.family)){let b=f.bond,L=bondLevel(b),spent=bondSpent(L);if(L<family)nm++;
  while(L<family){const k=Math.ceil((spent+bondNeed(L)-b)/g.bond);gold+=k*giftPrice(g,L);b+=k*g.bond;while(b>=spent+bondNeed(L)){spent+=bondNeed(L);L++}}}
 return {exp,fellows:nf,gold,family:nm}}
export function autoTrain(s){const t=s.trainer;if(!t?.auto)return s;let out=s;if(t.fellows)out=trainFellows(out,t.fellows).state;if(t.family)out=trainFamily(out,t.family).state;return out}
export const fellowCanImprove=(state,id)=>{const f=state.fellows[id];if(!f)return false;const def=fellowById(id);return (state.fellowExp||0)>=fellowLevelCost(f.level)||state.sigils[def.area]>=starCost(f.stars+1)};

// ---------------------------------------------------------------------------------------------
// Validation and decoding
// ---------------------------------------------------------------------------------------------
const obj=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
/** Totals that grow with the Map (gold, EXP, XP) have no practical ceiling; counters stay safe integers. */
const num=(x,a=0,b=1e300)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b;
const int=(x,a=0,b=1e15)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
export function valid(s){try{return obj(s)&&s.version===SAVE_VERSION&&int(s.createdAt)&&int(s.lastAt)&&typeof s.playerName==='string'&&s.playerName.length<=30&&num(s.gold)&&(s.fellowExp===undefined||num(s.fellowExp))&&(s.treats===undefined||int(s.treats,0,1e9))&&(s.companions===undefined||(obj(s.companions)&&Object.entries(s.companions).every(([id,c])=>companionById(id)&&obj(c)&&int(c.exp,0,1e9)&&int(c.stage,1,3))))&&int(s.crystals)&&num(s.earned)&&num(s.xp)
 &&obj(s.fellows)&&Object.entries(s.fellows).every(([id,f])=>fellowById(id)&&obj(f)&&int(f.level,1,1e7)&&int(f.stars,0,1e4))
 &&obj(s.family)&&Object.entries(s.family).every(([id,f])=>familyById(id)&&obj(f)&&int(f.bond))
 &&obj(s.familyTalks)&&Object.entries(s.familyTalks).every(([id,n])=>familyById(id)&&int(n,0,1e9))
 &&obj(s.sigils)&&AREA_IDS.every(a=>int(s.sigils[a]))
 &&obj(s.buildings)&&BUILDINGS.every(b=>obj(s.buildings[b.id])&&int(s.buildings[b.id].level,0,10000))
 &&obj(s.stage)&&int(s.stage.cleared)&&obj(s.blights)&&obj(s.blights.tiers)&&BLIGHTS.every(b=>int(s.blights.tiers[b.id]))&&Array.isArray(s.blights.claimed)
 &&obj(s.roam)&&int(s.roam.charges,0,Math.max(ROAM_CAP+20,ROAM_URL_MAX))&&obj(s.expeditions)&&obj(s.expeditions.runs)&&Array.isArray(s.expeditions.bosses)&&obj(s.codex)&&obj(s.codex.cards)&&(s.modes===undefined||obj(s.modes))&&Array.isArray(s.roam.seen)&&obj(s.visits)&&obj(s.stories)&&Array.isArray(s.stories.seen)
 &&obj(s.bonusXp)&&AREA_IDS.every(a=>num(s.bonusXp[a]))&&obj(s.quests)&&Object.entries(s.quests).every(([id,q])=>QUESTS[id]&&obj(q)&&int(q.step,0,99)&&int(q.at))&&obj(s.flags)
 &&(s.trainer===undefined||(obj(s.trainer)&&int(s.trainer.fellows,0,1e6)&&int(s.trainer.family,0,1e6)&&typeof s.trainer.auto==='boolean'))
 &&(s.relics===undefined||(obj(s.relics)&&obj(s.relics.items)&&Object.values(s.relics.items).every(it=>obj(it)&&relicById(it.id)&&num(it.roll,0,1))&&obj(s.relics.worn)&&Object.entries(s.relics.worn).every(([id,uid])=>characterById(id)&&s.relics.items[uid])&&new Set(Object.values(s.relics.worn)).size===Object.keys(s.relics.worn).length&&int(s.relics.shards,0,1e9)&&int(s.relics.next,1,1e9)))
 &&(s.paths===undefined||(obj(s.paths)&&Object.entries(s.paths).every(([id,p])=>characterById(id)&&Array.isArray(p)&&p.length<=PATH_AT.length&&p.every(x=>x==='focus'||x==='steady'))))
 &&obj(s.habits)&&validHabits(s)}catch{return false}}
/** Characters that were swapped out: old id -> new id. Anyone not listed here or in the cast is dropped on load. */
export const RENAMED={kael:'darrow',ren:'kaladin',sable:'kira',elise:'shallan',isolde:'violet',liora:'ariane',maren:'tyrande',wren:'kate',aldric:'obiwan',corin:'tony',tobin:'peter'};
const domainFix=d=>HABIT_DOMAINS.includes(d)?d:HABIT_ALIASES[d]||'general';
/** Bring an older save up to the current cast and areas: rename or drop characters, remap habit areas, fill new fields. */
/** Testing switch: open the game with ?roam=N (0-50) to set Roam charges on this device, so a change can be tried on a phone without a console.
 * The page strips the query after applying it, so a reload does not apply it again. Anything else in the URL is ignored. */
export const ROAM_URL_MAX=50;
/** The most Map runs one tap can spend. */
export const MULTI_RUN_MAX=100;
export function urlTweaks(s,search){const q=new URLSearchParams(search||''),r=q.get('roam');let out=s;
 if(r!==null&&r!==''){const n=Math.max(0,Math.min(ROAM_URL_MAX,Math.floor(Number(r))||0));out={...out,roam:{...out.roam,charges:n}}}
 if(q.get('reset')==='wartable')out={...out,modes:resetWarTable(out.modes)};
 if(q.get('unlock')==='all')out=unlockEveryone(out);
 return out}
/** Testing switch ?unlock=all: every Fellow joins at level 1 and every Family member at bond 0; those already here are left as they are. */
export function unlockEveryone(s){const fellows={...s.fellows},family={...s.family};
 for(const f of FELLOWS)if(!fellows[f.id])fellows[f.id]={level:1,stars:0};for(const f of FAMILY)if(!family[f.id])family[f.id]={bond:0};
 return {...s,fellows,family}}
/** What a URL switch did, for the notice the page shows. */
export function urlTweakNote(s,search){const q=new URLSearchParams(search||''),notes=[];
 if(q.get('roam'))notes.push(`Roam set to ${s.roam.charges}`);if(q.get('reset')==='wartable')notes.push('War Table reset');if(q.get('unlock')==='all')notes.push('everyone unlocked');
 return notes.length?notes.join(', ')+' for testing':''}
/** Testing switch ?reset=wartable: today's and this week's War Table usage is forgotten (Spire floor, Arena rank and Gauntlet best stay). */
export function resetWarTable(modes){const m={...freshModes(),...(modes||{})};
 return {...m,errands:{...m.errands,day:'',done:[]},rift:{...m.rift,day:'',used:[]},fronts:{week:'',used:[],waves:{}},trials:{week:'',cleared:{}},strike:{...m.strike,week:'',day:''},arena:{...m.arena,day:'',tries:0},gauntlet:{...m.gauntlet,day:'',run:null,done:false}}}
/** One-time sigil grants to existing saves, each paid once under its flag (new villages carry every flag and get nothing). */
export const SIGIL_GRANTS=[{flag:'sigils-fair-1',amount:900,areas:['work','hobbies','home','fatherhood','marriage']},{flag:'sigils-fair-2',amount:900,areas:['discipline','faith','hobbies','work']}];
export function migrate(s,now=Date.now()){const base=fresh(s.createdAt||now),out={...base,...s};
 const remap=(map,exists)=>Object.fromEntries(Object.entries(map||{}).map(([id,v])=>[RENAMED[id]||id,v]).filter(([id])=>exists(id)));
 out.fellows=remap(s.fellows,fellowById);out.family=remap(s.family,familyById);
 out.familyTalks=remap(s.familyTalks,familyById);out.companions={...base.companions,...Object.fromEntries(Object.entries(s.companions||{}).filter(([id])=>companionById(id)))};
 out.sigils={...base.sigils};for(const [k,v] of Object.entries(s.sigils||{})){const a=domainFix(k);if(a in out.sigils)out.sigils[a]+=Number(v)||0}
 out.buildings={...base.buildings};for(const b of BUILDINGS)if(s.buildings?.[b.id])out.buildings[b.id]=s.buildings[b.id];
 out.blights={...base.blights,...(s.blights||{}),tiers:{...base.blights.tiers,...(s.blights?.tiers||{})}};
 out.bonusXp={...base.bonusXp};for(const [k,v] of Object.entries(s.bonusXp||{}))if(k in out.bonusXp)out.bonusXp[k]+=Number(v)||0;
 // Relics became owned pieces with a roll (counts → items): each old copy arrives at a middle roll, worn ones stay on their wearer.
 if(s.relics?.owned){const items={},worn={};let n=1;for(const [id,c] of Object.entries(s.relics.owned))for(let i=0;i<c;i++)items['r'+n++]={id,roll:0.5};
  for(const [cid,id] of Object.entries(s.relics.worn||{})){const uid=Object.keys(items).find(u=>items[u].id===id&&!Object.values(worn).includes(u));if(uid)worn[cid]=uid}out.relics={items,worn,shards:0,next:n}}
 else out.relics={...base.relics,...(s.relics||{}),items:{...(s.relics?.items||{})},worn:{...(s.relics?.worn||{})}};
 out.quests=Object.fromEntries(Object.entries(s.quests||{}).filter(([id])=>QUESTS[id]));
 if(s.habits){const h=structuredClone(s.habits);for(const x of h.items||[])x.domain=domainFix(x.domain);for(const x of h.history||[])x.domain=domainFix(x.domain);
  if(h.taskBackup?.items)for(const x of h.taskBackup.items)x.domain=domainFix(x.domain);
  const totals=Object.fromEntries(HABIT_DOMAINS.map(k=>[k,{actions:0,points:0}]));for(const [k,v] of Object.entries(h.totals||{})){const a=domainFix(k);totals[a].actions+=v.actions||0;totals[a].points+=v.points||0}h.totals=totals;
  if(h.undo)h.undo=null;out.habits=h}
 // One-time: Roams spent at the Village Gate before the Map existed come back as a full bar. New saves start with the flag set.
 if(!s.flags?.['roam-refund-1']){out.roam={...out.roam,charges:Math.max(out.roam.charges,roamCap(out))};out.flags={...out.flags,'roam-refund-1':true}}
 // One-time (the map grew from 10 regions to 30): a save on lap 2 or later folds back to lap 1 at Misthalin, the first new region. Its Power already beat
 // the old Nex, which is far past Misthalin's needs, so nothing it faces now is harder than what it was already beating.
 if(!s.flags?.['map-30-1']){if((out.expeditions?.lap||1)>1)out.expeditions={...out.expeditions,lap:1,lapBosses:[]};out.flags={...out.flags,'map-30-1':true}}
 // One-time sigil grants (the Map's area tags were uneven and starved some areas); each pays once.
 for(const g of SIGIL_GRANTS)if(!s.flags?.[g.flag]){out.sigils={...out.sigils};for(const a of g.areas)out.sigils[a]=(out.sigils[a]||0)+g.amount;out.flags={...out.flags,[g.flag]:true}}
 return out}
export function decode(raw){const s=typeof raw==='string'?parseSaveJSON(raw):raw;if(!obj(s))throw Error('That file is not an Everstead save.');if(s.version!==SAVE_VERSION)throw Error('This save is from a different version of the game.');const merged=migrate(s);if(!valid(merged))throw Error('This save failed its checks and was not loaded.');return merged}

// ---------------------------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------------------------
/** Accrue building income since lastAt (capped), and roll the habit journal forward. */
/** Companions nobody has found yet still turn up on their day (10, 20 and 30 for the three non-starters of an area). */
function dayCompanions(s){const day=dayOf(s);let out=s;for(const c of COMPANIONS)if(!out.companions?.[c.id]&&day>=companionDay(c))out={...out,companions:{...out.companions,[c.id]:{exp:0,stage:1}}};return out}
export function settle(state,now=Date.now()){if(now<=state.lastAt)return state;const span=Math.min(now-state.lastAt,OFFLINE_CAP_MS)/1000,gain=totalRate(state,state.lastAt)*span;const s=settleHabits(state,now);return autoTrain(dayCompanions({...s,gold:s.gold+gain,earned:s.earned+gain,lastAt:now}))}

// ---------------------------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------------------------
const ok=(state,message,extra={})=>({state,message,...extra});
const no=(state,error)=>({state,error});
const floorGold=s=>({...s,gold:Math.max(0,s.gold)});

/** Area rewards for completed-habit rows: star sigils, Family bond and roam charges. */
function areaRewards(state,rows){const s=structuredClone(state);for(const r of rows){if(!AREA_IDS.includes(r.domain))continue;s.sigils[r.domain]+=r.points;Object.assign(s,feedArea(s,r.domain,HABIT_EXP));for(const fam of familyInArea(r.domain))if(s.family[fam.id])s.family={...s.family,[fam.id]:{...s.family[fam.id],bond:s.family[fam.id].bond+r.points*10}};if(r.period.startsWith('d:'))s.roam.charges=Math.min(roamCap(s),s.roam.charges+1)}return s}
function reverseAreaRewards(state,rows){const s=structuredClone(state);for(const r of rows){if(!AREA_IDS.includes(r.domain))continue;s.sigils[r.domain]=Math.max(0,s.sigils[r.domain]-r.points);Object.assign(s,feedArea(s,r.domain,-HABIT_EXP));for(const fam of familyInArea(r.domain))if(s.family[fam.id])s.family={...s.family,[fam.id]:{...s.family[fam.id],bond:Math.max(0,s.family[fam.id].bond-r.points*10)}};if(r.period.startsWith('d:'))s.roam.charges=Math.max(0,s.roam.charges-1)}return s}
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
 if(kind.startsWith('mode:'))return modeAct(s,kind.slice(5),now,target,value);
 switch(kind){
  case 'recruitFellow':{const f=fellowById(target);if(!f)return no(s,'Unknown Fellow');if(s.fellows[f.id])return no(s,f.name+' has already joined');if(!fellowReady(s,f))return no(s,`Reach ${joinNeed(f).points} ${AREAS.find(a=>a.id===f.area).name} habit points to meet ${f.name}`);
   return ok({...s,fellows:{...s.fellows,[f.id]:{level:1,stars:0}}},f.name+' joined Everstead!',{recruited:f.id,story:'intro:'+f.id})}
  case 'recruitFamily':{const f=familyById(target);if(!f)return no(s,'Unknown Family member');if(s.family[f.id])return no(s,f.name+' is already family');if(!familyReady(s,f))return no(s,`Reach level ${joinNeed(f).level} and ${joinNeed(f).points} ${AREAS.find(a=>a.id===f.area).name} points to welcome ${f.name}`);
   return ok({...s,family:{...s.family,[f.id]:{bond:0}}},f.name+' joined your family!',{welcomed:f.id,story:'intro:'+f.id})}
  case 'levelUp':{const f=s.fellows[target];if(!f)return no(s,'Recruit this Fellow first');const times=value==='max'?10000:Math.max(1,Math.min(10000,Number(value)||1));let lvl=f.level,exp=s.fellowExp||0,n=0;
   while(n<times&&exp>=fellowLevelCost(lvl)){exp-=fellowLevelCost(lvl);lvl++;n++}
   if(!n)return no(s,`Need ${fellowLevelCost(lvl).toLocaleString()} Fellow EXP. Earn it on the Map and the War Table.`);
   // Every 5th level he has something to say (one moment per purchase, however many levels it bought).
   const talk=Math.floor(lvl/5)>Math.floor(f.level/5)?momentId(target,'level',Math.floor(lvl/5)-1):null;
   const hit=MILESTONES.filter(([at])=>at>f.level&&at<=lvl).map(([at,x])=>`Lv ${at} milestone: Power ×${x}`);
   return ok({...s,fellowExp:exp,fellows:{...s.fellows,[target]:{...f,level:lvl}}},`${fellowById(target).name} reached level ${lvl}${hit.length?' · '+hit.join(' · '):''}`,{talk,milestone:hit.length>0})}
  case 'staffSet':{const b=BUILDINGS.find(x=>x.id===target);if(!b)return no(s,'Unknown building');if(value===null)return ok({...s,buildings:{...s.buildings,[b.id]:{level:s.buildings[b.id].level}}},`${b.name} staffs itself again`);
   const slots=staffSlots(s.buildings[b.id].level);if(!Array.isArray(value)||new Set(value).size!==value.length)return no(s,'Pick who works here');if(value.length>slots)return no(s,`Only ${slots} slot${slots===1?'':'s'} at this level`);
   if(value.some(fid=>!s.fellows[fid]||fellowById(fid)?.area!==b.area))return no(s,`Only recruited ${AREAS.find(a=>a.id===b.area).name} Fellows can work here`);
   return ok({...s,buildings:{...s.buildings,[b.id]:{...s.buildings[b.id],staff:value}}},`${b.name} staff updated`)}
  case 'starUp':{const f=s.fellows[target],def=fellowById(target);if(!f)return no(s,'Recruit this Fellow first');const cost=starCost(f.stars+1);if(s.sigils[def.area]<cost)return no(s,`Need ${cost} ${AREAS.find(a=>a.id===def.area).name} sigils`);
   return ok({...s,sigils:{...s.sigils,[def.area]:s.sigils[def.area]-cost},fellows:{...s.fellows,[target]:{...f,stars:f.stars+1}}},`${def.name} earned star ${f.stars+1}!`,{talk:momentId(target,'star',f.stars)})}
  case 'buildingUpgrade':{const b=BUILDINGS.find(x=>x.id===target);if(!b)return no(s,'Unknown building');const lvl=s.buildings[b.id].level,want=value==='max'?10000:Math.max(1,Math.min(10000,Number(value)||1));
   let l=lvl,gold=s.gold,n=0;while(n<want&&l<10000){const c=l?buildingUpgradeCost(l):BUILDING_OPEN_COST;if(gold<c)break;gold-=c;l++;n++}
   if(!n)return no(s,`Need ${(lvl?buildingUpgradeCost(lvl):BUILDING_OPEN_COST).toLocaleString()} gold`);
   return ok({...s,gold,buildings:{...s.buildings,[b.id]:{...s.buildings[b.id],level:l}}},lvl?`${b.name} upgraded to level ${l}${n>1?' (+'+n+')':''}`:l>1?`${b.name} is open and already level ${l}`:`${b.name} is open for business`)}
  case 'expedition':{const times=Math.max(1,Math.min(MULTI_RUN_MAX,Math.floor(Number(value))||1));
   // Several runs in one tap: the same run repeated, stopping where a single tap would have stopped you (out of Roams, or a new lap making the place too strong).
   if(times>1){let cur=s,n=0,first=null,treats=0,perk=null,opened=null;const loot={gold:0,exp:0,sigils:0,xp:0},found=[],relics=[];
    for(;n<times;n++){const r=act(cur,'expedition',now,target,1);if(r.error){if(!n)return r;break}cur=r.state;first=first||r;const x=r.expedition;loot.gold+=x.loot.gold;loot.exp+=x.loot.exp;loot.sigils+=x.loot.sigils;loot.xp+=x.loot.xp;treats+=x.treats;if(x.found)found.push(x.found);perk=perk||x.perk;opened=opened||x.opened;relics.push(...x.relics)}
    return ok(cur,`${n} run${n>1?'s':''} of ${first.expedition.title}: +${loot.gold.toLocaleString('en-US')} gold · +${loot.exp.toLocaleString('en-US')} Fellow EXP`+(found.length?` · ${found.join(', ')} joined you!`:'')+(relics.length?` · ${relics.length} relic${relics.length>1?'s':''} dropped`:''),{expedition:{...first.expedition,loot,treats,found:found.length?found.join(', '):null,perk,opened,times:n,relics},levelUps:levelUps(s,cur)})}
   const e=expeditionById(target);if(!e)return no(s,'Unknown place');const v=expeditionView(s,target);if(!v.open)return no(s,'Defeat the last region’s boss to open '+e.region.name);
   if(!v.outcome)return no(s,`${e.title} needs ${v.need.toLocaleString('en-US')} Power. You have ${v.power.toLocaleString('en-US')}.`);if(s.roam.charges<1)return no(s,'No Roams left. Complete daily habits to earn more.');
   const sig={...s.sigils},bx={...s.bonusXp};for(const a of e.areas){sig[a]+=v.loot.sigils;bx[a]=(bx[a]||0)+v.loot.xp}
   const firstWin=e.boss&&!v.defeated,firstEver=e.boss&&!s.expeditions.bosses.includes(target),last=e.boss&&REGIONS.indexOf(e.region)===REGIONS.length-1,lap=lapOf(s);let next={...s,gold:s.gold+v.loot.gold,earned:s.earned+v.loot.gold,fellowExp:(s.fellowExp||0)+v.loot.exp,treats:(s.treats||0)+(e.boss?2:1),sigils:sig,bonusXp:bx,roam:{...s.roam,charges:s.roam.charges-1},
    expeditions:{...s.expeditions,runs:{...s.expeditions.runs,[target]:v.runs+1},bosses:firstEver?[...s.expeditions.bosses,target]:s.expeditions.bosses,
     lap:firstWin&&last?lap+1:lap,lapBosses:firstWin&&last?[]:firstWin?[...lapBeaten(s),target]:(s.expeditions.lapBosses||[])}};
   const totalRuns=Object.values(next.expeditions.runs).reduce((n,x)=>n+x,0);let found=null;if(firstEver||totalRuns%8===0){const [n2,c]=findCompanion(next,e.areas);next=n2;found=c}
   const drop=relicDrop(s,e,v.runs+1);let inst=null;if(drop)[next,inst]=addRelic(next,drop,drop.roll);
   const ups=levelUps(s,next);
   return ok(next,`${v.outcome.label}! +${v.loot.gold.toLocaleString('en-US')} gold · +${v.loot.exp.toLocaleString('en-US')} Fellow EXP`+(found?` · ${companionName(found,1)} joined you!`:'')+(drop?` · ${drop.name} dropped!`:'')+(firstWin&&last?` · Lap ${lap+1} begins: the whole map is ×${LAP.toLocaleString('en-US')} tougher and richer.`:''),{expedition:{id:target,title:e.title,outcome:v.outcome,loot:v.loot,treats:e.boss?2:1,found:found?companionName(found,1):null,areas:e.areas,first:v.runs===0,perk:firstEver?e.region.perk.text:null,opened:firstWin?(last?`Lap ${lap+1}`:REGIONS[REGIONS.indexOf(e.region)+1]?.name||null):null,relics:inst?[inst]:[]},levelUps:ups})}
  case 'challenge':{const n=s.stage.cleared+1,need=stagePower(n),power=rosterPower(s);if(power<need)return no(s,`Stage ${n} needs ${need.toLocaleString()} Power. You have ${power.toLocaleString()}.`);const r=stageReward(n);
   return ok({...s,gold:s.gold+r.gold,earned:s.earned+r.gold,crystals:s.crystals+r.crystals,stage:{cleared:n}},`Stage ${n} cleared! +${r.gold} gold${r.crystals?` · +${r.crystals} crystals`:''}`,{cleared:n})}
  case 'blightClaim':{const b=currentBlight(s,now);if(!b.defeated)return no(s,`${b.name} still stands. Keep up your habits.`);if(b.claimed)return no(s,'Already claimed this week');const r=blightReward(b.tier),sig={...s.sigils};for(const a of b.opposed)sig[a]+=r.sigils;
   return ok({...s,crystals:s.crystals+r.crystals,sigils:sig,blights:{tiers:{...s.blights.tiers,[b.id]:b.tier+1},claimed:[...s.blights.claimed.slice(-60),b.week+':'+b.id]}},`${b.name} is pushed back! +${r.crystals} crystals · +${r.sigils} sigils each for ${b.opposed.map(a=>AREAS.find(x=>x.id===a).name).join(' and ')}`)}
  // The Village Gate is free once a day; Roams are only spent on the Expedition Map.
  case 'roam':{const day=habitDay(now);if(s.roam.gateDay===day)return no(s,'You’ve walked the village today. Come back tomorrow.');const scene=roamScene(s,now);if(!scene)return no(s,'Nobody to meet yet. Recruit a Fellow first.');let next={...s,roam:{...s.roam,gateDay:day,seen:[...s.roam.seen.slice(-200),scene.id]}};
   if(scene.kind==='family'&&next.family[scene.with])next={...next,family:{...next.family,[scene.with]:{bond:next.family[scene.with].bond+scene.bond}}};
   if(scene.gold)next={...next,gold:next.gold+scene.gold,earned:next.earned+scene.gold};
   return ok(next,scene.summary,{scene})}
  case 'gift':{const key=typeof value==='string'?value:value?.gift,want=typeof value==='string'?1:value?.times==='max'?10000:Math.max(1,Math.min(10000,Number(value?.times)||1));const f=s.family[target],g=GIFTS[key];if(!f||!g)return no(s,'Choose a family member and a gift');
   let bond=f.bond,gold=s.gold,crystals=s.crystals,n=0;while(n<want){const L=bondLevel(bond);const p=giftPrice(g,L);if(g.gold?gold<p:crystals<p)break;if(g.gold)gold-=p;else crystals-=p;bond+=g.bond;n++}
   if(n<1){const L=bondLevel(f.bond);return no(s,g.gold?`Need ${giftPrice(g,L).toLocaleString()} gold`:`Need ${giftPrice(g,L)} crystals`)}
   return ok({...s,gold,crystals,family:{...s.family,[target]:{bond}}},`${familyById(target).name} loved the ${g.name.toLowerCase()}${n>1?' ×'+n:''} · +${g.bond*n} bond`,{talk:momentId(target,'gift',Math.floor(f.bond))})}
  case 'visit':{const f=s.family[target];if(!f)return no(s,'Welcome them to your family first');const day=habitDay(now);if(s.visits[target]===day)return no(s,'You already spent time together today');
   const count=s.familyTalks?.[target]||0;
   return ok({...s,visits:{...s.visits,[target]:day},familyTalks:{...s.familyTalks,[target]:Math.min(1e9,count+1)},family:{...s.family,[target]:{bond:f.bond+VISIT_BOND}}},`You spent time with ${familyById(target).name} · +${VISIT_BOND} bond`,{talk:momentId(target,'visit',count)})}
  case 'testing':{const search={roam:'?roam='+ROAM_URL_MAX,wartable:'?reset=wartable',unlock:'?unlock=all'}[target];if(!search)return no(s,'Unknown testing switch');
   const next=urlTweaks(s,search);return ok(next,urlTweakNote(next,search))}
  case 'train':{const v=obj(value)?value:{};const mark=x=>Math.max(0,Math.min(1e6,Math.floor(Number(x)||0)));const trainer={fellows:mark(v.fellows),family:mark(v.family),auto:!!v.auto};
   let n={...s,trainer};if(!v.now)return ok(n,trainer.auto?'The sergeant will keep everyone trained to the marks.':'Marks saved.');
   const a=trainer.fellows?trainFellows(n,trainer.fellows):{state:n,levels:0},b=trainer.family?trainFamily(a.state,trainer.family):{state:a.state,gifts:0};
   const parts=[],low=(xs,f)=>xs.length?Math.min(...xs.map(f)):0;
   if(a.levels)parts.push(`+${a.levels.toLocaleString('en-US')} Fellow level${a.levels>1?'s':''}, lowest now Lv ${low(Object.values(b.state.fellows),f=>f.level)}`);
   if(b.gifts)parts.push(`${b.gifts.toLocaleString('en-US')} gift${b.gifts>1?'s':''} given, lowest now bond ${low(Object.values(b.state.family),f=>bondLevel(f.bond))}`);
   return ok(b.state,parts.length?'Drill done: '+parts.join(' · '):`Nothing to train: everyone is at the mark, or the EXP and gold ran short (lowest Fellow Lv ${low(Object.values(s.fellows),f=>f.level)}, lowest Family bond ${low(Object.values(s.family),f=>bondLevel(f.bond))}).`)}
  // Relics: wear one (value = relic id) or take it off (null). A copy can only be worn by one character at a time.
  case 'relicWear':{const c=characterById(target);if(!c||!(s.fellows[target]||s.family[target]))return no(s,'Recruit them first');const worn={...(s.relics?.worn||{})};
   if(value===null){if(!worn[target])return no(s,c.name+' wears no relic');delete worn[target];return ok({...s,relics:{...s.relics,worn}},`${c.name} put the relic away`)}
   // value is an owned relic's uid, or a catalogue id (then the best free roll of it).
   const mine=relicsOwned(s).filter(r=>r.uid===value||r.id===value);if(!mine.length)return no(s,'You don’t have that relic');if(mine.some(r=>worn[target]===r.uid))return no(s,c.name+' already wears it');
   const r=mine.filter(r=>!isWorn(s,r.uid)).sort((a,b)=>b.roll-a.roll)[0];if(!r)return no(s,'Every copy of it is being worn. Take it off someone first.');worn[target]=r.uid;return ok({...s,relics:{...s.relics,worn}},`${c.name} now wears the ${r.name}`)}
  // The Forge: salvage an unworn relic into shards, salvage every spare, reroll one, or ascend one a tier. The new roll is fixed by the save and the Forge's count.
  case 'relicSalvage':{const r=relicAt(s,target);if(!r)return no(s,'You don’t have that relic');if(isWorn(s,r.uid))return no(s,'Someone is wearing it. Take it off first.');return ok(dropRelic(s,r.uid,SHARDS[r.tier]),`${r.name} salvaged: +${SHARDS[r.tier]} shards`,{shards:SHARDS[r.tier]})}
  case 'relicSalvageSpares':{const spares=relicSpares(s);if(!spares.length)return no(s,'No spares to salvage');let n=s,sh=0;for(const r of spares){n=dropRelic(n,r.uid,SHARDS[r.tier]);sh+=SHARDS[r.tier]}return ok(n,`${spares.length} spare relic${spares.length>1?'s':''} salvaged: +${sh} shards`,{shards:sh})}
  case 'relicReroll':{const r=relicAt(s,target);if(!r)return no(s,'You don’t have that relic');const cost=SHARDS[r.tier]*REROLL_MULT;if((s.relics.shards||0)<cost)return no(s,`Rerolling it needs ${cost} shards`);
   const roll=forgeRoll(s),n=setRelic(s,r.uid,{id:r.id,roll},-cost);return ok(n,`${r.name} rerolled: ${rollPct(roll)}${roll>=ROLL_PERFECT?' · perfect!':''}`,{relic:relicAt(n,r.uid)})}
  case 'relicAscend':{const r=relicAt(s,target);if(!r)return no(s,'You don’t have that relic');const to=ascendsTo(r);if(!to)return no(s,r.name+' can’t be ascended');const cost=ASCEND[r.tier];if((s.relics.shards||0)<cost)return no(s,`Ascending it needs ${cost} shards`);
   const roll=forgeRoll(s),n=setRelic(s,r.uid,{id:to.id,roll},-cost);return ok(n,`${r.name} ascended into the ${to.name}: ${rollPct(roll)}`,{relic:relicAt(n,r.uid)})}
  // A path at level or bond 50 and 100: Focus leans into the specialty, Steady adds Power everywhere. Chosen once each, for good.
  case 'pathChoose':{const c=characterById(target);if(!c||!pathsOpen(s,target))return no(s,'No path is open for them yet');if(value!=='focus'&&value!=='steady')return no(s,'Choose Focus or Steady');
   return ok({...s,paths:{...(s.paths||{}),[target]:[...pathsOf(s,target),value]}},value==='focus'?`${c.name} chose Focus: ×${(SPEC_MULT+PATH_FOCUS*(pathsOf(s,target).filter(p=>p==='focus').length+1)).toFixed(2)} as a ${specOf(target)?SPECS[specOf(target)].name:'specialist'} now`:`${c.name} chose Steady: +${Math.round(PATH_STEADY*100)}% Power for good`)}
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
  case 'treat':{const c=companionById(target),o=s.companions?.[target];if(!c||!o)return no(s,'You haven’t met this companion yet');if((s.treats||0)<1)return no(s,'No treats left. Map runs and the War Table drop them.');
   const before=companionLevel(o.exp),exp=o.exp+TREAT_EXP,after=companionLevel(exp);return ok({...s,treats:s.treats-1,companions:{...s.companions,[target]:{...o,exp}}},`${companionName(c,o.stage)} loved that.`+(after>before?` Level ${after}!`:''))}
  case 'evolve':{const c=companionById(target),o=s.companions?.[target];if(!c||!o)return no(s,'You haven’t met this companion yet');if(!canEvolve(c,s))return no(s,o.stage>=c.stages.length?'Fully evolved':`Reach level ${EVOLVE_AT[o.stage-1]} first`);
   return ok({...s,companions:{...s.companions,[target]:{...o,stage:o.stage+1}}},`${companionName(c,o.stage)} evolved into ${companionName(c,o.stage+1)}!`)}
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
