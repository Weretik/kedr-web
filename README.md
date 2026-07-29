# KEDR Web

[![CI](https://github.com/Weretik/kedr-web/actions/workflows/ci.yml/badge.svg)](https://github.com/Weretik/kedr-web/actions/workflows/ci.yml)

Frontend monorepo for KEDR. It contains the customer-facing storefront, the internal administration panel, and the mobile application. The workspace is managed with [Nx](https://nx.dev), which provides task orchestration, local caching, and affected-project commands.

## Applications

| Application  | Stack                          | Purpose                                                 |
| ------------ | ------------------------------ | ------------------------------------------------------- |
| `storefront` | Angular, PrimeNG, Tailwind CSS | Public web storefront with server-side rendering (SSR). |
| `admin`      | React, Material UI             | Internal administration panel.                          |
| `mobile`     | React Native, Expo             | KEDR mobile application.                                |

Shared code lives in `libs/` and is grouped by application and responsibility. Project-level configuration and runnable targets live beside each application in `apps/*/project.json`.

## Prerequisites

- Node.js **24.15.0 or later**
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
# Storefront - http://localhost:4200 by default
npx nx serve storefront

# Admin panel
npx nx serve admin

# Mobile app - starts Expo development server
cd apps/mobile
npx expo start
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
  storefront/   # Angular SSR storefront
  admin/        # React administration panel
  mobile/       # Expo / React Native application
libs/
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
