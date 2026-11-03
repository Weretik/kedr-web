# TS-009 — Evidence, структура и документация поставки

- **Covers:** SC-001–SC-029 (сбор evidence; не повторная реализация).
- **Depends on:** TS-001–TS-008; EN-002 обязательна для полной поставки.
- **Status:** 4A docs/evidence complete; full closure blocked by TS-005.
- **Exact paths:** эта SDD `traceability.md`, task Evidence, `verification/`; planned `docs/features/site/product.md`; existing `docs/features/README.md`, `docs/specs/README.md`, `docs/architecture/site/{structure/modules.md,platform/rendering-and-caching.md,platform/seo-architecture.md}`, `docs/specs/site/migration/README.md`.
- **Test level:** docs/source review и минимальная недостающая focused verification по реальному diff.
- **Baseline:** [delivery rules](../../../../../standards/shared/delivery-rules.md), [testing rules](../../../../../standards/shared/testing-rules.md).

## Work

- [x] Сопоставить actual tree с [file-role map](../design/frontend.md), роли/границы/theme/locale; исправить только подтверждённые in-scope проблемы.
- [x] Собрать actual test names/results в task files, traceability содержит короткие ссылки/статус. Не переименовывать planned evidence в passed без выполнения.
- [x] Не повторять уже актуальные targeted runs после docs-only правок. Запустить дополнительный narrow check только при новом uncovered risk; full suite/build/E2E/audit не запускать автоматически.
- [x] Записать отдельно status initial HTML/HTTP/build/browser/validator checks: выполнены только при фактическом разрешённом запуске, иначе unrun с пределом доказательства.
- [x] Создать короткую actual feature card с route, boundaries, state/data, contracts, Mermaid, tree и focused commands; добавить row feature catalog, обновить spec status/index и затронутые architecture/migration facts.
- [x] При активном EN-002 не объявлять full feature delivered. Для промежуточной публикации требуется отдельное утверждённое поведение, а не молчаливый fallback.
- [x] Проверить изменённые doc links и `git diff --check` только в собственном scope; сохранить чужие незакоммиченные изменения.

## Evidence

Локальные staged role/source checks и peer integration review завершены, открытых in-scope архитектурных findings нет. Feature card/индексы/architecture/migration/task evidence обновлены для4A. Product158 tests, core5, boundaries108 projects/27 fixtures, scoped type check23 roots и ESLint — pass. Docs links/diff проходят отдельную финальную проверку. Полный scope task не закрыт до TS-005; build/browser/HTTP/E2E/full suite unrun, commits/PR нет.

Подробности: [implementation evidence](../verification/implementation.md).

## Audit follow-up — 2026-11-03

По отдельному запросу пользователя выполнен [scoped architecture audit](../code-audit/audit.md) с исправлениями AF-001/002/003. AF-003 добавил Site detail/discovery consumer projection, две registry rows и feature-contract link; OpenAPI/generated не менялись. Fresh runtime checks64 tests, types24 roots, ESLint14 paths и boundaries108 projects pass. Исторические results4A сохранены отдельно; docs/link/diff evidence — в отчёте. Cart prerequisite остаётся blocked.

## Checkpoint

Карта файлов соответствует реализации, SC/TS evidence трассируется без orphan, карточка/индексы актуальны; статус полной поставки правдив и не скрывает EN-002 или непроверенный runtime scope.
