# Phase 11A — Daily-use clarity contract

## Objective

Correct the highest-impact misleading or noisy player-facing details after Phase 10C without changing save schema 11, reward outcomes, economy arithmetic, Campaign eligibility, or persistence authority.

## Dependencies

- Exact base: `ac7592348c1a11668822b0355ae86ab6db1b2688`.
- Phase 10C economy profile, schema-11 lineage, mobile modal behavior, and three-phone QA remain authoritative.
- Locked Core Design v1.2 remains product authority. Unresolved Prosperity and Type/Role mechanics are not invented in this phase.

## In scope

- State that a locked Relic is acquired on the first clear of its source Campaign stage.
- Distinguish Village economy Power from full combat Power wherever the two totals are explained.
- Raise the automatic offline-summary threshold from one minute to fifteen minutes while preserving all accrued rewards and the 24-hour cap.
- Format offline elapsed time without displaying `0.0 hours`.
- Give the top-bar collection, Gift, Gold, and Player Rank controls explicit accessible names and visible abbreviations.
- Remove `quest` from the new/edit Oath type chooser. Existing saved Quest Oaths remain loadable and are identified as legacy daily-cycle Oaths.
- Replace the stale repository status and current-gate guidance in `README.md`.

## Out of scope

- Save import, rollback, backup management, migration-history UI, and normal-user reset; these form Phase 11B.
- Auto-repeat, auto-claim, or stop-condition automation.
- New Prosperity mechanics or Type/Role combat effects without a locked design decision.
- Live pending-Gold timers, navigation persistence changes, or render-architecture consolidation.
- Balance, rewards, roster content, or schema changes.

## Acceptance criteria

1. Locked Relic cards and details name first-clear acquisition and never instruct the player to replay for the initial copy.
2. Village economy summaries identify their narrower formula; Campaign continues to identify full combat roster Power.
3. Offline accrual below fifteen minutes remains claimable but does not auto-open the summary. Exactly fifteen minutes or more does.
4. Offline duration copy uses minutes below one hour and a human-readable hour/minute form afterward.
5. Top-bar collection, Gift, Gold, and Player Rank values have explicit accessible labels; visible currency text is understandable without relying on symbols alone.
6. New Oaths cannot be created as Quest. A legacy Quest remains editable without silent data conversion and is labelled as a daily-cycle legacy type.
7. Phase 10C schema, economy, persistence, reward, and embedded-asset checks remain unchanged except for the expected production artifact identity.
8. The affected surfaces pass live browser checks at 320×568, 390×667, and 390×844 with no horizontal overflow, fatal page errors, console warnings/errors, or native storage access in the isolated QA realm.

## Do not break

- Schema 11 and all thirteen protected storage slots.
- Exact Phase 10C production, upgrade, offline-accrual, Campaign, Relic, Rank, and idle-reward arithmetic.
- The 24-hour offline cap and transition-safe pre/post-activation settlement.
- First-clear and replay reward identity.
- Modal focus trap, Escape behavior, focus return, inert background, reduced-motion behavior, and mobile navigation.
- Existing Quest save compatibility.
- The five embedded image payloads.

## Gate strategy

Phase 11A adds a successor verifier and isolated live realm. It reuses the 47-row schema probe and 100-row Phase 10C-2 engine probe, adds focused source/VM checks for every changed contract, and runs the affected player flows at all three required phone sizes. Historical QA packages remain byte-frozen.
