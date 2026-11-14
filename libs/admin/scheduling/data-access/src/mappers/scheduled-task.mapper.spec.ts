import {
  mapScheduledTask,
  mapScheduledTaskRuns,
  mapScheduledTasks,
  toScheduleBody,
} from './scheduled-task.mapper';

const stocks = {
  key: 'stocks',
  name: 'Залишки',
  description: 'Оновлює залишки з 1С.',
  editable: true,
  enabled: true,
  schedule: { kind: 'daily', times: ['07:00', '13:00'], days: [1, 2, 3, 4, 5, 6, 7] },
  nextRunAt: '2026-11-16T05:00:00Z',
  isRunning: false,
  lastRunFailed: true,
  lastFailureAt: '2026-11-15T11:00:00Z',
  lastFailureReason: 'Таблицю не прочитано.',
  overdue: false,
};

describe('scheduled task mapper', () => {
  it('maps a task and fills missing optional fields with null', () => {
    const task = mapScheduledTask(stocks);

    expect(task.schedule).toEqual({
      kind: 'daily',
      everyMinutes: null,
      fromHour: null,
      toHour: null,
      times: ['07:00', '13:00'],
      days: [1, 2, 3, 4, 5, 6, 7],
    });
    expect(task.lastSuccessAt).toBeNull();
    expect(task.lastFailureReason).toBe('Таблицю не прочитано.');
  });

  it('throws on an unknown schedule kind or a bad weekday', () => {
    expect(() => mapScheduledTasks([{ ...stocks, schedule: { kind: 'cron' } }])).toThrow();
    expect(() =>
      mapScheduledTask({ ...stocks, schedule: { kind: 'daily', times: ['07:00'], days: [8] } }),
    ).toThrow();
  });

  it('maps the run history', () => {
    const [run] = mapScheduledTaskRuns([
      {
        id: '0193',
        trigger: 'manual',
        requestedBy: 'admin@classkedr.com.ua',
        claimedAt: '2026-11-15T11:00:00Z',
        outcome: 'succeeded',
        message: 'Рядків 10: додано 1.',
      },
    ]);

    expect(run.trigger).toBe('manual');
    expect(run.startedAt).toBeNull();
  });

  it('sends times and days only for a daily schedule', () => {
    expect(
      toScheduleBody({
        enabled: true,
        schedule: {
          kind: 'interval',
          everyMinutes: 10,
          fromHour: 8,
          toHour: 20,
          times: [],
          days: [],
        },
        nextRunAt: null,
      }),
    ).toEqual({
      enabled: true,
      schedule: {
        kind: 'interval',
        everyMinutes: 10,
        fromHour: 8,
        toHour: 20,
        times: null,
        days: null,
      },
      nextRunAt: null,
    });
  });
});
