# Контакты — проверка SEO

**Дата:** 2026-11-02. Unit/server-render проверки выполнены; production build, реальные HTTP-ответы и browser-проверки не выполнялись. Команды и результаты — в [отчёте](implementation.md).

| Объект                          | Подтверждено                                                                                                 | Доказательство                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Metadata uk/ru                  | Уникальные строки, длина, self canonical без query, alternates и OG                                          | TS-002: `contacts-seo.spec.ts`, 8/8 с остальными SEO-проверками |
| Robots                          | Production с обоими флагами; production без разрешения, preview, development                                 | TS-002: 4 unit-кейса через общую конфигурацию                   |
| Серверное содержимое            | Один H1, контакты и реальные href присутствуют при серверном render, без клиентского fetch                   | TS-003: `contacts-page.spec.tsx`, обе локали                    |
| JSON-LD                         | ContactPage и две крошки, абсолютные ID, существующая Organization, без LocalBusiness/неподтверждённых полей | TS-002 unit и TS-003 server-render                              |
| Sitemap                         | uk/ru контакты, взаимные alternate links, без query/lastModified, сохранение других entries                  | TS-003: `contacts-sitemap.spec.ts` и проверка app-агрегатора    |
| Реальные ответы маршрута и head | Не проверены: HTTP 200/404, собранный Next.js `<head>`, сетевой sitemap                                      | Нужен отдельно разрешённый production build + HTTP-smoke        |

При отдельном разрешении выполнить `npx nx run site:build`, сохранить таблицу маршрутов, запустить production-сервер и выполнить `curl` для `/uk/contacts`, `/ru/contacts`, `/uk/contacts?utm_source=test`, `/xx/contacts`, `/uk/contacts/unknown`, `/sitemap.xml`. Зафиксировать фактические status, title, description, canonical, hreflang, robots, JSON-LD, origin и команды. Разрешение HTTP-проверки не означает разрешение открыть браузер.

Browser/visual/E2E требуют отдельного вопроса о конкретной проверке и прямого ответа владельца. Отсутствие этих проверок отражено как предел evidence; автоматические результаты не подменяют их.
