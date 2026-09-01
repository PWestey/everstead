import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname);
const QA=resolve(ROOT,'qa/phase-13-independent');
const NODE=process.execPath;
const BASE='4ee1ee4dcaa1b6eb190ed65d8cf81623c49bc28c';
const DESIGN='73b807a36cb0ddb12fe726b3d271f7c4779e5ba9';
const PACKAGE_ONLY=process.argv.includes('--package-only');
const EXPECTED=['README.md','fixtures/contract-fixtures.json','fixtures/phase11h-assets.json','index.html','realm.html','realm.js','runner.js','verify.mjs'];
const rows=[];
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const read=path=>readFileSync(resolve(ROOT,path));
const text=path=>read(path).toString('utf8');
const sha=value=>createHash('sha256').update(value).digest('hex');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const unique=values=>new Set(values).size===values.length;
const git=args=>execFileSync('/usr/bin/git',args,{cwd:ROOT,encoding:'utf8',maxBuffer:128*1024*1024});
const fixtures=JSON.parse(text('qa/phase-13-independent/fixtures/contract-fixtures.json'));
const assets=JSON.parse(text('qa/phase-13-independent/fixtures/phase11h-assets.json'));
const source=text('index.html');

function filesBelow(directory,prefix=''){
  const paths=[];
  for(const name of readdirSync(directory)){
    const absolute=resolve(directory,name),path=prefix?`${prefix}/${name}`:name;
    if(statSync(absolute).isDirectory())paths.push(...filesBelow(absolute,path));else paths.push(path);
  }
  return paths.sort();
}

function sourceIds(start,end){
  const first=source.indexOf(start),last=source.indexOf(end);
  if(first<0||last<0||last<=first)return [];
  return [...source.slice(first,last).matchAll(/\{id:'([^']+)'/g)].map(match=>match[1]);
}

function productionSources(){
  const files=[];
  function visit(directory,prefix=''){
    for(const entry of readdirSync(directory,{withFileTypes:true})){
      if(!prefix&&['.git','assets','design','docs','qa'].includes(entry.name))continue;
      const path=prefix?`${prefix}/${entry.name}`:entry.name,absolute=resolve(directory,entry.name);
      if(entry.isDirectory())visit(absolute,path);else if(/\.(?:html|m?js|json)$/.test(path))files.push(path);
    }
  }
  visit(ROOT);return files.sort();
}

record('base-commit-reachable',git(['merge-base','--is-ancestor',BASE,'HEAD'])==='');
record('package-topology',same(filesBelow(QA),EXPECTED),filesBelow(QA));
record('contract-document-present',existsSync(resolve(ROOT,'docs/PHASE_13_INDEPENDENT_QA_CONTRACT.md')));
const contract=text('docs/PHASE_13_INDEPENDENT_QA_CONTRACT.md');
record('contract-covers-required-risks',[
  'First Covenant scenes','Cast retention and coverage','Opening art decisions','Tutorial identities',
  'Exact-once manual claims','Phase 12 shared claim/event/tutorial seams','Dormant legacy modes',
  '320×568','reduced-motion','Fail-closed rule','Blind spots'
].every(value=>contract.includes(value)));
record('fixture-provenance',fixtures.contractVersion===1&&fixtures.bridgeVersion==='phase-13-independent-qa-v1'&&fixtures.designCommit===DESIGN&&fixtures.sourceCommit===BASE,fixtures);
record('fixture-schema-seam',fixtures.schema.version===12&&fixtures.schema.phase12ActivationId==='phase-12-foundation-activation');
record('fixture-clock-and-offline-cap',Number.isSafeInteger(fixtures.frozenNow)&&fixtures.laterNow>fixtures.frozenNow&&fixtures.offlineCapMs===86400000);
record('fixture-story-identities',fixtures.storyIds.length===5&&unique(fixtures.storyIds)&&fixtures.storyIds.every(id=>/^story\.[a-z0-9.-]+$/.test(id)),fixtures.storyIds);
record('fixture-story-speakers',same(Object.keys(fixtures.storySpeakerIds),fixtures.storyIds)&&Object.values(fixtures.storySpeakerIds).every(ids=>ids.length>0&&unique(ids)),fixtures.storySpeakerIds);
record('fixture-phase13-tutorial-identities',fixtures.phase13TutorialIds.length===41&&unique(fixtures.phase13TutorialIds)&&fixtures.phase13TutorialIds.every(id=>/^tutorial\.[a-z0-9.-]+$/.test(id)));
record('fixture-full-tutorial-coverage',fixtures.allTutorialCoverageIds.length===79&&unique(fixtures.allTutorialCoverageIds)&&fixtures.phase13TutorialIds.every(id=>fixtures.allTutorialCoverageIds.includes(id)));
record('fixture-roster-identity',fixtures.fellowIds.length===18&&fixtures.familyIds.length===20&&unique(fixtures.fellowIds)&&unique(fixtures.familyIds));
record('fixture-roster-disjoint',new Set([...fixtures.fellowIds,...fixtures.familyIds]).size===38);
record('fixture-rank-groups',[1,2,3,4,5].every(rank=>Object.values(fixtures.fellowJoinRanks).filter(value=>value===rank).length===(rank===1?6:3))&&same(Object.keys(fixtures.fellowJoinRanks),fixtures.fellowIds),fixtures.fellowJoinRanks);
record('fixture-matches-production-fellows',same(sourceIds('const FELLOW_DEFS=[','const VILLAGE_CUTOUT_CONFIG_ID'),fixtures.fellowIds),sourceIds('const FELLOW_DEFS=[','const VILLAGE_CUTOUT_CONFIG_ID'));
record('fixture-matches-production-family',same(sourceIds('const FAMILY_DEFS=[','const COMPANION_DEFS=['),fixtures.familyIds),sourceIds('const FAMILY_DEFS=[','const COMPANION_DEFS=['));
record('fixture-cast-coverage-fields',same(fixtures.requiredCoverageFields,['profileQuoteId','ambientIds','authoredContentIds']));
record('fixture-four-opening-art-requirements',fixtures.openingArtRequirements.length===4&&unique(fixtures.openingArtRequirements.map(item=>item.speaker))&&same(fixtures.openingArtRequirements.map(item=>item.speaker),['family:elara','family:tamsin','family:isolde','fellow:deadpool']));
record('fixture-approved-art-fallbacks',same(fixtures.approvedOpeningPresentationModes,['transparent-cutout','approved-framed','attributed-text-only']));
record('fixture-controls',same(fixtures.requiredControls,['next','back','skip','log']));
record('fixture-legacy-modes',same(fixtures.requiredLegacyModes,['story','tower','trading','patrol','operations']));
record('fixture-viewports',fixtures.viewports.length===3&&fixtures.viewports.some(item=>item.width===320&&item.height===568)&&fixtures.viewports.some(item=>item.width===390&&item.height===844)&&fixtures.viewports.some(item=>item.reducedMotion===true),fixtures.viewports);

const assetFailures=Object.entries(assets.files).filter(([path,expected])=>!existsSync(resolve(ROOT,path))||sha(read(path))!==expected).map(([path])=>path);
record('phase11h-assets-byte-preserved',assets.sourceCommit===BASE&&Object.keys(assets.files).length===47&&assetFailures.length===0,{count:Object.keys(assets.files).length,failures:assetFailures});
record('phase11h-art-path-separation',source.includes('assets/portraits/fellows/village/${esc(def.art)}.png')&&source.includes("assets/portraits/${kind==='fellow'?'fellows':'family'}/${detail?'':'thumb/'}${definition.art}.webp"));
record('external-art-preserved',!/data:image\/(?:png|jpe?g|webp);base64,/i.test(source));
record('runner-loads-isolated-realms',text('qa/phase-13-independent/runner.js').includes('fixtures/contract-fixtures.json')&&text('qa/phase-13-independent/realm.js').includes('allowDestructive:true')&&text('qa/phase-13-independent/realm.js').includes('isolatedStorage:true')&&text('qa/phase-13-independent/realm.js').includes('__P13I_NATIVE_ACCESSES__'));
record('live-contract-fails-closed',text('qa/phase-13-independent/realm.js').includes('phase13-contract-unavailable')&&text('qa/phase-13-independent/realm.js').includes('if(!qa){'));
record('live-contract-covers-required-behavior',[
  'fresh-waystone-once','stage-one-order-and-bank','rank-jump-arrival-once','claim-two-client-one-winner',
  'tutorial-skip-complete-replay','cast-coverage-38','opening-art-policy','legacy-modes-dormant',
  'phase12-seam-preserved','mobile-controls-and-overflow'
].every(value=>text('qa/phase-13-independent/realm.js').includes(value)));
for(const path of ['verify.mjs','runner.js','realm.js']){
  const run=spawnSync(NODE,['--check',`qa/phase-13-independent/${path}`],{cwd:ROOT,encoding:'utf8'});
  record(`syntax-${path}`,run.status===0,run.stderr.trim());
}

if(PACKAGE_ONLY){
  const artifact={sha256:sha(read('index.html')),byteLength:read('index.html').length};
  record('exact-phase11h-base-artifact',artifact.sha256==='fb4d3f024307db2f01a9931a7f6ac3cde8245b3be6ab130d05c2c53d8a099df8'&&artifact.byteLength===1020510,artifact);
  const gate=spawnSync(NODE,['qa/phase-11h/verify.mjs'],{cwd:ROOT,encoding:'utf8',maxBuffer:256*1024*1024});
  const parsed=(()=>{try{return JSON.parse(gate.stdout)}catch{return null}})();
  record('phase11h-release-gate-74-of-74',gate.status===0&&parsed?.passed===74&&parsed?.failed===0,{status:gate.status,passed:parsed?.passed,failed:parsed?.failed,stderr:gate.stderr.trim().slice(-1000)});
}else{
  const paths=productionSources(),combined=paths.map(path=>text(path)).join('\n');
  const versions=[...combined.matchAll(/CURRENT_SCHEMA_VERSION\s*=\s*(\d+)/g)].map(match=>Number(match[1]));
  record('candidate-phase13-bridge-contract',combined.includes('__EVERSTEAD_PHASE_13_QA__')&&combined.includes(fixtures.bridgeVersion)&&combined.includes('allowDestructive')&&combined.includes('isolatedStorage')&&combined.includes('NATIVE_STORAGE'),paths);
  record('candidate-phase12-seam-preserved',combined.includes('__EVERSTEAD_PHASE_12_QA__')&&combined.includes(fixtures.schema.phase12ActivationId)&&Math.max(0,...versions)===12,versions);
  record('candidate-five-story-identities',fixtures.storyIds.every(id=>combined.includes(id)));
  record('candidate-phase13-tutorial-identities',fixtures.phase13TutorialIds.every(id=>combined.includes(id)));
  record('candidate-38-cast-identities',fixtures.fellowIds.concat(fixtures.familyIds).every(id=>combined.includes(`'${id}'`)||combined.includes(`\"${id}\"`)));
  record('candidate-opening-art-policy',fixtures.openingArtRequirements.every(item=>combined.includes(item.speaker.split(':')[1]))&&fixtures.approvedOpeningPresentationModes.every(mode=>combined.includes(mode)));
  record('candidate-campaign-table-renamed',!combined.match(/\b(?:const|let|var)\s+STORY\s*=\s*\[/));
}

const changed=git(['diff-tree','--no-commit-id','--name-only','-r',BASE,'HEAD']).trim().split('\n').filter(Boolean);
const owned=path=>['docs/PHASE_13_INDEPENDENT_QA_CONTRACT.md','docs/PHASE_13_INDEPENDENT_QA_RESULT.md'].includes(path)||path.startsWith('qa/phase-13-independent/');
record('committed-qa-paths-owned',!PACKAGE_ONLY||changed.length===0||changed.every(owned),PACKAGE_ONLY?changed:'Candidate mode intentionally permits implementation and design files; package ownership is enforced by --package-only.');
const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed;
const result={phase:'13-independent',mode:PACKAGE_ONLY?'PACKAGE_ONLY':'CANDIDATE',status:failed?'FAIL':'PASS',baseCommit:BASE,designCommit:DESIGN,total:rows.length,passed,failed,rows};
console.log(JSON.stringify(result,null,2));
if(failed)process.exitCode=1;
