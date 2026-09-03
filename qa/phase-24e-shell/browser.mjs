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
  const temporaryDirectory=fs.mkdtempSync(path.join(os.tmpdir(),'everstead-phase24e-'));
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
      resources:{gold:state?.gold,gifts:state?.gifts,pendingGold:state?.pendingGold,prosperity:state?.prosperity,might:state?.might,playerRank:state?.player?.rank,playerRankExp:state?.player?.rankExp},
      receiptsAndJournals:project(state),
      writes:harness.writes.length,
      nativeAccesses:[...harness.nativeAccesses]
    };
  },contract.storageKey);
}

async function settleFirstVisitPresentation(page,dismiss){
  await dismiss(page);
  for(const route of contract.navigation){
    const button=page.locator(`.bottom-nav [data-nav="${route}"]`);
    if(await button.count()){await button.click();await page.waitForTimeout(70);await dismiss(page)}
  }
  const fellowship=page.locator('.bottom-nav [data-nav="fellows"]');
  if(await fellowship.count()){
    await fellowship.click();await page.waitForTimeout(70);await dismiss(page);
    for(const roster of contract.rosters){
      const button=page.locator(`[data-roster="${roster}"]`);
      if(await button.count()){await button.click();await page.waitForTimeout(70);await dismiss(page)}
    }
  }
  const village=page.locator('.bottom-nav [data-nav="village"]');
  await village.click();await page.waitForTimeout(90);await dismiss(page);
}

function zeroCssTime(value){
  return String(value).split(',').every(item=>Number.parseFloat(item)===0);
}

async function runJourney(browser,baseURL,seedTools,profile,viewport,seedSlots){
  const prefix=`${profile.id}-${viewport.id}`;
  const errors=[];
  const context=await seedTools.contextFor(browser,{seedSlots,viewport});
  const page=await context.newPage();
  page.setDefaultTimeout(4000);
  page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));
  page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
  const step=async(id,operation)=>{try{record(`${prefix}-${id}`,await operation())}catch(error){record(`${prefix}-${id}`,false,error.stack||error.message)}};

  try{
    const response=await page.goto(`${baseURL}/index.html?phase24e-profile=${profile.id}&viewport=${viewport.id}`,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForSelector('[data-phase24e-topbar]',{timeout:20000});
    await page.waitForTimeout(200);
    await settleFirstVisitPresentation(page,seedTools.dismiss);

    await step('ordinary-non-qa-schema14',async()=>page.evaluate(({schemaVersion,controllerId})=>{
      const qaGlobals=['__EVERSTEAD_QA__','__EVERSTEAD_PHASE_12_QA__','__EVERSTEAD_PHASE_13_QA__','__EVERSTEAD_PHASE_23_QA__','__EVERSTEAD_PHASE_24C2C_QA__','__EVERSTEAD_PHASE_24C2D_QA__'].filter(name=>Object.hasOwn(window,name));
      const raw=window.__PHASE24D_BROWSER_HARNESS__.slots.get('oathforge_new_world_proto_v01'),state=raw?JSON.parse(raw):null,controller=window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER;
      return location.search.includes('qa=1')===false&&qaGlobals.length===0&&window.__EVERSTEAD_RUNTIME__?.qa===undefined&&state?.schemaVersion===schemaVersion&&controller?.id===controllerId&&controller?.version===1&&controller?.schemaVersion===schemaVersion;
    },{schemaVersion:contract.schemaVersion,controllerId:contract.controller.id})&&response?.ok()===true);

    await step('diagnostics-are-frozen-snapshots',async()=>page.evaluate(()=>{
      const controller=window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER,a=controller.diagnostics(),b=controller.diagnostics();
      const descriptor=Object.getOwnPropertyDescriptor(window,'EVERSTEAD_PHASE24E_SHELL_CONTROLLER');
      return Object.isFrozen(controller)&&Object.isFrozen(controller.views)&&Object.isFrozen(controller.rosters)&&Object.isFrozen(a)&&Object.isFrozen(b)&&a!==b&&descriptor?.writable===false&&descriptor?.configurable===false&&descriptor?.enumerable===false&&descriptor.value===controller&&['version','id','schemaVersion','renderIdentity','navigationCalls','rosterSelectionCalls','topbarRenders'].every(key=>Object.hasOwn(a,key));
    }));

    await step('invalid-controller-inputs-are-zero-side-effect',async()=>page.evaluate(()=>{
      const controller=window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER,before=controller.diagnostics(),calls={stop:0,rotate:0,complete:0,reset:0};
      const callbacks={stopActivity:()=>calls.stop++,rotateVillage:()=>calls.rotate++,complete:()=>{calls.complete++;return{ok:true}},resetScroll:()=>calls.reset++};
      const badSchema={schemaVersion:13,ui:{view:'village',roster:'fellows'}},goodSchema={schemaVersion:14,ui:{view:'village',roster:'fellows'}},snapshots=[JSON.stringify(badSchema),JSON.stringify(goodSchema)];
      const results=[controller.navigate({state:badSchema,view:'oaths',...callbacks}),controller.navigate({state:goodSchema,view:'unknown',...callbacks}),controller.selectRoster({state:badSchema,roster:'family',...callbacks}),controller.selectRoster({state:goodSchema,roster:'unknown',...callbacks})],after=controller.diagnostics();
      return results.every(value=>value===false)&&JSON.stringify(badSchema)===snapshots[0]&&JSON.stringify(goodSchema)===snapshots[1]&&Object.values(calls).every(value=>value===0)&&after.navigationCalls===before.navigationCalls&&after.rosterSelectionCalls===before.rosterSelectionCalls&&after.topbarRenders===before.topbarRenders&&after.renderIdentity===before.renderIdentity;
    }));

    await step('one-owned-visible-everstead-topbar',async()=>page.evaluate(controllerId=>{
      const bars=[...document.querySelectorAll('[data-phase24e-topbar]')],bar=bars[0],brand=bar?.querySelector('[data-phase24e-brand]'),resources=bar?.querySelector('[data-phase24e-resources]'),shown=node=>{if(!node)return false;const rect=node.getBoundingClientRect(),style=getComputedStyle(node);return rect.width>0&&rect.height>0&&style.display!=='none'&&style.visibility!=='hidden'};
      const gifts=resources?.querySelector('[data-resource="gifts"] b'),gold=resources?.querySelector('[data-resource="gold"] b');
      return bars.length===1&&bar.dataset.phase24eShellOwner===controllerId&&shown(bar)&&shown(brand)&&shown(resources)&&brand.textContent.includes('EVERSTEAD')&&/R\s*\d/i.test(resources.textContent)&&shown(gifts)&&shown(gold)&&gifts.textContent.trim().length>0&&gold.textContent.trim().length>0;
    },contract.controller.id));

    await step('topbar-descendants-do-not-overlap-or-escape',async()=>page.evaluate(()=>{
      const brand=document.querySelector('[data-phase24e-brand] b'),resources=document.querySelector('[data-phase24e-resources]'),collect=resources?.querySelector('[data-act="collect"]'),gifts=resources?.querySelector('[data-resource="gifts"]'),gold=resources?.querySelector('[data-resource="gold"]'),rank=resources?.querySelector('[data-player-profile]'),values=[gifts?.querySelector('b'),gold?.querySelector('b')],nodes=[brand,resources,collect,gifts,gold,rank,...values];
      if(nodes.some(node=>!node))return false;
      const rects=nodes.map(node=>node.getBoundingClientRect()),interactive=[brand,collect,gifts,gold,rank].map(node=>node.getBoundingClientRect()),overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)),pairwise=interactive.every((left,index)=>interactive.slice(index+1).every(right=>overlap(left,right)<=1)),valuesFit=values.every(node=>node.scrollWidth<=node.clientWidth+1&&node.scrollHeight<=node.clientHeight+1&&node.textContent.trim().length>0);
      return pairwise&&valuesFit&&rects.every(rect=>rect.width>0&&rect.height>0&&rect.left>=-1&&rect.right<=innerWidth+1&&rect.top>=-1&&rect.bottom<=innerHeight+1);
    }));

    await step('topbar-action-is-semantic-and-44px',async()=>page.evaluate(minimum=>{
      const button=document.querySelector('[data-phase24e-topbar] [data-act="collect"]');if(!button||button.tagName!=='BUTTON'||button.disabled)return false;
      const rect=button.getBoundingClientRect();return rect.width>=minimum&&rect.height>=minimum&&button.getAttribute('aria-label')?.length>0;
    },contract.minimumTargetPx));

    const baseline=await pageSnapshot(page);
    const initialDiagnostics=await page.evaluate(()=>window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER.diagnostics());
    let expectedNavigationCalls=initialDiagnostics.navigationCalls;
    let expectedTopbarRenders=initialDiagnostics.topbarRenders;
    const renderSequence=value=>Number(String(value).match(/\.render-(\d+)$/)?.[1]);

    for(const route of contract.navigation)await step(`single-nav-${route}`,async()=>{
      const before=await page.evaluate(()=>window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER.diagnostics());
      await page.locator(`.bottom-nav [data-nav="${route}"]`).click();await page.waitForTimeout(75);await seedTools.dismiss(page);
      const result=await page.evaluate(route=>{
        const diagnostics=window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER.diagnostics(),selected=[...document.querySelectorAll('.bottom-nav [data-nav].on')],current=[...document.querySelectorAll('.bottom-nav [data-nav][aria-current="page"]')];
        return{diagnostics,selected:selected.map(node=>node.dataset.nav),current:current.map(node=>node.dataset.nav),main:document.querySelector('main')?.textContent?.trim().slice(0,80)||''};
      },route);
      expectedNavigationCalls+=1;expectedTopbarRenders+=1;
      const pass=before.navigationCalls+1===result.diagnostics.navigationCalls&&result.diagnostics.navigationCalls===expectedNavigationCalls&&before.topbarRenders+1===result.diagnostics.topbarRenders&&result.diagnostics.topbarRenders===expectedTopbarRenders&&renderSequence(result.diagnostics.renderIdentity)===renderSequence(before.renderIdentity)+1&&result.selected.join(',')===route&&result.current.join(',')===route&&result.main.length>0;
      if(!pass)throw new Error(JSON.stringify({route,before,result,expectedNavigationCalls,expectedTopbarRenders}));
      return pass;
    });

    await page.locator('.bottom-nav [data-nav="fellows"]').click();await page.waitForTimeout(75);await seedTools.dismiss(page);
    expectedNavigationCalls+=1;expectedTopbarRenders+=1;
    const beforeRosters=await page.evaluate(()=>window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER.diagnostics());
    let expectedRosterCalls=beforeRosters.rosterSelectionCalls;
    const rosterIdentity={};
    const rosterSelectors={fellows:'[data-fellow]',family:'[data-family]',companions:'[data-phase23-companion-card]',relics:'[data-relic-card]'};
    for(const roster of contract.rosters)await step(`single-roster-${roster}`,async()=>{
      const before=await page.evaluate(()=>window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER.diagnostics());
      await page.locator(`[data-roster="${roster}"]`).click();await page.waitForTimeout(90);await seedTools.dismiss(page);
      const result=await page.evaluate(({roster,selectors,minimum})=>{
        const diagnostics=window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER.diagnostics(),selected=[...document.querySelectorAll('[data-roster].on,[data-roster][aria-selected="true"]')].filter((node,index,list)=>list.indexOf(node)===index),ids=[...document.querySelectorAll(selectors[roster])].map(node=>node.getAttribute(roster==='companions'?'data-phase23-companion-card':roster==='relics'?'data-relic-card':roster==='family'?'data-family':'data-fellow'));
        const stale=Object.entries(selectors).filter(([kind])=>kind!==roster).reduce((sum,[,selector])=>sum+document.querySelectorAll(selector).length,0);
        const tabs=[...document.querySelectorAll('[data-roster]')],targets=tabs.every(node=>{const rect=node.getBoundingClientRect();return rect.width>=minimum&&rect.height>=minimum}),labels=Object.fromEntries(tabs.map(node=>[node.dataset.roster,node.textContent.replace(/\s+/g,' ').trim()]));
        return{diagnostics,selected:selected.map(node=>node.dataset.roster),ids,stale,targets,labels,owner:document.querySelector('main')?.dataset.phase24eRosterOwner||null};
      },{roster,selectors:rosterSelectors,minimum:contract.minimumTargetPx});
      expectedRosterCalls+=1;expectedTopbarRenders+=1;
      rosterIdentity[roster]=result.ids;
      const expectedCount=contract.expectedRosterCounts[roster];
      const cardinality=expectedCount===undefined?result.ids.length>0:result.ids.length===expectedCount;
      const labelTruth=/^Fellows · \d+\/18$/.test(result.labels.fellows)&&result.labels.family==='Family · 20'&&result.labels.companions==='Companions · 20'&&result.labels.relics==='Relics · 6';
      const pass=before.rosterSelectionCalls+1===result.diagnostics.rosterSelectionCalls&&result.diagnostics.rosterSelectionCalls===expectedRosterCalls&&before.topbarRenders+1===result.diagnostics.topbarRenders&&result.diagnostics.topbarRenders===expectedTopbarRenders&&renderSequence(result.diagnostics.renderIdentity)===renderSequence(before.renderIdentity)+1&&result.selected.length>=1&&result.selected.every(item=>item===roster)&&result.ids.length===new Set(result.ids).size&&cardinality&&result.stale===0&&result.targets&&labelTruth&&result.owner===contract.controller.id;
      if(!pass)throw new Error(JSON.stringify({roster,before,result,expectedRosterCalls,expectedTopbarRenders,expectedCount}));
      return pass;
    });

    await step('roster-order-survives-round-trip',async()=>{
      await page.locator('[data-roster="fellows"]').click();await page.waitForTimeout(80);
      const result=await page.evaluate(()=>({ids:[...document.querySelectorAll('[data-fellow]')].map(node=>node.dataset.fellow),diagnostics:window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER.diagnostics()}));
      expectedRosterCalls+=1;expectedTopbarRenders+=1;
      return JSON.stringify(result.ids)===JSON.stringify(rosterIdentity.fellows)&&result.diagnostics.rosterSelectionCalls===expectedRosterCalls&&result.diagnostics.topbarRenders===expectedTopbarRenders;
    });

    await step('relic-render-restores-current-schema-behavior',async()=>page.evaluate(({storageKey,schemaVersion})=>{
      const raw=window.__PHASE24D_BROWSER_HARNESS__.slots.get(storageKey),state=raw?JSON.parse(raw):null,controller=window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER;
      return state?.schemaVersion===schemaVersion&&controller.schemaVersion===schemaVersion&&document.querySelector('main')?.dataset.phase24eRosterOwner===controller.id&&document.querySelectorAll('[data-fellow]').length===18;
    },{storageKey:contract.storageKey,schemaVersion:contract.schemaVersion}));

    await step('page-has-real-vertical-scroll',async()=>{
      await page.evaluate(()=>scrollTo(0,0));
      const before=await page.evaluate(()=>({y:scrollY,max:document.scrollingElement.scrollHeight-innerHeight}));
      await page.evaluate(()=>scrollTo({top:Math.min(260,document.scrollingElement.scrollHeight-innerHeight),behavior:'instant'}));await page.waitForTimeout(80);
      const after=await page.evaluate(()=>scrollY);
      return before.max>80&&after>before.y;
    });

    await step('route-change-resets-real-scroll',async()=>{
      const before=await page.evaluate(()=>({y:scrollY,diagnostics:window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER.diagnostics()}));
      if(before.y<1)return false;
      await page.locator('.bottom-nav [data-nav="more"]').click();await page.waitForTimeout(80);await seedTools.dismiss(page);
      const after=await page.evaluate(()=>({y:scrollY,diagnostics:window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER.diagnostics()}));
      expectedNavigationCalls+=1;expectedTopbarRenders+=1;
      const pass=after.y===0&&after.diagnostics.navigationCalls===expectedNavigationCalls&&after.diagnostics.topbarRenders===expectedTopbarRenders&&renderSequence(after.diagnostics.renderIdentity)===renderSequence(before.diagnostics.renderIdentity)+1;
      if(!pass)throw new Error(JSON.stringify({before,after,expectedNavigationCalls,expectedTopbarRenders}));
      return true;
    });

    await step('all-shell-actions-have-44px-targets',async()=>page.evaluate(minimum=>{
      const controls=[...document.querySelectorAll('.bottom-nav [data-nav],[data-roster],[data-phase24e-topbar] button')].filter(node=>{const style=getComputedStyle(node);return style.display!=='none'&&style.visibility!=='hidden'}),bad=controls.filter(node=>{const rect=node.getBoundingClientRect();return rect.width<minimum||rect.height<minimum});return controls.length>=7&&bad.length===0;
    },contract.minimumTargetPx));

    await step('reduced-motion-is-real-and-equivalent',async()=>page.evaluate(()=>{
      const nodes=[document.querySelector('[data-phase24e-topbar]'),document.querySelector('.bottom-nav'),document.querySelector('main')].filter(Boolean),zero=value=>String(value).split(',').every(item=>Number.parseFloat(item)===0);
      return matchMedia('(prefers-reduced-motion: reduce)').matches===true&&document.documentElement.getAttribute('data-everstead-reduced-motion')==='reduce'&&nodes.every(node=>{const style=getComputedStyle(node);return zero(style.animationDuration)&&zero(style.transitionDuration)});
    }));

    await step('130-percent-text-no-overflow-or-clipped-shell',async()=>{
      await page.addStyleTag({content:'html[data-phase24e-text-stress="true"]{font-size:130%!important}html[data-phase24e-text-stress="true"] body{font-size:130%!important}'});
      return page.evaluate(minimum=>{
        document.documentElement.dataset.phase24eTextStress='true';void document.body.offsetWidth;
        const controls=[...document.querySelectorAll('.bottom-nav [data-nav],[data-roster],[data-phase24e-topbar] button')].filter(node=>getComputedStyle(node).display!=='none'),targets=controls.every(node=>{const rect=node.getBoundingClientRect();return rect.width>=minimum&&rect.height>=minimum&&rect.left>=-1&&rect.right<=innerWidth+1}),brand=document.querySelector('[data-phase24e-brand] b'),resources=document.querySelector('[data-phase24e-resources]'),collect=resources?.querySelector('[data-act="collect"]'),gifts=resources?.querySelector('[data-resource="gifts"]'),gold=resources?.querySelector('[data-resource="gold"]'),rank=resources?.querySelector('[data-player-profile]'),values=[gifts?.querySelector('b'),gold?.querySelector('b')],nodes=[brand,collect,gifts,gold,rank],rects=nodes.map(node=>node?.getBoundingClientRect()),overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)),pairwise=rects.every((left,index)=>left&&rects.slice(index+1).every(right=>right&&overlap(left,right)<=1)),valuesFit=values.every(node=>node&&node.scrollWidth<=node.clientWidth+1&&node.scrollHeight<=node.clientHeight+1&&node.textContent.trim().length>0);
        return document.documentElement.scrollWidth<=innerWidth+1&&targets&&pairwise&&valuesFit&&rects.every(rect=>rect&&rect.width>0&&rect.left>=-1&&rect.right<=innerWidth+1);
      },contract.minimumTargetPx);
    });

    await step('mobile-no-horizontal-overflow',async()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));

    const finalSnapshot=await pageSnapshot(page);
    await step('navigation-rosters-render-and-scroll-are-byte-neutral',async()=>baseline.raw===finalSnapshot.raw&&JSON.stringify(baseline.slots)===JSON.stringify(finalSnapshot.slots)&&baseline.writes===finalSnapshot.writes);
    await step('revision-and-resources-are-neutral',async()=>baseline.revision===finalSnapshot.revision&&JSON.stringify(baseline.resources)===JSON.stringify(finalSnapshot.resources));
    await step('receipts-and-journals-are-neutral',async()=>JSON.stringify(baseline.receiptsAndJournals)===JSON.stringify(finalSnapshot.receiptsAndJournals));
    await step('injected-adapter-never-used-native-storage',async()=>finalSnapshot.nativeAccesses.length===0);
  }catch(error){
    const diagnostics=await page.evaluate(()=>({app:document.querySelector('#app')?.textContent?.trim().slice(0,800)||'',overlay:document.querySelector('#overlay')?.textContent?.trim().slice(0,400)||'',controller:window.EVERSTEAD_PHASE24E_SHELL_CONTROLLER?.diagnostics?.()})).catch(()=>null);
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
  const profiles=process.env.PHASE24E_PROFILE?contract.profiles.filter(item=>item.id===process.env.PHASE24E_PROFILE):contract.profiles;
  const viewports=process.env.PHASE24E_VIEWPORT?contract.viewports.filter(item=>item.id===process.env.PHASE24E_VIEWPORT):contract.viewports;
  const seeds=process.env.PHASE24E_SKIP_SEED_BUILD==='1'&&profiles.length===1&&profiles[0]?.id==='fresh'?{fresh:null}:await seedTools.seedProfiles(browser,baseURL);
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
