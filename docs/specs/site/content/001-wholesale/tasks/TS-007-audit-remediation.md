# TS-007 — Закрытие архитектурного аудита wholesale

- **Status:** completed 2026-11-03; AF-001 и AF-002 verified.
- **Enables:** сохранение проверяемости SC-001…SC-017; новых бизнес-сценариев нет.
- **Depends on:** TS-006.
- **Владелец:** координатор wholesale; catalog/ui tooling для AF-001, integration/verification для AF-002.
- **Paths:** `libs/site/catalog/ui/project.json`; `code-audit/{audit.md,verification.json}`; актуализация SDD tasks/traceability/checklists/verification и строки spec index.
- **Test level:** scoped lint, metadata inputs, source/test typechecks, focused catalog regression, positive/negative boundaries и actual graph.
- **Основание:** явный запрос пользователя на code audit и исправления; [отчёт фаз 00–06](../code-audit/audit.md).

## Работа

- [x] Проверить архитектуру, прямые зависимости, server boundary, DTO/data ownership, публичные API и физическую структуру; сохранить текущие чужие изменения.
- [x] AF-001: удалить устаревший lint inputs override catalog/ui, сохранить manifest identity/tags, подтвердить inferred inputs свежим Nx graph.
- [x] AF-002: отдельно проверить типы тестов четырёх затронутых библиотек через существующие spec configs и записать evidence.
- [x] Зафиксировать keep/split решения по UI/feature: семь UI-компонентов уже имеют отдельные роли; Hero и CategoryCards остаются цельными с обоснованием.
- [x] Повторить минимальные проверки исправления и обновить документацию без запуска full suite/build/browser.

## Evidence

Исходный catalog manifest: ручные inputs ссылались на legacy/mjs paths и перекрывали inference. Финальный manifest не содержит override; свежий `nx show project site-catalog-ui --json` показывает `default`, `^default`, root/local `eslint.config.cjs`, `tools/eslint-rules/**/*`, eslint dependency. Первый ответ со старым cached graph не принят; подтверждение выполнено с `NX_CACHE_PROJECT_GRAPH=false` и `NX_FORCE_REUSE_CACHED_GRAPH=false`.

Четыре команды `node node_modules/typescript/bin/tsc -p <config> --noEmit` прошли для:

- `libs/site/content/ui/tsconfig.spec.json`;
- `libs/site/catalog/ui/tsconfig.spec.json`;
- `libs/site/content/seo/tsconfig.spec.json`;
- `libs/site/content/feature/tsconfig.spec.json`.

Свежие проверки после исправления: ESLint 27 файлов exit 0; catalog cards 3/3; boundary fixtures 22/22; actual graph 103; `site:typecheck` (next typegen + tsc) exit 0. Точные команды и результаты — [audit verification](../code-audit/verification.json), описание покрытия — [audit](../code-audit/audit.md#06-remediation-verification). Ранее прошедшие 36 focused tests не выдаются за новый запуск. Это конфигурационное исправление и закрытие пробела evidence; теста нового поведения и искусственного Red не добавляли.

## Контрольная точка

Оба AF verified, роль компонентов подтверждена независимым source review, итоговая структура согласована с SDD. Документационные ссылки/формат/scoped diff проверены после правок. Build/HTTP/browser/visual/E2E и публикация остаются unrun и не входят в эту задачу.
