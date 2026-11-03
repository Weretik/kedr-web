# Задачи реализации

Все задачи TS-001…TS-007 **completed** 2026-11-03 в согласованном automated/source scope. [Evidence](../verification/seo-verification.md), [локальная проверка](../verification/local-review.md). Build/HTTP/browser/visual остаются unrun. Правила: [delivery](../../../../../standards/shared/delivery-rules.md) и [testing](../../../../../standards/shared/testing-rules.md).

| ID                                       | Одна ответственность                                  | Depends on     | Основные сценарии                           |
| ---------------------------------------- | ----------------------------------------------------- | -------------- | ------------------------------------------- |
| [TS-001](TS-001-contact-copy.md)         | Типизированные данные представления и UK/RU copy      | —              | Enables SC-001…SC-010                       |
| [TS-002](TS-002-clipboard.md)            | Изолированное копирование с доступной обратной связью | TS-001         | SC-003, SC-004, SC-010                      |
| [TS-003](TS-003-contact-ui.md)           | Утверждённый адаптивный интерфейс контактов           | TS-001, TS-002 | SC-001, SC-002, SC-005…SC-010               |
| [TS-004](TS-004-contact-seo.md)          | Metadata и BreadcrumbList                             | —              | SC-011, SC-013, SEO-часть SC-014            |
| [TS-005](TS-005-route-integration.md)    | Интеграция страницы, locale route и sitemap           | TS-003, TS-004 | SC-001, SC-008, SC-011…SC-014               |
| [TS-006](TS-006-verification-handoff.md) | Итоговые evidence и документация фактической поставки | TS-005         | Проверка всего согласованного объёма        |
| [TS-007](TS-007-audit-verification.md)   | Закрытие архитектурного аудита и подтверждённых fixes | TS-001…TS-006  | AF-001…AF-006, verification существующих SC |

Параллельные независимые части: TS-004 и цепочка TS-001 → TS-002 → TS-003. TS-005 принадлежит одному интегратору; он добавляет route, page composition и sitemap descriptor. TS-006 не перекладывает исправление поведения на финальную проверку: каждый этап проверяет структуру и собственный риск до передачи дальше. Дополнительные агенты при реализации используются только при сохраняющемся явном поручении пользователя.

## Доступные focused команды

Эти focused targets выполнены при реализации; точные использованные Node/Nx-команды и результаты записаны в verification/seo-verification.md:

```text
npx nx run site-content-ui:vite:test -- --run
npx nx run site-content-seo:vite:test -- --run
npx nx run site-content-feature:vite:test -- --run
npx nx run site:typecheck
```

UI, SEO и feature проверяют разные риски; это не запрос общего `test:site`. Запуски можно сузить до названных spec-файлов, если фактический inferred target поддерживает их передачу. Не повторять успешный target после правок только документации. Дополнительные lint/boundaries нужны при конкретном непокрытом риске, а не как обязательный пакет команд.

Для документации проверяются изменённые ссылки и scoped `git diff --check`. Browser/manual/visual/E2E, build и HTTP-проверки запрашиваются отдельно; перечень команд в плане не является разрешением на их запуск.
