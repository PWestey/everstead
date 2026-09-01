(() => {
  'use strict';
  const CHANNEL='everstead-phase-15-independent';
  const json=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');

  function installRuntime(config){
    const slots=new Map(),writes=[],errors=[],nativeStorageAccesses=[],nativeSetTimeout=setTimeout.bind(window),nativeClearTimeout=clearTimeout.bind(window);
    let saveIndex=0,transactionIndex=0,nativeStorageInstrumented=false;
    window.matchMedia=query=>({matches:config.viewport.reducedMotion&&query==='(prefers-reduced-motion: reduce)',media:query,onchange:null,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},dispatchEvent(){return false}});
    document.documentElement.style.fontSize=`${config.viewport.copyScale||1}em`;
    try{
      const nativeStorage=window.localStorage;
      for(const name of ['getItem','setItem','removeItem']){
        const original=Storage.prototype[name];
        Storage.prototype[name]=function(...args){if(this===nativeStorage)nativeStorageAccesses.push(`${name}:${String(args[0])}`);return original.apply(this,args)};
      }
      nativeStorageInstrumented=true;
    }catch{}
    addEventListener('error',event=>errors.push(String(event.error?.stack||event.message)));
    addEventListener('unhandledrejection',event=>errors.push(String(event.reason?.stack||event.reason)));
    const warn=console.warn.bind(console),error=console.error.bind(console);
    console.warn=(...args)=>{errors.push('console.warn '+args.join(' '));warn(...args)};
    console.error=(...args)=>{errors.push('console.error '+args.join(' '));error(...args)};
    const memoryStorage={
      getItem:key=>slots.get(String(key))??null,
      setItem:(key,value)=>{key=String(key);writes.push({op:'set',key,value:String(value)});slots.set(key,String(value))},
      removeItem:key=>{key=String(key);writes.push({op:'remove',key});slots.delete(key)}
    };
    Object.assign(window,{__P15I_CONFIG__:config,__P15I_SLOTS__:slots,__P15I_WRITES__:writes,__P15I_ERRORS__:errors,__P15I_NATIVE_ACCESSES__:nativeStorageAccesses,__P15I_NATIVE_INSTRUMENTED__:nativeStorageInstrumented});
    window.__EVERSTEAD_RUNTIME__={
      storage:memoryStorage,
      clock:{now:()=>config.fixtures.frozenNow,setTimeout:nativeSetTimeout,clearTimeout:nativeClearTimeout},
      random:()=>.375,
      confirm:()=>true,
      ids:{save:()=>`save-p15i-${++saveIndex}`,transaction:()=>`tx-p15i-${++transactionIndex}`},
      qa:{allowDestructive:true,isolatedStorage:true}
    };
  }

  function runSuite(){
    const config=window.__P15I_CONFIG__,f=config.fixtures,p13=config.phase13,results=[];
    const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    const until=async(predicate,limit=8000)=>{const started=performance.now();while(performance.now()-started<limit){if(predicate())return true;await wait(25)}return false};
    const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),unique=values=>new Set(values).size===values.length,sorted=values=>[...new Set(values)].sort();
    const add=(id,actual,detail='')=>results.push({id,actual:Boolean(actual),expected:true,pass:Boolean(actual),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
    const send=()=>parent.postMessage({channel:config.channel,nonce:config.nonce,results,errors:window.__P15I_ERRORS__.slice()},'*');
    const bridge=()=>window.__EVERSTEAD_PHASE_15_QA__;
    const safe=(label,fn)=>{try{return fn()}catch(error){add(label,false,error.stack||error.message);return null}};
    const call=(group,name,...args)=>safe(`${name}-call`,()=>bridge()[group][name](...args));
    const stateOf=snapshot=>snapshot?.state||null,revision=snapshot=>stateOf(snapshot)?.saveMeta?.revision;
    const migrationReceipts=state=>(state?.saveMeta?.appliedMigrations||[]).filter(item=>item?.id===f.phase12ActivationId);
    const facilityById=(id,data)=>(data?.board?.facilities||data?.facilities||[]).find(item=>item.id===id);
    const archiveOf=data=>data?.claimArchive||data?.claims?.archive||null;
    const opportunityRows=data=>data?.facility?.opportunities||data?.opportunities||[];
    const resourcesOf=data=>data?.resources||null,localOf=data=>data?.facility?.localProgress||data?.localProgress||null;
    const tutorialById=(id,data)=>(data?.tutorials?.items||data?.tutorials||[]).find(item=>item.id===id);

    (async()=>{
      await until(()=>bridge(),5000);
      const qa=bridge();
      add('bridge-present',Boolean(qa));
      if(!qa){add('phase15-contract-unavailable',false,'Expected before Phase 15 implementation: window.__EVERSTEAD_PHASE_15_QA__ is absent.');send();return}
      add('bridge-version',qa.version===f.bridgeVersion,qa.version);
      const requiredRead=['definitions','snapshot','validate','derive','raw','exportSave','passiveBaseline'];
      const requiredDestructive=['resetFixture','event','openFacility','settle','begin','cancel','resolve','claim','tutorial','advanceOffline','reload','importFixture','simulateConcurrent','probeFinalizerFailure','mutateInvalid'];
      add('bridge-read-surface',requiredRead.every(name=>typeof qa.read?.[name]==='function'),Object.keys(qa.read||{}));
      add('bridge-destructive-surface',requiredDestructive.every(name=>typeof qa.destructive?.[name]==='function'),Object.keys(qa.destructive||{}));
      if(!requiredRead.every(name=>typeof qa.read?.[name]==='function')||!requiredDestructive.every(name=>typeof qa.destructive?.[name]==='function')){send();return}

      const definitions=call('read','definitions');
      if(!definitions){send();return}
      const facilities=definitions.facilities||[],facilityIds=facilities.map(item=>item.id),mapAnchors=facilities.map(item=>item.mapAnchor),waystone=facilities.find(item=>item.id==='facility.waystone');
      add('definition-lineage',definitions.schemaVersion===12&&definitions.configId===f.boardConfigId&&definitions.definitionSetId===f.boardDefinitionSetId&&definitions.frameworkConfigId===f.frameworkConfigId&&definitions.phase12?.activationId===f.phase12ActivationId,definitions);
      add('twelve-stable-physical-anchors',same(facilityIds,f.facilities.map(item=>item.id))&&same(mapAnchors,f.facilities.map(item=>item.mapAnchor))&&unique(mapAnchors),{facilityIds,mapAnchors});
      add('four-state-contract',same(definitions.states,f.runtimeStates),definitions.states);
      add('story-capability-opening-map',facilities.every(item=>{const expected=f.facilities.find(row=>row.id===item.id);return item.discoveryContentId===expected.discoveryContentId&&item.requiredCapabilityId===expected.requiredCapabilityId&&item.openingContentId===expected.openingContentId&&item.targetPhase===expected.targetPhase}),facilities);
      add('waystone-authored-event-only',waystone?.generationMode==='authored-event'&&waystone?.intervalMs==null&&waystone?.bankCapacity==null&&waystone?.timedOpportunityEnabled===false,waystone);
      add('production-economy-remains-null',definitions.productionEconomyApproved===false&&facilities.filter(item=>item.generationMode==='interval').every(item=>item.intervalMs==null&&item.bankCapacity==null&&item.rewardPolicy==null),facilities);
      add('restaurant-runtime-not-required',definitions.phase16?.restaurantRuntimeRequired===false&&!facilities.find(item=>item.id==='facility.restaurant')?.capabilityEnabled,definitions.phase16);
      add('five-bottom-tabs-village-board',definitions.presentation?.bottomNavigationCount===5&&definitions.presentation?.boardSurface==='village.artwork'&&definitions.presentation?.detachedManagementGrid===false,definitions.presentation);
      const archivePolicy=definitions.archivePolicy||{};
      add('v2-archive-policy',archivePolicy.configId===f.claimArchiveConfigId&&archivePolicy.recentReceiptLimit===512&&archivePolicy.foldBatchSize===128&&archivePolicy.predecessorReplaySetFixed===true&&archivePolicy.domainReplayAuthority==='claimed-ordinal-ranges',archivePolicy);
      const tutorials=definitions.tutorials||[];
      add('phase15-tutorial-definitions',same(tutorials.map(item=>item.id),f.phase15TutorialIds)&&tutorials.every(item=>item.blocking===false&&item.skippable===true&&item.loggable===true&&item.replayable===true&&item.reward==null),tutorials);
      const castHooks=definitions.castHooks||[],actorIds=sorted(castHooks.map(item=>item.actorId));
      add('all-38-cast-hooks-resolve',same(actorIds,sorted(f.actorIds))&&castHooks.every(item=>item.registered===true&&item.mechanicalCopyIndependent===true),{count:castHooks.length,actorIds});
      add('trusted-finalizer-and-coordinator',definitions.claims?.sourceType===f.phase12ClaimSourceType&&definitions.claims?.immutableFinalizerRegistry===true&&definitions.claims?.singleCoordinatorCommit===true&&definitions.claims?.callerSuppliedCallbackAllowed===false,definitions.claims);

      const fresh=call('destructive','resetFixture',f.saveFixtures.fresh),freshValidation=call('read','validate'),freshSnapshot=call('read','snapshot'),freshDerived=call('read','derive');
      add('fresh-activation-valid-and-unique',fresh?.ok===true&&freshValidation?.ok===true&&stateOf(freshSnapshot)?.schemaVersion===12&&migrationReceipts(stateOf(freshSnapshot)).length===1,{fresh,validation:freshValidation,receipts:migrationReceipts(stateOf(freshSnapshot))});
      add('fresh-no-retroactive-facility-value',opportunityRows(freshDerived).length===0&&(freshDerived?.claims?.pending||freshDerived?.claims||[]).filter?.(item=>item.sourceType===f.phase12ClaimSourceType).length===0&&Number(freshDerived?.facility?.inventedCompletionCount||0)===0,freshDerived?.facility);

      const passiveBefore=call('read','passiveBaseline');
      const discovery=call('destructive','event','story.scene-resolved',{sceneId:'story.book1.prologue.waystone-call'}),afterWaystone=call('read','derive'),waystoneRow=facilityById('facility.waystone',afterWaystone);
      add('story-discovers-and-opens-waystone-once',discovery?.ok===true&&waystoneRow?.state==='available'&&waystoneRow?.discovered===true&&waystoneRow?.available===true,{discovery,waystoneRow});
      const repeatedDiscovery=call('destructive','event','story.scene-resolved',{sceneId:'story.book1.prologue.waystone-call'});
      add('story-discovery-repeat-write-free',repeatedDiscovery?.ok===false&&Number(repeatedDiscovery?.writes||0)===0,repeatedDiscovery);
      const restaurantDiscovery=call('destructive','event','story.scene-resolved',{sceneId:'story.book1.chapter1.village-toll.resolution'}),restaurantRow=facilityById('facility.restaurant',call('read','derive'));
      add('future-facility-discovered-not-opened',restaurantDiscovery?.ok===true&&restaurantRow?.state==='discovered'&&restaurantRow?.discovered===true&&restaurantRow?.available===false&&restaurantRow?.bankedCount===0,{restaurantDiscovery,restaurantRow});
      add('original-passive-buildings-unchanged-after-board-events',same(call('read','passiveBaseline'),passiveBefore),{before:passiveBefore,after:call('read','passiveBaseline')});

      call('destructive','resetFixture',f.saveFixtures.mixedBoard);
      const mixed=call('read','derive'),mixedRows=mixed?.board?.facilities||[],states=sorted(mixedRows.map(item=>item.state));
      add('mixed-board-covers-four-states',same(states,sorted(f.runtimeStates))&&mixedRows.length===12,{states,mixedRows});
      const readyRows=mixedRows.filter(item=>item.state==='ready');
      add('claim-ready-prioritizes-opportunity-ready',readyRows.length>0&&readyRows.every(item=>item.claimReadyCount>0?item.readyReason==='claim':true),readyRows);

      const empty=call('destructive','resetFixture',f.saveFixtures.syntheticEmpty),emptyDerived=call('read','derive'),emptyResources=resourcesOf(emptyDerived),emptyLocal=localOf(emptyDerived);
      const beforeInterval=call('destructive','settle',f.syntheticPolicy.facilityId,f.frozenNow+f.syntheticPolicy.intervalMs-1),beforeIntervalRows=opportunityRows(call('read','derive'));
      add('settlement-partial-carry-no-opportunity',empty?.ok===true&&beforeInterval?.ok===true&&beforeInterval?.createdCount===0&&beforeIntervalRows.length===0&&Number(beforeInterval?.carryMs)===f.syntheticPolicy.intervalMs-1,beforeInterval);
      call('destructive','resetFixture',f.saveFixtures.syntheticEmpty);
      const settlement=call('destructive','settle',f.syntheticPolicy.facilityId,f.frozenNow+3*f.syntheticPolicy.intervalMs),settled=call('read','derive'),settledRows=opportunityRows(settled);
      add('settlement-stable-ordinals-nonexpiring',settlement?.ok===true&&settlement?.createdCount===3&&same(settledRows.map(item=>item.ordinal),[1,2,3])&&settledRows.every(item=>item.status==='banked'&&item.expiresAt==null)&&unique(settledRows.map(item=>item.identity)),{settlement,settledRows});
      add('settlement-credits-nothing',same(resourcesOf(settled),emptyResources)&&same(localOf(settled),emptyLocal)&&!(settled?.claims?.pending||[]).length,{resources:resourcesOf(settled),local:localOf(settled),claims:settled?.claims});
      const saturation=call('destructive','settle',f.syntheticPolicy.facilityId,f.frozenNow+8*f.syntheticPolicy.intervalMs),saturatedRows=opportunityRows(call('read','derive'));
      add('bank-capacity-saturates-without-expiry',saturation?.ok===true&&saturatedRows.length===f.syntheticPolicy.bankCapacity&&saturatedRows.every(item=>item.expiresAt==null)&&saturation?.saturated===true&&saturation?.hiddenDebtMs===0,{saturation,saturatedRows});
      const rollbackRaw=call('read','raw'),rollback=call('destructive','settle',f.syntheticPolicy.facilityId,f.frozenNow-1);
      add('clock-rollback-write-free',rollback?.ok===true&&rollback?.createdCount===0&&Number(rollback?.writes||0)===0&&call('read','raw')===rollbackRaw,rollback);

      call('destructive','resetFixture',f.saveFixtures.syntheticBanked);
      const banked=opportunityRows(call('read','derive'))[0],begin=call('destructive','begin',banked.id,banked.identity),engaged=opportunityRows(call('read','derive'))[0],engagedRaw=call('read','raw');
      call('destructive','reload');const reloadedEngaged=opportunityRows(call('read','derive'))[0];
      add('engaged-opportunity-survives-reload',begin?.ok===true&&engaged?.status==='engaged'&&reloadedEngaged?.status==='engaged'&&reloadedEngaged?.identity===engaged?.identity&&call('read','raw')===engagedRaw,{begin,engaged,reloadedEngaged});
      const cancel=call('destructive','cancel',reloadedEngaged.id,reloadedEngaged.identity),cancelled=opportunityRows(call('read','derive'))[0];
      add('safe-cancel-rebanks',cancel?.ok===true&&cancelled?.status==='banked'&&cancelled?.identity===reloadedEngaged.identity,{cancel,cancelled});

      call('destructive','resetFixture',f.saveFixtures.syntheticEngaged);
      const engagedForResolve=opportunityRows(call('read','derive'))[0],beforeResolve=call('read','derive'),resolve=call('destructive','resolve',engagedForResolve.id,engagedForResolve.identity,{choiceId:'qa-valid-choice'}),resolved=call('read','derive'),claimReady=opportunityRows(resolved)[0];
      add('resolution-binds-versioned-outcome-no-credit',resolve?.ok===true&&claimReady?.status==='claim-ready'&&claimReady?.outcome?.definitionVersion===f.syntheticPolicy.definitionVersion&&claimReady?.outcome?.rewardPolicyVersion===f.syntheticPolicy.rewardPolicyVersion&&claimReady?.offerId&&same(resourcesOf(resolved),resourcesOf(beforeResolve))&&same(localOf(resolved),localOf(beforeResolve)),{resolve,claimReady});

      call('destructive','resetFixture',f.saveFixtures.syntheticClaimReady);
      const readyDerived=call('read','derive'),readyOpportunity=opportunityRows(readyDerived)[0],beforeClaimSnapshot=call('read','snapshot'),firstClaim=call('destructive','claim',readyOpportunity.offerId,readyOpportunity.offerIdentity),claimed=call('read','derive'),claimedArchive=archiveOf(claimed);
      add('manual-claim-one-transaction-global-local-receipt',firstClaim?.ok===true&&revision(call('read','snapshot'))===revision(beforeClaimSnapshot)+1&&firstClaim?.globalApplications===1&&firstClaim?.localApplications===1&&firstClaim?.receiptApplications===1&&opportunityRows(claimed).length===0&&claimedArchive?.nextSequence===1,{firstClaim,archive:claimedArchive});
      const claimedRaw=call('read','raw'),claimedResources=resourcesOf(claimed),claimedLocal=localOf(claimed),repeat=call('destructive','claim',readyOpportunity.offerId,readyOpportunity.offerIdentity);
      add('manual-claim-repeat-write-free',repeat?.ok===false&&Number(repeat?.writes||0)===0&&call('read','raw')===claimedRaw&&same(resourcesOf(call('read','derive')),claimedResources)&&same(localOf(call('read','derive')),claimedLocal),repeat);
      call('destructive','reload');const reloadClaimed=call('read','derive');
      add('claimed-lineage-persists-reload',call('read','raw')===claimedRaw&&same(resourcesOf(reloadClaimed),claimedResources)&&same(localOf(reloadClaimed),claimedLocal)&&archiveOf(reloadClaimed)?.nextSequence===1,reloadClaimed);

      for(const mode of ['missing','throw']){
        call('destructive','resetFixture',f.saveFixtures.syntheticClaimReady);const before=call('read','raw'),beforeDerived=call('read','derive'),failure=call('destructive','probeFinalizerFailure',mode);
        add(`finalizer-${mode}-atomic-refusal`,failure?.ok===false&&Number(failure?.writes||0)===0&&call('read','raw')===before&&same(resourcesOf(call('read','derive')),resourcesOf(beforeDerived))&&same(localOf(call('read','derive')),localOf(beforeDerived)),failure);
      }
      call('destructive','resetFixture',f.saveFixtures.syntheticClaimReady);const invalidBefore=call('read','raw'),invalidRows=f.invalidMutationChecks.map(kind=>call('destructive','mutateInvalid',kind));
      add('invalid-identity-version-source-mutations-refused',invalidRows.every((item,index)=>item?.ok===false&&item?.check===f.invalidMutationChecks[index]&&Number(item?.writes||0)===0)&&call('read','raw')===invalidBefore,invalidRows);

      for(const kind of ['settle','resolve','claim']){
        const race=call('destructive','simulateConcurrent',kind);
        add(`two-client-${kind}-one-winner`,race?.ok===true&&race?.winnerCount===1&&race?.loserCount===1&&race?.losingWrites===0&&race?.duplicateOpportunityCount===0&&race?.duplicateOutcomeCount===0&&race?.duplicateReceiptCount===0&&race?.globalApplications<=1&&race?.localApplications<=1&&race?.finalValid===true,race);
      }

      call('destructive','resetFixture',f.saveFixtures.archiveWindow);const archiveBefore=archiveOf(call('read','derive')),archiveReady=opportunityRows(call('read','derive'))[0],archiveClaim=call('destructive','claim',archiveReady.offerId,archiveReady.offerIdentity),archiveAfter=archiveOf(call('read','derive'));
      add('v2-archive-folds-512-plus-one',archiveBefore?.recentReceipts?.length===512&&archiveBefore?.throughSequence===0&&archiveClaim?.ok===true&&archiveAfter?.recentReceipts?.length===f.archivePolicy.expectedRecentAfterNextClaim&&archiveAfter?.throughSequence===f.archivePolicy.expectedThroughAfterNextClaim&&archiveAfter?.nextSequence===513,{before:archiveBefore,after:archiveAfter});
      const archiveState=stateOf(call('read','snapshot')),archiveFacilityRow=archiveState?.phase15FacilityFoundation?.facilitiesById?.[f.syntheticPolicy.facilityId],claimedRanges=archiveFacilityRow?.claimedOrdinalRanges||[],v1ReplaySetFixed=same(archiveAfter?.predecessorClaimedOfferIds||[],archiveBefore?.predecessorClaimedOfferIds||[]),v2OrdinalAuthority=Array.isArray(claimedRanges)&&claimedRanges.length>0&&claimedRanges.every(item=>Array.isArray(item)&&item.length===2&&Number.isSafeInteger(item[0])&&Number.isSafeInteger(item[1])&&item[0]>=1&&item[1]>=item[0]);
      add('archive-checkpoint-lineage-canonical',archiveAfter?.archiveCheckpoint?.receiptCount===128&&typeof archiveAfter?.archiveCheckpoint?.identity==='string'&&archiveAfter.archiveCheckpoint.identity.length>0&&v1ReplaySetFixed&&v2OrdinalAuthority&&archiveAfter?.recentReceipts?.every((item,index)=>item.sequence===archiveAfter.throughSequence+index+1)&&archiveAfter.throughSequence+archiveAfter.recentReceipts.length===archiveAfter.nextSequence,{archive:archiveAfter,claimedRanges,v1ReplaySetFixed,v2OrdinalAuthority});

      const exported=call('read','exportSave'),exportRaw=call('read','raw'),imported=call('destructive','importFixture',exported),afterImport=call('read','derive');
      add('export-import-preserves-successor-lineage',imported?.ok===true&&call('read','raw')===exportRaw&&same(archiveOf(afterImport),archiveAfter)&&call('read','validate')?.ok===true,{imported,archive:archiveOf(afterImport)});

      const migrated=call('destructive','resetFixture',f.saveFixtures.migrated),migratedDerived=call('read','derive'),migration=migratedDerived?.migration;
      add('schema12-migration-honest-and-empty',migrated?.ok===true&&call('read','validate')?.ok===true&&migration?.historicalFacilityBaseline==='unknown'&&migration?.inventedOpportunityCount===0&&migration?.inventedClaimCount===0&&migration?.inventedCompletionCount===0&&migrationReceipts(stateOf(call('read','snapshot'))).length===1,{migrated,migration});
      call('destructive','resetFixture',f.saveFixtures.established);const establishedBefore=call('read','passiveBaseline'),establishedRaw=call('read','raw');call('destructive','reload');
      add('established-reload-idempotent',call('read','raw')===establishedRaw&&same(call('read','passiveBaseline'),establishedBefore)&&call('read','validate')?.ok===true,call('read','snapshot'));

      call('destructive','resetFixture',f.saveFixtures.offline);const offlineBefore=call('read','derive'),offline=call('destructive','advanceOffline',f.offlineCapMs*2),offlineAfter=call('read','derive');
      add('offline-capped-and-never-resolves-or-claims',offline?.ok===true&&offline?.appliedMs===f.offlineCapMs&&opportunityRows(offlineAfter).every(item=>['banked','engaged'].includes(item.status))&&same(archiveOf(offlineAfter),archiveOf(offlineBefore))&&same(localOf(offlineAfter),localOf(offlineBefore))&&Number(offline?.rewardApplications||0)===0,{offline,before:offlineBefore,after:offlineAfter});

      call('destructive','resetFixture',f.saveFixtures.recovery);const recoveryBefore=call('read','derive'),recovery=call('destructive','reload'),recoveryAfter=call('read','derive');
      add('recovery-staging-one-authority-no-duplicates',recovery?.ok===true&&call('read','validate')?.ok===true&&unique(opportunityRows(recoveryAfter).map(item=>item.identity))&&archiveOf(recoveryAfter)?.nextSequence===archiveOf(recoveryBefore)?.nextSequence&&migrationReceipts(stateOf(call('read','snapshot'))).length===1,{recovery,before:recoveryBefore,after:recoveryAfter});

      call('destructive','resetFixture',f.saveFixtures.fresh);const corruptBefore=call('read','raw'),corruptRevision=revision(call('read','snapshot')),corrupt=call('destructive','resetFixture',f.saveFixtures.corrupt);
      add('corrupt-fixture-refused-and-preserved',corrupt?.ok===false&&Number(corrupt?.writes||0)===0&&same([...(corrupt?.failedChecks||[])].sort(),f.corruptChecks)&&call('read','raw')===corruptBefore&&revision(call('read','snapshot'))===corruptRevision,corrupt);
      const futureBefore=call('read','raw'),future=call('destructive','resetFixture',f.saveFixtures.future);
      add('future-state-fails-closed-and-exportable',future?.ok===false&&future?.reason==='future-version'&&future?.preservedForExport===true&&Number(future?.writes||0)===0&&call('read','raw')===futureBefore,future);

      call('destructive','resetFixture',f.saveFixtures.storyDiscovered);const tutorialId='tutorial.facility.board.discover-hotspots',tutorialResources=resourcesOf(call('read','derive')),tutorialOpen=call('destructive','tutorial',tutorialId,'open'),tutorialSkip=call('destructive','tutorial',tutorialId,'skip'),skipped=tutorialById(tutorialId,call('read','derive'));
      add('contextual-board-tutorial-skippable',tutorialOpen?.ok===true&&tutorialOpen?.trigger==='facilityFirstDiscovered'&&tutorialSkip?.ok===true&&skipped?.status==='dismissed'&&skipped?.featureAvailable===true&&same(resourcesOf(call('read','derive')),tutorialResources),{tutorialOpen,tutorialSkip,skipped});
      const tutorialRaw=call('read','raw'),tutorialState=call('read','derive')?.tutorials,replay=call('destructive','tutorial',tutorialId,'replay'),log=call('destructive','tutorial',tutorialId,'log');
      add('tutorial-log-and-replay-presentation-only',replay?.ok===true&&log?.ok===true&&call('read','raw')===tutorialRaw&&same(call('read','derive')?.tutorials,tutorialState)&&same(resourcesOf(call('read','derive')),tutorialResources),{replay,log});
      const metrics=call('read','derive')?.tutorials?.metrics;
      add('tutorial-gradual-safe-visit-cap',metrics?.maxAutoPresentedPerSurfaceVisit<=1&&metrics?.autoPresentedThisVisit<=1&&metrics?.suppressesDuringStory===true&&metrics?.suppressesDuringRecovery===true&&metrics?.suppressesDuringClaim===true&&metrics?.suppressesDuringResult===true,metrics);

      call('destructive','resetFixture',f.saveFixtures.lockedRoster);call('destructive','event','surface.opened',{surface:'village',userInitiated:true});const selectedSpeakers=call('read','derive')?.dialogue?.selectedSpeakers||[],joined=call('read','derive')?.roster?.joinedFellowIds||[];
      add('locked-fellows-never-speak',selectedSpeakers.every(value=>{const actorId=String(value);return !actorId.startsWith('fellow.')||joined.includes(actorId.slice('fellow.'.length))||joined.includes(actorId)}),{selectedSpeakers,joined});
      add('dialogue-fallback-policy',call('read','derive')?.dialogue?.allInstructionsSpeakerIndependent===true&&(call('read','derive')?.dialogue?.presentations||[]).every(item=>['approved-transparent-cutout','approved-framed-treatment','attributed-text-only'].includes(item.mode)&&item.unframedFullPortrait!==true),call('read','derive')?.dialogue);

      call('destructive','resetFixture',f.saveFixtures.mixedBoard);await wait(50);
      const navItems=[...document.querySelectorAll('[data-tab],nav button,[role="navigation"] button')].filter(node=>{const style=getComputedStyle(node);return style.display!=='none'&&style.visibility!=='hidden'}),board=document.querySelector('[data-phase15-facility-board]'),hotspots=[...document.querySelectorAll('[data-phase15-facility-id]')];
      add('actual-dom-five-nav-items',navItems.length===5,navItems.map(node=>node.textContent.trim()));
      add('actual-dom-board-and-twelve-hotspots',Boolean(board)&&hotspots.length===12&&same(hotspots.map(node=>node.dataset.phase15FacilityId),f.facilities.map(item=>item.id)),{board:Boolean(board),count:hotspots.length,ids:hotspots.map(node=>node.dataset.phase15FacilityId)});
      const domStateRows=hotspots.map(node=>({id:node.dataset.phase15FacilityId,anchor:node.dataset.phase15MapAnchor,state:node.dataset.phase15State,ariaHidden:node.getAttribute('aria-hidden'),disabled:node.matches(':disabled'),label:node.getAttribute('aria-label')||node.textContent.trim(),display:getComputedStyle(node).display,rect:node.getBoundingClientRect()}));
      const domStatesValid=domStateRows.every(row=>{const expected=f.facilities.find(item=>item.id===row.id);if(!expected||row.anchor!==expected.mapAnchor||!f.runtimeStates.includes(row.state))return false;if(row.state==='hidden')return row.ariaHidden==='true'&&row.disabled===true&&(row.display==='none'||row.rect.width===0);return row.label.length>0&&row.ariaHidden!=='true'&&row.disabled===false});
      add('actual-dom-anchor-state-accessibility',domStatesValid,domStateRows);
      const visibleHotspots=hotspots.filter(node=>getComputedStyle(node).display!=='none'&&node.getBoundingClientRect().width>0),viewportBounds=visibleHotspots.every(node=>{const rect=node.getBoundingClientRect();return rect.width>=44&&rect.height>=44&&rect.left>=0&&rect.top>=0&&rect.right<=innerWidth+1&&rect.bottom<=innerHeight+1});
      add('actual-dom-target-size-and-viewport-bounds',visibleHotspots.length>0&&viewportBounds,visibleHotspots.map(node=>({id:node.dataset.phase15FacilityId,rect:node.getBoundingClientRect()})));
      const noOverlap=visibleHotspots.every((left,index)=>visibleHotspots.slice(index+1).every(right=>{const a=left.getBoundingClientRect(),b=right.getBoundingClientRect(),overlapWidth=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left)),overlapHeight=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));return overlapWidth*overlapHeight===0}));
      add('actual-dom-focus-targets-do-not-overlap',noOverlap,visibleHotspots.map(node=>node.dataset.phase15FacilityId));
      const pageNoOverflow=document.documentElement.scrollWidth<=document.documentElement.clientWidth+1&&document.body.scrollWidth<=document.body.clientWidth+1;
      add('actual-dom-no-horizontal-overflow',pageNoOverflow,{document:[document.documentElement.clientWidth,document.documentElement.scrollWidth],body:[document.body.clientWidth,document.body.scrollWidth],copyScale:config.viewport.copyScale});
      const setupRaw=call('read','raw'),priorOverlay=document.querySelector('[data-overlay]'),priorOverlayKind=priorOverlay?.querySelector('[data-phase15-tutorial]')?'phase15-tutorial':priorOverlay?.querySelector('[data-phase13-tutorial]')?'phase13-tutorial':priorOverlay?.querySelector('[data-phase13-story]')?'phase13-story':priorOverlay?'other-overlay':'none';if(priorOverlay){document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await wait(30)}const setupOverlayCleared=document.querySelector('[data-overlay]')===null,setupNeutral=call('read','raw')===setupRaw;
      const opener=visibleHotspots.find(node=>node.dataset.phase15FacilityId===f.syntheticPolicy.facilityId);
      let focusSheetOk=false,focusReturnOk=false,escapeNeutral=false,sheetEvidence={openerId:opener?.dataset.phase15FacilityId||null,openerState:opener?.dataset.phase15State||null,onclickPresent:typeof opener?.onclick==='function',priorOverlayKind,priorOverlayHtml:priorOverlay?.innerHTML?.slice(0,500)||null,setupOverlayCleared,setupNeutral,overlayBeforeClick:document.querySelector('[data-overlay]')?.innerHTML?.slice(0,500)||null,overlayKind:null,sheetPresent:false,activeBeforeEscape:null,error:null};
      if(opener){const beforeOpenRaw=call('read','raw');try{opener.focus();opener.click();await wait(30);const overlay=document.querySelector('[data-overlay]'),sheet=document.querySelector('[data-phase15-facility-sheet]'),active=document.activeElement;sheetEvidence={...sheetEvidence,overlayKind:overlay?.querySelector('[data-phase15-tutorial]')?'phase15-tutorial':overlay?.querySelector('[data-phase13-story]')?'phase13-story':sheet?'phase15-facility-sheet':overlay?'other-overlay':'none',overlayHtml:overlay?.innerHTML?.slice(0,800)||null,sheetPresent:Boolean(sheet),activeBeforeEscape:active?.outerHTML?.slice(0,500)||null};focusSheetOk=Boolean(sheet)&&sheet.contains(active)&&Boolean(sheet.textContent.trim())&&Boolean(sheet.querySelector('[data-phase15-close]'))}catch(error){sheetEvidence.error=String(error?.stack||error?.message||error)}document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await wait(30);focusReturnOk=document.activeElement===opener;escapeNeutral=call('read','raw')===beforeOpenRaw}
      add('actual-dom-sheet-focus-and-escape',setupOverlayCleared&&setupNeutral&&focusSheetOk&&focusReturnOk&&escapeNeutral,{setupOverlayCleared,setupNeutral,focusSheetOk,focusReturnOk,escapeNeutral,activeAfterEscape:document.activeElement?.outerHTML?.slice(0,240),evidence:sheetEvidence});
      const waystoneHotspot=visibleHotspots.find(node=>node.dataset.phase15FacilityId==='facility.waystone');
      let waystoneSurfaceOk=false,waystoneNeutral=false;
      if(waystoneHotspot){const beforeWaystoneRaw=call('read','raw');waystoneHotspot.focus();waystoneHotspot.click();await wait(30);const gateway=document.querySelector('[data-phase15-facility-sheet] [data-phase15-open-legacy]'),contextTutorial=document.querySelector('[data-phase15-tutorial]');if(gateway){gateway.click();await wait(30)}const legacyHeading=[...document.querySelectorAll('[data-overlay] h2')].some(node=>node.textContent.trim()==='Legacy'),waystoneContextTutorial=Boolean(contextTutorial)&&Boolean(contextTutorial.textContent.trim());waystoneSurfaceOk=legacyHeading||waystoneContextTutorial;document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await wait(30);waystoneNeutral=call('read','raw')===beforeWaystoneRaw}
      add('actual-dom-waystone-opens-legacy-surface',Boolean(waystoneHotspot)&&waystoneSurfaceOk&&waystoneNeutral,{waystone:Boolean(waystoneHotspot),waystoneSurfaceOk,waystoneNeutral});
      const reducedOk=config.viewport.reducedMotion?[...document.querySelectorAll('[data-phase15-facility-board],[data-phase15-facility-id]')].every(node=>{const style=getComputedStyle(node);return style.animationName==='none'||style.animationDuration==='0s'}):true;
      add('actual-dom-reduced-motion-equivalence',reducedOk,{reducedMotion:config.viewport.reducedMotion});

      const passiveAfter=call('read','passiveBaseline');
      add('final-passive-baseline-preserved',same(passiveAfter,passiveBefore),{before:passiveBefore,after:passiveAfter});
      add('final-state-valid',call('read','validate')?.ok===true,call('read','validate'));
      add('native-storage-instrumented',window.__P15I_NATIVE_INSTRUMENTED__===true);
      add('zero-native-storage-accesses',window.__P15I_NATIVE_ACCESSES__.length===0,window.__P15I_NATIVE_ACCESSES__);
      add('zero-warning-error-console',window.__P15I_ERRORS__.length===0,window.__P15I_ERRORS__);
      send();
    })().catch(error=>{add('realm-fatal',false,error.stack||error.message);send()});
  }

  let nonce='unknown';
  (async()=>{
    const config=JSON.parse(window.name);nonce=config.nonce;window.name='';
    const response=await fetch('../../index.html',{cache:'no-store'});if(!response.ok)throw new Error(`index.html: HTTP ${response.status}`);
    let source=await response.text();
    const firstScript=source.indexOf('<script');if(firstScript<0)throw new Error('Production script tag missing');
    const bootstrap=`<script>(${installRuntime.toString()})(${json(config)})<\/script>`;
    const suite=`<script>(${runSuite.toString()})()<\/script>`;
    source=source.replace('<head>','<head><base href="../../">');
    const insertion=source.indexOf('<script');
    source=source.slice(0,insertion)+bootstrap+source.slice(insertion).replace('</body>',suite+'</body>');
    document.open();document.write(source);document.close();
  })().catch(error=>parent.postMessage({channel:CHANNEL,nonce,results:[{id:'realm-loader-fatal',actual:false,expected:true,pass:false,detail:error.stack||error.message}],errors:[String(error.stack||error.message)]},'*'));
})();
