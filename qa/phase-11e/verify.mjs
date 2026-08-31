import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {existsSync,readFileSync} from 'node:fs';
import vm from 'node:vm';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname),NODE=process.execPath;
const read=path=>readFileSync(resolve(ROOT,path)),sha=value=>createHash('sha256').update(value).digest('hex');
const rows=[],record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const artifact=read('index.html'),html=artifact.toString('utf8'),application=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'',assets=[...html.matchAll(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g)].map(match=>match[0]);
const artifactIdentity={sha256:sha(artifact),byteLength:artifact.length},assetIdentity={count:assets.length,aggregateSha256:sha(Buffer.from(assets.join('\n')))};

record('application-script-present',Boolean(application));
try{new vm.Script(application);record('application-script-syntax',true)}catch(error){record('application-script-syntax',false,error.message)}
record('schema-eleven-preserved',html.includes('CURRENT_SCHEMA_VERSION=11'));
record('compatibility-version-preserved',html.includes("VERSION='0.1.0',RELEASE_VERSION='1.0.0-rc.1'"));
record('embedded-assets-byte-frozen',assetIdentity.count===5&&assetIdentity.aggregateSha256==='26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a',assetIdentity);
record('single-file-deployment-preserved',html.startsWith('<!doctype html>')&&html.includes('<style>')&&html.includes('<script>'));
record('navigation-wrappers-consolidated',!html.includes('navBeforePhaseElevenC')&&!html.includes('setAdventureBeforePhaseElevenC'));
record('release-bundle-identity',html.includes('appVersion:RELEASE_VERSION'));

const docs=[
  'docs/PHASE_11E_STEWARDSHIP_CONTRACT.md',
  'docs/PROSPERITY_HQ_DECISION.md',
  'docs/ROSTER_CATCH_UP_DECISION.md',
  'docs/RECOVERY_SCHEMA_POLICY.md',
  'docs/PHASE_11E_STRUCTURE_MAP.md'
];
record('decision-and-contract-docs-present',docs.every(path=>existsSync(resolve(ROOT,path))),docs.filter(path=>!existsSync(resolve(ROOT,path))));
const prosperity=read('docs/PROSPERITY_HQ_DECISION.md').toString('utf8'),catchUp=read('docs/ROSTER_CATCH_UP_DECISION.md').toString('utf8'),recovery=read('docs/RECOVERY_SCHEMA_POLICY.md').toString('utf8');
record('prosperity-thresholds-remain-tbd',prosperity.includes('TBD')&&prosperity.includes('Invented thresholds'));
record('catch-up-rates-remain-unimplemented',catchUp.includes('not active yet')&&catchUp.includes('does not define its numbers'));
record('future-schema-recovery-gate-documented',recovery.includes('beyond 11')&&recovery.includes('schema-11'));

function focused(path,label,total){const run=spawnSync(NODE,[path],{cwd:ROOT,encoding:'utf8',maxBuffer:256*1024*1024}),pattern=new RegExp(`${label}: ${total}\\/${total}`),failures=(run.stdout||'').split('\n').filter(line=>line.startsWith('FAIL '));return{pass:run.status===0&&pattern.test(run.stdout||'')&&failures.length===0,status:run.status,summary:(run.stdout||'').trim().split('\n').slice(-1)[0]||'',failures:failures.slice(0,10),stderr:(run.stderr||'').trim().slice(-1000)}}
const suites=[
  ['phase11e-focused','qa/phase-11e/probe.mjs','Phase 11E focused probe',36],
  ['phase11d-regression','qa/phase-11d/probe.mjs','Phase 11D focused probe',103],
  ['phase11c-regression','qa/phase-11c/probe.mjs','Phase 11C focused probe',83],
  ['phase11b-inspection-regression','qa/phase-11b2a/probe.mjs','Phase 11B-2a probe',42],
  ['phase11b-idle-regression','qa/phase-11b2a/idle-probe.mjs','Phase 11B idle prerequisite probe',8],
  ['phase11b-engine-regression','qa/phase-11b2b/engine-probe.mjs','Phase 11B-2b engine probe',103],
  ['phase11b-recovery-regression','qa/phase-11b2c/final-probe.mjs','Phase 11B-2c final recovery probe',133]
];
for(const [id,path,label,total]of suites){const result=focused(path,label,total);record(id,result.pass,result)}
record('focused-total-508-of-508',rows.filter(row=>row.id.endsWith('regression')||row.id==='phase11e-focused').every(row=>row.pass));

const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed,result={phase:'11E',status:failed?'FAIL':'PASS',artifact:artifactIdentity,embeddedAssets:assetIdentity,focusedRows:{phase11e:36,phase11d:103,phase11c:83,phase11b:286,total:508},total:rows.length,passed,failed,rows};
console.log(JSON.stringify(result,null,2));
if(failed)process.exitCode=1;
