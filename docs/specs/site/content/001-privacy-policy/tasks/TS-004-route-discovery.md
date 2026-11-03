# TS-004 — Route composition и обнаружение URL

- **Covers:** SC-001, SC-007, SC-009, SC-011, SC-012, SC-013.
- **Depends on:** TS-002, TS-003.
- **Status:** complete, 2026-11-03.
- **Paths:** apps/site/src/app/[locale]/(content)/privacy-policy/page.tsx; libs/site/content/feature/src/lib/privacy-page.tsx и privacy-page.spec.tsx; feature/src/index.ts; feature/src/lib/content-sitemap.ts и content-sitemap.spec.ts.
- **Test level:** sitemap unit + narrow route type/source boundary.
- **Architecture baseline:** [Next.js](../design/nextjs.md); existing locale layout, app sitemap и public core/domain APIs.

## Work

- [x] Feature связывает COMPANY/siteConfig с pure dictionary и UI, добавляет page BreadcrumbList через JsonLd.
- [x] Route только ожидает params, проверяет isLocale/notFound и делегирует feature/metadata.
- [x] Добавить один privacy descriptor в существующий CONTENT_SITEMAP_PAGES, сохранить все соседние страницы.
- [x] Дополнить sitemap test для обеих локалей, reciprocal alternates и отсутствия fabricated lastModified/fragments.
- [x] Подтвердить, что existing footer legal link и locale switch ведут на реализованный адрес без правок shell; public-offer destination остаётся существующим.
- [x] Проверить реальные file roles и тонкую границу app → domain; не переносить composition в route.

## Evidence

Фактическая команда: node node_modules/vitest/vitest.mjs run --config libs/site/content/feature/vite.config.mts src/lib/privacy-page.spec.tsx src/lib/content-sitemap.spec.ts

Red: exit 1, 3 expected failures нового SSR entry/sitemap, 6 прежних sitemap cases passed. Green: exit 0, 2 specs / 9 tests, 97.31s. В реальном PrivacyPage server markup сохранены полный документ, config bindings и единственный BreadcrumbList с видимыми локализованными именами. Соседние sitemap entries сохранены.

Дополнительно к planned map добавлен libs/site/content/feature/src/lib/privacy-page.spec.tsx для риска actual server composition. Это точное интеграционное доказательство SC-009/SC-013, не новая продуктовая функциональность.

Nx site:typecheck остановился до компиляции из-за plugin workers. Точное содержимое цели выполнено напрямую из apps/site, NX_DAEMON=false/NX_ISOLATE_PLUGINS=false только в окружении процесса:

```text
node ../../node_modules/next/dist/bin/next typegen
node ../../node_modules/typescript/bin/tsc --noEmit -p tsconfig.json
```

Exit 0; types generated, diagnostics отсутствуют. Independent review подтвердил async params/isLocale/notFound, pure bindings, реальные exports и единственный новый descriptor. HTTP 200/404 и build не запускались.

## Checkpoint

Тонкий route, configured server composition и additive sitemap согласованы; существующие entries и shell сохранены. Unit/type/source evidence записаны с границами.
