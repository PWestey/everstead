(() => {
  'use strict';
  const CHANNEL='everstead-gate-0c',byId=id=>document.getElementById(id);
  const escapeHtml=value=>String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const bytesToHex=bytes=>[...new Uint8Array(bytes)].map(value=>value.toString(16).padStart(2,'0')).join('');
  const sha256=async bytes=>bytesToHex(await crypto.subtle.digest('SHA-256',bytes));
  async function fetchBytes(path){const response=await fetch(path,{cache:'no-store'});if(!response.ok)throw new Error(`${path}: HTTP ${response.status}`);return new Uint8Array(await response.arrayBuffer())}
  const decode=bytes=>new TextDecoder('utf-8',{fatal:true}).decode(bytes),result=(id,pass,detail='')=>({id,pass:Boolean(pass),detail:String(detail)});

  async function loadContract(){
    const manifestBytes=await fetchBytes('./current-manifest.json'),manifest=JSON.parse(decode(manifestBytes));
    const scenarioBytes=await fetchBytes('../../'+manifest.scenarios.path),scenarioHash=await sha256(scenarioBytes);
    if(scenarioHash!==manifest.scenarios.sha256)throw new Error('Scenario checksum mismatch; execution aborted');
    const staticResults=[result('scenario-checksum-before-execution',true,scenarioHash)];
    for(const[path,expected]of Object.entries(manifest.historicalFiles||{})){const bytes=await fetchBytes('../../'+path),hash=await sha256(bytes);staticResults.push(result(`historical-${path.replaceAll('/','-')}`,hash===expected,hash))}
    if(staticResults.some(item=>!item.pass))throw new Error('Frozen historical checksum mismatch; execution aborted');
    const artifactBytes=await fetchBytes('../../'+manifest.artifact.path),artifactHash=await sha256(artifactBytes);
    if(artifactHash!==manifest.artifact.sha256||artifactBytes.byteLength!==manifest.artifact.byteLength)throw new Error('Current artifact checksum mismatch; execution aborted');
    staticResults.push(result('current-artifact-checksum-before-execution',true,artifactHash));
    const currentBytes=await fetchBytes('../gate-0b/fixtures/current-v1.txt'),currentRaw=decode(currentBytes),scenarios=JSON.parse(decode(scenarioBytes));
    return{manifest,scenarios,currentRaw,staticResults};
  }

  function executeRealm(contract,viewport,mode,search='?qa=1'){
    return new Promise((resolve,reject)=>{
      const nonce=crypto.randomUUID(),frame=document.createElement('iframe'),state=JSON.parse(contract.currentRaw),now=Date.parse(contract.scenarios.frozenNow);
      state.pendingGold=0;state.lastGoldAt=now-7_200_000;state.lastSeen=state.lastGoldAt;
      if(mode==='disabled'){state.currentWall='story-1';state.resolve['story-1']=.07;state.operation={ids:['cael','lyra','orin'],startedAt:now-700_000,endAt:now-1}}
      const features=mode==='disabled'?Object.fromEntries(Object.keys(contract.scenarios.defaultFeatures).map(key=>[key,false])):undefined;
      const config={nonce,mode,expectBridge:search.includes('qa=1'),viewport,now,features,keys:contract.scenarios.storageKeys,randomSequence:Array.from({length:64},(_,index)=>contract.scenarios.randomSequence[index%contract.scenarios.randomSequence.length]),slots:{[contract.scenarios.storageKeys.active]:JSON.stringify(state)}};
      frame.name=JSON.stringify(config);frame.setAttribute('sandbox','allow-scripts allow-same-origin');frame.style.cssText=`position:absolute;left:-20000px;top:0;width:${viewport.width}px;height:${viewport.height}px;border:0`;
      const finish=(error,value)=>{clearTimeout(timeout);window.removeEventListener('message',onMessage);frame.remove();error?reject(error):resolve(value)},onMessage=event=>{if(event.source!==frame.contentWindow||event.data?.channel!==CHANNEL||event.data?.nonce!==nonce)return;const prefixed=event.data.results.map(item=>({...item,id:`${viewport.id}-${mode}-${item.id}`}));if(event.data.errors?.length)prefixed.push(result(`${viewport.id}-${mode}-captured-errors`,false,event.data.errors.join('\n')));finish(null,prefixed)},timeout=setTimeout(()=>finish(new Error(`${viewport.id}/${mode} realm timed out`)),30000);
      window.addEventListener('message',onMessage);frame.src=`./realm.html${search}&nonce=${encodeURIComponent(nonce)}`;document.body.appendChild(frame);
    })
  }

  function render(results){const passed=results.filter(item=>item.pass).length,failed=results.length-passed;byId('total').textContent=results.length;byId('passed').textContent=passed;byId('failed').textContent=failed;byId('results').innerHTML=results.map(item=>`<article class="result"><code>${escapeHtml(item.id)}</code><span>${escapeHtml(item.detail)}</span><b class="status ${item.pass?'pass':'fail'}">${item.pass?'PASS':'FAIL'}</b></article>`).join('');window.__EVERSTEAD_GATE_0C_RESULT__={passed,failed,total:results.length,results}}
  async function run(){byId('run').disabled=true;byId('fatal').textContent='';try{const contract=await loadContract(),results=[...contract.staticResults];for(const viewport of contract.scenarios.viewports){results.push(...await executeRealm(contract,viewport,'default'));results.push(...await executeRealm(contract,viewport,'disabled'))}results.push(...await executeRealm(contract,contract.scenarios.viewports[0],'encoded-negative','?qa=%31'));render(results)}catch(error){byId('fatal').textContent=error.stack||error.message;render([result('runner-fatal',false,error.stack||error.message)])}finally{byId('run').disabled=false}}
  byId('run').onclick=run;run();
})();
