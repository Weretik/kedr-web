# Готовність SDD товарів — 2026-10-19

- [x] Scope, React Web, R/SC, API operationIds і дизайн перевірено за поточними джерелами.
- [x] Нове рішення замовника 2026-10-19: картка показує обидві назви, ознаки й посилання за `exportToSite`; для цього потрібен Admin detail за slug.
- [x] Відділено поточну реалізацію списку від нової поведінки; стара SDD збережена.
- [x] Є граф TS/EN, трасування й рівні тестів без вигаданих результатів.
- [x] Перед реалізацією EN-001 підтвердить оновлений backend OpenAPI й синхронізований frontend snapshot.
- [ ] Production rollout залежить від backend access policy для тимчасово anonymous Admin endpoint.

Висновок: сценарії можна передати в реалізацію після EN-001; production access лишається окремим release blocker.
