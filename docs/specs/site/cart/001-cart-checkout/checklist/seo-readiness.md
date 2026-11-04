# SEO readiness

- [x] Checkout — private route /uk/checkout и /ru/checkout, отдельной cart/success страницы нет.
- [x] Production noindex/follow и preview noindex/nofollow делегируются core helper.
- [x] Canonical/hreflang/order JSON-LD и personal metadata не добавляются.
- [x] Existing production PRIVATE_PATHS disallow сохранён, sitemap исключает checkout.
- [x] Header/cart navigation uses nofollow Link либо modal button; существующие информационные ссылки остаются локализованными.
- [x] SSR frame/fallback не содержит user cart/contacts, private cache не используется.
- [x] TS-008 подтвердила metadata/crawling/server assertions.
- [ ] HTTP/build/browser output проверен только при отдельно согласованной необходимости; без результата не отмечать passed.

План проверок: [seo-verification.md](../verification/seo-verification.md). Эта SDD не меняет общую стратегию индексации Site.
