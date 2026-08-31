# Phase 14 shared Village-facility contract

## Status

Design and data contract only. This package changes no production HTML, CSS, JavaScript, save data, feature flag, economy value, or artwork.

## Objective

Define one safe opportunity → interaction → result → manual-claim framework that every Village facility can reuse without making every activity play the same way.

The shared rule is:

> Passive production keeps Everstead progressing. Active facilities bank non-expiring opportunities, and player action creates a result that pays only through an explicit manual claim.

## Files

- `PHASE_14_FACILITY_CONTRACT.md` — lifecycle, economy boundaries, offline/concurrency/migration rules, Phase 12 integration seams, and acceptance gates.
- `DATA_SPEC.md` — canonical definitions, persisted state, identities, versioning, settlement, resolution, and claim shapes.
- `facility-definitions.json` — all twelve Phase 12 facility IDs, their distinct activities, tutorial links, opportunity definitions, and all-cast dialogue hooks.
- `fixtures.json` — implementation and QA fixture catalog with exact preconditions and assertions.

## Dependencies

- Released application base `4ee1ee4` and schema 12.
- Phase 12 foundation config `phase-12-foundation-v1` and definition set `definition-set.phase-12-foundation.v1`.
- Phase 13 cast/tutorial design commit `73b807a36cb0ddb12fe726b3d271f7c4779e5ba9`.
- Existing transaction coordinator, staging/revision conflict detection, storage events, offline 24-hour cap, and recovery authority.
- Economy approval before any production cadence, bank capacity, reward table, or active-profit percentage is enabled.

## Acceptance summary

- All twelve Phase 12 facility IDs appear exactly once.
- Every active facility has a distinct activity, stable local-progress track, participant kinds, and at least one stable opportunity definition.
- Every player-visible facility references gradual, replayable, non-blocking tutorials.
- Every shipped Fellow and Family actor is used by at least one facility dialogue hook.
- Opportunities instantiated in the bank never expire or reset at midnight.
- Offline settlement creates opportunity records only; it never creates spendable rewards or credits resources.
- Resolving an activity creates a version-bound result and claim offer but credits nothing.
- One manual claim transaction applies global rewards, facility-local progression, completion state, and a durable receipt exactly once.
- Reloads and two-tab races cannot duplicate an opportunity, result, local progression, or reward.

## Do not break

- Current passive Building rates, upgrades, Oath modifiers, Family assignments, and offline Gold.
- Phase 12 save authority, empty historical baselines, stable IDs, and canonical reward bundles.
- The 24-hour offline cap and non-resetting banked items.
- Total-roster Power, Campaign, Rank, rosters, Relics, Might, Mastery, and existing claim lanes.
- Bottom navigation and the Village artwork as the physical game board.
- The framed/text-only fallback for speakers without approved transparent cutouts.

## Explicitly unresolved economy inputs

Production definitions deliberately leave `intervalMs`, `bankCapacity`, and reward policy values null. A facility cannot be enabled with null operational values. QA fixtures provide synthetic values solely to verify the framework. This prevents a data contract from silently becoming an economy decision.
