# 001 — Перегляд клієнтів Admin

- **Клієнт:** Admin React (`apps/admin`)
- **Домен:** clients
- **Статус:** frontend інкремент реалізовано; OpenAPI snapshot/generated types синхронізовано з backend commit `8fc8729`
- **Створено:** 2026-10-19
- **Архітектура:** [Admin](../../../../architecture/admin/README.md)

Сторінка клієнтів у бічному меню, MUI Data Grid з одним пошуком у панелі таблиці та серверною пагінацією, а також інформаційна картка клієнта. Пошук охоплює ID, ім'я і телефон на сервері; фільтрів колонок та керування сортуванням у цьому екрані немає. Backend Sales контракт підтримує ширші параметри для інших споживачів. Версійний OpenAPI snapshot і generated types синхронізовано 2026-10-19.

- [Межі](requirements/overview.md) · [Правила й сценарії](requirements/behavior.md)
- [Frontend design](design/frontend.md) · [React і візуальна взаємодія](design/react.md)
- [API](contracts/api-contract.md) · [Задачі](tasks/README.md)
- [Трасування](traceability.md) · [Готовність SDD](checklist/spec-readiness.md) · [Готовність до постачання](checklist/delivery-readiness.md)
- [Локальний аудит відповідальностей клієнтської фічі](code-audit/audit.md)
