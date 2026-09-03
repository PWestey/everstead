(()=>{
  'use strict';
  const json=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
  function installRuntime(config){
    const slots=new Map(),writes=[],errors=[],nativeStorageAccesses=[],nativeSetTimeout=setTimeout.bind(window),nativeClearTimeout=clearTimeout.bind(window);let saveIndex=0,transactionIndex=0,nativeStorageInstrumented=false;
    window.matchMedia=query=>({matches:false,media:query,onchange:null,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},dispatchEvent(){return false}});
    try{const nativeStorage=window.localStorage;for(const name of ['getItem','setItem','removeItem']){const original=Storage.prototype[name];Storage.prototype[name]=function(...args){if(this===nativeStorage)nativeStorageAccesses.push(`${name}:${String(args[0])}`);return original.apply(this,args)}}nativeStorageInstrumented=true}catch{}
    addEventListener('error',event=>{const target=event.target;if(target&&target!==window&&(target.src||target.href)){if(target.matches?.('img[data-roster-art],img[data-village-cutout],[data-phase23-companion-full-art],[data-phase23-companion-thumb]'))return;errors.push(`asset-error ${target.src||target.href}`)}else errors.push(String(event.error?.stack||event.message))},true);
    addEventListener('unhandledrejection',event=>errors.push(String(event.reason?.stack||event.reason)));
    const warn=console.warn.bind(console),error=console.error.bind(console);console.warn=(...args)=>{errors.push('console.warn '+args.join(' '));warn(...args)};console.error=(...args)=>{errors.push('console.error '+args.join(' '));error(...args)};
    const memoryStorage={getItem:key=>slots.get(String(key))??null,setItem:(key,value)=>{key=String(key);writes.push({op:'set',key,value:String(value)});slots.set(key,String(value))},removeItem:key=>{key=String(key);writes.push({op:'remove',key});slots.delete(key)}};
    Object.assign(window,{__P24A_CONFIG__:config,__P24A_WRITES__:writes,__P24A_ERRORS__:errors,__P24A_NATIVE_ACCESSES__:nativeStorageAccesses,__P24A_NATIVE_INSTRUMENTED__:nativeStorageInstrumented});
    window.__EVERSTEAD_RUNTIME__={storage:memoryStorage,clock:{now:()=>config.recipes.frozenNow,setTimeout:nativeSetTimeout,clearTimeout:nativeClearTimeout},random:()=>.999,confirm:()=>true,ids:{save:()=>`save-p24a-${++saveIndex}`,transaction:()=>`tx-p24a-${++transactionIndex}`},qa:{allowDestructive:true,isolatedStorage:true}};
  }
  function captureSuite(){
    const config=window.__P24A_CONFIG__,errors=window.__P24A_ERRORS__,bridge=()=>window.__EVERSTEAD_PHASE_23_QA__,send=value=>parent.postMessage({channel:config.channel,nonce:config.nonce,...value},'*');
    const unwrap=(label,operation)=>{try{return operation()}catch(error){errors.push(`${label}: ${error.stack||error.message}`);return null}};
    (async()=>{
      await new Promise(resolve=>setTimeout(resolve,900));
      const qa=bridge(),scaling=window.EVERSTEAD_PHASE24_SCALING;
      if(!qa||qa.version!=='phase-23-independent-qa-v1')throw new Error('Trusted Phase 23 QA bridge is unavailable');
      if(!scaling||scaling.version<1)throw new Error('Versioned Phase 24 scaling authority is unavailable');
      const beforeSnapshot=unwrap('snapshot-before',()=>qa.read.snapshot()),beforeRaw=unwrap('raw-before',()=>qa.read.raw()),writesBefore=window.__P24A_WRITES__.length;
      const definitions=unwrap('scalingDefinitions',()=>qa.read.scalingDefinitions()),profiles=config.recipes.profiles.map(recipe=>unwrap(`scalingReport:${recipe.id}`,()=>qa.read.scalingReport(recipe.id)));
      if(profiles.some(value=>value===null))throw new Error('One or more Phase 24A profiles failed to evaluate');
      const afterSnapshot=unwrap('snapshot-after',()=>qa.read.snapshot()),afterRaw=unwrap('raw-after',()=>qa.read.raw()),writesAfter=window.__P24A_WRITES__.length,neutrality={stateUnchanged:JSON.stringify(beforeSnapshot?.state)===JSON.stringify(afterSnapshot?.state),rawUnchanged:beforeRaw===afterRaw,writesBefore,writesAfter,zeroReportWrites:writesAfter===writesBefore};
      if(!neutrality.stateUnchanged||!neutrality.rawUnchanged||!neutrality.zeroReportWrites)throw new Error(`Phase 24A report calls changed gameplay authority: ${JSON.stringify(neutrality)}`);
      if(!window.__P24A_NATIVE_INSTRUMENTED__)throw new Error('Native Web Storage was not instrumented');
      if(window.__P24A_NATIVE_ACCESSES__.length)throw new Error('Phase 24A capture accessed native Web Storage');
      send({definitions,profiles,productionSources:scaling.productionSources||null,neutrality,nativeStorageAccesses:window.__P24A_NATIVE_ACCESSES__.slice(),errors:errors.slice()});
    })().catch(error=>{errors.push(String(error.stack||error.message));send({definitions:null,profiles:[],productionSources:null,neutrality:null,nativeStorageAccesses:window.__P24A_NATIVE_ACCESSES__.slice(),errors:errors.slice()})});
  }
  let nonce='unknown';(async()=>{const config=JSON.parse(window.name);nonce=config.nonce;window.name='';const response=await fetch('../../index.html',{cache:'no-store'});if(!response.ok)throw new Error(`index.html: HTTP ${response.status}`);let source=await response.text();source=source.replace('<head>','<head><base href="../../">');const insertion=source.indexOf('<script'),bodyClose=source.lastIndexOf('</body>');if(insertion<0||bodyClose<0)throw new Error('Production document script boundary is unavailable');source=source.slice(0,insertion)+`<script>(${installRuntime.toString()})(${json(config)})<\/script>`+source.slice(insertion,bodyClose)+`<script>(${captureSuite.toString()})()<\/script>`+source.slice(bodyClose);document.open();document.write(source);document.close()})().catch(error=>parent.postMessage({channel:'everstead-phase-24a-balance-report-v1',nonce,definitions:null,profiles:[],productionSources:null,neutrality:null,nativeStorageAccesses:[],errors:[String(error.stack||error.message)]},'*'));
})();
