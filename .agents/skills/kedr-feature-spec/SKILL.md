---
name: kedr-feature-spec
description: 'Use when creating, extending, or incrementally migrating a Kedr Web frontend feature specification before implementation.'
---

# Kedr Feature Specification

Створюй scenario-first SDD-специфікацію до зміни application code. Цей skill не реалізує feature.

## Workflow

1. Прочитай кореневий `AGENTS.md`, `docs/architecture/frontend-inventory.md`, README та `sdd-process.md` обраного клієнта, а також релевантні файли з `docs/standards/`.
2. Визнач клієнт: Admin React, Mobile React Native або Storefront Angular. Якщо він не вказаний і його не можна однозначно встановити зі scope, запитай користувача до створення файлів.
3. Прочитай `docs/specs/_templates/feature/README.md`. Використовуй canonical common templates та лише один client variant; не копіюй `USAGE.md` або всі variants у feature-папку.
4. Для існуючого коду зафіксуй baseline через code audit до readiness review. Не маскуй невідомі product rules припущеннями: використовуй `[NEEDS CLARIFICATION: ...]`.
5. Створи або доповни feature у `docs/specs/<client>/<domain>/<NNN>-<slug>/`. Збережи стабільні ID `R-*`, `SC-*`, `TS-*`, `EN-*` і повну traceability між requirements, scenarios, tasks та evidence.
6. Перевір усі template checklists, посилання, залежності й readiness gate. Зупинись після documentation artifacts та повідом blockers; не починай implementation без окремого запиту.

## Guardrails

- Не вигадуй targets, test tooling, API operations або architecture boundaries; звіряй їх із repository state.
- Не переписуй історичне evidence і не перенумеровуй стабільні ID без необхідності.
- Новий dependency, test tool або architecture exception має бути явним `EN-*`.
- Зберігай сторонні зміни робочого дерева.

## Example

`Use $kedr-feature-spec to prepare the Admin order-refund feature specification from the supplied requirements.`
