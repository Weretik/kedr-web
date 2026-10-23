# Трасування й готовність

| Правила            | Сценарії               | Задачі                 | Доказ реалізації                                                             |
| ------------------ | ---------------------- | ---------------------- | ---------------------------------------------------------------------------- |
| R-001–R-003, R-010 | SC-001, SC-008         | TS-002–TS-004          | `order-tables.spec.tsx`, UI/routes, app typecheck                            |
| R-004–R-005        | SC-002, SC-003         | EN-001, TS-001, TS-005 | `current-order-set.spec.ts`, `orders.mapper.spec.ts`, app typecheck          |
| R-006–R-008        | SC-004, SC-005, SC-007 | TS-002, TS-005         | `new-order-page.spec.tsx`, `current-order-set.spec.ts`, checkout/detail code |
| R-009              | SC-006                 | TS-004                 | versioned delete/update code, 409 handling, app typecheck                    |

**Стан 2026-10-21:** продуктове рішення про локальне збереження, повторне використання чернетки й серверну ціну реалізовано. EN-001 зафіксовано у [frontend design](design/frontend.md); provider OpenAPI синхронізовано. Прямі вузькі Vitest: 13 тестів пройшли (state 6, mapper 4, таблиці/URL 2, повторне підтвердження quote 1). `apps/admin` і orders feature spec TypeScript check пройшли. Ручна браузерна перевірка не проводилася за правилом репозиторію.

## Рівень перевірки за сценарієм

| Сценарій | Цільова перевірка  |
| -------- | ------------------ |
| SC-001   | component/route    |
| SC-002   | unit/component     |
| SC-003   | component/API-mock |
| SC-004   | component/API-mock |
| SC-005   | component/API-mock |
| SC-006   | component/API-mock |
| SC-007   | unit/component     |
| SC-008   | route/component    |

Детальні задачі та контрольні точки — у [графі задач](tasks/README.md). Evidence вище охоплює вузькі автоматизовані перевірки; повний прогін і browser review не проводилися.

## Інкремент 2026-10-22

| Правила     | Сценарії | Задачі | Поточне свідчення й обмеження                                                                                                                                                                                                          |
| ----------- | -------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-011       | SC-009   | TS-007 | `admin-top-bar.spec.tsx`: badge з числом позицій і перехід на `/orders/new` пройшли.                                                                                                                                                   |
| R-012–R-013 | SC-010   | TS-008 | `order-tables.spec.tsx` перевіряє URL і передавання діапазону в query. Provider OpenAPI snapshot і generated types не оголошують `createdFrom`/`createdTo`, тому backend filtering та межі `Europe/Kyiv` залишаються непідтвердженими. |

**Стан перевірки:** вузькі компонентні тести кошика, таблиць, вибору клієнта, рядків товарів і оформлення пройшли; `apps/admin` TypeScript check пройшов. Backend date parser перевірено окремими unit tests для `Europe/Kyiv`. Після первинного запису доказів frontend provider snapshot/generated types синхронізовано з backend commit `c03118d`; `contracts:check` пройшов. Повний перелік — у [revision 2026-10-22](revision-2026-10-22.md).

## Наступний інкремент: деталі замовлення й чернетки

[SDD до реалізації](revision-2026-10-22-order-detail-and-draft-picker.md#трасування-та-готовність) пов'язує R-019–R-025, SC-016–SC-022 і EN-003/TS-013–TS-018. Доказів реалізації цього інкременту ще немає; їх слід додати після виконання задач, не змінюючи історичні результати вище.
