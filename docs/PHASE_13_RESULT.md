# Phase 13 — First Covenant result

## Outcome

Phase 13 is implemented as a composition over the accepted schema-12 Phase 12 foundation. It adds the five locked First Covenant scenes, a visible Waystone objective, Chronicle read/replay/log presentation under More, gradual non-blocking tutorials with Skip and Replay, a continuing Oath Legacy track, the first-Campaign-clear feat, and banked manual claims through the existing exactly-once claim transaction.

No Phase 13 action rewrites Oaths, Gold, Prosperity, roster progression, Campaign history, Player Rank, offline timing, save lineage, or recovery checkpoints. Fresh and established profiles activate idempotently without inventing historical story, Chronicle, Legacy, tutorial, or reward activity.

## Shipped content and presentation

- Five declared scenes and five matching Chronicle entries use stable definition-derived IDs.
- The opening cast is intentionally limited to Tavi, Kaladin, Vex’ahlia, Rumi, Hera Syndulla, Darrow, Zamorak, and Deadpool.
- All 18 Fellows and 20 Family members retain a stable profile quote, ambient quote identity, and authored-dialogue eligibility for later chapters.
- Tavi, Kaladin, Darrow, and Zamorak use approved transparent Village cutouts. Vex’ahlia, Rumi, Hera Syndulla, and Deadpool use reviewed framed portraits; none use unframed full-background art in dialogue.
- At 320×568 the four story controls remain simultaneously visible in a compact row; unusually long dialogue scrolls inside its copy panel without horizontal overflow.
- Bottom navigation remains at five items. Chronicle, Tutorials, Legacy, and the Waystone entry point live under the existing Village/More structure.

## Persistence and safety

- Phase 13 writes only through the existing clone, validate, commit, and adopt coordinator.
- The Phase 13 validator projects out its own branch before invoking the Phase 12 validator, then validates Phase 13 history and references against immutable definition-derived registries.
- Phase 12’s activation receipt remains unique and unchanged; Phase 13 adds no new schema lineage or migration checkpoint.
- A blocked-transaction probe proves that a refused story event leaves both the in-memory state and persisted raw payload unchanged and performs no storage write.
- Scene playback and tutorial replay are reward-neutral. Legacy and story rewards are offers first and pay only through the Phase 12 exactly-once claim path.
- Missing Phase 13 definitions leave the accepted Phase 12 build playable and unactivated; malformed Phase 13 definitions fail closed.

## Verification

- Phase 13 focused deterministic probe: 21/21 passed.
- Inherited Phase 12 focused probe: 57/57 passed.
- Phase 11G focused behavior: 28/28 passed. Its frozen release identity and historical manifest are intentionally superseded.
- Phase 11H successor behavior: 73/74 passed; the only failure is its frozen historical artifact manifest. All cutout, original-art, syntax, schema, mobile, and focused progression checks pass.
- Root mobile smoke at 320×568: all Back, Next, Skip, and Log controls visible; modal client and scroll height both 332px; no horizontal overflow.
- Inline application and external Phase 13 module syntax/definition validation pass.

## Deferred and unchanged

Old Story, Tower, Trading, Patrol, and Operations stay dormant. Phase 13 does not add Restaurant or other facility activities, later Book I chapters, later arrival scenes, additional cutouts, or post-V1 systems. Those remain successor-phase work.

The independent Phase 13 live matrix remains the final integration gate before this candidate can be merged.
