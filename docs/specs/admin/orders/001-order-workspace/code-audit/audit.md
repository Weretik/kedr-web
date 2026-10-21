# Аудит відповідальностей коду — замовлення Admin

- **Дата:** 2026-10-21.
- **Обсяг:** React Admin orders і адаптери підключення в app/clients/products; Mobile та Angular не змінювалися.
- **Правила:** [організація Admin коду](../../../../../standards/admin/admin-code-organization.md), [межі залежностей](../../../../../architecture/admin/structure/dependencies.md), [SDD виправлення](../../002-order-structure-remediation/README.md).
- **Метод:** статичний аудит і вузькі автоматизовані перевірки після структурних змін.

## Знахідки й рішення

| ID     | Початкова проблема                                                                                | Рішення та фактичний власник                                                                                                                                                                               | Статус і доказ                                                                  |
| ------ | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| AF-001 | Таблиці керували також завантаженням, видаленням і Dialog чернетки.                               | `feature/src/components/order-tables.tsx` лишає URL, вкладки й запити; `hooks/use-draft-deletion.ts` володіє mutation та version, `dialogs/draft-delete-dialog.tsx` — підтвердженням.                      | **verified**: тест вкладок/URL і новий тест підтвердженого видалення.           |
| AF-002 | Сторінка оформлення тримала два submit-потоки, їхні ключі, форми та підтвердження в одному файлі. | `pages/new-order-page.tsx` координує набір і quote; `hooks/use-save-draft.ts`, `use-submit-order.ts` та `state/idempotency-key.ts` розділяють сценарії; `ui/src/forms/` і `dialogs/` містять відображення. | **verified**: тести повторного підтвердження нової ціни та збереження чернетки. |
| AF-003 | Публічний data-access експортував mapper, а feature розбирала transport conflict.                 | `data-access/src/mappers/orders.mapper.ts` лишається приватним; `api/order-conflict.ts` перетворює конфлікт на domain outcome; public `index.ts` не експортує mapper.                                      | **verified**: 4 mapper тести, TypeScript і перевірка меж.                       |

## Рішення залишити

`model` (одна коротка domain-модель), `ui/src/tables/order-list-grid.tsx`, `forms/order-line-editor.tsx`, `details/order-document-view.tsx`, `feature/src/state/current-order-set.ts` і окремі сторінки перегляду/редагування чернетки мають цілісні ролі. App picker-адаптери з'єднують домени без імпорту чужої feature усередині orders. Найдовший production-файл нової orders області має 86 рядків; це спостереження, а не числове правило поділу.

## Перевірка й межі

`npx nx vite:test admin-orders-feature --run`: 11 тестів, exit 0. `npx nx vite:test admin-orders-data-access --run`: 4 тести, exit 0. `npx tsc -p apps/admin/tsconfig.app.json --noEmit`, `npx eslint libs/admin/orders/feature/src libs/admin/orders/data-access/src libs/admin/orders/ui/src` і `npm run architecture:boundaries`: exit 0; boundary check охопив 71 проєкт. Відносні Markdown-посилання перевірено. Браузерні, E2E, production build і повний прогін не запускалися.
