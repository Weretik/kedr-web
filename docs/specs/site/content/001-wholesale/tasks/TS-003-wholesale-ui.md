# TS-003 — Серверные UI-блоки принятого дизайна

- **Status:** completed 2026-11-03 (automated/source scope).
- **Covers:** SC-001, SC-002, SC-005, SC-006, SC-007, SC-008, SC-009, SC-010.
- **Depends on:** TS-001.
- **Paths:** `libs/site/content/ui/src/lib/wholesale/wholesale-content.tsx`; `libs/site/content/ui/src/lib/wholesale/wholesale-hero.tsx`; `libs/site/content/ui/src/lib/wholesale/wholesale-assortment.tsx`; `libs/site/content/ui/src/lib/wholesale/wholesale-company.tsx`; `libs/site/content/ui/src/lib/wholesale/wholesale-steps.tsx`; `libs/site/content/ui/src/lib/wholesale/wholesale-faq.tsx`; `libs/site/content/ui/src/lib/wholesale/wholesale-contact.tsx`; `libs/site/content/ui/src/lib/wholesale/wholesale-content.spec.tsx`; `libs/site/content/ui/src/index.ts`.
- **Test level:** Component + source token/breakpoint review; без browser/visual.
- **Architecture baseline:** content/ui принимает только собственные model props, core helpers и shared/ui. Ассортимент — ReactNode/null slot, без catalog imports.
- **Rules:** [delivery](../../../../../standards/shared/delivery-rules.md), [testing](../../../../../standards/shared/testing-rules.md), [file-role map](../design/frontend.md).

## Work

- [x] Собрать v2 sections с отдельными смысловыми владельцами; использовать existing Button/cn и theme tokens, не добавлять client state/новый main/global CSS.
- [x] Реализовать contact href, локализованные useful links, видимые FAQ-ответы и null-slot fallback; ссылки не отправляют сообщение автоматически.
- [x] Проверить обе локали, основной H1, 3 шага/3 FAQ, все links и slot/fallback; сохранность source focus, heading hierarchy и responsive wiring 360/768/1440 в обеих темах.
- [x] Проверить целостность ответственности изменённых файлов; при смешении независимых ролей разделить по существующим границам, записать решение и повторить затронутую проверку. Полный аудит не добавляется автоматически.

## Evidence

2026-11-03, completed. Runner target подтверждён nx show project site-content-ui. Устаревший путь Nx/bin в первой harness-попытке не засчитывался как Red; использован действующий Nx24 dist/bin либо npx.

Команды:
npx nx run site-content-ui:vite:test -- --run wholesale
npx nx run site-content-ui:vite:test --output-style=static -- --run wholesale.

Red: exit1, 1 spec/8 behavioral failures на импортируемом div-scaffold. Green: exit0, 8/8. После repo formatting финальная narrow regression с первой командой: exit0, 8/8, без cache hit.

Проверены UK/RU sections/order, H1,3steps/3visibleFAQ, supplied contact props и exact Viber, useful localized href, null slot fallback без потери остальных блоков. Source: tokens/breakpoints/focus/min-w-0/wrapping. Structure: composition + шесть самостоятельных блоков, нет catalog imports/fetch/client state/main/form/globalCSS.

## Checkpoint

Собственные секции принимают данные без cross-domain imports, отображают принятую структуру/тексты и устойчивый fallback.
