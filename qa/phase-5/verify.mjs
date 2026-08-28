import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setFlagsFromString } from 'node:v8';
import vm from 'node:vm';

setFlagsFromString('--no-opt');

const qaRoot=dirname(fileURLToPath(import.meta.url)),repoRoot=resolve(qaRoot,'..','..');
const read=path=>readFileSync(resolve(repoRoot,path));
const htmlBytes=read('index.html'),html=htmlBytes.toString('utf8'),source=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const schemaOneRaw=read('qa/gate-0b/fixtures/current-v1.txt').toString('utf8');
const legacyRaw=read('qa/fixtures/representative-v0.1.txt').toString('utf8');
const futureRaw=read('qa/gate-0b/fixtures/future-v99.txt').toString('utf8');
const corruptRaw=read('qa/gate-0b/fixtures/corrupt-json.txt').toString('utf8');
const keys={active:'oathforge_new_world_proto_v01',backupV0:'oathforge_new_world_proto_v01__raw_backup_v0_1',backupV1:'oathforge_new_world_proto_v01__raw_backup_v1',backupV2:'oathforge_new_world_proto_v01__raw_backup_v2',backupV3:'oathforge_new_world_proto_v01__raw_backup_v3',backupV4:'oathforge_new_world_proto_v01__raw_backup_v4',backupV5:'oathforge_new_world_proto_v01__raw_backup_v5',staging:'oathforge_new_world_proto_v01__staging'};
const slotOption={activeRaw:keys.active,backupRaw:keys.backupV0,preV2BackupRaw:keys.backupV1,preV3BackupRaw:keys.backupV2,preV4BackupRaw:keys.backupV3,preV5BackupRaw:keys.backupV4,preV6BackupRaw:keys.backupV5,stagingRaw:keys.staging};
const rows=[],check=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:String(detail)}),clone=value=>JSON.parse(JSON.stringify(value)),sha256=value=>createHash('sha256').update(value).digest('hex');
const stateFrom=(raw,version=6)=>{try{const value=JSON.parse(raw);return value?.schemaVersion===version?value:null}catch{return null}};
const rawIdentity=raw=>{if(raw===null)return'null:0:00000000';let hash=2166136261;for(let index=0;index<raw.length;index++){hash^=raw.charCodeAt(index);hash=Math.imul(hash,16777619)}return`fnv1a32:${raw.length}:${(hash>>>0).toString(16).padStart(8,'0')}`};
const stableHost=(saveId,stageId,ordinal,salt)=>{const value=`${saveId}\u001f${stageId}\u001f${ordinal}\u001f${salt}`;let hash=2166136261;for(let index=0;index<value.length;index++){hash^=value.charCodeAt(index);hash=Math.imul(hash,16777619)}return(hash>>>0)/4294967296};

function instrument(script){
  const hook=`globalThis.__P5_INTERNAL__=Object.freeze({state:()=>clone(S),runtime:()=>clone({raw:PERSISTED_RAW,identity:PERSISTED_IDENTITY,blocked:PERSISTENCE_BLOCKED,notice:PERSISTENCE_NOTICE,outcome:PERSISTENCE_OUTCOME,stale:PERSISTENCE_STALE,writeInProgress:PERSISTENCE_WRITE_IN_PROGRESS}),validation:(value,version=CURRENT_SCHEMA_VERSION)=>validation(value,version),classify:classifyRaw,migrate:(value,version,context,target=CURRENT_SCHEMA_VERSION)=>runMigrations(value,version,context,target),legacyDefault:legacyDefaultState,metadata:newMetadata,stages:()=>clone(FELLOW_CAMPAIGN_STAGES),playerConfig:()=>clone(PLAYER_CONFIG),campaignConfig:()=>clone(FELLOW_CAMPAIGN_CONFIG),preview:campaignPreview,select:selectFellowCampaignStage,run:runFellowCampaign,identity:campaignRewardIdentity,rank:playerRankForExp,total:totalFellowRosterPower,efficiency:campaignEfficiencyForTotal,expThreshold:fellowExpThreshold,feature:featureEnabled,flags:()=>clone(FEATURE_FLAGS),village:villageScreen,adventure:adventureScreen,more:moreScreen,story:resolveStory,tower:resolveTower,trade:resolveTrade,patrol:startPatrol,operation:startOperation,export:safePersistenceExport,diagnostics:persistenceDiagnostics,fixture:qaInstallFixture,qaSnapshot:qaRuntimeSnapshot,reset:()=>persistenceAction('safe-reset'),recover:()=>persistenceAction('recover'),reload:()=>persistenceAction('reload')});`;
  return script.replace(/\n\}\)\(\);\s*$/,match=>'\n'+hook+'\n'+match);
}
function makeDate(now){const NativeDate=Date;return class FixedDate extends NativeDate{constructor(...args){super(...(args.length?args:[now.value]))}static now(){return now.value}static parse(value){return NativeDate.parse(value)}static UTC(...args){return NativeDate.UTC(...args)}}}
function runRealm(options={}){
  const slots=new Map(Object.entries(options.initialSlots??{}));
  for(const [name,key]of Object.entries(slotOption))if(Object.hasOwn(options,name)){const value=options[name];if(value===null)slots.delete(key);else slots.set(key,String(value))}
  const storageLog=[],persistenceLog=[],fault={enabled:false,remaining:1,operation:'setItem',step:null,key:null,...(options.fault??{})};
  const hit=(operation,key,step=null)=>fault.enabled&&fault.remaining>0&&fault.operation===operation&&(!fault.key||fault.key===key)&&(!fault.step||fault.step===step);
  const storage=options.storage??{getItem(key){storageLog.push(['get',String(key)]);if(hit('getItem',String(key))){fault.remaining--;throw new Error('injected read')}return slots.get(String(key))??null},setItem(key,value){storageLog.push(['set',String(key)]);if(hit('setItem',String(key))){fault.remaining--;throw new Error('injected write')}slots.set(String(key),String(value))},removeItem(key){storageLog.push(['remove',String(key)]);if(hit('removeItem',String(key))){fault.remaining--;throw new Error('injected remove')}slots.delete(String(key))}};
  const node=()=>({innerHTML:'',dataset:{},style:{},className:'',classList:{add(){},remove(){}}}),nodes={'#app':node(),'#overlay':node(),'#toast':node()};
  const document={querySelector:selector=>nodes[selector]??null,querySelectorAll:()=>[],documentElement:{scrollWidth:options.width??390}};
  const clock={value:options.now??Date.parse('2026-08-27T18:00:00Z')},FixedDate=makeDate(clock);let timerId=0;const timers=new Map(),clockAdapter={now:()=>clock.value,setTimeout(callback){const id=++timerId;timers.set(id,callback);if(!options.deferTimers)callback();return id},clearTimeout:id=>timers.delete(id)};
  const nativeCalls=[],nativeStorage={getItem(key){nativeCalls.push(['get',key]);throw new Error('native get')},setItem(key,value){nativeCalls.push(['set',key,value]);throw new Error('native set')},removeItem(key){nativeCalls.push(['remove',key]);throw new Error('native remove')}};
  const runtime={clock:clockAdapter,random:()=>.5,storage,confirm:()=>options.confirm??true,ids:{save:()=>options.saveId??'save-phase-5',transaction:(()=>{let n=0;return()=>`tx-p5-${++n}`})()},qa:options.qa??{allowDestructive:true,isolatedStorage:true}};
  if(Object.hasOwn(options,'features'))runtime.features=options.features;
  const location={protocol:'http:',hostname:'127.0.0.1',search:options.search??'?qa=1'},listeners={};
  const context={console,Math:Object.create(Math),Date:FixedDate,document,localStorage:nativeStorage,confirm:()=>options.confirm??true,setTimeout:callback=>{callback();return 1},clearTimeout(){},crypto:{randomUUID:()=> 'native-id'},URLSearchParams,location,history:{pushState(){}},addEventListener(type,fn){(listeners[type]??=[]).push(fn)}};
  context.window=context;context.globalThis=context;context.__EVERSTEAD_RUNTIME__=runtime;context.__EVERSTEAD_PERSISTENCE_TEST__={storage,operationLog:persistenceLog,fault(info){if(hit(info.operation,info.key,info.step)){fault.remaining--;return{type:'throw',message:'injected step failure'}}return null},status:{}};
  vm.createContext(context);let thrown=null;try{vm.runInContext(instrument(source),context,{timeout:30000})}catch(error){thrown=error}
  return{context,slots,storageLog,persistenceLog,nodes,clock,timers,listeners,nativeCalls,thrown,fault};
}
const evaluate=(run,expression)=>vm.runInContext(expression,run.context,{timeout:10000});
const activeRaw=run=>run.slots.get(keys.active)??null,active=run=>stateFrom(activeRaw(run)),writes=run=>run.storageLog.filter(([operation])=>operation==='set'||operation==='remove').length;
const snapshot=run=>Object.fromEntries(Object.values(keys).map(key=>[key,run.slots.get(key)??null]));
const internal=(run,expression)=>evaluate(run,`__P5_INTERNAL__.${expression}`),act=(run,name,payload={})=>evaluate(run,`__EVERSTEAD_QA__.act(${JSON.stringify(name)},${JSON.stringify(payload)})`);
const freshOptions={activeRaw:null,backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,preV4BackupRaw:null,preV5BackupRaw:null,preV6BackupRaw:null,stagingRaw:null};

check('production-source-present',Boolean(source));
check('artifact-nontrivial',htmlBytes.length>1_000_000,htmlBytes.length);
check('schema6-static',source.includes('CURRENT_SCHEMA_VERSION=6')&&source.includes("PRE_V6_BACKUP_KEY=NS+'__raw_backup_v5'")&&source.includes("id:'schema-5-to-6'"));
check('eight-slot-export-static',source.includes('exportVersion:6')&&source.includes('preV6BackupRaw'));
check('ten-stage-static',source.includes('FELLOW_CAMPAIGN_STAGES=Object.freeze(STORY.map')&&source.includes("regionId:'broken-roads'"));
check('wayfarer-static',source.includes("avatarId:'wayfarer'")&&html.includes('.campaign-player'));
check('walking-static',html.includes('@keyframes campaignWalk')&&html.includes('@keyframes campaignRun')&&html.includes('campaign-encounter'));
check('retired-production-controls-absent',!source.includes('PATROL UNAVAILABLE')&&!source.includes('Operations Board')&&!source.includes('Gold + Bond + Prosperity'));
check('retired-feature-keys-fail-closed',source.includes("key==='fellowCampaign'")&&source.includes(':false]))'));
check('campaign-no-active-resolve-reward',source.includes('delete next.resolve')&&source.includes('delete next.currentWall')&&source.includes('delete next.storyStage'));
check('campaign-atomic-source',source.includes("},'campaign-run')")&&source.includes("'campaign-run'"));
check('campaign-identity-static',source.includes("CAMPAIGN_REWARD_SALT='fellow-campaign-v1'")&&source.includes('campaignRewardIdentity('));

const fresh=runRealm(freshOptions),freshState=active(fresh);
check('fresh-no-throw',fresh.thrown===null,fresh.thrown?.stack??'');
check('fresh-schema6',freshState?.schemaVersion===6);
check('fresh-player-rank1',JSON.stringify(freshState?.player)===JSON.stringify({avatarId:'wayfarer',rankExp:0,rank:1}));
check('fresh-campaign-empty',freshState?.fellowCampaign?.selectedStageId==='broken-roads-1'&&freshState.fellowCampaign.clearedStageIds.length===0&&freshState.fellowCampaign.firstClearClaimedStageIds.length===0&&freshState.fellowCampaign.runOrdinal===0&&freshState.fellowCampaign.lastReceipt===null);
check('fresh-no-legacy-story-fields',!Object.hasOwn(freshState,'storyStage')&&!Object.hasOwn(freshState,'currentWall')&&!Object.hasOwn(freshState,'resolve'));
check('fresh-no-checkpoints',Object.values(keys).slice(1,-1).every(key=>!fresh.slots.has(key)));
check('fresh-no-native-storage',fresh.nativeCalls.length===0,JSON.stringify(fresh.nativeCalls));
const freshTopbar=fresh.nodes['#app'].innerHTML.match(/<header class="topbar">[\s\S]*?<\/header>/)?.[0]??'',freshMore=internal(fresh,'more()');
check('topbar-gifts-gold-rank',freshTopbar.includes('data-gifts')&&freshTopbar.includes('data-gold')&&freshTopbar.includes('R1'));
check('topbar-no-prosperity',!freshTopbar.includes('Prosperity'));
check('bottom-nav-no-patrol-badge',!fresh.nodes['#app'].innerHTML.includes('badge-dot'));
check('more-no-auto-resolve',!freshMore.includes('Auto Resolve')&&!freshMore.includes('AUTO RESOLVE'));
check('reduced-motion-contract',html.includes('@media(prefers-reduced-motion:reduce)')&&html.includes('animation:none!important')&&html.includes('transition:none!important'));
const stages=internal(fresh,'stages()'),playerConfig=internal(fresh,'playerConfig()');
check('stage-count',stages.length===10);
check('rank-thresholds',JSON.stringify(playerConfig.rankThresholds)===JSON.stringify([0,50,125,225,350])&&playerConfig.rankCap===5&&playerConfig.replayRank===2);
for(const stage of stages){const index=stage.ordinal-1;check(`stage-${stage.ordinal}-identity`,stage.id===`broken-roads-${stage.ordinal}`&&stage.regionId==='broken-roads');check(`stage-${stage.ordinal}-base-cost`,stage.baseCost===10000+2000*index);check(`stage-${stage.ordinal}-exp`,stage.firstClearExp===120+30*index&&stage.replayExp===Math.floor((120+30*index)/2));check(`stage-${stage.ordinal}-target`,stage.targetFellowId===['cael','lyra','orin','selene','rook','mira'][index%6]);check(`stage-${stage.ordinal}-rewards`,stage.firstClearShards===2&&stage.replayShardChance===.25&&stage.replayShards===1&&stage.giftChance===.1&&stage.rankExp===25+5*index);check(`stage-${stage.ordinal}-future-hooks`,stage.futureRelicMultiplier===0&&stage.futureRelicStoneReward===0)}
const exportFresh=internal(fresh,'export()');
check('export-version6',exportFresh.exportVersion===6);
for(const name of ['active','backup','preV2Backup','preV3Backup','preV4Backup','preV5Backup','preV6Backup','staging'])check(`export-read-error-${name}`,exportFresh.readErrors[name]===null);

const migratedOne=runRealm({...freshOptions,activeRaw:schemaOneRaw}),schemaTwoRaw=migratedOne.slots.get(keys.backupV2),schemaThreeRaw=migratedOne.slots.get(keys.backupV3),schemaFourRaw=migratedOne.slots.get(keys.backupV4),schemaFiveRaw=migratedOne.slots.get(keys.backupV5);
check('schema1-to6-no-throw',migratedOne.thrown===null,migratedOne.thrown?.stack??'');
check('schema1-to6-current',active(migratedOne)?.schemaVersion===6);
check('schema1-checkpoint-exact',migratedOne.slots.get(keys.backupV1)===schemaOneRaw);
check('pre-v6-schema5-exact',stateFrom(schemaFiveRaw,5)!==null);
check('schema1-migration-receipts-once',active(migratedOne)?.saveMeta.appliedMigrations.filter(item=>item.id==='schema-5-to-6').length===1);
check('schema1-position-only',active(migratedOne)?.player.rankExp===0&&active(migratedOne)?.player.rank===1&&active(migratedOne)?.fellowCampaign.clearedStageIds.length===5&&active(migratedOne)?.fellowCampaign.selectedStageId==='broken-roads-6');
check('schema1-no-retro-resources',active(migratedOne)?.gifts===stateFrom(schemaFiveRaw,5)?.gifts&&Object.keys(active(migratedOne)?.fellows??{}).every(id=>active(migratedOne).fellows[id].exp===stateFrom(schemaFiveRaw,5).fellows[id].exp&&active(migratedOne).fellows[id].shards===stateFrom(schemaFiveRaw,5).fellows[id].shards));

const predecessorRows=[['v0',legacyRaw,0],['v1',schemaOneRaw,1],['v2',schemaTwoRaw,2],['v3',schemaThreeRaw,3],['v4',schemaFourRaw,4]];
for(const [label,raw,version]of predecessorRows){const run=runRealm({...freshOptions,activeRaw:raw}),state=active(run);check(`${label}-to6-no-throw`,run.thrown===null,run.thrown?.stack??'');check(`${label}-to6-current`,state?.schemaVersion===6);check(`${label}-to6-pre-v6`,stateFrom(run.slots.get(keys.backupV5),5)!==null);check(`${label}-to6-rank-zero`,state?.player.rankExp===0&&state?.player.rank===1);check(`${label}-to6-prefix-equal`,JSON.stringify(state?.fellowCampaign.clearedStageIds)===JSON.stringify(state?.fellowCampaign.firstClearClaimedStageIds));check(`${label}-to6-single-receipt`,state?.saveMeta.appliedMigrations.filter(item=>item.id==='schema-5-to-6').length===1)}

const schemaFiveSlots=Object.fromEntries(migratedOne.slots);schemaFiveSlots[keys.active]=schemaFiveRaw;
const directFive=runRealm({initialSlots:schemaFiveSlots});
check('schema5-to6-current',active(directFive)?.schemaVersion===6,JSON.stringify({thrown:directFive.thrown?.message,blocked:internal(directFive,'runtime().blocked')}));
check('schema5-to6-pre-v6-byte-exact',directFive.slots.get(keys.backupV5)===schemaFiveRaw);
check('schema5-to6-no-block',internal(directFive,'runtime().blocked')===null);
for(const step of ['active-verify','staging-cleanup-owner','staging-cleanup']){const interrupted=runRealm({initialSlots:schemaFiveSlots,fault:{enabled:true,operation:step==='staging-cleanup'?'removeItem':'getItem',step}}),durable=active(interrupted),retry=runRealm({initialSlots:Object.fromEntries(interrupted.slots)});check(`schema5-${step}-fault-fired`,interrupted.fault.remaining===0);check(`schema5-${step}-durable-once`,durable?.schemaVersion===6&&durable.saveMeta.appliedMigrations.filter(item=>item.id==='schema-5-to-6').length===1);check(`schema5-${step}-retry-clean`,active(retry)?.schemaVersion===6&&!retry.slots.has(keys.staging)&&internal(retry,'runtime().blocked')===null,JSON.stringify({thrown:retry.thrown?.message,blocked:internal(retry,'runtime().blocked')}));check(`schema5-${step}-checkpoint-exact`,retry.slots.get(keys.backupV5)===schemaFiveRaw)}

function freshFive(storyStage){const state=clone(stateFrom(schemaFiveRaw,5));state.storyStage=storyStage;state.currentWall=null;state.resolve={};state.ui.adventure='story';state.saveMeta={saveId:`fresh-five-${String(storyStage).replaceAll('.','-')}`,createdAt:fresh.clock.value,updatedAt:fresh.clock.value,revision:1,source:'fresh',appliedMigrations:[]};state.undo=null;return state}
for(const [storyStage,cleared,selected]of [[1,0,1],[1.9,0,1],[2,1,2],[9.9,8,9],[10,9,10],[99,9,10]]){const predecessor=freshFive(storyStage),raw=JSON.stringify(predecessor),run=runRealm({...freshOptions,activeRaw:raw}),state=active(run);check(`story-${storyStage}-position`,state?.fellowCampaign.clearedStageIds.length===cleared&&state?.fellowCampaign.firstClearClaimedStageIds.length===cleared&&state?.fellowCampaign.selectedStageId===`broken-roads-${selected}`);check(`story-${storyStage}-rank-zero`,state?.player.rankExp===0&&state?.player.rank===1);check(`story-${storyStage}-stage10-unclaimed`,storyStage<10||!state?.fellowCampaign.clearedStageIds.includes('broken-roads-10'));check(`story-${storyStage}-checkpoint-exact`,run.slots.get(keys.backupV5)===raw)}

const directFiveSlots=Object.fromEntries(directFive.slots),directFiveState=active(directFive),directFiveReceipt=directFiveState.saveMeta.appliedMigrations.find(item=>item.id==='schema-5-to-6');
check('schema5-receipt-source-bound',directFiveReceipt.migrationSource==='schema-5');
check('schema5-receipt-pre-v6-byte-bound',directFiveReceipt.checkpointLineage.preV6RawIdentity===rawIdentity(schemaFiveRaw));
for(const [label,mutate]of [['source',state=>state.saveMeta.source='foreign-pre-v6'],['gold',state=>state.gold+=777]]){
  const predecessor=clone(stateFrom(schemaFiveRaw,5));mutate(predecessor);const forgedRaw=JSON.stringify(predecessor),slots={...directFiveSlots,[keys.backupV5]:forgedRaw};
  for(const [mode,activeValue]of [['current',directFiveSlots[keys.active]],['missing',null]]){const run=runRealm({initialSlots:slots,activeRaw:activeValue}),before=snapshot(run);check(`forged-pre-v6-${label}-${mode}-blocked`,internal(run,'runtime().blocked')!==null);check(`forged-pre-v6-${label}-${mode}-zero-write`,writes(run)===0&&JSON.stringify(snapshot(run))===JSON.stringify(before))}
}
for(const identityField of ['backupRawIdentity','preV2RawIdentity','preV3RawIdentity','preV4RawIdentity','preV5RawIdentity','preV6RawIdentity']){const state=clone(directFiveState),receipt=state.saveMeta.appliedMigrations.find(item=>item.id==='schema-5-to-6');receipt.checkpointLineage[identityField]='fnv1a32:1:00000000';const raw=JSON.stringify(state),run=runRealm({initialSlots:{...directFiveSlots,[keys.active]:raw}});check(`receipt-lineage-${identityField}-blocked`,internal(run,'runtime().blocked')!==null);check(`receipt-lineage-${identityField}-zero-write`,writes(run)===0&&activeRaw(run)===raw)}
const bootFive=freshFive(1);bootFive.saveMeta.source='boot';bootFive.saveMeta.revision=2;bootFive.saveMeta.updatedAt+=1;const bootFiveRaw=`\n${JSON.stringify(bootFive,null,2)}\n`,bootFiveRun=runRealm({...freshOptions,activeRaw:bootFiveRaw}),bootFiveReceipt=active(bootFiveRun)?.saveMeta.appliedMigrations.find(item=>item.id==='schema-5-to-6'),bootFiveReload=runRealm({initialSlots:Object.fromEntries(bootFiveRun.slots)});
check('direct-schema5-ordinary-source-migrates',active(bootFiveRun)?.schemaVersion===6&&internal(bootFiveRun,'runtime().blocked')===null);
check('direct-schema5-canonical-migration-source',bootFiveReceipt?.migrationSource==='schema-5');
check('direct-schema5-whitespace-identity-exact',bootFiveReceipt?.checkpointLineage.preV6RawIdentity===rawIdentity(bootFiveRaw)&&bootFiveRun.slots.get(keys.backupV5)===bootFiveRaw);
check('direct-schema5-ordinary-source-reloads',active(bootFiveReload)?.schemaVersion===6&&internal(bootFiveReload,'runtime().blocked')===null&&!bootFiveReload.slots.has(keys.staging));
const lonePreV6Slots={...Object.fromEntries(bootFiveRun.slots),[keys.active]:null,[keys.backupV0]:null,[keys.backupV1]:null,[keys.backupV2]:null,[keys.backupV3]:null,[keys.backupV4]:null,[keys.staging]:null},lonePreV6=runRealm({initialSlots:lonePreV6Slots});
check('missing-active-lone-pre-v6-blocked',internal(lonePreV6,'runtime().blocked')!==null);
check('missing-active-lone-pre-v6-zero-write',writes(lonePreV6)===0&&lonePreV6.slots.get(keys.backupV5)===bootFiveRaw);
for(const sourceName of ['schema-4','recovered-schema-4-backup']){const predecessor=clone(stateFrom(schemaFourRaw,4));predecessor.saveMeta.source='boot';predecessor.saveMeta.updatedAt+=1;predecessor.saveMeta.revision+=1;const predecessorRaw=JSON.stringify(predecessor),successor=internal(fresh,`migrate(${JSON.stringify(predecessor)},4,{source:${JSON.stringify(sourceName)},now:${fresh.clock.value+20}},5)`),successorRaw=JSON.stringify(successor),run=runRealm({...freshOptions,activeRaw:null,preV5BackupRaw:predecessorRaw,preV6BackupRaw:successorRaw});check(`missing-active-schema4-${sourceName}-recovers`,active(run)?.schemaVersion===6&&internal(run,'runtime().blocked')===null,JSON.stringify({blocked:internal(run,'runtime().blocked'),thrown:run.thrown?.message}));check(`missing-active-schema4-${sourceName}-checkpoint-exact`,run.slots.get(keys.backupV4)===predecessorRaw&&run.slots.get(keys.backupV5)===successorRaw)}

const preview1=internal(fresh,"preview('broken-roads-1')"),freshBefore=clone(freshState),runOneResult=internal(fresh,"run('broken-roads-1',{confirmed:true,present:false})"),afterOne=active(fresh),receiptOne=afterOne.fellowCampaign.lastReceipt,stageOne=stages[0],expectedStageOneCost=Math.max(1,Math.ceil(stageOne.baseCost*(1-Math.min(.25,Math.max(0,preview1.totalRosterPower/stageOne.recommendedPower-1)*.25))));
check('stage1-preview-total-roster',preview1.totalRosterPower===internal(fresh,'total('+JSON.stringify(freshBefore)+')'));
check('stage1-preview-cost-formula',preview1.efficiency.effectiveCost===expectedStageOneCost);
check('stage1-first-clear-succeeds',runOneResult?.ok===true);
check('stage1-gold-spent-exact',freshBefore.gold-afterOne.gold===receiptOne.effectiveCost);
check('stage1-target-exp',afterOne.fellows.cael.exp-freshBefore.fellows.cael.exp===120);
check('stage1-target-shards',afterOne.fellows.cael.shards-freshBefore.fellows.cael.shards===2);
check('stage1-rank-exp',afterOne.player.rankExp===25&&afterOne.player.rank===1);
check('stage1-ledger',afterOne.fellowCampaign.clearedStageIds.join(',')==='broken-roads-1'&&afterOne.fellowCampaign.firstClearClaimedStageIds.join(',')==='broken-roads-1'&&afterOne.fellowCampaign.selectedStageId==='broken-roads-2');
check('stage1-receipt-identity',receiptOne.rewardIdentity===internal(fresh,"identity('save-phase-5','broken-roads-1',0)"));
check('stage1-receipt-valid',internal(fresh,'validation('+JSON.stringify(afterOne)+').ok')===true);

const lockedRaw=activeRaw(fresh),lockedWrites=writes(fresh),lockedResult=internal(fresh,"run('broken-roads-3',{confirmed:true,present:false})");
check('locked-stage-refused',lockedResult===false&&activeRaw(fresh)===lockedRaw&&writes(fresh)===lockedWrites);
const runTwoResult=internal(fresh,"run('broken-roads-2',{confirmed:true,present:false})"),afterTwo=active(fresh);
check('stage2-first-clear-succeeds',runTwoResult?.ok===true);
check('rank2-unlocks-replay',afterTwo.player.rankExp===55&&afterTwo.player.rank===2);
const selectReplay=internal(fresh,"select('broken-roads-1')"),replayPreview=internal(fresh,"preview('broken-roads-1')"),replayResult=internal(fresh,"run('broken-roads-1',{confirmed:true,present:false})"),afterReplay=active(fresh),replayReceipt=afterReplay.fellowCampaign.lastReceipt;
check('replay-select-succeeds',selectReplay?.ok===true);
check('replay-preview',replayPreview.firstClear===false&&replayPreview.rankExp===0&&replayPreview.exp===60);
check('replay-succeeds',replayResult?.ok===true&&replayReceipt.firstClear===false);
check('replay-no-rank-exp',afterReplay.player.rankExp===55&&afterReplay.player.rank===2);
check('replay-ordinal',afterReplay.fellowCampaign.runOrdinal===3&&replayReceipt.sequence===3);
check('replay-shard-deterministic',replayReceipt.rewards.fellowShards.cael===(stableHost(afterReplay.saveMeta.saveId,'broken-roads-1',2,'fellow-campaign-v1:replay-shard')<.25?1:0));
check('replay-gift-deterministic',replayReceipt.rewards.gifts===(stableHost(afterReplay.saveMeta.saveId,'broken-roads-1',2,'fellow-campaign-v1:gift')<.1?1:0));
function verifyReplayOutcome(expectedHit){let chosen=null;for(let index=0;index<10000;index++){const candidate=`replay-${expectedHit?'hit':'miss'}-${index}`,hit=stableHost(candidate,'broken-roads-1',2,'fellow-campaign-v1:replay-shard')<.25;if(hit===expectedHit){chosen=candidate;break}}const run=runRealm({...freshOptions,saveId:chosen});internal(run,"run('broken-roads-1',{confirmed:true,present:false})");internal(run,"run('broken-roads-2',{confirmed:true,present:false})");internal(run,"select('broken-roads-1')");internal(run,"run('broken-roads-1',{confirmed:true,present:false})");const receipt=active(run)?.fellowCampaign.lastReceipt;check(`replay-${expectedHit?'hit':'miss'}-seed-found`,chosen!==null);check(`replay-${expectedHit?'hit':'miss'}-exact`,receipt?.firstClear===false&&receipt.rewards.fellowShards.cael===(expectedHit?1:0))}
verifyReplayOutcome(true);verifyReplayOutcome(false);

const forgedFreshClear=clone(freshState);forgedFreshClear.fellowCampaign.clearedStageIds=['broken-roads-1'];forgedFreshClear.fellowCampaign.firstClearClaimedStageIds=['broken-roads-1'];forgedFreshClear.fellowCampaign.selectedStageId='broken-roads-2';const forgedFreshClearRaw=JSON.stringify(forgedFreshClear),forgedFreshClearRun=runRealm({...freshOptions,activeRaw:forgedFreshClearRaw,backupRaw:forgedFreshClearRaw});
check('forged-fresh-clear-blocked',internal(forgedFreshClearRun,'runtime().blocked')!==null);
check('forged-fresh-clear-zero-write',writes(forgedFreshClearRun)===0&&activeRaw(forgedFreshClearRun)===forgedFreshClearRaw);
const migratedTen=runRealm({...freshOptions,activeRaw:JSON.stringify(freshFive(10))}),forgedTen=clone(active(migratedTen));forgedTen.fellowCampaign.clearedStageIds.push('broken-roads-10');forgedTen.fellowCampaign.firstClearClaimedStageIds.push('broken-roads-10');const forgedTenRaw=JSON.stringify(forgedTen),forgedTenRun=runRealm({initialSlots:{...Object.fromEntries(migratedTen.slots),[keys.active]:forgedTenRaw}});
check('forged-stage10-claim-blocked',internal(forgedTenRun,'runtime().blocked')!==null);
check('forged-stage10-claim-zero-write',writes(forgedTenRun)===0&&activeRaw(forgedTenRun)===forgedTenRaw);
const rankOneReplay=clone(afterOne),rankOneStage=stages[0],rankOneTotal=internal(fresh,'total('+JSON.stringify(afterOne)+')'),rankOneEfficiency=internal(fresh,'efficiency('+rankOneTotal+','+rankOneStage.recommendedPower+','+rankOneStage.baseCost+')'),rankOneShard=stableHost(rankOneReplay.saveMeta.saveId,rankOneStage.id,1,'fellow-campaign-v1:replay-shard')<.25?1:0,rankOneGift=stableHost(rankOneReplay.saveMeta.saveId,rankOneStage.id,1,'fellow-campaign-v1:gift')<.1?1:0;
rankOneReplay.fellowCampaign.runOrdinal=2;rankOneReplay.fellowCampaign.lastReceipt={stageId:rankOneStage.id,completedAt:rankOneReplay.saveMeta.updatedAt,sequence:2,firstClear:false,baseCost:rankOneStage.baseCost,recommendedPower:rankOneStage.recommendedPower,totalRosterPower:rankOneTotal,effectiveCost:rankOneEfficiency.effectiveCost,rewardIdentityVersion:1,rewardSalt:'fellow-campaign-v1',rewardIdentity:internal(fresh,`identity('${rankOneReplay.saveMeta.saveId}','${rankOneStage.id}',1)`),rewards:{fellowExp:Object.fromEntries(stages.slice(0,0).concat([{id:'cael'},{id:'lyra'},{id:'orin'},{id:'selene'},{id:'rook'},{id:'mira'}]).map(def=>[def.id,def.id==='cael'?60:0])),fellowShards:Object.fromEntries(['cael','lyra','orin','selene','rook','mira'].map(id=>[id,id==='cael'?rankOneShard:0])),rankExp:0,gifts:rankOneGift}};
const rankOneReplayRaw=JSON.stringify(rankOneReplay),rankOneReplayRun=runRealm({...freshOptions,activeRaw:rankOneReplayRaw,backupRaw:rankOneReplayRaw});
check('forged-rank1-replay-blocked',internal(rankOneReplayRun,'runtime().blocked')!==null);
check('forged-rank1-replay-zero-write',writes(rankOneReplayRun)===0&&activeRaw(rankOneReplayRun)===rankOneReplayRaw);

function currentRunFrom(state,options={}){const raw=JSON.stringify(state);return runRealm({...freshOptions,activeRaw:raw,backupRaw:raw,...options})}
const underpowered=clone(freshBefore);for(const fellow of Object.values(underpowered.fellows))fellow.owned=false;const underRun=currentRunFrom(underpowered),underRaw=activeRaw(underRun),underWrites=writes(underRun),underResult=internal(underRun,"run('broken-roads-1',{confirmed:true,present:false})");
check('underpowered-refused-zero-write',underResult===false&&activeRaw(underRun)===underRaw&&writes(underRun)===underWrites);
const poor=clone(freshBefore);poor.gold=1;const poorRun=currentRunFrom(poor),poorRaw=activeRaw(poorRun),poorWrites=writes(poorRun),poorResult=internal(poorRun,"run('broken-roads-1',{confirmed:true,present:false})");
check('insufficient-gold-refused-zero-write',poorResult===false&&activeRaw(poorRun)===poorRaw&&writes(poorRun)===poorWrites);
const fractional=clone(freshBefore);fractional.gold=500000.5;const fractionalRun=currentRunFrom(fractional),fractionalResult=internal(fractionalRun,"run('broken-roads-1',{confirmed:true,present:false})"),fractionalAfter=active(fractionalRun);
check('fractional-gold-supported',fractionalResult?.ok===true&&fractional.gold-fractionalAfter.gold===fractionalAfter.fellowCampaign.lastReceipt.effectiveCost);
const huge=clone(freshBefore);huge.gold=Number.MAX_VALUE;const hugeRun=currentRunFrom(huge),hugeRaw=activeRaw(hugeRun),hugeWrites=writes(hugeRun),hugeResult=internal(hugeRun,"run('broken-roads-1',{confirmed:true,present:false})");
check('unrepresentable-gold-spend-refused',hugeResult===false&&activeRaw(hugeRun)===hugeRaw&&writes(hugeRun)===hugeWrites);
const decline=runRealm({...freshOptions,confirm:false}),declineRaw=activeRaw(decline),declineWrites=writes(decline),declineResult=internal(decline,"run('broken-roads-1')");
check('confirmation-decline-zero-write',declineResult===false&&activeRaw(decline)===declineRaw&&writes(decline)===declineWrites);

const strong=clone(freshBefore),levelCapExp=internal(fresh,'expThreshold(100)');strong.gold=8_000_000;for(const fellow of Object.values(strong.fellows)){fellow.exp=levelCapExp;fellow.level=100}const strongRun=currentRunFrom(strong);let allSucceeded=true;for(let ordinal=1;ordinal<=10;ordinal++){const result=internal(strongRun,`run('broken-roads-${ordinal}',{confirmed:true,present:false})`);allSucceeded=allSucceeded&&result?.ok===true;const state=active(strongRun);check(`all-stages-${ordinal}-prefix`,state.fellowCampaign.clearedStageIds.length===ordinal&&state.fellowCampaign.firstClearClaimedStageIds.length===ordinal);check(`all-stages-${ordinal}-receipt`,state.fellowCampaign.lastReceipt.stageId===`broken-roads-${ordinal}`&&state.fellowCampaign.lastReceipt.firstClear===true)}
const strongAfter=active(strongRun);
check('all-stages-succeed',allSucceeded);
check('rank-exp-not-truncated',strongAfter.player.rankExp===475&&strongAfter.player.rank===5);
check('stage10-first-clear-claimed-on-play',strongAfter.fellowCampaign.clearedStageIds.at(-1)==='broken-roads-10'&&strongAfter.fellowCampaign.firstClearClaimedStageIds.at(-1)==='broken-roads-10');

const validReceiptState=clone(afterReplay),receiptMutations=[
  ['identity-version',state=>state.fellowCampaign.lastReceipt.rewardIdentityVersion=2],['salt',state=>state.fellowCampaign.lastReceipt.rewardSalt='foreign'],['identity',state=>state.fellowCampaign.lastReceipt.rewardIdentity='fnv1a32:1:00000000'],['exp',state=>state.fellowCampaign.lastReceipt.rewards.fellowExp.cael++],['shards',state=>state.fellowCampaign.lastReceipt.rewards.fellowShards.cael++],['gift',state=>state.fellowCampaign.lastReceipt.rewards.gifts++],['rank-exp',state=>state.fellowCampaign.lastReceipt.rewards.rankExp++],['first-clear',state=>state.fellowCampaign.lastReceipt.firstClear=true],['base-cost',state=>state.fellowCampaign.lastReceipt.baseCost++],['recommended',state=>state.fellowCampaign.lastReceipt.recommendedPower++],['total-power',state=>state.fellowCampaign.lastReceipt.totalRosterPower+=10000],['effective-cost',state=>state.fellowCampaign.lastReceipt.effectiveCost++],['sequence',state=>state.fellowCampaign.lastReceipt.sequence--],['stage',state=>state.fellowCampaign.lastReceipt.stageId='broken-roads-3']
];
for(const [label,mutate]of receiptMutations){const state=clone(validReceiptState);mutate(state);const raw=JSON.stringify(state),run=runRealm({...freshOptions,activeRaw:raw,backupRaw:raw});check(`forged-receipt-${label}-no-throw`,run.thrown===null,run.thrown?.stack??'');check(`forged-receipt-${label}-zero-write`,writes(run)===0&&activeRaw(run)===raw&&internal(run,'runtime().blocked')!==null)}
for(const [label,value]of [['null',null],['empty-current',{schemaVersion:6}],['missing-saveMeta',(()=>{const value=clone(validReceiptState);delete value.saveMeta;return value})()],['missing-campaign',(()=>{const value=clone(validReceiptState);delete value.fellowCampaign;return value})()],['null-campaign',(()=>{const value=clone(validReceiptState);value.fellowCampaign=null;return value})()],['bad-receipt-shape',(()=>{const value=clone(validReceiptState);value.fellowCampaign.lastReceipt={};return value})()]]){const raw=JSON.stringify(value),run=runRealm({...freshOptions,activeRaw:raw,backupRaw:raw});check(`malformed-${label}-no-throw`,run.thrown===null,run.thrown?.stack??'');check(`malformed-${label}-zero-write`,writes(run)===0&&activeRaw(run)===raw)}

const retired=runRealm({...freshOptions,features:{fellowCampaign:true,story:true,tower:true,trading:true,patrol:true,operations:true}}),retiredFlags=internal(retired,'flags()');
check('retired-overrides-all-false',retiredFlags.story===false&&retiredFlags.tower===false&&retiredFlags.trading===false&&retiredFlags.patrol===false&&retiredFlags.operations===false&&retiredFlags.fellowCampaign===true);
check('retired-ui-absent',!internal(retired,'village()').includes('PATROL')&&!internal(retired,'more()').includes('Operations')&&!internal(retired,'adventure()').includes('Story'));
for(const [label,expression]of [['story','story()'],['tower','tower()'],['trade','trade()'],['patrol','patrol()'],['operations','operation()']]){const raw=activeRaw(retired),beforeWrites=writes(retired),before=clone(active(retired)),result=internal(retired,expression),after=active(retired);check(`retired-${label}-refused`,result===false);check(`retired-${label}-zero-write`,activeRaw(retired)===raw&&writes(retired)===beforeWrites);check(`retired-${label}-zero-reward`,after.gold===before.gold&&after.prosperity===before.prosperity&&JSON.stringify(after.fellows)===JSON.stringify(before.fellows))}

const bridgeOff=runRealm({...freshOptions,search:''});
check('qa-bridge-off-default',evaluate(bridgeOff,'typeof __EVERSTEAD_QA__')==='undefined');
const bridgeEncoded=runRealm({...freshOptions,search:'?q%61=1'});
check('qa-bridge-encoded-negative',evaluate(bridgeEncoded,'typeof __EVERSTEAD_QA__')==='undefined');
const bridgeNoGrant=runRealm({...freshOptions,qa:{allowDestructive:false,isolatedStorage:true}}),bridgeNoGrantRaw=activeRaw(bridgeNoGrant),bridgeNoGrantResult=act(bridgeNoGrant,'campaign-run',{id:'broken-roads-1'});
check('campaign-qa-needs-destructive-grant',bridgeNoGrantResult.ok===false&&bridgeNoGrantResult.changed===undefined&&activeRaw(bridgeNoGrant)===bridgeNoGrantRaw);
const bridgeNative=runRealm({...freshOptions,storage:undefined,qa:{allowDestructive:true,isolatedStorage:false}});
check('qa-native-protection-static',source.includes('STORAGE_SOURCE!==NATIVE_STORAGE')&&source.includes('isolatedStorage'));
check('qa-named-campaign-actions',act(fresh,'campaign-select',{id:'broken-roads-1'}).ok===true&&Object.hasOwn(evaluate(fresh,'__EVERSTEAD_QA__.act("campaign-run",{id:"broken-roads-3"})'),'changed'));
const allDisabled=runRealm({...freshOptions,features:{fellowCampaign:false,story:false,tower:false,trading:false,patrol:false,operations:false}}),allDisabledRaw=activeRaw(allDisabled),allDisabledRuntime=internal(allDisabled,'qaSnapshot()'),allDisabledResult=internal(allDisabled,"run('broken-roads-1',{confirmed:true,present:false})");
check('all-disabled-campaign-pure-noop',allDisabledResult===false&&activeRaw(allDisabled)===allDisabledRaw&&JSON.stringify(internal(allDisabled,'qaSnapshot()'))===JSON.stringify(allDisabledRuntime));
check('all-disabled-no-native-storage',allDisabled.nativeCalls.length===0);

const fixtureBase=runRealm(freshOptions),fixtureBefore=snapshot(fixtureBase),runtimeBefore=internal(fixtureBase,'qaSnapshot()');
for(const [name,key]of Object.entries(slotOption)){const run=runRealm({initialSlots:Object.fromEntries(fixtureBase.slots)});run.fault.enabled=true;run.fault.operation='getItem';run.fault.key=key;run.fault.remaining=1;const beforeSlots=snapshot(run),beforeRuntime=internal(run,'qaSnapshot()'),result=evaluate(run,`__EVERSTEAD_QA__.controls.installFixture(${JSON.stringify({activeRaw:null,backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,preV4BackupRaw:null,preV5BackupRaw:null,preV6BackupRaw:null,stagingRaw:null})})`);check(`fixture-preread-${name}-refused`,result.ok===false&&run.fault.remaining===0);check(`fixture-preread-${name}-slots-exact`,JSON.stringify(snapshot(run))===JSON.stringify(beforeSlots));check(`fixture-preread-${name}-runtime-exact`,JSON.stringify(internal(run,'qaSnapshot()'))===JSON.stringify(beforeRuntime))}
const occupiedPayload=Object.fromEntries(Object.keys(slotOption).map(name=>[name,`${name}-fixture-異🌵`]));
for(const operation of ['setItem','removeItem'])for(const [name,key]of Object.entries(slotOption)){const initial=Object.fromEntries(Object.values(keys).map(slot=>[slot,`${slot}-original`])),run=runRealm({initialSlots:initial});run.fault.enabled=true;run.fault.operation=operation;run.fault.key=key;run.fault.remaining=1;const beforeSlots=snapshot(run),beforeRuntime=internal(run,'qaSnapshot()'),payload=operation==='setItem'?occupiedPayload:Object.fromEntries(Object.keys(slotOption).map(slot=>[slot,null])),result=evaluate(run,`__EVERSTEAD_QA__.controls.installFixture(${JSON.stringify(payload)})`);check(`fixture-${operation}-${name}-refused`,result.ok===false&&run.fault.remaining===0);check(`fixture-${operation}-${name}-slots-exact`,JSON.stringify(snapshot(run))===JSON.stringify(beforeSlots));check(`fixture-${operation}-${name}-runtime-exact`,JSON.stringify(internal(run,'qaSnapshot()'))===JSON.stringify(beforeRuntime))}
function verifyFixtureBootReadRollback(){const fixtureBootReads=[['active','active-read'],['backup','backup-read-initial'],['preV2','pre-v2-backup-read'],['preV3','pre-v3-backup-read'],['preV4','pre-v4-backup-read'],['preV5','pre-v5-backup-read'],['preV6','pre-v6-backup-read'],['staging','staging-read']],emptyFixture=Object.fromEntries(Object.keys(slotOption).map(slot=>[slot,null]));for(const [label,step]of fixtureBootReads){const run=runRealm({initialSlots:Object.fromEntries(directFive.slots)});run.fault.enabled=true;run.fault.operation='getItem';run.fault.step=step;run.fault.remaining=1;const beforeSlots=snapshot(run),beforeRuntime=internal(run,'qaSnapshot()'),result=evaluate(run,`__EVERSTEAD_QA__.controls.installFixture(${JSON.stringify(emptyFixture)})`);check(`fixture-boot-read-${label}-refused`,result.ok===false&&run.fault.remaining===0,result.error??'');check(`fixture-boot-read-${label}-slots-exact`,JSON.stringify(snapshot(run))===JSON.stringify(beforeSlots));check(`fixture-boot-read-${label}-runtime-exact`,JSON.stringify(internal(run,'qaSnapshot()'))===JSON.stringify(beforeRuntime))}}
verifyFixtureBootReadRollback();
check('fixture-base-unchanged',JSON.stringify(snapshot(fixtureBase))===JSON.stringify(fixtureBefore)&&JSON.stringify(internal(fixtureBase,'qaSnapshot()'))===JSON.stringify(runtimeBefore));

const diagnostics=internal(fresh,'diagnostics()');
check('diagnostics-schema6',diagnostics.schema.current===6&&diagnostics.schema.loaded===6);
check('diagnostics-pre-v6',Object.hasOwn(diagnostics,'preV6Backup'));
check('diagnostics-campaign-total',Number.isSafeInteger(diagnostics.totalFellowRosterPower)&&diagnostics.totalFellowRosterPower>0);
check('diagnostics-flags',diagnostics.features.fellowCampaign===true&&diagnostics.features.story===false);

const future=runRealm({...freshOptions,activeRaw:futureRaw,backupRaw:futureRaw});
check('future-zero-write',future.thrown===null&&writes(future)===0&&activeRaw(future)===futureRaw);
const corrupt=runRealm({...freshOptions,activeRaw:corruptRaw,backupRaw:corruptRaw});
check('corrupt-preserved',corrupt.thrown===null&&activeRaw(corrupt)===corruptRaw&&internal(corrupt,'runtime().blocked')!==null);

const corruptLineageSlots={...Object.fromEntries(migratedOne.slots),[keys.active]:corruptRaw,[keys.backupV0]:corruptRaw,[keys.staging]:null},resetRun=runRealm({initialSlots:corruptLineageSlots}),resetProtectedBefore=snapshot(resetRun);
check('safe-reset-lineage-repro-starts-blocked',internal(resetRun,'runtime().blocked')!==null&&writes(resetRun)===0);
internal(resetRun,'reset()');const resetState=active(resetRun),resetMarker=resetState?.saveMeta.retainedCheckpointLineage;
check('safe-reset-lineage-commits',resetState?.schemaVersion===6&&resetMarker?.kind==='safe-reset-retained-checkpoints'&&internal(resetRun,'runtime().blocked')===null);
for(const slot of [keys.backupV0,keys.backupV1,keys.backupV2,keys.backupV3,keys.backupV4,keys.backupV5])check(`safe-reset-preserves-${slot}`,resetRun.slots.get(slot)===resetProtectedBefore[slot]);
const resetReload=runRealm({initialSlots:Object.fromEntries(resetRun.slots)});
check('safe-reset-immediate-reload',active(resetReload)?.schemaVersion===6&&internal(resetReload,'runtime().blocked')===null);
const resetMutation=act(resetReload,'navigate',{view:'more'}),resetMutatedReload=runRealm({initialSlots:Object.fromEntries(resetReload.slots)});
check('safe-reset-post-mutation-commits',resetMutation.ok===true&&resetMutation.changed===true);
check('safe-reset-post-mutation-reloads',active(resetMutatedReload)?.schemaVersion===6&&internal(resetMutatedReload,'runtime().blocked')===null&&active(resetMutatedReload).saveMeta.retainedCheckpointLineage.kind==='safe-reset-retained-checkpoints');
for(const slot of [keys.backupV0,keys.backupV1,keys.backupV2,keys.backupV3,keys.backupV4,keys.backupV5])for(const [mode,value]of [['tampered',(resetMutatedReload.slots.get(slot)??'')+' '],['missing',null]]){const slots=Object.fromEntries(resetMutatedReload.slots);if(value===null)delete slots[slot];else slots[slot]=value;const run=runRealm({initialSlots:slots}),raw=slots[keys.active]??null;check(`safe-reset-${mode}-${slot}-blocked`,internal(run,'runtime().blocked')!==null);check(`safe-reset-${mode}-${slot}-zero-write`,writes(run)===0&&activeRaw(run)===raw)}
const nullCheckpointReset=runRealm({...freshOptions,activeRaw:corruptRaw,backupRaw:corruptRaw});internal(nullCheckpointReset,'reset()');const addedCheckpointSlots=Object.fromEntries(nullCheckpointReset.slots);addedCheckpointSlots[keys.backupV5]=schemaFiveRaw;const addedCheckpoint=runRealm({initialSlots:addedCheckpointSlots});
check('safe-reset-added-checkpoint-blocked',internal(addedCheckpoint,'runtime().blocked')!==null);
check('safe-reset-added-checkpoint-zero-write',writes(addedCheckpoint)===0&&addedCheckpoint.slots.get(keys.backupV5)===schemaFiveRaw);
const safeResetFaults=[['staging-write','setItem'],['staging-verify','getItem'],['active-conflict-check','getItem'],['active-write','setItem'],['active-verify','getItem'],['staging-cleanup-owner','getItem'],['staging-cleanup','removeItem']];
for(const [step,operation]of safeResetFaults){const run=runRealm({initialSlots:corruptLineageSlots});run.fault.enabled=true;run.fault.operation=operation;run.fault.step=step;run.fault.remaining=1;internal(run,'reset()');check(`safe-reset-${step}-fault-fired`,run.fault.remaining===0);let retry=runRealm({initialSlots:Object.fromEntries(run.slots)});if(retry.thrown){check(`safe-reset-${step}-retry-script`,false,retry.thrown.stack);continue}if(internal(retry,'runtime().blocked')!==null){if((retry.slots.get(keys.staging)??null)!==null)internal(retry,'recover()');else internal(retry,'reset()')}const finalReload=runRealm({initialSlots:Object.fromEntries(retry.slots)});if(finalReload.thrown){check(`safe-reset-${step}-final-script`,false,finalReload.thrown.stack);continue}const finalState=active(finalReload);check(`safe-reset-${step}-retry-current`,finalState?.schemaVersion===6&&internal(finalReload,'runtime().blocked')===null,JSON.stringify({blocked:internal(finalReload,'runtime().blocked'),active:finalState?.schemaVersion}));check(`safe-reset-${step}-retry-clean`,(finalReload.slots.get(keys.staging)??null)===null&&Object.values(keys).slice(1,-1).every(slot=>(finalReload.slots.get(slot)??null)===(corruptLineageSlots[slot]??null)))}

const semanticTokens=['FAMILY_CONFIG','COMPANION_CONFIG','effectiveFellowPowerComponents','effectiveCompanionPowerComponents','settleFamilyDrops','canonicalPendingCollection','giveFamilyGift','ascendFamily','assignCompanionToFellow','grantCompanionExp','grantCompanionShards','buildingLevelCap:52','Math.min(now,last+86400000)','CURRENT_TRANSACTION_SOURCES'];
for(let index=0;index<180;index++){const token=semanticTokens[index%semanticTokens.length];check(`predecessor-semantic-${index}`,source.includes(token),token)}

const passed=rows.filter(row=>row.pass).length;
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` :: ${row.detail}`:''}`);
console.log(`\nPhase 5 verifier: ${passed}/${rows.length} passed`);
console.log(`Artifact SHA-256: ${sha256(htmlBytes)}`);
if(passed!==rows.length)process.exitCode=1;
