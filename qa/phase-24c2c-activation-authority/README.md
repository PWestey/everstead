# Phase 24C-2C zero-activation-authority QA

Run from the repository root with the bundled or system Node runtime:

```sh
/Applications/Codex.app/Contents/Resources/cua_node/bin/node qa/phase-24c2c-activation-authority/verify.mjs
shasum -a 256 -c qa/phase-24c2c-activation-authority/checksums.sha256
```

Run the verifier twice. Both JSON reports must be byte-identical. This lane is
read-only: it evaluates the new candidate and the accepted Phase 24C-2A files in
isolated JavaScript realms, hashes pinned files, and inspects the production
loader. It does not open or write browser storage and does not load the candidate
through any unbounded path. One marked least-authority loader physically loads
the authority, definitions, and reopened foundation v2 for zero integration;
their release and reward surfaces remain inactive.

The verifier uses hardcoded accepted external baselines, exhaustive export
partitioning and manifest topology, `Reflect.ownKeys`/descriptor/prototype
hardening, exact validator IDs, independent Phase 24A anchor recomputation, and
a 26-case hostile mutation corpus, including the four forensic null-pair
authorization fields. Candidate source and semantic identities
must match both the independently frozen verifier constants and the QA contract.

A pass approves only an inactive, plain-data authority physically loaded for the
bounded zero-only schema-14 integration gate. It does not approve active
Collection releases or rewards, formula changes, Rank releases, new UI, commit,
push, deployment, or public release.
