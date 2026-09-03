(()=>{
  'use strict';

  const freeze=value=>{
    if(value&&typeof value==='object'&&!Object.isFrozen(value)){
      for(const item of Object.values(value))freeze(item);
      Object.freeze(value);
    }
    return value;
  };

  const profile=freeze({
    version:1,
    authorityId:'phase-24d-limited-public-preview-release-profile.v1',
    id:'everstead.release-profile.limited-public-preview.v1',
    label:'Limited Public Preview',
    status:'active',
    deployment:'github-pages',
    schemaVersion:14,
    audience:'invited preview players',
    savePolicy:'browser-local-with-manual-recovery-export',
    acceptedPredecessor:{
      commit:'db25dc01b48e32ddd873496407b69e047f8d4e1f',
      indexSha256:'cc444aaab670eef836b9fe09a0e2389739c14b8bdf41db734216291f2399ff20',
      releaseAuthorityId:'phase-24c2d-founding-table-release-authority.v1'
    },
    activeSystems:[
      'oaths',
      'village-passive-economy',
      'fellow-family-companion-rosters',
      'fellow-campaign',
      'fellow-expedition',
      'companion-campaign',
      'companion-tower',
      'first-covenant-opening',
      'founding-table-collection'
    ],
    previewExcludedSystems:[
      'extended-book-one',
      'legacy-v2',
      'family-romance',
      'rotating-events',
      'private-facility-runtimes',
      'long-horizon-level-curves'
    ],
    assetPolicy:{
      rightsLimitedCompanionPortraitsDeployed:false,
      publicFallback:'original-everstead-companion-crest',
      privateAssetPathsAllowed:false
    },
    promises:{
      noGacha:true,
      noPaidProgression:true,
      noRankingPressure:true,
      manualClaims:true,
      saveCompatibilityRequired:true
    }
  });

  Object.defineProperty(globalThis,'EVERSTEAD_PUBLIC_RELEASE_PROFILE',{configurable:false,enumerable:true,writable:false,value:profile});
})();
