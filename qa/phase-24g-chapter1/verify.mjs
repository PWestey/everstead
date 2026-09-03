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

const contract=JSON.parse(read('qa/phase-24g-chapter1/contract.json'));
const index=read('index.html');
const markers=contract.markers;
const sourceEntries=Object.entries(contract.sources);
const sources=Object.fromEntries(sourceEntries.map(([id,relative])=>[id,fs.existsSync(path.join(root,relative))?read(relative):'']));
const authorityRealm={};
vm.createContext(authorityRealm);
if(sources.authority)vm.runInContext(sources.authority,authorityRealm,{filename:contract.sources.authority});
const authority=authorityRealm[contract.authority.global];
const profileRealm={};
vm.createContext(profileRealm);
if(fs.existsSync(path.join(root,'src/phase24d-public-preview-profile.js')))vm.runInContext(read('src/phase24d-public-preview-profile.js'),profileRealm,{filename:'src/phase24d-public-preview-profile.js'});
if(sources.releaseProfile)vm.runInContext(sources.releaseProfile,profileRealm,{filename:contract.sources.releaseProfile});
const releaseProfile=profileRealm[contract.releaseProfile.global];

record('contract-is-exact-narrow-phase24g-a-gate',contract.contractVersion===1&&contract.phase==='24G-A'&&contract.authorityId==='everstead.phase24g.chapter-one-gate.v1'&&contract.schemaVersion===14);
record('contract-pins-exact-phase24f-predecessor',contract.predecessor.commit==='da16b52bcbf0bde8ba1c7e8261e66cbde73890c6'&&contract.predecessor.indexSha256==='d5dff326d20897a08ebab22be313e31c494767b4ed9dc4fee5e5642643fd4b7d');
record('contract-has-five-profiles-and-two-mobile-viewports',contract.profiles.map(item=>item.id).join(',')==='fresh,established,stage2-already-cleared,foundation-thin,high'&&contract.viewports.map(item=>`${item.width}x${item.height}`).join(',')==='320x568,390x844');
record('contract-locks-two-scenes-and-reward-neutral-boundary',contract.stageId==='broken-roads-2'&&contract.scenes.map(item=>item.id).join(',')==='story.book1.chapter1.merchant-dispute.intro,story.book1.chapter1.merchant-dispute.resolution'&&contract.scenes.every(item=>item.beatCount===5)&&contract.tutorialId==='tutorial.story.objective.chapter-change'&&contract.visualChangeId==='village-change.western-plaza-open');
record('contract-freezes-original-three-claim-values',JSON.stringify(contract.existingPhase13Claims.map(item=>item.gold))==='[1500,750,500]'&&new Set(contract.existingPhase13Claims.map(item=>item.claimId)).size===3);

const predecessor=git(['show',`${contract.predecessor.commit}:index.html`],{encoding:null});
record('predecessor-commit-is-reachable',git(['merge-base','--is-ancestor',contract.predecessor.commit,'HEAD']).status===0);
record('predecessor-index-has-frozen-identity',predecessor.status===0&&sha(predecessor.stdout)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:predecessor.status===0?sha(predecessor.stdout):predecessor.stderr?.toString()});
for(const [relative,key] of [
  ['src/phase13-first-covenant.js','phase13SourceSha256'],
  ['src/phase17-book1.js','phase17BookSourceSha256'],
  ['src/phase17-runtime.js','phase17RuntimeSourceSha256'],
  ['src/phase24d-public-preview-profile.js','phase24dProfileSourceSha256']
]){
  const historical=git(['show',`${contract.predecessor.commit}:${relative}`],{encoding:null});
  record(`predecessor ${relative} exact`,historical.status===0&&sha(historical.stdout)===contract.predecessor[key]);
  record(`current ${relative} remains byte-frozen`,fs.existsSync(path.join(root,relative))&&fileHash(relative)===contract.predecessor[key]);
}

for(const [id,relative] of sourceEntries)record(`phase24g source exists ${id}`,sources[id].length>0,relative);
for(const [id,begin,end] of [
  ['styles',markers.stylesBegin,markers.stylesEnd],
  ['authority',markers.authorityBegin,markers.authorityEnd],
  ['ownership',markers.ownershipBegin,markers.ownershipEnd]
])record(`one phase24g ${id} marker block`,count(index,begin)===1&&count(index,end)===1,{begin:count(index,begin),end:count(index,end)});

let projection=removeMarkedBlock(index,markers.stylesBegin,markers.stylesEnd);
projection=projection===null?null:removeMarkedBlock(projection,markers.authorityBegin,markers.authorityEnd);
projection=projection===null?null:removeMarkedBlock(projection,markers.ownershipBegin,markers.ownershipEnd);
record('exact-phase24f-predecessor-projection',projection!==null&&sha(projection)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:projection===null?null:sha(projection)});

const block=(begin,end)=>{const start=index.indexOf(begin),finish=index.indexOf(end,start);return start>=0&&finish>=0?index.slice(start,finish+end.length):''};
const stylesBlock=block(markers.stylesBegin,markers.stylesEnd);
const authorityBlock=block(markers.authorityBegin,markers.authorityEnd);
const ownershipBlock=block(markers.ownershipBegin,markers.ownershipEnd);
const compact=ownershipBlock.replace(/\s+/g,'');
record('style-loader-is-exact-and-before-head-close',count(stylesBlock,contract.sources.styles)===1&&index.indexOf(markers.stylesBegin)>index.indexOf('src/phase24f-more-polish.css')&&index.indexOf(markers.stylesEnd)<index.indexOf('</head>'));
record('authority-loader-loads-three-sources-once-in-order',
  ['authority','runtime','releaseProfile'].every(id=>count(authorityBlock,contract.sources[id])===1)&&
  authorityBlock.indexOf(contract.sources.authority)<authorityBlock.indexOf(contract.sources.releaseProfile)&&
  authorityBlock.indexOf(contract.sources.releaseProfile)<authorityBlock.indexOf(contract.sources.runtime));
record('ownership-installs-after-authorities-and-before-phase24e-shell-owner',index.indexOf(markers.ownershipBegin)>index.indexOf(markers.authorityEnd)&&index.indexOf(markers.ownershipEnd)<index.indexOf('/* Phase 24E current-schema shell ownership BEGIN */'));

record('authority-has-exact-public-id-and-global',sources.authority.includes(contract.authority.id)&&sources.authority.includes(contract.authority.global));
record('authority-global-is-non-writable-non-configurable-non-enumerable',(()=>{const descriptor=Object.getOwnPropertyDescriptor(authorityRealm,contract.authority.global);return descriptor?.writable===false&&descriptor?.configurable===false&&descriptor?.enumerable===false})());
record('authority-is-deep-frozen-and-valid',authority?.validate?.().ok===true&&Object.isFrozen(authority)&&Object.isFrozen(authority.scenes)&&authority.scenes.every(scene=>Object.isFrozen(scene)&&Object.isFrozen(scene.beats)&&scene.beats.every(beat=>Object.isFrozen(beat)&&Object.isFrozen(beat.speaker))));
record('runtime-has-exact-schema14-owner-and-global',sources.runtime.includes(contract.runtime.id)&&sources.runtime.includes(contract.runtime.global)&&sources.runtime.includes('schemaVersion')&&sources.runtime.includes('14'));
record('release-profile-has-exact-successor-id-and-global',sources.releaseProfile.includes(contract.releaseProfile.id)&&sources.releaseProfile.includes(contract.releaseProfile.global));
record('release-profile-is-deep-frozen-successor',releaseProfile?.id===contract.releaseProfile.id&&releaseProfile.predecessorProfileId==='everstead.release-profile.limited-public-preview.v1'&&Object.isFrozen(releaseProfile)&&Object.isFrozen(releaseProfile.activeSystems)&&Object.isFrozen(releaseProfile.previewExcludedSystems));
record('ownership-uses-authority-runtime-and-release-profile-once',count(ownershipBlock,contract.authority.global)>=1&&count(ownershipBlock,contract.runtime.global)>=1&&count(ownershipBlock,contract.releaseProfile.global)>=1);
record('phase24g-registers-one-allowed-story-source',index.includes(`'${contract.runtime.transactionSource}'`)||index.includes(`"${contract.runtime.transactionSource}"`));
record('legacy-classifier-narrowly-restores-missing-null-schema-zero',ownershipBlock.includes('const phase24gCurrentClassify=phase24c2cClassify')&&ownershipBlock.includes('phase24c2cClassify=function(raw,physical=null)')&&ownershipBlock.includes('if(raw===null)return phase24gCurrentClassify(raw,physical)')&&ownershipBlock.includes('if(isObject(value)&&value.schemaVersion==null)return{kind:\'predecessor\',raw,value,schemaVersion:0}')&&ownershipBlock.includes('return phase24gCurrentClassify(raw,physical)'));
record('historical-migration-commit-validates-at-candidate-schema-and-restores-ambient',ownershipBlock.includes('const phase24gCurrentCommitPrepared=commitPrepared')&&ownershipBlock.includes('commitPrepared=function(state,expectedActiveRaw,options={})')&&ownershipBlock.includes('if(!Number.isInteger(version)||version<1||version>=14||version===CURRENT_SCHEMA_VERSION)return phase24gCurrentCommitPrepared')&&ownershipBlock.includes('CURRENT_SCHEMA_VERSION=version')&&ownershipBlock.includes('finally{CURRENT_SCHEMA_VERSION=prior}'));

for(const scene of contract.scenes){
  const live=authority?.scenes?.find(item=>item.id===scene.id);
  const sceneCount=count(sources.authority,scene.id);
  const chronicleCount=count(sources.authority,scene.chronicleId);
  record(`authority contains exact ${scene.id}`,sceneCount>=1&&chronicleCount>=1&&live?.title===scene.title&&live?.chronicleEntryId===scene.chronicleId,{sceneCount,chronicleCount});
  record(`${scene.id} is explicitly reward-neutral`,live?.claim===null&&live?.playbackReward===null&&live?.skippable===true&&live?.replayable===true&&live?.loggable===true);
  record(`${scene.id} has exact five approved beats`,live?.beats?.length===scene.beatCount&&new Set(live.beats.map(item=>item.id)).size===scene.beatCount&&new Set(live.beats.map(item=>`${item.speaker.roster}.${item.speaker.id}`)).size===scene.speakers.length&&live.beats.every(item=>scene.speakers.includes(`${item.speaker.roster}.${item.speaker.id}`)));
}
record('authority-limits-speakers-to-approved-current-roster',authority?.scenes?.every((scene,index)=>scene.beats.every(item=>contract.scenes[index].speakers.includes(`${item.speaker.roster}.${item.speaker.id}`))));
record('authority-defines-exactly-two-scenes',authority?.scenes?.length===2&&authority?.chronicleEntries?.length===2);
record('authority-locks-stage-tutorial-and-village-change',authority?.campaignStageId===contract.stageId&&authority?.tutorialId===contract.tutorialId&&authority?.villageChangeId===contract.visualChangeId);

const combined=Object.values(sources).join('\n')+'\n'+ownershipBlock;
record('no-new-reward-or-claim-application-path',!/(phaseTwelveApplyRewards|phaseThirteenQueueOfferInState|pendingOffers\s*\[|reward\.offer\.|rewardApplications\s*:\s*[1-9]|claim\s*:\s*\{)/.test(combined));
record('no-legacy-v2-activation-or-new-legacy-state',!/(activeTrackIds|activeTierIds|legacyProgress\s*=|legacy-v2|phase24g-legacy|capstone)/i.test(combined));
record('no-facility-unlock-or-production-path',!/(facilityProgress\.(?:unlockedIds|discoveredIds)|capabilityIds\.push|facility\.restaurant|facility\.apothecary|facility\.schoolhouse|commitFacilityIntroduction|phaseFifteenDiscoverInState)/.test(combined));
record('full-phase17-production-flag-is-not-enabled',sources.authority.includes('productionEnabled')===false&&sources.runtime.includes('PHASE_SEVENTEEN')===false&&!/productionEnabled\s*[:=]\s*true/.test(combined));
record('runtime-uses-existing-story-chronicle-and-public-tutorial-state',sources.runtime.includes('pendingSceneIds')&&sources.runtime.includes('activeStoryId')&&sources.runtime.includes('sceneResolutionsById')&&sources.runtime.includes('unreadEntryIds')&&sources.runtime.includes('api.tutorialStatus(state)')&&sources.runtime.includes('api.mutateTutorialInState(state,action)')&&ownershipBlock.includes('state?.tutorialProgress'));
record('runtime-does-not-create-new-persisted-root',!/(phase24gProgress|phase24gState|state\.phase24g|current\.phase24g)/.test(sources.runtime));
record('legacy-v01-foundations-activate-only-inside-authentic-schema12-boot-seam',ownershipBlock.includes('function phase24gEnsureLegacyPublicStoryFoundations()')&&ownershipBlock.includes('S?.schemaVersion!==12')&&ownershipBlock.includes('phaseElevenGEnsureActivated()')&&ownershipBlock.includes('phaseTwelveEnsureActivated()')&&ownershipBlock.includes('phaseThirteenEnsureActivated()')&&ownershipBlock.includes("String(operation).replace(/\\s/g,'')==='()=>bootstrapPersistenceBeforePhase23()'")&&ownershipBlock.includes('phase24gEnsureLegacyPublicStoryFoundations()')&&!ownershipBlock.includes('phaseFifteenEnsureActivated()'));
record('legacy-v01-foundation-seam-preserves-checkpoints-and-restores-ownership',ownershipBlock.includes('phaseElevenFReadProtectedSlots()')&&ownershipBlock.includes('PERSISTED_RAW!==JSON.stringify(S)')&&ownershipBlock.includes('phaseElevenFPermanentSlots(after)')&&ownershipBlock.includes('PHASE_24G_INSTALL_RESULT?.restoreOwnership?.()'));
record('chapter-change-public-ledger-projects-only-owned-fields-before-predecessor-validation',ownershipBlock.includes('function phase24gTutorialProjection(state)')&&ownershipBlock.includes("id!==PHASE_24G_TUTORIAL_STEP_ID")&&ownershipBlock.includes("id!==PHASE_24G_TUTORIAL_RECEIPT_ID")&&ownershipBlock.includes('delete progress.replayCountsByTutorial[PHASE_24G_TUTORIAL_ID]')&&ownershipBlock.includes('phase24c2cPredecessorValidBeforePhase24G(phase24gTutorialProjection(candidate),physical)')&&ownershipBlock.includes('phase24c2cValidateBeforePhase24G(state,physical)'));
record('chapter-change-public-ledger-validates-unique-terminal-and-receipt-history',ownershipBlock.includes('function phase24gTutorialValid(state)')&&ownershipBlock.includes('seenCount>1')&&ownershipBlock.includes('completedCount&&dismissedCount')&&ownershipBlock.includes('(completedCount===1)!==(receiptCount===1)')&&ownershipBlock.includes("errors:['phase24g.tutorial']"));
record('intro-is-pre-spend-and-resolution-is-post-committed-first-clear',sources.runtime.indexOf('!api.sceneResolved(INTRO_ID')<sources.runtime.indexOf('const result=previousRun')&&sources.runtime.indexOf('const result=previousRun')<sources.runtime.indexOf('const committed=Boolean')&&sources.runtime.includes('receipt?.stageId===stageId')&&sources.runtime.includes('receipt.firstClear===true'));
record('story-replay-and-log-remain-owned-by-frozen-phase13',!ownershipBlock.includes('storyAction:')&&!sources.runtime.includes('storyActionSlot')&&sources.runtime.includes('data-phase13-story="replay"')&&sources.runtime.includes('data-phase13-story="log"'));
record('phase24g-terminal-story-actions-own-source-without-replacing-historical-actions',sources.runtime.includes('modalBindingSlot')&&sources.runtime.includes('function phase24gBindModal()')&&sources.runtime.includes("if(action==='skip')")&&sources.runtime.includes("else if(action==='next')")&&sources.runtime.includes('api.recordSceneInState(state,sceneId,resolution,now,{queueClaim:false})')&&sources.runtime.includes('STORY_SOURCE')&&sources.runtime.includes('previousModalBinding()'));
record('tutorial-replay-only-persists-owned-public-ledger-bookkeeping',ownershipBlock.includes('progress.replayCountsByTutorial[PHASE_24G_TUTORIAL_ID]=safeAddInteger')&&sources.runtime.includes("api.mutatePersisted(state=>api.mutateTutorialInState(state,action),STORY_SOURCE")&&sources.runtime.includes('rewardApplications:0')&&!/(pendingOffers|ApplyRewards|queueOffer|facilityProgress)/.test(sources.runtime));
record('western-plaza-change-is-derived-after-resolution',combined.includes(contract.visualChangeId)&&combined.includes('data-phase24g-village-change')&&combined.includes(contract.scenes[1].id));
record('chapter-change-tutorial-is-scoped-reward-neutral-and-deep-frozen',authority?.tutorial?.id===contract.tutorialId&&authority.tutorial.actorName==='Tavi'&&authority.tutorial.reward===null&&authority.tutorial.blocking===false&&authority.tutorial.skippable===true&&authority.tutorial.replayable===true&&authority.tutorial.loggable===true&&Object.isFrozen(authority.tutorial)&&Object.isFrozen(authority.tutorial.steps));
record('chapter-change-tutorial-adds-no-root-or-migration',ownershipBlock.includes('state?.tutorialProgress')&&!/(appliedMigrations\.push|state\.tutorialProgress\s*=|state\.phase2021\s*=)/.test(ownershipBlock));
record('optional-private-tutorial-ledger-is-only-a-forward-mirror',ownershipBlock.includes('const successor=state?.phase2021?.tutorials')&&ownershipBlock.includes('successor.statusById[PHASE_24G_TUTORIAL_ID]=target')&&ownershipBlock.includes('successor.replayCountsById[PHASE_24G_TUTORIAL_ID]=progress.replayCountsByTutorial[PHASE_24G_TUTORIAL_ID]'));
record('terminal-tutorial-replay-removes-inert-actions-and-keeps-close-log',sources.runtime.includes("['completed','dismissed'].includes(phase24gTutorialStatus())")&&sources.runtime.includes('data-modal-close>CLOSE</button>')&&sources.runtime.includes('data-phase13-tutorial-action="log"')&&sources.runtime.includes("['complete','skip'].includes(action)&&['completed','dismissed'].includes(status)")&&sources.runtime.includes('reason:`already-${status}`'));
record('rank2-priority-is-conditional-and-never-synthesizes-roadbound',sources.runtime.includes('needsPriority=Boolean(!active&&beforeSceneId&&')&&sources.runtime.includes('if(needsPriority&&beforeSceneId&&!active&&!api.sceneResolved(beforeSceneId,current))')&&sources.runtime.includes('if(activeBefore||pendingBefore)')&&sources.runtime.includes('currentProgress.pendingSceneIds.unshift(sceneId,beforeSceneId)'));
record('release-profile-successor-is-narrow-and-keeps-private-systems-excluded',releaseProfile?.activeSystems?.includes('book-one-chapter-one')&&releaseProfile?.previewExcludedSystems?.includes('book-one-chapters-two-through-finale')&&releaseProfile?.previewExcludedSystems?.includes('legacy-v2')&&releaseProfile?.previewExcludedSystems?.includes('private-facility-runtimes')&&releaseProfile?.rewardPolicy?.chapterOneExtensionRewardNeutral===true&&releaseProfile?.rewardPolicy?.existingPhase13ClaimsUnchanged===true);
record('one-more-owner-remains',count(index,'data-phase24f-more-owner')>=1&&count(index,'function phase24fCurrentMoreScreen()')===1&&!/function\s+phase24g\w*MoreScreen/.test(combined));
record('release-profile-card-is-presented-without-new-more-binder',combined.includes('data-phase24g-release-profile')&&!/(bindCommonBeforePhase24G|bindModalBeforePhase24G)/.test(combined));
record('non-schema14-profile-card-delegates-exactly-to-predecessor',sources.runtime.includes('const previousProfileCard=profileCardSlot.get()')&&sources.runtime.includes('if(!phase24gIsCurrent())return previousProfileCard()')&&sources.runtime.includes('profileCardSlot.set(phase24gPublicPreviewCardHtml)'));

record('story-styles-are-narrow-mobile-and-reduced-motion-safe',sources.styles.includes('data-phase24g-village-change')&&sources.styles.includes('@media (max-width: 360px)')&&sources.styles.includes('@media (prefers-reduced-motion: reduce)')&&!/@keyframes/i.test(sources.styles));
record('story-styles-preserve-44px-controls',/min-height\s*:\s*44px/.test(sources.styles));

const expectedEntries=Object.entries(contract.expectedArtifacts||{});
record('artifact-freeze-populated',expectedEntries.length>=9,expectedEntries.map(([relative])=>relative));
for(const[relative,expected]of expectedEntries)record(`frozen artifact ${relative}`,/^[0-9a-f]{64}$/.test(expected)&&fs.existsSync(path.join(root,relative))&&fileHash(relative)===expected,{expected,actual:fs.existsSync(path.join(root,relative))?fileHash(relative):null});

const failed=rows.filter(item=>!item.pass);
for(const item of rows)console.log(`${item.pass?'PASS':'FAIL'} ${item.id}${item.detail?` · ${item.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
