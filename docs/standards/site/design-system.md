# Site design system

Visual rules for `apps/site`. Source: the owner-approved concept (2026-10-26) in [ideas/storefront-nextjs](../../ideas/storefront-nextjs/README.md) and its [mockup](../../ideas/storefront-nextjs/concept.html). Tokens live in `apps/site/src/app/global.css`; primitives in `libs/site/shared/ui` follow shadcn/ui (`new-york`) on Radix UI with Tailwind CSS v4.

## Principles

- Product, price, and availability come first. Colour only where something must be pressed or noticed.
- Minimal and calm: few colours, plain surfaces, real text instead of images of text.
- Everything in the current header stays, in a modern layout.
- Business scope: door hardware only, wholesale with retail orders. No services, fitting, or cut-out pickers.

## Tokens

| Token                            | Light                 | Dark                  | Use                                             |
| -------------------------------- | --------------------- | --------------------- | ----------------------------------------------- |
| `background`                     | `#FFFFFF`             | `#0C0D0C`             | page                                            |
| `foreground`                     | `#0F110F`             | `#EDEFEA`             | text                                            |
| `muted`                          | `#F4F5F2`             | `#161815`             | top bar, inputs, hover                          |
| `muted-foreground`               | `#5C6459`             | `#9AA296`             | secondary text                                  |
| `border`                         | `#E3E6DF`             | `#242823`             | lines                                           |
| `primary` / `primary-foreground` | `#0F110F` / `#FAFBF8` | `#EDEFEA` / `#0F110F` | main buttons (ink)                              |
| `brand` / `brand-foreground`     | `#3FA435` / `#0F110F` | same                  | logo green: «Каталог», availability, cart count |
| `brand-text`                     | `#2A7323`             | `#7DD06F`             | green text on neutral background («Співпраця»)  |
| `warning`                        | `#94600A`             | `#E8AE45`             | low stock                                       |
| `ring`                           | `#3FA435` at 45%      | same                  | focus                                           |

Green text on white uses `brand-text`, not `brand`: `#3FA435` on white fails WCAG AA for body text. Text on a green fill is ink (`brand-foreground`).

## Type, shape, icons, motion

- Fonts: Onest for the interface (Cyrillic), JetBrains Mono only for SKUs and codes; both through `next/font`.
- Radii: 8 px for fields and buttons, 10–16 px for cards and panels (`--radius: 0.625rem`).
- Icons: lucide, stroke width 1.75, one system. No brand icons from CDNs.
- Motion: subtle (dropdowns open smoothly, «У кошик» briefly turns into «Додано», cart counter bumps); everything respects `prefers-reduced-motion`.
- Photos: real, on a uniform light background. Without a photo show a neutral panel with the category icon; never drawn products.

## Header (all of it stays)

1. Top bar (desktop): «Україна, м. Харків», about, delivery and payment, returns, gallery, articles, contacts, UA/RU, theme.
2. Main bar: logo, «Каталог» (green) with the catalog menu, search by SKU or name, phone (068) 713-50-49 with copy, Telegram, Viber, map, «Кабінет», cart. Sticky.
3. Category bar (desktop): Завіси, Замки, Ручки, Циліндри, Міжкімнатні механізми, Інше, Двері, «Регіони», «Співпраця».
4. Phone: menu in a side sheet, search on its own row, cabinet and cart as icons.

Planned with the catalog (step 3): mega menu with subcategories and door brands, «Оптовим партнерам» block, search suggestions and the `/` shortcut, cart total and count.

## Accessibility

Skip link to `#content`; visible focus ring; labels on icon buttons; `aria-current` on the active language; dropdowns are native `<details>` until replaced by Radix Navigation Menu.
