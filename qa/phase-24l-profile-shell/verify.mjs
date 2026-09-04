import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));
const rows=[];
const read=relative=>fs.readFileSync(path.join(root,relative));
const text=relative=>read(relative).toString('utf8');
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const git=args=>spawnSync('git',args,{cwd:root,encoding:null,maxBuffer:64*1024*1024});

const index=text('index.html');
const runtime=text('src/phase24l-profile-shell.js');
const css=text('src/phase24l-profile-shell.css');
const predecessor=git(['show',`${contract.predecessor.commit}:index.html`]);
const head='<!-- Phase 24L-A viewport profile shell BEGIN -->\n<link rel="stylesheet" href="src/phase24l-profile-shell.css?v=phase24l-v1">\n<!-- Phase 24L-A viewport profile shell END -->\n';
const script='  <script src="src/phase24l-profile-shell.js?v=phase24l-v1"></script>\n';
const install=/\/\* Phase 24L-A viewport profile shell ownership BEGIN \*\/[\s\S]*?\/\* Phase 24L-A viewport profile shell ownership END \*\/\n/;

record('exact-contract',contract.contractVersion===1&&contract.phase==='24L-A'&&contract.authorityId==='everstead.phase24l.profile-shell.v1'&&contract.schemaVersion===14);
record('predecessor-is-ancestor',git(['merge-base','--is-ancestor',contract.predecessor.commit,'HEAD']).status===0);
record('predecessor-index-is-frozen',predecessor.status===0&&sha(predecessor.stdout)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:predecessor.status===0?sha(predecessor.stdout):null});
const stripped=index.replace(head,'').replace(script,'').replace(install,'');
record('index-change-is-additive-presentation-install',predecessor.status===0&&Buffer.compare(Buffer.from(stripped),predecessor.stdout)===0);
record('save-release-identities-unchanged',index.includes("const NS='oathforge_new_world_proto_v01'")&&index.includes('CURRENT_SCHEMA_VERSION=14')&&index.includes("RELEASE_VERSION='1.0.0-preview.1'"));
record('runtime-installs-after-phase24k',index.indexOf('Phase 24L-A viewport profile shell ownership BEGIN')>index.indexOf('Phase 24K art-first screen ownership END')&&index.indexOf('src/phase24l-profile-shell.js')>index.indexOf('src/phase24k-screen-art.js'));
record('runtime-exports-exact-current-schema-owner',runtime.includes("const ID='everstead.phase24l.profile-shell.v1'")&&runtime.includes('const SCHEMA_VERSION=14')&&runtime.includes("Object.defineProperty(globalThis,'EVERSTEAD_PHASE24L_PROFILE_SHELL'")&&index.includes("PHASE_24L_INSTALL_RESULT.mechanicsChanged!==false")&&index.includes("PHASE_24L_INSTALL_RESULT.saveChanged!==false"));
record('presentation-runtime-has-no-persistence-authority',!/(localStorage|sessionStorage|indexedDB|Storage\.|setItem|removeItem|clear\(|saveMeta|mutatePersisted|commitPrepared|PERSISTED_RAW|CURRENT_TRANSACTION_SOURCES)/.test(runtime));
record('presentation-runtime-has-no-reward-or-exp-mutation',!/(pendingRewards|rewardReceipt|claimReward|grantExp|spendExp|\.exp\s*[+\-*/]?=|\.level\s*[+\-*/]?=|\.shards\s*[+\-*/]?=)/.test(runtime));

for(const [kind,definition] of Object.entries(contract.profiles)){
  const list=definition.tabs.map(id=>`id:'${id}'`);
  record(`${kind}-declares-exact-local-task-tabs`,list.every(fragment=>runtime.includes(fragment))&&definition.tabs.length===5,{tabs:definition.tabs});
}
record('all-profile-openers-are-wrapped',runtime.includes("wrapRoster('openFellow','fellow')")&&runtime.includes("wrapRoster('openFamily','family')")&&runtime.includes("wrapRoster('openCompanion','companion')")&&runtime.includes('slots.openPlayerProfile.set(function()'));
record('single-sheet-exclusive-collapse-contract',runtime.includes("shell.dataset.phase24lActivePanel=active||'closed'")&&runtime.includes('if(current===id)setActive(shell,null')&&runtime.includes('panel.hidden=!shown')&&runtime.includes("panel.setAttribute('aria-hidden',String(!shown))"));
record('escape-collapses-before-profile-close',runtime.includes("if(shell&&active&&active!=='closed')return setActive(shell,null,{focusTab:true})")&&runtime.includes("document.documentElement.classList.remove('phase24l-profile-open')"));
record('top-profile-close-remains-direct-close',runtime.includes("querySelectorAll(':scope [data-modal-close]')")&&runtime.includes('button.onclick=()=>closeProfile?.()'));
record('hidden-controls-are-inert-and-restored',runtime.includes('const controlState=new WeakMap()')&&runtime.includes('control.disabled=true')&&runtime.includes("control.setAttribute('tabindex','-1')")&&runtime.includes('controlState.delete(control)'));
record('keyboard-roving-contract',runtime.includes("event.key==='ArrowRight'")&&runtime.includes("event.key==='ArrowLeft'")&&runtime.includes("event.key==='Home'")&&runtime.includes("event.key==='End'")&&runtime.includes('target.focus({preventScroll:true})'));
record('tabpanel-accessibility-wiring',runtime.includes("panel.setAttribute('role','tabpanel')")&&runtime.includes("panel.setAttribute('aria-labelledby',tabId)")&&runtime.includes("dock.setAttribute('role','tablist')")&&runtime.includes('role="tab"')&&runtime.includes('aria-controls='));
record('wayfarer-remains-explicitly-non-roster',runtime.includes("modal.setAttribute('data-wayfarer','player.wayfarer')")&&runtime.includes('never enters a collectible roster or Power calculation'));
record('honest-wayfarer-redirects',runtime.includes('More → Chronicle')&&runtime.includes('Accessibility, save export, recovery, and diagnostics remain in More'));
record('profile-content-is-reused-not-reimplemented',runtime.includes('host.append(panel)')&&runtime.includes("querySelector('[data-phase24l-sheet-content]')?.append(node)")&&runtime.includes('source.cloneNode(true)'));
record('compact-overview-and-bonds-adapters-are-present',runtime.includes("kind==='fellow'&&id==='overview'&&typeof api.fellowOverviewPanel==='function'")&&runtime.includes("kind==='fellow'&&id==='bonds'&&typeof api.fellowBondsPanel==='function'")&&index.includes('fellowOverviewPanel:phase24lFellowOverviewPanel')&&index.includes('fellowBondsPanel:phase24lFellowBondsPanel')&&index.includes('data-phase24l-fellow-overview')&&index.includes('data-phase24l-fellow-bonds'));
record('compact-relic-and-family-building-adapters-are-present',runtime.includes("kind==='fellow'&&id==='relics'&&typeof api.fellowRelicPanel==='function'")&&runtime.includes("kind==='family'&&id==='building'&&typeof api.familyBuildingPanel==='function'")&&index.includes('fellowRelicPanel:phase24lFellowRelicPanel')&&index.includes('familyBuildingPanel:phase24lFamilyBuildingPanel')&&index.includes('data-phase24l-family-building-select')&&index.includes('data-phase24l-family-building-apply')&&index.includes('assignFamilyToBuilding,openRelic'));
record('compact-companion-adapters-are-present',runtime.includes("kind==='companion'&&id==='overview'&&typeof api.companionOverviewPanel==='function'")&&runtime.includes("kind==='companion'&&id==='assignment'&&typeof api.companionAssignmentPanel==='function'")&&runtime.includes("kind==='companion'&&id==='mastery'&&typeof api.companionMasteryPanel==='function'")&&index.includes('companionOverviewPanel:phase24lCompanionOverviewPanel')&&index.includes('companionAssignmentPanel:phase24lCompanionAssignmentPanel')&&index.includes('companionMasteryPanel:phase24lCompanionMasteryPanel')&&index.includes('data-phase24l-companion-overview')&&index.includes('data-phase24l-companion-assignment')&&index.includes('data-phase24l-companion-mastery'));
record('compact-wayfarer-objective-and-unlocks-adapters-are-present',runtime.includes("typeof api.wayfarerObjective==='function'")&&runtime.includes("id==='unlocks'&&typeof api.wayfarerUnlocksPanel==='function'")&&runtime.includes('data-phase24l-wayfarer-objective')&&index.includes('wayfarerObjective:phase24lWayfarerObjective')&&index.includes('wayfarerUnlocksPanel:phase24lWayfarerUnlocksPanel')&&index.includes('data-phase24l-wayfarer-unlocks'));
record('focus-trap-excludes-negative-tabindex-controls',runtime.includes('function visibleFocusable(shell)')&&runtime.includes('node.tabIndex>=0')&&runtime.includes("shell.onkeydown=event=>")&&runtime.includes("event.key!=='Tab'"));
record('resource-rail-height-is-measured-at-open',runtime.includes('function syncRailHeight(document)')&&runtime.includes("style.setProperty('--phase24l-rail-height'")&&runtime.match(/syncRailHeight\(document\)/g)?.length>=2);

record('viewport-scroll-lock-is-explicit',css.includes('html.phase24l-profile-open,html.phase24l-profile-open body{height:100%;overflow:hidden')&&css.includes('overscroll-behavior:none'));
record('profile-is-offset-below-resource-rail',css.includes('.overlay:has([data-phase24l-profile]){top:var(--phase24l-rail-height)')&&css.includes('height:calc(100dvh - var(--phase24l-rail-height))'));
record('local-dock-is-fixed-height-and-five-wide',css.includes('--phase24l-dock-height:64px')&&css.includes('grid-template-columns:repeat(5,minmax(0,1fr))'));
record('all-local-controls-declare-44px-touch-minimum',css.includes('min-height:54px')&&css.includes('flex:0 0 44px')&&css.includes('width:44px;height:44px')&&/\.phase24l-field select\{[^}]*min-height:44px/.test(css)&&/\.phase24l-action-row>\.btn\{[^}]*min-height:44px/.test(css)&&/\.phase24l-action-card>\.btn\{[^}]*min-height:44px/.test(css));
record('sheet-bounds-preserve-art-including-bottom-safe-area',css.includes('--phase24l-sheet-max:min(46dvh,360px,calc(66dvh - var(--phase24l-rail-height) - var(--phase24l-dock-height) - var(--safe)))')&&css.includes('max-height:var(--phase24l-sheet-max)'));
record('normal-profile-sheets-are-non-scrolling',css.includes('.phase24l-profile-panel{max-height:var(--phase24l-sheet-max);overflow:hidden')&&/\.phase24l-sheet-content\{[^}]*overflow:hidden/.test(css));
record('emergency-scroll-is-height-bounded-to-sub-500px-fallback',/@media\(max-height:500px\)\{\.phase24l-sheet-content\{overflow:auto/.test(css)&&!/@media\(min-height:[^)]+\)[^{]*\{[^}]*\.phase24l-sheet-content\{[^}]*overflow:auto/.test(css));
record('focus-reduced-motion-and-forced-colors-contracts',css.includes(':focus-visible')&&css.includes('@media(prefers-reduced-motion:reduce)')&&css.includes('html.phase15-reduced-motion')&&css.includes('@media(forced-colors:active)'));

const syntax=spawnSync(process.execPath,['--check',path.join(root,'src/phase24l-profile-shell.js')],{cwd:root,encoding:'utf8'});
record('runtime-parses',syntax.status===0,syntax.stderr||syntax.stdout);

const failed=rows.filter(row=>!row.pass);
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` · ${row.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
