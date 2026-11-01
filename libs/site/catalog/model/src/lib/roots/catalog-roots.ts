/**
 * Import roots of the KedrStore catalog and how the site presents them (owner decision 2026-11-01).
 * The whole site sells door hardware, so the «Фурнітура» root is not shown: its sections become the top level,
 * followed by «Двері». Cosmos is internal and never shown (the API already hides it).
 */
export const CATALOG_ROOTS = {
  /** «Фурнітура»: replaced by its children everywhere on the site. */
  hardwareId: 5513,
  /** «Двері»: a top-level section closing the mega menu rail after a divider. */
  doorsId: 7226,
  /** «Космос»: never shown. */
  cosmosId: 920000,
} as const;

/** Categories never shown as their own entry: their page redirects to the catalog hub or is not found. */
export const isHiddenCategoryId = (id: number) =>
  id === CATALOG_ROOTS.hardwareId || id === CATALOG_ROOTS.cosmosId;
