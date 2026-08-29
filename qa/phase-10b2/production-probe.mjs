import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const ARTIFACT_PATH=resolve(ROOT,'index.html');
const PREIMAGE_SHA='717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed',PREIMAGE_BYTES=18916682;
const BOOT='const report=load();render();installQaBridge();if(report)runtimeSetTimeout(()=>openOffline(report),250);';
const CORE_NAME='PHASE_TEN_B_TWO_GOLD_CORE';
const METHOD_ORDER=Object.freeze(['familyBuildingBonus','neutralHookBonus','buildingUpgradeCost','buildingRateComponents','durationGold','totalRate','offlineTotals']);
const WRAPPERS=Object.freeze(['familyBuildingBonusComponents','economyHookBonus','buildingUpgradeCost','buildingRateComponents','totalRate','offlineClaimPreview']);
const sha=value=>createHash('sha256').update(value).digest('hex');
const own=(value,key)=>Object.prototype.hasOwnProperty.call(value,key);
const clone=value=>value===undefined?undefined:structuredClone(value);
const count=(source,needle)=>source.split(needle).length-1;
const html=readFileSync(ARTIFACT_PATH),source=html.toString('utf8'),artifact={sha256:sha(html),byteLength:html.length};
const mode=artifact.sha256===PREIMAGE_SHA&&artifact.byteLength===PREIMAGE_BYTES?'preimage':source.includes(`const ${CORE_NAME}=`)?'candidate':'refused';
if(mode==='refused')throw new Error('Phase 10B-2 probe refuses unknown production artifact');
if(count(source,BOOT)!==1)throw new Error('Phase 10B-2 probe boot anchor is not exact-once');
for(const name of WRAPPERS)if(count(source,`function ${name}(`)!==1)throw new Error('Phase 10B-2 probe wrapper anchor is not exact-once: '+name);

function realm(kind='output'){
  if(!['output','call-trace','mutation'].includes(kind))throw new Error('Unknown Phase 10B-2 realm kind');
  const facade=`const __p10b2Core=typeof ${CORE_NAME}==='object'&&${CORE_NAME}!==null?${CORE_NAME}:null;Object.defineProperty(window,'__P10B2_PROBE__',{value:Object.freeze({mode:${JSON.stringify(mode)},core:__p10b2Core,wrappers:Object.freeze({family:(id,state)=>familyBuildingBonusComponents(id,state),hook:name=>economyHookBonus(name),upgrade:level=>buildingUpgradeCost(level),rate:(id,state,at)=>buildingRateComponents(id,state,at),total:(state,at)=>totalRate(state,at),offline:(at,state)=>offlineClaimPreview(at,state)})}),enumerable:false,writable:false,configurable:false});`;
  const transformed=source.replace(BOOT,facade),restored=Buffer.from(transformed.replace(facade,BOOT));
  if(!restored.equals(html)||sha(restored)!==artifact.sha256)throw new Error('Phase 10B-2 probe inverse restoration mismatch');
  const start=transformed.indexOf('<script>'),end=transformed.lastIndexOf('</script>');if(start<0||end<start)throw new Error('Production script boundary missing');
  const effects={storage:[],ui:[],timer:[],network:[],listeners:[]},blocked=(bucket,name)=>(...args)=>{effects[bucket].push([name,args.length]);throw new Error('prohibited '+name)},listener=scope=>(name,handler)=>effects.listeners.push([scope,name,typeof handler]);
  const storage=Object.freeze({getItem:blocked('storage','getItem'),setItem:blocked('storage','setItem'),removeItem:blocked('storage','removeItem')});
  const window={__EVERSTEAD_RUNTIME__:Object.freeze({storage,clock:Object.freeze({now:()=>1788026400000,setTimeout:blocked('timer','runtimeSetTimeout'),clearTimeout:blocked('timer','runtimeClearTimeout')})}),localStorage:Object.freeze({native:true}),location:Object.freeze({protocol:'https:',hostname:'invalid.example',search:''}),URLSearchParams,addEventListener:listener('window'),confirm:blocked('ui','confirm'),open:blocked('ui','open'),fetch:blocked('network','fetch'),XMLHttpRequest:blocked('network','XMLHttpRequest'),WebSocket:blocked('network','WebSocket')};
  const document=new Proxy(Object.freeze({addEventListener:listener('document')}),{get(target,key){if(key in target)return target[key];return blocked('ui','document.'+String(key))}});
  const context={window,document,globalThis:null,URLSearchParams,console:Object.freeze({log(){},warn:blocked('ui','warn'),error:blocked('ui','error')}),addEventListener:window.addEventListener,setTimeout:blocked('timer','setTimeout'),clearTimeout:blocked('timer','clearTimeout'),fetch:window.fetch,XMLHttpRequest:window.XMLHttpRequest,WebSocket:window.WebSocket};context.globalThis=context;window.window=window;window.document=document;
  vm.createContext(context,{codeGeneration:{strings:false,wasm:false}});new vm.Script(transformed.slice(start+8,end),{filename:`phase10b2-${kind}.js`}).runInContext(context,{timeout:30000});
  const inherited=['__EVERSTEAD_QA__','__EVERSTEAD_PHASE6_QA__','__EVERSTEAD_PHASE7_QA__','__EVERSTEAD_PHASE9_QA__'].filter(key=>Reflect.has(window,key));
  if(effects.storage.length||effects.ui.length||effects.timer.length||effects.network.length||inherited.length)throw new Error('Phase 10B-2 probe realm side effect or inherited hook');
  if(JSON.stringify(effects.listeners)!==JSON.stringify([['window','storage','function'],['window','storage','function'],['window','storage','function']]))throw new Error('Phase 10B-2 listener capture drift');
  return{probe:window.__P10B2_PROBE__,effects,restoredSha256:sha(restored),restoredByteLength:restored.length};
}

function resolvePath(fixture,path){if(typeof path!=='string'||!path.startsWith('$.'))throw new TypeError('Invalid wrapper argument path');let value=fixture;for(const key of path.slice(2).split('.')){if(value===null||typeof value!=='object'||!own(value,key))throw new TypeError('Unresolved wrapper argument path '+path);value=value[key]}return value}
function invokeWrapper(probe,trace,fixture){const args=trace.wrapper.argumentPaths.map(path=>resolvePath(fixture,path)),w=probe.wrappers;if(trace.wrapper.selector==='familyBuildingBonusComponents')return w.family(...args);if(trace.wrapper.selector==='economyHookBonus')return w.hook(...args);if(trace.wrapper.selector==='buildingUpgradeCost')return w.upgrade(...args);if(trace.wrapper.selector==='buildingRateComponents')return w.rate(...args);if(trace.wrapper.selector==='totalRate')return w.total(...args);if(trace.wrapper.selector==='offlineClaimPreview')return w.offline(...args);throw new TypeError('Unknown wrapper selector')}
export function probeIdentity(){return Object.freeze({mode,artifactSha256:artifact.sha256,artifactByteLength:artifact.byteLength,preimageSha256:PREIMAGE_SHA,preimageByteLength:PREIMAGE_BYTES,corePresent:mode==='candidate',bootAnchorCount:count(source,BOOT),wrapperAnchorCount:WRAPPERS.reduce((sum,name)=>sum+count(source,`function ${name}(`),0),methodOrder:METHOD_ORDER})}
let outputCache=null;
export function createOutputRealm(){return outputCache??=realm('output')}
export function createCallTraceRealm(){const result=realm('call-trace');return Object.freeze({...result,status:mode==='candidate'?'READY':'PENDING',reason:mode==='candidate'?null:'private kernel is intentionally absent from accepted preimage'})}
export function createMutationRealm(mutationId,subcase='ordinary-one-defect'){if(!Number.isInteger(mutationId)||mutationId<1||mutationId>48)throw new TypeError('Invalid mutation row');if(mutationId!==48&&subcase!=='ordinary-one-defect'||mutationId===48&&!['surface-export','surface-mutability','ambient-state','guard-relocation'].includes(subcase))throw new TypeError('Invalid mutation subcase');const result=realm('mutation');return Object.freeze({...result,status:mode==='candidate'?'READY':'PENDING',mutationId,subcase,reason:mode==='candidate'?null:'candidate mutation window is intentionally absent from accepted preimage'})}
export function evaluateWrapperTrace(trace,fixture){const {probe}=createOutputRealm();return clone(invokeWrapper(probe,trace,clone(fixture)))}
export function evaluateKernel(method,input){if(!METHOD_ORDER.includes(method))throw new TypeError('Unknown kernel method');const {probe}=createOutputRealm();if(!probe.core)return Object.freeze({status:'PENDING',reason:'private kernel is intentionally absent from accepted preimage'});return clone(probe.core[method](clone(input)))}
export function sourceBoundary(){return Object.freeze({mode,preimageExact:mode==='preimage',candidateMarker:mode==='candidate',restorationExact:true,allowedWindows:7,wrapperBodies:6,kernelInsertion:1,unchangedWrapperNames:['familyBuildingAssignment','buildingRate','nextLocalMidnight']})}
