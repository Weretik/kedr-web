# TS-007 — Verify the device and visual contract

- **Task ID:** TS-007
- **Covers:** SC-001–SC-009
- **Depends on:** TS-006
- **Exact paths:**
  `docs/specs/mobile/profile/001-products-missing-photos/verification/device-qa.md`;
  `docs/specs/mobile/profile/001-products-missing-photos/verification/visual-qa.md`;
  this task evidence section
- **Test level:** manual
- **Architecture baseline:** existing Expo Go runtime; no new native module,
  permission or binary rebuild; Mobile E2E absent

## Work

- [ ] Record exact build/runtime/date and sanitized fixtures for loading,
      success, empty, initial error, refresh and applicable next-page states.
- [ ] Verify Android and iOS phone portrait/landscape behavior, safe areas,
      bottom-navigation clearance, pull-to-refresh, scroll and Back restoration.
- [ ] Verify Expo web responsive width, wheel/keyboard activation and visible
      focus for real actions.
- [ ] Verify text scaling, contrast/non-color state cues and TalkBack/VoiceOver
      reading/role order, including the non-navigable branch if applicable.
- [ ] Store screenshots/video without production PII and link actual evidence
      from this task and traceability.
- [ ] Update the code audit with any visual/platform finding before closure.
- [ ] Verify changed implementation files, if fixes were required, each retain
      one cohesive responsibility and rerun TS-006 gates after the last fix.

## Evidence

- Test/path and observable assertion: manual matrices in device/visual QA plans.
- Red command and expected behavioral failure: n/a; manual platform evidence.
- Green command and result: n/a.
- Refactor note and focused rerun: any fix returns to its responsible TS task.
- Regression command and result: TS-006 rerun after any QA-driven change.
- Manual/visual evidence, if required: unavailable; no screenshots or device
  captures are claimed.
- Deviation or blocker: blocked on a runnable Expo/device environment. Android
  and Expo web need Mobile QA/runtime ownership; iOS additionally needs a
  macOS/physical-device owner. The official `npx nx export mobile` target with
  a 6 GB Node heap bundled web successfully, then the Windows Hermes compiler
  crashed for iOS/Android with exit `3765269347`; no export artifact exists, so
  the run is build evidence only, not visual evidence.

## Checkpoint

The Android/iOS/web matrix remains pending with explicit environment owners;
automated component/accessibility contracts are covered by TS-004, but real
safe-area, gestures, Back restoration and assistive technology are not passed.
