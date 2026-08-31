import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname);
const helperFile=readFileSync(resolve(ROOT,'qa/phase-10c2/engine-probe.mjs'),'utf8');
const helperBoundary=helperFile.indexOf('export async function runEngineProbe');
if(helperBoundary<0)throw new Error('Phase 10C-2 helper boundary missing');
const helperSource=helperFile.slice(0,helperBoundary)
  .replace("import {simulateBundle} from '../phase-10b/simulate.mjs';\n",'')
  .replace("const ROOT=resolve(new URL('../..',import.meta.url).pathname);",`const ROOT=${JSON.stringify(ROOT)};`)
  +'\nexport {phaseNineHarness,toolsFor,engineHarness,T0,replaceOnce};\n';
const helpers=await import('data:text/javascript;base64,'+Buffer.from(helperSource).toString('base64'));
const phaseNine=await helpers.phaseNineHarness();
const baseHarness=helpers.engineHarness(phaseNine);
const harness=helpers.replaceOnce(baseHarness,'    tamperClear(){',`    p11c:Object.freeze({
      state:()=>clone(S),
      valid:()=>validation(S,11),
      runtime:()=>qaRuntimeSnapshot(),
      constants:()=>({counts:[...PHASE_ELEVEN_C_REPEAT_COUNTS],max:PHASE_ELEVEN_C_REPEAT_MAX,reserve:PHASE_ELEVEN_C_GOLD_RESERVE,limitMs:PHASE_ELEVEN_C_JOB_LIMIT_MS,delayMs:PHASE_ELEVEN_C_RUN_DELAY_MS}),
      ready:(at=runtimeNow())=>clone(phaseElevenCReadyPreview(at,S)),
      repeat:(mode,id,allowActive=false)=>clone(phaseElevenCRepeatPreview(mode,id,S,{allowActive})),
      start:(mode,id,count)=>phaseElevenCStartRepeat(mode,id,count),
      stop:(reason)=>phaseElevenCRequestStop(reason),
      job:()=>PHASE_ELEVEN_C_JOB?clone(PHASE_ELEVEN_C_JOB):null,
      timer:()=>PHASE_ELEVEN_C_TIMER,
      claim:()=>clone(phaseElevenCClaimReady()),
      claimWithTowerFailure(){const original=claimCompanionTower;claimCompanionTower=()=>false;try{return clone(phaseElevenCClaimReady())}finally{claimCompanionTower=original}},
      readyWithTowerTerminal(at=runtimeNow()){const original=phaseElevenCTowerReady;phaseElevenCTowerReady=()=>({id:'tower',name:'Tower',access:true,ready:false,blocked:true,terminal:true,intervals:0,remainingMs:null,reason:'Injected Tower preview failure'});try{return clone(phaseElevenCReadyPreview(at,S))}finally{phaseElevenCTowerReady=original}},
      claimWithTowerTerminal(){const original=phaseElevenCTowerReady;phaseElevenCTowerReady=()=>({id:'tower',name:'Tower',access:true,ready:false,blocked:true,terminal:true,intervals:0,remainingMs:null,reason:'Injected Tower preview failure'});try{return clone(phaseElevenCClaimReady())}finally{phaseElevenCTowerReady=original}},
      repeatWithHistoryFull(mode,id){const original=phaseEightLiveUsage;phaseEightLiveUsage=state=>{const usage=original(state);return{...usage,used:usage.ceiling,remaining:0}};try{return clone(phaseElevenCRepeatPreview(mode,id,S))}finally{phaseEightLiveUsage=original}},
      repeatWithWeakCompanions(mode,id){const draft=clone(S);for(const def of COMPANION_DEFS){draft.companions[def.id].exp=0;draft.companions[def.id].level=1}return clone(phaseElevenCRepeatPreview(mode,id,draft))},
      stale(value){PERSISTENCE_STALE=Boolean(value);return PERSISTENCE_STALE},
      blocked(value){PERSISTENCE_BLOCKED=value?{kind:'qa-blocked',message:'Injected QA persistence block',rawActive:PERSISTED_RAW,recovery:null}:null;return Boolean(PERSISTENCE_BLOCKED)},
      setGold(value){return clone(mutatePersisted(()=>{S.gold=value},'qa-grant'))},
      modal:()=>document.querySelector('#overlay')?.innerHTML??'',
      adventure:()=>adventureScreen(),
      bottom:()=>bottomNav(),
      cancelForReload(){if(PHASE_ELEVEN_C_TIMER!==null)runtimeClearTimeout(PHASE_ELEVEN_C_TIMER);PHASE_ELEVEN_C_TIMER=null;PHASE_ELEVEN_C_JOB=null;PHASE_ELEVEN_C_TOKEN++}
    }),
    tamperClear(){`,'Phase 11C facade');
const tools=await helpers.toolsFor(harness);
const html=readFileSync(resolve(ROOT,'index.html'),'utf8');
const application=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if(!application)throw new Error('Everstead application script missing');
const source=tools.instrument(application),T0=helpers.T0;
const rows=[];
const add=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const active=run=>tools.active(run);
const p9=(run,expression)=>tools.internal(run,'p9.'+expression);
const p11=(run,expression)=>tools.internal(run,'p11c.'+expression);
const trackedRuns=[],fresh=(options={})=>{const run=tools.runRealm(options.initialSlots?{applicationSource:source,now:T0,deferTimers:true,...options}:{...tools.freshOptions,applicationSource:source,now:T0,deferTimers:true,...options});trackedRuns.push(run);return run};
const stateImage=run=>JSON.stringify(active(run));
const writeCount=run=>tools.writes(run);

function fireRepeatTimer(run){
  const id=p11(run,'timer()');
  if(id===null)return false;
  const callback=run.timers.get(id);
  if(typeof callback!=='function')throw new Error(`Repeat timer ${id} is missing`);
  run.timers.delete(id);
  callback();
  return true;
}

function drainRepeat(run,limit=12){
  let fired=0;
  while(p11(run,'job()')&&fired<limit){if(!fireRepeatTimer(run))break;fired++}
  return fired;
}

function grantGold(run,amount=5_000_000){
  const result=p9(run,`grant('gold',${amount})`);
  if(!result?.ok)throw new Error('Gold fixture grant failed');
}

function prepareFellowReplay(run){
  grantGold(run);
  if(!p9(run,"named('navigate',{view:'adventure'})").ok)throw new Error('Adventure navigation failed');
  for(const stage of [1,2])if(!p9(run,`run('broken-roads-${stage}',{confirmed:true,present:false})`).ok)throw new Error(`Fellow stage ${stage} setup failed`);
  if(!p9(run,"named('campaign-select',{id:'broken-roads-1'})").ok)throw new Error('Fellow replay selection failed');
  return run;
}

function prepareCompanionReplay(run){
  prepareFellowReplay(run);
  if(!p9(run,"named('adventure',{tab:'companionCampaign'})").ok)throw new Error('Companion route setup failed');
  if(!p9(run,"named('companion-campaign-run',{id:'companion-trail-1'})").ok)throw new Error('Companion first clear failed');
  if(!p9(run,"named('companion-campaign-select',{id:'companion-trail-1'})").ok)throw new Error('Companion replay selection failed');
  return run;
}

function prepareAllClaims(run){
  grantGold(run);
  for(const id of ['cael','lyra','orin','selene','rook','mira'])if(!p9(run,`grant('fellowExp',1000000,'${id}')`).ok)throw new Error(`Fellow EXP setup failed for ${id}`);
  if(!p9(run,"named('navigate',{view:'adventure'})").ok)throw new Error('Claim fixture navigation failed');
  for(let stage=1;stage<=6;stage++)if(!p9(run,`run('broken-roads-${stage}',{confirmed:true,present:false})`).ok)throw new Error(`Claim fixture stage ${stage} failed`);
  if(!p9(run,"named('companion-tower-clear',{})").ok)throw new Error('Tower seed failed');
  if(!p9(run,"named('fellow-expedition-push',{})").ok)throw new Error('Expedition seed failed');
  return run;
}

const constantsRun=fresh(),constants=p11(constantsRun,'constants()');
add('static-contract-markers',application.includes('Phase 11C · bounded Campaign repeat')&&application.includes('Village → Tower → Expedition')&&application.includes('STOP BEFORE NEXT RUN'));
add('fixed-repeat-options',same(constants.counts,[1,3,5])&&constants.max===5&&constants.reserve===30000&&constants.limitMs===60000&&constants.delayMs===650,constants);
const phaseElevenCSource=application.slice(application.indexOf('/* Phase 11C ·'),application.lastIndexOf('const report=load();render();'));
add('legacy-auto-mode-not-repurposed',!phaseElevenCSource.includes('autoMode'));
add('numeric-data-bindings-use-exact-attributes',phaseElevenCSource.includes("button.getAttribute('data-phase-11c-repeat-mode')")&&phaseElevenCSource.includes("button.getAttribute('data-phase-11c-repeat-count')")&&!phaseElevenCSource.includes('button.dataset.phase11c'));
add('claim-focus-has-enabled-fallback',phaseElevenCSource.includes('data-phase-11c-claim-heading tabindex="-1"')&&phaseElevenCSource.includes("attribute:'data-phase-11c-claim-heading'"));
add('fresh-valid',constantsRun.thrown===null&&p11(constantsRun,'valid().ok')===true&&p11(constantsRun,'runtime().blocked')===null,constantsRun.thrown?.stack||p11(constantsRun,'valid().errors'));
add('fresh-no-native-storage',constantsRun.nativeCalls.length===0,constantsRun.nativeCalls);
const bootState=stateImage(constantsRun),bootWrites=writeCount(constantsRun);p11(constantsRun,`ready(${T0})`);p11(constantsRun,'adventure()');p11(constantsRun,'bottom()');add('boot-and-render-never-claim-or-schedule',stateImage(constantsRun)===bootState&&writeCount(constantsRun)===bootWrites&&p11(constantsRun,'timer()')===null&&p11(constantsRun,'job()')===null&&active(constantsRun).familyDrops.claimSequence===0&&active(constantsRun).companionTower.idle.claimOrdinal===0&&active(constantsRun).fellowExpedition.idle.claimOrdinal===0);

for(const count of [1,3,5]){
  const automated=prepareFellowReplay(fresh()),manual=prepareFellowReplay(fresh());
  const before=active(automated),started=p11(automated,`start('fellowCampaign','broken-roads-1',${count})`),fired=drainRepeat(automated);
  for(let index=0;index<count;index++)p9(manual,"run('broken-roads-1',{confirmed:true,present:false})");
  const after=active(automated),modal=p11(automated,'modal()');
  add(`fellow-repeat-${count}-starts`,started===true);
  add(`fellow-repeat-${count}-exact-manual-equivalence`,same(after,active(manual)),{fired,automated:{gold:after.gold,revision:after.saveMeta.revision,ordinal:after.fellowCampaign.runOrdinal},manual:{gold:active(manual).gold,revision:active(manual).saveMeta.revision,ordinal:active(manual).fellowCampaign.runOrdinal}});
  add(`fellow-repeat-${count}-bounded-summary`,p11(automated,'job()')===null&&fired===count&&modal.includes(`${count} / ${count}`)&&modal.includes('Requested runs completed.'),modal.slice(-900));
  add(`fellow-repeat-${count}-valid`,p11(automated,'valid().ok')===true,p11(automated,'valid().errors'));
  add(`fellow-repeat-${count}-one-save-per-run`,after.saveMeta.revision===before.saveMeta.revision+count&&after.fellowCampaign.runOrdinal===before.fellowCampaign.runOrdinal+count);
}

for(const count of [1,3,5]){
  const automated=prepareCompanionReplay(fresh()),manual=prepareCompanionReplay(fresh());
  const before=active(automated),started=p11(automated,`start('companionCampaign','companion-trail-1',${count})`),fired=drainRepeat(automated);
  for(let index=0;index<count;index++)p9(manual,"named('companion-campaign-run',{id:'companion-trail-1'})");
  const after=active(automated),modal=p11(automated,'modal()');
  add(`companion-repeat-${count}-starts`,started===true);
  add(`companion-repeat-${count}-exact-manual-equivalence`,same(after,active(manual)),{fired,automated:{gold:after.gold,revision:after.saveMeta.revision,ordinal:after.companionCampaign.runOrdinal},manual:{gold:active(manual).gold,revision:active(manual).saveMeta.revision,ordinal:active(manual).companionCampaign.runOrdinal}});
  add(`companion-repeat-${count}-bounded-summary`,p11(automated,'job()')===null&&fired===count&&modal.includes(`${count} / ${count}`),modal.slice(-800));
  add(`companion-repeat-${count}-one-save-per-run`,after.saveMeta.revision===before.saveMeta.revision+count&&after.companionCampaign.runOrdinal===before.companionCampaign.runOrdinal+count);
}

const firstClear=fresh(),firstClearRaw=stateImage(firstClear),firstClearWrites=writeCount(firstClear),firstClearPreview=p11(firstClear,"repeat('fellowCampaign','broken-roads-1')"),firstClearStart=p11(firstClear,"start('fellowCampaign','broken-roads-1',1)");
add('first-clear-repeat-refused-zero-write',firstClearPreview.canStart===false&&firstClearPreview.reason.includes('manually')&&firstClearStart===false&&stateImage(firstClear)===firstClearRaw&&writeCount(firstClear)===firstClearWrites,firstClearPreview);
for(const count of [0,2,4,6]){const run=prepareFellowReplay(fresh()),before=stateImage(run),writes=writeCount(run),result=p11(run,`start('fellowCampaign','broken-roads-1',${count})`);add(`unsupported-count-${count}-zero-write`,result===false&&stateImage(run)===before&&writeCount(run)===writes)}

const reserve=prepareFellowReplay(fresh()),reserveCost=p11(reserve,"repeat('fellowCampaign','broken-roads-1').cost");
const reserveSet=p11(reserve,`setGold(${30000+reserveCost})`);const reserveBefore=active(reserve),reserveStart=p11(reserve,"start('fellowCampaign','broken-roads-1',5)"),reserveFired=drainRepeat(reserve),reserveAfter=active(reserve),reserveModal=p11(reserve,'modal()');
add('reserve-exactly-one-run',reserveSet.ok===true&&reserveStart===true&&reserveFired===2&&reserveAfter.gold===30000&&reserveAfter.fellowCampaign.runOrdinal===reserveBefore.fellowCampaign.runOrdinal+1&&reserveModal.includes('Keep 30.0K Gold'),{reserveSet,reserveCost,reserveFired,gold:reserveAfter.gold,blocked:p11(reserve,'runtime().blocked'),modal:reserveModal.slice(-500)});
add('reserve-run-valid',p11(reserve,'valid().ok')===true,p11(reserve,'valid().errors'));
const belowReserve=prepareFellowReplay(fresh()),belowCost=p11(belowReserve,"repeat('fellowCampaign','broken-roads-1').cost"),belowSet=p11(belowReserve,`setGold(${29999+belowCost})`);const belowRaw=stateImage(belowReserve),belowWrites=writeCount(belowReserve),belowPreview=p11(belowReserve,"repeat('fellowCampaign','broken-roads-1')"),belowStart=p11(belowReserve,"start('fellowCampaign','broken-roads-1',1)");add('reserve-preflight-zero-write-refusal',belowSet.ok===true&&!belowPreview.canStart&&belowPreview.reason.includes('30.0K')&&belowStart===false&&stateImage(belowReserve)===belowRaw&&writeCount(belowReserve)===belowWrites,{belowSet,belowPreview,blocked:p11(belowReserve,'runtime().blocked')});
const noGold=prepareFellowReplay(fresh()),noGoldCost=p11(noGold,"repeat('fellowCampaign','broken-roads-1').cost");p11(noGold,`setGold(${noGoldCost-1})`);const noGoldRaw=stateImage(noGold),noGoldWrites=writeCount(noGold),noGoldPreview=p11(noGold,"repeat('fellowCampaign','broken-roads-1')");add('insufficient-gold-zero-write-refusal',!noGoldPreview.canStart&&noGoldPreview.reason.includes('Need')&&p11(noGold,"start('fellowCampaign','broken-roads-1',1)")===false&&stateImage(noGold)===noGoldRaw&&writeCount(noGold)===noGoldWrites,noGoldPreview);
const historyFull=prepareFellowReplay(fresh()),historyRaw=stateImage(historyFull),historyWrites=writeCount(historyFull),historyPreview=p11(historyFull,"repeatWithHistoryFull('fellowCampaign','broken-roads-1')");add('history-cap-zero-write-refusal',!historyPreview.canStart&&historyPreview.reason.includes('history is full')&&stateImage(historyFull)===historyRaw&&writeCount(historyFull)===historyWrites,historyPreview);
const stale=prepareFellowReplay(fresh()),staleRaw=stateImage(stale),staleWrites=writeCount(stale);p11(stale,'stale(true)');const staleStart=p11(stale,"start('fellowCampaign','broken-roads-1',1)");p11(stale,'stale(false)');add('stale-preflight-zero-write-refusal',staleStart===false&&stateImage(stale)===staleRaw&&writeCount(stale)===staleWrites);
const blocked=prepareFellowReplay(fresh()),blockedRaw=stateImage(blocked),blockedWrites=writeCount(blocked);p11(blocked,'blocked(true)');const blockedStart=p11(blocked,"start('fellowCampaign','broken-roads-1',1)");p11(blocked,'blocked(false)');add('blocked-preflight-zero-write-refusal',blockedStart===false&&stateImage(blocked)===blockedRaw&&writeCount(blocked)===blockedWrites);

const weak=prepareCompanionReplay(fresh());for(const id of ['bramble','cinderwing'])p9(weak,`grant('companionExp',1000000,'${id}')`);p9(weak,"named('companion-campaign-run',{id:'companion-trail-2'})");p9(weak,"named('companion-campaign-select',{id:'companion-trail-2'})");const weakRaw=stateImage(weak),weakWrites=writeCount(weak),weakPreview=p11(weak,"repeatWithWeakCompanions('companionCampaign','companion-trail-2')");add('insufficient-power-pure-preflight',!weakPreview.canStart&&weakPreview.reason.includes('Power')&&stateImage(weak)===weakRaw&&writeCount(weak)===weakWrites,weakPreview);

const stopped=prepareFellowReplay(fresh()),stoppedBefore=active(stopped);p11(stopped,"start('fellowCampaign','broken-roads-1',5)");fireRepeatTimer(stopped);const stopResult=p11(stopped,"stop('Stopped by QA after one run.')"),stoppedAfter=active(stopped),stoppedModal=p11(stopped,'modal()');
add('player-stop-after-one',stopResult===true&&p11(stopped,'job()')===null&&stoppedAfter.fellowCampaign.runOrdinal===stoppedBefore.fellowCampaign.runOrdinal+1&&stoppedModal.includes('1 / 5')&&stoppedModal.includes('Stopped by QA after one run.'),stoppedModal.slice(-700));
const reloadSource=prepareFellowReplay(fresh()),reloadBefore=active(reloadSource),reloadRawBefore=reloadSource.slots.get(tools.keys.active);p11(reloadSource,"start('fellowCampaign','broken-roads-1',5)");const reloadStartRaw=reloadSource.slots.get(tools.keys.active);p11(reloadSource,'cancelForReload()');const reloadCancelRaw=reloadSource.slots.get(tools.keys.active),reloaded=fresh({initialSlots:Object.fromEntries(reloadSource.slots)});add('reload-does-not-resume-job',reloadStartRaw===reloadRawBefore&&reloadCancelRaw===reloadRawBefore&&!reloadRawBefore.includes('phaseElevenC')&&p11(reloaded,'job()')===null&&active(reloaded)?.fellowCampaign.runOrdinal===reloadBefore.fellowCampaign.runOrdinal&&!p11(reloaded,'modal()').includes('Repeat in progress'),{thrown:reloaded.thrown?.message,blocked:p11(reloaded,'runtime().blocked'),startRawSame:reloadStartRaw===reloadRawBefore,cancelRawSame:reloadCancelRaw===reloadRawBefore,ordinal:active(reloaded)?.fellowCampaign.runOrdinal});
const reloadAfterOne=prepareFellowReplay(fresh()),reloadAfterOneBefore=active(reloadAfterOne);p11(reloadAfterOne,"start('fellowCampaign','broken-roads-1',5)");fireRepeatTimer(reloadAfterOne);const reloadAfterOneCommitted=active(reloadAfterOne),reloadAfterOneRaw=reloadAfterOne.slots.get(tools.keys.active);p11(reloadAfterOne,'cancelForReload()');const reloadedAfterOne=fresh({initialSlots:Object.fromEntries(reloadAfterOne.slots)}),reloadAfterOneState=active(reloadedAfterOne);add('reload-after-one-keeps-one-no-resume',reloadAfterOneCommitted.fellowCampaign.runOrdinal===reloadAfterOneBefore.fellowCampaign.runOrdinal+1&&reloadAfterOne.slots.get(tools.keys.active)===reloadAfterOneRaw&&reloadAfterOneState.fellowCampaign.runOrdinal===reloadAfterOneCommitted.fellowCampaign.runOrdinal&&same(reloadAfterOneState.fellowCampaign.lastReceipt,reloadAfterOneCommitted.fellowCampaign.lastReceipt)&&p11(reloadedAfterOne,'job()')===null&&!p11(reloadedAfterOne,'modal()').includes('Repeat in progress'),{before:reloadAfterOneBefore.fellowCampaign.runOrdinal,committed:reloadAfterOneCommitted.fellowCampaign.runOrdinal,reloaded:reloadAfterOneState.fellowCampaign.runOrdinal,rawSame:reloadAfterOne.slots.get(tools.keys.active)===reloadAfterOneRaw,revisionCommitted:reloadAfterOneCommitted.saveMeta.revision,revisionReloaded:reloadAfterOneState.saveMeta.revision,job:p11(reloadedAfterOne,'job()'),modal:p11(reloadedAfterOne,'modal()').slice(-200)});
const staleMid=prepareFellowReplay(fresh()),staleMidBefore=active(staleMid);p11(staleMid,"start('fellowCampaign','broken-roads-1',5)");fireRepeatTimer(staleMid);const staleMidOne=active(staleMid),staleMidRaw=staleMid.slots.get(tools.keys.active);p11(staleMid,'stale(true)');fireRepeatTimer(staleMid);p11(staleMid,'stale(false)');add('mid-job-stale-stops-before-next-run',staleMidOne.fellowCampaign.runOrdinal===staleMidBefore.fellowCampaign.runOrdinal+1&&active(staleMid).fellowCampaign.runOrdinal===staleMidOne.fellowCampaign.runOrdinal&&staleMid.slots.get(tools.keys.active)===staleMidRaw&&p11(staleMid,'job()')===null&&p11(staleMid,'modal()').includes('Another tab changed Everstead'));
const blockedMid=prepareFellowReplay(fresh()),blockedMidBefore=active(blockedMid);p11(blockedMid,"start('fellowCampaign','broken-roads-1',5)");fireRepeatTimer(blockedMid);const blockedMidOne=active(blockedMid),blockedMidRaw=blockedMid.slots.get(tools.keys.active);p11(blockedMid,'blocked(true)');fireRepeatTimer(blockedMid);p11(blockedMid,'blocked(false)');add('mid-job-persistence-block-stops-before-next-run',blockedMidOne.fellowCampaign.runOrdinal===blockedMidBefore.fellowCampaign.runOrdinal+1&&active(blockedMid).fellowCampaign.runOrdinal===blockedMidOne.fellowCampaign.runOrdinal&&blockedMid.slots.get(tools.keys.active)===blockedMidRaw&&p11(blockedMid,'job()')===null&&p11(blockedMid,'modal()').includes('Save &amp; Recovery needs attention'),{before:blockedMidBefore.fellowCampaign.runOrdinal,one:blockedMidOne.fellowCampaign.runOrdinal,after:active(blockedMid).fellowCampaign.runOrdinal,rawSame:blockedMid.slots.get(tools.keys.active)===blockedMidRaw,job:p11(blockedMid,'job()'),modal:p11(blockedMid,'modal()').slice(-400)});
const driftMid=prepareFellowReplay(fresh()),driftMidBefore=active(driftMid);p11(driftMid,"start('fellowCampaign','broken-roads-1',5)");fireRepeatTimer(driftMid);const driftMidOne=active(driftMid);p11(driftMid,`setGold(${driftMidOne.gold+1})`);const driftAfterExternal=active(driftMid);fireRepeatTimer(driftMid);add('mid-job-revision-drift-stops-before-next-run',driftMidOne.fellowCampaign.runOrdinal===driftMidBefore.fellowCampaign.runOrdinal+1&&active(driftMid).fellowCampaign.runOrdinal===driftMidOne.fellowCampaign.runOrdinal&&active(driftMid).saveMeta.revision===driftAfterExternal.saveMeta.revision&&p11(driftMid,'job()')===null&&p11(driftMid,'modal()').includes('save changed outside'));
const faultMid=prepareFellowReplay(fresh()),faultMidBefore=active(faultMid);p11(faultMid,"start('fellowCampaign','broken-roads-1',5)");fireRepeatTimer(faultMid);const faultMidOne=active(faultMid);Object.assign(faultMid.fault,{enabled:true,operation:'setItem',key:null,step:'staging-write',remaining:1,skip:0,adapterOnly:false});fireRepeatTimer(faultMid);const faultMidAfter=active(faultMid),faultReload=fresh({initialSlots:Object.fromEntries(faultMid.slots)});add('mid-job-write-fault-stops-and-reloads-one-run',faultMid.fault.remaining===0&&faultMidOne.fellowCampaign.runOrdinal===faultMidBefore.fellowCampaign.runOrdinal+1&&faultMidAfter.fellowCampaign.runOrdinal===faultMidOne.fellowCampaign.runOrdinal&&p11(faultMid,'job()')===null&&p11(faultMid,'runtime().blocked')!==null&&active(faultReload).fellowCampaign.runOrdinal===faultMidOne.fellowCampaign.runOrdinal&&p11(faultReload,'runtime().blocked')===null,{fault:faultMid.fault,blocked:p11(faultMid,'runtime().blocked'),after:faultMidAfter.fellowCampaign.runOrdinal,reloaded:active(faultReload).fellowCampaign.runOrdinal});

const noClaim=fresh(),noClaimRaw=stateImage(noClaim),noClaimWrites=writeCount(noClaim),noClaimResult=p11(noClaim,'claim()');
add('claim-ready-zero-is-zero-write',noClaimResult===false&&stateImage(noClaim)===noClaimRaw&&writeCount(noClaim)===noClaimWrites,{noClaimResult});

for(const hours of [1,3,24]){
  const run=prepareAllClaims(fresh()),manual=prepareAllClaims(fresh()),before=active(run);run.clock.value+=hours*3600000;manual.clock.value+=hours*3600000;const preview=p11(run,`ready(${run.clock.value})`),result=p11(run,'claim()');p9(manual,"named('collect',{})");p9(manual,"named('companion-tower-claim',{})");p9(manual,"named('fellow-expedition-claim',{})");const after=active(run),afterPreview=p11(run,`ready(${run.clock.value})`);
  add(`claim-${hours}h-all-three-ready`,preview.readyLanes.length===3&&preview.tower.intervals===hours&&preview.expedition.intervals===hours,preview);
  add(`claim-${hours}h-fixed-order`,same(result.claimed.map(item=>item.id),['village','tower','expedition'])&&result.stopReason===null,result);
  add(`claim-${hours}h-three-independent-saves`,after.saveMeta.revision===before.saveMeta.revision+3&&after.familyDrops.claimSequence===before.familyDrops.claimSequence+1&&after.companionTower.idle.claimOrdinal===before.companionTower.idle.claimOrdinal+1&&after.fellowExpedition.idle.claimOrdinal===before.fellowExpedition.idle.claimOrdinal+1,{before:before.saveMeta.revision,after:after.saveMeta.revision});
  add(`claim-${hours}h-exact-manual-equivalence`,same(after,active(manual)),{combined:{revision:after.saveMeta.revision,village:after.familyDrops.claimSequence,tower:after.companionTower.idle.claimOrdinal,expedition:after.fellowExpedition.idle.claimOrdinal},manual:{revision:active(manual).saveMeta.revision,village:active(manual).familyDrops.claimSequence,tower:active(manual).companionTower.idle.claimOrdinal,expedition:active(manual).fellowExpedition.idle.claimOrdinal}});
  add(`claim-${hours}h-consumed-once`,afterPreview.readyLanes.length===0&&p11(run,'valid().ok')===true,{afterPreview,errors:p11(run,'valid().errors')});
}
const capped=prepareAllClaims(fresh());capped.clock.value+=30*3600000;const cappedPreview=p11(capped,`ready(${capped.clock.value})`);add('claim-ready-24h-cap',cappedPreview.tower.intervals===24&&cappedPreview.expedition.intervals===24,cappedPreview);
const staleClaim=prepareAllClaims(fresh());staleClaim.clock.value+=3600000;const staleClaimRaw=stateImage(staleClaim),staleClaimWrites=writeCount(staleClaim);p11(staleClaim,'stale(true)');const staleClaimResult=p11(staleClaim,'claim()');p11(staleClaim,'stale(false)');add('claim-stale-preflight-zero-write-refusal',staleClaimResult===false&&stateImage(staleClaim)===staleClaimRaw&&writeCount(staleClaim)===staleClaimWrites);
const blockedClaim=prepareAllClaims(fresh());blockedClaim.clock.value+=3600000;const blockedClaimRaw=stateImage(blockedClaim),blockedClaimWrites=writeCount(blockedClaim);p11(blockedClaim,'blocked(true)');const blockedClaimResult=p11(blockedClaim,'claim()');p11(blockedClaim,'blocked(false)');add('claim-blocked-preflight-zero-write-refusal',blockedClaimResult===false&&stateImage(blockedClaim)===blockedClaimRaw&&writeCount(blockedClaim)===blockedClaimWrites);
const faultClaim=prepareAllClaims(fresh());faultClaim.clock.value+=3600000;const faultClaimBefore=active(faultClaim),faultClaimRaw=faultClaim.slots.get(tools.keys.active);Object.assign(faultClaim.fault,{enabled:true,operation:'setItem',key:null,step:'staging-write',remaining:1,skip:0,adapterOnly:false});const faultClaimResult=p11(faultClaim,'claim()'),faultClaimAfter=active(faultClaim),faultClaimReload=fresh({initialSlots:Object.fromEntries(faultClaim.slots)});add('claim-write-fault-zero-claim-and-safe-reload',faultClaim.fault.remaining===0&&faultClaimResult.claimed.length===0&&faultClaimResult.stopReason?.includes('Village claim result')&&faultClaim.slots.get(tools.keys.active)===faultClaimRaw&&faultClaimAfter.familyDrops.claimSequence===faultClaimBefore.familyDrops.claimSequence&&faultClaimAfter.companionTower.idle.claimOrdinal===faultClaimBefore.companionTower.idle.claimOrdinal&&faultClaimAfter.fellowExpedition.idle.claimOrdinal===faultClaimBefore.fellowExpedition.idle.claimOrdinal&&active(faultClaimReload).familyDrops.claimSequence===faultClaimBefore.familyDrops.claimSequence&&p11(faultClaimReload,'runtime().blocked')===null,{fault:faultClaim.fault,result:faultClaimResult,blocked:p11(faultClaim,'runtime().blocked')});

const partial=prepareAllClaims(fresh()),partialBefore=active(partial);partial.clock.value+=2*3600000;const partialResult=p11(partial,'claimWithTowerFailure()'),partialAfter=active(partial);
add('claim-partial-success-stops-later-lanes',partialResult.claimed.length===1&&partialResult.claimed[0].id==='village'&&partialResult.stopReason?.includes('Tower claim result')&&partialResult.skipped.some(item=>item.id==='expedition'&&item.reason.includes('Not attempted'))&&partialAfter.familyDrops.claimSequence===partialBefore.familyDrops.claimSequence+1&&partialAfter.companionTower.idle.claimOrdinal===partialBefore.companionTower.idle.claimOrdinal&&partialAfter.fellowExpedition.idle.claimOrdinal===partialBefore.fellowExpedition.idle.claimOrdinal,partialResult);
add('claim-partial-success-remains-valid',p11(partial,'valid().ok')===true,p11(partial,'valid().errors'));

const terminalVillage=prepareAllClaims(fresh());p11(terminalVillage,`setGold(${Number.MAX_SAFE_INTEGER})`);terminalVillage.clock.value+=3600000;const terminalVillageRaw=stateImage(terminalVillage),terminalVillageWrites=writeCount(terminalVillage),terminalVillagePreview=p11(terminalVillage,`ready(${terminalVillage.clock.value})`),terminalVillageResult=p11(terminalVillage,'claim()');add('terminal-village-blocks-later-ready-lanes',terminalVillagePreview.village.terminal===true&&terminalVillagePreview.readyLanes.length===2&&terminalVillagePreview.claimableLanes.length===0&&terminalVillageResult===false&&stateImage(terminalVillage)===terminalVillageRaw&&writeCount(terminalVillage)===terminalVillageWrites,terminalVillagePreview);
const terminalTower=prepareAllClaims(fresh());terminalTower.clock.value+=3600000;const terminalTowerRaw=stateImage(terminalTower),terminalTowerWrites=writeCount(terminalTower),terminalTowerPreview=p11(terminalTower,`readyWithTowerTerminal(${terminalTower.clock.value})`),terminalTowerResult=p11(terminalTower,'claimWithTowerTerminal()');add('terminal-tower-blocks-all-combined-claims',terminalTowerPreview.village.ready&&terminalTowerPreview.tower.terminal&&terminalTowerPreview.expedition.ready&&terminalTowerPreview.claimableLanes.length===0&&terminalTowerResult===false&&stateImage(terminalTower)===terminalTowerRaw&&writeCount(terminalTower)===terminalTowerWrites,{terminalTowerPreview,terminalTowerResult});

const ui=prepareFellowReplay(fresh()),uiPreview=p11(ui,`ready(${T0})`),adventure=p11(ui,'adventure()'),bottom=p11(ui,'bottom()');
add('adventure-claim-card-present',adventure.includes('data-phase-11c-claim-card')&&adventure.includes('Village, Tower, then Expedition'));
add('repeat-panel-present',adventure.includes('data-phase-11c-repeat-panel="fellowCampaign"')&&adventure.includes('30,000 Gold reserve'));
add('fresh-ready-badge-absent',uiPreview.idleReadyCount===0&&!bottom.includes('phase-11c-nav-badge'));

add('all-realms-native-storage-zero',trackedRuns.every(run=>run.nativeCalls.length===0),trackedRuns.flatMap(run=>run.nativeCalls));
const passed=rows.filter(row=>row.pass).length;
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` · ${row.detail}`:''}`);
console.log(`Phase 11C focused probe: ${passed}/${rows.length}`);
if(passed!==rows.length)process.exitCode=1;
