import { runOutcomes, runTriggers, scheduleKinds } from '@admin/scheduling/model';
import { z } from 'zod';

const instant = z.string().refine((value) => !Number.isNaN(Date.parse(value)));
const nullableInstant = instant.nullish().transform((value) => value ?? null);
const nullableText = z
  .string()
  .nullish()
  .transform((value) => value ?? null);
const nullableWhole = z
  .number()
  .int()
  .min(0)
  .nullish()
  .transform((value) => value ?? null);

const scheduleSchema = z.object({
  kind: z.enum(scheduleKinds),
  everyMinutes: nullableWhole,
  fromHour: nullableWhole,
  toHour: nullableWhole,
  times: z
    .array(z.string())
    .nullish()
    .transform((value) => value ?? []),
  days: z
    .array(z.number().int().min(1).max(7))
    .nullish()
    .transform((value) => value ?? []),
});

/** Runtime shape of one task of «Фонові задачі»; mappers receive data that passed this schema. */
export const scheduledTaskSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string(),
  editable: z.boolean(),
  enabled: z.boolean(),
  schedule: scheduleSchema,
  nextRunAt: nullableInstant,
  isRunning: z.boolean(),
  runningSince: nullableInstant,
  runRequestedAt: nullableInstant,
  lastSuccessAt: nullableInstant,
  lastSuccessSummary: nullableText,
  lastFailureAt: nullableInstant,
  lastFailureReason: nullableText,
  lastRunFailed: z.boolean(),
  overdue: z.boolean(),
});

/** Runtime shape of one run in the history of a task. */
export const scheduledTaskRunSchema = z.object({
  id: z.string(),
  trigger: z.enum(runTriggers),
  requestedBy: nullableText,
  claimedAt: instant,
  startedAt: nullableInstant,
  finishedAt: nullableInstant,
  outcome: z.enum(runOutcomes),
  message: nullableText,
});
