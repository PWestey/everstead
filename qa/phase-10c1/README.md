# Everstead Phase 10C-1 preimage QA

This additive, command-line-only package freezes the production preimage for the
Phase 10C-1 economy activation. It does not load or modify production storage,
does not provide a browser bridge, and does not change `index.html`.

It proves:

- the exact clean Phase 10B-3 production artifact, embedded assets, schema, and
  twelve-slot boundary are still present;
- the selected `everstead-economy-v1` profile has its contractually fixed
  canonical JSON and SHA-256 identity;
- independent hand-worked Building-cost, roster-curve, and fresh-rate vectors
  agree with the selected profile;
- the accepted Phase 10B simulator evidence is byte-exact apart from the
  deliberately superseded historical `index.html` entry; and
- the accepted simulator reproduces the selected starter ownership and
  24-hour bundle deterministically without changing its advisory evidence.

Run the focused gate with the workspace Node.js runtime:

```sh
node qa/phase-10c1/verify.mjs
```

`build-contract.mjs --write` regenerates only the Phase 10C-1 manifest and
checksum seal. Normal verification is read-only.

There are intentionally no live-browser files in this preimage package. Live
storage, migration, offline-transition, and UI gates belong to the later
production candidate.
