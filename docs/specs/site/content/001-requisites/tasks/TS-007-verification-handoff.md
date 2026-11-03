# TS-007 — Evidence и документация фактической функции

- **Status:** verified 2026-11-03; local source/docs handoff; EN-002 publication gate open.
- **Covers:** SC-001…SC-016 через сведение существующего evidence; отдельно source checkpoints SC-004, SC-012, SC-016.
- **Depends on:** TS-005, TS-006. Статус EN-002 фиксируется как отдельный release gate.
- **Точные пути:** `docs/features/site/requisites.md`; `docs/features/README.md`; `docs/specs/README.md`; `docs/architecture/site/platform/seo-architecture.md`; при изменении фактических описаний `docs/architecture/site/structure/modules.md`; текущие tasks, traceability, checklist и verification.
- **Test level:** документация + локальное source integration review. Повтор всех runtime suites не требуется.
- **Baseline:** [delivery rules](../../../../../standards/shared/delivery-rules.md), [testing rules](../../../../../standards/shared/testing-rules.md).

## Work

- [x] Сверить planned file-role map с фактической структурой и межбиблиотечными imports.
- [x] Свести последние достаточные результаты каждого изменённого boundary; добавить только проверки отдельного ещё не покрытого риска.
- [x] Подтвердить закрытие EN-001 и записать фактический статус EN-002; если он open, явно указать publication blocked и незавершённый SC-012. Не выдавать source или href assertions за реальный HTTP.
- [x] Создать feature card: routes, boundaries/data flow, Mermaid, actual tree и точные focused Tests.
- [x] Добавить строку фактической реализации в catalog и актуализировать spec index/traceability без потери параллельных изменений; при open EN-002 явно сохранить publication blocked и не объявлять функцию полностью принятой.
- [x] Обновить только затронутый фрагмент SEO/modules documentation, если новая реализация меняет описанные факты.
- [x] Записать оставшиеся unrun checks/пределы; итог не должен утверждать проверенную geometry/публикацию без evidence.
- [x] Проверить ссылки и scoped diff; сохранить внешние изменения.

## Evidence

Координатор сопоставил planned/actual map и public imports, сохранил соседние изменения и создал feature card с Mermaid/tree/Tests.

- Model 5, UI 18, SEO 9, feature 5, sitemap 6: 43 passing tests в узких targets; evidence каждого boundary приведено в TS-001…TS-006.
- Scoped lint групп 13 model/SEO/config/index файлов, 9 UI файлов, 3 feature/route файлов и 3 sitemap/index файлов: exit 0; повторялись только изменённые UI файлы.
- site:typecheck exit 0 с Nx cache 1/1. Повтор неизменённых unit targets после документации не назначался.
- Темы, локали, responsive classes и ответственность файлов сверены по исходникам; независимый source review не нашёл существенных дефектов. Полного аудита 00–06 не было и он не запрашивался.
- Локальные Markdown links/IDs/traceability/task graph, project Prettier и scoped diff проверяются при сохранении текущего документационного handoff; результаты сведены в verification.
- EN-001 verified явным ответом пользователя. EN-002 open; SC-012 и публикация не объявляются завершёнными. Появившийся отдельно public-offer route не заменяет готовность privacy-policy или реальный HTTP evidence.
- Runtime HTTP/head, build, validators, browser/visual/manual/E2E и публикация unrun по границам поручения.

## Checkpoint

Фактическая функция описана без вымышленных путей/результатов, все SC имеют точные links на evidence или явно зафиксированный допустимый предел. EN-001 закрыт, статус EN-002 и release gate явно записаны. При открытом EN-002 локальная задача может быть завершена, но SC-012/публикация/полная приёмка остаются незавершёнными.
