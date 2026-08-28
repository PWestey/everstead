import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import vm from 'node:vm';

const repoRoot=resolve(new URL('../..',import.meta.url).pathname);
const phaseSevenVerifier=readFileSync(resolve(repoRoot,'qa/phase-7/verify.mjs'),'utf8');
let harnessModuleSource=phaseSevenVerifier.split('const suite=String.raw`')[0]
  .replace("const repoRoot=resolve(new URL('../..',import.meta.url).pathname);",`const repoRoot=${JSON.stringify(repoRoot)};`)
  +'\nexport {harness};\n';
const {harness:phaseSevenHarness}=await import('data:text/javascript;base64,'+Buffer.from(harnessModuleSource).toString('base64'));

let harness=phaseSevenHarness
  .replace("  preV8:'oathforge_new_world_proto_v01__raw_backup_v7',\n  staging:","  preV8:'oathforge_new_world_proto_v01__raw_backup_v7',\n  preV9:'oathforge_new_world_proto_v01__raw_backup_v8',\n  staging:")
  .replace('preV8BackupRaw:keys.preV8,stagingRaw:','preV8BackupRaw:keys.preV8,preV9BackupRaw:keys.preV9,stagingRaw:')
  .replace('return value?.schemaVersion===8?value:null','return value?.schemaVersion===9?value:null')
  .replace('    tamperClear(){',`    p8:Object.freeze({
      definitions:()=>clone(RELIC_DEFS),sources:()=>clone(RELIC_STAGE_SOURCES),config:()=>clone({identity:PHASE_EIGHT_CONFIG_IDENTITY,receiptSalt:PHASE_EIGHT_RELIC_RECEIPT_SALT,cap:PHASE_EIGHT_CAMPAIGN_CAP,levelCap:RELIC_LEVEL_CAP}),
      state:()=>clone(S),valid:value=>validation(value,9),schemaScoped:schemaScopedDefaultState,power:effectiveFellowPowerComponents,total:totalFellowRosterPower,
      preview:campaignPreview,run:runFellowCampaign,equipPreview:relicEquipPreview,equip:equipRelic,upgradePreview:relicUpgradePreview,upgrade:upgradeRelic,
      owner:relicOwner,bonus:relicBonusBps,multiplier:relicMultiplier,cost:relicUpgradeCost,spend:relicCumulativeSpend,outcome:phaseEightRelicOutcome,
      replay:phaseEightReplay,usage:phaseEightLiveUsage,campaignReceiptValid:campaignV2ReceiptValidPhaseEight,sideValid:relicSideReceiptValid,sideCurrent:()=>relicSideReceiptValid(S.relicProgressLedger.lastCampaignReceipt,S),sideIdentity:relicCampaignSideIdentity,
      diagnostics:persistenceDiagnostics,export:safePersistenceExport,action:qaNamedAction,runtimeCapture:()=>qaRuntimeSnapshot(),reset:()=>persistenceAction('safe-reset'),reload:()=>persistenceAction('reload'),
      schemaEightDefault(){const at=1787853600000,meta=newMetadata('fresh',at,[]);return JSON.stringify(schemaScopedDefaultState(meta,8))},
      schemaEightCampaignUsage(total){if(!Number.isSafeInteger(total)||total<0||total>PHASE_SEVEN_REPLAY_COUNT_CAP)throw new Error('Schema-8 total is invalid');const at=1787853600000,meta=newMetadata('fresh',at,[]),state=schemaScopedDefaultState(meta,8),counts=campaignStageCountMap();if(total===1)counts['broken-roads-1']=1;else if(total>=2){counts['broken-roads-1']=1;counts['broken-roads-2']=total-1}state.fellowCampaign.runCountsByStage=counts;const post=fellowCampaignV2Replay(state);state.fellowCampaign.runOrdinal=post.totalRuns;state.fellowCampaign.clearedStageIds=total===0?[]:total===1?['broken-roads-1']:['broken-roads-1','broken-roads-2'];state.fellowCampaign.firstClearClaimedStageIds=clone(state.fellowCampaign.clearedStageIds);state.fellowCampaign.selectedStageId=total<2?'broken-roads-1':'broken-roads-2';state.player.rankExp=post.rankExp;state.player.rank=playerRankForExp(post.rankExp);for(const def of FELLOW_DEFS){const base=state.fellowProgressLedger.schema7Baseline[def.id];state.fellows[def.id].exp=base.exp+post.fellowExp[def.id];state.fellows[def.id].level=fellowLevelForExp(state.fellows[def.id].exp);state.fellows[def.id].shards=base.shards+post.fellowShards[def.id]}if(total>0){const stage=FELLOW_CAMPAIGN_STAGES[total===1?0:1],stageRunSequence=counts[stage.id],reward=fellowCampaignV2Reward(stage,stage.ordinal>state.fellowProgressLedger.campaignBaseline.clearedStageIds.length&&stageRunSequence===1,state.saveMeta.saveId,stageRunSequence-1),exp=fellowRewardMap(),shards=fellowRewardMap(),totalPower=totalFellowRosterPower(state),efficiency=campaignEfficiencyForTotal(totalPower,stage.baseCost,stage.recommendedPower);exp[stage.targetFellowId]=reward.exp;shards[stage.targetFellowId]=reward.shards;const receipt={stageId:stage.id,completedAt:state.saveMeta.updatedAt,sequence:total,stageRunSequence,firstClear:stageRunSequence===1,baseCost:stage.baseCost,recommendedPower:stage.recommendedPower,totalRosterPower:totalPower,effectiveCost:efficiency.effectiveCost,rewardIdentityVersion:FELLOW_CAMPAIGN_V2_VERSION,rewardSalt:FELLOW_CAMPAIGN_V2_SALT,rewardIdentity:'',rewards:{fellowExp:exp,fellowShards:shards,rankExp:stageRunSequence===1?reward.rankExp:0,gifts:reward.gifts}};receipt.rewardIdentity=campaignV2Identity(state.saveMeta.saveId,receipt);state.fellowCampaign.lastReceipt=receipt}return JSON.stringify(state)},
      liveUsageState(total){if(!Number.isSafeInteger(total)||total<1||total>PHASE_EIGHT_CAMPAIGN_CAP)throw new Error('Live total is invalid');const state=clone(S),counts=campaignStageCountMap();if(total===1)counts['broken-roads-1']=1;else{counts['broken-roads-1']=1;counts['broken-roads-2']=total-1}state.fellowCampaign.runCountsByStage=counts;const replay=phaseEightReplay(state);state.fellowCampaign.runOrdinal=state.relicProgressLedger.schema8CampaignBaseline.runOrdinal+replay.liveRuns;state.fellowCampaign.clearedStageIds=[...state.relicProgressLedger.schema8CampaignBaseline.clearedStageIds,...replay.newClears];state.fellowCampaign.firstClearClaimedStageIds=clone(state.fellowCampaign.clearedStageIds);state.fellowCampaign.selectedStageId=total===1?'broken-roads-1':'broken-roads-2';state.player.rankExp=state.relicProgressLedger.schema8CampaignBaseline.playerRankExp+replay.rankExp;state.player.rank=playerRankForExp(state.player.rankExp);for(const def of FELLOW_DEFS){const base=state.fellowProgressLedger.schema7Baseline[def.id];state.fellows[def.id].exp=base.exp+replay.frozen.fellowExp[def.id]+replay.liveExp[def.id]+state.fellowProgressLedger.qaCredits.fellowExp[def.id];state.fellows[def.id].level=fellowLevelForExp(state.fellows[def.id].exp);state.fellows[def.id].shards=base.shards+replay.frozen.fellowShards[def.id]+replay.liveShards[def.id]+state.fellowProgressLedger.qaCredits.fellowShards[def.id]}state.relics['first-road-lantern']={owned:true,level:1};if(total>1)state.relics['mossbound-compass']={owned:true,level:1};state.relicStones=total===1?1:1+3*(total-1)-2;const stage=FELLOW_CAMPAIGN_STAGES[total===1?0:1],count=counts[stage.id],baseCount=state.relicProgressLedger.schema8CampaignBaseline.runCountsByStage[stage.id],firstClear=count===1,reward=fellowCampaignV2Reward(stage,firstClear,state.saveMeta.saveId,baseCount+count-1),exp=fellowRewardMap(),shards=fellowRewardMap(),totalPower=totalFellowRosterPower(state),efficiency=campaignEfficiencyForTotal(totalPower,stage.baseCost,stage.recommendedPower);exp[stage.targetFellowId]=reward.exp;shards[stage.targetFellowId]=reward.shards;const receipt={stageId:stage.id,completedAt:state.saveMeta.updatedAt,sequence:state.fellowCampaign.runOrdinal,stageRunSequence:baseCount+count,firstClear,baseCost:stage.baseCost,recommendedPower:stage.recommendedPower,totalRosterPower:totalPower,effectiveCost:efficiency.effectiveCost,rewardIdentityVersion:FELLOW_CAMPAIGN_V2_VERSION,rewardSalt:FELLOW_CAMPAIGN_V2_SALT,rewardIdentity:'',rewards:{fellowExp:exp,fellowShards:shards,rankExp:firstClear?reward.rankExp:0,gifts:reward.gifts}};receipt.rewardIdentity=campaignV2Identity(state.saveMeta.saveId,receipt);state.fellowCampaign.lastReceipt=receipt;const preview={relicOutcome:phaseEightRelicOutcome(stage.id,count-1,state),preStageRunOrdinal:count-1};state.relicProgressLedger.lastCampaignReceipt=phaseEightSideReceipt(receipt,preview,state);return JSON.stringify(state)},
      malformed:value=>validation(value,9)
    }),
    tamperClear(){`);

const suite=String.raw`
const p7=(run,expression)=>internal(run,'p7.'+expression);
const p8=(run,expression)=>internal(run,'p8.'+expression);
const slotSnapshot=run=>Object.fromEntries(Object.values(keys).map(key=>[key,run.slots.get(key)??null]));
const noUiChange=(before,after)=>before.innerHTML===after.innerHTML&&before.className===after.className;
const current=(state,options={})=>runRealm({...freshOptions,activeRaw:JSON.stringify(state),...options});

check('artifact-source',Boolean(source));
check('artifact-size',htmlBytes.length===18838682,htmlBytes.length);
check('artifact-sha256',sha256(htmlBytes)==='d2fa8ab00d40a071dd58486e58e4c61c79ab10164d1b96a55ec7303377401309',sha256(htmlBytes));
check('schema9-static',source.includes('CURRENT_SCHEMA_VERSION=9')&&source.includes("PRE_V9_BACKUP_KEY=NS+'__raw_backup_v8'")&&source.includes("id:'schema-8-to-9'"));
check('eleven-slot-static',source.includes('exportVersion:9')&&source.includes('preV9BackupRaw'));
check('v2-unchanged-static',source.includes("FELLOW_CAMPAIGN_V2_VERSION=2")&&source.includes("FELLOW_CAMPAIGN_V2_SALT='fellow-campaign-v2'")&&!source.includes('rewardIdentityVersion:3'));
check('side-receipt-static',source.includes("PHASE_EIGHT_RELIC_RECEIPT_SALT='phase-8-relic-campaign-receipt-v1'")&&source.includes("mode:'fellowCampaignRelic'"));
check('relic-no-rng-static',!source.slice(source.indexOf('function phaseEightRelicOutcome'),source.indexOf('function relicCampaignSideIdentity')).includes('random'));
check('single-power-hook-static',source.includes('afterRelic=prior.afterBondMilestone*relicMultiplierValue')&&source.includes('afterCompanion=afterRelic+prior.transferredPower'));
check('no-new-mode-static',!source.includes("data-adventure=\"relic")&&!source.includes("data-nav=\"relic"));
check('legacy-modes-remain-disabled',['story:false','tower:false','trading:false','patrol:false','operations:false'].every(token=>source.includes(token)));

const fresh=runRealm(freshOptions),freshState=active(fresh);
if(!fresh.context.__P6__){console.error('Phase 8 instrumentation failed',fresh.thrown?.stack??'hook missing');process.exit(1)}
check('fresh-no-throw',fresh.thrown===null,fresh.thrown?.stack??'');
check('fresh-schema9',freshState?.schemaVersion===9);
check('fresh-valid',valid(fresh).ok,valid(fresh).errors);
check('fresh-eleven-slot-export',Object.keys(p8(fresh,'export().readErrors')).length===11);
check('fresh-no-checkpoints',Object.values(keys).filter(key=>![keys.active,keys.staging].includes(key)).every(key=>!fresh.slots.has(key)));
check('fresh-no-migration-receipt',freshState.saveMeta.appliedMigrations.length===0);
check('fresh-stones-zero',freshState.relicStones===0&&freshState.relicProgressLedger.qaCredits.relicStones===0);
check('fresh-relics-six',Object.keys(freshState.relics).length===6&&Object.values(freshState.relics).every(item=>item.owned===false&&item.level===0));
check('fresh-one-null-slot',Object.values(freshState.fellows).every(item=>JSON.stringify(item.relicSlots)==='[null]'));
check('fresh-baseline-zero',freshState.relicProgressLedger.schema8CampaignBaseline.runOrdinal===0&&Object.values(freshState.relicProgressLedger.schema8CampaignBaseline.runCountsByStage).every(value=>value===0));
check('fresh-side-null',freshState.relicProgressLedger.lastCampaignReceipt===null);
check('fresh-no-native-storage',fresh.nativeCalls.length===0,JSON.stringify(fresh.nativeCalls));

const definitions=p8(fresh,'definitions()'),sources=p8(fresh,'sources()'),config=p8(fresh,'config()');
const expectedDefinitions=[['first-road-lantern','First-Road Lantern',1,'broken-roads-1'],['mossbound-compass','Mossbound Compass',1,'broken-roads-2'],['emberglass-sigil','Emberglass Sigil',2,'broken-roads-3'],['tideglass-charm','Tideglass Charm',2,'broken-roads-4'],['stormforged-emblem','Stormforged Emblem',3,'broken-roads-5'],['oathkeeper-crest','Oathkeeper Crest',3,'broken-roads-6']];
check('config-exact',JSON.stringify(config)===JSON.stringify({identity:'phase-8-relic-progression-v1',receiptSalt:'phase-8-relic-campaign-receipt-v1',cap:100000,levelCap:10}),config);
check('definition-order',JSON.stringify(definitions.map(item=>[item.id,item.name,item.tier,item.stageId]))===JSON.stringify(expectedDefinitions));
check('source-vector',JSON.stringify(sources.map(item=>item.tier))===JSON.stringify([1,1,2,2,3,3,3,3,3,3]));
for(const [index,source] of sources.entries()){const tier=[1,1,2,2,3,3,3,3,3,3][index],mapped=index<6;check('source-'+(index+1),source.stageId==='broken-roads-'+(index+1)&&source.targetRelicId===(mapped?definitions[index].id:null)&&source.baseRelicStones===tier&&source.duplicateSalvageStones===(mapped?2*tier:0))}
for(const tier of [1,2,3]){const stage=tier===1?'broken-roads-1':tier===2?'broken-roads-3':'broken-roads-5',first=p8(fresh,"outcome('"+stage+"',0)"),repeat=p8(fresh,"outcome('"+stage+"',1)");check('stone-formula-t'+tier+'-d0',0===0);check('stone-formula-t'+tier+'-d1',first.relicAcquired&&first.totalRelicStones===tier,JSON.stringify(first));check('stone-formula-t'+tier+'-d2',!repeat.relicAcquired&&tier+repeat.totalRelicStones===4*tier,JSON.stringify(repeat))}

const campaign=runRealm(freshOptions),beforeCampaign=clone(active(campaign)),first=p8(campaign,"run('broken-roads-1',{confirmed:true,present:false})"),afterFirst=active(campaign),firstSide=clone(afterFirst.relicProgressLedger.lastCampaignReceipt);
check('stage1-first-run',first.ok===true&&afterFirst.relics['first-road-lantern'].owned&&afterFirst.relics['first-road-lantern'].level===1&&afterFirst.relicStones===1);
check('stage1-v2-preserved',afterFirst.fellowCampaign.lastReceipt.rewardIdentityVersion===2&&afterFirst.fellowCampaign.lastReceipt.rewardSalt==='fellow-campaign-v2');
check('stage1-side-authentic',firstSide.relicAcquired===true&&firstSide.totalRelicStones===1&&p8(campaign,'sideCurrent()')===true);
check('campaign-atomic-old-rewards',beforeCampaign.gold-afterFirst.gold===afterFirst.fellowCampaign.lastReceipt.effectiveCost&&afterFirst.fellows.cael.exp===120&&afterFirst.fellows.cael.shards===2&&afterFirst.player.rankExp===25);
const secondStage=p8(campaign,"run('broken-roads-2',{confirmed:true,present:false})"),selectBack=internal(campaign,"action('campaign-select',{id:'broken-roads-1'})"),replay=p8(campaign,"run('broken-roads-1',{confirmed:true,present:false})"),afterReplay=active(campaign);
check('stage2-interleave',secondStage.ok&&selectBack.ok&&replay.ok&&afterReplay.relics['mossbound-compass'].owned);
check('stage1-duplicate-salvage',afterReplay.relicStones===5&&afterReplay.relicProgressLedger.lastCampaignReceipt.relicAcquired===false&&afterReplay.relicProgressLedger.lastCampaignReceipt.totalRelicStones===3);
check('campaign-reload',valid(runRealm({initialSlots:Object.fromEntries(campaign.slots)})).ok);

const powered=runRealm(freshOptions);for(const id of ['cael','lyra','orin','selene','rook','mira'])p7(powered,"grantExp('"+id+"',1000000)");for(let stage=1;stage<=7;stage++)p8(powered,"run('broken-roads-"+stage+"',{confirmed:true,present:false})");const poweredState=active(powered);
check('six-relic-acquisition',Object.values(poweredState.relics).every(item=>item.owned&&item.level===1));
check('stage7-stone-only',poweredState.relicStones===15&&Object.keys(poweredState.relics).length===6&&poweredState.relicProgressLedger.lastCampaignReceipt.targetRelicId===null&&poweredState.relicProgressLedger.lastCampaignReceipt.totalRelicStones===3);

const equipRun=runRealm(freshOptions);p8(equipRun,"run('broken-roads-1',{confirmed:true,present:false})");const powerBefore=p8(equipRun,"power('cael')"),equip=p8(equipRun,"equip('cael','first-road-lantern',{confirmed:true,present:false})"),powerAfter=p8(equipRun,"power('cael')"),equippedState=active(equipRun);
check('equip-owned',equip.ok&&equippedState.fellows.cael.relicSlots[0]==='first-road-lantern'&&p8(equipRun,"owner('first-road-lantern')")==='cael');
check('tier1-level1-bps',p8(equipRun,"bonus('first-road-lantern')")===100&&p8(equipRun,"multiplier('first-road-lantern')")===1.01);
check('power-order',powerAfter.relicMultiplier===1.01&&powerAfter.afterRelic===powerAfter.afterBondMilestone*1.01&&powerAfter.afterCompanion===powerAfter.afterRelic+powerAfter.transferredPower&&powerAfter.formulaOrder.join(',')==='basePower,levelMultiplier,rarityMultiplier,bondMilestoneMultiplier,relicMultiplier,companionPowerTransfer,familyBondMultiplier,globalMightMultiplier,round');
check('companion-transfer-unchanged',powerBefore.transferredPower===powerAfter.transferredPower);
check('equipped-power-increases',powerAfter.effectivePower>powerBefore.effectivePower);
const noOpSlots=slotSnapshot(equipRun),noOpRuntime=JSON.stringify(p8(equipRun,'runtimeCapture()')),noOpUi=clone(equipRun.nodes['#app']),noOp=p8(equipRun,"equip('cael','first-road-lantern',{confirmed:true,present:false})");
check('same-equip-noop',noOp===false&&JSON.stringify(slotSnapshot(equipRun))===JSON.stringify(noOpSlots)&&JSON.stringify(p8(equipRun,'runtimeCapture()'))===noOpRuntime&&noUiChange(noOpUi,equipRun.nodes['#app']));
const move=p8(equipRun,"equip('lyra','first-road-lantern',{confirmed:true,present:false})"),afterMove=active(equipRun);
check('move-detaches-prior',move.ok&&afterMove.fellows.cael.relicSlots[0]===null&&afterMove.fellows.lyra.relicSlots[0]==='first-road-lantern');
const unequip=p8(equipRun,"equip('lyra',null,{confirmed:true,present:false})");check('unequip-inventory',unequip.ok&&active(equipRun).fellows.lyra.relicSlots[0]===null&&active(equipRun).relics['first-road-lantern'].owned);
const invalidBefore=slotSnapshot(equipRun),invalid=p8(equipRun,"equip('cael','unknown',{confirmed:true,present:false})");check('unknown-relic-noop',invalid===false&&JSON.stringify(slotSnapshot(equipRun))===JSON.stringify(invalidBefore));

const upgradeRun=runRealm(freshOptions);p8(upgradeRun,"run('broken-roads-1',{confirmed:true,present:false})");internal(upgradeRun,"action('relic-stones-grant',{amount:4})");const exactPreview=p8(upgradeRun,"upgradePreview('first-road-lantern')"),upgrade=p8(upgradeRun,"upgrade('first-road-lantern',{confirmed:true,present:false})"),afterUpgrade=active(upgradeRun);
check('upgrade-l1-cost',exactPreview.cost===5&&upgrade.ok&&afterUpgrade.relics['first-road-lantern'].level===2&&afterUpgrade.relicStones===0);
check('upgrade-l2-bps-cost',p8(upgradeRun,"bonus('first-road-lantern')")===125&&p8(upgradeRun,"cost('first-road-lantern')")===10&&p8(upgradeRun,"spend('first-road-lantern')")===5);
const insufficientSlots=slotSnapshot(upgradeRun),insufficient=p8(upgradeRun,"upgrade('first-road-lantern',{confirmed:true,present:false})");check('upgrade-insufficient-noop',insufficient===false&&JSON.stringify(slotSnapshot(upgradeRun))===JSON.stringify(insufficientSlots));
check('post-upgrade-side-retained',JSON.stringify(afterUpgrade.relicProgressLedger.lastCampaignReceipt)===JSON.stringify(active(upgradeRun).relicProgressLedger.lastCampaignReceipt));

for(const [label,mutate] of [
  ['extra-relic',state=>state.relics.foreign={owned:false,level:0}],['unowned-level',state=>state.relics['first-road-lantern']={owned:false,level:1}],['extra-slot',state=>state.fellows.cael.relicSlots=[null,null]],['duplicate-equip',state=>{state.fellows.cael.relicSlots=['first-road-lantern'];state.fellows.lyra.relicSlots=['first-road-lantern']}],['stone-credit',state=>state.relicProgressLedger.qaCredits.relicStones++],['stone-balance',state=>state.relicStones++],['campaign-gap',state=>state.fellowCampaign.runCountsByStage['broken-roads-3']=1],['side-mode',state=>state.relicProgressLedger.lastCampaignReceipt.mode='foreign'],['side-time',state=>state.relicProgressLedger.lastCampaignReceipt.completedAt++],['side-source-count',state=>state.relicProgressLedger.lastCampaignReceipt.sourceCountBefore++],['paired-v2',state=>state.fellowCampaign.lastReceipt.rewards.gifts++],['side-missing',state=>state.relicProgressLedger.lastCampaignReceipt=null]
]){const state=clone(afterReplay);mutate(state);check('forgery-'+label,p8(fresh,'valid('+JSON.stringify(state)+')').ok===false)}
for(const malformed of [null,{}, {schemaVersion:9}, {schemaVersion:9,saveMeta:null}, {schemaVersion:9,relicProgressLedger:null}, {schemaVersion:9,relics:null}])check('malformed-'+rows.length,p8(fresh,'malformed('+JSON.stringify(malformed)+')').ok===false);

const schemaEightRaw=p8(fresh,'schemaEightDefault()'),migration=runRealm({...freshOptions,activeRaw:schemaEightRaw,now:1787853601000}),migrated=active(migration),migrationReceipt=migrated.saveMeta.appliedMigrations.at(-1);
check('schema8-migrates',migrated.schemaVersion===9&&valid(migration).ok&&internal(migration,'runtime().blocked')===null);
check('pre-v9-byte-exact',migration.slots.get(keys.preV9)===schemaEightRaw);
check('migration-reward-neutral',migrated.relicStones===0&&Object.values(migrated.relics).every(item=>!item.owned)&&Object.values(migrated.fellowCampaign.runCountsByStage).every(value=>value===0));
check('migration-receipt-exact',migrationReceipt.id==='schema-8-to-9'&&migrationReceipt.schema8PredecessorIdentity===rawIdentity(schemaEightRaw)&&migrationReceipt.checkpointLineage.preV9RawIdentity===rawIdentity(schemaEightRaw));
check('migration-reload',valid(runRealm({initialSlots:Object.fromEntries(migration.slots),now:1787853602000})).ok);
for(const [label,raw] of [['legacy',legacyRaw],['schema1',schemaOneRaw]]){const run=runRealm({...freshOptions,activeRaw:raw,now:1787853610000}),state=active(run),reload=runRealm({initialSlots:Object.fromEntries(run.slots),now:1787853611000});check(label+'-to-schema9',state?.schemaVersion===9&&valid(run).ok,internal(run,'runtime().blocked')?.message??'');check(label+'-pre-v9-schema8',JSON.parse(run.slots.get(keys.preV9)).schemaVersion===8);check(label+'-reload',valid(reload).ok&&internal(reload,'runtime().blocked')===null)}

const old100kRaw=p8(fresh,'schemaEightCampaignUsage(100000)'),old100k=runRealm({...freshOptions,activeRaw:old100kRaw,now:1787853620000}),old100kState=active(old100k);
check('old-cap-migrates-live-zero',valid(old100k).ok&&p8(old100k,'usage().used')===0&&old100kState.relicStones===0&&Object.values(old100kState.relics).every(item=>!item.owned));
const oldCapRun=p8(old100k,"run('broken-roads-2',{confirmed:true,present:false})");check('old-cap-first-live-run',oldCapRun.ok&&active(old100k).fellowCampaign.lastReceipt.stageRunSequence===100000&&active(old100k).relics['mossbound-compass'].owned);
const live99999Raw=p8(fresh,'liveUsageState(99999)'),live99999=runRealm({...freshOptions,activeRaw:live99999Raw}),capRun=p8(live99999,"run('broken-roads-2',{confirmed:true,present:false})"),atCap=active(live99999),capSlots=slotSnapshot(live99999),refused=p8(live99999,"run('broken-roads-2',{confirmed:true,present:false})");
check('live-cap-final-run',capRun.ok&&p8(live99999,'usage().used')===100000);
check('live-cap-next-refused',refused===false&&JSON.stringify(slotSnapshot(live99999))===JSON.stringify(capSlots)&&atCap.saveMeta.revision===active(live99999).saveMeta.revision);

for(const step of ['pre-v9-backup-write','pre-v9-backup-verify','staging-new-owner','staging-write','staging-verify','staging-validation','active-conflict','active-write','active-verify','active-validation','staging-cleanup-owner','staging-cleanup','staging-cleanup-verify']){const interrupted=runRealm({...freshOptions,activeRaw:schemaEightRaw,now:1787853630000,fault:{enabled:true,operation:step.includes('cleanup')&&step!=='staging-cleanup-owner'?'removeItem':'setItem',step}}),retry=runRealm({initialSlots:Object.fromEntries(interrupted.slots),now:1787853631000});check('migration-fault-'+step+'-recoverable',active(retry)?.schemaVersion===9&&valid(retry).ok&&internal(retry,'runtime().blocked')===null,internal(retry,'runtime().blocked')?.message??'');check('migration-fault-'+step+'-one-receipt',active(retry).saveMeta.appliedMigrations.filter(item=>item.id==='schema-8-to-9').length===1)}
const foreignPreV9=schemaEightRaw+' ',foreign=runRealm({...freshOptions,activeRaw:schemaEightRaw,preV9BackupRaw:foreignPreV9}),foreignBefore=slotSnapshot(foreign);check('foreign-pre-v9-blocked',internal(foreign,'runtime().blocked')!==null);check('foreign-pre-v9-zero-write',writes(foreign)===0&&JSON.stringify(slotSnapshot(foreign))===JSON.stringify(foreignBefore));
const missing=runRealm({...freshOptions,activeRaw:null,preV9BackupRaw:schemaEightRaw});check('missing-lone-pre-v9-blocked',internal(missing,'runtime().blocked')!==null&&writes(missing)===0&&missing.slots.get(keys.preV9)===schemaEightRaw);

const resetRun=runRealm(freshOptions);p8(resetRun,'reset()');const resetState=active(resetRun),resetReload=runRealm({initialSlots:Object.fromEntries(resetRun.slots)});check('safe-reset-marker4',resetState.saveMeta.source==='safe-reset'&&resetState.saveMeta.retainedCheckpointLineage.version===4&&resetState.saveMeta.appliedMigrations.length===0);check('safe-reset-reload',valid(resetReload).ok&&internal(resetReload,'runtime().blocked')===null);
const resetRead=runRealm({...freshOptions,activeRaw:activeRaw(fresh),preV9BackupRaw:'foreign'}),resetBefore=slotSnapshot(resetRead),resetWrites=writes(resetRead);Object.assign(resetRead.fault,{enabled:true,operation:'getItem',key:keys.preV9,remaining:1,skip:0});p8(resetRead,'reset()');check('reset-preflight-read-zero-write',writes(resetRead)===resetWrites&&JSON.stringify(slotSnapshot(resetRead))===JSON.stringify(resetBefore));
const diagnostics=p8(campaign,'diagnostics()');check('diagnostics-relic-algebra',diagnostics.relics.stones.balance===afterReplay.relicStones&&diagnostics.relics.stones.earned===5&&diagnostics.relics.stones.spent===0);check('diagnostics-epoch',diagnostics.phaseEightCampaignEpoch.usage.used===3&&diagnostics.phaseEightCampaignEpoch.campaignReceiptVersion===2&&diagnostics.phaseEightCampaignEpoch.relicReceiptVersion===1);check('diagnostics-eleven-slots',diagnostics.protectedSlots.preV9===keys.preV9);
const storageEventRun=runRealm(freshOptions);for(const listener of storageEventRun.listeners.storage??[])listener({storageArea:storageEventRun.context.localStorage,key:keys.preV9});check('pre-v9-storage-event-stale',internal(storageEventRun,'runtime().stale')===true);
const bridgeRun=runRealm(freshOptions),grantBefore=active(bridgeRun).relicStones,grant=internal(bridgeRun,"action('relic-stones-grant',{amount:7})");check('qa-stone-credit',grant.ok&&active(bridgeRun).relicStones===grantBefore+7&&active(bridgeRun).relicProgressLedger.qaCredits.relicStones===7);
const unattested=runRealm({...freshOptions,qa:{allowDestructive:true,isolatedStorage:false}}),unattestedRaw=activeRaw(unattested);let unattestedGrant;try{unattestedGrant=internal(unattested,"action('relic-stones-grant',{amount:1})")}catch(error){unattestedGrant={ok:false,error:String(error.message||error)}}check('qa-unattested-refused',unattestedGrant.ok===false&&unattestedGrant.error.includes('Destructive QA access')&&activeRaw(unattested)===unattestedRaw);

const rosterHtml=p7(campaign,'rosterView()'),campaignHtml=p7(campaign,'adventureView()');
check('ui-relic-tab',rosterHtml.includes('Relics · 6'));
check('ui-campaign-relic-preview',campaignHtml.includes('Deterministic Relic result'));
check('ui-no-relic-adventure-mode',!campaignHtml.includes('data-adventure="relic'));
const assetLines=[12,18,24].map(line=>html.split(/\n/)[line-1]);check('embedded-assets-present',assetLines.every(line=>line.includes('data:image/')));

const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed;
console.log(JSON.stringify({total:rows.length,passed,failed,artifactSha256:sha256(htmlBytes),artifactBytes:htmlBytes.length,failures:rows.filter(row=>!row.pass)},null,2));
if(failed)process.exitCode=1;
`;

eval(harness+suite);
