import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runSchemaCandidate} from '../phase-10c1/schema-probe.mjs';
import {runEngineProbe} from './engine-probe.mjs';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const QA=resolve(ROOT,'qa/phase-10c2');
const BASE='2901ee49054a75c92af6c810599a54ae6b98b499';
const HEAD='722e91b80ee1cc8f1c51ff52ebc2f49be8335a88';
const BASE_ARTIFACT={sha256:'1eee527d2515ccc4195d94df2ae13bb9935b3e4982302cd48206cfe359ea7aa1',byteLength:18964625};
const ARTIFACT={sha256:'cd9efc6946acc31223e4b00fbb5e21aae3d7748fc47a56b0d433c9ab12c2e3ca',byteLength:18972079,assetCount:5,assetAggregate:'26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a'};
const PROFILE_IDENTITY='6abf706b4450f61a708a0baba5e431a374f8de085fbf614e7334b6071bca534f';
const PRIVATE_CORE={sha256:'6c309bc7e4a7e28e8336c29f2fea4366d47bf89642afabbf5abe6d0bb985ef8b',byteLength:10630};
const EXPECTED_NAMES=['README.md','build-contract.mjs','checksums.sha256','current-manifest.json','engine-probe.mjs','predecessor-excludes','verify.mjs'];
const OWNED_DOCS=['docs/PHASE_10C2_EXECUTION.md','docs/PHASE_10C2_RESULT.md'];
const results=[];
const record=(id,pass,detail='')=>results.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const sha=value=>createHash('sha256').update(value).digest('hex');
const read=path=>readFileSync(resolve(ROOT,path));
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);

const source=read('index.html'),sourceText=source.toString('utf8'),baseSource=execFileSync('git',['show',`${BASE}:index.html`],{cwd:ROOT,encoding:'utf8',maxBuffer:32*1024*1024,timeout:30000});
const sourceIdentity={sha256:sha(source),byteLength:source.length},baseIdentity={sha256:sha(Buffer.from(baseSource)),byteLength:Buffer.byteLength(baseSource)};
record('exact-candidate-head',execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim()===HEAD);
record('exact-current-artifact',same(sourceIdentity,{sha256:ARTIFACT.sha256,byteLength:ARTIFACT.byteLength}),sourceIdentity);
record('exact-base-artifact',same(baseIdentity,BASE_ARTIFACT),baseIdentity);
const assets=[...sourceText.matchAll(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g)].map(match=>match[0]),assetAggregate=sha(Buffer.from(assets.join('\n')));
record('five-assets-byte-frozen',assets.length===ARTIFACT.assetCount&&assetAggregate===ARTIFACT.assetAggregate,`${assets.length} · ${assetAggregate}`);

const committedPaths=execFileSync('git',['diff','--name-only',`${BASE}..${HEAD}`],{cwd:ROOT,encoding:'utf8'}).trim().split('\n').filter(Boolean),numstat=execFileSync('git',['diff','--numstat',`${BASE}..${HEAD}`,'--','index.html'],{cwd:ROOT,encoding:'utf8'}).trim();
record('bounded-commit-path',same(committedPaths,['index.html']),committedPaths);
record('additive-29-line-production-block',numstat==='29\t0\tindex.html',numstat);
const marker='\n/* Phase 10C-2 · activated economy rates and transition-safe offline accrual. */',start=sourceText.indexOf(marker),resume=sourceText.indexOf("\naddEventListener('storage',event=>{if(!NATIVE_STORAGE||event.storageArea!==NATIVE_STORAGE||event.key!==PRE_V11_BACKUP_KEY",start),reconstructed=start>=0&&resume>start?sourceText.slice(0,start)+sourceText.slice(resume+1):'';
record('single-phase10c2-block',[...sourceText.matchAll(/\/\* Phase 10C-2 · activated economy rates and transition-safe offline accrual\. \*\//g)].length===1,`${start} · ${resume}`);
record('additive-block-removal-reconstructs-base',reconstructed===baseSource,`${sha(Buffer.from(reconstructed))} · ${baseIdentity.sha256}`);
const coreStart='\tconst PHASE_TEN_B_TWO_GOLD_CORE=(()=>{',coreEnd='\tp10b2AssertSurface(PHASE_TEN_B_TWO_GOLD_CORE);';
const core=value=>{const from=value.indexOf(coreStart),to=value.indexOf(coreEnd,from);return from>=0&&to>from?value.slice(from,to+coreEnd.length):''},currentCore=core(sourceText),baseCore=core(baseSource);
record('phase10b2-private-core-byte-exact',currentCore===baseCore&&sha(Buffer.from(currentCore))===PRIVATE_CORE.sha256&&Buffer.byteLength(currentCore)===PRIVATE_CORE.byteLength,{sha256:sha(Buffer.from(currentCore)),byteLength:Buffer.byteLength(currentCore)});

record('phase-package-topology',same(readdirSync(QA).sort(),EXPECTED_NAMES),readdirSync(QA).sort());
record('no-live-browser-files',!readdirSync(QA).some(name=>/^(index\.html|realm|runner)/.test(name)));
record('execution-and-result-docs-present',OWNED_DOCS.every(path=>existsSync(resolve(ROOT,path))));
const changed=execFileSync('git',['diff','--name-only',BASE,'--'],{cwd:ROOT,encoding:'utf8'}).trim().split('\n').filter(Boolean),untracked=execFileSync('git',['ls-files','--others','--exclude-standard'],{cwd:ROOT,encoding:'utf8'}).trim().split('\n').filter(Boolean),touched=[...new Set([...changed,...untracked])].sort(),owned=path=>path==='index.html'||path.startsWith('qa/phase-10c2/')||OWNED_DOCS.includes(path);
record('phase-owned-paths-only',touched.length>0&&touched.every(owned),touched);

const schema=await runSchemaCandidate(),schemaFailures=schema.rows.filter(row=>!row.pass);
record('phase10c1-schema-probe-47-of-47',schema.rows.length===47&&schemaFailures.length===0,schemaFailures);
record('schema11-profile-authority',schema.evidence.freshGold===50000&&schema.evidence.profileIdentity===PROFILE_IDENTITY&&schema.evidence.migrationBlocked===null&&schema.evidence.nativeStorageCalls===0,schema.evidence);
const excludePath=resolve(QA,'predecessor-excludes'),predecessor=spawnSync(process.execPath,['qa/phase-10c1/verify.mjs'],{cwd:ROOT,encoding:'utf8',maxBuffer:16*1024*1024,env:{...process.env,GIT_CONFIG_COUNT:'1',GIT_CONFIG_KEY_0:'core.excludesFile',GIT_CONFIG_VALUE_0:excludePath}});
let predecessorJson=null;try{predecessorJson=JSON.parse(predecessor.stdout)}catch{}
const predecessorFailures=predecessorJson?.results?.filter(row=>!row.pass).map(row=>row.id).sort()??[];
record('phase10c1-frozen-gate-expected-supersessions',predecessor.status===1&&predecessorJson?.total===117&&predecessorJson?.passed===115&&predecessorJson?.failed===2&&same(predecessorFailures,['build-manifest-authority','phase10c1-checksums']),{status:predecessor.status,total:predecessorJson?.total,passed:predecessorJson?.passed,failed:predecessorJson?.failed,failures:predecessorFailures,stderr:predecessor.stderr});
const c1ChecksumRows=read('qa/phase-10c1/checksums.sha256').toString('utf8').trim().split('\n').map(line=>line.match(/^([0-9a-f]{64})  (.+)$/)).filter(Boolean),c1Mismatches=c1ChecksumRows.filter(match=>!existsSync(resolve(ROOT,match[2]))||sha(read(match[2]))!==match[1]).map(match=>match[2]);
record('phase10c1-checksums-only-artifact-superseded',c1ChecksumRows.length===17&&same(c1Mismatches,['index.html']),c1Mismatches);

const engine=await runEngineProbe(),engineFailures=engine.rows.filter(row=>!row.pass);
for(const row of engine.rows)record(`engine-${row.id}`,row.pass,row.detail);
record('engine-focused-100-of-100',engine.rows.length===100&&engineFailures.length===0,engineFailures);
record('engine-profile-and-storage-evidence',engine.evidence.profileIdentity===PROFILE_IDENTITY&&engine.evidence.nativeStorageCalls===0&&engine.evidence.fresh.gold===50000&&engine.evidence.fresh.fellowPower===35150&&engine.evidence.fresh.companionPower===2200&&Object.is(engine.evidence.fresh.totalRate,27320.8092192),engine.evidence);

const manifest=JSON.parse(read('qa/phase-10c2/current-manifest.json'));
record('build-manifest-authority',manifest.phase==='10C-2'&&manifest.status==='ENGINE_QA_READY'&&manifest.baseCommit===BASE&&manifest.candidateCommit===HEAD&&manifest.productionChanged===true&&manifest.browserFiles===false&&manifest.selectedProfile.identity===PROFILE_IDENTITY&&same(manifest.artifact,sourceIdentity)&&manifest.additiveProductionLines===29&&manifest.engineRows===100&&manifest.schemaRows===47,manifest);
const packagePaths=Object.keys(manifest.packageFiles),manifestFailures=packagePaths.filter(path=>{const raw=read(path),entry=manifest.packageFiles[path];return sha(raw)!==entry.sha256||raw.length!==entry.byteLength});
record('build-manifest-package-identities',packagePaths.length===5&&manifestFailures.length===0,manifestFailures);
const checksumRows=read('qa/phase-10c2/checksums.sha256').toString('utf8').trim().split('\n'),checksumFailures=[];
for(const line of checksumRows){const match=line.match(/^([0-9a-f]{64})  (.+)$/);if(!match||!existsSync(resolve(ROOT,match[2]))||sha(read(match[2]))!==match[1])checksumFailures.push(match?.[2]||line)}
record('phase10c2-checksums',checksumRows.length===15&&checksumFailures.length===0,checksumFailures);

const passed=results.filter(row=>row.pass).length,failed=results.length-passed;
console.log(JSON.stringify({phase:'10C-2',status:failed?'FAIL':'PASS',baseCommit:BASE,candidateCommit:HEAD,artifact:{...sourceIdentity,assetAggregate},selectedProfile:{id:'everstead-economy-v1',identity:PROFILE_IDENTITY},engineEvidence:engine.evidence,schemaRows:schema.rows.length,predecessor:{total:predecessorJson?.total,passed:predecessorJson?.passed,failed:predecessorJson?.failed,failures:predecessorFailures},total:results.length,passed,failed,results},null,2));
if(failed)process.exitCode=1;
