# Локальний аудит відповідальностей товарів Admin

**Дата:** 2026-10-19. **Межі:** лише змінені сьогодні Admin-картка та таблиця товарів; статичний огляд коду, SDD й архітектурних правил. Повний аудит репозиторію, браузер і повні тести не входять до цього огляду.

**Правила:** [організація Admin-коду](../../../../../standards/admin/admin-code-organization.md), [залежності](../../../../../architecture/admin/structure/dependencies.md), [єдиний стиль списків і деталей](../../../../../standards/admin/list-detail-pages.md).

| ID | Серйозність / статус | Доказ і вплив | Власник, ціль та перевірка |
| --- | --- | --- | --- |
| AF-001 | P2 / verified | `libs/admin/products/feature/src/pages/product-details-page.tsx` раніше містив API/route разом із Card, таблицею, зображеннями та Dialog. Це змішувало оркестрацію і презентацію всупереч `admin-code-organization.md`. | `feature` залишає route/API/стани, `ui/src/components/` володіє презентацією через props. Цільовий тест картки 7/7 і типізація UI/feature успішні. |
| AF-002 | P2 / verified | `libs/admin/products/ui/src/tables/products-data-grid.tsx` раніше керував Data Grid, заголовками boolean-фільтрів, action cell і toolbar. | Header, action cell і toolbar винесено в окремі презентаційні компоненти `ui/src/tables/`; `ProductsDataGrid` зберіг композицію колонок і керованої таблиці без API/router. Цільовий тест таблиці 3/3 і типізація UI успішні. |

**Докази 2026-10-19:** `vitest` для `products-navigation.spec.tsx` — 7/7 (картка); `vitest` для `products-data-grid.spec.tsx` — 3/3 після розділення таблиці; `tsc --noEmit -p libs/admin/products/ui/tsconfig.lib.json` і `tsc --noEmit -p libs/admin/products/feature/tsconfig.lib.json` — успішно після синхронізації контракту категорій.

Файл backend запиту, клієнтська таблиця й інші застосунки не входять до цього аудиту. Сама кількість рядків не є критерієм порушення: проєкт не задає числового порога.
