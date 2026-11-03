# Локальная проверка затронутой области

2026-11-03. Это staged responsibility/source review, не полный frontend-code-audit и не visual/browser review.

## По слоям

- Model: types, полный raw source, explicit key mapper, UI dictionary и completeness spec имеют отдельные роли. Полный ordered mapper оставлен cohesive: восемь source sections и их bindings принадлежат одной трансформации.
- SEO: metadata и BreadcrumbList разделены; runtime imports только core. Organization остаётся у layout, fabricated entities/dates не добавлены.
- UI: header/summary/navigation/policy/contact разделены; privacy-content только компонует. Нативные details и CSS fragment styling не требуют client island.
- Интеграция: feature связывает config с model и добавляет JsonLd; route ожидает params и проверяет locale; sitemap расширен одним descriptor без потери entries.
- Public indices: адресные exports через четыре существующих @site/content APIs; новых проектов, aliases, packages или boundary exceptions нет.

## Проверенные риски

- Security: текст рендерится React-строками и typed links; dangerouslySetInnerHTML, запросы, secrets, browser storage и новые handlers обработки данных не добавлены.
- Correctness: 34 source units на локаль, независимые bindings, id targets, contact href, language и index gate покрыты focused cases.
- Performance: нет page client state/effects/observers, remote data или новых image/font/script assets; локальный документ конечного размера.
- Accessibility/theme: H1/H2, labelled nav/sections, decorative aria-hidden icons, focus-visible, native summary, display:none для скрытого TOC, токены primary/brand-text и wrapping проверены по source.

CSS Modules используют attribute selectors [id='privacy-*'] для :target/:has; это сохраняет публичные fragment IDs, не превращая их в local CSS identifiers. Подсветка отражает fragment, не обещает scrollspy.

## Независимые проверки

Агент модели подтвердил pure bindings, locale guard, реальные exports и additive sitemap. Агент SEO/visual проверил семь staged UI/CSS файлов: композицию, модель, native disclosure, unique targets и CSS scope. Замечаний, требующих исправления в конечном коде, нет. Код агентов после Green не изменялся; UI форматировался без изменения семантики.

Фактическая структура отражена в [feature card](../../../../../features/site/privacy-policy.md). Дополнительно к planned map введён privacy-page.spec.tsx: проверяет реальную серверную композицию и совпадение BreadcrumbList с видимыми крошками, а не только изолированный builder.
