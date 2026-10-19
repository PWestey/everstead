// Checks a dialogue content file: node scripts/check-content.mjs <file>
// Knows three shapes: FELLOW_MOMENTS, FAMILY_MOMENTS and QUESTS+TREES. Prints problems, exits 1 if any.
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {FELLOWS,FAMILY,AREA_IDS,characterById} from '../lib/cast.mjs';

const BGS=['facility-scenes/apothecary.webp','facility-scenes/banquets.webp','facility-scenes/businesses.webp','facility-scenes/expo.webp','facility-scenes/fishing.webp','facility-scenes/fountain.webp','facility-scenes/habits.webp','facility-scenes/journey.webp','facility-scenes/mine.webp','facility-scenes/museum.webp','facility-scenes/northern.webp','facility-scenes/raphael.webp','facility-scenes/recruit.webp','facility-scenes/roaming.webp','facility-scenes/school.webp','facility-scenes/stories.webp','facility-scenes/trading.webp','facility-scenes/treasure.webp','ui-scenes/Bg_City_01_Mid.jpg','ui-scenes/Bg_Field_01_Mid.jpg','ui-scenes/Bg_Level_03_Mid.jpg','ui-scenes/Bg_Village_01_Mid.jpg'];
export {BGS};
const errs=[];const err=m=>errs.push(m);
const str=(x,where)=>{if(typeof x!=='string'||!x.trim())err(where+': empty or not a string');else if(x.length>240)err(where+': over 240 chars');else if(/[^\\]'/.test(x)&&false)err(where)};
function moment(m,where){
 if(!m||!Array.isArray(m.open)||!m.open.length)return err(where+': needs open:[lines]');
 m.open.forEach((l,i)=>str(l,where+'.open['+i+']'));
 if(m.opts!==undefined){if(!Array.isArray(m.opts)||m.opts.length<2||m.opts.length>3)err(where+': opts must be 2-3 options');
  else m.opts.forEach((o,i)=>{str(o.t,where+'.opts['+i+'].t');if(!Array.isArray(o.r)||!o.r.length)err(where+'.opts['+i+']: needs r:[lines]');else o.r.forEach((l,j)=>str(l,where+'.opts['+i+'].r['+j+']'))})}
}
const file=process.argv[2];if(!file){console.error('usage: node scripts/check-content.mjs <file>');process.exit(2)}
const mod=await import(pathToFileURL(resolve(file)).href);

if(mod.FELLOW_MOMENTS){for(const [id,v] of Object.entries(mod.FELLOW_MOMENTS)){if(!FELLOWS.some(f=>f.id===id))err('unknown fellow '+id);
 if(!Array.isArray(v.level)||v.level.length!==4)err(id+': level needs exactly 4 moments');else v.level.forEach((m,i)=>moment(m,id+'.level['+i+']'));
 if(!Array.isArray(v.star)||v.star.length!==5)err(id+': star needs exactly 5 moments');else v.star.forEach((m,i)=>moment(m,id+'.star['+i+']'))}}
if(mod.FAMILY_MOMENTS){for(const [id,v] of Object.entries(mod.FAMILY_MOMENTS)){if(!FAMILY.some(f=>f.id===id))err('unknown family '+id);
 if(!Array.isArray(v.visit)||v.visit.length!==5)err(id+': visit needs exactly 5 moments');else v.visit.forEach((m,i)=>moment(m,id+'.visit['+i+']'));
 if(!Array.isArray(v.gift)||v.gift.length!==3)err(id+': gift needs exactly 3 lines');else v.gift.forEach((l,i)=>str(l,id+'.gift['+i+']'))}}
if(mod.QUESTS){const T=mod.TREES||{};
 for(const [qid,q] of Object.entries(mod.QUESTS)){
  if(!FELLOWS.some(f=>f.id===q.giver))err(qid+': giver must be a fellow id');
  if(!AREA_IDS.includes(q.area))err(qid+': bad area');
  if(![1,2,3,4,5].includes(q.tier))err(qid+': tier 1-5');
  str(q.name,qid+'.name');str(q.blurb,qid+'.blurb');
  if(!Array.isArray(q.say)||q.say.length!==3)err(qid+': say needs 3 step texts');
  for(const n of [1,2,3]){const tid=qid+'-'+n,t=T[tid];if(!t){err('missing tree '+tid);continue}
   if(t.who!==q.giver)err(tid+': who must be '+q.giver);
   if(!BGS.includes(t.bg))err(tid+': bg must be one of the listed backdrops');
   if(!t.nodes?.[t.start])err(tid+': start node missing');
   const fx=[];
   for(const [k,nd] of Object.entries(t.nodes||{})){const w=tid+':'+k;
    if(!['narrator','player'].includes(nd.s)&&!characterById(nd.s))err(w+': s must be narrator, player or a cast id');
    str(nd.t,w);
    if(nd.next&&!t.nodes[nd.next])err(w+': next → missing '+nd.next);
    if(!nd.next&&!nd.opts&&!nd.end)err(w+': needs next, opts or end');
    for(const e of nd.do||[])fx.push([e,w]);
    for(const [i,o] of (nd.opts||[]).entries()){str(o.t,w+' opt'+i);if(!t.nodes[o.next])err(w+' opt'+i+': next → missing '+o.next);for(const e of o.do||[])fx.push([e,w+' opt'+i])}}
   const want={1:'start',2:'advance',3:'complete'}[n];
   const qs=fx.filter(([e])=>e.quest);if(qs.length!==1||qs[0][0].quest[0]!==qid||qs[0][0].quest[1]!==want)err(tid+`: needs exactly one {quest:['${qid}','${want}']}`);
   for(const [e,w] of fx){const k=Object.keys(e)[0];if(!['quest','flag','xp','gold'].includes(k))err(w+': effect '+k+' not allowed');if(e.xp&&(e.xp[1]>1000||!AREA_IDS.includes(e.xp[0])))err(w+': xp effects ≤1000 and a real area');if(e.gold&&e.gold>500)err(w+': gold effects ≤500')}
   if(n===3){const done=Object.values(t.nodes).find(nd=>nd.do?.some(e=>e.quest));if(!done?.end)err(tid+': the complete effect goes on an end node')}
  }}}
if(mod.EXPEDITION_SCENES){const {ADVENTURE_IDS}=await import('../lib/expedition-data.mjs');
 // Scenes may be split across files; tests/game.test.mjs checks every place has one.
 for(const [id,m] of Object.entries(mod.EXPEDITION_SCENES)){if(!ADVENTURE_IDS.includes(id))err('unknown adventure '+id);moment(m,id);
  for(const l of [...(m.open||[]),...(m.opts||[]).flatMap(o=>o.r||[])]){const sp=/^([a-z]+): /.exec(l)?.[1];if(sp&&sp!=='player'&&!characterById(sp))err(id+': unknown speaker '+sp)}}}
if(!mod.FELLOW_MOMENTS&&!mod.FAMILY_MOMENTS&&!mod.QUESTS&&!mod.EXPEDITION_SCENES)err('file exports none of FELLOW_MOMENTS, FAMILY_MOMENTS, QUESTS');
if(errs.length){console.log(errs.join('\n'));process.exit(1)}else console.log('OK');
