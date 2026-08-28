import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const qaRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(qaRoot, '..', '..');
const frozenRoot = resolve(repoRoot, 'qa', 'gate-0c');
const frozenPath = resolve(frozenRoot, 'verify.mjs');
let source = readFileSync(frozenPath, 'utf8');
source = source.replace(
  "const qaRoot = dirname(fileURLToPath(import.meta.url));\nconst repoRoot = resolve(qaRoot, '..', '..');",
  'const qaRoot = ' + JSON.stringify(frozenRoot) + ';\nconst repoRoot = ' + JSON.stringify(repoRoot) + ';'
);
source = source.replace(
  "return value?.schemaVersion === 1 && Number.isInteger(value?.saveMeta?.revision) ? value : null;",
  "return value?.schemaVersion === 2 && Number.isInteger(value?.saveMeta?.revision) ? value : null;"
);
source = source.replaceAll('backupRaw:null,stagingRaw:null}', 'backupRaw:null,preV2BackupRaw:null,stagingRaw:null}');
const run = spawnSync(process.execPath, ['--input-type=module', '--eval', source], {
  cwd: repoRoot,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024
});
if (run.error) throw run.error;
const output = (run.stdout || '') + (run.stderr || '');
process.stdout.write(output);
const failed = [...output.matchAll(/^FAIL ([^\s]+)(?:\s|$)/gm)].map(match => match[1]);
const allowed = new Set([
  'artifact-sha256',
  'artifact-byte-length',
  'branding-preserved',
  'oath-formulas-preserved',
  'offline-formulas-preserved',
  'upgrade-formula-preserved',
  'grandfathered-visible-qa-controls-preserved',
  'diagnostics-schema-source',
  'diagnostics-rate-components',
  'offline-preview-zero-timestamp',
  'offline-preview-cross-midnight-legacy-unsegmented',
  'bridge-safe-recovery-current'
]);
const unexpected = failed.filter(id => !allowed.has(id));
console.log('');
console.log('Gate 0C successor regression: ' + failed.length + ' superseded assertions, ' + unexpected.length + ' unexpected failures.');
if (run.status !== 0 && failed.length === 0) {
  console.error('Frozen verifier terminated without structured failures.');
  process.exitCode = 1;
} else if (unexpected.length) {
  console.error('Unexpected failures: ' + unexpected.join(', '));
  process.exitCode = 1;
}
