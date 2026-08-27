# Everstead

Everstead is a mobile-first, single-file browser game currently being migrated from the original **OATHFORGE — New World Prototype v0.1** into the locked Everstead design.

- [Play the current baseline](https://pwestey.github.io/everstead/)
- [Locked Core Design v1.0](https://docs.google.com/document/d/1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg/edit)
- [Implementation Roadmap v1.0](https://docs.google.com/document/d/1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900/edit)

## Current status

The `main` branch preserves the uploaded v0.1 prototype as the migration baseline. It is a working product shell, not the final source of truth for game mechanics. The Locked Core Design controls product behavior; the roadmap controls migration order.

## Local preview

The prototype has no build step. Serve the repository root with any static web server, then open `index.html` in a browser. For example:

```sh
python3 -m http.server 8000
```

## Development workflow

- Keep `main` runnable.
- Use one Git worktree and branch per independent implementation task.
- Make small migration commits that preserve existing UI and save data where practical.
- Review and integrate changes centrally rather than allowing parallel tasks to edit the same checkout.
- Follow [AGENTS.md](AGENTS.md) for authority, safety, and acceptance rules.

