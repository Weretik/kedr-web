# TS-003 — Серверные блоки принятого дизайна

- **Status:** verified 2026-11-03; server UI/component boundary.
- **Covers:** SC-001…SC-005, SC-011, SC-012.
- **Depends on:** TS-001, TS-002. Готовность назначения оферты/политики отдельно зависит от EN-002.
- **Точные пути:** `libs/site/content/ui/src/lib/requisites/requisites-content.tsx`, `requisites-header.tsx`, `requisites-administration.tsx`, `requisites-bank.tsx`, `requisites-payment.tsx`, `requisites-support.tsx`, `requisites-content.spec.tsx` в той же директории; `libs/site/content/ui/src/index.ts`.
- **Test level:** component + source theme/breakpoint inspection.
- **Baseline:** [visual](../design/visual.md), существующие site tokens и shared/ui.

## Work

- [x] Собрать H1, intro, anchors и два смысловых блока с definition lists.
- [x] Передать два ready payload в clipboard leaf; name/IBAN не встраивать в картинку.
- [x] Сделать md two-column layout и mobile stacking, breakable строки и отдельное место copy hit-area.
- [x] Добавить пояснение оплаты, tel из props и локализованные delivery/offer/privacy href.
- [x] Сохранить один main у shell; разделы имеют IDs requisites-administration/bank/payment, scroll offset учитывает sticky header.
- [x] Проверить UK/RU, exact visible values, accessible actions, landmarks и совпадение anchors/targets компонентно.
- [x] Сверить light/dark tokens, primary button variants, focus и адаптивные classes по исходникам.
- [x] Экспортировать только RequisitesContent; каждый смысловой блок имеет одну ответственность. Runtime PNG/preview CSS не импортировать.

## Evidence

Выполнено P3; после local source review добавлен InfoIcon в payment band. Только RequisitesContent экспортирован публично.

- Команда: `npx nx run site-content-ui:vite:test -- --run src/lib/requisites/requisites-content.spec.tsx src/lib/requisites/requisites-copy-button.spec.tsx`.
- Valid Red: exit 1, 2 failed / 16 passed — отсутствовала privacy link в UK/RU.
- До этого исправлена detached DOM fixture в тесте; её ошибка не считалась behavioral Red.
- Финальный Green/regression: exit 0, 2 files / 18 tests passed, cache 0/1. Полный payload передаётся props, IBAN копируется raw.
- Scoped ESLint всех 9 новых UI файлов exit 0; после последних правок повторены только payment/support/content.spec (3 файла), exit 0. Prettier pass.
- Source review: tokens/card/brand-soft/brand-text, shared primary Button, md two-column/mobile stack, min-w-0/переносы, 44px target, scroll offsets/focus, исходное UAимя. Независимый source review существенных дефектов не выявил.
- href assertions проверены; SC-012 остаётся blocked по EN-002. Browser geometry не проверялась.

## Checkpoint

Server-compatible UI соответствует композиции/текстам, обе локали и семантика проверены, длинные строки имеют корректные правила переноса. Фактические geometry и legal destination evidence не выдуманы.
