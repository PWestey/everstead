# Phase 11B-2a · Recovery-file inspection gate

This focused gate exercises the pure recovery-file boundary before any transactional save writes or player-facing import controls exist.

It covers the private synchronous SHA-256 implementation, strict JSON duplicate/depth/whitespace rules, exact recovery-bundle topology, checksum validation, schema and lineage refusal, opaque historical checkpoint handling, safe summaries, declared size limits, and fatal UTF-8 decoding.

Run with the bundled Node.js runtime:

```sh
/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node qa/phase-11b2a/probe.mjs
```
