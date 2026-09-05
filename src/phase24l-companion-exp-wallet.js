/* Everstead Phase 24L-C1 · pure Companion EXP wallet, ledger, projection, and compatibility engine. */
(function installEversteadPhaseTwentyFourLCompanionExpWallet(global){
  'use strict';

  const FOUNDATION=global.EVERSTEAD_PHASE24L_EXP_FOUNDATION;
  const B1=global.EVERSTEAD_PHASE24L_FELLOW_EXP_WALLET;
  const ROOT_KEY='experienceProgression';
  const ROOT_VERSION=3;
  const PREDECESSOR_ROOT_VERSION=2;
  const POLICY_ID='everstead.exp-wallet.phase-24l.v3';
  const ACTIVATION_ID='activation.phase-24l-c1-companion-exp-wallet.v1';
  const ACTIVATION_VERSION=1;
  const LEDGER_VERSION=3;
  const CHECKPOINT_VERSION=1;
  const ENTRY_VERSION=1;
  const PREVIEW_VERSION=1;
  const TUTORIAL_VERSION=1;
  const B1_LINEAGE_VERSION=1;
  const TUTORIAL_IDS=Object.freeze({firstCredit:'tutorial.phase-24l-c1.companion-exp-earned.v1',firstSpend:'tutorial.phase-24l-c1.companion-exp-spent.v1'});
  const PRODUCTION_CREDIT_SOURCES=new Set(['companion-campaign','companion-tower-clear','companion-tower-idle','manual-reward-claim']);
  const QA_CREDIT_SOURCE='qa-companion-exp';
  const TARGET_SCOPED_SOURCES=new Set(['companion-tower-idle','manual-reward-claim']);
  const MAX_TAIL_ENTRIES=256;
  const FOLD_BATCH_SIZE=64;
  const MAX_BATCH_CREDITS=32;
  const BPS_DENOMINATOR=10000n;
  const TOKEN=/^[A-Za-z0-9._:/-]{1,256}$/;
  const HASH=/^[0-9a-f]{64}$/;

  const isObject=value=>Boolean(value)&&typeof value==='object'&&!Array.isArray(value);
  const safe=value=>Number.isSafeInteger(value)&&value>=0;
  const clone=value=>JSON.parse(JSON.stringify(value));
  const exactKeys=(value,keys)=>isObject(value)&&Object.keys(value).length===keys.length&&keys.every(key=>Object.hasOwn(value,key));
  const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){for(const child of Object.values(value))freeze(child);Object.freeze(value)}return value};
  const canonical=value=>FOUNDATION.canonicalStringify(value);
  const sha256=value=>FOUNDATION.sha256(value);
  const same=(left,right)=>canonical(left)===canonical(right);
  const success=value=>freeze({ok:true,...value});
  const failure=reason=>freeze({ok:false,reason});
  const fail=reason=>{const error=new Error(reason);error.phase24lReason=reason;throw error};
  const attempt=work=>{try{return work()}catch(error){return failure(error?.phase24lReason||'invalid-input')}};
  const sortedIds=actors=>Object.keys(actors||{}).sort();
  const zeroMap=ids=>Object.fromEntries(ids.map(id=>[id,0]));
  const mapKeysMatch=(map,ids)=>isObject(map)&&same(Object.keys(map),ids)&&Object.values(map).every(safe);
  const add=(left,right,reason='unsafe-integer')=>{if(!safe(left)||!safe(right)||left>Number.MAX_SAFE_INTEGER-right)fail(reason);return left+right};
  const subtract=(left,right,reason='negative-balance')=>{if(!safe(left)||!safe(right)||right>left)fail(reason);return left-right};
  const identity=(tag,value)=>sha256(canonical([tag,value]));
  const withoutIdentity=value=>({...clone(value),identity:''});
  const emptyWallet=()=>({balance:0,creditedTotal:0,spentTotal:0});
  const b1Options=options=>isObject(options?.b1Options)?options.b1Options:options;

  function dependencyReady(){return Boolean(FOUNDATION&&FOUNDATION.version===1&&B1&&B1.version===1&&B1.rootVersion===PREDECESSOR_ROOT_VERSION&&B1.policyId==='everstead.exp-wallet.phase-24l.v2'&&B1.dependencyReady())}
  function requireDependency(){if(!dependencyReady())fail('phase24l-b1-wallet-unavailable')}
  function rootIdentity(root){return identity('phase24l.c1.root.v3',['companion',root])}
  function companionRosterIdentity(saveId,companionIds){return identity('phase24l.c1.companion-roster.v1',['companion',saveId,companionIds])}
  function activationIdentity(activation){return identity('phase24l.c1.activation.v1',['companion',withoutIdentity(activation)])}
  function activationReceiptIdentity(receipt){return identity('phase24l.c1.activation-receipt.v1',['companion',withoutIdentity(receipt)])}
  function investedMapIdentity(saveId,kind,rosterIdentity,map){return identity('phase24l.c1.invested-map.v1',['companion',saveId,kind,rosterIdentity,map])}
  function sourceIdentity(kind,id,historicalTargetId){
    if(typeof kind!=='string'||!TOKEN.test(kind)||typeof id!=='string'||!TOKEN.test(id)||typeof historicalTargetId!=='string'||!TOKEN.test(historicalTargetId))fail('invalid-source');
    const scoped=TARGET_SCOPED_SOURCES.has(kind);
    return identity('phase24l.c1.credit-source.v1',scoped?['companion',kind,id,historicalTargetId]:['companion',kind,id]);
  }
  function makeSource(kind,id,historicalTargetId){return freeze({kind,id,identity:sourceIdentity(kind,id,historicalTargetId)})}
  function entryIdentity(entry){return identity('phase24l.c1.ledger-entry.v1',['companion',withoutIdentity(entry)])}
  function previewIdentity(preview){return identity('phase24l.c1.spend-preview.v1',['companion',withoutIdentity(preview)])}
  function requestIdentity(previewHash){return identity('phase24l.c1.spend-request.v1',['companion',previewHash])}
  function checkpointIdentity(checkpoint){return identity('phase24l.c1.ledger-checkpoint.v1',['companion',withoutIdentity(checkpoint)])}
  function b1LineageRecordIdentity(lineage){return identity('phase24l.c1.b1-lineage-record.v1',['companion',withoutIdentity(lineage)])}
  function tutorialMarkerIdentity(marker){return identity('phase24l.c1.tutorial-marker.v1',['companion',withoutIdentity(marker)])}
  function tutorialsIdentity(tutorials){return identity('phase24l.c1.tutorials.v1',['companion',withoutIdentity(tutorials)])}
  function genesisChainIdentity(saveId,companionIds){return identity('phase24l.c1.ledger-chain-genesis.v1',['companion',saveId,companionIds])}
  function genesisSourceFoldIdentity(saveId,rosterIdentity){return identity('phase24l.c1.source-fold-genesis.v1',['companion',saveId,rosterIdentity])}
  function genesisRequestFoldIdentity(saveId,rosterIdentity){return identity('phase24l.c1.request-fold-genesis.v1',['companion',saveId,rosterIdentity])}
  function genesisB1LineageIdentity(saveId,rootIdentityValue){return identity('phase24l.c1.b1-lineage-genesis.v1',['companion',saveId,rootIdentityValue])}
  function foldToken(prior,tag,value){return identity(tag,['companion',prior,value])}
  function actorExpMap(actors){return Object.fromEntries(sortedIds(actors).map(id=>{const exp=actors[id]?.exp;if(!safe(exp))fail('invalid-companion-exp');return[id,exp]}))}
  function companionLevelAt(exp,state,companionId,options){
    if(typeof options?.companionLevelForExp!=='function')fail('missing-companion-level-authority');
    const level=options.companionLevelForExp(exp,freeze(clone(state)),companionId);
    if(!Number.isSafeInteger(level)||level<1)fail('invalid-companion-level-authority');
    return level;
  }
  function actorLevelMap(state,options){return Object.fromEntries(sortedIds(state.companions).map(id=>{const actor=state.companions[id],level=companionLevelAt(actor.exp,state,id,options);if(actor.level!==level)fail('invalid-companion-level');return[id,level]}))}

  function createB1Lineage(saveId,b1Root){const rootIdentityValue=B1.rootIdentity(b1Root),lineage={version:B1_LINEAGE_VERSION,activationRootIdentity:rootIdentityValue,currentRootIdentity:rootIdentityValue,transitionCount:0,lineageIdentity:genesisB1LineageIdentity(saveId,rootIdentityValue),identity:''};lineage.identity=b1LineageRecordIdentity(lineage);return lineage}
  function createCheckpoint(saveId,companionIds){
    const rosterIdentity=companionRosterIdentity(saveId,companionIds),checkpoint={version:CHECKPOINT_VERSION,companionRosterIdentity:rosterIdentity,throughSequence:0,creditCount:0,spendCount:0,creditedTotal:0,spentTotal:0,rawCreditedTotal:0,rawCreditByCompanionId:zeroMap(companionIds),spentByCompanionId:zeroMap(companionIds),foldedChainIdentity:genesisChainIdentity(saveId,companionIds),foldedSourceIdentity:genesisSourceFoldIdentity(saveId,rosterIdentity),foldedRequestIdentity:genesisRequestFoldIdentity(saveId,rosterIdentity),foldedSourceIdentities:[],foldedRequestIds:[],identity:''};
    checkpoint.identity=checkpointIdentity(checkpoint);return checkpoint;
  }
  function createLedger(saveId,companionIds,b1Root){const checkpoint=createCheckpoint(saveId,companionIds);return{version:LEDGER_VERSION,throughSequence:0,entryCount:0,foldedIdentity:checkpoint.identity,checkpoint,entries:[],b1Lineage:createB1Lineage(saveId,b1Root)}}
  function ledgerHeadIdentity(ledger){return ledger.entries.length?ledger.entries[ledger.entries.length-1].identity:ledger.checkpoint.foldedChainIdentity}
  function emptyTutorialMarker(kind){const marker={tutorialId:TUTORIAL_IDS[kind],replayable:true,completed:false,completedAt:null,entrySequence:null,entryIdentity:null,identity:''};marker.identity=tutorialMarkerIdentity(marker);return marker}
  function createTutorials(){const tutorials={version:TUTORIAL_VERSION,firstCredit:emptyTutorialMarker('firstCredit'),firstSpend:emptyTutorialMarker('firstSpend'),identity:''};tutorials.identity=tutorialsIdentity(tutorials);return tutorials}
  function completeTutorial(tutorials,kind,entry){
    const next=clone(tutorials),marker=next[kind];if(marker.completed)return next;
    marker.completed=true;marker.completedAt=entry.occurredAt;marker.entrySequence=entry.sequence;marker.entryIdentity=entry.identity;marker.identity='';marker.identity=tutorialMarkerIdentity(marker);next.identity='';next.identity=tutorialsIdentity(next);return next;
  }

  function creditAward(rawAmount,authoredBps,collectionBps){
    if(!safe(rawAmount)||rawAmount<=0||!safe(authoredBps)||!safe(collectionBps))fail('invalid-credit-amount');
    const totalBps=add(authoredBps,collectionBps,'unsafe-bps'),awardedBig=(BigInt(rawAmount)*(BPS_DENOMINATOR+BigInt(totalBps)))/BPS_DENOMINATOR;
    if(awardedBig>BigInt(Number.MAX_SAFE_INTEGER))fail('unsafe-credit-award');
    const awardedAmount=Number(awardedBig);if(!safe(awardedAmount)||awardedAmount<=0)fail('empty-credit-award');return{totalBps,awardedAmount};
  }
  function validateWallet(wallet,{neutral=false}={}){return exactKeys(wallet,['balance','creditedTotal','spentTotal'])&&safe(wallet.balance)&&safe(wallet.creditedTotal)&&safe(wallet.spentTotal)&&wallet.creditedTotal>=wallet.spentTotal&&wallet.balance===wallet.creditedTotal-wallet.spentTotal&&(!neutral||(wallet.balance===0&&wallet.creditedTotal===0&&wallet.spentTotal===0))}
  function validateActor(actor){return exactKeys(actor,['exp','level'])&&safe(actor.exp)&&Number.isSafeInteger(actor.level)&&actor.level>=1}
  function sourceKindAllowed(kind,{allowQaSource=false}={}){return PRODUCTION_CREDIT_SOURCES.has(kind)||(allowQaSource===true&&kind===QA_CREDIT_SOURCE)}
  function sourceTargetBindingValid(kind,id,target){return !TARGET_SCOPED_SOURCES.has(kind)||id.endsWith(`:${target}`)}
  function validateSource(source,historicalTargetId,options){return exactKeys(source,['kind','id','identity'])&&sourceKindAllowed(source.kind,options)&&sourceTargetBindingValid(source.kind,source.id,historicalTargetId)&&source.identity===sourceIdentity(source.kind,source.id,historicalTargetId)}

  function validateCreditEntry(entry,context,options){
    const keys=['version','sequence','kind','roster','stateRevision','occurredAt','source','historicalTargetId','rawAmount','authoredBps','collectionBps','totalBps','rounding','awardedAmount','walletBefore','walletAfter','previousEntryIdentity','identity'];
    if(!exactKeys(entry,keys)||entry.version!==ENTRY_VERSION||entry.kind!=='credit'||entry.roster!=='companion'||!safe(entry.sequence)||entry.sequence<=0||!safe(entry.stateRevision)||!safe(entry.occurredAt)||!validateSource(entry.source,entry.historicalTargetId,options)||!Object.hasOwn(context.rawByCompanion,entry.historicalTargetId)||entry.rounding!=='floor'||!safe(entry.walletBefore)||!safe(entry.walletAfter)||!HASH.test(entry.previousEntryIdentity)||entry.identity!==entryIdentity(entry))return false;
    let award;try{award=creditAward(entry.rawAmount,entry.authoredBps,entry.collectionBps)}catch{return false}
    if(entry.totalBps!==award.totalBps||entry.awardedAmount!==award.awardedAmount||entry.walletBefore!==context.balance)return false;
    try{context.credited=add(context.credited,entry.awardedAmount);context.rawCredited=add(context.rawCredited,entry.rawAmount);context.balance=add(context.balance,entry.awardedAmount);context.rawByCompanion[entry.historicalTargetId]=add(context.rawByCompanion[entry.historicalTargetId],entry.rawAmount);context.creditCount=add(context.creditCount,1)}catch{return false}
    return entry.walletAfter===context.balance;
  }
  function validateSpendEntry(entry,context,state,options){
    const keys=['version','sequence','kind','roster','stateRevision','occurredAt','requestId','companionId','mode','levels','amount','walletBefore','walletAfter','actorBefore','actorAfter','previewIdentity','previousEntryIdentity','identity'];
    if(!exactKeys(entry,keys)||entry.version!==ENTRY_VERSION||entry.kind!=='spend'||entry.roster!=='companion'||!safe(entry.sequence)||entry.sequence<=0||!safe(entry.stateRevision)||!safe(entry.occurredAt)||!HASH.test(entry.requestId)||!Object.hasOwn(context.spentByCompanion,entry.companionId)||!['x1','x10','max'].includes(entry.mode)||!safe(entry.levels)||entry.levels<=0||!safe(entry.amount)||entry.amount<=0||!safe(entry.walletBefore)||!safe(entry.walletAfter)||!validateActor(entry.actorBefore)||!validateActor(entry.actorAfter)||!HASH.test(entry.previewIdentity)||!HASH.test(entry.previousEntryIdentity)||entry.identity!==entryIdentity(entry)||entry.walletBefore!==context.balance||entry.actorBefore.exp!==context.investedByCompanion[entry.companionId])return false;
    let expectedExp,beforeLevel,afterLevel;try{expectedExp=add(entry.actorBefore.exp,entry.amount);beforeLevel=companionLevelAt(entry.actorBefore.exp,state,entry.companionId,options);afterLevel=companionLevelAt(entry.actorAfter.exp,state,entry.companionId,options)}catch{return false}
    if(entry.actorAfter.exp!==expectedExp||entry.actorBefore.level!==beforeLevel||entry.actorAfter.level!==afterLevel||entry.actorAfter.level-entry.actorBefore.level!==entry.levels)return false;
    try{context.spent=add(context.spent,entry.amount);context.balance=subtract(context.balance,entry.amount);context.spentByCompanion[entry.companionId]=add(context.spentByCompanion[entry.companionId],entry.amount);context.investedByCompanion[entry.companionId]=add(context.investedByCompanion[entry.companionId],entry.amount);context.spendCount=add(context.spendCount,1)}catch{return false}
    return entry.walletAfter===context.balance;
  }
  function validateCheckpoint(checkpoint,saveId,companionIds){
    const keys=['version','companionRosterIdentity','throughSequence','creditCount','spendCount','creditedTotal','spentTotal','rawCreditedTotal','rawCreditByCompanionId','spentByCompanionId','foldedChainIdentity','foldedSourceIdentity','foldedRequestIdentity','foldedSourceIdentities','foldedRequestIds','identity'],rosterIdentity=companionRosterIdentity(saveId,companionIds);
    if(!exactKeys(checkpoint,keys)||checkpoint.version!==CHECKPOINT_VERSION||checkpoint.companionRosterIdentity!==rosterIdentity||!safe(checkpoint.throughSequence)||!safe(checkpoint.creditCount)||!safe(checkpoint.spendCount)||checkpoint.throughSequence!==checkpoint.creditCount+checkpoint.spendCount||!safe(checkpoint.creditedTotal)||!safe(checkpoint.spentTotal)||checkpoint.creditedTotal<checkpoint.spentTotal||!safe(checkpoint.rawCreditedTotal)||!mapKeysMatch(checkpoint.rawCreditByCompanionId,companionIds)||!mapKeysMatch(checkpoint.spentByCompanionId,companionIds)||!HASH.test(checkpoint.foldedChainIdentity)||!HASH.test(checkpoint.foldedSourceIdentity)||!HASH.test(checkpoint.foldedRequestIdentity)||!Array.isArray(checkpoint.foldedSourceIdentities)||!Array.isArray(checkpoint.foldedRequestIds)||checkpoint.foldedSourceIdentities.length!==checkpoint.creditCount||checkpoint.foldedRequestIds.length!==checkpoint.spendCount||checkpoint.foldedSourceIdentities.some(value=>!HASH.test(value))||checkpoint.foldedRequestIds.some(value=>!HASH.test(value))||new Set(checkpoint.foldedSourceIdentities).size!==checkpoint.foldedSourceIdentities.length||new Set(checkpoint.foldedRequestIds).size!==checkpoint.foldedRequestIds.length||checkpoint.identity!==checkpointIdentity(checkpoint))return false;
    let rawTotal=0,spentTotal=0,sourceFold=genesisSourceFoldIdentity(saveId,rosterIdentity),requestFold=genesisRequestFoldIdentity(saveId,rosterIdentity);try{for(const value of Object.values(checkpoint.rawCreditByCompanionId))rawTotal=add(rawTotal,value);for(const value of Object.values(checkpoint.spentByCompanionId))spentTotal=add(spentTotal,value);for(const value of checkpoint.foldedSourceIdentities)sourceFold=foldToken(sourceFold,'phase24l.c1.folded-source.v1',value);for(const value of checkpoint.foldedRequestIds)requestFold=foldToken(requestFold,'phase24l.c1.folded-request.v1',value)}catch{return false}if(rawTotal!==checkpoint.rawCreditedTotal||spentTotal!==checkpoint.spentTotal||sourceFold!==checkpoint.foldedSourceIdentity||requestFold!==checkpoint.foldedRequestIdentity)return false;
    return checkpoint.throughSequence!==0||(checkpoint.foldedChainIdentity===genesisChainIdentity(saveId,companionIds)&&checkpoint.foldedSourceIdentity===genesisSourceFoldIdentity(saveId,rosterIdentity)&&checkpoint.foldedRequestIdentity===genesisRequestFoldIdentity(saveId,rosterIdentity));
  }
  function validateTutorialMarker(marker,kind,ledger){
    const keys=['tutorialId','replayable','completed','completedAt','entrySequence','entryIdentity','identity'];
    if(!exactKeys(marker,keys)||marker.tutorialId!==TUTORIAL_IDS[kind]||marker.replayable!==true||typeof marker.completed!=='boolean'||marker.identity!==tutorialMarkerIdentity(marker))return false;
    if(!marker.completed)return marker.completedAt===null&&marker.entrySequence===null&&marker.entryIdentity===null;
    if(!safe(marker.completedAt)||!safe(marker.entrySequence)||marker.entrySequence<=0||marker.entrySequence>ledger.entryCount||!HASH.test(marker.entryIdentity))return false;
    if(marker.entrySequence>ledger.throughSequence){const entry=ledger.entries[marker.entrySequence-ledger.throughSequence-1],expectedKind=kind==='firstCredit'?'credit':'spend';if(entry?.sequence!==marker.entrySequence||entry.kind!==expectedKind||entry.identity!==marker.entryIdentity||entry.occurredAt!==marker.completedAt)return false}
    return true;
  }
  function validateTutorials(tutorials,ledger){
    if(!exactKeys(tutorials,['version','firstCredit','firstSpend','identity'])||tutorials.version!==TUTORIAL_VERSION||tutorials.identity!==tutorialsIdentity(tutorials)||!validateTutorialMarker(tutorials.firstCredit,'firstCredit',ledger)||!validateTutorialMarker(tutorials.firstSpend,'firstSpend',ledger))return false;
    const creditCount=ledger.checkpoint.creditCount+ledger.entries.filter(entry=>entry.kind==='credit').length,spendCount=ledger.checkpoint.spendCount+ledger.entries.filter(entry=>entry.kind==='spend').length;
    return tutorials.firstCredit.completed===(creditCount>0)&&tutorials.firstSpend.completed===(spendCount>0);
  }
  function tutorialCompletion(root,kind){if(!['firstCredit','firstSpend'].includes(kind)||!validateTutorials(root?.companionTutorials,root?.companionLedger))return failure('invalid-tutorial-state');return success({marker:freeze(clone(root.companionTutorials[kind]))})}

  function replayLedger(root,state,options){
    const companionIds=sortedIds(state.companions),ledger=root.companionLedger,checkpoint=ledger?.checkpoint;
    if(!exactKeys(ledger,['version','throughSequence','entryCount','foldedIdentity','checkpoint','entries','b1Lineage'])||ledger.version!==LEDGER_VERSION||!safe(ledger.throughSequence)||!safe(ledger.entryCount)||!Array.isArray(ledger.entries)||ledger.entries.length>MAX_TAIL_ENTRIES||!validateCheckpoint(checkpoint,state.saveMeta.saveId,companionIds)||!validateB1Lineage(ledger.b1Lineage,root,state)||ledger.throughSequence!==checkpoint.throughSequence||ledger.foldedIdentity!==checkpoint.identity||ledger.entryCount!==checkpoint.throughSequence+ledger.entries.length)return failure('invalid-companion-ledger');
    const context={credited:checkpoint.creditedTotal,spent:checkpoint.spentTotal,rawCredited:checkpoint.rawCreditedTotal,balance:checkpoint.creditedTotal-checkpoint.spentTotal,creditCount:checkpoint.creditCount,spendCount:checkpoint.spendCount,rawByCompanion:clone(checkpoint.rawCreditByCompanionId),spentByCompanion:clone(checkpoint.spentByCompanionId),investedByCompanion:clone(root.companionActivation.investedCompanionExpById)};
    let previous=checkpoint.foldedChainIdentity,sequence=checkpoint.throughSequence+1;const sourceIds=new Set(checkpoint.foldedSourceIdentities),requestIds=new Set(checkpoint.foldedRequestIds);
    for(const entry of ledger.entries){
      if(entry.sequence!==sequence||entry.previousEntryIdentity!==previous)return failure('broken-companion-ledger-chain');
      if(entry.kind==='credit'){if(sourceIds.has(entry.source?.identity))return failure('duplicate-companion-credit-source');sourceIds.add(entry.source?.identity);if(!validateCreditEntry(entry,context,options))return failure('invalid-companion-credit-entry')}
      else if(entry.kind==='spend'){if(requestIds.has(entry.requestId))return failure('duplicate-companion-spend-request');requestIds.add(entry.requestId);if(!validateSpendEntry(entry,context,state,options))return failure('invalid-companion-spend-entry')}
      else return failure('invalid-companion-ledger-entry-kind');
      previous=entry.identity;sequence++;
    }
    let rawTotal=0,spentTotal=0;try{for(const value of Object.values(context.rawByCompanion))rawTotal=add(rawTotal,value);for(const value of Object.values(context.spentByCompanion))spentTotal=add(spentTotal,value)}catch{return failure('companion-ledger-map-overflow')}
    const wallet=root.wallets.companion;if(context.creditCount+context.spendCount!==ledger.entryCount||context.credited!==wallet.creditedTotal||context.spent!==wallet.spentTotal||context.balance!==wallet.balance||rawTotal!==context.rawCredited||spentTotal!==context.spent)return failure('companion-wallet-ledger-mismatch');
    return success({replay:freeze({...context,headIdentity:previous})});
  }

  function v2RootFromV3(root){
    return{version:PREDECESSOR_ROOT_VERSION,policyId:B1.policyId,activatedAt:root.activatedAt,baselines:clone(root.baselines),wallets:{fellow:clone(root.wallets.fellow),companion:emptyWallet()},ledger:clone(root.ledger),migration:clone(root.migration),activation:clone(root.activation),tutorials:clone(root.tutorials)};
  }
  function validateB1Lineage(lineage,root,state){
    const keys=['version','activationRootIdentity','currentRootIdentity','transitionCount','lineageIdentity','identity'];
    if(!exactKeys(lineage,keys)||lineage.version!==B1_LINEAGE_VERSION||!HASH.test(lineage.activationRootIdentity)||!HASH.test(lineage.currentRootIdentity)||!safe(lineage.transitionCount)||!HASH.test(lineage.lineageIdentity)||lineage.identity!==b1LineageRecordIdentity(lineage)||lineage.activationRootIdentity!==root.companionActivation?.predecessorRootIdentity||lineage.currentRootIdentity!==B1.rootIdentity(v2RootFromV3(root)))return false;
    return lineage.transitionCount!==0||(lineage.currentRootIdentity===lineage.activationRootIdentity&&lineage.lineageIdentity===genesisB1LineageIdentity(state.saveMeta.saveId,lineage.activationRootIdentity));
  }
  function advanceB1Lineage(lineage,saveId,entry,nextB1Root){
    if(!isObject(lineage)||!HASH.test(entry?.identity))fail('invalid-b1-lineage-transition');const next=clone(lineage),nextRootIdentity=B1.rootIdentity(nextB1Root);
    next.transitionCount=add(next.transitionCount,1,'unsafe-b1-lineage-count');next.lineageIdentity=identity('phase24l.c1.b1-lineage-transition.v1',['companion',saveId,next.lineageIdentity,entry.identity,next.currentRootIdentity,nextRootIdentity]);next.currentRootIdentity=nextRootIdentity;next.identity='';next.identity=b1LineageRecordIdentity(next);return next;
  }
  function validateActivation(activation,root,state){
    const companionIds=sortedIds(state.companions),rosterIdentity=companionRosterIdentity(state.saveMeta.saveId,companionIds),keys=['version','id','activatedAt','predecessorRevision','predecessorRootIdentity','sourceStateIdentity','companionRosterIdentity','investedCompanionExpById','investedCompanionLevelById','investedCompanionExpIdentity','investedCompanionLevelIdentity','receiptIdentity','identity'];
    if(!exactKeys(activation,keys)||activation.version!==ACTIVATION_VERSION||activation.id!==ACTIVATION_ID||!safe(activation.activatedAt)||activation.activatedAt>state.saveMeta.updatedAt||!safe(activation.predecessorRevision)||activation.predecessorRevision>=state.saveMeta.revision||!HASH.test(activation.predecessorRootIdentity)||!HASH.test(activation.sourceStateIdentity)||activation.companionRosterIdentity!==rosterIdentity||!mapKeysMatch(activation.investedCompanionExpById,companionIds)||!mapKeysMatch(activation.investedCompanionLevelById,companionIds)||Object.values(activation.investedCompanionLevelById).some(level=>level<1)||activation.investedCompanionExpIdentity!==investedMapIdentity(state.saveMeta.saveId,'companion-exp',rosterIdentity,activation.investedCompanionExpById)||activation.investedCompanionLevelIdentity!==investedMapIdentity(state.saveMeta.saveId,'companion-level',rosterIdentity,activation.investedCompanionLevelById)||!HASH.test(activation.receiptIdentity)||activation.identity!==activationIdentity(activation))return false;
    return true;
  }
  function validateActivationReceipt(state,root){
    const receipts=state.saveMeta.appliedMigrations.filter(item=>item?.id===ACTIVATION_ID),receipt=receipts[0],keys=['id','receiptVersion','fromRootVersion','toRootVersion','appliedAt','source','saveId','predecessorRevision','predecessorRootIdentity','sourceStateIdentity','companionRosterIdentity','investedCompanionExpIdentity','investedCompanionLevelIdentity','identity'];
    return receipts.length===1&&exactKeys(receipt,keys)&&receipt.receiptVersion===1&&receipt.fromRootVersion===2&&receipt.toRootVersion===3&&receipt.appliedAt===root.companionActivation.activatedAt&&typeof receipt.source==='string'&&TOKEN.test(receipt.source)&&receipt.saveId===state.saveMeta.saveId&&receipt.predecessorRevision===root.companionActivation.predecessorRevision&&receipt.predecessorRootIdentity===root.companionActivation.predecessorRootIdentity&&receipt.sourceStateIdentity===root.companionActivation.sourceStateIdentity&&receipt.companionRosterIdentity===root.companionActivation.companionRosterIdentity&&receipt.investedCompanionExpIdentity===root.companionActivation.investedCompanionExpIdentity&&receipt.investedCompanionLevelIdentity===root.companionActivation.investedCompanionLevelIdentity&&receipt.identity===activationReceiptIdentity(receipt)&&root.companionActivation.receiptIdentity===receipt.identity;
  }
  function assertV3Core(state,options){
    requireDependency();
    if(!isObject(state)||state.schemaVersion!==15||!isObject(state.saveMeta)||typeof state.saveMeta.saveId!=='string'||!state.saveMeta.saveId||!safe(state.saveMeta.revision)||!safe(state.saveMeta.updatedAt)||!Array.isArray(state.saveMeta.appliedMigrations)||!isObject(state.fellows)||!isObject(state.companions))fail('invalid-v3-state');
    const root=state[ROOT_KEY],keys=['version','policyId','activatedAt','baselines','wallets','ledger','migration','activation','tutorials','companionActivation','companionLedger','companionTutorials'];
    if(!exactKeys(root,keys)||root.version!==ROOT_VERSION||root.policyId!==POLICY_ID||!safe(root.activatedAt)||root.activatedAt>state.saveMeta.updatedAt||!exactKeys(root.wallets,['fellow','companion'])||!validateWallet(root.wallets.fellow)||!validateWallet(root.wallets.companion)||!validateActivation(root.companionActivation,root,state)||!validateActivationReceipt(state,root)||!validateTutorials(root.companionTutorials,root.companionLedger))fail('invalid-v3-root');
    const replay=replayLedger(root,state,options);if(!replay.ok)fail(replay.reason);return replay.replay;
  }
  function projectToV2Unsafe(state,options={}){
    const replay=assertV3Core(state,options),root=state[ROOT_KEY],projected=clone(state);
    for(const id of sortedIds(projected.companions)){const exp=add(root.companionActivation.investedCompanionExpById[id],replay.rawByCompanion[id],'unsafe-v2-projection');projected.companions[id].exp=exp;projected.companions[id].level=companionLevelAt(exp,projected,id,options)}
    projected[ROOT_KEY]=v2RootFromV3(root);projected.saveMeta.appliedMigrations=projected.saveMeta.appliedMigrations.filter(item=>item?.id!==ACTIVATION_ID);
    const checked=B1.validateV2State(projected,b1Options(options));if(checked.ok!==true)fail('invalid-v2-projection');return projected;
  }
  function projectToV2(state,options={}){return attempt(()=>success({state:freeze(projectToV2Unsafe(state,options))}))}
  function validateV3StateUnsafe(state,options={}){
    const errors=[],record=value=>{if(!errors.includes(value))errors.push(value)};let replay;
    try{replay=assertV3Core(state,options)}catch(error){return{ok:false,errors:[error?.phase24lReason||'validation.exception']}}
    for(const id of sortedIds(state.companions)){
      let expected,level,baselineLevel;try{expected=add(state[ROOT_KEY].companionActivation.investedCompanionExpById[id],replay.spentByCompanion[id],'companion-exp-overflow');level=companionLevelAt(expected,state,id,options);baselineLevel=companionLevelAt(state[ROOT_KEY].companionActivation.investedCompanionExpById[id],state,id,options)}catch(error){record(error?.phase24lReason||'companion-level-authority');break}
      if(state.companions[id]?.exp!==expected||state.companions[id]?.level!==level||state[ROOT_KEY].companionActivation.investedCompanionLevelById[id]!==baselineLevel){record(`companions.${id}.invested-exp`);break}
    }
    if(!errors.length)try{projectToV2Unsafe(state,options)}catch(error){record(error?.phase24lReason||'v2-projection')}
    return{ok:errors.length===0,errors};
  }
  function validateV3State(state,options={}){try{return validateV3StateUnsafe(state,options)}catch{return{ok:false,errors:['validation.exception']}}}
  function validateState(state,options={}){if(state?.[ROOT_KEY]?.version===PREDECESSOR_ROOT_VERSION)return B1.validateV2State(state,b1Options(options));if(state?.[ROOT_KEY]?.version===ROOT_VERSION)return validateV3State(state,options);return freeze({ok:false,errors:['experienceProgression.version']})}

  function activateV2State(state,input={},options={}){
    return attempt(()=>{
      requireDependency();if(B1.validateV2State(state,b1Options(options)).ok!==true)fail('invalid-v2-state');
      const now=input.now,source=input.source,expectedRevision=input.expectedRevision;if(!safe(now)||now<state.saveMeta.updatedAt||typeof source!=='string'||!TOKEN.test(source)||!safe(expectedRevision)||expectedRevision!==state.saveMeta.revision||expectedRevision>=Number.MAX_SAFE_INTEGER)fail('stale-activation');
      const predecessorRoot=clone(state[ROOT_KEY]),companionIds=sortedIds(state.companions),rosterIdentity=companionRosterIdentity(state.saveMeta.saveId,companionIds),expMap=actorExpMap(state.companions),levelMap=actorLevelMap(state,options),predecessorRootIdentity=B1.rootIdentity(predecessorRoot),sourceStateIdentity=identity('phase24l.c1.activation-source-state.v1',['companion',state]);
      const receipt={id:ACTIVATION_ID,receiptVersion:1,fromRootVersion:2,toRootVersion:3,appliedAt:now,source,saveId:state.saveMeta.saveId,predecessorRevision:state.saveMeta.revision,predecessorRootIdentity,sourceStateIdentity,companionRosterIdentity:rosterIdentity,investedCompanionExpIdentity:investedMapIdentity(state.saveMeta.saveId,'companion-exp',rosterIdentity,expMap),investedCompanionLevelIdentity:investedMapIdentity(state.saveMeta.saveId,'companion-level',rosterIdentity,levelMap),identity:''};receipt.identity=activationReceiptIdentity(receipt);
      const activation={version:ACTIVATION_VERSION,id:ACTIVATION_ID,activatedAt:now,predecessorRevision:state.saveMeta.revision,predecessorRootIdentity,sourceStateIdentity,companionRosterIdentity:rosterIdentity,investedCompanionExpById:expMap,investedCompanionLevelById:levelMap,investedCompanionExpIdentity:receipt.investedCompanionExpIdentity,investedCompanionLevelIdentity:receipt.investedCompanionLevelIdentity,receiptIdentity:receipt.identity,identity:''};activation.identity=activationIdentity(activation);
      const root={version:ROOT_VERSION,policyId:POLICY_ID,activatedAt:predecessorRoot.activatedAt,baselines:clone(predecessorRoot.baselines),wallets:{fellow:clone(predecessorRoot.wallets.fellow),companion:emptyWallet()},ledger:clone(predecessorRoot.ledger),migration:clone(predecessorRoot.migration),activation:clone(predecessorRoot.activation),tutorials:clone(predecessorRoot.tutorials),companionActivation:activation,companionLedger:createLedger(state.saveMeta.saveId,companionIds,predecessorRoot),companionTutorials:createTutorials()};
      const next=clone(state);next.saveMeta.revision++;next.saveMeta.updatedAt=now;next.saveMeta.source=source;next.saveMeta.appliedMigrations.push(receipt);next[ROOT_KEY]=root;
      if(!same(next.fellows,state.fellows)||!same(next.companions,state.companions)||!same(v2RootFromV3(root),predecessorRoot))fail('activation-changed-predecessor-state');
      const checked=validateV3State(next,options);if(checked.ok!==true)fail('invalid-activated-state');return success({state:freeze(next),root:freeze(clone(root)),receipt:freeze(clone(receipt))});
    });
  }

  function foldEntry(checkpoint,entry){
    const next=clone(checkpoint);if(entry.sequence!==next.throughSequence+1||entry.previousEntryIdentity!==next.foldedChainIdentity)fail('invalid-fold-order');next.throughSequence=entry.sequence;next.foldedChainIdentity=entry.identity;
    if(entry.kind==='credit'){if(next.foldedSourceIdentities.includes(entry.source.identity))fail('duplicate-folded-companion-credit-source');next.creditCount=add(next.creditCount,1);next.creditedTotal=add(next.creditedTotal,entry.awardedAmount);next.rawCreditedTotal=add(next.rawCreditedTotal,entry.rawAmount);next.rawCreditByCompanionId[entry.historicalTargetId]=add(next.rawCreditByCompanionId[entry.historicalTargetId],entry.rawAmount);next.foldedSourceIdentities.push(entry.source.identity);next.foldedSourceIdentity=foldToken(next.foldedSourceIdentity,'phase24l.c1.folded-source.v1',entry.source.identity)}
    else{if(next.foldedRequestIds.includes(entry.requestId))fail('duplicate-folded-companion-spend-request');next.spendCount=add(next.spendCount,1);next.spentTotal=add(next.spentTotal,entry.amount);next.spentByCompanionId[entry.companionId]=add(next.spentByCompanionId[entry.companionId],entry.amount);next.foldedRequestIds.push(entry.requestId);next.foldedRequestIdentity=foldToken(next.foldedRequestIdentity,'phase24l.c1.folded-request.v1',entry.requestId)}
    next.identity='';next.identity=checkpointIdentity(next);return next;
  }
  function appendEntry(root,entry){
    const next=clone(root);next.companionLedger.entries.push(entry);next.companionLedger.entryCount=add(next.companionLedger.entryCount,1);
    if(next.companionLedger.entries.length>MAX_TAIL_ENTRIES){const folded=next.companionLedger.entries.splice(0,FOLD_BATCH_SIZE);let checkpoint=next.companionLedger.checkpoint;for(const item of folded)checkpoint=foldEntry(checkpoint,item);next.companionLedger.checkpoint=checkpoint;next.companionLedger.throughSequence=checkpoint.throughSequence;next.companionLedger.foldedIdentity=checkpoint.identity}
    return next;
  }
  function assertV3StageInput(state,options){const checked=validateV3StateUnsafe(state,options);if(checked.ok!==true)fail('invalid-v3-stage-state');return replayLedger(state[ROOT_KEY],state,options).replay}
  function authenticateCreditSource(state,input,options){
      if(!sourceKindAllowed(input.sourceKind,options))fail('unsupported-companion-credit-source');if(!Object.hasOwn(state.companions,input.historicalTargetId))fail('unknown-historical-target');if(!sourceTargetBindingValid(input.sourceKind,input.sourceId,input.historicalTargetId))fail('unscoped-companion-credit-source');
      const source=makeSource(input.sourceKind,input.sourceId,input.historicalTargetId);if(typeof options.isSourceAvailable!=='function'||options.isSourceAvailable(freeze(clone(state)),source,freeze(clone(input)))!==true)fail('companion-credit-source-unavailable');return source;
  }
  function stageAuthenticatedCredit(state,root,input,options,sourceAlreadyAuthenticated=false){
      const replayResult=replayLedger(root,state,options);if(!replayResult.ok)fail(replayResult.reason);const replay=replayResult.replay;if(!sourceKindAllowed(input.sourceKind,options))fail('unsupported-companion-credit-source');if(!Object.hasOwn(state.companions,input.historicalTargetId))fail('unknown-historical-target');if(!sourceTargetBindingValid(input.sourceKind,input.sourceId,input.historicalTargetId))fail('unscoped-companion-credit-source');
      const source=makeSource(input.sourceKind,input.sourceId,input.historicalTargetId);if(!safe(input.expectedRevision)||input.expectedRevision!==state.saveMeta.revision||input.expectedHeadIdentity!==replay.headIdentity||!safe(input.expectedWalletBalance)||input.expectedWalletBalance!==root.wallets.companion.balance)fail('stale-companion-credit');
      if(!sourceAlreadyAuthenticated)authenticateCreditSource(state,input,options);if(root.companionLedger.checkpoint.foldedSourceIdentities.includes(source.identity)||root.companionLedger.entries.some(entry=>entry.kind==='credit'&&entry.source.identity===source.identity))fail('duplicate-companion-credit-source');if(!safe(input.occurredAt)||input.occurredAt<state.saveMeta.updatedAt)fail('invalid-companion-credit-time');
      const award=creditAward(input.rawAmount,input.authoredBps,input.collectionBps),walletBefore=root.wallets.companion.balance,walletAfter=add(walletBefore,award.awardedAmount),entry={version:ENTRY_VERSION,sequence:add(root.companionLedger.entryCount,1),kind:'credit',roster:'companion',stateRevision:state.saveMeta.revision,occurredAt:input.occurredAt,source,historicalTargetId:input.historicalTargetId,rawAmount:input.rawAmount,authoredBps:input.authoredBps,collectionBps:input.collectionBps,totalBps:award.totalBps,rounding:'floor',awardedAmount:award.awardedAmount,walletBefore,walletAfter,previousEntryIdentity:replay.headIdentity,identity:''};entry.identity=entryIdentity(entry);
      const next=appendEntry(root,entry);next.wallets.companion.creditedTotal=add(next.wallets.companion.creditedTotal,award.awardedAmount);next.wallets.companion.balance=walletAfter;next.companionTutorials=completeTutorial(next.companionTutorials,'firstCredit',entry);
      if(!same(next.wallets.fellow,root.wallets.fellow)||!same(next.ledger,root.ledger)||!same(next.tutorials,root.tutorials))fail('fellow-wallet-changed');const check=replayLedger(next,state,options);if(!check.ok)fail(check.reason);
      return{root:next,entry,awardedAmount:award.awardedAmount,balance:walletAfter,headIdentity:entry.identity};
  }
  function stageCredit(state,input={},options={}){
    return attempt(()=>{
      assertV3StageInput(state,options);const staged=stageAuthenticatedCredit(state,state[ROOT_KEY],input,options);
      return success({root:freeze(staged.root),entry:freeze(clone(staged.entry)),awardedAmount:staged.awardedAmount,balance:staged.balance,headIdentity:staged.headIdentity});
    });
  }
  function stageCredits(state,inputs=[],options={}){
    return attempt(()=>{
      if(!Array.isArray(inputs)||inputs.length<1||inputs.length>MAX_BATCH_CREDITS)fail('invalid-companion-credit-batch');
      assertV3StageInput(state,options);
      const first=inputs[0],expectedRevision=first?.expectedRevision,expectedHeadIdentity=first?.expectedHeadIdentity,expectedWalletBalance=first?.expectedWalletBalance;
      if(!safe(expectedRevision)||expectedRevision!==state?.saveMeta?.revision||expectedHeadIdentity!==ledgerHeadIdentity(state[ROOT_KEY].companionLedger)||!safe(expectedWalletBalance)||expectedWalletBalance!==state[ROOT_KEY].wallets.companion.balance)fail('stale-companion-credit-batch');
      for(const input of inputs)authenticateCreditSource(state,input,options);
      let initialRoot=clone(state[ROOT_KEY]);if(Object.hasOwn(options,'initialRoot')){if(options.deferSourceValidation!==true)fail('deferred-source-validation-required');initialRoot=assertDeferredFellowCreditRoot(state,options.initialRoot,options)}
      let workingRoot=initialRoot,awardedTotal=0;const entries=[],credits=[];
      for(const input of inputs){
        const staged=stageAuthenticatedCredit(state,workingRoot,{...clone(input),expectedRevision,expectedHeadIdentity:ledgerHeadIdentity(workingRoot.companionLedger),expectedWalletBalance:workingRoot.wallets.companion.balance},options,true);workingRoot=staged.root;awardedTotal=add(awardedTotal,staged.awardedAmount,'unsafe-companion-credit-batch');entries.push(clone(staged.entry));credits.push({historicalTargetId:staged.entry.historicalTargetId,source:clone(staged.entry.source),rawAmount:staged.entry.rawAmount,awardedAmount:staged.awardedAmount,balance:staged.balance});
      }
      return success({root:freeze(clone(workingRoot)),entries:freeze(entries),credits:freeze(credits),awardedTotal,balance:workingRoot.wallets.companion.balance,headIdentity:ledgerHeadIdentity(workingRoot.companionLedger),deferredSourceValidation:options.deferSourceValidation===true});
    });
  }

  function thresholdAt(level,state,companionId,options){if(typeof options?.companionThresholdForLevel!=='function')fail('missing-companion-threshold-authority');const value=options.companionThresholdForLevel(level,freeze(clone(state)),companionId);if(!safe(value))fail('invalid-companion-threshold-authority');return value}
  function powerAt(state,companionId,actor,options){if(typeof options?.powerForCompanion!=='function')fail('missing-companion-power-authority');const value=options.powerForCompanion(freeze(clone(state)),companionId,freeze(clone(actor)));if(!safe(value))fail('invalid-companion-power-authority');return value}
  function capFor(state,companionId,options){const value=typeof options?.companionLevelCap==='function'?options.companionLevelCap(freeze(clone(state)),companionId):options?.companionLevelCap;if(!Number.isSafeInteger(value)||value<1)fail('invalid-companion-level-cap');return value}
  function assignmentImpactAt(state,companionId,beforeActor,afterActor,beforePower,afterPower,options){
    if(typeof options?.assignmentImpactForCompanion!=='function')fail('missing-companion-assignment-authority');const value=options.assignmentImpactForCompanion(freeze(clone(state)),companionId,freeze(clone(beforeActor)),freeze(clone(afterActor))),keys=['assignedFellowId','supportBefore','supportAfter','fellowPowerBefore','fellowPowerAfter','fellowPowerDelta'];
    if(!exactKeys(value,keys)||!(value.assignedFellowId===null||typeof value.assignedFellowId==='string'&&TOKEN.test(value.assignedFellowId))||value.assignedFellowId!==state.companions[companionId].assignedFellowId||!safe(value.supportBefore)||!safe(value.supportAfter)||value.supportAfter<value.supportBefore)return fail('invalid-companion-assignment-impact');
    if(value.assignedFellowId===null){if(value.supportBefore!==0||value.supportAfter!==0||value.fellowPowerBefore!==null||value.fellowPowerAfter!==null||value.fellowPowerDelta!==0)fail('invalid-unassigned-companion-impact')}
    else if(!safe(value.fellowPowerBefore)||!safe(value.fellowPowerAfter)||value.fellowPowerAfter<value.fellowPowerBefore||!safe(value.fellowPowerDelta)||value.fellowPowerDelta!==value.fellowPowerAfter-value.fellowPowerBefore)fail('invalid-assigned-companion-impact');
    if(afterPower<beforePower)fail('decreasing-companion-power');return freeze(clone(value));
  }
  function previewSpend(state,input={},options={}){
    return attempt(()=>{
      const replay=assertV3StageInput(state,options),root=state[ROOT_KEY],companionId=input.companionId,mode=input.mode;if(typeof options?.isCompanionAvailable!=='function')fail('missing-companion-availability-authority');if(!Object.hasOwn(state.companions,companionId)||options.isCompanionAvailable(freeze(clone(state)),companionId)!==true||state.companions[companionId].owned!==true)fail('companion-unavailable');if(!['x1','x10','max'].includes(mode))fail('invalid-spend-mode');
      const actor=state.companions[companionId],before={exp:actor.exp,level:companionLevelAt(actor.exp,state,companionId,options),power:0},cap=capFor(state,companionId,options),walletBalance=root.wallets.companion.balance;if(actor.level!==before.level)fail('companion-level-mismatch');if(before.level>=cap)fail('companion-at-level-cap');
      const maximumLevels=mode==='x1'?1:mode==='x10'?Math.min(10,cap-before.level):cap-before.level;let affordableLevels=0,cost=0,targetExp=before.exp,gateLocked=false;
      for(let count=1;count<=maximumLevels;count++){const candidateLevel=before.level+count;if(Object.hasOwn(options,'isCompanionLevelGateOpen')){if(typeof options.isCompanionLevelGateOpen!=='function')fail('invalid-companion-level-gate');if(options.isCompanionLevelGateOpen(freeze(clone(state)),companionId,candidateLevel)!==true){gateLocked=true;break}}const candidateExp=thresholdAt(candidateLevel,state,companionId,options);if(candidateExp<before.exp)fail('nonmonotonic-companion-threshold');const candidateCost=candidateExp-before.exp;if(!safe(candidateCost)||candidateCost<=0)fail('invalid-companion-threshold-difference');if(candidateCost>walletBalance)break;affordableLevels=count;cost=candidateCost;targetExp=candidateExp}
      if(affordableLevels===0)fail(gateLocked?'companion-level-gate-locked':'insufficient-companion-exp');const afterLevel=companionLevelAt(targetExp,state,companionId,options);if(afterLevel!==before.level+affordableLevels)fail('companion-threshold-level-mismatch');before.power=powerAt(state,companionId,{...actor,exp:before.exp,level:before.level},options);const after={exp:targetExp,level:afterLevel,power:powerAt(state,companionId,{...actor,exp:targetExp,level:afterLevel},options)},assignmentTransfer=assignmentImpactAt(state,companionId,{...actor,exp:before.exp,level:before.level},{...actor,exp:targetExp,level:afterLevel},before.power,after.power,options);
      const preview={version:PREVIEW_VERSION,roster:'companion',policyId:POLICY_ID,saveId:state.saveMeta.saveId,companionId,actorStateIdentity:identity('phase24l.c1.companion-actor-state.v1',['companion',state.saveMeta.saveId,companionId,actor]),mode,levels:affordableLevels,cost,walletBalance,walletAfter:walletBalance-cost,before,after,assignmentTransfer,levelCap:cap,stateRevision:state.saveMeta.revision,ledgerHeadIdentity:replay.headIdentity,rootIdentity:rootIdentity(root),identity:''};preview.identity=previewIdentity(preview);const requestId=requestIdentity(preview.identity);return success({preview:freeze({...preview,requestId})});
    });
  }
  function validateAssignmentImpact(value){
    const keys=['assignedFellowId','supportBefore','supportAfter','fellowPowerBefore','fellowPowerAfter','fellowPowerDelta'];if(!exactKeys(value,keys)||!(value.assignedFellowId===null||typeof value.assignedFellowId==='string'&&TOKEN.test(value.assignedFellowId))||!safe(value.supportBefore)||!safe(value.supportAfter)||value.supportAfter<value.supportBefore)return false;
    return value.assignedFellowId===null?value.supportBefore===0&&value.supportAfter===0&&value.fellowPowerBefore===null&&value.fellowPowerAfter===null&&value.fellowPowerDelta===0:safe(value.fellowPowerBefore)&&safe(value.fellowPowerAfter)&&value.fellowPowerAfter>=value.fellowPowerBefore&&safe(value.fellowPowerDelta)&&value.fellowPowerDelta===value.fellowPowerAfter-value.fellowPowerBefore;
  }
  function validatePreviewShape(preview){
    const keys=['version','roster','policyId','saveId','companionId','actorStateIdentity','mode','levels','cost','walletBalance','walletAfter','before','after','assignmentTransfer','levelCap','stateRevision','ledgerHeadIdentity','rootIdentity','identity','requestId'];
    if(!exactKeys(preview,keys)||preview.version!==PREVIEW_VERSION||preview.roster!=='companion'||preview.policyId!==POLICY_ID||typeof preview.saveId!=='string'||!preview.saveId||typeof preview.companionId!=='string'||!TOKEN.test(preview.companionId)||!HASH.test(preview.actorStateIdentity)||!['x1','x10','max'].includes(preview.mode)||!safe(preview.levels)||preview.levels<=0||!safe(preview.cost)||preview.cost<=0||!safe(preview.walletBalance)||!safe(preview.walletAfter)||preview.walletAfter!==preview.walletBalance-preview.cost||!exactKeys(preview.before,['exp','level','power'])||!exactKeys(preview.after,['exp','level','power'])||!safe(preview.before.exp)||!safe(preview.after.exp)||!safe(preview.before.power)||!safe(preview.after.power)||!Number.isSafeInteger(preview.before.level)||!Number.isSafeInteger(preview.after.level)||!validateAssignmentImpact(preview.assignmentTransfer)||!safe(preview.levelCap)||!safe(preview.stateRevision)||!HASH.test(preview.ledgerHeadIdentity)||!HASH.test(preview.rootIdentity)||!HASH.test(preview.identity)||!HASH.test(preview.requestId))return false;
    const projection=clone(preview);delete projection.requestId;return preview.identity===previewIdentity(projection)&&preview.requestId===requestIdentity(preview.identity);
  }
  function stageSpend(state,providedPreview,options={}){
    return attempt(()=>{
      if(options.deferSourceValidation===true)fail('deferred-companion-spend-forbidden');
      if(!validatePreviewShape(providedPreview))fail('invalid-companion-spend-preview');const current=previewSpend(state,{companionId:providedPreview.companionId,mode:providedPreview.mode},options);if(!current.ok||!same(current.preview,providedPreview))fail('stale-companion-spend-preview');const replay=assertV3StageInput(state,options),root=state[ROOT_KEY],preview=current.preview;
      if(typeof options.isRequestAvailable!=='function'||options.isRequestAvailable(freeze(clone(state)),preview.requestId)!==true)fail('companion-spend-request-unavailable');if(root.companionLedger.checkpoint.foldedRequestIds.includes(preview.requestId)||root.companionLedger.entries.some(entry=>entry.kind==='spend'&&entry.requestId===preview.requestId))fail('duplicate-companion-spend-request');if(!safe(options.committedAt)||options.committedAt<state.saveMeta.updatedAt)fail('invalid-companion-spend-time');
      const entry={version:ENTRY_VERSION,sequence:add(root.companionLedger.entryCount,1),kind:'spend',roster:'companion',stateRevision:state.saveMeta.revision,occurredAt:options.committedAt,requestId:preview.requestId,companionId:preview.companionId,mode:preview.mode,levels:preview.levels,amount:preview.cost,walletBefore:preview.walletBalance,walletAfter:preview.walletAfter,actorBefore:{exp:preview.before.exp,level:preview.before.level},actorAfter:{exp:preview.after.exp,level:preview.after.level},previewIdentity:preview.identity,previousEntryIdentity:replay.headIdentity,identity:''};entry.identity=entryIdentity(entry);
      const next=appendEntry(root,entry);next.wallets.companion.spentTotal=add(next.wallets.companion.spentTotal,preview.cost);next.wallets.companion.balance=preview.walletAfter;next.companionTutorials=completeTutorial(next.companionTutorials,'firstSpend',entry);if(!same(next.wallets.fellow,root.wallets.fellow)||!same(next.ledger,root.ledger)||!same(next.tutorials,root.tutorials))fail('fellow-wallet-changed');
      const stagedState=clone(state);stagedState[ROOT_KEY]=clone(next);stagedState.companions[preview.companionId].exp=preview.after.exp;stagedState.companions[preview.companionId].level=preview.after.level;const checked=validateV3StateUnsafe(stagedState,options);if(checked.ok!==true)fail('invalid-companion-spend-result');
      return success({root:freeze(next),entry:freeze(clone(entry)),companion:freeze({id:preview.companionId,exp:preview.after.exp,level:preview.after.level}),assignmentTransfer:freeze(clone(preview.assignmentTransfer)),spentAmount:preview.cost,balance:preview.walletAfter,headIdentity:entry.identity});
    });
  }

  function companionJournalWithoutB1Lineage(ledger){const value=clone(ledger);delete value.b1Lineage;return value}
  function replayB1Transition(previousState,candidate,options={},requirements={}){
    const projectedBefore=projectToV2Unsafe(previousState,options),priorRoot=projectedBefore[ROOT_KEY],targetRoot=candidate?.[ROOT_KEY],delta=targetRoot?.ledger?.entryCount-priorRoot.ledger.entryCount;
    if(candidate?.saveMeta?.saveId!==projectedBefore.saveMeta.saveId||!Number.isSafeInteger(delta)||delta<1||delta>MAX_BATCH_CREDITS)fail('invalid-b1-transition-count');
    const entries=targetRoot.ledger.entries.slice(-delta);if(entries.length!==delta||entries[0]?.sequence!==priorRoot.ledger.entryCount+1||entries[entries.length-1]?.sequence!==targetRoot.ledger.entryCount)fail('invalid-b1-transition-tail');
    let cursor=clone(projectedBefore),lineage=clone(previousState[ROOT_KEY].companionLedger.b1Lineage),hasSpend=false;
    for(const entry of entries){
      let staged;
      if(entry.kind==='credit'){
        staged=B1.stageCredit(cursor,{sourceKind:entry.source.kind,sourceId:entry.source.id,historicalTargetId:entry.historicalTargetId,rawAmount:entry.rawAmount,authoredBps:entry.authoredBps,collectionBps:entry.collectionBps,occurredAt:entry.occurredAt,expectedRevision:cursor.saveMeta.revision,expectedHeadIdentity:B1.ledgerHeadIdentity(cursor[ROOT_KEY].ledger),expectedWalletBalance:cursor[ROOT_KEY].wallets.fellow.balance},b1Options(options));
      }else if(entry.kind==='spend'&&requirements.creditsOnly!==true){
        const preview=B1.previewSpend(cursor,{fellowId:entry.fellowId,mode:entry.mode},b1Options(options));if(!preview.ok)fail(preview.reason);staged=B1.stageSpend(cursor,preview.preview,{...b1Options(options),committedAt:entry.occurredAt});hasSpend=true;
      }else fail('invalid-b1-transition-entry');
      if(!staged.ok||!same(staged.entry,entry))fail(staged.reason||'invalid-b1-transition-entry');cursor[ROOT_KEY]=clone(staged.root);if(staged.fellow){if(!Object.hasOwn(cursor.fellows,staged.fellow.id))fail('unknown-b1-transition-fellow');cursor.fellows[staged.fellow.id].exp=staged.fellow.exp;cursor.fellows[staged.fellow.id].level=staged.fellow.level}lineage=advanceB1Lineage(lineage,previousState.saveMeta.saveId,entry,staged.root);
    }
    if(!same(cursor[ROOT_KEY],targetRoot)||hasSpend&&!same(cursor.fellows,candidate.fellows))fail('invalid-b1-transition-result');return{entries:freeze(clone(entries)),lineage:freeze(lineage),hasSpend};
  }
  function assertDeferredFellowCreditRoot(state,proposedRoot,options={}){
    const prior=state[ROOT_KEY];
    if(!isObject(proposedRoot))fail('invalid-deferred-fellow-root');
    for(const key of ['version','policyId','activatedAt','baselines','migration','activation','companionActivation','companionTutorials'])if(!same(proposedRoot[key],prior[key]))fail('deferred-fellow-crossed-companion-boundary');
    if(!same(proposedRoot.wallets?.companion,prior.wallets.companion)||!same(companionJournalWithoutB1Lineage(proposedRoot.companionLedger),companionJournalWithoutB1Lineage(prior.companionLedger))||!same(proposedRoot.companionTutorials,prior.companionTutorials))fail('deferred-fellow-crossed-companion-boundary');
    const projectedBefore=projectToV2Unsafe(state,options),candidate=clone(projectedBefore);candidate[ROOT_KEY]=v2RootFromV3(proposedRoot);const checked=replayB1Transition(state,candidate,options,{creditsOnly:true});
    if(!same(proposedRoot.companionLedger.b1Lineage,checked.lineage))fail('invalid-deferred-fellow-lineage');return clone(proposedRoot);
  }

  function graftFellowStage(state,projectedBefore,staged,options={}){
    return attempt(()=>{
      assertV3StageInput(state,options);const expected=projectToV2Unsafe(state,options);if(!same(expected,projectedBefore)||!isObject(staged?.root))fail('invalid-fellow-graft-input');const candidate=clone(projectedBefore);candidate[ROOT_KEY]=clone(staged.root);if(staged.fellow){if(!Object.hasOwn(candidate.fellows,staged.fellow.id))fail('unknown-fellow-graft-actor');candidate.fellows[staged.fellow.id].exp=staged.fellow.exp;candidate.fellows[staged.fellow.id].level=staged.fellow.level}
      const authenticated=replayB1Transition(state,candidate,options,{creditsOnly:options.deferSourceValidation===true});const prior=state[ROOT_KEY],b1Root=staged.root,next=clone(prior);
      if(!same(b1Root.activatedAt,prior.activatedAt)||!same(b1Root.baselines,prior.baselines)||!same(b1Root.migration,prior.migration)||!same(b1Root.activation,prior.activation)||!validateWallet(b1Root.wallets?.companion,{neutral:true}))fail('fellow-graft-crossed-boundary');next.wallets.fellow=clone(b1Root.wallets.fellow);next.ledger=clone(b1Root.ledger);next.tutorials=clone(b1Root.tutorials);next.companionLedger.b1Lineage=clone(authenticated.lineage);
      const deferred=options.deferSourceValidation===true;
      if(deferred){const companionCheck=replayLedger(next,state,options);if(!companionCheck.ok)fail(companionCheck.reason)}
      else{const stagedLive=clone(state);stagedLive[ROOT_KEY]=clone(next);if(staged.fellow){stagedLive.fellows[staged.fellow.id].exp=staged.fellow.exp;stagedLive.fellows[staged.fellow.id].level=staged.fellow.level}const checked=validateV3StateUnsafe(stagedLive,options);if(checked.ok!==true)fail('invalid-fellow-graft-result')}
      return success({root:freeze(next),fellow:staged.fellow?freeze(clone(staged.fellow)):null,deferredSourceValidation:deferred});
    });
  }
  function stageFellowCredit(state,input={},options={}){
    return attempt(()=>{const projected=projectToV2Unsafe(state,options),staged=B1.stageCredit(projected,input,b1Options(options));if(!staged.ok)fail(staged.reason);const graft=graftFellowStage(state,projected,staged,options);if(!graft.ok)fail(graft.reason);return success({root:graft.root,entry:staged.entry,awardedAmount:staged.awardedAmount,balance:staged.balance,headIdentity:staged.headIdentity,deferredSourceValidation:graft.deferredSourceValidation})});
  }
  function previewFellowSpend(state,input={},options={}){return attempt(()=>{const projected=projectToV2Unsafe(state,options),result=B1.previewSpend(projected,input,b1Options(options));if(!result.ok)fail(result.reason);return success({preview:result.preview})})}
  function stageFellowSpend(state,providedPreview,options={}){
    return attempt(()=>{if(options.deferSourceValidation===true)fail('deferred-fellow-spend-forbidden');const projected=projectToV2Unsafe(state,options),staged=B1.stageSpend(projected,providedPreview,b1Options(options));if(!staged.ok)fail(staged.reason);const graft=graftFellowStage(state,projected,staged,options);if(!graft.ok)fail(graft.reason);return success({root:graft.root,entry:staged.entry,fellow:staged.fellow,spentAmount:staged.spentAmount,balance:staged.balance,headIdentity:staged.headIdentity})});
  }
  function validateRootTransition(previousState,nextState,options={}){
    try{
      if(previousState?.[ROOT_KEY]?.version!==ROOT_VERSION||nextState?.[ROOT_KEY]?.version!==ROOT_VERSION||previousState.saveMeta.saveId!==nextState.saveMeta.saveId)return false;const prior=previousState[ROOT_KEY],next=nextState[ROOT_KEY],delta=next.companionLedger.entryCount-prior.companionLedger.entryCount,fellowChanged=!same(prior.wallets.fellow,next.wallets.fellow)||!same(prior.ledger,next.ledger)||!same(prior.tutorials,next.tutorials);
      if(!Number.isSafeInteger(delta)||delta<0||delta>MAX_BATCH_CREDITS||delta===0&&!fellowChanged)return false;
      if(!same(Object.keys(prior),Object.keys(next)))return false;for(const key of ['version','policyId','activatedAt','baselines','migration','activation','companionActivation'])if(!same(prior[key],next[key]))return false;
      if(fellowChanged){const projectedNext=clone(nextState);projectedNext[ROOT_KEY]=v2RootFromV3(next);projectedNext.saveMeta.appliedMigrations=projectedNext.saveMeta.appliedMigrations.filter(item=>item?.id!==ACTIVATION_ID);const checked=replayB1Transition(previousState,projectedNext,options);if(!same(next.companionLedger.b1Lineage,checked.lineage))return false}
      else if(!same(prior.companionLedger.b1Lineage,next.companionLedger.b1Lineage))return false;
      if(delta===0)return same(prior.wallets.companion,next.wallets.companion)&&same(companionJournalWithoutB1Lineage(prior.companionLedger),companionJournalWithoutB1Lineage(next.companionLedger))&&same(prior.companionTutorials,next.companionTutorials)&&same(previousState.companions,nextState.companions);
      const appended=next.companionLedger.entries.slice(-delta);if(appended.length!==delta||appended[0]?.sequence!==prior.companionLedger.entryCount+1||appended[appended.length-1]?.sequence!==next.companionLedger.entryCount)return false;
      if(appended.every(item=>item.kind==='credit')){const inputs=appended.map((item,index)=>({sourceKind:item.source.kind,sourceId:item.source.id,historicalTargetId:item.historicalTargetId,rawAmount:item.rawAmount,authoredBps:item.authoredBps,collectionBps:item.collectionBps,occurredAt:item.occurredAt,...(index===0?{expectedRevision:previousState.saveMeta.revision,expectedHeadIdentity:ledgerHeadIdentity(prior.companionLedger),expectedWalletBalance:prior.wallets.companion.balance}:{})})),initialRoot=clone(prior);if(fellowChanged){initialRoot.wallets.fellow=clone(next.wallets.fellow);initialRoot.ledger=clone(next.ledger);initialRoot.tutorials=clone(next.tutorials);initialRoot.companionLedger.b1Lineage=clone(next.companionLedger.b1Lineage)}const stageOptions=fellowChanged?{...options,deferSourceValidation:true,initialRoot}:{...options},staged=stageCredits(previousState,inputs,stageOptions),companionIds=sortedIds(previousState.companions),sameCompanionInvestment=same(companionIds,sortedIds(nextState.companions))&&companionIds.every(id=>previousState.companions[id].exp===nextState.companions[id].exp&&previousState.companions[id].level===nextState.companions[id].level);return staged.ok&&same(staged.root,next)&&same(previousState.fellows,nextState.fellows)&&sameCompanionInvestment}
      if(delta!==1)return false;const entry=appended[0];
      if(entry.kind==='spend'){if(fellowChanged)return false;const preview=previewSpend(previousState,{companionId:entry.companionId,mode:entry.mode},options);if(!preview.ok)return false;const staged=stageSpend(previousState,preview.preview,{...options,committedAt:entry.occurredAt});if(!staged.ok||!same(staged.root,next)||!same(previousState.fellows,nextState.fellows))return false;for(const id of sortedIds(previousState.companions)){const expected=id===staged.companion.id?{...previousState.companions[id],exp:staged.companion.exp,level:staged.companion.level}:previousState.companions[id];if(!same(expected,nextState.companions[id]))return false}return true}
      return false;
    }catch{return false}
  }

  /* Narrow production API. No QA bridge or mutable diagnostics are published here. */
  const api=freeze({version:1,status:'phase-24l-c1-companion-exp-wallet',rootKey:ROOT_KEY,rootVersion:ROOT_VERSION,predecessorRootVersion:PREDECESSOR_ROOT_VERSION,policyId:POLICY_ID,activationId:ACTIVATION_ID,ledgerVersion:LEDGER_VERSION,tutorialVersion:TUTORIAL_VERSION,tutorialIds:TUTORIAL_IDS,productionCreditSources:freeze([...PRODUCTION_CREDIT_SOURCES]),qaCreditSource:QA_CREDIT_SOURCE,maxTailEntries:MAX_TAIL_ENTRIES,foldBatchSize:FOLD_BATCH_SIZE,maxBatchCredits:MAX_BATCH_CREDITS,dependencyReady,canonicalStringify:canonical,sha256,rootIdentity,companionRosterIdentity,makeSource,sourceIdentity,creditAward,ledgerHeadIdentity,tutorialCompletion,validateState,validateV3State,activateV2State,projectToV2,previewSpend,stageCredit,stageCredits,stageSpend,validateRootTransition,graftFellowStage,stageFellowCredit,previewFellowSpend,stageFellowSpend});
  Object.defineProperty(global,'EVERSTEAD_PHASE24L_COMPANION_EXP_WALLET',{configurable:false,enumerable:false,writable:false,value:api});
})(globalThis);
