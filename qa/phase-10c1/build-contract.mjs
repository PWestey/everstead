import {createHash} from 'node:crypto';
import {existsSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const QA=resolve(ROOT,'qa/phase-10c1');
const BASE_COMMIT='56b99f86a95f95fd1822da0331204f5d8ea33656';
const PROFILE_IDENTITY='6abf706b4450f61a708a0baba5e431a374f8de085fbf614e7334b6071bca534f';
const SOURCE_FILES=['qa/phase-10c1/README.md','qa/phase-10c1/build-contract.mjs','qa/phase-10c1/profile.json','qa/phase-10c1/vectors.json','qa/phase-10c1/verify.mjs'];
const EXPECTED_NAMES=['README.md','build-contract.mjs','checksums.sha256','current-manifest.json','profile.json','vectors.json','verify.mjs'];
const PHASE_TEN_B_FILES=['docs/PHASE_10B_SIMULATOR_CONTRACT.md','docs/PHASE_10B_RESULT.md','qa/phase-10b/checksums.sha256','qa/phase-10b/current-manifest.json','qa/phase-10b/current-report.json','qa/phase-10b/scenarios.json','qa/phase-10b/simulate.mjs'];
const CHECKSUM_PATHS=['docs/PHASE_10C1_ECONOMY_ACTIVATION_CONTRACT.md','docs/PHASE_10C1_EXECUTION.md','index.html',...PHASE_TEN_B_FILES,...SOURCE_FILES,'qa/phase-10c1/current-manifest.json'];
const sha=value=>createHash('sha256').update(value).digest('hex');
const read=path=>readFileSync(resolve(ROOT,path));
const identity=path=>{const raw=read(path);return{sha256:sha(raw),byteLength:raw.length}};

for(const path of [...SOURCE_FILES,...CHECKSUM_PATHS.slice(0,10)])if(!existsSync(resolve(ROOT,path)))throw new Error('Missing Phase 10C-1 input: '+path);
const names=readdirSync(QA).filter(name=>!['checksums.sha256','current-manifest.json'].includes(name)).sort();
const expectedBeforeSeal=EXPECTED_NAMES.filter(name=>!['checksums.sha256','current-manifest.json'].includes(name));
if(JSON.stringify(names)!==JSON.stringify(expectedBeforeSeal))throw new Error('Unexpected Phase 10C-1 topology: '+names.join(', '));

if(process.argv.includes('--write')){
  const manifest={
    manifestVersion:1,
    phase:'10C-1',
    mode:'PREIMAGE',
    status:'PREIMAGE_QA_READY',
    baseCommit:BASE_COMMIT,
    productionChanged:false,
    browserFiles:false,
    artifact:{...identity('index.html'),embeddedAssetCount:5,embeddedAssetAggregateSha256:'26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a',schemaVersion:10,protectedSlots:12},
    selectedProfile:{id:'everstead-economy-v1',identity:PROFILE_IDENTITY,source:identity('qa/phase-10c1/profile.json')},
    vectors:identity('qa/phase-10c1/vectors.json'),
    phaseTenBSimulator:Object.fromEntries(PHASE_TEN_B_FILES.map(path=>[path,identity(path)])),
    packageFiles:Object.fromEntries(SOURCE_FILES.map(path=>[path,identity(path)])),
    expectedGate:{focusedCli:'PASS twice',phaseTenBSelectedBundles:36,liveBrowser:'DEFERRED UNTIL PRODUCTION CANDIDATE'}
  };
  writeFileSync(resolve(QA,'current-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  const checksums=CHECKSUM_PATHS.map(path=>`${identity(path).sha256}  ${path}`).join('\n')+'\n';
  writeFileSync(resolve(QA,'checksums.sha256'),checksums);
}

for(const name of ['current-manifest.json','checksums.sha256'])if(!existsSync(resolve(QA,name)))throw new Error('Run build-contract.mjs --write to create '+name);
const manifest=JSON.parse(read('qa/phase-10c1/current-manifest.json'));
const checksumLines=read('qa/phase-10c1/checksums.sha256').toString('utf8').trim().split('\n');
if(manifest.baseCommit!==BASE_COMMIT||manifest.selectedProfile.identity!==PROFILE_IDENTITY||checksumLines.length!==CHECKSUM_PATHS.length)throw new Error('Phase 10C-1 manifest/checksum contract drift');
console.log(JSON.stringify({phase:manifest.phase,mode:manifest.mode,status:manifest.status,artifact:manifest.artifact,packageFiles:SOURCE_FILES.length,phaseTenBFiles:PHASE_TEN_B_FILES.length,checksumEntries:checksumLines.length,writes:process.argv.includes('--write')?2:0},null,2));
