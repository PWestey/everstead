/* Everstead Phase 24L-B1 · pure Fellow EXP wallet, ledger, and spend-preview engine. */
(function installEversteadPhaseTwentyFourLFellowExpWallet(global){
  'use strict';

  const FOUNDATION=global.EVERSTEAD_PHASE24L_EXP_FOUNDATION;
  const ROOT_KEY='experienceProgression';
  const ROOT_VERSION=2;
  const POLICY_ID='everstead.exp-wallet.phase-24l.v2';
  const ACTIVATION_ID='activation.phase-24l-b1-fellow-exp-wallet.v1';
  const ACTIVATION_VERSION=1;
  const LEDGER_VERSION=2;
  const CHECKPOINT_VERSION=1;
  const ENTRY_VERSION=1;
  const PREVIEW_VERSION=1;
  const TUTORIAL_VERSION=1;
  const TUTORIAL_IDS=Object.freeze({firstCredit:'tutorial.phase-24l-b1.fellow-exp-earned.v1',firstSpend:'tutorial.phase-24l-b1.fellow-exp-spent.v1'});
  const MAX_TAIL_ENTRIES=256;
  const FOLD_BATCH_SIZE=64;
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
  const actorExpMap=actors=>Object.fromEntries(sortedIds(actors).map(id=>{const exp=actors[id]?.exp;if(!safe(exp))fail('invalid-actor-exp');return[id,exp]}));
  const actorLevelMap=(actors,levelForExp)=>Object.fromEntries(sortedIds(actors).map(id=>{const level=levelForExp(actors[id]?.exp);if(!Number.isSafeInteger(level)||level<1||actors[id]?.level!==level)fail('invalid-actor-level');return[id,level]}));

  function dependencyReady(){return Boolean(FOUNDATION&&FOUNDATION.version===1&&FOUNDATION.successorSchema===15&&FOUNDATION.policyId==='everstead.exp-wallet.phase-24l.v1')}
  function requireDependency(){if(!dependencyReady())fail('phase24l-foundation-unavailable')}
  function rootIdentity(root){return identity('phase24l.b1.root.v2',root)}
  function activationIdentity(activation){return identity('phase24l.b1.activation.v1',withoutIdentity(activation))}
  function activationReceiptIdentity(receipt){return identity('phase24l.b1.activation-receipt.v1',withoutIdentity(receipt))}
  function sourceIdentity(kind,id){if(typeof kind!=='string'||!TOKEN.test(kind)||typeof id!=='string'||!TOKEN.test(id))fail('invalid-source');return identity('phase24l.b1.credit-source.v1',[kind,id])}
  function makeSource(kind,id){return freeze({kind,id,identity:sourceIdentity(kind,id)})}
  function entryIdentity(entry){return identity('phase24l.b1.ledger-entry.v1',withoutIdentity(entry))}
  function previewIdentity(preview){return identity('phase24l.b1.spend-preview.v1',withoutIdentity(preview))}
  function requestIdentity(previewHash){return identity('phase24l.b1.spend-request.v1',previewHash)}
  function checkpointIdentity(checkpoint){return identity('phase24l.b1.ledger-checkpoint.v1',withoutIdentity(checkpoint))}
  function tutorialMarkerIdentity(marker){return identity('phase24l.b1.tutorial-marker.v1',withoutIdentity(marker))}
  function tutorialsIdentity(tutorials){return identity('phase24l.b1.tutorials.v1',withoutIdentity(tutorials))}
  function investedMapIdentity(saveId,roster,map){return identity('phase24l.b1.invested-exp-map.v1',[saveId,roster,map])}
  function genesisChainIdentity(saveId,fellowIds){return identity('phase24l.b1.ledger-chain-genesis.v1',[saveId,fellowIds])}
  function genesisSourceFoldIdentity(saveId){return identity('phase24l.b1.source-fold-genesis.v1',saveId)}
  function genesisRequestFoldIdentity(saveId){return identity('phase24l.b1.request-fold-genesis.v1',saveId)}
  function foldToken(prior,tag,value){return identity(tag,[prior,value])}

  function emptyWallet(){return{balance:0,creditedTotal:0,spentTotal:0}}
  function createCheckpoint(saveId,fellowIds){
    const checkpoint={version:CHECKPOINT_VERSION,throughSequence:0,creditCount:0,spendCount:0,creditedTotal:0,spentTotal:0,rawCreditedTotal:0,rawCreditByFellowId:zeroMap(fellowIds),spentByFellowId:zeroMap(fellowIds),foldedChainIdentity:genesisChainIdentity(saveId,fellowIds),foldedSourceIdentity:genesisSourceFoldIdentity(saveId),foldedRequestIdentity:genesisRequestFoldIdentity(saveId),identity:''};
    checkpoint.identity=checkpointIdentity(checkpoint);
    return checkpoint;
  }
  function createLedger(saveId,fellowIds){const checkpoint=createCheckpoint(saveId,fellowIds);return{version:LEDGER_VERSION,throughSequence:0,entryCount:0,foldedIdentity:checkpoint.identity,checkpoint,entries:[]}}
  function ledgerHeadIdentity(ledger){return ledger.entries.length?ledger.entries[ledger.entries.length-1].identity:ledger.checkpoint.foldedChainIdentity}
  function emptyTutorialMarker(kind){const marker={tutorialId:TUTORIAL_IDS[kind],replayable:true,completed:false,completedAt:null,entrySequence:null,entryIdentity:null,identity:''};marker.identity=tutorialMarkerIdentity(marker);return marker}
  function createTutorials(){const tutorials={version:TUTORIAL_VERSION,firstCredit:emptyTutorialMarker('firstCredit'),firstSpend:emptyTutorialMarker('firstSpend'),identity:''};tutorials.identity=tutorialsIdentity(tutorials);return tutorials}
  function completeTutorial(tutorials,kind,entry){
    const next=clone(tutorials),marker=next[kind];if(marker.completed)return next;
    marker.completed=true;marker.completedAt=entry.occurredAt;marker.entrySequence=entry.sequence;marker.entryIdentity=entry.identity;marker.identity='';marker.identity=tutorialMarkerIdentity(marker);next.identity='';next.identity=tutorialsIdentity(next);return next;
  }

  function v1Ledger(saveId){return{version:1,throughSequence:0,entryCount:0,foldedIdentity:sha256(canonical(['phase24l.exp-ledger-fold.v1',saveId,0,[]])),entries:[]}}
  function v1RootFromV2(root,saveId){
    return{version:1,policyId:FOUNDATION.policyId,activatedAt:root.activatedAt,baselines:clone(root.baselines),wallets:{fellow:emptyWallet(),companion:emptyWallet()},ledger:v1Ledger(saveId),migration:clone(root.migration)};
  }

  function creditAward(rawAmount,authoredBps,collectionBps){
    if(!safe(rawAmount)||rawAmount<=0||!safe(authoredBps)||!safe(collectionBps))fail('invalid-credit-amount');
    const totalBps=add(authoredBps,collectionBps,'unsafe-bps');
    const awardedBig=(BigInt(rawAmount)*(BPS_DENOMINATOR+BigInt(totalBps)))/BPS_DENOMINATOR;
    if(awardedBig>BigInt(Number.MAX_SAFE_INTEGER))fail('unsafe-credit-award');
    const awardedAmount=Number(awardedBig);
    if(!safe(awardedAmount)||awardedAmount<=0)fail('empty-credit-award');
    return{totalBps,awardedAmount};
  }

  function validateSource(source){return exactKeys(source,['kind','id','identity'])&&source.identity===sourceIdentity(source.kind,source.id)}
  function validateWallet(wallet,{neutral=false}={}){return exactKeys(wallet,['balance','creditedTotal','spentTotal'])&&safe(wallet.balance)&&safe(wallet.creditedTotal)&&safe(wallet.spentTotal)&&wallet.balance===wallet.creditedTotal-wallet.spentTotal&&(!neutral||(wallet.balance===0&&wallet.creditedTotal===0&&wallet.spentTotal===0))}
  function validateActor(actor){return exactKeys(actor,['exp','level'])&&safe(actor.exp)&&Number.isSafeInteger(actor.level)&&actor.level>=1}

  function validateCreditEntry(entry,context){
    const keys=['version','sequence','kind','roster','stateRevision','occurredAt','source','historicalTargetId','rawAmount','authoredBps','collectionBps','totalBps','rounding','awardedAmount','walletBefore','walletAfter','previousEntryIdentity','identity'];
    if(!exactKeys(entry,keys)||entry.version!==ENTRY_VERSION||entry.kind!=='credit'||entry.roster!=='fellow'||!safe(entry.sequence)||entry.sequence<=0||!safe(entry.stateRevision)||!safe(entry.occurredAt)||!validateSource(entry.source)||!Object.hasOwn(context.rawByFellow,entry.historicalTargetId)||entry.rounding!=='floor'||!safe(entry.walletBefore)||!safe(entry.walletAfter)||!HASH.test(entry.previousEntryIdentity)||entry.identity!==entryIdentity(entry))return false;
    let award;try{award=creditAward(entry.rawAmount,entry.authoredBps,entry.collectionBps)}catch{return false}
    if(entry.totalBps!==award.totalBps||entry.awardedAmount!==award.awardedAmount||entry.walletBefore!==context.balance)return false;
    try{
      context.credited=add(context.credited,entry.awardedAmount);context.rawCredited=add(context.rawCredited,entry.rawAmount);context.balance=add(context.balance,entry.awardedAmount);context.rawByFellow[entry.historicalTargetId]=add(context.rawByFellow[entry.historicalTargetId],entry.rawAmount);context.creditCount=add(context.creditCount,1);
    }catch{return false}
    return entry.walletAfter===context.balance;
  }

  function validateSpendEntry(entry,context,levelForExp){
    const keys=['version','sequence','kind','roster','stateRevision','occurredAt','requestId','fellowId','mode','levels','amount','walletBefore','walletAfter','actorBefore','actorAfter','previewIdentity','previousEntryIdentity','identity'];
    if(!exactKeys(entry,keys)||entry.version!==ENTRY_VERSION||entry.kind!=='spend'||entry.roster!=='fellow'||!safe(entry.sequence)||entry.sequence<=0||!safe(entry.stateRevision)||!safe(entry.occurredAt)||!HASH.test(entry.requestId)||!Object.hasOwn(context.spentByFellow,entry.fellowId)||!['x1','x10','max'].includes(entry.mode)||!safe(entry.levels)||entry.levels<=0||!safe(entry.amount)||entry.amount<=0||!safe(entry.walletBefore)||!safe(entry.walletAfter)||!validateActor(entry.actorBefore)||!validateActor(entry.actorAfter)||!HASH.test(entry.previewIdentity)||!HASH.test(entry.previousEntryIdentity)||entry.identity!==entryIdentity(entry)||entry.walletBefore!==context.balance||entry.actorBefore.exp!==context.investedByFellow[entry.fellowId]||entry.actorAfter.exp!==entry.actorBefore.exp+entry.amount||entry.actorAfter.level-entry.actorBefore.level!==entry.levels)return false;
    let beforeLevel,afterLevel;try{beforeLevel=levelForExp(entry.actorBefore.exp);afterLevel=levelForExp(entry.actorAfter.exp)}catch{return false}
    if(entry.actorBefore.level!==beforeLevel||entry.actorAfter.level!==afterLevel)return false;
    try{
      context.spent=add(context.spent,entry.amount);context.balance=subtract(context.balance,entry.amount);context.spentByFellow[entry.fellowId]=add(context.spentByFellow[entry.fellowId],entry.amount);context.investedByFellow[entry.fellowId]=add(context.investedByFellow[entry.fellowId],entry.amount);context.spendCount=add(context.spendCount,1);
    }catch{return false}
    return entry.walletAfter===context.balance;
  }

  function validateCheckpoint(checkpoint,saveId,fellowIds){
    const keys=['version','throughSequence','creditCount','spendCount','creditedTotal','spentTotal','rawCreditedTotal','rawCreditByFellowId','spentByFellowId','foldedChainIdentity','foldedSourceIdentity','foldedRequestIdentity','identity'];
    return exactKeys(checkpoint,keys)&&checkpoint.version===CHECKPOINT_VERSION&&safe(checkpoint.throughSequence)&&safe(checkpoint.creditCount)&&safe(checkpoint.spendCount)&&checkpoint.throughSequence===checkpoint.creditCount+checkpoint.spendCount&&safe(checkpoint.creditedTotal)&&safe(checkpoint.spentTotal)&&checkpoint.creditedTotal>=checkpoint.spentTotal&&safe(checkpoint.rawCreditedTotal)&&mapKeysMatch(checkpoint.rawCreditByFellowId,fellowIds)&&mapKeysMatch(checkpoint.spentByFellowId,fellowIds)&&HASH.test(checkpoint.foldedChainIdentity)&&HASH.test(checkpoint.foldedSourceIdentity)&&HASH.test(checkpoint.foldedRequestIdentity)&&checkpoint.identity===checkpointIdentity(checkpoint)&&(checkpoint.throughSequence!==0||(checkpoint.foldedChainIdentity===genesisChainIdentity(saveId,fellowIds)&&checkpoint.foldedSourceIdentity===genesisSourceFoldIdentity(saveId)&&checkpoint.foldedRequestIdentity===genesisRequestFoldIdentity(saveId)));
  }

  function validateTutorialMarker(marker,kind,ledger){
    const keys=['tutorialId','replayable','completed','completedAt','entrySequence','entryIdentity','identity'];
    if(!exactKeys(marker,keys)||marker.tutorialId!==TUTORIAL_IDS[kind]||marker.replayable!==true||typeof marker.completed!=='boolean'||marker.identity!==tutorialMarkerIdentity(marker))return false;
    if(!marker.completed)return marker.completedAt===null&&marker.entrySequence===null&&marker.entryIdentity===null;
    if(!safe(marker.completedAt)||!safe(marker.entrySequence)||marker.entrySequence<=0||marker.entrySequence>ledger.entryCount||!HASH.test(marker.entryIdentity))return false;
    if(marker.entrySequence>ledger.throughSequence){
      const entry=ledger.entries[marker.entrySequence-ledger.throughSequence-1],expectedKind=kind==='firstCredit'?'credit':'spend';
      if(entry?.sequence!==marker.entrySequence||entry.kind!==expectedKind||entry.identity!==marker.entryIdentity||entry.occurredAt!==marker.completedAt)return false;
    }
    return true;
  }
  function validateTutorials(tutorials,ledger){
    if(!exactKeys(tutorials,['version','firstCredit','firstSpend','identity'])||tutorials.version!==TUTORIAL_VERSION||tutorials.identity!==tutorialsIdentity(tutorials)||!validateTutorialMarker(tutorials.firstCredit,'firstCredit',ledger)||!validateTutorialMarker(tutorials.firstSpend,'firstSpend',ledger))return false;
    const creditCount=ledger.checkpoint.creditCount+ledger.entries.filter(entry=>entry.kind==='credit').length,spendCount=ledger.checkpoint.spendCount+ledger.entries.filter(entry=>entry.kind==='spend').length;
    return tutorials.firstCredit.completed===(creditCount>0)&&tutorials.firstSpend.completed===(spendCount>0);
  }
  function tutorialCompletion(root,kind){
    if(!['firstCredit','firstSpend'].includes(kind)||!validateTutorials(root?.tutorials,root?.ledger))return failure('invalid-tutorial-state');
    return success({marker:freeze(clone(root.tutorials[kind]))});
  }

  function replayLedger(root,{saveId,fellows,levelForExp}){
    const fellowIds=sortedIds(fellows),ledger=root.ledger,checkpoint=ledger?.checkpoint;
    if(!exactKeys(ledger,['version','throughSequence','entryCount','foldedIdentity','checkpoint','entries'])||ledger.version!==LEDGER_VERSION||!safe(ledger.throughSequence)||!safe(ledger.entryCount)||!Array.isArray(ledger.entries)||ledger.entries.length>MAX_TAIL_ENTRIES||!validateCheckpoint(checkpoint,saveId,fellowIds)||ledger.throughSequence!==checkpoint.throughSequence||ledger.foldedIdentity!==checkpoint.identity||ledger.entryCount!==checkpoint.throughSequence+ledger.entries.length)return failure('invalid-ledger');
    const context={credited:checkpoint.creditedTotal,spent:checkpoint.spentTotal,rawCredited:checkpoint.rawCreditedTotal,balance:checkpoint.creditedTotal-checkpoint.spentTotal,creditCount:checkpoint.creditCount,spendCount:checkpoint.spendCount,rawByFellow:clone(checkpoint.rawCreditByFellowId),spentByFellow:clone(checkpoint.spentByFellowId),investedByFellow:clone(root.activation.investedFellowExpById)};
    let previous=checkpoint.foldedChainIdentity,sequence=checkpoint.throughSequence+1;
    const sourceIds=new Set(),requestIds=new Set();
    for(const entry of ledger.entries){
      if(entry.sequence!==sequence||entry.previousEntryIdentity!==previous)return failure('broken-ledger-chain');
      if(entry.kind==='credit'){
        if(sourceIds.has(entry.source?.identity))return failure('duplicate-credit-source');sourceIds.add(entry.source?.identity);
        if(!validateCreditEntry(entry,context))return failure('invalid-credit-entry');
      }else if(entry.kind==='spend'){
        if(requestIds.has(entry.requestId))return failure('duplicate-spend-request');requestIds.add(entry.requestId);
        if(!validateSpendEntry(entry,context,levelForExp))return failure('invalid-spend-entry');
      }else return failure('invalid-ledger-entry-kind');
      previous=entry.identity;sequence++;
    }
    if(context.creditCount+context.spendCount!==ledger.entryCount||context.credited!==root.wallets.fellow.creditedTotal||context.spent!==root.wallets.fellow.spentTotal||context.balance!==root.wallets.fellow.balance)return failure('wallet-ledger-mismatch');
    return success({replay:freeze({...context,headIdentity:previous})});
  }

  function validateActivation(activation,root,state){
    const fellowIds=sortedIds(state.fellows),companionIds=sortedIds(state.companions),keys=['version','id','activatedAt','predecessorRevision','predecessorRootIdentity','sourceStateIdentity','investedFellowExpById','investedFellowLevelById','investedCompanionExpById','investedFellowExpIdentity','investedFellowLevelIdentity','investedCompanionExpIdentity','receiptIdentity','identity'];
    if(!exactKeys(activation,keys)||activation.version!==ACTIVATION_VERSION||activation.id!==ACTIVATION_ID||!safe(activation.activatedAt)||activation.activatedAt>state.saveMeta.updatedAt||!safe(activation.predecessorRevision)||activation.predecessorRevision>=state.saveMeta.revision||!HASH.test(activation.predecessorRootIdentity)||!HASH.test(activation.sourceStateIdentity)||!mapKeysMatch(activation.investedFellowExpById,fellowIds)||!mapKeysMatch(activation.investedFellowLevelById,fellowIds)||Object.values(activation.investedFellowLevelById).some(level=>level<1)||!mapKeysMatch(activation.investedCompanionExpById,companionIds)||activation.investedFellowExpIdentity!==investedMapIdentity(state.saveMeta.saveId,'fellow',activation.investedFellowExpById)||activation.investedFellowLevelIdentity!==investedMapIdentity(state.saveMeta.saveId,'fellow-level',activation.investedFellowLevelById)||activation.investedCompanionExpIdentity!==investedMapIdentity(state.saveMeta.saveId,'companion',activation.investedCompanionExpById)||!HASH.test(activation.receiptIdentity)||activation.identity!==activationIdentity(activation))return false;
    return activation.predecessorRootIdentity===rootIdentity(v1RootFromV2(root,state.saveMeta.saveId));
  }

  function validateActivationReceipt(state,root){
    const receipts=state.saveMeta.appliedMigrations.filter(item=>item?.id===ACTIVATION_ID),receipt=receipts[0],keys=['id','receiptVersion','fromRootVersion','toRootVersion','appliedAt','source','saveId','predecessorRevision','predecessorRootIdentity','sourceStateIdentity','investedFellowExpIdentity','investedFellowLevelIdentity','investedCompanionExpIdentity','identity'];
    return receipts.length===1&&exactKeys(receipt,keys)&&receipt.receiptVersion===1&&receipt.fromRootVersion===1&&receipt.toRootVersion===2&&receipt.appliedAt===root.activation.activatedAt&&typeof receipt.source==='string'&&TOKEN.test(receipt.source)&&receipt.saveId===state.saveMeta.saveId&&receipt.predecessorRevision===root.activation.predecessorRevision&&receipt.predecessorRootIdentity===root.activation.predecessorRootIdentity&&receipt.sourceStateIdentity===root.activation.sourceStateIdentity&&receipt.investedFellowExpIdentity===root.activation.investedFellowExpIdentity&&receipt.investedFellowLevelIdentity===root.activation.investedFellowLevelIdentity&&receipt.investedCompanionExpIdentity===root.activation.investedCompanionExpIdentity&&receipt.identity===activationReceiptIdentity(receipt)&&root.activation.receiptIdentity===receipt.identity;
  }

  function projectToV1Unsafe(state,options={}){
    const root=state[ROOT_KEY];
    if(root?.version!==ROOT_VERSION)fail('not-v2-state');
    const projected=clone(state),fellowIds=sortedIds(projected.fellows),replay=replayLedger(root,{saveId:state.saveMeta.saveId,fellows:state.fellows,levelForExp:options.levelForExp});
    if(!replay.ok)fail(replay.reason);
    for(const id of fellowIds){
      const exp=add(root.activation.investedFellowExpById[id],replay.replay.rawByFellow[id],'unsafe-v1-projection');
      projected.fellows[id].exp=exp;
      projected.fellows[id].level=options.levelForExp(exp);
    }
    projected[ROOT_KEY]=v1RootFromV2(root,state.saveMeta.saveId);
    projected.saveMeta.appliedMigrations=projected.saveMeta.appliedMigrations.filter(item=>item?.id!==ACTIVATION_ID);
    if(typeof options.projectAdditional==='function'){
      const additional=options.projectAdditional(freeze(clone(projected)));
      if(!isObject(additional)||additional.schemaVersion!==15)fail('invalid-additional-projection');
      return clone(additional);
    }
    return projected;
  }
  function projectToV1(state,options={}){return attempt(()=>success({state:freeze(projectToV1Unsafe(state,options))}))}

  function validateV1State(state,options={}){
    requireDependency();
    if(state?.schemaVersion!==15||state?.[ROOT_KEY]?.version!==1)return freeze({ok:false,errors:['experienceProgression.version']});
    return FOUNDATION.validateSuccessorState(state,options.foundationOptions||options);
  }

  function validateV2StateUnsafe(state,options={}){
    const errors=[],record=value=>{if(!errors.includes(value))errors.push(value)};
    if(!isObject(state)||state.schemaVersion!==15||!isObject(state.saveMeta)||typeof state.saveMeta.saveId!=='string'||!state.saveMeta.saveId||!safe(state.saveMeta.revision)||!safe(state.saveMeta.updatedAt)||!Array.isArray(state.saveMeta.appliedMigrations)||!isObject(state.fellows)||!isObject(state.companions))return{ok:false,errors:['$']};
    const root=state[ROOT_KEY],keys=['version','policyId','activatedAt','baselines','wallets','ledger','migration','activation','tutorials'];
    if(!exactKeys(root,keys)||root.version!==ROOT_VERSION||root.policyId!==POLICY_ID||!safe(root.activatedAt)||root.activatedAt>state.saveMeta.updatedAt)return{ok:false,errors:[ROOT_KEY]};
    if(typeof options.levelForExp!=='function')record('authority.levelForExp');
    if(!exactKeys(root.wallets,['fellow','companion'])||!validateWallet(root.wallets.fellow)||!validateWallet(root.wallets.companion,{neutral:true}))record('experienceProgression.wallets');
    if(!validateActivation(root.activation,root,state)||!validateActivationReceipt(state,root))record('experienceProgression.activation');
    if(!validateTutorials(root.tutorials,root.ledger))record('experienceProgression.tutorials');
    if(!same(root.baselines,v1RootFromV2(root,state.saveMeta.saveId).baselines)||!isObject(root.migration))record('experienceProgression.origin');
    if(!errors.length){
      const replay=replayLedger(root,{saveId:state.saveMeta.saveId,fellows:state.fellows,levelForExp:options.levelForExp});
      if(!replay.ok)record(`experienceProgression.${replay.reason}`);
      else for(const id of sortedIds(state.fellows)){
        let expected;try{expected=add(root.activation.investedFellowExpById[id],replay.replay.spentByFellow[id])}catch{record('fellows.exp-overflow');break}
        let level;try{level=options.levelForExp(expected)}catch{record('authority.levelForExp');break}
        if(state.fellows[id]?.exp!==expected||state.fellows[id]?.level!==level){record(`fellows.${id}.invested-exp`);break}
      }
    }
    if(!errors.length){
      let projected;try{projected=projectToV1Unsafe(state,options)}catch(error){record(error.phase24lReason||'v1-projection')}
      if(projected){const result=validateV1State(projected,options);if(result.ok!==true)record('current-v1-projection')}
    }
    return{ok:errors.length===0,errors};
  }
  function validateV2State(state,options={}){try{requireDependency();return validateV2StateUnsafe(state,options)}catch{return{ok:false,errors:['validation.exception']}}}
  function validateState(state,options={}){return state?.[ROOT_KEY]?.version===1?validateV1State(state,options):state?.[ROOT_KEY]?.version===2?validateV2State(state,options):freeze({ok:false,errors:['experienceProgression.version']})}

  function activateV1State(state,input={},options={}){
    return attempt(()=>{
      requireDependency();
      if(validateV1State(state,options).ok!==true)fail('invalid-v1-state');
      const now=input.now,source=input.source,expectedRevision=input.expectedRevision;
      if(!safe(now)||now<state.saveMeta.updatedAt||typeof source!=='string'||!TOKEN.test(source)||!safe(expectedRevision)||expectedRevision!==state.saveMeta.revision||expectedRevision>=Number.MAX_SAFE_INTEGER)fail('stale-activation');
      const predecessorRoot=clone(state[ROOT_KEY]),fellowMap=actorExpMap(state.fellows),fellowLevelMap=actorLevelMap(state.fellows,options.levelForExp),companionMap=actorExpMap(state.companions),predecessorRootIdentity=rootIdentity(predecessorRoot),sourceStateIdentity=identity('phase24l.b1.activation-source-state.v1',state);
      const receipt={id:ACTIVATION_ID,receiptVersion:1,fromRootVersion:1,toRootVersion:2,appliedAt:now,source,saveId:state.saveMeta.saveId,predecessorRevision:state.saveMeta.revision,predecessorRootIdentity,sourceStateIdentity,investedFellowExpIdentity:investedMapIdentity(state.saveMeta.saveId,'fellow',fellowMap),investedFellowLevelIdentity:investedMapIdentity(state.saveMeta.saveId,'fellow-level',fellowLevelMap),investedCompanionExpIdentity:investedMapIdentity(state.saveMeta.saveId,'companion',companionMap),identity:''};
      receipt.identity=activationReceiptIdentity(receipt);
      const activation={version:ACTIVATION_VERSION,id:ACTIVATION_ID,activatedAt:now,predecessorRevision:state.saveMeta.revision,predecessorRootIdentity,sourceStateIdentity,investedFellowExpById:fellowMap,investedFellowLevelById:fellowLevelMap,investedCompanionExpById:companionMap,investedFellowExpIdentity:receipt.investedFellowExpIdentity,investedFellowLevelIdentity:receipt.investedFellowLevelIdentity,investedCompanionExpIdentity:receipt.investedCompanionExpIdentity,receiptIdentity:receipt.identity,identity:''};
      activation.identity=activationIdentity(activation);
      const next=clone(state);next.saveMeta.revision++;next.saveMeta.updatedAt=now;next.saveMeta.source=source;next.saveMeta.appliedMigrations.push(receipt);next[ROOT_KEY]={version:ROOT_VERSION,policyId:POLICY_ID,activatedAt:predecessorRoot.activatedAt,baselines:clone(predecessorRoot.baselines),wallets:{fellow:clone(predecessorRoot.wallets.fellow),companion:clone(predecessorRoot.wallets.companion)},ledger:createLedger(state.saveMeta.saveId,sortedIds(state.fellows)),migration:clone(predecessorRoot.migration),activation,tutorials:createTutorials()};
      if(!same(next.fellows,state.fellows)||!same(next.companions,state.companions))fail('activation-changed-actors');
      const validation=validateV2State(next,options);if(validation.ok!==true)fail('invalid-activated-state');
      return success({state:freeze(next),root:freeze(clone(next[ROOT_KEY])),receipt:freeze(clone(receipt))});
    });
  }

  function foldEntry(checkpoint,entry){
    const next=clone(checkpoint);
    if(entry.sequence!==next.throughSequence+1||entry.previousEntryIdentity!==next.foldedChainIdentity)fail('invalid-fold-order');
    next.throughSequence=entry.sequence;next.foldedChainIdentity=entry.identity;
    if(entry.kind==='credit'){
      next.creditCount=add(next.creditCount,1);next.creditedTotal=add(next.creditedTotal,entry.awardedAmount);next.rawCreditedTotal=add(next.rawCreditedTotal,entry.rawAmount);next.rawCreditByFellowId[entry.historicalTargetId]=add(next.rawCreditByFellowId[entry.historicalTargetId],entry.rawAmount);next.foldedSourceIdentity=foldToken(next.foldedSourceIdentity,'phase24l.b1.folded-source.v1',entry.source.identity);
    }else{
      next.spendCount=add(next.spendCount,1);next.spentTotal=add(next.spentTotal,entry.amount);next.spentByFellowId[entry.fellowId]=add(next.spentByFellowId[entry.fellowId],entry.amount);next.foldedRequestIdentity=foldToken(next.foldedRequestIdentity,'phase24l.b1.folded-request.v1',entry.requestId);
    }
    next.identity='';next.identity=checkpointIdentity(next);return next;
  }
  function appendEntry(root,entry){
    const next=clone(root);next.ledger.entries.push(entry);next.ledger.entryCount=add(next.ledger.entryCount,1);
    if(next.ledger.entries.length>MAX_TAIL_ENTRIES){
      const folded=next.ledger.entries.splice(0,FOLD_BATCH_SIZE);let checkpoint=next.ledger.checkpoint;
      for(const item of folded)checkpoint=foldEntry(checkpoint,item);
      next.ledger.checkpoint=checkpoint;next.ledger.throughSequence=checkpoint.throughSequence;next.ledger.foldedIdentity=checkpoint.identity;
    }
    return next;
  }

  function assertV2StageInput(state,options){
    if(state?.schemaVersion!==15||state?.[ROOT_KEY]?.version!==ROOT_VERSION||!isObject(state.fellows)||!isObject(state.companions)||!isObject(state.saveMeta))fail('invalid-v2-stage-state');
    if(typeof options.levelForExp!=='function')fail('missing-level-authority');
    const root=state[ROOT_KEY],keys=['version','policyId','activatedAt','baselines','wallets','ledger','migration','activation','tutorials'];
    if(!exactKeys(root,keys)||root.policyId!==POLICY_ID||!validateWallet(root.wallets?.fellow)||!validateWallet(root.wallets?.companion,{neutral:true})||!validateActivation(root.activation,root,state)||!validateActivationReceipt(state,root)||!validateTutorials(root.tutorials,root.ledger))fail('invalid-v2-stage-root');
    const replay=replayLedger(root,{saveId:state.saveMeta.saveId,fellows:state.fellows,levelForExp:options.levelForExp});if(!replay.ok)fail(replay.reason);
    for(const id of sortedIds(state.fellows)){const expected=add(root.activation.investedFellowExpById[id],replay.replay.spentByFellow[id]);if(state.fellows[id]?.exp!==expected||state.fellows[id]?.level!==levelAt(expected,options))fail('invalid-invested-exp-state')}
    return replay.replay;
  }

  function stageCredit(state,input={},options={}){
    return attempt(()=>{
      const replay=assertV2StageInput(state,options),root=state[ROOT_KEY],source=makeSource(input.sourceKind,input.sourceId);
      if(!safe(input.expectedRevision)||input.expectedRevision!==state.saveMeta.revision||input.expectedHeadIdentity!==replay.headIdentity||!safe(input.expectedWalletBalance)||input.expectedWalletBalance!==root.wallets.fellow.balance)fail('stale-credit');
      if(typeof options.isSourceAvailable!=='function'||options.isSourceAvailable(freeze(clone(state)),source)!==true)fail('credit-source-unavailable');
      if(root.ledger.entries.some(entry=>entry.kind==='credit'&&entry.source.identity===source.identity))fail('duplicate-credit-source');
      if(!Object.hasOwn(state.fellows,input.historicalTargetId))fail('unknown-historical-target');
      if(!safe(input.occurredAt)||input.occurredAt<state.saveMeta.updatedAt)fail('invalid-credit-time');
      const award=creditAward(input.rawAmount,input.authoredBps,input.collectionBps),walletBefore=root.wallets.fellow.balance,walletAfter=add(walletBefore,award.awardedAmount),entry={version:ENTRY_VERSION,sequence:add(root.ledger.entryCount,1),kind:'credit',roster:'fellow',stateRevision:state.saveMeta.revision,occurredAt:input.occurredAt,source,historicalTargetId:input.historicalTargetId,rawAmount:input.rawAmount,authoredBps:input.authoredBps,collectionBps:input.collectionBps,totalBps:award.totalBps,rounding:'floor',awardedAmount:award.awardedAmount,walletBefore,walletAfter,previousEntryIdentity:replay.headIdentity,identity:''};
      entry.identity=entryIdentity(entry);
      const next=appendEntry(root,entry);next.wallets.fellow.creditedTotal=add(next.wallets.fellow.creditedTotal,award.awardedAmount);next.wallets.fellow.balance=walletAfter;next.tutorials=completeTutorial(next.tutorials,'firstCredit',entry);
      if(!same(next.wallets.companion,root.wallets.companion))fail('companion-wallet-changed');
      const check=replayLedger(next,{saveId:state.saveMeta.saveId,fellows:state.fellows,levelForExp:options.levelForExp});if(!check.ok)fail(check.reason);
      return success({root:freeze(next),entry:freeze(clone(entry)),awardedAmount:award.awardedAmount,balance:walletAfter,headIdentity:entry.identity});
    });
  }

  function thresholdAt(level,state,fellowId,options){const value=options.thresholdForLevel(level,freeze(clone(state)),fellowId);if(!safe(value))fail('invalid-threshold-authority');return value}
  function levelAt(exp,options){const value=options.levelForExp(exp);if(!Number.isSafeInteger(value)||value<1)fail('invalid-level-authority');return value}
  function powerAt(state,fellowId,actor,options){const value=options.powerForFellow(freeze(clone(state)),fellowId,freeze(clone(actor)));if(!safe(value))fail('invalid-power-authority');return value}
  function capFor(state,fellowId,options){const value=typeof options.levelCap==='function'?options.levelCap(freeze(clone(state)),fellowId):options.levelCap;if(!Number.isSafeInteger(value)||value<1)fail('invalid-level-cap');return value}

  function previewSpend(state,input={},options={}){
    return attempt(()=>{
      const replay=assertV2StageInput(state,options),root=state[ROOT_KEY],fellowId=input.fellowId,mode=input.mode;
      if(typeof options.thresholdForLevel!=='function'||typeof options.powerForFellow!=='function'||typeof options.isFellowAvailable!=='function')fail('missing-spend-authority');
      if(!Object.hasOwn(state.fellows,fellowId)||options.isFellowAvailable(freeze(clone(state)),fellowId)!==true)fail('fellow-unavailable');
      if(!['x1','x10','max'].includes(mode))fail('invalid-spend-mode');
      const actor=state.fellows[fellowId],before={exp:actor.exp,level:levelAt(actor.exp,options),power:0},cap=capFor(state,fellowId,options),walletBalance=root.wallets.fellow.balance;
      if(actor.level!==before.level)fail('actor-level-mismatch');
      if(before.level>=cap)fail('fellow-at-level-cap');
      const maximumLevels=mode==='x1'?1:mode==='x10'?Math.min(10,cap-before.level):cap-before.level;
      let affordableLevels=0,cost=0,targetExp=before.exp;
      for(let count=1;count<=maximumLevels;count++){
        const candidateLevel=before.level+count,candidateExp=thresholdAt(candidateLevel,state,fellowId,options);
        if(candidateExp<before.exp)fail('nonmonotonic-threshold');
        const candidateCost=candidateExp-before.exp;
        if(!safe(candidateCost)||candidateCost<=0)fail('invalid-threshold-difference');
        if(candidateCost>walletBalance)break;
        affordableLevels=count;cost=candidateCost;targetExp=candidateExp;
      }
      if(affordableLevels===0)fail('insufficient-fellow-exp');
      const afterLevel=levelAt(targetExp,options);if(afterLevel!==before.level+affordableLevels)fail('threshold-level-mismatch');
      before.power=powerAt(state,fellowId,{exp:before.exp,level:before.level},options);
      const after={exp:targetExp,level:afterLevel,power:powerAt(state,fellowId,{exp:targetExp,level:afterLevel},options)};
      const preview={version:PREVIEW_VERSION,roster:'fellow',saveId:state.saveMeta.saveId,fellowId,mode,levels:affordableLevels,cost,walletBalance,walletAfter:walletBalance-cost,before,after,levelCap:cap,stateRevision:state.saveMeta.revision,ledgerHeadIdentity:replay.headIdentity,rootIdentity:rootIdentity(root),identity:''};
      preview.identity=previewIdentity(preview);const requestId=requestIdentity(preview.identity);
      return success({preview:freeze({...preview,requestId})});
    });
  }

  function validatePreviewShape(preview){
    const keys=['version','roster','saveId','fellowId','mode','levels','cost','walletBalance','walletAfter','before','after','levelCap','stateRevision','ledgerHeadIdentity','rootIdentity','identity','requestId'];
    if(!exactKeys(preview,keys)||preview.version!==PREVIEW_VERSION||preview.roster!=='fellow'||typeof preview.saveId!=='string'||!preview.saveId||!['x1','x10','max'].includes(preview.mode)||!safe(preview.levels)||preview.levels<=0||!safe(preview.cost)||preview.cost<=0||!safe(preview.walletBalance)||!safe(preview.walletAfter)||preview.walletAfter!==preview.walletBalance-preview.cost||!exactKeys(preview.before,['exp','level','power'])||!exactKeys(preview.after,['exp','level','power'])||!safe(preview.before.exp)||!safe(preview.after.exp)||!safe(preview.before.power)||!safe(preview.after.power)||!Number.isSafeInteger(preview.before.level)||!Number.isSafeInteger(preview.after.level)||!safe(preview.levelCap)||!safe(preview.stateRevision)||!HASH.test(preview.ledgerHeadIdentity)||!HASH.test(preview.rootIdentity)||!HASH.test(preview.identity)||!HASH.test(preview.requestId))return false;
    const projection=clone(preview);delete projection.requestId;return preview.identity===previewIdentity(projection)&&preview.requestId===requestIdentity(preview.identity);
  }

  function stageSpend(state,providedPreview,options={}){
    return attempt(()=>{
      if(!validatePreviewShape(providedPreview))fail('invalid-spend-preview');
      const current=previewSpend(state,{fellowId:providedPreview.fellowId,mode:providedPreview.mode},options);if(!current.ok||!same(current.preview,providedPreview))fail('stale-spend-preview');
      const replay=assertV2StageInput(state,options),root=state[ROOT_KEY],preview=current.preview;
      if(typeof options.isRequestAvailable!=='function'||options.isRequestAvailable(freeze(clone(state)),preview.requestId)!==true)fail('spend-request-unavailable');
      if(root.ledger.entries.some(entry=>entry.kind==='spend'&&entry.requestId===preview.requestId))fail('duplicate-spend-request');
      if(!safe(options.committedAt)||options.committedAt<state.saveMeta.updatedAt)fail('invalid-spend-time');
      const entry={version:ENTRY_VERSION,sequence:add(root.ledger.entryCount,1),kind:'spend',roster:'fellow',stateRevision:state.saveMeta.revision,occurredAt:options.committedAt,requestId:preview.requestId,fellowId:preview.fellowId,mode:preview.mode,levels:preview.levels,amount:preview.cost,walletBefore:preview.walletBalance,walletAfter:preview.walletAfter,actorBefore:{exp:preview.before.exp,level:preview.before.level},actorAfter:{exp:preview.after.exp,level:preview.after.level},previewIdentity:preview.identity,previousEntryIdentity:replay.headIdentity,identity:''};
      entry.identity=entryIdentity(entry);
      const next=appendEntry(root,entry);next.wallets.fellow.spentTotal=add(next.wallets.fellow.spentTotal,preview.cost);next.wallets.fellow.balance=preview.walletAfter;next.tutorials=completeTutorial(next.tutorials,'firstSpend',entry);
      if(!same(next.wallets.companion,root.wallets.companion))fail('companion-wallet-changed');
      const fellows=clone(state.fellows);fellows[preview.fellowId].exp=preview.after.exp;fellows[preview.fellowId].level=preview.after.level;
      const check=replayLedger(next,{saveId:state.saveMeta.saveId,fellows,levelForExp:options.levelForExp});if(!check.ok)fail(check.reason);
      return success({root:freeze(next),entry:freeze(clone(entry)),fellow:freeze({id:preview.fellowId,exp:preview.after.exp,level:preview.after.level}),spentAmount:preview.cost,balance:preview.walletAfter,headIdentity:entry.identity});
    });
  }

  function validateRootTransition(previousState,nextState,options={}){
    try{
      if(previousState?.[ROOT_KEY]?.version!==ROOT_VERSION||nextState?.[ROOT_KEY]?.version!==ROOT_VERSION||previousState.saveMeta.saveId!==nextState.saveMeta.saveId||!same(previousState[ROOT_KEY].activation,nextState[ROOT_KEY].activation)||!same(previousState[ROOT_KEY].baselines,nextState[ROOT_KEY].baselines)||!same(previousState[ROOT_KEY].migration,nextState[ROOT_KEY].migration)||!same(previousState[ROOT_KEY].wallets.companion,nextState[ROOT_KEY].wallets.companion))return false;
      const prior=previousState[ROOT_KEY],next=nextState[ROOT_KEY];if(next.ledger.entryCount!==prior.ledger.entryCount+1)return false;
      const entry=next.ledger.entries[next.ledger.entries.length-1];if(!entry||entry.sequence!==next.ledger.entryCount)return false;
      if(entry.kind==='credit'){
        const staged=stageCredit(previousState,{sourceKind:entry.source.kind,sourceId:entry.source.id,historicalTargetId:entry.historicalTargetId,rawAmount:entry.rawAmount,authoredBps:entry.authoredBps,collectionBps:entry.collectionBps,occurredAt:entry.occurredAt,expectedRevision:previousState.saveMeta.revision,expectedHeadIdentity:ledgerHeadIdentity(prior.ledger),expectedWalletBalance:prior.wallets.fellow.balance},{...options,isSourceAvailable:()=>true});
        return staged.ok&&same(staged.root,next)&&same(previousState.fellows,nextState.fellows);
      }
      if(entry.kind==='spend'){
        const preview=previewSpend(previousState,{fellowId:entry.fellowId,mode:entry.mode},options);if(!preview.ok)return false;
        const staged=stageSpend(previousState,preview.preview,{...options,committedAt:entry.occurredAt,isRequestAvailable:()=>true});if(!staged.ok||!same(staged.root,next))return false;
        for(const id of sortedIds(previousState.fellows)){const expected=id===staged.fellow.id?{...previousState.fellows[id],exp:staged.fellow.exp,level:staged.fellow.level}:previousState.fellows[id];if(!same(expected,nextState.fellows[id]))return false}
        return true;
      }
      return false;
    }catch{return false}
  }

  /* Public API: activate/validate/project schema-15 roots; stage atomic credits/spends; create pure spend previews; verify exact staged root transitions. */
  const api=freeze({version:1,status:'phase-24l-b1-fellow-exp-wallet',rootKey:ROOT_KEY,rootVersion:ROOT_VERSION,policyId:POLICY_ID,activationId:ACTIVATION_ID,ledgerVersion:LEDGER_VERSION,tutorialVersion:TUTORIAL_VERSION,tutorialIds:TUTORIAL_IDS,maxTailEntries:MAX_TAIL_ENTRIES,foldBatchSize:FOLD_BATCH_SIZE,dependencyReady,canonicalStringify:canonical,sha256,rootIdentity,makeSource,sourceIdentity,creditAward,ledgerHeadIdentity,tutorialCompletion,validateV1State,validateV2State,validateState,activateV1State,projectToV1,previewSpend,stageCredit,stageSpend,validateRootTransition});
  Object.defineProperty(global,'EVERSTEAD_PHASE24L_FELLOW_EXP_WALLET',{configurable:false,enumerable:false,writable:false,value:api});
})(globalThis);
