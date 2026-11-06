import { describe, expect, it } from 'vitest';

import { groupWorkActivityByDay, workActivityArea, workActivityTarget } from './work-activity-text';
import { lastDaysPeriod, workPeriodDays } from './work-period';
import { emptyWorkTaskInput } from '../entities/work-task';
import { workPeriodIssue, workTaskIssues } from '../validators/work-task-rules';

import type { WorkActivity } from '../entities/work-report';

const entry = (occurredAt: string, area = 'Categories'): WorkActivity => ({
  area,
  count: 1,
  firstAt: occurredAt,
  id: 1,
  method: 'PUT',
  occurredAt,
  operation: 'UpdateContent',
  target: 'id=12, lang=uk',
  userEmail: 'seo@kedr.ua',
  userId: 'u1',
});

describe('work activity text', () => {
  it('names the area and the target in Ukrainian', () => {
    expect(workActivityArea(entry('2026-11-06T10:00:00Z'))).toBe('Категорії');
    expect(workActivityArea(entry('2026-11-06T10:00:00Z', 'NewThing'))).toBe('NewThing');
    expect(workActivityTarget({ target: 'id=12, lang=uk' })).toBe('№12 · uk');
    expect(workActivityTarget({ target: '' })).toBe('');
  });

  it('groups by Kyiv day, newest day first', () => {
    // 22:30 UTC on 5 November is already 6 November in Kyiv.
    const groups = groupWorkActivityByDay([
      entry('2026-11-06T09:00:00Z'),
      entry('2026-11-05T22:30:00Z'),
      entry('2026-11-05T08:00:00Z'),
    ]);

    expect(groups.map((group) => [group.day, group.entries.length])).toEqual([
      ['2026-11-06', 2],
      ['2026-11-05', 1],
    ]);
  });
});

describe('work period and task rules', () => {
  it('counts the last days including today', () => {
    const period = lastDaysPeriod(7, new Date('2026-11-06T10:00:00Z'));

    expect(period).toEqual({ from: '2026-10-31', to: '2026-11-06' });
    expect(workPeriodDays(period)).toBe(7);
  });

  it('rejects reversed and too long periods and empty titles', () => {
    expect(workPeriodIssue({ from: '2026-11-06', to: '2026-11-05' })).toBeDefined();
    expect(workPeriodIssue({ from: '2026-01-01', to: '2026-11-06' })).toBeDefined();
    expect(workPeriodIssue({ from: '2026-11-01', to: '2026-11-06' })).toBeUndefined();
    expect(workTaskIssues({ ...emptyWorkTaskInput, title: '  ' }).title).toBeDefined();
    const tooManySteps = Array.from({ length: 31 }, (_, index) => ({
      title: `Крок ${index}`,
      isDone: false,
    }));
    expect(
      workTaskIssues({ ...emptyWorkTaskInput, title: 'Задача', steps: tooManySteps }).steps,
    ).toBeDefined();
    expect(
      workTaskIssues({
        ...emptyWorkTaskInput,
        title: 'Задача',
        steps: [{ title: ' ', isDone: false }],
      }),
    ).toEqual({});
  });
});
