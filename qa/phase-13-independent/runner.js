(() => {
  'use strict';
  const CHANNEL='everstead-phase-13-independent';
  const byId=id=>document.getElementById(id);
  const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const row=(id,actual,detail='')=>({id,actual:Boolean(actual),expected:true,pass:Boolean(actual),detail:String(detail)});
  async function loadJson(path){const response=await fetch(path,{cache:'no-store'});if(!response.ok)throw new Error(`${path}: HTTP ${response.status}`);return response.json()}
  function realm(fixtures,viewport){
    return new Promise((resolve,reject)=>{
      const nonce=crypto.randomUUID(),frame=document.createElement('iframe'),config={channel:CHANNEL,nonce,viewport,fixtures};
      frame.name=JSON.stringify(config);
      frame.style.cssText=`position:absolute;left:-20000px;top:0;width:${viewport.width}px;height:${viewport.height}px;border:0`;
      let timer;
      const finish=(error,value)=>{clearTimeout(timer);removeEventListener('message',receive);frame.remove();error?reject(error):resolve(value)};
      const receive=event=>{
        if(event.source!==frame.contentWindow||event.data?.channel!==CHANNEL||event.data?.nonce!==nonce)return;
        const rows=(event.data.results||[]).map(item=>({...item,id:`${viewport.id}-${item.id}`}));
        if(event.data.errors?.length&&!rows.some(item=>item.id.endsWith('zero-warning-error-console')&&!item.pass))rows.push(row(`${viewport.id}-captured-errors`,false,event.data.errors.join('\n')));
        finish(null,rows);
      };
      timer=setTimeout(()=>finish(new Error(`${viewport.id} timed out`)),180000);
      addEventListener('message',receive);
      frame.src=`./realm.html?qa=1&nonce=${encodeURIComponent(nonce)}`;
      document.body.appendChild(frame);
    });
  }
  function render(mode,rows){
    const passed=rows.filter(item=>item.pass).length,failed=rows.length-passed;
    byId('mode').textContent=mode;byId('total').textContent=rows.length;byId('passed').textContent=passed;byId('failed').textContent=failed;
    byId('results').innerHTML=rows.map(item=>`<article class="result"><code>${escapeHtml(item.id)} · observed ${item.actual?'true':'false'} · expected true${item.detail?` · ${escapeHtml(item.detail)}`:''}</code><b class="${item.pass?'pass':'fail'}">${item.pass?'PASS':'FAIL'}</b></article>`).join('');
    window.__EVERSTEAD_PHASE_13_INDEPENDENT_RESULT__={mode,passed,failed,total:rows.length,results:rows};
  }
  async function run(){
    byId('run').disabled=true;byId('fatal').textContent='';
    try{
      const fixtures=await loadJson('./fixtures/contract-fixtures.json'),rows=[];
      rows.push(row('fixture-contract-v1',fixtures.contractVersion===1&&fixtures.bridgeVersion==='phase-13-independent-qa-v1'));
      rows.push(row('fixture-five-scenes',fixtures.storyIds.length===5&&new Set(fixtures.storyIds).size===5));
      rows.push(row('fixture-rosters-18-and-20',fixtures.fellowIds.length===18&&fixtures.familyIds.length===20&&new Set([...fixtures.fellowIds,...fixtures.familyIds]).size===38));
      rows.push(row('fixture-tutorials-41-and-79',fixtures.phase13TutorialIds.length===41&&fixtures.allTutorialCoverageIds.length===79));
      rows.push(row('three-isolated-realms',fixtures.viewports.length===3&&fixtures.viewports.some(item=>item.reducedMotion)));
      for(const viewport of fixtures.viewports)rows.push(...await realm(fixtures,viewport));
      render('CANDIDATE',rows);
    }catch(error){
      byId('fatal').textContent=error.stack||error.message;render('FATAL',[row('runner-fatal',false,error.stack||error.message)]);
    }finally{byId('run').disabled=false}
  }
  byId('run').onclick=run;run();
})();
