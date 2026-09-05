import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'../..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const hash=value=>createHash('sha256').update(value).digest('hex');
const contract=JSON.parse(read('qa/phase-24l-b3d-private-facilities/contract.json'));
const index=read('index.html');
const source=read('src/phase24l-private-facility-modals.js');
const css=read('src/phase24l-private-facility-modals.css');
const git='/usr/bin/git';
let passed=0;
const check=(name,condition,detail='')=>{assert.equal(Boolean(condition),true,name);passed++;console.log(`PASS ${name}${detail?` · ${typeof detail==='string'?detail:JSON.stringify(detail)}`:''}`)};

check('contract-identifies-b3d-private-facility-suite',contract.id==='everstead.phase24l.private-facility-modals.qa.v1');
check('contract-is-presentation-only',contract.mechanicsChanged===false&&contract.saveChanged===false&&contract.usesExistingPhase1819QaBridge===true);
check('contract-records-two-mobile-viewports',contract.viewports.join(',')==='320x568,390x844');
check('candidate-files-exist',existsSync(resolve(root,'src/phase24l-private-facility-modals.js'))&&existsSync(resolve(root,'src/phase24l-private-facility-modals.css'))&&source.length>7000&&css.length>4000,{sourceBytes:source.length,cssBytes:css.length});
check('source-syntax-valid',spawnSync(process.execPath,['--check',resolve(root,'src/phase24l-private-facility-modals.js')],{encoding:'utf8'}).status===0);
check('index-has-one-versioned-style-and-script',(index.match(/phase24l-private-facility-modals\.css\?v=phase24l-b3d-v1/g)||[]).length===1&&(index.match(/phase24l-private-facility-modals\.js\?v=phase24l-b3d-v1/g)||[]).length===1);
check('index-has-one-bounded-install-block',(index.match(/Phase 24L-B3D bounded private facility game sheets BEGIN/g)||[]).length===1&&(index.match(/Phase 24L-B3D bounded private facility game sheets END/g)||[]).length===1);
check('b3d-installs-after-b3c-and-before-b1-qa',index.indexOf('PHASE_24L_B3C_RESULT')<index.indexOf('PHASE_24L_B3D_RESULT')&&index.indexOf('PHASE_24L_B3D_RESULT')<index.indexOf('PHASE_24L_B1_QA_RUNTIME'));
check('hidden-frozen-versioned-runtime',/EVERSTEAD_PHASE24L_PRIVATE_FACILITY_MODALS/.test(source)&&/Object\.freeze\(\{version:VERSION,id:ID,schemaVersion:SCHEMA_VERSION,install,diagnostics\}\)/.test(source));
check('schema-and-release-authority-unchanged',/const SCHEMA_VERSION=15/.test(source)&&/CURRENT_SCHEMA_VERSION=15/.test(index)&&!/(publicReleaseAllowed|privateReleaseAllowed|facilityProgress|capabilityIds)/.test(source));
check('presentation-has-no-save-or-storage-authority',!/(localStorage|sessionStorage|indexedDB|storageSet|storageRemove|commitPrepared|mutatePersisted|PERSISTED_RAW)/.test(source));
check('presentation-has-no-reward-or-progression-authority',!/(applyRewards|finalizeFacilityClaim|beginApothecary|resolveApothecary|seatPupil|beginLesson|resolveLesson|gold\s*[+\-]=|mastery\s*[+\-]=|education\s*[+\-]=)/.test(source));
check('presentation-has-no-network-rng-or-timer-authority',!/(fetch\(|XMLHttpRequest|WebSocket|Math\.random|setInterval|setTimeout)/.test(source));
check('wraps-existing-binder-inherited-first',/const bindModalBefore=slots\.bindModal\.get\(\)/.test(source)&&/const value=bindModalBefore\(\.\.\.args\)[\s\S]*?decorateApothecary\(document,modal\)/.test(source));
check('decorates-only-authoritative-private-sheets',/\[data-phase18-apothecary-sheet\]/.test(source)&&/\[data-phase19-schoolhouse-sheet\]/.test(source));
check('moves-live-apothecary-nodes',/appendIf\(panels\.case,[^;]*activity,evidence\)/.test(source)&&/appendIf\(panels\.diagnose,diagnosis\)/.test(source)&&/appendIf\(panels\.remedy,remedy,guidance\)/.test(source)&&/root\.append\(stack,actions\)/.test(source));
check('moves-live-schoolhouse-nodes',/appendIf\(panels\.pupils,[^;]*pupils\)/.test(source)&&/appendIf\(panels\.lesson,activity\)/.test(source)&&/appendIf\(panels\.teach,approach,mentor\)/.test(source));
check('does-not-clone-or-rebuild-mechanical-controls',!/(cloneNode|outerHTML\s*=|insertAdjacentHTML|replaceChildren)/.test(source));
check('apothecary-tabs-match-contract',tabs(source,'apothecary').join(',')===contract.apothecaryTabs.join(','));
check('schoolhouse-tabs-match-contract',tabs(source,'schoolhouse').join(',')===contract.schoolhouseTabs.join(','));
check('panels-are-exclusive-hidden-and-inert',/panel\.hidden=!active/.test(source)&&/panel\.inert=!active/.test(source)&&/panel\.setAttribute\('aria-hidden',String\(!active\)\)/.test(source));
check('local-tab-state-is-not-persisted',/const state=\{\s*apothecary:\{tab:'case',stage:null\},\s*schoolhouse:\{tab:'pupils',stage:null\}/.test(source));
check('semantic-stage-routing-present',/apothecaryStage\(root\)/.test(source)&&/schoolhouseStage\(root\)/.test(source)&&/updateStage\('apothecary'/.test(source)&&/updateStage\('schoolhouse'/.test(source));
check('keyboard-tab-navigation-present',['ArrowLeft','ArrowRight','Home','End'].every(key=>source.includes(key)));
check('canonical-close-delegation-preserved',/bindBackdropToCanonicalClose\(modal,'\[data-phase18-close\]'\)/.test(source)&&/bindBackdropToCanonicalClose\(modal,'\[data-phase19-close\]'\)/.test(source)&&/close\.click\(\)/.test(source));
check('bounded-modal-and-scroll-isolation',/height:min\(760px,calc\(100dvh/.test(css)&&/modal\[data-phase24l-b3d-modal\][^{]*\{[^}]*overflow:hidden/.test(css)&&/\.phase24l-b3d-panel\{[^}]*overflow:auto/.test(css));
check('fixed-four-tab-and-action-regions',/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/.test(css)&&/flex:0 0 54px/.test(css)&&/schoolhouse[^}]*\.phase-1819-actions\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/.test(css));
check('minimum-touch-targets-and-small-phone-rules',/min-height:44px/.test(css)&&/@media\(max-width:369px\)/.test(css)&&/@media\(max-height:640px\)/.test(css));
check('reduced-motion-and-forced-colors',/@media\(prefers-reduced-motion:reduce\)/.test(css)&&/@media\(forced-colors:active\)/.test(css));
check('predecessor-index-is-auditable',predecessorHash()===contract.predecessorIndexSha256,contract.predecessorIndexSha256);

console.log(`RESULT ${passed} passed, 0 failed`);

function tabs(value,kind){
 const block=value.match(new RegExp(`${kind}:Object\\.freeze\\(\\[([\\s\\S]*?)\\n\\s*\\]\\)`))?.[1]||'';
 return [...block.matchAll(/Object\.freeze\(\{id:'([^']+)'/g)].map(match=>match[1]);
}
function predecessorHash(){
 const result=spawnSync(git,['-c','core.trustctime=false','show',`${contract.predecessorCommit}:index.html`],{cwd:root,maxBuffer:8*1024*1024});
 check('predecessor-git-read-succeeded',result.status===0,result.stderr?.toString().trim());
 return hash(result.stdout);
}
