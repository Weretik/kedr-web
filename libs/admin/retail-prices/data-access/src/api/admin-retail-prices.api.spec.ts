import { stubApiFetch } from '@admin/shared/api-client/testing';
import { configureStore } from '@reduxjs/toolkit';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { adminRetailPricesApi } from './admin-retail-prices.api';

vi.mock('@admin/shared/config', async () => ({
  appConfig: (await import('@admin/shared/api-client/testing')).testApiConfig,
}));

// The form itself is checked through the serializer: jsdom's FormData does not survive a Node `Request` on every
// Node version, so the test does not parse the request body.
const forms = vi.hoisted(() => [] as FormData[]);
vi.mock('@admin/shared/api-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@admin/shared/api-client')>();
  return {
    ...actual,
    formDataBody: (fields: Parameters<typeof actual.formDataBody>[0]) => {
      const form = actual.formDataBody(fields);
      forms.push(form.bodySerializer(form.body));
      return form;
    },
  };
});

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
    const requests: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (request: Request) => {
        requests.push(`${request.method} ${new URL(request.url).pathname}`);
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
    expect(requests).toEqual(['POST /api/admin/retail-prices/import']);
    expect(forms.at(-1)?.get('file')).toBe(file);
    expect(forms.at(-1)?.get('protectFromOneC')).toBe('false');
  });

  it('gives the prices back to 1C with one POST', async () => {
    const requests = stubApiFetch({ ...status, lockedCount: 0 });

    await createStore().dispatch(adminRetailPricesApi.endpoints.unlockRetailPrices.initiate());

    expect(requests).toEqual([
      { method: 'POST', path: '/api/admin/retail-prices/unlock', body: undefined },
    ]);
  });
});
