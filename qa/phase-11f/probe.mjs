import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname);
const SCHEMA_ELEVEN_COMMIT='210c1ce21cea8b9061d17ac1456617905a59701b';
const PRE_V12_KEY='oathforge_new_world_proto_v01__raw_backup_v11';
const T0=1787853600000;
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
const currentBaseHarness=helpers.replaceOnce(baseHarness,'return value?.schemaVersion===11?value:null','return value?.schemaVersion===12?value:null','schema-12 active helper');
const harness=helpers.replaceOnce(currentBaseHarness,'    tamperClear(){',`    p11f:Object.freeze({
      state:()=>clone(S),
      valid:()=>validation(S,12),
      blocked:()=>clone(PERSISTENCE_BLOCKED),
      raw:()=>PERSISTED_RAW,
      roster(kind){S.ui.roster=kind;return rosterScreen()},
      profile(kind,id){document.querySelector('#overlay').innerHTML='';if(kind==='fellow')openFellow(id);else openFamily(id);return document.querySelector('#overlay')?.innerHTML??''},
      codex:tab=>phaseElevenDCodexCategoryHtml(tab),
      claim(readyId=null,{terminal=false,blocked=false}={}){const lanes=['village','tower','expedition'].map(id=>({id,name:id==='village'?'Village':id==='tower'?'Tower':'Expedition',ready:id===readyId,blocked:id===readyId&&blocked,terminal:id===readyId&&terminal,pending:id==='village'?{gold:0,gifts:id===readyId?1:0,shards:Object.fromEntries(FAMILY_DEFS.map(def=>[def.id,0]))}:id==='tower'?{exp:id===readyId?10:0,mastery:0,shards:Object.fromEntries(COMPANION_DEFS.map(def=>[def.id,0]))}:{might:0,shards:Object.fromEntries(FELLOW_DEFS.map(def=>[def.id,0]))},reason:id===readyId?'Ready to collect':'Nothing ready'})),preview={lanes,village:lanes[0],tower:lanes[1],expedition:lanes[2]};preview.claimableLanes=lanes.filter(lane=>lane.ready&&!lane.blocked&&!lane.terminal);return phaseElevenCClaimCard(preview)},
      navigate(view){const before={raw:PERSISTED_RAW,revision:S.saveMeta.revision,writes:qaRuntimeSnapshot().logLength},result=nav(view);return{result,before,after:{raw:PERSISTED_RAW,revision:S.saveMeta.revision,writes:qaRuntimeSnapshot().logLength},view:S.ui.view}},
      grantNewFellow(id){return qaGrant({resource:'fellowExp',amount:100,id})},
      export:()=>safePersistenceExport(),
      diagnostics:()=>persistenceDiagnostics(),
      reset:()=>persistenceAction('safe-reset')
    }),
    tamperClear(){`,'Phase 11F facade');
const tools=await helpers.toolsFor(harness),baseTools=await helpers.toolsFor(baseHarness);
const html=readFileSync(resolve(ROOT,'index.html'),'utf8'),application=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const predecessorHtml=execFileSync('/usr/bin/git',['show',`${SCHEMA_ELEVEN_COMMIT}:index.html`],{cwd:ROOT,encoding:'utf8',maxBuffer:64*1024*1024,timeout:60000});
const predecessorApplication=predecessorHtml.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if(!application||!predecessorApplication)throw new Error('Everstead application script missing');
const source=tools.instrument(application),predecessorSource=baseTools.instrument(predecessorApplication);
const rows=[],add=(id,pass,detail='')=>{const row={id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)};rows.push(row);console.log(`${row.pass?'PASS':'FAIL'} ${id}${!row.pass&&row.detail?` · ${row.detail}`:''}`)};
const p=(run,expression)=>tools.internal(run,'p11f.'+expression),same=(left,right)=>JSON.stringify(left)===JSON.stringify(right),count=(text,pattern)=>(text.match(pattern)||[]).length;

const fresh=tools.runRealm({...tools.freshOptions,applicationSource:source,now:T0,deferTimers:true}),state=tools.active(fresh);
add('fresh-boot-schema-12',fresh.thrown===null&&state?.schemaVersion===12&&p(fresh,'blocked()')===null,fresh.thrown?.message||p(fresh,'blocked()'));
add('fresh-state-valid',p(fresh,'valid().ok')===true,p(fresh,'valid().errors'));
add('fresh-roster-counts',Object.keys(state.fellows).length===18&&Object.keys(state.family).length===20,{fellows:Object.keys(state.fellows).length,family:Object.keys(state.family).length});
add('fresh-roster-profile',state.rosterProfile?.manifestId==='everstead-roster-2026-08-31'&&state.rosterProfile?.fellowIds?.length===18&&state.rosterProfile?.familyIds?.length===20,state.rosterProfile);

const fellowHtml=p(fresh,"roster('fellows')"),familyHtml=p(fresh,"roster('family')");
add('fellow-roster-eighteen-cards',count(fellowHtml,/data-fellow=/g)===18,count(fellowHtml,/data-fellow=/g));
add('family-roster-twenty-cards',count(familyHtml,/data-family=/g)===20,count(familyHtml,/data-family=/g));
add('roster-count-language',fellowHtml.includes('40 starting characters')&&fellowHtml.includes('Fellows · 18')&&fellowHtml.includes('Family · 20'));
add('roster-uses-lazy-thumbnails',count(fellowHtml,/loading="lazy"/g)===18&&count(familyHtml,/loading="lazy"/g)===20&&fellowHtml.includes('assets/portraits/fellows/thumb/kaladin.webp')&&familyHtml.includes('assets/portraits/family/thumb/vexahlia.webp'));
add('legacy-visible-fellows-removed',!['Cael','Lyra','Orin','Selene','Rook','Mira'].some(name=>new RegExp(`>${name}<`).test(fellowHtml)));
add('new-roster-boundaries-visible',fellowHtml.includes('Kaladin')&&fellowHtml.includes('Anakin')&&familyHtml.includes("Vex'ahlia")&&familyHtml.includes('Misty'));

const fellowProfile=p(fresh,"profile('fellow','cael')"),familyProfile=p(fresh,"profile('family','elara')");
add('fellow-profile-full-art',fellowProfile.includes('assets/portraits/fellows/kaladin.webp')&&!fellowProfile.includes('/thumb/'),fellowProfile.slice(0,600));
add('family-profile-full-art',familyProfile.includes('assets/portraits/family/vexahlia.webp')&&!familyProfile.includes('/thumb/'),familyProfile.slice(0,600));
add('profile-accessibility-wrapper-source',application.includes("profile.dataset.rosterProfile='fellow'")&&application.includes("profile.dataset.rosterProfile='family'")&&application.includes('Close ${fellow(id)?.name')&&application.includes('Close ${family(id)?.name'));

const fellowCodex=p(fresh,"codex('fellows')"),familyCodex=p(fresh,"codex('family')");
add('codex-fellow-titles',count(fellowCodex,/phase-11f-codex-title/g)===18&&fellowCodex.includes('Bridgeborn Vanguard'));
add('codex-family-titles',count(familyCodex,/phase-11f-codex-title/g)===20&&familyCodex.includes('Mistress of the Hunt'));

const zeroClaim=p(fresh,'claim()'),oneClaim=p(fresh,"claim('tower')"),terminalClaim=p(fresh,"claim('tower',{terminal:true})");
add('claim-zero-compact',zeroClaim.includes('data-phase-11e-claim-layout="compact"')&&zeroClaim.includes('NOTHING CLAIMABLE'));
add('claim-one-compact-specific',oneClaim.includes('data-phase-11e-claim-layout="compact"')&&oneClaim.includes('CLAIM TOWER'));
add('claim-terminal-expanded',terminalClaim.includes('data-phase-11e-claim-layout="expanded"'));

const navigation=p(fresh,"navigate('oaths')");
add('main-navigation-save-neutral',navigation.result?.ok===true&&navigation.before.raw===navigation.after.raw&&navigation.before.revision===navigation.after.revision&&navigation.before.writes===navigation.after.writes,navigation);
const granted=p(fresh,"grantNewFellow('anakin')"),afterGrant=tools.active(fresh);
add('new-fellow-progression-transaction',granted?.saveMeta?.revision===state.saveMeta.revision+1&&afterGrant.fellows['anakin'].exp===100&&p(fresh,'valid().ok')===true,{exp:afterGrant.fellows['anakin'].exp,revision:afterGrant.saveMeta.revision});
const exported=p(fresh,'export()');
add('schema-12-export-slot',exported.exportVersion===12&&exported.preV12BackupKey===PRE_V12_KEY&&Object.hasOwn(exported,'preV12BackupRaw'));

const predecessor=baseTools.runRealm({...baseTools.freshOptions,applicationSource:predecessorSource,now:T0,deferTimers:true}),schemaElevenRaw=baseTools.activeRaw(predecessor),schemaEleven=JSON.parse(schemaElevenRaw);
add('released-schema-11-fixture',schemaEleven.schemaVersion===11&&Object.keys(schemaEleven.fellows).length===6&&Object.keys(schemaEleven.family).length===3);
const migration=tools.runRealm({...tools.freshOptions,applicationSource:source,activeRaw:schemaElevenRaw,now:T0+1000,deferTimers:true}),migrated=tools.active(migration);
add('schema-11-to-12-migration',migrated?.schemaVersion===12&&p(migration,'blocked()')===null&&p(migration,'valid().ok')===true,p(migration,'blocked()'));
add('schema-11-byte-exact-checkpoint',migration.slots.get(PRE_V12_KEY)===schemaElevenRaw);
add('migration-preserves-existing-fellows',['cael','lyra','orin','selene','rook','mira'].every(id=>same(migrated.fellows[id],schemaEleven.fellows[id])));
add('migration-preserves-existing-family',['elara','tamsin','isolde'].every(id=>same(migrated.family[id],schemaEleven.family[id])));
add('migration-adds-new-roster',Object.keys(migrated.fellows).length===18&&Object.keys(migrated.family).length===20&&migrated.fellows.anakin?.owned===true&&migrated.family.misty?.rarity===1);
add('migration-receipt-authenticates-predecessor',migrated.saveMeta.appliedMigrations.at(-1)?.id==='schema-11-to-12'&&migrated.saveMeta.appliedMigrations.at(-1)?.schema11PredecessorIdentity);
const reloaded=tools.runRealm({applicationSource:source,initialSlots:Object.fromEntries(migration.slots),now:T0+2000,deferTimers:true});
add('migrated-reload',tools.active(reloaded)?.schemaVersion===12&&p(reloaded,'blocked()')===null&&p(reloaded,'valid().ok')===true,p(reloaded,'blocked()'));

const recovered=tools.runRealm({applicationSource:source,initialSlots:{[PRE_V12_KEY]:schemaElevenRaw},now:T0+3000,deferTimers:true}),recoveredState=tools.active(recovered);
add('missing-active-recovers-pre-v12',recoveredState?.schemaVersion===12&&recoveredState?.saveMeta?.appliedMigrations?.at(-1)?.migrationSource==='recovered-schema-11-backup'&&p(recovered,'blocked()')===null,{state:recoveredState?{schemaVersion:recoveredState.schemaVersion,source:recoveredState.saveMeta.source,migrationSource:recoveredState.saveMeta.appliedMigrations.at(-1)?.migrationSource}:null,blocked:p(recovered,'blocked()'),slots:[...recovered.slots.keys()]});
const forged=JSON.parse(schemaElevenRaw);delete forged.fellows.cael;const forgedRaw=JSON.stringify(forged),forgedRun=tools.runRealm({...tools.freshOptions,applicationSource:source,activeRaw:forgedRaw,now:T0+4000,deferTimers:true});
add('invalid-schema-11-blocked-zero-write',p(forgedRun,'blocked()')!==null&&forgedRun.slots.get(tools.keys.active)===forgedRaw&&tools.writes(forgedRun)===0,{blocked:p(forgedRun,'blocked()'),writes:tools.writes(forgedRun),slots:[...forgedRun.slots.keys()]});

p(migration,'reset()');const reset=tools.active(migration),resetReload=tools.runRealm({applicationSource:source,initialSlots:Object.fromEntries(migration.slots),now:T0+5000,deferTimers:true});
add('safe-reset-schema-12-lineage',reset?.schemaVersion===12&&reset?.saveMeta?.retainedCheckpointLineage?.version===7&&migration.slots.get(PRE_V12_KEY)===schemaElevenRaw,p(migration,'blocked()'));
add('safe-reset-reload',tools.active(resetReload)?.schemaVersion===12&&p(resetReload,'blocked()')===null&&p(resetReload,'valid().ok')===true,p(resetReload,'blocked()'));

add('all-realms-native-storage-zero',[fresh,migration,reloaded,recovered,forgedRun,resetReload].every(run=>run.nativeCalls.length===0));
const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed;
console.log(`Phase 11F focused probe: ${passed}/${rows.length}`);
if(failed)process.exitCode=1;
