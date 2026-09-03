import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));
const phase24dContract=JSON.parse(fs.readFileSync(path.join(root,'qa/phase-24d-public-preview/contract.json'),'utf8'));
const TUTORIAL_STEP_ID='tutorial.story.objective.chapter-change.step.open';
const TUTORIAL_RECEIPT_ID='tutorial.receipt.story.objective.chapter-change';
const rows=[];
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const ECONOMIC_KEYS=['resources','campaign','claims','phase13Claims','legacy','phase13Legacy','facilities'];

function staticServer(base=root){
  return http.createServer((request,response)=>{
    const pathname=decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname);
    const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/,''),target=path.resolve(base,relative);
    if(target!==base&&!target.startsWith(base+path.sep)){response.writeHead(403).end('Forbidden');return}
    fs.readFile(target,(error,data)=>{
      if(error){response.writeHead(error.code==='ENOENT'?404:500).end(error.code==='ENOENT'?'Not found':'Server error');return}
      response.writeHead(200,{'content-type':mime[path.extname(target)]||'application/octet-stream','cache-control':'no-store'}).end(data);
    });
  });
}
async function listen(server){await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});return`http://127.0.0.1:${server.address().port}`}

async function loadPredecessorSeedTools(){
  const temporaryDirectory=fs.mkdtempSync(path.join(os.tmpdir(),'everstead-phase24g-predecessor-'));
  const predecessorRoot=path.join(temporaryDirectory,'predecessor');
  fs.mkdirSync(predecessorRoot);
  const predecessorIndex=spawnSync('git',['show',`${contract.predecessor.commit}:index.html`],{cwd:root,encoding:null,maxBuffer:64*1024*1024});
  if(predecessorIndex.status!==0)throw new Error(`Could not read predecessor index: ${predecessorIndex.stderr?.toString()}`);
  fs.writeFileSync(path.join(predecessorRoot,'index.html'),predecessorIndex.stdout);
  for(const directory of ['src','assets'])fs.symlinkSync(path.join(root,directory),path.join(predecessorRoot,directory),'dir');
  const original=fs.readFileSync(path.join(root,'qa/phase-24d-public-preview/browser.mjs'),'utf8');
  const executionStart=original.indexOf('const server=staticServer();');
  if(executionStart<0)throw new Error('Frozen Phase 24D browser source has an unknown shape');
  let source=original.slice(0,executionStart)
    .replace("import {chromium} from 'playwright';\n",'')
    .replace("const root=path.resolve(here,'../..');",`const root=${JSON.stringify(predecessorRoot)};`)
    .replace("const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));",`const contract=${JSON.stringify(phase24dContract)};`);
  const originalLoop='for(let ordinal=1;ordinal<=2;ordinal++)await clearNextStage(ordinal);\n  const established=await capture({clears:2,habits:3});';
  const replacementLoop="await clearNextStage(1);\n  const stage1=await capture({clears:1,habits:3});\n  await clearNextStage(2);\n  const established=await capture({clears:2,habits:3});";
  if(!source.includes(originalLoop))throw new Error('Frozen Phase 24D stage seed seam changed');
  source=source.replace(originalLoop,replacementLoop).replace('return{fresh:null,...profiles};','return{fresh:null,stage1,...profiles};');
  source+='\nexport {staticServer,listen,contextFor,seedProfiles,dismiss,visible};\n';
  const temporaryModule=path.join(temporaryDirectory,'seed-tools.mjs');
  fs.writeFileSync(temporaryModule,source);
  const tools=await import(`${pathToFileURL(temporaryModule).href}?v=${Date.now()}`);
  process.on('exit',()=>fs.rmSync(temporaryDirectory,{recursive:true,force:true}));
  return{...tools,predecessorRoot,temporaryDirectory};
}

async function snapshot(page){
  return page.evaluate(storageKey=>{
    const harness=window.__PHASE24D_BROWSER_HARNESS__,slots=Object.fromEntries([...harness.slots.entries()].sort(([a],[b])=>a.localeCompare(b)));
    const raw=slots[storageKey]??null,state=raw?JSON.parse(raw):null;
    const phase15=state?.phase15FacilityFoundation||null;
    return{
      raw,slots,writes:harness.writes.length,nativeAccesses:[...harness.nativeAccesses],
      revision:state?.saveMeta?.revision??null,updatedAt:state?.saveMeta?.updatedAt??null,source:state?.saveMeta?.source??null,
      resources:{gold:state?.gold,gifts:state?.gifts,pendingGold:state?.pendingGold,prosperity:state?.prosperity,might:state?.fellowMight?.points,rank:state?.player?.rank,rankExp:state?.player?.rankExp},
      combatSupport:{bondTotal:Object.values(state?.fellows||{}).reduce((sum,item)=>sum+(item?.bond||0),0),familyIntimacyTotal:Object.values(state?.family||{}).reduce((sum,item)=>sum+(item?.intimacy||0),0),assignedCompanions:Object.values(state?.companions||{}).filter(item=>item?.assignedFellowId!==null).length,equippedRelics:Object.values(state?.fellows||{}).reduce((sum,item)=>sum+(item?.relicSlots||[]).filter(Boolean).length,0)},
      campaign:{runOrdinal:state?.fellowCampaign?.runOrdinal,cleared:[...(state?.fellowCampaign?.clearedStageIds||[])],lastReceipt:state?.fellowCampaign?.lastReceipt||null},
      story:{active:state?.narrativeProgress?.activeStoryId??null,pending:[...(state?.phase13Progress?.pendingSceneIds||[])],resolutions:{...(state?.phase13Progress?.sceneResolutionsById||{})},unlocked:[...(state?.chronicleProgress?.unlockedEntryIds||[])],unread:[...(state?.chronicleProgress?.unreadEntryIds||[])]},
      storyV1:state?.storyV1?JSON.parse(JSON.stringify(state.storyV1)):null,
      tutorials:state?.tutorialProgress?JSON.parse(JSON.stringify(state.tutorialProgress)):null,
      phase2021Tutorials:state?.phase2021?.tutorials?JSON.parse(JSON.stringify(state.phase2021.tutorials)):null,
      claims:phase15?{pendingOffers:JSON.parse(JSON.stringify(phase15.pendingOffers||{})),archive:JSON.parse(JSON.stringify(phase15.claimArchive||{}))}:state?.rewardClaims?JSON.parse(JSON.stringify(state.rewardClaims)):null,
      phase13Claims:state?.rewardClaims?JSON.parse(JSON.stringify(state.rewardClaims)):null,
      legacy:state?.durableProgression?.ladders?.legacy?JSON.parse(JSON.stringify(state.durableProgression.ladders.legacy)):null,
      phase13Legacy:state?.legacyProgress?JSON.parse(JSON.stringify(state.legacyProgress)):null,
      facilities:{discovered:[...(state?.facilityProgress?.discoveredIds||[])],unlocked:[...(state?.facilityProgress?.unlockedIds||[])],capabilities:[...(phase15?.capabilityIds||[])]},
      forbiddenRoot:Object.hasOwn(state||{},'phase24gProgress')||Object.hasOwn(state||{},'phase24gState')
    };
  },contract.storageKey);
}
const stable=(left,right,keys)=>keys.every(key=>JSON.stringify(left[key])===JSON.stringify(right[key]));
const tutorialStatus=value=>value.tutorials?.completedStepIds?.includes(TUTORIAL_STEP_ID)?'completed':value.tutorials?.dismissedStepIds?.includes(TUTORIAL_STEP_ID)?'dismissed':value.tutorials?.seenStepIds?.includes(TUTORIAL_STEP_ID)?'seen':value.tutorials?'unseen':null;
const tutorialReplays=value=>value.tutorials?.replayCountsByTutorial?.[contract.tutorialId]??0;
const terminalTutorialStatus=value=>['completed','dismissed'].includes(value);
function tutorialStateWithoutTarget(value){
  const tutorials=structuredClone(value.tutorials),successor=structuredClone(value.phase2021Tutorials);
  if(tutorials){
    for(const key of ['seenStepIds','completedStepIds','dismissedStepIds'])tutorials[key]=tutorials[key].filter(id=>id!==TUTORIAL_STEP_ID);
    tutorials.completionReceiptIds=tutorials.completionReceiptIds.filter(id=>id!==TUTORIAL_RECEIPT_ID);
    delete tutorials.replayCountsByTutorial[contract.tutorialId];
  }
  if(successor){
    delete successor.statusById[contract.tutorialId];
    delete successor.replayCountsById[contract.tutorialId];
    successor.pendingIds=successor.pendingIds.filter(id=>id!==contract.tutorialId);
    successor.presentedIds=successor.presentedIds.filter(id=>id!==contract.tutorialId);
  }
  return{tutorials,successor};
}
function tutorialStatusOnly(before,after,from,to){
  if(tutorialStatus(before)!==from||tutorialStatus(after)!==to)return false;
  return JSON.stringify(tutorialStateWithoutTarget(before))===JSON.stringify(tutorialStateWithoutTarget(after));
}
function tutorialReplayOnly(before,after){
  const prior=tutorialReplays(before),next=tutorialReplays(after);
  if(!Number.isSafeInteger(prior)||next!==prior+1||tutorialStatus(after)!==tutorialStatus(before))return false;
  return JSON.stringify(tutorialStateWithoutTarget(before))===JSON.stringify(tutorialStateWithoutTarget(after));
}
function protectedSlotsStable(before,after){return Object.keys(before.slots).every(name=>name===contract.storageKey||name===`${contract.storageKey}__staging`||before.slots[name]===after.slots[name])}

function historicalNoSpendSeed(seedSlots){
  return structuredClone(seedSlots);
}

function legacyRankOneStageOneSeed({explicitNullSchema=false}={}){
  const state=JSON.parse(fs.readFileSync(path.join(root,'qa/fixtures/sparse-v0.1.txt'),'utf8'));
  state.gold=500000;
  state.storyStage=2;
  state.fellows={cael:{training:7},lyra:{training:6},orin:{training:5},selene:{training:8},rook:{training:4},mira:{training:3}};
  if(explicitNullSchema)state.schemaVersion=null;
  return{[contract.storageKey]:JSON.stringify(state)};
}

async function navigate(page,route){await page.locator(`.bottom-nav [data-nav="${route}"]`).click();await page.waitForTimeout(90)}
async function closeOverlay(page){if(await page.locator('[data-overlay]').count()){await page.keyboard.press('Escape');await page.waitForTimeout(80)}}

async function openTutorialLog(page){
  await navigate(page,'more');
  const trigger=page.locator('main [data-phase13-tutorial-log]');
  if(await trigger.count()!==1)throw new Error('Tutorial Log trigger is not uniquely rendered');
  await trigger.click();
  await page.waitForSelector('[data-overlay] #everstead-modal-title');
  const heading=(await page.locator('[data-overlay] #everstead-modal-title').innerText()).trim();
  if(heading!=='Tutorial Log')throw new Error(`Expected Tutorial Log, received ${heading}`);
}

async function settlePredecessorPresentations(page){
  const newIds=new Set(contract.scenes.map(item=>item.id));
  await page.waitForTimeout(450);
  for(let cycle=0;cycle<40;cycle++){
    const scene=page.locator('[data-overlay] [data-phase13-scene]');
    if(await scene.count()){
      const id=await scene.getAttribute('data-phase13-scene');
      if(newIds.has(id))return;
      const skip=page.locator('[data-overlay] [data-phase13-story="skip"]');
      if(await skip.count()&&!await skip.isDisabled()){await skip.click();await page.waitForTimeout(450);continue}
      throw new Error(`Predecessor scene ${id||'unknown'} cannot be resolved safely`);
    }
    const tutorial=page.locator('[data-overlay] [data-phase13-tutorial], [data-overlay] [data-phase15-tutorial]');
    if(await tutorial.count()){
      const item=tutorial.first(),id=await item.getAttribute('data-phase13-tutorial')||await item.getAttribute('data-phase15-tutorial');
      if(id===contract.tutorialId)throw new Error('The Chapter-change tutorial appeared before the Merchant Dispute resolution');
      const skip=page.locator('[data-overlay] [data-phase13-tutorial-action="skip"], [data-overlay] [data-phase15-tutorial-action="skip"]').first();
      if(await skip.count()&&!await skip.isDisabled()){await skip.click();await page.waitForTimeout(450);continue}
      const complete=page.locator('[data-overlay] [data-phase13-tutorial-action="complete"], [data-overlay] [data-phase15-tutorial-action="complete"]').first();
      if(await complete.count()&&!await complete.isDisabled()){await complete.click();await page.waitForTimeout(450);continue}
      const terminalClose=page.locator('[data-overlay] [data-modal-close]').first();
      if(await terminalClose.count()){await terminalClose.click();await page.waitForTimeout(450);continue}
      throw new Error(`Predecessor tutorial ${id||'unknown'} cannot be resolved safely`);
    }
    if(await page.locator('[data-overlay]').count()){await closeOverlay(page);await page.waitForTimeout(450);continue}
    return;
  }
  throw new Error('Predecessor presentations did not settle within 40 cycles');
}

async function openCampaignStage(page,stageId){
  await navigate(page,'adventure');
  const campaign=page.locator('[data-adventure="fellowCampaign"]');
  if(await campaign.count()&&await campaign.getAttribute('aria-disabled')!=='true'){await campaign.click();await page.waitForTimeout(100)}
  await closeOverlay(page);
  const stage=page.locator(`[data-campaign-stage="${stageId}"]`);
  if(await stage.count()!==1)throw new Error(`Campaign stage ${stageId} is not uniquely rendered`);
  await stage.click();await page.waitForTimeout(100);await closeOverlay(page);
  const run=page.locator(`[data-campaign-run="${stageId}"]`);
  if(await run.count()!==1||await run.isDisabled())throw new Error(`Campaign stage ${stageId} is not playable`);
  return run;
}

async function campaignStageSurface(page,stageId){
  await navigate(page,'adventure');
  const campaign=page.locator('[data-adventure="fellowCampaign"]');
  if(await campaign.count()&&await campaign.getAttribute('aria-disabled')!=='true'){await campaign.click();await page.waitForTimeout(100)}
  await closeOverlay(page);
  const stage=page.locator(`[data-campaign-stage="${stageId}"]`);
  if(await stage.count()!==1)throw new Error(`Campaign stage ${stageId} is not uniquely rendered`);
  await stage.click();await page.waitForTimeout(100);await closeOverlay(page);
  return page.evaluate(stageId=>{const run=document.querySelector(`[data-campaign-run="${stageId}"]`),power=document.querySelector('[data-combat-fellow-roster-power="campaign"]'),recommended=power?.parentElement?.nextElementSibling?.querySelector('b');return{runCount:document.querySelectorAll(`[data-campaign-run="${stageId}"]`).length,runText:run?.textContent.replace(/\s+/g,' ').trim()||'',disabled:Boolean(run?.disabled),powerText:power?.textContent.trim()||'',recommendedText:recommended?.textContent.trim()||''}},stageId);
}

async function prepareHistoricalNoSpendFixture(page){
  const assigned=await page.evaluate(key=>{const state=JSON.parse(window.__PHASE24D_BROWSER_HARNESS__.slots.get(key));return{companions:Object.entries(state.companions||{}).filter(([,item])=>item.assignedFellowId!==null).map(([id])=>id),relics:[...new Set(Object.values(state.fellows||{}).flatMap(item=>(item.relicSlots||[]).filter(Boolean)))]}},contract.storageKey);
  if(assigned.companions.length){
    await navigate(page,'fellows');await page.locator('[data-roster="companions"]').click();await page.waitForTimeout(100);await closeOverlay(page);
    for(const id of assigned.companions){
      await page.locator(`main [data-companion="${id}"]`).first().click();await page.waitForSelector(`[data-overlay] [data-companion-assignment="${id}"]`);
      await page.locator(`[data-overlay] [data-companion-assignment="${id}"]`).selectOption('');
      await page.locator(`[data-overlay] [data-companion-assignment-save="${id}"]`).click();await page.waitForTimeout(80);await closeOverlay(page);
    }
  }
  if(assigned.relics.length){
    await navigate(page,'fellows');await page.locator('[data-roster="relics"]').click();await page.waitForTimeout(100);await closeOverlay(page);
    for(const id of assigned.relics){
      await page.locator(`main [data-relic-open="${id}"]`).click();await page.waitForSelector(`[data-overlay] [data-relic-equip-select="${id}"]`);
      await page.locator(`[data-overlay] [data-relic-equip-select="${id}"]`).selectOption('');
      await page.locator(`[data-overlay] [data-relic-equip-apply="${id}"]`).click();await page.waitForTimeout(80);await closeOverlay(page);
    }
  }
  let upgrades=0;
  for(let pass=0;pass<30;pass++){
    let changed=false;
    await navigate(page,'village');
    const buildingIds=await page.locator('main [data-building]').evaluateAll(nodes=>nodes.map(node=>node.dataset.building));
    for(const id of buildingIds){
      const building=page.locator(`main [data-building="${id}"]`),reachable=await building.evaluate(node=>{const rect=node.getBoundingClientRect(),x=rect.left+rect.width/2,y=rect.top+rect.height/2,hit=document.elementFromPoint(x,y);return hit===node||node.contains(hit)});
      if(!reachable)continue;
      await building.click();await page.waitForTimeout(50);
      const button=page.locator(`[data-overlay] [data-modal-act="upgrade-building"][data-id="${id}"]`);
      if(await button.count()===1&&!await button.isDisabled()){await button.click();await page.waitForTimeout(55);upgrades++;changed=true}
      await closeOverlay(page);
      const gold=await page.evaluate(key=>JSON.parse(window.__PHASE24D_BROWSER_HARNESS__.slots.get(key)).gold,contract.storageKey);
      if(gold<12000)break;
    }
    const gold=await page.evaluate(key=>JSON.parse(window.__PHASE24D_BROWSER_HARNESS__.slots.get(key)).gold,contract.storageKey);
    if(gold<12000||!changed)break;
  }
  let stageOneReplays=0,current=await snapshot(page);
  if(current.resources.gold>=12000){
    const run=await openCampaignStage(page,'broken-roads-1');
    for(let attempt=0;attempt<8&&current.resources.gold>=12000;attempt++){
      if(await run.isDisabled())break;
      await run.click();await page.waitForTimeout(90);await closeOverlay(page);stageOneReplays++;current=await snapshot(page);
    }
  }
  const stageTwo=await campaignStageSurface(page,contract.stageId),final=await snapshot(page);
  return{assigned,upgrades,stageOneReplays,stageTwo,final:{resources:final.resources,combatSupport:final.combatSupport,campaign:final.campaign}};
}

async function resolveScene(page,id,action){
  const selector=`[data-overlay] [data-phase13-scene="${id}"]`;
  await page.waitForSelector(selector,{timeout:5000});
  const before=await snapshot(page);
  const presentations=[];
  const capturePresentation=()=>page.evaluate(selector=>{
    const scene=document.querySelector(selector),art=scene?.querySelector('.phase-13-speaker-art'),image=art?.querySelector('img'),eyebrow=scene?.querySelector('.eyebrow')?.textContent.trim()||'',line=scene?.querySelector('.phase-13-line b')?.textContent.trim()||'';
    return{eyebrow,line,imageCount:scene?.querySelectorAll('.phase-13-speaker-art img').length||0,loaded:Boolean(image?.complete&&image.naturalWidth>0&&image.naturalHeight>0),framed:scene?.querySelectorAll('[data-approved-framed="true"]').length||0,transparent:Boolean(art&&!art.classList.contains('framed')&&!art.classList.contains('text-only'))};
  },selector);
  const geometry=await page.evaluate(({selector,minimum})=>{
    const scene=document.querySelector(selector),dialog=scene?.closest('[role="dialog"]'),heading=dialog?.querySelector('#everstead-modal-title'),controls=[...scene?.querySelectorAll('button')||[]],bad=controls.filter(node=>{const rect=node.getBoundingClientRect();return rect.width<minimum||rect.height<minimum});
    return{dialog:Boolean(dialog),modal:dialog?.getAttribute('aria-modal'),labelled:dialog?.getAttribute('aria-labelledby')===heading?.id,activeInside:dialog?.contains(document.activeElement),controls:controls.length,bad:bad.map(node=>node.textContent.trim()),overflow:document.documentElement.scrollWidth>innerWidth+1};
  },{selector,minimum:contract.minimumTargetPx});
  if(action==='skip'){presentations.push(await capturePresentation());await page.locator(`${selector} [data-phase13-story="skip"]`).click()}
  else{
    for(let beat=0;beat<contract.scenes.find(item=>item.id===id).beatCount;beat++){
      presentations.push(await capturePresentation());
      await page.locator(`${selector} [data-phase13-story="next"]`).click();
      await page.waitForTimeout(45);
    }
  }
  await page.waitForTimeout(120);
  const after=await snapshot(page);
  return{before,after,geometry,presentations};
}

function presentationsValid(scene,presentations,{full=false}={}){
  const expected=full?scene.beatCount:1;
  if(presentations.length!==expected)return false;
  return presentations.every((item,index)=>{
    const speaker=full?(index%2===0?scene.speakers[0]:scene.speakers[1]):scene.speakers[0],isFellow=speaker.startsWith('fellow.'),name=speaker==='fellow.cael'?'Kaladin':speaker==='fellow.lyra'?'Tavi':speaker==='family.isolde'?'Hera Syndulla':'Vex’ahlia';
    return item.line===name&&item.eyebrow.endsWith(`· ${name}`)&&item.imageCount===1&&item.loaded&&item.framed===(isFellow?0:1)&&item.transparent===isFellow;
  });
}

async function exerciseUnseenTutorialLifecycle(page,step,{terminalAction='skip'}={}){
  const terminalStatus=terminalAction==='skip'?'dismissed':'completed';
  await navigate(page,'village');
  const objective=(await page.locator('[data-phase13-objective-card]').innerText()).replace(/\s+/g,' ');
  step('chapter-change-tutorial-is-contextually-offered',objective.includes('Chapter I complete')&&objective.includes('Waystone objective'),objective);
  await openTutorialLog(page);
  const unseenRow=page.locator(`[data-phase24g-tutorial-log-row="${contract.tutorialId}"]`),unseenRowCount=await unseenRow.count(),unseenReplay=unseenRow.locator('[data-phase13-tutorial-action="replay"]');
  step('post-resolution-tutorial-log-shows-one-unseen-disabled-row',unseenRowCount===1&&(await unseenRow.innerText()).includes('unseen')&&await unseenReplay.isDisabled(),{rowCount:unseenRowCount});
  await closeOverlay(page);await navigate(page,'village');

  const beforeOpen=await snapshot(page);await page.locator('[data-phase13-objective]').click();await page.waitForSelector(`[data-overlay] [data-phase13-tutorial="${contract.tutorialId}"]`);
  const afterOpen=await snapshot(page),tutorial=page.locator(`[data-overlay] [data-phase13-tutorial="${contract.tutorialId}"]`),attribution=(await tutorial.locator('.eyebrow').innerText()).trim();
  step('tutorial-open-is-one-seen-write-with-exact-tavi-attribution-and-no-reward',await tutorial.count()===1&&await tutorial.getAttribute('data-phase24g-tutorial')!==null&&attribution.toLowerCase()==='tutorial · tavi'&&afterOpen.revision===beforeOpen.revision+1&&afterOpen.source===contract.runtime.transactionSource&&tutorialStatusOnly(beforeOpen,afterOpen,'unseen','seen')&&stable(beforeOpen,afterOpen,ECONOMIC_KEYS),{attribution,before:tutorialStatus(beforeOpen),after:tutorialStatus(afterOpen),revisions:[beforeOpen.revision,afterOpen.revision],source:afterOpen.source});
  const terminalButton=page.locator(`[data-overlay] [data-phase13-tutorial-action="${terminalAction}"][data-phase13-tutorial-id="${contract.tutorialId}"]`),beforeTerminal=await snapshot(page);
  await terminalButton.click();await page.waitForTimeout(100);const afterTerminal=await snapshot(page);
  step('tutorial-terminal-status-is-one-persisted-reward-neutral-write',afterTerminal.revision===beforeTerminal.revision+1&&afterTerminal.source===contract.runtime.transactionSource&&tutorialStatusOnly(beforeTerminal,afterTerminal,'seen',terminalStatus)&&stable(beforeTerminal,afterTerminal,ECONOMIC_KEYS),{status:tutorialStatus(afterTerminal),revisions:[beforeTerminal.revision,afterTerminal.revision],source:afterTerminal.source});

  await openTutorialLog(page);
  const terminalRow=page.locator(`[data-phase24g-tutorial-log-row="${contract.tutorialId}"]`),terminalRowText=(await terminalRow.innerText()).replace(/\s+/g,' '),replayButton=terminalRow.locator('[data-phase13-tutorial-action="replay"]');
  step('tutorial-log-reflects-terminal-status-and-enables-replay',await terminalRow.count()===1&&terminalRowText.includes(terminalStatus)&&!await replayButton.isDisabled(),terminalRowText);
  const beforeReplay=await snapshot(page);await replayButton.click();await page.waitForSelector(`[data-overlay] [data-phase13-tutorial="${contract.tutorialId}"]`);const afterReplay=await snapshot(page);
  step('tutorial-replay-writes-only-existing-replay-count',afterReplay.revision===beforeReplay.revision+1&&afterReplay.source===contract.runtime.transactionSource&&tutorialReplayOnly(beforeReplay,afterReplay)&&stable(beforeReplay,afterReplay,ECONOMIC_KEYS),{status:tutorialStatus(afterReplay),replays:[tutorialReplays(beforeReplay),tutorialReplays(afterReplay)],revisions:[beforeReplay.revision,afterReplay.revision],source:afterReplay.source});
  const terminalControls=await page.evaluate(id=>{const root=document.querySelector(`[data-overlay] [data-phase13-tutorial="${id}"][data-phase24g-tutorial]`),buttons=[...root?.querySelectorAll('button')||[]];return{attribution:root?.querySelector('.eyebrow')?.textContent.trim()||'',complete:root?.querySelectorAll('[data-phase13-tutorial-action="complete"]').length||0,skip:root?.querySelectorAll('[data-phase13-tutorial-action="skip"]').length||0,close:buttons.filter(node=>node.hasAttribute('data-modal-close')&&node.textContent.trim()==='CLOSE').length,log:root?.querySelectorAll(`[data-phase13-tutorial-action="log"][data-phase13-tutorial-id="${id}"]`).length||0}},contract.tutorialId);
  step('terminal-replay-has-tavi-close-and-log-with-no-inert-terminal-actions',terminalControls.attribution==='Tutorial · Tavi'&&terminalControls.complete===0&&terminalControls.skip===0&&terminalControls.close===1&&terminalControls.log===1,terminalControls);
  const beforeClose=await snapshot(page);await page.getByRole('button',{name:'CLOSE',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[data-overlay]')===null);const afterClose=await snapshot(page);
  step('terminal-close-is-presentation-only',beforeClose.raw===afterClose.raw&&beforeClose.writes===afterClose.writes&&stable(beforeClose,afterClose,ECONOMIC_KEYS));
  await openTutorialLog(page);const beforeSecondReplay=await snapshot(page);await page.locator(`[data-phase24g-tutorial-log-row="${contract.tutorialId}"] [data-phase13-tutorial-action="replay"]`).click();await page.waitForSelector(`[data-overlay] [data-phase13-tutorial="${contract.tutorialId}"]`);const afterSecondReplay=await snapshot(page);
  step('second-replay-is-still-one-bookkeeping-write',afterSecondReplay.revision===beforeSecondReplay.revision+1&&afterSecondReplay.source===contract.runtime.transactionSource&&tutorialReplayOnly(beforeSecondReplay,afterSecondReplay)&&stable(beforeSecondReplay,afterSecondReplay,ECONOMIC_KEYS),{revisions:[beforeSecondReplay.revision,afterSecondReplay.revision],source:afterSecondReplay.source});
  const beforeLog=await snapshot(page);await page.locator(`[data-overlay] [data-phase13-tutorial-action="log"][data-phase13-tutorial-id="${contract.tutorialId}"]`).click();await page.waitForSelector(`[data-overlay] [data-phase24g-tutorial-log-row="${contract.tutorialId}"]`);const afterLog=await snapshot(page);
  step('tutorial-log-action-is-presentation-only',beforeLog.raw===afterLog.raw&&beforeLog.writes===afterLog.writes&&stable(beforeLog,afterLog,ECONOMIC_KEYS));
  await closeOverlay(page);
  return{terminalStatus,final:await snapshot(page)};
}

async function exerciseTerminalTutorialHistory(page,step,terminalStatus){
  await navigate(page,'village');
  const objective=(await page.locator('[data-phase13-objective-card]').innerText()).replace(/\s+/g,' '),beforeLog=await snapshot(page);
  step('terminal-tutorial-history-keeps-chronicle-objective',objective.includes('Chapter I complete')&&objective.includes('western plaza is open')&&objective.includes('Chronicle')&&tutorialStatus(beforeLog)===terminalStatus,{objective,status:tutorialStatus(beforeLog)});
  await openTutorialLog(page);
  const row=page.locator(`[data-phase24g-tutorial-log-row="${contract.tutorialId}"]`),rowText=(await row.innerText()).replace(/\s+/g,' '),replay=row.locator('[data-phase13-tutorial-action="replay"]');
  step('terminal-tutorial-log-shows-one-enabled-replay-row',await row.count()===1&&rowText.includes(terminalStatus)&&!await replay.isDisabled(),{rowCount:await row.count(),text:rowText});
  const beforeReplay=await snapshot(page);await replay.click();await page.waitForSelector(`[data-overlay] [data-phase13-tutorial="${contract.tutorialId}"]`);const afterReplay=await snapshot(page);
  step('terminal-history-replay-increments-only-its-count',afterReplay.revision===beforeReplay.revision+1&&afterReplay.source===contract.runtime.transactionSource&&tutorialReplayOnly(beforeReplay,afterReplay)&&stable(beforeReplay,afterReplay,ECONOMIC_KEYS),{status:tutorialStatus(afterReplay),replays:[tutorialReplays(beforeReplay),tutorialReplays(afterReplay)],revisions:[beforeReplay.revision,afterReplay.revision],source:afterReplay.source});
  const beforeClose=await snapshot(page);await page.getByRole('button',{name:'CLOSE',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[data-overlay]')===null);const afterClose=await snapshot(page);
  step('terminal-history-replay-close-is-presentation-only',beforeClose.raw===afterClose.raw&&beforeClose.writes===afterClose.writes&&stable(beforeClose,afterClose,ECONOMIC_KEYS));
  return{terminalStatus,final:afterClose};
}

async function matrixJourney(browser,baseURL,seedTools,profile,viewport,seedSlots){
  const prefix=`matrix-${profile.id}-${viewport.id}`,errors=[];
  const context=await seedTools.contextFor(browser,{seedSlots,viewport,now:contract.frozenNow});
  const page=await context.newPage();page.setDefaultTimeout(6000);
  page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));
  page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
  const step=async(id,operation)=>{try{const value=await operation();record(`${prefix}-${id}`,typeof value==='object'&&value!==null&&Object.hasOwn(value,'pass')?value.pass:value,typeof value==='object'&&value!==null&&Object.hasOwn(value,'pass')?value.detail:'')}catch(error){record(`${prefix}-${id}`,false,error.stack||error.message)}};
  try{
    const response=await page.goto(`${baseURL}/index.html?phase24g-profile=${profile.id}&viewport=${viewport.id}`,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForSelector('[data-phase24e-topbar]',{timeout:20000});await page.waitForTimeout(300);await settlePredecessorPresentations(page);
    await step('ordinary-non-qa-load',async()=>response?.ok()===true&&page.evaluate(()=>!location.search.includes('qa=1')&&window.__EVERSTEAD_RUNTIME__?.qa===undefined&&['__EVERSTEAD_PHASE_13_QA__','__EVERSTEAD_PHASE_24C2C_QA__','__EVERSTEAD_PHASE_24C2D_QA__'].every(name=>!Object.hasOwn(window,name))));
    await step('frozen-production-authorities',async()=>page.evaluate(({authorityGlobal,runtimeGlobal,profileGlobal,authorityId,runtimeId,profileId})=>{
      const values=[[authorityGlobal,authorityId],[runtimeGlobal,runtimeId],[profileGlobal,profileId]];
      return values.every(([name,id])=>{const descriptor=Object.getOwnPropertyDescriptor(window,name),value=window[name];return descriptor?.writable===false&&descriptor?.configurable===false&&value&&(value.authorityId===id||value.id===id)&&Object.isFrozen(value)})
    },{authorityGlobal:contract.authority.global,runtimeGlobal:contract.runtime.global,profileGlobal:contract.releaseProfile.global,authorityId:contract.authority.id,runtimeId:contract.runtime.id,profileId:contract.releaseProfile.id}));
    const baseline=await snapshot(page);
    await navigate(page,'more');
    const more=await page.evaluate(profileId=>({main:document.querySelectorAll('main[data-phase24f-more-owner="everstead.phase24f.more.schema14.v1"]').length,card:document.querySelectorAll(`main [data-phase24g-release-profile="${profileId}"]`).length,legacyPrivate:document.querySelectorAll('[data-phase17-reference]').length,profileText:document.querySelector('[data-phase24g-release-profile]')?.textContent.replace(/\s+/g,' ').trim()||'',h1:[...document.querySelectorAll('main h1')].map(node=>node.textContent.trim())}),contract.releaseProfile.id);
    await step('one-more-owner-and-successor-card',async()=>more.main===1&&more.card===1&&more.h1.join(',')==='More');
    await step('successor-copy-keeps-later-systems-excluded',async()=>more.profileText.includes('Chapter I is open in Everstead')&&more.profileText.includes('Later Book I chapters')&&more.profileText.includes('expanded Legacy')&&more.profileText.includes('facilities'));
    await step('full-private-phase17-surface-absent',async()=>more.legacyPrivate===0);
    await navigate(page,'village');
    const objective=page.locator('main [data-phase13-objective]');
    await step('waystone-objective-matches-profile-foundation',async()=>({pass:profile.id==='foundation-thin'?await objective.count()<=1:await objective.count()===1,detail:{profile:profile.id,count:await objective.count()}}));
    await step('visible-controls-meet-target-size',async()=>page.evaluate(minimum=>{const shown=node=>{const style=getComputedStyle(node),rect=node.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0};const controls=[...document.querySelectorAll('main button,.bottom-nav button,[role="button"]')].filter(shown),bad=controls.filter(node=>{const rect=node.getBoundingClientRect();return rect.width<minimum||rect.height<minimum});return controls.length>3&&bad.length===0},contract.minimumTargetPx));
    await step('mobile-natural-layout-has-no-horizontal-overflow',async()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await step('reduced-motion-is-active',async()=>page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches===true&&document.documentElement.getAttribute('data-everstead-reduced-motion')==='reduce'));
    await step('130-percent-text-remains-contained',async()=>{
      await page.addStyleTag({content:'html[data-phase24g-text-stress="true"]{font-size:130%!important}html[data-phase24g-text-stress="true"] body{font-size:130%!important}'});
      return page.evaluate(minimum=>{
        document.documentElement.dataset.phase24gTextStress='true';void document.body.offsetWidth;
        const shown=node=>{const style=getComputedStyle(node),rect=node.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0};
        const controls=[...document.querySelectorAll('main button,.bottom-nav button,[role="button"]')].filter(shown);
        const badTargets=controls.filter(node=>{const rect=node.getBoundingClientRect();return rect.width<minimum||rect.height<minimum||rect.left< -1||rect.right>innerWidth+1}).map(node=>{const rect=node.getBoundingClientRect();return{tag:node.tagName,selector:node.dataset.nav?`data-nav=${node.dataset.nav}`:node.dataset.phase13Objective!==undefined?'data-phase13-objective':node.getAttribute('aria-label')||'',text:node.textContent.trim().slice(0,80),width:rect.width,height:rect.height,left:rect.left,right:rect.right}});
        const clipped=controls.filter(node=>node.scrollWidth>node.clientWidth+1||node.scrollHeight>node.clientHeight+1).map(node=>({tag:node.tagName,selector:node.dataset.nav?`data-nav=${node.dataset.nav}`:node.dataset.phase13Objective!==undefined?'data-phase13-objective':node.getAttribute('aria-label')||'',text:node.textContent.trim().slice(0,80),scrollWidth:node.scrollWidth,clientWidth:node.clientWidth,scrollHeight:node.scrollHeight,clientHeight:node.clientHeight}));
        const documentOverflow=document.documentElement.scrollWidth>innerWidth+1;
        return{pass:!documentOverflow&&badTargets.length===0&&clipped.length===0,detail:{documentOverflow,badTargets,clipped,scrollWidth:document.documentElement.scrollWidth,innerWidth}};
      },contract.minimumTargetPx);
    });
    await navigate(page,'more');await navigate(page,'village');
    const final=await snapshot(page);
    await step('passive-route-round-trip-is-byte-and-write-neutral',async()=>baseline.raw===final.raw&&JSON.stringify(baseline.slots)===JSON.stringify(final.slots)&&baseline.writes===final.writes);
    await step('passive-route-preserves-resources-claims-receipts-and-journals',async()=>stable(baseline,final,['resources','claims','phase13Claims','legacy','phase13Legacy','facilities','campaign','story','storyV1','tutorials','phase2021Tutorials']));
    await step('no-new-phase24g-persisted-root',async()=>!final.forbiddenRoot);
    await step('legacy-v2-remains-inactive',async()=>!final.legacy||((final.legacy.activeTrackIds||[]).length===0&&(final.legacy.activeTierIds||[]).length===0));
    await step('injected-adapter-never-touches-native-storage',async()=>final.nativeAccesses.length===0);
  }catch(error){
    let diagnostic=null;
    try{diagnostic=await page.evaluate(key=>({title:document.title,body:document.body?.innerText?.replace(/\s+/g,' ').trim().slice(0,1200)||'',app:document.querySelector('#app')?.innerText?.replace(/\s+/g,' ').trim().slice(0,1200)||'',slots:window.__PHASE24D_BROWSER_HARNESS__?Object.fromEntries([...window.__PHASE24D_BROWSER_HARNESS__.slots.entries()].map(([name,value])=>[name,value===null?null:(name===key?value.slice(0,800):`bytes:${value.length}`)])):null}),contract.storageKey)}catch(diagnosticError){diagnostic={url:page.url(),closed:page.isClosed(),error:String(diagnosticError?.message||diagnosticError)}}
    record(`${prefix}-journey-fatal`,false,{error:error.stack||error.message,errors,diagnostic});
  }
  record(`${prefix}-zero-warning-error-console`,errors.length===0,errors);
  await context.close();
}

async function existingClearFlow(browser,baseURL,seedTools,profile,viewport,seedSlots,action){
  const prefix=`existing-clear-${profile.id}-${viewport.id}-${action}`,errors=[];
  const context=await seedTools.contextFor(browser,{seedSlots,viewport,now:contract.frozenNow});
  const page=await context.newPage();page.setDefaultTimeout(7000);
  page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));
  page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
  const step=async(id,pass,detail='')=>record(`${prefix}-${id}`,pass,detail);
  try{
    await page.goto(`${baseURL}/index.html?phase24g-flow=${profile.id}-${action}`,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForSelector('[data-phase24e-topbar]',{timeout:20000});await page.waitForTimeout(250);await settlePredecessorPresentations(page);
    const preparation=profile.id==='stage2-already-cleared'?await prepareHistoricalNoSpendFixture(page):null,beforeIntro=await snapshot(page),preResolutionTutorialStatus=tutorialStatus(beforeIntro),hasTerminalTutorialHistory=terminalTutorialStatus(preResolutionTutorialStatus);
    step('pre-resolution-tutorial-history-is-supported',hasTerminalTutorialHistory||preResolutionTutorialStatus==='unseen',{status:preResolutionTutorialStatus});
    await openTutorialLog(page);
    const beforeResolutionRow=page.locator(`[data-phase24g-tutorial-log-row="${contract.tutorialId}"]`),beforeResolutionLogCount=await beforeResolutionRow.count(),beforeResolutionLogText=beforeResolutionLogCount?(await beforeResolutionRow.innerText()).replace(/\s+/g,' '):'',beforeResolutionReplay=beforeResolutionRow.locator('[data-phase13-tutorial-action="replay"]'),afterPreResolutionLog=await snapshot(page);
    const preResolutionLogCorrect=hasTerminalTutorialHistory?beforeResolutionLogCount===1&&beforeResolutionLogText.includes(preResolutionTutorialStatus)&&!await beforeResolutionReplay.isDisabled():beforeResolutionLogCount===0;
    step('tutorial-log-respects-pre-resolution-history',preResolutionLogCorrect&&beforeIntro.raw===afterPreResolutionLog.raw&&beforeIntro.writes===afterPreResolutionLog.writes,{status:preResolutionTutorialStatus,rowCount:beforeResolutionLogCount,text:beforeResolutionLogText});
    await closeOverlay(page);
    await navigate(page,'village');
    const introObjective=(await page.locator('[data-phase13-objective-card]').innerText()).replace(/\s+/g,' '),beforeIntroQueue=await snapshot(page);
    await page.locator('[data-phase13-objective]').click();
    await page.waitForSelector(`[data-phase13-scene="${contract.scenes[0].id}"]`);
    const queued=await snapshot(page);
    step('historical-clear-directly-queues-intro-without-run-or-spend',introObjective.includes('Recall the Merchant Dispute')&&queued.campaign.runOrdinal===beforeIntroQueue.campaign.runOrdinal&&stable(beforeIntroQueue,queued,ECONOMIC_KEYS)&&queued.story.active===contract.scenes[0].id&&queued.revision===beforeIntroQueue.revision+1&&queued.source===contract.runtime.transactionSource,{objective:introObjective,before:beforeIntroQueue.campaign,after:queued.campaign,revisions:[beforeIntroQueue.revision,queued.revision],source:queued.source});
    if(profile.id==='stage2-already-cleared')step('fixture-is-underfunded-with-combat-support-removed-after-ordinary-preparation',beforeIntro.resources.gold<12000&&beforeIntro.combatSupport.assignedCompanions===0&&beforeIntro.combatSupport.equippedRelics===0&&preparation.stageTwo.runCount===1&&preparation.stageTwo.disabled&&preparation.stageTwo.runText.startsWith('NEED GOLD'),{resources:beforeIntro.resources,combatSupport:beforeIntro.combatSupport,preparation});
    const intro=await resolveScene(page,contract.scenes[0].id,action);
    step('intro-dialog-is-accessible-mobile-and-44px',intro.geometry.dialog&&intro.geometry.modal==='true'&&intro.geometry.labelled&&intro.geometry.activeInside&&intro.geometry.controls===4&&intro.geometry.bad.length===0&&!intro.geometry.overflow,intro.geometry);
    step('intro-speaker-art-obeys-approved-cutout-and-framed-fallbacks',presentationsValid(contract.scenes[0],intro.presentations,{full:action==='watch'}),intro.presentations);
    step('intro-resolution-is-one-reward-neutral-story-commit',intro.after.revision===intro.before.revision+1&&intro.after.source===contract.runtime.transactionSource&&intro.after.story.resolutions[contract.scenes[0].id]===(action==='skip'?'skipped':'watched')&&stable(intro.before,intro.after,ECONOMIC_KEYS),{revisions:[intro.before.revision,intro.after.revision],source:intro.after.source});
    await navigate(page,'village');
    const objectiveText=(await page.locator('[data-phase13-objective-card]').innerText()).replace(/\s+/g,' ');
    const beforeResolutionQueue=await snapshot(page);
    await page.locator('[data-phase13-objective]').click();
    await page.waitForSelector(`[data-phase13-scene="${contract.scenes[1].id}"]`);
    const queuedResolution=await snapshot(page);
    step('historical-clear-directly-queues-resolution-without-run-or-spend',objectiveText.includes('Record the Merchant Dispute')&&queuedResolution.campaign.runOrdinal===beforeResolutionQueue.campaign.runOrdinal&&stable(beforeResolutionQueue,queuedResolution,ECONOMIC_KEYS)&&queuedResolution.revision===beforeResolutionQueue.revision+1&&queuedResolution.source===contract.runtime.transactionSource,{objective:objectiveText,before:beforeResolutionQueue.campaign,after:queuedResolution.campaign,revisions:[beforeResolutionQueue.revision,queuedResolution.revision],source:queuedResolution.source});
    const resolution=await resolveScene(page,contract.scenes[1].id,action);
    step('resolution-speaker-art-obeys-approved-cutout-and-framed-fallbacks',presentationsValid(contract.scenes[1],resolution.presentations,{full:action==='watch'}),resolution.presentations);
    step('resolution-is-one-reward-neutral-story-commit',resolution.after.revision===resolution.before.revision+1&&resolution.after.source===contract.runtime.transactionSource&&resolution.after.story.resolutions[contract.scenes[1].id]===(action==='skip'?'skipped':'watched')&&stable(resolution.before,resolution.after,ECONOMIC_KEYS),{revisions:[resolution.before.revision,resolution.after.revision],source:resolution.after.source});
    await navigate(page,'village');
    const village=await page.evaluate(changeId=>{const main=document.querySelector(`main[data-phase24g-village-change="${changeId}"]`),badge=main?.querySelector('.phase24g-village-change'),style=badge?getComputedStyle(badge):null,rect=badge?.getBoundingClientRect();return{main:Boolean(main),villageClass:main?.classList.contains('village-screen'),badge:document.querySelectorAll('.phase24g-village-change').length,label:badge?.getAttribute('aria-label'),within:Boolean(rect&&rect.left>=-1&&rect.right<=innerWidth+1),motion:style?{animation:style.animationDuration,transition:style.transitionDuration}:null}},contract.visualChangeId);
    step('western-plaza-visual-is-derived-accessible-and-motion-safe',village.main&&village.villageClass&&village.badge===1&&village.label==='Western Plaza open'&&village.within&&village.motion?.animation.split(',').every(value=>Number.parseFloat(value)===0)&&village.motion?.transition.split(',').every(value=>Number.parseFloat(value)===0),village);
    step('tutorial-history-survives-merchant-resolution',tutorialStatus(resolution.after)===preResolutionTutorialStatus,{before:preResolutionTutorialStatus,after:tutorialStatus(resolution.after)});
    const tutorialJourney=hasTerminalTutorialHistory
      ?await exerciseTerminalTutorialHistory(page,step,preResolutionTutorialStatus)
      :await exerciseUnseenTutorialLifecycle(page,step,{terminalAction:action==='skip'?'skip':'complete'});
    const terminalStatus=tutorialJourney.terminalStatus;

    await navigate(page,'more');await page.locator('[data-phase13-chronicle]').click();await page.waitForTimeout(100);
    const chronicleText=(await page.locator('[data-overlay]').innerText()).replace(/\s+/g,' ');
    step('chronicle-preserves-both-new-scenes',contract.scenes.every(scene=>chronicleText.includes(scene.title)));
    const replay=page.locator(`[data-overlay] [data-phase13-story="replay"][data-phase13-scene-id="${contract.scenes[0].id}"]`);
    const beforeReplay=await snapshot(page);await replay.click();await page.waitForSelector(`[data-phase13-scene="${contract.scenes[0].id}"]`);const afterReplayOpen=await snapshot(page);
    step('chronicle-replay-opens-with-zero-writes-and-byte-neutrality',beforeReplay.raw===afterReplayOpen.raw&&beforeReplay.writes===afterReplayOpen.writes&&stable(beforeReplay,afterReplayOpen,ECONOMIC_KEYS));
    const beforeLog=await snapshot(page);await page.locator('[data-overlay] [data-phase13-story="log"]').click();await page.waitForSelector('[data-overlay] .phase-13-log-list');const afterLog=await snapshot(page);
    step('dialogue-log-is-five-lines-and-byte-neutral',await page.locator('[data-overlay] .phase-13-log-row').count()===5&&beforeLog.raw===afterLog.raw&&beforeLog.writes===afterLog.writes&&stable(beforeLog,afterLog,ECONOMIC_KEYS));
    await closeOverlay(page);
    const final=await snapshot(page);
    step('no-new-claims-legacy-v2-facilities-storyv1-or-phase24g-root',stable(beforeIntro,final,['claims','phase13Claims','legacy','phase13Legacy','facilities','storyV1'])&&!final.forbiddenRoot);
    step('native-storage-remains-untouched',final.nativeAccesses.length===0,final.nativeAccesses);

    const reloadContext=await seedTools.contextFor(browser,{seedSlots:final.slots,viewport,now:contract.frozenNow}),reloadPage=await reloadContext.newPage();
    reloadPage.setDefaultTimeout(7000);reloadPage.on('pageerror',error=>errors.push(`reload-pageerror:${error.stack||error.message}`));reloadPage.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`reload-console.${message.type()}:${message.text()}`)});
    await reloadPage.goto(`${baseURL}/index.html?phase24g-reload=${profile.id}-${action}`,{waitUntil:'domcontentloaded',timeout:30000});await reloadPage.waitForSelector('[data-phase24e-topbar]',{timeout:20000});await reloadPage.waitForTimeout(220);
    const reloaded=await snapshot(reloadPage);
    step('tutorial-terminal-status-and-replay-count-survive-reload',tutorialStatus(reloaded)===terminalStatus&&tutorialReplays(reloaded)===tutorialReplays(final)&&stable(final,reloaded,ECONOMIC_KEYS),{status:tutorialStatus(reloaded),replays:tutorialReplays(reloaded)});
    await reloadContext.close();
  }catch(error){
    let diagnostic=null;
    try{diagnostic=await page.evaluate(key=>({title:document.title,body:document.body?.innerText?.replace(/\s+/g,' ').trim().slice(0,1200)||'',app:document.querySelector('#app')?.innerText?.replace(/\s+/g,' ').trim().slice(0,1200)||'',slots:window.__PHASE24D_BROWSER_HARNESS__?Object.fromEntries([...window.__PHASE24D_BROWSER_HARNESS__.slots.entries()].map(([name,value])=>[name,value===null?null:(name===key?value.slice(0,800):`bytes:${value.length}`)])):null}),contract.storageKey)}catch{}
    record(`${prefix}-journey-fatal`,false,{error:error.stack||error.message,errors,diagnostic});
  }
  record(`${prefix}-zero-warning-error-console`,errors.length===0,errors);
  await context.close();
}

async function firstClearCommitFlow(browser,baseURL,seedTools,viewport,seedSlots,{id='rank2',expectRoadbound=true}={}){
  const prefix=`first-clear-${id}-${viewport.id}`,errors=[];
  const roadboundId='story.book1.rank2.roadbound-arrivals';
  const context=await seedTools.contextFor(browser,{seedSlots,viewport,now:contract.frozenNow});
  const page=await context.newPage();page.setDefaultTimeout(7000);
  page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));
  page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
  const step=(id,pass,detail='')=>record(`${prefix}-${id}`,pass,detail);
  try{
    await page.goto(`${baseURL}/index.html?phase24g-flow=first-clear`,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForSelector('[data-phase24e-topbar]',{timeout:20000});await page.waitForTimeout(250);await settlePredecessorPresentations(page);
    if(!expectRoadbound){
      const migration=await page.evaluate(({key,original})=>{const harness=window.__PHASE24D_BROWSER_HARNESS__,state=JSON.parse(harness.slots.get(key)),suffixes=['v0_1',...Array.from({length:13},(_,index)=>`v${index+1}`)],backups=suffixes.map(suffix=>({suffix,raw:harness.slots.get(`${key}__raw_backup_${suffix}`)??null}));return{schemaVersion:state.schemaVersion,rank:state.player?.rank,rankExp:state.player?.rankExp,cleared:[...(state.fellowCampaign?.clearedStageIds||[])],selectedStageId:state.fellowCampaign?.selectedStageId,source:state.saveMeta?.source,writes:harness.writes.length,rawBackupExact:backups[0]?.raw===original,checkpointCount:backups.filter(item=>item.raw!==null).length,missing:backups.filter(item=>item.raw===null).map(item=>item.suffix),privatePhase2021Absent:!Object.hasOwn(state,'phase2021')}} ,{key:contract.storageKey,original:seedSlots[contract.storageKey]});
      step('authentic-v01-migration-preserves-raw-and-all-checkpoints',migration.schemaVersion===14&&migration.rank===1&&migration.rankExp===0&&migration.cleared.includes('broken-roads-1')&&!migration.cleared.includes(contract.stageId)&&migration.rawBackupExact&&migration.checkpointCount===14&&migration.missing.length===0&&migration.writes>=15&&migration.privatePhase2021Absent,migration);
    }
    step('precondition-stage1-only',await page.evaluate(({key,stage,expectRoadbound})=>{const state=JSON.parse(window.__PHASE24D_BROWSER_HARNESS__.slots.get(key));return state.fellowCampaign.clearedStageIds.includes('broken-roads-1')&&!state.fellowCampaign.clearedStageIds.includes(stage)&&(expectRoadbound||state.player.rank===1&&state.player.rankExp===0)},{key:contract.storageKey,stage:contract.stageId,expectRoadbound}));
    let run=await openCampaignStage(page,contract.stageId);await run.click();await page.waitForSelector(`[data-phase13-scene="${contract.scenes[0].id}"]`);await resolveScene(page,contract.scenes[0].id,'skip');
    run=await openCampaignStage(page,contract.stageId);const beforeRun=await snapshot(page);await run.click();await page.waitForFunction(({key,stage})=>{const state=JSON.parse(window.__PHASE24D_BROWSER_HARNESS__.slots.get(key));return state.fellowCampaign.lastReceipt?.stageId===stage&&state.fellowCampaign.lastReceipt?.firstClear===true},{key:contract.storageKey,stage:contract.stageId});await page.waitForTimeout(120);
    const afterCommit=await snapshot(page),overlay=await page.evaluate(()=>({scene:document.querySelector('[data-phase13-scene]')?.getAttribute('data-phase13-scene')||null,text:document.querySelector('[data-overlay]')?.textContent.replace(/\s+/g,' ').trim()||''}));
    const roadboundPendingCount=afterCommit.story.pending.filter(id=>id===roadboundId).length,roadboundCondition=expectRoadbound?roadboundPendingCount===1:roadboundPendingCount===0&&afterCommit.resources.rank===1&&afterCommit.resources.rankExp===30;
    step('campaign-first-clear-commits-before-resolution-with-conditional-rank2-order',afterCommit.campaign.runOrdinal===beforeRun.campaign.runOrdinal+1&&afterCommit.campaign.lastReceipt?.stageId===contract.stageId&&afterCommit.campaign.lastReceipt?.firstClear===true&&afterCommit.story.active===contract.scenes[1].id&&roadboundCondition&&overlay.scene===null&&overlay.text.includes('Stage cleared'),{campaign:afterCommit.campaign,resources:afterCommit.resources,story:afterCommit.story,roadboundPendingCount,expectRoadbound,overlay});
    step('campaign-commit-is-the-only-economic-change-before-scene',!stable(beforeRun,afterCommit,['resources','campaign'])&&stable(beforeRun,afterCommit,['claims','phase13Claims','legacy','phase13Legacy','facilities','storyV1']));
    await closeOverlay(page);await page.waitForSelector(`[data-phase13-scene="${contract.scenes[1].id}"]`);const beforeResolution=await snapshot(page);const resolved=await resolveScene(page,contract.scenes[1].id,'watch');
    step('post-commit-resolution-is-reward-neutral',beforeResolution.raw===resolved.before.raw&&resolved.after.revision===resolved.before.revision+1&&resolved.after.source===contract.runtime.transactionSource&&stable(resolved.before,resolved.after,ECONOMIC_KEYS));
    step('committed-receipt-survives-story-resolution',JSON.stringify(resolved.after.campaign.lastReceipt)===JSON.stringify(afterCommit.campaign.lastReceipt));
    let rankOneTutorialJourney=null;
    if(expectRoadbound){
      step('rank2-arrival-promotes-immediately-after-merchant-resolution',resolved.after.story.active===roadboundId&&resolved.after.story.pending.filter(id=>id===roadboundId).length===0,{story:resolved.after.story});
      const beforeRoadboundPresentation=await snapshot(page);await page.waitForSelector(`[data-overlay] [data-phase13-scene="${roadboundId}"]`);const afterRoadboundPresentation=await snapshot(page);
      step('rank2-arrival-auto-presents-next-without-another-write',beforeRoadboundPresentation.raw===afterRoadboundPresentation.raw&&beforeRoadboundPresentation.writes===afterRoadboundPresentation.writes&&afterRoadboundPresentation.story.active===roadboundId);
      await closeOverlay(page);
    }else{
      step('rank1-first-clear-never-synthesizes-rank2-arrival',resolved.after.resources.rank===1&&resolved.after.resources.rankExp===30&&resolved.after.story.active!==roadboundId&&!resolved.after.story.pending.includes(roadboundId),{resources:resolved.after.resources,story:resolved.after.story});
      step('migrated-rank1-resolution-starts-unseen-tutorial-lifecycle',tutorialStatus(resolved.after)==='unseen',{status:tutorialStatus(resolved.after)});
      rankOneTutorialJourney=await exerciseUnseenTutorialLifecycle(page,step,{terminalAction:viewport.id==='phone-320x568'?'skip':'complete'});
      const rankOneFinal=rankOneTutorialJourney.final,reloadContext=await seedTools.contextFor(browser,{seedSlots:rankOneFinal.slots,viewport,now:contract.frozenNow}),reloadPage=await reloadContext.newPage();
      step('tutorial-writes-preserve-all-protected-checkpoints',protectedSlotsStable(resolved.after,rankOneFinal));
      reloadPage.setDefaultTimeout(7000);reloadPage.on('pageerror',error=>errors.push(`reload-pageerror:${error.stack||error.message}`));reloadPage.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`reload-console.${message.type()}:${message.text()}`)});
      await reloadPage.goto(`${baseURL}/index.html?phase24g-reload=migrated-rank1`,{waitUntil:'domcontentloaded',timeout:30000});await reloadPage.waitForSelector('[data-phase24e-topbar]',{timeout:20000});await reloadPage.waitForTimeout(450);
      const reloaded=await snapshot(reloadPage);
      step('tutorial-terminal-status-and-replay-count-survive-reload',tutorialStatus(reloaded)===rankOneTutorialJourney.terminalStatus&&tutorialReplays(reloaded)===tutorialReplays(rankOneFinal)&&stable(rankOneFinal,reloaded,ECONOMIC_KEYS),{status:tutorialStatus(reloaded),replays:tutorialReplays(reloaded)});
      await reloadContext.close();
    }
    const finalSnapshot=rankOneTutorialJourney?.final||resolved.after;
    step('no-native-storage-and-clean-schema',finalSnapshot.nativeAccesses.length===0&&!finalSnapshot.forbiddenRoot);
  }catch(error){
    let diagnostic=null;
    try{diagnostic=await page.evaluate(key=>({title:document.title,body:document.body?.innerText?.replace(/\s+/g,' ').trim().slice(0,1200)||'',app:document.querySelector('#app')?.innerText?.replace(/\s+/g,' ').trim().slice(0,1200)||'',slots:window.__PHASE24D_BROWSER_HARNESS__?Object.fromEntries([...window.__PHASE24D_BROWSER_HARNESS__.slots.entries()].map(([name,value])=>[name,value===null?null:(name===key?value.slice(0,800):`bytes:${value.length}`)])):null}),contract.storageKey)}catch(diagnosticError){diagnostic={url:page.url(),closed:page.isClosed(),error:String(diagnosticError?.message||diagnosticError)}}
    record(`${prefix}-journey-fatal`,false,{error:error.stack||error.message,errors,diagnostic});
  }
  record(`${prefix}-zero-warning-error-console`,errors.length===0,errors);
  await context.close();
}

async function classifierCompatibilityFlow(browser,baseURL,seedTools,viewport){
  const cases=[
    {id:'explicit-null-v01',slots:legacyRankOneStageOneSeed({explicitNullSchema:true}),migrates:true},
    {id:'malformed-json',slots:{[contract.storageKey]:'{'},migrates:false,copy:'invalid and was retained'},
    {id:'future-schema',slots:{[contract.storageKey]:JSON.stringify({schemaVersion:99})},migrates:false,copy:'This save uses schema 99'}
  ];
  for(const item of cases){
    const prefix=`classifier-${item.id}-${viewport.id}`,errors=[],context=await seedTools.contextFor(browser,{seedSlots:item.slots,viewport,now:contract.frozenNow}),page=await context.newPage();
    page.setDefaultTimeout(7000);page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
    try{
      await page.goto(`${baseURL}/index.html?phase24g-classifier=${item.id}`,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(300);
      if(item.migrates){
        await page.waitForSelector('[data-phase24e-topbar]',{timeout:20000});
        const proof=await page.evaluate(({key,original})=>{const harness=window.__PHASE24D_BROWSER_HARNESS__,state=JSON.parse(harness.slots.get(key)),suffixes=['v0_1',...Array.from({length:13},(_,index)=>`v${index+1}`)],backups=suffixes.map(suffix=>harness.slots.get(`${key}__raw_backup_${suffix}`)??null);return{schemaVersion:state.schemaVersion,rank:state.player?.rank,rankExp:state.player?.rankExp,cleared:[...(state.fellowCampaign?.clearedStageIds||[])],rawBackupExact:backups[0]===original,checkpointCount:backups.filter(Boolean).length,writes:harness.writes.length,phase24gCards:document.querySelectorAll('[data-phase24g-release-profile]').length}}, {key:contract.storageKey,original:item.slots[contract.storageKey]});
        record(`${prefix}-null-schema-migrates-with-exact-checkpoints`,proof.schemaVersion===14&&proof.rank===1&&proof.rankExp===0&&proof.cleared.includes('broken-roads-1')&&proof.rawBackupExact&&proof.checkpointCount===14&&proof.writes>=15&&proof.phase24gCards<=1,proof);
      }else{
        await page.waitForFunction(copy=>document.body?.innerText?.toLowerCase().includes(copy),item.copy.toLowerCase(),{timeout:20000});
        const proof=await page.evaluate(({key,original,copy})=>{const harness=window.__PHASE24D_BROWSER_HARNESS__,body=document.body?.innerText?.replace(/\s+/g,' ').trim()||'';return{body,raw:harness.slots.get(key)??null,writes:harness.writes.length,topbars:document.querySelectorAll('[data-phase24e-topbar]').length,phase24gCards:document.querySelectorAll('[data-phase24g-release-profile]').length,copyPresent:body.toLowerCase().includes(copy.toLowerCase()),original}}, {key:contract.storageKey,original:item.slots[contract.storageKey],copy:item.copy});
        record(`${prefix}-refuses-and-preserves-without-phase24g-card`,proof.raw===proof.original&&proof.writes===0&&proof.topbars===0&&proof.phase24gCards===0&&proof.copyPresent,proof);
      }
    }catch(error){
      let diagnostic=null;
      try{diagnostic=await page.evaluate(key=>({body:document.body?.innerText?.replace(/\s+/g,' ').trim().slice(0,1400)||'',app:document.querySelector('#app')?.innerText?.replace(/\s+/g,' ').trim().slice(0,1400)||'',slots:window.__PHASE24D_BROWSER_HARNESS__?Object.fromEntries([...window.__PHASE24D_BROWSER_HARNESS__.slots.entries()].map(([name,value])=>[name,value===null?null:(name===key?value.slice(0,900):`bytes:${value.length}`)])):null,writes:window.__PHASE24D_BROWSER_HARNESS__?.writes?.length??null}),contract.storageKey)}catch(diagnosticError){diagnostic={url:page.url(),closed:page.isClosed(),error:String(diagnosticError?.message||diagnosticError)}}
      record(`${prefix}-journey-fatal`,false,{error:error.stack||error.message,errors,diagnostic});
    }
    record(`${prefix}-zero-warning-error-console`,errors.length===0,errors);
    await context.close();
  }
}

const seedTools=await loadPredecessorSeedTools();
const predecessorServer=seedTools.staticServer();
const currentServer=staticServer();
let browser;
try{
  const predecessorURL=await seedTools.listen(predecessorServer),baseURL=await listen(currentServer);
  browser=await chromium.launch({headless:true});
  const focusedFlow=process.env.PHASE24G_FLOW||'',firstClearVariant=process.env.PHASE24G_FIRST_CLEAR||'both';
  const noPublicSeeds=focusedFlow==='classifier'||focusedFlow==='first-clear'&&firstClearVariant==='rank1';
  const seeds=noPublicSeeds?{}:await seedTools.seedProfiles(browser,predecessorURL);
  if(!noPublicSeeds){seeds['stage2-already-cleared']=historicalNoSpendSeed(seeds.established);seeds['foundation-thin']=seeds.thin}
  const profiles=process.env.PHASE24G_PROFILE?contract.profiles.filter(item=>item.id===process.env.PHASE24G_PROFILE):contract.profiles;
  const viewports=process.env.PHASE24G_VIEWPORT?contract.viewports.filter(item=>item.id===process.env.PHASE24G_VIEWPORT):contract.viewports;
  if(!focusedFlow||focusedFlow==='matrix')for(const profile of profiles)for(const viewport of viewports)await matrixJourney(browser,baseURL,seedTools,profile,viewport,seeds[profile.id]);
  if(focusedFlow==='existing-clear'){
    const profile=profiles[0]||contract.profiles.find(item=>item.id==='stage2-already-cleared');
    for(const viewport of viewports)await existingClearFlow(browser,baseURL,seedTools,profile,viewport,seeds[profile.id],process.env.PHASE24G_ACTION||'watch');
  }else if(focusedFlow==='classifier'){
    for(const viewport of viewports)await classifierCompatibilityFlow(browser,baseURL,seedTools,viewport);
  }else if(focusedFlow==='first-clear'){
    for(const viewport of viewports){
      if(firstClearVariant==='both'||firstClearVariant==='rank2')await firstClearCommitFlow(browser,baseURL,seedTools,viewport,seeds.stage1,{id:'rank2',expectRoadbound:true});
      if(firstClearVariant==='both'||firstClearVariant==='rank1')await firstClearCommitFlow(browser,baseURL,seedTools,viewport,legacyRankOneStageOneSeed(),{id:'migrated-rank1',expectRoadbound:false});
    }
  }else if(!process.env.PHASE24G_PROFILE&&!focusedFlow){
    for(const viewport of viewports){
      await existingClearFlow(browser,baseURL,seedTools,contract.profiles.find(item=>item.id==='established'),viewport,seeds.established,'skip');
      await existingClearFlow(browser,baseURL,seedTools,contract.profiles.find(item=>item.id==='stage2-already-cleared'),viewport,seeds['stage2-already-cleared'],'watch');
      await firstClearCommitFlow(browser,baseURL,seedTools,viewport,seeds.stage1,{id:'rank2',expectRoadbound:true});
      await firstClearCommitFlow(browser,baseURL,seedTools,viewport,legacyRankOneStageOneSeed(),{id:'migrated-rank1',expectRoadbound:false});
    }
    await classifierCompatibilityFlow(browser,baseURL,seedTools,viewports[0]);
  }
}finally{
  if(browser)await browser.close();
  for(const server of [predecessorServer,currentServer]){server.closeAllConnections?.();await new Promise(resolve=>server.close(resolve))}
}

const failed=rows.filter(item=>!item.pass);
for(const item of failed)console.error(`FAIL ${item.id}${item.detail?` · ${item.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
