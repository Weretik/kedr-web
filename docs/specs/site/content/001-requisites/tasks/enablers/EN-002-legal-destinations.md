# EN-002 — Готовность связанных юридических страниц

- **Status:** open; внешний prerequisite финальной поставки. Владелец — владелец Kedr / исполнитель отдельного переноса legal pages.
- **Enables:** SC-012, финальная приёмка и публикация блока юридических ссылок.
- **Depends on:** отдельная реализация целевых материалов, не входящая в requisites.
- **Точные targets:** /uk/public-offer, /ru/public-offer, /uk/privacy-policy, /ru/privacy-policy.
- **Точные code locations для проверки:** `apps/site/src/app/[locale]/(content)/public-offer/page.tsx` и `apps/site/src/app/[locale]/(content)/privacy-policy/page.tsx` либо явно документированные реальные route owners/redirect; `apps/site/next.config.ts`; `libs/site/core/shell/src/lib/navigation/site-navigation.ts`.
- **Test level:** source/integration evidence целевых страниц; реальный HTTP при отдельном разрешении.
- **Baseline при подготовке SDD:** shell LEGAL_LINKS содержит targets; целевые pages отсутствовали. В ходе реализации отдельно появился public-offer route, privacy-policy в проверенных destinations ещё отсутствует. Это не AF реквизитов и не поручение создать legal pages в этом объёме.

## Work

- [ ] Получить ссылку на отдельную задачу/поставку двух материалов и владельца.
- [ ] Подтвердить реальные UK/RU страницы, соответствующий контент и same-language назначения.
- [ ] Записать paths, статус реализации и доступное evidence. Source check не выдавать за HTTP 200.
- [ ] Перед публикацией подтвердить успешную доступность destinations по принятой процедуре релиза; если HTTP-прогон не разрешён здесь, это evidence предоставляет владелец релиза.
- [ ] Сохранить согласованные юридические ссылки; не закрывать gate простым скрытием блока или вымышленным redirect.
- [ ] Не переделывать общий shell и не мигрировать оферту/политику как побочный эффект requisites.

## Evidence

2026-11-03: при подготовке SDD были только shell targets. Повторный source check в ходе реализации нашёл apps/site/src/app/[locale]/(content)/public-offer/page.tsx из параллельной работы; privacy-policy не найден под locale и (content). Контент/HTTP чужой поставки не проверялись. EN-002 остаётся open до evidence владельца релиза. Поведенческий Red для requisites n/a: зависимость принадлежит отдельным материалам.

## Checkpoint

Обе юридические страницы доступны на двух языках по подтверждённым назначениям; evidence и владелец записаны здесь. До этого SC-012 и финальная поставка не verified; UI/clipboard/SEO-разработка может продолжаться независимо.
