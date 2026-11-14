import { configureStore } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query';
import { describe, expect, it, vi } from 'vitest';

const requests = vi.hoisted(() => [] as unknown[]);

vi.mock('@admin/shared/api-client', () => ({
  baseApi: createApi({
    reducerPath: 'adminApi',
    baseQuery: (request: unknown) => {
      requests.push(request);
      return { data: { refreshed: true } };
    },
    endpoints: () => ({}),
  }),
}));

describe('adminSiteRefreshApi', () => {
  it('asks the site to refresh with one POST', async () => {
    const { adminSiteRefreshApi } = await import('./admin-site-refresh.api');
    const store = configureStore({
      reducer: { [adminSiteRefreshApi.reducerPath]: adminSiteRefreshApi.reducer },
      middleware: (getDefault) => getDefault().concat(adminSiteRefreshApi.middleware),
    });

    await store.dispatch(adminSiteRefreshApi.endpoints.refreshSite.initiate());

    expect(requests).toEqual([{ url: '/api/admin/content/site-refresh', method: 'POST' }]);
  });
});
