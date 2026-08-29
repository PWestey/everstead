# EVERSTEAD — PHASE 10B-1 ECONOMY SIMULATOR AND ACCEPTANCE-GATE CONTRACT

## Authority and immutable base

- Implement from exact clean Phase 10A evidence base `d9c3862f09b7ce702db6985a0ebe569a31edec4b`.
- The accepted Phase 10A production change is `9d82db565ff482a3898e68bd8a6dce8505a9bfe9`; its independently reviewed QA package is `0aa03643575be9e0ad845e67e150c9cf3b48ec6f`; and the published `main` evidence commit is `c198181fc52d4f5074e0f7c2ea02216c80470884`.
- The accepted production artifact is exact SHA-256 `717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed`, 18,916,682 bytes, with five embedded assets and embedded-asset aggregate SHA-256 `26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a`.
- `EVERSTEAD — LOCKED CORE DESIGN v1.0`, Drive file `1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg`, exact verified revision `AIroW34MYqUcG6Q-iOW_AtHMqmrwGj9Nb9AFMEEqxselBNLMox14pJzqh11nWmvHfp6LI-QdrsXi6ruy1TNJJQXiXzh4BgLMN-zh7XtA8-I`, remains the product authority.
- `EVERSTEAD — IMPLEMENTATION ROADMAP v1.0`, Drive file `1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900`, exact verified revision `AIroW37XK-kLSvIWAi8bvi_c0B1TCCOIJCp93RQrxiAF8JmMMvgT0A9vnlZGdeAKQ_hSs674e9BNw9beXDa6RApDYcpXuZexshqiy4pvM_U`, defines the wider Phase 10 economy, Power, offline-claim, bad-luck-protection, and balancing work.
- Phase 10B-1 is a QA/docs-only measurement and oracle phase. `index.html` must remain byte-identical to the accepted artifact, `CURRENT_SCHEMA_VERSION` remains 10, and all twelve protected storage slots remain exact.

## Phase split

Phase 10B is deliberately split so measurement authority exists before production code is reorganized or balance is activated.

- **Phase 10B-1 — this contract:** build an independent deterministic economy simulator, a production-parity probe, frozen reviewed goldens, an additive permanent acceptance gate, and a QA-only results dashboard. It makes no production behavior change.
- **Phase 10B-2 — explicitly deferred:** only after Phase 10B-1 passes its full gate and two independent reviews may a separate contract consider extracting production economy helpers, adding schema-11 groundwork, activating roster economy hooks, changing starting Gold or costs, consolidating claims, or implementing any selected balance.
- Phase 10B-1 evidence cannot authorize Phase 10B-2 work. Phase 10B-2 requires its own exact base, production diff, migration/persistence contract, successor gate, reviews, and release decision.

## Objective

Create a permanent, deterministic, non-self-referential economy oracle that can:

1. reproduce the accepted schema-10 economy, Power, Campaign, idle, pity, and reward calculations without changing production;
2. prove parity between hand-reviewed expected values, an independent reference model, and the actual accepted production selectors;
3. compare explicitly named candidate balance configurations across representative states and horizons;
4. expose source/sink, pacing, cap, progression, and safety results in canonical machine-readable output and a mobile QA-only dashboard; and
5. make later production balancing auditable by detecting formula, order, rounding, cap, ownership, and no-double-counting drift.

The simulator is a decision aid. It does not decide what is fun, approve a candidate, modify a save, or make any candidate value authoritative production design.

## Scope boundary

### Create in Phase 10B-1

- A Phase 10B-1 contract, execution record, result record, and QA-only simulator package.
- A literal audited released-config snapshot, frozen scenario inputs, frozen reviewed current-behavior goldens, an independent reference model, an in-memory production probe, a deterministic candidate simulator, a focused CLI verifier, an inherited-regression runner, and checksum/manifest evidence.
- A QA-only browser dashboard that presents the canonical report without becoming an oracle.
- Explicit mutation-sensitivity tests that prove the acceptance gate detects material drift.

### Keep exactly as-is

- The complete production artifact, single-file architecture, mobile application, visible UI, navigation, CSS, embedded art, feature flags, QA bridge, diagnostics, clocks, randomness, save namespace, persistence coordinator, recovery, export, reset, storage-event behavior, and no-CAS residual-risk boundary.
- Schema 10, all twelve protected slots, every released migration and receipt, every state and ledger shape, and all saved balances.
- Current Building, Oath, Family, Fellow, Companion, Campaign, Tower, Expedition, Relic, Player Rank, Might, Mastery, offline, claim, reward, pity, and rounding behavior.
- All Phase 0–10A QA/docs artifacts except additive Phase 10B-1 files.

### Explicitly prohibited

- No production helper extraction, duplicated production helper, calculator module, production import, script tag, feature flag, bridge method, diagnostic field, UI surface, storage adapter, telemetry hook, or namespace change.
- No schema 11, migration, checkpoint, receipt, staging, export, safe-reset, validation, state-shape, protected-slot, or save-byte change.
- No Building rate, upgrade cost, Oath boost, Family bonus, Power, Campaign requirement/cost/reward, Rank threshold, idle cap/rate, shard chance, pity, RNG, Relic, Might, Mastery, starting-resource, or roster-hook activation.
- No generated file may be written by the ordinary verifier or browser runner. No accepted golden may be regenerated as a side effect of testing.
- No candidate may be labeled accepted, recommended, selected, production-ready, or migration-ready by simulator output alone.

## Authoritative released schema-10 baseline

Phase 10B-1 must inventory and reproduce the accepted source, order, boundaries, and rounding. The reference snapshot is literal reviewed data; it is not parsed from production at runtime.

### Village Gold and Buildings

- Fresh schema-10 Gold is 500,000. Prosperity is 120 and is not a production multiplier.
- Building base Gold/hour is Training Grounds 7,200; Command Center 6,500; Archives 5,600; Hearth 6,100.
- Building level cap is 52 and the level multiplier is `1.15^(level - 1)`.
- The upgrade from current level `L` costs `round(15000 * 1.70^(L - 1))`; a Building at level 52 has no further upgrade.
- A current-day completed Oath adds 3%, 5%, or 8% to its mapped Building for Easy, Medium, or Hard respectively. Each Building's accumulated daily Oath boost is capped at 30%.
- The accepted Building order is `base × level × Family assignment × Fellow roster × Companion roster × overall-day × Oath`, with Oath last. Released Fellow-roster, Companion-roster, and overall-day bonuses are exact zero, therefore their multipliers are exact one.
- A Family assignment multiplier is exact one when unassigned. When assigned, its bonus is capped at 20% and is composed from 1% base, Intimacy at `min(10%, intimacy × 0.0002)`, 2% for each rarity step above 1, and a 1% specialty match. Family is the only active character-economy multiplier in the released Building formula.
- Offline Gold accrues from Buildings only, segments at local midnight for the correct daily Oath context, and caps elapsed credit at 24 hours. Pending Gold is not a second production source.
- The frozen fresh assignment baseline—Tamsin to Training, Isolde to Archives, Elara to Hearth, Command unassigned—produces exact component rates 7,453.44; 6,500; 5,776.96; and 6,356.2 Gold/hour before Oath, totaling 26,086.6/hour and 626,078.4 per capped 24 hours.

### Fellow and Companion progression and Power

- Fellows have level cap 120, EXP base 100, EXP growth 1.12, +11.5% Power per level above 1, rarity cap 5, rarity shard costs `[20,40,80,160]`, and +8% Power per rarity step. Released Bond milestone Power is neutral.
- Released effective Fellow Power order is base, level, rarity, neutral Bond milestone, Relic, assigned-Companion transfer, Family-to-Fellow Bond, global Might, then one final round. The assigned Companion contributes 40% of its effective Power before Family and Might multiplication.
- Companions have level cap 100, EXP base 80, EXP growth 1.12, base Power Bramble 1,000 and Cinderwing 1,200, +10% Power per level above 1, rarity cap 5, rarity shard costs `[20,40,80,160]`, and +10% Power per rarity step.
- Released effective Companion Power order is base, level, rarity, Mastery, then one final round.
- Might and Mastery each cap at 50,000 points and level 50, use threshold `20 × level^2`, and add 1% Power per level. They are progression resources, never spendable Gold.
- Six Relics retain one-copy ownership, one Fellow slot, level cap 10, their accepted tier-based basis-point bonuses, deterministic source-stage rewards, duplicate salvage, and Relic Stone costs. Relics affect Fellow Power only at their existing position.

### Campaigns and idle lanes

- Campaign cost efficiency uses `surplus = max(0, totalRosterPower / recommendedPower - 1)`, `discount = min(0.35, surplus × 0.25)`, and `effectiveCost = max(1, ceil(baseCost × (1 - discount)))`.
- Fellow Campaign retains its ten accepted recommended-Power values, base-cost vector `10000 + 2000 × zeroBasedStage`, EXP, targeted-shard, Gift, Rank EXP, Relic, sequence, history, and stable reward rules.
- Companion Campaign retains its ten accepted recommended-Power values, base-cost vector `8000 + 1500 × zeroBasedStage`, EXP, targeted-shard, sequence, and stable reward rules.
- Companion Tower and Fellow Expedition each use a one-hour interval and independent 24-hour cap. Tower requirement is `round(2000 × 1.06^(floor - 1))`; Expedition requirement is `round(5500 × 1.08^(stage - 1))` with the accepted roster-size gate.
- Tower idle EXP is `20 + 2 × floor`, idle Mastery is `1 + floor((floor - 1) / 10)`, and shard chance is `min(30%, 8% + 0.5% × (floor - 1))`.
- Expedition Might per interval is `1 + floor((stage - 1) / 2)` and shard chance is `min(30%, 8% + 2% × (stage - 1))`.
- Tower, Expedition, and Family Building drops retain their accepted deterministic identities, target rules, independent drought counters, and forced-eighth pity. They do not produce Gold.

Any discrepancy between this inventory and exact accepted production is a contract blocker to resolve by correcting the contract/golden before implementation. Phase 10B-1 must not change production to make it match the simulator.

## Formula ownership and no-double-counting rules

### Released-parity lane

- The released-parity lane reproduces the complete accepted gameplay formulas exactly, including Companion transfer and Family Bond in effective Fellow combat Power and the currently neutral Fellow/Companion Building hooks.
- It reports ownership of each term and resource. It cannot move, omit, duplicate, or reinterpret a term to resemble a candidate.

### Candidate economy-integration lane

- Candidate comparisons may model a Fellow-roster Building bonus and a Companion-roster Building bonus only as explicit input values or explicit candidate formulas.
- Candidate `fellowEconomyPower` contains only each owned Fellow's own base, level, rarity, neutral/current Bond milestone, equipped Relic, and Might terms, followed by one Fellow-local round before roster summation. It excludes assigned-Companion transfer and every Family-to-Fellow Bond multiplier.
- Candidate `companionEconomyPower` is the sum of each owned Companion's effective Power, including that Companion's Mastery. It is not also inserted into `fellowEconomyPower`.
- Family remains a direct Building-assignment multiplier. Family Intimacy, rarity, specialty, and Family-to-Fellow Bond terms cannot enter either roster economy-Power total.
- Prosperity remains presentation/progression data and is not a Building multiplier. Might and Mastery remain nonspendable progression resources.
- The candidate Building order remains base, level, Family, Fellow roster, Companion roster, overall-day, Oath last. Oath remains capped at 30%.
- Reports must expose raw inputs, owned-term attribution, basis-point bonuses, multipliers, and the final Building rate so double counting can be inspected directly.

## Simulator inputs

Every simulator run consumes one immutable canonical input object containing:

- simulator and scenario-format versions;
- exact production-artifact, released-config, scenario-registry, and reference-model identities;
- an explicit config ID and all values used by that config—no hidden fallback to production constants;
- one named archetype containing only canonical gameplay/economy state required by the model;
- one named horizon, exact starting timestamp, fixed `America/Phoenix` time-zone rule, and explicit claim cadence;
- an explicit deterministic action policy, including claim boundaries, Building-upgrade priority/tie order, Campaign spending priority, progression changes, and stop conditions;
- an explicit save ID and starting ordinals/drought counters for stable reward and pity vectors; and
- exact safety limits for steps, histories, elapsed time, caps, and integer magnitude.

Unknown fields, missing fields, duplicate IDs, non-canonical order where order is contractual, negative/unsafe/non-finite values, implicit current time, ambient locale, ambient randomness, or unbounded loops fail closed.

## Advisory comparison configurations

The scenario registry includes exactly four comparison configurations for the 144-bundle advisory matrix:

1. `released-schema10`: upgrade growth 1.70, fresh Gold 500,000, and neutral Fellow/Companion roster economy hooks.
2. `candidate-growth-120`: upgrade growth 1.20, fresh Gold 50,000, and the advisory disjoint roster curves below.
3. `candidate-growth-122`: upgrade growth 1.22, fresh Gold 50,000, and the advisory disjoint roster curves below.
4. `candidate-growth-124`: upgrade growth 1.24, fresh Gold 50,000, and the advisory disjoint roster curves below.

The advisory roster curves are explicit scenario inputs:

```text
fellowRosterBonusBps = floor(1500 * fellowEconomyPower / (fellowEconomyPower + 100000))
companionRosterBonusBps = floor(1000 * companionEconomyPower / (companionEconomyPower + 25000))
```

- The Fellow curve approaches but never exceeds 1,500 basis points; the Companion curve approaches but never exceeds 1,000 basis points.
- These names, values, curves, and reports are comparison hypotheses only. Their presence in a frozen QA scenario does not approve them for production, schema 11, migration, UI copy, or a later contract.
- Adding, removing, renaming, or changing an advisory configuration changes the scenario identity and requires a focused reviewed Phase 10B-1 QA update. It never silently changes an accepted golden.

## Canonical simulator outputs

For every run, emit stable-key-order canonical JSON containing:

- metadata: simulator version, input/scenario/config/archetype/horizon IDs, exact base/artifact/config/scenario/reference identities, fixed time-zone, starting timestamp, and deterministic policy identity;
- source/sink ledger: Building Gold by Building and segment, total generated, pending, claimed, starting/ending balance, Building-upgrade spending, Fellow Campaign spending, Companion Campaign spending, and exact conservation check;
- Building table: level, base, every owned multiplier/bonus, Oath value, rate/hour, capped 24-hour output, next upgrade cost, and time-to-afford under the simulated policy;
- Power table: all Fellow/Companion component inputs, accepted combat Power, candidate economy Power, excluded terms, roster sums, bonus basis points, and no-double-count proof;
- progression table: EXP thresholds/levels, rarity/shard costs, Relic bonuses/costs, Might/Mastery thresholds and multipliers, Rank/stage access, and Campaign efficiency/cost;
- idle table: credited/discarded elapsed, interval counts, partial carry, stage/floor attribution, nominal/accepted rewards, target maps, caps, drought/pity before and after, and Gold neutrality;
- pacing summary: instant, one-hour, one-day, three-day, seven-day, or thirty-day state; time-to-upgrade bands; stage affordability/readiness; shard drought; and capped versus uncapped nominal output;
- safety/invariant results: no negative, unsafe, non-finite, duplicate, lost, or double-counted value; all caps and resource ownership preserved; and
- comparison status labeled only `released parity` or `advisory candidate`. No field may declare a winning or accepted candidate.

Integer production values remain integers. Candidate multipliers are represented in integer basis points where possible. Every non-integer released-parity value is stored with an exact Float64 identity and a canonical decimal display; parity does not use an undocumented tolerance. Human display decimals use a named scale and rounding mode and never become the arithmetic oracle.

The serializer uses UTF-8, stable key order, stable array order, no insignificant whitespace for hashed canonical payloads, no platform-dependent line endings, and no timestamps other than explicit scenario inputs. Two clean processes given the same input must emit byte-identical output and the same SHA-256.

## Three independent truth layers

### 1. Frozen reviewed golden

- `golden-current.json` contains literal reviewed expected outputs for accepted released behavior.
- Goldens are constructed from hand-worked values and independently reviewed tables, not copied from either executable model.
- The normal verifier, browser runner, build-contract script, manifest builder, and checksum builder may read but cannot overwrite a golden.
- Any refresh tool may write only a separately named untracked or review-candidate artifact such as `golden-current.candidate.json`. Promotion requires an explicit human-reviewed patch and invalidates prior evidence.

### 2. Independent reference model

- The reference model is a pure calculator with its own literal released-config snapshot and its own formula implementations.
- It cannot import, evaluate, parse constants from, source-transform, or call `index.html`, a production helper, the production probe, or the candidate simulator.
- It cannot share formula, reward, RNG, pity, threshold, or configuration code with the production probe. Only canonical serialization, hashing, and structural comparison utilities may be shared.

### 3. Accepted-production probe

- The production probe reads the exact accepted `index.html`, verifies its SHA-256 and byte length before execution, and exposes only required current selectors through unique, exact, fail-closed in-memory instrumentation anchors.
- The source transformation exists in memory only. Every anchor must match exactly once, and removing the instrumentation must reproduce the exact accepted source bytes.
- Production selectors execute in a fresh isolated VM/realm against cloned canonical states, a supplied fixed clock, fixed IDs, deterministic randomness where applicable, a supplied isolated-memory storage adapter, and no native browser state.
- The probe cannot call a persistence mutation, adopt runtime state, write a protected slot, open a UI, use the production artifact as a source of expected constants, or update a golden.

Every released-parity vector must satisfy exact three-way equality: frozen golden equals independent reference output; frozen golden equals accepted-production output; and reference output equals accepted-production output. A mismatch fails with the stable vector ID and field path. The verifier cannot resolve a mismatch by majority vote or by regenerating the expected side.

## Anti-tautology and mutation-sensitivity requirements

- Actual and expected calculations may not call the same formula implementation, constant object, reward helper, RNG helper, fixture builder, or state projection.
- The config inventory compares production source observations to literal reviewed expected values, but those observations cannot be fed back as reference inputs.
- Hand-worked microvectors must pin boundary values on both sides of every relevant round, ceil, threshold, cap, interval, pity, and multiplier-order decision.
- The focused verifier includes exactly 24 in-memory mutation-sensitivity rows. Each row mutates one production-probe or reference input/implementation and passes only when the ordinary parity/invariant gate detects that mutation.
- The mutation set must cover at least: Building base rate; Building level multiplier; upgrade growth; upgrade rounding; Family bonus cap or component; Oath final position; Oath cap; offline 24-hour cap; local-midnight segmentation; Fellow EXP rounding/threshold; Companion EXP rounding/threshold; Fellow Power rounding/order; Companion Power rounding/order; Relic placement; Companion transfer inclusion; Family Bond exclusion from candidate economy Power; Might or Mastery placement; Campaign ceil; efficiency cap; Tower interval or reward; Expedition interval or reward; stable reward identity/channel; and forced-eighth pity ordinal.
- Mutation rows cannot pass merely because a mutation throws. The row must identify the expected parity/invariant failure class and prove the unmutated control passes.
- A row-registry file freezes all 624 stable IDs and their category. The verifier asserts exact count, uniqueness, order, category totals, and registry SHA-256; it never accepts `>= 624`.

## Exact focused CLI acceptance matrix

The permanent Phase 10B-1 focused verifier contains exactly 624 rows:

| Category | Exact rows | Required coverage |
| --- | ---: | --- |
| Artifact/static integrity | 20 | Exact base/artifact/assets/schema/slots; no production change; package boundary; no-write/static contracts |
| Released config inventory | 40 | Exact Building, Oath, Family, Fellow, Companion, Campaign, Tower, Expedition, Relic, Rank, Might, Mastery, cap, order, and reward constants |
| Hand-worked golden microvectors | 96 | Building/formula order 24; upgrade rounding/cap 16; EXP/level thresholds 16; Power order/rounding 16; Campaign efficiency 12; idle/pity/RNG 12 |
| Three-way released parity | 240 | Building rates 80; upgrade boundaries 8; offline Gold 24; Fellow Power 48; Companion Power 16; Campaign efficiency 20; idle/drop rewards 24; Relic/Might/Mastery 20 |
| Advisory candidate bundles | 144 | Four configs × six archetypes × six horizons |
| Economy and safety invariants | 60 | Ownership, conservation, caps, monotonicity, no-double-counting, Gold neutrality, determinism, safety, and advisory-only labeling |
| Mutation sensitivity | 24 | Exact required drift-detection set |
| **Total** | **624** | Exact, unique, frozen row registry |

### Released-parity vector construction

- Building rates: four Buildings × five levels × four assignment/Oath profiles = 80.
- Upgrade costs: eight under/cap/safe-integer/rounding boundary vectors = 8.
- Offline Gold: four rate/Oath profiles × six durations covering zero, one hour, just below/exact/above the 24-hour cap, and local-midnight segmentation = 24.
- Fellow Power: six Fellows × eight component/rounding profiles = 48.
- Companion Power: two Companions × eight component/rounding profiles = 16.
- Campaign efficiency: 20 Fellow/Companion under, exact, over, rounded, and 35%-capped vectors = 20.
- Idle/drop rewards: 24 Tower, Expedition, and Family interval, target, cap, drought, forced-eighth, empty-progress, partial-carry, and Gold-neutral vectors = 24.
- Relic/Might/Mastery: 20 ownership, tier, level, cost, threshold, cap, and rounding vectors = 20.

### Advisory bundle construction

- Configs are the exact four comparison configurations above.
- Archetypes are exact named `fresh`, `early`, `mid`, `late`, `near-cap`, and `max-stress` fixtures. Each fixture declares all state and policy inputs; no fixture is derived from another model's output during verification.
- Horizons are exact `instant`, `1-hour`, `24-hour`, `3-day`, `7-day`, and `30-day` durations.
- Four × six × six produces exactly 144 advisory rows. A row verifies canonical deterministic output, finite/safe values, conservation, monotonic/cap expectations, resource ownership, and advisory labeling; it does not assert that one candidate is preferable.
- Claim cadence, spend priority, upgrade tie order, Campaign policy, and stop conditions are explicit fixture data. The simulator cannot invent a rational-player policy or use the output to change the input.

## Required invariants

The exact 60-row invariant registry must collectively prove:

- Buildings are the only enabled spendable-Gold source; pending Gold is deferred Building output, not a new source.
- Building upgrades, Fellow Campaign, and Companion Campaign are the only modeled Gold sinks in this phase and exact conservation holds.
- Prosperity, Gifts, shards, EXP, Relic Stones, Rank EXP, Might, and Mastery cannot be converted to Gold by the simulator.
- Oath is final, Building-local, current-day only, and capped at 30%.
- Family applies exactly once as a direct Building assignment.
- Candidate Fellow and Companion economy-Power totals are disjoint; Companion transfer and Family Bond are absent from candidate Fellow economy Power.
- Released combat Power remains unchanged and retains Companion transfer, Family Bond, Relic, Might, and Mastery in their accepted ownership/order.
- Building rates, upgrade costs, EXP thresholds, Power, and candidate saturation bonuses are nondecreasing over their intended valid domains; caps remain effective.
- Campaign discount is zero under/at recommendation, grows only above recommendation, never exceeds 35%, and effective cost is at least one.
- Tower, Expedition, and Family elapsed caps, independent histories, reward ownership, pity, partial carry, and Gold neutrality remain exact.
- No candidate or released run produces a negative, NaN, Infinity, unsafe integer, duplicate reward, lost resource, double spend, double count, or unbounded step count.
- Fresh and migrated archetype inputs are cloned and remain byte-identical after simulation.
- Repeated same-process and separate-process runs produce byte-identical canonical reports.

## Persistence, bridge, and no-write constraints

- Phase 10B-1 adds no production QA bridge method and changes no authorization boundary.
- CLI simulation and probing use only cloned inputs and an isolated in-memory adapter. Exact native `localStorage` is unavailable to the calculator and probe.
- The browser dashboard must not read or write production localStorage, sessionStorage, IndexedDB, cookies, Cache Storage, service workers, downloads, clipboard, network endpoints, or the production save namespace.
- Loading, running, rerunning, filtering, or changing a dashboard display cannot change any file, save, protected slot, active revision, staging state, runtime application state, or accepted evidence.
- The focused verifier snapshots all Phase 10B-1 inputs and the repository-owned output set before execution and proves no test-generated write afterward. The verifier itself emits results only to standard output unless an explicit non-gate report-generation command is invoked.
- A report-generation command must require an explicit output path outside accepted goldens, refuse to overwrite an existing file by default, and produce a candidate artifact that is not acceptance evidence until reviewed and frozen.

## QA-only live dashboard

- The future dashboard lives only under `qa/phase-10b/`; it is not linked from production and cannot be installed as a production route.
- Correctness is CLI-first. The live gate verifies canonical report identity, rendering, labels, controls, isolation, and mobile behavior; visible DOM values do not become expected values for CLI parity.
- Exercise exact 320×568 and 390×844 viewports in normal and reduced-motion modes: four isolated realms.
- The proposed live contract is 40 exact rows per realm plus four runner-level artifact/scenario/golden/report identity rows, for proposed total 164. The QA implementation must freeze the exact row registry before evidence. Any change from 164 requires explicit contract amendment rather than an undocumented total change.
- Each realm shows released and advisory labels, config/archetype/horizon selection, source/sink and Power ownership, capped/uncapped distinctions, invariant status, and canonical report identity without horizontal overflow or blocked controls.
- Run the exact live candidate twice. Each pass must report the frozen total, zero failed rows, a blank fatal field, zero warning/error console entries, zero native-storage calls, and zero production-save writes at all four realms.

## Expected Phase 10B-1 implementation package

The later QA implementation should remain additive and may create:

```text
docs/PHASE_10B_EXECUTION.md
docs/PHASE_10B_RESULT.md
qa/phase-10b/README.md
qa/phase-10b/scenarios.json
qa/phase-10b/row-registry.json
qa/phase-10b/golden-current.json
qa/phase-10b/reference-model.mjs
qa/phase-10b/production-probe.mjs
qa/phase-10b/simulate.mjs
qa/phase-10b/verify.mjs
qa/phase-10b/regress-phase-10a.mjs
qa/phase-10b/index.html
qa/phase-10b/realm.html
qa/phase-10b/realm.js
qa/phase-10b/runner.js
qa/phase-10b/current-manifest.json
qa/phase-10b/build-contract.mjs
qa/phase-10b/checksums.sha256
```

A canonical advisory report may be frozen under `qa/phase-10b/reports/` if its identity and purpose are explicit. Do not create any Phase 10B-1 QA implementation file while landing this contract.

## Manifest, checksum, and sealing rules

- The Phase 10B-1 manifest records `manifestVersion:1`, phase `10B-1`, exact package base `d9c3862f09b7ce702db6985a0ebe569a31edec4b`, `productionChanged:false`, schema 10, twelve protected slots, and the exact accepted artifact/asset identities above.
- Record exact SHA-256 and byte length for scenarios, row registry, golden, reference model, production probe, simulator, and every frozen canonical report.
- Record exact category totals, focused total 624, inherited verifier totals, live viewports/motion modes/proposed total, independent-review evidence, and deterministic repeat evidence.
- Freeze the complete Phase 10A `frozenHistoricalFiles` map plus every Phase 10A-owned QA/doc file at the Phase 10B-1 base. The Phase 10A checksum file must continue to pass all 14 entries.
- The Phase 10B-1 checksum file includes `index.html`, this contract, Phase 10B-1 execution/result docs, and every owned Phase 10B-1 QA/report file except the checksum file itself.
- Avoid self-hash cycles: the checksum file may hash the manifest; the manifest may hash scenarios, registry, golden, models, probes, and reports; the manifest does not hash its checksum file, and a report does not embed the manifest hash.
- `build-contract.mjs` may update only the manifest and checksum file. It preserves already sealed evidence unless exact owned inputs drift, in which case it must refuse or explicitly unseal. It cannot generate scenarios, a row registry, goldens, expected outputs, or a canonical report.

## Inherited regression requirements

Run each applicable gate twice from the exact clean Phase 10B-1 candidate:

- Phase 10B-1 focused verifier: exact 624/624.
- Phase 10B-1 checksum file: every entry passes.
- Phase 10A focused verifier: exact 371/371.
- Phase 10A semantic predecessor/successor gate: exact accepted result.
- Phase 10A checksum file: exact 14/14.
- Phase 9 focused verifier: exact 355/355.
- Phase 8 semantic-successor verifier: exact 703/703.
- A new Phase 10B-1 successor runner proves `index.html`, every accepted Phase 10A-owned path, Phase 10A manifest identities/evidence, and all historical frozen files remain exact.

Do not fold inherited rows into the 624 focused total. Report every suite separately and preserve intentionally superseded historical checksum expectations exactly as documented by its owning phase.

## Acceptance and evidence gate

Phase 10B-1 is accepted only when all of the following are true on one exact clean candidate tip:

- `index.html` matches exact SHA-256 `717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed`, exact 18,916,682 bytes, and exact embedded-asset aggregate.
- The production diff is empty. Schema remains 10 and all twelve protected slots remain exact.
- The focused CLI gate passes exact 624/624 twice with exact unique row-registry identity.
- All 96 hand-worked goldens pass all three truth-layer comparisons where applicable, all 240 released-parity rows pass exact three-way equality, all 144 advisory bundles are byte-deterministic and safe, all 60 invariants pass, and all 24 mutations are detected in their expected class.
- Two clean same-process runs and two separate-process runs produce byte-identical canonical output and the same report SHA-256.
- Phase 10B-1 and Phase 10A checksums pass twice; inherited focused/successor gates pass their exact accepted totals twice.
- The live dashboard passes its frozen registry twice at both viewports and both motion modes, with zero failure/fatal/warning/error/native-storage/write evidence. The intended target is 164/164 once the live registry is frozen.
- Two independent read-only reviews pass the same exact tip: one reviews released economy/model/product ownership and candidate interpretation; the other reviews anti-tautology, production probing, no-write isolation, manifests, checksums, and inherited regression integrity.
- `docs/PHASE_10B_RESULT.md` records exact base, package commits, artifact/input/output identities, CLI/live totals, deterministic-repeat evidence, independent reviews, inherited results, and residual risks.
- No review or report promotes an advisory candidate. Phase 10B-2 remains blocked until the Phase 10B-1 oracle is accepted and a separate production contract is approved.

## Do-not-change list

During Phase 10B-1, do not change:

- `index.html` or any production file, production behavior, production source formatting, embedded byte, or public UI;
- current schema, any migration, state field, ledger, receipt, checkpoint, storage slot/key, validation, recovery, export, reset, coordinator, clock, RNG, or bridge;
- any released config value, formula, formula order, rounding rule, cap, reward, pity, source/sink ownership, stage gate, assignment, Power result, or starting balance;
- any Phase 0–10A QA, fixture, manifest, checksum, contract, execution, or result byte;
- any accepted golden through a verifier/build/browser side effect; or
- any candidate label from advisory to accepted/recommended.

## Residual risks and interpretation limits

- A deterministic simulator can expose pacing and sensitivity but cannot determine enjoyment, retention, clarity, or real player behavior. Representative action policies are explicit hypotheses, not telemetry.
- Candidate results depend on their archetypes, horizons, and policies. A favorable result under one policy is not production approval.
- Exact JavaScript Float64 and local-midnight semantics require a pinned execution environment and time-zone declaration. The manifest records them; cross-environment differences fail rather than silently tolerating drift.
- The in-memory production probe depends on exact unique instrumentation anchors. Artifact drift fails closed and requires review.
- The accepted Web Storage no-compare-and-swap residual risk remains unchanged because Phase 10B-1 performs no production persistence.
- Phase 10B-1 does not resolve claim consolidation, broader bad-luck protection, schema 11, fresh-save rebalance, roster hook activation, selected upgrade growth, selected starting Gold, selected saturation curves, or live-economy tuning.

## Do-not-break note

Phase 10B-1 establishes trustworthy measurement before changing the economy. It must leave every player, save, production byte, and released outcome untouched while making later balance drift visible. Production helper extraction and all balance activation belong only to a separately approved Phase 10B-2 contract after this independent oracle has passed.
