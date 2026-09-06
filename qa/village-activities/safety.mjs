// Isolated-browser transaction tests. Hooks exist only in intercepted HTML.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const NS='oathforge_new_world_proto_v01';
const marker="CURRENT_TRANSACTION_SOURCES.add('phase23-qa-fixture');PERSISTED_RAW=null";
const hooks=`window.__villageSafety={
 snapshot:()=>({state:clone(villagePlayActual()),raw:storageGet(NS),staged:storageGet(STAGING_KEY),blocked:!!PERSISTENCE_BLOCKED}),
 action:(id,action,payload)=>villagePlayChange(id,action,payload),
 interruptClaim:(id,claimId,point)=>{const prior=storageSet;let injected=false;storageSet=function(key,...args){if(!injected&&key===(point==='active'?NS:STAGING_KEY)){injected=true;throw new PersistenceError('qa-interrupted-claim','Isolated claim write interruption');}return prior(key,...args)};try{return{result:villagePlayChange(id,'claim',{claimId}),injected}}finally{storageSet=prior}},
 refuseUnowned:()=>{const actual=villagePlayActual(),id=FELLOW_DEFS[0].id,owned=actual.fellows[id].owned;actual.fellows[id].owned=false;try{return villagePlayChange(id,'train',{},true)}finally{actual.fellows[id].owned=owned}},
 oldSave:()=>{const state=clone(villagePlayActual());delete state.villageActivities;return{state,valid:phase24lValidate(state)};}
};`;
let assertions=0;
const eq=(a,b,message)=>{assert.deepEqual(a,b,message);assertions++};
const ok=(value,message)=>{assert.ok(value,message);assertions++};
const browser=await chromium.launch({headless:true});
async function fresh(){
 const context=await browser.newContext();
 await context.addInitScript(()=>{Date.now=()=>1815000000000});
 const page=await context.newPage();
 await page.route('**/index.html',route=>{
  const html=fs.readFileSync('index.html','utf8');assert(html.includes(marker));
  return route.fulfill({contentType:'text/html',body:html.replace(marker,hooks+marker)});
 });
 await page.goto('http://127.0.0.1:8857/index.html',{waitUntil:'load'});
 return {context,page};
}
const snapshot=page=>page.evaluate(()=>window.__villageSafety.snapshot());
async function pending(page,id='command'){
 await page.evaluate(id=>{
  const api=window.__villageSafety;
  for(const [action,payload]of [['tutorial',{}],['start',{}]])if(!api.action(id,action,payload).ok)throw Error('Setup failed');
  for(const step of EVERSTEAD_VILLAGE_ACTIVITIES.definitions[id].scenarios[0].steps)if(!api.action(id,'choose',{choice:step.answer}).ok)throw Error('Choice failed');
 },id);
 return (await snapshot(page)).state.villageActivities.facilities[id].pending.id;
}
try{
 // Old valid schema-15 saves acquire the optional extension without changing balances.
 {
  const {context,page}=await fresh(),old=await page.evaluate(()=>window.__villageSafety.oldSave());
  ok(old.valid.ok,'Pre-extension schema-15 state remains valid');
  await page.evaluate(({key,state})=>localStorage.setItem(key,JSON.stringify(state)),{key:NS,state:old.state});
  await page.reload({waitUntil:'load'});
  const migrated=await snapshot(page);
  ok(!migrated.blocked,'Old save loads without protection screen');
  ok(migrated.state.villageActivities?.version===1,'Optional extension initialized');
  eq(migrated.state.gold,old.state.gold,'Extension preserves Gold');
  eq(migrated.state.experienceProgression,old.state.experienceProgression,'Extension preserves EXP wallets and ledgers');
  eq(migrated.state.fellows,old.state.fellows,'Extension preserves Fellows');
  await page.reload({waitUntil:'load'});
  eq((await snapshot(page)).state.villageActivities,migrated.state.villageActivities,'Repeated boot does not reset or duplicate extension');
  const before=await snapshot(page),refusal=await page.evaluate(()=>window.__villageSafety.refuseUnowned()),after=await snapshot(page);
  ok(!refusal.ok,'Unowned Fellow training refused');eq(after.raw,before.raw,'Ownership refusal performs no persistence write');
  await context.close();
 }
 for(const point of ['staging','active']){
  const {context,page}=await fresh(),claimId=await pending(page),before=await snapshot(page);
  const failure=await page.evaluate(({claimId,point})=>window.__villageSafety.interruptClaim('command',claimId,point),{claimId,point});
  ok(failure.injected,`${point} failure was exercised`);ok(!failure.result.ok,`${point} interruption rejects immediate claim result`);
  const interrupted=await snapshot(page);
  eq(interrupted.raw,before.raw,`${point} interrupted active bytes remain unchanged`);
  eq(interrupted.state.villageActivities,before.state.villageActivities,`${point} failed mutation does not alter in-memory activity rewards`);
  eq(interrupted.state.gold,before.state.gold,`${point} failed mutation does not award in-memory Gold`);
  if(point==='active')ok(interrupted.staged!==null,'Durable staged claim retained for recovery');
  else eq(interrupted.staged,null,'Before-stage interruption has no staged claim');
  await page.reload({waitUntil:'load'});
  let recovered=await snapshot(page);
  ok(!recovered.blocked,`${point} reload recovers normally`);
  if(point==='staging'){
   eq(recovered.state.villageActivities.facilities.command.claimed,0,'Before-stage failure keeps reward pending');
   ok((await page.evaluate(claimId=>window.__villageSafety.action('command','claim',{claimId}),claimId)).ok,'Pending reward remains claimable once');
   recovered=await snapshot(page);
  }
  eq(recovered.state.villageActivities.facilities.command.claimed,1,`${point} terminal state contains exactly one claim`);
  eq(recovered.state.gold-before.state.gold,before.state.villageActivities.facilities.command.pending.gold,`${point} recovery awards exact Gold once`);
  eq(recovered.state.villageActivities.training-before.state.villageActivities.training,3,`${point} recovery awards Training once`);
  eq(recovered.staged,null,`${point} recovery cleans staging`);
  const replay=await page.evaluate(claimId=>window.__villageSafety.action('command','claim',{claimId}),claimId);
  ok(!replay.ok,`${point} replayed claim refuses`);
  eq((await snapshot(page)).raw,recovered.raw,`${point} replay writes nothing`);
  await page.reload({waitUntil:'load'});
  eq((await snapshot(page)).state.villageActivities,recovered.state.villageActivities,`${point} second reload preserves exactly-once result`);
  await context.close();
 }
 console.log(`Village activity integration safety: ${assertions} assertions passed.`);
}finally{await browser.close()}
