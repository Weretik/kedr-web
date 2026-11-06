import { workPeriodMaxDays } from '../entities/work-report';
import {
  workTaskDetailsMaxLength,
  workTaskResultMaxLength,
  workTaskTitleMaxLength,
} from '../entities/work-task';
import { workPeriodDays } from '../mappers/work-period';

import type { WorkPeriod } from '../entities/work-report';
import type { WorkTaskInput } from '../entities/work-task';

export type WorkTaskIssues = Partial<Record<keyof WorkTaskInput, string>>;

export function workTaskIssues(input: WorkTaskInput): WorkTaskIssues {
  const issues: WorkTaskIssues = {};
  const title = input.title.trim();
  if (!title) issues.title = 'Напишіть, що треба зробити.';
  else if (title.length > workTaskTitleMaxLength)
    issues.title = `Не довше ${workTaskTitleMaxLength} символів.`;
  if (input.details.trim().length > workTaskDetailsMaxLength)
    issues.details = `Не довше ${workTaskDetailsMaxLength} символів.`;
  return issues;
}

export const workTaskResultIssue = (result: string): string | undefined =>
  result.trim().length > workTaskResultMaxLength
    ? `Не довше ${workTaskResultMaxLength} символів.`
    : undefined;

/** The reason a period cannot be asked for, or undefined when it can. */
export function workPeriodIssue(period: WorkPeriod): string | undefined {
  if (!period.from || !period.to) return 'Вкажіть обидві дати.';
  const days = workPeriodDays(period);
  if (days < 1) return 'Дата «по» раніше за дату «з».';
  if (days > workPeriodMaxDays) return `Період не довший за ${workPeriodMaxDays} дні.`;
  return undefined;
}
