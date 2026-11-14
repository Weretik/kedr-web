import { canRunNow, taskMarks } from './task-marks';

import type { ScheduledTask } from '../entities/scheduled-task';

const healthy: ScheduledTask = {
  key: 'stocks',
  name: 'Залишки',
  description: 'Оновлює залишки з 1С.',
  editable: true,
  enabled: true,
  schedule: {
    kind: 'daily',
    everyMinutes: null,
    fromHour: null,
    toHour: null,
    times: ['07:00'],
    days: [1],
  },
  nextRunAt: '2026-11-16T05:00:00Z',
  isRunning: false,
  runningSince: null,
  runRequestedAt: null,
  lastSuccessAt: '2026-11-15T05:03:00Z',
  lastSuccessSummary: 'Рядків 10.',
  lastFailureAt: null,
  lastFailureReason: null,
  lastRunFailed: false,
  overdue: false,
};

describe('task marks', () => {
  it('shows nothing for a healthy task', () => {
    expect(taskMarks(healthy)).toEqual([]);
    expect(canRunNow(healthy)).toBe(true);
  });

  it('marks a failed, missed, requested and disabled task', () => {
    const labels = taskMarks({
      ...healthy,
      lastRunFailed: true,
      overdue: true,
      runRequestedAt: '2026-11-15T11:00:00Z',
      enabled: false,
    }).map((mark) => mark.label);

    expect(labels).toEqual([
      'Остання спроба з помилкою',
      'Пропущено запуск',
      'Запуск заплановано',
      'Вимкнено',
    ]);
  });

  it('does not offer «Запустити зараз» while running or for the outbox', () => {
    expect(canRunNow({ ...healthy, isRunning: true })).toBe(false);
    expect(canRunNow({ ...healthy, editable: false })).toBe(false);
  });
});
