import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/** Customers from the customers snapshot. Debt and balance stay null until 1C sends them. */
export const customers = sqliteTable('customers', {
  counterpartyId: text('counterparty_id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email').notNull(),
  defaultPriceTypeId: integer('default_price_type_id').notNull(),
  debtKopecks: integer('debt_kopecks'),
  balanceKopecks: integer('balance_kopecks'),
});

/** A customer's price type for a category; the nearest rule up the category tree wins. */
export const customerCategoryPriceTypes = sqliteTable(
  'customer_category_price_types',
  {
    counterpartyId: text('counterparty_id').notNull(),
    categoryId: integer('category_id').notNull(),
    priceTypeId: integer('price_type_id').notNull(),
  },
  (table) => [primaryKey({ columns: [table.counterpartyId, table.categoryId] })],
);
