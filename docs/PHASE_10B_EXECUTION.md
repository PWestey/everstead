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
- Campaign simulation enforces the frozen no-replay rule. A cleared stage is never selectable or runnable, each paid/rewarded receipt is a first clear of the exact next contiguous stage, stage 10 advances to a null selection, and later claim attempts emit no receipt, spend, reward, or Rank EXP. Duplicate identity is semantic (`campaign:<lane>:<stage>:first-clear`) and excludes receipt-array position. The proof independently replays every claim from immutable state: production-order Building accrual and whole-pending collection, deterministic idle progression, each lane/run slot in exact global `campaignOrder`, every `firstClear`/sequence/Rank/Power/Gold/`canRun` gate, the exact cleared-or-blocked status and refusal reason, Campaign rewards/spend, and the post-Campaign upgrade. Missing eligible attempts, extra attempts, false blocks, false gate fields, wrong reasons, and post-cap receipts therefore fail symmetrically. Its oracle has separate starting-state, EXP/Rank, economy/combat Power, Gold, efficiency, RNG, reward, Family-recipient, and upgrade-cost implementations rather than calling the execution helpers.
- Idle reward proof uses the natural identities `tower:<floor>:<intervalOrdinal>`, `expedition:<stage>:<intervalOrdinal>`, and `family:<building>:<rollOrdinal>`. It independently enumerates eligible intervals from cumulative accepted-time ranges, starting carry, canonical claim clocks, cadence, and caps; attributes each interval start to its source segment; folds the remaining range into ending carry; and then derives pity, stable RNG, recipients, awards, and histories. This is structurally separate from the executor's destructive settlement loop. The frozen report stores compact claim/count/first/last/digest and resource-fold evidence; verifier-only adversarial audits prove that wrong Campaign target/Gift/sequence/Power/cost/spend/order/access and duplicate, missing, misdirected, or settlement-forged idle events fail.
- Candidate Fellow economy Power excludes assigned-Companion transfer and Family Bond; Companion economy Power owns Mastery separately; Family remains outside both roster totals.
- `current-report.json` freezes all 144 deterministic bundles as report version 3/scenario format 4. Every noninteger is an exact Float64 wrapper carrying its 16-hex-digit binary identity and canonical decimal display. Verification explicitly unwraps those values, then recomputes and compares the full canonical report bytes, SHA-256, and length in the same process, a separate process, and the frozen file without writing it.

## No-write and live implementation

- The focused verifier snapshots `index.html`, every direct Phase 10B input/output, and the complete exact 203-file Phase 0–10A successor set before and after execution. The separate 203-row successor independently freezes and verifies all 188 historical plus 15 Phase 10A-owned bytes.
- Ordinary verification emits only standard output.
- Every direct production-probe vector is exact-key validated before production state construction or selector execution. The 21 schemas enforce canonical profile IDs/values, exact Fellow ownership order, finite nonnegative non-`-0` domains, the JavaScript Date range, checked timestamp and pending-Gold additions, bounded text, at most 720 idle intervals/Family rolls, at most 30 segments, at most 86,400,000 accepted segment milliseconds, Family carry below 14,400,000 milliseconds, drought below 8, and Mastery/Might at or below 50,000. Campaign surplus, discount, and effective-cost intermediates and every probe output are checked finite and safe before JSON serialization, preventing `Infinity`/`NaN` normalization. These guards bound every production loop and output path exercised outside the VM script timeout.
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

## Sealed execution evidence

Phase 10B-1 is accepted as a QA/docs-only simulator and permanent acceptance gate at exact executable package commit `b12395292f7bbdbaa37ef119ff1a96f2ce488775`. This acceptance does not select or promote any advisory configuration and does not authorize Phase 10B-2 or a production change.

- The focused 624-row gate passed twice with exact category totals 20/40/96/240/144/60/24, registry identity exact, repository writes preserved, and all 240 accepted-production probe vectors passing.
- The exact Phase 10A successor passed 203/203 twice. Inherited gates passed twice each: Phase 10A focused 371/371, Phase 10A semantic predecessor/successor 22/22, Phase 9 focused 355/355, Phase 8 successor 703/703, Phase 10A checksums 14/14, and Phase 10B checksums 22/22.
- The live dashboard passed 164/164 twice across 320×568 and 390×844 in normal and reduced-motion modes. Each pass rendered all 164 rows with blank fatal evidence, zero failed rows, and zero captured warning/error console entries.
- The boundary/authority review by `phase3_implement` passed on the exact executable tip. The anti-tautology/reward review by `phase9_bridge_exact` also passed on that exact tip.
- The production artifact remains SHA-256 `717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed`; the locked contract remains SHA-256 `0804717ecb383e779de9ea2801cb71726280b86b9ae1f41021fc8fbb17bbfb86`; and the frozen report remains SHA-256 `5d7e0f0b81d8e9362e15031480c363f80ee098ef7c7d2deef69c35db7f448e51`, 94,974,300 bytes, with 210,773 exact Float64 wrappers.

The accepted evidence confirms strict canonical authority, exact Float64 parity, independent Campaign and idle oracles, complete attempt symmetry, natural reward identity and resource accounting, bounded read-only production probing, deterministic report bytes, no-write behavior, and inherited regression preservation. The package remains advisory: its three candidate configurations are comparison outputs only.
