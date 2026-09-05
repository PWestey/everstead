import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const origin=(process.argv[2]||'http://127.0.0.1:8854').replace(/\/$/,'');
const sizes=[{id:'small',width:320,height:568},{id:'standard',width:390,height:844}];
const rows=[];
const add=(size,id,pass,detail='')=>rows.push({id:`${size}-${id}`,pass:Boolean(pass),detail});
const browser=await chromium.launch({headless:true});

for(const size of sizes){
 const context=await browser.newContext({viewport:{width:size.width,height:size.height}});
 await context.addInitScript(()=>{
  const slots=new Map(),writes=[];
  let saveIndex=0,transactionIndex=0;
  const nativeSetTimeout=setTimeout.bind(window),nativeClearTimeout=clearTimeout.bind(window);
  const storage={
   getItem:key=>slots.get(String(key))??null,
   setItem:(key,value)=>{slots.set(String(key),String(value));writes.push({op:'set',key:String(key)})},
   removeItem:key=>{slots.delete(String(key));writes.push({op:'remove',key:String(key)})}
  };
  Object.defineProperty(window,'__B3D_TEST_STORAGE__',{value:Object.freeze({
   keys:()=>[...slots.keys()],
   dropPreV15Checkpoint:()=>{let removed=0;for(const key of [...slots.keys()])if(key.endsWith('__raw_backup_v14')){slots.delete(key);removed++}return removed},
   writeCount:()=>writes.length
  })});
  window.__EVERSTEAD_RUNTIME__={storage,clock:{now:()=>100000000,setTimeout:nativeSetTimeout,clearTimeout:nativeClearTimeout},random:()=>.4375,confirm:()=>true,ids:{save:()=>`save-b3d-${++saveIndex}`,transaction:()=>`tx-b3d-${++transactionIndex}`},qa:{allowDestructive:true,isolatedStorage:true}};
 });
 const page=await context.newPage();
 page.setDefaultTimeout(30000);
 const errors=[];
 page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`${message.type()}: ${message.text()}`)});
 page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
 try{
  await page.goto(`${origin}/index.html?qa=1&phase1819=1`,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>window.__EVERSTEAD_PHASE_18_19_QA__&&window.__EVERSTEAD_PHASE24L_B3D_RESULT__);
  const bridgeVersion=await page.evaluate(()=>window.__EVERSTEAD_PHASE_18_19_QA__?.version);
  add(size.id,'uses-existing-isolated-phase18-19-bridge',bridgeVersion==='phase-18-19-independent-qa-v1',bridgeVersion);
  const runtime=await page.evaluate(()=>window.__EVERSTEAD_PHASE24L_B3D_RESULT__);
  add(size.id,'b3d-runtime-installed-presentation-only',runtime?.ok===true&&runtime?.mechanicsChanged===false&&runtime?.saveChanged===false,runtime);

  const firstReset=await page.evaluate(()=>window.__EVERSTEAD_PHASE_18_19_QA__.destructive.resetFixture('p19.qa.schoolhouse-lessons-banked.v1'));
  let reset=firstReset;
  let checkpointRecovery=null;
  if(!reset?.ok){
   const removed=await page.evaluate(()=>window.__B3D_TEST_STORAGE__.dropPreV15Checkpoint());
   reset=await page.evaluate(()=>window.__EVERSTEAD_PHASE_18_19_QA__.destructive.resetFixture('p19.qa.schoolhouse-lessons-banked.v1'));
   checkpointRecovery={removed,expectedConflict:/write-once pre-v15 checkpoint belongs to another predecessor/i.test(firstReset?.reason||''),reset:summary(reset)};
  }
  add(size.id,'isolated-fixture-setup-handles-protected-checkpoint',reset?.ok===true&&(firstReset?.ok===true||(checkpointRecovery?.expectedConflict===true&&checkpointRecovery?.removed===1)),{first:summary(firstReset),recovery:checkpointRecovery});
  if(!reset?.ok)throw new Error(`Fixture unavailable: ${reset?.reason||'unknown error'}`);

  const raw=()=>page.evaluate(()=>window.__EVERSTEAD_PHASE_18_19_QA__.read.raw());
  const revision=async()=>JSON.parse(await raw()).saveMeta.revision;
  const derive=()=>page.evaluate(()=>window.__EVERSTEAD_PHASE_18_19_QA__.read.derive());
  await page.locator('[data-nav="village"]').click();

  const schoolHotspot=page.locator('[data-phase15-facility-id="facility.schoolhouse"]');
  add(size.id,'schoolhouse-hotspot-remains-canonical',await schoolHotspot.evaluate(button=>!button.disabled&&button.dataset.phase15State==='claim-ready'));
  const rawBeforeSchoolOpen=await raw();
  await schoolHotspot.click();
  await page.waitForSelector('[data-phase24l-b3d-facility="schoolhouse"]');
  const schoolLayout=await inspectLayout(page,'schoolhouse',size);
  add(size.id,'schoolhouse-open-is-write-neutral',await raw()===rawBeforeSchoolOpen,schoolLayout);
  add(size.id,'schoolhouse-one-shell-four-tabs-one-live-dock',schoolLayout.shells===1&&schoolLayout.tabs===4&&schoolLayout.visiblePanels.length===1&&schoolLayout.selected==='lesson'&&schoolLayout.actionDocks===1&&schoolLayout.actionButtons===3,schoolLayout);
  add(size.id,'schoolhouse-preserves-all-authoritative-live-controls',schoolLayout.requiredSelectors.every(item=>item.count>=item.minimum)&&schoolLayout.duplicateActions===0,schoolLayout.requiredSelectors);
  add(size.id,'schoolhouse-is-bounded-touch-safe-and-page-stable',schoolLayout.touchSafe&&schoolLayout.modalScroll===0&&schoolLayout.rootScroll===0&&schoolLayout.bodyScroll===0&&schoolLayout.overflowX===0&&schoolLayout.regionsVisible,schoolLayout);
  add(size.id,'schoolhouse-compact-type-meets-raised-legibility-baseline',typographyPass(schoolLayout.typography,size,'schoolhouse'),schoolLayout.typography);
  add(size.id,'schoolhouse-inactive-panels-hidden-and-inert',schoolLayout.visiblePanels.length===1&&schoolLayout.inactivePanels===3&&schoolLayout.inactiveNotInert===0,schoolLayout);

  const rawBeforeSchoolTabs=await raw();
  await page.locator('[data-phase24l-b3d-tabs="schoolhouse"] [data-phase24l-b3d-tab="result"]').click();
  const schoolPointer=await tabState(page,'schoolhouse');
  await page.keyboard.press('Home');
  const schoolHomeAfterPointer=await tabState(page,'schoolhouse');
  await page.keyboard.press('End');
  const schoolEndAfterPointer=await tabState(page,'schoolhouse');
  add(size.id,'schoolhouse-pointer-activation-keeps-tab-focus-and-home-end-work',await raw()===rawBeforeSchoolTabs&&schoolPointer.selected==='result'&&schoolPointer.focused==='result'&&schoolHomeAfterPointer.selected==='pupils'&&schoolHomeAfterPointer.focused==='pupils'&&schoolEndAfterPointer.selected==='result'&&schoolEndAfterPointer.focused==='result',{pointer:schoolPointer,home:schoolHomeAfterPointer,end:schoolEndAfterPointer});

  await page.locator('[data-phase24l-b3d-tab="lesson"]').focus();
  await page.keyboard.press('Enter');
  const schoolEnter=await tabState(page,'schoolhouse');
  await page.keyboard.press('ArrowRight');
  const schoolArrowAfterEnter=await tabState(page,'schoolhouse');
  add(size.id,'schoolhouse-enter-activation-keeps-tab-focus-and-arrow-works',await raw()===rawBeforeSchoolTabs&&schoolEnter.selected==='lesson'&&schoolEnter.focused==='lesson'&&schoolArrowAfterEnter.selected==='teach'&&schoolArrowAfterEnter.focused==='teach'&&schoolArrowAfterEnter.visible===1&&schoolArrowAfterEnter.inactiveNotInert===0,{enter:schoolEnter,arrow:schoolArrowAfterEnter});

  await page.locator('[data-phase24l-b3d-tab="lesson"]').focus();
  await page.keyboard.press('Space');
  const schoolSpace=await tabState(page,'schoolhouse');
  await page.keyboard.press('Home');
  const schoolHomeAfterSpace=await tabState(page,'schoolhouse');
  await page.keyboard.press('End');
  const schoolEndAfterSpace=await tabState(page,'schoolhouse');
  await page.locator('[data-phase24l-b3d-tab="teach"]').focus();
  await page.keyboard.press('Space');
  add(size.id,'schoolhouse-space-activation-keeps-tab-focus-and-home-end-remain-usable',await raw()===rawBeforeSchoolTabs&&schoolSpace.selected==='lesson'&&schoolSpace.focused==='lesson'&&schoolHomeAfterSpace.selected==='pupils'&&schoolHomeAfterSpace.focused==='pupils'&&schoolEndAfterSpace.selected==='result'&&schoolEndAfterSpace.focused==='result'&&(await tabState(page,'schoolhouse')).selected==='teach',{space:schoolSpace,home:schoolHomeAfterSpace,end:schoolEndAfterSpace,final:await tabState(page,'schoolhouse')});

  const rawBeforeSchoolTrap=await raw();
  await page.locator('.modal').focus();
  await page.keyboard.press('Shift+Tab');
  const schoolTrapLast=await activeFocus(page);
  await page.keyboard.press('Tab');
  const schoolTrapFirst=await activeFocus(page);
  add(size.id,'schoolhouse-focus-trap-excludes-hidden-panels',await raw()===rawBeforeSchoolTrap&&schoolTrapLast.inside&&schoolTrapLast.tab==='teach'&&!schoolTrapLast.hiddenAncestor&&schoolTrapFirst.inside&&schoolTrapFirst.close&&!schoolTrapFirst.hiddenAncestor,{last:schoolTrapLast,first:schoolTrapFirst});

  await page.locator('[data-phase24l-b3d-tab="lesson"]').click();
  const lessonRevision=await revision();
  await page.locator('[data-phase19-lesson-id]').click();
  await waitRevision(page,lessonRevision+1);
  let schoolState=await tabState(page,'schoolhouse');
  add(size.id,'begin-lesson-commits-once-and-opens-teach',(await revision())===lessonRevision+1&&schoolState.selected==='teach'&&schoolState.visible===1,schoolState);

  const mentor=page.locator('[data-phase19-mentor-id]:not([data-phase19-mentor-id=""])').first();
  const rawBeforeMentor=await raw();
  if(await mentor.count())await mentor.click();
  schoolState=await tabState(page,'schoolhouse');
  add(size.id,'family-mentor-preview-is-write-neutral-and-stays-on-teach',await raw()===rawBeforeMentor&&schoolState.selected==='teach',schoolState);

  const approachRevision=await revision();
  await page.locator('[data-phase19-approach-id]').first().click();
  await waitRevision(page,approachRevision+1);
  schoolState=await tabState(page,'schoolhouse');
  add(size.id,'teaching-approach-commits-once-and-stays-on-teach',(await revision())===approachRevision+1&&schoolState.selected==='teach',schoolState);

  const beforeTeach=await derive();
  const teachRevision=await revision();
  await page.locator('[data-phase19-teach]').click();
  await waitRevision(page,teachRevision+1);
  const afterTeach=await derive();
  schoolState=await tabState(page,'schoolhouse');
  add(size.id,'teach-commits-once-without-early-reward',(await revision())===teachRevision+1&&afterTeach.resources.gold===beforeTeach.resources.gold&&afterTeach.schoolhouse.education===beforeTeach.schoolhouse.education,{before:{gold:beforeTeach.resources.gold,education:beforeTeach.schoolhouse.education},after:{gold:afterTeach.resources.gold,education:afterTeach.schoolhouse.education}});
  add(size.id,'lesson-claim-ready-opens-result',schoolState.selected==='result'&&schoolState.visible===1&&(await page.locator('[data-phase22c-claim-kind="schoolhouse-lesson"]').count())===1,schoolState);

  const claimRevision=await revision();
  const beforeClaim=afterTeach;
  await page.locator('[data-phase19-claim]').click();
  await waitRevision(page,claimRevision+1);
  const afterClaim=await derive();
  add(size.id,'lesson-claim-commits-once-and-pays-once',(await revision())===claimRevision+1&&afterClaim.resources.gold>beforeClaim.resources.gold&&afterClaim.schoolhouse.education>beforeClaim.schoolhouse.education&&afterClaim.claimArchive.recentReceipts.length===beforeClaim.claimArchive.recentReceipts.length+1,{goldBefore:beforeClaim.resources.gold,goldAfter:afterClaim.resources.gold,educationBefore:beforeClaim.schoolhouse.education,educationAfter:afterClaim.schoolhouse.education,receipts:afterClaim.claimArchive.recentReceipts.length});
  const rawAfterSchoolClaim=await raw();
  await page.evaluate(()=>document.querySelector('[data-phase19-claim]')?.click());
  add(size.id,'disabled-lesson-claim-cannot-pay-twice',await raw()===rawAfterSchoolClaim);

  await page.locator('[data-overlay]').click({position:{x:1,y:1}});
  await page.waitForSelector('[data-phase24l-b3d-facility="schoolhouse"]',{state:'detached'});
  await page.waitForFunction(()=>document.activeElement?.dataset?.phase15FacilityId==='facility.schoolhouse');
  const schoolBackdrop=await page.evaluate(()=>({focus:document.activeElement?.dataset?.phase15FacilityId||null,overlayChildren:document.querySelector('#overlay')?.children.length??-1}));
  add(size.id,'schoolhouse-backdrop-uses-canonical-close-and-restores-focus',schoolBackdrop.focus==='facility.schoolhouse'&&schoolBackdrop.overlayChildren===0,schoolBackdrop);

  const apothecarySetup=await page.evaluate(()=>window.__EVERSTEAD_PHASE_18_19_QA__.destructive.settle('facility.apothecary',103600000));
  add(size.id,'apothecary-case-banked-by-existing-authority',apothecarySetup?.ok===true&&apothecarySetup?.createdCount===1,summary(apothecarySetup));
  await page.locator('[data-nav="village"]').click();
  const apothecaryHotspot=page.locator('[data-phase15-facility-id="facility.apothecary"]');
  const rawBeforeApothecaryOpen=await raw();
  await apothecaryHotspot.click();
  await page.waitForSelector('[data-phase24l-b3d-facility="apothecary"]');
  const apothecaryLayout=await inspectLayout(page,'apothecary',size);
  add(size.id,'apothecary-open-is-write-neutral',await raw()===rawBeforeApothecaryOpen,apothecaryLayout);
  add(size.id,'apothecary-one-shell-four-tabs-one-live-dock',apothecaryLayout.shells===1&&apothecaryLayout.tabs===4&&apothecaryLayout.visiblePanels.length===1&&apothecaryLayout.selected==='case'&&apothecaryLayout.actionDocks===1&&apothecaryLayout.actionButtons===2,apothecaryLayout);
  add(size.id,'apothecary-preserves-all-authoritative-live-controls',apothecaryLayout.requiredSelectors.every(item=>item.count>=item.minimum)&&apothecaryLayout.duplicateActions===0,apothecaryLayout.requiredSelectors);
  add(size.id,'apothecary-is-bounded-touch-safe-and-page-stable',apothecaryLayout.touchSafe&&apothecaryLayout.modalScroll===0&&apothecaryLayout.rootScroll===0&&apothecaryLayout.bodyScroll===0&&apothecaryLayout.overflowX===0&&apothecaryLayout.regionsVisible,apothecaryLayout);
  add(size.id,'apothecary-compact-type-meets-raised-legibility-baseline',typographyPass(apothecaryLayout.typography,size,'apothecary'),apothecaryLayout.typography);

  const rawBeforeApothecaryTabs=await raw();
  await page.locator('[data-phase24l-b3d-tabs="apothecary"] [data-phase24l-b3d-tab="result"]').click();
  const apothecaryPointer=await tabState(page,'apothecary');
  await page.keyboard.press('Home');
  const apothecaryHomeAfterPointer=await tabState(page,'apothecary');
  await page.keyboard.press('End');
  const apothecaryEndAfterPointer=await tabState(page,'apothecary');
  add(size.id,'apothecary-pointer-activation-keeps-tab-focus-and-home-end-work',await raw()===rawBeforeApothecaryTabs&&apothecaryPointer.selected==='result'&&apothecaryPointer.focused==='result'&&apothecaryHomeAfterPointer.selected==='case'&&apothecaryHomeAfterPointer.focused==='case'&&apothecaryEndAfterPointer.selected==='result'&&apothecaryEndAfterPointer.focused==='result',{pointer:apothecaryPointer,home:apothecaryHomeAfterPointer,end:apothecaryEndAfterPointer});

  await page.locator('[data-phase24l-b3d-tab="diagnose"]').focus();
  await page.keyboard.press('Enter');
  const apothecaryEnter=await tabState(page,'apothecary');
  await page.keyboard.press('ArrowRight');
  const apothecaryArrowAfterEnter=await tabState(page,'apothecary');
  add(size.id,'apothecary-enter-activation-keeps-tab-focus-and-arrow-works',await raw()===rawBeforeApothecaryTabs&&apothecaryEnter.selected==='diagnose'&&apothecaryEnter.focused==='diagnose'&&apothecaryArrowAfterEnter.selected==='remedy'&&apothecaryArrowAfterEnter.focused==='remedy'&&apothecaryArrowAfterEnter.visible===1&&apothecaryArrowAfterEnter.inactiveNotInert===0,{enter:apothecaryEnter,arrow:apothecaryArrowAfterEnter});

  await page.locator('[data-phase24l-b3d-tab="case"]').focus();
  await page.keyboard.press('Space');
  const apothecarySpace=await tabState(page,'apothecary');
  await page.keyboard.press('ArrowRight');
  const apothecaryArrowAfterSpace=await tabState(page,'apothecary');
  await page.keyboard.press('Home');
  const apothecaryHomeAfterSpace=await tabState(page,'apothecary');
  await page.keyboard.press('End');
  const apothecaryEndAfterSpace=await tabState(page,'apothecary');
  await page.locator('[data-phase24l-b3d-tab="case"]').focus();
  await page.keyboard.press('Space');
  add(size.id,'apothecary-space-activation-keeps-tab-focus-and-arrow-home-end-remain-usable',await raw()===rawBeforeApothecaryTabs&&apothecarySpace.selected==='case'&&apothecarySpace.focused==='case'&&apothecaryArrowAfterSpace.selected==='diagnose'&&apothecaryArrowAfterSpace.focused==='diagnose'&&apothecaryHomeAfterSpace.selected==='case'&&apothecaryHomeAfterSpace.focused==='case'&&apothecaryEndAfterSpace.selected==='result'&&apothecaryEndAfterSpace.focused==='result'&&(await tabState(page,'apothecary')).selected==='case',{space:apothecarySpace,arrow:apothecaryArrowAfterSpace,home:apothecaryHomeAfterSpace,end:apothecaryEndAfterSpace,final:await tabState(page,'apothecary')});

  const caseRevision=await revision();
  await page.locator('[data-phase18-case-id]').click();
  await waitRevision(page,caseRevision+1);
  let apothecaryState=await tabState(page,'apothecary');
  add(size.id,'begin-case-commits-once-and-opens-diagnose',(await revision())===caseRevision+1&&apothecaryState.selected==='diagnose',apothecaryState);

  const liveCase=(await derive()).apothecary.cases[0];
  const wrongDiagnosis=liveCase.diagnosisOptionIds.find(id=>id!==liveCase.preciseDiagnosisId);
  const diagnosisRevision=await revision();
  await page.locator(`[data-phase18-diagnosis-id="${wrongDiagnosis}"]`).click();
  await waitRevision(page,diagnosisRevision+1);
  apothecaryState=await tabState(page,'apothecary');
  add(size.id,'diagnosis-commits-once-and-opens-remedy',(await revision())===diagnosisRevision+1&&apothecaryState.selected==='remedy',apothecaryState);

  const remedyRevision=await revision();
  await page.locator('[data-phase18-remedy-id]').first().click();
  await waitRevision(page,remedyRevision+1);
  const beforeWrongResolve=await derive();
  const wrongResolveRevision=await revision();
  await page.locator('[data-phase18-resolve]').click();
  await waitRevision(page,wrongResolveRevision+1);
  const afterWrongResolve=await derive();
  apothecaryState=await tabState(page,'apothecary');
  add(size.id,'incorrect-resolution-commits-once-without-offer-or-reward',(await revision())===wrongResolveRevision+1&&afterWrongResolve.resources.gold===beforeWrongResolve.resources.gold&&afterWrongResolve.apothecary.mastery===beforeWrongResolve.apothecary.mastery&&afterWrongResolve.claims.pendingOffers.length===beforeWrongResolve.claims.pendingOffers.length,{state:afterWrongResolve.apothecary.cases[0]?.resumeStep,tab:apothecaryState.selected});
  add(size.id,'recheck-remains-on-remedy-tab',apothecaryState.selected==='remedy'&&(await page.locator('[data-phase18-recheck].phase-1819-ready').count())===1,apothecaryState);

  await page.locator('[data-phase24l-b3d-tab="diagnose"]').click();
  const preciseDiagnosisRevision=await revision();
  await page.locator(`[data-phase18-diagnosis-id="${liveCase.preciseDiagnosisId}"]`).click();
  await waitRevision(page,preciseDiagnosisRevision+1);
  const correctedDiagnosisState=await tabState(page,'apothecary');
  add(size.id,'corrected-diagnosis-returns-to-remedy',correctedDiagnosisState.selected==='remedy',correctedDiagnosisState);
  if(correctedDiagnosisState.selected!=='remedy')await page.locator('[data-phase24l-b3d-tab="remedy"]').click();
  const updatedCase=(await derive()).apothecary.cases[0];
  const preciseRemedyRevision=await revision();
  await page.locator(`[data-phase18-remedy-id="${updatedCase.preciseRemedyIds[0]}"]`).click();
  await waitRevision(page,preciseRemedyRevision+1);
  const beforePreciseResolve=await derive();
  const preciseResolveRevision=await revision();
  await page.locator('[data-phase18-resolve]').click();
  await waitRevision(page,preciseResolveRevision+1);
  const afterPreciseResolve=await derive();
  apothecaryState=await tabState(page,'apothecary');
  add(size.id,'precise-resolution-commits-once-without-early-reward',(await revision())===preciseResolveRevision+1&&afterPreciseResolve.resources.gold===beforePreciseResolve.resources.gold&&afterPreciseResolve.apothecary.mastery===beforePreciseResolve.apothecary.mastery,{tab:apothecaryState.selected,pending:afterPreciseResolve.claims.pendingOffers.length});
  add(size.id,'case-claim-ready-opens-result',apothecaryState.selected==='result'&&(await page.locator('[data-phase22c-claim-kind="apothecary-case"]').count())===1,apothecaryState);

  const apothecaryClaimRevision=await revision();
  const beforeApothecaryClaim=afterPreciseResolve;
  await page.locator('[data-phase18-claim]').click();
  await waitRevision(page,apothecaryClaimRevision+1);
  const afterApothecaryClaim=await derive();
  add(size.id,'apothecary-claim-commits-once-and-pays-once',(await revision())===apothecaryClaimRevision+1&&afterApothecaryClaim.resources.gold>beforeApothecaryClaim.resources.gold&&afterApothecaryClaim.apothecary.mastery>beforeApothecaryClaim.apothecary.mastery&&afterApothecaryClaim.claimArchive.recentReceipts.length===beforeApothecaryClaim.claimArchive.recentReceipts.length+1,{goldBefore:beforeApothecaryClaim.resources.gold,goldAfter:afterApothecaryClaim.resources.gold,masteryBefore:beforeApothecaryClaim.apothecary.mastery,masteryAfter:afterApothecaryClaim.apothecary.mastery,receipts:afterApothecaryClaim.claimArchive.recentReceipts.length});
  const rawAfterApothecaryClaim=await raw();
  await page.evaluate(()=>document.querySelector('[data-phase18-claim]')?.click());
  add(size.id,'disabled-apothecary-claim-cannot-pay-twice',await raw()===rawAfterApothecaryClaim);

  await page.keyboard.press('Escape');
  await page.waitForSelector('[data-phase24l-b3d-facility="apothecary"]',{state:'detached'});
  await page.waitForFunction(()=>document.activeElement?.dataset?.phase15FacilityId==='facility.apothecary');
  const apothecaryClose=await page.evaluate(()=>({focus:document.activeElement?.dataset?.phase15FacilityId||null,overlayChildren:document.querySelector('#overlay')?.children.length??-1}));
  add(size.id,'apothecary-escape-is-write-neutral-and-restores-focus',await raw()===rawAfterApothecaryClaim&&apothecaryClose.focus==='facility.apothecary'&&apothecaryClose.overlayChildren===0,apothecaryClose);
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

function summary(result){return result&&{ok:result.ok,reason:result.reason||null,writes:result.writes??null,createdCount:result.createdCount??null,rawChanged:result.rawChanged??null}}
async function waitRevision(page,target){await page.waitForFunction(value=>JSON.parse(window.__EVERSTEAD_PHASE_18_19_QA__.read.raw()).saveMeta.revision===value,target)}
async function tabState(page,kind){return page.evaluate(value=>{const root=document.querySelector(`[data-phase24l-b3d-facility="${value}"]`);return{selected:root?.querySelector('[role="tab"][aria-selected="true"]')?.dataset.phase24lB3dTab||null,focused:document.activeElement?.dataset?.phase24lB3dTab||null,visible:[...root.querySelectorAll('[role="tabpanel"]')].filter(panel=>!panel.hidden).length,inactiveNotInert:[...root.querySelectorAll('[role="tabpanel"][hidden]')].filter(panel=>!panel.inert).length}},kind)}
async function activeFocus(page){return page.evaluate(()=>({inside:document.querySelector('.modal')?.contains(document.activeElement)===true,tab:document.activeElement?.dataset?.phase24lB3dTab||null,close:document.activeElement?.matches?.('[data-phase18-close],[data-phase19-close]')===true,hiddenAncestor:Boolean(document.activeElement?.closest?.('[hidden],[inert],[aria-hidden="true"]'))}))}
function typographyPass(type,size,kind){return type.scene>=10&&type.summaryLabel>=9&&type.summaryValue>=11&&type.panelCopy>=10&&type.choice>=10&&type.tab>=(size.width<370?9:10)&&type.action>=(kind==='schoolhouse'?(size.width<370?8.5:9):10)}
async function inspectLayout(page,kind,size){return page.evaluate(({kind,size})=>{
 const root=document.querySelector(`[data-phase24l-b3d-facility="${kind}"]`),modal=root?.closest('.modal'),rect=node=>{const value=node.getBoundingClientRect();return{left:value.left,right:value.right,top:value.top,bottom:value.bottom,width:value.width,height:value.height}},font=selector=>{const node=root.querySelector(selector);return node?parseFloat(getComputedStyle(node).fontSize):0},tabs=root?.querySelector(`[data-phase24l-b3d-tabs="${kind}"]`),dock=root?.querySelector(':scope > .phase-1819-actions'),targets=[...root.querySelectorAll(':scope > .phase24l-b3d-tabs [role="tab"],:scope > .phase-1819-actions button,:scope > .phase24l-b3d-scene button')],actionSelectors=kind==='apothecary'?['[data-phase18-resolve]','[data-phase18-claim]']:['[data-phase19-teach]','[data-phase19-claim]','[data-phase19-graduation-claim]'],required=kind==='apothecary'?[['[data-phase18-case-id]',1],['[data-phase18-clue-id]',1],['[data-phase18-diagnosis-id]',1],['[data-phase18-remedy-id]',1],['[data-phase18-resolve]',1],['[data-phase18-recheck]',1],['[data-phase18-claim]',1],['[data-phase18-close]',1]]:[['[data-phase19-seat-id]',1],['[data-phase19-pupil-id]',1],['[data-phase19-lesson-id]',1],['[data-phase19-mentor-id]',1],['[data-phase19-approach-id]',1],['[data-phase19-teach]',1],['[data-phase19-claim]',1],['[data-phase19-graduation-claim]',1],['[data-phase19-close]',1]],tabsRect=rect(tabs),dockRect=rect(dock),modalRect=rect(modal),typography={scene:font(':scope > .phase24l-b3d-scene p'),summaryLabel:font(':scope > [data-phase22c-local-summary] span'),summaryValue:font(':scope > [data-phase22c-local-summary] b'),panelCopy:font('.phase24l-b3d-panel > p.soft'),choice:font('.phase24l-b3d-panel .phase-1819-choice'),tab:font(':scope > .phase24l-b3d-tabs [role="tab"]'),action:font(':scope > .phase-1819-actions .btn')};
 return{shells:document.querySelectorAll(`[data-phase24l-b3d-facility="${kind}"]`).length,tabs:root.querySelectorAll(':scope > .phase24l-b3d-tabs [role="tab"]').length,selected:root.querySelector('[role="tab"][aria-selected="true"]')?.dataset.phase24lB3dTab||null,visiblePanels:[...root.querySelectorAll('[role="tabpanel"]')].filter(panel=>!panel.hidden).map(panel=>panel.dataset.phase24lB3dPanel),inactivePanels:root.querySelectorAll('[role="tabpanel"][hidden]').length,inactiveNotInert:[...root.querySelectorAll('[role="tabpanel"][hidden]')].filter(panel=>!panel.inert).length,actionDocks:root.querySelectorAll(':scope > .phase-1819-actions').length,actionButtons:dock?.querySelectorAll('button').length||0,duplicateActions:actionSelectors.reduce((sum,selector)=>sum+Math.max(0,root.querySelectorAll(selector).length-1),0),requiredSelectors:required.map(([selector,minimum])=>({selector,minimum,count:root.querySelectorAll(selector).length})),touchSafe:targets.every(node=>{const value=rect(node);return value.width>=44&&value.height>=44}),typography,modalScroll:modal.scrollHeight-modal.clientHeight,rootScroll:root.scrollHeight-root.clientHeight,bodyScroll:document.scrollingElement.scrollHeight-document.scrollingElement.clientHeight,overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth,regionsVisible:modalRect.top>=-1&&modalRect.bottom<=size.height+1&&tabsRect.top>=modalRect.top-1&&tabsRect.bottom<=modalRect.bottom+1&&dockRect.top>=modalRect.top-1&&dockRect.bottom<=tabsRect.top+1}}, {kind,size})}
