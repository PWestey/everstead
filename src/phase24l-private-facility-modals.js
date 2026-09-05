/* Everstead Phase 24L-B3D: bounded Apothecary and Schoolhouse game sheets. */
(()=>{
 'use strict';
 const VERSION=1;
 const ID='everstead.phase24l.private-facility-modals.v1';
 const SCHEMA_VERSION=15;
 const DEFINITIONS=Object.freeze({
  apothecary:Object.freeze([
   Object.freeze({id:'case',label:'Case',icon:'♙'}),
   Object.freeze({id:'diagnose',label:'Diagnose',icon:'◈'}),
   Object.freeze({id:'remedy',label:'Remedy',icon:'⚗'}),
   Object.freeze({id:'result',label:'Result',icon:'✦'})
  ]),
  schoolhouse:Object.freeze([
   Object.freeze({id:'pupils',label:'Pupils',icon:'♙'}),
   Object.freeze({id:'lesson',label:'Lesson',icon:'◇'}),
   Object.freeze({id:'teach',label:'Teach',icon:'♡'}),
   Object.freeze({id:'result',label:'Result',icon:'✦'})
  ])
 });
 const state={
  apothecary:{tab:'case',stage:null},
  schoolhouse:{tab:'pupils',stage:null}
 };
 let installed=false;
 let apothecaryDecorations=0;
 let schoolhouseDecorations=0;
 let tabChanges=0;

 function element(document,tag,className='',attributes={}){
  const node=document.createElement(tag);
  if(className)node.className=className;
  for(const [name,value] of Object.entries(attributes)){
   if(name==='text')node.textContent=value;
   else node.setAttribute(name,String(value));
  }
  return node;
 }

 function appendIf(parent,...nodes){
  for(const node of nodes)if(node)parent.append(node);
 }

 function tabButton(document,kind,tab,selected){
  const button=element(document,'button','',{type:'button',role:'tab',id:`phase24l-b3d-${kind}-tab-${tab.id}`,'data-phase24l-b3d-tab':tab.id,'aria-selected':String(selected),'aria-controls':`phase24l-b3d-${kind}-panel-${tab.id}`,tabindex:selected?'0':'-1'});
  button.innerHTML=`<i aria-hidden="true">${tab.icon}</i><span>${tab.label}</span>`;
  return button;
 }

 function emptyPanel(document,title,body){
  const empty=element(document,'div','phase24l-b3d-empty');
  const heading=element(document,'b','',{text:title});
  const copy=element(document,'p','',{text:body});
  empty.append(heading,copy);
  return empty;
 }

 function panelSet(document,kind,definition){
  const stack=element(document,'div','phase24l-b3d-panel-stack',{'data-phase24l-b3d-panel-stack':kind});
  const panels={};
  for(const tab of definition){
   const panel=element(document,'section','phase24l-b3d-panel',{'data-phase24l-b3d-panel':tab.id,id:`phase24l-b3d-${kind}-panel-${tab.id}`,role:'tabpanel',tabindex:'-1','aria-labelledby':`phase24l-b3d-${kind}-tab-${tab.id}`});
   panels[tab.id]=panel;
   stack.append(panel);
  }
  return{stack,panels};
 }

 function sync(root,kind,panels,next,{focusPanel=false}={}){
  const definition=DEFINITIONS[kind];
  if(!definition.some(tab=>tab.id===next))next=definition[0].id;
  for(const button of root.querySelectorAll(':scope > [data-phase24l-b3d-tabs] [data-phase24l-b3d-tab]')){
   const active=button.dataset.phase24lB3dTab===next;
   button.setAttribute('aria-selected',String(active));
   button.tabIndex=active?0:-1;
  }
  for(const [id,panel] of Object.entries(panels)){
   const active=id===next;
   panel.hidden=!active;
   panel.inert=!active;
   panel.setAttribute('aria-hidden',String(!active));
  }
  if(focusPanel)panels[next]?.focus({preventScroll:true});
  state[kind].tab=next;
  return next;
 }

 function bindTabs(root,kind,panels){
  const definition=DEFINITIONS[kind];
  const buttons=[...root.querySelectorAll(':scope > [data-phase24l-b3d-tabs] [data-phase24l-b3d-tab]')];
  const select=(next,options={})=>{sync(root,kind,panels,next,options);tabChanges++};
  buttons.forEach((button,index)=>{
   button.onclick=()=>select(button.dataset.phase24lB3dTab);
   button.onkeydown=event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const nextIndex=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
    select(definition[nextIndex].id);
    buttons[nextIndex].focus();
   };
  });
 }

 function addTabs(document,root,kind,panels,label){
  const definition=DEFINITIONS[kind];
  const tabs=element(document,'nav','phase24l-b3d-tabs',{'data-phase24l-b3d-tabs':kind,role:'tablist','aria-label':label});
  for(const tab of definition)tabs.append(tabButton(document,kind,tab,tab.id===state[kind].tab));
  root.append(tabs);
  bindTabs(root,kind,panels);
  sync(root,kind,panels,state[kind].tab);
 }

 function apothecaryStage(root){
  if(root.querySelector(':scope > [data-phase22c-claim-summary="ready"]'))return{tab:'result',key:'result'};
  const lifecycle=root.dataset.phase22cLifecycleState||'empty';
  const diagnosis=root.querySelector(':scope > [data-phase22c-choice-group="diagnosis"] [aria-pressed="true"]')?.dataset.phase18DiagnosisId||'none';
  const remedy=root.querySelector(':scope > [data-phase22c-choice-group="remedy"] [aria-pressed="true"]')?.dataset.phase18RemedyId||'none';
  if(root.querySelector(':scope > [data-phase18-recheck].phase-1819-ready'))return{tab:'remedy',key:`recheck:${diagnosis}:${remedy}`};
  if(lifecycle==='engaged')return diagnosis!=='none'?{tab:'remedy',key:`engaged:${diagnosis}:${remedy}`}:{tab:'diagnose',key:'engaged:none:none'};
  return{tab:'case',key:`case:${lifecycle}`};
 }

 function schoolhouseStage(root){
  if(root.querySelector(':scope > [data-phase22c-claim-summary="ready"]'))return'result';
  if(root.dataset.phase22cLifecycleState==='engaged')return'teach';
  return root.querySelector(':scope > [data-phase22c-activity-summary] [data-phase19-lesson-id]:not([disabled])')?'lesson':'pupils';
 }

 function updateStage(kind,next){
  const target=typeof next==='string'?{tab:next,key:next}:next;
  if(state[kind].stage!==target.key){
   state[kind].stage=target.key;
   state[kind].tab=target.tab;
  }
 }

 function bindBackdropToCanonicalClose(modal,selector){
  const overlay=modal?.closest('[data-overlay]'),close=modal?.querySelector(selector);
  if(!overlay||!close)return false;
  const inherited=overlay.onclick;
  overlay.onclick=event=>{
   if(event.target===overlay){close.click();return}
   return inherited?.call(overlay,event);
  };
  return true;
 }

 function decorateApothecary(document,modal){
  const root=modal?.querySelector(':scope > [data-phase18-apothecary-sheet]');
  if(!root||root.dataset.phase24lB3dFacility)return false;
  const masthead=root.querySelector(':scope > .es-feature-masthead');
  const summary=root.querySelector(':scope > [data-phase22c-local-summary]');
  const activity=root.querySelector(':scope > [data-phase22c-activity-summary]');
  const evidence=root.querySelector(':scope > [data-phase22c-evidence-group]');
  const diagnosis=root.querySelector(':scope > [data-phase22c-choice-group="diagnosis"]');
  const remedy=root.querySelector(':scope > [data-phase22c-choice-group="remedy"]');
  const guidance=root.querySelector(':scope > [data-phase18-recheck]');
  const actions=root.querySelector(':scope > .phase-1819-actions');
  if(!masthead||!summary||!activity||!evidence||!diagnosis||!remedy||!actions)return false;

  updateStage('apothecary',apothecaryStage(root));
  modal.dataset.phase24lB3dModal='apothecary';
  root.dataset.phase24lB3dFacility='apothecary';
  root.dataset.phase24lB3dMechanicsChanged='false';
  masthead.classList.add('phase24l-b3d-scene');
  const {stack,panels}=panelSet(document,'apothecary',DEFINITIONS.apothecary);
  appendIf(panels.case,root.querySelector(':scope > [data-phase18-19-tutorial-id]'),root.querySelector(':scope > p.soft'),activity,evidence);
  appendIf(panels.diagnose,diagnosis);
  appendIf(panels.remedy,remedy,guidance);
  const rewards=[...root.querySelectorAll(':scope > [data-phase22c-claim-summary="ready"]')];
  appendIf(panels.result,...rewards);
  if(!rewards.length)panels.result.append(emptyPanel(document,'No result waiting','Complete a case, then claim its banked reward here.'));
  root.append(stack,actions);
  addTabs(document,root,'apothecary',panels,'Apothecary sections');
  bindBackdropToCanonicalClose(modal,'[data-phase18-close]');
  apothecaryDecorations++;
  return true;
 }

 function decorateSchoolhouse(document,modal){
  const root=modal?.querySelector(':scope > [data-phase19-schoolhouse-sheet]');
  if(!root||root.dataset.phase24lB3dFacility)return false;
  const masthead=root.querySelector(':scope > .es-feature-masthead');
  const summary=root.querySelector(':scope > [data-phase22c-local-summary]');
  const pupils=root.querySelector(':scope > [data-phase22c-pupil-summary]');
  const activity=root.querySelector(':scope > [data-phase22c-activity-summary]');
  const approach=root.querySelector(':scope > [data-phase22c-choice-group="teaching-approach"]');
  const mentor=root.querySelector(':scope > [data-phase22c-choice-group="family-mentor"]');
  const actions=root.querySelector(':scope > .phase-1819-actions');
  if(!masthead||!summary||!pupils||!activity||!approach||!mentor||!actions)return false;

  updateStage('schoolhouse',schoolhouseStage(root));
  modal.dataset.phase24lB3dModal='schoolhouse';
  root.dataset.phase24lB3dFacility='schoolhouse';
  root.dataset.phase24lB3dMechanicsChanged='false';
  masthead.classList.add('phase24l-b3d-scene');
  const {stack,panels}=panelSet(document,'schoolhouse',DEFINITIONS.schoolhouse);
  appendIf(panels.pupils,root.querySelector(':scope > [data-phase18-19-tutorial-id]'),root.querySelector(':scope > p.soft'),pupils);
  appendIf(panels.lesson,activity);
  appendIf(panels.teach,approach,mentor);
  const rewards=[...root.querySelectorAll(':scope > [data-phase22c-claim-summary="ready"]')];
  appendIf(panels.result,...rewards);
  if(!rewards.length)panels.result.append(emptyPanel(document,'No result waiting','Teach a lesson or prepare a graduation, then claim its reward here.'));
  root.append(stack,actions);
  addTabs(document,root,'schoolhouse',panels,'Schoolhouse sections');
  bindBackdropToCanonicalClose(modal,'[data-phase19-close]');
  schoolhouseDecorations++;
  return true;
 }

 function install(adapter){
  if(installed)return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:true,mechanicsChanged:false,saveChanged:false});
  if(!adapter||adapter.version!==1||!adapter.document||!adapter.slots)return Object.freeze({ok:false,reason:'adapter'});
  const {document,slots}=adapter;
  if(typeof slots.bindModal?.get!=='function'||typeof slots.bindModal?.set!=='function')return Object.freeze({ok:false,reason:'slots.bindModal'});
  const bindModalBefore=slots.bindModal.get();
  slots.bindModal.set(function(...args){
   const value=bindModalBefore(...args);
   const modal=document.querySelector('[data-overlay] .modal');
   decorateApothecary(document,modal);
   decorateSchoolhouse(document,modal);
   return value;
  });
  installed=true;
  return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:false,mechanicsChanged:false,saveChanged:false});
 }

 function diagnostics(){
  return Object.freeze({version:VERSION,id:ID,installed,state:{apothecary:{...state.apothecary},schoolhouse:{...state.schoolhouse}},apothecaryDecorations,schoolhouseDecorations,tabChanges,mechanicsChanged:false,saveChanged:false});
 }

 Object.defineProperty(globalThis,'EVERSTEAD_PHASE24L_PRIVATE_FACILITY_MODALS',{configurable:false,enumerable:false,writable:false,value:Object.freeze({version:VERSION,id:ID,schemaVersion:SCHEMA_VERSION,install,diagnostics})});
})();
