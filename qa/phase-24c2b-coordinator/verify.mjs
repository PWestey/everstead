import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const ROOT=resolve(fileURLToPath(new URL('../../',import.meta.url))),PACKAGE_ONLY=process.argv.includes('--package-only'),rows=[];
const rel=path=>resolve(ROOT,path),text=path=>readFileSync(rel(path),'utf8'),json=path=>JSON.parse(text(path)),record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail}),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),sha=path=>createHash('sha256').update(readFileSync(rel(path))).digest('hex'),shaText=value=>createHash('sha256').update(value).digest('hex');
const f=json('qa/phase-24c2b-coordinator/contract.json'),realm=text('qa/phase-24c2b-coordinator/realm.js'),runner=text('qa/phase-24c2b-coordinator/runner.js'),page=text('qa/phase-24c2b-coordinator/index.html'),readme=text('qa/phase-24c2b-coordinator/README.md');

record('contract-exact-phase-schema-status',f.contractVersion===1&&f.phase==='24C-2B'&&f.status==='private-coordinator-gate'&&f.schemaVersion===13);
record('contract-exact-baseline-index',f.baseline.indexSha256==='6109805093ee78f075257526b4822cf86c9ca22dbd2a2a05ab3ef7b0bcb8c5f3');
record('contract-exact-frozen-predecessor-sources',same(f.baseline.productionSourceSha256,{'src/phase18-19-runtime.js':'26686c97cc7c2a617224b8a287ab92933222e137c53bc309dedad6102d68df2e','src/phase23-companion-runtime.js':'fd1455fef5cb5632fc53b055c935848e6b6f13f40175518520f0f4aa548dde40','src/phase24-scaling-authority.js':'819fd4e308a98c699ac01a0c3df780eab11e777d933038b118850679d0f39d5c'}));
record('contract-exact-bridge-interface',f.bridge.global==='__EVERSTEAD_PHASE_24C2B_QA__'&&f.bridge.version==='phase-24c2b-coordinator-qa-v1'&&same(f.bridge.readMethods,['snapshot'])&&same(f.bridge.destructiveMethods,['resetFresh','probeRefusal','probeOpeningRefusal','probeSuccess','probeException','probePersistenceError','probeLookalike','probeMalformedRefusal','probeAuthenticWithoutOptIn']));
record('contract-exact-required-marked-blocks',f.markers.prefix==='Phase 24C-2B'&&same(f.markers.requiredBlocks,['coordinator authority','QA bridge','QA bridge install']));
record('contract-schema13-storage-and-opening-authority',f.storage.activeKey==='oathforge_new_world_proto_v01'&&f.storage.stagingKey===f.storage.activeKey+'__staging'&&f.openingAdvanceMs===93600000&&Number.isSafeInteger(f.frozenNow));
record('contract-two-authorized-four-denial-realms',f.realms.length===6&&f.realms.filter(item=>item.expectedBridge).length===2&&f.realms.filter(item=>!item.expectedBridge).length===4&&f.realms.some(item=>item.width===320&&item.height===568&&item.expectedBridge)&&f.realms.some(item=>item.width===390&&item.height===844&&item.copyScale===1.3&&item.reducedMotion===true&&item.expectedBridge));
record('contract-denies-each-required-runtime-boundary',f.realms.some(item=>!item.expectedBridge&&!item.query)&&f.realms.some(item=>!item.expectedBridge&&!item.allowDestructive)&&f.realms.some(item=>!item.expectedBridge&&!item.isolatedStorage)&&f.realms.some(item=>!item.expectedBridge&&!item.supplyStorage));
record('contract-durable-sources-stay-unloaded',same(f.durableGlobalsForbidden,['EVERSTEAD_PHASE24C_DEFINITIONS','EVERSTEAD_PHASE24C_FOUNDATION'])&&same(f.durableLoadersForbidden,['src/phase24c-durable-definitions.js','src/phase24c-durable-foundation.js']));
record('runner-real-candidate-isolated-memory-realms',realm.includes("fetch('../../index.html'")&&realm.includes('__EVERSTEAD_RUNTIME__')&&realm.includes('memoryStorage')&&realm.includes('__P24C2B_SLOTS__')&&realm.includes('__P24C2B_WRITES__')&&!realm.includes('fakeCoordinator'));
record('runner-consumes-only-bounded-bridge-surface',realm.includes("read?.snapshot")&&f.bridge.destructiveMethods.every(name=>realm.includes(name))&&['resetFresh','probeRefusal','probeOpeningRefusal','probeSuccess'].every(name=>realm.includes(`call('${name}')`))&&realm.includes('blockingControl(name,label')&&!/\.mutate\s*\(|genericMutator|refusalToken|refusalMarker/.test(realm));
record('runner-independent-zero-write-slot-proof',['zeroWrites','window.__P24C2B_WRITES__.length','window.__P24C2B_SLOTS__.get(f.storage.activeKey)','window.__P24C2B_SLOTS__.get(f.storage.stagingKey)','same(before.slots,after.slots)'].every(value=>realm.includes(value)));
record('runner-refusal-state-persistence-ui-focus-proof',['refusal-result-is-explicit-nonerror','refusal-live-state-raw-revision-persistence-ui-focus-unchanged','before.appHtml===after.appHtml','before.overlayHtml===after.overlayHtml','before.toastText===after.toastText','same(before.focus,after.focus)','same(before.persistence,after.persistence)'].every(value=>realm.includes(value)));
record('runner-opening-accrual-discard-proof',['opening-refusal-result-discards-returned-accrual','opening-refusal-internal-full-invariant-proof','unchangedProof(opening)','opening-refusal-zero-active-staging-successful-writes','opening-refusal-live-state-raw-revision-persistence-ui-focus-unchanged'].every(value=>realm.includes(value)));
record('runner-success-and-exception-controls',['success-control-still-commits','successAfter.revision===successBefore.revision+1',"blockingControl('probeException','ordinary-exception')","blockingControl('probePersistenceError','persistence-error'","blockingControl('probeLookalike','lookalike-refusal')","blockingControl('probeMalformedRefusal','malformed-refusal')","blockingControl('probeAuthenticWithoutOptIn','authentic-without-opt-in')"].every(value=>realm.includes(value)));
record('runner-schema13-no-durable-loader-global',['fresh-live-schema-remains-13','final-schema13-no-durable-activation','durable-globals-remain-absent','durable-loaders-remain-absent'].every(value=>realm.includes(value)));
record('runner-authorization-denials-and-native-storage-proof',['qa-bridge-absent-outside-exact-realm','denied-no-query','denied-no-destructive-auth','denied-nonisolated','denied-native-storage','exact-captured-native-storage-is-rejected-by-qa-boundary','zero-native-storage-accesses'].every(value=>realm.includes(value)||runner.includes(value)||JSON.stringify(f).includes(value)));
record('browser-page-autostarts-and-publishes',runner.includes('run();')&&runner.includes('__EVERSTEAD_PHASE_24C2B_RESULT__')&&page.includes('Phase 24C-2B · Zero-write coordinator gate'));
record('readme-package-only-is-not-acceptance',readme.includes('package-only PASS is not production acceptance')||readme.includes('package-only PASS is not production acceptance'.replace('PASS','Pass')));

for(const file of ['runner.js','realm.js','verify.mjs']){const checked=spawnSync(process.execPath,['--check',`qa/phase-24c2b-coordinator/${file}`],{cwd:ROOT,encoding:'utf8'});record(`syntax-${file}`,checked.status===0,checked.stderr.trim())}

const checksumPath='qa/phase-24c2b-coordinator/checksums.sha256';
if(existsSync(rel(checksumPath))){const checksumRows=text(checksumPath).trim().split(/\r?\n/).filter(Boolean),bad=[];for(const line of checksumRows){const match=/^([0-9a-f]{64})  (.+)$/.exec(line);if(!match||!existsSync(rel(match?.[2]||''))||sha(match[2])!==match[1])bad.push(line)}record('package-checksums-exact',bad.length===0&&checksumRows.length===7,bad)}else record('package-checksums-exact',false,'checksums.sha256 missing');
record('contract-and-result-documents-present',existsSync(rel('docs/PHASE_24C2B_COORDINATOR_QA_CONTRACT.md'))&&existsSync(rel('docs/PHASE_24C2B_COORDINATOR_QA_RESULT.md')));
record('accepted-phase24a-manifest-byte-frozen',existsSync(rel('qa/phase-24a-scaling-authority/checksums.sha256'))&&sha('qa/phase-24a-scaling-authority/checksums.sha256')===f.baseline.phase24aManifestSha256,existsSync(rel('qa/phase-24a-scaling-authority/checksums.sha256'))?sha('qa/phase-24a-scaling-authority/checksums.sha256'):'missing');
for(const [path,expected] of Object.entries(f.baseline.productionSourceSha256))record(`accepted-source-byte-frozen-${path.replaceAll('/','-')}`,existsSync(rel(path))&&sha(path)===expected,existsSync(rel(path))?sha(path):'missing');

function markedBlocks(source){
  const pattern=/(^[\t ]*)?\/\* Phase 24C-2B ([^\r\n*]+?) BEGIN \*\/[\s\S]*?\/\* Phase 24C-2B \2 END \*\/(\r?\n)?/gm,blocks=[];
  let coordinatorProjection=null;
  const normalized=source.replace(pattern,(full,_linePrefix,name,eol)=>{
    blocks.push({name,full});
    if(name!=='coordinator authority')return'';
    const current=full.match(/function mutatePersisted[\s\S]*?(?=\r?\n\/\* Phase 24C-2B coordinator authority END \*\/)/)?.[0]||'';
    coordinatorProjection=current.replace(',allowRefusal=false','').replace(',allowRefusal===true?persistedMutationRefusal:undefined','').replace("if(allowRefusal===true&&isPersistedMutationRefusal(error))return{ok:false,refused:true,reason:error.reason,error:null,value:null,accrual:null};",'');
    return coordinatorProjection+(eol||'');
  });
  return{normalized,blocks,coordinatorProjection};
}
function inlineScriptSyntax(source){const failures=[];for(const [index,match] of [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries()){if(!match[1].trim())continue;const checked=spawnSync(process.execPath,['--check'],{cwd:ROOT,encoding:'utf8',input:match[1]});if(checked.status!==0)failures.push({index,error:checked.stderr.trim()})}return failures}

if(!PACKAGE_ONLY){
  const candidate=text('index.html'),marked=markedBlocks(candidate),names=marked.blocks.map(item=>item.name),beginCount=(candidate.match(/\/\* Phase 24C-2B [^\r\n*]+? BEGIN \*\//g)||[]).length,endCount=(candidate.match(/\/\* Phase 24C-2B [^\r\n*]+? END \*\//g)||[]).length;
  record('candidate-all-markers-balanced-and-recognized',beginCount===endCount&&beginCount===marked.blocks.length&&same([...new Set(names)].sort(),[...f.markers.requiredBlocks].sort()),{beginCount,endCount,matched:marked.blocks.length,names});
  record('candidate-normalizes-exactly-to-accepted-index',shaText(marked.normalized)===f.baseline.indexSha256,{normalizedSha256:shaText(marked.normalized),expected:f.baseline.indexSha256});
  const block=name=>marked.blocks.find(item=>item.name===name)?.full||'',authority=block('coordinator authority'),qa=block('QA bridge'),mutatorAt=authority.indexOf('value=mutator(S,now,allowRefusal===true?persistedMutationRefusal:undefined)'),lastSeenAt=authority.indexOf('S.lastSeen=',mutatorAt),catchAt=authority.indexOf('catch(error){S=before',lastSeenAt),refusalAt=authority.indexOf('if(allowRefusal===true&&isPersistedMutationRefusal(error))',catchAt),stagingAt=authority.indexOf("if(error?.code==='staging-occupied')",refusalAt),blockedAt=authority.indexOf("blocked(error.code||'write-failure'",stagingAt);
  record('candidate-private-unforgeable-refusal-authority',authority.includes('new WeakSet()')&&authority.includes('Object.freeze')&&authority.includes('PERSISTED_MUTATION_REFUSAL_SIGNALS.add(signal)')&&authority.includes('PERSISTED_MUTATION_REFUSAL_SIGNALS.has(value)')&&authority.includes("typeof reason!=='string'")&&authority.includes('reason.length>128')&&!/Object\.defineProperty\s*\(\s*(?:window|globalThis)/.test(authority)&&!/window\.|globalThis\./.test(authority));
  record('candidate-opt-in-refusal-short-circuits-before-metadata-and-commit',mutatorAt>=0&&lastSeenAt>mutatorAt&&catchAt>lastSeenAt&&refusalAt>catchAt&&stagingAt>refusalAt&&blockedAt>stagingAt&&authority.includes('S=before;if(allowRefusal===true')&&authority.includes('ok:false,refused:true')&&authority.includes('error:null,value:null,accrual:null')&&!authority.slice(refusalAt,stagingAt).includes('render(')&&!authority.slice(refusalAt,stagingAt).includes('commitPrepared')&&!authority.slice(refusalAt,stagingAt).includes('storageSet'));
  record('candidate-success-and-exception-predecessor-paths-retained',authority.includes("S=commitPrepared(candidate,PERSISTED_RAW,{source:writeSource})")&&authority.includes("if(error?.code==='staging-occupied')return{ok:false,error}")&&authority.includes("blocked(error.code||'write-failure'")&&authority.includes('if(renderAfter)render()')&&marked.coordinatorProjection.includes('value=mutator(S,now)'));
  record('candidate-qa-bridge-exact-bounded-interface',qa.includes(f.bridge.global)&&qa.includes(f.bridge.version)&&f.bridge.readMethods.every(name=>qa.includes(name))&&f.bridge.destructiveMethods.every(name=>qa.includes(name))&&!/genericMutator|refusalToken|refusalMarker/.test(qa));
  record('candidate-qa-bridge-requires-full-existing-boundary',qa.includes('QA_BRIDGE_ALLOWED')&&qa.includes('QA_ALLOW_DESTRUCTIVE')&&qa.includes('requireQaDestructiveAuthorization')&&candidate.includes("segment=>segment==='qa=1'")&&candidate.includes("Object.hasOwn(RUNTIME_QA,'allowDestructive')")&&candidate.includes("RUNTIME_QA.allowDestructive===true")&&candidate.includes("Object.hasOwn(RUNTIME_QA,'isolatedStorage')")&&candidate.includes("RUNTIME_QA.isolatedStorage===true")&&candidate.includes('STORAGE_SOURCE!==NATIVE_STORAGE'));
  record('candidate-qa-bridge-nonenumerable-guarded-getter',qa.includes('Object.defineProperty')&&qa.includes('enumerable:false')&&qa.includes('get:')&&qa.includes('qaBridgeAllowed()'));
  record('candidate-schema-remains-13',candidate.includes('CURRENT_SCHEMA_VERSION=13')&&!candidate.includes('CURRENT_SCHEMA_VERSION=14'));
  record('candidate-durable-sources-not-loaded',f.durableLoadersForbidden.every(path=>!new RegExp(`<script[^>]+${path.replaceAll('.','\\.')}`).test(candidate)));
  record('candidate-no-unmarked-durable-global-activation',f.durableGlobalsForbidden.every(name=>!marked.normalized.includes(name)));
  const syntaxFailures=inlineScriptSyntax(candidate);record('candidate-inline-script-syntax',syntaxFailures.length===0,syntaxFailures);
}

const passed=rows.filter(item=>item.pass).length,failed=rows.length-passed;
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` :: ${typeof row.detail==='string'?row.detail:JSON.stringify(row.detail)}`:''}`);
console.log(`SUMMARY ${passed}/${rows.length} passed; ${failed} failed; mode=${PACKAGE_ONLY?'package-only':'candidate'}`);
process.exitCode=failed?1:0;
