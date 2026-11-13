# KEDR Web

[![CI](https://github.com/Weretik/kedr-web/actions/workflows/ci.yml/badge.svg)](https://github.com/Weretik/kedr-web/actions/workflows/ci.yml)

Frontend monorepo of the **Kedr** platform: a door hardware wholesaler's public site, staff admin app and offline mobile app for sales managers. The backend, the system overview and the architecture diagrams are in [KedrStore](https://github.com/Weretik/KedrStore#readme). The workspace is managed with [Nx](https://nx.dev).

## Applications

| Application  | Stack                                                      | Purpose                                                                                     |
| ------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `site`       | Next.js 16 App Router, shadcn/ui, Tailwind CSS v4, OpenNext | Public catalog site [classkedr.com.ua](https://classkedr.com.ua) on Cloudflare Workers, UA/RU |
| `admin`      | React 19, Vite, Material UI 9, RTK Query                   | Staff admin app on Cloudflare Pages                                                         |
| `mobile`     | Expo, React Native, expo-sqlite + Drizzle                  | «Kedr Manager»: offline-first app for sales managers                                         |
| `storefront` | Angular, PrimeNG                                           | Previous public storefront, replaced by `site`; kept until removal                          |

All clients use TypeScript types generated from the backend OpenAPI snapshot (`libs/shared/api-contracts`).

Key decisions: [Next.js public site](docs/architecture/site/adr/0001-nextjs-public-site.md), [offline-first mobile app](docs/architecture/mobile/adr/0005-offline-first-local-database.md), [admin transport](docs/architecture/admin/adr/0001-admin-axios-transport.md). Feature list: [feature catalog](docs/features/README.md).

## Prerequisites

- Node.js **24.18.x or newer in the 24.x line** (`package.json`); `.nvmrc` and `.node-version` recommend 24.20.0
- npm (the repository uses `package-lock.json`)

Check your installed Node.js version:

```bash
node --version
```

## Getting started

Clone the repository and install the exact dependency versions recorded in the lockfile:

```bash
git clone https://github.com/Weretik/kedr-web.git
cd kedr-web
npm ci
```

Run an application:

```bash
# Admin panel - http://localhost:4200
npx nx serve admin

# Public site - set KEDR_API_URL in apps/site/.env.local
npx nx dev site

# Mobile app - Expo dev server; needs a development build, not Expo Go
npx nx start mobile
```

Example `apps/site/.env.local` (git-ignored):

```dotenv
KEDR_API_URL=https://localhost:7230
KEDR_REVALIDATE_SECRET=<shared-secret>
```

Nx is installed locally, so a global Nx installation is not required.

## Common commands

| Task                                 | Command                                                             |
| ------------------------------------ | ------------------------------------------------------------------- |
| Build the storefront                 | `npx nx build storefront`                                           |
| Build the admin panel                | `npx nx build admin`                                                |
| Lint an app                          | `npx nx lint storefront` or `npx nx lint admin`                     |
| Test the mobile app                  | `npx nx test mobile`                                                |
| View available projects              | `npx nx show projects`                                              |
| Inspect a project and its targets    | `npx nx show project <project>`                                     |
| Visualize dependencies               | `npx nx graph`                                                      |
| Run checks only for changed projects | `npx nx affected -t lint test build --base=origin/main --head=HEAD` |
| Generate Tailwind palette tokens     | `npm run tokens:gen`                                                |

### Production SSR for storefront

Build the storefront and then start its generated Node.js server:

```bash
npx nx build storefront
npm run storefront:start
```

## Repository layout

```text
apps/
  site/         # Next.js public site
  storefront/   # previous Angular storefront
  admin/        # React administration panel
  mobile/       # Expo / React Native application
libs/
  site/         # Site features, SEO, catalog, cart
  storefront/   # Shared storefront features and infrastructure
  admin/        # Shared admin features and infrastructure
  mobile/       # Shared mobile features and infrastructure
docs/           # Architecture, standards, API contracts, and specifications
tools/          # Project automation scripts
```

## Development notes

- Keep changes scoped to an application or shared library; use Nx targets instead of calling framework tooling directly.
- Before opening a pull request, run the relevant lint, test, and build targets. Use `nx affected` when the base branch is available locally.
- The `docs/` directory contains the project standards and architecture notes. Read the relevant application guidance before a non-trivial change.
- Do not commit secrets. Use local environment configuration for credentials and deployment-specific values.

## CI

GitHub Actions installs dependencies, installs the Playwright browser shell, and runs affected lint, test, and build targets against `origin/main`.
