# Everstead Phase 10C-2 economy-engine QA

This additive, command-line-only gate verifies the exact Phase 10C-2 economy
engine committed at `722e91b80ee1cc8f1c51ff52ebc2f49be8335a88`.
It runs the production application in isolated VM realms backed only by memory
adapters. It never selects or writes native browser storage and includes no live
browser or UI files.

The gate proves:

- the production change is one 29-line additive block on the accepted Phase
  10C-1 schema candidate, while the Phase 10B-2 private Gold core and all five
  embedded assets remain byte-exact;
- the selected 1.24 Building curve and level cap, bounded Fellow and Companion
  roster curves, disjoint economy-Power ownership, and local rounding;
- exact-once Family and Oath factors, neutral Prosperity/Bond/assignment paths,
  and independent Relic/Might and Mastery inputs;
- exact shipped JavaScript floating-point outputs, with the frozen advisory
  decimal vectors separately constrained to within one IEEE-754 ULP;
- activation-boundary, local-midnight, exact-24-hour, over-cap, rollback, and
  future-clock offline behavior;
- pending/claim conservation, preview purity, one-time Family-drop settlement,
  and independence of Companion Tower and Fellow Expedition cursors;
- fresh schema-11 and migrated schema-10 policies, profile preservation, exact
  pre-v11 backup, and one-time fault/reload settlement; and
- the Phase 10C-1 schema probe remains 47/47, while its frozen full gate has
  only the two expected current-artifact/build-seal supersessions.

Run the focused gate with the workspace Node.js runtime:

```sh
node qa/phase-10c2/verify.mjs
```

`build-contract.mjs --write` regenerates only this package's manifest and
checksum seal. Without `--write`, the builder is read-only.

Live browser and player-facing UI coverage is intentionally deferred to Phase
10C-3.
