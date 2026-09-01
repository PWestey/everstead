(function(root){
  'use strict';

  const CONFIG_ID='phase-16-restaurant-v1';
  const DEFINITION_SET_ID='definition-set.phase-16-restaurant.v1';
  const TUTORIAL_REGISTRY_ID='tutorial-registry.phase-16.v1';
  const ACTIVATION_ID='phase-16-restaurant-activation';
  const POLICY_ID='economy-policy.restaurant.candidate-v1';
  const POLICY_VERSION=1;
  const REWARD_TABLE_ID='reward-table.restaurant.structural-rate.candidate-v2';
  const REWARD_TABLE_VERSION=2;
  const REWARD_TABLE_IDENTITY='fnv1a32:762d2972';
  const FACILITY_ID='facility.restaurant';
  const ACTIVITY_ID='activity.restaurant-service';
  const OPPORTUNITY_ID='opportunity.facility.restaurant.customer';
  const MAP_ANCHOR='western-plaza-restaurant';
  const DISCOVERY_CONTENT_ID='story.book1.chapter1.village-toll.resolution';
  const CAPABILITY_ID='capability.restaurant-service.v1';
  const OPENING_CONTENT_ID='facility.restaurant.opening-service';
  const ROUTE_EVENT_ID='story.book1.restaurant.route-envoy-ready';
  const ROUTE_SOURCE_SCENE_ID='story.book1.interlude.open-table';
  const ROUTE_VISITOR_ID='restaurant.visitor.route-envoy.01';
  const ROUTE_CHRONICLE_ID='chronicle.restaurant.route-envoy.01';
  const OFFLINE_CAP_MS=86400000;
  const INHERITED_PHASE12_ACTIVATION_ID='migration.phase12.claim-ledger';
  const SUPPORTED_STOCK_MODES=Object.freeze(['prepare-batch','pre-existing-stock']);

  const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.freeze(value);for(const child of Object.values(value))freeze(child)}return value};
  const copy=value=>JSON.parse(JSON.stringify(value));
  const safe=value=>Number.isSafeInteger(value)&&value>=0;
  const fnvIdentity=value=>{let hash=2166136261;for(const character of JSON.stringify(value)){hash^=character.charCodeAt(0);hash=Math.imul(hash,16777619)}return`fnv1a32:${(hash>>>0).toString(16).padStart(8,'0')}`};
  const checkedAdd=(left,right)=>{if(!safe(left)||!safe(right)||left>Number.MAX_SAFE_INTEGER-right)throw new RangeError('Safe integer addition overflow');return left+right};
  const validId=value=>typeof value==='string'&&/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value);

  const CUSTOMERS=freeze([
    {id:'restaurant.customer.road-worker',name:'Road Worker',named:false,weight:60,preferenceWeights:{'restaurant.preference.warming':60,'restaurant.preference.quick':40}},
    {id:'restaurant.customer.archive-courier',name:'Archive Courier',named:false,weight:40,preferenceWeights:{'restaurant.preference.quick':50,'restaurant.preference.light':50}},
    {id:'restaurant.customer.route-envoy',name:'Route Envoy',named:true,weight:0,preferenceWeights:{'restaurant.preference.warming':50,'restaurant.preference.light':50}}
  ]);
  const PREFERENCES=freeze([
    {id:'restaurant.preference.warming',name:'Warming',copy:'They want something warming after the road.'},
    {id:'restaurant.preference.quick',name:'Quick',copy:'They need a quick meal before moving on.'},
    {id:'restaurant.preference.light',name:'Light',copy:'They would prefer something light.'}
  ]);
  const RECIPES=freeze([
    {id:'restaurant.recipe.hearth-stew',name:'Hearth Stew',unlockReputationLevel:1,preparationDurationMs:120000,batchSize:2,stockCapacity:6,inputPolicyId:'input-policy.restaurant.station-time-only.candidate-v1',stationIds:['restaurant.station.hearth'],matchedPreferenceIds:['restaurant.preference.warming'],partialPreferenceIds:['restaurant.preference.quick']},
    {id:'restaurant.recipe.garden-flatbread',name:'Garden Flatbread',unlockReputationLevel:2,preparationDurationMs:90000,batchSize:3,stockCapacity:9,inputPolicyId:'input-policy.restaurant.station-time-only.candidate-v1',stationIds:['restaurant.station.hearth','restaurant.station.prep-table'],matchedPreferenceIds:['restaurant.preference.light'],partialPreferenceIds:['restaurant.preference.quick']},
    {id:'restaurant.recipe.roadside-tea',name:'Roadside Tea',unlockReputationLevel:3,preparationDurationMs:60000,batchSize:4,stockCapacity:12,inputPolicyId:'input-policy.restaurant.station-time-only.candidate-v1',stationIds:['restaurant.station.prep-table'],matchedPreferenceIds:['restaurant.preference.quick'],partialPreferenceIds:['restaurant.preference.light','restaurant.preference.warming']}
  ]);
  const STATIONS=freeze([
    {id:'restaurant.station.hearth',name:'Hearth',unlockReputationLevel:1,slotCapacity:1},
    {id:'restaurant.station.prep-table',name:'Prep Table',unlockReputationLevel:2,slotCapacity:1}
  ]);

  const TUTORIALS=freeze([
    {id:'tutorial.restaurant.first-customer',trigger:{kind:'facilityFirstVisit',safeSurface:'facility.restaurant'},speaker:{primaryActorId:'family.tifa',fallbackActorIds:['family.tamsin','fellow.deadpool']},title:'Welcome to the Restaurant',steps:[['customer','Customers wait here without expiring.'],['preference','Read each preference before choosing a dish.'],['choose-dish','Choose an unlocked recipe and a compatible station.'],['serve','Prepare, transfer, serve, then claim the result yourself.']]},
    {id:'tutorial.facility.opportunities.banking',trigger:{kind:'facilityFirstOpportunityReady',safeSurface:'facility.restaurant'},speaker:{primaryActorId:'family.tamsin',fallbackActorIds:['fellow.lyra']},title:'Customers can wait',steps:[['ready-opportunities','Customer opportunities bank while time passes.'],['bank-cap','The Restaurant can hold twelve waiting customers.'],['no-expiry','Banked customers do not expire or reset at midnight.'],['passive-baseline','Village Gold continues underneath Restaurant activity.']]},
    {id:'tutorial.restaurant.first-claim',trigger:{kind:'facilityFirstClaimReady',safeSurface:'facility.restaurant'},speaker:{primaryActorId:'family.tifa',fallbackActorIds:['family.tamsin']},title:'Review the service result',steps:[['sales','The result shows the exact sale before payment.'],['tips','A good preference match can add a tip.'],['reputation','Reputation and mastery are local Restaurant progress.'],['claim','Only Claim applies the listed effects.']]},
    {id:'tutorial.facility.claim.first-ready',trigger:{kind:'facilityFirstClaimReady',safeSurface:'facility.restaurant'},speaker:{primaryActorId:'family.tamsin',fallbackActorIds:['family.isolde']},title:'Facility claims are manual',steps:[['result-ready','A completed activity becomes a ready result.'],['claim','Nothing is credited until you choose Claim.'],['local-progress','Global and local effects commit together.'],['receipt','A durable receipt prevents replay.']]},
    {id:'tutorial.restaurant.recipes-and-stations',trigger:{kind:'facilityLevelCrossed',level:2,threshold:12,safeSurface:'facility.restaurant'},speaker:{primaryActorId:'family.tifa',fallbackActorIds:['family.tamsin']},title:'More recipes and stations',steps:[['recipe-mastery','Serving a recipe builds its own mastery.'],['station','Recipes list every compatible station.'],['local-stock','Prepared stock stays inside the Restaurant.'],['unlock-preview','Reputation opens the next recipe and station.']]},
    {id:'tutorial.restaurant.reputation',trigger:{kind:'facilityLevelCrossed',level:3,threshold:36,safeSurface:'facility.restaurant'},speaker:{primaryActorId:'family.jaina',fallbackActorIds:['family.tifa']},title:'Reputation Level 3',steps:[['reputation-level','Reputation Level 3 marks an established table.'],['unlock-preview','New routes and visitors may now reach the Village.'],['local-only','Reputation is local progress, not a spendable currency.']]},
    {id:'tutorial.restaurant.named-visitors',trigger:{kind:'facilityNamedVisitorFirstReady',safeSurface:'facility.restaurant'},speaker:{primaryActorId:'family.jaina',fallbackActorIds:['family.tifa']},title:'A named visitor',steps:[['named-guest','Named visitors are authored guests with stable identities.'],['story-hook','Their Chronicle hook begins only after a committed claim.'],['banked-until-served','They remain banked until you decide to serve them.']]}
  ].map(item=>({...item,definitionVersion:1,blocking:false,skippable:true,replayable:true,loggable:true,reward:null,stepIds:item.steps.map(([suffix])=>`${item.id}.${suffix}`),stepCopy:Object.fromEntries(item.steps.map(([suffix,copyText])=>[`${item.id}.${suffix}`,copyText]))})));

  const CAST_HOOKS=freeze([
    {actorId:'fellow.deadpool',restaurantHookIds:['dialogue.facility.restaurant.deadpool.named-visitor','dialogue.facility.restaurant.deadpool.result-comment'],deferredHookIds:[]},
    {actorId:'fellow.star-lord',restaurantHookIds:['dialogue.facility.restaurant.star-lord.named-visitor'],deferredHookIds:['dialogue.facility.gatehouse.star-lord.result-comment']},
    {actorId:'fellow.spider-man',restaurantHookIds:['dialogue.facility.restaurant.spider-man.ambient'],deferredHookIds:['dialogue.facility.schoolhouse.spider-man.named-visitor']},
    {actorId:'family.tamsin',restaurantHookIds:['dialogue.facility.restaurant.tamsin.banking-guide','dialogue.facility.restaurant.tamsin.ambient'],deferredHookIds:[]},
    {actorId:'family.jaina',restaurantHookIds:['dialogue.facility.restaurant.jaina.named-route-visitor','dialogue.facility.restaurant.jaina.reputation-guide'],deferredHookIds:[]},
    {actorId:'family.tifa',restaurantHookIds:['dialogue.facility.restaurant.tifa.service-guide','dialogue.facility.restaurant.tifa.claim-acknowledgement'],deferredHookIds:[]},
    {actorId:'family.misty',restaurantHookIds:['dialogue.facility.restaurant.misty.ambient'],deferredHookIds:['dialogue.facility.gatehouse.misty.activity-presenter']}
  ].map(item=>({...item,registered:true,mechanicalCopyIndependent:true})));
  const CAST_POLICY=freeze({lockedFellowsExcluded:true,artFallbackOrder:['approved-transparent-cutout','approved-framed-treatment','attributed-text-only'],forbiddenPresentation:'unframed-full-background-profile-overlay'});

  // Approved fixed integers. Runtime selects a captured band; it never recalculates these values from a ratio.
  const REWARD_ROWS=freeze([[0,29209,889,1041,1270,0,127,254],[29210,33590,1022,1198,1460,0,146,292],[33591,38629,1176,1377,1680,0,168,336],[38630,44424,1352,1584,1932,0,193,386],[44425,51087,1555,1821,2221,0,222,444],[51088,58751,1788,2095,2554,0,255,511],[58752,67564,2056,2409,2938,0,294,588],[67565,77698,2365,2770,3378,0,338,676],[77699,89353,2719,3186,3885,0,388,777],[89354,102756,3127,3664,4468,0,447,894],[102757,118170,3596,4213,5138,0,514,1028],[118171,135895,4136,4845,5909,0,591,1182],[135896,156280,4756,5572,6795,0,679,1359],[156281,179722,5470,6408,7814,0,781,1563],[179723,206680,6290,7369,8986,0,899,1797],[206681,237683,7234,8474,10334,0,1033,2067],[237684,273335,8319,9745,11884,0,1188,2377],[273336,314336,9567,11207,13667,0,1367,2733],[314337,361486,11002,12888,15717,0,1572,3143],[361487,415709,12652,14821,18074,0,1807,3615],[415710,478066,14550,17044,20786,0,2079,4157],[478067,549776,16732,19601,23903,0,2390,4781],[549777,632242,19242,22541,27489,0,2749,5498],[632243,727078,22129,25922,31612,0,3161,6322],[727079,836140,25448,29810,36354,0,3635,7271],[836141,961562,29265,34282,41807,0,4181,8361],[961563,1105796,33655,39424,48078,0,4808,9616],[1105797,1271666,38703,45338,55290,0,5529,11058],[1271667,1462416,44508,52138,63583,0,6358,12717],[1462417,1681778,51185,59959,73121,0,7312,14624],[1681779,1934045,58862,68953,84089,0,8409,16818],[1934046,2224152,67692,79296,96702,0,9670,19340],[2224153,2557775,77845,91190,111208,0,11121,22242],[2557776,2941441,89522,104869,127889,0,12789,25578],[2941442,3382657,102950,120599,147072,0,14707,29414],[3382658,3890056,118393,138689,169133,0,16913,33827],[3890057,4473565,136152,159492,194503,0,19450,38901],[4473566,5144599,156575,183416,223678,0,22368,44736],[5144600,5916289,180061,210929,257230,0,25723,51446],[5916290,6803733,207070,242568,295814,0,29581,59163],[6803734,7824293,238131,278953,340187,0,34019,68037],[7824294,8997937,273850,320796,391215,0,39121,78243],[8997938,10347628,314928,368915,449897,0,44990,89979],[10347629,11899772,362167,424253,517381,0,51738,103476],[11899773,13684738,416492,487891,594989,0,59499,118998],[13684739,15737449,478966,561074,684237,0,68424,136847],[15737450,18098067,550811,645235,786872,0,78687,157374],[18098068,20812777,633432,742021,904903,0,90490,180981],[20812778,23934694,728447,853324,1040639,0,104064,208128],[23934695,27524898,837714,981322,1196735,0,119673,239347],[27524899,31653633,963371,1128521,1376245,0,137624,275249],[31653634,null,1107877,1297799,1582682,0,158268,316536]].map((row,index)=>({id:`restaurant.band.level-${String(index+1).padStart(2,'0')}`,minimumStructuralGoldPerHour:row[0],maximumStructuralGoldPerHour:row[1],baseSaleGoldByCustomerId:{'restaurant.customer.road-worker':row[2],'restaurant.customer.archive-courier':row[3],'restaurant.customer.route-envoy':row[4]},tipGoldByMatch:{basic:row[5],partial:row[6],matched:row[7]}})));

  const POLICY=freeze({
    id:POLICY_ID,version:POLICY_VERSION,approved:true,productionEnabled:true,publicReleaseAllowed:false,
    intervalMs:1800000,bankCapacity:12,unattendedTargetMs:21600000,offlineCapMs:OFFLINE_CAP_MS,
    customerWeights:{'restaurant.customer.road-worker':60,'restaurant.customer.archive-courier':40,'restaurant.customer.route-envoy':0},
    baseSaleByCustomerId:copy(REWARD_ROWS[0].baseSaleGoldByCustomerId),tipMultiplierByMatch:{basic:0,partial:'captured-fixed-row',matched:'captured-fixed-row'},
    reputationByMatch:{basic:1,partial:2,matched:3},recipeMasteryByMatch:{basic:1,partial:2,matched:3},reputationThresholds:{1:0,2:12,3:36},recipeMasteryThresholds:{1:0,2:12,3:36},
    stockMode:'prepare-batch',recipePreparationDurationMs:Object.fromEntries(RECIPES.map(item=>[item.id,item.preparationDurationMs])),preparationBatchSize:Object.fromEntries(RECIPES.map(item=>[item.id,item.batchSize])),recipeStockCapacity:Object.fromEntries(RECIPES.map(item=>[item.id,item.stockCapacity])),stationSlotCapacity:Object.fromEntries(STATIONS.map(item=>[item.id,item.slotCapacity])),manualTransferRequired:true,
    noGlobalInputCurrency:true,customersExpire:false,stockExpires:false,manualClaim:true,activeProfitTargetShare:{numerator:913,denominator:10000},approvedShareBandBasisPoints:{minimum:794,maximum:913},headroomYears:5,simulationApproval:'approved-for-private-integration',rewardTableId:REWARD_TABLE_ID,rewardTableVersion:REWARD_TABLE_VERSION
  });

  const SIMULATION_PROFILES=freeze([
    ['fresh',25400,853],['midgame',67565,888],['established',361487,913],['highly-active',2941442,913],['mostly-idle',31653634,913]
  ]);

  function stableUnit(saveIdentity,ordinal,salt){const text=`${saveIdentity}\u001f${ordinal}\u001f${salt}`;let hash=2166136261;for(let index=0;index<text.length;index++){hash^=text.charCodeAt(index);hash=Math.imul(hash,16777619)}return(hash>>>0)/4294967296}
  function weightedChoice(entries,unit){const total=entries.reduce((sum,item)=>sum+item.weight,0);if(!safe(total)||total<=0)throw new TypeError('Weighted selection is invalid');let cursor=Math.min(.9999999999999999,Math.max(0,unit))*total;for(const item of entries){cursor-=item.weight;if(cursor<0)return item.id}return entries.at(-1).id}
  function selectCustomer(saveIdentity,ordinal,{named=false}={}){if(typeof saveIdentity!=='string'||!Number.isSafeInteger(ordinal)||ordinal<1)throw new TypeError('Customer selection input is invalid');if(named)return'restaurant.customer.route-envoy';return weightedChoice(CUSTOMERS.filter(item=>!item.named).map(item=>({id:item.id,weight:item.weight})),stableUnit(saveIdentity,ordinal,'restaurant-customer-v1'))}
  function selectPreference(saveIdentity,ordinal,customerId){const customer=CUSTOMERS.find(item=>item.id===customerId);if(!customer||typeof saveIdentity!=='string'||!Number.isSafeInteger(ordinal)||ordinal<1)throw new TypeError('Preference selection input is invalid');return weightedChoice(Object.entries(customer.preferenceWeights).map(([id,weight])=>({id,weight})),stableUnit(saveIdentity,ordinal,'restaurant-preference-v1'))}
  function rewardBand(structuralGoldPerHour){if(!safe(structuralGoldPerHour))throw new TypeError('Structural production rate is invalid');const row=REWARD_ROWS.find(item=>structuralGoldPerHour>=item.minimumStructuralGoldPerHour&&(item.maximumStructuralGoldPerHour===null||structuralGoldPerHour<=item.maximumStructuralGoldPerHour));if(!row)throw new RangeError('No approved Restaurant reward band');return copy(row)}
  function resultFor(preferenceId,recipeId){const recipe=RECIPES.find(item=>item.id===recipeId);if(!recipe||!PREFERENCES.some(item=>item.id===preferenceId))throw new TypeError('Restaurant match input is invalid');return recipe.matchedPreferenceIds.includes(preferenceId)?'matched':recipe.partialPreferenceIds.includes(preferenceId)?'partial':'basic'}
  function reputationLevel(value){if(!safe(value))throw new TypeError('Reputation is invalid');return value>=36?3:value>=12?2:1}
  function masteryLevel(value){return reputationLevel(value)}
  function recipeAvailable(recipeId,reputation){const recipe=RECIPES.find(item=>item.id===recipeId);return Boolean(recipe)&&reputationLevel(reputation)>=recipe.unlockReputationLevel}
  function stationAvailable(stationId,reputation){const station=STATIONS.find(item=>item.id===stationId);return Boolean(station)&&reputationLevel(reputation)>=station.unlockReputationLevel}
  function validateRecipeStation(recipeId,stationId,reputation){const recipe=RECIPES.find(item=>item.id===recipeId);return Boolean(recipe)&&recipeAvailable(recipeId,reputation)&&stationAvailable(stationId,reputation)&&recipe.stationIds.includes(stationId)}

  function planSettlement(input){
    const {cursorAt,carryMs,nextOrdinal,currentCount,now,intervalMs=POLICY.intervalMs,bankCapacity=POLICY.bankCapacity,elapsedCapMs=OFFLINE_CAP_MS}=input||{};
    if(!safe(cursorAt)||!safe(carryMs)||!safe(nextOrdinal)||!safe(currentCount)||!safe(now)||!Number.isSafeInteger(intervalMs)||intervalMs<=0||intervalMs>OFFLINE_CAP_MS||!Number.isSafeInteger(bankCapacity)||bankCapacity<=0||bankCapacity>POLICY.bankCapacity||currentCount>bankCapacity||carryMs>=intervalMs||!Number.isSafeInteger(elapsedCapMs)||elapsedCapMs<=0||elapsedCapMs>OFFLINE_CAP_MS)throw new TypeError('Restaurant settlement input is invalid');
    if(now<=cursorAt)return{elapsedMs:0,createdOrdinals:[],cursorAt,carryMs,saturated:currentCount>=bankCapacity,hiddenDebtMs:0};
    const elapsedMs=Math.min(now-cursorAt,elapsedCapMs),total=checkedAdd(carryMs,elapsedMs),whole=Math.floor(total/intervalMs),slots=bankCapacity-currentCount,created=Math.min(whole,slots);
    if(created>POLICY.bankCapacity||nextOrdinal>Number.MAX_SAFE_INTEGER-created)throw new RangeError('Restaurant settlement ordinal overflow');
    return{elapsedMs,createdOrdinals:Array.from({length:created},(_,index)=>checkedAdd(nextOrdinal,index+1)),cursorAt:now,carryMs:total%intervalMs,saturated:whole>=slots,hiddenDebtMs:0};
  }

  function planOutcome({customerId,preferenceId,recipeId,structuralGoldPerHour}){const row=rewardBand(structuralGoldPerHour),result=resultFor(preferenceId,recipeId),baseSale=row.baseSaleGoldByCustomerId[customerId],tip=row.tipGoldByMatch[result],reputation=POLICY.reputationByMatch[result],mastery=POLICY.recipeMasteryByMatch[result];if(![baseSale,tip,reputation,mastery].every(safe))throw new TypeError('Restaurant outcome is invalid');return{result,baseSaleGold:baseSale,tipGold:tip,totalGold:checkedAdd(baseSale,tip),reputationDelta:reputation,masteryDelta:mastery,rewardBandId:row.id,rewardTableId:REWARD_TABLE_ID,rewardTableVersion:REWARD_TABLE_VERSION}}
  function economyReport(){const simulations=[];for(const [profile,rate,basisPoints] of SIMULATION_PROFILES)for(const [horizon,hours] of [['short',24],['long',8760]]){const passiveGold=rate*hours,activeGold=Math.floor(passiveGold*basisPoints/(10000-basisPoints)),totalGold=passiveGold+activeGold;simulations.push({profile,horizon,passiveGold,activeGold,totalGold,activeShareBasisPoints:basisPoints,safeIntegerHeadroom:Number.isSafeInteger(totalGold)&&totalGold<Number.MAX_SAFE_INTEGER,passiveBaselinePreserved:true})}return{productionEnabled:true,accrualEnabled:true,serviceEnabled:true,approved:true,publicReleaseAllowed:false,policy:copy(POLICY),simulations,permanentMultiplierIntroduced:false,passiveIncomeReduced:false,newCurrencyIntroduced:false,debtPossible:false}}

  function validateDefinitions(){const errors=[],all=[FACILITY_ID,ACTIVITY_ID,OPPORTUNITY_ID,DISCOVERY_CONTENT_ID,CAPABILITY_ID,OPENING_CONTENT_ID,ROUTE_EVENT_ID,ROUTE_SOURCE_SCENE_ID,ROUTE_VISITOR_ID,ROUTE_CHRONICLE_ID,...CUSTOMERS.map(item=>item.id),...PREFERENCES.map(item=>item.id),...RECIPES.map(item=>item.id),...STATIONS.map(item=>item.id),...TUTORIALS.map(item=>item.id),...CAST_HOOKS.flatMap(item=>[item.actorId,...item.restaurantHookIds,...item.deferredHookIds])];if(all.some(item=>!validId(item)))errors.push('definitions.ids');if(new Set(CUSTOMERS.map(item=>item.id)).size!==3||new Set(PREFERENCES.map(item=>item.id)).size!==3||new Set(RECIPES.map(item=>item.id)).size!==3||new Set(STATIONS.map(item=>item.id)).size!==2)errors.push('definitions.content');if(TUTORIALS.length!==7||new Set(TUTORIALS.map(item=>item.id)).size!==7)errors.push('definitions.tutorials');if(CAST_HOOKS.length!==7||new Set(CAST_HOOKS.map(item=>item.actorId)).size!==7||CAST_HOOKS.flatMap(item=>item.restaurantHookIds).length!==11)errors.push('definitions.cast');if(REWARD_ROWS.length!==52||REWARD_ROWS.some((item,index)=>item.id!==`restaurant.band.level-${String(index+1).padStart(2,'0')}`||!safe(item.minimumStructuralGoldPerHour)||!(item.maximumStructuralGoldPerHour===null||safe(item.maximumStructuralGoldPerHour)))||fnvIdentity(REWARD_ROWS)!==REWARD_TABLE_IDENTITY)errors.push('definitions.rewardTable');if(POLICY.intervalMs!==1800000||POLICY.bankCapacity!==12||POLICY.unattendedTargetMs!==21600000||POLICY.publicReleaseAllowed!==false||POLICY.rewardTableId!==REWARD_TABLE_ID||POLICY.rewardTableVersion!==REWARD_TABLE_VERSION)errors.push('definitions.policy');return{ok:errors.length===0,errors}}

  const api=freeze({contractVersion:1,configId:CONFIG_ID,definitionSetId:DEFINITION_SET_ID,tutorialRegistryId:TUTORIAL_REGISTRY_ID,activationId:ACTIVATION_ID,inheritedPhase12ActivationId:INHERITED_PHASE12_ACTIVATION_ID,supportedStockModes:SUPPORTED_STOCK_MODES,policyId:POLICY_ID,policyVersion:POLICY_VERSION,rewardTableId:REWARD_TABLE_ID,rewardTableVersion:REWARD_TABLE_VERSION,rewardTableIdentity:REWARD_TABLE_IDENTITY,facilityId:FACILITY_ID,activityId:ACTIVITY_ID,opportunityDefinitionId:OPPORTUNITY_ID,mapAnchor:MAP_ANCHOR,discoveryContentId:DISCOVERY_CONTENT_ID,requiredCapabilityId:CAPABILITY_ID,openingContentId:OPENING_CONTENT_ID,routeEventId:ROUTE_EVENT_ID,routeSourceSceneId:ROUTE_SOURCE_SCENE_ID,routeVisitorId:ROUTE_VISITOR_ID,routeChronicleId:ROUTE_CHRONICLE_ID,offlineCapMs:OFFLINE_CAP_MS,productionEnabled:true,publicReleaseAllowed:false,customers:CUSTOMERS,preferences:PREFERENCES,recipes:RECIPES,stations:STATIONS,tutorials:TUTORIALS,castHooks:CAST_HOOKS,castPolicy:CAST_POLICY,rewardRows:REWARD_ROWS,policy:POLICY,stableUnit,selectCustomer,selectPreference,rewardBand,resultFor,reputationLevel,masteryLevel,recipeAvailable,stationAvailable,validateRecipeStation,planSettlement,planOutcome,economyReport,checkedAdd,validateDefinitions,snapshot:()=>copy({configId:CONFIG_ID,definitionSetId:DEFINITION_SET_ID,tutorialRegistryId:TUTORIAL_REGISTRY_ID,customers:CUSTOMERS,preferences:PREFERENCES,recipes:RECIPES,stations:STATIONS,tutorials:TUTORIALS,castHooks:CAST_HOOKS,policy:POLICY})});
  if(validateDefinitions().ok!==true)throw new Error('Phase 16 Restaurant definitions failed validation');
  Object.defineProperty(root,'EVERSTEAD_PHASE16_RESTAURANT',{value:api,writable:false,configurable:false,enumerable:false});
})(globalThis);
