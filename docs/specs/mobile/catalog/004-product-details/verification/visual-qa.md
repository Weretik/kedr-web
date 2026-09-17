# Mobile product details — visual QA plan

## Automated checks

| Scenario      | Risk                          | Test level | Implemented test/target                     |
| ------------- | ----------------------------- | ---------- | ------------------------------------------- |
| SC-003        | omitted/mislabeled API data   | component  | `mobile-catalog-ui:test` details content    |
| SC-004        | wrong gallery count/index     | component  | `mobile-catalog-ui:test` gallery            |
| SC-005        | broken remote image           | component  | `mobile-catalog-ui:test` image error        |
| SC-006–SC-009 | wrong page-state action/copy  | component  | `mobile-catalog-feature:test` screen states |
| SC-010–SC-011 | wrong cart eligibility/result | component  | `mobile-catalog-feature:test` cart action   |

## Manual matrix

| Scenario | Platform/viewport               | Input mode                       | Observable result                            | Evidence |
| -------- | ------------------------------- | -------------------------------- | -------------------------------------------- | -------- |
| SC-003   | Android small phone, light/dark | touch + 200% text                | all rows remain readable; action not clipped | TS-008   |
| SC-004   | Android/iOS phone               | horizontal swipe + screen reader | pager moves once and announces image/index   | TS-008   |
| SC-002   | long catalog                    | system/header Back               | prior card area and filters return           | TS-008   |
| SC-005   | Android/web failed URLs         | touch/keyboard                   | no broken-image icon; fallback visible       | TS-008   |
| SC-010   | phone bottom safe area          | touch + TalkBack/VoiceOver       | add works once and success is announced      | TS-008   |
| SC-011   | tablet/landscape                | touch/keyboard                   | disabled reason visible beside/above action  | TS-008   |

## Visual evidence

- Record commit/build, date, platform, viewport/theme and scenario.
- Capture loaded light/dark, two-image gallery, total image failure, loading,
  404/offline and disabled cart states only.
- Keep screenshots free of production PII, tokens and private backend details.
- Store actual evidence in `TS-008`, not in this plan.
