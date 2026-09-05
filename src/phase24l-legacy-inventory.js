(()=>{
 'use strict';

 const VERSION=1;
 const ID='everstead.phase24l.legacy-inventory.v1';
 const SCHEMA_VERSION=15;
 const LEGACY_TABS=Object.freeze([
  Object.freeze({id:'tracks',label:'Tracks',icon:'✦'}),
  Object.freeze({id:'feats',label:'Feats',icon:'◆'}),
  Object.freeze({id:'ready',label:'Ready',icon:'!'}),
  Object.freeze({id:'history',label:'History',icon:'▤'})
 ]);
 const INVENTORY_TABS=Object.freeze([
  Object.freeze({id:'materials',label:'Materials',icon:'✦'}),
  Object.freeze({id:'gifts',label:'Gifts',icon:'♡'}),
  Object.freeze({id:'shards',label:'Shards',icon:'◇'}),
  Object.freeze({id:'relics',label:'Relics',icon:'◆'}),
  Object.freeze({id:'keepsakes',label:'Keepsakes',icon:'▤'})
 ]);
 let installed=false;
 let legacyTab='tracks';
 let inventoryTab='materials';
 let selectedItem=null;
 let inventoryPages=Object.fromEntries(INVENTORY_TABS.map(item=>[item.id,0]));
 let compactLaunches=0;
 let inventoryViews=0;
 let legacyDecorations=0;
 const LEGACY_CONTEXT=new WeakMap();

 function element(document,tag,className='',attributes={}){
  const node=document.createElement(tag);
  if(className)node.className=className;
  for(const [name,value] of Object.entries(attributes)){
   if(value===null||value===undefined)continue;
   if(name==='text')node.textContent=value;
   else node.setAttribute(name,String(value));
  }
  return node;
 }

 function compactNumber(value,format){
  return typeof format==='function'?format(value):String(value);
 }

 function actorInitial(name){
  return String(name||'?').trim().split(/\s+/).slice(0,2).map(part=>part[0]||'').join('').toUpperCase()||'?';
 }

 function inventoryProjection(api){
  const state=api.state();
  const definitions=api.definitions;
  const fellowWallet=state?.experienceProgression?.wallets?.fellow?.balance??0;
  const materials=[
   {key:'material.fellow-exp',kind:'material',name:'Fellow EXP',amount:fellowWallet,glyph:'EXP',detail:'Earned EXP is banked here. It levels no one until you choose a Fellow and invest it.',route:{kind:'roster',roster:'fellows'}},
   {key:'material.relic-stones',kind:'material',name:'Relic Stones',amount:state?.relicStones??0,glyph:'✦',detail:'Used by the established Relic upgrade screen. This Inventory view cannot spend them.',route:{kind:'relics'}}
  ];
  const gifts=[{key:'gift.generic',kind:'gift',name:'Gifts',amount:state?.gifts??0,glyph:'♡',detail:'Gifts are deliberately given from a Family profile to raise Intimacy.',route:{kind:'roster',roster:'family'}}];
  const shards=[];
  for(const kind of ['fellow','family','companion']){
   const stateKey=kind==='fellow'?'fellows':kind==='family'?'family':'companions';
   const definitionKey=kind==='fellow'?'fellows':kind==='family'?'family':'companions';
   for(const def of definitions[definitionKey]||[]){
    const amount=state?.[stateKey]?.[def.id]?.shards??0;
    const joined=kind!=='fellow'||api.isFellowAvailable(state,def.id);
    shards.push({key:`shard.${kind}.${def.id}`,kind:'shard',actorKind:kind,actorId:def.id,name:`${def.name} Shards`,amount,glyph:actorInitial(def.name),detail:`Targeted ${def.name} shards raise Rank separately from EXP.${joined?'':` ${def.name} joins at Player Rank ${api.requiredFellowRank(def.id)}; the balance is preserved.`}`,route:{kind:'actor',actorKind:kind,id:def.id}});
   }
  }
  const relics=[];
  for(const def of definitions.relics||[]){
   const item=state?.relics?.[def.id];
   if(item?.owned!==true)continue;
   const owner=(definitions.fellows||[]).find(actor=>state?.fellows?.[actor.id]?.relicSlots?.[0]===def.id);
   relics.push({key:`relic.${def.id}`,kind:'relic',name:def.name,amount:1,glyph:def.icon||'✦',meta:`Level ${item.level}${owner?` · ${owner.name}`:' · Unequipped'}`,detail:`Owned one-copy Relic at Level ${item.level}.${owner?` Equipped to ${owner.name}.`:' Currently unequipped.'}`,route:{kind:'relic',id:def.id}});
  }
  return Object.freeze({materials:Object.freeze(materials),gifts:Object.freeze(gifts),shards:Object.freeze(shards),relics:Object.freeze(relics),keepsakes:Object.freeze([])});
 }

 function inventoryPageSize(api){return api.wideInventory()?12:9}

 function inventoryModalHtml(api){
  const projection=inventoryProjection(api),items=projection[inventoryTab]||[],pageSize=inventoryPageSize(api),maxPage=Math.max(0,Math.ceil(items.length/pageSize)-1);
  inventoryPages[inventoryTab]=Math.min(maxPage,Math.max(0,inventoryPages[inventoryTab]||0));
  const page=inventoryPages[inventoryTab],visible=items.slice(page*pageSize,(page+1)*pageSize),esc=api.escape,format=api.format;
  const cards=visible.map(item=>`<button type="button" class="phase24l-b3b-item" data-phase24l-b3b-item="${esc(item.key)}" data-phase24l-b3b-kind="${esc(item.kind)}" data-phase24l-b3b-amount="${item.amount}" aria-pressed="${selectedItem===item.key?'true':'false'}"><span class="phase24l-b3b-item-glyph" aria-hidden="true">${esc(item.glyph)}</span><span class="phase24l-b3b-item-name">${esc(item.name)}</span><b>${compactNumber(item.amount,format)}</b>${item.meta?`<small>${esc(item.meta)}</small>`:''}</button>`).join('');
  const empty=inventoryTab==='keepsakes'?'<div class="phase24l-b3b-empty" data-phase24l-b3b-empty><b>Keepsakes are not active yet</b><p>Everstead has no owned-keepsake inventory authority today. Future keepsakes will appear here only after that system is safely released.</p></div>':'<div class="phase24l-b3b-empty" data-phase24l-b3b-empty><b>Nothing owned in this category</b><p>This view never invents items or opens unearned rewards.</p></div>';
  const selected=items.find(item=>item.key===selectedItem)||null;
  if(!selected)selectedItem=null;
  const detail=selected?`<aside class="phase24l-b3b-detail" data-phase24l-b3b-detail="${esc(selected.key)}" aria-label="${esc(selected.name)} details"><button type="button" class="phase24l-b3b-detail-close" data-phase24l-b3b-detail-close aria-label="Close item details">×</button><div class="phase24l-b3b-detail-glyph" aria-hidden="true">${esc(selected.glyph)}</div><div><div class="eyebrow">Owned · read only</div><h3>${esc(selected.name)} · ${compactNumber(selected.amount,format)}</h3><p>${esc(selected.detail)}</p>${selected.route?`<button type="button" class="btn teal" data-phase24l-b3b-route="${esc(selected.key)}">OPEN ${selected.route.kind==='actor'?'PROFILE':'SYSTEM'}</button>`:''}</div></aside>`:'';
  return `<div data-phase24l-b3b-modal="inventory" data-phase24l-b3b-inventory><div class="modal-head"><div><div class="eyebrow">Everstead stores · read only</div><h2 id="everstead-modal-title">Inventory</h2></div><button class="close" data-modal-close aria-label="Close Inventory">×</button></div><p class="phase24l-b3b-truth">Only resources already recorded in this save appear here. Gold remains in the top rail; pending rewards remain with their source.</p><nav class="phase24l-b3b-tabs phase24l-b3b-inventory-tabs" role="tablist" aria-label="Inventory categories">${INVENTORY_TABS.map(tab=>`<button type="button" role="tab" data-phase24l-b3b-category="${tab.id}" aria-selected="${inventoryTab===tab.id}" aria-controls="phase24l-b3b-inventory-grid"><i aria-hidden="true">${tab.icon}</i><span>${tab.label}</span></button>`).join('')}</nav><section id="phase24l-b3b-inventory-grid" class="phase24l-b3b-grid" data-phase24l-b3b-grid="${inventoryTab}" role="tabpanel" aria-label="${esc(INVENTORY_TABS.find(tab=>tab.id===inventoryTab).label)}">${cards||empty}</section><footer class="phase24l-b3b-pager"><button type="button" data-phase24l-b3b-page-prev ${page===0?'disabled':''} aria-label="Previous inventory page">‹</button><span data-phase24l-b3b-page-status>Page ${page+1} of ${maxPage+1} · ${items.length} ${items.length===1?'item':'items'}</span><button type="button" data-phase24l-b3b-page-next ${page===maxPage?'disabled':''} aria-label="Next inventory page">›</button></footer>${detail}</div>`;
 }

 function openInventory(api,{focusKey=null}={}){
  if(focusKey)selectedItem=focusKey;
  inventoryViews++;
  api.showModal(inventoryModalHtml(api));
  return true;
 }

 function bindInventory(document,api){
  const root=document.querySelector('[data-phase24l-b3b-inventory]');
  if(!root||root.dataset.phase24lB3bBound==='true')return false;
  root.dataset.phase24lB3bBound='true';
  const categoryTabs=[...root.querySelectorAll('[data-phase24l-b3b-category]')];
  categoryTabs.forEach((button,index)=>{
   button.tabIndex=button.getAttribute('aria-selected')==='true'?0:-1;
   button.onclick=()=>{
   const next=button.dataset.phase24lB3bCategory;
   if(!INVENTORY_TABS.some(tab=>tab.id===next))return;
   inventoryTab=next;selectedItem=null;inventoryPages[next]=0;openInventory(api);
   };
   button.onkeydown=event=>{
    const key=event.key;if(!['ArrowLeft','ArrowRight','Home','End'].includes(key))return;
    event.preventDefault();const nextIndex=key==='Home'?0:key==='End'?categoryTabs.length-1:(index+(key==='ArrowRight'?1:-1)+categoryTabs.length)%categoryTabs.length;
    categoryTabs[nextIndex].click();api.defer(()=>document.querySelector(`[data-phase24l-b3b-category="${INVENTORY_TABS[nextIndex].id}"]`)?.focus());
   };
  });
  root.querySelector('[data-phase24l-b3b-page-prev]')?.addEventListener('click',()=>{inventoryPages[inventoryTab]=Math.max(0,(inventoryPages[inventoryTab]||0)-1);selectedItem=null;openInventory(api)});
  root.querySelector('[data-phase24l-b3b-page-next]')?.addEventListener('click',()=>{inventoryPages[inventoryTab]=(inventoryPages[inventoryTab]||0)+1;selectedItem=null;openInventory(api)});
  root.querySelectorAll('[data-phase24l-b3b-item]').forEach(button=>button.onclick=()=>{selectedItem=selectedItem===button.dataset.phase24lB3bItem?null:button.dataset.phase24lB3bItem;openInventory(api)});
  root.querySelector('[data-phase24l-b3b-detail-close]')?.addEventListener('click',()=>{selectedItem=null;openInventory(api)});
  root.querySelector('[data-phase24l-b3b-route]')?.addEventListener('click',buttonEvent=>{
   const key=buttonEvent.currentTarget.dataset.phase24lB3bRoute,item=inventoryProjection(api)[inventoryTab].find(entry=>entry.key===key);
   if(item?.route)api.route(item.route);
  });
  return true;
 }

 function syncLegacyPanels(root,next,{focus=false}={}){
   if(!LEGACY_TABS.some(tab=>tab.id===next))next='tracks';
   legacyTab=next;
  const context=LEGACY_CONTEXT.get(root),panel=context?.panel;
  root.querySelectorAll('[data-phase24l-b3b-legacy-tab]').forEach(button=>{const active=button.dataset.phase24lB3bLegacyTab===next;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1});
  if(panel&&context){
   panel.dataset.phase24lB3bLegacyPanel=next;
   panel.setAttribute('aria-label',`${LEGACY_TABS.find(tab=>tab.id===next).label} Legacy`);
   panel.setAttribute('aria-labelledby',`phase24l-b3b-legacy-tab-${next}`);
   const nodes=context.groups[next];
   panel.replaceChildren(...nodes);
   if(!nodes.length)panel.append(element(root.ownerDocument,'div','phase24l-b3b-empty',{'data-phase24l-b3b-empty':'',text:context.empty[next]}));
   if(focus)panel.focus?.();
  }
  }

 function decorateLegacy(document,modal,api){
  if(!modal||modal.dataset.phase24lB3bDecorated==='true')return false;
  const continuing=modal.querySelector(':scope > [data-phase22b-legacy-category="continuing"],:scope > .phase-13-legacy-track');
  if(!continuing)return false;
  modal.dataset.phase24lB3bDecorated='true';
  modal.dataset.phase24lB3bModal='legacy';
  legacyDecorations++;
  const directCards=[...modal.querySelectorAll(':scope > section.card,:scope > .phase-13-legacy-track')];
  const groups={tracks:[],feats:[],ready:[],history:[]};
  for(const card of directCards){
   const category=card.dataset.phase22bLegacyCategory,state=card.dataset.phase22bLegacyState;
   if(category==='continuing'||card===continuing)groups.tracks.push(card);
   else if(category==='feat')groups.feats.push(card);
   else if(category==='claim'&&state==='ready')groups.ready.push(card);
   else if(category==='claim'&&state==='claimed')groups.history.push(card);
  }
  for(const card of directCards)card.remove();
  if(groups.ready.length)legacyTab='ready';
  const shell=element(document,'div','phase24l-b3b-legacy-shell',{'data-phase24l-b3b-legacy':'','data-phase24l-b3b-mechanics-changed':'false'});
  const scene=element(document,'section','phase24l-b3b-legacy-scene');
  scene.innerHTML='<div><div class="eyebrow">THE WAYSTONE REMEMBERS</div><h3>Legacy</h3><p>Continuing tracks, one-time feats, banked rewards, and exact receipts.</p></div><span aria-hidden="true">✦</span>';
  const tabs=element(document,'nav','phase24l-b3b-tabs phase24l-b3b-legacy-tabs',{role:'tablist','aria-label':'Legacy sections'});
  const tabButtons=[];
  for(const [index,tab] of LEGACY_TABS.entries()){
   const button=element(document,'button','',{type:'button',role:'tab',id:`phase24l-b3b-legacy-tab-${tab.id}`,'data-phase24l-b3b-legacy-tab':tab.id,'aria-selected':String(legacyTab===tab.id),'aria-controls':'phase24l-b3b-legacy-panel',tabindex:legacyTab===tab.id?'0':'-1'});
   button.innerHTML=`<i aria-hidden="true">${tab.icon}</i><span>${tab.label}</span>${tab.id==='ready'&&groups.ready.length?`<b>${groups.ready.length}</b>`:''}`;
   button.onclick=()=>syncLegacyPanels(shell,tab.id,{focus:true});
   button.onkeydown=event=>{
    const key=event.key;if(!['ArrowLeft','ArrowRight','Home','End'].includes(key))return;
    event.preventDefault();const nextIndex=key==='Home'?0:key==='End'?LEGACY_TABS.length-1:(index+(key==='ArrowRight'?1:-1)+LEGACY_TABS.length)%LEGACY_TABS.length;
    syncLegacyPanels(shell,LEGACY_TABS[nextIndex].id);tabButtons[nextIndex].focus();
   };
   tabButtons.push(button);
   tabs.append(button);
  }
  const empty={tracks:'No continuing Legacy track is available on this save.',feats:'No one-time feat is recorded yet.',ready:'No Legacy reward is waiting. Ready rewards never expire.',history:'Claim receipts will remain here after rewards are collected.'};
  const panel=element(document,'section','phase24l-b3b-legacy-panel',{'data-phase24l-b3b-legacy-panel':legacyTab,id:'phase24l-b3b-legacy-panel',role:'tabpanel',tabindex:'-1','aria-label':`${LEGACY_TABS.find(tab=>tab.id===legacyTab).label} Legacy`});
  LEGACY_CONTEXT.set(shell,{groups,panel,empty});
  const head=modal.querySelector(':scope > .modal-head');
  if(head)head.insertAdjacentElement('afterend',shell);else modal.prepend(shell);
  shell.append(scene,tabs,panel);
  for(const button of groups.ready.flatMap(card=>[...card.querySelectorAll('[data-phase13-claim]')])){
   const inherited=button.onclick;
   button.onclick=event=>{const result=inherited?.call(button,event);if(result?.ok===true)api.defer(()=>{if(document.querySelector('[data-phase24l-b3b-modal="legacy"]'))api.openLegacy()});return result};
  }
  syncLegacyPanels(shell,legacyTab);
  return true;
 }

 function decorateMore(document,api){
  const screen=document.querySelector('[data-phase24l-compact-screen="more"]');
  if(!screen||screen.querySelector('[data-phase24l-b3b-launches]'))return false;
  const stage=screen.querySelector('[data-phase24l-b3a-stage="more"]');
  if(!stage)return false;
  const launches=element(document,'div','phase24l-b3b-launches',{'data-phase24l-b3b-launches':'','aria-label':'Archive destinations'});
  const legacy=screen.querySelector('[data-phase13-legacy]');
  if(legacy){legacy.classList.add('phase24l-b3b-launch');legacy.setAttribute('aria-label','Open Legacy');launches.append(legacy)}
  const inventory=element(document,'button','btn phase24l-b3b-launch',{type:'button','data-phase24l-b3b-inventory-open':'',text:'INVENTORY'});
  inventory.onclick=()=>{compactLaunches++;openInventory(api)};
  launches.append(inventory);
  const pageHead=screen.querySelector(':scope > .page-head'),guide=pageHead?.querySelector('[data-phase24l-b3a-guide-open]');
  if(pageHead)pageHead.insertBefore(launches,guide||null);else stage.append(launches);
  return true;
 }

 function install(adapter){
  if(installed)return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:true,mechanicsChanged:false,saveChanged:false});
  if(!adapter||adapter.version!==1||!adapter.document||!adapter.slots||!adapter.api)return Object.freeze({ok:false,reason:'adapter'});
  const {document,slots,api}=adapter;
  if(typeof slots.bindCommon?.get!=='function'||typeof slots.bindCommon?.set!=='function'||typeof slots.bindModal?.get!=='function'||typeof slots.bindModal?.set!=='function')return Object.freeze({ok:false,reason:'slots'});
  for(const name of ['state','showModal','openLegacy','route','format','escape','defer','wideInventory','isFellowAvailable','requiredFellowRank'])if(typeof api[name]!=='function')return Object.freeze({ok:false,reason:`api.${name}`});
  if(!api.definitions||!Array.isArray(api.definitions.fellows)||!Array.isArray(api.definitions.family)||!Array.isArray(api.definitions.companions)||!Array.isArray(api.definitions.relics))return Object.freeze({ok:false,reason:'api.definitions'});

  const bindCommonBefore=slots.bindCommon.get();
  slots.bindCommon.set(function(...args){const result=bindCommonBefore(...args);decorateMore(document,api);return result});
  const bindModalBefore=slots.bindModal.get();
  slots.bindModal.set(function(...args){
   const result=bindModalBefore(...args);
   bindInventory(document,api);
   api.defer(()=>decorateLegacy(document,document.querySelector('[data-overlay] .modal'),api));
   return result;
  });
  document.addEventListener('keydown',event=>{
   if(event.key!=='Escape')return;
   const inventory=document.querySelector('[data-phase24l-b3b-inventory]');
   if(!inventory||selectedItem===null)return;
   event.preventDefault();event.stopImmediatePropagation();selectedItem=null;openInventory(api);
  },true);
  installed=true;
  return Object.freeze({ok:true,id:ID,version:VERSION,schemaVersion:SCHEMA_VERSION,reused:false,mechanicsChanged:false,saveChanged:false});
 }

 function diagnostics(){return Object.freeze({version:VERSION,id:ID,installed,legacyTab,inventoryTab,selectedItem,inventoryPages:{...inventoryPages},compactLaunches,inventoryViews,legacyDecorations,mechanicsChanged:false,saveChanged:false})}

 Object.defineProperty(globalThis,'EVERSTEAD_PHASE24L_LEGACY_INVENTORY',{configurable:false,enumerable:false,writable:false,value:Object.freeze({version:VERSION,id:ID,schemaVersion:SCHEMA_VERSION,install,diagnostics})});
})();
