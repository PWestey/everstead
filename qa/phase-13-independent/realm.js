(() => {
  'use strict';
  const CHANNEL='everstead-phase-13-independent';
  const json=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');

  function installRuntime(config){
    const slots=new Map(),writes=[],errors=[],nativeStorageAccesses=[],nativeSetTimeout=setTimeout.bind(window),nativeClearTimeout=clearTimeout.bind(window);
    let saveIndex=0,transactionIndex=0,nativeStorageInstrumented=false;
    window.matchMedia=query=>({matches:config.viewport.reducedMotion&&query==='(prefers-reduced-motion: reduce)',media:query,onchange:null,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},dispatchEvent(){return false}});
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
    Object.assign(window,{
      __P13I_CONFIG__:config,__P13I_SLOTS__:slots,__P13I_WRITES__:writes,__P13I_ERRORS__:errors,
      __P13I_NATIVE_ACCESSES__:nativeStorageAccesses,__P13I_NATIVE_INSTRUMENTED__:nativeStorageInstrumented
    });
    window.__EVERSTEAD_RUNTIME__={
      storage:memoryStorage,
      clock:{now:()=>config.fixtures.frozenNow,setTimeout:nativeSetTimeout,clearTimeout:nativeClearTimeout},
      random:()=>.375,
      confirm:()=>true,
      ids:{save:()=>`save-p13i-${++saveIndex}`,transaction:()=>`tx-p13i-${++transactionIndex}`},
      qa:{allowDestructive:true,isolatedStorage:true}
    };
  }

  function runSuite(){
    const config=window.__P13I_CONFIG__,f=config.fixtures,results=[];
    const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    const until=async(predicate,limit=8000)=>{const started=performance.now();while(performance.now()-started<limit){if(predicate())return true;await wait(25)}return false};
    const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
    const stableId=/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)+$/;
    const add=(id,actual,detail='')=>results.push({id,actual:Boolean(actual),expected:true,pass:Boolean(actual),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
    const send=()=>parent.postMessage({channel:config.channel,nonce:config.nonce,results,errors:window.__P13I_ERRORS__.slice()},'*');
    const bridge=()=>window.__EVERSTEAD_PHASE_13_QA__;
    const safe=(label,fn)=>{try{return fn()}catch(error){add(label,false,error.stack||error.message);return null}};
    const stateOf=snapshot=>snapshot?.state||null;
    const revision=snapshot=>stateOf(snapshot)?.saveMeta?.revision;
    const migrationReceipts=state=>(state?.saveMeta?.appliedMigrations||[]).filter(item=>item?.id===f.schema.phase12ActivationId);
    const claimById=(id,data)=>(data?.claims||[]).find(item=>item.id===id);
    const tutorialById=(id,data)=>(data?.tutorials?.items||data?.tutorials||[]).find(item=>item.id===id);
    const historyCount=(id,data)=>(data?.story?.history||[]).filter(item=>(item.id||item.sceneId)===id).length;
    const pendingCount=(id,data)=>(data?.story?.pendingIds||[]).filter(value=>value===id).length;
    const call=(group,name,...args)=>safe(`${name}-call`,()=>bridge()[group][name](...args));

    (async()=>{
      await until(()=>bridge(),5000);
      const qa=bridge();
      add('bridge-present',Boolean(qa));
      if(!qa){add('phase13-contract-unavailable',false,'Expected before Phase 13 implementation: window.__EVERSTEAD_PHASE_13_QA__ is absent.');send();return}
      add('bridge-version',qa.version===f.bridgeVersion,qa.version);
      const requiredRead=['definitions','snapshot','validate','derive','renderModel','raw'];
      const requiredDestructive=['resetFixture','event','story','tutorial','claim','advanceOffline','reload','simulateConcurrentClaim','probeLegacy'];
      add('bridge-read-surface',requiredRead.every(name=>typeof qa.read?.[name]==='function'),Object.keys(qa.read||{}));
      add('bridge-destructive-surface',requiredDestructive.every(name=>typeof qa.destructive?.[name]==='function'),Object.keys(qa.destructive||{}));
      if(!requiredRead.every(name=>typeof qa.read?.[name]==='function')||!requiredDestructive.every(name=>typeof qa.destructive?.[name]==='function')){send();return}

      const definitions=call('read','definitions');
      if(!definitions){send();return}
      const scenes=definitions.scenes||[],sceneIds=scenes.map(item=>item.id),sceneById=new Map(scenes.map(item=>[item.id,item]));
      const tutorials=definitions.tutorials||[],tutorialIds=tutorials.map(item=>item.id);
      const fellows=definitions.cast?.fellows||[],family=definitions.cast?.family||[],speakerSet=new Set([...fellows.map(item=>`fellow:${item.id}`),...family.map(item=>`family:${item.id}`)]);
      add('definition-schema-and-phase12-seam',definitions.schemaVersion===12&&definitions.phase12?.activationId===f.schema.phase12ActivationId&&definitions.phase12?.sharedClaims===true&&definitions.phase12?.sharedEvents===true&&definitions.phase12?.sharedTutorialState===true,definitions.phase12);
      add('five-story-identities',same(sceneIds,f.storyIds),sceneIds);
      const invalidScenes=[];
      for(const scene of scenes){
        const beatIds=(scene.beats||[]).map(item=>item.id),speakers=(scene.beats||[]).map(item=>`${item.speaker?.roster}:${item.speaker?.id}`);
        if(!stableId.test(scene.id)||(scene.beats||[]).length<4||(scene.beats||[]).length>8||new Set(beatIds).size!==beatIds.length||speakers.some(id=>!speakerSet.has(id))||!f.requiredControls.every(control=>(scene.controls||[]).includes(control))||scene.skippable!==true||scene.replayable!==true||scene.loggable!==true)invalidScenes.push({id:scene.id,beatIds,speakers,controls:scene.controls});
      }
      add('scene-beats-controls-and-references',invalidScenes.length===0,invalidScenes);
      const speakerMismatches=f.storyIds.filter(id=>!same([...new Set((sceneById.get(id)?.beats||[]).map(beat=>`${beat.speaker?.roster}:${beat.speaker?.id}`))],f.storySpeakerIds[id]));
      add('scene-speaker-plan',speakerMismatches.length===0,speakerMismatches);
      add('opening-scenes-no-playback-reward',f.storyIds.filter(id=>id!=='story.book1.chapter1.village-toll.resolution').every(id=>sceneById.get(id)?.playbackReward==null));

      add('phase13-tutorial-identities',same(tutorialIds,f.phase13TutorialIds),{actualCount:tutorialIds.length,expectedCount:f.phase13TutorialIds.length});
      const invalidTutorials=tutorials.filter(item=>!stableId.test(item.id)||item.blocking!==false||item.skippable!==true||item.replayable!==true||item.loggable!==true||item.reward!=null||item.gameplayPrerequisite===true||!speakerSet.has(item.speaker?.primary));
      add('tutorial-definition-safety',invalidTutorials.length===0,invalidTutorials.map(item=>item.id));
      add('tutorial-coverage-ledger-79',same(definitions.tutorialCoverageIds||[],f.allTutorialCoverageIds),{actual:(definitions.tutorialCoverageIds||[]).length,expected:79});
      const dispositions=definitions.notPlayerVisible||[];
      add('phase12-and-14-explicitly-not-player-visible',[12,14].every(phase=>dispositions.some(item=>item.phase===phase&&typeof item.reason==='string'&&item.reason.length>0)),dispositions);

      const fellowIds=fellows.map(item=>item.id),familyIds=family.map(item=>item.id),coverageFailures=[];
      for(const item of [...fellows,...family])for(const field of f.requiredCoverageFields){const value=item[field];if(field==='profileQuoteId'?!stableId.test(value):!Array.isArray(value)||value.length<1||!value.every(stableId.test.bind(stableId)))coverageFailures.push(`${item.id}:${field}`)}
      add('cast-manifest-exact-18-and-20',same(fellowIds,f.fellowIds)&&same(familyIds,f.familyIds),{fellowIds,familyIds});
      add('cast-coverage-38',coverageFailures.length===0,coverageFailures);
      const rankFailures=fellows.filter(item=>item.joinRank!==f.fellowJoinRanks[item.id]).map(item=>({id:item.id,joinRank:item.joinRank}));
      add('fellow-join-ranks-preserved',rankFailures.length===0,rankFailures);

      const opening=definitions.openingPresentations||[],openingFailures=[];
      for(const required of f.openingArtRequirements){
        const item=opening.find(candidate=>candidate.speaker===required.speaker);
        if(!item||!f.approvedOpeningPresentationModes.includes(item.mode)||item.fullPortrait!==required.fullPortrait)openingFailures.push({speaker:required.speaker,reason:'missing-or-mode'});
        else if(item.mode==='transparent-cutout'&&(!/\.(?:png|webp)$/i.test(item.dialogueAsset||'')||item.dialogueAsset===item.fullPortrait))openingFailures.push({speaker:required.speaker,reason:'bad-cutout'});
        else if(item.mode==='approved-framed'&&item.reviewed!==true)openingFailures.push({speaker:required.speaker,reason:'framed-not-reviewed'});
        else if(item.mode==='attributed-text-only'&&item.dialogueAsset!=null)openingFailures.push({speaker:required.speaker,reason:'text-only-requests-image'});
        else if(item.unframedFullPortrait===true)openingFailures.push({speaker:required.speaker,reason:'unframed-full-portrait'});
      }
      const openingDuplicates=f.openingArtRequirements.filter(required=>opening.filter(item=>item.speaker===required.speaker).length!==1).map(item=>item.speaker);
      add('opening-art-policy',opening.length>=4&&openingFailures.length===0&&openingDuplicates.length===0,{failures:openingFailures,duplicates:openingDuplicates});
      add('legacy-modes-dormant',f.requiredLegacyModes.every(id=>definitions.legacyModes?.[id]===false),definitions.legacyModes);
      add('chronicle-under-more-no-sixth-nav',definitions.presentation?.chronicleSurface==='more.chronicle'&&definitions.presentation?.bottomNavigationCount===5,definitions.presentation);

      const fresh=call('destructive','resetFixture',f.fixtures.fresh),freshValidation=call('read','validate');
      add('fresh-fixture-valid',fresh?.ok===true&&freshValidation?.ok===true&&stateOf(call('read','snapshot'))?.schemaVersion===12,{fresh,freshValidation});
      const freshResources=call('read','derive')?.resources;
      const freshOpen=call('destructive','event','surface.opened',{surface:'village',userInitiated:true}),freshDerived=call('read','derive');
      add('fresh-waystone-once',freshOpen?.ok===true&&freshDerived?.story?.activeId===f.storyIds[0]&&pendingCount(f.storyIds[0],freshDerived)<=1,{freshOpen,story:freshDerived?.story});
      call('destructive','event','surface.opened',{surface:'village',userInitiated:true});
      const repeatedFresh=call('read','derive');
      add('fresh-waystone-no-duplicate-queue',repeatedFresh?.story?.activeId===f.storyIds[0]&&pendingCount(f.storyIds[0],repeatedFresh)<=1,repeatedFresh?.story);
      const watch=call('destructive','story',f.storyIds[0],'watch'),watched=call('read','derive');
      add('waystone-watch-no-reward',watch?.ok===true&&same(watched?.resources,freshResources)&&historyCount(f.storyIds[0],watched)===1&&!(watched?.claims||[]).some(item=>item.sourceId===f.storyIds[0]),{watch,story:watched?.story});
      add('council-not-forced-over-current-action',watched?.story?.activeId==null&&!watched?.story?.pendingIds?.includes(f.storyIds[1]),watched?.story);
      call('destructive','event','surface.opened',{surface:'village',userInitiated:true});
      const councilReady=call('read','derive');
      add('council-next-safe-village-visit',councilReady?.story?.activeId===f.storyIds[1],councilReady?.story);
      call('destructive','story',f.storyIds[1],'skip');
      const chronicle=call('read','derive');
      add('chronicle-records-watch-and-skip',[f.storyIds[0],f.storyIds[1]].every(id=>(chronicle?.story?.chronicleIds||[]).includes(id)),chronicle?.story?.chronicleIds);
      const replayBefore=call('read','raw'),replayResources=chronicle?.resources,replayHistory=chronicle?.story?.history;
      const replay=call('destructive','story',f.storyIds[0],'replay');
      add('story-replay-neutral',replay?.ok===true&&call('read','raw')===replayBefore&&same(call('read','derive')?.resources,replayResources)&&same(call('read','derive')?.story?.history,replayHistory),replay);
      const storyLog=call('destructive','story',f.storyIds[0],'log');
      add('story-skip-replay-log-controls',storyLog?.ok===true&&call('read','renderModel')?.story?.logOpen===true,storyLog);

      call('destructive','resetFixture',f.fixtures.fresh);
      call('destructive','event','surface.opened',{surface:'village',userInitiated:true});
      const skipResources=call('read','derive')?.resources,skip=call('destructive','story',f.storyIds[0],'skip'),skipped=call('read','derive');
      add('waystone-skip-no-reward',skip?.ok===true&&same(skipped?.resources,skipResources)&&historyCount(f.storyIds[0],skipped)===1&&skipped?.story?.history?.find(item=>(item.id||item.sceneId)===f.storyIds[0])?.resolution==='skipped',{skip,story:skipped?.story});

      call('destructive','resetFixture',f.fixtures.stageOneReady);
      const preclearResources=call('read','derive')?.resources,preclear=call('destructive','event','campaign.preclear-requested',{stageId:'broken-roads-1'}),introReady=call('read','derive');
      add('stage-one-intro-before-spend',preclear?.ok===true&&preclear.spendAllowed===false&&introReady?.story?.activeId===f.storyIds[2]&&same(introReady?.resources,preclearResources),{preclear,story:introReady?.story});
      call('destructive','story',f.storyIds[2],'skip');
      const preclearAgain=call('destructive','event','campaign.preclear-requested',{stageId:'broken-roads-1'});
      add('stage-one-spend-after-intro',preclearAgain?.ok===true&&preclearAgain.spendAllowed===true,preclearAgain);
      const beforeClear=call('read','derive'),clear=call('destructive','event','campaign.first-clear-committed',{stageId:'broken-roads-1'}),afterClear=call('read','derive');
      const resolutionQueued=[afterClear?.story?.activeId,...(afterClear?.story?.pendingIds||[])].includes(f.storyIds[3]);
      call('destructive','story',f.storyIds[3],'watch');const afterResolution=call('read','derive'),storyClaims=(afterResolution?.claims||[]).filter(item=>item.sourceId===f.storyIds[3]);
      add('stage-one-order-and-bank',clear?.ok===true&&resolutionQueued&&storyClaims.length===1&&storyClaims[0].status==='ready'&&storyClaims[0].paid===false&&storyClaims[0].expiresAt==null&&same(afterResolution?.resources,beforeClear?.resources),{clear,story:afterResolution?.story,storyClaims});
      const clearRaw=call('read','raw');call('destructive','reload');const reloadedClear=call('read','derive');
      add('stage-one-reload-no-duplicate',call('read','raw')===clearRaw&&historyCount(f.storyIds[3],reloadedClear)+pendingCount(f.storyIds[3],reloadedClear)+(reloadedClear?.story?.activeId===f.storyIds[3]?1:0)===1&&(reloadedClear?.claims||[]).filter(item=>item.sourceId===f.storyIds[3]).length===1,reloadedClear?.story);

      call('destructive','resetFixture',f.fixtures.rankJump);
      const rankJump=call('destructive','event','player.rank-crossed',{from:1,to:3}),rankDerived=call('read','derive'),rosterAfterRank=rankDerived?.roster;
      add('rank-jump-arrival-once',rankJump?.ok===true&&[rankDerived?.story?.activeId,...(rankDerived?.story?.pendingIds||[])][0]===f.storyIds[4]&&historyCount(f.storyIds[4],rankDerived)+pendingCount(f.storyIds[4],rankDerived)+(rankDerived?.story?.activeId===f.storyIds[4]?1:0)===1,{rankJump,story:rankDerived?.story});
      call('destructive','story',f.storyIds[4],'watch');const postArrival=call('read','derive');
      add('rank-arrival-observes-roster-only',same(postArrival?.roster,rosterAfterRank)&&historyCount(f.storyIds[4],postArrival)===1,{before:rosterAfterRank,after:postArrival?.roster});
      call('destructive','event','player.rank-crossed',{from:1,to:3});const repeatedRank=call('read','derive');
      add('rank-arrival-repeat-idempotent',historyCount(f.storyIds[4],repeatedRank)===1&&pendingCount(f.storyIds[4],repeatedRank)===0,repeatedRank?.story);

      call('destructive','resetFixture',f.fixtures.claimReady);
      const beforeClaim=call('read','derive'),ready=claimById(f.exampleClaimId,beforeClaim),beforeClaimSnap=call('read','snapshot');
      add('manual-claim-banked-unpaid',ready?.status==='ready'&&ready?.paid===false&&ready?.expiresAt==null&&ready?.receiptCount===0,ready);
      const firstClaim=call('destructive','claim',f.exampleClaimId),afterClaim=call('read','derive'),claimed=claimById(f.exampleClaimId,afterClaim),afterClaimSnap=call('read','snapshot');
      add('manual-claim-first-commit',firstClaim?.ok===true&&claimed?.status==='claimed'&&claimed?.paid===true&&claimed?.receiptCount===1&&revision(afterClaimSnap)===revision(beforeClaimSnap)+1&&!same(afterClaim?.resources,beforeClaim?.resources),{firstClaim,claimed});
      const claimedRaw=call('read','raw'),claimedResources=afterClaim?.resources,claimedRevision=revision(afterClaimSnap),secondClaim=call('destructive','claim',f.exampleClaimId);
      add('manual-claim-repeat-write-free',secondClaim?.ok===false&&call('read','raw')===claimedRaw&&revision(call('read','snapshot'))===claimedRevision&&same(call('read','derive')?.resources,claimedResources)&&Number(secondClaim.writes||0)===0,secondClaim);
      call('destructive','reload');const reloadRaw=call('read','raw'),reloadDuplicate=call('destructive','claim',f.exampleClaimId);
      add('manual-claim-reload-write-free',reloadDuplicate?.ok===false&&call('read','raw')===reloadRaw&&same(call('read','derive')?.resources,claimedResources)&&Number(reloadDuplicate.writes||0)===0,reloadDuplicate);
      call('destructive','resetFixture',f.fixtures.claimReady);const offline=call('destructive','advanceOffline',f.laterNow-f.frozenNow),offlineReady=claimById(f.exampleClaimId,call('read','derive'));
      add('manual-claim-offline-banked',offline?.ok===true&&offline.appliedMs===f.offlineCapMs&&offlineReady?.status==='ready'&&offlineReady?.paid===false&&offlineReady?.expiresAt==null,{offline,offlineReady});
      const race=call('destructive','simulateConcurrentClaim',f.exampleClaimId);
      add('claim-two-client-one-winner',race?.ok===true&&race.winnerCount===1&&race.loserCount===1&&race.receiptCount===1&&race.rewardApplications===1&&race.losingWrites===0&&race.finalValid===true,race);

      call('destructive','resetFixture',f.fixtures.tutorialReady);
      const tutorialId=f.phase13TutorialIds[1],tutorialResources=call('read','derive')?.resources;
      const openTutorial=call('destructive','tutorial',tutorialId,'open'),skipTutorial=call('destructive','tutorial',tutorialId,'skip'),skippedTutorial=tutorialById(tutorialId,call('read','derive'));
      add('tutorial-skip-nonblocking',openTutorial?.ok===true&&skipTutorial?.ok===true&&skippedTutorial?.status==='dismissed'&&skippedTutorial?.featureAvailable===true&&same(call('read','derive')?.resources,tutorialResources),{openTutorial,skipTutorial,skippedTutorial});
      const tutorialRaw=call('read','raw'),tutorialStateBefore=call('read','derive')?.tutorials,replayTutorial=call('destructive','tutorial',tutorialId,'replay');
      add('tutorial-skip-complete-replay',replayTutorial?.ok===true&&call('read','raw')===tutorialRaw&&same(call('read','derive')?.tutorials,tutorialStateBefore)&&same(call('read','derive')?.resources,tutorialResources),replayTutorial);
      call('destructive','resetFixture',f.fixtures.tutorialReady);call('destructive','tutorial',tutorialId,'open');const beforeTutorialComplete=call('read','derive'),completeTutorial=call('destructive','tutorial',tutorialId,'complete'),completedTutorial=tutorialById(tutorialId,call('read','derive'));
      add('tutorial-complete-no-reward',completeTutorial?.ok===true&&completedTutorial?.status==='completed'&&completedTutorial?.completionReceiptCount===1&&same(call('read','derive')?.resources,beforeTutorialComplete?.resources)&&same(call('read','derive')?.claims,beforeTutorialComplete?.claims),{completeTutorial,completedTutorial});
      const completedRaw=call('read','raw'),repeatComplete=call('destructive','tutorial',tutorialId,'complete');
      add('tutorial-repeat-complete-write-free',repeatComplete?.ok===false&&call('read','raw')===completedRaw&&Number(repeatComplete.writes||0)===0,repeatComplete);

      call('destructive','resetFixture',f.fixtures.fresh);
      for(const surface of ['village','oaths','fellowship'])call('destructive','event','surface.opened',{surface,userInitiated:true});
      const freshTutorialMetrics=call('read','derive')?.tutorials?.metrics;
      add('tutorial-fresh-session-caps',freshTutorialMetrics?.maxAutoPresentedPerSurfaceVisit<=1&&freshTutorialMetrics?.standaloneAutoPresentedThisSession<=2,freshTutorialMetrics);
      call('destructive','resetFixture',f.fixtures.established);call('destructive','event','surface.opened',{surface:'village',userInitiated:true});const migratedTutorials=call('read','derive')?.tutorials;
      add('tutorial-established-no-cascade',migratedTutorials?.metrics?.recapAutoPresentedThisSession<=1&&(migratedTutorials?.pendingIds||[]).length<=1&&(migratedTutorials?.logIds||[]).length>=f.phase13TutorialIds.length,{metrics:migratedTutorials?.metrics,pending:migratedTutorials?.pendingIds,logCount:migratedTutorials?.logIds?.length});
      call('destructive','resetFixture',f.fixtures.tutorialReady);call('destructive','event','claim.celebration-opened',{});call('destructive','event','surface.opened',{surface:'village',userInitiated:true});const suppressed=call('read','derive');call('destructive','event','claim.celebration-closed',{});call('destructive','event','surface.opened',{surface:'village',userInitiated:true});const released=call('read','derive');
      add('tutorial-suppressed-until-safe-action',suppressed?.tutorials?.activeId==null&&released?.tutorials?.activeId!=null,{suppressed:suppressed?.tutorials,released:released?.tutorials});
      const selectedSpeakers=call('read','derive')?.tutorials?.selectedSpeakers||[];
      add('locked-fellows-never-selected',selectedSpeakers.every(value=>{const [roster,id]=String(value).split(':');return roster!=='fellow'||(call('read','derive')?.roster?.joinedFellowIds||[]).includes(id)}),selectedSpeakers);

      call('destructive','resetFixture',f.fixtures.established);const seamBefore=call('read','snapshot'),seamRaw=call('read','raw'),seamValidation=call('read','validate');call('destructive','reload');const seamAfter=call('read','snapshot');
      add('phase12-seam-preserved',seamValidation?.ok===true&&stateOf(seamBefore)?.schemaVersion===12&&migrationReceipts(stateOf(seamBefore)).length===1&&migrationReceipts(stateOf(seamAfter)).length===1&&call('read','raw')===seamRaw&&revision(seamAfter)===revision(seamBefore),{before:migrationReceipts(stateOf(seamBefore)),after:migrationReceipts(stateOf(seamAfter))});
      for(const mode of f.requiredLegacyModes){const before=call('read','raw'),beforeRevision=revision(call('read','snapshot')),result=call('destructive','probeLegacy',mode);add(`legacy-${mode}-write-free-refusal`,result?.ok===false&&call('read','raw')===before&&revision(call('read','snapshot'))===beforeRevision&&Number(result.writes||0)===0,result)}

      call('destructive','resetFixture',f.fixtures.fresh);call('destructive','event','surface.opened',{surface:'village',userInitiated:true});
      const render=call('read','renderModel'),controls=render?.controls||[];
      add('mobile-controls-and-overflow',f.requiredControls.every(id=>controls.some(item=>item.id===id&&item.visible===true&&item.enabled===true&&item.focusable===true))&&render?.layout?.horizontalOverflow===false&&render?.layout?.controlsClipped===false&&render?.layout?.longCopy175Safe===true&&render?.layout?.viewportWidth===config.viewport.width,{controls,layout:render?.layout});
      add('reduced-motion-equivalent',render?.reducedMotion===config.viewport.reducedMotion&&render?.resultEquivalent===true,{expected:config.viewport.reducedMotion,render});
      add('no-broken-dialogue-images',(render?.imageRequests||[]).every(item=>item.ok===true)&&render?.unframedFullPortraitCount===0,{imageRequests:render?.imageRequests,unframedFullPortraitCount:render?.unframedFullPortraitCount});
      add('final-state-valid',call('read','validate')?.ok===true,call('read','validate'));
      add('native-storage-instrumented',window.__P13I_NATIVE_INSTRUMENTED__===true);
      add('zero-native-storage-accesses',window.__P13I_NATIVE_ACCESSES__.length===0,window.__P13I_NATIVE_ACCESSES__);
      add('zero-warning-error-console',window.__P13I_ERRORS__.length===0,window.__P13I_ERRORS__);
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
