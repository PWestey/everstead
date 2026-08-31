import {createHash,webcrypto} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runPhaseElevenAProbe} from '../phase-11a/probe.mjs';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const PRODUCTION_PARENT='f36a84eca29820dfc1a29efbe93309bef6e9f762';
const PHASE_ELEVEN_A_CANDIDATE='7c9e370f37830eaf9f756972dbbc1744d68e0270';
const MARKER='/* Phase 11B-1 · read-only save health, recovery bundle download, and migration history. */';
const FINAL_BOOT='const report=load();render();installQaBridge();if(report)runtimeSetTimeout(()=>openOffline(report),250);';
const SLOT_KEYS=['active','rawBackup','preV2','preV3','preV4','preV5','preV6','preV7','preV8','preV9','preV10','preV11'];
const TOP_KEYS=['product','format','formatVersion','exportedAt','appVersion','slots','integrity'];
const rows=[];
const add=(id,actual,detail='')=>rows.push({id,actual:Boolean(actual),expected:true,pass:Boolean(actual),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const sha=value=>createHash('sha256').update(value).digest('hex');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const source=readFileSync(resolve(ROOT,'index.html'),'utf8');
const phaseElevenA=execFileSync('git',['show',`${PHASE_ELEVEN_A_CANDIDATE}:index.html`],{cwd:ROOT,encoding:'utf8',maxBuffer:32*1024*1024});
const markerIndex=source.indexOf(MARKER),bootIndex=source.lastIndexOf(FINAL_BOOT),block=markerIndex>=0&&bootIndex>markerIndex?source.slice(markerIndex,bootIndex):'';
const sourceLines=source.split('\n'),lineContaining=needle=>{const line=sourceLines.find(item=>item.includes(needle));if(!line)throw new Error(`Missing source line: ${needle}`);return line};

add('production-parent-reachable',execFileSync('git',['merge-base','--is-ancestor',PRODUCTION_PARENT,'HEAD'],{cwd:ROOT,encoding:'utf8'})==='');
add('phase11a-candidate-reachable',execFileSync('git',['merge-base','--is-ancestor',PHASE_ELEVEN_A_CANDIDATE,'HEAD'],{cwd:ROOT,encoding:'utf8'})==='');
add('phase11b1-final-insertion-boundary',markerIndex>source.indexOf('/* Phase 11A · daily-use clarity')&&bootIndex>markerIndex&&source.indexOf(MARKER)===source.lastIndexOf(MARKER),`${markerIndex}/${bootIndex}`);
const stripped=markerIndex>=0&&bootIndex>markerIndex?source.slice(0,markerIndex)+source.slice(bootIndex):'';
add('phase11a-production-byte-semantic-preimage',stripped===phaseElevenA,`${Buffer.byteLength(stripped)}/${Buffer.byteLength(phaseElevenA)}`);
add('phase11b1-read-only-source-boundary',block&&!/(?:storageSet|storageRemove|commitPrepared|mutatePersisted|setItem\(|removeItem\()/.test(block),block.length);
add('bundle-constants-source',block.includes("PHASE_ELEVEN_B_BUNDLE_FORMAT='everstead-recovery-bundle'")&&block.includes('PHASE_ELEVEN_B_BUNDLE_VERSION=1')&&block.includes('PHASE_ELEVEN_B_MAX_FILE_BYTES=33554432'));
add('bundle-slot-order-source',block.includes(`Object.freeze(['${SLOT_KEYS.join("','")}'])`));
add('health-complete-lineage-source',block.includes('phaseTenCReadProtectedSlots()')&&block.includes('phaseTenCCurrentLineage(active.value,slots)')&&block.includes("slots.stagingRaw!==null")&&block.includes("active.value.schemaVersion!==11"));
add('download-privacy-boundary-source',block.includes('Recovery files contain your Oaths, private memos, links, and full progress.')&&block.includes('Recovery diagnostics contain private save data')&&!block.includes('<textarea'));

const assets=[...source.matchAll(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g)].map(match=>match[0]);
const phaseElevenAAssets=[...phaseElevenA.matchAll(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g)].map(match=>match[0]);
add('embedded-assets-byte-identical',assets.length===5&&same(assets,phaseElevenAAssets),`${assets.length} · ${sha(assets.join('\n'))}`);

const coreEnd=block.indexOf('function phaseElevenBDateStamp'),core=coreEnd>0?block.slice(0,coreEnd):'';
const activeRaw=JSON.stringify({schemaVersion:11,saveMeta:{saveId:'probe',revision:7}}),slotFixture={activeRaw,backupRaw:'raw-backup',preV2Raw:'pre-v2',preV3Raw:null,preV4Raw:'pre-v4',preV5Raw:null,preV6Raw:'pre-v6',preV7Raw:null,preV8Raw:'pre-v8',preV9Raw:null,preV10Raw:'pre-v10',preV11Raw:'pre-v11',stagingRaw:null};
const context={crypto:webcrypto,TextEncoder,VERSION:'Phase 11B-1 probe',runtimeNow:()=>1907953200000,phaseTenCReadProtectedSlots:()=>slotFixture,classifyRaw:raw=>raw===activeRaw?{kind:'current',schemaVersion:11,value:JSON.parse(raw)}:{kind:'invalid'},phaseTenCCurrentLineage:()=>{context.lineageCalls++},lineageCalls:0,PersistenceError:class PersistenceError extends Error{constructor(code,message){super(message);this.code=code}}};
vm.createContext(context);
vm.runInContext(`${core}\nglobalThis.__phase11b1Probe=async()=>{const health=phaseElevenBReadHealth(),bundle=await phaseElevenBRecoveryBundle(1907953200000);let badTime=null;try{await phaseElevenBRecoveryBundle(-1)}catch(error){badTime={code:error.code,message:error.message}}return{health,bundle,badTime}}`,context);
const pure=await context.__phase11b1Probe();
const expectedSlots={active:slotFixture.activeRaw,rawBackup:slotFixture.backupRaw,preV2:slotFixture.preV2Raw,preV3:slotFixture.preV3Raw,preV4:slotFixture.preV4Raw,preV5:slotFixture.preV5Raw,preV6:slotFixture.preV6Raw,preV7:slotFixture.preV7Raw,preV8:slotFixture.preV8Raw,preV9:slotFixture.preV9Raw,preV10:slotFixture.preV10Raw,preV11:slotFixture.preV11Raw};
const {integrity,...payload}=pure.bundle,expectedDigest=sha(JSON.stringify(payload));
add('canonical-bundle-topology',same(Object.keys(pure.bundle),TOP_KEYS)&&same(Object.keys(pure.bundle.slots),SLOT_KEYS)&&same(Object.keys(pure.bundle.integrity),['algorithm','digest']),Object.keys(pure.bundle));
add('canonical-bundle-exact-slots',same(pure.bundle.slots,expectedSlots)&&!Object.hasOwn(pure.bundle.slots,'staging'));
add('canonical-bundle-sha256',integrity.algorithm==='SHA-256'&&integrity.digest===expectedDigest&&/^[0-9a-f]{64}$/.test(integrity.digest),integrity.digest);
add('canonical-bundle-metadata',pure.bundle.product==='Everstead'&&pure.bundle.format==='everstead-recovery-bundle'&&pure.bundle.formatVersion===1&&pure.bundle.exportedAt===1907953200000&&pure.bundle.appVersion==='Phase 11B-1 probe');
add('health-count-and-lineage',pure.health.ok===true&&pure.health.present===7&&pure.health.total===11&&context.lineageCalls===2,`${pure.health.present}/${pure.health.total} · ${context.lineageCalls}`);
add('invalid-time-refused-before-read',pure.badTime?.code==='bundle-time',pure.badTime);
slotFixture.stagingRaw='occupied';const occupied=vm.runInContext('phaseElevenBReadHealth()',context);add('occupied-staging-fails-closed',occupied.ok===false&&occupied.error.includes('staged'),occupied.error);slotFixture.stagingRaw=null;

const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const maliciousId='<img data-history-xss src=x>',maliciousSource='<svg data-source-xss onload=x>';
const historyContext={S:{saveMeta:{appliedMigrations:[{id:maliciousId,from:4,to:5,appliedAt:1907953200000,migrationSource:maliciousSource}],retainedCheckpointLineage:null}},PHASE_ELEVEN_B_MIGRATION_LABELS:Object.freeze({}),esc:escape,runtimeDate:value=>new Date(value)};
vm.createContext(historyContext);vm.runInContext(`${lineContaining('function phaseElevenBMigrationHistoryHtml')}\nglobalThis.__html=phaseElevenBMigrationHistoryHtml()`,historyContext);
add('migration-history-escapes-dynamic-fields',historyContext.__html.includes('&lt;img')&&historyContext.__html.includes('&lt;svg')&&!historyContext.__html.includes('<img')&&!historyContext.__html.includes('<svg'),historyContext.__html);
const healthContext={phaseElevenBReadHealth:()=>({ok:true,active:{saveMeta:{revision:9,updatedAt:1907953200000,source:maliciousSource,saveId:maliciousId}},slots:{activeRaw:'active'}}),esc:escape,runtimeDate:value=>new Date(value),rawIdentity:()=>'<b data-identity-xss>'};
vm.createContext(healthContext);vm.runInContext(`${lineContaining('function phaseElevenBSaveHealthHtml')}\nglobalThis.__html=phaseElevenBSaveHealthHtml()`,healthContext);
add('save-health-escapes-dynamic-fields',healthContext.__html.includes('&lt;svg')&&healthContext.__html.includes('&lt;img')&&healthContext.__html.includes('&lt;b')&&!healthContext.__html.includes('<svg')&&!healthContext.__html.includes('<img')&&!healthContext.__html.includes('<b data-identity'),healthContext.__html);

const predecessor=await runPhaseElevenAProbe(),predecessorFailures=predecessor.rows.filter(row=>!row.pass);
for(const row of predecessor.rows)add(`phase11a-${row.id}`,row.pass,row.detail);
add('phase11a-semantic-probe-168-of-168',predecessor.rows.length===168&&predecessorFailures.length===0,predecessor.evidence);
const predecessorGate=spawnSync(process.execPath,['qa/phase-11a/verify.mjs'],{cwd:ROOT,encoding:'utf8',maxBuffer:32*1024*1024}),gate=JSON.parse(predecessorGate.stdout),failureIds=gate.results.filter(row=>!row.pass).map(row=>row.id).sort(),always=['additive-owned-paths-only','exact-candidate-artifact','phase11a-checksums'],allowed=[...always,'candidate-last-production-commit','historical-qa-byte-frozen'];
add('phase11a-predecessor-supersessions-enumerated',always.every(id=>failureIds.includes(id))&&failureIds.every(id=>allowed.includes(id)),failureIds);

export async function runPhaseElevenBOneProbe(){return{rows,evidence:{total:rows.length,passed:rows.filter(row=>row.pass).length,failed:rows.filter(row=>!row.pass).length,artifact:{sha256:sha(Buffer.from(source)),byteLength:Buffer.byteLength(source)},assetAggregateSha256:sha(assets.join('\n')),phase11aRows:predecessor.rows.length,predecessorSupersessions:failureIds,bundleDigest:integrity.digest}}}
if(fileURLToPath(import.meta.url)===resolve(process.argv[1])){const result=await runPhaseElevenBOneProbe();for(const row of result.rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` · ${row.detail}`:''}`);console.log(`Phase 11B-1 probe: ${result.evidence.passed}/${result.evidence.total}`);if(result.evidence.failed)process.exitCode=1}
