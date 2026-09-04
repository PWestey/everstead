(function installEversteadPhase24GStoryRuntime(root){
  'use strict';

  const OWNER_ID='everstead.phase24g.story-runtime.schema14.v1';
  const STORY_SOURCE='phase24g-story';
  const INTRO_ID='story.book1.chapter1.merchant-dispute.intro';
  const RESOLUTION_ID='story.book1.chapter1.merchant-dispute.resolution';
  const RANK_TWO_ARRIVAL_ID='story.book1.rank2.roadbound-arrivals';

  function requireSlot(slot,name){
    if(!slot||typeof slot.get!=='function'||typeof slot.set!=='function')throw new Error(`Phase 24G requires the ${name} slot`);
    return slot;
  }

  function install(adapter){
    if(!adapter||adapter.version!==1)throw new Error('Phase 24G received an incompatible runtime adapter');
    const content=root.EVERSTEAD_PHASE24G_CHAPTER_ONE;
    if(!content||content.version!==1||content.authorityId!=='everstead.phase24g.book1.chapter1.v1'||content.schemaVersion!==14||!content.validate().ok)throw new Error('Phase 24G Chapter I content is unavailable or incompatible');
    const api=adapter.api||{},slots=adapter.slots||{};
    const requiredFunctions=['state','mutatePersisted','clone','escape','showModal','render','closeModal','bindModal','showTutorial','campaignPreview','sceneResolved','queueSceneInState','promoteSceneInState','presentActiveScene','recordSceneInState','storyProgress','tutorialStatus','mutateTutorialInState'];
    for(const name of requiredFunctions)if(typeof api[name]!=='function')throw new Error(`Phase 24G requires api.${name}`);
    const runSlot=requireSlot(slots.runFellowCampaign,'runFellowCampaign');
    const chronicleSlot=requireSlot(slots.openChronicle,'openChronicle');
    const objectiveSlot=requireSlot(slots.objective,'objective');
    const objectiveActionSlot=requireSlot(slots.objectiveAction,'objectiveAction');
    const villageSlot=requireSlot(slots.villageScreen,'villageScreen');
    const profileCardSlot=requireSlot(slots.publicPreviewCard,'publicPreviewCard');
    const tutorialSlot=requireSlot(slots.tutorial,'tutorial');
    const tutorialHtmlSlot=requireSlot(slots.tutorialHtml,'tutorialHtml');
    const tutorialActionSlot=requireSlot(slots.tutorialAction,'tutorialAction');
    const tutorialLogSlot=requireSlot(slots.tutorialLog,'tutorialLog');
    const modalBindingSlot=requireSlot(slots.modalBinding,'modalBinding');
    const registries=adapter.registries||{};
    for(const key of ['sceneIds','chronicleIds','sceneById','entryByScene','storyNodeIds','chronicleEntryIds','dialogueContentByActor'])if(!registries[key]||typeof registries[key].add!=='function'&&typeof registries[key].set!=='function'&&typeof registries[key].get!=='function')throw new Error(`Phase 24G requires registry ${key}`);

    for(const scene of content.scenes){
      registries.sceneIds.add(scene.id);
      registries.chronicleIds.add(scene.chronicleEntryId);
      registries.sceneById.set(scene.id,scene);
      registries.entryByScene.set(scene.id,scene.chronicleEntryId);
      registries.storyNodeIds.add(scene.id);
      registries.chronicleEntryIds.add(scene.chronicleEntryId);
      for(const item of scene.beats){
        const actorId=`${item.speaker.roster}.${item.speaker.id}`,contentId=`${scene.id}.line.${item.id}`;
        const contentIds=registries.dialogueContentByActor.get(actorId);
        if(!contentIds)throw new Error(`Phase 24G speaker ${actorId} is not in the public dialogue roster`);
        contentIds.add(contentId);
      }
    }

    const previousRun=runSlot.get();
    const previousChronicle=chronicleSlot.get();
    const previousObjective=objectiveSlot.get();
    const previousObjectiveAction=objectiveActionSlot.get();
    const previousVillage=villageSlot.get();
    const previousProfileCard=profileCardSlot.get();
    const previousTutorial=tutorialSlot.get(),previousTutorialHtml=tutorialHtmlSlot.get(),previousTutorialAction=tutorialActionSlot.get(),previousTutorialLog=tutorialLogSlot.get(),previousModalBinding=modalBindingSlot.get();
    if([previousRun,previousChronicle,previousObjective,previousObjectiveAction,previousVillage,previousProfileCard,previousTutorial,previousTutorialHtml,previousTutorialAction,previousTutorialLog,previousModalBinding].some(value=>typeof value!=='function'))throw new Error('Phase 24G could not capture the current presentation owners');

    function phase24gIsCurrent(){return api.state()?.schemaVersion===14}
    function phase24gStoryReady(){return phase24gIsCurrent()&&Boolean(api.storyProgress(api.state()))}
    function phase24gQueueScene(sceneId,{beforeSceneId=null}={}){
      const state=api.state(),progress=api.storyProgress(state);
      if(!phase24gStoryReady()||!progress||api.sceneResolved(sceneId,state))return Object.freeze({ok:true,changed:false});
      const pending=progress.pendingSceneIds.includes(sceneId),active=state.narrativeProgress.activeStoryId===sceneId;
      const needsQueue=!active&&!pending,needsPromote=state.narrativeProgress.activeStoryId===null&&(needsQueue||pending),needsPriority=Boolean(!active&&beforeSceneId&&(state.narrativeProgress.activeStoryId===beforeSceneId||progress.pendingSceneIds.includes(beforeSceneId)));
      if(!needsQueue&&!needsPromote&&!needsPriority)return Object.freeze({ok:true,changed:false});
      const result=api.mutatePersisted(current=>{
        if(needsQueue)api.queueSceneInState(current,sceneId);
        if(needsPriority&&beforeSceneId&&!active&&!api.sceneResolved(beforeSceneId,current)){
          const currentProgress=api.storyProgress(current),activeBefore=current.narrativeProgress.activeStoryId===beforeSceneId,pendingBefore=currentProgress.pendingSceneIds.includes(beforeSceneId);
          if(activeBefore||pendingBefore){
            if(activeBefore)current.narrativeProgress.activeStoryId=null;
            currentProgress.pendingSceneIds=currentProgress.pendingSceneIds.filter(id=>id!==sceneId&&id!==beforeSceneId);
            currentProgress.pendingSceneIds.unshift(sceneId,beforeSceneId);
          }
        }
        api.promoteSceneInState(current);
      },STORY_SOURCE,{renderAfter:false});
      return Object.freeze({ok:result?.ok===true,changed:result?.ok===true,result});
    }

    function phase24gCurrentRunFellowCampaign(stageId,options={}){
      if(!phase24gStoryReady()||stageId!==content.campaignStageId)return previousRun(stageId,options);
      const before=api.campaignPreview(stageId),stateBefore=api.state();
      const priorFirstClear=Boolean(stateBefore?.fellowCampaign?.clearedStageIds?.includes(stageId));
      if(!api.sceneResolved(INTRO_ID,stateBefore)&&(priorFirstClear||before?.valid&&before.firstClear===true)){
        const queued=phase24gQueueScene(INTRO_ID);
        if(!queued.ok)return queued.result||false;
        if(options.present!==false)api.presentActiveScene();
        return false;
      }
      const revisionBefore=stateBefore?.saveMeta?.revision;
      const result=previousRun(stageId,options);
      const current=api.state(),receipt=current?.fellowCampaign?.lastReceipt;
      const committed=Boolean(result?.ok===true&&Number.isSafeInteger(revisionBefore)&&current?.saveMeta?.revision>revisionBefore&&receipt?.stageId===stageId);
      if(committed&&api.sceneResolved(INTRO_ID,current)&&!api.sceneResolved(RESOLUTION_ID,current)&&(receipt.firstClear===true||priorFirstClear))phase24gQueueScene(RESOLUTION_ID,{beforeSceneId:RANK_TWO_ARRIVAL_ID});
      return result;
    }

    function phase24gResolveScene(sceneId,resolution,{present=true}={}){
      if(!phase24gStoryReady()||![INTRO_ID,RESOLUTION_ID].includes(sceneId)||api.sceneResolved(sceneId))return Object.freeze({ok:false,reason:'scene-not-current',writes:0});
      const result=api.mutatePersisted((state,now)=>{
        if(!api.recordSceneInState(state,sceneId,resolution,now,{queueClaim:false}))throw new Error('Phase 24G story state changed before resolution');
      },STORY_SOURCE,{renderAfter:false});
      if(!result?.ok)return Object.freeze({ok:false,reason:String(result?.error?.code||result?.error?.message||'story-write-refused'),writes:0});
      adapter.phase13Ui.sceneId=null;
      adapter.phase13Ui.sceneBeat=0;
      adapter.phase13Ui.sceneReplay=false;
      if(present){api.closeModal();api.render()}
      return Object.freeze({ok:true,resolution,writes:1});
    }

    function phase24gBindModal(){
      const result=previousModalBinding(),sceneRoot=adapter.document.querySelector('[data-overlay] [data-phase13-scene]'),sceneId=sceneRoot?.getAttribute('data-phase13-scene'),scene=registries.sceneById.get(sceneId);
      if(!scene||![INTRO_ID,RESOLUTION_ID].includes(sceneId)||!phase24gStoryReady())return result;
      for(const button of sceneRoot.querySelectorAll('[data-phase13-story]')){
        const action=button.dataset.phase13Story,inherited=button.onclick;
        if(action==='skip')button.onclick=()=>phase24gResolveScene(sceneId,'skipped');
        else if(action==='next')button.onclick=()=>adapter.phase13Ui.sceneId===sceneId&&adapter.phase13Ui.sceneBeat===scene.beats.length-1&&adapter.phase13Ui.sceneReplay!==true?phase24gResolveScene(sceneId,'watched'):inherited?.();
      }
      return result;
    }

    function phase24gSceneOrder(){
      const first=adapter.phase13Scenes;
      if(!Array.isArray(first)||first.length!==5)throw new Error('The five-scene First Covenant predecessor is unavailable');
      return [...first.slice(0,4),...content.scenes,first[4]];
    }

    function phase24gCurrentChronicle(){
      if(!phase24gStoryReady())return previousChronicle();
      const state=api.state(),unread=state.chronicleProgress.unreadEntryIds.filter(id=>registries.chronicleIds.has(id));
      if(unread.length){
        const result=api.mutatePersisted(current=>{
          current.chronicleProgress.unreadEntryIds=current.chronicleProgress.unreadEntryIds.filter(id=>!registries.chronicleIds.has(id));
        },'phase13-chronicle-read',{renderAfter:false});
        if(!result?.ok)return false;
      }
      adapter.phase13Ui.chronicleOpen=true;
      const resolved=phase24gSceneOrder().filter(item=>api.sceneResolved(item.id));
      api.showModal(`<div class="modal-head"><div><div class="eyebrow">More \u2192 Chronicle</div><h2 id="everstead-modal-title">First Covenant</h2></div><button class="close" data-modal-close>\u00d7</button></div><p class="soft">Watched and skipped scenes remain here. Replay and Log are presentation-only.</p><div class="phase-13-log-list">${resolved.length?resolved.map(item=>`<div class="phase-13-log-row"><h3>${api.escape(item.title)}</h3><p>${api.escape(api.storyProgress(api.state()).sceneResolutionsById[item.id])}</p><div class="phase-13-log-actions"><button class="btn small" data-phase13-story="replay" data-phase13-scene-id="${api.escape(item.id)}">REPLAY</button><button class="btn small" data-phase13-story="log" data-phase13-scene-id="${api.escape(item.id)}">LOG</button></div></div>`).join(''):'<div class="empty">The Chronicle will fill as the First Covenant unfolds.</div>'}</div><button class="btn teal wide" data-phase13-tutorial-log>OPEN TUTORIALS</button>`);
      const modal=adapter.document.querySelector('[data-overlay] .modal');
      if(modal)modal.dataset.phase22bChronicleFallback='true';
      return true;
    }

    function phase24gCurrentObjective(){
      if(!phase24gStoryReady())return previousObjective();
      const prior=previousObjective();
      const state=api.state();
      const stageOneCleared=state.fellowCampaign?.clearedStageIds?.includes('broken-roads-1')===true;
      if((prior?.title!=='Merchant Dispute'||prior?.action!=='chronicle')&&!stageOneCleared)return prior;
      if(!api.sceneResolved(INTRO_ID,state)){
        if(state.fellowCampaign?.clearedStageIds?.includes(content.campaignStageId))return Object.freeze({title:'Recall the Merchant Dispute',copy:'Your earlier Stage 2 clear is already recorded. Continue the chapter without replaying or paying again.',action:'queue-intro'});
        return Object.freeze({title:'Merchant Dispute',copy:'Select Broken Roads Stage 2 to hear the terms before the expedition proceeds.',action:'campaign'});
      }
      if(!api.sceneResolved(RESOLUTION_ID,state)){
        if(state.fellowCampaign?.clearedStageIds?.includes(content.campaignStageId))return Object.freeze({title:'Record the Merchant Dispute',copy:'Your earlier Stage 2 clear already reopened the route. Continue its resolution without replaying or paying again.',action:'queue-resolution'});
        return Object.freeze({title:'Settle the Merchant Dispute',copy:'Clear Broken Roads Stage 2 and reopen the western trade route.',action:'campaign'});
      }
      const status=phase24gTutorialStatus(state);
      if(!['completed','dismissed','unavailable'].includes(status))return Object.freeze({title:'Chapter I complete',copy:'See how the Waystone objective advances when a chapter changes the Village.',action:'tutorial'});
      return Object.freeze({title:'Chapter I complete',copy:'The western plaza is open, and every Chapter I scene is preserved in the Chronicle.',action:'chronicle'});
    }

    function phase24gCurrentObjectiveAction(){
      const objective=phase24gCurrentObjective();
      if(phase24gStoryReady()&&['queue-intro','queue-resolution'].includes(objective.action)){
        const queued=phase24gQueueScene(objective.action==='queue-intro'?INTRO_ID:RESOLUTION_ID);
        if(!queued.ok)return queued.result||false;
        return api.presentActiveScene();
      }
      if(phase24gStoryReady()&&objective.action==='tutorial')return phase24gTutorialAction(content.tutorialId,'open',{present:true});
      return previousObjectiveAction();
    }

    function phase24gTutorialStatus(state=api.state()){return api.tutorialStatus(state)}
    function phase24gTutorial(id){return id===content.tutorialId?content.tutorial:previousTutorial(id)}
    function phase24gTutorialHtml(id){
      if(id!==content.tutorialId)return previousTutorialHtml(id);
      const tutorial=content.tutorial,step=tutorial.steps[0],terminal=['completed','dismissed'].includes(phase24gTutorialStatus());
      const controls=terminal
        ?`<button class="btn primary" data-modal-close>CLOSE</button><button class="btn teal" data-phase13-tutorial-action="log" data-phase13-tutorial-id="${api.escape(id)}">LOG</button>`
        :`<button class="btn" data-phase13-tutorial-action="back" data-phase13-tutorial-id="${api.escape(id)}">BACK</button><button class="btn primary" data-phase13-tutorial-action="complete" data-phase13-tutorial-id="${api.escape(id)}">DONE</button><button class="btn" data-phase13-tutorial-action="skip" data-phase13-tutorial-id="${api.escape(id)}">SKIP</button><button class="btn teal" data-phase13-tutorial-action="log" data-phase13-tutorial-id="${api.escape(id)}">LOG</button>`;
      return`<div class="phase-13-tutorial" data-phase13-tutorial="${api.escape(id)}" data-phase24g-tutorial><div class="modal-head"><div><div class="eyebrow">Tutorial · ${api.escape(tutorial.actorName)}</div><h2 id="everstead-modal-title">${api.escape(step.title)}</h2></div><button class="close" data-modal-close aria-label="Close tutorial">×</button></div><p class="soft">${api.escape(step.body)}</p><div class="phase-13-tutorial-steps"><div class="phase-13-tutorial-step" aria-current="step"><b>Chapter change</b><p>${api.escape(step.body)}</p></div></div><div class="phase-13-controls">${controls}</div></div>`;
    }
    function phase24gTutorialAction(id,action,{present=true}={}){
      if(id!==content.tutorialId)return previousTutorialAction(id,action,{present});
      if(!phase24gStoryReady()||!['open','complete','skip','replay','log'].includes(action))return Object.freeze({ok:false,reason:'unknown-tutorial-action',writes:0,rewardApplications:0});
      if(action==='log')return phase24gTutorialLog();
      const status=phase24gTutorialStatus();
      if(status==='unavailable')return Object.freeze({ok:false,reason:'tutorial-state-unavailable',writes:0,rewardApplications:0});
      if(action==='replay'&&status==='unseen')return Object.freeze({ok:false,reason:'tutorial-unseen',writes:0,rewardApplications:0});
      if(['complete','skip'].includes(action)&&['completed','dismissed'].includes(status))return Object.freeze({ok:false,reason:`already-${status}`,writes:0,rewardApplications:0});
      if(action==='complete'&&status!=='seen')return Object.freeze({ok:false,reason:'tutorial-not-open',writes:0,rewardApplications:0});
      if(action==='open'&&['completed','dismissed'].includes(status))return Object.freeze({ok:false,reason:`already-${status}`,writes:0,rewardApplications:0});
      let result={ok:true},wrote=false;
      if(action==='open'&&status==='unseen'||action==='complete'&&!['completed','dismissed'].includes(status)||action==='skip'&&!['completed','dismissed'].includes(status)||action==='replay'){
        result=api.mutatePersisted(state=>api.mutateTutorialInState(state,action),STORY_SOURCE,{renderAfter:false});
        if(!result?.ok)return Object.freeze({ok:false,reason:String(result?.error?.code||result?.error?.message||'tutorial-write-refused'),writes:0,rewardApplications:0});
        wrote=true;
      }
      if(action==='open'||action==='replay'){
        adapter.phase13Ui.tutorialId=id;
        adapter.phase13Ui.tutorialStep=0;
        adapter.phase13Ui.tutorialReplay=action==='replay';
        if(present)api.showTutorial(id);
      }else{
        adapter.phase13Ui.tutorialId=null;
        if(present){api.closeModal();api.render()}
      }
      return Object.freeze({ok:true,status:phase24gTutorialStatus(),writes:wrote?1:0,rewardApplications:0,replay:action==='replay'});
    }
    function phase24gTutorialLog(){
      const result=previousTutorialLog();
      const status=phase24gTutorialStatus();
      if(!phase24gStoryReady()||!result||!api.sceneResolved(RESOLUTION_ID)&&['unseen','unavailable'].includes(status))return result;
      const list=adapter.document.querySelector('[data-overlay] .phase-13-log-list');
      if(list&&!list.querySelector(`[data-phase24g-tutorial-log-row="${content.tutorialId}"]`)){
        list.insertAdjacentHTML('beforeend',`<div class="phase-13-log-row" data-phase24g-tutorial-log-row="${content.tutorialId}"><h3>${api.escape(content.tutorial.steps[0].title)}</h3><p>${api.escape(status)} \u00b7 ${api.escape(content.tutorial.steps[0].body)}</p><div class="phase-13-log-actions"><button class="btn small" data-phase13-tutorial-action="replay" data-phase13-tutorial-id="${content.tutorialId}" ${status==='unseen'?'disabled':''}>REPLAY</button></div></div>`);
        api.bindModal();
      }
      return result;
    }

    function phase24gCurrentVillageScreen(){
      const html=previousVillage();
      if(!phase24gStoryReady()||!api.sceneResolved(RESOLUTION_ID))return html;
      const root=/<main class="screen village-screen[^>]*>/.exec(html)?.[0];
      if(!root)throw new Error('The Chapter I Village surface is unavailable');
      const marked=root.replace(/>$/,` data-phase24g-village-change="${content.villageChangeId}">`);
      const change=`<div class="phase24g-village-change" aria-label="Western Plaza open"><span>WESTERN PLAZA OPEN</span></div>`;
      return html.replace(root,marked).replace('<div class="village-vignette"></div>',`<div class="village-vignette"></div>${change}`);
    }

    function phase24gPublicPreviewCardHtml(){
      if(!phase24gIsCurrent())return previousProfileCard();
      const profile=root.EVERSTEAD_PHASE24G_PUBLIC_RELEASE_PROFILE;
      if(!profile||profile.id!=='everstead.release-profile.chapter-one-preview.v1'||profile.schemaVersion!==14||profile.status!=='active')throw new Error('The Chapter I public-release profile is unavailable');
      return `<section class="card" data-phase24d-release-profile data-phase24g-release-profile="${api.escape(profile.id)}"><div class="eyebrow">${api.escape(profile.label)} \u00b7 ${api.escape(adapter.releaseVersion)}</div><h3>Chapter I is open in Everstead</h3><p class="soft">This playable preview includes Oaths, Village growth, all three rosters, four Adventure roads, and the complete First Covenant Chapter I.</p><p class="soft">Later Book I chapters, expanded Legacy, relationships, events, facilities, and long-term progression are still being completed. Saves stay in this browser; keep a private Recovery File backup.</p></section>`;
    }

    function restoreOwnership(){
      runSlot.set(phase24gCurrentRunFellowCampaign);
      chronicleSlot.set(phase24gCurrentChronicle);
      objectiveSlot.set(phase24gCurrentObjective);
      objectiveActionSlot.set(phase24gCurrentObjectiveAction);
      villageSlot.set(phase24gCurrentVillageScreen);
      profileCardSlot.set(phase24gPublicPreviewCardHtml);
      tutorialSlot.set(phase24gTutorial);
      tutorialHtmlSlot.set(phase24gTutorialHtml);
      tutorialActionSlot.set(phase24gTutorialAction);
      tutorialLogSlot.set(phase24gTutorialLog);
      modalBindingSlot.set(phase24gBindModal);
      return true;
    }
    restoreOwnership();

    return Object.freeze({
      ok:true,
      ownerId:OWNER_ID,
      schemaVersion:14,
      storySource:STORY_SOURCE,
      sceneIds:Object.freeze(content.scenes.map(item=>item.id)),
      rewardNeutral:content.scenes.every(item=>item.claim===null&&item.playbackReward===null),
      restoreOwnership
    });
  }

  Object.defineProperty(root,'EVERSTEAD_PHASE24G_STORY_RUNTIME',{configurable:false,enumerable:false,writable:false,value:Object.freeze({
    version:1,
    id:OWNER_ID,
    schemaVersion:14,
    install
  })});
})(globalThis);
