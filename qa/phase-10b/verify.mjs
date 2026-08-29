import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {RELEASED_CONFIG,buildMicroVectors,buildParityVectors,canonical,canonicalText,mutationProbe,referenceEvaluate} from './reference-model.mjs';
import {productionEvaluateBatch,productionProbeIdentity,productionProbeMetrics,productionProbeRejects} from './production-probe.mjs';
import {buildAdvisoryReport,buildCanonicalInput,canonicalReportText,rewardProofMutationProbe,simulateBundle,simulateCanonicalInput,unwrapCanonical,validateInput,validateScenarioRegistry} from './simulate.mjs';

process.env.TZ='America/Phoenix';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..');
const read=path=>readFileSync(resolve(root,path));
const text=path=>read(path).toString('utf8');
const json=path=>JSON.parse(text(path));
const sha=value=>createHash('sha256').update(value).digest('hex');
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const rows=[];
const check=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail).slice(0,8000)});
const walk=path=>{const result=[];for(const name of readdirSync(resolve(root,path))){const child=resolve(root,path,name),relative=child.slice(root.length+1);if(statSync(child).isDirectory())result.push(...walk(relative));else result.push(relative)}return result.sort()};
const firstDiff=(left,right,path='')=>{if(Object.is(left,right))return null;if(typeof left!==typeof right||left===null||right===null||typeof left!=='object')return path||'/';const leftKeys=Object.keys(left),rightKeys=Object.keys(right);if(!same(leftKeys,rightKeys))return path+'/'+[...new Set([...leftKeys,...rightKeys])].find(key=>!leftKeys.includes(key)||!rightKeys.includes(key));for(const key of leftKeys){const child=firstDiff(left[key],right[key],path+'/'+String(key).replaceAll('~','~0').replaceAll('/','~1'));if(child)return child}return null};
const collectNumbers=value=>{const output=[];(function visit(item){if(typeof item==='number')output.push(item);else if(Array.isArray(item))item.forEach(visit);else if(item&&typeof item==='object')Object.values(item).forEach(visit)})(value);return output};
const nondecreasing=values=>values.every((value,index)=>index===0||value>=values[index-1]);
const floatBits=value=>{const bytes=Buffer.allocUnsafe(8);bytes.writeDoubleBE(value);return bytes.toString('hex')};
const plainObjectPaths=(value,path=[],rows=[])=>{if(value&&typeof value==='object'&&!Array.isArray(value)){rows.push(path);for(const [key,child]of Object.entries(value))plainObjectPaths(child,path.concat(key),rows)}else if(Array.isArray(value))value.forEach((child,index)=>plainObjectPaths(child,path.concat(index),rows));return rows};
const mutateAtPath=(value,path,mutate)=>{const copy=structuredClone(value);let cursor=copy;for(const key of path)cursor=cursor[key];mutate(cursor);return copy};
const rejects=(validator,value)=>{try{validator(value);return false}catch{return true}};

const scenarios=json('qa/phase-10b/scenarios.json');
const golden=json('qa/phase-10b/golden-current.json');
const frozenCanonicalReport=json('qa/phase-10b/current-report.json');
const frozenReport=unwrapCanonical(frozenCanonicalReport);
const registry=json('qa/phase-10b/row-registry.json');
const successorRegistry=json('qa/phase-10b/phase10a-successor-hashes.json');
const artifact=read('index.html'),source=artifact.toString('utf8');
const phase10aManifest=json('qa/phase-10a/current-manifest.json');
const phase10aChecksums=text('qa/phase-10a/checksums.sha256').trim().split('\n');
const referenceSource=text('qa/phase-10b/reference-model.mjs');
const simulatorSource=text('qa/phase-10b/simulate.mjs');
const verifierSource=text('qa/phase-10b/verify.mjs');
const realmSource=text('qa/phase-10b/realm.js'),runnerSource=text('qa/phase-10b/runner.js');
const phase10bFiles=walk('qa/phase-10b').filter(path=>!path.endsWith('.candidate.json'));
const docFiles=['docs/PHASE_10B_SIMULATOR_CONTRACT.md','docs/PHASE_10B_EXECUTION.md','docs/PHASE_10B_RESULT.md'].filter(path=>{try{read(path);return true}catch{return false}});
const predecessorPaths=Object.keys(successorRegistry.files);
const snapshotPaths=[...new Set(['index.html',...predecessorPaths,...phase10bFiles,...docFiles])].sort();
const snapshot=()=>Object.fromEntries(snapshotPaths.map(path=>[path,sha(read(path))]));
const beforeSnapshot=snapshot();
const assets=[...source.matchAll(/data:image\/[^;"']+;base64,[A-Za-z0-9+/=]+/g)].map(match=>match[0]);
const assetAggregate=sha(Buffer.from(assets.join('\n'))),registrySha=sha(read('qa/phase-10b/row-registry.json'));
let scenarioValidation=true;try{validateScenarioRegistry(scenarios)}catch(error){scenarioValidation=error.message}
const scenarioObjectPaths=plainObjectPaths(scenarios),canonicalInputFixture=buildCanonicalInput(scenarios,'candidate-growth-120','fresh','instant'),inputObjectPaths=plainObjectPaths(canonicalInputFixture);
const scenarioUnknownRejected=scenarioObjectPaths.every(path=>rejects(validateScenarioRegistry,mutateAtPath(scenarios,path,value=>{value.__phase10bUnknown=true}))),scenarioUndefinedRejected=scenarioObjectPaths.every(path=>rejects(validateScenarioRegistry,mutateAtPath(scenarios,path,value=>{value.__phase10bUnknown=undefined}))),inputUnknownRejected=inputObjectPaths.every(path=>rejects(validateInput,mutateAtPath(canonicalInputFixture,path,value=>{value.__phase10bUnknown=true}))),inputUndefinedRejected=inputObjectPaths.every(path=>rejects(validateInput,mutateAtPath(canonicalInputFixture,path,value=>{value.__phase10bUnknown=undefined})));
const scenarioValueRejections=[value=>value.simulation.releasedConstants.stableSalts.familySuccess='changed',value=>value.simulation.releasedConstants.fellowFamilyLinks.cael.push('tamsin'),value=>value.simulation.live.viewports[0].width=321,value=>value.simulation.live.motionModes.reverse(),value=>value.simulation.live.getAllowlist.reverse(),value=>value.simulation.policy.stopConditions.reverse(),value=>value.buildingProfiles.reverse(),value=>value.buildingProfiles[0].intimacy=-0,value=>value.simulation.oathBoosts.training=-0,value=>value.simulation.archetypes[0].rosterState.fellows.cael.exp=-0].every(mutate=>{const candidate=structuredClone(scenarios);mutate(candidate);return rejects(validateScenarioRegistry,candidate)});
const inputValueRejections=[value=>value.config.status='accepted production',value=>value.config.label='promoted candidate',value=>value.archetype.rosterState.player.rank=2,value=>value.policy.stopConditions.reverse(),value=>value.identities.scenarioIdentity='0'.repeat(64),value=>value.releasedConstants.stableSalts.foreign='x',value=>value.archetype.rosterState.fellows.cael.exp=-0,value=>value.oathBoosts.training=-0].every(mutate=>{const candidate=structuredClone(canonicalInputFixture);mutate(candidate);return rejects(validateInput,candidate)});
const strictValidation={scenarioObjectCount:scenarioObjectPaths.length,inputObjectCount:inputObjectPaths.length,scenarioPathSha256:sha(Buffer.from(scenarioObjectPaths.map(path=>path.join('/')).join('\n'))),inputPathSha256:sha(Buffer.from(inputObjectPaths.map(path=>path.join('/')).join('\n'))),scenarioUnknownRejected,scenarioUndefinedRejected,inputUnknownRejected,inputUndefinedRejected,scenarioValueRejections,inputValueRejections};
const strictProbeVectors=buildParityVectors(scenarios),strictProbeRepresentatives=[...new Map(strictProbeVectors.map(vector=>[(vector.kind==='idle'||vector.kind==='progression')?vector.kind+'/'+vector.mode:vector.kind,vector])).values()],topLevelProbeUnknownRejected=strictProbeRepresentatives.every(vector=>productionProbeRejects(root,{...structuredClone(vector),foreign:777}));
const probeRepresentative=key=>structuredClone(strictProbeRepresentatives.find(item=>((item.kind==='idle'||item.kind==='progression')?item.kind+'/'+item.mode:item.kind)===key));
const nestedProbeMutations=[
  ['building',vector=>vector.profile.foreign=777],['offline',vector=>vector.levels.foreign=777],['fellow-power',vector=>vector.profile.foreign=777],['companion-power',vector=>vector.profile.foreign=777],['idle/tower-settle',vector=>vector.segments=[{floor:2,elapsedMs:1,foreign:777}]],['idle/expedition-settle',vector=>vector.segments=[{stage:3,elapsedMs:1,foreign:777}]],['idle/family-drop',vector=>vector.levels.foreign=777]
].every(([key,mutate])=>{const vector=probeRepresentative(key);mutate(vector);return productionProbeRejects(root,vector)});
const semanticProbeMutations=[
 ['idle/tower-history',vector=>vector.count=721],['idle/expedition-history',vector=>vector.count=721],['idle/tower-consume',vector=>vector.segments=Array.from({length:31},(_,index)=>({floor:index+1,elapsedMs:1}))],['idle/expedition-consume',vector=>vector.segments=Array.from({length:31},(_,index)=>({stage:index+1,elapsedMs:1}))],['idle/tower-consume',vector=>vector.segments=[{floor:1,elapsedMs:86400001}]],['idle/expedition-consume',vector=>vector.segments=[{stage:1,elapsedMs:86400001}]],['idle/tower-settle',vector=>vector.segments=[{floor:3,elapsedMs:1}]],['idle/expedition-settle',vector=>vector.segments=[{stage:4,elapsedMs:1}]],['idle/expedition-history',vector=>vector.ownedIds.reverse()],['idle/expedition-history',vector=>vector.ownedIds=[]],['idle/family-drop',vector=>{vector.elapsedMs=181*14400000;vector.carryMs=0}],['idle/family-drop',vector=>vector.carryMs=14400000],['idle/family-drop',vector=>vector.drought=8],['idle/family-drop',vector=>vector.ordinal=Number.MAX_SAFE_INTEGER],['progression/mastery',vector=>vector.points=50001],['progression/might',vector=>vector.points=50001],['offline',vector=>{vector.startAt=Number.MAX_SAFE_INTEGER;vector.elapsedMs=1}],['offline',vector=>{vector.startAt=8640000000000001;vector.elapsedMs=0}],['offline',vector=>{vector.startAt=1788030000000;vector.elapsedMs=3600000;vector.pendingBefore=Number.MAX_SAFE_INTEGER-25399;vector.levels={training:1,command:1,archives:1,hearth:1};vector.profile=structuredClone(scenarios.buildingProfiles[0])}],['idle/tower-settle',vector=>{vector.cursor=8640000000000001;vector.at=8640000000000001}],['campaign',vector=>{vector.recommendedPower=Number.MIN_VALUE;vector.totalPower=Number.MAX_SAFE_INTEGER}],['building',vector=>vector.profile.id='foreign-profile'],['fellow-power',vector=>vector.profile.masteryPoints=50001],['companion-power',vector=>vector.profile.masteryPoints=50001],['building',vector=>vector.profile.intimacy=-0],['idle/tower-history',vector=>vector.count=-0],['progression/mastery',vector=>vector.points=-0],['idle/stable-unit',vector=>vector.saveId='x'.repeat(129)]
].every(([key,mutate])=>{const vector=probeRepresentative(key);mutate(vector);return productionProbeRejects(root,vector)});
const boundaryVectors=[];for(const [key,mutate]of [['idle/tower-history',vector=>vector.count=720],['idle/expedition-history',vector=>vector.count=720],['idle/tower-consume',vector=>vector.segments=Array.from({length:30},(_,index)=>({floor:index+1,elapsedMs:1}))],['idle/expedition-consume',vector=>vector.segments=Array.from({length:30},(_,index)=>({stage:index+1,elapsedMs:1}))],['idle/tower-consume',vector=>vector.segments=[{floor:1,elapsedMs:86400000}]],['idle/expedition-consume',vector=>vector.segments=[{stage:1,elapsedMs:86400000}]],['idle/family-drop',vector=>{vector.elapsedMs=180*14400000;vector.carryMs=0;vector.drought=7;vector.ordinal=0}],['idle/family-drop',vector=>{vector.elapsedMs=0;vector.carryMs=14399999;vector.drought=7;vector.ordinal=Number.MAX_SAFE_INTEGER-720}],['offline',vector=>{vector.startAt=1788030000000;vector.elapsedMs=3600000;vector.pendingBefore=Number.MAX_SAFE_INTEGER-25400;vector.levels={training:1,command:1,archives:1,hearth:1};vector.profile=structuredClone(scenarios.buildingProfiles[0])}],['offline',vector=>{vector.startAt=8640000000000000;vector.elapsedMs=0;vector.pendingBefore=0}],['campaign',vector=>{vector.recommendedPower=Number.MIN_VALUE;vector.totalPower=0}],['campaign',vector=>{vector.recommendedPower=1;vector.totalPower=Number.MAX_SAFE_INTEGER}],['idle/tower-settle',vector=>{vector.cursor=8640000000000000;vector.at=8640000000000000;vector.segments=[]}]]){const vector=probeRepresentative(key);vector.id='boundary-'+boundaryVectors.length;mutate(vector);boundaryVectors.push(vector)}
let boundaryProbeAccepted=false;try{const outputs=await productionEvaluateBatch(root,boundaryVectors),pendingBoundary=outputs.find(item=>item.id==='boundary-8');boundaryProbeAccepted=outputs.length===boundaryVectors.length&&pendingBoundary.output.total===25400&&pendingBoundary.output.pendingAfter===Number.MAX_SAFE_INTEGER}catch{}
const productionUnknownRejected=topLevelProbeUnknownRejected&&nestedProbeMutations&&semanticProbeMutations&&boundaryProbeAccepted;

const staticRows=[
 ['static-artifact-sha',sha(artifact)==='717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed',sha(artifact)],
 ['static-artifact-bytes',artifact.length===18916682,artifact.length],
 ['static-assets-count',assets.length===5,assets.length],
 ['static-assets-aggregate',assetAggregate==='26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a',assetAggregate],
 ['static-schema-10',source.includes('CURRENT_SCHEMA_VERSION=10;')&&!source.includes('CURRENT_SCHEMA_VERSION=11')],
 ['static-protected-slots-12',phase10aManifest.protectedSlots===12&&source.includes("PRE_V10_BACKUP_KEY=NS+'__raw_backup_v9'")],
 ['static-contract-base',golden.contractBase==='723492b1e968407f23c7d78deabf66813f14c229'],
 ['static-production-unchanged',golden.artifactSha256===sha(artifact)&&productionProbeIdentity.artifactSha256===sha(artifact)],
 ['static-phase10a-manifest',sha(read('qa/phase-10a/current-manifest.json'))==='a09b5a6fdbe421247a3b1b2f317b8f13081de438bd153436b5e74e81ba899d18',sha(read('qa/phase-10a/current-manifest.json'))],
 ['static-phase10a-checksum-count',phase10aChecksums.length===14&&predecessorPaths.length===203,phase10aChecksums.length+'/'+predecessorPaths.length],
 ['static-scenarios-version',scenarios.scenarioVersion===1&&scenarios.phase==='10B-1'&&scenarios.simulation.scenarioFormatVersion===4&&scenarioValidation===true&&strictValidation.scenarioObjectCount===369&&strictValidation.inputObjectCount===90&&strictValidation.scenarioPathSha256==='90c61aefc2cb7a97c84328c57b370fdb524b77b2e13f619a9461a3d5bdfcb31c'&&strictValidation.inputPathSha256==='04463628ed85530dc4dcd46d6edcf381584348f1387a3494a19035a73df4f6e5'&&strictValidation.scenarioUnknownRejected&&strictValidation.scenarioUndefinedRejected&&strictValidation.inputUnknownRejected&&strictValidation.inputUndefinedRejected&&strictValidation.scenarioValueRejections&&strictValidation.inputValueRejections,{scenarioValidation,strictValidation}],
 ['static-golden-version',golden.goldenVersion===2&&golden.phase==='10B-1'&&Object.keys(golden.parity).length===240&&frozenCanonicalReport.reportVersion===3],
 ['static-row-registry-version',registry.registryVersion===1&&registry.exactTotal===624&&registry.ids.length===624&&new Set(registry.ids).size===624&&registrySha==='6f5ddf032a155e3c4c4ca1712dcdca28e8288e7e7bb906561e06cd2f6262c8be',registrySha],
 ['static-reference-separated',!referenceSource.includes("from './production-probe.mjs'")&&!referenceSource.includes("from './simulate.mjs'")&&!referenceSource.includes("readFileSync(resolve(repoRoot,'index.html')")],
 ['static-production-probe-identity',productionProbeIdentity.artifactByteLength===18916682&&productionProbeIdentity.instrumentation==='direct-exact-tail-facade-v2'&&productionProbeIdentity.restoration==='bufferwise-exact'&&productionUnknownRejected,{productionUnknownRejected}],
 ['static-simulator-advisory-only',simulatorSource.includes("candidateStatus:'advisory-only'")&&!simulatorSource.includes('recommended:true')],
 ['static-verifier-no-write',!/^import\s+\{[^}]*\b(?:write|append|rename|unlink)/m.test(verifierSource)],
 ['static-build-no-golden',text('qa/phase-10b/build-contract.mjs').includes('GOLDEN_WRITE_PROHIBITED')&&!/writeFileSync\([^\n]*golden-current/.test(text('qa/phase-10b/build-contract.mjs'))],
 ['static-browser-no-storage',realmSource.includes('PHASE_10B_API_TRAPS')&&runnerSource.includes('PHASE_10B_GET_ALLOWLIST')&&realmSource.includes("credentials:'omit'")&&runnerSource.includes("credentials:'omit'")],
 ['static-timezone',scenarios.timeZone==='America/Phoenix'&&scenarios.simulation.timeZone==='America/Phoenix'&&process.env.TZ==='America/Phoenix']
];
for(const row of staticRows)check(...row);

const configChecks=[
 RELEASED_CONFIG.buildingBaseRates.training===7200&&source.includes('training:7200'),
 RELEASED_CONFIG.buildingBaseRates.command===6500&&source.includes('command:6500'),
 RELEASED_CONFIG.buildingBaseRates.archives===5600&&source.includes('archives:5600'),
 RELEASED_CONFIG.buildingBaseRates.hearth===6100&&source.includes('hearth:6100'),
 RELEASED_CONFIG.buildingLevelCap===52&&source.includes('buildingLevelCap:52'),
 RELEASED_CONFIG.buildingLevelMultiplier===1.15&&source.includes('levelMultiplier:1.15'),
 RELEASED_CONFIG.upgradeBase===15000&&source.includes('upgradeBase:15000'),
 RELEASED_CONFIG.upgradeGrowth===1.7&&source.includes('upgradeGrowth:1.7'),
 RELEASED_CONFIG.oathDailyCap===.30&&source.includes('oathDailyCap:.30'),
 RELEASED_CONFIG.family.bonusCap===.20&&source.includes('buildingBonus:Object.freeze({cap:.20'),
 RELEASED_CONFIG.family.base===.01&&source.includes('cap:.20,base:.01'),
 RELEASED_CONFIG.family.intimacyCap===.10&&source.includes('intimacyCap:.10'),
 RELEASED_CONFIG.family.intimacyRate===.0002&&source.includes('intimacyRate:.0002'),
 RELEASED_CONFIG.family.rarityRate===.02&&source.includes('rarityRate:.02'),
 RELEASED_CONFIG.family.specialtyMatch===.01&&source.includes('specialtyMatch:.01'),
 RELEASED_CONFIG.family.rollIntervalMs===14400000&&source.includes('rollIntervalMs:14400000'),
 RELEASED_CONFIG.family.shardChanceBase===.10&&source.includes('shardChanceBase:.10'),
 RELEASED_CONFIG.family.shardChancePerLevel===.01&&source.includes('shardChancePerLevel:.01'),
 RELEASED_CONFIG.family.shardChanceCap===.18&&source.includes('shardChanceCap:.18'),
 RELEASED_CONFIG.family.pityForceAt===8&&source.includes('shardDroughtForceAt:8'),
 RELEASED_CONFIG.fellow.levelCap===120&&RELEASED_CONFIG.fellow.rarityMax===5&&same(RELEASED_CONFIG.fellow.rarityCosts,[20,40,80,160])&&source.includes('FELLOW_CONFIG=Object.freeze({levelCap:120')&&source.includes('rarityMax:5,rarityShardCosts:Object.freeze([20,40,80,160])'),
 RELEASED_CONFIG.fellow.expBase===100&&source.includes('expBase:100'),
 RELEASED_CONFIG.fellow.expGrowth===1.12&&source.includes('expGrowth:1.12'),
 RELEASED_CONFIG.fellow.levelPowerGrowth===.115&&source.includes('levelPowerGrowth:.115'),
 RELEASED_CONFIG.fellow.rarityPowerGrowth===.08&&source.includes('rarityPowerGrowth:.08'),
 RELEASED_CONFIG.companion.levelCap===100&&RELEASED_CONFIG.companion.rarityMax===5&&same(RELEASED_CONFIG.companion.rarityCosts,[20,40,80,160])&&source.includes('COMPANION_CONFIG=Object.freeze({levelCap:100')&&source.includes('rarityMax:5,rarityShardCosts:Object.freeze([20,40,80,160])'),
 RELEASED_CONFIG.companion.expBase===80&&source.includes('expBase:80'),
 RELEASED_CONFIG.companion.expGrowth===1.12&&source.includes('expGrowth:1.12'),
 RELEASED_CONFIG.companion.levelPowerGrowth===.10&&source.includes('levelPowerGrowth:.10'),
 RELEASED_CONFIG.companion.rarityPowerGrowth===.10&&source.includes('rarityPowerGrowth:.10'),
 RELEASED_CONFIG.fellow.transferRate===.40&&source.includes('transferRate:.40'),
 RELEASED_CONFIG.mastery.pointsCap===50000&&source.includes('COMPANION_MASTERY_CONFIG=Object.freeze({pointsCap:50000'),
 RELEASED_CONFIG.mastery.thresholdFactor===20&&RELEASED_CONFIG.mastery.powerPerLevel===.01,
 RELEASED_CONFIG.might.pointsCap===50000&&source.includes('FELLOW_MIGHT_CONFIG=Object.freeze({pointsCap:50000'),
 RELEASED_CONFIG.might.thresholdFactor===20&&RELEASED_CONFIG.might.powerPerLevel===.01,
 RELEASED_CONFIG.campaign.discountScale===.25&&RELEASED_CONFIG.campaign.discountCap===.35&&source.includes('discountScale:.25,discountCap:.35'),
 RELEASED_CONFIG.tower.intervalMs===3600000&&RELEASED_CONFIG.tower.elapsedCapMs===86400000,
 RELEASED_CONFIG.expedition.intervalMs===3600000&&RELEASED_CONFIG.expedition.elapsedCapMs===86400000,
 RELEASED_CONFIG.relicLevelCap===10&&source.includes('RELIC_LEVEL_CAP=10'),
 RELEASED_CONFIG.freshGold===500000&&RELEASED_CONFIG.freshProsperity===120
];
const configIds=registry.categories.find(category=>category.id==='released-config').ids;
if(configChecks.length!==40||configIds.length!==40)throw new Error('Config registry mismatch');
configIds.forEach((id,index)=>check(id,configChecks[index]));

const microVectors=buildMicroVectors(scenarios);
for(const vector of microVectors){const actual=canonical(referenceEvaluate(vector)),expected=golden.micro[vector.id];check(vector.id,same(actual,expected),{actual,expected})}
const parityVectors=strictProbeVectors;
const production=await productionEvaluateBatch(root,parityVectors),probeMetrics=productionProbeMetrics();
for(let index=0;index<parityVectors.length;index++){
 const vector=parityVectors[index],reference=canonical(referenceEvaluate(vector)),actual=canonical(production[index].output),expected=golden.parity[vector.id];
 const goldenReference=firstDiff(expected,reference),goldenProduction=firstDiff(expected,actual),referenceProduction=firstDiff(reference,actual);
 check(vector.id,production[index].id===vector.id&&!goldenReference&&!goldenProduction&&!referenceProduction,{goldenReference,goldenProduction,referenceProduction});
}

const canonicalObject=buildAdvisoryReport(scenarios),canonicalBytes=canonicalReportText(canonicalObject),report=unwrapCanonical(canonicalObject),frozenById=Object.fromEntries(frozenReport.bundles.map(bundle=>[bundle.metadata.configId+'/'+bundle.metadata.archetypeId+'/'+bundle.metadata.horizonId,bundle]));
for(const bundle of report.bundles){
 const key=bundle.metadata.configId+'/'+bundle.metadata.archetypeId+'/'+bundle.metadata.horizonId,frozen=frozenById[key],again=simulateBundle(scenarios,bundle.metadata.configId,bundle.metadata.archetypeId,bundle.metadata.horizonId),id='advisory-'+bundle.metadata.configId+'-'+bundle.metadata.archetypeId+'-'+bundle.metadata.horizonId;
 const safety=bundle.safety,conditions=safety.finite&&safety.safe&&safety.nonnegative&&safety.caps&&safety.sourceSinkConserved&&safety.noDoubleCount&&safety.familyDirectOnce&&safety.inputUnchanged&&safety.resourceAccounting.noDuplicateRewards&&safety.resourceAccounting.noLostResources&&same(canonical(bundle),canonical(again))&&same(canonical(bundle),canonical(frozen));
 check(id,conditions,{frozenDiff:firstDiff(canonical(frozen),canonical(bundle)),repeatDiff:firstDiff(canonical(again),canonical(bundle)),safety});
}

const secondCanonicalBytes=canonicalReportText(buildAdvisoryReport(scenarios));
const childCanonicalBytes=execFileSync(process.execPath,['--input-type=module','-e',"import{readFileSync}from'node:fs';import{buildAdvisoryReport,canonicalReportText}from'./qa/phase-10b/simulate.mjs';const s=JSON.parse(readFileSync('./qa/phase-10b/scenarios.json','utf8'));process.stdout.write(canonicalReportText(buildAdvisoryReport(s)))"],{cwd:root,encoding:'utf8',maxBuffer:160*1024*1024});
const frozenBytes=text('qa/phase-10b/current-report.json');
const parityById=Object.fromEntries(parityVectors.map(vector=>[vector.id,referenceEvaluate(vector)]));
const allBundles=report.bundles,candidates=allBundles.filter(bundle=>bundle.metadata.status==='advisory candidate'),released=allBundles.filter(bundle=>bundle.metadata.status==='released parity'),reportNumbers=collectNumbers(report);
const crossMidnight=parityById['parity-offline-capped-oath-cross-midnight'],tower7=parityById['parity-idle-tower-history-1-7'],tower8=parityById['parity-idle-tower-history-1-8'],exp7=parityById['parity-idle-expedition-history-1-7'],exp8=parityById['parity-idle-expedition-history-1-8'],towerCarry=parityById['parity-idle-tower-consume-carry'],expCarry=parityById['parity-idle-expedition-consume-carry'],familyExact=parityById['parity-idle-family-fresh'];
const campaignUnder=referenceEvaluate({kind:'campaign',baseCost:12000,recommendedPower:30000,totalPower:15000}),campaignAt=referenceEvaluate({kind:'campaign',baseCost:12000,recommendedPower:30000,totalPower:30000}),campaignOver=referenceEvaluate({kind:'campaign',baseCost:12000,recommendedPower:30000,totalPower:60000}),campaignHuge=referenceEvaluate({kind:'campaign',baseCost:12000,recommendedPower:30000,totalPower:3000000});
const freshReleased=allBundles.find(bundle=>bundle.metadata.configId==='released-schema10'&&bundle.metadata.archetypeId==='fresh'&&bundle.metadata.horizonId==='instant'),freshReleasedThreeDay=allBundles.find(bundle=>bundle.metadata.configId==='released-schema10'&&bundle.metadata.archetypeId==='fresh'&&bundle.metadata.horizonId==='3-day'),freshCandidate=allBundles.find(bundle=>bundle.metadata.configId==='candidate-growth-120'&&bundle.metadata.archetypeId==='fresh'&&bundle.metadata.horizonId==='instant');
const wrapperCount=value=>{let count=0;(function visit(item){if(Array.isArray(item))item.forEach(visit);else if(item&&typeof item==='object'){if(Object.keys(item).length===2&&Object.hasOwn(item,'$float64')&&Object.hasOwn(item,'decimal'))count++;else Object.values(item).forEach(visit)}})(value);return count};
const nonIntegerCount=reportNumbers.filter(value=>!Number.isInteger(value)).length;
const sameProcess=canonicalBytes===secondCanonicalBytes;
const separateProcess=canonicalBytes===childCanonicalBytes&&sha(canonicalBytes)===sha(childCanonicalBytes)&&Buffer.byteLength(canonicalBytes)===Buffer.byteLength(childCanonicalBytes);
const frozenExact=canonicalBytes===frozenBytes&&sha(canonicalBytes)===sha(frozenBytes)&&Buffer.byteLength(canonicalBytes)===Buffer.byteLength(frozenBytes)&&wrapperCount(frozenCanonicalReport)===nonIntegerCount;
const familyDirect=allBundles.every(bundle=>bundle.buildings.familyDirectOnce.passed&&Object.values(bundle.buildings.familyDirectOnce.applicationCounts).every(count=>count===1)&&Object.values(bundle.buildings.rows).every(row=>row.familyApplicationCount===1&&row.componentSequence.filter(component=>component==='familyAssignmentMultiplier').length===1));
const progressionExpected={fellows:{1:[0,100,100],8:[1007,221,1228],25:[11814,1518,13332],60:[667020,80143,747163],110:[193010688,23161382,216172070],120:[599463646,null,null]},companions:{1:[0,80,80],6:[508,141,649],20:[5074,689,5763],55:[302496,36380,338876],92:[20078642,2409517,22488159],100:[49714965,null,null]}},progressionFormula=(level,base,growth,cap)=>{let threshold=0;for(let current=1;current<level;current++)threshold+=Math.round(base*Math.pow(growth,current-1));const cost=level>=cap?null:Math.round(base*Math.pow(growth,level-1));return[threshold,cost,cost===null?null:threshold+cost]},progressionRowsComplete=['fellows','companions'].every(roster=>{const [base,growth,cap]=roster==='fellows'?[100,1.12,120]:[80,1.12,100];return allBundles.every(bundle=>Object.values(bundle.progression[roster]).every(row=>['starting','ending'].every(side=>{const value=row[side],expected=progressionFormula(value.level,base,growth,cap);return value.currentLevelThreshold===expected[0]&&value.nextLevelCost===expected[1]&&value.nextLevelThreshold===expected[2]&&value.expIntoLevel===value.exp-value.currentLevelThreshold&&value.expRemainingToNext===(value.nextLevelCost===null?null:value.nextLevelCost-value.expIntoLevel)&&value.rarityMax===5&&same(value.rarityShardCosts,[20,40,80,160])&&value.nextRarityCost===(value.rarity===5?null:[20,40,80,160][value.rarity-1])&&value.shardsRemainingToAscend===(value.nextRarityCost===null?null:Math.max(0,value.nextRarityCost-value.shards))&&value.cumulativeRaritySpend===[0,20,60,140,300][value.rarity-1]})))}),progressionAnchorsExact=['fellows','companions'].every(roster=>Object.entries(progressionExpected[roster]).every(([level,expected])=>allBundles.some(bundle=>Object.values(bundle.progression[roster]).some(row=>row.starting.level===Number(level)&&row.starting.currentLevelThreshold===expected[0]&&row.starting.nextLevelCost===expected[1]&&row.starting.nextLevelThreshold===expected[2]))));
const productionGroupedGold=freshReleasedThreeDay.ledger.claims.length===3&&freshReleasedThreeDay.ledger.claims[2].pendingBeforeCollection===676311.4679999998&&floatBits(freshReleasedThreeDay.ledger.claims[2].pendingBeforeCollection)==='4124a3aeef9db22b'&&freshReleasedThreeDay.ledger.operations.some(operation=>operation.type==='pending-accrual'&&same(operation.reductionOrder,['training','command','archives','hearth']))&&freshReleasedThreeDay.ledger.gold.operationTraceExact;
const rewardMutationProofs=Object.fromEntries(['campaign-target','campaign-gift','campaign-sequence','campaign-power-cost','idle-duplicate','idle-missing','idle-recipient','idle-settlement'].map(mutation=>[mutation,rewardProofMutationProbe(scenarios,mutation)])),rewardMutationsRejected=Object.values(rewardMutationProofs).every(proof=>proof.noDuplicateRewards===false)&&!simulatorSource.includes("'tower:claim-'")&&!simulatorSource.includes("'expedition:claim-'")&&!simulatorSource.includes("'family:claim-'");
const invariantById={
 'invariant-01-gold-buildings-sole-source':source.includes('function totalRate')&&!source.includes('FEATURE_FLAGS.goldSource'),
 'invariant-02-pending-gold-not-source':allBundles.every(bundle=>!Object.hasOwn(bundle.ledger.gold,'pendingGoldSource')),
 'invariant-03-ledger-conservation':productionGroupedGold&&allBundles.every(bundle=>bundle.ledger.gold.conserved&&bundle.safety.sourceSinkConserved),
 'invariant-04-upgrade-sink-owned':allBundles.every(bundle=>Object.hasOwn(bundle.ledger.gold,'buildingUpgradeSpent')),
 'invariant-05-fellow-campaign-sink-owned':allBundles.every(bundle=>Object.hasOwn(bundle.ledger.gold,'fellowCampaignSpent')),
 'invariant-06-companion-campaign-sink-owned':allBundles.every(bundle=>Object.hasOwn(bundle.ledger.gold,'companionCampaignSpent')),
 'invariant-07-prosperity-nonspendable':allBundles.every(bundle=>!Object.hasOwn(bundle.ledger.gold,'prosperity')),
 'invariant-08-gifts-nonspendable':allBundles.every(bundle=>!Object.hasOwn(bundle.ledger.gold,'gifts')),
 'invariant-09-shards-nonspendable':allBundles.every(bundle=>!Object.hasOwn(bundle.ledger.gold,'shards')),
 'invariant-10-exp-nonspendable':allBundles.every(bundle=>!Object.hasOwn(bundle.ledger.gold,'exp')),
 'invariant-11-relic-stones-nonspendable':allBundles.every(bundle=>!Object.hasOwn(bundle.ledger.gold,'relicStones')),
 'invariant-12-rank-exp-nonspendable':allBundles.every(bundle=>!Object.hasOwn(bundle.ledger.gold,'rankExp')),
 'invariant-13-might-nonspendable':allBundles.every(bundle=>!Object.hasOwn(bundle.ledger.gold,'might')),
 'invariant-14-mastery-nonspendable':allBundles.every(bundle=>!Object.hasOwn(bundle.ledger.gold,'mastery')),
 'invariant-15-oath-final':referenceEvaluate({kind:'building',buildingId:'training',level:1,profile:scenarios.buildingProfiles[3]}).formulaOrder.at(-1)==='oathMultiplier',
 'invariant-16-oath-cap':referenceEvaluate({kind:'building',buildingId:'training',level:1,profile:{...scenarios.buildingProfiles[3],oathBoost:.99}}).oathBoost===.30,
 'invariant-17-oath-current-day':crossMidnight.segments.length===2&&crossMidnight.segments[1].values.training/crossMidnight.segments[1].duration<crossMidnight.segments[0].values.training/crossMidnight.segments[0].duration,
 'invariant-18-family-direct-once':familyDirect,
 'invariant-19-fellow-candidate-excludes-companion':candidates.every(bundle=>bundle.power.ending.fellowRows.every(row=>row.economyExcludedTerms.includes('companionPowerTransfer'))),
 'invariant-20-fellow-candidate-excludes-family':candidates.every(bundle=>bundle.power.ending.fellowRows.every(row=>row.economyExcludedTerms.includes('familyBondMultiplier'))),
 'invariant-21-companion-candidate-includes-mastery':candidates.every(bundle=>bundle.power.ending.companionRows.every(row=>row.formulaOrder.includes('mastery')&&row.mastery.multiplier>=1)),
 'invariant-22-roster-powers-disjoint':allBundles.every(bundle=>bundle.power.noDoubleCountProof.disjoint&&bundle.power.ending.noDoubleCountProof.disjoint),
 'invariant-23-released-fellow-order':referenceEvaluate({kind:'fellow-power',fellowId:'lyra',profile:scenarios.fellowPowerProfiles[7]}).formulaOrder.join('|')==='basePower|levelMultiplier|rarityMultiplier|bondMilestoneMultiplier|relicMultiplier|companionPowerTransfer|familyBondMultiplier|globalMightMultiplier|round',
 'invariant-24-released-companion-order':referenceEvaluate({kind:'companion-power',companionId:'cinderwing',profile:scenarios.companionPowerProfiles[7]}).formulaOrder.join('|')==='basePower|levelMultiplier|rarityMultiplier|masteryMultiplier|round',
 'invariant-25-building-rate-monotonic':nondecreasing(scenarios.buildingLevels.map(level=>referenceEvaluate({kind:'building',buildingId:'training',level,profile:scenarios.buildingProfiles[0]}).rate)),
 'invariant-26-upgrade-cost-monotonic':nondecreasing([1,2,3,10,20,30,51].map(level=>referenceEvaluate({kind:'upgrade',level}).cost)),
 'invariant-27-fellow-exp-monotonic':progressionRowsComplete&&progressionAnchorsExact&&nondecreasing([1,2,3,10,50,120].map(level=>referenceEvaluate({kind:'progression',mode:'fellow-exp',level}).threshold)),
 'invariant-28-companion-exp-monotonic':progressionRowsComplete&&progressionAnchorsExact&&nondecreasing([1,2,3,10,50,100].map(level=>referenceEvaluate({kind:'progression',mode:'companion-exp',level}).threshold)),
 'invariant-29-fellow-power-monotonic':referenceEvaluate({kind:'fellow-power',fellowId:'cael',profile:{...scenarios.fellowPowerProfiles[0],level:2}}).effectivePower>=referenceEvaluate({kind:'fellow-power',fellowId:'cael',profile:scenarios.fellowPowerProfiles[0]}).effectivePower,
 'invariant-30-companion-power-monotonic':referenceEvaluate({kind:'companion-power',companionId:'bramble',profile:{...scenarios.companionPowerProfiles[0],level:2}}).effectivePower>=referenceEvaluate({kind:'companion-power',companionId:'bramble',profile:scenarios.companionPowerProfiles[0]}).effectivePower,
 'invariant-31-fellow-curve-capped':allBundles.every(bundle=>bundle.power.ending.fellowBonusBps<=bundle.inputs.config.fellowRosterCurve.capBps),
 'invariant-32-companion-curve-capped':allBundles.every(bundle=>bundle.power.ending.companionBonusBps<=bundle.inputs.config.companionRosterCurve.capBps),
 'invariant-33-campaign-under-zero-discount':campaignUnder.discountRate===0,
 'invariant-34-campaign-at-zero-discount':campaignAt.discountRate===0,
 'invariant-35-campaign-over-monotonic':campaignOver.discountRate>0&&campaignOver.effectiveCost<campaignAt.effectiveCost,
 'invariant-36-campaign-discount-cap':campaignHuge.discountRate===.35,
 'invariant-37-campaign-cost-at-least-one':[campaignUnder,campaignAt,campaignOver,campaignHuge].every(item=>item.effectiveCost>=1),
 'invariant-38-tower-one-hour':RELEASED_CONFIG.tower.intervalMs===3600000,
 'invariant-39-tower-24-hour-cap':RELEASED_CONFIG.tower.elapsedCapMs===86400000&&allBundles.every(bundle=>bundle.idle.receipts.every(receipt=>receipt.tower.settlement.acceptedElapsedMs<=receipt.tower.settlement.capMs)),
 'invariant-40-tower-gold-neutral':allBundles.every(bundle=>bundle.idle.goldNeutral&&bundle.idle.receipts.every(receipt=>receipt.goldGenerated===0))&&!canonicalText(tower8).includes('gold'),
 'invariant-41-expedition-one-hour':RELEASED_CONFIG.expedition.intervalMs===3600000,
 'invariant-42-expedition-24-hour-cap':RELEASED_CONFIG.expedition.elapsedCapMs===86400000&&allBundles.every(bundle=>bundle.idle.receipts.every(receipt=>receipt.expedition.settlement.acceptedElapsedMs<=receipt.expedition.settlement.capMs)),
 'invariant-43-expedition-gold-neutral':allBundles.every(bundle=>bundle.idle.goldNeutral&&bundle.idle.receipts.every(receipt=>receipt.goldGenerated===0))&&!canonicalText(exp8).includes('gold'),
 'invariant-44-family-four-hour':RELEASED_CONFIG.family.rollIntervalMs===14400000&&familyExact.rolls===4,
 'invariant-45-family-gold-neutral':!canonicalText(familyExact).includes('gold')&&allBundles.every(bundle=>bundle.idle.goldNeutral),
 'invariant-46-pity-forced-eighth':Object.values(tower7.companionShards).reduce((a,b)=>a+b,0)===0&&Object.values(tower8.companionShards).reduce((a,b)=>a+b,0)===1&&Object.values(exp7.fellowShards).reduce((a,b)=>a+b,0)===0&&Object.values(exp8.fellowShards).reduce((a,b)=>a+b,0)===1,
 'invariant-47-partial-carry-preserved':towerCarry.intervals===1&&expCarry.intervals===1&&towerCarry.segments[0].elapsedMs===900000&&expCarry.segments[0].elapsedMs===900000&&allBundles.every(bundle=>Object.values(bundle.idle.carryProvenance.family).every(row=>Object.hasOwn(row,'startingContext')&&Object.hasOwn(row,'endingContext')&&Object.hasOwn(row,'startingCarryMs')&&Object.hasOwn(row,'endingCarryMs'))),
 'invariant-48-independent-idle-histories':tower8.intervalOrdinal===8&&exp8.intervalOrdinal===8&&allBundles.every(bundle=>bundle.idle.ending.tower.claimOrdinal>=bundle.idle.starting.tower.claimOrdinal&&bundle.idle.ending.expedition.claimOrdinal>=bundle.idle.starting.expedition.claimOrdinal),
 'invariant-49-no-negative':reportNumbers.every(value=>value>=0),
 'invariant-50-finite-no-nan-or-infinity':reportNumbers.every(Number.isFinite),
 'invariant-51-safe-integers':reportNumbers.every(value=>Math.abs(value)<=Number.MAX_SAFE_INTEGER&&(!Number.isInteger(value)||Number.isSafeInteger(value))),
 'invariant-52-no-double-spend':allBundles.every(bundle=>bundle.ledger.gold.totalSpent===bundle.ledger.gold.fellowCampaignSpent+bundle.ledger.gold.companionCampaignSpent+bundle.ledger.gold.buildingUpgradeSpent&&bundle.ledger.gold.totalSpent<=bundle.ledger.gold.startGold+bundle.ledger.gold.claimedGold&&bundle.ledger.gold.conserved),
 'invariant-53-no-double-reward':rewardMutationsRejected&&allBundles.every(bundle=>bundle.safety.resourceAccounting.noDuplicateRewards&&bundle.safety.resourceAccounting.noLostResources&&bundle.safety.resourceAccounting.campaignNoReplay&&bundle.safety.resourceAccounting.rewardedNonFirstClearReceipts.length===0&&bundle.safety.resourceAccounting.duplicateRewardIds.length===0&&bundle.safety.resourceAccounting.lostResources.length===0&&bundle.safety.resourceAccounting.idleRewardProof.valid&&bundle.safety.resourceAccounting.idleRewardProof.claimSchedule.exact&&bundle.safety.resourceAccounting.idleRewardProof.duplicateCount===0&&bundle.safety.resourceAccounting.idleRewardProof.missingCount===0&&bundle.safety.resourceAccounting.idleRewardProof.unexpectedCount===0&&bundle.safety.resourceAccounting.idleRewardProof.awardsMatch&&bundle.progression.campaign.noReplayProof.valid&&bundle.progression.campaign.noReplayProof.campaignAwardsMatch&&Object.values(bundle.progression.campaign.noReplayProof.lanes).every(lane=>lane.uniqueNaturalIds&&lane.rosterPowerMatches&&lane.blockedZero&&lane.endingMatches&&lane.spendMatches&&lane.postCapNoReceipt)),
 'invariant-54-bounded-steps':allBundles.every(bundle=>Object.values(bundle.safety.stepLimits).every(Boolean)&&bundle.pacing.claimCount<=bundle.inputs.safety.maxClaims&&bundle.pacing.upgradeCount<=bundle.inputs.safety.maxUpgrades&&bundle.pacing.campaignRuns<=bundle.inputs.safety.maxCampaignRuns),
 'invariant-55-fresh-input-cloned':allBundles.filter(bundle=>bundle.metadata.archetypeId==='fresh').every(bundle=>bundle.safety.inputUnchanged),
 'invariant-56-migrated-input-cloned':allBundles.filter(bundle=>bundle.metadata.archetypeId!=='fresh').every(bundle=>bundle.safety.inputUnchanged),
 'invariant-57-same-process-determinism':sameProcess&&sha(canonicalBytes)===sha(secondCanonicalBytes)&&Buffer.byteLength(canonicalBytes)===Buffer.byteLength(secondCanonicalBytes),
 'invariant-58-separate-process-determinism':separateProcess,
 'invariant-59-frozen-report-exact':frozenExact,
 'invariant-60-candidate-label-advisory':candidates.length===108&&released.length===36&&candidates.every(bundle=>bundle.metadata.status==='advisory candidate'&&bundle.metadata.comparisonStatus==='advisory candidate')&&released.every(bundle=>bundle.metadata.status==='released parity'&&bundle.metadata.comparisonStatus==='released parity')&&freshReleased.power.ending.fellowCombatPower===36366&&freshCandidate.power.ending.fellowEconomyPower===35150&&freshCandidate.power.ending.companionEconomyPower===2200&&freshCandidate.power.ending.fellowBonusBps===390&&freshCandidate.power.ending.companionBonusBps===80
};
const invariantIds=registry.categories.find(category=>category.id==='invariants').ids;
if(Object.keys(invariantById).length!==60||!same(Object.keys(invariantById),invariantIds))throw new Error('Invariant implementation/registry mismatch');
for(const id of invariantIds)check(id,invariantById[id]);

const mutationVectors={'building-base':'parity-building-training-l1-unassigned','building-level-multiplier':'parity-building-training-l10-unassigned','upgrade-growth':'parity-upgrade-l10','upgrade-rounding':'parity-upgrade-l3','family-bonus':'parity-building-training-l1-mismatch-medium','oath-order':'parity-building-training-l10-capped-oath','oath-cap':'parity-building-training-l1-capped-oath','offline-cap':'parity-offline-unassigned-over-cap','midnight-segmentation':'parity-offline-capped-oath-cross-midnight','fellow-exp-threshold':'parity-progression-fellow-exp-50','companion-exp-threshold':'parity-progression-companion-exp-50','fellow-power-order':'parity-fellow-lyra-combined','companion-power-order':'parity-companion-cinderwing-combined-cap','relic-placement':'parity-fellow-lyra-combined','companion-transfer':'parity-fellow-cael-companion','family-bond-exclusion':'parity-fellow-lyra-family','might-placement':'parity-fellow-cael-might','mastery-placement':'parity-companion-bramble-mastery-mid','campaign-ceil':'parity-campaign-fellow-4','campaign-cap':'parity-campaign-companion-10','tower-interval-reward':'parity-idle-tower-history-1-8','expedition-interval-reward':'parity-idle-expedition-history-1-8','stable-channel':'parity-progression-stable-a','forced-pity-ordinal':'parity-idle-tower-history-1-8'};
for(const id of registry.categories.find(category=>category.id==='mutation').ids){
 const mutation=id.slice('mutation-'.length),vector=parityVectors.find(item=>item.id===mutationVectors[mutation]),probe=mutationProbe(vector,mutation),expected=golden.parity[vector.id],control=canonical(probe.control),mutated=canonical(probe.mutated),controlDiff=firstDiff(expected,control),mutationDiff=firstDiff(expected,mutated),pathDetected=Boolean(mutationDiff&&(mutationDiff===probe.expectedPath||mutationDiff.startsWith(probe.expectedPath+'/')||probe.expectedPath.startsWith(mutationDiff+'/')));
 check(id,!controlDiff&&Boolean(mutationDiff)&&pathDetected&&['parity-field','ownership-invariant'].includes(probe.failureClass),{vector:vector.id,failureClass:probe.failureClass,expectedPath:probe.expectedPath,controlDiff,mutationDiff});
}

const afterSnapshot=snapshot(),writePreserved=same(beforeSnapshot,afterSnapshot),actualIds=rows.map(row=>row.id),registryExact=same(actualIds,registry.ids);
if(!writePreserved){const row=rows.find(item=>item.id==='static-verifier-no-write');row.pass=false;row.detail='Production, all 203 frozen predecessors, or Phase 10B package bytes changed during verification'}
if(!registryExact){const row=rows.find(item=>item.id==='static-row-registry-version');row.pass=false;row.detail='Executed row order differs from frozen registry'}
const metricsClean=probeMetrics.storageCalls.length===0&&probeMetrics.uiCalls.length===0&&probeMetrics.timerCalls.length===0&&probeMetrics.networkCalls.length===0&&probeMetrics.hooksExposed.length===0&&probeMetrics.restorationExact===true;
if(!metricsClean){const row=rows.find(item=>item.id==='static-production-probe-identity');row.pass=false;row.detail=JSON.stringify(probeMetrics)}
const categoryTotals=Object.fromEntries(registry.categories.map(category=>{const set=new Set(category.ids),categoryRows=rows.filter(row=>set.has(row.id));return[category.id,{total:categoryRows.length,passed:categoryRows.filter(row=>row.pass).length,expected:category.expected}]})),failures=rows.filter(row=>!row.pass);
console.log(JSON.stringify({total:rows.length,passed:rows.length-failures.length,failed:failures.length,registryExact,writePreserved,report:{sha256:sha(canonicalBytes),byteLength:Buffer.byteLength(canonicalBytes),float64Wrappers:wrapperCount(canonicalObject)},probeMetrics,categoryTotals,failures},null,2));
if(rows.length!==624||failures.length)process.exitCode=1;
