(()=>{
  'use strict';

  const predecessor=globalThis.EVERSTEAD_PUBLIC_RELEASE_PROFILE;
  if(!predecessor||predecessor.id!=='everstead.release-profile.limited-public-preview.v1'||predecessor.schemaVersion!==14)throw new Error('The Phase 24D release profile is unavailable for the Chapter I successor');
  const freeze=value=>{
    if(value&&typeof value==='object'&&!Object.isFrozen(value)){
      for(const item of Object.values(value))freeze(item);
      Object.freeze(value);
    }
    return value;
  };
  const excluded=predecessor.previewExcludedSystems.filter(id=>id!=='extended-book-one');
  excluded.unshift('book-one-chapters-two-through-finale');
  const profile=freeze({
    version:1,
    authorityId:'phase-24g-chapter-one-public-release-profile.v1',
    id:'everstead.release-profile.chapter-one-preview.v1',
    profileRole:'current-public-profile',
    canonicalCurrentProfile:true,
    label:'Chapter I Public Preview',
    status:'active',
    deployment:predecessor.deployment,
    schemaVersion:14,
    audience:predecessor.audience,
    savePolicy:predecessor.savePolicy,
    predecessorProfileId:predecessor.id,
    historicalProfileGlobal:'EVERSTEAD_PUBLIC_RELEASE_PROFILE',
    activeSystems:[...predecessor.activeSystems,'book-one-chapter-one'],
    previewExcludedSystems:excluded,
    assetPolicy:{...predecessor.assetPolicy},
    promises:{...predecessor.promises},
    rewardPolicy:{chapterOneExtensionRewardNeutral:true,existingPhase13ClaimsUnchanged:true}
  });
  Object.defineProperty(globalThis,'EVERSTEAD_PHASE24G_PUBLIC_RELEASE_PROFILE',{configurable:false,enumerable:true,writable:false,value:profile});
})();
