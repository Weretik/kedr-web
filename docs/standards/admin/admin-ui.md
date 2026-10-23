# Admin UI rules

The composition of lists, details, and back links is defined by the [Admin list and detail page standard](list-detail-pages.md).

## Language and components

- Write visible strings, accessible names, empty/error messages, and feature specs in Ukrainian.
- Localize all MUI controls and MUI X Data Grid centrally in `apps/admin/src/app/theme/admin-theme.ts` using the application language. Currently, `materialUkUA` and `dataGridUkUA` are passed to `createTheme`; add missing locale labels there (currently `columnMenuAriaLabel`). `AppProviders` applies this theme to every Admin page. Column headings and custom buttons remain in Ukrainian; do not duplicate `localeText` in each table. The root `apps/admin/index.html` must set `lang="uk"` for the document language and assistive technology.
- Use existing MUI patterns and theme; do not create local design tokens without need.
- Use existing MUI components for complex business controls such as tables, dialogs, selects, and pagination.
- Do not change global styles, theme, or routing for a local feature.

## States and accessibility

- Each screen with server data defines the applicable `loading`, `success`, `empty`, `error`, and `forbidden` states.
- The error state shows a clear message without transport details and an accessible retry action when possible.
- Interactive elements must use semantic HTML, keyboard navigation, visible focus, and an accessible name.
- Icon-only controls need `aria-label` or an existing equivalent.
- Check the layout, light and dark themes, and breakpoints against the theme and component code. Open a browser for verification only after asking the user separately and receiving direct permission for that specific browser check.
