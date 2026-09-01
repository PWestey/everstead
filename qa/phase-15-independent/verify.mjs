import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname);
const QA=resolve(ROOT,'qa/phase-15-independent');
const NODE=process.execPath;
const BASE='7e74226d64f819bf7be40f969078ed16c3fce356';
const PACKAGE_ONLY=process.argv.includes('--package-only');
const EXPECTED=['README.md','checksums.sha256','fixtures/contract-fixtures.json','fixtures/inherited-hashes.json','index.html','realm.html','realm.js','runner.js','verify.mjs'];
const rows=[];
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const read=path=>readFileSync(resolve(ROOT,path));
const text=path=>read(path).toString('utf8');
const json=path=>JSON.parse(text(path));
const sha=value=>createHash('sha256').update(value).digest('hex');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const unique=values=>new Set(values).size===values.length;
const sorted=values=>[...new Set(values)].sort();
const git=args=>execFileSync('/usr/bin/git',args,{cwd:ROOT,encoding:'utf8',maxBuffer:128*1024*1024});
const gitBytes=args=>execFileSync('/usr/bin/git',args,{cwd:ROOT,maxBuffer:256*1024*1024});
const baseRead=path=>gitBytes(['show',`${BASE}:${path}`]);
const fixtures=json('qa/phase-15-independent/fixtures/contract-fixtures.json');
const inherited=json('qa/phase-15-independent/fixtures/inherited-hashes.json');
const p13=json('qa/phase-13-independent/fixtures/contract-fixtures.json');
const facilityDesign=json('design/phase-14/facility-definitions.json');
const facilityFixtures=json('design/phase-14/fixtures.json');
const tutorials=json('design/phase-15-16/tutorial-extension.json');
const castHooks=json('design/phase-15-16/cast-hooks.json');
const legacy=json('design/phase-15-16/legacy-definitions.json');
const restaurant=json('design/phase-15-16/restaurant-definitions.json');
const unlocks=json('design/phase-17/facility-unlocks.json');

function filesBelow(directory,prefix=''){
  const paths=[];
  for(const name of readdirSync(directory)){
    const absolute=resolve(directory,name),path=prefix?`${prefix}/${name}`:name;
    if(statSync(absolute).isDirectory())paths.push(...filesBelow(absolute,path));else paths.push(path);
  }
  return paths.sort();
}

function productionSources(){
  const files=[];
  function visit(directory,prefix=''){
    for(const entry of readdirSync(directory,{withFileTypes:true})){
      if(!prefix&&['.git','assets','design','docs','qa'].includes(entry.name))continue;
      const path=prefix?`${prefix}/${entry.name}`:entry.name,absolute=resolve(directory,entry.name);
      if(entry.isDirectory())visit(absolute,path);else if(/\.(?:html|m?js|json)$/.test(path))files.push(path);
    }
  }
  visit(ROOT);return files.sort();
}

function normalizedFacilityDesign(){
  return facilityDesign.facilities.map(item=>({
    id:item.id,
    activityId:item.activityId,
    designAnchor:item.mapAnchor,
    localProgressTrackId:item.localProgressTrackIds[0],
    opportunityDefinitionId:item.opportunityDefinitionIds[0],
    generationMode:item.operational.generationMode
  })).sort((a,b)=>a.id.localeCompare(b.id));
}

function normalizedFixtureDesign(){
  return fixtures.facilities.map(({id,activityId,designAnchor,localProgressTrackId,opportunityDefinitionId,generationMode})=>({id,activityId,designAnchor,localProgressTrackId,opportunityDefinitionId,generationMode})).sort((a,b)=>a.id.localeCompare(b.id));
}

function normalizedUnlocks(){
  return unlocks.facilityUnlocks.map(item=>({
    facilityId:item.facilityId,
    mapAnchor:item.mapAnchor,
    targetPhase:item.targetPhase,
    passivePolicy:item.passivePolicy,
    discoveryContentId:item.discovery.contentId,
    requiredCapabilityId:item.activeInteraction.requiredCapabilityId,
    openingContentId:item.activeInteraction.openingContentId
  }));
}

function normalizedFixtureUnlocks(){
  return fixtures.facilities.map(item=>({
    facilityId:item.id,
    mapAnchor:item.mapAnchor,
    targetPhase:item.targetPhase,
    passivePolicy:item.passivePolicy,
    discoveryContentId:item.discoveryContentId,
    requiredCapabilityId:item.requiredCapabilityId,
    openingContentId:item.openingContentId
  }));
}

record('base-commit-reachable',git(['merge-base','--is-ancestor',BASE,'HEAD'])==='');
record('package-topology',same(filesBelow(QA),EXPECTED),filesBelow(QA));
const checksumRows=existsSync(resolve(ROOT,'qa/phase-15-independent/checksums.sha256'))?text('qa/phase-15-independent/checksums.sha256').trim().split('\n').filter(Boolean).map(line=>{const match=line.match(/^([0-9a-f]{64})  (.+)$/);return match?{expected:match[1],path:match[2]}:null}):[];
const checksumFailures=checksumRows.filter(item=>!item||!existsSync(resolve(ROOT,item.path))||sha(read(item.path))!==item.expected).map(item=>item?.path||'malformed');
record('package-checksums',checksumRows.length===10&&checksumFailures.length===0,{count:checksumRows.length,failures:checksumFailures});
record('contract-and-result-documents',['docs/PHASE_15_INDEPENDENT_QA_CONTRACT.md','docs/PHASE_15_INDEPENDENT_QA_RESULT.md'].every(path=>existsSync(resolve(ROOT,path))));
const contract=text('docs/PHASE_15_INDEPENDENT_QA_CONTRACT.md');
record('contract-scope-correct',contract.includes('physical game board')&&contract.includes('Restaurant gameplay remains Phase 16')&&contract.includes('does not approve facility cadence')&&!contract.includes('requires Phase 16 Restaurant runtime'));
record('contract-covers-required-risks',[
  'twelve unique physical anchors','hidden','discovered','available','ready','non-expiring','manual Claim','immutable production finalizer',
  'stable ordinals','V2 bounded claim archive','migration','import','recovery','offline','two-client','corrupt','authored-event',
  'passive Buildings','Family assignments','38','locked-Fellow','320×568','390×844','1024×768','175 percent','keyboard','focus','reduced motion'
].every(value=>contract.toLowerCase().includes(value.toLowerCase())));
record('contract-actual-dom-and-blind-spots',contract.includes('Actual-DOM browser gate')&&contract.includes('queried nodes')&&contract.includes('Blind spots and required root review')&&contract.includes('normalized QA output alone cannot prove'));

record('fixture-provenance',fixtures.contractVersion===1&&fixtures.bridgeVersion==='phase-15-independent-qa-v1'&&fixtures.baseCommit===BASE&&same(fixtures.designCommits,{facilityFramework:'102232b1784c08805d5078c7c9915a15fefe3b53',phase15And16:'836cc2a6419c65c56f7241a0322394daabdbddc3',bookOneUnlocks:'696d8247a34a11ba442e3b95470e2e84f6fe100e'}));
record('fixture-twelve-facilities',fixtures.facilities.length===12&&unique(fixtures.facilities.map(item=>item.id))&&unique(fixtures.facilities.map(item=>item.activityId))&&unique(fixtures.facilities.map(item=>item.opportunityDefinitionId))&&unique(fixtures.facilities.map(item=>item.localProgressTrackId)));
record('fixture-twelve-unique-map-anchors',unique(fixtures.facilities.map(item=>item.mapAnchor)),fixtures.facilities.map(item=>item.mapAnchor));
record('fixture-four-runtime-states',same(fixtures.runtimeStates,['hidden','discovered','available','ready'])&&same(fixtures.designStateAliases,{'hidden':'hidden','discovered-locked':'discovered','available':'available','claim-ready':'ready'}));
record('fixture-save-matrix',same(Object.keys(fixtures.saveFixtures),['fresh','storyDiscovered','mixedBoard','syntheticEmpty','syntheticBanked','syntheticEngaged','syntheticClaimReady','archiveWindow','migrated','established','offline','recovery','corrupt','future','lockedRoster'])&&unique(Object.values(fixtures.saveFixtures)));
record('fixture-five-realms',fixtures.viewports.length===5&&fixtures.viewports.some(item=>item.width===320&&item.height===568)&&fixtures.viewports.some(item=>item.width===390&&item.height===844)&&fixtures.viewports.some(item=>item.width===1024&&item.height===768)&&fixtures.viewports.some(item=>item.reducedMotion===true)&&fixtures.viewports.some(item=>item.copyScale===1.75),fixtures.viewports);
record('fixture-v2-archive-policy',fixtures.claimArchiveConfigId==='claim-archive.phase-15.v1'&&same(fixtures.archivePolicy,{recentReceiptLimit:512,foldBatchSize:128,archiveWindowFixtureCount:512,expectedRecentAfterNextClaim:385,expectedThroughAfterNextClaim:128}));
record('fixture-synthetic-policy-qa-only',fixtures.productionEconomyApproved===false&&fixtures.syntheticPolicy.qaOnly===true&&fixtures.syntheticPolicy.facilityId==='facility.command-center'&&Number.isSafeInteger(fixtures.syntheticPolicy.intervalMs)&&Number.isSafeInteger(fixtures.syntheticPolicy.bankCapacity));
record('fixture-original-passive-buildings',same(fixtures.originalPassiveFacilityIds,['facility.command-center','facility.archives','facility.training-grounds','facility.hearth']));

record('facility-design-provenance',facilityDesign.configId===fixtures.frameworkConfigId&&facilityDesign.definitionSetId===fixtures.frameworkDefinitionSetId&&facilityDesign.productionEnabled===false);
record('facility-design-tuples-exact',same(normalizedFacilityDesign(),normalizedFixtureDesign()),{actual:normalizedFacilityDesign(),expected:normalizedFixtureDesign()});
record('phase17-story-unlocks-exact',same(normalizedUnlocks(),normalizedFixtureUnlocks()),{actual:normalizedUnlocks(),expected:normalizedFixtureUnlocks()});
record('phase17-unique-physical-anchors',unlocks.facilityUnlocks.length===12&&unique(unlocks.facilityUnlocks.map(item=>item.mapAnchor)));
record('phase17-original-passive-policy',fixtures.originalPassiveFacilityIds.every(id=>unlocks.facilityUnlocks.find(item=>item.facilityId===id)?.passivePolicy==='preserve-existing-building-production-and-family-assignment'));
record('phase17-story-is-discovery-capability-is-opening',unlocks.globalRules.storyIsDiscoveryAuthority===true&&unlocks.globalRules.activeInteractionNeedsCapabilityAndOpening===true&&unlocks.globalRules.passiveBuildingStateIsIndependent===true&&unlocks.globalRules.neverRelockAnOperationalSuccessor===true);
record('state-vocabularies-normalized',same(unlocks.mapStateOrder,['hidden','discovered-locked','available','claim-ready'])&&Object.keys(fixtures.designStateAliases).every(id=>unlocks.mapStateOrder.includes(id)));
const intervalFacilities=facilityDesign.facilities.filter(item=>item.operational.generationMode==='interval'),waystone=facilityDesign.facilities.find(item=>item.id==='facility.waystone'),waystoneOpportunity=facilityDesign.opportunityDefinitions.find(item=>item.facilityId==='facility.waystone');
record('production-facility-economy-disabled',facilityDesign.productionEnabled===false&&intervalFacilities.length===11&&intervalFacilities.every(item=>item.operational.intervalMs===null&&item.operational.bankCapacity===null&&item.operational.unattendedTargetMs===null&&item.operational.economyStatus==='requires-approval'));
record('waystone-authored-event-only',waystone?.operational.generationMode==='authored-event'&&waystone?.operational.intervalMs===null&&waystone?.operational.bankCapacity===null&&waystoneOpportunity?.generation==='authored-event'&&legacy.waystone?.timedOpportunityGeneration===false&&same(legacy.waystone?.nativeClaimSourceTypes,['opportunity.legacy.reward','opportunity.story.reward']));
record('opportunities-nonexpiring-and-manual',facilityDesign.opportunityDefinitions.every(item=>item.expires===false&&item.claimMode==='manual'));
const facilityContract=text('design/phase-14/PHASE_14_FACILITY_CONTRACT.md'),phase1516Contract=text('design/phase-15-16/PHASE_15_16_CONTRACT.md'),seamContract=text('design/phase-15-16/SEAM_RESOLUTION.md');
record('trusted-finalizer-contract',facilityContract.includes('Finalizers come only from an immutable source-adapter registry')&&phase1516Contract.includes('trusted Restaurant finalizer')&&seamContract.includes('trusted finalizer')&&seamContract.includes('Any failure aborts every step'));
record('v2-archive-contract',seamContract.includes('claim-archive.phase-15.v1')&&seamContract.includes('most recent 512 full receipts')&&seamContract.includes('oldest 128 receipts')&&seamContract.includes('throughSequence + recentReceipts.length === nextSequence'));
const phase15Tutorials=tutorials.tutorials.filter(item=>item.runtimeDeliveryPhase===15);
record('five-phase15-tutorials-exact',same(phase15Tutorials.map(item=>item.id),fixtures.phase15TutorialIds)&&phase15Tutorials.every(item=>item.stepIds.length>=3&&item.speaker?.primaryActorId));
record('phase15-tutorials-in-ledger',fixtures.phase15TutorialIds.every(id=>p13.allTutorialCoverageIds.includes(id)));
record('all-38-cast-hooks-exact',castHooks.actors.length===38&&same(castHooks.actors.map(item=>item.actorId),fixtures.actorIds)&&unique(fixtures.actorIds));
record('locked-fellow-and-art-selection-policy',castHooks.selectionPolicy.lockedFellowsExcluded===true&&castHooks.selectionPolicy.deterministicFallbackOrder===true&&castHooks.selectionPolicy.mechanicalCopyIndependentOfSpeaker===true&&same(castHooks.selectionPolicy.artFallbackOrder,['approved-transparent-cutout','approved-framed-treatment','attributed-text-only'])&&castHooks.selectionPolicy.forbiddenPresentation==='unframed-full-background-profile-overlay');
record('legacy-and-restaurant-remain-disabled',legacy.productionEnabled===false&&legacy.tiers.every(item=>item.reward==null)&&legacy.feats.every(item=>item.reward==null)&&restaurant.productionEnabled===false&&restaurant.facility.targetPhase===16&&restaurant.facility.operational.intervalMs===null&&restaurant.facility.operational.bankCapacity===null&&restaurant.facility.operational.activeProfitTargetShare===null);
record('static-fixtures-are-unapproved-only',facilityFixtures.purpose.includes('none of these values are approved production economy values')&&facilityFixtures.syntheticPolicy.facilityId==='facility.restaurant');

const inheritedFailures=Object.entries(inherited.files).filter(([path,expected])=>{try{return sha(baseRead(path))!==expected}catch{return true}}).map(([path])=>path);
record('inherited-contracts-byte-frozen',inherited.baseCommit===BASE&&inheritedFailures.length===0,{count:Object.keys(inherited.files).length,failures:inheritedFailures});
const assets=JSON.parse(baseRead('qa/phase-13-independent/fixtures/phase11h-assets.json').toString('utf8'));
const assetFailures=Object.entries(assets.files).filter(([path,expected])=>{try{return sha(baseRead(path))!==expected}catch{return true}}).map(([path])=>path);
record('phase11h-assets-byte-preserved',Object.keys(assets.files).length===47&&assetFailures.length===0,{count:Object.keys(assets.files).length,failures:assetFailures});
record('runner-isolated-and-fail-closed',text('qa/phase-15-independent/realm.js').includes('allowDestructive:true')&&text('qa/phase-15-independent/realm.js').includes('isolatedStorage:true')&&text('qa/phase-15-independent/realm.js').includes('phase15-contract-unavailable')&&text('qa/phase-15-independent/realm.js').includes('if(!qa){'));
record('runner-uses-actual-dom',[
  'document.querySelector','document.querySelectorAll','getBoundingClientRect','getComputedStyle','document.activeElement','KeyboardEvent','scrollWidth'
].every(value=>text('qa/phase-15-independent/realm.js').includes(value)));
record('runner-required-behavior-coverage',[
  'actual-dom-board-and-twelve-hotspots','story-discovers-and-opens-waystone-once','future-facility-discovered-not-opened',
  'settlement-stable-ordinals-nonexpiring','manual-claim-one-transaction-global-local-receipt','two-client-${kind}-one-winner',
  'v2-archive-folds-512-plus-one','export-import-preserves-successor-lineage','corrupt-fixture-refused-and-preserved',
  'offline-capped-and-never-resolves-or-claims','locked-fellows-never-speak','actual-dom-sheet-focus-and-escape',
  'actual-dom-reduced-motion-equivalence','final-passive-baseline-preserved','zero-native-storage-accesses'
].every(id=>text('qa/phase-15-independent/realm.js').includes(id)));
for(const path of ['verify.mjs','runner.js','realm.js']){
  const run=spawnSync(NODE,['--check',`qa/phase-15-independent/${path}`],{cwd:ROOT,encoding:'utf8'});
  record(`syntax-${path}`,run.status===0,run.stderr.trim());
}

if(PACKAGE_ONLY){
  const baseArtifact=baseRead('index.html'),artifact={sha256:sha(baseArtifact),byteLength:baseArtifact.length};
  record('exact-frozen-base-artifact',artifact.sha256===inherited.files['index.html']&&artifact.byteLength===1116321,artifact);
  record('base-has-accepted-phase13-not-phase15',baseRead('index.html').includes(Buffer.from('__EVERSTEAD_PHASE_13_QA__'))&&!baseRead('index.html').includes(Buffer.from('__EVERSTEAD_PHASE_15_QA__')));
}else{
  const paths=productionSources(),combined=paths.map(path=>text(path)).join('\n'),versions=[...combined.matchAll(/CURRENT_SCHEMA_VERSION\s*=\s*(\d+)/g)].map(match=>Number(match[1]));
  record('candidate-phase15-bridge-contract',combined.includes('__EVERSTEAD_PHASE_15_QA__')&&combined.includes(fixtures.bridgeVersion)&&combined.includes('allowDestructive')&&combined.includes('isolatedStorage')&&combined.includes('NATIVE_STORAGE'),paths);
  record('candidate-phase15-config-and-identities',combined.includes(fixtures.boardConfigId)&&combined.includes(fixtures.boardDefinitionSetId)&&fixtures.facilities.every(item=>combined.includes(item.id)&&combined.includes(item.mapAnchor)));
  record('candidate-physical-board-dom-contract',fixtures.requiredDomSelectors.every(selector=>combined.includes(selector.slice(1,-1).split('=')[0]))&&combined.includes('data-phase15-facility-board')&&combined.includes('data-phase15-facility-id'));
  record('candidate-story-capability-state-engine',fixtures.runtimeStates.every(id=>combined.includes(`'${id}'`)||combined.includes(`"${id}"`))&&fixtures.facilities.every(item=>combined.includes(item.discoveryContentId)&&combined.includes(item.requiredCapabilityId)));
  record('candidate-opportunity-finalizer-contract',combined.includes(fixtures.phase12ClaimSourceType)&&combined.includes('immutableFinalizer')&&combined.includes('expiresAt')&&combined.includes('claim-ready')&&combined.includes('ordinal'));
  record('candidate-v2-archive-contract',combined.includes(fixtures.claimArchiveConfigId)&&combined.includes('recentReceipts')&&combined.includes('archiveCheckpoint')&&combined.includes('predecessorClaimedOfferIds')&&combined.includes('throughSequence'));
  record('candidate-tutorial-successor-contract',combined.includes(fixtures.bridgeVersion)&&fixtures.phase15TutorialIds.every(id=>combined.includes(id))&&combined.includes('replay')&&combined.includes('dismissed'));
  record('candidate-cast-hook-contract',fixtures.actorIds.every(id=>combined.includes(id))&&combined.includes('lockedFellowsExcluded'));
  record('candidate-phase12-phase13-seams-preserved',combined.includes('__EVERSTEAD_PHASE_12_QA__')&&combined.includes('__EVERSTEAD_PHASE_13_QA__')&&combined.includes(fixtures.phase12ActivationId));
  record('candidate-schema-remains-12',Math.max(0,...versions)===12,versions);
}

const owned=path=>['docs/PHASE_15_INDEPENDENT_QA_CONTRACT.md','docs/PHASE_15_INDEPENDENT_QA_RESULT.md'].includes(path)||path.startsWith('qa/phase-15-independent/');
const packageCommits=git(['log','--format=%H',`${BASE}..HEAD`,'--','docs/PHASE_15_INDEPENDENT_QA_CONTRACT.md','docs/PHASE_15_INDEPENDENT_QA_RESULT.md','qa/phase-15-independent']).trim().split('\n').filter(Boolean);
const ownershipViolations=[];
for(const commit of packageCommits){
  const changed=git(['diff-tree','--root','--no-commit-id','--name-only','-r',commit]).trim().split('\n').filter(Boolean);
  for(const path of changed)if(!owned(path))ownershipViolations.push({commit,path});
}
record('committed-qa-paths-owned',packageCommits.length>=1&&ownershipViolations.length===0,{packageCommits,violations:ownershipViolations});

const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed;
const result={phase:'15-independent-village-board',mode:PACKAGE_ONLY?'PACKAGE_ONLY':'CANDIDATE',status:failed?'FAIL':'PASS',baseCommit:BASE,total:rows.length,passed,failed,rows};
console.log(JSON.stringify(result,null,2));
if(failed)process.exitCode=1;
