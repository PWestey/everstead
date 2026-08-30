# Phase 10C-3 QA

This additive gate verifies the player-facing presentation of the activated Village economy without changing its schema, arithmetic, persistence, or navigation behavior.

Run the focused command-line gate twice:

```sh
node qa/phase-10c3/verify.mjs
```

Serve the repository root through the approved same-origin server, then open `qa/phase-10c3/`. The live runner automatically exercises 320×568, 390×667, and 390×844 isolated-memory realms. The expanded runner must finish **86/86** with no warning/error console entries and no browser-native storage access.

`build-contract.mjs` is read-only by default. Maintainers may explicitly use `node qa/phase-10c3/build-contract.mjs --write` only when regenerating this package's manifest and checksum inventory after an authorized QA/docs-only change.

The gate recognizes production artifact commit `729ac10114fa75f0fa66a93438aeed281f0e78f7`. It freezes the schema-11 surface, Phase 10C-2 engine behavior, private Gold core, and embedded assets while allowing only this phase's additive QA and documentation files after that commit. Its live oracle is copied from the exact Phase 10C-2 engine vectors and checks the executable compact formatter, including Archives at `6.0K`.
