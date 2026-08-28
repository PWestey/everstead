import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const qaRoot=dirname(fileURLToPath(import.meta.url));
const repoRoot=resolve(qaRoot,'..','..');
const base='de41734692be4ff1760ae62f6a65467e0f25527a';
const sha256=value=>createHash('sha256').update(value).digest('hex');
const read=path=>readFileSync(resolve(repoRoot,path));
const git=(...args)=>execFileSync('git',args,{cwd:repoRoot,maxBuffer:64*1024*1024});
const baseRead=path=>git('show',`${base}:${path}`);
const assetAggregate=bytes=>{
  const lines=bytes.toString('utf8').split('\n').filter(line=>line.includes('data:image/'));
  return {lineCount:lines.length,byteLength:Buffer.byteLength(lines.join('\n')),sha256:sha256(Buffer.from(lines.join('\n')))};
};
const historicalPaths=git('ls-tree','-r','--name-only',base,'docs','qa').toString('utf8').trim().split('\n').filter(Boolean).sort();
const frozenHistoricalFiles=Object.fromEntries(historicalPaths.map(path=>[path,sha256(baseRead(path))]));
const artifact=read('index.html'),baseArtifact=baseRead('index.html'),scenario=read('qa/phase-2/scenarios.json');
const currentAssets=assetAggregate(artifact),baseAssets=assetAggregate(baseArtifact);
const manifest={
  manifestVersion:1,phase:'2',baseCommit:base,
  authority:{
    lockedCore:{id:'1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg',title:'EVERSTEAD — LOCKED CORE DESIGN v1.2',modifiedTime:'2026-08-27T22:20:15.835Z',revision:'AIroW34MYqUcG6Q-iOW_AtHMqmrwGj9Nb9AFMEEqxselBNLMox14pJzqh11nWmvHfp6LI-QdrsXi6ruy1TNJJQXiXzh4BgLMN-zh7XtA8-I'},
    roadmap:{id:'1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900',title:'EVERSTEAD — IMPLEMENTATION ROADMAP v1.0',modifiedTime:'2026-08-27T21:56:44.268Z',revision:'AIroW37XK-kLSvIWAi8bvi_c0B1TCCOIJCp93RQrxiAF8JmMMvgT0A9vnlZGdeAKQ_hSs674e9BNw9beXDa6RApDYcpXuZexshqiy4pvM_U'}
  },
  artifact:{path:'index.html',sha256:sha256(artifact),byteLength:artifact.length,embeddedAssetLinesSha256:currentAssets.sha256,embeddedAssetLineCount:currentAssets.lineCount,embeddedAssetByteLength:currentAssets.byteLength},
  baseArtifact:{path:'index.html',sha256:sha256(baseArtifact),byteLength:baseArtifact.length,embeddedAssetLinesSha256:baseAssets.sha256,embeddedAssetLineCount:baseAssets.lineCount,embeddedAssetByteLength:baseAssets.byteLength},
  scenarios:{path:'qa/phase-2/scenarios.json',sha256:sha256(scenario),byteLength:scenario.length},
  frozenHistoricalFiles
};
writeFileSync(resolve(qaRoot,'current-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const phaseFiles=['docs/PHASE_2_EXECUTION.md','docs/PHASE_2_RESULT.md','index.html','qa/phase-2/README.md','qa/phase-2/build-contract.mjs','qa/phase-2/current-manifest.json','qa/phase-2/index.html','qa/phase-2/realm.html','qa/phase-2/realm.js','qa/phase-2/regress-phase-1.mjs','qa/phase-2/runner.js','qa/phase-2/scenarios.json','qa/phase-2/verify.mjs'];
const checksumLines=phaseFiles.map(path=>`${sha256(read(path))}  ${path}`);
writeFileSync(resolve(qaRoot,'checksums.sha256'),checksumLines.join('\n')+'\n');
console.log(JSON.stringify({artifact:manifest.artifact,frozenFiles:historicalPaths.length,checksums:phaseFiles.length},null,2));
