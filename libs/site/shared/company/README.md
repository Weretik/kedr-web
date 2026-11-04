# Site shared company

Server-only loader of the company sales contacts (phone, email, Telegram, Viber, map, city) that staff edit in the admin «Контакти компанії» card.

- `getCompanyContacts()` reads `GET /api/content/contacts` with `'use cache'`, tags `content` and `content:contacts`, and a ten-minute life.
- When the API cannot be reached it returns `FALLBACK_COMPANY_CONTACTS` from `@site/core/config`, so a phone never disappears and builds do not fail.
- Feature pages and the app layout call it and pass the contacts down as props; UI components never import it.

Focused tests: `npx nx run site-shared-company:vite:test -- --run`
