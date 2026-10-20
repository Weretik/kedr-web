# TS-002 — Таблиця клієнтів

**Covers:** SC-001, SC-002, SC-005, SC-006, SC-007. **Depends on:** TS-001. **Статус:** реалізовано у frontend; OpenAPI snapshot/generated types синхронізовано.

**Шляхи:** `libs/admin/clients/feature/src/pages/customers-page.tsx`, `libs/admin/clients/ui/src/tables/customers-data-grid.tsx`, `libs/admin/clients/model/src/queries/customer-page-params.ts`.

**Робота 2026-10-19:** узгодити клієнтську таблицю з товарною: одне постійно відкрите поле MUI `QuickFilterControl` з іконкою пошуку ліворуч усередині toolbar Data Grid, серверний `searchTerm` за ID/іменем/телефоном, page/pageSize у URL і API, debounce, скидання page до 1, `rowCount` після пошуку. Прибрати три фільтри заголовків, керування сортуванням, окрему форму пошуку з кнопкою «Знайти» та пояснювальний підпис під таблицею. Не змінювати ширший backend контракт фільтрів/сортування. «Дії» з іконкою ока, підказкою та accessible name зберегти. Зберегти loading/empty/error/retry, горизонтальне прокручування на телефоні/планшеті, світлу/темну схеми та українську локаль.

**Доповнення 2026-10-20:** за новим запитом підключити наявне серверне сортування `name`, `counterpartyId`, `phone` у таблиці Admin в обох напрямках. Зберігати вибір у URL і повертати сторінку до 1 при зміні порядку. Це замінює попередню вимогу вимкнути керування сортуванням; фільтри колонок залишаються вимкненими.

**Перевірка доповнення 2026-10-20:** тести змінених бібліотек `admin-clients-model`, `admin-clients-ui` та `admin-clients-feature` пройшли через їхні `vite:test` targets. Перевірки `tsc --noEmit` для `model/tsconfig.lib.json`, `feature/tsconfig.lib.json`, `ui/tsconfig.spec.json` і `feature/tsconfig.spec.json` пройшли; feature typecheck включає імпорти UI. Перевірено URL-параметри, виклик серверного сортування з таблиці та скидання сторінки; браузер не відкривали.

**Рівень:** component. **Докази 2026-10-19:** `customers-data-grid.spec.tsx` 5/5, `customers-page.spec.tsx` 2/2, `customer-page-params.spec.ts` 6/6; цільові TypeScript checks UI/feature/model пройшли. **Checkpoint:** правильні rows, filtered count і сторінка без edit/delete. Браузер не відкривали.
