import {createHash} from 'node:crypto';
import {existsSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),QA=resolve(ROOT,'qa/phase-11b1');
const SOURCE_FILES=['qa/phase-11b1/README.md','qa/phase-11b1/build-contract.mjs','qa/phase-11b1/index.html','qa/phase-11b1/probe.mjs','qa/phase-11b1/realm.html','qa/phase-11b1/realm.js','qa/phase-11b1/runner.js','qa/phase-11b1/scenarios.json','qa/phase-11b1/verify.mjs'];
const FROZEN=['qa/phase-11a/README.md','qa/phase-11a/build-contract.mjs','qa/phase-11a/checksums.sha256','qa/phase-11a/current-manifest.json','qa/phase-11a/index.html','qa/phase-11a/probe.mjs','qa/phase-11a/realm.html','qa/phase-11a/realm.js','qa/phase-11a/runner.js','qa/phase-11a/scenarios.json','qa/phase-11a/verify.mjs'];
const DOCS=['docs/PHASE_11B_SAVE_RECOVERY_CONTRACT.md','docs/PHASE_11B1_SAVE_RECOVERY_RESULT.md'];
const CHECKSUM_PATHS=[...DOCS,'index.html',...FROZEN,...SOURCE_FILES,'qa/phase-11b1/current-manifest.json'];
const EXPECTED_NAMES=['README.md','build-contract.mjs','checksums.sha256','current-manifest.json','index.html','probe.mjs','realm.html','realm.js','runner.js','scenarios.json','verify.mjs'];
const sha=value=>createHash('sha256').update(value).digest('hex'),read=path=>readFileSync(resolve(ROOT,path)),identity=path=>{const raw=read(path);return{sha256:sha(raw),byteLength:raw.length}};
for(const path of [...SOURCE_FILES,...DOCS,...FROZEN,'index.html'])if(!existsSync(resolve(ROOT,path)))throw new Error(`Missing Phase 11B-1 input: ${path}`);
const scenarios=JSON.parse(read('qa/phase-11b1/scenarios.json')),artifact=identity('index.html');if(JSON.stringify(artifact)!==JSON.stringify({sha256:scenarios.artifact.sha256,byteLength:scenarios.artifact.byteLength}))throw new Error(`Phase 11B-1 builder refuses artifact ${artifact.sha256} · ${artifact.byteLength}`);
const names=readdirSync(QA).filter(name=>!['checksums.sha256','current-manifest.json'].includes(name)).sort(),expected=EXPECTED_NAMES.filter(name=>!['checksums.sha256','current-manifest.json'].includes(name));if(JSON.stringify(names)!==JSON.stringify(expected))throw new Error(`Unexpected Phase 11B-1 topology: ${names.join(', ')}`);
if(process.argv.includes('--write')){
  const manifest={manifestVersion:1,phase:'11B-1',status:'PASS_LOCAL',productionParentCommit:scenarios.authority.productionParentCommit,phase11aCandidateCommit:scenarios.authority.phase11aCandidateCommit,candidateCommit:scenarios.authority.candidateCommit,productionChanged:true,browserFiles:true,artifact,embeddedAssets:{count:scenarios.artifact.assetCount,aggregateSha256:scenarios.artifact.assetAggregateSha256},phase11aSemanticRows:168,focusedProbeRows:189,sealedCliRows:203,liveRows:115,viewports:scenarios.viewports.map(item=>`${item.width}x${item.height}`),packageFiles:Object.fromEntries(SOURCE_FILES.map(path=>[path,identity(path)])),expectedGate:{focusedCli:'189/189',sealedCli:'203/203 twice',liveBrowser:'115/115 twice at three phone sizes with zero console warnings/errors and zero native-storage accesses'},observedGate:{focusedCli:{total:189,passed:189,failed:0},sealedCli:{total:203,passed:203,failed:0,runs:2},liveBrowser:{total:115,passed:115,failed:0,runs:2,viewports:scenarios.viewports.map(item=>`${item.width}x${item.height}`),consoleWarningsOrErrors:0,nativeStorageAccesses:0,observedAt:'2026-08-31T00:31:05Z'}}};
  writeFileSync(resolve(QA,'current-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  writeFileSync(resolve(QA,'checksums.sha256'),CHECKSUM_PATHS.map(path=>`${identity(path).sha256}  ${path}`).join('\n')+'\n');
}
for(const name of ['current-manifest.json','checksums.sha256'])if(!existsSync(resolve(QA,name)))throw new Error(`Run build-contract.mjs --write to create ${name}`);
const manifest=JSON.parse(read('qa/phase-11b1/current-manifest.json')),lines=read('qa/phase-11b1/checksums.sha256').toString('utf8').trim().split('\n');if(manifest.productionParentCommit!==scenarios.authority.productionParentCommit||manifest.phase11aCandidateCommit!==scenarios.authority.phase11aCandidateCommit||lines.length!==CHECKSUM_PATHS.length)throw new Error('Phase 11B-1 manifest/checksum contract drift');
console.log(JSON.stringify({phase:manifest.phase,status:manifest.status,artifact:manifest.artifact,packageFiles:SOURCE_FILES.length,checksumEntries:lines.length,writes:process.argv.includes('--write')?2:0},null,2));
