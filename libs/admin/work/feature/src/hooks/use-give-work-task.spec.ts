import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useGiveWorkTask } from './use-give-work-task';

const give = vi.fn();
vi.mock('@admin/work/data-access', () => ({
  useCreateAdminWorkTaskMutation: () => [give, { isLoading: false }],
}));

const staff = [
  { id: 'olha', name: 'Ольга', roleLabel: 'SEO' },
  { id: 'ivan', name: 'Іван', roleLabel: 'Менеджер' },
];
const input = { title: 'Описи', details: '', dueDate: '', steps: [] };

describe('useGiveWorkTask', () => {
  beforeEach(() => give.mockReset().mockReturnValue({ unwrap: () => Promise.resolve() }));

  it('starts with the report person and gives the task to the chosen one', async () => {
    const { result } = renderHook(() => useGiveWorkTask(staff));
    act(() => result.current.start('olha'));
    expect(result.current.assigneeId).toBe('olha');
    act(() => result.current.setAssigneeId('ivan'));

    await act(() => result.current.save(input));

    expect(give).toHaveBeenCalledWith({ ownerUserId: 'ivan', input });
    expect(result.current.assigneeId).toBeNull();
    expect(result.current.notice).toBe('Задачу додано в «План»: Іван.');
  });

  it('keeps the panel open with the error when giving fails', async () => {
    give.mockReturnValue({ unwrap: () => Promise.reject(new Error()) });
    const { result } = renderHook(() => useGiveWorkTask(staff));
    act(() => result.current.start('olha'));
    await act(() => result.current.save(input));
    expect(result.current.assigneeId).toBe('olha');
    expect(result.current.error).toBeTruthy();
  });
});
