import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const fixtures = resolve(root, 'fixtures');
const previousCurrentRaw = readFileSync(resolve(fixtures, 'current-v1.txt'), 'utf8').trimEnd();
const current = JSON.parse(previousCurrentRaw);

function undoFields(state, record) {
  const inverse = record.inverse;
  const oath = state.oaths.find(value => value.id === record.oathId);
  const building = state.buildings[inverse.building.id];
  const resolve = inverse.resolve ? {
    key: inverse.resolve.key,
    had: Object.hasOwn(state.resolve, inverse.resolve.key),
    value: Object.hasOwn(state.resolve, inverse.resolve.key) ? state.resolve[inverse.resolve.key] : null
  } : null;
  return {
    oath: {
      doneKey: oath.doneKey ?? null,
      streak: oath.streak,
      hadCount: Object.hasOwn(oath, 'count'),
      count: Object.hasOwn(oath, 'count') ? oath.count : 0
    },
    building: { id: inverse.building.id, boost: building.boost, boostDay: building.boostDay },
    fellowBonds: Object.fromEntries(Object.keys(inverse.fellowBonds).map(id => [id, state.fellows[id].bond])),
    prosperity: state.prosperity,
    family: inverse.family ? { id: inverse.family.id, progress: state.family[inverse.family.id].progress } : null,
    resolve
  };
}

if (current.undo?.version === 1) current.undo.expected = undoFields(current, current.undo);
const currentRaw = JSON.stringify(current);

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

function invalidReference(mutator) {
  const value = structuredClone(current);
  mutator(value);
  return value;
}

const invalidReferences = {
  'invalid-current-featured-ref.txt': invalidReference(value => { value.featured = 'missing-fellow'; }),
  'invalid-current-focus-ref.txt': invalidReference(value => { value.focusFellow = 'missing-fellow'; }),
  'invalid-current-operator-ref.txt': invalidReference(value => { value.buildings.training.operators[0] = 'missing-fellow'; }),
  'invalid-current-companion-ref.txt': invalidReference(value => { value.companions.bramble.bound = 'missing-fellow'; }),
  'invalid-current-trade-member-ref.txt': invalidReference(value => { value.tradeTeam[0] = 'missing-fellow'; }),
  'invalid-current-trade-shape.txt': invalidReference(value => { value.tradeTeam = value.tradeTeam.slice(0, 4); }),
  'invalid-current-operation-ref.txt': invalidReference(value => { value.operation = { ids: ['cael', 'missing-fellow'], startedAt: 1907950000000, endAt: 1907950600000 }; }),
  'invalid-current-undo-oath-ref.txt': invalidReference(value => { value.undo.oathId = 'missing-oath'; }),
  'invalid-current-undo-building-ref.txt': invalidReference(value => { value.undo.inverse.building.id = 'missing-building'; }),
  'invalid-current-undo-fellow-ref.txt': invalidReference(value => { value.undo.inverse.fellowBonds['missing-fellow'] = 10; }),
  'invalid-current-undo-family-ref.txt': invalidReference(value => { value.undo.inverse.family = { id: 'missing-family', progress: 10 }; }),
  'invalid-current-undo-done-key.txt': invalidReference(value => { value.undo.inverse.oath.doneKey = 42; }),
  'invalid-current-undo-resolve-value.txt': invalidReference(value => { value.undo.inverse.resolve = { key: 'story-6', had: true, value: 'invalid' }; }),
  'invalid-current-undo-expected-value.txt': invalidReference(value => { value.undo.expected.prosperity = 'invalid'; })
};

write('current-v1.txt', currentRaw);
write('future-v99.txt', future);
write('invalid-current-v1.txt', invalidCurrent);
write('invalid-root.txt', '[]');
write('corrupt-json.txt', '{"schemaVersion":1,"broken":');
write('staging-successor-v1.txt', staging(successor));
write('staging-stale-v1.txt', staging(stale));
write('staging-conflicting-save-v1.txt', staging(conflict, { baseSaveId: conflict.saveMeta.saveId }));
write('staging-invalid-state-v1.txt', staging(invalidState));
for (const [name, value] of Object.entries(invalidReferences)) write(name, value);
