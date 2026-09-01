(function installEversteadPhaseTwentyTwentyOnePresentation(root){
  'use strict';

  const STATUS_COPY=Object.freeze({
    hidden:'Not yet introduced',
    'discovered-locked':'Discovered · story opening waiting',
    available:'Available',
    'opportunity-ready':'Opportunity ready',
    'in-progress':'In progress',
    'claim-ready':'Manual claim ready'
  });
  const TUTORIAL_COPY=Object.freeze({
    'tutorial.facility.board.discover-hotspots':'Village locations brighten when an activity or manual claim is waiting. Dim locations have been discovered but still need their story opening.',
    'tutorial.facility.opportunities.banking':'Facility opportunities bank instead of expiring. Return when you are ready; passive Village production continues independently.',
    'tutorial.facility.claim.first-ready':'Resolved work waits here until you press Claim. Gold, local progress, and the receipt commit together exactly once.',
    'tutorial.facility.command.first-petition':'Read the petition, choose the Village response, then record the decision.',
    'tutorial.facility.command.consequences':'Command decisions are recorded for later story consequences; the current activity reward remains a manual claim.',
    'tutorial.facility.archives.first-research':'Review the lead and choose the strongest evidence to document the discovery.',
    'tutorial.facility.archives.mastery':'Archives Mastery will be introduced only after its economy policy is approved.',
    'tutorial.facility.training.first-drill':'Choose a formation and select two or three joined Fellows before committing the drill.',
    'tutorial.facility.training.mastery':'Training Mastery remains unavailable until its values are approved.',
    'tutorial.facility.hearth.first-gathering':'Choose the gathering and invite two to four eligible Fellows or Family members.',
    'tutorial.facility.hearth.relationship-results':'Relationship rewards remain unavailable until their policy is approved.',
    'tutorial.facility.gatehouse.first-caravan':'Choose how Everstead receives the arrival. Road opportunities remain banked until handled.',
    'tutorial.facility.gatehouse.road-events':'Deeper road-event progression remains unavailable until its policy is approved.',
    'tutorial.facility.workshop.first-order':'Review the order and its exact stock requirement. Beginning reserves stock; cancelling before commitment restores it.',
    'tutorial.facility.workshop.mastery':'Workshop Mastery remains unavailable until its policy is approved.',
    'tutorial.facility.gardens.first-plot':'Choose a crop, commit the plot, then return after growth to make the manual harvest claim.',
    'tutorial.facility.gardens.harvest':'Harvest expansion remains unavailable until its policy is approved.',
    'tutorial.facility.forge.first-commission':'Review whether the commission uses Workshop components or authoritative Relic Stones before beginning.',
    'tutorial.facility.forge.mastery':'Forge Mastery remains unavailable until its policy is approved.'
  });

  const titleCase=value=>String(value||'').split('.').at(-1).split('-').map(word=>word?word[0].toUpperCase()+word.slice(1):'').join(' ');
  const escapeSelector=value=>String(value).replaceAll('\\','\\\\').replaceAll('"','\\"');

  function install(adapters){
    const a=adapters||{},runtime=a.runtime,definitions=a.definitions;
    if(!runtime||!definitions||definitions.version!==2||!a.document)throw new Error('Phase 20/21 presentation adapters are unavailable');
    const document=a.document;
    const isActive=()=>Boolean(a.active?.()??runtime.rootState?.());
    const ui={facilityId:null,selectedRecordId:null,resumedRecordId:null,returnFocus:null,tutorial:null,participantDrafts:new Map(),lastReceiptIdByFacility:new Map(),tutorialReplayReturn:null};
    const facilityById=id=>definitions.facilities.find(item=>item.facilityId===id)||null;
    const derived=()=>runtime.derive();
    const viewFor=id=>derived()?.facilities?.[id]||null;
    const contentRow=(facilityId,templateId)=>definitions.content?.[facilityId]?.find(item=>item[0]===templateId)||null;
    const humanActor=id=>a.actorLabel?.(id)||titleCase(id);
    const humanId=id=>titleCase(id);
    const esc=value=>a.esc(String(value??''));
    const phaseData=(element,key)=>element.getAttribute(`data-phase20-21-${key}`);
    const defer=callback=>a.defer(callback,0);
    const statusCopy=status=>STATUS_COPY[status]||humanId(status);
    const activeRecord=records=>records.find(item=>['engaged','committed','growing'].includes(item.status))||records.find(item=>item.status==='claim-ready')||records[0]||null;
    const recordById=(facility,id)=>facility?.records?.find(item=>item.opportunity.id===id)||null;
    const actorLimits=facilityId=>facilityId==='facility.training-grounds'?[2,3]:facilityId==='facility.hearth'?[2,4]:[0,0];
    const eligibleActors=facilityId=>(a.eligibleParticipants?.(facilityId)||[]).filter(id=>id!=='player.wayfarer');

    function requirementFor(facilityId,record){
      if(facilityId==='facility.market-workshop')return{stockId:'workshop-components',label:'Workshop components',quantity:definitions.syntheticPolicy.stockRequirement,available:viewFor(facilityId)?.stock?.workshopComponents||0};
      if(facilityId==='facility.forge'){
        const local=record?.templateId==='forge.commission.village-toolwork';
        return{stockId:local?'workshop-components':'relic-stones',label:local?'Workshop components':'Relic Stones',quantity:definitions.syntheticPolicy.stockRequirement,available:local?(viewFor(facilityId)?.stock?.workshopComponents||0):(derived()?.resources?.relicStones||0)};
      }
      return null;
    }

    function boardPhaseFifteenState(state){
      if(state==='hidden')return'hidden';
      if(state==='discovered-locked')return'discovered';
      if(state==='available')return'available';
      return'ready';
    }

    function bindCommon(){
      if(!isActive())return false;
      const snapshot=derived();
      if(!snapshot)return false;
      for(const item of definitions.facilities){
        const button=document.querySelector(`[data-phase15-facility-id="${escapeSelector(item.facilityId)}"]`),facility=snapshot.facilities[item.facilityId];
        if(!button||!facility)continue;
        const state=facility.state,phase15State=boardPhaseFifteenState(state),waiting=facility.records.length,claimReady=facility.records.filter(record=>record.status==='claim-ready').length;
        button.dataset.phase15State=phase15State;
        button.setAttribute('data-phase20-21-board-state',state);
        button.setAttribute('aria-hidden',String(state==='hidden'));
        button.disabled=state==='hidden';
        button.classList.toggle('ready',state==='claim-ready'||state==='opportunity-ready'||state==='in-progress');
        button.classList.toggle('dim',state==='discovered-locked');
        button.setAttribute('aria-label',`${item.name}: ${statusCopy(state)}${claimReady?`; ${claimReady} manual claim${claimReady===1?'':'s'} ready`:waiting?`; ${waiting} activit${waiting===1?'y':'ies'} waiting`:''}`);
        button.onclick=()=>openFacility(item.facilityId,button);
        button.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openFacility(item.facilityId,button)}};
      }
      return true;
    }

    function contextualTutorialHtml(){
      const item=ui.tutorial;
      if(!item)return'';
      return`<aside class="phase20-21-tutorial" data-phase20-21-contextual-tutorial="${esc(item.id)}"><div class="eyebrow">Tutorial · ${esc(humanActor(item.speakerActorId))}</div><h3>${esc(humanId(item.id))}</h3><p>${esc(TUTORIAL_COPY[item.id]||'This optional lesson is reward-neutral and can be replayed from the Tutorial Log.')}</p><div class="phase20-21-tutorial-actions"><button class="btn teal" data-phase20-21-tutorial-action="complete">GOT IT</button><button class="btn" data-phase20-21-tutorial-action="skip">SKIP</button></div></aside>`;
    }

    function requirementHtml(facilityId,record){
      const requirement=requirementFor(facilityId,record);
      if(!requirement)return'';
      const reserved=record.reservation?.quantity||0,available=requirement.available;
      return`<div class="es-requirement-row" data-phase20-21-requirement="${esc(requirement.stockId)}" data-phase22c-stock-summary><div><span>Stock requirement</span><b>${esc(requirement.label)}</b></div><div><span>${reserved?'Reserved':'Available'}</span><b>${reserved||available} / ${requirement.quantity}</b></div><p>${reserved?'This exact reservation persists through close and Resume.':'Beginning reserves the exact amount. Cancel before Commit restores it.'}</p></div>`;
    }

    function participantHtml(facilityId,record){
      if(!['facility.training-grounds','facility.hearth'].includes(facilityId)||record.status!=='engaged')return'';
      const eligible=eligibleActors(facilityId),limits=actorLimits(facilityId),existing=record.participantIds,selected=ui.participantDrafts.has(record.opportunity.id)?ui.participantDrafts.get(record.opportunity.id):existing;
      return`<section class="phase20-21-participants" data-phase20-21-participant-selection><div class="phase20-21-section-head"><div><div class="eyebrow">Participants</div><h3>${facilityId==='facility.training-grounds'?'Joined Fellows':'Fellows & Family'}</h3></div><span class="es-state-chip">${selected.length}/${limits[1]}</span></div><p class="soft">Select ${limits[0]}–${limits[1]}. The Wayfarer is the player character and is never a roster participant.</p><div class="es-actor-strip">${eligible.map(actorId=>`<button class="phase20-21-actor" data-phase20-21-actor-choice="${esc(actorId)}" aria-pressed="${selected.includes(actorId)}"><span aria-hidden="true">${esc(humanActor(actorId).slice(0,1))}</span><b>${esc(humanActor(actorId))}</b></button>`).join('')}</div><button class="btn teal wide" data-phase20-21-save-participants ${selected.length<limits[0]||selected.length>limits[1]?'disabled':''}>CONFIRM PARTICIPANTS</button></section>`;
    }

    function choiceHtml(facilityId,record){
      if(record.status!=='engaged')return'';
      const choices=definitions.choicesFor(facilityId,record.templateId);
      return`<section data-phase20-21-choice-step><div class="eyebrow">Choose the approach</div><div class="es-option-grid">${choices.map(choice=>`<button class="btn phase20-21-option" data-phase20-21-choice-id="${esc(choice.id)}" aria-pressed="${record.choiceId===choice.id}">${esc(choice.label)}</button>`).join('')}</div></section>`;
    }

    function rewardHtml(record){
      if(record.status!=='claim-ready'||!record.outcome)return'';
      return`<section class="es-reward-preview" data-phase20-21-claim-ready data-phase22c-claim-summary="ready" data-phase22c-claim-kind="successor-facility" data-phase22c-offer-id="${esc(record.outcome.offerId)}"><div><div class="eyebrow">Manual reward claim</div><h3 data-phase22c-reward-gold="${record.outcome.globalGold}">${record.outcome.globalGold.toLocaleString()} Gold waiting</h3></div><p data-phase22c-reward-local-progress="${record.outcome.localProgress}">No reward or local progress has been applied yet. Local progress +${record.outcome.localProgress}; Claim commits both exactly once.</p></section>`;
    }

    function actionHtml(facilityId,record){
      const id=esc(record.opportunity.id),identity=esc(record.identity),participantLimits=actorLimits(facilityId),participantsReady=participantLimits[0]===0||record.participantIds.length>=participantLimits[0]&&record.participantIds.length<=participantLimits[1];
      if(record.status==='banked')return`<button class="btn primary wide" data-phase20-21-begin="${id}" data-record-identity="${identity}">BEGIN ACTIVITY</button>`;
      if(record.status==='engaged')return`<button class="btn danger" data-phase20-21-cancel="${id}" data-record-identity="${identity}">CANCEL</button><button class="btn primary" data-phase20-21-commit="${id}" data-record-identity="${identity}" ${record.choiceId===null||!participantsReady?'disabled':''}>COMMIT</button>`;
      if(record.status==='committed'&&ui.resumedRecordId!==record.opportunity.id)return`<button class="btn primary wide" data-phase20-21-resume="${id}">RESUME ACTIVITY</button>`;
      if(record.status==='committed')return`<button class="btn primary wide" data-phase20-21-resolve="${id}" data-record-identity="${identity}">RESOLVE ACTIVITY</button>`;
      if(record.status==='growing'&&ui.resumedRecordId!==record.opportunity.id)return`<button class="btn primary wide" data-phase20-21-resume="${id}">RESUME CULTIVATION</button>`;
      if(record.status==='growing')return`<button class="btn teal wide" data-phase20-21-check-growth="${id}">CHECK CULTIVATION</button>`;
      if(record.status==='claim-ready')return`<button class="btn primary wide" data-phase20-21-claim="${esc(record.outcome.offerId)}" data-offer-identity="${esc(record.outcome.offerIdentity)}">CLAIM REWARD</button>`;
      return'';
    }

    function recordHtml(facilityId,record){
      const row=contentRow(facilityId,record.templateId),title=row?.[1]||humanId(record.templateId),body=row?.[2]||'A Village activity is waiting.',presenter=facilityById(facilityId)?.presenterActorId,minutes=record.status==='growing'?Math.max(0,Math.ceil((record.readyAt-a.now())/60000)):0;
      return`<article class="phase20-21-opportunity" data-phase20-21-record-id="${esc(record.opportunity.id)}" data-lifecycle-status="${esc(record.status)}"><header><div><div class="eyebrow">Opportunity ${record.opportunity.sequence}</div><h3>${esc(title)}</h3></div><span class="es-state-chip">${esc(humanId(record.status))}</span></header><p>${esc(body)}</p><div class="es-actor-strip compact" aria-label="Activity guide"><div class="phase20-21-presenter"><span aria-hidden="true">${esc(humanActor(presenter).slice(0,1))}</span><div><small>Guide</small><b>${esc(humanActor(presenter))}</b></div></div>${record.participantIds.map(actorId=>`<div class="phase20-21-presenter"><span aria-hidden="true">${esc(humanActor(actorId).slice(0,1))}</span><div><small>Participant</small><b>${esc(humanActor(actorId))}</b></div></div>`).join('')}</div>${record.status==='growing'?`<div class="es-progress-record" data-phase20-21-growth-status><span>Cultivation continues while you are away.</span><b>${minutes?`${minutes} min remaining`:'Ready to check'}</b></div>`:''}${requirementHtml(facilityId,record)}${choiceHtml(facilityId,record)}${participantHtml(facilityId,record)}${rewardHtml(record)}<div class="es-action-dock" data-phase20-21-action-dock>${actionHtml(facilityId,record)}</div></article>`;
    }

    function opportunityRowsHtml(facility,selected){
      if(facility.records.length<=1)return'';
      return`<section class="phase20-21-queue"><div class="phase20-21-section-head"><h3>Banked opportunities</h3><span>${facility.records.length}</span></div>${facility.records.map(record=>`<button class="phase20-21-record-row" data-phase20-21-view-record="${esc(record.opportunity.id)}" data-lifecycle-status="${esc(record.status)}" aria-current="${record.opportunity.id===selected?.opportunity.id}"><span>${esc(contentRow(ui.facilityId,record.templateId)?.[1]||humanId(record.templateId))}</span><b>${esc(humanId(record.status))}</b></button>`).join('')}</section>`;
    }

    function sheetHtml(){
      const item=facilityById(ui.facilityId),snapshot=derived(),facility=snapshot?.facilities?.[ui.facilityId];
      if(!item||!facility)return'';
      let selected=recordById(facility,ui.selectedRecordId);
      if(!selected){selected=activeRecord(facility.records);ui.selectedRecordId=selected?.opportunity.id||null}
      const claimReady=facility.records.filter(record=>record.status==='claim-ready').length,lastReceipt=ui.lastReceiptIdByFacility.get(ui.facilityId)||facility.lastReceiptId,lifecycle=selected?.status||facility.state,passiveBuilding=a.passiveBuildingId?.(ui.facilityId)||null;
      return`<section class="phase20-21-sheet" tabindex="-1" data-phase20-21-sheet data-phase22c-facility-surface="successor" data-facility-id="${esc(ui.facilityId)}" data-phase20-21-state="${esc(facility.state)}" data-phase20-21-lifecycle-status="${esc(lifecycle)}" data-phase22c-lifecycle-state="${esc(lifecycle)}" aria-labelledby="everstead-modal-title"><header class="es-feature-masthead"><div><div class="eyebrow">${item.phase===20?'Original Village facility':'Village expansion'} · ${esc(item.anchor.replaceAll('-',' '))}</div><h2 id="everstead-modal-title">${esc(item.name)}</h2><p>${esc(item.activityName)} · guided by ${esc(humanActor(item.presenterActorId))}</p></div><button class="close" data-phase20-21-close aria-label="Close ${esc(item.name)}">×</button></header><div class="es-stat-ribbon" data-phase22c-local-summary><div><span>Board state</span><b>${esc(statusCopy(facility.state))}</b></div><div><span>Waiting</span><b>${facility.records.length}</b></div><div><span>Claims</span><b>${facility.claimedCount}</b></div><div data-phase22c-local-progress="${facility.localProgress}"><span>Local progress</span><b>${facility.localProgress}</b></div></div>${contextualTutorialHtml()}${selected?recordHtml(ui.facilityId,selected):`<section class="phase20-21-empty" data-phase20-21-empty><div class="eyebrow">Nothing waiting</div><h3>${esc(item.activityName)} will bank here</h3><p>Passive Village production continues. Active opportunities do not expire and will appear when their approved cadence creates one.</p></section>`}${opportunityRowsHtml(facility,selected)}${lastReceipt?`<section class="es-progress-record" tabindex="-1" data-phase20-21-receipt-summary data-phase22c-claim-summary="claimed" data-phase22c-receipt-id="${esc(lastReceipt)}"><span>Latest exact-once receipt</span><b>${esc(lastReceipt)}</b></section>`:''}<footer class="phase20-21-sheet-footer">${passiveBuilding?`<button class="btn" data-phase20-21-passive="${esc(passiveBuilding)}">MANAGE PASSIVE PRODUCTION</button>`:''}<button class="btn" data-phase20-21-open-tutorial-log>TUTORIAL LOG · 79 + 19</button></footer><p class="phase20-21-policy-note">Passive play keeps Everstead progressing. Active play accelerates the Village. Rewards remain manual claims and opportunities never expire.</p></section>`;
    }

    function focus(selector){defer(()=>{const target=document.querySelector(selector)||document.querySelector('[data-phase20-21-sheet]');target?.focus?.({preventScroll:true})})}
    function refresh(selector='[data-phase20-21-close]'){if(!isActive()||!ui.facilityId)return false;bindCommon();a.showModal(sheetHtml());focus(selector);return true}
    function fail(result){if(result?.ok!==false)return false;a.toast?.(`Activity unchanged · ${humanId(result.reason||'unavailable')}`);return true}
    function latestRecord(id){return recordById(viewFor(ui.facilityId),id)}
    function perform(operation,selector){const result=operation();if(fail(result)){refresh(selector);return result}refresh(selector);return result}

    function openFacility(facilityId,invoker){
      if(!isActive())return{ok:false,reason:'phase20-21-inactive',writes:0};
      const item=facilityById(facilityId),initial=viewFor(facilityId);
      if(!item||!initial||initial.state==='hidden')return{ok:false,reason:'facility-hidden',writes:0};
      if(initial.state==='discovered-locked')return a.requestIntroduction?.(facilityId,invoker)||{ok:false,reason:'facility-introduction-unavailable',writes:0};
      runtime.settle(facilityId,a.now());runtime.advanceGrowth(a.now());
      const newVisit=ui.facilityId!==facilityId||!document.querySelector('[data-phase20-21-sheet]');
      ui.facilityId=facilityId;ui.returnFocus=invoker?.isConnected?invoker:document.querySelector(`[data-phase15-facility-id="${escapeSelector(facilityId)}"]`);ui.resumedRecordId=null;
      const facility=viewFor(facilityId);ui.selectedRecordId=activeRecord(facility.records)?.opportunity.id||null;
      if(newVisit)ui.tutorial=runtime.takeContextualTutorial(facilityId);
      refresh();
      return{ok:true,writes:ui.tutorial?1:0,tutorialId:ui.tutorial?.id||null};
    }

    function closeFacility(){
      const target=ui.returnFocus;
      a.closeModal();
      ui.facilityId=null;ui.selectedRecordId=null;ui.resumedRecordId=null;ui.tutorial=null;ui.participantDrafts.clear();
      if(target?.isConnected)defer(()=>target.focus({preventScroll:true}));
      return true;
    }

    function bindModal(){
      if(!isActive())return false;
      document.querySelectorAll('[data-phase20-21-close]').forEach(button=>button.onclick=closeFacility);
      document.querySelectorAll('[data-phase20-21-sheet]').forEach(sheet=>sheet.onkeydown=event=>{if(event.key==='Escape'){event.preventDefault();closeFacility()}});
      document.querySelectorAll('[data-phase20-21-view-record]').forEach(button=>button.onclick=()=>{ui.selectedRecordId=phaseData(button,'view-record');ui.resumedRecordId=null;refresh('[data-phase20-21-record-id]')});
      document.querySelectorAll('[data-phase20-21-begin]').forEach(button=>button.onclick=()=>perform(()=>runtime.begin(ui.facilityId,phaseData(button,'begin'),button.dataset.recordIdentity),'[data-phase20-21-choice-id]'));
      document.querySelectorAll('[data-phase20-21-choice-id]').forEach(button=>button.onclick=()=>{const record=latestRecord(ui.selectedRecordId),choiceId=phaseData(button,'choice-id');if(record)perform(()=>runtime.choose(ui.facilityId,record.opportunity.id,record.identity,choiceId),`[data-phase20-21-choice-id="${escapeSelector(choiceId)}"]`)});
      document.querySelectorAll('[data-phase20-21-actor-choice]').forEach(button=>button.onclick=()=>{const record=latestRecord(ui.selectedRecordId);if(!record)return;const current=ui.participantDrafts.has(record.opportunity.id)?[...ui.participantDrafts.get(record.opportunity.id)]:[...record.participantIds],actorId=phaseData(button,'actor-choice'),index=current.indexOf(actorId);if(index>=0)current.splice(index,1);else current.push(actorId);ui.participantDrafts.set(record.opportunity.id,current);refresh(`[data-phase20-21-actor-choice="${escapeSelector(actorId)}"]`)});
      document.querySelectorAll('[data-phase20-21-save-participants]').forEach(button=>button.onclick=()=>{const record=latestRecord(ui.selectedRecordId),selected=record&&ui.participantDrafts.get(record.opportunity.id);if(record&&selected)perform(()=>runtime.selectParticipants(ui.facilityId,record.opportunity.id,record.identity,selected),'[data-phase20-21-commit]')});
      document.querySelectorAll('[data-phase20-21-cancel]').forEach(button=>button.onclick=()=>{const id=phaseData(button,'cancel');ui.participantDrafts.delete(id);perform(()=>runtime.cancel(ui.facilityId,id,button.dataset.recordIdentity),'[data-phase20-21-begin]')});
      document.querySelectorAll('[data-phase20-21-commit]').forEach(button=>button.onclick=()=>perform(()=>runtime.commit(ui.facilityId,phaseData(button,'commit'),button.dataset.recordIdentity),'[data-phase20-21-close]'));
      document.querySelectorAll('[data-phase20-21-resume]').forEach(button=>button.onclick=()=>{ui.resumedRecordId=phaseData(button,'resume');refresh('[data-phase20-21-resolve],[data-phase20-21-check-growth]')});
      document.querySelectorAll('[data-phase20-21-resolve]').forEach(button=>button.onclick=()=>perform(()=>runtime.resolve(ui.facilityId,phaseData(button,'resolve'),button.dataset.recordIdentity),'[data-phase20-21-claim]'));
      document.querySelectorAll('[data-phase20-21-check-growth]').forEach(button=>button.onclick=()=>perform(()=>runtime.advanceGrowth(a.now()),'[data-phase20-21-check-growth],[data-phase20-21-claim]'));
      document.querySelectorAll('[data-phase20-21-claim]').forEach(button=>button.onclick=()=>{const result=runtime.claim(phaseData(button,'claim'),button.dataset.offerIdentity);if(result.ok){ui.lastReceiptIdByFacility.set(ui.facilityId,result.receipt.id);ui.selectedRecordId=null;a.toast?.('Facility reward claimed.')}if(fail(result))return refresh('[data-phase20-21-claim]');refresh('[data-phase20-21-receipt-summary]')});
      document.querySelectorAll('[data-phase20-21-tutorial-action]').forEach(button=>button.onclick=()=>{if(!ui.tutorial)return;const result=runtime.tutorial(ui.tutorial.id,phaseData(button,'tutorial-action'));if(!fail(result))ui.tutorial=null;refresh('[data-phase20-21-close]')});
      document.querySelectorAll('[data-phase20-21-passive]').forEach(button=>button.onclick=()=>a.openPassiveBuilding?.(phaseData(button,'passive')));
      document.querySelectorAll('[data-phase20-21-open-tutorial-log]').forEach(button=>button.onclick=()=>a.showTutorialLog?.());
      bindTutorialLog();
      return true;
    }

    function tutorialLogRowsHtml(){
      const tutorials=derived()?.tutorials,statusById=tutorials?.statusById||{},successorIds=new Set(definitions.tutorials.map(item=>item.id));
      const predecessorIds=new Set(Object.keys(statusById)),renderedPredecessorIds=new Set;
      document.querySelectorAll('.phase-13-log-list button').forEach(button=>Object.values(button.dataset).forEach(value=>{if(predecessorIds.has(value))renderedPredecessorIds.add(value)}));
      const missingPredecessorRows=Object.entries(statusById).filter(([id])=>predecessorIds.has(id)&&!renderedPredecessorIds.has(id)),successorRows=Object.entries(statusById).filter(([id])=>successorIds.has(id)),rowHtml=(id,status,origin,body)=>`<article class="phase-13-log-row" data-phase20-21-tutorial-log-row="${esc(id)}" data-phase20-21-tutorial-origin="${origin}"><h3>${esc(humanId(id))}</h3><p>${esc(status)} · ${esc(body)}</p><div class="phase-13-log-actions"><button class="btn small" data-phase20-21-tutorial-replay="${esc(id)}" ${status==='unseen'?'disabled':''}>REPLAY</button></div></article>`;
      return`<section class="phase20-21-tutorial-ledger" data-phase20-21-tutorial-ledger><div class="es-feature-masthead compact"><div><div class="eyebrow">Complete lesson ledger</div><h3>79 carried forward · 19 new</h3></div><span class="es-state-chip">${Object.keys(statusById).length} lessons</span></div>${missingPredecessorRows.map(([id,status])=>rowHtml(id,status,'predecessor-projection','This carried-forward lesson remains available in the Tutorial Log.')).join('')}${successorRows.map(([id,status])=>rowHtml(id,status,'successor',TUTORIAL_COPY[id]||'Optional successor lesson.')).join('')}</section>`;
    }

    function normalizePredecessorTutorialRows(list){
      const canonicalIds=new Set(Object.keys(derived()?.tutorials?.statusById||{})),seen=new Set;
      list.querySelectorAll(':scope > .phase-13-log-row').forEach(row=>{
        const buttons=[...row.querySelectorAll('button')],id=row.getAttribute('data-phase1819-tutorial-log-row')||buttons.flatMap(button=>Object.values(button.dataset)).find(value=>canonicalIds.has(value))||null;
        if(!id)return;
        if(seen.has(id)){row.remove();return}
        seen.add(id);row.setAttribute('data-phase20-21-tutorial-origin','predecessor-authoritative');row.setAttribute('data-phase20-21-predecessor-id',id);
        const replayButton=buttons.find(button=>Object.values(button.dataset).includes(id));if(replayButton)replayButton.setAttribute('data-phase20-21-authoritative-predecessor-replay',id);
      });
      return seen;
    }

    function appendTutorialLog(){
      if(!isActive())return false;
      const list=document.querySelector('.phase-13-log-list');
      if(!list||list.querySelector('[data-phase20-21-tutorial-ledger]'))return false;
      normalizePredecessorTutorialRows(list);
      list.insertAdjacentHTML('beforeend',tutorialLogRowsHtml());bindTutorialLog();return true;
    }

    function predecessorReplayButton(id,invoker){return[...document.querySelectorAll('button')].find(button=>button!==invoker&&Object.values(button.dataset).includes(id)&&!button.hasAttribute('data-phase20-21-tutorial-replay'))||null}
    function bindTutorialLog(){
      document.querySelectorAll('[data-phase20-21-authoritative-predecessor-replay]').forEach(button=>{
        const id=button.getAttribute('data-phase20-21-authoritative-predecessor-replay'),nativeReplay=button.onclick;if(typeof nativeReplay!=='function')return;
        button.onclick=()=>{ui.tutorialReplayReturn={id,origin:'predecessor-authoritative'};const result=nativeReplay.call(button);defer(()=>{const surface=document.querySelector(`[data-phase15-tutorial="${escapeSelector(id)}"],[data-phase16-tutorial="${escapeSelector(id)}"],[data-phase13-tutorial="${escapeSelector(id)}"],[data-phase1819-tutorial-replay-sheet="${escapeSelector(id)}"],[data-phase17-facility-introduction]`);if(!surface)return;surface.setAttribute('data-phase20-21-tutorial-replay-owner','predecessor-authoritative');surface.querySelectorAll('[data-modal-close],[data-phase1819-tutorial-replay-close],[data-phase17-close]').forEach(close=>{const nativeClose=close.onclick;close.onclick=()=>{const replay=ui.tutorialReplayReturn;ui.tutorialReplayReturn=null;if(typeof nativeClose==='function')nativeClose.call(close);a.showTutorialLog?.();appendTutorialLog();defer(()=>document.querySelector(`[data-phase20-21-tutorial-origin="${escapeSelector(replay?.origin)}"] [data-phase20-21-authoritative-predecessor-replay="${escapeSelector(replay?.id)}"]`)?.focus({preventScroll:true}))}})});return result};
      });
      document.querySelectorAll('[data-phase20-21-tutorial-replay]').forEach(button=>button.onclick=()=>{
        const id=phaseData(button,'tutorial-replay'),origin=button.closest('[data-phase20-21-tutorial-origin]')?.getAttribute('data-phase20-21-tutorial-origin')||'predecessor',isSuccessor=origin==='successor';
        if(!isSuccessor){const prior=predecessorReplayButton(id,button);if(prior)return prior.click()}
        const result=isSuccessor?runtime.tutorial(id,'replay'):{ok:true,writes:0};if(fail(result))return;
        ui.tutorialReplayReturn={id,origin};
        const replayLabel=isSuccessor?'Successor lesson replay · reward neutral':'Carried lesson replay · read only',replayBody=isSuccessor?(TUTORIAL_COPY[id]||'This optional successor lesson remains reward-neutral.'):'This missing carried-forward presentation is restored as a read-only replay. Its predecessor status and replay count remain authoritative and unchanged.';
        a.showModal(`<section class="phase20-21-sheet" data-phase20-21-tutorial-replay-sheet="${esc(id)}" data-phase20-21-tutorial-replay-owner="${esc(origin)}" aria-labelledby="everstead-modal-title"><header class="es-feature-masthead"><div><div class="eyebrow">${esc(replayLabel)}</div><h2 id="everstead-modal-title">${esc(humanId(id))}</h2></div><button class="close" data-phase20-21-tutorial-replay-close aria-label="Close tutorial replay">×</button></header><p>${esc(replayBody)}</p><button class="btn primary wide" data-phase20-21-tutorial-replay-close>CLOSE</button></section>`);focus('[data-phase20-21-tutorial-replay-close]');
      });
      document.querySelectorAll('[data-phase20-21-tutorial-replay-close]').forEach(button=>button.onclick=()=>{const replay=ui.tutorialReplayReturn;ui.tutorialReplayReturn=null;a.showTutorialLog?.();appendTutorialLog();defer(()=>document.querySelector(`[data-phase20-21-tutorial-origin="${escapeSelector(replay?.origin)}"] [data-phase20-21-tutorial-replay="${escapeSelector(replay?.id)}"]`)?.focus({preventScroll:true}))});
    }

    return Object.freeze({bindCommon,bindModal,openFacility,closeFacility,appendTutorialLog,tutorialLogRowsHtml,state:()=>Object.freeze({facilityId:ui.facilityId,selectedRecordId:ui.selectedRecordId,resumedRecordId:ui.resumedRecordId})});
  }

  Object.defineProperty(root,'EVERSTEAD_PHASE20_21_PRESENTATION',{value:Object.freeze({version:1,install}),enumerable:false,configurable:false,writable:false});
})(globalThis);
