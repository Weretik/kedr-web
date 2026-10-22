# 002 — Замовлення й чернетки в деталях клієнта Admin

- **Клієнт:** React Admin (`apps/admin`)
- **Домен:** clients / orders
- **Статус:** реалізовано в React Admin; цільові перевірки наведено в [traceability](traceability.md)
- **Перевірено базис:** 2026-10-21

Деталі клієнта отримують дві вкладки з окремими серверними таблицями його замовлень і чернеток. Поточні інформаційні картки клієнта залишаються; [попередню завершену SDD](../001-read-only-customers/README.md) не переписуємо.

- [Правила й сценарії](requirements/behavior.md)
- [Frontend design](design/frontend.md)
- [API](contracts/api-contract.md)
- [Задачі](tasks/README.md)
- [Трасування](traceability.md)
- [Зміна 2026-10-22: таблиця замовлень клієнта](revision-2026-10-22.md) — нова SDD, код ще не змінено

Спільні екрани й склад таблиць визначає [SDD замовлень](../../orders/001-order-workspace/README.md).

- [Готовність SDD](checklist/spec-readiness.md)
