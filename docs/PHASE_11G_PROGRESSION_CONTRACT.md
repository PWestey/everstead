# Phase 11G progression contract

## Objective

Correct the Phase 11F roster-expansion pacing defect without weakening save integrity, introducing gacha, or replacing the locked total-roster Power model.

## Player-facing rules

1. Six established Fellows begin at Player Rank 1.
2. Three additional Fellows join at each Rank from 2 through 5.
3. All 18 portraits remain visible before access; locked profiles state the exact Rank requirement.
4. Campaign stages target a fixed three-Fellow Rank pool and rotate to the next recipient on every run.
5. The next EXP/shard recipient is visible before the player spends Gold.
6. Locked Fellows do not contribute to Fellow Campaign or Village roster Power.
7. Fellow Expedition becomes newly available at Rank 5, when all 18 Fellows have joined. Saves that already established an Expedition record retain legacy access.
8. The twelve Phase 11F additions receive the one-time catch-up rule in `ROSTER_CATCH_UP_DECISION.md`.

## Compatibility rules

- Save schema remains 12.
- Namespace and compatibility version remain unchanged.
- The protected pre-v12 checkpoint and recovery bundle topology remain unchanged.
- Phase 11G activates once through an additive, same-schema profile receipt.
- Existing meaningful use of an added Fellow is grandfathered.
- Historical Campaign runs retain Phase 11F targeting. Only runs after the Phase 11G activation baseline use rotating targets.
- Validation reverses Phase 11G catch-up, reward redirection, and later ascension spend before invoking the released Phase 11F validator.

## Balance gates

- A fresh Rank 1 save must have exactly six contributing Fellows.
- Fresh Rank 1 Campaign Power must be below the final 95,000-Power gate.
- Rank groups must unlock in exact 3/3/3/3 order.
- Every Fellow must appear in at least one deterministic Campaign target pool.
- The first nine Campaign clears must be sufficient to reach Rank 5, but later stages remain subject to Gold and Power gates.
- Fresh Gold remains 50,000 under the activated economy profile.

## Do not break

- Phase 11F external portrait loading and full-screen profiles.
- Exact schema-11-to-12 checkpoint lineage.
- Save & Recovery export/import/reset behavior.
- Campaign reward and Relic identities.
- Offline claims, repeat automation, and cross-tab conflict handling.
- Existing Family and Companion assignments.

## Explicit deferrals

- Prosperity/HQ thresholds remain unapproved and inert.
- Companion art replacement remains deferred.
- The broader accumulated-wrapper consolidation remains a separate structural phase.
- Public distribution rights for third-party character art require repository-owner confirmation outside the game logic.
