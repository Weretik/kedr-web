# TS-001 — Режим списку та контекст

**Covers:** SC-002, SC-003. **Depends on:** EN-001. **Статус:** planned.

**Шляхи:** `libs/admin/products/feature/src/hooks/products-url-state.ts`, `libs/admin/products/feature/src/pages/products-page.tsx`.

**Робота:** базовий режим all/missing і пагінацію реалізовано. Інкремент: зберігати в URL пошук, підтримувані фільтри, sort/page/pageSize кожного режиму; tri-state false не губити. Зміна умови чи sort скидає сторінку; повернення з деталей відновлює повний контекст. Не надсилати category/price range у missing-photo API.

**Рівень:** unit/focused integration. **Докази:** майбутні назви тестів, Red/Green/Regression і команди записати тут. **Checkpoint:** mode та query відтворюються після повернення.
