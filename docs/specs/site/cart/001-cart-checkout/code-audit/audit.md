# Архитектурный аудит cart/checkout — 2026-11-04

- **Функция:** [001-cart-checkout](../README.md), публичный Next.js Site, apps/site.
- **Объём:** пять cart libraries и непосредственные app layout/product/checkout, core shell, public product path model, shared API, Nx/ESLint boundary configuration. Другие features и приложения не аудировались.
- **Основание:** пользователь прямо вызвал frontend-code-audit и разрешил исправления и разделение смешанных обязанностей. Применены относящиеся к этой границе проверки архитектуры, состояния/API, UI, public API/структуры и финальной верификации. Полный аудит репозитория не выполнялся.
- **Источники правил:** [AGENTS](../../../../../../AGENTS.md), [Site AGENTS](../../../../../../apps/site/AGENTS.md), [модули/направления](../../../../../architecture/site/structure/modules.md#dependency-rules), [rendering](../../../../../architecture/site/platform/rendering-and-caching.md), [API/DTO](../../../../../standards/shared/api-data-rules.md), [разделение обязанностей](../../../../../standards/shared/delivery-rules.md#staged-structure-check), [проверки](../../../../../standards/shared/testing-rules.md), [SDD design](../design/frontend.md), [R-013](../requirements/overview.md#r-013--доступная-панель-корзины). Шаблон skill не заменял Site правила или разрешённый стек.
- **Статус:** in-scope architecture verified; открытых/blocked/planned findings нет. Deployment, build, HTTP и browser readiness не заявляются.
- **Сохранность:** исходный working tree был незакоммичен; изменения cart из предыдущего этапа, прочие docs и .playwright-cli сохранены. Новые записи выполнялись по точным путям с проверкой исходных SHA. Коммиты/PR не создавались.

## Результат по серьёзности

| Область                                              | ID     | Severity    | Status                          |
| ---------------------------------------------------- | ------ | ----------- | ------------------------------- |
| Новый аудит: cached lint inputs                      | AF-003 | P2 / medium | verified                        |
| Новый аудит: DOM focus в business owner              | AF-004 | P2 / medium | verified                        |
| Новый аудит: динамическая product URL policy в UI    | AF-005 | P2 / medium | verified                        |
| Новый аудит: core shell не защищён от domain imports | AF-006 | P2 / medium | verified                        |
| История внедрения: reentrant submit                  | AF-001 | P2 / medium | verified; ID/evidence сохранены |
| История внедрения: stale Added feedback              | AF-002 | P3 / low    | verified; ID/evidence сохранены |

## Матрица владельцев и фактических границ

| Project / paths             | Ответственность                                                                       | Фактическое ограничение / проверка                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| cart/model                  | Чистые quantity/reducer/totals, checkout command/validation, legacy codec             | scope:site/domain:cart/type:model; без I/O/DTO                                                            |
| cart/data-access            | Private generated aliases, runtime response validation, domain result projection      | type:data-access, server-only; fixed shared transport; UI/features не получают DTO                        |
| cart/ui                     | Typed props/callbacks, rows/drawer/contacts/summary/receipt, локальная copy           | type:ui; без store/API/transport; CartLineView получает productHref                                       |
| cart/seo                    | Неперсональная metadata checkout                                                      | type:util; domain builder через core; SEO-аудит не выполнялся                                             |
| cart/feature                | Document owner, hydration bridge, action, view mapping, controllers, platform adapter | type:feature; один owner; client leaves не импортируют server-only; только public product model path flow |
| app layout/product/checkout | Server composition, params, metadata delegation, slots/callback injection             | Тонкие route files; server renderer выполняется до client boundary, serialized descriptor                 |
| core/shell                  | Общая шапка, generic ReactNode slots                                                  | scope:site-shared/type:shell; реальные ESLint и validator запрещают cart/domain imports                   |
| shared/api-client           | Catalog GET и отдельный fixed anonymous order POST                                    | server-only, generated transport types; no-store/omit credentials/no retry для заказа                     |

Actual Nx snapshot был построен для девяти affected/direct projects. Итоговый boundary check проверил113 projects. Единственный новый documented cross-domain flow — cart/feature → product/model для productPath/isValidProductSlug. UI → product/model и feature → feature по-прежнему запрещены. Новых projects/aliases/packages не добавлено.

## AF-003 — lint cache не учитывал фактические правила

- **Severity / status:** P2, verified.
- **Evidence / path:** `libs/site/cart/feature/project.json:11`; то же в cart/{model,data-access,ui,seo}/project.json. Baseline resolved Nx targets имели default + отсутствующие .eslintrc.json/.eslintignore/eslint.config.mjs + eslint. default ограничен project root, sharedGlobals пуст.
- **Правило:** фактические checks/metadata обязаны обеспечивать заявленные ограничения: [testing rules](../../../../../standards/shared/testing-rules.md#verification-path), [delivery baseline](../../../../../standards/shared/delivery-rules.md#specification-readiness).
- **Влияние:** изменение общего CJS/custom rules могло оставить cached lint success без повторной проверки новых правил.
- **Owner / task / dependency:** frontend Kedr; [EN-001](../tasks/enablers/EN-001-cart-foundation.md); независима от других fixes.
- **Target / fix:** только пять cart project.json: default, реальный eslint.config.cjs, tools/eslint-rules/**/* и externalDependencies:eslint; отсутствующие legacy paths удалены. Tags, test/typecheck targets и другие поля сохранены.
- **Verification:** actual nx show project для всех пяти — exit0, cache:true и правильные inputs; JSON без lint.inputs равен baseline5/5, Prettier/SHA5/5. Это config-only исправление, искусственный behavioral Red не создавался. Реальная мутация правил и сравнение task hashes не имитировались.

## AF-004 — DOM focus был смешан с business owner

- **Severity / status:** P2, verified.
- **Evidence / path:** до исправления restoreDrawerFocus проверял только opener.isConnected. Responsive CategoryBar оставляет скрытую compact кнопку в DOM; collapsing header может увести main trigger выше viewport. Старый fallback по client rects также мог выбрать visibility:hidden элемент.
- **Правило:** [R-013/SC-022](../requirements/behavior.md#sc-022--клавиатурное-управление-панелью), [independent responsibilities](../../../../../standards/shared/delivery-rules.md#staged-structure-check).
- **Влияние:** после close/Escape keyboard focus мог не вернуться в видимую шапку; CSS/DOM изменения требовали менять business owner заказа.
- **Owner / task / dependency:** frontend Kedr; [TS-003](../tasks/TS-003-client-owner.md), [TS-004](../tasks/TS-004-cart-drawer.md); независима от URL/config fixes.
- **Target / fix:** `libs/site/cart/feature/src/lib/platform/cart-drawer-focus.ts:2` — отдельный platform adapter. Одна eligibility проверка для opener/fallback: connected, rendered rects, computed display/visibility и viewport intersection. `libs/site/cart/feature/src/lib/state/cart-client-store.ts:210` только делегирует remember/restore. Public store API, cart/draft/recovery/pending/receipt и атомарный submit/complete сохранены.
- **Verification:** valid Red через старый store:3 новых focus assertions fail,18 прежних characterization pass. Green owner21 + adapter6 =27/27; scoped lint. JSDOM получил явные DOMRect fixtures, production eligibility не ослаблена. Проверены hidden/offscreen/disconnected, настоящий opener, отсутствие подходящих controls и SSR без document; это не browser visual check.

## AF-005 — строка UI владела динамическим product URL

- **Severity / status:** P2, verified.
- **Evidence / path:** CartLine самостоятельно собирал /product/{encodedSlug}, дублируя `libs/site/product/model/src/lib/paths/product-paths.ts:12`. После fix presentation — `libs/site/cart/ui/src/lib/cart/cart-line.tsx:63`, feature mapping — `libs/site/cart/feature/src/lib/cart/cart-view-props.ts:18`.
- **Правило:** [Site module ownership](../../../../../architecture/site/structure/modules.md#dependency-rules), [one role per file](../../../../../standards/shared/delivery-rules.md#staged-structure-check); тот же принцип применялся в product AF-001 к category destination. Existing NextLink и статические service destinations разрешены Site, сами по себе не являются нарушением.
- **Влияние:** изменение product path policy требовало синхронных правок UI корзины; её контракт не выражал отдельно отсутствие navigation destination. Текущие безопасные ссылки не объявляются сломанными.
- **Owner / task / dependency:** frontend Kedr; [TS-004](../tasks/TS-004-cart-drawer.md), [TS-005](../tasks/TS-005-checkout-view.md), [TS-009](../tasks/TS-009-app-cart-composition.md). Для завершения требуется разрешённый cart-feature → product-model flow, добавленный одновременно с mapper.
- **Target / fix:** CartLineView extends CartLine с обязательным productHref:string|null. cartViewProps применяет public productPath/isValidProductSlug и localizedPath; не мутирует snapshot. UI выводит готовый opaque href через NextLink или текст при null. Политика выделена из UI без второго owner, fetch или нового runtime wrapper.
- **Verification:** UI CartLine3 + drawer8 + checkout16 =27/27; mapper11/11 (UK/RU, encoding, invalid/missing slug, сохранность строки/snapshot). Это архитектурный перенос; предыдущие UI31 использованы как characterization, искусственный Red не создавался. Свежий runtime2 подтверждает общий product/header/drawer/checkout submit/receipt.

## AF-006 — core shell выпадал из domain fence

- **Severity / status:** P2, verified.
- **Evidence / path:** исходный validateProjectBoundary проверял только type:core. У site-core-shell реальные tags scope:site, scope:site-shared, type:shell; sourceDomain отсутствует. Контрпример core-shell → cart-feature возвращал null; общий ESLint type:shell тоже разрешал feature. Реальный source shell уже был чистым и использовал slots.
- **Правило:** [core/shell → neutral dependencies](../../../../../architecture/site/structure/modules.md#dependency-rules), [EN-002](../tasks/enablers/EN-002-shell-cart-slots.md).
- **Влияние:** будущий прямой domain import мог пройти оба заявленных контроля и вернуть coupling шапки к cart.
- **Owner / task / dependency:** frontend Kedr; [EN-002](../tasks/enablers/EN-002-shell-cart-slots.md), [TS-010](../tasks/TS-010-verification-and-docs.md); local immediate boundary, не systemic refactor других features.
- **Target / fix:** `tools/architecture/project-boundary-rules.mjs:46` и `eslint.config.cjs:241`: нейтральный Site shell с tags scope:site-shared/type:shell не зависит от domain projects. Cart nodes остаются app-injected ReactNode slots. Ограничения Admin/Mobile shell не расширялись.
- **Verification:** добавлены11 boundary fixtures: allow cart-feature→product-model, reject UI→product-model и feature→feature, reject five core-shell→cart layers, retain3 neutral imports. Red6fail/32pass → Green38/38. Прямой lintText реальным root ESLint подтвердил2 разрешённых и5 запрещённых imports без временных source-файлов в репозитории.

## Split / keep по фактической структуре

| Область / production files                   | Решение            | Основание                                                                                                                                                                                             |
| -------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| feature/state2, storage1, runtime2           | Keep               | Один atomic checkout session; storage/action уже отделены, React subscription и document factory имеют свои роли. Разбиение submit/complete создало бы лишние порты без независимого потока.          |
| feature/platform1 (+1 spec)                  | Extract            | DOM visibility/geometry/focus меняется независимо от заказа; AF-004.                                                                                                                                  |
| feature/cart3, checkout3, purchase2          | Keep / move policy | Controllers/selectors/server frame/purchase adapter разделены. Dynamic product path теперь принадлежит существующему view mapper; AF-005.                                                             |
| UI cart7 и checkout7 (включая по1 CSS)       | Keep               | Drawer, row, quantity, notices, header, empty, heading/loading, contacts, summary и receipt уже отделены. Фото-failure — локальное представление конкретной row, без API/формы/глобального состояния. |
| UI purchase1, i18n2, shared2, types1, entry1 | Keep               | Чистый control; typed copy/code presentation; formatter/help; единый UI props contract. types/shared не содержат произвольный business/transport code и не являются dump folders.                     |
| model cart5/checkout3/persistence1 + entry   | Keep               | Чистые инварианты и codec; browser I/O и generated DTO отсутствуют.                                                                                                                                   |
| data-access contracts2/orders1 + entry       | Keep               | Private aliases/response parser и projection/call; contracts location задана Site/API правилами, шаблонный validators path не навязывался.                                                            |
| shared API fixed POST, feature action        | Keep               | Transport владеет HTTP/timeout, domain parsing — data-access, unknown command validation/action — server boundary. Catalog GET не превращён в произвольный transport.                                 |

По public roots нет недостижимого production кода; cart.fixture.ts используется UI tests. Все5 aliases используются, пустые слои/compatibility files не добавлены. Для Site не установлен числовой порог строк; Admin/Mobile thresholds не применялись. Новых runtime файлов кроме platform adapter не потребовалось.

## Итоговые проверки текущего аудита

| Проверка                                | Результат                                  |
| --------------------------------------- | ------------------------------------------ |
| Owner + platform adapter                | 27/27                                      |
| UI row/drawer/checkout                  | 27/27                                      |
| Feature view mapping                    | 11/11                                      |
| Runtime composition                     | 2/2                                        |
| Boundary fixtures                       | 38/38                                      |
| Actual ESLint shell probes              | 2 allowed +5 rejected                      |
| Nx resolved lint inputs                 | 5/5 correct cached targets                 |
| Static client/import reachability       | 56 TS files,13 client entries;0 violations |
| Actual project boundary check           | 113 projects, exit0                        |
| App + feature.spec + UI.spec TypeScript | exit0                                      |
| Scoped ESLint changed source/test       | exit0,13 files                             |

**Свежие runtime/unit/component assertions:67**, отдельно38 boundary fixtures и7 ESLint probes. Полный прежний253-test набор не перепрогонялся. CLI/config checks и линтер не подсчитываются как business scenarios.

Команды выполнялись из корня репозитория:

```powershell
node node_modules/vitest/vitest.mjs run --config libs/site/cart/feature/vite.config.mts src/lib/state/cart-client-store.spec.ts src/lib/platform/cart-drawer-focus.spec.ts --maxWorkers=1 --fileParallelism=false --testTimeout=20000
node node_modules/vitest/vitest.mjs run --config libs/site/cart/ui/vite.config.mts cart-line.spec.tsx cart-drawer.spec.tsx checkout-view.spec.tsx --maxWorkers=1 --fileParallelism=false --testTimeout=20000
node node_modules/vitest/vitest.mjs run --config libs/site/cart/feature/vite.config.mts cart-view-props.spec.ts --maxWorkers=1 --fileParallelism=false --testTimeout=20000
node node_modules/vitest/vitest.mjs run --config libs/site/cart/feature/vite.config.mts cart-runtime.spec.tsx --maxWorkers=1 --fileParallelism=false --testTimeout=20000
node --test tools/architecture/check-project-boundaries.spec.mjs
node tools/architecture/check-project-boundaries.mjs
node node_modules/typescript/bin/tsc --noEmit --incremental false -p libs/site/cart/feature/tsconfig.spec.json
node node_modules/typescript/bin/tsc --noEmit --incremental false -p libs/site/cart/ui/tsconfig.spec.json
node node_modules/typescript/bin/tsc --noEmit --incremental false -p apps/site/tsconfig.json
```

Nx для каждого из model,data-access,ui,seo,feature: node node_modules/nx/dist/bin/nx.js show project site-cart-<layer> --json. Scoped ESLint использовал root eslint.config.cjs и13 изменённых TS/TSX/MJS файлов. Точный список/runner, actual lintText probes и read-only AST walk сохранены локально в E:/Development/_codex-work/kedr-site-cart-audit-2026-11-04; они не меняют runtime source. Первая попытка старого bin/nx.js была infra failure, не Red; установленный dist/bin/nx.js выполнился успешно.

Ограничение AST walk: static imports/exports cart+shared API; use-server edge завершает client traversal. Dynamic imports/full shared UI graph не исследовались; непосредственные public entrypoints core/config/i18n/shared UI просмотрены отдельно. Runtime responses/API не менялись, поэтому contracts sync/generate и повтор API suite не требовались.

Docs links/format/traceability/concept checksum и git diff --check проверены после сохранения. Принятый concept и CSS 720 px не менялись. Production build, dev server, live HTTP/order, browser/visual/manual/E2E, deployment и SEO/full-repository audit не запускались. React/JSDOM geometry cases не являются проверкой отображения в браузере.

## Исторические AF-001 / AF-002 — внедрение до текущего аудита

- **AF-001 / P2, verified:** `libs/site/cart/feature/src/lib/state/cart-client-store.ts:233`; R-008 / SC-015, owner frontend Kedr, [TS-007](../tasks/TS-007-checkout-lifecycle.md). Синхронный pending subscriber мог вызвать второй submit до установки inFlight. Lock устанавливается до notification, immutable command сохранена. Первоначальный valid Red: action2 вместо1; Green owner18/18. Нынешний owner21 regression сохраняет этот тест.
- **AF-002 / P3, verified:** `libs/site/cart/feature/src/lib/purchase/cart-purchase-controller.tsx:37`; R-016 / SC-001/004 и product SC-013, owner frontend Kedr, [TS-009](../tasks/TS-009-app-cart-composition.md). Reject после принятой попытки мог сохранить прежнее Added feedback. Перед попыткой сбрасываются подтверждение/timer; valid Red → purchase-controller1/1 и scoped lint/types при внедрении. Этот независимый test повторно в текущем аудите не запускался.

Исторические253 scoped results и исходный Red/Green — [implementation evidence](../verification/implementation.md). Предыдущее локальное server review, разделение model/transport/UI и неизменённая snapshot/generated граница сохранены. В текущем аудите добавлен один documented product-model flow; прежнее отсутствие новых allowlist entries относилось к первоначальной app injection.
