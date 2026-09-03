# Phase 24C-2D Founding Table production-authority contract

**Status:** active production successor; final identities frozen  
**Schema:** 14, unchanged  
**Runtime integration:** authorized by this successor authority  
**Deployment approval:** subject to the complete integration and deployment gates

## Purpose

This gate verifies the active successor authority used by the current
production artifact for Everstead's first nonzero Collection release. It
supersedes the earlier unloaded-candidate description without rewriting the
accepted Phase 24C definitions, foundation v2, zero-activation authority, or
Restaurant source.

The release is **The Founding Table**:

- release: `release.phase-24c2d.founding-table.v1`, version 1, sequence 2;
- grant: `collection.grant.restaurant.founding-table.facility.v1`;
- claim source: `collection.source.restaurant.founding-table.v1`;
- classification: permanent;
- target pool: `facility`;
- facility: `facility.restaurant`;
- reward: 200 integer basis points, or +2.00%, exactly once;
- Rank remains released through 5;
- no limited-content dependency or permanent alternative.

The authority is required to report
`active-production-successor-release-authority`, `productionLoaded: true`, and
`runtimeIntegrationAuthorized: true`. Its activation data must contain exactly
this active release, begin Collection totals at zero, authorize claim readiness
and the Collection UI, and leave provisional curves inactive.

## Exact content dependencies

The release owns exactly these six dependencies:

- `facility.restaurant`;
- `restaurant.recipe.hearth-stew`;
- `restaurant.recipe.garden-flatbread`;
- `restaurant.recipe.roadside-tea`;
- `tutorial.phase-24c.collection-first-ready.v1`;
- `tutorial.phase-24c.collection-first-claim.v1`.

The first tutorial is triggered when the first Collection set becomes ready,
uses Isolde as both primary and fallback actor, and explains the permanent
manual claim. The second is triggered by the first Collection claim, uses Lyra
with Isolde as fallback, and explains additive totals and capture time. Both
rows must be active, optional, skippable, replayable, reward-neutral, and
limited to one automatic presentation per safe visit. Every other tutorial row
must remain byte-equivalent to the frozen definitions.

## Exact reward formula

The Collection percentage applies only to the Restaurant's authored base sale.
The authored tip is never part of the percentage base:

```text
collection Gold = floor(base sale Gold × Restaurant Collection bps / 10,000)
final claim Gold = base sale Gold + authored tip Gold + collection Gold
```

At this release, Restaurant Collection bps is either 0 or 200. The bonus is
captured when a new Restaurant service reward becomes ready. A reward already
waiting retains its exact original value even if the Collection is claimed
later. This pool cannot affect passive Building Gold/hour, global Power,
general Earnings, EXP, or another facility.

The authority retains the uncapped additive Collection policy and explicitly
forbids multiplying an already-boosted total. The production seam must pass
`planned.baseSaleGold` as the percentage base and preserve
`planned.totalGold` as the authored sale-plus-tip amount.

## Evidence and isolation boundary

The successor appends one focused `approved-private-candidate` simulation
package. Collection-grant activation and reward throughput are approved;
requirement and runtime-curve activation remain false.

Its four fixtures are:

- `zero-permanent`: no contributor and zero Collection totals;
- `median-permanent`: only the Founding Table grant and 200 Restaurant bps;
- `high-permanent`: only the Founding Table grant and 200 Restaurant bps;
- `high-all-content`: identical to high-permanent because this release contains
  no limited content.

All fixtures retain the same four accepted requirement tables. The
high-permanent fixture remains the mandatory release profile. Evidence must
cover the exact grant plan, release budget, 30/90/365-day horizons, integer
safety, and additive stress through 100,000 bps (+1,000%).

## Verification requirements

The focused verifier must:

1. pin the frozen definitions, foundation v2, zero authority, and Restaurant
   source without editing them;
2. load the successor in an isolated VM and prove it is deeply frozen, plain,
   acyclic data published through a non-writable global;
3. independently validate and hash the successor authority, release manifest,
   fixtures, simulation package, dependencies, and evidence reports;
4. prove production loads and authenticates this authority exactly once before
   the inline runtime;
5. prove only the two named tutorial rows change from reserved to active and
   that both are release dependencies;
6. preview a `0 → 200` claim, finalize exactly one authenticated receipt, keep
   all global pools at zero, and refuse replay without reward;
7. verify base-sale-only floor cases with nonzero tips and inspect the exact
   production Restaurant capture seam;
8. reject hostile changes to bps, facility, release state, limited-content
   policy, approvals, evidence, fixture identities, claim-source uniqueness,
   pool scope, and Rank scope.

## Final identity freeze

The authority source, complete candidate semantics, successor authority,
release manifest, and current production `index.html` hashes are pinned to the
reviewed release. The focused authority verifier passes with zero failures.

This contract does not independently replace the integration browser suite,
save/recovery tests, multi-client checks, inherited regressions, commit review,
push, or deployment approval.
