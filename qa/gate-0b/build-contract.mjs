import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const qaRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(qaRoot, '..', '..');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const fixtureFiles = [
  'qa/fixtures/representative-v0.1.txt',
  'qa/fixtures/sparse-v0.1.txt',
  'qa/fixtures/wrong-type-v0.1.txt',
  'qa/gate-0b/fixtures/current-v1.txt',
  'qa/gate-0b/fixtures/future-v99.txt',
  'qa/gate-0b/fixtures/invalid-current-v1.txt',
  'qa/gate-0b/fixtures/invalid-root.txt',
  'qa/gate-0b/fixtures/corrupt-json.txt',
  'qa/gate-0b/fixtures/staging-successor-v1.txt',
  'qa/gate-0b/fixtures/staging-stale-v1.txt',
  'qa/gate-0b/fixtures/staging-conflicting-save-v1.txt',
  'qa/gate-0b/fixtures/staging-invalid-state-v1.txt'
];
const historicalFiles = {
  'docs/PHASE_0A_RESULT.md': '4bc8d33dbdb7205f58b68e5e201ab778faad4d1957e2b77301264c8286992b51',
  'qa/README.md': 'b21e03255a43770c412f2b7ec891088ab136f728c7bc4233c9b68eb7677ac4c1',
  'qa/baseline-manifest.json': '605798e286729654f4c95c223f5f92b0f91e0e8bd5e88eef5413d11b653ee09f',
  'qa/checksums.sha256': '8df986b30f19477b0d3fc972dbff2e455c82dfd5dc0bcaeb8bc730bce37b3ad9',
  'qa/scenarios.json': '7ccfb47c63b9f9768387af95f35ae66f1dc612b74e43c7acf68cda1808c02a62',
  'qa/verify.mjs': '5802cddb9f94e9c4b658ab7aeb4af10c690848b63777dcde294ad5655c7e5af4',
  'qa/runner.js': 'fc0ce6ea13c055a52cdbc16df020a9541336115546ae298f2a36d47f7860abff',
  'qa/index.html': '2ec38e77ea58b064c7608d2a2a78014041d550eb80eeb6619a63a02062f094c0'
};

const artifactBytes = readFileSync(resolve(repoRoot, 'index.html'));
const scenarioBytes = readFileSync(resolve(qaRoot, 'scenarios.json'));
const fixtures = fixtureFiles.map(path => {
  const bytes = readFileSync(resolve(repoRoot, path));
  const raw = bytes.toString('utf8');
  return {
    id: path.split('/').at(-1).replace(/\.txt$/, ''), path, sha256: hash(bytes), byteLength: bytes.length,
    codeUnitLength: raw.length, trailingNewline: raw.endsWith('\n')
  };
});
const manifest = {
  manifestVersion: 1,
  phaseGate: '0B',
  baseCommit: 'a538585',
  historicalBaselineManifest: 'qa/baseline-manifest.json',
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
    stagingKey: 'oathforge_new_world_proto_v01__staging'
  },
  scenarios: { path: 'qa/gate-0b/scenarios.json', sha256: hash(scenarioBytes), byteLength: scenarioBytes.length },
  fixtures
};
const manifestPath = resolve(qaRoot, 'current-manifest.json');
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const checksumPaths = [
  'index.html', 'docs/PHASE_0B_RESULT.md', 'qa/gate-0b/current-manifest.json', 'qa/gate-0b/scenarios.json',
  ...fixtureFiles, 'qa/gate-0b/index.html', 'qa/gate-0b/README.md',
  'qa/gate-0b/build-contract.mjs', 'qa/gate-0b/build-fixtures.mjs',
  'qa/gate-0b/runner.js', 'qa/gate-0b/verify.mjs'
];
const checksumLines = checksumPaths.map(path => `${hash(readFileSync(resolve(repoRoot, path)))}  ${path}`);
writeFileSync(resolve(qaRoot, 'checksums.sha256'), `${checksumLines.join('\n')}\n`);
