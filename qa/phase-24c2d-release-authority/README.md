# Phase 24C-2D Founding Table production-authority QA

This package verifies the active schema-14 successor authority for Everstead's
first nonzero Collection release and its production loader/formula seam.

Run:

```sh
node qa/phase-24c2d-release-authority/verify.mjs
```

The verifier preserves the frozen Phase 24C predecessor pins, independently
validates the active authority, verifies the one permanent 200-bps Restaurant
grant, requires the two gradual Collection tutorials as active release
dependencies, recomputes the evidence and manifest identities, exercises one
exact claim plus replay refusal, and verifies that production applies +2.00%
to base sale Gold only with floor rounding before adding the unchanged tip.

## Final freeze

The contract pins the reviewed authority source, candidate semantics,
successor authority, release manifest, and production `index.html` hashes.
The verifier must pass all 98 checks with zero failures before deployment.
