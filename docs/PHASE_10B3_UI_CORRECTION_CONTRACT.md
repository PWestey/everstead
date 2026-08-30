# EVERSTEAD — PHASE 10B-3 UI CORRECTION CONTRACT

## Status

**IMPLEMENTATION CONTRACT — PRODUCTION CHANGE PENDING.**

This contract and its additive preimage QA package may be committed without changing `index.html`. A later production commit may implement only the UI corrections and source windows defined here. The primary integrator must independently review that production commit before evidence is sealed, merged, or published.

## Authority and immutable base

- Start from exact clean canonical commit `14efe7f0c85c91c78d3bb3e79049694fd0975d07`.
- The accepted Phase 10B-2 executable package commit is `a3c72f87521b6ae1c097ce738733b98a10489da8`; the local evidence seal is the base commit above.
- The accepted production artifact is `index.html`, SHA-256 `faa5c5fb11785a620f51de5864ec4cda4433bfbc27faaa2359247d9b39c07e75`, byte length `18,928,361`.
- The five embedded assets remain byte-identical with aggregate SHA-256 `26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a`.
- `CURRENT_SCHEMA_VERSION` remains 10. The compatibility storage namespace and all twelve protected storage slots remain unchanged.
- `EVERSTEAD — LOCKED CORE DESIGN v1.2`, Drive file `1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg`, remains product authority.
- `EVERSTEAD — IMPLEMENTATION ROADMAP v1.0`, Drive file `1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900`, remains migration-order authority.

Any base mismatch is a blocker. Do not alter tests, evidence, or production to make a different base appear conformant.

## Objective

Correct a bounded set of verified player-interface defects without changing game rules, resources, save bytes, migrations, reward arithmetic, or navigation persistence:

1. render exactly one Relic summary for each Fellow card;
2. keep every Village Building hotspot visible and directly tappable on short phones;
3. make the large Village collection action readable;
4. remove or QA-gate internal implementation terminology from normal player screens;
5. name the combined roster destination `Fellowship`;
6. give Oath actions meaningful visible and accessible labels;
7. make the existing modal system a keyboard-operable semantic dialog;
8. expose correct selected-state semantics and keyboard behavior for Fellowship roster tabs; and
9. replace the Habit card's bare numeric action with a clear `+1` action while preserving the count.

This is a UI-correction pass. It is not economy integration, rebalancing, schema work, or a new gameplay phase.

## Exact scope

### 1. Per-Fellow Relic summary

- Every rendered Fellow card owns exactly one Relic summary inside that card's `.char-copy`.
- An unequipped Fellow displays exactly one `No Relic` summary.
- An equipped Fellow displays exactly one `.relic-summary` containing the equipped Relic name, level, and bonus.
- The implementation must target the Fellow card by stable `data-fellow` identity. It must not use a first global text match such as repeated replacement of the first `0 EXP` occurrence.
- Across the six-card roster, the total number of Relic summaries is exactly six in both the all-unequipped and one-equipped fixtures.
- Do not change Relic ownership, acquisition, equipment, upgrade, confirmation, Power, or persistence behavior.

### 2. Short-height Village layout

At exact viewports `320×568`, `390×667`, and `390×844`:

- Training Grounds, Command Center, Archives, and Hearth remain visible semantic buttons.
- Each Building hotspot has a rendered size of at least 44×44 CSS pixels.
- No Building hotspot intersects `.village-hud`, `.bottom-nav`, or `.topbar` by more than one device-independent pixel in either axis.
- The center point and four inset quadrant points of each hotspot resolve through `document.elementFromPoint` to that hotspot or its descendant.
- No Building hotspot is clipped outside the viewport or app shell.
- The Village has no horizontal overflow.
- The 390×844 composition should remain visually equivalent to the accepted tall-phone layout except for changes required by this contract.

Use a short-height layout rule or equivalent responsive correction. Raising hotspot `z-index` alone is insufficient because controls must remain readable rather than merely stealing clicks through the HUD.

### 3. Village collection contrast

- The large `.patrol-row .btn.primary` collection action uses an opaque dark background `#08131e` and foreground `var(--gold)` (`#f1c76b`) or another independently reviewed pair with at least 4.5:1 text contrast.
- The button retains its full-width layout, `COLLECT VILLAGE` wording, icon, and existing collection action.
- Contrast is measured from computed foreground and opaque computed background, not inferred from class names.
- The compact top-bar collection control is outside this defect and must remain usable.

### 4. Player copy versus QA diagnostics

Normal player DOM must not expose implementation-phase or test-oracle language. The literal contents of the explicitly requested read-only Save Export payload are exempt because they must preserve exact recovery bytes; the surrounding Save Export heading and help copy are not exempt. Outside that payload, the following terms are forbidden in visible normal-play text, case-insensitively, unless an explicit local/query-gated QA surface is active:

- `Phase` followed by a number;
- `schema`;
- `epoch`;
- `deterministic`;
- `Campaign history capacity`;
- `neutral hook` or `neutral hooks`;
- `formula order`;
- reward labels using `nominal`; and
- the cost label `Actual Gold`.

Use these player-facing replacements:

- `Actual Gold` → `Your Cost`;
- `Deterministic Relic result` → `Relic Reward`;
- `Campaign history capacity` and the normal capacity card → remove from normal play;
- a reached Campaign ceiling → `Campaign history is full. Update Everstead before running more stages.`;
- `Save schema` → `Save Version`;
- phase-number headings → stable feature names such as `Campaign Guidance`;
- Building `Production formula` → `Production Details`; and
- reward `nominal` → the actual resource name, such as `Might earned` or `Mastery earned`.

Exact limits, identities, counters, and formulas remain available through the existing QA bridge and diagnostics. Removing normal copy must not remove a safety check or change a diagnostic value.

### 5. Fellowship destination label

- The third bottom-navigation label is exactly `FELLOWSHIP` while its persisted route remains exactly `fellows`.
- The destination heading remains `Fellowship` and retains Fellows, Family, Companions, and Relics.
- Do not rename the route, state value, `data-nav`, storage field, or QA action.
- The label must fit without horizontal overflow at 320 px width.

### 6. Oath action labels and Habit action

Each `.oath-check` has an exact action-oriented accessible name derived from escaped player content:

- incomplete non-Habit: `Complete Oath: <title>`;
- completed non-Habit: `Undo Oath completion: <title>`;
- Habit: `Log Habit: <title>. <count> completed today.`

Habit controls display visible `+1`, not the current count. The current count remains visible in the Oath metadata as `<count> today` and remains present in the accessible name.

Disabled rest-day controls keep the incomplete accessible name and native disabled state. Existing completion, Undo, boost, reward, count, and persistence behavior remains exact.

### 7. Semantic modal lifecycle

Reuse the existing overlay/modal visuals and content. Every open modal must:

- expose one `.modal[role="dialog"][aria-modal="true"][aria-labelledby="everstead-modal-title"]`;
- assign `id="everstead-modal-title"` to exactly one first modal heading;
- be programmatically focusable and move focus inside the dialog after opening;
- make the background application inert while open;
- trap `Tab` and `Shift+Tab` within the current dialog;
- close on `Escape` without mutating gameplay state;
- retain overlay-click and explicit-close behavior;
- restore focus to the connected, enabled invoking element after close; and
- install no duplicate or leaked document listeners across repeated opens/closes.

If a modal has no focusable descendant, focus the dialog container. Modal state, return-focus state, and generated heading identity are transient DOM/runtime state only and must never be persisted or exported.

### 8. Fellowship roster-tab semantics

All Fellowship variants, including the Relics tab, use one semantic tab set:

- container: `role="tablist"` and `aria-label="Fellowship roster"`;
- each control: `role="tab"`, deterministic ID, exact `aria-selected="true|false"`, `aria-controls`, and roving `tabindex` (`0` selected, `-1` unselected);
- one active content container: `role="tabpanel"`, deterministic ID, and `aria-labelledby` pointing to the selected tab;
- exactly one selected tab and one panel; and
- `ArrowLeft`, `ArrowRight`, `Home`, and `End` move and activate tabs with wrapping at the ends.

Pointer and keyboard activation must delegate to the existing `setRoster` path exactly once. Do not change its save/revision behavior in this phase.

## Production mutation boundary

The later production implementation may modify only `index.html`, and only the existing UI CSS, renderer, and event-binding responsibilities needed for the scope above:

- Village HUD/hotspot and collection-button CSS;
- `bottomNav`, `oathScreen`, `rosterScreen`/Relic roster decoration, and player-copy renderers;
- `showModal`, `closeModal`, and modal binding/lifecycle helpers;
- Fellowship roster-tab binding; and
- user-facing copy at existing Building, Campaign, Expedition, Tower, Relic, and More render points.

Do not change core selectors, arithmetic helpers, mutation coordinators, persistence functions, migrations, validators, runtime adapters, feature authorization, QA attestation, reward adjudication, or embedded data URLs. If implementation cannot stay inside this boundary, stop and amend the contract before editing production.

## Explicit exclusions and deferred work

Phase 10B-3 must not change:

- Building prices, production curves, Fellow/Companion EXP, Campaign rewards, Gold sinks, or any other economy/balance value;
- Fellow/Companion roster contributions to Village production;
- Bond, Type, Role, Power, Rank, unlock, Relic, Might, Mastery, shard, Gift, pity, or idle mechanics;
- save schema 10, any persisted shape, migration, validation, backup, staging, recovery, export, reset, storage-event, or cross-tab behavior;
- navigation persistence or its current revision behavior;
- Oath period keys, weekday eligibility, rollover, streak-reset semantics, Quest semantics, completion rewards, or Undo semantics;
- Campaign, Relic, reset, delete, or other browser-confirmation behavior;
- Family-assignment preview/commit behavior;
- avatar selection or new protagonist artwork;
- the single-file packaging model, embedded assets, visible Everstead branding, compatibility namespace, or public routes; or
- broader Phase 11 typography, sorting/filtering, automation, Codex, content, animation, or architectural refactoring.

These exclusions remain valid product work; they are simply not authorized by this focused boundary.

## Do-not-break requirements

- Schema stays 10 and all twelve protected slot names stay exact.
- Equivalent non-navigation UI actions preserve exact active-save bytes, revision behavior, storage logs, and recovery authority apart from already-authorized existing mutations.
- Offline Gold, Oath completion/Undo, Family assignment, Campaign/Relic outcomes, Expedition/Tower claims, Player Rank gates, and every economy/Power selector remain semantic successors.
- Five embedded asset bytes and aggregate remain exact.
- Production adds no network request, module, external dependency, global public API, QA bridge method, persisted UI field, route, timer, or analytics event.
- Reduced-motion behavior, safe areas, tall-phone Village composition, all five bottom destinations, and no-horizontal-overflow guarantees remain intact.
- The app loads from a static server with zero warning/error console entries.

## Additive Phase 10B-3 QA contract

The preimage package lives only under `qa/phase-10b3/**` plus this document and a Phase 10B-3 execution record. It must not edit historical QA or production.

The same permanent harness operates in two modes:

- **BASELINE_GAPS_CONFIRMED** when `index.html` has the exact base identity. Scoped behavioral rows are expected to expose the frozen defects, and the harness passes only when every expected gap is reproduced.
- **CANDIDATE** when `index.html` differs from the base. Every scoped behavioral row is expected to pass. The candidate must preserve schema, protected keys, embedded assets, source exclusions, and predecessor gates.

The CLI gate must cover exact base identity, contract/scenario integrity, additive-only preimage topology, rendered Relic ownership, bottom label, Oath accessible names/Habit copy, modal semantics, Fellowship tab semantics, forbidden player copy, schema/slot/asset preservation, and unchanged production bytes in baseline mode.

The live gate must use the existing explicitly isolated in-memory runtime, never native storage, and test exact viewports `320×568`, `390×667`, and `390×844`. It must cover:

- all four Village hotspot geometry and hit testing;
- collection-button computed contrast;
- six unequipped Relic summaries and a one-equipped fixture;
- Fellowship bottom label and no overflow;
- all eight starter Oath names, rest-day state, and Habit `+1`/count copy;
- modal role/name, focus entry, forward/reverse trap, Escape, inert background, focus restoration, and repeated-open listener behavior;
- four roster tabs, one selected state/panel, arrow/home/end keyboard operation;
- forbidden terminology across Village, Oaths, all Fellowship tabs, all four Adventure routes, Building/profile modals, More, and Save Export chrome while excluding only the exact read-only payload and retaining QA diagnostics;
- zero native-storage calls and zero warning/error console entries.

Run the focused CLI verifier twice, checksums twice, `git diff --check`, the Phase 10B-2 focused and successor gates twice, Phase 10A semantic successor twice, Phase 9 and Phase 8 inherited gates twice, and the live gate twice at all three sizes before final acceptance.

## Acceptance

Phase 10B-3 may be merged only after:

1. the contract and preimage QA are committed without changing production;
2. the production candidate changes only the authorized UI boundary;
3. every candidate-mode CLI/live row passes twice;
4. every inherited behavioral gate passes with only explicitly itemized artifact-identity supersessions;
5. two independent reviewers approve accessibility/UX and persistence/boundary preservation at the same exact clean production commit;
6. final docs, manifest, checksums, artifact identity, and public evidence are sealed without changing production; and
7. canonical `main` and GitHub Pages serve the reviewed artifact exactly.
