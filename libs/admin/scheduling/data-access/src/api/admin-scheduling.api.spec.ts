import { configureStore } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query';
import { describe, expect, it, vi } from 'vitest';

const requests = vi.hoisted(() => [] as unknown[]);

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

vi.mock('@admin/shared/api-client', () => ({
  baseApi: createApi({
    reducerPath: 'adminApi',
    baseQuery: (request: unknown) => {
      requests.push(request);
      return { data: task };
    },
    endpoints: () => ({}),
  }),
}));

describe('adminSchedulingApi', () => {
  it('asks to run a task now with one POST to its address', async () => {
    const { adminSchedulingApi } = await import('./admin-scheduling.api');
    const store = configureStore({
      reducer: { [adminSchedulingApi.reducerPath]: adminSchedulingApi.reducer },
      middleware: (getDefault) => getDefault().concat(adminSchedulingApi.middleware),
    });

    const result = await store.dispatch(
      adminSchedulingApi.endpoints.runScheduledTaskNow.initiate('prices'),
    );

    expect(requests).toEqual([{ url: '/api/admin/scheduling/tasks/prices/run', method: 'POST' }]);
    expect(result.data?.runRequestedAt).toBe('2026-11-15T11:00:00Z');
  });
});
