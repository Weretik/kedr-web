import { workActivityAreaLabels, workActivityMethodLabels } from '../entities/work-activity-labels';

import type { WorkActivity } from '../entities/work-report';

/** «Категорії» for `Categories`; an area the admin does not know keeps its server name. */
export const workActivityArea = (activity: Pick<WorkActivity, 'area'>): string =>
  workActivityAreaLabels[activity.area] ?? activity.area;

export const workActivityAction = (activity: Pick<WorkActivity, 'method'>): string =>
  workActivityMethodLabels[activity.method];

/** `id=12, lang=uk` → `№12 · uk`; other values stay as `name: value`. */
export function workActivityTarget(activity: Pick<WorkActivity, 'target'>): string {
  if (!activity.target) return '';
  return activity.target
    .split(', ')
    .map((pair) => {
      const [name, value = ''] = pair.split('=');
      if (name === 'id' || name.endsWith('Id')) return `№${value}`;
      if (name === 'lang') return value;
      return `${name}: ${value}`;
    })
    .join(' · ');
}

/** Kyiv calendar day `yyyy-mm-dd` of an ISO time, for grouping by day. */
export function kyivDay(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/Kyiv',
    year: 'numeric',
  }).format(new Date(iso));
}

/** Activity grouped by Kyiv day, newest day first; entries keep their order inside a day. */
export function groupWorkActivityByDay(
  activity: readonly WorkActivity[],
): { day: string; entries: WorkActivity[] }[] {
  const groups = new Map<string, WorkActivity[]>();
  for (const entry of activity) {
    const day = kyivDay(entry.occurredAt);
    groups.set(day, [...(groups.get(day) ?? []), entry]);
  }
  return [...groups.entries()]
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([day, entries]) => ({ day, entries }));
}
