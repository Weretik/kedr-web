import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MyTasksPage } from './my-tasks-page';

import type { WorkTask } from '@admin/work/model';

const api = vi.hoisted(() => ({
  tasks: vi.fn(),
  report: vi.fn(),
  create: vi.fn(),
  give: vi.fn(),
  move: vi.fn(),
}));

vi.mock('@admin/work/data-access', () => ({
  useGetMyWorkTasksQuery: api.tasks,
  useGetMyWorkReportQuery: api.report,
  useCreateMyWorkTaskMutation: () => [api.create, { isLoading: false }],
  useUpdateMyWorkTaskMutation: () => [vi.fn(), { isLoading: false }],
  useChangeMyWorkTaskStatusMutation: () => [api.move, { isLoading: false }],
  useDeleteMyWorkTaskMutation: () => [vi.fn(), { isLoading: false }],
  useCreateAdminWorkTaskMutation: () => [api.give, { isLoading: false }],
}));

const task: WorkTask = {
  id: 7,
  ownerUserId: 'seo',
  createdByOwner: true,
  title: 'Описи категорії «Петлі»',
  details: null,
  status: 'InProgress',
  result: null,
  createdAt: '2026-11-06T08:00:00Z',
  updatedAt: '2026-11-06T08:00:00Z',
  startedAt: '2026-11-06T08:10:00Z',
  completedAt: null,
};

describe('MyTasksPage', () => {
  beforeEach(() => {
    api.tasks.mockReset().mockReturnValue({ data: [task], isError: false, isLoading: false });
    api.report.mockReset().mockReturnValue({
      data: { activity: [], activityTruncated: false, doneTasks: [], openTasks: [] },
      isError: false,
      isLoading: false,
    });
    api.create.mockReset();
    api.give.mockReset();
    api.move.mockReset();
  });

  it('adds a new task to the plan from the side panel', async () => {
    api.create.mockReturnValue({ unwrap: () => Promise.resolve(task) });
    render(<MyTasksPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Нова задача' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Задача' }), {
      target: { value: 'Мета-описи для «Ручки»' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(api.create).toHaveBeenCalledOnce());
    expect(api.create.mock.calls[0][0]).toEqual({ title: 'Мета-описи для «Ручки»', details: '' });
    expect(await screen.findByText('Задачу додано в «План».')).toBeDefined();
  });

  it('lets an administrator give the new task to another person', async () => {
    api.give.mockReturnValue({ unwrap: () => Promise.resolve(task) });
    render(
      <MyTasksPage
        assignees={{
          selfId: 'admin',
          people: [
            { id: 'admin', name: 'Віталій', roleLabel: 'Адміністратор' },
            { id: 'seo', name: 'Антон', roleLabel: 'SEO-спеціаліст' },
          ],
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Нова задача' }));
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Для кого' }));
    fireEvent.click(screen.getByRole('option', { name: 'Антон · SEO-спеціаліст' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Задача' }), {
      target: { value: 'Тексти для категорії «Замки»' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(api.give).toHaveBeenCalledOnce());
    expect(api.give.mock.calls[0][0]).toEqual({
      ownerUserId: 'seo',
      input: { title: 'Тексти для категорії «Замки»', details: '' },
    });
    expect(api.create).not.toHaveBeenCalled();
    expect(await screen.findByText('Задачу додано в «План»: Антон.')).toBeDefined();
  });

  it('asks what was done before closing a task', async () => {
    api.move.mockReturnValue({ unwrap: () => Promise.resolve(task) });
    render(<MyTasksPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Готово' }));
    expect(api.move).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole('textbox', { name: 'Що зроблено' }), {
      target: { value: 'Написав описи для 12 категорій' },
    });
    const doneButtons = screen.getAllByRole('button', { name: 'Готово' });
    fireEvent.click(doneButtons[doneButtons.length - 1]);

    await waitFor(() => expect(api.move).toHaveBeenCalledOnce());
    expect(api.move.mock.calls[0][0]).toEqual({
      id: 7,
      status: 'Done',
      result: 'Написав описи для 12 категорій',
    });
  });

  it('shows the empty change list for the last 7 days', () => {
    render(<MyTasksPage />);

    expect(screen.getByText('За 7 днів змін в адмінці ще немає.')).toBeDefined();
  });
});
