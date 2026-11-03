# 001 — Статті: список, пошук і читання

- **Клієнт:** публічний Next.js сайт `apps/site`, репозиторій `E:\RiderProjects\kedr-web`.
- **Домен / варіант:** content / nextjs.
- **Статус:** реалізовано та перевірено аудитом функції 00–06; AF-001/AF-002 verified. Runtime/build/browser не запускалися.
- **Дата:** 2026-11-03.
- **Підстава:** затверджений у чаті концепт v2; остання поправка — прибрати видимий напис «Пошук у статтях», залишивши доступну назву.
- **Уточнення власника:** тимчасово перенести шість існуючих статей; детальні сторінки включити в поточну реалізацію.
- **Спосіб виконання:** мультиагентами, без commit/push/PR; сторонні зміни зберегти.

Відвідувач знаходить статтю пошуком по всьому набору, обирає 10/20/50 матеріалів на сторінці, переходить між сторінками та читає повний матеріал на новому сайті. Реальні дані — шість існуючих UK/RU статей; демонстраційні 26 записів із концепту існують тільки в тестах.

## Навігація

- [Межі](requirements/overview.md), [правила та сценарії](requirements/behavior.md).
- [Frontend і карта файлів](design/frontend.md), [Next.js](design/nextjs.md), [SEO](design/seo.md), [затверджений дизайн](design/visual.md).
- [Модель даних](data-model.md), [задачі](tasks/README.md), [трасування](traceability.md).
- [Готовність SDD](checklist/spec-readiness.md), [поставка](checklist/delivery-readiness.md).
- [Перевірки](verification/results.md).

## Рішення

Початкове рішення міграції про БД/адмінку зберігається як наступний етап. Виняток для цього frontend-етапу прямо погоджений користувачем: окремий server-only локальний source, без імпорту Angular-бібліотек і вигаданого API. Детальні сторінки мають стабільні спільні для локалей слаги, старі ID — 301. Невирішених продуктових питань поточного обсягу немає.

Джерела правил: [AGENTS](../../../../../AGENTS.md), [site AGENTS](../../../../../apps/site/AGENTS.md), [delivery](../../../../standards/shared/delivery-rules.md), [дизайн-система](../../../../standards/site/design-system.md), [міграція](../../migration/README.md).

## Реалізований стан

EN-001 та TS-001…TS-006 виконані; 86 passing tests у зачеплених перевірках, site source types і п’ять spec typechecks пройдені. [Поточна картка функції](../../../../features/site/articles.md) і [докази](verification/results.md). Сторонні файли wholesale concept не змінені. Commit/push/PR не виконувалися.

## Аудит функції

За прямим запитом виконаний [аудит плагіна web-frontend](code-audit/audit.md) і [TS-007](tasks/TS-007-audit-refactor.md). Розділені query/route/page-window responsibilities, збережений regression guard карти301 та меж. Після refactor 51 focused tests, source/model-spec typechecks і scoped lint пройдені. Початкові 86 test results вище збережені як історичний implementation checkpoint.
