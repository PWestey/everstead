# Phase 13 story, cast, and tutorial data specification

## 1. Identity rules

All IDs are permanent, lowercase ASCII, dot-delimited, and independent of visible text.

- Story: `story.<book>.<chapter-or-milestone>.<scene>`
- Tutorial: `tutorial.<domain>.<feature>.<lesson>`
- Profile quote: `quote.profile.<roster>.<stable-roster-id>.01`
- Ambient line: `quote.ambient.<roster>.<stable-roster-id>.<location>.01`
- Localized scene line: `<scene-id>.line.<two-digit-sequence>`
- Localized tutorial step: `<tutorial-id>.step.<step-id>.title|body`

Visible names, titles, translated terms, array positions, stage labels, and asset slugs must never be used as durable identity.

Definition changes use an integer `definitionVersion`. Reward changes use a separate integer `rewardVersion`. Editing copy does not change either identity or replay/claim state.

## 2. Cast record

`cast-plan.json` is design input, not persisted player state.

```json
{
  "roster": "fellow",
  "id": "cael",
  "name": "Kaladin",
  "joinRank": 1,
  "art": {
    "fullPortrait": "assets/portraits/fellows/kaladin.webp",
    "thumbnail": "assets/portraits/fellows/thumb/kaladin.webp",
    "dialogueCutout": "assets/portraits/fellows/village/kaladin.png"
  },
  "profileQuoteId": "quote.profile.fellow.cael.01",
  "ambient": {
    "id": "quote.ambient.fellow.cael.training.01",
    "location": "training",
    "deliveryPhase": 13
  },
  "authoredDialogue": {
    "contentId": "story.book1.prologue.council",
    "deliveryPhase": 13,
    "function": "Defines the safe-passage problem"
  },
  "tutorialIds": ["tutorial.adventure.fellow-campaign.first-stage"]
}
```

`dialogueCutout` is nullable. A null value requires either an attributed text-only presentation or an art dependency before the assigned dialogue is released.

## 3. Scene definition

Scene definitions are immutable content identities. They reference authoritative game facts but do not copy those facts into story state.

```json
{
  "id": "story.book1.chapter1.village-toll.intro",
  "definitionVersion": 1,
  "bookId": "book.first-covenant",
  "chapterId": "book.first-covenant.chapter1",
  "kind": "required",
  "eligibility": {
    "all": [
      { "fact": "campaign.selectedStageId", "equals": "broken-roads-1" },
      { "fact": "campaign.firstClear", "equals": false }
    ]
  },
  "presentation": {
    "surface": "campaign-preclear",
    "replayable": true,
    "skippable": true,
    "loggable": true
  },
  "beats": [
    {
      "id": "01",
      "speaker": { "roster": "fellow", "id": "lyra" },
      "textKey": "story.book1.chapter1.village-toll.intro.line.01",
      "intent": "establish"
    }
  ],
  "completion": {
    "historyOnly": true,
    "rewardDefinitionId": null
  }
}
```

The implementation must validate every speaker against the current cast registry and every fact against an allowlisted eligibility adapter. Content JSON must not evaluate arbitrary expressions or call functions.

## 4. Tutorial definition

`tutorial-matrix.json` is the complete release-planning registry. Runtime definitions derived from it use this normalized shape:

```json
{
  "id": "tutorial.adventure.fellow-campaign.first-stage",
  "definitionVersion": 1,
  "introducedPhase": 5,
  "releaseWave": "rank-1",
  "feature": "fellowCampaign",
  "eligibility": {
    "kind": "firstSafeVisit",
    "surface": "adventure.fellowCampaign",
    "requires": ["story.book1.prologue.council:resolved"]
  },
  "speaker": {
    "primary": { "roster": "fellow", "id": "cael" },
    "fallbacks": [
      { "roster": "fellow", "id": "lyra" }
    ],
    "requireAvailable": true
  },
  "behavior": {
    "blocking": false,
    "skippable": true,
    "replayable": true,
    "loggable": true,
    "maxAutoPresentPerSurfaceVisit": 1
  },
  "steps": [
    {
      "id": "power",
      "anchor": "campaign.total-roster-power",
      "titleKey": "tutorial.adventure.fellow-campaign.first-stage.step.power.title",
      "bodyKey": "tutorial.adventure.fellow-campaign.first-stage.step.power.body"
    }
  ]
}
```

Anchors are semantic UI tokens, not selectors. The presentation adapter maps an anchor to the current DOM. If an anchor is unavailable, the tutorial opens as an unanchored sheet rather than failing.

## 5. Tutorial state

Phase 12 should define the actual schema version and migration receipt. The minimum conceptual state is:

```json
{
  "tutorial": {
    "seenIds": [],
    "dismissedIds": [],
    "completedIds": [],
    "pendingIds": [],
    "lastAutoPresentedAt": null,
    "lastAutoPresentedSessionId": null
  }
}
```

Rules:

- Arrays contain unique, known tutorial IDs in canonical registry order.
- `completedIds` and `dismissedIds` imply `seenIds`.
- `pendingIds` contains no completed or dismissed ID.
- Replaying a tutorial does not change these sets.
- Tutorial state never stores resource eligibility or story completion.
- Session throttling may remain ephemeral; only durable suppression/history belongs in save data.
- Removing or renaming an ID requires an explicit alias/migration, never silent replay.

## 6. Speaker selection

Resolve the first candidate that satisfies all conditions:

1. The roster and stable ID exist.
2. A Fellow is joined under current Rank/grandfathering rules.
3. The content does not claim a character occupies a facility that has not been introduced.
4. Art is available, or the surface supports the required attributed text-only fallback.

Selection is deterministic in `primary`, then `fallbacks` order. It does not write to the save.

## 7. Localization contract

- Definitions contain localization keys, not concatenated English sentences.
- Variables are named placeholders such as `{requiredPower}`, `{goldCost}`, `{rank}`, and `{facilityName}`.
- Do not splice a character's first name with grammar-dependent suffixes.
- Buttons use shared keys for Next, Back, Skip, Close, Replay, and Log.
- Speaker names and titles are localized separately from dialogue.
- A translated line may be 175% of the English length without losing controls or requiring horizontal scrolling at 320 CSS pixels.
- Screen-reader announcements contain the speaker name and line but omit decorative intent labels.

## 8. Feature-to-tutorial validation

Before a player-visible feature is enabled, validation must prove one of:

- the feature references at least one valid tutorial definition; or
- the feature is explicitly declared `notPlayerVisible` with a reason.

The validation checks:

- unique tutorial IDs and step IDs;
- known phases, surfaces, features, trigger kinds, roster IDs, and story/facility references;
- non-empty primary speaker and deterministic fallbacks;
- `blocking` is always false for this contract;
- replay, skip, and log are enabled;
- every localization key is present;
- no tutorial reward exists;
- no tutorial is a prerequisite in gameplay eligibility;
- every cast member has a profile quote, ambient assignment, and authored dialogue assignment;
- every declared art path exists or is null with a documented dependency;
- all IDs are ASCII lowercase dot-delimited tokens; story and tutorial IDs contain no visible cast name, while quote IDs use the required stable roster code ID even when that legacy code ID resembles a visible name.

## 9. Events consumed by tutorials

Tutorial eligibility may observe only committed or neutral UI events:

- `app.fresh-started`
- `surface.opened`
- `oath.first-completed`
- `gold.first-claimed`
- `building.first-opened`
- `campaign.preclear-requested`
- `campaign.first-clear-committed`
- `player.rank-crossed`
- `roster.profile-opened`
- `resource.first-observed`
- `assignment.first-opened`
- `idle-reward.first-ready`
- `story.scene-resolved`
- `legacy.reward-ready`
- `facility.discovered`
- `facility.unlocked`
- `facility.first-opportunity-ready`
- `facility.first-claim-committed`
- `facility.level-crossed`

Tutorials do not synthesize these events, mutate their source systems, or consume rewards.

## 10. Migration and retroactivity

- Phase 12 assigns an activation baseline for existing profiles.
- Existing-feature tutorials default to available in the Tutorial Log, not pending popups.
- The current objective/story-controls tutorial may auto-present once because it introduces new Phase 13 behavior.
- Later feature tutorials become pending only when that feature's post-activation discovery/unlock event occurs, or through a single bounded recap item for already-qualified established saves.
- A Rank jump processes crossed arrival scenes and tutorial eligibility in ascending Rank order.
- A story skip records the same scene-resolved eligibility as watch completion but not a fictitious `watched` statistic.
