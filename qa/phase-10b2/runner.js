(()=>{
  'use strict';

  const CHANNEL='everstead-phase-10b2-v1';
  const REALM_ROW_COUNT=56;
  const SPECS=Object.freeze([
    Object.freeze({key:'320x568-normal',width:320,height:568,motion:'normal'}),
    Object.freeze({key:'320x568-reduced',width:320,height:568,motion:'reduced'}),
    Object.freeze({key:'390x844-normal',width:390,height:844,motion:'normal'}),
    Object.freeze({key:'390x844-reduced',width:390,height:844,motion:'reduced'})
  ]);
  const REALM_FILES=Object.freeze(['realm.html','realm.js']);
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
  const storageTrap=name=>Object.freeze({
    getItem(){metrics.storage++;throw new Error(`prohibited ${name}.getItem`)},
    setItem(){metrics.storage++;throw new Error(`prohibited ${name}.setItem`)},
    removeItem(){metrics.storage++;throw new Error(`prohibited ${name}.removeItem`)},
    clear(){metrics.storage++;throw new Error(`prohibited ${name}.clear`)},
    key(){metrics.storage++;throw new Error(`prohibited ${name}.key`)},
    get length(){metrics.storage++;throw new Error(`prohibited ${name}.length`)}
  });

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
    const relative=url.pathname.slice(url.pathname.lastIndexOf('/')+1);
    const file=REALM_FILES.find(name=>url.pathname.endsWith('/qa/phase-10b2/'+name));
    const method=String(init.method||(input instanceof Request?input.method:'GET')).toUpperCase();
    const credentials=init.credentials||(input instanceof Request?input.credentials:'same-origin');
    const cache=init.cache||(input instanceof Request?input.cache:'default');
    const redirect=init.redirect||(input instanceof Request?input.redirect:'follow');
    const referrerPolicy=init.referrerPolicy||(input instanceof Request?input.referrerPolicy:'');
    const headers=new Headers(init.headers||(input instanceof Request?input.headers:undefined));
    metrics.requests.push({url:url.href,file:file||relative,method,credentials,cache,redirect,referrerPolicy,cookie:headers.has('cookie')});
    if(url.origin!==location.origin||!file||url.search||url.hash||method!=='GET'||credentials!=='omit'||cache!=='no-store'||redirect!=='error'||referrerPolicy!=='no-referrer'||headers.has('cookie')){
      metrics.prohibited++;
      throw new Error(`runner immutable GET allowlist refusal: ${url.href}`);
    }
    const response=await nativeFetch(url,{method:'GET',credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',headers});
    if(!response.ok)throw new Error(`GET ${file} ${response.status}`);
    metrics.allowedGets.push({file,credentials:'omit',cookieSent:false,setCookieAccepted:false});
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

  async function loadRealmSources(){
    const responses=await Promise.all(REALM_FILES.map(file=>fetch(file,{method:'GET',credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer'})));
    const [html,script]=await Promise.all(responses.map(response=>response.text()));
    if((html.match(/<script src="realm\.js"><\/script>/g)||[]).length!==1)throw new Error('realm.html script anchor is not exact-once');
    if(!script.includes("const CHANNEL='everstead-phase-10b2-v1'"))throw new Error('realm.js channel anchor missing');
    const safeScript=script.replace(/<\/script/gi,'<\\/script');
    return html.replace('<script src="realm.js"></script>',`<script>${safeScript}<\/script>`);
  }

  function executeRealm(spec,srcdoc,token){
    return new Promise((resolve,reject)=>{
      const frame=document.createElement('iframe');
      let settled=false;
      const timeout=setTimeout(()=>finish(new Error(`${spec.key} timed out`)),45000);
      const finish=(error,value)=>{
        if(settled)return;settled=true;clearTimeout(timeout);removeEventListener('message',onMessage);
        frame.remove();metrics.frameRemoved++;
        error?reject(error):resolve(value);
      };
      const onMessage=event=>{
        const data=event.data;
        if(event.origin!==location.origin||event.source!==frame.contentWindow||data?.channel!==CHANNEL||data?.token!==token||data?.key!==spec.key)return;
        if(data.type==='phase10b2-realm-fatal')return finish(new Error(`${spec.key}: ${data.error}`));
        if(data.type!=='phase10b2-realm')return;
        if(!Array.isArray(data.rows)||data.rows.length!==REALM_ROW_COUNT)return finish(new Error(`${spec.key}: expected ${REALM_ROW_COUNT} rows`));
        finish(null,data);
      };
      addEventListener('message',onMessage);
      frame.title=`Phase 10B-2 ${spec.key}`;
      frame.width=spec.width;frame.height=spec.height;
      frame.style.width=`${spec.width}px`;frame.style.height=`${spec.height}px`;
      frame.sandbox='allow-scripts allow-same-origin';frame.referrerPolicy='no-referrer';
      frame.name=JSON.stringify({...spec,token,channel:CHANNEL});
      frame.srcdoc=srcdoc;
      metrics.frameCreated++;
      frames.append(frame);
    });
  }

  const countStatus=(rows,status)=>rows.filter(row=>row.status===status).length;
  const realmMetricClean=value=>{
    const m=value.metrics;
    return Boolean(m)&&m.storage===0&&m.save===0&&m.prohibited===0&&m.trapFailures.length===0&&
      m.consoleWarnError.length===0&&m.errors.length===0&&m.allowedGets.length===4&&m.requests.length===4&&
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
      const srcdoc=await loadRealmSources();
      for(const spec of SPECS){
        const token=`${runOrdinal}:${spec.key}:${crypto.randomUUID()}`;
        received.push(await executeRealm(spec,srcdoc,token));
      }
      const realmRows=received.flatMap(value=>value.rows);
      const rowIds=realmRows.map(row=>row.id);
      const modes=new Set(received.map(value=>value.mode));
      const identities=new Set(received.map(value=>`${value.artifactSha}:${value.artifactBytes}`));
      const exactGetEvidence=metrics.allowedGets.length===2&&metrics.requests.length===2&&REALM_FILES.every(file=>metrics.allowedGets.some(item=>item.file===file));
      const runnerRows=[
        {id:'runner-dashboard-identity',status:SPECS.length===4&&REALM_ROW_COUNT===56&&exactGetEvidence?'PASS':'FAIL',evidence:`4 realms × 56 rows; ${metrics.allowedGets.length}/2 immutable runner GETs`},
        {id:'runner-realms-complete',status:received.length===4&&received.every(exactRealmCounts)?'PASS':'FAIL',evidence:`${received.length}/4 disposable realms completed with exact mode totals`},
        {id:'runner-row-registry',status:realmRows.length===224&&new Set(rowIds).size===224?'PASS':'FAIL',evidence:`${realmRows.length} realm rows; ${new Set(rowIds).size} unique`},
        {id:'runner-isolation-lifecycle',status:received.every((value,index)=>realmMetricClean(value)&&value.viewport?.width===SPECS[index].width&&value.viewport?.height===SPECS[index].height&&value.viewport?.motion===SPECS[index].motion)&&modes.size===1&&identities.size===1&&metrics.frameCreated===4&&metrics.frameRemoved===4&&frames.children.length===0&&metrics.storage===0&&metrics.save===0&&metrics.prohibited===0&&metrics.trapFailures.length===0&&metrics.consoleWarnError.length===0&&metrics.errors.length===0?'PASS':'FAIL',evidence:`mode=${[...modes].join(',')}; artifact=${[...identities].join(',')}; frames ${metrics.frameCreated}/${metrics.frameRemoved}/0 retained; runner/realm traps clean`}
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
