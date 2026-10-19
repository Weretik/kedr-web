# Наявні модулі Admin

Це карта Nx projects, які зараз є в репозиторії, а не перелік запланованих бібліотек. Джерело — `project.json` у зазначених каталогах; перед зміною перевір актуальний код і [frontend inventory](../../frontend-inventory.md). Цільові межі та можливі майбутні домени описані в [domains.md](domains.md).

| Область      | Наявні Nx projects                                   | Відповідальність                             |
| ------------ | ---------------------------------------------------- | -------------------------------------------- |
| Застосунок   | `apps/admin`, `apps/admin-e2e`                       | Композиція React Admin і браузерні перевірки |
| Core         | `libs/admin/core/auth`, `libs/admin/core/shell`      | Сесія та каркас застосунку                   |
| Dashboard    | `libs/admin/dashboard/feature`                       | Маршрути й екран dashboard                   |
| Products     | `libs/admin/products/{model,data-access,ui,feature}` | Модель товарів, API, презентація та сценарії |
| Clients      | `libs/admin/clients/{model,data-access,ui,feature}`  | Список і картка клієнтів, API та моделі      |
| Admin shared | `libs/admin/shared/{api-client,config}`              | API transport і конфігурація Admin           |

Поточний router підключає маршрути dashboard, products і clients у `apps/admin/src/app/router/app-router.tsx`. `orders` і `core/permissions` у [цільовій схемі](domains.md) не означають, що відповідні Nx projects вже існують. Спільні для клієнтів бібліотеки `libs/shared/*` наведені у [frontend inventory](../../frontend-inventory.md).
