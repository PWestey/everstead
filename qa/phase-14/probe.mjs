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
const facade=`    p14:Object.freeze({
      state:()=>clone(S),
      defaultGold:()=>defaultState(runtimeNow()).gold,
      valid:()=>validation(S,12),
      raw:()=>PERSISTED_RAW,
      writes:()=>PERSISTENCE_LOG.length,
      definitions:()=>clone(phaseThirteenQaDefinitions()),
      derive:()=>clone(phaseThirteenQaDerive(S)),
      renderModel:()=>clone(phaseThirteenQaRenderModel()),
      reset:id=>phaseThirteenQaResetFixture(id),
      resolveCampaignIntro:()=>phaseThirteenQaResolveScenes(PHASE_THIRTEEN.scenes.slice(0,3).map(item=>item.id)),
      runCampaign:id=>runFellowCampaign(id,{confirmed:true,present:false}),
      joinedPower:()=>totalFellowRosterPower(S),
      claim:id=>phaseFourteenQaClaim(id),
      reload:()=>phaseThirteenQaReload()
    }),
`;
const harness=helpers.replaceOnce(schemaTwelveHarness,'    tamperClear(){',facade+'    tamperClear(){','Phase 14 facade');
const tools=await helpers.toolsFor(harness);
const html=readFileSync(resolve(ROOT,'index.html'),'utf8'),application=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const phase12=readFileSync(resolve(ROOT,'src/phase12-foundation.js'),'utf8'),phase13=readFileSync(resolve(ROOT,'src/phase13-first-covenant.js'),'utf8');
if(!application)throw new Error('Everstead application script missing');
const instrumented=tools.instrument(application),source=phase12+'\n'+phase13+'\n'+instrumented;
const rows=[],add=(id,pass,detail='')=>{const row={id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)};rows.push(row);console.log(`${row.pass?'PASS':'FAIL'} ${id}${!row.pass&&row.detail?` · ${row.detail}`:''}`)};
const p=(run,expression)=>tools.internal(run,'p14.'+expression),same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const run=tools.runRealm({...tools.freshOptions,applicationSource:source,now:T0,deferTimers:true});
add('realm-booted',run.thrown===null,run.thrown?.message||'');

const definitions=p(run,'definitions()'),phase14=definitions.validation?.phase14;
add('definition-policy-and-profiles',phase14?.policy==='measurement-only-no-unapproved-production-tuning'&&same(phase14.profiles,['fresh','midgame','established']),phase14);
add('fixture-identities-complete',['p13.fixture.fresh.v1','p14.fixture.phase13-midgame.v1','p14.fixture.phase13-migrated.v1','p13.fixture.established.v1','p14.fixture.phase13-corrupt.v1','p14.fixture.phase13-offline.v1','p13.fixture.claim-ready.v1','p13.fixture.tutorial-ready.v1'].every(id=>phase14.fixtureIds.includes(id)),phase14.fixtureIds);
add('bounded-legacy-definition',definitions.legacy.tracks.length===1&&definitions.legacy.feats.length===1&&definitions.legacy.manualClaims.length===1,definitions.legacy);
add('no-phase14-facility-runtime',!Object.hasOwn(definitions,'facilities')&&!application.includes('__EVERSTEAD_PHASE_14_QA__'));

const fresh=p(run,"reset('p13.fixture.fresh.v1')"),freshReport=p(run,'derive().phase14Validation');
console.log('OBSERVED fresh pacing '+JSON.stringify({startingGold:freshReport.startingGold,joinedPower:freshReport.joinedPower,clears:freshReport.affordableConsecutiveFirstClears,total:freshReport.totalStageCount,stopReason:freshReport.stopReason,stopStageId:freshReport.stopStageId,endingGold:freshReport.endingGold,endingRank:freshReport.endingRank,endingPower:freshReport.endingPower,deadlockFree:freshReport.deadlockFree}));
const integerFields=['startingGold','joinedPower','stage1Cost','stage1RequiredPower','affordableConsecutiveFirstClears','totalStageCount','simulationWrites'];
add('fresh-fixture-valid',fresh.ok===true&&p(run,'valid().ok')===true,p(run,'valid().errors'));
add('fresh-fixture-values-preserved',freshReport.startingGold===p(run,'defaultGold()')&&fresh.state.gold===p(run,'defaultGold()'),{reportGold:freshReport.startingGold,stateGold:fresh.state.gold,defaultGold:p(run,'defaultGold()')});
add('fresh-pacing-real-and-bounded',freshReport.profileId==='fresh'&&integerFields.every(key=>Number.isSafeInteger(freshReport[key])&&freshReport[key]>=0)&&['gold','power','rank','sequence','complete'].includes(freshReport.stopReason)&&Number.isSafeInteger(freshReport.endingGold)&&freshReport.endingGold>=0&&Number.isSafeInteger(freshReport.endingRank)&&freshReport.endingRank>=1&&Number.isSafeInteger(freshReport.endingPower)&&freshReport.endingPower>=0&&freshReport.affordableConsecutiveFirstClears<=freshReport.totalStageCount&&freshReport.stage1Reachable===true,freshReport);
add('measurement-write-free',freshReport.simulationWrites===0&&freshReport.policy===phase14.policy,{writes:freshReport.simulationWrites,policy:freshReport.policy});
add('reward-impact-canonical',freshReport.rewardImpact.length===3&&freshReport.rewardImpact.every(item=>item.canonical===true&&item.rewardPolicyVersion===1&&same(item.profileIds,phase14.profiles)&&Object.values(item.postClaimDelta).every(Number.isSafeInteger)&&item.forbiddenSystems.length===0),freshReport.rewardImpact);
p(run,'resolveCampaignIntro()');let actualClears=0;for(let ordinal=1;ordinal<=freshReport.totalStageCount;ordinal++){const result=p(run,`runCampaign('broken-roads-${ordinal}')`);if(!result?.ok)break;actualClears++}const actualCampaignState=p(run,'state()');
add('clone-simulation-matches-production-runs',actualClears===freshReport.affordableConsecutiveFirstClears&&actualCampaignState.gold===freshReport.endingGold&&actualCampaignState.player.rank===freshReport.endingRank&&p(run,'joinedPower()')===freshReport.endingPower,{actualClears,actualGold:actualCampaignState.gold,actualRank:actualCampaignState.player.rank,actualPower:p(run,'joinedPower()'),report:freshReport});

const midgame=p(run,"reset('p14.fixture.phase13-midgame.v1')"),midgameDerived=p(run,'derive()');
add('midgame-fixture-valid',midgame.ok===true&&p(run,'valid().ok')===true&&midgameDerived.phase14Validation.profileId==='midgame',p(run,'valid().errors'));
add('midgame-history-honest',same(midgameDerived.story.history.map(item=>item.id),definitions.scenes.slice(0,3).map(item=>item.id)),midgameDerived.story.history);

const migrated=p(run,"reset('p14.fixture.phase13-migrated.v1')"),migratedDerived=p(run,'derive()');
add('migrated-fixture-valid',migrated.ok===true&&p(run,'valid().ok')===true&&migratedDerived.phase14Validation.profileId==='established',p(run,'valid().errors'));
add('migrated-baseline-honest',migratedDerived.migration.historicalStoryBaseline==='unknown'&&migratedDerived.migration.historicalTutorialBaseline==='unknown'&&migratedDerived.migration.inventedCompletionCount===0&&migratedDerived.migration.inventedClaimCount===0&&migratedDerived.migration.recapAutoPresentedThisSession<=1,migratedDerived.migration);

p(run,"reset('p13.fixture.fresh.v1')");
const corruptRaw=p(run,'raw()'),corruptState=p(run,'state()'),corruptWrites=p(run,'writes()'),corrupt=p(run,"reset('p14.fixture.phase13-corrupt.v1')");
add('corrupt-refused-detached',corrupt.ok===false&&corrupt.writes===0&&same(corrupt.failedChecks,['duplicate-id','future-definition-version','mismatched-offer-identity','unknown-legacy','unknown-offer','unknown-receipt','unknown-speaker','unknown-story','unknown-tutorial'])&&p(run,'raw()')===corruptRaw&&p(run,'state().saveMeta.revision')===corruptState.saveMeta.revision&&p(run,'writes()')===corruptWrites,corrupt);

const offline=p(run,"reset('p14.fixture.phase13-offline.v1')"),offlineDerived=p(run,'derive()');
add('offline-fixture-valid-and-banked',offline.ok===true&&p(run,'valid().ok')===true&&offlineDerived.claims.some(item=>item.id==='qa.phase13.claim.first-covenant.v1'&&item.status==='ready'&&item.expiresAt===null),offlineDerived.claims);

p(run,"reset('p13.fixture.claim-ready.v1')");
const firstClaim=p(run,"claim('qa.phase13.claim.first-covenant.v1')"),claimedRaw=p(run,'raw()'),claimed=p(run,'derive()'),claimRender=p(run,'renderModel()');
add('claim-carry-and-presentation',firstClaim.ok===true&&Number.isSafeInteger(firstClaim.carriedProgress)&&firstClaim.presentation.manual===true&&firstClaim.presentation.individual===true&&firstClaim.presentation.confirmationRequired===false&&firstClaim.presentation.rewardSummaryEquivalent===true&&claimed.legacy.carriedProgress===firstClaim.carriedProgress,firstClaim);
add('claim-render-contract',claimRender.claim.open===true&&claimRender.claim.rewardSummaryExact===true&&claimRender.claim.horizontalOverflow===false&&claimRender.claim.controlsClipped===false,claimRender.claim);
p(run,'reload()');
add('claim-carry-reload-durable',p(run,'raw()')===claimedRaw&&p(run,'derive().legacy.carriedProgress')===firstClaim.carriedProgress);

const render=p(run,'renderModel()'),controls=render.accessibility.supportedControls;
add('accessibility-contract',render.accessibility.keyboardOrderValid===true&&render.accessibility.focusReturnValid===true&&render.accessibility.escapeNeutral===true&&['next','back','skip','log','close','replay','claim'].every(id=>controls.includes(id)),render.accessibility);
add('final-state-valid',p(run,'valid().ok')===true,p(run,'valid().errors'));
add('production-values-not-redeclared',!application.includes('PHASE_FOURTEEN_QA_CURRENCY')&&!application.includes('PHASE_FOURTEEN_QA_STAMINA'));

const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed;
console.log(`Phase 14 focused probe: ${passed}/${rows.length}`);
if(failed)process.exitCode=1;
