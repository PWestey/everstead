(()=>{
 'use strict';

 const VERSION=1;
 const ID='everstead.phase24l.game-screen-shell.v1';
 const SCHEMA_VERSION=15;
 const ADVENTURE_TABS=Object.freeze([
  Object.freeze({id:'action',label:'Action',icon:'◆'}),
  Object.freeze({id:'stages',label:'Stages',icon:'⌁'}),
  Object.freeze({id:'rewards',label:'Rewards',icon:'✦'}),
  Object.freeze({id:'records',label:'Records',icon:'≡'}),
  Object.freeze({id:'routes',label:'Routes',icon:'◇'})
 ]);
 let installed=false;
 let adventurePanel='action';
 let fellowshipNoticeOpen=false;
 let fellowshipGuideOpen=false;
 let adventureGuideOpen=false;
 let fellowshipGuideSeen=false;
 let adventureGuideSeen=false;
 let panelActivations=0;
 let guideActivations=0;
 let resizeBound=false;
 let lastTrigger=null;

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
  const topHeight=Math.max(58,Math.ceil(top?.getBoundingClientRect?.().height||0));
  const bottomHeight=Math.max(62,Math.ceil(bottom?.getBoundingClientRect?.().height||0));
  root.style.setProperty('--phase24l-b2-top',`${topHeight}px`);
  root.style.setProperty('--phase24l-b2-bottom',`${bottomHeight}px`);
 }

 function clearRootState(document){
  const root=document.documentElement;
  root.classList.remove('phase24l-b2-active','phase24l-b2-fellowship','phase24l-b2-adventure');
 }

 function panelHeading(document,title,subtitle,key,close){
  const head=element(document,'header','phase24l-local-panel-head');
  const copy=element(document,'div','phase24l-local-panel-title');
  copy.append(element(document,'small','',{text:subtitle}),element(document,'h2','',{text:title}));
  const button=element(document,'button','phase24l-local-panel-close',{
   type:'button','data-phase24l-panel-close':key,'aria-label':`Close ${title}`,'data-phase24l-guide-close':close==='guide'?'':null,text:'×'
  });
  head.append(copy,button);
  return head;
 }

 function guide(document,screen,kind){
  const isFellowship=kind==='fellowship';
  const open=isFellowship?fellowshipGuideOpen:adventureGuideOpen;
  const speaker=isFellowship?'Tavi':"Vex’ahlia";
  const title=isFellowship?'Your Fellowship gallery':'The Adventure board';
  const copy=isFellowship
   ?'Choose a portrait to open full art. Level spends shared Fellow EXP; Rank spends that Fellow’s shards. The gallery is the only part of this screen that scrolls.'
   :'The road stays visible while one tray is open. Action holds the main move, Stages changes the encounter, Rewards holds banked claims, Records shows history, and Routes changes roads.';
  const node=element(document,'aside','phase24l-route-guide',{
   'data-phase24l-guide':kind,'data-phase24l-guide-state':open?'open':'closed',role:'dialog','aria-modal':'false','aria-label':`${speaker} route guide`
  });
  node.hidden=!open;
  node.append(panelHeading(document,title,`${speaker} · optional guide`,`${kind}-guide`,'guide'));
  const body=element(document,'div','phase24l-route-guide-body');
  body.append(element(document,'p','',{text:copy}));
  node.append(body);
  screen.append(node);
  return node;
 }

 function closeGuide(document,kind,{returnFocus=true}={}){
  if(kind==='fellowship')fellowshipGuideOpen=false;
  else adventureGuideOpen=false;
  const node=document.querySelector(`[data-phase24l-guide="${kind}"]`);
  if(node){node.hidden=true;node.dataset.phase24lGuideState='closed'}
  if(returnFocus)document.querySelector(`[data-phase24l-guide-open="${kind}"]`)?.focus?.();
 }

 function openGuide(document,kind,button=null){
  if(kind==='fellowship')fellowshipGuideOpen=true;
  else adventureGuideOpen=true;
  guideActivations++;
  lastTrigger=button||lastTrigger;
  const node=document.querySelector(`[data-phase24l-guide="${kind}"]`);
  if(node){node.hidden=false;node.dataset.phase24lGuideState='open';node.querySelector('[data-phase24l-guide-close]')?.focus?.()}
 }

 function addGuideButton(document,screen,kind){
  const pageHead=screen.querySelector(':scope > .page-head');
  if(!pageHead||pageHead.querySelector('[data-phase24l-guide-open]'))return;
  const button=element(document,'button','phase24l-guide-button',{type:'button','data-phase24l-guide-open':kind,'aria-label':`Open ${kind} guide`,text:'? GUIDE'});
  button.onclick=()=>{
   const open=kind==='fellowship'?fellowshipGuideOpen:adventureGuideOpen;
   if(open)closeGuide(document,kind);
   else openGuide(document,kind,button);
  };
  pageHead.append(button);
 }

 function decoratePanelClose(document,node,key,sourceToggle=null){
  if(node.querySelector(':scope > .phase24l-local-panel-head'))return;
  const titles={might:['Might','Fellowship Power'],path:['Fellow Path','Deterministic roster'],tools:['Roster Tools','Sort and filter'],notice:['Roster Notice','Current roster status']};
  const [title,subtitle]=titles[key]||['Details','Fellowship'];
  const head=panelHeading(document,title,subtitle,key);
  node.insertBefore(head,node.firstChild);
  head.querySelector('[data-phase24l-panel-close]').onclick=()=>{
   if(sourceToggle)sourceToggle.click();
   else{
    const screen=node.closest('[data-phase24l-game-screen="fellowship"]');
    if(screen)syncFellowshipPanels(screen,null);
    else{fellowshipNoticeOpen=false;node.hidden=true}
    document.querySelector('[data-phase24l-notice-toggle]')?.focus?.();
   }
  };
 }

 function syncFellowshipPanels(screen,activeKey){
  const selected=['might','path','tools','notice'].includes(activeKey)?activeKey:null;
  fellowshipNoticeOpen=selected==='notice';
  screen.dataset.phase24lActivePanel=selected||'closed';
  screen.dataset.phase24lSheetOpen=String(Boolean(selected));
  screen.querySelectorAll('[data-phase24l-local-panel]').forEach(panel=>{panel.hidden=panel.dataset.phase24lLocalPanel!==selected});
  screen.querySelectorAll('[data-phase24l-local-tab]').forEach(button=>{
   const active=button.dataset.phase24lLocalTab===selected;
   button.setAttribute('aria-selected',String(active));
   button.setAttribute('aria-expanded',String(active));
  });
 }

 function fellowshipPanelTarget(screen,key){
  return key==='might'?screen.querySelector('[data-fellow-might-summary]'):
   key==='path'?screen.querySelector('[data-phase-11g-path]'):
   key==='tools'?screen.querySelector('[data-phase-11d-roster-tools]'):null;
 }

 function decorateFellowship(document,screen){
  document.documentElement.classList.add('phase24l-b2-active','phase24l-b2-fellowship');
  screen.dataset.phase24lGameScreen='fellowship';
  screen.dataset.phase24lMechanicsChanged='false';
  screen.querySelector('.phase24k-fellowship-hero')?.setAttribute('hidden','');
  const tabs=screen.querySelector(':scope > .tabs:has([data-roster])');
  const grid=screen.querySelector(':scope > .roster-grid');
  if(tabs){
   tabs.classList.add('phase24l-fellowship-roster-dock','phase24l-local-dock');
   tabs.dataset.phase24lLocalDock='fellowship-roster';
   tabs.setAttribute('role','tablist');
   tabs.querySelectorAll('[data-roster]').forEach(button=>{
    button.setAttribute('role','tab');
    button.setAttribute('aria-selected',String(button.classList.contains('on')));
   });
  }
  if(grid){grid.dataset.phase24lRosterScroll='';grid.setAttribute('tabindex','0');grid.setAttribute('aria-label','Fellowship portrait gallery')}

  const ribbon=screen.querySelector(':scope > .phase24k-fellowship-ribbon');
  const tools=fellowshipPanelTarget(screen,'tools');
  let utility=ribbon;
  if(!utility&&(tools||screen.querySelector(':scope > .card:not([data-phase-11d-roster-tools])'))){
   utility=element(document,'div','phase24l-fellowship-utility');
   utility.dataset.phase24lFellowshipUtility='';
   screen.querySelector(':scope > .page-head')?.insertAdjacentElement('afterend',utility);
  }
  if(utility)utility.classList.add('phase24l-fellowship-utility');

  for(const key of ['might','path','tools']){
   const target=fellowshipPanelTarget(screen,key);
   if(!target)continue;
   target.classList.add('phase24l-local-panel','phase24l-fellowship-panel');
   target.dataset.phase24lLocalPanel=key;
   target.id=`phase24l-fellowship-${key}`;
   target.setAttribute('role','dialog');
   target.setAttribute('aria-label',`${key} details`);
   let toggle=screen.querySelector(`[data-phase24k-panel-toggle="${key}"]`);
   if(!toggle&&utility){
    target.hidden=true;
    toggle=element(document,'button','',{type:'button','data-phase24l-fellowship-toggle':key,'data-phase24l-local-tab':key,'aria-controls':target.id,'aria-selected':'false','aria-expanded':'false',text:key.toUpperCase()});
    utility.append(toggle);
    toggle.onclick=()=>{
     const opening=target.hidden;
     syncFellowshipPanels(screen,opening?key:null);
     panelActivations++;
     if(opening)target.querySelector('[data-phase24l-panel-close]')?.focus?.();
    };
   }
   if(toggle){
    toggle.dataset.phase24lLocalTab=key;
    toggle.setAttribute('aria-controls',target.id);
    toggle.setAttribute('aria-selected',toggle.getAttribute('aria-expanded')||'false');
   }
   if(toggle)decoratePanelClose(document,target,key,toggle);
  }

  const known=new Set([grid,tabs,ribbon,...['might','path','tools'].map(key=>fellowshipPanelTarget(screen,key)).filter(Boolean),screen.querySelector(':scope > .page-head'),screen.querySelector('.phase24k-fellowship-hero')]);
  const noticeCards=[...screen.children].filter(node=>node.matches?.('.card')&&!known.has(node));
  let notice=noticeCards.shift()||null;
  if(notice)for(const extra of noticeCards)notice.append(extra);
  if(!notice&&utility){
   notice=element(document,'section','card phase24l-roster-notice');
   notice.append(
    element(document,'p','eyebrow',{text:'FELLOWSHIP STATUS'}),
    element(document,'h3','',{text:'The gallery is ready'}),
    element(document,'p','soft',{text:'Portrait badges show who can advance. Open a character to spend shared EXP, use their shards, inspect Bonds, or equip Relics.'})
   );
   screen.append(notice);
  }
  if(notice&&utility){
   notice.classList.add('phase24l-local-panel','phase24l-fellowship-panel');
   notice.dataset.phase24lLocalPanel='notice';
   notice.hidden=!fellowshipNoticeOpen;
   decoratePanelClose(document,notice,'notice');
   notice.id='phase24l-fellowship-notice';
   for(const extra of [...screen.querySelectorAll(':scope > .card:not([data-phase24l-local-panel])')])notice.append(extra);
   const button=element(document,'button','',{type:'button','data-phase24l-notice-toggle':'','data-phase24l-local-tab':'notice','aria-controls':notice.id,'aria-selected':String(fellowshipNoticeOpen),'aria-expanded':String(fellowshipNoticeOpen),text:'NOTICE'});
   button.onclick=()=>{
    const opening=notice.hidden;
    syncFellowshipPanels(screen,opening?'notice':null);
    panelActivations++;
    if(opening)notice.querySelector('[data-phase24l-panel-close]')?.focus?.();
   };
   utility.append(button);
  }
  const inherited=screen.querySelector('[data-phase24k-panel-toggle][aria-expanded="true"]')?.dataset.phase24kPanelToggle;
  const custom=screen.querySelector('[data-phase24l-fellowship-toggle][aria-expanded="true"]')?.dataset.phase24lFellowshipToggle;
  syncFellowshipPanels(screen,inherited||custom||(fellowshipNoticeOpen?'notice':null));
  addGuideButton(document,screen,'fellowship');
  if(!fellowshipGuideSeen){fellowshipGuideSeen=true;fellowshipGuideOpen=true}
  guide(document,screen,'fellowship');
 }

 function directChildren(screen){return [...screen.children]}
 function hasAny(node,selectors){return selectors.some(selector=>node.matches?.(selector)||node.querySelector?.(selector))}

 function adventureGroups(screen){
  const nodes=directChildren(screen);
  const pageHead=screen.querySelector(':scope > .page-head');
  const routes=screen.querySelector(':scope > .adventure-tabs');
  const scene=nodes.find(node=>node.matches?.('.campaign-walk,.tower-hero,.expedition-hero,.adventure-hero'))||null;
  const groups={action:[],stages:[],rewards:[],records:[],routes:routes?[routes]:[]};
  for(const node of nodes){
   if(node===pageHead||node===routes||node===scene||node.matches?.('[data-phase24l-local-dock],[data-phase24l-panel-host],[data-phase24l-guide]'))continue;
   if(node.matches?.('.node-row'))groups.stages.push(node);
   else if(node.matches?.('.phase-11c-claim-card')||hasAny(node,['[data-phase-11c-claim-ready]']))groups.rewards.push(node);
   else if(node.matches?.('.phase22b-campaign-record,.phase-11c-repeat,.expedition-history,.tower-history')||hasAny(node,['[data-phase22b-campaign-record]','[data-phase-11c-repeat-open]']))groups.records.push(node);
   else groups.action.push(node);
  }
  return{pageHead,routes,scene,groups};
 }

 function setAdventurePanel(document,screen,key,{focusPanel=false,focusTab=false}={}){
  adventurePanel=adventurePanel===key?null:key;
  panelActivations++;
  screen.dataset.phase24lActivePanel=adventurePanel||'closed';
  screen.dataset.phase24lSheetOpen=String(Boolean(adventurePanel));
  screen.querySelectorAll('[data-phase24l-local-panel]').forEach(panel=>{panel.hidden=panel.dataset.phase24lLocalPanel!==adventurePanel});
  screen.querySelectorAll('[data-phase24l-local-tab]').forEach(button=>{
   const active=button.dataset.phase24lLocalTab===adventurePanel;
   button.setAttribute('aria-selected',String(active));
   button.setAttribute('aria-expanded',String(active));
  });
  if(focusPanel&&adventurePanel)screen.querySelector(`[data-phase24l-local-panel="${adventurePanel}"] [data-phase24l-panel-close]`)?.focus?.();
  if(focusTab&&!adventurePanel)screen.querySelector(`[data-phase24l-local-tab="${key}"]`)?.focus?.();
 }

 function decorateAdventure(document,screen){
  document.documentElement.classList.add('phase24l-b2-active','phase24l-b2-adventure');
  screen.dataset.phase24lGameScreen='adventure';
  screen.dataset.phase24lMechanicsChanged='false';
  screen.dataset.phase24lActivePanel=adventurePanel||'closed';
  screen.dataset.phase24lSheetOpen=String(Boolean(adventurePanel));
  const {scene,groups}=adventureGroups(screen);
  if(scene){scene.dataset.phase24lAdventureScene='';scene.classList.add('phase24l-adventure-stage')}

  const host=element(document,'div','phase24l-panel-host',{'data-phase24l-panel-host':'adventure'});
  for(const spec of ADVENTURE_TABS){
   const panel=element(document,'section','phase24l-local-panel phase24l-adventure-panel',{
    'data-phase24l-local-panel':spec.id,id:`phase24l-adventure-${spec.id}`,role:'tabpanel','aria-label':`${spec.label} panel`
   });
   panel.hidden=adventurePanel!==spec.id;
   panel.append(panelHeading(document,spec.label,spec.id==='action'?'Current road':spec.id==='routes'?'Choose a road':'Adventure details',spec.id));
   const body=element(document,'div','phase24l-local-panel-body');
   for(const node of groups[spec.id])body.append(node);
   if(!body.children.length)body.append(element(document,'p','phase24l-empty-panel',{text:spec.id==='stages'?'This road has no stage selector.':spec.id==='records'?'No journey record has been written yet.':spec.id==='rewards'?'No banked reward is waiting on this road.':'No additional action is available.'}));
   panel.append(body);
   if(spec.id==='action'){
    const primarySelectors=['[data-campaign-run]','[data-companion-campaign-run]','[data-companion-tower-clear]','[data-companion-tower-claim]','[data-expedition-push]','[data-expedition-claim]'];
    const primary=[...new Set(primarySelectors.flatMap(selector=>[...body.querySelectorAll(selector)]))];
    if(primary.length){
     const footer=element(document,'footer','phase24l-primary-action-bar',{'data-phase24l-primary-action':''});
     for(const control of primary)footer.append(control);
     panel.append(footer);
    }
   }
   host.append(panel);
   panel.querySelector('[data-phase24l-panel-close]').onclick=()=>{
    if(adventurePanel!==spec.id)return;
    setAdventurePanel(document,screen,spec.id,{focusTab:true});
   };
  }
  screen.append(host);

  const dock=element(document,'nav','phase24l-local-dock phase24l-adventure-dock',{'data-phase24l-local-dock':'adventure',role:'tablist','aria-label':'Adventure controls'});
  for(const spec of ADVENTURE_TABS){
   const active=adventurePanel===spec.id;
   const button=element(document,'button','',{type:'button','data-phase24l-local-tab':spec.id,role:'tab','aria-controls':`phase24l-adventure-${spec.id}`,'aria-selected':String(active),'aria-expanded':String(active)});
   button.innerHTML=`<i aria-hidden="true">${spec.icon}</i><span>${spec.label}</span>`;
   button.onclick=()=>{lastTrigger=button;setAdventurePanel(document,screen,spec.id,{focusPanel:false})};
   dock.append(button);
  }
  screen.append(dock);
  addGuideButton(document,screen,'adventure');
  if(!adventureGuideSeen){adventureGuideSeen=true;adventureGuideOpen=true}
  guide(document,screen,'adventure');
 }

 function install(adapter){
  if(installed)return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:true,mechanicsChanged:false,saveChanged:false});
  if(!adapter||adapter.version!==1||!adapter.document||!adapter.slots)return Object.freeze({ok:false,reason:'adapter'});
  const {document,slots}=adapter;
  const required=['rosterScreen','adventureScreen','bindCommon'];
  if(required.some(name=>typeof slots[name]?.get!=='function'||typeof slots[name]?.set!=='function'))return Object.freeze({ok:false,reason:'slots'});

  const rosterBefore=slots.rosterScreen.get();
  slots.rosterScreen.set(function(...args){
   const html=rosterBefore(...args);
   return typeof html==='string'?html.replace('<main class="screen"','<main class="screen" data-phase24l-game-screen="fellowship"'):html;
  });
  const adventureBefore=slots.adventureScreen.get();
  slots.adventureScreen.set(function(...args){
   const html=adventureBefore(...args);
   return typeof html==='string'?html.replace('<main class="screen"','<main class="screen" data-phase24l-game-screen="adventure"'):html;
  });

  const bindBefore=slots.bindCommon.get();
  slots.bindCommon.set(function(...args){
   const result=bindBefore(...args);
   clearRootState(document);
   const screen=document.querySelector('#app > main[data-phase24l-game-screen]');
   if(screen?.dataset.phase24lGameScreen==='fellowship')decorateFellowship(document,screen);
   else if(screen?.dataset.phase24lGameScreen==='adventure')decorateAdventure(document,screen);
   syncRails(document);
   return result;
  });

  document.addEventListener('click',event=>{
   const close=event.target?.closest?.('[data-phase24l-guide-close]');
   if(close){
    const guideNode=close.closest('[data-phase24l-guide]');
    if(guideNode){event.preventDefault();closeGuide(document,guideNode.dataset.phase24lGuide);return}
   }
   const fellowshipToggle=event.target?.closest?.('[data-phase24k-panel-toggle]');
   if(fellowshipToggle){
    const screen=fellowshipToggle.closest('[data-phase24l-game-screen="fellowship"]');
    const key=fellowshipToggle.dataset.phase24kPanelToggle;
    if(screen)syncFellowshipPanels(screen,fellowshipToggle.getAttribute('aria-expanded')==='true'?key:null);
    panelActivations++;
   }
  });
  document.addEventListener('keydown',event=>{
   if(event.key!=='Escape')return;
   const guideNode=document.querySelector('[data-phase24l-guide]:not([hidden])');
   if(guideNode){event.preventDefault();event.stopPropagation();closeGuide(document,guideNode.dataset.phase24lGuide);return}
   const screen=document.querySelector('[data-phase24l-game-screen="adventure"]');
   if(screen&&adventurePanel){const key=adventurePanel;event.preventDefault();event.stopPropagation();setAdventurePanel(document,screen,key,{focusTab:true});return}
   const openFellowship=document.querySelector('[data-phase24l-game-screen="fellowship"] [data-phase24l-local-panel]:not([hidden])');
   openFellowship?.querySelector('[data-phase24l-panel-close]')?.click?.();
  },true);
  if(!resizeBound){
   document.defaultView?.addEventListener('resize',()=>syncRails(document),{passive:true});
   resizeBound=true;
  }

  installed=true;
  return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:false,mechanicsChanged:false,saveChanged:false});
 }

 function diagnostics(){return Object.freeze({version:VERSION,id:ID,installed,adventurePanel:adventurePanel||'closed',fellowshipGuideSeen,adventureGuideSeen,panelActivations,guideActivations,saveChanged:false,mechanicsChanged:false})}

 Object.defineProperty(globalThis,'EVERSTEAD_PHASE24L_GAME_SCREEN_SHELL',{configurable:false,enumerable:false,writable:false,value:Object.freeze({version:VERSION,id:ID,schemaVersion:SCHEMA_VERSION,install,diagnostics})});
})();
