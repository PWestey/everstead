/* Everstead Phase 24L-B1 · bounded Fellow EXP investment sheet. */
(()=>{
 'use strict';

 const VERSION=1;
 const ID='everstead.phase24l.fellow-exp-ui.v1';
 const TUTORIAL_IDS=Object.freeze({earned:'tutorial.phase-24l-b1.fellow-exp-earned.v1',spent:'tutorial.phase-24l-b1.fellow-exp-spent.v1'});
 let installed=false;

 function panelFor(document){return document.querySelector('#overlay [data-phase24l-profile="fellow"] [data-phase24l-panel="level"]')}
 function messageFor(preview){
  if(preview?.atCap)return'Level cap reached. No EXP will be spent.';
  if(preview?.available===false)return'This Fellow has not joined the active roster yet.';
  if(preview?.affordable===false)return`Bank ${preview?.costNeeded||preview?.cost||0} more Fellow EXP to use this option.`;
  return'EXP bonuses were settled when earned. Spending never applies them again.';
 }
 function previewMarkup(preview,format,escape){
  const safe=preview&&typeof preview==='object'?preview:{},levelBefore=safe.levelBefore??0,levelAfter=safe.levelAfter??levelBefore,powerBefore=safe.powerBefore??0,powerAfter=safe.powerAfter??powerBefore,cost=safe.cost??0,walletBefore=safe.walletBefore??0,walletAfter=safe.walletAfter??walletBefore,progress=safe.progress??0,needed=safe.needed??0,percent=needed?Math.max(0,Math.min(100,progress/needed*100)):100,enabled=safe.valid===true&&safe.affordable===true&&!safe.atCap;
  return`<div class="phase24l-exp-level" data-phase24l-exp-investment>
   <div class="phase24l-exp-wallet" data-phase24l-exp-wallet><div><small>Shared Fellow EXP</small><b>${escape(format(walletBefore))}</b></div><span>${enabled?`${escape(format(walletAfter))} after`:'Available to invest'}</span></div>
   <div class="phase24l-exp-invested" data-phase24l-exp-invested><div><small>Invested EXP · Level ${escape(String(levelBefore))}</small><b>${escape(format(safe.expBefore??0))}</b></div><span>${safe.atCap?'MAX':`${escape(format(progress))} / ${escape(format(needed))} next`}</span></div>
   <div class="progress" aria-label="Invested EXP progress"><i style="width:${percent}%"></i></div>
   <div class="phase24l-exp-modes" role="group" aria-label="EXP investment amount">
    <button type="button" data-phase24l-exp-mode="x1" aria-pressed="${safe.mode==='x1'}">x1</button>
    <button type="button" data-phase24l-exp-mode="x10" aria-pressed="${safe.mode==='x10'}">x10</button>
    <button type="button" data-phase24l-exp-mode="max" aria-pressed="${safe.mode==='max'}">Max</button>
   </div>
   <div class="phase24l-exp-preview" aria-live="polite"><div><small>Before</small><b>L${escape(String(levelBefore))} · ${escape(format(powerBefore))} Power</b></div><i aria-hidden="true">›</i><div><small>After</small><b>L${escape(String(levelAfter))} · ${escape(format(powerAfter))} Power</b></div></div>
   <div class="phase24l-exp-cost"><span>Exact wallet cost</span><b>${escape(format(cost))} Fellow EXP</b></div>
   <button type="button" class="btn primary wide phase24l-exp-commit" data-phase24l-exp-commit ${enabled?'':'disabled'}>${enabled?`INVEST ${escape(format(cost))} EXP · REACH LEVEL ${escape(String(levelAfter))}`:'NOT READY TO INVEST'}</button>
   <div class="phase24l-exp-guidance"><p class="phase24l-exp-note">${escape(messageFor(safe))}</p><button type="button" data-phase24l-b1-tutorial="replay" aria-label="Replay Fellow EXP tutorial">?</button></div>
   <div class="sr-only" role="status" data-phase24l-exp-status></div>
  </div>`;
 }
 function decorate(document,id,api,mode='x1'){
  const panel=panelFor(document),content=panel?.querySelector('[data-phase24l-sheet-content]');
  if(!content)return null;
  const preview=api.preview(id,mode);
  content.innerHTML=previewMarkup(preview,api.format,api.escape);
  const shell=panel.closest('[data-phase24l-profile]');
  if(shell)shell.dataset.phase24lExpLive='true';
  content.querySelectorAll('[data-phase24l-exp-mode]').forEach(button=>button.onclick=()=>decorate(document,id,api,button.dataset.phase24lExpMode));
  const commit=content.querySelector('[data-phase24l-exp-commit]');
  if(commit)commit.onclick=()=>{
   const result=api.spend(id,preview.mode,preview.identity);
   if(result?.ok){decorate(document,id,api,preview.mode);api.onSpent?.(result,id)}
   else{
    const refreshed=decorate(document,id,api,preview.mode),status=refreshed?.querySelector('[data-phase24l-exp-status]');
    if(status)status.textContent=result?.reason||'The EXP investment was not applied.';
    api.onRefused?.(result,id);
   }
  };
  const tutorial=content.querySelector('[data-phase24l-b1-tutorial="replay"]');
  if(tutorial)tutorial.onclick=()=>api.replayTutorial?.(TUTORIAL_IDS);
  return content;
 }
 function install(adapter){
  if(installed)return Object.freeze({ok:true,id:ID,version:VERSION,reused:true});
  if(!adapter||adapter.version!==1||!adapter.document||typeof adapter.slot?.get!=='function'||typeof adapter.slot?.set!=='function'||typeof adapter.api?.preview!=='function'||typeof adapter.api?.spend!=='function'||typeof adapter.api?.format!=='function'||typeof adapter.api?.escape!=='function')return Object.freeze({ok:false,reason:'adapter'});
  const before=adapter.slot.get();
  adapter.slot.set(function(id){const result=before(id);decorate(adapter.document,id,adapter.api);return result});
  installed=true;
  return Object.freeze({ok:true,id:ID,version:VERSION,reused:false,saveChanged:false});
 }

 Object.defineProperty(globalThis,'EVERSTEAD_PHASE24L_FELLOW_EXP_UI',{configurable:false,enumerable:false,writable:false,value:Object.freeze({version:VERSION,id:ID,install})});
})();
