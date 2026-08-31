import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname),T0=1788206400000;
const helperFile=readFileSync(resolve(ROOT,'qa/phase-10c2/engine-probe.mjs'),'utf8');
const helperBoundary=helperFile.indexOf('export async function runEngineProbe');
if(helperBoundary<0)throw new Error('Phase 10C-2 helper boundary missing');
const helperSource=helperFile.slice(0,helperBoundary)
  .replace("import {simulateBundle} from '../phase-10b/simulate.mjs';\n",'')
  .replace("const ROOT=resolve(new URL('../..',import.meta.url).pathname);",`const ROOT=${JSON.stringify(ROOT)};`)
  +'\nexport {phaseNineHarness,toolsFor,engineHarness,replaceOnce};\n';
const helpers=await import('data:text/javascript;base64,'+Buffer.from(helperSource).toString('base64'));
const phaseNine=await helpers.phaseNineHarness(),baseHarness=helpers.engineHarness(phaseNine);
const schemaTwelveHarness=helpers.replaceOnce(baseHarness,'return value?.schemaVersion===11?value:null','return value?.schemaVersion===12?value:null','schema-12 active helper');
const facade=`    p12:Object.freeze({
      state:()=>clone(S),
      valid:(value=S)=>validation(value,12),
      receipt:()=>clone(phaseTwelveReceipt(S)),
      actors:()=>clone(PHASE_TWELVE_DIALOGUE_ACTORS),
      definitions:()=>clone(phaseTwelveQaDefinitions()),
      derive:()=>clone(phaseTwelveQaDerive(S)),
      flags:()=>clone(FEATURE_FLAGS),
      raw:()=>PERSISTED_RAW,
      writes:()=>PERSISTENCE_LOG.length,
      offer:input=>mutatePersisted((state,now)=>phaseTwelveQueueRewardOffer(input,state,now),'phase12-reward-offer',{renderAfter:false}),
      claim:(id,identity=null)=>phaseTwelveClaimReward(id,{expectedIdentity:identity,present:false}),
      eligible:features=>clone(phaseTwelveTutorialEligible({state:S,availableFeatureIds:features})),
      tutorial:(action,id)=>phaseTwelveTutorialAction(action,id),
      runCampaign:id=>runFellowCampaign(id,{confirmed:true,present:false}),
      advance:ms=>mutatePersisted(()=>{},'boot',{renderAfter:false,opening:true,capturedNow:runtimeNow()+ms}),
      establish:()=>mutatePersisted(state=>{state.gold=612345;state.prosperity=321;state.oaths[0].count=5;state.oaths[0].streak=5;state.oaths[0].doneKey='qa-established'},'phase12-qa-fixture',{renderAfter:false}),
      tamper(kind){const value=clone(S);if(kind==='actor')value.foundationProfile.dialogueActorIds.pop();if(kind==='tutorial-duplicate')value.tutorialProgress.seenStepIds=['tutorial.story-and-chronicle.open-story','tutorial.story-and-chronicle.open-story'];if(kind==='offer-identity'){const id=Object.keys(value.rewardClaims.pendingOffers)[0];if(id)value.rewardClaims.pendingOffers[id].identity='bad'}return validation(value,12)},
      canonicalRewards:value=>{try{return{ok:true,value:PHASE_TWELVE.canonicalRewards(value,phaseTwelveTargets())}}catch(error){return{ok:false,error:String(error.message||error)}}},
      project:()=>phaseTwelveProjectPredecessor(S)
    }),
`;
const harness=helpers.replaceOnce(schemaTwelveHarness,'    tamperClear(){',facade+'    tamperClear(){','Phase 12 facade');
const tools=await helpers.toolsFor(harness);
const html=readFileSync(resolve(ROOT,'index.html'),'utf8'),application=html.match(/<script>([\s\S]*?)<\/script>/)?.[1],moduleSource=readFileSync(resolve(ROOT,'src/phase12-foundation.js'),'utf8');
if(!application)throw new Error('Everstead application script missing');
const predecessorSource=tools.instrument(application),source=moduleSource+'\n'+tools.instrument(application);
const rows=[],add=(id,pass,detail='')=>{const row={id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)};rows.push(row);console.log(`${row.pass?'PASS':'FAIL'} ${id}${!row.pass&&row.detail?` · ${row.detail}`:''}`)};
const p=(run,expression)=>tools.internal(run,'p12.'+expression),same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);

add('external-module-linked',html.includes('<script src="src/phase12-foundation.js"></script>'));
add('legacy-story-source-renamed',html.includes('LEGACY_STORY_STAGE_DATA')&&!/const STORY=/.test(html));
add('qa-bridge-fails-closed-as-a-whole',application.includes("if(!PHASE_TWELVE_EXTERNAL||!QA_BRIDGE_ALLOWED||!QA_ALLOW_DESTRUCTIVE)return")&&application.includes("version:'phase-12-independent-qa-v1'"));
const fresh=tools.runRealm({...tools.freshOptions,applicationSource:source,now:T0,deferTimers:true}),freshState=tools.active(fresh),freshReceipt=p(fresh,'receipt()'),definitions=p(fresh,'definitions()'),actors=p(fresh,'actors()');
add('fresh-activation-valid',fresh.thrown===null&&p(fresh,'valid().ok')===true,fresh.thrown?.message||p(fresh,'valid().errors'));
add('activation-receipt-exact',freshReceipt?.id==='phase-12-foundation-activation'&&freshReceipt.from===12&&freshReceipt.to===12&&freshReceipt.activationRevision===freshState.saveMeta.revision&&freshReceipt.configIdentity==='phase-12-foundation-v1',freshReceipt);
add('activation-policy-explicit',freshReceipt?.definitionSetId==='definition-set.phase-12-foundation.v1'&&freshReceipt.transactionClass==='activation'&&freshReceipt.historicalStatisticPolicy==='unknown-historical',freshReceipt);
add('fresh-progress-empty',freshState.narrativeProgress.seenNodeIds.length===0&&freshState.chronicleProgress.unlockedEntryIds.length===0&&Object.values(freshState.legacyProgress.metricDeltas).every(value=>value===0)&&freshState.tutorialProgress.seenStepIds.length===0&&freshState.facilityProgress.discoveredIds.length===0&&Object.keys(freshState.opportunityLedger.pendingById).length===0&&Object.keys(freshState.rewardClaims.pendingOffers).length===0&&freshState.rewardClaims.receipts.length===0);
add('definition-catalog-present',definitions.catalog.length>=80&&definitions.rewards.length===12&&definitions.tutorials.length===5&&definitions.features.length===5,{catalog:definitions.catalog.length,rewards:definitions.rewards.length,tutorials:definitions.tutorials.length,features:definitions.features.length});
add('facility-map-contract-complete',definitions.catalog.filter(item=>item.kind==='facility').length===12,definitions.catalog.filter(item=>item.kind==='facility').map(item=>item.id));
add('all-roster-dialogue-actors',actors.length===38&&actors.filter(item=>item.rosterKind==='fellow').length===18&&actors.filter(item=>item.rosterKind==='family').length===20,{total:actors.length,fellows:actors.filter(item=>item.rosterKind==='fellow').length,family:actors.filter(item=>item.rosterKind==='family').length});
add('all-actors-eligible-everywhere',actors.every(actor=>same(actor.contexts,['village-quote','story','dialogue'])&&actor.quote&&actor.contentId),actors.filter(actor=>!actor.quote||!actor.contentId));
add('dialogue-coverage-complete',Object.keys(definitions.dialogueCoverage).length===38&&actors.every(actor=>definitions.dialogueCoverage[actor.rosterId]?.includes(actor.contentId)));
add('legacy-modes-stay-disabled',Object.values(definitions.legacyModes).every(value=>value===false)&&['story','tower','trading','patrol','operations'].every(id=>p(fresh,'flags()')[id]===false),p(fresh,'flags()'));
add('baseline-is-observation-only',freshReceipt.baseline.gold===freshState.gold&&freshReceipt.baseline.prosperity===freshState.prosperity&&Object.values(freshState.legacyProgress.metricDeltas).every(value=>value===0),{baseline:freshReceipt.baseline,metrics:freshState.legacyProgress.metricDeltas});

const canonical=p(fresh,"canonicalRewards([{kind:'gold',targetId:null,amount:5},{kind:'fellowExp',targetId:'cael',amount:2}])"),duplicate=p(fresh,"canonicalRewards([{kind:'gold',targetId:null,amount:5},{kind:'gold',targetId:null,amount:2}])"),fraction=p(fresh,"canonicalRewards([{kind:'gold',targetId:null,amount:1.5}])");
add('reward-bundle-contract',canonical.ok===true&&duplicate.ok===false&&fraction.ok===false,{canonical,duplicate,fraction});
const offerInput="{id:'reward.offer.qa.exact-once',sourceType:'opportunity.facility.activity',sourceId:'facility.restaurant',rewards:[{kind:'gold',targetId:null,amount:1250},{kind:'fellowExp',targetId:'cael',amount:25}]}";
const offerResult=p(fresh,`offer(${offerInput})`),offered=tools.active(fresh).rewardClaims.pendingOffers['reward.offer.qa.exact-once'],beforeClaim=tools.active(fresh),writesBeforeClaim=tools.writes(fresh),claim=p(fresh,`claim('reward.offer.qa.exact-once','${offered.identity}')`),afterClaim=tools.active(fresh),writesAfterClaim=tools.writes(fresh),replay=p(fresh,`claim('reward.offer.qa.exact-once','${offered.identity}')`);
add('offer-queues-canonically',offerResult?.ok===true&&offered?.identity&&same(offered.rewards,[{kind:'fellowExp',targetId:'cael',amount:25},{kind:'gold',targetId:null,amount:1250}]),offered);
add('claim-applies-full-bundle',claim.ok===true&&afterClaim.gold-beforeClaim.gold===1250&&afterClaim.fellows.cael.exp-beforeClaim.fellows.cael.exp===25&&afterClaim.rewardClaims.receipts.length===1,claim);
add('claim-receipt-bound',claim.receipt.pendingIdentity===offered.identity&&claim.receipt.offerId===offered.id&&claim.receipt.sequence===1&&claim.receipt.identity&&afterClaim.rewardClaims.pendingOffers[offered.id]===undefined,claim.receipt);
add('claim-exactly-once',replay.ok===false&&replay.reason==='already-claimed'&&tools.writes(fresh)===writesAfterClaim&&writesAfterClaim>writesBeforeClaim,replay);
add('post-claim-valid',p(fresh,'valid().ok')===true,p(fresh,'valid().errors'));

const tutorialFeatures=definitions.features.map(item=>item.id),eligible=p(fresh,`eligible(${JSON.stringify(tutorialFeatures)})`);
add('tutorials-gradual',eligible.length===1&&eligible[0].stepId==='tutorial.first-covenant-objective.intro.open',eligible);
const seen=p(fresh,"tutorial('seen','tutorial.first-covenant-objective.intro.open')"),eligibleAfterSeen=p(fresh,`eligible(${JSON.stringify(tutorialFeatures)})`),ack=p(fresh,"tutorial('acknowledge','tutorial.first-covenant-objective.intro.open')"),replayTutorial=p(fresh,"tutorial('replay','tutorial.first-covenant-objective.intro')"),tutorialState=tools.active(fresh).tutorialProgress;
add('tutorial-auto-once',seen.ok===true&&!eligibleAfterSeen.some(item=>item.stepId==='tutorial.first-covenant-objective.intro.open'),eligibleAfterSeen);
add('tutorial-ack-and-replay-separate',ack.ok===true&&replayTutorial.ok===true&&tutorialState.completedStepIds.includes('tutorial.first-covenant-objective.intro.open')&&tutorialState.completionReceiptIds.includes('tutorial.receipt.first-covenant-objective.intro')&&tutorialState.replayCountsByTutorial['tutorial.first-covenant-objective.intro']===1,tutorialState);
const campaignAfterTutorial=p(fresh,"runCampaign('broken-roads-1')");
add('tutorial-never-gates-play',campaignAfterTutorial?.ok===true,campaignAfterTutorial);
add('post-tutorial-valid',p(fresh,'valid().ok')===true,p(fresh,'valid().errors'));

const tamperRun=tools.runRealm({...tools.freshOptions,applicationSource:source,now:T0+1000,deferTimers:true});p(tamperRun,`offer(${offerInput.replace('exact-once','tamper')})`);
add('actor-registry-tamper-rejected',p(tamperRun,"tamper('actor')").ok===false,p(tamperRun,"tamper('actor')"));
add('tutorial-duplicate-rejected',p(tamperRun,"tamper('tutorial-duplicate')").ok===false,p(tamperRun,"tamper('tutorial-duplicate')"));
add('offer-identity-tamper-rejected',p(tamperRun,"tamper('offer-identity')").ok===false,p(tamperRun,"tamper('offer-identity')"));

const predecessor=tools.runRealm({...tools.freshOptions,applicationSource:predecessorSource,now:T0+2000,deferTimers:true});p(predecessor,'establish()');const predecessorState=tools.active(predecessor),predecessorRaw=tools.activeRaw(predecessor),migrated=tools.runRealm({...tools.freshOptions,applicationSource:source,activeRaw:predecessorRaw,now:T0+3000,deferTimers:true}),migratedState=tools.active(migrated),migratedReceipt=p(migrated,'receipt()');
add('established-save-activates',migrated.thrown===null&&p(migrated,'valid().ok')===true,migrated.thrown?.message||p(migrated,'valid().errors'));
add('established-resources-preserved',migratedState.gold===predecessorState.gold&&migratedState.prosperity===predecessorState.prosperity&&migratedState.oaths[0].count===5,{before:{gold:predecessorState.gold,prosperity:predecessorState.prosperity,oath:predecessorState.oaths[0]},after:{gold:migratedState.gold,prosperity:migratedState.prosperity,oath:migratedState.oaths[0]}});
add('established-baseline-explicit',migratedReceipt.baseline.gold===predecessorState.gold&&migratedReceipt.baseline.prosperity===predecessorState.prosperity&&migratedReceipt.baseline.oathCountTotal>=5,migratedReceipt.baseline);
add('no-invented-historical-activity',migratedState.narrativeProgress.seenNodeIds.length===0&&migratedState.chronicleProgress.unlockedEntryIds.length===0&&Object.values(migratedState.legacyProgress.metricDeltas).every(value=>value===0)&&migratedState.rewardClaims.receipts.length===0);
const reload=tools.runRealm({applicationSource:source,initialSlots:Object.fromEntries(migrated.slots),now:T0+4000,deferTimers:true}),reloadState=tools.active(reload);
add('activation-idempotent',reloadState.saveMeta.appliedMigrations.filter(item=>item.id==='phase-12-foundation-activation').length===1&&same(reloadState.foundationProfile,migratedState.foundationProfile)&&p(reload,'valid().ok')===true,{receipts:reloadState.saveMeta.appliedMigrations.map(item=>item.id),errors:p(reload,'valid().errors')});

const offline=tools.runRealm({...tools.freshOptions,applicationSource:source,now:T0+5000,deferTimers:true}),offlineBefore=tools.active(offline),advanced=p(offline,'advance(172800000)'),offlineAfter=tools.active(offline);
add('offline-cap-preserved',advanced?.ok===true&&advanced.accrual?.elapsed===86400000&&offlineAfter.pendingGold>offlineBefore.pendingGold,{accrual:advanced?.accrual,pending:[offlineBefore.pendingGold,offlineAfter.pendingGold]});
add('offline-keeps-foundation-valid',p(offline,'valid().ok')===true&&offlineAfter.saveMeta.appliedMigrations.filter(item=>item.id==='phase-12-foundation-activation').length===1,p(offline,'valid().errors'));

const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed;
console.log(`Phase 12 focused probe: ${passed}/${rows.length}`);
if(failed)process.exitCode=1;
