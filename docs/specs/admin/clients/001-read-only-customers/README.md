# 001 — Перегляд клієнтів Admin

- **Клієнт:** Admin React (`apps/admin`)
- **Домен:** clients
- **Статус:** frontend інкремент реалізовано; серверне сортування підключено в Admin 2026-10-20
- **Створено:** 2026-10-19
- **Архітектура:** [Admin](../../../../architecture/admin/README.md)

Сторінка клієнтів у бічному меню, MUI Data Grid з одним пошуком у панелі таблиці, серверним сортуванням за ім'ям, телефоном або ID та серверною пагінацією, а також інформаційна картка клієнта. Пошук охоплює ID, ім'я і телефон на сервері; фільтрів колонок у цьому екрані немає. Backend Sales контракт підтримує ширші фільтри для інших споживачів. Версійний OpenAPI snapshot уже містив `sort`; його provenance записано в [SOURCE.md](../../../../contracts/openapi/SOURCE.md).

- [Межі](requirements/overview.md) · [Правила й сценарії](requirements/behavior.md)
- [Frontend design](design/frontend.md) · [React і візуальна взаємодія](design/react.md)
- [API](contracts/api-contract.md) · [Задачі](tasks/README.md)
- [Трасування](traceability.md) · [Готовність SDD](checklist/spec-readiness.md) · [Готовність до постачання](checklist/delivery-readiness.md)
- [Локальний аудит відповідальностей клієнтської фічі](code-audit/audit.md)
