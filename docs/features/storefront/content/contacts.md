# Storefront Contacts

**Entry point:** [contactsRoutes](../../../../libs/storefront/feature/contacts/src/lib/lib.routes.ts) opens `/contacts`.

- [ContactsPage](../../../../libs/storefront/feature/contacts/src/lib/page/contacts-page/contacts-page.ts) composes the localized heading and [ContactUs](../../../../libs/storefront/feature/contacts/src/lib/page/sections/contact-us/contact-us.ts); supporting sections belong to the same feature library.
- The page uses the shared [PageHeader](../../../../libs/storefront/ui/src/index.ts). `ContactUs` has local form fields, but the component does not yet submit through an API; do not treat it as a functioning contact channel.

## Architecture

```mermaid
flowchart LR
Route["contactsRoutes"] --> Page["ContactsPage"]
Page --> Header["PageHeader"]
Page --> Contact["ContactUs"]
Contact --> State["Local fields without API"]
```

## Code structure

Actual entry points and primary feature files (other files in these directories are omitted):

```text
libs/storefront/feature/contacts/
└── src/lib/
    ├── page/
    │   ├── contacts-page/contacts-page.ts  # page and UI composition
    │   └── sections/contact-us/contact-us.ts  # page and UI composition
    └── lib.routes.ts  # feature routes

libs/storefront/ui/
└── src/index.ts  # library public API
```
