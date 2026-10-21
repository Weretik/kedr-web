# 001 — Замовлення та чернетки Admin

- **Клієнт:** React Admin (`apps/admin`)
- **Домен:** orders
- **Статус:** реалізовано в React Admin; вузькі автоматизовані перевірки наведені у [traceability](traceability.md)
- **Перевірено базис:** 2026-10-21

У боковому меню з’являється «Замовлення»: дві вкладки для оформлених замовлень і збережених чернеток, перегляд деталей, редагування чернетки та сторінка оформлення з тимчасовим набором товарів. Додавання товару доступне зі списку й деталей товару. Усі нові екрани належать лише Admin React.

- [Правила й сценарії](requirements/behavior.md)
- [Frontend design](design/frontend.md)
- [API та стан](contracts/api-contract.md)
- [Задачі](tasks/README.md)
- [Трасування й готовність](traceability.md)
- [Аудит відповідальностей коду](code-audit/audit.md)
- [Структурне виправлення](../002-order-structure-remediation/README.md)

Поточний дизайн списків/деталей визначає [Admin standard](../../../../standards/admin/list-detail-pages.md). Розширення деталей клієнта — [окрема SDD](../../clients/002-customer-orders/README.md).

- [Готовність SDD](checklist/spec-readiness.md)
