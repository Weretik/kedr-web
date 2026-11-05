import {
  catalogSnapshotSchema,
  customersSnapshotSchema,
  isStale,
  oldestSyncedAt,
  staleAfterMs,
  toKopecks,
} from './index';

describe('sync model', () => {
  it('drops fields the app does not know', () => {
    const snapshot = customersSnapshotSchema.parse({
      version: 'v1',
      generatedAt: '2026-11-05T09:00:00Z',
      customers: [
        {
          counterpartyId: 'c-1',
          name: 'Альфа',
          phone: null,
          email: 'a@x',
          defaultPriceTypeId: 12,
          categoryPriceTypes: [],
          debt: null,
          balance: null,
          newField: true,
        },
      ],
    });

    expect(snapshot.customers[0]).not.toHaveProperty('newField');
  });

  it('rejects a product without prices list', () => {
    const result = catalogSnapshotSchema.safeParse({
      version: 'v1',
      generatedAt: '2026-11-05T09:00:00Z',
      retailPriceTypeId: 12,
      priceTypes: [],
      categories: [],
      products: [{ id: 1, slug: 's', name: 'n', categoryId: 1 }],
    });

    expect(result.success).toBe(false);
  });

  it('stores amounts as whole kopecks', () => {
    expect(toKopecks(150.5)).toBe(15050);
    expect(toKopecks(0.1 + 0.2)).toBe(30);
  });

  it('knows the sync time only when every resource is stored', () => {
    expect(oldestSyncedAt({ catalog: 10 })).toBeNull();
    expect(oldestSyncedAt({ catalog: 10, customers: 5 })).toBe(5);
  });

  it('marks data stale after an hour or when never synced', () => {
    expect(isStale(null, 0)).toBe(true);
    expect(isStale(0, staleAfterMs)).toBe(false);
    expect(isStale(0, staleAfterMs + 1)).toBe(true);
  });
});
