# Граф задач

1. **EN-001 — Композиція доменів.** Зафіксувати спосіб включення orders table у customer detail без feature→feature dependency та перевірити Nx graph і контрактні operation IDs.
2. **TS-001 — Вкладки клієнта.** Додати дві таблиці з обов’язковим `counterpartyId`, незалежним URL state й ізольованими empty/error станами; Red → Green → Refactor → regression/evidence.
3. **TS-002 — Переходи та дії.** Зв’язати деталі, повернення, чернеткові дії й confirmation; цільові тести без зміни існуючих карток.
4. **TS-003 — Документація/перевірка.** Після реалізації оновити `docs/features/admin/clients.md` та індекс; записати результати лише цільових автоматичних тестів.

EN-001 та orders data-access із [SDD 001](../../../orders/001-order-workspace/tasks/README.md) → TS-001 → TS-002 → TS-003.

## Картки задач

- [EN-001](EN-001.md)
- [TS-001](TS-001.md)
- [TS-002](TS-002.md)
- [TS-003](TS-003.md)
