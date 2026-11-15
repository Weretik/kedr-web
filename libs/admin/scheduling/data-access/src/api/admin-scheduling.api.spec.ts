import { stubApiFetch } from '@admin/shared/api-client/testing';
import { configureStore } from '@reduxjs/toolkit';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { adminSchedulingApi } from './admin-scheduling.api';

const task = {
  key: 'prices',
  name: 'Ціни',
  description: 'Оновлює ціни з 1С.',
  editable: true,
  enabled: false,
  schedule: { kind: 'daily', times: ['06:00'], days: [1] },
  isRunning: false,
  runRequestedAt: '2026-11-15T11:00:00Z',
  lastRunFailed: false,
  overdue: false,
};

vi.mock('@admin/shared/config', async () => ({
  appConfig: (await import('@admin/shared/api-client/testing')).testApiConfig,
}));

afterEach(() => vi.unstubAllGlobals());

describe('adminSchedulingApi', () => {
  it('asks to run a task now with one POST to its address', async () => {
    const requests = stubApiFetch(task);
    const store = configureStore({
      reducer: { [adminSchedulingApi.reducerPath]: adminSchedulingApi.reducer },
      middleware: (getDefault) => getDefault().concat(adminSchedulingApi.middleware),
    });

    const result = await store.dispatch(
      adminSchedulingApi.endpoints.runScheduledTaskNow.initiate('prices'),
    );

    expect(requests).toEqual([
      { method: 'POST', path: '/api/admin/scheduling/tasks/prices/run', body: undefined },
    ]);
    expect(result.data?.runRequestedAt).toBe('2026-11-15T11:00:00Z');
  });
});
