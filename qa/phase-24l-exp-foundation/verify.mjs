import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import childProcess from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {
  FELLOW_IDS,COMPANION_IDS,clone,fixture,rawFixture,predecessorValidator,directOriginValidator,
  preservedTopLevel,preservedSaveMeta,actorProgression,pendingProjection
} from './fixtures.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const bytes=relative=>fs.readFileSync(path.join(root,relative));
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const fileHash=relative=>hash(bytes(relative));
const contract=JSON.parse(read('qa/phase-24l-exp-foundation/contract.json'));
const source=read(contract.candidate.source);
const index=read('index.html');
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const exactKeys=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&same(Object.keys(value).sort(),[...keys].sort());

let passed=0,failed=0;
const failures=[];
function check(name,condition,detail=''){
  if(condition){passed++;return}
  failed++;failures.push({name,detail:typeof detail==='string'?detail:JSON.stringify(detail)});
}
function equal(name,actual,expected){check(name,same(actual,expected),{actual,expected})}
function rejects(name,operation,pattern=/.*/){
  try{operation();check(name,false,'did not throw')}
  catch(error){check(name,pattern.test(String(error?.message||error)),error?.stack||error?.message)}
}
function git(command){return childProcess.execFileSync('git',command,{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024}).trim()}
function baselineFile(relative){return childProcess.execFileSync('git',['show',`${contract.predecessor.commit}:${relative}`],{cwd:root,maxBuffer:64*1024*1024})}

function phase24lProjection(text){
  const html=/[\t ]*<!-- (Phase 24L-B0[^\r\n]*?) BEGIN -->[\s\S]*?<!-- \1 END -->(?:\r?\n)?/g;
  const block=/(^[\t ]*)?\/\* (Phase 24L-B0[^\r\n*]*?) BEGIN \*\/[\s\S]*?\/\* \2 END \*\/(?:\r?\n)?/gm;
  return text.replace(html,'').replace(block,'');
}

function loadCandidate(){
  const realm=vm.createContext({TextEncoder});
  const before=new Set(Object.getOwnPropertyNames(realm));
  vm.runInContext(source,realm,{filename:contract.candidate.source});
  const added=Object.getOwnPropertyNames(realm).filter(name=>!before.has(name));
  return{realm,api:realm[contract.candidate.global],added,descriptor:Object.getOwnPropertyDescriptor(realm,contract.candidate.global)};
}

function checkpointBundle(api,name,state=fixture(name)){
  const raw=JSON.stringify(state),captured=api.capturePredecessorCheckpoint(state,raw,{checkpointId:`phase24l-${name}-checkpoint`});
  const attested=api.attestPredecessorCheckpoint(captured,{rereadRaw:raw});
  return{raw,captured,attested,resolve:identity=>identity===attested.identity?{checkpoint:attested,raw}:null};
}

function migrate(api,name,state=fixture(name)){
  const bundle=checkpointBundle(api,name,state),now=state.saveMeta.updatedAt+1000;
  const result=api.migrateSchema14To15(state,{
    now,source:`phase24l-qa-${name}`,
    predecessorValidatorId:'validator.schema-14.phase24l.qa.v1',
    validatePredecessor:predecessorValidator,
    predecessorCheckpoint:bundle.attested,
    resolvePredecessorCheckpoint:bundle.resolve
  });
  return{...bundle,now,result};
}

function validationOptions(bundle){
  return{validatePredecessor:predecessorValidator,resolvePredecessorCheckpoint:bundle.resolve};
}

const loaded=loadCandidate(),api=loaded.api;
check('candidate installs exactly one new global',same(loaded.added,[contract.candidate.global]),loaded.added);
check('candidate global is a hidden immutable data property',loaded.descriptor?.enumerable===false&&loaded.descriptor?.writable===false&&loaded.descriptor?.configurable===false&&!Object.hasOwn(loaded.descriptor,'get')&&!Object.hasOwn(loaded.descriptor,'set'),loaded.descriptor);
check('candidate API exists and is frozen',Boolean(api)&&Object.isFrozen(api));
equal('candidate version',api?.version,contract.candidate.version);
equal('candidate status',api?.status,contract.candidate.status);
equal('candidate root key',api?.rootKey,contract.candidate.rootKey);
equal('candidate predecessor schema',api?.predecessorSchema,contract.candidate.predecessorSchema);
equal('candidate successor schema',api?.successorSchema,contract.candidate.successorSchema);
equal('candidate policy ID',api?.policyId,contract.candidate.policyId);
equal('candidate migration ID',api?.migrationId,contract.candidate.migrationId);
equal('candidate checkpoint kind',api?.checkpointKind,contract.candidate.checkpointKind);
equal('candidate direct-origin kind',api?.directOriginKind,contract.candidate.directOriginKind);
check('candidate exposes every required function',contract.candidate.requiredFunctions.every(name=>typeof api?.[name]==='function'),Object.keys(api||{}));
check('candidate exposes no credit, spend, reward, or Level mutation API',contract.candidate.forbiddenMutationFunctions.every(name=>!Object.hasOwn(api||{},name)),Object.keys(api||{}));
check('candidate source has no storage, DOM, network, timer, or messaging authority',!/(?:\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b|\.setItem\s*\(|\.removeItem\s*\(|\bdocument\b|\bwindow\b|\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bpostMessage\s*\(|\bsetTimeout\s*\(|\bsetInterval\s*\()/m.test(source));
check('candidate source contains no authored EXP credit, spend, reward, or Level grant operation',!/(?:wallet\.(?:balance|creditedTotal|spentTotal)\s*[+\-]=|\.level\s*[+\-]=|applyReward|grantLevel|settlePending)/m.test(source));

equal('candidate sha256 agrees with Node for ASCII',api.sha256('Everstead Phase 24L'),hash('Everstead Phase 24L'));
equal('candidate sha256 agrees with Node for Unicode',api.sha256('Everstead 🌲 — 経験値'),hash('Everstead 🌲 — 経験値'));
equal('candidate canonicalization is key-order stable',api.canonicalStringify({z:2,a:[3,{y:true,x:null}]}),api.canonicalStringify({a:[3,{x:null,y:true}],z:2}));
rejects('candidate canonicalization rejects cycles',()=>{const row={};row.self=row;api.canonicalStringify(row)},/acyclic/i);
rejects('candidate canonicalization rejects non-finite numbers',()=>api.canonicalStringify({value:Infinity}),/finite/i);

for(const [relative,key] of [
  ['index.html','indexSha256'],
  ['src/phase24l-profile-shell.js','profileJsSha256'],
  ['src/phase24l-profile-shell.css','profileCssSha256'],
  ['package.json','packageSha256']
]){
  const actual=hash(baselineFile(relative));
  equal(`contract pins predecessor ${relative}`,actual,contract.predecessor[key]);
}
equal('current profile JS remains byte-identical to predecessor',fileHash('src/phase24l-profile-shell.js'),contract.predecessor.profileJsSha256);
equal('current profile CSS remains byte-identical to predecessor',fileHash('src/phase24l-profile-shell.css'),contract.predecessor.profileCssSha256);
equal('removing explicit Phase 24L-B0 blocks restores the exact predecessor index',hash(phase24lProjection(index)),contract.predecessor.indexSha256);

const scriptMatches=[...index.matchAll(/<script src="src\/phase24l-exp-foundation\.js(?:\?[^"<]*)?"><\/script>/g)],scriptOffset=scriptMatches[0]?.index??-1,integrationOffset=index.indexOf('/* Phase 24L-B0 schema-15 banked EXP foundation BEGIN */');
check('production loads the pure schema-15 foundation exactly once before coordinator integration',scriptMatches.length===1&&scriptOffset>=0&&scriptOffset<integrationOffset,{matches:scriptMatches.length,scriptOffset,integrationOffset});
check('production binds the exact Phase 24L API contract',index.includes("PHASE_24L_EXP_FOUNDATION.version!==1")&&index.includes("PHASE_24L_EXP_FOUNDATION.status!=='schema-15-foundation'")&&index.includes("PHASE_24L_EXP_FOUNDATION.successorSchema!==15"));
check('production declares the exact write-once pre-v15 storage key',index.includes("const PRE_V15_BACKUP_KEY=NS+'__raw_backup_v14'"));
check('production expands recovery to format 4 with 16 semantic and 19 physical slots',index.includes('PHASE_24L_SAVE_FORMAT_VERSION=4')&&index.includes("PHASE_24L_SAVE_SLOT_NAMES=Object.freeze([...PHASE_24C2C_SAVE_SLOT_NAMES,'preV15'])")&&index.includes("PHASE_24L_SAVE_SNAPSHOT_KEYS=Object.freeze([...PHASE_24L_SAVE_SLOT_NAMES,'ordinaryStaging','journal','rollback'])"));
check('schema-14 migration staging is explicitly classified as migration',index.includes("envelope.source!==PHASE_24L_MIGRATION_STAGING_SOURCE||envelope.transactionClass!=='migration'")&&index.includes("envelope.source===PHASE_24L_MIGRATION_STAGING_SOURCE&&envelope.transactionClass==='migration'"));
check('migration revision overflow is refused before schema-15 construction',source.includes('predecessor.saveMeta.revision>=Number.MAX_SAFE_INTEGER')&&source.indexOf('predecessor.saveMeta.revision>=Number.MAX_SAFE_INTEGER')<source.indexOf('const state=clone(predecessor)'));
check('production QA bridge is hidden and doubly query gated',index.includes("Object.defineProperty(window,'__EVERSTEAD_PHASE_24L_B0_QA__'")&&index.includes('QA_ALLOW_DESTRUCTIVE&&qaBridgeAllowed()&&phase24lQaQueryAllowed()')&&index.includes("getAll('phase24l-exp-qa')"));
check('schema-15 boot suppresses predecessor-only QA installers',index.includes('Phase 24L-B0 predecessor Phase 23 QA compatibility BEGIN')&&index.includes('CURRENT_SCHEMA_VERSION>=15?false')&&index.includes('Phase 24L-B0 predecessor Phase 24C QA guard open BEGIN'));

const changed=new Set([
  ...git(['diff','--name-only',contract.predecessor.commit,'--']).split('\n').filter(Boolean),
  ...git(['ls-files','--others','--exclude-standard']).split('\n').filter(Boolean)
]);
const allowed=pathName=>contract.allowedSuccessorPaths.some(entry=>pathName===entry||pathName.startsWith(`${entry}/`));
check('only explicit schema/artifact successor paths differ from predecessor',[...changed].every(allowed),[...changed].filter(pathName=>!allowed(pathName)));

const migratedByName=new Map();
for(const name of contract.fixtures){
  const predecessor=fixture(name),before=clone(predecessor),raw=rawFixture(name),bundle=checkpointBundle(api,name,predecessor);
  equal(`${name}: fixture raw is exact JSON.stringify bytes`,bundle.raw,raw);
  equal(`${name}: checkpoint records predecessor save`,bundle.captured.saveId,predecessor.saveMeta.saveId);
  equal(`${name}: checkpoint records exact raw byte length`,bundle.captured.exactByteLength,new TextEncoder().encode(raw).length);
  equal(`${name}: checkpoint raw identity is independently correct`,bundle.captured.rawIdentity,hash(raw));
  equal(`${name}: checkpoint semantic identity is independently correct`,bundle.captured.semanticIdentity,hash(api.canonicalStringify(predecessor)));
  check(`${name}: captured checkpoint is not falsely write-once attested`,bundle.captured.writeOnceVerified===false);
  check(`${name}: reread attestation is frozen and write-once verified`,bundle.attested.writeOnceVerified===true&&Object.isFrozen(bundle.attested));
  check(`${name}: attestation identity changes when write-once status changes`,bundle.attested.identity!==bundle.captured.identity);
  rejects(`${name}: checkpoint rejects foreign raw collision`,()=>api.attestPredecessorCheckpoint(bundle.captured,{rereadRaw:JSON.stringify({...predecessor,gold:predecessor.gold+1})}),/verify|attestation/i);
  rejects(`${name}: checkpoint rejects non-JSON bytes`,()=>api.attestPredecessorCheckpoint(bundle.captured,{rereadRaw:'not-json'}),/verify|JSON|attestation/i);

  const migrated=migrate(api,name,predecessor),state=migrated.result.state,rootState=state[contract.candidate.rootKey];
  migratedByName.set(name,migrated);
  equal(`${name}: migration leaves caller input byte-exact`,predecessor,before);
  check(`${name}: migration result and successor state are deeply frozen`,Object.isFrozen(migrated.result)&&Object.isFrozen(state)&&Object.isFrozen(rootState)&&Object.isFrozen(rootState.wallets.fellow)&&Object.isFrozen(rootState.ledger.entries));
  equal(`${name}: successor schema is 15`,state.schemaVersion,15);
  equal(`${name}: migration advances revision exactly once`,state.saveMeta.revision,predecessor.saveMeta.revision+1);
  equal(`${name}: migration activation time is explicit`,state.saveMeta.updatedAt,migrated.now);
  equal(`${name}: every non-meta gameplay domain is byte-preserved`,preservedTopLevel(state),preservedTopLevel(predecessor));
  equal(`${name}: immutable save metadata is preserved`,preservedSaveMeta(state),preservedSaveMeta(predecessor));
  equal(`${name}: Fellow and Companion EXP, Level, Power, rank, shards, bonds, relics, and assignments are exact`,actorProgression(state),actorProgression(predecessor));
  equal(`${name}: pending rewards/offers/Tower carry remain pending and unconverted`,pendingProjection(state),pendingProjection(predecessor));
  check(`${name}: root has exact zero-wallet topology`,exactKeys(rootState,contract.rootTopology.keys)&&exactKeys(rootState.baselines,contract.rootTopology.baselineKeys)&&exactKeys(rootState.wallets,contract.rootTopology.walletRosters)&&contract.rootTopology.walletRosters.every(roster=>exactKeys(rootState.wallets[roster],contract.rootTopology.walletKeys))&&exactKeys(rootState.ledger,contract.rootTopology.ledgerKeys)&&exactKeys(rootState.migration,contract.rootTopology.migrationKeys));
  equal(`${name}: Fellow baseline captures every actor invested EXP`,rootState.baselines.fellowExpById,Object.fromEntries([...FELLOW_IDS].sort().map(id=>[id,predecessor.fellows[id].exp])));
  equal(`${name}: Companion baseline captures every actor invested EXP`,rootState.baselines.companionExpById,Object.fromEntries([...COMPANION_IDS].sort().map(id=>[id,predecessor.companions[id].exp])));
  check(`${name}: immutable baselines never exceed live actor EXP`,FELLOW_IDS.every(id=>rootState.baselines.fellowExpById[id]<=state.fellows[id].exp)&&COMPANION_IDS.every(id=>rootState.baselines.companionExpById[id]<=state.companions[id].exp));
  for(const roster of contract.rootTopology.walletRosters)equal(`${name}: ${roster} wallet starts at exact zero`,rootState.wallets[roster],{balance:0,creditedTotal:0,spentTotal:0});
  check(`${name}: ledger starts empty at sequence zero with an identity`,rootState.ledger.version===1&&rootState.ledger.throughSequence===0&&rootState.ledger.entryCount===0&&rootState.ledger.entries.length===0&&/^[0-9a-f]{64}$/.test(rootState.ledger.foldedIdentity),rootState.ledger);
  check(`${name}: migration records only attested predecessor identities`,rootState.migration.lineageKind==='schema-14-to-15-migration'&&rootState.migration.predecessorRawIdentity===bundle.attested.rawIdentity&&rootState.migration.predecessorSemanticIdentity===bundle.attested.semanticIdentity&&rootState.migration.predecessorCheckpointIdentity===bundle.attested.identity&&rootState.migration.directOriginAttestation===null);
  const receipts=state.saveMeta.appliedMigrations.filter(item=>item?.id===contract.candidate.migrationId),receipt=receipts[0];
  check(`${name}: migration receipt is exactly-once and reward neutral`,receipts.length===1&&receipt?.rewardApplications===0&&receipt?.pendingEntitlementsConverted===false&&migrated.result.rewardApplications===0&&migrated.result.walletApplications===0,receipt);
  check(`${name}: successor validates with exact attested checkpoint metadata and raw`,api.validateSuccessorState(state,validationOptions(bundle)).ok,api.validateSuccessorState(state,validationOptions(bundle)).errors);
  check(`${name}: raw-only checkpoint resolution fails closed`,!api.validateSuccessorState(state,{validatePredecessor:predecessorValidator,resolvePredecessorCheckpoint:()=>bundle.raw}).ok);
  check(`${name}: captured-but-unattested checkpoint metadata fails closed`,!api.validateSuccessorState(state,{validatePredecessor:predecessorValidator,resolvePredecessorCheckpoint:()=>({checkpoint:bundle.captured,raw:bundle.raw})}).ok);
  check(`${name}: unresolved checkpoint fails closed`,!api.validateSuccessorState(state,{validatePredecessor:predecessorValidator,resolvePredecessorCheckpoint:()=>null}).ok);
  const repeatBefore=api.canonicalStringify(state);
  rejects(`${name}: repeat schema-14 migration refuses current schema without mutation`,()=>api.migrateSchema14To15(state,{now:migrated.now+1,predecessorValidatorId:'validator.schema-14.phase24l.qa.v1',validatePredecessor:predecessorValidator,predecessorCheckpoint:bundle.attested,resolvePredecessorCheckpoint:bundle.resolve}),/schema-14|Authenticated/i);
  equal(`${name}: refused repeat migration is byte-idempotent`,api.canonicalStringify(state),repeatBefore);
}

for(const lineageKind of ['direct-schema-15','safe-reset-schema-15']){
  const name=lineageKind==='direct-schema-15'?'fresh':'established',origin=fixture(name),before=clone(origin),validatorId=`validator.${lineageKind}.phase24l.qa.v1`;
  const result=api.createDirectSchema15(origin,{lineageKind,directOriginValidatorId:validatorId,validateDirectOrigin:directOriginValidator});
  const state=result.state,attestation=result.attestation,rootState=state[contract.candidate.rootKey];
  equal(`${lineageKind}: caller-owned origin remains byte-exact`,origin,before);
  equal(`${lineageKind}: gameplay state is byte-preserved`,preservedTopLevel(state),preservedTopLevel(origin));
  equal(`${lineageKind}: actor progression is byte-preserved`,actorProgression(state),actorProgression(origin));
  check(`${lineageKind}: authentic independent direct origin is recorded`,rootState.migration.lineageKind===lineageKind&&rootState.migration.predecessorSemanticIdentity===null&&rootState.migration.predecessorRawIdentity===null&&rootState.migration.predecessorCheckpointIdentity===null&&rootState.migration.directOriginAttestation.identity===attestation.identity);
  check(`${lineageKind}: creates no migration receipt and no reward/wallet applications`,state.saveMeta.appliedMigrations.every(item=>item?.id!==contract.candidate.migrationId)&&result.rewardApplications===0&&result.walletApplications===0);
  const options={validatePredecessor:predecessorValidator,validateDirectOrigin:directOriginValidator,resolveDirectOrigin:identity=>identity===attestation.identity?{state:origin}:null};
  check(`${lineageKind}: successor validates only with independently resolved origin`,api.validateSuccessorState(state,options).ok,api.validateSuccessorState(state,options).errors);
  check(`${lineageKind}: unresolved direct origin fails closed`,!api.validateSuccessorState(state,{...options,resolveDirectOrigin:()=>null}).ok);
}

const established=migratedByName.get('established'),validState=established.result.state,validOptions=validationOptions(established);
const tampers=[
  ['schema',state=>{state.schemaVersion=14}],
  ['missing-root',state=>{delete state.experienceProgression}],
  ['extra-root-key',state=>{state.experienceProgression.unexpected=true}],
  ['fellow-wallet-balance',state=>{state.experienceProgression.wallets.fellow.balance=1}],
  ['companion-credited-total',state=>{state.experienceProgression.wallets.companion.creditedTotal=1}],
  ['fellow-spent-total',state=>{state.experienceProgression.wallets.fellow.spentTotal=1}],
  ['baseline-exp',state=>{state.experienceProgression.baselines.fellowExpById.cael+=1}],
  ['ledger-entry',state=>{state.experienceProgression.ledger.entries.push({id:'forged'})}],
  ['ledger-count',state=>{state.experienceProgression.ledger.entryCount=1}],
  ['ledger-identity',state=>{state.experienceProgression.ledger.foldedIdentity='0'.repeat(64)}],
  ['migration-baseline-identity',state=>{state.experienceProgression.migration.baselineIdentity='0'.repeat(64)}],
  ['migration-wallet-identity',state=>{state.experienceProgression.migration.walletIdentity='0'.repeat(64)}],
  ['receipt-reward-applications',state=>{state.saveMeta.appliedMigrations.at(-1).rewardApplications=1}],
  ['receipt-pending-conversion',state=>{state.saveMeta.appliedMigrations.at(-1).pendingEntitlementsConverted=true}],
  ['receipt-identity',state=>{state.saveMeta.appliedMigrations.at(-1).identity='f'.repeat(64)}]
];
for(const [name,mutate] of tampers){const state=clone(validState);mutate(state);const validation=api.validateSuccessorState(state,validOptions);check(`tamper refuses ${name}`,validation.ok===false,validation.errors)}
for(const [roster,id] of [['fellows','cael'],['companions','arcanine']]){
  const state=clone(validState),baselineKey=roster==='fellows'?'fellowExpById':'companionExpById';
  state[roster][id].exp=state.experienceProgression.baselines[baselineKey][id]-1;
  check(`tamper refuses ${roster} live EXP below immutable migration baseline`,api.validateSuccessorState(state,validOptions).ok===false,api.validateSuccessorState(state,validOptions).errors);
}
const legacyProgression=clone(validState),legacyRootBefore=clone(validState.experienceProgression);
legacyProgression.fellows.cael.exp+=500;legacyProgression.fellows.cael.level+=1;
legacyProgression.companions.arcanine.exp+=750;legacyProgression.companions.arcanine.level+=1;
check('unchanged legacy actor EXP/Level behavior remains valid while wallets are dormant',api.validateSuccessorState(legacyProgression,validOptions).ok===true,api.validateSuccessorState(legacyProgression,validOptions).errors);
equal('legacy actor progression leaves immutable baselines, zero wallets, and empty ledger untouched',legacyProgression.experienceProgression,legacyRootBefore);
check('predecessor validator false result fails closed',!api.validateSuccessorState(validState,{...validOptions,validatePredecessor:()=>false}).ok);
check('predecessor validator exception fails closed',!api.validateSuccessorState(validState,{...validOptions,validatePredecessor:()=>{throw new Error('hostile')}}).ok);
const projection=api.currentSchema14Projection(validState),projectionBefore=clone(validState);
check('current schema-14 projection removes only successor root and receipt',projection.schemaVersion===14&&!Object.hasOwn(projection,'experienceProgression')&&projection.saveMeta.appliedMigrations.every(item=>item?.id!==contract.candidate.migrationId));
projection.fellows.cael.exp+=99;
equal('mutating a current schema-14 projection cannot mutate successor',validState,projectionBefore);

const overflow=fixture('established');overflow.saveMeta.revision=Number.MAX_SAFE_INTEGER;
const overflowBundle=checkpointBundle(api,'overflow',overflow);
const overflowBefore=clone(overflow);
rejects('migration refuses revision safe-integer overflow before mutation',()=>api.migrateSchema14To15(overflow,{now:overflow.saveMeta.updatedAt+1,predecessorValidatorId:'validator.schema-14.phase24l.qa.v1',validatePredecessor:predecessorValidator,predecessorCheckpoint:overflowBundle.attested,resolvePredecessorCheckpoint:overflowBundle.resolve}),/revision|safe|overflow/i);
equal('overflow refusal leaves predecessor byte-exact',overflow,overflowBefore);

const hostile=fixture('established'),hostileBefore=clone(hostile),hostileBundle=checkpointBundle(api,'hostile',hostile);
rejects('mutating predecessor validator cannot alter migration origin',()=>api.migrateSchema14To15(hostile,{now:hostile.saveMeta.updatedAt+1,predecessorValidatorId:'validator.hostile.phase24l.qa.v1',validatePredecessor:value=>{value.fellows.cael.exp+=1;return true},predecessorCheckpoint:hostileBundle.attested,resolvePredecessorCheckpoint:hostileBundle.resolve}),/validator|mutation|checkpoint|Authenticated|read only/i);
equal('hostile predecessor validator leaves caller input byte-exact',hostile,hostileBefore);
const directHostile=fixture('fresh'),directHostileBefore=clone(directHostile);
rejects('mutating direct-origin validator cannot alter direct origin',()=>api.createDirectSchema15(directHostile,{lineageKind:'direct-schema-15',directOriginValidatorId:'validator.hostile-direct.phase24l.qa.v1',validateDirectOrigin:value=>{value.companions.arcanine.level+=1;return true}}),/validator|mutation|origin|Authenticated|read only/i);
equal('hostile direct-origin validator leaves caller input byte-exact',directHostile,directHostileBefore);

const manifestLines=read('qa/phase-24l-exp-foundation/checksums.sha256').trim().split(/\r?\n/).filter(Boolean);
const manifestEntries=manifestLines.map(line=>{const match=line.match(/^([0-9a-f]{64})  (.+)$/);return match?{expected:match[1],relative:match[2]}:null});
check('frozen manifest has only canonical SHA-256 entries',manifestEntries.every(Boolean)&&manifestEntries.length===10,manifestLines);
for(const entry of manifestEntries.filter(Boolean))equal(`frozen artifact matches ${entry.relative}`,fileHash(entry.relative),entry.expected);

for(const failure of failures)console.error(`FAIL ${failure.name}${failure.detail?` · ${failure.detail}`:''}`);
console.log(`RESULT ${passed} passed, ${failed} failed`);
if(failed)process.exitCode=1;
