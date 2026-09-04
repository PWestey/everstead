(()=>{
 'use strict';

 const VERSION=1;
 const ID='everstead.phase24k.screen-art.v1';
 const SCHEMA_VERSION=14;
 let installed=false;
 let villageSpeakerVisible=true;
 let fellowshipPanel=null;
 let fellowshipActivationCount=0;

 function install(adapter){
  if(installed)return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:true});
  if(!adapter||adapter.version!==1||!adapter.document||!adapter.slots||!adapter.api)return Object.freeze({ok:false,reason:'adapter'});
  const {document,slots,api}=adapter;
  const required=['villageScreen','rosterScreen','campaignView','openPlayerProfile','bindCommon'];
  if(required.some(name=>typeof slots[name]?.get!=='function'||typeof slots[name]?.set!=='function'))return Object.freeze({ok:false,reason:'slots'});
  if(typeof api.state!=='function'||typeof api.escape!=='function'||typeof api.atlas!=='function'||typeof api.fellow!=='function'||typeof api.power!=='function'||typeof api.joinedIds!=='function'||typeof api.might!=='function'||typeof api.bindModal!=='function'||typeof api.decorateModal!=='function')return Object.freeze({ok:false,reason:'api'});

  const villageBefore=slots.villageScreen.get();
  slots.villageScreen.set(function(){
   let html=villageBefore();
   if(api.state()?.schemaVersion!==SCHEMA_VERSION)return html;
   const hidden=villageSpeakerVisible?'':' hidden';
   const shown=villageSpeakerVisible?' hidden':'';
   html=html.replace('<main class="screen village-screen"','<main class="screen village-screen" data-phase24k-village-speaker');
   html=html.replace('<div class="speech">',`<div class="speech" data-phase24k-village-speech${hidden}><button type="button" class="phase24k-speaker-hide" data-phase24k-speaker-hide aria-label="Hide Village character and quote">×</button>`);
   html=html.replace('<div class="village-character">',`<div class="village-character" data-phase24k-village-character${hidden}>`);
   html=html.replace('<details class="phase24i-village-panel phase24i-production-panel"',`<button type="button" class="phase24k-speaker-show" data-phase24k-speaker-show aria-label="Show Village character and quote"${shown}>SHOW CHARACTER</button><details class="phase24i-village-panel phase24i-production-panel"`);
   return html;
  });

  const rosterBefore=slots.rosterScreen.get();
  slots.rosterScreen.set(function(){
   let html=rosterBefore();
   const state=api.state();
   if(state?.schemaVersion!==SCHEMA_VERSION||(state.ui?.roster||'fellows')!=='fellows')return html;
   const joined=api.joinedIds(state),focusId=joined.includes(state.focusFellow)?state.focusFellow:joined[0],definition=api.fellow(focusId),fellowState=state.fellows?.[focusId];
   if(!definition||!fellowState)return html;
   const hero=`<button type="button" class="phase24k-fellowship-hero" data-phase24k-fellowship-hero data-fellow="${api.escape(definition.id)}" aria-label="Open ${api.escape(definition.name)} Fellow profile"><span class="phase24k-fellowship-hero-art">${api.atlas('fellow',definition.idx,'figure')}</span><span class="phase24k-fellowship-hero-copy"><small>FOCUS FELLOW · ${api.escape(definition.type)}</small><strong>${api.escape(definition.name)}</strong><em>${api.escape(definition.title)}</em><span>Level ${fellowState.level} · ★${fellowState.rarity} · ${api.escape(api.format(api.power(definition.id)))} Power</span></span></button>`;
   const might=api.might(),ribbon=`<div class="phase24k-fellowship-ribbon" data-phase24k-fellowship-ribbon aria-label="Fellowship details"><button type="button" data-phase24k-panel-toggle="might" aria-expanded="${fellowshipPanel==='might'}">MIGHT <b>M${might.level}</b></button><button type="button" data-phase24k-panel-toggle="path" aria-expanded="${fellowshipPanel==='path'}">PATH <b>${joined.length}/18</b></button><button type="button" data-phase24k-panel-toggle="tools" aria-expanded="${fellowshipPanel==='tools'}">ROSTER <b>⌄</b></button></div>`;
   html=html.replace('<main class="screen"',`<main class="screen" data-phase24k-fellowship`);
   html=html.replace('<div class="tabs"',hero+'<div class="tabs"');
   html=html.replace(/(<div class="tabs">[\s\S]*?<\/div>)/,`$1${ribbon}`);
   return html;
  });

  const campaignBefore=slots.campaignView.get();
  slots.campaignView.set(function(){
   let html=campaignBefore();
   if(api.state()?.schemaVersion!==SCHEMA_VERSION||!html.includes('data-campaign-stage'))return html;
   html=html.replace(/<section class="card player-rank[^\"]*"[^>]*>[\s\S]*?<\/section>/,'');
   html=html.replace('<div class="adventure-hero campaign-walk"',`<div class="adventure-hero campaign-walk" data-phase24k-adventure-scene`);
   const rank=api.state().player.rank,badge=`<button type="button" class="phase24k-wayfarer-badge" data-player-profile data-phase24k-wayfarer-badge aria-label="Open The Wayfarer Player profile, Rank ${rank}"><img src="assets/player/wayfarer-profile-full.png" alt="" width="1024" height="1536"><span>WAYFARER <b>R${rank}</b></span></button>`;
   html=html.replace(/(<div class="adventure-hero campaign-walk"[^>]*>)/,`$1${badge}`);
   html=html.replace('<div class="campaign-player" aria-label="The Wayfarer"></div>','<img class="campaign-player phase24k-wayfarer-cutout" data-phase24k-wayfarer-cutout src="assets/player/wayfarer-campaign-phase24k.png" width="1024" height="1536" alt="The Wayfarer walking the Broken Roads" decoding="async">');
   return html;
  });

  const profileBefore=slots.openPlayerProfile.get();
  slots.openPlayerProfile.set(function(){
   const result=profileBefore();
   const modal=document.querySelector('#overlay .modal');
   if(!modal||modal.querySelector('[data-phase17-player-profile-art], [data-phase24k-wayfarer-profile-art]'))return result;
   const rank=api.state()?.player?.rank||1;
   modal.classList.add('phase24k-wayfarer-profile-modal');
   modal.setAttribute('data-phase24k-wayfarer-profile','player.wayfarer');
   modal.setAttribute('data-player-roster-member','false');
   modal.insertAdjacentHTML('afterbegin',`<section class="phase24k-wayfarer-profile-art" data-phase24k-wayfarer-profile-art="assets/player/wayfarer-profile-full.png" data-image-state="ready"><img src="assets/player/wayfarer-profile-full.png" width="1024" height="1536" alt="The Wayfarer overlooking Everstead" decoding="async" fetchpriority="high"><button type="button" class="close phase24k-wayfarer-profile-close" data-modal-close aria-label="Close The Wayfarer profile">×</button><div class="phase24k-wayfarer-profile-title"><div class="eyebrow">PLAYER CHARACTER · RANK ${rank}</div><h2>The Wayfarer</h2><p>Your road through Everstead. Rank EXP opens new campaign routes, Fellows, and Village stories.</p></div></section>`);
   const art=modal.querySelector('[data-phase24k-wayfarer-profile-art]'),image=art?.querySelector('img');
   if(image)image.onerror=()=>{image.hidden=true;art.dataset.imageState='fallback'};
   api.bindModal();
   api.decorateModal();
   api.defer(()=>modal.querySelector('.phase24k-wayfarer-profile-close')?.focus());
   return result;
  });

  function updateFellowshipPanels(root=document){
   const screen=root.querySelector?.('[data-phase24k-fellowship]');
   if(!screen)return;
   screen.dataset.phase24kPanelState=fellowshipPanel||'closed';
   screen.dataset.phase24kPanelActivations=String(fellowshipActivationCount);
   const targets={might:screen.querySelector('[data-fellow-might-summary]'),path:screen.querySelector('[data-phase-11g-path]'),tools:screen.querySelector('[data-phase-11d-roster-tools]')};
   for(const [key,node] of Object.entries(targets))if(node){node.hidden=fellowshipPanel!==key;node.dataset.phase24kDisclosure=key}
   screen.querySelectorAll('[data-phase24k-panel-toggle]').forEach(button=>{
    const key=button.dataset.phase24kPanelToggle;
    button.setAttribute('aria-expanded',String(fellowshipPanel===key));
   });
  }

  document.addEventListener('click',event=>{
   const button=event.target?.closest?.('[data-phase24k-panel-toggle]');
   if(!button||!button.closest('[data-phase24k-fellowship]'))return;
   const key=button.dataset.phase24kPanelToggle;
   if(!['might','path','tools'].includes(key))return;
   event.preventDefault();
   fellowshipPanel=button.getAttribute('aria-expanded')==='true'?null:key;
   fellowshipActivationCount+=1;
   updateFellowshipPanels(document);
  },true);

  function bindVillage(root=document){
   const speech=root.querySelector?.('[data-phase24k-village-speech]'),character=root.querySelector?.('[data-phase24k-village-character]'),hide=root.querySelector?.('[data-phase24k-speaker-hide]'),show=root.querySelector?.('[data-phase24k-speaker-show]');
   const apply=()=>{if(speech)speech.hidden=!villageSpeakerVisible;if(character)character.hidden=!villageSpeakerVisible;if(hide)hide.hidden=!villageSpeakerVisible;if(show)show.hidden=villageSpeakerVisible};
   if(hide)hide.onclick=()=>{villageSpeakerVisible=false;apply();show?.focus()};
   if(show)show.onclick=()=>{villageSpeakerVisible=true;apply();hide?.focus()};
   apply();
  }

  const bindBefore=slots.bindCommon.get();
  slots.bindCommon.set(function(){
   const result=bindBefore();
   const root=document.querySelector('#app')||document;
   bindVillage(root);
   updateFellowshipPanels(root);
   root.querySelectorAll?.('[data-phase24k-wayfarer-cutout]').forEach(image=>{image.onerror=()=>{image.hidden=true;image.closest('[data-phase24k-adventure-scene]')?.setAttribute('data-wayfarer-image-state','fallback')}});
   return result;
  });

  installed=true;
  return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:false});
 }

 Object.defineProperty(globalThis,'EVERSTEAD_PHASE24K_SCREEN_ART',{configurable:false,enumerable:false,writable:false,value:Object.freeze({version:VERSION,id:ID,schemaVersion:SCHEMA_VERSION,install})});
})();
