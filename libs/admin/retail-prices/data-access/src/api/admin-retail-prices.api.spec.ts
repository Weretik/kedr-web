import { stubApiFetch } from '@admin/shared/api-client/testing';
import { configureStore } from '@reduxjs/toolkit';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { adminRetailPricesApi } from './admin-retail-prices.api';

vi.mock('@admin/shared/config', async () => ({
  appConfig: (await import('@admin/shared/api-client/testing')).testApiConfig,
}));

afterEach(() => vi.unstubAllGlobals());

const status = {
  priceTypeId: 11,
  priceTypeName: 'Розница халтмаг 30%',
  lockedCount: 2,
  lastLockedAt: null,
};

const createStore = () =>
  configureStore({
    reducer: { [adminRetailPricesApi.reducerPath]: adminRetailPricesApi.reducer },
    middleware: (getDefault) => getDefault().concat(adminRetailPricesApi.middleware),
  });

describe('adminRetailPricesApi', () => {
  it('reads the retail price status', async () => {
    const requests = stubApiFetch(status);

    const result = await createStore().dispatch(
      adminRetailPricesApi.endpoints.getRetailPriceStatus.initiate(),
    );

    expect(requests).toEqual([
      { method: 'GET', path: '/api/admin/retail-prices', body: undefined },
    ]);
    expect(result.data).toEqual(status);
  });

  it('sends the file and the 1C flag as a form', async () => {
    const sent: FormData[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (request: Request) => {
        sent.push(await request.formData());
        return new Response(JSON.stringify({ changed: 1, status }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }),
    );
    const file = new File(['xlsx'], 'Цены_26.11.xlsx');

    const result = await createStore().dispatch(
      adminRetailPricesApi.endpoints.importRetailPrices.initiate({ file, protectFromOneC: false }),
    );

    expect(result.data).toEqual({ changed: 1, status });
    expect(await (sent[0].get('file') as Blob).text()).toBe('xlsx');
    expect(sent[0].get('protectFromOneC')).toBe('false');
  });

  it('gives the prices back to 1C with one POST', async () => {
    const requests = stubApiFetch({ ...status, lockedCount: 0 });

    await createStore().dispatch(adminRetailPricesApi.endpoints.unlockRetailPrices.initiate());

    expect(requests).toEqual([
      { method: 'POST', path: '/api/admin/retail-prices/unlock', body: undefined },
    ]);
  });
});
