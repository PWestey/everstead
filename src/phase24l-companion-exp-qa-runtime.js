/* Everstead Phase 24L-C1 · query-scoped Companion EXP release bridge. */
(function installEversteadPhaseTwentyFourLCompanionExpQaRuntime(global){
  'use strict';

  const VERSION=1;
  const ID='everstead.phase24l.companion-exp-qa-runtime.v1';
  const BRIDGE_NAME='__EVERSTEAD_PHASE_24L_C1_QA__';
  const QUERY_KEY='phase24l-companion-exp-qa';
  const QUERY_VALUE='1';
  const BRIDGE_VERSION='phase-24l-c1-companion-exp-qa-v1';
  const POLICY_ID='everstead.exp-wallet.phase-24l.v3';
  const TOKEN=/^[A-Za-z0-9._:/-]{1,256}$/;
  const HASH=/^[0-9a-f]{64}$/;

  const FIXTURES=new Set([
    'fresh-v2',
    'established-v2',
    'pending-tower-v2',
    'campaign-ready-v2',
    'tower-ready-v2',
    'manual-claim-ready-v2',
    'mixed-claim-ready-v2',
    'assigned-partial-v2'
  ]);
  const MODES=new Set(['x1','x10','max']);
  const CAMPAIGN_MODES=new Set(['first-clear','replay']);
  const CLAIM_MODES=new Set(['claim','replay']);
  const MULTI_CLIENT_KINDS=new Set(['same-credit','same-spend']);
  const TUTORIAL_ACTIONS=new Set(['skip','replay','complete']);
  const TUTORIAL_IDS=new Set([
    'tutorial.phase-24l-c1.companion-exp-earned.v1',
    'tutorial.phase-24l-c1.companion-exp-spent.v1'
  ]);
  const REFUSALS=new Set([
    'duplicate-credit',
    'duplicate-campaign-credit',
    'duplicate-tower-clear-credit',
    'duplicate-tower-idle-claim',
    'duplicate-manual-claim',
    'stale-spend',
    'duplicate-spend',
    'insufficient-wallet',
    'at-level-cap',
    'companion-unavailable',
    'unsafe-credit-overflow',
    'malformed-bps',
    'corrupt-ledger',
    'locked-future-gate'
  ]);

  const clone=value=>value===undefined?null:JSON.parse(JSON.stringify(value));
  const plain=value=>Boolean(value)&&typeof value==='object'&&!Array.isArray(value)&&(Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
  const safe=value=>Number.isSafeInteger(value)&&value>=0;
  const frozen=value=>Object.freeze(value);
  const fail=reason=>{const error=new Error(reason);error.code=reason;throw error};

  function queryAllowed(root=global){
    try{
      const params=new URLSearchParams(root.location.search),qa=params.getAll('qa'),scope=params.getAll(QUERY_KEY);
      return qa.length===1&&qa[0]===QUERY_VALUE&&scope.length===1&&scope[0]===QUERY_VALUE;
    }catch{return false}
  }

  function validateJsonInput(value,path='input',seen=new Set()){
    if(value===null||typeof value==='string'||typeof value==='boolean')return;
    if(typeof value==='number'){
      if(!Number.isFinite(value))fail(`${path}-must-be-finite`);
      return;
    }
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
      if(!descriptor||!Object.hasOwn(descriptor,'value')||descriptor.enumerable!==true)fail(`${path}.${key}-data-property-required`);
      validateJsonInput(descriptor.value,`${path}.${key}`,seen);
    }
    seen.delete(value);
  }

  function inputClone(value){validateJsonInput(value);return clone(value)}
  function requiredString(value,label,allowed=null){
    if(typeof value!=='string'||!value||!TOKEN.test(value)||allowed&&!allowed.has(value))fail(`invalid-${label}`);
    return value;
  }
  function requiredHash(value,label){if(typeof value!=='string'||!HASH.test(value))fail(`invalid-${label}`);return value}
  function requiredInteger(value,label,{positive=false,allowed=null}={}){
    if(!safe(value)||positive&&value===0||allowed&&!allowed.has(value))fail(`invalid-${label}`);
    return value;
  }
  function exactPayload(value,allowed,required=allowed){
    const input=inputClone(value);
    if(!plain(input)||Object.keys(input).some(key=>!allowed.includes(key))||required.some(key=>!Object.hasOwn(input,key)))fail('invalid-action-payload');
    return input;
  }

  function validateAdapter(adapter){
    if(!plain(adapter)||adapter.version!==1||!adapter.root||typeof adapter.runtime!=='function'||!plain(adapter.api))return false;
    const methods=[
      'snapshot','validate','wallet','companion','preview','tutorials','projection',
      'reset','activate','credit','campaign','towerClear','towerSettle','towerClaim',
      'manualClaim','mixedClaim','spend','reload','roundTripImport','roundTripPrevious',
      'safeResetRecovery','multiClient','tutorial','probeRefusal','foldLedger',
      'successfulWrites','logLength'
    ];
    const engine=adapter.api.engine;
    return methods.every(name=>typeof adapter.api[name]==='function')&&engine?.version===1&&engine?.rootVersion===3&&engine?.policyId===POLICY_ID;
  }

  function install(adapter){
    if(!validateAdapter(adapter))return frozen({ok:false,reason:'adapter'});
    const root=adapter.root,A=adapter.api;

    function runtimeAuthorized(){
      try{
        const context=adapter.runtime();
        if(!plain(context)||context.selectedStorageSupplied!==true||!context.selectedStorage||context.selectedStorage===context.nativeStorage)return false;
        const qa=context.qa;
        return Boolean(qa)&&typeof qa==='object'&&Object.hasOwn(qa,'allowDestructive')&&qa.allowDestructive===true&&Object.hasOwn(qa,'isolatedStorage')&&qa.isolatedStorage===true;
      }catch{return false}
    }
    function scopeAvailable(){return queryAllowed(root)&&runtimeAuthorized()}

    if(!scopeAvailable())return frozen({ok:true,id:ID,version:VERSION,enabled:false,bridgeInstalled:false,queryAllowed:queryAllowed(root),runtimeAuthorized:runtimeAuthorized()});
    if(Object.hasOwn(root,BRIDGE_NAME))return frozen({ok:false,reason:'bridge-name-occupied'});

    function writeCount(from){
      try{const count=A.successfulWrites(from);return safe(count)?count:0}catch{return 0}
    }
    function reasonOf(error,fallback){
      if(typeof error==='string'&&error)return error;
      return String(error?.code||error?.phase24lReason||error?.message||fallback);
    }
    function response(name,operation,{destructive=false}={}){
      let log=0;try{const value=A.logLength();if(safe(value))log=value}catch{}
      try{
        if(!queryAllowed(root))fail('qa-scope-unavailable');
        if(!runtimeAuthorized())fail(destructive?'destructive-qa-requires-explicit-isolated-non-native-storage':'qa-runtime-attestation-unavailable');
        const result=operation(),failureReason=plain(result)&&result.ok===false?reasonOf(result.reason||result.error,`${name}-refused`):null,copied=clone(result),writes=plain(copied)&&safe(copied.writes)?copied.writes:plain(copied)&&safe(copied.writeCount)?copied.writeCount:writeCount(log);
        if(plain(copied)){
          if(copied.ok===false)return{...copied,ok:false,reason:failureReason,writes};
          return{...copied,ok:true,writes};
        }
        if(copied===false||copied===null)return{ok:false,reason:`${name}-refused`,writes};
        return{ok:true,value:copied,writes};
      }catch(error){return{ok:false,reason:reasonOf(error,`${name}-failed`),writes:writeCount(log)}}
    }

    const read=frozen({
      snapshot:()=>response('snapshot',()=>A.snapshot()),
      validate:()=>response('validate',()=>A.validate()),
      wallet:()=>response('wallet',()=>A.wallet()),
      companion:id=>response('companion',()=>A.companion(requiredString(id,'companion-id'))),
      preview:(id,mode)=>response('preview',()=>A.preview(requiredString(id,'companion-id'),requiredString(mode,'spend-mode',MODES))),
      tutorials:()=>response('tutorials',()=>A.tutorials()),
      projection:()=>response('projection',()=>A.projection())
    });

    const destructive=frozen({
      reset:fixture=>response('reset',()=>A.reset(requiredString(fixture,'fixture',FIXTURES)),{destructive:true}),
      activate:()=>response('activate',()=>A.activate(),{destructive:true}),
      credit:value=>response('credit',()=>{
        const input=exactPayload(value,['sourceId','historicalTargetId','rawAmount','authoredBps','collectionBps'],['sourceId','historicalTargetId','rawAmount','authoredBps']);
        requiredString(input.sourceId,'source-id');
        requiredString(input.historicalTargetId,'historical-target');
        requiredInteger(input.rawAmount,'raw-amount',{positive:true});
        requiredInteger(input.authoredBps,'authored-bps');
        if(!Object.hasOwn(input,'collectionBps'))input.collectionBps=0;
        requiredInteger(input.collectionBps,'collection-bps');
        return A.credit(input);
      },{destructive:true}),
      campaign:value=>response('campaign',()=>{
        const input=exactPayload(value,['mode']);
        input.mode=requiredString(input.mode,'campaign-mode',CAMPAIGN_MODES);
        return A.campaign(input);
      },{destructive:true}),
      towerClear:()=>response('tower-clear',()=>A.towerClear(),{destructive:true}),
      towerSettle:value=>response('tower-settle',()=>{
        const input=exactPayload(value,['elapsedMs']);
        requiredInteger(input.elapsedMs,'elapsed-ms',{positive:true});
        return A.towerSettle(input);
      },{destructive:true}),
      towerClaim:()=>response('tower-claim',()=>A.towerClaim(),{destructive:true}),
      manualClaim:value=>response('manual-claim',()=>{
        const input=exactPayload(value,['mode']);
        input.mode=requiredString(input.mode,'claim-mode',CLAIM_MODES);
        return A.manualClaim(input);
      },{destructive:true}),
      mixedClaim:value=>response('mixed-claim',()=>{
        const input=exactPayload(value,['mode']);
        input.mode=requiredString(input.mode,'claim-mode',CLAIM_MODES);
        return A.mixedClaim(input);
      },{destructive:true}),
      spend:value=>response('spend',()=>{
        const input=exactPayload(value,['companionId','mode','expectedIdentity']);
        input.companionId=requiredString(input.companionId,'companion-id');
        input.mode=requiredString(input.mode,'spend-mode',MODES);
        input.expectedIdentity=requiredHash(input.expectedIdentity,'expected-identity');
        return A.spend(input);
      },{destructive:true}),
      reload:()=>response('reload',()=>A.reload(),{destructive:true}),
      roundTripImport:version=>response('round-trip-import',()=>A.roundTripImport(requiredInteger(Number(version),'format-version',{positive:true,allowed:new Set([1,2,3,4])})),{destructive:true}),
      roundTripPrevious:()=>response('round-trip-previous',()=>A.roundTripPrevious(),{destructive:true}),
      safeResetRecovery:()=>response('safe-reset-recovery',()=>A.safeResetRecovery(),{destructive:true}),
      multiClient:kind=>response('multi-client',()=>A.multiClient(requiredString(kind,'multi-client-kind',MULTI_CLIENT_KINDS)),{destructive:true}),
      tutorial:(action,id)=>response('tutorial',()=>A.tutorial(requiredString(action,'tutorial-action',TUTORIAL_ACTIONS),requiredString(id,'tutorial-id',TUTORIAL_IDS)),{destructive:true}),
      probeRefusal:kind=>response('probe-refusal',()=>A.probeRefusal(requiredString(kind,'refusal-kind',REFUSALS)),{destructive:true}),
      foldLedger:()=>response('fold-ledger',()=>A.foldLedger(),{destructive:true})
    });

    const bridge=frozen({version:BRIDGE_VERSION,read,destructive});
    Object.defineProperty(root,BRIDGE_NAME,{configurable:true,enumerable:false,get:()=>scopeAvailable()?bridge:undefined});
    return frozen({ok:true,id:ID,version:VERSION,enabled:true,bridgeInstalled:true});
  }

  const runtime=frozen({version:VERSION,id:ID,bridgeName:BRIDGE_NAME,queryKey:QUERY_KEY,queryValue:QUERY_VALUE,install});
  Object.defineProperty(global,'EVERSTEAD_PHASE24L_COMPANION_EXP_QA_RUNTIME',{configurable:false,enumerable:false,writable:false,value:runtime});
})(globalThis);
