# TS-003 — Вкладки й таблиця товарів

**Covers:** SC-001, SC-002, SC-003, SC-007, SC-008. **Depends on:** TS-001, TS-002. **Статус:** implemented.

**Шляхи:** `libs/admin/products/feature/src/pages/products-page.tsx`, `libs/admin/products/ui/src/tables/`, `libs/admin/products/feature/src/components/` за потреби.

**Робота:** три вкладки й дія перегляду реалізовані. Керовані server filter/search/sort/page моделі Data Grid працюють без старої окремої панелі. Boolean колонки наявності, акції й новинки мають «Так»/«Ні» як фільтри та галочку лише для true; колонка «На сайті» показує стан, а однойменна вкладка виконує серверну фільтрацію. Не показувати filter/sort options без backend-підтримки. Зберегти українську локаль, стани, доступність і телефонний/планшетний layout в обох темах Admin.

**Рівень:** component/focused integration. **Докази:** тести тільки змінених таблиць, URL-state й boundary. **Checkpoint:** у кожному режимі filter/search/sort/page працюють по серверній вибірці без edit/delete controls.
