import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const require=createRequire(import.meta.url);
require(path.join(root,'src/phase24c-durable-definitions.js'));
require(path.join(root,'src/phase24c-durable-foundation.js'));
const definitions=globalThis.EVERSTEAD_PHASE24C_DEFINITIONS;
const foundation=globalThis.EVERSTEAD_PHASE24C_FOUNDATION;
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));

let passed=0,failed=0;
const failures=[];
function check(name,condition,detail=''){
  if(condition){passed++;return}
  failed++;failures.push({name,detail:String(detail)});
}
function equal(name,actual,expected){check(name,foundation.canonicalStringify(actual)===foundation.canonicalStringify(expected),`actual=${JSON.stringify(actual)} expected=${JSON.stringify(expected)}`)}
function rejects(name,fn,pattern){try{fn();check(name,false,'did not throw')}catch(error){check(name,pattern.test(String(error?.message||error)),error?.message)}}
function shaFile(relative){return crypto.createHash('sha256').update(fs.readFileSync(path.join(root,relative))).digest('hex')}
function shaText(value){return crypto.createHash('sha256').update(value).digest('hex')}
function deep(value){return JSON.parse(JSON.stringify(value))}
function c2cProjection(source){
  const loaderPattern=/[\t ]*<!-- Phase 24C-2C zero-only authority load BEGIN -->[\s\S]*?<!-- Phase 24C-2C zero-only authority load END -->(?:\r?\n)?/g,jsPattern=/(^[\t ]*)?\/\* Phase 24C-2C ([^\r\n*]+?) BEGIN \*\/[\s\S]*?\/\* Phase 24C-2C \2 END \*\/(?:\r?\n)?/gm,loaders=[...source.matchAll(loaderPattern)];let normalized=source.replace(loaderPattern,'');normalized=normalized.replace(jsPattern,'');const loader=loaders[0]?.[0]||'',loaderSources=[...loader.matchAll(/<script\s+[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi)].map(match=>match[1].split('?')[0]);return{normalized,loaderSources,loaderCount:loaders.length,beginCount:(source.match(/<!-- Phase 24C-2C zero-only authority load BEGIN -->/g)||[]).length,endCount:(source.match(/<!-- Phase 24C-2C zero-only authority load END -->/g)||[]).length}}
function validateSchema13(value){
  return Boolean(value&&value.schemaVersion===13&&value.saveMeta&&typeof value.saveMeta.saveId==='string'&&value.saveMeta.saveId&&Number.isSafeInteger(value.saveMeta.revision)&&value.saveMeta.revision>=1&&Number.isSafeInteger(value.saveMeta.createdAt)&&Number.isSafeInteger(value.saveMeta.updatedAt)&&value.saveMeta.updatedAt>=value.saveMeta.createdAt&&typeof value.saveMeta.source==='string'&&value.saveMeta.source&&Array.isArray(value.saveMeta.appliedMigrations)&&value.player&&Number.isSafeInteger(value.player.rankExp)&&value.player.rankExp>=0&&Number.isSafeInteger(value.gold)&&value.gold>=0&&value.family&&typeof value.family==='object'&&!Array.isArray(value.family));
}
const validatorId='validator.schema-13.phase-24c-fixture.v1';
const directOriginValidatorId='validator.direct-schema-14-origin.phase-24c-fixture.v1';
function predecessor({id='save-direct',throughMigration=false,rankExp=12000,gold=5000}={}){
  return{schemaVersion:13,saveMeta:{saveId:id,revision:7,createdAt:1000,updatedAt:2000,source:'phase-23-fixture',appliedMigrations:throughMigration?[{id:'schema-12-to-13',from:12,to:13,receiptVersion:1}]:[]},gold,player:{rankExp},family:{}};
}
function migrate(input,raw=JSON.stringify(input,null,2)){
  const captured=foundation.capturePreSuccessorCheckpoint(input,raw,{checkpointId:`checkpoint.pre-v14.${input.saveMeta.saveId}.v1`});
  const checkpoint=foundation.attestPreSuccessorCheckpoint(captured,{rereadRaw:raw});
  const context={validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,resolvePredecessorCheckpoint:identity=>identity===checkpoint.identity?{checkpoint,raw}:null};
  const result=foundation.migrateSchema13To14(input,{...context,now:3000,predecessorCheckpoint:checkpoint});
  return{...result,checkpoint,raw,context};
}
function directOrigin({id='save-direct-schema14',reset=false}={}){
  const state={schemaVersion:13,saveMeta:{saveId:id,revision:1,createdAt:1000,updatedAt:1000,source:reset?'safe-reset':'fresh',appliedMigrations:[]},gold:5000,player:{rankExp:0},family:{}};
  if(reset)state.saveMeta.retainedCheckpointLineage={kind:'phase24c-qa-safe-reset-attestation',saveId:id,resetAt:1000,preResetSaveId:'save-prior',preResetRevision:9,preResetActiveRawIdentity:'fnv1a32:1:00000000'};
  return state;
}
function validateDirectOrigin(value,lineageKind){
  if(!validateSchema13(value)||value.saveMeta.revision!==1||value.saveMeta.createdAt!==value.saveMeta.updatedAt)return false;
  if(lineageKind==='direct-schema-14')return value.saveMeta.source==='fresh'&&!Object.hasOwn(value.saveMeta,'retainedCheckpointLineage');
  return lineageKind==='safe-reset-schema-14'&&value.saveMeta.source==='safe-reset'&&value.saveMeta.retainedCheckpointLineage?.saveId===value.saveMeta.saveId&&typeof value.saveMeta.retainedCheckpointLineage?.preResetSaveId==='string'&&value.saveMeta.retainedCheckpointLineage.preResetSaveId!==value.saveMeta.saveId;
}
function activateDirect(input,lineageKind){
  const origins=new Map(),context={validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,validateDirectOrigin,directOriginValidatorId,resolveDirectOrigin:identity=>origins.get(identity)||null};
  const result=foundation.createDirectSchema14(input,{...context,lineageKind});origins.set(result.attestation.identity,deep(input));
  return{...result,context,origins};
}
function forensicNullOrigin({id,rawIdentity}){
  const state=directOrigin({id,reset:true});
  state.saveMeta.retainedCheckpointLineage={kind:'safe-reset-retained-checkpoints',version:9,saveId:id,resetAt:state.saveMeta.createdAt,preResetSaveId:null,preResetRevision:null,preResetActiveRawIdentity:rawIdentity,phase24cPreviousInstallationIdentity:'a'.repeat(64)};
  return state;
}
function activateForensicNull(input,validator){
  const origins=new Map(),context={validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,validateDirectOrigin:validator,directOriginValidatorId,resolveDirectOrigin:identity=>origins.get(identity)||null};
  const result=foundation.createDirectSchema14(input,{...context,lineageKind:'safe-reset-schema-14'});origins.set(result.attestation.identity,deep(input));
  return{...result,context,origins};
}
function futureAuthority(count=24){
  const authority=deep(definitions),release=authority.releaseManifests[0];release.status='active';release.active=true;
  const targets=['power','earnings','exp','facility'];
  for(let index=1;index<=count;index++){
    const targetPool=targets[(index-1)%targets.length],definition={id:`collection.grant.fixture-${index}.v1`,releaseId:release.id,definitionVersion:1,rewardVersion:1,classification:'permanent',permanentAlternativeId:null,claimSourceId:`claim.fixture-${index}.v1`,targetPool,facilityId:targetPool==='facility'?'facility.restaurant':null,bps:index===count?100000:500,releaseState:'active'};
    authority.collections.grantDefinitions.push(definition);release.collectionGrantDefinitionIds.push(definition.id);
  }
  sealActiveAuthority(authority,['content.phase-24c.collection-fixture.v1']);
  return authority;
}
function sealActiveAuthority(authority,contentDependencyIds){
  return sealRelease(authority,authority.releaseManifests.find(row=>row.active),contentDependencyIds);
}
function ensureApprovedSimulationPackage(authority,release){
  const id=`simulation.approved.${release.id}`;
  let simulationPackage=authority.simulationPackages.find(row=>row.id===id);
  if(!simulationPackage){
    const hash=label=>foundation.sha256(`synthetic-phase24c-qa:${release.id}:${label}`);
    simulationPackage={id,version:1,status:'approved-private-candidate',artifactHashes:{contractSha256:hash('contract'),candidateSha256:hash('candidate'),generatorSha256:hash('generator'),machineReportSha256:hash('machine-report'),humanReportSha256:hash('human-report'),modelManifestSha256:hash('model-manifest'),independentQaContractSha256:hash('independent-contract'),independentQaResultSha256:hash('independent-result'),independentFixtureSha256:hash('independent-fixture'),independentVerifierSha256:hash('independent-verifier'),independentManifestSha256:hash('independent-manifest')},tableHashes:{requirements:hash('requirements'),rank:hash('rank'),collections:hash('collections')},requirementActivationApproved:true,collectionGrantActivationApproved:true,runtimeCurveActivationApproved:true,rewardThroughputApproved:true};
    authority.simulationPackages.push(simulationPackage);
  }
  release.simulationPackageId=id;
  return simulationPackage;
}
function sealRelease(authority,release,contentDependencyIds,requirementTableIds=null){
  const simulationPackage=ensureApprovedSimulationPackage(authority,release);release.contentDependencyIds=[...contentDependencyIds];release.limitedContentRequired=false;const tableIds=requirementTableIds||definitions.requirements.tables.map(row=>row.id),obtainable=authority.collections.grantDefinitions.filter(grant=>{const owner=authority.releaseManifests.find(row=>row.id===grant.releaseId);return owner?.active&&owner.sequence<=release.sequence&&grant.releaseState==='active'}),permanentIds=obtainable.filter(grant=>grant.classification==='permanent').map(grant=>grant.id).sort(),alternativeTargets=new Set(obtainable.filter(grant=>grant.classification==='limited-with-permanent-alternative').map(grant=>grant.permanentAlternativeId)),allIds=obtainable.filter(grant=>!alternativeTargets.has(grant.id)).map(grant=>grant.id).sort(),kinds=[['zero-permanent',[]],['median-permanent',permanentIds.slice(0,Math.ceil(permanentIds.length/2))],['high-permanent',permanentIds],['high-all-content',allIds]],profiles=[];
  for(const[kind,ids]of kinds){let totals={powerBps:0,earningsBps:0,expBps:0,facilityBpsByFacilityId:{}};for(const id of ids){const grant=authority.collections.grantDefinitions.find(row=>row.id===id);if(grant.targetPool==='facility')totals.facilityBpsByFacilityId[grant.facilityId]=(totals.facilityBpsByFacilityId[grant.facilityId]||0)+grant.bps;else totals[`${grant.targetPool}Bps`]+=grant.bps}const profile={id:`requirements.fixture.${kind}.${release.id}`,version:1,kind,ownershipBand:kind,status:'accepted-private-candidate',contributingDefinitionIds:ids,collectionBpsByPool:totals,limitedContentRequired:kind==='high-all-content'&&ids.some(id=>authority.collections.grantDefinitions.find(row=>row.id===id).classification!=='permanent'),requirementTableIds:[...tableIds],fixtureReportIdentity:''};profile.fixtureReportIdentity=foundation.releaseSetIdentity('fixture-report',{...deep(profile),fixtureReportIdentity:''});profiles.push(profile)}
  const priorProfileIds=release.requirementFixtureProfileIds||[];authority.requirements.permanentOnlyProfiles=authority.requirements.permanentOnlyProfiles.filter(profile=>!priorProfileIds.includes(profile.id));authority.requirements.permanentOnlyProfiles.push(...profiles);release.requirementFixtureProfileIds=profiles.map(profile=>profile.id);const highPermanent=profiles.find(profile=>profile.kind==='high-permanent');release.permanentOnlyRequirementProfileId=highPermanent.id;
  const tableRows=authority.requirements.tables.filter(row=>tableIds.includes(row.id)).sort((a,b)=>a.id.localeCompare(b.id)),releaseGrants=release.collectionGrantDefinitionIds.map(id=>authority.collections.grantDefinitions.find(row=>row.id===id)).sort((a,b)=>a.id.localeCompare(b.id)),rankRows=authority.rank.table.slice(authority.rank.releasedThrough,release.releasedRankThrough);
  let permanentTotals={powerBps:0,earningsBps:0,expBps:0,facilityBpsByFacilityId:{}},limitedTotals={powerBps:0,earningsBps:0,expBps:0,facilityBpsByFacilityId:{}};for(const grant of obtainable){const totals=grant.classification==='permanent'?permanentTotals:limitedTotals;if(grant.targetPool==='facility')totals.facilityBpsByFacilityId[grant.facilityId]=(totals.facilityBpsByFacilityId[grant.facilityId]||0)+grant.bps;else totals[`${grant.targetPool}Bps`]+=grant.bps}
  let highAllTotals={powerBps:0,earningsBps:0,expBps:0,facilityBpsByFacilityId:{}};for(const id of allIds){const grant=authority.collections.grantDefinitions.find(row=>row.id===id);if(grant.targetPool==='facility')highAllTotals.facilityBpsByFacilityId[grant.facilityId]=(highAllTotals.facilityBpsByFacilityId[grant.facilityId]||0)+grant.bps;else highAllTotals[`${grant.targetPool}Bps`]+=grant.bps}
  release.activationEvidence={predecessorScalingIdentity:foundation.releaseSetIdentity('predecessor-scaling',authority.predecessorScaling),simulationPackageIdentity:foundation.releaseSetIdentity('simulation-package',simulationPackage),contentDependencySetIdentity:foundation.releaseSetIdentity('content-dependencies',[...release.contentDependencyIds].sort()),rankDefinitionSetIdentity:foundation.releaseSetIdentity('rank-definitions',rankRows),collectionGrantDefinitionSetIdentity:foundation.releaseSetIdentity('collection-grants',releaseGrants),requirementTableSetIdentity:foundation.releaseSetIdentity('requirement-tables',tableRows),fixtureProfileSetIdentity:foundation.releaseSetIdentity('fixture-profiles',[...profiles].sort((a,b)=>a.id.localeCompare(b.id))),permanentOnlyProfileIdentity:foundation.releaseSetIdentity('permanent-only-profile',highPermanent),obtainablePermanentTotals:permanentTotals,obtainableLimitedTotals:limitedTotals,obtainableHighAllTotals:highAllTotals,releaseBudgetReportSha256:foundation.sha256(`external-budget-report:${release.id}`),longHorizonReportSha256:foundation.sha256(`external-long-horizon-report:${release.id}`),safeIntegerReportSha256:foundation.sha256(`external-safe-integer-report:${release.id}`)};
  return authority;
}
function activateDetached(state,authority){const next=deep(state);next.durableProgression.manifestHash=foundation.authorityHash(authority);next.durableProgression.activeReleaseIds=authority.releaseManifests.filter(row=>row.active).map(row=>row.id).sort();next.durableProgression.ladders.rank.releasedThrough=Math.max(authority.rank.releasedThrough,...authority.releaseManifests.filter(row=>row.active).map(row=>row.releasedRankThrough));return next}
function checkpointIdentity(saveId,checkpoint){const projection={...deep(checkpoint),identity:''};return foundation.sha256(foundation.canonicalStringify(['phase24c.collection-checkpoint.v2',saveId,projection]))}

check('SHA-256 known answer',foundation.sha256('abc')==='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
check('foundation API is reopened version 2 only',foundation.version===2&&contract.foundationVersion===2&&foundation.status==='inactive-foundation-only');
check('definitions exact validator passes',foundation.validateDefinitions().ok,foundation.validateDefinitions().errors);
check('inactive release authority passes',foundation.validateReleaseAuthority().ok,foundation.validateReleaseAuthority().errors);
check('foundation manifest pinned',foundation.manifestHash===contract.expectedFoundation.definitionsManifestSha256,foundation.manifestHash);
for(const[relative,expected]of Object.entries(contract.expectedProductionSha256))if(relative!=='index.html')check(`production hash ${relative}`,shaFile(relative)===expected,shaFile(relative));
check('definitions file hash',shaFile('src/phase24c-durable-definitions.js')===contract.expectedFoundation.definitionsFileSha256,shaFile('src/phase24c-durable-definitions.js'));
check('foundation file hash',shaFile('src/phase24c-durable-foundation.js')===contract.expectedFoundation.foundationFileSha256,shaFile('src/phase24c-durable-foundation.js'));
const indexText=fs.readFileSync(path.join(root,'index.html'),'utf8');
const projected=c2cProjection(indexText);
check('production index projects exactly to accepted C2B bytes',shaText(projected.normalized)===contract.expectedProductionSha256['index.html'],shaText(projected.normalized));
check('production index has one exact least-authority C2C loader',projected.loaderCount===1&&projected.beginCount===1&&projected.endCount===1&&foundation.canonicalStringify(projected.loaderSources)===foundation.canonicalStringify(contract.zeroIntegrationLoader.exactOrder),projected.loaderSources);

for(const mutation of [
  value=>{value.acceptedSimulation.contractSha256='0'.repeat(64)},
  value=>{value.acceptedSimulation.tableHashes.fellow='0'.repeat(64)},
  value=>{value.rank.table[1].contentDependencyIds=['story.bogus']},
  value=>{value.requirements.tables[1].rows[0]++},
  value=>{value.requirements.tables[2].rows[49]++},
  value=>{value.requirements.tables[3].rows[49]++},
  value=>{value.collections.pools[0].application='multiply-final'},
  value=>{value.cast.coverage[0].actorId='fellow.unknown'},
  value=>{value.tutorials[0].primaryActorId='family.unknown'},
  value=>{value.facilities.ladders[0].thresholds=[1]},
  value=>{value.releaseManifests[0].active=true}
]){const changed=deep(definitions);mutation(changed);check('exact definition mutation rejected',!foundation.validateDefinitions(changed).ok)}
check('null definition rejected without throw',foundation.validateDefinitions(null).ok===false);
check('partial authority rejected without throw',foundation.validateReleaseAuthority({releaseManifests:null}).ok===false);
const duplicateSourceAuthority=futureAuthority(2);duplicateSourceAuthority.collections.grantDefinitions[1].claimSourceId=duplicateSourceAuthority.collections.grantDefinitions[0].claimSourceId;sealActiveAuthority(duplicateSourceAuthority,['content.phase-24c.collection-fixture.v1']);
check('duplicate Collection claim source rejected',!foundation.validateReleaseAuthority(duplicateSourceAuthority).ok);
for(const mutate of [value=>{value.collections.pools[0].application='multiply-already-boosted-total'},value=>{value.collections.sharedLifetimeCapBps=3000},value=>{value.collections.futureCollectionsContinueRewards=false},value=>{value.collections.mode='capped-multiplicative'}]){const changed=futureAuthority(2);mutate(changed);check('successor authority rejects changed locked Collection semantics',!foundation.validateReleaseAuthority(changed).ok)}
check('locked Collection policy is uncapped continuing permanent-only through +1000%',definitions.collections.futureCollectionsContinueRewards===true&&definitions.collections.releaseBudgetsAreLifetimeCaps===false&&definitions.collections.mandatoryProgressionProfile==='permanent-only'&&definitions.collections.stressThroughBps===100000&&definitions.activation.emptyOriginPolicy==='direct-current-schema-fresh-and-reset');
const repricedRequirementAuthority=futureAuthority(2);repricedRequirementAuthority.requirements.tables[0].rows[0]++;sealActiveAuthority(repricedRequirementAuthority,['content.phase-24c.collection-fixture.v1']);check('successor authority rejects repriced inherited requirement despite recomputed evidence',!foundation.validateReleaseAuthority(repricedRequirementAuthority).ok);
const evidenceFreeAuthority=deep(definitions),evidenceFreeRelease=evidenceFreeAuthority.releaseManifests[0];evidenceFreeRelease.status='active';evidenceFreeRelease.active=true;evidenceFreeRelease.releasedRankThrough=30;
check('active Rank release without content/evidence fails closed',!foundation.validateReleaseAuthority(evidenceFreeAuthority).ok);

const castContract=JSON.parse(fs.readFileSync(path.join(root,'design/phase-15-16/cast-hooks.json'),'utf8'));
const hooksByActor=new Map(castContract.actors.map(row=>[row.actorId,new Set(row.hookIds)]));
for(const row of definitions.cast.coverage){check(`cast actor exists ${row.actorId}`,hooksByActor.has(row.actorId));for(const id of row.scheduledContributionIds)check(`cast scheduled hook resolves ${row.actorId}`,hooksByActor.get(row.actorId)?.has(id),id);check(`cast current coverage is not fabricated ${row.actorId}`,row.verifiedCurrentContributionIds.length===0)}

const migratedResetPredecessor=predecessor({id:'save-migrated-reset'});migratedResetPredecessor.saveMeta.retainedCheckpointLineage={kind:'phase23-safe-reset-lineage-v1',resetAt:1000,preResetSaveId:'save-before-reset',preResetRevision:6,preResetActiveRawIdentity:'fnv1a32:1:00000000'};
const direct=migrate(predecessor()),through=migrate(predecessor({id:'save-through',throughMigration:true})),migratedReset=migrate(migratedResetPredecessor);
const directFresh=activateDirect(directOrigin(),'direct-schema-14'),directReset=activateDirect(directOrigin({id:'save-direct-reset',reset:true}),'safe-reset-schema-14');
let nullValidatorCalls=0;
const nullValidator=(expectedRawIdentity)=>(value,lineageKind)=>{nullValidatorCalls++;const marker=value?.saveMeta?.retainedCheckpointLineage;return validateSchema13(value)&&lineageKind==='safe-reset-schema-14'&&value.saveMeta.source==='safe-reset'&&marker?.version===9&&marker?.kind==='safe-reset-retained-checkpoints'&&marker?.saveId===value.saveMeta.saveId&&marker?.resetAt===value.saveMeta.createdAt&&marker?.preResetSaveId===null&&marker?.preResetRevision===null&&marker?.preResetActiveRawIdentity===expectedRawIdentity&&marker?.phase24cPreviousInstallationIdentity==='a'.repeat(64)};
const forensicMissing=forensicNullOrigin({id:'save-forensic-missing',rawIdentity:'null:0:00000000'}),forensicMissingResult=activateForensicNull(forensicMissing,nullValidator('null:0:00000000'));
check('forensic missing-origin null pair succeeds only through named validator',forensicMissingResult.changed&&nullValidatorCalls===2&&foundation.validateSuccessorState(forensicMissingResult.state,forensicMissingResult.context).ok,foundation.validateSuccessorState(forensicMissingResult.state,forensicMissingResult.context).errors);
const callsAfterMissing=nullValidatorCalls,forensicMalformed=forensicNullOrigin({id:'save-forensic-malformed',rawIdentity:'fnv1a32:1:00000000'}),forensicMalformedResult=activateForensicNull(forensicMalformed,nullValidator('fnv1a32:1:00000000'));
check('forensic malformed-origin null pair succeeds only through named validator',forensicMalformedResult.changed&&nullValidatorCalls===callsAfterMissing+2&&foundation.validateSuccessorState(forensicMalformedResult.state,forensicMalformedResult.context).ok,foundation.validateSuccessorState(forensicMalformedResult.state,forensicMalformedResult.context).errors);
const incompleteNull=forensicNullOrigin({id:'save-forensic-incomplete',rawIdentity:'null:0:00000000'});delete incompleteNull.saveMeta.retainedCheckpointLineage.phase24cPreviousInstallationIdentity;
rejects('forensic null pair with incomplete source binding rejects',()=>activateForensicNull(incompleteNull,()=>true),/canonical direct/);
const forgedNull=forensicNullOrigin({id:'save-forensic-forged-semantic',rawIdentity:'fnv1a32:20:12345678'});
rejects('forged semantic source beside forensic null pair rejects through named validator',()=>activateForensicNull(forgedNull,()=>false),/validators/);
const directMutatingOrigin=directOrigin({id:'save-direct-validator-mutates'}),directMutatingBefore=foundation.canonicalStringify(directMutatingOrigin),directMutatingResult=foundation.createDirectSchema14(directMutatingOrigin,{lineageKind:'direct-schema-14',validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,validateDirectOrigin:value=>{value.gold=0;return true},directOriginValidatorId,resolveDirectOrigin:()=>null});
check('mutating direct-origin validator receives only a clone',directMutatingResult.state.gold===5000&&foundation.canonicalStringify(directMutatingOrigin)===directMutatingBefore);
const directFalseOrigin=directOrigin({id:'save-direct-validator-false'}),directFalseBefore=foundation.canonicalStringify(directFalseOrigin);
rejects('false direct-origin validator refuses activation',()=>foundation.createDirectSchema14(directFalseOrigin,{lineageKind:'direct-schema-14',validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,validateDirectOrigin:value=>{value.gold=0;return false},directOriginValidatorId}),/validators/);
check('false direct-origin validator leaves caller unchanged',foundation.canonicalStringify(directFalseOrigin)===directFalseBefore);
const directThrowOrigin=directOrigin({id:'save-direct-validator-throws'}),directThrowBefore=foundation.canonicalStringify(directThrowOrigin);
rejects('throwing direct-origin validator refuses activation',()=>foundation.createDirectSchema14(directThrowOrigin,{lineageKind:'direct-schema-14',validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,validateDirectOrigin:value=>{value.gold=0;throw new Error('hostile-direct-validator')},directOriginValidatorId}),/validators/);
check('throwing direct-origin validator leaves caller unchanged',foundation.canonicalStringify(directThrowOrigin)===directThrowBefore);
check('direct schema-14 fresh succeeds at revision one',directFresh.changed&&directFresh.state.schemaVersion===14&&directFresh.state.saveMeta.revision===1);
check('direct fresh has no migration receipt or predecessor checkpoint',directFresh.receipt===null&&directFresh.state.saveMeta.appliedMigrations.length===0&&directFresh.state.durableProgression.migrations.activationReceiptId===null&&directFresh.state.durableProgression.migrations.predecessorCheckpointIdentity===null);
check('direct fresh lineage is distinctly labeled',directFresh.state.durableProgression.migrations.lineageKind==='direct-schema-14'&&directFresh.state.durableProgression.migrations.bootstrapPolicy==='direct-schema-14'&&directFresh.state.durableProgression.migrations.resetLineagePolicy==='not-applicable');
check('direct fresh validates through reconstructed origin',foundation.validateSuccessorState(directFresh.state,directFresh.context).ok,foundation.validateSuccessorState(directFresh.state,directFresh.context).errors);
check('safe-reset schema-14 succeeds without migration entitlement',directReset.changed&&directReset.receipt===null&&directReset.state.saveMeta.appliedMigrations.length===0&&directReset.state.durableProgression.migrations.lineageKind==='safe-reset-schema-14');
check('safe-reset lineage binds retained marker',directReset.state.durableProgression.migrations.resetLineagePolicy==='protected-previous-installation-v1'&&directReset.state.durableProgression.migrations.directOriginAttestation.resetLineageIdentity!==null);
check('safe-reset direct state validates',foundation.validateSuccessorState(directReset.state,directReset.context).ok,foundation.validateSuccessorState(directReset.state,directReset.context).errors);
const directFreshRepeat=foundation.migrateSchema13To14(directFresh.state,{...directFresh.context,now:4000});
check('direct schema-14 repeat is a receipt-free no-op',directFreshRepeat.changed===false&&directFreshRepeat.receipt===null&&foundation.canonicalStringify(directFreshRepeat.state)===foundation.canonicalStringify(directFresh.state));
const directFreshOrdinary=deep(directFresh.state);directFreshOrdinary.gold++;directFreshOrdinary.saveMeta.revision++;directFreshOrdinary.saveMeta.updatedAt++;directFreshOrdinary.saveMeta.source='ordinary-direct-gameplay';
check('ordinary direct-successor mutation remains valid',foundation.validateSuccessorState(directFreshOrdinary,directFresh.context).ok,foundation.validateSuccessorState(directFreshOrdinary,directFresh.context).errors);
const missingDirectOrigin={...directFresh.context,resolveDirectOrigin:()=>null};
check('direct lineage requires exact origin resolver',!foundation.validateSuccessorState(directFresh.state,missingDirectOrigin).ok);
const missingDirectValidator={...directFresh.context,validateDirectOrigin:null};
check('direct lineage requires named origin validator',!foundation.validateSuccessorState(directFresh.state,missingDirectValidator).ok);
const rewrittenReset=deep(directReset.state);rewrittenReset.saveMeta.retainedCheckpointLineage.preResetRevision++;
check('rewritten safe-reset marker is rejected',!foundation.validateSuccessorState(rewrittenReset,directReset.context).ok);
const removedReset=deep(directReset.state);delete removedReset.saveMeta.retainedCheckpointLineage;
check('removed safe-reset marker is rejected',!foundation.validateSuccessorState(removedReset,directReset.context).ok);
const swappedDirectAttestation=deep(directFresh.state);swappedDirectAttestation.durableProgression.migrations.directOriginAttestation=deep(directReset.attestation);
check('cross-save direct-origin attestation swap is rejected',!foundation.validateSuccessorState(swappedDirectAttestation,directFresh.context).ok);
const entitledFresh=directOrigin({id:'save-entitled-direct'});entitledFresh.saveMeta.appliedMigrations.push({id:'schema-12-to-13',from:12,to:13});
rejects('direct fresh refuses fabricated historical migration entitlement',()=>activateDirect(entitledFresh,'direct-schema-14'),/canonical direct/);
for(const[name,mutate]of[
  ['reset marker on fresh',value=>{value.saveMeta.retainedCheckpointLineage={saveId:value.saveMeta.saveId,preResetSaveId:'save-other'}}],
  ['non-fresh source',value=>{value.saveMeta.source='boot'}],
  ['revision above one',value=>{value.saveMeta.revision=2}],
  ['unequal direct timestamps',value=>{value.saveMeta.updatedAt++}]
]){const invalid=directOrigin({id:`save-invalid-${name.replaceAll(' ','-')}`});mutate(invalid);rejects(`direct fresh rejects ${name}`,()=>activateDirect(invalid,'direct-schema-14'),/validators|canonical direct/)}
const sameSaveReset=directOrigin({id:'save-reset-same-prior',reset:true});sameSaveReset.saveMeta.retainedCheckpointLineage.preResetSaveId=sameSaveReset.saveMeta.saveId;
rejects('safe reset requires a new save ID distinct from the protected previous save',()=>activateDirect(sameSaveReset,'safe-reset-schema-14'),/validators|canonical direct/);
const wrongMarkerOwner=directOrigin({id:'save-reset-wrong-marker-owner',reset:true});wrongMarkerOwner.saveMeta.retainedCheckpointLineage.saveId='save-other-owner';
rejects('safe reset marker must belong to the new save ID',()=>activateDirect(wrongMarkerOwner,'safe-reset-schema-14'),/validators|canonical direct/);
const cyclicDirectOrigin=directOrigin({id:'save-cyclic-direct-resolver'});cyclicDirectOrigin.self=cyclicDirectOrigin;
for(const[name,resolver]of[
  ['throwing',()=>{throw new Error('resolver-hostile')}],
  ['malformed',()=>({state:{}})],
  ['cyclic',()=>cyclicDirectOrigin],
  ['wrong-save',()=>directOrigin({id:'save-wrong-resolved-origin'})],
  ['wrong-lineage',()=>directOrigin({id:directFresh.state.saveMeta.saveId,reset:true})]
])check(`direct successor rejects ${name} origin resolver`,!foundation.validateSuccessorState(directFresh.state,{...directFresh.context,resolveDirectOrigin:resolver}).ok);
const directWithReceipt=deep(directFresh.state);directWithReceipt.saveMeta.appliedMigrations.push(deep(direct.receipt));
check('direct lineage rejects a migration receipt',!foundation.validateSuccessorState(directWithReceipt,directFresh.context).ok);
const directWithCheckpoint=deep(directFresh.state);directWithCheckpoint.durableProgression.migrations.predecessorCheckpointIdentity=direct.checkpoint.identity;
check('direct lineage rejects a predecessor checkpoint identity',!foundation.validateSuccessorState(directWithCheckpoint,directFresh.context).ok);
const migrationWithAttestation=deep(direct.state);migrationWithAttestation.durableProgression.migrations.directOriginAttestation=deep(directFresh.attestation);
check('migration lineage rejects a direct-origin attestation',!foundation.validateSuccessorState(migrationWithAttestation,direct.context).ok);
const swappedFreshTag=deep(directFresh.state);swappedFreshTag.durableProgression.migrations.lineageKind='safe-reset-schema-14';swappedFreshTag.durableProgression.migrations.bootstrapPolicy='safe-reset-schema-14';
check('fresh and safe-reset lineage tags are not interchangeable',!foundation.validateSuccessorState(swappedFreshTag,directFresh.context).ok);
check('safe-reset current and prior save IDs are distinct',directReset.state.saveMeta.saveId!==directReset.state.saveMeta.retainedCheckpointLineage.preResetSaveId);
check('direct migration succeeds',direct.changed&&direct.state.schemaVersion===14);
check('current predecessor-through-migration succeeds',through.changed&&through.state.schemaVersion===14);
check('direct bootstrap distinctly labeled',direct.receipt.bootstrapPolicy==='direct-schema-13');
check('predecessor-through-migration distinctly labeled',through.receipt.bootstrapPolicy==='predecessor-through-migration');
check('direct path fabricates no schema-12 receipt',direct.state.saveMeta.appliedMigrations.filter(row=>row.id==='schema-12-to-13').length===0);
check('through path preserves schema-12 receipt',through.state.saveMeta.appliedMigrations.filter(row=>row.id==='schema-12-to-13').length===1);
check('real schema-13 reset predecessor remains checkpoint-bound during migration',migratedReset.state.durableProgression.migrations.resetLineagePolicy==='predecessor-reset-lineage-bound-v1'&&foundation.validateSuccessorState(migratedReset.state,migratedReset.context).ok);
check('exact raw identity differs from semantic identity',direct.receipt.predecessorRawIdentity!==direct.receipt.predecessorSemanticIdentity);
check('write-once checkpoint attested',direct.checkpoint.writeOnceVerified===true&&direct.receipt.predecessorCheckpointIdentity===direct.checkpoint.identity);
check('migrated successor validates',foundation.validateSuccessorState(direct.state,direct.context).ok,foundation.validateSuccessorState(direct.state,direct.context).errors);
check('migration repeat is byte-stable',foundation.migrateSchema13To14(direct.state,{...direct.context,now:4000}).changed===false);
function validatorMutationTrial(id,validator){const caller=predecessor({id}),raw=JSON.stringify(caller,null,2),captured=foundation.capturePreSuccessorCheckpoint(caller,raw,{checkpointId:`checkpoint.pre-v14.${id}.v1`}),checkpoint=foundation.attestPreSuccessorCheckpoint(captured,{rereadRaw:raw}),context={validatePredecessor:validator,predecessorValidatorId:validatorId,resolvePredecessorCheckpoint:identity=>identity===checkpoint.identity?{checkpoint,raw}:null};return{caller,raw,checkpoint,context}}
const mutatingTrueTrial=validatorMutationTrial('save-validator-mutates-true',candidate=>{candidate.gold=0;candidate.player.rankExp=0;candidate.saveMeta.source='validator-mutated-clone';return true}),mutatingTrueResult=foundation.migrateSchema13To14(mutatingTrueTrial.caller,{...mutatingTrueTrial.context,now:3000,predecessorCheckpoint:mutatingTrueTrial.checkpoint});
check('mutating predecessor validator receives only a clone',mutatingTrueResult.changed&&mutatingTrueResult.state.gold===5000&&mutatingTrueResult.state.player.rankExp===12000&&JSON.stringify(mutatingTrueTrial.caller,null,2)===mutatingTrueTrial.raw);
const mutatingFalseTrial=validatorMutationTrial('save-validator-mutates-false',candidate=>{candidate.gold=0;candidate.player.rankExp=0;return false});
rejects('false mutating predecessor validator refuses',()=>foundation.migrateSchema13To14(mutatingFalseTrial.caller,{...mutatingFalseTrial.context,now:3000,predecessorCheckpoint:mutatingFalseTrial.checkpoint}),/validator/);
check('false mutating predecessor validator leaves caller and raw exact',JSON.stringify(mutatingFalseTrial.caller,null,2)===mutatingFalseTrial.raw);
const throwingValidatorTrial=validatorMutationTrial('save-validator-throws',candidate=>{candidate.gold=0;candidate.player.rankExp=0;throw new Error('validator-side-effect')});
rejects('throwing predecessor validator refuses',()=>foundation.migrateSchema13To14(throwingValidatorTrial.caller,{...throwingValidatorTrial.context,now:3000,predecessorCheckpoint:throwingValidatorTrial.checkpoint}),/validator/);
check('throwing predecessor validator leaves caller and raw exact',JSON.stringify(throwingValidatorTrial.caller,null,2)===throwingValidatorTrial.raw);
const ordinary=deep(direct.state);ordinary.gold++;ordinary.player.rankExp++;ordinary.saveMeta.revision++;ordinary.saveMeta.updatedAt++;ordinary.saveMeta.source='ordinary-valid-gameplay-mutation';
check('ordinary post-migration mutation remains valid',foundation.validateSuccessorState(ordinary,direct.context).ok,foundation.validateSuccessorState(ordinary,direct.context).errors);
const malformedGameplay=deep(ordinary);malformedGameplay.gold=-1;
check('malformed inherited gameplay projection rejected',!foundation.validateSuccessorState(malformedGameplay,direct.context).ok);
check('successor requires named current validator',!foundation.validateSuccessorState(direct.state,{...direct.context,validatePredecessor:null}).ok);
check('successor requires exact checkpoint resolver',!foundation.validateSuccessorState(direct.state,{...direct.context,resolvePredecessorCheckpoint:()=>null}).ok);
const tamperedReceipt=deep(direct.state);tamperedReceipt.saveMeta.appliedMigrations.at(-1).predecessorRawIdentity='0'.repeat(64);
check('tampered lineage receipt rejected',!foundation.validateSuccessorState(tamperedReceipt,direct.context).ok);
const activeOnInactive=deep(direct.state);activeOnInactive.durableProgression.activeReleaseIds=['release.bogus.v1'];
check('inactive authority rejects arbitrary active release',!foundation.validateSuccessorState(activeOnInactive,direct.context).ok);
const rankSix=deep(direct.state);rankSix.durableProgression.ladders.rank.releasedThrough=6;
check('inactive authority rejects Rank 6 release',!foundation.validateSuccessorState(rankSix,direct.context).ok);
const familyActive=deep(direct.state);familyActive.durableProgression.ladders.family.alignmentStatus='active';
check('inactive authority rejects active Family ladder',!foundation.validateSuccessorState(familyActive,direct.context).ok);
const facilityBogus=deep(direct.state);facilityBogus.durableProgression.ladders.facilities.activeLadderIds=['ladder.bogus.v1'];
check('inactive authority rejects bogus facility ladder',!foundation.validateSuccessorState(facilityBogus,direct.context).ok);
check('malformed null successor returns failure',foundation.validateSuccessorState(null).ok===false);
rejects('unattested checkpoint cannot migrate',()=>foundation.migrateSchema13To14(predecessor({id:'save-unattested'}),{now:3000,validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,predecessorCheckpoint:{},resolvePredecessorCheckpoint:()=>null}),/checkpoint/);

equal('Rank capacity formula anchor 15',definitions.rank.table[14].totalExp,2975);
equal('Rank capacity formula anchor 20',definitions.rank.table[19].totalExp,5225);
equal('Rank capacity formula anchor 25',definitions.rank.table[24].totalExp,8100);
equal('Rank capacity formula anchor 30',definitions.rank.table[29].totalExp,11600);
const capped=foundation.rankProjection(12000,5);check('Rank EXP banks beyond released cap',capped.rank===5&&capped.bankedBeyondReleasedCap===11650);
const rankAuthority=deep(definitions),rankRelease=rankAuthority.releaseManifests[0];rankRelease.status='active';rankRelease.active=true;rankRelease.releasedRankThrough=30;for(const row of rankAuthority.rank.table.slice(5)){row.releaseState='active-content-backed';row.contentDependencyIds=[`story.book2.rank-${row.rank}.live`]}sealActiveAuthority(rankAuthority,rankAuthority.rank.table.slice(5,30).flatMap(row=>row.contentDependencyIds));
const releasePlan=foundation.planRankReleaseActivation(direct.state,30,{...direct.context,currentAuthority:definitions,successorAuthority:rankAuthority});check('Rank planner queues reached rows once with no reward',releasePlan.queuedTransitions.length===25&&releasePlan.rewardApplications===0&&releasePlan.successorManifestHash===foundation.authorityHash(rankAuthority)&&releasePlan.queuedTransitions.every(row=>row.rewardApplications===0&&row.contentDependencyIds.length===1));
rejects('Rank planner rejects arbitrary unsupported boundary',()=>foundation.planRankReleaseActivation(direct.state,29,{...direct.context,currentAuthority:definitions,successorAuthority:rankAuthority}),/content-backed|input/);
const reservedRankAuthority=deep(rankAuthority);reservedRankAuthority.rank.table[5].releaseState='reserved';sealActiveAuthority(reservedRankAuthority,reservedRankAuthority.releaseManifests[0].contentDependencyIds);check('active release rejects still-reserved Rank row',!foundation.validateReleaseAuthority(reservedRankAuthority).ok);
const repricedRankAuthority=deep(rankAuthority);repricedRankAuthority.rank.table[5].totalExp=0;sealActiveAuthority(repricedRankAuthority,repricedRankAuthority.releaseManifests[0].contentDependencyIds);check('active release rejects repriced Rank row despite recomputed evidence',!foundation.validateReleaseAuthority(repricedRankAuthority).ok);

const familyFixture={family:Object.fromEntries(definitions.family.ids.map(id=>[id,{intimacy:id==='elara'?1000:0,claimedIntimacyMilestoneIds:id==='elara'?['intimacy-150','intimacy-300','intimacy-600']:[]}]))};
const familyPlan=foundation.planFamilyAlignment(familyFixture),elara=familyPlan.mappings.filter(row=>row.familyId==='elara');
check('Family 150 maps claimed',elara.find(row=>row.threshold===150)?.disposition==='preserve-claimed-no-grant');
check('Family 300 maps claimed',elara.find(row=>row.threshold===300)?.disposition==='preserve-claimed-no-grant');
check('Family predecessor 600 maps aligned 500 claimed',elara.find(row=>row.threshold===500)?.predecessorId==='intimacy-600'&&elara.find(row=>row.threshold===500)?.disposition==='preserve-claimed-no-grant');
check('Family 1000 remains ready without automatic shards',elara.find(row=>row.threshold===1000)?.disposition==='ready-manual-claim-no-grant-yet'&&familyPlan.rewardApplications===0);
check('Family shard and narrative 1000 definitions remain separate',definitions.family.shardMilestones.some(row=>row.familyId==='elara'&&row.threshold===1000)&&definitions.family.narrativeMilestones.some(row=>row.familyId==='elara'&&row.threshold===1000));

const authority=futureAuthority(),claimContext={...direct.context,authority};let claimState=activateDetached(direct.state,authority);
check('detached future authority validates',foundation.validateReleaseAuthority(authority).ok&&foundation.validateSuccessorState(claimState,claimContext).ok);
const directClaimAuthority=futureAuthority(1),directClaimContext={...directFresh.context,authority:directClaimAuthority},directClaimState=activateDetached(directFresh.state,directClaimAuthority),directClaimPayload=foundation.captureCollectionGrantPayload(directClaimState,directClaimAuthority.collections.grantDefinitions[0],{capturedAt:4000,...directClaimContext}),directClaimPreview=foundation.previewCollectionGrant(directClaimState,directClaimPayload,{previewedAt:4001,...directClaimContext}),directClaimResult=foundation.finalizeCollectionGrant(directClaimState,directClaimPayload,directClaimPreview,{claimedAt:4002,...directClaimContext});
check('direct schema-14 lineage supports exactly-once Collection finalization',directClaimResult.ok&&directClaimResult.rewardApplications===1&&foundation.validateSuccessorState(directClaimResult.state,directClaimContext).ok,directClaimResult.reason);
const payloadA=foundation.captureCollectionGrantPayload(claimState,authority.collections.grantDefinitions[0],{capturedAt:4000,...claimContext}),payloadB=foundation.captureCollectionGrantPayload(claimState,authority.collections.grantDefinitions[4],{capturedAt:4000,...claimContext});
const previewA=foundation.previewCollectionGrant(claimState,payloadA,{previewedAt:4001,...claimContext}),previewB=foundation.previewCollectionGrant(claimState,payloadB,{previewedAt:4001,...claimContext});
let outcome=foundation.finalizeCollectionGrant(claimState,payloadB,previewB,{claimedAt:4002,...claimContext});check('second ready same-pool grant can claim first',outcome.ok,outcome.reason);claimState=outcome.state;
outcome=foundation.finalizeCollectionGrant(claimState,payloadA,previewA,{claimedAt:4003,...claimContext});check('old preview safely refuses after same-pool claim',!outcome.ok&&outcome.reason==='stale-preview'&&outcome.rawUnchanged);
const refreshedA=foundation.previewCollectionGrant(claimState,payloadA,{previewedAt:4004,...claimContext});outcome=foundation.finalizeCollectionGrant(claimState,payloadA,refreshedA,{claimedAt:4005,...claimContext});check('fixed payload succeeds with refreshed expected totals',outcome.ok,outcome.reason);claimState=outcome.state;
const already=foundation.finalizeCollectionGrant(claimState,payloadA,refreshedA,{claimedAt:4006,...claimContext});check('replay refuses with zero mutation',!already.ok&&already.rewardApplications===0&&already.rawUnchanged);
for(let index=1;index<20;index++){if([4].includes(index))continue;const definition=authority.collections.grantDefinitions[index],payload=foundation.captureCollectionGrantPayload(claimState,definition,{capturedAt:4100+index,...claimContext}),preview=foundation.previewCollectionGrant(claimState,payload,{previewedAt:4200+index,...claimContext}),result=foundation.finalizeCollectionGrant(claimState,payload,preview,{claimedAt:4300+index,...claimContext});check(`Collection claim ${index+1} succeeds`,result.ok,result.reason);if(result.ok)claimState=result.state}
check('bounded archive folds eight receipts',claimState.durableProgression.collections.checkpoint.throughSequence===8&&claimState.durableProgression.collections.recentGrantReceipts.length===12);
check('folded tail continues receipt identity chain',claimState.durableProgression.collections.recentGrantReceipts[0].priorIdentity===claimState.durableProgression.collections.checkpoint.foldedTailReceiptIdentity);
check('folded checkpoint retains release provenance',claimState.durableProgression.collections.checkpoint.provenanceByReleaseId[authority.releaseManifests[0].id]?.contributionCount===8);
check('folded successor validates',foundation.validateSuccessorState(claimState,claimContext).ok,foundation.validateSuccessorState(claimState,claimContext).errors);
const totals=foundation.collectionTotals(claimState);check('Collection totals remain additive and uncapped',totals.powerBps===2500&&totals.earningsBps===2500&&totals.expBps===2500&&totals.facilityBpsByFacilityId['facility.restaurant']===2500);
const hugeDefinition=authority.collections.grantDefinitions.at(-1),hugePayload=foundation.captureCollectionGrantPayload(claimState,hugeDefinition,{capturedAt:5000,...claimContext}),hugePreview=foundation.previewCollectionGrant(claimState,hugePayload,{previewedAt:5001,...claimContext}),hugeResult=foundation.finalizeCollectionGrant(claimState,hugePayload,hugePreview,{claimedAt:5002,...claimContext});
check('+1,000% Collection grant is accepted without lifetime cap',hugeResult.ok&&foundation.collectionTotals(hugeResult.state).facilityBpsByFacilityId['facility.restaurant']===102500,hugeResult.reason);
const protectedAuthority=deep(definitions),protectedRelease=protectedAuthority.releaseManifests[0];protectedRelease.status='active';protectedRelease.active=true;
const permanentAlternative={id:'collection.grant.permanent-alternative.v1',releaseId:protectedRelease.id,definitionVersion:1,rewardVersion:1,classification:'permanent',permanentAlternativeId:null,claimSourceId:'claim.permanent-alternative.v1',targetPool:'facility',facilityId:'facility.apothecary',bps:750,releaseState:'active'};
const limitedGrant={id:'collection.grant.limited-route.v1',releaseId:protectedRelease.id,definitionVersion:1,rewardVersion:1,classification:'limited-with-permanent-alternative',permanentAlternativeId:permanentAlternative.id,claimSourceId:'claim.limited-route.v1',targetPool:'facility',facilityId:'facility.apothecary',bps:750,releaseState:'active'};
const isolatedGrant={id:'collection.grant.restaurant-only.v1',releaseId:protectedRelease.id,definitionVersion:1,rewardVersion:1,classification:'permanent',permanentAlternativeId:null,claimSourceId:'claim.restaurant-only.v1',targetPool:'facility',facilityId:'facility.restaurant',bps:250,releaseState:'active'};
protectedAuthority.collections.grantDefinitions.push(permanentAlternative,limitedGrant,isolatedGrant);protectedRelease.collectionGrantDefinitionIds.push(permanentAlternative.id,limitedGrant.id,isolatedGrant.id);
sealActiveAuthority(protectedAuthority,['content.phase-24c.protected-fixture.v1']);
const siblingAlternativeAuthority=deep(protectedAuthority),siblingRelease=siblingAlternativeAuthority.releaseManifests[0],siblingLimited={...deep(limitedGrant),id:'collection.grant.limited-route-sibling.v1',claimSourceId:'claim.limited-route-sibling.v1'};siblingAlternativeAuthority.collections.grantDefinitions.push(siblingLimited);siblingRelease.collectionGrantDefinitionIds.push(siblingLimited.id);sealActiveAuthority(siblingAlternativeAuthority,['content.phase-24c.protected-fixture.v1']);
check('two limited routes cannot share one permanent alternative',!foundation.validateReleaseAuthority(siblingAlternativeAuthority).ok);
for(const[name,mutate]of[
  ['mismatched alternative basis points',(limited)=>{limited.bps++}],
  ['mismatched alternative pool',(limited)=>{limited.targetPool='power';limited.facilityId=null}],
  ['mismatched alternative facility',(limited)=>{limited.facilityId='facility.restaurant'}],
  ['inactive permanent alternative',(_limited,permanent)=>{permanent.releaseState='inactive'}]
]){const invalid=deep(protectedAuthority),limited=invalid.collections.grantDefinitions.find(row=>row.id===limitedGrant.id),permanent=invalid.collections.grantDefinitions.find(row=>row.id===permanentAlternative.id);mutate(limited,permanent);sealActiveAuthority(invalid,['content.phase-24c.protected-fixture.v1']);check(`${name} is rejected`,!foundation.validateReleaseAuthority(invalid).ok)}
const protectedContext={...direct.context,authority:protectedAuthority};let protectedState=activateDetached(direct.state,protectedAuthority);
check('limited-alternative authority resolves equivalent permanent grant',foundation.validateReleaseAuthority(protectedAuthority).ok);
const limitedPayload=foundation.captureCollectionGrantPayload(protectedState,limitedGrant,{capturedAt:5100,...protectedContext}),limitedPreview=foundation.previewCollectionGrant(protectedState,limitedPayload,{previewedAt:5101,...protectedContext}),limitedResult=foundation.finalizeCollectionGrant(protectedState,limitedPayload,limitedPreview,{claimedAt:5102,...protectedContext});
check('limited route claim succeeds once',limitedResult.ok,limitedResult.reason);protectedState=limitedResult.state;
rejects('permanent alternative cannot double-grant after limited route',()=>foundation.captureCollectionGrantPayload(protectedState,permanentAlternative,{capturedAt:5103,...protectedContext}),/alternative/);
const isolatedPayload=foundation.captureCollectionGrantPayload(protectedState,isolatedGrant,{capturedAt:5104,...protectedContext}),isolatedPreview=foundation.previewCollectionGrant(protectedState,isolatedPayload,{previewedAt:5105,...protectedContext}),isolatedResult=foundation.finalizeCollectionGrant(protectedState,isolatedPayload,isolatedPreview,{claimedAt:5106,...protectedContext});
check('facility claim stays isolated to authored facility',isolatedResult.ok&&foundation.collectionTotals(isolatedResult.state).facilityBpsByFacilityId['facility.restaurant']===250&&foundation.collectionTotals(isolatedResult.state).facilityBpsByFacilityId['facility.apothecary']===750,isolatedResult.reason);

const releaseOneAuthority=futureAuthority(3),releaseOneContext={...direct.context,authority:releaseOneAuthority};let evolvingState=activateDetached(direct.state,releaseOneAuthority);const releaseOne=releaseOneAuthority.releaseManifests[0],delayedPayload=foundation.captureCollectionGrantPayload(evolvingState,releaseOneAuthority.collections.grantDefinitions[1],{capturedAt:5200,...releaseOneContext}),firstPayload=foundation.captureCollectionGrantPayload(evolvingState,releaseOneAuthority.collections.grantDefinitions[0],{capturedAt:5200,...releaseOneContext}),firstPreview=foundation.previewCollectionGrant(evolvingState,firstPayload,{previewedAt:5201,...releaseOneContext}),firstResult=foundation.finalizeCollectionGrant(evolvingState,firstPayload,firstPreview,{claimedAt:5202,...releaseOneContext});check('Release 1 history established before evolution',firstResult.ok,firstResult.reason);evolvingState=firstResult.state;
const releaseTwoAuthority=deep(releaseOneAuthority),releaseTwo={id:'release.phase-24c.fixture-two.v1',version:1,sequence:2,status:'active',active:true,contentDependencyIds:[],collectionGrantDefinitionIds:[],releasedRankThrough:5,permanentOnlyRequirementProfileId:null,requirementFixtureProfileIds:[],simulationPackageId:null,limitedContentRequired:false,activationEvidence:null},releaseTwoGrant={id:'collection.grant.release-two.v1',releaseId:releaseTwo.id,definitionVersion:1,rewardVersion:1,classification:'permanent',permanentAlternativeId:null,claimSourceId:'claim.release-two.v1',targetPool:'earnings',facilityId:null,bps:900,releaseState:'active'};releaseTwoAuthority.releaseManifests.push(releaseTwo);releaseTwoAuthority.collections.grantDefinitions.push(releaseTwoGrant);releaseTwo.collectionGrantDefinitionIds.push(releaseTwoGrant.id);sealRelease(releaseTwoAuthority,releaseTwo,['content.phase-24c.release-two.v1']);
const releaseTwoContext={...direct.context,authority:releaseTwoAuthority},releaseOneHashBefore=foundation.releaseManifestHash(releaseOneAuthority,releaseOne.id),releaseOneHashAfter=foundation.releaseManifestHash(releaseTwoAuthority,releaseOne.id);evolvingState=activateDetached(evolvingState,releaseTwoAuthority);
check('Release 1 immutable package hash survives aggregate Release 2',releaseOneHashBefore===releaseOneHashAfter);
check('Release 1 receipts validate after Release 2 aggregate activation',foundation.validateSuccessorState(evolvingState,releaseTwoContext).ok,foundation.validateSuccessorState(evolvingState,releaseTwoContext).errors);
const delayedPreview=foundation.previewCollectionGrant(evolvingState,delayedPayload,{previewedAt:5203,...releaseTwoContext}),delayedResult=foundation.finalizeCollectionGrant(evolvingState,delayedPayload,delayedPreview,{claimedAt:5204,...releaseTwoContext});check('banked Release 1 payload survives unrelated Release 2',delayedResult.ok,delayedResult.reason);evolvingState=delayedResult.state;
const releaseTwoPayload=foundation.captureCollectionGrantPayload(evolvingState,releaseTwoGrant,{capturedAt:5205,...releaseTwoContext}),releaseTwoPreview=foundation.previewCollectionGrant(evolvingState,releaseTwoPayload,{previewedAt:5206,...releaseTwoContext}),releaseTwoResult=foundation.finalizeCollectionGrant(evolvingState,releaseTwoPayload,releaseTwoPreview,{claimedAt:5207,...releaseTwoContext});check('new Release 2 claim works beside unchanged Release 1 history',releaseTwoResult.ok,releaseTwoResult.reason);evolvingState=releaseTwoResult.state;
rejects('Release 1 replay stays blocked after Release 2',()=>foundation.captureCollectionGrantPayload(evolvingState,firstPayload.definitionId,{capturedAt:5208,...releaseTwoContext}),/already claimed/);

const foldedR1Authority=futureAuthority(8),foldedR1Context={...direct.context,authority:foldedR1Authority};let foldedEvolutionState=activateDetached(direct.state,foldedR1Authority);for(let index=0;index<8;index++){const payload=foundation.captureCollectionGrantPayload(foldedEvolutionState,foldedR1Authority.collections.grantDefinitions[index],{capturedAt:5300+index*3,...foldedR1Context}),preview=foundation.previewCollectionGrant(foldedEvolutionState,payload,{previewedAt:5301+index*3,...foldedR1Context}),result=foundation.finalizeCollectionGrant(foldedEvolutionState,payload,preview,{claimedAt:5302+index*3,...foldedR1Context});check(`folded Release 1 setup claim ${index+1}`,result.ok,result.reason);if(result.ok)foldedEvolutionState=result.state}
const foldedR2Authority=deep(foldedR1Authority),foldedR2={id:'release.phase-24c.folded-r2.v1',version:1,sequence:2,status:'active',active:true,contentDependencyIds:[],collectionGrantDefinitionIds:[],releasedRankThrough:5,permanentOnlyRequirementProfileId:null,requirementFixtureProfileIds:[],simulationPackageId:null,limitedContentRequired:false,activationEvidence:null};foldedR2Authority.releaseManifests.push(foldedR2);for(let index=1;index<=17;index++){const grant={id:`collection.grant.folded-r2-${index}.v1`,releaseId:foldedR2.id,definitionVersion:1,rewardVersion:1,classification:'permanent',permanentAlternativeId:null,claimSourceId:`claim.folded-r2-${index}.v1`,targetPool:'power',facilityId:null,bps:1,releaseState:'active'};foldedR2Authority.collections.grantDefinitions.push(grant);foldedR2.collectionGrantDefinitionIds.push(grant.id)}sealRelease(foldedR2Authority,foldedR2,['content.phase-24c.folded-r2.v1']);const foldedR2Context={...direct.context,authority:foldedR2Authority};foldedEvolutionState=activateDetached(foldedEvolutionState,foldedR2Authority);for(let index=0;index<17;index++){const definition=foldedR2Authority.collections.grantDefinitions.find(row=>row.id===foldedR2.collectionGrantDefinitionIds[index]),payload=foundation.captureCollectionGrantPayload(foldedEvolutionState,definition,{capturedAt:5400+index*3,...foldedR2Context}),preview=foundation.previewCollectionGrant(foldedEvolutionState,payload,{previewedAt:5401+index*3,...foldedR2Context}),result=foundation.finalizeCollectionGrant(foldedEvolutionState,payload,preview,{claimedAt:5402+index*3,...foldedR2Context});check(`folded Release 2 setup claim ${index+1}`,result.ok,result.reason);if(result.ok)foldedEvolutionState=result.state}
const foldedR1Id=foldedR1Authority.releaseManifests[0].id;check('Release 1 fully leaves detailed recent window',foldedEvolutionState.durableProgression.collections.recentGrantReceipts.every(receipt=>receipt.releaseId===foldedR2.id)&&foldedEvolutionState.durableProgression.collections.checkpoint.provenanceByReleaseId[foldedR1Id].releaseManifestHash===foundation.releaseManifestHash(foldedR2Authority,foldedR1Id));
const rewrittenR1Authority=deep(foldedR2Authority),rewrittenR1=rewrittenR1Authority.releaseManifests.find(row=>row.id===foldedR1Id);sealRelease(rewrittenR1Authority,rewrittenR1,['content.phase-24c.rewritten-r1.v1']);const rewrittenState=activateDetached(foldedEvolutionState,rewrittenR1Authority),rewrittenContext={...direct.context,authority:rewrittenR1Authority};check('folded Release 1 package rewrite is rejected by provenance hash',!foundation.validateSuccessorState(rewrittenState,rewrittenContext).ok);
const tamperedClaim=deep(claimState);tamperedClaim.durableProgression.collections.recentGrantReceipts[0].payloadIdentity='0'.repeat(64);
check('tampered folded-window payload identity rejected',!foundation.validateSuccessorState(tamperedClaim,claimContext).ok);
const overflow=deep(claimState),cp=overflow.durableProgression.collections.checkpoint,releaseId=authority.releaseManifests[0].id;cp.totals.powerBps=Number.MAX_SAFE_INTEGER;cp.provenanceByReleaseId[releaseId].powerBps=Number.MAX_SAFE_INTEGER;cp.identity='';cp.identity=checkpointIdentity(overflow.saveMeta.saveId,cp);overflow.durableProgression.collections.recentGrantReceipts[0].oldTotalBps=Number.MAX_SAFE_INTEGER;
check('overflow adversarial receipt returns failure without throw',foundation.validateSuccessorState(overflow,claimContext).ok===false);

const swapAuthority=futureAuthority(34),swapContext={...direct.context,authority:swapAuthority};let swapState=activateDetached(direct.state,swapAuthority);
for(let index=0;index<33;index++){const payload=foundation.captureCollectionGrantPayload(swapState,swapAuthority.collections.grantDefinitions[index],{capturedAt:6000+index*3,...swapContext}),preview=foundation.previewCollectionGrant(swapState,payload,{previewedAt:6001+index*3,...swapContext}),result=foundation.finalizeCollectionGrant(swapState,payload,preview,{claimedAt:6002+index*3,...swapContext});check(`folded replay setup claim ${index+1}`,result.ok,result.reason);if(result.ok)swapState=result.state}
check('folded replay setup reaches 24 plus 9',swapState.durableProgression.collections.checkpoint.throughSequence===24&&swapState.durableProgression.collections.recentGrantReceipts.length===9);
const swapped=deep(swapState),grantOne=swapAuthority.collections.grantDefinitions[0].id,grantThirtyFour=swapAuthority.collections.grantDefinitions[33].id,swapIndex=swapped.durableProgression.collections.claimedDefinitionIds.indexOf(grantOne);swapped.durableProgression.collections.claimedDefinitionIds[swapIndex]=grantThirtyFour;swapped.durableProgression.collections.claimedDefinitionIds.sort();
check('folded claimed-ID substitution is rejected by checkpoint digest',!foundation.validateSuccessorState(swapped,swapContext).ok);
rejects('original folded grant remains permanently blocked',()=>foundation.captureCollectionGrantPayload(swapState,grantOne,{capturedAt:7000,...swapContext}),/already claimed/);

equal('Power additive adjacent pool',foundation.evaluateAdditivePool(100000,5000,2500).value,175000);
equal('Earnings additive adjacent pool',foundation.evaluateAdditivePool(100000,3000,2500).value,155000);
equal('EXP additive beside authored EXP bonus',foundation.evaluateAdditivePool(100000,2000,2500).value,145000);
equal('Facility additive beside authored active bonus',foundation.evaluateAdditivePool(100000,4000,2500).value,165000);
equal('fractional Fellow base uses one adjacent additive pool and one rounding',foundation.evaluateAdditiveNumberBase(123.75,5000,100000,{rounding:'nearest'}).value,1423);
equal('fractional base floor is exact and deterministic',foundation.evaluateAdditiveNumberBase(10.25,2500,2500,{rounding:'floor'}).value,15);
equal('fractional zero-bonus nearest matches predecessor rounding',foundation.evaluateAdditiveNumberBase(123.75,0,0,{rounding:'nearest'}).value,Math.round(123.75));
equal('exactly representable fractional result can remain unrounded',foundation.evaluateAdditiveNumberBase(1.25,0,10000,{rounding:'none'}).value,2.5);
rejects('nonrepresentable fractional result requires rounding',()=>foundation.evaluateAdditiveNumberBase(0.1,0,3333,{rounding:'none'}),/representable/);
rejects('fractional +1000% overflow is refused',()=>foundation.evaluateAdditiveNumberBase(Number.MAX_SAFE_INTEGER-0.5,0,100000,{rounding:'nearest'}),/safe integer/);
check('EXP order names authored and Collection terms',foundation.formulaOrder.eligibleExp[1]==='one-plus-authored-exp-bps-plus-collection-exp-bps');
rejects('rounding none rejects unsafe result',()=>foundation.evaluateAdditivePool(Number.MAX_SAFE_INTEGER,1,0),/safe/);
equal('rounding none preserves MAX_SAFE identity',foundation.evaluateAdditivePool(Number.MAX_SAFE_INTEGER,0,0).value,Number.MAX_SAFE_INTEGER);
equal('rounding none preserves near-boundary identity',foundation.evaluateAdditivePool(Number.MAX_SAFE_INTEGER-991,0,0).value,Number.MAX_SAFE_INTEGER-991);
check('continuing Legacy carries progress',foundation.nextLegacyTier(20,2).threshold===15&&foundation.nextLegacyTier(20,2).carriedProgress===5);
check('continuing Legacy exposes next page tier',foundation.nextLegacyTier(5000,10).threshold===4800&&foundation.nextLegacyTier(5000,10).status==='ready');

const report={contractId:contract.contractId,passed,failed,definitionsManifestSha256:foundation.manifestHash,definitionsFileSha256:shaFile('src/phase24c-durable-definitions.js'),foundationFileSha256:shaFile('src/phase24c-durable-foundation.js'),productionSha256:Object.fromEntries(Object.keys(contract.expectedProductionSha256).map(file=>[file,file==='index.html'?shaText(projected.normalized):shaFile(file)])),failures};
console.log(JSON.stringify(report,null,2));
if(failed)process.exitCode=1;
