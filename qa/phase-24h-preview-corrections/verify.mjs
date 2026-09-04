import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
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

const contract=JSON.parse(read('qa/phase-24h-preview-corrections/contract.json'));
const index=read('index.html'),readme=read('README.md'),packageJson=JSON.parse(read('package.json'));
const publicProfileSource=read('src/phase24d-public-preview-profile.js');
const storyRuntime=read('src/phase24g-story-runtime.js');

record('contract-is-exact-phase24h-preview-corrections',contract.contractVersion===1&&contract.phase==='24H'&&contract.authorityId==='everstead.phase24h.preview-corrections.v1'&&contract.schemaVersion===14);
record('contract-pins-exact-phase24g-predecessor',contract.predecessor.commit==='4425e41085a3f338c82f389415e0d8cffe2b6ac9'&&contract.predecessor.indexSha256==='b056714caef0e320bc69b1aaab7c6ef0821fecd24611bf8077b4b90e6a355004');
record('contract-locks-two-profiles-and-mobile-widths',contract.profiles.join(',')==='fresh,foundation-thin'&&contract.viewports.map(item=>`${item.width}x${item.height}`).join(',')==='320x568,390x844');
record('contract-keeps-risky-work-deferred',contract.deferred.join(',')==='schema14-native-story-foundation-repair,restaurant-public-release,startup-diagnostics,wrapper-consolidation');

const predecessor=git(['show',`${contract.predecessor.commit}:index.html`],{encoding:null});
record('predecessor-commit-is-reachable',git(['merge-base','--is-ancestor',contract.predecessor.commit,'HEAD']).status===0);
record('predecessor-index-has-frozen-identity',predecessor.status===0&&sha(predecessor.stdout)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:predecessor.status===0?sha(predecessor.stdout):predecessor.stderr?.toString()});

const owned=contract.ownedProductionFiles;
const changed=git(['diff','--name-only',contract.predecessor.commit,'--',...owned]).stdout.trim().split('\n').filter(Boolean).sort();
record('only-four-owned-production-files-change',JSON.stringify(changed)===JSON.stringify([...owned].sort()),changed);
record('no-startup-diagnostics-or-wrapper-consolidation',!index.includes('EVERSTEAD_DIAG')&&!index.includes('navigator.storage.persist')&&!index.includes('phase-25-consolidation'));
record('storage-namespace-and-schema-remain-unchanged',index.includes("const NS='oathforge_new_world_proto_v01'")&&index.includes('CURRENT_SCHEMA_VERSION=14'));

record('package-and-runtime-share-one-release-version',packageJson.version===contract.releaseVersion&&index.includes(`RELEASE_VERSION='${contract.releaseVersion}'`)&&count(index,"RELEASE_VERSION='")===1);
record('obsolete-release-version-is-absent-from-runtime',!index.includes('1.0.0-rc.3')&&!storyRuntime.includes('1.0.0-rc.3'));
record('recovery-bundles-use-release-version-source',count(index,'appVersion:RELEASE_VERSION')>=3);

record('roster-count-rewrites-are-tag-anchored',index.includes(".replace(/(>)Fellows · \\d+(?:\\/18)?/g,`$1Fellows · ${joined}/18`).replace(/(>)Family · \\d+/g,'$1Family · 20')")&&!index.includes(".replace(/Fellows · \\d+(?:\\/18)?/g"));
record('fellowship-summary-source-remains-explicit',index.includes('`${joined} joined Fellows · 20 Family · 20 owned Companions`'));

record('foundation-thin-predicate-is-narrow-and-read-only',index.includes("function phase24fStoryFoundationsMissing(state=S){try{return state?.schemaVersion===14&&(!phaseElevenGReceipt(state)||!phaseTwelveReceipt(state)||!phaseThirteenProgress(state))}catch{return false}}"));
const noticeStart=index.indexOf('function phase24fStoryFoundationNoticeHtml()');
const noticeEnd=index.indexOf('function phase24fCurrentMoreScreen()',noticeStart);
const noticeBlock=noticeStart>=0&&noticeEnd>noticeStart?index.slice(noticeStart,noticeEnd):'';
record('foundation-notice-is-single-and-recovery-directed',count(index,'data-phase24f-story-foundation-notice')===1&&noticeBlock.includes('export a Recovery File')&&noticeBlock.includes('Gold, Oaths, rosters, Adventure, and Relics are unaffected.'));
record('foundation-notice-cannot-write-or-fabricate-history',noticeBlock.length>0&&!/(mutatePersisted|commitPrepared|storageSet|appliedMigrations|phaseThirteenEnsureActivated|phaseTwelveEnsureActivated)/.test(noticeBlock));
record('foundation-notice-precedes-public-preview-card',index.includes('card=phase24fStoryFoundationNoticeHtml()+phase24fPublicPreviewCardHtml()'));

record('dialogue-progress-is-compact',index.includes("phase-13-scene-progress\">Line ${index+1} of ${scene.beats.length}${replay?' · Replay':''}</p>"));
record('dialogue-progress-no-longer-repeats-policy',!index.includes('Watching or skipping never pays a scene reward.</p><div class="phase-13-controls"')&&!index.includes('Replay changes no progress or rewards.</p><div class="phase-13-controls"'));
record('story-policy-is-accurate-on-more-surface',index.includes('Watching or skipping never pays a scene reward. Replays never change progress or rewards.'));

record('scaling-card-is-native-collapsed-disclosure',count(index,'data-phase24-advanced')===1&&index.includes('<details class="card phase24-scaling-card" data-phase24-advanced>')&&index.includes('Advanced · developer diagnostics')&&index.includes('</details>'));
record('scaling-dialog-opener-and-binding-remain',count(index,'data-phase24-scaling-open')>=3&&index.includes('button.onclick=()=>phase24OpenScalingDiagnostics(button)'));

const realm={};vm.createContext(realm);
vm.runInContext(publicProfileSource,realm,{filename:'src/phase24d-public-preview-profile.js'});
const publicProfile=realm.EVERSTEAD_PUBLIC_RELEASE_PROFILE;
record('founding-table-is-preview-excluded-not-active',publicProfile?.activeSystems?.includes('founding-table-collection')===false&&publicProfile?.previewExcludedSystems?.includes('founding-table-collection')===true);
record('release-copy-does-not-advertise-unreachable-collection',!index.includes('first permanent Collection')&&!storyRuntime.includes('first permanent Collection'));
record('release-copy-describes-complete-chapter-one',storyRuntime.includes('the complete First Covenant Chapter I')&&index.includes('Chapter I of the First Covenant'));
record('readme-honestly-describes-framework-boundary',readme.includes('The Founding Table Collection framework ships')&&readme.includes('not reachable in the public preview yet'));

for(const relative of ['qa/phase-24g-chapter1/README.md','qa/phase-24g-chapter1/RESULT.md','qa/phase-24g-chapter1/browser.mjs','qa/phase-24g-chapter1/verify.mjs','qa/phase-24g-chapter1/checksums.sha256']){
  const historical=git(['show',`${contract.predecessor.commit}:${relative}`],{encoding:null});
  record(`phase24g-evidence-remains-frozen-${path.basename(relative)}`,historical.status===0&&Buffer.compare(historical.stdout,bytes(relative))===0);
}

const expectedEntries=Object.entries(contract.expectedArtifacts||{});
record('artifact-freeze-populated',expectedEntries.length>=9,expectedEntries.map(([relative])=>relative));
for(const[relative,expected]of expectedEntries)record(`frozen-artifact-${relative}`,/^[0-9a-f]{64}$/.test(expected)&&fs.existsSync(path.join(root,relative))&&fileHash(relative)===expected,{expected,actual:fs.existsSync(path.join(root,relative))?fileHash(relative):null});

const failed=rows.filter(item=>!item.pass);
for(const item of rows)console.log(`${item.pass?'PASS':'FAIL'} ${item.id}${item.detail?` · ${item.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
