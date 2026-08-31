# Everstead

Everstead is a mobile-first, single-file browser RPG evolving from the original **OATHFORGE — New World Prototype v0.1** into the locked Everstead design.

- [Play Everstead](https://pwestey.github.io/everstead/)
- [Locked Core Design v1.2](https://docs.google.com/document/d/1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg/edit)
- [Implementation Roadmap v1.0](https://docs.google.com/document/d/1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900/edit)

## Current status

`main` is a runnable schema-11 build through Phase 11D. The locked Oath, Building, Family, Fellow, Companion, Campaign, Tower, Expedition, Relic, Player Rank, offline-reward, and activated economy systems are implemented behind the preserved mobile shell. Phase 11A clarifies daily progression, Phase 11B adds normal-player save/recovery tools, Phase 11C adds bounded Campaign repeat plus player-invoked Claim Ready collection, and Phase 11D adds display-only roster tools, comparison-first assignments/equipment, and the read-only Everstead Codex.

The Locked Core Design controls product behavior; the roadmap controls migration order. See the [Phase 11D roster/Codex contract](docs/PHASE_11D_ROSTER_CODEX_CONTRACT.md) and [Phase 11D result](docs/PHASE_11D_ROSTER_CODEX_RESULT.md).

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
