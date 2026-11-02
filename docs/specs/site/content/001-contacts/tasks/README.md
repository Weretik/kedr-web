# Контакты — задачи

СДД согласована владельцем 2026-11-02; EN-001 и TS-001…TS-004 выполнены. По последующему запросу владельца выполнена TS-005: аудит и локальное разделение clipboard lifecycle. Реальные результаты внедрения — в [отчёте](../verification/implementation.md), рефакторинга — в [аудите](../code-audit/audit.md). Ниже сохранены обязанности и критерии задач; Evidence указывает выполненные проверки.

Порядок: EN-001 → TS-001 и TS-002 → TS-003 → TS-004. В рамках последующей разрешённой реализации исполнитель проходит готовые задачи последовательно, без запроса разрешения на каждую из них. После каждого слоя — локальная проверка структуры и ответственности затронутых файлов.

## EN-001 — Каркас библиотек content

- **Enables:** SC-001…SC-014.
- **Depends on:** согласованная СДД и разрешение перейти к реализации.
- **Paths:** `libs/site/content/{ui,seo,feature}/{project.json,tsconfig.json,tsconfig.lib.json,tsconfig.spec.json,vite.config.mts,eslint.config.cjs,src/index.ts,README.md}`, `tsconfig.base.json`, `package.json` (`test:site`).
- **Test level:** инфраструктурная проверка, без бизнес-Red; до каркаса функции нет.
- **Work:** генератором `@nx/react:library` создать `site-content-ui`, `site-content-seo`, `site-content-feature`; убрать демонстрационные компоненты, deprecated executors и лишние файлы; выставить теги из дизайна, aliases, публичные входы и Vitest/jsdom как у home. Не менять dependency versions и ограничения архитектуры. Проверить отдельную ответственность каждого сгенерированного файла.
- **Evidence:** три библиотеки созданы Nx-генератором; проекты, теги, зависимости и цели `vite:test`, `typecheck`, `lint` подтверждены фактическим `createProjectGraphAsync()` после генерации. Удалены демонстрационные компоненты, лишний Vitest plugin `test`, Babel-конфиги и форматирование общих файлов от генератора. Сохранены три aliases и новые проекты в `test:site`, без изменения пакетов. Команды — [отчёт](../verification/implementation.md).
- **Checkpoint:** существуют три корректных проекта и цели `vite:test`, `typecheck`, `lint`, aliases ведут на index; нет неожиданных изменений зависимостей или чужих файлов.

## TS-001 — Представление контактов и копирование

- **Covers:** SC-001…SC-011 (состав страницы окончательно в TS-003).
- **Depends on:** EN-001.
- **Paths:** `libs/site/content/ui/src/lib/contacts/{contacts-heading,sales-contact,copy-phone-button,written-channels,location-card,wholesale-contact}.tsx`, `libs/site/content/ui/src/lib/i18n/contacts-dictionary.ts`, `libs/site/content/ui/src/lib/contacts/contacts-ui.spec.tsx`, `libs/site/content/ui/src/lib/contacts/copy-phone-button.spec.tsx`, `libs/site/content/ui/src/index.ts`.
- **Test level:** component / interaction.
- **Work:** реализовать блоки по концепту и точным текстам, значения брать из `COMPANY`; дополнить обе локали; проверить реальность ссылок, клавиатуру, сообщения буфера, безопасные внешние переходы, отсутствие формы и выдуманных фактов. Сверить классы 320/768/1440 px, обе темы и reduced motion по коду. Копирование не переносить в shell и не расширять shared UI без необходимости. После блока проверить отдельность визуальных и интерактивных обязанностей.
- **Evidence:** поведенческий Red: семь clipboard-тестов не находили кнопку в пустом компоненте. После реализации прошёл `site-content-ui:vite:test`; окончательный прогон, число тестов и проверка классов тем/адаптивности — [отчёт](../verification/implementation.md). Представление четырёх блоков отдельно покрыто component-регрессией в обеих локалях.
- **Checkpoint:** тесты доказывают поведение действий в двух локалях; темы и breakpoints связаны с существующими токенами; browser/visual не запускались без отдельного разрешения.

## TS-002 — SEO контактов

- **Covers:** SC-012…SC-014.
- **Depends on:** EN-001.
- **Paths:** `libs/site/content/seo/src/lib/{contacts-metadata,contacts-json-ld}.ts`, `libs/site/content/seo/src/lib/contacts-seo.spec.ts`, `libs/site/content/seo/src/index.ts`.
- **Test level:** unit.
- **Work:** определить `CONTACTS_PATH`, metadata через общий builder, данные `ContactPage` и крошек с существующим organization ID. Контактные значения брать из `COMPANY`; не копировать environment-reading и robots-логику в домен. Разделить metadata и JSON-LD по владельцам файлов; проверить публичный API.
- **Evidence:** восемь SEO-тестов дали содержательный Red для пустых metadata/JSON-LD; после реализации `site-content-seo:vite:test` прошёл. Metadata и схемы разделены по файлам; итоговый прогон — [отчёт](../verification/implementation.md). Description подставляет именительный город из `COMPANY` через запятую, без дублирования склонений.
- **Checkpoint:** unit-тесты проходят; схемы соответствуют видимым данным; область ответственности core/domain не нарушена.

## TS-003 — Страница, маршрут, sitemap и интеграционная документация

- **Covers:** SC-001, SC-008…SC-010, SC-012…SC-014.
- **Depends on:** TS-001, TS-002.
- **Paths:** `libs/site/content/feature/src/lib/{contacts-page.tsx,contacts-sitemap.ts,contacts-page.spec.tsx,contacts-sitemap.spec.ts}`, `libs/site/content/feature/src/index.ts`, `apps/site/src/app/[locale]/contacts/page.tsx`, `apps/site/src/app/sitemap.ts`, `docs/features/site/contacts.md`, `docs/features/README.md`, `docs/architecture/site/{structure/modules.md,runtime/application.md,platform/seo-architecture.md}`, `docs/specs/site/migration/README.md` (ссылка на частичное выполнение шага 6).
- **Test level:** server-render component и unit интеграции sitemap.
- **Work:** собрать блоки и JSON-LD; добавить тонкий route; передать контакты в существующую агрегацию sitemap. Проверить порядок DOM, отсутствие второго shell/main, отсутствие зависимости тела страницы от API. Добавить карточку реализованной функции, Mermaid и фактическое дерево; уточнить маршруты, модули и SEO-политику. Не объявлять завершённым весь шаг 6. Проверить структуру после композиции и сравнить с картой файлов.
- **Evidence:** четыре проверки дали Red для отсутствующих H1/контактов в серверной композиции и отсутствующего sitemap path; locale helper уже проходил. После реализации `site-content-feature:vite:test` прошёл; окончательная регрессия — [отчёт](../verification/implementation.md). Импорты и DOM-порядок проверены, карта файлов совпадает с фактической карточкой функции.
- **Checkpoint:** маршрут вызывает feature/SEO, обе страницы включены в sitemap по фактической точке композиции, документация описывает реализованное состояние без изменения Angular.

## TS-004 — Проверка границ и итоговая передача

- **Covers:** SC-001…SC-014 (сводка доказательств TS-001…TS-003; не повторять те же тесты без причины).
- **Depends on:** TS-003.
- **Paths:** все файлы из карты `design/frontend.md`; `docs/specs/site/content/001-contacts/{traceability.md,README.md,tasks/README.md,checklist/delivery-readiness.md,verification/seo-verification.md}`, `docs/specs/README.md`.
- **Test level:** проверка новых границ и route typing; проверка ссылок документации.
- **Work:** сопоставить фактическое дерево с планом, просмотреть diff и зависимости новых проектов; выполнить `npm run architecture:boundaries` для риска новых Nx-границ, `npx nx run site:typecheck` для новой route type и импорта. Не запускать полные tests/lint/build. Проверить изменённые Markdown-ссылки и `git diff --check`; заполнить evidence, трассировку, статусы, остаточные риски. После последней правки кода повторять только проверки, на результат которых она влияет.
- **Evidence:** `site:typecheck` прошёл; после добавления библиотек `architecture:boundaries` прошёл для 101 проекта. Финальные статические проверки, регрессия, ссылки и ограничения — [отчёт](../verification/implementation.md). В изменённой цепочке нет открытых AF; существующие зависимости и публичные входы сохранены.
- **Checkpoint:** узкие проверки пройдены либо есть конкретно описанный блокер; нет открытого AF в цепочке; статусы не подменяют browser/HTTP-проверки, которые не проводились. Финальный проход ответственности завершён.

## TS-005 — Разделение clipboard lifecycle и представления

- **Covers:** SC-004, SC-005, SC-011; сохраняет component-поведение SC-001…SC-008.
- **Depends on:** TS-004; прямой запрос владельца на аудит и рефакторинг 2026-11-02.
- **Paths:** `libs/site/content/ui/src/lib/contacts/copy-phone-button.tsx`, `libs/site/content/ui/src/lib/hooks/use-copy-phone.ts`, `docs/specs/site/content/001-contacts/code-audit/audit.md`, карта файлов СДД и `docs/features/site/contacts.md`.
- **Test level:** существующие component/interaction тесты UI; source typecheck для нового внутреннего импорта.
- **Work:** устранить AF-001: вынести состояние, clipboard, guard и timer effect в приватный `useCopyPhone`; сохранить props, JSX, сообщения, таймер, обработку отказов, public exports и client boundary. После извлечения проверить обязанности и граф. Сценарии/контракт не меняются, отдельная remediation СДД не требуется.
- **Evidence:** выполнено. Свежие 11/11 UI-тестов, UI source typecheck и lint двух изменённых файлов — exit 0; граф 101 проекта и положительные/отрицательные проверки границ прошли. AF-001 verified; точные команды и ограничения — [аудит, фаза 06](../code-audit/audit.md). Чистое структурное изменение: отдельный поведенческий Red не нужен; существующие тесты закрепляют сценарии. Источник исключения — frontend-code-audit, обязательные правила архитектурного исправления.
- **Checkpoint:** hook владеет эффектами и возвращает status/copy; JSX-компонент не содержит browser API и timers; узкий UI-набор проходит, AF-001 получает verified только после свежих проверок.

## Отдельно разрешаемые проверки

Production build и HTTP SEO-smoke, а также browser/visual/E2E проверки не являются автоматическими подзадачами TS-004. Их цель и точная команда/матрица согласуются отдельно по правилам репозитория; отсутствие таких прогонов не выдаётся за ошибку уже выполненной проверки.
