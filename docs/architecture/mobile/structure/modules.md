# Наявні модулі Mobile

Це карта Nx projects, які зараз є в репозиторії, а не план майбутніх модулів. Джерело — `project.json` у зазначених каталогах і фактичні файли Expo Router; актуальні targets перевіряй у Nx та [frontend inventory](../../frontend-inventory.md). Цільові межі описані в [domains.md](domains.md).

| Область       | Наявні Nx projects                                   | Відповідальність                                             |
| ------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| Застосунок    | `apps/mobile`                                        | Expo Router, layouts і композиція застосунку                 |
| Core          | `libs/mobile/core/{shell,connectivity}`              | Провайдери, навігаційна оболонка та стан мережі              |
| Mobile shared | `libs/mobile/shared/{api-client,config,model}`       | Спільні для Mobile API, конфігурація й моделі                |
| Catalog       | `libs/mobile/catalog/{feature,data-access,model,ui}` | Каталог і деталі товару                                      |
| Cart          | `libs/mobile/cart/{feature,data-access,model,ui}`    | Кошик                                                        |
| Orders        | `libs/mobile/orders/{feature,data-access,model,ui}`  | Замовлення та їх деталі                                      |
| Customers     | `libs/mobile/customers/{data-access,model,ui}`       | Дані й презентація клієнта; окремого `feature` project немає |

Файлові маршрути в `apps/mobile/src/app` зараз містять вкладки `catalog`, `cart`, `orders`, `profile`, а також `product/[productSlug]` і `orders/[orderId]`. Це фактична карта файлів, а не підтвердження готовності всіх бізнес-сценаріїв. `core/auth` і заплановані route groups створюй лише за прийнятою задачею. Спільні для різних клієнтів `libs/shared/*` обліковує [frontend inventory](../../frontend-inventory.md).
