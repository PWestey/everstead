import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setFlagsFromString } from 'node:v8';
import vm from 'node:vm';

setFlagsFromString('--no-opt');

const qaRoot=dirname(fileURLToPath(import.meta.url));
const repoRoot=resolve(qaRoot,'..','..');
const read=path=>readFileSync(resolve(repoRoot,path));
const htmlBytes=read('index.html');
const html=htmlBytes.toString('utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const legacyRaw=read('qa/fixtures/representative-v0.1.txt').toString('utf8');
const schemaOneRaw=read('qa/gate-0b/fixtures/current-v1.txt').toString('utf8');
const clone=value=>JSON.parse(JSON.stringify(value));
const sha256=value=>createHash('sha256').update(value).digest('hex');
const rows=[];
const check=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:String(detail)});
const keys={
  active:'oathforge_new_world_proto_v01',
  backup:'oathforge_new_world_proto_v01__raw_backup_v0_1',
  preV2:'oathforge_new_world_proto_v01__raw_backup_v1',
  preV3:'oathforge_new_world_proto_v01__raw_backup_v2',
  preV4:'oathforge_new_world_proto_v01__raw_backup_v3',
  preV5:'oathforge_new_world_proto_v01__raw_backup_v4',
  preV6:'oathforge_new_world_proto_v01__raw_backup_v5',
  preV7:'oathforge_new_world_proto_v01__raw_backup_v6',
  staging:'oathforge_new_world_proto_v01__staging'
};
const optionKey={activeRaw:keys.active,backupRaw:keys.backup,preV2BackupRaw:keys.preV2,preV3BackupRaw:keys.preV3,preV4BackupRaw:keys.preV4,preV5BackupRaw:keys.preV5,preV6BackupRaw:keys.preV6,preV7BackupRaw:keys.preV7,stagingRaw:keys.staging};
const freshOptions=Object.fromEntries(Object.keys(optionKey).map(key=>[key,null]));
const rawIdentity=raw=>{if(raw===null)return'null:0:00000000';let hash=2166136261;for(let index=0;index<raw.length;index++){hash^=raw.charCodeAt(index);hash=Math.imul(hash,16777619)}return`fnv1a32:${raw.length}:${(hash>>>0).toString(16).padStart(8,'0')}`};

function instrument(script){
  const hook=`globalThis.__P6__=Object.freeze({
    state:()=>clone(S),runtime:()=>clone({raw:PERSISTED_RAW,identity:PERSISTED_IDENTITY,blocked:PERSISTENCE_BLOCKED,notice:PERSISTENCE_NOTICE,outcome:PERSISTENCE_OUTCOME,stale:PERSISTENCE_STALE,writeInProgress:PERSISTENCE_WRITE_IN_PROGRESS}),
    valid:(value=S,version=CURRENT_SCHEMA_VERSION)=>validation(value,version),classify:classifyRaw,
    migrate:(value,version,context,target=CURRENT_SCHEMA_VERSION)=>runMigrations(value,version,context,target),
    legacyDefault:legacyDefaultState,defaults:defaultState,prepareFresh,stagingEnvelope,
    buildOrigins(raw){const times=[1787853600000,1787853601000,1787853602000,1787853603000,1787853604000,1787853605000],v1=JSON.parse(raw),v2=runMigrations(v1,1,{source:'schema-1',now:times[1]},2),v3=runMigrations(v2,2,{source:'schema-2',now:times[2]},3),v4=runMigrations(v3,3,{source:'schema-3',now:times[3]},4),v4raw=JSON.stringify(v4),v5=runMigrations(v4,4,{source:'schema-4',now:times[4]},5),v5raw=JSON.stringify(v5),lineage=schemaSixCheckpointLineageForRaws({backupRaw:v5raw,preV5Raw:v4raw,preV6Raw:v5raw}),v6=runMigrations(v5,5,{source:'schema-5',now:times[5],preV6Raw:v5raw,checkpointLineage:lineage},6);return{1:JSON.stringify(v1),2:JSON.stringify(v2),3:JSON.stringify(v3),4:v4raw,5:v5raw,6:JSON.stringify(v6),v6Slots:{backupRaw:v5raw,preV5BackupRaw:v4raw,preV6BackupRaw:v5raw}}},
    historical(raw){const built=this.buildOrigins(raw),v5=JSON.parse(built[5]),v6=JSON.parse(built[6]),envelope=stagingEnvelope(v6,built[5],'schema-5-migration');return{v5raw:built[5],v6raw:built[6],stagingRaw:JSON.stringify(envelope)}},
    schemaSixFor(raw,source,slotRaws){const value=JSON.parse(raw),lineage=schemaSixCheckpointLineageForRaws(slotRaws),state=runMigrations(value,5,{source,now:1787853605000,preV6Raw:raw,checkpointLineage:lineage},6);return JSON.stringify(state)},
    historicalCurrent(raw){const state=JSON.parse(raw);state.saveMeta.revision++;state.saveMeta.updatedAt++;state.saveMeta.source='boot';return{stateRaw:JSON.stringify(state),stagingRaw:JSON.stringify(stagingEnvelope(state,raw,'boot'))}},
    historicalSafeReset(raw,slots){const at=1787853610000,meta=newMetadata('safe-reset',at,[]),state=schemaScopedDefaultState(meta,6);state.saveMeta.retainedCheckpointLineage=retainedCheckpointLineageMarker(state,{backupRaw:slots.backupRaw,preV2BackupRaw:slots.preV2BackupRaw,preV3BackupRaw:slots.preV3BackupRaw,preV4BackupRaw:slots.preV4BackupRaw,preV5BackupRaw:slots.preV5BackupRaw,preV6BackupRaw:slots.preV6BackupRaw,preV7BackupRaw:null},raw);return{stateRaw:JSON.stringify(state),stagingRaw:JSON.stringify(stagingEnvelope(state,raw,'safe-reset'))}},
    historicalFresh(){const at=1787853615000,meta=newMetadata('fresh',at,[]),state=schemaScopedDefaultState(meta,6);return{stateRaw:JSON.stringify(state),stagingRaw:JSON.stringify(stagingEnvelope(state,null,'fresh'))}},
    historicalStage:(raw,activeRaw)=>historicalSchemaSixCurrentStage(raw,activeRaw),
    configs:()=>clone({mastery:COMPANION_MASTERY_CONFIG,campaign:COMPANION_CAMPAIGN_CONFIG,tower:COMPANION_TOWER_CONFIG}),
    stages:()=>clone(COMPANION_CAMPAIGN_STAGES),mastery:companionMasteryComponents,masteryLevel:companionMasteryLevel,
    companionPower:effectiveCompanionPowerComponents,totalCompanionRosterPower,companionExpThreshold,
    companionPreview:companionCampaignEfficiencyPreview,companionRun:runCompanionCampaign,companionSelect:selectCompanionCampaignStage,
    towerPreview:companionTowerChallengePreview,towerIdlePreview:companionTowerIdlePreview,towerClear:clearCompanionTower,towerClaim:claimCompanionTower,towerView:companionTowerView,
    towerHistory:towerHistoryReplay,towerTick,towerRequirement:companionTowerRequirement,towerClearRewards,
    fellowRun:runFellowCampaign,grantExp:grantCompanionExp,grantShards:grantCompanionShards,ascend:ascendCompanion,
    clearIdentity:companionTowerClearReceiptIdentity,idleIdentity:companionTowerIdleReceiptIdentity,
    noop:()=>mutatePersisted(()=>{},'navigation'),diagnostics:persistenceDiagnostics,export:safePersistenceExport,fixture:qaInstallFixture,
    action:qaNamedAction,reload:()=>persistenceAction('reload'),reset:()=>persistenceAction('safe-reset'),flags:()=>clone(FEATURE_FLAGS),
    findPitySeed(){const counts=towerFloorCountMap();counts['1']=7;for(let index=0;index<100000;index++){const id='pity-'+index,replay=towerHistoryReplay(id,counts);if(Object.values(replay.companionShards).every(value=>value===0))return id}return null},
    tamperClear(){const value=clone(S),receipt=value.companionTower.lastClearReceipt;receipt.preClearClaimedIntervalsByFloor['1']=0;receipt.identity=companionTowerClearReceiptIdentity(value.saveMeta.saveId,receipt);return validation(value)},
    tamperIdle(){const value=clone(S),receipt=value.companionTower.idle.lastReceipt;receipt.preClaimCursorAt+=1;receipt.preClaimSegments[0].elapsedMs+=600000;receipt.pendingIdentity=companionTowerIdleReceiptIdentity(value.saveMeta.saveId,receipt);return validation(value)}
  });`;
  return script.replace(/\n\}\)\(\);\s*$/,match=>'\n'+hook+'\n'+match);
}

function fixedDate(clock){const NativeDate=Date;return class extends NativeDate{constructor(...args){super(...(args.length?args:[clock.value]))}static now(){return clock.value}static parse(value){return NativeDate.parse(value)}static UTC(...args){return NativeDate.UTC(...args)}}}

function runRealm(options={}){
  const slots=new Map(Object.entries(options.initialSlots??{}));
  for(const [name,key] of Object.entries(optionKey))if(Object.hasOwn(options,name)){const value=options[name];if(value===null)slots.delete(key);else slots.set(key,String(value))}
  const storageLog=[],persistenceLog=[];
  const fault={enabled:false,operation:'setItem',key:null,step:null,remaining:1,skip:0,adapterOnly:false,...(options.fault??{})};
  const hit=(operation,key,step=null)=>{const match=fault.enabled&&fault.remaining>0&&fault.operation===operation&&(!fault.key||fault.key===key)&&(!fault.step||fault.step===step);if(match&&fault.skip>0){fault.skip--;return false}return match};
  const storage=options.storage??{
    getItem(key){storageLog.push(['get',String(key)]);if(hit('getItem',String(key))){fault.remaining--;throw new Error('injected read')}return slots.get(String(key))??null},
    setItem(key,value){storageLog.push(['set',String(key)]);if(hit('setItem',String(key))){fault.remaining--;throw new Error('injected write')}slots.set(String(key),String(value))},
    removeItem(key){storageLog.push(['remove',String(key)]);if(hit('removeItem',String(key))){fault.remaining--;throw new Error('injected remove')}slots.delete(String(key))}
  };
  const node=()=>{const value={innerHTML:'',dataset:{},style:{},className:''};value.classList={add(name){if(!value.className.split(/\s+/).includes(name))value.className=(value.className+' '+name).trim()},remove(name){value.className=value.className.split(/\s+/).filter(item=>item&&item!==name).join(' ')},contains:name=>value.className.split(/\s+/).includes(name)};return value};
  const nodes={'#app':node(),'#overlay':node(),'#toast':node(),'.campaign-walk':node(),'.companion-campaign-walk':node()};
  const document={querySelector:selector=>nodes[selector]??null,querySelectorAll:()=>[],documentElement:{scrollWidth:options.width??390}};
  const clock={value:options.now??1787853600000},DateClass=fixedDate(clock);let timerId=0;
  const timers=new Map(),clockAdapter={now(){const value=clock.value;clock.value+=options.nowStep??0;return value},setTimeout(callback){const id=++timerId;timers.set(id,callback);if(!options.deferTimers)callback();return id},clearTimeout:id=>timers.delete(id)};
  const nativeCalls=[],nativeStorage={getItem(key){nativeCalls.push(['get',key]);throw new Error('native get')},setItem(key,value){nativeCalls.push(['set',key,value]);throw new Error('native set')},removeItem(key){nativeCalls.push(['remove',key]);throw new Error('native remove')}};
  const runtime={clock:clockAdapter,random:()=>.5,storage,confirm:()=>options.confirm??true,ids:{save:()=>options.saveId??'save-phase-6',transaction:(()=>{let ordinal=0;return()=>`tx-p6-${++ordinal}`})()},qa:options.qa??{allowDestructive:true,isolatedStorage:true}};
  if(Object.hasOwn(options,'features'))runtime.features=options.features;
  const location={protocol:'http:',hostname:'127.0.0.1',search:options.search??'?qa=1'},listeners={};
  const context={console,Math:Object.create(Math),Date:DateClass,document,localStorage:nativeStorage,confirm:()=>options.confirm??true,matchMedia:query=>({matches:query==='(prefers-reduced-motion: reduce)'&&options.reducedMotion===true,media:query}),setTimeout:callback=>{callback();return 1},clearTimeout(){},crypto:{randomUUID:()=> 'native-id'},URLSearchParams,location,history:{pushState(){}},addEventListener(type,fn){(listeners[type]??=[]).push(fn)}};
  context.window=context;context.globalThis=context;context.__EVERSTEAD_RUNTIME__=runtime;
  context.__EVERSTEAD_PERSISTENCE_TEST__={storage,operationLog:persistenceLog,fault(info){if(!fault.adapterOnly&&hit(info.operation,info.key,info.step)){fault.remaining--;return fault.type==='mismatch'?{type:'mismatch',value:fault.value}:{type:'throw',message:'injected step failure'}}return null},status:{}};
  vm.createContext(context);let thrown=null;try{vm.runInContext(instrument(source),context,{timeout:30000})}catch(error){thrown=error}
  return{context,slots,storageLog,persistenceLog,nodes,clock,timers,listeners,nativeCalls,thrown,fault};
}

const evaluate=(run,expression)=>vm.runInContext(expression,run.context,{timeout:30000});
const internal=(run,expression)=>evaluate(run,`__P6__.${expression}`);
const activeRaw=run=>run.slots.get(keys.active)??null;
const active=run=>{try{const value=JSON.parse(activeRaw(run));return value?.schemaVersion===7?value:null}catch{return null}};
const writes=run=>run.storageLog.filter(([operation])=>operation==='set'||operation==='remove').length;
const snapshot=run=>Object.fromEntries(Object.values(keys).map(key=>[key,run.slots.get(key)??null]));
const valid=run=>internal(run,'valid()');
const currentRun=(state,options={})=>runRealm({...freshOptions,activeRaw:JSON.stringify(state),...options});

check('artifact-source',Boolean(source));
check('artifact-size',htmlBytes.length>1_000_000,htmlBytes.length);
check('schema7-static',source.includes('CURRENT_SCHEMA_VERSION=7')&&source.includes("PRE_V7_BACKUP_KEY=NS+'__raw_backup_v6'")&&source.includes("id:'schema-6-to-7'"));
check('nine-slot-static',source.includes('exportVersion:7')&&source.includes('preV7BackupRaw'));
check('shared-coordinator-static',source.includes('function encounterCoordinator(')&&source.includes('ENCOUNTER_MODES=Object.freeze'));
check('single-captured-tick-static',source.includes('PHASE_SIX_CAPTURED_NOW')&&source.includes('runtimeNowUncaptured'));
check('three-routes-static',source.includes("['fellowCampaign','Fellows']")&&source.includes("['companionCampaign','Companions']")&&source.includes("['companionTower','Tower']"));
check('retired-tower-isolated',source.includes("companionTower:Object.freeze")&&source.includes("'companion-tower-clear'"));
check('tower-hourly-rates-ui-static',source.includes('Current hourly rates')&&source.includes('shard chance'));
check('tower-exact-clear-preview-ui-static',source.includes('Exact next first-clear rewards'));
check('tower-durable-history-ui-static',source.includes('Last Tower activity')&&source.includes('Last idle claim'));
check('tower-result-copy-static',source.includes('total EXP · Mastery')&&source.includes('shards:'));
check('tower-history-copy-static',source.includes('Floor ${lastClear.floor} cleared')&&source.includes('${rewardTotal(lastClaim.companionExp)} EXP (${rewardList(lastClaim.companionExp)})'));

const fresh=runRealm(freshOptions),freshState=active(fresh);
if(!fresh.context.__P6__){console.error('Phase 6 instrumentation failed',fresh.thrown?.stack??'hook missing');process.exit(1)}
check('fresh-no-throw',fresh.thrown===null,fresh.thrown?.stack??'');
check('fresh-schema7',freshState?.schemaVersion===7);
check('fresh-valid',valid(fresh).ok,valid(fresh).errors);
check('fresh-nine-slot-export',Object.keys(internal(fresh,'export().readErrors')).length===9);
check('fresh-no-native-storage',fresh.nativeCalls.length===0,JSON.stringify(fresh.nativeCalls));
check('fresh-mastery-zero',freshState.companionMastery.points===0&&internal(fresh,'mastery().level')===0&&internal(fresh,'mastery().multiplier')===1);
check('fresh-campaign-empty',freshState.companionCampaign.runOrdinal===0&&freshState.companionCampaign.selectedStageId==='companion-trail-1');
check('fresh-tower-empty',freshState.companionTower.highestFloor===0&&freshState.companionTower.idle.intervalOrdinal===0&&freshState.companionTower.idle.segments.length===0);
check('fresh-ui-route',freshState.ui.adventure==='fellowCampaign');

const configs=internal(fresh,'configs()'),stages=internal(fresh,'stages()');
check('mastery-config',JSON.stringify(configs.mastery)===JSON.stringify({pointsCap:50000,levelCap:50,thresholdFactor:20,powerPerLevel:.01}));
check('tower-config',JSON.stringify(configs.tower)===JSON.stringify({floorCap:50,elapsedCapMs:86400000,intervalMs:3600000,pityForceAt:8}));
check('campaign-stage-count',stages.length===10);
const names=['Mosslit Gate','Whispering Ford','Briar Hollow','Moonroot Crossing','Emberglass Ridge','Stormwake Pass','Starfall Basin','Ashen Canopy','Dawnspire Reach','Heart of the Wild'];
const recommended=[2000,2360,2785,3286,3878,4576,5399,6371,7518,8871];
for(const stage of stages){const index=stage.ordinal-1;check(`stage-${stage.ordinal}-definition`,stage.id===`companion-trail-${stage.ordinal}`&&stage.name===names[index]&&stage.recommendedPower===recommended[index]&&stage.baseCost===8000+1500*index);check(`stage-${stage.ordinal}-rewards`,stage.firstClearExp===100+25*index&&stage.replayExp===Math.floor((100+25*index)/2)&&stage.firstClearShards===4&&stage.replayShards===1&&stage.targetCompanionId===['bramble','cinderwing'][index%2])}
for(const [points,level] of [[0,0],[19,0],[20,1],[79,1],[80,2],[49999,49],[50000,50]])check(`mastery-${points}`,internal(fresh,`masteryLevel(${points})`)===level);
for(const floor of [1,2,5,10,25,50])check(`tower-requirement-${floor}`,internal(fresh,`towerRequirement(${floor})`)===Math.round(2000*Math.pow(1.06,floor-1)));
for(const [value,expected] of [[0,0],[.5,0],[1,1],[Number.MAX_SAFE_INTEGER-1,Number.MAX_SAFE_INTEGER-1],[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],[Number.MAX_SAFE_INTEGER+1,Number.MAX_SAFE_INTEGER],[Number.MAX_VALUE,Number.MAX_SAFE_INTEGER],[-1,0]])check(`tower-tick-${String(value)}`,internal(fresh,`towerTick(${String(value)})`)===expected);

const campaign=runRealm(freshOptions),campaignBefore=clone(active(campaign)),preview=internal(campaign,"companionPreview('companion-trail-1')"),first=internal(campaign,"companionRun('companion-trail-1',{confirmed:true,present:false})"),afterFirst=active(campaign),firstReceipt=afterFirst.companionCampaign.lastReceipt;
check('campaign-preview-total-power',preview.totalRosterPower===2200&&preview.eligible===true&&preview.firstClear===true);
check('campaign-first-clear',first.ok===true&&firstReceipt.firstClear===true&&firstReceipt.companionExp.bramble===100&&firstReceipt.companionShards.bramble===4);
check('campaign-first-exact-spend',campaignBefore.gold-afterFirst.gold===firstReceipt.effectiveCost);
check('campaign-first-ledger',afterFirst.companionCampaign.runOrdinal===1&&afterFirst.companionCampaign.runCountsByStage['companion-trail-1']===1&&afterFirst.companionCampaign.clearedStageIds.join(',')==='companion-trail-1');
check('campaign-no-cross-lane',afterFirst.companionMastery.points===0&&afterFirst.gifts===campaignBefore.gifts&&afterFirst.player.rankExp===campaignBefore.player.rankExp&&afterFirst.prosperity===campaignBefore.prosperity);
const replay=internal(campaign,"companionRun('companion-trail-1',{confirmed:true,present:false})"),afterReplay=active(campaign);
check('campaign-replay',replay.ok===true&&afterReplay.companionCampaign.lastReceipt.firstClear===false&&afterReplay.companionCampaign.lastReceipt.companionExp.bramble===50&&afterReplay.companionCampaign.lastReceipt.companionShards.bramble===1);
check('campaign-reload',valid(runRealm({...freshOptions,activeRaw:activeRaw(campaign)})).ok);

const poorState=clone(campaignBefore);poorState.gold=0;const poor=currentRun(poorState),poorRaw=activeRaw(poor),poorWrites=writes(poor),poorResult=internal(poor,"companionRun('companion-trail-1',{confirmed:true,present:false})");
check('campaign-insufficient-gold-zero-write',poorResult===false&&activeRaw(poor)===poorRaw&&writes(poor)===poorWrites);
const underState=clone(afterFirst),under=currentRun(underState),underRaw=activeRaw(under),underWrites=writes(under),underResult=internal(under,"companionRun('companion-trail-2',{confirmed:true,present:false})");
check('campaign-underpowered-zero-write',underResult===false&&activeRaw(under)===underRaw&&writes(under)===underWrites,JSON.stringify({underResult,rawSame:activeRaw(under)===underRaw,writesBefore:underWrites,writesAfter:writes(under),blocked:internal(under,'runtime().blocked')}));
const declined=runRealm({...freshOptions,confirm:false}),declinedRaw=activeRaw(declined),declinedWrites=writes(declined),declinedResult=internal(declined,"companionRun('companion-trail-1',{present:false})");
check('campaign-decline-zero-write',declinedResult===false&&activeRaw(declined)===declinedRaw&&writes(declined)===declinedWrites);

const fellow=runRealm(freshOptions),fellowResult=internal(fellow,"fellowRun('broken-roads-1',{confirmed:true,present:false})");
check('shared-coordinator-preserves-fellow',fellowResult.ok===true&&active(fellow).fellowCampaign.lastReceipt.stageId==='broken-roads-1');
const fractionalFellow=runRealm({...freshOptions,now:1787853602000.75}),fractionalFellowResult=internal(fractionalFellow,"fellowRun('broken-roads-1',{confirmed:true,present:false})");
check('shared-coordinator-fellow-raw-time',fractionalFellowResult.ok===true&&active(fractionalFellow).fellowCampaign.lastReceipt.completedAt===1787853602000.75);
const fractionalCompanion=runRealm({...freshOptions,now:1787853602000.75}),fractionalCompanionResult=internal(fractionalCompanion,"companionRun('companion-trail-1',{confirmed:true,present:false})");
check('shared-coordinator-companion-raw-time',fractionalCompanionResult.ok===true&&active(fractionalCompanion).companionCampaign.lastReceipt.completedAt===1787853602000.75);

const tower=runRealm(freshOptions),towerGold=active(tower).gold,clearOne=internal(tower,'towerClear({present:false})'),afterClear=active(tower);
check('tower-floor1-clear',clearOne.ok===true&&afterClear.companionTower.highestFloor===1&&afterClear.companionTower.lastClearReceipt.floor===1);
check('tower-floor1-rewards',afterClear.companionTower.lastClearReceipt.companionExp.bramble===40&&afterClear.companionMastery.points===2);
check('tower-no-gold',afterClear.gold===towerGold);
const halfRaw=activeRaw(tower),halfWrites=writes(tower);tower.clock.value+=3599999;const half=internal(tower,'towerClaim({present:false})');
check('tower-interval-minus-one-zero-write',half===false&&activeRaw(tower)===halfRaw&&writes(tower)===halfWrites);
tower.clock.value+=1;const exactClaim=internal(tower,'towerClaim({present:false})'),afterClaim=active(tower),idleReceipt=afterClaim.companionTower.idle.lastReceipt;
check('tower-exact-interval',exactClaim.ok===true&&afterClaim.companionTower.idle.intervalOrdinal===1&&idleReceipt.consumedElapsedMs===3600000);
check('tower-single-tick',idleReceipt.claimedAt===idleReceipt.preClaimCursorAt&&idleReceipt.claimedAt===afterClaim.companionTower.idle.cursorAt);
const towerHistoryHtml=internal(tower,'towerView()');check('tower-history-clear-rendered',towerHistoryHtml.includes('Floor 1 cleared')&&towerHistoryHtml.includes('Bramble +40')&&towerHistoryHtml.includes('Cinderwing +40'));check('tower-history-claim-rendered',towerHistoryHtml.includes('44 EXP')&&towerHistoryHtml.includes('Bramble +22')&&towerHistoryHtml.includes('Cinderwing +22')&&towerHistoryHtml.includes('Mastery +1'));
const doubleRaw=activeRaw(tower),doubleWrites=writes(tower),double=internal(tower,'towerClaim({present:false})');
check('tower-double-claim-zero-write',double===false&&activeRaw(tower)===doubleRaw&&writes(tower)===doubleWrites);
check('tower-claim-reload',valid(runRealm({...freshOptions,activeRaw:activeRaw(tower)})).ok);

const advancing=runRealm({...freshOptions,nowStep:1000});internal(advancing,'towerClear({present:false})');advancing.clock.value+=7200000;const advancingBefore=advancing.clock.value,advancingResult=internal(advancing,'towerClaim({present:false})'),advancingState=active(advancing),advancingReceipt=advancingState.companionTower.idle.lastReceipt;
check('tower-advancing-clock-claim',advancingResult.ok===true&&advancingReceipt.claimedAt===advancingBefore&&advancingReceipt.preClaimCursorAt===advancingBefore&&advancingState.companionTower.idle.cursorAt===advancingBefore&&advancingReceipt.intervalOrdinalEnd-advancingReceipt.intervalOrdinalStart===2);

const capped=runRealm(freshOptions);internal(capped,'towerClear({present:false})');capped.clock.value+=86400000+3600000;const capClaim=internal(capped,'towerClaim({present:false})'),capState=active(capped);
check('tower-24h-cap',capClaim.ok===true&&capState.companionTower.idle.intervalOrdinal===24&&capState.companionTower.idle.lastReceipt.consumedElapsedMs===86400000);
const rollbackRaw=activeRaw(capped),rollbackWrites=writes(capped);capped.clock.value-=999999999;const rollback=internal(capped,'towerClaim({present:false})');
check('tower-clock-rollback-zero-write',rollback===false&&activeRaw(capped)===rollbackRaw&&writes(capped)===rollbackWrites);

const pitySeed=internal(fresh,'findPitySeed()'),pity=runRealm({...freshOptions,saveId:pitySeed});internal(pity,'towerClear({present:false})');pity.clock.value+=8*3600000;internal(pity,'towerClaim({present:false})');const pityState=active(pity),pityShardTotal=Object.values(pityState.companionTower.idle.lastReceipt.companionShards).reduce((sum,value)=>sum+value,0);
check('tower-pity-seed-found',typeof pitySeed==='string');
check('tower-forced-eighth',pityShardTotal===1&&pityState.companionTower.idle.pityMisses===0);

const history=runRealm(freshOptions);internal(history,'towerClear({present:false})');history.clock.value+=5400000;internal(history,'towerClaim({present:false})');check('idle-snapshot-tamper-rejected',internal(history,'tamperIdle()').ok===false);internal(history,'towerClear({present:false})');check('clear-snapshot-tamper-rejected',internal(history,'tamperClear()').ok===false);
const carryHistory=runRealm(freshOptions);internal(carryHistory,'towerClear({present:false})');carryHistory.clock.value+=1800000;internal(carryHistory,'towerClear({present:false})');carryHistory.clock.value+=1800000;const carryClaim=internal(carryHistory,'towerClaim({present:false})'),carryReload=runRealm({initialSlots:Object.fromEntries(carryHistory.slots)});
check('tower-cross-floor-carry-valid',carryClaim.ok===true&&active(carryHistory).companionTower.idle.lastReceipt.intervalCountsByFloor['1']===1&&valid(carryReload).ok,internal(carryReload,'runtime().blocked')?.message??'');
const orderedHistory=runRealm(freshOptions);internal(orderedHistory,'towerClear({present:false})');orderedHistory.clock.value+=3600000;internal(orderedHistory,'towerClaim({present:false})');internal(orderedHistory,'towerClear({present:false})');orderedHistory.clock.value+=3600000;internal(orderedHistory,'towerClaim({present:false})');const orderedState=active(orderedHistory),forgedOrdered=clone(orderedState),forgedReceipt=forgedOrdered.companionTower.idle.lastReceipt,allCounts=clone(forgedOrdered.companionTower.idle.claimedIntervalsByFloor),allReplay=internal(orderedHistory,`towerHistory(${JSON.stringify(forgedOrdered.saveMeta.saveId)},${JSON.stringify(allCounts)})`),clearReplay=internal(orderedHistory,`towerClearRewards(${JSON.stringify(forgedOrdered.saveMeta.saveId)},2)`);forgedReceipt.preClaimClearSequence=2;forgedReceipt.preClaimSegments=[{floor:1,elapsedMs:3600000},{floor:2,elapsedMs:3600000}];forgedReceipt.preClaimIntervalOrdinal=0;forgedReceipt.preClaimPityMisses=0;forgedReceipt.consumedElapsedMs=7200000;forgedReceipt.intervalOrdinalStart=0;forgedReceipt.intervalCountsByFloor=clone(allCounts);forgedReceipt.companionExp=clone(allReplay.companionExp);forgedReceipt.companionShards=clone(allReplay.companionShards);forgedReceipt.masteryNominal=allReplay.masteryNominal;forgedReceipt.preMasteryPoints=Math.min(configs.mastery.pointsCap,clearReplay.masteryNominal);forgedReceipt.postMasteryPoints=forgedOrdered.companionMastery.points;forgedReceipt.masteryAwarded=forgedReceipt.postMasteryPoints-forgedReceipt.preMasteryPoints;forgedReceipt.pityAfter=allReplay.pityMisses;forgedReceipt.pendingIdentity=internal(orderedHistory,`idleIdentity(${JSON.stringify(forgedOrdered.saveMeta.saveId)},${JSON.stringify(forgedReceipt)})`);
check('tower-cross-clear-history-rewrite-rejected',internal(orderedHistory,`valid(${JSON.stringify(forgedOrdered)})`).ok===false);
for(const [label,mutate] of [
  ['mastery',state=>state.companionMastery.points++],
  ['claimed-count',state=>state.companionTower.idle.claimedIntervalsByFloor['1']++],
  ['claimed-total',state=>state.companionTower.idle.claimedTotals.masteryNominal++],
  ['campaign-count',state=>state.companionCampaign.runCountsByStage['companion-trail-1']++],
  ['campaign-receipt',state=>state.companionCampaign.lastReceipt.companionExp.bramble++]
]){const base=label.startsWith('campaign')?afterReplay:afterClaim,state=clone(base);mutate(state);check(`ledger-forgery-${label}`,internal(fresh,`valid(${JSON.stringify(state)})`).ok===false)}

const generator=runRealm(freshOptions),origins=internal(generator,`buildOrigins(${JSON.stringify(schemaOneRaw)})`);
const originInputs={0:{activeRaw:legacyRaw},1:{activeRaw:origins[1]},2:{activeRaw:origins[2]},3:{activeRaw:origins[3]},4:{activeRaw:origins[4]},5:{activeRaw:origins[5],preV5BackupRaw:origins[4]},6:{activeRaw:origins[6],...origins.v6Slots}};
for(let version=0;version<=6;version++){
  const run=runRealm({...freshOptions,...originInputs[version]}),state=active(run),reload=runRealm({initialSlots:Object.fromEntries(run.slots)});
  check(`migration-v${version}-schema7`,run.thrown===null&&state?.schemaVersion===7&&valid(run).ok,run.thrown?.stack??internal(run,'runtime().blocked')?.message??'');
  check(`migration-v${version}-no-retroactive-phase6`,state?.companionMastery.points===0&&state?.companionCampaign.runOrdinal===0&&state?.companionTower.highestFloor===0);
  check(`migration-v${version}-pre-v7`,run.slots.has(keys.preV7));
  check(`migration-v${version}-reload`,reload.thrown===null&&active(reload)?.schemaVersion===7&&valid(reload).ok,reload.thrown?.stack??internal(reload,'runtime().blocked')?.message??'');
}

for(let version=0;version<=6;version++){
  const parsed=JSON.parse(version===0?legacyRaw:origins[version]);parsed.companionMastery={points:0};const raw=JSON.stringify(parsed),options={...freshOptions,...(version===6?origins.v6Slots:{}),activeRaw:raw},run=runRealm(options);
  check(`reserved-collision-v${version}-blocked`,internal(run,'runtime().blocked')!==null);
  check(`reserved-collision-v${version}-zero-write`,writes(run)===0&&activeRaw(run)===raw);
}

const malformedPreV7='{bad';const malformed=runRealm({...freshOptions,activeRaw:origins[1],preV7BackupRaw:malformedPreV7}),malformedBefore={...freshOptions,activeRaw:origins[1],preV7BackupRaw:malformedPreV7};
check('malformed-pre-v7-blocked',internal(malformed,'runtime().blocked.kind')==='pre-v7-backup-lineage');
check('malformed-pre-v7-zero-write',writes(malformed)===0&&malformed.slots.get(keys.preV7)===malformedPreV7&&activeRaw(malformed)===origins[1]);
const foreignV6=JSON.parse(origins[6]);foreignV6.gold+=777;const foreignRaw=JSON.stringify(foreignV6),foreign=runRealm({...freshOptions,activeRaw:origins[5],...origins.v6Slots,preV7BackupRaw:foreignRaw});
check('foreign-pre-v7-blocked',internal(foreign,'runtime().blocked')!==null&&writes(foreign)===0);

const missing=runRealm({...freshOptions,activeRaw:null,preV7BackupRaw:origins[6],...origins.v6Slots});
check('missing-active-schema6-recovery',active(missing)?.schemaVersion===7&&internal(missing,'runtime().outcome')==='RECOVERY'&&valid(missing).ok);
check('missing-active-reload',valid(runRealm({initialSlots:Object.fromEntries(missing.slots)})).ok);
const authenticMigration=runRealm({...freshOptions,activeRaw:origins[5],preV5BackupRaw:origins[4]}),authenticSlots=Object.fromEntries(authenticMigration.slots),modifiedPreV7=JSON.parse(authenticSlots[keys.preV7]);modifiedPreV7.gold+=777;delete authenticSlots[keys.active];delete authenticSlots[keys.staging];authenticSlots[keys.preV7]=JSON.stringify(modifiedPreV7);const modifiedMissing=runRealm({initialSlots:authenticSlots});
check('missing-active-modified-pre-v7-blocked',internal(modifiedMissing,'runtime().blocked.kind')==='pre-v7-backup-lineage');
check('missing-active-modified-pre-v7-zero-write',writes(modifiedMissing)===0&&modifiedMissing.slots.get(keys.preV7)===authenticSlots[keys.preV7]);
const evolvedSlots={...originInputs[6],activeRaw:null,preV7BackupRaw:null},evolvedPreV7=JSON.parse(origins[6]);evolvedPreV7.gold++;evolvedPreV7.saveMeta.revision++;evolvedPreV7.saveMeta.updatedAt++;evolvedPreV7.saveMeta.source='boot';evolvedSlots.preV7BackupRaw=JSON.stringify(evolvedPreV7);const evolvedMissing=runRealm({...freshOptions,...evolvedSlots});
check('missing-active-lone-evolved-pre-v7-blocked',internal(evolvedMissing,'runtime().blocked.kind')==='pre-v7-backup-lineage');
check('missing-active-lone-evolved-pre-v7-zero-write',writes(evolvedMissing)===0&&evolvedMissing.slots.get(keys.preV7)===evolvedSlots.preV7BackupRaw);
const foreignSixRaw=internal(generator,`schemaSixFor(${JSON.stringify(origins[5])},'foreign',{backupRaw:${JSON.stringify(origins[5])},preV2Raw:null,preV3Raw:null,preV4Raw:null,preV5Raw:${JSON.stringify(origins[4])},preV6Raw:${JSON.stringify(origins[5])}})`),foreignSource=runRealm({...freshOptions,activeRaw:origins[5],backupRaw:origins[5],preV5BackupRaw:origins[4],preV6BackupRaw:origins[5],preV7BackupRaw:foreignSixRaw});
check('self-declared-foreign-migration-source-blocked',internal(foreignSource,'runtime().blocked.kind')==='pre-v7-backup-lineage');
check('self-declared-foreign-migration-source-zero-write',writes(foreignSource)===0&&foreignSource.slots.get(keys.preV7)===foreignSixRaw);

const historicalBuilt=internal(generator,`historical(${JSON.stringify(schemaOneRaw)})`),historical=runRealm({...freshOptions,...origins.v6Slots,activeRaw:historicalBuilt.v5raw,stagingRaw:historicalBuilt.stagingRaw});
check('historical-schema6-stage-completed',active(historical)?.schemaVersion===7&&valid(historical).ok&&!historical.slots.has(keys.staging),JSON.stringify(internal(historical,'runtime()')));
check('historical-schema6-stage-reload',valid(runRealm({initialSlots:Object.fromEntries(historical.slots)})).ok,JSON.stringify(snapshot(historical)));
const historicalSlotSet={backupRaw:origins[5],preV2BackupRaw:null,preV3BackupRaw:null,preV4BackupRaw:null,preV5BackupRaw:origins[4],preV6BackupRaw:origins[5]},historicalCurrent=internal(generator,`historicalCurrent(${JSON.stringify(origins[6])})`),historicalPendingCurrent=runRealm({...freshOptions,...historicalSlotSet,activeRaw:origins[6],stagingRaw:historicalCurrent.stagingRaw}),historicalCommittedCurrent=runRealm({...freshOptions,...historicalSlotSet,activeRaw:historicalCurrent.stateRaw,stagingRaw:historicalCurrent.stagingRaw});
check('historical-schema6-current-pending-completed',active(historicalPendingCurrent)?.schemaVersion===7&&valid(historicalPendingCurrent).ok&&!historicalPendingCurrent.slots.has(keys.staging));
check('historical-schema6-current-committed-cleaned',active(historicalCommittedCurrent)?.schemaVersion===7&&valid(historicalCommittedCurrent).ok&&!historicalCommittedCurrent.slots.has(keys.staging));
const historicalReset=internal(generator,`historicalSafeReset(${JSON.stringify(origins[6])},${JSON.stringify(historicalSlotSet)})`),historicalPendingReset=runRealm({...freshOptions,...historicalSlotSet,activeRaw:origins[6],stagingRaw:historicalReset.stagingRaw}),historicalCommittedReset=runRealm({...freshOptions,...historicalSlotSet,activeRaw:historicalReset.stateRaw,stagingRaw:historicalReset.stagingRaw});
check('historical-schema6-reset-pending-completed',active(historicalPendingReset)?.schemaVersion===7&&valid(historicalPendingReset).ok&&!historicalPendingReset.slots.has(keys.staging),internal(historicalPendingReset,'runtime().blocked')?.message??'');
check('historical-schema6-reset-committed-cleaned',active(historicalCommittedReset)?.schemaVersion===7&&valid(historicalCommittedReset).ok&&!historicalCommittedReset.slots.has(keys.staging),internal(historicalCommittedReset,'runtime().blocked')?.message??'');
const malformedResetSlots={...historicalSlotSet,preV6BackupRaw:'{'},historicalMalformedReset=internal(generator,`historicalSafeReset(${JSON.stringify(origins[6])},${JSON.stringify(malformedResetSlots)})`),historicalPendingMalformedReset=runRealm({...freshOptions,...malformedResetSlots,activeRaw:origins[6],stagingRaw:historicalMalformedReset.stagingRaw}),historicalCommittedMalformedReset=runRealm({...freshOptions,...malformedResetSlots,activeRaw:historicalMalformedReset.stateRaw,stagingRaw:historicalMalformedReset.stagingRaw});
check('historical-schema6-malformed-archive-reset-pending',active(historicalPendingMalformedReset)?.schemaVersion===7&&valid(historicalPendingMalformedReset).ok&&!historicalPendingMalformedReset.slots.has(keys.staging),internal(historicalPendingMalformedReset,'runtime().blocked')?.message??'');
check('historical-schema6-malformed-archive-reset-committed',active(historicalCommittedMalformedReset)?.schemaVersion===7&&valid(historicalCommittedMalformedReset).ok&&!historicalCommittedMalformedReset.slots.has(keys.staging),internal(historicalCommittedMalformedReset,'runtime().blocked')?.message??'');
const historicalFresh=internal(generator,'historicalFresh()'),historicalPendingFresh=runRealm({...freshOptions,activeRaw:null,stagingRaw:historicalFresh.stagingRaw}),historicalCommittedFresh=runRealm({...freshOptions,activeRaw:historicalFresh.stateRaw,stagingRaw:historicalFresh.stagingRaw});
check('historical-schema6-fresh-property-order',historicalFresh.stateRaw.indexOf('"towerFloor"')<historicalFresh.stateRaw.indexOf('"tradingRating"'));
check('historical-schema6-fresh-pending-completed',active(historicalPendingFresh)?.schemaVersion===7&&valid(historicalPendingFresh).ok&&!historicalPendingFresh.slots.has(keys.staging),internal(historicalPendingFresh,'runtime().blocked')?.message??'');
check('historical-schema6-fresh-committed-cleaned',active(historicalCommittedFresh)?.schemaVersion===7&&valid(historicalCommittedFresh).ok&&!historicalCommittedFresh.slots.has(keys.staging),internal(historicalCommittedFresh,'runtime().blocked')?.message??'');
for(const [name,checkpoint] of [['malformed','{'],['foreign',JSON.stringify({...JSON.parse(origins[5]),gold:JSON.parse(origins[5]).gold+1})]])for(const [position,activeValue]of [['pending',origins[6]],['committed',historicalCurrent.stateRaw]]){const options={...freshOptions,...historicalSlotSet,preV6BackupRaw:checkpoint,activeRaw:activeValue,stagingRaw:historicalCurrent.stagingRaw},run=runRealm(options);check(`historical-schema6-${position}-${name}-checkpoint-blocked`,internal(run,'runtime().blocked')!==null);check(`historical-schema6-${position}-${name}-checkpoint-zero-write`,writes(run)===0&&run.slots.get(keys.active)===activeValue&&run.slots.get(keys.preV6)===checkpoint&&run.slots.get(keys.staging)===historicalCurrent.stagingRaw)}
const historicalReadRace=runRealm({...freshOptions,...historicalSlotSet,activeRaw:origins[6],stagingRaw:historicalCurrent.stagingRaw,fault:{enabled:true,operation:'getItem',step:'pre-v6-backup-read-verify',skip:1,type:'mismatch',value:'foreign-race'}});
check('historical-schema6-checkpoint-read-race-blocked',internal(historicalReadRace,'runtime().blocked')!==null);
check('historical-schema6-checkpoint-read-race-zero-write',writes(historicalReadRace)===0&&historicalReadRace.slots.get(keys.active)===origins[6]&&historicalReadRace.slots.get(keys.preV6)===historicalSlotSet.preV6BackupRaw&&historicalReadRace.slots.get(keys.staging)===historicalCurrent.stagingRaw);
for(const [lane,activeValue,stageValue]of [['ordinary-pending',origins[6],historicalCurrent.stagingRaw],['ordinary-committed',historicalCurrent.stateRaw,historicalCurrent.stagingRaw],['reset-pending',origins[6],historicalReset.stagingRaw],['reset-committed',historicalReset.stateRaw,historicalReset.stagingRaw],['migration-committed',historicalBuilt.v6raw,historicalBuilt.stagingRaw]]){const slotsForLane=lane==='migration-committed'?{...historicalSlotSet,backupRaw:historicalBuilt.v5raw,preV6BackupRaw:historicalBuilt.v5raw}:historicalSlotSet,run=runRealm({...freshOptions,...slotsForLane,activeRaw:activeValue,preV7BackupRaw:'{',stagingRaw:stageValue});check(`historical-schema6-${lane}-foreign-pre-v7-blocked`,internal(run,'runtime().blocked')!==null);check(`historical-schema6-${lane}-foreign-pre-v7-zero-write`,writes(run)===0&&run.slots.get(keys.active)===activeValue&&run.slots.get(keys.preV7)==='{'&&run.slots.get(keys.staging)===stageValue)}
const historicalExactPreV7=runRealm({...freshOptions,...historicalSlotSet,activeRaw:origins[6],preV7BackupRaw:historicalCurrent.stateRaw,stagingRaw:historicalCurrent.stagingRaw});
check('historical-schema6-exact-effective-pre-v7-completes',active(historicalExactPreV7)?.schemaVersion===7&&valid(historicalExactPreV7).ok&&!historicalExactPreV7.slots.has(keys.staging));
const historicalPreV7Race=runRealm({...freshOptions,...historicalSlotSet,activeRaw:origins[6],preV7BackupRaw:historicalCurrent.stateRaw,stagingRaw:historicalCurrent.stagingRaw,fault:{enabled:true,operation:'getItem',step:'pre-v7-backup-read-verify',skip:1,type:'mismatch',value:'foreign-race'}});
check('historical-schema6-pre-v7-read-race-blocked',internal(historicalPreV7Race,'runtime().blocked')!==null);
check('historical-schema6-pre-v7-read-race-zero-write',writes(historicalPreV7Race)===0&&historicalPreV7Race.slots.get(keys.active)===origins[6]&&historicalPreV7Race.slots.get(keys.preV7)===historicalCurrent.stateRaw&&historicalPreV7Race.slots.get(keys.staging)===historicalCurrent.stagingRaw);
const resetEvolution=internal(generator,`historicalCurrent(${JSON.stringify(historicalReset.stateRaw)})`),tamperedResetEvolution=JSON.parse(resetEvolution.stateRaw);tamperedResetEvolution.saveMeta.retainedCheckpointLineage.backupRawIdentity='fnv1a32:1:00000000';const tamperedResetEvolutionRaw=JSON.stringify(tamperedResetEvolution),tamperedResetEvolutionStage=evaluate(generator,`JSON.stringify(__P6__.stagingEnvelope(${JSON.stringify(tamperedResetEvolution)},${JSON.stringify(historicalReset.stateRaw)},'boot'))`),tamperedResetEvolutionRun=runRealm({...freshOptions,...historicalSlotSet,activeRaw:historicalReset.stateRaw,preV7BackupRaw:tamperedResetEvolutionRaw,stagingRaw:tamperedResetEvolutionStage});
check('historical-schema6-evolved-reset-marker-tamper-blocked',internal(tamperedResetEvolutionRun,'runtime().blocked')!==null);
check('historical-schema6-evolved-reset-marker-tamper-zero-write',writes(tamperedResetEvolutionRun)===0&&tamperedResetEvolutionRun.slots.get(keys.active)===historicalReset.stateRaw&&tamperedResetEvolutionRun.slots.get(keys.preV7)===tamperedResetEvolutionRaw&&tamperedResetEvolutionRun.slots.get(keys.staging)===tamperedResetEvolutionStage);
const reservedHistoricalBase=JSON.parse(origins[6]);reservedHistoricalBase.companionMastery={points:0};const reservedHistoricalBaseRaw=JSON.stringify(reservedHistoricalBase),reservedHistoricalCurrent=internal(generator,`historicalCurrent(${JSON.stringify(reservedHistoricalBaseRaw)})`),reservedPendingSlots={...freshOptions,...historicalSlotSet,activeRaw:reservedHistoricalBaseRaw,stagingRaw:reservedHistoricalCurrent.stagingRaw},reservedCommittedSlots={...freshOptions,...historicalSlotSet,activeRaw:reservedHistoricalCurrent.stateRaw,stagingRaw:reservedHistoricalCurrent.stagingRaw};
for(const [name,options] of [['pending-active',reservedPendingSlots],['committed-active',reservedCommittedSlots]]){const run=runRealm(options);check(`historical-schema6-ordinary-${name}-collision-blocked`,internal(run,'runtime().blocked.kind')==='schema-7-reserved-collision');check(`historical-schema6-ordinary-${name}-collision-zero-write`,writes(run)===0&&run.slots.get(keys.active)===options.activeRaw&&run.slots.get(keys.staging)===options.stagingRaw)}
const reservedStageState=JSON.parse(historicalCurrent.stateRaw);reservedStageState.companionMastery={points:0};const reservedStageRaw=evaluate(generator,`JSON.stringify(__P6__.stagingEnvelope(${JSON.stringify(reservedStageState)},${JSON.stringify(origins[6])},'boot'))`),reservedStageRun=runRealm({...freshOptions,...historicalSlotSet,activeRaw:origins[6],stagingRaw:reservedStageRaw});
check('historical-schema6-ordinary-stage-collision-blocked',internal(reservedStageRun,'runtime().blocked.kind')==='schema-7-reserved-collision');
check('historical-schema6-ordinary-stage-collision-zero-write',writes(reservedStageRun)===0&&reservedStageRun.slots.get(keys.active)===origins[6]&&reservedStageRun.slots.get(keys.staging)===reservedStageRaw);
const reservedResetState=JSON.parse(historicalReset.stateRaw);reservedResetState.companionMastery={points:0};const reservedResetRaw=JSON.stringify(reservedResetState),reservedResetStage=evaluate(generator,`JSON.stringify(__P6__.stagingEnvelope(${JSON.stringify(reservedResetState)},${JSON.stringify(origins[6])},'safe-reset'))`);
for(const [name,activeValue] of [['pending',origins[6]],['committed',reservedResetRaw]]){const run=runRealm({...freshOptions,...historicalSlotSet,activeRaw:activeValue,stagingRaw:reservedResetStage});check(`historical-schema6-reset-${name}-collision-blocked`,internal(run,'runtime().blocked.kind')==='schema-7-reserved-collision');check(`historical-schema6-reset-${name}-collision-zero-write`,writes(run)===0&&run.slots.get(keys.active)===activeValue&&run.slots.get(keys.staging)===reservedResetStage)}
for(const step of ['historical-v6-active-owner','historical-v6-cleanup-owner','historical-v6-cleanup','historical-v6-cleanup-verify']){const run=runRealm({...freshOptions,...historicalSlotSet,activeRaw:historicalBuilt.v6raw,stagingRaw:historicalBuilt.stagingRaw,fault:{enabled:true,operation:step==='historical-v6-cleanup'?'removeItem':'getItem',step}});run.fault.enabled=false;internal(run,'reload()');check(`historical-schema6-migration-${step}-retry`,active(run)?.schemaVersion===7&&valid(run).ok&&!run.slots.has(keys.staging),internal(run,'runtime().blocked')?.message??'')}
const interrupted=runRealm({...freshOptions,activeRaw:origins[6],...origins.v6Slots,fault:{enabled:true,operation:'setItem',step:'active-write'}}),interruptedSlots=Object.fromEntries(interrupted.slots);delete interruptedSlots[keys.active];const missingStage=runRealm({initialSlots:interruptedSlots});
check('missing-active-bound-migration-stage-recovered',active(missingStage)?.schemaVersion===7&&valid(missingStage).ok&&!missingStage.slots.has(keys.staging),internal(missingStage,'runtime().blocked')?.message??'');
check('missing-active-bound-migration-stage-reload',valid(runRealm({initialSlots:Object.fromEntries(missingStage.slots)})).ok);
const interruptedFive=runRealm({...freshOptions,activeRaw:origins[5],preV5BackupRaw:origins[4],fault:{enabled:true,operation:'setItem',step:'active-write'}}),tamperedStageSlots=Object.fromEntries(interruptedFive.slots),tamperedPreV7=JSON.parse(tamperedStageSlots[keys.preV7]),tamperedEnvelope=JSON.parse(tamperedStageSlots[keys.staging]);delete tamperedStageSlots[keys.active];tamperedPreV7.gold+=777;tamperedStageSlots[keys.preV7]=JSON.stringify(tamperedPreV7);tamperedEnvelope.state.gold+=777;tamperedEnvelope.state.saveMeta.appliedMigrations.find(receipt=>receipt.id==='schema-6-to-7').checkpointLineage.preV7RawIdentity=rawIdentity(tamperedStageSlots[keys.preV7]);tamperedStageSlots[keys.staging]=evaluate(generator,`JSON.stringify(__P6__.stagingEnvelope(${JSON.stringify(tamperedEnvelope.state)},${JSON.stringify(origins[5])},'schema-5-migration'))`);const tamperedMissingStage=runRealm({initialSlots:tamperedStageSlots});
check('missing-active-stage-tampered-pre-v7-blocked',internal(tamperedMissingStage,'runtime().blocked.kind')==='staging-provenance');
check('missing-active-stage-tampered-pre-v7-zero-write',writes(tamperedMissingStage)===0&&snapshot(tamperedMissingStage)[keys.preV7]===tamperedStageSlots[keys.preV7]&&snapshot(tamperedMissingStage)[keys.staging]===tamperedStageSlots[keys.staging]);
const collisionState=JSON.parse(historicalBuilt.v6raw);collisionState.companionMastery={points:0};const collisionStage=evaluate(generator,`JSON.stringify(__P6__.stagingEnvelope(${JSON.stringify(collisionState)},${JSON.stringify(historicalBuilt.v5raw)},'schema-5-migration'))`),pendingCollision=runRealm({...freshOptions,activeRaw:historicalBuilt.v5raw,stagingRaw:collisionStage}),committedCollision=runRealm({...freshOptions,activeRaw:JSON.stringify(collisionState),stagingRaw:collisionStage});
check('historical-pending-reserved-collision-zero-write',internal(pendingCollision,'runtime().blocked.kind')==='staging-provenance'&&writes(pendingCollision)===0&&pendingCollision.slots.get(keys.staging)===collisionStage);
check('historical-committed-reserved-collision-zero-write',internal(committedCollision,'runtime().blocked.kind')==='schema-7-reserved-collision'&&writes(committedCollision)===0&&committedCollision.slots.get(keys.staging)===collisionStage);

const forgedStage=evaluate(generator,"(()=>{const state=__P6__.prepareFresh();state.gold++;return JSON.stringify(__P6__.stagingEnvelope(state,null,'fresh'))})()"),forged=runRealm({...freshOptions,stagingRaw:forgedStage});
check('forged-fresh-stage-blocked',internal(forged,'runtime().blocked.kind')==='staging-provenance');
check('forged-fresh-stage-zero-write',writes(forged)===0&&forged.slots.get(keys.staging)===forgedStage&&activeRaw(forged)===null);

const migrationFaultSteps=['pre-v7-backup-read','pre-v7-backup-read-verify','pre-v7-backup-write','pre-v7-backup-verify','staging-new-owner','staging-write','staging-verify','active-conflict-check','active-write','active-verify','staging-cleanup-owner','staging-cleanup','staging-cleanup-verify'];
for(const step of migrationFaultSteps){
  const run=runRealm({...freshOptions,activeRaw:origins[6],...origins.v6Slots,fault:{enabled:true,operation:step==='staging-cleanup'?'removeItem':step.includes('write')?'setItem':'getItem',step}}),firstSlots=snapshot(run);run.fault.enabled=false;internal(run,'reload()');const recovered=active(run),afterReload=runRealm({initialSlots:Object.fromEntries(run.slots)});
  check(`migration-fault-${step}-retry`,recovered?.schemaVersion===7&&valid(run).ok&&valid(afterReload).ok,internal(run,'runtime().blocked')?.message??'');
  check(`migration-fault-${step}-once`,recovered?.saveMeta.appliedMigrations.filter(receipt=>receipt.id==='schema-6-to-7').length===1);
  check(`migration-fault-${step}-checkpoint`,run.slots.get(keys.preV7)===origins[6]||firstSlots[keys.preV7]===null);
}

const later=runRealm({...freshOptions,activeRaw:origins[5],preV5BackupRaw:origins[4],fault:{enabled:true,operation:'getItem',step:'staging-new-owner'}}),laterCheckpoint=later.slots.get(keys.preV7);later.clock.value+=86400000;later.fault.enabled=false;internal(later,'reload()');
check('later-clock-reuses-pre-v7',typeof laterCheckpoint==='string'&&later.slots.get(keys.preV7)===laterCheckpoint&&active(later)?.schemaVersion===7&&valid(later).ok);

const disabledFeatures={fellowCampaign:false,companionCampaign:false,companionTower:false,story:false,tower:false,trading:false,patrol:false,operations:false},disabled=runRealm({...freshOptions,features:disabledFeatures}),disabledRaw=activeRaw(disabled),disabledWrites=writes(disabled),disabledRuntime=internal(disabled,'runtime()'),disabledToast=disabled.nodes['#toast'].innerHTML,disabledOverlay=disabled.nodes['#overlay'].innerHTML;
const disabledResults=[internal(disabled,"fellowRun('broken-roads-1',{confirmed:true,present:false})"),internal(disabled,"companionRun('companion-trail-1',{confirmed:true,present:false})"),internal(disabled,'towerClear({present:false})'),internal(disabled,'towerClaim({present:false})')];
check('all-disabled-pure-noop',disabledResults.every(value=>value===false)&&activeRaw(disabled)===disabledRaw&&writes(disabled)===disabledWrites&&JSON.stringify(internal(disabled,'runtime()'))===JSON.stringify(disabledRuntime)&&disabled.nodes['#toast'].innerHTML===disabledToast&&disabled.nodes['#overlay'].innerHTML===disabledOverlay);
check('all-disabled-no-native-storage',disabled.nativeCalls.length===0);
const encoded=runRealm({...freshOptions,search:'?q%61=1'});check('encoded-query-bridge-off',evaluate(encoded,'typeof __EVERSTEAD_QA__')==='undefined');
const noGrant=runRealm({...freshOptions,qa:{allowDestructive:false,isolatedStorage:true}});check('qa-destructive-grant-required',evaluate(noGrant,'__EVERSTEAD_QA__.act("companion-tower-clear",{}).ok')===false);

const successorRows=rows.filter(row=>row.id.startsWith('fresh-')||row.id.startsWith('shared-coordinator-preserves-fellow')||row.id.startsWith('migration-v6-')||row.id.startsWith('all-disabled')||row.id==='artifact-source');
const selected=process.argv.includes('--successor')?successorRows:rows;
const passed=selected.filter(row=>row.pass).length;
for(const row of selected)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` :: ${row.detail}`:''}`);
console.log(`RESULT ${passed}/${selected.length}`);
console.log(`ARTIFACT_SHA256 ${sha256(htmlBytes)}`);
if(passed!==selected.length)process.exitCode=1;
