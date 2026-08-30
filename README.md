# Everstead

Everstead is a mobile-first, single-file browser RPG evolving from the original **OATHFORGE — New World Prototype v0.1** into the locked Everstead design.

- [Play Everstead](https://pwestey.github.io/everstead/)
- [Locked Core Design v1.2](https://docs.google.com/document/d/1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg/edit)
- [Implementation Roadmap v1.0](https://docs.google.com/document/d/1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900/edit)

## Current status

`main` is a runnable schema-11 build through Phase 10C. The locked Oath, Building, Family, Fellow, Companion, Campaign, Tower, Expedition, Relic, Player Rank, offline-reward, and activated economy systems are implemented behind the preserved mobile shell. Phase 11 is improving daily-use clarity, save management, automation, roster tools, balance evidence, and maintainability.

The Locked Core Design controls product behavior; the roadmap controls migration order. See the [latest accepted Phase 10C UI result](docs/PHASE_10C3_UI_RESULT.md) and the [current Phase 11A clarity contract](docs/PHASE_11A_CLARITY_CONTRACT.md).

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
- Follow the [Phase 11A clarity contract](docs/PHASE_11A_CLARITY_CONTRACT.md) for the current implementation scope.
