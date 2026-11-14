import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useMyTasksBoard } from './use-my-tasks-board';

import type { WorkTask } from '@admin/work/model';

const api = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  give: vi.fn(),
  move: vi.fn(),
  remove: vi.fn(),
  step: vi.fn(),
}));

vi.mock('@admin/work/data-access', () => ({
  useGetMyWorkTasksQuery: () => ({ data: [], isError: false, isLoading: false }),
  useCreateMyWorkTaskMutation: () => [api.create, { isLoading: false }],
  useUpdateMyWorkTaskMutation: () => [api.update, { isLoading: false }],
  useChangeMyWorkTaskStatusMutation: () => [api.move, { isLoading: false }],
  useDeleteMyWorkTaskMutation: () => [api.remove, { isLoading: false }],
  useCreateAdminWorkTaskMutation: () => [api.give, { isLoading: false }],
  useSetMyWorkTaskStepMutation: () => [api.step, { isLoading: false }],
}));

const task = { id: 7, title: 'Описи', createdByOwner: true } as WorkTask;
const input = { title: 'Нова', details: '', dueDate: '', steps: [] };
const ok = () => ({ unwrap: () => Promise.resolve() });
const fail = () => ({ unwrap: () => Promise.reject(new Error('boom')) });

const setup = (assignees: Parameters<typeof useMyTasksBoard>[0]['assignees'] = null) => {
  const onNotice = vi.fn();
  const onCreatingChange = vi.fn();
  const hook = renderHook(
    ({ creating }) => useMyTasksBoard({ assignees, creating, onCreatingChange, onNotice }),
    { initialProps: { creating: false } },
  );
  return { ...hook, onNotice, onCreatingChange };
};

describe('useMyTasksBoard', () => {
  beforeEach(() => {
    for (const mock of Object.values(api)) mock.mockReset().mockImplementation(ok);
  });

  it('opens the new-task panel while the page asks to create', () => {
    const { result, rerender } = setup();
    expect(result.current.current).toBeNull();
    rerender({ creating: true });
    expect(result.current.current).toEqual({ kind: 'new' });
  });

  it('saves an edited task, closes the panel, and reports it', async () => {
    const { result, onNotice } = setup();
    act(() => result.current.edit(task));
    expect(result.current.current).toEqual({ kind: 'edit', task });

    act(() => result.current.save(input));

    await waitFor(() => expect(onNotice).toHaveBeenCalledWith('Задачу збережено.'));
    expect(api.update).toHaveBeenCalledWith({ id: 7, input });
    expect(result.current.current).toBeNull();
  });

  it('gives a new task to another person named in the notice', async () => {
    const assignees = {
      selfId: 'me',
      people: [
        { id: 'me', name: 'Я' },
        { id: 'olha', name: 'Ольга' },
      ],
    };
    const { result, rerender, onNotice } = setup(assignees);
    rerender({ creating: true });
    act(() => result.current.setAssigneeId('olha'));

    act(() => result.current.save(input));

    await waitFor(() => expect(onNotice).toHaveBeenCalledWith('Задачу додано в «План»: Ольга.'));
    expect(api.give).toHaveBeenCalledWith({ ownerUserId: 'olha', input });
    expect(api.create).not.toHaveBeenCalled();
  });

  it('keeps the panel open with the error when saving fails', async () => {
    api.create.mockImplementation(fail);
    const { result, rerender, onNotice } = setup();
    rerender({ creating: true });

    act(() => result.current.save(input));

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(onNotice).not.toHaveBeenCalled();
  });

  it('asks for the result before moving a task to Done', async () => {
    const { result, onNotice } = setup();
    act(() => result.current.move(task, 'Done'));
    expect(result.current.current).toEqual({ kind: 'done', task });
    expect(api.move).not.toHaveBeenCalled();

    act(() => result.current.finish('Готово'));

    await waitFor(() => expect(onNotice).toHaveBeenCalledWith('Задачу виконано.'));
    expect(api.move).toHaveBeenCalledWith({ id: 7, status: 'Done', result: 'Готово' });
  });

  it('reports a failed move as a notice and frees the card', async () => {
    api.move.mockImplementation(fail);
    const { result, onNotice } = setup();

    act(() => result.current.move(task, 'InProgress'));

    await waitFor(() => expect(onNotice).toHaveBeenCalled());
    expect(result.current.movingId).toBeNull();
  });
});
