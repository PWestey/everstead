# Phase 14 implementation contract

## Objective

Phase 14 validates the accepted First Covenant vertical slice through deterministic, read-only pacing and reward-impact observations. It extends the existing localhost-only Phase 13 QA bridge; it does not add a player-visible Phase 14 feature or a facility runtime.

## Dependencies

- Accepted Phase 12 schema-12 foundation, save/recovery authority, offline settlement, shared events, tutorials, and exactly-once reward claims.
- Accepted Phase 13 First Covenant story, Chronicle, tutorial, cast, Legacy, and manual-claim slice.
- Frozen independent contract in `docs/PHASE_14_INDEPENDENT_QA_CONTRACT.md` and its additive fixture identities.

## Acceptance

- `definitions().validation.phase14` declares policy `measurement-only-no-unapproved-production-tuning`, the exact fresh/midgame/established profiles, and every Phase 14 fixture ID.
- `derive().phase14Validation` reports safe-integer pacing values, introduced story/tutorial IDs, pending manual claims, a deadlock observation, zero simulation writes, and canonical versioned reward-impact rows.
- The midgame, migrated, corrupt, and offline fixtures are accepted by the existing isolated Phase 13 QA bridge. Valid fixtures preserve schema 12 and validate before use.
- The corrupt fixture is refused with the frozen, sorted failure ledger, performs zero writes, and leaves active raw state and revision unchanged.
- Migrated measurement reports unknown historical story/tutorial baselines, zero invented completion/claim counts, and no popup cascade.
- The bounded Phase 13 Legacy surface remains exactly one continuing track, one one-time feat, and one manual claim. Claim carryover, presentation, reload, offline banking, and concurrent exactly-once behavior remain observable.
- The normalized render model reports the accepted keyboard, focus-return, Escape-neutral, control, mobile, and reduced-motion contract.

## Do not break

- Do not change schema version, save namespace, recovery lineage, offline 24-hour cap, claim finalizer, story/tutorial identity, cast/art, navigation, Campaign mechanics, Oaths, Village Gold, or roster progress.
- Do not tune any production economy, Power, reward, rank, Campaign cost, or progression value.
- Do not add a currency, stamina, expiring claim, daily checklist, permanent percentage bonus, facility runtime, Village hotspot, opportunity bank, or `window.__EVERSTEAD_PHASE_14_QA__` bridge.
- All measurements operate on clones or immutable definitions and produce no persistence writes.
