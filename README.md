# Everstead

Everstead is a mobile-first, single-file browser RPG evolving from the original **OATHFORGE — New World Prototype v0.1** into the locked Everstead design.

- [Play Everstead](https://pwestey.github.io/everstead/)
- [Locked Core Design v1.2](https://docs.google.com/document/d/1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg/edit)
- [Implementation Roadmap v1.0](https://docs.google.com/document/d/1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900/edit)

## Current status

`main` is a runnable schema-11 release-candidate build through Phase 11E. The locked Oath, Building, Family, Fellow, Companion, Campaign, Tower, Expedition, Relic, Player Rank, offline-reward, and activated economy systems are implemented behind the preserved mobile shell. Phase 11E makes navigation save-neutral, simplifies Claim Ready and Save Health, deepens the read-only Codex presentation, separates the public release identity from the compatibility save version, documents the remaining Prosperity and roster catch-up decisions, and adds continuous regression checks.

The Locked Core Design controls product behavior; the roadmap controls migration order. See the [Phase 11E stewardship contract](docs/PHASE_11E_STEWARDSHIP_CONTRACT.md), [Prosperity/HQ decision record](docs/PROSPERITY_HQ_DECISION.md), [roster catch-up decision record](docs/ROSTER_CATCH_UP_DECISION.md), [future-schema recovery policy](docs/RECOVERY_SCHEMA_POLICY.md), and [source structure map](docs/PHASE_11E_STRUCTURE_MAP.md).

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
- Do not assign Prosperity thresholds or roster catch-up rates until their decision records are completed and approved.
