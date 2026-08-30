import {createHash} from 'node:crypto';
import {existsSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),QA=resolve(ROOT,'qa/phase-10c2');
const BASE='2901ee49054a75c92af6c810599a54ae6b98b499',HEAD='722e91b80ee1cc8f1c51ff52ebc2f49be8335a88',PROFILE_IDENTITY='6abf706b4450f61a708a0baba5e431a374f8de085fbf614e7334b6071bca534f';
const ARTIFACT={sha256:'cd9efc6946acc31223e4b00fbb5e21aae3d7748fc47a56b0d433c9ab12c2e3ca',byteLength:18972079};
const SOURCE_FILES=['qa/phase-10c2/README.md','qa/phase-10c2/build-contract.mjs','qa/phase-10c2/engine-probe.mjs','qa/phase-10c2/predecessor-excludes','qa/phase-10c2/verify.mjs'];
const DOCS=['docs/PHASE_10C2_EXECUTION.md','docs/PHASE_10C2_RESULT.md'];
const PREDECESSOR=['qa/phase-10c1/checksums.sha256','qa/phase-10c1/current-manifest.json','qa/phase-10c1/schema-probe.mjs','qa/phase-10c1/verify.mjs','qa/phase-10b/scenarios.json','qa/phase-10b/simulate.mjs'];
const CHECKSUM_PATHS=[...DOCS,'index.html',...PREDECESSOR,...SOURCE_FILES,'qa/phase-10c2/current-manifest.json'];
const EXPECTED_NAMES=['README.md','build-contract.mjs','checksums.sha256','current-manifest.json','engine-probe.mjs','predecessor-excludes','verify.mjs'];
const sha=value=>createHash('sha256').update(value).digest('hex'),read=path=>readFileSync(resolve(ROOT,path)),identity=path=>{const raw=read(path);return{sha256:sha(raw),byteLength:raw.length}};
for(const path of [...SOURCE_FILES,...DOCS,...PREDECESSOR,'index.html'])if(!existsSync(resolve(ROOT,path)))throw new Error('Missing Phase 10C-2 input: '+path);
const artifact=identity('index.html');if(JSON.stringify(artifact)!==JSON.stringify(ARTIFACT))throw new Error('Phase 10C-2 builder refuses an unrecognized production artifact');
const names=readdirSync(QA).filter(name=>!['checksums.sha256','current-manifest.json'].includes(name)).sort(),expected=EXPECTED_NAMES.filter(name=>!['checksums.sha256','current-manifest.json'].includes(name));
if(JSON.stringify(names)!==JSON.stringify(expected))throw new Error('Unexpected Phase 10C-2 topology: '+names.join(', '));

if(process.argv.includes('--write')){
 const manifest={manifestVersion:1,phase:'10C-2',status:'ENGINE_QA_READY',baseCommit:BASE,candidateCommit:HEAD,productionChanged:true,browserFiles:false,artifact,selectedProfile:{id:'everstead-economy-v1',identity:PROFILE_IDENTITY},additiveProductionLines:29,privateGoldCoreByteExact:true,embeddedAssets:{count:5,aggregateSha256:'26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a'},engineRows:100,schemaRows:47,predecessorGate:{total:117,passingBehaviorAndAuthorityRows:115,expectedSupersessions:['build-manifest-authority','phase10c1-checksums']},packageFiles:Object.fromEntries(SOURCE_FILES.map(path=>[path,identity(path)])),expectedGate:{focusedCli:'PASS twice',liveBrowser:'DEFERRED TO PHASE 10C-3'}};
 writeFileSync(resolve(QA,'current-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 writeFileSync(resolve(QA,'checksums.sha256'),CHECKSUM_PATHS.map(path=>`${identity(path).sha256}  ${path}`).join('\n')+'\n');
}
for(const name of ['current-manifest.json','checksums.sha256'])if(!existsSync(resolve(QA,name)))throw new Error('Run build-contract.mjs --write to create '+name);
const manifest=JSON.parse(read('qa/phase-10c2/current-manifest.json')),checksumLines=read('qa/phase-10c2/checksums.sha256').toString('utf8').trim().split('\n');
if(manifest.baseCommit!==BASE||manifest.candidateCommit!==HEAD||manifest.selectedProfile.identity!==PROFILE_IDENTITY||checksumLines.length!==CHECKSUM_PATHS.length)throw new Error('Phase 10C-2 manifest/checksum contract drift');
console.log(JSON.stringify({phase:manifest.phase,status:manifest.status,artifact:manifest.artifact,packageFiles:SOURCE_FILES.length,checksumEntries:checksumLines.length,writes:process.argv.includes('--write')?2:0},null,2));
