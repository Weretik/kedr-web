# Товари без фотографій у профілі — visual QA plan

## Automated checks

| Scenario      | Risk                                                  | Test level                      | Planned test/target                                                                                       |
| ------------- | ----------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| SC-001–SC-004 | incorrect state copy/roles/actions                    | component                       | `npx nx test mobile-catalog-feature --runInBand --testPathPattern=missing-photo-products-screen.spec.tsx` |
| SC-005–SC-007 | refresh/footer replaces content or invents pagination | focused integration + component | controller and screen specs in `mobile-catalog-feature:test`                                              |
| SC-008–SC-009 | false or incorrect navigation semantics               | integration                     | `npx nx test mobile --runInBand --testPathPattern=profile-route.spec.tsx`                                 |

## Manual matrix

| Scenario         | Platform/viewport                    | Input mode                   | Observable result                                                       | Evidence                                                            |
| ---------------- | ------------------------------------ | ---------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| SC-001–SC-004    | Android/iOS phone portrait           | touch + TalkBack/VoiceOver   | correct section/state order, copy, role and retry                       | [TS-007](../tasks/verification/TS-007-device-visual-qa.md#evidence) |
| SC-002, SC-005   | Android/iOS phone portrait/landscape | scroll + pull gesture        | cards remain readable; refresh and bottom clearance work                | [TS-007](../tasks/verification/TS-007-device-visual-qa.md#evidence) |
| SC-006 or SC-007 | Android/iOS compact height           | touch                        | applicable pagination branch matches contract                           | [TS-007](../tasks/verification/TS-007-device-visual-qa.md#evidence) |
| SC-008 or SC-009 | Android/iOS + screen reader          | touch + assistive technology | applicable navigation branch has truthful semantics                     | [TS-007](../tasks/verification/TS-007-device-visual-qa.md#evidence) |
| SC-001–SC-009    | Expo web narrow/wide                 | mouse, wheel, keyboard       | responsive list, visible focus and keyboard activation for real actions | [TS-007](../tasks/verification/TS-007-device-visual-qa.md#evidence) |

## Visual evidence

- Record implementation commit, Expo/runtime version, platform/device and date.
- Capture loading, populated, empty, initial error, refresh and only the
  pagination/navigation variants applicable to the synchronized contract.
- Verify light and dark Paper themes without introducing local colors.
- Keep captures free of production PII, secrets and real internal product data.
- Store actual results and links in TS-007; traceability links to the task.

## Current result — 2026-10-05

Automated state, action and accessibility contracts pass. Visual captures are
not available from this host, so light/dark rendering, responsive dimensions,
focus, safe areas, real gestures and assistive-technology order remain pending
under TS-007 rather than being inferred from component tests.
