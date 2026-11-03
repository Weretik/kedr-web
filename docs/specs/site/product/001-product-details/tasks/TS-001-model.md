# TS-001 — Модель, пути и purchase policy

- **Covers:** SC-002–SC-006, SC-011, SC-024.
- **Depends on:** EN-001.
- **Status:** implemented, unit verified.
- **Exact paths:** `libs/site/product/model/src/lib/{entities/product-details.ts,results/product-result.ts,paths/product-paths.ts,purchase/purchase-policy.ts}`; adjacent `.spec.ts`; public `src/index.ts`.
- **Test level:** unit.
- **Baseline:** [data model](../data-model.md), [frontend boundaries](../design/frontend.md); без React/DTO/transport в model.

## Work

- [x] Определить mapped entities/results/media, безопасные пути без slug-generation.
- [x] Выразить независимые price/stock action modes, правило positive integer quantity и отсутствие произвольной кратности/лимита.
- [x] Добавить содержательные boundary cases: stock=false + price=null, pack=10 и quantity=2, invalid quantity/path segment.
- [x] Проверить единую ответственность типов и pure policy, не включать туда clipboard/cart storage.

## Evidence

P-DATA: valid behavioral Red — cart вместо request-stock; затем .\node_modules\.bin\vitest.cmd run --config libs/site/product/model/vite.config.mts, exit0,2 files/33 tests. Проверены безопасные slug/paths, price-stock priority и positive safe integer без max99/MOQ. Pure model roles проверены; форматирование и imports не меняли поведение.

Подробности: [implementation evidence](../verification/implementation.md).

## Checkpoint

Все четыре price/stock комбинации имеют одно определённое действие; pack не меняет количество, пути безопасны и совпадают с существующим route contract.
