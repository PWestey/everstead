import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));
const rows=[];
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff2':'font/woff2'};
const S=contract.integration.selectors;

function server(){
  return http.createServer((request,response)=>{
    const url=new URL(request.url,'http://127.0.0.1');
    if(url.pathname==='/__phase24l_b2_host__.html'){
      const publicRealm=url.searchParams.get('public')==='1';
      const query=`${publicRealm?'':'qa=1&'}${contract.integration.queryKey}=${contract.integration.queryValue}`;
      response.writeHead(200,{'content-type':mime['.html'],'cache-control':'no-store'}).end(`<!doctype html><html style="width:100%;height:100%"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Phase 24L-B2 QA host</title><style>html,body{width:100%;height:100%;margin:0;overflow:hidden}#realm{display:block;width:100%;height:100%;border:0}</style></head><body><iframe id="realm" title="Everstead Phase 24L-B2 QA realm" src="/index.html?${query.replaceAll('&','&amp;')}"></iframe></body></html>`);
      return;
    }
    const relative=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).replace(/^\/+/,''),target=path.resolve(root,relative);
    if(target!==root&&!target.startsWith(root+path.sep)){response.writeHead(403).end();return}
    fs.readFile(target,(error,data)=>{if(error){response.writeHead(404).end();return}response.writeHead(200,{'content-type':mime[path.extname(target)]||'application/octet-stream','cache-control':'no-store'}).end(data)});
  });
}
async function listen(instance){await new Promise((resolve,reject)=>{instance.once('error',reject);instance.listen(0,'127.0.0.1',resolve)});return`http://127.0.0.1:${instance.address().port}`}

async function installIsolatedRuntime(context,{authorized=true,initialSlots={}}={}){
  await context.addInitScript(config=>{
    if(window===window.top){
      Object.defineProperty(window,'__P24LB2_SHARED__',{configurable:false,enumerable:false,writable:false,value:{slots:new Map(Object.entries(config.initialSlots||{})),writes:[],reads:[],removes:[],native:[],clients:new Set(),clientIndex:0,saveIndex:0,transactionIndex:0,now:1810000000000}});
      return;
    }
    const shared=window.top.__P24LB2_SHARED__,clientId=`phase24l-b2-client-${++shared.clientIndex}`;
    shared.clients.add(window);
    const nativeGet=Storage.prototype.getItem,nativeSet=Storage.prototype.setItem,nativeRemove=Storage.prototype.removeItem;
    Storage.prototype.getItem=function(...args){shared.native.push(['getItem',String(args[0])]);return nativeGet.apply(this,args)};
    Storage.prototype.setItem=function(...args){shared.native.push(['setItem',String(args[0])]);return nativeSet.apply(this,args)};
    Storage.prototype.removeItem=function(...args){shared.native.push(['removeItem',String(args[0])]);return nativeRemove.apply(this,args)};
    const notify=(key,oldValue,newValue,source=window)=>{for(const peer of shared.clients){if(peer===source||peer.closed)continue;setTimeout(()=>{try{peer.dispatchEvent(new peer.StorageEvent('storage',{key,oldValue,newValue,url:peer.location.href,storageArea:peer.localStorage}))}catch{}},0)}};
    const memory=Object.freeze({
      getItem(key){key=String(key);shared.reads.push([key,clientId]);return shared.slots.get(key)??null},
      setItem(key,value){key=String(key);value=String(value);const oldValue=shared.slots.get(key)??null;shared.writes.push([key,value,clientId]);shared.slots.set(key,value);notify(key,oldValue,value)},
      removeItem(key){key=String(key);const oldValue=shared.slots.get(key)??null;shared.removes.push([key,clientId]);shared.slots.delete(key);notify(key,oldValue,null)}
    });
    const nativeSetTimeout=setTimeout.bind(window),nativeClearTimeout=clearTimeout.bind(window);
    window.__EVERSTEAD_RUNTIME__={
      storage:memory,
      clock:{now:()=>shared.now,setTimeout:nativeSetTimeout,clearTimeout:nativeClearTimeout},
      random:()=>.4375,
      confirm:()=>true,
      ids:{save:()=>`save-phase24l-b2-${++shared.saveIndex}`,transaction:()=>`tx-phase24l-b2-${++shared.transactionIndex}`}
    };
    if(config.authorized)window.__EVERSTEAD_RUNTIME__.qa={allowDestructive:true,isolatedStorage:true};
    window.__EVERSTEAD_PERSISTENCE_TEST__={storage:memory,operationLog:[],status:{}};
  },{authorized,initialSlots});
}

async function realm(page,{requireB1Bridge=true}={}){
  const handle=await page.waitForSelector('#realm'),frame=await handle.contentFrame();
  await frame.waitForLoadState('domcontentloaded',{timeout:120000});
  await frame.waitForFunction(({bridge,runtime,result,requireB1Bridge})=>Boolean(window[runtime])&&Boolean(window[result])&&(!requireB1Bridge||Boolean(window[bridge])),{bridge:contract.integration.b1Bridge,runtime:contract.candidate.global,result:contract.candidate.resultGlobal,requireB1Bridge},{timeout:60000});
  return frame;
}
async function invoke(frame,pathName,args=[]){
  return frame.evaluate(({globalName,pathName,args})=>{
    let method=window[globalName];for(const part of pathName.split('.'))method=method?.[part];
    if(typeof method!=='function')return{ok:false,reason:`missing-bridge-method:${pathName}`};
    try{return method(...args)}catch(error){return{ok:false,reason:String(error?.code||error?.message||error),stack:error?.stack}}
  },{globalName:contract.integration.b1Bridge,pathName,args});
}
const readSnapshot=frame=>invoke(frame,'read.snapshot');
const destructive=(frame,name,...args)=>invoke(frame,`destructive.${name}`,args);
const stateOf=value=>value?.state||value?.after||value?.snapshot?.state||null;
const rawOf=value=>value?.raw??value?.snapshot?.raw??null;
const revisionOf=value=>value?.revision??stateOf(value)?.saveMeta?.revision??null;
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const fellowLevels=state=>Object.fromEntries(Object.entries(state?.fellows||{}).map(([id,item])=>[id,{exp:item.exp,level:item.level}]));
async function shared(page){return page.evaluate(()=>{const value=window.__P24LB2_SHARED__;return{writes:value.writes.length,reads:value.reads.length,removes:value.removes.length,native:value.native.slice(),slots:Object.fromEntries(value.slots)}})}
async function checkpoint(page,frame){
  const snapshot=await readSnapshot(frame),memory=await shared(page);
  if(snapshot?.ok!==false&&stateOf(snapshot))return{raw:rawOf(snapshot),revision:revisionOf(snapshot),state:stateOf(snapshot),writes:memory.writes};
  const raw=memory.slots[contract.storageKey]??null;let state=null;try{state=raw?JSON.parse(raw):null}catch{}
  return{raw,revision:state?.saveMeta?.revision??null,state,writes:memory.writes};
}
const neutral=(before,after)=>before.raw===after.raw&&before.revision===after.revision&&before.writes===after.writes;

async function dismissBlockingOverlays(frame){
  for(let count=0;count<40;count++){
    const status=await frame.evaluate(()=>{
      const shown=node=>{if(!node)return false;const rect=node.getBoundingClientRect(),style=getComputedStyle(node);return !node.hidden&&rect.width>0&&rect.height>0&&style.display!=='none'&&style.visibility!=='hidden'};
      const overlay=[...document.querySelectorAll('[data-overlay]')].filter(shown).at(-1);if(!overlay)return'done';
      const close=[...overlay.querySelectorAll('[data-modal-close],[data-phase13-story="skip"],[data-phase13-tutorial-action="skip"],[data-phase15-tutorial-action="skip"],[data-phase16-tutorial-action="skip"]')].find(shown);
      if(close){close.click();return'clicked'}
      document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));return'escaped';
    });
    if(status==='done')return true;
    await frame.waitForTimeout(60);
  }
  return false;
}
async function pressEscape(frame){await frame.evaluate(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true})));await frame.waitForTimeout(40)}
async function visibleCount(frame,selector){return frame.evaluate(selector=>[...document.querySelectorAll(selector)].filter(node=>{const rect=node.getBoundingClientRect(),style=getComputedStyle(node);return !node.hidden&&rect.width>0&&rect.height>0&&style.display!=='none'&&style.visibility!=='hidden'}).length,selector)}
async function navigate(frame,view){await frame.locator(`.bottom-nav [data-nav="${view}"]`).click();await frame.waitForSelector(view==='fellows'?S.fellowship:S.adventure)}
async function closeGuide(frame,speaker){
  const count=await visibleCount(frame,S.guide);if(count!==1)return{present:false,count};
  const evidence=await frame.evaluate(({guide,close,speaker})=>{const node=[...document.querySelectorAll(guide)].find(item=>!item.hidden&&item.getBoundingClientRect().height>0),button=node?.querySelector(close),rect=button?.getBoundingClientRect(),normalized=(node?.textContent||'').replaceAll('’',"'");return{text:normalized,speaker:normalized.includes(speaker.replaceAll('’',"'")),close:Boolean(button),touch:Boolean(rect&&rect.width>=44&&rect.height>=44)}},{guide:S.guide,close:S.guideClose,speaker});
  if(evidence.close)await frame.locator(`${S.guide}:not([hidden]) ${S.guideClose}`).click();
  await frame.waitForTimeout(40);
  return{present:true,count,evidence,closed:await visibleCount(frame,S.guide)===0};
}
async function documentEvidence(frame){
  const before=await frame.evaluate(()=>({x:scrollX,y:scrollY}));
  await frame.evaluate(()=>scrollTo(1000,1000));await frame.waitForTimeout(20);
  return frame.evaluate(before=>{
    const rect=node=>node?(()=>{const value=node.getBoundingClientRect();return{top:value.top,bottom:value.bottom,left:value.left,right:value.right,width:value.width,height:value.height}})():null;
    const html=document.documentElement,body=document.body,app=document.querySelector('#app'),rail=document.querySelector('.topbar'),dock=document.querySelector('.bottom-nav'),htmlStyle=getComputedStyle(html),bodyStyle=getComputedStyle(body),appStyle=getComputedStyle(app);
    return{before,after:{x:scrollX,y:scrollY},classed:html.classList.contains('phase24l-b2-active'),overflow:{html:[htmlStyle.overflowX,htmlStyle.overflowY],body:[bodyStyle.overflowX,bodyStyle.overflowY],app:[appStyle.overflowX,appStyle.overflowY]},rail:rect(rail),dock:rect(dock),viewport:{width:innerWidth,height:innerHeight},horizontal:html.scrollWidth<=innerWidth+2};
  },before);
}
function documentLocked(value){return value.classed&&value.after.x===0&&value.after.y===0&&value.overflow.html[1]==='hidden'&&value.overflow.body[1]==='hidden'&&value.rail?.top>=-2&&value.rail?.bottom<=value.viewport.height&&value.dock?.top>=0&&value.dock?.bottom<=value.viewport.height+2&&value.horizontal}
async function panelEvidence(frame,screenSelector,id){
  return frame.evaluate(({screenSelector,id,localPanel,localTab})=>{
    const screen=document.querySelector(screenSelector),shown=node=>{if(!node)return false;const rect=node.getBoundingClientRect(),style=getComputedStyle(node);return !node.hidden&&rect.width>0&&rect.height>0&&style.display!=='none'&&style.visibility!=='hidden'},box=node=>node?(()=>{const rect=node.getBoundingClientRect();return{top:rect.top,bottom:rect.bottom,left:rect.left,right:rect.right,width:rect.width,height:rect.height}})():null;
    const panel=screen?.querySelector(`${localPanel}[data-phase24l-local-panel="${id}"]`),tab=screen?.querySelector(`${localTab}[data-phase24l-local-tab="${id}"]`),visiblePanels=[...screen?.querySelectorAll(localPanel)||[]].filter(shown);
    return{id,present:Boolean(panel&&tab),visible:shown(panel),visibleCount:visiblePanels.length,panel:box(panel),tab:box(tab),selected:tab?.getAttribute('aria-selected'),expanded:tab?.getAttribute('aria-expanded'),controls:tab?.getAttribute('aria-controls'),panelId:panel?.id||null,overflowY:panel?getComputedStyle(panel).overflowY:null,viewport:{width:innerWidth,height:innerHeight}};
  },{screenSelector,id,localPanel:S.localPanel,localTab:S.localTab});
}
async function ensurePanel(frame,screenSelector,id){
  let evidence=await panelEvidence(frame,screenSelector,id);
  if(!evidence.visible){
    const tab=frame.locator(`${screenSelector} ${S.localTab}[data-phase24l-local-tab="${id}"]`);
    if(await tab.count()!==1)return{...evidence,reason:'missing-local-control'};
    await tab.click();await frame.waitForTimeout(40);evidence=await panelEvidence(frame,screenSelector,id);
  }
  return evidence;
}
function boundedPanel(value){return value.present&&value.visible&&value.visibleCount===1&&value.selected==='true'&&value.expanded==='true'&&value.controls===value.panelId&&value.tab?.width>=contract.limits.minimumTouchTargetPx&&value.tab?.height>=contract.limits.minimumTouchTargetPx&&value.panel?.top>=-contract.limits.fitTolerancePx&&value.panel?.bottom<=value.viewport.height+contract.limits.fitTolerancePx&&value.panel.height<=value.viewport.height*contract.limits.maximumPanelViewportRatio+contract.limits.fitTolerancePx}
async function fellowshipPanelState(frame){
  return frame.evaluate(({root,localPanel,localTab})=>{
    const screen=document.querySelector(root),shown=node=>{if(!node)return false;const rect=node.getBoundingClientRect(),style=getComputedStyle(node);return !node.hidden&&rect.width>0&&rect.height>0&&style.display!=='none'&&style.visibility!=='hidden'};
    const panels=[...screen?.querySelectorAll(localPanel)||[]].map(node=>({id:node.dataset.phase24lLocalPanel,visible:shown(node)}));
    const tabs=[...screen?.querySelectorAll(localTab)||[]].map(node=>({id:node.dataset.phase24lLocalTab,selected:node.getAttribute('aria-selected'),expanded:node.getAttribute('aria-expanded')}));
    return{active:screen?.dataset.phase24lActivePanel,sheetOpen:screen?.dataset.phase24lSheetOpen,visible:panels.filter(item=>item.visible).map(item=>item.id),tabs};
  },{root:S.fellowship,localPanel:S.localPanel,localTab:S.localTab});
}
function fellowshipStateMatches(value,active){
  return value.active===(active||'closed')&&value.sheetOpen===String(Boolean(active))&&value.visible.length===(active?1:0)&&(!active||value.visible[0]===active)&&value.tabs.every(item=>item.selected===String(item.id===active)&&item.expanded===String(item.id===active));
}

async function fellowshipJourney(page,frame,viewport,step){
  await dismissBlockingOverlays(frame);const before=await checkpoint(page,frame);
  await navigate(frame,'fellows');
  const guide=await closeGuide(frame,contract.fellowship.guideSpeaker);
  step('fellowship-first-visit-has-tavi-guide',guide.present&&guide.count===1&&guide.evidence?.speaker&&guide.evidence?.touch&&guide.closed,guide);
  let doc=await documentEvidence(frame);step('fellowship-locks-document-and-keeps-rails-visible',documentLocked(doc),doc);
  const dock=await frame.evaluate(({root,dock})=>{const screen=document.querySelector(root),buttons=[...screen?.querySelectorAll(`${dock} [data-roster]`)||[]],rects=buttons.map(button=>{const rect=button.getBoundingClientRect();return{top:rect.top,bottom:rect.bottom,left:rect.left,right:rect.right,width:rect.width,height:rect.height}}),globalNav=document.querySelector('.bottom-nav')?.getBoundingClientRect();return{count:buttons.length,ids:buttons.map(button=>button.dataset.roster),rects,roles:buttons.map(button=>button.getAttribute('role')),oneRow:new Set(rects.map(rect=>Math.round(rect.top))).size===1,aboveGlobalNav:rects.every(rect=>globalNav&&rect.bottom<=globalNav.top+2),globalNavTop:globalNav?.top,heroHidden:Boolean(screen?.querySelector('[data-phase24k-fellowship-hero]')?.hidden||screen?.querySelector('[data-phase24k-fellowship-hero]')&&getComputedStyle(screen.querySelector('[data-phase24k-fellowship-hero]')).display==='none')}} ,{root:S.fellowship,dock:S.rosterDock});
  step('fellowship-is-direct-four-tab-one-row-roster-above-global-nav',dock.count===4&&dock.ids.join(',')===contract.fellowship.rosters.map(item=>item.id).join(',')&&dock.rects.every(rect=>rect.width>=44&&rect.height>=44)&&dock.oneRow&&dock.aboveGlobalNav&&dock.heroHidden,dock);

  const rosterResults=[];
  for(const roster of contract.fellowship.rosters){
    const button=frame.locator(`${S.rosterDock} [data-roster="${roster.id}"]`);await button.focus();await button.press('Enter');await frame.waitForSelector(`${S.fellowship} ${S.rosterScroll}`);await frame.waitForTimeout(40);
    const evidence=await frame.evaluate(({root,scroll,card,expected,columns,id,dock})=>{const screen=document.querySelector(root),lane=screen?.querySelector(scroll),cards=[...lane?.querySelectorAll(card)||[]].filter(item=>!item.hidden),positions=[...new Set(cards.slice(0,Math.min(cards.length,columns)).map(item=>Math.round(item.getBoundingClientRect().left)))],style=lane?getComputedStyle(lane):null,active=screen?.querySelector(`[data-roster="${id}"]`),laneRect=lane?.getBoundingClientRect(),dockRect=screen?.querySelector(dock)?.getBoundingClientRect(),globalRect=document.querySelector('.bottom-nav')?.getBoundingClientRect(),names=cards.slice(0,Math.min(6,cards.length)).map(item=>{const node=item.querySelector('.char-copy h3,h3'),rect=node?.getBoundingClientRect(),nameStyle=node?getComputedStyle(node):null;return{width:rect?.width,height:rect?.height,writingMode:nameStyle?.writingMode,text:(node?.textContent||'').trim()}}),directStrays=[...screen?.querySelectorAll(':scope > .card,:scope > [data-phase23-tutorial-card]')||[]].filter(node=>!node.closest(scroll)&&!node.closest('[data-phase24l-local-panel]')).length;return{count:cards.length,expected,columns:positions.length,overflowY:style?.overflowY,clientHeight:lane?.clientHeight,scrollHeight:lane?.scrollHeight,usableHeight:laneRect?.height,dockBelowLane:Boolean(laneRect&&dockRect&&dockRect.top>=laneRect.bottom-2),dockAboveGlobal:Boolean(dockRect&&globalRect&&dockRect.bottom<=globalRect.top+2),names,directStrays,activeSelected:active?.getAttribute('aria-selected'),activeClass:active?.classList.contains('on')}} ,{root:S.fellowship,scroll:S.rosterScroll,card:roster.card,expected:roster.expectedCount,columns:viewport.columns,id:roster.id,dock:S.rosterDock});
    rosterResults.push({id:roster.id,...evidence});
  }
  step('all-current-rosters-switch-through-keyboard-controller',rosterResults.every(item=>item.count===item.expected&&item.columns===viewport.columns&&(item.activeSelected==='true'||item.activeClass===true)),rosterResults);
  step('all-rosters-keep-a-usable-gallery-above-the-local-and-global-docks',rosterResults.every(item=>item.usableHeight>=140&&item.dockBelowLane&&item.dockAboveGlobal),rosterResults);
  step('companion-gallery-has-no-stray-direct-cards-or-crushed-name-columns',rosterResults.every(item=>item.directStrays===0&&item.names.every(name=>name.width>=48&&name.height>=10&&name.height<60&&name.writingMode==='horizontal-tb')),rosterResults);

  await frame.locator(`${S.rosterDock} [data-roster="fellows"]`).click();await frame.waitForTimeout(40);
  const scrollBeforeProfile=await frame.evaluate(scroll=>{const lane=document.querySelector(scroll);lane.scrollTop=lane.scrollHeight;return{top:lane.scrollTop,max:lane.scrollHeight-lane.clientHeight,overflow:getComputedStyle(lane).overflowY,client:lane.clientHeight,total:lane.scrollHeight}},S.rosterScroll);
  const last=frame.locator(`${S.rosterScroll} [data-fellow]`).last();await last.click();await frame.waitForSelector('[data-phase24l-profile="fellow"]');await pressEscape(frame);await frame.waitForSelector('[data-phase24l-profile="fellow"]',{state:'detached'});
  const scrollAfterProfile=await frame.evaluate(scroll=>document.querySelector(scroll)?.scrollTop??null,S.rosterScroll);
  step('roster-is-internally-scrollable-and-profile-return-preserves-position',scrollBeforeProfile.max>0&&['auto','scroll'].includes(scrollBeforeProfile.overflow)&&scrollBeforeProfile.top>0&&Math.abs(scrollAfterProfile-scrollBeforeProfile.top)<=2,{before:scrollBeforeProfile,after:scrollAfterProfile});

  const utilities=[];
  for(const id of contract.fellowship.utilityPanels){const panel=await ensurePanel(frame,S.fellowship,id);utilities.push(panel)}
  step('fellowship-utilities-use-one-bounded-exclusive-panel',utilities.every(boundedPanel),utilities);
  const lastUtility=[...utilities].reverse().find(item=>item.present)?.id;
  if(lastUtility)await frame.locator(`${S.fellowship} ${S.localTab}[data-phase24l-local-tab="${lastUtility}"]`).click();
  await frame.waitForTimeout(30);
  step('repeating-selected-fellowship-control-collapses-panel',await visibleCount(frame,`${S.fellowship} ${S.localPanel}`)===0);
  await frame.locator(`${S.fellowship} ${S.localTab}[data-phase24l-local-tab="notice"]`).click();await frame.waitForTimeout(30);
  const noticeOpen=await fellowshipPanelState(frame);
  await frame.locator(`${S.fellowship} [data-phase24k-panel-toggle="might"]`).click();await frame.waitForTimeout(30);
  const mightOpen=await fellowshipPanelState(frame);
  await frame.locator(`${S.fellowship} [data-phase24k-panel-toggle="path"]`).click();await frame.waitForTimeout(30);
  const pathOpen=await fellowshipPanelState(frame);
  await frame.locator(`${S.fellowship} [data-phase24k-panel-toggle="path"]`).click();await frame.waitForTimeout(30);
  const pathClosed=await fellowshipPanelState(frame);
  step('inherited-might-and-path-controls-enforce-exclusive-local-panel-state',fellowshipStateMatches(noticeOpen,'notice')&&fellowshipStateMatches(mightOpen,'might')&&fellowshipStateMatches(pathOpen,'path')&&fellowshipStateMatches(pathClosed,null),{noticeOpen,mightOpen,pathOpen,pathClosed});
  await frame.locator(`${S.fellowship} ${S.localTab}[data-phase24l-local-tab="might"]`).click();await pressEscape(frame);
  step('escape-closes-fellowship-panel-before-navigation',await visibleCount(frame,`${S.fellowship} ${S.localPanel}`)===0);
  const guideBefore=await checkpoint(page,frame);await frame.locator(`${S.fellowship} ${S.guideOpen}`).click();const replay=await closeGuide(frame,contract.fellowship.guideSpeaker),guideAfter=await checkpoint(page,frame);
  step('fellowship-guide-is-replayable-and-save-neutral',replay.present&&replay.evidence?.speaker&&neutral(guideBefore,guideAfter),{replay,before:{revision:guideBefore.revision,writes:guideBefore.writes},after:{revision:guideAfter.revision,writes:guideAfter.writes}});
  const after=await checkpoint(page,frame);step('all-fellowship-presentation-actions-are-byte-revision-write-neutral',neutral(before,after),{before:{revision:before.revision,writes:before.writes},after:{revision:after.revision,writes:after.writes},rawEqual:before.raw===after.raw});
}

async function runVisibleCampaignStoryAndClear(frame){
  const before=await readSnapshot(frame),beforeState=stateOf(before),events=[];
  const beforeRun=beforeState?.fellowCampaign?.runOrdinal??0,beforeWallet=beforeState?.experienceProgression?.wallets?.fellow?.balance??0;
  for(let attempt=0;attempt<16;attempt++){
    const story=frame.locator('[data-overlay]:visible [data-phase13-story="skip"]:visible');
    if(await story.count()){
      const title=(await frame.locator('[data-overlay]:visible').last().textContent()||'').replace(/\s+/g,' ').trim().slice(0,180);
      events.push({kind:'story',title});await story.last().click();await frame.waitForTimeout(160);continue;
    }
    const tutorial=frame.locator('[data-overlay]:visible [data-phase24l-b1-tutorial] button:visible,[data-phase24l-b1-tutorial]:visible button:visible');
    if(await tutorial.count()){events.push({kind:'tutorial'});await tutorial.last().click();await frame.waitForTimeout(120);continue}
    const after=await readSnapshot(frame),afterState=stateOf(after),afterRun=afterState?.fellowCampaign?.runOrdinal??0,afterWallet=afterState?.experienceProgression?.wallets?.fellow?.balance??0;
    if(afterRun>beforeRun&&afterWallet>beforeWallet){await dismissBlockingOverlays(frame);return{ok:true,storySeen:events.some(item=>item.kind==='story'),beforeRun,afterRun,beforeWallet,afterWallet,events}}
    const action=await ensurePanel(frame,S.adventure,'action');if(!action.visible)return{ok:false,reason:'action-panel-unavailable',events};
    const button=frame.locator(`${S.adventure} ${S.localPanel}[data-phase24l-local-panel="action"] [data-campaign-run]`);
    if(await button.count()!==1)return{ok:false,reason:'campaign-action-missing',events};
    const buttonState={disabled:await button.isDisabled(),aria:await button.getAttribute('aria-disabled'),text:(await button.textContent())?.replace(/\s+/g,' ').trim()};
    if(buttonState.disabled||buttonState.aria==='true')return{ok:false,reason:'campaign-action-disabled',button:buttonState,events};
    await button.click({force:true});events.push({kind:'campaign-click',button:buttonState});await frame.waitForTimeout(240);
  }
  const after=await readSnapshot(frame),afterState=stateOf(after);return{ok:false,reason:'story-first-campaign-action-did-not-resolve',storySeen:events.some(item=>item.kind==='story'),beforeRun,afterRun:afterState?.fellowCampaign?.runOrdinal??0,beforeWallet,afterWallet:afterState?.experienceProgression?.wallets?.fellow?.balance??0,events};
}
async function selectAdventureRoute(frame,id){
  const routes=await ensurePanel(frame,S.adventure,'routes');if(!routes.visible)return{ok:false,reason:'routes-panel-unavailable'};
  const button=frame.locator(`${S.adventure} ${S.localPanel}[data-phase24l-local-panel="routes"] [data-adventure="${id}"]`);
  if(await button.count()!==1)return{ok:false,reason:'route-control-missing'};
  const before={disabled:await button.isDisabled(),aria:await button.getAttribute('aria-disabled'),rank:await button.getAttribute('data-rank-required')};
  await button.focus();await button.press('Enter');await frame.waitForTimeout(60);
  const active=await frame.evaluate(id=>document.querySelector(`[data-adventure="${id}"]`)?.classList.contains('on')===true,id);
  return{ok:active,before};
}
async function routeEvidence(frame,route){
  return frame.evaluate(({root,localPanel,localTab,route,sharedReward,routeControl})=>{
    const screen=document.querySelector(root),inside=(panel,selector)=>[...screen?.querySelectorAll(selector)||[]].every(node=>Boolean(node.closest(`${localPanel}[data-phase24l-local-panel="${panel}"]`))),count=selector=>screen?.querySelectorAll(selector).length??0,state=selector=>[...screen?.querySelectorAll(selector)||[]].map(node=>({disabled:Boolean(node.disabled),aria:node.getAttribute('aria-disabled'),text:(node.textContent||'').replace(/\s+/g,' ').trim().slice(0,120)}));
    return{route:route.id,active:screen?.querySelector(`${routeControl}[data-adventure="${route.id}"]`)?.classList.contains('on')===true,primary:route.primary.map(selector=>({selector,count:count(selector),inside:inside('action',selector),state:state(selector)})),stages:route.stages.map(selector=>({selector,count:count(selector),inside:inside('stages',selector),state:state(selector)})),records:route.records.map(selector=>({selector,count:count(selector),inside:inside('records',selector)})),reward:{count:count(sharedReward),inside:inside('rewards',sharedReward)},routes:{count:count(routeControl),inside:inside('routes',routeControl)},panels:[...screen?.querySelectorAll(localPanel)||[]].map(node=>node.dataset.phase24lLocalPanel),tabs:[...screen?.querySelectorAll(localTab)||[]].map(node=>node.dataset.phase24lLocalTab)};
  },{root:S.adventure,localPanel:S.localPanel,localTab:S.localTab,route,sharedReward:contract.adventure.sharedReward,routeControl:contract.adventure.routeControl});
}
function routeMapped(value,route){return value.active&&value.reward.count===1&&value.reward.inside&&value.routes.count===contract.adventure.routes.length&&value.routes.inside&&contract.adventure.panels.every(id=>value.panels.includes(id)&&value.tabs.includes(id))&&value.primary.every(item=>item.count>0&&item.inside)&&value.stages.every(item=>item.count>0&&item.inside)&&value.records.every(item=>item.count>0&&item.inside)}

async function adventureJourney(page,frame,step){
  await dismissBlockingOverlays(frame);const start=await checkpoint(page,frame);await navigate(frame,'adventure');
  const guide=await closeGuide(frame,contract.adventure.guideSpeaker);const afterGuide=await checkpoint(page,frame);
  step('adventure-first-visit-has-vex-guide-without-save-write',guide.present&&guide.count===1&&guide.evidence?.speaker&&guide.evidence?.touch&&guide.closed&&neutral(start,afterGuide),guide);
  let action=await ensurePanel(frame,S.adventure,'action');step('adventure-opens-one-bounded-action-panel-by-default',boundedPanel(action),action);
  const dock=await frame.evaluate(({root,tab,expected})=>{const nodes=[...document.querySelector(root)?.querySelectorAll(tab)||[]];return{ids:nodes.map(node=>node.dataset.phase24lLocalTab),touch:nodes.map(node=>{const rect=node.getBoundingClientRect();return[rect.width,rect.height]}),expected}}, {root:S.adventure,tab:S.localTab,expected:contract.adventure.panels});
  step('adventure-dock-has-five-44px-controls',dock.ids.join(',')===contract.adventure.panels.join(',')&&dock.touch.every(([width,height])=>width>=44&&height>=44),dock);
  let doc=await documentEvidence(frame);step('adventure-locks-document-and-keeps-rails-visible',documentLocked(doc),doc);

  await frame.waitForFunction(selector=>{const image=document.querySelector(selector);return Boolean(image?.complete&&image.naturalWidth)},contract.adventure.wayfarerCutout,{timeout:10000}).catch(()=>{});
  const preWayfarer=await checkpoint(page,frame),wayfarer=await frame.evaluate(({cutout,profile})=>{const image=document.querySelector(cutout),badge=document.querySelector('[data-phase24k-wayfarer-badge]'),top=[...document.querySelectorAll(profile)].find(node=>node.closest('.topbar'));return{cutout:[image?.naturalWidth,image?.naturalHeight],badge:Boolean(badge),top:Boolean(top),collectible:Boolean(document.querySelector('[data-fellow="wayfarer"],[data-family="wayfarer"],[data-companion="wayfarer"]'))}}, {cutout:contract.adventure.wayfarerCutout,profile:contract.adventure.wayfarerProfile});
  await frame.locator('[data-phase24k-wayfarer-badge]').click();await frame.waitForSelector('[data-phase24l-profile="wayfarer"]');await frame.waitForFunction(()=>{const image=document.querySelector('[data-phase24l-profile="wayfarer"] img');return Boolean(image?.complete&&image.naturalWidth)},null,{timeout:10000}).catch(()=>{});const profile=await frame.evaluate(()=>{const shell=document.querySelector('[data-phase24l-profile="wayfarer"]'),img=shell?.querySelector('img'),rect=img?.getBoundingClientRect();return{nonRoster:shell?.dataset.playerRosterMember,natural:[img?.naturalWidth,img?.naturalHeight],height:rect?.height}});await pressEscape(frame);await frame.waitForFunction(()=>{const shell=document.querySelector('[data-phase24l-profile="wayfarer"]');return !shell||shell.dataset.phase24lSheetOpen==='false'||shell.dataset.phase24lActivePanel==='closed'||shell.hidden===true},{timeout:10000});const closed=await frame.evaluate(()=>{const shell=document.querySelector('[data-phase24l-profile="wayfarer"]');return!shell||shell.dataset.phase24lSheetOpen==='false'||shell.dataset.phase24lActivePanel==='closed'||shell.hidden===true});const outerClose=frame.locator('[data-overlay]:visible [data-modal-close]:visible');if(await outerClose.count())await outerClose.last().click();await frame.waitForTimeout(60);const postWayfarer=await checkpoint(page,frame);
  step('wayfarer-art-and-profile-remain-non-collectible-and-save-neutral',wayfarer.cutout[0]===1024&&wayfarer.cutout[1]===1536&&wayfarer.badge&&!wayfarer.collectible&&profile.nonRoster==='false'&&profile.natural[0]===1024&&profile.natural[1]===1536&&closed&&neutral(preWayfarer,postWayfarer),{wayfarer,profile,closed});

  const routeCheckpoint=await checkpoint(page,frame),rank=routeCheckpoint.state?.player?.rank??1;
  const routeState=await frame.evaluate(({root,routeControl,rank})=>{const nodes=[...document.querySelector(root)?.querySelectorAll(routeControl)||[]];return{rank,items:nodes.map(node=>{const required=Number(node.dataset.rankRequired||1),disabled=Boolean(node.disabled);return{id:node.dataset.adventure,required,disabled,aria:node.getAttribute('aria-disabled'),expectedDisabled:rank<required}})}},{root:S.adventure,routeControl:contract.adventure.routeControl,rank});
  step('public-adventure-exposes-all-current-route-controls-with-coherent-locks',routeState.items.map(item=>item.id).join(',')===contract.adventure.routes.map(item=>item.id).join(',')&&routeState.items.every(item=>(item.disabled||item.aria==='true')===item.expectedDisabled&&(!item.expectedDisabled?item.aria!== 'true':item.aria==='true')),routeState);

  await selectAdventureRoute(frame,'fellowCampaign');const localStart=await checkpoint(page,frame);
  const panels=[];
  for(const id of contract.adventure.panels)panels.push(await ensurePanel(frame,S.adventure,id));
  step('adventure-panels-replace-each-other-and-stay-bounded',panels.every(boundedPanel),panels);
  const last=contract.adventure.panels.at(-1);await frame.locator(`${S.adventure} ${S.localTab}[data-phase24l-local-tab="${last}"]`).click();await frame.waitForTimeout(30);
  step('repeating-selected-adventure-control-collapses-panel',await visibleCount(frame,`${S.adventure} ${S.localPanel}`)===0);
  await frame.locator(`${S.adventure} ${S.localTab}[data-phase24l-local-tab="records"]`).click();await pressEscape(frame);
  step('escape-closes-adventure-panel-before-route-navigation',await visibleCount(frame,`${S.adventure} ${S.localPanel}`)===0);
  const guideStart=await checkpoint(page,frame);await frame.locator(`${S.adventure} ${S.guideOpen}`).click();const replay=await closeGuide(frame,contract.adventure.guideSpeaker),guideEnd=await checkpoint(page,frame);
  step('adventure-guide-is-replayable-and-save-neutral',replay.present&&replay.evidence?.speaker&&neutral(guideStart,guideEnd),{replay,before:{revision:guideStart.revision,writes:guideStart.writes},after:{revision:guideEnd.revision,writes:guideEnd.writes}});
  const afterPresentation=await checkpoint(page,frame);step('adventure-local-presentation-is-byte-revision-write-neutral',neutral(localStart,afterPresentation),{before:{revision:localStart.revision,writes:localStart.writes},after:{revision:afterPresentation.revision,writes:afterPresentation.writes},rawEqual:localStart.raw===afterPresentation.raw});
}

async function authorizedRouteJourney(frame,step){
  await dismissBlockingOverlays(frame);await navigate(frame,'adventure');await closeGuide(frame,contract.adventure.guideSpeaker);
  const routeRows=[];
  for(const route of contract.adventure.routes){
    const selected=await selectAdventureRoute(frame,route.id);await frame.waitForSelector(S.adventure);const routeDoc=await documentEvidence(frame);
    if(route.id==='fellowExpedition'){
      const lock=await frame.evaluate(({root,localPanel})=>{const button=document.querySelector(`${root} ${localPanel}[data-phase24l-local-panel="routes"] [data-adventure="fellowExpedition"]`);return{text:(button?.textContent||'').replace(/\s+/g,' ').trim(),disabled:Boolean(button?.disabled),aria:button?.getAttribute('aria-disabled'),rank:button?.getAttribute('data-rank-required')}},{root:S.adventure,localPanel:S.localPanel});
      routeRows.push({route:route.id,selected,lock,locked:documentLocked(routeDoc),expectedLocked:selected.before.disabled&&selected.before.aria==='true'&&selected.before.rank==='5'&&lock.aria==='true'&&lock.rank==='5'&&/(?:rank\s*5|r5)/i.test(lock.text)});continue;
    }
    const evidence=await routeEvidence(frame,route);routeRows.push({route:route.id,selected,evidence,locked:documentLocked(routeDoc),mapped:routeMapped(evidence,route)});
  }
  step('current-unlocked-routes-map-and-expedition-remains-visible-rank5-locked',routeRows.every(item=>item.locked&&(item.route==='fellowExpedition'?item.expectedLocked:item.selected.ok&&!item.selected.before.disabled&&item.mapped)),routeRows);
}

async function authorizedGameplayJourney(page,frame,step){
  const storyReset=await destructive(frame,'reset','tutorial-ready');await dismissBlockingOverlays(frame);await navigate(frame,'adventure');await closeGuide(frame,contract.adventure.guideSpeaker);
  const action=await ensurePanel(frame,S.adventure,'action'),binding=await frame.locator(`${S.adventure} ${S.localPanel}[data-phase24l-local-panel="action"] [data-campaign-run]`).evaluate(node=>{const rect=node.getBoundingClientRect();return{connected:node.isConnected,onclick:typeof node.onclick,disabled:Boolean(node.disabled),aria:node.getAttribute('aria-disabled'),rect:[rect.left,rect.top,rect.width,rect.height],insideAction:Boolean(node.closest('[data-phase24l-local-panel="action"]'))}});
  step('story-first-campaign-action-remains-the-real-bound-moved-control',storyReset?.ok===true&&action.visible&&binding.connected&&binding.onclick==='function'&&!binding.disabled&&binding.aria!=='true'&&binding.rect[2]>=44&&binding.rect[3]>=44&&binding.insideAction,{storyReset:{ok:storyReset?.ok,fixture:storyReset?.fixture},action,binding});

  const campaignReset=await destructive(frame,'reset','campaign-ready'),beforeClears=await readSnapshot(frame),beforeState=stateOf(beforeClears),campaignResults=[await destructive(frame,'campaign',{kind:'first-clear'})];
  const afterClears=await readSnapshot(frame),afterState=stateOf(afterClears),walletBefore=beforeState?.experienceProgression?.wallets?.fellow?.balance,walletAfter=afterState?.experienceProgression?.wallets?.fellow?.balance;
  step('b1-campaign-credits-wallet-without-auto-level',campaignReset?.ok===true&&campaignResults[0]?.ok===true&&campaignResults[0]?.creditCount===1&&walletAfter>walletBefore&&same(fellowLevels(beforeState),fellowLevels(afterState)),{campaign:campaignResults[0],beforeRank:beforeState?.player?.rank,afterRank:afterState?.player?.rank,walletBefore,walletAfter});
  await authorizedRouteJourney(frame,step);
  await destructive(frame,'reset','partial-affordable');const beforeSpend=await readSnapshot(frame),preview=await invoke(frame,'read.preview',['cael','x1']),spent=await destructive(frame,'spend',{fellowId:'cael',mode:'x1',preview:preview.preview}),afterSpend=await readSnapshot(frame),beforeSpendState=stateOf(beforeSpend),afterSpendState=stateOf(afterSpend);
  step('explicit-level-investment-remains-the-only-b1-spend-path',preview?.ok===true&&spent?.ok===true&&afterSpendState?.fellows?.cael?.exp===beforeSpendState?.fellows?.cael?.exp+preview.preview.cost&&afterSpendState?.fellows?.cael?.level===preview.preview.after.level&&afterSpendState?.experienceProgression?.wallets?.fellow?.balance===preview.preview.walletAfter&&afterSpendState?.fellows?.cael?.rarity===beforeSpendState?.fellows?.cael?.rarity&&afterSpendState?.fellows?.cael?.shards===beforeSpendState?.fellows?.cael?.shards,{preview,spent});
}

function watchPage(page){
  const errors=[],requests=[];page.setDefaultTimeout(30000);
  page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));
  page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
  page.on('response',response=>{if(response.status()>=400)requests.push(`${response.status()}:${response.url()}`)});
  page.on('requestfailed',request=>requests.push(`${request.url()}:${request.failure()?.errorText||'failed'}`));
  return{errors,requests};
}

async function viewportJourney(browser,baseURL,viewport){
  const prefix=viewport.id,step=(id,pass,detail='')=>record(`${prefix}-${id}`,pass,detail);
  let authContext,publicContext,authPage,publicPage,activeFrame;
  try{
    authContext=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:'reduce'});await installIsolatedRuntime(authContext,{authorized:true});authPage=await authContext.newPage();const authWatch=watchPage(authPage);
    await authPage.goto(`${baseURL}/__phase24l_b2_host__.html`,{waitUntil:'domcontentloaded',timeout:120000});const authFrame=await realm(authPage);activeFrame=authFrame;await dismissBlockingOverlays(authFrame);
    await authorizedGameplayJourney(authPage,authFrame,step);const authMemory=await shared(authPage),privateRequests=authWatch.requests.filter(item=>/\/private-assets\/companions\/[^/]+\/(?:thumb|full)\.webp/.test(item)),unexpectedRequests=authWatch.requests.filter(item=>!privateRequests.includes(item)),unexpectedErrors=authWatch.errors.filter(item=>!/^console\.error:Failed to load resource: the server responded with a status of 404 \(Not Found\)$/.test(item));
    step('authorized-fixture-realm-never-accesses-native-storage',authMemory.native.length===0,authMemory.native);step('authorized-gameplay-has-no-unexpected-runtime-or-request-failures',unexpectedErrors.length===0&&unexpectedRequests.length===0&&authWatch.errors.length<=privateRequests.length,{unexpectedErrors,unexpectedRequests,privateRequests});
    await authContext.close();authContext=null;

    publicContext=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:'reduce'});await installIsolatedRuntime(publicContext,{authorized:false});publicPage=await publicContext.newPage();const publicWatch=watchPage(publicPage);
    const response=await publicPage.goto(`${baseURL}/__phase24l_b2_host__.html?public=1`,{waitUntil:'domcontentloaded',timeout:120000}),frame=await realm(publicPage,{requireB1Bridge:false});activeFrame=frame;await dismissBlockingOverlays(frame);
    const install=await frame.evaluate(({runtime,result,id})=>{const api=window[runtime],outcome=window[result],runtimeDescriptor=Object.getOwnPropertyDescriptor(window,runtime),resultDescriptor=Object.getOwnPropertyDescriptor(window,result);return{api:{version:api?.version,id:api?.id,frozen:Object.isFrozen(api)},outcome,descriptors:{runtime:runtimeDescriptor&&{enumerable:runtimeDescriptor.enumerable,writable:runtimeDescriptor.writable,configurable:runtimeDescriptor.configurable},result:resultDescriptor&&{enumerable:resultDescriptor.enumerable,writable:resultDescriptor.writable,configurable:resultDescriptor.configurable}},id}}, {runtime:contract.candidate.global,result:contract.candidate.resultGlobal,id:contract.candidate.id});
    step('runtime-and-read-only-install-result-are-ready',response?.ok()===true&&install.api.version===1&&install.api.id===contract.candidate.id&&install.api.frozen&&install.outcome?.ok===true&&install.outcome?.id===contract.candidate.id&&install.outcome?.saveChanged===false&&install.descriptors.runtime?.enumerable===false&&install.descriptors.runtime?.writable===false&&install.descriptors.result?.enumerable===false&&install.descriptors.result?.writable===false,install);
    await fellowshipJourney(publicPage,frame,viewport,step);
    await adventureJourney(publicPage,frame,step);
    const memory=await shared(publicPage);step('public-presentation-realm-never-accesses-native-storage',memory.native.length===0,memory.native);step('public-presentation-has-zero-warning-error-or-request-failures',publicWatch.errors.length===0&&publicWatch.requests.length===0,publicWatch);
  }catch(error){let diagnostic=null;try{diagnostic=await activeFrame?.evaluate(()=>({url:location.href,ready:document.readyState,bodyChildren:document.body?.childElementCount,nav:document.querySelectorAll('.bottom-nav [data-nav]').length,screens:document.querySelectorAll('[data-phase24l-game-screen]').length,text:document.body?.innerText?.replace(/\s+/g,' ').trim().slice(0,2000)}))}catch{}step('journey-fatal',false,{error:error.stack||error.message,diagnostic})}
  if(authContext)await authContext.close();if(publicContext)await publicContext.close();
}

const WORKER_FLAG='EVERSTEAD_PHASE24L_B2_BROWSER_WORKER';
const PLAYWRIGHT_MODULE=process.env.EVERSTEAD_PLAYWRIGHT_MODULE||'playwright';
const progress=message=>console.error(`[phase24l-b2] ${new Date().toISOString()} ${message}`);
const bounded=(promise,ms,label)=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(`${label} timed out after ${ms}ms`)),ms);Promise.resolve(promise).then(value=>{clearTimeout(timer);resolve(value)},error=>{clearTimeout(timer);reject(error)})});

async function runWorker(){
  const instance=server();let browser;
  try{
    const baseURL=await bounded(listen(instance),10000,'HTTP server startup');
    progress(`server ready at ${baseURL}; loading Chromium`);
    const {chromium}=await import(PLAYWRIGHT_MODULE);browser=await chromium.launch({headless:true,timeout:45000});
    const selected=process.env.EVERSTEAD_PHASE24L_B2_VIEWPORT,viewports=selected?contract.viewports.filter(item=>item.id===selected):contract.viewports;
    if(!viewports.length)throw new Error(`Unknown Phase 24L-B2 viewport: ${selected}`);
    for(const viewport of viewports){progress(`running ${viewport.id}`);await viewportJourney(browser,baseURL,viewport)}
  }catch(error){record('browser-suite-fatal',false,error.stack||error.message)}
  finally{
    if(browser)try{await bounded(browser.close(),15000,'Chromium shutdown')}catch(error){record('browser-shutdown-fatal',false,error.stack||error.message)}
    instance.closeAllConnections?.();if(instance.listening)try{await bounded(new Promise((resolve,reject)=>instance.close(error=>error?reject(error):resolve())),10000,'HTTP server shutdown')}catch(error){record('server-shutdown-fatal',false,error.stack||error.message)}
  }
  const failed=rows.filter(row=>!row.pass);for(const row of failed)console.error(`FAIL ${row.id}${row.detail?` · ${row.detail}`:''}`);console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);if(failed.length)process.exitCode=1;
}
async function supervise(){
  progress(`starting supervised browser worker (hard timeout ${contract.limits.browserHardTimeoutMs/60000} minutes)`);
  const child=spawn(process.execPath,[fileURLToPath(import.meta.url)],{cwd:process.cwd(),env:{...process.env,[WORKER_FLAG]:'1'},stdio:'inherit'});let timedOut=false,forceTimer;
  const hardTimer=setTimeout(()=>{timedOut=true;progress('browser worker exceeded hard timeout; terminating it');child.kill('SIGTERM');forceTimer=setTimeout(()=>child.kill('SIGKILL'),5000);forceTimer.unref?.()},contract.limits.browserHardTimeoutMs);
  const result=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',(code,signal)=>resolve({code,signal}))});clearTimeout(hardTimer);if(forceTimer)clearTimeout(forceTimer);
  if(timedOut){console.error('FAIL browser-suite-hard-timeout');process.exitCode=1;return}if(result.signal){console.error(`FAIL browser-worker-signal · ${result.signal}`);process.exitCode=1;return}process.exitCode=result.code??1;
}

if(process.env[WORKER_FLAG]==='1')await runWorker();else await supervise();
