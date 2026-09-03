import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));
const rows=[];
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};

function staticServer(){
  return http.createServer((request,response)=>{
    const pathname=decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname);
    const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/,''),target=path.resolve(root,relative);
    if(target!==root&&!target.startsWith(root+path.sep)){response.writeHead(403).end('Forbidden');return}
    fs.readFile(target,(error,data)=>{
      if(error){response.writeHead(error.code==='ENOENT'?404:500).end(error.code==='ENOENT'?'Not found':'Server error');return}
      response.writeHead(200,{'content-type':mime[path.extname(target)]||'application/octet-stream','cache-control':'no-store'}).end(data);
    });
  });
}

async function listen(server){
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const address=server.address();
  return `http://127.0.0.1:${address.port}`;
}

async function contextFor(browser,{seedSlots=null,qa=false,viewport={width:390,height:844},now=contract.frozenNow}={}){
  const context=await browser.newContext({viewport,colorScheme:'dark',reducedMotion:'reduce'});
  const transparentPng=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64');
  await context.route('**/*',route=>route.request().resourceType()==='image'?route.fulfill({status:200,contentType:'image/png',body:transparentPng}):route.continue());
  await context.addInitScript(({seedSlots,qa,storageKey,frozenNow})=>{
    const slots=new Map(),writes=[],nativeAccesses=[],nativeStorage=window.localStorage;
    if(seedSlots)for(const[key,value]of Object.entries(seedSlots))if(value!==null)slots.set(key,value);
    for(const name of ['getItem','setItem','removeItem']){
      const original=Storage.prototype[name];
      Storage.prototype[name]=function(...args){if(this===nativeStorage)nativeAccesses.push(`${name}:${String(args[0])}`);return original.apply(this,args)};
    }
    const storage={
      getItem:key=>slots.get(String(key))??null,
      setItem:(key,value)=>{key=String(key);value=String(value);writes.push({op:'set',key});slots.set(key,value)},
      removeItem:key=>{key=String(key);writes.push({op:'remove',key});slots.delete(key)}
    };
    let saveIndex=0,transactionIndex=0;
    window.__EVERSTEAD_PERSISTENCE_TEST__={storage,operationLog:[]};
    const runtime={storage,clock:{now:()=>frozenNow,setTimeout:setTimeout.bind(window),clearTimeout:clearTimeout.bind(window)},random:()=>.731,confirm:()=>true,ids:{save:()=>`save-phase24d-${++saveIndex}`,transaction:()=>`tx-phase24d-${++transactionIndex}`}};
    if(qa)runtime.qa={allowDestructive:true,isolatedStorage:true};
    window.__EVERSTEAD_RUNTIME__=runtime;
    window.__PHASE24D_BROWSER_HARNESS__={slots,writes,nativeAccesses,qa};
  },{seedSlots,qa,storageKey:contract.storageKey,frozenNow:now});
  return context;
}

async function seedProfiles(browser,baseURL){
  console.log('SEEDS start');
  const qaContext=await contextFor(browser,{qa:true}),qaPage=await qaContext.newPage();
  await qaPage.goto(`${baseURL}/index.html?qa=1`,{waitUntil:'domcontentloaded',timeout:30000});
  await qaPage.waitForFunction(()=>window.__EVERSTEAD_PHASE_24C2C_QA__,null,{timeout:20000});
  const thin=await qaPage.evaluate(()=>{
    const phase24=window.__EVERSTEAD_PHASE_24C2C_QA__,migration=phase24.destructive.migrateSchema13('fresh'),reload=phase24.destructive.reload(),snapshot=phase24.read.snapshot();
    if(migration?.ok!==true||reload?.ok!==true||snapshot?.state?.schemaVersion!==14||snapshot.state.tutorialProgress)throw new Error('Canonical foundation-thin public-preview fixture could not be prepared');
    return Object.fromEntries(window.__PHASE24D_BROWSER_HARNESS__.slots.entries());
  });
  await qaContext.close();

  const publicSeedStartedAt=contract.frozenNow-15*86400000;
  let publicContext=await contextFor(browser,{now:publicSeedStartedAt}),publicPage=await publicContext.newPage();
  publicPage.setDefaultTimeout(5000);
  await publicPage.goto(`${baseURL}/index.html?seed=public-progression`,{waitUntil:'domcontentloaded',timeout:30000});
  await publicPage.waitForSelector('.bottom-nav',{timeout:20000});
  await publicPage.waitForTimeout(500);
  await dismiss(publicPage);
  const openRoad=async()=>{
    await dismiss(publicPage);
    await publicPage.locator('.bottom-nav [data-nav="adventure"]').click();
    await publicPage.waitForTimeout(80);
    await dismiss(publicPage);
    const campaign=publicPage.locator('[data-adventure="fellowCampaign"]');
    if(await campaign.getAttribute('aria-disabled')!=='true')await campaign.click();
    await publicPage.waitForTimeout(80);
    await dismiss(publicPage);
  };
  const clearNextStage=async ordinal=>{
    console.log(`SEED public Campaign stage ${ordinal}`);
    await openRoad();
    const stageId=`broken-roads-${ordinal}`,stage=publicPage.locator(`[data-campaign-stage="${stageId}"]`);
    if(!await stage.count())throw new Error(`Public Campaign stage ${stageId} is not rendered`);
    await stage.click();
    await publicPage.waitForTimeout(400);
    await dismiss(publicPage);
    let run=publicPage.locator(`[data-campaign-run="${stageId}"]`);
    if(!await run.count()||await run.isDisabled())throw new Error(`Public Campaign stage ${stageId} is not playable`);
    const before=await publicPage.evaluate(key=>JSON.parse(window.__PHASE24D_BROWSER_HARNESS__.slots.get(key)),contract.storageKey);
    let cleared=false;
    const allowedAttempts=ordinal===1?2:1;
    for(let attempt=0;attempt<allowedAttempts&&!cleared;attempt++){
      await run.click();
      await publicPage.waitForTimeout(500);
      await dismiss(publicPage);
      cleared=await publicPage.evaluate(({key,stageId})=>{const raw=window.__PHASE24D_BROWSER_HARNESS__.slots.get(key),state=raw?JSON.parse(raw):null;return state?.fellowCampaign?.clearedStageIds?.includes(stageId)===true},{key:contract.storageKey,stageId});
      if(!cleared){
        await openRoad();
        const retryStage=publicPage.locator(`[data-campaign-stage="${stageId}"]`);
        await retryStage.click();
        await publicPage.waitForTimeout(100);
        await dismiss(publicPage);
        run=publicPage.locator(`[data-campaign-run="${stageId}"]`);
      }
    }
    try{
      await publicPage.waitForFunction(({key,ordinal})=>{
        const raw=window.__PHASE24D_BROWSER_HARNESS__.slots.get(key),state=raw?JSON.parse(raw):null;
        return state?.fellowCampaign?.clearedStageIds?.includes(`broken-roads-${ordinal}`)===true;
      },{key:contract.storageKey,ordinal},{timeout:8000});
    }catch(error){
      const diagnostic=await publicPage.evaluate(key=>{const raw=window.__PHASE24D_BROWSER_HARNESS__.slots.get(key),state=raw?JSON.parse(raw):null,run=document.querySelector('[data-campaign-run]');return{blocked:document.body.textContent.includes('Save Needs Attention'),revision:state?.saveMeta?.revision,source:state?.saveMeta?.source,clears:state?.fellowCampaign?.clearedStageIds,rank:state?.player?.rank,rankExp:state?.player?.rankExp,runText:run?.textContent,runDisabled:run?.disabled,runAria:run?.getAttribute('aria-disabled'),overlay:document.querySelector('#overlay')?.textContent?.trim().slice(0,300)}} ,contract.storageKey);
      throw new Error(`Public Campaign stage ${stageId} did not clear: ${JSON.stringify(diagnostic)}; ${error.message}`);
    }
    await dismiss(publicPage);
    const after=await publicPage.evaluate(key=>JSON.parse(window.__PHASE24D_BROWSER_HARNESS__.slots.get(key)),contract.storageKey);
    if(after.saveMeta.revision<=before.saveMeta.revision)throw new Error(`Public Campaign stage ${stageId} did not commit`);
  };
  const logHabit=async count=>{
    await publicPage.locator('.bottom-nav [data-nav="oaths"]').click();
    await publicPage.waitForTimeout(60);
    await dismiss(publicPage);
    for(let index=0;index<count;index++){
      const habit=publicPage.locator('[data-oath="o4"]');
      if(!await habit.count()||await habit.isDisabled())throw new Error('The public repeatable Oath is unavailable');
      await habit.click();
      await publicPage.waitForTimeout(25);
      await dismiss(publicPage);
    }
  };
  const capture=async expected=>publicPage.evaluate(({key,expected})=>{
    const slots=Object.fromEntries(window.__PHASE24D_BROWSER_HARNESS__.slots.entries()),state=JSON.parse(slots[key]);
    const habitCount=state.oaths.find(item=>item.id==='o4')?.count??0,habitReady=expected.habits===undefined||habitCount>=expected.habits;
    const qaGlobals=['__EVERSTEAD_QA__','__EVERSTEAD_PHASE_12_QA__','__EVERSTEAD_PHASE_13_QA__','__EVERSTEAD_PHASE_23_QA__','__EVERSTEAD_PHASE_24C2C_QA__','__EVERSTEAD_PHASE_24C2D_QA__'].filter(name=>Object.hasOwn(window,name));
    const mapTotal=value=>Object.values(value||{}).reduce((sum,item)=>sum+(Number.isSafeInteger(item)?item:0),0),fellowQa=state.fellowProgressLedger?.qaCredits||{},companionQa=state.companionProgressLedger?.qaCredits||{};
    const qaCredits=mapTotal(fellowQa.fellowExp)+mapTotal(fellowQa.fellowShards)+(state.relicProgressLedger?.qaCredits?.relicStones||0)+mapTotal(companionQa.companionExp)+mapTotal(companionQa.companionShards)+(companionQa.masteryNominal||0);
    const privatePolicy=state.phase15FacilityFoundation?.syntheticPolicyEnabled===true||state.phase16Restaurant?.qaPolicyEnabled===true;
    const migrationSources=(state.saveMeta.appliedMigrations||[]).flatMap(item=>[item?.source,item?.migrationSource]).filter(value=>typeof value==='string'),fixtureLineage=migrationSources.some(value=>/qa|fixture/i.test(value));
    const transientKeys=[`${key}__staging`,`${key}__save_tool_journal_v1`],transientPresent=transientKeys.some(name=>Object.hasOwn(slots,name));
    if(state.schemaVersion!==14||/qa|fixture/i.test(state.saveMeta.source)||fixtureLineage||qaGlobals.length||window.__EVERSTEAD_RUNTIME__?.qa!==undefined||qaCredits!==0||privatePolicy||transientPresent||state.fellowCampaign.clearedStageIds.length<expected.clears||!habitReady)throw new Error(`Public progression fixture is incomplete or privately tainted: ${JSON.stringify({schemaVersion:state.schemaVersion,source:state.saveMeta.source,migrationSources,qaGlobals,qaCredits,privatePolicy,transientPresent,clears:state.fellowCampaign.clearedStageIds.length,habits:habitCount})}`);
    return slots;
  },{key:contract.storageKey,expected});

  await logHabit(3);
  for(let ordinal=1;ordinal<=2;ordinal++)await clearNextStage(ordinal);
  const established=await capture({clears:2,habits:3});
  await logHabit(9);
  for(let ordinal=3;ordinal<=4;ordinal++)await clearNextStage(ordinal);

  let banked=await publicPage.evaluate(()=>Object.fromEntries(window.__PHASE24D_BROWSER_HARNESS__.slots.entries()));
  for(let day=1;day<=14;day++){
    await publicContext.close();
    publicContext=await contextFor(browser,{seedSlots:banked,now:publicSeedStartedAt+day*86400000});
    publicPage=await publicContext.newPage();
    publicPage.setDefaultTimeout(5000);
    await publicPage.goto(`${baseURL}/index.html?seed=public-progression&returnDay=${day}`,{waitUntil:'domcontentloaded',timeout:30000});
    await publicPage.waitForSelector('.bottom-nav',{timeout:20000});
    await publicPage.waitForTimeout(350);
    const offlineClaim=publicPage.locator('[data-modal-act="collect-offline"]');
    if(await offlineClaim.isVisible().catch(()=>false))await offlineClaim.click();
    else{
      await dismiss(publicPage);
      const collect=publicPage.locator('[data-act="collect"]').first();
      if(await collect.count())await collect.click();
    }
    await publicPage.waitForTimeout(80);
    await dismiss(publicPage);
    banked=await publicPage.evaluate(()=>Object.fromEntries(window.__PHASE24D_BROWSER_HARNESS__.slots.entries()));
  }

  const stagePlayable=async ordinal=>{
    await openRoad();
    const stageId=`broken-roads-${ordinal}`,stage=publicPage.locator(`[data-campaign-stage="${stageId}"]`);
    if(!await stage.count())return false;
    await stage.click();
    await publicPage.waitForTimeout(100);
    await dismiss(publicPage);
    const run=publicPage.locator(`[data-campaign-run="${stageId}"]`);
    return await run.count()===1&&!await run.isDisabled()&&await run.getAttribute('aria-disabled')!=='true';
  };
  const replayFive=async ordinal=>{
    await openRoad();
    const stageId=`broken-roads-${ordinal}`;
    await publicPage.locator(`[data-campaign-stage="${stageId}"]`).click();
    await publicPage.waitForTimeout(80);
    await dismiss(publicPage);
    const opener=publicPage.locator(`[data-phase-11c-repeat-open="fellowCampaign:${stageId}"]`);
    if(!await opener.count()||await opener.isDisabled())throw new Error(`Public repeat training for ${stageId} is unavailable`);
    const before=await publicPage.evaluate(key=>JSON.parse(window.__PHASE24D_BROWSER_HARNESS__.slots.get(key)).saveMeta.revision,contract.storageKey);
    await opener.click();
    await publicPage.locator(`[data-phase-11c-repeat-count="5"][data-phase-11c-repeat-stage="${stageId}"]`).click();
    await publicPage.waitForSelector('[data-phase-11c-repeat-summary]',{timeout:12000});
    const after=await publicPage.evaluate(key=>JSON.parse(window.__PHASE24D_BROWSER_HARNESS__.slots.get(key)).saveMeta.revision,contract.storageKey);
    if(after<=before)throw new Error(`Public repeat training for ${stageId} did not commit`);
    await dismiss(publicPage);
  };
  for(let ordinal=5;ordinal<=9;ordinal++){
    let batches=0;
    while(!await stagePlayable(ordinal)&&batches<10){await replayFive(ordinal-1);batches++}
    if(!await stagePlayable(ordinal))throw new Error(`Public progression could not unlock playable Campaign stage ${ordinal}`);
    await clearNextStage(ordinal);
  }
  const high=await capture({clears:9});
  await publicContext.close();

  const profiles={established,thin,high};
  for(const[id,slots]of Object.entries(profiles)){
    const state=JSON.parse(slots[contract.storageKey]);
    console.log(`SEED ${id} ${JSON.stringify({schemaVersion:state.schemaVersion,revision:state.saveMeta?.revision,source:state.saveMeta?.source,rank:state.player?.rank,campaignClears:state.fellowCampaign?.clearedStageIds?.length,habitCount:state.oaths?.find(item=>item.id==='o4')?.count??0})}`);
  }
  console.log('SEEDS complete');
  return{fresh:null,...profiles};
}

async function visible(page,selector){return page.locator(selector).first().isVisible().catch(()=>false)}

async function dismiss(page){
  for(let attempt=0;attempt<20;attempt++){
    const result=await page.evaluate(()=>{
      const shown=node=>{const style=getComputedStyle(node),rect=node.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0};
      const overlay=[...document.querySelectorAll('[data-overlay],.overlay')].filter(shown).at(-1);
      if(!overlay)return'done';
      const selector='[data-modal-close],[data-phase17-close],[data-phase13-story="skip"],[data-phase13-tutorial-action="skip"],[data-phase15-tutorial-action="skip"],[data-phase16-tutorial-action="skip"]';
      const close=[...overlay.querySelectorAll(selector)].find(shown);
      if(close){close.click();return'click'}
      document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));return'escape';
    });
    if(result==='done')return true;
    await page.waitForTimeout(45);
  }
  return !await visible(page,'[data-overlay],.overlay');
}

async function runJourney(browser,baseURL,profile,viewport,seedSlots){
  const prefix=`${profile.id}-${viewport.id}`,errors=[],context=await contextFor(browser,{seedSlots,viewport}),page=await context.newPage();
  page.setDefaultTimeout(3000);
  console.log(`JOURNEY ${prefix} start`);
  page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));
  page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
  const step=async(id,operation)=>{try{record(`${prefix}-${id}`,await operation())}catch(error){record(`${prefix}-${id}`,false,error.stack||error.message)}};
  try{
    const response=await page.goto(`${baseURL}/index.html?profile=${profile.id}&viewport=${viewport.id}`,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForSelector('.bottom-nav',{timeout:20000});
    await page.waitForTimeout(250);
    await dismiss(page);

    await step('ordinary-non-qa-profile',async()=>page.evaluate(expected=>{
      const qaGlobals=['__EVERSTEAD_QA__','__EVERSTEAD_PHASE_12_QA__','__EVERSTEAD_PHASE_13_QA__','__EVERSTEAD_PHASE_23_QA__','__EVERSTEAD_PHASE_24C2C_QA__','__EVERSTEAD_PHASE_24C2D_QA__'].filter(name=>Object.hasOwn(window,name));
      return location.search.includes('qa=1')===false&&qaGlobals.length===0&&window.__EVERSTEAD_RUNTIME__?.qa===undefined&&window.EVERSTEAD_PUBLIC_RELEASE_PROFILE?.id===expected;
    },contract.profileId));
    await step('http-title-and-schema14',async()=>{
      const snapshot=await page.evaluate(storageKey=>{const raw=window.__PHASE24D_BROWSER_HARNESS__.slots.get(storageKey);return{raw,state:raw?JSON.parse(raw):null,title:document.title}},contract.storageKey);
      return response?.ok()===true&&snapshot.title==='Everstead · Limited Public Preview'&&snapshot.state?.schemaVersion===contract.schemaVersion;
    });

    const nav=async(id,heading)=>{
      await dismiss(page);await page.locator(`.bottom-nav [data-nav="${id}"]`).click();await page.waitForTimeout(90);await dismiss(page);
      return page.locator(`.bottom-nav [data-nav="${id}"].on`).count().then(async count=>count===1&&(heading===null||await page.locator('main h1').first().textContent()===heading));
    };
    await step('nav-village-selected',()=>nav('village',null));
    await step('player-modal-opens',async()=>{await page.locator('[data-player-profile]').first().click();await page.waitForTimeout(80);const ok=await visible(page,'[data-player-roadmap]');await dismiss(page);return ok});
    await step('building-modal-opens',async()=>{await page.locator('[data-building]').first().click();await page.waitForTimeout(80);const ok=await visible(page,'[data-overlay] .modal');await dismiss(page);return ok});

    await step('nav-oaths-selected',()=>nav('oaths','Oaths'));
    await step('oath-editor-modal-opens',async()=>{await page.locator('[data-act="add-oath"]').click();await page.waitForTimeout(80);const ok=await visible(page,'#oath-form');await dismiss(page);return ok});

    await step('nav-fellowship-selected',()=>nav('fellows','Fellowship'));
    await step('fellow-tab-and-profile',async()=>{await page.locator('[data-roster="fellows"]').click();await page.waitForTimeout(80);const cards=await page.locator('[data-fellow]').count();await page.locator('[data-fellow]').first().click();await page.waitForTimeout(80);const modal=await visible(page,'[data-overlay] .profile');await dismiss(page);return cards>0&&cards<=contract.expectedRosterCounts.fellows&&modal});
    await step('family-tab-20-and-profile',async()=>{await page.locator('[data-roster="family"]').click();await page.waitForTimeout(100);const cards=await page.locator('[data-family]').count();await page.locator('[data-family]').first().click();await page.waitForTimeout(80);const modal=await visible(page,'[data-overlay] .profile');await dismiss(page);return cards===contract.expectedRosterCounts.family&&modal});
    await step('companion-tab-20-replaces-family-and-profile',async()=>{await page.locator('[data-roster="companions"]').click();await page.waitForTimeout(120);const cards=await page.locator('[data-phase23-companion-card]').count(),families=await page.locator('[data-family]').count();await page.locator('[data-phase23-companion-card]').first().click();await page.waitForTimeout(80);const modal=await visible(page,'[data-phase23-companion-profile]');await dismiss(page);return cards===contract.expectedRosterCounts.companions&&families===0&&modal});

    await step('nav-adventure-selected',()=>nav('adventure',null));
    for(const route of contract.adventureRoutes)await step(`adventure-${route}-correct-panel`,async()=>{
      const button=page.locator(`[data-adventure="${route}"]`),locked=await button.getAttribute('aria-disabled')==='true';
      if(locked)return profile.id!=='high';
      await button.click();await page.waitForTimeout(100);await dismiss(page);
      return await page.locator(`[data-adventure="${route}"].on`).count()===1;
    });

    await step('nav-more-selected',()=>nav('more','More'));
    await step('public-preview-card-and-save-recovery-visible',async()=>visible(page,'[data-phase24d-release-profile]')&&visible(page,'[data-save-recovery]'));
    for(const [id,selector,expected] of [
      ['codex','[data-phase-11d-codex-open]','[data-phase-11d-codex]'],
      ['chronicle','[data-phase13-chronicle]','[data-overlay] .modal'],
      ['tutorials','[data-phase13-tutorial-log]','[data-overlay] .modal'],
      ['legacy','[data-phase13-legacy]','[data-overlay] .modal'],
      ['scaling','[data-phase24-scaling-open]','[data-phase24-scaling-dialog]']
    ])await step(`${id}-modal-opens`,async()=>{
      await dismiss(page);const trigger=page.locator(selector).first();if(!await trigger.count())return profile.id==='thin';
      await trigger.click();await page.waitForTimeout(100);const ok=await visible(page,expected);await dismiss(page);return ok;
    });
    await step('mobile-no-horizontal-overflow',async()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await step('injected-adapter-never-used-native-storage',async()=>page.evaluate(()=>window.__PHASE24D_BROWSER_HARNESS__.nativeAccesses.length===0));
  }catch(error){const diagnostics=await page.evaluate(()=>({app:document.querySelector('#app')?.textContent?.trim().slice(0,900)||'',overlay:document.querySelector('#overlay')?.textContent?.trim().slice(0,500)||'',body:document.body?.textContent?.trim().slice(0,1200)||''})).catch(()=>null);record(`${prefix}-journey-fatal`,false,{error:error.stack||error.message,errors,diagnostics})}
  record(`${prefix}-zero-warning-error-console`,errors.length===0,errors);
  await context.close();
  console.log(`JOURNEY ${prefix} complete`);
}

const server=staticServer();
let browser;
try{
  const baseURL=await listen(server);
  browser=await chromium.launch({headless:true});
  const seeds=await seedProfiles(browser,baseURL);
  const selectedProfiles=process.env.PHASE24D_PROFILE?contract.profiles.filter(profile=>profile.id===process.env.PHASE24D_PROFILE):contract.profiles;
  const selectedViewports=process.env.PHASE24D_VIEWPORT?contract.viewports.filter(viewport=>viewport.id===process.env.PHASE24D_VIEWPORT):contract.viewports;
  for(const profile of selectedProfiles)for(const viewport of selectedViewports)await runJourney(browser,baseURL,profile,viewport,seeds[profile.id]);
}finally{
  if(browser)await browser.close();
  server.closeAllConnections?.();
  await new Promise(resolve=>server.close(resolve));
}

const failed=rows.filter(item=>!item.pass),passed=rows.length-failed.length;
for(const item of failed)console.error(`FAIL ${item.id}${item.detail?` · ${item.detail}`:''}`);
console.log(`RESULT ${passed} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
