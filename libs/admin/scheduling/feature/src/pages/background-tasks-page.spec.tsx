import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { outboxTask, pricesTask, stocksTask } from './background-tasks-fixtures';
import { BackgroundTasksPage } from './background-tasks-page';

const api = vi.hoisted(() => ({ list: vi.fn(), update: vi.fn() }));

vi.mock('@admin/scheduling/data-access', () => ({
  useGetScheduledTasksQuery: api.list,
  useUpdateScheduledTaskScheduleMutation: () => [api.update, { isLoading: false }],
}));

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/background-tasks']}>
      <Routes>
        <Route element={<BackgroundTasksPage />} path="/background-tasks" />
        <Route element={<p>Сторінка задачі</p>} path="/background-tasks/:key" />
      </Routes>
    </MemoryRouter>,
  );

const row = (name: string) => screen.getByText(name).closest('tr') as HTMLElement;

describe('BackgroundTasksPage', () => {
  beforeEach(() => {
    api.list.mockReset().mockReturnValue({
      data: [outboxTask, stocksTask, pricesTask],
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    });
    api.update.mockReset();
  });

  it('lists every task with its schedule and marks only problems', () => {
    renderPage();

    expect(within(row('Залишки')).getByText('Щодня о 07:00, 13:00')).toBeDefined();
    expect(within(row('Залишки')).queryByText('Вимкнено')).toBeNull();
    expect(within(row('Ціни')).getByText('Остання спроба з помилкою')).toBeDefined();
    expect(within(row('Ціни')).getByText('Вимкнено')).toBeDefined();
    expect(within(row('Ціни')).getByText('Таблицю не прочитано.')).toBeDefined();
    expect(screen.getByText(/Потребують уваги: 1\./)).toBeDefined();
  });

  it('has no pencil for the outbox and opens a task by the eye', () => {
    renderPage();

    expect(
      within(row('Досилання повідомлень')).queryByRole('button', { name: /Змінити розклад/ }),
    ).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути задачу Залишки' }));
    expect(screen.getByText('Сторінка задачі')).toBeDefined();
  });

  it('checks the schedule in the side panel before saving it', async () => {
    api.update.mockReturnValue({ unwrap: () => Promise.resolve(stocksTask) });
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Змінити розклад задачі Залишки' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Через інтервал' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Кожні, хвилин' }), {
      target: { value: '2' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(screen.getByText('Інтервал від 5 до 1440 хвилин.')).toBeDefined();
    expect(api.update).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole('textbox', { name: 'Кожні, хвилин' }), {
      target: { value: '30' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(screen.getByText('Розклад збережено.')).toBeDefined());
    expect(api.update).toHaveBeenCalledWith({
      key: 'stocks',
      input: {
        enabled: true,
        schedule: {
          kind: 'interval',
          everyMinutes: 30,
          fromHour: null,
          toHour: null,
          times: [],
          days: [],
        },
        nextRunAt: null,
      },
    });
  });
});
