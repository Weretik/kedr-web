import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { WorkBoard } from './work-board';

import type { WorkTask } from '@admin/work/model';

const task = (id: number, status: WorkTask['status'], createdByOwner = true): WorkTask => ({
  completedAt: status === 'Done' ? '2026-11-06T09:00:00Z' : null,
  createdAt: '2026-11-06T08:00:00Z',
  createdByOwner,
  details: null,
  id,
  ownerUserId: 'u1',
  result: status === 'Done' ? '12 текстів' : null,
  dueDate: null,
  isOverdue: false,
  steps: [],
  startedAt: null,
  status,
  title: `Задача ${id}`,
  updatedAt: '2026-11-06T08:00:00Z',
});

describe('WorkBoard', () => {
  it('puts tasks in their columns and moves them', () => {
    const onMove = vi.fn();
    render(
      <WorkBoard
        onEdit={vi.fn()}
        onMove={onMove}
        tasks={[task(1, 'Planned', false), task(2, 'InProgress'), task(3, 'Done')]}
      />,
    );

    expect(screen.getByText('План · 1')).toBeTruthy();
    expect(screen.getByText('12 текстів')).toBeTruthy();
    expect(screen.getByText(/Від адміністратора/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Почати' }));
    expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }), 'InProgress');
    fireEvent.click(screen.getByRole('button', { name: 'Готово' }));
    expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ id: 2 }), 'Done');
  });
});
