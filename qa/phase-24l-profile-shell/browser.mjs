import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../..');
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));
const rows=[],record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.json':'application/json; charset=utf-8'};

function server(){
 return http.createServer((request,response)=>{
  const pathname=decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname),relative=pathname==='/'?'index.html':pathname.replace(/^\/+/,''),target=path.resolve(root,relative);
  if(target!==root&&!target.startsWith(root+path.sep)){response.writeHead(403).end();return}
  fs.readFile(target,(error,data)=>{if(error){response.writeHead(404).end();return}response.writeHead(200,{'content-type':mime[path.extname(target)]||'application/octet-stream','cache-control':'no-store'}).end(data)});
 });
}
async function listen(instance){await new Promise((resolve,reject)=>{instance.once('error',reject);instance.listen(0,'127.0.0.1',resolve)});return`http://127.0.0.1:${instance.address().port}`}
async function dismiss(page){
 for(let n=0;n<60;n++){
  const state=await page.evaluate(()=>{
   const shown=node=>{const rect=node.getBoundingClientRect(),style=getComputedStyle(node);return rect.width>0&&rect.height>0&&style.display!=='none'&&style.visibility!=='hidden'};
   const overlay=[...document.querySelectorAll('[data-overlay]')].filter(shown).at(-1);
   if(!overlay)return'done';
   const selector='[data-modal-close],[data-phase17-close],[data-phase13-story="skip"],[data-phase13-tutorial-action="skip"],[data-phase15-tutorial-action="skip"],[data-phase16-tutorial-action="skip"]';
   const button=[...overlay.querySelectorAll(selector)].find(shown);
   if(button){button.click();return'click'}
   document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
   return'escape';
  });
  if(state==='done')return true;
  await page.waitForTimeout(60);
 }
 return false;
}
async function storage(page,reset=false){
 return page.evaluate(({key,reset})=>{
  if(reset)window.__PHASE24L_WRITES__=0;
  const raw=localStorage.getItem(key);let parsed=null;
  try{parsed=JSON.parse(raw)}catch{}
  return{raw,revision:parsed?.saveMeta?.revision??null,writes:window.__PHASE24L_WRITES__||0,parsed};
 },{key:contract.storageKey,reset});
}
async function navigateRoster(page,kind,definition){
 if(kind==='wayfarer')return page.locator(definition.card).first();
 await page.locator('.bottom-nav [data-nav="fellows"]').click();
 await page.getByRole('heading',{name:'Fellowship',exact:true}).waitFor();
 await page.waitForSelector('[data-roster]');
 if(definition.roster!=='fellows'){
  await page.locator(`[data-roster="${definition.roster}"]`).click();
  await page.waitForSelector(`[data-roster="${definition.roster}"][aria-selected="true"]`);
 }
 await page.waitForSelector(definition.card);
 return page.locator(`${definition.card}:not([hidden])`).first();
}
async function shellEvidence(page,kind){
 return page.evaluate(({kind,limits})=>{
  const shell=document.querySelector(`[data-phase24l-profile="${kind}"]`),overlay=shell?.closest('[data-overlay]'),topbar=document.querySelector('[data-phase24e-topbar],.topbar');
  const rect=node=>{const value=node?.getBoundingClientRect();return value?{top:value.top,right:value.right,bottom:value.bottom,left:value.left,width:value.width,height:value.height}:null};
  const tabs=[...shell?.querySelectorAll('[data-phase24l-profile-tab]')||[]],panels=[...shell?.querySelectorAll('[data-phase24l-panel]')||[]],topClose=shell?.querySelector(':scope [data-modal-close]');
  return{
   kind:shell?.dataset.phase24lProfile,active:shell?.dataset.phase24lActivePanel,open:shell?.dataset.phase24lSheetOpen,
   tabs:tabs.map(tab=>({id:tab.dataset.phase24lProfileTab,selected:tab.getAttribute('aria-selected'),expanded:tab.getAttribute('aria-expanded'),tabindex:tab.tabIndex,controls:tab.getAttribute('aria-controls'),rect:rect(tab)})),
   panels:panels.map(panel=>({id:panel.dataset.phase24lPanel,hidden:panel.hidden,ariaHidden:panel.getAttribute('aria-hidden'),labelledBy:panel.getAttribute('aria-labelledby')})),
   shell:rect(shell),overlay:rect(overlay),rail:rect(topbar),close:rect(topClose),
   htmlClass:document.documentElement.classList.contains('phase24l-profile-open'),
   overflow:{html:getComputedStyle(document.documentElement).overflow,body:getComputedStyle(document.body).overflow},
   scroll:{window:scrollY,html:document.documentElement.scrollTop,body:document.body.scrollTop},
   horizontalOverflow:document.body.scrollWidth>innerWidth+limits.fitTolerancePx,viewport:{width:innerWidth,height:innerHeight}
  };
 },{kind,limits:contract.limits});
}
async function panelEvidence(page,kind,id,primarySelectors=[]){
 return page.evaluate(({kind,id,primarySelectors,limits})=>{
  const shell=document.querySelector(`[data-phase24l-profile="${kind}"]`),panel=shell?.querySelector(`[data-phase24l-panel="${id}"]:not([hidden])`),sheetHost=shell?.querySelector('[data-phase24l-sheet-host]'),overlay=shell?.closest('[data-overlay]'),content=panel?.querySelector('[data-phase24l-sheet-content]'),close=panel?.querySelector('[data-phase24l-sheet-close]');
  const rect=node=>{const value=node?.getBoundingClientRect();return value?{top:value.top,right:value.right,bottom:value.bottom,left:value.left,width:value.width,height:value.height}:null};
  const shown=node=>{const value=node?.getBoundingClientRect(),style=node&&getComputedStyle(node);return Boolean(node&&value.width>0&&value.height>0&&style.display!=='none'&&style.visibility!=='hidden')};
  const within=(child,parent)=>Boolean(child&&parent&&child.top>=parent.top-limits.fitTolerancePx&&child.bottom<=parent.bottom+limits.fitTolerancePx&&child.left>=parent.left-limits.fitTolerancePx&&child.right<=parent.right+limits.fitTolerancePx);
  const contentRect=rect(content);
  const metric=(node,selector)=>{
   const value=rect(node),center=value?{x:value.left+value.width/2,y:value.top+value.height/2}:null,hit=center?document.elementFromPoint(center.x,center.y):null;
   return{selector,present:Boolean(node),visible:shown(node),disabled:Boolean(node?.disabled),rect:value,withinContent:within(value,contentRect),withinViewport:Boolean(value&&value.top>=-limits.fitTolerancePx&&value.bottom<=innerHeight+limits.fitTolerancePx&&value.left>=-limits.fitTolerancePx&&value.right<=innerWidth+limits.fitTolerancePx),hit:Boolean(node&&hit&&(hit===node||node.contains(hit))),hitTag:hit?.tagName||null};
  };
  const primary=primarySelectors.map(selector=>metric(panel?.querySelector(selector),selector));
  const interactive=[...content?.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')||[]].filter(shown).map(node=>metric(node,node.matches('select')?'select':node.matches('button')?'button':node.tagName.toLowerCase()));
  const actionNodes=id==='relics'?[...panel?.querySelectorAll('[data-fellow-relic-select],[data-fellow-relic-apply],[data-phase24l-relic-detail],[data-relic-upgrade]')||[]]:id==='building'?[...panel?.querySelectorAll('[data-phase24l-family-building-select],[data-phase24l-family-building-apply]')||[]]:id==='assignment'?[...panel?.querySelectorAll('[data-companion-assignment],[data-companion-assignment-save]')||[]]:[];
  const actionTargets=actionNodes.map(node=>metric(node,node.matches('select')?'select':node.getAttributeNames().find(name=>name.startsWith('data-'))||'button'));
  const overlaps=[];
  for(let left=0;left<actionTargets.length;left++)for(let right=left+1;right<actionTargets.length;right++){
   const a=actionTargets[left].rect,b=actionTargets[right].rect,area=a&&b?Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)):0;
   if(area>limits.fitTolerancePx)overlaps.push({left:actionTargets[left].selector,right:actionTargets[right].selector,area});
  }
  const panelRect=rect(panel),overlayRect=rect(overlay),hostRect=rect(sheetHost);
  return{
   id:panel?.dataset.phase24lPanel,count:shell?.querySelectorAll('[data-phase24l-panel]:not([hidden])').length??-1,
   panel:panelRect,host:hostRect,overlay:overlayRect,content:contentRect,close:rect(close),
   visibleArtHeight:panelRect&&overlayRect?panelRect.top-overlayRect.top:null,
   maxSheetHeight:Math.min(innerHeight*limits.maximumSheetViewportRatio,limits.maximumSheetPx),minVisibleArtHeight:innerHeight*limits.minimumVisibleArtViewportRatio,
   scroll:{panelClient:panel?.clientHeight??null,panelScroll:panel?.scrollHeight??null,contentClient:content?.clientHeight??null,contentScroll:content?.scrollHeight??null,window:scrollY,html:document.documentElement.scrollTop,body:document.body.scrollTop},
   overflow:{panel:panel?getComputedStyle(panel).overflowY:null,content:content?getComputedStyle(content).overflowY:null,html:getComputedStyle(document.documentElement).overflowY,body:getComputedStyle(document.body).overflowY},
   primary,interactive,actionTargets,overlaps,
   animation:panel?getComputedStyle(panel).animationDuration:null,
   transition:shell?.querySelector('.profile-title,.phase24k-wayfarer-profile-title')?getComputedStyle(shell.querySelector('.profile-title,.phase24k-wayfarer-profile-title')).transitionDuration:null,
   focused:document.activeElement===close
  };
 },{kind,id,primarySelectors,limits:contract.limits});
}
async function contentEvidence(page,kind){
 return page.evaluate(kind=>{
  const shell=document.querySelector(`[data-phase24l-profile="${kind}"]`),inPanel=(id,selector)=>Boolean(shell?.querySelector(`[data-phase24l-panel="${id}"] ${selector}`));
  if(kind==='fellow')return{overview:inPanel('overview','[data-phase24l-fellow-overview]'),level:inPanel('level','.card'),levelText:shell?.querySelector('[data-phase24l-panel="level"]')?.textContent.includes('EXP progress'),rank:inPanel('rank','[data-modal-act="ascend-fellow"]'),relics:inPanel('relics','[data-fellow-relic-profile]')&&inPanel('relics','[data-fellow-relic-select]')&&inPanel('relics','[data-fellow-relic-apply]'),bonds:inPanel('bonds','[data-phase24l-fellow-bonds]')};
  if(kind==='family')return{overview:inPanel('overview','.big-power'),gifts:inPanel('gifts','[data-modal-act="give-family-gift"]'),rank:inPanel('rank','[data-modal-act="ascend-family"]'),building:inPanel('building','[data-phase24l-family-building]')&&inPanel('building','[data-phase24l-family-building-select]')&&inPanel('building','[data-phase24l-family-building-apply]'),bonds:shell?.querySelector('[data-phase24l-panel="bonds"]')?.textContent.includes('Linked Fellow')};
  if(kind==='companion')return{overview:inPanel('overview','[data-phase24l-companion-overview]'),level:shell?.querySelector('[data-phase24l-panel="level"]')?.textContent.includes('EXP progress'),rank:inPanel('rank','[data-modal-act="ascend-companion"]'),assignment:inPanel('assignment','[data-phase24l-companion-assignment]')&&inPanel('assignment','[data-companion-assignment]')&&inPanel('assignment','[data-companion-assignment-save]'),mastery:inPanel('mastery','[data-phase24l-companion-mastery]')};
  return{overview:shell?.querySelector('[data-phase24l-panel="overview"]')?.textContent.includes('never enters a collectible roster'),objective:inPanel('overview','[data-phase24l-wayfarer-objective]'),rank:inPanel('rank','.player-rank'),unlocks:inPanel('unlocks','[data-phase24l-wayfarer-unlocks]'),chronicle:shell?.querySelector('[data-phase24l-panel="chronicle"]')?.textContent.includes('More → Chronicle'),settings:shell?.querySelector('[data-phase24l-panel="settings"]')?.textContent.includes('save export')};
 },kind);
}
function boundedAndNoScroll(panel){
 const tolerance=contract.limits.fitTolerancePx;
 return panel.count===1&&panel.panel.height<=panel.maxSheetHeight+tolerance&&panel.visibleArtHeight>=panel.minVisibleArtHeight-tolerance&&panel.panel.bottom<=panel.host.bottom+tolerance&&panel.scroll.panelScroll<=panel.scroll.panelClient&&panel.scroll.contentScroll<=panel.scroll.contentClient&&panel.overflow.panel==='hidden'&&panel.overflow.content==='hidden'&&panel.scroll.window===0&&panel.scroll.html===0&&panel.scroll.body===0;
}
function controlsInitiallyFit(panel){
 const all=[...panel.primary,...panel.interactive];
 return panel.primary.every(item=>item.present&&item.visible&&item.withinContent&&item.withinViewport)&&all.every(item=>!item.visible||(item.withinContent&&item.withinViewport));
}
function actionTargetsAreTappable(panel,minimumCount){
 return panel.actionTargets.length>=minimumCount&&panel.overlaps.length===0&&panel.actionTargets.every(item=>item.present&&item.visible&&item.withinContent&&item.withinViewport&&item.hit&&item.rect.width>=contract.limits.minimumTouchTargetPx&&item.rect.height>=contract.limits.minimumTouchTargetPx);
}
async function installWriteCounter(context){
 await context.addInitScript(()=>{
  const prior=Storage.prototype.setItem;
  Object.defineProperty(window,'__PHASE24L_WRITES__',{configurable:false,writable:true,value:0});
  Storage.prototype.setItem=function(...args){window.__PHASE24L_WRITES__++;return prior.apply(this,args)};
 });
}
async function exercise(browser,baseURL,viewport,reduced=false){
 const prefix=`${viewport.id}-${reduced?'reduced':'normal'}`,errors=[],failedRequests=[];
 const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:reduced?'reduce':'no-preference'});await installWriteCounter(context);
 const page=await context.newPage();page.setDefaultTimeout(15000);
 page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));
 page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
 page.on('requestfailed',request=>failedRequests.push(`${request.url()}:${request.failure()?.errorText||'failed'}`));
 const step=(id,pass,detail='')=>record(`${prefix}-${id}`,pass,detail);
 try{
  const response=await page.goto(`${baseURL}/index.html?phase24l=${prefix}`,{waitUntil:'domcontentloaded',timeout:60000});
  await dismiss(page);await page.waitForSelector('[data-phase24e-topbar]');await page.waitForTimeout(200);
  if(viewport.width===320)await page.evaluate(pixels=>document.documentElement.style.setProperty('--safe',`${pixels}px`),contract.limits.bottomSafeAreaProbePx);
  step('boot-current-schema',response?.ok()===true&&await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).schemaVersion===14,contract.storageKey));
  step('ordinary-realm-has-no-qa-bridge',await page.evaluate(()=>!Object.keys(window).some(name=>/^__EVERSTEAD.*QA/.test(name))&&window.__EVERSTEAD_RUNTIME__?.qa===undefined));
  step('no-failed-requests',failedRequests.length===0,failedRequests);
  for(const [kind,definition] of Object.entries(contract.profiles)){
   const invoker=await navigateRoster(page,kind,definition),attribute=kind==='wayfarer'?'data-player-profile':kind==='fellow'?'data-fellow':kind==='family'?'data-family':'data-companion';
   await invoker.focus();const invokerValue=await invoker.getAttribute(attribute),before=await storage(page,true);await invoker.click();
   await page.waitForSelector(`[data-phase24l-profile="${kind}"]`);await page.waitForTimeout(80);
   let shell=await shellEvidence(page,kind);const expected=definition.tabs;
   step(`${kind}-starts-as-art-only-five-tab-profile`,shell.kind===kind&&shell.active==='closed'&&shell.open==='false'&&shell.tabs.map(tab=>tab.id).join(',')===expected.join(',')&&shell.tabs.filter(tab=>tab.tabindex===0).length===1&&shell.tabs.every(tab=>tab.selected==='false'&&tab.expanded==='false')&&shell.panels.every(panel=>panel.hidden&&panel.ariaHidden==='true'),shell);
   step(`${kind}-keeps-top-rail-visible-and-profile-in-viewport`,shell.rail&&shell.overlay&&shell.shell&&shell.rail.top>=-1&&shell.rail.bottom<=shell.overlay.top+2&&shell.overlay.bottom<=shell.viewport.height+1&&shell.shell.bottom<=shell.viewport.height+1,shell);
   step(`${kind}-locks-document-scroll-without-horizontal-overflow`,shell.htmlClass&&shell.overflow.html==='hidden'&&shell.overflow.body==='hidden'&&!shell.horizontalOverflow&&Object.values(shell.scroll).every(value=>value===0),{overflow:shell.overflow,scroll:shell.scroll,horizontalOverflow:shell.horizontalOverflow});
   step(`${kind}-dock-and-close-meet-touch-targets`,shell.tabs.every(tab=>tab.rect.width>=contract.limits.minimumTouchTargetPx&&tab.rect.height>=contract.limits.minimumTouchTargetPx)&&shell.close?.width>=contract.limits.minimumTouchTargetPx&&shell.close?.height>=contract.limits.minimumTouchTargetPx,{tabs:shell.tabs.map(tab=>tab.rect),close:shell.close});
   const content=await contentEvidence(page,kind);step(`${kind}-compact-adapters-and-existing-actions-map-to-tabs`,Object.values(content).every(Boolean),content);
   const opened=[];let reducedMotionPass=true;
   for(const id of expected){
    await page.locator(`[data-phase24l-profile="${kind}"] [data-phase24l-profile-tab="${id}"]`).click();await page.waitForTimeout(reduced?30:240);
    const panel=await panelEvidence(page,kind,id,definition.primaryControls[id]);opened.push(panel.id===id&&panel.count===1);
    step(`${kind}-${id}-fits-without-panel-or-content-scroll`,boundedAndNoScroll(panel),panel);
    step(`${kind}-${id}-primary-controls-are-initially-visible`,controlsInitiallyFit(panel),{primary:panel.primary,interactive:panel.interactive,content:panel.content});
    if(!reduced&&((kind==='fellow'&&id==='relics')||(kind==='family'&&id==='building')||(kind==='companion'&&id==='assignment'))){
     const minimumCount=kind==='fellow'?3:2;step(`${kind}-${id}-controls-are-separated-hit-testable-44px-targets`,actionTargetsAreTappable(panel,minimumCount),{targets:panel.actionTargets,overlaps:panel.overlaps});
    }
    if(reduced)reducedMotionPass=reducedMotionPass&&String(panel.animation).split(',').every(value=>Number.parseFloat(value)===0)&&String(panel.transition).split(',').every(value=>Number.parseFloat(value)===0);
   }
   step(`${kind}-switching-every-tab-keeps-one-exclusive-sheet`,opened.every(Boolean),opened);
   if(reduced)step(`${kind}-reduced-motion-removes-sheet-animation`,reducedMotionPass);
   const last=expected.at(-1);await page.locator(`[data-phase24l-profile="${kind}"] [data-phase24l-profile-tab="${last}"]`).click();shell=await shellEvidence(page,kind);
   step(`${kind}-repeat-tab-collapses-sheet`,shell.active==='closed'&&shell.open==='false'&&shell.panels.every(item=>item.hidden)&&shell.tabs.find(tab=>tab.id===last)?.tabindex===0,shell);
   const tablist=page.locator(`[data-phase24l-profile="${kind}"] [data-phase24l-profile-dock]`),rovingTab=tablist.locator('[data-phase24l-profile-tab][tabindex="0"]');await rovingTab.focus();await page.keyboard.press('End');
   let keyboard=await page.evaluate(kind=>{const shell=document.querySelector(`[data-phase24l-profile="${kind}"]`);return{active:document.activeElement?.dataset.phase24lProfileTab,zero:[...shell.querySelectorAll('[data-phase24l-profile-tab]')].filter(tab=>tab.tabIndex===0).map(tab=>tab.dataset.phase24lProfileTab)}},kind),endKeyboard=keyboard;const endPass=keyboard.active===expected.at(-1)&&keyboard.zero.join(',')===expected.at(-1);
   await page.keyboard.press('Home');const homeKeyboard=await page.evaluate(kind=>{const shell=document.querySelector(`[data-phase24l-profile="${kind}"]`);return{active:document.activeElement?.dataset.phase24lProfileTab,zero:[...shell.querySelectorAll('[data-phase24l-profile-tab]')].filter(tab=>tab.tabIndex===0).map(tab=>tab.dataset.phase24lProfileTab)}},kind);await page.keyboard.press('ArrowRight');keyboard=await page.evaluate(kind=>{const shell=document.querySelector(`[data-phase24l-profile="${kind}"]`);return{active:document.activeElement?.dataset.phase24lProfileTab,zero:[...shell.querySelectorAll('[data-phase24l-profile-tab]')].filter(tab=>tab.tabIndex===0).map(tab=>tab.dataset.phase24lProfileTab)}},kind);
   step(`${kind}-dock-has-roving-keyboard-focus`,endPass&&homeKeyboard.active===expected[0]&&homeKeyboard.zero.join(',')===expected[0]&&keyboard.active===expected[1]&&keyboard.zero.join(',')===expected[1],{end:endKeyboard,home:homeKeyboard,right:keyboard});
   await page.keyboard.press('Tab');step(`${kind}-tab-focus-remains-inside-profile`,await page.evaluate(kind=>document.querySelector(`[data-phase24l-profile="${kind}"]`)?.contains(document.activeElement)===true,kind));
   await page.locator(`[data-phase24l-profile="${kind}"] [data-phase24l-profile-tab="${expected[1]}"]`).click();await page.keyboard.press('Escape');shell=await shellEvidence(page,kind);
   const firstEscape=shell.active==='closed'&&shell.open==='false'&&await page.locator(`[data-phase24l-profile="${kind}"]`).count()===1&&await page.evaluate(kind=>document.activeElement?.dataset.phase24lProfileTab===document.querySelector(`[data-phase24l-profile="${kind}"]`)?.dataset.phase24lRovingTab,kind);
   await page.keyboard.press('Escape');await page.waitForSelector(`[data-phase24l-profile="${kind}"]`,{state:'detached'});
   const focusReturned=await page.evaluate(({attribute,value})=>document.activeElement?.getAttribute?.(attribute)===value,{attribute,value:invokerValue}),after=await storage(page);
   step(`${kind}-escape-collapses-then-closes-and-returns-focus`,firstEscape&&focusReturned,{firstEscape,focusReturned});
   step(`${kind}-profile-navigation-is-byte-revision-write-neutral`,before.raw===after.raw&&before.revision===after.revision&&after.writes===0,{rawEqual:before.raw===after.raw,beforeRevision:before.revision,afterRevision:after.revision,writes:after.writes});
  }
 }catch(error){
  let diagnostic=null;try{diagnostic=await page.evaluate(()=>({url:location.href,body:document.body?.innerText?.replace(/\s+/g,' ').trim().slice(0,1800)||'',overlay:document.querySelector('#overlay')?.innerHTML?.slice(0,1000)||''}))}catch{}
  step('journey-fatal',false,{error:error.stack||error.message,diagnostic});
 }
 step('zero-warning-error-console',errors.length===0,errors);await context.close();
}

async function exerciseFamilyBuilding(browser,baseURL){
 const prefix='isolated-family-building',errors=[],context=await browser.newContext({viewport:{width:390,height:844}});await installWriteCounter(context);
 const page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',error=>errors.push(error.stack||error.message));page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`${message.type()}:${message.text()}`)});
 const step=(id,pass,detail='')=>record(`${prefix}-${id}`,pass,detail);
 const openBuildingPanel=async()=>{
  await dismiss(page);const invoker=await navigateRoster(page,'family',contract.profiles.family);await invoker.click();await page.waitForSelector('[data-phase24l-profile="family"]');
  const familyId=await page.locator('[data-phase24l-profile="family"]').getAttribute('data-phase24l-subject-id');await page.locator('[data-phase24l-profile="family"] [data-phase24l-profile-tab="building"]').click();await page.waitForSelector('[data-phase24l-panel="building"]:not([hidden])');return familyId;
 };
 try{
  await page.goto(`${baseURL}/index.html?phase24l=isolated-family-building`,{waitUntil:'domcontentloaded',timeout:60000});await dismiss(page);await page.waitForSelector('[data-phase24e-topbar]');
  const familyId=await openBuildingPanel(),select=page.locator(`[data-phase24l-family-building-select="${familyId}"]`),button=page.locator(`[data-phase24l-family-building-apply="${familyId}"]`),original=await select.inputValue();
  const beforeNoOp=await storage(page,true);await button.click();await page.waitForTimeout(100);const afterNoOp=await storage(page);
  step('same-building-apply-is-a-write-neutral-no-op',beforeNoOp.raw===afterNoOp.raw&&beforeNoOp.revision===afterNoOp.revision&&afterNoOp.writes===0,{rawEqual:beforeNoOp.raw===afterNoOp.raw,beforeRevision:beforeNoOp.revision,afterRevision:afterNoOp.revision,writes:afterNoOp.writes});
  await openBuildingPanel();const changedSelect=page.locator(`[data-phase24l-family-building-select="${familyId}"]`),options=await changedSelect.locator('option').evaluateAll(nodes=>nodes.map(node=>node.value)),alternate=options.find(value=>value&&value!==original);
  const beforeChanged=await storage(page,true);await changedSelect.selectOption(alternate);await page.locator(`[data-phase24l-family-building-apply="${familyId}"]`).click();await page.waitForTimeout(100);const afterChanged=await storage(page);
  step('changed-building-apply-persists-selected-assignment',Boolean(alternate)&&afterChanged.parsed?.family?.[familyId]?.assignedBuildingId===alternate&&afterChanged.revision>beforeChanged.revision&&afterChanged.writes>0,{familyId,original,alternate,beforeRevision:beforeChanged.revision,afterRevision:afterChanged.revision,writes:afterChanged.writes,assigned:afterChanged.parsed?.family?.[familyId]?.assignedBuildingId});
  await openBuildingPanel();await page.locator(`[data-phase24l-family-building-select="${familyId}"]`).selectOption(original);await page.locator(`[data-phase24l-family-building-apply="${familyId}"]`).click();await page.waitForTimeout(100);const restored=await storage(page);
  step('isolated-family-assignment-is-restored-before-context-disposal',restored.parsed?.family?.[familyId]?.assignedBuildingId===original,{familyId,original,assigned:restored.parsed?.family?.[familyId]?.assignedBuildingId});
 }catch(error){step('journey-fatal',false,error.stack||error.message)}
 step('zero-warning-error-console',errors.length===0,errors);await context.close();
}

const selectedViewports=process.env.PHASE24L_VIEWPORT?contract.viewports.filter(viewport=>viewport.id===process.env.PHASE24L_VIEWPORT):contract.viewports;
const selectedMotions=process.env.PHASE24L_MOTION==='normal'?[false]:process.env.PHASE24L_MOTION==='reduced'?[true]:[false,true];
if(!selectedViewports.length)throw new Error(`Unknown PHASE24L_VIEWPORT: ${process.env.PHASE24L_VIEWPORT}`);
const instance=server();let browser;
try{
 const baseURL=await listen(instance);browser=await chromium.launch({headless:true});
 for(const viewport of selectedViewports)for(const reduced of selectedMotions)await exercise(browser,baseURL,viewport,reduced);
 if(!process.env.PHASE24L_VIEWPORT&&!process.env.PHASE24L_MOTION)await exerciseFamilyBuilding(browser,baseURL);
}finally{if(browser)await browser.close();instance.closeAllConnections?.();await new Promise(resolve=>instance.close(resolve))}
const failed=rows.filter(row=>!row.pass);for(const row of failed)console.error(`FAIL ${row.id}${row.detail?` · ${row.detail}`:''}`);console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);if(failed.length)process.exitCode=1;
