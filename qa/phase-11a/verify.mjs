import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runPhaseElevenAProbe} from './probe.mjs';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),QA=resolve(ROOT,'qa/phase-11a');
const BASE='ac7592348c1a11668822b0355ae86ab6db1b2688',CANDIDATE='7c9e370f37830eaf9f756972dbbc1744d68e0270';
const ARTIFACT={sha256:'fe0fd5a75cd32053861c9572d58f990b86f8d562c84173f8e9ea70967f2f0321',byteLength:18985643},ASSETS={count:5,sha256:'26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a'};
const EXPECTED_NAMES=['README.md','build-contract.mjs','checksums.sha256','current-manifest.json','index.html','probe.mjs','realm.html','realm.js','runner.js','scenarios.json','verify.mjs'];
const OWNED_DOCS=['docs/PHASE_11A_CLARITY_EXECUTION.md','docs/PHASE_11A_CLARITY_RESULT.md'],results=[];
const record=(id,pass,detail='')=>results.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)}),sha=value=>createHash('sha256').update(value).digest('hex'),read=path=>readFileSync(resolve(ROOT,path)),identity=raw=>({sha256:sha(raw),byteLength:raw.length}),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const source=read('index.html'),text=source.toString('utf8'),candidate=execFileSync('git',['show',`${CANDIDATE}:index.html`],{cwd:ROOT,maxBuffer:32*1024*1024});
record('candidate-reachable',execFileSync('git',['merge-base','--is-ancestor',CANDIDATE,'HEAD'],{cwd:ROOT,encoding:'utf8'})==='');
record('candidate-last-production-commit',execFileSync('git',['log','-1','--format=%H','--','index.html'],{cwd:ROOT,encoding:'utf8'}).trim()===CANDIDATE);
record('exact-candidate-artifact',same(identity(source),ARTIFACT)&&same(identity(candidate),ARTIFACT)&&source.equals(candidate),identity(source));
const assets=[...text.matchAll(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g)].map(match=>match[0]);record('embedded-assets-byte-frozen',assets.length===ASSETS.count&&sha(Buffer.from(assets.join('\n')))===ASSETS.sha256,`${assets.length} · ${sha(Buffer.from(assets.join('\n')))}`);
const historicalQa=execFileSync('git',['diff','--name-only',BASE,'--','qa'],{cwd:ROOT,encoding:'utf8'}).trim().split('\n').filter(path=>path&&!path.startsWith('qa/phase-11a/'));record('historical-qa-byte-frozen',historicalQa.length===0,historicalQa);
record('package-topology',same(readdirSync(QA).sort(),EXPECTED_NAMES),readdirSync(QA).sort());record('docs-present',OWNED_DOCS.every(path=>existsSync(resolve(ROOT,path))));
const changed=execFileSync('git',['diff','--name-only',CANDIDATE,'--'],{cwd:ROOT,encoding:'utf8'}).trim().split('\n').filter(Boolean),untracked=execFileSync('git',['ls-files','--others','--exclude-standard'],{cwd:ROOT,encoding:'utf8'}).trim().split('\n').filter(Boolean),touched=[...new Set([...changed,...untracked])].sort(),owned=path=>path.startsWith('qa/phase-11a/')||OWNED_DOCS.includes(path);record('additive-owned-paths-only',touched.length>0&&touched.every(owned),touched);
const focused=await runPhaseElevenAProbe();for(const row of focused.rows)record(`focused-${row.id}`,row.pass,row.detail);record('focused-probe-168-of-168',focused.rows.length===168&&focused.evidence.failed===0,focused.evidence);
const manifest=JSON.parse(read('qa/phase-11a/current-manifest.json'));record('manifest-authority',manifest.phase==='11A'&&manifest.status==='PASS_LOCAL'&&manifest.baseCommit===BASE&&manifest.candidateCommit===CANDIDATE&&same(manifest.artifact,ARTIFACT)&&manifest.schemaRows===47&&manifest.engineRows===100&&manifest.focusedProbeRows===168&&manifest.sealedCliRows===180&&manifest.liveRows===70&&manifest.observedGate?.sealedCli?.passed===180&&manifest.observedGate?.sealedCli?.failed===0&&manifest.observedGate?.sealedCli?.runs===2&&manifest.observedGate?.liveBrowser?.passed===70&&manifest.observedGate?.liveBrowser?.failed===0&&manifest.observedGate?.liveBrowser?.runs===2&&manifest.observedGate?.liveBrowser?.consoleWarningsOrErrors===0&&manifest.observedGate?.liveBrowser?.nativeStorageAccesses===0,manifest);
const packageFailures=Object.entries(manifest.packageFiles).filter(([path,entry])=>{const raw=read(path);return sha(raw)!==entry.sha256||raw.length!==entry.byteLength}).map(([path])=>path);record('manifest-package-identities',Object.keys(manifest.packageFiles).length===9&&packageFailures.length===0,packageFailures);
const checksumRows=read('qa/phase-11a/checksums.sha256').toString('utf8').trim().split('\n'),checksumFailures=[];for(const line of checksumRows){const match=line.match(/^([0-9a-f]{64})  (.+)$/);if(!match||!existsSync(resolve(ROOT,match[2]))||sha(read(match[2]))!==match[1])checksumFailures.push(match?.[2]||line)}record('phase11a-checksums',checksumRows.length===19&&checksumFailures.length===0,checksumFailures);
const passed=results.filter(row=>row.pass).length,failed=results.length-passed;console.log(JSON.stringify({phase:'11A',status:failed?'FAIL':'PASS',candidateCommit:CANDIDATE,artifact:ARTIFACT,focused:focused.evidence,total:results.length,passed,failed,results},null,2));if(failed)process.exitCode=1;

