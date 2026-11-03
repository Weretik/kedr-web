# TS-006 — Evidence и документация поставки

- **Status:** completed 2026-11-03 (focused automated/source scope).
- **Covers:** итоговая проверка SC-001…SC-014 по имеющемуся разрешённому уровню.
- **Depends on:** TS-005.
- **Paths:** `docs/features/site/contacts.md`, `docs/features/README.md`, `docs/architecture/site/structure/modules.md`, `docs/architecture/site/platform/seo-architecture.md`, `docs/specs/README.md`; `README.md`, `traceability.md`, `tasks/TS-001-contact-copy.md`…`tasks/TS-006-verification-handoff.md`, `checklist/delivery-readiness.md`, `verification/seo-verification.md` внутри этого SDD.
- **Test level:** документация и локальная сверка доказательств; дополнительный runtime-check только для конкретного непокрытого риска.
- **Architecture baseline:** [правила поставки](../../../../../standards/shared/delivery-rules.md), [правила проверок](../../../../../standards/shared/testing-rules.md).

## Work

- [x] Сопоставить фактическое дерево контактов с file-role map, проверить локальные границы, отсутствие лишнего client scope и сохранность соседних страниц. Отметить решения сохранить/разделить по ответственности.
- [x] Собрать результаты уже выполненных focused UI/SEO/feature checks и route typecheck; не повторять их после doc-only правок.
- [x] Создать фактическую feature card: маршруты, поведение, источники, Mermaid связей, дерево реальных файлов и focused tests. Добавить строку в implemented feature catalog только после реализации.
- [x] Обновить точные route/domain сведения в modules и SEO architecture, статусы SDD/index/traceability и delivery checklist.
- [x] Сверить ссылки и diff только затронутой документации; сохранить чужие текущие изменения.
- [x] Зафиксировать unrun build/HTTP/browser/visual/E2E отдельно. Если владелец разрешит конкретную release-проверку, выполнить и приложить фактический результат; отказ/отсутствие разрешения не заменять pass.

## Evidence

Сопоставлены фактические 22 code/test/index-файла контактов с file-role map; создана feature card с Mermaid, деревом и focused commands, обновлены feature/spec catalog, modules и SEO policy. Все ранее существующие exports, content descriptors и параллельные изменения общих документов сохранены через preflight SHA guards.

Свежие evidence приняты от владельцев без повторного UI/SEO прогона: UI 35/35, SEO 20/20, feature 9/9; site:typecheck exit 0. Независимое source review и финальная локальная проверка границ не обнаружили материальных findings. Red/Green — n/a для doc-only части. Замена: проверка локальных ссылок, scoped whitespace diff, контроль source hashes и сопоставление actual architecture.

Build/HTTP/browser/visual/E2E unrun; реальный буфер ОС, звонки и мессенджеры не запускались. Коммита, push и deployment нет. Пределы и точные команды записаны в verification/seo-verification.md и verification/local-review.md.

## Checkpoint

Фактические файлы, feature card, статусы и traceability согласованы. Указаны выполненные проверки и их пределы; никакая неизмеренная HTTP/визуальная/production-готовность не объявлена доказанной. Коммит, push и публикация в эту задачу не входят.

## Последующий архитектурный аудит

Последующий полный архитектурный аудит contacts закрыт в [TS-007](TS-007-audit-verification.md): шесть verified findings, фактическая карта UI/типовых и guard checks обновлена. Первичная локальная проверка и её результаты сохранены как историческое evidence. [Отчёт](../code-audit/audit.md).
