// Quests: a chain of steps that alternates real habits with conversations.
//   {type:'talk', tree}                 talk to the quest giver (a dialogue tree in lib/dialogue.mjs)
//   {type:'habits', area, count}        complete `count` habits in an area since the step began
//   {type:'days', area, count}          complete habits in an area on `count` different days
// Progress lives in state.quests[id] = {step, at, done}. Habit steps advance automatically.
import {habitDay} from './habits.mjs';
import {AREAS,FELLOWS,characterById} from './cast.mjs';
import {totalLevel} from './skills.mjs';
import {QUESTS as Q_FAITH_MARRIAGE} from './quests/faith-marriage.mjs';
import {QUESTS as Q_FATHERHOOD_FITNESS} from './quests/fatherhood-fitness.mjs';
import {QUESTS as Q_WORK_HOME} from './quests/work-home.mjs';
import {QUESTS as Q_DISCIPLINE_HOBBIES} from './quests/discipline-hobbies.mjs';
import {QUESTS as Q_WAVE2_A} from './quests/wave2-a.mjs';
import {QUESTS as Q_WAVE2_B} from './quests/wave2-b.mjs';
import {QUESTS as Q_WAVE2_C} from './quests/wave2-c.mjs';

// Quest tiers set the size of the ask and the reward. Within an area, quests unlock one after another
// (lowest tier first), and each tier also needs a total level, so they spread out over months of play.
//   tier: habits, days, quest points, XP, gold, sigils, total level to unlock
export const TIERS={1:{habits:3,days:3,points:1,xp:5000,gold:1500,sigils:40,total:0},
 2:{habits:5,days:4,points:2,xp:10000,gold:3000,sigils:60,total:100},
 3:{habits:8,days:5,points:3,xp:20000,gold:5000,sigils:80,total:200},
 4:{habits:12,days:7,points:4,xp:35000,gold:8000,sigils:100,total:300},
 5:{habits:15,days:10,points:5,xp:50000,gold:12000,sigils:120,total:400}};
const areaName=id=>AREAS.find(a=>a.id===id)?.name;

/** Expands a written quest {name,area,giver,tier,blurb,say:[3 talk texts]} into the full step list and rewards. */
export function buildQuest(id,q){const t=TIERS[q.tier],a=areaName(q.area);
 return {name:q.name,area:q.area,giver:q.giver,tier:q.tier,points:t.points,blurb:q.blurb,
  steps:[{type:'talk',tree:id+'-1',text:q.say[0]},{type:'habits',area:q.area,count:t.habits,text:`Complete ${t.habits} ${a} habits.`},
   {type:'talk',tree:id+'-2',text:q.say[1]},{type:'days',area:q.area,count:t.days,text:`Do ${a} habits on ${t.days} different days.`},{type:'talk',tree:id+'-3',text:q.say[2]}],
  rewards:{xp:[[q.area,t.xp]],gold:t.gold,sigils:[[q.area,t.sigils]]},
  rewardText:[`${t.points} Quest Point${t.points>1?'s':''}`,`${t.xp.toLocaleString('en-US')} ${a} XP`,`${t.gold.toLocaleString('en-US')} gold`,`${t.sigils} ${a} sigils`]}}
const WRITTEN={...Q_FAITH_MARRIAGE,...Q_FATHERHOOD_FITNESS,...Q_WORK_HOME,...Q_DISCIPLINE_HOBBIES,...Q_WAVE2_A,...Q_WAVE2_B,...Q_WAVE2_C};

/** @type {Record<string,any>} */
export const QUESTS={
 'iron-body':{name:'The Iron Body',area:'fitness',giver:'darrow',tier:1,points:1,
  blurb:'Darrow has seen you in the Training Yard. He wants to know whether you’re serious.',
  steps:[
   {type:'talk',tree:'iron-body-1',text:'Talk to Darrow in the Training Yard.'},
   {type:'habits',area:'fitness',count:3,text:'Complete 3 Fitness habits.'},
   {type:'talk',tree:'iron-body-2',text:'Report back to Darrow.'},
   {type:'days',area:'fitness',count:3,text:'Train on 3 different days.'},
   {type:'talk',tree:'iron-body-3',text:'Meet Darrow by the river at sunrise.'},
  ],
  rewards:{xp:[['fitness',5000]],gold:1500,sigils:[['fitness',40]]},
  rewardText:['1 Quest Point','5,000 Fitness XP','1,500 gold','40 Fitness sigils']},
};
for(const [id,q] of Object.entries(WRITTEN))QUESTS[id]=buildQuest(id,q);
/** Journal order: by tier, then life area, then the giver's place in the cast. */
const castOrder=id=>FELLOWS.findIndex(f=>f.id===id);
export const questIds=Object.keys(QUESTS).sort((a,b)=>QUESTS[a].tier-QUESTS[b].tier||AREAS.findIndex(x=>x.id===QUESTS[a].area)-AREAS.findIndex(x=>x.id===QUESTS[b].area)||castOrder(QUESTS[a].giver)-castOrder(QUESTS[b].giver));
/** The quest before this one in its area (it must be finished first), or null. */
export const questBefore=id=>{const q=QUESTS[id];return questIds.filter(x=>QUESTS[x].area===q.area&&QUESTS[x].tier<q.tier).at(-1)||null};
/** Why a quest can't start yet, or null when it can. */
export function questLock(state,id){const q=QUESTS[id],prev=questBefore(id),need=TIERS[q.tier].total,giver=characterById(q.giver);
 if(!state.fellows?.[q.giver]&&!state.family?.[q.giver])return `Recruit ${giver?.name}. (${areaName(q.area)} habits bring ${giver?.name} to Everstead.)`;
 if(prev&&!state.quests?.[prev]?.done)return `Finish “${QUESTS[prev].name}” first.`;
 if(totalLevel(state)<need)return `Reach total level ${need}.`;
 return null}
/** @returns {any} */
export const questState=(state,id)=>state.quests?.[id]||null;
export const questPoints=state=>questIds.reduce((n,id)=>n+(state.quests?.[id]?.done?QUESTS[id].points:0),0);

/** Progress on an objective step: {have, need}. */
export function stepProgress(state,step,since){const rows=(state.habits?.history||[]).filter(x=>x.kind==='complete'&&x.domain===step.area&&x.at>=since);
 if(step.type==='habits')return {have:Math.min(step.count,rows.length),need:step.count};
 if(step.type==='days')return {have:Math.min(step.count,new Set(rows.map(x=>x.day)).size),need:step.count};
 return {have:0,need:1}}

/** Status for the journal: 'locked' | 'available' | 'active' | 'done', plus the current step. */
export function questStatus(state,id){const q=QUESTS[id],s=questState(state,id);
 if(s?.done)return {status:'done',stepIndex:q.steps.length,step:null};
 if(!s)return {status:questLock(state,id)?'locked':'available',stepIndex:0,step:q.steps[0]};
 const step=q.steps[s.step];return {status:'active',stepIndex:s.step,step,progress:step&&step.type!=='talk'?stepProgress(state,step,s.at):null}}

/** The conversation the giver wants to have right now, if any. */
export function pendingTalk(state,characterId){for(const id of questIds){const q=QUESTS[id];if(q.giver!==characterId)continue;const st=questStatus(state,id);if((st.status==='available'||st.status==='active')&&st.step?.type==='talk')return {quest:id,tree:st.step.tree}}return null}

/** Move quests past any habit steps that are now complete. Returns the updated state and names of quests that moved. */
export function advanceQuests(state,now){let out=state;const moved=[];
 for(const id of questIds){const q=QUESTS[id];let s=out.quests?.[id];if(!s||s.done)continue;let changed=false;
  while(q.steps[s.step]&&q.steps[s.step].type!=='talk'){const p=stepProgress(out,q.steps[s.step],s.at);if(p.have<p.need)break;s={...s,step:s.step+1,at:now};changed=true}
  if(changed){out={...out,quests:{...out.quests,[id]:s}};moved.push(q.name)}}
 return {state:out,moved}}
export {habitDay};
