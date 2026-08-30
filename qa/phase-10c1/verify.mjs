import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {simulateBundle} from '../phase-10b/simulate.mjs';
import {runSchemaCandidate} from './schema-probe.mjs';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const QA=resolve(ROOT,'qa/phase-10c1');
const BASE='56b99f86a95f95fd1822da0331204f5d8ea33656';
const PROFILE_IDENTITY='6abf706b4450f61a708a0baba5e431a374f8de085fbf614e7334b6071bca534f';
const ARTIFACT={sha256:'40a1b21c62745d7b3c96fc4c2bea7ee56763a109a40b3535178277e26aca19fd',byteLength:18933604,assetCount:5,assetAggregate:'26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a'};
const PHASE_TEN_B={checksums:'4926ee6438a21947312ee37e0747c49949be4abaa46764c4dff5f5b9de595ca4',scenario:'89b2a717058e64f533aeafe8fa0c64df02de3d278b98a3f7269eb814c430e8d0',simulator:'e56082005c5e10112628c214ba09a3838216e46b5c16e4dfe26303e0d47110dc',report:'5d7e0f0b81d8e9362e15031480c363f80ee098ef7c7d2deef69c35db7f448e51',reportIdentity:'d763aeb9cf263b007731b1a8cb2003da7b64978e927bed21368921b4a8c758be',historicalArtifact:'717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed'};
const EXPECTED_NAMES=['README.md','build-contract.mjs','checksums.sha256','current-manifest.json','profile.json','schema-probe.mjs','vectors.json','verify.mjs'];
const OWNED_PREFIXES=['docs/PHASE_10C1_ECONOMY_ACTIVATION_CONTRACT.md','docs/PHASE_10C1_EXECUTION.md'];
const results=[];
const record=(id,pass,detail='')=>results.push({id,pass:Boolean(pass),detail:String(detail)});
const sha=value=>createHash('sha256').update(value).digest('hex');
const read=path=>readFileSync(resolve(ROOT,path));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const ordinary=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)===Object.prototype;
const exactKeys=(value,keys)=>ordinary(value)&&same(Object.keys(value),keys);

const source=read('index.html');
const sourceText=source.toString('utf8');
const sourceIdentity={sha256:sha(source),byteLength:source.length};
const exactPreimage=sourceIdentity.sha256===ARTIFACT.sha256&&sourceIdentity.byteLength===ARTIFACT.byteLength;
const schemaCandidate=sourceText.includes('CURRENT_SCHEMA_VERSION=11')&&sourceText.includes("id:'everstead-economy-v1'")&&sourceText.includes(PROFILE_IDENTITY);
const MODE=exactPreimage?'PREIMAGE':schemaCandidate?'SCHEMA_CANDIDATE':'UNKNOWN';
const baseSource=execFileSync('git',['show',`${BASE}:index.html`],{cwd:ROOT,encoding:'utf8',maxBuffer:32*1024*1024,timeout:30000});
const assetMatches=[...sourceText.matchAll(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g)].map(match=>match[0]);
const assetAggregate=sha(Buffer.from(assetMatches.join('\n')));
record('recognized-artifact-mode',MODE!=='UNKNOWN',`${MODE} · ${sourceIdentity.sha256} · ${sourceIdentity.byteLength}`);
record('base-artifact-authority',sha(Buffer.from(baseSource))===ARTIFACT.sha256&&Buffer.byteLength(baseSource)===ARTIFACT.byteLength,`${sha(Buffer.from(baseSource))} · ${Buffer.byteLength(baseSource)}`);
record('exact-five-asset-preimage',assetMatches.length===ARTIFACT.assetCount&&assetAggregate===ARTIFACT.assetAggregate,`${assetMatches.length} · ${assetAggregate}`);
record('current-schema-by-mode',MODE==='PREIMAGE'?sourceText.includes('CURRENT_SCHEMA_VERSION=10')&&!sourceText.includes('CURRENT_SCHEMA_VERSION=11'):MODE==='SCHEMA_CANDIDATE'&&sourceText.includes('CURRENT_SCHEMA_VERSION=11'),MODE);
const slots=['NS','RAW_BACKUP_KEY','PRE_V2_BACKUP_KEY','PRE_V3_BACKUP_KEY','PRE_V4_BACKUP_KEY','PRE_V5_BACKUP_KEY','PRE_V6_BACKUP_KEY','PRE_V7_BACKUP_KEY','PRE_V8_BACKUP_KEY','PRE_V9_BACKUP_KEY','PRE_V10_BACKUP_KEY','STAGING_KEY'];
const expectedSlots=MODE==='SCHEMA_CANDIDATE'?[...slots.slice(0,-1),'PRE_V11_BACKUP_KEY','STAGING_KEY']:slots;
record('protected-slot-identifiers-by-mode',expectedSlots.every(name=>sourceText.includes(name))&&expectedSlots.length===(MODE==='SCHEMA_CANDIDATE'?13:12),expectedSlots.length);
record('released-rates-and-hooks-still-production',sourceText.includes('upgradeGrowth:1.7')&&sourceText.includes('fellowRoster:0,companionRoster:0,overallDay:0'));
record('selected-profile-presence-by-mode',MODE==='PREIMAGE'?!sourceText.includes('everstead-economy-v1')&&!sourceText.includes(PROFILE_IDENTITY):MODE==='SCHEMA_CANDIDATE'&&sourceText.includes("id:'everstead-economy-v1'")&&sourceText.includes(PROFILE_IDENTITY));
if(MODE==='SCHEMA_CANDIDATE'){
  const marker='\n/* Phase 10C-1 · schema-11 economy-profile authority and thirteen-slot persistence. */',start=sourceText.indexOf(marker),resume=sourceText.indexOf('\nconst report=load();',start);
  let preexisting=start>=0&&resume>start?sourceText.slice(0,start)+sourceText.slice(resume+1):'';
  preexisting=preexisting.replaceAll('![10,11].includes(S?.schemaVersion)','S?.schemaVersion!==10').replaceAll('![10,11].includes(state?.schemaVersion)','state?.schemaVersion!==10').replaceAll('[10,11].includes(S?.schemaVersion)','S?.schemaVersion===10');
  record('schema-candidate-additive-preexisting-source',preexisting===baseSource,`${sha(Buffer.from(preexisting))} · ${sha(Buffer.from(baseSource))}`);
  const broadened=[...sourceText.matchAll(/!?\[10,11\]\.includes\((?:S|state)\?\.schemaVersion\)/g)].length;
  record('schema-candidate-compatibility-guards-only',broadened===17,broadened);
}
record('phase-package-topology',same(readdirSync(QA).sort(),EXPECTED_NAMES),readdirSync(QA).sort().join(','));
record('no-live-browser-files',!readdirSync(QA).some(name=>/^(index\.html|realm|runner)/.test(name)));
record('contract-and-execution-present',OWNED_PREFIXES.every(path=>existsSync(resolve(ROOT,path))));
const changed=execFileSync('git',['diff','--name-only',BASE,'--'],{cwd:ROOT,encoding:'utf8'}).trim().split('\n').filter(Boolean);
const untracked=execFileSync('git',['ls-files','--others','--exclude-standard'],{cwd:ROOT,encoding:'utf8'}).trim().split('\n').filter(Boolean);
const touched=[...new Set([...changed,...untracked])].sort();
const owned=path=>OWNED_PREFIXES.includes(path)||path.startsWith('qa/phase-10c1/')||(MODE==='SCHEMA_CANDIDATE'&&path==='index.html');
record('phase-owned-paths-only',touched.length>0&&touched.every(owned),touched.join(','));
record('production-path-mode-consistent',MODE==='PREIMAGE'?!touched.includes('index.html'):MODE==='SCHEMA_CANDIDATE'&&touched.includes('index.html'));

const profile=JSON.parse(read('qa/phase-10c1/profile.json'));
const canonicalProfile='{"id":"everstead-economy-v1","freshGold":50000,"upgradeGrowth":1.24,"fellowRoster":{"numeratorBps":1500,"kneePower":100000,"capBps":1500},"companionRoster":{"numeratorBps":1000,"kneePower":25000,"capBps":1000}}';
record('profile-exact-shape',exactKeys(profile,['id','freshGold','upgradeGrowth','fellowRoster','companionRoster'])&&exactKeys(profile.fellowRoster,['numeratorBps','kneePower','capBps'])&&exactKeys(profile.companionRoster,['numeratorBps','kneePower','capBps']));
record('profile-canonical-json',JSON.stringify(profile)===canonicalProfile,JSON.stringify(profile));
record('profile-identity',sha(Buffer.from(canonicalProfile))===PROFILE_IDENTITY,sha(Buffer.from(canonicalProfile)));
record('profile-selected-constants',profile.id==='everstead-economy-v1'&&profile.freshGold===50000&&profile.upgradeGrowth===1.24&&same(profile.fellowRoster,{numeratorBps:1500,kneePower:100000,capBps:1500})&&same(profile.companionRoster,{numeratorBps:1000,kneePower:25000,capBps:1000}));
const contract=read('docs/PHASE_10C1_ECONOMY_ACTIVATION_CONTRACT.md').toString('utf8');
record('contract-freezes-canonical-profile',contract.includes(canonicalProfile)&&contract.includes(PROFILE_IDENTITY));

const vectors=JSON.parse(read('qa/phase-10c1/vectors.json'));
record('vector-header',vectors.vectorVersion===1&&vectors.phase==='10C-1-preimage'&&vectors.profileIdentity===PROFILE_IDENTITY);
const arithmeticCost=level=>Math.round(vectors.upgrade.base*Math.pow(vectors.upgrade.growth,level-1));
for(const item of vectors.upgrade.cases)record(`upgrade-level-${item.level}`,arithmeticCost(item.level)===item.arithmeticCost&&item.upgradeAvailable===(item.level<vectors.upgrade.levelCap),`${arithmeticCost(item.level)} · ${item.upgradeAvailable}`);
const curveBps=(power,curve)=>Math.min(curve.capBps,Math.floor(curve.numeratorBps*power/(power+curve.kneePower)));
for(const [name,curve] of Object.entries(vectors.curves))for(const item of curve.cases)record(`${name}-curve-${item.power}`,Number.isSafeInteger(item.power)&&curveBps(item.power,curve)===item.bps,curveBps(item.power,curve));
const fresh=vectors.freshRate;
record('fresh-power-and-bps',curveBps(fresh.fellowEconomyPower,vectors.curves.fellow)===fresh.fellowBonusBps&&curveBps(fresh.companionEconomyPower,vectors.curves.companion)===fresh.companionBonusBps);
const rosterMultiplier=(1+fresh.fellowBonusBps/10000)*(1+fresh.companionBonusBps/10000);
record('fresh-roster-multiplier',Object.is(rosterMultiplier,fresh.combinedRosterMultiplier),rosterMultiplier);
const computedRates={};
for(const id of fresh.buildingOrder){const row=fresh.buildings[id];computedRates[id]=row.base*row.familyMultiplier*rosterMultiplier;record(`fresh-rate-${id}`,Object.is(computedRates[id],row.rate),computedRates[id])}
const totalRate=fresh.buildingOrder.reduce((sum,id)=>sum+computedRates[id],0);
record('fresh-total-rate',Object.is(totalRate,fresh.totalRate),totalRate);
record('fresh-direct-24-hour-output',Object.is(totalRate*24,fresh.direct24HourOutput),totalRate*24);
record('fresh-oath-cap-final',Object.is(computedRates.training*1.30,fresh.trainingAtOathCap),computedRates.training*1.30);

record('phase10b-checksum-manifest-identity',sha(read('qa/phase-10b/checksums.sha256'))===PHASE_TEN_B.checksums,sha(read('qa/phase-10b/checksums.sha256')));
const oldChecksumLines=read('qa/phase-10b/checksums.sha256').toString('utf8').trim().split('\n').map(line=>{const match=line.match(/^([0-9a-f]{64})  (.+)$/);return match?{expected:match[1],path:match[2]}:null});
record('phase10b-checksum-shape',oldChecksumLines.length===22&&oldChecksumLines.every(Boolean),oldChecksumLines.length);
const historicalArtifactRow=oldChecksumLines.find(item=>item?.path==='index.html');
record('phase10b-historical-artifact-evidence',historicalArtifactRow?.expected===PHASE_TEN_B.historicalArtifact,historicalArtifactRow?.expected);
const frozenRows=oldChecksumLines.filter(item=>item.path!=='index.html');
const frozenFailures=frozenRows.filter(item=>!existsSync(resolve(ROOT,item.path))||sha(read(item.path))!==item.expected).map(item=>item.path);
record('phase10b-frozen-evidence-21-of-21',frozenRows.length===21&&frozenFailures.length===0,frozenFailures.join(','));
record('phase10b-scenario-identity',sha(read('qa/phase-10b/scenarios.json'))===PHASE_TEN_B.scenario);
record('phase10b-simulator-identity',sha(read('qa/phase-10b/simulate.mjs'))===PHASE_TEN_B.simulator);
record('phase10b-report-identity',sha(read('qa/phase-10b/current-report.json'))===PHASE_TEN_B.report);
const phaseTenBManifest=JSON.parse(read('qa/phase-10b/current-manifest.json'));
record('phase10b-accepted-manifest',phaseTenBManifest.phase==='10B-1'&&phaseTenBManifest.inputs.canonicalReport.sha256===PHASE_TEN_B.report&&phaseTenBManifest.deterministicEvidence.status==='PASS'&&phaseTenBManifest.executableCoverage.advisoryBundleRows===144);
record('phase10b-result-report-identity',read('docs/PHASE_10B_RESULT.md').toString('utf8').includes(PHASE_TEN_B.reportIdentity));

const scenarios=JSON.parse(read('qa/phase-10b/scenarios.json'));
const selected=scenarios.simulation.configs.find(item=>item.id==='candidate-growth-124');
record('selected-profile-matches-advisory-preimage',Boolean(selected)&&selected.freshGold===profile.freshGold&&selected.upgradeGrowth===profile.upgradeGrowth&&same(selected.fellowRosterCurve,{enabled:true,...profile.fellowRoster})&&same(selected.companionRosterCurve,{enabled:true,...profile.companionRoster}));
const expected=vectors.phaseTenBSimulator,bundle=simulateBundle(scenarios,expected.configId,expected.archetypeId,expected.horizonId),bundleAgain=simulateBundle(scenarios,expected.configId,expected.archetypeId,expected.horizonId);
record('selected-bundle-byte-deterministic',bundle.identity===bundleAgain.identity&&same(bundle,bundleAgain),bundle.identity);
record('selected-bundle-identity',bundle.identity===expected.bundleIdentity,bundle.identity);
record('selected-bundle-power-ownership',bundle.power.starting.fellowEconomyPower===fresh.fellowEconomyPower&&bundle.power.starting.companionEconomyPower===fresh.companionEconomyPower&&bundle.power.starting.fellowBonusBps===fresh.fellowBonusBps&&bundle.power.starting.companionBonusBps===fresh.companionBonusBps&&bundle.power.starting.noDoubleCountProof.disjoint===true);
const gold=bundle.ledger.gold;
record('selected-bundle-gold-vector',Object.is(gold.buildingGeneratedTotal,expected.buildingGeneratedTotal)&&gold.claimedGold===expected.claimedGold&&gold.fellowCampaignSpent===expected.fellowCampaignSpent&&gold.companionCampaignSpent===expected.companionCampaignSpent&&gold.buildingUpgradeSpent===expected.buildingUpgradeSpent&&gold.totalSpent===expected.totalSpent&&gold.endGold===expected.endGold&&Object.is(gold.pendingEnd,expected.pendingEnd)&&gold.conserved===true);
record('selected-bundle-upgrade-vector',bundle.pacing.upgradeCount===expected.upgradeCount&&same(bundle.buildings.endingLevels,expected.endingLevels));
let safeSelected=0;
for(const archetype of scenarios.simulation.archetypes)for(const horizon of scenarios.simulation.horizons){const item=simulateBundle(scenarios,'candidate-growth-124',archetype.id,horizon.id);if(item.metadata.comparisonStatus==='advisory candidate'&&item.safety.finite&&item.safety.safe&&item.safety.nonnegative&&item.safety.sourceSinkConserved&&item.safety.noDoubleCount&&item.safety.familyDirectOnce&&item.safety.resourceAccounting.noDuplicateRewards&&item.safety.resourceAccounting.noLostResources)safeSelected++}
record('selected-phase10b-bundles-36-of-36',safeSelected===36,safeSelected);

for(const [phase,path,expectedCount] of [['phase-9','qa/phase-9/checksums.sha256',14],['phase-10b2','qa/phase-10b2/checksums.sha256',19],['phase-10b3','qa/phase-10b3/checksums.sha256',12]]){
  const lines=read(path).toString('utf8').trim().split('\n').map(line=>line.match(/^([0-9a-f]{64})  (.+)$/)).filter(Boolean),mismatches=lines.filter(match=>!existsSync(resolve(ROOT,match[2]))||sha(read(match[2]))!==match[1]).map(match=>match[2]);
  record(`${phase}-expected-artifact-supersession`,lines.length===expectedCount&&same(mismatches,['index.html']),`${lines.length} · ${mismatches.join(',')}`);
}

let schemaEvidence=null;
if(MODE==='SCHEMA_CANDIDATE'){
  const schemaGate=await runSchemaCandidate();
  for(const row of schemaGate.rows)record(`schema-${row.id}`,row.pass,row.detail);
  schemaEvidence=schemaGate.evidence;
}else record('schema-candidate-probe-deferred',MODE==='PREIMAGE',MODE);

const manifest=JSON.parse(read('qa/phase-10c1/current-manifest.json'));
const expectedStatus=MODE==='SCHEMA_CANDIDATE'?'SCHEMA_CANDIDATE_QA_READY':'PREIMAGE_QA_READY';
record('build-manifest-authority',manifest.phase==='10C-1'&&manifest.mode===MODE&&manifest.status===expectedStatus&&manifest.baseCommit===BASE&&manifest.productionChanged===(MODE==='SCHEMA_CANDIDATE')&&manifest.browserFiles===false&&manifest.selectedProfile.identity===PROFILE_IDENTITY&&manifest.artifact.sha256===sourceIdentity.sha256&&manifest.artifact.byteLength===sourceIdentity.byteLength&&manifest.artifact.schemaVersion===(MODE==='SCHEMA_CANDIDATE'?11:10)&&manifest.artifact.protectedSlots===(MODE==='SCHEMA_CANDIDATE'?13:12),manifest.mode);
const packagePaths=Object.keys(manifest.packageFiles);
const manifestFailures=packagePaths.filter(path=>{const raw=read(path),entry=manifest.packageFiles[path];return sha(raw)!==entry.sha256||raw.length!==entry.byteLength});
record('build-manifest-package-identities',packagePaths.length===6&&manifestFailures.length===0,manifestFailures.join(','));
const checksumLines=read('qa/phase-10c1/checksums.sha256').toString('utf8').trim().split('\n'),checksumFailures=[];
for(const line of checksumLines){const match=line.match(/^([0-9a-f]{64})  (.+)$/);if(!match||!existsSync(resolve(ROOT,match[2]))||sha(read(match[2]))!==match[1])checksumFailures.push(match?.[2]||line)}
record('phase10c1-checksums',checksumLines.length===17&&checksumFailures.length===0,checksumFailures.join(','));

const passed=results.filter(item=>item.pass).length,failed=results.length-passed;
console.log(JSON.stringify({phase:'10C-1',mode:MODE,artifact:{...sourceIdentity,assetAggregate},selectedProfile:{id:profile.id,identity:PROFILE_IDENTITY},phaseTenBSelectedBundles:safeSelected,schemaEvidence,total:results.length,passed,failed,results},null,2));
if(failed)process.exitCode=1;
