import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(resolve(repoRoot, 'qa', 'baseline-manifest.json'), 'utf8'));
const scenarios = JSON.parse(readFileSync(resolve(repoRoot, manifest.scenarioData.path), 'utf8'));
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

check('manifest-gate', manifest.manifestVersion === 1 && manifest.phaseGate === '0A');
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

const scenarioBytes = readFileSync(resolve(repoRoot, manifest.scenarioData.path));
check('scenario-sha256', sha256(scenarioBytes) === manifest.scenarioData.sha256, 'required', sha256(scenarioBytes));
check('scenario-byte-length', scenarioBytes.length === manifest.scenarioData.byteLength, 'required', String(scenarioBytes.length));
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

for (const id of ['representative', 'sparse', 'corrupt', 'wrong-type', 'clock-rollback', 'cross-midnight', 'offline-24-hour-cap', 'last-gold-at-zero', 'fractional-pending-gold']) {
  check(`mandatory-scenario-${id}`, scenarios.scenarios.some(scenario => scenario.id === id));
}

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
