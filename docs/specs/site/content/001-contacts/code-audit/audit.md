# Аудит архитектуры и ответственностей — контакты

- **Дата:** 2026-11-02.
- **Навык:** `web-frontend:frontend-code-audit`, `/workspace/obsidian/plugins/web-frontend/skills/frontend-code-audit/SKILL.md`, применимые фазы 00–06.
- **Область:** маршрут `apps/site/src/app/[locale]/contacts/page.tsx`, интеграция `apps/site/src/app/sitemap.ts`, `libs/site/content/{ui,seo,feature}` и их прямые core/shared зависимости. Другие функции не рефакторятся.
- **Основание:** владелец запросил аудит внедрённого функционала и разделение смешанных ответственностей. Это аудит с локальным исправлением, не audit-only.
- **Состояние:** verified. Одна low-находка AF-001 устранена и подтверждена свежими проверками; открытых/blocked находок в выбранной цепочке нет.

## 00. Источники и инвентаризация

Правила: корневой `AGENTS.md`, `apps/site/AGENTS.md`; `docs/architecture/site/{README.md,structure/modules.md}`; `docs/standards/shared/{delivery-rules.md,testing-rules.md}` (разделы staged structure и verification scope); `docs/standards/site/design-system.md`; текущие requirements/design этой СДД; `eslint.config.cjs`, `tools/architecture/project-boundary-rules.mjs`, `tsconfig.base.json`, Nx project/Vite configs. Для server/client границы прочитано установленное руководство Next.js `01-app/01-getting-started/05-server-and-client-components.md`.

Git status проверен: исходная реализация, концепт и СДД уже присутствуют в рабочем дереве от предыдущих этапов. Они сохраняются; изменения этого аудита ограничены выделением hook, картой файлов и аудит-документацией. Общие конфигурации/пакеты не переписываются.

До рефакторинга: 14 production TS/TSX-файлов в трёх библиотеках, включая index, и 5 тестовых файлов. UI: 8 production-файлов, feature: 3, SEO: 3. Целевая схема остаётся проектной: thin app route → content/feature → content/ui и content/seo → core/shared. Внутренний hook принадлежит UI, не новому shared-проекту.

## 01. Матрица модулей

| Модуль                 | Владелец и теги                                | Фактическая ответственность                                 | Допустимые внутренние зависимости                        |
| ---------------------- | ---------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| `site`                 | `scope:site`, `type:app`                       | Параметры локали, вызов feature/metadata, агрегация sitemap | content feature/SEO, core i18n/SEO; прежний catalog flow |
| `site-content-feature` | `scope:site`, `domain:content`, `type:feature` | Композиция и locale-free sitemap запись                     | content ui/SEO, core SEO; core config/i18n в тестах      |
| `site-content-ui`      | `scope:site`, `domain:content`, `type:ui`      | Представление, словарь и минимальный clipboard client leaf  | core config/i18n, shared UI                              |
| `site-content-seo`     | `scope:site`, `domain:content`, `type:util`    | Metadata и структурированные данные                         | core config/i18n/SEO                                     |

Aliases ведут на `src/index.ts`; межбиблиотечных deep-import нет. Состав `core` не зависит от `content`; feature-to-feature импорты не добавлены. Отсутствие model/data-access оправдано: нет новой сущности, DTO, API или серверного запроса. Не создаётся пустой слой ради структуры.

## 02. Данные, состояние и платформенные эффекты

- Публичные факты: `COMPANY` → компоненты и metadata. Локаль — тип и paths из core/i18n; тексты — словарь UI.
- Тело страницы и metadata серверные. Нет fetch/Axios, RTK Query, серверного кэша, cookie/session либо DTO в UI. Загрузка каталога в родительской оболочке остаётся существующей интеграцией.
- Только копирование требует браузерного API. Его локальные idle/pending/success/error, single-flight guard и таймер относятся к одному платформенному жизненному циклу. Сейчас этот цикл находится внутри JSX-компонента — AF-001.
- Ссылки tel/mailto/Viber/Telegram/Maps остаются обычными ссылками; ни фоновой отправки, ни storage/логирования нет.

## 03–04. Разделение и публичная структура

| Область                                                                                   | Решение                        | Обоснование и целевой владелец                                                                                                                                               |
| ----------------------------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/src/lib/contacts/copy-phone-button.tsx`, исходно 75 строк                             | **split**                      | Browser/state/timer → `ui/src/lib/hooks/use-copy-phone.ts`; кнопка, иконка, локализованный live region остаются в компоненте. Основание — разные обязанности, не число строк |
| `feature/src/lib/contacts-page.tsx`, 29 строк                                             | **keep**                       | Только композиция четырёх блоков и JSON-LD; нет запросов или интерактивного состояния                                                                                        |
| `contacts-heading.tsx`, `sales-contact.tsx`, `location-card.tsx`, `wholesale-contact.tsx` | **keep**                       | Каждый отвечает за один смысловой блок; независимых форм/диалогов/запросов внутри нет                                                                                        |
| `written-channels.tsx`, 49 строк                                                          | **keep**                       | Единый статический блок способов написать: два мессенджера и почта; нет отдельных жизненных циклов. Дополнительная нарезка не упрощает координацию                           |
| `i18n/contacts-dictionary.ts`, 83 строки                                                  | **keep**                       | Один типизированный словарь двух языков, без эффектов и другой логики                                                                                                        |
| `seo/src/lib/contacts-{metadata,json-ld}.ts`                                              | **keep**                       | Уже разделены metadata и схема; константа одного адреса не требует отдельной model-библиотеки. Проверено владение и импорты, не выполнялся отдельный SEO-аудит               |
| `ui/src/lib/contacts/`                                                                    | **keep**, извлечь hook по роли | Шесть компонентов одной контактной функции и два colocated теста; не общий catch-all каталог. Новый lifecycle-файл группируется в `ui/src/lib/hooks/`                        |
| Public index                                                                              | **keep**                       | Существующие feature/UI/SEO API сохраняются. Hook и copy control не экспортируются в общий UI index                                                                          |

В проекте нет числового порога размера компонента; искусственное дробление по строкам не применяется. Next `Link` в статических крошках разрешён архитектурой публичного Site; правило router-free Admin сюда не переносится.

## Находки

### AF-001 — Смешаны lifecycle копирования и отображение

- **Severity:** low, сопровождаемость; ошибки пользовательского поведения не обнаружено.
- **Исходное свидетельство:** `libs/site/content/ui/src/lib/contacts/copy-phone-button.tsx:21–42` — состояние, ref guard, timer effect, `navigator.clipboard`; строки 44–74 — JSX и сообщения. Это номера исходного файла до извлечения.
- **Источник правила:** `docs/standards/shared/delivery-rules.md`, Staged structure check / Definition of done: независимые state/effects и представление должны иметь определённых владельцев. Навык audit, фаза 03: отделять координацию от отображения и объяснять split/keep.
- **Влияние:** изменение browser lifecycle требует правки JSX-файла; граница обязанностей не выражена отдельным контрактом.
- **Owner:** разработчик контактов.
- **Target:** `ui/src/lib/hooks/use-copy-phone.ts` владеет `status` и `copy`; `CopyPhoneButton` только вызывает hook и отображает состояние.
- **Задача:** TS-005 текущей СДД; зависит от выполненной TS-004.
- **Status:** verified (TS-005).
- **Verification:** неизменённые clipboard/component тесты `site-content-ui`, source typecheck UI, проверка новых импортов и повторный локальный просмотр границ.

Системных нарушений между функциями не подтверждено; отдельная remediation СДД не нужна. Других обязательных split-находок в выбранном функционале нет.

## 05. Защита от регрессий

Проверены реальные Vitest/jsdom конфигурации и пять тестовых файлов. Для TS-005 достаточно UI-набора: 7 interaction-кейсов копирования (keyboard, single-flight, таймер, отсутствующий/отклонённый clipboard, retry) и 4 component-кейса uk/ru блоков. Внешние контракты/разметка не меняются; новый искусственный Red или тест, дублирующий перенос функций, не нужен по правилам архитектурного рефакторинга навыка.

SEO/feature тесты и команды изучены; их предыдущее выполнение 8/8 и 5/5 — в [отчёте внедрения](../verification/implementation.md). Это историческое evidence, не новый прогон аудита. Typecheck UI проверяет новый путь hook; тестовые файлы не меняются. Цели и граф подтвердятся фактическими Nx metadata после правки.

## 06. Итоговая проверка

TS-005 выполнена: `ui/src/lib/hooks/use-copy-phone.ts:6` владеет clipboard/state/guard/timer, `ui/src/lib/contacts/copy-phone-button.tsx:22` получает только status/copy и оставляет у себя отображение. Компонент уменьшился с 75 до 55 строк; hook — 31 строка. Причина разделения — lifecycle и представление, числовой порог не использовался. После правки в библиотеках 15 production TS/TSX-файлов (UI: 9, SEO: 3, feature: 3), те же 5 тестовых файлов; props, UI index, семантика DOM и публичные aliases сохранены.

### Свежие результаты

Для Nx использован префикс `NX_NATIVE_COMMAND_RUNNER=false NX_TUI=false NX_DAEMON=false NX_ISOLATE_PLUGINS=false` из проверенной конфигурации исполнителя:

| Проверка                                    | Команда / метод                                                                                                                                                    | Результат                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| UI-регрессия                                | `npx nx run site-content-ui:vite:test --output-style=static --skip-nx-cache -- --run --reporter=json --outputFile=/tmp/kedr-contacts-audit-ui-tests.json`          | Exit 0; JSON: success=true, 11/11, failed=0                      |
| Типы нового hook и UI                       | `npx nx run site-content-ui:typecheck --output-style=static`                                                                                                       | Exit 0; `tsc -p tsconfig.lib.json --noEmit`                      |
| Новые/изменённые импорты и JSX              | `npx eslint libs/site/content/ui/src/lib/hooks/use-copy-phone.ts libs/site/content/ui/src/lib/contacts/copy-phone-button.tsx` с отключённой изоляцией/daemon Nx    | Exit 0                                                           |
| Граф и политика границ                      | `createProjectGraphAsync()` + текущие `requiredTagErrors`/`validateProjectBoundary` на всех static рёбрах                                                          | Exit 0, 101 проект; новые project-level зависимости не появились |
| Положительное/отрицательное evidence границ | Фактические теги из графа: content-feature → content-ui разрешён; core-seo → content-ui, content-ui → content-feature, content-feature → catalog-feature запрещены | Все четыре проверки соответствуют текущей политике               |

Повторный поиск подтверждает: `navigator.clipboard`, timer, `useEffect`, `useRef`, `useState` принадлежат hook; визуальный компонент их не содержит. Hook не экспортируется через общий UI index. Документация/фактическое дерево и трассировка TS-005 обновлены, локальные ссылки и diff проверены.

Сценарии и внешний контракт не менялись, поэтому искусственный Red не создавался. Новые тесты, повторяющие механический перенос кода, не добавлены. Неповторённые 13 SEO/feature тестов относятся к неизменённому коду; прежние 24/24 не выдаются за свежий прогон аудита.

Browser/visual, build, HTTP, E2E и полные тесты не входят в этот архитектурный аудит; отображение и реальные HTTP-статусы по ним не утверждаются.
