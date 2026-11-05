import { customers, productPrices, products, type LocalDatabase } from '@mobile/core/local-db';
import { createTestLocalDatabase } from '@mobile/core/local-db/testing';

import { syncAll } from './sync-runner';
import { readSyncState } from '../store/snapshot-store';

import type { SnapshotFetcher, SnapshotResponse } from '../client/snapshot-client';
import type { CatalogSnapshot, CustomersSnapshot } from '@mobile/sync/model';

const catalog = (amount: number): CatalogSnapshot => ({
  version: `v-${amount}`,
  generatedAt: '2026-11-05T09:00:00Z',
  retailPriceTypeId: 12,
  priceTypes: [{ id: 12, name: 'Роздрібна' }],
  categories: [{ id: 1, parentId: null, name: 'Замки', sortOrder: 0 }],
  products: [
    {
      id: 20,
      slug: 'zamok',
      name: 'Замок',
      categoryId: 1,
      stock: 5,
      inStock: true,
      quantityInPack: 1,
      isSale: false,
      isNew: false,
      photos: ['https://cdn/a.webp'],
      scheme: null,
      prices: [{ priceTypeId: 12, amount }],
    },
  ],
});

const customersSnapshot: CustomersSnapshot = {
  version: 'c-1',
  generatedAt: '2026-11-05T09:00:00Z',
  customers: [
    {
      counterpartyId: 'c-1',
      name: 'ТОВ Альфа',
      phone: null,
      email: 'a@x',
      defaultPriceTypeId: 12,
      categoryPriceTypes: [{ categoryId: 1, priceTypeId: 14 }],
      debt: null,
      balance: null,
    },
  ],
};

function server(answers: Partial<Record<'catalog' | 'customers', SnapshotResponse>>) {
  const calls: { resource: string; etag: string | null }[] = [];
  const fetch: SnapshotFetcher = async (resource, etag) => {
    calls.push({ resource, etag });
    return answers[resource] ?? { kind: 'not-modified' };
  };
  return { calls, fetch };
}

describe('syncAll', () => {
  let db: LocalDatabase;
  beforeEach(() => {
    db = createTestLocalDatabase();
  });

  it('stores both snapshots with prices in kopecks and remembers their ETags', async () => {
    const { fetch } = server({
      catalog: { kind: 'updated', etag: '"cat-1"', body: catalog(150.5) },
      customers: { kind: 'updated', etag: '"cus-1"', body: customersSnapshot },
    });

    const outcomes = await syncAll({ db, fetchSnapshot: fetch, now: () => 1000 });

    expect(outcomes.map((outcome) => outcome.kind)).toEqual(['updated', 'updated']);
    expect(db.select().from(products).all()).toHaveLength(1);
    expect(db.select().from(productPrices).get()?.amountKopecks).toBe(15050);
    expect(db.select().from(customers).get()?.name).toBe('ТОВ Альфа');
    expect(readSyncState(db)).toEqual({
      catalog: { etag: '"cat-1"', syncedAt: 1000 },
      customers: { etag: '"cus-1"', syncedAt: 1000 },
    });
  });

  it('sends the stored ETag and keeps the data on 304', async () => {
    const first = server({
      catalog: { kind: 'updated', etag: '"cat-1"', body: catalog(100) },
      customers: { kind: 'updated', etag: '"cus-1"', body: customersSnapshot },
    });
    await syncAll({ db, fetchSnapshot: first.fetch, now: () => 1000 });

    const second = server({});
    const outcomes = await syncAll({ db, fetchSnapshot: second.fetch, now: () => 2000 });

    expect(second.calls).toEqual([
      { resource: 'catalog', etag: '"cat-1"' },
      { resource: 'customers', etag: '"cus-1"' },
    ]);
    expect(outcomes.map((outcome) => outcome.kind)).toEqual(['not-modified', 'not-modified']);
    expect(db.select().from(productPrices).get()?.amountKopecks).toBe(10000);
    expect(readSyncState(db).catalog?.syncedAt).toBe(2000);
  });

  it('replaces the whole catalog when a price changes', async () => {
    const first = server({ catalog: { kind: 'updated', etag: '"a"', body: catalog(100) } });
    await syncAll({ db, fetchSnapshot: first.fetch, now: () => 1 });
    const second = server({ catalog: { kind: 'updated', etag: '"b"', body: catalog(120) } });

    await syncAll({ db, fetchSnapshot: second.fetch, now: () => 2 });

    expect(db.select().from(productPrices).all()).toEqual([
      { productId: 20, priceTypeId: 12, amountKopecks: 12000 },
    ]);
  });

  it('keeps old data when the snapshot is invalid and still syncs the other resource', async () => {
    const first = server({ catalog: { kind: 'updated', etag: '"a"', body: catalog(100) } });
    await syncAll({ db, fetchSnapshot: first.fetch, now: () => 1 });
    const broken = server({
      catalog: { kind: 'updated', etag: '"b"', body: { products: 'nope' } },
      customers: { kind: 'updated', etag: '"c"', body: customersSnapshot },
    });

    const outcomes = await syncAll({ db, fetchSnapshot: broken.fetch, now: () => 2 });

    expect(outcomes[0]).toEqual({ resource: 'catalog', kind: 'failed', reason: 'invalid-data' });
    expect(outcomes[1].kind).toBe('updated');
    expect(db.select().from(productPrices).get()?.amountKopecks).toBe(10000);
  });

  it('stops after an unauthorized answer', async () => {
    const { calls, fetch } = server({ catalog: { kind: 'failed', reason: 'unauthorized' } });

    const outcomes = await syncAll({ db, fetchSnapshot: fetch, now: () => 1 });

    expect(calls).toHaveLength(1);
    expect(outcomes).toEqual([{ resource: 'catalog', kind: 'failed', reason: 'unauthorized' }]);
  });
});
