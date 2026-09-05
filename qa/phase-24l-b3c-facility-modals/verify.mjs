import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';

const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'../..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const hash=value=>createHash('sha256').update(value).digest('hex');
const index=read('index.html');
const source=read('src/phase24l-facility-modals.js');
const css=read('src/phase24l-facility-modals.css');
const git='/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/git';
const predecessorResult=spawnSync(git,['show','5181a5f30d8a2821f887633e9022a4ce6b050318:index.html'],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
const predecessor=predecessorResult.stdout;
let passed=0;
const check=(name,condition,detail='')=>{assert.equal(Boolean(condition),true,name);passed++;console.log(`PASS ${name}${detail?` · ${typeof detail==='string'?detail:JSON.stringify(detail)}`:''}`)};

check('contract-identifies-phase-24l-b3c',JSON.parse(read('qa/phase-24l-b3c-facility-modals/contract.json')).id==='everstead.phase24l.facility-modals.v1');
check('contract-and-result-documents-exist',existsSync(resolve(root,'docs/PHASE_24L_B3C_CONTRACT.md'))&&existsSync(resolve(root,'docs/PHASE_24L_B3C_RESULT.md')));
check('candidate-files-exist',source.length>8000&&css.length>6000,{sourceBytes:source.length,cssBytes:css.length});
check('source-syntax-valid',spawnSync(process.execPath,['--check',resolve(root,'src/phase24l-facility-modals.js')],{encoding:'utf8'}).status===0);
check('index-has-one-versioned-css-and-script',(index.match(/phase24l-facility-modals\.css\?v=phase24l-b3c-v1/g)||[]).length===1&&(index.match(/phase24l-facility-modals\.js\?v=phase24l-b3c-v1/g)||[]).length===1);
check('index-has-one-bounded-install-block',(index.match(/Phase 24L-B3C bounded Building and Restaurant game sheets BEGIN/g)||[]).length===1&&(index.match(/Phase 24L-B3C bounded Building and Restaurant game sheets END/g)||[]).length===1);
check('style-and-runtime-load-before-inline-owner',index.indexOf('phase24l-facility-modals.css')<index.indexOf('</head>')&&index.indexOf('phase24l-facility-modals.js')<index.indexOf('PHASE_24L_B3C=globalThis'));
check('owner-installs-after-b3b-and-before-b1-qa',index.indexOf('PHASE_24L_B3B_RESULT')<index.indexOf('PHASE_24L_B3C_RESULT')&&index.indexOf('PHASE_24L_B3C_RESULT')<index.indexOf('PHASE_24L_B1_QA_RUNTIME'));
check('schema-and-release-profile-unchanged',/CURRENT_SCHEMA_VERSION=15/.test(index)&&/const SCHEMA_VERSION=15/.test(source)&&!source.includes('publicReleaseAllowed'));
check('hidden-frozen-versioned-api',/Object\.defineProperty\(globalThis,'EVERSTEAD_PHASE24L_FACILITY_MODALS'/.test(source)&&/Object\.freeze\(\{version:VERSION,id:ID,schemaVersion:SCHEMA_VERSION,install,diagnostics\}\)/.test(source));
check('presentation-only-no-storage-authority',!/(localStorage|sessionStorage|indexedDB|storageSet|storageRemove|commitPrepared|mutatePersisted)/.test(source));
check('presentation-only-no-reward-or-progression-authority',!/(phaseSixteenClaim|phaseSixteenServe|assignFamilyToBuilding|modalAction|gold\s*[+\-]=|\.level\s*\+\+)/.test(source));
check('no-network-random-or-recurring-timer-authority',!/(fetch\(|XMLHttpRequest|WebSocket|Math\.random|setInterval|setTimeout)/.test(source));
check('wraps-current-modal-binder-and-invokes-inherited-first',/const bindModalBefore=slots\.bindModal\.get\(\)/.test(source)&&/const value=bindModalBefore\(\.\.\.args\)/.test(source));
check('moves-existing-live-building-controls',/panels\.assign\.append\(assignment\)/.test(source)&&/panels\.production\.append\(production\)/.test(source)&&/actionDock\.append\(upgradeButton\)/.test(source));
check('moves-existing-live-restaurant-controls',/panels\.guest\.append\(progress,customer\)/.test(source)&&/panels\.kitchen\.append\(service\)/.test(source)&&/panels\.pantry\.append\(stock\)/.test(source)&&/root\.append\(panelStack,actions,tabs\)/.test(source));
check('does-not-clone-or-rebuild-live-controls',!/(cloneNode|outerHTML\s*=|insertAdjacentHTML)/.test(source));
check('building-has-three-exclusive-local-tabs',BUILDING_TABS(source).join(',')==='assign,production,upgrade'&&/panel\.hidden=!active/.test(source)&&/panel\.inert=!active/.test(source));
check('restaurant-has-four-exclusive-local-tabs',RESTAURANT_TABS(source).join(',')==='guest,kitchen,pantry,result');
check('restaurant-lifecycle-selects-kitchen-and-result',/lifecycle==='claim-ready'\)return'result'/.test(source)&&/ready-to-serve'\]\.includes\(lifecycle\)\)return'kitchen'/.test(source));
check('local-state-survives-modal-rebuilds',/const buildingTabs=Object\.create\(null\)/.test(source)&&/let restaurantTab='guest'/.test(source)&&/restaurantLifecycle!==lifecycle/.test(source));
check('keyboard-tab-navigation-present',/ArrowLeft/.test(source)&&/ArrowRight/.test(source)&&/Home/.test(source)&&/End/.test(source));
check('generic-modal-focus-trap-excludes-roving-hidden-and-inert-controls',/function phaseTenBThreeFocusable\(modal\)/.test(index)&&/item\.getAttribute\('tabindex'\)!=='-1'/.test(index)&&/item\.closest\('\[hidden\],\[inert\],\[aria-hidden="true"\]'\)/.test(index)&&/item\.getClientRects\(\)\.length>0/.test(index));
check('mechanics-and-save-claims-explicitly-false',/mechanicsChanged:false,saveChanged:false/.test(source)&&/PHASE_24L_B3C_RESULT\.mechanicsChanged!==false/.test(index));
check('current-schema-restaurant-qa-route-is-isolated-and-bounded',/function phase24lB3cInstallQaBridge\(\)/.test(index)&&/if\(!QA_BRIDGE_ALLOWED\|\|!QA_ALLOW_DESTRUCTIVE\)return false/.test(index)&&/requireQaDestructiveAuthorization\(\)/.test(index)&&/PHASE_SEVENTEEN_INSTALL_RESULT\?\.qaPrepareFacilityIntroductionInState/.test(index)&&/PHASE_24C2D_QA_SOURCE/.test(index)&&/phase-24l-b3c-facility-modals-qa-v1/.test(index));
check('bounded-viewport-and-hidden-outer-overflow',/height:min\(760px,calc\(100dvh/.test(css)&&/overflow:hidden/.test(css)&&/\.phase24l-b3c-panel\{[^}]*overflow:auto/.test(css));
check('fixed-tab-and-action-regions',/flex:0 0 54px/.test(css)&&/\.phase16-actions\{order:3;display:grid;flex:0 0 auto/.test(css));
check('minimum-touch-targets-and-small-phone-layout',/min-height:44px/.test(css)&&/@media\(max-width:369px\)/.test(css)&&/@media\(max-height:640px\)/.test(css));
check('reduced-motion-and-forced-colors',/@media\(prefers-reduced-motion:reduce\)/.test(css)&&/@media\(forced-colors:active\)/.test(css));
check('no-third-party-trade-dress-or-monetization-copy',!/(isekai|slow life|vip|gacha|summon|purchase|storefront)/i.test(source+css));
check('predecessor-recorded-for-audit',predecessorResult.status===0&&hash(predecessor)==='e562f0cd63bdde61d1e40af98c4f29fc6346bbcebe8b17bc04ea853b37c8952f');

console.log(`RESULT ${passed} passed, 0 failed`);

function BUILDING_TABS(value){return [...value.matchAll(/Object\.freeze\(\{id:'(assign|production|upgrade)'/g)].map(match=>match[1])}
function RESTAURANT_TABS(value){return [...value.matchAll(/Object\.freeze\(\{id:'(guest|kitchen|pantry|result)'/g)].map(match=>match[1])}
