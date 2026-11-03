# SEO readiness

- [x] URL/index/canonical/redirect/missing/error policy определена для продукта.
- [x] Title/description/OG/locale inputs имеют фактический источник; prototype data исключены.
- [x] Product/Offer/BreadcrumbList отражают видимые данные, unknown price не создаёт zero Offer.
- [x] Safe server JsonLd и existing indexing gate сохраняются.
- [x] Product sitemap source, paging/sharding/limits и отсутствие выдуманного lastModified записаны.
- [x] Core generic metadata/sitemap defaults не выдаются за подтверждение второй locale.
- [x] Ограничения translation signal/CDN/snapshot явно зафиксированы, нет скрытых backend требований.
- [x] TS-006/TS-008 реализованы: SEO9, crawling29, core5 tests прошли.
- [ ] Реальные HTML/status/XML/validator checks выполнены после соответствующего разрешения либо отмечены unrun.

Продуктовый URL уже предусмотрен общей SEO policy; при реализации обновляются её actual rendering/crawling facts. Эта SDD не меняет production/indexing flags.
