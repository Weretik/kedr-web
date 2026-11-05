/**
 * Schema changes in order. Entry N moves the database from `user_version` N to N + 1; never edit an entry that has
 * shipped, add a new one. Each must match the Drizzle tables in `../schema` (checked by `local-db.spec.ts`).
 */
export const migrations: readonly (readonly string[])[] = [
  [
    `CREATE TABLE categories (
      id INTEGER PRIMARY KEY NOT NULL,
      parent_id INTEGER,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    )`,
    `CREATE TABLE price_types (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    )`,
    `CREATE TABLE products (
      id INTEGER PRIMARY KEY NOT NULL,
      slug TEXT NOT NULL,
      name TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      stock REAL NOT NULL,
      in_stock INTEGER NOT NULL,
      quantity_in_pack INTEGER NOT NULL,
      is_sale INTEGER NOT NULL,
      is_new INTEGER NOT NULL,
      photos TEXT NOT NULL,
      scheme TEXT
    )`,
    `CREATE INDEX products_category_idx ON products (category_id)`,
    `CREATE TABLE product_prices (
      product_id INTEGER NOT NULL,
      price_type_id INTEGER NOT NULL,
      amount_kopecks INTEGER NOT NULL,
      PRIMARY KEY (product_id, price_type_id)
    )`,
    `CREATE TABLE customers (
      counterparty_id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT NOT NULL,
      default_price_type_id INTEGER NOT NULL,
      debt_kopecks INTEGER,
      balance_kopecks INTEGER
    )`,
    `CREATE TABLE customer_category_price_types (
      counterparty_id TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      price_type_id INTEGER NOT NULL,
      PRIMARY KEY (counterparty_id, category_id)
    )`,
    `CREATE TABLE sync_state (
      resource TEXT PRIMARY KEY NOT NULL,
      etag TEXT NOT NULL,
      synced_at INTEGER NOT NULL
    )`,
  ],
];
