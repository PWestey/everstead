(()=>{
  'use strict';

  const CHANNEL='everstead-phase-10b2-v1';
  const PREIMAGE_SHA='717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed';
  const PREIMAGE_BYTES=18916682;
  // Replaced with literal reviewed values when the executable candidate is frozen.
  const CANDIDATE_SHA='__PHASE_10B2_CANDIDATE_SHA256__';
  const CANDIDATE_BYTES=-1;
  const SCENARIO_SHA='d3dd215cbfd229d58ed4f7d5264a79cc64d3224860be430d324ec0b7d893a8dd';
  const SCENARIO_BYTES=126405;
  const REGISTRY_SHA='230ee234ecc5d13d5f8c834ee8df0542968c84e683f11a6a21b6a834d3b0c8da';
  const REGISTRY_BYTES=96777;
  const TRACE_SHA='74feec74ff6f9efe07ca47cb2b0fcaaca8ab80dab71961fd2f1625f270209136';
  const TRACE_BYTES=557500;
  const ASSET_SHA='26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a';
  const CORE_NAME='PHASE_TEN_B_TWO_GOLD_CORE';
  const BOOT='const report=load();render();installQaBridge();if(report)runtimeSetTimeout(()=>openOffline(report),250);';
  const METHODS=Object.freeze(['familyBuildingBonus','neutralHookBonus','buildingUpgradeCost','buildingRateComponents','durationGold','totalRate','offlineTotals']);
  const WRAPPERS=Object.freeze(['familyBuildingBonusComponents','economyHookBonus','buildingUpgradeCost','buildingRateComponents','totalRate','offlineClaimPreview']);
  const ALLOWED=Object.freeze(['../../index.html','scenarios.json','row-registry.json','predecessor-traces.json']);
  const EXPECTED_ALLOCATION=Object.freeze({family:6,neutral:2,upgrade:4,'building-rate':8,'duration-gold':4,'total-rate':3,'offline-totals':5});
  const NESTED_HOOK='__P10B2_BROWSER_PROBE__';
  const nativeFetch=window.fetch.bind(window);
  const nativeConsoleWarn=console.warn.bind(console);
  const nativeConsoleError=console.error.bind(console);
  const parentOrigin=new URL(document.baseURI).origin;
  let config;
  try{config=JSON.parse(window.name)}catch{config=null}
  if(!config||config.channel!==CHANNEL||typeof config.token!=='string'||!['normal','reduced'].includes(config.motion))throw new Error('invalid isolated realm configuration');
  const realmId=config.key;
  document.documentElement.dataset.motion=config.motion;

  const metrics={
    storage:0,save:0,prohibited:0,allowedGets:[],requests:[],trapFailures:[],consoleWarnError:[],errors:[],
    nestedStorage:0,nestedSave:0,nestedNetwork:0,nestedUi:0,nestedTimer:0,nestedListeners:0,nestedRealms:0,renderCount:0
  };
  const noteTrapFailure=(name,error)=>metrics.trapFailures.push(`${name}: ${error?.message||error}`);
  const define=(object,key,descriptor,name=String(key))=>{
    try{Object.defineProperty(object,key,{configurable:true,...descriptor});return true}
    catch(error){noteTrapFailure(name,error);return false}
  };
  const blocked=name=>function(){metrics.prohibited++;throw new Error(`Phase 10B-2 realm prohibited ${name}`)};
  const storageBlocked=name=>function(){metrics.storage++;metrics.prohibited++;throw new Error(`Phase 10B-2 realm prohibited ${name}`)};
  const saveBlocked=name=>function(){metrics.save++;metrics.prohibited++;throw new Error(`Phase 10B-2 realm prohibited ${name}`)};
  const count=(source,needle)=>source.split(needle).length-1;
  const own=(value,key)=>Object.prototype.hasOwnProperty.call(value,key);
  const hex=bytes=>Array.from(new Uint8Array(bytes),value=>value.toString(16).padStart(2,'0')).join('');
  const hash=async bytes=>hex(await crypto.subtle.digest('SHA-256',bytes));
  const exact=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));

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
    const url=new URL(input instanceof Request?input.url:String(input),document.baseURI);
    const path=ALLOWED.find(item=>new URL(item,document.baseURI).href===url.href);
    const method=String(init.method||(input instanceof Request?input.method:'GET')).toUpperCase();
    const credentials=init.credentials||(input instanceof Request?input.credentials:'same-origin');
    const cache=init.cache||(input instanceof Request?input.cache:'default');
    const redirect=init.redirect||(input instanceof Request?input.redirect:'follow');
    const referrerPolicy=init.referrerPolicy||(input instanceof Request?input.referrerPolicy:'');
    const headers=new Headers(init.headers||(input instanceof Request?input.headers:undefined));
    metrics.requests.push({url:url.href,path:path||null,method,credentials,cache,redirect,referrerPolicy,cookie:headers.has('cookie')});
    if(url.origin!==parentOrigin||!path||url.search||url.hash||method!=='GET'||credentials!=='omit'||cache!=='no-store'||redirect!=='error'||referrerPolicy!=='no-referrer'||headers.has('cookie')){
      metrics.prohibited++;
      throw new Error(`realm immutable GET allowlist refusal: ${url.href}`);
    }
    const response=await nativeFetch(url,{method:'GET',credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',headers});
    if(!response.ok)throw new Error(`GET ${path} ${response.status}`);
    metrics.allowedGets.push({path,credentials:'omit',cookieSent:false,setCookieAccepted:false});
    return response;
  }

  console.warn=(...args)=>{metrics.consoleWarnError.push({level:'warn',message:args.map(String).join(' ')});nativeConsoleWarn(...args)};
  console.error=(...args)=>{metrics.consoleWarnError.push({level:'error',message:args.map(String).join(' ')});nativeConsoleError(...args)};
  addEventListener('error',event=>metrics.errors.push({type:'error',message:String(event.error?.stack||event.message||event.error)}));
  addEventListener('unhandledrejection',event=>metrics.errors.push({type:'unhandledrejection',message:String(event.reason?.stack||event.reason)}));
  installPermanentGuards();

  function floatBits(value){const bytes=new ArrayBuffer(8);new DataView(bytes).setFloat64(0,value,false);return hex(bytes)}
  function fromFloatBits(bits){const bytes=new Uint8Array(bits.match(/../g).map(value=>parseInt(value,16)));return new DataView(bytes.buffer).getFloat64(0,false)}
  function encode(value){
    if(value===undefined)return{'$undefined':true};
    if(typeof value==='number'){
      if(!Number.isFinite(value))throw new Error('cannot encode non-finite number');
      if(!Number.isInteger(value)||Object.is(value,-0))return{'$float64':floatBits(value),decimal:Object.is(value,-0)?'-0':String(value)};
      return value;
    }
    if(value===null||typeof value==='string'||typeof value==='boolean')return value;
    if(Array.isArray(value))return value.map(encode);
    if(typeof value==='object')return{'$object':Object.keys(value).map(key=>[key,encode(value[key])])};
    throw new Error('unsupported encoded value');
  }
  function decode(value){
    if(value===null||typeof value==='string'||typeof value==='boolean'||typeof value==='number')return value;
    if(Array.isArray(value))return value.map(decode);
    if(!value||typeof value!=='object')throw new Error('invalid encoded value');
    const keys=Object.keys(value);
    if(keys.length===1&&keys[0]==='$undefined'&&value.$undefined===true)return undefined;
    if(keys.length===2&&keys[0]==='$float64'&&keys[1]==='decimal'&&/^[0-9a-f]{16}$/.test(value.$float64)){
      const result=fromFloatBits(value.$float64),display=Object.is(result,-0)?'-0':String(result);
      if(!Number.isFinite(result)||display!==value.decimal)throw new Error('invalid Float64 authority');
      return result;
    }
    if(keys.length===1&&keys[0]==='$object'&&Array.isArray(value.$object)){
      const result={};
      for(const pair of value.$object){
        if(!Array.isArray(pair)||pair.length!==2||typeof pair[0]!=='string'||own(result,pair[0]))throw new Error('invalid object authority');
        result[pair[0]]=decode(pair[1]);
      }
      return result;
    }
    throw new Error('ambiguous encoded authority');
  }
  function deepFreeze(value,seen=new Set()){
    if(value===null||typeof value!=='object')return value;
    if(seen.has(value))throw new Error('cyclic authority');
    seen.add(value);
    for(const key of Reflect.ownKeys(value))deepFreeze(value[key],seen);
    seen.delete(value);return Object.freeze(value);
  }

  function reference(method,input){
    if(method==='familyBuildingBonus'){
      if(!input.assigned)return{baseBonus:0,intimacyBonus:0,rarityBonus:0,specialtyBonus:0,uncappedBonus:0,bonus:0,multiplier:1};
      const baseBonus=input.base,intimacyBonus=Math.min(input.intimacyCap,input.intimacy*input.intimacyRate),rarityBonus=input.rarityRate*(input.rarity-1),specialtyBonus=input.specialtyMatch?input.specialtyAmount:0,withIntimacy=baseBonus+intimacyBonus,withRarity=withIntimacy+rarityBonus,uncappedBonus=withRarity+specialtyBonus,bonus=Math.min(input.cap,uncappedBonus),multiplier=1+bonus;
      return{baseBonus,intimacyBonus,rarityBonus,specialtyBonus,uncappedBonus,bonus,multiplier};
    }
    if(method==='neutralHookBonus')return typeof input==='number'&&Number.isFinite(input)&&input>0?input:0;
    if(method==='buildingUpgradeCost')return Math.round(input.base*Math.pow(input.growth,input.level-1));
    if(method==='buildingRateComponents'){
      const levelMultiplier=Math.pow(input.levelGrowth,input.level-1),fellowRosterMultiplier=1+input.fellowRosterBonus,companionRosterMultiplier=1+input.companionRosterBonus,overallDayMultiplier=1+input.overallDayBonus,afterFamily=input.familyAssignmentMultiplier*fellowRosterMultiplier,afterCompanion=afterFamily*companionRosterMultiplier,characterEconomyMultiplier=afterCompanion*overallDayMultiplier,oathMultiplier=1+input.oathBoost,withLevel=input.base*levelMultiplier,withCharacters=withLevel*characterEconomyMultiplier,rate=withCharacters*oathMultiplier;
      return{levelMultiplier,fellowRosterMultiplier,companionRosterMultiplier,overallDayMultiplier,characterEconomyMultiplier,oathMultiplier,rate};
    }
    if(method==='durationGold')return input.rate*input.durationMs/3600000;
    if(method==='totalRate')return input.orderedRates.reduce((sum,value)=>sum+value,0);
    if(method==='offlineTotals'){
      const total=input.orderedLineTotals.reduce((sum,value)=>sum+value,0);
      return{total,pendingAfter:input.pendingBefore+total};
    }
    throw new Error(`unknown reference method ${method}`);
  }

  function sourceScript(source){
    const open='<script>',close='</script>';
    if(count(source,open)!==1||count(source,close)!==1)throw new Error('production inline script boundary drift');
    const start=source.indexOf(open)+open.length,end=source.lastIndexOf(close);
    if(end<=start)throw new Error('production inline script boundary order');
    return source.slice(start,end);
  }
  const inverseExact=(candidate,records,original)=>{
    let restored=candidate;
    for(const record of [...records].reverse()){
      if(count(restored,record.replacement)!==1)throw new Error(`inverse replacement drift: ${record.name}`);
      restored=restored.replace(record.replacement,record.original);
    }
    return restored===original;
  };
  function replaceExact(source,original,replacement,name,records){
    if(count(source,original)!==1)throw new Error(`${name} anchor is not exact-once`);
    records.push(Object.freeze({name,offset:source.indexOf(original),original,replacement,originalBytes:new TextEncoder().encode(original).byteLength,replacementBytes:new TextEncoder().encode(replacement).byteLength}));return source.replace(original,replacement);
  }

  const nestedCodec=`
const __p10b2Own=(value,key)=>Object.prototype.hasOwnProperty.call(value,key);
const __p10b2Hex=bytes=>Array.from(new Uint8Array(bytes),value=>value.toString(16).padStart(2,'0')).join('');
const __p10b2Bits=value=>{const bytes=new ArrayBuffer(8);new DataView(bytes).setFloat64(0,value,false);return __p10b2Hex(bytes)};
const __p10b2FromBits=bits=>{const bytes=new Uint8Array(bits.match(/../g).map(value=>parseInt(value,16)));return new DataView(bytes.buffer).getFloat64(0,false)};
const __p10b2Ordinary=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)===Object.prototype;
const __p10b2Data=(value,key,strict=false)=>{const descriptor=Object.getOwnPropertyDescriptor(value,key);return Boolean(descriptor)&&__p10b2Own(descriptor,'value')&&!__p10b2Own(descriptor,'get')&&!__p10b2Own(descriptor,'set')&&descriptor.enumerable===true&&(!strict||descriptor.writable===true&&descriptor.configurable===true)};
const __p10b2Dense=(value,strict=false)=>Array.isArray(value)&&Object.getPrototypeOf(value)===Array.prototype&&Reflect.ownKeys(value).length===value.length+1&&Reflect.ownKeys(value).every((key,index)=>index<value.length?key===String(index)&&__p10b2Data(value,key,strict):key==='length'&&(!strict||(Object.getOwnPropertyDescriptor(value,'length').writable===true&&Object.getOwnPropertyDescriptor(value,'length').enumerable===false&&Object.getOwnPropertyDescriptor(value,'length').configurable===false)));
const __p10b2Encode=(value,strict=false)=>{if(value===undefined)return{'$undefined':true};if(typeof value==='number'){if(!Number.isFinite(value))throw new Error('non-finite output');if(!Number.isInteger(value)||Object.is(value,-0))return{'$float64':__p10b2Bits(value),decimal:Object.is(value,-0)?'-0':String(value)};return value}if(value===null||typeof value==='string'||typeof value==='boolean')return value;if(Array.isArray(value)){if(!__p10b2Dense(value,strict))throw new Error('malformed output array');return value.map(item=>__p10b2Encode(item,strict))}if(__p10b2Ordinary(value)){const keys=Reflect.ownKeys(value);if(!keys.every(key=>typeof key==='string'&&__p10b2Data(value,key,strict)))throw new Error('malformed output object');return{'$object':keys.map(key=>[key,__p10b2Encode(Object.getOwnPropertyDescriptor(value,key).value,strict)])}}throw new Error('unsupported output')};
const __p10b2Decode=value=>{if(value===null||typeof value==='string'||typeof value==='boolean'||typeof value==='number')return value;if(Array.isArray(value))return value.map(__p10b2Decode);const keys=Object.keys(value);if(keys.length===1&&keys[0]==='$undefined'&&value.$undefined===true)return undefined;if(keys.length===2&&keys[0]==='$float64'&&keys[1]==='decimal'){const result=__p10b2FromBits(value.$float64);if((Object.is(result,-0)?'-0':String(result))!==value.decimal)throw new Error('invalid Float64');return result}if(keys.length===1&&keys[0]==='$object'){const result={};for(const pair of value.$object){if(__p10b2Own(result,pair[0]))throw new Error('duplicate key');result[pair[0]]=__p10b2Decode(pair[1])}return result}throw new Error('invalid encoded input')};
const __p10b2Local=value=>__p10b2Decode(JSON.parse(JSON.stringify(value)));
const __p10b2Freeze=(value,seen=new Set())=>{if(value===null||typeof value!=='object')return value;if(seen.has(value))throw new Error('cycle');seen.add(value);for(const key of Reflect.ownKeys(value))__p10b2Freeze(value[key],seen);seen.delete(value);return Object.freeze(value)};
const __p10b2Path=(fixture,path)=>{if(typeof path!=='string'||!path.startsWith('$.'))throw new TypeError('invalid path');let value=fixture;for(const key of path.slice(2).split('.')){if(value===null||typeof value!=='object'||!__p10b2Own(value,key))throw new TypeError('unresolved path');value=value[key]}return value};
`;

  const nestedShim=`
(()=>{'use strict';
const effects={storage:[],save:[],network:[],ui:[],timer:[],listeners:[],console:[],errors:[],trapFailures:[],runtimeReads:0};
Object.defineProperty(window,'__P10B2_EFFECTS__',{value:effects,configurable:false,enumerable:false,writable:false});
const nativeAdd=window.addEventListener.bind(window);nativeAdd('error',event=>effects.errors.push({name:event.error?.name||'Error',message:String(event.error?.message||event.message)}));nativeAdd('unhandledrejection',event=>effects.errors.push({name:event.reason?.name||'Error',message:String(event.reason?.message||event.reason)}));
Object.defineProperty(window,'__P10B2_RECORD_ERROR__',{configurable:false,enumerable:false,writable:false,value:error=>effects.errors.push({name:error?.name||'Error',message:String(error?.message||error)})});
const stop=(bucket,name)=>function(){effects[bucket].push(name);throw new Error('prohibited '+name)};
const install=(object,key,descriptor,name=String(key))=>{try{Object.defineProperty(object,key,{configurable:true,...descriptor});return true}catch(error){effects.trapFailures.push(name+': '+error.message);return false}};
const storage=Object.freeze({getItem:stop('storage','getItem'),setItem:stop('storage','setItem'),removeItem:stop('storage','removeItem')});
const runtime=Object.freeze({storage,clock:Object.freeze({now:()=>1788026400000,setTimeout:stop('timer','runtimeSetTimeout'),clearTimeout:stop('timer','runtimeClearTimeout')})});
install(window,'__EVERSTEAD_RUNTIME__',{enumerable:false,get(){effects.runtimeReads++;return runtime}},'runtime adapter');
install(window,'localStorage',{get:stop('storage','localStorage')});install(window,'sessionStorage',{get:stop('storage','sessionStorage')});
install(window,'indexedDB',{value:Object.freeze({open:stop('storage','indexedDB.open'),deleteDatabase:stop('storage','indexedDB.deleteDatabase'),databases:stop('storage','indexedDB.databases')})});install(window,'caches',{value:Object.freeze({open:stop('storage','caches.open'),delete:stop('storage','caches.delete'),keys:stop('storage','caches.keys'),match:stop('storage','caches.match')})});
install(navigator,'serviceWorker',{value:Object.freeze({register:stop('storage','serviceWorker.register'),getRegistration:stop('storage','serviceWorker.getRegistration'),getRegistrations:stop('storage','serviceWorker.getRegistrations'),get ready(){return stop('storage','serviceWorker.ready')()}})});install(navigator,'clipboard',{value:Object.freeze({read:stop('save','clipboard.read'),write:stop('save','clipboard.write'),readText:stop('save','clipboard.readText'),writeText:stop('save','clipboard.writeText')})});
install(navigator,'sendBeacon',{value:stop('network','sendBeacon')});install(window,'fetch',{value:stop('network','fetch')});install(window,'XMLHttpRequest',{value:stop('network','XMLHttpRequest')});install(window,'WebSocket',{value:stop('network','WebSocket')});install(window,'EventSource',{value:stop('network','EventSource')});
install(window,'open',{value:stop('ui','window.open')});install(window,'showSaveFilePicker',{value:stop('save','showSaveFilePicker')});
install(document,'cookie',{get:stop('storage','cookie.get'),set:stop('storage','cookie.set')},'cookie');
const anchorClick=HTMLAnchorElement.prototype.click;install(HTMLAnchorElement.prototype,'click',{value:function(){if(this.hasAttribute('download'))return stop('save','download')();return anchorClick.call(this)}},'download click');
install(window,'addEventListener',{value:(name,handler)=>effects.listeners.push(['window',name,typeof handler])},'window.addEventListener');install(document,'addEventListener',{value:(name,handler)=>effects.listeners.push(['document',name,typeof handler])},'document.addEventListener');
install(window,'confirm',{value:stop('ui','confirm')});install(window,'prompt',{value:stop('ui','prompt')});install(window,'alert',{value:stop('ui','alert')});
install(window,'setTimeout',{value:stop('timer','setTimeout')});install(window,'clearTimeout',{value:stop('timer','clearTimeout')});install(window,'setInterval',{value:stop('timer','setInterval')});install(window,'clearInterval',{value:stop('timer','clearInterval')});
install(console,'warn',{value:(...args)=>effects.console.push(['warn',args.map(String).join(' ')])},'console.warn');install(console,'error',{value:(...args)=>effects.console.push(['error',args.map(String).join(' ')])},'console.error');
})();
`;

  const facade=`
${nestedCodec}
const __p10b2Core=typeof ${CORE_NAME}==='object'&&${CORE_NAME}!==null?${CORE_NAME}:null;
const __p10b2Calls=[];window.__P10B2_CAPTURE_SINK__=(method,input)=>__p10b2Calls.push({ordinal:__p10b2Calls.length+1,method,argument:__p10b2Encode(input)});
const __p10b2Wrappers=Object.freeze({familyBuildingBonusComponents,economyHookBonus,buildingUpgradeCost,buildingRateComponents,totalRate,offlineClaimPreview});
const __p10b2Invoke=(trace,fixture)=>{const args=trace.wrapper.argumentPaths.map(path=>__p10b2Path(fixture,path));return __p10b2Wrappers[trace.wrapper.selector](...args)};
const __p10b2Surface=()=>({
  coreFrozen:Object.isFrozen(__p10b2Core),keys:Reflect.ownKeys(__p10b2Core),
  descriptors:Reflect.ownKeys(__p10b2Core).map(key=>{const descriptor=Object.getOwnPropertyDescriptor(__p10b2Core,key),fn=descriptor.value;let constructible=true;try{Reflect.construct(fn,[])}catch{constructible=false}return{key,enumerable:descriptor.enumerable,writable:descriptor.writable,configurable:descriptor.configurable,type:typeof fn,name:fn.name,length:fn.length,frozen:Object.isFrozen(fn),constructible,ownPrototype:Object.prototype.hasOwnProperty.call(fn,'prototype'),arrow:!/^function\\b/.test(Function.prototype.toString.call(fn))}}),
  wrappers:Reflect.ownKeys(__p10b2Wrappers).map(key=>({key,name:__p10b2Wrappers[key].name,length:__p10b2Wrappers[key].length,type:typeof __p10b2Wrappers[key]})),
  inherited:['__EVERSTEAD_QA__','__EVERSTEAD_PHASE6_QA__','__EVERSTEAD_PHASE7_QA__','__EVERSTEAD_PHASE9_QA__'].filter(key=>Reflect.has(window,key)),
  probeDescriptor:Object.getOwnPropertyDescriptor(window,'${NESTED_HOOK}')
});
Object.defineProperty(window,'${NESTED_HOOK}',{enumerable:false,writable:false,configurable:false,value:Object.freeze({
  surface:()=>JSON.parse(JSON.stringify(__p10b2Surface())),
  kernel:(method,input)=>__p10b2Encode(__p10b2Core[method](__p10b2Freeze(__p10b2Local(input))),true),
  wrapper:(trace,fixture)=>__p10b2Encode(__p10b2Invoke(__p10b2Freeze(__p10b2Local(trace)),__p10b2Freeze(__p10b2Local(fixture))),true),
  calls:()=>JSON.parse(JSON.stringify(__p10b2Calls)),
  resetCalls:()=>{__p10b2Calls.length=0}
})});
`;

  function outputTransform(script){
    const records=[];
    const transformed=replaceExact(script,BOOT,facade,'boot facade',records);
    if(!inverseExact(transformed,records,script))throw new Error('output transform inverse mismatch');
    return{script:transformed,restored:true};
  }
  function callTransform(script){
    const records=[];
    let transformed=replaceExact(script,`const ${CORE_NAME}=`,`const __P10B2_CAPTURE__=(method,input)=>window.__P10B2_CAPTURE_SINK__(method,input);const ${CORE_NAME}=`,`call capture declaration`,records);
    for(const method of METHODS){
      const anchor=`const ${method}=input=>{`,replacement=`const ${method}=input=>{__P10B2_CAPTURE__('${method}',input);`;
      transformed=replaceExact(transformed,anchor,replacement,`call body ${method}`,records);
    }
    transformed=replaceExact(transformed,BOOT,facade,'call facade',records);
    if(!inverseExact(transformed,records,script))throw new Error('call transform inverse mismatch');
    return{script:transformed,restored:true};
  }
  function mutationTransform(script){
    const records=[];
    const transformed=replaceExact(script,'Object.freeze(familyBuildingBonus)','familyBuildingBonus','startup-shape mutation',records);
    if(!inverseExact(transformed,records,script))throw new Error('mutation transform inverse mismatch');
    return{script:transformed,restored:true};
  }

  const safeInline=source=>{
    if(/<\/script/i.test(source))throw new Error('nested source contains script terminator');
    return source;
  };
  function executeProductionRealm(script,kind){
    return new Promise((resolve,reject)=>{
      const frame=document.createElement('iframe');let settled=false;
      const timeout=setTimeout(()=>finish(new Error(`${kind} production realm timeout`)),30000);
      const finish=(error,value)=>{if(settled)return;settled=true;clearTimeout(timeout);if(error)frame.remove();error?reject(error):resolve(value)};
      frame.title=`Phase 10B-2 ${kind} production probe`;frame.sandbox='allow-scripts allow-same-origin';frame.referrerPolicy='no-referrer';
      frame.style.display='none';
      frame.addEventListener('load',()=>{
        try{
          const target=frame.contentWindow,effects=target.__P10B2_EFFECTS__||{},probe=target[NESTED_HOOK]||null;
          metrics.nestedRealms++;
          finish(null,{target,effects,probe,cleanup:()=>frame.remove()});
        }catch(error){finish(error)}
      },{once:true});
      const policy="default-src 'none'; script-src 'unsafe-inline'; connect-src 'none'; img-src 'none'; style-src 'none'; font-src 'none'; media-src 'none'; object-src 'none'; frame-src 'none'; worker-src 'none'; base-uri 'none'; form-action 'none'";
      frame.srcdoc=`<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><script>${safeInline(nestedShim)}<\/script><script>try{${safeInline(script)}}catch(error){window.__P10B2_RECORD_ERROR__(error)}<\/script>`;
      document.body.append(frame);
    });
  }
  function effectsClean(effects,{mutation=false}={}){
    const empty=name=>Array.isArray(effects[name])&&effects[name].length===0;
    const ordinary=empty('storage')&&empty('save')&&empty('network')&&empty('ui')&&empty('timer')&&empty('console');
    return ordinary&&empty('trapFailures')&&(mutation?Array.isArray(effects.errors)&&effects.errors.length>=1:empty('errors'));
  }
  function absorbEffects(effects){
    metrics.nestedStorage+=effects.storage?.length||0;metrics.nestedSave+=effects.save?.length||0;
    metrics.nestedNetwork+=effects.network?.length||0;metrics.nestedUi+=effects.ui?.length||0;
    metrics.nestedTimer+=effects.timer?.length||0;metrics.nestedListeners+=effects.listeners?.length||0;
    for(const failure of effects.trapFailures||[])metrics.trapFailures.push(`nested: ${failure}`);
  }

  const numericGroups=Object.freeze({familyBuildingBonus:20,neutralHookBonus:8,buildingUpgradeCost:12,buildingRateComponents:24,durationGold:8,totalRate:8,offlineTotals:16});
  function numericParity(vectors,method,probe){
    const selected=vectors.filter(vector=>vector.method===method);
    if(selected.length!==numericGroups[method])return false;
    return selected.every(vector=>{
      const frozen=deepFreeze(decode(clone(vector.input))),expected=vector.expected,referenceValue=encode(reference(method,frozen)),candidate=clone(probe.kernel(method,vector.input));
      return exact(referenceValue,expected)&&exact(candidate,expected);
    });
  }
  function traceParity(trace,outputProbe,callProbe){
    const referenceProjection=encode(reference(trace.arithmetic.method,deepFreeze(decode(clone(trace.arithmetic.input)))));
    const direct=clone(outputProbe.kernel(trace.arithmetic.method,trace.arithmetic.input));
    const full=clone(outputProbe.wrapper(trace,trace.fixture));
    callProbe.resetCalls();
    const callFull=clone(callProbe.wrapper(trace,trace.fixture));
    const calls=clone(callProbe.calls());
    return{
      reference:exact(referenceProjection,trace.arithmetic.projection),
      direct:exact(direct,trace.arithmetic.projection),
      wrapper:exact(full,trace.predecessor.fullReturn)&&exact(callFull,trace.predecessor.fullReturn)&&exact(full,callFull),
      calls:exact(calls,trace.expectedKernelCalls),
      aggregate:METHODS.every(method=>calls.filter(call=>call.method===method).length===trace.aggregateCallCounts[method]),
      full,direct,calls
    };
  }

  function configureControls(traces){
    const select=document.getElementById('trace-control'),button=document.getElementById('rerender'),rendered=document.getElementById('rendered');
    select.textContent='';
    for(const trace of traces.slice(0,3)){const option=document.createElement('option');option.value=trace.id;option.textContent=trace.id;select.append(option)}
    const render=()=>{metrics.renderCount++;rendered.dataset.trace=select.value;rendered.textContent=`${select.value}|${metrics.renderCount}|${config.motion}`};
    button.addEventListener('click',render);render();
    const first=rendered.textContent;select.selectedIndex=1;button.click();const second=rendered.textContent;
    return{first,second,ok:first!==second&&rendered.dataset.trace===traces[1].id&&metrics.renderCount===2};
  }

  function post(type,payload){parent.postMessage({channel:CHANNEL,type,key:realmId,token:config.token,...payload},parentOrigin)}
  async function run(){
    const responses=await Promise.all(ALLOWED.map(path=>fetch(path,{method:'GET',credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer'})));
    const buffers=await Promise.all(responses.map(response=>response.arrayBuffer()));
    const texts=buffers.map(buffer=>new TextDecoder().decode(buffer));
    const [artifactText,scenarioText,registryText,traceText]=texts;
    const [artifactSha,scenarioSha,registrySha,traceSha]=await Promise.all(buffers.map(hash));
    const [artifactBytes,scenarioBytes,registryBytes,traceBytes]=buffers.map(buffer=>buffer.byteLength);
    const scenarios=JSON.parse(scenarioText),registry=JSON.parse(registryText),traceAuthority=JSON.parse(traceText),traces=traceAuthority.traces;
    const preimage=artifactSha===PREIMAGE_SHA&&artifactBytes===PREIMAGE_BYTES;
    const candidate=artifactSha===CANDIDATE_SHA&&artifactBytes===CANDIDATE_BYTES&&/^[0-9a-f]{64}$/.test(CANDIDATE_SHA)&&artifactText.includes(`const ${CORE_NAME}=`);
    if(!preimage&&!candidate)throw new Error(`unknown production artifact ${artifactSha}/${artifactBytes}`);
    const mode=preimage?'preimage':'candidate';
    const controls=configureControls(traces);
    const script=sourceScript(artifactText);
    const assetMatches=[...artifactText.matchAll(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g)].map(match=>match[0]);
    const assetSha=await hash(new TextEncoder().encode(assetMatches.join('\n')));
    const allocation=traces.reduce((sum,trace)=>(sum[trace.operation]=(sum[trace.operation]||0)+1,sum),{});
    const wrapperAnchors=WRAPPERS.map(name=>count(artifactText,`function ${name}(`));
    const getExact=metrics.allowedGets.length===4&&metrics.requests.length===4&&ALLOWED.every(path=>metrics.allowedGets.some(item=>item.path===path&&item.credentials==='omit'&&!item.cookieSent&&!item.setCookieAccepted));
    const motionStyle=getComputedStyle(document.getElementById('motion-probe')).transitionDuration;
    const motionExact=config.motion==='reduced'?motionStyle==='0.001s':motionStyle==='1s';
    const noBridge=!('__EVERSTEAD_QA__'in window)&&!('__EVERSTEAD_PHASE6_QA__'in window)&&!('__EVERSTEAD_PHASE7_QA__'in window)&&!('__EVERSTEAD_PHASE9_QA__'in window)&&!('__P10B2_PROBE__'in window)&&!['__P10B2','PHASE_10B2','phase10b2','phase-10b2','gold-core'].some(anchor=>artifactText.includes(anchor));
    const rows=[];
    const add=(id,ok,evidence,status=null)=>rows.push({id:`${realmId}:${id}`,status:status||(ok?'PASS':'FAIL'),evidence});
    const controlRows=[
      [config.key===`${config.width}x${config.height}-${config.motion}`&&config.width>0&&config.height>0,'isolated realm identity/configuration'],
      [scenarioSha===SCENARIO_SHA&&scenarioBytes===SCENARIO_BYTES&&registrySha===REGISTRY_SHA&&registryBytes===REGISTRY_BYTES&&traceSha===TRACE_SHA&&traceBytes===TRACE_BYTES,'literal scenario/registry/trace identities'],
      [preimage?artifactSha===PREIMAGE_SHA&&artifactBytes===PREIMAGE_BYTES:candidate,'hard production artifact identity and closed mode'],
      [assetMatches.length===5&&assetSha===ASSET_SHA,`embedded assets ${assetMatches.length}/5 aggregate ${assetSha}`],
      [scenarios.numericVectors?.length===96&&scenarios.mutationRows?.length===48&&registry.total===400,'96 numeric / 48 mutation / 400 focused topology'],
      [registry.rows?.length===400&&new Set(registry.rows.map(row=>row.id)).size===400&&registry.preimageTotals?.PASS===254&&registry.preimageTotals?.PENDING===146,'row registry identities and preimage totals'],
      [traceAuthority.traceCount===32&&traces.length===32&&exact(allocation,EXPECTED_ALLOCATION),`32 frozen traces ${JSON.stringify(allocation)}`],
      [wrapperAnchors.every(value=>value===1),`six wrapper anchors ${wrapperAnchors.join('/')}`],
      [count(artifactText,BOOT)===1&&count(artifactText,'const RUNTIME_INPUT=')===1&&(preimage?count(artifactText,`const ${CORE_NAME}=`)===0:count(artifactText,`const ${CORE_NAME}=`)===1),'boot/runtime/private-core source anchors'],
      [getExact,'four same-origin immutable GETs; credentials omit; no cookie send/accept path'],
      [metrics.trapFailures.length===0,'all permanent prohibited API traps installed'],
      [metrics.storage===0,'zero native storage/session/IndexedDB/Cache/SW/cookie access'],
      [metrics.save===0,'zero clipboard/download/file-picker writes'],
      [metrics.prohibited===0,'zero prohibited browser API calls'],
      [metrics.consoleWarnError.length===0&&metrics.errors.length===0,'blank warning/error/unhandled capture'],
      [innerWidth===config.width&&innerHeight===config.height,`viewport ${innerWidth}×${innerHeight}; expected ${config.width}×${config.height}`],
      [document.documentElement.dataset.motion===config.motion&&motionExact,`motion ${config.motion}; computed transition ${motionStyle}`],
      [document.documentElement.scrollWidth<=document.documentElement.clientWidth&&document.body.scrollWidth<=document.body.clientWidth,'no horizontal overflow'],
      [controls.ok,`controls rerendered twice: ${controls.first} -> ${controls.second}`],
      [noBridge&&!artifactText.includes(NESTED_HOOK)&&!artifactText.includes('__P10B2_CAPTURE__'),'no production UI route or QA bridge/probe exposure']
    ];
    controlRows.forEach((row,index)=>add(`control-${String(index+1).padStart(2,'0')}`,row[0],row[1]));

    if(preimage){
      for(let index=1;index<=36;index++)add(`candidate-${String(index).padStart(2,'0')}`,true,'private candidate browser assertion intentionally absent','PENDING');
    }else{
      const output=outputTransform(script),call=callTransform(script),mutation=mutationTransform(script);
      const outputRealm=await executeProductionRealm(output.script,'output');
      const callRealm=await executeProductionRealm(call.script,'call-trace');
      const mutationRealm=await executeProductionRealm(mutation.script,'startup-mutation');
      const outputProbe=outputRealm.probe,callProbe=callRealm.probe;
      if(!outputProbe||!callProbe)throw new Error('candidate probe facade absent');
      const surface=clone(outputProbe.surface());
      const callSurface=clone(callProbe.surface());
      const numeric={};for(const method of METHODS)numeric[method]=numericParity(scenarios.numericVectors,method,outputProbe);
      const traceResults=traces.map(trace=>traceParity(trace,outputProbe,callProbe));
      const traceGroup=operation=>traces.map((trace,index)=>({trace,result:traceResults[index]})).filter(item=>item.trace.operation===operation);
      const groupOk=operation=>traceGroup(operation).every(item=>item.result.reference&&item.result.direct&&item.result.wrapper&&item.result.calls&&item.result.aggregate);
      const totalActualCalls=traceResults.reduce((sum,result)=>sum+result.calls.length,0);
      const totalExpectedCalls=traces.reduce((sum,trace)=>sum+trace.expectedKernelCalls.length,0);
      const aggregateActual=Object.fromEntries(METHODS.map(method=>[method,traceResults.reduce((sum,result)=>sum+result.calls.filter(call=>call.method===method).length,0)]));
      const aggregateExpected=Object.fromEntries(METHODS.map(method=>[method,traces.reduce((sum,trace)=>sum+trace.aggregateCallCounts[method],0)]));
      const oneUlp=traces.find(trace=>trace.id==='offline-one-ulp-discriminator');
      const oneUlpResult=traceResults[traces.indexOf(oneUlp)];
      const signedZeroIndexes=traces.map((trace,index)=>String(trace.formulaNote).toLowerCase().includes('negative-zero')?index:-1).filter(index=>index>=0);
      const signedZeroOk=signedZeroIndexes.length===3&&signedZeroIndexes.every(index=>traceResults[index].reference&&traceResults[index].direct&&traceResults[index].wrapper);
      absorbEffects(outputRealm.effects);absorbEffects(callRealm.effects);absorbEffects(mutationRealm.effects);
      const descriptorOk=surface.coreFrozen&&exact(surface.keys,METHODS)&&surface.descriptors.every((item,index)=>item.key===METHODS[index]&&item.enumerable===true&&item.writable===false&&item.configurable===false&&item.type==='function');
      const functionOk=surface.descriptors.every((item,index)=>item.name===METHODS[index]&&item.length===1&&item.frozen===true&&item.constructible===false&&item.ownPrototype===false&&item.arrow===true);
      const wrapperShapeOk=surface.wrappers.length===6&&surface.wrappers.every((item,index)=>item.key===WRAPPERS[index]&&item.name===WRAPPERS[index]&&item.type==='function');
      const ordinaryEffects=effectsClean(outputRealm.effects)&&effectsClean(callRealm.effects)&&outputRealm.effects.runtimeReads===3&&callRealm.effects.runtimeReads===3;
      const listenerExact=exact(outputRealm.effects.listeners,[['window','storage','function'],['window','storage','function'],['window','storage','function']])&&exact(callRealm.effects.listeners,[['window','storage','function'],['window','storage','function'],['window','storage','function']]);
      const mutationOk=effectsClean(mutationRealm.effects,{mutation:true})&&mutationRealm.effects.runtimeReads===0&&!mutationRealm.probe&&mutationRealm.effects.errors.some(error=>/shape|surface|kernel|PHASE_TEN_B_TWO/i.test(`${error.name} ${error.message}`));
      const candidateRows=[
        [true,`candidate ${artifactSha}/${artifactBytes} matched literal identity`],
        [count(artifactText,`const ${CORE_NAME}=`)===1&&!artifactText.includes(`window.${CORE_NAME}`)&&!artifactText.includes(`globalThis.${CORE_NAME}`),'private core declaration occurs exact-once without ambient export'],
        [effectsClean(outputRealm.effects),`uninstrumented output realm side effects ${JSON.stringify(outputRealm.effects)}`],
        [output.restored===true,'output transform inverse-restores exact source'],
        [surface.coreFrozen&&exact(surface.keys,METHODS),'frozen core and exact seven-key order'],
        [descriptorOk,'own enumerable/nonwritable/nonconfigurable function descriptors'],
        [surface.descriptors.every((item,index)=>item.name===METHODS[index]&&item.length===1),'exact method names and unary arity'],
        [surface.descriptors.every(item=>item.frozen),'all seven private methods frozen'],
        [surface.descriptors.every(item=>item.constructible===false),'all seven methods nonconstructible'],
        [surface.descriptors.every(item=>item.ownPrototype===false&&item.arrow),'arrow functions have no own prototype'],
        [wrapperShapeOk,'six preserved literal wrapper selectors'],
        [surface.probeDescriptor?.enumerable===false&&surface.probeDescriptor?.writable===false&&surface.probeDescriptor?.configurable===false&&surface.inherited.length===0&&!artifactText.includes(NESTED_HOOK),'QA facade is nested-only, frozen, and has no inherited production QA hooks'],
        [numeric.familyBuildingBonus,'20/20 direct/reference/literal familyBuildingBonus vectors'],
        [numeric.neutralHookBonus,'8/8 direct/reference/literal neutralHookBonus vectors'],
        [numeric.buildingUpgradeCost,'12/12 direct/reference/literal buildingUpgradeCost vectors'],
        [numeric.buildingRateComponents,'24/24 direct/reference/literal buildingRateComponents vectors'],
        [numeric.durationGold,'8/8 direct/reference/literal durationGold vectors'],
        [numeric.totalRate,'8/8 direct/reference/literal totalRate vectors'],
        [numeric.offlineTotals,'16/16 direct/reference/literal offlineTotals vectors'],
        [groupOk('family'),'6/6 family full-wrapper/direct/reference/call traces'],
        [groupOk('neutral'),'2/2 neutral full-wrapper/direct/reference/call traces'],
        [groupOk('upgrade'),'4/4 upgrade full-wrapper/direct/reference/call traces'],
        [groupOk('building-rate'),'8/8 building-rate full-wrapper/direct/reference/call traces'],
        [groupOk('duration-gold'),'4/4 duration-gold full-wrapper/direct/reference/call traces including zero exception'],
        [groupOk('total-rate'),'3/3 total-rate full-wrapper/direct/reference/call traces'],
        [groupOk('offline-totals'),'5/5 offline-totals full-wrapper/direct/reference/call traces'],
        [traceResults.every(result=>result.wrapper),'32/32 exact predecessor full returns in both candidate realms'],
        [traceResults.every(result=>result.reference&&result.direct),'32/32 independent-reference and direct-kernel projections'],
        [effectsClean(callRealm.effects)&&listenerExact,'call-trace realm zero side effects and exact listener capture'],
        [call.restored===true&&exact(surface,callSurface),'call transform exact restoration and unchanged surface'],
        [traceResults.every(result=>result.calls)&&totalActualCalls===totalExpectedCalls,`${totalActualCalls}/${totalExpectedCalls} exact ordered call records`],
        [traceResults.every(result=>result.aggregate)&&exact(aggregateActual,aggregateExpected),`aggregate call counts ${JSON.stringify(aggregateActual)}`],
        [oneUlpResult?.reference&&oneUlpResult?.direct&&oneUlpResult?.wrapper&&JSON.stringify(oneUlp.arithmetic.projection).includes('4124a3aeef9db22b'),'one-ULP offline discriminator retains exact 4124a3aeef9db22b bits'],
        [signedZeroOk,'all three negative-zero trace boundaries remain bit-exact'],
        [mutation.restored===true&&mutationOk,'one-defect startup shape failure occurs before runtime with zero storage/UI/timer/network'],
        [ordinaryEffects&&listenerExact&&controls.ok&&metrics.renderCount===2,'isolated candidate realms and QA rerender remain deterministic/read-only']
      ];
      if(candidateRows.length!==36)throw new Error('candidate browser row allocation drift');
      outputRealm.cleanup();callRealm.cleanup();mutationRealm.cleanup();
      candidateRows.forEach((row,index)=>add(`candidate-${String(index+1).padStart(2,'0')}`,row[0],row[1]));
    }

    if(rows.length!==56||new Set(rows.map(row=>row.id)).size!==56)throw new Error('realm row topology drift');
    const pass=rows.filter(row=>row.status==='PASS').length,pending=rows.filter(row=>row.status==='PENDING').length,fail=rows.filter(row=>row.status==='FAIL').length;
    const exactModeTotals=preimage?pass===20&&pending===36&&fail===0:pass===56&&pending===0&&fail===0;
    if(!exactModeTotals)throw new Error(`${mode} realm totals ${pass}/${pending}/${fail} are not exact`);
    document.getElementById('status').textContent=`${pass} pass / ${pending} pending / ${fail} fail`;
    post('phase10b2-realm',{rows,mode,artifactSha,artifactBytes,viewport:{width:innerWidth,height:innerHeight,motion:config.motion},metrics:clone(metrics)});
  }

  run().catch(error=>post('phase10b2-realm-fatal',{error:String(error?.stack||error),metrics:clone(metrics)}));
})();
