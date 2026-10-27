// Plays Everstead for a year against the real engine, to check the economy keeps pace with itself.
//   node scripts/simulate.mjs [days=365] [habitsPerDay=8] [every=30]
// A "player" who each day completes N habits, spends every Roam on the best Map run, runs the War Table,
// spends Fellow EXP round-robin, stars Fellows, upgrades buildings, gives gifts and treats companions.
// Prints a row every `every` days: Power, map progress, levels, income. Use it before changing a formula.
import {fresh,act,settle,rosterPower,fellowPower,expeditionView,regionOpen,totalRate,perks,buildingUpgradeCost,fellowLevelCost,starCost,familyBond,lapOf,lapBeaten,GIFTS,giftPrice,bondLevel,BUILDING_OPEN_COST,fellowReady,familyReady,dayOf} from '../lib/game.mjs';
import {REGIONS,ADVENTURE_IDS} from '../lib/expedition-data.mjs';
import {FELLOWS,FAMILY,AREA_IDS,BUILDINGS} from '../lib/cast.mjs';
import {COMPANIONS,companionLevel,canEvolve} from '../lib/companions.mjs';
import {totalLevel} from '../lib/skills.mjs';

const DAYS=+process.argv[2]||365,HABITS=+process.argv[3]||8,EVERY=+process.argv[4]||30;
const T0=new Date('2026-11-02T07:00:00').getTime(),DAY=864e5,H=36e5;
let s=fresh(T0);
// One daily habit per area (hard), cycling if more than eight are asked for.
const habits=[];for(let i=0;i<HABITS;i++){const area=AREA_IDS[i%AREA_IDS.length];s=act(s,'habitSave',T0,null,{title:'Sim '+i,freq:'daily',diff:'hard',domain:area}).state;habits.push(s.habits.items.at(-1).id)}
const tryAct=(kind,now,target,value)=>{const r=act(s,kind,now,target,value);if(!r.error)s=r.state;return !r.error};
const topFellows=(n,now)=>Object.keys(s.fellows).sort((a,b)=>fellowPower(s,b)-fellowPower(s,a)).slice(0,n);
const fmt=n=>n>=1e9?(n/1e9).toFixed(2)+'B':n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(Math.round(n));
let stepsBeaten=0,lastStepDay=0,stalls=[];
console.log('day | power | map (lap, step, bosses this lap) | gold/h | fellows (n, top lv, stars) | bond (avg, max) | companions (n, top) | exp bank');
for(let d=0;d<DAYS;d++){
 const base=T0+d*DAY;
 // Morning: settle, habits, recruits.
 s=settle(s,base);
 for(const id of habits)tryAct('habitComplete',base+5*6e4,id);
 for(const f of FELLOWS)if(!s.fellows[f.id]&&fellowReady(s,f))tryAct('recruitFellow',base+H,f.id);
 for(const f of FAMILY)if(!s.family[f.id]&&familyReady(s,f))tryAct('recruitFamily',base+H,f.id);
 // Map: every Roam on the best run you can win (bosses first), then whatever pays the most Fellow EXP.
 let guard=0;while(s.roam.charges>0&&guard++<40){const views=ADVENTURE_IDS.map(id=>expeditionView(s,id)).filter(v=>v.open&&v.outcome);if(!views.length)break;
  const boss=views.find(v=>v.boss&&!v.defeated);const best=views.sort((a,b)=>b.loot.exp-a.loot.exp).slice(0,4);const pick=boss||best[guard%best.length];if(!tryAct('expedition',base+2*H,pick.id))break;
  const k=ADVENTURE_IDS.indexOf(pick.id)+50*(lapOf(s)-1);if(k+1>stepsBeaten&&!(pick.boss&&lapBeaten(s).length===0)){stepsBeaten=k+1;lastStepDay=d}}
 // War Table: Rift, Arena ×5, Spire.
 const now=base+3*H;const three=topFellows(3),five=topFellows(5);
 if(three.length)tryAct('rift',now,null,three);
 if(five.length)for(let i=0;i<5;i++){const fam=Object.keys(s.family).sort((a,b)=>familyBond(s,b)-familyBond(s,a)).slice(0,2);if(!tryAct('arena',now+i,null,[...five.slice(0,5-fam.length),...fam]))break}
 if(five.length)tryAct('spire',now,null,five);
 // Spend: stars when sigils allow, then EXP round-robin on the lowest level Fellow who can afford a level.
 for(const id of Object.keys(s.fellows)){let g=0;while(g++<50&&tryAct('starUp',now,id));}
 guard=0;while(guard++<2000){const ids=Object.keys(s.fellows).filter(id=>(s.fellowExp||0)>=fellowLevelCost(s.fellows[id].level)).sort((a,b)=>s.fellows[a].level-s.fellows[b].level);if(!ids.length)break;if(!tryAct('levelUp',now,ids[0],5))break}
 // Buildings: open what you can, upgrade while a level costs under a tenth of your gold.
 for(const b of BUILDINGS){const lvl=s.buildings[b.id].level;if(!lvl){if(s.gold>=BUILDING_OPEN_COST*2)tryAct('buildingUpgrade',now,b.id,1)}else if(buildingUpgradeCost(lvl)<s.gold/10)tryAct('buildingUpgrade',now,b.id,'max')}
 // Gifts: half of what's left goes to posies for the lowest-bond family, a few members a day.
 const fam=Object.keys(s.family).sort((a,b)=>s.family[a].bond-s.family[b].bond).slice(0,4);for(const id of fam){const budget=s.gold/2/fam.length;let n=0,cost=0,b=s.family[id].bond;while(cost+giftPrice(GIFTS.posy,bondLevel(b))<=budget&&n<10000){cost+=giftPrice(GIFTS.posy,bondLevel(b));b+=50;n++}if(n)tryAct('gift',now,id,{gift:'posy',times:n})}
 for(const id of Object.keys(s.family).slice(0,5))tryAct('visit',now,id);
 // Companions: evolve what can, treats to the lowest-level companion.
 for(const c of COMPANIONS)if(canEvolve(c,s))tryAct('evolve',now,c.id);
 guard=0;while((s.treats||0)>0&&guard++<50){const owned=COMPANIONS.filter(c=>s.companions?.[c.id]).sort((a,b)=>companionLevel(s.companions[a.id].exp)-companionLevel(s.companions[b.id].exp));if(!owned.length||!tryAct('treat',now,owned[0].id))break}
 s=settle(s,base+12*H);s=settle(s,base+18*H);
 if(d-lastStepDay>=45&&!stalls.includes(lastStepDay))stalls.push(lastStepDay);
 if((d+1)%EVERY===0||d===DAYS-1){const fl=Object.values(s.fellows),lv=fl.map(f=>f.level),st=fl.map(f=>f.stars),bonds=Object.keys(s.family).map(id=>familyBond(s,id)),cs=Object.values(s.companions||{}).map(o=>companionLevel(o.exp));
  console.log(`${String(d+1).padStart(3)} | ${fmt(rosterPower(s)).padStart(7)} | lap ${lapOf(s)}, step ${stepsBeaten}, ${lapBeaten(s).length} bosses | ${fmt(totalRate(s)*3600).padStart(7)} | ${fl.length}, lv ${Math.max(0,...lv)} (min ${Math.min(...lv)||0}), ★${(st.reduce((a,b)=>a+b,0)/Math.max(1,st.length)).toFixed(1)} | ${bonds.length?(bonds.reduce((a,b)=>a+b,0)/bonds.length).toFixed(1):0}, ${Math.max(0,...bonds)} | ${cs.length}, lv ${Math.max(0,...cs)} | ${fmt(s.fellowExp||0)}`)}
}
if(stalls.length)console.log('Stalls of 45+ days without a new map step after days: '+stalls.join(', '));
console.log('Last map step beaten: '+stepsBeaten+' (50 per lap) on day '+(lastStepDay+1)+'. Total skill level '+totalLevel(s)+'.');
