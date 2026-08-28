# EVERSTEAD — PHASE 7 RESULT

## Candidate

- Base: sealed Phase 6 package `1ffa12eb73cccb4de40769ae7251937c67f69766`.
- Production tip: `8ca8353534bd4ae312e9470155988d209b0b6fed`.
- Production artifact SHA-256: `e15f41f378af381818ad9ff60bdc154a5c6d6b34395e3a8872a33c0a786e95d5`.
- Production artifact bytes: `18,761,746`.

## Delivered behavior

- Schema 8 and an exact tenth protected slot (`pre-v8`) with deterministic schema 0–7 migration, receipt-bound ancestry, ten-slot export/reset, and fail-closed recovery.
- Fifty-stage Fellow Expedition using the complete owned Fellow roster, weakest-eligible-first assignment, one-use exhaustion, no partial damage, and all-time best progression.
- Non-spendable Might derived from claimed Expedition history, capped at 50,000 points/Level 50 and applied exactly once inside effective Fellow Power without changing Village Gold formulas.
- Independent 24-hour Expedition idle lane with chronological stage segments, hourly Might, deterministic random Fellow shards, seven-miss pity, exact claim receipts, and double-claim refusal.
- Fellow Campaign v2 deterministic stage-local rewards and an immutable schema-7 progression baseline reconciling Fellow EXP, shards, rarity spend, Player Rank EXP, and QA credits.
- Explicit 100,000-entry Campaign and Expedition replay/integrity ceilings with action-level refusal, diagnostics, and user-facing migration-required copy.
- Historical schema 2–7 transaction completion and bounded safe-reset archival-root migration without overwriting marker-attested bytes.
- Four active Adventure routes, durable best/claim history, nominal-versus-actual Might feedback, and preserved Companion Campaign/Tower behavior.

## Gate evidence

- Phase 7 focused CLI candidate: `325/325` on the frozen production artifact before final package reruns.
- Phase 6 semantic successor: `511/511` twice, with eight itemized Phase 7 replacements.
- Package checksums: all `14/14` entries pass.
- Exact package `98edfa95b8d006f07b1e3dcb77d45351e2821ab7` passed live Chromium twice: `620/620` each pass at 320×568 and 390×844, blank fatal, zero failed rows, and zero warning/error console entries.

## Compatibility boundary

Released schema 0–7 saves are supported. Final schema-8 compatibility begins with this sealed package. Provisional schema-8 files created only in the isolated, unmerged, unpushed Phase 7 worktree were never present on canonical main or the public build and are intentionally unsupported. The pre-seal evidence pins both canonical refs to exact Phase 6 and records that the public Pages artifact exactly matched Phase 6's schema-7 hash and byte length. QA/dev uses isolated storage, so no provisional schema-8 payload is promoted as user data.

## Residual risks and deferred validation

- Web Storage has no atomic compare-and-swap; exact ownership rereads, revisions, raw identities, and storage events narrow and detect but cannot eliminate the final same-origin race.
- FNV raw identities bind accidental/foreign divergence but are not cryptographic authentication against a malicious same-origin editor.
- The 100,000-entry replay ceiling requires a future explicit aggregation/schema migration before normal play approaches it; it must not be silently raised.
- Safari and real-device behavior remain outside the Chromium gate.
- Relics/Relic Stones, Phase 10 economy/power balancing, automation, audio, events, advanced animation, and Post-V1 systems remain deferred.
