# Phase 24C-2C zero-only integration gate

This is an independent gate for the first physical schema-14 integration. It loads the real app in isolated browser realms and does not import or trust any writer verifier.

## Accepted status

Accepted and frozen for the Phase 24C-2C zero-only integration. Package-only PASS remains non-acceptance by itself; the accepted evidence is the exact frozen package plus full static verification and two complete Chromium passes.

- Integrated `index.html`: `7073db350bddfdea932bf89d900a449346c2e3e6b2b636bf55a1e8f8f3aa3356`
- Zero-activation authority: `88ba60568041b764794b74dec6b926e34890354d6c13175491f5f87c4c92a03f`
- Browser: focused 185/185, non-allowlisted-host denial 10/10, and full 391/391 twice; blank fatal output and zero warning/error console entries throughout.
- The 28-file checksum closure pins the current reopened foundation-v2 and independent pre-gates through the accepted activation-authority closure while leaving their historical predecessor manifests unchanged.

## Static/package check

```sh
/Applications/Codex.app/Contents/Resources/cua_node/bin/node qa/phase-24c2c-zero-activation/verify.mjs --package-only
```

The full command omits `--package-only` and additionally verifies the production candidate, exact marker projection, source pins, loader order, schema-14 topology, and bounded bridge:

```sh
/Applications/Codex.app/Contents/Resources/cua_node/bin/node qa/phase-24c2c-zero-activation/verify.mjs
```

Verify the frozen checksum closure with:

```sh
shasum -a 256 -c qa/phase-24c2c-zero-activation/checksums.sha256
```

## Browser check

Serve the repository root over loopback HTTP and open:

`/qa/phase-24c2c-zero-activation/`

The page starts automatically. It runs six authorized isolated realms, six denial realms, and two real same-origin clients sharing one synchronous memory adapter. Browser acceptance requires every rendered row to pass, a blank fatal field, and zero captured warning/error console entries. Realm, command, and final-result transport is explicitly size-capped; assertion rows retain exact bounded predicate facts plus deterministic correlation digests instead of full save/state graphs. Large realm results use at most eight ordered 512 KiB envelope chunks under one fixed manifest; the receiver recomputes every chunk size and accepts nothing until the complete, contiguous, duplicate-free row sequence matches its aggregate row count and ordered digest. During final publication, only redundant detail text on passing rows is omitted; row identities, outcomes, bounded facts, and evidence remain unchanged, and failed-row detail is never shortened.

The QA bridge is available only for exact loopback `?qa=1` realms with own literal destructive and isolated-storage attestations and a supplied storage object distinct from captured native `localStorage`. The bridge exposes fixed scenarios and cloned evidence only. It exposes no raw storage writer, callback, mutation primitive, refusal token, Collection grant API, or Collection formula evaluator.

The static gate also proves that released Phase 23 authority receives one canonical projection as both its parsed predecessor and physical `activeRaw`. It rejects temporary schema-14 validation traces, recursion diagnostics, migration proof/cache shortcuts, forced diagnostic throws, and integration console output; the real commit, staging, post-write, and adoption validators must remain active.

Pending-offline neutrality compares the complete durable zero-output projection before and after settlement while separately proving the evidence revision follows the real state revision. Its power-invested output uses a dedicated exact contract anchor rather than the established-profile anchor.

Ordinary schema-12 migration fixtures use a direct authenticated captured installation and never pass through legacy reset. The safe-reset realm alone uses the dedicated retained-backup fixture, which proves the original canonical active is retained byte-for-byte in `rawBackup` and both version-7 marker identities bind those bytes. Its authentic foundation activators run under a temporary QA-only in-memory commit coordinator: every successor is validated, intermediate storage writes remain zero, and the production coordinator is restored in `finally`. One final exact 13-slot retained installation is then authenticated and written; its exact active bytes are validated and directly adopted with zero additional writes, without replaying the legacy adoption helper. All current coordinators must be restored before Phase 23 foundation reconciliation remains a zero-write no-op and schema-14 migration begins.

The historical schema-11 staging fixture is constructed and authenticated only while the exact Through-Eleven validation/default-state functions and legacy Companion, Fellow, and Family ID catalogs are scoped in memory. That scope performs zero storage writes. Before the fixture is installed—and again before the real production recovery boot—the gate requires schema 14, the current catalogs, the current commit authority, the current runtime functions, and zero legacy-scope depth to be restored exactly.

Historical staging recursion is dispatched only inside the recognized schema 0–13 staging branch. The gate requires current schema 14 and the current bootstrap authority before entry, temporarily binds recursion to the exact captured Phase 12 bootstrap while invoking captured Phase 23 recovery, restores both globals in `finally`, and rechecks exact current authority before any schema-14 reread or migration. It also rejects malformed, foreign-provenance, and future historical staging with the fixed `staging-provenance` code, zero attempt writes, exact byte preservation, no cleanup or adoption, and a validated restored terminal state. No production-global dispatch evidence or validation shortcut is accepted.

The synchronized browser harness cache version is 20 for both the runner and isolated realm scripts; candidate browser evidence must come from those exact query versions. The non-allowlisted-host denial uses contract-pinned `127.0.0.1.nip.io`, which resolves to the same loopback server while remaining outside the product bridge allowlist. Before evaluating only the fetched in-memory candidate copy, the realm requires exactly one literal host-boundary anchor and replaces it once with the unchanged product assignment plus the QA-only nonenumerable, nonwritable, nonconfigurable, frozen `__P24C2C_HOST_BOUNDARY__` observation. That observation records the literal product decision, a fresh `qaBridgeAllowed()` result, the observed hostname, and successful instrumentation; both decisions must be false, the hostname must match, the normal QA bridge must remain absent, and the boundary write delta must be zero. The probe name must be absent from the production `index.html` bytes. Realm transport identity is derived from the secure parent-generated nonce and does not depend on secure-context UUID APIs. A normal-sender failure uses a one-shot minimal failure chunk and never recursively calls the normal sender. `?focus=deny-nonloopback` runs only this denial in non-acceptance `FOCUSED` mode.

For deterministic diagnosis only, append `?focus=<authorized realm id>` or `?focus=<scenario>` (for example, `?focus=recovery`). Focused mode runs one authorized realm and publishes `FOCUSED`; it is never candidate acceptance. The complete aggregate URL without `focus` remains mandatory for acceptance.
