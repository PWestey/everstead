import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const rows=[];
const bytes=relative=>fs.readFileSync(path.join(root,relative));
const read=relative=>bytes(relative).toString('utf8');
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const fileHash=relative=>sha(bytes(relative));
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const count=(source,token)=>source.split(token).length-1;
const git=(args,options={})=>spawnSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024,...options});

function removeMarkedBlock(source,begin,end){
  let start=source.indexOf(begin);
  const finishStart=source.indexOf(end,start+begin.length);
  if(start<0||finishStart<0)return null;
  const lineStart=source.lastIndexOf('\n',start-1)+1;
  if(/^\s*$/.test(source.slice(lineStart,start)))start=lineStart;
  let finish=finishStart+end.length;
  if(source.slice(finish,finish+2)==='\r\n')finish+=2;
  else if(source[finish]==='\n')finish+=1;
  return source.slice(0,start)+source.slice(finish);
}

const contract=JSON.parse(read('qa/phase-24e-shell/contract.json'));
const index=read('index.html');
const workflow=read('.github/workflows/qa.yml');
const readme=read('README.md');
const packageJson=JSON.parse(read('package.json'));
const markers=contract.markers;

record('contract-is-exact-phase24e-shell-gate',contract.contractVersion===1&&contract.phase==='24E'&&contract.authorityId==='everstead.phase24e.shell-gate.v1'&&contract.schemaVersion===14);
record('contract-pins-exact-phase24d-predecessor',contract.predecessor.commit==='8544a70586a21504a377cea6cb578c461f2463cd'&&contract.predecessor.indexSha256==='47efcceac0990e9b1c9b7f020d3fff3700a9be19258bb90c1371ad4414210668');
record('contract-has-four-profiles-two-required-viewports',contract.profiles.map(item=>item.id).join(',')==='fresh,established,thin,high'&&contract.viewports.map(item=>`${item.width}x${item.height}`).join(',')==='320x568,390x844');
record('contract-has-five-routes-four-public-rosters',contract.navigation.join(',')==='village,oaths,fellows,adventure,more'&&contract.rosters.join(',')==='fellows,family,companions,relics'&&contract.expectedRosterCounts.relics===6);

const predecessor=git(['show',`${contract.predecessor.commit}:index.html`],{encoding:null});
record('predecessor-commit-is-reachable',git(['merge-base','--is-ancestor',contract.predecessor.commit,'HEAD']).status===0);
record('predecessor-index-has-frozen-identity',predecessor.status===0&&sha(predecessor.stdout)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:predecessor.status===0?sha(predecessor.stdout):predecessor.stderr?.toString()});

record('one-phase24e-styles-loader-block',count(index,markers.stylesBegin)===1&&count(index,markers.stylesEnd)===1,{begin:count(index,markers.stylesBegin),end:count(index,markers.stylesEnd)});
record('one-phase24e-controller-loader-block',count(index,markers.controllerBegin)===1&&count(index,markers.controllerEnd)===1,{begin:count(index,markers.controllerBegin),end:count(index,markers.controllerEnd)});
record('one-phase24e-ownership-block',count(index,markers.ownershipBegin)===1&&count(index,markers.ownershipEnd)===1,{begin:count(index,markers.ownershipBegin),end:count(index,markers.ownershipEnd)});
let projection=index;
projection=removeMarkedBlock(projection,markers.stylesBegin,markers.stylesEnd);
projection=projection===null?null:removeMarkedBlock(projection,markers.controllerBegin,markers.controllerEnd);
projection=projection===null?null:removeMarkedBlock(projection,markers.ownershipBegin,markers.ownershipEnd);
record('exact-phase24d-predecessor-projection',projection!==null&&sha(projection)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:projection===null?null:sha(projection)});

const stylesStart=index.indexOf(markers.stylesBegin),stylesEnd=index.indexOf(markers.stylesEnd,stylesStart);
const controllerStart=index.indexOf(markers.controllerBegin),controllerEnd=index.indexOf(markers.controllerEnd,controllerStart);
const ownershipStart=index.indexOf(markers.ownershipBegin),ownershipEnd=index.indexOf(markers.ownershipEnd,ownershipStart);
const assetsBlock=(stylesStart>=0&&stylesEnd>=0?index.slice(stylesStart,stylesEnd+markers.stylesEnd.length):'')+(controllerStart>=0&&controllerEnd>=0?index.slice(controllerStart,controllerEnd+markers.controllerEnd.length):'');
const ownershipBlock=ownershipStart>=0&&ownershipEnd>=0?index.slice(ownershipStart,ownershipEnd+markers.ownershipEnd.length):'';
const assetPaths=[...assetsBlock.matchAll(/(?:src|href)="([^"?]*phase24e[^"?]*\.(?:js|css))(?:\?[^"#]*)?"/gi)].map(match=>match[1]);
const missingAssets=assetPaths.filter(relative=>!fs.existsSync(path.join(root,relative)));
record('phase24e-assets-are-local-and-present',assetPaths.length===2&&assetPaths.some(item=>item.endsWith('.js'))&&assetPaths.some(item=>item.endsWith('.css'))&&missingAssets.length===0,{assetPaths,missingAssets});
const controllerPath=assetPaths.find(item=>item.endsWith('.js'))||'';
const stylePath=assetPaths.find(item=>item.endsWith('.css'))||'';
const controller=controllerPath?read(controllerPath):'';
const styles=stylePath?read(stylePath):'';

record('styles-load-after-phase22-and-before-head-close',stylesStart>index.lastIndexOf('src/phase22c-facility-polish.css',stylesStart)&&stylesStart<index.indexOf('</head>'));
record('controller-loads-after-phase24d-and-before-inline-app',controllerStart>index.indexOf('src/phase24d-public-preview-profile.js')&&controllerStart<index.indexOf('<script>',controllerStart));

record('controller-has-one-frozen-public-identity',count(controller,contract.controller.global)>=1&&controller.includes(`ID='${contract.controller.id}'`)&&controller.includes('VERSION=1')&&controller.includes('SCHEMA_VERSION=14')&&controller.includes('Object.freeze'));
record('controller-exposes-read-only-diagnostics',controller.includes('diagnostics')&&['renderIdentity','navigationCalls','rosterSelectionCalls','topbarRenders'].every(token=>controller.includes(token))&&controller.includes('Object.freeze'));
record('ownership-installs-schema14-relic-roster-render',ownershipBlock.includes('phase24eCurrentRelicRoster')&&ownershipBlock.includes('relicRosterScreen()')&&ownershipBlock.includes('data-phase24e-roster-owner')&&ownershipBlock.replaceAll(' ','').includes('rosterScreen=phase24eCurrentRosterScreen'));
record('shell-dom-has-explicit-owner-markers',['data-phase24e-topbar','data-phase24e-brand','data-phase24e-resources','data-phase24e-shell-owner'].every(token=>controller.includes(token)||ownershipBlock.includes(token)));
record('ownership-installs-direct-final-assignments',['nav=function','setRoster=function','topbar=function','rosterScreen=phase24eCurrentRosterScreen'].every(token=>ownershipBlock.replaceAll(' ','').includes(token)));
record('no-phase24e-wrapper-alias-chain',!/BeforePhase24E|ThroughPhase24E|bindCommonBeforePhase24E/.test(index));
record('controller-does-not-author-persistence-or-progression',!/(mutatePersisted|commitPrepared|storageSet|setItem\s*\(|removeItem\s*\(|campaign-run|claim-)/.test(controller));
record('styles-compose-with-responsive-accessibility-contract',styles.includes('@media(max-width:420px)')&&styles.includes('@media(max-width:360px)')&&styles.includes('min-height:44px')&&index.includes('@media(prefers-reduced-motion:reduce)')&&index.includes('overflow-wrap:anywhere'));

const phase24dContract=JSON.parse(read('qa/phase-24d-public-preview/contract.json'));
record('phase24d-contract-and-checksum-manifest-byte-frozen',fileHash('qa/phase-24d-public-preview/contract.json')===contract.predecessor.phase24dContractSha256&&fileHash('qa/phase-24d-public-preview/checksums.sha256')===contract.predecessor.phase24dChecksumsSha256);
const mutableSuccessorFiles=new Set(['.github/workflows/qa.yml','README.md','index.html','package-lock.json','package.json']);
const frozenPhase24d=Object.entries(phase24dContract.expectedArtifacts).filter(([relative])=>!mutableSuccessorFiles.has(relative));
record('immutable-phase24d-evidence-remains-byte-frozen',frozenPhase24d.every(([relative,expected])=>fileHash(relative)===expected),frozenPhase24d.filter(([relative,expected])=>fileHash(relative)!==expected).map(([relative])=>relative));

record('package-exposes-phase24e-browser-command',packageJson.scripts?.['qa:phase24e-shell']==='node qa/phase-24e-shell/browser.mjs');
record('readme-links-current-shell-gate',readme.includes('Phase 24E')&&readme.includes('qa/phase-24e-shell/RESULT.md'));
record('workflow-archives-exact-predecessor-first',workflow.includes(`git archive ${contract.predecessor.commit}`)&&workflow.indexOf(`git archive ${contract.predecessor.commit}`)<workflow.indexOf('qa/phase-24e-shell/verify.mjs'));
record('workflow-runs-frozen-phase24d-and-phase24e-gates',workflow.includes('qa/phase-24d-public-preview/verify.mjs')&&workflow.includes('qa/phase-24d-public-preview/checksums.sha256')&&workflow.includes('qa/phase-24e-shell/verify.mjs')&&workflow.includes('qa/phase-24e-shell/checksums.sha256')&&workflow.includes('npm run qa:phase24e-shell'));

const expectedEntries=Object.entries(contract.expectedArtifacts||{});
record('artifact-freeze-populated',expectedEntries.length>=8,expectedEntries.map(([relative])=>relative));
for(const[relative,expected]of expectedEntries)record(`frozen artifact ${relative}`,/^[0-9a-f]{64}$/.test(expected)&&fileHash(relative)===expected,{expected,actual:fileHash(relative)});

const failed=rows.filter(item=>!item.pass);
for(const item of rows)console.log(`${item.pass?'PASS':'FAIL'} ${item.id}${item.detail?` · ${item.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
