# TS-005 — Маршрути й меню товарів

**Covers:** SC-001, SC-004. **Depends on:** TS-003, TS-004. **Статус:** planned.

**Шляхи:** `libs/admin/products/feature/src/products.routes.tsx`, `libs/admin/core/shell/src/components/navigation/admin-navigation.tsx`, тести route/shell.

**Робота:** підключити lazy detail route `/catalog/:productSlug`, перейменувати меню «Каталог» на «Товари» і підтримати активний стан вкладеного маршруту. Перевірити повернення на попередній mode/query і пряме посилання. Завершити перевіркою цілісності файлів і розділити незалежні ролі за потреби.

**Рівень:** route integration. **Докази:** записати тест/Red/Green/Regression. **Checkpoint:** меню й URL ведуть у правильний контекст.
