# TS-008 — Device and visual verification

- **Task ID:** TS-008
- **Covers:** SC-002–SC-011
- **Depends on:** TS-007
- **Exact paths:** `verification/device-qa.md`; `verification/visual-qa.md`; this task evidence section
- **Test level:** manual

## Work

- [ ] Execute the documented Android, available iOS and Expo web matrix for
      Back restoration, safe area, vertical/horizontal gestures, image failure,
      text scaling, light/dark theme and accessibility.
- [ ] Store only the smallest screenshot/video set proving the risks and record
      unavailable environments honestly.

## Evidence

- Test/path and observable assertion: see QA matrices.
- Red command and expected behavioral failure: n/a — manual verification task.
- Green command and result: n/a.
- Refactor note and focused rerun: n/a.
- Regression command and result:
- Manual/visual evidence, if required: web and Android production bundles were
  generated successfully, but no interactive simulator/device was available.
- Deviation or blocker: Android/iOS physical interaction, screenshots,
  Back/scroll observation, gesture conflict, text scaling and screen-reader
  checks are explicitly deferred; they are not represented as automated E2E.

## Checkpoint

Recorded evidence proves the reference hierarchy, corporate theme, responsive
layout, gallery gestures and state messages on each available target.
