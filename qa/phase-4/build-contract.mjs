import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..'),hash=bytes=>createHash('sha256').update(bytes).digest('hex'),read=path=>readFileSync(resolve(root,path));
function walk(path){const absolute=resolve(root,path),rows=[];for(const name of readdirSync(absolute)){const child=resolve(absolute,name),rel=relative(root,child);if(statSync(child).isDirectory())rows.push(...walk(rel));else rows.push(rel)}return rows.sort()}
const frozen=[...walk('qa').filter(path=>!path.startsWith('qa/phase-4/')),...walk('docs').filter(path=>!/^docs\/PHASE_4_/.test(path))],frozenHistoricalFiles=Object.fromEntries(frozen.map(path=>[path,hash(read(path))]));
const artifact=read('index.html'),lines=artifact.toString('utf8').split(/\r?\n/),embedded=Buffer.from([12,18,24].map(number=>lines[number-1]??'').join('\n'));
const scenarios=read('qa/phase-4/scenarios.json'),phaseThree=JSON.parse(read('qa/phase-3/current-manifest.json'));
const manifest={manifestVersion:1,phase:'4',baseCommit:'165d18aaab66370ac959670ef1c7284c6ec95a3c',productionCommit:'cea60986dee6185c7319224752b877e4c7917546',sourceRevisions:phaseThree.sourceRevisions,artifact:{sha256:hash(artifact),byteLength:artifact.length,embeddedAssetLinesSha256:hash(embedded)},baseArtifact:{sha256:phaseThree.artifact.sha256,byteLength:phaseThree.artifact.byteLength,embeddedAssetLinesSha256:phaseThree.artifact.embeddedAssetLinesSha256},scenarios:{sha256:hash(scenarios),byteLength:scenarios.length},frozenHistoricalFiles};
writeFileSync(resolve(root,'qa/phase-4/current-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const checksumPaths=['index.html','docs/PHASE_4_IMPLEMENTATION_CONTRACT.md','docs/PHASE_4_EXECUTION.md','docs/PHASE_4_RESULT.md',...walk('qa/phase-4').filter(path=>!path.endsWith('checksums.sha256'))].sort(),checksums=checksumPaths.map(path=>`${hash(read(path))}  ${path}`).join('\n')+'\n';writeFileSync(resolve(root,'qa/phase-4/checksums.sha256'),checksums);
console.log(JSON.stringify({artifact:manifest.artifact,frozen:frozen.length,checksums:checksumPaths.length},null,2));
