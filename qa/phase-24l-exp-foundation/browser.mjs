import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../..');
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));
const rows=[],record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.json':'application/json; charset=utf-8'};

function server(){
 return http.createServer((request,response)=>{
  const url=new URL(request.url,'http://127.0.0.1');
  if(url.pathname==='/__phase24l_b0_host__.html'){
   const query=url.searchParams.get('query')||'qa=1&phase24l-exp-qa=1';
   response.writeHead(200,{'content-type':mime['.html'],'cache-control':'no-store'}).end(`<!doctype html><meta charset="utf-8"><title>Phase 24L-B0 host</title><iframe id="realm" src="/index.html?${query.replaceAll('&','&amp;')}" style="width:430px;height:932px;border:0"></iframe>`);
   return;
  }
  const relative=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).replace(/^\/+/,''),target=path.resolve(root,relative);
  if(target!==root&&!target.startsWith(root+path.sep)){response.writeHead(403).end();return}
  fs.readFile(target,(error,data)=>{if(error){response.writeHead(404).end();return}response.writeHead(200,{'content-type':mime[path.extname(target)]||'application/octet-stream','cache-control':'no-store'}).end(data)});
 });
}
async function listen(instance){await new Promise((resolve,reject)=>{instance.once('error',reject);instance.listen(0,'127.0.0.1',resolve)});return`http://127.0.0.1:${instance.address().port}`}
async function installRuntime(context){
 await context.addInitScript(()=>{
  const topWindow=window.top;
  if(window===topWindow){
   Object.defineProperty(window,'__P24LB0_SHARED__',{configurable:false,enumerable:false,writable:false,value:{slots:new Map(),writes:[],reads:[],removes:[],native:[],operations:[],clients:new Set(),clientIndex:0,fault:null,saveIndex:0,transactionIndex:0,now:1799056800000}});
   return;
  }
  const shared=topWindow.__P24LB0_SHARED__;
  const clientId=`phase24l-b0-client-${++shared.clientIndex}`;
  shared.clients.add(window);
  const nativeGet=Storage.prototype.getItem,nativeSet=Storage.prototype.setItem,nativeRemove=Storage.prototype.removeItem;
  Storage.prototype.getItem=function(...args){shared.native.push(['getItem',String(args[0])]);return nativeGet.apply(this,args)};
  Storage.prototype.setItem=function(...args){shared.native.push(['setItem',String(args[0])]);return nativeSet.apply(this,args)};
  Storage.prototype.removeItem=function(...args){shared.native.push(['removeItem',String(args[0])]);return nativeRemove.apply(this,args)};
  const notify=(key,oldValue,newValue,sourceWindow=window)=>{for(const peer of shared.clients){if(peer===sourceWindow||peer.closed)continue;setTimeout(()=>{try{peer.dispatchEvent(new peer.StorageEvent('storage',{key,oldValue,newValue,url:peer.location.href,storageArea:peer.localStorage}))}catch{}},0)}};
  const memory=Object.freeze({
   getItem(key){key=String(key);shared.reads.push(key);return shared.slots.get(key)??null},
   setItem(key,value){key=String(key);value=String(value);const oldValue=shared.slots.get(key)??null;shared.writes.push([key,value,clientId]);shared.slots.set(key,value);notify(key,oldValue,value)},
   removeItem(key){key=String(key);const oldValue=shared.slots.get(key)??null;shared.removes.push([key,clientId]);shared.slots.delete(key);notify(key,oldValue,null)}
  });
  const nativeSetTimeout=setTimeout.bind(window),nativeClearTimeout=clearTimeout.bind(window);
  window.__EVERSTEAD_RUNTIME__={
   storage:memory,
   clock:{now:()=>shared.now,setTimeout:nativeSetTimeout,clearTimeout:nativeClearTimeout},
   random:()=>.4375,
   confirm:()=>true,
   ids:{save:()=>`save-phase24l-b0-${++shared.saveIndex}`,transaction:()=>`tx-phase24l-b0-${++shared.transactionIndex}`},
   qa:{allowDestructive:true,isolatedStorage:true}
  };
  window.__P24LB0_CLIENT_ID__=clientId;
  window.__EVERSTEAD_PERSISTENCE_TEST__={storage:memory,operationLog:shared.operations,status:{},fault:event=>{const armed=shared.fault;if(!armed||armed.fired||event?.step!==armed.step||event?.phase!==armed.phase)return null;const key=String(armed.key),value=String(armed.value),oldValue=shared.slots.get(key)??null,source=[...shared.clients].find(peer=>peer.__P24LB0_CLIENT_ID__===armed.foreignClientId)||window;shared.writes.push([key,value,armed.foreignClientId]);shared.slots.set(key,value);armed.fired=true;notify(key,oldValue,value,source);return null}};
 });
}
async function realm(page){
 const handle=await page.waitForSelector('#realm');const frame=await handle.contentFrame();
 await frame.waitForFunction(name=>Boolean(window[name]),contract.integration.productionBridge,{timeout:30000});
 return frame;
}
async function loadedFrame(page){
 const handle=await page.waitForSelector('#realm'),frame=await handle.contentFrame();
 await frame.waitForLoadState('domcontentloaded');
 return frame;
}
async function siblingRealm(page,id){
 await page.evaluate(({id,query})=>{const frame=document.createElement('iframe');frame.id=id;frame.src=`/index.html?${query}`;frame.style.cssText='width:430px;height:932px;border:0';document.body.appendChild(frame)},{id,query:'qa=1&phase24l-exp-qa=1'});
 const handle=await page.waitForSelector(`#${id}`),frame=await handle.contentFrame();
 await frame.waitForFunction(name=>Boolean(window[name]),contract.integration.productionBridge,{timeout:30000});
 return frame;
}
async function bridge(frame,pathName,...args){
 return frame.evaluate(({globalName,pathName,args})=>{
  let value=window[globalName];for(const part of pathName.split('.'))value=value?.[part];
  if(typeof value!=='function')return{ok:false,error:`missing bridge method ${pathName}`};
  return value(...args);
 },{globalName:contract.integration.productionBridge,pathName,args});
}
async function shared(page){
 return page.evaluate(()=>{const value=window.__P24LB0_SHARED__;return{slots:Object.fromEntries(value.slots),writes:value.writes.length,reads:value.reads.length,removes:value.removes.length,native:value.native,operations:value.operations.length}});
}
function rootOf(result){return result?.state?.experienceProgression||result?.after?.experienceProgression||result?.snapshot?.state?.experienceProgression||null}
function stateOf(result){return result?.state||result?.after||result?.snapshot?.state||null}
function zeroFoundation(rootState){return Boolean(rootState)&&rootState.wallets?.fellow?.balance===0&&rootState.wallets?.fellow?.creditedTotal===0&&rootState.wallets?.fellow?.spentTotal===0&&rootState.wallets?.companion?.balance===0&&rootState.wallets?.companion?.creditedTotal===0&&rootState.wallets?.companion?.spentTotal===0&&rootState.ledger?.throughSequence===0&&rootState.ledger?.entryCount===0&&Array.isArray(rootState.ledger?.entries)&&rootState.ledger.entries.length===0}
function checkpointFor(snapshot){return snapshot?.saveSnapshot?.preV15??snapshot?.slots?.preV15??snapshot?.preV15Raw??null}
function evidenceZero(result){const evidence=result?.foundation||result;return evidence?.zeroWallets===true&&evidence?.emptyLedger===true&&evidence?.rewardApplications===0}

const instance=server();let browser,context,page,capturedErrors=[],capturedRequests=[];
try{
 const baseURL=await listen(instance);browser=await chromium.launch({headless:true});context=await browser.newContext({viewport:{width:430,height:932}});await installRuntime(context);page=await context.newPage();page.setDefaultTimeout(30000);
 const errors=capturedErrors,requests=capturedRequests;page.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});page.on('requestfailed',request=>requests.push(`${request.url()}:${request.failure()?.errorText||'failed'}`));
 const response=await page.goto(`${baseURL}/__phase24l_b0_host__.html`,{waitUntil:'domcontentloaded',timeout:120000}),frame=await realm(page);
 record('active-bridge-realm-loads-real-candidate',response?.ok()===true&&requests.length===0,requests);
 if(process.env.PHASE24L_B0_SINGLE_HOOK==='format4-forget'){
  const probe=await bridge(frame,'destructive.roundTripSafeResetFormat4AfterForget');
  record('single-format4-after-forget-hook',probe?.ok===true&&probe.importSucceeded===true&&probe.identityPreserved===true&&probe.terminalSchemaVersion===15&&probe.terminalControlsClean===true&&probe.validation?.ok===true&&evidenceZero(probe),probe);
  const forensicProbe=await bridge(frame,'destructive.schema14ForensicPrevious','prepare');
  record('single-schema14-forensic-v3-prepare-after-format4-hook',forensicProbe?.ok===true&&forensicProbe.sourceSchemaVersion===14&&forensicProbe.terminalSchemaVersion===15&&forensicProbe.preV15Exact===true&&forensicProbe.previousKind==='forensic'&&forensicProbe.previousRestorable===false&&forensicProbe.validation?.ok===true&&evidenceZero(forensicProbe),forensicProbe);
 }else{
 const descriptor=await frame.evaluate(name=>{const value=Object.getOwnPropertyDescriptor(window,name);return value?{enumerable:value.enumerable,configurable:value.configurable,hasGetter:typeof value.get==='function',hasValue:Object.hasOwn(value,'value'),version:window[name]?.version}:null},contract.integration.productionBridge);
 record('bridge-is-hidden-query-gated-surface',descriptor?.enumerable===false&&descriptor?.hasGetter===true,descriptor);
 const gatedPage=await context.newPage();await gatedPage.goto(`${baseURL}/__phase24l_b0_host__.html?query=${encodeURIComponent('qa=1')}`,{waitUntil:'domcontentloaded',timeout:120000});const gatedFrame=await loadedFrame(gatedPage);
 const absentWithoutScope=await gatedFrame.evaluate(name=>window[name]===undefined,contract.integration.productionBridge);record('bridge-remains-absent-without-phase24l-query-scope',absentWithoutScope);await gatedPage.close();
 const first=await bridge(frame,'read.snapshot'),firstState=stateOf(first),firstRoot=rootOf(first);
 record('fresh-physical-first-load-is-playable-schema15',first?.ok!==false&&firstState?.schemaVersion===15&&!first?.blocked,{schema:firstState?.schemaVersion,blocked:first?.blocked,error:first?.error});
 record('first-load-uses-attested-schema14-migration-lineage',firstRoot?.migration?.lineageKind===contract.integration.physicalFirstBootLineage,firstRoot?.migration);
 record('first-load-wallets-and-ledger-are-exact-zero',zeroFoundation(firstRoot),firstRoot);
 const slots=await shared(page),preV15=slots.slots[contract.storage.preV15Key],active=slots.slots[contract.storage.activeKey];
 let predecessor=null,current=null;try{predecessor=JSON.parse(preV15);current=JSON.parse(active)}catch{}
 record('first-load-retains-exact-write-once-pre-v15-bytes',typeof preV15==='string'&&predecessor?.schemaVersion===14&&current?.schemaVersion===15, {preV15Schema:predecessor?.schemaVersion,activeSchema:current?.schemaVersion});
 record('runtime-never-operates-on-native-web-storage',slots.native.length===0,slots.native);
 const valid=await bridge(frame,'read.validate');record('fresh-schema15-validates',valid?.ok===true,valid);
 const topology=await bridge(frame,'read.topology');record('format4-has-16-semantic-and-19-physical-slots',topology?.formatVersion===4&&topology.semanticSlotCount===16&&topology.physicalSlotCount===19,topology);
 const noChange=await bridge(frame,'read.noBehaviorChange');record('b0-declares-no-reward-or-level-behavior-change',noChange?.ok===true&&noChange.rewardApplications===0&&noChange.walletApplications===0,noChange);
 await frame.locator('.bottom-nav [data-nav="fellows"]').click();await frame.getByRole('heading',{name:'Fellowship',exact:true}).waitFor();
 const currentRoster=frame.locator('[data-phase24e-roster-owner]');
 record('schema15-fellowship-renders-current-shell-owner',await currentRoster.count()===1);
 const rosterText=await currentRoster.innerText();record('schema15-fellowship-renders-relics-tab-and-20-companion-copy',await frame.locator('[data-roster="relics"]').count()===1&&rosterText.toLowerCase().includes('20 owned companions'),rosterText);
 const beforeReload=await bridge(frame,'read.snapshot'),reload=await bridge(frame,'destructive.reload'),afterReload=await bridge(frame,'read.snapshot');
 record('schema15-runtime-reload-remains-playable-and-valid',reload?.ok===true&&stateOf(afterReload)?.schemaVersion===15&&(await bridge(frame,'read.validate'))?.ok===true,reload);
 record('reload-preserves-wallet-baseline-foundation',JSON.stringify(rootOf(beforeReload))===JSON.stringify(rootOf(afterReload)),{before:rootOf(beforeReload),after:rootOf(afterReload)});

 let foreignPreV15=null;
 for(const kind of contract.fixtures){
  const migrated=await bridge(frame,'destructive.migrateSchema14',kind);
  if(kind==='established')foreignPreV15=migrated?.predecessorRaw??null;
  record(`${kind}-schema14-migrates-with-exact-actor-progression`,migrated?.ok===true&&migrated.actorProgressionPreserved===true,migrated);
  record(`${kind}-migration-installs-exact-attested-pre-v15-checkpoint`,migrated?.preV15Exact===true&&migrated.checkpointWriteOnceVerified===true,migrated);
  record(`${kind}-migration-foundation-is-zero-and-reward-neutral`,evidenceZero(migrated),migrated?.foundation);
  record(`${kind}-pending-entitlements-remain-unconverted`,migrated?.pendingPreserved===true&&migrated?.foundation?.migrationReceipt?.pendingEntitlementsConverted===false,migrated);
  const migratedValidation=await bridge(frame,'read.validate');record(`${kind}-migrated-save-validates-and-remains-current`,migratedValidation?.ok===true&&(await bridge(frame,'read.snapshot'))?.state?.schemaVersion===15,migratedValidation);
 }

 const repeatMigration=await bridge(frame,'destructive.probeMigrationInvariant','repeat-idempotence');
 record('repeat-schema15-bootstrap-is-byte-revision-and-checkpoint-idempotent',repeatMigration?.ok===true&&repeatMigration.repeatNoOp===true&&repeatMigration.activeRawUnchanged===true&&repeatMigration.activeRevisionUnchanged===true&&repeatMigration.preV15RawUnchanged===true,repeatMigration);
 record('repeat-schema15-bootstrap-does-not-write-or-duplicate-receipt',repeatMigration?.attemptWriteCount===0&&repeatMigration.receiptCount===1&&repeatMigration.checkpointWriteOnceVerified===true,repeatMigration);
 record('repeat-schema15-bootstrap-remains-valid-zero-foundation',repeatMigration?.validation?.ok===true&&evidenceZero(repeatMigration),repeatMigration);

 const collision=await bridge(frame,'destructive.probeMigrationInvariant','foreign-pre-v15-collision');
 record('foreign-pre-v15-collision-is-rejected-before-successor-write',collision?.ok===false&&collision.collisionRejected===true&&collision.rejectionCode==='conflict'&&collision.stagingWriteCount===0&&collision.activeWriteCount===0&&collision.targetAdopted===false,collision);
 record('foreign-pre-v15-collision-preserves-source-revision-and-foreign-checkpoint',collision?.activeRawUnchanged===true&&collision.activeRevisionUnchanged===true&&collision.foreignPreV15Preserved===true,collision);
 record('foreign-pre-v15-collision-helper-restores-valid-zero-schema15',collision?.restored===true&&collision.validation?.ok===true&&evidenceZero(collision),collision);

 const safeReset=await bridge(frame,'destructive.resetSafe');
 record('safe-reset-creates-independent-schema15-lineage',safeReset?.ok===true&&safeReset.lineageKind===contract.integration.safeResetLineage,safeReset);
 record('safe-reset-retains-complete-restorable-previous-installation',safeReset?.previousKind==='validated'&&safeReset.previousRestorable===true&&safeReset.previousSlotCount===contract.storage.semanticSlots&&safeReset.terminalControlsClean===true,safeReset);
 record('safe-reset-foundation-remains-zero',evidenceZero(safeReset),safeReset?.foundation);

 const previous=await bridge(frame,'destructive.roundTripPrevious');
 record('previous-save-identity-binds-all-16-slots',previous?.ok===true&&previous.identityMatches===true&&previous.slotCount===contract.storage.semanticSlots,previous);
 record('previous-save-remains-restorable-after-safe-reset',previous?.kind==='validated'&&previous.restorable===true,previous);

 const rollback=await bridge(frame,'destructive.roundTripRollback');
 record('previous-save-restore-roundtrip-restores-exact-source-installation',rollback?.ok===true&&rollback.sourceIdentityRestored===true,rollback);
 record('restore-retains-replaced-safe-installation-as-new-previous',rollback?.targetIdentityRetained===true&&rollback.previousRestorable===true&&rollback.terminalSlotCount===contract.storage.semanticSlots&&rollback.terminalControlsClean===true,rollback);

 const forgottenFormat4=await bridge(frame,'destructive.roundTripSafeResetFormat4AfterForget');
 record('safe-reset-format4-export-after-production-forget-is-standalone',forgottenFormat4?.ok===true&&forgottenFormat4.safeResetLineage===true&&forgottenFormat4.productionForgetUsed===true&&forgottenFormat4.rollbackMissingAfterForget===true&&forgottenFormat4.exportFormatVersion===contract.storage.formatVersion&&forgottenFormat4.exportSemanticSlotCount===contract.storage.semanticSlots,forgottenFormat4);
 record('safe-reset-format4-after-forget-imports-with-exact-identity',forgottenFormat4?.importSucceeded===true&&forgottenFormat4.identityPreserved===true&&forgottenFormat4.targetIdentity===forgottenFormat4.terminalIdentity,forgottenFormat4);
 record('safe-reset-format4-after-forget-reaches-clean-valid-zero-schema15',forgottenFormat4?.terminalSchemaVersion===15&&forgottenFormat4.terminalControlsClean===true&&forgottenFormat4.validation?.ok===true&&evidenceZero(forgottenFormat4),forgottenFormat4);

 const forensicPrevious=await bridge(frame,'destructive.schema14ForensicPrevious','prepare');
 record('schema14-forensic-v3-previous-migrates-with-exact-pre-v15',forensicPrevious?.ok===true&&forensicPrevious.sourceSchemaVersion===14&&forensicPrevious.terminalSchemaVersion===15&&forensicPrevious.preV15Exact===true&&forensicPrevious.validation?.ok===true,forensicPrevious);
 record('schema14-forensic-v3-previous-remains-download-only',forensicPrevious?.previousKind==='forensic'&&forensicPrevious.previousRestorable===false&&Number.isSafeInteger(forensicPrevious.previousSourceSlotCount)&&forensicPrevious.previousSourceSlotCount>0&&/^[0-9a-f]{64}$/.test(forensicPrevious.previousIdentity)&&/^[0-9a-f]{64}$/.test(forensicPrevious.previousInstallationIdentity),forensicPrevious);
 record('schema14-forensic-v3-migration-remains-zero-foundation',evidenceZero(forensicPrevious),forensicPrevious?.foundation);
 const downloadPromise=page.waitForEvent('download',{timeout:30000}),downloadResultPromise=bridge(frame,'destructive.schema14ForensicPrevious','download');
 const [download,downloadResult]=await Promise.all([downloadPromise,downloadResultPromise]),downloadPath=await download.path(),downloadRaw=fs.readFileSync(downloadPath,'utf8'),downloadRecord=JSON.parse(downloadRaw),downloadSha=createHash('sha256').update(downloadRaw).digest('hex');
 record('schema14-forensic-v3-previous-uses-actual-production-download',downloadResult?.ok===true&&downloadResult.actualDownload===true&&download.suggestedFilename()===downloadResult.fileName&&downloadRecord.identity===downloadResult.payloadIdentity&&downloadResult.payloadIdentity===downloadResult.previousIdentity,{result:downloadResult,suggestedFilename:download.suggestedFilename(),downloadBytes:Buffer.byteLength(downloadRaw),downloadSha});
 const forgottenPrevious=await bridge(frame,'destructive.schema14ForensicPrevious','forget');
 record('schema14-forensic-v3-previous-uses-production-forget-without-active-mutation',forgottenPrevious?.ok===true&&forgottenPrevious.productionForgetUsed===true&&forgottenPrevious.rollbackMissing===true&&forgottenPrevious.activeRawUnchanged===true&&forgottenPrevious.revisionUnchanged===true,forgottenPrevious);
 record('schema14-forensic-v3-after-forget-remains-valid-zero-schema15',forgottenPrevious?.validation?.ok===true&&evidenceZero(forgottenPrevious),forgottenPrevious);

 const attachDiagnostics=target=>{target.on('pageerror',error=>errors.push(`pageerror:${error.stack||error.message}`));target.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`console.${message.type()}:${message.text()}`)});target.on('requestfailed',request=>requests.push(`${request.url()}:${request.failure()?.errorText||'failed'}`))};
 const multiPage=await context.newPage();multiPage.setDefaultTimeout(30000);attachDiagnostics(multiPage);
 await multiPage.goto(`${baseURL}/__phase24l_b0_host__.html`,{waitUntil:'domcontentloaded',timeout:120000});
 const clientA=await realm(multiPage);await multiPage.locator('#realm').evaluate(node=>{node.id='client-a'});const clientB=await siblingRealm(multiPage,'client-b');
 await bridge(clientA,'destructive.reload');
 const clientABefore=await bridge(clientA,'read.snapshot'),clientBBefore=await bridge(clientB,'read.snapshot');
 record('two-real-clients-begin-from-one-valid-schema15-installation',clientABefore?.state?.schemaVersion===15&&clientBBefore?.state?.schemaVersion===15&&clientABefore.raw===clientBBefore.raw&&clientABefore.revision===clientBBefore.revision&&clientABefore?.persistence?.stale===false&&clientBBefore?.persistence?.stale===false&&evidenceZero(clientABefore)&&evidenceZero(clientBBefore),{clientA:{revision:clientABefore?.revision,stale:clientABefore?.persistence?.stale},clientB:{revision:clientBBefore?.revision,stale:clientBBefore?.persistence?.stale}});
 const staleSharedBefore=await multiPage.evaluate(()=>({writes:window.__P24LB0_SHARED__.writes.length,active:window.__P24LB0_SHARED__.slots.get('oathforge_new_world_proto_v01')??null})),winner=await bridge(clientA,'destructive.clientMutation');
 await clientB.waitForFunction(name=>window[name]?.read?.snapshot()?.persistence?.stale===true,contract.integration.productionBridge);
 const clientBStale=await bridge(clientB,'read.snapshot'),staleSharedAfterWinner=await multiPage.evaluate(()=>({writes:window.__P24LB0_SHARED__.writes.length,active:window.__P24LB0_SHARED__.slots.get('oathforge_new_world_proto_v01')??null})),loser=await bridge(clientB,'destructive.clientMutation'),staleSharedAfterLoser=await multiPage.evaluate(()=>({writes:window.__P24LB0_SHARED__.writes.length,active:window.__P24LB0_SHARED__.slots.get('oathforge_new_world_proto_v01')??null}));
 record('first-real-client-commits-one-valid-revision',winner?.ok===true&&winner.afterRevision===winner.beforeRevision+1&&winner.writeCount>0&&winner.validation?.ok===true&&evidenceZero(winner),winner);
 record('storage-event-marks-second-real-client-stale-before-its-write',clientBStale?.persistence?.stale===true&&clientBStale.raw===staleSharedAfterWinner.active&&clientBStale.revision===winner.afterRevision,{before:{revision:clientBBefore?.revision,raw:clientBBefore?.raw?.length},stale:{revision:clientBStale?.revision,raw:clientBStale?.raw?.length,persistence:clientBStale?.persistence}});
 record('stale-second-client-is-refused-with-zero-storage-writes',loser?.ok===false&&loser.errorCode==='conflict'&&loser.writeCount===0&&loser.localRawUnchanged===true&&loser.localRevisionUnchanged===true&&staleSharedAfterLoser.writes===staleSharedAfterWinner.writes&&staleSharedAfterLoser.active===staleSharedAfterWinner.active&&staleSharedAfterWinner.active!==staleSharedBefore.active,loser);
 await multiPage.close();

 const checkpointPage=await context.newPage();checkpointPage.setDefaultTimeout(30000);attachDiagnostics(checkpointPage);
 await checkpointPage.goto(`${baseURL}/__phase24l_b0_host__.html`,{waitUntil:'domcontentloaded',timeout:120000});
 const checkpointClientA=await realm(checkpointPage);await checkpointPage.locator('#realm').evaluate(node=>{node.id='checkpoint-client-a'});const checkpointClientB=await siblingRealm(checkpointPage,'checkpoint-client-b');
 await bridge(checkpointClientA,'destructive.reload');
 const checkpointBefore=await bridge(checkpointClientA,'read.snapshot'),foreignClientId=await checkpointClientB.evaluate(()=>window.__P24LB0_CLIENT_ID__),stagingKey=`${contract.storage.namespace}__staging`;
 const checkpointSharedBefore=await checkpointPage.evaluate(({activeKey,preV15Key,stagingKey,foreignPreV15,foreignClientId})=>{const shared=window.__P24LB0_SHARED__,result={writeIndex:shared.writes.length,active:shared.slots.get(activeKey)??null,preV15:shared.slots.get(preV15Key)??null,staging:shared.slots.get(stagingKey)??null};shared.fault={step:'staging-write',phase:'after',key:preV15Key,value:foreignPreV15,foreignClientId,fired:false};return result},{activeKey:contract.storage.activeKey,preV15Key:contract.storage.preV15Key,stagingKey,foreignPreV15,foreignClientId});
 const checkpointConflict=await bridge(checkpointClientA,'destructive.clientMutation'),checkpointSharedAfter=await checkpointPage.evaluate(({activeKey,preV15Key,stagingKey,start})=>{const shared=window.__P24LB0_SHARED__;return{faultFired:shared.fault?.fired===true,trace:shared.writes.slice(start),active:shared.slots.get(activeKey)??null,preV15:shared.slots.get(preV15Key)??null,staging:shared.slots.get(stagingKey)??null}},{activeKey:contract.storage.activeKey,preV15Key:contract.storage.preV15Key,stagingKey,start:checkpointSharedBefore.writeIndex});
 const writerClientId=await checkpointClientA.evaluate(()=>window.__P24LB0_CLIENT_ID__),writerStageWrites=checkpointSharedAfter.trace.filter(entry=>entry[0]===stagingKey&&entry[2]===writerClientId),writerActiveWrites=checkpointSharedAfter.trace.filter(entry=>entry[0]===contract.storage.activeKey&&entry[2]===writerClientId),foreignCheckpointWrites=checkpointSharedAfter.trace.filter(entry=>entry[0]===contract.storage.preV15Key&&entry[2]===foreignClientId);
 record('protected-pre-v15-conflict-is-injected-by-a-distinct-real-client',typeof foreignPreV15==='string'&&foreignPreV15!==checkpointSharedBefore.preV15&&foreignClientId!==writerClientId&&checkpointSharedAfter.faultFired===true&&foreignCheckpointWrites.length===1&&foreignCheckpointWrites[0][1]===foreignPreV15,{writerClientId,foreignClientId,trace:checkpointSharedAfter.trace.map(entry=>[entry[0],String(entry[1]).length,entry[2]])});
 record('protected-pre-v15-change-after-staging-refuses-active-commit',checkpointConflict?.ok===false&&['conflict','staging-validation'].includes(checkpointConflict.errorCode)&&checkpointConflict.localRawUnchanged===true&&checkpointConflict.localRevisionUnchanged===true&&checkpointConflict.writeCount===1&&writerStageWrites.length===1&&writerActiveWrites.length===0&&checkpointSharedAfter.active===checkpointSharedBefore.active&&checkpointSharedAfter.staging!==null&&checkpointSharedAfter.preV15===foreignPreV15,checkpointConflict);
 await checkpointPage.evaluate(({preV15Key,stagingKey,preV15})=>{const shared=window.__P24LB0_SHARED__;shared.slots.set(preV15Key,preV15);shared.slots.delete(stagingKey);shared.fault=null},{preV15Key:contract.storage.preV15Key,stagingKey,preV15:checkpointSharedBefore.preV15});
 const checkpointReload=await bridge(checkpointClientA,'destructive.reload'),checkpointFinal=await bridge(checkpointClientA,'read.snapshot');
 record('protected-pre-v15-conflict-fixture-restores-valid-clean-schema15',checkpointReload?.ok===true&&checkpointFinal?.state?.schemaVersion===15&&checkpointFinal?.saveSnapshot?.ordinaryStaging===null&&checkpointFinal?.saveSnapshot?.preV15===checkpointBefore?.saveSnapshot?.preV15&&(await bridge(checkpointClientA,'read.validate'))?.ok===true&&evidenceZero(checkpointFinal),{reload:checkpointReload,final:{schema:checkpointFinal?.state?.schemaVersion,stale:checkpointFinal?.persistence?.stale,blocked:checkpointFinal?.persistence?.blocked}});
 await checkpointPage.close();

 for(const version of contract.storage.acceptedImportVersions){
  const imported=await bridge(frame,'destructive.roundTripExportImport',version);
  record(`format${version}-recovery-import-reaches-valid-schema15`,imported?.ok===true&&evidenceZero(imported)&&(await bridge(frame,'read.validate'))?.ok===true,imported);
  record(`format${version}-recovery-import-cleans-transaction-controls`,imported?.terminalControlsClean===true,imported);
  if(version===4)record('format4-import-preserves-exact-installation-identity',imported?.identityPreserved===true&&imported.targetIdentity===imported.terminalIdentity,imported);
  else record(`format${version}-import-is-explicitly-recognized-as-legacy`,imported?.legacyFormatVersion===version,imported);
 }

 const recoveryCases=[
  ['schema14-migration-pending','migration','target'],
  ['schema14-migration-committed','migration','target'],
  ['ordinary-staging-pending','current-mutation','target'],
  ['ordinary-staging-committed','current-mutation','target'],
  ['safe-reset-after-journal','save-tool','source'],
  ['safe-reset-after-rollback','save-tool','source'],
  ['safe-reset-after-active','save-tool','target'],
  ['import-after-journal','save-tool','source'],
  ['import-after-rollback','save-tool','source'],
  ['import-after-active','save-tool','target']
 ];
 for(const [kind,transactionClass,outcome] of recoveryCases){
  const recovered=await bridge(frame,'destructive.recoverInterrupted',kind);
  record(`${kind}-recovers-to-one-authentic-terminal-installation`,recovered?.ok===true&&recovered.recoveryOutcome===outcome&&recovered.terminalControlsClean===true,recovered);
  record(`${kind}-uses-exact-transaction-class`,recovered?.transactionClass===transactionClass,recovered?.transactionClass);
  record(`${kind}-retains-checkpoint-and-valid-schema15`,recovered?.checkpointPreserved===true&&recovered?.validation?.ok===true&&recovered?.state?.schemaVersion===15,recovered?.validation);
 }

 const forensicKinds=['future-schema','invalid-schema15','malformed-active','missing-active'];
 for(const kind of forensicKinds){
  const reset=await bridge(frame,'destructive.forensicReset',kind);
  record(`${kind}-blocked-installation-can-safe-reset-to-schema15`,reset?.ok===true&&reset.sourceWasBlocked===true&&reset.terminalSchemaVersion===15&&reset.terminalLineage===contract.integration.safeResetLineage,reset);
  record(`${kind}-forensic-previous-retains-all-source-bytes`,reset?.previousKind==='forensic'&&reset.previousRestorable===false&&reset.previousSourceSlotCount===contract.storage.fullSnapshotSlots-2&&reset.sourceBytesExact===true,reset);
  record(`${kind}-safe-reset-marker-binds-exact-forensic-source`,reset?.markerBindsExactSource===true&&reset.terminalControlsClean===true&&evidenceZero(reset),reset);
 }

 for(const kind of forensicKinds)for(const boundary of ['after-journal','after-rollback','after-active']){
 const recovered=await bridge(frame,'destructive.recoverForensic',kind,boundary);
  record(`${kind}-${boundary}-forensic-reset-recovers-deterministically`,recovered?.ok===true&&recovered.sourceWasBlocked===true&&recovered.recoveryOutcome===recovered.expectedOutcome,recovered);
  record(`${kind}-${boundary}-forensic-reset-leaves-clean-controls`,recovered?.terminalControlsClean===true,recovered);
  if(boundary==='after-active')record(`${kind}-${boundary}-retains-exact-forensic-previous`,recovered?.sourceBlockedAfterRecovery===false&&recovered.terminalSchemaVersion===15&&recovered.forensicPreviousRetained===true&&recovered.sourceIdentityRetained===true&&evidenceZero(recovered),recovered);
  else record(`${kind}-${boundary}-restores-exact-blocked-source`,recovered?.sourceBlockedAfterRecovery===true&&recovered.sourceBytesRestored===true&&recovered.forensicPreviousRetained===false,recovered);
 }

 for(const kind of ['wallet-nonzero','ledger-entry','baseline-ahead','receipt-wallet-application']){
  const refusal=await bridge(frame,'destructive.probeInvalid',kind);
  record(`${kind}-tamper-is-rejected`,refusal?.ok===false&&refusal.rejected===true&&Array.isArray(refusal.errors)&&refusal.errors.length>0,refusal);
  record(`${kind}-tamper-is-write-and-revision-neutral`,refusal?.writes===0&&refusal.rawUnchanged===true&&refusal.revisionUnchanged===true,refusal);
 }

 for(const kind of ['fellow-authored','fellow-campaign','companion-campaign','companion-tower']){
  const reward=await bridge(frame,'destructive.legacyReward',kind);
  record(`${kind}-legacy-exp-path-still-changes-actor-progression`,reward?.ok===true&&reward.actorsChanged===true&&reward.rawChanged===true,reward);
  record(`${kind}-legacy-exp-path-does-not-credit-new-wallet-or-ledger`,reward?.rootUnchanged===true&&evidenceZero(reward),reward?.foundation);
  record(`${kind}-legacy-exp-path-persists-valid-schema15`,reward?.validation?.ok===true,reward?.validation);
  const baseline=await bridge(frame,'read.noBehaviorChange');
  record(`${kind}-immutable-baselines-remain-checkpoint-exact-and-not-ahead`,baseline?.actorBaselinesExact===true&&baseline?.liveNotBelowBaseline===true,baseline);
 }

 const exported=await bridge(frame,'read.exportSave');
 record('schema15-export-is-format4-with-16-semantic-slots',exported?.formatVersion===4&&Object.keys(exported?.slots||{}).length===contract.storage.semanticSlots,exported&&{formatVersion:exported.formatVersion,slotCount:Object.keys(exported.slots||{}).length});
 const finalSnapshot=await bridge(frame,'read.snapshot');record('final-runtime-state-is-valid-zero-foundation-schema15',stateOf(finalSnapshot)?.schemaVersion===15&&zeroFoundation(rootOf(finalSnapshot))&&(await bridge(frame,'read.validate'))?.ok===true,finalSnapshot?.foundation);
 const finalSlots=await shared(page);record('all-destructive-qa-runs-remain-on-isolated-memory-storage',finalSlots.native.length===0,finalSlots.native);
 }
 record('zero-warning-error-console',errors.length===0,errors);
}catch(error){let diagnostic=null;try{diagnostic=await Promise.all(page.frames().map(async frame=>({url:frame.url(),body:(await frame.locator('body').innerText().catch(()=>'' )).slice(0,1800),globals:await frame.evaluate(()=>Object.getOwnPropertyNames(window).filter(name=>name.includes('PHASE_24L')).sort()).catch(()=>[])})))}catch{}record('browser-journey-fatal',false,{error:error.stack||error.message,errors:capturedErrors,requests:capturedRequests,diagnostic})}
finally{if(context)await context.close();if(browser)await browser.close();instance.closeAllConnections?.();await new Promise(resolve=>instance.close(resolve))}

const failed=rows.filter(row=>!row.pass);for(const row of failed)console.error(`FAIL ${row.id}${row.detail?` · ${row.detail}`:''}`);console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);if(failed.length)process.exitCode=1;
