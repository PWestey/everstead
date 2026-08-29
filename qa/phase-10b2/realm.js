(()=>{
  'use strict';

  const CHANNEL='everstead-phase-10b2-v1';
  const PROTOCOL='opaque-attested-v2';
  const PREIMAGE_SHA='717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed';
  const PREIMAGE_BYTES=18916682;
  // Replaced with literal reviewed values when the executable candidate is frozen.
  const CANDIDATE_SHA='__PHASE_10B2_CANDIDATE_SHA256__';
  const CANDIDATE_BYTES=-1;
  const SCENARIO_SHA='d3dd215cbfd229d58ed4f7d5264a79cc64d3224860be430d324ec0b7d893a8dd';
  const SCENARIO_BYTES=126405;
  const REGISTRY_SHA='9e6282b2374e7ec263c3e4c9cc64873458b6e74fc356c470aabe23aac6ca394e';
  const REGISTRY_BYTES=96921;
  const TRACE_SHA='74feec74ff6f9efe07ca47cb2b0fcaaca8ab80dab71961fd2f1625f270209136';
  const TRACE_BYTES=557500;
  const ASSET_SHA='26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a';
  const CORE_NAME='PHASE_TEN_B_TWO_GOLD_CORE';
  const BOOT='const report=load();render();installQaBridge();if(report)runtimeSetTimeout(()=>openOffline(report),250);';
  const METHODS=Object.freeze(['familyBuildingBonus','neutralHookBonus','buildingUpgradeCost','buildingRateComponents','durationGold','totalRate','offlineTotals']);
  const WRAPPERS=Object.freeze(['familyBuildingBonusComponents','economyHookBonus','buildingUpgradeCost','buildingRateComponents','totalRate','offlineClaimPreview']);
  const PAYLOAD_KEYS=Object.freeze(['artifact','scenarios','registry','traces']);
  const EXPECTED_ALLOCATION=Object.freeze({family:6,neutral:2,upgrade:4,'building-rate':8,'duration-gold':4,'total-rate':3,'offline-totals':5});
  const NESTED_HOOK='__P10B2_BROWSER_PROBE__';
  const nativeConsoleWarn=console.warn.bind(console);
  const nativeConsoleError=console.error.bind(console);
  let config;
  try{config=JSON.parse(window.name)}catch{config=null}
  if(!config||config.channel!==CHANNEL||config.protocol!==PROTOCOL||typeof config.parentOrigin!=='string'||typeof config.token!=='string'||!['normal','reduced'].includes(config.motion))throw new Error('invalid isolated realm configuration');
  const parentOrigin=config.parentOrigin;
  const realmId=config.key;
  document.documentElement.dataset.motion=config.motion;

  const metrics={
    storage:0,save:0,prohibited:0,allowedGets:[],requests:[],trapFailures:[],consoleWarnError:[],errors:[],payloadMessages:0,payloadAttested:false,
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
  const shaWords=Object.freeze([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
  const portableHash=buffer=>{const source=new Uint8Array(buffer),length=((source.length+9+63)>>6)<<6,data=new Uint8Array(length),view=new DataView(data.buffer),words=new Uint32Array(64),state=new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);data.set(source);data[source.length]=0x80;const bits=source.length*8;view.setUint32(length-8,Math.floor(bits/0x100000000),false);view.setUint32(length-4,bits>>>0,false);const rotate=(value,amount)=>(value>>>amount)|(value<<(32-amount));for(let offset=0;offset<length;offset+=64){for(let index=0;index<16;index++)words[index]=view.getUint32(offset+index*4,false);for(let index=16;index<64;index++){const a=words[index-15],b=words[index-2],s0=rotate(a,7)^rotate(a,18)^(a>>>3),s1=rotate(b,17)^rotate(b,19)^(b>>>10);words[index]=(words[index-16]+s0+words[index-7]+s1)>>>0}let [a,b,c,d,e,f,g,h]=state;for(let index=0;index<64;index++){const s1=rotate(e,6)^rotate(e,11)^rotate(e,25),choice=(e&f)^(~e&g),t1=(h+s1+choice+shaWords[index]+words[index])>>>0,s0=rotate(a,2)^rotate(a,13)^rotate(a,22),majority=(a&b)^(a&c)^(b&c),t2=(s0+majority)>>>0;h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0}state[0]=(state[0]+a)>>>0;state[1]=(state[1]+b)>>>0;state[2]=(state[2]+c)>>>0;state[3]=(state[3]+d)>>>0;state[4]=(state[4]+e)>>>0;state[5]=(state[5]+f)>>>0;state[6]=(state[6]+g)>>>0;state[7]=(state[7]+h)>>>0}return Array.from(state,value=>value.toString(16).padStart(8,'0')).join('')};
  const hash=async bytes=>typeof crypto!=='undefined'&&crypto.subtle?hex(await crypto.subtle.digest('SHA-256',bytes)):portableHash(bytes);
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
    define(window,'fetch',{value:blocked('fetch'),writable:false},'fetch');
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
const rpcToken=__P10B2_NESTED_TOKEN_JSON__,rpcChannel='everstead-phase-10b2-probe-v1',copy=value=>JSON.parse(JSON.stringify(value));
const dispatch=(operation,args)=>{const probe=window.__P10B2_BROWSER_PROBE__;if(operation==='snapshot')return{effects:copy(effects),probePresent:Boolean(probe)};if(!probe)throw new Error('candidate probe unavailable');if(operation==='surface')return probe.surface();if(operation==='kernel')return probe.kernel(args.method,args.input);if(operation==='wrapper')return probe.wrapper(args.trace,args.fixture);if(operation==='calls')return probe.calls();if(operation==='resetCalls'){probe.resetCalls();return null}throw new Error('unknown probe operation')};
nativeAdd('message',event=>{const data=event.data;if(event.source!==parent||event.origin!=='null'||data?.channel!==rpcChannel||data?.token!==rpcToken||data?.type!=='phase10b2-probe-command'||!Number.isInteger(data.id))return;try{parent.postMessage({channel:rpcChannel,type:'phase10b2-probe-result',token:rpcToken,id:data.id,ok:true,value:dispatch(data.operation,data.args||{})},'*')}catch(error){parent.postMessage({channel:rpcChannel,type:'phase10b2-probe-result',token:rpcToken,id:data.id,ok:false,error:{name:error?.name||'Error',message:String(error?.message||error)}},'*')}});
Object.defineProperty(window,'__P10B2_PROBE_READY__',{configurable:false,enumerable:false,writable:false,value:()=>parent.postMessage({channel:rpcChannel,type:'phase10b2-probe-ready',token:rpcToken},'*')});
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
      const frame=document.createElement('iframe'),token=`${config.token}:${kind}`,pending=new Map();let settled=false,sequence=0;
      const timeout=setTimeout(()=>finish(new Error(`${kind} production realm timeout`)),30000);
      const cleanup=()=>{removeEventListener('message',onMessage);frame.remove();URL.revokeObjectURL(blobUrl);for(const item of pending.values()){clearTimeout(item.timeout);item.reject(new Error(`${kind} production realm removed`))}pending.clear()};
      const finish=(error,value)=>{if(settled)return;settled=true;clearTimeout(timeout);if(error)cleanup();error?reject(error):resolve(value)};
      const onMessage=event=>{const data=event.data;if(event.source!==frame.contentWindow||event.origin!=='null'||data?.channel!=='everstead-phase-10b2-probe-v1'||data?.token!==token)return;if(data.type==='phase10b2-probe-ready'){metrics.nestedRealms++;const command=(operation,args={})=>new Promise((resolveCommand,rejectCommand)=>{const id=++sequence,commandTimeout=setTimeout(()=>{pending.delete(id);rejectCommand(new Error(`${kind} ${operation} timeout`))},30000);pending.set(id,{resolve:resolveCommand,reject:rejectCommand,timeout:commandTimeout});frame.contentWindow.postMessage({channel:'everstead-phase-10b2-probe-v1',type:'phase10b2-probe-command',token,id,operation,args},'*')});finish(null,{command,cleanup});return}if(data.type!=='phase10b2-probe-result')return;const item=pending.get(data.id);if(!item)return;pending.delete(data.id);clearTimeout(item.timeout);data.ok?item.resolve(data.value):item.reject(Object.assign(new Error(data.error?.message||'probe command failed'),{name:data.error?.name||'Error'}))};
      addEventListener('message',onMessage);
      frame.title=`Phase 10B-2 ${kind} production probe`;frame.sandbox='allow-scripts';frame.referrerPolicy='no-referrer';
      frame.style.display='none';
      const policy="default-src 'none'; script-src 'unsafe-inline'; connect-src 'none'; img-src 'none'; style-src 'none'; font-src 'none'; media-src 'none'; object-src 'none'; frame-src 'none'; worker-src 'none'; base-uri 'none'; form-action 'none'";
      const shim=safeInline(nestedShim.replace('__P10B2_NESTED_TOKEN_JSON__',JSON.stringify(token))),html=`<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><script>${shim}<\/script><script>try{${safeInline(script)}}catch(error){window.__P10B2_RECORD_ERROR__(error)}<\/script><script>window.__P10B2_PROBE_READY__()<\/script>`,blobUrl=URL.createObjectURL(new Blob([html],{type:'text/html'}));
      frame.src=blobUrl;
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
  async function numericParity(vectors,method,probe){
    const selected=vectors.filter(vector=>vector.method===method);
    if(selected.length!==numericGroups[method])return false;
    for(const vector of selected){
      const frozen=deepFreeze(decode(clone(vector.input))),expected=vector.expected,referenceValue=encode(reference(method,frozen)),candidate=clone(await probe.command('kernel',{method,input:vector.input}));
      if(!exact(referenceValue,expected)||!exact(candidate,expected))return false;
    }
    return true;
  }
  async function traceParity(trace,outputProbe,callProbe){
    const referenceProjection=encode(reference(trace.arithmetic.method,deepFreeze(decode(clone(trace.arithmetic.input)))));
    const direct=clone(await outputProbe.command('kernel',{method:trace.arithmetic.method,input:trace.arithmetic.input}));
    const full=clone(await outputProbe.command('wrapper',{trace,fixture:trace.fixture}));
    await callProbe.command('resetCalls');
    const callFull=clone(await callProbe.command('wrapper',{trace,fixture:trace.fixture}));
    const calls=clone(await callProbe.command('calls'));
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

  function post(type,payload){parent.postMessage({channel:CHANNEL,type,key:realmId,token:config.token,protocol:PROTOCOL,...payload},'*')}
  async function run(bundle){
    const {payload,attestation}=bundle;
    if(!payload||!attestation||Reflect.ownKeys(payload).join('|')!==PAYLOAD_KEYS.join('|')||attestation.protocol!==PROTOCOL)throw new Error('invalid runner payload/attestation shape');
    if(!PAYLOAD_KEYS.every(key=>payload[key] instanceof ArrayBuffer))throw new Error('runner payload is not four immutable byte buffers');
    if(Reflect.ownKeys(attestation.identities||{}).join('|')!=='artifact|scenarios|registry|traces|realmHtml|realmScript')throw new Error('runner attestation identity allocation mismatch');
    for(const key of ['realmHtml','realmScript']){const identity=attestation.identities[key];if(identity?.key!==key||typeof identity.sha256!=='string'||!/^[0-9a-f]{64}$/.test(identity.sha256)||!Number.isInteger(identity.byteLength)||identity.byteLength<=0)throw new Error(`runner source attestation malformed: ${key}`)}
    if(attestation.identities?.realmHtml?.sha256!==config.realmHtml?.sha256||attestation.identities?.realmHtml?.byteLength!==config.realmHtml?.byteLength||attestation.identities?.realmScript?.sha256!==config.realmScript?.sha256||attestation.identities?.realmScript?.byteLength!==config.realmScript?.byteLength)throw new Error('runner source attestation mismatch');
    const buffers=PAYLOAD_KEYS.map(key=>payload[key]),texts=buffers.map(buffer=>new TextDecoder().decode(buffer));
    const [artifactText,scenarioText,registryText,traceText]=texts;
    const [artifactSha,scenarioSha,registrySha,traceSha]=await Promise.all(buffers.map(hash));
    const [artifactBytes,scenarioBytes,registryBytes,traceBytes]=buffers.map(buffer=>buffer.byteLength);
    const observed={artifact:[artifactSha,artifactBytes],scenarios:[scenarioSha,scenarioBytes],registry:[registrySha,registryBytes],traces:[traceSha,traceBytes]};
    for(const key of PAYLOAD_KEYS){const identity=attestation.identities?.[key];if(!identity||identity.key!==key||identity.sha256!==observed[key][0]||identity.byteLength!==observed[key][1])throw new Error(`runner payload attestation mismatch: ${key}`)}
    metrics.payloadAttested=true;
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
    const getExact=metrics.payloadMessages===1&&metrics.payloadAttested&&metrics.allowedGets.length===0&&metrics.requests.length===0;
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
      [registry.rows?.length===400&&new Set(registry.rows.map(row=>row.id)).size===400&&registry.preimageTotals?.PASS===206&&registry.preimageTotals?.PENDING===194,'row registry identities and exact 206/194 preimage totals'],
      [traceAuthority.traceCount===32&&traces.length===32&&exact(allocation,EXPECTED_ALLOCATION),`32 frozen traces ${JSON.stringify(allocation)}`],
      [wrapperAnchors.every(value=>value===1),`six wrapper anchors ${wrapperAnchors.join('/')}`],
      [count(artifactText,BOOT)===1&&count(artifactText,'const RUNTIME_INPUT=')===1&&(preimage?count(artifactText,`const ${CORE_NAME}=`)===0:count(artifactText,`const ${CORE_NAME}=`)===1),'boot/runtime/private-core source anchors'],
      [getExact,'runner-attested four-buffer payload; opaque realm performed zero native GETs/cookie paths'],
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
      const surface=clone(await outputRealm.command('surface'));
      const callSurface=clone(await callRealm.command('surface'));
      const numeric={};for(const method of METHODS)numeric[method]=await numericParity(scenarios.numericVectors,method,outputRealm);
      const traceResults=[];for(const trace of traces)traceResults.push(await traceParity(trace,outputRealm,callRealm));
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
      const outputSnapshot=await outputRealm.command('snapshot'),callSnapshot=await callRealm.command('snapshot'),mutationSnapshot=await mutationRealm.command('snapshot');
      const outputEffects=outputSnapshot.effects,callEffects=callSnapshot.effects,mutationEffects=mutationSnapshot.effects;
      absorbEffects(outputEffects);absorbEffects(callEffects);absorbEffects(mutationEffects);
      const descriptorOk=surface.coreFrozen&&exact(surface.keys,METHODS)&&surface.descriptors.every((item,index)=>item.key===METHODS[index]&&item.enumerable===true&&item.writable===false&&item.configurable===false&&item.type==='function');
      const functionOk=surface.descriptors.every((item,index)=>item.name===METHODS[index]&&item.length===1&&item.frozen===true&&item.constructible===false&&item.ownPrototype===false&&item.arrow===true);
      const wrapperShapeOk=surface.wrappers.length===6&&surface.wrappers.every((item,index)=>item.key===WRAPPERS[index]&&item.name===WRAPPERS[index]&&item.type==='function');
      const ordinaryEffects=effectsClean(outputEffects)&&effectsClean(callEffects)&&outputEffects.runtimeReads===3&&callEffects.runtimeReads===3;
      const listenerExact=exact(outputEffects.listeners,[['window','storage','function'],['window','storage','function'],['window','storage','function']])&&exact(callEffects.listeners,[['window','storage','function'],['window','storage','function'],['window','storage','function']]);
      const mutationOk=effectsClean(mutationEffects,{mutation:true})&&mutationEffects.runtimeReads===0&&!mutationSnapshot.probePresent&&mutationEffects.errors.some(error=>/shape|surface|kernel|PHASE_TEN_B_TWO/i.test(`${error.name} ${error.message}`));
      const candidateRows=[
        [true,`candidate ${artifactSha}/${artifactBytes} matched literal identity`],
        [count(artifactText,`const ${CORE_NAME}=`)===1&&!artifactText.includes(`window.${CORE_NAME}`)&&!artifactText.includes(`globalThis.${CORE_NAME}`),'private core declaration occurs exact-once without ambient export'],
        [effectsClean(outputEffects),`uninstrumented output realm side effects ${JSON.stringify(outputEffects)}`],
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
        [effectsClean(callEffects)&&listenerExact,'call-trace realm zero side effects and exact listener capture'],
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
    post('phase10b2-realm',{rows,mode,artifactSha,artifactBytes,viewport:{width:innerWidth,height:innerHeight,motion:config.motion},attestation:{protocol:PROTOCOL,realmHtml:config.realmHtml,realmScript:config.realmScript},metrics:clone(metrics)});
  }

  let initialized=false;
  addEventListener('message',event=>{
    const data=event.data;
    if(event.source!==parent||event.origin!==parentOrigin||data?.channel!==CHANNEL||data?.type!=='phase10b2-realm-init'||data?.key!==realmId||data?.token!==config.token||data?.protocol!==PROTOCOL)return;
    if(initialized){post('phase10b2-realm-fatal',{error:'duplicate runner payload',metrics:clone(metrics)});return}
    initialized=true;metrics.payloadMessages++;
    run({payload:data.payload,attestation:data.attestation}).catch(error=>post('phase10b2-realm-fatal',{error:String(error?.stack||error),metrics:clone(metrics)}));
  });
  post('phase10b2-realm-ready',{});
})();
