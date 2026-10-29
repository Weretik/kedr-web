# site-core-config

Site configuration and public company facts for `apps/site`; the only code that reads `process.env`. See the [site architecture](../../../../docs/architecture/site/README.md).

- `siteConfig` — public origin, KedrStore API origin, environment, and whether search engines may index the site.
- `createSiteConfig` — builds the same object from any environment map (used in tests).
- `COMPANY` — name, phone, email, city, and messenger and map links.

| Variable        | Default                        | Purpose                                                          |
| --------------- | ------------------------------ | ---------------------------------------------------------------- |
| `SITE_URL`      | `https://classkedr.com.ua`     | Canonical origin                                                 |
| `KEDR_API_URL`  | `https://api.classkedr.com.ua` | Backend origin for server-side requests                          |
| `SITE_ENV`      | `development`                  | `production`, `preview`, or `development`                        |
| `SITE_INDEXING` | not set                        | `true` allows indexing, only together with `SITE_ENV=production` |

Tests: `npx nx run site-core-config:vite:test -- --run`.
