# Everstead repository instructions

These instructions apply to the entire repository.

## Authority order

When sources disagree, use this order:

1. **EVERSTEAD — LOCKED CORE DESIGN v1.0** is authoritative for product systems and mechanics: <https://docs.google.com/document/d/1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg/edit>
2. **EVERSTEAD — IMPLEMENTATION ROADMAP v1.0** is authoritative for migration order and phase acceptance gates: <https://docs.google.com/document/d/1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900/edit>
3. `index.html` is the current implementation to preserve and migrate where compatible. Existing mechanics are not design authority.

Do not invent a new product direction to resolve a conflict. Flag unresolved design conflicts for the primary integrator.

## Baseline

- The initial repository version of `index.html` is the exact uploaded **OATHFORGE — New World Prototype v0.1**.
- Baseline SHA-256: `5223b96d35960465176a8ba6332b8b49185b95e006fd65f0d44aa6256fac9f80`.
- It is a mobile-first single-file HTML/CSS/JavaScript app deployed through GitHub Pages.
- The OATHFORGE name and `oathforge_new_world_proto_v01` storage namespace are legacy implementation details. Visible branding should migrate to Everstead at the roadmap phase, while storage and internal namespaces must change only with an explicit compatibility migration.

## Migration rules

- Preserve working shell, navigation, UI patterns, modals, local saving, and offline processing unless the roadmap explicitly replaces them.
- Replace incompatible mechanics behind the working interface incrementally.
- Never discard or silently reset player save data. Introduce a versioned save schema and explicit migrations before changing persisted structures.
- Do not rename storage keys merely for cosmetic consistency.
- Keep offline elapsed time capped at 24 hours unless the Locked Core Design changes that rule.
- Do not implement Post-V1 features during V1 migration work.
- Avoid broad formatting or namespace churn mixed with behavioral changes.
- Do not split the single-file prototype into a framework or build system unless the roadmap or primary integrator explicitly authorizes that architectural step.

## Parallel work

- One bounded outcome per branch/worktree.
- Do not have two tasks modify the same subsystem or the same long region of `index.html` concurrently.
- Every task must state its phase, dependencies, acceptance criteria, and "do not break" checks before editing.
- Agents prepare focused commits; the primary integrator reviews, tests, and merges them in dependency order.
- Rebase or refresh from `main` before final handoff when another migration has landed.

## Required validation

For every behavioral change:

- Load the app from a static server without console errors.
- Verify a new game can start and persist.
- Verify an existing pre-change save either loads correctly or is migrated deliberately.
- Verify mobile-width navigation and the affected modal/screens.
- Verify offline Gold behavior when related systems are touched.
- Report the exact acceptance criteria exercised and any untested risk.

