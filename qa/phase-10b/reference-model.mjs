import {createHash} from 'node:crypto';

export const RELEASED_CONFIG=Object.freeze({
  schemaVersion:10,protectedSlots:12,freshGold:500000,freshProsperity:120,
  buildingIds:Object.freeze(['training','command','archives','hearth']),
  buildingBaseRates:Object.freeze({training:7200,command:6500,archives:5600,hearth:6100}),
  buildingLevelCap:52,buildingLevelMultiplier:1.15,upgradeBase:15000,upgradeGrowth:1.7,oathDailyCap:.30,
  family:Object.freeze({bonusCap:.20,base:.01,intimacyCap:.10,intimacyRate:.0002,rarityRate:.02,specialtyMatch:.01,specialties:Object.freeze({elara:'hearth',tamsin:'training',isolde:'archives'}),freshAssignments:Object.freeze({elara:'hearth',tamsin:'training',isolde:'archives'}),linkedIntimacyCap:.05,linkedIntimacyRate:.0001,linkedRarityRate:.01,linkedPerFamilyCap:.09,linkedAggregateCap:.12,rollIntervalMs:14400000,shardChanceBase:.10,shardChancePerLevel:.01,shardChanceCap:.18,assignedWeight:.75,pityForceAt:8,hearthGiftChance:.02}),
  fellow:Object.freeze({ids:Object.freeze(['cael','lyra','orin','selene','rook','mira']),base:Object.freeze({cael:6100,lyra:6400,orin:5900,selene:5350,rook:6200,mira:5200}),links:Object.freeze({cael:Object.freeze(['elara']),lyra:Object.freeze(['elara','isolde']),orin:Object.freeze(['tamsin']),selene:Object.freeze(['isolde']),rook:Object.freeze(['tamsin']),mira:Object.freeze(['isolde'])}),levelCap:120,expBase:100,expGrowth:1.12,levelPowerGrowth:.115,rarityMax:5,rarityPowerGrowth:.08,rarityCosts:Object.freeze([20,40,80,160]),bondPower:0,transferRate:.40}),
  companion:Object.freeze({ids:Object.freeze(['bramble','cinderwing']),base:Object.freeze({bramble:1000,cinderwing:1200}),levelCap:100,expBase:80,expGrowth:1.12,levelPowerGrowth:.10,rarityMax:5,rarityPowerGrowth:.10,rarityCosts:Object.freeze([20,40,80,160])}),
  mastery:Object.freeze({pointsCap:50000,levelCap:50,thresholdFactor:20,powerPerLevel:.01}),
  might:Object.freeze({pointsCap:50000,levelCap:50,thresholdFactor:20,powerPerLevel:.01}),
  campaign:Object.freeze({discountScale:.25,discountCap:.35,fellowRecommended:Object.freeze([22000,26000,30500,35500,42000,49500,58000,68000,80000,95000]),companionRecommended:Object.freeze([2000,2360,2785,3286,3878,4576,5399,6371,7518,8871])}),
  tower:Object.freeze({floorCap:50,intervalMs:3600000,elapsedCapMs:86400000,pityForceAt:8}),
  expedition:Object.freeze({stageCap:50,requirementBase:5500,requirementGrowth:1.08,intervalMs:3600000,elapsedCapMs:86400000,pityForceAt:8}),
  relics:Object.freeze({
    'first-road-lantern':Object.freeze({tier:1}),
    'mossbound-compass':Object.freeze({tier:1}),
    'emberglass-sigil':Object.freeze({tier:2}),
    'tideglass-charm':Object.freeze({tier:2}),
    'stormforged-emblem':Object.freeze({tier:3}),
    'oathkeeper-crest':Object.freeze({tier:3})
  }),
  relicLevelCap:10
});

const clone=value=>JSON.parse(JSON.stringify(value));
export const canonical=value=>{
  if(typeof value==='number'&&!Number.isInteger(value)){
    const bytes=Buffer.allocUnsafe(8);bytes.writeDoubleBE(value);return{$float64:bytes.toString('hex'),decimal:String(value)};
  }
  if(Array.isArray(value))return value.map(canonical);
  if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]));
  return value;
};
export const canonicalText=value=>JSON.stringify(canonical(value));
export const digest=value=>createHash('sha256').update(canonicalText(value)).digest('hex');

const familyForBuilding=(buildingId,profile)=>{
  if(profile.familyMode==='none')return null;
  if(profile.familyMode==='fresh'){
    const entry=Object.entries(RELEASED_CONFIG.family.freshAssignments).find(([,id])=>id===buildingId);
    if(!entry)return null;
    const fresh={elara:{intimacy:110,rarity:1},tamsin:{intimacy:76,rarity:1},isolde:{intimacy:58,rarity:1}}[entry[0]];
    return{id:entry[0],...fresh};
  }
  if(profile.familyMode==='mismatch'){
    const id={training:'elara',command:null,archives:'tamsin',hearth:'isolde'}[buildingId];return id?{id,intimacy:profile.intimacy,rarity:profile.rarity}:null;
  }
  const matching=Object.entries(RELEASED_CONFIG.family.specialties).find(([,id])=>id===buildingId)?.[0]??null;
  return matching?{id:matching,intimacy:profile.intimacy,rarity:profile.rarity}:null;
};
const familyBuilding=(buildingId,family,mutation=null)=>{
  const config=RELEASED_CONFIG.family;
  if(!family)return{familyId:null,baseBonus:0,intimacyBonus:0,rarityBonus:0,specialtyBonus:0,bonus:0,multiplier:1};
  const baseBonus=config.base,intimacyRate=mutation==='family-bonus'?config.intimacyRate+.000001:config.intimacyRate,intimacyBonus=Math.min(config.intimacyCap,family.intimacy*intimacyRate),rarityBonus=config.rarityRate*(family.rarity-1),specialtyBonus=config.specialties[family.id]===buildingId?config.specialtyMatch:0,bonus=Math.min(config.bonusCap,baseBonus+intimacyBonus+rarityBonus+specialtyBonus);
  return{familyId:family.id,baseBonus,intimacyBonus,rarityBonus,specialtyBonus,bonus,multiplier:1+bonus};
};
const buildingOutput=(input,mutation=null)=>{
  const family=familyForBuilding(input.buildingId,input.profile),assignment=familyBuilding(input.buildingId,family,mutation),levelGrowth=mutation==='building-level-multiplier'?RELEASED_CONFIG.buildingLevelMultiplier+.000001:RELEASED_CONFIG.buildingLevelMultiplier,levelMultiplier=Math.pow(levelGrowth,input.level-1),oathCap=mutation==='oath-cap'?.29:RELEASED_CONFIG.oathDailyCap,oathBoost=Math.min(oathCap,Math.max(0,input.profile.oathBoost)),oathMultiplier=1+oathBoost,base=RELEASED_CONFIG.buildingBaseRates[input.buildingId]+(mutation==='building-base'?1:0),formulaOrder=mutation==='oath-order'?['base','levelMultiplier','oathMultiplier','familyAssignmentMultiplier','fellowRosterMultiplier','companionRosterMultiplier','overallDayMultiplier']:['base','levelMultiplier','familyAssignmentMultiplier','fellowRosterMultiplier','companionRosterMultiplier','overallDayMultiplier','oathMultiplier'],rate=base*levelMultiplier*assignment.multiplier*1*1*1*oathMultiplier;
  return{buildingId:input.buildingId,level:input.level,base,levelMultiplier,familyId:assignment.familyId,familyBaseBonus:assignment.baseBonus,familyIntimacyBonus:assignment.intimacyBonus,familyRarityBonus:assignment.rarityBonus,familySpecialtyBonus:assignment.specialtyBonus,familyBonus:assignment.bonus,familyMultiplier:assignment.multiplier,fellowRosterMultiplier:1,companionRosterMultiplier:1,overallDayMultiplier:1,oathBoost,oathMultiplier,rate,formulaOrder};
};
const upgradeOutput=(input,mutation=null)=>{const growth=RELEASED_CONFIG.upgradeGrowth+(mutation==='upgrade-growth'?.000001:0),raw=RELEASED_CONFIG.upgradeBase*Math.pow(growth,input.level-1),round=mutation==='upgrade-rounding'?Math.floor:Math.round;return{level:input.level,canUpgrade:input.level<RELEASED_CONFIG.buildingLevelCap,cost:round(raw)}};
const dayKey=timestamp=>{const d=new Date(timestamp);return`D${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
const nextMidnight=timestamp=>{const d=new Date(timestamp);d.setHours(24,0,0,0);return d.getTime()>timestamp?d.getTime():timestamp+86400000};
const offlineOutput=(input,mutation=null)=>{
  const last=input.startAt,now=last+input.elapsedMs,pendingBefore=input.pendingBefore??0;
  if(now<=last)return{elapsed:0,total:0,lineValues:Object.fromEntries(RELEASED_CONFIG.buildingIds.map(id=>[id,0])),segments:[],pendingBefore,pendingAfter:pendingBefore,nextLastGoldAt:last};
  const claimEnd=Math.min(now,last+(mutation==='offline-cap'?90000000:86400000)),lineValues=Object.fromEntries(RELEASED_CONFIG.buildingIds.map(id=>[id,0])),segments=[];let cursor=last;
  while(cursor<claimEnd){const end=mutation==='midnight-segmentation'?claimEnd:Math.min(claimEnd,nextMidnight(cursor)),duration=end-cursor,values={};for(const id of RELEASED_CONFIG.buildingIds){const oathActive=mutation==='midnight-segmentation'||dayKey(cursor)===dayKey(last),profile={...input.profile,oathBoost:oathActive?input.profile.oathBoost:0},value=buildingOutput({buildingId:id,level:input.levels[id],profile}).rate*duration/3600000;lineValues[id]+=value;values[id]=value}segments.push({start:cursor,end,duration,day:dayKey(cursor),values});cursor=end}
  const total=Object.values(lineValues).reduce((sum,value)=>sum+value,0);return{elapsed:claimEnd-last,total,lineValues,segments,pendingBefore,pendingAfter:pendingBefore+total,nextLastGoldAt:now};
};
const expToNext=(level,base,growth,cap,mutation=null)=>{const raw=base*Math.pow(growth,Math.max(1,Math.min(cap,Math.floor(level)))-1);return mutation==='exp-threshold'?Math.floor(raw):Math.round(raw)};
const expThreshold=(level,base,growth,cap,mutation=null)=>{const target=Math.max(1,Math.min(cap,Math.floor(level)));let total=0;for(let current=1;current<target;current++)total+=expToNext(current,base,growth,cap,mutation);return total};
const progressLevel=(points,config)=>{let level=0;while(level<config.levelCap&&config.thresholdFactor*(level+1)*(level+1)<=points)level++;return level};
const progressComponents=(points,config)=>{const level=progressLevel(points,config);return{points,level,threshold:config.thresholdFactor*level*level,nextThreshold:level>=config.levelCap?config.pointsCap:config.thresholdFactor*(level+1)*(level+1),multiplier:1+config.powerPerLevel*level,cap:config.pointsCap}};
const relicParts=(id,level)=>{if(!id)return{id:null,level:0,tier:0,bonusBps:0,multiplier:1,nextCost:null};const tier=RELEASED_CONFIG.relics[id].tier,bonusBps=tier*(100+25*(level-1));return{id,level,tier,bonusBps,multiplier:1+bonusBps/10000,nextCost:level>=RELEASED_CONFIG.relicLevelCap?null:5*tier*level}};
const companionPower=(id,profile,mutation=null)=>{const basePower=RELEASED_CONFIG.companion.base[id],levelMultiplier=1+RELEASED_CONFIG.companion.levelPowerGrowth*(profile.level-1),rawAfterLevel=basePower*levelMultiplier,afterLevel=mutation==='companion-power-order'?Math.round(rawAfterLevel):rawAfterLevel,rarityMultiplier=1+RELEASED_CONFIG.companion.rarityPowerGrowth*(profile.rarity-1),afterRarity=afterLevel*rarityMultiplier,mastery=progressComponents(profile.masteryPoints,RELEASED_CONFIG.mastery),preMastery=mutation==='mastery-placement'?Math.round(afterRarity):afterRarity,unroundedPower=preMastery*mastery.multiplier,formulaOrder=mutation==='companion-power-order'?['basePower','levelMultiplier','round','rarityMultiplier','masteryMultiplier']:mutation==='mastery-placement'?['basePower','levelMultiplier','rarityMultiplier','round','masteryMultiplier']:['basePower','levelMultiplier','rarityMultiplier','masteryMultiplier','round'];return{id,basePower,level:profile.level,levelMultiplier,afterLevel,rarity:profile.rarity,rarityMultiplier,afterRarity,masteryLevel:mastery.level,masteryPoints:profile.masteryPoints,masteryMultiplier:mastery.multiplier,unroundedPower,effectivePower:Math.round(unroundedPower),formulaOrder}};
const familyBond=(id,intimacy,rarity)=>{const values=RELEASED_CONFIG.fellow.links[id].map(familyId=>{const intimacyBonus=Math.min(RELEASED_CONFIG.family.linkedIntimacyCap,intimacy*RELEASED_CONFIG.family.linkedIntimacyRate),rarityBonus=RELEASED_CONFIG.family.linkedRarityRate*(rarity-1),bonus=Math.min(RELEASED_CONFIG.family.linkedPerFamilyCap,intimacyBonus+rarityBonus);return{familyId,intimacyBonus,rarityBonus,bonus}}),uncappedBonus=values.reduce((sum,item)=>sum+item.bonus,0),bonus=Math.min(RELEASED_CONFIG.family.linkedAggregateCap,uncappedBonus);return{links:values,uncappedBonus,bonus,multiplier:1+bonus}};
const fellowPower=(id,profile,mutation=null)=>{const basePower=RELEASED_CONFIG.fellow.base[id],levelMultiplier=1+RELEASED_CONFIG.fellow.levelPowerGrowth*(profile.level-1),rawAfterLevel=basePower*levelMultiplier,afterLevel=mutation==='fellow-power-order'?Math.round(rawAfterLevel):rawAfterLevel,rarityMultiplier=1+RELEASED_CONFIG.fellow.rarityPowerGrowth*(profile.rarity-1),afterRarity=afterLevel*rarityMultiplier,bondMilestoneMultiplier=1,relic=relicParts(profile.relicId,profile.relicLevel),companion=profile.companionId?companionPower(profile.companionId,{level:profile.companionLevel,rarity:profile.companionRarity,masteryPoints:profile.masteryPoints}):null,rawTransfer=companion?companion.unroundedPower*RELEASED_CONFIG.fellow.transferRate:0,transferredPower=mutation==='companion-transfer'&&companion?Math.round(companion.unroundedPower)*RELEASED_CONFIG.fellow.transferRate:rawTransfer,family=familyBond(id,profile.familyIntimacy,profile.familyRarity),familyMultiplier=mutation==='family-bond-exclusion'?1:family.multiplier,familyBonus=mutation==='family-bond-exclusion'?0:family.bonus,might=progressComponents(profile.mightPoints,RELEASED_CONFIG.might);let afterRelic=afterRarity*bondMilestoneMultiplier*relic.multiplier,afterCompanion=afterRelic+transferredPower,unroundedPower,formulaOrder=mutation==='fellow-power-order'?['basePower','levelMultiplier','round','rarityMultiplier','bondMilestoneMultiplier','relicMultiplier','companionPowerTransfer','familyBondMultiplier','globalMightMultiplier']:['basePower','levelMultiplier','rarityMultiplier','bondMilestoneMultiplier','relicMultiplier','companionPowerTransfer','familyBondMultiplier','globalMightMultiplier','round'];if(mutation==='relic-placement'){const beforeRelic=(afterRarity+transferredPower)*familyMultiplier;afterRelic=beforeRelic*relic.multiplier;afterCompanion=afterRelic;unroundedPower=afterCompanion*might.multiplier;formulaOrder=['basePower','levelMultiplier','rarityMultiplier','companionPowerTransfer','familyBondMultiplier','relicMultiplier','globalMightMultiplier','round']}else if(mutation==='might-placement'){unroundedPower=Math.round(afterCompanion*might.multiplier)*familyMultiplier;formulaOrder=['basePower','levelMultiplier','rarityMultiplier','bondMilestoneMultiplier','relicMultiplier','companionPowerTransfer','globalMightMultiplier','round','familyBondMultiplier']}else unroundedPower=afterCompanion*familyMultiplier*might.multiplier;return{id,basePower,level:profile.level,levelMultiplier,afterLevel,rarity:profile.rarity,rarityMultiplier,afterRarity,bondMilestoneMultiplier,relicId:relic.id,relicBonusBps:relic.bonusBps,relicMultiplier:relic.multiplier,afterRelic,assignedCompanionId:profile.companionId,companionUnroundedPower:companion?.unroundedPower??0,transferredPower,afterCompanion,familyBonus,familyMultiplier,mightLevel:might.level,mightPoints:profile.mightPoints,globalMultiplier:might.multiplier,unroundedPower,effectivePower:Math.round(unroundedPower),formulaOrder}};
const campaignOutput=(input,mutation=null)=>{const surplusRatio=Math.max(0,input.totalPower/input.recommendedPower-1),cap=mutation==='campaign-cap'?.34:RELEASED_CONFIG.campaign.discountCap,discountRate=Math.min(cap,surplusRatio*RELEASED_CONFIG.campaign.discountScale),round=mutation==='campaign-ceil'?Math.floor:Math.ceil,effectiveCost=Math.max(1,round(input.baseCost*(1-discountRate)));return{baseCost:input.baseCost,recommendedPower:input.recommendedPower,totalRosterPower:input.totalPower,surplusRatio,discountRate,effectiveCost}};
const stableRandomUnit=(saveId,scope,ordinal,salt)=>{const text=`${saveId}\u001f${scope}\u001f${ordinal}\u001f${salt}`;let hash=2166136261;for(let index=0;index<text.length;index++){hash^=text.charCodeAt(index);hash=Math.imul(hash,16777619)}return(hash>>>0)/4294967296};
const rewardMap=ids=>Object.fromEntries(ids.map(id=>[id,0]));
const towerHistory=(input,mutation=null)=>{const companionExp=rewardMap(RELEASED_CONFIG.companion.ids),companionShards=rewardMap(RELEASED_CONFIG.companion.ids);let ordinal=0,pity=0,masteryNominal=0;for(let index=0;index<input.count;index++){for(const id of RELEASED_CONFIG.companion.ids)companionExp[id]+=20+2*input.floor+(mutation==='tower-interval-reward'?1:0);masteryNominal+=1+Math.floor((input.floor-1)/10);const forced=pity===(mutation==='forced-pity-ordinal'?8:7),hit=forced||stableRandomUnit(input.saveId,`floor-${input.floor}`,ordinal,'companion-tower-idle-hit-v1')<Math.min(.30,.08+.005*(input.floor-1));if(hit){const unit=stableRandomUnit(input.saveId,`floor-${input.floor}`,ordinal,'companion-tower-idle-recipient-v1'),recipient=RELEASED_CONFIG.companion.ids[Math.min(1,Math.floor(unit*2))];companionShards[recipient]++;pity=0}else pity++;ordinal++}return{companionExp,companionShards,masteryNominal,pityMisses:pity,intervalOrdinal:ordinal}};
const expeditionHistory=(input,mutation=null)=>{const fellowShards=rewardMap(RELEASED_CONFIG.fellow.ids);let ordinal=0,pity=0,mightNominal=0;for(let index=0;index<input.count;index++){mightNominal+=1+Math.floor((input.stage-1)/2)+(mutation==='expedition-interval-reward'?1:0);const forced=pity===7,hit=forced||stableRandomUnit(input.saveId,`stage-${input.stage}`,ordinal,'fellow-expedition-idle-shard-hit-v1')<Math.min(.30,.08+.02*(input.stage-1));if(hit){const unit=stableRandomUnit(input.saveId,`stage-${input.stage}`,ordinal,'fellow-expedition-idle-shard-recipient-v1'),recipient=input.ownedIds[Math.min(input.ownedIds.length-1,Math.floor(unit*input.ownedIds.length))];fellowShards[recipient]++;pity=0}else pity++;ordinal++}return{fellowShards,mightNominal,pityMisses:pity,intervalOrdinal:ordinal}};
const settleIdle=input=>{const cap=86400000,key=input.lane==='tower'?'floor':'stage',segments=clone(input.segments),now=Math.max(0,Math.min(Number.MAX_SAFE_INTEGER,Math.floor(input.at))),start=input.cursor;if(now<=start)return{result:{elapsed:0,credited:0,discarded:0},idle:{cursorAt:start,segments}};const elapsed=now-start;if(input.progress===0)return{result:{elapsed,credited:0,discarded:elapsed},idle:{cursorAt:now,segments}};const occupied=segments.reduce((sum,item)=>sum+item.elapsedMs,0),credited=Math.min(elapsed,Math.max(0,cap-occupied)),discarded=elapsed-credited;if(credited>0){const last=segments.at(-1);if(last?.[key]===input.progress)last.elapsedMs+=credited;else segments.push({[key]:input.progress,elapsedMs:credited})}return{result:{elapsed,credited,discarded},idle:{cursorAt:now,segments}}};
const consumeIdle=input=>{const key=input.lane==='tower'?'floor':'stage',segments=clone(input.segments),counts={},interval=3600000;for(let index=1;index<=50;index++)counts[String(index)]=0;let intervals=0;while(segments.reduce((sum,item)=>sum+item.elapsedMs,0)>=interval){const earned=segments[0][key];let need=interval;while(need>0){const take=Math.min(need,segments[0].elapsedMs);segments[0].elapsedMs-=take;need-=take;if(segments[0].elapsedMs===0)segments.shift()}counts[String(earned)]++;intervals++}return{segments,counts,intervals,consumedElapsedMs:intervals*interval}};
const familyRecipient=(buildingId,ordinal,assignedId,saveId)=>{const unit=stableRandomUnit(saveId,buildingId,ordinal,'family-shard-recipient');if(!assignedId)return['elara','tamsin','isolde'][Math.min(2,Math.floor(unit*3))];if(unit<.75)return assignedId;const others=['elara','tamsin','isolde'].filter(id=>id!==assignedId),scaled=(unit-.75)/.25;return others[Math.min(1,Math.floor(scaled*2))]};
const familyDrop=input=>{const pendingShards={elara:0,tamsin:0,isolde:0},byBuilding={},nextOrdinals={},droughts={},carries={};let gifts=0,rolls=0;for(const buildingId of RELEASED_CONFIG.buildingIds){const level=input.levels[buildingId],assignedId=familyForBuilding(buildingId,input.profile)?.id??null;let ordinal=typeof input.ordinal==='object'?input.ordinal[buildingId]:input.ordinal??0,drought=typeof input.drought==='object'?input.drought[buildingId]:input.drought??0,remaining=(typeof input.carryMs==='object'?input.carryMs[buildingId]:input.carryMs??0)+(input.elapsedMs??RELEASED_CONFIG.family.rollIntervalMs);const count=Math.floor(remaining/RELEASED_CONFIG.family.rollIntervalMs);remaining-=count*RELEASED_CONFIG.family.rollIntervalMs;const shards={elara:0,tamsin:0,isolde:0};let buildingGifts=0;for(let index=0;index<count;index++){const forced=drought===7,chance=Math.min(.18,.10+.01*(level-1)),success=forced||stableRandomUnit(input.saveId,buildingId,ordinal,'family-shard-success')<chance;if(success){const recipient=familyRecipient(buildingId,ordinal,assignedId,input.saveId);pendingShards[recipient]++;shards[recipient]++;drought=0}else drought++;const gift=buildingId==='hearth'&&stableRandomUnit(input.saveId,buildingId,ordinal,'family-gift')<.02?1:0;buildingGifts+=gift;gifts+=gift;ordinal++;rolls++}byBuilding[buildingId]={rolls:count,gifts:buildingGifts,shards};nextOrdinals[buildingId]=ordinal;droughts[buildingId]=drought;carries[buildingId]=remaining}return{rolls,gifts,pendingShards,byBuilding,nextOrdinals,droughts,carries}};

export function referenceEvaluate(input,{mutation=null}={}){
  if(input.kind==='building')return buildingOutput(input,mutation);
  if(input.kind==='upgrade')return upgradeOutput(input,mutation);
  if(input.kind==='offline')return offlineOutput(input,mutation);
  if(input.kind==='fellow-power')return fellowPower(input.fellowId,input.profile,mutation);
  if(input.kind==='companion-power')return companionPower(input.companionId,input.profile,mutation);
  if(input.kind==='campaign')return campaignOutput(input,mutation);
  if(input.kind==='idle'){
    if(input.mode==='tower-formula')return{floor:input.floor,requirement:Math.round(2000*Math.pow(1.06,input.floor-1)),clearExp:40+10*(input.floor-1),clearMastery:2+Math.floor((input.floor-1)/10),idleExp:20+2*input.floor,idleMastery:1+Math.floor((input.floor-1)/10),shardChance:Math.min(.30,.08+.005*(input.floor-1))};
    if(input.mode==='tower-history')return towerHistory(input,mutation);
    if(input.mode==='tower-settle')return settleIdle({...input,lane:'tower',progress:input.floor});
    if(input.mode==='tower-consume')return consumeIdle({...input,lane:'tower'});
    if(input.mode==='expedition-formula')return{stage:input.stage,requirement:Math.round(5500*Math.pow(1.08,input.stage-1)),mightPerInterval:1+Math.floor((input.stage-1)/2),shardChance:Math.min(.30,.08+.02*(input.stage-1))};
    if(input.mode==='expedition-history')return expeditionHistory(input,mutation);
    if(input.mode==='expedition-settle')return settleIdle({...input,lane:'expedition',progress:input.stage});
    if(input.mode==='expedition-consume')return consumeIdle({...input,lane:'expedition'});
    if(input.mode==='family-drop')return familyDrop(input);
    if(input.mode==='stable-unit')return{unit:stableRandomUnit(input.saveId,input.scope,input.ordinal,mutation==='stable-channel'?`${input.salt}-mutant`:input.salt)};
  }
  if(input.kind==='progression'){
    if(input.mode==='fellow-exp')return{level:input.level,toNext:expToNext(input.level,100,1.12,120,mutation==='fellow-exp-threshold'?'exp-threshold':null),threshold:expThreshold(input.level,100,1.12,120,mutation==='fellow-exp-threshold'?'exp-threshold':null)};
    if(input.mode==='companion-exp')return{level:input.level,toNext:expToNext(input.level,80,1.12,100,mutation==='companion-exp-threshold'?'exp-threshold':null),threshold:expThreshold(input.level,80,1.12,100,mutation==='companion-exp-threshold'?'exp-threshold':null)};
    if(input.mode==='mastery')return progressComponents(input.points,RELEASED_CONFIG.mastery);
    if(input.mode==='might')return progressComponents(input.points,RELEASED_CONFIG.might);
    if(input.mode==='relic')return relicParts(input.relicId,input.level);
  }
  throw new Error(`Unknown reference vector ${input.kind}/${input.mode??''}`);
}

export function buildParityVectors(scenarios){
  const vectors=[];
  for(const buildingId of RELEASED_CONFIG.buildingIds)for(const level of scenarios.buildingLevels)for(const profile of scenarios.buildingProfiles)vectors.push({id:`parity-building-${buildingId}-l${level}-${profile.id}`,kind:'building',buildingId,level,profile:clone(profile)});
  for(const level of [1,2,3,10,20,30,51,52])vectors.push({id:`parity-upgrade-l${level}`,kind:'upgrade',level});
  const noon=Date.UTC(2026,7,29,19),late=Date.UTC(2026,7,30,6,30),levels={training:1,command:1,archives:1,hearth:1};
  for(const profile of scenarios.buildingProfiles)for(const duration of scenarios.offlineDurations)vectors.push({id:`parity-offline-${profile.id}-${duration.id}`,kind:'offline',startAt:duration.startKind==='late'?late:noon,elapsedMs:duration.elapsedMs,pendingBefore:12.5,levels,profile:clone(profile)});
  for(const fellowId of RELEASED_CONFIG.fellow.ids)for(const profile of scenarios.fellowPowerProfiles)vectors.push({id:`parity-fellow-${fellowId}-${profile.id}`,kind:'fellow-power',fellowId,profile:clone(profile)});
  for(const companionId of RELEASED_CONFIG.companion.ids)for(const profile of scenarios.companionPowerProfiles)vectors.push({id:`parity-companion-${companionId}-${profile.id}`,kind:'companion-power',companionId,profile:clone(profile)});
  for(let index=0;index<10;index++){const recommended=RELEASED_CONFIG.campaign.fellowRecommended[index],ratio=[.5,1,1.2,2.4,4][index%5],ceilBoundary=index===3;vectors.push({id:`parity-campaign-fellow-${index+1}`,kind:'campaign',baseCost:ceilBoundary?10000:10000+2000*index,recommendedPower:ceilBoundary?30000:recommended,totalPower:ceilBoundary?30010.8:recommended*ratio})}
  for(let index=0;index<10;index++){const recommended=RELEASED_CONFIG.campaign.companionRecommended[index],ratio=[.5,1,1.2,2.4,4][index%5];vectors.push({id:`parity-campaign-companion-${index+1}`,kind:'campaign',baseCost:8000+1500*index,recommendedPower:recommended,totalPower:recommended*ratio})}
  vectors.push(
    {id:'parity-idle-tower-formula-1',kind:'idle',mode:'tower-formula',floor:1},{id:'parity-idle-tower-formula-50',kind:'idle',mode:'tower-formula',floor:50},
    {id:'parity-idle-tower-history-1-7',kind:'idle',mode:'tower-history',floor:1,count:7,saveId:'pity-0'},{id:'parity-idle-tower-history-1-8',kind:'idle',mode:'tower-history',floor:1,count:8,saveId:'pity-0'},
    {id:'parity-idle-tower-settle-empty',kind:'idle',mode:'tower-settle',floor:0,cursor:1000,at:5000,segments:[]},{id:'parity-idle-tower-settle-exact',kind:'idle',mode:'tower-settle',floor:2,cursor:1000,at:3601000,segments:[]},{id:'parity-idle-tower-settle-partial-cap',kind:'idle',mode:'tower-settle',floor:2,cursor:1000,at:7201000,segments:[{floor:2,elapsedMs:82800000}]},{id:'parity-idle-tower-consume-carry',kind:'idle',mode:'tower-consume',segments:[{floor:1,elapsedMs:1800000},{floor:2,elapsedMs:2700000}]},
    {id:'parity-idle-tower-history-25-8',kind:'idle',mode:'tower-history',floor:25,count:8,saveId:scenarios.fixedSaveId},{id:'parity-idle-tower-history-50-12',kind:'idle',mode:'tower-history',floor:50,count:12,saveId:scenarios.fixedSaveId},
    {id:'parity-idle-expedition-formula-1',kind:'idle',mode:'expedition-formula',stage:1},{id:'parity-idle-expedition-formula-50',kind:'idle',mode:'expedition-formula',stage:50},
    {id:'parity-idle-expedition-history-1-7',kind:'idle',mode:'expedition-history',stage:1,count:7,saveId:'epity-0',ownedIds:clone(RELEASED_CONFIG.fellow.ids)},{id:'parity-idle-expedition-history-1-8',kind:'idle',mode:'expedition-history',stage:1,count:8,saveId:'epity-0',ownedIds:clone(RELEASED_CONFIG.fellow.ids)},
    {id:'parity-idle-expedition-settle-empty',kind:'idle',mode:'expedition-settle',stage:0,cursor:1000,at:5000,segments:[]},{id:'parity-idle-expedition-settle-exact',kind:'idle',mode:'expedition-settle',stage:3,cursor:1000,at:3601000,segments:[]},{id:'parity-idle-expedition-settle-partial-cap',kind:'idle',mode:'expedition-settle',stage:3,cursor:1000,at:7201000,segments:[{stage:3,elapsedMs:82800000}]},{id:'parity-idle-expedition-consume-carry',kind:'idle',mode:'expedition-consume',segments:[{stage:1,elapsedMs:1800000},{stage:2,elapsedMs:2700000}]},
    {id:'parity-idle-expedition-history-6-8',kind:'idle',mode:'expedition-history',stage:6,count:8,saveId:scenarios.fixedSaveId,ownedIds:clone(RELEASED_CONFIG.fellow.ids)},{id:'parity-idle-expedition-history-12-12',kind:'idle',mode:'expedition-history',stage:12,count:12,saveId:scenarios.fixedSaveId,ownedIds:clone(RELEASED_CONFIG.fellow.ids)}
  );
  const familyOrdinals={training:1,command:2,archives:3,hearth:4},familyDroughts={training:0,command:3,archives:6,hearth:7};
  for(const [label,profile,level,drought,ordinal,saveId,elapsedMs,carryMs] of [['fresh',scenarios.buildingProfiles[1],1,familyDroughts,familyOrdinals,scenarios.fixedSaveId,14400000,{training:0,command:0,archives:0,hearth:0}],['level-cap',scenarios.buildingProfiles[3],52,0,0,'family-b',14399999,0],['forced',scenarios.buildingProfiles[2],10,7,0,'family-c',7200000,10800000],['unassigned',scenarios.buildingProfiles[0],4,3,0,'family-d',1,14399999]])vectors.push({id:`parity-idle-family-${label}`,kind:'idle',mode:'family-drop',profile:clone(profile),levels:Object.fromEntries(RELEASED_CONFIG.buildingIds.map(id=>[id,level])),drought:clone(drought),ordinal:clone(ordinal),saveId,elapsedMs,carryMs:clone(carryMs)});
  const progression=[
    ...[1,2,3,50].map(level=>({id:`parity-progression-fellow-exp-${level}`,kind:'progression',mode:'fellow-exp',level})),
    ...[1,2,3,50].map(level=>({id:`parity-progression-companion-exp-${level}`,kind:'progression',mode:'companion-exp',level})),
    ...[0,19,20,50000].map(points=>({id:`parity-progression-mastery-${points}`,kind:'progression',mode:'mastery',points})),
    ...[0,20,50000].map(points=>({id:`parity-progression-might-${points}`,kind:'progression',mode:'might',points})),
    {id:'parity-progression-relic-t1-l1',kind:'progression',mode:'relic',relicId:'first-road-lantern',level:1},
    {id:'parity-progression-relic-t2-l7',kind:'progression',mode:'relic',relicId:'emberglass-sigil',level:7},
    {id:'parity-progression-relic-t3-l10',kind:'progression',mode:'relic',relicId:'oathkeeper-crest',level:10},
    {id:'parity-progression-relic-t3-l9',kind:'progression',mode:'relic',relicId:'oathkeeper-crest',level:9},
    {id:'parity-progression-stable-a',kind:'idle',mode:'stable-unit',saveId:scenarios.fixedSaveId,scope:'stage-1',ordinal:0,salt:'fellow-expedition-idle-shard-hit-v1'}
  ];
  vectors.push(...progression);
  if(vectors.length!==240)throw new Error(`Parity registry expected 240, received ${vectors.length}`);
  return vectors;
}

export function buildMicroVectors(scenarios){
  const vectors=[];
  for(const buildingId of RELEASED_CONFIG.buildingIds)for(const level of [1,2,10])for(const profile of [scenarios.buildingProfiles[0],scenarios.buildingProfiles[3]])vectors.push({id:`micro-building-${buildingId}-l${level}-${profile.id}`,kind:'building',buildingId,level,profile:clone(profile)});
  for(const level of [1,2,3,4,5,6,7,8,10,12,16,20,30,40,51,52])vectors.push({id:`micro-upgrade-l${level}`,kind:'upgrade',level});
  for(const level of [1,2,3,4,5,10,50,120])vectors.push({id:`micro-exp-fellow-${level}`,kind:'progression',mode:'fellow-exp',level});
  for(const level of [1,2,3,4,5,10,50,100])vectors.push({id:`micro-exp-companion-${level}`,kind:'progression',mode:'companion-exp',level});
  for(const profile of scenarios.fellowPowerProfiles)vectors.push({id:`micro-power-fellow-${profile.id}`,kind:'fellow-power',fellowId:'lyra',profile:clone(profile)});
  for(const profile of scenarios.companionPowerProfiles)vectors.push({id:`micro-power-companion-${profile.id}`,kind:'companion-power',companionId:'cinderwing',profile:clone(profile)});
  for(const [index,ratio] of [.5,.999,1,1.001,1.2,1.5,2,2.4,3,4,10,100].entries())vectors.push({id:`micro-campaign-${index+1}`,kind:'campaign',baseCost:12000,recommendedPower:30000,totalPower:30000*ratio});
  for(const [index,input] of [
    {kind:'idle',mode:'tower-formula',floor:1},{kind:'idle',mode:'tower-formula',floor:50},{kind:'idle',mode:'tower-history',floor:1,count:7,saveId:scenarios.fixedSaveId},{kind:'idle',mode:'tower-history',floor:1,count:8,saveId:scenarios.fixedSaveId},
    {kind:'idle',mode:'expedition-formula',stage:1},{kind:'idle',mode:'expedition-formula',stage:12},{kind:'idle',mode:'expedition-history',stage:1,count:7,saveId:scenarios.fixedSaveId,ownedIds:clone(RELEASED_CONFIG.fellow.ids)},{kind:'idle',mode:'expedition-history',stage:1,count:8,saveId:scenarios.fixedSaveId,ownedIds:clone(RELEASED_CONFIG.fellow.ids)},
    {kind:'idle',mode:'stable-unit',saveId:'micro',scope:'a',ordinal:0,salt:'x'},{kind:'idle',mode:'stable-unit',saveId:'micro',scope:'a',ordinal:1,salt:'x'},{kind:'progression',mode:'mastery',points:20},{kind:'progression',mode:'might',points:50000}
  ].entries())vectors.push({id:`micro-idle-${index+1}`,...input});
  if(vectors.length!==96)throw new Error(`Micro registry expected 96, received ${vectors.length}`);
  return vectors;
}

export function mutationProbe(vector,mutation){
  const expected={
    'building-base':['parity-field','/base'],
    'building-level-multiplier':['parity-field','/levelMultiplier'],
    'upgrade-growth':['parity-field','/cost'],
    'upgrade-rounding':['parity-field','/cost'],
    'family-bonus':['parity-field','/familyBonus'],
    'oath-order':['parity-field','/formulaOrder/2'],
    'oath-cap':['parity-field','/oathBoost'],
    'offline-cap':['parity-field','/elapsed'],
    'midnight-segmentation':['parity-field','/lineValues/archives'],
    'fellow-exp-threshold':['parity-field','/threshold'],
    'companion-exp-threshold':['parity-field','/threshold'],
    'fellow-power-order':['parity-field','/formulaOrder/2'],
    'companion-power-order':['parity-field','/formulaOrder/2'],
    'relic-placement':['parity-field','/afterCompanion'],
    'companion-transfer':['parity-field','/afterCompanion'],
    'family-bond-exclusion':['ownership-invariant','/effectivePower'],
    'might-placement':['parity-field','/formulaOrder/6'],
    'mastery-placement':['parity-field','/formulaOrder/3'],
    'campaign-ceil':['parity-field','/effectiveCost'],
    'campaign-cap':['parity-field','/discountRate'],
    'tower-interval-reward':['parity-field','/companionExp/bramble'],
    'expedition-interval-reward':['parity-field','/mightNominal'],
    'stable-channel':['parity-field','/unit'],
    'forced-pity-ordinal':['parity-field','/companionShards/bramble']
  }[mutation];
  if(!expected)throw new Error(`Unknown mutation ${mutation}`);
  const control=referenceEvaluate(vector),mutated=referenceEvaluate(vector,{mutation});
  if(canonicalText(control)===canonicalText(mutated))throw new Error(`Mutation ${mutation} was inert`);
  return{control,mutated,failureClass:expected[0],expectedPath:expected[1]};
}
