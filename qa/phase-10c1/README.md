# Everstead Phase 10C-1 preimage and schema-candidate QA

This additive, command-line-only package recognizes either the exact production
preimage or the bounded schema-11 candidate for Phase 10C-1. It does not load or
modify native production storage and does not provide a browser bridge.

It proves:

- the exact clean Phase 10B-3 base artifact and five embedded assets remain the
  authority, while candidate changes are confined to schema-11 persistence and
  the required schema-10/11 compatibility guards;
- the selected `everstead-economy-v1` profile has its contractually fixed
  canonical JSON and SHA-256 identity;
- independent hand-worked Building-cost, roster-curve, and fresh-rate vectors
  agree with the selected profile;
- the accepted Phase 10B simulator evidence is byte-exact apart from the
  deliberately superseded historical `index.html` entry; and
- the accepted simulator reproduces the selected starter ownership and
  24-hour bundle deterministically without changing its advisory evidence;
- schema-11 fresh state uses 50,000 Gold and the exact profile identity;
- exact schema-10 bytes migrate without changing Gold, pending Gold, or Building
  levels, with a write-once pre-v11 checkpoint and authenticated receipt; and
- export, fixture, reset, storage-event, recovery, lineage, and ordinary mutation
  paths carry the thirteen-slot/profile authority without native-storage access.

Run the focused gate with the workspace Node.js runtime:

```sh
node qa/phase-10c1/verify.mjs
```

`build-contract.mjs --write` regenerates only the Phase 10C-1 manifest and
checksum seal. Normal verification is read-only.

There are intentionally no live-browser files in this schema-layer package.
Economy rates, roster hooks, offline arithmetic, rewards, RNG, Power, and UI are
still inactive here and belong to the subsequent economy-activation gate.
