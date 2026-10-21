// The War Table: eight game modes that put both rosters to work. Each one settles fights the Everstead way:
// team power against a need. Modes add a team rule and one twist; there is no battle engine.
//
//  Errands      Family, daily     send crews on timed jobs, collect gold / sigils / bond
//  The Rift     Fellows, daily    one squad climbs today's area-locked ladder; the squad is spent for the day
//  Eight Fronts Both, weekly      defend each life area's front once; every character fights once a week
//  The Trials   Family-led, weekly eight rooms, one per area, each with a rule twist
//  Blight       Family, daily     strikes against this week's Blight (stacks with habit damage)
//  The Spire    Fellows, endless  a climb that never loses progress; failures build Resolve from habits
//  The Arena    Both, daily tries a ladder of rival franchise teams; your own franchise's heroes are outshone
//  Gauntlet     Both, daily run   roguelike draft with normalised power; wounds carry between floors
//
// State lives in state.modes (see freshModes). Actions arrive as act(state, 'mode:<name>', now, target, value).
import {AREAS,AREA_IDS,FELLOWS,FAMILY,characterById} from './cast.mjs';
import {habitDay,habitPeriod} from './habits.mjs';
import {skillLevel} from './skills.mjs';
import {fellowPower,bondLevel,totalRate,expeditionOutcome,currentBlight} from './game.mjs';
import {FRANCHISE,FRANCHISES} from './franchises.mjs';

// ---------------------------------------------------------------------------------------------
// Formulas (one line each)
// ---------------------------------------------------------------------------------------------
/** A Family member's combat power: 150 × bond level. Fellows use their normal Fellow Power. */
export const familyPower=bond=>150*bondLevel(bond);
/** Reward unit: 10 minutes of village income, at least 100 gold. Mode rewards are multiples of it. */
export const goldUnit=state=>Math.max(100,Math.round(totalRate(state,state.lastAt)*600));
export const riftNeed=f=>Math.round(250*1.15**(f-1));
export const spireNeed=f=>Math.round(400*1.12**(f-1)*(f%50===0?4:f%10===0?2:1));
export const arenaNeed=r=>Math.round(600*1.1**r*(r%5===4?1.5:1));
export const frontNeed=(w,lived)=>Math.round(300*1.13**(w-1)*(1-0.25*Math.min(1,lived/20)));
export const trialNeed=t=>Math.round(350*1.22**(t-1));
export const gauntletNeed=f=>Math.round(240*1.06**(f-1)*(f%5===0?1.15:1));
export const errandNeed=(hours,slots)=>Math.round(220*slots*hours**0.5);
/** Habit amps: per daily habit done today. */
const amp=(state,now,per,cap)=>1+Math.min(cap,per*dailiesToday(state,now));
export const RIFT_SQUAD=3,SPIRE_SQUAD=5,ARENA_SQUAD=5,FRONT_SQUAD=3,TRIAL_SQUAD=3,STRIKE_SQUAD=3,ERRAND_MAX_OUT=3,ARENA_TRIES=5,STRIKES_PER_DAY=3,STRIKE_BANK=9,GAUNTLET_MAX=6;

// ---------------------------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------------------------
export function freshModes(){return {errands:{day:'',out:[],done:[]},rift:{day:'',floor:0,used:[]},fronts:{week:'',used:[],waves:{}},
 trials:{week:'',cleared:{}},strike:{week:'',dmg:0,day:'',bank:STRIKES_PER_DAY,used:[]},spire:{floor:0,failAt:0},arena:{rank:0,day:'',tries:0},gauntlet:{day:'',run:null,best:0}}}
const M=state=>({...freshModes(),...(state.modes||{})});
/** Small seeded random, so a day's offers and a week's twists are stable. */
export function seeded(key){let h=2166136261;for(const c of key)h=Math.imul(h^c.charCodeAt(0),16777619);return ()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return ((h>>>0)%100000)/100000}}
const pick=(r,list)=>list[Math.floor(r()*list.length)];
export const dailiesToday=(state,now)=>{const day=habitDay(now);return (state.habits?.history||[]).filter(x=>x.kind==='complete'&&x.day===day&&String(x.period).startsWith('d:')).length};
const areaName=a=>AREAS.find(x=>x.id===a)?.name||a;
/** Points earned in an area over the last 7 days. */
export const areaWeek=(state,area,now)=>(state.habits?.history||[]).filter(x=>x.kind==='complete'&&x.domain===area&&now-x.at<7*864e5).reduce((n,x)=>n+x.points,0);

/** Everyone you've recruited, with power. kind: 'fellow' | 'family'. */
export function roster(state,kinds=['fellow','family']){const out=[];
 if(kinds.includes('fellow'))for(const f of FELLOWS)if(state.fellows?.[f.id])out.push({id:f.id,name:f.name,area:f.area,kind:'fellow',art:f.art,power:fellowPower(state,f.id)});
 if(kinds.includes('family'))for(const f of FAMILY)if(state.family?.[f.id])out.push({id:f.id,name:f.name,area:f.area,kind:'family',art:f.art,power:familyPower(state.family[f.id].bond)});
 return out}
export const charPower=(state,id)=>state.fellows?.[id]?fellowPower(state,id):state.family?.[id]?familyPower(state.family[id].bond):0;
const kindOf=id=>FELLOWS.some(f=>f.id===id)?'fellow':FAMILY.some(f=>f.id===id)?'family':null;

/** Pays a reward bundle into the state; returns [state, readable list]. */
function pay(s,{gold=0,crystals=0,sigils={},xp={},bond={}}){const n={...s,gold:s.gold+gold,earned:s.earned+gold,crystals:s.crystals+crystals,sigils:{...s.sigils},bonusXp:{...s.bonusXp},family:{...s.family}};const notes=[];
 if(gold)notes.push(`+${gold.toLocaleString('en-US')} gold`);if(crystals)notes.push(`+${crystals} crystals`);
 for(const [a,v] of Object.entries(sigils))if(v){n.sigils[a]=(n.sigils[a]||0)+v;notes.push(`+${v} ${areaName(a)} sigils`)}
 for(const [a,v] of Object.entries(xp))if(v){n.bonusXp[a]=(n.bonusXp[a]||0)+v;notes.push(`+${v} ${areaName(a)} XP`)}
 let b=0;for(const [id,v] of Object.entries(bond))if(n.family[id]){n.family[id]={bond:n.family[id].bond+v};b+=v}if(b)notes.push(`+${b} bond`);
 return [n,notes]}
const ok=(state,message,extra={})=>({state,message,...extra}),no=(state,error)=>({state,error});
const uniq=ids=>Array.isArray(ids)&&new Set(ids).size===ids.length;
function team(state,ids,{max,kinds,used=[]}){if(!uniq(ids)||!ids.length)return 'Pick a team';if(ids.length>max)return `Up to ${max}`;
 for(const id of ids){const k=kindOf(id);if(!k||!kinds.includes(k))return 'Someone on that team can’t go here';if(!(k==='fellow'?state.fellows?.[id]:state.family?.[id]))return characterById(id)?.name+' hasn’t joined yet';if(used.includes(id))return characterById(id)?.name+' already fought in this one'}return null}

// ---------------------------------------------------------------------------------------------
// Errands (Family)
// ---------------------------------------------------------------------------------------------
const ERRAND_JOBS={faith:['Mend the Chapel roof','Copy the old hymnals','Keep vigil at the shrine'],marriage:['Set the Rose Café for a festival','Find the lost wedding ring','Deliver love letters for the village'],
 fatherhood:['Watch the village kids for a day','Build a treehouse','Run the harvest games'],fitness:['Clear the hill road','Carry stone for the new wall','Run messages to the outposts'],
 work:['Balance the Market ledgers','Escort a trade caravan','Haggle for timber'],home:['Patch the Workshop roof','Gather firewood','Weed the commons'],
 discipline:['Stand the night watch','Catalogue the Library vault','Drill the militia'],hobbies:['Paint the Guildhall banners','Fish the far lake','Rehearse the festival song']};
/** Today's five offers: a job in an area, 1/4/8 hours, a crew of 2-3, and what it pays. */
export function errandOffers(state,now){const day=habitDay(now),r=seeded('errand:'+day);return Array.from({length:5},(_,i)=>{const area=pick(r,AREA_IDS),hours=pick(r,[1,4,8]),slots=pick(r,[2,3]),kind=pick(r,['gold','sigils','bond']);
 return {id:`${day}:${i}`,title:pick(r,ERRAND_JOBS[area]),area,hours,slots,kind,need:errandNeed(hours,slots)}})}
function errandReward(state,o,crew,mult){const u=goldUnit(state);if(o.kind==='gold')return {gold:Math.round(u*0.5*o.hours*mult)};if(o.kind==='sigils')return {sigils:{[o.area]:Math.round(6*o.hours*mult)}};
 return {bond:Object.fromEntries(crew.map(id=>[id,Math.round(25*o.hours*mult)]))}}
const busy=(m)=>m.errands.out.flatMap(x=>x.crew);

// ---------------------------------------------------------------------------------------------
// Trials: one room per area, each with a twist on how team power counts
// ---------------------------------------------------------------------------------------------
/** @type {Record<string,{name:string,text:string}>} */
export const TRIAL_RULES={fitness:{name:'Bleed',text:'No healing in here: power ×0.8, but +10% per Fitness member.'},
 faith:{name:'Silence',text:'Every bonus is silenced. Raw power only.'},discipline:{name:'The Beat',text:'The room pulses: odd tiers ×1.6, even tiers ×0.7.'},
 fatherhood:{name:'The Ward',text:'Someone has to guard the child: your weakest member doesn’t count.'},work:{name:'Deadline',text:'No time: only your two strongest count.'},
 home:{name:'The Hearth',text:'Defend the hearth: the need is 20% higher, +25% if a Home member is with you.'},
 marriage:{name:'Bonded',text:'Partners fight better: ×1.3 if two members share a franchise, otherwise ×0.8.'},hobbies:{name:'Wild Card',text:'Borrows another room’s rule each week.'}};
export const trialRule=(area,now)=>area==='hobbies'?pick(seeded('wild:'+habitPeriod('weekly',now)),AREA_IDS.filter(a=>a!=='hobbies')):area;
export const trialCap=(state,area)=>2*(1+Math.floor(skillLevel(state,area)/10));
/** Team power in a Trial room. Family members count ×1.5 (Family lead the Trials) unless the room is silenced. */
export function trialPower(state,area,ids,tier,now){const rule=trialRule(area,now),list=ids.map(id=>({id,p:charPower(state,id)*(rule!=='faith'&&kindOf(id)==='family'?1.5:1),c:characterById(id)}));
 let ps=list.map(x=>x.p).sort((a,b)=>b-a),sum=ps.reduce((a,b)=>a+b,0),need=trialNeed(tier);
 if(rule==='fitness')sum*=0.8+0.1*list.filter(x=>x.c.area==='fitness').length;
 if(rule==='discipline')sum*=tier%2?1.6:0.7;
 if(rule==='fatherhood')sum=ps.slice(0,-1).reduce((a,b)=>a+b,0);
 if(rule==='work')sum=ps.slice(0,2).reduce((a,b)=>a+b,0);
 if(rule==='home'){need*=1.2;if(list.some(x=>x.c.area==='home'))sum*=1.25}
 if(rule==='marriage'){const f=list.map(x=>FRANCHISE[x.id]);sum*=f.some((x,i)=>f.indexOf(x)!==i)?1.3:0.8}
 return {power:Math.round(sum),need:Math.round(need),rule}}

// ---------------------------------------------------------------------------------------------
// Gauntlet
// ---------------------------------------------------------------------------------------------
export const GAUNTLET_BOONS={rally:{name:'Rally',text:'+15% power for the rest of the run.'},mend:{name:'Mend',text:'Heal 40.'},focus:{name:'Focus',text:'Members from the sector’s area count ×1.6 instead of ×1.3.'}};
/** The sector (every 3 floors) favours one life area. */
export const gauntletSector=(day,floor)=>pick(seeded(`sector:${day}:${Math.floor((floor-1)/3)}`),AREA_IDS);
/** Everyone counts as 100 power in the Gauntlet (your account strength doesn't matter): ×1.3 for the sector's area. */
export function gauntletPower(run,day){const sec=gauntletSector(day,run.floor+1),fav=run.boons.includes('focus')?1.6:1.3;
 const base=run.squad.reduce((n,id)=>n+100*(characterById(id)?.area===sec?fav:1),0);return Math.round(base*(1+0.15*run.boons.filter(b=>b==='rally').length))}
function draftChoices(state,day,n,exclude,salt){const r=seeded(`draft:${day}:${salt}`),pool=roster(state).map(x=>x.id).filter(id=>!exclude.includes(id)),out=[];while(out.length<n&&pool.length)out.push(pool.splice(Math.floor(r()*pool.length),1)[0]);return out}
export const gauntletDraft=(state,day)=>draftChoices(state,day,5,[],'start');

// ---------------------------------------------------------------------------------------------
// The rest of the status a screen needs
// ---------------------------------------------------------------------------------------------
/** The Rift is locked to one life area a day, cycling through all eight. */
export const riftArea=now=>AREA_IDS[Math.floor(new Date(habitDay(now)+'T12:00:00').getTime()/864e5)%8];
export function riftPower(state,ids,now){const area=riftArea(now);return Math.round(ids.reduce((n,id)=>n+charPower(state,id)*(characterById(id)?.area===area?2:1),0)*amp(state,now,0.05,0.4))}
export function spireResolve(state){const m=M(state);if(!m.spire.failAt)return 1;const n=(state.habits?.history||[]).filter(x=>x.kind==='complete'&&x.at>m.spire.failAt).length;return 1+Math.min(0.2,0.01*n)}
export const arenaFoe=r=>FRANCHISES[r%FRANCHISES.length];
export function arenaPower(state,ids,now){const foe=arenaFoe(M(state).arena.rank);return Math.round(ids.reduce((n,id)=>n+charPower(state,id)*(FRANCHISE[id]===foe?0.75:1),0)*amp(state,now,0.03,0.2))}
export function frontPower(state,area,ids){return Math.round(ids.reduce((n,id)=>n+charPower(state,id)*(characterById(id)?.area===area?1.25:1),0))}
export const strikeDamage=(state,ids,hp)=>Math.min(Math.round(hp*0.15),Math.round(3+ids.reduce((n,id)=>n+charPower(state,id),0)/400));
/** Reset counters that belong to a past day or week; returns the modes object for "now". */
export function modesNow(state,now){const m=M(state),day=habitDay(now),week=habitPeriod('weekly',now);
 const errands={...m.errands,done:m.errands.day===day?m.errands.done:[]},rift=m.rift.day===day?m.rift:{day,floor:0,used:[]},fronts=m.fronts.week===week?m.fronts:{week,used:[],waves:{}};
 const trials=m.trials.week===week?m.trials:{week,cleared:{}},arena=m.arena.day===day?m.arena:{...m.arena,day,tries:0};
 let strike=m.strike.week===week?m.strike:{week,dmg:0,day:'',bank:STRIKES_PER_DAY,used:[]};if(strike.day!==day)strike={...strike,day,used:[],bank:Math.min(STRIKE_BANK,(strike.day?strike.bank:0)+STRIKES_PER_DAY)};
 const gauntlet=m.gauntlet.day===day?m.gauntlet:{...m.gauntlet,day,run:null,done:false};
 return {...m,errands:{...errands,day},rift,fronts,trials,arena,strike,gauntlet}}

// ---------------------------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------------------------
export function modeAct(s,name,now,target,value){const m=modesNow(s,now),day=habitDay(now),u=goldUnit(s);const put=(st,part)=>({...st,modes:{...m,...part}});
 switch(name){
  case 'errandSend':{const o=errandOffers(s,now).find(x=>x.id===target);if(!o)return no(s,'That errand is gone');if(m.errands.done.includes(o.id)||m.errands.out.some(x=>x.id===o.id))return no(s,'Already taken today');
   if(m.errands.out.length>=ERRAND_MAX_OUT)return no(s,`Only ${ERRAND_MAX_OUT} errands at a time`);const e=team(s,value,{max:o.slots,kinds:['family'],used:busy(m)});if(e)return no(s,e);
   return ok(put(s,{errands:{...m.errands,out:[...m.errands.out,{id:o.id,offer:o,crew:value,end:now+o.hours*3600e3}]}}),`${value.map(id=>characterById(id).name).join(' and ')} set off: back in ${o.hours}h.`)}
  case 'errandCollect':{const x=m.errands.out.find(e=>e.id===target);if(!x)return no(s,'Nothing to collect');if(x.end>now)return no(s,'They’re not back yet');
   const power=x.crew.reduce((n,id)=>n+charPower(s,id),0),ratio=power/x.offer.need,mult=(ratio<1?0.5:expeditionOutcome(ratio).mult)*amp(s,now,0.07,0.5);
   const [n,notes]=pay(s,errandReward(s,x.offer,x.crew,mult));return ok(put(n,{errands:{...m.errands,out:m.errands.out.filter(e=>e!==x),done:[...m.errands.done,x.id]}}),`${x.offer.title}: ${notes.join(' · ')}`)}
  case 'rift':{if(m.rift.used.length)return no(s,'Your Rift squad is spent for today. Back tomorrow.');const e=team(s,value,{max:RIFT_SQUAD,kinds:['fellow']});if(e)return no(s,e);
   const p=riftPower(s,value,now),area=riftArea(now);let f=0;while(f<200&&p>=riftNeed(f+1))f++;
   const [n,notes]=pay(s,{gold:Math.round(u*0.25*f),sigils:{[area]:f}});return ok(put(n,{rift:{day,floor:f,used:value}}),f?`Climbed ${f} floor${f>1?'s':''} of the ${areaName(area)} Rift. ${notes.join(' · ')}`:'The first floor was too much. Level up and try tomorrow.',{floors:f})}
  case 'spire':{const e=team(s,value,{max:SPIRE_SQUAD,kinds:['fellow']});if(e)return no(s,e);const p=Math.round(value.reduce((n,id)=>n+charPower(s,id),0)*spireResolve(s));let f=m.spire.floor,gold=0,cr=0;
   while(f<1000&&p>=spireNeed(f+1)){f++;gold+=Math.round(u*0.3);if(f%10===0)cr+=10}
   if(f===m.spire.floor)return ok(put(s,{spire:{...m.spire,failAt:m.spire.failAt||now}}),`Floor ${f+1} held. Needs ${spireNeed(f+1).toLocaleString('en-US')}; you brought ${p.toLocaleString('en-US')}. Every habit you keep adds Resolve (up to +20%).`);
   const [n,notes]=pay(s,{gold,crystals:cr});return ok(put(n,{spire:{floor:f,failAt:0}}),`Climbed to floor ${f}. ${notes.join(' · ')}`)}
  case 'arena':{if(m.arena.tries>=ARENA_TRIES)return no(s,'No Arena tries left today');const e=team(s,value,{max:ARENA_SQUAD,kinds:['fellow','family']});if(e)return no(s,e);
   const r=m.arena.rank,foe=arenaFoe(r),p=arenaPower(s,value,now),need=arenaNeed(r);
   if(p<need)return ok(put(s,{arena:{...m.arena,tries:m.arena.tries+1}}),`Team ${foe} won this round (${p.toLocaleString('en-US')} vs ${need.toLocaleString('en-US')}).`,{won:false});
   const [n,notes]=pay(s,{gold:Math.round(u*0.5),crystals:r%5===4?15:0});return ok(put(n,{arena:{...m.arena,rank:r+1,tries:m.arena.tries+1}}),`Beat Team ${foe}! Rank ${r+2}. ${notes.join(' · ')}`,{won:true})}
  case 'front':{const area=target;if(!AREA_IDS.includes(area))return no(s,'Unknown front');if(m.fronts.waves[area]!==undefined)return no(s,'That front has already been defended this week');
   const e=team(s,value,{max:FRONT_SQUAD,kinds:['fellow','family'],used:m.fronts.used});if(e)return no(s,e);const p=frontPower(s,area,value),lived=areaWeek(s,area,now);let w=0;while(w<30&&p>=frontNeed(w+1,lived))w++;
   const [n,notes]=pay(s,{gold:Math.round(u*0.15*w),sigils:{[area]:w}});return ok(put(n,{fronts:{...m.fronts,used:[...m.fronts.used,...value],waves:{...m.fronts.waves,[area]:w}}}),`${areaName(area)} front: held ${w} wave${w===1?'':'s'}. ${notes.join(' · ')}`)}
  case 'trial':{const area=target;if(!AREA_IDS.includes(area))return no(s,'Unknown room');const tier=(m.trials.cleared[area]||0)+1;if(tier>trialCap(s,area))return no(s,`Room locked at tier ${tier}. Raise your ${areaName(area)} skill to open more.`);
   const e=team(s,value,{max:TRIAL_SQUAD,kinds:['fellow','family']});if(e)return no(s,e);if(!value.some(id=>kindOf(id)==='family'))return no(s,'The Trials need at least one Family member');
   const t=trialPower(s,area,value,tier,now);if(t.power<t.need)return ok(s,`${TRIAL_RULES[t.rule].name} beat you on tier ${tier} (${t.power.toLocaleString('en-US')} vs ${t.need.toLocaleString('en-US')}).`,{won:false});
   const fam=value.filter(id=>kindOf(id)==='family');const [n,notes]=pay(s,{gold:Math.round(u*0.4),sigils:{[area]:5},bond:Object.fromEntries(fam.map(id=>[id,20]))});
   return ok(put(n,{trials:{...m.trials,cleared:{...m.trials.cleared,[area]:tier}}}),`${areaName(area)} Trial, tier ${tier} cleared! ${notes.join(' · ')}`,{won:true})}
  case 'strike':{if(m.strike.bank<1)return no(s,'No strikes left. Three more tomorrow.');const b=currentBlight(s,now);if(b.defeated)return no(s,`${b.name} is already down`);
   const e=team(s,value,{max:STRIKE_SQUAD,kinds:['family'],used:m.strike.used});if(e)return no(s,e);const d=strikeDamage(s,value,b.hp);
   return ok(put(s,{strike:{...m.strike,dmg:m.strike.dmg+d,bank:m.strike.bank-1,used:[...m.strike.used,...value]}}),`Your strike hit ${b.name} for ${d}.`)}
  case 'gauntletStart':{if(m.gauntlet.run)return no(s,'A run is already underway');if(m.gauntlet.done)return no(s,'One Gauntlet run a day. Back tomorrow.');const draft=gauntletDraft(s,day);
   if(!uniq(value)||value.length!==Math.min(3,draft.length)||value.some(id=>!draft.includes(id)))return no(s,'Pick 3 from the draft');
   return ok(put(s,{gauntlet:{...m.gauntlet,run:{floor:0,hp:100,squad:value,boons:[],offer:null}}}),'The Gauntlet opens. Good luck.')}
  case 'gauntletFight':{const run=m.gauntlet.run;if(!run)return no(s,'Start a run first');if(run.offer)return no(s,'Choose your reward first');const f=run.floor+1,p=gauntletPower(run,day),need=gauntletNeed(f);
   if(p<need){const hp=run.hp-40;if(hp<=0)return endRun(s,m,run,`Floor ${f} broke the squad.`,put);return ok(put(s,{gauntlet:{...m.gauntlet,run:{...run,hp}}}),`Floor ${f} pushed you back. ${hp} health left.`)}
   const hp=run.hp-Math.max(4,Math.round(15*need/p));const [n,notes]=pay(s,{gold:Math.round(u*0.2),crystals:{10:10,25:25,50:50}[f]||0});
   if(hp<=0)return endRun(n,m,{...run,floor:f},`Cleared floor ${f}, but the squad is spent.`,put);
   const offer=f%3===0?{draft:run.squad.length<GAUNTLET_MAX?draftChoices(s,day,3,run.squad,'f'+f):[],boons:['rally','mend','focus']}:null;
   return ok(put(n,{gauntlet:{...m.gauntlet,run:{...run,floor:f,hp,offer}}}),`Floor ${f} cleared. ${notes.join(' · ')}`)}
  case 'gauntletChoose':{const run=m.gauntlet.run;if(!run?.offer)return no(s,'Nothing to choose');let next={...run,offer:null};
   if(run.offer.draft.includes(target))next.squad=[...run.squad,target];else if(run.offer.boons.includes(target)){next.boons=[...run.boons,target];if(target==='mend')next.hp=Math.min(100,run.hp+40)}else return no(s,'Pick one of the offers');
   next.hp=Math.min(100,next.hp+20);return ok(put(s,{gauntlet:{...m.gauntlet,run:next}}),'Sector cleared: +20 health.')}
  case 'gauntletEnd':{const run=m.gauntlet.run;if(!run)return no(s,'No run');return endRun(s,m,run,'You walked out.',put)}
 }
 return no(s,'Unknown mode action')}
function endRun(s,m,run,why,put){return ok(put(s,{gauntlet:{...m.gauntlet,run:null,done:true,best:Math.max(m.gauntlet.best,run.floor)}}),`${why} Run over at floor ${run.floor}.`)}
