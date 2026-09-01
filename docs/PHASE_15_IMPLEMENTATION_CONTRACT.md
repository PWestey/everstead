# Phase 15 — Physical Village facility foundation

## Objective

Turn the existing Village artwork into the shared twelve-location game board and install the save, tutorial, opportunity, exact-once claim, and bounded archive seams required by later facility phases. Phase 15 does not enable Restaurant gameplay or invent any production economy value.

## Dependencies and authority

- Accepted integration base: `7beccb88676b75910e99c43bb78bc895553dfe5f`.
- `design/phase-14` owns the shared non-expiring opportunity/manual-claim lifecycle.
- `design/phase-15-16` owns the Phase 15 tutorial successor, trusted finalizer, and V2 claim archive.
- `design/phase-17` owns the twelve canonical physical anchors. Its facility-scoped anchors supersede the six broad predecessor aliases.
- `design/phases-14-21-audit` owns cross-phase identity and fail-closed release constraints.

## Acceptance contract

### Save lineage and anchors

- Keep schema version 12, the existing storage namespace, and exactly one Phase 12 foundation activation receipt.
- Add one exact, ordered, save-bound Phase 15 successor receipt and profile. Validation projects only known Phase 15 fields from a clone before invoking unchanged predecessor authority.
- Canonicalize the six broad predecessor anchors only in the context of their exact facility IDs. Migration is idempotent, never guesses between plaza structures, and never mutates live state during validation.
- Fresh and established saves gain no retroactive opportunity, reward, claim, completion, or known historical activity.

### Tutorial successor

- Preserve the authoritative 79-tutorial ID ledger under `tutorial-registry.phase-15.v1`.
- Enable only the five Phase 15 board/Legacy tutorial definitions. They are contextual, gradual, non-blocking, immediately skippable, loggable, replayable, and rewardless.
- At most one relevant tutorial may auto-present on its exact safe, user-initiated surface visit. Board guidance belongs on the Village; Legacy track/claim/feat guidance belongs at the Waystone. Story, recovery, result, and claim presentation suppress auto-open.
- Every semantic tutorial step has distinct visible copy and one canonical primary speaker. Replay and log views are separate from completion and never award resources.

### Claims and archive

- Migrate Phase 12 pending offers and receipts atomically into `claim-archive.phase-15.v1` before removing the predecessor claim store.
- Retain 512 recent receipts. The 513th folds the oldest 128 into one save-bound checkpoint. The migrated V1 predecessor-ID set stays fixed and bounded; folded V2 facility history uses canonical domain claimed-ordinal ranges, while finite Story/Legacy sources use their definition-derived permanent progress authority.
- Preserve every pending Phase 12/13 Story or Legacy offer and every historical receipt during activation. After activation, all predecessor offer creation, reads, and claims route through V2; `rewardClaims` is no longer a second active authority.
- Store source type, source ID, facility/domain ordinal, definition version, reward-policy version, pending identity, and reward snapshot in every V2 receipt. Fold checkpoint aggregates are allowlisted by actual captured source type.
- Claim finalizers are captured by an immutable production registry. UI and QA callers cannot inject callbacks.
- Manual, non-expiring claims use one validated clone → mutation plan → global/local application → receipt/checkpoint → validation → persistence transaction. Missing, throwing, stale, malformed, or unregistered finalizers write nothing.

### Facility board and shared lifecycle

- Render exactly twelve compact hotspots on the existing Village artwork, in the canonical Phase 17 anchor order.
- Derive `hidden`, `discovered`, `available`, and `ready` from story, capability, opportunity, and claim authority. Hidden locations are non-interactive and non-spoiling.
- Keep five bottom-navigation items. A selected-location sheet exposes name, activity, status, and next action.
- Targets are at least 44×44 CSS pixels, keyboard and screen-reader usable, non-overlapping at supported widths, focus-returning on Close/Escape, and reduced-motion safe.
- Extend the predecessor Village output so the Phase 13 First Covenant objective and all prior overlays survive; replace only the four legacy building hotspots when their Phase 15 board equivalents are active.
- Waystone remains authored-event-only and presents native Story/Legacy claims; it never creates an interval or duplicate facility claim.
- The synthetic Command Center policy is available only inside authorized isolated QA storage. All production interval/capacity/reward policies remain null and fail closed.
- Banked opportunities are deterministic and non-expiring. Offline settlement may bank eligible work within the existing 24-hour allowance, but never chooses, resolves, rewards, claims, or completes a tutorial.

## Do not break

- Passive Building Gold, levels/upgrades, Oath multipliers, Family assignments, and the 24-hour offline cap.
- Existing Phase 12/13/14 Story, Chronicle, Legacy, tutorial, claim, save/recovery/import/export, and QA behavior.
- Player Rank, Campaign, total-roster Power, Relics, Might, Mastery, all roster progress, mobile navigation, full profile art, and approved dialogue treatments for all 38 cast members.
- Dormant old Story, Tower, Trading, Patrol, and Operations modes.
- No storage-key rename, schema increment, sixth navigation item, facility currency, stamina, daily reset, expiry, automatic claim, caller-supplied finalizer, placeholder production economy, new public art, or unapproved CSS treatment.

## Verification

- Focused pure/state probe for definition identity, facility-scoped anchor migration, exact successor validation, 79-ID tutorial preservation, V2 archive folding, claimed ranges, deterministic settlement, and fail-closed invalid state.
- Static and live independent Phase 15 gate across 320×568, 390×844, 1024×768, reduced motion, and 175% copy.
- Fresh, established, migrated, offline, reload, export/import, recovery, corruption, future-version, finalizer-failure, and two-client settlement/resolve/claim fixtures.
- Recovery uses a genuinely pending, valid revision-successor staging envelope; DOM fixtures are isolated from the delayed opening-story callback without weakening production story precedence.
- Passive regression compares building levels, Family assignments, and rates at the captured activation time, excluding legitimate calendar-day rollover markers.
- Inherited Phase 12, Phase 13, and Phase 14 focused and independent regressions.
