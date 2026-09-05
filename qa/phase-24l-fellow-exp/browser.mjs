import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../..');
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));

/*
 * Bridge adapter: integration-specific names and argument conventions live here.
 * Production can align this one section without weakening scenario assertions.
 */
const BRIDGE=Object.freeze({
  global:contract.integration.productionBridge,
  read:Object.freeze({...contract.integration.adapter.read}),
  destructive:Object.freeze({...contract.integration.adapter.destructive}),
  args:Object.freeze({
    reset:fixture=>[fixture],
    activate:()=>[],
    credit:input=>[input],
    campaign:input=>[input],
    claim:input=>[input],
    spend:input=>[input],
    roundTripImport:version=>[version],
    recoverInterrupted:kind=>[kind],
    multiClient:kind=>[kind],
    tutorial:(action,id)=>[action,id],
    probeRefusal:kind=>[kind],
    fellow:id=>[id],
    preview:(id,mode)=>[id,mode]
  })
});

const rows=[];
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff2':'font/woff2'};

function server(){
  return http.createServer((request,response)=>{
    const url=new URL(request.url,'http://127.0.0.1');
    if(url.pathname==='/__phase24l_b1_host__.html'){
      const query=url.searchParams.get('query')||`qa=1&${contract.integration.queryKey}=${contract.integration.queryValue}`;
      response.writeHead(200,{'content-type':mime['.html'],'cache-control':'no-store'}).end(`<!doctype html><html style="width:100%;height:100%"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Phase 24L-B1 QA host</title><style>html,body{width:100%;height:100%;margin:0;overflow:hidden}#realm{display:block;width:100%;height:100%;border:0}</style></head><body><iframe id="realm" title="Everstead QA realm" src="/index.html?${query.replaceAll('&','&amp;')}"></iframe></body></html>`);
      return;
    }
    const relative=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).replace(/^\/+/,''),target=path.resolve(root,relative);
    if(target!==root&&!target.startsWith(root+path.sep)){response.writeHead(403).end();return}
    fs.readFile(target,(error,data)=>{if(error){response.writeHead(404).end();return}response.writeHead(200,{'content-type':mime[path.extname(target)]||'application/octet-stream','cache-control':'no-store'}).end(data)});
  });
}
async function listen(instance){await new Promise((resolve,reject)=>{instance.once('error',reject);instance.listen(0,'127.0.0.1',resolve)});return`http://127.0.0.1:${instance.address().port}`}

async function installIsolatedRuntime(context){
  await context.addInitScript(()=>{
    if(window===window.top){
      Object.defineProperty(window,'__P24LB1_SHARED__',{configurable:false,enumerable:false,writable:false,value:{slots:new Map(),writes:[],reads:[],removes:[],native:[],clients:new Set(),clientIndex:0,saveIndex:0,transactionIndex:0,now:1810000000000}});
      return;
    }
    const shared=window.top.__P24LB1_SHARED__,clientId=`phase24l-b1-client-${++shared.clientIndex}`;
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
      ids:{save:()=>`save-phase24l-b1-${++shared.saveIndex}`,transaction:()=>`tx-phase24l-b1-${++shared.transactionIndex}`},
      qa:{allowDestructive:true,isolatedStorage:true}
    };
    window.__P24LB1_CLIENT_ID__=clientId;
    window.__EVERSTEAD_PERSISTENCE_TEST__={storage:memory,operationLog:[],status:{}};
  });
}

async function realm(page,{requireBridge=true}={}){
  const handle=await page.waitForSelector('#realm'),frame=await handle.contentFrame();
  await frame.waitForLoadState('domcontentloaded',{timeout:120000});
  if(requireBridge)await frame.waitForFunction(name=>Boolean(window[name]),BRIDGE.global,{timeout:45000});
  return frame;
}
async function siblingRealm(page,id){
  await page.evaluate(({id,queryKey,queryValue})=>{const frame=document.createElement('iframe');frame.id=id;frame.title=id;frame.src=`/index.html?qa=1&${queryKey}=${queryValue}`;frame.style.cssText='width:390px;height:844px;border:0';document.body.appendChild(frame)},{id,queryKey:contract.integration.queryKey,queryValue:contract.integration.queryValue});
  const handle=await page.waitForSelector(`#${id}`),frame=await handle.contentFrame();
  await frame.waitForFunction(name=>Boolean(window[name]),BRIDGE.global,{timeout:45000});return frame;
}
async function invoke(frame,pathName,args=[]){
  return frame.evaluate(({globalName,pathName,args})=>{
    let method=window[globalName];for(const part of pathName.split('.'))method=method?.[part];
    if(typeof method!=='function')return{ok:false,reason:`missing-bridge-method:${pathName}`};
    try{return method(...args)}catch(error){return{ok:false,reason:String(error?.code||error?.message||error),stack:error?.stack}}
  },{globalName:BRIDGE.global,pathName,args});
}
const readCall=(frame,name,...args)=>invoke(frame,BRIDGE.read[name],BRIDGE.args[name]?BRIDGE.args[name](...args):args);
const destructive=(frame,name,...args)=>invoke(frame,BRIDGE.destructive[name],BRIDGE.args[name]?BRIDGE.args[name](...args):args);
const stateOf=result=>result?.state||result?.after||result?.snapshot?.state||null;
const rootOf=result=>stateOf(result)?.experienceProgression||result?.root||result?.experienceProgression||null;
const walletOf=result=>result?.wallet||rootOf(result)?.wallets?.fellow||result?.fellow||null;
const rawOf=result=>result?.raw??result?.snapshot?.raw??null;
const revisionOf=result=>result?.revision??stateOf(result)?.saveMeta?.revision??null;
const writesOf=result=>result?.writes??result?.writeCount??0;
const clone=value=>JSON.parse(JSON.stringify(value));
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const fellowProjection=(state,id)=>{const actor=state?.fellows?.[id];return actor&&{exp:actor.exp,level:actor.level,rarity:actor.rarity,shards:actor.shards,bond:actor.bond,relicSlots:actor.relicSlots}};
const fellowExpLevelProjection=state=>Object.fromEntries(Object.entries(state?.fellows||{}).sort(([left],[right])=>left.localeCompare(right)).map(([id,actor])=>[id,{exp:actor?.exp,level:actor?.level}]));
async function shared(page){return page.evaluate(()=>{const value=window.__P24LB1_SHARED__;return{writes:value.writes.length,reads:value.reads.length,removes:value.removes.length,native:value.native,slots:Object.fromEntries(value.slots)}})}

async function coreJourney(browser,baseURL){
  const context=await browser.newContext({viewport:{width:430,height:932}});await installIsolatedRuntime(context);
  const page=await context.newPage(),errors=[],requests=[];page.setDefaultTimeout(30000);
  page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));
  page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
  page.on('requestfailed',request=>requests.push(`${request.url()}:${request.failure()?.errorText||'failed'}`));
  const prefix='core',step=(id,pass,detail='')=>record(`${prefix}-${id}`,pass,detail);
  try{
    await page.goto(`${baseURL}/__phase24l_b1_host__.html`,{waitUntil:'domcontentloaded',timeout:120000});const frame=await realm(page);
    const descriptor=await frame.evaluate(name=>{const value=Object.getOwnPropertyDescriptor(window,name);return value&&{enumerable:value.enumerable,configurable:value.configurable,hasGetter:typeof value.get==='function'}},BRIDGE.global);
    step('bridge-is-hidden-query-gated-getter',descriptor?.enumerable===false&&descriptor?.hasGetter===true,descriptor);
    const gated=await context.newPage();await gated.goto(`${baseURL}/__phase24l_b1_host__.html?query=${encodeURIComponent('qa=1')}`,{waitUntil:'domcontentloaded',timeout:120000});const gatedFrame=await realm(gated,{requireBridge:false});step('bridge-absent-without-b1-scope',await gatedFrame.evaluate(name=>window[name]===undefined,BRIDGE.global));await gated.close();

    const reset=await destructive(frame,'reset','post-b0-play'),v1=await readCall(frame,'snapshot'),v1State=stateOf(v1),capturedBefore=fellowProjection(v1State,'cael'),companionsBefore=clone(v1State?.companions);
    step('post-b0-play-fixture-is-valid-root-v1',reset?.ok===true&&v1State?.schemaVersion===15&&v1State?.experienceProgression?.version===1,{reset,v1:v1State?.experienceProgression});
    const activated=await destructive(frame,'activate'),v2=await readCall(frame,'snapshot'),v2State=stateOf(v2),v2Root=rootOf(v2);
    step('activation-captures-late-invested-exp-without-changing-actors',activated?.ok===true&&v2Root?.version===2&&v2Root?.activation?.investedFellowExpById?.cael===capturedBefore?.exp&&same(fellowProjection(v2State,'cael'),capturedBefore)&&same(v2State?.companions,companionsBefore),{activated,capturedBefore,captured:v2Root?.activation?.investedFellowExpById?.cael});
    step('activation-starts-zero-fellow-and-companion-wallets',same(v2Root?.wallets?.fellow,{balance:0,creditedTotal:0,spentTotal:0})&&same(v2Root?.wallets?.companion,{balance:0,creditedTotal:0,spentTotal:0}),v2Root?.wallets);
    const repeat=await destructive(frame,'activate');step('activation-is-idempotent-zero-write-on-retry',repeat?.ok===true&&repeat?.changed===false&&writesOf(repeat)===0,repeat);
    step('activated-save-validates',(await readCall(frame,'validate'))?.ok===true,await readCall(frame,'validate'));

    const beforeCredit=await readCall(frame,'snapshot'),creditInput={route:'manual-reward-claim',sourceId:'qa.manual.first',historicalTargetId:'cael',rawAmount:999,authoredBps:333,collectionBps:667},credited=await destructive(frame,'credit',creditInput),afterCredit=await readCall(frame,'snapshot'),creditState=stateOf(afterCredit),creditRoot=rootOf(afterCredit),creditEntry=creditRoot?.ledger?.entries?.at(-1);
    step('manual-credit-settles-raw-plus-additive-bps-once',credited?.ok===true&&creditRoot?.wallets?.fellow?.balance===1098&&creditEntry?.rawAmount===999&&creditEntry?.authoredBps===333&&creditEntry?.collectionBps===667&&creditEntry?.awardedAmount===1098&&creditEntry?.rounding==='floor', {credited,entry:creditEntry,wallet:creditRoot?.wallets?.fellow});
    step('credit-does-not-auto-invest-into-target',same(stateOf(beforeCredit)?.fellows,creditState?.fellows));
    step('credit-preserves-companion-and-rank-domains',same(stateOf(beforeCredit)?.companions,creditState?.companions)&&same(stateOf(beforeCredit)?.player,creditState?.player)&&same(creditRoot?.wallets?.companion,{balance:0,creditedTotal:0,spentTotal:0}));
    const duplicate=await destructive(frame,'credit',creditInput);step('duplicate-credit-source-is-write-neutral',duplicate?.ok===false&&writesOf(duplicate)===0&&['duplicate-credit-source','source-consumed'].includes(duplicate?.reason),duplicate);
    const high=await destructive(frame,'credit',{...creditInput,sourceId:'qa.manual.plus-1000-percent',rawAmount:999,authoredBps:0,collectionBps:100000});step('plus-1000-percent-collection-credit-is-floor-settled',high?.ok===true&&high?.awardedAmount===10989,high);

    const campaignReset=await destructive(frame,'reset','campaign-ready');step('campaign-ready-fixture-installs',campaignReset?.ok===true,campaignReset);const campaignBefore=await readCall(frame,'snapshot'),campaign=await destructive(frame,'campaign',{kind:'first-clear'}),campaignAfter=await readCall(frame,'snapshot');
    const campaignBeforeState=stateOf(campaignBefore),campaignAfterState=stateOf(campaignAfter),campaignBeforeRoot=rootOf(campaignBefore),campaignAfterRoot=rootOf(campaignAfter),campaignReceipt=campaignAfterState?.fellowCampaign?.lastReceipt,campaignSideReceipt=campaignAfterState?.relicProgressLedger?.lastCampaignReceipt,campaignCredit=campaignAfterRoot?.ledger?.entries?.findLast?.(entry=>entry?.kind==='credit'&&entry?.source?.kind==='fellow-campaign'&&entry?.source?.id===campaignReceipt?.rewardIdentity);
    const shardDeltasMatch=Object.entries(campaignReceipt?.rewards?.fellowShards||{}).every(([id,amount])=>campaignAfterState?.fellows?.[id]?.shards===campaignBeforeState?.fellows?.[id]?.shards+amount);
    const relicDeltaMatches=campaignSideReceipt?.relicAcquired===true?campaignAfterState?.relics?.[campaignSideReceipt.targetRelicId]?.owned===true&&campaignAfterState?.relics?.[campaignSideReceipt.targetRelicId]?.level===1:same(campaignAfterState?.relics,campaignBeforeState?.relics);
    step('campaign-exp-enters-wallet-not-actor',campaign?.ok===true&&campaignCredit?.awardedAmount>0&&campaignAfterRoot?.wallets?.fellow?.balance===campaignBeforeRoot?.wallets?.fellow?.balance+campaignCredit.awardedAmount&&same(fellowExpLevelProjection(campaignBeforeState),fellowExpLevelProjection(campaignAfterState)),{campaign,credit:campaignCredit});
    step('campaign-preserves-non-exp-reward-route',Boolean(campaignReceipt&&campaignSideReceipt)&&shardDeltasMatch&&campaignAfterState?.gifts===campaignBeforeState?.gifts+campaignReceipt.rewards.gifts&&campaignAfterState?.player?.rankExp===campaignBeforeState?.player?.rankExp+campaignReceipt.rewards.rankExp&&campaignAfterState?.player?.rank>=campaignBeforeState?.player?.rank&&campaignAfterState?.gold===campaignBeforeState?.gold-campaignReceipt.effectiveCost&&campaignAfterState?.relicStones===campaignBeforeState?.relicStones+campaignSideReceipt.totalRelicStones&&relicDeltaMatches&&campaignAfterState?.fellowCampaign?.runOrdinal===campaignBeforeState?.fellowCampaign?.runOrdinal+1&&campaignReceipt.sequence===campaignAfterState?.fellowCampaign?.runOrdinal&&campaignCredit?.rawAmount===Object.values(campaignReceipt.rewards.fellowExp||{}).reduce((sum,amount)=>sum+amount,0),{campaign,receipt:campaignReceipt,sideReceipt:campaignSideReceipt,shardDeltasMatch,relicDeltaMatches});
    const campaignRetry=await destructive(frame,'campaign',{kind:'retry-same-source'});step('campaign-retry-cannot-double-credit',campaignRetry?.ok===false&&writesOf(campaignRetry)===0,campaignRetry);
    const replayCampaign=await destructive(frame,'campaign',{kind:'replay'});step('campaign-replay-uses-distinct-authentic-source',replayCampaign?.ok===true&&replayCampaign?.creditCount===1,replayCampaign);

    await destructive(frame,'reset','manual-claim-ready');const claimBefore=await readCall(frame,'snapshot'),claim=await destructive(frame,'claim',{kind:'fellow-exp'}),claimAfter=await readCall(frame,'snapshot');
    step('authored-manual-claim-credits-wallet-atomically',claim?.ok===true&&rootOf(claimAfter)?.wallets?.fellow?.balance>rootOf(claimBefore)?.wallets?.fellow?.balance&&same(stateOf(claimBefore)?.fellows,stateOf(claimAfter)?.fellows),claim);
    step('manual-claim-retry-is-exactly-once',writesOf(await destructive(frame,'claim',{kind:'fellow-exp'}))===0);

    await destructive(frame,'reset','partial-affordable');const partialBefore=await readCall(frame,'snapshot'),x1=await readCall(frame,'preview','cael','x1'),x10=await readCall(frame,'preview','cael','x10'),max=await readCall(frame,'preview','cael','max');
    step('x1-preview-prices-partial-next-level-gap',x1?.ok===true&&x1?.preview?.levels===1&&x1.preview.cost===x1.expectedExactCost,x1);
    step('x10-preview-is-greatest-affordable-up-to-ten',x10?.ok===true&&x10?.preview?.levels>=1&&x10.preview.levels<=10&&x10?.greatestAffordable===true,x10);
    step('max-preview-is-greatest-affordable-to-production-cap',max?.ok===true&&max?.greatestAffordable===true&&max?.preview?.after?.level<=max?.preview?.levelCap,max);
    const beforeSpendState=stateOf(partialBefore),spent=await destructive(frame,'spend',{fellowId:'cael',mode:'x1',preview:x1.preview}),afterSpend=await readCall(frame,'snapshot'),afterSpendState=stateOf(afterSpend),afterSpendRoot=rootOf(afterSpend);
    step('x1-spend-invests-exactly-previewed-exp',spent?.ok===true&&afterSpendState?.fellows?.cael?.exp===beforeSpendState?.fellows?.cael?.exp+x1.preview.cost&&afterSpendState.fellows.cael.level===x1.preview.after.level,spent);
    step('spend-preserves-wallet-remainder-and-rank-lane',afterSpendRoot?.wallets?.fellow?.balance===x1?.preview?.walletAfter&&afterSpendState?.fellows?.cael?.shards===beforeSpendState?.fellows?.cael?.shards&&afterSpendState?.fellows?.cael?.rarity===beforeSpendState?.fellows?.cael?.rarity);
    step('spend-preserves-companion-neutrality',same(afterSpendState?.companions,beforeSpendState?.companions)&&same(afterSpendRoot?.wallets?.companion,{balance:0,creditedTotal:0,spentTotal:0}));
    const duplicateSpend=await destructive(frame,'spend',{fellowId:'cael',mode:'x1',preview:x1.preview});step('duplicate-spend-request-is-write-neutral',duplicateSpend?.ok===false&&writesOf(duplicateSpend)===0,duplicateSpend);

    for(const kind of ['below-x1','at-cap','unavailable','stale-preview','malformed','overflow']){
      const refusal=await destructive(frame,'probeRefusal',kind);step(`${kind}-refusal-is-raw-revision-write-neutral`,refusal?.ok===false&&refusal?.rawUnchanged===true&&refusal?.revisionUnchanged===true&&writesOf(refusal)===0,refusal);
    }

    for(const version of [1,2,3,4]){
      const imported=await destructive(frame,'roundTripImport',version);step(`format${version}-import-reaches-valid-v2-or-authentic-v1`,imported?.ok===true&&imported?.terminalControlsClean===true&&imported?.validation?.ok===true&&[1,2].includes(imported?.rootVersion),imported);
    }
    for(const kind of ['credit-after-staging','spend-after-staging','activation-after-journal','safe-reset-after-active','previous-save']){
      const recovered=await destructive(frame,'recoverInterrupted',kind);step(`${kind}-recovers-one-valid-terminal-state`,recovered?.ok===true&&recovered?.terminalControlsClean===true&&recovered?.validation?.ok===true&&recovered?.exactlyOnce===true,recovered);
    }
    const reloaded=await destructive(frame,'reload'),reloadedState=await readCall(frame,'snapshot');step('reload-preserves-valid-wallet-ledger-and-actors',reloaded?.ok===true&&(await readCall(frame,'validate'))?.ok===true&&rootOf(reloadedState)?.version===2,reloaded);

    for(const kind of ['credit-credit','spend-spend','credit-spend']){
      const race=await destructive(frame,'multiClient',kind);step(`${kind}-multi-client-race-has-one-winner-and-zero-write-loser`,race?.ok===true&&race?.winnerCount===1&&race?.loserCount===1&&race?.loserWrites===0&&race?.validation?.ok===true,race);
    }

    await destructive(frame,'reset','tutorial-ready');const tutorialBefore=await readCall(frame,'tutorials'),tutorialCredit=await destructive(frame,'credit',{route:'manual-reward-claim',sourceId:'qa.tutorial.credit',historicalTargetId:'cael',rawAmount:1000,authoredBps:0,collectionBps:0}),tutorialAfterCredit=await readCall(frame,'tutorials');
    step('first-committed-credit-enables-versioned-tutorial',tutorialCredit?.ok===true&&tutorialAfterCredit?.firstCredit?.status==='available'&&tutorialAfterCredit?.firstCredit?.speakerRosterCurrent===true,{before:tutorialBefore,after:tutorialAfterCredit});
    const opened=await destructive(frame,'tutorial','open','first-credit'),skipped=await destructive(frame,'tutorial','skip','first-credit'),replayed=await destructive(frame,'tutorial','replay','first-credit');
    step('credit-tutorial-is-skippable-and-replayable',opened?.ok===true&&skipped?.ok===true&&replayed?.ok===true&&replayed?.replayCount===1,{opened,skipped,replayed});
    const tutorialPreview=await readCall(frame,'preview','cael','x1'),tutorialSpend=await destructive(frame,'spend',{fellowId:'cael',mode:'x1',preview:tutorialPreview.preview}),tutorialAfterSpend=await readCall(frame,'tutorials');
    step('first-affordable-spend-tutorial-follows-committed-spend',tutorialSpend?.ok===true&&tutorialAfterSpend?.firstAffordableSpend?.status==='available'&&tutorialAfterSpend?.firstAffordableSpend?.speakerRosterCurrent===true,tutorialAfterSpend);
    const refusedTutorial=await destructive(frame,'probeRefusal','stale-tutorial-spend');step('refused-stale-rollback-cannot-complete-tutorial',refusedTutorial?.ok===false&&refusedTutorial?.tutorialUnchanged===true&&writesOf(refusedTutorial)===0,refusedTutorial);

    const finalShared=await shared(page);step('all-destructive-tests-use-isolated-memory-not-native-storage',finalShared.native.length===0,finalShared.native);
    step('no-warning-error-console-or-request-failures',errors.length===0&&requests.length===0,{errors,requests});
  }catch(error){step('journey-fatal',false,{error:error.stack||error.message,errors,requests})}
  await context.close();
}

async function viewportJourney(browser,baseURL,viewport){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height}});await installIsolatedRuntime(context);
  const page=await context.newPage(),errors=[];page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.stack||error.message));page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`${message.type()}:${message.text()}`)});
  const prefix=`viewport-${viewport.id}`,step=(id,pass,detail='')=>record(`${prefix}-${id}`,pass,detail);
  try{
    await page.goto(`${baseURL}/__phase24l_b1_host__.html`,{waitUntil:'domcontentloaded',timeout:120000});const frame=await realm(page);
    await destructive(frame,'reset','partial-affordable');await destructive(frame,'reload');
    await frame.locator('.bottom-nav [data-nav="fellows"]').click();await frame.waitForSelector('[data-phase24e-roster-owner]');
    const invoker=frame.locator('[data-fellow]').first();await invoker.click();await frame.waitForSelector(contract.integration.selectors.profile);
    await frame.locator(`${contract.integration.selectors.profile} ${contract.integration.selectors.levelTab}`).click();await frame.waitForSelector(`${contract.integration.selectors.levelPanel}:not([hidden])`);
    const evidence=await frame.evaluate(selectors=>{
      const profile=document.querySelector(selectors.profile),panel=profile?.querySelector(selectors.levelPanel),wallet=profile?.querySelector(selectors.wallet),invested=profile?.querySelector(selectors.invested),modes=[...profile?.querySelectorAll(selectors.mode)||[]],commit=profile?.querySelector(selectors.commit),root=document.documentElement,body=document.body;
      const box=node=>node?(()=>{const rect=node.getBoundingClientRect(),style=getComputedStyle(node);return{top:rect.top,bottom:rect.bottom,left:rect.left,right:rect.right,width:rect.width,height:rect.height,overflowY:style.overflowY}})():null;
      const rootStyle=getComputedStyle(root),bodyStyle=getComputedStyle(body);
      return{document:{scrollHeight:root.scrollHeight,clientHeight:root.clientHeight,bodyScrollHeight:body.scrollHeight,bodyClientHeight:body.clientHeight,scrollY,profileOpen:root.classList.contains('phase24l-profile-open'),rootOverflowY:rootStyle.overflowY,bodyOverflowY:bodyStyle.overflowY},profile:box(profile),panel:box(panel),wallet:box(wallet),invested:box(invested),modes:modes.map(box),commit:box(commit),modeCount:modes.length,visibleText:panel?.innerText||''};
    },contract.integration.selectors);
    await frame.evaluate(()=>scrollTo(0,1000));await frame.waitForTimeout(25);const scrollAfterAttempt=await frame.evaluate(()=>scrollY);
    step('profile-level-sheet-is-document-no-scroll',evidence.document.scrollHeight<=evidence.document.clientHeight+1&&evidence.document.scrollY===0&&scrollAfterAttempt===0&&evidence.document.profileOpen===true&&evidence.document.rootOverflowY==='hidden'&&evidence.document.bodyOverflowY==='hidden',{...evidence.document,scrollAfterAttempt});
    step('wallet-invested-and-preview-fit-inside-visible-panel',Boolean(evidence.wallet&&evidence.invested&&evidence.panel)&&evidence.wallet.top>=evidence.panel.top&&evidence.invested.bottom<=evidence.panel.bottom&&evidence.commit?.bottom<=evidence.panel.bottom,evidence);
    step('x1-x10-max-and-commit-are-44px-touch-targets',evidence.modeCount===3&&evidence.modes.every(item=>item.height>=44&&item.width>=44)&&evidence.commit?.height>=44&&evidence.commit?.width>=44,evidence);
    step('player-facing-copy-distinguishes-shared-and-invested-exp',/shared fellow exp/i.test(evidence.visibleText)&&/invested exp/i.test(evidence.visibleText),evidence.visibleText);
    const before=await shared(page);await frame.locator(`${contract.integration.selectors.profile} [data-phase24l-exp-mode="x10"]`).click();await frame.waitForTimeout(50);const after=await shared(page);
    step('switching-preview-mode-does-not-write',after.writes===before.writes,{before:before.writes,after:after.writes});
    const pressed=await frame.locator(`${contract.integration.selectors.profile} [data-phase24l-exp-mode="x10"]`).getAttribute('aria-pressed');step('selected-mode-is-accessibly-exposed',pressed==='true',pressed);
    const focusable=await frame.evaluate(selectors=>{const profile=document.querySelector(selectors.profile),commit=profile?.querySelector(selectors.commit);commit?.focus();return profile?.contains(document.activeElement)===true&&document.activeElement===commit},contract.integration.selectors);step('commit-control-is-keyboard-focusable-inside-profile',focusable);
    await page.keyboard.press('Escape');const collapsed=await frame.locator(`${contract.integration.selectors.levelPanel}:not([hidden])`).count()===0;step('escape-collapses-local-level-sheet',collapsed);
    step('zero-warning-error-console',errors.length===0,errors);
    const storage=await shared(page);step('viewport-journey-never-touches-native-storage',storage.native.length===0,storage.native);
  }catch(error){step('journey-fatal',false,{error:error.stack||error.message,errors})}
  await context.close();
}

async function realClientRace(browser,baseURL){
  const context=await browser.newContext({viewport:{width:860,height:932}});await installIsolatedRuntime(context);const page=await context.newPage(),errors=[];page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.stack||error.message));
  const step=(id,pass,detail='')=>record(`real-clients-${id}`,pass,detail);
  try{
    await page.goto(`${baseURL}/__phase24l_b1_host__.html`,{waitUntil:'domcontentloaded',timeout:120000});const clientA=await realm(page);await destructive(clientA,'reset','partial-affordable');
    const clientB=await siblingRealm(page,'client-b');await destructive(clientB,'reload');const beforeA=await readCall(clientA,'snapshot'),beforeB=await readCall(clientB,'snapshot');
    step('share-one-authentic-starting-revision',revisionOf(beforeA)===revisionOf(beforeB)&&rawOf(beforeA)===rawOf(beforeB),{a:revisionOf(beforeA),b:revisionOf(beforeB)});
    const stalePreview=await readCall(clientB,'preview','cael','x1'),writeStart=(await shared(page)).writes,winner=await destructive(clientA,'credit',{route:'manual-reward-claim',sourceId:'qa.real-client-winner',historicalTargetId:'cael',rawAmount:1,authoredBps:0,collectionBps:0});
    await clientB.waitForTimeout(100);const afterWinnerWrites=(await shared(page)).writes,loser=await destructive(clientB,'spend',{fellowId:'cael',mode:'x1',preview:stalePreview.preview}),afterLoserWrites=(await shared(page)).writes;
    step('winner-commits-one-current-action',winner?.ok===true&&afterWinnerWrites>writeStart,winner);
    step('stale-second-client-is-refused-before-write',loser?.ok===false&&afterLoserWrites===afterWinnerWrites,loser);
    await destructive(clientA,'reload');step('winning-installation-remains-valid',(await readCall(clientA,'validate'))?.ok===true,await readCall(clientA,'validate'));
    const storage=await shared(page);step('race-never-touches-native-storage',storage.native.length===0,storage.native);step('zero-page-errors',errors.length===0,errors);
  }catch(error){step('journey-fatal',false,{error:error.stack||error.message,errors})}
  await context.close();
}

const WORKER_FLAG='EVERSTEAD_PHASE24L_B1_BROWSER_WORKER',PLAYWRIGHT_MODULE=process.env.EVERSTEAD_PLAYWRIGHT_MODULE||'playwright',HARD_TIMEOUT_MS=15*60*1000;
const progress=message=>console.error(`[phase24l-b1] ${new Date().toISOString()} ${message}`);
const bounded=(promise,ms,label)=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(`${label} timed out after ${ms}ms`)),ms);Promise.resolve(promise).then(value=>{clearTimeout(timer);resolve(value)},error=>{clearTimeout(timer);reject(error)})});

async function runWorker(){
  const instance=server();let browser;
  try{
    progress('starting isolated HTTP server');
    const baseURL=await bounded(listen(instance),10000,'HTTP server startup');
    progress(`HTTP server ready at ${baseURL}; loading Playwright`);
    const {chromium}=await import(PLAYWRIGHT_MODULE);
    progress('Playwright loaded; launching Chromium');
    browser=await chromium.launch({headless:true,timeout:45000});
    progress('Chromium ready; running core journey');
    await coreJourney(browser,baseURL);
    for(const viewport of contract.viewports){progress(`running ${viewport.id} viewport journey`);await viewportJourney(browser,baseURL,viewport)}
    progress('running independent two-client journey');
    await realClientRace(browser,baseURL);
    progress('all journeys completed; shutting down');
  }catch(error){record('browser-suite-fatal',false,error.stack||error.message)}
  finally{
    if(browser)try{await bounded(browser.close(),15000,'Chromium shutdown')}catch(error){record('browser-shutdown-fatal',false,error.stack||error.message)}
    instance.closeAllConnections?.();
    if(instance.listening)try{await bounded(new Promise((resolve,reject)=>instance.close(error=>error?reject(error):resolve())),10000,'HTTP server shutdown')}catch(error){record('server-shutdown-fatal',false,error.stack||error.message)}
  }

  const failed=rows.filter(row=>!row.pass);
  for(const row of failed)console.error(`FAIL ${row.id}${row.detail?` · ${row.detail}`:''}`);
  console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
  if(failed.length)process.exitCode=1;
}

async function supervise(){
  progress(`starting supervised browser worker (hard timeout ${HARD_TIMEOUT_MS/60000} minutes)`);
  const child=spawn(process.execPath,[fileURLToPath(import.meta.url)],{cwd:process.cwd(),env:{...process.env,[WORKER_FLAG]:'1'},stdio:'inherit'});
  let timedOut=false,forceTimer;
  const hardTimer=setTimeout(()=>{
    timedOut=true;progress('browser worker exceeded hard timeout; terminating it');child.kill('SIGTERM');
    forceTimer=setTimeout(()=>child.kill('SIGKILL'),5000);forceTimer.unref?.();
  },HARD_TIMEOUT_MS);
  const result=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',(code,signal)=>resolve({code,signal}))});
  clearTimeout(hardTimer);if(forceTimer)clearTimeout(forceTimer);
  if(timedOut){console.error('FAIL browser-suite-hard-timeout');process.exitCode=1;return}
  if(result.signal){console.error(`FAIL browser-worker-signal · ${result.signal}`);process.exitCode=1;return}
  process.exitCode=result.code??1;
}

if(process.env[WORKER_FLAG]==='1')await runWorker();else await supervise();
