import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname),QA=resolve(ROOT,'qa/phase-12-independent'),NODE=process.execPath,BASE='4ee1ee4dcaa1b6eb190ed65d8cf81623c49bc28c',PACKAGE_ONLY=process.argv.includes('--package-only');
const EXPECTED=['README.md','fixtures/contract-fixtures.json','fixtures/phase11h-assets.json','index.html','realm.html','realm.js','runner.js','verify.mjs'];
const rows=[],record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)}),read=path=>readFileSync(resolve(ROOT,path)),text=path=>read(path).toString('utf8'),sha=value=>createHash('sha256').update(value).digest('hex'),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),git=args=>execFileSync('/usr/bin/git',args,{cwd:ROOT,encoding:'utf8',maxBuffer:64*1024*1024});
const fixtures=JSON.parse(text('qa/phase-12-independent/fixtures/contract-fixtures.json')),assets=JSON.parse(text('qa/phase-12-independent/fixtures/phase11h-assets.json')),source=text('index.html');

function filesBelow(directory,prefix=''){
  const paths=[];for(const name of readdirSync(directory)){const absolute=resolve(directory,name),path=prefix?`${prefix}/${name}`:name;if(statSync(absolute).isDirectory())paths.push(...filesBelow(absolute,path));else paths.push(path)}return paths.sort();
}
function sourceIds(start,end){const section=source.slice(source.indexOf(start),source.indexOf(end));return [...section.matchAll(/\{id:'([^']+)'/g)].map(match=>match[1])}
function productionSources(){
  const files=[];function visit(directory,prefix=''){for(const entry of readdirSync(directory,{withFileTypes:true})){if(!prefix&&['.git','assets','docs','qa'].includes(entry.name))continue;const path=prefix?`${prefix}/${entry.name}`:entry.name,absolute=resolve(directory,entry.name);if(entry.isDirectory())visit(absolute,path);else if(/\.(?:html|m?js)$/.test(path))files.push(path)}}visit(ROOT);return files.sort();
}

record('base-commit-reachable',git(['merge-base','--is-ancestor',BASE,'HEAD'])==='');
record('package-topology',same(filesBelow(QA),EXPECTED),filesBelow(QA));
record('contract-document-present',existsSync(resolve(ROOT,'docs/PHASE_12_INDEPENDENT_QA_CONTRACT.md')));
const contract=text('docs/PHASE_12_INDEPENDENT_QA_CONTRACT.md');record('contract-covers-required-risks',['Stable content identity','unknown-historical','two-tab race','Tutorial gate','18 Fellows','20 Family','Dormant legacy modes','24-hour offline elapsed cap','Blind spots'].every(value=>contract.includes(value)));
record('fixture-version',fixtures.contractVersion===1&&fixtures.bridgeVersion==='phase-12-independent-qa-v1'&&fixtures.schema.predecessor===12&&fixtures.schema.candidate===12&&fixtures.schema.activationId==='phase-12-foundation-activation',fixtures);
record('fixture-clock-and-cap',Number.isSafeInteger(fixtures.frozenNow)&&fixtures.laterNow>fixtures.frozenNow&&fixtures.offline.requestedMs>fixtures.offline.capMs&&fixtures.offline.capMs===86400000,fixtures.offline);
record('fixture-roster-identity',fixtures.fellowIds.length===18&&fixtures.familyIds.length===20&&new Set([...fixtures.fellowIds,...fixtures.familyIds]).size===38);
record('fixture-matches-production-fellows',same(sourceIds('const FELLOW_DEFS=[','const VILLAGE_CUTOUT_CONFIG_ID'),fixtures.fellowIds),sourceIds('const FELLOW_DEFS=[','const VILLAGE_CUTOUT_CONFIG_ID'));
record('fixture-matches-production-family',same(sourceIds('const FAMILY_DEFS=[','const COMPANION_DEFS=['),fixtures.familyIds),sourceIds('const FAMILY_DEFS=[','const COMPANION_DEFS=['));
record('fixture-required-legacy-modes',same(fixtures.requiredLegacyModes,['story','tower','trading','patrol','operations']));
record('fixture-tutorial-feature-plan',fixtures.requiredFeatureIds.length===5&&new Set(fixtures.requiredFeatureIds).size===5&&fixtures.requiredFeatureIds.every(id=>id.startsWith('feature.')));
record('fixture-viewports',fixtures.viewports.length===3&&fixtures.viewports.some(item=>item.width===320&&item.height===568)&&fixtures.viewports.some(item=>item.width===390&&item.height===844)&&fixtures.viewports.some(item=>item.reducedMotion===true),fixtures.viewports);

const assetFailures=Object.entries(assets.files).filter(([path,expected])=>!existsSync(resolve(ROOT,path))||sha(read(path))!==expected).map(([path])=>path);record('phase11h-assets-byte-preserved',assets.sourceCommit===BASE&&Object.keys(assets.files).length===47&&assetFailures.length===0,{count:Object.keys(assets.files).length,failures:assetFailures});
record('phase11h-art-path-separation',source.includes('assets/portraits/fellows/village/${esc(def.art)}.png')&&source.includes("assets/portraits/${kind==='fellow'?'fellows':'family'}/${detail?'':'thumb/'}${definition.art}.webp"));
record('external-art-preserved',!/data:image\/(?:png|jpe?g|webp);base64,/i.test(source));
record('runner-loads-isolated-realms',text('qa/phase-12-independent/runner.js').includes('fixtures/contract-fixtures.json')&&text('qa/phase-12-independent/realm.js').includes("qa:{allowDestructive:true,isolatedStorage:true}")&&text('qa/phase-12-independent/realm.js').includes('__P12I_NATIVE_ACCESSES__'));
record('live-contract-fail-closed',text('qa/phase-12-independent/realm.js').includes('if(!qa){')&&text('qa/phase-12-independent/realm.js').includes('phase12-contract-unavailable'));
record('live-contract-covers-claims-tutorials-roster',text('qa/phase-12-independent/realm.js').includes('two-tab-one-winner')&&text('qa/phase-12-independent/realm.js').includes('tutorial-skip-replay-safe')&&text('qa/phase-12-independent/realm.js').includes('dialogue-coverage-all-rosters'));
for(const path of ['verify.mjs','runner.js','realm.js']){const run=spawnSync(NODE,['--check',`qa/phase-12-independent/${path}`],{cwd:ROOT,encoding:'utf8'});record(`syntax-${path}`,run.status===0,run.stderr.trim())}

if(PACKAGE_ONLY){
  const artifact={sha256:sha(read('index.html')),byteLength:read('index.html').length};record('exact-phase11h-base-artifact',artifact.sha256==='fb4d3f024307db2f01a9931a7f6ac3cde8245b3be6ab130d05c2c53d8a099df8'&&artifact.byteLength===1020510,artifact);
  const gate=spawnSync(NODE,['qa/phase-11h/verify.mjs'],{cwd:ROOT,encoding:'utf8',maxBuffer:256*1024*1024}),parsed=(()=>{try{return JSON.parse(gate.stdout)}catch{return null}})();record('phase11h-release-gate-74-of-74',gate.status===0&&parsed?.passed===74&&parsed?.failed===0,{status:gate.status,passed:parsed?.passed,failed:parsed?.failed,stderr:gate.stderr.trim().slice(-1000)});
}else{
  const paths=productionSources(),combined=paths.map(path=>text(path)).join('\n'),versions=[...combined.matchAll(/CURRENT_SCHEMA_VERSION\s*=\s*(\d+)/g)].map(match=>Number(match[1]));
  record('candidate-phase12-bridge-contract',combined.includes('__EVERSTEAD_PHASE_12_QA__')&&combined.includes('phase-12-independent-qa-v1')&&combined.includes('allowDestructive')&&combined.includes('isolatedStorage')&&combined.includes('NATIVE_STORAGE'),paths);
  record('candidate-schema-twelve-activation',Math.max(0,...versions)===fixtures.schema.candidate&&combined.includes(fixtures.schema.activationId),versions);
  record('campaign-table-renamed',!combined.match(/\b(?:const|let|var)\s+STORY\s*=\s*\[/));
}

const changed=git(['diff-tree','--no-commit-id','--name-only','-r',BASE,'HEAD']).trim().split('\n').filter(Boolean),owned=path=>['docs/PHASE_12_INDEPENDENT_QA_CONTRACT.md','docs/PHASE_12_INDEPENDENT_QA_RESULT.md'].includes(path)||path.startsWith('qa/phase-12-independent/');record('committed-qa-paths-owned',!PACKAGE_ONLY||changed.length===0||changed.every(owned),PACKAGE_ONLY?changed:'Candidate mode intentionally permits implementation and later-phase design files; package ownership is enforced by --package-only.');
const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed,result={phase:'12-independent',mode:PACKAGE_ONLY?'PACKAGE_ONLY':'CANDIDATE',status:failed?'FAIL':'PASS',baseCommit:BASE,total:rows.length,passed,failed,rows};console.log(JSON.stringify(result,null,2));if(failed)process.exitCode=1;
