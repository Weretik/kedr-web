import {
  categories,
  customerCategoryPriceTypes,
  customers,
  priceTypes,
  productPrices,
  products,
  syncState,
  markLocalDataChanged,
  type LocalDatabase,
} from '@mobile/core/local-db';
import {
  toKopecks,
  toNullableKopecks,
  type CatalogSnapshot,
  type CustomersSnapshot,
  type SyncResource,
} from '@mobile/sync/model';
import { eq } from 'drizzle-orm';

/** SQLite allows 999 bound values per statement on old builds; rows are inserted in chunks below that. */
const maxValuesPerInsert = 900;

type Transaction = Parameters<Parameters<LocalDatabase['transaction']>[0]>[0];

/** Stored ETag and sync time of each resource. */
export function readSyncState(
  db: LocalDatabase,
): Partial<Record<SyncResource, { etag: string; syncedAt: number }>> {
  return Object.fromEntries(
    db
      .select()
      .from(syncState)
      .all()
      .map((row) => [row.resource, { etag: row.etag, syncedAt: row.syncedAt }]),
  );
}

/** Marks a resource as checked now when the server answered `304`. */
export function touchSyncState(db: LocalDatabase, resource: SyncResource, now: number): void {
  db.update(syncState).set({ syncedAt: now }).where(eq(syncState.resource, resource)).run();
}

/**
 * Replaces all catalog tables with the snapshot in one transaction, so screens never see half a catalog
 * (SC-020): readers see the old rows until the commit and the new ones after it.
 */
export function replaceCatalog(
  db: LocalDatabase,
  snapshot: CatalogSnapshot,
  etag: string,
  now: number,
): void {
  db.transaction((tx) => {
    tx.delete(categories).run();
    tx.delete(priceTypes).run();
    tx.delete(products).run();
    tx.delete(productPrices).run();

    insertChunked(tx, categories, snapshot.categories, 4);
    insertChunked(tx, priceTypes, snapshot.priceTypes, 2);
    insertChunked(
      tx,
      products,
      snapshot.products.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        categoryId: product.categoryId,
        stock: product.stock,
        inStock: product.inStock,
        quantityInPack: product.quantityInPack,
        isSale: product.isSale,
        isNew: product.isNew,
        photos: product.photos,
        scheme: product.scheme,
      })),
      11,
    );
    insertChunked(
      tx,
      productPrices,
      snapshot.products.flatMap((product) =>
        product.prices.map((price) => ({
          productId: product.id,
          priceTypeId: price.priceTypeId,
          amountKopecks: toKopecks(price.amount),
        })),
      ),
      3,
    );
    saveSyncState(tx, 'catalog', etag, now);
  });
  markLocalDataChanged('catalog');
}

/** Replaces the customers and their price rules in one transaction. */
export function replaceCustomers(
  db: LocalDatabase,
  snapshot: CustomersSnapshot,
  etag: string,
  now: number,
): void {
  db.transaction((tx) => {
    tx.delete(customers).run();
    tx.delete(customerCategoryPriceTypes).run();

    insertChunked(
      tx,
      customers,
      snapshot.customers.map((customer) => ({
        counterpartyId: customer.counterpartyId,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        defaultPriceTypeId: customer.defaultPriceTypeId,
        debtKopecks: toNullableKopecks(customer.debt),
        balanceKopecks: toNullableKopecks(customer.balance),
      })),
      7,
    );
    insertChunked(
      tx,
      customerCategoryPriceTypes,
      snapshot.customers.flatMap((customer) =>
        customer.categoryPriceTypes.map((rule) => ({
          counterpartyId: customer.counterpartyId,
          categoryId: rule.categoryId,
          priceTypeId: rule.priceTypeId,
        })),
      ),
      3,
    );
    saveSyncState(tx, 'customers', etag, now);
  });
  markLocalDataChanged('customers');
}

function saveSyncState(tx: Transaction, resource: SyncResource, etag: string, now: number): void {
  tx.insert(syncState)
    .values({ resource, etag, syncedAt: now })
    .onConflictDoUpdate({ target: syncState.resource, set: { etag, syncedAt: now } })
    .run();
}

function insertChunked<TTable extends Parameters<Transaction['insert']>[0]>(
  tx: Transaction,
  table: TTable,
  rows: TTable['$inferInsert'][],
  columns: number,
): void {
  const size = Math.max(1, Math.floor(maxValuesPerInsert / columns));
  for (let start = 0; start < rows.length; start += size) {
    tx.insert(table)
      .values(rows.slice(start, start + size))
      .run();
  }
}
