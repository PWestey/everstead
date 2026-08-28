import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const qaRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(qaRoot, '..', '..');
const baseCommit = '81ec44c';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => readFileSync(resolve(repoRoot, path));
const git = args => execFileSync('git', args, { cwd: repoRoot, maxBuffer: 64 * 1024 * 1024 });
const historicalPaths = git(['ls-tree', '-r', '--name-only', baseCommit, 'docs', 'qa'])
  .toString('utf8').trim().split('\n').filter(Boolean).sort();
const historicalFiles = {};

for (const path of historicalPaths) {
  const baseBytes = git(['show', `${baseCommit}:${path}`]);
  const currentBytes = read(path);
  if (!baseBytes.equals(currentBytes)) throw new Error(`Frozen historical artifact changed: ${path}`);
  historicalFiles[path] = hash(baseBytes);
}

const artifactBytes = read('index.html');
const artifactText = artifactBytes.toString('utf8');
const baseArtifactText = git(['show', `${baseCommit}:index.html`]).toString('utf8');
const assetLines = text => text.split('\n').filter((_, index) => [11, 17, 23].includes(index)).join('\n');
const scenarioBytes = read('qa/gate-0c/scenarios.json');
const manifest = {
  manifestVersion: 1,
  phaseGate: '0C',
  baseCommit,
  historicalFiles,
  artifact: {
    path: 'index.html',
    sha256: hash(artifactBytes),
    byteLength: artifactBytes.length,
    visibleVersion: 'v0.1',
    stateVersion: '0.1.0',
    schemaVersion: 1,
    activeStorageKey: 'oathforge_new_world_proto_v01',
    rawBackupKey: 'oathforge_new_world_proto_v01__raw_backup_v0_1',
    stagingKey: 'oathforge_new_world_proto_v01__staging',
    embeddedAssetLinesSha256: hash(assetLines(artifactText)),
    baseEmbeddedAssetLinesSha256: hash(assetLines(baseArtifactText))
  },
  scenarios: {
    path: 'qa/gate-0c/scenarios.json',
    sha256: hash(scenarioBytes),
    byteLength: scenarioBytes.length
  }
};

writeFileSync(resolve(qaRoot, 'current-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
const currentPaths = [
  'index.html', 'docs/PHASE_0C_RESULT.md', 'qa/gate-0c/current-manifest.json',
  'qa/gate-0c/scenarios.json', 'qa/gate-0c/README.md', 'qa/gate-0c/index.html',
  'qa/gate-0c/realm.html', 'qa/gate-0c/realm.js', 'qa/gate-0c/runner.js',
  'qa/gate-0c/verify.mjs', 'qa/gate-0c/build-contract.mjs'
];
const checksumPaths = [...historicalPaths, ...currentPaths].sort();
const checksums = checksumPaths.map(path => `${hash(read(path))}  ${path}`).join('\n');
writeFileSync(resolve(qaRoot, 'checksums.sha256'), `${checksums}\n`);
