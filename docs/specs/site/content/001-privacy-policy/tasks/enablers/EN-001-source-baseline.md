# EN-001 — Зафиксировать source и зависимости

- **Enables:** SC-001…SC-013; TS-001 и TS-003.
- **Depends on:** нет.
- **Status:** complete, 2026-11-03, документация.
- **Paths:** исходный privacy-policy.translation.ts; core/config company.ts и site-config.ts; content/{model,ui,seo,feature}/project.json; design/content-source.md и design/privacy-concept.png.json.
- **Test level:** source/config/documentation inspection; behavioral Red неприменим.
- **Architecture baseline:** [frontend](../../design/frontend.md); существующие owners и тестовые конфигурации, новых AF/EN инфраструктуры нет.

## Work

- [x] Прочитан полный UK/RU source, зафиксированы hash, порядок и 34 section content units на локаль.
- [x] Определены разрешённые доменная/контактные подстановки и UK редакционная правка.
- [x] Подтверждены COMPANY, configured site origin, existing legal footer link и public-offer route в рабочем дереве.
- [x] Подтверждены четыре content-проекта, aliases, границы SEO и существующие Vite test configs.
- [x] Зафиксировано принятие концепта; существующая оболочка остаётся источником точных элементов.
- [x] Проверены владельцы затрагиваемых файлов; решения keep/split указаны в frontend.md.

## Evidence

Source SHA-256: C7CF17DDFEE45D868DBA12F1C0407B1C3DCE16B8F7C540B6EDD09CE9E0FFFF3A. Concept SHA-256: 411C92CDCBCA1EC8840C9D80AD15E453AC1697DA65973FE73268AC737998EA0A.

Read-only Get-Content/Get-FileHash inspection 2026-11-03; подробности в [content-source](../../design/content-source.md). package-lock подтвердил Next 16.4.3, Vitest 5.0.5 и Nx 24.0.3. Runtime/browser/deployment не проверялись. Behavioral Red не нужен: это фиксация входных материалов до кода.

## Checkpoint

Исходный документ и допустимые преобразования однозначны, config и проекты существуют. Блокеров для модели/SEO нет. Перед исполнением TS сравнить source hash: при изменении повторно проверить только изменённые ключи и актуализировать эту baseline.
