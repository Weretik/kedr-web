import { scheduledTaskRunSchema, scheduledTaskSchema } from '../validators/scheduling.schemas';

import type { ScheduledTaskScheduleBody } from '../contracts/scheduling.contract';
import type {
  ScheduledTask,
  ScheduledTaskRun,
  ScheduledTaskScheduleInput,
} from '@admin/scheduling/model';

export const mapScheduledTask = (value: unknown): ScheduledTask => scheduledTaskSchema.parse(value);

export const mapScheduledTasks = (value: unknown): ScheduledTask[] =>
  scheduledTaskSchema.array().parse(value);

export const mapScheduledTaskRuns = (value: unknown): ScheduledTaskRun[] =>
  scheduledTaskRunSchema.array().parse(value);

/** Only the fields of the chosen kind are sent; the others go as null. */
export const toScheduleBody = (input: ScheduledTaskScheduleInput): ScheduledTaskScheduleBody => ({
  enabled: input.enabled,
  schedule: {
    kind: input.schedule.kind,
    everyMinutes: input.schedule.everyMinutes,
    fromHour: input.schedule.fromHour,
    toHour: input.schedule.toHour,
    times: input.schedule.kind === 'daily' ? input.schedule.times : null,
    days: input.schedule.kind === 'daily' ? input.schedule.days : null,
  },
  nextRunAt: input.nextRunAt,
});
