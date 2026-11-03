# TS-002 — Responsive UI и оглавление

- **Covers:** SC-001, SC-002, SC-004…SC-009.
- **Depends on:** TS-001.
- **Status:** complete, 2026-11-03.
- **Paths:** libs/site/content/ui/src/lib/privacy/privacy-{content,header,summary,navigation,policy,contact}.tsx; privacy-content.module.css; privacy-content.spec.tsx; libs/site/content/ui/src/index.ts.
- **Test level:** component + server render; source CSS/theme review.
- **Architecture baseline:** [visual](../design/visual.md), [frontend map](../design/frontend.md); server UI, native details и shared Button/Link patterns.

## Work

- [x] Реализовать блоки принятого концепта и полный документ из typed model.
- [x] Сохранить mobile/desktop TOC, native links, unique targets и выбранный hash без scrollspy.
- [x] Реализовать configured email/tel и локализованный related offer link.
- [x] Проверить обе локали, полный текст, disclosure keyboard semantics, href/target consistency и server-render content.
- [x] Проверить wiring tokens, обе темы, lg breakpoint, перенос email, reading measure, hidden TOC и offsets по source; не утверждать rendered visual pass.
- [x] Проверить отдельные роли composition/navigation/policy/contact; не трогать shell и global.css.

## Evidence

Фактическая команда: node node_modules/vitest/vitest.mjs run --config libs/site/content/ui/vite.config.mts src/lib/privacy/privacy-content.spec.tsx

Red: exit 1, 12 ожидаемых assertion failures отсутствующих H1/summary/policy/TOC/contact. Green: exit 0, 1 spec / 12 tests, 45.32s. Полный server HTML, обе локали, порядок блоков, 8 unique targets, 15 paragraphs/11 list items, native details click state, mailto/tel/offer проверены.

После Green применено только форматирование project Prettier, без изменения семантики; последующая feature SSR проверила конечную композицию. Source review подтвердил обе темы, lg wiring, sticky/offsets и wrapping. CSS Modules применяют attribute IDs, клиентское состояние не добавлено. Independent UI/source review существенных замечаний не нашёл.

Реальная клавиатура/hash scroll/history и rendered visual behavior не проверялись в браузере; jsdom не используется как такое доказательство.

## Checkpoint

Полный документ и выбранная адаптивная композиция доступны без page JavaScript. Component/server-render assertions проходят; нет новой клиентской логики, неверного aria-current или потери разделов.
