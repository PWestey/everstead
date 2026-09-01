# Phases 15–16 — product policy candidate v1

## Review status

**Candidate for root review. Not authoritative. Not production-enabled.**

This package resolves only the product-definition blanks that prevent a Waystone/Legacy and first Restaurant vertical slice from being evaluated. It does not modify production code, art, CSS, the frozen Phase 15–16 design, or the cross-phase audit. Approval must create a new immutable approved policy version; these candidate files must never be edited in place into authority.

The following remain locked throughout:

- all rewards require a deliberate manual claim;
- banked customers, prepared stock, and ready claims never expire;
- offline settlement never chooses a recipe, serves, transfers stock, or claims;
- no stamina, daily reset, daily checklist, new global currency, or permanent percentage multiplier;
- passive Building Gold and Family assignments continue unchanged;
- a Fellow cannot speak before their join Rank;
- tutorial mechanics remain usable if a tutorial is skipped;
- visible lines are original functional Everstead writing, not imitation of an external character voice.

## Phase 15 candidate — Waystone and Legacy

### Continuing tiers

| Track | Candidate threshold | Candidate reward | Product intent |
|---|---:|---|---|
| Oathkeeper tier 1 (released v1) | 1 committed Oath | 750 Gold | Preserve the live Phase 13 pending/claimed payload exactly |
| Oathkeeper tier 2 (new ID) | 3 committed Oaths | 3,000 Gold; 2 Prosperity | First new value begins only after the released tier-1 identity |
| Unbroken | observed streak 3 | 1 Gift; 4,000 Gold | Recognize consistency without a daily-reset loop |
| Steward | 100,000 Village-produced Gold | 5,000 Gold; 2 Prosperity | About four fresh structural-production hours; reward Gold is excluded |
| Builder | combined Building level 8 | 5,000 Gold; 3 Relic Stones | Four levels above the fresh combined baseline |
| Roadwarden | 3 Campaign first clears | 4,000 Gold; 4 Relic Stones | Recognize new road progress, not repeat farming |
| Veteran | 10 committed Campaign victories | 4,000 Gold; 2 Prosperity | Introduce the authoritative run-count record |

### One-time feats

| Feat | Candidate reward |
|---|---|
| First Fellow Campaign clear (released v1) | 500 Gold |
| Complete the First Covenant | 1 Gift; 15,000 Gold; 10 Prosperity; 8 Relic Stones |
| Reach Player Rank 5 | 1 Gift; 20,000 Gold; 10 Relic Stones |
| All Book I Fellows joined | 2 Gifts; 25,000 Gold; 10 Prosperity; 12 Relic Stones |
| Exact-recommended-Power Campaign clear | 10,000 Gold; 5 Relic Stones |

For an explicitly migrated established save only, three or more standard ready claims may be shown as one Founding Cache. Fresh and ordinary post-activation claims remain individual. The cache binds and claims the exact canonical components atomically. Major claims stay individual. The cache is presentation/transaction grouping, not a bonus reward, and no reward is credited before Claim.

### Tutorial rhythm

Waystone map basics appear only after discovery. Track scope appears on the first player-opened Legacy view. Standard and major claim tutorials appear when their respective claims first become ready. The feat lesson waits for the first feat. At most one tutorial auto-presents during a safe visit; all remain skippable, replayable, logged, and rewardless.

## Phase 16 candidate — Restaurant

### Time and banking

| Policy | Candidate |
|---|---:|
| Customer interval | 30 minutes |
| Waiting-list capacity | 12 customers |
| Unattended coverage before full | 6 hours |
| Shared settlement allowance | 24 hours |
| Historical backfill for existing saves | 0 customers |
| Expiry | none |

When full, the bank keeps all 12 customers and drops whole-interval debt while preserving sub-interval carry. New arrivals resume after space opens. This is a capacity pause, never a midnight reset or lost-customer timer.

### Reward scaling without a live multiplier

Each customer captures one of 52 fixed reward-row IDs when generated. The trusted authority sums released Building base rates through the released `1.15` level curve. It excludes Oaths, Family assignments, roster effects, pending Gold, Restaurant Gold, and all other active-facility rewards. The caller cannot supply the row, and later Building upgrades do not rewrite a banked customer.

The row thresholds follow each of the 52 released Building-level calibrations. Every row contains exact integer sale values for all three customer types and exact integer basic/partial/matched tips. Production reads those integers only. The ratios retained in the generator are review provenance, not a runtime formula and not a permanent multiplier.

| Example row | Structural Gold/hour | Road worker | Archive courier | Route envoy | Partial / matched tip |
|---|---:|---:|---:|---:|---:|
| Level 1 | 0–29,209 | 889 | 1,041 | 1,270 | 127 / 254 |
| Level 8 | 67,565–77,698 | 2,365 | 2,770 | 3,378 | 338 / 676 |
| Level 20 | 361,487–415,709 | 12,652 | 14,821 | 18,074 | 1,807 / 3,615 |
| Level 35 | 2,941,442–3,382,657 | 102,950 | 120,599 | 147,072 | 14,707 / 29,414 |
| Level 52 | 31,653,634+ | 1,107,877 | 1,297,799 | 1,582,682 | 158,268 / 316,536 |

Basic service adds no tip. Regular generation is 60% road workers and 40% archive couriers. The route envoy is authored only and never enters the interval pool. Across all 51 boundaries, 153 explicit just-below/at/just-above samples remain between 7.94% and 9.13% active acceleration. The largest adjacent payout increase is 15.02%, replacing the earlier three-to-four-times cliffs. Even the best regular customer remains under the 20% hourly ceiling.

### Recipes and stations

| Reputation | Recipe | Duration | Batch / stock cap | Stations |
|---:|---|---:|---:|---|
| 1 | Hearth Stew | 120 seconds | 2 / 6 | Hearth |
| 2 | Garden Flatbread | 90 seconds | 3 / 9 | Hearth or Prep Table |
| 3 | Roadside Tea | 60 seconds | 4 / 12 | Prep Table |

The Hearth begins with one slot. Reputation 2 opens the one-slot Prep Table. Starting a batch is manual and uses an explicit fail-closed `mode: none, costEntries: []` global-cost policy; the first slice adds no global ingredient currency. A committed timer may mature offline, but the ready batch must be manually transferred to local stock. Stock never expires. Serving consumes one prepared serving. Insufficient stock preserves the customer.

### Local progression and visitors

Basic, partial, and matched results grant respectively 1, 2, or 3 local Reputation and recipe Mastery points on claim. Levels begin at 0, 12, and 36 points. Recipe Mastery uses the same first-slice thresholds; level 3 is mastered. These values are neither spendable nor a passive-production bonus.

At Reputation 3, after `story.book1.restaurant.route-envoy-ready`, Jaina's route envoy becomes a one-time non-expiring visitor. Only its committed claim creates the Chronicle hook. The story event's exact emission point remains a root-review dependency.

### Candidate Restaurant Legacy rewards

| Milestone | Threshold | Candidate reward |
|---|---:|---|
| Customers served | 10 | 5,000 Gold; 2 Prosperity |
| Matched meals | 5 | 5,000 Gold; 3 Relic Stones |
| Recipes mastered | 1 | 1 Gift; 5,000 Gold |
| Facility profit | 25,000 Gold | 5,000 Gold; 3 Prosperity |
| First named visitor | 1 | 1 Gift; 7,500 Gold; 3 Relic Stones |

### Tutorial rhythm

The Restaurant first explains one waiting customer and valid serving. Banking appears only after two customers wait or the list first fills. Claim guidance appears only after a resolved result. Recipes/stations appear at Reputation 2; Reputation and its final first-slice unlock appear at Reputation 3; named visitors wait for the first authored visitor. Replays alter no progress and grant no reward.

## Cast disposition

Phase 15 intentionally uses Tavi (`fellow.lyra`), Captain America (`fellow.captain-america`, only at Rank 4 with Virginia fallback), Hera Syndulla (`family.isolde`), Virginia, and Syl.

Phase 16 intentionally uses Deadpool (Rank 2), Star-Lord (Rank 3), Spider-Man (Rank 4), Rumi (`family.tamsin`), Jaina, Tifa, and Misty. Locked Fellows are skipped, never previewed as speakers. Mechanical tutorial copy renders without a speaker if no approved presentation is available.

The other 26 current actors retain their accepted later Phase 18–21 hooks. This package neither pulls them forward nor removes their profile quote and ambient obligations.

## Balance and five-year storage evidence

| Profile | Four Building levels | Structural Gold/hour | Active Gold/hour | Active share |
|---|---|---:|---:|---:|
| Fresh | 1 / 1 / 1 / 1 | 25,400 | 2,166.3 | 8.53% |
| Mid | 8 / 8 / 8 / 8 | 67,565 | 6,000.4 | 8.88% |
| Established | 20 / 20 / 20 / 20 | 361,487 | 33,003.7 | 9.13% |
| Late | 35 / 35 / 35 / 35 | 2,941,442 | 268,552.3 | 9.13% |
| Building cap | 52 / 52 / 52 / 52 | 31,653,634 | 2,889,976 | 9.13% |

Five years of uninterrupted two-per-hour customer claims yields 87,600 recurring receipts. Adding a conservative 16 one-time claims produces 87,616 receipts. With a 512-recent-receipt limit and 128-receipt archive folds, the projection performs 681 folds and retains 448 exact recent receipts. A conservative serialized estimate with 25% overhead is 187,455 bytes, or 17.88% of the candidate one-MiB incremental budget. This is a data-shape estimate, not a browser-quota guarantee.

## Root-review blockers

Production implementation remains blocked until root explicitly approves or revises:

1. every Legacy threshold and reward payload;
2. structural Building production as the captured Restaurant band authority;
3. cadence, bank cap, preparation durations, batches, stock caps, and local curves;
4. fixed sale/tip and achievement tables;
5. English labels, tutorials, and authored lines through editorial/IP review;
6. the exact Phase 17 named-visitor story event;
7. Phase 12 trusted-finalizer reward-kind coverage and receipt/archive retention.

## Runtime acceptance after approval

An implementation may ship only after deterministic runtime and live mobile tests prove migration no-op/retry, non-expiry, 24-hour settlement, full-bank behavior, no offline agency, captured policy versions, stock/engagement reload, exact-once claims, two-tab stale conflicts, tutorial skip/replay, locked-speaker fallbacks, reduced motion, localization placeholders, Chronicle timing, and storage archive folding. Design validation alone is not that gate.
