(()=>{
 'use strict';

 const VERSION=1;
 const ID='everstead.phase24e.shell-controller.v1';
 const SCHEMA_VERSION=14;
 const RENDER_IDENTITY='everstead.phase24e.shell.schema14.v1';
 const VIEWS=Object.freeze(['village','oaths','fellows','adventure','more']);
 const ROSTERS=Object.freeze(['fellows','family','companions','relics']);
 let navigationCalls=0,rosterSelectionCalls=0,topbarRenders=0;

 function currentState(state){
  return Boolean(state&&state.schemaVersion===SCHEMA_VERSION&&state.ui&&typeof state.ui==='object');
 }

 function navigate({state,view,activityRunning=false,stopActivity,rotateVillage,complete,resetScroll}){
  if(!currentState(state)||!VIEWS.includes(view))return false;
  navigationCalls++;
  const prior=state.ui.view;
  if(activityRunning&&view!=='adventure')stopActivity?.('Stopped because the main screen changed.');
  state.ui.view=view;
  if(view==='village')rotateVillage?.();
  const result=complete('view',view);
  if(result?.ok&&view!==prior)resetScroll?.();
  return result;
 }

 function selectRoster({state,roster,activityRunning=false,stopActivity,complete}){
  if(!currentState(state)||!ROSTERS.includes(roster))return false;
  rosterSelectionCalls++;
  if(activityRunning)stopActivity?.('Stopped because the Fellowship roster changed.');
  state.ui.roster=roster;
  return complete('roster',roster);
 }

 function renderTopbar({pendingGold=0,pendingExtras=0,gifts=0,gold=0,rank=1,format,escape}){
  topbarRenders++;
  const fmt=typeof format==='function'?format:value=>String(value);
  const esc=typeof escape==='function'?escape:value=>String(value);
  const pendingLabel=pendingGold||pendingExtras?`Collect Village rewards: ${pendingGold?`${fmt(pendingGold)} Gold`:''}${pendingGold&&pendingExtras?' and ':''}${pendingExtras?`${pendingExtras} bonus reward${pendingExtras===1?'':'s'}`:''} ready`:'Collect Village rewards: nothing ready';
  return`<header class="topbar phase24e-topbar" data-phase24e-topbar data-phase24e-shell-owner="${ID}"><div class="brand phase24e-brand" data-phase24e-brand><small>LIMITED PREVIEW</small><b>EVERSTEAD</b></div><div class="resources phase24e-resources" data-phase24e-resources><button class="collect-mini" data-act="collect" aria-label="${esc(pendingLabel)}" title="${esc(pendingLabel)}"><span class="phase24e-pending-gold"><b data-phase24e-pending-gold>+${fmt(pendingGold)}</b> Gold</span>${pendingExtras?`<span class="phase24e-pending-extra"> · <b>${pendingExtras}</b> bonus</span>`:''}</button><span class="res-pill" data-resource="gifts" aria-label="Gifts: ${fmt(gifts)}" title="Gifts">◆ <b data-gifts>${fmt(gifts)}</b></span><span class="res-pill gold" data-resource="gold" aria-label="Gold: ${fmt(gold)}" title="Gold">◈ <b data-gold>${fmt(gold)}</b></span><button type="button" class="res-pill player-profile-pill" data-player-profile aria-label="Open The Wayfarer Player profile, Rank ${rank}">R${rank}</button></div></header>`;
 }

 function diagnostics(){return Object.freeze({version:VERSION,id:ID,schemaVersion:SCHEMA_VERSION,renderIdentity:`${RENDER_IDENTITY}.render-${topbarRenders}`,navigationCalls,rosterSelectionCalls,topbarRenders})}

 const controller=Object.freeze({version:VERSION,id:ID,schemaVersion:SCHEMA_VERSION,renderIdentity:RENDER_IDENTITY,views:VIEWS,rosters:ROSTERS,navigate,selectRoster,renderTopbar,diagnostics});
 Object.defineProperty(globalThis,'EVERSTEAD_PHASE24E_SHELL_CONTROLLER',{configurable:false,enumerable:false,writable:false,value:controller});
})();
