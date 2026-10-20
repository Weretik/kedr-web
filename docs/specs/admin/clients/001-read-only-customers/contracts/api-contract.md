# Клієнти — API-контракт

**Provider:** KedrStore `docs/sdd/contracts/sales/customer-read.openapi.yaml`; frontend [snapshot provenance](../../../../../contracts/openapi/SOURCE.md) містить backend commit `02429192d02e8e9252d06d6ea984affa0d216aa7`. Поточну реалізацію сортування звірено з backend commit `8fc8729`. Операції є у snapshot/generated types; рішення Admin-споживача описує [consumer projection](../../../../../contracts/sales/admin-customers.md).

| operationId            | Метод і шлях                                | Сценарії               | Власник                      |
| ---------------------- | ------------------------------------------- | ---------------------- | ---------------------------- |
| `getAdminCustomers`    | `GET /api/admin/customers`                  | SC-001, SC-002, SC-005 | `@admin/clients/data-access` |
| `getAdminCustomerById` | `GET /api/admin/customers/{counterpartyId}` | SC-003, SC-004         | `@admin/clients/data-access` |

**Чинний контракт на 2026-10-19:** `page>=1`, `pageSize` 1..100, defaults 1/20; серверний порядок name→ID. Синхронізований snapshot має серверні `searchTerm`, фільтри та `sort`. Список повертає `pagedInfo` і рядки `counterpartyId`, `name`, nullable `phone`. Detail повертає ці поля, `email`, `defaultPriceTypeId`, nullable `defaultPriceTypeName` і `categoryPriceTypes[{categoryId,categoryName,priceTypeId,priceTypeName}]`.

**Можливості provider:** `GET /api/admin/customers` приймає `searchTerm`, точні фільтри `counterpartyId`, `name`, `phone`, `sort`, `page`, `pageSize`. `searchTerm` шукає серед ID, імені й телефону; додаткові фільтри API поєднуються через AND. Допустимі значення `sort`: `name`, `-name`, `counterpartyId`, `-counterpartyId`, `phone`, `-phone`; вторинний порядок ID детермінований. Усі умови й сортування виконуються на сервері перед `Skip/Take`; `pagedInfo.totalRecords` рахує відфільтровані записи. Текстові умови мають `maxLength=100`, сервер виконує `Trim` і case-insensitive substring; телефон порівнюється зі збереженим рядком без нормалізації цифр. Порожня після `Trim` умова означає відсутній фільтр. Поточний Admin UI надсилає `searchTerm`, `sort`, `page`, `pageSize`.

**Окремий інкремент деталей, 2026-10-19:** backend OpenAPI `getAdminCustomerById` тепер визначає `defaultPriceTypeName: string | null` та `categoryPriceTypes[{categoryId,categoryName,priceTypeId,priceTypeName}]`, де обидві назви nullable; чинні ID збережено для ідентичності. Backend бере назви з Catalog `PriceType.PriceTypeName` і `ProductCategory.Name`. UI показує назву типу цін замість його ID, а категорію — назвою разом із ID; `null` відображається як «Назва недоступна». Frontend snapshot/generated types синхронізовано з backend commit `8fc8729`.

На межі data-access використовувати `operations[...]`, runtime validation та mapper; UI бачить лише модель. RTK Query cache key включає параметри запиту й ID деталей. Зміна пошуку або сортування в Admin UI скидає page до 1; додаткові фільтри залишаються доступними в контракті API без елементів керування на цьому екрані. Непорожній ID валідується до запиту; `404` — not found, transport error — безпечний retry. Не додавати адрес, статусів чи інших DTO.

OpenAPI має `security: []`; backend controller тимчасово `[AllowAnonymous]`. Production exposure потребує backend access decision. Синхронізація зміненого контракту — за [workflow](../../../../../contracts/README.md), без ручного редагування frontend snapshot/generated. Перевіряти лише змінений контракт і тести цієї фічі; повний прогін і браузер — тільки за окремим прямим запитом користувача.
