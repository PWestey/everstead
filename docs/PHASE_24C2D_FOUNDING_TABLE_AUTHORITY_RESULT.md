# Phase 24C-2D Founding Table production-authority result

**Verdict:** PASS — final identities frozen

## Verified active authority

- Production loads the schema-14 successor authority before the inline runtime.
- Release `release.phase-24c2d.founding-table.v1` is active at sequence 2.
- Permanent grant
  `collection.grant.restaurant.founding-table.facility.v1` adds exactly 200 bps
  to `facility.restaurant` and no global pool.
- The release has exactly six dependencies: the Restaurant, its three founding
  recipes, and the two gradual Collection tutorials.
- `tutorial.phase-24c.collection-first-ready.v1` is active with Isolde.
- `tutorial.phase-24c.collection-first-claim.v1` is active with Lyra and Isolde
  fallback.
- Both tutorial rows remain optional, skippable, replayable, reward-neutral,
  and limited to one automatic presentation per safe visit.
- The authority activates claim readiness and Collection UI while keeping Rank
  at 5, limited content absent, and provisional curves inactive.
- The four permanent-profile fixtures and focused evidence package validate.
- One detached claim previews `0 → 200`, writes one authenticated receipt, and
  refuses replay with zero reward.
- The production formula uses
  `floor(baseSaleGold × 200 / 10,000)`, then adds that result to the unchanged
  authored sale-plus-tip total. Nonzero tips are never percentage-boosted.

## Current focused run

- Behavioral, structural, and identity checks passed: **98**.
- Failed: **0**.
- Unexpected failures: **0**.
- Syntax check: PASS.

The frozen identities cover:

1. successor authority source bytes;
2. complete candidate semantics;
3. successor authority semantics;
4. production `index.html` bytes;
5. release-manifest semantics.

All five values now match the reviewed release bytes and semantics.

The separate integration browser suite, checksum closure, commit, push, and
deployment verification remain the release-level gates.
