# Next.js readiness — план

- [x] Next 16.4.3 подтверждён lockfile; соответствующие installed guides прочитаны.
- [x] Thin route и Promise params/locale guard заданы.
- [x] Existing locale layout владеет static params, shell, fonts, lang и Organization.
- [x] Полный policy content server-first; page client island не нужен.
- [x] Static content совместим с текущими Cache Components; нет request-time APIs, fetch, нового caching или data-access.
- [x] Модель, UI, feature и SEO разделены через существующие public APIs.
- [x] Новые metadata/JSON-LD, error/404 и конфигурационные границы определены.
- [x] Focused tests и narrow route typecheck спланированы.

План реализован: код/server markup, direct Next typegen и tsc проверены. HTTP и production build не выполнялись; фактический scope отражён в delivery-readiness.md.
