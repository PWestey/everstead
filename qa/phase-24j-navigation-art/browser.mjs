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

async function dismiss(page){
  for(let attempt=0;attempt<40;attempt++){
    const state=await page.evaluate(()=>{
      const shown=node=>{const style=getComputedStyle(node),rect=node.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0};
      const overlay=[...document.querySelectorAll('[data-overlay],.overlay')].filter(shown).at(-1);
      if(!overlay)return'done';
      const selector='[data-modal-close],[data-phase17-close],[data-phase13-story="skip"],[data-phase13-tutorial-action="skip"],[data-phase15-tutorial-action="skip"],[data-phase16-tutorial-action="skip"]';
      const button=[...overlay.querySelectorAll(selector)].find(shown);
      if(button){button.click();return'click'}
      document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
      return'escape';
    });
    if(state==='done')return true;
    await page.waitForTimeout(70);
  }
  return false;
}

async function navEvidence(page){
  return page.evaluate(routes=>{
    const rect=node=>{const value=node.getBoundingClientRect();return{x:value.x,y:value.y,width:value.width,height:value.height,top:value.top,right:value.right,bottom:value.bottom,left:value.left}};
    const overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
    const rgbaAlpha=value=>{const match=String(value).match(/rgba?\([^)]*(?:,|\s\/\s)([\d.]+)\)$/);return match?Number(match[1]):1};
    const buttons=routes.map(route=>document.querySelector(`.bottom-nav button[data-nav="${route.id}"]`));
    const data=buttons.map((button,index)=>{
      const icon=button?.querySelector('i'),buttonRect=button?rect(button):null,iconRect=icon?rect(icon):null;
      const textNode=button?[...button.childNodes].find(node=>node.nodeType===Node.TEXT_NODE&&node.textContent.trim()===routes[index].label)||button.querySelector('span'):null;
      let labelRect=null;if(textNode){const range=document.createRange();range.selectNodeContents(textNode);labelRect=rect(range)}
      const center=buttonRect?document.elementFromPoint(buttonRect.left+buttonRect.width/2,buttonRect.top+buttonRect.height/2):null;
      const pseudo=icon?getComputedStyle(icon,'::before'):null,style=button?getComputedStyle(button):null,iconStyle=icon?getComputedStyle(icon):null;
      return{id:routes[index].id,text:button?.textContent.trim()||'',button:buttonRect,icon:iconRect,label:labelRect,hit:center?.closest?.('button')===button,fit:Boolean(button&&button.scrollWidth<=button.clientWidth+1&&button.scrollHeight<=button.clientHeight+1),colorAlpha:style?rgbaAlpha(style.color):0,glyph:icon?.textContent.trim()||'',glyphColor:iconStyle?.color||'',glyphFont:iconStyle?.fontSize||'',art:pseudo?.backgroundImage||'',transition:pseudo?.transitionDuration||'',animation:pseudo?.animationDuration||'',iconLabelOverlap:iconRect&&labelRect?overlap(iconRect,labelRect):Infinity};
    });
    const nav=document.querySelector('.bottom-nav'),navRect=nav?rect(nav):null,navStyle=nav?getComputedStyle(nav):null,before=nav?getComputedStyle(nav,'::before'):null;
    return{viewport:{width:innerWidth,height:innerHeight},scrollWidth:document.body.scrollWidth,nav:navRect,navBackground:navStyle?.backgroundImage||'',navBackgroundColor:navStyle?.backgroundColor||'',housingPointerEvents:before?.pointerEvents||'',embeddedArtCount:nav?.querySelectorAll('img,picture,svg').length??-1,buttons:data,pairwise:buttons.every((left,leftIndex)=>buttons.slice(leftIndex+1).every(right=>overlap(rect(left),rect(right))<=1))};
  },contract.routes);
}

async function storageSnapshot(page,reset=false){
  return page.evaluate(({key,reset})=>{if(reset)window.__PHASE24J_STORAGE_WRITES__=0;const raw=localStorage.getItem(key);let revision=null;try{revision=JSON.parse(raw)?.saveMeta?.revision??null}catch{}return{raw,revision,writes:window.__PHASE24J_STORAGE_WRITES__||0}}, {key:contract.storageKey,reset});
}

async function exercise(viewport,browser,baseURL,{reduced=false}={}){
  const mode=reduced?'reduced':'normal',prefix=`${viewport.id}-${mode}`,errors=[],assetResponses=new Map(),requestFailures=[];
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:reduced?'reduce':'no-preference'});
  await context.addInitScript(()=>{
    const original=Storage.prototype.setItem;
    Object.defineProperty(window,'__PHASE24J_STORAGE_WRITES__',{configurable:false,enumerable:false,writable:true,value:0});
    Storage.prototype.setItem=function(...args){window.__PHASE24J_STORAGE_WRITES__++;return original.apply(this,args)};
  });
  const page=await context.newPage();page.setDefaultTimeout(10000);
  page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));
  page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
  page.on('requestfailed',request=>requestFailures.push(`${request.url()}:${request.failure()?.errorText||'failed'}`));
  page.on('response',response=>{const relative=contract.routes.map(item=>item.asset).concat(contract.housingAsset).find(item=>response.url().endsWith(`/${item}`));if(relative)assetResponses.set(relative,response.status())});
  const step=(id,pass,detail='')=>record(`${prefix}-${id}`,pass,detail);
  try{
    const response=await page.goto(`${baseURL}/index.html?phase24j=${prefix}`,{waitUntil:'networkidle',timeout:30000});
    await page.waitForSelector('.bottom-nav');await dismiss(page);await page.waitForTimeout(250);
    step('http-ok-and-current-schema',response?.ok()===true&&await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).schemaVersion===14,contract.storageKey));
    const fetchedAssets=await page.evaluate(async assets=>Object.fromEntries(await Promise.all(assets.map(async relative=>{try{const response=await fetch(relative,{cache:'no-store'});return[relative,response.status]}catch(error){return[relative,String(error?.message||error)]}}))),contract.routes.map(item=>item.asset).concat(contract.housingAsset));
    step('all-six-local-art-assets-load',Object.values(fetchedAssets).every(status=>status===200),fetchedAssets);
    step('no-failed-network-requests',requestFailures.length===0,requestFailures);
    step('ordinary-realm-has-no-qa-bridge',await page.evaluate(()=>!Object.keys(window).some(name=>/^__EVERSTEAD.*QA/.test(name))&&window.__EVERSTEAD_RUNTIME__?.qa===undefined));

    let evidence=await navEvidence(page),minimum=contract.limits.minimumTouchTargetPx;
    step('exact-five-css-only-route-controls',evidence.buttons.length===5&&evidence.embeddedArtCount===0&&evidence.buttons.map(item=>item.id).join(',')==='village,oaths,fellows,adventure,more',evidence.buttons);
    step('all-route-art-bindings-computed',evidence.buttons.every((item,index)=>item.art.includes(contract.routes[index].asset.split('/').at(-1))),evidence.buttons.map(item=>({id:item.id,art:item.art})));
    step('labels-and-glyph-fallbacks-remain-real-legible-text',evidence.buttons.every((item,index)=>item.text.includes(contract.routes[index].label)&&item.glyph===contract.routes[index].glyph&&item.colorAlpha>0&&Number.parseFloat(item.glyphFont)>0&&item.fit),evidence.buttons);
    step('button-icon-label-geometry-does-not-conflict',evidence.pairwise&&evidence.buttons.every(item=>item.button.width>=minimum&&item.button.height>=minimum&&item.button.left>=-1&&item.button.right<=evidence.viewport.width+1&&item.hit&&item.iconLabelOverlap<=1),evidence);
    step('housing-fits-phone-and-never-captures-input',evidence.nav.left>=-1&&evidence.nav.right<=evidence.viewport.width+1&&evidence.nav.bottom<=evidence.viewport.height+1&&evidence.housingPointerEvents==='none'&&evidence.navBackground.includes('nav-frame.png'),evidence);
    step('no-horizontal-overflow-in-initial-route',evidence.scrollWidth<=evidence.viewport.width,evidence);

    const before=await storageSnapshot(page,true),routeStates=[];
    for(const route of contract.routes){
      await page.locator(`.bottom-nav [data-nav="${route.id}"]`).click();await page.waitForTimeout(80);await dismiss(page);
      const state=await page.evaluate(id=>{const selected=[...document.querySelectorAll('.bottom-nav [data-nav].on')],current=[...document.querySelectorAll('.bottom-nav [data-nav][aria-current="page"]')],button=document.querySelector(`.bottom-nav [data-nav="${id}"]`),indicator=button?getComputedStyle(button,'::after'):null;return{id,selected:selected.map(node=>node.dataset.nav),current:current.map(node=>node.dataset.nav),indicator:{content:indicator?.content,width:indicator?.width,height:indicator?.height},view:id==='village'?Boolean(document.querySelector('main.village-screen')):document.querySelector('main h1')?.textContent?.trim()||'',scrollWidth:document.body.scrollWidth,viewport:innerWidth}},route.id);
      routeStates.push(state);
    }
    const after=await storageSnapshot(page);
    const expectedView={village:true,oaths:'Oaths',fellows:'Fellowship',adventure:'Fellow Campaign',more:'More'};
    step('all-five-routes-activate-with-one-current-state',routeStates.every((state,index)=>state.selected.length===1&&state.selected[0]===contract.routes[index].id&&state.current.length===1&&state.current[0]===contract.routes[index].id&&state.view===expectedView[state.id]),routeStates);
    step('active-state-retains-non-color-shape',routeStates.every(state=>state.indicator.content==='""'&&Number.parseFloat(state.indicator.width)>=20&&Number.parseFloat(state.indicator.height)>=3),routeStates.map(state=>({id:state.id,indicator:state.indicator})));
    step('every-route-remains-free-of-horizontal-overflow',routeStates.every(state=>state.scrollWidth<=state.viewport),routeStates);
    step('route-navigation-is-byte-revision-and-write-neutral',before.raw===after.raw&&before.revision===after.revision&&after.writes===0,{before:{revision:before.revision,writes:before.writes},after:{revision:after.revision,writes:after.writes},rawEqual:before.raw===after.raw});

    await page.locator('.bottom-nav [data-nav="village"]').click();await page.waitForTimeout(80);
    const clearance=await page.evaluate(()=>{const panel=document.querySelector('[data-phase24i-panel="production"] > summary')?.getBoundingClientRect(),nav=document.querySelector('.bottom-nav')?.getBoundingClientRect();return{panelBottom:panel?.bottom,navTop:nav?.top,pass:Boolean(panel&&nav&&panel.bottom<=nav.top+1)}});
    step('village-production-control-clears-art-navigation',clearance.pass,clearance);

    await page.addStyleTag({content:'.bottom-nav{background-image:linear-gradient(180deg,#142630,#06111b)!important;background-color:#06111b!important}.bottom-nav button i::before{background-image:none!important}'});
    await page.waitForTimeout(60);evidence=await navEvidence(page);
    const fallbackBefore=await storageSnapshot(page,true);
    for(const route of contract.routes){await page.locator(`.bottom-nav [data-nav="${route.id}"]`).click();await page.waitForTimeout(40)}
    const fallbackAfter=await storageSnapshot(page);
    step('css-art-disabled-keeps-five-glyph-and-label-fallbacks',evidence.buttons.every((item,index)=>item.art==='none'&&item.glyph===contract.routes[index].glyph&&item.text.includes(contract.routes[index].label)&&item.colorAlpha>0&&item.fit&&item.hit),evidence.buttons);
    step('housing-disabled-keeps-painted-solid-fallback',evidence.navBackground.includes('gradient')&&evidence.navBackgroundColor!=='rgba(0, 0, 0, 0)'&&evidence.housingPointerEvents==='none',{background:evidence.navBackground,color:evidence.navBackgroundColor});
    step('fallback-navigation-is-save-neutral',fallbackBefore.raw===fallbackAfter.raw&&fallbackBefore.revision===fallbackAfter.revision&&fallbackAfter.writes===0,{before:fallbackBefore,after:fallbackAfter});

    if(reduced){
      evidence=await navEvidence(page);
      step('system-reduced-motion-removes-art-transitions',evidence.buttons.every(item=>String(item.transition).split(',').every(value=>Number.parseFloat(value)===0)&&String(item.animation).split(',').every(value=>Number.parseFloat(value)===0)),evidence.buttons.map(item=>({id:item.id,transition:item.transition,animation:item.animation})));
      await page.evaluate(()=>document.documentElement.classList.add('phase15-reduced-motion'));await page.waitForTimeout(20);evidence=await navEvidence(page);
      step('user-reduced-motion-removes-art-transitions',evidence.buttons.every(item=>String(item.transition).split(',').every(value=>Number.parseFloat(value)===0)&&String(item.animation).split(',').every(value=>Number.parseFloat(value)===0)),evidence.buttons.map(item=>({id:item.id,transition:item.transition,animation:item.animation})));
    }
  }catch(error){
    let diagnostic=null;try{diagnostic=await page.evaluate(()=>({url:location.href,body:document.body?.innerText?.replace(/\s+/g,' ').trim().slice(0,1800)||''}))}catch{}
    step('journey-fatal',false,{error:error.stack||error.message,diagnostic});
  }
  step('zero-warning-error-console',errors.length===0,errors);
  await context.close();
}

const server=staticServer();let browser;
try{
  const baseURL=await listen(server);browser=await chromium.launch({headless:true});
  for(const viewport of contract.viewports){await exercise(viewport,browser,baseURL);await exercise(viewport,browser,baseURL,{reduced:true})}
}finally{
  if(browser)await browser.close();server.closeAllConnections?.();await new Promise(resolve=>server.close(resolve));
}

const failed=rows.filter(item=>!item.pass);
for(const item of failed)console.error(`FAIL ${item.id}${item.detail?` · ${item.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
