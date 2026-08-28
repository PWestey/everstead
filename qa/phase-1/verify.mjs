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
const currentV1Raw = read('qa/gate-0b/fixtures/current-v1.txt').toString('utf8');
const legacyRaw = read('qa/fixtures/representative-v0.1.txt').toString('utf8');
const futureRaw = read('qa/gate-0b/fixtures/future-v99.txt').toString('utf8');
const corruptRaw = read('qa/gate-0b/fixtures/corrupt-json.txt').toString('utf8');
const manifest = JSON.parse(read('qa/phase-1/current-manifest.json'));
const scenarios = JSON.parse(read('qa/phase-1/scenarios.json'));
const keys = scenarios.storageKeys;
const checks = [];
const check = (id, pass, detail = '') => checks.push({ id, pass: Boolean(pass), detail: String(detail) });
const clone = value => JSON.parse(JSON.stringify(value));
const sha256 = value => createHash('sha256').update(value).digest('hex');

function state(raw) {
  try {
    const value = JSON.parse(raw);
    return value?.schemaVersion === 2 && Number.isInteger(value?.saveMeta?.revision) ? value : null;
  } catch {
    return null;
  }
}

function rawIdentity(raw) {
  if (raw == null) return 'null:0:00000000';
  let hash = 2166136261;
  for (let index = 0; index < raw.length; index += 1) {
    hash ^= raw.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return 'fnv1a32:' + raw.length + ':' + (hash >>> 0).toString(16).padStart(8, '0');
}

function instrument(script, hook = '') {
  if (!hook) return script;
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
    setDate(value) {
      const shifted = this.shifted();
      return this.setTime(NativeDate.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), value,
        shifted.getUTCHours(), shifted.getUTCMinutes(), shifted.getUTCSeconds(), shifted.getUTCMilliseconds()) + offset);
    }
    setHours(hours, minutes = 0, seconds = 0, milliseconds = 0) {
      const shifted = this.shifted();
      return this.setTime(NativeDate.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate(),
        hours, minutes, seconds, milliseconds) + offset);
    }
  };
}

function runRealm(options = {}) {
  const slots = new Map(Object.entries(options.initialSlots ?? {}));
  if (Object.hasOwn(options, 'activeRaw')) {
    if (options.activeRaw == null) slots.delete(keys.active);
    else slots.set(keys.active, options.activeRaw);
  }
  if (Object.hasOwn(options, 'backupRaw')) {
    if (options.backupRaw == null) slots.delete(keys.backupV0);
    else slots.set(keys.backupV0, options.backupRaw);
  }
  if (Object.hasOwn(options, 'preV2BackupRaw')) {
    if (options.preV2BackupRaw == null) slots.delete(keys.backupV1);
    else slots.set(keys.backupV1, options.preV2BackupRaw);
  }
  if (Object.hasOwn(options, 'stagingRaw')) {
    if (options.stagingRaw == null) slots.delete(keys.staging);
    else slots.set(keys.staging, options.stagingRaw);
  }
  const storageLog = [];
  const fault = { enabled: false, operation: 'setItem', key: keys.staging, step: null, ...(options.fault ?? {}) };
  const persistenceLog = [];
  const storage = options.storage ?? {
    getItem(key) {
      storageLog.push(['get', String(key)]);
      if (fault.enabled && !fault.step && !fault.type && fault.operation === 'getItem' && key === fault.key) throw new Error('injected read failure');
      return slots.get(String(key)) ?? null;
    },
    setItem(key, value) {
      storageLog.push(['set', String(key)]);
      if (fault.enabled && !fault.step && !fault.type && fault.operation === 'setItem' && key === fault.key) throw new Error('injected write failure');
      slots.set(String(key), String(value));
    },
    removeItem(key) {
      storageLog.push(['remove', String(key)]);
      if (fault.enabled && !fault.step && !fault.type && fault.operation === 'removeItem' && key === fault.key) throw new Error('injected remove failure');
      slots.delete(String(key));
    }
  };
  const nodes = Object.fromEntries(['#app', '#overlay', '#toast'].map(selector => [selector, {
    innerHTML: '', dataset: {}, style: {}, classList: { add() {}, remove() {} }
  }]));
  const document = {
    querySelector(selector) { return nodes[selector] ?? null; },
    querySelectorAll() { return []; },
    documentElement: { scrollWidth: options.width ?? 390 }
  };
  const clock = { value: options.now ?? Date.parse(scenarios.frozenNow) };
  const FixedDate = makeDate(clock, scenarios.timezoneOffsetMinutes);
  const randomValues = (options.randomSequence ?? scenarios.randomSequence).slice();
  let randomIndex = 0;
  const random = () => {
    if (options.randomThrows) throw new Error('injected random failure');
    if (randomIndex >= randomValues.length) throw new Error('runtime random exhausted');
    return randomValues[randomIndex++];
  };
  const timers = new Map();
  let timerId = 0;
  const clockAdapter = {
    now() { return clock.value; },
    setTimeout(callback) { const id = ++timerId; timers.set(id, callback); if (!options.deferTimers) callback(); return id; },
    clearTimeout(id) { timers.delete(id); }
  };
  const location = { protocol: 'http:', hostname: '127.0.0.1', search: '?qa=1', ...(options.location ?? {}) };
  const nativeStorage = options.nativeStorage ?? { getItem() { throw new Error('native storage used'); }, setItem() { throw new Error('native storage used'); }, removeItem() { throw new Error('native storage used'); } };
  const runtime = {
    clock: options.clock ?? clockAdapter,
    random: options.random ?? random,
    storage: options.runtimeStorage ?? storage,
    confirm: options.confirm ?? (() => true),
    ids: { save: () => 'save-phase-1', transaction: (() => { let n = 0; return () => 'tx-phase-1-' + (++n); })() },
    qa: options.qa ?? {}
  };
  if (Object.hasOwn(options, 'features')) runtime.features = options.features;
  const listeners = {};
  const context = {
    console, Math: Object.create(Math), Date: FixedDate, document, localStorage: nativeStorage, confirm: () => true,
    setTimeout(callback) { callback(); return 1; }, clearTimeout() {}, crypto: { randomUUID: () => 'native-id' },
    URLSearchParams, location, history: { pushState(_state, _title, url) { location.search = String(url).includes('?') ? String(url).slice(String(url).indexOf('?')) : ''; } },
    addEventListener(type, listener) { (listeners[type] ??= []).push(listener); }
  };
  context.Math.random = random;
  context.window = context;
  context.globalThis = context;
  context.__EVERSTEAD_RUNTIME__ = runtime;
  context.__EVERSTEAD_PERSISTENCE_TEST__ = {
    storage, operationLog: persistenceLog,
    fault(info) {
      if (fault.enabled && fault.type === 'replace-active' && info.step === 'active-conflict-check' && info.phase === 'before') {
        slots.set(keys.active, fault.replacementRaw);
        fault.enabled = false;
        return null;
      }
      if (fault.enabled && fault.step && info.step === fault.step && info.operation === fault.operation) return { type: 'throw', message: 'injected step failure' };
      return null;
    },
    status: {}
  };
  let thrown = null;
  vm.createContext(context);
  try {
    vm.runInContext(instrument(source, options.hook), context, { timeout: 20_000 });
  } catch (error) {
    thrown = error;
  }
  return { context, slots, storageLog, persistenceLog, nodes, clock, timers, thrown, fault };
}

function evaluate(run, expression) {
  return vm.runInContext(expression, run.context, { timeout: 10_000 });
}

function activeRaw(run) {
  return run.slots.get(keys.active) ?? null;
}

check('manifest-phase', manifest.manifestVersion === 1 && manifest.phase === '1' && manifest.baseCommit === 'e2dfc24f513499e176ab5c2be3894c8e324c31ac');
check('production-script-present', Boolean(source));
check('artifact-sha256', sha256(htmlBytes) === manifest.artifact.sha256, sha256(htmlBytes));
check('artifact-byte-length', htmlBytes.length === manifest.artifact.byteLength, htmlBytes.length);
check('scenario-sha256', sha256(read('qa/phase-1/scenarios.json')) === manifest.scenarios.sha256);
for (const [path, expected] of Object.entries(manifest.frozenHistoricalFiles)) check('frozen-' + path.replaceAll('/', '-'), sha256(read(path)) === expected, path);
check('embedded-assets-frozen', manifest.artifact.embeddedAssetLinesSha256 === manifest.baseArtifact.embeddedAssetLinesSha256, manifest.artifact.embeddedAssetLinesSha256);
check('schema-2-static', source.includes('CURRENT_SCHEMA_VERSION=2') && source.includes("id:'schema-1-to-2'"));
check('backup-v1-static', source.includes("PRE_V2_BACKUP_KEY=NS+'__raw_backup_v1'") && source.indexOf('ensurePreV2Backup(schemaOneRaw)') < source.indexOf("runMigrations(schemaOne,1,context,2)"));
check('active-key-compatible', source.includes("NS='oathforge_new_world_proto_v01'"));
check('everstead-title', /<title>Everstead/.test(html));
check('everstead-brand-ui', source.includes('<b>EVERSTEAD</b>'));
check('ordinary-debug-selectors-absent', !source.includes('data-act="simulate"') && !source.includes('data-act="add-patrol"') && !source.includes('data-act="reset"'));
check('ordinary-debug-dispatch-absent', !source.includes("if(a==='simulate')") && !source.includes("if(a==='add-patrol')") && !source.includes("if(a==='reset')"));
check('bridge-debug-actions-retained', source.includes("'add-patrol':()=>addPatrolOpportunity()") && source.includes('simulate:()=>simulate()'));
check('operator-ui-absent', !source.includes('data-operator') && !source.includes('Operators</h3>'));
check('formula-config-static', source.includes('familyAssignmentMultiplier') && source.includes('fellowRosterMultiplier') && source.includes('companionRosterMultiplier') && source.includes('overallDayMultiplier') && source.includes("'oathMultiplier']"));
check('offline-segmentation-static', source.includes('nextLocalMidnight') && source.includes('segments.push') && source.includes('S.pendingGold-=n'));

const fresh = runRealm({ activeRaw: null, backupRaw: null, preV2BackupRaw: null, stagingRaw: null });
const freshState = state(activeRaw(fresh));
check('fresh-no-throw', fresh.thrown === null, fresh.thrown?.message ?? '');
check('fresh-schema-2', freshState?.schemaVersion === 2);
check('fresh-no-operators', Object.values(freshState?.buildings ?? {}).every(building => !Object.hasOwn(building, 'operators')));
check('fresh-prosperity-valid', Number.isFinite(freshState?.prosperity) && freshState.prosperity >= 0);

const migratedV1 = runRealm({ activeRaw: currentV1Raw, backupRaw: null, preV2BackupRaw: null, stagingRaw: null });
const migratedV1State = state(activeRaw(migratedV1));
check('v1-migration-no-throw', migratedV1.thrown === null, migratedV1.thrown?.message ?? '');
check('v1-migration-schema-2', migratedV1State?.schemaVersion === 2);
check('v1-backup-exact', migratedV1.slots.get(keys.backupV1) === currentV1Raw);
check('v0-backup-never-overwritten', migratedV1.slots.get(keys.backupV0) === currentV1Raw);
check('v1-operators-removed', Object.values(migratedV1State?.buildings ?? {}).every(building => !Object.hasOwn(building, 'operators')));
check('v1-receipt-once', migratedV1State?.saveMeta?.appliedMigrations?.filter(item => item.id === 'schema-1-to-2').length === 1);
check('pending-undo-preserved', migratedV1State?.undo?.kind === 'oath-completion' && migratedV1State.undo.oathId === 'o7');

const migratedLegacy = runRealm({ activeRaw: legacyRaw, backupRaw: null, preV2BackupRaw: null, stagingRaw: null });
const migratedLegacyState = state(activeRaw(migratedLegacy));
const schemaOneBackup = JSON.parse(migratedLegacy.slots.get(keys.backupV1) ?? 'null');
check('legacy-migration-no-throw', migratedLegacy.thrown === null, migratedLegacy.thrown?.message ?? '');
check('legacy-v0-backup-exact', migratedLegacy.slots.get(keys.backupV0) === legacyRaw);
check('legacy-v1-backup-valid', schemaOneBackup?.schemaVersion === 1 && Object.values(schemaOneBackup.buildings ?? {}).every(building => Array.isArray(building.operators)));
check('legacy-migration-receipts', migratedLegacyState?.saveMeta?.appliedMigrations?.map(item => item.id).join(',') === 'legacy-v0.1-to-1,schema-1-to-2');
check('legacy-unicode-preserved', migratedLegacyState?.oaths?.some(oath => oath.title === 'Fixture café review 🌵' && oath.notes.includes('測試')));
const preV2OnlyRecovery = runRealm({ activeRaw:null, backupRaw:null, preV2BackupRaw:migratedLegacy.slots.get(keys.backupV1), stagingRaw:null });
check('pre-v2-only-backup-recovers', state(activeRaw(preV2OnlyRecovery))?.schemaVersion === 2);
check('pre-v2-only-backup-remains-exact', preV2OnlyRecovery.slots.get(keys.backupV1) === migratedLegacy.slots.get(keys.backupV1));

const reload = runRealm({ initialSlots: Object.fromEntries(migratedLegacy.slots) });
const reloadState = state(activeRaw(reload));
check('schema-2-idempotent-receipt', reloadState?.saveMeta?.appliedMigrations?.filter(item => item.id === 'schema-1-to-2').length === 1);
check('schema-2-backups-permanent', reload.slots.get(keys.backupV0) === legacyRaw && reload.slots.get(keys.backupV1) === migratedLegacy.slots.get(keys.backupV1));

const v1Unknown = JSON.parse(currentV1Raw);
v1Unknown.futureField = { label: '未知 🌵', nested: [1, { ok: true }] };
v1Unknown.buildings.training.futureBuildingField = 'keep-me';
const unknownRun = runRealm({ activeRaw: JSON.stringify(v1Unknown), backupRaw: null, preV2BackupRaw: null, stagingRaw: null });
const unknownState = state(activeRaw(unknownRun));
check('unknown-fields-preserved', unknownState?.futureField?.label === '未知 🌵' && unknownState?.buildings?.training?.futureBuildingField === 'keep-me');

const mismatchRun = runRealm({ activeRaw: currentV1Raw, backupRaw: currentV1Raw, preV2BackupRaw: JSON.stringify({ schemaVersion: 1 }), stagingRaw: null });
check('pre-v2-mismatch-preserves-active', activeRaw(mismatchRun) === currentV1Raw);
check('pre-v2-mismatch-blocks', /schema-1 backup contains different bytes/i.test(mismatchRun.nodes['#app'].innerHTML));

const backupFaultRun = runRealm({ activeRaw: currentV1Raw, backupRaw: currentV1Raw, preV2BackupRaw: null, stagingRaw: null, fault: { enabled: true, operation: 'setItem', key: keys.backupV1 } });
check('pre-v2-write-fault-preserves-active', activeRaw(backupFaultRun) === currentV1Raw);
check('pre-v2-write-precedes-staging', !backupFaultRun.storageLog.some(entry => entry[0] === 'set' && entry[1] === keys.staging));

const interrupted = runRealm({ activeRaw: currentV1Raw, backupRaw: currentV1Raw, preV2BackupRaw: null, stagingRaw: null, fault: { enabled: true, operation: 'setItem', step: 'active-write' } });
check('interrupted-active-preserved', activeRaw(interrupted) === currentV1Raw);
check('interrupted-staging-retained', typeof interrupted.slots.get(keys.staging) === 'string');
const recovered = runRealm({ initialSlots: Object.fromEntries(interrupted.slots) });
check('interrupted-staging-recovered', state(activeRaw(recovered))?.schemaVersion === 2 && recovered.slots.get(keys.staging) == null);

const invalidV2 = clone(freshState);
invalidV2.focusFellow = 'missing-fellow';
const invalidV2Raw = JSON.stringify(invalidV2);
const invalidV2Run = runRealm({ activeRaw:invalidV2Raw, backupRaw:invalidV2Raw, preV2BackupRaw:null, stagingRaw:null });
const invalidV2Export = evaluate(invalidV2Run, '__EVERSTEAD_QA__.recovery.export()');
check('invalid-v2-preserved', activeRaw(invalidV2Run) === invalidV2Raw && invalidV2Export.data.activeRaw === invalidV2Raw);
check('invalid-v2-recovery-render', /Save Needs Attention/.test(invalidV2Run.nodes['#app'].innerHTML));

const recoveryState = clone(freshState);
recoveryState.saveMeta.source = 'verified-staging';
const recoveryEnvelope = JSON.stringify({ stagingVersion:1, transactionId:'tx-phase-1-recovery', baseSaveId:null, baseRevision:null, sourceRawIdentity:rawIdentity(corruptRaw), source:'verified-staging', state:recoveryState });
const safeRecoveryRun = runRealm({ activeRaw:corruptRaw, backupRaw:corruptRaw, preV2BackupRaw:null, stagingRaw:recoveryEnvelope });
const safeRecoveryResult = evaluate(safeRecoveryRun, '__EVERSTEAD_QA__.recovery.recover()');
check('schema-2-safe-recovery', safeRecoveryResult.ok === true && state(activeRaw(safeRecoveryRun))?.schemaVersion === 2);
check('schema-2-safe-recovery-keeps-v0-backup', safeRecoveryRun.slots.get(keys.backupV0) === corruptRaw);

const conflictRun = runRealm({ activeRaw:null });
const conflictBase = state(activeRaw(conflictRun));
const conflictForeign = clone(conflictBase);
conflictForeign.saveMeta.revision += 1;
conflictForeign.saveMeta.source = 'foreign-tab';
const conflictForeignRaw = JSON.stringify(conflictForeign);
Object.assign(conflictRun.fault, { enabled:true, type:'replace-active', replacementRaw:conflictForeignRaw });
const conflictResult = evaluate(conflictRun, "__EVERSTEAD_QA__.act('roster',{tab:'family'})");
check('precommit-conflict-reported', conflictResult.ok === false);
check('precommit-conflict-protects-foreign', activeRaw(conflictRun) === conflictForeignRaw);

const undoRun = runRealm({ activeRaw:currentV1Raw, backupRaw:null, preV2BackupRaw:null, stagingRaw:null });
const undoResult = evaluate(undoRun, "__EVERSTEAD_QA__.act('complete-oath',{id:'o7'})");
const undoState = state(activeRaw(undoRun));
check('migrated-pending-undo-executes', undoResult.ok === true && undoState.undo === null);
check('migrated-pending-undo-scoped-values', undoState.buildings.archives.boost === 0.07 && undoState.prosperity === 357 && undoState.fellows.lyra.bond === 93);

const repairMissingV1 = JSON.parse(currentV1Raw);
delete repairMissingV1.lastGoldAt;
const repairMissingRaw = JSON.stringify(repairMissingV1);
const repairMissingRun = runRealm({ activeRaw:repairMissingRaw, backupRaw:null, preV2BackupRaw:null, stagingRaw:null });
check('v1-missing-timestamp-repaired', state(activeRaw(repairMissingRun))?.lastGoldAt === Date.parse(scenarios.frozenNow));
check('v1-missing-timestamp-backed-up-exact', repairMissingRun.slots.get(keys.backupV1) === repairMissingRaw);
const repairZeroV1 = JSON.parse(currentV1Raw);
repairZeroV1.lastGoldAt = 0;
const repairZeroRaw = JSON.stringify(repairZeroV1);
const repairZeroRun = runRealm({ activeRaw:repairZeroRaw, backupRaw:null, preV2BackupRaw:null, stagingRaw:null });
check('v1-zero-timestamp-preserved-in-backup', JSON.parse(repairZeroRun.slots.get(keys.backupV1)).lastGoldAt === 0);
check('v1-zero-timestamp-claims-once', state(activeRaw(repairZeroRun))?.lastGoldAt === Date.parse(scenarios.frozenNow));

for (const [id, raw] of [['future', futureRaw], ['corrupt', corruptRaw]]) {
  const run = runRealm({ activeRaw: raw, backupRaw: null, preV2BackupRaw: null, stagingRaw: null });
  const before = activeRaw(run);
  const exported = evaluate(run, '__EVERSTEAD_QA__.recovery.export()');
  check('export-' + id + '-exact', exported.ok === true && exported.data.activeRaw === raw);
  check('export-' + id + '-no-active-write', activeRaw(run) === before);
}

const brandText = fresh.nodes['#app'].innerHTML + fresh.nodes['#overlay'].innerHTML;
check('rendered-brand-everstead', /EVERSTEAD/.test(brandText));
check('rendered-legacy-brand-absent', !/OATHFORGE|NEW WORLD PROTOTYPE|Reset Prototype/i.test(brandText));
check('rendered-debug-controls-absent', !/SIMULATE 2H|\+1 PATROL|RESET PROTOTYPE/i.test(brandText));

const freshBeforeDiagnostics = activeRaw(fresh);
const rates = evaluate(fresh, '__EVERSTEAD_QA__.diagnostics().diagnostics');
check('base-rates-exact', rates.buildingRateComponents.training.base === 7200 && rates.buildingRateComponents.command.base === 6500 && rates.buildingRateComponents.archives.base === 5600 && rates.buildingRateComponents.hearth.base === 6100);
check('neutral-hooks-exact', Object.values(rates.buildingRateComponents).every(item => item.familyAssignmentBonus === 0 && item.fellowRosterBonus === 0 && item.companionRosterBonus === 0 && item.overallDayBonus === 0 && item.characterEconomyMultiplier === 1));
check('total-village-rate-exact', rates.totalVillageGoldPerHour === 25_400);
check('diagnostics-nonmutating', activeRaw(fresh) === freshBeforeDiagnostics);

for (const [difficulty, oathId, buildingId, boost, prosperity] of [
  ['easy', 'o1', 'archives', 0.03, 2],
  ['medium', 'o3', 'command', 0.05, 4],
  ['hard', 'o2', 'training', 0.08, 7]
]) {
  const run = runRealm({ activeRaw: null, backupRaw: null, preV2BackupRaw: null, stagingRaw: null });
  const before = state(activeRaw(run));
  const result = evaluate(run, "__EVERSTEAD_QA__.act('complete-oath',{id:'" + oathId + "'})");
  const after = state(activeRaw(run));
  check('oath-' + difficulty + '-action', result.ok === true);
  check('oath-' + difficulty + '-boost', Math.abs(after.buildings[buildingId].boost - boost) < 1e-12);
  check('oath-' + difficulty + '-focus-bond-preserved', after.fellows[after.focusFellow].bond === before.fellows[before.focusFellow].bond + 3);
  check('oath-' + difficulty + '-prosperity', after.prosperity === before.prosperity + prosperity);
  const diagnostic = evaluate(run, '__EVERSTEAD_QA__.diagnostics().diagnostics');
  check('oath-' + difficulty + '-final-multiplier', Math.abs(diagnostic.buildingRateComponents[buildingId].oathMultiplier - (1 + boost)) < 1e-12);
}

const capRun = runRealm({ activeRaw: null, hook: "S.buildings.archives.boost=.29;S.buildings.archives.boostDay=dayKey();" });
evaluate(capRun, "__EVERSTEAD_QA__.act('complete-oath',{id:'o1'})");
check('oath-cap-30-percent', state(activeRaw(capRun))?.buildings?.archives?.boost === 0.30);

const upgradeRun = runRealm({ activeRaw: null });
const upgradeBefore = state(activeRaw(upgradeRun));
evaluate(upgradeRun, "__EVERSTEAD_QA__.act('building-upgrade',{id:'training'})");
const upgradeAfter = state(activeRaw(upgradeRun));
check('upgrade-cost-level-1', upgradeAfter.gold === upgradeBefore.gold - 15_000);
check('upgrade-level-persists', upgradeAfter.buildings.training.level === 2);
const upgradeRate = evaluate(upgradeRun, '__EVERSTEAD_QA__.diagnostics().diagnostics.buildingRateComponents.training.rate');
check('upgrade-multiplier-1-15', upgradeRate === 7200 * 1.15);
for (const [level, expected] of [[1,15000],[2,25500],[3,43350],[5,125281]]) {
  const run = runRealm({ activeRaw:null, hook:'S.buildings.training.level=' + level + ';' });
  const components = evaluate(run, '__EVERSTEAD_QA__.diagnostics().diagnostics.buildingRateComponents.training');
  check('upgrade-cost-level-' + level, components.upgradeCost === expected, components.upgradeCost);
  check('rate-level-' + level, Math.abs(components.rate - 7200 * Math.pow(1.15, level - 1)) < 1e-8, components.rate);
  check('formula-order-level-' + level, components.formulaOrder.join('>') === 'base>levelMultiplier>familyAssignmentMultiplier>fellowRosterMultiplier>companionRosterMultiplier>overallDayMultiplier>oathMultiplier');
}

const operatorVariant = JSON.parse(currentV1Raw);
operatorVariant.buildings.training.operators = ['mira', 'selene', 'lyra'];
operatorVariant.fellows.mira.training = 99;
operatorVariant.companions.bramble.bound = 'mira';
const operatorA = runRealm({ activeRaw: currentV1Raw });
const operatorB = runRealm({ activeRaw: JSON.stringify(operatorVariant) });
const rateA = evaluate(operatorA, '__EVERSTEAD_QA__.diagnostics().diagnostics.buildingRateComponents.training.rate');
const rateB = evaluate(operatorB, '__EVERSTEAD_QA__.diagnostics().diagnostics.buildingRateComponents.training.rate');
check('legacy-operator-companion-non-influence', rateA === rateB);

const midnight = Date.parse('2030-06-18T07:30:00.000Z');
const segmented = runRealm({ activeRaw: null, now: midnight, hook: "S.lastGoldAt=" + (midnight - 3_600_000) + ";S.buildings.training.boost=.3;S.buildings.training.boostDay='D2030-6-17';" });
const segmentedPreview = evaluate(segmented, '__EVERSTEAD_QA__.diagnostics({at:' + midnight + '}).diagnostics.offlineClaimPreview');
const trainingLine = segmentedPreview.lines.find(line => line.id === 'training');
check('offline-midnight-segment-count', segmentedPreview.segments.length === 2);
check('offline-expired-oath-not-carried', Math.abs(trainingLine.value - 8280) < 1e-8, trainingLine.value);

for (const [id, delta, expected] of [
  ['0ms',0,0],['1ms',1,1],['60000ms',60_000,60_000],['60001ms',60_001,60_001],
  ['2h',7_200_000,7_200_000],['24h-minus-1',86_399_999,86_399_999],['24h',86_400_000,86_400_000],['24h-plus-1',86_400_001,86_400_000]
]) {
  const at = Date.parse(scenarios.frozenNow);
  const run = runRealm({ activeRaw:null, now:at, hook:'S.lastGoldAt=' + (at - delta) + ';' });
  const preview = evaluate(run, '__EVERSTEAD_QA__.diagnostics({at:' + at + '}).diagnostics.offlineClaimPreview');
  check('offline-boundary-' + id + '-elapsed', preview.elapsed === expected, preview.elapsed);
  check('offline-boundary-' + id + '-summary', preview.opensSummary === (expected > 60_000));
  check('offline-boundary-' + id + '-nonnegative', preview.total >= 0 && preview.pendingAfter >= preview.pendingBefore);
}

const rollbackAt = Date.parse(scenarios.frozenNow);
const rollback = runRealm({ activeRaw: null, now: rollbackAt, hook: 'S.lastGoldAt=' + (rollbackAt + 60_000) + ';' });
const rollbackBefore = state(activeRaw(rollback));
evaluate(rollback, "__EVERSTEAD_QA__.act('roster',{tab:'family'})");
const rollbackAfter = state(activeRaw(rollback));
check('rollback-no-gold', rollbackAfter.pendingGold === rollbackBefore.pendingGold);
check('rollback-last-gold-never-backward', rollbackAfter.lastGoldAt === rollbackAt + 60_000);

const zeroTimestamp = runRealm({ activeRaw: null, hook: 'S.lastGoldAt=0;' });
const zeroPreview = evaluate(zeroTimestamp, '__EVERSTEAD_QA__.diagnostics().diagnostics.offlineClaimPreview');
check('timestamp-zero-valid', zeroPreview.timestampValid === true && zeroPreview.elapsed === 86_400_000);
const missingTimestamp = runRealm({ activeRaw: null, hook: 'delete S.lastGoldAt;' });
const missingPreview = evaluate(missingTimestamp, '__EVERSTEAD_QA__.diagnostics().diagnostics.offlineClaimPreview');
check('timestamp-missing-safe', missingPreview.timestampValid === false && missingPreview.elapsed === 0 && missingPreview.total === 0);

const fractional = runRealm({ activeRaw: null, hook: 'S.pendingGold=10.75;S.lastGoldAt=runtimeNow();' });
const fractionalBefore = state(activeRaw(fractional));
evaluate(fractional, "__EVERSTEAD_QA__.act('collect')");
const fractionalAfter = state(activeRaw(fractional));
check('fractional-pending-retained', Math.abs(fractionalAfter.pendingGold - 0.75) < 1e-12 && fractionalAfter.gold === fractionalBefore.gold + 10);
evaluate(fractional, "__EVERSTEAD_QA__.act('collect')");
const fractionalTwice = state(activeRaw(fractional));
check('offline-double-claim-prevented', fractionalTwice.gold === fractionalAfter.gold && Math.abs(fractionalTwice.pendingGold - 0.75) < 1e-12);

const cloneRun = runRealm({ activeRaw: null });
const snapshot = evaluate(cloneRun, '__EVERSTEAD_QA__.snapshot()');
snapshot.state.buildings.training.level = 999;
const snapshotAgain = evaluate(cloneRun, '__EVERSTEAD_QA__.snapshot()');
check('bridge-deep-clone-isolation', snapshotAgain.state.buildings.training.level !== 999);

const deniedHost = runRealm({ activeRaw: null, location: { protocol: 'https:', hostname: 'everstead.example', search: '?qa=1' } });
check('bridge-production-host-absent', typeof deniedHost.context.__EVERSTEAD_QA__ === 'undefined');
const deniedQuery = runRealm({ activeRaw: null, location: { protocol: 'http:', hostname: '127.0.0.1', search: '?qa=1&qa=1' } });
check('bridge-duplicate-query-absent', typeof deniedQuery.context.__EVERSTEAD_QA__ === 'undefined');
check('bridge-loopback-present', typeof fresh.context.__EVERSTEAD_QA__ === 'object');

const allDisabled = runRealm({ activeRaw: null, features: { story: false, tower: false, trading: false, patrol: false, operations: false } });
for (const action of ['story', 'tower', 'trade', 'optimize-trade', 'optimize-story', 'patrol-start', 'operation-start']) {
  const before = activeRaw(allDisabled);
  const result = evaluate(allDisabled, "__EVERSTEAD_QA__.act('" + action + "')");
  check('all-disabled-' + action + '-refused', result.ok === false && activeRaw(allDisabled) === before);
}

const noDestructive = runRealm({ activeRaw: null, qa: { allowDestructive: false, isolatedStorage: true } });
const noDestructiveBefore = activeRaw(noDestructive);
const noSimulate = evaluate(noDestructive, "__EVERSTEAD_QA__.act('simulate')");
const noPatrol = evaluate(noDestructive, "__EVERSTEAD_QA__.act('add-patrol')");
check('bridge-destructive-auth-retained', noSimulate.ok === false && noPatrol.ok === false && activeRaw(noDestructive) === noDestructiveBefore);

const destructive = runRealm({ activeRaw: null, qa: { allowDestructive: true, isolatedStorage: true } });
const destructiveResult = evaluate(destructive, "__EVERSTEAD_QA__.act('simulate')");
check('bridge-isolated-destructive-success', destructiveResult.ok === true);

const exhausted = runRealm({ activeRaw: null, randomSequence: [0.25] });
const exhaustedBefore = activeRaw(exhausted);
const exhaustedResult = evaluate(exhausted, "__EVERSTEAD_QA__.act('navigate',{view:'village'})");
check('random-exhaustion-fails-closed', exhaustedResult.ok === false && activeRaw(exhausted) === exhaustedBefore);

const failures = checks.filter(item => !item.pass);
for (const item of checks) console.log((item.pass ? 'PASS' : 'FAIL') + ' ' + item.id + (item.detail ? ' :: ' + item.detail : ''));
console.log('');
console.log((checks.length - failures.length) + '/' + checks.length + ' Phase 1 checks passed');
if (failures.length) process.exitCode = 1;
