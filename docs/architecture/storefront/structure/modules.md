# Наявні модулі Storefront

Це карта поточних Nx projects за їхніми `project.json`. Архітектурні ролі визначає [domains.md](domains.md); фактичні targets і версії перевіряй у [frontend inventory](../../frontend-inventory.md) та конфігурації проєктів.

| Область           | Наявні Nx projects                                                                         | Відповідальність                                 |
| ----------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| Застосунок        | `apps/storefront`                                                                          | Angular SSR, маршрути й глобальні providers      |
| Основа Storefront | `libs/storefront/{contracts,data-access,shell,ui,util}`                                    | Контракти, дані, оболонка, презентація й утиліти |
| Feature           | `libs/storefront/feature/{home,catalog,categories,cart,checkout,auth,cabinet}`             | Основні сценарії вітрини                         |
| Feature           | `libs/storefront/feature/{articles,about-us,contacts,regions,wholesale,widgets,not-found}` | Контентні й допоміжні сценарії                   |

Маршрути збирає `apps/storefront/src/app/app.routes.ts` із публічних entry points feature-бібліотек. Ця карта показує наявність бібліотек; статус конкретної поведінки й перевірок бери з коду та відповідної feature-специфікації. Загальні бібліотеки `libs/shared/*` перелічені у [frontend inventory](../../frontend-inventory.md).
