(()=>{
 'use strict';

 const VERSION=1;
 const ID='everstead.phase24l.profile-shell.v1';
 const SCHEMA_VERSION=14;
 const controlState=new WeakMap();
 let installed=false;
 let closeProfile=null;

 const PROFILE_DEFINITIONS=Object.freeze({
  fellow:Object.freeze([
   Object.freeze({id:'overview',icon:'✦',label:'Overview'}),
   Object.freeze({id:'level',icon:'↑',label:'Level'}),
   Object.freeze({id:'rank',icon:'★',label:'Rank'}),
   Object.freeze({id:'relics',icon:'◇',label:'Relics'}),
   Object.freeze({id:'bonds',icon:'♡',label:'Bonds'})
  ]),
  family:Object.freeze([
   Object.freeze({id:'overview',icon:'✦',label:'Overview'}),
   Object.freeze({id:'gifts',icon:'❖',label:'Gifts'}),
   Object.freeze({id:'rank',icon:'★',label:'Rank'}),
   Object.freeze({id:'building',icon:'⌂',label:'Building'}),
   Object.freeze({id:'bonds',icon:'♡',label:'Bonds'})
  ]),
  companion:Object.freeze([
   Object.freeze({id:'overview',icon:'✦',label:'Overview'}),
   Object.freeze({id:'level',icon:'↑',label:'Level'}),
   Object.freeze({id:'rank',icon:'★',label:'Rank'}),
   Object.freeze({id:'assignment',icon:'↔',label:'Assign'}),
   Object.freeze({id:'mastery',icon:'◆',label:'Mastery'})
  ]),
  wayfarer:Object.freeze([
   Object.freeze({id:'overview',icon:'✦',label:'Overview'}),
   Object.freeze({id:'rank',icon:'↑',label:'Rank'}),
   Object.freeze({id:'unlocks',icon:'◇',label:'Unlocks'}),
   Object.freeze({id:'chronicle',icon:'▤',label:'Chronicle'}),
   Object.freeze({id:'settings',icon:'⚙',label:'Settings'})
  ])
 });

 const controlsIn=panel=>[...panel.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')];
 function setPanelInteractive(panel,interactive){
  for(const control of controlsIn(panel)){
   if(interactive){
    const prior=controlState.get(control);
    if(!prior)continue;
    if('disabled'in control)control.disabled=prior.disabled;
    if(prior.hadTabindex)control.setAttribute('tabindex',prior.tabindex);else control.removeAttribute('tabindex');
    controlState.delete(control);
   }else{
    if(!controlState.has(control))controlState.set(control,{disabled:'disabled'in control?control.disabled:false,hadTabindex:control.hasAttribute('tabindex'),tabindex:control.getAttribute('tabindex')});
    if('disabled'in control)control.disabled=true;
    control.setAttribute('tabindex','-1');
   }
  }
 }

 function profileTitle(shell){return shell.querySelector('.profile-title h2,.phase17-player-profile-title h2,.phase24k-wayfarer-profile-title h2')?.textContent?.trim()||'Profile'}
 function headingText(node){return node.querySelector?.('h3')?.textContent?.trim().toLowerCase()||''}
 function containsSelector(node,selector){return node.matches?.(selector)||Boolean(node.querySelector?.(selector))}

 function destinationFor(kind,node){
  const heading=headingText(node);
  if(kind==='fellow'){
   if(containsSelector(node,'[data-fellow-relic-profile]'))return'relics';
   if(containsSelector(node,'[data-modal-act="ascend-fellow"]'))return'rank';
   if(heading.includes('exp progress'))return'level';
   if(heading.includes('power components'))return'overview';
   if(containsSelector(node,'[data-fellow-might-profile]'))return'bonds';
   return'overview';
  }
  if(kind==='family'){
   if(containsSelector(node,'[data-modal-act="give-family-gift"]'))return'gifts';
   if(containsSelector(node,'[data-modal-act="ascend-family"]'))return'rank';
   if(heading.includes('village role'))return'building';
   if(heading.includes('linked fellow'))return'bonds';
   return'overview';
  }
  if(kind==='companion'){
   if(containsSelector(node,'[data-modal-act="ascend-companion"]'))return'rank';
   if(heading.includes('exp progress'))return'level';
   if(heading.includes('free fellow assignment')||containsSelector(node,'[data-companion-assignment]'))return'assignment';
   if(heading.includes('power components'))return'overview';
   if(heading.includes('mastery'))return'mastery';
   return'overview';
  }
  return'overview';
 }

 function supplementalPanel(kind,id,state,escape,format,api,subjectId){
  if(kind==='fellow'&&id==='overview'&&typeof api.fellowOverviewPanel==='function')return api.fellowOverviewPanel(subjectId);
  if(kind==='fellow'&&id==='relics'&&typeof api.fellowRelicPanel==='function')return api.fellowRelicPanel(subjectId);
  if(kind==='fellow'&&id==='bonds'&&typeof api.fellowBondsPanel==='function')return api.fellowBondsPanel(subjectId);
  if(kind==='family'&&id==='building'&&typeof api.familyBuildingPanel==='function')return api.familyBuildingPanel(subjectId);
  if(kind==='companion'&&id==='overview'&&typeof api.companionOverviewPanel==='function')return api.companionOverviewPanel(subjectId);
  if(kind==='companion'&&id==='assignment'&&typeof api.companionAssignmentPanel==='function')return api.companionAssignmentPanel(subjectId);
  if(kind==='companion'&&id==='mastery'&&typeof api.companionMasteryPanel==='function')return api.companionMasteryPanel();
  if(kind!=='wayfarer')return null;
  if(id==='overview'){
   const objective=typeof api.wayfarerObjective==='function'?api.wayfarerObjective():null;
   return`<section class="card phase24l-summary-card"><div class="eyebrow">Central player character</div><h3>The Wayfarer</h3><p class="soft">Player Rank ${escape(String(state.player.rank))} · ${escape(format(state.player.rankExp))} lifetime Rank EXP. The Wayfarer opens roads and stories, and never enters a collectible roster or Power calculation.</p></section>${objective?`<section class="card phase24l-summary-card" data-phase24l-wayfarer-objective><div class="eyebrow">Current story objective</div><h3>${escape(objective.title)}</h3><p class="soft">${escape(objective.copy)}</p></section>`:''}`;
  }
  if(id==='chronicle')return'<section class="card phase24l-summary-card"><div class="eyebrow">Story record</div><h3>Chronicle</h3><p class="soft">Your authored story history remains in More → Chronicle. This profile keeps the current journey in reach without duplicating or changing any Chronicle record.</p></section>';
  if(id==='settings')return'<section class="card phase24l-summary-card"><div class="eyebrow">Presentation and data</div><h3>Settings</h3><p class="soft">Accessibility, save export, recovery, and diagnostics remain in More. No setting or saved preference is changed from this profile.</p></section>';
  if(id==='unlocks'&&typeof api.wayfarerUnlocksPanel==='function')return api.wayfarerUnlocksPanel();
  return null;
 }

 function addReadOnlyProjection(panel,source,label){
  if(!panel||!source)return;
  const copy=source.cloneNode(true);
  copy.querySelectorAll?.('[id]').forEach(node=>node.removeAttribute('id'));
  copy.querySelectorAll?.('button,input,select,textarea,a[href]').forEach(node=>node.remove());
  copy.dataset.phase24lProjection=label;
  panel.querySelector('[data-phase24l-sheet-content]')?.append(copy);
 }

 function makePanels(document,shell,host,kind,subjectId,nodes,state,escape,format,api){
  const definitions=PROFILE_DEFINITIONS[kind],panels=new Map();
  for(const definition of definitions){
   const panel=document.createElement('section');
   const panelId=`phase24l-${kind}-${definition.id}-panel`;
   const tabId=`phase24l-${kind}-${definition.id}-tab`;
   panel.className='phase24l-profile-panel';
   panel.id=panelId;
   panel.dataset.phase24lPanel=definition.id;
   panel.setAttribute('role','tabpanel');
   panel.setAttribute('aria-labelledby',tabId);
   panel.setAttribute('aria-hidden','true');
   panel.hidden=true;
   panel.innerHTML=`<header class="phase24l-sheet-head"><div><span>${definition.icon}</span><div><small>${escape(profileTitle(shell))}</small><h3>${escape(definition.label)}</h3></div></div><button type="button" class="phase24l-sheet-close" data-phase24l-sheet-close aria-label="Close ${escape(definition.label)} panel">×</button></header><div class="phase24l-sheet-content" data-phase24l-sheet-content></div>`;
   const supplemental=supplementalPanel(kind,definition.id,state,escape,format,api,subjectId);
   if(supplemental)panel.querySelector('[data-phase24l-sheet-content]').insertAdjacentHTML('beforeend',supplemental);
   host.append(panel);
   panels.set(definition.id,panel);
  }
  if(kind==='wayfarer'){
   for(const node of nodes){
    const destination=node.matches?.('.rank-roadmap,[data-player-roadmap]')?'unlocks':node.matches?.('.player-rank')?'rank':'overview';
    if(destination==='unlocks'&&typeof api.wayfarerUnlocksPanel==='function'){
     node.hidden=true;
     node.setAttribute('aria-hidden','true');
     node.dataset.phase24lLegacyRoadmap='preserved';
     panels.get(destination)?.querySelector('[data-phase24l-sheet-content]')?.append(node);
     continue;
    }
    panels.get(destination)?.querySelector('[data-phase24l-sheet-content]')?.append(node);
   }
  }else{
   for(const node of nodes){
    const destination=destinationFor(kind,node),heading=headingText(node);
    const replaced=kind==='fellow'&&(
     (destination==='overview'&&(node.matches?.('.big-power,.metric-row')||heading.includes('power components')))||
     destination==='relics'||destination==='bonds'
    )||kind==='family'&&destination==='building'||kind==='companion'&&(
     (destination==='overview'&&(node.matches?.('.big-power,.metric-row')||heading.includes('power components')))||
     destination==='assignment'||destination==='mastery'
    );
    if(replaced)node.remove();else panels.get(destination)?.querySelector('[data-phase24l-sheet-content]')?.append(node);
   }
  }
  return panels;
 }

 function visibleFocusable(shell){
  return[...shell.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')].filter(node=>!node.disabled&&node.tabIndex>=0&&!node.hidden&&getComputedStyle(node).display!=='none'&&getComputedStyle(node).visibility!=='hidden');
 }

 function syncRailHeight(document){
  const rail=document.querySelector('.topbar'),bottom=rail?.getBoundingClientRect?.().bottom;
  if(Number.isFinite(bottom)&&bottom>0)document.documentElement.style.setProperty('--phase24l-rail-height',`${Math.ceil(bottom)}px`);
 }

 function makeDock(document,shell,kind){
  const dock=document.createElement('nav');
  dock.className='phase24l-profile-dock';
  dock.dataset.phase24lProfileDock=kind;
  dock.setAttribute('role','tablist');
  dock.setAttribute('aria-label',`${profileTitle(shell)} profile sections`);
  dock.innerHTML=PROFILE_DEFINITIONS[kind].map(definition=>`<button type="button" id="phase24l-${kind}-${definition.id}-tab" data-phase24l-profile-tab="${definition.id}" role="tab" aria-controls="phase24l-${kind}-${definition.id}-panel" aria-selected="false" aria-expanded="false"><i aria-hidden="true">${definition.icon}</i><span>${definition.label}</span></button>`).join('');
  return dock;
 }

 function setActive(shell,id,{focusSheet=false,focusTab=false}={}){
  const panels=[...shell.querySelectorAll('[data-phase24l-panel]')],tabs=[...shell.querySelectorAll('[data-phase24l-profile-tab]')],previous=shell.dataset.phase24lActivePanel,valid=id&&panels.some(panel=>panel.dataset.phase24lPanel===id),active=valid?id:null;
  if(active)shell.dataset.phase24lRovingTab=active;
  else if(previous&&previous!=='closed')shell.dataset.phase24lRovingTab=previous;
  const roving=shell.dataset.phase24lRovingTab||tabs[0]?.dataset.phase24lProfileTab||null;
  shell.dataset.phase24lActivePanel=active||'closed';
  shell.dataset.phase24lSheetOpen=String(Boolean(active));
  for(const panel of panels){
   const shown=panel.dataset.phase24lPanel===active;
   panel.hidden=!shown;
   panel.setAttribute('aria-hidden',String(!shown));
   setPanelInteractive(panel,shown);
  }
  for(const tab of tabs){
   const selected=tab.dataset.phase24lProfileTab===active;
   tab.setAttribute('aria-selected',String(selected));
   tab.setAttribute('aria-expanded',String(selected));
   tab.tabIndex=tab.dataset.phase24lProfileTab===roving?0:-1;
  }
  if(focusSheet&&active)shell.querySelector(`[data-phase24l-panel="${active}"] [data-phase24l-sheet-close]`)?.focus({preventScroll:true});
  if(focusTab&&roving)shell.querySelector(`[data-phase24l-profile-tab="${roving}"]`)?.focus({preventScroll:true});
  return Boolean(active);
 }

 function bindShell(shell,api){
  if(!shell?.hasAttribute('data-phase24l-profile'))return;
  const tabs=[...shell.querySelectorAll('[data-phase24l-profile-tab]')];
  for(const [index,tab] of tabs.entries()){
   tab.onclick=()=>{
    const id=tab.dataset.phase24lProfileTab,current=shell.dataset.phase24lActivePanel;
    shell.dataset.phase24lPanelActivations=String(Number(shell.dataset.phase24lPanelActivations||0)+1);
    if(current===id)setActive(shell,null,{focusTab:true});else setActive(shell,id,{focusSheet:true});
   };
   tab.onkeydown=event=>{
    let target=null;
    if(event.key==='ArrowRight')target=tabs[(index+1)%tabs.length];
    else if(event.key==='ArrowLeft')target=tabs[(index-1+tabs.length)%tabs.length];
    else if(event.key==='Home')target=tabs[0];
    else if(event.key==='End')target=tabs.at(-1);
    if(!target)return;
    event.preventDefault();
    shell.dataset.phase24lRovingTab=target.dataset.phase24lProfileTab;
    for(const candidate of tabs)candidate.tabIndex=candidate===target?0:-1;
    target.focus({preventScroll:true});
   };
  }
  shell.querySelectorAll('[data-phase24l-sheet-close]').forEach(button=>button.onclick=()=>setActive(shell,null,{focusTab:true}));
  shell.querySelectorAll(':scope [data-modal-close]').forEach(button=>button.onclick=()=>closeProfile?.());
  shell.querySelectorAll('[data-phase24l-family-building-apply]').forEach(button=>{
   const id=button.dataset.phase24lFamilyBuildingApply,select=shell.querySelector(`[data-phase24l-family-building-select="${id}"]`);
   const update=()=>{
    const noOp=!select||api.state?.()?.family?.[id]?.assignedBuildingId===select.value;
    button.disabled=noOp;
    button.textContent=noOp?'NO ASSIGNMENT CHANGE':'APPLY FREE ASSIGNMENT';
    return !noOp;
   };
   if(select)select.onchange=update;
   button.onclick=()=>{if(update()&&typeof api.assignFamilyToBuilding==='function')api.assignFamilyToBuilding(id,select.value)};
   update();
  });
  shell.querySelectorAll('[data-phase24l-relic-detail]').forEach(button=>button.onclick=()=>{
   const id=button.dataset.phase24lRelicDetail;
   if(id&&typeof api.openRelic==='function')api.openRelic(id);
  });
  shell.onkeydown=event=>{
   if(event.key!=='Tab')return;
   const focusable=visibleFocusable(shell);
   if(!focusable.length){event.preventDefault();event.stopPropagation();shell.focus?.();return}
   const first=focusable[0],last=focusable.at(-1),active=shell.ownerDocument.activeElement;
   if(event.shiftKey&&(active===first||!shell.contains(active))){event.preventDefault();event.stopPropagation();last.focus()}
   else if(!event.shiftKey&&(active===last||!shell.contains(active))){event.preventDefault();event.stopPropagation();first.focus()}
  };
 }

 function decorateRosterProfile(document,kind,id,state,escape,format,api){
  const shell=document.querySelector('#overlay .profile[data-roster-profile]');
  if(!shell||shell.hasAttribute('data-phase24l-profile'))return shell;
  const body=shell.querySelector('.profile-body');
  if(!body)return null;
  shell.querySelector('.phase-11g-details-cue')?.remove();
  shell.dataset.phase24lProfile=kind;
  shell.dataset.phase24lSubjectId=id;
  shell.dataset.phase24lActivePanel='closed';
  shell.dataset.phase24lSheetOpen='false';
  shell.dataset.phase24lPanelActivations='0';
  shell.setAttribute(`data-${kind}`,id);
  body.classList.add('phase24l-profile-sheets');
  body.dataset.phase24lSheetHost=kind;
  const nodes=[...body.children],dock=makeDock(document,shell,kind);
  makePanels(document,shell,body,kind,id,nodes,state,escape,format,api);
  shell.insertBefore(dock,body);
  setActive(shell,null);
  document.documentElement.classList.add('phase24l-profile-open');
  syncRailHeight(document);
  return shell;
 }

 function decorateWayfarer(document,state,escape,format,api){
  const modal=document.querySelector('#overlay .modal[data-phase17-player-profile],#overlay .modal[data-phase24k-wayfarer-profile]');
  if(!modal||modal.hasAttribute('data-phase24l-profile'))return modal;
  const art=modal.querySelector('[data-phase17-player-profile-art],[data-phase24k-wayfarer-profile-art]');
  if(!art)return null;
  const nodes=[...modal.children].filter(node=>node!==art&&!node.matches('.modal-head'));
  const host=document.createElement('div'),dock=makeDock(document,modal,'wayfarer');
  modal.dataset.phase24lProfile='wayfarer';
  modal.dataset.phase24lSubjectId='player.wayfarer';
  modal.dataset.phase24lActivePanel='closed';
  modal.dataset.phase24lSheetOpen='false';
  modal.dataset.phase24lPanelActivations='0';
  modal.setAttribute('data-wayfarer','player.wayfarer');
  host.className='phase24l-profile-sheets';
  host.dataset.phase24lSheetHost='wayfarer';
  makePanels(document,modal,host,'wayfarer','player.wayfarer',nodes,state,escape,format,api);
  modal.append(dock,host);
  setActive(modal,null);
  document.documentElement.classList.add('phase24l-profile-open');
  syncRailHeight(document);
  return modal;
 }

 function candidate(document){return document.querySelector('#overlay .profile[data-roster-profile],#overlay .modal[data-phase17-player-profile],#overlay .modal[data-phase24k-wayfarer-profile]')}
 function currentShell(document){return document.querySelector('#overlay [data-phase24l-profile]')}

 function install(adapter){
  if(installed)return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:true});
  if(!adapter||adapter.version!==1||!adapter.document||!adapter.slots||!adapter.api)return Object.freeze({ok:false,reason:'adapter'});
  const {document,slots,api}=adapter;
  const required=['openFellow','openFamily','openCompanion','openPlayerProfile','bindModal','closeModal'];
  if(required.some(name=>typeof slots[name]?.get!=='function'||typeof slots[name]?.set!=='function'))return Object.freeze({ok:false,reason:'slots'});
  if(typeof api.state!=='function'||typeof api.escape!=='function'||typeof api.format!=='function')return Object.freeze({ok:false,reason:'api'});

  const closeBefore=slots.closeModal.get();
  closeProfile=()=>{document.documentElement.classList.remove('phase24l-profile-open');return closeBefore()};
  slots.closeModal.set(function(){
   const shell=currentShell(document),active=shell?.dataset.phase24lActivePanel;
   if(shell&&active&&active!=='closed')return setActive(shell,null,{focusTab:true});
   document.documentElement.classList.remove('phase24l-profile-open');
   return closeBefore();
  });

  const bindBefore=slots.bindModal.get();
  slots.bindModal.set(function(){
   const result=bindBefore();
   const shell=currentShell(document);
   if(shell)bindShell(shell,api);else if(!candidate(document))document.documentElement.classList.remove('phase24l-profile-open');
   return result;
  });

  const wrapRoster=(name,kind)=>{
   const before=slots[name].get();
   slots[name].set(function(id){
    const result=before(id),shell=decorateRosterProfile(document,kind,id,api.state(),api.escape,api.format,api);
    if(shell)slots.bindModal.get()();
    return result;
   });
  };
  wrapRoster('openFellow','fellow');
  wrapRoster('openFamily','family');
  wrapRoster('openCompanion','companion');

  const playerBefore=slots.openPlayerProfile.get();
  slots.openPlayerProfile.set(function(){
   const result=playerBefore(),shell=decorateWayfarer(document,api.state(),api.escape,api.format,api);
   if(shell)slots.bindModal.get()();
   return result;
  });

  document.defaultView?.addEventListener('resize',()=>{if(currentShell(document))syncRailHeight(document)},{passive:true});

  installed=true;
  return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:false,mechanicsChanged:false,saveChanged:false});
 }

 Object.defineProperty(globalThis,'EVERSTEAD_PHASE24L_PROFILE_SHELL',{configurable:false,enumerable:false,writable:false,value:Object.freeze({version:VERSION,id:ID,schemaVersion:SCHEMA_VERSION,install})});
})();
