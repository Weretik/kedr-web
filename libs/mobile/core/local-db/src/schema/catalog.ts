import { index, integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/** Categories from the catalog snapshot; the tree is rebuilt from `parentId`. */
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey(),
  parentId: integer('parent_id'),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const priceTypes = sqliteTable('price_types', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
});

/** Products from the catalog snapshot. `id` is the 1C code; photos are URLs, main first. */
export const products = sqliteTable(
  'products',
  {
    id: integer('id').primaryKey(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    categoryId: integer('category_id').notNull(),
    stock: real('stock').notNull(),
    inStock: integer('in_stock', { mode: 'boolean' }).notNull(),
    quantityInPack: integer('quantity_in_pack').notNull(),
    isSale: integer('is_sale', { mode: 'boolean' }).notNull(),
    isNew: integer('is_new', { mode: 'boolean' }).notNull(),
    photos: text('photos', { mode: 'json' }).$type<string[]>().notNull(),
    scheme: text('scheme'),
  },
  (table) => [index('products_category_idx').on(table.categoryId)],
);

/** UAH prices in kopecks, one row per product and price type. */
export const productPrices = sqliteTable(
  'product_prices',
  {
    productId: integer('product_id').notNull(),
    priceTypeId: integer('price_type_id').notNull(),
    amountKopecks: integer('amount_kopecks').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.productId, table.priceTypeId] }),
    index('product_prices_type_idx').on(table.priceTypeId, table.productId, table.amountKopecks),
  ],
);
