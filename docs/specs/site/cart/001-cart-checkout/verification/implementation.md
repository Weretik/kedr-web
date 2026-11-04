# Реализация cart/checkout — 2026-11-04

Пользователь прямо разрешил реализацию по принятой SDD. Выполнены EN-001–003 и TS-001–010, включая product4B (его EN-002/TS-005). Изменения ограничены apps/site, новым cart domain, непосредственными shell/product/shared-API composition points, Nx aliases/scripts и их документацией. Старый storefront использован как источник, без изменений и импортов его кода. Исходные незакоммиченные docs и .playwright-cli сохранены.

## Фактическое поведение

- Один browser-document owner объединяет product purchase, обе кнопки header, один controlled drawer и checkout. CartRuntime передаёт Server Action через provider; core shell получает только generic ReactNode slots. Product callback выполняется на сервере, клиент получает descriptor. Новых feature→feature или core→domain flows нет.
- Legacy cart_v1 читается после hydration и сохраняет snapshot/UAH/идентификаторы. Частично повреждённый источник не перезаписывается до явного решения. При denied storage работает память; контакты и receipt не сохраняются. Remount/soft locale сохраняет draft/pending, hard reload восстанавливает только корзину.
- Количество integer1–1000; merge не заменяет старый snapshot и не обрезает overflow. Delete отдельный. Итог — только товары. Два блока рядом от720 CSS px контейнера checkout; ниже одна колонка. UK/RU, Site tokens/темы, fallback для недоступной фотографии.
- Anonymous quick order принимает имя и телефон; клиентская и серверная проверка, fixed POST /api/orders, no-store/omit credentials/redirect:error, timeout10s/no retry. Valid UUID подтверждает receipt/cleanup; validation400/conflict409/uncertain сохраняют корзину/draft. Pending lock устанавливается до notification и исключает синхронную повторную отправку.
- Checkout noindex, без canonical/hreflang/order metadata; неперсональные H1/breadcrumb/loading находятся вне private request-time leaf с connection/Suspense. Existing robots disallow/sitemap exclusion сохранены; checkout navigation nofollow.

## Unit / component / server evidence

Все ответы сети замоканы. Таблица суммирует отдельные узкие прогоны, не один full suite.

| Scope                          | Фактические spec                                                                        | Passed       |
| ------------------------------ | --------------------------------------------------------------------------------------- | ------------ |
| cart/model                     | cart-reducer, cart-totals, quantity, checkout-validation, cart-persistence              | 88 / 5 files |
| cart/data-access               | orders/create-quick-order                                                               | 32 / 1 file  |
| cart/ui                        | cart-drawer8, cart-header-button3, checkout-view16, cart-purchase-control4              | 31 / 4 files |
| cart/seo                       | checkout-metadata                                                                       | 5 / 1 file   |
| cart/feature storage           | storage/cart-storage                                                                    | 8            |
| cart/feature action            | actions/submit-quick-order                                                              | 7            |
| cart/feature owner             | state/cart-client-store                                                                 | 18           |
| cart/feature lifetime          | state/browser-cart-store4, runtime/cart-provider5, cart-provider.hydration3             | 12           |
| cart/feature app composition   | runtime/cart-runtime                                                                    | 2            |
| cart/feature purchase feedback | purchase/cart-purchase-controller: accepted then rejected add, preserved quantity/count | 1            |
| cart/feature server frame      | checkout/checkout-page, UK/RU                                                           | 2            |
| shared/api-client              | existing site-api4 + site-order-api10                                                   | 14 / 2 files |
| core/shell affected            | site-shell5, collapsing-header2, cart-slots6                                            | 13 / 3 files |
| product/feature handoff        | product-purchase-descriptor7 + product-page8                                            | 15 / 2 files |
| core/seo existing              | crawling (robots/sitemap/product discovery)                                             | 5 / 1 file   |

**Всего: 253 passed** в независимых scoped прогонах; из них новые cart projects — 206 (feature50). Исторический полный product suite не перепрогонялся.

Команды из корня репозитория (для каждого указанного владельца — собственный config, а не run-many):

```powershell
node node_modules/vitest/vitest.mjs run --config libs/site/cart/model/vite.config.mts --maxWorkers=1 --fileParallelism=false --testTimeout=20000
node node_modules/vitest/vitest.mjs run --config libs/site/cart/data-access/vite.config.mts --maxWorkers=1 --fileParallelism=false --testTimeout=20000
node node_modules/vitest/vitest.mjs run --config libs/site/cart/ui/vite.config.mts --maxWorkers=1 --fileParallelism=false --testTimeout=20000
node node_modules/vitest/vitest.mjs run --config libs/site/cart/seo/vite.config.mts --maxWorkers=1 --fileParallelism=false --testTimeout=20000
```

Feature проверялся по рискам отдельными фильтрами того же config:

```powershell
node node_modules/vitest/vitest.mjs run --config libs/site/cart/feature/vite.config.mts cart-storage.spec.ts
node node_modules/vitest/vitest.mjs run --config libs/site/cart/feature/vite.config.mts submit-quick-order.spec.ts
node node_modules/vitest/vitest.mjs run --config libs/site/cart/feature/vite.config.mts browser-cart-store.spec.ts cart-provider.spec.tsx cart-provider.hydration.spec.tsx --maxWorkers=1 --fileParallelism=false --testTimeout=20000
node node_modules/vitest/vitest.mjs run --config libs/site/cart/feature/vite.config.mts libs/site/cart/feature/src/lib/state/cart-client-store.spec.ts libs/site/cart/feature/src/lib/runtime/cart-runtime.spec.tsx --maxWorkers=1 --fileParallelism=false --testTimeout=20000
node node_modules/vitest/vitest.mjs run --config libs/site/cart/feature/vite.config.mts checkout-page.spec.tsx
node node_modules/vitest/vitest.mjs run --config libs/site/cart/feature/vite.config.mts cart-purchase-controller.spec.tsx
node node_modules/vitest/vitest.mjs run --config libs/site/shared/api-client/vite.config.mts
node node_modules/vitest/vitest.mjs run --config libs/site/core/shell/vite.config.mts src/lib/site-shell.spec.tsx src/lib/header/collapsing-header.spec.tsx src/lib/header/cart-slots.spec.tsx --maxWorkers=1 --fileParallelism=false --testTimeout=20000
node node_modules/vitest/vitest.mjs run --config libs/site/product/feature/vite.config.mts product-purchase-descriptor.spec.ts product-page.spec.tsx --maxWorkers=1 --fileParallelism=false --testTimeout=20000
node node_modules/vitest/vitest.mjs run --config libs/site/core/seo/vite.config.mts crawling.spec.ts --maxWorkers=1 --fileParallelism=false --testTimeout=20000
```

Это воспроизводимые scoped команды по выполненным filters/configs; не команда повторного full suite. В некоторых исходных прогонах применялись эквивалентные .bin/vitest.cmd wrappers. Пакетный test:site обновлён пятью cart projects, но целиком не запускался.

## Red → Green → Refactor → Regression

Valid Red выполнялся при работающем harness: model48, persistence23, storage6 fail/2pass, provider9fail/3pass; shell slots4 и product renderer4; UI25; shared POST10 и data-access24fail/8pass; action behavioral failure; owner17 и runtime missing-provider assertion; metadata5. Эти числа отражают исходные этапы, а не все финальные tests. Green и regression — в таблице. Checkout server-frame2 и сохранённый core crawling5 добавлены/проверены как focused regression к уже реализованным boundary assertions, искусственный Red не заявляется.

Роли разделены на model cart/checkout/persistence, feature state/storage/runtime/controllers/actions, data-access contracts/orders и UI cart/checkout/i18n/purchase. Локальное независимое ревью подтвердило boundaries. AF-001/P2 (reentrant submit) получил отдельный behavioral Red: action2 вместо1, исправлен lock-before-notification, regression owner18. AF-002/P3: после принятого добавления отклонённая повторная попытка сохраняла старую надпись «Добавлено»; behavioral Red подтвердил stale confirmation. Перед каждой попыткой сбрасываются прежнее подтверждение и timer; focused controller regression 1/1 passed. [Audit](../code-audit/audit.md).

Infra failures не считались Red: sandbox EPERM для Vite cache (повторный разрешённый запуск), два shell timeout5s (те же3spec/13tests с singleworker20s passed), unsupported Array.at в test lib (заменено обычной индексацией), generated ESLint wrappers duplicate jsx-a11y (удалены, как в существующих product libraries). Source/test checks после исправления завершены.

## Типы, конфигурация и структура

- Next typegen успешно сгенерировал типы нового checkout route; tsc --noEmit --incremental false -p apps/site/tsconfig.json passed. Production build не выполнялся.
- tsc model/data-access lib и feature spec projections passed; narrow source/spec projections для order boundary, storage, provider и UI passed. UI production20/spec24 roots, order boundary10 roots. Цель проверок — server/client signatures, API projection и типы новых tests.
- Scoped ESLint изменённых root/agent source/spec paths passed. После удаления лишних generated configs штатный Nx site-cart-feature:lint проверяет ту же новую библиотеку. Корневые ESLint/Nx правила и boundary allowlist не расширялись.
- check-project-boundaries.mjs: 113 projects passed; core shell не импортирует cart. Генератор зарегистрировал пять cart projects/aliases/type tags; inferred vite:test/typecheck/lint подтверждены nx show project.
- Markdown формат, локальные links/new paths, SC30/R16/task13 traceability, git diff --check и checksum принятого design/concept.html подтверждены после сохранения: 49 документов, 30 SC, 16 R, 13 cart tasks; missing links/format/traceability issues0. Tracked git diff --check и проверка новых source/config файлов на whitespace/conflict markers passed. SHA256 концепта: f2c726762e50212a8da8f08ffc859556c85c5af6636b4a1ddb2df1c9228e6961.

## Ограничения

Не запускались production build, dev server, live HTTP/API/order, browser/visual/manual, E2E, deployment и общий аудит репозитория. CSS/container/theme conclusions — source/component evidence; React SSR test не доказывает фактический Next streaming/HTTP200/404 или вид в браузере. Proxy/Server Actions compatibility конкретного хостинга остаётся выпускным gate. Нет утверждения о deployment, production cutover или доставленном реальном заказе; commits/PR не создавались.

Backend не имеет idempotency key: single-flight действует в текущем документе, не между вкладками/reload. Recovery возможен только в том же origin; denied storage даёт временную корзину. После неопределённого результата автоматического повтора нет. OpenAPI snapshot/generated и backend не менялись.

## Последующий архитектурный аудит с исправлениями — 2026-11-04

Результаты253 выше сохранены как история первоначального внедрения. [Текущий аудит](../code-audit/audit.md) закрыл AF-003–006: cached lint inputs, отдельный DOM focus adapter, productHref в feature mapping, explicit core-shell domain fence. Новых runtime wrappers/owners/API операций нет. Свежие focused results: owner/focus27, UI27, mapper11, runtime2 (67 unit/component), boundary38, actual ESLint probes7, Nx inputs5/5, app/feature.spec/UI.spec types, scoped lint13 и actual boundary graph113. Source AST walk56 TS/13 client entries:0 violations. Full прежний suite, browser/build/HTTP/live order/deployment не запускались.
