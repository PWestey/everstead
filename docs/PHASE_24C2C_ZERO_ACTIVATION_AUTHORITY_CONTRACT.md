# Phase 24C-2C zero-only activation-authority contract

**Status:** inactive authority physically loaded for zero integration only  
**Collection/reward activation:** prohibited  
**Candidate successor schema:** 14

## Purpose

`src/phase24c-zero-activation-authority.js` is a plain-data authorization
boundary for the zero-only schema-14 integration. It pins the accepted
definitions and the explicitly reopened foundation v2, including the narrowly
authenticated forensic null-pair reset rule. The bounded integration may treat
those exact sources as physically production-loaded while every Collection,
formula, release, claim, and reward surface remains inactive. Definitions,
config, formulas, and source status remain unchanged; the foundation-v2 byte and
semantic change is explicit rather than hidden by a metadata-only claim.

One marked loader in `index.html` loads the authority, definitions, and
foundation in that exact least-authority order. Removing that loader and the
marked zero-integration blocks reproduces the accepted Phase 24C-2B index bytes.
The manifest global is non-enumerable, non-writable, non-configurable, and deeply
frozen. It contains no callback, capability token, mutator, claim/grant function,
storage operation, network operation, or DOM operation.

## Authorized surface

The only state constructors named by this candidate are:

- `createDirectSchema14` for canonical direct fresh and safe-reset origins;
- `migrateSchema13To14` for an authenticated real schema-13 predecessor.

The only validators named are `validateDefinitions`,
`validateReleaseAuthority`, and `validateSuccessorState`. Checkpoint capture,
attestation, current-schema projection, canonical serialization, and hashing are
listed separately as proof preparation only. Authority/release hashing and
bootstrap detection are forbidden to the adapter; constructors may use their
private internals without exposing them. Every exported foundation field is
partitioned exactly once across immutable metadata, constructors, validators,
proof preparation, or the forbidden surface. Every
Collection, Rank-release, Family-alignment, Legacy, facility, formula, and claim
API is explicitly fenced.

The manifest also pins the exact accepted Phase 24C-2B candidate index, its
mechanically projected predecessor index, contract, result, QA contract,
verifier, and checksum identities. Phase 24C-2B remains schema 13 and has no
schema-14 write authority; this statement does not deny the app's ordinary
production save-write authority.

## Exact lineage union

- Direct fresh: schema 14 at revision 1, source `fresh`, no migration receipt,
  no pre-v14 checkpoint, and zero historical reward applications.
- Safe reset: schema 14 at revision 1, source `safe-reset`, a new `saveId`, an
  authenticated retained-installation marker and Previous Save, no migration
  receipt, no pre-v14 checkpoint, and zero historical reward applications.
- Real migration: one schema-13→14 revision, one v2 activation receipt, one
  exact write-once pre-v14 checkpoint, and zero reward applications.

All validation must use named clone-isolated validators and a physical resolver.
The only forensic exception accepts a paired `null` save ID/revision for a
missing or malformed source when and only when a version-9 marker contains the
complete source binding and the named direct-origin validator approves it.
Forged semantic identities, incomplete bindings, mixed-null pairs, false or
throwing validators, and validator mutation all fail closed. Non-null reset
lineage rules are unchanged.
Construction must be validated again after serialization, after staging, and
after commit. The direct constructor's temporary in-memory origin closure is
not accepted as reload or persistence evidence.

## Protected checkpoint and save format

The proposed protected key is
`oathforge_new_world_proto_v01__raw_backup_v13`, represented as semantic slot
`preV14`. A checkpoint ID is derived as
`checkpoint.pre-v14.p{sha256(saveId)}.v1`, keeping imported save IDs out of the
stable ID grammar. Only a real schema-13 migration may populate this write-once
slot for its own lineage. Fresh and reset profiles create no predecessor
checkpoint.

The proposed recovery-bundle format advances from 2 to 3 and appends `preV14`
after `preV13`. Import, restore, and rollback replace or swap one complete
authenticated installation; they never merge Collection totals, receipts, or
save histories. A schema-12 import must execute and authenticate the real
12→13 step before the real 13→14 step.

## Zero-only invariant

The candidate authorizes only an empty durable root:

- no active release IDs or grant definitions;
- exactly zero Power, Earnings, EXP, and facility Collection basis points;
- no Collection receipts, claims, or checkpoint contributions;
- Rank capacity 30 but released through Rank 5 only;
- no Family alignment, Legacy/event/facility ladder, tutorial, or UI activation;
- no runtime read or application of Collection formulas.

The exact fresh zero-output anchors remain 35,565 Fellow Combat Power, 35,150
Fellow Economy Power, 2,200 Companion Power, 390/80 Fellow/Companion economy
basis points, and 27,320.8092192 Gold/hour. The authority also pins the genuine
migrated-established profile (36,645 Fellow Combat, 35,150 Fellow Economy,
2,272 actual / 2,892 effective Companion Power, 390/83 economy basis points,
and 27,328.94041242 Gold/hour) plus the historical fresh-schema-12 migration
comparison (36,366 Fellow Combat and an 801 protection delta). The verifier
recomputes these from the frozen Phase 24A runtime/report rather than trusting
the candidate's declarations.

## Future Collection policy, still inactive

The manifest records—not activates—the accepted future policy: named Power,
Earnings, EXP, and per-facility pools remain uncapped and additive; future
collections continue providing rewards; release budgets are not lifetime caps;
mandatory progression uses permanent content only; and tests must cover at
least +100,000 cumulative basis points. No pool compounds an already-boosted
total.

The exact adjacency is Power beside Might, Earnings beside Oath, EXP applied to
raw authored Fellow/Companion EXP, and each facility pool beside that facility's
authored active bonus. Passive Building Gold can receive Collection value only
through Earnings. Rank EXP, Intimacy, achievement/event progress, full-level
grants, and already-captured old claims are excluded. Any future application is
manual and exactly once, with migration/reload/replay-safe receipts. Limited
progress is preserved across reruns; if a particular limited reward will never
rerun, it must have an equivalent permanent alternative. All claim execution,
formula reads, and applications remain disabled in this zero-only candidate.

## Activation boundary

This contract authorizes only the exact bounded loader and zero-only integration
surface verified by Phase 24C-2C. It does not authorize a nonzero Collection
release, reward, formula change, Rank release, new UI, commit, merge, push,
deployment, or public release. Local integration is proven separately with
browser/mobile/multitab gates; real-device and Safari checks remain later
release/deployment prerequisites rather than blockers to local evidence.

The focused static verifier enforces exact topology with `Reflect.ownKeys`,
descriptor/prototype checks, rejection of accessors, symbols, non-enumerable
hidden fields, and a 26-case hostile mutation corpus. The manifest's own source
and semantic hashes are independently hardcoded in the verifier after freeze.
