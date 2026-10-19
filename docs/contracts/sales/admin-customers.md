# Контракт споживача Admin: клієнти

## Машинозчитуваний контракт

- OpenAPI: [`customer-read.openapi.yaml`](../openapi/sales/customer-read.openapi.yaml)
- Операції: `getAdminCustomers`, `getAdminCustomerById`
- Згенеровані транспортні типи: `operations['getAdminCustomers']` і `operations['getAdminCustomerById']`
- Споживач: список і картка клієнтів Admin
- Походження snapshot: [`SOURCE.md`](../openapi/SOURCE.md)

Обидві операції належать провайдеру. Чинний OpenAPI містить `security: []`, а контролер дозволяє анонімний доступ; відкриття production-доступу потребує рішення власника backend.

## Проєкція запиту

Оновлений provider OpenAPI приймає `page >= 1`, `pageSize` від 1 до 100, необов'язкові `searchTerm`, `counterpartyId`, `name`, `phone` (кожне текстове значення до 100 символів) і `sort`: `name`, `-name`, `counterpartyId`, `-counterpartyId`, `phone`, `-phone`. Типові значення провайдера: `page=1`, `pageSize=20`, `sort=name`. `searchTerm` шукає серед ID, імені й телефону; сервер обчислює кількість після умов і до пагінації. Поточний Admin UI використовує лише `searchTerm`, `page`, `pageSize`: один пошук у панелі таблиці, без фільтрів колонок і сортування. Інші параметри залишаються можливостями API. При зміні пошуку UI повертається на сторінку 1. Для деталей потрібний непорожній `counterpartyId` у шляху; URL списку зберігає пошук і пагінацію для повернення.

**Стан синхронізації 2026-10-19:** frontend snapshot і generated types синхронізовано з backend commit `8fc8729`. Параметри запиту звіряються з `CustomerPageParams` через TypeScript `satisfies`, без assertion. Snapshot та generated types не редагувалися вручну.

## Проєкція відповіді та UI

- Список: `pagedInfo` задає серверну пагінацію й кількість усіх знайдених клієнтів; рядки містять `counterpartyId`, `name` і nullable `phone`.
- Деталі: ті самі поля ідентичності й контакту, а також `email`, `defaultPriceTypeId`, nullable `defaultPriceTypeName` і `categoryPriceTypes[{categoryId,categoryName,priceTypeId,priceTypeName}]`; обидві назви в елементі масиву також nullable. UI показує назву типу цін замість ID, а категорію — назвою та ID. Для `null` використовується «Назва недоступна».
- Ці операції не повертають адрес, замовлень, історії платежів, аватара чи статусу клієнта.
- `@admin/clients/data-access` перевіряє unknown-відповідь у runtime та переводить згенеровані транспортні типи в UI-моделі. Feature та UI не імпортують DTO.
- `404` деталей означає стан «не знайдено». Мережеві/серверні помилки дають безпечну дію повтору без показу response body чи контактів у логах.

Зміна полів провайдера чи правил доступу потребує оновлення канонічного backend OpenAPI, потім версіонованого snapshot і згенерованих типів за [contract workflow](../README.md).
