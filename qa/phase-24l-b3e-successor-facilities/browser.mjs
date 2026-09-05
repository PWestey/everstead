import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here=dirname(fileURLToPath(import.meta.url));
const contract=JSON.parse(readFileSync(resolve(here,'contract.json'),'utf8'));
const origin=(process.argv[2]||'http://127.0.0.1:8840').replace(/\/$/,'');
const requestedViewport=process.argv[3]||null;
const executionOrder=[...contract.facilities].sort((left,right)=>left.id==='facility.gardens'?1:right.id==='facility.gardens'?-1:0);
const rows=[];
const add=(size,id,pass,detail='')=>rows.push({id:`${size}-${id}`,pass:Boolean(pass),detail});
const browser=await chromium.launch({headless:true});

for(const size of contract.viewports.filter(item=>!requestedViewport||item.id===requestedViewport)){
 const context=await browser.newContext({viewport:{width:size.width,height:size.height}});
 await context.addInitScript(()=>{
  const slots=new Map(),writes=[];
  let clockNow=100000000,saveIndex=0,transactionIndex=0;
  const nativeSetTimeout=setTimeout.bind(window),nativeClearTimeout=clearTimeout.bind(window);
  const storage={
   getItem:key=>slots.get(String(key))??null,
   setItem:(key,value)=>{slots.set(String(key),String(value));writes.push({op:'set',key:String(key)})},
   removeItem:key=>{slots.delete(String(key));writes.push({op:'remove',key:String(key)})}
  };
  Object.defineProperty(window,'__B3E_TEST_RUNTIME__',{value:Object.freeze({
   keys:()=>[...slots.keys()],
   dropPreV15Checkpoint:()=>{let removed=0;for(const key of [...slots.keys()])if(key.endsWith('__raw_backup_v14')){slots.delete(key);removed++}return removed},
   writeCount:()=>writes.length,
   now:()=>clockNow,
   setNow:value=>{if(!Number.isSafeInteger(value)||value<clockNow)throw new Error('Invalid B3E test time');clockNow=value;return clockNow}
  })});
  window.__EVERSTEAD_RUNTIME__={storage,clock:{now:()=>clockNow,setTimeout:nativeSetTimeout,clearTimeout:nativeClearTimeout},random:()=>.4375,confirm:()=>true,ids:{save:()=>`save-b3e-${++saveIndex}`,transaction:()=>`tx-b3e-${++transactionIndex}`},qa:{allowDestructive:true,isolatedStorage:true}};
 });
 const page=await context.newPage();
 page.setDefaultTimeout(30000);
 const errors=[];
 page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`${message.type()}: ${message.text()}`)});
 page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
 try{
  await page.goto(`${origin}/index.html?qa=1&phase2021=1`,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(resultGlobal=>window[resultGlobal]?.ok===true&&window.__EVERSTEAD_PHASE_20_21_QA__,contract.resultGlobal);
  const runtime=await page.evaluate(resultGlobal=>window[resultGlobal],contract.resultGlobal);
  const bridgeVersion=await page.evaluate(()=>window.__EVERSTEAD_PHASE_20_21_QA__?.version);
  add(size.id,'b3e-runtime-installed-presentation-only',runtime?.schemaVersion===15&&runtime?.mechanicsChanged===false&&runtime?.saveChanged===false,runtime);
  add(size.id,'uses-current-isolated-phase20-21-bridge',bridgeVersion===contract.bridgeVersion,bridgeVersion);

  const setup=await resetAllUnlocked(page);
  add(size.id,'isolated-all-unlocked-setup-handles-protected-checkpoint',setup.ok===true,setup);
  if(!setup.ok)throw new Error(`All-unlocked fixture unavailable: ${setup.reason||'unknown error'}`);

  const definitions=await page.evaluate(()=>window.__EVERSTEAD_PHASE_20_21_QA__.read.definitions());
  const enabledTutorialIds=definitions.tutorials.filter(item=>item.enabled).map(item=>item.id);
  const tutorialSetup=await page.evaluate(ids=>{
   const bridge=window.__EVERSTEAD_PHASE_20_21_QA__,results=[];
   for(const id of ids){
    let status=bridge.read.derive().tutorials.statusById[id],seen=null,complete=null;
    if(status==='unseen'){seen=bridge.destructive.tutorial(id,'seen');status=bridge.read.derive().tutorials.statusById[id]}
    if(status==='seen'){complete=bridge.destructive.tutorial(id,'complete');status=bridge.read.derive().tutorials.statusById[id]}
    results.push({id,status,seen,complete});
   }
   const projection=bridge.read.derive().tutorials;
   return{ok:results.every(item=>['completed','dismissed'].includes(item.status)&&(!item.seen||item.seen.ok===true&&item.seen.rewardApplications===0)&&(!item.complete||item.complete.ok===true&&item.complete.rewardApplications===0))&&ids.every(id=>!projection.pendingIds.includes(id)),results:results.map(item=>({id:item.id,status:item.status,seen:item.seen&&{ok:item.seen.ok,reason:item.seen.reason||null,writes:item.seen.writes,rewardApplications:item.seen.rewardApplications},complete:item.complete&&{ok:item.complete.ok,reason:item.complete.reason||null,writes:item.complete.writes,rewardApplications:item.complete.rewardApplications}}))};
  },enabledTutorialIds);
  add(size.id,'enabled-successor-tutorials-are-terminal-and-reward-neutral',definitions.tutorials.length===19&&enabledTutorialIds.length>0&&tutorialSetup.ok,{enabledCount:enabledTutorialIds.length,...tutorialSetup});

  const raw=()=>page.evaluate(()=>window.__EVERSTEAD_PHASE_20_21_QA__.read.raw());
  const derive=()=>page.evaluate(()=>window.__EVERSTEAD_PHASE_20_21_QA__.read.derive());
  const snapshot=()=>page.evaluate(()=>window.__EVERSTEAD_PHASE_20_21_QA__.read.snapshot());
  const revision=async()=>JSON.parse(await raw()).saveMeta.revision;

  for(const facility of executionOrder){
   const label=facility.key;
   const beforeSeed=await derive(),seedRevision=await revision();
   const seeded=await page.evaluate(id=>window.__EVERSTEAD_PHASE_20_21_QA__.destructive.seedRecord(id),facility.id);
   let afterSeed=await derive();
   const seededRecord=afterSeed.facilities[facility.id]?.records?.[0];
   add(size.id,`${label}-isolated-seed-advances-one-revision-without-reward`,seeded?.ok===true&&seeded?.rawChanged===true&&(await revision())===seedRevision+1&&afterSeed.resources.gold===beforeSeed.resources.gold&&afterSeed.facilities[facility.id].localProgress===beforeSeed.facilities[facility.id].localProgress&&seededRecord?.status==='banked',{seeded:brief(seeded),record:recordBrief(seededRecord)});
   if(facility.id==='facility.command-center'){
    const queueSeedRevision=await revision(),queueSeed=await page.evaluate(id=>window.__EVERSTEAD_PHASE_20_21_QA__.destructive.seedRecord(id),facility.id);
    afterSeed=await derive();
    add(size.id,`${label}-second-banked-record-enables-real-queue-rail`,queueSeed?.ok===true&&queueSeed?.rawChanged===true&&(await revision())===queueSeedRevision+1&&afterSeed.facilities[facility.id].records.length===2&&afterSeed.resources.gold===beforeSeed.resources.gold&&afterSeed.facilities[facility.id].localProgress===beforeSeed.facilities[facility.id].localProgress,{queueSeed:brief(queueSeed),records:afterSeed.facilities[facility.id].records.map(recordBrief)});
   }

   await page.locator('[data-nav="village"]').click();
   const hotspot=page.locator(`[data-phase15-facility-id="${facility.id}"]`);
   const hotspotState=await hotspot.evaluate(node=>({disabled:node.disabled,hidden:node.hidden,ariaHidden:node.getAttribute('aria-hidden'),state:node.dataset.phase20_21BoardState||node.dataset.phase15State}));
   add(size.id,`${label}-canonical-board-hotspot-is-ready`,!hotspotState.disabled&&!hotspotState.hidden&&hotspotState.ariaHidden!=='true'&&['opportunity-ready','ready'].includes(hotspotState.state),hotspotState);

   const rawBeforeOpen=await raw(),revisionBeforeOpen=await revision(),derivedBeforeOpen=await derive();
   await hotspot.evaluate(node=>node.click());
   await page.waitForSelector(`[data-phase24l-b3e-facility="${facility.id}"]`);
   await page.waitForTimeout(20);
   const layout=await inspectLayout(page,facility,size);
   const derivedAfterOpen=await derive(),revisionAfterOpen=await revision();
   add(size.id,`${label}-canonical-open-preserves-reward-and-record-authority`,derivedAfterOpen.resources.gold===derivedBeforeOpen.resources.gold&&derivedAfterOpen.facilities[facility.id].localProgress===derivedBeforeOpen.facilities[facility.id].localProgress&&same(derivedAfterOpen.facilities[facility.id].records,derivedBeforeOpen.facilities[facility.id].records)&&revisionAfterOpen-revisionBeforeOpen===1&&await raw()!==rawBeforeOpen,{revisionDelta:revisionAfterOpen-revisionBeforeOpen,beforeGold:derivedBeforeOpen.resources.gold,afterGold:derivedAfterOpen.resources.gold,beforeLocal:derivedBeforeOpen.facilities[facility.id].localProgress,afterLocal:derivedAfterOpen.facilities[facility.id].localProgress,layout});
   add(size.id,`${label}-one-bounded-sheet-exact-tabs-one-live-dock`,layout.shells===1&&layout.modals===1&&layout.tablists===1&&layout.stacks===1&&same(layout.tabs,facility.tabs)&&layout.panels===facility.tabs.length&&layout.visiblePanels===1&&layout.actionDocks===1&&layout.scene===1,layout);
   add(size.id,`${label}-initial-bound-controls-are-single-authoritative-copies`,countsMatch(layout.controls,{close:1,begin:1,cancel:0,commit:0,resume:0,resolve:0,growth:0,claim:0,saveParticipants:0})&&layout.controls.choices===0&&layout.controls.actors===0,layout.controls);
   add(size.id,`${label}-inactive-panels-hidden-inert-and-aria-hidden`,layout.inactivePanels===facility.tabs.length-1&&layout.inactiveNotInert===0&&layout.inactiveNotAriaHidden===0,layout);
   add(size.id,`${label}-bounded-touch-safe-with-zero-page-modal-panel-overflow`,layout.touchSafe&&layout.modalOverflow<=1&&layout.sheetOverflow<=1&&layout.activePanelOverflow<=1&&layout.documentOverflow<=1&&layout.horizontalOverflow<=1&&layout.regionsVisible&&layout.focus.visibleAndActive,layout);

   if(facility.id==='facility.command-center'){
    const rawBeforeQueue=await raw();
    await page.locator(`[data-phase24l-b3e-tab="${facility.tabs[2]}"]`).click();
    const queueEvidence=await inspectQueue(page,facility.id);
    await page.locator('[data-phase20-21-view-record]').last().click();
    await page.waitForTimeout(20);
    const selectedQueueRecord=await facilityState(page,facility.id),selectedQueueView=await activeView(page,facility.id);
    add(size.id,`${label}-real-banked-rows-move-once-into-horizontal-rail`,queueEvidence.rails===1&&queueEvidence.rows===2&&queueEvidence.rowsInRail===2&&queueEvidence.verticalOverflow<=1&&queueEvidence.overflowX==='auto'&&queueEvidence.overflowY==='hidden'&&await raw()===rawBeforeQueue&&selectedQueueRecord.record?.opportunity?.id===queueEvidence.lastRecordId&&selectedQueueView.panelOverflow<=1&&selectedQueueView.focus.visibleAndActive,{queueEvidence,selected:recordBrief(selectedQueueRecord.record),selectedQueueView});
   }

   const rawBeforeTabs=await raw();
   const keyEvidence=await exerciseTabs(page,facility);
   add(size.id,`${label}-pointer-activation-retains-tab-focus-home-end-work`,keyEvidence.pointer.selected===facility.tabs.at(-1)&&keyEvidence.pointer.focused===facility.tabs.at(-1)&&keyEvidence.home.selected===facility.tabs[0]&&keyEvidence.home.focused===facility.tabs[0]&&keyEvidence.end.selected===facility.tabs.at(-1)&&keyEvidence.end.focused===facility.tabs.at(-1),keyEvidence);
   add(size.id,`${label}-enter-activation-retains-tab-focus-arrow-works`,keyEvidence.enter.selected===facility.tabs[1]&&keyEvidence.enter.focused===facility.tabs[1]&&keyEvidence.arrowAfterEnter.selected===facility.tabs[2]&&keyEvidence.arrowAfterEnter.focused===facility.tabs[2],keyEvidence);
   add(size.id,`${label}-space-activation-retains-tab-focus-arrow-home-end-remain-usable`,keyEvidence.space.selected===facility.tabs[0]&&keyEvidence.space.focused===facility.tabs[0]&&keyEvidence.arrowAfterSpace.selected===facility.tabs[1]&&keyEvidence.arrowAfterSpace.focused===facility.tabs[1]&&keyEvidence.homeAfterSpace.selected===facility.tabs[0]&&keyEvidence.endAfterSpace.selected===facility.tabs.at(-1)&&keyEvidence.final.selected===facility.tabs[0]&&keyEvidence.final.focused===facility.tabs[0]&&keyEvidence.final.visible===1&&keyEvidence.final.inactiveNotInert===0&&await raw()===rawBeforeTabs,keyEvidence);

   const rawBeforeTrap=await raw();
   await page.locator('.modal').focus();
   await page.keyboard.press('Shift+Tab');
   const trapLast=await activeFocus(page);
   await page.keyboard.press('Tab');
   const trapFirst=await activeFocus(page);
   add(size.id,`${label}-focus-trap-excludes-hidden-panels`,await raw()===rawBeforeTrap&&trapLast.inside&&trapLast.tab===facility.tabs[0]&&!trapLast.hiddenAncestor&&trapFirst.inside&&trapFirst.close&&!trapFirst.hiddenAncestor,{last:trapLast,first:trapFirst});

   const passiveBefore=(await snapshot()).state;
   const flowGoldBefore=(await derive()).resources.gold;
   const flowLocalBefore=(await derive()).facilities[facility.id].localProgress;
   const beginRevision=await revision();
   await page.locator('[data-phase20-21-begin]').click();
   await waitRevision(page,beginRevision+1);
   let state=await facilityState(page,facility.id),controls=await controlCounts(page,facility.id),active=await activeView(page,facility.id);
   add(size.id,`${label}-begin-commits-once-and-opens-work-tab`,(await revision())===beginRevision+1&&state.record?.status==='engaged'&&state.tab===facility.tabs[1]&&countsMatch(controls,{close:1,begin:0,cancel:1,commit:1,resume:0,resolve:0,growth:0,claim:0,saveParticipants:facility.participants?1:0})&&controls.choices>=1&&active.panelOverflow<=1&&active.touchSafe&&active.focus.visibleAndActive,{state,controls,active});
   if(state.tab!==facility.tabs[1]||!active.focus.visibleAndActive){await page.locator(`[data-phase24l-b3e-tab="${facility.tabs[1]}"]`).click();await page.waitForTimeout(20)}

   if(['facility.market-workshop','facility.forge'].includes(facility.id)){
    const reserved=state.record?.reservation,stockAfterBegin=state.stock;
    const cancelRevision=await revision();
    await page.locator('[data-phase20-21-cancel]').click();
    await waitRevision(page,cancelRevision+1);
    const afterCancel=await facilityState(page,facility.id),afterCancelView=await activeView(page,facility.id);
    const rebegunRevision=await revision();
    await page.locator('[data-phase20-21-begin]').click();
    await waitRevision(page,rebegunRevision+1);
    state=await facilityState(page,facility.id);const rebegunView=await activeView(page,facility.id);
    add(size.id,`${label}-reservation-cancel-restores-stock-and-rebegin-reserves-once`,reserved&&afterCancel.record?.status==='banked'&&afterCancel.record?.reservation===null&&JSON.stringify(afterCancel.stock)!==JSON.stringify(stockAfterBegin)&&state.record?.status==='engaged'&&state.record?.reservation&&state.record.reservation.quantity===reserved.quantity&&afterCancelView.panelOverflow<=1&&afterCancelView.focus.visibleAndActive&&rebegunView.panelOverflow<=1&&rebegunView.focus.visibleAndActive,{reserved,stockAfterBegin,afterCancel:afterCancel.stock,rebegin:state.record?.reservation,afterCancelView,rebegunView});
   }

   const choice=page.locator(`[data-phase24l-b3e-facility="${facility.id}"] [data-phase20-21-choice-id]`).first();
   const choiceId=await choice.getAttribute('data-phase20-21-choice-id');
   const choiceRevision=await revision();
   await choice.click();
   await waitRevision(page,choiceRevision+1);
   state=await facilityState(page,facility.id);active=await activeView(page,facility.id);
   add(size.id,`${label}-choice-commits-once-without-early-reward`,(await revision())===choiceRevision+1&&state.record?.choiceId===choiceId&&state.gold===flowGoldBefore&&state.localProgress===flowLocalBefore&&active.panelOverflow<=1&&active.touchSafe&&active.focus.visibleAndActive,{choiceId,state:recordBrief(state.record),active});

   if(facility.participants){
    await page.locator(`[data-phase24l-b3e-tab="${facility.tabs[2]}"]`).click();
    const rawBeforeParticipantDraft=await raw();
    for(let selected=0;selected<2;selected++)await page.locator('[data-phase20-21-actor-choice][aria-pressed="false"]').first().click();
    await page.waitForTimeout(20);
    controls=await controlCounts(page,facility.id);active=await activeView(page,facility.id);
    add(size.id,`${label}-participant-draft-is-write-neutral-and-single-copy`,await raw()===rawBeforeParticipantDraft&&controls.actors>=2&&controls.saveParticipants===1&&active.panelOverflow<=1&&active.touchSafe&&active.focus.visibleAndActive,{controls,active});
    const participantsRevision=await revision();
    await page.locator('[data-phase20-21-save-participants]').click();
    await waitRevision(page,participantsRevision+1);
    state=await facilityState(page,facility.id);active=await activeView(page,facility.id);
    add(size.id,`${label}-unique-participants-commit-once`,(await revision())===participantsRevision+1&&state.record.participantIds.length===2&&new Set(state.record.participantIds).size===2&&!state.record.participantIds.includes('player.wayfarer')&&active.panelOverflow<=1&&active.touchSafe&&active.focus.visibleAndActive,{participants:state.record.participantIds,active});
   }

   const commitRevision=await revision();
   await page.locator('[data-phase20-21-commit]').click();
   await waitRevision(page,commitRevision+1);
   state=await facilityState(page,facility.id);controls=await controlCounts(page,facility.id);active=await activeView(page,facility.id);
   add(size.id,`${label}-commit-is-one-revision-and-resume-is-single`,(await revision())===commitRevision+1&&['committed','growing'].includes(state.record?.status)&&countsMatch(controls,{close:1,begin:0,cancel:0,commit:0,resume:1,resolve:0,growth:0,claim:0,saveParticipants:0})&&active.panelOverflow<=1&&active.touchSafe&&active.focus.visibleAndActive,{state:recordBrief(state.record),controls,active});

   const rawBeforeResume=await raw();
   await page.locator('[data-phase20-21-resume]').click();
   await page.waitForTimeout(20);
   controls=await controlCounts(page,facility.id);active=await activeView(page,facility.id);
   add(size.id,`${label}-resume-is-write-neutral-and-keeps-one-action`,await raw()===rawBeforeResume&&countsMatch(controls,{close:1,begin:0,cancel:0,commit:0,resume:0,resolve:facility.id==='facility.gardens'?0:1,growth:facility.id==='facility.gardens'?1:0,claim:0,saveParticipants:0})&&active.panelOverflow<=1&&active.touchSafe&&active.focus.visibleAndActive,{controls,active});

   let resolutionRevision=await revision();
   if(facility.id==='facility.gardens'){
    const readyAt=(await facilityState(page,facility.id)).record.readyAt;
    await page.evaluate(at=>window.__B3E_TEST_RUNTIME__.setNow(at),readyAt);
    await page.locator('[data-phase20-21-check-growth]').click();
   }else await page.locator('[data-phase20-21-resolve]').click();
   await waitRevision(page,resolutionRevision+1);
   state=await facilityState(page,facility.id);controls=await controlCounts(page,facility.id);active=await activeView(page,facility.id);
   const claimPlan=state.record?.outcome;
   add(size.id,`${label}-resolution-commits-once-without-early-reward-and-opens-result`,(await revision())===resolutionRevision+1&&state.record?.status==='claim-ready'&&state.gold===flowGoldBefore&&state.localProgress===flowLocalBefore&&state.tab===facility.tabs.at(-1)&&claimPlan?.globalGold>0&&claimPlan?.localProgress>0&&countsMatch(controls,{close:1,begin:0,cancel:0,commit:0,resume:0,resolve:0,growth:0,claim:1,saveParticipants:0})&&active.panelOverflow<=1&&active.touchSafe&&active.focus.visibleAndActive,{state:recordBrief(state.record),tab:state.tab,controls,active});

   const claimButton=page.locator('[data-phase20-21-claim]');
   const staleClaimHandle=await claimButton.elementHandle();
   const claimRevision=await revision(),claimedBefore=state.claimedCount;
   await claimButton.click();
   await waitRevision(page,claimRevision+1);
   const claimed=await facilityState(page,facility.id),claimView=await activeView(page,facility.id);
   add(size.id,`${label}-manual-claim-commits-exact-gold-local-progress-and-receipt-once`,(await revision())===claimRevision+1&&claimed.gold===flowGoldBefore+claimPlan.globalGold&&claimed.localProgress===flowLocalBefore+claimPlan.localProgress&&claimed.claimedCount===claimedBefore+1&&typeof claimed.lastReceiptId==='string'&&claimed.records.length===(facility.id==='facility.command-center'?1:0)&&claimView.panelOverflow<=1&&claimView.touchSafe&&claimView.focus.visibleAndActive,{expectedGold:claimPlan.globalGold,actualGold:claimed.gold-flowGoldBefore,expectedLocal:claimPlan.localProgress,actualLocal:claimed.localProgress-flowLocalBefore,remainingRecords:claimed.records.length,claimedCount:claimed.claimedCount,lastReceiptId:claimed.lastReceiptId,claimView});
   const rawAfterClaim=await raw();
   await staleClaimHandle.evaluate(button=>button.click());
   await page.waitForTimeout(20);
   const staleView=await activeView(page,facility.id);
   add(size.id,`${label}-detached-stale-claim-cannot-pay-twice`,await raw()===rawAfterClaim&&staleView.panelOverflow<=1&&staleView.focus.visibleAndActive,staleView);

   const passiveAfter=(await snapshot()).state;
   add(size.id,`${label}-flow-preserves-passive-buildings-and-family`,same(passiveProjection(passiveBefore),passiveProjection(passiveAfter)),{before:passiveProjection(passiveBefore),after:passiveProjection(passiveAfter)});

   await page.keyboard.press('Escape');
   await page.waitForSelector(`[data-phase24l-b3e-facility="${facility.id}"]`,{state:'detached'});
   await page.waitForFunction(id=>document.activeElement?.dataset?.phase15FacilityId===id,facility.id);
   const closed=await page.evaluate(id=>({focused:document.activeElement?.dataset?.phase15FacilityId||null,overlayChildren:document.querySelector('#overlay')?.children.length??-1,sheets:document.querySelectorAll(`[data-phase24l-b3e-facility="${id}"]`).length}),facility.id);
   add(size.id,`${label}-escape-closes-write-neutral-and-returns-canonical-focus`,await raw()===rawAfterClaim&&closed.focused===facility.id&&closed.overlayChildren===0&&closed.sheets===0,closed);
  }

  const finalDerived=await derive();
  add(size.id,'all-eight-finalizers-claimed-exactly-once',executionOrder.every(item=>finalDerived.facilities[item.id].claimedCount===1&&typeof finalDerived.facilities[item.id].lastReceiptId==='string'),Object.fromEntries(executionOrder.map(item=>[item.id,{claimedCount:finalDerived.facilities[item.id].claimedCount,lastReceiptId:finalDerived.facilities[item.id].lastReceiptId}])));
  add(size.id,'public-release-remains-false-in-private-qa-runtime',finalDerived.publicRelease===false,finalDerived.publicRelease);
  add(size.id,'zero-warning-error-console',errors.length===0,errors);
 }catch(error){
  add(size.id,'fatal-browser-exercise',false,error.stack||error.message);
  add(size.id,'zero-warning-error-console',errors.length===0,errors);
 }
 await context.close();
}

await browser.close();
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` · ${typeof row.detail==='string'?row.detail:JSON.stringify(row.detail)}`:''}`);
const failed=rows.filter(row=>!row.pass);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;

async function resetAllUnlocked(page){
 const first=await page.evaluate(()=>window.__EVERSTEAD_PHASE_20_21_QA__.destructive.resetFixture('p20-21.qa.all-unlocked.v2'));
 if(first?.ok)return{ok:true,first:brief(first),recovery:null};
 const expectedConflict=/write-once pre-v15 checkpoint belongs to another predecessor/i.test(first?.reason||'');
 const removed=expectedConflict?await page.evaluate(()=>window.__B3E_TEST_RUNTIME__.dropPreV15Checkpoint()):0;
 const retry=expectedConflict&&removed===1?await page.evaluate(()=>window.__EVERSTEAD_PHASE_20_21_QA__.destructive.resetFixture('p20-21.qa.all-unlocked.v2')):null;
 return{ok:retry?.ok===true,first:brief(first),recovery:{expectedConflict,removed,retry:brief(retry)},reason:retry?.reason||first?.reason||null};
}
async function waitRevision(page,target){await page.waitForFunction(value=>JSON.parse(window.__EVERSTEAD_PHASE_20_21_QA__.read.raw()).saveMeta.revision===value,target);await page.waitForTimeout(20)}
async function facilityState(page,facilityId){return page.evaluate(id=>{const derived=window.__EVERSTEAD_PHASE_20_21_QA__.read.derive(),facility=derived.facilities[id],root=document.querySelector(`[data-phase24l-b3e-facility="${id}"]`),selectedId=root?.querySelector('[data-phase20-21-record-id]')?.getAttribute('data-phase20-21-record-id')||null;return{...facility,record:facility.records.find(record=>record.opportunity.id===selectedId)||facility.records[0]||null,gold:derived.resources.gold,tab:root?.querySelector('[role="tab"][aria-selected="true"]')?.dataset.phase24lB3eTab||null}},facilityId)}
async function inspectQueue(page,facilityId){return page.evaluate(id=>{const root=document.querySelector(`[data-phase24l-b3e-facility="${id}"]`),rail=root?.querySelector('[data-phase24l-b3e-queue-rail]'),rows=[...root.querySelectorAll('[data-phase20-21-view-record]')],style=rail&&getComputedStyle(rail);return{rails:root.querySelectorAll('[data-phase24l-b3e-queue-rail]').length,rows:rows.length,rowsInRail:rail?.querySelectorAll(':scope > [data-phase20-21-view-record]').length||0,lastRecordId:rows.at(-1)?.getAttribute('data-phase20-21-view-record')||null,verticalOverflow:rail?rail.scrollHeight-rail.clientHeight:-1,horizontalOverflow:rail?rail.scrollWidth-rail.clientWidth:-1,overflowX:style?.overflowX||null,overflowY:style?.overflowY||null}},facilityId)}
async function controlCounts(page,facilityId){return page.evaluate(id=>{const root=document.querySelector(`[data-phase24l-b3e-facility="${id}"]`),count=selector=>root?.querySelectorAll(selector).length||0;return{close:count('[data-phase20-21-close]'),begin:count('[data-phase20-21-begin]'),cancel:count('[data-phase20-21-cancel]'),commit:count('[data-phase20-21-commit]'),resume:count('[data-phase20-21-resume]'),resolve:count('[data-phase20-21-resolve]'),growth:count('[data-phase20-21-check-growth]'),claim:count('[data-phase20-21-claim]'),saveParticipants:count('[data-phase20-21-save-participants]'),choices:count('[data-phase20-21-choice-id]'),actors:count('[data-phase20-21-actor-choice]'),viewRecords:count('[data-phase20-21-view-record]'),actionDocks:count('[data-phase20-21-action-dock]')}},facilityId)}
async function exerciseTabs(page,facility){
 const selector=id=>`[data-phase24l-b3e-facility="${facility.id}"] [data-phase24l-b3e-tab="${id}"]`;
 await page.locator(selector(facility.tabs.at(-1))).click();
 const pointer=await tabState(page,facility.id);
 await page.keyboard.press('Home');const home=await tabState(page,facility.id);
 await page.keyboard.press('End');const end=await tabState(page,facility.id);
 await page.locator(selector(facility.tabs[1])).focus();
 await page.keyboard.press('Enter');const enter=await tabState(page,facility.id);
 await page.keyboard.press('ArrowRight');const arrowAfterEnter=await tabState(page,facility.id);
 await page.locator(selector(facility.tabs[0])).focus();
 await page.keyboard.press('Space');const space=await tabState(page,facility.id);
 await page.keyboard.press('ArrowRight');const arrowAfterSpace=await tabState(page,facility.id);
 await page.keyboard.press('Home');const homeAfterSpace=await tabState(page,facility.id);
 await page.keyboard.press('End');const endAfterSpace=await tabState(page,facility.id);
 await page.locator(selector(facility.tabs[0])).focus();
 await page.keyboard.press('Space');const final=await tabState(page,facility.id);
 return{pointer,home,end,enter,arrowAfterEnter,space,arrowAfterSpace,homeAfterSpace,endAfterSpace,final};
}
async function tabState(page,facilityId){return page.evaluate(id=>{const root=document.querySelector(`[data-phase24l-b3e-facility="${id}"]`);return{selected:root?.querySelector('[role="tab"][aria-selected="true"]')?.dataset.phase24lB3eTab||null,focused:document.activeElement?.dataset?.phase24lB3eTab||null,visible:[...root.querySelectorAll('[role="tabpanel"]')].filter(panel=>!panel.hidden).length,inactiveNotInert:[...root.querySelectorAll('[role="tabpanel"][hidden]')].filter(panel=>!panel.inert).length}},facilityId)}
async function activeFocus(page){return page.evaluate(()=>({inside:document.querySelector('.modal')?.contains(document.activeElement)===true,tab:document.activeElement?.dataset?.phase24lB3eTab||null,close:document.activeElement?.matches?.('[data-phase20-21-close]')===true,hiddenAncestor:Boolean(document.activeElement?.closest?.('[hidden],[inert],[aria-hidden="true"]'))}))}
async function activeView(page,facilityId){return page.evaluate(id=>{const root=document.querySelector(`[data-phase24l-b3e-facility="${id}"]`),panel=root?.querySelector('[role="tabpanel"]:not([hidden])'),focus=document.activeElement,visible=node=>{if(!node||node.closest('[hidden],[inert],[aria-hidden="true"]'))return false;const style=getComputedStyle(node),rect=node.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0},targets=[...root.querySelectorAll('button,select,[role="button"]')].filter(visible),dimensions=targets.map(node=>{const rect=node.getBoundingClientRect();return{tag:node.tagName,data:Object.fromEntries(Object.entries(node.dataset)),width:rect.width,height:rect.height}});return{panel:panel?.dataset.phase24lB3ePanel||null,panelOverflow:panel?panel.scrollHeight-panel.clientHeight:-1,touchSafe:targets.length>=2&&dimensions.every(item=>item.width>=43.9&&item.height>=43.9),smallestTargets:dimensions.sort((left,right)=>Math.min(left.width,left.height)-Math.min(right.width,right.height)).slice(0,4),focus:{tag:focus?.tagName||null,data:Object.fromEntries(Object.entries(focus?.dataset||{})),inside:root?.contains(focus)===true,hiddenAncestor:Boolean(focus?.closest?.('[hidden],[inert],[aria-hidden="true"]')),visibleAndActive:root?.contains(focus)===true&&visible(focus)}}},facilityId)}
async function inspectLayout(page,facility,size){return page.evaluate(({facility,width,height})=>{
 const root=document.querySelector(`[data-phase24l-b3e-facility="${facility.id}"]`),modal=root?.closest('.modal'),tabs=root?.querySelector(`:scope > [data-phase24l-b3e-tabs="${facility.key}"]`),stack=root?.querySelector(`:scope > [data-phase24l-b3e-panel-stack="${facility.key}"]`),dock=root?.querySelector(':scope > [data-phase20-21-action-dock]'),rect=node=>{const value=node.getBoundingClientRect();return{left:value.left,right:value.right,top:value.top,bottom:value.bottom,width:value.width,height:value.height}},visible=node=>{const style=getComputedStyle(node),box=node.getBoundingClientRect();return!node.closest('[hidden],[inert],[aria-hidden="true"]')&&style.display!=='none'&&style.visibility!=='hidden'&&box.width>0&&box.height>0},targets=[...root.querySelectorAll('button,select,[role="button"]')].filter(visible),panels=[...root.querySelectorAll(':scope > .phase24l-b3e-panel-stack > [role="tabpanel"]')],modalRect=rect(modal),tabsRect=rect(tabs),dockRect=dock?rect(dock):null,count=selector=>root.querySelectorAll(selector).length,controls={close:count('[data-phase20-21-close]'),begin:count('[data-phase20-21-begin]'),cancel:count('[data-phase20-21-cancel]'),commit:count('[data-phase20-21-commit]'),resume:count('[data-phase20-21-resume]'),resolve:count('[data-phase20-21-resolve]'),growth:count('[data-phase20-21-check-growth]'),claim:count('[data-phase20-21-claim]'),saveParticipants:count('[data-phase20-21-save-participants]'),choices:count('[data-phase20-21-choice-id]'),actors:count('[data-phase20-21-actor-choice]'),viewRecords:count('[data-phase20-21-view-record]')};
 controls.actionDocks=count('[data-phase20-21-action-dock]');
 const activePanel=panels.find(panel=>!panel.hidden),focus=document.activeElement,focusVisible=focus&&root.contains(focus)&&visible(focus);
 return{shells:document.querySelectorAll(`[data-phase24l-b3e-facility="${facility.id}"]`).length,modals:document.querySelectorAll('[data-phase24l-b3e-modal]').length,scene:root.querySelectorAll(':scope > .phase24l-b3e-scene').length,tablists:root.querySelectorAll(':scope > [data-phase24l-b3e-tabs]').length,stacks:root.querySelectorAll(':scope > [data-phase24l-b3e-panel-stack]').length,tabs:[...tabs.querySelectorAll(':scope > [role="tab"]')].map(node=>node.dataset.phase24lB3eTab),panels:panels.length,visiblePanels:panels.filter(panel=>!panel.hidden).length,inactivePanels:panels.filter(panel=>panel.hidden).length,inactiveNotInert:panels.filter(panel=>panel.hidden&&!panel.inert).length,inactiveNotAriaHidden:panels.filter(panel=>panel.hidden&&panel.getAttribute('aria-hidden')!=='true').length,actionDocks:root.querySelectorAll(':scope > [data-phase20-21-action-dock]').length,controls,touchSafe:targets.length>=6&&targets.every(node=>{const value=rect(node);return value.width>=43.9&&value.height>=43.9}),smallestTargets:targets.map(node=>({tag:node.tagName,data:Object.keys(node.dataset)[0]||'',width:rect(node).width,height:rect(node).height})).sort((a,b)=>Math.min(a.width,a.height)-Math.min(b.width,b.height)).slice(0,4),activePanelOverflow:activePanel?activePanel.scrollHeight-activePanel.clientHeight:-1,focus:{tag:focus?.tagName||null,data:Object.fromEntries(Object.entries(focus?.dataset||{})),hiddenAncestor:Boolean(focus?.closest?.('[hidden],[inert],[aria-hidden="true"]')),visibleAndActive:focusVisible},modalOverflow:modal.scrollHeight-modal.clientHeight,sheetOverflow:root.scrollHeight-root.clientHeight,documentOverflow:document.scrollingElement.scrollHeight-document.scrollingElement.clientHeight,horizontalOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,regionsVisible:modalRect.top>=-1&&modalRect.bottom<=height+1&&tabsRect.left>=modalRect.left-1&&tabsRect.right<=modalRect.right+1&&tabsRect.bottom<=modalRect.bottom+1&&(!dockRect||dockRect.top>=modalRect.top-1&&dockRect.bottom<=tabsRect.top+1)&&modalRect.left>=-1&&modalRect.right<=width+1};
 },{facility,width:size.width,height:size.height})}
function countsMatch(actual,expected){return Object.entries(expected).every(([key,value])=>actual[key]===value)&&actual.actionDocks===1}
function passiveProjection(state){return{buildings:state?.buildings??null,family:state?.family??null,familyAssignments:state?.familyAssignments??null}}
function brief(result){return result&&{ok:result.ok,reason:result.reason||null,writes:result.writes??null,rawChanged:result.rawChanged??null}}
function recordBrief(record){return record&&{id:record.opportunity?.id,status:record.status,choiceId:record.choiceId,participantIds:record.participantIds,reservation:record.reservation,readyAt:record.readyAt,outcome:record.outcome&&{globalGold:record.outcome.globalGold,localProgress:record.outcome.localProgress,offerId:record.outcome.offerId}}}
function same(left,right){return JSON.stringify(left)===JSON.stringify(right)}
