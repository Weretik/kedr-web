# Requirements and scenarios

- **R-001.** Admin uses one design system defined in the app theme: brand green `#3FA435` and ink `#0F110F`, warm neutral grounds, Manrope, 12/18 px radii, soft shadows, and shared motion tokens, in light and dark schemes. Features take values from the theme only.
- **R-002.** Text on the brand green and green text meet 4.5:1 contrast: text on green fills is ink, green text uses the accent text role.
- **R-003.** On desktop (`lg` and up) the navigation can be collapsed to icons and expanded again. Collapsed items keep their accessible names and show the section name on hover or focus. The choice is remembered in the browser and survives a reload; if storage is unavailable the navigation works and starts expanded.
- **R-004.** The active section is marked visually and with `aria-current="page"` in both states.
- **R-005.** The expanded navigation shows the current order position count with a link to checkout. The top bar keeps the existing actions: open navigation (below `lg`), current order with count, notifications, theme, and profile.
- **R-006.** On screens below `lg` the navigation opens as a temporary drawer and does not collapse.
- **R-007.** `prefers-reduced-motion: reduce` turns animations and transitions off.
- **R-008.** Admin is not indexed: the page carries `noindex, nofollow` and `robots.txt` disallows all paths.

## Acceptance scenarios

### SC-001 — Collapse and expand the navigation

**Covers:** R-003, R-004

- Given the manager works on a desktop screen with the navigation expanded
- When they choose «Згорнути меню»
- Then the navigation shows icons only, each section stays reachable by its name, and the current section stays marked
- And after a reload the navigation is still collapsed until they choose «Розгорнути меню».

### SC-002 — Current order from the shell

**Covers:** R-005

- Given the current order has positions
- When the manager looks at the expanded navigation or the top bar
- Then both show the position count and lead to checkout.

### SC-003 — Light and dark themes

**Covers:** R-001, R-002

- Given the manager selects light, dark, or system theme
- When any Admin page is shown
- Then grounds, surfaces, text, logo, and accent follow the selected scheme with readable contrast.

### SC-004 — Small screens

**Covers:** R-006

- Given the screen is narrower than `lg`
- When the manager opens the menu
- Then the full navigation opens over the page and closes after choosing a section.

### SC-005 — Reduced motion and indexing

**Covers:** R-007, R-008

- Given the system asks for reduced motion, or a search engine requests Admin
- When the page loads
- Then nothing animates, and the page is excluded from indexing.
