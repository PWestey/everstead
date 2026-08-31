# Phase 12 independent successor gate

This package defines the independent acceptance contract for the Phase 12 architecture candidate. It is additive: it does not edit or instrument production source on disk.

## Package verification

From the repository root:

```sh
node qa/phase-12-independent/verify.mjs --package-only
```

The package-only mode must pass on the exact Phase 11H base. In Codex Desktop, use `/Applications/Codex.app/Contents/Resources/cua_node/bin/node` when `node` is not on the shell path.

## Candidate static check

```sh
node qa/phase-12-independent/verify.mjs
```

Before Phase 12 is implemented, this command intentionally fails `candidate-phase12-bridge-contract`. That is the expected fail-closed result. Once a candidate installs the authorized bridge, the static check must pass.

## Live behavioral gate

Serve the repository root from a static local server and open:

```text
http://127.0.0.1:<port>/qa/phase-12-independent/
```

The runner executes the deterministic contract in isolated in-memory realms. It never selects native player storage. Run the complete matrix twice before integration.

## What is covered

- stable definition IDs and reference integrity;
- deterministic fresh behavior and idempotent same-schema Phase 12 activation of established schema-12 saves;
- honest unknown-history statistic baselines;
- banked reward readiness and exactly-once receipts;
- immediate, reload, offline, and multi-tab duplicate-claim refusal;
- tutorial feature coverage, gradual Rank triggers, completion, skip, and replay;
- all 18 current Fellows and 20 current Family members in the speaker and dialogue-coverage registries;
- write-free dormant Story/Tower/Trading/Patrol/Operations behavior;
- Phase 11H artwork identity plus save/offline regression invariants.

Phase 12 intentionally remains on schema 12. The gate requires a unique transactional `phase-12-foundation-activation` receipt and proves the activation does not replace or bypass the existing protected checkpoint/recovery chain.

See `docs/PHASE_12_INDEPENDENT_QA_CONTRACT.md` for the complete contract and known blind spots.
