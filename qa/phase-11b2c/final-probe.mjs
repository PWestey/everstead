import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname);
const source=readFileSync(resolve(ROOT,'qa/phase-11b2b/engine-probe.mjs'),'utf8');
const boundary=source.indexOf('\nconst imported=fresh()');
if(boundary<0)throw new Error('Phase 11B-2b helper boundary missing');
const moduleSource=source.slice(0,boundary)
  .replace("const ROOT=resolve(new URL('../..',import.meta.url).pathname)",`const ROOT=${JSON.stringify(ROOT)}`)
  +'\nexport {fresh,p,invoke,tools,operational,physical,snapshotSlots,same};\n';
const helpers=await import('data:text/javascript;base64,'+Buffer.from(moduleSource).toString('base64'));
const {fresh,p,invoke,tools,operational,physical,snapshotSlots,same}=helpers;
const rows=[];
const add=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const snap=run=>p(run,'snapshot()');
const active=run=>JSON.parse(snap(run).active);
const writes=run=>tools.writes(run);
const withoutBootMetadata=raw=>{const value=JSON.parse(raw),meta=value.saveMeta;return JSON.stringify({...value,saveMeta:{...meta,revision:0,source:'<boot>',updatedAt:0}})};
const fault=(run,options)=>Object.assign(run.fault,{enabled:true,remaining:1,skip:0,adapterOnly:false,type:'throw',message:'QuotaExceededError: injected storage capacity failure',...options});
const exactEndpoint=(after,before,target,outcome)=>after.journal===null&&after.ordinaryStaging===null&&(outcome==='source'?same(after,before):Object.keys(target.slots).every(name=>after[name]===target.slots[name])&&after.rollback!==null);

for(const test of [
  {id:'quota-before-journal',operation:'setItem',step:'save-tool-journal-write',skip:0,outcome:'source'},
  {id:'quota-after-journal-before-rollback',operation:'setItem',step:'save-tool-target-rollback',skip:0,outcome:'source'},
  {id:'quota-during-checkpoint',operation:'removeItem',step:'save-tool-target-preV6',skip:0,outcome:'source'},
  {id:'quota-before-active',operation:'setItem',step:'save-tool-target-active',skip:0,outcome:'source'},
  {id:'quota-after-active',operation:'setItem',step:'save-tool-target-active',skip:1,outcome:'target'},
  {id:'quota-before-cleanup',operation:'removeItem',step:'save-tool-target-journal-clear',skip:0,outcome:'target'},
  {id:'quota-after-cleanup',operation:'removeItem',step:'save-tool-target-journal-clear',skip:1,outcome:'target'}
]){
  const run=fresh(),before=snap(run),target=p(run,'makeTarget(401)');
  fault(run,test);
  const result=invoke(run,{operation:'import',target,expectedSnapshot:before}),after=snap(run);
  add(`${test.id}-triggered`,run.fault.remaining===0,result);
  add(`${test.id}-exact-${test.outcome}`,!result.threw&&result.result.ok===false&&result.result.outcome===test.outcome&&exactEndpoint(after,before,target,test.outcome),{result,after:{journal:after.journal,rollback:Boolean(after.rollback),active:active(run).gold}});
  add(`${test.id}-native-storage-zero`,run.nativeCalls.length===0,run.nativeCalls);
}

for(const test of [
  {id:'journal-verification-read',step:'save-tool-journal-verify',outcome:'source'},
  {id:'rollback-verification-read',step:'save-tool-target-rollback-verify',outcome:'source'},
  {id:'active-verification-read',step:'save-tool-target-active-verify',outcome:'target'},
  {id:'installation-verification-read',step:'save-tool-target-verify-first-active',outcome:'target'},
  {id:'cleanup-verification-read',step:'save-tool-target-journal-clear-verify-first-active',outcome:'target'}
]){
  const run=fresh(),before=snap(run),target=p(run,'makeTarget(509)');
  fault(run,{operation:'getItem',step:test.step});
  const result=invoke(run,{operation:'import',target,expectedSnapshot:before}),after=snap(run);
  add(`${test.id}-triggered`,run.fault.remaining===0,result);
  add(`${test.id}-reconverges-${test.outcome}`,!result.threw&&result.result.outcome===test.outcome&&exactEndpoint(after,before,target,test.outcome),{result,after:{journal:after.journal,rollback:Boolean(after.rollback)}});
}

function physicalImage(snapshot){return Object.fromEntries(Object.entries(physical).filter(([name])=>name!=='journal'&&name!=='rollback').map(([name,key])=>[key,snapshot[name]]).filter(([,value])=>value!==null))}
function repeatedRecovery(direction){
  const seed=fresh(),source=snap(seed),target=p(seed,'resetTarget()'),fixture=p(seed,`fixture('reset',${JSON.stringify(target)})`),initial=physicalImage(source);
  initial[operational.journal]=fixture.journalRaw;
  initial[operational.rollback]=fixture.rollbackRaw;
  if(direction==='source')initial[physical.rawBackup]=target.slots.rawBackup;
  else{
    for(const [name,key] of Object.entries(physical))if(Object.hasOwn(target.slots,name)){const value=target.slots[name];if(value===null)delete initial[key];else initial[key]=value}
  }
  const operation=direction==='source'?'removeItem':'setItem',step=`save-tool-recover-${direction}-rawBackup`;
  const first=fresh({initialSlots:initial,fault:{enabled:true,operation,step,remaining:1,skip:0,adapterOnly:false,type:'throw',message:'QuotaExceededError: injected recovery direction failure'}}),firstImage=snap(first);
  add(`quota-recover-${direction}-first-reload-blocked`,first.fault.remaining===0&&firstImage.journal===fixture.journalRaw&&p(first,'runtime().blocked')!==null,p(first,'runtime().blocked'));
  const second=fresh({initialSlots:Object.fromEntries(first.slots)}),secondImage=snap(second),expected=direction==='source'?source:{...target.slots,ordinaryStaging:null,journal:null,rollback:fixture.rollbackRaw};
  const mismatches=Object.keys(expected).filter(name=>name!=='active'&&secondImage[name]!==expected[name]),activeEquivalent=withoutBootMetadata(secondImage.active)===withoutBootMetadata(expected.active);
  add(`quota-recover-${direction}-second-reload-converges`,secondImage.journal===null&&mismatches.length===0&&activeEquivalent&&p(second,'runtime().blocked')===null,{blocked:p(second,'runtime().blocked'),journal:secondImage.journal,mismatches,activeEquivalent,actualMeta:active(second).saveMeta,expectedMeta:JSON.parse(expected.active).saveMeta});
  const secondSlots=Object.fromEntries(second.slots),third=fresh({initialSlots:secondSlots}),thirdImage=snap(third);
  const stableSlots=Object.keys(secondImage).filter(name=>name!=='active').every(name=>secondImage[name]===thirdImage[name]),stableState=withoutBootMetadata(secondImage.active)===withoutBootMetadata(thirdImage.active),expectedRevision=active(third).saveMeta.revision===active(second).saveMeta.revision+1;
  add(`quota-recover-${direction}-third-reload-stable`,stableSlots&&stableState&&expectedRevision&&p(third,'runtime().blocked')===null&&third.nativeCalls.length===0,{blocked:p(third,'runtime().blocked'),journal:thirdImage.journal,stableSlots,stableState,expectedRevision,secondMeta:active(second).saveMeta,thirdMeta:active(third).saveMeta,differences:Object.keys(secondImage).filter(name=>secondImage[name]!==thirdImage[name])});
}
repeatedRecovery('source');
repeatedRecovery('target');

const legacyRaw=readFileSync(resolve(ROOT,'qa/fixtures/representative-v0.1.txt'),'utf8');
const migratedSeed=fresh({activeRaw:legacyRaw,now:1907953200000});
const recoveryTarget=p(migratedSeed,'makeTarget(911)');
const recoverySeed=fresh({now:1907953200000});
const recoverySource=snap(recoverySeed);
const recoveryFixture=p(recoverySeed,`fixture('import',${JSON.stringify(recoveryTarget)})`);
const sourceExpected={...recoverySource,journal:null,rollback:null};
const comparableActive=raw=>{try{return withoutBootMetadata(raw)}catch{return raw}};
const endpointMatches=(image,expected)=>Object.keys(expected).filter(name=>name!=='active').every(name=>image[name]===expected[name])&&comparableActive(image.active)===comparableActive(expected.active);
function setPhysical(image,name,value){const key=physical[name];if(value===null)delete image[key];else image[key]=value}
function recoveryFaultCase({id,initial,expected,operation,step,skip=0,expectedBlocked=false,target=recoveryTarget,journalRaw=recoveryFixture.journalRaw,rollbackRaw=recoveryFixture.rollbackRaw}){
  const first=fresh({initialSlots:initial,fault:{enabled:true,operation,step,remaining:1,skip,adapterOnly:false,type:'throw',message:'QuotaExceededError: injected recovery boundary failure'}}),firstImage=snap(first);
  add(`${id}-triggered`,first.fault.remaining===0,{blocked:p(first,'runtime().blocked'),journal:firstImage.journal===null?'null':'present'});
  const targetValue=name=>name==='ordinaryStaging'?null:target.slots[name],safeIntermediate=['active','rawBackup','preV2','preV3','preV4','preV5','preV6','preV7','preV8','preV9','preV10','preV11','ordinaryStaging'].every(name=>firstImage[name]===expected[name]||firstImage[name]===targetValue(name))&&[null,rollbackRaw].includes(firstImage.rollback)&&[null,journalRaw].includes(firstImage.journal);
  add(`${id}-first-reload-never-adopts-mixed`,p(first,'runtime().blocked')!==null&&safeIntermediate,{blocked:p(first,'runtime().blocked'),journal:firstImage.journal===null?'null':'present',safeIntermediate});
  const second=fresh({initialSlots:Object.fromEntries(first.slots)}),secondImage=snap(second),blocked=p(second,'runtime().blocked');
  add(`${id}-second-reload-exact-endpoint`,endpointMatches(secondImage,expected)&&(expectedBlocked?blocked!==null:blocked===null)&&second.nativeCalls.length===0,{blocked,journal:secondImage.journal,matches:endpointMatches(secondImage,expected)});
}
function validatedSourceInitial(name=null){const initial=physicalImage(recoverySource);initial[operational.journal]=recoveryFixture.journalRaw;initial[operational.rollback]=recoveryFixture.rollbackRaw;setPhysical(initial,'rawBackup',recoveryTarget.slots.rawBackup);if(name&&Object.hasOwn(recoveryTarget.slots,name))setPhysical(initial,name,recoveryTarget.slots[name]);setPhysical(initial,'active',recoverySource.active);return initial}
const recoveryCheckpointNames=['rawBackup','preV2','preV3','preV4','preV5','preV6','preV7','preV8','preV9','preV10','preV11'];
for(const name of recoveryCheckpointNames){
  const intended=recoverySource[name],operation=intended===null?'removeItem':'setItem',step=`save-tool-recover-source-${name}`;
  recoveryFaultCase({id:`recover-source-${name}-owner`,initial:validatedSourceInitial(name),expected:sourceExpected,operation,step,skip:0});
  recoveryFaultCase({id:`recover-source-${name}-after-write`,initial:validatedSourceInitial(name),expected:sourceExpected,operation,step,skip:1});
}
for(const entry of [
  {id:'active-owner',operation:'setItem',step:'save-tool-recover-source-active',skip:0},
  {id:'rollback-owner',operation:'removeItem',step:'save-tool-recover-source-rollback',skip:0},
  {id:'rollback-after-write',operation:'removeItem',step:'save-tool-recover-source-rollback',skip:1},
  {id:'journal-clear-owner',operation:'removeItem',step:'save-tool-recover-source-journal-clear',skip:0},
  {id:'journal-clear-after-write',operation:'removeItem',step:'save-tool-recover-source-journal-clear',skip:1},
  {id:'installation-verification-read',operation:'getItem',step:'save-tool-recover-source-verify-first-active',skip:0},
  {id:'rollback-final-verification-read',operation:'getItem',step:'save-tool-recover-source-rollback-final-first-active',skip:0},
  {id:'journal-clear-verification-read',operation:'getItem',step:'save-tool-recover-source-journal-clear-verify-first-active',skip:0}
])recoveryFaultCase({id:`recover-source-${entry.id}`,initial:validatedSourceInitial(),expected:sourceExpected,...entry});

const forensicSeed=fresh({initialSlots:{[physical.active]:'phase-11b2c-forensic-active',[physical.ordinaryStaging]:'phase-11b2c-forensic-staging'},now:1907953200000}),forensicSource=snap(forensicSeed),forensicFixture=p(forensicSeed,`fixture('import',${JSON.stringify(recoveryTarget)},true)`),forensicInitial=physicalImage(forensicSource);forensicInitial[operational.journal]=forensicFixture.journalRaw;forensicInitial[operational.rollback]=forensicFixture.rollbackRaw;delete forensicInitial[physical.ordinaryStaging];setPhysical(forensicInitial,'rawBackup',recoveryTarget.slots.rawBackup);const forensicExpected={...forensicSource,journal:null,rollback:null};
recoveryFaultCase({id:'recover-source-forensic-staging-owner',initial:{...forensicInitial},expected:forensicExpected,operation:'setItem',step:'save-tool-recover-source-ordinary-staging',skip:0,expectedBlocked:true,journalRaw:forensicFixture.journalRaw,rollbackRaw:forensicFixture.rollbackRaw});
recoveryFaultCase({id:'recover-source-forensic-staging-after-write',initial:{...forensicInitial},expected:forensicExpected,operation:'setItem',step:'save-tool-recover-source-ordinary-staging',skip:1,expectedBlocked:true,journalRaw:forensicFixture.journalRaw,rollbackRaw:forensicFixture.rollbackRaw});

const passed=rows.filter(row=>row.pass).length;
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` · ${row.detail}`:''}`);
console.log(`Phase 11B-2c final recovery probe: ${passed}/${rows.length}`);
if(passed!==rows.length)process.exitCode=1;
