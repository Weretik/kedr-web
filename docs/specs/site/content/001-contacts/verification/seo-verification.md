# Проверка SEO и интеграции

**Дата:** 2026-11-03. **Статус:** код контактов реализован; focused automated tests и source review пройдены. Реальный HTTP/head, production build, browser/visual и E2E не запускались.

## Первичная реализация: выполненные проверки

| Проверка                         | Фактический результат                                                                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `site-content-ui:vite:test`      | Exit 0, 4 файла / 35 тестов; contacts content 11, clipboard 8, существующие returns 8 и delivery 8                                             |
| `site-content-seo:vite:test`     | Exit 0, 4 файла / 20 тестов; contacts metadata 5, BreadcrumbList 2, существующие delivery 9 и returns 4                                        |
| `site-content-feature:vite:test` | Exit 0, 3 файла / 9 тестов; contacts server composition 4, shared sitemap 2, existing delivery composition 3                                   |
| `site:typecheck`                 | Exit 0; `next typegen && tsc --noEmit -p tsconfig.json`, route types успешно сгенерированы                                                     |
| Scope/source review              | Один server feature и BreadcrumbList, отдельный client clipboard leaf, существующий layout Organization/main, оба locale guard, public imports |

Все четыре запуска были uncached (Nx cache 0/1). Время site:typecheck 21.9 s; feature target 17.5 s. Локальный runtime: Node 24.18.0, Nx 24.0.3, Vitest 5.0.5. Это не общий прогон приложения или репозитория.

Из корня `E:\RiderProjects\kedr-web` использовались следующие команды, каждая на своём этапе:

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path
$env:NX_DAEMON = 'false'
$env:NX_ISOLATE_PLUGINS = 'false'
$env:NX_TUI = 'false'
& 'C:\Program Files\nodejs\node.exe' 'node_modules\nx\dist\bin\nx.js' run site-content-ui:vite:test --output-style=static -- --run
& 'C:\Program Files\nodejs\node.exe' 'node_modules\nx\dist\bin\nx.js' run site-content-seo:vite:test --output-style=static -- --run
& 'C:\Program Files\nodejs\node.exe' 'node_modules\nx\dist\bin\nx.js' run site-content-feature:vite:test --output-style=static -- --run
& 'C:\Program Files\nodejs\node.exe' 'node_modules\nx\dist\bin\nx.js' run site:typecheck --output-style=static
```

## Что доказывают проверки

- Metadata unit tests проверяют обе локали, plain title/description, self canonical paths, reciprocal alternates/x-default, OG и три случая выключенной индексации. MetadataBase по-прежнему принадлежит root layout.
- BreadcrumbList unit tests используют контролируемый нестандартный origin и проверяют два абсолютных локализованных item. Organization/Store/часы/координаты в page builder отсутствуют.
- Feature tests реально вызывают renderToStaticMarkup: заголовок, факты COMPANY и contact/help links есть до hydration, новый main отсутствует, выводится один BreadcrumbList. Они не запускают HTTP-сервер Next.
- Sitemap integration даёт ровно UK/RU contacts URL, reciprocal languages, без lastModified; сохраняет delivery/returns и отсутствие дубликатов.
- Source integration подтверждает locale guard в новом route, существующую Organization в layout, lang/theme/skip-link и сохранение пути в language switch. Это не проверенный HTTP 404 или rendered geometry.

## Последующая проверка архитектурного аудита

[Полный отчёт и AF-001…AF-006](../code-audit/audit.md). После разделения UI и исправлений: UI 36/36, feature 9/9, boundary fixtures 12/12; model/scoped lint, source typecheck и отдельные UI/SEO/feature spec typechecks — exit 0. Контрольная навигационная мутация дала 4 expected failures, после чего production leaf восстановлен побайтно.

Первичная таблица выше сохраняет историческое evidence. SEO production/test code не менялся и его 20 tests повторно не запускались. HTTP/build/browser/visual статус по-прежнему unrun.

## Незапущенные release-проверки

| Проверка                     | Ожидаемый результат                                                                       | Фактический статус                                           |
| ---------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| HTTP `/uk/contacts`          | 200, UK head/H1, absolute self canonical и reciprocal alternates, основной HTML и JSON-LD | Unrun: отдельный запуск приложения/HTTP не разрешён          |
| HTTP `/ru/contacts`          | 200, русский текст и canonical своей локали                                               | Unrun: та же причина                                         |
| HTTP `/en/contacts`          | 404 без indexable fallback                                                                | Unrun; проверены исходные guard и route types                |
| Preview HTTP robots/head     | noindex/nofollow и действующий robots gate                                                | Unrun; helper policy tests пройдены                          |
| Production build route table | Фактический рендеринг согласован с Next.js design                                         | Unrun: build требует отдельного поручения                    |
| Browser / visual / E2E       | Фактическая геометрия, темы/локали и взаимодействия в браузере                            | Unrun: требуется отдельное разрешение на конкретную проверку |

Для последующей проверки записать реальное окружение/origin, revision или состояние рабочей копии, точную команду, exit/result и выдержки status/head/JSON-LD. Не выдавать unit output за итоговый HTTP head. На этом этапе deployment и включение индексации не выполнялись.

[Локальное review](local-review.md), [задачи](../tasks/README.md), [правила проверок](../../../../../standards/shared/testing-rules.md).
