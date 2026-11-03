# Готовность SEO-дизайна

- [x] `/uk/contacts` и `/ru/contacts` включены в проектную URL policy и реализованы.
- [x] Определены локализованные title/description/H1/OG и существующий root brand template.
- [x] Canonical остаётся в своём языке; alternates взаимны, HTML x-default ведёт на uk.
- [x] Общие production flags и preview noindex/nofollow сохраняются.
- [x] BreadcrumbList выбран для страницы; Organization принадлежит layout; Store/address/hours не выдумываются.
- [x] Sitemap дополняется существующим descriptor pipeline, без дубликатов и фиктивного lastModified.
- [x] Filters/sort/pagination — n/a для статических контактов.
- [x] Основное содержимое и SEO проектируются серверными; темы не меняют URL/каноникал.
- [x] R/SC связаны с TS-004/TS-005 и будущими test/evidence.
- [x] Build/HTTP/browser проверки явно отделены от готовности дизайна; они не были выполнены этой поставкой; focused SEO/sitemap tests прошли.

Основание — [SEO design](../design/seo.md), фактические результаты будут в [verification](../verification/seo-verification.md).
