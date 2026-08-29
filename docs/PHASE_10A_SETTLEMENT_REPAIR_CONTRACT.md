# EVERSTEAD — PHASE 10A IDLE-SETTLEMENT REPAIR CONTRACT

## Authority and immutable base

- Implement from exact clean published Phase 9 main commit `068a5a3ea2d9b3b339e96bf3fed0a0c945cf62a5` (accepted production commit `ee516296ddf823ba90b4a85ddc474456fada09f7`, production artifact SHA-256 `1e9d22150a5a0d2b2b4fbec403a5a50bf81c3b22153e688b659bda9b6bc67529`, 18,916,650 bytes).
- `EVERSTEAD — LOCKED CORE DESIGN v1.2`, Drive file `1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg`, exact verified revision `AIroW34MYqUcG6Q-iOW_AtHMqmrwGj9Nb9AFMEEqxselBNLMox14pJzqh11nWmvHfp6LI-QdrsXi6ruy1TNJJQXiXzh4BgLMN-zh7XtA8-I`, remains the product authority.
- `EVERSTEAD — IMPLEMENTATION ROADMAP v1.0`, Drive file `1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900`, exact verified revision `AIroW37XK-kLSvIWAi8bvi_c0B1TCCOIJCp93RQrxiAF8JmMMvgT0A9vnlZGdeAKQ_hSs674e9BNw9beXDa6RApDYcpXuZexshqiy4pvM_U`, defines the wider Phase 10 economy, Power, offline-claim, and balance work.
- Phase 10A is an urgent behavior-restoration slice only. It must ship and be independently verified before schema 11 or any Phase 10 balance activation.

## Confirmed defect

- Companion Tower owns persisted idle state from schema 7 onward. Its released schema-7 settlement leaf accepts only schema 7. The Phase-7 wrapper accepts only schema 8 and delegates every other schema to that schema-7-only leaf. Consequently, valid schema-9 and schema-10 saves do not advance Companion Tower idle time.
- Fellow Expedition owns persisted idle state from schema 8 onward. Its released settlement leaf accepts only schema 8. No later wrapper extends eligibility. Consequently, valid schema-9 and schema-10 saves do not advance Fellow Expedition idle time.
- The defect affects boot accrual, ordinary persisted mutations, previews, and claims because each route ultimately reaches the same version-gated settlement helpers.
- Existing schema-7 Tower behavior and schema-8 Tower/Expedition behavior are the accepted reference semantics.

## Objective

Restore Companion Tower and Fellow Expedition elapsed-time settlement for every released schema that owns the corresponding state root, without changing any other production behavior or persisted contract.

## Exact compatibility sets

- Companion Tower settlement is authoritative for schemas 7, 8, 9, and 10.
- Fellow Expedition settlement is authoritative for schemas 8, 9, and 10.
- Any other schema continues to return the existing neutral settlement result or follow the existing historical delegate exactly.
- Phase 10A must not temporarily rewrite `schemaVersion` to obtain compatibility.

## Scope boundary

### Keep exactly as-is

- `CURRENT_SCHEMA_VERSION = 10`, all twelve protected storage slots, schema-10 migration/receipt/checkpoint authority, export version, safe-reset marker, staging protocol, recovery precedence, and storage-event handling.
- Tower and Expedition state shapes, clocks, segment chronology, histories, cursors, interval ordinals, claim sequences, receipts, replay identities, RNG salts, pity counters, claimed totals, pending rewards, and history ceilings.
- One-hour interval size, 24-hour elapsed caps, floor/stage provenance, partial-interval carry, rollback-clock handling, and safe-integer arithmetic.
- Tower EXP, Mastery, Companion-shard rewards, Expedition Might and Fellow-shard rewards, reward targets, rates, forced-eighth pity, and production randomness.
- All Village/Family settlement, Campaigns, Buildings, Oaths, Power, Rank, Relics, assignments, economy values, UI, feature flags, QA bridge authorization, diagnostics, branding, and embedded asset bytes.

### Change

- Extend only the released settlement version eligibility so the exact accepted Tower algorithm executes for schemas 8–10 while schema 7 continues through its existing delegate, and the exact accepted Expedition algorithm executes for schemas 8–10.
- Add additive Phase 10A regression coverage and result/evidence files. Historical QA packages remain frozen.

### Explicitly prohibited

- No schema bump, migration, checkpoint, receipt, staging, export, reset, or save-shape change.
- No reward, rate, Power, balance, cost, cap, interval, pity, RNG, history, formula, selector, claim-flow, or presentation change.
- No common Claim All action, claims dashboard, economy hook activation, fresh-save rebalance, calculator extraction, telemetry expansion, or schema-11 groundwork.
- No namespace refactor, asset replacement, HTML/CSS redesign, unrelated cleanup, minification, or formatting churn.

## Required settlement semantics

- Normalize the captured time through the existing `towerTick` or `expeditionTick` helper.
- If normalized time is not later than the lane cursor, return `{elapsed:0,credited:0,discarded:0}` and do not lower the cursor.
- Otherwise advance the cursor once to the normalized captured time.
- If no Tower floor or Expedition stage has been cleared, credit zero, discard all elapsed time, and preserve all reward state.
- Credit at most the remaining space beneath the existing 24-hour cap; report excess as discarded.
- Attribute credited time to the highest cleared floor/stage at settlement time. Extend the last matching segment or append one new chronological segment through the existing safe-add path.
- Preserve the exact existing return shape `{elapsed,credited,discarded}`.
- One outer action captures one time and passes it through the existing `accrue` chain. Tower or Expedition settlement must not execute twice because of wrapper chaining.
- Preview remains clone-only. Claim remains one atomic persisted mutation. Immediate repeated preview or claim at the same captured time cannot create elapsed time, rewards, RNG consumption, pity movement, receipt changes, or persistence.
- Any action that changes a Tower floor, Expedition stage, Power input, assignment, or other progression state continues to settle elapsed time under the old state before applying the change.
- A persisted action may settle both idle lanes at the shared captured time. Claiming one lane may therefore advance the other lane's cursor and pending segment chronology, but it must not consume or alter the other lane's claimed history, rewards, pity, last receipt, or claim sequence.
- Tower and Expedition remain unable to create spendable Gold. Because their actions enter the shared `accrue` chain, an advancing captured time may independently increase Village pending Gold and Family pending drops. At a frozen captured time, Tower and Expedition actions do not change Gold or pending Gold, and no Tower/Expedition receipt or presentation attributes Village/Family accrual to either idle lane.

## Implementation constraint

- Prefer the smallest auditable production change: widen the two existing eligibility guards to the exact compatibility sets above.
- Do not duplicate either settlement algorithm, introduce a second clock, or add a new production configuration surface.
- The production diff must be separately inspectable from additive QA/docs changes.

## Acceptance matrix

### Static and source integrity

- Exact clean-base identity and expected production preimage are verified before patching.
- Production diff changes only the two settlement eligibility guards.
- Phase 9 production code outside those guards and all embedded asset bytes remain exact.
- Historical QA, fixtures, manifests, and checksums remain byte-identical.

### Version compatibility

- Tower schemas 7, 8, 9, and 10 accrue with the same accepted algorithm and exact return structure.
- Expedition schemas 8, 9, and 10 accrue with the same accepted algorithm and exact return structure.
- Unsupported schema versions preserve the exact prior neutral/delegate behavior.
- Schema-7 Tower and schema-8 Tower/Expedition outputs are byte-equivalent to the released Phase 9 base across the full focused vector set.

### Time boundaries

- Cover zero elapsed, rollback time, one millisecond before an interval, exact interval, one millisecond after, multiple intervals, exactly 24 hours, and more than 24 hours.
- Cover empty progress, partially occupied cap, exactly full cap, matching-last-segment extension, new-segment append, partial carry, and safe-add refusal.
- Split settlement, reload-separated settlement, and one combined settlement produce equivalent authoritative lane state when they represent the same chronology.

### Lifecycle paths

- Cover boot accrual, preview, Tower clear, Expedition push, ordinary unrelated persisted mutation, claim, reload, route change, and same-time repeated action.
- On current schema 10, Tower and Expedition previews advance from their saved cursors; claims transfer the resulting accepted rewards exactly once; reload preserves the committed state and receipt.
- Use fixtures with both lanes progressed and both cursors behind for schema 9 and schema 10, including canonical fresh, migrated, and safe-reset schema-10 authority forms. For boot, unrelated mutation, Tower claim, Expedition claim, Tower clear, and Expedition push, prove Village, Tower, and Expedition receive the same captured clock; each idle cursor advances once; no segment receives double elapsed; and clear/push elapsed is attributed to the old floor/stage.
- Prove preview preserves exact durable raw/revision, runtime, and UI. Prove immediate same-tick repeat claims consume no interval, reward, RNG, pity, or receipt and perform no persistence.
- Claiming Tower does not consume or alter Expedition claimed rewards, history, pity, receipt, or claim sequence. Claiming Expedition does not consume or alter the corresponding Tower fields. At an advancing clock the non-claimed lane may settle only its cursor and pending segment chronology, and Village/Family may accrue independently under their existing rules.

### Persistence and refusal

- The Phase 9 protected-slot, staging, validation, recovery, export, reset, storage-event, conflict, and no-CAS residual-risk contract remains an exact semantic successor.
- Invalid, non-finite, unsafe, negative, overflow, malformed, stale, or unauthorized paths refuse with zero partial reward and preserve durable state under the existing coordinator guarantees.
- No Phase 10A action creates a migration receipt, checkpoint, additional protected slot, revision without a legitimate mutation, or retroactive reward.
- Exercise nonzero elapsed Tower-only, Expedition-only, and combined-lane mutations at staging ownership/write/verify, active conflict/write/verify, and cleanup ownership/remove/verify fault boundaries. Pre-active failures restore the exact twelve slots, active raw/revision, in-memory state, runtime, and UI. Post-active interruption/recovery adopts the committed target exactly once. A later-clock retry continues from the authenticated staged/committed cursor without duplicate credited elapsed or lost elapsed.

### Live browser

- Run the additive Phase 10A browser gate twice at 320×568 and twice at 390×844, covering normal and reduced motion.
- Each run reports zero failed rows and a blank fatal field; the browser console has zero warnings and errors.
- Confirm current schema-10 Tower and Expedition readiness, preview, claim, immediate repeat, and reload behavior in the live page.
- Confirm no horizontal overflow, missing controls, blocked taps, or visible Phase 9 regression.

## Evidence and release gate

- Freeze the contract in its own commit before production implementation.
- Keep production repair and QA/evidence in focused commits.
- Record exact base, production commit, candidate/evidence commits, artifact SHA-256/bytes, embedded-asset aggregate, CLI totals, live totals, historical-regression results, and known residual risks in `docs/PHASE_10A_RESULT.md`.
- Run the complete frozen Phase 9 focused CLI verifier, Phase 8 semantic-successor verifier, and Phase 9 checksum gate twice on the clean candidate tip; document only the expected current-artifact identity replacements introduced by the two-guard repair.
- Require two independent read-only reviews: one focused on product/settlement semantics and one focused on persistence/regression integrity.
- Merge and publish only from a clean exact reviewed tip. Verify GitHub Pages serves the exact production artifact and exercise both schema-10 idle lanes publicly before beginning Phase 10B.

## Do-not-break note

Phase 10A repairs eligibility, not design. It must make current saves receive the already-defined Tower and Expedition idle behavior and nothing else. The wider Phase 10 schema-11, economy, claim-registry, pity, simulator, and balancing decisions remain unimplemented until their own contracts and gates are approved.
