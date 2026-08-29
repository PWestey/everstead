import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {RELEASED_CONFIG,buildMicroVectors,buildParityVectors,canonical,referenceEvaluate} from './reference-model.mjs';
import {buildAdvisoryReport} from './simulate.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..'),args=Object.fromEntries(process.argv.slice(2).map(value=>value.split('=',2)));
const goldenPath=args['--golden'],reportPath=args['--report'];
if(!goldenPath||!reportPath||!goldenPath.endsWith('.candidate.json')||!reportPath.endsWith('.candidate.json'))throw new Error('Explicit --golden=*.candidate.json and --report=*.candidate.json paths are required');
for(const path of [goldenPath,reportPath])if(existsSync(resolve(root,path)))throw new Error(`Refusing to overwrite ${path}`);
const scenarios=JSON.parse(readFileSync(resolve(root,'qa/phase-10b/scenarios.json'),'utf8')),micro=Object.fromEntries(buildMicroVectors(scenarios).map(vector=>[vector.id,canonical(referenceEvaluate(vector))])),parity=Object.fromEntries(buildParityVectors(scenarios).map(vector=>[vector.id,canonical(referenceEvaluate(vector))]));
const golden={goldenVersion:2,phase:'10B-1',provenance:'literal-current-baseline-awaiting-independent-review',contractBase:'723492b1e968407f23c7d78deabf66813f14c229',artifactSha256:'717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed',timeZone:'America/Phoenix',releasedConfig:canonical(RELEASED_CONFIG),micro,parity};
const report=buildAdvisoryReport(scenarios);
writeFileSync(resolve(root,goldenPath),JSON.stringify(golden,null,2)+'\n',{flag:'wx'});writeFileSync(resolve(root,reportPath),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({golden:{micro:Object.keys(micro).length,parity:Object.keys(parity).length},report:{bundles:report.bundleCount,identity:report.reportIdentity}},null,2));
