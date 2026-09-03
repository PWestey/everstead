# Phase 24A balance-report result

**Verdict:** PASS  
**Contract:** `phase-24a-balance-baseline-v1`  
**Authority:** `everstead-scaling-live-baseline.phase-24a.v1`  
**Schema:** 13  
**Frozen clock:** `1800000000000`

This package is a real-Chromium, read-only observation of the frozen production
authority. It does not change balance, settle idle time, claim a reward, mutate
the adopted state, or write storage.

## Canonical profile outputs

| Profile | Fellow economy | Fellow combat | Companion actual | Migration floor | Effective threshold | Gold/hour | Stage-one cost |
|---|---:|---:|---:|---:|---:|---:|---:|
| True fresh schema 13 | 35,150 | 35,565 | 2,200 | 0 | 2,200 | 27,320.8092192 | 8,459 |
| Migrated established schema 13 | 35,150 | 36,645 | 2,272 | 2,892 | 2,892 | 27,328.94041242 | 8,336 |
| True high investment | 3,196,916 | 3,588,268 | 50,355 | 0 | 50,355 | 60,337,645.45902187 | 6,500 |

The noncanonical freshly migrated schema-12 comparison remains Fellow Combat
Power `36,366` and stage-one cost `8,368`. It is migration metadata, not true
fresh and not a fourth canonical profile.

The migrated-established profile was rebuilt from a schema-12 predecessor that
passes released validation and then passed through the production schema-12 to
13 migration. Its receipt exactly authenticates its profile:

- predecessor: `fnv1a32:15245:827978cf`;
- legacy history: `fnv1a32:1728:3e4d2025`;
- initialization: `fnv1a32:425:0851907f`;
- receipt/profile identity match: `true`.

All four high-profile Buildings are Level 52 and report
`upgradeCost: null`, `atLevelCap: true`, and `capStatus: level-cap`.

## Exact high-profile idle and claim state

- Village Gold: 24 hours credited, none discarded; exact pending Gold
  `923019963.6103376`, claimable integer Gold `923019963`.
- Companion Tower: 24 intervals; 24 hours credited, none discarded; 2,880 EXP
  per Companion, five total shards, nominal Mastery 120 and awarded Mastery 0
  because the profile starts at the current cap.
- Fellow Expedition: 24 intervals; 24 hours credited, none discarded; six total
  shards, nominal Might 600 and awarded Might 0 because the profile starts at
  the current cap.
- Restaurant: 12/12 opportunities banked; 6 hours credited and 18 hours
  discarded at capacity.
- Apothecary: 8/8 opportunities banked; 8 hours credited and 16 hours
  discarded at capacity.
- Schoolhouse: 8/8 opportunities banked; 12 hours credited and 12 hours
  discarded at capacity.
- Three released legacy reward offers remain ready and unclaimed. The combined
  report therefore has six ready manual claims and 28 banked facility
  opportunities.

The full exact blocks, including every reward map, readiness flag, interval,
cap, and source policy ID, are frozen by these SHA-256 identities:

- pending/offline canonical block:
  `dfa9384a3b5fcf529ee51524de07c728beca5c28ef00bca9f1e0f2e2dbe0c7b2`;
- claim-state canonical block:
  `42345a461cc9181cf42a7db9af0d86528246d017d77832b5572d01dfc7a22471`;
- public claims report block:
  `600eb325b1508e913d83370905cf278e6e2052b1c5767c33ac7578c664da5a0d`;
- public offline report block:
  `63c5475333d8677b70293fa03bf2607ef992f117236fff7c99b0e2ecb81e3792`.

## Frozen identities

Production sources:

- `index.html`: `6109805093ee78f075257526b4822cf86c9ca22dbd2a2a05ab3ef7b0bcb8c5f3`;
- `src/phase18-19-runtime.js`: `26686c97cc7c2a617224b8a287ab92933222e137c53bc309dedad6102d68df2e`;
- `src/phase23-companion-catalog.js`: `48da84995d57d78ab01899b4f1840763b2539b4c5605da68ccc309889d0c718f`;
- `src/phase23-companion-runtime.js`: `fd1455fef5cb5632fc53b055c935848e6b6f13f40175518520f0f4aa548dde40`;
- `src/phase24-scaling-authority.js`: `819fd4e308a98c699ac01a0c3df780eab11e777d933038b118850679d0f39d5c`.

Report authority:

- recipe: `70ffdf3bf5abc2460954096ca045f516108046962bc81713e4c1c49a20a334ae`;
- definitions: `13dde7df66252a1fc2943192a70fe2366f23aafc247b3aa16d92ae6ae6c1fd6a`;
- formula order: `9515c5cb70c4dcef6857fd698a12347d69368d9cc390e89fb0d5b312fc9ce421`;
- canonical report payload:
  `7c19b0a2ec7ab48ae0bea98a67ec06dbcfcdecf726ee3d633471360e1e87c0fe`;
- generated JSON:
  `e7ede3199b5addabee64c13710985f822f8538e1313a946b0ef85c992a0dd353`;
- generated Markdown:
  `b807dd04c1f3a48bd0fab3b962560ccd85717ab0b5e671db0f0e0ebf7c87fce5`.

Every active fixed table also has an individual SHA-256 in the generated report.
Collections remain `reserved-inactive`, contribute zero basis points, and use a
multiplier of 1.

## Verification evidence

- Recipe contract: PASS, exact three-profile order.
- Real Chromium generation: PASS.
- Deterministic `--check`: PASS twice, with identical JSON and Markdown hashes.
- Report neutrality: state unchanged, persisted raw unchanged, and zero report
  writes (`37` writes before report calls and `37` after).
- Native Web Storage access during the isolated capture: zero.
- Forbidden private-path tokens in captured artifacts: zero.
- Finite/safe-precision audit: PASS across 3,071 numeric values.
- Maximum gameplay integer: `923019963`; maximum gameplay number:
  `923019963.6103376`; remaining safe-integer headroom: `9007198331721028`.
- Maximum integer including timestamps: `1800000000000`; remaining headroom:
  `9005399254740991`.

