/* Everstead Phase 24L-B3E: bounded Phase 20/21 successor facility game sheets. */
(()=>{
 'use strict';

 const VERSION=1;
 const ID='everstead.phase24l.successor-facility-modals.v1';
 const SCHEMA_VERSION=15;
 const FACILITIES=Object.freeze({
  'facility.command-center':Object.freeze({
   key:'command-center',icon:'⚖',brief:'petition',work:'decision',status:'queue',result:'record',
   tabs:Object.freeze([
    Object.freeze({id:'petition',label:'Petition',icon:'▤'}),
    Object.freeze({id:'decision',label:'Decision',icon:'⚖'}),
    Object.freeze({id:'queue',label:'Queue',icon:'☷'}),
    Object.freeze({id:'record',label:'Record',icon:'✦'})
   ])
  }),
  'facility.archives':Object.freeze({
   key:'archives',icon:'⌘',brief:'lead',work:'evidence',status:'queue',result:'record',
   tabs:Object.freeze([
    Object.freeze({id:'lead',label:'Lead',icon:'⌕'}),
    Object.freeze({id:'evidence',label:'Evidence',icon:'◇'}),
    Object.freeze({id:'queue',label:'Queue',icon:'☷'}),
    Object.freeze({id:'record',label:'Record',icon:'✦'})
   ])
  }),
  'facility.training-grounds':Object.freeze({
   key:'training-grounds',icon:'⚔',brief:'drill',work:'formation',party:'team',status:'drill',result:'result',
   tabs:Object.freeze([
    Object.freeze({id:'drill',label:'Drill',icon:'⚔'}),
    Object.freeze({id:'formation',label:'Formation',icon:'◇'}),
    Object.freeze({id:'team',label:'Team',icon:'♟'}),
    Object.freeze({id:'result',label:'Result',icon:'✦'})
   ])
  }),
  'facility.hearth':Object.freeze({
   key:'hearth',icon:'♨',brief:'gathering',work:'theme',party:'guests',status:'gathering',result:'result',
   tabs:Object.freeze([
    Object.freeze({id:'gathering',label:'Gathering',icon:'♨'}),
    Object.freeze({id:'theme',label:'Theme',icon:'◇'}),
    Object.freeze({id:'guests',label:'Guests',icon:'♟'}),
    Object.freeze({id:'result',label:'Result',icon:'✦'})
   ])
  }),
  'facility.gatehouse':Object.freeze({
   key:'gatehouse',icon:'⌂',brief:'arrival',work:'reception',status:'queue',result:'result',
   tabs:Object.freeze([
    Object.freeze({id:'arrival',label:'Arrival',icon:'⌂'}),
    Object.freeze({id:'reception',label:'Reception',icon:'◇'}),
    Object.freeze({id:'queue',label:'Queue',icon:'☷'}),
    Object.freeze({id:'result',label:'Result',icon:'✦'})
   ])
  }),
  'facility.market-workshop':Object.freeze({
   key:'market-workshop',icon:'⚒',brief:'order',work:'fulfillment',requirement:'materials',status:'materials',result:'result',
   tabs:Object.freeze([
    Object.freeze({id:'order',label:'Order',icon:'▤'}),
    Object.freeze({id:'fulfillment',label:'Fulfillment',icon:'⚒'}),
    Object.freeze({id:'materials',label:'Materials',icon:'☷'}),
    Object.freeze({id:'result',label:'Result',icon:'✦'})
   ])
  }),
  'facility.gardens':Object.freeze({
   key:'gardens',icon:'❧',brief:'plot',work:'cultivate',growth:'growth',status:'growth',result:'harvest',
   tabs:Object.freeze([
    Object.freeze({id:'plot',label:'Plot',icon:'❧'}),
    Object.freeze({id:'cultivate',label:'Cultivate',icon:'♧'}),
    Object.freeze({id:'growth',label:'Growth',icon:'☷'}),
    Object.freeze({id:'harvest',label:'Harvest',icon:'✦'})
   ])
  }),
  'facility.forge':Object.freeze({
   key:'forge',icon:'♜',brief:'commission',work:'method',requirement:'materials',status:'materials',result:'result',
   tabs:Object.freeze([
    Object.freeze({id:'commission',label:'Commission',icon:'▤'}),
    Object.freeze({id:'method',label:'Method',icon:'⚒'}),
    Object.freeze({id:'materials',label:'Materials',icon:'☷'}),
    Object.freeze({id:'result',label:'Result',icon:'✦'})
   ])
  })
 });
 const session=new Map;
 let installed=false;
 let decorations=0;
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

 function emptyPanel(document,title,body){
  const empty=element(document,'div','phase24l-b3e-empty');
  empty.append(element(document,'b','',{text:title}),element(document,'p','',{text:body}));
  return empty;
 }

 function stateFor(facilityId,config){
  let value=session.get(facilityId);
  if(!value){
   value={tab:config.brief,stage:null,lastReceiptId:null,recordId:null,initialized:false};
   session.set(facilityId,value);
  }
  return value;
 }

 function panelSet(document,config){
  const stack=element(document,'div','phase24l-b3e-panel-stack',{'data-phase24l-b3e-panel-stack':config.key});
  const panels={};
  for(const tab of config.tabs){
   const panel=element(document,'section','phase24l-b3e-panel',{
    'data-phase24l-b3e-panel':tab.id,
    id:`phase24l-b3e-${config.key}-panel-${tab.id}`,
    role:'tabpanel',
    tabindex:'-1',
    'aria-labelledby':`phase24l-b3e-${config.key}-tab-${tab.id}`
   });
   panels[tab.id]=panel;
   stack.append(panel);
  }
  return{stack,panels};
 }

 function sync(root,config,panels,next){
  if(!config.tabs.some(tab=>tab.id===next))next=config.brief;
  for(const button of root.querySelectorAll(':scope > [data-phase24l-b3e-tabs] [data-phase24l-b3e-tab]')){
   const active=button.dataset.phase24lB3eTab===next;
   button.setAttribute('aria-selected',String(active));
   button.tabIndex=active?0:-1;
  }
  for(const [id,panel] of Object.entries(panels)){
   const active=id===next;
   panel.hidden=!active;
   panel.inert=!active;
   panel.setAttribute('aria-hidden',String(!active));
  }
  return next;
 }

 function tabButton(document,config,tab,selected){
  const button=element(document,'button','',{
   type:'button',role:'tab',id:`phase24l-b3e-${config.key}-tab-${tab.id}`,
   'data-phase24l-b3e-tab':tab.id,'aria-selected':String(selected),
   'aria-controls':`phase24l-b3e-${config.key}-panel-${tab.id}`,
   tabindex:selected?'0':'-1'
  });
  button.append(element(document,'i','',{'aria-hidden':'true',text:tab.icon}),element(document,'span','',{text:tab.label}));
  return button;
 }

 function addTabs(document,root,facilityId,config,panels){
  const state=stateFor(facilityId,config);
  const tabs=element(document,'nav','phase24l-b3e-tabs',{
   'data-phase24l-b3e-tabs':config.key,role:'tablist','aria-orientation':'horizontal',
   'aria-label':`${root.querySelector('[id="everstead-modal-title"]')?.textContent||'Facility'} sections`
  });
  for(const tab of config.tabs)tabs.append(tabButton(document,config,tab,tab.id===state.tab));
  root.append(tabs);
  const buttons=[...tabs.querySelectorAll('[data-phase24l-b3e-tab]')];
  const select=next=>{
   state.tab=sync(root,config,panels,next);
   root.setAttribute('data-phase24l-b3e-active-panel',state.tab);
   tabChanges++;
  };
  buttons.forEach((button,index)=>{
   button.onclick=()=>select(button.dataset.phase24lB3eTab);
   button.onkeydown=event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const nextIndex=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
    select(config.tabs[nextIndex].id);
    buttons[nextIndex].focus({preventScroll:true});
   };
  });
  state.tab=sync(root,config,panels,state.tab);
  root.setAttribute('data-phase24l-b3e-active-panel',state.tab);
 }

 function recommendation(root,facilityId,config,record,receipt,tutorial){
  const state=stateFor(facilityId,config),receiptId=receipt?.getAttribute('data-phase22c-receipt-id')||null;
  const recordId=record?.getAttribute('data-phase20-21-record-id')||null;
  let newReceipt=false,recordChanged=false;
  if(!state.initialized){state.initialized=true;state.lastReceiptId=receiptId;state.recordId=recordId}
  else if(receiptId&&receiptId!==state.lastReceiptId){state.lastReceiptId=receiptId;newReceipt=true}
  else if(!receiptId)state.lastReceiptId=null;
  if(state.recordId!==recordId){recordChanged=true;state.recordId=recordId}

  if(tutorial)return{tab:config.brief,key:`tutorial:${tutorial.getAttribute('data-phase20-21-contextual-tutorial')||'active'}`};
  if(newReceipt)return{tab:config.result,key:`receipt:${receiptId}`};
  if(!record)return{tab:receipt?config.result:config.brief,key:receipt?`receipt-only:${receiptId}`:`empty:${root.getAttribute('data-phase20-21-state')||'available'}`};
  const status=record.getAttribute('data-lifecycle-status')||root.getAttribute('data-phase20-21-lifecycle-status')||'available';
  const choice=record.querySelector('[data-phase20-21-choice-id][aria-pressed="true"]')?.getAttribute('data-phase20-21-choice-id')||'none';
  const participants=record.querySelector('[data-phase20-21-participant-selection]');
  const participantCount=participants?.querySelectorAll('[data-phase20-21-actor-choice][aria-pressed="true"]').length||0;
  const participantsReady=Boolean(participants&&!participants.querySelector('[data-phase20-21-save-participants]:disabled'));
  const action=record.querySelector('[data-phase20-21-action-dock] button')?.getAttributeNames().find(name=>name.startsWith('data-phase20-21-'))||'no-action';
  const inputKey=`choice:${choice}:participants:${participantCount}:${participantsReady?'ready':'draft'}:${action}`;
  if(recordChanged)return{tab:config.brief,key:`record:${recordId}:${status}:selected:${inputKey}`};
  if(status==='claim-ready')return{tab:config.result,key:`record:${recordId}:claim-ready:${inputKey}`};
  if(status==='growing')return{tab:config.growth||config.work,key:`record:${recordId}:growing:${inputKey}`};
  if(status==='committed')return{tab:config.brief,key:`record:${recordId}:committed:${inputKey}`};
  if(status==='engaged')return{tab:config.party&&participantCount>0?config.party:config.work,key:`record:${recordId}:engaged:${inputKey}`};
  return{tab:config.brief,key:`record:${recordId}:${status}:${inputKey}`};
 }

 function updateStage(facilityId,config,next){
  const state=stateFor(facilityId,config);
  if(state.stage!==next.key){state.stage=next.key;state.tab=next.tab}
 }

 function bindBackdropToCanonicalClose(modal){
  const overlay=modal?.closest('[data-overlay]'),close=modal?.querySelector('[data-phase20-21-close]');
  if(!overlay||!close)return false;
  const inherited=overlay.onclick;
  overlay.onclick=event=>{
   if(event.target===overlay){close.click();return}
   return inherited?.call(overlay,event);
  };
  return true;
 }

 function compactQueue(document,queue){
  if(!queue)return;
  const rows=[...queue.querySelectorAll(':scope > [data-phase20-21-view-record]')];
  if(!rows.length)return;
  const rail=element(document,'div','phase24l-b3e-queue-rail',{'data-phase24l-b3e-queue-rail':'true',role:'group','aria-label':'Banked opportunities'});
  rail.append(...rows);
  queue.append(rail);
 }

 function fillEmptyPanels(document,config,panels){
  const labels=Object.fromEntries(config.tabs.map(tab=>[tab.id,tab.label]));
  for(const [id,panel] of Object.entries(panels)){
   if(panel.childElementCount)continue;
   if(id===config.work)panel.append(emptyPanel(document,`${labels[id]} waits for an active opportunity`,'Begin the selected activity, then return here to make its decision.'));
   else if(id===config.party)panel.append(emptyPanel(document,`${labels[id]} waits for a formation`,'Choose the activity approach first, then select the required participants here.'));
   else if(id===config.status)panel.append(emptyPanel(document,'The queue is clear','New opportunities bank here and never expire.'));
   else if(id===config.result)panel.append(emptyPanel(document,'No result waiting','Complete the activity, then make its manual reward claim here.'));
   else panel.append(emptyPanel(document,'Nothing waiting','This Village location will hold its next opportunity here.'));
  }
 }

 function decorate(document,modal){
  const root=modal?.querySelector(':scope > [data-phase20-21-sheet]');
  if(!root||root.dataset.phase24lB3eFacility)return false;
  const facilityId=root.getAttribute('data-facility-id'),config=FACILITIES[facilityId];
  if(!config)return false;

  const masthead=root.querySelector(':scope > .es-feature-masthead');
  const summary=root.querySelector(':scope > [data-phase22c-local-summary]');
  const tutorial=root.querySelector(':scope > [data-phase20-21-contextual-tutorial]');
  const record=root.querySelector(':scope > [data-phase20-21-record-id]');
  const empty=root.querySelector(':scope > [data-phase20-21-empty]');
  const queue=root.querySelector(':scope > .phase20-21-queue');
  const receipt=root.querySelector(':scope > [data-phase20-21-receipt-summary]');
  const footer=root.querySelector(':scope > .phase20-21-sheet-footer');
  const policy=root.querySelector(':scope > .phase20-21-policy-note');
  if(!masthead||!summary||!footer||!policy||(!record&&!empty))return false;

  let requirement=null,choice=null,participants=null,reward=null,growth=null,actionDock=null;
  if(record){
   const header=record.querySelector(':scope > header'),body=record.querySelector(':scope > p'),presenter=record.querySelector(':scope > .es-actor-strip.compact');
   actionDock=record.querySelector(':scope > [data-phase20-21-action-dock]');
   if(!header||!body||!presenter||!actionDock)return false;
   requirement=record.querySelector(':scope > [data-phase20-21-requirement]');
   choice=record.querySelector(':scope > [data-phase20-21-choice-step]');
   participants=record.querySelector(':scope > [data-phase20-21-participant-selection]');
   reward=record.querySelector(':scope > [data-phase20-21-claim-ready]');
   growth=record.querySelector(':scope > [data-phase20-21-growth-status]');
  }

  updateStage(facilityId,config,recommendation(root,facilityId,config,record,receipt,tutorial));
  modal.dataset.phase24lB3eModal='successor';
  root.dataset.phase24lB3eFacility=facilityId;
  root.dataset.phase24lB3eMechanicsChanged='false';
  masthead.classList.add('phase24l-b3e-scene');
  masthead.setAttribute('data-phase24l-b3e-scene-icon',config.icon);

  const {stack,panels}=panelSet(document,config);
  if(record){
   appendIf(panels[config.requirement||config.work],requirement);
   appendIf(panels[config.work],choice);
   appendIf(panels[config.growth||config.work],growth);
   if(config.party)appendIf(panels[config.party],participants);
   appendIf(panels[config.result],reward,receipt);
   record.tabIndex=-1;
   appendIf(panels[config.brief],tutorial,record);
  }else{
   appendIf(panels[config.brief],tutorial,empty);
   appendIf(panels[config.result],receipt);
  }
  appendIf(panels[config.brief],summary);
  appendIf(panels[tutorial&&config.status===config.brief?config.result:config.status],queue,footer,policy);
  compactQueue(document,queue);
  fillEmptyPanels(document,config,panels);
  root.append(stack);
  if(actionDock)root.append(actionDock);
  addTabs(document,root,facilityId,config,panels);
  bindBackdropToCanonicalClose(modal);
  decorations++;
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
   decorate(document,document.querySelector('[data-overlay] .modal'));
   return value;
  });
  installed=true;
  return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:false,mechanicsChanged:false,saveChanged:false});
 }

 function diagnostics(){
  return Object.freeze({
   version:VERSION,id:ID,installed,decorations,tabChanges,
   facilities:Object.freeze(Object.fromEntries([...session].map(([facilityId,value])=>[facilityId,Object.freeze({...value})]))),
   mechanicsChanged:false,saveChanged:false
  });
 }

 Object.defineProperty(globalThis,'EVERSTEAD_PHASE24L_SUCCESSOR_FACILITY_MODALS',{
  configurable:false,enumerable:false,writable:false,
  value:Object.freeze({version:VERSION,id:ID,schemaVersion:SCHEMA_VERSION,facilityIds:Object.freeze(Object.keys(FACILITIES)),install,diagnostics})
 });
})();
