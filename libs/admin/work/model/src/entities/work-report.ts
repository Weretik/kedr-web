import type { WorkTask } from './work-task';

export type WorkActivityMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** One change in the admin, written by the server automatically. */
export interface WorkActivity {
  id: number;
  userId: string;
  userEmail: string;
  /** Admin section by its server name, for example `Categories`. */
  area: string;
  operation: string;
  method: WorkActivityMethod;
  /** Route values such as `id=12, lang=uk`; may be empty. */
  target: string;
  /** How many times the same change was saved within 10 minutes. */
  count: number;
  firstAt: string;
  occurredAt: string;
}

export interface WorkReport {
  userId: string;
  from: string;
  to: string;
  doneTasks: WorkTask[];
  openTasks: WorkTask[];
  activity: WorkActivity[];
  activityTruncated: boolean;
}

/** A Kyiv-calendar period, both days inclusive, as `yyyy-mm-dd`. */
export interface WorkPeriod {
  from: string;
  to: string;
}

/** The server accepts at most this many days. */
export const workPeriodMaxDays = 92;
