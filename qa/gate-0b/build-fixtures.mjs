import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const fixtures = resolve(root, 'fixtures');
const currentRaw = readFileSync(resolve(fixtures, 'current-v1.txt'), 'utf8').trimEnd();
const current = JSON.parse(currentRaw);

function rawIdentity(raw) {
  if (raw == null) return 'null:0:00000000';
  let hash = 2166136261;
  for (let index = 0; index < raw.length; index += 1) {
    hash ^= raw.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${raw.length}:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function staging(state, overrides = {}) {
  return {
    stagingVersion: 1,
    transactionId: overrides.transactionId ?? 'tx-staged-successor',
    baseSaveId: overrides.baseSaveId ?? current.saveMeta.saveId,
    baseRevision: overrides.baseRevision ?? current.saveMeta.revision,
    sourceRawIdentity: overrides.sourceRawIdentity ?? rawIdentity(currentRaw),
    source: overrides.source ?? 'fixture-staged-successor',
    state
  };
}

function write(name, value) {
  const raw = typeof value === 'string' ? value : JSON.stringify(value);
  writeFileSync(resolve(fixtures, name), raw, 'utf8');
}

const successor = structuredClone(current);
successor.gold += 777;
successor.saveMeta.revision += 1;
successor.saveMeta.source = 'fixture-staged-successor';

const stale = structuredClone(current);
stale.gold += 333;

const conflict = structuredClone(successor);
conflict.saveMeta.saveId = 'save-conflicting-999';

const invalidState = structuredClone(successor);
invalidState.buildings.training.operators = 'invalid';

const future = structuredClone(current);
future.schemaVersion = 99;

const invalidCurrent = structuredClone(current);
invalidCurrent.buildings.training.operators = 'invalid';

write('current-v1.txt', currentRaw);
write('future-v99.txt', future);
write('invalid-current-v1.txt', invalidCurrent);
write('invalid-root.txt', '[]');
write('corrupt-json.txt', '{"schemaVersion":1,"broken":');
write('staging-successor-v1.txt', staging(successor));
write('staging-stale-v1.txt', staging(stale));
write('staging-conflicting-save-v1.txt', staging(conflict, { baseSaveId: conflict.saveMeta.saveId }));
write('staging-invalid-state-v1.txt', staging(invalidState));
