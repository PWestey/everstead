# Phase 24C-2D integration QA

This additive gate loads the real `index.html` in an injected, isolated memory-storage realm. It does not modify production state or native browser storage.

It covers the first nonzero permanent Collection release: activation is reward-neutral, all three founding recipes drive `0/3` to `3/3`, the visible manual claim applies exactly once, reload preserves one receipt and 200 Restaurant basis points, and the real Restaurant pipeline captures the Collection bonus only when a new service reward becomes ready. It also exercises both gradual tutorials, discovery-gated tutorial logs, terminal replay controls, 320×568 and 390×844 layouts, Safe Reset, rollback, save-import adapters v1–v3, and schema-12/schema-13 migration followed by the real production reload path.

## Final status

The reviewed authority and production identities are frozen. The real Chromium
gate passes 70/70 across both mobile realms with zero captured warning/error
console entries and zero native-storage access. The static/package verifier
passes 64/64.

The isolated adapter shares monotonic save and transaction ID counters across both simulated page loads. Each inherited recovery fixture also resets the QA-only clock without storage writes, so Safe Reset and the v1–v3 import/migration cases cannot pass or fail because one fixture leaked identity or time state into the next.

Run the focused static verifier with:

```sh
node qa/phase-24c2d-integration/verify.mjs
```

Serve the repository root and open `qa/phase-24c2d-integration/` for the two-mobile-realm browser gate.

Verify the package checksum list with:

```sh
shasum -a 256 -c qa/phase-24c2d-integration/checksums.sha256
```

See `RESULT.md` for the final bounded evidence.
