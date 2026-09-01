# Phase 17 Book I runtime seam

## Status

Private-candidate foundation. Public release remains disabled.

Sequential base: accepted Phase 16 tip `fe9bdfb7ea380396e1189af0739234b6337a447e`.

## Integration topology

The runtime is deliberately split into two new files and a narrow closure-owned adapter:

1. `src/phase17-book1.js` is loaded with the other immutable external definition registries, before the main application script.
2. `src/phase17-runtime.js` publishes only a frozen `version`/`install(adapter)` factory and is also loaded before the main application script.
3. The existing main closure constructs a frozen explicit adapter after the inherited activation seams and before the first render. The adapter exposes only accessor functions and replaceable leaf-function slots for the state, save coordinator, Campaign, Village, More, modal, and QA capabilities Phase 17 actually needs.

This order lets the real Phase 17 implementation run inside the application's lexical boundary without `eval`, caller callbacks, direct storage, or broad production globals. The only durable external module surface is the frozen installer; the Phase 17 QA bridge is published only in an authorized isolated test realm. The runtime does not rename existing namespaces, change the five-tab navigation, or duplicate the save coordinator.

## Enablement

- `publicRelease` and the definition registry's `productionEnabled` remain `false`.
- The reviewed private candidate activates only under the existing local/query-gated, explicitly destructive QA capability with an explicit isolated-storage attestation and an exact non-native-storage identity check.
- Missing or invalid definitions/capabilities leave the runtime fail-closed.

This lets the private candidate exercise the real story/Chronicle/UI path without publishing unfinished Book I content.

## Ownership

Phase 17 owns the optional strict `storyV1` successor object, deterministic Book I queue, Chronicle projection, story-driven facility discovery projection, derived Village changes, and `player.wayfarer` presentation seam. Existing Player Rank and Fellow Campaign truth remain authoritative.

The predecessor Phase 13 story is migrated into bounded `migrated-recap` records when committed truth exists. Its presentation is suppressed while the successor is active, but its stored history is preserved. The first-clear Campaign operation still commits before the Phase 17 resolution queue commit.

Story reward definitions remain null and disabled. The QA-only synthetic reward uses the already registered `opportunity.story.reward` immutable Phase 15 V2 finalizer; no caller callback or auto-payment path is introduced.

## Player character

`player.wayfarer` is a separate Player Character tied to `player.rank` and `player.rankExp`. It is not a Fellow, Family member, Companion, roster count, shard/rarity unit, assignment target, facility speaker, or combat-Power unit.

The supplied 1024×1536 RGB full-background source is rendered by the title/player profile at its declared native aspect ratio in a full-screen background treatment. The profile exposes Player Rank and the Rank EXP roadmap, returns focus on button-close and Escape, and marks the character's explicit exclusion from rosters, shards, and assignments.

Because no approved transparent Campaign asset exists, Campaign uses the exact approved full-background source in a clearly framed, static CSS crop. The background remains visibly present and the UI makes no transparency, walking-animation, or cutout claim. The original Everstead CSS silhouette remains the deterministic image-load fallback.

## Sequential Phase 16 dependency

Phase 17 must be retargeted onto the accepted Phase 16 Restaurant runtime and preserve all five inherited Restaurant attestations. Phase 17 does not emulate, grandfather, or approve Phase 16 economy. Its private bridge reports the inherited definition and bridge version from the actual sequential candidate.

## Verification boundary

The focused verifier executes the real installer against both an authorized isolated adapter and an ordinary disabled adapter; source strings alone do not satisfy the bridge contract. The independent static gate remains deterministic and candidate-portable. The independent live runner is required for actual DOM, storage isolation, browser focus/Escape, five realms, copy expansion, computed reduced-motion styles, and inherited Phase 16 attestation.
