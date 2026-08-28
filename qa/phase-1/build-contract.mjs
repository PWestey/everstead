import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const qaRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(qaRoot, '..', '..');
const baseCommit = 'e2dfc24f513499e176ab5c2be3894c8e324c31ac';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => readFileSync(resolve(repoRoot, path));
const git = args => execFileSync('git', args, { cwd: repoRoot, maxBuffer: 64 * 1024 * 1024 });
const frozenPaths = git(['ls-tree', '-r', '--name-only', baseCommit, 'docs', 'qa'])
  .toString('utf8').trim().split('\n').filter(Boolean).sort();
const frozenHistoricalFiles = {};

for (const path of frozenPaths) {
  const baseBytes = git(['show', baseCommit + ':' + path]);
  const currentBytes = read(path);
  if (!baseBytes.equals(currentBytes)) throw new Error('Frozen historical artifact changed: ' + path);
  frozenHistoricalFiles[path] = hash(baseBytes);
}

const artifactBytes = read('index.html');
const artifactText = artifactBytes.toString('utf8');
const baseArtifactBytes = git(['show', baseCommit + ':index.html']);
const baseArtifactText = baseArtifactBytes.toString('utf8');
const assetLines = text => text.split('\n').filter((_, index) => [11, 17, 23].includes(index)).join('\n');
const scenarioBytes = read('qa/phase-1/scenarios.json');
const manifest = {
  manifestVersion: 1,
  phase: '1',
  baseCommit,
  frozenHistoricalFiles,
  baseArtifact: {
    path: 'index.html',
    sha256: hash(baseArtifactBytes),
    byteLength: baseArtifactBytes.length,
    schemaVersion: 1,
    embeddedAssetLinesSha256: hash(assetLines(baseArtifactText))
  },
  artifact: {
    path: 'index.html',
    sha256: hash(artifactBytes),
    byteLength: artifactBytes.length,
    visibleVersion: 'v0.1',
    stateVersion: '0.1.0',
    schemaVersion: 2,
    activeStorageKey: 'oathforge_new_world_proto_v01',
    rawBackupV0Key: 'oathforge_new_world_proto_v01__raw_backup_v0_1',
    rawBackupV1Key: 'oathforge_new_world_proto_v01__raw_backup_v1',
    stagingKey: 'oathforge_new_world_proto_v01__staging',
    embeddedAssetLinesSha256: hash(assetLines(artifactText))
  },
  scenarios: {
    path: 'qa/phase-1/scenarios.json',
    sha256: hash(scenarioBytes),
    byteLength: scenarioBytes.length
  }
};

writeFileSync(resolve(qaRoot, 'current-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const currentPaths = [
  'index.html',
  'docs/PHASE_1_EXECUTION.md',
  'docs/PHASE_1_RESULT.md',
  'qa/phase-1/README.md',
  'qa/phase-1/build-contract.mjs',
  'qa/phase-1/current-manifest.json',
  'qa/phase-1/index.html',
  'qa/phase-1/realm.html',
  'qa/phase-1/realm.js',
  'qa/phase-1/regress-gate-0c.mjs',
  'qa/phase-1/runner.js',
  'qa/phase-1/scenarios.json',
  'qa/phase-1/verify.mjs'
];
const checksums = [...frozenPaths, ...currentPaths].sort().map(path => hash(read(path)) + '  ' + path).join('\n');
writeFileSync(resolve(qaRoot, 'checksums.sha256'), checksums + '\n');
console.log('Built Phase 1 contract: ' + Object.keys(frozenHistoricalFiles).length + ' frozen files, ' + currentPaths.length + ' current files.');
