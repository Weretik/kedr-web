# TS-002 — Копирование номера

- **Status:** completed 2026-11-03 (focused automated/source scope).
- **Covers:** SC-003, SC-004, SC-010.
- **Depends on:** TS-001.
- **Paths:** `libs/site/content/ui/src/lib/contacts/contacts-copy-phone-button.tsx`, `libs/site/content/ui/src/lib/contacts/contacts-copy-phone-button.spec.tsx`.
- **Test level:** component с контролируемой границей Clipboard API.
- **Architecture baseline:** только локальный client leaf в content/ui; ui → core/shell запрещён, внутренний shell CopyPhoneButton не переиспользуется.

## Work

- [x] Отдельная copy-иконка с локализованным accessible name, props e164/labels и состояниями idle/pending/success/error.
- [x] Запрашивать clipboard только по click/keyboard activation; блокировать параллельное повторное копирование, затем разрешать повтор.
- [x] Показывать и объявлять success/error рядом с контролом, без перекрытия номера/CTA. При unavailable/rejection оставить выделяемый номер для ручного копирования.
- [x] Не изменять window.location, не вызывать tel и не считать отсутствие Clipboard API ошибкой всей страницы.
- [x] Проверить success, отсутствие API, rejected promise, повтор и доступное сообщение. Не обращаться к буферу ОС.
- [x] Проверить целостность leaf и теста; состояние не выносить в общий store и не менять shell-контрол.

## Evidence

Точная Red-команда из корня репозитория: `node node_modules/nx/dist/bin/nx.js run site-content-ui:vite:test -- --run src/lib/contacts/contacts-copy-phone-button.spec.tsx`.

Red: компилируемая clipboard-основа дала 4 ожидаемых assertion failures — writeText не вызывался, success/fallback не появлялись; harness/import ошибок не было. Green + узкая regression после финального разделения/форматирования: `site-content-ui:vite:test -- --run` — exit 0, 35/35 tests (clipboard 8, content 11, existing returns 8, delivery 8), uncached.

contacts-copy-phone-button.spec.tsx проверяет UK/RU success/unavailable, rejected promise и retry, pending mutex и keyboard Enter. Навигация остаётся прежней при отказе, API ОС замокан. Refactor/structure: один client leaf, useRef mutex и локальные state/status, без window.location/store/shell dependency. Точные команды — в verification/seo-verification.md.

## Checkpoint

Копирование даёт локальную обратную связь в обеих локалях; отказ и отсутствие API не инициируют навигацию. Leaf остаётся единственной новой клиентской границей страницы.

## Последующий архитектурный аудит

AF-001: прежнее сравнение location.href заменено test-only navigation guard. Контрольная мутация tel в error branch дала 4 expected failures; leaf восстановлен exact SHA. Финальные clipboard9 / общие UI 36 tests прошли; UI spec tsc и scoped lint exit 0. [Отчёт](../code-audit/audit.md).
