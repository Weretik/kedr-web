# Implemented frontend feature catalog

**Checked against code:** 2026-10-21. This catalog describes the current implementation, not plans from SDDs.

| Application                                | Features                                                               |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| [Admin React](admin/README.md)             | Dashboard, products, customers, orders, and drafts                     |
| [Mobile React Native](mobile/README.md)    | Shell, catalog, product details, cart, orders, products without photos |
| [Storefront Angular](storefront/README.md) | Catalog and shopping, account, content, and widgets                    |

Each page links to routes, behavior code, data sources, and related specifications. **“Structure diagram”** shows relationships between components, while **“Code structure”** shows a tree of actual directories and key files with brief explanations of their roles. [SDDs](../specs/README.md) hold requirements and implementation history; [architecture](../architecture/frontend-inventory.md) describes shared boundaries. After behavior changes, compare both documentation levels with the code.
