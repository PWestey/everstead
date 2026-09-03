/* Everstead Phase 24C-2D · active Founding Table Collection production authority. */
(function installEversteadPhaseTwentyFourCFoundingTableReleaseAuthority(global){
  'use strict';

  const definitions=global.EVERSTEAD_PHASE24C_DEFINITIONS;
  const foundation=global.EVERSTEAD_PHASE24C_FOUNDATION;
  if(!definitions||definitions.version!==1||!foundation||foundation.version!==2)throw new Error('Frozen Phase 24C definitions and foundation v2 must load first');

  const EXPECTED_DEFINITIONS_SEMANTIC_SHA256='bcec7874519dc9a2cd6041ee56a9c681034ff064995d1357987dd73ff4631fd1';
  if(!foundation.validateDefinitions(definitions).ok||foundation.authorityHash(definitions)!==EXPECTED_DEFINITIONS_SEMANTIC_SHA256)throw new Error('The exact accepted Phase 24C definitions are required');

  const clone=value=>JSON.parse(JSON.stringify(value));
  const freeze=value=>{
    if(value&&typeof value==='object'&&!Object.isFrozen(value)){
      for(const child of Object.values(value))freeze(child);
      Object.freeze(value);
    }
    return value;
  };
  const identity=(kind,value)=>foundation.releaseSetIdentity(kind,value);
  const emptyTotals=()=>({powerBps:0,earningsBps:0,expBps:0,facilityBpsByFacilityId:{}});

  const RELEASE_ID='release.phase-24c2d.founding-table.v1';
  const GRANT_ID='collection.grant.restaurant.founding-table.facility.v1';
  const CLAIM_SOURCE_ID='collection.source.restaurant.founding-table.v1';
  const FACILITY_ID='facility.restaurant';
  const RECIPE_IDS=[
    'restaurant.recipe.hearth-stew',
    'restaurant.recipe.garden-flatbread',
    'restaurant.recipe.roadside-tea'
  ];
  const TUTORIAL_IDS=[
    'tutorial.phase-24c.collection-first-ready.v1',
    'tutorial.phase-24c.collection-first-claim.v1'
  ];
  const CONTENT_DEPENDENCY_IDS=[FACILITY_ID,...RECIPE_IDS,...TUTORIAL_IDS];
  const REQUIREMENT_TABLE_IDS=definitions.requirements.tables.map(row=>row.id).sort();
  const NONZERO_TOTALS={powerBps:0,earningsBps:0,expBps:0,facilityBpsByFacilityId:{[FACILITY_ID]:200}};

  const grant={
    id:GRANT_ID,
    releaseId:RELEASE_ID,
    definitionVersion:1,
    rewardVersion:1,
    classification:'permanent',
    permanentAlternativeId:null,
    claimSourceId:CLAIM_SOURCE_ID,
    targetPool:'facility',
    facilityId:FACILITY_ID,
    bps:200,
    releaseState:'active'
  };

  function makeProfile(slug,kind,contributingDefinitionIds){
    const totals=contributingDefinitionIds.length?clone(NONZERO_TOTALS):emptyTotals();
    const profile={
      id:`requirements.profile.phase-24c2d.founding-table.${slug}.v1`,
      version:1,
      kind,
      ownershipBand:kind,
      status:'accepted-private-candidate',
      contributingDefinitionIds:[...contributingDefinitionIds],
      collectionBpsByPool:totals,
      limitedContentRequired:false,
      requirementTableIds:[...REQUIREMENT_TABLE_IDS],
      fixtureReportIdentity:''
    };
    profile.fixtureReportIdentity=identity('fixture-report',{...clone(profile),fixtureReportIdentity:''});
    return profile;
  }

  const fixtureProfiles=[
    makeProfile('zero','zero-permanent',[]),
    makeProfile('median','median-permanent',[GRANT_ID]),
    makeProfile('high-permanent','high-permanent',[GRANT_ID]),
    makeProfile('high-all-content','high-all-content',[GRANT_ID])
  ];

  const evidenceReports={
    grantPlan:{
      id:'report.phase-24c2d.founding-table.grant-plan.v1',
      status:'approved-private-candidate',
      releaseId:RELEASE_ID,
      collectionName:'The Founding Table',
      requiredContentIds:[...CONTENT_DEPENDENCY_IDS],
      grant:clone(grant),
      manualClaimRequired:true,
      exactlyOnceRequired:true,
      schemaVersion:14
    },
    releaseBudget:{
      id:'report.phase-24c2d.founding-table.release-budget.v1',
      status:'approved-private-candidate',
      releaseId:RELEASE_ID,
      obtainablePermanentTotals:clone(NONZERO_TOTALS),
      obtainableLimitedTotals:emptyTotals(),
      obtainableHighAllTotals:clone(NONZERO_TOTALS),
      limitedContentRequired:false,
      releasedRankThrough:5,
      globalPoolGrants:0,
      facilityPoolGrantBps:200,
      facilityId:FACILITY_ID
    },
    longHorizon:{
      id:'report.phase-24c2d.founding-table.long-horizon.v1',
      status:'approved-private-candidate',
      releaseId:RELEASE_ID,
      horizonsDays:[30,90,365],
      cumulativeStressBps:[0,200,2500,5000,10000,25000,50000,100000],
      application:'base-active-facility-reward-plus-authored-active-bps-plus-local-collection-facility-bps',
      passiveBuildingGoldAffected:false,
      requirementRowsChanged:false,
      dynamicScalingAllowed:false
    },
    safeInteger:{
      id:'report.phase-24c2d.founding-table.safe-integer.v1',
      status:'approved-private-candidate',
      releaseId:RELEASE_ID,
      authoredBps:200,
      cumulativeStressThroughBps:100000,
      integerBasisPointsOnly:true,
      exactRationalEvaluationRequired:true,
      alreadyBoostedTotalMultiplicationAllowed:false,
      unsafeSerializationMustRefuse:true
    },
    fixtureMatrix:{
      id:'report.phase-24c2d.founding-table.fixture-matrix.v1',
      status:'approved-private-candidate',
      releaseId:RELEASE_ID,
      fixtureProfileIds:fixtureProfiles.map(profile=>profile.id),
      fixtureKinds:fixtureProfiles.map(profile=>profile.kind),
      requirementTableIds:[...REQUIREMENT_TABLE_IDS],
      limitedContentRequired:false
    }
  };
  const evidenceReportHashes=Object.fromEntries(Object.entries(evidenceReports).map(([key,value])=>[`${key}Sha256`,foundation.sha256(foundation.canonicalStringify(value))]));

  const simulationPackage={
    id:'simulation.phase-24c2d.founding-table.approved.v1',
    version:1,
    status:'approved-private-candidate',
    artifactHashes:clone(evidenceReportHashes),
    tableHashes:{
      fellow:definitions.acceptedSimulation.tableHashes.fellow,
      companion:definitions.acceptedSimulation.tableHashes.companion,
      releasedRequirements:definitions.acceptedSimulation.tableHashes.releasedRequirements,
      restaurantContent:foundation.sha256(foundation.canonicalStringify(CONTENT_DEPENDENCY_IDS)),
      collectionRelease:foundation.sha256(foundation.canonicalStringify([grant,...fixtureProfiles]))
    },
    requirementActivationApproved:false,
    collectionGrantActivationApproved:true,
    runtimeCurveActivationApproved:false,
    rewardThroughputApproved:true
  };

  const authority=clone(definitions);
  authority.simulationPackages.push(clone(simulationPackage));
  authority.collections.grantDefinitions.push(clone(grant));
  authority.requirements.permanentOnlyProfiles.push(...clone(fixtureProfiles));
  for(const tutorial of authority.tutorials)if(TUTORIAL_IDS.includes(tutorial.id))tutorial.releaseState='active';

  const release={
    id:RELEASE_ID,
    version:1,
    sequence:2,
    status:'active',
    active:true,
    contentDependencyIds:[...CONTENT_DEPENDENCY_IDS],
    collectionGrantDefinitionIds:[GRANT_ID],
    releasedRankThrough:5,
    permanentOnlyRequirementProfileId:fixtureProfiles.find(profile=>profile.kind==='high-permanent').id,
    requirementFixtureProfileIds:fixtureProfiles.map(profile=>profile.id),
    simulationPackageId:simulationPackage.id,
    limitedContentRequired:false,
    activationEvidence:null
  };
  authority.releaseManifests.push(release);
  authority.activation.productionLoaded=true;
  authority.activation.activeReleaseIds=[RELEASE_ID];
  authority.activation.collectionPoolsStartAtZero=true;
  authority.activation.createClaimReadiness=true;
  authority.activation.provisionalCurvesActive=false;
  authority.activation.newUiActive=true;

  const sortedGrants=[clone(grant)];
  const sortedTables=clone(authority.requirements.tables).sort((left,right)=>left.id.localeCompare(right.id));
  const sortedProfiles=clone(fixtureProfiles).sort((left,right)=>left.id.localeCompare(right.id));
  const highPermanent=clone(fixtureProfiles.find(profile=>profile.kind==='high-permanent'));
  release.activationEvidence={
    predecessorScalingIdentity:identity('predecessor-scaling',authority.predecessorScaling),
    simulationPackageIdentity:identity('simulation-package',simulationPackage),
    contentDependencySetIdentity:identity('content-dependencies',[...CONTENT_DEPENDENCY_IDS].sort()),
    rankDefinitionSetIdentity:identity('rank-definitions',[]),
    collectionGrantDefinitionSetIdentity:identity('collection-grants',sortedGrants),
    requirementTableSetIdentity:identity('requirement-tables',sortedTables),
    fixtureProfileSetIdentity:identity('fixture-profiles',sortedProfiles),
    permanentOnlyProfileIdentity:identity('permanent-only-profile',highPermanent),
    obtainablePermanentTotals:clone(NONZERO_TOTALS),
    obtainableLimitedTotals:emptyTotals(),
    obtainableHighAllTotals:clone(NONZERO_TOTALS),
    releaseBudgetReportSha256:evidenceReportHashes.releaseBudgetSha256,
    longHorizonReportSha256:evidenceReportHashes.longHorizonSha256,
    safeIntegerReportSha256:evidenceReportHashes.safeIntegerSha256
  };

  const authorityValidation=foundation.validateReleaseAuthority(authority);
  if(!authorityValidation.ok)throw new Error(`Founding Table release authority is invalid: ${authorityValidation.errors.join(', ')}`);

  const authorityHash=foundation.authorityHash(authority);
  const releaseManifestHash=foundation.releaseManifestHash(authority,RELEASE_ID);
  const publicAuthority={
    version:1,
    authorityId:'phase-24c2d-founding-table-release-authority.v1',
    manifestId:'phase-24c2d-founding-table-release-authority-manifest.v1',
    status:'active-production-successor-release-authority',
    productionLoaded:true,
    schemaVersion:14,
    purpose:'authorize-and-run-one-permanent-manual-claim-restaurant-facility-collection-release',
    supersedesAuthorityId:'phase-24c2c-zero-activation-authority.v1',
    acceptedSourceAuthority:{
      definitionsFileSha256:'101377044214d87478475ba9064c4342b9ce8fcbe62e5d4e1743a08f31767f70',
      definitionsSemanticSha256:EXPECTED_DEFINITIONS_SEMANTIC_SHA256,
      foundationFileSha256:'fbf9c7865977b195786c15ffe6b6725649b5c6552c8f46b831421083831e4479',
      zeroActivationAuthorityFileSha256:'88ba60568041b764794b74dec6b926e34890354d6c13175491f5f87c4c92a03f',
      zeroActivationAuthoritySemanticSha256:'556641d1997d7cee1734e79da510141154f00be97a21138f08bc088de2e68aaf',
      deployedCommit:'2770bb95a970eaef93db65fe4ade39172943fc5e',
      deployedIndexSha256:'7073db350bddfdea932bf89d900a449346c2e3e6b2b636bf55a1e8f8f3aa3356',
      restaurantSourceSha256:'925c71c864489876d3ed06d1b0a158a4e3f0f6405bba27b31534456471f11454'
    },
    releaseContract:{
      releaseId:RELEASE_ID,
      collectionName:'The Founding Table',
      grantId:GRANT_ID,
      claimSourceId:CLAIM_SOURCE_ID,
      targetPool:'facility',
      facilityId:FACILITY_ID,
      bps:200,
      classification:'permanent',
      contentDependencyIds:[...CONTENT_DEPENDENCY_IDS],
      limitedContentRequired:false,
      releasedRankThrough:5,
      globalPoolsActivated:[],
      provisionalCurvesActivated:false,
      runtimeIntegrationAuthorized:true
    },
    evidenceReports:clone(evidenceReports),
    evidenceReportHashes:clone(evidenceReportHashes),
    authorityHash,
    releaseManifestHash,
    authority:clone(authority)
  };

  Object.defineProperty(global,'EVERSTEAD_PHASE24C2D_FOUNDING_TABLE_AUTHORITY',{
    configurable:false,
    enumerable:false,
    writable:false,
    value:freeze(publicAuthority)
  });
})(globalThis);
