# Everstead Gate 0C QA contract

This directory is the additive Phase 0C contract. Every previously tracked file under `docs/` and `qa/` is frozen byte-for-byte at published base `81ec44c`; their SHA-256 values live in `current-manifest.json`. Gate 0C owns the current production-artifact checksum and does not rewrite either historical manifest.

## Run

From the repository root, use the bundled or system Node.js runtime:

```sh
node qa/gate-0c/build-contract.mjs
node qa/gate-0c/verify.mjs
shasum -a 256 -c qa/gate-0c/checksums.sha256
```

For live Chromium, serve the repository over HTTP from an exact loopback host and open `qa/gate-0c/`. The runner verifies frozen history, the scenario contract, and the current production artifact before launching any realm. Its mobile realms use memory-only storage at 320×568 and 390×844, exercise default and all-disabled feature combinations, and publish the completed result as `window.__EVERSTEAD_GATE_0C_RESULT__`.

## Runtime contract

- Production defaults keep Story, Tower, Trading, Patrol, and Operations enabled.
- Supplying a feature override object changes the rule to own literal `true` only. Missing, inherited, false, and non-boolean entries remain disabled, and the captured flags are immutable.
- Clock, random, storage, confirmation, and ID adapters are captured once. An installed invalid, throwing, non-finite, non-boolean, or exhausted adapter fails closed without a native fallback or partial active write.
- The Gate 0B persistence test/fault seam retains priority and its synchronous transaction, backup, recovery, revision, conflict, and scoped-Undo behavior remains frozen.
- Disabled legacy modes are guarded at their mutating leaves as well as rendered controls. Story-disabled Oath completion cannot add wall Resolve, Patrol rollover cannot replenish its bank, open Patrol choices cannot reward, ready Operations cannot claim, and Trading optimization/routes cannot write.
- The existing visible **Simulate 2H**, **+1 Patrol**, and **Reset Prototype** controls are grandfathered Phase 0 prototype behavior and remain unchanged for compatibility. Their production quarantine or removal is deferred to Phase 1; this gate restricts only their new programmatic bridge equivalents.

## Local QA bridge

The bridge exists only when the document uses `http:` or `https:`, the hostname is exactly `localhost`, `127.0.0.1`, or IPv6 loopback, and the raw query contains exactly one literal `qa=1` segment that also decodes to exactly one `qa=1` entry. Encoded, duplicate, conflicting, appended-after-boot, deceptive-host, non-loopback, file, data, blob, about, srcdoc, and opaque-origin cases fail closed.

Bridge calls return deep-cloned snapshots/results, use a fixed action allowlist, validate raw plain data before cloning, and reject unknown keys, functions, undefined values, symbols, accessors, custom `toJSON`, custom/inherited prototypes, prototype-pollution names, malformed arrays, and mixed-case action names. Diagnostics and export are read-only. Destructive fixture/grant controls and the programmatic `simulate`/`add-patrol` actions require an explicitly supplied storage adapter, `qa.allowDestructive === true`, and `qa.isolatedStorage === true`. Authorization is rejected when the selected source is the exact captured native `localStorage` object. An attested distinct adapter is the trusted test-runtime boundary; a malicious forwarding wrapper is outside this contract.

## Concurrency boundary

Web Storage still has no atomic compare-and-swap. Gate 0B's exact rereads, staging provenance, revisions, same-tab guard, and storage-event stale marker remain in force, but a second tab can still write in the narrow interval between the final reread and active `setItem`. Gate 0C preserves this as an explicit residual risk.
