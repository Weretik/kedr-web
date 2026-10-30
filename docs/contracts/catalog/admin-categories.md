# Admin categories consumer contract

## Machine contract

- OpenAPI: [`category-read.openapi.yaml`](../openapi/catalog/category-read.openapi.yaml)
- Operations: `getAdminCategories`, `getAdminCategoryById`, `changeAdminCategorySlug`, `getAdminCategoryContent`, `saveAdminCategoryContent`
- Consumers: Admin categories page, Admin products table, Mobile product catalog

All operations need a staff session (Manager or Admin). `deleted=true`, the slug change, and the content save need the Admin role; the client hides those controls for managers, and a `403` still shows «Недостатньо прав для цієї дії».

## Operations used

| Operation                  | Request                                                                   | Client use                                                                                   |
| -------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `getAdminCategories`       | `GET /api/categories[?deleted=true]`                                      | Tree rows (depth-first, unpaged); `deleted=true` lists soft-deleted rows newest first        |
| `getAdminCategoryById`     | `GET /api/categories/{id}`                                                | Details page; `404` for an unknown or deleted category                                       |
| `changeAdminCategorySlug`  | `PUT /api/categories/{id}/slug` with `{ slug }` or `{ regenerate: true }` | Address dialog; a taken slug returns a `slug` validation error                               |
| `getAdminCategoryContent`  | `GET /api/categories/{id}/content`                                        | Stored languages; missing languages are shown empty                                          |
| `saveAdminCategoryContent` | `PUT /api/categories/{id}/content/{uk\|ru}`                               | Full replacement of one language; empty fields go as `null`, the response replaces the cache |

## Consumer mapping

- `@admin/categories/data-access` maps rows to `AdminCategory` (`shortNameUk`/`shortNameRu` as names, `name` as the 1C name, `productTypeIdOneC` as the 1C key) and content to `CategoryContent` per language with empty strings for `null`. The text editor's empty `<p></p>` is sent as `null`. The server sanitizes `bodyHtml`; the Admin shows it back through the editor schema, not as raw HTML.
- `@admin/products/data-access` converts the list to category options with ID, Ukrainian name, depth, and search text built from ancestor names.
- `@mobile/catalog/data-access` builds the tree by `parentId`, sorts siblings by `sortOrder`, then `id`, and ignores `isDeleted`/`deletedAt` (the default list has no deleted rows).

## Behavior and limitations

- An empty array is a valid response.
- The client checks the slug rule (a–z, 0–9, single hyphens, at most 80) and the content limits (title 70, description 160, H1 120, text 20000, up to 20 FAQ items with question 200 and answer 2000) before sending; the server checks them again.
- Invalid tree references must be handled by the mapper without creating cycles; transport values must not be invented or corrected in the UI.
- Transport errors are normalized according to the [integration rules](../integration.md).
