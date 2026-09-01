(() => {
  'use strict';
  const CHANNEL='everstead-phase-16-independent',byId=id=>document.getElementById(id);
  const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const row=(id,actual,detail='')=>({id,actual:Boolean(actual),expected:true,pass:Boolean(actual),detail:String(detail)});
  async function loadJson(path){const response=await fetch(path,{cache:'no-store'});if(!response.ok)throw new Error(`${path}: HTTP ${response.status}`);return response.json()}
  function realm(fixtures,viewport){return new Promise((resolve,reject)=>{
    const nonce=crypto.randomUUID(),frame=document.createElement('iframe'),config={channel:CHANNEL,nonce,viewport,fixtures};frame.name=JSON.stringify(config);frame.style.cssText=`position:absolute;left:-20000px;top:0;width:${viewport.width}px;height:${viewport.height}px;border:0`;
    let timer;const finish=(error,value)=>{clearTimeout(timer);removeEventListener('message',receive);frame.remove();error?reject(error):resolve(value)};
    const receive=event=>{if(event.source!==frame.contentWindow||event.data?.channel!==CHANNEL||event.data?.nonce!==nonce)return;const rows=(event.data.results||[]).map(item=>({...item,id:`${viewport.id}-${item.id}`}));if(event.data.errors?.length&&!rows.some(item=>item.id.endsWith('zero-warning-error-console')&&!item.pass))rows.push(row(`${viewport.id}-captured-errors`,false,event.data.errors.join('\n')));finish(null,rows)};
    timer=setTimeout(()=>finish(new Error(`${viewport.id} timed out`)),180000);addEventListener('message',receive);frame.src=`./realm.html?qa=1&nonce=${encodeURIComponent(nonce)}`;document.body.appendChild(frame);
  })}
  function render(mode,rows){const passed=rows.filter(item=>item.pass).length,failed=rows.length-passed;byId('mode').textContent=mode;byId('total').textContent=rows.length;byId('passed').textContent=passed;byId('failed').textContent=failed;byId('results').innerHTML=rows.map(item=>`<article class="result"><code>${escapeHtml(item.id)} · observed ${item.actual?'true':'false'} · expected true${item.detail?` · ${escapeHtml(item.detail)}`:''}</code><b class="${item.pass?'pass':'fail'}">${item.pass?'PASS':'FAIL'}</b></article>`).join('');window.__EVERSTEAD_PHASE_16_INDEPENDENT_RESULT__={mode,passed,failed,total:rows.length,results:rows}}
  async function run(){byId('run').disabled=true;byId('fatal').textContent='';try{
    const f=await loadJson('./fixtures/contract-fixtures.json'),rows=[],unique=values=>new Set(values).size===values.length;
    rows.push(row('fixture-contract-v1',f.contractVersion===1&&f.bridgeVersion==='phase-16-independent-qa-v1'));
    rows.push(row('fixture-exact-base',f.baseCommit==='8d356b7a1bb4922a354ec7bc93f8e6587c8b9514'));
    rows.push(row('fixture-restaurant-physical-anchor',f.facilityId==='facility.restaurant'&&f.physicalMapAnchor==='western-plaza-restaurant'));
    rows.push(row('fixture-definition-identities',f.customerIds.length===3&&f.preferenceIds.length===3&&f.recipeIds.length===3&&f.stationIds.length===2&&[...f.customerIds,...f.preferenceIds,...f.recipeIds,...f.stationIds].every(Boolean)));
    rows.push(row('fixture-seven-tutorials-seven-cast',f.tutorialIds.length===7&&f.actorIds.length===7&&unique(f.tutorialIds)&&unique(f.actorIds)));
    rows.push(row('fixture-save-matrix',Object.keys(f.saveFixtures).length===15&&unique(Object.values(f.saveFixtures))));
    rows.push(row('fixture-policy-driven-economy',f.economyRequiredPaths.length>=15&&f.economyProfiles.length===5&&f.economyHorizons.length===2&&f.syntheticPolicy.qaOnly===true));
    rows.push(row('fixture-v2-archive',f.archivePolicy.recentReceiptLimit===512&&f.archivePolicy.foldBatchSize===128));
    rows.push(row('fixture-fourteen-design-fixtures',f.fixtureIds.length===14&&unique(f.fixtureIds)));
    rows.push(row('fixture-five-browser-realms',f.viewports.length===5&&f.viewports.some(item=>item.width===320&&item.height===568)&&f.viewports.some(item=>item.width===1024)&&f.viewports.some(item=>item.reducedMotion)&&f.viewports.some(item=>item.copyScale===1.75)));
    for(const viewport of f.viewports)rows.push(...await realm(f,viewport));render('CANDIDATE',rows);
  }catch(error){byId('fatal').textContent=error.stack||error.message;render('FATAL',[row('runner-fatal',false,error.stack||error.message)])}finally{byId('run').disabled=false}}
  byId('run').onclick=run;run();
})();
