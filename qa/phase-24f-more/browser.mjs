import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));
const phase24dContract=JSON.parse(fs.readFileSync(path.join(root,'qa/phase-24d-public-preview/contract.json'),'utf8'));
const rows=[];
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});

async function loadFrozenPublicSeedTools(){
  const original=fs.readFileSync(path.join(root,'qa/phase-24d-public-preview/browser.mjs'),'utf8');
  const executionStart=original.indexOf('const server=staticServer();');
  if(executionStart<0)throw new Error('Frozen Phase 24D browser source has an unknown shape');
  let source=original.slice(0,executionStart)
    .replace("import {chromium} from 'playwright';\n",'')
    .replace("const root=path.resolve(here,'../..');",`const root=${JSON.stringify(root)};`)
    .replace("const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));",`const contract=${JSON.stringify(phase24dContract)};`);
  source+='\nexport {staticServer,listen,contextFor,seedProfiles,dismiss,visible};\n';
  const temporaryDirectory=fs.mkdtempSync(path.join(os.tmpdir(),'everstead-phase24f-'));
  const temporaryModule=path.join(temporaryDirectory,'seed-tools.mjs');
  fs.writeFileSync(temporaryModule,source);
  try{return await import(`${pathToFileURL(temporaryModule).href}?v=${Date.now()}`)}
  finally{process.on('exit',()=>fs.rmSync(temporaryDirectory,{recursive:true,force:true}))}
}

async function pageSnapshot(page){
  return page.evaluate(storageKey=>{
    const harness=window.__PHASE24D_BROWSER_HARNESS__;
    const slots=Object.fromEntries([...harness.slots.entries()].sort(([a],[b])=>a.localeCompare(b)));
    const raw=slots[storageKey]??null,state=raw?JSON.parse(raw):null;
    const project=(value,path='',output={})=>{
      if(!value||typeof value!=='object')return output;
      for(const[key,item]of Object.entries(value)){
        const next=path?`${path}.${key}`:key;
        if(/receipt|journal|ledger/i.test(key))output[next]=item;
        else if(item&&typeof item==='object')project(item,next,output);
      }
      return output;
    };
    return{
      raw,
      slots,
      revision:state?.saveMeta?.revision??null,
      updatedAt:state?.saveMeta?.updatedAt??null,
      resources:{gold:state?.gold,gifts:state?.gifts,pendingGold:state?.pendingGold,prosperity:state?.prosperity,might:state?.might,playerRank:state?.player?.rank,playerRankExp:state?.player?.rankExp,focusFellow:state?.focusFellow},
      receiptsAndJournals:project(state),
      narrative:{chronicleUnread:state?.chronicleProgress?.unreadEntryIds??null,tutorialProgress:state?.tutorialProgress??null},
      writes:harness.writes.length,
      nativeAccesses:[...harness.nativeAccesses]
    };
  },contract.storageKey);
}

async function navigate(page,route){
  await page.locator(`.bottom-nav [data-nav="${route}"]`).click();
  await page.waitForTimeout(90);
}

async function settleFirstVisitPresentation(page,seedTools){
  await seedTools.dismiss(page);
  for(const route of ['village','oaths','fellows','adventure','more']){
    const button=page.locator(`.bottom-nav [data-nav="${route}"]`);
    if(await button.count()){await button.click();await page.waitForTimeout(75);await seedTools.dismiss(page)}
  }
  const fellowship=page.locator('.bottom-nav [data-nav="fellows"]');
  if(await fellowship.count()){
    await fellowship.click();await page.waitForTimeout(70);await seedTools.dismiss(page);
    for(const roster of ['fellows','family','companions','relics']){
      const button=page.locator(`[data-roster="${roster}"]`);
      if(await button.count()){await button.click();await page.waitForTimeout(70);await seedTools.dismiss(page)}
    }
  }
  await navigate(page,'more');
  const codex=page.locator('main [data-phase-11d-codex-open]');
  if(await codex.count()){
    await codex.click();await page.waitForTimeout(160);
    const collectionTutorial=page.locator('[data-phase24c2d-tutorial] [data-phase13-tutorial-action="skip"]');
    if(await collectionTutorial.count())await collectionTutorial.click();
    await page.waitForTimeout(80);await seedTools.dismiss(page);
  }
  const chronicle=page.locator('main [data-phase13-chronicle]');
  if(await chronicle.count()){await chronicle.click();await page.waitForTimeout(90);await seedTools.dismiss(page)}
  await navigate(page,'village');
  await seedTools.dismiss(page);
}

function snapshotsEqual(left,right){
  return left.raw===right.raw&&JSON.stringify(left.slots)===JSON.stringify(right.slots)&&left.writes===right.writes&&left.revision===right.revision&&left.updatedAt===right.updatedAt&&JSON.stringify(left.resources)===JSON.stringify(right.resources)&&JSON.stringify(left.receiptsAndJournals)===JSON.stringify(right.receiptsAndJournals)&&JSON.stringify(left.narrative)===JSON.stringify(right.narrative);
}

async function moreSurfaceSnapshot(page){
  return page.evaluate(({storageKey,ownerId})=>{
    const slots=window.__PHASE24D_BROWSER_HARNESS__.slots,raw=slots.get(storageKey),state=raw?JSON.parse(raw):null;
    const main=document.querySelector('main[data-phase24f-more-owner]');
    const classify=section=>{
      if(section.hasAttribute('data-player-profile'))return'player-profile';
      if(section.hasAttribute('data-phase-11d-codex-card'))return'codex';
      if(section.hasAttribute('data-phase-11g-migration-note'))return'roster-migration';
      if(section.hasAttribute('data-phase13-reference'))return'first-covenant';
      if(section.classList.contains('phase24-scaling-card'))return'scaling';
      if(section.hasAttribute('data-phase24d-release-profile'))return'release-profile';
      if(section.hasAttribute('data-campaign-efficiency-preview'))return'campaign-guidance';
      if(section.querySelector(':scope > h3')?.textContent.trim()==='Preferences')return'preferences';
      if(section.hasAttribute('data-save-recovery'))return'save-recovery';
      if(section.hasAttribute('data-previous-save'))return'previous-save';
      if(section.hasAttribute('data-protected-old-data'))return'protected-old-data';
      if(section.hasAttribute('data-save-health'))return'save-health';
      if(section.hasAttribute('data-migration-history'))return'migration-history';
      return`unknown:${section.querySelector('h1,h2,h3')?.textContent.trim()||section.className}`;
    };
    const sections=main?[...main.querySelectorAll(':scope > section')].map(classify):[];
    const expected=['player-profile','codex'];
    if((state?.saveMeta?.appliedMigrations||[]).some(item=>item?.id==='phase-11g-roster-progression'))expected.push('roster-migration');
    if(state?.phase13Progress)expected.push('first-covenant');
    expected.push('scaling','release-profile','campaign-guidance','preferences','save-recovery');
    if(main?.querySelector(':scope > [data-previous-save]'))expected.push('previous-save');
    if(main?.querySelector(':scope > [data-protected-old-data]'))expected.push('protected-old-data');
    expected.push('save-health','migration-history');
    const actionSelectors={
      player:'main [data-player-profile]',codex:'main [data-phase-11d-codex-open]',scaling:'main [data-phase24-scaling-open]',export:'main [data-act="export"]',choose:'main [data-save-recovery-action="choose"]',reset:'main [data-save-recovery-action="reset"]'
    };
    if(state?.phase13Progress)Object.assign(actionSelectors,{chronicle:'main [data-phase13-chronicle]',tutorials:'main [data-phase13-tutorial-log]',legacy:'main [data-phase13-legacy]',waystone:'main [data-phase13-objective]'});
    if(main?.querySelector(':scope > [data-previous-save]'))Object.assign(actionSelectors,{restore:'main > [data-previous-save] [data-save-recovery-action="restore"]',downloadPrevious:'main > [data-previous-save] [data-save-recovery-action="download-previous"]',forgetPrevious:'main > [data-previous-save] [data-save-recovery-action="forget"]'});
    if(main?.querySelector(':scope > [data-protected-old-data]'))Object.assign(actionSelectors,{downloadProtected:'main > [data-protected-old-data] [data-save-recovery-action="download-protected"]',forgetProtected:'main > [data-protected-old-data] [data-save-recovery-action="forget"]'});
    const actionCounts=Object.fromEntries(Object.entries(actionSelectors).map(([id,selector])=>[id,document.querySelectorAll(selector).length]));
    const focus=document.querySelector('main [data-setting="focus"]');
    const release=document.querySelector('main [data-phase24d-release-profile]');
    const health=document.querySelector('main [data-save-health]');
    const headingIds=[...document.querySelectorAll('main [id]')].map(node=>node.id).filter(Boolean);
    return{
      ownerCount:document.querySelectorAll('main[data-phase24f-more-owner]').length,
      mainCount:document.querySelectorAll('main').length,
      owner:main?.dataset.phase24fMoreOwner||null,
      headings:[...document.querySelectorAll('main h1')].map(node=>node.textContent.trim()),
      sections,expected,actionCounts,
      focusValue:focus?.value??null,expectedFocus:state?.focusFellow??null,
      releaseText:release?.textContent.replace(/\s+/g,' ').trim()||'',
      releaseIdentity:window.EVERSTEAD_PUBLIC_RELEASE_PROFILE?.id||null,
      releaseStatus:window.EVERSTEAD_PUBLIC_RELEASE_PROFILE?.status||null,
      healthState:health?.dataset.saveHealth||null,
      pageText:main?.textContent.replace(/\s+/g,' ').trim()||'',
      duplicateIds:headingIds.filter((id,index)=>headingIds.indexOf(id)!==index),
      privatePhase17:document.querySelectorAll('[data-phase17-reference]').length,
      rollbackRawPresent:slots.has(`${storageKey}__previous_installation_v1`),
      rollbackSurface:main?.querySelector(':scope > [data-previous-save]')?'previous-save':main?.querySelector(':scope > [data-protected-old-data]')?'protected-old-data':'none',
      html:main?.innerHTML||''
    };
  },{storageKey:contract.storageKey,ownerId:contract.owner.id});
}

async function modalRoundTrip(page,triggerSelector,expectedSelector){
  const before=await pageSnapshot(page);
  const trigger=page.locator(triggerSelector).first();
  if(await trigger.count()!==1)return{ok:false,reason:'trigger-cardinality'};
  await trigger.focus();
  await trigger.click();
  await page.waitForSelector(expectedSelector,{timeout:5000});
  await page.waitForTimeout(80);
  const open=await page.evaluate(({expectedSelector,triggerSelector})=>{
    const overlays=[...document.querySelectorAll('[data-overlay]')].filter(node=>{const style=getComputedStyle(node),rect=node.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0});
    const dialogs=overlays.flatMap(node=>[...node.querySelectorAll('[role="dialog"]')]);
    const dialog=dialogs[0],labelId=dialog?.getAttribute('aria-labelledby');
    return{overlayCount:overlays.length,dialogCount:dialogs.length,expectedCount:document.querySelectorAll(expectedSelector).length,role:dialog?.getAttribute('role'),modal:dialog?.getAttribute('aria-modal'),labelId,labelExists:Boolean(labelId&&document.getElementById(labelId)),dialogText:dialog?.textContent.replace(/\s+/g,' ').trim()||'',ownerCount:document.querySelectorAll('main[data-phase24f-more-owner]').length,triggerCount:document.querySelectorAll(triggerSelector).length};
  },{expectedSelector,triggerSelector});
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.querySelector('[data-overlay]')===null,{timeout:4000});
  await page.waitForTimeout(60);
  const focusReturned=await page.evaluate(selector=>document.activeElement?.matches?.(selector)===true,triggerSelector);
  const after=await pageSnapshot(page);
  const exactSafeRefusal=open.dialogText.includes('Fresh save unavailable')&&open.dialogText.includes('Named schema-13 and direct-origin validators must approve activation')&&open.dialogText.includes('Nothing was replaced');
  const recoveryBranchOk=!triggerSelector.includes('data-save-recovery-action="reset"')||/Start a fresh save|Previous save already protected|Protected old data already exists/.test(open.dialogText)||exactSafeRefusal;
  return{ok:open.overlayCount===1&&open.dialogCount===1&&open.expectedCount===1&&open.role==='dialog'&&open.modal==='true'&&open.labelExists&&open.ownerCount===1&&open.triggerCount===1&&recoveryBranchOk&&focusReturned&&snapshotsEqual(before,after),open,recoveryBranchOk,focusReturned,neutral:snapshotsEqual(before,after)};
}

async function runJourney(browser,baseURL,seedTools,profile,viewport,seedSlots){
  const prefix=`${profile.id}-${viewport.id}`;
  const errors=[];
  const context=await seedTools.contextFor(browser,{seedSlots,viewport});
  const page=await context.newPage();
  page.setDefaultTimeout(5000);
  page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));
  page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
  const step=async(id,operation)=>{try{record(`${prefix}-${id}`,await operation())}catch(error){record(`${prefix}-${id}`,false,error.stack||error.message)}};

  try{
    const response=await page.goto(`${baseURL}/index.html?phase24f-profile=${profile.id}&viewport=${viewport.id}`,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForSelector('[data-phase24e-topbar]',{timeout:20000});
    await page.waitForTimeout(250);
    await settleFirstVisitPresentation(page,seedTools);

    await step('ordinary-non-qa-schema14',async()=>page.evaluate(({schemaVersion,ownerId})=>{
      const qaGlobals=['__EVERSTEAD_QA__','__EVERSTEAD_PHASE_12_QA__','__EVERSTEAD_PHASE_13_QA__','__EVERSTEAD_PHASE_23_QA__','__EVERSTEAD_PHASE_24C2C_QA__','__EVERSTEAD_PHASE_24C2D_QA__'].filter(name=>Object.hasOwn(window,name));
      const raw=window.__PHASE24D_BROWSER_HARNESS__.slots.get('oathforge_new_world_proto_v01'),state=raw?JSON.parse(raw):null;
      return location.search.includes('qa=1')===false&&qaGlobals.length===0&&window.__EVERSTEAD_RUNTIME__?.qa===undefined&&state?.schemaVersion===schemaVersion&&ownerId==='everstead.phase24f.more.schema14.v1';
    },{schemaVersion:contract.schemaVersion,ownerId:contract.owner.id})&&response?.ok()===true);

    const baseline=await pageSnapshot(page);
    await navigate(page,'more');
    const first=await moreSurfaceSnapshot(page);

    await step('one-owned-more-main-and-heading',async()=>first.ownerCount===1&&first.mainCount===1&&first.owner===contract.owner.id&&first.headings.join(',')==='More');
    await step('deterministic-section-order-and-cardinality',async()=>JSON.stringify(first.sections)===JSON.stringify(first.expected)&&new Set(first.sections).size===first.sections.length);
    await step('all-public-action-selectors-are-unique',async()=>Object.values(first.actionCounts).every(value=>value===1));
    await step('release-profile-and-current-public-copy-survive',async()=>first.releaseIdentity==='everstead.release-profile.limited-public-preview.v1'&&first.releaseStatus==='active'&&first.releaseText.includes('Limited Public Preview')&&first.releaseText.includes('Everstead is growing in public')&&first.pageText.includes('Preferences, Campaign guidance, and verified Save & Recovery tools.')&&first.pageText.includes('Everstead Codex')&&first.pageText.includes('Scaling Authority'));
    await step('recovery-health-history-and-focus-survive',async()=>first.healthState==='verified'&&first.focusValue===first.expectedFocus&&first.sections.includes('save-recovery')&&first.sections.includes('migration-history'));
    await step('recovery-rollback-surface-matches-slot-topology',async()=>first.rollbackRawPresent?first.rollbackSurface!=='none':first.rollbackSurface==='none');
    await step('private-phase17-more-card-remains-excluded',async()=>first.privatePhase17===0&&!first.sections.some(item=>item.startsWith('unknown:')));
    await step('no-duplicate-heading-ids',async()=>first.duplicateIds.length===0);

    await step('advanced-save-details-report-schema14',async()=>{
      const summary=page.locator('main [data-save-health] summary');
      if(await summary.count()!==1)return false;
      await summary.click();
      const text=await page.locator('main [data-save-health] details').innerText();
      return text.includes('Schema 14')&&text.includes('pre-v2 through pre-v14');
    });

    for(const [id,trigger,expected,conditional] of [
      ['player-modal','main [data-player-profile]','[data-player-roadmap]',false],
      ['codex-modal','main [data-phase-11d-codex-open]','[data-phase-11d-codex]',false],
      ['scaling-modal','main [data-phase24-scaling-open]','[data-phase24-scaling-dialog]',false],
      ['chronicle-modal','main [data-phase13-chronicle]','[data-overlay] [role="dialog"]',true],
      ['tutorial-log-modal','main [data-phase13-tutorial-log]','[data-overlay] .phase-13-log-list',true],
      ['legacy-modal','main [data-phase13-legacy]','[data-overlay] [data-phase22b-legacy]',true],
      ['recovery-preview-modal','main [data-act="export"]','[data-overlay] [data-download-recovery]',false],
      ['fresh-save-cancel-modal','main [data-save-recovery-action="reset"]','#overlay [role="dialog"]',false]
    ])await step(`${id}-opens-once-cancels-and-is-neutral`,async()=>{
      const count=await page.locator(trigger).count();
      if(conditional&&count===0)return !first.sections.includes('first-covenant');
      const result=await modalRoundTrip(page,trigger,expected);
      if(!result.ok)throw new Error(JSON.stringify(result));
      return true;
    });

    await step('recovery-controls-have-valid-guidance',async()=>page.evaluate(()=>{
      const controls=[...document.querySelectorAll('main [data-save-recovery] button')];
      if(controls.length!==3)return false;
      return controls.every(button=>{
        const ids=(button.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
        return button.textContent.trim().length>0&&(button.dataset.saveRecoveryAction==='reset'||ids.length>=1&&ids.every(id=>document.getElementById(id)));
      });
    }));

    await step('hidden-recovery-file-input-is-labelled-and-offscreen',async()=>page.evaluate(()=>{
      const input=document.querySelector('main [data-save-recovery-file]');
      if(!input||input.type!=='file'||!input.getAttribute('aria-label'))return false;
      const rect=input.getBoundingClientRect(),style=getComputedStyle(input);
      return rect.width<=1&&rect.height<=1&&(style.position==='absolute'||style.position==='fixed'||style.display==='none'||style.visibility==='hidden');
    }));

    await step('all-visible-more-controls-have-44px-targets',async()=>page.evaluate(minimum=>{
      const shown=node=>{const style=getComputedStyle(node),rect=node.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0};
      const controls=[...document.querySelectorAll('main button,main select,main [role="button"],main summary')].filter(shown),bad=controls.filter(node=>{const rect=node.getBoundingClientRect();return rect.width<minimum||rect.height<minimum}).map(node=>{const rect=node.getBoundingClientRect();return{tag:node.tagName,text:node.textContent.trim().slice(0,60),width:rect.width,height:rect.height}});
      return{pass:controls.length>=7&&bad.length===0,count:controls.length,bad};
    },contract.minimumTargetPx).then(result=>{if(!result.pass)throw new Error(JSON.stringify(result));return true}));

    await step('more-cards-fit-horizontal-content-bounds',async()=>page.evaluate(()=>{
      const main=document.querySelector('main[data-phase24f-more-owner]'),mainRect=main?.getBoundingClientRect();
      if(!main||!mainRect)return false;
      return [...main.querySelectorAll(':scope > section')].every(section=>{const rect=section.getBoundingClientRect();return rect.width>0&&rect.left>=mainRect.left-1&&rect.right<=mainRect.right+1&&section.scrollWidth<=section.clientWidth+1});
    }));

    await step('more-has-real-scroll-and-final-card-clears-bottom-nav',async()=>{
      await page.evaluate(()=>scrollTo(0,0));
      const before=await page.evaluate(()=>({y:scrollY,max:document.scrollingElement.scrollHeight-innerHeight}));
      await page.locator('main [data-migration-history]').scrollIntoViewIfNeeded();
      await page.evaluate(()=>scrollTo(0,document.scrollingElement.scrollHeight));
      await page.waitForTimeout(90);
      const after=await page.evaluate(()=>{const last=document.querySelector('main [data-migration-history]')?.getBoundingClientRect(),nav=document.querySelector('.bottom-nav')?.getBoundingClientRect();return{y:scrollY,lastBottom:last?.bottom,navTop:nav?.top}});
      return before.max>100&&after.y>before.y&&Number.isFinite(after.lastBottom)&&Number.isFinite(after.navTop)&&after.lastBottom<=after.navTop+1;
    });

    await step('route-round-trip-resets-scroll-and-repeats-identical-more',async()=>{
      await navigate(page,'village');
      await navigate(page,'more');
      const second=await moreSurfaceSnapshot(page),y=await page.evaluate(()=>scrollY);
      return y===0&&JSON.stringify(second.sections)===JSON.stringify(first.sections)&&second.html===first.html&&second.ownerCount===1&&second.owner===contract.owner.id;
    });

    await step('reduced-motion-is-real-on-more-and-shell',async()=>page.evaluate(()=>{
      const zero=value=>String(value).split(',').every(item=>Number.parseFloat(item)===0),nodes=[document.querySelector('main[data-phase24f-more-owner]'),document.querySelector('.bottom-nav'),document.querySelector('[data-phase24e-topbar]'),...document.querySelectorAll('main[data-phase24f-more-owner] > section')].filter(Boolean);
      return matchMedia('(prefers-reduced-motion: reduce)').matches===true&&document.documentElement.getAttribute('data-everstead-reduced-motion')==='reduce'&&nodes.every(node=>{const style=getComputedStyle(node);return zero(style.animationDuration)&&zero(style.transitionDuration)});
    }));

    await step('130-percent-text-has-no-overflow-or-clipped-actions',async()=>{
      await page.addStyleTag({content:'html[data-phase24f-text-stress="true"]{font-size:130%!important}html[data-phase24f-text-stress="true"] body{font-size:130%!important}'});
      return page.evaluate(minimum=>{
        document.documentElement.dataset.phase24fTextStress='true';void document.body.offsetWidth;
        const shown=node=>{const style=getComputedStyle(node),rect=node.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0};
        const controls=[...document.querySelectorAll('main button,main select,main [role="button"],main summary')].filter(shown),labels=controls.filter(node=>node.tagName!=='SELECT'),badTargets=controls.filter(node=>{const rect=node.getBoundingClientRect();return rect.width<minimum||rect.height<minimum||rect.left< -1||rect.right>innerWidth+1}).map(node=>{const rect=node.getBoundingClientRect();return{tag:node.tagName,text:node.textContent.trim().slice(0,60),width:rect.width,height:rect.height,left:rect.left,right:rect.right}}),clipped=labels.filter(node=>node.scrollWidth>node.clientWidth+1||node.scrollHeight>node.clientHeight+1).map(node=>({tag:node.tagName,text:node.textContent.trim().slice(0,60),scrollWidth:node.scrollWidth,clientWidth:node.clientWidth,scrollHeight:node.scrollHeight,clientHeight:node.clientHeight})),documentOverflow=document.documentElement.scrollWidth>innerWidth+1;
        return{pass:!documentOverflow&&badTargets.length===0&&clipped.length===0,documentOverflow,badTargets,clipped,scrollWidth:document.documentElement.scrollWidth,innerWidth};
      },contract.minimumTargetPx).then(result=>{if(!result.pass)throw new Error(JSON.stringify(result));return true});
    });

    await step('mobile-no-horizontal-overflow',async()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));

    const finalSnapshot=await pageSnapshot(page);
    await step('more-render-route-modals-scroll-and-details-are-byte-neutral',async()=>baseline.raw===finalSnapshot.raw&&JSON.stringify(baseline.slots)===JSON.stringify(finalSnapshot.slots)&&baseline.writes===finalSnapshot.writes);
    await step('revision-updatedat-and-resources-are-neutral',async()=>baseline.revision===finalSnapshot.revision&&baseline.updatedAt===finalSnapshot.updatedAt&&JSON.stringify(baseline.resources)===JSON.stringify(finalSnapshot.resources));
    await step('receipts-journals-chronicle-and-tutorials-are-neutral',async()=>JSON.stringify(baseline.receiptsAndJournals)===JSON.stringify(finalSnapshot.receiptsAndJournals)&&JSON.stringify(baseline.narrative)===JSON.stringify(finalSnapshot.narrative));
    await step('injected-adapter-never-used-native-storage',async()=>finalSnapshot.nativeAccesses.length===0);
  }catch(error){
    const diagnostics=await page.evaluate(()=>({app:document.querySelector('#app')?.textContent?.trim().slice(0,1000)||'',overlay:document.querySelector('#overlay')?.textContent?.trim().slice(0,500)||'',owner:document.querySelector('main')?.dataset.phase24fMoreOwner||null,slots:[...window.__PHASE24D_BROWSER_HARNESS__?.slots?.keys?.()||[]]})).catch(()=>null);
    record(`${prefix}-journey-fatal`,false,{error:error.stack||error.message,errors,diagnostics});
  }
  record(`${prefix}-zero-warning-error-console`,errors.length===0,errors);
  await context.close();
}

const seedTools=await loadFrozenPublicSeedTools();
const server=seedTools.staticServer();
let browser;
try{
  const baseURL=await seedTools.listen(server);
  browser=await chromium.launch({headless:true});
  const profiles=process.env.PHASE24F_PROFILE?contract.profiles.filter(item=>item.id===process.env.PHASE24F_PROFILE):contract.profiles;
  const viewports=process.env.PHASE24F_VIEWPORT?contract.viewports.filter(item=>item.id===process.env.PHASE24F_VIEWPORT):contract.viewports;
  const seeds=process.env.PHASE24F_SKIP_SEED_BUILD==='1'&&profiles.length===1&&profiles[0]?.id==='fresh'?{fresh:null}:await seedTools.seedProfiles(browser,baseURL);
  for(const profile of profiles)for(const viewport of viewports)await runJourney(browser,baseURL,seedTools,profile,viewport,seeds[profile.id]);
}finally{
  if(browser)await browser.close();
  server.closeAllConnections?.();
  await new Promise(resolve=>server.close(resolve));
}

const failed=rows.filter(item=>!item.pass);
for(const item of failed)console.error(`FAIL ${item.id}${item.detail?` · ${item.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
