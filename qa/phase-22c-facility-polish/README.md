# Phase 22C focused facility-polish gate

This QA-only package freezes the production candidate at `ee2ea1e73660562ba735d92e1d715b073c37b1eb`. It proves that Phase 22C changes only the accepted Restaurant, Apothecary, Schoolhouse, and Phase 20/21 facility-sheet presentation surfaces.

Run from the repository root:

```sh
node qa/phase-22c-facility-polish/verify.mjs
```

The verifier checks the exact four-file production delta and byte identity; the single cache-versioned local stylesheet after Phase 22B; unchanged predecessor definitions, runtimes, and presentation CSS; exact five-item navigation; absence of new routes, resources, state authority, transactions, public flags, or external assets; the complete semantic-hook vocabulary; canonical Graduation rewards (captured Gold, one Gift, three Relic Stones, six Education); Restaurant stock filtered through the existing unlock authority; canonical Restaurant claim Gold with fail-closed sale/tip detail; accurate locked-seat requirements; readable disabled controls; hidden-toast pointer pass-through limited to an open Phase 22C facility surface; and exact Phase 20/21 Gold plus local-progress presentation.

It also locks the stylesheet contracts for 44px controls, keyboard focus, overflow containment, safe-area padding, scalable `rem` typography, narrow layouts, and reduced motion. Actual-DOM behavior and save/reward neutrality are covered by the companion `qa/phase-22c-independent` package.
