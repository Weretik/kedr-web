# site-shared-ui

shadcn/ui-style primitives for `apps/site`, built on Radix UI and Tailwind CSS v4 tokens from `apps/site/src/app/global.css`. Add a primitive here only when two or more site libraries use it. See the [site design system](../../../../docs/standards/site/design-system.md).

- `cn` — class name merge.
- `Button`, `buttonVariants` — `default` (ink), `brand` (green), `outline`, `ghost`, `link`; `asChild` styles a link.
- `Sheet*` — side panel (client component).

Add new primitives with the shadcn CLI from this folder (`npx shadcn@latest add <component>`, configured by `components.json`), then export them from `src/index.ts`. `Button` and `Sheet` follow the shadcn `new-york` source.

Tests: `npx nx run site-shared-ui:vite:test -- --run`.
