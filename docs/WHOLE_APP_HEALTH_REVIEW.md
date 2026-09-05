# Whole-app health review and bug fixes

Baseline: `430a08f64a60328cc972e4850865b495c9d61c34`.

Scope: public player journeys, mobile screens, cross-system EXP integration, and returning-player/offline behavior. Three parallel reviewers inspected progression, rewards/persistence, and UI. Fixes are integrated and verified by the primary agent.

## Acceptance and preservation

- A fresh public save can complete the Campaign introduction, cancel or accept a run, bank EXP, deliberately invest it, and reload without a protection fault.
- Actual Gold costs and EXP wallet accounting must match the action and its displayed result.
- Inventory must show both EXP balances and route to the correct roster.
- An investment refreshes profile and roster statistics while retaining the Level controls.
- Preserve save schema, raw historical reward receipts, reward formulas, story gates, manual claims, and the 24-hour offline cap.

## Confirmed findings

1. **P1: first public Campaign completion blocked.** A compatibility wrapper projected schema 15 to an older view before calling the new wallet-aware Campaign implementation. The implementation delegated to its predecessor, awarding actor EXP without a corresponding wallet ledger entry. Validation correctly refused the mutation with `invalid-v2-projection`, but the player could not progress. The public entrypoint now retains canonical schema-15 state through the existing story/confirmation chain. Engine-level QA had bypassed this public entrypoint.
2. **P2: outdated Campaign guidance.** The recipient was still described as receiving training. The current screen now explains shared EXP and targeted shards.
3. **P2: More Guide used fixed example costs.** It now reads the selected Campaign stage's actual efficiency preview and identifies that stage.
4. **P2: missing Companion EXP inventory item.** Materials now displays the existing Companion wallet and routes to Companions.
5. **P2: stale profile statistics after investment.** Only the Level panel refreshed. Both EXP interfaces now rebuild the profile and underlying roster from current state, then retain the Level panel and investment controls.
6. **P2: bonus-inclusive EXP reporting.** Companion success toasts and repeat summaries previously displayed raw historical receipt EXP. They now display the committed credited-total difference for the action. Raw receipts and reward calculations remain unchanged. This discrepancy was latent while Collection EXP bonuses were zero in the public preview.

## Verification

`qa/whole-app-health/browser.mjs` uses real public buttons in fresh isolated Chromium contexts, with native browser storage and no destructive QA bridge. It covers the first Campaign story, cancellation, reward, deliberate spending, reload, Guide, Inventory, and refreshed Overview at 390×844 and 320×568.

`qa/whole-app-health/reporting.mjs` checks production presentation functions against bonus-inclusive committed awards while preserving unboosted historical receipts.

Independent offline checks found the same 655,699 Gold claim after both 24 and 25 hours, retained fractional pending Gold, no immediate duplicate claim/revision, and stable collect/reload behavior. The five major screens and 19 local tabs were inspected at mobile widths without a trapped overlay, document overflow, or JavaScript error.

The existing C1 suite additionally covers wallet migration, mixed rewards, source authenticity, repeated claims, spending, ledger folding, import/export/recovery, and mobile Companion investment controls. Historical manifests remain frozen; their old current-artifact hashes are not rewritten to certify this successor.

Final local results: public native-browser journey **30/30**, bonus reporting **5/5**, C1 core/reward/spending **95/95**, successor Companion UI **34/34**, and production smoke **1/1**. The successor UI runner reuses the frozen C1 assertions and changes only the requirement that a missing private-art URL be requested once: rebuilding a roster can request the same approved fallback path again. Exact allowed paths, error accounting, focus, Escape, geometry, and saved-state assertions remain enforced.

The profile refresh also prevents the original spend click from reopening its old profile ancestor and restores investment focus after the inherited delayed close-button autofocus. The combined production changes received an independent source review; the primary agent verified the final mobile journeys.

## Limits

This is a bounded whole-app health pass, not proof that every possible late-game state is bug-free. Safari/physical devices and a complete natural playthrough of all late-game unlocks remain outside this pass. Private facilities and rights-limited Companion portraits retain their existing preview restrictions. Web Storage's lack of atomic compare-and-swap remains a documented architectural limitation.
