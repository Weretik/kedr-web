# Frontend design

**Перевірений стан 2026-10-21:** `/customers/:counterpartyId` у `clients/feature` показує три інформаційні Card і під ними отриману через callback `CustomerOrdersPanel` з orders domain. Візуальну композицію визначає [Admin standard](../../../../../standards/admin/list-detail-pages.md), поточний клієнтський екран — [SDD 001](../../001-read-only-customers/README.md).

Секція під картками повторно використовує таблиці orders domain. Через заборону feature→feature імпортів у [dependency rules](../../../../../architecture/admin/structure/dependencies.md) реалізовано EN-001: app-level route factory передає в clients feature вузький render callback для order panel із `counterpartyId` та URL контекстом; реалізація callback належить `apps/admin` і використовує публічний orders export. Публічна сигнатура — `createClientsRoutes({ renderOrdersPanel })`; `AppRouter` надає `CustomerOrdersPanel` без clients → orders імпорту. Публічна залежність clients feature не містить orders feature. Запит кожної вкладки використовує server filter, cache key включає customer ID та умови; запити оновлюються після draft mutation. Link back контекст кодується у URL, не зберігається лише в пам’яті.

Цільові автоматичні тести: ізоляція клієнта, незалежні стани двох вкладок, повернення, confirmation, empty/error. Browser/manual review лише за окремим прямим дозволом.

**Architecture baseline:** на 2026-10-21 clients/feature/project.json має теги scope:admin,domain:clients,type:feature, явний lint target і публічний src/index.ts; orders Nx projects додано для цієї реалізації. Публічна залежність clients feature лишається без orders імпорту; app router збирає обидві feature. Цільові перевірки TypeScript clients lib/spec, п’ять тестів сторінки клієнта й Nx module boundaries пройшли.
