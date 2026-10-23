# Admin categories consumer contract

## Machine contract

- OpenAPI: [`category-read.openapi.yaml`](../openapi/catalog/category-read.openapi.yaml)
- Operation: `getAdminCategories`
- Generated response: `operations['getAdminCategories']['responses'][200]['content']['application/json']`
- Consumers: Mobile product catalog, Admin products table

`GET /api/categories` takes no parameters and returns the full depth-first list without pagination. The current OpenAPI explicitly sets `security: []`, but the route is marked for catalog administration. The backend contract owner must confirm the access policy before public rollout.

## Consumer mapping

`@mobile/catalog/data-access` keeps the generated response at the transport boundary and converts it to `CatalogCategoryOption[]`. The mapper:

- selects a localized label from `shortNameUk` or `shortNameRu`;
- builds the tree by `parentId`;
- sorts siblings by `sortOrder`, then `id`;
- does not pass transport DTOs to feature or UI.

`@admin/products/data-access` converts the response to options with ID, Ukrainian name, depth, and search text built from ancestor names by `parentId`. For public catalog categories, names are matched to their Ukrainian labels; for others, the response's `shortNameUk` is used. MUI Autocomplete shows nesting with indentation, allows selecting any level, and passes only the ID to the list API.

```http
GET /api/categories
Accept: application/json
```

## Behavior and limitations

- An empty array is a valid response.
- The operation does not describe separate error responses, so runtime transport errors are normalized according to the [integration rules](../integration.md).
- Do not add client pagination, query filters, or new cache semantics without changing the provider contract.
- Invalid tree references must be handled by the mapper without creating cycles; transport values must not be invented or corrected in the UI.
