import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname);
const files=['index.html','README.md','docs/PHASE_11D_ROSTER_CODEX_CONTRACT.md','docs/PHASE_11D_ROSTER_CODEX_RESULT.md','qa/phase-11d/README.md','qa/phase-11d/build-contract.mjs','qa/phase-11d/index.html','qa/phase-11d/probe.mjs','qa/phase-11d/realm.html','qa/phase-11d/realm.js','qa/phase-11d/runner.js','qa/phase-11d/scenarios.json','qa/phase-11d/verify.mjs'];
const sha=value=>createHash('sha256').update(value).digest('hex'),identity=path=>{const raw=readFileSync(resolve(ROOT,path));return{sha256:sha(raw),byteLength:raw.length}};
const source=readFileSync(resolve(ROOT,'index.html'),'utf8'),assets=[...source.matchAll(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g)].map(match=>match[0]);
console.log(JSON.stringify({phase:'11D',writes:0,artifact:identity('index.html'),embeddedAssets:{count:assets.length,aggregateSha256:sha(Buffer.from(assets.join('\n')))},files:Object.fromEntries(files.map(path=>[path,identity(path)]))},null,2));
