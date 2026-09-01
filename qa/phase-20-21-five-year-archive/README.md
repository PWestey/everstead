# Phase 20/21 five-year facility-claim archive QA

This QA-only simulation is pinned to accepted commit `4a3a7472e4534485dfb86cd3c44a244d13c6fff5`. It does not load, mutate, or emulate the active app worktree, and it does not approve production economy values.

It exercises all eight successor facilities for five calendar years in a strict interleaved round robin at eight manual claims per facility per day. That cadence is intentionally high but credible for a heavily engaged player: the accepted QA policy generates opportunities every 45–80 minutes with banks of 3–10, while the simulation claims only once per facility every three hours on average.

The V2 failure-baseline cadence and expected result live in `fixture.json`. The bounded V3 cadence, budgets, exact source hashes, focused-verifier output identity, browser-gate totals, and expected result live in `fixture-v3.json`. The model uses the accepted Phase 15 archive constants and exact Phase 20/21 authority, range, V2 receipt, checkpoint, reward, and identity field shapes. It retains only the canonical 512 recent receipts, folds exact batches of 128, reloads through JSON, and validates exact per-facility count, local progress, last receipt, domain ownership, receipt ownership, global sequence ownership, folded rewards, and pre-claim resource neutrality.

The event generator appends mathematically equivalent increasing ranges in constant time. This is deliberate: production `claimedRangesAdd`, successor validation, and row identity serialization already scan/copy growing authority arrays. Calling the production finalizer once for every simulated claim would reproduce the quadratic cost rather than provide a bounded five-year probe. The report therefore records both the exact final data shape and a deterministic lower bound on cumulative full-authority range visits.

Run:

```sh
node qa/phase-20-21-five-year-archive/simulate.mjs
```

The command exits successfully only when correctness remains exact and the accepted commit still demonstrates the known longevity gate failure. A future bounded schema should update this package so the scalability verdict itself must pass.

The bounded V3 successor gate is separate so it cannot erase the V2 failure baseline. Its model-only mode remains available for an implementation-independent projection:

```sh
node qa/phase-20-21-five-year-archive/simulate-v3.mjs --model-only
```

Candidate mode refuses to run unless `fixture-v3.json` matches the accepted base commit plus every frozen production/QA source hash. It verifies that exact external writer worktree without copying production files into this branch:

```sh
EVERSTEAD_V3_CANDIDATE_ROOT=/absolute/path/to/candidate \
  node qa/phase-20-21-five-year-archive/simulate-v3.mjs
```

The V3 model adds 512 pre-activation predecessor receipts, later predecessor receipts, predecessor-only and mixed fold batches, fixed eight-key checkpoint maps, activation-floor exclusion, adversarial out-of-order domain claims within each facility bank capacity, JSON reload/export/import, activation idempotence, no-throw overflow/malformed rejection, and a one-pass validation-work budget computed from the fixed maps, bounded domain fragments, and at most 512 recent receipts. Candidate mode also runs the frozen focused runtime verifier and pins the real-browser production-realm source. The accepted browser result is separately recorded as two 1,060/1,060 executions across six active viewports plus one production-off realm; the simulator does not infer live browser success from source text.

Engineering budgets are intentionally internal and conservative:

- no more than `512 + (8 × 4) + 60 = 604` validation visits: the recent-receipt window, four fixed-map visits per facility, and the frozen worst-case bounded domain fragments;
- no more than 1 MiB for this archive-bearing canonical save projection;
- no more than 64 KiB serialized growth in year five after the recent archive has long since saturated;
- no more than 604 receipt/domain range visits for one full authority validation.

These budgets reserve room for the rest of the save and require old ownership to be checkpointed rather than retained once per claim.
