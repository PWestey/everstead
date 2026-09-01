# `player.wayfarer` title-character contract

## 1. Canonical identity

The stable identity is `player.wayfarer`; the visible default title is **The Wayfarer**. This represents the player character, not a collectible unit.

The existing `player.avatarId`, `player.rank`, and `player.rankExp` fields remain authoritative. A visual implementation may map `avatarId: "wayfarer"` to `player.wayfarer`, but must not add a parallel progression record or change Rank derivation.

The Wayfarer has no:

- Fellow, Family, or Companion roster entry;
- owned/unowned state;
- level, Power, rarity, shards, Bond, Intimacy, or Relics;
- Building or Fellow assignment;
- recruitment, draw, unlock, or duplicate loop;
- independent rewards, idle production, or combat contribution.

If the player later receives title/name customization, it is presentation metadata governed by a separate approved design; it cannot change this identity or create another progression source.

## 2. Approved art use

`assets/player/wayfarer-profile-full.png` is the only approved art in this package. It must remain byte-identical to its 1024×1536 RGB source.

Approved uses:

1. title/profile full-background art with safe contrast overlays;
2. non-destructive `object-fit: cover` crops in a framed player card;
3. an attributed framed still inside story when a full-background composition is appropriate.

Implementations define focal coordinates per breakpoint and keep the face, upper body, and meaningful silhouette clear of the top resource bar, sheet close control, Rank label, and primary action. Crop changes are CSS/presentation metadata, not resampled image files.

The image has no alpha. It cannot be displayed as a cutout over the Village or Campaign scene.

## 3. Required unresolved variants

### Dialogue cutout

A true transparent dialogue asset is still required. It must be derived or commissioned separately, approved by the user, and pass alpha/edge inspection. A pixel-art or transparent checkerboard pattern baked into RGB is not transparency and fails closed.

Until approval, Wayfarer dialogue uses either:

- speaker-attributed text without character art; or
- the approved full-background art inside an intentional framed still.

The fallback must never be an unframed rectangular portrait floating over the Village.

### Campaign walking presence

A purpose-built walking sprite or genuine-alpha full-body asset is still required for literal walking. Until approval, Campaign uses an original Everstead silhouette, framed stage marker, or text/crest marker. It must not crop the full portrait and pretend the background is transparent.

Reduced motion always replaces walking/sliding with a static stage state and immediate result transition.

## 4. Profile/title screen

The title/profile sheet opens from the existing player card or Rank affordance; it does not add a navigation tab.

First viewport:

- canonical full-background art;
- `The Wayfarer` title and player identity;
- Player Rank and exact Rank EXP progress toward the next accepted threshold;
- current First Covenant/Campaign context;
- a visible close/back control and scroll cue.

Following content may include Chronicle milestones, Rank unlock explanation, Campaign record, dialogue log, and cosmetic title slots only when those domains exist. It cannot invent rewards or new stored truth.

Opening, closing, scrolling, changing a visual subsection, or replaying presentation is save-neutral.

## 5. Campaign role

The Wayfarer is the journey's point-of-view character. Presentation can show arrival, travel, stage transition, reaction, and result framing. Existing Fellow roster Power, stage cost, stage order, rewards, Rank EXP, and exact-once settlement remain unchanged.

The Wayfarer does not add combat Power. Any copy such as “Your party” or “The Wayfarer leads” is descriptive only.

Campaign presentation sequence:

1. stage and route context;
2. readiness/cost/reward preview from accepted state;
3. one existing run/continue action;
4. static or motion-safe journey transition;
5. exact existing settlement/result;
6. Chronicle or dialogue presentation only after the authoritative outcome, without another reward.

## 6. Dialogue and story role

Authored story may assign lines, response choices, internal observations, and Chronicle summaries to `player.wayfarer`. Choices are narrative presentation unless an independently approved story contract names a consequence.

Rules:

- Wayfarer lines use stable content IDs and localization keys;
- a missing art variant never suppresses or duplicates dialogue;
- skip and replay preserve authoritative story/claim history;
- Wayfarer is exempt from locked-Fellow speaker filtering because the player identity is always present;
- all 38 existing Fellow/Family cast hooks remain available and their accepted eligibility rules are unchanged;
- locked Fellows still cannot be selected for live dialogue;
- the Wayfarer supplements the cast rather than replacing their quotes, story, tutorial, facility, or ambient allocations.

## 7. Tutorial impact

No new tutorial popup is required merely because the art changes. The profile affordance can be included as an extra step in the existing Player Rank/Campaign lesson or exposed in the Tutorial Log.

If a future Wayfarer-specific lesson is approved, it follows the Phase 13 rules:

- contextual and gradual;
- at most one safe auto-presentation on an eligible user-initiated visit;
- Skip, Back, Next, Log, and replay;
- replay and dismissal are reward/state neutral;
- never required for Rank, Campaign, story, facility, claim, or passive production;
- no popup cascade for migrated saves.

## 8. Accessibility and privacy

- Art has concise alt text where semantic and an empty alt value where decorative.
- Rank progress has text and a programmatic value; color is supplemental.
- Text never relies on the image for contrast; use adaptive dark gradients and solid fallback panels.
- Close/back is keyboard operable, at least 44×44 CSS pixels, and returns focus to the invoker.
- The full-screen sheet traps focus, makes the background inert, closes with Escape, and restores scroll position.
- At 175% copy scale and 320×568, identity, Rank, close, and one next action remain available without horizontal page scroll.
- Reduced-motion mode has no automatic pan, parallax, sway, walking, or long slide transition.
- The source image is local; production must not upload it to an external processor or analytics endpoint.

## 9. Acceptance gate

Production remains disabled until all of these are true:

- canonical asset identity and focal treatment are verified at 320×568, 390×844, and 1024×768;
- player Rank and save are byte/semantic neutral under presentation-only actions;
- no roster/shard/assignment path accepts `player.wayfarer`;
- Wayfarer profile and Campaign presence work with the approved full-background asset and declared fallbacks;
- any enabled transparent presentation uses a separately approved genuine-alpha asset;
- cast hooks and locked-Fellow exclusions pass;
- keyboard, focus, Escape, 175% copy, screen reader, and reduced-motion checks pass;
- no literal reference-game trade dress, wording, asset, layout, currency, daily task, or mechanics appear.
