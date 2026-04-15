# kedr-web

Frontend monorepo on Nx + Angular for KEDR projects.

## Overview

This repository contains two Angular applications and shared libraries:

- `storefront` - public storefront application (SSR-enabled build is configured)
- `admin` - admin panel application

The workspace uses Nx for project orchestration, affected runs, and caching.

## Tech Stack

- Angular 21
- Nx 22
- PrimeNG 21
- Tailwind CSS 4
- Transloco
- Vitest + Playwright

## Workspace Structure

```text
apps/
  admin/
  storefront/
libs/
  admin/
  storefront/
  shared/
tools/
```

## Requirements

- Node.js 20.x (CI uses Node 20)
- npm (lockfile: `package-lock.json`)

## Getting Started

```bash
npm ci
```

Run applications in development mode:

```bash
npx nx serve storefront
npx nx serve admin
```

Build applications:

```bash
npx nx build storefront
npx nx build admin
```

Run lint for applications:

```bash
npx nx lint storefront
npx nx lint admin
```

Run all major checks:

```bash
npx nx run-many -t lint test build typecheck e2e
```

## Storefront SSR Runtime

After building `storefront`, start the server bundle:

```bash
npm run storefront:start
```

## Useful Scripts

- `npm run tokens:gen` - generate Tailwind palette tokens

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`

Main CI steps:

1. `npm ci`
2. `npx playwright install --only-shell`
3. `npx nx run-many -t lint test build typecheck e2e`
