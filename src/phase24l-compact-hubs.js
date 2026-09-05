(()=>{
 'use strict';

 const VERSION=1;
 const ID='everstead.phase24l.compact-hubs.v1';
 const SCHEMA_VERSION=15;
 const OATH_TABS=Object.freeze([
  Object.freeze({id:'prepare',label:'Prepare',source:'Pre-Gaming',icon:'✦'}),
  Object.freeze({id:'work',label:'Work',source:'Work & Chores',icon:'◆'}),
  Object.freeze({id:'family',label:'Family',source:'Family Time',icon:'♡'}),
  Object.freeze({id:'shutdown',label:'Rest',source:'Shutdown',icon:'☾'}),
  Object.freeze({id:'manage',label:'Manage',source:null,icon:'◇'})
 ]);
 const MORE_TABS=Object.freeze([
  Object.freeze({id:'journey',label:'Journey',icon:'✦'}),
  Object.freeze({id:'codex',label:'Codex',icon:'▤'}),
  Object.freeze({id:'guide',label:'Guide',icon:'⌁'}),
  Object.freeze({id:'settings',label:'Settings',icon:'◇'}),
  Object.freeze({id:'save',label:'Save',icon:'◆'})
 ]);
 let installed=false;
 let oathPanel='prepare';
 let morePanel='journey';
 let oathGuideSeen=false;
 let moreGuideSeen=false;
 let oathGuideOpen=false;
 let moreGuideOpen=false;
 let panelActivations=0;
 let guideActivations=0;
 let resizeBound=false;

 function element(document,tag,className,attributes={}){
  const node=document.createElement(tag);
  if(className)node.className=className;
  for(const [name,value] of Object.entries(attributes)){
   if(value===null||value===undefined)continue;
   if(name==='text')node.textContent=value;
   else node.setAttribute(name,String(value));
  }
  return node;
 }

 function syncRails(document){
  const root=document.documentElement,top=document.querySelector('.topbar'),bottom=document.querySelector('.bottom-nav');
  root.style.setProperty('--phase24l-b3a-top',`${Math.max(58,Math.ceil(top?.getBoundingClientRect?.().height||0))}px`);
  root.style.setProperty('--phase24l-b3a-bottom',`${Math.max(62,Math.ceil(bottom?.getBoundingClientRect?.().height||0))}px`);
 }

 function clearRootState(document){
  document.documentElement.classList.remove('phase24l-b3a-active','phase24l-b3a-oaths','phase24l-b3a-more');
 }

 function panelHeading(document,title,subtitle,key){
  const head=element(document,'header','phase24l-b3a-panel-head');
  const copy=element(document,'div','phase24l-b3a-panel-title');
  copy.append(element(document,'small','',{text:subtitle}),element(document,'h2','',{text:title}));
  const close=element(document,'button','phase24l-b3a-panel-close',{type:'button','data-phase24l-b3a-panel-close':key,'aria-label':`Close ${title}`,text:'×'});
  head.append(copy,close);
  return head;
 }

 function stateFor(kind){return kind==='oaths'?oathPanel:morePanel}
 function setStoredPanel(kind,key){if(kind==='oaths')oathPanel=key;else morePanel=key}
 function guideIsOpen(kind){return kind==='oaths'?oathGuideOpen:moreGuideOpen}
 function setGuideOpen(kind,value){if(kind==='oaths')oathGuideOpen=value;else moreGuideOpen=value}

 function syncPanels(screen,kind,key,{toggle=false,focusPanel=false,focusTab=false}={}){
  const selected=toggle&&stateFor(kind)===key&&!guideIsOpen(kind)?null:key;
  setGuideOpen(kind,false);
  setStoredPanel(kind,selected);
  screen.dataset.phase24lCompactPanel=selected||'closed';
  screen.dataset.phase24lCompactSheetOpen=String(Boolean(selected));
  screen.querySelectorAll('[data-phase24l-compact-panel]').forEach(panel=>{panel.hidden=panel.dataset.phase24lCompactPanel!==selected});
  screen.querySelectorAll('[data-phase24l-compact-tab]').forEach(button=>{
   const active=button.dataset.phase24lCompactTab===selected;
   button.setAttribute('aria-selected',String(active));
   button.setAttribute('aria-expanded',String(active));
  });
  const guide=screen.querySelector('[data-phase24l-b3a-guide]');
  if(guide)guide.hidden=true;
  if(focusPanel&&selected)screen.querySelector(`[data-phase24l-compact-panel="${selected}"] [data-phase24l-b3a-panel-close]`)?.focus?.();
  if(focusTab&&!selected)screen.querySelector(`[data-phase24l-compact-tab="${key}"]`)?.focus?.();
 }

 function openGuide(screen,kind,button=null){
  setGuideOpen(kind,true);
  guideActivations++;
  screen.dataset.phase24lCompactPanel='guide';
  screen.dataset.phase24lCompactSheetOpen='true';
  screen.querySelectorAll('[data-phase24l-compact-panel]').forEach(panel=>{panel.hidden=true});
  screen.querySelectorAll('[data-phase24l-compact-tab]').forEach(tab=>{tab.setAttribute('aria-selected','false');tab.setAttribute('aria-expanded','false')});
  const guide=screen.querySelector('[data-phase24l-b3a-guide]');
  if(guide){guide.hidden=false;guide.querySelector('[data-phase24l-b3a-guide-close]')?.focus?.()}
  if(button)button.setAttribute('aria-expanded','true');
 }

 function closeGuide(screen,kind,{focusButton=true}={}){
  setGuideOpen(kind,false);
  screen.querySelector('[data-phase24l-b3a-guide-open]')?.setAttribute('aria-expanded','false');
  syncPanels(screen,kind,stateFor(kind),{focusPanel:false});
  if(focusButton)screen.querySelector('[data-phase24l-b3a-guide-open]')?.focus?.();
 }

 function addGuide(document,screen,kind){
  const isOaths=kind==='oaths';
  const button=element(document,'button','phase24l-b3a-guide-button',{type:'button','data-phase24l-b3a-guide-open':kind,'aria-label':`Open ${isOaths?'Oath Board':'More hub'} guide`,'aria-expanded':String(guideIsOpen(kind)),text:'? GUIDE'});
  screen.querySelector(':scope > .page-head')?.append(button);
  const guide=element(document,'aside','phase24l-b3a-panel phase24l-b3a-guide',{'data-phase24l-b3a-guide':kind,role:'dialog','aria-modal':'false','aria-label':`${isOaths?'Tavi':'Shallan'} guide`});
  guide.hidden=!guideIsOpen(kind);
  const head=panelHeading(document,isOaths?'The Oath Board':'The Everstead archive',`${isOaths?'Tavi':'Shallan'} · optional guide`,`${kind}-guide`);
  head.querySelector('[data-phase24l-b3a-panel-close]').dataset.phase24lB3aGuideClose=kind;
  const body=element(document,'div','phase24l-b3a-panel-body');
  body.append(element(document,'p','phase24l-b3a-guide-copy',{text:isOaths?'Choose a chapter below to see its promises. Completing an Oath still grants its established Village, Bond, and Prosperity effects; Manage holds filters and scheduling help.':'Journey, Codex, Guide, Settings, and Save replace the old long dashboard. Each opens one tray, and every existing action keeps its original rules.'}));
  guide.append(head,body);
  screen.append(guide);
  button.onclick=()=>guideIsOpen(kind)?closeGuide(screen,kind):openGuide(screen,kind,button);
  head.querySelector('[data-phase24l-b3a-guide-close]').onclick=()=>closeGuide(screen,kind);
 }

 function createPanel(document,screen,kind,spec,nodes,emptyCopy){
  const panel=element(document,'section','phase24l-b3a-panel',{'data-phase24l-compact-panel':spec.id,id:`phase24l-${kind}-${spec.id}`,role:'tabpanel','aria-label':`${spec.label} panel`});
  panel.hidden=stateFor(kind)!==spec.id||guideIsOpen(kind);
  const subtitle=kind==='oaths'?'Oath Board':'Everstead archive';
  panel.append(panelHeading(document,spec.source||spec.label,subtitle,spec.id));
  const body=element(document,'div','phase24l-b3a-panel-body');
  for(const node of nodes)body.append(node);
  if(!body.children.length)body.append(element(document,'p','phase24l-b3a-empty',{text:emptyCopy}));
  panel.append(body);
  panel.querySelector('[data-phase24l-b3a-panel-close]').onclick=()=>syncPanels(screen,kind,spec.id,{toggle:true,focusTab:true});
  screen.append(panel);
  return panel;
 }

 function createDock(document,screen,kind,specs){
  const dock=element(document,'nav','phase24l-b3a-dock',{'data-phase24l-compact-dock':kind,role:'tablist','aria-label':`${kind==='oaths'?'Oath Board':'More'} controls`});
  for(const spec of specs){
   const active=stateFor(kind)===spec.id&&!guideIsOpen(kind);
   const button=element(document,'button','',{type:'button','data-phase24l-compact-tab':spec.id,role:'tab','aria-controls':`phase24l-${kind}-${spec.id}`,'aria-selected':String(active),'aria-expanded':String(active)});
   button.innerHTML=`<i aria-hidden="true">${spec.icon}</i><span>${spec.label}</span>`;
   button.onclick=()=>{panelActivations++;syncPanels(screen,kind,spec.id,{toggle:true})};
   dock.append(button);
  }
  screen.append(dock);
 }

 function decorateOaths(document,screen){
  const root=document.documentElement;
  root.classList.add('phase24l-b3a-active','phase24l-b3a-oaths');
  screen.dataset.phase24lCompactScreen='oaths';
  screen.dataset.phase24lMechanicsChanged='false';
  const pageHead=screen.querySelector(':scope > .page-head');
  const add=pageHead?.querySelector('[data-act="add-oath"]');
  const settings=screen.querySelector(':scope > .settings-row');
  const sections=[...screen.querySelectorAll(':scope > .oath-section')];
  const total=sections.reduce((sum,section)=>sum+section.querySelectorAll('.oath').length,0);
  const kept=sections.reduce((sum,section)=>sum+section.querySelectorAll('.oath.done').length,0);
  const stage=element(document,'section','phase24l-b3a-stage phase24l-b3a-oath-stage',{'data-phase24l-b3a-stage':'oaths','aria-label':'Oath Board summary'});
  const seal=element(document,'div','phase24l-b3a-oath-seal');
  seal.append(element(document,'small','',{text:'COVENANT BOARD'}),element(document,'strong','',{text:`${kept} / ${total}`}),element(document,'span','',{text:'kept this cycle'}));
  const copy=element(document,'div','phase24l-b3a-stage-copy');
  copy.append(element(document,'div','eyebrow',{text:'Promises shape the Village'}),element(document,'h2','',{text:'Choose a chapter'}),element(document,'p','',{text:'One focused set of Oaths at a time.'}));
  stage.append(seal,copy);
  if(add){add.classList.add('phase24l-b3a-create');stage.append(add)}
  pageHead?.insertAdjacentElement('afterend',stage);

  for(const spec of OATH_TABS){
   const nodes=spec.source?sections.filter(section=>section.querySelector('h2')?.textContent.trim()===spec.source):[settings].filter(Boolean);
   createPanel(document,screen,'oaths',spec,nodes,spec.id==='manage'?'Create or edit an Oath from the board.':'No Oaths are recorded in this chapter.');
  }
  createDock(document,screen,'oaths',OATH_TABS);
  if(!oathGuideSeen){oathGuideSeen=true;oathGuideOpen=true}
  addGuide(document,screen,'oaths');
  if(oathGuideOpen)openGuide(screen,'oaths');else syncPanels(screen,'oaths',oathPanel);
 }

 function moreGroup(node){
  if(node.matches?.('[data-save-recovery],[data-save-health],[data-migration-history]'))return'save';
  if(node.querySelector?.('[data-setting]'))return'settings';
  if(node.matches?.('[data-phase-11d-codex-card],[data-phase13-reference],[data-phase17-reference]'))return'codex';
  if(node.matches?.('[data-campaign-efficiency-preview],[data-phase24-advanced]'))return'guide';
  return'journey';
 }

 function decorateMore(document,screen){
  const root=document.documentElement;
  root.classList.add('phase24l-b3a-active','phase24l-b3a-more');
  screen.dataset.phase24lCompactScreen='more';
  screen.dataset.phase24lMechanicsChanged='false';
  const pageHead=screen.querySelector(':scope > .page-head');
  const groups=Object.fromEntries(MORE_TABS.map(spec=>[spec.id,[]]));
  const candidates=[...screen.children].filter(node=>node!==pageHead&&!node.matches?.('[data-phase24l-b3a-stage],[data-phase24l-compact-dock],[data-phase24l-compact-panel],[data-phase24l-b3a-guide]'));
  const app=screen.parentElement;
  if(app)for(const node of [...app.children])if(node!==screen&&node.matches?.('[data-phase17-reference]'))candidates.push(node);
  for(const node of candidates)groups[moreGroup(node)].push(node);

  const stage=element(document,'section','phase24l-b3a-stage phase24l-b3a-more-stage',{'data-phase24l-b3a-stage':'more','aria-label':'Everstead archive'});
  const copy=element(document,'div','phase24l-b3a-stage-copy');
  copy.append(element(document,'div','eyebrow',{text:'EVERSTEAD ARCHIVE'}),element(document,'h2','',{text:'Your road, remembered'}),element(document,'p','',{text:'Story, collections, guidance, preferences, and protected recovery.'}));
  const sigil=element(document,'div','phase24l-b3a-archive-sigil',{'aria-hidden':'true',text:'✦'});
  stage.append(copy,sigil);
  pageHead?.insertAdjacentElement('afterend',stage);

  const empty={journey:'No journey notice is available.',codex:'The Codex is not available on this save.',guide:'No guidance is available.',settings:'No preferences are available.',save:'Save protection is unavailable.'};
  for(const spec of MORE_TABS)createPanel(document,screen,'more',spec,groups[spec.id],empty[spec.id]);
  createDock(document,screen,'more',MORE_TABS);
  if(!moreGuideSeen){moreGuideSeen=true;moreGuideOpen=true}
  addGuide(document,screen,'more');
  if(moreGuideOpen)openGuide(screen,'more');else syncPanels(screen,'more',morePanel);
 }

 function install(adapter){
  if(installed)return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:true,mechanicsChanged:false,saveChanged:false});
  if(!adapter||adapter.version!==1||!adapter.document||!adapter.slots)return Object.freeze({ok:false,reason:'adapter'});
  const {document,slots}=adapter;
  const required=['oathScreen','moreScreen','bindCommon'];
  if(required.some(name=>typeof slots[name]?.get!=='function'||typeof slots[name]?.set!=='function'))return Object.freeze({ok:false,reason:'slots'});

  const oathBefore=slots.oathScreen.get();
  slots.oathScreen.set(function(...args){
   const html=oathBefore(...args);
   return typeof html==='string'?html.replace('<main class="screen"','<main class="screen" data-phase24l-compact-screen="oaths"'):html;
  });
  const moreBefore=slots.moreScreen.get();
  slots.moreScreen.set(function(...args){
   const html=moreBefore(...args);
   return typeof html==='string'?html.replace('<main class="screen"','<main class="screen" data-phase24l-compact-screen="more"'):html;
  });

  const bindBefore=slots.bindCommon.get();
  slots.bindCommon.set(function(...args){
   const result=bindBefore(...args);
   clearRootState(document);
   const screen=document.querySelector('#app > main[data-phase24l-compact-screen]');
   if(screen?.dataset.phase24lCompactScreen==='oaths')decorateOaths(document,screen);
   else if(screen?.dataset.phase24lCompactScreen==='more')decorateMore(document,screen);
   syncRails(document);
   return result;
  });

  document.addEventListener('keydown',event=>{
   if(event.key!=='Escape'||document.querySelector('#overlay [data-overlay],#overlay [role="dialog"]'))return;
   const screen=document.querySelector('[data-phase24l-compact-screen]');
   if(!screen)return;
   const kind=screen.dataset.phase24lCompactScreen;
   if(guideIsOpen(kind)){event.preventDefault();event.stopPropagation();closeGuide(screen,kind);return}
   const active=stateFor(kind);
   if(active){event.preventDefault();event.stopPropagation();syncPanels(screen,kind,active,{toggle:true,focusTab:true})}
  },true);
  if(!resizeBound){document.defaultView?.addEventListener('resize',()=>syncRails(document),{passive:true});resizeBound=true}
  installed=true;
  return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:false,mechanicsChanged:false,saveChanged:false});
 }

 function diagnostics(){return Object.freeze({version:VERSION,id:ID,installed,oathPanel:oathPanel||'closed',morePanel:morePanel||'closed',oathGuideSeen,moreGuideSeen,panelActivations,guideActivations,saveChanged:false,mechanicsChanged:false})}

 Object.defineProperty(globalThis,'EVERSTEAD_PHASE24L_COMPACT_HUBS',{configurable:false,enumerable:false,writable:false,value:Object.freeze({version:VERSION,id:ID,schemaVersion:SCHEMA_VERSION,install,diagnostics})});
})();
