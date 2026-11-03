# TS-003 — Контактный интерфейс

- **Status:** completed 2026-11-03 (focused automated/source scope).
- **Covers:** SC-001, SC-002, SC-005, SC-006, SC-007, SC-008, SC-009, SC-010.
- **Depends on:** TS-001, TS-002.
- **Paths:** `libs/site/content/ui/src/lib/contacts/contacts-content.tsx`, `contacts-channels.tsx`, `contacts-location.tsx`, `contacts-wholesale.tsx`, `contacts-content.spec.tsx` в том же каталоге; `libs/site/content/ui/src/index.ts`.
- **Test level:** component для видимых данных/actions/семантики; source review для theme/responsive wiring.
- **Architecture baseline:** content/ui → content/model, core/i18n, shared/ui; [утверждённый дизайн](../design/visual.md). Данные приходит через ContactsDetails props от feature.

## Work

- [x] Собрать крошки/H1/intro/якоря и все четыре смысловых блока в утверждённом порядке.
- [x] Вставить clipboard leaf, сохранив номер и главный CTA самостоятельными tel-ссылками.
- [x] Использовать переданные факты для Telegram/Viber/email/map, реальный city и approved copy о визите. Не добавлять форму, карту-embed или новый wholesale-route.
- [x] Полезные ссылки формировать через localizedPath для delivery-and-payment и returns-exchanges.
- [x] Поддержать обе темы и адаптивность по visual design, wrap email/номера, focus, 44px touch targets и scroll offsets.
- [x] Экспортировать ContactsContent через public index; внутренние секции и leaf не раскрывать как общий public API без потребителя.
- [x] Покрыть компонентными тестами разные назначения ссылок, порядок/якоря, UK/RU и accessible names. Не дублировать clipboard-ветви из TS-002.
- [x] Проверить целостность ролей новых UI-файлов и сохранить existing delivery/returns exports. Header/footer/второй main не добавлять.

## Evidence

Точная Red-команда из корня репозитория: `node node_modules/nx/dist/bin/nx.js run site-content-ui:vite:test --output-style=static -- --run src/lib/contacts/contacts-content.spec.tsx`.

Red: H1-only компилируемая основа дала 11 ожидаемых failures из-за отсутствующих секций, anchors и contact/help links. Green + regression: `site-content-ui:vite:test -- --run` — exit 0, 4 файла / 35 tests, включая 11 contacts-content и существующие delivery/returns.

Refactor: композиция, каналы, местоположение, B2B и client clipboard разделены по согласованной карте; внутренние секции не раскрыты через public UI index. Проверены по исходнику текущие tokens, обе темы, lg reflow, email anywhere, phone wrap, 44px actions, focus, scroll offsets и отсутствие второго main. Независимое source review не выявило материальных findings. Browser/visual не запускались; это source evidence, не измерение геометрии.

## Checkpoint

UI воспроизводит принятую структуру и все контактные назначения в двух локалях; нет отдельной оболочки, дублирования фактов и новых системных зависимостей.

## Последующий архитектурный аудит

По отдельному поручению выделены contacts-header.tsx, contacts-help.tsx, contacts-sales.tsx и contacts-messengers.tsx; родители только composition/grid, public props/порядок DOM сохранены. AF-004: отсутствующий text-card-foreground заменён существующим text-foreground. Final UI 36/36, scoped lint и source/test types passed. [Отчёт](../code-audit/audit.md).
