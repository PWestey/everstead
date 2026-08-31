(function installEversteadPhaseTwelveFoundation(root){
  'use strict';

  const CONTRACT_VERSION=1;
  const CONFIG_ID='phase-12-foundation-v1';
  const ID_PATTERN=/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/;
  const RESERVED_SEGMENTS=new Set(['__proto__','prototype','constructor','toJSON']);
  const REWARD_KINDS=Object.freeze({
    gold:Object.freeze({target:'none'}),
    prosperity:Object.freeze({target:'none'}),
    gifts:Object.freeze({target:'none'}),
    relicStones:Object.freeze({target:'none'}),
    fellowExp:Object.freeze({target:'fellow'}),
    fellowShards:Object.freeze({target:'fellow'}),
    familyIntimacy:Object.freeze({target:'family'}),
    familyShards:Object.freeze({target:'family'}),
    companionExp:Object.freeze({target:'companion'}),
    companionShards:Object.freeze({target:'companion'}),
    might:Object.freeze({target:'none'}),
    mastery:Object.freeze({target:'none'})
  });

  function deepFreeze(value,seen=new Set()){
    if(value===null||typeof value!=='object'||seen.has(value))return value;
    seen.add(value);
    for(const key of Reflect.ownKeys(value))deepFreeze(value[key],seen);
    return Object.freeze(value);
  }

  function validId(value,prefix=null){
    if(typeof value!=='string'||!ID_PATTERN.test(value))return false;
    if(value.split(/[.-]/).some(segment=>RESERVED_SEGMENTS.has(segment)))return false;
    return prefix===null||value.startsWith(prefix+'.');
  }

  function copy(value){return JSON.parse(JSON.stringify(value))}
  function identity(value){
    const raw=typeof value==='string'?value:JSON.stringify(value);
    let hash=0x811c9dc5;
    for(let index=0;index<raw.length;index++){hash^=raw.charCodeAt(index);hash=Math.imul(hash,0x01000193)>>>0}
    return `fnv1a32:${raw.length}:${hash.toString(16).padStart(8,'0')}`;
  }
  function exactKeys(value,keys){
    return Boolean(value)&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===keys.length&&keys.every(key=>Object.hasOwn(value,key));
  }

  const DEFINITIONS=deepFreeze({
    features:[
      {id:'feature.first-covenant-objective',kind:'story',tutorialId:'tutorial.first-covenant-objective.intro',introductionRank:1,status:'reserved'},
      {id:'feature.dialogue-scenes',kind:'dialogue',tutorialId:'tutorial.dialogue-scenes.intro',introductionRank:2,status:'reserved'},
      {id:'feature.chronicle',kind:'chronicle',tutorialId:'tutorial.chronicle.intro',introductionRank:3,status:'reserved'},
      {id:'feature.legacy',kind:'legacy',tutorialId:'tutorial.legacy.intro',introductionRank:4,status:'reserved'},
      {id:'feature.manual-claims',kind:'claims',tutorialId:'tutorial.manual-claims.intro',introductionRank:5,status:'reserved'}
    ],
    stories:[
      {id:'story.first-covenant',chronicleId:'chronicle.first-covenant',status:'reserved',nodeIds:[]}
    ],
    chronicle:[
      {id:'chronicle.first-covenant',storyId:'story.first-covenant',status:'reserved',entryIds:[]}
    ],
    legacy:[
      {id:'legacy.achievement.oaths-kept',kind:'achievement',metricId:'metric.oaths-completed-after-activation',mode:'continuing'},
      {id:'legacy.achievement.gold-claimed',kind:'achievement',metricId:'metric.gold-claimed-after-activation',mode:'continuing'},
      {id:'legacy.feat.first-campaign-clear',kind:'feat',metricId:'metric.campaign-clears-after-activation',mode:'one-time'},
      {id:'legacy.feat.first-facility-claim',kind:'feat',metricId:'metric.facility-claims-after-activation',mode:'one-time'}
    ],
    tutorials:[
      {id:'tutorial.first-covenant-objective.intro',featureIds:['feature.first-covenant-objective'],skipAllowed:true,replayAllowed:true,rewardVersion:1,steps:[
        {id:'tutorial.first-covenant-objective.intro.open',minRank:1,minStageOrdinal:0}
      ]},
      {id:'tutorial.dialogue-scenes.intro',featureIds:['feature.dialogue-scenes'],skipAllowed:true,replayAllowed:true,rewardVersion:1,steps:[
        {id:'tutorial.dialogue-scenes.intro.open',minRank:2,minStageOrdinal:0}
      ]},
      {id:'tutorial.chronicle.intro',featureIds:['feature.chronicle'],skipAllowed:true,replayAllowed:true,rewardVersion:1,steps:[
        {id:'tutorial.chronicle.intro.open',minRank:3,minStageOrdinal:1}
      ]},
      {id:'tutorial.legacy.intro',featureIds:['feature.legacy'],skipAllowed:true,replayAllowed:true,rewardVersion:1,steps:[
        {id:'tutorial.legacy.intro.open',minRank:4,minStageOrdinal:1}
      ]},
      {id:'tutorial.manual-claims.intro',featureIds:['feature.manual-claims'],skipAllowed:true,replayAllowed:true,rewardVersion:1,steps:[
        {id:'tutorial.manual-claims.intro.open',minRank:5,minStageOrdinal:2}
      ]}
    ],
    facilities:[
      {id:'facility.command-center',activityId:'activity.petitions',mapAnchor:'upper-left-hall',targetPhase:20},
      {id:'facility.archives',activityId:'activity.research',mapAnchor:'upper-right-tower',targetPhase:20},
      {id:'facility.training-grounds',activityId:'activity.drills',mapAnchor:'lower-left-arena',targetPhase:20},
      {id:'facility.hearth',activityId:'activity.gatherings',mapAnchor:'lower-right-manor',targetPhase:20},
      {id:'facility.waystone',activityId:'activity.legacy-claims',mapAnchor:'central-crystal',targetPhase:15},
      {id:'facility.restaurant',activityId:'activity.restaurant-service',mapAnchor:'western-plaza',targetPhase:16},
      {id:'facility.apothecary',activityId:'activity.apothecary-cases',mapAnchor:'eastern-plaza',targetPhase:18},
      {id:'facility.schoolhouse',activityId:'activity.school-lessons',mapAnchor:'eastern-plaza',targetPhase:19},
      {id:'facility.market-workshop',activityId:'activity.orders-and-crafting',mapAnchor:'western-plaza',targetPhase:21},
      {id:'facility.gatehouse',activityId:'activity.caravans-and-road-events',mapAnchor:'lower-bridge',targetPhase:21},
      {id:'facility.gardens',activityId:'activity.cultivation',mapAnchor:'lower-right-gardens',targetPhase:21},
      {id:'facility.forge',activityId:'activity.relic-commissions',mapAnchor:'village-forge',targetPhase:21}
    ],
    opportunityKinds:[
      {id:'opportunity.story.reward',sourceKind:'story'},
      {id:'opportunity.legacy.reward',sourceKind:'legacy'},
      {id:'opportunity.facility.activity',sourceKind:'facility'}
    ],
    rewardKinds:Object.keys(REWARD_KINDS).map(kind=>({id:`reward.${kind.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase())}`,kind,target:REWARD_KINDS[kind].target,version:1}))
  });

  function definitionSnapshot(){return copy({contractVersion:CONTRACT_VERSION,configId:CONFIG_ID,definitions:DEFINITIONS})}

  function validateDefinitions(definitions=DEFINITIONS){
    const errors=[],allIds=[],featureTutorials=new Map(definitions.tutorials.map(item=>[item.id,item]));
    const add=(id,prefix,path)=>{if(!validId(id,prefix))errors.push(path+'.id');else allIds.push(id)};
    definitions.features.forEach((item,index)=>{add(item.id,null,`features.${index}`);if(!validId(item.tutorialId,'tutorial')||!featureTutorials.has(item.tutorialId))errors.push(`features.${index}.tutorialId`);if(!Number.isSafeInteger(item.introductionRank)||item.introductionRank<1||item.introductionRank>5)errors.push(`features.${index}.introductionRank`)});
    definitions.stories.forEach((item,index)=>{add(item.id,'story',`stories.${index}`);if(!validId(item.chronicleId,'chronicle'))errors.push(`stories.${index}.chronicleId`);if(!Array.isArray(item.nodeIds)||item.nodeIds.some(id=>!validId(id,'story')))errors.push(`stories.${index}.nodeIds`)});
    definitions.chronicle.forEach((item,index)=>{add(item.id,'chronicle',`chronicle.${index}`);if(!validId(item.storyId,'story'))errors.push(`chronicle.${index}.storyId`);if(!Array.isArray(item.entryIds)||item.entryIds.some(id=>!validId(id,'chronicle')))errors.push(`chronicle.${index}.entryIds`)});
    definitions.legacy.forEach((item,index)=>{add(item.id,item.kind==='achievement'?'legacy.achievement':'legacy.feat',`legacy.${index}`);if(!['achievement','feat'].includes(item.kind)||!validId(item.metricId,'metric')||!['continuing','one-time'].includes(item.mode))errors.push(`legacy.${index}.contract`)});
    definitions.tutorials.forEach((item,index)=>{add(item.id,'tutorial',`tutorials.${index}`);if(!Array.isArray(item.featureIds)||item.featureIds.length!==1||!definitions.features.some(feature=>feature.id===item.featureIds[0]))errors.push(`tutorials.${index}.featureIds`);if(item.skipAllowed!==true||item.replayAllowed!==true||!Number.isSafeInteger(item.rewardVersion)||item.rewardVersion<1)errors.push(`tutorials.${index}.policy`);if(!Array.isArray(item.steps)||!item.steps.length)errors.push(`tutorials.${index}.steps`);for(const [stepIndex,step] of (item.steps||[]).entries()){add(step.id,item.id,`tutorials.${index}.steps.${stepIndex}`);if(!Number.isSafeInteger(step.minRank)||step.minRank<1||!Number.isSafeInteger(step.minStageOrdinal)||step.minStageOrdinal<0)errors.push(`tutorials.${index}.steps.${stepIndex}.trigger`)}});
    definitions.facilities.forEach((item,index)=>{add(item.id,'facility',`facilities.${index}`);if(!validId(item.activityId,'activity')||typeof item.mapAnchor!=='string'||!item.mapAnchor||!Number.isSafeInteger(item.targetPhase)||item.targetPhase<15)errors.push(`facilities.${index}.contract`)});
    definitions.opportunityKinds.forEach((item,index)=>add(item.id,'opportunity',`opportunityKinds.${index}`));
    definitions.rewardKinds.forEach((item,index)=>{add(item.id,'reward',`rewardKinds.${index}`);if(!Object.hasOwn(REWARD_KINDS,item.kind)||REWARD_KINDS[item.kind].target!==item.target||!Number.isSafeInteger(item.version)||item.version<1)errors.push(`rewardKinds.${index}.contract`)});
    const duplicates=allIds.filter((id,index)=>allIds.indexOf(id)!==index);
    if(duplicates.length)errors.push('ids.duplicate:'+Array.from(new Set(duplicates)).join(','));
    return{ok:errors.length===0,errors};
  }

  function canonicalRewards(value,{fellowIds=[],familyIds=[],companionIds=[]}={}){
    if(!Array.isArray(value)||value.length===0)throw new TypeError('Reward bundle must be a non-empty array');
    const allowed={fellow:new Set(fellowIds),family:new Set(familyIds),companion:new Set(companionIds)},seen=new Set(),result=[];
    for(const entry of value){
      if(!exactKeys(entry,['kind','targetId','amount'])||!Object.hasOwn(REWARD_KINDS,entry.kind))throw new TypeError('Reward entry contract is invalid');
      if(!Number.isSafeInteger(entry.amount)||entry.amount<=0)throw new TypeError('Reward amount must be a positive safe integer');
      const targetType=REWARD_KINDS[entry.kind].target,targetId=entry.targetId;
      if(targetType==='none'?targetId!==null:typeof targetId!=='string'||!allowed[targetType].has(targetId))throw new TypeError('Reward target is invalid');
      const key=entry.kind+'\u0000'+String(targetId);if(seen.has(key))throw new TypeError('Reward bundle contains a duplicate target');seen.add(key);
      result.push({kind:entry.kind,targetId,amount:entry.amount});
    }
    result.sort((left,right)=>(left.kind+'\u0000'+String(left.targetId)).localeCompare(right.kind+'\u0000'+String(right.targetId)));
    return result;
  }

  function offerIdentity(saveId,offer){
    if(typeof saveId!=='string'||!saveId)return null;
    return identity(['phase-12-reward-offer-v1',saveId,offer.id,offer.sourceType,offer.sourceId,offer.offeredAt,offer.rewards]);
  }
  function createOffer(input,context){
    if(!exactKeys(input,['id','sourceType','sourceId','offeredAt','rewards'])||!validId(input.id,'reward.offer')||!DEFINITIONS.opportunityKinds.some(item=>item.id===input.sourceType)||!validId(input.sourceId)||!Number.isSafeInteger(input.offeredAt)||input.offeredAt<0)throw new TypeError('Reward offer contract is invalid');
    const offer={id:input.id,sourceType:input.sourceType,sourceId:input.sourceId,offeredAt:input.offeredAt,rewards:canonicalRewards(input.rewards,context.targets),identity:''};
    offer.identity=offerIdentity(context.saveId,offer);return offer;
  }
  function validateOffer(offer,context){
    try{if(!exactKeys(offer,['id','sourceType','sourceId','offeredAt','rewards','identity']))return false;const rebuilt=createOffer({id:offer.id,sourceType:offer.sourceType,sourceId:offer.sourceId,offeredAt:offer.offeredAt,rewards:offer.rewards},context);return JSON.stringify(rebuilt)===JSON.stringify(offer)}catch{return false}
  }
  function receiptIdentity(saveId,receipt){
    if(typeof saveId!=='string'||!saveId)return null;
    return identity(['phase-12-reward-receipt-v1',saveId,receipt.id,receipt.offerId,receipt.claimedAt,receipt.sequence,receipt.pendingIdentity,receipt.rewards]);
  }
  function createReceipt(offer,{saveId,claimedAt,sequence,targets}){
    if(!validateOffer(offer,{saveId,targets})||!Number.isSafeInteger(claimedAt)||claimedAt<offer.offeredAt||!Number.isSafeInteger(sequence)||sequence<1)throw new TypeError('Reward receipt context is invalid');
    const suffix=offer.id.slice('reward.offer.'.length),receipt={id:`reward.receipt.${suffix}.${sequence}`,offerId:offer.id,claimedAt,sequence,pendingIdentity:offer.identity,rewards:canonicalRewards(offer.rewards,targets),identity:''};
    if(!validId(receipt.id,'reward.receipt'))throw new TypeError('Derived reward receipt ID is invalid');
    receipt.identity=receiptIdentity(saveId,receipt);return receipt;
  }
  function validateReceipt(receipt,context){
    try{if(!exactKeys(receipt,['id','offerId','claimedAt','sequence','pendingIdentity','rewards','identity'])||!validId(receipt.id,'reward.receipt')||!validId(receipt.offerId,'reward.offer')||typeof receipt.pendingIdentity!=='string')return false;const normalized=canonicalRewards(receipt.rewards,context.targets);if(JSON.stringify(normalized)!==JSON.stringify(receipt.rewards))return false;return receipt.identity===receiptIdentity(context.saveId,receipt)}catch{return false}
  }

  function opportunityIdentity(saveId,opportunity){
    if(typeof saveId!=='string'||!saveId)return null;
    return identity(['phase-12-opportunity-v1',saveId,opportunity.id,opportunity.kindId,opportunity.facilityId,opportunity.sourceId,opportunity.createdAt,opportunity.sequence,opportunity.rewardOfferId]);
  }
  function createOpportunity(input,{saveId}){
    if(!exactKeys(input,['id','kindId','facilityId','sourceId','createdAt','sequence','rewardOfferId'])||!validId(input.id,'opportunity.instance')||!DEFINITIONS.opportunityKinds.some(item=>item.id===input.kindId)||!(input.facilityId===null||DEFINITIONS.facilities.some(item=>item.id===input.facilityId))||!validId(input.sourceId)||!Number.isSafeInteger(input.createdAt)||input.createdAt<0||!Number.isSafeInteger(input.sequence)||input.sequence<1||!(input.rewardOfferId===null||validId(input.rewardOfferId,'reward.offer')))throw new TypeError('Opportunity contract is invalid');
    if(input.kindId==='opportunity.facility.activity'&&input.facilityId===null)throw new TypeError('Facility opportunities require a Facility ID');
    const opportunity={...copy(input),identity:''};opportunity.identity=opportunityIdentity(saveId,opportunity);return opportunity;
  }
  function validateOpportunity(opportunity,{saveId}){
    try{if(!exactKeys(opportunity,['id','kindId','facilityId','sourceId','createdAt','sequence','rewardOfferId','identity']))return false;const rebuilt=createOpportunity({id:opportunity.id,kindId:opportunity.kindId,facilityId:opportunity.facilityId,sourceId:opportunity.sourceId,createdAt:opportunity.createdAt,sequence:opportunity.sequence,rewardOfferId:opportunity.rewardOfferId},{saveId});return JSON.stringify(rebuilt)===JSON.stringify(opportunity)}catch{return false}
  }

  function eligibleTutorialSteps(progress,{rank,stageOrdinal,availableFeatureIds=[]}){
    if(!Number.isSafeInteger(rank)||rank<1||!Number.isSafeInteger(stageOrdinal)||stageOrdinal<0)return[];
    const completed=new Set(progress?.completedStepIds||[]),seen=new Set(progress?.seenStepIds||[]),available=new Set(availableFeatureIds),eligible=[];
    for(const tutorial of DEFINITIONS.tutorials){
      if(!tutorial.featureIds.some(id=>available.has(id)))continue;
      for(const step of tutorial.steps)if(rank>=step.minRank&&stageOrdinal>=step.minStageOrdinal&&!completed.has(step.id)&&!seen.has(step.id)){eligible.push({tutorialId:tutorial.id,stepId:step.id});break}
    }
    return eligible;
  }

  const api=deepFreeze({
    contractVersion:CONTRACT_VERSION,
    configId:CONFIG_ID,
    idPattern:ID_PATTERN.source,
    rewardKinds:REWARD_KINDS,
    definitions:DEFINITIONS,
    definitionSnapshot,
    validateDefinitions,
    validId,
    identity,
    canonicalRewards,
    offerIdentity,
    createOffer,
    validateOffer,
    receiptIdentity,
    createReceipt,
    validateReceipt,
    opportunityIdentity,
    createOpportunity,
    validateOpportunity,
    eligibleTutorialSteps
  });
  Object.defineProperty(root,'EVERSTEAD_PHASE12_FOUNDATION',{configurable:false,enumerable:false,writable:false,value:api});
})(globalThis);
