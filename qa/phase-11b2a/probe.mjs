import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const source=readFileSync(resolve(ROOT,'index.html'),'utf8');
const marker='/* Phase 11B-2a · strict, read-only recovery-file inspection. */';
const boot='const report=load();render();installQaBridge();if(report)runtimeSetTimeout(()=>openOffline(report),250);';
const start=source.indexOf(marker),end=source.lastIndexOf(boot),block=start>=0&&end>start?source.slice(start,end):'';
const SLOT_KEYS=['active','rawBackup','preV2','preV3','preV4','preV5','preV6','preV7','preV8','preV9','preV10','preV11'];
const rows=[],add=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)}),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),sha=value=>createHash('sha256').update(value).digest('hex');
const active={schemaVersion:11,version:'probe',saveMeta:{saveId:'save-probe',revision:17,updatedAt:1907953200000,source:'probe'},privateMemo:'</p><script>bad()</script>',oath:'雪🏡'};
const activeRaw=JSON.stringify(active),slots=Object.fromEntries(SLOT_KEYS.map(name=>[name,name==='active'?activeRaw:name==='preV2'?'opaque {"x":1,"x":2}':null]));
const context={TextEncoder,TextDecoder,DataView,Uint8Array,PHASE_ELEVEN_B_BUNDLE_FORMAT:'everstead-recovery-bundle',PHASE_ELEVEN_B_BUNDLE_VERSION:1,PHASE_ELEVEN_B_MAX_FILE_BYTES:33554432,PHASE_ELEVEN_B_SLOT_NAMES:Object.freeze(SLOT_KEYS),isObject:value=>value!==null&&typeof value==='object'&&!Array.isArray(value),PersistenceError:class PersistenceError extends Error{constructor(code,message){super(message);this.code=code}},classifyRaw:raw=>{try{const value=JSON.parse(raw);return value?.schemaVersion===11?{kind:'current',value}:{kind:'future',value}}catch(error){return{kind:'corrupt',error:error.message}}},phaseTenCCurrentLineage:(_state,physical)=>{context.lineageCalls++;if(physical.preV2Raw==='tampered')throw new Error('lineage mismatch')},lineageCalls:0};
vm.createContext(context);vm.runInContext(`${block}\nglobalThis.probe={strict:phaseElevenBTwoStrictJson,hash:phaseElevenBTwoSha256,inspect:phaseElevenBTwoInspectRecoveryText,file:phaseElevenBTwoInspectRecoveryFile};`,context);
const p=context.probe,bundleFor=(slotValues=slots,overrides={})=>{const payload={product:'Everstead',format:'everstead-recovery-bundle',formatVersion:1,exportedAt:1907953200000,appVersion:'Phase 11B-2a probe',slots:slotValues},bundle={...payload,integrity:{algorithm:'SHA-256',digest:sha(JSON.stringify(payload))},...overrides};return JSON.stringify(bundle)};
const refusal=(id,fn,code=null)=>{try{fn();add(id,false,'accepted')}catch(error){add(id,code===null||error.code===code,`${error.code||error.name}: ${error.message}`)}},asyncRefusal=async(id,fn,code=null)=>{try{await fn();add(id,false,'accepted')}catch(error){add(id,code===null||error.code===code,`${error.code||error.name}: ${error.message}`)}};

add('source-boundary',start>source.indexOf('/* Phase 11B-1')&&end>start&&source.indexOf(marker)===source.lastIndexOf(marker),`${start}/${end}`);
add('pure-inspector-source',!/(?:storageSet|storageRemove|setItem\(|removeItem\(|mutatePersisted|commitPrepared|toast\(|showModal\()/.test(block));
for(const value of ['', 'abc', '雪🏡', '\ud800', 'x'.repeat(1024*1024)])add(`sha-${value.length}-${sha(value).slice(0,8)}`,p.hash(value)===sha(value),p.hash(value));
add('sha-lowercase-64',/^[0-9a-f]{64}$/.test(p.hash('Everstead')));
add('strict-json-primitives',same(p.strict('{"a":[true,false,null,-1.25e+2,"x"]}'),{a:[true,false,null,-125,'x']}));
add('strict-json-depth-64',Array.isArray(p.strict('['.repeat(64)+'0'+']'.repeat(64))));
refusal('strict-json-depth-65',()=>p.strict('['.repeat(65)+'0'+']'.repeat(65)),'strict-json');
refusal('strict-json-duplicate',()=>p.strict('{"a":1,"a":2}'),'strict-json');
refusal('strict-json-escaped-duplicate',()=>p.strict('{"a":1,"\\u0061":2}'),'strict-json');
refusal('strict-json-nested-duplicate',()=>p.strict('{"a":{"x":1,"x":2}}'),'strict-json');
refusal('strict-json-bom',()=>p.strict('\ufeff{}'),'strict-json');
refusal('strict-json-non-json-whitespace',()=>p.strict('{\u00a0"a":1}'),'strict-json');
refusal('strict-json-leading-zero',()=>p.strict('{"a":01}'),'strict-json');
refusal('strict-json-trailing',()=>p.strict('{}x'),'strict-json');
add('strict-json-proto-own-key',Object.keys(p.strict('{"__proto__":1}'))[0]==='__proto__');

const inspected=p.inspect(bundleFor());
add('valid-bundle-inspected',inspected.identity===sha(JSON.stringify({slots}))&&inspected.summary.revision===17&&inspected.summary.checkpointCount===1,inspected.summary);
add('valid-bundle-lineage-called',context.lineageCalls===1,context.lineageCalls);
add('historical-slot-remains-opaque',inspected.bundle.slots.preV2===slots.preV2);
add('safe-summary-excludes-private-data',!JSON.stringify(inspected.summary).includes('script')&&!JSON.stringify(inspected.summary).includes('雪'));

const parsed=JSON.parse(bundleFor());
const wrongOrder={format:parsed.format,product:parsed.product,formatVersion:parsed.formatVersion,exportedAt:parsed.exportedAt,appVersion:parsed.appVersion,slots:parsed.slots,integrity:parsed.integrity};
refusal('bundle-top-key-order',()=>p.inspect(JSON.stringify(wrongOrder)),'bundle-structure');
refusal('bundle-extra-key',()=>p.inspect(JSON.stringify({...parsed,foreign:true})),'bundle-structure');
refusal('bundle-duplicate-key',()=>p.inspect(bundleFor().replace('{','{"product":"Everstead",')),'strict-json');
refusal('bundle-product',()=>p.inspect(bundleFor(slots,{product:'Other'})),'bundle-version');
refusal('bundle-future-format',()=>p.inspect(bundleFor(slots,{formatVersion:2})),'bundle-version');
refusal('bundle-negative-time',()=>p.inspect(bundleFor(slots,{exportedAt:-1})),'bundle-time');
refusal('bundle-long-version',()=>p.inspect(bundleFor(slots,{appVersion:'x'.repeat(129)})),'bundle-app-version');
const reorderedSlots={rawBackup:null,active:activeRaw,...Object.fromEntries(SLOT_KEYS.slice(2).map(name=>[name,slots[name]]))};
refusal('bundle-slot-order',()=>p.inspect(bundleFor(reorderedSlots)),'bundle-slots');
refusal('bundle-slot-type',()=>p.inspect(bundleFor({...slots,preV3:3})),'installation-slot-type');
refusal('bundle-active-required',()=>p.inspect(bundleFor({...slots,active:null})),'installation-active');
refusal('bundle-integrity-case',()=>{const candidate=JSON.parse(bundleFor());candidate.integrity.digest=candidate.integrity.digest.toUpperCase();return p.inspect(JSON.stringify(candidate))},'bundle-integrity');
refusal('bundle-integrity-tamper',()=>{const candidate=JSON.parse(bundleFor());candidate.exportedAt++;return p.inspect(JSON.stringify(candidate))},'bundle-integrity');
const noncanonicalActive=JSON.stringify(active,null,2);refusal('active-must-be-canonical',()=>p.inspect(bundleFor({...slots,active:noncanonicalActive})),'installation-active-canonical');
const duplicateActive=activeRaw.replace('{','{"schemaVersion":11,');refusal('active-duplicate-key',()=>p.inspect(bundleFor({...slots,active:duplicateActive})),'strict-json');
const futureRaw=JSON.stringify({...active,schemaVersion:12});refusal('active-future-schema',()=>p.inspect(bundleFor({...slots,active:futureRaw})),'installation-active-current');
refusal('lineage-tamper',()=>p.inspect(bundleFor({...slots,preV2:'tampered'})));
await asyncRefusal('declared-file-size-limit',()=>p.file({size:33554433,arrayBuffer:async()=>new ArrayBuffer(0)}),'bundle-size');
const invalidUtf8=new Uint8Array([0xc3,0x28]);await asyncRefusal('fatal-file-utf8',()=>p.file({size:2,arrayBuffer:async()=>invalidUtf8.buffer}),'bundle-utf8');

export function result(){const passed=rows.filter(row=>row.pass).length;return{phase:'11B-2a',total:rows.length,passed,failed:rows.length-passed,rows,artifact:{sha256:sha(readFileSync(resolve(ROOT,'index.html'))),byteLength:readFileSync(resolve(ROOT,'index.html')).length}}}
const output=result();if(fileURLToPath(import.meta.url)===resolve(process.argv[1])){for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` · ${row.detail}`:''}`);console.log(`Phase 11B-2a probe: ${output.passed}/${output.total}`);if(output.failed)process.exitCode=1}
