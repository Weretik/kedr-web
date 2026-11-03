# Next.js readiness

- [x] Публичный сайт и два localized content URL определены.
- [x] Next.js 16.4.3 подтверждён lockfile и установленным package.
- [x] Изучены релевантные installed guides layouts/pages и Cache Components.
- [x] Rendering/freshness/status contract записан; runtime APIs странице не нужны.
- [x] Thin route и async locale guard следуют contacts pattern.
- [x] Родительский layout владеет locale static params; новый route не добавляет собственные cache directives.
- [x] Server/client boundary ограничивает hydration clipboard leaf.
- [x] Main/skip-link принадлежат existing shell; Organization — locale layout, WebSite — главной.
- [x] API/DTO/auth/revalidation handler n/a — функция использует локальные публичные факты.
- [x] Planned exact file map и public exports определены.
- [x] Выбран focused harness, новые проекты/aliases/packages не нужны.
- [x] HTTP/build evidence отделено от source/component evidence.
- [x] Подтверждённые факты доступны через EN-001.
- [x] Thin route/server integration проверены: 5 tests; site:typecheck exit 0 (Nx cache 1/1).

Подробности: [Next.js design](../design/nextjs.md), [TS-005](../tasks/TS-005-route-integration.md).
