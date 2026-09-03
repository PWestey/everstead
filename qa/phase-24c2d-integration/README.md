# Phase 24C-2D integration QA

This additive gate loads the real `index.html` in injected, isolated memory-storage realms. It does not modify production state or native browser storage.

It covers the first nonzero permanent Collection release: activation is reward-neutral, all three founding recipes drive `0/3` to `3/3`, the visible manual claim applies exactly once, reload preserves one receipt and 200 Restaurant basis points, and the real Restaurant pipeline captures the Collection bonus only when a new service reward becomes ready. It also exercises both gradual tutorials, discovery-gated tutorial logs, terminal replay controls, 320×568 and 390×844 layouts, Safe Reset, rollback, save-import adapters v1–v3, and schema-12/schema-13 migration followed by the real production reload path.

The reload realm also creates an authentic schema-13-to-14 migrated, zero-authority origin without the later Phase 12–21 content foundations. This represents the foundation-thin save shape found in an earlier deployed migration. A third, freshly booted realm deliberately uses the ordinary non-QA URL, installs no `runtime.qa` permission, exposes no QA globals, and then uses the real mobile controls to open Fellowship, render all 20 Family members, switch to all 20 Companions, make a first legitimate persisted Oath completion, and repeat the Family-to-Companion journey. It proves the missing tutorial foundation is handled defensively, immediate migration replay authority permits only the known save-neutral UI projection, navigation writes nothing, and the Phase 24C-2D release remains deferred with zero Collection rewards. A dedicated future schema-14 reconciliation migration—not a rewritten historical receipt—will activate that save shape later. Direct schema-14 origins and foundation-complete migrated origins continue through normal activation.

## Final status

The reviewed authority and production identities are frozen. The real Chromium
gate passes 78/78 across three mobile realms with zero captured warning/error
console entries and zero native-storage access. The static/package verifier
passes 71/71.

The isolated adapter shares monotonic save and transaction ID counters across all simulated page loads. Each inherited recovery fixture also resets the QA-only clock without storage writes, so Safe Reset and the v1–v3 import/migration cases cannot pass or fail because one fixture leaked identity or time state into the next.

Run the focused static verifier with:

```sh
node qa/phase-24c2d-integration/verify.mjs
```

Serve the repository root and open `qa/phase-24c2d-integration/` for the three-realm mobile browser gate.

Verify the package checksum list with:

```sh
shasum -a 256 -c qa/phase-24c2d-integration/checksums.sha256
```

See `RESULT.md` for the final bounded evidence.
