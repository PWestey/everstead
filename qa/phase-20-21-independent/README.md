# Phases 20–21 independent Village-facility gate

This QA-only package gates the eight accepted Phase 20–21 facility activities without implementing or emulating them.

Run the frozen package/design contract:

```sh
node qa/phase-20-21-independent/verify.mjs --package-only
```

Run the production candidate gate:

```sh
node qa/phase-20-21-independent/verify.mjs
```

Serve the repository root and open `qa/phase-20-21-independent/` for five isolated browser realms. Each realm loads the real `index.html`, uses isolated memory storage, and stops fail-closed when `window.__EVERSTEAD_PHASE_20_21_QA__` is absent. It never installs a fake engine.

The gate freezes all eight physical anchors and distinct activities, original-four passive/Family behavior, expansion opportunity-only behavior, eight trusted finalizers, story/capability opens, 19 tutorials, 45 facility hooks across 28 actors, continuing quote/ambient coverage for all 38 shipped Fellows/Family, and the explicit forbidden-system list.
