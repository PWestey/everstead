import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..'),hash=bytes=>createHash('sha256').update(bytes).digest('hex'),read=path=>readFileSync(resolve(root,path));
function walk(path){const absolute=resolve(root,path),rows=[];for(const name of readdirSync(absolute)){const child=resolve(absolute,name),rel=relative(root,child);if(statSync(child).isDirectory())rows.push(...walk(rel));else rows.push(rel)}return rows.sort()}
const frozen=[...walk('qa').filter(path=>!path.startsWith('qa/phase-3/')),...walk('docs').filter(path=>/^docs\/PHASE_(0|1|2)/.test(path))],frozenHistoricalFiles=Object.fromEntries(frozen.map(path=>[path,hash(read(path))]));
const artifact=read('index.html'),lines=artifact.toString('utf8').split(/\r?\n/),embedded=Buffer.from([12,18,24].map(number=>lines[number-1]??'').join('\n'));
const scenarios=read('qa/phase-3/scenarios.json'),phaseTwo=JSON.parse(read('qa/phase-2/current-manifest.json'));
const manifest={manifestVersion:1,phase:'3',baseCommit:'9b4fbc11ad465f83802b7d787756d2d390de0e55',productionCommit:'eb9c3bd827cd1fe89130c4bfc8abfcafa62a89d6',sourceRevisions:{lockedCoreDesign:'AIroW34MYqUcG6Q-iOW_AtHMqmrwGj9Nb9AFMEEqxselBNLMox14pJzqh11nWmvHfp6LI-QdrsXi6ruy1TNJJQXiXzh4BgLMN-zh7XtA8-I',implementationRoadmap:'AIroW37XK-kLSvIWAi8bvi_c0B1TCCOIJCp93RQrxiAF8JmMMvgT0A9vnlZGdeAKQ_hSs674e9BNw9beXDa6RApDYcpXuZexshqiy4pvM_U'},artifact:{sha256:hash(artifact),byteLength:artifact.length,embeddedAssetLinesSha256:hash(embedded)},baseArtifact:{sha256:phaseTwo.artifact.sha256,byteLength:phaseTwo.artifact.byteLength,embeddedAssetLinesSha256:phaseTwo.artifact.embeddedAssetLinesSha256},scenarios:{sha256:hash(scenarios),byteLength:scenarios.length},frozenHistoricalFiles};
writeFileSync(resolve(root,'qa/phase-3/current-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const checksumPaths=['index.html','docs/PHASE_3_IMPLEMENTATION_CONTRACT.md','docs/PHASE_3_EXECUTION.md','docs/PHASE_3_RESULT.md',...walk('qa/phase-3').filter(path=>!path.endsWith('checksums.sha256'))].sort(),checksums=checksumPaths.map(path=>`${hash(read(path))}  ${path}`).join('\n')+'\n';writeFileSync(resolve(root,'qa/phase-3/checksums.sha256'),checksums);
console.log(JSON.stringify({artifact:manifest.artifact,frozen:frozen.length,checksums:checksumPaths.length},null,2));
