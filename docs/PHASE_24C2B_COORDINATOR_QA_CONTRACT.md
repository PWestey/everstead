# Phase 24C-2B zero-write coordinator QA contract

## Scope

Phase 24C-2B introduces one private persistence-coordinator result: an expected transactional refusal. It exists so a later stale or duplicate exactly-once claim can decline without throwing, persisting draft work, adopting opening/offline accrual, increasing the revision, blocking persistence, rendering, moving focus, or showing feedback.

This phase remains schema 13. The inactive Phase 24C durable definition and foundation files must remain unloaded and their globals absent. No Collection definition, reward, requirement, EXP curve, Breakthrough cost, balance change, migration, or user-facing feature is activated.

## Production coordinator contract

- The refusal signal is a frozen private lexical object authenticated by membership in a private `WeakSet`; shape-compatible thrown objects cannot forge it through a public global, JSON, save state, or the QA bridge.
- The signal carries a nonempty machine-readable reason of at most 128 characters and is thrown only by the private refusal callback. The coordinator supplies that callback to a mutator only when the call explicitly opts in with `allowRefusal:true`.
- The catch path recognizes a signal only when both the current transaction opted in and `WeakSet` authentication succeeds. It restores the live state reference and returns `ok:false`, `refused:true`, the reason, no error, no value, and no adopted accrual.
- Draft mutations and opening/offline accrual are discarded. Active and staging bytes, revision, persisted identity, state, blocked/notice/outcome/stale/write-in-progress flags, DOM, toast, overlay, and focus remain unchanged. No successful `setItem` or `removeItem` occurs.
- Normal successful mutations keep the predecessor commit path and increment the revision once.
- Thrown programming or persistence errors remain errors. So do a lookalike object, a malformed refusal request, and even an authentic captured signal used by a transaction that did not opt in. The predecessor catch path restores the live state, sets the persistence block, renders when requested, and performs no save write.

## Private QA interface

The non-enumerable getter `window.__EVERSTEAD_PHASE_24C2B_QA__` may exist only when all predecessor QA boundaries pass simultaneously: an exact localhost/loopback `?qa=1` URL, `runtime.qa.allowDestructive === true`, `runtime.qa.isolatedStorage === true`, a supplied storage adapter, and that adapter is not the captured native `localStorage` object.

The bridge version is `phase-24c2b-coordinator-qa-v1`. It exposes:

- `read.snapshot()` returning a detached `{state, raw, revision, persistence}` snapshot. `persistence` contains detached `blocked`, `notice`, `outcome`, `stale`, and `writeInProgress` values.
- `destructive.resetFresh()` installing the deterministic fresh schema-13 fixture in isolated storage.
- `destructive.probeRefusal()` attempting a real valid draft mutation before returning the private refusal. It reports the raw coordinator result and `draftMutationAttempted:true`.
- `destructive.probeOpeningRefusal()` calling the real coordinator with `opening:true` and a captured time 26 hours after the live save clock. This necessarily exercises the capped offline-accrual draft before the mutator throws the authenticated refusal; the transaction reports `accrual:null`, and exact live state/raw/UI invariants prove that the draft accrual was discarded.
- `destructive.probeSuccess()` performing a harmless valid schema-13 commit through the same coordinator.
- `destructive.probeException()` throwing a deterministic programming error through the same coordinator with rendering enabled. It reports the raw result and may additionally report `rendered:true`.
- `destructive.probePersistenceError()` throwing a deterministic `PersistenceError`.
- `destructive.probeLookalike()` throwing a frozen shape-compatible but unauthenticated refusal object.
- `destructive.probeMalformedRefusal()` requesting a refusal with an invalid empty reason.
- `destructive.probeAuthenticWithoutOptIn()` capturing an authentic signal, then throwing it through a transaction that omitted `allowRefusal:true`.

All methods are synchronous and return detached plain data. None exposes the refusal token or a generic arbitrary-mutator capability.

## Static source boundary

Every production edit in `index.html` is enclosed in a complete block whose first and last lines are `/* Phase 24C-2B <required block> BEGIN */` and `/* Phase 24C-2B <required block> END */`. Required block names are `coordinator authority`, `QA bridge`, and `QA bridge install`.

The verifier mechanically projects the marked coordinator block back to the exact predecessor coordinator by removing the private signal line, the `allowRefusal` option/callback, and the authenticated refusal catch branch; it removes the two additive QA blocks. That normalized source must reproduce byte-for-byte the accepted Phase 24A `index.html` SHA-256 `6109805093ee78f075257526b4822cf86c9ca22dbd2a2a05ab3ef7b0bcb8c5f3`. The three accepted non-index production sources and the Phase 24A checksum manifest remain byte-frozen.

## Browser evidence

Two authorized mobile realms and four unauthorized realms load the real app. The harness owns the memory-storage adapter and logs every operation independently of the app. It also captures exact slots, app DOM, overlay, toast, focus, bridge snapshots, and native-storage access.

Full acceptance requires both full static PASS and real-browser PASS twice with zero warning/error console entries. Package-only PASS establishes only that the gate itself is coherent.

## Release boundary

This gate does not authorize schema 14, Phase 24C source loading, a claim integration, merge, push, deployment, public release, or rights-limited asset distribution.
