# Локальний аудит відповідальностей — перегляд клієнтів Admin

- **Обсяг:** `libs/admin/clients/{feature,ui}`: детальна сторінка, картка, таблиця списку та їхні безпосередні компоненти. Сторонні зміни робочого дерева не оцінювалися.
- **Дата:** 2026-10-19.
- **Джерела правил:** [організація коду Admin](../../../../../standards/admin/admin-code-organization.md), [стиль списків і деталей](../../../../../standards/admin/list-detail-pages.md), [frontend design фічі](../design/frontend.md).
- **Метод:** статичний огляд конкретних файлів, цільові component tests і TypeScript checks; браузер і повний аудит репозиторію не запускалися.

Це історичний звіт про стан до подальшого редизайну деталей клієнта. Поточну композицію трьох карток без таблиць описують [вимоги](../requirements/behavior.md) та [фіча](../../../../../features/admin/clients.md); наведені нижче посилання на старі компоненти більше не описують поточні файли.

## Знахідки

| ID | Серйозність | Початковий доказ | Правило й вплив | Власник / задача | Виправлення й статус |
| --- | --- | --- | --- | --- | --- |
| AF-001 | medium | До зміни `feature/src/pages/customer-details-page.tsx` дублював ім'я у `h1` й Card, а ID був поза Card | Спільний формат деталей: нейтральний `h1`, ім'я один раз у Card, ID під ним | clients feature/ui, TS-003 | `feature/src/pages/customer-details-page.tsx:72` — заголовок; `ui/src/components/customer-detail-card.tsx:12` — ім'я/ID у Card, повернення через MUI Link зі стрілкою; `customer-details-page.spec.tsx` — 3/3. **verified** |
| AF-002 | medium | До зміни `ui/src/components/customer-detail-card.tsx` мав дві Card, поля контактів і цін та форматування в одному компоненті | Один файл/компонент — одна цілісна відповідальність; один основний блок з двома таблицями | clients ui, TS-003 | `customer-detail-card.tsx:16-17` компонує `customer-contact-table.tsx:3` і `customer-price-types-table.tsx:6`; `customer-detail-card.spec.tsx` — 2/2. **verified** |
| AF-003 | low | До зміни `ui/src/tables/customers-data-grid.tsx` містив вкладені toolbar, overlay і дію рядка | Admin code rules: незалежні toolbar, table та complex cell мають окремих власників | clients ui, TS-002 | `customers-data-grid.tsx:55,96-97` компонує `customer-grid-view-cell.tsx:4`, `customers-grid-toolbar.tsx:3`, `customers-grid-message.tsx:4`; `customers-data-grid.spec.tsx` — 5/5, UI TypeScript check пройшов. **verified** |

Дані клієнта надходять через `@admin/clients/data-access` до feature, а UI отримує лише модель і callback-и; нових API шляхів або доменних імпортів не додано. У `ui/src/components/` три production файли відповідають окремим ролям (композиція, контакти, ціни); у `ui/src/tables/` чотири production файли відповідають таблиці, toolbar, повідомленню й дії рядка. Порога рядків у проєктному стандарті немає; розділення виконано за роллю, не за розміром.

## Межі висновку

Локальний аудит не включає інші домени, повний Nx graph, production build чи браузерну перевірку. Висновок про адаптивність і світлу/темну тему ґрунтується на MUI theme tokens, `sx` breakpoints та коді Admin theme; фактичний вигляд у браузері не перевірявся.
