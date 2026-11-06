import { kyivDay } from './work-activity-text';

import type { WorkPeriod } from '../entities/work-report';

/** The last `days` Kyiv days ending today, both inclusive. */
export function lastDaysPeriod(days: number, now: Date = new Date()): WorkPeriod {
  const to = kyivDay(now.toISOString());
  const start = new Date(`${to}T12:00:00Z`);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return { from: start.toISOString().slice(0, 10), to };
}

/** Days in a period, both ends counted. */
export function workPeriodDays(period: WorkPeriod): number {
  const from = Date.parse(`${period.from}T00:00:00Z`);
  const to = Date.parse(`${period.to}T00:00:00Z`);
  return Math.round((to - from) / 86_400_000) + 1;
}
