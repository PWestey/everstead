import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../..'),rows=[];
const bytes=relative=>fs.readFileSync(path.join(root,relative));
const read=relative=>bytes(relative).toString('utf8');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const fileHash=relative=>hash(bytes(relative));
const check=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const count=(source,token)=>source.split(token).length-1;

const contract=JSON.parse(read('qa/phase-24d-public-preview/contract.json'));
const index=read('index.html'),profile=read(contract.profileSource),browser=read('qa/phase-24d-public-preview/browser.mjs'),workflow=read('.github/workflows/qa.yml'),readme=read('README.md');

const profileLoad=`  <!-- Phase 24D limited public-preview profile load BEGIN -->\n  <script src="src/phase24d-public-preview-profile.js?v=phase24d-v1"></script>\n  <!-- Phase 24D limited public-preview profile load END -->\n`;
const presentationPattern=/\/\* Phase 24D limited public-preview presentation BEGIN \*\/[\s\S]*?\/\* Phase 24D limited public-preview presentation END \*\/\n/;
const predecessorProjection=index
  .replace('<title>Everstead · Limited Public Preview</title>','<title>Everstead · 1.0 Release Candidate</title>')
  .replace(profileLoad,'')
  .replace(presentationPattern,'');

check('contract-exact-limited-public-preview',contract.contractVersion===1&&contract.phase==='24D'&&contract.authorityId==='phase-24d-limited-public-preview-release-profile.v1'&&contract.status==='release-candidate'&&contract.profileId==='everstead.release-profile.limited-public-preview.v1'&&contract.schemaVersion===14);
check('contract-pins-accepted-predecessor',contract.predecessor.commit==='db25dc01b48e32ddd873496407b69e047f8d4e1f'&&contract.predecessor.indexSha256==='cc444aaab670eef836b9fe09a0e2389739c14b8bdf41db734216291f2399ff20'&&contract.predecessor.candidateSourceSha256==='4645f30b7a2eeac1dc5ef9056fdd522aea5f4dbd5fe0634c09c57d2f5b648084'&&contract.predecessor.authoritySha256==='7eae0b97ace1f4e88261f877cd1043780867d8a876941ef34c0f682c6d0de7ce'&&contract.predecessor.releaseManifestSha256==='98831cc04f125fcc88e78ceac7dae50b5e7434258e66d6c5b2bcb0370fc2ff60');
check('contract-four-profiles-two-mobile-viewports',contract.profiles.map(item=>item.id).join(',')==='fresh,established,thin,high'&&contract.profiles.find(item=>item.id==='established')?.seed==='phase24d.public-established.production-actions.v1'&&contract.profiles.find(item=>item.id==='high')?.seed==='phase24d.public-high-investment.production-actions.v1'&&contract.viewports.map(item=>`${item.width}x${item.height}`).join(',')==='320x568,390x844');
check('contract-five-navigation-four-adventure-eleven-modal-surfaces',contract.primaryNavigation.length===5&&contract.adventureRoutes.length===4&&contract.criticalModals.length===11);

check('profile-is-deep-frozen-public-preview-authority',profile.includes("authorityId:'phase-24d-limited-public-preview-release-profile.v1'")&&profile.includes("id:'everstead.release-profile.limited-public-preview.v1'")&&profile.includes("label:'Limited Public Preview'")&&profile.includes("status:'active'")&&profile.includes('for(const item of Object.values(value))freeze(item)')&&profile.includes("Object.defineProperty(globalThis,'EVERSTEAD_PUBLIC_RELEASE_PROFILE'"));
check('profile-pins-accepted-predecessor',profile.includes(`commit:'${contract.predecessor.commit}'`)&&profile.includes(`indexSha256:'${contract.predecessor.indexSha256}'`)&&profile.includes("releaseAuthorityId:'phase-24c2d-founding-table-release-authority.v1'"));
check('profile-records-preview-exclusions-and-rights-boundary',['extended-book-one','legacy-v2','family-romance','rotating-events','private-facility-runtimes','long-horizon-level-curves','rightsLimitedCompanionPortraitsDeployed:false','privateAssetPathsAllowed:false'].every(token=>profile.includes(token)));

check('index-has-exactly-one-additive-profile-loader',count(index,'<!-- Phase 24D limited public-preview profile load BEGIN -->')===1&&count(index,'<!-- Phase 24D limited public-preview profile load END -->')===1&&count(index,'src/phase24d-public-preview-profile.js?v=phase24d-v1')===1);
check('index-loads-and-authenticates-profile-before-runtime',index.indexOf('src/phase24d-public-preview-profile.js?v=phase24d-v1')<index.indexOf("(()=>{'use strict'")&&index.includes("PHASE_24D_RELEASE_PROFILE.id!=='everstead.release-profile.limited-public-preview.v1'"));
check('index-labels-preview-with-save-and-scope-copy',index.includes('<title>Everstead · Limited Public Preview</title>')&&index.includes('data-phase24d-release-profile')&&index.includes('Saves stay in this browser; keep a private Recovery File backup.'));
check('index-phase24d-delta-is-presentation-only',count(index,'/* Phase 24D limited public-preview presentation BEGIN */')===1&&count(index,'/* Phase 24D limited public-preview presentation END */')===1&&!index.includes('phase24c2cQaMigrateSchema13BeforePhase24D'));
check('exact-predecessor-projection',hash(predecessorProjection)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:hash(predecessorProjection)});
check('accepted-predecessor-authority-source-pin',fileHash('src/phase24c2d-founding-table-release-authority.js')===contract.predecessor.candidateSourceSha256,fileHash('src/phase24c2d-founding-table-release-authority.js'));

check('readme-currently-describes-schema14-limited-preview',readme.includes('active **Limited Public Preview** on schema 14')&&readme.includes('This is not yet the complete locked Everstead')&&readme.includes('Rights-limited Companion portraits are not distributed'));
check('browser-seeds-established-and-high-through-production-actions',browser.includes('publicSeedStartedAt')&&browser.includes('window.__EVERSTEAD_RUNTIME__?.qa!==undefined')&&browser.includes('[data-oath="o4"]')&&browser.includes('clearNextStage(ordinal)')&&browser.includes('[data-phase-11c-repeat-count=')&&browser.includes('capture({clears:9})'));
check('browser-allows-only-first-stage-story-retry',browser.includes('const allowedAttempts=ordinal===1?2:1')&&!browser.includes('attempt<3'));
check('browser-rejects-private-seed-taint-and-transient-save-slots',['qaGlobals.length','qaCredits!==0','privatePolicy','fixtureLineage','transientPresent'].every(token=>browser.includes(token)));
check('browser-uses-four-seeds-on-ordinary-non-qa-urls',browser.includes('return{fresh:null,...profiles}')&&browser.includes('index.html?profile=${profile.id}&viewport=${viewport.id}')&&!browser.includes('index.html?profile=${profile.id}&viewport=${viewport.id}&qa=1')&&browser.includes('window.__EVERSTEAD_RUNTIME__?.qa===undefined'));
check('browser-covers-five-nav-four-roads-and-critical-modals',browser.includes("nav('village'")&&browser.includes("nav('oaths'")&&browser.includes("nav('fellows'")&&browser.includes("nav('adventure'")&&browser.includes("nav('more'")&&browser.includes('for(const route of contract.adventureRoutes)')&&['player-modal-opens','building-modal-opens','oath-editor-modal-opens','fellow-tab-and-profile','family-tab-20-and-profile','companion-tab-20-replaces-family-and-profile','codex','chronicle','tutorials','legacy','scaling'].every(token=>browser.includes(token)));
check('browser-fails-console-overflow-or-native-storage-use',browser.includes('zero-warning-error-console')&&browser.includes('mobile-no-horizontal-overflow')&&browser.includes('injected-adapter-never-used-native-storage')&&browser.includes('process.exitCode=1'));

const historicalChecksumLines=read('qa/phase-24c2d-integration/checksums.sha256').trim().split(/\r?\n/).map(line=>line.match(/^([0-9a-f]{64})  (.+)$/));
check('historical-c2d-checksum-manifest-byte-frozen',fileHash('qa/phase-24c2d-integration/checksums.sha256')==='f3fab652d6013db74cc6e4ce0ff92d2bffc5c99c77a8365a9e45ab39a49c98a1');
check('historical-c2d-evidence-files-remain-frozen',historicalChecksumLines.every(match=>match&&fileHash(match[2])===match[1]),historicalChecksumLines.filter(match=>!match||fileHash(match[2])!==match[1]).map(match=>match?.[2]||'unparsed'));
check('workflow-verifies-predecessor-snapshot-before-successor',workflow.includes(`git archive ${contract.predecessor.commit}`)&&workflow.includes('qa/phase-24c2d-release-authority/verify.mjs')&&workflow.includes('qa/phase-24c2d-integration/verify.mjs')&&workflow.includes('qa/phase-24d-public-preview/checksums.sha256')&&workflow.includes('npm run qa:public-preview'));

for(const[relative,expected]of Object.entries(contract.expectedArtifacts||{}))check(`frozen artifact ${relative}`,/^[0-9a-f]{64}$/.test(expected)&&fileHash(relative)===expected,{expected,actual:fileHash(relative)});
check('artifact-freeze-is-complete',same(Object.keys(contract.expectedArtifacts||{}).sort(),['.github/workflows/qa.yml','README.md','index.html','package-lock.json','package.json','qa/phase-24d-public-preview/browser.mjs','qa/phase-24d-public-preview/verify.mjs','src/phase24d-public-preview-profile.js'].sort()));

const failures=rows.filter(item=>!item.pass);
for(const item of rows)console.log(`${item.pass?'PASS':'FAIL'} ${item.id}${item.detail?` · ${item.detail}`:''}`);
console.log(`RESULT ${rows.length-failures.length} passed, ${failures.length} failed`);
if(failures.length)process.exitCode=1;
