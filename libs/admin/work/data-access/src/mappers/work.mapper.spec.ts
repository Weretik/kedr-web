import { describe, expect, it } from 'vitest';

import { mapWorkReport, toSaveWorkTaskBody } from './work.mapper';

const task = {
  id: 1,
  ownerUserId: 'u1',
  createdByUserId: 'a1',
  createdByOwner: false,
  title: 'Тексти категорій',
  details: null,
  status: 'Done',
  result: '12 текстів',
  dueDate: null,
  isOverdue: false,
  steps: [],
  createdAt: '2026-11-06T08:00:00Z',
  updatedAt: '2026-11-06T09:00:00Z',
  startedAt: '2026-11-06T08:30:00Z',
  completedAt: '2026-11-06T09:00:00Z',
};

describe('work mapper', () => {
  it('maps a report and rejects an unknown status', () => {
    const report = mapWorkReport({
      userId: 'u1',
      from: '2026-11-01',
      to: '2026-11-06',
      doneTasks: [task],
      openTasks: [],
      activity: [],
      activityTruncated: false,
    });

    expect(report.doneTasks[0]).toMatchObject({ createdByOwner: false, result: '12 текстів' });
    expect(() =>
      mapWorkReport({ ...report, doneTasks: [{ ...task, status: 'Finished' }] }),
    ).toThrow();
  });

  it('trims the input, sends empty details and date as null and drops empty steps', () => {
    expect(
      toSaveWorkTaskBody({ title: '  Задача ', details: '  ', dueDate: '', steps: [] }),
    ).toEqual({ title: 'Задача', details: null, dueDate: null, steps: [] });
    expect(
      toSaveWorkTaskBody({
        title: 'Задача',
        details: '',
        dueDate: '2026-11-10',
        steps: [
          { title: ' Title ', isDone: true },
          { title: '  ', isDone: false },
        ],
      }).steps,
    ).toEqual([{ title: 'Title', isDone: true }]);
  });
});
