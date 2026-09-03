# Everstead

Everstead is a mobile-first browser RPG evolving from the original **OATHFORGE — New World Prototype v0.1** into the locked Everstead design. The deployable app is vanilla HTML/CSS/JavaScript plus external, lazy-loaded image assets.

- [Play Everstead](https://pwestey.github.io/everstead/)
- [Locked Core Design v1.2](https://docs.google.com/document/d/1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg/edit)
- [Implementation Roadmap v1.0](https://docs.google.com/document/d/1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900/edit)

## Current status

The deployed app is an active **Chapter I Public Preview** on schema 14. It includes Oaths, passive Village growth, all 18 Fellows, all 20 Family members, all 20 Companions, Fellow Campaign, Fellow Expedition, Companion Campaign, Companion Tower, the complete First Covenant Chapter I, gradual tutorials, protected Save & Recovery, and the first permanent Collection release, The Founding Table.

This is not yet the complete locked Everstead. Extended Book I, Legacy v2, automatic Family romance, rotating events, the privately accepted facility runtimes, and long-horizon progression curves remain preview-excluded until their economy, migration, presentation, and public-release gates pass. Rights-limited Companion portraits are not distributed in the public repository; the public build uses an original Everstead crest fallback. Saves remain local to the current browser, so players should keep a private Recovery File backup.

The Locked Core Design controls product behavior; the roadmap controls migration order. See the [Phase 24G Chapter I result](qa/phase-24g-chapter1/RESULT.md), [Phase 24F current-schema More result](qa/phase-24f-more/RESULT.md), [Phase 24E current-schema shell result](qa/phase-24e-shell/RESULT.md), [Phase 24D public-preview result](qa/phase-24d-public-preview/RESULT.md), [Phase 13 implementation contract](docs/PHASE_13_IMPLEMENTATION_CONTRACT.md), [Phase 13 result](docs/PHASE_13_RESULT.md), [Phase 12 foundation contract](docs/PHASE_12_FOUNDATION_CONTRACT.md), [Phase 11H dialogue-cutout contract](docs/PHASE_11H_DIALOGUE_CUTOUT_CONTRACT.md), [Prosperity/HQ decision record](docs/PROSPERITY_HQ_DECISION.md), [roster catch-up decision record](docs/ROSTER_CATCH_UP_DECISION.md), [future-schema recovery policy](docs/RECOVERY_SCHEMA_POLICY.md), and [source structure map](docs/PHASE_11E_STRUCTURE_MAP.md).

Village dialogue cutouts live under `assets/portraits/fellows/village/` and are loaded only for the active speaker. Full Fellow portraits remain under `assets/portraits/fellows/` and are still used by character sheets. A Fellow without an approved cutout cannot rotate into the Village speaker position; this keeps the presentation intentional while later cutouts are added incrementally.

## Local preview

The deployable app has no build step. Serve the repository root with any static web server, then open `index.html` in a browser. For example:

```sh
python3 -m http.server 8000
```

## Development workflow

- Keep `main` runnable.
- Use one Git worktree and branch per independent implementation task.
- Make small migration commits that preserve existing UI and save data where practical.
- Review and integrate changes centrally rather than allowing parallel tasks to edit the same checkout.
- Follow [AGENTS.md](AGENTS.md) for authority, safety, and acceptance rules.
- Preserve historical phase gates; add a successor gate for each new behavioral phase.
- Preserve the [Phase 11C automation contract](docs/PHASE_11C_AUTOMATION_CONTRACT.md) when extending repeat or collection behavior.
- Preserve the [Phase 11D roster/Codex contract](docs/PHASE_11D_ROSTER_CODEX_CONTRACT.md) when extending roster, assignment, equipment, Prosperity, or Codex behavior.
- Keep ordinary browsing save-neutral. Only gameplay actions, settings changes, and explicit recovery operations may write the save.
- Do not assign Prosperity thresholds until its decision record is completed and approved. The specific Phase 11F roster-expansion catch-up rule is approved and implemented in Phase 11G; future acquisition models require a successor decision.
