import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(resolve(repoRoot, 'qa', 'baseline-manifest.json'), 'utf8'));
const scenarios = JSON.parse(readFileSync(resolve(repoRoot, manifest.scenarioData.path), 'utf8'));
const runnerText = readFileSync(resolve(repoRoot, 'qa', 'runner.js'), 'utf8');
const checks = [];

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function check(id, pass, classification = 'required', detail = '') {
  checks.push({ id, pass: Boolean(pass), classification, detail });
}

function git(...args) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
}

const indexBytes = readFileSync(resolve(repoRoot, manifest.artifact.path));
const indexText = indexBytes.toString('utf8');
const indexScript = indexText.match(/<script>([\s\S]*?)<\/script>/)?.[1];

check('manifest-gate', manifest.manifestVersion === 2 && manifest.phaseGate === '0A');
check('repository-commit', git('cat-file', '-t', manifest.repositoryCommit) === 'commit', 'required', manifest.repositoryCommit);
check('index-baseline-commit', git('cat-file', '-t', manifest.indexBaselineCommit) === 'commit', 'required', manifest.indexBaselineCommit);
check('index-git-blob', git('hash-object', manifest.artifact.path) === manifest.artifact.gitBlobId, 'required', manifest.artifact.gitBlobId);
check('index-sha256', sha256(indexBytes) === manifest.artifact.sha256, 'required', sha256(indexBytes));
check('index-byte-length', indexBytes.length === manifest.artifact.byteLength, 'required', String(indexBytes.length));
check('index-title', indexText.includes(`<title>${manifest.artifact.documentTitle}</title>`));
check('index-visible-version', indexText.includes(manifest.artifact.visibleVersion));
check('index-state-version', indexText.includes(`VERSION='${manifest.artifact.stateVersion}'`));
check('index-storage-key', indexText.includes(`NS='${manifest.artifact.activeStorageKey}'`));
check('index-baseline-content', git('show', `${manifest.indexBaselineCommit}:${manifest.artifact.path}`) === indexText.trimEnd());

try {
  new vm.Script(indexScript);
  check('index-script-syntax', true);
} catch (error) {
  check('index-script-syntax', false, 'required', error.message);
}

try {
  new vm.Script(runnerText);
  check('runner-script-syntax', true);
} catch (error) {
  check('runner-script-syntax', false, 'required', error.message);
}

const fixtureAbortIndex = runnerText.indexOf('Fixture integrity failure; refusing to execute any scenario');
const scenarioLoopIndex = runnerText.indexOf('for (const scenario of contract.scenarioData.scenarios)');
check(
  'runner-fixture-integrity-aborts-scenarios',
  fixtureAbortIndex > 0 && scenarioLoopIndex > fixtureAbortIndex &&
    runnerText.includes('const fixtureFailures = fixtureResults.filter(item => !item.pass)') &&
    runnerText.includes('if (fixtureFailures.length > 0)') && runnerText.includes('throw new Error(`Fixture integrity failure'),
  'required',
  `abortIndex=${fixtureAbortIndex}, scenarioLoopIndex=${scenarioLoopIndex}`
);
check(
  'runner-complete-state-comparison',
  runnerText.includes('stateDifferences(actual, wanted)') &&
    runnerText.includes('representative-complete-initial-state') &&
    runnerText.includes('representative-complete-reboot-state')
);
check(
  'runner-offline-special-claim',
  runnerText.includes('offline-special-claim') && runnerText.includes('[data-modal-act="collect-offline"]') &&
    runnerText.includes('offline-immediate-second-claim')
);
check(
  'runner-literal-html-insertion',
  runnerText.includes("contract.source.replace('<head>', () => `<head>${preludeScript}`)") &&
    runnerText.includes("sourceWithPrelude.replace('</body>', () => `${agentScript}</body>`)")
);

for (const fixture of manifest.fixtures) {
  const bytes = readFileSync(resolve(repoRoot, fixture.path));
  const raw = bytes.toString('utf8');
  check(`fixture-${fixture.id}-sha256`, sha256(bytes) === fixture.sha256, 'required', sha256(bytes));
  check(`fixture-${fixture.id}-byte-length`, bytes.length === fixture.byteLength, 'required', String(bytes.length));
  check(`fixture-${fixture.id}-code-unit-length`, raw.length === fixture.codeUnitLength, 'required', String(raw.length));
  check(`fixture-${fixture.id}-trailing-newline`, raw.endsWith('\n') === fixture.trailingNewline, 'required', String(raw.endsWith('\n')));
  check(`fixture-${fixture.id}-clock`, Boolean(Date.parse(fixture.frozenNow)) && fixture.timezone === 'America/Phoenix' && fixture.timezoneOffsetMinutes === 420);
  check(`fixture-${fixture.id}-rng`, JSON.stringify(fixture.randomSequence) === JSON.stringify([0.05, 0.25, 0.5, 0.75, 0.95]));
  check(`fixture-${fixture.id}-classification`, ['required', 'legacy-defect'].includes(fixture.contractClassification));
  check(`fixture-${fixture.id}-expected-outcome`, typeof fixture.expectedOutcome === 'string' && fixture.expectedOutcome.length > 20);
  if (fixture.id === 'corrupt-v0.1') {
    let corrupt = false;
    try { JSON.parse(raw); } catch { corrupt = true; }
    check('fixture-corrupt-is-invalid-json', corrupt, 'legacy-defect');
  } else {
    try {
      JSON.parse(raw);
      check(`fixture-${fixture.id}-json`, true);
    } catch (error) {
      check(`fixture-${fixture.id}-json`, false, 'required', error.message);
    }
  }
}

const representativeFixture = manifest.fixtures.find(fixture => fixture.id === 'representative-v0.1');
const representativeRaw = readFileSync(resolve(repoRoot, representativeFixture.path), 'utf8');
const representative = JSON.parse(representativeRaw);
const undoSnapshot = JSON.parse(representative.undo.snapshot);
const representativeOath = representative.oaths.find(item => item.id === representative.undo.id);
const snapshotOath = undoSnapshot.oaths.find(item => item.id === representative.undo.id);
const syntheticOath = representative.oaths.find(item => item.id === 'fixture-custom');
check(
  'representative-utf8-vs-code-units',
  representativeFixture.byteLength > representativeFixture.codeUnitLength && /[^\u0000-\u007f]/.test(representativeRaw),
  'required',
  `bytes=${representativeFixture.byteLength}, codeUnits=${representativeFixture.codeUnitLength}`
);
check(
  'representative-valid-persisted-undo',
  representative.undo.id === 'o7' && typeof representative.undo.snapshot === 'string' && !Object.hasOwn(undoSnapshot, 'undo') &&
    representativeOath.doneKey === 'D2030-6-17' && snapshotOath.doneKey === null &&
    representativeOath.streak === snapshotOath.streak + 1 && representative.prosperity > undoSnapshot.prosperity
);
check(
  'representative-synthetic-non-ascii',
  syntheticOath.title === 'Fixture café review 🌵' && syntheticOath.notes === 'Résumé naïve — synthetic 測試 only.' &&
    syntheticOath.memo === 'Privé QA memo 🔒'
);

const scenarioBytes = readFileSync(resolve(repoRoot, manifest.scenarioData.path));
check('scenario-sha256', sha256(scenarioBytes) === manifest.scenarioData.sha256, 'required', sha256(scenarioBytes));
check('scenario-byte-length', scenarioBytes.length === manifest.scenarioData.byteLength, 'required', String(scenarioBytes.length));
check('scenario-version', scenarios.scenarioVersion === 2);
check(
  'scenario-storage-keys',
  scenarios.storageKeys.active === 'oathforge_new_world_proto_v01' &&
    scenarios.storageKeys.backup === 'oathforge_new_world_proto_v01__raw_backup_v0_1' &&
    scenarios.storageKeys.staging === 'oathforge_new_world_proto_v01__staging'
);

const fixtureIds = new Set(manifest.fixtures.map(fixture => fixture.id));
for (const scenario of scenarios.scenarios) {
  check(
    `scenario-${scenario.id}-raw-slots`,
    ['activeRawFixtureId', 'backupRawFixtureId', 'stagingRawFixtureId'].every(field => Object.hasOwn(scenario.storage, field)) &&
      Object.values(scenario.storage).every(value => value == null || fixtureIds.has(value))
  );
  check(`scenario-${scenario.id}-classification`, ['required', 'legacy-defect'].includes(scenario.contractClassification));
  check(`scenario-${scenario.id}-fixed-environment`, Boolean(Date.parse(scenario.frozenNow)) && scenario.timezoneOffsetMinutes === 420 && scenario.randomSequence.length === 5);
  check(`scenario-${scenario.id}-fixed-expected`, scenario.expected && Object.keys(scenario.expected).length > 0);
}

for (const id of ['representative', 'sparse', 'corrupt', 'wrong-type', 'clock-rollback', 'cross-midnight', 'offline-24-hour-cap', 'last-gold-at-zero', 'fractional-pending-gold', 'offline-boundaries', 'offline-claim']) {
  check(`mandatory-scenario-${id}`, scenarios.scenarios.some(scenario => scenario.id === id));
}

const requiredPersistedKeys = [
  'version', 'gold', 'prosperity', 'pendingGold', 'lastGoldAt', 'lastSeen', 'day', 'focusFellow', 'featured',
  'patrolBank', 'patrolIndex', 'storyStage', 'towerFloor', 'tradingRating', 'currentWall', 'resolve', 'autoMode',
  'ui', 'buildings', 'fellows', 'family', 'companions', 'oaths', 'tradeTeam', 'operation', 'undo'
];
const representativeScenario = scenarios.scenarios.find(scenario => scenario.id === 'representative');
check(
  'representative-complete-state-key-contract',
  JSON.stringify([...representativeScenario.expected.completeState.requiredTopLevelKeys].sort()) === JSON.stringify([...requiredPersistedKeys].sort())
);
check(
  'representative-only-named-boot-mutations',
  JSON.stringify(representativeScenario.expected.completeState.initialBootMutations) === JSON.stringify({ lastSeen: 1907953200000 }) &&
    JSON.stringify(representativeScenario.expected.completeState.deterministicRebootMutations) === JSON.stringify({ lastSeen: 1907953200000, 'ui.view': 'more' })
);

const boundaryScenario = scenarios.scenarios.find(scenario => scenario.id === 'offline-boundaries');
const boundaryIds = boundaryScenario.expected.cases.map(item => item.id);
const requiredBoundaryIds = [
  'elapsed-0ms', 'elapsed-1ms', 'modal-threshold-60000ms', 'modal-threshold-60001ms', 'exact-2h',
  'immediate-second-claim', 'cap-minus-1ms', 'cap-exact-24h', 'cap-plus-1ms', 'missing-timestamp',
  'same-day-rollover', 'next-day-rollover'
];
check('offline-boundary-table-complete', JSON.stringify(boundaryIds) === JSON.stringify(requiredBoundaryIds));
check(
  'offline-boundary-fixed-expectations',
  boundaryScenario.expected.initialGold === 10000 &&
    boundaryScenario.expected.cases.find(item => item.id === 'elapsed-1ms').expectedPendingGold === 0.019222626040656245 &&
    boundaryScenario.expected.cases.find(item => item.id === 'modal-threshold-60000ms').expectModal === false &&
    boundaryScenario.expected.cases.find(item => item.id === 'modal-threshold-60001ms').expectModal === true &&
    boundaryScenario.expected.cases.find(item => item.id === 'cap-minus-1ms').expectedPendingGold === 1660834.8706900736 &&
    boundaryScenario.expected.cases.find(item => item.id === 'cap-exact-24h').expectedPendingGold === 1660834.8899126996 &&
    boundaryScenario.expected.cases.find(item => item.id === 'cap-plus-1ms').expectedPendingGold === 1660834.8899126996 &&
    boundaryScenario.expected.cases.find(item => item.id === 'immediate-second-claim').expectedAfterClaim.gold === 148402
);
const offlineClaimScenario = scenarios.scenarios.find(scenario => scenario.id === 'offline-claim');
check(
  'offline-claim-fixed-expectations',
  offlineClaimScenario.expected.pendingGoldBeforeClaim === 138402.90749272497 &&
    offlineClaimScenario.expected.claimedWholeGold === 138402 && offlineClaimScenario.expected.resultingGold === 148402 &&
    offlineClaimScenario.expected.resultingPendingGold === 0
);

const forbiddenGate0BFragments = ['current-schema', 'future-schema', 'precedence', 'idempotence', 'write-failure', 'transaction', 'recovery'];
check(
  'no-gate-0b-scenarios',
  scenarios.scenarios.every(scenario => forbiddenGate0BFragments.every(fragment => !scenario.id.includes(fragment)))
);

check('required-oath-multipliers-source', indexScript.includes("easy:{label:'Easy',boost:.03") && indexScript.includes("medium:{label:'Medium',boost:.05") && indexScript.includes("hard:{label:'Hard',boost:.08"));
check('required-oath-cap-source', indexScript.includes("b.boost=Math.min(.30"));
check('required-offline-cap-source', indexScript.includes('Math.min(86400000'));
check('required-building-upgrade-source', indexScript.includes('Math.round(15000*Math.pow(1.7,b.level-1))'));
check('required-roster-source', indexScript.includes("Fellows · 6") && indexScript.includes("Family · 3") && indexScript.includes("Companions · 2"));
check('required-navigation-source', indexScript.includes("['village','⌂','Village']") && indexScript.includes("['more','•••','More']"));

check(
  'legacy-cross-midnight-order',
  indexScript.includes('migrate();rollover();const report=accrue(true)'),
  'legacy-defect',
  'rollover runs before offline accrual'
);
check(
  'legacy-clock-rollback-moves-timestamp',
  indexScript.includes('Math.max(0,now-(S.lastGoldAt||now))') && indexScript.includes('S.lastGoldAt=now'),
  'legacy-defect'
);
check('legacy-zero-timestamp-fallback', indexScript.includes('(S.lastGoldAt||now)'), 'legacy-defect');
check(
  'legacy-fractional-pending-loss',
  indexScript.includes('const n=Math.floor(S.pendingGold||0)') && indexScript.includes('S.pendingGold=0'),
  'legacy-defect'
);
check(
  'legacy-whole-state-oath-undo',
  indexScript.includes('function snapshot(){const o=JSON.parse(JSON.stringify(S))') && indexScript.includes('S=JSON.parse(snap)'),
  'legacy-defect'
);

const failed = checks.filter(item => !item.pass);
for (const item of checks) {
  const status = item.pass ? (item.classification === 'legacy-defect' ? 'OBSERVED' : 'PASS') : 'FAIL';
  console.log(`${status.padEnd(8)} ${item.classification.padEnd(13)} ${item.id}${item.detail ? ` — ${item.detail}` : ''}`);
}
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed or were observed.`);
if (failed.length) process.exitCode = 1;
