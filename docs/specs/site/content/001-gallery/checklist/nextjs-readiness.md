# Next.js readiness

- [x] Next 16.4.3 подтверждён lockfile/установленным пакетом; нужные installed guides прочитаны.
- [x] Thin route в (content)/galleria, locale из existing layout; публичный адрес сохраняется.
- [x] Rendering static/rebuild, Cache Components проекта не меняется.
- [x] Immutable server-only source, без request-time APIs, Server Actions и выдуманного API/cache.
- [x] Header/H1/metadata/JsonLd server-owned; client island ограничен коллекцией и просмотром.
- [x] Начальный SSR содержит материалы/native href, остаток имеет noscript fallback.
- [x] Нет iframe до выбора, autoplay=0; lifecycle и cross-origin fallback заданы.
- [x] Image sizes/alt/loading/error и предупреждение priority deprecated отражены.
- [x] Не планируются revalidate/dynamic/dynamicParams/unstable_cache и общие изменения Next config.
- [x] Route и source реализованы, server output подтверждён тестами — TS-002/TS-006 passed.
- [x] site:typecheck TS-006 passed.
- [ ] HTTP/build output — не выполнялся; только отдельный разрешённый объём, не искусственный blocker документации.

- [ ] Следующий контентный этап: реальные фотографии.
