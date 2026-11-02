# Контакты — трассировка

Все сценарии подтверждены на предусмотренном в СДД уровне: автоматические unit/component/interaction проверки либо проверка подключения стилей по коду. Это не заявление о browser/HTTP-проверке. [Задачи](tasks/README.md), [доказательства и пределы](verification/implementation.md).

| Сценарии                       | TS / EN                        | Реальные тесты / проверка                                                                      | Статус                                                       |
| ------------------------------ | ------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| SC-001                         | EN-001, TS-001, TS-003, TS-004 | [UI][ui]; [серверная композиция][page]; route/layout wiring                                    | Verified: component + code                                   |
| SC-002, SC-003, SC-006, SC-007 | EN-001, TS-001, TS-004         | [UI][ui]; реальные href в [серверном render][page]                                             | Verified: component/server-render                            |
| SC-004, SC-005, SC-011         | EN-001, TS-001, TS-004         | [Clipboard][copy]: keyboard, pending, success, таймер, missing/rejected, retry; JSX aria/focus | Verified: interaction + code; без реального скринридера      |
| SC-008                         | EN-001, TS-001, TS-003, TS-004 | [UI][ui]; [locale paths][page]; [metadata][seo]; существующий locale switch                    | Verified: component/unit + wiring                            |
| SC-009, SC-010                 | EN-001, TS-001, TS-003, TS-004 | [Проверка theme/responsive/motion классов][evidence] и DOM-порядка; токены `global.css`        | Verified: code; visual не выполнялся                         |
| SC-012                         | EN-001, TS-002, TS-003, TS-004 | [Metadata][seo]; [серверный контент][page]                                                     | Verified: unit/server-render; реальный HTTP/head не проверен |
| SC-013                         | EN-001, TS-002, TS-004         | [Metadata][seo]: 4 конфигурации общей robots-политики                                          | Verified: unit                                               |
| SC-014                         | EN-001, TS-002, TS-003, TS-004 | [Схемы][seo]; [sitemap][sitemap]; wiring `apps/site/src/app/sitemap.ts`                        | Verified: unit + code                                        |

После аудита TS-005 дополнительно подтверждает SC-004, SC-005 и SC-011 теми же interaction-тестами после извлечения hook. Доказательства: [AF-001 и итоговая проверка](code-audit/audit.md), свежий UI-набор 11/11; структура изменена, сценарии сохранены.

[ui]: ../../../../../libs/site/content/ui/src/lib/contacts/contacts-ui.spec.tsx
[copy]: ../../../../../libs/site/content/ui/src/lib/contacts/copy-phone-button.spec.tsx
[seo]: ../../../../../libs/site/content/seo/src/lib/contacts-seo.spec.ts
[page]: ../../../../../libs/site/content/feature/src/lib/contacts-page.spec.tsx
[sitemap]: ../../../../../libs/site/content/feature/src/lib/contacts-sitemap.spec.ts
[evidence]: verification/implementation.md
