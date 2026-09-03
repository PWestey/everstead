import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const fileHash=relative=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,relative))).digest('hex');
const hash=value=>crypto.createHash('sha256').update(String(value)).digest('hex');
const contract=JSON.parse(read('qa/phase-24c2d-release-authority/contract.json'));
const clone=value=>JSON.parse(JSON.stringify(value));
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);

function canonical(value,seen=new Set()){
  if(value===null)return'null';
  if(typeof value==='string'||typeof value==='boolean')return JSON.stringify(value);
  if(typeof value==='number'){
    if(!Number.isFinite(value))throw new TypeError('non-finite');
    return Object.is(value,-0)?'0':JSON.stringify(value);
  }
  if(Array.isArray(value)){
    if(seen.has(value))throw new TypeError('cycle');
    seen.add(value);const result='['+value.map(item=>canonical(item,seen)).join(',')+']';seen.delete(value);return result;
  }
  if(!value||typeof value!=='object'||seen.has(value))throw new TypeError('non-plain-or-cycle');
  seen.add(value);const result='{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonical(value[key],seen)).join(',')+'}';seen.delete(value);return result;
}
const releaseIdentity=(kind,value)=>hash(canonical([`phase24c.release-${kind}.v1`,value]));

let passed=0,failed=0;const failures=[];
function check(name,condition,detail=''){
  if(condition){passed++;return}
  failed++;failures.push({name,detail:typeof detail==='string'?detail:JSON.stringify(detail)});
}
function equal(name,actual,expected){check(name,same(actual,expected),{actual,expected})}
function rejects(name,operation,pattern=/.*/){try{operation();check(name,false,'did not throw')}catch(error){check(name,pattern.test(String(error?.message||error)),String(error?.message||error))}}

const realm={console};realm.globalThis=realm;
const context=vm.createContext(realm);
for(const relative of ['src/phase24c-durable-definitions.js','src/phase24c-durable-foundation.js'])vm.runInContext(read(relative),context,{filename:relative});
const definitionsBefore=canonical(context.EVERSTEAD_PHASE24C_DEFINITIONS);
vm.runInContext(read(contract.candidateSource),context,{filename:contract.candidateSource});
const candidate=context[contract.candidateGlobal],foundation=context.EVERSTEAD_PHASE24C_FOUNDATION,definitions=context.EVERSTEAD_PHASE24C_DEFINITIONS;
const realmObjectPrototype=vm.runInContext('Object.prototype',context),realmArrayPrototype=vm.runInContext('Array.prototype',context);

for(const[relative,expected]of Object.entries(contract.acceptedHistoricalSourcePins))check(`accepted historical source pin ${relative}`,fileHash(relative)===expected,fileHash(relative));
const candidateSourceSha256=fileHash(contract.candidateSource),candidateSemanticSha256=hash(canonical(candidate)),productionIndexSha256=fileHash(contract.productionIndex);
check('UNFROZEN identity: candidate source SHA-256',candidateSourceSha256===contract.expectedCandidateSourceSha256,{expected:contract.expectedCandidateSourceSha256,actual:candidateSourceSha256});
check('UNFROZEN identity: candidate semantic SHA-256',candidateSemanticSha256===contract.expectedCandidateSemanticSha256,{expected:contract.expectedCandidateSemanticSha256,actual:candidateSemanticSha256});
check('candidate did not mutate frozen definitions',canonical(definitions)===definitionsBefore);
check('candidate authority self-hash is internally exact',candidate.authorityHash===hash(canonical(candidate.authority)),candidate.authorityHash);
check('UNFROZEN identity: successor authority SHA-256',candidate.authorityHash===contract.expectedAuthoritySha256,{expected:contract.expectedAuthoritySha256,actual:candidate.authorityHash});
check('foundation independently validates successor authority',foundation.validateReleaseAuthority(candidate.authority).ok,foundation.validateReleaseAuthority(candidate.authority).errors);

const descriptor=Object.getOwnPropertyDescriptor(context,contract.candidateGlobal);
check('candidate global is non-enumerable non-writable non-configurable',descriptor&&descriptor.enumerable===false&&descriptor.writable===false&&descriptor.configurable===false);
function hardeningErrors(value,pathName='$',seen=new Set()){
  const errors=[];
  if(value===null||['string','boolean','number'].includes(typeof value))return errors;
  if(typeof value==='function'){errors.push(`${pathName}:function`);return errors}
  if(!value||typeof value!=='object'||seen.has(value)){errors.push(`${pathName}:object-or-cycle`);return errors}
  seen.add(value);
  const expectedPrototype=Array.isArray(value)?realmArrayPrototype:realmObjectPrototype;
  if(Object.getPrototypeOf(value)!==expectedPrototype)errors.push(`${pathName}:prototype`);
  if(!Object.isFrozen(value))errors.push(`${pathName}:not-frozen`);
  if(Reflect.ownKeys(value).some(key=>typeof key==='symbol'))errors.push(`${pathName}:symbol`);
  for(const key of Object.keys(value)){
    const child=Object.getOwnPropertyDescriptor(value,key);
    if(!child||child.get||child.set||child.enumerable!==true)errors.push(`${pathName}.${key}:descriptor`);
    errors.push(...hardeningErrors(value[key],`${pathName}.${key}`,seen));
  }
  seen.delete(value);return errors;
}
const hardening=hardeningErrors(candidate);
check('candidate is deeply frozen acyclic plain data without functions/accessors/symbols',hardening.length===0,hardening);
equal('candidate top-level topology',Object.keys(candidate),['version','authorityId','manifestId','status','productionLoaded','schemaVersion','purpose','supersedesAuthorityId','acceptedSourceAuthority','releaseContract','evidenceReports','evidenceReportHashes','authorityHash','releaseManifestHash','authority']);
check('candidate is the active production schema-14 successor',candidate.status==='active-production-successor-release-authority'&&candidate.productionLoaded===true&&candidate.schemaVersion===14&&candidate.releaseContract.runtimeIntegrationAuthorized===true);
check('candidate explicitly supersedes zero-only authority',candidate.supersedesAuthorityId==='phase-24c2c-zero-activation-authority.v1');

const index=read(contract.productionIndex),source=read(contract.candidateSource);
check('UNFROZEN identity: production index SHA-256',productionIndexSha256===contract.expectedProductionIndexSha256,{expected:contract.expectedProductionIndexSha256,actual:productionIndexSha256});
check('successor authority is loaded exactly once before production runtime',index.split('src/phase24c2d-founding-table-release-authority.js?v=phase24c2d-v1').length-1===1&&index.indexOf('src/phase24c2d-founding-table-release-authority.js?v=phase24c2d-v1')<index.indexOf("(()=>{'use strict'"));
check('production runtime authenticates the successor global',index.includes('globalThis.EVERSTEAD_PHASE24C2D_FOUNDING_TABLE_AUTHORITY')&&index.includes("authorityId!=='phase-24c2d-founding-table-release-authority.v1'"));
check('candidate source has no storage, DOM, network, eval, timer, or dynamic-code operation',!/(localStorage|sessionStorage|document\.|fetch\s*\(|XMLHttpRequest|WebSocket|eval\s*\(|new\s+Function|setTimeout|setInterval)/.test(source));

const restaurantSource=read('src/phase16-restaurant.js');
const actualRecipeIds=[...restaurantSource.matchAll(/\{id:'(restaurant\.recipe\.[a-z0-9-]+)'/g)].map(match=>match[1]);
equal('exact three current Restaurant recipe IDs are pinned',actualRecipeIds,contract.recipeIds);
equal('release content dependency union is exact',candidate.releaseContract.contentDependencyIds,contract.contentDependencyIds);
check('all release recipe dependencies exist in current Restaurant catalog',contract.recipeIds.every(id=>actualRecipeIds.includes(id)));

const authority=candidate.authority;
equal('foundation reserved release remains byte-identical',authority.releaseManifests[0],definitions.releaseManifests[0]);
check('authority contains exactly reserved predecessor plus Founding Table release',authority.releaseManifests.length===2&&authority.releaseManifests[1].id===contract.release.id);
const release=authority.releaseManifests[1];
check('release identity and activation state exact',release.id===contract.release.id&&release.version===1&&release.sequence===2&&release.status==='active'&&release.active===true);
check('release keeps Rank 5 and excludes limited content',release.releasedRankThrough===5&&release.limitedContentRequired===false);
equal('release owns exactly one grant',release.collectionGrantDefinitionIds,[contract.grant.id]);
equal('release dependencies exact',release.contentDependencyIds,contract.contentDependencyIds);
check('release dependency set owns both active gradual tutorials',contract.tutorials.every(row=>release.contentDependencyIds.includes(row.id)));

check('authority has exactly one grant definition',authority.collections.grantDefinitions.length===1);
const grant=authority.collections.grantDefinitions[0];
equal('grant contract exact',grant,{id:contract.grant.id,releaseId:contract.release.id,definitionVersion:1,rewardVersion:1,classification:'permanent',permanentAlternativeId:null,claimSourceId:contract.grant.claimSourceId,targetPool:'facility',facilityId:'facility.restaurant',bps:200,releaseState:'active'});
check('grant is accepted by existing foundation definition validator',foundation.validateCollectionDefinition(grant,authority,{requireActive:true}));
check('no global Collection grant is present',authority.collections.grantDefinitions.every(row=>row.targetPool==='facility'));
check('no limited grant or permanent alternative is present',authority.collections.grantDefinitions.every(row=>row.classification==='permanent'&&row.permanentAlternativeId===null));
check('uncapped additive Collection policy is unchanged',canonical(authority.collections.pools)===canonical(definitions.collections.pools)&&authority.collections.sharedLifetimeCapBps===null&&authority.collections.overflowConversion===null&&authority.collections.releaseBudgetsAreLifetimeCaps===false&&authority.collections.futureCollectionsContinueRewards===true);

check('Rank authority is byte-identical and still released through 5',canonical(authority.rank)===canonical(definitions.rank)&&authority.rank.releasedThrough===5);
check('all four inherited requirement tables remain byte-identical',canonical(authority.requirements.tables)===canonical(definitions.requirements.tables));
check('no Family, Legacy, event, facility-ladder, or cast authority changed',canonical(authority.family)===canonical(definitions.family)&&canonical(authority.legacy)===canonical(definitions.legacy)&&canonical(authority.events)===canonical(definitions.events)&&canonical(authority.facilities)===canonical(definitions.facilities)&&canonical(authority.cast)===canonical(definitions.cast));
const expectedTutorialAuthority=clone(definitions.tutorials);for(const row of expectedTutorialAuthority)if(contract.tutorials.some(item=>item.id===row.id))row.releaseState='active';
equal('only the two declared tutorial release states changed',authority.tutorials,expectedTutorialAuthority);
const activeTutorialRows=contract.tutorials.map(expected=>authority.tutorials.find(row=>row.id===expected.id));
check('two gradual tutorial authority rows are exact and active',activeTutorialRows.every((row,index)=>{const expected=contract.tutorials[index];return row?.id===expected.id&&row.featureId===expected.featureId&&row.trigger===expected.trigger&&row.primaryActorId===expected.primaryActorId&&row.fallbackActorId===expected.fallbackActorId&&row.releaseState==='active'&&row.optional===true&&row.skippable===true&&row.replayable===true&&row.rewardNeutral===true&&row.maxAutoPresentPerSafeVisit===1}));
equal('production activation flags authorize this release and UI',authority.activation,{...clone(definitions.activation),productionLoaded:true,activeReleaseIds:[contract.release.id],createClaimReadiness:true,newUiActive:true});
check('no provisional curve or requirement activation is approved',authority.simulationPackages.at(-1).runtimeCurveActivationApproved===false&&authority.simulationPackages.at(-1).requirementActivationApproved===false);

const profiles=release.requirementFixtureProfileIds.map(id=>authority.requirements.permanentOnlyProfiles.find(row=>row.id===id));
equal('exact four ownership fixture kinds',profiles.map(row=>row.kind),contract.fixtureKinds);
check('fixture IDs are unique and all referenced once',profiles.every(Boolean)&&new Set(profiles.map(row=>row.id)).size===4&&authority.requirements.permanentOnlyProfiles.length===4);
check('all fixtures are accepted private candidates and limited-content-free',profiles.every(row=>row.status==='accepted-private-candidate'&&row.limitedContentRequired===false));
check('all fixtures use the same four frozen requirement tables',profiles.every(row=>same(row.requirementTableIds,[...definitions.requirements.tables.map(table=>table.id).sort()])));
equal('zero fixture has exact zero totals',profiles[0].collectionBpsByPool,contract.expectedTotals.zero);
for(const profile of profiles.slice(1))equal(`${profile.kind} fixture has exact one-grant totals`,profile.collectionBpsByPool,contract.expectedTotals.nonzero);
check('zero fixture has no contributor',profiles[0].contributingDefinitionIds.length===0);
check('median/high/high-all each contain only Founding Table grant',profiles.slice(1).every(row=>same(row.contributingDefinitionIds,[contract.grant.id])));
check('high permanent profile is release requirement authority',release.permanentOnlyRequirementProfileId===profiles[2].id);
for(const profile of profiles){const projection={...clone(profile),fixtureReportIdentity:''};check(`fixture identity recomputes independently ${profile.kind}`,profile.fixtureReportIdentity===releaseIdentity('fixture-report',projection),profile.fixtureReportIdentity)}

check('approved simulation package is appended after immutable provisional baseline',authority.simulationPackages.length===2&&canonical(authority.simulationPackages[0])===canonical(definitions.simulationPackages[0]));
const simulation=authority.simulationPackages[1];
check('focused simulation package has exact approval boundary',simulation.id==='simulation.phase-24c2d.founding-table.approved.v1'&&simulation.status==='approved-private-candidate'&&simulation.requirementActivationApproved===false&&simulation.collectionGrantActivationApproved===true&&simulation.runtimeCurveActivationApproved===false&&simulation.rewardThroughputApproved===true);
equal('simulation artifact hashes equal frozen report hashes',simulation.artifactHashes,contract.expectedEvidenceReportHashes);
for(const[key,report]of Object.entries(candidate.evidenceReports))check(`evidence report hash recomputes independently ${key}`,hash(canonical(report))===candidate.evidenceReportHashes[`${key}Sha256`],candidate.evidenceReportHashes[`${key}Sha256`]);
equal('all report hashes match contract',candidate.evidenceReportHashes,contract.expectedEvidenceReportHashes);
check('budget report exposes only 200 Restaurant facility bps',same(candidate.evidenceReports.releaseBudget.obtainablePermanentTotals,contract.expectedTotals.nonzero)&&same(candidate.evidenceReports.releaseBudget.obtainableLimitedTotals,contract.expectedTotals.zero)&&candidate.evidenceReports.releaseBudget.globalPoolGrants===0);
check('long-horizon report covers 30/90/365 and 0..1000 percent stress',same(candidate.evidenceReports.longHorizon.horizonsDays,[30,90,365])&&same(candidate.evidenceReports.longHorizon.cumulativeStressBps,[0,200,2500,5000,10000,25000,50000,100000]));
check('safe-integer report keeps exact integer-bps noncompounding policy',candidate.evidenceReports.safeInteger.authoredBps===200&&candidate.evidenceReports.safeInteger.cumulativeStressThroughBps===100000&&candidate.evidenceReports.safeInteger.integerBasisPointsOnly===true&&candidate.evidenceReports.safeInteger.alreadyBoostedTotalMultiplicationAllowed===false);
check('authority evidence names a base-active, noncompounding facility application',candidate.evidenceReports.longHorizon.application==='base-active-facility-reward-plus-authored-active-bps-plus-local-collection-facility-bps'&&candidate.evidenceReports.longHorizon.passiveBuildingGoldAffected===false);

const evidence=release.activationEvidence;
const sortedTables=clone(authority.requirements.tables).sort((a,b)=>a.id.localeCompare(b.id));
const sortedProfiles=clone(profiles).sort((a,b)=>a.id.localeCompare(b.id));
const expectedEvidence={
  predecessorScalingIdentity:releaseIdentity('predecessor-scaling',authority.predecessorScaling),
  simulationPackageIdentity:releaseIdentity('simulation-package',simulation),
  contentDependencySetIdentity:releaseIdentity('content-dependencies',[...contract.contentDependencyIds].sort()),
  rankDefinitionSetIdentity:releaseIdentity('rank-definitions',[]),
  collectionGrantDefinitionSetIdentity:releaseIdentity('collection-grants',[clone(grant)]),
  requirementTableSetIdentity:releaseIdentity('requirement-tables',sortedTables),
  fixtureProfileSetIdentity:releaseIdentity('fixture-profiles',sortedProfiles),
  permanentOnlyProfileIdentity:releaseIdentity('permanent-only-profile',clone(profiles[2])),
  obtainablePermanentTotals:clone(contract.expectedTotals.nonzero),
  obtainableLimitedTotals:clone(contract.expectedTotals.zero),
  obtainableHighAllTotals:clone(contract.expectedTotals.nonzero),
  releaseBudgetReportSha256:contract.expectedEvidenceReportHashes.releaseBudgetSha256,
  longHorizonReportSha256:contract.expectedEvidenceReportHashes.longHorizonSha256,
  safeIntegerReportSha256:contract.expectedEvidenceReportHashes.safeIntegerSha256
};
equal('activation evidence recomputes independently',evidence,expectedEvidence);

const releasePackage={configId:authority.configId,release:clone(release),simulationPackage:clone(simulation),grantDefinitions:[clone(grant)],rankDefinitions:[],fixtureProfiles:sortedProfiles,requirementTables:sortedTables},recomputedReleaseManifestSha256=releaseIdentity('manifest',releasePackage);
check('release manifest self-hash independently recomputes',recomputedReleaseManifestSha256===candidate.releaseManifestHash,{expected:candidate.releaseManifestHash,actual:recomputedReleaseManifestSha256});
check('UNFROZEN identity: release-manifest SHA-256',candidate.releaseManifestHash===contract.expectedReleaseManifestSha256,{expected:contract.expectedReleaseManifestSha256,actual:candidate.releaseManifestHash});

function activateFixture(){
  const origin={schemaVersion:13,saveMeta:{saveId:'save-phase24c2d-authority-qa',revision:1,createdAt:1000,updatedAt:1000,source:'fresh',appliedMigrations:[]},gold:0,player:{rankExp:0}};
  const validatePredecessor=value=>value?.schemaVersion===13&&value.saveMeta?.saveId===origin.saveMeta.saveId;
  const validateDirectOrigin=(value,lineage)=>validatePredecessor(value)&&lineage==='direct-schema-14'&&value.saveMeta.revision===1&&value.saveMeta.source==='fresh';
  const origins=new Map(),baseContext={validatePredecessor,predecessorValidatorId:'validator.schema-13.phase-24c2d-qa.v1',validateDirectOrigin,directOriginValidatorId:'validator.direct.phase-24c2d-qa.v1',resolveDirectOrigin:id=>origins.get(id)||null};
  const created=foundation.createDirectSchema14(origin,{...baseContext,lineageKind:'direct-schema-14'});origins.set(created.attestation.identity,clone(origin));
  const state=clone(created.state);state.durableProgression.manifestHash=candidate.authorityHash;state.durableProgression.activeReleaseIds=[contract.release.id];
  return{state,context:{...baseContext,authority}};
}
const active=activateFixture();
check('detached active-release schema-14 fixture validates',foundation.validateSuccessorState(active.state,active.context).ok,foundation.validateSuccessorState(active.state,active.context).errors);
const payload=foundation.captureCollectionGrantPayload(active.state,grant,{...active.context,capturedAt:1001});
const preview=foundation.previewCollectionGrant(active.state,payload,{...active.context,previewedAt:1002});
equal('claim preview exposes exact old/gain/new facility bps',{targetPool:preview.targetPool,facilityId:preview.facilityId,oldTotalBps:preview.oldTotalBps,gainBps:preview.gainBps,newTotalBps:preview.newTotalBps},{targetPool:'facility',facilityId:'facility.restaurant',oldTotalBps:0,gainBps:200,newTotalBps:200});
const claimed=foundation.finalizeCollectionGrant(active.state,payload,preview,{...active.context,claimedAt:1003});
check('foundation finalizes Founding Table exactly once',claimed.ok&&claimed.rewardApplications===1,claimed.reason);
equal('claim changes only Restaurant facility total',foundation.collectionTotals(claimed.state),contract.expectedTotals.nonzero);
check('claim receipt binds exact release, grant, source and 200 bps',claimed.receipt.releaseId===contract.release.id&&claimed.receipt.definitionId===contract.grant.id&&claimed.receipt.claimSourceId===contract.grant.claimSourceId&&claimed.receipt.targetPool==='facility'&&claimed.receipt.facilityId==='facility.restaurant'&&claimed.receipt.bps===200&&claimed.receipt.oldTotalBps===0&&claimed.receipt.newTotalBps===200);
const duplicate=foundation.finalizeCollectionGrant(claimed.state,payload,preview,{...active.context,claimedAt:1004});
check('duplicate claim refuses with zero reward and raw-unchanged result',duplicate.ok===false&&duplicate.reason==='already-claimed-or-alternative'&&duplicate.rewardApplications===0&&duplicate.rawUnchanged===true,duplicate);
check('claimed successor remains valid',foundation.validateSuccessorState(claimed.state,active.context).ok,foundation.validateSuccessorState(claimed.state,active.context).errors);
for(const row of contract.baseSaleOnlyFormulaCases){const authoredTotal=row.baseSaleGold+row.tipGold,boostedBase=foundation.evaluateAdditivePool(row.baseSaleGold,0,row.collectionBps,{rounding:'floor'}).value,collectionGold=boostedBase-row.baseSaleGold;equal(`base-sale-only floor formula ${row.baseSaleGold}+tip-${row.tipGold}`,{collectionGold,finalGold:authoredTotal+collectionGold},{collectionGold:row.collectionGold,finalGold:row.finalGold})}
check('production formula applies Collection bps to base sale only and preserves authored tip',index.includes('function phase24c2dRestaurantClaimGold(state,baseSaleGold,authoredTotalGold=baseSaleGold)')&&index.includes("evaluateAdditivePool(baseSaleGold,0,bps,{rounding:'floor'})")&&index.includes("safeAddInteger(authoredTotalGold,collectionGold,'Restaurant Collection Gold')")&&index.includes('phase24c2dRestaurantClaimGold(state,planned.baseSaleGold,planned.totalGold)'));
check('200 bps is not applied to passive or global pools',foundation.collectionTotals(claimed.state).powerBps===0&&foundation.collectionTotals(claimed.state).earningsBps===0&&foundation.collectionTotals(claimed.state).expBps===0);

for(const[name,mutate]of [
  ['zero bps',value=>{value.collections.grantDefinitions[0].bps=0}],
  ['fractional bps',value=>{value.collections.grantDefinitions[0].bps=200.5}],
  ['unknown facility',value=>{value.collections.grantDefinitions[0].facilityId='facility.unknown'}],
  ['active grant owned by inactive release',value=>{value.releaseManifests[1].status='private-candidate';value.releaseManifests[1].active=false}],
  ['limited release declaration',value=>{value.releaseManifests[1].limitedContentRequired=true}],
  ['missing collection approval',value=>{value.simulationPackages[1].collectionGrantActivationApproved=false}],
  ['missing throughput approval',value=>{value.simulationPackages[1].rewardThroughputApproved=false}],
  ['fixture report tamper',value=>{value.requirements.permanentOnlyProfiles[0].fixtureReportIdentity='0'.repeat(64)}],
  ['activation evidence tamper',value=>{value.releaseManifests[1].activationEvidence.obtainablePermanentTotals.facilityBpsByFacilityId['facility.restaurant']=201}],
  ['duplicate claim source',value=>{value.collections.grantDefinitions.push({...clone(value.collections.grantDefinitions[0]),id:'collection.grant.restaurant.duplicate.v1'})}],
  ['global pool substitution',value=>{value.collections.grantDefinitions[0].targetPool='power';value.collections.grantDefinitions[0].facilityId=null}],
  ['Rank release substitution',value=>{value.releaseManifests[1].releasedRankThrough=6}]
]){
  const attacked=clone(authority);mutate(attacked);check(`foundation fails closed: ${name}`,foundation.validateReleaseAuthority(attacked).ok===false,foundation.validateReleaseAuthority(attacked).errors);
}

const unfrozenIdentityFailures=failures.filter(row=>row.name.startsWith('UNFROZEN identity:')),unexpectedFailures=failures.filter(row=>!row.name.startsWith('UNFROZEN identity:'));
const report={contractId:contract.contractId,passed,failed,candidateSourceSha256,candidateSemanticSha256,authoritySha256:candidate.authorityHash,releaseManifestSha256:candidate.releaseManifestHash,productionIndexSha256,productionLoaded:candidate.productionLoaded,releaseId:contract.release.id,grantId:contract.grant.id,facilityBps:contract.grant.bps,unfrozenIdentityFailures:unfrozenIdentityFailures.length,expectedUnfrozenIdentityFailures:contract.expectedUnfrozenIdentityFailures,onlyExpectedUnfrozenIdentityFailures:unexpectedFailures.length===0&&unfrozenIdentityFailures.length===contract.expectedUnfrozenIdentityFailures,failures};
console.log(JSON.stringify(report,null,2));
if(failed)process.exitCode=1;
