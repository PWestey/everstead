# Phases 18–19 independent Apothecary and Schoolhouse gate

This independent package gates two distinct private-release Village activities against the accepted Phase 18–19 design, the immutable approved policy successor, and predecessor claim/facility/story seams. The accepted design stays byte-frozen and null; authority comes only from `design/phase-18-19-policy-approved/`, whose approval record freezes the exact reviewed candidate hashes and values.

Run the package/design contract against the frozen preimplementation base:

```sh
node qa/phase-18-19-independent/verify.mjs --package-only
```

Validate the approved policy lineage and generated runtime definitions:

```sh
python3 design/phase-18-19-policy-approved/validate.py
python3 scripts/build-phase18-19-runtime.py --check
```

Run the focused runtime verifier and then the independent static candidate gate:

```sh
node qa/phase-18-19-runtime/verify.mjs
node qa/phase-18-19-independent/verify.mjs
```

For live testing, serve the repository root over HTTP and open `qa/phase-18-19-independent/`. The runner executes five isolated realms: 320×568, 390×844, 1024×768, 130-percent copy, and reduced motion. Every realm uses a distinct memory-backed storage adapter with explicit destructive-QA attestation. Native `localStorage` is instrumented and must remain untouched.

The private candidate exposes locally/query-gated `window.__EVERSTEAD_PHASE_18_19_QA__`. Destructive QA remains restricted to an explicitly attested non-native storage adapter. The bridge invokes the real closure-bound implementation; it does not install a fake facility engine or accept caller-supplied finalizers.

Actual-DOM checks query the real candidate's Village board, Apothecary/Schoolhouse hotspots and sheets, action controls, dimensions, overflow, focus, keyboard activation, Escape, and copy expansion. Reduced motion requires both a real production root marker and a static `prefers-reduced-motion` stylesheet contract; the injected `matchMedia` preference cannot pass by itself. Normalized bridge output covers state and deterministic lifecycle semantics but cannot substitute for these node/style checks.

The browser gate also proves the production unlock path: story discovery grants
the exact capability, the discovered hotspot presents an original Everstead
introduction, and Watch or Skip atomically commits the Phase 17 unlock,
Phase 18–19 projection, durable outcome, and Tutorial Log entry. Pointer and
keyboard openings return focus to the exact hotspot. Fixed QA-only faults after
unlock, after projection, and after outcome must all roll back with no active
save, revision, resource, or mechanical change. Safe staging cleanup may still
be observable as storage-adapter activity and is not counted as an active-save
write.
The persisted entry remains visible and replayable after reload without rewards
or mechanical writes. Existing Phase 17 unlocks migrate as an honest
`migrated-recap`, never as fabricated watched/skipped history.

Passive preservation uses `passiveBaseline(capturedAt)` twice at one frozen timestamp. It compares the original four Buildings' production formulas, effective same-time Oath boosts/rates, and Family assignments while explicitly excluding Gold balances, persistence timestamps, `day`, and raw `boostDay` rollover drift.

The gate also freezes `player.wayfarer` as a separate Player Character outside Fellow, Family, and Companion roster/assignment/shard systems. Facility sheets must remain semantically restylable for original Everstead visual polish without ingesting reference assets, copying trade dress, or using full-background profile art as an unframed Village dialogue speaker.

The historical policy validator bounds released-ID collision scanning to actual production text surfaces and is run with a child-process timeout, so a giant art or report tree cannot hang the gate. The old candidate remains immutable review history. The separately versioned approved package is `approved-private-release`, authoritative for this private lane, and still declares `publicReleaseAllowed: false`. The runtime is sequentially retargeted onto accepted Phase 17; public deployment remains blocked pending inherited Restaurant verification, the current five-realm browser gate, root diff review, and integration approval.
