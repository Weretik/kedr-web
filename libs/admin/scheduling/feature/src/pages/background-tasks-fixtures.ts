import type { ScheduledTask } from '@admin/scheduling/model';

export const stocksTask: ScheduledTask = {
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
    times: ['07:00', '13:00'],
    days: [1, 2, 3, 4, 5, 6, 7],
  },
  nextRunAt: '2026-11-16T05:00:00Z',
  isRunning: false,
  runningSince: null,
  runRequestedAt: null,
  lastSuccessAt: '2026-11-15T05:03:00Z',
  lastSuccessSummary: 'Рядків 10: додано 1.',
  lastFailureAt: null,
  lastFailureReason: null,
  lastRunFailed: false,
  overdue: false,
};

export const pricesTask: ScheduledTask = {
  ...stocksTask,
  key: 'prices',
  name: 'Ціни',
  description: 'Оновлює ціни з 1С.',
  enabled: false,
  schedule: { ...stocksTask.schedule, times: ['06:00'], days: [1] },
  lastSuccessAt: null,
  lastSuccessSummary: null,
  lastFailureAt: '2026-11-15T04:00:00Z',
  lastFailureReason: 'Таблицю не прочитано.',
  lastRunFailed: true,
};

export const outboxTask: ScheduledTask = {
  ...stocksTask,
  key: 'outbox',
  name: 'Досилання повідомлень',
  description: 'Досилає повідомлення, що не пішли одразу.',
  editable: false,
  schedule: {
    kind: 'interval',
    everyMinutes: 1,
    fromHour: null,
    toHour: null,
    times: [],
    days: [],
  },
};
