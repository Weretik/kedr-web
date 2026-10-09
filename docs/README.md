# Документація Kedr Web

Цей каталог містить versioned engineering documentation для frontend-застосунків Kedr Web. Документація ведеться як docs-as-code разом зі змінами коду.

## Frontend SDD

- Архітектура — фактична топологія frontend-застосунків, модулі та межі шарів; оберіть потрібний клієнт нижче.
- [Фактичний frontend inventory](architecture/frontend-inventory.md) — apps,
  Nx projects/tags/targets, aliases, test gates і відомі baseline gaps.
- [Інженерні правила](standards/README.md) — індекс rules для Admin, Mobile, UI, API, testing і delivery.
- [Специфікації](specs/README.md) — структура feature-специфікацій та SDD-шаблони.
- [Workspace architecture remediation](specs/architecture/001-workspace-layers-and-boundaries/README.md)
  — погоджуваний план усунення підтверджених системних порушень.

## Застосунки

- [Admin](architecture/admin/README.md) — архітектура адміністративного застосунку.
- [Mobile](architecture/mobile/README.md) — архітектура мобільного застосунку на React Native та Expo.
- [Storefront](architecture/storefront/README.md) — архітектура storefront-застосунку.
- [API](architecture/api/README.md) — API-контракти та інтеграційні домовленості.
- [Frontend API contracts](contracts/README.md) — реєстр операцій і frontend-проекцій backend OpenAPI-контрактів.

## Принцип розміщення

Сталі правила належать у `architecture/` або `standards/`. Рішення, вимоги, контракти, задачі та докази перевірки конкретної feature належать у її папку в `specs/`.

Перед змінами в Admin або Mobile прочитай [інструкції для AI](../AGENTS.md).
