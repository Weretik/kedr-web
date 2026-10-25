# Frontend design

## File roles

| Path                                                                                           | Status  | Role                                                                  |
| ---------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------- |
| `libs/admin/shared/ui/src/lib/admin-detail-header.tsx`                                         | new     | `AdminDetailHeader`: back link, `h1`, actions                         |
| `libs/admin/shared/ui/src/lib/section-card.tsx`                                                | new     | `SectionCard`: card named by its heading, optional eyebrow and action |
| `libs/admin/shared/ui/src/lib/detail-field.tsx`                                                | new     | `DetailField`, `DetailFieldList`: `dl` of label and value pairs       |
| `libs/admin/shared/ui/src/lib/page-loader.tsx`                                                 | new     | `PageLoader`: announced loading indicator                             |
| `apps/admin/src/app/theme/components.ts`                                                       | changed | `MuiAlert`, `MuiDialogTitle`, `MuiDialogContent`, `MuiDialogActions`  |
| `libs/admin/products/ui/src/components/product-information-card.tsx`, `product-image-card.tsx` | changed | Pills, price, fields, frames                                          |
| `libs/admin/products/feature/src/pages/product-details-page.tsx`                               | changed | Header and loader                                                     |
| `libs/admin/clients/ui/src/components/customer-*.tsx`                                          | changed | Shared cards and fields; `customer-detail-field.tsx` removed          |
| `libs/admin/clients/feature/src/pages/customer-details-page.tsx`                               | changed | Header, loader, error alert                                           |
| `libs/admin/orders/feature/src/components/detail-header.tsx`                                   | changed | Wraps `AdminDetailHeader` with the safe return URL                    |
| `libs/admin/orders/feature/src/pages/*.tsx`                                                    | changed | Loader, `SectionCard`, new order header                               |
| `libs/admin/orders/ui/src/details/order-document-view.tsx`, `forms/*.tsx`                      | changed | Cards, fields, status chip, total                                     |

## Decisions

- The back link is a text `Button` rendered as a router link: it keeps the link role and name and gets the theme's focus and hover.
- `SectionCard` generates its heading id with `useId`, so several cards on one page never collide.
- The order editor and checkout keep their total text («Разом: …», «Разом (попередньо): …») unchanged, because the line editor tests and managers rely on it.
