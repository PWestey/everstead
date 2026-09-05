/* Everstead Phase 24L-B1 · query-scoped Fellow EXP release bridge. */
(function installEversteadPhaseTwentyFourLFellowExpQaRuntime(global){
  'use strict';

  const VERSION=1;
  const ID='everstead.phase24l.fellow-exp-qa-runtime.v1';
  const BRIDGE_NAME='__EVERSTEAD_PHASE_24L_B1_QA__';
  const QUERY_KEY='phase24l-fellow-exp-qa';
  const QUERY_VALUE='1';
  const CREDIT_SOURCE='phase24l-b1-fellow-exp-credit';
  const TUTORIAL_IDS=Object.freeze({
    firstCredit:'tutorial.phase-24l-b1.fellow-exp-earned.v1',
    firstSpend:'tutorial.phase-24l-b1.fellow-exp-spent.v1'
  });
  const ALLOWED_FIXTURES=new Set(['post-b0-play','campaign-ready','manual-claim-ready','partial-affordable','tutorial-ready','at-cap']);
  const ALLOWED_REFUSALS=new Set(['below-x1','at-cap','unavailable','stale-preview','malformed','overflow','stale-tutorial-spend']);
  const ALLOWED_RECOVERY=new Set(['credit-after-staging','spend-after-staging','activation-after-journal','safe-reset-after-active','previous-save']);
  const ALLOWED_RACES=new Set(['credit-credit','spend-spend','credit-spend']);
  const ALLOWED_TUTORIAL_ACTIONS=new Set(['open','skip','replay']);
  const ALLOWED_TUTORIAL_NAMES=new Set(['first-credit','first-affordable-spend','first-spend']);
  const ALLOWED_MODES=new Set(['x1','x10','max']);
  const TOKEN=/^[A-Za-z0-9._:/-]{1,256}$/;

  const clone=value=>value===undefined?null:JSON.parse(JSON.stringify(value));
  const plain=value=>Boolean(value)&&typeof value==='object'&&!Array.isArray(value)&&(Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
  const safe=value=>Number.isSafeInteger(value)&&value>=0;
  const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
  const frozen=value=>Object.freeze(value);
  const fail=(reason)=>{const error=new Error(reason);error.code=reason;throw error};
  const exactKeys=(value,allowed,required=allowed)=>plain(value)&&Object.keys(value).every(key=>allowed.includes(key))&&required.every(key=>Object.hasOwn(value,key));

  function queryAllowed(root=global){
    try{const values=new URLSearchParams(root.location.search).getAll(QUERY_KEY);return values.length===1&&values[0]===QUERY_VALUE}catch{return false}
  }

  function validateJsonInput(value,path='input',seen=new Set()){
    if(value===null||typeof value==='string'||typeof value==='boolean')return;
    if(typeof value==='number'){if(!Number.isFinite(value))fail(`${path}-must-be-finite`);return}
    if(typeof value!=='object')fail(`${path}-unsupported-value`);
    if(seen.has(value))fail(`${path}-cycle`);
    seen.add(value);
    const isArray=Array.isArray(value),prototype=Object.getPrototypeOf(value);
    if(isArray?prototype!==Array.prototype:(prototype!==Object.prototype&&prototype!==null))fail(`${path}-plain-data-required`);
    const keys=Reflect.ownKeys(value);
    if(keys.some(key=>typeof key!=='string'||['__proto__','prototype','constructor','toJSON'].includes(key)))fail(`${path}-forbidden-key`);
    if(isArray){
      for(let index=0;index<value.length;index++)if(!Object.hasOwn(value,index))fail(`${path}-sparse-array`);
      if(keys.some(key=>key!=='length'&&!/^(0|[1-9]\d*)$/.test(key)))fail(`${path}-decorated-array`);
    }
    for(const key of keys){
      if(isArray&&key==='length')continue;
      const descriptor=Object.getOwnPropertyDescriptor(value,key);
      if(!descriptor||!Object.hasOwn(descriptor,'value')||descriptor.enumerable!==true)fail(`${path}-data-property-required`);
      validateJsonInput(descriptor.value,`${path}.${key}`,seen);
    }
    seen.delete(value);
  }

  function inputClone(value){validateJsonInput(value);return clone(value)}
  function requiredString(value,label,allowed=null){if(typeof value!=='string'||!value||!TOKEN.test(value)||allowed&&!allowed.has(value))fail(`invalid-${label}`);return value}
  function requiredInteger(value,label,{positive=false}={}){if(!safe(value)||positive&&value===0)fail(`invalid-${label}`);return value}

  function validateAdapter(adapter){
    if(!plain(adapter)||adapter.version!==1||!adapter.root||typeof adapter.runtime!=='function'||!plain(adapter.state)||!plain(adapter.api))return false;
    const stateMethods=['get','persistedRaw','adopt'];
    const apiMethods=['snapshot','validateState','resetFresh','reload','roundTripImport','recoverInterrupted','roundTripRollback','readSaveSnapshot','writeSaveSnapshot','readSlots','render','runtimeNow','levelForExp','thresholdForLevel','isFellowAvailable','actualState','engineOptions','foundationOptions','activate','spend','mutatePersisted','campaignPreview','runCampaign','queueOffer','claimsState','claimReward','makeStagingEnvelope','writeStaging','boot','successfulWrites','logLength'];
    return stateMethods.every(name=>typeof adapter.state[name]==='function')&&apiMethods.every(name=>typeof adapter.api[name]==='function')&&adapter.api.engine?.version===1&&adapter.api.engine?.rootVersion===2&&Array.isArray(adapter.api.fellowDefs)&&Array.isArray(adapter.api.companionDefs)&&Number.isSafeInteger(adapter.api.levelCap)&&adapter.api.levelCap>1&&adapter.api.activationSource==='phase24l-b1-activation'&&adapter.api.spendSource==='phase24l-b1-fellow-exp-spend';
  }

  function install(adapter){
    if(!validateAdapter(adapter))return frozen({ok:false,reason:'adapter'});
    const root=adapter.root,A=adapter.api,slots=adapter.state,engine=A.engine;
    if(!queryAllowed(root))return frozen({ok:true,id:ID,version:VERSION,enabled:false,bridgeInstalled:false});
    if(Object.hasOwn(root,BRIDGE_NAME))return frozen({ok:false,reason:'bridge-name-occupied'});

    let campaignStageId=null,claimOfferId=null;
    const tutorialUi={firstCredit:{opened:false,skipped:false,replayCount:0},firstSpend:{opened:false,skipped:false,replayCount:0}};

    function runtimeAuthorized(){
      const context=adapter.runtime();
      if(!plain(context)||context.selectedStorageSupplied!==true||!context.selectedStorage||context.selectedStorage===context.nativeStorage)return false;
      const qa=context.qa;
      return Boolean(qa)&&typeof qa==='object'&&Object.hasOwn(qa,'allowDestructive')&&qa.allowDestructive===true&&Object.hasOwn(qa,'isolatedStorage')&&qa.isolatedStorage===true;
    }
    function requireAuthorization(){if(!runtimeAuthorized())fail('destructive-qa-requires-explicit-isolated-non-native-storage')}
    function writeCount(from){const count=A.successfulWrites(from);return Number.isSafeInteger(count)&&count>=0?count:0}
    function response(operation,{destructive=false}={}){
      const log=A.logLength();
      try{
        if(!queryAllowed(root))fail('qa-scope-unavailable');
        if(destructive)requireAuthorization();
        const result=operation();
        const copied=clone(result);
        return plain(copied)?{...copied,writes:Object.hasOwn(copied,'writes')?copied.writes:writeCount(log)}:{ok:true,value:copied,writes:writeCount(log)};
      }catch(error){return{ok:false,reason:String(error?.code||error?.message||error),writes:writeCount(log)}}
    }
    function syncReadState(){
      const physical=A.snapshot(),local=slots.persistedRaw();
      if(physical?.raw!==local||physical?.persistence?.stale===true)A.reload();
    }
    function currentValidation(){return A.validateState(slots.get(),A.readSlots('phase24l-b1-qa-validate'))}
    function currentSnapshot(){syncReadState();return A.snapshot()}
    function actor(id){return slots.get()?.fellows?.[id]||null}
    function add(left,right,label){if(!safe(left)||!safe(right)||left>Number.MAX_SAFE_INTEGER-right)fail(`unsafe-${label}`);return left+right}
    function resetTutorialUi(){for(const value of Object.values(tutorialUi)){value.opened=false;value.skipped=false;value.replayCount=0}}

    function installDirectState(candidate){
      const snapshot=A.readSaveSnapshot('phase24l-b1-qa-direct-before'),raw=JSON.stringify(candidate),checked=A.validateState(candidate,A.readSlots('phase24l-b1-qa-direct-validation'));
      if(!checked?.ok)fail(`invalid-direct-fixture:${(checked?.errors||[]).join(',')}`);
      snapshot.active=raw;snapshot.ordinaryStaging=null;snapshot.journal=null;snapshot.rollback=null;
      A.writeSaveSnapshot(snapshot);slots.adopt(raw,candidate);A.render();
      return candidate;
    }
    function grantInvested(candidate,id,amount){
      const fellow=candidate.fellows?.[id],credits=candidate.fellowProgressLedger?.qaCredits?.fellowExp;
      if(!fellow||!credits||!Object.hasOwn(credits,id))fail('fixture-fellow-ledger-unavailable');
      fellow.exp=add(fellow.exp,amount,`${id}-exp`);fellow.level=A.levelForExp(fellow.exp);credits[id]=add(credits[id],amount,`${id}-qa-exp`);
    }
    function makeRootV1(kind){
      A.resetFresh();
      const projected=engine.projectToV1(slots.get(),{levelForExp:A.levelForExp});
      if(!projected.ok)fail(projected.reason);
      const candidate=clone(projected.state);
      if(kind==='post-b0-play')grantInvested(candidate,'cael',777);
      if(kind==='partial-affordable')grantInvested(candidate,'cael',37);
      if(kind==='campaign-ready'){
        const capExp=A.thresholdForLevel(A.levelCap);
        for(const definition of A.fellowDefs){const current=candidate.fellows[definition.id].exp;if(capExp>current)grantInvested(candidate,definition.id,capExp-current)}
        candidate.gold=Math.min(Number.MAX_SAFE_INTEGER,1_000_000_000_000);
      }
      if(kind==='at-cap'){
        const capExp=A.thresholdForLevel(A.levelCap),current=candidate.fellows.cael.exp;
        if(capExp>current)grantInvested(candidate,'cael',capExp-current);
      }
      candidate.saveMeta.revision=add(candidate.saveMeta.revision,1,'fixture-revision');
      candidate.saveMeta.updatedAt=Math.max(candidate.saveMeta.updatedAt,A.runtimeNow());
      candidate.saveMeta.source='phase23-qa-fixture';
      return installDirectState(candidate);
    }

    function activateCurrent(){
      if(slots.get()?.experienceProgression?.version===2)return{ok:true,changed:false,writeCount:0};
      const before=A.logLength(),result=A.activate();
      if(!result?.ok)return{ok:false,reason:String(result?.reason||'activation-refused'),writeCount:writeCount(before)};
      return{ok:true,changed:true,receipt:clone(result.receipt),writeCount:writeCount(before)};
    }

    function stageQaCredit(input,{sourceKind='manual-reward-claim',writeSource=CREDIT_SOURCE}={}){
      if(slots.get()?.experienceProgression?.version!==2){const activation=activateCurrent();if(!activation.ok)return activation}
      let staged=null;
      const result=A.mutatePersisted((state,now,refuse)=>{
        const actual=A.actualState(state),rootState=actual.experienceProgression;
        staged=engine.stageCredit(actual,{
          sourceKind,sourceId:input.sourceId,historicalTargetId:input.historicalTargetId,
          rawAmount:input.rawAmount,authoredBps:input.authoredBps,collectionBps:input.collectionBps,
          occurredAt:now,expectedRevision:actual.saveMeta.revision,
          expectedHeadIdentity:engine.ledgerHeadIdentity(rootState.ledger),expectedWalletBalance:rootState.wallets.fellow.balance
        },{...A.engineOptions(actual),isSourceAvailable:()=>true});
        if(!staged.ok)return refuse(staged.reason);
        actual.experienceProgression=clone(staged.root);
        return{awardedAmount:staged.awardedAmount,balance:staged.balance,entry:clone(staged.entry)};
      },writeSource,{renderAfter:false,allowRefusal:true});
      if(!result?.ok)return{ok:false,reason:String(result?.reason||result?.error?.code||result?.error?.message||staged?.reason||'credit-refused')};
      return{ok:true,awardedAmount:staged.awardedAmount,balance:staged.balance,entry:clone(staged.entry)};
    }
    function parseCreditInput(value){
      const input=inputClone(value);
      if(!exactKeys(input,['route','sourceId','historicalTargetId','rawAmount','authoredBps','collectionBps']))fail('invalid-credit-payload');
      if(input.route!=='manual-reward-claim')fail('invalid-credit-route');
      requiredString(input.sourceId,'source-id');requiredString(input.historicalTargetId,'historical-target');
      requiredInteger(input.rawAmount,'raw-amount',{positive:true});requiredInteger(input.authoredBps,'authored-bps');requiredInteger(input.collectionBps,'collection-bps');
      if(!actor(input.historicalTargetId))fail('unknown-historical-target');
      return input;
    }

    function prepareCampaign(){
      makeRootV1('campaign-ready');
      const activated=activateCurrent();if(!activated.ok)fail(activated.reason);
      for(let index=0;index<4;index++){
        const id=slots.get().fellowCampaign.selectedStageId,result=A.runCampaign(id,{confirmed:true,present:false});
        if(!result?.ok)fail(`campaign-setup-${index+1}`);
      }
      for(let guard=0;guard<32;guard++){
        const cleared=slots.get().fellowCampaign.clearedStageIds;
        const eligible=cleared.find(id=>{const preview=A.campaignPreview(id);return preview?.valid&&preview?.canRun&&preview?.firstClear===false&&preview?.shards===0});
        if(eligible){campaignStageId=eligible;return}
        const id=cleared[0],result=A.runCampaign(id,{confirmed:true,present:false});if(!result?.ok)fail('campaign-zero-shard-replay-setup');
      }
      fail('campaign-zero-shard-preview-unavailable');
    }
    function prepareManualClaim(){
      A.resetFresh();claimOfferId='reward.offer.qa.phase24l-b1.fellow-exp';
      const queued=A.mutatePersisted((state,now)=>A.queueOffer(state,{id:claimOfferId,sourceType:'opportunity.story.reward',sourceId:'story.book1.chapter1.village-toll.resolution',rewards:[{kind:'fellowExp',targetId:'cael',amount:777}]},now),'phase23-qa-fixture',{renderAfter:false});
      if(!queued?.ok)fail(String(queued?.error?.code||queued?.error?.message||'manual-claim-fixture-refused'));
      const offer=A.claimsState(slots.get())?.pendingOffers?.[claimOfferId];if(!offer)fail('manual-claim-offer-missing');
    }
    function preparePartial(){
      makeRootV1('partial-affordable');const activated=activateCurrent();if(!activated.ok)fail(activated.reason);
      const seeded=stageQaCredit({sourceId:'qa.fixture.partial-wallet',historicalTargetId:'cael',rawAmount:20_000_000,authoredBps:0,collectionBps:0});
      if(!seeded.ok)fail(seeded.reason);
    }
    function resetFixture(kind){
      requiredString(kind,'fixture',ALLOWED_FIXTURES);resetTutorialUi();campaignStageId=null;claimOfferId=null;
      if(kind==='post-b0-play')makeRootV1(kind);
      else if(kind==='campaign-ready')prepareCampaign();
      else if(kind==='manual-claim-ready')prepareManualClaim();
      else if(kind==='partial-affordable')preparePartial();
      else if(kind==='at-cap'){makeRootV1(kind);const activated=activateCurrent();if(!activated.ok)fail(activated.reason)}
      else A.resetFresh();
      return{ok:true,fixture:kind,state:clone(slots.get()),rootVersion:slots.get()?.experienceProgression?.version??null};
    }

    function readPreview(id,mode){
      requiredString(id,'fellow-id');requiredString(mode,'spend-mode',ALLOWED_MODES);
      const state=slots.get(),fellow=state?.fellows?.[id];if(!fellow)return{ok:false,reason:'unknown-fellow'};
      const result=engine.previewSpend(state,{fellowId:id,mode},A.engineOptions(state));
      if(!result.ok)return result;
      const exact=A.thresholdForLevel(fellow.level+1)-fellow.exp;
      return{ok:true,preview:clone(result.preview),expectedExactCost:exact,greatestAffordable:true};
    }
    function tutorialEvidence(){
      const rootState=slots.get()?.experienceProgression,credit=rootState?.tutorials?.firstCredit,spend=rootState?.tutorials?.firstSpend;
      const item=(marker,ui,speaker)=>({tutorialId:marker?.tutorialId??null,status:marker?.completed?'available':'locked',completed:marker?.completed===true,opened:ui.opened,skipped:ui.skipped,replayCount:ui.replayCount,speaker,speakerRosterCurrent:true,replayable:marker?.replayable===true});
      return{ok:true,firstCredit:item(credit,tutorialUi.firstCredit,'Tavi'),firstAffordableSpend:item(spend,tutorialUi.firstSpend,"Vex'ahlia")};
    }

    function spendAction(value){
      const input=inputClone(value);
      if(!exactKeys(input,['fellowId','mode','preview']))fail('invalid-spend-payload');
      requiredString(input.fellowId,'fellow-id');requiredString(input.mode,'spend-mode',ALLOWED_MODES);
      if(!plain(input.preview)||typeof input.preview.identity!=='string')fail('invalid-spend-preview');
      const result=A.spend(input.fellowId,input.mode,input.preview.identity);
      if(!result?.ok)return{ok:false,reason:String(result?.reason||'spend-refused')};
      return{ok:true,...clone(result)};
    }
    function campaignAction(value){
      const input=inputClone(value);if(!exactKeys(input,['kind']))fail('invalid-campaign-payload');
      const kind=requiredString(input.kind,'campaign-kind',new Set(['first-clear','retry-same-source','replay']));
      if(kind==='retry-same-source'){
        const entry=slots.get()?.experienceProgression?.ledger?.entries?.slice().reverse().find(item=>item.kind==='credit'&&item.source.kind==='fellow-campaign');
        if(!entry)return{ok:false,reason:'campaign-source-missing'};
        return stageQaCredit({sourceId:entry.source.id,historicalTargetId:entry.historicalTargetId,rawAmount:entry.rawAmount,authoredBps:entry.authoredBps,collectionBps:entry.collectionBps},{sourceKind:'fellow-campaign',writeSource:'campaign-run'});
      }
      if(!campaignStageId)campaignStageId=slots.get()?.fellowCampaign?.clearedStageIds?.[0]||slots.get()?.fellowCampaign?.selectedStageId;
      const before=clone(slots.get()),ledgerBefore=before.experienceProgression.ledger.entryCount,preview=A.campaignPreview(campaignStageId),result=A.runCampaign(campaignStageId,{confirmed:true,present:false});
      if(!result?.ok)return{ok:false,reason:String(result?.error?.code||result?.error?.message||'campaign-refused')};
      const after=slots.get(),receipt=after.fellowCampaign.lastReceipt,last=after.experienceProgression.ledger.entries.at(-1),creditCount=after.experienceProgression.ledger.entryCount-ledgerBefore;
      return{ok:true,firstClear:receipt?.firstClear===true,creditCount,awardedAmount:last?.awardedAmount??0,nonExpRewardsPreserved:Boolean(receipt&&Number.isSafeInteger(receipt.rewards?.rankExp)&&Number.isSafeInteger(receipt.rewards?.gifts)),historicalReceiptPreserved:Boolean(receipt&&preview&&receipt.rewards?.fellowExp?.[preview.targetFellowId]===preview.exp),actorsUnchanged:same(before.fellows,after.fellows)};
    }
    function claimAction(value){
      const input=inputClone(value);if(!exactKeys(input,['kind'])||input.kind!=='fellow-exp')fail('invalid-claim-payload');
      const store=A.claimsState(slots.get()),offer=claimOfferId?store?.pendingOffers?.[claimOfferId]:null;
      if(!offer)return{ok:false,reason:'already-claimed'};
      const result=A.claimReward(claimOfferId,{expectedIdentity:offer.identity,present:false});
      if(!result?.ok)return{ok:false,reason:String(result?.reason||'claim-refused')};
      return{ok:true,receipt:clone(result.receipt),awardedAmount:slots.get().experienceProgression.ledger.entries.at(-1)?.awardedAmount??0};
    }

    function refusal(kind){
      requiredString(kind,'refusal-kind',ALLOWED_REFUSALS);
      let attempt;
      if(kind==='below-x1'){resetFixture('tutorial-ready');attempt=()=>readPreview('cael','x1')}
      else if(kind==='at-cap'){resetFixture('at-cap');attempt=()=>readPreview('cael','x1')}
      else if(kind==='unavailable'){resetFixture('partial-affordable');attempt=()=>engine.previewSpend(slots.get(),{fellowId:'not-owned-fellow',mode:'x1'},A.engineOptions(slots.get()))}
      else if(kind==='overflow'){resetFixture('tutorial-ready');attempt=()=>stageQaCredit({sourceId:'qa.refusal.overflow',historicalTargetId:'cael',rawAmount:Number.MAX_SAFE_INTEGER,authoredBps:10000,collectionBps:0})}
      else{
        resetFixture(kind==='stale-tutorial-spend'?'tutorial-ready':'partial-affordable');
        if(kind==='stale-tutorial-spend')stageQaCredit({sourceId:'qa.refusal.tutorial-funds',historicalTargetId:'cael',rawAmount:1000,authoredBps:0,collectionBps:0});
        const preview=readPreview('cael','x1');
        if(kind==='stale-preview'||kind==='stale-tutorial-spend'){
          stageQaCredit({sourceId:`qa.refusal.intervening.${kind}`,historicalTargetId:'cael',rawAmount:1,authoredBps:0,collectionBps:0});
          attempt=()=>spendAction({fellowId:'cael',mode:'x1',preview:preview.preview});
        }else{
          const malformed={...preview.preview,identity:`${preview.preview.identity}.malformed`};
          attempt=()=>spendAction({fellowId:'cael',mode:'x1',preview:malformed});
        }
      }
      const beforeRaw=slots.persistedRaw(),beforeRevision=slots.get().saveMeta.revision,beforeTutorial=clone(slots.get().experienceProgression?.tutorials),log=A.logLength();
      let result;try{result=attempt()}catch(error){result={ok:false,reason:String(error?.code||error?.message||error)}}
      return{ok:false,reason:String(result?.reason||'refused'),rawUnchanged:slots.persistedRaw()===beforeRaw,revisionUnchanged:slots.get().saveMeta.revision===beforeRevision,tutorialUnchanged:same(beforeTutorial,slots.get().experienceProgression?.tutorials),writes:writeCount(log)};
    }

    function makePendingEnvelope(kind){
      let before,staged,candidate,source,exactBefore;
      if(kind==='activation-after-journal'){
        resetFixture('post-b0-play');before=clone(slots.get());exactBefore=before.experienceProgression.version;
        const created=engine.activateV1State(before,{now:Math.max(A.runtimeNow(),before.saveMeta.updatedAt),source:A.activationSource,expectedRevision:before.saveMeta.revision},{...A.engineOptions(before),foundationOptions:A.foundationOptions(before)});
        if(!created.ok)fail(created.reason);candidate=clone(created.state);source=A.activationSource;
      }else if(kind==='credit-after-staging'){
        resetFixture('tutorial-ready');before=clone(slots.get());exactBefore=before.experienceProgression.ledger.entryCount;
        staged=engine.stageCredit(before,{sourceKind:'manual-reward-claim',sourceId:'qa.recovery.credit',historicalTargetId:'cael',rawAmount:1000,authoredBps:0,collectionBps:0,occurredAt:Math.max(A.runtimeNow(),before.saveMeta.updatedAt),expectedRevision:before.saveMeta.revision,expectedHeadIdentity:engine.ledgerHeadIdentity(before.experienceProgression.ledger),expectedWalletBalance:before.experienceProgression.wallets.fellow.balance},{...A.engineOptions(before),isSourceAvailable:()=>true});
        if(!staged.ok)fail(staged.reason);candidate=clone(before);candidate.experienceProgression=clone(staged.root);source=CREDIT_SOURCE;
      }else{
        resetFixture('partial-affordable');before=clone(slots.get());exactBefore=before.experienceProgression.ledger.entryCount;
        const preview=engine.previewSpend(before,{fellowId:'cael',mode:'x1'},A.engineOptions(before));if(!preview.ok)fail(preview.reason);
        staged=engine.stageSpend(before,preview.preview,{...A.engineOptions(before),committedAt:Math.max(A.runtimeNow(),before.saveMeta.updatedAt),isRequestAvailable:()=>true});
        if(!staged.ok)fail(staged.reason);candidate=clone(before);candidate.experienceProgression=clone(staged.root);candidate.fellows.cael.exp=staged.fellow.exp;candidate.fellows.cael.level=staged.fellow.level;source=A.spendSource;
      }
      if(kind!=='activation-after-journal'){
        candidate.saveMeta.revision=add(before.saveMeta.revision,1,'recovery-revision');candidate.saveMeta.updatedAt=Math.max(candidate.saveMeta.updatedAt,A.runtimeNow());candidate.saveMeta.source=source;
      }
      const raw=slots.persistedRaw(),envelope=A.makeStagingEnvelope(candidate,raw,source);A.writeStaging(JSON.stringify(envelope));A.boot();
      const after=slots.get(),terminal=A.readSaveSnapshot('phase24l-b1-qa-recovery-terminal'),validation=currentValidation();
      const count=kind==='activation-after-journal'?after.saveMeta.appliedMigrations.filter(item=>item?.id===engine.activationId).length:after.experienceProgression.ledger.entryCount-exactBefore;
      return{ok:true,kind,terminalControlsClean:terminal.ordinaryStaging===null&&terminal.journal===null,validation,exactlyOnce:count===1,rootVersion:after.experienceProgression.version};
    }
    function recoverAction(kind){
      requiredString(kind,'recovery-kind',ALLOWED_RECOVERY);
      if(['credit-after-staging','spend-after-staging','activation-after-journal'].includes(kind))return makePendingEnvelope(kind);
      if(kind==='safe-reset-after-active'){
        const result=A.recoverInterrupted('safe-reset-after-active'),terminal=A.readSaveSnapshot('phase24l-b1-qa-safe-reset-terminal');
        if(slots.get()?.experienceProgression?.version===1)activateCurrent();
        return{ok:result?.ok===true,kind,terminalControlsClean:terminal.ordinaryStaging===null&&terminal.journal===null,validation:currentValidation(),exactlyOnce:true,rootVersion:slots.get()?.experienceProgression?.version??null};
      }
      const result=A.roundTripRollback(),terminal=A.readSaveSnapshot('phase24l-b1-qa-previous-terminal');
      if(slots.get()?.experienceProgression?.version===1)activateCurrent();
      return{ok:result?.ok===true,kind,terminalControlsClean:terminal.ordinaryStaging===null&&terminal.journal===null,validation:currentValidation(),exactlyOnce:true,rootVersion:slots.get()?.experienceProgression?.version??null};
    }
    function raceAction(kind){
      requiredString(kind,'race-kind',ALLOWED_RACES);let winner,loser,loserWrites=0;
      if(kind==='credit-credit'){
        resetFixture('tutorial-ready');const input={sourceId:'qa.race.credit-credit',historicalTargetId:'cael',rawAmount:1000,authoredBps:0,collectionBps:0};winner=stageQaCredit(input);const log=A.logLength();loser=stageQaCredit(input);loserWrites=writeCount(log);
      }else{
        resetFixture('partial-affordable');const preview=readPreview('cael','x1');
        if(kind==='spend-spend'){winner=spendAction({fellowId:'cael',mode:'x1',preview:preview.preview});const log=A.logLength();loser=spendAction({fellowId:'cael',mode:'x1',preview:preview.preview});loserWrites=writeCount(log)}
        else{winner=stageQaCredit({sourceId:'qa.race.credit-spend',historicalTargetId:'cael',rawAmount:1,authoredBps:0,collectionBps:0});const log=A.logLength();loser=spendAction({fellowId:'cael',mode:'x1',preview:preview.preview});loserWrites=writeCount(log)}
      }
      return{ok:winner?.ok===true&&loser?.ok===false&&loserWrites===0,winnerCount:Number(winner?.ok===true),loserCount:Number(loser?.ok===false),loserWrites,validation:currentValidation()};
    }
    function tutorialAction(action,name){
      requiredString(action,'tutorial-action',ALLOWED_TUTORIAL_ACTIONS);requiredString(name,'tutorial-name',ALLOWED_TUTORIAL_NAMES);
      const key=name==='first-credit'?'firstCredit':'firstSpend',marker=slots.get()?.experienceProgression?.tutorials?.[key];if(!marker?.completed)return{ok:false,reason:'tutorial-not-available'};
      const ui=tutorialUi[key];if(action==='open')ui.opened=true;if(action==='skip')ui.skipped=true;if(action==='replay')ui.replayCount++;
      return{ok:true,action,tutorialId:TUTORIAL_IDS[key],replayCount:ui.replayCount};
    }

    const read=frozen({
      snapshot:()=>response(currentSnapshot),
      validate:()=>response(currentValidation),
      wallet:()=>response(()=>({ok:true,wallet:clone(slots.get()?.experienceProgression?.wallets?.fellow??null)})),
      fellow:id=>response(()=>{const key=requiredString(id,'fellow-id'),value=actor(key);return value?{ok:true,id:key,fellow:clone(value)}:{ok:false,reason:'unknown-fellow'}}),
      preview:(id,mode)=>response(()=>readPreview(id,mode)),
      tutorials:()=>response(tutorialEvidence)
    });
    const destructive=frozen({
      reset:kind=>response(()=>resetFixture(kind),{destructive:true}),
      activate:()=>response(activateCurrent,{destructive:true}),
      credit:value=>response(()=>stageQaCredit(parseCreditInput(value)),{destructive:true}),
      campaign:value=>response(()=>campaignAction(value),{destructive:true}),
      claim:value=>response(()=>claimAction(value),{destructive:true}),
      spend:value=>response(()=>spendAction(value),{destructive:true}),
      reload:()=>response(()=>{const result=A.reload();return{ok:result?.ok!==false,state:clone(slots.get()),rootVersion:slots.get()?.experienceProgression?.version??null,terminalControlsClean:true}},{destructive:true}),
      roundTripImport:version=>response(()=>{requiredInteger(Number(version),'format-version',{positive:true});const result=A.roundTripImport(Number(version));if(slots.get()?.experienceProgression?.version===1)activateCurrent();const terminal=A.readSaveSnapshot('phase24l-b1-qa-import-terminal');return{ok:result?.ok===true,formatVersion:Number(version),terminalControlsClean:terminal.ordinaryStaging===null&&terminal.journal===null,validation:currentValidation(),rootVersion:slots.get()?.experienceProgression?.version??null}},{destructive:true}),
      recoverInterrupted:kind=>response(()=>recoverAction(kind),{destructive:true}),
      multiClient:kind=>response(()=>raceAction(kind),{destructive:true}),
      tutorial:(action,id)=>response(()=>tutorialAction(action,id),{destructive:true}),
      probeRefusal:kind=>response(()=>refusal(kind),{destructive:true})
    });
    const bridge=frozen({version:'phase-24l-b1-fellow-exp-qa-v1',read,destructive});
    Object.defineProperty(root,BRIDGE_NAME,{configurable:true,enumerable:false,get:()=>queryAllowed(root)?bridge:undefined});
    return frozen({ok:true,id:ID,version:VERSION,enabled:true,bridgeInstalled:true});
  }

  const runtime=frozen({version:VERSION,id:ID,bridgeName:BRIDGE_NAME,queryKey:QUERY_KEY,queryValue:QUERY_VALUE,install});
  Object.defineProperty(global,'EVERSTEAD_PHASE24L_FELLOW_EXP_QA_RUNTIME',{configurable:false,enumerable:false,writable:false,value:runtime});
})(globalThis);

/*
Integration template (documentation only; execute this inside Everstead's main IIFE after the Phase 24L-B1 UI install and before bootstrap):

const PHASE_24L_B1_QA_RUNTIME=globalThis.EVERSTEAD_PHASE24L_FELLOW_EXP_QA_RUNTIME;
if(!PHASE_24L_B1_QA_RUNTIME||PHASE_24L_B1_QA_RUNTIME.version!==1)throw new Error('The Everstead Phase 24L-B1 QA runtime is unavailable or incompatible');
const PHASE_24L_B1_QA_INSTALL=PHASE_24L_B1_QA_RUNTIME.install(Object.freeze({
  version:1,
  root:window,
  runtime:()=>Object.freeze({
    qa:RUNTIME_QA,
    selectedStorage:STORAGE_SOURCE,
    nativeStorage:NATIVE_STORAGE,
    selectedStorageSupplied:HAS_STORAGE_ADAPTER||Boolean(PERSISTENCE_TEST?.storage)
  }),
  state:Object.freeze({
    get:()=>S,
    persistedRaw:()=>PERSISTED_RAW,
    adopt:(raw,state)=>phase24lAdopt(raw,state)
  }),
  api:Object.freeze({
    engine:PHASE_24L_B1,
    fellowDefs:FELLOW_DEFS,
    companionDefs:COMPANION_DEFS,
    levelCap:FELLOW_CONFIG.levelCap,
    activationSource:PHASE_24L_B1_ACTIVATION_SOURCE,
    spendSource:PHASE_24L_B1_SPEND_SOURCE,
    snapshot:phase24lQaSnapshot,
    validateState:phase24lValidate,
    resetFresh:phase24lQaResetDirectFresh,
    reload:phase24lQaReload,
    roundTripImport:phase24lQaRoundTripImport,
    recoverInterrupted:phase24lQaRecoverInterrupted,
    roundTripRollback:phase24lQaRoundTripRollback,
    readSaveSnapshot:phase24lSaveRead,
    writeSaveSnapshot:phase24lQaWriteSnapshot,
    readSlots:phase24lReadSlots,
    render,
    runtimeNow,
    levelForExp:fellowLevelForExp,
    thresholdForLevel:fellowExpThreshold,
    isFellowAvailable:(state,id)=>phaseElevenGFellowAvailable(id,state),
    actualState:phase24lB1ActualState,
    engineOptions:state=>phase24lB1EngineOptions(state),
    foundationOptions:state=>phase24lValidationContext(state,phase24lReadSlots('phase24l-b1-qa-foundation-options')),
    activate:phase24lB1Activate,
    mutatePersisted,
    campaignPreview:id=>campaignPreview(id,S),
    runCampaign:(id,options)=>runFellowCampaignV2(id,options),
    queueOffer:phaseThirteenQueueOfferInState,
    claimsState:state=>phaseFifteenState(state)||state.rewardClaims,
    claimReward:(offerId,options)=>phaseTwelveClaimReward(offerId,options),
    makeStagingEnvelope:(state,activeRaw,source)=>stagingEnvelope(state,activeRaw,source),
    writeStaging:raw=>storageSet(STAGING_KEY,raw,'phase24l-b1-qa-interrupted-staging'),
    boot:options=>phase24lQaBoot(options),
    successfulWrites:from=>phase23QaSuccessfulStorageWrites(from),
    logLength:()=>PERSISTENCE_LOG.length
  })
}));
if(!PHASE_24L_B1_QA_INSTALL?.ok||PHASE_24L_B1_QA_INSTALL.id!=='everstead.phase24l.fellow-exp-qa-runtime.v1')throw new Error('The Everstead Phase 24L-B1 QA bridge did not install safely');

Load this file once, immediately before the main inline script:
<script src="src/phase24l-fellow-exp-qa.js?v=phase24l-b1-v1"></script>
*/
