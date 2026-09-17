# Admin categories consumer contract

## Machine contract

- OpenAPI: [`category-read.openapi.yaml`](../openapi/catalog/category-read.openapi.yaml)
- Operation: `getAdminCategories`
- Generated response: `operations['getAdminCategories']['responses'][200]['content']['application/json']`
- Consumer: Mobile product catalog

`GET /api/categories` не має параметрів і повертає весь depth-first список без
pagination. Поточний OpenAPI явно задає `security: []`, але route позначений як
catalog administration. Перед public rollout політику доступу має підтвердити
власник backend contract.

## Consumer mapping

`@mobile/catalog/data-access` тримає generated response на transport boundary і
перетворює його на `CatalogCategoryOption[]`. Mapper:

- вибирає localized label з `shortNameUk` або `shortNameRu`;
- будує дерево за `parentId`;
- сортує siblings за `sortOrder`, потім `id`;
- не передає transport DTO у feature або UI.

```http
GET /api/categories
Accept: application/json
```

## Behavior and limitations

- Порожній масив є коректною відповіддю.
- Operation не описує окремі error responses, тому runtime transport errors
  нормалізуються за [integration rules](../integration.md).
- Не додавайте client pagination, query filters або нові cache semantics без
  зміни provider contract.
- Invalid tree references мають оброблятися mapper-ом без створення циклів;
  transport values не можна вигадувати або виправляти в UI.
