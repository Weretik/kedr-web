import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BackgroundTaskPage } from './background-task-page';
import { outboxTask, pricesTask, stocksTask } from './background-tasks-fixtures';

const api = vi.hoisted(() => ({ list: vi.fn(), runs: vi.fn(), run: vi.fn() }));

vi.mock('@admin/scheduling/data-access', () => ({
  useGetScheduledTasksQuery: api.list,
  useGetScheduledTaskRunsQuery: api.runs,
  useRunScheduledTaskNowMutation: () => [api.run, { isLoading: false }],
  useUpdateScheduledTaskScheduleMutation: () => [vi.fn(), { isLoading: false }],
}));

const renderTask = (key: string) =>
  render(
    <MemoryRouter initialEntries={[`/background-tasks/${key}`]}>
      <Routes>
        <Route element={<BackgroundTaskPage />} path="/background-tasks/:key" />
      </Routes>
    </MemoryRouter>,
  );

describe('BackgroundTaskPage', () => {
  beforeEach(() => {
    api.list.mockReset().mockReturnValue({
      data: [outboxTask, stocksTask, pricesTask],
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    });
    api.runs.mockReset().mockReturnValue({
      data: [
        {
          id: '0193',
          trigger: 'manual',
          requestedBy: 'admin@classkedr.com.ua',
          claimedAt: '2026-11-15T04:00:00Z',
          startedAt: '2026-11-15T04:01:00Z',
          finishedAt: '2026-11-15T04:02:00Z',
          outcome: 'failed',
          message: 'Таблицю не прочитано.',
        },
      ],
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    });
    api.run.mockReset();
  });

  it('shows the task read-only with the last failure and its history', () => {
    renderTask('prices');

    expect(screen.getByRole('heading', { level: 1, name: 'Ціни' })).toBeDefined();
    expect(screen.getByText('Ще не було')).toBeDefined();
    expect(screen.getAllByText('Таблицю не прочитано.')).toHaveLength(2);
    expect(screen.getByText('Вручну · admin@classkedr.com.ua')).toBeDefined();
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('asks to run the task now and says when it will start', async () => {
    api.run.mockReturnValue({ unwrap: () => Promise.resolve(stocksTask) });
    renderTask('stocks');

    fireEvent.click(screen.getByRole('button', { name: 'Запустити зараз' }));

    await waitFor(() =>
      expect(screen.getByText(/задача почнеться протягом хвилини/)).toBeDefined(),
    );
    expect(api.run).toHaveBeenCalledWith('stocks');
  });

  it('shows the backend reason when the run is refused', async () => {
    api.run.mockReturnValue({
      unwrap: () =>
        Promise.reject({ code: 'Unknown', status: 409, message: 'Запуск уже заплановано.' }),
    });
    renderTask('stocks');

    fireEvent.click(screen.getByRole('button', { name: 'Запустити зараз' }));

    await waitFor(() => expect(screen.getByText('Запуск уже заплановано.')).toBeDefined());
  });

  it('offers neither run nor edit for the outbox', () => {
    renderTask('outbox');

    expect(screen.queryByRole('button', { name: 'Запустити зараз' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Редагувати' })).toBeNull();
    expect(screen.getByText('Щохвилини · не змінюється')).toBeDefined();
  });
});
