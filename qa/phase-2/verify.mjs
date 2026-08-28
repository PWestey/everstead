import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const qaRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(qaRoot, '..', '..');
const read = path => readFileSync(resolve(repoRoot, path));
const htmlBytes = read('index.html');
const html = htmlBytes.toString('utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const scenarios = JSON.parse(read('qa/phase-2/scenarios.json'));
const manifest = JSON.parse(read('qa/phase-2/current-manifest.json'));
const schemaOneRaw = read('qa/gate-0b/fixtures/current-v1.txt').toString('utf8');
const legacyRaw = read('qa/fixtures/representative-v0.1.txt').toString('utf8');
const futureRaw = read('qa/gate-0b/fixtures/future-v99.txt').toString('utf8');
const corruptRaw = read('qa/gate-0b/fixtures/corrupt-json.txt').toString('utf8');
const keys = scenarios.storageKeys;
const checks = [];
const check = (id, pass, detail = '') => checks.push({ id, pass:Boolean(pass), detail:String(detail) });
const clone = value => JSON.parse(JSON.stringify(value));
const sha256 = value => createHash('sha256').update(value).digest('hex');
const current = raw => { try { const value = JSON.parse(raw); return value?.schemaVersion === 3 ? value : null; } catch { return null; } };
const schema = (raw, version) => { try { const value = JSON.parse(raw); return value?.schemaVersion === version ? value : null; } catch { return null; } };

function rawIdentity(raw) {
  if (raw == null) return 'null:0:00000000';
  let hash = 2166136261;
  for (let index = 0; index < raw.length; index += 1) { hash ^= raw.charCodeAt(index); hash = Math.imul(hash, 16777619); }
  return 'fnv1a32:' + raw.length + ':' + (hash >>> 0).toString(16).padStart(8, '0');
}

function instrument(script) {
  const hook = `globalThis.__P2_INTERNAL__=Object.freeze({
    state:()=>clone(S), validation:(value,version=CURRENT_SCHEMA_VERSION)=>validation(value,version),
    expNext:fellowExpToNext, expThreshold:fellowExpThreshold, levelForExp:fellowLevelForExp,
    components:(id,value=S)=>effectiveFellowPowerComponents(id,value), total:(value=S)=>totalFellowRosterPower(value),
    efficiency:(base,recommended,value=S)=>campaignEfficiencyPreview(base,recommended,value),
    efficiencyTotal:(total,base,recommended)=>campaignEfficiencyForTotal(total,base,recommended), definitions:()=>clone(FELLOW_DEFS),
    offline:(at,value=S)=>offlineClaimPreview(at,value), config:()=>clone(FELLOW_CONFIG),
    roster:rosterScreen, tower:towerView, more:moreScreen, fellowModal:openFellow, familyModal:openFamily,
    companionModal:openCompanion, export:safePersistenceExport, diagnostics:persistenceDiagnostics,
    migrate:(value,from,context,target=CURRENT_SCHEMA_VERSION)=>runMigrations(value,from,context,target)
  });`;
  return script.replace(/\n\}\)\(\);\s*$/, match => '\n' + hook + '\n' + match);
}

function makeDate(now, offsetMinutes) {
  const NativeDate = Date;
  const offset = offsetMinutes * 60_000;
  return class FixedDate extends NativeDate {
    constructor(...args) {
      if (args.length === 0) super(now.value);
      else if (args.length === 1) super(args[0]);
      else {
        const [year, month, date = 1, hours = 0, minutes = 0, seconds = 0, milliseconds = 0] = args;
        super(NativeDate.UTC(year, month, date, hours, minutes, seconds, milliseconds) + offset);
      }
    }
    static now() { return now.value; }
    static parse(value) { return NativeDate.parse(value); }
    static UTC(...args) { return NativeDate.UTC(...args); }
    shifted() { return new NativeDate(this.getTime() - offset); }
    getFullYear() { return this.shifted().getUTCFullYear(); }
    getMonth() { return this.shifted().getUTCMonth(); }
    getDate() { return this.shifted().getUTCDate(); }
    getDay() { return this.shifted().getUTCDay(); }
    getHours() { return this.shifted().getUTCHours(); }
    getMinutes() { return this.shifted().getUTCMinutes(); }
    getTimezoneOffset() { return offsetMinutes; }
    setDate(value) { const shifted = this.shifted(); return this.setTime(NativeDate.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), value, shifted.getUTCHours(), shifted.getUTCMinutes(), shifted.getUTCSeconds(), shifted.getUTCMilliseconds()) + offset); }
    setHours(hours, minutes = 0, seconds = 0, milliseconds = 0) { const shifted = this.shifted(); return this.setTime(NativeDate.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate(), hours, minutes, seconds, milliseconds) + offset); }
  };
}

function runRealm(options = {}) {
  const slots = new Map(Object.entries(options.initialSlots ?? {}));
  for (const [option, key] of [['activeRaw',keys.active],['backupRaw',keys.backupV0],['preV2BackupRaw',keys.backupV1],['preV3BackupRaw',keys.backupV2],['stagingRaw',keys.staging]]) {
    if (!Object.hasOwn(options, option)) continue;
    if (options[option] == null) slots.delete(key); else slots.set(key, String(options[option]));
  }
  const storageLog = [];
  const persistenceLog = [];
  const fault = { enabled:false, remaining:1, operation:'setItem', step:null, key:null, ...(options.fault ?? {}) };
  const storage = options.storage ?? {
    getItem(key) { storageLog.push(['get',String(key)]); if (fault.enabled && !fault.step && fault.remaining > 0 && fault.operation === 'getItem' && (!fault.key || fault.key === key)) { fault.remaining--; throw new Error('injected storage read failure'); } return slots.get(String(key)) ?? null; },
    setItem(key, value) { storageLog.push(['set',String(key)]); if (fault.enabled && !fault.step && fault.remaining > 0 && fault.operation === 'setItem' && (!fault.key || fault.key === key)) { fault.remaining--; throw new Error('injected storage write failure'); } slots.set(String(key),String(value)); },
    removeItem(key) { storageLog.push(['remove',String(key)]); if (fault.enabled && !fault.step && fault.remaining > 0 && fault.operation === 'removeItem' && (!fault.key || fault.key === key)) { fault.remaining--; throw new Error('injected storage remove failure'); } slots.delete(String(key)); }
  };
  const nodes = Object.fromEntries(['#app','#overlay','#toast'].map(selector => [selector,{ innerHTML:'', dataset:{}, style:{}, classList:{ add(){}, remove(){} } }]));
  const document = { querySelector(selector) { return nodes[selector] ?? null; }, querySelectorAll() { return []; }, documentElement:{ scrollWidth:options.width ?? 390 } };
  const clock = { value:options.now ?? Date.parse(scenarios.frozenNow) };
  const FixedDate = makeDate(clock, scenarios.timezoneOffsetMinutes);
  const randomValues = (options.randomSequence ?? Array.from({length:128},(_,index)=>scenarios.randomSequence[index%scenarios.randomSequence.length])).slice();
  let randomIndex = 0;
  const random = () => { if (randomIndex >= randomValues.length) throw new Error('runtime random exhausted'); return randomValues[randomIndex++]; };
  let timerId = 0;
  const timers = new Map();
  const clockAdapter = { now:()=>clock.value, setTimeout(callback){ const id=++timerId; timers.set(id,callback); if(!options.deferTimers)callback(); return id; }, clearTimeout(id){timers.delete(id);} };
  const location = { protocol:'http:', hostname:'127.0.0.1', search:'?qa=1', ...(options.location ?? {}) };
  const nativeStorage = options.nativeStorage ?? { getItem(){throw new Error('native storage used')}, setItem(){throw new Error('native storage used')}, removeItem(){throw new Error('native storage used')} };
  const runtime = {
    clock:options.clock ?? clockAdapter, random:options.random ?? random, storage:options.runtimeStorage ?? storage,
    confirm:options.confirm ?? (()=>true), ids:{ save:()=>options.saveId ?? 'save-phase-2', transaction:(()=>{let n=0;return()=>`tx-phase-2-${++n}`})() },
    qa:options.qa ?? {allowDestructive:true,isolatedStorage:true}
  };
  if (Object.hasOwn(options,'features')) runtime.features = options.features;
  const listeners = {};
  const context = {
    console, Math:Object.create(Math), Date:FixedDate, document, localStorage:nativeStorage, confirm:()=>true,
    setTimeout(callback){callback();return 1}, clearTimeout(){}, crypto:{randomUUID:()=> 'native-id'},
    URLSearchParams, location, history:{pushState(_state,_title,url){location.search=String(url).includes('?')?String(url).slice(String(url).indexOf('?')):''}},
    addEventListener(type,listener){(listeners[type]??=[]).push(listener)}
  };
  context.Math.random = random;
  context.window=context; context.globalThis=context; context.__EVERSTEAD_RUNTIME__=runtime;
  context.__EVERSTEAD_PERSISTENCE_TEST__={
    storage, operationLog:persistenceLog,
    fault(info){
      if (fault.enabled && fault.step && fault.remaining > 0 && info.step===fault.step && info.operation===fault.operation) { fault.remaining--; return {type:'throw',message:'injected step failure'}; }
      if (fault.enabled && fault.type==='replace-active' && fault.remaining > 0 && info.step==='active-conflict-check' && info.phase==='before') { slots.set(keys.active,fault.replacementRaw); fault.remaining--; return null; }
      return null;
    }, status:{}
  };
  let thrown=null;
  vm.createContext(context);
  try { vm.runInContext(instrument(source),context,{timeout:25_000}); } catch(error) { thrown=error; }
  return {context,slots,storageLog,persistenceLog,nodes,clock,timers,thrown,fault};
}

const evaluate = (run, expression) => vm.runInContext(expression, run.context, {timeout:10_000});
const activeRaw = run => run.slots.get(keys.active) ?? null;
const activeState = run => current(activeRaw(run));
const writeCount = run => run.storageLog.filter(([operation]) => operation==='set'||operation==='remove').length;

// Contract and frozen-history gates.
check('manifest-phase', manifest.manifestVersion===1 && manifest.phase==='2' && manifest.baseCommit===scenarios.baseCommit);
check('production-script-present', Boolean(source));
check('phase2-artifact-sha256', sha256(htmlBytes)===manifest.artifact.sha256, sha256(htmlBytes));
check('phase2-artifact-byte-length', htmlBytes.length===manifest.artifact.byteLength, htmlBytes.length);
check('scenario-sha256', sha256(read('qa/phase-2/scenarios.json'))===manifest.scenarios.sha256);
for (const [path, expected] of Object.entries(manifest.frozenHistoricalFiles)) check('frozen-'+path.replaceAll('/','-'),sha256(read(path))===expected,path);
check('embedded-assets-frozen', manifest.artifact.embeddedAssetLinesSha256===manifest.baseArtifact.embeddedAssetLinesSha256,manifest.artifact.embeddedAssetLinesSha256);
check('schema-3-static', source.includes('CURRENT_SCHEMA_VERSION=3')&&source.includes("id:'schema-2-to-3'"));
check('v2-checkpoint-static', source.includes("PRE_V3_BACKUP_KEY=NS+'__raw_backup_v2'")&&source.includes('preparePreV3Migration(')&&source.includes('schemaThreeStagingLineage('));
check('single-power-selector-static',(source.match(/function effectiveFellowPowerComponents\(/g)||[]).length===1&&source.includes('function power(id,state=S){return effectiveFellowPowerComponents'));
check('legacy-power-source-absent',!source.includes('prestigeFor(')&&!source.includes('blessingPct(')&&!source.includes("kind:'power'")&&!source.includes('Bound Fellow Power +6%'));
check('train-ui-and-action-absent',!source.includes('data-train')&&!source.includes('trainingCost(')&&!source.includes('function train(')&&!source.includes('TRAIN ×'));
check('legacy-labels-absent',!source.includes('Prestige')&&!source.includes('Blessing'));
check('type-role-static',source.includes("type:'Storm'")&&!source.includes("element:'Storm'")&&source.includes('Type ${f.type} · Role ${f.role}'));
check('tower-counter-copy-18',source.includes('<b>+18%</b><span>Counter</span>'));
check('campaign-preview-static',source.includes('data-campaign-efficiency-preview')&&source.includes('Phase 5 preview · not playable'));
check('all-direct-storage-calls-adapted',!/(^|[^A-Z_])localStorage\.(getItem|setItem|removeItem)/m.test(source));

// Fresh, schemas 0/1/2/3, checkpoint exactness and idempotence.
const fresh = runRealm({activeRaw:null,backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null});
check('fresh-no-throw',fresh.thrown===null,fresh.thrown?.message??'');
check('fresh-schema-3',activeState(fresh)?.schemaVersion===3);
check('fresh-all-six-owned',Object.values(activeState(fresh)?.fellows??{}).filter(item=>item.owned).length===6);
check('fresh-canonical-fellow-shape',Object.values(activeState(fresh)?.fellows??{}).every(item=>item.level===1&&item.exp===0&&item.rarity===1&&item.shards===0&&Array.isArray(item.relicSlots)&&item.relicSlots.length===0&&!Object.hasOwn(item,'training')));
check('fresh-no-migration-checkpoints',!fresh.slots.has(keys.backupV1)&&!fresh.slots.has(keys.backupV2));

const fromSchemaOne = runRealm({activeRaw:schemaOneRaw,backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null});
const schemaTwoRaw = fromSchemaOne.slots.get(keys.backupV2);
const schemaTwoState = schema(schemaTwoRaw,2);
check('schema1-migrates-to-3',activeState(fromSchemaOne)?.schemaVersion===3);
check('schema1-v0-exact',fromSchemaOne.slots.get(keys.backupV0)===schemaOneRaw);
check('schema1-v1-exact',fromSchemaOne.slots.get(keys.backupV1)===schemaOneRaw);
check('schema1-v2-valid',schemaTwoState?.schemaVersion===2);
check('schema1-receipts-once',activeState(fromSchemaOne)?.saveMeta.appliedMigrations.filter(item=>item.id==='schema-2-to-3').length===1);
check('schema1-pending-undo-preserved',activeState(fromSchemaOne)?.undo?.kind==='oath-completion');

const fromSchemaTwo = runRealm({activeRaw:schemaTwoRaw,backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null});
check('schema2-migrates-to-3',activeState(fromSchemaTwo)?.schemaVersion===3);
check('schema2-v2-checkpoint-exact',fromSchemaTwo.slots.get(keys.backupV2)===schemaTwoRaw);
check('schema2-training-removed',Object.values(activeState(fromSchemaTwo)?.fellows??{}).every(item=>!Object.hasOwn(item,'training')));

const fromLegacy = runRealm({activeRaw:legacyRaw,backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null});
const legacySchemaOneRaw = fromLegacy.slots.get(keys.backupV1);
const legacySchemaTwoRaw = fromLegacy.slots.get(keys.backupV2);
check('legacy-migrates-to-3',activeState(fromLegacy)?.schemaVersion===3);
check('legacy-v0-exact',fromLegacy.slots.get(keys.backupV0)===legacyRaw);
check('legacy-v1-valid',schema(legacySchemaOneRaw,1)?.schemaVersion===1);
check('legacy-v2-valid',schema(legacySchemaTwoRaw,2)?.schemaVersion===2);
check('legacy-receipt-order',activeState(fromLegacy)?.saveMeta.appliedMigrations.map(item=>item.id).join(',')==='legacy-v0.1-to-1,schema-1-to-2,schema-2-to-3');
check('legacy-unicode-preserved',activeState(fromLegacy)?.oaths.some(oath=>oath.title==='Fixture café review 🌵'&&oath.notes.includes('測試')));

const reloaded = runRealm({initialSlots:Object.fromEntries(fromLegacy.slots),now:Date.parse(scenarios.laterNow)});
check('schema3-idempotent',activeState(reloaded)?.schemaVersion===3&&activeState(reloaded).saveMeta.appliedMigrations.filter(item=>item.id==='schema-2-to-3').length===1);
check('all-checkpoints-permanent',reloaded.slots.get(keys.backupV0)===legacyRaw&&reloaded.slots.get(keys.backupV1)===legacySchemaOneRaw&&reloaded.slots.get(keys.backupV2)===legacySchemaTwoRaw);

// Training conversion boundaries, missing/invalid legacy Fellows, Bond exactness and unknown fields.
for (const [label, training, expected] of [['fractional',7.9,7],['zero',0,1],['negative',-8,1],['huge',1e9,120]]) {
  const value=JSON.parse(legacyRaw); value.fellows.cael.training=training; value.fellows.cael.bond=12.345678901;
  const run=runRealm({activeRaw:JSON.stringify(value),backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null});
  const fellow=activeState(run)?.fellows.cael;
  check(`training-${label}-level`,fellow?.level===expected,`${fellow?.level}`);
  check(`training-${label}-exp-threshold`,fellow?.exp===evaluate(run,`__P2_INTERNAL__.expThreshold(${expected})`),`${fellow?.exp}`);
  check(`training-${label}-bond-exact`,fellow?.bond===12.345678901,`${fellow?.bond}`);
}
for (const [label, mutate] of [['missing',value=>delete value.fellows.mira],['invalid',value=>value.fellows.mira={training:'bad',bond:null}]]) {
  const value=JSON.parse(legacyRaw); mutate(value);
  const run=runRealm({activeRaw:JSON.stringify(value),backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null});
  check(`legacy-${label}-fellow-recovers`,activeState(run)?.fellows.mira.level===1&&activeState(run)?.fellows.mira.exp===0&&activeState(run)?.fellows.mira.bond===35);
  check(`legacy-${label}-schema1-valid`,schema(run.slots.get(keys.backupV1),1)?.fellows.mira.training===1);
}
const unknownV2=clone(schemaTwoState); unknownV2.futureRoot={label:'未知 🌵'}; unknownV2.fellows.cael.futureFellow={nested:['測試']}; unknownV2.fellows.cael.calculatedPower=999999;
const unknownRun=runRealm({activeRaw:JSON.stringify(unknownV2),backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null});
check('unknown-root-preserved',activeState(unknownRun)?.futureRoot?.label==='未知 🌵');
check('unknown-fellow-preserved',activeState(unknownRun)?.fellows.cael.futureFellow?.nested?.[0]==='測試');
check('derived-shadow-removed-on-migration',!Object.hasOwn(activeState(unknownRun)?.fellows.cael??{},'calculatedPower'));

for (const [label,mutate] of [
  ['exp-level-mismatch',value=>value.fellows.cael.level++],
  ['negative-exp',value=>value.fellows.cael.exp=-1],
  ['bad-rarity',value=>value.fellows.cael.rarity=6],
  ['negative-shards',value=>value.fellows.cael.shards=-1],
  ['derived-shadow',value=>value.fellows.cael.assignedCompanionId='cinderwing'],
  ['relic-nonempty',value=>value.fellows.cael.relicSlots=['future-relic']]
]) {
  const value=clone(activeState(fresh)); mutate(value);
  const run=runRealm({activeRaw:JSON.stringify(value),backupRaw:JSON.stringify(value),preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null});
  check(`current-invalid-${label}-refused`,activeRaw(run)===JSON.stringify(value)&&/Save Needs Attention/.test(run.nodes['#app'].innerHTML));
}

// Power components, neutrality, roster sum and efficiency.
const powerRun=runRealm({activeRaw:activeRaw(fresh),backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null});
const baseState=activeState(powerRun);
const baseComponents=evaluate(powerRun,"__P2_INTERNAL__.components('cael')");
check('power-base-exact',baseComponents.basePower===6100&&baseComponents.levelMultiplier===1&&baseComponents.rarityMultiplier===1&&baseComponents.effectivePower===6100);
check('power-neutral-hooks',baseComponents.bondMilestoneMultiplier===1&&baseComponents.relicMultiplier===1&&baseComponents.companionMultiplier===1&&baseComponents.familyBondMultiplier===1&&baseComponents.globalMultiplier===1);
check('power-formula-order',baseComponents.formulaOrder.join(',')==='basePower,levelMultiplier,rarityMultiplier,bondMilestoneMultiplier,relicMultiplier,companionMultiplier,familyBondMultiplier,globalMultiplier,round');
const levelState=clone(baseState); levelState.fellows.cael.exp=evaluate(powerRun,'__P2_INTERNAL__.expThreshold(10)'); levelState.fellows.cael.level=10;
const levelComponents=evaluate(powerRun,`__P2_INTERNAL__.components('cael',${JSON.stringify(levelState)})`);
check('level-multiplier-exact',levelComponents.levelMultiplier===1+.115*9);
check('round-once-exact',levelComponents.effectivePower===Math.round(6100*(1+.115*9)));
const rarityState=clone(levelState); rarityState.fellows.cael.rarity=3;
const rarityComponents=evaluate(powerRun,`__P2_INTERNAL__.components('cael',${JSON.stringify(rarityState)})`);
check('rarity-multiplier-exact',rarityComponents.rarityMultiplier===1.16&&rarityComponents.effectivePower===Math.round(6100*(1+.115*9)*1.16));
for (const [label,mutate] of [
  ['bond',value=>value.fellows.cael.bond=999999],
  ['family',value=>{value.family.elara.level=999;value.family.elara.progress=999999}],
  ['companion',value=>value.companions.cinderwing.bound='lyra'],
  ['focus',value=>value.focusFellow='mira'],
  ['trade-team',value=>value.tradeTeam=['mira','rook','selene','orin','lyra']]
]) {
  const value=clone(baseState); mutate(value);
  const components=evaluate(powerRun,`__P2_INTERNAL__.components('cael',${JSON.stringify(value)})`);
  check(`power-${label}-neutral`,components.effectivePower===baseComponents.effectivePower,components.effectivePower);
  if(label==='focus'||label==='trade-team')check(`total-${label}-independent`,evaluate(powerRun,`__P2_INTERNAL__.total(${JSON.stringify(value)})`)===evaluate(powerRun,`__P2_INTERNAL__.total(${JSON.stringify(baseState)})`));
}
const total=evaluate(powerRun,'__P2_INTERNAL__.total()');
const componentSum=evaluate(powerRun,"['cael','lyra','orin','selene','rook','mira'].reduce((n,id)=>n+__P2_INTERNAL__.components(id).effectivePower,0)");
check('total-roster-exact-sum',total===componentSum,`${total}/${componentSum}`);
const definitions=evaluate(powerRun,'__P2_INTERNAL__.definitions()');
check('fellow-definition-ids-unique',new Set(definitions.map(item=>item.id)).size===definitions.length);
const ownedState=clone(baseState); ownedState.fellows.mira.owned=false;
check('total-owned-only',evaluate(powerRun,`__P2_INTERNAL__.total(${JSON.stringify(ownedState)})`)===total-evaluate(powerRun,"__P2_INTERNAL__.components('mira').effectivePower"));
const nonSquad=clone(baseState); nonSquad.tradeTeam=['cael','lyra','orin','selene','rook']; nonSquad.fellows.mira.level=2; nonSquad.fellows.mira.exp=evaluate(powerRun,'__P2_INTERNAL__.expThreshold(2)');
check('non-squad-upgrade-changes-total',evaluate(powerRun,`__P2_INTERNAL__.total(${JSON.stringify(nonSquad)})`)>total);

const efficiencyCases=[
  ['below',12000,total*2,0],['equal',12000,total,0],['small-surplus',12000,total/1.1,null],['cap',12000,total/3,.35],['cap-plus',12000,total/10,.35]
];
let priorCost=Infinity;
for(const [label,base,recommended,discount] of efficiencyCases){const value=evaluate(powerRun,`__P2_INTERNAL__.efficiency(${base},${recommended})`);check(`efficiency-${label}-finite`,value.valid&&Object.values(value).filter(item=>typeof item==='number').every(Number.isFinite)&&value.effectiveCost>0);if(discount!==null)check(`efficiency-${label}-discount`,value.discountRate===discount,value.discountRate);check(`efficiency-${label}-rounding`,value.effectiveCost===Math.ceil(base*(1-value.discountRate)));priorCost=Math.min(priorCost,value.effectiveCost)}
for(const [label,recommended] of [['zero',0],['negative',-1],['nan','NaN'],['infinite','Infinity']]){const value=evaluate(powerRun,`__P2_INTERNAL__.efficiency(12000,${recommended})`);check(`efficiency-invalid-${label}-closed`,value.valid===false&&value.discountRate===0&&value.effectiveCost===12000)}
for(const [label,totalPower] of [['cap-minus',71999],['cap-boundary',72000],['cap-plus',72001]]){const value=evaluate(powerRun,`__P2_INTERNAL__.efficiencyTotal(${totalPower},12000,30000)`),ratio=Math.max(0,totalPower/30000-1),discount=Math.min(.35,ratio*.25);check(`efficiency-${label}-exact`,value.valid&&value.discountRate===discount&&value.effectiveCost===Math.ceil(12000*(1-discount)),JSON.stringify(value))}
for(const [label,totalPower] of [['negative',-1],['nan','NaN'],['infinite','Infinity']]){const value=evaluate(powerRun,`__P2_INTERNAL__.efficiencyTotal(${totalPower},12000,30000)`);check(`efficiency-total-${label}-closed`,value.valid===false&&value.discountRate===0&&value.effectiveCost===12000)}
const monotoneStates=[];for(const level of [1,2,5,20,120]){const value=clone(baseState);value.fellows.mira.level=level;value.fellows.mira.exp=evaluate(powerRun,`__P2_INTERNAL__.expThreshold(${level})`);monotoneStates.push(evaluate(powerRun,`__P2_INTERNAL__.efficiency(12000,30000,${JSON.stringify(value)}).effectiveCost`))}check('efficiency-higher-power-never-raises-cost',monotoneStates.every((value,index)=>index===0||value<=monotoneStates[index-1]),monotoneStates.join(','));

// Authorized grants, ascension and failure immutability.
const bridgeRun=runRealm({activeRaw:activeRaw(fresh),backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null,qa:{allowDestructive:true,isolatedStorage:true}});
const bridge=evaluate(bridgeRun,'__EVERSTEAD_QA__');
check('bridge-present',Boolean(bridge));
const expBoundary=evaluate(bridgeRun,'__P2_INTERNAL__.expThreshold(2)');
const expGrant=evaluate(bridgeRun,`__EVERSTEAD_QA__.controls.grant({resource:'fellowExp',id:'mira',amount:${expBoundary}})`);
check('exp-grant-levels-atomically',expGrant.ok&&expGrant.state.fellows.mira.level===2&&expGrant.state.fellows.mira.exp===expBoundary);
const beforeShard=evaluate(bridgeRun,'__EVERSTEAD_QA__.snapshot().state');
const shardGrant=evaluate(bridgeRun,"__EVERSTEAD_QA__.controls.grant({resource:'fellowShards',id:'mira',amount:20})");
check('shard-grant-no-auto-ascend',shardGrant.ok&&shardGrant.state.fellows.mira.rarity===beforeShard.fellows.mira.rarity&&shardGrant.state.fellows.mira.shards===20);
const beforeOtherShards=shardGrant.state.fellows.cael.shards;
const ascended=evaluate(bridgeRun,"__EVERSTEAD_QA__.act('fellow-ascend',{id:'mira'})");
check('ascension-exact-cost',ascended.ok&&ascended.state.fellows.mira.rarity===2&&ascended.state.fellows.mira.shards===0);
check('ascension-no-exp-bond-effect',ascended.state.fellows.mira.exp===expBoundary&&ascended.state.fellows.mira.bond===beforeShard.fellows.mira.bond);
check('ascension-no-cross-spend',ascended.state.fellows.cael.shards===beforeOtherShards);
const failBefore={raw:activeRaw(bridgeRun),revision:evaluate(bridgeRun,'__EVERSTEAD_QA__.snapshot().state.saveMeta.revision'),toast:bridgeRun.nodes['#toast'].innerHTML,modal:bridgeRun.nodes['#overlay'].innerHTML};
const insufficient=evaluate(bridgeRun,"__EVERSTEAD_QA__.act('fellow-ascend',{id:'mira'})");
check('ascension-insufficient-refused',insufficient.ok===false);
check('failed-action-raw-revision-ui-unchanged',activeRaw(bridgeRun)===failBefore.raw&&evaluate(bridgeRun,'__EVERSTEAD_QA__.snapshot().state.saveMeta.revision')===failBefore.revision&&bridgeRun.nodes['#toast'].innerHTML===failBefore.toast&&bridgeRun.nodes['#overlay'].innerHTML===failBefore.modal);
const maxState=clone(baseState);maxState.fellows.mira.rarity=5;maxState.fellows.mira.shards=Number.MAX_SAFE_INTEGER;
const maxRun=runRealm({activeRaw:JSON.stringify(maxState),backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null,qa:{allowDestructive:true,isolatedStorage:true}}),maxBefore={raw:activeRaw(maxRun),revision:evaluate(maxRun,'__EVERSTEAD_QA__.snapshot().state.saveMeta.revision'),toast:maxRun.nodes['#toast'].innerHTML,modal:maxRun.nodes['#overlay'].innerHTML},maxAscend=evaluate(maxRun,"__EVERSTEAD_QA__.act('fellow-ascend',{id:'mira'})");
check('ascension-max-rarity-refused',maxAscend.ok===false&&activeRaw(maxRun)===maxBefore.raw&&evaluate(maxRun,'__EVERSTEAD_QA__.snapshot().state.saveMeta.revision')===maxBefore.revision&&maxRun.nodes['#toast'].innerHTML===maxBefore.toast&&maxRun.nodes['#overlay'].innerHTML===maxBefore.modal);
for(const [label,payload] of [['unknown-id',"{resource:'fellowExp',id:'unknown',amount:1}"],['negative',"{resource:'fellowShards',id:'cael',amount:-1}"],['fractional',"{resource:'fellowExp',id:'cael',amount:1.5}"],['overflow',"{resource:'fellowShards',id:'cael',amount:Number.MAX_SAFE_INTEGER+1}"]]){const before=activeRaw(bridgeRun),result=evaluate(bridgeRun,`__EVERSTEAD_QA__.controls.grant(${payload})`);check(`grant-${label}-refused`,result.ok===false&&activeRaw(bridgeRun)===before)}
const unauthorized=runRealm({activeRaw:activeRaw(fresh),backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null,qa:{allowDestructive:false,isolatedStorage:true}});
check('grant-needs-destructive-attestation',evaluate(unauthorized,"__EVERSTEAD_QA__.controls.grant({resource:'fellowExp',id:'cael',amount:1})").ok===false);
const cloned=evaluate(bridgeRun,'__EVERSTEAD_QA__.diagnostics()');cloned.diagnostics.fellowPowerComponents.cael.relicSlots.push('attack');
check('diagnostics-deep-clone',evaluate(bridgeRun,"__EVERSTEAD_QA__.diagnostics().diagnostics.fellowPowerComponents.cael.relicSlots.length")===0);
const diagnosticBefore=activeRaw(bridgeRun);evaluate(bridgeRun,'__EVERSTEAD_QA__.diagnostics()');check('diagnostics-no-write',activeRaw(bridgeRun)===diagnosticBefore);

// Migration interruption/fault boundaries and later-clock recovery.
const checkpointFaults=[
  ['pre-v3-read','getItem','pre-v3-backup-read'],['pre-v3-read-verify','getItem','pre-v3-backup-read-verify'],
  ['pre-v3-write','setItem','pre-v3-backup-write'],['pre-v3-verify','getItem','pre-v3-backup-verify'],
  ['staging-write','setItem','staging-write'],['staging-verify','getItem','staging-verify'],
  ['active-conflict','getItem','active-conflict-check'],['active-write','setItem','active-write'],['active-verify','getItem','active-verify'],
  ['cleanup-owner','getItem','staging-cleanup-owner'],['cleanup-remove','removeItem','staging-cleanup'],['cleanup-verify','getItem','staging-cleanup-verify']
];
for(const [label,operation,step] of checkpointFaults){
  const interrupted=runRealm({activeRaw:schemaTwoRaw,backupRaw:schemaTwoRaw,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null,now:Date.parse(scenarios.frozenNow),fault:{enabled:true,operation,step}});
  const retainedV2=interrupted.slots.get(keys.backupV2);
  const retry=runRealm({initialSlots:Object.fromEntries(interrupted.slots),now:Date.parse(scenarios.laterNow)});
  check(`fault-${label}-retry-current`,activeState(retry)?.schemaVersion===3,retry.nodes['#app'].innerHTML.slice(0,100));
  check(`fault-${label}-v2-exact`,retry.slots.get(keys.backupV2)===schemaTwoRaw,rawIdentity(retainedV2));
  check(`fault-${label}-receipt-once`,activeState(retry)?.saveMeta.appliedMigrations.filter(item=>item.id==='schema-2-to-3').length===1);
  check(`fault-${label}-staging-clean`,!retry.slots.has(keys.staging));
}
const legacyFaults=[['v1-write','setItem','pre-v2-backup-write'],['v1-verify','getItem','pre-v2-backup-verify'],['v2-write','setItem','pre-v3-backup-write'],['v2-verify','getItem','pre-v3-backup-verify'],['stage','setItem','staging-write'],['active','setItem','active-write']];
const directLegacyLater=activeState(runRealm({activeRaw:legacyRaw,backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null,now:Date.parse(scenarios.laterNow)}));
const migrationSemantics=value=>{const copy=clone(value);delete copy.saveMeta;return JSON.stringify(copy)};
for(const [label,operation,step] of legacyFaults){const interrupted=runRealm({activeRaw:legacyRaw,backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null,fault:{enabled:true,operation,step}}),retry=runRealm({initialSlots:Object.fromEntries(interrupted.slots),now:Date.parse(scenarios.laterNow)}),state=activeState(retry);check(`legacy-fault-${label}-retry`,state?.schemaVersion===3);check(`legacy-fault-${label}-receipts-once`,new Set(state?.saveMeta.appliedMigrations.map(item=>item.id)).size===3);check(`legacy-fault-${label}-no-reward-duplication`,migrationSemantics(state)===migrationSemantics(directLegacyLater));}

// Exact Phase 1 staging continuation and adversarial lineage.
const schemaOneValue=JSON.parse(schemaOneRaw),schemaTwoValue=JSON.parse(schemaTwoRaw);
const phaseOneEnvelope={stagingVersion:1,transactionId:'phase-1-schema1-stage',baseSaveId:schemaOneValue.saveMeta.saveId,baseRevision:schemaOneValue.saveMeta.revision,sourceRawIdentity:rawIdentity(schemaOneRaw),source:'schema-1-migration',state:schemaTwoValue};
const phaseOneStageRaw=JSON.stringify(phaseOneEnvelope);
const phaseOneResume=runRealm({activeRaw:schemaOneRaw,backupRaw:schemaOneRaw,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:phaseOneStageRaw,now:Date.parse(scenarios.laterNow)});
check('phase1-stage-schema1-continues',activeState(phaseOneResume)?.schemaVersion===3);
check('phase1-stage-schema1-v2-exact',phaseOneResume.slots.get(keys.backupV2)===JSON.stringify(schemaTwoValue));
check('phase1-stage-schema1-clean',!phaseOneResume.slots.has(keys.staging));
const legacyOneValue=JSON.parse(legacySchemaOneRaw),legacyTwoValue=JSON.parse(legacySchemaTwoRaw);
const legacyPhaseOneEnvelope={stagingVersion:1,transactionId:'phase-1-legacy-stage',baseSaveId:null,baseRevision:null,sourceRawIdentity:rawIdentity(legacyRaw),source:'legacy-migration',state:legacyTwoValue};
const legacyPhaseOneResume=runRealm({activeRaw:legacyRaw,backupRaw:legacyRaw,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:JSON.stringify(legacyPhaseOneEnvelope),now:Date.parse(scenarios.laterNow)});
check('phase1-stage-legacy-continues',activeState(legacyPhaseOneResume)?.schemaVersion===3);
check('phase1-stage-legacy-v1-exact',legacyPhaseOneResume.slots.get(keys.backupV1)===JSON.stringify(legacyOneValue));
check('phase1-stage-legacy-v2-exact',legacyPhaseOneResume.slots.get(keys.backupV2)===JSON.stringify(legacyTwoValue));
for(const [label,mutate] of [['altered-state',envelope=>envelope.state.gold++],['foreign-identity',envelope=>envelope.sourceRawIdentity='foreign'],['foreign-source',envelope=>envelope.source='foreign']]){const envelope=clone(phaseOneEnvelope);mutate(envelope);const raw=JSON.stringify(envelope),run=runRealm({activeRaw:schemaOneRaw,backupRaw:schemaOneRaw,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:raw});check(`phase1-stage-${label}-refused`,activeRaw(run)===schemaOneRaw&&run.slots.get(keys.staging)===raw);check(`phase1-stage-${label}-zero-write`,writeCount(run)===0,JSON.stringify(run.storageLog.filter(([op])=>op==='set'||op==='remove')))}

const interruptedV2=runRealm({activeRaw:schemaTwoRaw,backupRaw:schemaTwoRaw,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null,fault:{enabled:true,operation:'setItem',step:'active-write'}});
const validStage3=interruptedV2.slots.get(keys.staging);
const retryV2=runRealm({initialSlots:Object.fromEntries(interruptedV2.slots),now:Date.parse(scenarios.laterNow)});
check('phase2-staging-later-clock-recovers',activeState(retryV2)?.schemaVersion===3&&!retryV2.slots.has(keys.staging));
const unrelatedEnvelope=JSON.parse(validStage3);unrelatedEnvelope.state.gold++;
const unrelatedRaw=JSON.stringify(unrelatedEnvelope),unrelatedRun=runRealm({activeRaw:schemaTwoRaw,backupRaw:schemaTwoRaw,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:unrelatedRaw});
check('valid-unrelated-schema3-stage-refused',activeRaw(unrelatedRun)===schemaTwoRaw&&unrelatedRun.slots.get(keys.staging)===unrelatedRaw);
check('valid-unrelated-schema3-stage-zero-write',writeCount(unrelatedRun)===0,JSON.stringify(unrelatedRun.storageLog.filter(([op])=>op==='set'||op==='remove')));

for(const [label,v2] of [['invalid','{invalid-v2'],['foreign',JSON.stringify({...schemaTwoValue,gold:schemaTwoValue.gold+1})]]){const run=runRealm({activeRaw:schemaTwoRaw,backupRaw:schemaTwoRaw,preV2BackupRaw:null,preV3BackupRaw:v2,stagingRaw:null});check(`v2-${label}-checkpoint-refused`,activeRaw(run)===schemaTwoRaw&&run.slots.get(keys.backupV2)===v2);}
for(const [label,stage] of [['invalid','{invalid-stage'],['foreign',JSON.stringify({...JSON.parse(validStage3),sourceRawIdentity:'foreign'})]]){const run=runRealm({activeRaw:schemaTwoRaw,backupRaw:schemaTwoRaw,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:stage});check(`schema2-${label}-staging-refused`,activeRaw(run)===schemaTwoRaw&&run.slots.get(keys.staging)===stage);check(`schema2-${label}-staging-zero-write`,writeCount(run)===0)}

// Missing-active precedence and corrupt/future preservation.
const stageForFresh=runRealm({activeRaw:null,backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null,fault:{enabled:true,operation:'setItem',step:'active-write'}}).slots.get(keys.staging);
const precedenceStage=runRealm({activeRaw:null,backupRaw:legacyRaw,preV2BackupRaw:legacySchemaOneRaw,preV3BackupRaw:legacySchemaTwoRaw,stagingRaw:stageForFresh});
check('missing-active-staging-first',activeState(precedenceStage)?.saveMeta.saveId===JSON.parse(stageForFresh).state.saveMeta.saveId);
const precedenceV2=runRealm({activeRaw:null,backupRaw:legacyRaw,preV2BackupRaw:legacySchemaOneRaw,preV3BackupRaw:legacySchemaTwoRaw,stagingRaw:null});
check('missing-active-v2-second',activeState(precedenceV2)?.oaths.some(oath=>oath.title==='Fixture café review 🌵'));
const precedenceV1=runRealm({activeRaw:null,backupRaw:null,preV2BackupRaw:legacySchemaOneRaw,preV3BackupRaw:null,stagingRaw:null});
check('missing-active-v1-third',activeState(precedenceV1)?.schemaVersion===3);
const precedenceV0=runRealm({activeRaw:null,backupRaw:legacyRaw,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null});
check('missing-active-v0-fourth',activeState(precedenceV0)?.schemaVersion===3);
const mismatchedV2='{occupied-invalid-v2',blockedPrecedence=runRealm({activeRaw:null,backupRaw:legacyRaw,preV2BackupRaw:legacySchemaOneRaw,preV3BackupRaw:mismatchedV2,stagingRaw:null});
check('missing-active-mismatched-v2-never-overwritten',blockedPrecedence.slots.get(keys.backupV2)===mismatchedV2&&!activeState(blockedPrecedence));
for(const [label,raw] of [['future',futureRaw],['corrupt',corruptRaw]]){const run=runRealm({activeRaw:raw,backupRaw:raw,preV2BackupRaw:legacySchemaOneRaw,preV3BackupRaw:legacySchemaTwoRaw,stagingRaw:null});check(`${label}-active-preserved`,activeRaw(run)===raw);check(`${label}-unattested-v2-not-used`,!activeState(run));const exported=evaluate(run,'__EVERSTEAD_QA__.recovery.export()');check(`${label}-safe-export-exact`,exported.ok&&exported.data.activeRaw===raw&&exported.data.preV3BackupRaw===legacySchemaTwoRaw)}
const unattestedSchemaTwoEnvelopeRaw=JSON.stringify({stagingVersion:1,transactionId:'unattested-schema-two',baseSaveId:null,baseRevision:null,sourceRawIdentity:rawIdentity(corruptRaw),source:'verified-staging',state:schemaTwoValue});
const corruptStagingRun=runRealm({activeRaw:corruptRaw,backupRaw:corruptRaw,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:unattestedSchemaTwoEnvelopeRaw});
check('corrupt-unattested-schema2-staging-not-used',!activeState(corruptStagingRun)&&activeRaw(corruptStagingRun)===corruptRaw&&corruptStagingRun.slots.get(keys.staging)===unattestedSchemaTwoEnvelopeRaw&&!/data-persistence-act="recover"/.test(corruptStagingRun.nodes['#app'].innerHTML));

// Fixture five-slot coverage and rollback reporting.
const fixtureRun=runRealm({activeRaw:activeRaw(fresh),backupRaw:'old-v0',preV2BackupRaw:'old-v1',preV3BackupRaw:'old-v2',stagingRaw:null,qa:{allowDestructive:true,isolatedStorage:true}});
const fixturePayload={activeRaw:activeRaw(fresh),backupRaw:'new-v0',preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null};
const fixtureResult=evaluate(fixtureRun,`__EVERSTEAD_QA__.controls.installFixture(${JSON.stringify(fixturePayload)})`);
check('fixture-five-slot-install',fixtureResult.ok&&fixtureRun.slots.get(keys.backupV0)==='new-v0'&&!fixtureRun.slots.has(keys.backupV1)&&!fixtureRun.slots.has(keys.backupV2));
const originalSlots=Object.fromEntries(fixtureRun.slots),rollbackFault={enabled:false};
const rollbackStorage={getItem:key=>fixtureRun.slots.get(String(key))??null,setItem(key,value){if(rollbackFault.enabled&&key===keys.backupV2)throw new Error('fixture injected failure');fixtureRun.slots.set(String(key),String(value))},removeItem:key=>fixtureRun.slots.delete(String(key))};
void originalSlots;void rollbackStorage;
check('fixture-rollback-code-covers-v2',source.includes('[PRE_V3_BACKUP_KEY,before.preV3BackupRaw]')&&source.includes('rollback failed:'));

// Phase 1 economy/offline/Oath and security regression replacements.
const diagnostic=evaluate(powerRun,'__EVERSTEAD_QA__.diagnostics()').diagnostics;
check('phase1-building-bases',Object.values(diagnostic.buildingRateComponents).map(item=>item.base).join(',')==='7200,6500,5600,6100');
check('phase1-neutral-building-hooks',Object.values(diagnostic.buildingRateComponents).every(item=>item.characterEconomyMultiplier===1));
check('phase1-total-rate',diagnostic.totalVillageGoldPerHour===25400,diagnostic.totalVillageGoldPerHour);
const oathRun=runRealm({activeRaw:activeRaw(fresh),backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null});
const oathBefore=activeState(oathRun),oathResult=evaluate(oathRun,"__EVERSTEAD_QA__.act('complete-oath',{id:'o1'})"),oathAfter=activeState(oathRun);
check('phase1-oath-still-works',oathResult.ok&&oathAfter.prosperity===oathBefore.prosperity+2&&oathAfter.buildings.archives.boost===.03);
check('phase1-oath-bond-only',oathAfter.fellows.cael.bond===oathBefore.fellows.cael.bond+3&&oathAfter.fellows.cael.exp===oathBefore.fellows.cael.exp&&oathAfter.fellows.cael.rarity===oathBefore.fellows.cael.rarity);
const offlineState=clone(baseState),now=Date.parse(scenarios.frozenNow);offlineState.lastGoldAt=now-86_400_001;offlineState.lastSeen=offlineState.lastGoldAt;
const offlineRun=runRealm({activeRaw:JSON.stringify(offlineState),backupRaw:null,preV2BackupRaw:null,preV3BackupRaw:null,stagingRaw:null,now});
const offlineDiagnostic=evaluate(offlineRun,`__P2_INTERNAL__.offline(${now},${JSON.stringify(offlineState)})`);
check('phase1-offline-24h-cap',offlineDiagnostic.elapsed===86_400_000);
check('phase1-offline-nonnegative',offlineDiagnostic.total>=0);
const queryOnly=runRealm({activeRaw:activeRaw(fresh),location:{protocol:'https:',hostname:'example.com',search:'?qa=1'}});
check('bridge-production-host-absent',evaluate(queryOnly,'window.__EVERSTEAD_QA__')===undefined);
const encoded=runRealm({activeRaw:activeRaw(fresh),location:{protocol:'http:',hostname:'127.0.0.1',search:'?qa=%31'}});
check('bridge-encoded-query-absent',evaluate(encoded,'window.__EVERSTEAD_QA__')===undefined);
const allDisabled=runRealm({activeRaw:activeRaw(fresh),features:{story:false,tower:false,trading:false,patrol:false,operations:false}});
const disabledBefore=activeRaw(allDisabled),disabledResults=['story','tower','trade','optimize-trade','patrol-start','operation-start','operation-claim'].map(name=>evaluate(allDisabled,`__EVERSTEAD_QA__.act('${name}')`));
check('all-disabled-actions-refused',disabledResults.every(result=>result.ok===false));
check('all-disabled-no-write',activeRaw(allDisabled)===disabledBefore);

const passed=checks.filter(item=>item.pass).length;
for(const item of checks)console.log(`${item.pass?'PASS':'FAIL'} ${item.id}${item.detail?' :: '+item.detail:''}`);
console.log(`\n${passed}/${checks.length} Phase 2 checks passed`);
if(passed!==checks.length)process.exitCode=1;
