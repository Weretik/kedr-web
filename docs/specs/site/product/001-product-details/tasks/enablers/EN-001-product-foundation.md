# EN-001 — Product domain foundation

- **Enables:** SC-001–SC-029; техническая предпосылка, не доказательство поведения.
- **Depends on:** нет.
- **Status:** implemented, verified.
- **Exact paths:** `libs/site/product/{model,data-access,ui,seo,feature}/`; `tsconfig.base.json`; `package.json`; `tools/architecture/project-boundary-rules.mjs`; при изменении правил — `check-project-boundaries.spec.mjs` рядом; `docs/specs/site/migration/README.md` для prerequisite 4A→5→4B.
- **Test level:** generator/config verification, boundary fixtures для нового flow.
- **Baseline:** [frontend design](../../design/frontend.md), Site AGENTS и generator conventions; AF prerequisite отсутствует до выявленного нарушения.

## Work

- [x] Генератором Nx создать пять библиотек. Базовая команда от корня: `npx nx g @nx/react:library libs/site/product/model --bundler=none --unitTestRunner=vitest --tags=scope:site,domain:product,type:model`; повторить для data-access/ui/feature с соответствующим type и для seo с `type:util`.
- [x] Сохранить inference/Vite conventions, public index.ts, aliases `@site/product/*`; подтвердить actual targets через `npx nx show project site-product-model --json` и остальные четыре проекта.
- [x] Добавить новые проекты в существующие targeted scripts/CI discovery там, где используется явный список; сохранить незакоммиченные изменения в package/config.
- [x] Разрешить только `site-product-feature->site-catalog-model` для общей политики скрытых корней/breadcrumb destinations; использовать существующий CATALOG_ROOTS/isHiddenCategoryId, не копировать IDs в product mapper. Добавить узкую fixture этого разрешённого flow и запрещённого UI/model перехода.
- [x] Не разрешать feature→feature, product UI/data-access→catalog или core→product. Cart flows появятся только после EN-002.
- [x] Перед зависимыми работами отразить в migration dependency: 4A читаемая карточка/UI/SEO → 5 cart foundation → 4B purchase integration. Не оставлять цикл «полный шаг4 зависит от5, а5 от полного4».
- [x] Проверить ответственность generated files, удалить только собственные demo components, не менять чужие файлы по шаблону wholesale.

## Evidence

Nx @nx/react:library создал пять библиотек с bundler=none, unitTestRunner=vitest, component=false, importPath @site/product/<layer>, project.json/tags. Лишний scoped test plugin убран с сохранением baseline. Nx graph подтвердил vite:test/typecheck/lint всех пяти проектов. Новый flow сначала дал один ожидаемый fixture Red; после узкого разрешения5/5, финальные boundary fixtures27/27. npm run architecture:boundaries — pass,108 projects. Scoped type check23 roots — pass. Red-first для scaffolding n/a; fixture доказывает границу, не пользовательское поведение. Migration prerequisite исправлен на4A→5→4B.

Подробности: [implementation evidence](../../verification/implementation.md).

## Checkpoint

Все пять public APIs и targeted test targets существуют, теги совпадают с baseline, новый flow разрешён только в feature; TS-001–TS-004 могут начать работу без обхода границ.
