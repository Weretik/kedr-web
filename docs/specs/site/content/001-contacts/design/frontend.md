# Frontend: baseline и реализация

Источники: [модули и границы](../../../../../architecture/site/structure/modules.md), [дизайн-система](../../../../../standards/site/design-system.md), [delivery rules](../../../../../standards/shared/delivery-rules.md), [testing rules](../../../../../standards/shared/testing-rules.md). Визуальная спецификация — [visual.md](visual.md), серверная граница — [nextjs.md](nextjs.md).

## Проверенный baseline на 2026-11-03

| Область                 | Фактический источник                                                                                                                        | Решение для контактов                                                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content-проекты         | `libs/site/content/{model,ui,seo,feature}/project.json`, `tsconfig.base.json`                                                               | Уже существуют aliases `@site/content/model`, `/ui`, `/seo`, `/feature`. Новых проектов, зависимостей и aliases нет.                                                                                          |
| Nx tags                 | Те же project.json                                                                                                                          | `scope:site`, `domain:content`; типы `model`, `ui`, `util` (SEO), `feature`. Сохраняются.                                                                                                                     |
| Разрешённые зависимости | `eslint.config.cjs`, `tools/architecture/project-boundary-rules.mjs`                                                                        | app → content/feature, content/seo; feature → content/model, ui, seo и core; ui → model, core config/i18n, shared/ui; seo → core seo/config/i18n. Только public index.                                        |
| Каркас и main           | `libs/site/core/shell/src/lib/site-shell.tsx`, `apps/site/src/app/[locale]/layout.tsx`                                                      | Сохраняются header/footer, единственный `main#content`, тема, язык, skip-link, Organization. Страница добавляет только содержимое.                                                                            |
| Компания                | `libs/site/core/config/src/lib/company.ts`                                                                                                  | Только `COMPANY`; feature выбирает город по locale и передаёт публичные факты в UI.                                                                                                                           |
| Ближайшая страница      | `libs/site/content/feature/src/lib/returns-page.tsx`, route `(content)/returns-exchanges/page.tsx`                                          | Feature собирает server UI со словарём из model. Delivery с собственным словарём в UI не переносится и не реорганизуется.                                                                                     |
| Metadata / sitemap      | `libs/site/content/seo/src/lib/returns-metadata.ts`, `libs/site/content/feature/src/lib/content-sitemap.ts`, `apps/site/src/app/sitemap.ts` | Добавить contacts builders/descriptor; app sitemap уже распространяет descriptors и остаётся прежним.                                                                                                         |
| Clipboard               | `libs/site/core/shell/src/lib/controls/copy-phone-button.tsx`, public shell index                                                           | Внутренний контрол не экспортируется, объединяет номер и copy, при ошибке запускает tel. Его reuse не соответствует принятому UX и требует запрещённой зависимости ui → shell. Новый узкий leaf в content/ui. |
| Тесты                   | content `vite.config.mts`, `project.json`, `nx.json`; существующие content specs                                                            | Vitest/RTL/jsdom и inferred `vite:test` доступны. `site:typecheck` существует. Новый harness не нужен.                                                                                                        |
| Next.js                 | `node_modules/next/package.json`: 16.4.3; установленная документация layouts/pages и metadata                                               | Async params, thin route, Server Components. Новые API фреймворка не вводятся.                                                                                                                                |

Это локальный baseline зависимостей, не полный аудит репозитория. Подтверждённых архитектурных нарушений в цепочке задачи нет; `AF-*`/`EN-*` не создаются искусственно. Существующие content-проекты сейчас входят в незакоммиченные изменения: при реализации дополнять их, сохраняя delivery/returns и чужие правки.

## Владельцы и данные

`content/model` хранит `ContactsDictionary`, `ContactsDetails` и `getContactsDictionary(locale)`; без JSX, browser state или копий контактов. `ContactsDetails` — небольшой тип передаваемых публичных строк: phone.display/e164, email, локализованный city, telegram/viber/map. Это presentation contract, не API DTO.

`ContactsPage` получает Locale, читает словарь и `COMPANY`, собирает `ContactsDetails`, передаёт их в `ContactsContent` и выводит BreadcrumbList через существующий `JsonLd`. Feature не выполняет HTTP-запросы. SEO-тексты остаются в content/seo: тип `util` не начинает импортировать content/model.

`ContactsContent` и его смысловые блоки остаются server-compatible presentational UI. Единственный новый клиентский leaf — `ContactsCopyPhoneButton`; он получает только e164 и локализованные labels, а не весь словарь или компанию. Его состояние локально: idle → pending → success/error; сообщения расположены рядом с copy. No Redux, query cache, localStorage или общая форма для этого действия не нужны.

## Планируемая карта файлов

Все пути относительны к `E:\RiderProjects\kedr-web`. Таблица сохраняет принятый план; реализация 2026-11-03 совпала с этой картой. Фактические пути и покрытие находятся в [карточке функции](../../../../../features/site/contacts.md) и [verification](../verification/seo-verification.md).

| Путь                                                                        | Статус                                     | Одна ответственность                                           | Задача         |
| --------------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------- | -------------- |
| `libs/site/content/model/src/lib/contacts-types.ts`                         | planned                                    | Контракт словаря и публичных presentation props                | TS-001         |
| `libs/site/content/model/src/lib/contacts-dictionary.ts`                    | planned                                    | Полный UK/RU copy и getter                                     | TS-001         |
| `libs/site/content/model/src/index.ts`                                      | existing, append                           | Публичные экспорты contacts types/getter; returns сохранить    | TS-001         |
| `libs/site/content/ui/src/lib/contacts/contacts-copy-phone-button.tsx`      | planned                                    | Clipboard leaf, локальная обратная связь                       | TS-002         |
| `libs/site/content/ui/src/lib/contacts/contacts-copy-phone-button.spec.tsx` | planned                                    | Success, rejection, отсутствие clipboard и скрытой навигации   | TS-002         |
| `libs/site/content/ui/src/lib/contacts/contacts-content.tsx`                | planned                                    | Только композиция контактных блоков                            | TS-003         |
| `libs/site/content/ui/src/lib/contacts/contacts-channels.tsx`               | planned                                    | Контактная section, anchor и grid                              | TS-003         |
| `libs/site/content/ui/src/lib/contacts/contacts-header.tsx`                 | existing, audit extraction                 | Крошки, H1/intro и section anchors                             | TS-003, TS-007 |
| `libs/site/content/ui/src/lib/contacts/contacts-help.tsx`                   | existing, audit extraction                 | Подготовка к обращению и localized help links                  | TS-003, TS-007 |
| `libs/site/content/ui/src/lib/contacts/contacts-sales.tsx`                  | existing, audit extraction                 | Телефонная панель и включение clipboard leaf                   | TS-003, TS-007 |
| `libs/site/content/ui/src/lib/contacts/contacts-messengers.tsx`             | existing, audit extraction                 | Telegram/Viber/email presentation                              | TS-003, TS-007 |
| `libs/site/content/ui/src/lib/contacts/contacts-location.tsx`               | planned                                    | Город, карта и согласование визита                             | TS-003         |
| `libs/site/content/ui/src/lib/contacts/contacts-wholesale.tsx`              | planned                                    | Контактный B2B-блок                                            | TS-003         |
| `libs/site/content/ui/src/lib/contacts/contacts-content.spec.tsx`           | planned                                    | Контактные назначения, copy labels, обе локали и семантика     | TS-003         |
| `libs/site/content/ui/src/index.ts`                                         | existing, append                           | Экспорт только ContactsContent; внутренние блоки не раскрывать | TS-003         |
| `libs/site/content/seo/src/lib/contacts-metadata.ts`                        | planned                                    | buildContactsMetadata через core builder                       | TS-004         |
| `libs/site/content/seo/src/lib/contacts-metadata.spec.ts`                   | planned                                    | Metadata и indexing policy в двух локалях                      | TS-004         |
| `libs/site/content/seo/src/lib/contacts-json-ld.ts`                         | planned                                    | buildContactsBreadcrumbJsonLd                                  | TS-004         |
| `libs/site/content/seo/src/lib/contacts-json-ld.spec.ts`                    | planned                                    | Два breadcrumb item, язык и абсолютные URL                     | TS-004         |
| `libs/site/content/seo/src/index.ts`                                        | existing, append                           | Публичные metadata и JSON-LD builders                          | TS-004         |
| `libs/site/content/feature/src/lib/contacts-page.tsx`                       | planned                                    | Серверная композиция данных, UI и JSON-LD                      | TS-005         |
| `libs/site/content/feature/src/lib/contacts-page.spec.tsx`                  | planned                                    | Серверный HTML, обе локали, integration источников             | TS-005         |
| `libs/site/content/feature/src/index.ts`                                    | existing, append                           | Экспорт ContactsPage                                           | TS-005         |
| `libs/site/content/feature/src/lib/content-sitemap.ts`                      | existing, append                           | Единственный descriptor `/contacts`                            | TS-005         |
| `libs/site/content/feature/src/lib/content-sitemap.spec.ts`                 | existing, extend                           | Добавление обоих URL с сохранением остальных content URLs      | TS-005         |
| `apps/site/src/app/[locale]/(content)/contacts/page.tsx`                    | planned                                    | Async locale params, guard, вызов feature/metadata             | TS-005         |
| `docs/features/site/contacts.md`                                            | planned at delivery                        | Краткая карточка фактической реализации                        | TS-006         |
| `docs/features/README.md`                                                   | existing, append at delivery               | Строка уже реализованных контактов                             | TS-006         |
| `docs/architecture/site/structure/modules.md`                               | existing, narrow update at delivery        | Фактический маршрут и роль content                             | TS-006         |
| `docs/architecture/site/platform/seo-architecture.md`                       | existing, decision now / facts at delivery | URL-политика и schema scope контактов                          | TS-004, TS-006 |
| `docs/specs/README.md`, текущий SDD                                         | existing/new docs                          | Статус спецификации и реализационные evidence                  | TS-006         |

Не требуются изменения `package.json`, lockfile, `tsconfig.base.json`, global.css, COMPANY, shell, robots или app sitemap. Если при реализации обнаружится конкретная новая зависимость, сначала актуализировать карту и её причину; не редактировать эти файлы по шаблону.

## Сохранить или разделить существующие роли

Публичные index-файлы дополняются без реорганизации. `content-sitemap.ts` остаётся маленьким списком дескрипторов. `site-shell.tsx`, locale layout, copy-control шапки, delivery и returns остаются у текущих владельцев. Их переписывание не нужно для контактов. В новом UI выделяются смысловые блоки и browser leaf; одноразовые мелкие подписи не получают отдельных папок.

## Верификация реализации по риску

- UI/component: фактические href, видимые copy, keyboard semantics; clipboard success/rejection/unavailable с контролируемым browser API. Не обращаться к реальным мессенджерам или буферу ОС.
- SEO/unit: обе локали, self canonical, reciprocals/x-default, OG, production/preview gate, JSON-LD URL/порядок.
- Feature/component + focused integration: render-to-static-markup контактов и JSON-LD, отсутствие второго main, использование COMPANY, уникальные entries sitemap, сохранность delivery/returns.
- Темы/адаптивность: сопоставить классы и токены с [visual.md](visual.md); source review не заявлять как пиксельную или браузерную проверку.
- Новые импорты проходят локальный разбор границ. Общий `architecture:boundaries` нужен только если фактически меняется boundary/config или остаётся непокрытый риск зависимости. Typecheck `site` нужен для нового route/Next-интеграции; lint добавлять по конкретному непроверенному риску, не запускать все targets автоматически.

Точные команды и checkpoints — в [задачах](../tasks/README.md). Для этой документационной поставки runtime-тесты не требуются. При реализации писать минимальные поведенческие проверки и фиксировать Red → Green → Refactor → Regression по правилам проекта.

## Уточнение по результатам отдельного аудита

[Аудит 00–06](../code-audit/audit.md) выявил и закрыл AF-001…AF-006. Для content/seo защищён узкий allowlist project edges на core config/i18n/seo; source imports не менялись. Content/model возвращён к inferred lint inputs, которые учитывают eslint.config.cjs и dependencies. Отдельные source/test typechecks подтверждены; readonly tuple в sitemap test передаётся копией.

UI header/help/sales/messengers выделены как самостоятельные внутренние роли по текущему поручению пользователя. Прежняя композиция была разрешена SDD; refinement не меняет дизайн или продуктовые сценарии. ContactsContent и ContactsChannels теперь только компонуют блоки. Clipboard state/UI сохранён единым leaf, а navigation fixture существует только в тесте. Все межпроектные/public API границы сохранены, дополнительный global CSS не нужен.
