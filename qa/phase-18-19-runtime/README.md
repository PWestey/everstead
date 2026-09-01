# Phases 18–19 private runtime focused gate

This focused gate exercises the real modular Apothecary and Schoolhouse runtime
against the immutable approved policy package without a browser. It loads the
generated production definitions and runtime factory in a fresh VM, injects a
closure-safe saved-state coordinator, and verifies the domain transitions
through that coordinator.

Run it from the repository root:

```sh
node qa/phase-18-19-runtime/verify.mjs
```

The expected result is `34 passed, 0 failed`. The gate covers:

- private activation and save binding with public release disabled;
- authoritative Phase 17 story discovery before opening and content-gated
  case, remedy, pupil, and lesson availability;
- explicit watched/skipped facility introductions that atomically commit the
  Phase 17 unlock, Phase 18–19 projection, durable outcome, and Tutorial Log;
- honest `migrated-recap` lineage for already-unlocked Phase 17 saves;
- contextual, gradual, nonblocking tutorial delivery and write-neutral replay;
- deterministic non-expiring banking at the approved cadence and capacity;
- forgiving Apothecary Recheck and supportive/precise manual claims;
- persistent Schoolhouse seating, lesson development, positive-only captured
  Family mentor bonuses, and Family-byte neutrality;
- separate exactly-once Graduation V2 identity and seat release;
- Phase 15-only offer/V2 receipt/archive authority, bounded receipt folding,
  exact plan binding, malformed-state rejection, real coordinator rollback,
  and same-time preservation of the original four passive Buildings;
- exact-one-domain named-patient authority and same-clock boot idempotence;
- seven approved Legacy definitions, no Restaurant-value reuse, and immutable
  finalizer registration.

This is focused mechanical evidence, not the browser or integration release
gate. Browser behavior is covered by `qa/phase-18-19-independent/`. This
candidate is retargeted onto exact accepted Phase 17 successor `a6b168f` and
uses the released Phase 15 finalizer/archive and Phase 13 Legacy authorities.
Root must still rerun inherited Restaurant assertions and every static/live gate
before integration.
