(()=>{
  'use strict';

  const CHANNEL='everstead-phase-10b2-v1';
  const PROTOCOL='opaque-attested-v2';
  const CANDIDATE_SHA='faa5c5fb11785a620f51de5864ec4cda4433bfbc27faaa2359247d9b39c07e75';
  const CANDIDATE_BYTES=18928361;
  const REALM_ROW_COUNT=56;
  const SPECS=Object.freeze([
    Object.freeze({key:'320x568-normal',width:320,height:568,motion:'normal'}),
    Object.freeze({key:'320x568-reduced',width:320,height:568,motion:'reduced'}),
    Object.freeze({key:'390x844-normal',width:390,height:844,motion:'normal'}),
    Object.freeze({key:'390x844-reduced',width:390,height:844,motion:'reduced'})
  ]);
  const FETCH_SPECS=Object.freeze([
    Object.freeze({key:'artifact',path:'../../index.html',sha256:'717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed',byteLength:18916682}),
    Object.freeze({key:'scenarios',path:'scenarios.json',sha256:'d3dd215cbfd229d58ed4f7d5264a79cc64d3224860be430d324ec0b7d893a8dd',byteLength:126405}),
    Object.freeze({key:'registry',path:'row-registry.json',sha256:'9e6282b2374e7ec263c3e4c9cc64873458b6e74fc356c470aabe23aac6ca394e',byteLength:96921}),
    Object.freeze({key:'traces',path:'predecessor-traces.json',sha256:'74feec74ff6f9efe07ca47cb2b0fcaaca8ab80dab71961fd2f1625f270209136',byteLength:557500}),
    Object.freeze({key:'realmHtml',path:'realm.html',sha256:'04a059ebe1048112e48240de877c6dbb5d26b272bf44f809022c75be8f8a6342',byteLength:1696}),
    Object.freeze({key:'realmScript',path:'realm.js',sha256:'4fab0f3498f647920dc542e6573a4d55bf88a5dfed5778984caaf312c8799e60',byteLength:55924})
  ]);
  const button=document.getElementById('run');
  const tbody=document.getElementById('rows');
  const fatal=document.getElementById('fatal');
  const frames=document.getElementById('realms');
  const nativeFetch=window.fetch.bind(window);
  const nativeConsoleWarn=console.warn.bind(console);
  const nativeConsoleError=console.error.bind(console);
  let running=false;
  let runOrdinal=0;

  const metrics={
    storage:0,save:0,prohibited:0,allowedGets:[],requests:[],trapFailures:[],
    consoleWarnError:[],errors:[],frameCreated:0,frameRemoved:0
  };
  const resetMetrics=()=>{
    metrics.storage=0;metrics.save=0;metrics.prohibited=0;
    metrics.allowedGets.length=0;metrics.requests.length=0;
    metrics.consoleWarnError.length=0;metrics.errors.length=0;
    metrics.frameCreated=0;metrics.frameRemoved=0;
  };
  const noteTrapFailure=(name,error)=>metrics.trapFailures.push(`${name}: ${error?.message||error}`);
  const define=(object,key,descriptor,name=String(key))=>{
    try{Object.defineProperty(object,key,{configurable:true,...descriptor});return true}
    catch(error){noteTrapFailure(name,error);return false}
  };
  const blocked=name=>function(){metrics.prohibited++;throw new Error(`Phase 10B-2 runner prohibited ${name}`)};
  const storageBlocked=name=>function(){metrics.storage++;metrics.prohibited++;throw new Error(`Phase 10B-2 runner prohibited ${name}`)};
  const saveBlocked=name=>function(){metrics.save++;metrics.prohibited++;throw new Error(`Phase 10B-2 runner prohibited ${name}`)};
  const hex=bytes=>Array.from(new Uint8Array(bytes),value=>value.toString(16).padStart(2,'0')).join('');
  const hash=async bytes=>hex(await crypto.subtle.digest('SHA-256',bytes));

  function installPermanentGuards(){
    define(window,'localStorage',{get(){metrics.storage++;throw new Error('prohibited localStorage')}},'localStorage');
    define(window,'sessionStorage',{get(){metrics.storage++;throw new Error('prohibited sessionStorage')}},'sessionStorage');
    define(window,'indexedDB',{value:Object.freeze({open:storageBlocked('indexedDB.open'),deleteDatabase:storageBlocked('indexedDB.deleteDatabase'),databases:storageBlocked('indexedDB.databases')}),writable:false},'indexedDB');
    define(window,'caches',{value:Object.freeze({open:storageBlocked('caches.open'),delete:storageBlocked('caches.delete'),keys:storageBlocked('caches.keys'),match:storageBlocked('caches.match')}),writable:false},'CacheStorage');
    define(navigator,'serviceWorker',{value:Object.freeze({register:storageBlocked('serviceWorker.register'),getRegistration:storageBlocked('serviceWorker.getRegistration'),getRegistrations:storageBlocked('serviceWorker.getRegistrations'),get ready(){return storageBlocked('serviceWorker.ready')()}}),writable:false},'serviceWorker');
    define(navigator,'clipboard',{value:Object.freeze({read:saveBlocked('clipboard.read'),readText:saveBlocked('clipboard.readText'),write:saveBlocked('clipboard.write'),writeText:saveBlocked('clipboard.writeText')}),writable:false},'clipboard');
    define(navigator,'sendBeacon',{value:blocked('sendBeacon'),writable:false},'sendBeacon');
    define(window,'WebSocket',{value:blocked('WebSocket'),writable:false},'WebSocket');
    define(window,'EventSource',{value:blocked('EventSource'),writable:false},'EventSource');
    define(window,'XMLHttpRequest',{value:blocked('XMLHttpRequest'),writable:false},'XMLHttpRequest');
    define(window,'open',{value:blocked('window.open'),writable:false},'window.open');
    define(window,'showSaveFilePicker',{value:function(){metrics.save++;throw new Error('prohibited showSaveFilePicker')},writable:false},'showSaveFilePicker');
    if(window.HTMLAnchorElement?.prototype){
      const nativeClick=window.HTMLAnchorElement.prototype.click;
      define(window.HTMLAnchorElement.prototype,'click',{value:function(){
        if(this.hasAttribute('download')){metrics.save++;throw new Error('prohibited download')}
        return nativeClick.call(this);
      },writable:false},'HTMLAnchorElement.click');
    }else noteTrapFailure('HTMLAnchorElement.click','prototype unavailable');
    try{
      Object.defineProperty(document,'cookie',{configurable:true,get(){metrics.storage++;metrics.prohibited++;throw new Error('prohibited cookie read')},set(){metrics.storage++;metrics.prohibited++;throw new Error('prohibited cookie write')}});
    }catch(error){noteTrapFailure('document.cookie',error)}
    define(window,'fetch',{value:guardedFetch,writable:false},'fetch');
  }

  async function guardedFetch(input,init={}){
    const url=new URL(input instanceof Request?input.url:String(input),location.href);
    const spec=FETCH_SPECS.find(item=>new URL(item.path,location.href).href===url.href);
    const method=String(init.method||(input instanceof Request?input.method:'GET')).toUpperCase();
    const credentials=init.credentials||(input instanceof Request?input.credentials:'same-origin');
    const cache=init.cache||(input instanceof Request?input.cache:'default');
    const redirect=init.redirect||(input instanceof Request?input.redirect:'follow');
    const referrerPolicy=init.referrerPolicy||(input instanceof Request?input.referrerPolicy:'');
    const headers=new Headers(init.headers||(input instanceof Request?input.headers:undefined));
    metrics.requests.push({url:url.href,key:spec?.key||null,method,credentials,cache,redirect,referrerPolicy,cookie:headers.has('cookie')});
    if(url.origin!==location.origin||!spec||url.search||url.hash||method!=='GET'||credentials!=='omit'||cache!=='no-store'||redirect!=='error'||referrerPolicy!=='no-referrer'||headers.has('cookie')){
      metrics.prohibited++;
      throw new Error(`runner immutable GET allowlist refusal: ${url.href}`);
    }
    const response=await nativeFetch(url,{method:'GET',credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',headers});
    if(!response.ok)throw new Error(`GET ${spec.key} ${response.status}`);
    metrics.allowedGets.push({key:spec.key,credentials:'omit',cookieSent:false,setCookieAccepted:false});
    return response;
  }

  console.warn=(...args)=>{metrics.consoleWarnError.push({level:'warn',message:args.map(String).join(' ')});nativeConsoleWarn(...args)};
  console.error=(...args)=>{metrics.consoleWarnError.push({level:'error',message:args.map(String).join(' ')});nativeConsoleError(...args)};
  addEventListener('error',event=>metrics.errors.push({type:'error',message:String(event.error?.stack||event.message||event.error)}));
  addEventListener('unhandledrejection',event=>metrics.errors.push({type:'unhandledrejection',message:String(event.reason?.stack||event.reason)}));
  installPermanentGuards();

  function render(rows,mode=null){
    tbody.textContent='';
    for(const row of rows){
      const tr=document.createElement('tr');
      for(const value of [row.id,row.status,row.evidence]){
        const td=document.createElement('td');td.textContent=String(value);td.className=row.status.toLowerCase();tr.append(td);
      }
      tbody.append(tr);
    }
    const count=status=>rows.filter(row=>row.status===status).length;
    document.getElementById('total').textContent=String(rows.length);
    document.getElementById('passed').textContent=String(count('PASS'));
    document.getElementById('pending').textContent=String(count('PENDING'));
    document.getElementById('failed').textContent=String(count('FAIL'));
    window.__EVERSTEAD_PHASE_10B2_RESULT__=Object.freeze({
      total:rows.length,passed:count('PASS'),pending:count('PENDING'),failed:count('FAIL'),
      fatal:fatal.textContent,mode,runOrdinal,rows:structuredClone(rows),metrics:structuredClone(metrics)
    });
  }

  async function loadRealmBundle(){
    const responses=await Promise.all(FETCH_SPECS.map(spec=>fetch(spec.path,{method:'GET',credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer'})));
    const buffers=await Promise.all(responses.map(response=>response.arrayBuffer()));
    const identities=await Promise.all(buffers.map(async(buffer,index)=>Object.freeze({key:FETCH_SPECS[index].key,sha256:await hash(buffer),byteLength:buffer.byteLength})));
    for(let index=0;index<FETCH_SPECS.length;index++){
      const expected=FETCH_SPECS[index],observed=identities[index];
      const candidateArtifact=expected.key==='artifact'&&/^[0-9a-f]{64}$/.test(CANDIDATE_SHA)&&observed.sha256===CANDIDATE_SHA&&observed.byteLength===CANDIDATE_BYTES;
      if(!candidateArtifact&&(observed.sha256!==expected.sha256||observed.byteLength!==expected.byteLength))throw new Error(`runner authority identity mismatch: ${expected.key} ${observed.sha256}/${observed.byteLength}`);
    }
    const byKey=Object.fromEntries(FETCH_SPECS.map((spec,index)=>[spec.key,buffers[index]]));
    const html=new TextDecoder().decode(byKey.realmHtml),script=new TextDecoder().decode(byKey.realmScript);
    if((html.match(/<script src="realm\.js"><\/script>/g)||[]).length!==1)throw new Error('realm.html script anchor is not exact-once');
    if(!script.includes("const CHANNEL='everstead-phase-10b2-v1'"))throw new Error('realm.js channel anchor missing');
    const safeScript=script.replace(/<\/script/gi,'<\\/script');
    const srcdoc=html.replace('<script src="realm.js"></script>',`<script>${safeScript}<\/script>`);
    const payload=Object.freeze({artifact:byKey.artifact,scenarios:byKey.scenarios,registry:byKey.registry,traces:byKey.traces});
    const attestation=Object.freeze({protocol:PROTOCOL,identities:Object.freeze(Object.fromEntries(identities.map(item=>[item.key,item])))});
    return Object.freeze({srcdoc,payload,attestation});
  }

  function executeRealm(spec,bundle,token){
    return new Promise((resolve,reject)=>{
      const frame=document.createElement('iframe');
      let settled=false,initialized=false;
      const timeout=setTimeout(()=>finish(new Error(`${spec.key} timed out`)),120000);
      const finish=(error,value)=>{
        if(settled)return;settled=true;clearTimeout(timeout);removeEventListener('message',onMessage);
        frame.remove();metrics.frameRemoved++;
        error?reject(error):resolve(value);
      };
      const onMessage=event=>{
        const data=event.data;
        if(event.origin!=='null'||event.source!==frame.contentWindow||data?.channel!==CHANNEL||data?.token!==token||data?.key!==spec.key)return;
        if(data.type==='phase10b2-realm-fatal')return finish(new Error(`${spec.key}: ${data.error}`));
        if(data.type==='phase10b2-realm-ready'){
          if(initialized||data.protocol!==PROTOCOL)return finish(new Error(`${spec.key}: invalid opaque-realm readiness`));
          initialized=true;
          frame.contentWindow.postMessage({channel:CHANNEL,type:'phase10b2-realm-init',key:spec.key,token,protocol:PROTOCOL,attestation:bundle.attestation,payload:bundle.payload},'*');
          return;
        }
        if(data.type!=='phase10b2-realm')return;
        if(!initialized)return finish(new Error(`${spec.key}: result before attested payload`));
        if(!Array.isArray(data.rows)||data.rows.length!==REALM_ROW_COUNT)return finish(new Error(`${spec.key}: expected ${REALM_ROW_COUNT} rows`));
        finish(null,data);
      };
      addEventListener('message',onMessage);
      frame.title=`Phase 10B-2 ${spec.key}`;
      frame.width=spec.width;frame.height=spec.height;
      frame.style.width=`${spec.width}px`;frame.style.height=`${spec.height}px`;
      frame.sandbox='allow-scripts';frame.referrerPolicy='no-referrer';
      frame.name=JSON.stringify({...spec,token,channel:CHANNEL,protocol:PROTOCOL,parentOrigin:location.origin,realmHtml:bundle.attestation.identities.realmHtml,realmScript:bundle.attestation.identities.realmScript});
      frame.srcdoc=bundle.srcdoc;
      metrics.frameCreated++;
      frames.append(frame);
    });
  }

  const countStatus=(rows,status)=>rows.filter(row=>row.status===status).length;
  const realmMetricClean=value=>{
    const m=value.metrics;
    return Boolean(m)&&m.storage===0&&m.save===0&&m.prohibited===0&&m.trapFailures.length===0&&
      m.consoleWarnError.length===0&&m.errors.length===0&&m.allowedGets.length===0&&m.requests.length===0&&m.payloadMessages===1&&m.payloadAttested===true&&
      m.nestedStorage===0&&m.nestedSave===0&&m.nestedNetwork===0&&m.nestedUi===0&&m.nestedTimer===0&&m.renderCount===2&&
      (value.mode==='preimage'?m.nestedRealms===0&&m.nestedListeners===0:m.nestedRealms===3&&m.nestedListeners===6);
  };
  const exactRealmCounts=value=>value.mode==='preimage'
    ?countStatus(value.rows,'PASS')===20&&countStatus(value.rows,'PENDING')===36&&countStatus(value.rows,'FAIL')===0
    :value.mode==='candidate'&&countStatus(value.rows,'PASS')===56&&countStatus(value.rows,'PENDING')===0&&countStatus(value.rows,'FAIL')===0;

  async function run(){
    if(running)return;
    running=true;button.disabled=true;fatal.textContent='';runOrdinal++;resetMetrics();
    const received=[];
    try{
      const bundle=await loadRealmBundle();
      for(const spec of SPECS){
        const token=`${runOrdinal}:${spec.key}:${crypto.randomUUID()}`;
        received.push(await executeRealm(spec,bundle,token));
      }
      const realmRows=received.flatMap(value=>value.rows);
      const rowIds=realmRows.map(row=>row.id);
      const modes=new Set(received.map(value=>value.mode));
      const identities=new Set(received.map(value=>`${value.artifactSha}:${value.artifactBytes}`));
      const exactGetEvidence=metrics.allowedGets.length===6&&metrics.requests.length===6&&FETCH_SPECS.every(spec=>metrics.allowedGets.some(item=>item.key===spec.key&&item.credentials==='omit'&&!item.cookieSent&&!item.setCookieAccepted))&&metrics.requests.every(item=>item.method==='GET'&&item.credentials==='omit'&&item.cache==='no-store'&&item.redirect==='error'&&item.referrerPolicy==='no-referrer'&&!item.cookie);
      const runnerRows=[
        {id:'runner-dashboard-identity',status:SPECS.length===4&&REALM_ROW_COUNT===56&&exactGetEvidence?'PASS':'FAIL',evidence:`4 opaque realms × 56 rows; ${metrics.allowedGets.length}/6 immutable runner GETs`},
        {id:'runner-realms-complete',status:received.length===4&&received.every(exactRealmCounts)?'PASS':'FAIL',evidence:`${received.length}/4 disposable realms completed with exact mode totals`},
        {id:'runner-row-registry',status:realmRows.length===224&&new Set(rowIds).size===224?'PASS':'FAIL',evidence:`${realmRows.length} realm rows; ${new Set(rowIds).size} unique`},
        {id:'runner-isolation-lifecycle',status:received.every((value,index)=>realmMetricClean(value)&&value.viewport?.width===SPECS[index].width&&value.viewport?.height===SPECS[index].height&&value.viewport?.motion===SPECS[index].motion&&value.attestation?.protocol===PROTOCOL&&value.attestation?.realmHtml?.sha256===bundle.attestation.identities.realmHtml.sha256&&value.attestation?.realmScript?.sha256===bundle.attestation.identities.realmScript.sha256)&&modes.size===1&&identities.size===1&&metrics.frameCreated===4&&metrics.frameRemoved===4&&frames.children.length===0&&metrics.storage===0&&metrics.save===0&&metrics.prohibited===0&&metrics.trapFailures.length===0&&metrics.consoleWarnError.length===0&&metrics.errors.length===0?'PASS':'FAIL',evidence:`mode=${[...modes].join(',')}; artifact=${[...identities].join(',')}; frames ${metrics.frameCreated}/${metrics.frameRemoved}/0 retained; runner/realm traps clean`}
      ];
      const rows=[...runnerRows,...realmRows];
      if(rows.length!==228||new Set(rows.map(row=>row.id)).size!==228)throw new Error('dashboard row topology drift');
      render(rows,[...modes][0]||null);
    }catch(error){
      fatal.textContent=String(error?.stack||error);
      render([{id:'runner-fatal',status:'FAIL',evidence:fatal.textContent}],null);
    }finally{
      button.disabled=false;running=false;
    }
  }

  button.disabled=true;
  button.addEventListener('click',run);
  addEventListener('load',()=>setTimeout(run,250),{once:true});
})();
