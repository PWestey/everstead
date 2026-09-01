import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname);
const QA=resolve(ROOT,'qa/phase-14-independent');
const NODE=process.execPath;
const BASE='c8c63b378ad9523b7d12be965335ff4ee6b81b4f';
const DESIGN='102232b1784c08805d5078c7c9915a15fefe3b53';
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
const fixtures=json('qa/phase-14-independent/fixtures/contract-fixtures.json');
const inherited=json('qa/phase-14-independent/fixtures/inherited-hashes.json');
const p13=json('qa/phase-13-independent/fixtures/contract-fixtures.json');
const definitions=json('design/phase-14/facility-definitions.json');
const designFixtures=json('design/phase-14/fixtures.json');

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

function normalizedFacilities(value){
  const opportunities=new Map(value.opportunityDefinitions.map(item=>[item.id,item]));
  return value.facilities.map(item=>{
    const opportunity=opportunities.get(item.opportunityDefinitionIds[0]);
    return {id:item.id,activityId:item.activityId,mapAnchor:item.mapAnchor,localProgressTrackId:item.localProgressTrackIds[0],generationMode:item.operational.generationMode,opportunityDefinitionId:opportunity?.id};
  });
}

record('base-commit-reachable',git(['merge-base','--is-ancestor',BASE,'HEAD'])==='');
record('package-topology',same(filesBelow(QA),EXPECTED),filesBelow(QA));
const checksumRows=text('qa/phase-14-independent/checksums.sha256').trim().split('\n').map(line=>{const match=line.match(/^([0-9a-f]{64})  (.+)$/);return match?{expected:match[1],path:match[2]}:null});
const checksumFailures=checksumRows.filter(item=>!item||!existsSync(resolve(ROOT,item.path))||sha(read(item.path))!==item.expected).map(item=>item?.path||'malformed');
record('package-checksums',checksumRows.length===10&&checksumFailures.length===0,{count:checksumRows.length,failures:checksumFailures});
record('contract-and-result-documents',[ 'docs/PHASE_14_INDEPENDENT_QA_CONTRACT.md','docs/PHASE_14_INDEPENDENT_QA_RESULT.md'].every(path=>existsSync(resolve(ROOT,path))));
const contract=text('docs/PHASE_14_INDEPENDENT_QA_CONTRACT.md');
record('contract-numbering-is-correct',contract.includes('Phase 14 validates and tunes')&&contract.includes('Phase 15')&&contract.includes('must not require or publish a Phase 14 facility-runtime bridge')&&!contract.includes('require a Phase 14 facility runtime bridge'));
record('contract-covers-release-risks',[
  'First Covenant','fresh','midgame','migrated','established','corrupt','offline','multi-tab',
  'exact-once','manual claim','Campaign pacing','Simulate-2H','320×568','390×844','1024×768',
  'keyboard','focus','reduced motion','38','Phase 12','legacy','fail-closed'
].every(value=>contract.toLowerCase().includes(value.toLowerCase())));

record('fixture-provenance',fixtures.contractVersion===1&&fixtures.bridgeVersion==='phase-13-independent-qa-v1'&&fixtures.baseCommit===BASE&&fixtures.designCommit===DESIGN);
record('fixture-save-matrix',same(Object.keys(fixtures.saveFixtures),['fresh','midgame','migrated','established','corrupt','offline','claimReady','tutorialReady'])&&unique(Object.values(fixtures.saveFixtures)),fixtures.saveFixtures);
record('fixture-five-scenes',same(fixtures.phase13StoryIds,p13.storyIds)&&fixtures.phase13StoryIds.length===5);
record('fixture-manual-claim-identity',fixtures.exampleClaimId===p13.exampleClaimId);
record('fixture-bounded-legacy-scope',fixtures.legacyScope.phase13ContinuingTracks===1&&fixtures.legacyScope.phase13OneTimeFeats===1&&fixtures.legacyScope.phase13ManualClaims===1&&fixtures.legacyScope.phase15PlannedContinuingTracks===6&&fixtures.legacyScope.phase15PlannedOneTimeFeats===5&&fixtures.legacyScope.phase15ProductionEnabled===false&&fixtures.legacyScope.phase15EconomyApproved===false,fixtures.legacyScope);
record('fixture-pacing-profiles',same(fixtures.pacingProfiles,['fresh','midgame','established'])&&fixtures.rewardImpactPolicy==='measurement-only-no-unapproved-production-tuning');
record('fixture-four-realms',fixtures.viewports.length===4&&fixtures.viewports.some(item=>item.width===320&&item.height===568)&&fixtures.viewports.some(item=>item.width===390&&item.height===844)&&fixtures.viewports.some(item=>item.width===1024)&&fixtures.viewports.some(item=>item.reducedMotion===true),fixtures.viewports);
record('fixture-cast-exact',same(fixtures.actorIds,sorted([...p13.fellowIds.map(id=>`fellow.${id}`),...p13.familyIds.map(id=>`family.${id}`)]))&&fixtures.actorIds.length===38);
record('fixture-facility-twelve-tuples',fixtures.facilities.length===12&&unique(fixtures.facilities.map(item=>item.id))&&unique(fixtures.facilities.map(item=>item.activityId))&&unique(fixtures.facilities.map(item=>item.opportunityDefinitionId))&&unique(fixtures.facilities.map(item=>item.localProgressTrackId)));
record('facility-hotspot-states-frozen-for-phase15',same(fixtures.hotspotStates,['hidden','discovered','available','ready'])&&fixtures.hotspotStates.every(id=>contract.includes(id)),fixtures.hotspotStates);

record('facility-design-provenance',definitions.configId===fixtures.configId&&definitions.definitionSetId===fixtures.definitionSetId&&definitions.phase12ConfigId===fixtures.phase12ConfigId&&definitions.phase12DefinitionSetId===fixtures.phase12DefinitionSetId&&definitions.productionEnabled===false);
record('facility-design-tuples-exact',same(normalizedFacilities(definitions),fixtures.facilities),normalizedFacilities(definitions));
record('facility-design-reference-integrity',definitions.facilities.every(facility=>facility.opportunityDefinitionIds.length===1&&definitions.opportunityDefinitions.some(item=>item.id===facility.opportunityDefinitionIds[0]&&item.facilityId===facility.id&&item.activityId===facility.activityId&&item.generation===facility.operational.generationMode)));
record('facility-design-stable-unique-identities',unique(definitions.facilities.map(item=>item.id))&&unique(definitions.facilities.map(item=>item.activityId))&&unique(definitions.facilities.flatMap(item=>item.localProgressTrackIds))&&unique(definitions.opportunityDefinitions.map(item=>item.id))&&unique(definitions.opportunityDefinitions.map(item=>item.interactionKind)));
const intervals=definitions.facilities.filter(item=>item.operational.generationMode==='interval');
const waystone=definitions.facilities.find(item=>item.id==='facility.waystone');
const waystoneOpportunity=definitions.opportunityDefinitions.find(item=>item.facilityId==='facility.waystone');
record('facility-design-economy-explicitly-disabled',definitions.productionEnabled===false&&intervals.length===11&&intervals.every(item=>item.operational.intervalMs===null&&item.operational.bankCapacity===null&&item.operational.unattendedTargetMs===null&&item.operational.economyStatus==='requires-approval'));
record('facility-waystone-authored-only',waystone?.operational.generationMode==='authored-event'&&waystone?.operational.intervalMs===null&&waystone?.operational.bankCapacity===null&&waystone?.operational.unattendedTargetMs===null&&waystone?.operational.economyStatus==='event-only'&&waystoneOpportunity?.generation==='authored-event');
record('facility-opportunities-bank-and-manual-claim',definitions.opportunityDefinitions.every(item=>item.expires===false&&item.claimMode==='manual'));
record('facility-tutorial-references-covered',same(sorted(definitions.facilities.flatMap(item=>item.tutorialIds)),fixtures.tutorialIds)&&fixtures.tutorialIds.every(id=>p13.allTutorialCoverageIds.includes(id)));
record('facility-cast-references-exact',same(sorted(definitions.facilities.flatMap(item=>item.dialogueHooks.map(hook=>hook.actorId))),fixtures.actorIds));
record('facility-static-fixture-identities',designFixtures.fixtures.length===18&&same(designFixtures.fixtures.map(item=>item.id),fixtures.fixtureIds)&&unique(fixtures.fixtureIds));
record('facility-synthetic-values-stay-qa-only',designFixtures.purpose.includes('none of these values are approved production economy values')&&designFixtures.syntheticPolicy.facilityId===fixtures.syntheticPolicy.facilityId&&designFixtures.syntheticPolicy.intervalMs===fixtures.syntheticPolicy.intervalMs);
record('facility-contract-requires-phase12-finalizer',text('design/phase-14/PHASE_14_FACILITY_CONTRACT.md').includes('Phase 12 shared claim path')&&text('design/phase-14/PHASE_14_FACILITY_CONTRACT.md').includes('Finalizers come only from an immutable source-adapter registry'));

const inheritedFailures=Object.entries(inherited.files).filter(([path,expected])=>!existsSync(resolve(ROOT,path))||sha(read(path))!==expected).map(([path])=>path);
record('inherited-contracts-byte-frozen',inherited.baseCommit===BASE&&inheritedFailures.length===0,{count:Object.keys(inherited.files).length,failures:inheritedFailures});
const assets=json('qa/phase-13-independent/fixtures/phase11h-assets.json');
const assetFailures=Object.entries(assets.files).filter(([path,expected])=>!existsSync(resolve(ROOT,path))||sha(read(path))!==expected).map(([path])=>path);
record('phase11h-assets-byte-preserved',Object.keys(assets.files).length===47&&assetFailures.length===0,{count:Object.keys(assets.files).length,failures:assetFailures});
record('runner-isolated-and-fail-closed',text('qa/phase-14-independent/realm.js').includes('allowDestructive:true')&&text('qa/phase-14-independent/realm.js').includes('isolatedStorage:true')&&text('qa/phase-14-independent/realm.js').includes('phase13-contract-unavailable')&&text('qa/phase-14-independent/realm.js').includes('if(!qa){'));
record('runner-does-not-require-facility-runtime',!text('qa/phase-14-independent/realm.js').includes('__EVERSTEAD_PHASE_14_QA__')&&!text('qa/phase-14-independent/runner.js').includes('__EVERSTEAD_PHASE_14_QA__'));
record('runner-required-behavior-coverage',[
  'fresh-first-covenant-once','midgame-valid-and-measured','migrated-baseline-honest','corrupt-fixture-refused',
  'offline-cap-preserved','claim-two-client-one-winner','tutorial-skip-complete-replay','cast-coverage-38',
  'pacing-three-profiles','reward-impact-measurement-only','keyboard-and-focus-contract','phase12-seam-preserved',
  'legacy-modes-dormant','zero-native-storage-accesses'
].every(id=>text('qa/phase-14-independent/realm.js').includes(id)));
for(const path of ['verify.mjs','runner.js','realm.js']){
  const run=spawnSync(NODE,['--check',`qa/phase-14-independent/${path}`],{cwd:ROOT,encoding:'utf8'});
  record(`syntax-${path}`,run.status===0,run.stderr.trim());
}

if(PACKAGE_ONLY){
  const artifact={sha256:sha(read('index.html')),byteLength:read('index.html').length};
  record('exact-integration-base-artifact',artifact.sha256==='e0060a2185da3a775cebfbda253c608d1e4ce7e84d5ba59e5aeaf07a04f72c45'&&artifact.byteLength===1060212,artifact);
  const probe=spawnSync(NODE,['qa/phase-12/probe.mjs'],{cwd:ROOT,encoding:'utf8',maxBuffer:256*1024*1024});
  record('phase12-focused-probe-57-of-57',probe.status===0&&probe.stdout.includes('Phase 12 focused probe: 57/57'),{status:probe.status,tail:probe.stdout.trim().slice(-300),stderr:probe.stderr.trim().slice(-300)});
  const gate=spawnSync(NODE,['qa/phase-12-independent/verify.mjs'],{cwd:ROOT,encoding:'utf8',maxBuffer:256*1024*1024});
  const parsed=(()=>{try{return JSON.parse(gate.stdout)}catch{return null}})();
  record('phase12-independent-25-of-25',gate.status===0&&parsed?.passed===25&&parsed?.failed===0,{status:gate.status,passed:parsed?.passed,failed:parsed?.failed,stderr:gate.stderr.trim().slice(-300)});
}else{
  const paths=productionSources(),combined=paths.map(path=>text(path)).join('\n');
  const versions=[...combined.matchAll(/CURRENT_SCHEMA_VERSION\s*=\s*(\d+)/g)].map(match=>Number(match[1]));
  record('candidate-phase13-bridge-contract',combined.includes('__EVERSTEAD_PHASE_13_QA__')&&combined.includes(fixtures.bridgeVersion)&&combined.includes('allowDestructive')&&combined.includes('isolatedStorage')&&combined.includes('NATIVE_STORAGE'),paths);
  record('candidate-phase12-seam-preserved',combined.includes('__EVERSTEAD_PHASE_12_QA__')&&combined.includes(fixtures.phase12ActivationId)&&Math.max(0,...versions)===12,versions);
  record('candidate-five-story-identities',fixtures.phase13StoryIds.every(id=>combined.includes(id)));
  record('candidate-phase13-tutorial-identities',p13.phase13TutorialIds.every(id=>combined.includes(id)));
  record('candidate-cast-identities',p13.fellowIds.concat(p13.familyIds).every(id=>combined.includes(`'${id}'`)||combined.includes(`\"${id}\"`)));
  record('candidate-opening-art-policy',p13.openingArtRequirements.every(item=>combined.includes(item.speaker.split(':')[1]))&&p13.approvedOpeningPresentationModes.every(mode=>combined.includes(mode)));
  record('candidate-campaign-table-renamed',!combined.match(/\b(?:const|let|var)\s+STORY\s*=\s*\[/));
  record('candidate-pacing-measurement-contract',combined.includes(fixtures.rewardImpactPolicy)&&fixtures.pacingProfiles.every(id=>combined.includes(id)));
  record('candidate-facility-runtime-not-required',true,'Phase 15 owns player-visible facility runtime.');
}

let changed=[];
try{changed=git(['diff-tree','--no-commit-id','--name-only','-r',BASE,'HEAD']).trim().split('\n').filter(Boolean)}catch{}
const owned=path=>['docs/PHASE_14_INDEPENDENT_QA_CONTRACT.md','docs/PHASE_14_INDEPENDENT_QA_RESULT.md'].includes(path)||path.startsWith('qa/phase-14-independent/');
record('committed-qa-paths-owned',!PACKAGE_ONLY||changed.length===0||changed.every(owned),PACKAGE_ONLY?changed:'Candidate mode intentionally permits implementation files; package ownership is enforced by --package-only.');
const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed;
const result={phase:'14-independent-validation',mode:PACKAGE_ONLY?'PACKAGE_ONLY':'CANDIDATE',status:failed?'FAIL':'PASS',baseCommit:BASE,designCommit:DESIGN,total:rows.length,passed,failed,rows};
console.log(JSON.stringify(result,null,2));
if(failed)process.exitCode=1;
