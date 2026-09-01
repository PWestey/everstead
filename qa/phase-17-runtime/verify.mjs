#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const rows=[];
const check=(id,test,detail='')=>{try{assert.ok(test);rows.push({id,pass:true,detail})}catch(error){rows.push({id,pass:false,detail:detail||error.message})}};
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const unique=values=>new Set(values).size===values.length;

const definitionSource=read('src/phase17-book1.js');
const runtimeSource=read('src/phase17-runtime.js');
const indexSource=read('index.html');
new vm.Script(definitionSource,{filename:'src/phase17-book1.js'}).runInNewContext({});
new vm.Script(runtimeSource,{filename:'src/phase17-runtime.js'});
const sandbox={};
vm.createContext(sandbox);
new vm.Script(definitionSource,{filename:'src/phase17-book1.js'}).runInContext(sandbox);
new vm.Script(runtimeSource,{filename:'src/phase17-runtime.js'}).runInContext(sandbox);
const book=sandbox.EVERSTEAD_PHASE17_BOOK1;

function isolatedAdapter({qa=true}={}){
  const state={schemaVersion:12,saveMeta:{revision:1,updatedAt:1700000000000},narrativeProgress:{activeStoryId:null},phase13Progress:{sceneResolutionsById:{},pendingSceneIds:[]},fellowCampaign:{clearedStageIds:[]},facilityProgress:{discoveredIds:[],unlockedIds:[]}};
  const slot=value=>{let current=value;return Object.freeze({get:()=>current,set:next=>current=next})};
  const noop=()=>{},view=()=>'',validation=()=>({ok:true,errors:[]}),document={head:{appendChild:noop},documentElement:{getAttribute:()=>null},activeElement:null,getElementById:()=>null,createElement:()=>({id:'',textContent:''}),querySelector:()=>null,querySelectorAll:()=>[]};
  return Object.freeze({version:1,platform:Object.freeze({document,addEventListener:noop}),state:()=>state,persistence:Object.freeze({raw:()=>null,writeCount:()=>0,reload:()=>({ok:true,writes:0,rawUnchanged:true})}),qa:Object.freeze({bridgeAllowed:qa,destructiveAllowed:qa,isolatedStorage:qa,nativeStorage:false,urlAllowed:()=>qa}),slots:Object.freeze({validation:slot(validation),openPlayerProfile:slot(noop),closeModal:slot(noop),campaignView:slot(view),villageScreen:slot(view),moreScreen:slot(view),runFellowCampaign:slot(noop),nav:slot(noop),bindCommon:slot(noop),bindModal:slot(noop)}),api:Object.freeze({CURRENT_SCHEMA_VERSION:12,CURRENT_TRANSACTION_SOURCES:new Set(),PHASE_THIRTEEN_UI:{suppression:new Set()},PHASE_FIFTEEN_UI:{autoPresentedThisVisit:0},PHASE_FIFTEEN:{tutorials:[]},PHASE_TWELVE:{},FELLOW_DEFS:[],FAMILY_DEFS:[],BUILDING_DEFS:[],PLAYER_CONFIG:{rankCap:5},PersistenceError:Error,clone:book.copy,runtimeNow:()=>1700000000000,runtimeSetTimeout:noop,mutatePersisted:operation=>{operation(state,1700000000000);return{ok:true}},render:noop,showModal:noop,esc:String,toast:noop,phaseElevenGJoinedIds:()=>[],phaseElevenGSyncOwned:noop,fellowLevelForExp:()=>1,safeAddInteger:(left,right)=>left+right,campaignPreview:()=>({}),runFellowCampaignV2:noop,phaseFifteenState:()=>null,phaseFifteenDiscoverInState:noop,phaseFifteenAdvanceOffline:()=>({ok:true}),phaseFifteenClaim:()=>({ok:false}),phaseFifteenTutorial:noop,phaseFifteenQaResetFixture:noop,phaseFifteenEvent:noop,phaseThirteenRecordSceneInState:noop,phaseThirteenSceneResolved:()=>false,phaseThirteenTutorial:()=>null,phaseThirteenTutorialAction:noop,phaseFifteenDefinition:()=>null,phaseTwelveTargets:()=>({}),bridgeCall:operation=>operation(),bridgeInputClone:book.copy,bridgeString:String,requireQaDestructiveAuthorization:noop,navBeforePhaseThirteen:noop})});
}
const isolatedInstall=sandbox.EVERSTEAD_PHASE17_RUNTIME.install(isolatedAdapter());

check('definition-module-installed',Boolean(book)&&book.configId==='phase-17-book1-runtime-v1');
check('definitions-self-validate',book?.validateDefinitions()?.ok===true,book?.validateDefinitions()?.errors?.join(', '));
check('book-six-sections-ten-stages',book?.chapters.length===6&&book?.stageMappings.length===10);
check('book-thirty-one-scenes',book?.scenes.length===31&&unique(book.scenes.map(item=>item.id)));
check('book-all-thirty-eight-cast',book?.cast.length===38&&unique(book.cast.map(item=>item.actorId))&&book.cast.every(item=>item.quote&&item.primaryContentId));
check('scene-speakers-resolve',book?.scenes.every(scene=>scene.speakerActorIds.every(actorId=>book.cast.some(actor=>actor.actorId===actorId))));
check('all-cast-have-intentional-role',book?.cast.every(actor=>book.scenes.some(scene=>scene.speakerActorIds.includes(actor.actorId))||actor.facilityHookIds.length>0));
check('locked-fellow-policy-addressable',book?.cast.filter(item=>item.actorId.startsWith('fellow.')).length===18);
check('family-policy-addressable',book?.cast.filter(item=>item.actorId.startsWith('family.')).length===20);
check('facility-canonical-anchors',book?.facilities.length===12&&unique(book.facilities.map(item=>item.mapAnchor))&&book.facilityScopedAnchorAliases.length===1);
check('story-rewards-disabled-manual',book?.rewards.length===5&&book.rewards.every(item=>item.rewards===null&&item.productionEnabled===false&&item.claimMode==='manual'&&item.expires===false));
check('tutorials-gradual-neutral',book?.tutorials.length===12&&book.tutorials.every(item=>item.blocking===false&&item.skippable&&item.replayable&&item.loggable&&item.reward===null));

const clean=book.createStoryState();
check('fresh-story-state-valid',book.validateStoryState(clean).ok===true);
const queued=book.copy(clean);queued.queuedSceneItems.push({queueId:'story-queue.book1.prologue.waystone-call',sceneId:'story.book1.prologue.waystone-call',definitionVersion:1,reason:'fresh',eligibleRevision:1,queuedAt:1700000000000,predecessorSceneId:null});
check('eligible-queue-state-valid',book.validateStoryState(queued).ok===true);
const completed=book.copy(clean);completed.completedSceneIds.push('story.book1.prologue.waystone-call');completed.chronicleRecords.push({recordId:'chronicle-record.book1.prologue.waystone-call.1',sceneId:'story.book1.prologue.waystone-call',definitionVersion:1,resolution:'watched',resolvedRevision:2,resolvedAt:1700000000000,choiceId:null,rewardOfferId:null});
check('completed-chronicle-state-valid',book.validateStoryState(completed).ok===true);
const invalidCases=[
  state=>{state.schemaVersion=2},
  state=>{state.activeDefinitionSetIds[0]='definition-set.phase-17-book1.v2'},
  state=>{state.completedSceneIds.push('story.book1.prologue.waystone-call')},
  state=>{state.skippedSceneIds.push('story.book1.prologue.council')},
  state=>{state.completedBookIds.push(book.book.id)},
  state=>{state.queuedSceneItems.push({...queued.queuedSceneItems[0],reason:'stage-intro'})},
  state=>{state.chronicleRecords.push({})}
];
check('invalid-story-matrix-fails-closed',invalidCases.every(mutate=>{const state=book.copy(completed);mutate(state);return book.validateStoryState(state).ok===false}));

const definitionScript=indexSource.indexOf('<script src="src/phase17-book1.js"></script>');
const runtimeScript=indexSource.indexOf('<script src="src/phase17-runtime.js"></script>');
const inlineEnd=indexSource.lastIndexOf('</script>');
check('index-definition-seam-before-inline',definitionScript>=0&&definitionScript<indexSource.indexOf('<script>'));
check('index-runtime-factory-before-inline',runtimeScript>definitionScript&&runtimeScript<indexSource.indexOf('<script>'));
check('closure-adapter-installed-from-main-runtime',indexSource.includes('function phaseSeventeenInstallRuntime()')&&indexSource.includes('installer.install(Object.freeze({version:1')&&!runtimeSource.includes('eval('));
check('isolated-nonnative-runtime-installs-real-bridge',isolatedInstall?.ok===true&&isolatedInstall?.enabled===true&&isolatedInstall?.bridgeInstalled===true&&sandbox.__EVERSTEAD_PHASE_17_QA__?.version===book.bridgeVersion,isolatedInstall);
const disabledInstall=sandbox.EVERSTEAD_PHASE17_RUNTIME.install(isolatedAdapter({qa:false}));
check('ordinary-production-remains-fail-closed',disabledInstall?.ok===true&&disabledInstall?.enabled===false&&sandbox.__EVERSTEAD_PHASE_17_QA__===undefined,disabledInstall);
check('public-release-remains-off',definitionSource.includes('const PRODUCTION_ENABLED=false')&&runtimeSource.includes('publicRelease:false'));
check('private-candidate-uses-trusted-qa-capability',runtimeSource.includes('const PRIVATE_CANDIDATE_ENABLED=QA_ENABLED')&&runtimeSource.includes('const RUNTIME_ENABLED=RELEASE_ENABLED||PRIVATE_CANDIDATE_ENABLED'));
check('save-coordinator-only-mutations',!runtimeSource.includes('localStorage.')&&runtimeSource.includes("mutatePersisted(state=>ensureStoryInState(state),'phase17-activation'"));
check('predecessor-phase13-presentation-suppressed-not-deleted',runtimeSource.includes("suppression.add('phase17-successor')")&&!runtimeSource.includes('delete state.phase13Progress'));
check('campaign-first-clear-seam',runtimeSource.includes('runFellowCampaignBeforePhaseSeventeen')&&runtimeSource.includes("queueSceneInState(state,mapping.resolutionSceneId,'stage-resolution'"));
check('chronicle-under-more-five-nav',runtimeSource.includes("chronicleLocation:'more'")&&runtimeSource.includes('bottomNavigationCount:5'));
check('watch-skip-replay-reward-neutral',runtimeSource.includes('rewardApplications:0')&&runtimeSource.includes('phaseSeventeenReplayScene'));
check('story-claim-through-phase15-finalizer',runtimeSource.includes('phaseFifteenClaim(offerId,identity,{finalizerMode:mode})')&&runtimeSource.includes("SOURCE_TYPE='opportunity.story.reward'"));
check('phase17-does-not-approve-economy',!runtimeSource.includes('productionEconomyApproved:true')&&!definitionSource.includes('productionEnabled:true'));
check('wayfarer-separate-player',book.playerCharacter.id==='player.wayfarer'&&book.playerCharacter.kind==='player-character'&&book.playerCharacter.inRosterCounts===false&&book.playerCharacter.facilitySpeakerEligible===false&&book.playerCharacter.excludedDomains.includes('assignments'));
const markerStart=runtimeSource.indexOf('data-phase17-player-character="player.wayfarer"');
const markerEnd=runtimeSource.indexOf('const villageScreenBeforePhaseSeventeen',markerStart);
const markerSource=runtimeSource.slice(markerStart,markerEnd);
check('campaign-marker-framed-original-art',markerStart>=0&&markerSource.includes('campaignPresentationDefault')&&runtimeSource.includes("const campaignPresentationDefault='framed-background-static'")&&markerSource.includes('assets/player/wayfarer-profile-full.png')&&markerSource.includes('data-phase17-player-background="retained"')&&markerSource.includes('data-phase17-player-transparency-claim="none"')&&markerSource.includes('data-player-roster-member="false"')&&markerSource.includes('data-player-combat-power="none"')&&!markerSource.includes('transparent walking'));
check('campaign-marker-css-crop-and-silhouette-fallback',runtimeSource.includes('.phase17-wayfarer-mark img')&&runtimeSource.includes('object-fit:cover')&&runtimeSource.includes("const campaignPresentationFallback='original-everstead-silhouette'")&&markerSource.includes("dataset.imageState='fallback'")&&markerSource.includes("dataset.fallbackMode='${campaignPresentationFallback}'"));
check('campaign-identity-consolidates-predecessor-chip',(runtimeSource.match(/data-phase17-campaign-identity-card/g)||[]).length===1&&runtimeSource.includes('withoutPredecessor=html.replace(/<section class="card player-rank player-profile-trigger"')&&runtimeSource.includes('return marker+withoutPredecessor'));
check('campaign-identity-accessible-profile-invoker',runtimeSource.includes('role="button" tabindex="0" data-player-profile data-phase17-campaign-identity-card="player.wayfarer"')&&markerSource.includes('aria-label="Open The Wayfarer full-art Player profile"')&&runtimeSource.includes('.phase17-wayfarer:focus-visible'));
check('title-profile-art-metadata-preserved',same(book.playerCharacter.titleProfileAsset,{assetId:'asset.player.wayfarer.profile-full.v1',sha256:'a34c2d3a858f46be58450048b77c53965d4644690c2eb9a9c7649bd1b5139aaf',width:1024,height:1536,mode:'rgb-full-background',use:'title-profile-and-framed-campaign'}));
check('title-profile-renders-approved-full-background-art',runtimeSource.includes('src="assets/player/wayfarer-profile-full.png"')&&runtimeSource.includes('width="1024" height="1536"')&&runtimeSource.includes('data-art-treatment="full-background-native-aspect"')&&runtimeSource.includes("object-fit:cover"));
check('title-profile-dom-separate-and-accessible',runtimeSource.includes("data-player-roster-member','false'")&&runtimeSource.includes("data-player-shards','none'")&&runtimeSource.includes("data-player-assignment','none'")&&runtimeSource.includes('aria-label="Close The Wayfarer profile"')&&runtimeSource.includes(".phase17-player-profile-close')?.focus()"));
check('reduced-motion-production-contract',runtimeSource.includes('@media (prefers-reduced-motion: reduce)')&&runtimeSource.includes('data-everstead-reduced-motion')&&runtimeSource.includes('matchMediaMonkeyPatchEvidenceAccepted=false'));
check('focused-qa-does-not-touch-game-values',!definitionSource.includes('rewardPolicy')&&!runtimeSource.includes('ECONOMY_CONFIG='));

const failed=rows.filter(item=>!item.pass);
const report={phase:'17-runtime-foundation',status:failed.length?'FAIL':'PASS',total:rows.length,passed:rows.length-failed.length,failed:failed.length,rows};
process.stdout.write(`${JSON.stringify(report,null,2)}\n`);
if(failed.length)process.exitCode=1;
