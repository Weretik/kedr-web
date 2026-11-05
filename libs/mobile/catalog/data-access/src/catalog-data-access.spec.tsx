import {
  categories,
  customerCategoryPriceTypes,
  customers,
  LocalDatabaseProvider,
  productPrices,
  products,
  syncState,
  type LocalDatabase,
} from '@mobile/core/local-db';
import { createTestLocalDatabase } from '@mobile/core/local-db/testing';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useAllPhotosDownload, useEssentialPhotoDownload } from './hooks/use-photo-downloads';
import { downloadImages, type ImageCacheDriver } from './media/image-cache';
import { usePhotoDownloadStore } from './media/photo-download-store';
import {
  readCustomerPricing,
  readPricedProduct,
  readPricedProducts,
} from './queries/catalog-queries';

import type { ReactNode } from 'react';

const base = { isNew: false, isSale: false, quantityInPack: 1, slug: 'p' };

function seed(): LocalDatabase {
  const db = createTestLocalDatabase();
  db.insert(categories)
    .values([
      { id: 10, name: 'Ручки', parentId: null, sortOrder: 0 },
      { id: 11, name: 'На розетці', parentId: 10, sortOrder: 0 },
      { id: 20, name: 'Замки', parentId: null, sortOrder: 1 },
    ])
    .run();
  db.insert(products)
    .values([
      {
        ...base,
        categoryId: 11,
        id: 101,
        inStock: true,
        name: 'Ручка',
        photos: ['a.jpg', 'b.jpg'],
        scheme: 's.png',
        stock: 4,
      },
      {
        ...base,
        categoryId: 20,
        id: 201,
        inStock: false,
        name: 'Замок',
        photos: ['c.jpg'],
        scheme: null,
        stock: 0,
      },
    ])
    .run();
  db.insert(productPrices)
    .values([
      { amountKopecks: 10_000, priceTypeId: 2, productId: 101 },
      { amountKopecks: 20_000, priceTypeId: 3, productId: 101 },
      { amountKopecks: 30_000, priceTypeId: 2, productId: 201 },
    ])
    .run();
  db.insert(customers)
    .values({ counterpartyId: 'c-1', defaultPriceTypeId: 2, email: 'a@x', name: 'Альфа' })
    .run();
  db.insert(customerCategoryPriceTypes)
    .values({ categoryId: 10, counterpartyId: 'c-1', priceTypeId: 3 })
    .run();
  db.insert(syncState).values({ etag: '"v1"', resource: 'catalog', syncedAt: 1 }).run();
  return db;
}

function wrapperFor(db: LocalDatabase) {
  return function DatabaseWrapper({ children }: { children: ReactNode }) {
    return <LocalDatabaseProvider database={db}>{children}</LocalDatabaseProvider>;
  };
}

describe('catalog queries (SC-006)', () => {
  it('prices products by the customer rule of a parent category and the default elsewhere', () => {
    const db = seed();
    const pricing = readCustomerPricing(db, 'c-1');

    expect(readPricedProducts(db, pricing).map((p) => [p.id, p.priceKopecks])).toEqual([
      [101, 20_000],
      [201, 30_000],
    ]);
    expect(readPricedProduct(db, 101, null)?.priceKopecks).toBeNull();
    expect(readCustomerPricing(db, 'missing')).toBeNull();
  });
});

describe('photo downloads (SC-010)', () => {
  beforeEach(async () => {
    await act(async () => usePhotoDownloadStore.getState().reset());
  });

  it('downloads in batches and counts failed ones', async () => {
    const driver: ImageCacheDriver = { prefetch: jest.fn(async (urls) => !urls.includes('bad')) };
    const urls = [...Array.from({ length: 25 }, (_, i) => `${i}.jpg`), 'bad'];

    const result = await downloadImages(urls, driver, () => undefined);

    expect(driver.prefetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ done: 26, failedBatches: 1, total: 26 });
  });

  it('keeps main photos and schemes on Wi‑Fi once per catalog version, never on mobile data', async () => {
    const db = seed();
    const driver: ImageCacheDriver = { prefetch: jest.fn(async () => true) };

    const metered = await renderHook(() => useEssentialPhotoDownload(false, driver), {
      wrapper: wrapperFor(db),
    });
    expect(driver.prefetch).not.toHaveBeenCalled();
    await metered.unmount();

    await renderHook(() => useEssentialPhotoDownload(true, driver), { wrapper: wrapperFor(db) });
    await waitFor(() => expect(usePhotoDownloadStore.getState().essentialVersion).toBe('"v1"'));
    expect(driver.prefetch).toHaveBeenCalledWith(['a.jpg', 's.png', 'c.jpg']);
  });

  it('downloads every photo on request and remembers the catalog version', async () => {
    const db = seed();
    const driver: ImageCacheDriver = { prefetch: jest.fn(async () => true) };
    const { result } = await renderHook(() => useAllPhotosDownload(driver), {
      wrapper: wrapperFor(db),
    });

    await act(async () => result.current.start());

    await waitFor(() => expect(result.current.isComplete).toBe(true));
    expect(result.current).toMatchObject({ done: 4, status: 'done', total: 4 });
  });
});
