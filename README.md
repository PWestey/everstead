# Everstead

Everstead is a mobile-first browser RPG evolving from the original **OATHFORGE — New World Prototype v0.1** into the locked Everstead design. The deployable app is vanilla HTML/CSS/JavaScript plus external, lazy-loaded image assets.

- [Play Everstead](https://pwestey.github.io/everstead/)
- [Locked Core Design v1.2](https://docs.google.com/document/d/1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg/edit)
- [Implementation Roadmap v1.0](https://docs.google.com/document/d/1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900/edit)

## Current status

`main` is a runnable schema-12 release-candidate build through Phase 11G. The locked Oath, Building, Family, Fellow, Companion, Campaign, Tower, Expedition, Relic, Player Rank, offline-reward, and activated economy systems are implemented behind the preserved mobile shell. Phase 11F externalized the portrait library and expanded the roster. Phase 11G makes that roster playable: six Fellows start, twelve join deterministically across Player Ranks 2–5, Campaign rewards rotate across every Rank group, and established saves receive a bounded one-time EXP floor with explicit activation provenance.

The Locked Core Design controls product behavior; the roadmap controls migration order. See the [Phase 11G progression contract](docs/PHASE_11G_PROGRESSION_CONTRACT.md), [Phase 11G result](docs/PHASE_11G_RESULT.md), [Prosperity/HQ decision record](docs/PROSPERITY_HQ_DECISION.md), [roster catch-up decision record](docs/ROSTER_CATCH_UP_DECISION.md), [future-schema recovery policy](docs/RECOVERY_SCHEMA_POLICY.md), and [source structure map](docs/PHASE_11E_STRUCTURE_MAP.md).

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
