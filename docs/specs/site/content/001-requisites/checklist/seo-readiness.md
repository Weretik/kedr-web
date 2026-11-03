# SEO readiness

- [x] URL/index policy определена для UK/RU и invalid locale.
- [x] Старый /{locale}/requisites сохраняется; вымышленный /about-us redirect не добавляется.
- [x] Title/description локализованы, источник — content/seo record.
- [x] Self canonical, reciprocal uk-UA/ru-UA и HTML x-default на UK заданы.
- [x] Robots использует existing production gate; локальная/preview индексация не включается.
- [x] OG website/current locale и alternateLocale заданы существующим builder.
- [x] Twitter/новое OG image n/a: функция не добавляет assets/defaults.
- [x] BreadcrumbList соответствует двум видимым крошкам; Organization остаётся в layout.
- [x] Sitemap descriptor добавляется через existing registry, без fabricated lastModified.
- [x] Sitemap alternates повторяют actual builder, без обещанного x-default в XML.
- [x] Главный контент и JSON-LD выводятся server-side; client-only fetch не нужен.
- [x] SC-013…SC-016 и соответствующие TS/evidence определены.
- [x] Новые site-wide SEO решения не вносятся.
- [x] SEO builders, route и sitemap реализованы и проверены на выбранных unit/server/source уровнях.
- [x] EN-001 закрыт явным подтверждением пользователя.
- [ ] EN-002 остаётся открытым перед публикацией связанных юридических ссылок.
- [ ] Реальный head/status/schema validation выполнен, если отдельно поручен; сейчас unrun.

Политика и ожидаемые alternates: [SEO design](../design/seo.md). Unit или source review не маркируются как реальные HTTP/validator results.
