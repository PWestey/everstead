import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..'),hash=bytes=>createHash('sha256').update(bytes).digest('hex'),read=path=>readFileSync(resolve(root,path));
function walk(path){const absolute=resolve(root,path),rows=[];for(const name of readdirSync(absolute)){const child=resolve(absolute,name),rel=relative(root,child);if(statSync(child).isDirectory())rows.push(...walk(rel));else rows.push(rel)}return rows.sort()}
const frozen=[...walk('qa').filter(path=>!path.startsWith('qa/phase-6/')),...walk('docs').filter(path=>!/^docs\/PHASE_6_/.test(path))],frozenHistoricalFiles=Object.fromEntries(frozen.map(path=>[path,hash(read(path))]));
const artifact=read('index.html'),lines=artifact.toString('utf8').split(/\r?\n/),embedded=Buffer.from([12,18,24].map(number=>lines[number-1]??'').join('\n')),scenarios=read('qa/phase-6/scenarios.json'),phaseFive=JSON.parse(read('qa/phase-5/current-manifest.json'));
const manifest={manifestVersion:1,phase:'6',baseCommit:'4c2f27b02d177afbf08898eee68a4b552b4c3d8c',productionCommit:'689d43a4f0b0d22507e66b158f4a1f23a8672fee',sourceRevisions:phaseFive.sourceRevisions,artifact:{sha256:hash(artifact),byteLength:artifact.length,embeddedAssetLinesSha256:hash(embedded)},baseArtifact:{sha256:phaseFive.artifact.sha256,byteLength:phaseFive.artifact.byteLength,embeddedAssetLinesSha256:phaseFive.artifact.embeddedAssetLinesSha256},scenarios:{sha256:hash(scenarios),byteLength:scenarios.length},frozenHistoricalFiles};
writeFileSync(resolve(root,'qa/phase-6/current-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const checksumPaths=['index.html','docs/PHASE_6_IMPLEMENTATION_CONTRACT.md','docs/PHASE_6_EXECUTION.md','docs/PHASE_6_RESULT.md',...walk('qa/phase-6').filter(path=>!path.endsWith('checksums.sha256'))].sort(),checksums=checksumPaths.map(path=>`${hash(read(path))}  ${path}`).join('\n')+'\n';writeFileSync(resolve(root,'qa/phase-6/checksums.sha256'),checksums);
console.log(JSON.stringify({artifact:manifest.artifact,frozen:frozen.length,checksums:checksumPaths.length},null,2));
