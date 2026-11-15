import { stubApiFetch } from '@admin/shared/api-client/testing';
import { configureStore } from '@reduxjs/toolkit';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { adminSiteRefreshApi } from './admin-site-refresh.api';

vi.mock('@admin/shared/config', async () => ({
  appConfig: (await import('@admin/shared/api-client/testing')).testApiConfig,
}));

afterEach(() => vi.unstubAllGlobals());

describe('adminSiteRefreshApi', () => {
  it('asks the site to refresh with one POST', async () => {
    const requests = stubApiFetch({ status: 'refreshed' });
    const store = configureStore({
      reducer: { [adminSiteRefreshApi.reducerPath]: adminSiteRefreshApi.reducer },
      middleware: (getDefault) => getDefault().concat(adminSiteRefreshApi.middleware),
    });

    const result = await store.dispatch(adminSiteRefreshApi.endpoints.refreshSite.initiate());

    expect(requests).toEqual([
      { method: 'POST', path: '/api/admin/content/site-refresh', body: undefined },
    ]);
    expect(result.data).toEqual({ status: 'refreshed' });
  });
});
