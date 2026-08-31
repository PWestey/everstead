# Roster catch-up decision record

## Status

Approved for the Phase 11F Fellow expansion and implemented in Phase 11G.

This decision is intentionally narrow. It governs the twelve Fellows introduced together in Phase 11F. A later acquisition system or another roster expansion must either reuse this rule explicitly or create a successor decision.

## Deterministic access rule

- The six established progression slots are the Rank 1 starting roster.
- Three of the twelve additions join at each Player Rank from 2 through 5.
- Every character remains visible in Fellowship and the Codex before joining.
- No pull, random acquisition, premium currency, or selected-team Power exception is introduced.
- A previously used added Fellow is grandfathered immediately. Use means that the pre-activation save records progression, assignment, equipment, focus/featured status, or participation in a persisted team or operation.

## Catch-up grant

- Trigger: one-time Phase 11G roster-profile activation.
- Reference: the weakest Level among the six established Fellows immediately before activation.
- Grant: only enough cumulative EXP to reach the start of that Level.
- Eligible recipients: the twelve Phase 11F additions, including characters whose deterministic Rank unlock is still ahead.
- Existing higher EXP is never reduced.
- Cost: free.
- Rounding: the canonical cumulative EXP threshold for the reference Level.
- Cap: the ordinary Fellow Level cap.

The grant never includes shards, rarity, Bond, Relics, Family links, Companion assignments, Player Rank, Prosperity, Gold, Might, Mastery, Gifts, or any other resource.

## Provenance and replay safety

The activation records a single `phase-11g-roster-progression` profile receipt inside schema 12. It contains:

- exact pre-activation identity;
- activation revision and time;
- Campaign run-count and clear-prefix baselines;
- pre-activation Fellow EXP and rarity maps;
- the calculated Level/EXP floor and exact per-Fellow grants;
- grandfathered Fellow IDs; and
- a bound initialization identity.

The receipt is deterministic and idempotent. Validation projects Phase 11G rewards and catch-up back onto the released Phase 11F rules, then runs the existing schema-12 validator. This preserves the protected checkpoint and recovery-file topology while proving that redirected Campaign rewards reconcile exactly.

## Campaign progression rule

Each Campaign stage has a fixed three-Fellow Rank-group pool. The target advances deterministically on each run of that stage. The preview names the next recipient before Gold is spent. EXP and targeted shards follow the named Fellow; there is no random recipient.

This makes every Fellow reachable through normal play while retaining total-roster Power gates and the existing deterministic reward/Relic history.

## Invariants

- Catch-up cannot reduce any existing value.
- Reapplying activation cannot duplicate the grant.
- Campaign target selection is deterministic from the activation baseline and stage run count.
- Post-activation Fellow ascensions remain reconcilable in the compatibility projection.
- Locked additions do not contribute to Campaign or Village roster Power.
- Existing meaningful use is preserved rather than silently relocked.
