(()=>{
  'use strict';
  const CHANNEL='everstead-phase-20-21-independent',byId=id=>document.getElementById(id),escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  const row=(id,pass,detail='')=>({id,actual:Boolean(pass),expected:true,pass:Boolean(pass),detail});
  async function loadJson(source){const response=await fetch(source,{cache:'no-store'});if(!response.ok)throw new Error(`${source}: HTTP ${response.status}`);return response.json()}
  function realm(fixtures,viewport){return new Promise((resolve,reject)=>{
    const nonce=crypto.randomUUID(),frame=document.createElement('iframe'),config={channel:CHANNEL,nonce,viewport,fixtures};frame.name=JSON.stringify(config);frame.style.cssText=`position:absolute;left:-20000px;top:0;width:${viewport.width}px;height:${viewport.height}px;border:0`;
    let timer;const finish=(error,value)=>{clearTimeout(timer);removeEventListener('message',receive);frame.remove();error?reject(error):resolve(value)};
    const receive=event=>{if(event.source!==frame.contentWindow||event.data?.channel!==CHANNEL||event.data?.nonce!==nonce)return;const rows=(event.data.results||[]).map(item=>({...item,id:`${viewport.id}-${item.id}`}));if(event.data.errors?.length&&!rows.some(item=>item.id.endsWith('zero-warning-error-console')&&!item.pass))rows.push(row(`${viewport.id}-captured-errors`,false,event.data.errors.join('\n')));finish(null,rows)};
    timer=setTimeout(()=>finish(new Error(`${viewport.id} timed out`)),180000);addEventListener('message',receive);frame.src=`./realm.html?qa=1&nonce=${encodeURIComponent(nonce)}`;document.body.appendChild(frame);
  })}
  function render(mode,rows){const passed=rows.filter(item=>item.pass).length,failed=rows.length-passed;byId('mode').textContent=mode;byId('total').textContent=rows.length;byId('passed').textContent=passed;byId('failed').textContent=failed;byId('results').innerHTML=rows.map(item=>`<article class="result"><code>${escapeHtml(item.id)} · observed ${item.actual?'true':'false'} · expected true${item.detail?` · ${escapeHtml(item.detail)}`:''}</code><b class="${item.pass?'pass':'fail'}">${item.pass?'PASS':'FAIL'}</b></article>`).join('');window.__EVERSTEAD_PHASE_20_21_INDEPENDENT_RESULT__={mode,passed,failed,total:rows.length,results:rows}}
  async function run(){byId('run').disabled=true;byId('fatal').textContent='';try{
    const f=await loadJson('./fixtures/contract-fixtures.json'),rows=[],unique=values=>new Set(values).size===values.length;
    rows.push(row('fixture-contract-v1',f.contractVersion===1&&f.bridgeVersion==='phase-20-21-independent-qa-v1'));
    rows.push(row('fixture-exact-base',f.baseCommit==='fa004195a36dcbcd5be4ad9d73357a63cf50f3f7'));
    rows.push(row('fixture-eight-facilities-two-phases',f.facilities.length===8&&f.facilities.filter(item=>item.phase===20).length===4&&f.facilities.filter(item=>item.phase===21).length===4&&unique(f.facilities.map(item=>item.facilityId))));
    rows.push(row('fixture-eight-distinct-activities-finalizers',unique(f.facilities.map(item=>item.activityId))&&unique(f.facilities.map(item=>item.opportunityId))&&unique(f.facilities.map(item=>item.finalizerId))));
    rows.push(row('fixture-original-four-expansion-four',f.originalPassiveFacilityIds.length===4&&f.expansionFacilityIds.length===4&&f.facilities.filter(item=>item.phase===20).every(item=>item.passivePolicy.includes('preserve-existing'))&&f.facilities.filter(item=>item.phase===21).every(item=>item.passivePolicy==='opportunity-only-acceleration')));
    rows.push(row('fixture-content-distinct',Object.keys(f.activityContent).length===8&&Object.values(f.activityContent).every(item=>item.templateIds.length===3&&item.choiceCount>=3&&item.outcomeIds.length>=1)));
    rows.push(row('fixture-tutorial-cast-coverage',f.tutorialIds.length===19&&f.phase20_21ActorIds.length===28&&f.allRosterActorIds.length===38&&f.hookCount===45&&unique(f.tutorialIds)&&unique(f.allRosterActorIds)));
    rows.push(row('fixture-qa-policy-isolated',f.syntheticPolicy.qaOnly===true&&f.syntheticPolicy.requiresIsolatedStorage===true&&f.syntheticPolicy.neverProductionFallback===true&&unique(Object.values(f.syntheticPolicy.intervalMsByFacility))));
    rows.push(row('fixture-risk-matrices',Object.keys(f.saveFixtures).length===21&&f.concurrencyKinds.length===21&&f.invalidMutationKinds.length===29&&f.forbiddenSystems.length===17));
    rows.push(row('fixture-five-browser-realms',f.viewports.length===5&&f.viewports.some(item=>item.width===320&&item.height===568)&&f.viewports.some(item=>item.width===1024)&&f.viewports.some(item=>item.copyScale===1.3)&&f.viewports.some(item=>item.reducedMotion)));
    for(const viewport of f.viewports)rows.push(...await realm(f,viewport));render('CANDIDATE',rows);
  }catch(error){byId('fatal').textContent=error.stack||error.message;render('FATAL',[row('runner-fatal',false,error.stack||error.message)])}finally{byId('run').disabled=false}}
  byId('run').onclick=run;run();
})();
