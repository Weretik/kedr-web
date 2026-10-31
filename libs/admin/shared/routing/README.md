# admin-shared-routing

Router integration for MUI in Admin. `LinkBehavior` makes MUI links and `href` buttons navigate through React Router, so `ui` and `shared/ui` libraries render plain `href` links without importing the router. See the [code organization rules](../../../../docs/standards/admin/admin-code-organization.md#pages-routes-and-links).

- `routerLinkComponents` — theme `components` entries; the Admin theme spreads them, and page tests pass them to `createTheme` when they render pages without the app.
- `LinkBehavior` — the link component itself; external, new-tab, and download links stay plain anchors.

Only the Admin app theme and tests use this library; presentational code passes `href`.
