# Phase 23 successor-schema compatibility QA result

## Final verdict

**PASS.** The corrected schema-13 candidate passes both this additive successor-compatibility gate and the complete original Phase 23 gate on the same exact frozen candidate. No Phase 23-scope blocker remains in the exercised contracts. This result does not itself authorize merge, push, deployment, release, or public distribution of rights-limited Companion artwork.

## Exact corrected candidate

- `index.html`: `914912e7e5fd9767e9e9c758c5a48fd6ad785a73736e33c0511a4bcc248f54d8`
- `src/phase23-companion-catalog.js`: `48da84995d57d78ab01899b4f1840763b2539b4c5605da68ccc309889d0c718f`
- `src/phase23-companion-runtime.js`: `a79fac8ce19793bbc3a6d2f9df71f9f3826f5a250f5a63c664bd639fd972c78f`
- `qa/phase-23-successor-compatibility/checksums.sha256`: `d55446a27120fbf8eeaea8f75fe40fbc48070322b4ea110272291e5c3a39d3ab`
- `qa/phase-23-successor-compatibility/realm.js`: `7cd302b801ab8726ab80ec4e7477d7fc516c16a9d268bb87824e66447eea0e8b`
- `qa/phase-23-successor-compatibility/verify.mjs`: `68dfcb5cbfec87da27cae2c91d9277b65eebcf8d2c0de8055d26478f045395ef`

## Reproduced release blockers that caused suspension

Independent testing of the earlier schema-13 candidate found:

- inherited economy activation excluded schema 13, using the older 1.70 Building curve and neutral roster production hooks;
- fresh rates fell back to Command 6,500, Archives 5,776.96, Training 7,453.44, and Hearth 6,356.2 Gold/hr instead of the accepted schema-12 semantics carried into schema 13;
- Relic Power excluded schema 13;
- joined-roster totals excluded schema 13 and counted all 18 persisted `owned` rows instead of the six Rank-1 joined Fellows;
- clicking visibly locked Adventure routes could mutate the in-memory route while the screen fell back to Fellow Campaign;
- Village speaker selection and Campaign projection used schema-limited inherited predicates.

Those failures were release-blocking despite the original Companion-specific gate being green. The corrected candidate now passes the missing successor-schema contracts.

## Final evidence

- Successor package-only static verification: **16 passed, 0 failed**.
- Successor full static candidate verification: **24 passed, 0 failed**.
- Successor real-browser gate, pass 1: **27 passed, 0 failed**.
- Successor real-browser gate, pass 2: **27 passed, 0 failed**.
- Successor isolated candidate realm console/page errors: **0** on both passes.
- Successor native Web Storage accesses: **0**.
- Original full Phase 23 static gate: **43 passed, 0 failed**.
- Original full Phase 23 browser gate, pass 1: **207 passed, 0 failed**.
- Original full Phase 23 browser gate, pass 2: **207 passed, 0 failed**.
- Original frozen package checksums: **7 passed, 0 failed**.

## Corrected compatibility conclusions

- The full 1.24 Building upgrade ladder is exact from Level 1 through Level 52, including the cap, refused over-cap action, persistence, and reload behavior.
- Fresh schema-13 economy authority preserves Fellow economy Power **35,150**, Companion base Power **2,200**, Fellow/Family production bonuses **390/80 bps**, and aggregate Building production **27,320.8092192 Gold/hr**.
- Combat authority remains intentionally distinct at Fellow roster Power **36,366**. Rank 1 exposes exactly the six joined Fellows in accepted order, and Campaign targeting/projection uses Cael without leaking unjoined roster entries.
- The First-Road Lantern Relic contributes exactly **+100 bps** through the accepted formula and survives reload.
- Rank-gated screen clicks and direct actions refuse without state, UI, raw-save, or write-count drift.
- Village dialogue selects only joined speakers under schema 13.
- The genuine production Expedition exercise clears real Campaign stages and trains through real coordinators, moves the best stage from 12 to 18, settles exactly 2 hours at Stage 12 and 22 hours at Stage 18, discards the remaining 8 hours above the 24-hour cap, awards exactly 210 Might, commits the claim once, preserves exact receipt history, reloads without repricing, and rejects replay with zero writes.

## Residual platform boundary

Web Storage has no atomic compare-and-swap primitive. Existing revision, identity, staging, ownership, and reread checks narrow and detect stale-client conflicts but cannot remove the final platform-level reread-to-write interval. Chromium evidence also does not replace real-device or Safari testing.
