# 001 — Товари без фотографій у профілі

- **Application type:** React Native
- **Client:** Mobile
- **Domain:** profile/catalog
- **Status:** implemented; manual device QA pending
- **Owner:** Mobile team; Catalog API owner for EN-001
- **Created:** 2026-10-03
- **Last updated:** 2026-10-05

У вкладці «Профіль» менеджер бачить окрему секцію товарів без фотографій,
може оновити або повторити завантаження, довантажити результати за наявності
pagination у canonical API contract та відкрити чинні деталі товару, якщо
контракт надає підтримуваний ідентифікатор маршруту.

## Status

- Specification: complete
- Implementation: complete
- Verification: automated gates complete; device/visual QA pending
- Blockers: Android/iOS/Expo web runtime evidence is unavailable in the current
  environment; `contracts:check` remains non-zero until the synchronized
  generated diff is committed; full Expo export fails in the Windows Hermes
  compiler after successful web bundling

## Requirements

- [Scope and outcome](requirements/overview.md)
- [Business rules and scenarios](requirements/behavior.md)

## Technical context

- [Frontend design](design/frontend.md)
- [React Native design](design/react-native.md)
- [Visual interaction contract](design/visual-interaction.md)
- [API integration contract](contracts/api-contract.md)
- [Visual references](research/visual-references.md)

## Planning and delivery

- [Traceability](traceability.md)
- [Task graph](tasks/README.md)
- [Specification readiness](checklist/spec-readiness.md)
- [React Native readiness](checklist/react-native-readiness.md)
- [Visual readiness](checklist/visual-readiness.md)
- [Delivery readiness](checklist/delivery-readiness.md)
- [Visual delivery](checklist/visual-delivery.md)
- [Device QA plan](verification/device-qa.md)
- [Visual QA plan](verification/visual-qa.md)

## Change notes

- 2026-10-03 — створено scenario-first SDD на основі фактичної Mobile
  архітектури; невідомий API shape винесено в блокуючий `EN-001`.
- 2026-10-05 — синхронізовано canonical API operation; підтверджено pagination
  і чинну навігацію за `productSlug`.
- 2026-10-05 — реалізовано Mobile data/UI/navigation slice та завершено
  affected automated verification; TS-007 залишено заблокованим до device QA.
- 2026-10-05 — виправлено runtime-сумісність `photoCheckedAtUtc` із backend
  `.NET DateTimeOffset`; додано regression-тест для RFC 3339 offset `+00:00`.
