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
  return`http://127.0.0.1:${server.address().port}`;
}

async function closePresentation(page){
  for(let attempt=0;attempt<36;attempt++){
    const result=await page.evaluate(()=>{
      const shown=node=>{const style=getComputedStyle(node),rect=node.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0};
      const overlay=[...document.querySelectorAll('[data-overlay],.overlay')].filter(shown).at(-1);
      if(!overlay)return'done';
      const selector='[data-modal-close],[data-phase17-close],[data-phase13-story="skip"],[data-phase13-tutorial-action="skip"],[data-phase15-tutorial-action="skip"],[data-phase16-tutorial-action="skip"]';
      const close=[...overlay.querySelectorAll(selector)].find(shown);
      if(close){close.click();return'click'}
      document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
      return'escape';
    });
    if(result==='done')return true;
    await page.waitForTimeout(70);
  }
  return false;
}

async function storageSnapshot(page){
  return page.evaluate(key=>({raw:localStorage.getItem(key),writes:window.__PHASE24I_STORAGE_WRITES__||0}),contract.storageKey);
}

async function geometry(page){
  return page.evaluate(()=>{
    const rect=node=>{const value=node.getBoundingClientRect();return{x:value.x,y:value.y,width:value.width,height:value.height,top:value.top,right:value.right,bottom:value.bottom,left:value.left}};
    const panel=id=>{const node=document.querySelector(`[data-phase24i-panel="${id}"]`);return{open:node.open,panel:rect(node),summary:rect(node.querySelector('summary')),body:rect(node.querySelector('.phase-13-objective,.village-hud'))}};
    return{viewport:{width:innerWidth,height:innerHeight},scrollWidth:document.body.scrollWidth,topbar:rect(document.querySelector('.topbar')),bottomNav:rect(document.querySelector('.bottom-nav')),waystone:panel('waystone'),production:panel('production')};
  });
}

async function exercise(viewport,browser,baseURL){
  const prefix=viewport.id,errors=[];
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height}});
  await context.addInitScript(()=>{
    const original=Storage.prototype.setItem;
    Object.defineProperty(window,'__PHASE24I_STORAGE_WRITES__',{configurable:false,enumerable:false,writable:true,value:0});
    Storage.prototype.setItem=function(...args){window.__PHASE24I_STORAGE_WRITES__++;return original.apply(this,args)};
  });
  const page=await context.newPage();
  page.setDefaultTimeout(8000);
  page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));
  page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
  const step=(id,pass,detail='')=>record(`${prefix}-${id}`,pass,detail);
  try{
    const response=await page.goto(`${baseURL}/index.html?phase24i=${viewport.id}`,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForSelector('[data-phase24e-topbar]',{timeout:20000});
    await closePresentation(page);
    await page.locator('.bottom-nav [data-nav="village"]').click();
    await closePresentation(page);
    await page.waitForSelector('[data-phase24i-panel="production"]');
    await page.waitForTimeout(350);

    step('http-and-current-schema',response?.ok()===true&&await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).schemaVersion===14,contract.storageKey));
    step('ordinary-realm-has-no-qa-bridge',await page.evaluate(()=>!Object.keys(window).some(name=>/^__EVERSTEAD.*QA/.test(name))&&window.__EVERSTEAD_RUNTIME__?.qa===undefined));

    const panels=page.locator('[data-phase24i-panel]');
    step('two-village-panel-controls-exist',await panels.count()===2);
    step('both-panels-start-collapsed',await panels.evaluateAll(nodes=>nodes.every(node=>node.open===false)));
    step('waystone-body-starts-hidden',!await page.locator('[data-phase24i-panel="waystone"] .phase-13-objective').isVisible());
    step('production-body-starts-hidden',!await page.locator('[data-phase24i-panel="production"] .village-hud').isVisible());

    const collapsed=await geometry(page),within=(value,min,max)=>value>=min-0.5&&value<=max+0.5;
    step('collapsed-summaries-are-touch-sized',collapsed.waystone.summary.height>=contract.limits.minimumTouchTargetPx-0.5&&collapsed.production.summary.height>=contract.limits.minimumTouchTargetPx-0.5,collapsed);
    step('collapsed-panels-fit-phone-width',collapsed.scrollWidth<=collapsed.viewport.width&&collapsed.waystone.summary.left>=0&&collapsed.waystone.summary.right<=collapsed.viewport.width&&collapsed.production.summary.left>=0&&collapsed.production.summary.right<=collapsed.viewport.width,collapsed);
    step('waystone-clears-topbar',collapsed.waystone.summary.top>=collapsed.topbar.bottom,collapsed);
    step('production-clears-bottom-navigation',collapsed.production.summary.bottom<=collapsed.bottomNav.top,collapsed);

    const beforeToggle=await storageSnapshot(page);
    const waystoneSummary=page.locator('[data-phase24i-panel="waystone"] > summary');
    const productionSummary=page.locator('[data-phase24i-panel="production"] > summary');
    await waystoneSummary.click();
    let opened=await geometry(page);
    step('waystone-opens-from-compact-control',opened.waystone.open&&await page.locator('[data-phase24i-panel="waystone"] .phase-13-objective').isVisible());
    step('waystone-open-panel-remains-compact',within(opened.waystone.panel.width,0,contract.limits.openWidthPx)&&opened.waystone.body.height<=opened.viewport.height*contract.limits.openBodyViewportRatio+1&&opened.scrollWidth<=opened.viewport.width,opened.waystone);
    await waystoneSummary.click();
    step('second-waystone-tap-collapses',await page.locator('[data-phase24i-panel="waystone"]').evaluate(node=>node.open===false));

    await productionSummary.click();
    opened=await geometry(page);
    step('production-opens-from-compact-control',opened.production.open&&await page.locator('[data-phase24i-panel="production"] .village-hud').isVisible());
    step('production-open-panel-remains-compact',within(opened.production.panel.width,0,contract.limits.openWidthPx)&&opened.production.body.height<=opened.viewport.height*contract.limits.openBodyViewportRatio+1&&opened.production.panel.bottom<=opened.bottomNav.top&&opened.scrollWidth<=opened.viewport.width,opened.production);
    step('production-actions-remain-visible',await page.locator('[data-phase24i-panel="production"] [data-fellow]').isVisible()&&await page.locator('[data-phase24i-panel="production"] [data-act="collect"]').isVisible());
    await productionSummary.click();
    step('second-production-tap-collapses',await page.locator('[data-phase24i-panel="production"]').evaluate(node=>node.open===false));
    await productionSummary.click();
    await waystoneSummary.click();
    step('opening-waystone-closes-production',await page.locator('[data-phase24i-panel="waystone"]').evaluate(node=>node.open===true)&&await page.locator('[data-phase24i-panel="production"]').evaluate(node=>node.open===false));
    await waystoneSummary.click();
    const afterToggle=await storageSnapshot(page);
    step('panel-disclosure-is-byte-and-write-neutral',beforeToggle.raw===afterToggle.raw&&beforeToggle.writes===afterToggle.writes,{before:beforeToggle.writes,after:afterToggle.writes});

    const command=page.locator('.building-hotspot').first();
    step('village-board-remains-tappable-when-collapsed',await command.isVisible()&&await command.isEnabled());
    await command.click();
    step('building-sheet-still-opens',await page.locator('[data-overlay],.overlay').first().isVisible());
    await closePresentation(page);

    await productionSummary.click();
    await page.locator('[data-phase24i-panel="production"] [data-fellow]').click();
    step('featured-fellow-profile-still-opens',await page.locator('[data-overlay],.overlay').first().isVisible());
    await closePresentation(page);

    await waystoneSummary.click();
    const objective=page.locator('[data-phase24i-panel="waystone"] [data-phase13-objective]');
    step('waystone-objective-action-remains-available',await objective.count()===1&&await objective.isVisible()&&await objective.isEnabled());
    await objective.click();
    step('waystone-objective-still-opens',await page.locator('[data-overlay],.overlay').first().isVisible());
    await closePresentation(page);

    step('final-phone-width-has-no-horizontal-overflow',await page.evaluate(()=>document.body.scrollWidth<=innerWidth));
  }catch(error){
    let diagnostic=null;
    try{diagnostic=await page.evaluate(()=>({body:document.body?.innerText?.replace(/\s+/g,' ').trim().slice(0,1600)||'',url:location.href}))}catch{}
    step('journey-fatal',false,{error:error.stack||error.message,diagnostic});
  }
  step('zero-warning-error-console',errors.length===0,errors);
  await context.close();
}

const server=staticServer();
let browser;
try{
  const baseURL=await listen(server);
  browser=await chromium.launch({headless:true});
  for(const viewport of contract.viewports)await exercise(viewport,browser,baseURL);
}finally{
  if(browser)await browser.close();
  server.closeAllConnections?.();
  await new Promise(resolve=>server.close(resolve));
}

const failed=rows.filter(item=>!item.pass);
for(const item of failed)console.error(`FAIL ${item.id}${item.detail?` · ${item.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
