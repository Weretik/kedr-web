# 001 — Политика конфиденциальности

- **Тип приложения:** Next.js public site.
- **Приложение:** Kedr, apps/site; домен content.
- **Статус:** реализовано локально и проверено 2026-11-03.
- **Scope authorization:** пользователь принял дизайн, поручил СДД, затем реализацию всей СДД; мультиагентная работа разрешена исходным запросом.
- **Проверки:** 39 focused tests passed; direct next typegen и tsc — exit 0; локальная проверка ролей/границ выполнена.
- **Блокеры в реализованном объёме:** нет.
- **Пределы:** HTTP/browser/manual visual/E2E/production build и deployment не выполнялись.

Страницы /uk/privacy-policy и /ru/privacy-policy реализуют принятую композицию: краткое резюме, адаптивное оглавление, восемь разделов полной политики и контактный блок. Используется существующий SiteShell. Новых API, page client state, tracking или юридических условий не добавлено.

## Документы

- [Границы и результат](requirements/overview.md).
- [Правила и сценарии](requirements/behavior.md).
- [Архитектура и planned map](design/frontend.md).
- [Визуальный контракт](design/visual.md), [принятый PNG](design/privacy-concept.png), [approval/provenance](design/privacy-concept.png.json).
- [Источник текста и разрешённые преобразования](design/content-source.md).
- [Next.js](design/nextjs.md), [SEO](design/seo.md), [модель представления](data-model.md).
- [Задачи и зависимости](tasks/README.md), [traceability](traceability.md).
- [Spec readiness](checklist/spec-readiness.md), [Next.js readiness](checklist/nextjs-readiness.md), [SEO readiness](checklist/seo-readiness.md).
- [Delivery readiness](checklist/delivery-readiness.md).
- [Результаты проверок](verification/seo-verification.md), [локальная проверка интеграции и ответственности](verification/local-review.md).
- [Фактическая feature card](../../../../features/site/privacy-policy.md).

- [Архитектурный аудит и исправления AF-001/AF-002](code-audit/audit.md) — обе находки verified.

## Состояние и решения

EN-001 и TS-001…TS-005 завершены. Модель и SEO выполнены независимыми пакетами, UI и интеграция — координатором. Shared exports, sitemap и документация обновлялись одним владельцем. Существующие незакоммиченные изменения сохранены; commit/push не выполнялись.

Текст перенесён из Storefront целиком: 8 заголовков, 15 абзацев и 11 пунктов списков на локаль. Применены только разрешённые доменная/контактные подстановки и UK исправление §4.1. Существующий переход к публичной оферте сохранён. Растровый макет не входит в runtime assets.

2026-11-03 — концепт принят, СДД подготовлена и выполнена; результат проверен на автоматическом/source уровне. Браузерная приёмка не заявлена.
