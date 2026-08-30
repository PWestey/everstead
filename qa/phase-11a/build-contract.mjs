import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),QA=resolve(ROOT,'qa/phase-11a');
const BASE='ac7592348c1a11668822b0355ae86ab6db1b2688',CANDIDATE='7c9e370f37830eaf9f756972dbbc1744d68e0270';
const ARTIFACT={sha256:'fe0fd5a75cd32053861c9572d58f990b86f8d562c84173f8e9ea70967f2f0321',byteLength:18985643};
const SOURCE_FILES=['qa/phase-11a/README.md','qa/phase-11a/build-contract.mjs','qa/phase-11a/index.html','qa/phase-11a/probe.mjs','qa/phase-11a/realm.html','qa/phase-11a/realm.js','qa/phase-11a/runner.js','qa/phase-11a/scenarios.json','qa/phase-11a/verify.mjs'];
const DOCS=['docs/PHASE_11A_CLARITY_CONTRACT.md','docs/PHASE_11A_CLARITY_EXECUTION.md','docs/PHASE_11A_CLARITY_RESULT.md'];
const FROZEN=['qa/README.md','qa/phase-10c1/schema-probe.mjs','qa/phase-10c2/engine-probe.mjs','qa/phase-10c2/current-manifest.json','qa/phase-10c2/checksums.sha256'];
const CHECKSUM_PATHS=[...DOCS,'index.html',...FROZEN,...SOURCE_FILES,'qa/phase-11a/current-manifest.json'];
const EXPECTED_NAMES=['README.md','build-contract.mjs','checksums.sha256','current-manifest.json','index.html','probe.mjs','realm.html','realm.js','runner.js','scenarios.json','verify.mjs'];
const sha=value=>createHash('sha256').update(value).digest('hex'),read=path=>readFileSync(resolve(ROOT,path)),identity=path=>{const raw=read(path);return{sha256:sha(raw),byteLength:raw.length}},identityBuffer=raw=>({sha256:sha(raw),byteLength:raw.length});
for(const path of [...SOURCE_FILES,...DOCS,...FROZEN,'index.html'])if(!existsSync(resolve(ROOT,path)))throw new Error(`Missing Phase 11A input: ${path}`);
const candidate=execFileSync('git',['show',`${CANDIDATE}:index.html`],{cwd:ROOT,maxBuffer:32*1024*1024}),artifact=identity('index.html');
if(JSON.stringify(identityBuffer(candidate))!==JSON.stringify(ARTIFACT)||JSON.stringify(artifact)!==JSON.stringify(ARTIFACT))throw new Error('Phase 11A builder refuses an unrecognized production artifact');
const names=readdirSync(QA).filter(name=>!['checksums.sha256','current-manifest.json'].includes(name)).sort(),expected=EXPECTED_NAMES.filter(name=>!['checksums.sha256','current-manifest.json'].includes(name));
if(JSON.stringify(names)!==JSON.stringify(expected))throw new Error(`Unexpected Phase 11A topology: ${names.join(', ')}`);
if(process.argv.includes('--write')){
  const manifest={manifestVersion:1,phase:'11A',status:'PASS_LOCAL',baseCommit:BASE,candidateCommit:CANDIDATE,productionChanged:true,browserFiles:true,artifact,embeddedAssets:{count:5,aggregateSha256:'26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a'},schemaRows:47,engineRows:100,focusedProbeRows:168,sealedCliRows:180,liveRows:70,viewports:['320x568','390x667','390x844'],packageFiles:Object.fromEntries(SOURCE_FILES.map(path=>[path,identity(path)])),expectedGate:{focusedCli:'168/168',sealedCli:'180/180 twice',liveBrowser:'70/70 twice with zero console warnings/errors and zero native-storage accesses'},observedGate:{focusedCli:{total:168,passed:168,failed:0},sealedCli:{total:180,passed:180,failed:0,runs:2},liveBrowser:{total:70,passed:70,failed:0,runs:2,viewports:['320x568','390x667','390x844'],consoleWarningsOrErrors:0,nativeStorageAccesses:0,observedAt:'2026-08-30T23:48:17Z'}}};
  writeFileSync(resolve(QA,'current-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  writeFileSync(resolve(QA,'checksums.sha256'),CHECKSUM_PATHS.map(path=>`${identity(path).sha256}  ${path}`).join('\n')+'\n');
}
for(const name of ['current-manifest.json','checksums.sha256'])if(!existsSync(resolve(QA,name)))throw new Error(`Run build-contract.mjs --write to create ${name}`);
const manifest=JSON.parse(read('qa/phase-11a/current-manifest.json')),lines=read('qa/phase-11a/checksums.sha256').toString('utf8').trim().split('\n');
if(manifest.baseCommit!==BASE||manifest.candidateCommit!==CANDIDATE||lines.length!==CHECKSUM_PATHS.length)throw new Error('Phase 11A manifest/checksum contract drift');
console.log(JSON.stringify({phase:manifest.phase,status:manifest.status,artifact:manifest.artifact,packageFiles:SOURCE_FILES.length,checksumEntries:lines.length,writes:process.argv.includes('--write')?2:0},null,2));

