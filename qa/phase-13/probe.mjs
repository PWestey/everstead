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
const facade=`    p13:Object.freeze({
      state:()=>clone(S),
      valid:()=>validation(S,12),
      progress:()=>clone(phaseThirteenProgress(S)),
      raw:()=>PERSISTED_RAW,
      writes:()=>PERSISTENCE_LOG.length,
      definitions:()=>clone(phaseThirteenQaDefinitions()),
      derive:()=>clone(phaseThirteenQaDerive(S)),
      event:(id,payload)=>phaseThirteenEvent(id,payload,{present:false}),
      story:(id,action)=>phaseThirteenStoryAction(id,action,{present:false}),
      tutorial:(id,action)=>phaseThirteenTutorialAction(id,action,{present:false}),
      claim:id=>phaseThirteenClaim(id,{present:false}),
      blockedEvent:()=>phaseThirteenQaProbeFailedEvent(),
      activate:()=>phaseThirteenEnsureActivated(),
      establish:()=>mutatePersisted(state=>{state.gold=612345;state.prosperity=321;state.oaths[0].count=5;state.oaths[0].streak=5;state.oaths[0].doneKey='qa-established'},'phase13-qa-fixture',{renderAfter:false})
    }),
`;
const harness=helpers.replaceOnce(schemaTwelveHarness,'    tamperClear(){',facade+'    tamperClear(){','Phase 13 facade');
const tools=await helpers.toolsFor(harness);
const html=readFileSync(resolve(ROOT,'index.html'),'utf8'),application=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const phase12=readFileSync(resolve(ROOT,'src/phase12-foundation.js'),'utf8'),phase13=readFileSync(resolve(ROOT,'src/phase13-first-covenant.js'),'utf8');
if(!application)throw new Error('Everstead application script missing');
const instrumented=tools.instrument(application),source=phase12+'\n'+phase13+'\n'+instrumented,phase12Only=phase12+'\n'+instrumented;
const rows=[],add=(id,pass,detail='')=>{const row={id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)};rows.push(row);console.log(`${row.pass?'PASS':'FAIL'} ${id}${!row.pass&&row.detail?` · ${row.detail}`:''}`)};
const p=(run,expression)=>tools.internal(run,'p13.'+expression),same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);

const fresh=tools.runRealm({...tools.freshOptions,applicationSource:source,now:T0,deferTimers:true}),freshState=p(fresh,'state()'),definitions=p(fresh,'definitions()');
add('fresh-activation-valid',fresh.thrown===null&&p(fresh,'valid().ok')===true,fresh.thrown?.message||p(fresh,'valid().errors'));
add('phase12-receipt-preserved-once',freshState.saveMeta.appliedMigrations.filter(item=>item.id==='phase-12-foundation-activation').length===1);
add('phase13-activation-idempotent',p(fresh,'progress()')?.configIdentity==='phase-13-first-covenant-v1'&&p(fresh,'activate()')===false,p(fresh,'progress()'));
add('locked-definition-counts',definitions.scenes.length===5&&definitions.tutorials.length===41&&definitions.tutorialCoverageIds.length===79,{scenes:definitions.scenes.length,tutorials:definitions.tutorials.length,coverage:definitions.tutorialCoverageIds.length});
add('cast-coverage-preserved',definitions.cast.fellows.length===18&&definitions.cast.family.length===20&&[...definitions.cast.fellows,...definitions.cast.family].every(item=>item.profileQuoteId&&item.ambientIds.length&&item.authoredContentIds.length));

const resourcesBefore=p(fresh,'derive().resources'),open=p(fresh,"event('surface.opened',{surface:'village',userInitiated:true})"),openAgain=p(fresh,"event('surface.opened',{surface:'village',userInitiated:true})"),opened=p(fresh,'derive()');
add('waystone-queues-once',open.ok===true&&openAgain.ok===true&&opened.story.activeId==='story.book1.prologue.waystone-call'&&!opened.story.pendingIds.includes('story.book1.prologue.waystone-call'),opened.story);
const watch=p(fresh,"story('story.book1.prologue.waystone-call','watch')"),watched=p(fresh,'derive()');
add('watch-is-reward-neutral',watch.ok===true&&same(watched.resources,resourcesBefore)&&watched.story.history.filter(item=>item.id==='story.book1.prologue.waystone-call').length===1&&!watched.claims.some(item=>item.sourceId==='story.book1.prologue.waystone-call'));
p(fresh,"event('surface.opened',{surface:'village',userInitiated:true})");p(fresh,"story('story.book1.prologue.council','skip')");
add('chronicle-records-watch-and-skip',same(p(fresh,'derive().story.chronicleIds'),['story.book1.prologue.waystone-call','story.book1.prologue.council']),p(fresh,'derive().story'));

const preclear=p(fresh,"event('campaign.preclear-requested',{stageId:'broken-roads-1'})"),intro=p(fresh,'derive()');
add('campaign-intro-precedes-spend',preclear.ok===true&&preclear.spendAllowed===false&&intro.story.activeId==='story.book1.chapter1.village-toll.intro',intro.story);
p(fresh,"story('story.book1.chapter1.village-toll.intro','skip')");
add('campaign-spend-released',p(fresh,"event('campaign.preclear-requested',{stageId:'broken-roads-1'})").spendAllowed===true);
p(fresh,"event('campaign.first-clear-committed',{stageId:'broken-roads-1'})");p(fresh,"story('story.book1.chapter1.village-toll.resolution','watch')");
const claimReady=p(fresh,'derive()'),storyClaim=claimReady.claims.find(item=>item.sourceId==='story.book1.chapter1.village-toll.resolution');
add('story-claim-banks-after-resolution',storyClaim?.status==='ready'&&storyClaim?.paid===false&&storyClaim?.expiresAt===null,storyClaim);
const beforeClaimState=p(fresh,'state()'),firstClaim=p(fresh,"claim('qa.phase13.claim.first-covenant.v1')"),afterClaimState=p(fresh,'state()'),writesAfterClaim=p(fresh,'writes()'),secondClaim=p(fresh,"claim('qa.phase13.claim.first-covenant.v1')");
add('claim-exactly-once',firstClaim.ok===true&&afterClaimState.saveMeta.revision===beforeClaimState.saveMeta.revision+1&&secondClaim.ok===false&&p(fresh,'writes()')===writesAfterClaim,{firstClaim,secondClaim});

const tutorialId='tutorial.story.objective.first-covenant',tutorialResources=p(fresh,'derive().resources');
p(fresh,`tutorial('${tutorialId}','open')`);p(fresh,`tutorial('${tutorialId}','skip')`);const beforeReplay=p(fresh,'derive().tutorials'),rawBeforeReplay=p(fresh,'raw()');p(fresh,`tutorial('${tutorialId}','replay')`);
add('tutorial-skip-and-replay-neutral',same(p(fresh,'derive().resources'),tutorialResources)&&same(p(fresh,'derive().tutorials'),beforeReplay)&&p(fresh,'raw()')===rawBeforeReplay,p(fresh,'derive().tutorials'));
const failure=p(fresh,'blockedEvent()');
add('blocked-event-leaves-state-and-raw-unchanged',failure.ok===true&&failure.stateUnchanged===true&&failure.rawUnchanged===true&&failure.writes===0,failure);
add('final-state-valid',p(fresh,'valid().ok')===true,p(fresh,'valid().errors'));

const predecessor=tools.runRealm({...tools.freshOptions,applicationSource:phase12Only,now:T0+1000,deferTimers:true});p(predecessor,'establish()');const predecessorState=p(predecessor,'state()'),migrated=tools.runRealm({...tools.freshOptions,applicationSource:source,activeRaw:tools.activeRaw(predecessor),now:T0+2000,deferTimers:true}),migratedState=p(migrated,'state()');
add('established-phase12-save-composes-cleanly',migrated.thrown===null&&p(migrated,'valid().ok')===true&&p(migrated,'progress()')?.baseline.established===true,migrated.thrown?.message||p(migrated,'valid().errors'));
add('established-resources-not-rewritten',migratedState.gold===predecessorState.gold&&migratedState.prosperity===predecessorState.prosperity&&migratedState.oaths[0].count===predecessorState.oaths[0].count,{before:{gold:predecessorState.gold,prosperity:predecessorState.prosperity,oath:predecessorState.oaths[0].count},after:{gold:migratedState.gold,prosperity:migratedState.prosperity,oath:migratedState.oaths[0].count}});
add('established-activation-invents-no-history',Object.keys(migratedState.phase13Progress.sceneResolutionsById).length===0&&migratedState.phase13Progress.pendingSceneIds.length===0&&migratedState.narrativeProgress.seenNodeIds.length===0&&migratedState.chronicleProgress.unlockedEntryIds.length===0);

add('phase13-writes-use-coordinator',!/phaseThirteen(?:QueueScene|PromoteScene|RecordScene|QueueOffer)InState\(S/.test(application));
add('missing-phase13-module-keeps-phase12-playable',predecessor.thrown===null&&p(predecessor,'progress()')===null&&p(predecessor,'valid().ok')===true,predecessor.thrown?.message||p(predecessor,'valid().errors'));
const malformedPhase13=phase13.replace("const CONFIG_ID='phase-13-first-covenant-v1';","const CONFIG_ID='phase-13-invalid';"),malformed=tools.runRealm({...tools.freshOptions,applicationSource:phase12+'\n'+malformedPhase13+'\n'+instrumented,now:T0+3000,deferTimers:true});
add('malformed-phase13-module-fails-closed',Boolean(malformed.thrown)&&String(malformed.thrown.message).includes('First Covenant contract did not validate'),malformed.thrown?.message||'no error');

const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed;
console.log(`Phase 13 focused probe: ${passed}/${rows.length}`);
if(failed)process.exitCode=1;
