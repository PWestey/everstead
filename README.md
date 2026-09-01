# Everstead

Everstead is a mobile-first browser RPG evolving from the original **OATHFORGE — New World Prototype v0.1** into the locked Everstead design. The deployable app is vanilla HTML/CSS/JavaScript plus external, lazy-loaded image assets.

- [Play Everstead](https://pwestey.github.io/everstead/)
- [Locked Core Design v1.2](https://docs.google.com/document/d/1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg/edit)
- [Implementation Roadmap v1.0](https://docs.google.com/document/d/1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900/edit)

## Current status

The current candidate is a runnable schema-12 build through Phase 13. The locked Oath, Building, Family, Fellow, Companion, Campaign, Tower, Expedition, Relic, Player Rank, offline-reward, and activated economy systems remain behind the preserved mobile shell. Phase 13 composes the five-scene First Covenant opening over that foundation, with a Waystone objective, Chronicle and Tutorial Log under More, gradual non-blocking lessons, Legacy progress, and exactly-once manual claims. All 18 Fellows and 20 Family members retain stable quote/dialogue identities; the opening uses only its focused eight-person cast.

The Locked Core Design controls product behavior; the roadmap controls migration order. See the [Phase 13 implementation contract](docs/PHASE_13_IMPLEMENTATION_CONTRACT.md), [Phase 13 result](docs/PHASE_13_RESULT.md), [Phase 12 foundation contract](docs/PHASE_12_FOUNDATION_CONTRACT.md), [Phase 11H dialogue-cutout contract](docs/PHASE_11H_DIALOGUE_CUTOUT_CONTRACT.md), [Prosperity/HQ decision record](docs/PROSPERITY_HQ_DECISION.md), [roster catch-up decision record](docs/ROSTER_CATCH_UP_DECISION.md), [future-schema recovery policy](docs/RECOVERY_SCHEMA_POLICY.md), and [source structure map](docs/PHASE_11E_STRUCTURE_MAP.md).

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
