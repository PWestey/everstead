/* Everstead Phase 23 · pure roster, migration, targeting, and art helpers. */
(function phaseTwentyThreeCompanionRuntime(global){
  'use strict';
  const catalog=global.EVERSTEAD_PHASE23_COMPANIONS;
  if(!catalog)throw new Error('Phase 23 Companion catalog must load first');
  const isObject=value=>Boolean(value)&&typeof value==='object'&&!Array.isArray(value);
  const clone=value=>JSON.parse(JSON.stringify(value));
  const defaultCompanion=()=>({owned:true,exp:0,level:1,rarity:1,shards:0,assignedFellowId:null});
  const rewardMap=()=>Object.fromEntries(catalog.ids.map(id=>[id,0]));
  const exactKeys=(value,keys)=>isObject(value)&&Object.keys(value).length===keys.length&&keys.every(key=>Object.hasOwn(value,key));
  function mapLegacyCompanions(legacy){
    const companions=Object.fromEntries(catalog.ids.map(id=>[id,defaultCompanion()]));
    for(const [oldId,newId] of Object.entries(catalog.migrationMap)){
      const source=legacy?.[oldId];
      if(isObject(source))companions[newId]={
        owned:true,
        exp:Number.isSafeInteger(source.exp)&&source.exp>=0?source.exp:0,
        level:Number.isSafeInteger(source.level)&&source.level>=1?source.level:1,
        rarity:Number.isSafeInteger(source.rarity)&&source.rarity>=1?source.rarity:1,
        shards:Number.isSafeInteger(source.shards)&&source.shards>=0?source.shards:0,
        assignedFellowId:typeof source.assignedFellowId==='string'?source.assignedFellowId:null
      };
    }
    return companions;
  }
  function padRewardMap(map){
    const result=rewardMap();
    for(const [oldId,newId] of Object.entries(catalog.migrationMap))if(Number.isSafeInteger(map?.[oldId])&&map[oldId]>=0)result[newId]=map[oldId];
    return result;
  }
  function targetFor(stageOrdinal,postActivationRunOrdinal){
    const pool=catalog.campaignPools[stageOrdinal-1];
    if(!pool)return null;
    const ordinal=Number.isSafeInteger(postActivationRunOrdinal)&&postActivationRunOrdinal>=0?postActivationRunOrdinal:0;
    return pool[ordinal%pool.length];
  }
  function validateRoster(companions,{fellowIds=[],levelForExp=null}={}){
    if(!exactKeys(companions,catalog.ids))return false;
    const assignments=[];
    for(const id of catalog.ids){
      const item=companions[id];
      if(!exactKeys(item,['owned','exp','level','rarity','shards','assignedFellowId'])||item.owned!==true||!Number.isSafeInteger(item.exp)||item.exp<0||!Number.isSafeInteger(item.level)||item.level<1||!Number.isSafeInteger(item.rarity)||item.rarity<1||item.rarity>5||!Number.isSafeInteger(item.shards)||item.shards<0||!(item.assignedFellowId===null||fellowIds.includes(item.assignedFellowId)))return false;
      if(levelForExp&&item.level!==levelForExp(item.exp))return false;
      if(item.assignedFellowId)assignments.push(item.assignedFellowId);
    }
    return new Set(assignments).size===assignments.length;
  }
  function artCandidates(definition,detail){
    const preferred=detail?definition.art.portrait:definition.art.thumb;
    return Object.freeze([preferred]);
  }
  const qaVocabulary=Object.freeze({
    version:'phase-23-independent-qa-v1',
    reads:Object.freeze(['definitions','snapshot','derive','validate','raw','exportSave','scalingDefinitions','scalingReport','scalingProfileState','scalingPreviewSettlement']),
    destructive:Object.freeze(['resetFixture','reload','importFixture','advanceOffline','clearCampaign','clearTower','claimProgressReward','exerciseFellowExpeditionBoundary','tutorial','probeInvalid','simulateConcurrent'])
  });
  global.EVERSTEAD_PHASE23_RUNTIME=Object.freeze({
    version:1,catalog,clone,defaultCompanion,rewardMap,mapLegacyCompanions,padRewardMap,targetFor,validateRoster,artCandidates,qaVocabulary
  });
})(globalThis);
