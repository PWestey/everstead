# Phase 24B deterministic progression simulation

**Verdict:** SIMULATION LANE PASS · RUNTIME ADOPTION NOT APPROVED

This is an output-only candidate report. It changes no runtime, save, reward, or live balance. All EXP bands, Breakthrough units, throughput budgets, and post-500 multipliers remain provisional until explicit root acceptance.

## Frozen Phase 24A baseline

- Authority: `everstead-scaling-live-baseline.phase-24a.v1`
- Baseline report SHA-256: `e7ede3199b5addabee64c13710985f822f8538e1313a946b0ef85c992a0dd353`
- Candidate SHA-256: `00f37707f72e08ed71d9d649cda2155858740059c85f7799ed6705ee8544fb5a`
- Fresh anchors remain exactly 35,565 Fellow Combat, 2,200 Companion, and 27320.8092192 Gold/hour at zero Collections.
- Migrated-established remains 36,645 Fellow Combat with 2,272 actual / 2,892 protected Companion Power.
- The released Broken Roads authority is 22K / 28.5K / 36K / 45K / 56K / 69K / 84K / 101K / 121K / 144K. Appendix C's 22K / 26K / 30.5K prose row is stale and was not used.

## Candidate tables

| Lane | Cap | Transitions | Cumulative EXP at cap | Breakthrough gates | Table SHA-256 |
|---|---:|---:|---:|---:|---|
| Fellow | 750 | 749 | 169,410,000 | 14 | `51af1892d0d1b8f1f56e4aa739f2923d624d42ca01bc4f0c86f06f9056eeaf2e` |
| Companion | 500 | 499 | 62,619,000 | 9 | `b7dc62d7f86ba89ea11609b4c810e451dfa3d57f8eea82f872adcbffc2cdce70` |

The Breakthrough `requirementUnits` are abstract pacing units, not a proposed new currency. They must be mapped to existing materials or fixed claim bundles before runtime work.
The 5M Level-550→600 and 17.5M Level-600→650 Fellow bands preserve the cited 3.5× widening at exactly one-fortieth of the 200M / 700M external scale. That divisor is a provisional target-fit hypothesis, not approved balance.

### Companion Level-500 rounding authority

| Fixture | Actual member-rounded total | Theoretical aggregate-unrounded | Used for reachability |
|---|---:|---:|---|
| level500-star1-mastery0 | 111,985 | 111,980 | actual |
| level500-star5-mastery0 | 156,775 | 156,772 | actual |
| level500-star5-mastery50 | 235,155 | 235,158 | actual |

## Released-mechanics static bounds versus provisional launch budget

| Days | Static Fellow lower bound | Proposed Fellow EXP | Static share | Rank-2 Companion Campaign lower bound | Proposed Companion EXP | Static share |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 5,130 | 270,000 | 1.9% | 4,400 | 100,000 | 4.4% |
| 7 | 33,030 | 8,000,000 | 0.4129% | 29,650 | 4,000,000 | 0.7412% |
| 30 | 140,010 | 40,000,000 | 0.35% | 126,300 | 30,000,000 | 0.421% |
| 90 | 419,010 | 160,000,000 | 0.2619% | 378,500 | 90,000,000 | 0.4206% |
| 365 | 1,698,030 | 360,000,000 | 0.4717% | 1,534,400 | 240,000,000 | 0.6393% |

These are conservative frozen-fresh Campaign bounds, not exact current-live forecasts. They hold Levels, Power, Rank joins, and accessible stages constant. The Companion bound first charges the two Fellow clears required for Rank 2; the separate Fellow bound spends that Gold differently, so the lane totals cannot be added together. A dynamic old-curve EXP → Level → Power → joins → access simulation with one conserved Gold ledger remains unimplemented.
Tower requires Rank 3 and is therefore excluded. The explicit Day-1 no-unlock/no-shared-Gold power-only upper envelope is 16,160: 4,550 Campaign + 90 one-target Tower clears + 11,520 all-roster Tower idle EXP. It is conditional evidence, not a fresh reachable route.
The proposed launch budget requires new permanent authored EXP and Breakthrough-material sources; it is not already available in Everstead.

## Zero-Collection proposed-budget outcomes

| Strategy | Days | Fellow levels min–median–max | Lead Fellow | Fellow Campaign | Expedition | Companion levels min–median–max | Tower |
|---|---:|---|---:|---:|---:|---|---:|
| focused | 1 | 45–45/45–184 | 184 | 10/10 | 6/50 | 1–1/1–20 | 4/50 |
| focused | 7 | 240–240/240–500 | 500 | 10/10 | 6/50 | 28–28/28–161 | 28/50 |
| focused | 30 | 399–399/399–650 | 650 | 10/10 | 6/50 | 93–93/93–323 | 44/50 |
| focused | 90 | 560–560/560–723 | 723 | 10/10 | 6/50 | 149–149/149–472 | 50/50 |
| focused | 365 | 617–617/617–750 | 750 | 10/10 | 6/50 | 211–211/211–500 | 50/50 |
| broad | 1 | 50–50/50–50 | 50 | 10/10 | 18/50 | 2–2/2–2 | 4/50 |
| broad | 7 | 250–250/250–250 | 250 | 10/10 | 18/50 | 54–54/54–54 | 34/50 |
| broad | 30 | 409–409/409–409 | 409 | 10/10 | 18/50 | 133–133/133–133 | 48/50 |
| broad | 90 | 569–569/569–569 | 569 | 10/10 | 18/50 | 204–204/204–204 | 50/50 |
| broad | 365 | 623–623/623–623 | 623 | 10/10 | 18/50 | 283–283/283–283 | 50/50 |

Rows labeled broad use a synthetic all-18-Fellow roster and therefore require recruitment first. The target assessment separately reports Day 1 and Day 7 equal-investment results for the six Fellows actually joined on a fresh save.
The current Expedition algorithm exhausts one distinct Fellow per stage. It therefore has a structural maximum of six stages for the focused fresh roster and eighteen for the complete roster, regardless of the 50-row requirement table. That requires a separate design decision before stages 19–50 can be real goals.

## +1,000% Collection stress at 365 days

- **focused:** Fellow Power 45,809,141, lead Level 750, Companion Power 101,560, Village 300,528.901 Gold/hour.
- **broad:** Fellow Power 138,737,291, lead Level 750, Companion Power 111,985, Village 300,528.901 Gold/hour.

Collection EXP changes only newly earned eligible EXP; Collection Power is added beside Might; Collection Earnings is added beside Oath; and the normalized facility pool remains local. The simulator never compounds a Collection percentage onto an already-boosted total.
All 7 synthetic stress claims apply exactly once, replay as no-ops, and accept a later +100 bps grant without clipping. The +1,000% row is a stress boundary, not a lifetime cap; mandatory reachability uses zero Collection and assumes no limited-event bonus.

| Pool | Existing adjacent bonus | Collection | Required additive result | Forbidden compounded result |
|---|---:|---:|---:|---:|
| power beside Might | 50% | 25% | 175,000 | 187,500 |
| earnings beside Oath | 30% | 25% | 155,000 | 162,500 |
| exp beside authored EXP bonus | 20% | 25% | 145,000 | 150,000 |
| facility beside authored facility active bonus | 40% | 25% | 165,000 | 175,000 |

Requirement isolation: 21 provenance-composed zero/permanent/all-content profiles cover every stress point and share one immutable requirement-hash identity. Limited-event bonuses contribute to runtime all-content totals but never to the permanent-only requirement-authoring profile.
Collection ledger migration: exact uncapped pools reconstruct as Power 3400, Earnings 2300, EXP 1700, Facility 2600 bps without old-cap clipping; replay is a no-op and a future grant still adds.
Limited-content alternative: one shared mechanical entitlement prevents double claiming whether the limited or permanent source arrives first, while limited art/title metadata remains preserved.
Delayed claim proof: captured Fellow EXP 10,000 and facility reward 5,000 remain unchanged after later lane-specific growth, survive ready and claimed migrations, apply once, reload with the same receipt, and replay for zero. Oath is not applied to the active-facility reward.

## Existing-save migration recipes

| Fixture | Saved Level | Old raw EXP | New active EXP | Retained cap bank | Grandfathered gates | Legacy claim | Repeat-safe |
|---|---:|---:|---:|---:|---|---|---|
| fellow-mid-level | 60 | 699,077 | 22,279 | 0 | 50 | none | yes |
| fellow-level-120-exact-cap | 120 | 599,463,646 | 78,000 | 0 | 50, 100 | none | yes |
| fellow-level-120-attributed-surplus | 120 | 599,587,102 | 78,000 | 123,456 | 50, 100 | none | yes |
| companion-mid-level | 40 | 58,706 | 120,414 | 0 | none | none | yes |
| companion-level-100-exact-cap | 100 | 49,714,965 | 699,000 | 0 | 50 | queued-free-legacy-claim | yes |
| companion-level-100-attributed-surplus | 100 | 49,780,397 | 699,000 | 65,432 | 50 | queued-free-legacy-claim | yes |

Raw Phase 23 EXP is never read directly under the candidate table. Mid-level progress is preserved as an exact rational value plus integer mapping remainder. At-cap surplus remains an auditable separate bank. Companion Level 100 receives a free manual exactly-once legacy Breakthrough; Fellow Level 120 next encounters the ordinary Level-150 gate.

## Manual Breakthrough lifecycle

| Fixture | Closed gate | Banked EXP | Claim cost | Level after claim | EXP left | Reload replay | Persistent state |
|---|---:|---:|---:|---:|---:|---|---|
| phase24b.fellow-level50-manual-gate.v1 | 50 | 2,100 | 1 | 53 | 0 | no-op | preserved |
| phase24b.companion-level100-free-legacy-gate.v1 | 100 | 48,000 | 0 | 102 | 0 | no-op | preserved |

The Fellow fixture proves insufficient materials do nothing, the exact unit is spent once, and banked EXP advances only after the manual claim. The migrated Companion Level-100 fixture remains queued until a free manual claim, spends zero units, preserves its migration and claim receipts through reload, and next encounters the ordinary Level-150 gate.

## Target fit and blockers

- PASS — firstSessionFocusedFellow100To250
- PASS — firstSessionBroadFellow50To150OnFreshSixJoined
- PASS — firstWeekFocusedFellow450To550
- PASS — firstWeekBroadFellow250To400OnFreshSixJoined
- PASS — syntheticFull18FirstWeekBroadFellow250To400
- PASS — earlyEstablishedFocusedFellow600To650At30Days
- PASS — earlyEstablishedBroadFellow400To500At30Days
- PASS — longTermFocusedFellow700To750At365Days
- PASS — longTermBroadFellow500To650At365Days

- **BLOCKER BEFORE RUNTIME:** Released Fellow EXP throughput is orders of magnitude below the provisional first-week budget. Permanent authored EXP sources and their claim behavior must be designed before this curve can ship.
- **BLOCKER BEFORE RUNTIME:** The provisional day-one focused budget yields 313,664 Fellow Power and makes all 10 released Broken Roads stages Power-reachable against the final 144,000 requirement. Any runtime reward plan must sequence EXP behind story/stage gates or target post-current content; released requirements remain frozen and were not repriced.
- **BLOCKER BEFORE RUNTIME:** Breakthrough requirements are normalized simulation units only. Exact existing materials or fixed bundles, acquisition rates, and manual claim presentation remain unresolved.
- **EVIDENCE LIMIT:** Released-mechanics horizon values are conservative frozen-fresh Campaign bounds plus explicitly conditional Tower upper envelopes, not a dynamic current-live forecast. A full old-curve EXP, Level, Power, Rank-join, access, target-rotation, and conserved-Gold simulation remains unimplemented.
- **ROSTER PREREQUISITE:** Broad matrix rows use a synthetic full 18-Fellow roster. Fresh-save early breadth is separately probed across the six actually joined Fellows; the Rank-crossing recruitment timeline remains unmodeled.
- **STRUCTURAL:** The released Fellow Expedition exhausts one distinct Fellow per stage, limiting the 18-Fellow roster to Stage 18 even though 50 requirements exist.
- **MIGRATION:** Old cumulative EXP is table-dependent. Runtime migration needs authenticated lineage, exact rational progress preservation, a separate post-cap bank, and a free manual Companion Level-100 legacy Breakthrough.
- **AUTHORITY:** The stale Appendix C Broken Roads prose table was rejected in favor of the frozen Phase 24A runtime table; no existing stage was repriced.
- **COLLECTION:** All mandatory reachability remains testable at zero Collection. The +1,000% stress rows measure long-horizon headroom and do not create a lifetime cap.

## Safe-integer result

All simulated values are finite and safe: **PASS**. The largest observed integer is 4,594,386,856,610 at `$.theoretical.trueHighEconomyAt1000PercentCollection.accumulatedGoldAfter365DailyClaims`, leaving 9,002,604,867,884,381 integers of headroom below JavaScript's maximum safe integer.
The true-high economy at +1,000% Collection Earnings produces a daily 24-hour claim of 12,587,361,114 Gold and 4,594,386,856,610 Gold after 365 daily claims plus starting Gold. This applies Collection beside Oath and remains a safe integer.

## Decision boundary

This report can accept the simulation machinery while still rejecting runtime adoption. Shipping any candidate requires explicit curve approval, real permanent reward sources, exact material identities, an implemented exactly-once save migration, and a new browser acceptance gate.

