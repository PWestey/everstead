import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..'),hash=bytes=>createHash('sha256').update(bytes).digest('hex'),read=path=>readFileSync(resolve(root,path));
function walk(path){const absolute=resolve(root,path),rows=[];for(const name of readdirSync(absolute)){const child=resolve(absolute,name),rel=relative(root,child);if(statSync(child).isDirectory())rows.push(...walk(rel));else rows.push(rel)}return rows.sort()}
const frozen=[...walk('qa').filter(path=>!path.startsWith('qa/phase-7/')),...walk('docs').filter(path=>!/^docs\/PHASE_7_/.test(path))],frozenHistoricalFiles=Object.fromEntries(frozen.map(path=>[path,hash(read(path))]));
const artifact=read('index.html'),lines=artifact.toString('utf8').split(/\r?\n/),embedded=Buffer.from([12,18,24].map(number=>lines[number-1]??'').join('\n')),scenarios=read('qa/phase-7/scenarios.json'),phaseSix=JSON.parse(read('qa/phase-6/current-manifest.json'));
const canonicalMainCommit=execFileSync('git',['rev-parse','main'],{cwd:root,encoding:'utf8'}).trim(),originMainCommit=execFileSync('git',['rev-parse','origin/main'],{cwd:root,encoding:'utf8'}).trim();
const manifest={manifestVersion:1,phase:'7',baseCommit:'1ffa12eb73cccb4de40769ae7251937c67f69766',productionCommit:'8ca8353534bd4ae312e9470155988d209b0b6fed',supportedReleasedSchemas:[0,1,2,3,4,5,6,7],provisionalSchema8Published:false,qaStorage:'isolated-memory-adapter',preSealReleaseEvidence:{canonicalMainCommit,originMainCommit,publicUrl:'https://pwestey.github.io/everstead/',publicArtifactSha256:phaseSix.artifact.sha256,publicArtifactByteLength:phaseSix.artifact.byteLength,publicSchemaVersion:7,phaseSevenMarkersPresent:false,observedAt:'2026-08-28T18:00:00.000Z'},sourceRevisions:phaseSix.sourceRevisions,artifact:{sha256:hash(artifact),byteLength:artifact.length,embeddedAssetLinesSha256:hash(embedded)},baseArtifact:{sha256:phaseSix.artifact.sha256,byteLength:phaseSix.artifact.byteLength,embeddedAssetLinesSha256:phaseSix.artifact.embeddedAssetLinesSha256},scenarios:{sha256:hash(scenarios),byteLength:scenarios.length},frozenHistoricalFiles};
writeFileSync(resolve(root,'qa/phase-7/current-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const checksumPaths=['index.html','docs/PHASE_7_IMPLEMENTATION_CONTRACT.md','docs/PHASE_7_EXECUTION.md','docs/PHASE_7_RESULT.md',...walk('qa/phase-7').filter(path=>!path.endsWith('checksums.sha256'))].sort(),checksums=checksumPaths.map(path=>`${hash(read(path))}  ${path}`).join('\n')+'\n';writeFileSync(resolve(root,'qa/phase-7/checksums.sha256'),checksums);
console.log(JSON.stringify({artifact:manifest.artifact,frozen:frozen.length,checksums:checksumPaths.length},null,2));
