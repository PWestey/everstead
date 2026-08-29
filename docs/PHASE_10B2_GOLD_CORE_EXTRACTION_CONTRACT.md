# EVERSTEAD — PHASE 10B-2 GOLD CORE EXTRACTION CONTRACT

## Status

**CONTRACT DRAFT — IMPLEMENTATION AND RELEASE PENDING.**

This document authorizes no production edit by itself. Implementation may begin only from the exact authority below, after this contract is committed alone and the required predecessor traces are frozen while the production artifact is still byte-identical to the base.

## Authority and immutable base

- Implement from exact clean Phase 10B-1 sealed evidence commit `fff84f7dfe87b23040edaa31f07f5f3c9181babf`.
- The accepted Phase 10B-1 executable package is commit `b12395292f7bbdbaa37ef119ff1a96f2ce488775`.
- The accepted Phase 10B-1 contract is commit `723492b1e968407f23c7d78deabf66813f14c229`; its exact contract SHA-256 is `0804717ecb383e779de9ea2801cb71726280b86b9ae1f41021fc8fbb17bbfb86`.
- The accepted Phase 10A evidence base is `d9c3862f09b7ce702db6985a0ebe569a31edec4b`; its accepted production commit is `9d82db565ff482a3898e68bd8a6dce8505a9bfe9`.
- The accepted production artifact is `index.html`, exact SHA-256 `717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed`, exact byte length 18,916,682, with five embedded assets and embedded-asset aggregate SHA-256 `26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a`.
- The sealed Phase 10B-1 frozen report remains SHA-256 `5d7e0f0b81d8e9362e15031480c363f80ee098ef7c7d2deef69c35db7f448e51`, exact byte length 94,974,300, with 210,773 exact Float64 wrappers. Its report identity is `d763aeb9cf263b007731b1a8cb2003da7b64978e927bed21368921b4a8c758be`.
- The sealed Phase 10B-1 golden, row registry, scenario registry, independent reference, and production probe remain exact SHA-256 `64bc6626fbde3142e41768500041e0aa27237db3dad9946a6f69bde582620e10`, `6f5ddf032a155e3c4c4ca1712dcdca28e8288e7e7bb906561e06cd2f6262c8be`, `89b2a717058e64f533aeafe8fa0c64df02de3d278b98a3f7269eb814c430e8d0`, `831dd6d72461922ce1e2957107af185032fcc456ebc04aac7e08e3423d90eb62`, and `a36fcd800a1199570996c9ca05d0674f47df33b8e4151669b7faf0df3425f600` respectively.
- `EVERSTEAD — LOCKED CORE DESIGN v1.0`, Drive file `1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg`, exact verified revision `AIroW34MYqUcG6Q-iOW_AtHMqmrwGj9Nb9AFMEEqxselBNLMox14pJzqh11nWmvHfp6LI-QdrsXi6ruy1TNJJQXiXzh4BgLMN-zh7XtA8-I`, remains product authority.
- `EVERSTEAD — IMPLEMENTATION ROADMAP v1.0`, Drive file `1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900`, exact verified revision `AIroW37XK-kLSvIWAi8bvi_c0B1TCCOIJCp93RQrxiAF8JmMMvgT0A9vnlZGdeAKQ_hSs674e9BNw9beXDa6RApDYcpXuZexshqiy4pvM_U`, remains roadmap authority.
- `CURRENT_SCHEMA_VERSION` remains exactly 10. The exact twelve protected storage slots remain the complete persistence authority.

Any mismatch in these identities is a blocker. The implementation must not change production or evidence to make a mismatched base conform.

## Objective

Extract only the accepted, pure Gold read-path arithmetic into one private frozen inline kernel while preserving every observable production result, state transition, error, call site, output shape, persistence byte, and startup boundary.

The extraction creates one auditable production formula owner for later work. It does not tune the economy, activate an advisory candidate, change a schema, consolidate a claim, or introduce a reusable public application API.

Success means that, for every accepted schema-10 state and fixed clock covered by the permanent gates:

1. the existing declarations perform the same state and definition lookups as before;
2. the private kernel performs only the exact arithmetic named in this contract;
3. direct-kernel, preserved-wrapper, independent-reference, and frozen-predecessor results are exactly equal, including Float64 identity and key order where applicable;
4. all twelve storage slots and exported schema-10 bytes are identical for equivalent actions; and
5. no production behavior outside the allowed source windows changes.

## Exact finite scope

### Extract into the private kernel

Only these operations are in scope:

1. Family Building-bonus arithmetic after assignment, Family state, specialty, and configuration values have already been selected by the existing wrapper;
2. normalization of one already-looked-up neutral economy-hook value;
3. Building upgrade-cost arithmetic;
4. Building rate-component arithmetic after Building, state, Oath-day, Family-assignment, and configuration lookup;
5. exact `rate × duration / 3600000` Gold arithmetic for one Building line and one segment;
6. canonical ordered reduction of the four Building rates; and
7. final ordered reduction of the four accumulated offline Building line totals followed by the single `pendingBefore + total` addition.

### Keep in the existing declarations

The following responsibilities remain in their current declarations and are not kernel responsibilities:

- Building, Family, state, and configuration lookup;
- `familyBuildingAssignment` and its returned definition-object identity;
- current-day Oath selection through `dayKey(runtimeDate(at))`;
- local `Date` behavior, Phoenix/local-midnight segmentation, and `nextLocalMidnight`;
- offline elapsed selection, rollback handling, the 24-hour cap, segment construction, line identities/names, summary eligibility, timestamp validity, and `nextLastGoldAt`;
- every existing wrapper name, parameter default, call-time default evaluation, external call site, thrown error class/message, return key order, and return shape.

`offlineClaimPreview` may delegate only the per-line duration arithmetic and the final four-line reduction/pending addition. Its clock, cap, segmentation, object construction, and state interpretation stay local and structurally recognizable.

### Explicit exclusions

Phase 10B-2 must not extract, duplicate, reorganize, activate, or change:

- Fellow or Companion Power, Power ownership, transfers, Bonds, Might, Mastery, or any roster economy curve;
- Fellow or Companion Campaign efficiency, costs, gates, state machines, rewards, histories, or receipts;
- stable RNG, Family drop recipients, Family drop settlement, Gifts, shards, ordinals, droughts, or pity;
- EXP, level, rarity, Player Rank, progression, or thresholds;
- Relics or Relic Stones;
- Companion Tower or Fellow Expedition preview, settlement, consumption, claims, histories, rewards, or clocks;
- `accrue`, `collectGold`, `canonicalPendingCollection`, claim routing, or Claim All/consolidation work;
- schema 11, migration, checkpoints, receipts, export, safe reset, staging, recovery, storage events, save validation, or any persistence coordinator behavior;
- starting resources, Building values, Oath values, Family values, costs, caps, rounding, order, or other balance decisions;
- production UI, CSS, navigation, diagnostics, telemetry, feature flags, QA bridge, runtime adapters, or public routes;
- embedded assets, namespace, branding, formatting, minification, or unrelated cleanup; and
- an external script, ES module, import, request, generated production file, bundler, transpiler, or production build step.

## Production topology and allowed source windows

`index.html` remains the only production file and remains directly runnable. The accepted production diff is restricted to exactly seven source windows:

1. one private kernel insertion immediately before the exact unique `const RUNTIME_INPUT=` anchor; and
2. the bodies only of these six existing declarations:
   - `familyBuildingBonusComponents`;
   - `economyHookBonus`;
   - `buildingUpgradeCost`;
   - `buildingRateComponents`;
   - `totalRate`; and
   - `offlineClaimPreview`.

The following declarations must remain byte-exact, including their hoisted function-declaration form:

- `familyBuildingAssignment`; and
- `buildingRate`; and
- `nextLocalMidnight`.

Every external call site of the six delegated wrappers remains byte-exact. Their function names, parameter lists, default expressions, and call-time evaluation remain exact. Their returned public objects retain exact own-key order and array order. Their existing errors remain exact for canonical, boundary, and frozen refusal traces. `buildingRate(id){return buildingRateComponents(id).rate}` remains byte-exact rather than becoming a seventh delegation window.

The source-diff gate must parse the preimage and candidate and fail if a changed byte occurs outside those seven windows. A textual or line-count approximation is insufficient. The five embedded assets must remain byte-identical and retain their aggregate SHA-256.

### Exact additive package topology

Phase 10B-2 may add only the following owned evidence files in addition to the one allowed `index.html` production edit:

- `docs/PHASE_10B2_GOLD_CORE_EXTRACTION_CONTRACT.md`;
- `docs/PHASE_10B2_EXECUTION.md`;
- `docs/PHASE_10B2_RESULT.md`;
- `qa/phase-10b2/README.md`;
- `qa/phase-10b2/build-contract.mjs`;
- `qa/phase-10b2/current-manifest.json`;
- `qa/phase-10b2/checksums.sha256`;
- `qa/phase-10b2/index.html`;
- `qa/phase-10b2/realm.html`;
- `qa/phase-10b2/realm.js`;
- `qa/phase-10b2/runner.js`;
- `qa/phase-10b2/scenarios.json`;
- `qa/phase-10b2/predecessor-traces.json`;
- `qa/phase-10b2/row-registry.json`;
- `qa/phase-10b2/reference-model.mjs`;
- `qa/phase-10b2/production-probe.mjs`;
- `qa/phase-10b2/verify.mjs`;
- `qa/phase-10b2/regress-phase-10b1.mjs`; and
- `qa/phase-10b2/phase10b1-successor-hashes.json`.

The new checksum file lists the other exact 19 owned files: the three Phase 10B-2 docs, production `index.html`, and the fifteen Phase 10B-2 QA files other than `checksums.sha256`. No accepted report or golden is duplicated. Phase 10B-1's frozen golden/report remain the read-only semantic authority.

## Private frozen kernel

### Placement and initialization boundary

The kernel is one lexical `const`, named `PHASE_TEN_B_TWO_GOLD_CORE`, inserted immediately before `const RUNTIME_INPUT=`. It is initialized synchronously without consulting `window`, `globalThis`, the DOM, a clock, storage, a runtime adapter, a listener, a timer, the network, or mutable application state.

Its initialization ends with a literal exact-surface guard. The guard checks exact own-key count, order, names, data-property descriptors, function types, frozen methods, and frozen surface. A mismatch throws before evaluation reaches `RUNTIME_INPUT`. Live and VM gates must prove a deliberately corrupted shape fails with zero runtime-adapter, storage, listener, UI, timer, and network activity.

The kernel is private. It is not assigned to `window` or `globalThis`, made enumerable through another object, added to the QA bridge, exposed through diagnostics, or reachable through a production UI action. Test instrumentation may expose it only in an isolated in-memory source transform after verifying exact unique anchors and proving byte-exact restoration.

### Exact ordered surface

`Reflect.ownKeys(PHASE_TEN_B_TWO_GOLD_CORE)` must equal this exact ordered list and no other key:

1. `familyBuildingBonus`
2. `neutralHookBonus`
3. `buildingUpgradeCost`
4. `buildingRateComponents`
5. `durationGold`
6. `totalRate`
7. `offlineTotals`

Each of the seven values is a frozen arrow function declared so its inferred exact `name` equals its surface key and its exact `length` is 1. Each is nonconstructible, has no own `prototype`, and throws `TypeError` when used with `new` or `Reflect.construct`. Each surface property is an own enumerable data property with exact descriptor `{value:<that function>,writable:false,enumerable:true,configurable:false}`. After freezing, each function's `name` and `length` descriptors are nonwritable and nonconfigurable, `Object.isFrozen(function)` is true, and `Object.isFrozen(PHASE_TEN_B_TWO_GOLD_CORE)` is true. No method closes over `S`, runtime adapters, wrapper functions, mutable definitions, mutable configuration objects, or any other mutable closure state.

### Input authority and outputs

The kernel receives explicit scalar or exact plain-record inputs assembled by the existing wrappers. It cannot perform definition or state lookup. There is no blanket rejection of non-finite, negative-zero, or greater-than-safe-integer values: each method owns the exact compatibility domain below.

Except for `neutralHookBonus`, a record method requires a non-null ordinary record whose prototype is exactly `Object.prototype`, whose `Reflect.ownKeys` equal the documented string keys in exact order, and whose fields are own enumerable data properties rather than accessors. A record with a missing, foreign, symbol, inherited/custom-prototype, accessor, or reordered field fails before arithmetic. An array field must have prototype exactly `Array.prototype`, exact length four, exact own keys `0`, `1`, `2`, `3`, `length`, four present data elements, and no symbol, sparse position, accessor, or extra property. Frozen literal records/arrays remain valid; writability and configurability of input data descriptors are not required.

Every truly invalid record, field, array, intermediate, or output throws exact `TypeError` text `PHASE_TEN_B_TWO_GOLD_CORE.<method>: invalid <path>`. Paths use `$input`, `$input.<field>`, `$input.<field>[<index>]`, or `$output.<field>`. Validation reports the first invalid path in documented field/element/evaluation order. A non-finite arithmetic intermediate or output is an overflow refusal at its exact `$output` path using the same `TypeError` format. Validation is bounded: array methods inspect exactly four positions and no method has an input-sized loop.

The exact method contracts are:

#### `familyBuildingBonus(input)`

Exact input order:

`assigned`, `intimacy`, `rarity`, `specialtyMatch`, `base`, `intimacyRate`, `intimacyCap`, `rarityRate`, `specialtyAmount`, `cap`.

- `assigned` and `specialtyMatch` are literal booleans.
- `intimacy` accepts every finite value in `[0, Number.MAX_SAFE_INTEGER]`, explicitly including `-0`; the exact `-0` Intimacy result is compatibility authority. The assigned form requires integer rarity 1 through 5. The unassigned form requires rarity zero.
- `base`, `intimacyRate`, `intimacyCap`, `rarityRate`, `specialtyAmount`, and `cap` are finite canonical nonnegative numbers no greater than 1 and are not `-0`; `base`, `intimacyCap`, `rarityRate`, and `specialtyAmount` cannot exceed `cap`. Arithmetic preflights use exact paths `$output.intimacyBonus`, `$output.rarityBonus`, `$output.specialtyBonus`, `$output.uncappedBonus`, `$output.bonus`, and `$output.multiplier`.
- The unassigned form requires Intimacy zero, rarity zero, `specialtyMatch` false, and returns neutral arithmetic.
- Exact assigned arithmetic is:
  - `baseBonus = base`;
  - `intimacyBonus = Math.min(intimacyCap, intimacy * intimacyRate)`;
  - `rarityBonus = rarityRate * (rarity - 1)`;
  - `specialtyBonus = specialtyMatch ? specialtyAmount : 0`;
  - `uncappedBonus = baseBonus + intimacyBonus + rarityBonus + specialtyBonus` in that order;
  - `bonus = Math.min(cap, uncappedBonus)`; and
  - `multiplier = 1 + bonus`.
- The unassigned form returns exact zeros through `bonus` and exact multiplier one.
- Exact output order is `baseBonus`, `intimacyBonus`, `rarityBonus`, `specialtyBonus`, `uncappedBonus`, `bonus`, `multiplier`.

#### `neutralHookBonus(value)`

Accepts any JavaScript value without throwing, including `undefined`, `null`, booleans, strings, symbols, objects, functions, `NaN`, positive/negative `Infinity`, negative numbers, `-0`, and `+0`. It returns `value` only when `typeof value === 'number'`, `Number.isFinite(value)`, and `value > 0`; every other value returns canonical positive zero. In particular, `Object.is(neutralHookBonus(-0),+0)` is true and `Object.is(neutralHookBonus(-0),-0)` is false. Configuration-name lookup remains in `economyHookBonus`.

#### `buildingUpgradeCost(input)`

Exact input order: `base`, `growth`, `level`.

`base` is finite, greater than zero, and no greater than `Number.MAX_SAFE_INTEGER`; `growth` is finite and greater than zero; and `level` is finite in `[1,52]`, including accepted noninteger levels but excluding `-0`. The kernel preflights `Math.pow(growth, level - 1)` at `$output.power`, the subsequent product at `$output.unroundedCost`, and the rounded result at `$output.cost`; the final result must be a nonnegative safe integer. It returns exactly `Math.round(base * Math.pow(growth, level - 1))`. It neither decides whether an upgrade is available nor reads the Building cap; the literal upper domain merely matches the accepted schema-10 Building-state boundary.

#### `buildingRateComponents(input)`

Exact input order:

`base`, `level`, `levelGrowth`, `familyAssignmentMultiplier`, `fellowRosterBonus`, `companionRosterBonus`, `overallDayBonus`, `oathBoost`.

`base` is finite in `[0,Number.MAX_SAFE_INTEGER]`; `level` is finite in `[1,52]`; `levelGrowth` is finite and greater than zero; `familyAssignmentMultiplier` is finite and at least 1; each roster/day bonus is finite and nonnegative; and `oathBoost` is finite in `[0,0.30]`. These fields reject `-0` except that an exact positive zero is valid wherever zero is permitted. Preflights use the exact returned paths `$output.levelMultiplier`, `$output.fellowRosterMultiplier`, `$output.companionRosterMultiplier`, `$output.overallDayMultiplier`, `$output.characterEconomyMultiplier`, `$output.oathMultiplier`, and `$output.rate`; every value must remain finite/nonnegative and the final rate cannot exceed `Number.MAX_SAFE_INTEGER`.

Exact arithmetic and grouping are:

1. `levelMultiplier = Math.pow(levelGrowth, level - 1)`;
2. `fellowRosterMultiplier = 1 + fellowRosterBonus`;
3. `companionRosterMultiplier = 1 + companionRosterBonus`;
4. `overallDayMultiplier = 1 + overallDayBonus`;
5. `characterEconomyMultiplier = familyAssignmentMultiplier * fellowRosterMultiplier * companionRosterMultiplier * overallDayMultiplier` from left to right;
6. `oathMultiplier = 1 + oathBoost`; and
7. `rate = base * levelMultiplier * characterEconomyMultiplier * oathMultiplier` with Oath last.

Exact output order is `levelMultiplier`, `fellowRosterMultiplier`, `companionRosterMultiplier`, `overallDayMultiplier`, `characterEconomyMultiplier`, `oathMultiplier`, `rate`.

The wrapper remains responsible for Oath-day selection and its existing lower/upper clamps before calling the kernel.

#### `durationGold(input)`

Exact input order: `rate`, `durationMs`.

`rate` is finite in `[0,Number.MAX_SAFE_INTEGER]`; `durationMs` is finite in `[0,86400000]`; and both reject `-0` while accepting canonical `+0`. The exact `rate * durationMs` intermediate at `$output.product` and division result at `$output.value` must remain finite and nonnegative. The method returns exactly `rate * durationMs / 3600000`, with no rounding, integer surrogate, decimal library, reassociation, or tolerance.

#### `totalRate(input)`

Exact input order: `orderedRates`.

`orderedRates` is a dense exact four-element array assembled by iterating `BUILDING_DEFS` in its existing canonical order. Each value is finite, nonnegative, no greater than `Number.MAX_SAFE_INTEGER`, and not `-0`. Each of the four left-to-right additions is preflighted finite and nonnegative at `$output.total`. The kernel returns `orderedRates.reduce((sum, value) => sum + value, 0)` with no sort, rounding, compensation, or reassociation.

#### `offlineTotals(input)`

Exact input order: `orderedLineTotals`, `pendingBefore`.

`orderedLineTotals` is the dense exact four-element array of already-accumulated per-Building line totals in canonical `BUILDING_DEFS` order. Each line total is finite, nonnegative, and not `-0`. `pendingBefore` accepts every finite number greater than or equal to zero, explicitly including `-0` and values greater than `Number.MAX_SAFE_INTEGER`. It is not subjected to a safe-integer or safe-magnitude restriction. Each ordered line addition and the final pending addition are preflighted finite and nonnegative at `$output.total` or `$output.pendingAfter`; only a combination whose actual result would overflow to a non-finite value refuses. The kernel first performs exactly `orderedLineTotals.reduce((sum, value) => sum + value, 0)` and then exactly `pendingBefore + total` once. Exact output order is `total`, `pendingAfter`.

The method must never accept a stream of segment values. Per-segment Gold is first accumulated into each existing Building line by `offlineClaimPreview`; only the four completed lines enter `offlineTotals`.

Canonical trace serialization preserves signed zero rather than relying on JSON. Every noninteger and every signed zero uses `{ "$float64": "<16 lowercase hex bits>", "decimal": "<canonical display>" }`; exact negative zero is `{ "$float64": "8000000000000000", "decimal": "-0" }` and exact positive zero is either integer `0` where the schema declares an integer or `{ "$float64": "0000000000000000", "decimal": "0" }` where signed Float64 identity is under test.

### Public wrapper compatibility

The existing wrappers reconstruct their exact public output objects. In particular:

- `familyBuildingBonusComponents` retains exact key order `buildingId`, `familyId`, `familyName`, `intimacy`, `rarity`, `specialty`, `specialtyMatch`, `baseBonus`, `intimacyBonus`, `rarityBonus`, `specialtyBonus`, `uncappedBonus`, `bonus`, `multiplier`, `cap`.
- `buildingRateComponents` retains exact key order `id`, `name`, `base`, `level`, `levelMultiplier`, `upgradeCost`, `familyAssignment`, `familyAssignmentBonus`, `familyAssignmentMultiplier`, `fellowRosterBonus`, `fellowRosterMultiplier`, `companionRosterBonus`, `companionRosterMultiplier`, `overallDayBonus`, `overallDayMultiplier`, `characterEconomyMultiplier`, `oathBoost`, `oathMultiplier`, `rate`, `formulaOrder`.
- `offlineClaimPreview` retains exact key order `at`, `claimStart`, `claimEnd`, `elapsed`, `total`, `lines`, `segments`, `pendingBefore`, `pendingAfter`, `opensSummary`, `timestampValid`, `nextLastGoldAt` on both neutral and advancing paths.
- `buildingRate(id)` retains its exact one-argument declaration and current default-state/current-clock behavior through `buildingRateComponents(id)`.
- `totalRate(state=S,at=runtimeNow())` retains exact call-time defaults and canonical `BUILDING_DEFS` order.

No wrapper may cache the clock, state, assignment, definition, or configuration earlier than its current evaluation point. No wrapper may clone a Family definition returned by `familyBuildingAssignment`.

## Float64 and arithmetic-order authority

JavaScript Float64 behavior is part of the accepted product contract. Equality is exact binary identity, including values represented by Phase 10B-1 `{ $float64, decimal }` wrappers. No epsilon, display rounding, milligold conversion, integer scaling, compensated sum, algebraic simplification, or reassociation may become the oracle.

Offline Gold must retain the accepted grouping:

1. segment by local midnight in the existing wrapper;
2. for each segment, compute each Building value as `rate * duration / 3600000`;
3. accumulate segment values into four separate Building line totals;
4. reduce the four completed line totals once in canonical Building order; and
5. perform `pendingBefore + total` once.

The permanent gate must include the sealed Phase 10B-1 one-ULP discriminator whose accepted production grouping yields `676311.4679999998`, Float64 bits `4124a3aeef9db22b`. The formerly rejected regrouping yields `676311.4679999996`, exact Float64 bits `4124a3aeef9db22a`, and must fail.

The exact comparator recursively checks type, `Reflect.ownKeys` count/order, missing or extra keys, array density and order, and Float64 bits through `Object.is`/bit encoding before considering display text. Its frozen negative controls must prove rejection of a one-ULP candidate, `+0` substituted for `-0` and `-0` substituted for `+0`, a missing key, an extra key, reordered object keys, a sparse array, and an accessor-backed array element. Each negative control mutates only a cloned candidate observation while the frozen predecessor/reference inputs and expected outputs remain immutable. No comparator negative control may modify the authority side or a shared fixture.

## Predecessor trace authority

Before any edit to `index.html`, Phase 10B-2 must freeze exactly 32 literal predecessor traces from the exact base artifact. They are reviewed expected data, not regenerated during ordinary verification. Their exact allocation is:

| Operation | Traces |
| --- | ---: |
| Family Building bonus | 6 |
| Neutral hook normalization | 2 |
| Building upgrade cost | 4 |
| Building rate components | 8 |
| Rate × duration Gold | 4 |
| Canonical total-rate reduction | 3 |
| Offline line reduction and pending addition | 5 |
| **Total** | **32** |

The set includes unassigned/assigned Family cases, Intimacy/rarity/specialty/cap and accepted `-0` Intimacy boundaries; the two reachable wrapper neutral-hook results (one canonical configured zero and one missing-name/`undefined` fallback); upgrade rounding and high-level boundaries; eight Oath/no-Oath, Family, level, and multiplier-order Building cases; zero/partial/full-day duration; canonical four-rate reduction; zero/nonzero/fractional/`-0`/greater-than-safe pending Gold; local-midnight multi-segment lines; 24-hour cap output; and the exact one-ULP discriminator. A positive neutral-hook result is covered by direct numeric/operator rows, not by a four-lane wrapper trace, because the released frozen `ECONOMY_CONFIG.neutralHooks` makes that wrapper path unreachable.

Each trace freezes a literal immutable fixture; exact wrapper selector name and argument list; fixed clock when applicable; exact predecessor full-wrapper return or thrown error; a literal arithmetic input assembled from the fixture without consulting any core/candidate output; exact arithmetic projection; expected ordered kernel-call records; aggregate per-method call counts; canonical decimal display; exact Float64 bits for every noninteger or signed zero; source base identity; and a human-reviewed formula note. Each expected call record contains its ordinal, exact method name, and exact argument value. Candidate instrumentation captures the actual method, arguments, ordinal, and count and compares them exactly; it cannot derive the expected calls from the candidate kernel.

The literal wrapper selectors and arithmetic projections are fixed by operation:

| Operation | Base/candidate wrapper selector | Exact arithmetic projection |
| --- | --- | --- |
| Family Building bonus | `familyBuildingBonusComponents(buildingId,state)` | ordered `baseBonus`, `intimacyBonus`, `rarityBonus`, `specialtyBonus`, `uncappedBonus`, `bonus`, `multiplier` |
| Neutral hook | `economyHookBonus(name)` | scalar normalized bonus |
| Upgrade cost | `buildingUpgradeCost(level)` | scalar integer cost |
| Building rate | `buildingRateComponents(buildingId,state,at)` | ordered `levelMultiplier`, `fellowRosterMultiplier`, `companionRosterMultiplier`, `overallDayMultiplier`, `characterEconomyMultiplier`, `oathMultiplier`, `rate` |
| Duration Gold | `offlineClaimPreview(at,state)` | scalar selected by literal `segmentIndex` and `buildingId` from `segments[segmentIndex].values[buildingId]` |
| Total rate | `totalRate(state,at)` | scalar total rate |
| Offline totals | `offlineClaimPreview(at,state)` | ordered `total`, `pendingAfter` |

The predecessor selector executes against exact base `fff84f7dfe87b23040edaa31f07f5f3c9181babf`; its complete return, not merely the projection, is frozen. The candidate selector executes the same literal method, arguments, state, and clock, and its complete return must equal the predecessor return exactly. The independent reference and direct kernel each compare only the exact arithmetic projection appropriate to that operation. Direct-kernel inputs come from the literal trace field; they are never copied from the candidate wrapper's captured call, projection, or result.

The exact four rows for every trace are: frozen predecessor full-return/projection integrity; independent-reference projection parity; candidate full-wrapper parity plus exact call record/count; and direct-kernel projection parity. The frozen predecessor and independent reference are expected authorities. The kernel and preserved wrapper are candidate observations; agreement between those two observations cannot establish correctness.

Ordinary verifier, browser, build, manifest, and checksum commands may read but cannot write the traces. A candidate generator must require an explicit nonaccepted path and refuse overwrite.

## Truth layers and anti-tautology

The gate uses two expected authorities and two separately observed candidate paths:

1. **Expected authority — literal predecessor trace:** frozen before the production edit and reviewed as expected full-wrapper data plus exact arithmetic projections.
2. **Expected authority — independent reference:** a separately implemented pure arithmetic model with its own literal constants and structurally different formula organization. It may share only canonical serialization and comparison utilities.
3. **Candidate observation — direct private-kernel probe:** an in-memory source transform of the exact candidate artifact that exposes only the seven private methods in a fresh realm after verifying exact unique anchors.
4. **Candidate observation — preserved public wrapper:** the candidate's existing declaration invoked through the literal selector facade with explicit state and fixed clock.

No expected calculation may call the kernel, a wrapper, production configuration, a production fixture builder, or production output. The kernel and reference may not share formula functions, configuration objects, input builders, reducers, or mutation switches. Wrapper parity cannot serve as proof of the kernel if both sides consume the same already-computed result object.

The production probe must verify the candidate artifact hash and byte length before decoding/evaluation, preflight every instrumentation anchor exact-once, replace only the unique boot tail in memory, prohibit string/Wasm code generation, and prove that removing instrumentation restores the exact candidate bytes. It suppresses production boot, adapters, persistence, listeners, UI, timers, and network. Exact native storage and all inherited Phase 6/7/9 QA hooks remain unavailable.

Every mutation subcase has a passing control, applies one genuine nonthrowing candidate-only input or implementation defect, reruns the ordinary comparator or invariant against immutable frozen/reference inputs, and asserts the exact expected failure class and stable field path. Synthetic edits to completed authority results, expected throws, shared expected/candidate mutation, and self-comparison do not count. Rows 1–47 each own one isolated defect; row 48 intentionally owns four separately executed isolated structural subcases. Thus the exact 48 mutation rows execute exactly 51 one-defect subcases without changing the row total.

## Exact focused acceptance gate

The permanent Phase 10B-2 focused CLI verifier contains exactly 400 unique ordered rows:

| Category | Exact rows | Required coverage |
| --- | ---: | --- |
| Static/startup integrity | 32 | Base/candidate/assets; exact diff windows; frozen surface; pre-runtime shape guard; private/no export; no external module/request/build; schema/slot authority |
| Numeric/operator parity | 96 | Exact formulas, grouping, boundary values, output order, direct kernel/reference equivalence, Float64 discriminators |
| Frozen predecessor traces | 128 | Exact 32 traces × four rows: two expected authorities and two candidate observations |
| Fail-closed/persistence | 96 | Direct input authority, bounded refusal, ambient isolation, wrapper errors, no-write, schema-10 and twelve-slot byte equivalence |
| Mutation sensitivity | 48 | Exact genuine defects listed below |
| **Total** | **400** | Exact count, IDs, order, categories, and registry identity |

The row registry freezes all 400 IDs and their category. Verification requires equality, never `>= 400`. The verifier snapshots every owned input/output and every accepted predecessor file before and after execution and writes only to standard output.

### Numeric/operator allocation

The 96 numeric/operator rows are exactly:

| Arithmetic family | Rows |
| --- | ---: |
| Family Building bonus | 20 |
| Neutral hook normalization | 8 |
| Building upgrade cost | 12 |
| Building rate components | 24 |
| Rate × duration Gold | 8 |
| Canonical total-rate reduction | 8 |
| Offline line reduction/pending addition | 16 |
| **Total** | **96** |

### Fail-closed/persistence allocation

The 96 rows are exactly:

| Boundary | Rows |
| --- | ---: |
| Kernel exact-shape/type/order/value refusal | 32 |
| Startup guard and zero side effects | 16 |
| Wrapper signatures/defaults/errors/output order | 16 |
| Schema-10, twelve-slot, export, revision, and recovery equivalence | 16 |
| Probe/browser/build/no-write isolation | 16 |
| **Total** | **96** |

Direct refusal covers the exact structural defects and per-method field/range/overflow boundaries defined above; it does not impose one shared numeric policy. Boundary-valid controls at, below, and above relevant thresholds must prove that Family Intimacy `-0` is accepted, `neutralHookBonus` accepts every value and canonicalizes all nonpositive/non-finite/non-number inputs to `+0`, and `offlineTotals.pendingBefore` accepts finite `-0` and finite values above `Number.MAX_SAFE_INTEGER`. Negative-zero refusal is asserted only for fields whose exact method domain excludes it. A refusal produces the exact method/path `TypeError`, no partial output, and no application, persistence, adapter, listener, UI, timer, or network effect.

### Exact mutation-sensitivity set

The exact 48 required mutations are:

1. Family base bonus omitted;
2. Family Intimacy rate changed;
3. Family Intimacy cap removed;
4. Family cap is applied before the Intimacy multiplication;
5. Family rarity offset changed from `rarity - 1`;
6. Family rarity rate changed;
7. Family specialty match inverted;
8. Family specialty amount changed;
9. Family uncapped addition order changed;
10. Family aggregate cap removed or moved;
11. Family multiplier omits the leading one;
12. unassigned Family path applies a bonus;
13. neutral hook uses `>= 0` and preserves `-0` instead of returning canonical `+0`;
14. neutral hook returns a negative numeric input instead of canonical `+0`;
15. neutral hook returns a non-finite numeric input instead of canonical `+0`;
16. neutral hook positive value is replaced by zero;
17. upgrade base changed;
18. upgrade growth changed;
19. upgrade exponent changed from `level - 1`;
20. upgrade uses wrong grouping `Math.round(base * Math.pow(growth, level) - 1)` instead of the accepted exponent/grouping;
21. upgrade `Math.round` removed or replaced;
22. Building level growth changed;
23. Building level exponent changed;
24. Fellow roster leading-one multiplier omitted;
25. Companion roster leading-one multiplier omitted;
26. overall-day leading-one multiplier omitted;
27. Family multiplier moved or duplicated;
28. character multiplier left-to-right grouping changed;
29. Oath leading-one multiplier omitted;
30. Oath moved before character multiplication;
31. Building base omitted or duplicated;
32. Building rate rounded;
33. duration divisor changed from 3,600,000;
34. duration multiplication/division reassociated;
35. duration result rounded;
36. zero-duration result made nonzero;
37. total-rate reduction initial value changed;
38. total-rate canonical order changed;
39. total-rate term omitted or duplicated;
40. total-rate result rounded or compensated;
41. offline segment values accumulated directly into pending;
42. offline per-Building line accumulation order changed;
43. offline four-line canonical order changed;
44. offline line total omitted or duplicated;
45. pending added before the final line reduction;
46. offline total or pending result rounded;
47. preserved wrapper bypasses the private kernel; and
48. kernel surface is exported, mutable, ambient-state-dependent, or shape-guarded after runtime initialization.

Mutation row 48 contains four separately executed and separately reported one-defect subcases for surface export, method/surface mutability, ambient `S`/clock access, and guard relocation; every subcase must fail the same fixed row without increasing the exact 48-row total. Together with the 47 other rows, the mutation category therefore runs exactly 51 isolated subcases.

## Persistence and no-observable-change contract

The extraction adds no state, key, slot, schema field, migration, receipt, revision rule, or serialization rule. The exact schema-10 validator and all twelve protected storage keys remain byte-identical.

For frozen fresh, migrated, safe-reset, maximum-valid, offline-zero, offline-advancing, cross-midnight, capped-24-hour, fractional-pending, and persistence-fault fixtures, execute the same fixed-clock action against base and candidate in isolated adapters. Compare:

- return value and thrown error class/message;
- cloned runtime state and all observable UI state;
- exact active raw save bytes and revision;
- every one of the twelve protected slot keys and values;
- staging/recovery disposition and notice category;
- export bytes and schema version; and
- storage read/write/remove log and ordering.

Every comparison is byte-exact. No normalization may conceal a difference. The extraction must not cause an additional save, revision, storage read/write, listener, timer, random draw, DOM mutation, or network request.

## Phase 10B-1 semantic and byte successors

### Exact semantic successor

Run an additive Phase 10B-1 semantic-successor verifier containing exactly 624 rows with the same stable semantic categories and vector allocations as the sealed gate: 20/40/96/240/144/60/24. Exactly four static rows receive reviewed Phase 10B-2 successor expectations:

- `static-artifact-sha` expects the sealed Phase 10B-2 candidate SHA-256;
- `static-artifact-bytes` expects the sealed Phase 10B-2 candidate byte length;
- `static-production-unchanged` is replaced by an exact allowed-seven-window extraction assertion with unchanged embedded assets and no observable semantic change; and
- `static-production-probe-identity` expects the additive Phase 10B-2 candidate probe and exact restoration identity.

The other 620 row meanings, IDs, order, category allocation, fixtures, expected values, and failure semantics remain exact. All 240 released outputs remain the frozen Phase 10B-1 literal outputs and are recomputed through the additive candidate production probe; none is regenerated from the extracted kernel or wrapper. All 144 frozen advisory report bundles remain byte-exact. The successor adds no tolerance, skip, majority vote, or candidate-derived expected value.

The sealed `qa/phase-10b/` package remains byte-identical. The successor imports or snapshots it read-only and cannot rewrite its golden, report, scenarios, registry, reference, probe, manifest, or checksum file.

### Exact byte successor

The byte-successor gate contains exactly 225 rows:

- 224 accepted predecessor files remain byte-exact; and
- one explicit `index.html` supersession row verifies the old SHA-256 and byte length, the new reviewed SHA-256 and byte length, the exact allowed production windows, and the unchanged five-asset aggregate.

The predecessor map is literal and reviewed. It does not trust mutable checksum expectations from the candidate package.

### Checksums

- The sealed Phase 10B-1 checksum file must report exactly 21/22, with only `index.html` superseded. All other 21 entries pass.
- The new Phase 10B-2 checksum file must report exactly 19/19 twice on the final candidate.
- A checksum or manifest builder may write only the new manifest and checksum files, only when explicitly invoked, and never rewrite predecessor traces, goldens, reports, registries, or production.

### Manifest and evidence-cycle authority

`current-manifest.json.packageCommit` is the exact reviewed executable tip containing the production extraction and immutable executable QA package. It is not the current metadata/evidence commit and does not change during an allowed metadata-only seal. The builder requires that exact package commit as explicit reviewed input and fails closed on a mismatch; it does not derive or hash a dynamic `HEAD` value into an owned-input identity.

The manifest does not hash `checksums.sha256`, itself, or a dynamic Git ref. `checksums.sha256` does not hash itself. The manifest's executable-owned aggregate covers the exact production artifact, embedded assets, predecessor traces, row registry, scenarios, independent reference, production probe, focused/successor verifiers, and live executable files; it excludes only `docs/PHASE_10B2_EXECUTION.md`, `docs/PHASE_10B2_RESULT.md`, `qa/phase-10b2/current-manifest.json`, and `qa/phase-10b2/checksums.sha256`, whose metadata-only evolution is separately bounded and checksummed.

When invoked after evidence has been recorded, the builder recomputes the executable-owned aggregate before writing. If it is byte-identical, the build preserves already sealed review/live/public evidence fields while updating only authorized metadata and checksums. If it differs for any reason, the build fails closed or explicitly resets the manifest/result to `PENDING`, clears prior PASS attestations and published-smoke claims, and requires the complete gate and two reviews again. It must never carry PASS evidence across an executable aggregate change.

After the executable tip is frozen, metadata-only post-review/live and post-public seal commits are authorized to touch exactly these four files and no others: `docs/PHASE_10B2_EXECUTION.md`, `docs/PHASE_10B2_RESULT.md`, `qa/phase-10b2/current-manifest.json`, and `qa/phase-10b2/checksums.sha256`. Every such seal rebuilds the checksum file, reruns focused/successor/checksum gates, preserves `packageCommit`, and records the new metadata state without a self-referential commit hash.

## Live acceptance gate

The QA-only Phase 10B-2 dashboard contains exactly 228 rows per pass:

- four runner identity/realm-completion rows; and
- 56 exact rows in each of four sandboxed realms: 320×568 normal motion, 320×568 reduced motion, 390×844 normal motion, and 390×844 reduced motion.

Run the complete 228-row gate twice on the exact reviewed candidate. Each pass must render exactly 228 unique rows, zero failures, a blank fatal field, and zero captured warning/error console entries.

Each realm verifies the candidate artifact identity, frozen kernel surface, direct-kernel/reference/wrapper traces, controls and rerendering, exact Float64 display, startup-shape failure isolation, zero native storage/save calls, zero prohibited browser APIs, same-origin immutable `GET` allowlisting with `credentials:'omit'`, no cookie send/accept path, no horizontal overflow, and no production UI route or bridge exposure.

Trap-installation failures are recorded and fail the realm. The dashboard cannot write a repository file, save slot, localStorage, sessionStorage, IndexedDB, cookie, Cache Storage, service worker, download, clipboard, beacon, WebSocket, or production namespace.

## Inherited regression gates

On one clean exact candidate tip, run each of these twice:

- frozen Phase 10A focused: exactly 369/371, with only `artifact-repair-sha` and `artifact-repair-bytes` failing because `index.html` is intentionally superseded; all other 369 rows pass;
- Phase 10A semantic predecessor/successor: 22/22;
- Phase 9 focused: 355/355; and
- Phase 8 successor: 703/703.

Also run the exact Phase 10B-2 focused 400, Phase 10B semantic successor 624, byte successor 225, Phase 10B-1 checksums 21/22 with only `index.html` superseded, and Phase 10B-2 checksums 19/19 twice. Tests must finish without writing the repository.

The two named frozen Phase 10A identity failures are required and exhaust the accepted Phase 10A focused failures. A third failure, a different failed ID, or an unexpected pass of either stale identity row fails the gate. No semantic, package, or unexpected checksum failure is acceptable.

## Implementation and evidence order

1. Freeze this contract through contract-only commit(s) rooted at exact base `fff84f7dfe87b23040edaa31f07f5f3c9181babf`; review repairs may change only this document. Record the final reviewed contract tip before any QA or production implementation.
2. While `index.html` is still byte-identical to SHA-256 `717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed`, create and independently review the exact 32 literal predecessor traces. Commit the frozen trace authority before production changes.
3. Create the additive Phase 10B-2 row registry, independent reference, production probe, focused verifier, semantic successor, byte successor, and live harness. Prove the preimage gates against the unchanged artifact.
4. Insert the kernel and change only the six allowed wrapper bodies in one focused production commit. `buildingRate`, `familyBuildingAssignment`, and `nextLocalMidnight` remain byte-exact. Do not combine production work with docs, QA, manifest, or checksum changes.
5. Freeze the executable QA package, create its exact executable `packageCommit`, and build the initial manifest/checksum with evidence `PENDING`. Run the exact focused, successor, inherited, persistence, and live gates. Correct the implementation; never weaken or regenerate an expected authority to make a candidate pass.
6. Obtain two independent read-only reviews on that same exact executable `packageCommit`: one for source boundary, startup authority, API shape, and persistence; one for arithmetic, Float64 order, anti-tautology, mutations, and inherited semantics.
7. Through an authorized metadata-only commit, freeze execution/result docs, manifest, checksums, exact artifact identity, row-registry identity, trace identity, output totals, review verdicts, and residual risks. The build preserves PASS evidence only if the executable-owned aggregate still matches the reviewed `packageCommit`; otherwise it unseals.
8. Re-run every focused, semantic successor, byte successor, inherited, and checksum gate from a clean clone of the exact metadata-sealed tip, and rerun the exact live gate twice without altering evidence.
9. Merge and publish only the reviewed sealed tip. Verify the exact public artifact hash from GitHub Pages, then run the public smokes below.
10. Record Pages identity and public-smoke evidence through one authorized metadata-only post-public seal touching only execution/result/manifest/checksum. Preserve the executable `packageCommit`, rebuild checksums, and rerun focused/successor/checksum gates. Any executable-owned aggregate change unseals the result and blocks release.

No ordinary verifier, browser run, or build-contract run may generate a golden, predecessor trace, report, or accepted expected output.

## Release and public smoke gate

Release is blocked until both independent reviews pass and every exact expected outcome is reproduced twice on the same clean tip, including the intentionally superseded Phase 10B-1 checksum row and the two explicitly named frozen Phase 10A artifact-identity rows. No other failure is permitted.

Every public smoke that can create, mutate, collect, save, export-download, reset, or otherwise write browser state runs only in a newly created disposable browser profile whose Everstead Pages origin begins with empty localStorage, sessionStorage, IndexedDB, cookies, Cache Storage, service workers, and downloads. It must never run in the user's ordinary browser profile or against an existing save. Read-only hash/network checks may run separately. After the write-capable smoke, clear and verify absence of every created origin datum, service worker, cache, and download, close the profile, and delete the disposable profile directory; record cleanup PASS in the result. A failed or incomplete cleanup fails the public gate.

After publication:

- fetch the GitHub Pages production artifact with cache bypass and prove its SHA-256 and byte length equal the sealed candidate;
- prove the five embedded assets and aggregate remain exact;
- load a fresh schema-10 save and a migrated schema-10 fixture without reset or migration;
- verify Village Building rates, total rate, zero-elapsed preview, one-hour preview, cross-midnight preview, capped 24-hour preview, fractional pending Gold, collection, reload, and export against sealed expected bytes;
- verify Oath day rollover and assigned/unassigned Family Building bonuses;
- confirm all twelve protected slots, revision behavior, and offline summary presentation are unchanged;
- confirm no new network request, module, public global, bridge method, route, control, warning, error, or horizontal overflow; and
- reload the public artifact and repeat the fixed-clock read-only Gold smokes where browser clock control is available, otherwise compare the same hand-captured boundaries through the sealed QA route.

The result document records the public URL, response identity, cache headers observed, exact public SHA-256/bytes, smoke time, browser/version, and pass/fail outcome. Public evidence cannot substitute for local exact gates.

## Rollback

The rollback authority is exact commit `fff84f7dfe87b23040edaa31f07f5f3c9181babf` and its accepted `index.html` SHA-256 `717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed`.

If any local, independent-review, merge, Pages-hash, public-smoke, persistence, Float64, or inherited-regression gate fails:

1. stop release or remove the candidate from the release branch;
2. restore the exact base artifact and Phase 10B-1 package from `fff84f7dfe87b23040edaa31f07f5f3c9181babf` through a focused reviewable revert;
3. publish only after the served artifact again matches the base hash and byte length;
4. verify the five embedded assets, schema 10, twelve protected slots, and Phase 10B-1 sealed evidence; and
5. preserve the rejected candidate and failure evidence on its review branch for diagnosis.

Rollback requires no save migration because this phase is forbidden to change schema or persisted bytes.

## Required independent reviews

Two independent reviewers must inspect the exact same executable candidate:

1. **Boundary and persistence review:** exact source windows, kernel placement/shape/freeze/privacy, startup failure before side effects, wrapper hoisting/defaults/errors/key order/call sites, schema-10 and twelve-slot byte equivalence, no-write behavior, and rollback completeness.
2. **Arithmetic and oracle review:** independent formula ownership, exact Float64 grouping, 32 predecessor traces, all 96 numeric rows, genuine 48 mutations, Phase 10B semantic parity, one-ULP discrimination, browser isolation, and absence of self-reference.

A PASS on different commits, an implementation author's self-review, or a review with unsealed expected data does not satisfy this gate.

## Residual risks and interpretation limits

- This phase improves formula ownership but deliberately keeps the production artifact single-file; it does not create a general module boundary.
- The private kernel remains source-coupled to thin wrappers and exact initialization placement. Future edits must preserve or intentionally supersede this contract and its permanent gates.
- JavaScript Float64 and local `Date` semantics remain platform-sensitive contract surfaces. Exact arithmetic is gated; real-device and Safari checks remain useful release evidence.
- The existing Web Storage no-compare-and-swap race remains unchanged. This extraction neither widens nor solves it.
- The Phase 10B-1 simulator remains a deterministic advisory model, not telemetry or a balance decision. No candidate curve, starting-resource value, growth value, schema 11 design, or claim consolidation is approved here.
- Direct private-kernel refusal semantics are a test and maintenance boundary. Production wrappers remain authoritative for valid schema-10 state and preserve their existing public errors and shapes.
- Source instrumentation depends on exact unique anchors and must fail closed on artifact drift. It is QA-only and is not a production extension point.

## Do-not-break statement

Phase 10B-2 changes ownership of a small arithmetic implementation, not Everstead behavior. It must produce the same Gold, the same Float64 bits, the same objects, the same saves, the same errors, and the same UI from the same schema-10 state and clock. Any observable difference is a failed extraction, not an acceptable migration.
