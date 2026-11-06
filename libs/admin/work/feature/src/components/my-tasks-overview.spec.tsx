import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MyTasksOverview } from './my-tasks-overview';

import type { WorkTask } from '@admin/work/model';

const api = vi.hoisted(() => ({ tasks: vi.fn() }));

vi.mock('@admin/work/data-access', () => ({ useGetMyWorkTasksQuery: api.tasks }));

const base: WorkTask = {
  id: 1,
  ownerUserId: 'seo',
  createdByOwner: true,
  title: 'Задача',
  details: null,
  status: 'Planned',
  result: null,
  createdAt: '2026-11-06T08:00:00Z',
  updatedAt: '2026-11-06T08:00:00Z',
  startedAt: null,
  completedAt: null,
};

describe('MyTasksOverview', () => {
  beforeEach(() => api.tasks.mockReset());

  it('counts open tasks, marks those from the administrator and links to the board', () => {
    api.tasks.mockReturnValue({
      data: [
        { ...base, id: 1, createdByOwner: false },
        { ...base, id: 2 },
        { ...base, id: 3, status: 'InProgress' },
        { ...base, id: 4, status: 'Done' },
      ],
    });
    render(<MyTasksOverview />);

    expect(screen.getByRole('link', { name: 'У плані: 2' }).getAttribute('href')).toBe('/my-tasks');
    expect(screen.getByRole('link', { name: 'В роботі: 1' })).toBeDefined();
    expect(screen.getByText('Від адміністратора: 1')).toBeDefined();
  });

  it('shows nothing without open tasks', () => {
    api.tasks.mockReturnValue({ data: [{ ...base, status: 'Done' }] });
    const { container } = render(<MyTasksOverview />);

    expect(container.textContent).toBe('');
  });
});
