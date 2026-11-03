# Локальная проверка исходной реализации

**Дата:** 2026-11-03. **Объём:** TS-001…TS-006, новый contacts-route, contacts model/UI/SEO/feature, shared content exports и descriptor sitemap. Это проверка изменённой области по исходникам и focused evidence; полный архитектурный аудит, браузер или HTTP-проверка не проводились.

## Структура и интеграция

- Route только ожидает params, проверяет isLocale/notFound и вызывает domain feature/metadata. Guard присутствует и в generateMetadata, и в page.
- ContactsPage выбирает факты COMPANY, локализует город, собирает UI и один BreadcrumbList. Нет API, запроса данных страницы, второго main или повторной Organization.
- Model хранит чистые типы и полный словарь UK/RU. Значения компании не продублированы в словаре.
- UI разделён на композицию, каналы, местоположение, сотрудничество и clipboard leaf. Существующие shell/main/skip-link/locale/theme сохраняют своих владельцев.
- Единственный новый `'use client'` находится в contacts-copy-phone-button.tsx. Clipboard вызывается по действию пользователя, pending имеет защиту от повторов, локальное состояние не попадает в общий store.
- При отказе или отсутствии API показаны объяснение и выделяемый e164; повтор доступен. Обработчик не меняет location и не вызывает tel. Действия звонка остаются обычными ссылками.
- Metadata и BreadcrumbList используют публичные core API. Нет импорта другого домена, непубличного shell-контрола, глобального CSS или нового пакета.
- Content sitemap дополнен одним descriptor; delivery/returns, app sitemap и общий indexing gate сохранены. lastModified не добавлен.

## Темы, локаль и адаптивность

По исходникам проверены site tokens, primary/brand-text/brand-soft, Lucide 1.75, focus и доступные имена. Контакты идут одной колонкой до lg; номер допускает перенос отдельного copy, email — overflow-wrap:anywhere; ссылки и основные кнопки имеют touch-размеры. Hash targets существуют и имеют scroll offsets. Это не измерение rendered geometry, контраста или пиксельного сходства.

Существующий LocaleSwitch использует switchLocalePath(usePathname(), target), поэтому сохраняет contacts-path. Locale layout даёт html lang, Organization и shell skip-link. Контактные help links формируются через localizedPath.

## Независимое review

Агент, не писавший UI/route/feature, прочитал новый route, ContactsPage и все пять UI production-файлов. Материальных замечаний к фактам, границам, client scope, обработке ошибок, ссылкам или очевидным рискам переполнения не обнаружено. Основной агент сверил package API и интегрировал результат. Полный аудит остальных content-страниц не проводился.

Планируемая карта совпала с фактическими путями; новый source-map находится в [карточке функции](../../../../../features/site/contacts.md). Перегруженных файлов, требующих дополнительного разбиения, в этой области не выявлено. Подтверждённых незакрытых in-scope findings нет.

## Evidence и пределы

UI: 35/35, SEO: 20/20, feature: 9/9, все exit 0 и uncached. site:typecheck: exit 0. [Точные команды и SEO-пределы](seo-verification.md); Red/Green/refactor — в task files. Проверка буфера ОС, реальный звонок, отправка в мессенджер и переход по карте не выполнялись. Build, HTTP head/status, browser/visual и E2E остаются unrun; публикация не выполнялась.

## Последующее отдельное поручение

После этого первоначального review пользователь запросил архитектурный аудит с исправлениями. Его выводы, шесть verified findings, новая структура UI и свежие результаты находятся в [code-audit/audit.md](../code-audit/audit.md). Раннее review не заменяет этот последующий аудит и не утверждает, что проблем в типах тестов или защитных механизмах не было.
