# EVERSTEAD — PHASE 9 RESULT

## Candidate

- Production commit: `ee516296ddf823ba90b4a85ddc474456fada09f7`
- Production artifact SHA-256: `1e9d22150a5a0d2b2b4fbec403a5a50bf81c3b22153e688b659bda9b6bc67529`
- Production artifact bytes: `18,916,650`
- Embedded asset aggregate: `9d6c4dd1867b9973f27ea8199fb3ce24ba6f99804269fa9218499797e9eefe78` (unchanged from Phase 8)

## Implemented

Phase 9 adds the exact five-rank definition table, twelve-entry unlock registry, Player access selectors, fresh-versus-grandfathered authority, focusable locked Campaign/Adventure controls, the shared Wayfarer profile/roadmap, and immutable normal/reduced-motion Rank-up presentation. Rank milestones grant access only; Phase 8 Campaign/Relic receipts and every material reward stream remain unchanged.

Persistence advances to schema 10 with exact pre-v10 schema-9 authority, twelve protected slots, a last-position schema-9-to-10 receipt, exact deterministic staged-target reconstruction, marker-v5 reset lineage, export/fixture coverage, verified reads, and native-storage-scoped events.

## Evidence

- Focused Phase 9 CLI verifier: `355/355`, including pure checked-add boundaries, canonical schema-9 prefix-9 → grandfathered stage-10 completion, forged prefix-10/Rank-1 refusal before writes, all twelve independent safe-export read failures, and one-shot Rank-summary state assertions.
- Phase 8 semantic successor: `703/703`, with nine itemized replacements.
- Independent exact product/logic re-review: PASS `53/53` at exact production tip `ee516296ddf823ba90b4a85ddc474456fada09f7`; artifact SHA/bytes matched and the production delta remained the single additive Phase 9 QA Adventure wrapper.
- Independent persistence/recovery re-review: PASS `120/120` at the same exact production tip.
- A corrected pre-seal browser debug run reached `608/608`, blank fatal, and zero warning/error console entries on package commit `35b3a1d69b3c08a084a84af029d55a104d75f043`. This is diagnostic evidence only, not the official final live gate.
- Official expanded browser gate: PASS twice on exact independently audited package `4f810268d5be82954dbbe8cb825f758a079405e8`. Each independent full in-app Chromium run rendered `628/628`, Failed `0`, blank `#fatal`, zero failed rows, and zero warning/error console entries. Every required `320×568` and `390×844` realm row passed, including the threshold Rank-up summary occurring once and not replaying after reload, replay, navigation, or unrelated mutation across both normal and reduced motion. Evidence was observed through `2026-08-29T02:43:59Z`.
- The subsequent evidence-seal commit changes only the Phase 9 README/result/execution documentation, generated manifest, and checksum file; production and executable QA bytes remain the exact browser-tested candidate.
- Public release: GitHub Pages deployment [run 33229894273](https://github.com/PWestey/everstead/actions/runs/33229894273) succeeded for exact canonical/origin head `843ce328f898781ff2729c1eaf67253d471fc1be`, completing at `2026-08-29T02:50:13Z`. The public [Everstead artifact](https://pwestey.github.io/everstead/) was verified at `2026-08-29T02:52:31Z` as exact SHA-256 `1e9d22150a5a0d2b2b4fbec403a5a50bf81c3b22153e688b659bda9b6bc67529`, `18,916,650` bytes, exposing schema 10, `schema-9-to-10`, and `The Wayfarer`.
- Independent public UI verification: PASS in the in-app Chromium browser. Everstead v0.1 loaded, The Wayfarer profile opened, Rank 1/5 and the full Rank 2–5 roadmap rendered, and the console recorded zero warning/error entries.
- Released save compatibility now explicitly covers schemas 0–10. Schema 10 is published rather than provisional.

## Residual risks

- Web Storage still has no atomic compare-and-swap; exact revisions, raw identities, staging ownership, verified reads, and storage events narrow and detect but cannot mathematically eliminate the last reread-to-write race.
- Rank requirements and milestone timing remain Phase 10 balance variables, but the released schema-10 registry/config identity is migration-bound.
- The live harness covers Chromium mobile realms; real-device Safari remains outside this package.
