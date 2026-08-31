# Roster catch-up decision record

## Why this is not active yet

The six-Fellow functional roster does not currently need catch-up. A rule becomes necessary before adding a large number of later-acquired characters, but the Locked Core Design does not define its numbers or grant behavior. Phase 11E therefore locks requirements, not arbitrary rewards.

## Required decisions before implementation

1. **Trigger:** acquisition only, first ownership, Player Rank milestone, or a manual player action.
2. **Reference:** Player Rank band, Campaign chapter, owned-roster median, or another authoritative progression marker.
3. **Eligible dimensions:** EXP/Level only, or also shards/rarity. Bond, Relics, Family links, and Companion assignments should remain earned/assigned unless explicitly approved.
4. **Floor and cap:** exact formula, rounding, maximum level, and whether the result may ever exceed the weakest established owned character.
5. **Cost:** free one-time floor, Gold-funded catch-up, or staged rewards.
6. **Existing saves:** whether newly introduced roster definitions receive the rule on upgrade and how the grant is receipted without replay or duplication.
7. **Transparency:** exact preview and result copy before any irreversible grant.

## Invariants already safe to lock

- Catch-up cannot reduce any existing value.
- It cannot grant Player Rank, Prosperity, Gold, Might, Mastery, Gifts, Relics, or relationship progress as a side effect.
- It must be bounded, deterministic, idempotent, validated, and represented in migration/reward provenance.
- It must preserve the locked total-owned-roster Power rule rather than create a selected-team exception.
- It must have fresh, migrated, interrupted-write, replay, and large-roster test vectors before roster expansion ships.
