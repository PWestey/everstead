# Everstead Phase 11D — Roster and Codex Result

Status: **PASS (local candidate)**

Production implementation: `416054ab179c5543f246a544e9e603f4c1c0f81c`

## Delivered

- Fellows, Family, and Companions now have deterministic, display-only sorting and filtering. The controls are ephemeral, resettable, save-neutral, and explicitly connected to the Fellowship panel.
- Family Building assignments now preview every affected Building plus total Village Gold/hour before an explicit Apply. Move, replace, unassign, no-op, cancel, stale, blocked, and failed-write paths retain the existing transaction authority.
- Companion assignments preserve the existing Power preview, disable no-op Apply, and refresh an active Assigned/Unassigned roster filter immediately after a successful change.
- Relic equipment now shows current-to-projected Fellow Power for equip, move, replace, and unequip from both Fellow and Relic profiles. Locked and no-op choices remain disabled.
- More now contains the read-only Everstead Codex with Overview, Fellows, Family, Companions, Relics, and Journey tabs. It shows the exact 6/3/2 character rosters, 6 Relics, 4 Buildings, current assignments/equipment, Rank routes/milestones, Campaign/Tower/Expedition records, Might, Mastery, and authoritative current access state.
- Prosperity is presented honestly as lifetime, non-spendable Village progress with no current Gold or Power effect and no invented HQ thresholds. Oath celebrations now visibly include the existing Easy +2, Medium +4, and Hard +7 awards.
- Locked Relic instructions preserve Phase 11A truth: fresh uncleared sources say “First clear,” while retained/migrated clears say “Complete.”

## Compatibility and safety

- Save schema remains 11. No storage key, migration, transaction source, reward, threshold, combat counter, or persisted UI field was added.
- Roster state, Codex tabs, previews, sorting, and filtering are runtime-only. Preview/cancel creates no save write; Apply delegates to the existing verified assignment/equipment transactions.
- Total owned-roster Power remains authoritative. Types and Roles remain descriptive; Prosperity remains mechanically neutral.
- The five embedded assets retain the exact Phase 11C aggregate identity.

## Verification

- Phase 11D focused probe: **103/103**.
- Phase 11C focused regression: **83/83**.
- Phase 11B save/recovery regressions: **286/286** (42 + 8 + 103 + 133).
- Live browser gate: **385/385 twice** across 320×568, 390×667, and 390×844 in both normal and reduced-motion modes.
- Live realms reported zero unexpected warnings/errors, zero native-storage access, no horizontal overflow, correct modal/focus behavior, correct 44px controls, and bounded writes.
- Independent design-authority, UX/accessibility, and QA-adequacy reviews are recorded in the sealed manifest.

## Residual boundaries

- Sorting/filtering and Codex category state intentionally reset after reload.
- The Codex reflects implemented definitions and current state; it does not invent future content, story, Village/HQ thresholds, or Type/Role combat mechanics.
- Web Storage still has no atomic compare-and-swap. Existing revision, raw-identity, staging, storage-event, and receipt checks narrow and detect conflicts but cannot eliminate the final browser-level race.
- Content expansion, deeper accessibility/device validation, balance changes, and post-V1 presentation features remain later work.
