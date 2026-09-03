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

const contract=JSON.parse(read('qa/phase-24f-more/contract.json'));
const index=read('index.html');
const workflow=read('.github/workflows/qa.yml');
const readme=read('README.md');
const packageJson=JSON.parse(read('package.json'));
const markers=contract.markers;

record('contract-is-exact-phase24f-more-gate',contract.contractVersion===1&&contract.phase==='24F'&&contract.authorityId==='everstead.phase24f.more-gate.v1'&&contract.schemaVersion===14);
record('contract-pins-exact-phase24e-predecessor',contract.predecessor.commit==='dc4f038d0553ea79cdae3b096f10e2cb70494f56'&&contract.predecessor.indexSha256==='b70e1fdf456fd8ae30b36b72f27d8bd3189bfe98ce15145473e5fc917fd453c1');
record('contract-has-four-profiles-two-required-viewports',contract.profiles.map(item=>item.id).join(',')==='fresh,established,thin,high'&&contract.viewports.map(item=>`${item.width}x${item.height}`).join(',')==='320x568,390x844');
record('contract-locks-more-owner-and-accessibility-baseline',contract.owner.id==='everstead.phase24f.more.schema14.v1'&&contract.minimumTargetPx===44&&contract.textScale===1.3);

const predecessor=git(['show',`${contract.predecessor.commit}:index.html`],{encoding:null});
record('predecessor-commit-is-reachable',git(['merge-base','--is-ancestor',contract.predecessor.commit,'HEAD']).status===0);
record('predecessor-index-has-frozen-identity',predecessor.status===0&&sha(predecessor.stdout)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:predecessor.status===0?sha(predecessor.stdout):predecessor.stderr?.toString()});

record('one-phase24f-styles-loader-block',count(index,markers.stylesBegin)===1&&count(index,markers.stylesEnd)===1,{begin:count(index,markers.stylesBegin),end:count(index,markers.stylesEnd)});
record('one-phase24f-ownership-block',count(index,markers.ownershipBegin)===1&&count(index,markers.ownershipEnd)===1,{begin:count(index,markers.ownershipBegin),end:count(index,markers.ownershipEnd)});
let projection=removeMarkedBlock(index,markers.stylesBegin,markers.stylesEnd);
projection=projection===null?null:removeMarkedBlock(projection,markers.ownershipBegin,markers.ownershipEnd);
record('exact-phase24e-predecessor-projection',projection!==null&&sha(projection)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:projection===null?null:sha(projection)});

const stylesStart=index.indexOf(markers.stylesBegin),stylesEnd=index.indexOf(markers.stylesEnd,stylesStart);
const ownershipStart=index.indexOf(markers.ownershipBegin),ownershipEnd=index.indexOf(markers.ownershipEnd,ownershipStart);
const stylesBlock=stylesStart>=0&&stylesEnd>=0?index.slice(stylesStart,stylesEnd+markers.stylesEnd.length):'';
const ownershipBlock=ownershipStart>=0&&ownershipEnd>=0?index.slice(ownershipStart,ownershipEnd+markers.ownershipEnd.length):'';
const compact=ownershipBlock.replaceAll(' ','').replaceAll('\n','');
const stylePaths=[...stylesBlock.matchAll(/href="([^"?]*phase24f[^"?]*\.css)(?:\?[^"#]*)?"/gi)].map(match=>match[1]);
const missingStyles=stylePaths.filter(relative=>!fs.existsSync(path.join(root,relative)));
const styles=stylePaths.length===1&&!missingStyles.length?read(stylePaths[0]):'';
const motionDeclarations=[...styles.matchAll(/(?:animation|transition)(?:-[a-z-]+)?\s*:\s*([^;}]*)/gi)].map(match=>match[1].trim());
record('phase24f-style-is-local-present-and-loads-before-head-close',stylePaths.length===1&&missingStyles.length===0&&stylesStart>index.indexOf('src/phase24e-shell-polish.css')&&stylesStart<index.indexOf('</head>'),{stylePaths,missingStyles});
record('phase24f-style-is-narrow-accessible-and-reduced-motion-safe',styles.includes('data-phase24f-more-owner')&&styles.includes('summary')&&styles.includes('min-height: 44px')&&styles.includes('@media (prefers-reduced-motion: reduce)')&&!/@keyframes/i.test(styles)&&motionDeclarations.length===2&&motionDeclarations.every(value=>/^none\s*!important$/i.test(value)),motionDeclarations);
record('ownership-block-is-after-phase24d-before-phase24e',ownershipStart>index.indexOf('/* Phase 24D limited public-preview presentation END */')&&ownershipEnd<index.indexOf('/* Phase 24E current-schema shell ownership BEGIN */'));
record('one-schema14-more-owner-id',count(ownershipBlock,contract.owner.id)===1&&ownershipBlock.includes(`const PHASE_24F_MORE_OWNER_ID='${contract.owner.id}'`)&&ownershipBlock.includes('S?.schemaVersion!==14'));
record('one-current-more-renderer-and-direct-final-assignment',count(ownershipBlock,'function phase24fCurrentMoreScreen()')===1&&compact.includes('moreScreen=phase24fCurrentMoreScreen;'));
record('source-aggregate-is-pre-phase24d-exactly-once',count(ownershipBlock,'moreScreenBeforePhase24D()')===1&&compact.includes('constinherited=moreScreenBeforePhase24D()'));
record('release-profile-is-reinstated-exactly-once',count(ownershipBlock,'data-phase24d-release-profile')===1&&compact.includes('card=phase24fPublicPreviewCardHtml()')&&compact.includes('previous=inherited.replace(anchor,card+anchor)'));
record('owner-requires-one-anchor-and-one-more-root',ownershipBlock.includes('anchors!==1||roots.length!==1')&&ownershipBlock.includes('data-phase22b-feature-surface="more"'));
record('owner-stamps-one-explicit-dom-identity',count(ownershipBlock,'data-phase24f-more-owner')===1&&ownershipBlock.includes('PHASE_24F_MORE_OWNER_ID'));
record('no-phase24f-wrapper-or-binder-chain',!/BeforePhase24F|ThroughPhase24F|bindCommonBeforePhase24F|bindModalBeforePhase24F/.test(index)&&!ownershipBlock.includes('bindCommon')&&!ownershipBlock.includes('bindModal'));
record('owner-does-not-author-persistence-progression-or-private-facilities',!/(mutatePersisted|commitPrepared|storageSet|setItem\s*\(|removeItem\s*\(|claim|reward|phase17|facility\.restaurant)/i.test(ownershipBlock));
record('owner-preserves-current-public-surface-vocabulary',['data-phase24d-release-profile','data-campaign-efficiency-preview','data-phase22b-feature-surface="more"'].every(token=>ownershipBlock.includes(token)));

const phase24eContract=JSON.parse(read('qa/phase-24e-shell/contract.json'));
record('phase24e-contract-and-checksum-manifest-byte-frozen',fileHash('qa/phase-24e-shell/contract.json')===contract.predecessor.phase24eContractSha256&&fileHash('qa/phase-24e-shell/checksums.sha256')===contract.predecessor.phase24eChecksumsSha256);
const mutableSuccessorFiles=new Set(['.github/workflows/qa.yml','README.md','index.html','package-lock.json','package.json']);
const frozenPhase24e=Object.entries(phase24eContract.expectedArtifacts).filter(([relative])=>!mutableSuccessorFiles.has(relative));
record('immutable-phase24e-evidence-remains-byte-frozen',frozenPhase24e.every(([relative,expected])=>fileHash(relative)===expected),frozenPhase24e.filter(([relative,expected])=>fileHash(relative)!==expected).map(([relative])=>relative));
record('complete-phase24e-package-remains-checksum-frozen',read('qa/phase-24e-shell/checksums.sha256').split(/\r?\n/).filter(Boolean).filter(line=>!mutableSuccessorFiles.has(line.trim().split(/\s+/).at(-1))).every(line=>{const [expected,...rest]=line.trim().split(/\s+/),relative=rest.at(-1);return fileHash(relative)===expected}));

record('package-exposes-phase24f-browser-command',packageJson.scripts?.['qa:phase24f-more']==='node qa/phase-24f-more/browser.mjs');
record('readme-links-current-more-gate',readme.includes('Phase 24F')&&readme.includes('qa/phase-24f-more/RESULT.md'));
record('workflow-archives-exact-phase24e-predecessor-first',workflow.includes(`git archive ${contract.predecessor.commit}`)&&workflow.indexOf(`git archive ${contract.predecessor.commit}`)<workflow.indexOf('qa/phase-24f-more/verify.mjs'));
record('workflow-runs-frozen-phase24e-from-predecessor',workflow.includes('qa/phase-24e-shell/verify.mjs')&&workflow.includes('qa/phase-24e-shell/checksums.sha256')&&workflow.includes('npm run qa:phase24e-shell'));
record('workflow-runs-phase24f-static-checksum-and-browser',workflow.includes('qa/phase-24f-more/verify.mjs')&&workflow.includes('qa/phase-24f-more/checksums.sha256')&&workflow.includes('npm run qa:phase24f-more'));

const expectedEntries=Object.entries(contract.expectedArtifacts||{});
record('artifact-freeze-populated',expectedEntries.length>=7,expectedEntries.map(([relative])=>relative));
for(const[relative,expected]of expectedEntries)record(`frozen artifact ${relative}`,/^[0-9a-f]{64}$/.test(expected)&&fileHash(relative)===expected,{expected,actual:fileHash(relative)});

const failed=rows.filter(item=>!item.pass);
for(const item of rows)console.log(`${item.pass?'PASS':'FAIL'} ${item.id}${item.detail?` · ${item.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
