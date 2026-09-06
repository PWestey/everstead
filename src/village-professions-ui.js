/* Scene-led Village workshops. The adapter owns all persisted changes. */
(function(g){'use strict';g.installProfessionsUI=function(A){
 const E=g.EVERSTEAD_PROFESSIONS,esc=A.escape;
 let place='command',tab='work',selected='',message='';
 const titles={command:'Build a lasting home',archives:'Beyond the known roads',training:'Practice becomes strength',apothecary:'A shelf of small wonders',market:'Made in Everstead',gatehouse:'The roads bring us together',forge:'Shape something enduring',waystone:'Light the heart of the Village'};
 const names={well:'Village Well',roads:'Trade Roads',hall:'Council Hall',glow:'Glow Tonic',calm:'Calm Draught',mend:'Mending Balm',tools:'Tool Bundle',cloth:'Woven Cloth',lantern:'Road Lantern',blade:'Workshop Blade',shield:'Village Shield',charm:'Runic Charm',base:'Foundation',runes:'Runic Ring',beacon:'Crystal Beacon',river:'River Crossing',ridge:'High Ridge',forest:'Old Forest'};
 const symbols={well:'◉',roads:'⌁',hall:'⚑',glow:'☀',calm:'☾',mend:'❧',tools:'⚒',cloth:'▧',lantern:'✧',blade:'⚔',shield:'⬡',charm:'✦',base:'▱',runes:'◎',beacon:'◆',river:'≋',ridge:'△',forest:'♧'};
 const guides={command:'Unpack civic supplies, then invest in the Well, Roads or Hall. Each project has a different balance of permanent earnings and Fellow Power. Choose what your Village needs.',archives:'Unpack map fragments and restore the nine pieces of a lost map. Complete the illustrated map, then archive it to earn permanent Power and earnings. A new map awaits after each collection.',training:'Choose an owned Fellow. Practice Strength, Guard and Focus, then promote them after completing one of each. Promotion adds 25 permanent Power to that Fellow; it does not spend EXP or change their rank.',apothecary:'Unpack ingredients, brew bottles for your shelf, then deliver the requested remedy. Bottles stay until used. Each patient served adds 3 permanent Power per owned Fellow and 12 Gold/hr. These are fantasy remedies.',market:'Turn supply deliveries into tools, cloth and lanterns. Keep finished goods in stock and fulfill the next order. Each completed order adds 3 permanent Power per owned Fellow and 15 Gold/hr.',gatehouse:'Pack provisions and dispatch a caravan. Longer routes give larger permanent rewards. Return to receive its cargo after the journey; it will never expire. One caravan travels at a time.',forge:'Unpack ore to forge a Blade, Shield and Charm, then refine your workshop collection. Each has a different earnings/Power balance. These are communal workshop bonuses, not items replacing equipped Relics.',waystone:'Unpack stone shards and restore the Foundation, Runic Ring and Beacon. Every component level grants 6 Power per owned Fellow and 12 Gold/hr. Raising all three to the next tier adds another 30 Power and 50 Gold/hr.'};
 const btn=(a,i,body)=>`<button data-vp-action="${i}" ${a.disabled?'disabled':''}>${body||esc(a.label)}</button>`;
 function render(){
  const people=A.fellows();if(!people.some(f=>f.id===selected))selected=people[0]?.id||'';
  const s=E.status(A.state().villageProfessions,place,A.now(),selected);if(!s)return;
  const active=s.actions.map((a,i)=>({...a,i})),d=s.state,fellow=people.find(f=>f.id===selected),legacy=A.state().villageActivities?.facilities[place];
  let body='',art='',heading=titles[place];
  const stock=`${s.stock} ${s.resource.toLowerCase()}`;
  if(!s.tutorial||tab==='guide'){
   body=`<h3>${esc(heading)}</h3><p>${guides[place]}</p><p>Supplies and drills bank up to 24, one every 30 minutes. All progress is saved. Permanent bonuses add once; they never multiply already-boosted totals.</p><button data-vp-guide>${s.tutorial?'RETURN TO WORK':'LET’S BEGIN'}</button>`;
  }else if(tab==='supplies'){
   heading=place==='training'?'Time to practice':'Your deliveries are waiting';
   const gather=active.find(a=>a.action==='gather');
   body=`<h3>${s.bank}/24 ${place==='training'?'drills':'supply deliveries'} waiting</h3><p>${place==='training'?'Choose a Fellow on the Work tab to use these drills.':`In storage: ${stock}. Unpack one delivery to receive 3 materials. Materials are local to this building.`}</p>${gather?btn(gather,gather.i,`UNPACK · +3 ${esc(s.resource.toUpperCase())}`):''}<p>Next arrival: ${s.bank===24?'bank full':`${Math.max(1,Math.ceil((s.nextOpportunityAt-A.now())/60000))} minutes`}. Opportunities bank while you are away; they do not expire.</p><button data-vp-refresh>CHECK DELIVERIES</button>`;
  }else if(tab==='record'){
   body=`<h3>${esc(s.progress)}</h3><div class="vp-records">${s.details.map(t=>`<p>${esc(t)}</p>`).join('')}</div><p>All eight workshops combined:<br>+${s.bonuses.power} Power${fellow?` for ${esc(fellow.name)}`:' per Fellow'} · +${s.bonuses.earnings} Gold/hr</p>${legacy?.active||legacy?.pending?'<button data-vp-legacy>FINISH PREVIOUS ACTIVITY / REWARD</button>':''}${A.state().villageActivities?.training?'<button data-vp-training>SPEND PREVIOUS TRAINING POINTS</button>':''}`;
  }else if(place==='archives'){
   art='<div class="vp-map-compass">✥</div>';
   body=`<div class="vp-map" aria-label="Restore a nine-piece map">${active.filter(a=>a.action==='reveal').map(a=>{const revealed=d.tiles.includes(a.input.tile);return btn(a,a.i,`<span class="vp-tile ${revealed?'restored':''}">${revealed?['♧','△','♧','≋','⌂','≋','♧','⌁','◆'][a.input.tile]:'✧'}</span><small>${revealed?'Restored':'1 fragment'}</small>`)}).join('')}</div>${active.filter(a=>a.action==='collect').map(a=>btn(a,a.i)).join('')}<p>${esc(s.progress)}</p>`;
  }else if(place==='training'){
   const m=d.fellows[selected]||{strength:0,guard:0,focus:0,mastery:0};
   art=fellow?`<img class="vp-fellow" src="${esc(fellow.portrait)}" alt="${esc(fellow.name)}">`:'';
   body=`<label>Fellow<select data-vp-fellow>${people.map(f=>`<option value="${esc(f.id)}" ${selected===f.id?'selected':''}>${esc(f.name)}</option>`).join('')}</select></label><div class="vp-cards">${active.filter(a=>a.action==='drill').map(a=>btn({...a,disabled:a.disabled||!selected},a.i,`<i>${{strength:'⚔',guard:'⬡',focus:'◎'}[a.input.track]}</i><b>${a.input.track}</b><small>${m[a.input.track]-m.mastery} ready</small>`)).join('')}</div>${active.filter(a=>a.action==='promote').map(a=>btn({...a,disabled:a.disabled||!selected},a.i,'PROMOTE · +25 POWER')).join('')}<p>Mastery ${m.mastery} · One of each drill per promotion.</p>`;
  }else if(['apothecary','market'].includes(place)){
   const making=active.filter(a=>['brew','craft'].includes(a.action));
   body=`<div class="vp-request"><small>${place==='apothecary'?'PATIENT':'ORDER'} ${d.delivered+1}</small><b>${esc(names[d.request])}</b>${active.filter(a=>['deliver','fulfill'].includes(a.action)).map(a=>btn(a,a.i,'DELIVER & GROW')).join('')}</div><div class="vp-cards">${making.map(a=>{const k=a.input.recipe||a.input.item;return btn(a,a.i,`<i>${symbols[k]}</i><b>${names[k]}</b><small>${d.inventory[k]} stocked<br>${place==='apothecary'?'Brew':'Craft'} · 3 materials</small>`)}).join('')}</div><p>${d.delivered} ${place==='apothecary'?'patients served':'orders fulfilled'} · Finished goods never expire.</p>`;
  }else if(place==='gatehouse'){
   art='<div class="vp-road"><span>⌂</span><i>♧</i><span>△</span></div>';
   if(d.active)body=`<h3>${esc(names[d.active.route])}</h3><div class="vp-route-progress"><span style="width:${Math.min(100,100*(A.now()-d.active.startedAt)/(d.active.readyAt-d.active.startedAt))}%"></span></div><p>${d.remainingMs?`Returning in ${Math.ceil(d.remainingMs/1000)} seconds`:'Your caravan has returned. Cargo is waiting.'}</p>${active.filter(a=>a.action==='claim').map(a=>btn(a,a.i)).join('')}<button data-vp-refresh>CHECK ROAD</button>`;
   else body=`<h3>Choose a road</h3><div class="vp-cards">${active.filter(a=>a.action==='dispatch').map((a,n)=>btn(a,a.i,`<i>${symbols[a.input.route]}</i><b>${names[a.input.route]}</b><small>${[1,3,5][n]} min · 3 provisions<br>+${[8,16,24][n]} Power<br>+${[25,50,75][n]} Gold/hr</small>`)).join('')}</div><p>${d.claimed} caravans received. Longer routes yield more.</p>`;
  }else{
   const options=active.filter(a=>a.action!=='gather'),kind=place==='command'?'project':place==='forge'?'gear':'component';
   body=`<div class="vp-cards">${options.map(a=>{const k=a.input[kind],v=d[k];return btn(a,a.i,`<i>${symbols[k]}</i><b>${names[k]}</b><small>Level ${v} → ${v+1}<br>${place==='command'?3:3*(v+1)} materials</small>`)}).join('')}</div><p>${esc(s.progress)}</p><p>${place==='waystone'?'Complete a tier on all three components to awaken a milestone.':place==='forge'?'Forge your first piece, then refine its permanent workshop bonus.':'The Well favors earnings; the Hall favors Power; Roads improve both.'}</p>`;
  }
  if(!art)art=`<div class="vp-emblem" aria-hidden="true">${s.icon}</div>`;
  const tabs=['work','supplies','record','guide'];
  A.showModal(`<section class="vp-sheet" data-vp-place="${place}" style="--vp-accent:${s.color}"><header><div><small>EVERSTEAD · VILLAGE LIFE</small><h2>${esc(s.name)}</h2></div><button data-vp-close aria-label="Close ${esc(s.name)}">×</button></header><div class="vp-scene">${art}<span>${esc(heading)}</span></div><div class="vp-stock">${place==='training'?`${s.bank} drills waiting`:esc(stock)}</div><main>${message?`<p class="vp-message" role="status">${esc(message)}</p>`:''}${body}${s.tutorial&&tab==='work'&&place!=='training'?'<button class="vp-supply-link" data-vp-tab="supplies">＋ OPEN SUPPLIES</button>':''}</main><footer>${tabs.map(t=>`<button data-vp-tab="${t}" aria-pressed="${tab===t}">${{work:'⚒ Work',supplies:'▣ Supplies',record:'✧ Progress',guide:'? Guide'}[t]}</button>`).join('')}</footer></section>`);
  const root=document.querySelector('.vp-sheet');
  root.querySelector('[data-vp-close]').onclick=A.close;
  root.querySelectorAll('[data-vp-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.vpTab;message='';render()});
  root.querySelector('[data-vp-fellow]')?.addEventListener('change',e=>{selected=e.target.value;message='';render()});
  root.querySelector('[data-vp-refresh]')?.addEventListener('click',()=>{message='';render()});
  root.querySelector('[data-vp-legacy]')?.addEventListener('click',()=>A.legacy(place));
  root.querySelector('[data-vp-training]')?.addEventListener('click',()=>A.legacy(place,'training'));
  root.querySelector('[data-vp-guide]')?.addEventListener('click',()=>{const result=A.act(place,'guide',{});message=result.ok?'':result.reason;tab='work';render()});
  root.querySelectorAll('[data-vp-action]').forEach(b=>b.onclick=()=>{const a=active[Number(b.dataset.vpAction)];const result=A.act(place,a.action,a.input);message=result.ok?result.message:result.reason;render()});
 }
 return id=>{if(!E.definitions[id])return;place=id;tab='work';message='';render()};
};})(globalThis);
