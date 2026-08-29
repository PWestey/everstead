# EVERSTEAD — PHASE 10B-1 RESULT

## Verdict

**PASS — SEALED QA/DOCS PACKAGE.** The deterministic simulator and permanent acceptance gate are accepted at exact executable package commit `b12395292f7bbdbaa37ef119ff1a96f2ce488775`. The production artifact remains unchanged.

No advisory configuration is accepted, recommended, selected, production-ready, or migration-ready. Phase 10B-2 remains deferred and requires its own contract.

## Identity boundary

- Reviewed contract tip: `723492b1e968407f23c7d78deabf66813f14c229`.
- Accepted Phase 10A evidence base: `d9c3862f09b7ce702db6985a0ebe569a31edec4b`.
- Accepted Phase 10A production commit: `9d82db565ff482a3898e68bd8a6dce8505a9bfe9`.
- Accepted production SHA-256: `717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed`.
- Accepted production byte length: 18,916,682.
- Embedded assets: five; aggregate SHA-256 `26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a`.
- Schema/protected slots: 10 / 12.
- Production changed: no.
- Accepted executable package commit: `b12395292f7bbdbaa37ef119ff1a96f2ce488775`.

## Focused candidate evidence

| Gate | Required | Current evidence |
| --- | ---: | --- |
| Phase 10B-1 focused CLI | 624/624 twice | PASS twice at exact executable tip; no-write result preserved |
| Artifact/static | 20/20 | PASS twice; exact structural and bounded-probe checks |
| Released config | 40/40 | PASS twice |
| Golden microvectors | 96/96 | PASS twice |
| Released three-way parity | 240/240 | PASS twice; all 240 production vectors passed the exact-shape probe |
| Advisory bundles | 144/144 | PASS twice; zero bad Gold, Campaign, idle-reward, duplicate, or lost-resource proofs |
| Invariants | 60/60 | PASS twice, including independent natural reward proofs |
| Mutation sensitivity | 24/24 | PASS twice; every genuine mutation detected |
| Phase 10A successor | 203/203 twice | PASS twice; all 188 historical and 15 Phase 10A-owned bytes exact |
| Live dashboard | 164/164 twice | PASS twice across four realms; 164 rendered rows, blank fatal, zero failed rows, zero warning/error logs |

The sealed evidence confirms exact rejection of foreign, own-`undefined`, negative-zero, reordered, and changed canonical inputs; exact production-order Gold grouping at the one-ULP discriminating boundary; all 240 valid direct-production vectors; bounded production-probe inputs; checked Date and pending-Gold arithmetic; and refusal of non-finite Campaign intermediates before JSON normalization. All 144 bundles are free of bad Gold conservation, Campaign replay, idle reward, duplicate-resource, or lost-resource results. Sixteen verifier-only corruptions are independently detected. The Campaign audit independently derives every policy attempt, all five gates, exact status/reason, receipt presence, lane order, spend, rewards, upgrades, and completion; the idle oracle independently enumerates cumulative accepted-time ranges and eligible ordinals. Missing eligible rewards invalidate lost-resource safety.

## Canonical artifacts

- Row registry: exact 624 unique ordered IDs; identity recorded by the final manifest/checksum build.
- Frozen golden: 96 literal microvector outputs plus 240 literal inspectable released-parity outputs with canonical Float64 identities where needed; identity is recorded by the sealed manifest/checksum build and covered by both passing independent reviews.
- Frozen advisory report: exact 144 complete bundles; report identity `d763aeb9cf263b007731b1a8cb2003da7b64978e927bed21368921b4a8c758be`, file SHA-256 `5d7e0f0b81d8e9362e15031480c363f80ee098ef7c7d2deef69c35db7f448e51`, exact byte length 94,974,300, and 210,773 explicit exact Float64 wrappers.
- Candidate configurations remain `released-schema10`, `candidate-growth-120`, `candidate-growth-122`, and `candidate-growth-124`; the latter three are advisory only.
- Ordinary verifier/browser/build runs cannot generate or overwrite the golden or report. Candidate generation requires two explicit non-accepted `.candidate.json` paths and refuses overwrite.

## Sealed acceptance evidence

- Focused CLI: 624/624 twice.
- Phase 10A successor: 203/203 twice.
- Inherited suites: Phase 10A focused 371/371 twice; Phase 10A semantic predecessor/successor 22/22 twice; Phase 9 focused 355/355 twice; Phase 8 successor 703/703 twice.
- Checksums: Phase 10A 14/14 twice; Phase 10B 22/22 twice.
- Live dashboard: 164/164 twice across 320×568 and 390×844 in normal and reduced-motion modes, with blank fatal evidence, 164 rendered rows, zero failed rows, and zero warning/error console entries per pass.
- Independent boundary/authority review: PASS by `phase3_implement` at exact executable tip `b12395292f7bbdbaa37ef119ff1a96f2ce488775`.
- Independent anti-tautology/reward review: PASS by `phase9_bridge_exact` at the same exact executable tip.

## Residual risks and interpretation limits

- The frozen golden and three truth layers passed independent review, but they remain a deterministic model of the frozen scenarios rather than player telemetry or a tuning decision.
- The production probe relies on exact unique source anchors and fails closed on artifact drift. It directly evaluates the accepted artifact after replacing only its unique boot tail, exposes no inherited Phase 6/7/9 hooks, and proves byte-exact restoration.
- The action policy, archetypes, candidate curves, starting Gold, and growth values are explicit comparison hypotheses, not telemetry or game-feel proof.
- Exact JavaScript Float64, whole-pending-Gold collection, and Phoenix time-zone semantics remain part of the pinned runtime contract.
- Web Storage's existing no-compare-and-swap residual risk is unchanged because this phase performs no production persistence.
- Claim consolidation, schema 11, starting-resource changes, roster-hook activation, selected curves/growth, and live tuning remain outside Phase 10B-1.

## Do-not-break confirmation

The package is additive. `index.html` and every Phase 0–10A QA/doc artifact remain outside the writer's change set. No save, storage slot, schema, production route, bridge, runtime state, formula, reward, or public UI was changed.
