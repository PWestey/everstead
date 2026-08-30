import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname);
const BASE='56b99f86a95f95fd1822da0331204f5d8ea33656';
const PROFILE_IDENTITY='6abf706b4450f61a708a0baba5e431a374f8de085fbf614e7334b6071bca534f';
const PROFILE={id:'everstead-economy-v1',configIdentity:PROFILE_IDENTITY,freshGold:50000,upgradeGrowth:1.24,fellowRoster:{numeratorBps:1500,kneePower:100000,capBps:1500},companionRoster:{numeratorBps:1000,kneePower:25000,capBps:1000}};
const clone=value=>structuredClone(value);
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const sha=value=>createHash('sha256').update(value).digest('hex');
const application=html=>html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const replaceOnce=(source,needle,replacement,label)=>{if(source.split(needle).length!==2)throw new Error(`Phase 10C-1 probe anchor drift: ${label}`);return source.replace(needle,replacement)};

async function phaseNineHarness(){
  const verifier=readFileSync(resolve(ROOT,'qa/phase-9/verify.mjs'),'utf8'),boundary=verifier.lastIndexOf('\nconst suite=String.raw`');
  if(boundary<0)throw new Error('Phase 9 persistence harness boundary missing');
  const prefix=verifier.slice(0,boundary).replace("const repoRoot=resolve(new URL('../..',import.meta.url).pathname);",`const repoRoot=${JSON.stringify(ROOT)};`)+'\nexport {harness};\n';
  return (await import('data:text/javascript;base64,'+Buffer.from(prefix).toString('base64'))).harness
}

async function toolsFor(harness){
  const module=`import {createHash} from 'node:crypto';import {readFileSync} from 'node:fs';import {resolve} from 'node:path';import vm from 'node:vm';${harness}\nexport {runRealm,instrument,freshOptions,keys,activeRaw,active,internal,writes};`;
  return import('data:text/javascript;base64,'+Buffer.from(module).toString('base64'))
}

function candidateHarness(base){
  let next=replaceOnce(base,"  preV10:'oathforge_new_world_proto_v01__raw_backup_v9',\n  staging:","  preV10:'oathforge_new_world_proto_v01__raw_backup_v9',\n  preV11:'oathforge_new_world_proto_v01__raw_backup_v10',\n  staging:",'pre-v11 key');
  next=replaceOnce(next,'preV10BackupRaw:keys.preV10,stagingRaw:','preV10BackupRaw:keys.preV10,preV11BackupRaw:keys.preV11,stagingRaw:','pre-v11 fixture option');
  next=replaceOnce(next,'return value?.schemaVersion===10?value:null','return value?.schemaVersion===11?value:null','schema-11 active helper');
  next=replaceOnce(next,'    tamperClear(){',`    p10c:Object.freeze({
      state:()=>clone(S),
      valid:(value=S)=>validation(value,11),
      profile:()=>clone(PHASE_TEN_C_ONE_PROFILE),
      receipt:()=>clone(phaseTenCReceipt(S)),
      export:()=>safePersistenceExport(),
      diagnostics:()=>persistenceDiagnostics(),
      runtime:()=>qaRuntimeSnapshot(),
      reset:()=>persistenceAction('safe-reset'),
      rawIdentity:value=>rawIdentity(value),
      baseline:(value=S)=>phaseTenCEconomyBaselineIdentity(value),
      initialization:(raw,value=S)=>phaseTenCInitializationIdentity(raw,value),
      receiptAuthenticates:()=>phaseTenCReceiptAuthenticates(S,phaseTenCReadProtectedSlots()),
      currentLineage:()=>phaseTenCCurrentLineage(S,phaseTenCReadProtectedSlots()),
      schemaTenScoped(){const at=1787853600000,meta=newMetadata('fresh',at,[]);return schemaScopedDefaultState(meta,10)},
      fixtureProbe(input){try{return{ok:true,state:qaInstallFixture(input)}}catch(error){return{ok:false,error:String(error.message||error)}}},
      tamper(kind){const value=clone(S);if(kind==='config')value.economyProfile.configIdentity='foreign';else if(kind==='activated')value.economyProfile.activatedAt++;else if(kind==='missing')delete value.economyProfile;else throw new Error('Unknown Phase 10C tamper');return validation(value,11)},
      tamperReceiptRaw(){const value=clone(S),receipt=phaseTenCReceipt(value);if(!receipt)throw new Error('Phase 10C receipt missing');receipt.schema10PredecessorIdentity='fnv1a32:1:00000000';return JSON.stringify(value)}
    }),
    tamperClear(){`,'Phase 10C facade');
  return next
}

const slotPayload=(run,keys)=>({activeRaw:run.slots.get(keys.active)??null,backupRaw:run.slots.get(keys.backup)??null,preV2BackupRaw:run.slots.get(keys.preV2)??null,preV3BackupRaw:run.slots.get(keys.preV3)??null,preV4BackupRaw:run.slots.get(keys.preV4)??null,preV5BackupRaw:run.slots.get(keys.preV5)??null,preV6BackupRaw:run.slots.get(keys.preV6)??null,preV7BackupRaw:run.slots.get(keys.preV7)??null,preV8BackupRaw:run.slots.get(keys.preV8)??null,preV9BackupRaw:run.slots.get(keys.preV9)??null,preV10BackupRaw:run.slots.get(keys.preV10)??null,preV11BackupRaw:run.slots.get(keys.preV11)??null,stagingRaw:run.slots.get(keys.staging)??null});

export async function runSchemaCandidate(){
  const rows=[],record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)}),phaseNine=await phaseNineHarness(),baseTools=await toolsFor(phaseNine),candidateTools=await toolsFor(candidateHarness(phaseNine));
  const baseHtml=execFileSync('git',['show',`${BASE}:index.html`],{cwd:ROOT,encoding:'utf8',maxBuffer:32*1024*1024,timeout:30000}),candidateHtml=readFileSync(resolve(ROOT,'index.html'),'utf8'),baseApp=application(baseHtml),candidateApp=application(candidateHtml);
  if(!baseApp||!candidateApp)throw new Error('Production application boundary missing');
  const baseSource=baseTools.instrument(baseApp),candidateSource=candidateTools.instrument(candidateApp),baseFresh=baseTools.runRealm({...baseTools.freshOptions,applicationSource:baseSource}),schema10Raw=baseTools.activeRaw(baseFresh),schema10=JSON.parse(schema10Raw),now=1787853604000;
  record('released-schema10-fixture-authority',schema10.schemaVersion===10&&schema10.gold===500000&&baseFresh.thrown===null,baseFresh.thrown?.message||schema10.saveMeta);

  const releasedMigration=candidateTools.runRealm({...candidateTools.freshOptions,applicationSource:candidateSource,activeRaw:schema10Raw,now}),releasedMigrated=candidateTools.active(releasedMigration);
  record('released-revision1-schema10-migrates',releasedMigrated?.schemaVersion===11&&candidateTools.internal(releasedMigration,'p10c.runtime().blocked')===null,candidateTools.internal(releasedMigration,'p10c.runtime().blocked'));
  record('released-revision1-pre-v11-byte-exact',releasedMigration.slots.get(candidateTools.keys.preV11)===schema10Raw,sha(releasedMigration.slots.get(candidateTools.keys.preV11)??''));

  const fresh=candidateTools.runRealm({...candidateTools.freshOptions,applicationSource:candidateSource,now}),freshState=candidateTools.active(fresh),p10c=(run,expression)=>candidateTools.internal(run,'p10c.'+expression),p9=(run,expression)=>candidateTools.internal(run,'p9.'+expression);
  record('fresh-schema11-boot',fresh.thrown===null&&freshState?.schemaVersion===11&&p10c(fresh,'runtime().blocked')===null,fresh.thrown?.message||p10c(fresh,'runtime().blocked'));
  record('fresh-schema11-valid',p10c(fresh,'valid().ok')===true,p10c(fresh,'valid().errors'));
  record('fresh-gold-50000',freshState?.gold===50000,freshState?.gold);
  record('fresh-profile-exact',same(freshState?.economyProfile,{configIdentity:PROFILE_IDENTITY,activatedAt:now})&&freshState.saveMeta.createdAt===now&&freshState.saveMeta.updatedAt===now,freshState?.economyProfile);
  record('fresh-profile-no-migration-receipt',freshState?.saveMeta?.appliedMigrations?.filter(item=>item.id==='schema-10-to-11').length===0);
  record('production-profile-constant-exact',same(p10c(fresh,'profile()'),PROFILE),p10c(fresh,'profile()'));
  const freshExport=p10c(fresh,'export()');
  record('fresh-export-13-read-errors',Object.keys(freshExport.readErrors).length===13,Object.keys(freshExport.readErrors));
  record('fresh-export-pre-v11-contract',freshExport.exportVersion===11&&freshExport.preV11BackupKey===candidateTools.keys.preV11&&freshExport.preV11BackupRaw===null);
  const diagnostics=p10c(fresh,'diagnostics()');
  record('fresh-diagnostics-profile-and-slot',same(diagnostics.economyProfile,freshState.economyProfile)&&diagnostics.preV11Backup.key===candidateTools.keys.preV11&&diagnostics.protectedSlots.preV11===candidateTools.keys.preV11);
  record('fresh-isolated-storage',fresh.nativeCalls.length===0,fresh.nativeCalls);
  const profileBefore=clone(freshState.economyProfile),grant=p9(fresh,"grant('gold',1)"),afterGrant=candidateTools.active(fresh),navigate=p9(fresh,"named('navigate',{view:'oaths'})"),afterNavigate=candidateTools.active(fresh);
  record('profile-preserved-gold-mutation',grant.ok===true&&same(afterGrant.economyProfile,profileBefore),grant);
  record('profile-preserved-navigation-mutation',navigate.ok===true&&same(afterNavigate.economyProfile,profileBefore),navigate);
  for(const kind of ['config','activated','missing'])record(`profile-tamper-${kind}-rejected`,p10c(fresh,`tamper('${kind}').ok`)===false,p10c(fresh,`tamper('${kind}').errors`));
  const scopedTen=p10c(fresh,'schemaTenScoped()');
  record('historical-schema10-default-stays-released',scopedTen.schemaVersion===10&&scopedTen.gold===500000&&!Object.hasOwn(scopedTen,'economyProfile'),{schemaVersion:scopedTen.schemaVersion,gold:scopedTen.gold,economyProfile:scopedTen.economyProfile});

  const predecessor=clone(schema10);predecessor.gold=123456;predecessor.pendingGold=.75;predecessor.buildings.training.level=7;predecessor.saveMeta.revision=2;predecessor.saveMeta.source='navigation';predecessor.saveMeta.updatedAt=1787853601000;predecessor.lastGoldAt=1787853606000;predecessor.lastSeen=1787853606000;const predecessorRaw=JSON.stringify(predecessor),activationAt=1787853606000;
  const migration=candidateTools.runRealm({...candidateTools.freshOptions,applicationSource:candidateSource,activeRaw:predecessorRaw,now}),migrated=candidateTools.active(migration),blocked=p10c(migration,'runtime().blocked');
  record('schema10-migrates-to-schema11',migration.thrown===null&&blocked===null&&migrated?.schemaVersion===11,migration.thrown?.message||blocked);
  record('migration-pre-v11-byte-exact',migration.slots.get(candidateTools.keys.preV11)===predecessorRaw,sha(migration.slots.get(candidateTools.keys.preV11)??''));
  record('migration-balances-and-level-preserved',migrated?.gold===123456&&migrated.pendingGold===.75&&migrated.buildings.training.level===7,{gold:migrated?.gold,pending:migrated?.pendingGold,level:migrated?.buildings?.training?.level});
  record('migration-activated-at-max',migrated?.economyProfile?.activatedAt===activationAt&&migrated.saveMeta.updatedAt===activationAt,migrated?.economyProfile);
  const receipt=migrated?.saveMeta?.appliedMigrations?.find(item=>item.id==='schema-10-to-11');
  record('migration-receipt-exact-shape',receipt&&same(Object.keys(receipt),['id','from','to','appliedAt','migrationSource','checkpointLineage','configIdentity','schema10PredecessorIdentity','schema10EconomyBaselineIdentity','initializationIdentity']),receipt&&Object.keys(receipt));
  record('migration-receipt-source-and-profile',receipt?.id==='schema-10-to-11'&&receipt.from===10&&receipt.to===11&&receipt.appliedAt===activationAt&&receipt.migrationSource==='schema-10'&&receipt.configIdentity===PROFILE_IDENTITY,receipt);
  record('migration-receipt-predecessor-identity',receipt?.schema10PredecessorIdentity===p10c(migration,'rawIdentity('+JSON.stringify(predecessorRaw)+')'),receipt?.schema10PredecessorIdentity);
  record('migration-receipt-baseline-identity',receipt?.schema10EconomyBaselineIdentity===p10c(migration,'baseline('+JSON.stringify(predecessor)+')'),receipt?.schema10EconomyBaselineIdentity);
  record('migration-receipt-authenticates',p10c(migration,'receiptAuthenticates()')===true,receipt?.initializationIdentity);
  const lineage=receipt?.checkpointLineage,lineageKeys=['version','backupRawIdentity','preV2RawIdentity','preV3RawIdentity','preV4RawIdentity','preV5RawIdentity','preV6RawIdentity','preV7RawIdentity','preV8RawIdentity','preV9RawIdentity','preV10RawIdentity','preV11RawIdentity'];
  record('migration-thirteen-slot-lineage',lineage&&same(Object.keys(lineage),lineageKeys)&&lineage.preV11RawIdentity===receipt.schema10PredecessorIdentity,lineage);
  record('migration-valid-and-current-lineage',migrated&&p10c(migration,'valid().ok')===true&&p10c(migration,'currentLineage()')===true,p10c(migration,'valid().errors'));
  const reload=candidateTools.runRealm({applicationSource:candidateSource,initialSlots:Object.fromEntries(migration.slots),now:activationAt+1000});
  record('migration-reload',candidateTools.active(reload)?.schemaVersion===11&&p10c(reload,'runtime().blocked')===null,p10c(reload,'runtime().blocked'));
  record('migration-write-once-pre-v11',reload.slots.get(candidateTools.keys.preV11)===predecessorRaw);
  if(migrated){const tamperedRaw=p10c(migration,'tamperReceiptRaw()'),tamperedRun=candidateTools.runRealm({applicationSource:candidateSource,...slotPayload(migration,candidateTools.keys),activeRaw:tamperedRaw,now:activationAt+1001});record('migration-tampered-receipt-blocked-byte-exact',p10c(tamperedRun,'runtime().blocked')!==null&&tamperedRun.slots.get(candidateTools.keys.active)===tamperedRaw&&candidateTools.writes(tamperedRun)===0,p10c(tamperedRun,'runtime().blocked'))}else record('migration-tampered-receipt-blocked-byte-exact',false,'migration unavailable');
  const migratedProfile=clone(migrated?.economyProfile),migratedGrant=migrated?p9(migration,"grant('gold',1)"):{ok:false},mutated=candidateTools.active(migration);
  record('migrated-profile-preserved-current-mutation',migratedGrant.ok===true&&same(mutated?.economyProfile,migratedProfile),migratedGrant);

  const fixtureTarget=candidateTools.runRealm({...candidateTools.freshOptions,applicationSource:candidateSource,now:activationAt+2000}),fixturePayload=slotPayload(migration,candidateTools.keys),fixtureResult=p10c(fixtureTarget,'fixtureProbe('+JSON.stringify(fixturePayload)+')');
  record('fixture-accepts-all-thirteen-slots',fixtureResult.ok===true&&candidateTools.active(fixtureTarget)?.schemaVersion===11&&fixtureTarget.slots.get(candidateTools.keys.preV11)===predecessorRaw,fixtureResult);

  const eventRun=candidateTools.runRealm({...candidateTools.freshOptions,applicationSource:candidateSource,now:activationAt+3000}),staleBefore=p10c(eventRun,'runtime().stale');for(const listener of eventRun.listeners.storage??[])listener({storageArea:{},key:candidateTools.keys.preV11});const staleForeign=p10c(eventRun,'runtime().stale');for(const listener of eventRun.listeners.storage??[])listener({storageArea:eventRun.context.localStorage,key:candidateTools.keys.preV11});
  record('pre-v11-storage-event-foreign-ignored',staleBefore===false&&staleForeign===false);
  record('pre-v11-storage-event-native-stale',p10c(eventRun,'runtime().stale')===true,p10c(eventRun,'runtime()'));

  if(migrated){const resetAt=activationAt+4000;const resetRun=candidateTools.runRealm({applicationSource:candidateSource,initialSlots:Object.fromEntries(migration.slots),now:resetAt});p10c(resetRun,'reset()');const reset=candidateTools.active(resetRun),marker=reset?.saveMeta?.retainedCheckpointLineage,resetReload=candidateTools.runRealm({applicationSource:candidateSource,initialSlots:Object.fromEntries(resetRun.slots),now:resetAt+1});record('safe-reset-schema11-fresh-gold',reset?.schemaVersion===11&&reset.gold===50000&&reset.economyProfile?.activatedAt===resetAt,reset&&{gold:reset.gold,profile:reset.economyProfile});record('safe-reset-marker-v6-pre-v11',marker?.version===6&&marker.preV11RawIdentity===receipt.schema10PredecessorIdentity,marker);record('safe-reset-retains-pre-v11-exact',resetRun.slots.get(candidateTools.keys.preV11)===predecessorRaw);record('safe-reset-reload',candidateTools.active(resetReload)?.schemaVersion===11&&p10c(resetReload,'runtime().blocked')===null,p10c(resetReload,'runtime().blocked'))}else for(const id of ['safe-reset-schema11-fresh-gold','safe-reset-marker-v6-pre-v11','safe-reset-retains-pre-v11-exact','safe-reset-reload'])record(id,false,'migration unavailable');

  if(migrated){const recoverySlots=Object.fromEntries(migration.slots);delete recoverySlots[candidateTools.keys.active];delete recoverySlots[candidateTools.keys.staging];const recovered=candidateTools.runRealm({applicationSource:candidateSource,initialSlots:recoverySlots,now:activationAt}),state=candidateTools.active(recovered),recoveryReceipt=state?.saveMeta?.appliedMigrations?.find(item=>item.id==='schema-10-to-11');record('missing-active-pre-v11-recovery',state?.schemaVersion===11&&p10c(recovered,'runtime().blocked')===null,p10c(recovered,'runtime().blocked'));record('missing-active-recovery-preserves-balance',state?.gold===123456&&state.pendingGold===.75&&state.buildings.training.level===7,{gold:state?.gold,pendingGold:state?.pendingGold,level:state?.buildings?.training?.level});record('missing-active-recovery-source',recoveryReceipt?.migrationSource==='recovered-schema-10-backup',recoveryReceipt)}else for(const id of ['missing-active-pre-v11-recovery','missing-active-recovery-preserves-balance','missing-active-recovery-source'])record(id,false,'migration unavailable');

  const interrupted=candidateTools.runRealm({...candidateTools.freshOptions,applicationSource:candidateSource,activeRaw:predecessorRaw,now,fault:{enabled:true,operation:'setItem',step:'pre-v11-backup-write'}}),interruptedActive=interrupted.slots.get(candidateTools.keys.active),retry=candidateTools.runRealm({applicationSource:candidateSource,initialSlots:Object.fromEntries(interrupted.slots),now:activationAt+6000}),retryState=candidateTools.active(retry);
  record('pre-v11-write-fault-triggered',interrupted.fault.remaining===0,interrupted.persistenceLog);
  record('pre-v11-write-fault-keeps-schema10-authoritative',interruptedActive===predecessorRaw&&candidateTools.writes(interrupted)===0,interrupted.storageLog);
  record('pre-v11-write-fault-retry-once',retryState?.schemaVersion===11&&retryState.saveMeta.appliedMigrations.filter(item=>item.id==='schema-10-to-11').length===1&&p10c(retry,'runtime().blocked')===null,p10c(retry,'runtime().blocked'));

  return{rows,evidence:{candidateArtifact:{sha256:sha(candidateHtml),byteLength:Buffer.byteLength(candidateHtml)},baseArtifact:{sha256:sha(baseHtml),byteLength:Buffer.byteLength(baseHtml)},schema10RawSha256:sha(predecessorRaw),freshGold:freshState?.gold??null,migrationBlocked:blocked,profileIdentity:PROFILE_IDENTITY,nativeStorageCalls:[...fresh.nativeCalls,...migration.nativeCalls].length}}
}
