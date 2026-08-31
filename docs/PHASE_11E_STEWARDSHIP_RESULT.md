# Phase 11E stewardship result

## Verdict

**PASS_LOCAL** for the schema-11 release-candidate candidate.

Phase 11E is schema-neutral. It does not add a storage key, migration, reward source, Prosperity threshold, roster catch-up formula, Museum/Trophy system, CG system, or other post-V1 mechanic.

## Delivered

- Main-screen, Fellowship-tab, and Adventure-route browsing is save-neutral.
- The Village featured Fellow rotates in session memory without changing persisted `featured` data.
- The Phase 11C navigation stop rules were folded into the active navigation functions; the two later navigation wrapper aliases were removed.
- Claim Ready appears after the Adventure routes, collapses for no reward or ordinary Village-Gold-only states, expands for important/multiple/unsafe states, and uses normal-player copy.
- Save Health leads with current-save, Previous-save, and recovery-file status. Schema, revision, source, checkpoint, byte, identity, and storage-key details remain under Advanced.
- The public release identity is `1.0.0-rc.1`; the persisted compatibility version and storage namespace remain unchanged.
- Recovery downloads identify the release candidate while the recovery inspector continues to treat `appVersion` as informational.
- The Codex now presents existing art, titles, quotes, Family-to-Fellow relationships, Relic marks, collection-set status, unlock milestones, and dated journey records without creating rewards or persisted trophies.
- Prosperity/HQ, roster catch-up, future-schema recovery, and source-structure decisions are recorded explicitly.
- GitHub Actions now runs the successor regression gate on pushes to `main` and pull requests.

## Automated evidence

`node qa/phase-11e/verify.mjs`:

- release checks: **20/20**
- Phase 11E focused behavior: **36/36**
- Phase 11D regression: **103/103**
- Phase 11C regression: **83/83**
- Phase 11B save/recovery regression: **286/286**
- focused behavior total: **508/508**
- embedded art: **5 assets**, aggregate SHA-256 `26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a`, byte-identical to the Phase 11D seal

Production artifact at local verification:

- SHA-256: `b1d6b3d9486e3951a62c1defe1dbf4c56c62af733143318b173e2b3a3e56272e`
- byte length: `19,154,249`

## Live mobile evidence

Observed in the in-app Chromium browser against the local static artifact:

- **42/42** visual/interaction observations passed
- exact viewports: **320×568** and **390×844**
- horizontal overflow: **0 px** at both sizes
- compact Claim Ready height: **104 px** at 320×568 and **85 px** at 390×844
- Claim Ready action height: **44 px** at both sizes
- route tabs precede Claim Ready; Campaign content follows it
- Save Health normal surface fits and Advanced is closed by default
- Codex category tabs are 44 px tall
- Codex counts: Fellows 6/6 art and quotes; Family 3/3 art and quotes plus 7 relationship chips; Companions 2/2 art; Relics 6/6 marks
- Codex ArrowRight navigation wrapped Journey → Overview and moved focus correctly
- console warnings/errors: **0**

## Deferred by authority

- Prosperity remains a non-spendable lifetime Village/HQ progression meter with no invented thresholds.
- Roster catch-up remains a decision record, not a live grant.
- Persistence/validation alias flattening remains a dedicated equivalence phase; Phase 11E removed only the low-risk navigation wrappers it directly superseded.
- Portrait physics, Live2D, advanced animation, weekly boss, draft, clash, deeper Patrol/Gatherings, advanced Relic sets/affixes/reforging, special CGs, Museum, events, advanced story, and audio/voice remain post-V1.
