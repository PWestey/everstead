import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));
const definitionSource=fs.readFileSync(path.join(root,'src/phase24c-durable-definitions.js'),'utf8');
const foundationSource=fs.readFileSync(path.join(root,'src/phase24c-durable-foundation.js'),'utf8');
const realm=vm.createContext({console});
vm.runInContext(definitionSource,realm,{filename:'phase24c-durable-definitions.js'});
vm.runInContext(foundationSource,realm,{filename:'phase24c-durable-foundation.js'});
const definitions=realm.EVERSTEAD_PHASE24C_DEFINITIONS;
const foundation=realm.EVERSTEAD_PHASE24C_FOUNDATION;

let passed=0,failed=0;
const failures=[];
function check(name,condition,detail=''){
  if(condition){passed++;return}
  failed++;failures.push({name,detail:String(detail)});
}
function equal(name,actual,expected){check(name,JSON.stringify(actual)===JSON.stringify(expected),`actual=${JSON.stringify(actual)} expected=${JSON.stringify(expected)}`)}
function rejects(name,fn,pattern=/.*/){try{fn();check(name,false,'did not throw')}catch(error){check(name,pattern.test(String(error?.message||error)),error?.message)}}
function noThrow(name,fn,predicate){try{const value=fn(),ok=predicate(value);let detail='';if(!ok){try{detail=JSON.stringify(value)}catch{detail='unserializable refusal result'}}check(name,ok,detail)}catch(error){check(name,false,`threw: ${error?.message}`)}}
function clone(value){return JSON.parse(JSON.stringify(value))}
function fileHash(relative){return crypto.createHash('sha256').update(fs.readFileSync(path.join(root,relative))).digest('hex')}
function textHash(value){return crypto.createHash('sha256').update(value).digest('hex')}
function dataHash(value){return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}
function canonical(value){
  if(value===null||typeof value!=='object')return JSON.stringify(value);
  if(Array.isArray(value))return`[${value.map(canonical).join(',')}]`;
  return`{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
}
function deepFrozen(value,seen=new Set()){
  if(!value||typeof value!=='object'||seen.has(value))return true;
  seen.add(value);
  return Object.isFrozen(value)&&Object.values(value).every(child=>deepFrozen(child,seen));
}
function identity(kind,value){return crypto.createHash('sha256').update(canonical([`phase24c.release-${kind}.v1`,value])).digest('hex')}
function c2cProjection(source){
  const loaderPattern=/[\t ]*<!-- Phase 24C-2C zero-only authority load BEGIN -->[\s\S]*?<!-- Phase 24C-2C zero-only authority load END -->(?:\r?\n)?/g,jsPattern=/(^[\t ]*)?\/\* Phase 24C-2C ([^\r\n*]+?) BEGIN \*\/[\s\S]*?\/\* Phase 24C-2C \2 END \*\/(?:\r?\n)?/gm,loaders=[...source.matchAll(loaderPattern)];let normalized=source.replace(loaderPattern,'');normalized=normalized.replace(jsPattern,'');const loader=loaders[0]?.[0]||'',loaderSources=[...loader.matchAll(/<script\s+[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi)].map(match=>match[1].split('?')[0]);return{normalized,loaderSources,loaderCount:loaders.length,beginCount:(source.match(/<!-- Phase 24C-2C zero-only authority load BEGIN -->/g)||[]).length,endCount:(source.match(/<!-- Phase 24C-2C zero-only authority load END -->/g)||[]).length}}

const validatorId='validator.schema-13.phase-24c-independent.v1';
const directOriginValidatorId='validator.direct-schema-14-origin.phase-24c-independent.v1';
function validateSchema13(value){
  if(!value||value.schemaVersion!==13||!value.saveMeta||typeof value.saveMeta.saveId!=='string'||!value.saveMeta.saveId||!Number.isSafeInteger(value.saveMeta.revision)||value.saveMeta.revision<1||!Number.isSafeInteger(value.saveMeta.createdAt)||!Number.isSafeInteger(value.saveMeta.updatedAt)||value.saveMeta.updatedAt<value.saveMeta.createdAt||typeof value.saveMeta.source!=='string'||!value.saveMeta.source||!Array.isArray(value.saveMeta.appliedMigrations)||!Number.isSafeInteger(value.gold)||value.gold<0||!value.player||!Number.isSafeInteger(value.player.rankExp)||value.player.rankExp<0||!value.family||typeof value.family!=='object'||Array.isArray(value.family))return false;
  return Object.values(value.family).every(row=>row&&Number.isSafeInteger(row.intimacy)&&row.intimacy>=0&&Array.isArray(row.claimedIntimacyMilestoneIds));
}
function predecessor({id='save-independent-direct',throughMigration=false,rankExp=12000,gold=5000}={}){
  return{schemaVersion:13,saveMeta:{saveId:id,revision:7,createdAt:1000,updatedAt:2000,source:'phase-23-independent-fixture',appliedMigrations:throughMigration?[{id:'schema-12-to-13',from:12,to:13,receiptVersion:1}]:[]},gold,player:{rankExp},family:{elara:{intimacy:620,claimedIntimacyMilestoneIds:['intimacy-150']}}};
}
function migrate(input,raw=JSON.stringify(input,null,2)){
  const captured=foundation.capturePreSuccessorCheckpoint(input,raw,{checkpointId:`checkpoint.phase24c.${input.saveMeta.saveId}.v1`});
  const checkpoint=foundation.attestPreSuccessorCheckpoint(captured,{rereadRaw:raw});
  const context={validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,resolvePredecessorCheckpoint:requested=>requested===checkpoint.identity?{checkpoint,raw}:null};
  const result=foundation.migrateSchema13To14(input,{...context,now:3000,source:'phase24c-independent-migration',predecessorCheckpoint:checkpoint});
  return{...result,raw,checkpoint,context};
}
function directOrigin({id='save-independent-direct-schema14',reset=false}={}){
  const state={schemaVersion:13,saveMeta:{saveId:id,revision:1,createdAt:1000,updatedAt:1000,source:reset?'safe-reset':'fresh',appliedMigrations:[]},gold:5000,player:{rankExp:0},family:{elara:{intimacy:0,claimedIntimacyMilestoneIds:[]}}};
  if(reset)state.saveMeta.retainedCheckpointLineage={kind:'phase24c-independent-qa-safe-reset-attestation',saveId:id,resetAt:1000,preResetSaveId:'save-independent-prior',preResetRevision:8,preResetActiveRawIdentity:'fnv1a32:1:00000000'};
  return state;
}
function validateDirectOrigin(value,lineageKind){
  if(!validateSchema13(value)||value.saveMeta.revision!==1||value.saveMeta.createdAt!==value.saveMeta.updatedAt)return false;
  if(lineageKind==='direct-schema-14')return value.saveMeta.source==='fresh'&&!Object.hasOwn(value.saveMeta,'retainedCheckpointLineage');
  return lineageKind==='safe-reset-schema-14'&&value.saveMeta.source==='safe-reset'&&value.saveMeta.retainedCheckpointLineage?.saveId===value.saveMeta.saveId&&typeof value.saveMeta.retainedCheckpointLineage?.preResetSaveId==='string'&&value.saveMeta.retainedCheckpointLineage.preResetSaveId!==value.saveMeta.saveId;
}
function activateDirect(input,lineageKind){
  const origins=new Map(),context={validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,validateDirectOrigin,directOriginValidatorId,resolveDirectOrigin:requested=>origins.get(requested)||null};
  const result=foundation.createDirectSchema14(input,{...context,lineageKind});origins.set(result.attestation.identity,clone(input));return{...result,context,origins};
}
function forensicNullOrigin({id,rawIdentity}){const state=directOrigin({id,reset:true});state.saveMeta.retainedCheckpointLineage={kind:'safe-reset-retained-checkpoints',version:9,saveId:id,resetAt:state.saveMeta.createdAt,preResetSaveId:null,preResetRevision:null,preResetActiveRawIdentity:rawIdentity,phase24cPreviousInstallationIdentity:'a'.repeat(64)};return state}
function activateForensicNull(input,validator){const origins=new Map(),context={validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,validateDirectOrigin:validator,directOriginValidatorId,resolveDirectOrigin:requested=>origins.get(requested)||null};const result=foundation.createDirectSchema14(input,{...context,lineageKind:'safe-reset-schema-14'});origins.set(result.attestation.identity,clone(input));return{...result,context,origins}}
function makeProfile(authority,id,kind,contributingDefinitionIds){
  const totals={powerBps:0,earningsBps:0,expBps:0,facilityBpsByFacilityId:{}};
  for(const grantId of contributingDefinitionIds){const grant=authority.collections.grantDefinitions.find(row=>row.id===grantId);if(!grant)continue;if(grant.targetPool==='facility')totals.facilityBpsByFacilityId[grant.facilityId]=(totals.facilityBpsByFacilityId[grant.facilityId]||0)+grant.bps;else totals[`${grant.targetPool}Bps`]+=grant.bps}
  const profile={id,version:1,kind,ownershipBand:kind,status:'accepted-private-candidate',contributingDefinitionIds:[...contributingDefinitionIds],collectionBpsByPool:totals,limitedContentRequired:kind==='high-all-content'&&contributingDefinitionIds.some(grantId=>authority.collections.grantDefinitions.find(row=>row.id===grantId)?.classification!=='permanent'),requirementTableIds:authority.requirements.tables.map(row=>row.id).sort(),fixtureReportIdentity:''};
  profile.fixtureReportIdentity=identity('fixture-report',profile);
  return profile;
}
function sealRelease(authority,release){
  const obtainable=authority.collections.grantDefinitions.filter(grant=>{const owner=authority.releaseManifests.find(row=>row.id===grant.releaseId);return owner?.active&&owner.sequence<=release.sequence&&grant.releaseState==='active'}),permanentIds=obtainable.filter(grant=>grant.classification==='permanent').map(grant=>grant.id).sort(),alternativeTargets=new Set(obtainable.filter(grant=>grant.classification==='limited-with-permanent-alternative').map(grant=>grant.permanentAlternativeId)),allIds=obtainable.filter(grant=>!alternativeTargets.has(grant.id)).map(grant=>grant.id).sort(),medianIds=permanentIds.slice(0,Math.ceil(permanentIds.length/2)),slug=release.id.replace(/^release\./,'');
  const prior=new Set(release.requirementFixtureProfileIds||[]);authority.requirements.permanentOnlyProfiles=authority.requirements.permanentOnlyProfiles.filter(profile=>!prior.has(profile.id));
  const profiles=[makeProfile(authority,`requirements.profile.${slug}.zero.v1`,'zero-permanent',[]),makeProfile(authority,`requirements.profile.${slug}.median.v1`,'median-permanent',medianIds),makeProfile(authority,`requirements.profile.${slug}.high-permanent.v1`,'high-permanent',permanentIds),makeProfile(authority,`requirements.profile.${slug}.high-all.v1`,'high-all-content',allIds)];
  authority.requirements.permanentOnlyProfiles.push(...profiles);release.requirementFixtureProfileIds=profiles.map(profile=>profile.id);release.permanentOnlyRequirementProfileId=profiles[2].id;
  const baseline=authority.simulationPackages[0],packageId=`simulation.${slug}.approved.v1`;authority.simulationPackages=authority.simulationPackages.filter(row=>row.id!==release.simulationPackageId||row===baseline);const simulationPackage={id:packageId,version:1,status:'approved-private-candidate',artifactHashes:clone(baseline.artifactHashes),tableHashes:clone(baseline.tableHashes),requirementActivationApproved:true,collectionGrantActivationApproved:true,runtimeCurveActivationApproved:true,rewardThroughputApproved:true};authority.simulationPackages.push(simulationPackage);release.simulationPackageId=packageId;
  release.limitedContentRequired=false;
  const grants=release.collectionGrantDefinitionIds.map(id=>authority.collections.grantDefinitions.find(row=>row.id===id)).sort((a,b)=>a.id.localeCompare(b.id));
  const ranks=authority.rank.table.slice(authority.rank.releasedThrough,release.releasedRankThrough);
  const tables=[...authority.requirements.tables].sort((a,b)=>a.id.localeCompare(b.id));
  release.activationEvidence={
    predecessorScalingIdentity:identity('predecessor-scaling',authority.predecessorScaling),
    simulationPackageIdentity:identity('simulation-package',simulationPackage),
    contentDependencySetIdentity:identity('content-dependencies',[...release.contentDependencyIds].sort()),
    rankDefinitionSetIdentity:identity('rank-definitions',ranks),
    collectionGrantDefinitionSetIdentity:identity('collection-grants',grants),
    requirementTableSetIdentity:identity('requirement-tables',tables),
    fixtureProfileSetIdentity:identity('fixture-profiles',[...profiles].sort((a,b)=>a.id.localeCompare(b.id))),
    permanentOnlyProfileIdentity:identity('permanent-only-profile',profiles[2]),
    obtainablePermanentTotals:clone(profiles[2].collectionBpsByPool),
    obtainableLimitedTotals:(()=>{const totals={powerBps:0,earningsBps:0,expBps:0,facilityBpsByFacilityId:{}};for(const grant of obtainable.filter(row=>row.classification!=='permanent')){if(grant.targetPool==='facility')totals.facilityBpsByFacilityId[grant.facilityId]=(totals.facilityBpsByFacilityId[grant.facilityId]||0)+grant.bps;else totals[`${grant.targetPool}Bps`]+=grant.bps}return totals})(),
    obtainableHighAllTotals:clone(profiles[3].collectionBpsByPool),
    releaseBudgetReportSha256:crypto.createHash('sha256').update(`release-budget:${release.id}`).digest('hex'),
    longHorizonReportSha256:crypto.createHash('sha256').update(`long-horizon:${release.id}`).digest('hex'),
    safeIntegerReportSha256:crypto.createHash('sha256').update(`safe-integer:${release.id}`).digest('hex')
  };
  return authority;
}
function makeGrant(releaseId,index,{pool=['power','earnings','exp','facility'][(index-1)%4],facilityId=null,bps=500,classification='permanent',alternative=null,prefix='independent'}={}){
  return{id:`collection.grant.${prefix}-${index}.v1`,releaseId,definitionVersion:1,rewardVersion:1,classification,permanentAlternativeId:alternative,claimSourceId:`claim.${prefix}-${index}.v1`,targetPool:pool,facilityId:pool==='facility'?(facilityId||'facility.restaurant'):null,bps,releaseState:'active'};
}
function collectionAuthority(count=22){
  const authority=clone(definitions),release=authority.releaseManifests[0];
  release.status='active';release.active=true;release.contentDependencyIds=['content.phase24c.collection-independent.v1'];
  for(let index=1;index<=count;index++){const grant=makeGrant(release.id,index,{bps:index===count?100000:500});authority.collections.grantDefinitions.push(grant);release.collectionGrantDefinitionIds.push(grant.id)}
  return sealRelease(authority,release);
}
function activate(state,authority){
  const next=clone(state),active=authority.releaseManifests.filter(row=>row.active);
  next.durableProgression.manifestHash=foundation.authorityHash(authority);
  next.durableProgression.activeReleaseIds=active.map(row=>row.id).sort();
  next.durableProgression.ladders.rank.releasedThrough=Math.max(authority.rank.releasedThrough,...active.map(row=>row.releasedRankThrough));
  return next;
}
function setPackageApprovals(authority,release,approvals){
  const simulationPackage=authority.simulationPackages.find(row=>row.id===release.simulationPackageId);Object.assign(simulationPackage,approvals);release.activationEvidence.simulationPackageIdentity=identity('simulation-package',simulationPackage);return authority;
}
function claim(state,definition,at,context){
  const payload=foundation.captureCollectionGrantPayload(state,definition,{capturedAt:at,...context});
  const preview=foundation.previewCollectionGrant(state,payload,{previewedAt:at+1,...context});
  return{payload,preview,result:foundation.finalizeCollectionGrant(state,payload,preview,{claimedAt:at+2,...context})};
}

// Realm isolation, production identity, and absence from the live loader.
check('independent SHA known answer',foundation.sha256('abc')==='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
check('independent foundation API is reopened version 2 only',foundation.version===2&&contract.foundationVersion===2&&foundation.status==='inactive-foundation-only');
for(const name of ['EVERSTEAD_PHASE24C_DEFINITIONS','EVERSTEAD_PHASE24C_FOUNDATION']){
  const descriptor=Object.getOwnPropertyDescriptor(realm,name);
  check(`${name} is hidden and immutable`,descriptor&&descriptor.enumerable===false&&descriptor.writable===false&&descriptor.configurable===false);
}
check('definitions are deeply frozen',deepFrozen(definitions));
check('foundation API is deeply frozen',deepFrozen(foundation));
check('definition manifest independently recomputed',crypto.createHash('sha256').update(canonical(definitions)).digest('hex')===foundation.manifestHash,foundation.manifestHash);
for(const[relative,expected]of Object.entries(contract.productionSha256))if(relative!=='index.html')check(`frozen production hash ${relative}`,fileHash(relative)===expected,fileHash(relative));
for(const[relative,expected]of Object.entries(contract.sourceSha256))check(`frozen Phase24C source hash ${relative}`,expected!=='PENDING_FREEZE'&&fileHash(relative)===expected,fileHash(relative));
const indexText=fs.readFileSync(path.join(root,'index.html'),'utf8');
const projected=c2cProjection(indexText);
check('production index projects exactly to accepted C2B bytes',textHash(projected.normalized)===contract.productionSha256['index.html'],textHash(projected.normalized));
check('production index has one exact least-authority C2C loader',projected.loaderCount===1&&projected.beginCount===1&&projected.endCount===1&&canonical(projected.loaderSources)===canonical(contract.zeroIntegrationLoader.exactOrder),projected.loaderSources);

// Accepted Phase24B evidence and exact table identities.
for(const[relative,expected]of Object.entries(contract.phase24bPins))check(`Phase24B pin ${relative}`,fileHash(relative)===expected,fileHash(relative));
const simulation=JSON.parse(fs.readFileSync(path.join(root,'qa/phase-24b-progression/reports/phase24b-progression-simulation.json'),'utf8'));
check('Phase24B Fellow table hash recomputed',dataHash(simulation.tables.fellow)===contract.phase24bTableSha256.fellow,dataHash(simulation.tables.fellow));
check('Phase24B Companion table hash recomputed',dataHash(simulation.tables.companion)===contract.phase24bTableSha256.companion,dataHash(simulation.tables.companion));
const brokenRoads=[22000,28500,36000,45000,56000,69000,84000,101000,121000,144000];
check('released requirement hash recomputed',dataHash(brokenRoads)===contract.phase24bTableSha256.releasedRequirements,dataHash(brokenRoads));
equal('Broken Roads exact runtime table',definitions.requirements.tables.find(row=>row.id==='requirements.broken-roads.book-1.v1').rows,brokenRoads);
const acceptedPinMap={contractSha256:'design/phase-24/PHASE_24B_PROGRESSION_SIMULATION_CONTRACT.md',candidateSha256:'design/phase-24/phase24b-progression-candidates.json',generatorSha256:'scripts/phase24b-simulate-progression.mjs',machineReportSha256:'qa/phase-24b-progression/reports/phase24b-progression-simulation.json',humanReportSha256:'qa/phase-24b-progression/reports/phase24b-progression-simulation.md',modelManifestSha256:'qa/phase-24b-progression/reports/checksums.sha256',independentQaContractSha256:'docs/PHASE_24B_PROGRESSION_SIMULATION_QA_CONTRACT.md',independentQaResultSha256:'docs/PHASE_24B_PROGRESSION_SIMULATION_QA_RESULT.md',independentFixtureSha256:'qa/phase-24b-independent/fixtures/contract.json',independentVerifierSha256:'qa/phase-24b-independent/verify.mjs',independentManifestSha256:'qa/phase-24b-independent/checksums.sha256'};
for(const[field,relative]of Object.entries(acceptedPinMap))check(`definition pin resolves ${field}`,definitions.acceptedSimulation[field]===contract.phase24bPins[relative]);
equal('definition table pins resolve independently',definitions.acceptedSimulation.tableHashes,contract.phase24bTableSha256);
const baselineSimulationPackage=definitions.simulationPackages[0];
check('Phase24B package remains provisional and activation-disabled',baselineSimulationPackage.status==='provisional-baseline-only'&&baselineSimulationPackage.requirementActivationApproved===false&&baselineSimulationPackage.collectionGrantActivationApproved===false&&baselineSimulationPackage.runtimeCurveActivationApproved===false&&baselineSimulationPackage.rewardThroughputApproved===false);
for(const[field,relative]of Object.entries(acceptedPinMap))check(`simulation package pin resolves ${field}`,baselineSimulationPackage.artifactHashes[field]===contract.phase24bPins[relative]);

// Definition topology and fail-closed mutations.
const frozenDefinitionBytes=canonical(definitions);check('exact definitions validate',foundation.validateDefinitions().ok,foundation.validateDefinitions().errors);
check('definition validator performs no mutation',canonical(definitions)===frozenDefinitionBytes);
check('inactive definitions are a valid release authority',foundation.validateReleaseAuthority().ok,foundation.validateReleaseAuthority().errors);
check('release validator performs no mutation on base authority',canonical(definitions)===frozenDefinitionBytes);
check('Rank graph is 1 through 30',definitions.rank.table.length===30&&definitions.rank.table.every((row,index)=>row.rank===index+1&&row.totalExp===25*(((index+1)*(index+2)/2)-1)));
check('Family graph has 20 identities',definitions.family.ids.length===20&&new Set(definitions.family.ids).size===20);
check('Family shard graph has four per actor',definitions.family.shardMilestones.length===80&&definitions.family.ids.every(id=>definitions.family.shardMilestones.filter(row=>row.familyId===id).length===4));
check('Family narrative graph is separate four per actor',definitions.family.narrativeMilestones.length===80&&definitions.family.ids.every(id=>definitions.family.narrativeMilestones.filter(row=>row.familyId===id).length===4));
check('Legacy graph has 12 continuing tracks',definitions.legacy.tracks.length===12&&definitions.legacy.tracks.every(row=>row.carriesProgress&&row.manualClaim&&row.thresholds.length===11));
check('facility graph has 12 isolated ladders',definitions.facilities.ids.length===12&&definitions.facilities.ladders.length===12&&definitions.facilities.ladders.every(row=>definitions.facilities.ids.includes(row.facilityId)&&row.thresholds.length===0));
equal('four Collection pool kinds',definitions.collections.pools.map(row=>row.kind),['power','earnings','exp','facility']);
check('all tutorials remain inactive and reward-neutral',definitions.tutorials.length===6&&definitions.tutorials.every(row=>row.releaseState==='reserved-inactive'&&row.rewardNeutral&&row.optional&&row.skippable&&row.replayable));
const actorIds=new Set([...definitions.cast.fellowIds.map(id=>`fellow.${id}`),...definitions.cast.familyIds.map(id=>`family.${id}`)]);
check('all 38 current actors are scheduled without fabricated verified work',actorIds.size===38&&definitions.cast.coverage.length===38&&definitions.cast.coverage.every(row=>actorIds.has(row.actorId)&&row.scheduledContributionIds.length===1&&row.verifiedCurrentContributionIds.length===0));
const castContract=JSON.parse(fs.readFileSync(path.join(root,'design/phase-15-16/cast-hooks.json'),'utf8')),hooksByActor=new Map(castContract.actors.map(row=>[row.actorId,new Set(row.hookIds)]));
check('all scheduled cast hooks resolve to authored cast contract',definitions.cast.coverage.every(row=>hooksByActor.has(row.actorId)&&row.scheduledContributionIds.every(id=>hooksByActor.get(row.actorId).has(id))));
check('foundation remains entirely inactive',definitions.activation.productionLoaded===false&&definitions.activation.activeReleaseIds.length===0&&definitions.collections.grantDefinitions.length===0&&definitions.requirements.permanentOnlyProfiles.length===0&&definitions.releaseManifests.every(row=>!row.active));

const definitionMutations=[
  value=>{value.rank.table[5].totalExp++},value=>{value.rank.table[5].releaseState='active-content-backed'},value=>{value.rank.table[5].contentDependencyIds=['content.rank-6.live']},
  value=>{value.acceptedSimulation.machineReportSha256='0'.repeat(64)},value=>{value.acceptedSimulation.tableHashes.fellow='0'.repeat(64)},value=>{value.requirements.tables[0].rows[1]=26000},
  value=>{value.collections.pools[0].application='multiply-final'},value=>{value.collections.sharedLifetimeCapBps=3000},value=>{value.family.economicIntimacyCap=600},
  value=>{value.cast.coverage[0].verifiedCurrentContributionIds=['fabricated']},value=>{value.tutorials[0].rewardNeutral=false},value=>{value.releaseManifests[0].active=true}
];
for(const [index,mutate] of definitionMutations.entries()){const value=clone(definitions);mutate(value);check(`exact definition mutation ${index+1} rejected`,!foundation.validateDefinitions(value).ok)}
noThrow('null definitions reject without throw',()=>foundation.validateDefinitions(null),value=>value.ok===false);
const cycle={};cycle.self=cycle;
noThrow('cyclic definitions reject without throw',()=>foundation.validateDefinitions(cycle),value=>value.ok===false);
noThrow('throwing definitions proxy rejects without throw',()=>foundation.validateDefinitions(new Proxy({},{get(){throw new Error('trap')}})),value=>value.ok===false);
noThrow('partial authority rejects without throw',()=>foundation.validateReleaseAuthority({releaseManifests:null}),value=>value.ok===false);

const invalidAuthorities=[];
const duplicateClaims=collectionAuthority(2);duplicateClaims.collections.grantDefinitions[1].claimSourceId=duplicateClaims.collections.grantDefinitions[0].claimSourceId;sealRelease(duplicateClaims,duplicateClaims.releaseManifests[0]);invalidAuthorities.push(['duplicate claim source',duplicateClaims]);
const unbackedRank=clone(definitions);unbackedRank.releaseManifests[0].status='active';unbackedRank.releaseManifests[0].active=true;unbackedRank.releaseManifests[0].releasedRankThrough=6;invalidAuthorities.push(['unbacked Rank row',unbackedRank]);
const activeRankMutation=clone(definitions),arm=activeRankMutation.releaseManifests[0];arm.status='active';arm.active=true;arm.releasedRankThrough=6;activeRankMutation.rank.table[5].releaseState='active-content-backed';activeRankMutation.rank.table[5].contentDependencyIds=['story.book2.rank-6.live'];arm.contentDependencyIds=['story.book2.rank-6.live'];sealRelease(activeRankMutation,arm);activeRankMutation.rank.table[5].totalExp++;sealRelease(activeRankMutation,arm);invalidAuthorities.push(['repriced Rank formula even with new evidence',activeRankMutation]);
const nonzeroMandatory=collectionAuthority(1);nonzeroMandatory.requirements.permanentOnlyProfiles.find(row=>row.kind==='zero-permanent').collectionBpsByPool.powerBps=1;invalidAuthorities.push(['nonzero zero-ownership Collection profile',nonzeroMandatory]);
const limitedRequired=collectionAuthority(1);limitedRequired.releaseManifests[0].limitedContentRequired=true;invalidAuthorities.push(['limited content required',limitedRequired]);
const provisionalActivation=collectionAuthority(1),provisionalRelease=provisionalActivation.releaseManifests[0];provisionalActivation.simulationPackages=provisionalActivation.simulationPackages.filter(row=>row.id===baselineSimulationPackage.id);provisionalRelease.simulationPackageId=baselineSimulationPackage.id;provisionalRelease.activationEvidence.simulationPackageIdentity=identity('simulation-package',provisionalActivation.simulationPackages[0]);invalidAuthorities.push(['provisional Phase24B package used for activation',provisionalActivation]);
for(const[name,value]of invalidAuthorities)check(`${name} authority rejected`,!foundation.validateReleaseAuthority(value).ok,foundation.validateReleaseAuthority(value).errors);
const validatorMutationProbe=collectionAuthority(3),validatorMutationBytes=canonical(validatorMutationProbe);foundation.validateReleaseAuthority(validatorMutationProbe);check('release validator performs no mutation on candidate authority',canonical(validatorMutationProbe)===validatorMutationBytes);

// Checkpoint, migration lineage, bootstrap distinction, and immutable activation target.
const directFresh=activateDirect(directOrigin(),'direct-schema-14'),directReset=activateDirect(directOrigin({id:'save-independent-reset-schema14',reset:true}),'safe-reset-schema-14');
let nullValidatorCalls=0;
const nullValidator=expectedRawIdentity=>(value,lineageKind)=>{nullValidatorCalls++;const marker=value?.saveMeta?.retainedCheckpointLineage;return validateSchema13(value)&&lineageKind==='safe-reset-schema-14'&&value.saveMeta.source==='safe-reset'&&marker?.version===9&&marker?.kind==='safe-reset-retained-checkpoints'&&marker?.saveId===value.saveMeta.saveId&&marker?.resetAt===value.saveMeta.createdAt&&marker?.preResetSaveId===null&&marker?.preResetRevision===null&&marker?.preResetActiveRawIdentity===expectedRawIdentity&&marker?.phase24cPreviousInstallationIdentity==='a'.repeat(64)};
const forensicMissing=forensicNullOrigin({id:'save-independent-forensic-missing',rawIdentity:'null:0:00000000'}),forensicMissingResult=activateForensicNull(forensicMissing,nullValidator('null:0:00000000'));
check('independent forensic missing-origin null pair requires named validator',forensicMissingResult.changed&&nullValidatorCalls===2&&foundation.validateSuccessorState(forensicMissingResult.state,forensicMissingResult.context).ok,foundation.validateSuccessorState(forensicMissingResult.state,forensicMissingResult.context).errors);
const callsAfterMissing=nullValidatorCalls,forensicMalformed=forensicNullOrigin({id:'save-independent-forensic-malformed',rawIdentity:'fnv1a32:1:00000000'}),forensicMalformedResult=activateForensicNull(forensicMalformed,nullValidator('fnv1a32:1:00000000'));
check('independent forensic malformed-origin null pair requires named validator',forensicMalformedResult.changed&&nullValidatorCalls===callsAfterMissing+2&&foundation.validateSuccessorState(forensicMalformedResult.state,forensicMalformedResult.context).ok,foundation.validateSuccessorState(forensicMalformedResult.state,forensicMalformedResult.context).errors);
const incompleteNull=forensicNullOrigin({id:'save-independent-forensic-incomplete',rawIdentity:'null:0:00000000'});delete incompleteNull.saveMeta.retainedCheckpointLineage.phase24cPreviousInstallationIdentity;
rejects('independent forensic null pair rejects incomplete binding',()=>activateForensicNull(incompleteNull,()=>true),/canonical direct/);
const forgedNull=forensicNullOrigin({id:'save-independent-forensic-forged',rawIdentity:'fnv1a32:20:12345678'});
rejects('independent forged semantic source beside null pair rejects',()=>activateForensicNull(forgedNull,()=>false),/validators/);
for(const [name,mutate] of [
  ['save-id-only mixed pair',marker=>{marker.preResetSaveId='save-semantic';marker.preResetRevision=null}],
  ['revision-only mixed pair',marker=>{marker.preResetSaveId=null;marker.preResetRevision=7}],
  ['malformed raw binding',marker=>{marker.preResetActiveRawIdentity='not-an-identity'}],
  ['malformed installation binding',marker=>{marker.phase24cPreviousInstallationIdentity='bad'}]
]){const invalid=forensicNullOrigin({id:`save-independent-${name.replaceAll(' ','-')}`,rawIdentity:'null:0:00000000'});mutate(invalid.saveMeta.retainedCheckpointLineage);rejects(`independent forensic null authority rejects ${name}`,()=>activateForensicNull(invalid,()=>true),/canonical direct/)}
const falseNull=forensicNullOrigin({id:'save-independent-forensic-validator-false',rawIdentity:'null:0:00000000'}),falseNullBefore=canonical(falseNull);
rejects('independent forensic null authority rejects false named validator',()=>activateForensicNull(falseNull,value=>{value.gold=-1;return false}),/validators/);
check('independent false forensic validator cannot mutate caller',canonical(falseNull)===falseNullBefore);
const throwNull=forensicNullOrigin({id:'save-independent-forensic-validator-throw',rawIdentity:'null:0:00000000'}),throwNullBefore=canonical(throwNull);
rejects('independent forensic null authority rejects throwing named validator',()=>activateForensicNull(throwNull,value=>{value.gold=-1;throw new Error('hostile-forensic-validator')}),/validators/);
check('independent throwing forensic validator cannot mutate caller',canonical(throwNull)===throwNullBefore);
const mutateNull=forensicNullOrigin({id:'save-independent-forensic-validator-mutates',rawIdentity:'null:0:00000000'}),mutateNullBefore=canonical(mutateNull),mutateNullResult=activateForensicNull(mutateNull,value=>{value.gold=-1;return true});
check('independent approving forensic validator receives only a clone',canonical(mutateNull)===mutateNullBefore&&mutateNullResult.state.gold===5000);
const hostileDirectOrigin=directOrigin({id:'save-independent-direct-validator-mutates'}),hostileDirectBefore=canonical(hostileDirectOrigin),hostileDirectResult=foundation.createDirectSchema14(hostileDirectOrigin,{lineageKind:'direct-schema-14',validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,validateDirectOrigin:value=>{value.gold=-1;return true},directOriginValidatorId});
check('mutating direct-origin validator cannot mutate caller or target',canonical(hostileDirectOrigin)===hostileDirectBefore&&hostileDirectResult.state.gold===5000);
const falseDirectOrigin=directOrigin({id:'save-independent-direct-validator-false'}),falseDirectBefore=canonical(falseDirectOrigin);
rejects('false mutating direct-origin validator refuses',()=>foundation.createDirectSchema14(falseDirectOrigin,{lineageKind:'direct-schema-14',validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,validateDirectOrigin:value=>{value.gold=-1;return false},directOriginValidatorId}),/validators/);
check('false direct-origin validator leaves caller exact',canonical(falseDirectOrigin)===falseDirectBefore);
const throwingDirectOrigin=directOrigin({id:'save-independent-direct-validator-throws'}),throwingDirectBefore=canonical(throwingDirectOrigin);
rejects('throwing mutating direct-origin validator refuses',()=>foundation.createDirectSchema14(throwingDirectOrigin,{lineageKind:'direct-schema-14',validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,validateDirectOrigin:value=>{value.gold=-1;throw new Error('hostile-direct-validator')},directOriginValidatorId}),/validators/);
check('throwing direct-origin validator leaves caller exact',canonical(throwingDirectOrigin)===throwingDirectBefore);
check('direct fresh schema14 is revision-one and receipt-free',directFresh.state.schemaVersion===14&&directFresh.state.saveMeta.revision===1&&directFresh.receipt===null&&directFresh.state.saveMeta.appliedMigrations.length===0);
check('direct fresh carries no predecessor checkpoint identity',directFresh.state.durableProgression.migrations.activationReceiptId===null&&directFresh.state.durableProgression.migrations.predecessorCheckpointIdentity===null);
check('direct fresh lineage validates independently',foundation.validateSuccessorState(directFresh.state,directFresh.context).ok,foundation.validateSuccessorState(directFresh.state,directFresh.context).errors);
check('direct reset is receipt-free and retains a reset attestation',directReset.receipt===null&&directReset.state.saveMeta.appliedMigrations.length===0&&directReset.state.durableProgression.migrations.lineageKind==='safe-reset-schema-14'&&directReset.attestation.resetLineageIdentity!==null);
check('direct reset validates independently',foundation.validateSuccessorState(directReset.state,directReset.context).ok,foundation.validateSuccessorState(directReset.state,directReset.context).errors);
const directRepeat=foundation.migrateSchema13To14(clone(directFresh.state),{...directFresh.context,now:4000});
check('direct schema14 repeated migration is a receipt-free no-op',directRepeat.changed===false&&directRepeat.receipt===null&&canonical(directRepeat.state)===canonical(directFresh.state));
const directMutation=clone(directFresh.state);directMutation.gold+=31;directMutation.saveMeta.revision++;directMutation.saveMeta.updatedAt++;directMutation.saveMeta.source='independent-direct-gameplay';
check('direct successor ordinary gameplay remains valid',foundation.validateSuccessorState(directMutation,directFresh.context).ok,foundation.validateSuccessorState(directMutation,directFresh.context).errors);
const directNoResolver={...directFresh.context,resolveDirectOrigin:()=>null};
check('direct successor refuses missing reconstructed origin',!foundation.validateSuccessorState(directFresh.state,directNoResolver).ok);
const directWrongValidator={...directFresh.context,directOriginValidatorId:'validator.other-direct-origin.v1'};
check('direct successor refuses wrong named origin validator',!foundation.validateSuccessorState(directFresh.state,directWrongValidator).ok);
const resetTamper=clone(directReset.state);resetTamper.saveMeta.retainedCheckpointLineage.preResetRevision++;
check('direct reset marker rewrite is rejected',!foundation.validateSuccessorState(resetTamper,directReset.context).ok);
const resetRemoval=clone(directReset.state);delete resetRemoval.saveMeta.retainedCheckpointLineage;
check('direct reset marker removal is rejected',!foundation.validateSuccessorState(resetRemoval,directReset.context).ok);
const crossSaveAttestation=clone(directFresh.state);crossSaveAttestation.durableProgression.migrations.directOriginAttestation=clone(directReset.attestation);
check('cross-save direct attestation substitution is rejected',!foundation.validateSuccessorState(crossSaveAttestation,directFresh.context).ok);
const historicalFresh=directOrigin({id:'save-independent-fabricated-history'});historicalFresh.saveMeta.appliedMigrations.push({id:'schema-12-to-13',from:12,to:13});
rejects('direct fresh cannot fabricate predecessor migration history',()=>activateDirect(historicalFresh,'direct-schema-14'),/canonical direct/);
for(const[name,mutate]of[
  ['reset marker on fresh',value=>{value.saveMeta.retainedCheckpointLineage={saveId:value.saveMeta.saveId,preResetSaveId:'save-independent-other'}}],
  ['non-fresh source',value=>{value.saveMeta.source='boot'}],
  ['revision above one',value=>{value.saveMeta.revision=2}],
  ['unequal timestamps',value=>{value.saveMeta.updatedAt++}]
]){const invalid=directOrigin({id:`save-independent-invalid-${name.replaceAll(' ','-')}`});mutate(invalid);rejects(`direct fresh independently rejects ${name}`,()=>activateDirect(invalid,'direct-schema-14'),/validators|canonical direct/)}
const sameSaveReset=directOrigin({id:'save-independent-reset-same-prior',reset:true});sameSaveReset.saveMeta.retainedCheckpointLineage.preResetSaveId=sameSaveReset.saveMeta.saveId;
rejects('direct reset independently requires a distinct prior save ID',()=>activateDirect(sameSaveReset,'safe-reset-schema-14'),/validators|canonical direct/);
const wrongMarkerOwner=directOrigin({id:'save-independent-reset-wrong-owner',reset:true});wrongMarkerOwner.saveMeta.retainedCheckpointLineage.saveId='save-independent-other-owner';
rejects('direct reset independently binds marker owner to current save',()=>activateDirect(wrongMarkerOwner,'safe-reset-schema-14'),/validators|canonical direct/);
const cyclicResolvedOrigin=directOrigin({id:'save-independent-cyclic-resolver'});cyclicResolvedOrigin.self=cyclicResolvedOrigin;
for(const[name,resolver]of[
  ['throwing',()=>{throw new Error('hostile-resolver')}],
  ['malformed',()=>({state:{}})],
  ['cyclic',()=>cyclicResolvedOrigin],
  ['wrong-save',()=>directOrigin({id:'save-independent-wrong-resolved'})],
  ['wrong-lineage',()=>directOrigin({id:directFresh.state.saveMeta.saveId,reset:true})]
])check(`direct successor independently rejects ${name} resolver`,!foundation.validateSuccessorState(directFresh.state,{...directFresh.context,resolveDirectOrigin:resolver}).ok);
const directWithReceipt=clone(directFresh.state);directWithReceipt.saveMeta.appliedMigrations.push({id:'migration.schema-13-to-14.phase-24c-foundation.v2'});
check('direct lineage independently rejects migration receipt history',!foundation.validateSuccessorState(directWithReceipt,directFresh.context).ok);
const directWithCheckpoint=clone(directFresh.state);directWithCheckpoint.durableProgression.migrations.predecessorCheckpointIdentity='0'.repeat(64);
check('direct lineage independently rejects checkpoint identity',!foundation.validateSuccessorState(directWithCheckpoint,directFresh.context).ok);
const swappedFreshTag=clone(directFresh.state);swappedFreshTag.durableProgression.migrations.lineageKind='safe-reset-schema-14';swappedFreshTag.durableProgression.migrations.bootstrapPolicy='safe-reset-schema-14';
check('direct fresh/reset lineage tags independently refuse interchange',!foundation.validateSuccessorState(swappedFreshTag,directFresh.context).ok);
check('direct reset independently uses a new save ID',directReset.state.saveMeta.saveId!==directReset.state.saveMeta.retainedCheckpointLineage.preResetSaveId);
const directClaimAuthority=collectionAuthority(1),directClaimContext={...directFresh.context,authority:directClaimAuthority},directClaimState=activate(directFresh.state,directClaimAuthority),directClaim=claim(directClaimState,directClaimAuthority.collections.grantDefinitions[0],2500,directClaimContext);
check('direct schema14 lineage supports one Collection finalization',directClaim.result.ok&&directClaim.result.rewardApplications===1&&foundation.validateSuccessorState(directClaim.result.state,directClaimContext).ok,directClaim.result.reason);
const migratedResetPredecessor=predecessor({id:'save-independent-migrated-reset'});migratedResetPredecessor.saveMeta.retainedCheckpointLineage={kind:'phase23-safe-reset-lineage-v1',resetAt:1000,preResetSaveId:'save-independent-before-reset',preResetRevision:6,preResetActiveRawIdentity:'fnv1a32:1:00000000'};
const direct=migrate(predecessor());
const through=migrate(predecessor({id:'save-independent-through',throughMigration:true}));
const migratedReset=migrate(migratedResetPredecessor);
const migrationWithDirectAttestation=clone(direct.state);migrationWithDirectAttestation.durableProgression.migrations.directOriginAttestation=clone(directFresh.attestation);
check('migration lineage independently rejects a direct-origin attestation',!foundation.validateSuccessorState(migrationWithDirectAttestation,direct.context).ok);
function attemptWithHostileValidator(id,validator){const input=predecessor({id}),before=canonical(input),raw=JSON.stringify(input,null,2),captured=foundation.capturePreSuccessorCheckpoint(input,raw,{checkpointId:`checkpoint.${id}.v1`}),checkpoint=foundation.attestPreSuccessorCheckpoint(captured,{rereadRaw:raw}),context={validatePredecessor:validator,predecessorValidatorId:`validator.${id}.v1`,resolvePredecessorCheckpoint:requested=>requested===checkpoint.identity?{checkpoint,raw}:null};let outcome,error=null;try{outcome=foundation.migrateSchema13To14(input,{...context,now:3000,predecessorCheckpoint:checkpoint})}catch(caught){error=caught}return{input,before,raw,outcome,error}}
const mutatingTrue=attemptWithHostileValidator('mutating-true',value=>{value.gold=-500;value.saveMeta.saveId='hostile-rewrite';return true});
check('mutating true predecessor validator sees only a clone',!mutatingTrue.error&&canonical(mutatingTrue.input)===mutatingTrue.before&&mutatingTrue.outcome.state.gold===5000&&mutatingTrue.outcome.state.saveMeta.saveId==='mutating-true');
const mutatingFalse=attemptWithHostileValidator('mutating-false',value=>{value.gold=-500;return false});
check('mutating false predecessor validator refuses without caller mutation',Boolean(mutatingFalse.error)&&canonical(mutatingFalse.input)===mutatingFalse.before&&mutatingFalse.raw===JSON.stringify(mutatingFalse.input,null,2));
const mutatingThrow=attemptWithHostileValidator('mutating-throw',value=>{value.gold=-500;throw new Error('validator-hostile')});
check('throwing predecessor validator refuses without caller mutation',Boolean(mutatingThrow.error)&&canonical(mutatingThrow.input)===mutatingThrow.before&&mutatingThrow.raw===JSON.stringify(mutatingThrow.input,null,2));
check('direct migration succeeds and is reward-neutral',direct.changed&&direct.state.schemaVersion===14&&direct.receipt.rewardApplications===0);
check('through-migration origin succeeds and is reward-neutral',through.changed&&through.state.schemaVersion===14&&through.receipt.rewardApplications===0);
check('bootstrap policies remain distinct',direct.receipt.bootstrapPolicy==='direct-schema-13'&&through.receipt.bootstrapPolicy==='predecessor-through-migration');
check('direct origin invents no schema-12 history',direct.state.saveMeta.appliedMigrations.every(row=>row.id!=='schema-12-to-13'));
check('through origin preserves schema-12 history',through.state.saveMeta.appliedMigrations.filter(row=>row.id==='schema-12-to-13').length===1);
check('migrated schema13 reset lineage is bound through pre-v14 checkpoint',migratedReset.state.durableProgression.migrations.resetLineagePolicy==='predecessor-reset-lineage-bound-v1'&&foundation.validateSuccessorState(migratedReset.state,migratedReset.context).ok);
check('raw and semantic identities are independently bound',direct.receipt.predecessorRawIdentity!==direct.receipt.predecessorSemanticIdentity&&direct.receipt.predecessorCheckpointIdentity===direct.checkpoint.identity);
check('raw predecessor hash independently recomputed',direct.receipt.predecessorRawIdentity===crypto.createHash('sha256').update(direct.raw).digest('hex'));
check('semantic predecessor hash independently recomputed',direct.receipt.predecessorSemanticIdentity===crypto.createHash('sha256').update(canonical(JSON.parse(direct.raw))).digest('hex'));
check('migrated successor validates',foundation.validateSuccessorState(direct.state,direct.context).ok,foundation.validateSuccessorState(direct.state,direct.context).errors);
const directBeforeValidation=canonical(direct.state);foundation.validateSuccessorState(direct.state,direct.context);check('successor validator performs no mutation',canonical(direct.state)===directBeforeValidation);
const repeat=foundation.migrateSchema13To14(clone(direct.state),{...direct.context,now:4000});
check('migration retry is exactly-once',repeat.changed===false&&repeat.receipt.identity===direct.receipt.identity&&repeat.receipt.rewardApplications===0);

const originalReceipt=clone(direct.state.saveMeta.appliedMigrations.at(-1));
const ordinary=clone(direct.state);ordinary.gold+=77;ordinary.player.rankExp+=50;ordinary.family.elara.intimacy+=9;ordinary.saveMeta.revision++;ordinary.saveMeta.updatedAt++;ordinary.saveMeta.source='ordinary-valid-phase24c-independent';
check('ordinary inherited mutation validates',foundation.validateSuccessorState(ordinary,direct.context).ok,foundation.validateSuccessorState(ordinary,direct.context).errors);
equal('ordinary mutation leaves activation receipt byte-stable',ordinary.saveMeta.appliedMigrations.at(-1),originalReceipt);
check('ordinary projection contains live successor changes',foundation.currentSchema13Projection(ordinary).gold===5077&&foundation.currentSchema13Projection(ordinary).player.rankExp===12050&&foundation.currentSchema13Projection(ordinary).family.elara.intimacy===629);
const originalTargetProjection=clone(direct.state),originalTargetReceipt=originalTargetProjection.saveMeta.appliedMigrations.at(-1);originalTargetReceipt.activationTargetIdentity='';originalTargetReceipt.identity='';
const mutableTargetProjection=clone(ordinary),mutableTargetReceipt=mutableTargetProjection.saveMeta.appliedMigrations.at(-1);mutableTargetReceipt.activationTargetIdentity='';mutableTargetReceipt.identity='';
const independentOriginalTarget=crypto.createHash('sha256').update(canonical(originalTargetProjection)).digest('hex'),independentMutableTarget=crypto.createHash('sha256').update(canonical(mutableTargetProjection)).digest('hex');
check('activation target binds original checkpoint-derived target',originalReceipt.activationTargetIdentity===independentOriginalTarget);
check('activation target is not recomputed from mutable successor',independentMutableTarget!==originalReceipt.activationTargetIdentity&&foundation.validateSuccessorState(ordinary,direct.context).ok);
for(const[name,mutate]of[
  ['negative Gold',value=>{value.gold=-1}],['unsafe Rank EXP',value=>{value.player.rankExp=Number.MAX_SAFE_INTEGER+1}],['malformed Family intimacy',value=>{value.family.elara.intimacy=-1}],['malformed Family claims',value=>{value.family.elara.claimedIntimacyMilestoneIds=null}]
]){const invalid=clone(ordinary);mutate(invalid);check(`${name} inherited mutation rejected`,!foundation.validateSuccessorState(invalid,direct.context).ok)}
const tamperedTarget=clone(ordinary);tamperedTarget.saveMeta.appliedMigrations.at(-1).activationTargetIdentity='0'.repeat(64);
check('mutable activation-target tamper rejected',!foundation.validateSuccessorState(tamperedTarget,direct.context).ok);
const tamperedIdentity=clone(ordinary);tamperedIdentity.saveMeta.appliedMigrations.at(-1).identity='0'.repeat(64);
check('migration receipt identity tamper rejected',!foundation.validateSuccessorState(tamperedIdentity,direct.context).ok);
check('missing checkpoint resolver rejected',!foundation.validateSuccessorState(ordinary,{...direct.context,resolvePredecessorCheckpoint:()=>null}).ok);
check('wrong named predecessor validator rejected',!foundation.validateSuccessorState(ordinary,{...direct.context,predecessorValidatorId:'validator.other.v1'}).ok);
const changedRaw=direct.raw+'\n';
rejects('checkpoint reread must be byte exact',()=>foundation.attestPreSuccessorCheckpoint(foundation.capturePreSuccessorCheckpoint(predecessor(),direct.raw,{checkpointId:'checkpoint.bad-reread.v1'}),{rereadRaw:changedRaw}),/reread exactly/);
const foreignCheckpoint=clone(direct.checkpoint);foreignCheckpoint.saveId='save-foreign-owner';foreignCheckpoint.identity='';foreignCheckpoint.identity=crypto.createHash('sha256').update(canonical([foreignCheckpoint.kind,foreignCheckpoint])).digest('hex');
rejects('checkpoint identity remains bound to predecessor saveId',()=>foundation.migrateSchema13To14(predecessor(),{now:3000,validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,predecessorCheckpoint:foreignCheckpoint,resolvePredecessorCheckpoint:()=>({checkpoint:foreignCheckpoint,raw:direct.raw})}),/checkpoint/);
rejects('unattested checkpoint cannot migrate',()=>foundation.migrateSchema13To14(predecessor({id:'save-unattested'}),{now:3000,validatePredecessor:validateSchema13,predecessorValidatorId:validatorId,predecessorCheckpoint:{},resolvePredecessorCheckpoint:()=>null}),/checkpoint/);

// Exact Rank table, banking, and explicit current/successor authority split.
equal('Rank 15 formula anchor',definitions.rank.table[14].totalExp,2975);
equal('Rank 20 formula anchor',definitions.rank.table[19].totalExp,5225);
equal('Rank 25 formula anchor',definitions.rank.table[24].totalExp,8100);
equal('Rank 30 formula anchor',definitions.rank.table[29].totalExp,11600);
const rank5=foundation.rankProjection(12000,5);
check('Rank 5 banks unreleased EXP',rank5.rank===5&&rank5.atReleasedCap&&rank5.bankedBeyondReleasedCap===11650);
const rankAuthority=clone(definitions),rankRelease=rankAuthority.releaseManifests[0];rankRelease.status='active';rankRelease.active=true;rankRelease.releasedRankThrough=10;
for(const row of rankAuthority.rank.table.slice(5,10)){row.releaseState='active-content-backed';row.contentDependencyIds=[`story.book2.rank-${row.rank}.live`]}
rankRelease.contentDependencyIds=rankAuthority.rank.table.slice(5,10).flatMap(row=>row.contentDependencyIds);sealRelease(rankAuthority,rankRelease);
const rankAuthorityCheck=foundation.validateReleaseAuthority(rankAuthority);
check('content-backed Rank successor authority validates',rankAuthorityCheck.ok,rankAuthorityCheck.errors);
if(!rankAuthorityCheck.ok)throw new Error(`independent rank fixture invalid: ${rankAuthorityCheck.errors.join(',')}`);
const rankScopedAuthority=clone(rankAuthority),rankScopedRelease=rankScopedAuthority.releaseManifests[0];setPackageApprovals(rankScopedAuthority,rankScopedRelease,{requirementActivationApproved:true,collectionGrantActivationApproved:false,rewardThroughputApproved:false,runtimeCurveActivationApproved:false});
check('Rank-only release requires no Collection or runtime-curve approval',foundation.validateReleaseAuthority(rankScopedAuthority).ok,foundation.validateReleaseAuthority(rankScopedAuthority).errors);
const rankUnapprovedAuthority=clone(rankScopedAuthority),rankUnapprovedRelease=rankUnapprovedAuthority.releaseManifests[0];setPackageApprovals(rankUnapprovedAuthority,rankUnapprovedRelease,{requirementActivationApproved:false});
check('Rank release fails without requirement approval',!foundation.validateReleaseAuthority(rankUnapprovedAuthority).ok);
const rankPlan=foundation.planRankReleaseActivation(direct.state,10,{...direct.context,currentAuthority:definitions,successorAuthority:rankAuthority});
check('Rank planner queues exact crossed rows once',rankPlan.oldRank===5&&rankPlan.newRank===10&&rankPlan.queuedTransitions.length===5&&rankPlan.queuedTransitions.every((row,index)=>row.rank===index+6&&JSON.stringify(row.contentDependencyIds)===JSON.stringify([`story.book2.rank-${index+6}.live`])&&row.rewardApplications===0));
check('Rank planner binds exact successor authority',rankPlan.successorManifestHash===foundation.authorityHash(rankAuthority)&&rankPlan.releaseId===rankRelease.id&&rankPlan.rewardApplications===0);
rejects('ambiguous single active authority usage fails closed',()=>foundation.planRankReleaseActivation(direct.state,10,{...direct.context,authority:rankAuthority}),/input|invalid/);
rejects('unsupported Rank boundary rejects',()=>foundation.planRankReleaseActivation(direct.state,9,{...direct.context,currentAuthority:definitions,successorAuthority:rankAuthority}),/content-backed|input/);
const pendingState=clone(direct.state);pendingState.durableProgression.ladders.rank.pendingTransitionIds=['rank.transition.6.v1'];
const pendingPlan=foundation.planRankReleaseActivation(pendingState,10,{...direct.context,currentAuthority:definitions,successorAuthority:rankAuthority});
check('existing pending Rank transition is not queued twice',pendingPlan.queuedTransitions.every(row=>row.rank!==6)&&pendingPlan.queuedTransitions.length===4);
const rankGapAuthority=clone(rankAuthority);rankGapAuthority.rank.table[7].releaseState='reserved';sealRelease(rankGapAuthority,rankGapAuthority.releaseManifests[0]);
check('active Rank release rejects a reserved row gap',!foundation.validateReleaseAuthority(rankGapAuthority).ok);

// Family 600 -> 500 alignment and economic/narrative separation.
function familyState(intimacy,markers=[]){return{family:Object.fromEntries(definitions.family.ids.map(id=>[id,{intimacy:id==='elara'?intimacy:0,claimedIntimacyMilestoneIds:id==='elara'?[...markers]:[]}]))}}
const familyClaimed=foundation.planFamilyAlignment(familyState(1000,['intimacy-150','intimacy-300','intimacy-600']));
const elaraClaimed=familyClaimed.mappings.filter(row=>row.familyId==='elara');
check('old 600 claimed maps to 500 claimed with no reward',elaraClaimed.find(row=>row.threshold===500)?.predecessorId==='intimacy-600'&&elaraClaimed.find(row=>row.threshold===500)?.disposition==='preserve-claimed-no-grant'&&familyClaimed.rewardApplications===0);
const familyReady=foundation.planFamilyAlignment(familyState(550));
check('unclaimed 500 to 599 becomes manual-ready',familyReady.mappings.find(row=>row.familyId==='elara'&&row.threshold===500)?.disposition==='ready-manual-claim-no-grant-yet'&&familyReady.rewardApplications===0);
check('economic 500 and narrative 1000 remain distinct',definitions.family.economicIntimacyCap===500&&definitions.family.shardMilestones.some(row=>row.familyId==='elara'&&row.threshold===500)&&definitions.family.narrativeMilestones.some(row=>row.familyId==='elara'&&row.threshold===1000));
equal('Family shard mapping retains exact 5/10/20/40 grants',definitions.family.shardMilestones.filter(row=>row.familyId==='elara').map(row=>[row.threshold,row.targetedShards]),[[150,5],[300,10],[500,20],[1000,40]]);
check('all Family alignment rows are isolated by actor',familyReady.mappings.length===80&&familyReady.mappings.filter(row=>row.familyId==='elara'&&row.eligible).length===3&&familyReady.mappings.filter(row=>row.familyId!=='elara'&&row.eligible).length===0);
rejects('malformed Family input rejects',()=>foundation.planFamilyAlignment({family:{elara:null}}),/invalid/);

// Collection capture, preview, exactly-once claim, folding, provenance, and +1000%.
const authority=collectionAuthority();
const claimContext={...direct.context,authority};
let state=activate(direct.state,authority);
check('active Collection authority validates',foundation.validateReleaseAuthority(authority).ok,foundation.validateReleaseAuthority(authority).errors);
const collectionScopedAuthority=clone(authority),collectionScopedRelease=collectionScopedAuthority.releaseManifests[0];setPackageApprovals(collectionScopedAuthority,collectionScopedRelease,{requirementActivationApproved:false,collectionGrantActivationApproved:true,rewardThroughputApproved:true,runtimeCurveActivationApproved:false});
check('Collection-only release requires neither requirement nor runtime-curve approval',foundation.validateReleaseAuthority(collectionScopedAuthority).ok,foundation.validateReleaseAuthority(collectionScopedAuthority).errors);
const collectionUnapprovedAuthority=clone(collectionScopedAuthority),collectionUnapprovedRelease=collectionUnapprovedAuthority.releaseManifests[0];setPackageApprovals(collectionUnapprovedAuthority,collectionUnapprovedRelease,{collectionGrantActivationApproved:false});
check('Collection release fails without Collection approval',!foundation.validateReleaseAuthority(collectionUnapprovedAuthority).ok);
const rewardUnapprovedAuthority=clone(collectionScopedAuthority),rewardUnapprovedRelease=rewardUnapprovedAuthority.releaseManifests[0];setPackageApprovals(rewardUnapprovedAuthority,rewardUnapprovedRelease,{rewardThroughputApproved:false});
check('Collection release fails without reward-throughput approval',!foundation.validateReleaseAuthority(rewardUnapprovedAuthority).ok);
const releaseProfiles=authority.releaseManifests[0].requirementFixtureProfileIds.map(id=>authority.requirements.permanentOnlyProfiles.find(row=>row.id===id));
check('release contains zero/median/high-permanent/high-all ownership fixtures',releaseProfiles.length===4&&new Set(releaseProfiles.map(row=>row.kind)).size===4&&['zero-permanent','median-permanent','high-permanent','high-all-content'].every(kind=>releaseProfiles.some(row=>row.kind===kind)));
const zeroProfile=releaseProfiles.find(row=>row.kind==='zero-permanent'),highPermanentProfile=releaseProfiles.find(row=>row.kind==='high-permanent');
check('mandatory authority is high permanent-only, never limited',authority.releaseManifests[0].permanentOnlyRequirementProfileId===highPermanentProfile.id&&highPermanentProfile.limitedContentRequired===false&&authority.releaseManifests[0].limitedContentRequired===false);
check('zero ownership fixture has no Collection advantage',zeroProfile.contributingDefinitionIds.length===0&&JSON.stringify(zeroProfile.collectionBpsByPool)===JSON.stringify({powerBps:0,earningsBps:0,expBps:0,facilityBpsByFacilityId:{}}));
check('all ownership fixtures use identical frozen mandatory tables',releaseProfiles.every(profile=>JSON.stringify([...profile.requirementTableIds].sort())===JSON.stringify(definitions.requirements.tables.map(row=>row.id).sort())));
check('active Collection state validates',foundation.validateSuccessorState(state,claimContext).ok,foundation.validateSuccessorState(state,claimContext).errors);
noThrow('repeated schema14 migration validates against current active authority',()=>foundation.migrateSchema13To14(state,{...claimContext,now:3900}),value=>value.changed===false&&value.receipt.rewardApplications===0);
const delayedState=clone(state),delayedDefinition=authority.collections.grantDefinitions[2],delayedPayload=foundation.captureCollectionGrantPayload(delayedState,delayedDefinition,{capturedAt:3900,...claimContext});delayedState.gold+=123;delayedState.saveMeta.revision++;delayedState.saveMeta.updatedAt++;delayedState.saveMeta.source='ordinary-delayed-claim-mutation';
check('ordinary delayed-claim state remains valid',foundation.validateSuccessorState(delayedState,claimContext).ok,foundation.validateSuccessorState(delayedState,claimContext).errors);
const delayedPreview=foundation.previewCollectionGrant(delayedState,delayedPayload,{previewedAt:3902,...claimContext}),delayedOutcome=foundation.finalizeCollectionGrant(delayedState,delayedPayload,delayedPreview,{claimedAt:3903,...claimContext});
check('delayed claim is not repriced by ordinary mutation',delayedOutcome.ok&&delayedOutcome.receipt.bps===delayedDefinition.bps&&delayedOutcome.receipt.payloadIdentity===delayedPayload.identity,delayedOutcome.reason);
const grantA=authority.collections.grantDefinitions[0],grantB=authority.collections.grantDefinitions[4];
const payloadA=foundation.captureCollectionGrantPayload(state,grantA,{capturedAt:4000,...claimContext});
const payloadB=foundation.captureCollectionGrantPayload(state,grantB,{capturedAt:4000,...claimContext});
check('captured payload is frozen authored provenance',Object.isFrozen(payloadA)&&payloadA.bps===grantA.bps&&payloadA.claimSourceId===grantA.claimSourceId&&payloadA.releaseManifestHash===foundation.releaseManifestHash(authority,grantA.releaseId));
check('captured payload excludes mutable total snapshots',!Object.hasOwn(payloadA,'oldTotalBps')&&!Object.hasOwn(payloadA,'newTotalBps'));
const previewA=foundation.previewCollectionGrant(state,payloadA,{previewedAt:4001,...claimContext});
const previewB=foundation.previewCollectionGrant(state,payloadB,{previewedAt:4001,...claimContext});
let result=foundation.finalizeCollectionGrant(state,payloadB,previewB,{claimedAt:4002,...claimContext});
check('one same-pool ready grant can settle first',result.ok&&result.rewardApplications===1,result.reason);state=result.state;
result=foundation.finalizeCollectionGrant(state,payloadA,previewA,{claimedAt:4003,...claimContext});
check('stale preview refuses with no mutation',!result.ok&&result.reason==='stale-preview'&&result.rawUnchanged&&result.rewardApplications===0);
const refreshedA=foundation.previewCollectionGrant(state,payloadA,{previewedAt:4004,...claimContext});
result=foundation.finalizeCollectionGrant(state,payloadA,refreshedA,{claimedAt:4005,...claimContext});
check('delayed fixed payload settles at refreshed totals',result.ok&&result.receipt.bps===payloadA.bps&&result.rewardApplications===1,result.reason);state=result.state;
const reloaded=clone(state);
result=foundation.finalizeCollectionGrant(reloaded,payloadA,refreshedA,{claimedAt:4006,...claimContext});
check('persisted reload replay refuses exactly once',!result.ok&&result.reason==='already-claimed-or-alternative'&&result.rawUnchanged&&result.rewardApplications===0);

for(let index=1;index<20;index++){
  if(index===4)continue;
  const outcome=claim(state,authority.collections.grantDefinitions[index],4100+index*3,claimContext);
  check(`Collection history claim ${index+1} settles`,outcome.result.ok,outcome.result.reason);
  if(outcome.result.ok)state=outcome.result.state;
}
const collectionRoot=state.durableProgression.collections;
check('bounded archive folds exactly eight of twenty',collectionRoot.checkpoint.throughSequence===8&&collectionRoot.checkpoint.contributionCount===8&&collectionRoot.recentGrantReceipts.length===12&&collectionRoot.claimedDefinitionIds.length===20);
check('folded identity chain continues into recent window',collectionRoot.recentGrantReceipts[0].priorIdentity===collectionRoot.checkpoint.foldedTailReceiptIdentity);
check('folded provenance retains release and classification counts',collectionRoot.checkpoint.provenanceByReleaseId[authority.releaseManifests[0].id]?.contributionCount===8&&collectionRoot.checkpoint.provenanceByReleaseId[authority.releaseManifests[0].id]?.classificationCounts.permanent===8);
check('folded state validates after persistence',foundation.validateSuccessorState(clone(state),claimContext).ok,foundation.validateSuccessorState(clone(state),claimContext).errors);
equal('twenty claims remain additive across named pools',foundation.collectionTotals(state),{powerBps:2500,earningsBps:2500,expBps:2500,facilityBpsByFacilityId:{'facility.restaurant':2500}});
const substituted=clone(state),foldedId=authority.collections.grantDefinitions[0].id,unclaimedId=authority.collections.grantDefinitions[20].id,position=substituted.durableProgression.collections.claimedDefinitionIds.indexOf(foldedId);substituted.durableProgression.collections.claimedDefinitionIds[position]=unclaimedId;substituted.durableProgression.collections.claimedDefinitionIds.sort();
check('folded claimed-definition substitution rejected',!foundation.validateSuccessorState(substituted,claimContext).ok);
rejects('folded grant replay remains permanently blocked',()=>foundation.captureCollectionGrantPayload(state,foldedId,{capturedAt:5000,...claimContext}),/already claimed/);
const huge=claim(state,authority.collections.grantDefinitions[21],5000,claimContext);
check('+1000% grant is accepted without lifetime cap',huge.result.ok&&foundation.collectionTotals(huge.result.state).earningsBps===102500,huge.result.reason);

// A later release preserves R1 history and pending payloads while admitting new R2 claims.
const r1Authority=collectionAuthority(3),r1Release=r1Authority.releaseManifests[0];
let r1State=activate(direct.state,r1Authority);const r1Context={...direct.context,authority:r1Authority};
const r1Pending=foundation.captureCollectionGrantPayload(r1State,r1Authority.collections.grantDefinitions[0],{capturedAt:6000,...r1Context});
const r1History=claim(r1State,r1Authority.collections.grantDefinitions[1],6001,r1Context);check('R1 history claim settles',r1History.result.ok,r1History.result.reason);r1State=r1History.result.state;
const r2Authority=clone(r1Authority),r2Release={id:'release.phase-24c.independent-r2.v1',version:1,sequence:2,status:'active',active:true,contentDependencyIds:['content.phase24c.independent-r2.v1'],collectionGrantDefinitionIds:[],releasedRankThrough:5,permanentOnlyRequirementProfileId:null,requirementFixtureProfileIds:[],simulationPackageId:null,limitedContentRequired:false,activationEvidence:null};
const r2Grant=makeGrant(r2Release.id,1,{pool:'earnings',bps:750,prefix:'independent-r2'});r2Authority.collections.grantDefinitions.push(r2Grant);r2Release.collectionGrantDefinitionIds.push(r2Grant.id);r2Authority.releaseManifests.push(r2Release);sealRelease(r2Authority,r2Release);
check('R2 successor authority validates independently',foundation.validateReleaseAuthority(r2Authority).ok,foundation.validateReleaseAuthority(r2Authority).errors);
const reorderedAuthority=clone(r2Authority);reorderedAuthority.releaseManifests.reverse();
check('release reorder is rejected despite intact sequence fields',!foundation.validateReleaseAuthority(reorderedAuthority).ok);
const duplicateSequenceAuthority=clone(r2Authority);duplicateSequenceAuthority.releaseManifests[1].sequence=duplicateSequenceAuthority.releaseManifests[0].sequence;
check('duplicate release sequence is rejected',!foundation.validateReleaseAuthority(duplicateSequenceAuthority).ok);
let r2State=activate(r1State,r2Authority),r2Context={...direct.context,authority:r2Authority};
check('R1 history validates unchanged under R2',foundation.validateSuccessorState(r2State,r2Context).ok&&r2State.durableProgression.collections.recentGrantReceipts[0].identity===r1History.result.receipt.identity);
const pendingPreview=foundation.previewCollectionGrant(r2State,r1Pending,{previewedAt:6010,...r2Context});
let r2Outcome=foundation.finalizeCollectionGrant(r2State,r1Pending,pendingPreview,{claimedAt:6011,...r2Context});
check('R1 pending payload survives R2 activation',r2Outcome.ok&&r2Outcome.receipt.releaseId===r1Release.id,r2Outcome.reason);r2State=r2Outcome.state;
const pendingReplay=foundation.finalizeCollectionGrant(clone(r2State),r1Pending,pendingPreview,{claimedAt:6012,...r2Context});
check('R1 pending payload replay refuses after reload',!pendingReplay.ok&&pendingReplay.rewardApplications===0&&pendingReplay.rawUnchanged);
r2Outcome=claim(r2State,r2Grant,6020,r2Context).result;
check('new R2 claim settles without erasing R1 history',r2Outcome.ok&&r2Outcome.state.durableProgression.collections.claimedDefinitionIds.includes(r1History.result.receipt.definitionId)&&r2Outcome.state.durableProgression.collections.claimedDefinitionIds.includes(r2Grant.id),r2Outcome.reason);

// Drive every R1 detailed receipt into the checkpoint before proving R2 persistence.
const foldedR1Authority=collectionAuthority(16),foldedR1Release=foldedR1Authority.releaseManifests[0],foldedR1Context={...direct.context,authority:foldedR1Authority};let foldedReleaseState=activate(direct.state,foldedR1Authority);
for(let index=0;index<16;index++){const settled=claim(foldedReleaseState,foldedR1Authority.collections.grantDefinitions[index],8000+index*3,foldedR1Context);check(`R1 pre-fold claim ${index+1} settles`,settled.result.ok,settled.result.reason);if(settled.result.ok)foldedReleaseState=settled.result.state}
check('R1 begins with sixteen detailed receipts',foldedReleaseState.durableProgression.collections.checkpoint.throughSequence===0&&foldedReleaseState.durableProgression.collections.recentGrantReceipts.length===16);
const foldedR2Authority=clone(foldedR1Authority),foldedR2Release={id:'release.phase-24c.folded-r2.v1',version:1,sequence:2,status:'active',active:true,contentDependencyIds:['content.phase24c.folded-r2.v1'],collectionGrantDefinitionIds:[],releasedRankThrough:5,permanentOnlyRequirementProfileId:null,requirementFixtureProfileIds:[],simulationPackageId:null,limitedContentRequired:false,activationEvidence:null};
foldedR2Authority.releaseManifests.push(foldedR2Release);for(let index=1;index<=9;index++){const grant=makeGrant(foldedR2Release.id,index,{prefix:'folded-r2',bps:250});foldedR2Authority.collections.grantDefinitions.push(grant);foldedR2Release.collectionGrantDefinitionIds.push(grant.id)}sealRelease(foldedR2Authority,foldedR2Release);
const foldedR2Context={...direct.context,authority:foldedR2Authority};foldedReleaseState=activate(foldedReleaseState,foldedR2Authority);
check('folded R2 successor validates before new claims',foundation.validateSuccessorState(foldedReleaseState,foldedR2Context).ok,foundation.validateSuccessorState(foldedReleaseState,foldedR2Context).errors);
for(let index=0;index<9;index++){const definition=foldedR2Authority.collections.grantDefinitions.find(row=>row.id===foldedR2Release.collectionGrantDefinitionIds[index]),settled=claim(foldedReleaseState,definition,9000+index*3,foldedR2Context);check(`R2 fold-driving claim ${index+1} settles`,settled.result.ok,settled.result.reason);if(settled.result.ok)foldedReleaseState=settled.result.state}
const foldedArchive=foldedReleaseState.durableProgression.collections;
check('all R1 detailed receipts are folded before R2 tail',foldedArchive.checkpoint.throughSequence===16&&foldedArchive.recentGrantReceipts.length===9&&foldedArchive.recentGrantReceipts.every(receipt=>receipt.releaseId===foldedR2Release.id));
check('fully folded R1 provenance remains exact',foldedArchive.checkpoint.provenanceByReleaseId[foldedR1Release.id]?.contributionCount===16&&foldedArchive.checkpoint.foldedTailReceiptIdentity!==null);
check('fully folded R1 plus R2 validates after reload',foundation.validateSuccessorState(clone(foldedReleaseState),foldedR2Context).ok,foundation.validateSuccessorState(clone(foldedReleaseState),foldedR2Context).errors);
rejects('fully folded R1 claim cannot replay under R2',()=>foundation.captureCollectionGrantPayload(foldedReleaseState,foldedR1Authority.collections.grantDefinitions[0].id,{capturedAt:10000,...foldedR2Context}),/already claimed/);

// Permanent alternative in both claim orders and facility isolation.
function alternativeAuthority(){
  const value=clone(definitions),release=value.releaseManifests[0];release.status='active';release.active=true;release.contentDependencyIds=['content.phase24c.alternative-independent.v1'];
  const permanent=makeGrant(release.id,1,{pool:'facility',facilityId:'facility.apothecary',bps:750,prefix:'permanent-alternative'});
  const limited=makeGrant(release.id,2,{pool:'facility',facilityId:'facility.apothecary',bps:750,prefix:'limited-route',classification:'limited-with-permanent-alternative',alternative:permanent.id});
  const restaurant=makeGrant(release.id,3,{pool:'facility',facilityId:'facility.restaurant',bps:250,prefix:'restaurant-only'});
  value.collections.grantDefinitions.push(permanent,limited,restaurant);release.collectionGrantDefinitionIds.push(permanent.id,limited.id,restaurant.id);sealRelease(value,release);return{value,permanent,limited,restaurant};
}
for(const[name,mutate]of[
  ['mismatched alternative basis points',(fixture)=>{fixture.limited.bps++}],
  ['mismatched alternative pool',(fixture)=>{fixture.limited.targetPool='power';fixture.limited.facilityId=null}],
  ['mismatched alternative facility',(fixture)=>{fixture.limited.facilityId='facility.restaurant'}],
  ['inactive permanent alternative',(fixture)=>{fixture.permanent.releaseState='inactive'}]
]){const fixture=alternativeAuthority();mutate(fixture);sealRelease(fixture.value,fixture.value.releaseManifests[0]);check(`${name} independently rejects`,!foundation.validateReleaseAuthority(fixture.value).ok)}
const invalidAlternativeOrder=alternativeAuthority(),earlyRelease=invalidAlternativeOrder.value.releaseManifests[0],lateRelease={id:'release.phase-24c.late-permanent-alternative.v1',version:1,sequence:2,status:'active',active:true,contentDependencyIds:['content.phase24c.late-permanent-alternative.v1'],collectionGrantDefinitionIds:[invalidAlternativeOrder.permanent.id],releasedRankThrough:5,permanentOnlyRequirementProfileId:null,requirementFixtureProfileIds:[],simulationPackageId:null,limitedContentRequired:false,activationEvidence:null};
earlyRelease.collectionGrantDefinitionIds=earlyRelease.collectionGrantDefinitionIds.filter(id=>id!==invalidAlternativeOrder.permanent.id);invalidAlternativeOrder.permanent.releaseId=lateRelease.id;invalidAlternativeOrder.value.releaseManifests.push(lateRelease);sealRelease(invalidAlternativeOrder.value,earlyRelease);sealRelease(invalidAlternativeOrder.value,lateRelease);
check('limited route cannot point to a permanent alternative from a later release',!foundation.validateReleaseAuthority(invalidAlternativeOrder.value).ok);
for(const first of ['limited','permanent']){
  const fixture=alternativeAuthority(),context={...direct.context,authority:fixture.value};let local=activate(direct.state,fixture.value),firstDefinition=fixture[first],blocked=first==='limited'?fixture.permanent:fixture.limited;
  const fixtureProfiles=fixture.value.releaseManifests[0].requirementFixtureProfileIds.map(id=>fixture.value.requirements.permanentOnlyProfiles.find(row=>row.id===id)),fixtureHighPermanent=fixtureProfiles.find(row=>row.kind==='high-permanent'),fixtureHighAll=fixtureProfiles.find(row=>row.kind==='high-all-content'),highAllPairRoutes=[fixture.permanent.id,fixture.limited.id].filter(id=>fixtureHighAll.contributingDefinitionIds.includes(id));
  check(`${first} fixture high-permanent selects permanent alternative`,fixtureHighPermanent.contributingDefinitionIds.includes(fixture.permanent.id)&&!fixtureHighPermanent.contributingDefinitionIds.includes(fixture.limited.id));
  check(`${first} fixture high-all counts exactly one equivalent route`,highAllPairRoutes.length===1&&fixtureHighAll.collectionBpsByPool.facilityBpsByFacilityId['facility.apothecary']===750);
  const settled=claim(local,firstDefinition,7000,context);check(`${first} alternative route settles once`,settled.result.ok,settled.result.reason);local=settled.result.state;
  rejects(`${first} route permanently blocks its counterpart`,()=>foundation.captureCollectionGrantPayload(local,blocked,{capturedAt:7010,...context}),/alternative/);
  const isolated=claim(local,fixture.restaurant,7020,context);const totals=foundation.collectionTotals(isolated.result.state);
  check(`${first} route keeps facilities isolated`,isolated.result.ok&&totals.facilityBpsByFacilityId['facility.apothecary']===750&&totals.facilityBpsByFacilityId['facility.restaurant']===250);
}

// Additive order probes through +1000%, distinct from forbidden compounding.
const stresses=[0,2500,5000,10000,25000,50000,100000];
const adjacent={power:5000,earnings:3000,exp:2000,facility:4000};
for(const[pool,existing]of Object.entries(adjacent))for(const collection of stresses){
  const output=foundation.evaluateAdditivePool(100000,existing,collection),expected=100000*(10000+existing+collection)/10000,forbidden=100000*(10000+existing)/10000*(10000+collection)/10000;
  check(`${pool} additive ${collection}bps`,output.value===expected&&output.formula==='base × (1 + existing bonus + Collection bonus)');
  if(collection>0)check(`${pool} ${collection}bps differs from compounding`,output.value!==forbidden,`additive=${output.value} compounded=${forbidden}`);
}
check('formula order pins Might, Oath, authored EXP, and local facility adjacency',foundation.formulaOrder.fellowPower.includes('one-plus-might-bps-plus-collection-power-bps')&&foundation.formulaOrder.buildingEarnings.includes('one-plus-oath-bps-plus-collection-earnings-bps')&&foundation.formulaOrder.eligibleExp.includes('one-plus-authored-exp-bps-plus-collection-exp-bps')&&foundation.formulaOrder.facilityActiveReward.includes('one-plus-authored-active-bps-plus-local-collection-bps'));
check('no cap, conversion, currency, Aptitude, or dynamic requirements introduced',definitions.collections.sharedLifetimeCapBps===null&&definitions.collections.overflowConversion===null&&definitions.collections.releaseBudgetsAreLifetimeCaps===false&&!definitionSource.includes('Aptitude')&&!foundationSource.includes('Aptitude')&&!definitionSource.includes('dynamicScaling'));
check('continuing permanent-only Collection authority and +1000% stress are pinned',definitions.collections.futureCollectionsContinueRewards===true&&definitions.collections.releaseBudgetsAreLifetimeCaps===false&&definitions.collections.mandatoryProgressionProfile==='permanent-only'&&definitions.collections.stressThroughBps===100000&&definitions.activation.emptyOriginPolicy==='direct-current-schema-fresh-and-reset');

// Numeric boundary and invalid-input refusal.
equal('zero bonuses preserve MAX_SAFE identity',foundation.evaluateAdditivePool(Number.MAX_SAFE_INTEGER,0,0).value,Number.MAX_SAFE_INTEGER);
equal('explicit floor rounding is deterministic',foundation.evaluateAdditivePool(1,0,5000,{rounding:'floor'}).value,1);
equal('explicit nearest rounding is deterministic',foundation.evaluateAdditivePool(1,0,5000,{rounding:'nearest'}).value,2);
equal('fractional Fellow base rounds once after additive pool',foundation.evaluateAdditiveNumberBase(123.75,5000,100000,{rounding:'nearest'}).value,1423);
equal('fractional zero bonus preserves predecessor nearest result',foundation.evaluateAdditiveNumberBase(123.75,0,0,{rounding:'nearest'}).value,Math.round(123.75));
equal('fractional facility-style floor is deterministic',foundation.evaluateAdditiveNumberBase(10.25,2500,2500,{rounding:'floor'}).value,15);
equal('exact binary fractional output can remain unrounded',foundation.evaluateAdditiveNumberBase(1.25,0,10000,{rounding:'none'}).value,2.5);
rejects('fractional nonrepresentable output requires rounding',()=>foundation.evaluateAdditiveNumberBase(0.1,0,3333,{rounding:'none'}),/representable/);
rejects('fractional high additive result refuses overflow',()=>foundation.evaluateAdditiveNumberBase(Number.MAX_SAFE_INTEGER-0.5,0,100000,{rounding:'nearest'}),/safe integer/);
rejects('unrounded nonrepresentable fraction rejects',()=>foundation.evaluateAdditivePool(1,0,3333),/representable/);
const max=BigInt(Number.MAX_SAFE_INTEGER),factor=115000n,safeBase=Number(max*10000n/factor);
check('safe high +1000% floor stays bounded',foundation.evaluateAdditivePool(safeBase,5000,100000,{rounding:'floor'}).value<=Number.MAX_SAFE_INTEGER);
rejects('next +1000% high value refuses overflow',()=>foundation.evaluateAdditivePool(safeBase+1,5000,100000,{rounding:'floor'}),/safe integer/);
noThrow('null successor validator fails without throw',()=>foundation.validateSuccessorState(null),value=>value.ok===false);
noThrow('throwing successor proxy fails without throw',()=>foundation.validateSuccessorState(new Proxy({},{get(){throw new Error('trap')}})),value=>value.ok===false);
noThrow('null finalizer input refuses without throw',()=>foundation.finalizeCollectionGrant(null,null,null,{claimedAt:1}),value=>value.ok===false&&value.rewardApplications===0&&value.rawUnchanged);
const cyclicState={};cyclicState.self=cyclicState;
noThrow('cyclic hostile finalizer state refuses without throw',()=>foundation.finalizeCollectionGrant(cyclicState,null,null,{claimedAt:1}),value=>value.ok===false&&value.rewardApplications===0);
const throwingState=new Proxy({},{get(){throw new Error('hostile-state')},ownKeys(){throw new Error('hostile-state')}});
noThrow('throwing-proxy finalizer state refuses without throw',()=>foundation.finalizeCollectionGrant(throwingState,null,null,{claimedAt:1}),value=>value.ok===false&&value.rewardApplications===0);
const throwingPayload=new Proxy({},{get(){throw new Error('hostile-payload')},ownKeys(){throw new Error('hostile-payload')}});
noThrow('throwing-proxy finalizer payload refuses without throw',()=>foundation.finalizeCollectionGrant(state,throwingPayload,null,{claimedAt:8000,...claimContext}),value=>value.ok===false&&value.rewardApplications===0&&value.rawUnchanged);
const throwingPreview=new Proxy({},{get(){throw new Error('hostile-preview')},ownKeys(){throw new Error('hostile-preview')}});
noThrow('throwing-proxy finalizer preview refuses without throw',()=>foundation.finalizeCollectionGrant(state,payloadA,throwingPreview,{claimedAt:8000,...claimContext}),value=>value.ok===false&&value.rewardApplications===0&&value.rawUnchanged);
const invalidPayload=clone(payloadA);invalidPayload.bps++;
noThrow('tampered payload finalizer refuses without mutation',()=>foundation.finalizeCollectionGrant(state,invalidPayload,refreshedA,{claimedAt:8000,...claimContext}),value=>value.ok===false&&value.rawUnchanged&&value.rewardApplications===0);
const invalidPreview=clone(refreshedA);invalidPreview.newTotalBps=Number.MAX_SAFE_INTEGER;
noThrow('tampered preview finalizer refuses without mutation',()=>foundation.finalizeCollectionGrant(state,payloadA,invalidPreview,{claimedAt:8000,...claimContext}),value=>value.ok===false&&value.rawUnchanged&&value.rewardApplications===0);
check('continuing Legacy carries excess progress',foundation.nextLegacyTier(20,2).threshold===15&&foundation.nextLegacyTier(20,2).status==='ready'&&foundation.nextLegacyTier(20,2).carriedProgress===5);
rejects('nonmonotonic Legacy table rejects',()=>foundation.nextLegacyTier(20,0,[5,5]),/invalid/);

const report={
  contractId:contract.contractId,
  verdict:failed?'FAIL':'PASS',
  passed,failed,
  sourceSha256:Object.fromEntries(Object.keys(contract.sourceSha256).map(relative=>[relative,fileHash(relative)])),
  productionSha256:Object.fromEntries(Object.keys(contract.productionSha256).map(relative=>[relative,fileHash(relative)])),
  definitionsManifestSha256:foundation.manifestHash,
  failures
};
console.log(JSON.stringify(report,null,2));
if(failed)process.exitCode=1;
