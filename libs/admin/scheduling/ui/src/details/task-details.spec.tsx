import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TaskDetails } from './task-details';

import type { ScheduledTask } from '@admin/scheduling/model';

const task: ScheduledTask = {
  key: 'orders',
  name: 'Замовлення',
  description: 'Забирає нові замовлення з 1С.',
  editable: true,
  enabled: false,
  schedule: { kind: 'interval', everyMinutes: 10, fromHour: 8, toHour: 20, times: [], days: [] },
  nextRunAt: '2026-11-16T06:00:00Z',
  isRunning: true,
  runningSince: '2026-11-15T10:00:00Z',
  runRequestedAt: null,
  lastSuccessAt: null,
  lastSuccessSummary: null,
  lastFailureAt: null,
  lastFailureReason: null,
  lastRunFailed: false,
  overdue: false,
};

describe('TaskDetails', () => {
  it('shows the schedule in words, a disabled next run and the running state', () => {
    render(<TaskDetails task={task} />);

    expect(screen.getByText('Кожні 10 хв, 08:00–20:00')).toBeDefined();
    expect(screen.getAllByText('Вимкнено')).toHaveLength(2);
    expect(screen.getAllByText('Виконується')).toHaveLength(1);
    expect(screen.getAllByText('Ще не було')).toHaveLength(2);
  });
});
