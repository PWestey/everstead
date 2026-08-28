import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const qaRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(qaRoot, '..', '..');
const scenarios = JSON.parse(readFileSync(resolve(qaRoot, 'scenarios.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(resolve(qaRoot, 'current-manifest.json'), 'utf8'));
const htmlBytes = readFileSync(resolve(repoRoot, 'index.html'));
const html = htmlBytes.toString('utf8');
const productionSource = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const checks = [];

const sha256 = value => createHash('sha256').update(value).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const check = (id, pass, detail = '') => checks.push({ id, pass: Boolean(pass), detail: String(detail) });

const fixturePaths = {
  'legacy-representative': resolve(repoRoot, 'qa/fixtures/representative-v0.1.txt'),
  'legacy-sparse': resolve(repoRoot, 'qa/fixtures/sparse-v0.1.txt'),
  'legacy-wrong-type': resolve(repoRoot, 'qa/fixtures/wrong-type-v0.1.txt'),
  'current-v1': resolve(qaRoot, 'fixtures/current-v1.txt'),
  'future-v99': resolve(qaRoot, 'fixtures/future-v99.txt'),
  'invalid-current-v1': resolve(qaRoot, 'fixtures/invalid-current-v1.txt'),
  'invalid-root': resolve(qaRoot, 'fixtures/invalid-root.txt'),
  'corrupt-json': resolve(qaRoot, 'fixtures/corrupt-json.txt'),
  'staging-successor-v1': resolve(qaRoot, 'fixtures/staging-successor-v1.txt'),
  'staging-stale-v1': resolve(qaRoot, 'fixtures/staging-stale-v1.txt'),
  'staging-conflicting-save-v1': resolve(qaRoot, 'fixtures/staging-conflicting-save-v1.txt'),
  'staging-invalid-state-v1': resolve(qaRoot, 'fixtures/staging-invalid-state-v1.txt')
};
const fixtures = Object.fromEntries(Object.entries(fixturePaths).map(([id, path]) => [id, readFileSync(path, 'utf8')]));
const keys = scenarios.storageKeys;

function rawIdentity(raw) {
  if (raw == null) return 'null:0:00000000';
  let hash = 2166136261;
  for (let index = 0; index < raw.length; index += 1) {
    hash ^= raw.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${raw.length}:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function currentState(raw) {
  try {
    const value = JSON.parse(raw);
    const meta = value?.saveMeta;
    return value?.schemaVersion === 1 && typeof meta?.saveId === 'string' && Number.isInteger(meta?.revision) &&
      meta.revision > 0 && Array.isArray(meta?.appliedMigrations) ? value : null;
  } catch {
    return null;
  }
}

function dynamicFixture(id) {
  if (id == null) return null;
  if (fixtures[id] != null) return fixtures[id];
  if (id === 'current-undo-ready') return fixtures['current-v1'];
  if (id === 'current-unknown-fields') {
    const state = JSON.parse(fixtures['current-v1']);
    state.expansionState = { chapter: 'future-one', flags: ['alpha', 'beta'] };
    state.ui.experimentalPanel = 'ledger';
    state.buildings.training.craftingQueue = [{ recipe: 'future-ingot', count: 2 }];
    state.oaths[0].futureReward = { currency: 'starlight', amount: 7 };
    return JSON.stringify(state);
  }
  if (['current-offline-2h', 'current-offline-24h', 'current-offline-30h'].includes(id)) {
    const state = JSON.parse(fixtures['current-v1']);
    const hours = id.endsWith('2h') ? 2 : id.endsWith('24h') ? 24 : 30;
    state.pendingGold = 0;
    state.lastGoldAt = Date.parse(scenarios.frozenNow) - hours * 3_600_000;
    state.lastSeen = state.lastGoldAt;
    return JSON.stringify(state);
  }
  if (id === 'staging-successor-for-corrupt') {
    const state = JSON.parse(fixtures['current-v1']);
    return JSON.stringify({
      stagingVersion: 1,
      transactionId: 'tx-corrupt-recovery',
      baseSaveId: null,
      baseRevision: null,
      sourceRawIdentity: rawIdentity(fixtures['corrupt-json']),
      source: 'fixture-corrupt-recovery',
      state
    });
  }
  throw new Error(`Unknown fixture ${id}`);
}

function instrument(source, action) {
  if (!action) return source;
  const hook = action === 'scoped-undo' ? `
    const __beforeUndoTest=clone(S);completeOath('o1');const __afterCompletion=clone(S);collectGold();const __afterCollect=clone(S);applyOathUndo();
    PERSISTENCE_TEST.status.scopedUndo={before:__beforeUndoTest,afterCompletion:__afterCompletion,afterCollect:__afterCollect,final:clone(S)};
  ` : action === 'gameplay-regressions' ? `
    const __gameplayBefore=clone(S),__nav=[];for(const __view of ['village','oaths','fellows','adventure','more']){nav(__view);__nav.push(S.ui.view)}
    const __upgradeCost=Math.round(15000*Math.pow(1.7,S.buildings.training.level-1));modalAction('upgrade-building','training');
    PERSISTENCE_TEST.status.gameplay={before:__gameplayBefore,final:clone(S),nav:__nav,upgradeCost:__upgradeCost};
  ` : action === 'unknown-field-mutation' ? `
    nav('more');PERSISTENCE_TEST.status.unknownFields=clone(S);
  ` : action === 'precommit-raw-conflict' ? `
    const __external=JSON.parse(PERSISTED_RAW);__external.concurrentMarker='external-write';const __externalRaw=JSON.stringify(__external);PERSISTENCE_STORAGE.setItem(NS,__externalRaw);nav('more');PERSISTENCE_TEST.status.precommitConflict={externalRaw:__externalRaw,finalRaw:PERSISTENCE_STORAGE.getItem(NS)};
  ` : action === 'fail-navigation' ? `
    PERSISTENCE_TEST.faultPlan.enabled=true;const __beforeFailedMutation=clone(S);nav('more');PERSISTENCE_TEST.status.failedMutation={before:__beforeFailedMutation,final:clone(S),toast:document.querySelector('#toast')?.innerHTML||''};
  ` : `persistenceAction(${JSON.stringify(action)});`;
  return source.replace(/\n\}\)\(\);\s*$/, match => `\n${hook}\n${match}`);
}

function runRealm({ active = null, backup = null, staging = null, faultPlan = null, action = null, idSeed = 0 }) {
  const slots = new Map();
  if (active != null) slots.set(keys.active, dynamicFixture(active));
  if (backup != null) slots.set(keys.backup, dynamicFixture(backup));
  if (staging != null) slots.set(keys.staging, dynamicFixture(staging));
  const storage = {
    get length() { return slots.size; },
    clear() { slots.clear(); },
    getItem(key) { return slots.get(String(key)) ?? null; },
    key(index) { return [...slots.keys()][index] ?? null; },
    removeItem(key) { slots.delete(String(key)); },
    setItem(key, value) { slots.set(String(key), String(value)); }
  };
  const nodes = Object.fromEntries(['#app', '#overlay', '#toast'].map(key => [key, {
    innerHTML: '', dataset: {}, style: {}, classList: { add() {}, remove() {} }
  }]));
  const document = {
    querySelector(selector) { return nodes[selector] ?? null; },
    querySelectorAll() { return []; },
    documentElement: { scrollWidth: 390 }
  };
  const NativeDate = Date;
  const now = Date.parse(scenarios.frozenNow);
  class FixedDate extends NativeDate {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  let saveCounter = idSeed;
  let transactionCounter = idSeed;
  const plan = faultPlan ? { ...faultPlan, enabled: faultPlan.enabled !== false, used: false } : null;
  const operationLog = [];
  const testConfig = {
    storage,
    operationLog,
    status: {},
    faultPlan: plan,
    idFactory: () => `${scenarios.deterministicIds.saveId}-${++saveCounter}`,
    transactionIdFactory: () => `${scenarios.deterministicIds.transactionIdPrefix}${++transactionCounter}`,
    fault(context) {
      if (!plan?.enabled || plan.used || context.step !== plan.step || context.phase !== plan.phase) return null;
      plan.used = true;
      return plan.type === 'mismatch' ? { type: 'mismatch', value: `${context.value ?? ''}__fault_mismatch__` } : { type: 'throw', message: `fault ${plan.phase} ${plan.step}` };
    }
  };
  const listeners = {};
  const context = {
    console, JSON, Math, Date: FixedDate, document, localStorage: storage, confirm: () => true,
    setTimeout(callback) { callback(); return 1; }, clearTimeout() {}, crypto: { randomUUID: () => 'unused-native-id' },
    __EVERSTEAD_PERSISTENCE_TEST__: testConfig,
    addEventListener(type, listener) { (listeners[type] ??= []).push(listener); }
  };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  let thrown = null;
  try { vm.runInContext(instrument(productionSource, action), context, { timeout: 10_000 }); } catch (error) { thrown = error; }
  return { slots, storage, nodes, operationLog, status: testConfig.status, plan, thrown };
}

function rawSlots(run) {
  return {
    active: run.slots.get(keys.active) ?? null,
    backup: run.slots.get(keys.backup) ?? null,
    staging: run.slots.get(keys.staging) ?? null
  };
}

check('manifest-gate', manifest.phaseGate === '0B' && manifest.manifestVersion === 1);
check('artifact-sha256', sha256(htmlBytes) === manifest.artifact.sha256, sha256(htmlBytes));
check('artifact-byte-length', htmlBytes.length === manifest.artifact.byteLength, htmlBytes.length);
for (const [path, expected] of Object.entries(manifest.historicalFiles ?? {})) {
  const actual = sha256(readFileSync(resolve(repoRoot, path)));
  check(`historical-${path.replaceAll('/', '-')}`, actual === expected, actual);
}
check('production-script-present', Boolean(productionSource));
check('schema-literal', productionSource.includes('CURRENT_SCHEMA_VERSION=1'));
check('receipt-literal', productionSource.includes("id:'legacy-v0.1-to-1'"));
check('metadata-literals', ['saveId', 'createdAt', 'updatedAt', 'revision', 'source', 'appliedMigrations'].every(key => productionSource.includes(key)));
check('transaction-order-source', ['backup-write', 'backup-verify', 'staging-write', 'staging-verify', 'active-conflict-check', 'active-write', 'active-verify', 'staging-cleanup'].every(step => productionSource.includes(step)));
check('coordinator-source', productionSource.includes('function mutatePersisted(') && productionSource.includes('const before=S,draft=clone(S)'));
check('three-part-conflict-source', productionSource.includes('expected.saveId!==current.saveId') && productionSource.includes('expected.revision!==current.revision') && productionSource.includes('expected.rawIdentity!==current.rawIdentity'));
check('storage-event-source', productionSource.includes("window.addEventListener('storage'") && productionSource.includes('PERSISTENCE_STALE=true'));
check('scoped-undo-source', productionSource.includes("kind:'oath-completion'") && !productionSource.includes('function snapshot()'));
check('oath-formulas-preserved', productionSource.includes("easy:{label:'Easy',boost:.03") && productionSource.includes("medium:{label:'Medium',boost:.05") && productionSource.includes("hard:{label:'Hard',boost:.08") && productionSource.includes('Math.min(.30'));
check('offline-formulas-preserved', productionSource.includes('Math.min(86400000') && productionSource.includes('elapsed>60000'));
check('upgrade-formula-preserved', productionSource.includes('Math.round(15000*Math.pow(1.7'));
check('navigation-roster-preserved', productionSource.includes("['village','⌂','Village']") && productionSource.includes('Fellows · 6') && productionSource.includes('Family · 3') && productionSource.includes('Companions · 2'));

for (const fixture of manifest.fixtures) {
  const bytes = readFileSync(resolve(repoRoot, fixture.path));
  check(`fixture-${fixture.id}-sha256`, sha256(bytes) === fixture.sha256, sha256(bytes));
  check(`fixture-${fixture.id}-bytes`, bytes.length === fixture.byteLength, bytes.length);
  check(`fixture-${fixture.id}-newline`, bytes.toString('utf8').endsWith('\n') === fixture.trailingNewline);
}

const scenarioStates = new Map();
for (const scenario of scenarios.scenarios) {
  let run = runRealm(scenario);
  for (let repeat = 1; repeat < (scenario.repeatBoots ?? 1); repeat += 1) {
    const slots = rawSlots(run);
    const repeated = { ...scenario, active: null, backup: null, staging: null, action: null, idSeed: repeat * 10 };
    run = runRealm({ ...repeated, active: null, backup: null, staging: null });
    run.slots = new Map(Object.entries({ [keys.active]: slots.active, [keys.backup]: slots.backup, [keys.staging]: slots.staging }).filter(([, value]) => value != null));
    const rerun = runRealmFromSlots(run.slots, repeat * 10);
    run = rerun;
  }
  const slots = rawSlots(run);
  const activeState = currentState(slots.active);
  if (activeState) scenarioStates.set(scenario.id, activeState);
  check(`${scenario.id}-no-uncaught`, run.thrown == null, run.thrown?.stack ?? '');
  check(`${scenario.id}-outcome`, run.status.outcome === scenario.expectedOutcome, run.status.outcome);

  if (scenario.expectedOutcome === 'REJECT_PRESERVE' && !scenario.action) {
    check(`${scenario.id}-active-preserved`, slots.active === dynamicFixture(scenario.active));
    check(`${scenario.id}-backup-exact`, slots.backup === dynamicFixture(scenario.active));
    check(`${scenario.id}-recovery-render`, run.nodes['#app'].innerHTML.includes('Save Needs Attention'));
  } else if (scenario.expectedOutcome !== 'REJECT_PRESERVE') {
    check(`${scenario.id}-current-active`, Boolean(activeState));
    check(`${scenario.id}-staging-clean`, slots.staging == null);
  }

  if (scenario.id === 'legacy-representative') {
    const legacy = JSON.parse(fixtures['legacy-representative']);
    const migrated = clone(activeState);
    delete legacy.lastSeen; delete migrated.lastSeen;
    delete legacy.undo; delete migrated.undo;
    delete migrated.schemaVersion; delete migrated.saveMeta;
    check('legacy-representative-backup-exact', slots.backup === fixtures['legacy-representative']);
    check('legacy-representative-complete-roundtrip', JSON.stringify(migrated) === JSON.stringify(legacy));
    check('legacy-representative-receipt', activeState.saveMeta.appliedMigrations.length === 1 && activeState.saveMeta.appliedMigrations[0].id === 'legacy-v0.1-to-1');
    check('legacy-representative-undo-migrated', activeState.undo?.version === 1 && activeState.undo?.kind === 'oath-completion' && activeState.undo?.snapshot == null);
  }
  if (scenario.id === 'twice-migrated') {
    check('twice-migrated-idempotent-receipts', activeState.saveMeta.appliedMigrations.length === 1);
    check('twice-migrated-stable-id', activeState.saveMeta.saveId === JSON.parse(fixtures['current-v1']).saveMeta.saveId);
  }
  if (scenario.id === 'current-matching-backup') check('matching-backup-preserved', slots.backup === fixtures['current-v1']);
  if (scenario.id === 'current-mismatched-backup') check('mismatched-backup-preserved', slots.backup === fixtures['legacy-representative']);
  if (scenario.id === 'staged-successor') check('staged-successor-promoted', activeState.gold === JSON.parse(fixtures['current-v1']).gold + 777);
  if (['staged-stale', 'staged-conflicting-save', 'staged-invalid-state'].includes(scenario.id)) check(`${scenario.id}-active-precedence`, activeState.gold === JSON.parse(fixtures['current-v1']).gold);
  if (scenario.id === 'missing-active-backup-recovery') check('backup-recovery-preserved', slots.backup === fixtures['legacy-representative']);
  if (scenario.id === 'corrupt-safe-reset') check('safe-reset-retains-backup', slots.backup === fixtures['corrupt-json'] && activeState.saveMeta.source === 'safe-reset');
  if (scenario.id === 'corrupt-backup-recovery') check('explicit-backup-recovery-retains-backup', slots.backup === fixtures['legacy-representative']);
  if (scenario.id === 'scoped-oath-undo') {
    const data = run.status.scopedUndo;
    const beforeOath = data?.before.oaths.find(item => item.id === 'o1');
    const finalOath = data?.final.oaths.find(item => item.id === 'o1');
    check('scoped-undo-oath-restored', beforeOath?.doneKey === finalOath?.doneKey && beforeOath?.streak === finalOath?.streak);
    check('scoped-undo-unrelated-gold-preserved', data?.final.gold === data?.afterCollect.gold && data?.final.gold > data?.before.gold);
    check('scoped-undo-timestamps-not-reverted', data?.final.saveMeta.revision > data?.afterCollect.saveMeta.revision && data?.final.lastGoldAt === data?.afterCollect.lastGoldAt);
    check('scoped-undo-cleared', data?.final.undo === null);
  }
  if (scenario.id === 'gameplay-regressions') {
    const data = run.status.gameplay;
    check('gameplay-navigation-regression', JSON.stringify(data?.nav) === JSON.stringify(['village','oaths','fellows','adventure','more']));
    check('gameplay-upgrade-regression', data?.final.buildings.training.level === data?.before.buildings.training.level + 1 && data?.final.gold === data?.before.gold - data?.upgradeCost);
  }
  if (scenario.id === 'unknown-fields-preserved') {
    const data = run.status.unknownFields;
    check('unknown-root-field-preserved', data?.expansionState?.chapter === 'future-one' && data?.expansionState?.flags?.join(',') === 'alpha,beta');
    check('unknown-nested-fields-preserved', data?.ui?.experimentalPanel === 'ledger' && data?.buildings?.training?.craftingQueue?.[0]?.recipe === 'future-ingot' && data?.oaths?.[0]?.futureReward?.amount === 7);
  }
  if (scenario.id === 'precommit-raw-conflict') {
    const data = run.status.precommitConflict;
    check('precommit-raw-conflict-preserved-external', data?.finalRaw === data?.externalRaw);
    check('precommit-raw-conflict-stopped-render', run.nodes['#app'].innerHTML.includes('Save Needs Attention'));
  }
  if (scenario.id === 'current-offline-2h') check('offline-2h-accrues-and-opens-summary', activeState.pendingGold > 0 && run.nodes['#overlay'].innerHTML.includes('offline-list'));
  if (scenario.id === 'mutation-write-failure') {
    const data = run.status.failedMutation;
    check('failed-mutation-not-adopted', data?.final.ui.view === data?.before.ui.view);
    check('failed-mutation-success-ui-suppressed', !String(data?.toast).includes('optimized'));
  }
}
check('offline-24h-cap-regression', Math.abs(scenarioStates.get('current-offline-24h').pendingGold - scenarioStates.get('current-offline-30h').pendingGold) < 1e-7);

function runRealmFromSlots(existingSlots, idSeed = 0) {
  const lookup = new Map(existingSlots);
  const active = lookup.get(keys.active) ?? null;
  const backup = lookup.get(keys.backup) ?? null;
  const staging = lookup.get(keys.staging) ?? null;
  const temporary = { active: null, backup: null, staging: null, idSeed };
  const original = dynamicFixture;
  const ids = { active: '__inline-active', backup: '__inline-backup', staging: '__inline-staging' };
  fixtures[ids.active] = active; fixtures[ids.backup] = backup; fixtures[ids.staging] = staging;
  const run = runRealm({ ...temporary, active: active == null ? null : ids.active, backup: backup == null ? null : ids.backup, staging: staging == null ? null : ids.staging });
  delete fixtures[ids.active]; delete fixtures[ids.backup]; delete fixtures[ids.staging];
  return run;
}

for (const faultCase of scenarios.faultMatrix) {
  const id = `fault-${faultCase.step}-${faultCase.phase}-${faultCase.type}`;
  const run = runRealm({ active: 'legacy-representative', faultPlan: faultCase });
  const slots = rawSlots(run);
  const active = currentState(slots.active);
  check(`${id}-triggered`, run.plan?.used === true);
  check(`${id}-caught`, run.thrown == null, run.thrown?.stack ?? '');
  if (faultCase.commitExpected) {
    check(`${id}-commit-valid`, Boolean(active));
    check(`${id}-backup-exact`, slots.backup === fixtures['legacy-representative']);
  } else {
    check(`${id}-recoverable`, slots.active === fixtures['legacy-representative'] || Boolean(active));
    if (active) check(`${id}-changed-active-has-backup`, slots.backup === fixtures['legacy-representative']);
  }
  const errorEntry = run.operationLog.find(entry => entry.step === faultCase.step && ['error', 'mismatch'].includes(entry.status));
  check(`${id}-logged`, Boolean(errorEntry));
  const backupWrite = run.operationLog.findIndex(entry => entry.step === 'backup-write' && entry.status === 'begin');
  const stagingWrite = run.operationLog.findIndex(entry => entry.step === 'staging-write' && entry.status === 'begin');
  const activeWrite = run.operationLog.findIndex(entry => entry.step === 'active-write' && entry.status === 'begin');
  check(`${id}-order`, stagingWrite < 0 || (backupWrite >= 0 && backupWrite < stagingWrite), `${backupWrite}/${stagingWrite}/${activeWrite}`);
  check(`${id}-active-after-staging`, activeWrite < 0 || (stagingWrite >= 0 && stagingWrite < activeWrite), `${stagingWrite}/${activeWrite}`);
}

const failed = checks.filter(item => !item.pass);
for (const item of checks) console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.id}${item.detail ? ` — ${item.detail}` : ''}`);
console.log(`\n${checks.length - failed.length}/${checks.length} Gate 0B checks passed.`);
if (failed.length) process.exitCode = 1;
