/* Everstead Phase 24L-C1 · bounded Companion EXP investment sheet. */
(()=>{
 'use strict';

 const VERSION=1;
 const ID='everstead.phase24l.companion-exp-ui.v1';
 const PROFILE_SHELL_ID='everstead.phase24l.profile-shell.v1';
 const TUTORIAL_IDS=Object.freeze({earned:'tutorial.phase-24l-c1.companion-exp-earned.v1',spent:'tutorial.phase-24l-c1.companion-exp-spent.v1'});
 const MODES=Object.freeze(['x1','x10','max']);
 let installed=false;

 const finite=value=>typeof value==='number'&&Number.isFinite(value);
 const amount=value=>finite(value)?Math.max(0,value):0;
 const modeValue=value=>MODES.includes(value)?value:'x1';
 const text=(value,escape)=>escape(String(value??''));
 const formatted=(value,format,escape)=>text(format(amount(value)),escape);
 const signed=(value,format,escape)=>{const numeric=finite(value)?value:0;return`${numeric===0?'':numeric<0?'−':'+'}${text(format(Math.abs(numeric)),escape)}`};

 function panelFor(document,id){
  const shell=document.querySelector('#overlay [data-phase24l-profile="companion"]');
  if(!shell||shell.dataset.phase24lSubjectId!==String(id))return null;
  return shell.querySelector('[data-phase24l-panel="level"]');
 }
 function messageFor(preview){
  if(preview?.atCap)return'Level cap reached. No Companion EXP will be spent.';
  if(preview?.available===false)return'This Companion is not available for investment.';
  if(preview?.valid!==true)return'The Companion EXP preview is unavailable. Nothing will be spent.';
  if(preview?.affordable===false)return`Bank ${preview?.costNeeded||preview?.cost||0} more Companion EXP to use this option.`;
  return'EXP bonuses were settled when earned. Spending never applies them again.';
 }
 function assignmentMarkup(preview,format,escape){
  const assignment=preview?.assignment;
  if(!assignment||assignment.assigned!==true)return'';
  const rate=finite(assignment.transferRatePercent)?assignment.transferRatePercent:40;
  return`<div class="phase24l-c1-exp-assignment" data-phase24l-c1-exp-assignment aria-label="Assigned Fellow support preview">
   <span><small>${text(assignment.fellowName||'Assigned Fellow',escape)} · ${text(String(rate),escape)}% support</small><b>${formatted(assignment.supportBefore,format,escape)} → ${formatted(assignment.supportAfter,format,escape)}</b></span>
   <span><small>Fellow Power</small><b>${signed(assignment.fellowPowerDelta,format,escape)}</b></span>
  </div>`;
 }
 function previewMarkup(preview,requestedMode,format,escape){
  const safe=preview&&typeof preview==='object'?preview:{},mode=modeValue(safe.mode||requestedMode),levelBefore=amount(safe.levelBefore),levelAfter=finite(safe.levelAfter)?Math.max(0,safe.levelAfter):levelBefore,powerBefore=amount(safe.powerBefore),powerAfter=finite(safe.powerAfter)?Math.max(0,safe.powerAfter):powerBefore,cost=amount(safe.cost),walletBefore=amount(safe.walletBefore),walletAfter=finite(safe.walletAfter)?Math.max(0,safe.walletAfter):walletBefore,progress=amount(safe.progress),needed=amount(safe.needed),progressMax=needed||1,progressNow=needed?Math.min(progress,needed):1,percent=needed?Math.max(0,Math.min(100,progress/needed*100)):100,enabled=safe.valid===true&&safe.available!==false&&safe.affordable===true&&!safe.atCap&&typeof safe.identity==='string'&&safe.identity.length>0,reason=messageFor(safe);
  return`<div class="phase24l-c1-exp-level" data-phase24l-c1-exp-investment>
   <div class="phase24l-c1-exp-wallet" data-phase24l-c1-exp-wallet><div><small>Shared Companion EXP</small><b>${formatted(walletBefore,format,escape)}</b></div><span>${enabled?`${formatted(walletAfter,format,escape)} after`:'Available to invest'}</span></div>
   <div class="phase24l-c1-exp-invested" data-phase24l-c1-exp-invested><div><small>Invested EXP · Level ${text(String(levelBefore),escape)}</small><b>${formatted(safe.expBefore,format,escape)}</b></div><span>${safe.atCap?'MAX':`${formatted(progress,format,escape)} / ${formatted(needed,format,escape)} next`}</span></div>
   <div class="progress" role="progressbar" aria-label="Invested Companion EXP progress" aria-valuemin="0" aria-valuemax="${text(String(progressMax),escape)}" aria-valuenow="${text(String(progressNow),escape)}"><i style="width:${percent}%"></i></div>
   <div class="phase24l-c1-exp-modes" data-phase24l-c1-exp-modes role="group" aria-label="Companion EXP investment amount">
    <button type="button" data-phase24l-c1-exp-mode="x1" aria-pressed="${mode==='x1'}">x1</button>
    <button type="button" data-phase24l-c1-exp-mode="x10" aria-pressed="${mode==='x10'}">x10</button>
    <button type="button" data-phase24l-c1-exp-mode="max" aria-pressed="${mode==='max'}">Max</button>
   </div>
   <div class="phase24l-c1-exp-preview" data-phase24l-c1-exp-preview aria-live="polite" aria-atomic="true"><div><small>Before</small><b>L${text(String(levelBefore),escape)} · ${formatted(powerBefore,format,escape)} Power</b></div><i aria-hidden="true">›</i><div><small>After</small><b>L${text(String(levelAfter),escape)} · ${formatted(powerAfter,format,escape)} Power</b></div></div>
   ${assignmentMarkup(safe,format,escape)}
   <div class="phase24l-c1-exp-cost"><span>Exact wallet cost</span><b>${formatted(cost,format,escape)} Companion EXP</b></div>
   <p class="phase24l-c1-exp-reason" id="phase24l-c1-exp-reason">${text(reason,escape)}</p>
   <div class="phase24l-c1-exp-actions"><button type="button" class="btn primary wide phase24l-c1-exp-commit" data-phase24l-c1-exp-commit aria-describedby="phase24l-c1-exp-reason" ${enabled?'':'disabled'}>${enabled?`INVEST ${formatted(cost,format,escape)} EXP · REACH LEVEL ${text(String(levelAfter),escape)}`:safe.atCap?'LEVEL CAP REACHED':'NOT READY TO INVEST'}</button><button type="button" data-phase24l-c1-tutorial="replay" aria-label="Replay Companion EXP tutorial">?</button></div>
   <div class="sr-only" role="status" aria-live="polite" aria-atomic="true" data-phase24l-c1-exp-status></div>
  </div>`;
 }
 function successMessage(result,preview,api){
  const spent=result?.spentAmount??preview?.cost??0,level=result?.level??preview?.levelAfter??preview?.levelBefore??0,balance=result?.balance??preview?.walletAfter??preview?.walletBefore??0,assignment=preview?.assignment;
  let message=`Invested ${api.format(amount(spent))} Companion EXP. Level ${level}. ${api.format(amount(balance))} Companion EXP remains.`;
  if(assignment?.assigned===true){const supportDelta=(assignment.supportAfter??0)-(assignment.supportBefore??0),fellowDelta=assignment.fellowPowerDelta??0;message+=` ${assignment.fellowName||'Assigned Fellow'} support ${supportDelta<0?'decreased':'increased'} by ${api.format(Math.abs(supportDelta))}; Fellow Power ${fellowDelta<0?'decreased':'increased'} by ${api.format(Math.abs(fellowDelta))}.`}
  return message;
 }
 function focusAfter(content,target,mode){
  let node=null;
  if(target==='commit')node=content.querySelector('[data-phase24l-c1-exp-commit]:not([disabled])');
  if(!node&&target==='help')node=content.querySelector('[data-phase24l-c1-tutorial="replay"]');
  if(!node)node=content.querySelector(`[data-phase24l-c1-exp-mode="${modeValue(mode)}"]`);
  node?.focus();
 }
 function decorate(document,id,api,requestedMode='x1',options={}){
  const panel=panelFor(document,id),content=panel?.querySelector(':scope > [data-phase24l-sheet-content]');
  if(!content)return null;
  const mode=modeValue(requestedMode);
  let preview;
  try{preview=api.preview(id,mode)}catch{preview={valid:false,available:false,affordable:false,mode,reason:'preview-unavailable'}}
  content.innerHTML=previewMarkup(preview,mode,api.format,api.escape);
  content.dataset.phase24lC1LevelContent='true';
  const shell=panel.closest('[data-phase24l-profile="companion"]');
  if(shell)shell.dataset.phase24lCompanionExpLive='true';
  content.querySelectorAll('[data-phase24l-c1-exp-mode]').forEach(button=>button.onclick=()=>decorate(document,id,api,button.dataset.phase24lC1ExpMode,{focus:'mode'}));
  const commit=content.querySelector('[data-phase24l-c1-exp-commit]');
  if(commit)commit.onclick=event=>{
   event.stopPropagation();
   commit.disabled=true;
   let result;
   try{result=api.spend(id,mode,preview?.identity)}catch(error){result={ok:false,reason:String(error?.message||'The Companion EXP investment was not applied.')}}
   if(result?.ok){
    api.refreshProfile?.(id);
    const announcement=successMessage(result,preview,api),refreshed=decorate(document,id,api,mode,{focus:'commit',announcement});
    api.onSpent?.(result,id,preview,refreshed);
   }else{
    const refreshed=decorate(document,id,api,mode,{focus:'commit',announcement:result?.reason||'The Companion EXP investment was not applied.'});
    api.onRefused?.(result,id,preview,refreshed);
   }
  };
  const tutorial=content.querySelector('[data-phase24l-c1-tutorial="replay"]');
  if(tutorial)tutorial.onclick=()=>{api.replayTutorial?.(TUTORIAL_IDS,id);focusAfter(content,'help',mode)};
  const status=content.querySelector('[data-phase24l-c1-exp-status]');
  if(status&&options.announcement)status.textContent=String(options.announcement);
  if(options.focus)focusAfter(content,options.focus==='mode'?'mode':options.focus,mode);
  return content;
 }
 function install(adapter){
  if(installed)return Object.freeze({ok:true,id:ID,version:VERSION,reused:true});
  if(!adapter||adapter.version!==1||adapter.profileShellId!==PROFILE_SHELL_ID||!adapter.document||typeof adapter.slot?.get!=='function'||typeof adapter.slot?.set!=='function'||typeof adapter.api?.preview!=='function'||typeof adapter.api?.spend!=='function'||typeof adapter.api?.format!=='function'||typeof adapter.api?.escape!=='function')return Object.freeze({ok:false,reason:'adapter'});
  const before=adapter.slot.get();
  if(typeof before!=='function')return Object.freeze({ok:false,reason:'open-companion-slot'});
  adapter.slot.set(function(...args){const result=before.apply(this,args);decorate(adapter.document,args[0],adapter.api);return result});
  installed=true;
  return Object.freeze({ok:true,id:ID,version:VERSION,reused:false,mechanicsChanged:false,saveChanged:false});
 }

 const contract=Object.freeze({version:1,profileShellId:PROFILE_SHELL_ID,previewAssignmentFields:Object.freeze(['assigned','fellowName','transferRatePercent','supportBefore','supportAfter','fellowPowerBefore','fellowPowerAfter','fellowPowerDelta'])});
 Object.defineProperty(globalThis,'EVERSTEAD_PHASE24L_COMPANION_EXP_UI',{configurable:false,enumerable:false,writable:false,value:Object.freeze({version:VERSION,id:ID,tutorialIds:TUTORIAL_IDS,contract,install})});
})();
