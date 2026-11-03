# TS-008 — Аудит архитектуры и локальные исправления

- **Статус:** completed / verified, 2026-11-03.
- **Covers:** AF-001…AF-003; защита существующих SC-013/SC-014 и документированных границ. Новых сценариев нет.
- **Depends on:** TS-002, TS-003, TS-004, EN-002, TS-007 — завершены.
- **Владелец:** основной агент; независимые read-only проверки UI и model/data-access выполнены отдельными агентами.
- **Объём:** только реализованная gallery feature и непосредственные зависимости. Семь видео и фотографии позже сохраняются.
- **Уровень:** configuration integration для Nx inputs/affected/hash planner; scoped static import/lint review; существующий source unit/integrity test; documentation links/diff.

## Work и точные пути

- Проверены public entries и production chain route → feature → data-access/UI/model/SEO; [отчёт и split/keep](../code-audit/audit.md).
- `libs/site/content/data-access/project.json`: append gallery assets через Nx24 input spread, без замены inferred target.
- `libs/site/shared/ui/src/lib/dialog.tsx` и `dialog.spec.tsx`: только разделители import groups.
- `docs/architecture/site/runtime/application.md`: актуальные gallery/shared client entry points.
- Эта задача, audit report, README/traceability/checklist/card и verification summary: ссылки и факты текущего аудита.

Смешанных независимых component flows не найдено. Дополнительный hook, provider, UI wrapper или слой без самостоятельной ответственности не вводился. Systemic violations других функций не обнаруживались и не исправлялись в этом scope.

## Evidence

### До исправления

Captured inferred source target имел cache=true и семь inputs: `default`, `^production`, dependency spec/storybook tsconfigs, Vitest external dependency, CI env и dependent JS outputs. `default` = project files + пустой sharedGlobals; внешние JPEG отсутствовали. Native fixture воспроизводит baseline: gallery JPEG затрагивает только `site`, gallery instruction в task hash plan отсутствует.

Первый scoped ESLint завершился exit1 на `dialog.tsx:4`. Расширенный gallery-only проход после этой правки завершился exit1 только на том же `import/order` в `dialog.spec.tsx:1`; обе группы исправлены. Никакие другие lint findings в проверенных 26 source/spec файлах не появились.

Архитектурная/config правка не меняет наблюдаемое поведение UI. Искусственный behavioral Red не требовался; ошибочный baseline доказан native before/after fixture. Исходные compile/runner ошибки за behavioral Red не выдаются.

### После исправления

1. Reproducible in-memory proof:

   ```text
   node --max-old-space-size=128 E:\Development\artifacts\kedr-gallery-implementation\audit\verify-gallery-inputs.cjs
   ```

   Exit0, 19 assertions, Nx24.0.3. Actual patch `['...', galleryGlob]` раскрывается в семь прежних inputs + gallery glob. Сохранены cache/executor/options/outputs/metadata/configurations/parallelism и дополнительный будущий plugin env input. Gallery JPEG: touched `site` + `site-content-data-access`; unrelated article JPEG: только `site`. HashPlanner добавляет `workspace:[{workspaceRoot}/apps/site/public/images/gallery/**/*]`. Двухузловая native fixture не строит workspace graph, не запускает tasks, не меняет файлы/постеры и не добавляет dependency edges.

2. Реальный inferred target:

   ```text
   node --max-old-space-size=512 node_modules/nx/dist/bin/nx.js show project site-content-data-access --json
   ```

   Exit0, фактический target содержит все восемь inputs, прежние executor/options/cache/outputs и `implicitDependencies: []`. Использованы `NX_DAEMON=false`, `NX_ISOLATE_PLUGINS=false`. Первый вызов по старому пути `node_modules/nx/bin/nx.js` завершился MODULE_NOT_FOUND; bin взят из installed Nx package.json, затем команда выше прошла. Это ошибка пути инструмента, не тестовый Red.

3. Source regression через исправленный target без кеша:

   ```text
   node node_modules/nx/dist/bin/nx.js run site-content-data-access:vite:test --skipNxCache -- --run src/lib/gallery.spec.ts --maxWorkers=1 --no-file-parallelism
   ```

   Exit0, `1 task: 1 succeeded`, cache skipped, task run18.3s. `NODE_OPTIONS=--max-old-space-size=512`; те же NX env. Выбран только существующий gallery source/integrity spec; других suites нет. Compact Nx вывод не печатал отдельный счётчик cases; исходный файл содержит 44 ранее проверенных cases.

4. Static boundary proof по actual configs:

   ```text
   node --max-old-space-size=256 E:\Development\artifacts\kedr-gallery-implementation\audit\verify-boundaries.cjs
   ```

   Exit0: 18 production files, 10 проектов, 18 разрешённых уникальных edges, шесть запрещённых направлений отклонены. Проверены public aliases, server-only guards, чистый model, local cycles и отсутствие приватных exports. Nx graph всего репозитория этим скриптом не строится. Первоначальная проверка helper не нормализовала `./` в aliases; после исправления самого helper получен результат выше, production code из-за неё не менялся.

5. Финальный lint исправленных primitive/spec:

   ```text
   node --max-old-space-size=512 node_modules/eslint/bin/eslint.js libs/site/shared/ui/src/lib/dialog.tsx libs/site/shared/ui/src/lib/dialog.spec.tsx
   ```

   Exit0. Остальные 24 файла gallery-only ESLint прохода не имели ошибок и после того прохода не менялись. Whitespace не требует нового поведенческого теста или app typegen.

6. Changed documentation links, actual source roles и task-scoped diff проверены после применения документов; ошибок нет. Подробный код fixture сохранён в рабочем хабе по командам выше; app/public source и конфигурация target находятся в целевом репозитории.

## Checkpoint

- [x] AF-001…AF-003 имеют владельца, исправление и свежую проверку; open/blocked findings нет.
- [x] Проверены documented dependency matrix, публичные API, server/client и владельцы состояния.
- [x] Split/keep принят по самостоятельным ответственностям; искусственное дробление не выполнено.
- [x] Poster input участвует в affected selection и hash plan; прежние inferred controls сохранены.
- [x] Существующие изменения и согласованный video-first scope сохранены.
- [x] Доказательства связаны с [traceability](../traceability.md) и [отчётом](../code-audit/audit.md).

Browser/build/E2E/live playback и общий repository audit не выполнялись. Первоначальные 112 cases/typechecks не заявляются как новый полный прогон.
