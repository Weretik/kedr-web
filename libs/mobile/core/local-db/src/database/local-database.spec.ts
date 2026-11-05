import { sql } from 'drizzle-orm';

import { migrations } from '../migrations/migrations';
import { categories, customers, productPrices, products, syncState } from '../schema';
import { createTestLocalDatabase } from '../testing';
import { migrateLocalDatabase, wipeLocalDatabase } from './local-database';

describe('local database', () => {
  it('migrates to the latest version and the Drizzle tables match the SQL', () => {
    const db = createTestLocalDatabase();

    expect(db.get<{ user_version: number }>(sql`PRAGMA user_version`)?.user_version).toBe(
      migrations.length,
    );

    db.insert(categories).values({ id: 1, parentId: null, name: 'Замки', sortOrder: 0 }).run();
    db.insert(products)
      .values({
        id: 20,
        slug: 'zamok',
        name: 'Замок',
        categoryId: 1,
        stock: 5,
        inStock: true,
        quantityInPack: 1,
        isSale: false,
        isNew: true,
        photos: ['https://cdn/a.webp'],
        scheme: null,
      })
      .run();
    db.insert(productPrices).values({ productId: 20, priceTypeId: 12, amountKopecks: 15050 }).run();

    const product = db.select().from(products).get();
    expect(product).toMatchObject({
      id: 20,
      inStock: true,
      isNew: true,
      photos: ['https://cdn/a.webp'],
    });
    expect(db.select().from(productPrices).get()?.amountKopecks).toBe(15050);
  });

  it('runs again without changes', () => {
    const db = createTestLocalDatabase();

    expect(() => migrateLocalDatabase(db)).not.toThrow();
  });

  it('wipes every data table', () => {
    const db = createTestLocalDatabase();
    db.insert(customers)
      .values({ counterpartyId: 'c-1', name: 'Альфа', email: 'a@x', defaultPriceTypeId: 12 })
      .run();
    db.insert(syncState).values({ resource: 'customers', etag: '"a"', syncedAt: 1 }).run();

    wipeLocalDatabase(db);

    expect(db.select().from(customers).all()).toEqual([]);
    expect(db.select().from(syncState).all()).toEqual([]);
  });
});
