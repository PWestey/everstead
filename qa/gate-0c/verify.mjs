import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const qaRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(qaRoot, '..', '..');
const read = path => readFileSync(resolve(repoRoot, path));
const scenarios = JSON.parse(read('qa/gate-0c/scenarios.json'));
const manifest = JSON.parse(read('qa/gate-0c/current-manifest.json'));
const htmlBytes = read('index.html');
const html = htmlBytes.toString('utf8');
const productionSource = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const browserRunnerSource = read('qa/gate-0c/runner.js').toString('utf8');
const browserRealmSource = read('qa/gate-0c/realm.js').toString('utf8');
const currentRaw = read('qa/gate-0b/fixtures/current-v1.txt').toString('utf8');
const legacyRaw = read('qa/fixtures/representative-v0.1.txt').toString('utf8');
const corruptRaw = read('qa/gate-0b/fixtures/corrupt-json.txt').toString('utf8');
const invalidRaw = read('qa/gate-0b/fixtures/invalid-current-v1.txt').toString('utf8');
const futureRaw = read('qa/gate-0b/fixtures/future-v99.txt').toString('utf8');
const keys = scenarios.storageKeys;
const checks = [];
const sha256 = value => createHash('sha256').update(value).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const check = (id, pass, detail = '') => checks.push({ id, pass: Boolean(pass), detail: String(detail) });

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
    return value?.schemaVersion === 1 && Number.isInteger(value?.saveMeta?.revision) ? value : null;
  } catch { return null; }
}

function currentWith(mutator) {
  const value = JSON.parse(currentRaw);
  mutator(value);
  return JSON.stringify(value);
}

function instrument(source, hook = '') {
  if (!hook) return source;
  return source.replace(/\n\}\)\(\);\s*$/, match => `\n${hook}\n${match}`);
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
  };
}

function runRealm(options = {}) {
  const slots = new Map();
  if (options.activeRaw != null) slots.set(keys.active, options.activeRaw);
  if (options.backupRaw != null) slots.set(keys.backup, options.backupRaw);
  if (options.stagingRaw != null) slots.set(keys.staging, options.stagingRaw);
  const storageLog = [];
  const fault = { enabled: false, key: keys.staging, operation: 'setItem', ...(options.writeFault ?? {}) };
  const storage = options.storageOverride ?? {
    getItem(key) { storageLog.push(['get', String(key)]); if (fault.enabled && fault.operation === 'getItem' && key === fault.key) throw new Error('injected storage read failure'); return slots.get(String(key)) ?? null; },
    setItem(key, value) { storageLog.push(['set', String(key)]); if (fault.enabled && fault.operation === 'setItem' && key === fault.key) throw new Error('injected storage write failure'); slots.set(String(key), String(value)); },
    removeItem(key) { storageLog.push(['remove', String(key)]); if (fault.enabled && fault.operation === 'removeItem' && key === fault.key) throw new Error('injected storage remove failure'); slots.delete(String(key)); }
  };
  const nodes = Object.fromEntries(['#app', '#overlay', '#toast'].map(selector => [selector, {
    innerHTML: '', dataset: {}, style: {}, classList: { add() {}, remove() {} }
  }]));
  const document = {
    querySelector(selector) { return nodes[selector] ?? null; },
    querySelectorAll() { return []; },
    documentElement: { scrollWidth: options.viewportWidth ?? 390 }
  };
  const clock = { value: options.now ?? Date.parse(scenarios.frozenNow) };
  const FixedDate = makeDate(clock, scenarios.timezoneOffsetMinutes);
  const randomValues = (options.randomSequence ?? scenarios.randomSequence).slice();
  let randomIndex = 0;
  const random = () => {
    if (options.randomThrows) throw new Error('injected random failure');
    if (options.randomInvalid) return null;
    if (randomIndex >= randomValues.length) throw new Error('runtime random exhausted');
    return randomValues[randomIndex++];
  };
  const timers = new Map();
  let timerId = 0;
  const clockAdapter = options.clockOverride ?? {
    now() { if (options.clockThrows) throw new Error('injected clock failure'); return options.clockInvalid ? null : clock.value; },
    setTimeout(callback) { if (options.timerThrows) throw new Error('injected timer failure'); const id = ++timerId; timers.set(id, callback); if (options.deferTimers !== true) callback(); return id; },
    clearTimeout(id) { if (options.clearTimerThrows) throw new Error('injected clear timer failure'); timers.delete(id); }
  };
  const location = { protocol: 'http:', hostname: '127.0.0.1', search: '?qa=1', ...(options.location ?? {}) };
  const nativeStorage = options.runtimeUsesNativeStorage ? storage : options.nativeStorage ?? (options.runtime === false ? storage : { getItem() { throw new Error('native storage fallback used'); }, setItem() { throw new Error('native storage fallback used'); }, removeItem() { throw new Error('native storage fallback used'); } });
  const math = Object.create(Math);
  math.random = random;
  const runtime = {};
  if (options.featuresProvided) runtime.features = options.features;
  if (options.runtime !== false) {
    runtime.clock = clockAdapter;
    runtime.random = options.randomAdapter ?? random;
    runtime.storage = options.runtimeUsesNativeStorage ? nativeStorage : options.runtimeStorage === undefined ? storage : options.runtimeStorage;
    runtime.confirm = options.confirmAdapter ?? (() => true);
    runtime.ids = { save: () => 'save-gate-0c', transaction: (() => { let value = 0; return () => `tx-gate-0c-${++value}`; })() };
    runtime.qa = options.qaConfig ?? {};
  }
  const listeners = {};
  const context = {
    console,
    Math: math, Date: FixedDate, document, localStorage: nativeStorage, confirm: () => true,
    setTimeout(callback) { callback(); return 1; }, clearTimeout() {},
    crypto: { randomUUID: () => 'native-random-uuid' }, URLSearchParams,
    location, history: { pushState(_state, _title, url) { location.search = String(url).includes('?') ? String(url).slice(String(url).indexOf('?')) : ''; } },
    __HARNESS_FAULT__: fault,
    addEventListener(type, listener) { (listeners[type] ??= []).push(listener); }
  };
  context.window = context;
  context.globalThis = context;
  context.window.URLSearchParams = URLSearchParams;
  if (options.runtime !== false) context.__EVERSTEAD_RUNTIME__ = runtime;
  if (options.persistenceTest) context.__EVERSTEAD_PERSISTENCE_TEST__ = options.persistenceTest;
  vm.createContext(context);
  let thrown = null;
  try { vm.runInContext(instrument(productionSource, options.hook), context, { timeout: 15_000 }); } catch (error) { thrown = error; }
  return { context, slots, nodes, storageLog, clock, fault, thrown, randomRemaining: () => randomValues.length - randomIndex };
}

function evaluate(run, expression) {
  return vm.runInContext(expression, run.context, { timeout: 10_000 });
}

function activeRaw(run) { return run.slots.get(keys.active) ?? null; }

check('manifest-version', manifest.manifestVersion === 1 && manifest.phaseGate === '0C' && manifest.baseCommit === '81ec44c' && manifest.correctionBaseCommit === '7a80a04');
check('artifact-sha256', sha256(htmlBytes) === manifest.artifact.sha256, sha256(htmlBytes));
check('artifact-byte-length', htmlBytes.length === manifest.artifact.byteLength, htmlBytes.length);
check('scenario-sha256', sha256(read(manifest.scenarios.path)) === manifest.scenarios.sha256);
check('historical-artifact-count', Object.keys(manifest.historicalFiles).length === 54, Object.keys(manifest.historicalFiles).length);
for (const [path, expected] of Object.entries(manifest.historicalFiles)) check(`historical-${path.replaceAll('/', '-')}`, sha256(read(path)) === expected, sha256(read(path)));
check('embedded-assets-unchanged', manifest.artifact.embeddedAssetLinesSha256 === manifest.artifact.baseEmbeddedAssetLinesSha256, manifest.artifact.embeddedAssetLinesSha256);
check('production-script-present', Boolean(productionSource));
check('branding-preserved', productionSource.includes('NEW WORLD PROTOTYPE') && productionSource.includes('OATHFORGE'));
check('oath-formulas-preserved', productionSource.includes("easy:{label:'Easy',boost:.03") && productionSource.includes("medium:{label:'Medium',boost:.05") && productionSource.includes("hard:{label:'Hard',boost:.08") && productionSource.includes('Math.min(.30'));
check('offline-formulas-preserved', productionSource.includes('Math.min(86400000') && productionSource.includes('elapsed>60000'));
check('upgrade-formula-preserved', productionSource.includes('Math.round(15000*Math.pow(1.7'));
check('rosters-preserved', productionSource.includes('Fellows · 6') && productionSource.includes('Family · 3') && productionSource.includes('Companions · 2'));
check('adapter-source-seams', ['runtimeNow()', 'runtimeRandom()', 'runtimeConfirm(message)', 'PERSISTENCE_STORAGE', 'runtimeSetTimeout(', 'runtimeClearTimeout('].every(token => productionSource.includes(token)));
check('native-date-now-only-adapter', (productionSource.match(/Date\.now\(\)/g) ?? []).length === 1);
check('native-new-date-only-adapter', (productionSource.match(/new Date\(/g) ?? []).length === 1);
check('native-random-only-adapter', (productionSource.match(/Math\.random\(\)/g) ?? []).length === 1);
check('native-confirm-only-adapter', (productionSource.match(/window\.confirm\(/g) ?? []).length === 1 && !/(^|[^.\w])confirm\(/m.test(productionSource));
check('native-storage-only-adapter', (productionSource.match(/window\.localStorage/g) ?? []).length === 1 && !/localStorage\s*\./.test(productionSource));
check('feature-leaf-guards', ["resolveStory(){if(!featureEnabled('story'))", "resolveTower(){if(!featureEnabled('tower'))", "resolveTrade(){if(!featureEnabled('trading'))", "optimizeTrade(){if(!featureEnabled('trading'))", "startPatrol(){if(!featureEnabled('patrol'))", "patrolChoice(pi,ci){if(!featureEnabled('patrol'))", "startOperation(){if(!featureEnabled('operations'))", "claimOperation(){if(!featureEnabled('operations'))", "setAdventure(tab){if(!featureEnabled(tab))"].every(token => productionSource.includes(token)));
check('story-resolve-leaf-guard', productionSource.includes("featureEnabled('story')&&typeof S.currentWall==='string'&&S.currentWall.startsWith('story-')"));
check('patrol-rollover-leaf-guard', productionSource.includes("if(featureEnabled('patrol'))S.patrolBank="));
check('bridge-gate-source', productionSource.includes("rawQa.length===1&&values.length===1&&values[0]==='1'") && productionSource.includes("['localhost','127.0.0.1','[::1]','::1']"));
check('bridge-input-hardening-source', productionSource.includes('assertBridgeInput') && productionSource.includes('Object.getOwnPropertyDescriptor') && productionSource.includes('BRIDGE_FORBIDDEN_KEYS'));
check('grandfathered-visible-qa-controls-preserved', productionSource.includes('data-act="simulate">SIMULATE 2H') && productionSource.includes('data-act="add-patrol"') && productionSource.includes('data-act="reset">RESET') && productionSource.includes("if(a==='simulate')simulate()") && productionSource.includes("if(a==='add-patrol')addPatrolOpportunity()") && productionSource.includes("if(a==='reset')resetProto()"));
check('bridge-destructive-action-metadata', productionSource.includes("QA_ACTION_METADATA=Object.freeze({'add-patrol':Object.freeze({destructive:true}),simulate:Object.freeze({destructive:true})})") && productionSource.includes('if(QA_ACTION_METADATA[name]?.destructive)requireQaDestructiveAuthorization()'));
check('bridge-destructive-storage-attestation-source', productionSource.includes("RUNTIME_QA.isolatedStorage===true") && productionSource.includes('STORAGE_SOURCE!==NATIVE_STORAGE'));
check('browser-runner-dependency-free', !/https?:\/\/|\bimport\s|\brequire\s*\(/.test(browserRunnerSource + browserRealmSource));
check('browser-runner-checksum-before-execution', browserRunnerSource.includes("await loadContract(),results=[...contract.staticResults]") && browserRunnerSource.includes('checksum mismatch; execution aborted'));
check('browser-runner-memory-storage', browserRealmSource.includes('new Map(Object.entries(config.slots))') && !browserRealmSource.includes('localStorage'));
check('browser-runner-mobile-matrix', browserRunnerSource.includes("for(const viewport of contract.scenarios.viewports)") && scenarios.viewports.some(item => item.width === 320 && item.height === 568) && scenarios.viewports.some(item => item.width === 390 && item.height === 844));
check('browser-runner-publishes-result', browserRunnerSource.includes('window.__EVERSTEAD_GATE_0C_RESULT__'));

for (const [id, raw] of [['fresh', null], ['legacy', legacyRaw], ['current', currentRaw]]) {
  const run = runRealm({ activeRaw: raw });
  const saved = currentState(activeRaw(run));
  check(`${id}-boot-no-uncaught`, !run.thrown, run.thrown?.stack ?? '');
  check(`${id}-boot-current`, Boolean(saved));
  check(`${id}-boot-staging-clean`, !run.slots.has(keys.staging));
  if (id === 'legacy') {
    check('legacy-backup-exact', run.slots.get(keys.backup) === legacyRaw);
    check('legacy-receipt-once', saved?.saveMeta.appliedMigrations.filter(item => item.id === 'legacy-v0.1-to-1').length === 1);
  }
}

const defaultRun = runRealm({ activeRaw: currentRaw, runtime: false, persistenceTest: { storage: null } });
check('default-adapters-no-uncaught', !defaultRun.thrown, defaultRun.thrown?.stack ?? '');
check('default-features-all-enabled', evaluate(defaultRun, "__EVERSTEAD_QA__.flags().features.story&&__EVERSTEAD_QA__.flags().features.tower&&__EVERSTEAD_QA__.flags().features.trading&&__EVERSTEAD_QA__.flags().features.patrol&&__EVERSTEAD_QA__.flags().features.operations"));
check('default-current-persists', Boolean(currentState(activeRaw(defaultRun))));

const featureDefaults = scenarios.defaultFeatures;
for (const feature of scenarios.disabledFeatures) {
  const features = { ...featureDefaults, [feature]: false };
  let raw = currentRaw;
  if (feature === 'story') raw = currentWith(state => { state.currentWall = 'story-1'; state.resolve['story-1'] = 0.07; state.oaths[0].doneKey = null; });
  if (feature === 'patrol') raw = currentWith(state => { state.day = 'D2030-6-16'; state.patrolBank = 1; });
  if (feature === 'operations') raw = currentWith(state => { state.operation = { ids: ['cael','lyra','orin'], startedAt: Date.parse(scenarios.frozenNow) - 700_000, endAt: Date.parse(scenarios.frozenNow) - 1 }; });
  const hooks = {
    story: `const __beforeStoryRaw=PERSISTENCE_STORAGE.getItem(NS),__beforeResolve=S.resolve['story-1'];resolveStory();const __afterStoryDirect=PERSISTENCE_STORAGE.getItem(NS);action('story');const __afterStoryDispatch=PERSISTENCE_STORAGE.getItem(NS);setAdventure('story');const __afterStoryRoute=PERSISTENCE_STORAGE.getItem(NS);completeOath('o1');window.__FEATURE_STATUS__={before:__beforeStoryRaw,direct:__afterStoryDirect,dispatch:__afterStoryDispatch,route:__afterStoryRoute,resolveBefore:__beforeResolve,resolveAfter:S.resolve['story-1'],final:PERSISTENCE_STORAGE.getItem(NS),html:document.querySelector('#app').innerHTML};`,
    tower: `const __before=PERSISTENCE_STORAGE.getItem(NS);resolveTower();const __direct=PERSISTENCE_STORAGE.getItem(NS);action('tower');const __dispatch=PERSISTENCE_STORAGE.getItem(NS);setAdventure('tower');window.__FEATURE_STATUS__={before:__before,direct:__direct,dispatch:__dispatch,final:PERSISTENCE_STORAGE.getItem(NS)};`,
    trading: `const __before=PERSISTENCE_STORAGE.getItem(NS);resolveTrade();const __direct=PERSISTENCE_STORAGE.getItem(NS);action('trade');const __dispatch=PERSISTENCE_STORAGE.getItem(NS);optimizeTrade();const __opt=PERSISTENCE_STORAGE.getItem(NS);setAdventure('trading');window.__FEATURE_STATUS__={before:__before,direct:__direct,dispatch:__dispatch,opt:__opt,final:PERSISTENCE_STORAGE.getItem(NS)};`,
    patrol: `const __before=PERSISTENCE_STORAGE.getItem(NS),__bank=S.patrolBank;startPatrol();const __start=PERSISTENCE_STORAGE.getItem(NS);action('patrol');const __dispatch=PERSISTENCE_STORAGE.getItem(NS);patrolChoice(0,0);const __choice=PERSISTENCE_STORAGE.getItem(NS);addPatrolOpportunity();const __add=PERSISTENCE_STORAGE.getItem(NS);nav('more');window.__FEATURE_STATUS__={before:__before,start:__start,dispatch:__dispatch,choice:__choice,add:__add,bankBefore:__bank,bankAfter:S.patrolBank,final:PERSISTENCE_STORAGE.getItem(NS)};`,
    operations: `const __before=PERSISTENCE_STORAGE.getItem(NS);claimOperation();const __claim=PERSISTENCE_STORAGE.getItem(NS);action('claim-op');const __dispatch=PERSISTENCE_STORAGE.getItem(NS);startOperation();window.__FEATURE_STATUS__={before:__before,claim:__claim,dispatch:__dispatch,final:PERSISTENCE_STORAGE.getItem(NS)};`
  };
  const run = runRealm({ activeRaw: raw, featuresProvided: true, features, hook: hooks[feature] });
  const status = run.context.__FEATURE_STATUS__;
  check(`${feature}-disabled-no-uncaught`, !run.thrown, run.thrown?.stack ?? '');
  check(`${feature}-disabled-direct-no-write`, status?.direct === status?.before || status?.start === status?.before || status?.claim === status?.before);
  check(`${feature}-disabled-dispatch-no-write`, status?.dispatch === (status?.direct ?? status?.start ?? status?.claim));
  if (feature === 'story') {
    check('story-disabled-route-setter-no-write', status.route === status.dispatch);
    check('story-disabled-oath-no-extra-resolve', status.resolveAfter === status.resolveBefore);
  }
  if (feature === 'trading') {
    check('trading-disabled-optimizer-no-write', status.opt === status.dispatch);
    check('trading-disabled-route-setter-no-write', status.final === status.opt);
  }
  if (feature === 'patrol') {
    check('patrol-disabled-open-choice-no-write', status.choice === status.dispatch);
    check('patrol-disabled-grant-route-no-write', status.add === status.choice);
    check('patrol-disabled-rollover-no-replenish', status.bankAfter === status.bankBefore);
  }
  if (feature === 'operations') check('operations-disabled-ready-claim-no-write', status.claim === status.before && status.final === status.dispatch);
}

const partialFlags = { story: true, tower: 'true', patrol: false };
const partialRun = runRealm({ activeRaw: currentRaw, featuresProvided: true, features: partialFlags });
partialFlags.story = false; partialFlags.tower = true; partialFlags.trading = true;
const partialResult = evaluate(partialRun, '__EVERSTEAD_QA__.flags().features');
check('feature-overrides-own-literal-true-only', partialResult.story === true && Object.entries(partialResult).filter(([key]) => key !== 'story').every(([, value]) => value === false));
const inheritedRun = runRealm({ activeRaw: currentRaw, featuresProvided: true, features: Object.create({ story: true, tower: true }) });
check('feature-overrides-ignore-inherited', Object.values(evaluate(inheritedRun, '__EVERSTEAD_QA__.flags().features')).every(value => value === false));
check('feature-overrides-cloned', evaluate(partialRun, '__EVERSTEAD_QA__.flags().features.story') === true);
const allDisabledRun = runRealm({ activeRaw: currentRaw, featuresProvided: true, features: { story: false, tower: false, trading: false, patrol: false, operations: false } });
const allDisabledBefore = activeRaw(allDisabledRun);
const allDisabledResult = evaluate(allDisabledRun, `['story','tower','trade','patrol-start','operation-start'].map(name=>__EVERSTEAD_QA__.act(name))`);
check('feature-combination-all-disabled-flags', Object.values(evaluate(allDisabledRun, '__EVERSTEAD_QA__.flags().features')).every(value => value === false));
check('feature-combination-all-disabled-actions-refused', allDisabledResult.every(result => result.ok === false));
check('feature-combination-all-disabled-no-write', activeRaw(allDisabledRun) === allDisabledBefore);
const mixedFlags = { story: true, tower: false, trading: true, patrol: false, operations: true };
const mixedRun = runRealm({ activeRaw: currentRaw, featuresProvided: true, features: mixedFlags });
mixedFlags.story = false; mixedFlags.tower = true; mixedFlags.patrol = true;
const mixedResult = evaluate(mixedRun, '__EVERSTEAD_QA__.flags().features');
check('feature-combination-mixed-exact', mixedResult.story === true && mixedResult.tower === false && mixedResult.trading === true && mixedResult.patrol === false && mixedResult.operations === true);
check('feature-combination-mixed-cloned', mixedResult.story === true && mixedResult.tower === false && mixedResult.patrol === false);

for (const [id, options] of [
  ['clock-missing-methods', { clockOverride: { now: () => Date.parse(scenarios.frozenNow) } }],
  ['clock-null', { clockInvalid: true }],
  ['clock-throw', { clockThrows: true }],
  ['timer-throw', { timerThrows: true }],
  ['clear-timer-throw', { clearTimerThrows: true }],
  ['storage-invalid', { runtimeStorage: {} }]
]) {
  const run = runRealm({ activeRaw: currentRaw, ...options });
  check(`${id}-caught`, !run.thrown, run.thrown?.stack ?? '');
  check(`${id}-active-unchanged`, activeRaw(run) === currentRaw);
  check(`${id}-recovery-render`, run.nodes['#app'].innerHTML.includes('Save Needs Attention'));
}

for (const [id, options] of [['random-invalid', { randomInvalid: true }], ['random-throw', { randomThrows: true }]]) {
  const run = runRealm({ activeRaw: currentRaw, ...options, hook: `const __before=PERSISTENCE_STORAGE.getItem(NS);nav('village');window.__ADAPTER_STATUS__={before:__before,after:PERSISTENCE_STORAGE.getItem(NS)};` });
  check(`${id}-caught`, !run.thrown, run.thrown?.stack ?? '');
  check(`${id}-no-action-write`, run.context.__ADAPTER_STATUS__?.before === run.context.__ADAPTER_STATUS__?.after);
}

for (const [id, adapter] of [['confirm-invalid', () => 'true'], ['confirm-throw', () => { throw new Error('confirm failed'); }]]) {
  const run = runRealm({ activeRaw: currentRaw, confirmAdapter: adapter, hook: `const __before=PERSISTENCE_STORAGE.getItem(NS);deleteOath('o1');window.__ADAPTER_STATUS__={before:__before,after:PERSISTENCE_STORAGE.getItem(NS)};` });
  check(`${id}-caught`, !run.thrown, run.thrown?.stack ?? '');
  check(`${id}-no-write`, run.context.__ADAPTER_STATUS__?.before === run.context.__ADAPTER_STATUS__?.after);
}

const faultRun = runRealm({ activeRaw: currentRaw, hook: `const __before=PERSISTENCE_STORAGE.getItem(NS);window.__HARNESS_FAULT__.enabled=true;nav('more');window.__ADAPTER_STATUS__={before:__before,after:PERSISTENCE_STORAGE.getItem(NS)};` });
check('storage-write-fault-caught', !faultRun.thrown, faultRun.thrown?.stack ?? '');
check('storage-write-fault-no-active-write', faultRun.context.__ADAPTER_STATUS__?.before === faultRun.context.__ADAPTER_STATUS__?.after);
check('storage-write-fault-recovery-render', faultRun.nodes['#app'].innerHTML.includes('Save Needs Attention'));
const bridgeFaultRun = runRealm({ activeRaw: currentRaw });
const bridgeFaultBefore = activeRaw(bridgeFaultRun);
bridgeFaultRun.fault.enabled = true;
const bridgeFaultResult = evaluate(bridgeFaultRun, `__EVERSTEAD_QA__.act('story')`);
check('bridge-storage-fault-undefined-handler-reported', bridgeFaultResult.ok === false && /injected storage write failure/i.test(bridgeFaultResult.error));
check('bridge-storage-fault-undefined-handler-no-write', activeRaw(bridgeFaultRun) === bridgeFaultBefore);

const exhaustionRun = runRealm({ activeRaw: currentRaw });
evaluate(exhaustionRun, "__EVERSTEAD_QA__.random.setSequence([0])");
evaluate(exhaustionRun, "__EVERSTEAD_QA__.act('navigate',{view:'village'})");
const exhaustionBefore = activeRaw(exhaustionRun);
const exhaustionResult = evaluate(exhaustionRun, "__EVERSTEAD_QA__.act('navigate',{view:'village'})");
check('random-sequence-exhaustion-reported', exhaustionResult.ok === false && exhaustionResult.changed === false && /exhausted/i.test(exhaustionResult.error));
check('random-sequence-exhaustion-no-write', activeRaw(exhaustionRun) === exhaustionBefore);

const positiveLocations = [
  ['localhost', { protocol: 'http:', hostname: 'localhost', search: '?qa=1' }],
  ['127', { protocol: 'https:', hostname: '127.0.0.1', search: '?x=1&qa=1' }],
  ['ipv6', { protocol: 'http:', hostname: '[::1]', search: '?qa=1&x=1' }]
];
for (const [id, location] of positiveLocations) check(`bridge-positive-${id}`, Boolean(runRealm({ activeRaw: currentRaw, location }).context.__EVERSTEAD_QA__));
const negativeLocations = [
  ['no-query', { protocol: 'http:', hostname: 'localhost', search: '' }],
  ['query-zero', { protocol: 'http:', hostname: 'localhost', search: '?qa=0' }],
  ['duplicate', { protocol: 'http:', hostname: 'localhost', search: '?qa=1&qa=1' }],
  ['conflict', { protocol: 'http:', hostname: 'localhost', search: '?qa=1&qa=0' }],
  ['encoded-key', { protocol: 'http:', hostname: 'localhost', search: '?%71a=1' }],
  ['encoded-value', { protocol: 'http:', hostname: 'localhost', search: '?qa=%31' }],
  ['encoded-duplicate', { protocol: 'http:', hostname: 'localhost', search: '?qa=1&%71a=1' }],
  ['evil-host', { protocol: 'http:', hostname: 'localhost.evil', search: '?qa=1' }],
  ['other-loopback', { protocol: 'http:', hostname: '127.0.0.2', search: '?qa=1' }],
  ['all-interfaces', { protocol: 'http:', hostname: '0.0.0.0', search: '?qa=1' }],
  ['file', { protocol: 'file:', hostname: '', search: '?qa=1' }],
  ['data', { protocol: 'data:', hostname: '', search: '?qa=1' }],
  ['blob', { protocol: 'blob:', hostname: 'localhost', search: '?qa=1' }],
  ['about', { protocol: 'about:', hostname: '', search: '?qa=1' }],
  ['srcdoc', { protocol: 'about:', hostname: '', search: '?qa=1' }]
];
for (const [id, location] of negativeLocations) check(`bridge-negative-${id}`, runRealm({ activeRaw: currentRaw, location }).context.__EVERSTEAD_QA__ === undefined);
const pushedRun = runRealm({ activeRaw: currentRaw });
check('bridge-pushstate-revokes-property', evaluate(pushedRun, `(()=>{const cached=__EVERSTEAD_QA__;history.pushState({},'', '/index.html');return window.__EVERSTEAD_QA__===undefined&&cached.snapshot().ok===false})()`));
const addedQueryRun = runRealm({ activeRaw: currentRaw, location: { protocol: 'http:', hostname: 'localhost', search: '' } });
addedQueryRun.context.location.search = '?qa=1';
check('bridge-query-added-after-boot-stays-absent', addedQueryRun.context.__EVERSTEAD_QA__ === undefined);

const cloneRun = runRealm({ activeRaw: currentRaw });
const cloneBefore = activeRaw(cloneRun);
check('bridge-snapshot-deep-clone', evaluate(cloneRun, `(()=>{const first=__EVERSTEAD_QA__.snapshot();first.state.buildings.training.level=999;first.state.oaths[0].title='mutated';const second=__EVERSTEAD_QA__.snapshot();return second.state.buildings.training.level!==999&&second.state.oaths[0].title!=='mutated'})()`));
check('bridge-snapshot-mutation-no-write', activeRaw(cloneRun) === cloneBefore);
const cloneDiagnostic = evaluate(cloneRun, '__EVERSTEAD_QA__.diagnostics()');
check('bridge-diagnostic-call', cloneDiagnostic.ok === true, cloneDiagnostic.error ?? '');
check('bridge-diagnostic-deep-clone', cloneDiagnostic.ok === true && evaluate(cloneRun, `(()=>{const first=__EVERSTEAD_QA__.diagnostics();first.diagnostics.buildingRateComponents.training.rate=0;const second=__EVERSTEAD_QA__.diagnostics();return second.diagnostics.buildingRateComponents.training.rate>0})()`));
const cloneAction = evaluate(cloneRun, `__EVERSTEAD_QA__.act('navigate',{view:'more'})`);
check('bridge-action-call', cloneAction.ok === true, cloneAction.error ?? '');
check('bridge-action-result-deep-clone', cloneAction.ok === true && evaluate(cloneRun, `(()=>{const result=__EVERSTEAD_QA__.act('navigate',{view:'more'});result.state.buildings.training.level=999;return __EVERSTEAD_QA__.snapshot().state.buildings.training.level!==999})()`));

const maliciousExpressions = [
  `__EVERSTEAD_QA__.act('navigate',{view:'more',extra:()=>true})`,
  `__EVERSTEAD_QA__.act('navigate',{view:'more',extra:undefined})`,
  `__EVERSTEAD_QA__.act('navigate',{view:'more',toJSON(){return{view:'more'}}})`,
  `__EVERSTEAD_QA__.act('navigate',Object.create({view:'more'}))`,
  `__EVERSTEAD_QA__.act('navigate',JSON.parse('{"view":"more","__proto__":{}}'))`,
  `__EVERSTEAD_QA__.act('navigate',JSON.parse('{"view":"more","constructor":{}}'))`,
  `__EVERSTEAD_QA__.act('navigate',JSON.parse('{"view":"more","prototype":{}}'))`,
  `__EVERSTEAD_QA__.act('Navigate',{view:'more'})`,
  `__EVERSTEAD_QA__.act('__proto__',{view:'more'})`,
  `(()=>{const value={};Object.defineProperty(value,'view',{enumerable:true,get(){throw new Error('getter executed')}});return __EVERSTEAD_QA__.act('navigate',value)})()`,
  `(()=>{const value={view:'more'};value[Symbol('extra')]=1;return __EVERSTEAD_QA__.act('navigate',value)})()`,
  `__EVERSTEAD_QA__.act('navigate',{view:Symbol('more')})`,
  `(()=>{const value={view:'more'};Object.defineProperty(value,'hidden',{enumerable:false,value:true});return __EVERSTEAD_QA__.act('navigate',value)})()`,
  `__EVERSTEAD_QA__.act('navigate',[])`,
  `__EVERSTEAD_QA__.act('navigate',new Date())`,
  `(()=>{const value=[0.1,,0.2];return __EVERSTEAD_QA__.random.setSequence(value)})()`,
  `(()=>{const value=[0.1];value.extra=0.2;return __EVERSTEAD_QA__.random.setSequence(value)})()`
];
const maliciousRun = runRealm({ activeRaw: currentRaw });
const maliciousBefore = activeRaw(maliciousRun);
for (let index = 0; index < maliciousExpressions.length; index += 1) check(`bridge-malformed-${index + 1}`, evaluate(maliciousRun, maliciousExpressions[index]).ok === false);
check('bridge-malformed-inputs-no-write', activeRaw(maliciousRun) === maliciousBefore);

const diagnosticRun = runRealm({ activeRaw: currentRaw, backupRaw: legacyRaw });
evaluate(diagnosticRun, '__EVERSTEAD_QA__.random.setSequence([0.2,0.4])');
const diagnosticState = evaluate(diagnosticRun, '__EVERSTEAD_QA__.snapshot().state');
const diagnosticRawBefore = activeRaw(diagnosticRun), overlayBefore = diagnosticRun.nodes['#overlay'].innerHTML;
const offlineTable = [
  ['0ms', 0, 0, false],
  ['1ms', 1, 1, false],
  ['60000ms', 60_000, 60_000, false],
  ['60001ms', 60_001, 60_001, true],
  ['2h', 7_200_000, 7_200_000, true],
  ['24h-minus-1ms', 86_399_999, 86_399_999, true],
  ['24h', 86_400_000, 86_400_000, true],
  ['24h-plus-1ms', 86_400_001, 86_400_000, true],
  ['rollback', -1, 0, false]
];
const offlineResults = new Map();
for (const [id, offset, expectedElapsed, expectedSummary] of offlineTable) {
  const result = evaluate(diagnosticRun, `__EVERSTEAD_QA__.diagnostics({at:${diagnosticState.lastGoldAt + offset}})`);
  offlineResults.set(id, result);
  check(`offline-preview-${id}`, result.ok === true && result.diagnostics.offlineClaimPreview.elapsed === expectedElapsed && result.diagnostics.offlineClaimPreview.opensSummary === expectedSummary, result.error ?? '');
}
const exact60 = offlineResults.get('60000ms');
check('diagnostics-schema-source', exact60.diagnostics?.schema.current === 1 && exact60.diagnostics?.source.activeKey === keys.active);
check('diagnostics-backup-status-mismatched', exact60.diagnostics?.rawBackup.present === true && exact60.diagnostics?.rawBackup.key === keys.backup && exact60.diagnostics?.rawBackup.matchesActive === false);
check('diagnostics-migration-receipts', Array.isArray(exact60.diagnostics?.migrationReceipts));
check('diagnostics-rate-components', exact60.diagnostics && Object.keys(exact60.diagnostics.buildingRateComponents).length === 4 && Object.values(exact60.diagnostics.buildingRateComponents).every(value => Math.abs(value.rate - value.base * value.levelMultiplier * value.operatorMultiplier * value.oathMultiplier) < 1e-7));
check('diagnostics-no-write', activeRaw(diagnosticRun) === diagnosticRawBefore);
check('diagnostics-no-ui', diagnosticRun.nodes['#overlay'].innerHTML === overlayBefore);
check('diagnostics-no-rng', evaluate(diagnosticRun, '__EVERSTEAD_QA__.random.remaining().remaining') === 2);

for (const [id, mode] of [['absent', 'absent'], ['exact-matching', 'matching'], ['read-error', 'read-error']]) {
  const run = runRealm({ activeRaw: currentRaw });
  if (mode === 'absent') run.slots.delete(keys.backup);
  if (mode === 'matching') run.slots.set(keys.backup, activeRaw(run));
  if (mode === 'read-error') Object.assign(run.fault, { enabled: true, operation: 'getItem', key: keys.backup });
  const before = activeRaw(run), logIndex = run.storageLog.length;
  const result = evaluate(run, '__EVERSTEAD_QA__.diagnostics()');
  const backup = result.diagnostics?.rawBackup;
  check(`diagnostics-backup-status-${id}`, result.ok === true && (mode === 'absent' ? backup.present === false && backup.readError === null : mode === 'matching' ? backup.present === true && backup.matchesActive === true && backup.readError === null : backup.present === false && /injected storage read failure/.test(backup.readError)), result.error ?? '');
  check(`diagnostics-backup-status-${id}-no-write`, activeRaw(run) === before && run.storageLog.slice(logIndex).every(entry => entry[0] === 'get'));
}

for (const [id, setup] of [['zero-timestamp', 'S.lastGoldAt=0'], ['missing-timestamp', 'delete S.lastGoldAt']]) {
  const run = runRealm({ activeRaw: currentRaw, hook: `${setup};window.__TIMESTAMP_SETUP__=true` });
  const before = activeRaw(run), result = evaluate(run, `__EVERSTEAD_QA__.diagnostics({at:${Date.parse(scenarios.frozenNow)}})`);
  check(`offline-preview-${id}`, result.ok === true && result.diagnostics.offlineClaimPreview.elapsed === 0 && result.diagnostics.offlineClaimPreview.total === 0 && result.diagnostics.offlineClaimPreview.opensSummary === false, result.error ?? '');
  check(`offline-preview-${id}-no-write`, activeRaw(run) === before);
}

const crossMidnightAt = Date.parse('2030-06-18T07:30:00.000Z');
const crossMidnightSetup = runRealm({ activeRaw: currentRaw, hook: `QA_CLOCK_NOW=${crossMidnightAt};S.lastGoldAt=${crossMidnightAt - 3_600_000};S.day='D2030-6-17';S.patrolBank=1;S.oaths.find(o=>o.type==='habit').count=9;Object.values(S.buildings).forEach(building=>{building.boost=.2;building.boostDay='D2030-6-17'});applyRollover();window.__CROSS_MIDNIGHT_STATE__={day:S.day,patrolBank:S.patrolBank,habitCount:S.oaths.find(o=>o.type==='habit').count,boosts:Object.values(S.buildings).map(building=>building.boost)}` });
const crossMidnightBefore = activeRaw(crossMidnightSetup), crossMidnightResult = evaluate(crossMidnightSetup, `__EVERSTEAD_QA__.diagnostics({at:${crossMidnightAt}})`);
check('offline-preview-cross-midnight-legacy-unsegmented', crossMidnightResult.ok === true && crossMidnightResult.diagnostics.offlineClaimPreview.elapsed === 3_600_000 && Math.abs(crossMidnightResult.diagnostics.offlineClaimPreview.total - 69_201.45374636249) < 1e-7);
check('offline-preview-cross-midnight-rollover-state', crossMidnightSetup.context.__CROSS_MIDNIGHT_STATE__?.day === 'D2030-6-18' && crossMidnightSetup.context.__CROSS_MIDNIGHT_STATE__?.patrolBank === 2 && crossMidnightSetup.context.__CROSS_MIDNIGHT_STATE__?.habitCount === 0 && crossMidnightSetup.context.__CROSS_MIDNIGHT_STATE__?.boosts.every(value => value === 0));
check('offline-preview-cross-midnight-no-write', activeRaw(crossMidnightSetup) === crossMidnightBefore);

for (const [id, raw] of [['future', futureRaw], ['corrupt', corruptRaw], ['invalid', invalidRaw]]) {
  const run = runRealm({ activeRaw: raw });
  const before = activeRaw(run), exported = evaluate(run, '__EVERSTEAD_QA__.recovery.export()');
  check(`export-${id}-exact`, exported.ok === true && exported.data.activeRaw === raw);
  check(`export-${id}-no-write`, activeRaw(run) === before);
}
const failedReloadRun = runRealm({ activeRaw: corruptRaw });
const failedReloadBefore = activeRaw(failedReloadRun), failedReloadResult = evaluate(failedReloadRun, '__EVERSTEAD_QA__.recovery.reload()');
check('bridge-recovery-reload-failure-reported', failedReloadResult.ok === false && /preserved/i.test(failedReloadResult.error));
check('bridge-recovery-reload-failure-no-write', activeRaw(failedReloadRun) === failedReloadBefore);

const stagedState = JSON.parse(currentRaw);
const stagedRaw = JSON.stringify({ stagingVersion: 1, transactionId: 'tx-gate-0c-recovery', baseSaveId: null, baseRevision: null, sourceRawIdentity: rawIdentity(corruptRaw), source: 'gate-0c-recovery', state: stagedState });
const recoveryRun = runRealm({ activeRaw: corruptRaw, backupRaw: corruptRaw, stagingRaw: stagedRaw });
const recoveryResult = evaluate(recoveryRun, '__EVERSTEAD_QA__.recovery.recover()');
check('bridge-safe-recovery-current', recoveryResult.ok === true && Boolean(currentState(activeRaw(recoveryRun))));
check('bridge-safe-recovery-backup-exact', recoveryRun.slots.get(keys.backup) === corruptRaw);

const destructiveRun = runRealm({ activeRaw: currentRaw, qaConfig: { allowDestructive: true, isolatedStorage: true } });
const installResult = evaluate(destructiveRun, `__EVERSTEAD_QA__.controls.installFixture({activeRaw:${JSON.stringify(legacyRaw)},backupRaw:null,stagingRaw:null})`);
check('bridge-destructive-install-local-isolated', installResult.ok === true && Boolean(currentState(activeRaw(destructiveRun))));
const beforeGrant = currentState(activeRaw(destructiveRun)).gold;
const grantResult = evaluate(destructiveRun, `__EVERSTEAD_QA__.controls.grant({resource:'gold',amount:1234})`);
check('bridge-destructive-grant-local-isolated', grantResult.ok === true && currentState(activeRaw(destructiveRun)).gold === beforeGrant + 1234);

const authorizedActionRun = runRealm({ activeRaw: currentRaw, qaConfig: { allowDestructive: true, isolatedStorage: true } });
const authorizedActionBefore = currentState(activeRaw(authorizedActionRun));
const authorizedSimulate = evaluate(authorizedActionRun, `__EVERSTEAD_QA__.act('simulate')`), authorizedAddPatrol = evaluate(authorizedActionRun, `__EVERSTEAD_QA__.act('add-patrol')`), authorizedActionAfter = currentState(activeRaw(authorizedActionRun));
check('bridge-destructive-actions-distinct-memory-succeed', authorizedSimulate.ok === true && authorizedAddPatrol.ok === true && authorizedActionAfter.saveMeta.revision === authorizedActionBefore.saveMeta.revision + 2);

const noDestructiveRun = runRealm({ activeRaw: currentRaw, qaConfig: { allowDestructive: false, isolatedStorage: true } });
const noDestructiveBefore = activeRaw(noDestructiveRun), noDestructiveRevision = currentState(noDestructiveBefore).saveMeta.revision, noDestructiveLog = noDestructiveRun.storageLog.length, noDestructiveToast = noDestructiveRun.nodes['#toast'].innerHTML, noDestructiveOverlay = noDestructiveRun.nodes['#overlay'].innerHTML;
const rejectedGrant = evaluate(noDestructiveRun, `__EVERSTEAD_QA__.controls.grant({resource:'gold',amount:1})`), rejectedInstall = evaluate(noDestructiveRun, `__EVERSTEAD_QA__.controls.installFixture({activeRaw:${JSON.stringify(legacyRaw)},backupRaw:null,stagingRaw:null})`), rejectedSimulate = evaluate(noDestructiveRun, `__EVERSTEAD_QA__.act('simulate')`), rejectedAddPatrol = evaluate(noDestructiveRun, `__EVERSTEAD_QA__.act('add-patrol')`);
check('bridge-destructive-controls-reject-without-authorization', rejectedGrant.ok === false && rejectedInstall.ok === false);
check('bridge-destructive-actions-reject-without-authorization', rejectedSimulate.ok === false && rejectedAddPatrol.ok === false);
check('bridge-destructive-rejection-no-write-revision-ui', activeRaw(noDestructiveRun) === noDestructiveBefore && currentState(activeRaw(noDestructiveRun)).saveMeta.revision === noDestructiveRevision && noDestructiveRun.storageLog.length === noDestructiveLog && noDestructiveRun.nodes['#toast'].innerHTML === noDestructiveToast && noDestructiveRun.nodes['#overlay'].innerHTML === noDestructiveOverlay);

for (const [id, qaConfig] of [['missing-isolated-storage', { allowDestructive: true }], ['false-isolated-storage', { allowDestructive: true, isolatedStorage: false }]]) {
  const run = runRealm({ activeRaw: currentRaw, qaConfig }), before = activeRaw(run), revision = currentState(before).saveMeta.revision;
  const grant = evaluate(run, `__EVERSTEAD_QA__.controls.grant({resource:'gold',amount:1})`), simulateResult = evaluate(run, `__EVERSTEAD_QA__.act('simulate')`), addPatrolResult = evaluate(run, `__EVERSTEAD_QA__.act('add-patrol')`);
  check(`bridge-destructive-${id}-rejected`, grant.ok === false && simulateResult.ok === false && addPatrolResult.ok === false);
  check(`bridge-destructive-${id}-no-write`, activeRaw(run) === before && currentState(activeRaw(run)).saveMeta.revision === revision);
}

const nativeStorageRun = runRealm({ activeRaw: currentRaw, runtimeUsesNativeStorage: true, qaConfig: { allowDestructive: true, isolatedStorage: true } });
const nativeStorageBefore = activeRaw(nativeStorageRun), nativeStorageRevision = currentState(nativeStorageBefore).saveMeta.revision;
const nativeGrant = evaluate(nativeStorageRun, `__EVERSTEAD_QA__.controls.grant({resource:'gold',amount:1})`), nativeInstall = evaluate(nativeStorageRun, `__EVERSTEAD_QA__.controls.installFixture({activeRaw:${JSON.stringify(legacyRaw)},backupRaw:null,stagingRaw:null})`), nativeSimulate = evaluate(nativeStorageRun, `__EVERSTEAD_QA__.act('simulate')`), nativeAddPatrol = evaluate(nativeStorageRun, `__EVERSTEAD_QA__.act('add-patrol')`);
check('bridge-destructive-exact-native-storage-rejected', nativeGrant.ok === false && nativeInstall.ok === false && nativeSimulate.ok === false && nativeAddPatrol.ok === false);
check('bridge-destructive-exact-native-storage-no-write', activeRaw(nativeStorageRun) === nativeStorageBefore && currentState(activeRaw(nativeStorageRun)).saveMeta.revision === nativeStorageRevision);

const failed = checks.filter(item => !item.pass);
for (const item of checks) console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.id}${item.detail ? ` — ${item.detail}` : ''}`);
console.log(`\n${checks.length - failed.length}/${checks.length} Gate 0C checks passed.`);
if (failed.length) process.exitCode = 1;
