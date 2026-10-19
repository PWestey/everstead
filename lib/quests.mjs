// Quests: a chain of steps that alternates real habits with conversations.
//   {type:'talk', tree}                 talk to the quest giver (a dialogue tree in lib/dialogue.mjs)
//   {type:'habits', area, count}        complete `count` habits in an area since the step began
//   {type:'days', area, count}          complete habits in an area on `count` different days
// Progress lives in state.quests[id] = {step, at, done}. Habit steps advance automatically.
import {habitDay} from './habits.mjs';

/** @type {Record<string,any>} */
export const QUESTS={
 'iron-body':{name:'The Iron Body',area:'fitness',giver:'darrow',points:1,
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
export const questIds=Object.keys(QUESTS);
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
 if(!s)return {status:state.fellows?.[q.giver]||state.family?.[q.giver]?'available':'locked',stepIndex:0,step:q.steps[0]};
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
