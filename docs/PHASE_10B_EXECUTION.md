# EVERSTEAD — PHASE 10B-1 EXECUTION RECORD

## Candidate boundary

- Implementation started from reviewed contract tip `723492b1e968407f23c7d78deabf66813f14c229`, which is additive to the exact accepted Phase 10A evidence base `d9c3862f09b7ce702db6985a0ebe569a31edec4b`.
- The accepted production artifact remains exact SHA-256 `717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed`, 18,916,682 bytes, with embedded-asset aggregate SHA-256 `26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a`.
- `index.html`, schema 10, all twelve protected slots, production behavior, and every Phase 0–10A file were held immutable.
- This is a QA/docs-only candidate. It contains no schema 11 work, production helper extraction, candidate activation, production bridge addition, save write, or public UI change.

## Implemented truth layers

1. **Frozen candidate golden.** `golden-current.json` contains 96 literal microvector outputs and 240 literal, inspectable released-parity outputs using canonical Float64 identities where needed. The verifier, browser, and build contract cannot rewrite it. Independent golden review remains a sealing requirement.
2. **Independent reference model.** `reference-model.mjs` owns a literal released configuration and separately implements Building, upgrade, offline, progression, Power, Campaign, idle, stable reward, pity, Relic, Might, and Mastery calculations. It does not import or parse the production probe.
3. **Accepted-production probe.** `production-probe.mjs` first verifies the accepted artifact hash and byte length, preflights the boot tail and every selector declaration as exact-once anchors, replaces only the boot tail with a frozen non-enumerable probe facade in memory, and executes actual production selectors in fresh VM contexts with code generation disabled. Storage, UI, timers, confirmation, and network are poisoned; inherited Phase 6/7/9 hooks are absent; and removing the facade restores the accepted bytes exactly.

Every released parity row compares stable field paths for all three exact pairs: golden/reference, golden/production, and reference/production. There is no opaque digest-only result, tolerance, majority vote, or golden regeneration.

## Focused gate implementation

The frozen row registry contains exact unique ordered IDs totaling 624:

| Category | Exact rows |
| --- | ---: |
| Artifact/static integrity | 20 |
| Released config inventory | 40 |
| Hand-worked golden microvectors | 96 |
| Three-way released parity | 240 |
| Advisory candidate bundles | 144 |
| Economy and safety invariants | 60 |
| Mutation sensitivity | 24 |
| **Total** | **624** |

The released parity vectors cover 80 Building, 8 upgrade, 24 offline, 48 Fellow Power, 16 Companion Power, 20 Campaign, 24 idle/drop, and 20 Relic/Might/Mastery cases. The 24 named mutation probes each preserve a passing control and apply a genuine nonthrowing input or implementation mutation; each must make the named ordinary parity/invariant field fail in its expected class.

## Advisory simulator

- The matrix is exact four configs × six archetypes × six horizons = 144 bundles.
- The released lane retains growth 1.70, fresh Gold 500,000, and neutral roster economy hooks.
- The three named candidates use growth 1.20, 1.22, or 1.24, fresh Gold 50,000, and the frozen disjoint Fellow/Companion saturation curves.
- Every bundle labels itself only `released parity` or `advisory candidate`.
- The immutable scenario registry owns exact artifact/config/reference identities, fixed time/save data, ordinals/droughts/carries, released constants and salts, roster/relic/progression state, policies, safety limits, and all 144 matrix coordinates. Byte-order and own-key structural authorities cover the complete registry, while the exported canonical-input validator independently freezes every variable subtree for both supported roster-state shapes. The fixed static row recursively injects both a serializable foreign member and an own `undefined` member into all 369 registry object locations and all 90 fresh canonical-input object locations, then checks changed/reordered authority values and negative-zero aliases; every case must fail closed.
- Gold conservation keeps production Float64 Building generation and pending-Gold carry, collects only whole pending Gold, records every ordered pending/Gold operation with exact before/delta/after values, and replays the three modeled sinks—Building upgrades, Fellow Campaign, and Companion Campaign—in the identical JavaScript operation order. Each accrual event first accumulates every time segment into four per-Building line totals, reduces those four totals once in canonical Building order, and only then adds the result to pending Gold, matching the accepted selector exactly. The discriminating released/fresh three-day claim-3 value is `676311.4679999998` (Float64 bits `4124a3aeef9db22b`). No tolerance or milligold surrogate is used.
- Every bundle exposes canonical metadata; inputs; per-Building, per-segment, pending, claimed, and spent Gold; Building components, next cost, and time-to-afford; complete combat/economy Power ownership and independently derived no-double-count evidence; progression, Campaign, idle/pity/RNG/carry, pacing, and safety outputs. Fellow and Companion progression includes exact current/next cumulative EXP thresholds, step cost/progress/remaining values, rarity cap, full shard-cost table, current ascension cost, remaining shards, and cumulative rarity spend.
- Campaign simulation enforces the frozen no-replay rule. A cleared stage is never selectable or runnable, each paid/rewarded receipt is a first clear of the exact next contiguous stage, stage 10 advances to a null selection, and later claim attempts emit no receipt, spend, reward, or Rank EXP. Duplicate identity is semantic (`campaign:<lane>:<stage>:first-clear`) and excludes receipt-array position. The proof independently derives stage sequence, target, effective cost, stable Gift roll, rewards, history, and resource deltas from immutable inputs rather than receipt fields.
- Idle reward proof uses the natural identities `tower:<floor>:<intervalOrdinal>`, `expedition:<stage>:<intervalOrdinal>`, and `family:<building>:<rollOrdinal>`. It independently reconstructs accepted segments, interval/roll ordinals, pity, stable RNG, recipients, awards, carries, and ending state. The frozen report stores compact count/first/last/digest and resource-fold evidence; verifier-only adversarial audits prove that wrong Campaign target/Gift/sequence and duplicate, missing, or misdirected idle events fail.
- Candidate Fellow economy Power excludes assigned-Companion transfer and Family Bond; Companion economy Power owns Mastery separately; Family remains outside both roster totals.
- `current-report.json` freezes all 144 deterministic bundles as report version 3/scenario format 4. Every noninteger is an exact Float64 wrapper carrying its 16-hex-digit binary identity and canonical decimal display. Verification explicitly unwraps those values, then recomputes and compares the full canonical report bytes, SHA-256, and length in the same process, a separate process, and the frozen file without writing it.

## No-write and live implementation

- The focused verifier snapshots `index.html`, every direct Phase 10B input/output, and the complete exact 203-file Phase 0–10A successor set before and after execution. The separate 203-row successor independently freezes and verifies all 188 historical plus 15 Phase 10A-owned bytes.
- Ordinary verification emits only standard output.
- Every direct production-probe vector is exact-key validated before production state construction or selector execution. The 21 schemas enforce canonical profile IDs/values, exact Fellow ownership order, finite nonnegative non-`-0` domains, safe timestamp arithmetic, bounded text, at most 720 idle intervals/Family rolls, at most 30 segments, at most 86,400,000 accepted segment milliseconds, Family carry below 14,400,000 milliseconds, drought below 8, and Mastery/Might at or below 50,000. These caps bound every production loop that executes outside the VM script timeout.
- `build-contract.mjs` carries the `GOLDEN_WRITE_PROHIBITED` guard and writes only the manifest and checksum file.
- The live dashboard is QA-only and read-only. Four sandboxed realms cover 320×568 and 390×844 in normal and reduced-motion modes. Runner and realms record every trap installation failure, install real traps for storage and protected browser APIs, and permit only their exact same-origin GET allowlists with `credentials: 'omit'`; request credentials and the no-script-visible-`Set-Cookie` boundary are measured.
- Each realm freezes exactly 40 unique checks for report shape, advisory labels, controls and updated rendering, ledger conservation, source/sink visibility, Power ownership, caps/safety, canonical identities, API/storage/network isolation, and horizontal fit. Four runner identity rows yield exact 164.
- The dashboard's Run control remains enabled except during the current pass and an automatic initial pass is provided.

## Regression and evidence workflow

1. Run the exact 624-row focused gate twice.
2. Run the exact 203-row Phase 10A successor twice.
3. Run Phase 10A focused and semantic predecessor/successor suites, Phase 9 focused, and Phase 8 successor twice at their accepted totals.
4. Build manifest/checksums only after every owned input is frozen; then rerun focused/successor/checksums without repository writes.
5. Run the exact 164-row live candidate twice at all four realms with blank fatal and zero captured warning/error evidence.
6. Obtain separate read-only economy/model and anti-tautology/regression reviews on one exact tip.
7. Record evidence without promoting any advisory candidate. Phase 10B-2 stays separately blocked.

## Current execution status

The package is implemented as an unsealed repaired candidate. A writer diagnostic completed 624/624 with the exact frozen category totals and no write drift after the final structural-validation, bounded-probe, and natural-reward repairs. It also confirms all 240 exact production-probe vectors, strict foreign/`undefined`/negative-zero rejection, the discriminating production-order Gold value, and zero bad Gold, Campaign, idle-reward, duplicate, or lost-resource proofs across all 144 bundles. The accepted verifier still has no bypass and retains the complete 203-file snapshot. Official focused repeats will execute from a fully materialized temporary clone, followed by successor, inherited, checksum, live, and independent-review evidence on one exact tip. Pending fields are intentional and must not be interpreted as a pass.
