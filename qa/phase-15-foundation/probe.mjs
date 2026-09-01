import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const root=new URL('../../',import.meta.url);
const source=readFileSync(new URL('src/phase15-facilities.js',root),'utf8');
const html=readFileSync(new URL('index.html',root),'utf8');
const context={};
vm.runInNewContext(source,context,{filename:'src/phase15-facilities.js'});
const api=context.EVERSTEAD_PHASE15_FACILITIES;
const rows=[];
const check=(id,fn)=>{try{fn();rows.push({id,pass:true})}catch(error){rows.push({id,pass:false,error:error.message})}};
const same=(actual,expected)=>assert.equal(JSON.stringify(actual),JSON.stringify(expected));

check('definitions-valid',()=>same(api.validateDefinitions(),{ok:true,errors:[]}));
check('twelve-canonical-anchors',()=>{assert.equal(api.facilities.length,12);assert.equal(new Set(api.facilities.map(item=>item.mapAnchor)).size,12)});
check('reordered-anchor-map-valid',()=>{const reordered=Object.fromEntries(Object.entries(api.canonicalAnchors).reverse());assert.equal(api.validateAnchorMap(reordered),true);same(Object.keys(api.canonicalizeAnchorMap(reordered)),api.facilities.map(item=>item.id))});
check('anchor-map-extra-fails-closed',()=>{const value={...api.canonicalAnchors,'facility.unknown':'unknown'};assert.equal(api.validateAnchorMap(value),false);assert.throws(()=>api.canonicalizeAnchorMap(value))});
check('anchor-map-missing-fails-closed',()=>{const value={...api.canonicalAnchors};delete value['facility.forge'];assert.equal(api.validateAnchorMap(value),false);assert.throws(()=>api.canonicalizeAnchorMap(value))});
check('duplicate-anchor-fails-closed',()=>{const value={...api.canonicalAnchors,'facility.forge':'central-crystal'};assert.equal(api.validateAnchorMap(value),false);assert.throws(()=>api.canonicalizeAnchorMap(value))});

const interval=3_600_000;
check('capacity-drops-whole-debt-retains-remainder',()=>{const result=api.planSettlement({cursorAt:0,carryMs:0,nextOrdinal:7,currentCount:3,intervalMs:interval,bankCapacity:4,now:interval*2+interval/2});same(result.createdOrdinals,[8]);assert.equal(result.carryMs,interval/2);assert.equal(result.saturated,true);assert.equal(result.hiddenDebtMs,0)});
check('already-full-subinterval-carry-retained',()=>{const result=api.planSettlement({cursorAt:100,carryMs:250,nextOrdinal:8,currentCount:4,intervalMs:interval,bankCapacity:4,now:450});same(result.createdOrdinals,[]);assert.equal(result.carryMs,600);assert.equal(result.saturated,true)});
check('already-full-whole-debt-dropped',()=>{const result=api.planSettlement({cursorAt:0,carryMs:interval/4,nextOrdinal:8,currentCount:4,intervalMs:interval,bankCapacity:4,now:interval*2});same(result.createdOrdinals,[]);assert.equal(result.carryMs,interval/4);assert.equal(result.hiddenDebtMs,0)});
check('reopen-after-freeing-one-slot',()=>{const full=api.planSettlement({cursorAt:0,carryMs:0,nextOrdinal:8,currentCount:4,intervalMs:interval,bankCapacity:4,now:interval/2});const reopened=api.planSettlement({cursorAt:full.cursorAt,carryMs:full.carryMs,nextOrdinal:8,currentCount:3,intervalMs:interval,bankCapacity:4,now:interval});same(reopened.createdOrdinals,[9]);assert.equal(reopened.carryMs,0)});
check('settlement-bank-cap-bounded',()=>assert.throws(()=>api.planSettlement({cursorAt:0,carryMs:0,nextOrdinal:0,currentCount:0,intervalMs:1,bankCapacity:api.maxBankCapacity+1,now:1})));
check('settlement-ordinal-overflow-fails',()=>assert.throws(()=>api.planSettlement({cursorAt:0,carryMs:0,nextOrdinal:Number.MAX_SAFE_INTEGER,currentCount:0,intervalMs:1,bankCapacity:1,now:1})));
check('claimed-range-replay-authority',()=>{const once=api.claimedRangesAdd([],1),later=api.claimedRangesAdd(once,3),merged=api.claimedRangesAdd(later,2);same(merged,[[1,3]]);assert.equal(api.claimedRangesHas(merged,2),true)});
check('five-year-replay-authority-remains-bounded',()=>{let ranges=[];const claims=5*365*24;for(let ordinal=1;ordinal<=claims;ordinal++)ranges=api.claimedRangesAdd(ranges,ordinal);same(ranges,[[1,claims]]);assert.equal(JSON.stringify(ranges).length<32,true)});

check('inline-scripts-parse',()=>{for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(match[1].trim())new Function(match[1])});
check('unified-v2-migration-seam-present',()=>{assert.match(html,/delete state\.rewardClaims/);assert.match(html,/pendingOffers:clone\(predecessorClaims\.pendingOffers\)/);assert.match(html,/phaseTwelveClaimReward=function/);assert.match(html,/globalClaimedSourceIds/)});
check('predecessor-village-composed',()=>{assert.match(html,/const prior=villageScreenBeforePhaseFifteen\(\)/);assert.match(html,/phase-13-objective/)});
check('tutorial-production-ui-and-distinct-copy',()=>{assert.match(html,/data-phase15-tutorial-action/);assert.match(html,/PHASE_FIFTEEN_TUTORIAL_STEP_COPY/);for(const tutorial of api.tutorials)for(const id of tutorial.stepIds)assert.match(html,new RegExp(id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')))});
check('receipt-fold-does-not-grow-v2-predecessor-set',()=>assert.match(html,/receipt\.envelopeVersion!==2&&!archive\.predecessorClaimedOfferIds\.includes/));
check('live-entry-claimed-ordinal-rejected',()=>assert.match(html,/claimedRangesHas\(row\.claimedOrdinalRanges,entry\.opportunity\.sequence\)/));
check('v2-receipt-versions-fail-closed',()=>{assert.match(html,/receipt\.definitionVersion===1&&receipt\.rewardPolicyVersion===1/);assert.match(html,/definitionVersion!==1\|\|rewardPolicyVersion!==1/)});
check('passive-baseline-excludes-volatile-day-marker',()=>{const body=html.match(/function phaseFifteenPassiveBaseline[\s\S]*?\n/)[0];assert.match(body,/buildingLevels/);assert.doesNotMatch(body,/boostDay|buildings:clone/)});
check('recovery-fixture-stages-valid-successor',()=>{assert.match(html,/Phase 15 recovery fixture revision/);assert.match(html,/stagingEnvelope\(candidate,PERSISTED_RAW,'phase15-qa-fixture'\)/);assert.doesNotMatch(html,/setItem\(STAGING_KEY,PERSISTED_RAW\)/)});
check('mixed-board-fixture-is-story-safe',()=>{assert.match(html,/phaseFifteenConfigureFixtureInState[\s\S]*?story\.book1\.prologue\.council[\s\S]*?pendingSceneIds=\[\]/);assert.match(html,/PHASE_THIRTEEN_UI\.sceneId=null/)});
check('runtime-reduced-motion-class',()=>{assert.match(html,/html\.phase15-reduced-motion/);assert.match(html,/classList\.toggle\('phase15-reduced-motion',runtimePrefersReducedMotion\(\)\)/)});
check('facility-sheet-receives-initial-focus',()=>{assert.match(html,/phaseFifteenOpenFacilityBeforeSheetFocus/);assert.match(html,/sheet\.tabIndex=-1;sheet\.focus\(\)/)});

const failed=rows.filter(row=>!row.pass);
console.log(JSON.stringify({phase:'15-foundation-focused',total:rows.length,passed:rows.length-failed.length,failed:failed.length,rows},null,2));
if(failed.length)process.exitCode=1;
