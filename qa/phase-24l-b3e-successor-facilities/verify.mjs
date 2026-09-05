import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync,readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'../..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const sha=value=>createHash('sha256').update(value).digest('hex');
const contract=JSON.parse(read('qa/phase-24l-b3e-successor-facilities/contract.json'));
const sourcePath='src/phase24l-successor-facility-modals.js';
const cssPath='src/phase24l-successor-facility-modals.css';
const source=read(sourcePath),css=read(cssPath),index=read('index.html');
const git='/usr/bin/git';
let passed=0;
const check=(id,condition,detail='')=>{assert.equal(Boolean(condition),true,id);passed++;console.log(`PASS ${id}${detail?` · ${typeof detail==='string'?detail:JSON.stringify(detail)}`:''}`)};

check('contract-identifies-b3e-successor-suite',contract.id==='everstead.phase24l.successor-facility-modals.qa.v1'&&contract.phase==='24L-B3E');
check('contract-is-presentation-and-release-neutral',contract.schemaVersion===15&&contract.mechanicsChanged===false&&contract.saveChanged===false&&contract.publicReleaseChanged===false);
check('contract-records-eight-unique-facilities',contract.facilities.length===8&&new Set(contract.facilities.map(item=>item.id)).size===8&&contract.facilities.filter(item=>item.passiveBuilding).length===4);
check('contract-records-two-mobile-viewports',contract.viewports.map(item=>`${item.width}x${item.height}`).join(',')==='320x568,390x844');
check('candidate-source-and-style-exist',existsSync(resolve(root,sourcePath))&&existsSync(resolve(root,cssPath))&&source.length>9000&&css.length>5000,{sourceBytes:source.length,cssBytes:css.length});
check('candidate-and-browser-files-parse',[sourcePath,'qa/phase-24l-b3e-successor-facilities/browser.mjs','qa/phase-24l-b3e-successor-facilities/production.mjs'].every(path=>spawnSync(process.execPath,['--check',resolve(root,path)],{encoding:'utf8'}).status===0));
check('index-loads-one-versioned-style-and-script',(index.match(/phase24l-successor-facility-modals\.css\?v=phase24l-b3e-v1/g)||[]).length===1&&(index.match(/phase24l-successor-facility-modals\.js\?v=phase24l-b3e-v1/g)||[]).length===1);
check('index-has-one-bounded-b3e-install-block',(index.match(/Phase 24L-B3E bounded successor facility game sheets BEGIN/g)||[]).length===1&&(index.match(/Phase 24L-B3E bounded successor facility game sheets END/g)||[]).length===1);
check('b3e-installs-after-b3d-before-b1-qa',index.indexOf('__EVERSTEAD_PHASE24L_B3D_RESULT__')<index.indexOf(contract.resultGlobal)&&index.indexOf(contract.resultGlobal)<index.indexOf('PHASE_24L_B1_QA_RUNTIME'));
check('runtime-identity-is-frozen-and-hidden',source.includes(`const ID='${contract.runtimeId}'`)&&source.includes(`Object.defineProperty(globalThis,'${contract.runtimeGlobal}'`)&&/configurable:false,enumerable:false,writable:false/.test(source)&&/Object\.freeze\(\{version:VERSION,id:ID,schemaVersion:SCHEMA_VERSION,facilityIds:/.test(source));
check('installed-result-is-checked-and-hidden',index.includes(`globalThis.${contract.runtimeGlobal}`)&&index.includes(contract.runtimeId)&&index.includes(contract.resultGlobal)&&index.includes('mechanicsChanged!==false')&&index.includes('saveChanged!==false'));
check('source-has-no-save-storage-or-transaction-authority',!/(localStorage|sessionStorage|indexedDB|storageSet|storageRemove|commitPrepared|mutatePersisted|PERSISTED_RAW|saveMeta|CURRENT_TRANSACTION_SOURCES)/.test(source));
check('source-has-no-mechanics-reward-or-progression-authority',!/(applyRewards|finalizeFacilityClaim|\.begin\(|\.choose\(|\.commit\(|\.resolve\(|\.claim\(|globalGold\s*[+\-]=|localProgress\s*[+\-]=|relicStones\s*[+\-]=)/.test(source));
check('source-has-no-network-rng-or-timer-authority',!/(fetch\(|XMLHttpRequest|WebSocket|Math\.random|setInterval|setTimeout)/.test(source));
check('wraps-authoritative-modal-binder-inherited-first',/const bindModalBefore=slots\.bindModal\.get\(\)/.test(source)&&/const value=bindModalBefore\(\.\.\.args\)[\s\S]*?decorate\(document,document\.querySelector/.test(source));
check('decorates-only-canonical-successor-sheet',/querySelector\(':scope > \[data-phase20-21-sheet\]'\)/.test(source)&&/getAttribute\('data-facility-id'\)/.test(source)&&!/(data-phase18-apothecary-sheet|data-phase19-schoolhouse-sheet|data-phase16-restaurant-sheet)/.test(source));
check('all-eight-facility-tab-contracts-are-exact',contract.facilities.every((item,index)=>{
 const start=source.indexOf(`'${item.id}':Object.freeze({`),next=index+1<contract.facilities.length?source.indexOf(`'${contract.facilities[index+1].id}':Object.freeze({`,start+1):source.indexOf('\n });',start),block=source.slice(start,next);
 return start>=0&&next>start&&block.includes(`key:'${item.key}'`)&&[...block.matchAll(/Object\.freeze\(\{id:'([^']+)'/g)].map(match=>match[1]).join(',')===item.tabs.join(',');
}),contract.facilities.map(item=>({id:item.id,tabs:item.tabs})));
check('creates-one-direct-panel-stack-and-tablist',source.includes("'data-phase24l-b3e-panel-stack':config.key")&&source.includes("'data-phase24l-b3e-tabs':config.key")&&/root\.append\(stack\)/.test(source)&&/root\.append\(tabs\)/.test(source));
check('moves-one-live-authoritative-action-dock',/record\.querySelector\(':scope > \[data-phase20-21-action-dock\]'\)/.test(source)&&/if\(actionDock\)root\.append\(actionDock\)/.test(source));
check('moves-live-authoritative-content-without-cloning',/appendIf\(panels\[config\.requirement\|\|config\.work\],requirement\)/.test(source)&&/appendIf\(panels\[config\.work\],choice\)/.test(source)&&/appendIf\(panels\[config\.growth\|\|config\.work\],growth\)/.test(source)&&/appendIf\(panels\[config\.party\],participants\)/.test(source)&&/appendIf\(panels\[config\.result\],reward,receipt\)/.test(source)&&!/(cloneNode|outerHTML\s*=|innerHTML\s*=|insertAdjacentHTML|replaceChildren)/.test(source));
check('inactive-panels-are-hidden-inert-and-aria-hidden',/panel\.hidden=!active/.test(source)&&/panel\.inert=!active/.test(source)&&/panel\.setAttribute\('aria-hidden',String\(!active\)\)/.test(source));
check('tab-state-is-session-local-and-stage-routed',/const session=new Map/.test(source)&&/updateStage\(facilityId,config,recommendation/.test(source)&&/status==='claim-ready'/.test(source)&&/status==='growing'/.test(source)&&/status==='committed'/.test(source)&&/status==='engaged'/.test(source));
check('pointer-enter-space-preserve-selected-tab-focus',/button\.onclick=\(\)=>select\(button\.dataset\.phase24lB3eTab\)/.test(source)&&!/(focusPanel|panels\[next\].*focus)/.test(source));
check('arrow-home-end-roving-navigation-present',['ArrowLeft','ArrowRight','Home','End'].every(key=>source.includes(key))&&/buttons\[nextIndex\]\.focus\(\{preventScroll:true\}\)/.test(source));
check('canonical-close-and-backdrop-delegation-preserved',/querySelector\('\[data-phase20-21-close\]'\)/.test(source)&&/if\(event\.target===overlay\)\{close\.click\(\);return\}/.test(source));
check('bounded-modal-sheet-and-active-panel-have-no-vertical-scroll',/height:min\(760px,calc\(100dvh/.test(css)&&/modal\[data-phase24l-b3e-modal\][^{]*\{[^}]*overflow:hidden/.test(css)&&/\.phase20-21-sheet\[data-phase24l-b3e-facility\][^{]*\{[^}]*overflow:hidden/.test(css)&&/\.phase24l-b3e-panel\{[^}]*overflow:hidden/.test(css));
check('banked-queue-is-a-horizontal-live-node-rail',/phase24l-b3e-queue-rail/.test(source)&&/const rows=\[\.\.\.queue\.querySelectorAll\([^\n]+data-phase20-21-view-record[^\n]+\)\]/.test(source)&&/rail\.append\(\.\.\.rows\)/.test(source)&&/\.phase24l-b3e-queue-rail\{[^}]*display:flex[^}]*overflow-x:auto[^}]*overflow-y:hidden/.test(css));
check('four-tab-fixed-dock-and-touch-size-contract',/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/.test(css)&&/flex:0 0 54px/.test(css)&&/data-phase20-21-action-dock[^}]*\{[^}]*position:relative/.test(css)&&(css.match(/min-height:44px/g)||[]).length>=4);
check('small-mobile-reduced-motion-and-forced-colors',/@media\(max-width:369px\)/.test(css)&&/@media\(max-height:640px\)/.test(css)&&/@media\(prefers-reduced-motion:reduce\)/.test(css)&&/@media\(forced-colors:active\)/.test(css));

const predecessor=gitShow(`${contract.predecessorCommit}:index.html`);
check('predecessor-index-is-auditable',sha(predecessor)===contract.predecessorIndexSha256,contract.predecessorIndexSha256);
check('phase20-21-authority-files-byte-frozen',Object.entries(contract.predecessorAuthoritySha256).every(([path,expected])=>sha(read(path))===expected),contract.predecessorAuthoritySha256);
check('public-release-gate-function-is-byte-identical',extractGate(index)===extractGate(predecessor),extractGate(index));
check('production-runner-is-plain-mode-and-fail-closed',!read('qa/phase-24l-b3e-successor-facilities/production.mjs').includes('?qa=1')&&read('qa/phase-24l-b3e-successor-facilities/production.mjs').includes('__EVERSTEAD_PHASE_20_21_QA__'));

console.log(`RESULT ${passed} passed, 0 failed`);

function gitShow(spec){
 const result=spawnSync(git,['-c','core.trustctime=false','show',spec],{cwd:root,maxBuffer:16*1024*1024});
 check(`git-read-${spec.replace(/[^a-z0-9]+/gi,'-')}`,result.status===0,result.stderr?.toString().trim());
 return result.stdout.toString();
}
function extractGate(value){return value.match(/function phase2021PrivateReleaseAllowed\(\)\{[^\n]+/)?.[0]||''}
