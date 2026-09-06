# Direct stage play and save-safety correction

Scope: dismiss Village speakers, direct Campaign purchases, Auto advancement,
and the two Campaign save-protection regressions. Existing save namespace,
schema, manual EXP investment and bonus claims remain unchanged.

- Village speakers dismiss by close button, quote, character tap or keyboard.
  No Show Character button. Ten-minute quiet period survives same-tab reloads
  through a session-only UI preference; redisplay occurs on a later render.
- Go authorizes Campaign Gold spending without a browser confirmation.
  Building upgrades already spent directly and are regression-tested.
- Auto advances selected and subsequent Campaign stages. It stops at locked,
  unaffordable or underpowered stages, end of content, navigation, hidden tab,
  persistence conflict or another repeat job. Stories require manual attention
  and explicit restart. Auto does not persist or silently resume after reload.
- Passive Gold settles in the same transaction but deposits after the guarded
  action, avoiding a legitimate accrual changing the Campaign preview identity.
- Consecutive Campaign EXP credits stage against a validated pre-run snapshot.
  Exact source authority, root/revision match and full candidate validation are
  retained; no save protection was disabled.

Verification: auto-stages.mjs covers 390×844 and 320×568, direct building and
stage spend, cooldown/reload, Auto advancement and affordability stop, and Gold
accrual during Go. consecutive-stage-credit.mjs covers two public clears,
exactly-once banked EXP and reload. exploration-regression.mjs: 30/30 public
wallet/profile checks. exploration.mjs: automatic Gold, offline 24h cap,
reload idempotency and manual bonus claims pass. Mobile screenshot reviewed.

Recovery: affected transactions left active saves unchanged. Reload Latest Save
reopens the last committed progress in the corrected build; do not reset a save
to address this bug. Unrelated corrupt/stale saves retain existing protection.
