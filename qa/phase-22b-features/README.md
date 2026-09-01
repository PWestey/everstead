# Phase 22B feature-surface source gate

This QA-only package retargets Phase 22B to the accepted Phase 20/21 runtime and frozen Phase 22A shell at base commit `d29be5f9c6881ee6ed47bf38a57b97d91dab25d0`. The exact reviewed Phase 22B production source is commit `ddc129935eac809f106c2782bb63b0b138fe0ad0`.

It verifies a presentation-only, cache-versioned Phase 22B stylesheet; exact source identity after the candidate is frozen; the exact five navigation destinations; Fellowship and full-art roster sheets; the separate non-roster Wayfarer presentation and profile; Campaign, Legacy, Chronicle, and Save & Recovery source hooks; responsive/reduced-motion coverage; and the inactive production boundary.

Run from the repository root:

```sh
node qa/phase-22b-features/verify.mjs
```

Actual DOM geometry, focus/Escape return, source-load identity, isolated storage, and save/reward-neutral traversal are covered by `qa/phase-22b-independent`.

The contract uses the integrated Phase 22B semantic markers for every feature surface; it does not invent production markers or depend on visible copy for identity.
