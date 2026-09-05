# Phase 24L-B3D — Bounded Apothecary and Schoolhouse Game Sheets

## Objective

Convert the existing story-gated Apothecary and Schoolhouse dialogs into compact, viewport-bounded game sheets. Each facility presents one purposeful panel at a time through bottom tabs while preserving the exact Phase 18/19 live controls and mechanical authority.

## Locked boundaries

- Save schema remains 15.
- Facility discovery, tutorials, banked opportunities, case and lesson state, choices, Family mentors, rewards, claims, graduation, offline settlement, release gates, and focus return remain authoritative and unchanged.
- The adapter runs after the inherited modal binder and reparents already-bound DOM nodes. It does not clone, reconstruct, or proxy any mechanical control.
- Opening, closing, switching tabs, and keyboard navigation perform no save write.
- Inactive panels are hidden, inert, and marked `aria-hidden`; the shared action dock remains visible beneath every panel.
- Successful actions may rebuild the complete facility modal. Session-only tab state follows the underlying semantic step without entering the save.
- Both facilities remain private behind their existing story/release gates. This phase creates no detached launcher and changes no production flag.
- The eight Phase 20/21 successor facilities are deliberately outside this batch and remain scheduled for the separate Phase 24L-B3E presentation adapter.

## Apothecary sheet

- Case: existing tutorial, guidance, patient activity, and evidence.
- Diagnose: existing diagnosis choices.
- Remedy: existing remedy choices and recheck guidance.
- Result: existing manual claim summary, or a presentation-only empty state.
- The existing Resolve and Claim actions remain together in the fixed shared action dock.

## Schoolhouse sheet

- Pupils: existing tutorial, guidance, pupil selection, seats, and progress.
- Lesson: existing banked lesson activity.
- Teach: existing teaching-approach and Family-mentor choices.
- Result: existing lesson and graduation claim summaries, or a presentation-only empty state.
- The existing Teach, Claim Lesson, and Claim Graduation actions remain together in the fixed shared action dock.

## Acceptance gate

- 320×568 and 390×844 pass with no document overflow and no modal-level scrolling.
- Exactly one facility shell, tab set, active panel, action dock, and copy of each original control survives every rebuild.
- All visible tabs and action controls meet a 44-pixel minimum touch target.
- Apothecary routes from Case to Diagnose, Remedy, Recheck, and Result without changing the existing one-write action contract or granting rewards before Claim.
- Schoolhouse routes from Pupils to Lesson, Teach, and Result without changing pupil, mentor, lesson, graduation, or exact-once Claim behavior.
- Manual tab selection and roving Arrow/Home/End keyboard navigation are write-neutral.
- Tab and Shift+Tab cannot enter hidden or inert panels.
- Escape and backdrop dismissal use the canonical facility close path and restore focus to the exact originating Village hotspot.
- Existing Phase 24L-B3C, B3B, B3A, B2, and B1 gates remain green within their documented predecessor boundaries.
