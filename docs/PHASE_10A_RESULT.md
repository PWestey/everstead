# EVERSTEAD — PHASE 10A RESULT

## Candidate status

Release candidate sealed after two clean exact-tip live runs and two independent PASS reviews.

## Production identity

- Published Phase 9 base: `068a5a3ea2d9b3b339e96bf3fed0a0c945cf62a5`
- Production repair: `9d82db565ff482a3898e68bd8a6dce8505a9bfe9`
- Contract/recovery clarification: `c986665bb936d3a14ea513d5ceeca87bcdc03425`
- Reviewed QA package: `0aa03643575be9e0ad845e67e150c9cf3b48ec6f`
- Artifact SHA-256: `717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed`
- Artifact byte length: `18,916,682`
- Published predecessor SHA-256: `1e9d22150a5a0d2b2b4fbec403a5a50bf81c3b22153e688b659bda9b6bc67529`
- Embedded assets: byte-identical to published Phase 9

## Current evidence

- Phase 10A focused CLI: `371/371`
- Phase 9 focused CLI: `355/355`
- Phase 10A semantic predecessor gate: `22/22`
- Phase 8 semantic successor: `703/703` twice against the unchanged production artifact
- Frozen Phase 9 checksums: expected `13/14`, with only `index.html` superseded
- Phase 10A checksums: `14/14` twice
- Official live browser: `162/162` twice at `320×568` and `390×844`, normal and reduced motion, blank fatal, zero failed rows, zero warning/error logs
- Product/settlement independent review: `PASS` at exact tip `0aa03643575be9e0ad845e67e150c9cf3b48ec6f`
- Persistence/regression independent review: `PASS` at exact tip `0aa03643575be9e0ad845e67e150c9cf3b48ec6f`

## Verified behavior

The focused gate proves exact released behavior across the full focused vector set for schema-7 Tower and schema-8 Tower/Expedition, restored current behavior for schemas 9–10, unchanged neutral/delegate behavior elsewhere, true split and reload-separated equivalence, partial carry, exact rewards/pity/Gold neutrality, a successful advancing Expedition push with old-stage attribution, both cross-lane claim directions, schema-valid production overflow rollback, canonical schema-10 authority forms, and same/later-clock recovery at all 27 storage-fault cases.

## Residual risks

- Web Storage retains its established no-compare-and-swap race; Phase 10A does not change that residual risk.
- Wider Phase 10 economy, balance, claim-registry, pity, simulator, and schema-11 work remains intentionally unimplemented.
