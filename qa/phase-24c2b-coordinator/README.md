# Phase 24C-2B zero-write coordinator gate

This additive gate proves the narrow persistence-coordinator prerequisite for future exactly-once Phase 24C claims. It does not activate schema 14, load the inactive durable sources, award a Collection reward, or change a released balance value.

`verify.mjs --package-only` checks this package, its syntax, its frozen checksums, the unchanged Phase 24A manifest, and the unchanged non-`index.html` production sources. `verify.mjs` additionally requires the real candidate implementation. The full verifier strips only complete, line-oriented `Phase 24C-2B … BEGIN/END` blocks from `index.html`; the normalized bytes must exactly reproduce the accepted Phase 24A baseline hash. This makes any unrelated production edit a failure.

Serve the repository root on `localhost` or `127.0.0.1`, then open `qa/phase-24c2b-coordinator/`. The page automatically loads the genuine app into isolated in-memory realms. Two authorized realms exercise the coordinator at 320×568 and 390×844 with 130% copy/reduced motion. Four denial realms prove the QA bridge stays absent without the exact query, destructive authorization, isolated-storage attestation, or a supplied non-native storage adapter.

The authorized browser gate consumes only:

- `read.snapshot()`
- `destructive.resetFresh()`
- `destructive.probeRefusal()`
- `destructive.probeOpeningRefusal()`
- `destructive.probeSuccess()`
- `destructive.probeException()`
- `destructive.probePersistenceError()`
- `destructive.probeLookalike()`
- `destructive.probeMalformedRefusal()`
- `destructive.probeAuthenticWithoutOptIn()`

The harness owns the storage adapter and therefore independently observes all `setItem`/`removeItem` calls and exact active/staging bytes. It also captures the app DOM, overlay, toast, focus, state, revision, raw bytes, blocked/notice/outcome/stale/write-in-progress flags, and native-storage accesses. Hostile controls prove that a lookalike object, malformed refusal, authentic signal without transaction opt-in, ordinary exception, and `PersistenceError` all remain blocking errors rather than nonfatal refusals.

The result document remains pending until both full static and real-browser modes pass on the wired candidate. A package-only PASS is not production acceptance.
