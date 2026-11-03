# 001 — Реквізити / Реквизиты

- **Клиент:** Kedr, публичный Next.js сайт `apps/site` в `E:\RiderProjects\kedr-web`.
- **Домен / вариант:** `content` / `nextjs`.
- **Статус:** реализовано локально 2026-11-03; TS-001…TS-008 выполнены, EN-001 verified; публикация юридических ссылок и полная приёмка ограничены EN-002.
- **Владелец продуктовых решений:** владелец Kedr.
- **Основание:** пользователь принял концепт и SDD, разрешил реализацию мультиагентами, затем отдельно подтвердил все значения и подписи реквизитов.
- **Правила:** [delivery](../../../../standards/shared/delivery-rules.md), [testing](../../../../standards/shared/testing-rules.md), [site design](../../../../standards/site/design-system.md).

Страница `/uk/requisites` или `/ru/requisites` показывает подтверждённые сведения об администрации ClassKedr, копирует IBAN либо полный набор и предлагает связаться с менеджером для согласования оплаты конкретного заказа. Реализованы две панели, пояснение об оплате, юридические ссылки, контактный блок и интеграция в существующий shell.

## Навигация

- [Объём и результат](requirements/overview.md), [правила и сценарии](requirements/behavior.md).
- [Принятый визуальный контракт](design/visual.md), [неизменённый PNG-концепт](design/requisites-concept.png).
- [Frontend: baseline и карта](design/frontend.md), [Next.js](design/nextjs.md), [SEO](design/seo.md).
- [Модель данных](data-model.md), [подтверждение владельцем](design/data-confirmation.md).
- [Задачи](tasks/README.md), [трассировка](traceability.md), [архитектурный аудит](code-audit/audit.md).
- [Готовность SDD](checklist/spec-readiness.md), [Next.js](checklist/nextjs-readiness.md), [SEO](checklist/seo-readiness.md), [поставка](checklist/delivery-readiness.md).
- [Результаты и пределы проверок](verification/seo-verification.md).
- [Карточка фактической функции](../../../../features/site/requisites.md).

## Реализовано

- Сохранены прежние адреса `/{locale}/requisites`; новых redirects или shell API нет. Footer уже содержит нужную ссылку.
- Подтверждённые факты находятся в `COMPANY_REQUISITES`; телефон берётся из `COMPANY`. Словарь содержит только UK/RU подписи; официальное имя одинаково в обеих локалях.
- Весь основной контент и BreadcrumbList — server rendering. Только два экземпляра clipboard leaf гидратируются.
- Отдельные IBAN/full-payload действия имеют pending guard, success, rejection/unavailable, selectable fallback и retry.
- Metadata, canonical, языковые альтернативы и sitemap используют существующие core builders и indexing gate.
- Новые API, проекты Nx, aliases, dependencies, глобальный CSS и data-access не вводились.

## Проверки и открытая граница

Model 5/5, UI 18/18, SEO 9/9, server feature 5/5, sitemap 6/6 — **43 tests** в узких targets. Зафиксированы behavioral Red и Green. Scoped lint прошёл; `site:typecheck` завершился с exit 0, используя Nx cache (1/1 hit). Проверены public imports, ответственность файлов и theme/locale/breakpoint wiring по исходникам; независимый source review не выявил существенных дефектов.

[EN-001](tasks/enablers/EN-001-confirm-requisites.md) закрыт явным ответом пользователя 2026-11-03. Подтверждены подпись «Код» и отображаемое название «ПриватБанк»; полная юридическая форма банка не выводится.

[EN-002](tasks/enablers/EN-002-legal-destinations.md) остаётся внешним publication gate. Во время работы появился route public-offer в параллельном объёме; privacy-policy в проверенных destinations ещё отсутствует. Component href assertions не подтверждают реальную доступность материалов. SC-012 остаётся blocked до evidence владельца релиза; это не мешает завершению локального TS-007.

Build, HTTP/head, schema validators, browser/visual/manual/E2E и публикация не выполнялись. Полная геометрия работающего интерфейса не заявляется проверенной. Коммиты, branch, push и PR не создавались.

## История

- 2026-11-03 — создан и принят концепт; подготовлена SDD.
- 2026-11-03 — пользователь разрешил реализацию; выполнены model, clipboard/UI и SEO пакеты.
- 2026-11-03 — пользователь подтвердил реквизиты; выполнены source/route integration и sitemap, синхронизирована фактическая документация. EN-002 остаётся открытым перед публикацией.

- 2026-11-03 — по отдельному запросу выполнен scoped architecture audit; AF-001 low verified. Support разделён на legal/contact leaf; 23 fresh regression tests и source/test type checks прошли. Publication gate EN-002 сохраняется.
