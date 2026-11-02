# Контакты — выполнение и доказательства

**Дата:** 2026-11-02. **Результат:** EN-001 и TS-001…TS-004 выполнены. СДД и реализация разрешены владельцем в чате. Изменения находятся в рабочем дереве; публикация и переключение домена не выполнялись.

## Объём

Реализованы `/uk/contacts` и `/ru/contacts`, четыре блока концепта, реальные контактные ссылки, клиентское копирование с обработкой ошибок, uk/ru тексты, metadata, `ContactPage` / `BreadcrumbList`, запись sitemap. Контакты читаются из `COMPANY`. Тело страницы не использует API и не содержит формы. Родительский shell, его язык/тема и общая `Organization` сохранены.

Карта файлов совпадает с [фактической карточкой](../../../../../features/site/contacts.md). Каждый блок имеет отдельного владельца; копирование отделено от серверного представления. Существующие route и sitemap остаются тонкими точками композиции. Новые библиотеки используют публичные index; cross-domain исключения и API-модели не добавлялись.

## EN-001 — Генерация и границы

Выполнены команды с `NX_DAEMON=false NX_ISOLATE_PLUGINS=false`:

```sh
npx nx g @nx/react:library libs/site/content/ui --name=site-content-ui --bundler=none --unitTestRunner=vitest --tags=scope:site,domain:content,type:ui --style=css --skipFormat --skipPackageJson --no-interactive
npx nx g @nx/react:library libs/site/content/seo --name=site-content-seo --bundler=none --unitTestRunner=vitest --tags=scope:site,domain:content,type:util --style=css --skipFormat --skipPackageJson --no-interactive
npx nx g @nx/react:library libs/site/content/feature --name=site-content-feature --importPath=@site/content/feature --bundler=none --unitTestRunner=vitest --tags=scope:site,domain:content,type:feature --style=css --skipFormat --skipPackageJson --no-interactive
```

Каждая завершилась с exit 0. После генерации удалены демонстрационные компоненты/CSS/тесты и Babel-конфиги; конфигурации приведены к Site. Дополнительный scoped Vitest plugin с целью `test` удалён в пользу существующей `vite:test`; генераторское форматирование `nx.json` и корневого ESLint отменено. В `tsconfig.base.json` сохранены только три новых aliases; в `package.json` — включение проектов в существующий `test:site`, без изменения зависимостей/lockfile.

Фактический граф через `createProjectGraphAsync()` подтвердил теги и inferred цели `vite:test`, `typecheck`, `lint` для всех трёх проектов. Внутренние рёбра:

- UI → core/config, core/i18n, shared/ui.
- SEO → core/config, core/i18n, core/seo.
- Feature → content/ui, content/seo, core/seo; тесты дополнительно используют core/config и core/i18n.

## TS-001…TS-003 — Red, Green, структура и регрессия

| Задача | Содержательный Red                                                                                                | Green и финальная регрессия                                                  |
| ------ | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| TS-001 | 7 clipboard-тестов упали: пустой компонент не предоставлял доступной кнопки                                       | 11/11: 7 clipboard interaction и 4 component-проверки uk/ru каналов и блоков |
| TS-002 | 8 тестов упали: пустые metadata и JSON-LD не имели title/robots/схем                                              | 8/8: две локали, 4 конфигурации индексации и 2 набора схем                   |
| TS-003 | 4 теста упали: отсутствовали H1/контакты в серверном HTML и sitemap path; существующий locale helper уже проходил | 5/5: серверная композиция uk/ru, locale paths, две sitemap-проверки          |

Red получен прямым `vitest run` в соответствующей библиотеке после создания минимальных пустых экспортов. Ошибки загрузки модулей или настройки runner не считались Red. Визуальные component-тесты добавлены как регрессия блоков, без отдельного заявления о Red для каждого статического элемента.

Green: `npx nx run site-content-ui:vite:test -- --run`, `site-content-seo:vite:test`, `site-content-feature:vite:test` — exit 0 с переменными среды ниже. После реализации выполнены локальные проверки ответственности слоёв; при финальном проходе упорядочены импорты, удалены лишние generator overrides в `project.json`, тесты используют `Array.from` вместо зависимости от DOM.Iterable.

Стандартный native command runner Nx сначала завершался с exit 1 без вывода Vitest. Прямой Vitest работал; переключение на Node command runner дало успешные Nx-цели. Это ограничение исполнителя, не поведенческий Red. Для Nx-команд использованы:

```sh
NX_NATIVE_COMMAND_RUNNER=false NX_TUI=false NX_DAEMON=false NX_ISOLATE_PLUGINS=false
```

Окончательные прогоны на финальном коде выполнены из корня репозитория:

```sh
npx vitest run --config libs/site/content/ui/vite.config.mts --reporter=json --outputFile=/tmp/kedr-contacts-ui-tests.json
npx vitest run --config libs/site/content/seo/vite.config.mts --reporter=json --outputFile=/tmp/kedr-contacts-seo-tests.json
npx vitest run --config libs/site/content/feature/vite.config.mts --reporter=json --outputFile=/tmp/kedr-contacts-feature-tests.json
```

Все exit 0; JSON-отчёты подтверждают `success: true`, всего **24/24**, без failed tests. Временные JSON-файлы — артефакты текущего исполнителя; устойчивые результаты и тестовые пути зафиксированы здесь и в трассировке.

## TS-004 — Статические проверки

| Команда                                                                                                                          | Результат                                                                  | Проверяемый риск                                                       |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `npx nx run site:typecheck --output-style=static` с Nx env выше                                                                  | Exit 0: `next typegen && tsc --noEmit -p tsconfig.json`                    | Новый `PageProps` и интеграция route/metadata/sitemap                  |
| `node node_modules/typescript/bin/tsc -p libs/site/content/<layer>/tsconfig.spec.json --noEmit`, для ui, seo, feature            | Все exit 0                                                                 | Тесты не входят в app typecheck; типы interaction/server-render тестов |
| `npx eslint 'libs/site/content/**/*.{ts,tsx}' 'apps/site/src/app/[locale]/contacts/page.tsx' apps/site/src/app/sitemap.ts --fix` | Exit 0                                                                     | Импорты и слой новых библиотек; проверки доступности JSX               |
| `npm run architecture:boundaries` с `NX_DAEMON=false NX_ISOLATE_PLUGINS=false`                                                   | Exit 0, 101 проект; повторено после окончательной очистки generator config | Новые Nx-рёбра и теги                                                  |

Финальные документационные проверки: существование локальных ссылок в изменённых Markdown, форматирование новых файлов, сопоставление SC/TS/EN с тестами, отсутствие пустых документов и `git diff --check`. Результат: пройдены.

## Проверка по коду и ограничения

- Темы: существующие семантические tokens, `.dark` для оптовой панели, без новых hex-цветов; global reduced-motion остаётся в силе.
- Адаптивность: одна колонка до `lg`, две после; DOM-порядок не меняется CSS. `min-w-0`, перенос email, flex-wrap номера и копирования, адаптивные кнопки, pin-плашка скрывается на узких экранах.
- Доступность: один H1, H2 блоков, nav/крошки, aria-current, доступное имя copy, live region, декоративные aria-hidden, focus ring. Keyboard/copy подтверждены interaction-тестом; реальный скринридер не запускался.
- Безопасность: нет форм, storage, токенов и логирования пользовательских данных. Внешние вкладки имеют `noopener noreferrer`; JSON-LD проходит через общую безопасную сериализацию. Отказ Clipboard API не вызывает навигацию.
- Производительность: статические серверные блоки, один минимальный client leaf; без изображений, iframe, новых запросов и сторонних скриптов.

Браузер, визуальная матрица устройств, production build, HTTP-smoke, E2E и полные наборы тестов не запускались: отдельного разрешения на них нет. SC-009/SC-010 подтверждены по подключениям и стилям, без заявления об измеренном отображении. Серверный component-render подтверждает разметку функции, а metadata проверены builder-тестами; реальные ответы Next.js, итоговый `<head>` и HTTP-статусы остаются непроверенными. См. [SEO verification](seo-verification.md).
