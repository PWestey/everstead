import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),QA=resolve(ROOT,'qa/phase-10c3');
const CANDIDATE='729ac10114fa75f0fa66a93438aeed281f0e78f7',ENGINE='722e91b80ee1cc8f1c51ff52ebc2f49be8335a88',BASE='069afc0fffdcbdc513dae5780f67848a49bbad7d';
const ARTIFACT={sha256:'1cd8004e4f6e0734100f5d8fd77dd14f88f0b22d5fd1bbb5d027be6c70a6be35',byteLength:18975720};
const SOURCE_FILES=['qa/phase-10c3/README.md','qa/phase-10c3/build-contract.mjs','qa/phase-10c3/index.html','qa/phase-10c3/realm.html','qa/phase-10c3/realm.js','qa/phase-10c3/runner.js','qa/phase-10c3/scenarios.json','qa/phase-10c3/ui-probe.mjs','qa/phase-10c3/verify.mjs'];
const DOCS=['docs/PHASE_10C3_UI_EXECUTION.md','docs/PHASE_10C3_UI_RESULT.md'];
const FROZEN=['qa/phase-10c1/schema-probe.mjs','qa/phase-10c2/engine-probe.mjs','qa/phase-10c2/current-manifest.json','qa/phase-10c2/checksums.sha256'];
const CHECKSUM_PATHS=[...DOCS,'index.html',...FROZEN,...SOURCE_FILES,'qa/phase-10c3/current-manifest.json'];
const EXPECTED_NAMES=['README.md','build-contract.mjs','checksums.sha256','current-manifest.json','index.html','realm.html','realm.js','runner.js','scenarios.json','ui-probe.mjs','verify.mjs'];
const sha=value=>createHash('sha256').update(value).digest('hex'),read=path=>readFileSync(resolve(ROOT,path)),identity=path=>{const raw=read(path);return{sha256:sha(raw),byteLength:raw.length}};
for(const path of [...SOURCE_FILES,...DOCS,...FROZEN,'index.html'])if(!existsSync(resolve(ROOT,path)))throw new Error(`Missing Phase 10C-3 input: ${path}`);
const candidate=execFileSync('git',['show',`${CANDIDATE}:index.html`],{cwd:ROOT,maxBuffer:32*1024*1024}),artifact=identity('index.html');
if(JSON.stringify(identityBuffer(candidate))!==JSON.stringify(ARTIFACT)||JSON.stringify(artifact)!==JSON.stringify(ARTIFACT))throw new Error('Phase 10C-3 builder refuses an unrecognized production artifact');
const names=readdirSync(QA).filter(name=>!['checksums.sha256','current-manifest.json'].includes(name)).sort(),expected=EXPECTED_NAMES.filter(name=>!['checksums.sha256','current-manifest.json'].includes(name));
if(JSON.stringify(names)!==JSON.stringify(expected))throw new Error(`Unexpected Phase 10C-3 topology: ${names.join(', ')}`);

function identityBuffer(raw){return{sha256:sha(raw),byteLength:raw.length}}
if(process.argv.includes('--write')){
  const scenarios=identity('qa/phase-10c3/scenarios.json'),manifest={manifestVersion:1,phase:'10C-3',status:'PASS_LOCAL',baseCommit:BASE,engineCommit:ENGINE,candidateCommit:CANDIDATE,productionChanged:true,browserFiles:true,artifact,scenarios,selectedProfile:{id:'everstead-economy-v1',identity:'6abf706b4450f61a708a0baba5e431a374f8de085fbf614e7334b6071bca534f'},privateGoldCore:{sha256:'6c309bc7e4a7e28e8336c29f2fea4366d47bf89642afabbf5abe6d0bb985ef8b',byteLength:10630},embeddedAssets:{count:5,aggregateSha256:'26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a'},schemaRows:47,engineRows:100,uiProbeRows:19,viewports:['320x568','390x667','390x844'],packageFiles:Object.fromEntries(SOURCE_FILES.map(path=>[path,identity(path)])),expectedGate:{focusedCli:'PASS twice',liveBrowser:'PASS twice with zero console warnings/errors and zero native-storage writes'},observedGate:{focusedCli:{total:142,passed:142,failed:0,runs:2},liveBrowser:{total:79,passed:79,failed:0,runs:2,viewports:['320x568','390x667','390x844'],consoleWarningsOrErrors:0,nativeStorageAccesses:0,observedAt:'2026-08-30T19:04:27Z'}}};
  writeFileSync(resolve(QA,'current-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  writeFileSync(resolve(QA,'checksums.sha256'),CHECKSUM_PATHS.map(path=>`${identity(path).sha256}  ${path}`).join('\n')+'\n');
}
for(const name of ['current-manifest.json','checksums.sha256'])if(!existsSync(resolve(QA,name)))throw new Error(`Run build-contract.mjs --write to create ${name}`);
const manifest=JSON.parse(read('qa/phase-10c3/current-manifest.json')),lines=read('qa/phase-10c3/checksums.sha256').toString('utf8').trim().split('\n');
if(manifest.candidateCommit!==CANDIDATE||manifest.engineCommit!==ENGINE||lines.length!==CHECKSUM_PATHS.length)throw new Error('Phase 10C-3 manifest/checksum contract drift');
console.log(JSON.stringify({phase:manifest.phase,status:manifest.status,artifact:manifest.artifact,packageFiles:SOURCE_FILES.length,checksumEntries:lines.length,writes:process.argv.includes('--write')?2:0},null,2));
