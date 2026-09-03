/* Everstead Phase 24C · inactive durable-ladder definition package. */
(function installEversteadPhaseTwentyFourCDurableDefinitions(global){
  'use strict';

  const freeze=value=>{
    if(value&&typeof value==='object'&&!Object.isFrozen(value)){
      for(const child of Object.values(value))freeze(child);
      Object.freeze(value);
    }
    return value;
  };

  const fellowIds=['cael','lyra','orin','selene','rook','mira','zamorak','darrow','deadpool','star-lord','iron-man','daredevil','thor','captain-america','spider-man','wolverine','obi-wan','anakin'];
  const familyIds=['elara','tamsin','isolde','violet','virginia','captain-marvel','scarlet-witch','ahsoka','rey','syl','shallan','yennefer','jaina','tyrande','shadowheart','amara','aerith','tifa','hermione','misty'];
  const facilityIds=['facility.command-center','facility.archives','facility.training-grounds','facility.hearth','facility.waystone','facility.restaurant','facility.apothecary','facility.schoolhouse','facility.market-workshop','facility.gatehouse','facility.gardens','facility.forge'];
  const rankExp=[0,50,125,225,350,500,675,875,1100,1350,1625,1925,2250,2600,2975,3375,3800,4250,4725,5225,5750,6300,6875,7475,8100,8750,9425,10125,10850,11600];
  const releasedRankDependencies=['story.book1.prologue.waystone-call','story.book1.rank2.roadbound-arrivals','story.book1.rank3.crossroads-arrivals','story.book1.rank4.skybridge-arrivals','story.book1.rank5.covenant-arrivals'];
  const rankTable=rankExp.map((totalExp,index)=>{
    const rank=index+1,released=rank<=5;
    return{
      id:`rank.${rank}.v1`,
      rank,
      totalExp,
      releaseState:released?'live-predecessor':'reserved',
      contentDependencyIds:released?[releasedRankDependencies[index]]:[`content.rank-${rank}.reserved`]
    };
  });

  const shardMilestoneTemplates=[
    {threshold:150,shards:5,predecessorId:'intimacy-150'},
    {threshold:300,shards:10,predecessorId:'intimacy-300'},
    {threshold:500,shards:20,predecessorId:'intimacy-600'},
    {threshold:1000,shards:40,predecessorId:'intimacy-1000'}
  ];
  const narrativeMilestoneTemplates=[
    {threshold:750,rewardKinds:['scene','quote-pack','chronicle-page','keepsake']},
    {threshold:1000,rewardKinds:['scene','promise-variant','chronicle-page','title']},
    {threshold:1500,rewardKinds:['scene','quote-pack','chronicle-page','cosmetic']},
    {threshold:2000,rewardKinds:['scene','promise-variant','chronicle-page','cosmetic']}
  ];
  const familyShardMilestones=familyIds.flatMap(familyId=>shardMilestoneTemplates.map(item=>({
    id:`family.${familyId}.shards.intimacy-${item.threshold}.v2`,
    familyId,
    kind:'family-shards',
    threshold:item.threshold,
    targetedShards:item.shards,
    predecessorClaimedMarkerId:item.predecessorId,
    definitionVersion:2,
    rewardVersion:1,
    releaseState:'reserved-inactive',
    manualClaim:true
  })));
  const familyNarrativeMilestones=familyIds.flatMap(familyId=>narrativeMilestoneTemplates.map(item=>({
    id:`family.${familyId}.narrative.intimacy-${item.threshold}.v1`,
    familyId,
    kind:'family-narrative',
    threshold:item.threshold,
    allowedRewardKinds:item.rewardKinds,
    definitionVersion:1,
    rewardVersion:1,
    releaseState:'reserved-until-authored',
    manualClaim:true,
    mechanicalPercentageAllowed:false
  })));

  const continuingThresholds=[1,5,15,35,75,150,300,600,1200,2400,4800];
  const legacyTracks=[
    ['oathkeeper','metric.oaths-completed-after-activation'],
    ['unbroken','metric.highest-oath-streak'],
    ['steward','metric.gold-claimed-after-activation'],
    ['builder','metric.combined-building-levels'],
    ['roadwarden','metric.campaign-first-clears'],
    ['veteran','metric.campaign-victories-after-activation'],
    ['fellowship','metric.combined-fellow-levels'],
    ['bonds-of-everstead','metric.relationship-milestones'],
    ['relic-keeper','metric.relic-progress'],
    ['chronicler','metric.story-scenes-completed'],
    ['trailblazer','metric.highest-fellow-expedition-stage'],
    ['towerkeeper','metric.highest-companion-tower-floor']
  ].map(([slug,metricId])=>({
    id:`legacy.track.${slug}.v2`,
    metricId,
    definitionVersion:2,
    releaseState:'reserved-inactive',
    thresholds:continuingThresholds,
    manualClaim:true,
    carriesProgress:true,
    genericPercentageRewardAllowed:false
  }));

  const collectionPools=[
    {id:'collection.pool.power',kind:'power',scope:'global',application:'beside-might'},
    {id:'collection.pool.earnings',kind:'earnings',scope:'global',application:'beside-oath'},
    {id:'collection.pool.exp',kind:'exp',scope:'eligible-fellow-and-companion-exp',application:'raw-exp-only'},
    {id:'collection.pool.facility',kind:'facility',scope:'one-facility-active-reward',application:'beside-authored-active-bonus'}
  ];

  const requirementTables=[
    {
      id:'requirements.broken-roads.book-1.v1',
      version:1,
      releaseState:'live-predecessor-frozen',
      roundingPolicy:'authored-integers',
      rows:[22000,28500,36000,45000,56000,69000,84000,101000,121000,144000]
    },
    {
      id:'requirements.companion-campaign.phase-23.v1',
      version:1,
      releaseState:'live-predecessor-frozen',
      roundingPolicy:'authored-integers',
      rows:[2000,2360,2785,3286,3878,4576,5399,6371,7518,8871]
    },
    {
      id:'requirements.companion-tower.phase-23.v1',
      version:1,
      releaseState:'live-predecessor-frozen',
      roundingPolicy:'round-nearest-integer-frozen',
      rows:[2000,2120,2247,2382,2525,2676,2837,3007,3188,3379,3582,3797,4024,4266,4522,4793,5081,5386,5709,6051,6414,6799,7207,7639,8098,8584,9099,9645,10223,10837,11487,12176,12907,13681,14502,15372,16295,17272,18309,19407,20571,21806,23114,24501,25971,27529,29181,30932,32788,34755]
    },
    {
      id:'requirements.fellow-expedition.phase-23.v1',
      version:1,
      releaseState:'live-predecessor-frozen',
      roundingPolicy:'round-nearest-integer-frozen',
      rows:[5500,5940,6415,6928,7483,8081,8728,9426,10180,10995,11874,12824,13850,14958,16155,17447,18843,20350,21978,23736,25635,27686,29901,32293,34876,37667,40680,43934,47449,51245,55345,59772,64554,69718,75296,81319,87825,94851,102439,110634,119485,129044,139367,150517,162558,175562,189607,204776,221158,238851]
    }
  ];

  const tutorials=[
    ['collection-first-ready','first-collection-set-ready','family.isolde'],
    ['collection-first-claim','first-collection-claim','fellow.lyra'],
    ['legacy-continuing-progress','first-continuing-legacy-progress','family.syl'],
    ['legacy-carried-tier-ready','first-carried-tier-ready','fellow.captain-america'],
    ['family-aligned-milestone','first-aligned-family-milestone-ready','family.elara'],
    ['number-breakdown','first-secondary-number-breakdown','fellow.iron-man']
  ].map(([slug,trigger,actorId])=>({
    id:`tutorial.phase-24c.${slug}.v1`,
    featureId:`feature.phase-24c.${slug}`,
    trigger,
    primaryActorId:actorId,
    fallbackActorId:'family.isolde',
    releaseState:'reserved-inactive',
    optional:true,
    skippable:true,
    replayable:true,
    rewardNeutral:true,
    maxAutoPresentPerSafeVisit:1
  }));

  const scheduledCastHooks=[
    'dialogue.facility.training-grounds.cael.tutorial-guide','dialogue.waystone.lyra.objective-guide','dialogue.facility.training-grounds.orin.activity-presenter','dialogue.facility.archives.selene.tutorial-guide','dialogue.facility.apothecary.rook.named-visitor','dialogue.facility.gatehouse.mira.tutorial-guide','dialogue.facility.forge.zamorak.named-visitor','dialogue.facility.command-center.darrow.activity-presenter','dialogue.facility.restaurant.deadpool.named-visitor','dialogue.facility.restaurant.star-lord.named-visitor','dialogue.facility.market-workshop.iron-man.tutorial-guide','dialogue.facility.apothecary.daredevil.named-visitor','dialogue.facility.training-grounds.thor.named-visitor','dialogue.legacy.captain-america.first-feat-guide','dialogue.facility.restaurant.spider-man.ambient','dialogue.facility.gatehouse.wolverine.ambient','dialogue.facility.schoolhouse.obi-wan.tutorial-guide','dialogue.facility.forge.anakin.named-visitor',
    'dialogue.facility.hearth.elara.tutorial-guide','dialogue.facility.restaurant.tamsin.banking-guide','dialogue.legacy.isolde.track-guide','dialogue.facility.archives.violet.ambient','dialogue.waystone.virginia.major-claim-comment','dialogue.facility.training-grounds.captain-marvel.activity-presenter','dialogue.facility.apothecary.scarlet-witch.tutorial-guide','dialogue.facility.schoolhouse.ahsoka.activity-presenter','dialogue.facility.gardens.rey.tutorial-guide','dialogue.legacy.syl.claim-guide','dialogue.facility.archives.shallan.named-visitor','dialogue.facility.apothecary.yennefer.activity-presenter','dialogue.facility.restaurant.jaina.named-route-visitor','dialogue.facility.hearth.tyrande.named-visitor','dialogue.facility.apothecary.shadowheart.ambient','dialogue.facility.command-center.amara.ambient','dialogue.facility.apothecary.aerith.claim-acknowledgement','dialogue.facility.restaurant.tifa.service-guide','dialogue.facility.schoolhouse.hermione.story-hook','dialogue.facility.restaurant.misty.ambient'
  ];
  const castCoverage=[
    ...fellowIds.map(id=>({actorId:`fellow.${id}`,roster:'fellow'})),
    ...familyIds.map(id=>({actorId:`family.${id}`,roster:'family'}))
  ].map((item,index)=>({
    ...item,
    verifiedCurrentContributionIds:[],
    scheduledContributionIds:[scheduledCastHooks[index]],
    coverageStatus:'scheduled-from-phase-15-21-cast-contract-runtime-cross-check-required',
    collectionTutorialSpeaker:index<6
  }));

  const facilityLadders=facilityIds.map(id=>({
    id:`ladder.${id}.v1`,
    facilityId:id,
    definitionVersion:1,
    releaseState:'reserved-inactive',
    localProgressAuthority:'existing-facility-state',
    claimAuthority:'phase-15-finalizer-and-archive',
    thresholds:[]
  }));

  const definitionBody={
    configId:'phase-24c-durable-foundation.v1',
    manifestId:'phase-24c-durable-foundation-manifest.v1',
    status:'inactive-foundation-only',
    schema:{predecessor:13,successorReserved:14,rootKey:'durableProgression'},
    predecessorScaling:{configId:'everstead-scaling-live-baseline.phase-24a.v1',sourceSha256:'819fd4e308a98c699ac01a0c3df780eab11e777d933038b118850679d0f39d5c'},
    acceptedSimulation:{
      simulationId:'phase24b.provisional-progression.v1',
      status:'simulation-lane-accepted-runtime-curves-provisional',
      contractSha256:'44a9a1366de9eb217f72f79289b89f7d9a0738cb50bc6c88901813e1eb32ab9e',
      candidateSha256:'00f37707f72e08ed71d9d649cda2155858740059c85f7799ed6705ee8544fb5a',
      generatorSha256:'e2f06fe9979fc32eb9649cd28efa7a901ecf4e36cdb329671b1d0a4c38996436',
      machineReportSha256:'45603077138a24be83f0a17968807305772f00cc94b92f6b1a5ad87459175324',
      humanReportSha256:'4883d1cb741958f03d7bf289d81e1575320c82457f3b17cddaa9458eae3d9dfb',
      modelManifestSha256:'fdf683f84b4339f4ba74c9c8c2c51a6c86cde96411056db277bc46f26882563d',
      independentQaContractSha256:'ff4e746a19df67a08063ed2f4025cbc65b6b5b18d588278cc65e82e0a1fec365',
      independentQaResultSha256:'e246427f055f02772017d1817af3410b764ba75bfa5b4384f523ecdb00153076',
      independentFixtureSha256:'6dc03c1b7c0119a324535f59373551ab2fc44f94a0aa5fe67657379965ed2b3f',
      independentVerifierSha256:'6ce5d7dfd69ba66dbaa89369a5d2453c5b965cf86ca002ca45ace172a681163c',
      independentManifestSha256:'d37bbc747f6a4a7bb37a03b20ba3d724cb8b283891a07ba054089d745a840f5c',
      tableHashes:{fellow:'36c9af018a8e098d4aa2ee068e427eee8aebf8824682842a6e559910e0a591e0',companion:'f88fd74c2fe50abf7c4718948996c46bf4aaa31d35d098e43ce8fd46676b18f6',releasedRequirements:'8780262c2fb105fd685704826cd1088571250f60af8a2e5b4eb666f9983d34f7'},
      runtimeCurveActivationApproved:false,
      breakthroughCostsApproved:false,
      rewardThroughputApproved:false
    },
    simulationPackages:[{
      id:'simulation.phase24b.provisional.v1',
      version:1,
      status:'provisional-baseline-only',
      artifactHashes:{
        contractSha256:'44a9a1366de9eb217f72f79289b89f7d9a0738cb50bc6c88901813e1eb32ab9e',
        candidateSha256:'00f37707f72e08ed71d9d649cda2155858740059c85f7799ed6705ee8544fb5a',
        generatorSha256:'e2f06fe9979fc32eb9649cd28efa7a901ecf4e36cdb329671b1d0a4c38996436',
        machineReportSha256:'45603077138a24be83f0a17968807305772f00cc94b92f6b1a5ad87459175324',
        humanReportSha256:'4883d1cb741958f03d7bf289d81e1575320c82457f3b17cddaa9458eae3d9dfb',
        modelManifestSha256:'fdf683f84b4339f4ba74c9c8c2c51a6c86cde96411056db277bc46f26882563d',
        independentQaContractSha256:'ff4e746a19df67a08063ed2f4025cbc65b6b5b18d588278cc65e82e0a1fec365',
        independentQaResultSha256:'e246427f055f02772017d1817af3410b764ba75bfa5b4384f523ecdb00153076',
        independentFixtureSha256:'6dc03c1b7c0119a324535f59373551ab2fc44f94a0aa5fe67657379965ed2b3f',
        independentVerifierSha256:'6ce5d7dfd69ba66dbaa89369a5d2453c5b965cf86ca002ca45ace172a681163c',
        independentManifestSha256:'d37bbc747f6a4a7bb37a03b20ba3d724cb8b283891a07ba054089d745a840f5c'
      },
      tableHashes:{fellow:'36c9af018a8e098d4aa2ee068e427eee8aebf8824682842a6e559910e0a591e0',companion:'f88fd74c2fe50abf7c4718948996c46bf4aaa31d35d098e43ce8fd46676b18f6',releasedRequirements:'8780262c2fb105fd685704826cd1088571250f60af8a2e5b4eb666f9983d34f7'},
      requirementActivationApproved:false,
      collectionGrantActivationApproved:false,
      runtimeCurveActivationApproved:false,
      rewardThroughputApproved:false
    }],
    releaseManifests:[{
      id:'release.phase-24c.foundation-reserved.v1',
      version:1,
      sequence:1,
      status:'reserved',
      active:false,
      contentDependencyIds:[],
      collectionGrantDefinitionIds:[],
      releasedRankThrough:5,
      permanentOnlyRequirementProfileId:null,
      requirementFixtureProfileIds:[],
      simulationPackageId:null,
      limitedContentRequired:false,
      activationEvidence:null
    }],
    rank:{capacityThrough:30,releasedThrough:5,table:rankTable},
    family:{ids:familyIds,shardMilestones:familyShardMilestones,narrativeMilestones:familyNarrativeMilestones,economicIntimacyCap:500},
    legacy:{defaultThresholds:continuingThresholds,tracks:legacyTracks},
    events:{firstSeasonFirstCompletion:{id:'event.first-season.first-completion.v1',releaseState:'reserved-inactive',thresholds:[15,35,60,85,110,135,155,170],progressCarries:true,claimsExpire:false}},
    facilities:{ids:facilityIds,ladders:facilityLadders},
    collections:{
      mode:'uncapped-additive-named-pools',
      pools:collectionPools,
      grantDefinitions:[],
      sharedLifetimeCapBps:null,
      overflowConversion:null,
      releaseBudgetsAreLifetimeCaps:false,
      futureCollectionsContinueRewards:true,
      mandatoryProgressionProfile:'permanent-only',
      stressThroughBps:100000,
      limitedNeverRerunsRequiresPermanentAlternative:true
    },
    requirements:{tables:requirementTables,permanentOnlyProfiles:[],runtimeUsesFrozenRowsOnly:true,authoringHelpersAreRuntimeAuthority:false},
    tutorials,
    cast:{fellowIds,familyIds,coverage:castCoverage},
    activation:{
      productionLoaded:false,
      activeReleaseIds:[],
      collectionPoolsStartAtZero:true,
      createClaimReadiness:false,
      provisionalCurvesActive:false,
      newUiActive:false,
      emptyOriginPolicy:'direct-current-schema-fresh-and-reset'
    }
  };

  Object.defineProperty(global,'EVERSTEAD_PHASE24C_DEFINITIONS',{
    configurable:false,
    enumerable:false,
    writable:false,
    value:freeze({version:1,...definitionBody})
  });
})(globalThis);
