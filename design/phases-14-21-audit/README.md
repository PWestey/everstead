# Everstead Phases 14–21 consistency audit

This is a design-only capstone gate over the accepted Phase 13 cast/tutorial ledgers and Phase 14–21 facility packages. It changes no production code, runtime behavior, artwork, or CSS.

## Result

The design chain is internally implementable with explicit runtime blockers:

- 12 stable facilities and 12 canonical physical anchors;
- 79 valid tutorial IDs with gradual coverage for every facility concept;
- 18 Fellows and 20 Family members with profile, ambient, authored, and later-role coverage;
- Rank-safe story/tutorial speaker selection;
- 14 reserved exact-once finalizer dispatches;
- non-expiring, individually manual facility claims;
- null/unapproved economy and presentation values kept fail-closed;
- all 27 Phase 20–21 release gates still blocked.

The audit records one cross-phase identity variance: six Phase 14–19 facility definitions use broad map-location aliases. Phase 17's twelve facility-specific anchors are canonical, and runtime needs an explicit facility-scoped alias/migration map before physical hotspot binding.

Schoolhouse graduation also remains explicitly blocked until the V2 offer factory supports a facility-local one-time ready snapshot or a separate one-shot definition is approved.

## Files

- `CROSS_PHASE_AUDIT_CONTRACT.md` — authority, invariants, decisions, sequence, acceptance, and blind spots.
- `audit-fixtures.json` — frozen tree identities, exact facility registry, tutorial concept mappings, finalizer/version/archive seams, and audit cases.
- `audit-results.json` — committed machine-readable result and counts.
- `blocker-matrix.json` — ordered implementation blockers, owners, dependencies, decisions, evidence, and fail-closed effects.
- `validate.py` — deterministic cross-package validator.

## Validate

```text
python3 design/phases-14-21-audit/validate.py
```

Expected summary:

```text
SUMMARY 46/46 checks; 12 facilities/12 canonical anchors; 79 tutorials; 38 actors; 14 finalizer seams; 27 release gates; 12 implementation blockers
```

Passing this validator does not authorize production enablement. The release decision remains blocked until the integrated runtime supplies all required evidence.
