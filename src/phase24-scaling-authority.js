/* Everstead Phase 24A · immutable live scaling authority (schema 13). */
(function phaseTwentyFourScalingAuthority(global){
  'use strict';

  const companionCatalog=global.EVERSTEAD_PHASE23_COMPANIONS;
  if(!companionCatalog||companionCatalog.version!==1)throw new Error('Phase 24A requires the released Phase 23 Companion catalog');

  const deepFreeze=value=>{
    if(value&&typeof value==='object'&&!Object.isFrozen(value)){
      for(const child of Object.values(value))deepFreeze(child);
      Object.freeze(value);
    }
    return value;
  };

  const fellowBasePower={
    cael:6100,lyra:6400,orin:5900,selene:5350,rook:6200,mira:5200,
    zamorak:6250,darrow:6150,deadpool:5450,'star-lord':5500,'iron-man':6300,
    daredevil:6000,thor:6500,'captain-america':6200,'spider-man':5600,
    wolverine:6350,'obi-wan':5550,anakin:6450
  };
  const companionBasePower=Object.fromEntries(companionCatalog.roster.map(item=>[item.id,item.basePower]));
  const buildingBaseRates={training:7200,command:6500,archives:5600,hearth:6100};
  const familySpecialties={
    elara:'hearth',tamsin:'training',isolde:'archives',violet:'command',virginia:'command',
    'captain-marvel':'training','scarlet-witch':'archives',ahsoka:'training',rey:'hearth',syl:'archives',
    shallan:'archives',yennefer:'hearth',jaina:'command',tyrande:'training',shadowheart:'hearth',
    amara:'command',aerith:'hearth',tifa:'training',hermione:'archives',misty:'command'
  };
  const familyLinks={
    elara:['cael','lyra'],tamsin:['orin','rook'],isolde:['selene','mira','lyra'],violet:['mira','darrow'],
    virginia:['darrow','cael'],'captain-marvel':['iron-man','captain-america'],'scarlet-witch':['zamorak','anakin'],
    ahsoka:['obi-wan','anakin'],rey:['obi-wan','cael'],syl:['cael','thor'],shallan:['mira','spider-man'],
    yennefer:['rook','zamorak'],jaina:['selene','star-lord'],tyrande:['orin','wolverine'],
    shadowheart:['daredevil','mira'],amara:['deadpool','orin'],aerith:['spider-man','captain-america'],
    tifa:['orin','darrow'],hermione:['selene','iron-man'],misty:['star-lord','lyra']
  };

  const active={
    scope:'schema-13-live',
    economy:{
      profileId:'everstead-economy-v1',
      configIdentity:'6abf706b4450f61a708a0baba5e431a374f8de085fbf614e7334b6071bca534f',
      freshGold:50000,
      buildingBaseRates,
      buildingLevelCap:52,
      buildingLevelMultiplier:1.15,
      buildingUpgradeBase:15000,
      buildingUpgradeGrowth:1.24,
      oathDailyCap:.30,
      fellowRoster:{numeratorBps:1500,kneePower:100000,capBps:1500},
      companionRoster:{numeratorBps:1000,kneePower:25000,capBps:1000}
    },
    fellow:{
      levelCap:120,expBase:100,expGrowth:1.12,levelPowerGrowth:.115,
      rarityMax:5,rarityShardCosts:[20,40,80,160],rarityPowerGrowth:.08,
      bondMilestonePower:0,bondMilestoneMax:99,
      companionTransferRate:.40,
      efficiency:{discountScale:.25,discountCap:.35},
      basePower:fellowBasePower
    },
    companion:{
      levelCap:100,expBase:80,expGrowth:1.12,rarityMax:5,
      rarityShardCosts:[20,40,80,160],levelPowerGrowth:.10,rarityPowerGrowth:.10,
      basePower:companionBasePower,
      rosterBasePowerTotal:companionCatalog.basePowerTotal,
      mastery:{pointsCap:50000,levelCap:50,thresholdFactor:20,powerPerLevel:.01}
    },
    family:{
      rarityMax:5,rarityShardCosts:[20,40,80,160],specialties:familySpecialties,links:familyLinks,
      buildingBonus:{cap:.20,base:.01,intimacyCap:.10,intimacyRate:.0002,rarityRate:.02,specialtyMatch:.01},
      linkedFellowBonus:{perFamilyCap:.09,intimacyCap:.05,intimacyRate:.0001,rarityRate:.01,aggregateCap:.12}
    },
    relic:{levelCap:10,bonusBpsBase:100,bonusBpsPerLevel:25},
    might:{pointsCap:50000,levelCap:50,thresholdFactor:20,powerPerLevel:.01},
    player:{rankCap:5,rankThresholds:[0,50,125,225,350]},
    campaign:{
      requirement:[22000,28500,36000,45000,56000,69000,84000,101000,121000,144000],
      baseCost:[10000,12000,14000,16000,18000,20000,22000,24000,26000,28000]
    },
    companionCampaign:{requirement:[2000,2360,2785,3286,3878,4576,5399,6371,7518,8871]},
    companionTower:{floorCap:50,requirementBase:2000,requirementGrowth:1.06,elapsedCapMs:86400000,intervalMs:3600000,pityForceAt:8},
    fellowExpedition:{stageCap:50,requirementBase:5500,requirementGrowth:1.08,elapsedCapMs:86400000,intervalMs:3600000,pityForceAt:8},
    collection:{
      status:'reserved-inactive',contributionBps:0,multiplier:1,authority:'none-in-phase-24a',
      futureLockedPolicy:{
        active:false,mode:'uncapped-additive-named-pools',mandatoryProgression:'permanent-only',
        releaseBudgetsAreLifetimeCaps:false,futureCollectionsContinueRewards:true,stressThroughBps:100000,
        applicationOrder:{
          power:'add beside Might/global Power after base roster aggregation; never multiply an already-boosted total',
          earnings:'add beside Oath and other additive earnings bonuses; never multiply an already-boosted total',
          exp:'add beside Campaign, event, and achievement EXP bonuses; never multiply an already-boosted total',
          facility:'add beside recipe, station, worker, and specialty bonuses; never multiply an already-boosted total'
        },
        claimPolicy:'manual exactly-once; migrations and limited-event protection required before activation'
      }
    }
  };

  const legacyOnly={
    buildingUpgradeGrowth:{value:1.70,active:false,scope:'schema-0-through-10-predecessor-only'},
    companionBasePower:{bramble:1000,cinderwing:1200,active:false,scope:'schema-12-migration-predecessor-only'}
  };

  const formulaOrder={
    fellowEconomy:['basePower','levelMultiplier','rarityMultiplier','relicMultiplier','globalMightMultiplier','round'],
    fellowCombat:['basePower','levelMultiplier','rarityMultiplier','bondMilestoneMultiplier','relicMultiplier','companionPowerTransfer','migrationTransferFloor','familyBondMultiplier','globalMightMultiplier','round'],
    companionActual:['basePower','levelMultiplier','rarityMultiplier','masteryMultiplier','round-per-member','sum-rounded-members'],
    companionThreshold:['actualRosterPower','migrationFloorRosterPower','max'],
    rosterBonus:['numeratorBps','rosterPower','divide-by-power-plus-knee','integer-floor','capBps'],
    building:['base','levelMultiplier','familyAssignmentMultiplier','fellowRosterMultiplier','companionRosterMultiplier','overallDayMultiplier','oathMultiplier'],
    campaignEfficiency:['totalRosterPower','recommendedPower','surplusRatio','discountScale','discountCap','baseCost','ceil']
  };

  const profiles=[
    {
      id:'phase24a.fresh.schema13.v1',kind:'canonical-fresh',persisted:false,
      sourceFixtureId:null,sourceKind:'true-schema13-default',label:'Fresh schema 13',frozenNow:1800000000000,
      inputs:{rank:1,migrationFloorRosterPower:0,investment:'released fresh defaults without predecessor protection'}
    },
    {
      id:'phase24a.migrated-established.schema13.v1',kind:'canonical-migrated-established',persisted:true,
      sourceFixtureId:'p23.qa.schema12-invested.v1',label:'Migrated established schema 13',frozenNow:1800000000000,
      inputs:{rank:1,migrationFloorRosterPower:2892,investment:'authenticated schema-12 Companion investment'}
    },
    {
      id:'phase24a.true-high-investment.schema13.v1',kind:'canonical-true-high-investment',persisted:false,
      sourceFixtureId:null,label:'True high investment · pure authority recipe',frozenNow:1800000000000,
      inputs:{rank:5,migrationFloorRosterPower:0,investment:'all currently released investment caps'}
    }
  ];
  const historicalAnchors={
    freshlyMigratedSchema12:{fellowCombatPower:36366,trueFreshFellowCombatPower:35565,migrationProtectionDelta:801,companionActualRosterPower:2200,protectedFellowIds:['cael','orin']}
  };

  const authority=deepFreeze({
    version:1,
    configId:'everstead-scaling-live-baseline.phase-24a.v1',
    status:'live-baseline-only',
    schemaVersion:13,
    active,
    legacyOnly,
    formulaOrder,
    profiles,
    historicalAnchors,
    sourceProof:{phase23CatalogManifestId:companionCatalog.manifestId,companionRosterBasePowerTotal:companionCatalog.basePowerTotal,storageAccess:false,mutators:false}
  });
  Object.defineProperty(global,'EVERSTEAD_PHASE24_SCALING',{configurable:false,enumerable:false,writable:false,value:authority});
})(globalThis);
