// Plays Everstead for a year against the real engine, to check the economy keeps pace with itself.
//   node scripts/simulate.mjs [days=365] [habitsPerDay=8] [every=30]
// A "player" who each day completes N habits, spends every Roam on the best Map run, runs the War Table,
// spends Fellow EXP round-robin, stars Fellows, upgrades buildings, gives gifts and treats companions.
// Prints a row every `every` days: Power, map progress, levels, income. Use it before changing a formula.
import {fresh,act,settle,rosterPower,fellowPower,expeditionView,regionOpen,totalRate,perks,buildingUpgradeCost,fellowLevelCost,starCost,familyBond,lapOf,lapBeaten,GIFTS,giftPrice,bondLevel,BUILDING_OPEN_COST,fellowReady,familyReady,dayOf,pathsOpen,relicFree} from '../lib/game.mjs';
import {RELICS} from '../lib/traits.mjs';
import {REGIONS,ADVENTURE_IDS} from '../lib/expedition-data.mjs';
import {FELLOWS,FAMILY,AREA_IDS,BUILDINGS,characterById} from '../lib/cast.mjs';
import {frontPower,gauntletDraft,charPower,modesNow} from '../lib/modes.mjs';
import {habitDay} from '../lib/habits.mjs';
import {COMPANIONS,companionLevel,canEvolve} from '../lib/companions.mjs';
import {totalLevel} from '../lib/skills.mjs';
import fs from 'node:fs';

const DAYS=+process.argv[2]||365,HABITS=+process.argv[3]||8,EVERY=+process.argv[4]||30;
const T0=new Date('2026-11-02T07:00:00').getTime(),DAY=864e5,H=36e5;
let s=fresh(T0);
// One daily habit per area (hard), cycling if more than eight are asked for.
const habits=[];for(let i=0;i<HABITS;i++){const area=AREA_IDS[i%AREA_IDS.length];s=act(s,'habitSave',T0,null,{title:'Sim '+i,freq:'daily',diff:'hard',domain:area}).state;habits.push(s.habits.items.at(-1).id)}
const tryAct=(kind,now,target,value)=>{const r=act(s,kind,now,target,value);if(!r.error)s=r.state;return !r.error};
const topFellows=(n,now)=>Object.keys(s.fellows).sort((a,b)=>fellowPower(s,b)-fellowPower(s,a)).slice(0,n);
const fmt=n=>n>=1e9?(n/1e9).toFixed(2)+'B':n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(Math.round(n));
let stepsBeaten=0,lastStepDay=0,stalls=[];
console.log('day | power | map (lap, step, bosses this lap) | gold/h | fellows (n, top lv, stars) | bond (avg, max) | companions (n, top) | exp bank | buildings (top lv, hours of income to the next)');
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
 // War Table: Rift, Arena ×5, Spire, the Gauntlet every day; the Fronts and Trials once a week (they reset weekly, so trying daily is harmless).
 const now=base+3*H;const three=topFellows(3),five=topFellows(5);
 if(three.length)tryAct('mode:rift',now,null,three);
 if(five.length)for(let i=0;i<5;i++){const fam=Object.keys(s.family).sort((a,b)=>familyBond(s,b)-familyBond(s,a)).slice(0,2);if(!tryAct('mode:arena',now+i,null,[...five.slice(0,5-fam.length),...fam]))break}
 if(five.length)tryAct('mode:spire',now,null,five);
 if(three.length){const draft=gauntletDraft(s,habitDay(now)).sort((a,b)=>charPower(s,b)-charPower(s,a)).slice(0,3);if(tryAct('mode:gauntletStart',now,null,draft))for(let i=0;i<300;i++){const run=modesNow(s,now).gauntlet.run;if(!run)break;
   if(run.offer){const o=run.offer;tryAct('mode:gauntletChoose',now,o.draft[0]||(run.hp<60&&o.boons.includes('mend')?'mend':o.boons[0]))}else if(!tryAct('mode:gauntletFight',now))break}}
 {const used=[];for(const a of AREA_IDS){const sq=[...Object.keys(s.fellows),...Object.keys(s.family)].filter(id=>!used.includes(id)).sort((p,q)=>frontPower(s,a,[q])-frontPower(s,a,[p])).slice(0,3);if(sq.length&&tryAct('mode:front',now,a,sq))used.push(...sq)}
  for(const a of AREA_IDS)for(let t=0;t<40;t++){const fam=Object.keys(s.family).sort((p,q)=>familyBond(s,q)-familyBond(s,p)).slice(0,1);if(!fam.length)break;const r=act(s,'mode:trial',now,a,[...topFellows(2),...fam]);if(r.error||!r.won)break;s=r.state}}
 // Spend: stars when sigils allow, then EXP round-robin on the lowest level Fellow who can afford a level.
 for(const id of Object.keys(s.fellows)){let g=0;while(g++<50&&tryAct('starUp',now,id));}
 guard=0;while(guard++<2000){const ids=Object.keys(s.fellows).filter(id=>(s.fellowExp||0)>=fellowLevelCost(s.fellows[id].level)).sort((a,b)=>s.fellows[a].level-s.fellows[b].level);if(!ids.length)break;if(!tryAct('levelUp',now,ids[0],5))break}
 // Buildings: open what you can, upgrade while a level costs under a tenth of your gold.
 for(const b of BUILDINGS){const lvl=s.buildings[b.id].level;if(!lvl){if(s.gold>=BUILDING_OPEN_COST*2)tryAct('buildingUpgrade',now,b.id,1)}else if(buildingUpgradeCost(lvl)<s.gold/10)tryAct('buildingUpgrade',now,b.id,'max')}
 // Gifts: half of what's left goes to posies for the lowest-bond family, a few members a day.
 const fam=Object.keys(s.family).sort((a,b)=>s.family[a].bond-s.family[b].bond).slice(0,4);for(const id of fam){const budget=s.gold/2/fam.length;let n=0,cost=0,b=s.family[id].bond;while(cost+giftPrice(GIFTS.posy,bondLevel(b))<=budget&&n<10000){cost+=giftPrice(GIFTS.posy,bondLevel(b));b+=50;n++}if(n)tryAct('gift',now,id,{gift:'posy',times:n})}
 for(const id of Object.keys(s.family).slice(0,5))tryAct('visit',now,id);
 // Paths (always Steady) and relics: every free copy goes on the strongest character wearing nothing.
 {const everyone=[...Object.keys(s.fellows),...Object.keys(s.family)];for(const id of everyone)while(pathsOpen(s,id)>0&&tryAct('pathChoose',now,id,'steady'));
  const bare=everyone.filter(id=>!s.relics?.worn?.[id]).sort((a,b)=>charPower(s,b)-charPower(s,a));for(const r of RELICS){let n=relicFree(s,r.id);while(n-->0&&bare.length)tryAct('relicWear',now,bare.shift(),r.id)}}
 // Companions: evolve what can, treats to the lowest-level companion.
 for(const c of COMPANIONS)if(canEvolve(c,s))tryAct('evolve',now,c.id);
 guard=0;while((s.treats||0)>0&&guard++<50){const owned=COMPANIONS.filter(c=>s.companions?.[c.id]).sort((a,b)=>companionLevel(s.companions[a.id].exp)-companionLevel(s.companions[b.id].exp));if(!owned.length||!tryAct('treat',now,owned[0].id))break}
 s=settle(s,base+12*H);s=settle(s,base+18*H);
 if(d-lastStepDay>=45&&!stalls.includes(lastStepDay))stalls.push(lastStepDay);
 if((d+1)%EVERY===0||d===DAYS-1){const fl=Object.values(s.fellows),lv=fl.map(f=>f.level),st=fl.map(f=>f.stars),bonds=Object.keys(s.family).map(id=>familyBond(s,id)),cs=Object.values(s.companions||{}).map(o=>companionLevel(o.exp));
  const bl=Math.max(0,...Object.values(s.buildings).map(b=>b.level)),rate=totalRate(s)*3600;
  console.log(`${String(d+1).padStart(3)} | ${fmt(rosterPower(s)).padStart(7)} | lap ${lapOf(s)}, step ${stepsBeaten}, ${lapBeaten(s).length} bosses | ${fmt(rate).padStart(7)} | ${fl.length}, lv ${Math.max(0,...lv)} (min ${Math.min(...lv)||0}), ★${(st.reduce((a,b)=>a+b,0)/Math.max(1,st.length)).toFixed(1)} | ${bonds.length?(bonds.reduce((a,b)=>a+b,0)/bonds.length).toFixed(1):0}, ${Math.max(0,...bonds)} | ${cs.length}, lv ${Math.max(0,...cs)} | ${fmt(s.fellowExp||0)} | lv ${bl}, ${rate?(buildingUpgradeCost(bl)/rate).toFixed(1):'-'}h`)}
}
if(stalls.length)console.log('Stalls of 45+ days without a new map step after days: '+stalls.join(', '));
// SIM_DUMP=path writes the final save as JSON, for scripts that want a mid-game village to measure against.
if(process.env.SIM_DUMP)fs.writeFileSync(process.env.SIM_DUMP,JSON.stringify(s));
console.log('Last map step beaten: '+stepsBeaten+' ('+REGIONS.length*5+' per lap) on day '+(lastStepDay+1)+'. Total skill level '+totalLevel(s)+'.');
