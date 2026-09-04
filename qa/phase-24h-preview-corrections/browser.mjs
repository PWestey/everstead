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
const phase24gContract=JSON.parse(fs.readFileSync(path.join(root,'qa/phase-24g-chapter1/contract.json'),'utf8'));
const rows=[];
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};

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

async function listen(server){
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  return`http://127.0.0.1:${server.address().port}`;
}

function exactPredecessorRoot(){
  const temporaryDirectory=fs.mkdtempSync(path.join(os.tmpdir(),'everstead-phase24h-predecessor-'));
  const predecessorRoot=path.join(temporaryDirectory,'predecessor');
  fs.mkdirSync(predecessorRoot);
  const show=relative=>{
    const result=spawnSync('git',['show',`${contract.predecessor.commit}:${relative}`],{cwd:root,encoding:null,maxBuffer:64*1024*1024});
    if(result.status!==0)throw new Error(`Could not read predecessor ${relative}: ${result.stderr?.toString()}`);
    return result.stdout;
  };
  fs.writeFileSync(path.join(predecessorRoot,'index.html'),show('index.html'));
  fs.cpSync(path.join(root,'src'),path.join(predecessorRoot,'src'),{recursive:true});
  for(const relative of ['src/phase24d-public-preview-profile.js','src/phase24g-story-runtime.js'])fs.writeFileSync(path.join(predecessorRoot,relative),show(relative));
  fs.symlinkSync(path.join(root,'assets'),path.join(predecessorRoot,'assets'),'dir');
  return{temporaryDirectory,predecessorRoot};
}

async function seedToolsFor(predecessorRoot,temporaryDirectory){
  const sourcePath=path.join(root,'qa/phase-24d-public-preview/browser.mjs');
  const original=fs.readFileSync(sourcePath,'utf8');
  const executionStart=original.indexOf('async function seedProfiles');
  if(executionStart<0)throw new Error('Frozen Phase 24D browser source has an unknown shape');
  let source=original.slice(0,executionStart)
    .replace("import {chromium} from 'playwright';\n",'')
    .replace("const root=path.resolve(here,'../..');",`const root=${JSON.stringify(predecessorRoot)};`)
    .replace("const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));",`const contract=${JSON.stringify(phase24dContract)};`);
  source+='\nexport {staticServer,listen,contextFor};\n';
  const modulePath=path.join(temporaryDirectory,'seed-tools.mjs');
  fs.writeFileSync(modulePath,source);
  return import(`${pathToFileURL(modulePath).href}?v=${Date.now()}`);
}

async function foundationThinSeed(browser,predecessorURL,seedTools){
  const context=await seedTools.contextFor(browser,{qa:true}),page=await context.newPage();
  try{
    await page.goto(`${predecessorURL}/index.html?qa=1&phase24h=foundation-thin`,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForFunction(()=>window.__EVERSTEAD_PHASE_24C2C_QA__,null,{timeout:20000});
    return await page.evaluate(()=>{
      const bridge=window.__EVERSTEAD_PHASE_24C2C_QA__;
      const migration=bridge.destructive.migrateSchema13('fresh'),reload=bridge.destructive.reload(),snapshot=bridge.read.snapshot();
      if(migration?.ok!==true||reload?.ok!==true||snapshot?.state?.schemaVersion!==14||snapshot.state.tutorialProgress)throw new Error('Could not prepare the canonical foundation-thin seed');
      return Object.fromEntries(window.__PHASE24D_BROWSER_HARNESS__.slots.entries());
    });
  }finally{await context.close()}
}

async function visible(page,selector){return page.locator(selector).first().isVisible().catch(()=>false)}

async function closePresentation(page,{captureScene=false}={}){
  let sceneProgress=null;
  for(let attempt=0;attempt<30;attempt++){
    const result=await page.evaluate(capture=>{
      const shown=node=>{const style=getComputedStyle(node),rect=node.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0};
      const overlay=[...document.querySelectorAll('[data-overlay],.overlay')].filter(shown).at(-1);
      if(!overlay)return{status:'done'};
      const progress=overlay.querySelector('.phase-13-scene-progress')?.textContent?.replace(/\s+/g,' ').trim()||null;
      if(capture&&progress)return{status:'scene',progress};
      const selector='[data-modal-close],[data-phase17-close],[data-phase13-story="skip"],[data-phase13-tutorial-action="skip"],[data-phase15-tutorial-action="skip"],[data-phase16-tutorial-action="skip"]';
      const close=[...overlay.querySelectorAll(selector)].find(shown);
      if(close){close.click();return{status:'click',progress}}
      document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
      return{status:'escape',progress};
    },captureScene&&sceneProgress===null);
    if(result.progress&&sceneProgress===null)sceneProgress=result.progress;
    if(result.status==='scene')return{settled:false,sceneProgress:result.progress};
    if(result.status==='done')return{settled:true,sceneProgress};
    await page.waitForTimeout(60);
  }
  return{settled:!await visible(page,'[data-overlay],.overlay'),sceneProgress};
}

async function storageSnapshot(page){
  return page.evaluate(key=>{
    const harness=window.__PHASE24D_BROWSER_HARNESS__,raw=harness.slots.get(key)??null;
    return{raw,writes:harness.writes.length,nativeAccesses:[...harness.nativeAccesses],state:raw?JSON.parse(raw):null};
  },contract.storageKey);
}

async function exercise(profile,viewport,browser,baseURL,seedTools,seedSlots){
  const prefix=`${profile}-${viewport.id}`,errors=[];
  const context=await seedTools.contextFor(browser,{seedSlots,viewport,now:phase24dContract.frozenNow}),page=await context.newPage();
  page.setDefaultTimeout(7000);
  page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));
  page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
  const step=(id,pass,detail='')=>record(`${prefix}-${id}`,pass,detail);
  try{
    const response=await page.goto(`${baseURL}/index.html?phase24h=${profile}-${viewport.id}`,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForSelector('[data-phase24e-topbar]',{timeout:20000});
    step('http-and-current-schema',response?.ok()===true&&await page.evaluate(key=>JSON.parse(window.__PHASE24D_BROWSER_HARNESS__.slots.get(key)).schemaVersion===14,contract.storageKey));
    step('ordinary-realm-has-no-qa-bridge',await page.evaluate(()=>!Object.keys(window).some(name=>/^__EVERSTEAD.*QA/.test(name))&&window.__EVERSTEAD_RUNTIME__?.qa===undefined));

    if(profile==='fresh'){
      let presentation=await closePresentation(page,{captureScene:true});
      if(!presentation.sceneProgress){
        await page.locator('.bottom-nav [data-nav="village"]').click();
        await closePresentation(page);
        await page.locator('[data-phase13-objective]').first().click();
        await page.waitForSelector('[data-overlay] [data-phase13-scene]');
        presentation={
          settled:false,
          sceneProgress:(await page.locator('[data-overlay] .phase-13-scene-progress').innerText()).replace(/\s+/g,' ').trim()
        };
      }
      step('dialogue-progress-is-compact',Boolean(presentation.sceneProgress)&&/^Line \d+ of \d+$/.test(presentation.sceneProgress),presentation.sceneProgress);
      step('dialogue-progress-omits-reward-policy',Boolean(presentation.sceneProgress)&&!/reward|pays|progress/i.test(presentation.sceneProgress),presentation.sceneProgress);
      if(!presentation.settled){
        await page.locator('[data-overlay] [data-phase13-story="skip"]').click();
        await page.waitForTimeout(100);
      }
      await closePresentation(page);
    }else await closePresentation(page);

    const beforeBrowse=await storageSnapshot(page);
    await page.locator('.bottom-nav [data-nav="fellows"]').click();
    await page.waitForSelector('main h1');
    await closePresentation(page);
    const fellowship=await page.locator('main').innerText(),fellowshipNormalized=fellowship.toLowerCase();
    step('fellowship-summary-counts-are-correct',fellowshipNormalized.includes('6 joined fellows · 20 family · 20 owned companions'),fellowship.slice(0,250));
    step('fellowship-tabs-are-correct',fellowshipNormalized.includes('fellows · 6/18')&&fellowshipNormalized.includes('family · 20')&&fellowshipNormalized.includes('companions · 20'),fellowship.slice(0,350));
    step('incorrect-family-count-is-absent',!fellowshipNormalized.includes('6/18 family'));

    await page.locator('.bottom-nav [data-nav="more"]').click();
    await page.waitForSelector('[data-phase24f-more-owner]');
    await closePresentation(page);
    const moreText=(await page.locator('main').innerText()).replace(/\s+/g,' ').trim(),moreTextNormalized=moreText.toLowerCase();
    step('release-card-uses-one-version',moreTextNormalized.includes(contract.releaseVersion.toLowerCase())&&!moreTextNormalized.includes('1.0.0-rc.3'),moreText.slice(0,500));
    step('release-card-does-not-advertise-unreachable-collection',!moreText.includes('first permanent Collection'));
    step('reward-policy-lives-in-more',profile==='foundation-thin'||moreText.includes('Watching or skipping never pays a scene reward. Replays never change progress or rewards.'));

    const notice=page.locator('[data-phase24f-story-foundation-notice]');
    if(profile==='foundation-thin'){
      step('foundation-thin-notice-is-visible',await notice.isVisible());
      const noticeText=(await notice.innerText()).replace(/\s+/g,' ').trim();
      step('foundation-thin-notice-explains-hidden-surfaces',noticeText.includes('Chronicle, Tutorials, Legacy, the Waystone objective, and Chapter I')&&noticeText.includes('Gold, Oaths, rosters, Adventure, and Relics are unaffected.'),noticeText);
      step('foundation-thin-notice-points-to-recovery-file',noticeText.includes('export a Recovery File'));
      step('foundation-thin-does-not-fabricate-story-ui',await page.locator('[data-phase13-reference],[data-phase13-objective-card]').count()===0);
    }else step('healthy-save-has-no-foundation-notice',await notice.count()===0);

    const details=page.locator('[data-phase24-advanced]');
    step('scaling-diagnostics-are-collapsed',await details.count()===1&&await details.evaluate(element=>element.open===false));
    step('scaling-button-is-hidden-until-expanded',!await page.locator('[data-phase24-scaling-open]').isVisible());
    await details.locator('summary').click();
    step('scaling-button-appears-after-expansion',await page.locator('[data-phase24-scaling-open]').isVisible());
    const beforeScaling=await storageSnapshot(page);
    await page.locator('[data-phase24-scaling-open]').click();
    await page.waitForSelector('[data-phase24-scaling-dialog]');
    step('scaling-dialog-still-opens',await page.locator('[data-phase24-scaling-dialog]').isVisible());
    await page.locator('[data-phase24-scaling-close]').click();
    const afterScaling=await storageSnapshot(page);
    step('scaling-dialog-remains-save-neutral',beforeScaling.raw===afterScaling.raw&&beforeScaling.writes===afterScaling.writes);

    if(profile==='fresh'){
      await page.locator('[data-act="export"]').first().click();
      await page.waitForSelector('[data-download-recovery]');
      const downloadPromise=page.waitForEvent('download');
      await page.locator('[data-download-recovery]').click();
      const download=await downloadPromise,downloadPath=await download.path();
      const bundle=JSON.parse(fs.readFileSync(downloadPath,'utf8'));
      step('recovery-file-uses-release-version',bundle.appVersion===contract.releaseVersion,{appVersion:bundle.appVersion});
    }

    const afterBrowse=await storageSnapshot(page);
    step('ordinary-browsing-after-onboarding-is-save-neutral',beforeBrowse.raw===afterBrowse.raw&&beforeBrowse.writes===afterBrowse.writes,{beforeWrites:beforeBrowse.writes,afterWrites:afterBrowse.writes});
    step('native-storage-remains-untouched',afterBrowse.nativeAccesses.length===0,afterBrowse.nativeAccesses);
  }catch(error){
    let diagnostic=null;
    try{diagnostic=await page.evaluate(()=>({body:document.body?.innerText?.replace(/\s+/g,' ').trim().slice(0,1400)||'',url:location.href}))}catch{}
    step('journey-fatal',false,{error:error.stack||error.message,diagnostic});
  }
  step('zero-warning-error-console',errors.length===0,errors);
  await context.close();
}

const predecessor=exactPredecessorRoot();
const seedTools=await seedToolsFor(predecessor.predecessorRoot,predecessor.temporaryDirectory);
const predecessorServer=seedTools.staticServer(),currentServer=staticServer();
let browser;
try{
  const predecessorURL=await seedTools.listen(predecessorServer),baseURL=await listen(currentServer);
  browser=await chromium.launch({headless:true});
  const thin=await foundationThinSeed(browser,predecessorURL,seedTools);
  for(const viewport of contract.viewports){
    await exercise('fresh',viewport,browser,baseURL,seedTools,null);
    await exercise('foundation-thin',viewport,browser,baseURL,seedTools,thin);
  }
}finally{
  if(browser)await browser.close();
  for(const server of [predecessorServer,currentServer]){server.closeAllConnections?.();await new Promise(resolve=>server.close(resolve))}
  fs.rmSync(predecessor.temporaryDirectory,{recursive:true,force:true});
}

const failed=rows.filter(item=>!item.pass);
for(const item of failed)console.error(`FAIL ${item.id}${item.detail?` · ${item.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
