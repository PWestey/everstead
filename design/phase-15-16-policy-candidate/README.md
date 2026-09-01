# Phase 15–16 candidate product policy package

This directory turns the frozen Waystone/Legacy and Restaurant definitions into a complete, reviewable **candidate** product policy. It does not authorize runtime integration. Every registry is production-disabled, and runtime must reject `candidate-root-review-required` until root review produces a separately versioned approved package.

## Outcome

- Legacy has proposed thresholds, exact reward payloads, claim ordering, and a three-standard-claim Founding Cache rule.
- Restaurant has a proposed 30-minute cadence, 12-customer non-expiring bank, 52-row fixed structural-production reward table, three recipes, two stations, local Reputation/Mastery curves, stock rules, named visitor, and fixed achievements.
- Recurring Restaurant Gold is modeled at 5–15% of structural passive production for all five representative profiles. Values are fixed tables, not a permanent percentage multiplier.
- All 12 accepted Phase 15–16 tutorials have contextual timing and localization-safe semantic step keys.
- All 38 current actors remain in the accepted schedule: five appear in Phase 15, seven in Phase 16, and 26 remain scheduled for later phases. A Fellow may speak only after joining.
- Sixty deterministic fixtures cover enablement, released-reward lineage, claims, non-expiry, offline boundaries, migration, concurrency, tutorials, cast fallbacks, reward boundaries, and five-year storage.

## Files

- `PRODUCT_POLICY_CANDIDATE.md` — human review contract and candidate tables
- `policy-candidate.json` — proposed mechanical policy, still disabled
- `restaurant-reward-table.json` — 52 immutable candidate payout rows used by runtime lookup only
- `generate_reward_table.py` — deterministic build-time provenance; its ratios are forbidden at runtime
- `tutorial-timing.json` — gradual non-blocking presentation timing
- `copy.en.json` — original candidate English copy and authored cast lines
- `cast-schedule.json` — exact 38-actor disposition and Phase 15–16 hook subset
- `decision-ledger.json` — existing approved facts versus candidate recommendations and review blockers
- `fixtures.json` — QA-only deterministic acceptance inputs and expected outcomes
- `simulate.py` / `simulation-results.json` — reproducible balance and five-year storage projection
- `validate.py` — source-freeze, reference, policy, guardrail, content, fixture, and simulation validation

## Validation

From the repository root:

```sh
python3 design/phase-15-16-policy-candidate/validate.py
```

The validator is intentionally limited to design/data. It does not test runtime integration, UI layout, browser behavior, localization rendering, editorial approval, save migration, or exact-once persistence in the shipped app. Those remain release gates after product approval and implementation.

Phase 13 and the frozen Phase 15–16 contract each accept one exact source-tree identity. The cross-phase audit dependency accepts exactly its original reviewed tree and the reviewed `a12d52e` integration-portability successor tree; any other audit mutation fails validation.
