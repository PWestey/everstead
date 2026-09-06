/* Compact Village activities. Persistence and rewards belong exclusively to the adapter. */
(()=>{
 'use strict';
 const PLACES={
  command:{name:'Command Center',icon:'⚑',color:'#755237',x:17,y:30},
  archives:{name:'Archives',icon:'✧',color:'#596a93',x:83,y:30},
  training:{name:'Training Grounds',icon:'⚔',color:'#8e583d',x:17,y:64},
  hearth:{name:'Hearth',icon:'♥',color:'#a15f68',x:83,y:64},
  restaurant:{name:'Restaurant',icon:'♨',color:'#a66b3c',x:17,y:43},
  apothecary:{name:'Apothecary',icon:'⚗',color:'#77709b',x:83,y:43},
  school:{name:'Schoolhouse',icon:'✎',color:'#568484',x:63,y:43},
  market:{name:'Market',icon:'⚖',color:'#917c3f',x:37,y:43},
  gatehouse:{name:'Gatehouse',icon:'⌂',color:'#726047',x:50,y:77},
  gardens:{name:'Gardens',icon:'❧',color:'#588151',x:63,y:64},
  forge:{name:'Forge',icon:'⚒',color:'#965a41',x:37,y:64},
  fishing:{name:'Fishing Pond',icon:'♒',color:'#508996',x:8,y:54},
  waystone:{name:'Waystone',icon:'◆',color:'#638ea3',x:50,y:54}
 };
 function install(adapter){
  const {document,engine}=adapter;
  const esc=adapter.escape||((v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
  const fmt=adapter.format||((v)=>Number(v||0).toLocaleString());
  let current='command',tab='activity',page=0,message='',selectedFellow='',busy=false;
  const now=()=>adapter.now?.()??Date.now();
  function preview(id=current){
   const state=adapter.state(),root=state.villageActivities||state;
   const settled=engine.settle(root,now());
   if(!settled.ok)throw new Error('Village activities could not be loaded safely.');
   const data=settled.root,f=data.facilities[id],definition=engine.definitions[id];
   const scenarioIndex=f.active?.scenario??(f.pending?f.cursor-1:f.cursor)%definition.scenarios.length;
   return {...f,root:data,definition,waiting:f.bank,scenario:definition.scenarios[scenarioIndex]};
  }
  function perform(action,payload){
   if(busy)return;
   busy=true;
   try{
    const result=adapter.act(current,action,payload);
    message=result?.ok===false?(result.reason||result.error?.message||'That action is not available right now.'):(result?.message||'');
   }catch(error){message=error?.message||'Unable to save. Please try again.';}
   finally{busy=false;page=0;render();}
  }
  function chooseButtons(choices){
   const size=3,total=Math.max(1,Math.ceil(choices.length/size));
   page=Math.max(0,Math.min(page,total-1));
   const list=choices.slice(page*size,page*size+size).map(choice=>`<button type="button" class="va-choice" data-va-choice="${esc(choice.id)}"><span aria-hidden="true">›</span><span><b>${esc(choice.label)}</b>${choice.hint?`<small>${esc(choice.hint)}</small>`:''}</span></button>`).join('');
   return `<div class="va-choices">${list}</div>${total>1?`<div class="va-page"><button type="button" data-va-page="-1" ${page===0?'disabled':''} aria-label="Previous choices">←</button><span>${page+1} / ${total}</span><button type="button" data-va-page="1" ${page===total-1?'disabled':''} aria-label="Next choices">→</button></div>`:''}`;
  }
  function renderActivity(p){
   if(!p.tutorial)return `<div class="va-kicker">Your first visit</div><h3>${esc(p.definition.activity)}</h3><p>${esc(p.definition.tutorial)}</p><p>Finish the activity, then claim Gold and Village Training points. Spend points on a Fellow’s permanent Mastery Power.</p><p>One opportunity arrives every 30 minutes; up to 12 wait for you. Completed rewards never expire.</p><button type="button" class="va-primary" data-va-action="tutorial">GOT IT · LET’S BEGIN</button>`;
   if(p.pending)return `<div class="va-kicker">Work well done</div><h3>${esc(p.scenario.title)}</h3><div class="va-reward"><strong>✦ ${fmt(p.pending.training)}</strong><span>Village Training points</span><b>+${fmt(p.pending.gold)} Gold</b></div><p>Your reward is saved here until you claim it. Training points can improve any owned Fellow.</p><button type="button" class="va-primary va-claim" data-va-action="claim" data-va-claim="${esc(p.pending.id)}">CLAIM REWARDS</button>`;
   if(p.active){const step=p.scenario.steps[p.active.step],offset=(Object.keys(PLACES).indexOf(current)+p.completed+p.active.step)%step.options.length,options=[...step.options.slice(offset),...step.options.slice(0,offset)];return `<div class="va-kicker">${esc(p.scenario.title)} · ${p.active.step+1} / ${p.scenario.steps.length}</div><h3>${esc(step.prompt)}</h3>${chooseButtons(options)}`;}
   const cast=adapter.cast?.()||[],speaker=cast.length?cast[(Object.keys(PLACES).indexOf(current)+p.completed)%cast.length]:null;
   return `<div class="va-kicker">${esc(p.definition.activity)}</div><h3>${esc(p.scenario.title)}</h3><p>${esc(p.definition.tutorial)}</p>${speaker?`<div class="va-cast">${speaker.portrait?`<img src="${esc(speaker.portrait)}" alt="${esc(speaker.name)}">`:''}<small><b>${esc(speaker.name)}</b>${esc(speaker.quote||'A little shared work makes the whole Village stronger.')}</small></div>`:''}<p>Reward: ${fmt(p.definition.gold)} Gold + ${fmt(p.definition.training)} Training points</p><button type="button" class="va-primary" data-va-action="start" ${p.waiting<1?'disabled':''}>${p.waiting?'START ACTIVITY':'MORE OPPORTUNITIES ON THE WAY'}</button><p>Waiting: ${fmt(p.waiting)} / 12 · Your progress is saved between visits.</p>`;
  }
  function renderTraining(p){
   const fellows=adapter.fellows?.()||[];
   if(!fellows.some(f=>f.id===selectedFellow))selectedFellow=fellows[0]?.id||'';
   const fellow=fellows.find(f=>f.id===selectedFellow),mastery=p.root.mastery[selectedFellow]||{level:0,power:0},cost=engine.trainingCost(mastery.level),gain=engine.trainingGain;
   return `<div class="va-kicker">Village Training · ${fmt(p.root.training)} points available</div><h3>Choose who grows stronger</h3>${fellows.length?`<label for="va-fellow">Fellow</label><select class="va-select" id="va-fellow" data-va-fellow>${fellows.map(f=>`<option value="${esc(f.id)}" ${f.id===selectedFellow?'selected':''}>${esc(f.name)}</option>`).join('')}</select><div class="va-reward"><strong>+${fmt(mastery.power)} → +${fmt(mastery.power+gain)}</strong><span>Permanent Village Mastery Power</span><b>Mastery ${fmt(mastery.level)} → ${fmt(mastery.level+1)}</b></div><p>Adds ${fmt(gain)} flat Power to ${esc(fellow.name)} after other bonuses. Separate from EXP; Fellow level stays unchanged.</p><button type="button" class="va-primary" data-va-train ${p.root.training<cost?'disabled':''}>TRAIN · ${fmt(cost)} POINTS</button>`:'<p>Recruit a Fellow first. Your Training points will wait here.</p>'}`;
  }
  function render(){
   const place=PLACES[current];if(!place)return;
   const p=preview();
   adapter.showModal(`<section class="va-sheet" data-va-sheet="${current}" style="--va-color:${place.color}"><header class="va-head"><div><small>EVERSTEAD · VILLAGE LIFE</small><h2 id="everstead-modal-title">${esc(place.name)}</h2></div><button type="button" class="va-close" data-modal-close aria-label="Close ${esc(place.name)}">×</button></header><div class="va-scene"><i aria-hidden="true">${place.icon}</i><div><h3>${tab==='training'?'Turn practice into Power':'A Village worth coming home to'}</h3><p>Passive Gold keeps flowing. Active work earns rewards you choose when to claim.</p></div></div><div class="va-stats"><span>Completed <b>${fmt(p.completed||0)}</b></span><span>Waiting <b>${fmt(p.waiting||0)}</b></span><span>Training <b>${fmt(p.root.training)}</b></span></div><div class="va-content" aria-live="polite">${message?`<p class="va-message" role="status">${esc(message)}</p>`:''}${tab==='training'?renderTraining(p):renderActivity(p)}</div><footer class="va-footer"><button type="button" data-va-tab="activity" aria-pressed="${tab==='activity'}">${place.icon} Activity</button><button type="button" data-va-tab="training" aria-pressed="${tab==='training'}">✦ Fellow Power</button>${adapter.openBuilding&&['command','archives','training','hearth'].includes(current)?'<button type="button" data-va-building>⌂ Building</button>':''}</footer></section>`);
   const root=document.querySelector('[data-va-sheet]');if(!root)return;
   root.dataset.vaMode=tab;
   root.querySelector('.va-close').onclick=()=>{adapter.closeModal();bind();};
   root.querySelectorAll('[data-va-tab]').forEach(button=>button.onclick=()=>{tab=button.dataset.vaTab;page=0;message='';render();});
   root.querySelectorAll('[data-va-page]').forEach(button=>button.onclick=()=>{page+=Number(button.dataset.vaPage);render();});
   root.querySelectorAll('[data-va-choice]').forEach(button=>button.onclick=()=>perform('choose',{choice:button.dataset.vaChoice}));
   root.querySelectorAll('[data-va-action]').forEach(button=>button.onclick=()=>perform(button.dataset.vaAction,button.dataset.vaClaim?{claimId:button.dataset.vaClaim}:{}));
   root.querySelector('[data-va-building]')?.addEventListener('click',()=>adapter.openBuilding(current));
   root.querySelector('[data-va-fellow]')?.addEventListener('change',event=>{selectedFellow=event.target.value;render();});
   root.querySelector('[data-va-train]')?.addEventListener('click',()=>{
    if(busy)return;busy=true;
    try{const result=adapter.train(selectedFellow);message=result?.ok===false?(result.reason||result.error?.message||'Training is not available.'):'Village Mastery improved.';}
    catch(error){message=error?.message||'Unable to save training.';}
    finally{busy=false;render();}
   });
   const heading=root.querySelector('.va-content h3');
   if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
  }
  function open(id){if(!PLACES[id])return;current=id;tab='activity';page=0;message='';render();}
  function bind(){
   const map=document.querySelector('.village-map');if(!map)return;
   map.classList.add('va-enabled');
   for(const [id,place]of Object.entries(PLACES)){
    let button=map.querySelector(`[data-va-open="${id}"]`);
    if(!button){button=document.createElement('button');button.type='button';button.className='va-map-entrance';button.dataset.vaOpen=id;button.style.cssText=`--va-x:${place.x}%;--va-y:${place.y}%;--va-color:${place.color}`;map.append(button);}
    const p=adapter.placeStatus?.(id)||preview(id);const ready=!!p.pending;
    button.dataset.ready=String(ready);
    button.innerHTML=`<span aria-hidden="true">${place.icon}</span><b>${esc(place.name)}</b>${ready?'<small>✦</small>':p.waiting?`<small>${fmt(p.waiting)}</small>`:''}`;
    button.setAttribute('aria-label',`${place.name}: ${ready?'reward ready':`${p.waiting||0} opportunities waiting`}`);
    button.onclick=()=>adapter.openPlace?adapter.openPlace(id):open(id);
   }
  }
  return Object.freeze({bind,open});
 }
 globalThis.EVERSTEAD_VILLAGE_ACTIVITIES_UI=Object.freeze({install});
})();
