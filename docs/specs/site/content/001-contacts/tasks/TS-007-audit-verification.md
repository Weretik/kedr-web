# TS-007 — Закрытие архитектурного аудита

- **Status:** completed 2026-11-03, automated/source scope.
- **Covers:** verification SC-001…SC-014; AF-001…AF-006 по задачам-владельцам TS-001…TS-005.
- **Depends on:** TS-001…TS-006.
- **Paths:** contacts `code-audit/audit.md`; `design/frontend.md`, `traceability.md`, README/tasks/checklist/verification; фактическая карточка `docs/features/site/contacts.md`.
- **Test level:** source/configuration review, focused regression и test/source TypeScript.
- **Authorization:** пользователь отдельно поручил аудит, исправления и разделение смешанных компонентов.

## Work

- [x] Выполнить фазы 00–06 для contacts и прямых зависимостей, сверить фактическую матрицу проектов, импортов, state и public APIs с правилами сайта.
- [x] Зафиксировать findings с severity, исходным evidence, ответственным TS, target и verified evidence в audit.md.
- [x] Исправить test guard копирования у TS-002, boundary guard у TS-004, model lint inputs/imports у TS-001, ошибку типов теста у TS-005 и токены у TS-003.
- [x] Уточнить UI-структуру у TS-003: header/help/sales/messengers — самостоятельные внутренние компоненты; public props и наблюдаемое поведение сохранить.
- [x] Проверить meaningful negative evidence навигации и зависимостей, итоговые regression, source/test types и lint; не повторять проверки неизменённого SEO.
- [x] Сопоставить фактическую структуру после split с картой SDD; обновить документы и ссылки, сохранить сторонние изменения.

## Evidence

[Полный отчёт](../code-audit/audit.md). Контрольная навигационная мутация: 4 expected failures, затем exact restoration leaf. Dependency fixtures: 4 forbidden-edge failures до fix, final12/12; actual graph 102 passed. UI 36/36, feature 9/9, source и три test configs tsc passed, scoped lint и uncached model lint passed.

Чистый structural extraction не требует искусственного Red: существующие behavior tests сохранены и прошли. Config/type/lint failures названы своими именами и не считаются поведенческим Red. Production clipboard leaf сохранён побайтно. Полный audit не включает незапрошенные browser/visual/HTTP/build проверки.

## Checkpoint

AF-001…AF-006 имеют verified evidence; нет открытых in-scope находок. Новые UI-файлы владеют одной ролью, public exports и сценарии прежние. Документация и фактическая структура согласованы.
