# TS-004 — Маршрути й меню клієнтів

**Covers:** SC-001, SC-003, SC-004. **Depends on:** TS-002, TS-003. **Статус:** planned.

**Шляхи:** `libs/admin/clients/feature/src/clients.routes.tsx` (новий), `apps/admin/src/app/router/app-router.tsx`, `libs/admin/core/shell/src/components/navigation/admin-navigation.tsx`.

**Робота:** підключити lazy `/customers` і `/customers/:counterpartyId`, пункт меню й active state вкладеного маршруту. Зберігати номер сторінки через нормалізований URL і підтримати пряме посилання. Завершити перевіркою цілісності файлів і розділити незалежні ролі за потреби.

**Рівень:** route integration. **Докази:** записати тест/Red/Green/Regression. **Checkpoint:** список/картка/Back мають правильні URL і меню.
