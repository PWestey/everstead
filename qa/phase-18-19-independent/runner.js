(() => {
  'use strict';
  const CHANNEL='everstead-phase-18-19-independent',byId=id=>document.getElementById(id);
  const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const row=(id,actual,detail='')=>({id,actual:Boolean(actual),expected:true,pass:Boolean(actual),detail:String(detail)});
  async function loadJson(source){const response=await fetch(source,{cache:'no-store'});if(!response.ok)throw new Error(`${source}: HTTP ${response.status}`);return response.json()}
  function realm(fixtures,viewport){return new Promise((resolve,reject)=>{
    const nonce=crypto.randomUUID(),frame=document.createElement('iframe'),config={channel:CHANNEL,nonce,viewport,fixtures};frame.name=JSON.stringify(config);frame.style.cssText=`position:absolute;left:-20000px;top:0;width:${viewport.width}px;height:${viewport.height}px;border:0`;
    let timer;const finish=(error,value)=>{clearTimeout(timer);removeEventListener('message',receive);frame.remove();error?reject(error):resolve(value)};
    const receive=event=>{if(event.source!==frame.contentWindow||event.data?.channel!==CHANNEL||event.data?.nonce!==nonce)return;const rows=(event.data.results||[]).map(item=>({...item,id:`${viewport.id}-${item.id}`}));if(event.data.errors?.length&&!rows.some(item=>item.id.endsWith('zero-warning-error-console')&&!item.pass))rows.push(row(`${viewport.id}-captured-errors`,false,event.data.errors.join('\n')));finish(null,rows)};
    timer=setTimeout(()=>finish(new Error(`${viewport.id} timed out`)),180000);addEventListener('message',receive);frame.src=`./realm.html?qa=1&nonce=${encodeURIComponent(nonce)}`;document.body.appendChild(frame);
  })}
  function render(mode,rows){const passed=rows.filter(item=>item.pass).length,failed=rows.length-passed;byId('mode').textContent=mode;byId('total').textContent=rows.length;byId('passed').textContent=passed;byId('failed').textContent=failed;byId('results').innerHTML=rows.map(item=>`<article class="result"><code>${escapeHtml(item.id)} · observed ${item.actual?'true':'false'} · expected true${item.detail?` · ${escapeHtml(item.detail)}`:''}</code><b class="${item.pass?'pass':'fail'}">${item.pass?'PASS':'FAIL'}</b></article>`).join('');window.__EVERSTEAD_PHASE_18_19_INDEPENDENT_RESULT__={mode,passed,failed,total:rows.length,results:rows}}
  async function run(){byId('run').disabled=true;byId('fatal').textContent='';try{
    const f=await loadJson('./fixtures/contract-fixtures.json'),rows=[],unique=values=>new Set(values).size===values.length;
    rows.push(row('fixture-contract-v1',f.contractVersion===1&&f.bridgeVersion==='phase-18-19-independent-qa-v1'));
    rows.push(row('fixture-exact-base',f.baseCommit==='70201ab52e6e3510747bee1a977794a8c900bdd1'));
    rows.push(row('fixture-two-distinct-facilities',f.facilities.apothecary.facilityId==='facility.apothecary'&&f.facilities.schoolhouse.facilityId==='facility.schoolhouse'&&f.facilities.apothecary.activityId!==f.facilities.schoolhouse.activityId));
    rows.push(row('fixture-domain-cardinality',f.apothecary.caseIds.length===3&&f.apothecary.clueIds.length===9&&f.apothecary.diagnosisIds.length===3&&f.apothecary.remedyIds.length===4&&f.schoolhouse.pupilIds.length===3&&f.schoolhouse.lessonIds.length===3&&f.schoolhouse.approachIds.length===3));
    rows.push(row('fixture-graduation-v2-finalizers',f.finalizers.length===3&&unique(f.finalizers.map(item=>`${item.sourceId}:${item.domainClaimKind}`))&&f.schoolhouse.graduationDomainClaimKind==='schoolhouse-graduation'));
    rows.push(row('fixture-nine-tutorials-ten-actors',f.tutorialIds.length===9&&f.actorIds.length===10&&unique(f.tutorialIds)&&unique(f.actorIds)&&f.facilityActorIds['facility.apothecary'].length===6&&f.facilityActorIds['facility.schoolhouse'].length===5));
    rows.push(row('fixture-qa-policy-isolated',f.syntheticPolicy.qaOnly===true&&f.syntheticPolicy.requiresIsolatedStorage===true&&f.syntheticPolicy.neverProductionFallback===true));
    rows.push(row('fixture-save-invalid-concurrency-matrices',Object.keys(f.saveFixtures).length===24&&f.invalidMutationChecks.length===16&&f.concurrencyKinds.length===8&&unique(Object.values(f.saveFixtures))));
    rows.push(row('fixture-v2-archive-and-passive-four',f.archivePolicy.recentReceiptLimit===512&&f.archivePolicy.foldBatchSize===128&&f.originalPassiveFacilityIds.length===4));
    rows.push(row('fixture-five-browser-realms',f.viewports.length===5&&f.viewports.some(item=>item.width===320&&item.height===568)&&f.viewports.some(item=>item.width===1024)&&f.viewports.some(item=>item.reducedMotion)&&f.viewports.some(item=>item.copyScale===1.3)));
    for(const viewport of f.viewports)rows.push(...await realm(f,viewport));render('PRIVATE RUNTIME',rows);
  }catch(error){byId('fatal').textContent=error.stack||error.message;render('FATAL',[row('runner-fatal',false,error.stack||error.message)])}finally{byId('run').disabled=false}}
  byId('run').onclick=run;run();
})();
