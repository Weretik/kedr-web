# EN-001 — Разрешённый content → catalog flow

- **Status:** completed 2026-11-03 (automated/source scope).
- **Enables:** SC-003, SC-004, SC-005, SC-011.
- **Depends on:** none.
- **Paths:** `tools/architecture/project-boundary-rules.mjs`; `tools/architecture/check-project-boundaries.spec.mjs`; `docs/architecture/site/structure/modules.md`.
- **Test level:** Architecture fixtures + graph; для EN Red/Green продуктового поведения n/a.
- **Architecture baseline:** Плановый cross-domain flow отсутствует в allowlist; существующие home exceptions служат ближайшим примером. Новых aliases, tags и packages нет.
- **Rules:** [delivery](../../../../../standards/shared/delivery-rules.md), [testing](../../../../../standards/shared/testing-rules.md), [file-role map](../design/frontend.md).

## Work

- [x] Разрешить ровно content-feature→catalog-data-access/model/ui; сохранить запреты feature-to-feature, content-ui/model→catalog и core→domain.
- [x] Добавить positive fixtures трёх edges и negative fixtures запрещённых направлений; не менять общий алгоритм без обнаруженной необходимости.
- [x] Документировать новый flow в modules.md как владельца composition, не переносить API в content.
- [x] Проверить целостность ответственности изменённых файлов; при смешении независимых ролей разделить по существующим границам, записать решение и повторить затронутую проверку. Полный аудит не добавляется автоматически.

## Evidence

2026-11-03, completed. До policy change выполнен дополнительный проверочный Red: node --test tools/architecture/check-project-boundaries.spec.mjs → exit 1, 3 intended-positive failures / 19 passed; это проверка политики, не пользовательский сценарий.

Green: тот же node --test → exit 0, 22/22. Сохранены negative cases для content UI/model → catalog и feature → feature. node tools/architecture/check-project-boundaries.mjs при NX_DAEMON=false, NX_ISOLATE_PLUGINS=false, NX_NO_CLOUD=true → exit 0, 103 проекта. Это baseline до wholesale imports; фактический новый граф повторно проверен в TS-005, также103.

Structure: изменены только три allowlist edges, fixtures и документированная flow-строка; общий validator algorithm/ESLint/tags не ослаблены.

## Checkpoint

Три intended edges разрешены fixtures, запрещённые направления отклоняются, текущий граф не регрессирует и modules.md согласован с allowlist. Фактический граф новых wholesale imports отдельно подтверждается TS-005.
