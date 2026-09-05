import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {
  assignments,
  companionActors,
  companionExpLevels,
  companionExpThreshold,
  fellowAuthority,
  neutralProgression,
  same,
  settledCredit,
  walletAlgebra
} from './fixtures.mjs';

const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../..');
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));

/*
 * C1 bridge adapter. Production method names and argument conventions are kept in
 * this one block so the QA surface can be wired without weakening the assertions.
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
    towerClear:()=>[],
    towerSettle:input=>[input],
    towerClaim:()=>[],
    manualClaim:input=>[input],
    mixedClaim:input=>[input],
    spend:input=>[input],
    reload:()=>[],
    roundTripImport:version=>[version],
    roundTripPrevious:()=>[],
    safeResetRecovery:()=>[],
    multiClient:kind=>[kind],
    tutorial:(action,id)=>[action,id],
    probeRefusal:kind=>[kind],
    foldLedger:()=>[],
    companion:id=>[id],
    preview:(id,mode)=>[id,mode]
  })
});

const rows=[];
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff2':'font/woff2'};
const clone=value=>JSON.parse(JSON.stringify(value));

function server(){
  return http.createServer((request,response)=>{
    const url=new URL(request.url,'http://127.0.0.1');
    if(url.pathname==='/__phase24l_c1_host__.html'){
      const query=url.searchParams.get('query')||`qa=1&${contract.integration.queryKey}=${contract.integration.queryValue}`;
      response.writeHead(200,{'content-type':mime['.html'],'cache-control':'no-store'}).end(`<!doctype html><html style="width:100%;height:100%"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Phase 24L-C1 QA host</title><style>html,body{width:100%;height:100%;margin:0;overflow:hidden}#realm{display:block;width:100%;height:100%;border:0}</style></head><body><iframe id="realm" title="Everstead C1 QA realm" src="/index.html?${query.replaceAll('&','&amp;')}"></iframe></body></html>`);
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
      Object.defineProperty(window,'__P24LC1_SHARED__',{configurable:false,enumerable:false,writable:false,value:{slots:new Map(),writes:[],reads:[],removes:[],native:[],clients:new Set(),clientIndex:0,saveIndex:0,transactionIndex:0,now:1815000000000}});
      return;
    }
    const shared=window.top.__P24LC1_SHARED__,clientId=`phase24l-c1-client-${++shared.clientIndex}`;
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
      ids:{save:()=>`save-phase24l-c1-${++shared.saveIndex}`,transaction:()=>`tx-phase24l-c1-${++shared.transactionIndex}`},
      qa:{allowDestructive:true,isolatedStorage:true}
    };
    window.__P24LC1_CLIENT_ID__=clientId;
    window.__EVERSTEAD_PERSISTENCE_TEST__={storage:memory,operationLog:[],status:{}};
  });
}

async function realm(page,{requireBridge=true}={}){
  const handle=await page.waitForSelector('#realm'),frame=await handle.contentFrame();
  await frame.waitForLoadState('domcontentloaded',{timeout:120000});
  if(requireBridge)await frame.waitForFunction(name=>Boolean(window[name]),BRIDGE.global,{timeout:45000});
  return frame;
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
const rawOf=result=>result?.raw??result?.activeRaw??result?.snapshot?.raw??null;
const revisionOf=result=>result?.revision??stateOf(result)?.saveMeta?.revision??null;
const rootOf=result=>stateOf(result)?.experienceProgression||result?.root||result?.experienceProgression||null;
const walletOf=result=>result?.wallet||rootOf(result)?.wallets?.companion||null;
const ledgerOf=result=>result?.ledger||rootOf(result)?.companionLedger||null;
const entriesOf=result=>ledgerOf(result)?.entries||[];
const activationOf=result=>rootOf(result)?.companionActivation||null;
const writesOf=result=>result?.writes??result?.writeCount??0;
const receiptCount=(state,id)=>state?.saveMeta?.appliedMigrations?.filter(item=>item?.id===id).length??0;
const totalMap=map=>Object.values(map||{}).reduce((sum,value)=>sum+(Number.isSafeInteger(value)?value:0),0);
const creditEntriesSince=(before,after)=>{const count=Math.max(0,(ledgerOf(after)?.entryCount??0)-(ledgerOf(before)?.entryCount??0));return entriesOf(after).slice(-count).filter(entry=>entry.kind==='credit')};
const brief=result=>({ok:result?.ok,reason:result?.reason,writes:writesOf(result),revision:revisionOf(result),rootVersion:rootOf(result)?.version,wallet:walletOf(result),ledger:{entryCount:ledgerOf(result)?.entryCount,throughSequence:ledgerOf(result)?.throughSequence,liveEntries:entriesOf(result).length}});
async function shared(page){return page.evaluate(()=>{const value=window.__P24LC1_SHARED__;return{writes:value.writes.length,reads:value.reads.length,removes:value.removes.length,native:value.native,slots:Object.fromEntries(value.slots)}})}
async function snapshot(frame){return readCall(frame,'snapshot')}
async function resetActivate(frame,fixture){const reset=await destructive(frame,'reset',fixture),before=await snapshot(frame),activation=await destructive(frame,'activate'),after=await snapshot(frame);return{reset,before,activation,after}}

async function createJourney(browser,baseURL,{viewport={width:430,height:932},prefix='core'}={}){
  const context=await browser.newContext({viewport});await installIsolatedRuntime(context);
  const page=await context.newPage(),errors=[],requests=[];page.setDefaultTimeout(30000);
  page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));
  page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});
  page.on('response',response=>{if(response.status()>=400)requests.push(`http.${response.status()}:${response.url()}`)});
  page.on('requestfailed',request=>requests.push(`${request.url()}:${request.failure()?.errorText||'failed'}`));
  const step=(id,pass,detail='')=>record(`${prefix}-${id}`,pass,detail);
  await page.goto(`${baseURL}/__phase24l_c1_host__.html`,{waitUntil:'domcontentloaded',timeout:120000});
  const frame=await realm(page);
  return{context,page,frame,errors,requests,step};
}

async function coreJourney(browser,baseURL){
  const journey=await createJourney(browser,baseURL,{prefix:'core'}),{context,page,frame,errors,requests,step}=journey;
  try{
    const descriptor=await frame.evaluate(name=>{const value=Object.getOwnPropertyDescriptor(window,name);return value&&{enumerable:value.enumerable,configurable:value.configurable,hasGetter:typeof value.get==='function'}},BRIDGE.global);
    step('bridge-is-hidden-query-gated-getter',descriptor?.enumerable===false&&descriptor?.hasGetter===true,descriptor);
    const gated=await context.newPage();await gated.goto(`${baseURL}/__phase24l_c1_host__.html?query=${encodeURIComponent('qa=1')}`,{waitUntil:'domcontentloaded',timeout:120000});const gatedFrame=await realm(gated,{requireBridge:false});step('bridge-absent-without-c1-scope',await gatedFrame.evaluate(name=>window[name]===undefined,BRIDGE.global));await gated.close();

    const activationCase=await resetActivate(frame,'established-v2'),beforeState=stateOf(activationCase.before),afterState=stateOf(activationCase.after),beforeRoot=rootOf(activationCase.before),afterRoot=rootOf(activationCase.after),pendingBefore=clone(beforeState?.companionProfile?.pendingLegacyTower),fellowBefore=fellowAuthority(beforeRoot);
    step('established-v2-fixture-is-authentic-predecessor',activationCase.reset?.ok===true&&beforeState?.schemaVersion===15&&beforeRoot?.version===2,brief(activationCase.before));
    step('activation-upgrades-only-root-policy-to-v3',activationCase.activation?.ok===true&&afterRoot?.version===3&&afterRoot?.policyId===contract.candidate.policyId,brief(activationCase.after));
    step('activation-installs-exact-top-level-c1-fields-beside-fellow-fields',contract.candidate.rootFields.every(key=>Object.hasOwn(afterRoot,key))&&['activation','ledger','tutorials'].every(key=>Object.hasOwn(afterRoot,key))&&contract.candidate.rootFields.every(key=>!Object.hasOwn(afterRoot.activation||{},key)),Object.keys(afterRoot||{}));
    step('activation-captures-all-live-companion-exp-and-level',Object.keys(beforeState?.companions||{}).length===20&&Object.keys(beforeState.companions).every(id=>afterRoot?.companionActivation?.investedCompanionExpById?.[id]===beforeState.companions[id].exp&&afterRoot?.companionActivation?.investedCompanionLevelById?.[id]===beforeState.companions[id].level),afterRoot?.companionActivation);
    step('activation-preserves-all-companion-actors-byte-semantically',same(companionActors(beforeState),companionActors(afterState)));
    step('activation-starts-neutral-wallet-and-empty-companion-ledger',same(afterRoot?.wallets?.companion,{balance:0,creditedTotal:0,spentTotal:0})&&afterRoot?.companionLedger?.entryCount===0&&afterRoot?.companionLedger?.throughSequence===0&&entriesOf(activationCase.after).length===0,{wallet:afterRoot?.wallets?.companion,ledger:afterRoot?.companionLedger});
    step('activation-preserves-fellow-wallet-ledger-tutorials-and-baseline',same(fellowAuthority(afterRoot),fellowBefore));
    step('activation-does-not-convert-pending-tower-entitlement',same(afterState?.companionProfile?.pendingLegacyTower,pendingBefore));
    const activationReceipt=afterState.saveMeta.appliedMigrations.find(item=>item?.id===contract.candidate.activationId);
    step('activation-records-one-deterministic-no-reward-receipt',receiptCount(afterState,contract.candidate.activationId)===1&&activationReceipt?.fromRootVersion===2&&activationReceipt?.toRootVersion===3&&activationReceipt?.identity===afterRoot?.companionActivation?.receiptIdentity,activationReceipt);
    const repeatBefore=await snapshot(frame),repeatWrites=(await shared(page)).writes,repeat=await destructive(frame,'activate'),repeatAfter=await snapshot(frame),repeatWritesAfter=(await shared(page)).writes;
    step('activation-retry-is-zero-write-and-byte-idempotent',repeat?.ok===true&&repeat?.changed===false&&repeatWritesAfter===repeatWrites&&rawOf(repeatAfter)===rawOf(repeatBefore)&&revisionOf(repeatAfter)===revisionOf(repeatBefore)&&receiptCount(stateOf(repeatAfter),contract.candidate.activationId)===1,{repeat,writesBefore:repeatWrites,writesAfter:repeatWritesAfter});

    const creditBefore=await snapshot(frame),creditActors=companionExpLevels(stateOf(creditBefore)),creditInput={sourceId:'qa-c1-credit-floor-once',historicalTargetId:Object.keys(stateOf(creditBefore).companions)[0],rawAmount:999,authoredBps:333,collectionBps:667},credited=await destructive(frame,'credit',creditInput),creditAfter=await snapshot(frame),creditEntries=creditEntriesSince(creditBefore,creditAfter);
    step('authenticated-credit-settles-additive-bps-with-one-floor',credited?.ok===true&&walletOf(creditAfter).balance-walletOf(creditBefore).balance===settledCredit(999,333,667)&&creditEntries.length===1&&creditEntries[0].rawAmount===999&&creditEntries[0].authoredBps===333&&creditEntries[0].collectionBps===667&&creditEntries[0].awardedAmount===1098,creditEntries);
    step('credit-never-auto-levels-any-companion',same(companionExpLevels(stateOf(creditAfter)),creditActors));
    step('credit-completes-only-first-credit-tutorial',rootOf(creditAfter)?.companionTutorials?.firstCredit?.completed===true&&rootOf(creditAfter)?.companionTutorials?.firstSpend?.completed===false,rootOf(creditAfter)?.companionTutorials);
    const duplicateBefore=await snapshot(frame),duplicateWrites=(await shared(page)).writes,duplicate=await destructive(frame,'credit',creditInput),duplicateAfter=await snapshot(frame);
    step('duplicate-credit-source-refuses-zero-write',duplicate?.ok===false&&['duplicate-companion-credit-source','duplicate-credit-source','already-credited'].includes(String(duplicate?.reason))&&(await shared(page)).writes===duplicateWrites&&rawOf(duplicateAfter)===rawOf(duplicateBefore),duplicate);

    const highInput={sourceId:'qa-c1-credit-plus-1000-percent',historicalTargetId:creditInput.historicalTargetId,rawAmount:999,authoredBps:0,collectionBps:contract.wallet.highCollectionBps},highBefore=await snapshot(frame),high=await destructive(frame,'credit',highInput),highAfter=await snapshot(frame);
    step('credit-supports-plus-1000-percent-collection-without-cap',high?.ok===true&&walletOf(highAfter).balance-walletOf(highBefore).balance===10989,{high:brief(high),delta:walletOf(highAfter).balance-walletOf(highBefore).balance});

    const validation=await readCall(frame,'validate');step('credited-v3-state-validates',validation?.ok===true,validation);
    const sharedState=await shared(page);step('isolated-journey-never-touches-native-web-storage',sharedState.native.length===0,sharedState.native);
    step('core-load-has-zero-console-or-request-errors',errors.length===0&&requests.length===0,{errors,requests});
  }finally{await context.close()}
}

async function rewardJourney(browser,baseURL){
  const journey=await createJourney(browser,baseURL,{prefix:'rewards'}),{context,page,frame,errors,requests,step}=journey;
  try{
    for(const mode of ['first-clear','replay']){
      const setup=await resetActivate(frame,'campaign-ready-v2'),before=await snapshot(frame),beforeState=stateOf(before),beforeActors=companionExpLevels(beforeState),beforeNeutral=neutralProgression(beforeState),action=await destructive(frame,'campaign',{mode}),after=await snapshot(frame),afterState=stateOf(after),entries=creditEntriesSince(before,after),receipt=action?.receipt||afterState?.companionCampaign?.lastReceipt;
      step(`campaign-${mode}-credits-once-without-auto-level`,setup.activation?.ok===true&&action?.ok===true&&entries.length===1&&entries[0].source?.kind==='companion-campaign'&&walletOf(after).balance-walletOf(before).balance===entries[0].awardedAmount&&same(companionExpLevels(afterState),beforeActors),{action:brief(action),entries});
      step(`campaign-${mode}-preserves-receipt-provenance-and-non-exp-mechanics`,Boolean(receipt)&&entries[0]?.source?.id===receipt.identity&&entries[0]?.rawAmount===totalMap(receipt.companionExp)&&afterState.companionCampaign.runOrdinal===beforeState.companionCampaign.runOrdinal+1&&afterState.gold<beforeState.gold&&same(assignments(afterState),beforeNeutral.assignments)&&same(afterState.companionMastery,beforeNeutral.mastery),{receipt,entries});
    }

    await resetActivate(frame,'tower-ready-v2');const clearBefore=await snapshot(frame),clearActors=companionExpLevels(stateOf(clearBefore)),clearNeutral=neutralProgression(stateOf(clearBefore)),clear=await destructive(frame,'towerClear'),clearAfter=await snapshot(frame),clearEntries=creditEntriesSince(clearBefore,clearAfter),clearReceipt=clear?.receipt||stateOf(clearAfter)?.companionTower?.lastClearReceipt;
    step('tower-clear-credits-sole-positive-target-without-auto-level',clear?.ok===true&&clearEntries.length===1&&clearEntries[0].source?.kind==='companion-tower-clear'&&clearEntries[0].source?.id===clearReceipt?.identity&&clearEntries[0].rawAmount===totalMap(clearReceipt?.companionExp)&&same(companionExpLevels(stateOf(clearAfter)),clearActors),{clear:brief(clear),entries:clearEntries});
    step('tower-clear-preserves-floor-shards-mastery-and-neutral-authorities',stateOf(clearAfter).companionTower.highestFloor===stateOf(clearBefore).companionTower.highestFloor+1&&stateOf(clearAfter).companionMastery.points>=stateOf(clearBefore).companionMastery.points&&same(assignments(stateOf(clearAfter)),clearNeutral.assignments)&&same(fellowAuthority(rootOf(clearAfter)),fellowAuthority(rootOf(clearBefore))),{before:clearNeutral,after:neutralProgression(stateOf(clearAfter))});

    const pendingSetup=await resetActivate(frame,'pending-tower-v2');const pendingValidation=await readCall(frame,'validate'),settleBefore=await snapshot(frame),settleActors=companionExpLevels(stateOf(settleBefore)),settleWallet=clone(walletOf(settleBefore)),settle=await destructive(frame,'towerSettle',{elapsedMs:86_400_000}),settleAfter=await snapshot(frame);
    step('tower-settlement-banks-time-not-exp',settle?.ok===true&&same(walletOf(settleAfter),settleWallet)&&same(companionExpLevels(stateOf(settleAfter)),settleActors)&&Number(settle?.intervals??settle?.preview?.intervals)>0,{reset:brief(pendingSetup.reset),pendingValidation,before:{version:rootOf(settleBefore)?.version,floor:stateOf(settleBefore)?.companionTower?.highestFloor,blocked:stateOf(settleBefore)?.saveMeta?.source},settle});
    const settlementValidation=await readCall(frame,'validate'),claimBefore=settleAfter,claimActors=companionExpLevels(stateOf(claimBefore)),claim=await destructive(frame,'towerClaim'),claimAfter=await snapshot(frame),claimReceipt=claim?.receipt||stateOf(claimAfter)?.companionTower?.idle?.lastReceipt,claimEntries=creditEntriesSince(claimBefore,claimAfter),positiveTargets=Object.entries(claimReceipt?.companionExp||{}).filter(([,amount])=>amount>0).map(([id])=>id);
    step('tower-idle-claim-credits-each-positive-map-entry-in-canonical-order',claim?.ok===true&&positiveTargets.length>0&&claimEntries.length===positiveTargets.length&&claimEntries.every((entry,index)=>entry.source?.kind==='companion-tower-idle'&&entry.historicalTargetId===positiveTargets[index]&&entry.rawAmount===claimReceipt.companionExp[positiveTargets[index]]),{settlementValidation,claim:brief(claim),receipt:claimReceipt,positiveTargets,entries:claimEntries});
    step('tower-idle-claim-never-auto-levels-and-wallets-total-once',same(companionExpLevels(stateOf(claimAfter)),claimActors)&&walletOf(claimAfter).balance-walletOf(claimBefore).balance===claimEntries.reduce((sum,entry)=>sum+entry.awardedAmount,0),{walletBefore:walletOf(claimBefore),walletAfter:walletOf(claimAfter)});
    const replayBefore=await snapshot(frame),replayWrites=(await shared(page)).writes,replay=await destructive(frame,'towerClaim'),replayAfter=await snapshot(frame);
    step('tower-idle-immediate-replay-is-zero-credit-zero-write',(!replay?.ok||replay?.noOp===true)&&walletOf(replayAfter).creditedTotal===walletOf(replayBefore).creditedTotal&&(await shared(page)).writes===replayWrites&&rawOf(replayAfter)===rawOf(replayBefore),replay);

    await resetActivate(frame,'manual-claim-ready-v2');const manualBefore=await snapshot(frame),manualActors=companionExpLevels(stateOf(manualBefore)),manual=await destructive(frame,'manualClaim',{mode:'claim'}),manualAfter=await snapshot(frame),manualEntries=creditEntriesSince(manualBefore,manualAfter);
    step('manual-companion-exp-claim-credits-with-production-receipt',manual?.ok===true&&manualEntries.length>0&&manualEntries.every(entry=>entry.source?.kind==='manual-reward-claim')&&Boolean(manual?.receipt),{manual:brief(manual),entries:manualEntries});
    step('manual-companion-exp-claim-never-auto-levels',same(companionExpLevels(stateOf(manualAfter)),manualActors));
    const manualReplayBefore=await snapshot(frame),manualReplayWrites=(await shared(page)).writes,manualReplay=await destructive(frame,'manualClaim',{mode:'replay'}),manualReplayAfter=await snapshot(frame);
    step('manual-claim-replay-is-already-claimed-zero-write',manualReplay?.ok===false&&manualReplay?.reason==='already-claimed'&&(await shared(page)).writes===manualReplayWrites&&rawOf(manualReplayAfter)===rawOf(manualReplayBefore),manualReplay);

    await resetActivate(frame,'mixed-claim-ready-v2');const mixedBefore=await snapshot(frame),mixedActors=companionExpLevels(stateOf(mixedBefore)),mixedFellow=fellowAuthority(rootOf(mixedBefore)),mixed=await destructive(frame,'mixedClaim',{mode:'claim'}),mixedAfter=await snapshot(frame);
    step('mixed-fellow-companion-exp-claim-settles-both-wallets-atomically',mixed?.ok===true&&walletOf(mixedAfter).creditedTotal>walletOf(mixedBefore).creditedTotal&&rootOf(mixedAfter).wallets.fellow.creditedTotal>rootOf(mixedBefore).wallets.fellow.creditedTotal&&mixed?.receiptApplications===1,{mixed:brief(mixed),before:{fellow:rootOf(mixedBefore).wallets.fellow,companion:walletOf(mixedBefore)},after:{fellow:rootOf(mixedAfter).wallets.fellow,companion:walletOf(mixedAfter)}});
    step('mixed-claim-does-not-directly-invest-either-roster',same(companionExpLevels(stateOf(mixedAfter)),mixedActors)&&same(Object.fromEntries(Object.entries(stateOf(mixedAfter).fellows).map(([id,item])=>[id,{exp:item.exp,level:item.level}])),Object.fromEntries(Object.entries(stateOf(mixedBefore).fellows).map(([id,item])=>[id,{exp:item.exp,level:item.level}]))));
    step('mixed-claim-retains-b1-ledger-validity',rootOf(mixedAfter).ledger.entryCount===mixedFellow.ledger.entryCount+1&&(await readCall(frame,'validate'))?.ok===true,{before:mixedFellow.ledger.entryCount,after:rootOf(mixedAfter).ledger.entryCount});

    step('reward-journey-never-touches-native-web-storage',(await shared(page)).native.length===0,(await shared(page)).native);
    step('reward-journey-has-zero-console-or-request-errors',errors.length===0&&requests.length===0,{errors,requests});
  }finally{await context.close()}
}

async function spendingJourney(browser,baseURL){
  const journey=await createJourney(browser,baseURL,{prefix:'spending'}),{context,page,frame,errors,requests,step}=journey;
  try{
    for(const mode of contract.wallet.modes){
      const setup=await resetActivate(frame,'assigned-partial-v2'),fundedBefore=await snapshot(frame),ids=Object.keys(stateOf(fundedBefore).companions),companionId=ids.find(id=>stateOf(fundedBefore).companions[id].assignedFellowId)||ids[0],historicalTargetId=ids.find(id=>id!==companionId)||ids[0];
      const funded=await destructive(frame,'credit',{sourceId:`qa-c1-spend-${mode}`,historicalTargetId,rawAmount:100_000_000,authoredBps:0,collectionBps:0}),before=await snapshot(frame),beforeState=stateOf(before),actorBefore=clone(beforeState.companions[companionId]),actorsBefore=companionActors(beforeState),neutralBefore=neutralProgression(beforeState),fellowBefore=fellowAuthority(rootOf(before)),previewWrites=(await shared(page)).writes,preview=await readCall(frame,'preview',companionId,mode),previewWritesAfter=(await shared(page)).writes;
      const expectedX1=companionExpThreshold(actorBefore.level+1)-actorBefore.exp;
      step(`${mode}-preview-is-pure-bound-and-affordable`,funded?.ok===true&&preview?.ok===true&&preview?.preview?.mode===mode&&preview?.preview?.companionId===companionId&&typeof preview?.preview?.identity==='string'&&previewWritesAfter===previewWrites&&preview.preview.walletBalance===walletOf(before).balance,{preview:preview?.preview,writesBefore:previewWrites,writesAfter:previewWritesAfter});
      if(mode==='x1')step('x1-prices-exact-partial-next-level-gap',actorBefore.exp>companionExpThreshold(actorBefore.level)&&preview?.preview?.cost===expectedX1&&preview.preview.after.level===actorBefore.level+1,{actorBefore,preview:preview?.preview,expectedX1});
      if(mode==='x10')step('x10-buys-greatest-affordable-target-within-ten-levels',preview?.preview?.after?.level===Math.min(100,actorBefore.level+10)&&preview.preview.levels<=10,preview?.preview);
      if(mode==='max')step('max-reaches-level-100-when-wallet-affords-it',preview?.preview?.after?.level===100,preview?.preview);
      const spent=await destructive(frame,'spend',{companionId,mode,expectedIdentity:preview?.preview?.identity}),after=await snapshot(frame),afterState=stateOf(after),actorAfter=afterState.companions[companionId],spendEntries=entriesOf(after).slice(-(ledgerOf(after).entryCount-ledgerOf(before).entryCount)).filter(entry=>entry.kind==='spend');
      step(`${mode}-spend-debits-wallet-and-invests-only-selected-companion`,spent?.ok===true&&spendEntries.length===1&&walletOf(after).balance===walletOf(before).balance-preview.preview.cost&&actorAfter.exp===preview.preview.after.exp&&actorAfter.level===preview.preview.after.level&&Object.keys(actorsBefore).filter(id=>id!==companionId).every(id=>same(companionActors(afterState)[id],actorsBefore[id])),{spent:brief(spent),entry:spendEntries[0],actorBefore,actorAfter});
      step(`${mode}-spend-preserves-rank-shards-assignment-mastery-and-fellow-authority`,actorAfter.rarity===actorBefore.rarity&&actorAfter.shards===actorBefore.shards&&same(neutralProgression(afterState).player,neutralBefore.player)&&same(assignments(afterState),neutralBefore.assignments)&&same(afterState.companionMastery,neutralBefore.mastery)&&same(fellowAuthority(rootOf(after)),fellowBefore));
      step(`${mode}-spend-does-not-reapply-exp-bonus`,actorAfter.exp-actorBefore.exp===preview.preview.cost);
      const transfer=spent?.assignmentTransfer||spent?.assignmentDelta;
      if(actorBefore.assignedFellowId)step(`${mode}-assigned-spend-reports-bound-transfer-delta`,transfer?.assignedFellowId===actorBefore.assignedFellowId&&Number.isSafeInteger(transfer.supportBefore)&&Number.isSafeInteger(transfer.supportAfter)&&transfer.supportAfter>=transfer.supportBefore&&Number.isSafeInteger(transfer.fellowPowerDelta),transfer);
      const replayBefore=await snapshot(frame),replayWrites=(await shared(page)).writes,replay=await destructive(frame,'spend',{companionId,mode,expectedIdentity:preview.preview.identity}),replayAfter=await snapshot(frame);
      step(`${mode}-spend-replay-refuses-zero-write`,replay?.ok===false&&['stale-companion-spend-preview','duplicate-companion-spend-request','stale-spend-preview','duplicate-spend-request'].includes(String(replay?.reason))&&(await shared(page)).writes===replayWrites&&rawOf(replayAfter)===rawOf(replayBefore),replay);
    }

    await resetActivate(frame,'assigned-partial-v2');const projectionStart=await snapshot(frame),ids=Object.keys(stateOf(projectionStart).companions),recipient=ids[0],historicalTarget=ids[1],activation=clone(activationOf(projectionStart)),credit=await destructive(frame,'credit',{sourceId:'qa-c1-projection',historicalTargetId:historicalTarget,rawAmount:50_000,authoredBps:250,collectionBps:1000}),preview=await readCall(frame,'preview',recipient,'x1'),spend=await destructive(frame,'spend',{companionId:recipient,mode:'x1',expectedIdentity:preview?.preview?.identity}),live=await snapshot(frame),projection=await readCall(frame,'projection'),projected=stateOf(projection);
    step('projection-validates-through-exact-policy-v2-authority',credit?.ok===true&&spend?.ok===true&&projection?.ok===true&&projection?.predecessorValidation?.ok===true&&projected?.experienceProgression?.version===2,projection?.predecessorValidation);
    step('projection-adds-raw-credit-to-historical-target-not-settled-award',projected?.companions?.[historicalTarget]?.exp===activation?.investedCompanionExpById?.[historicalTarget]+50_000,{projected:projected?.companions?.[historicalTarget]?.exp,baseline:activation?.investedCompanionExpById?.[historicalTarget]});
    step('projection-removes-player-selected-spend-and-restores-neutral-companion-wallet',projected?.companions?.[recipient]?.exp===activation?.investedCompanionExpById?.[recipient]&&same(projected?.experienceProgression?.wallets?.companion,{balance:0,creditedTotal:0,spentTotal:0})&&projected?.experienceProgression?.companionLedger===undefined&&projected?.experienceProgression?.companionActivation===undefined&&projected?.experienceProgression?.companionTutorials===undefined,{live:stateOf(live)?.companions?.[recipient],projected:projected?.companions?.[recipient]});

    for(const kind of contract.refusals){
      const probe=await destructive(frame,'probeRefusal',kind);
      step(`refusal-${kind}-is-fail-closed-zero-write`,probe?.ok===true&&probe?.refused===true&&writesOf(probe)===0&&probe?.rawUnchanged===true&&probe?.stateUnchanged===true,probe);
    }

    const fold=await destructive(frame,'foldLedger');
    step('ledger-folds-after-256-live-entries-with-exact-algebra',fold?.ok===true&&fold?.entryCount>contract.candidate.maxTailEntries&&fold?.liveEntryCount<=contract.candidate.maxTailEntries&&fold?.throughSequence>0&&fold?.walletAlgebra===true&&walletAlgebra(fold?.wallet),fold);
    step('folded-ledger-validates-and-projects',fold?.validation?.ok===true&&fold?.projection?.ok===true&&fold?.projection?.predecessorValidation?.ok===true,fold);
    await resetActivate(frame,'assigned-partial-v2');

    for(const kind of ['same-credit','same-spend']){
      const race=await destructive(frame,'multiClient',kind);
      step(`multi-client-${kind}-has-one-winner-one-zero-write-loser`,race?.ok===true&&race?.winnerCount===1&&race?.loserCount===1&&race?.loserWrites===0&&race?.noOverdraw===true&&race?.validation?.ok===true,race);
    }

    const persistenceBefore=await snapshot(frame),reloaded=await destructive(frame,'reload'),persistenceAfter=await snapshot(frame);
    step('reload-preserves-v3-wallet-ledger-actors-and-receipts',reloaded?.ok===true&&same(stateOf(persistenceAfter),stateOf(persistenceBefore))&&rawOf(persistenceAfter)===rawOf(persistenceBefore),brief(reloaded));
    for(const version of [1,2,3,4]){const result=await destructive(frame,'roundTripImport',version);step(`format-${version}-import-export-roundtrip-preserves-c1`,result?.ok===true&&result?.identityPreserved===true&&result?.terminalRootVersion===3&&result?.validation?.ok===true,result)}
    const previous=await destructive(frame,'roundTripPrevious');step('previous-save-roundtrip-preserves-c1-exactly-once',previous?.ok===true&&previous?.sourceIdentityRestored===true&&previous?.receiptCount===1&&previous?.validation?.ok===true,previous);
    const recovery=await destructive(frame,'safeResetRecovery');step('safe-reset-and-recovery-preserve-or-cleanly-recreate-c1',recovery?.ok===true&&recovery?.previousRestorable===true&&recovery?.activationReceiptExactlyOnce===true&&recovery?.validation?.ok===true,recovery);

    for(const tutorialId of contract.tutorials.ids){
      for(const action of ['skip','replay','complete']){const tutorial=await destructive(frame,'tutorial',action,tutorialId);step(`tutorial-${tutorialId.split('.').at(-2)}-${action}-is-reward-neutral`,tutorial?.ok===true&&tutorial?.rewardApplications===0&&tutorial?.walletDelta===0&&tutorial?.actorExpDelta===0,tutorial)}
    }

    step('spending-journey-never-touches-native-web-storage',(await shared(page)).native.length===0,(await shared(page)).native);
    step('spending-journey-has-zero-console-or-request-errors',errors.length===0&&requests.length===0,{errors,requests});
  }finally{await context.close()}
}

async function uiJourney(browser,baseURL,size){
  const journey=await createJourney(browser,baseURL,{viewport:{width:size.width,height:size.height},prefix:size.id}),{context,page,frame,errors,requests,step}=journey,selectors=contract.integration.selectors;
  try{
    await destructive(frame,'reset','assigned-partial-v2');await destructive(frame,'activate');const state=stateOf(await snapshot(frame)),companionId=Object.keys(state.companions).find(id=>state.companions[id].assignedFellowId)||Object.keys(state.companions)[0];
    await destructive(frame,'credit',{sourceId:`qa-c1-ui-${size.id}`,historicalTargetId:companionId,rawAmount:100_000_000,authoredBps:0,collectionBps:0});
    await frame.locator('[data-nav="fellows"]').click();await frame.locator('[data-roster="companions"]').click();const card=frame.locator(`[data-companion="${companionId}"]`).first();await card.click();
    const profile=frame.locator(selectors.profile);await profile.waitFor();const levelTab=profile.locator(selectors.levelTab);await levelTab.click();const panel=profile.locator(selectors.levelPanel);await panel.waitFor();
    step('profile-level-sheet-has-one-live-c1-control-set',await profile.count()===1&&await panel.locator(selectors.investment).count()===1&&await panel.locator(selectors.wallet).count()===1&&await panel.locator(selectors.invested).count()===1&&await panel.locator(selectors.modeGroup).count()===1&&await panel.locator(selectors.mode).count()===3&&await panel.locator(selectors.commit).count()===1&&await panel.locator(selectors.status).count()===1);
    const modes=panel.locator(selectors.mode),modeValues=await modes.evaluateAll(nodes=>nodes.map(node=>node.dataset.phase24lC1ExpMode));
    step('mode-group-is-labelled-with-exact-x1-x10-max-options',same(modeValues,contract.wallet.modes)&&Boolean(await panel.locator(selectors.modeGroup).getAttribute('aria-label')),modeValues);
    step('exactly-one-spend-mode-is-aria-pressed',await modes.evaluateAll(nodes=>nodes.filter(node=>node.getAttribute('aria-pressed')==='true').length)===1);
    const profileTabs=profile.locator('[data-phase24l-profile-tab]'),targets=[...(await profileTabs.all()),frame.locator(selectors.profileClose).first(),panel.locator(selectors.help),panel.locator(selectors.commit),...(await modes.all())];
    const boxes=[];for(const target of targets){const count=await target.count(),box=count?await target.boundingBox():null;boxes.push({count,width:box?.width,height:box?.height})}
    step('dock-tabs-close-help-modes-and-invest-are-44px-targets',boxes.every(item=>item.count===1&&item.width>=44&&item.height>=44),boxes);
    await modes.nth(1).click();step('pointer-mode-selection-preserves-focus',await modes.nth(1).evaluate(node=>document.activeElement===node));
    await modes.nth(0).focus();await page.keyboard.press('Enter');step('enter-mode-selection-preserves-focus',await modes.nth(0).evaluate(node=>document.activeElement===node)&&await modes.nth(0).getAttribute('aria-pressed')==='true');
    await modes.nth(2).focus();await page.keyboard.press('Space');step('space-mode-selection-preserves-focus',await modes.nth(2).evaluate(node=>document.activeElement===node)&&await modes.nth(2).getAttribute('aria-pressed')==='true');
    await levelTab.focus();await page.keyboard.press('ArrowLeft');const activeAfterArrow=await profile.evaluate(node=>node.ownerDocument.activeElement?.getAttribute('data-phase24l-profile-tab'));await page.keyboard.press('Home');const activeAfterHome=await profile.evaluate(node=>node.ownerDocument.activeElement?.getAttribute('data-phase24l-profile-tab'));await page.keyboard.press('End');const activeAfterEnd=await profile.evaluate(node=>node.ownerDocument.activeElement?.getAttribute('data-phase24l-profile-tab'));
    step('profile-tab-arrow-home-end-roving-remains-usable',[activeAfterArrow,activeAfterHome,activeAfterEnd].every(Boolean),{activeAfterArrow,activeAfterHome,activeAfterEnd});
    const panelState=await profile.locator('[data-phase24l-panel]').evaluateAll(nodes=>nodes.map(node=>({id:node.dataset.phase24lPanel,hidden:node.hidden,inert:node.inert,ariaHidden:node.getAttribute('aria-hidden')})));
    step('inactive-profile-panels-remain-hidden-inert-and-aria-hidden',panelState.filter(item=>item.id!=='level').every(item=>item.hidden&&item.inert&&item.ariaHidden==='true')&&panelState.find(item=>item.id==='level')?.hidden===false,panelState);
    const overflow=await frame.evaluate(({profileSelector,panelSelector})=>{const html=document.documentElement,body=document.body,profile=document.querySelector(profileSelector),panel=profile?.querySelector(panelSelector);return{documentHorizontal:Math.max(html.scrollWidth,body.scrollWidth)-html.clientWidth,documentVertical:Math.max(html.scrollHeight,body.scrollHeight)-html.clientHeight,profileHorizontal:profile?profile.scrollWidth-profile.clientWidth:null,profileVertical:profile?profile.scrollHeight-profile.clientHeight:null,panelHorizontal:panel?panel.scrollWidth-panel.clientWidth:null,panelVertical:panel?panel.scrollHeight-panel.clientHeight:null}},{profileSelector:selectors.profile,panelSelector:selectors.levelPanel});
    step('profile-and-level-sheet-have-zero-document-or-panel-overflow',Object.values(overflow).every(value=>value===null||value<=1),overflow);
    await levelTab.click();await levelTab.click();const modeAfterReopen=panel.locator(`${selectors.mode}[aria-pressed="true"]`);step('sheet-collapse-and-reopen-retain-one-selected-mode',await modeAfterReopen.count()===1);
    const chosen=panel.locator(`${selectors.mode}[data-phase24l-c1-exp-mode="x1"]`);await chosen.click();const commit=panel.locator(selectors.commit);const priorStatus=await panel.locator(selectors.status).textContent();await commit.click();await frame.waitForFunction(({profileSelector,statusSelector,prior})=>{const status=document.querySelector(profileSelector)?.querySelector(statusSelector);return Boolean(status&&status.textContent&&status.textContent!==prior)},{profileSelector:selectors.profile,statusSelector:selectors.status,prior:priorStatus});const focusKind=await profile.evaluate(node=>node.ownerDocument.activeElement?.hasAttribute('data-phase24l-c1-exp-commit')?'commit':node.ownerDocument.activeElement?.hasAttribute('data-phase24l-c1-exp-mode')?'mode':'other'),status=await panel.locator(selectors.status).getAttribute('aria-live'),statusText=await panel.locator(selectors.status).textContent();
    step('successful-investment-restores-predictable-visible-focus',['commit','mode'].includes(focusKind),focusKind);
    step('successful-investment-announces-spend-level-wallet-and-assignment-delta',status==='polite'&&/spent|invested/i.test(statusText)&&/level/i.test(statusText)&&/remain|wallet/i.test(statusText)&&/transfer|fellow/i.test(statusText),statusText);
    const finalValidation=await readCall(frame,'validate');step('ui-investment-commits-valid-v3-state',finalValidation?.ok===true,finalValidation);
    await page.keyboard.press('Escape');const firstEscape={profileCount:await frame.locator(selectors.profile).count(),activePanel:await profile.getAttribute('data-phase24l-active-panel'),focusedTab:await profile.evaluate(node=>node.ownerDocument.activeElement?.getAttribute('data-phase24l-profile-tab'))};await page.keyboard.press('Escape');const secondEscape={profileCount:await frame.locator(selectors.profile).count(),cardFocused:await card.evaluate(node=>document.activeElement===node)};
    step('escape-collapses-sheet-before-closing-profile-and-returning-card-focus',firstEscape.profileCount===1&&firstEscape.activePanel==='closed'&&firstEscape.focusedTab==='level'&&secondEscape.profileCount===0&&secondEscape.cardFocused,{firstEscape,secondEscape});
    step('ui-journey-never-touches-native-web-storage',(await shared(page)).native.length===0,(await shared(page)).native);
    const expectedPrivatePaths=new Set([...Object.keys(state.companions).map(id=>`/private-assets/companions/${id}/thumb.webp`),`/private-assets/companions/${companionId}/portrait.webp`]),privateResponses=requests.filter(item=>/^http\.404:http/.test(item)&&/\/private-assets\/companions\/[^/]+\/(?:thumb|portrait)\.webp$/.test(item)),privatePaths=new Set(privateResponses.map(item=>new URL(item.slice('http.404:'.length)).pathname)),unexpectedRequests=requests.filter(item=>!privateResponses.includes(item)),genericPrivate404=/^console\.error:Failed to load resource: the server responded with a status of 404 \(Not Found\)$/,
      unexpectedErrors=errors.filter(item=>!genericPrivate404.test(item));
    step('ui-journey-has-only-contract-backed-private-art-fallbacks',unexpectedErrors.length===0&&unexpectedRequests.length===0&&privateResponses.length===privatePaths.size&&[...privatePaths].every(item=>expectedPrivatePaths.has(item))&&errors.length===privateResponses.length,{unexpectedErrors,unexpectedRequests,privatePaths:[...privatePaths],errorCount:errors.length});
  }finally{await context.close()}
}

const instance=server();let browser;
try{
  const baseURL=await listen(instance);browser=await chromium.launch({headless:true});
  const single=process.env.PHASE24L_C1_SINGLE||'';
  if(!single||single==='core')await coreJourney(browser,baseURL);
  if(!single||single==='rewards')await rewardJourney(browser,baseURL);
  if(!single||single==='spending')await spendingJourney(browser,baseURL);
  if(!single||single==='ui')for(const size of contract.viewports)await uiJourney(browser,baseURL,size);
}catch(error){record('browser-runner-fatal',false,error.stack||error.message)}finally{if(browser)await browser.close();await new Promise(resolve=>instance.close(resolve))}

const failed=rows.filter(row=>!row.pass);
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${!row.pass&&row.detail?` · ${row.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
