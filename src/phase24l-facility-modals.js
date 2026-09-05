/* Everstead Phase 24L-B3C: bounded Building and Restaurant game sheets. */
(()=>{
 'use strict';
 const VERSION=1;
 const ID='everstead.phase24l.facility-modals.v1';
 const SCHEMA_VERSION=15;
 const BUILDING_TABS=Object.freeze([
  Object.freeze({id:'assign',label:'Assign',icon:'♡'}),
  Object.freeze({id:'production',label:'Production',icon:'✦'}),
  Object.freeze({id:'upgrade',label:'Upgrade',icon:'↑'})
 ]);
 const RESTAURANT_TABS=Object.freeze([
  Object.freeze({id:'guest',label:'Guest',icon:'♙'}),
  Object.freeze({id:'kitchen',label:'Kitchen',icon:'♨'}),
  Object.freeze({id:'pantry',label:'Pantry',icon:'◇'}),
  Object.freeze({id:'result',label:'Result',icon:'✦'})
 ]);
 const BUILDING_CONTEXT=new WeakMap();
 const RESTAURANT_CONTEXT=new WeakMap();
 const buildingTabs=Object.create(null);
 let restaurantTab='guest';
 let restaurantLifecycle=null;
 let installed=false;
 let buildingDecorations=0;
 let restaurantDecorations=0;
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

 function tabButton(document,prefix,tab,selected,index,total){
  const button=element(document,'button','',{type:'button',role:'tab',id:`${prefix}-tab-${tab.id}`,'data-phase24l-b3c-tab':tab.id,'aria-selected':String(selected),'aria-controls':`${prefix}-panel-${tab.id}`,tabindex:selected?'0':'-1'});
  button.innerHTML=`<i aria-hidden="true">${tab.icon}</i><span>${tab.label}</span>`;
  button.dataset.phase24lB3cTabIndex=String(index);
  button.dataset.phase24lB3cTabCount=String(total);
  return button;
 }

 function syncPanels(root,next,definition,context,{focusPanel=false}={}){
  if(!definition.some(tab=>tab.id===next))next=definition[0].id;
  for(const button of root.querySelectorAll(':scope > [data-phase24l-b3c-tabs] [data-phase24l-b3c-tab]')){
   const active=button.dataset.phase24lB3cTab===next;
   button.setAttribute('aria-selected',String(active));
   button.tabIndex=active?0:-1;
  }
  for(const [id,panel] of Object.entries(context.panels)){
   const active=id===next;
   panel.hidden=!active;
   panel.inert=!active;
   panel.setAttribute('aria-hidden',String(!active));
  }
  if(focusPanel)context.panels[next]?.focus({preventScroll:true});
  return next;
 }

 function bindTabs(root,definition,select){
  const buttons=[...root.querySelectorAll(':scope > [data-phase24l-b3c-tabs] [data-phase24l-b3c-tab]')];
  buttons.forEach((button,index)=>{
   button.onclick=()=>select(button.dataset.phase24lB3cTab,{focusPanel:true});
   button.onkeydown=event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const nextIndex=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
    select(definition[nextIndex].id);
    buttons[nextIndex].focus();
   };
  });
 }

 function decorateBuilding(document,modal){
  if(!modal||modal.dataset.phase24lB3cModal)return false;
  const assignmentSelect=modal.querySelector('[data-family-assignment]');
  const production=modal.querySelector(':scope > [data-building-production-details]');
  const upgrade=modal.querySelector(':scope > [data-building-upgrade-preview]');
  const upgradeButton=modal.querySelector(':scope > [data-modal-act="upgrade-building"]');
  if(!assignmentSelect||!production||!upgrade||!upgradeButton)return false;
  const buildingId=assignmentSelect.dataset.familyAssignment;
  const assignment=assignmentSelect.closest('section.card');
  const head=modal.querySelector(':scope > .modal-head');
  if(!buildingId||!assignment||!head)return false;

  modal.dataset.phase24lB3cModal='building';
  modal.dataset.phase24lB3cBuildingId=buildingId;
  const shell=element(document,'div','phase24l-b3c-sheet phase24l-b3c-building',{'data-phase24l-b3c-building':'','data-phase24l-b3c-building-id':buildingId,'data-phase24l-b3c-mechanics-changed':'false'});
  const scene=element(document,'section','phase24l-b3c-scene phase24l-b3c-building-scene',{'aria-label':'Village building view'});
  const buildingName=head.querySelector('h2')?.textContent?.trim()||'Village Building';
  scene.innerHTML=`<div><div class="eyebrow">Village operation</div><h3>${buildingName}</h3><p>Family stewardship and steady work keep Everstead growing.</p></div><span aria-hidden="true">⌂</span>`;
  const panelStack=element(document,'div','phase24l-b3c-panel-stack',{'data-phase24l-b3c-panel-stack':''});
  const panels={};
  for(const tab of BUILDING_TABS){
   const panel=element(document,'section','phase24l-b3c-panel',{'data-phase24l-b3c-panel':tab.id,id:`phase24l-b3c-building-panel-${tab.id}`,role:'tabpanel',tabindex:'-1','aria-labelledby':`phase24l-b3c-building-tab-${tab.id}`});
   panels[tab.id]=panel;
   panelStack.append(panel);
  }
  panels.assign.append(assignment);
  panels.production.append(production);
  const actionDock=element(document,'div','phase24l-b3c-action-dock',{'data-phase24l-b3c-action-dock':'building'});
  actionDock.append(upgradeButton);
  panels.upgrade.append(upgrade,actionDock);

  let selected=buildingTabs[buildingId]||'production';
  const tabs=element(document,'nav','phase24l-b3c-tabs',{'data-phase24l-b3c-tabs':'building',role:'tablist','aria-label':`${buildingName} sections`});
  for(const [index,tab] of BUILDING_TABS.entries())tabs.append(tabButton(document,'phase24l-b3c-building',tab,tab.id===selected,index,BUILDING_TABS.length));
  shell.append(scene,panelStack,tabs);
  head.insertAdjacentElement('afterend',shell);
  const context={panels};
  BUILDING_CONTEXT.set(shell,context);
  const select=(next,options={})=>{
   selected=syncPanels(shell,next,BUILDING_TABS,context,options);
   buildingTabs[buildingId]=selected;
   tabChanges++;
  };
  bindTabs(shell,BUILDING_TABS,select);
  selected=syncPanels(shell,selected,BUILDING_TABS,context);
  buildingTabs[buildingId]=selected;
  buildingDecorations++;
  return true;
 }

 function recommendedRestaurantTab(lifecycle){
  if(lifecycle==='claim-ready')return'result';
  if(['engaged','preparing','awaiting-stock-transfer','ready-to-serve'].includes(lifecycle))return'kitchen';
  return'guest';
 }

 function decorateRestaurant(document,modal){
  if(!modal||modal.dataset.phase24lB3cModal)return false;
  const root=modal.querySelector(':scope > [data-phase16-restaurant-sheet]');
  if(!root||root.dataset.phase24lB3cRestaurant)return false;
  const hero=root.querySelector(':scope > .phase16-restaurant-hero');
  const progress=root.querySelector(':scope > .phase16-progress');
  const customer=root.querySelector(':scope > .phase16-customer');
  const stock=root.querySelector(':scope > .phase16-stock');
  const service=root.querySelector(':scope > .phase16-service-grid');
  const result=root.querySelector(':scope > .phase16-result');
  const collection=root.querySelector(':scope > [data-phase24c2d-restaurant-collection]');
  const actions=root.querySelector(':scope > .phase16-actions');
  if(!hero||!progress||!customer||!stock||!service||!actions)return false;

  const lifecycle=root.dataset.phase22cLifecycleState||'empty';
  if(restaurantLifecycle!==lifecycle)restaurantTab=recommendedRestaurantTab(lifecycle);
  restaurantLifecycle=lifecycle;
  modal.dataset.phase24lB3cModal='restaurant';
  root.dataset.phase24lB3cRestaurant='';
  root.dataset.phase24lB3cMechanicsChanged='false';
  hero.classList.add('phase24l-b3c-restaurant-scene');

  const panelStack=element(document,'div','phase24l-b3c-panel-stack phase24l-b3c-restaurant-panels',{'data-phase24l-b3c-panel-stack':''});
  const panels={};
  for(const tab of RESTAURANT_TABS){
   const panel=element(document,'section','phase24l-b3c-panel',{'data-phase24l-b3c-panel':tab.id,id:`phase24l-b3c-restaurant-panel-${tab.id}`,role:'tabpanel',tabindex:'-1','aria-labelledby':`phase24l-b3c-restaurant-tab-${tab.id}`});
   panels[tab.id]=panel;
   panelStack.append(panel);
  }
  panels.guest.append(progress,customer);
  panels.kitchen.append(service);
  panels.pantry.append(stock);
  if(result)panels.result.append(result);
  if(collection)panels.result.append(collection);
  if(!result&&!collection){
   const empty=element(document,'div','phase24l-b3c-empty');
   empty.innerHTML='<b>Nothing to claim yet</b><p>Welcome a guest, prepare a dish, and serve it. Finished rewards bank until you claim them.</p>';
   panels.result.append(empty);
  }

  const tabs=element(document,'nav','phase24l-b3c-tabs',{'data-phase24l-b3c-tabs':'restaurant',role:'tablist','aria-label':'Restaurant sections'});
  for(const [index,tab] of RESTAURANT_TABS.entries())tabs.append(tabButton(document,'phase24l-b3c-restaurant',tab,tab.id===restaurantTab,index,RESTAURANT_TABS.length));
  root.append(panelStack,actions,tabs);
  const context={panels};
  RESTAURANT_CONTEXT.set(root,context);
  const select=(next,options={})=>{
   restaurantTab=syncPanels(root,next,RESTAURANT_TABS,context,options);
   tabChanges++;
  };
  bindTabs(root,RESTAURANT_TABS,select);
  restaurantTab=syncPanels(root,restaurantTab,RESTAURANT_TABS,context);
  restaurantDecorations++;
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
   decorateBuilding(document,modal);
   decorateRestaurant(document,modal);
   return value;
  });
  installed=true;
  return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:false,mechanicsChanged:false,saveChanged:false});
 }

 function diagnostics(){
  return Object.freeze({version:VERSION,id:ID,installed,buildingTabs:{...buildingTabs},restaurantTab,restaurantLifecycle,buildingDecorations,restaurantDecorations,tabChanges,mechanicsChanged:false,saveChanged:false});
 }

 Object.defineProperty(globalThis,'EVERSTEAD_PHASE24L_FACILITY_MODALS',{configurable:false,enumerable:false,writable:false,value:Object.freeze({version:VERSION,id:ID,schemaVersion:SCHEMA_VERSION,install,diagnostics})});
})();
