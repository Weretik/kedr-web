import { workReportSchema, workTaskListSchema, workTaskSchema } from '../validators/work.schemas';

import type { SaveWorkTaskBody } from '../contracts/work.contract';
import type { WorkReport, WorkTask, WorkTaskInput } from '@admin/work/model';
import type { z } from 'zod';

const toTask = (row: z.infer<typeof workTaskSchema>): WorkTask => ({
  id: row.id,
  ownerUserId: row.ownerUserId,
  createdByOwner: row.createdByOwner,
  title: row.title,
  details: row.details,
  status: row.status,
  result: row.result,
  dueDate: row.dueDate,
  isOverdue: row.isOverdue,
  steps: row.steps.map((step) => ({ title: step.title, isDone: step.isDone })),
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  startedAt: row.startedAt,
  completedAt: row.completedAt,
});

export const mapWorkTask = (value: unknown): WorkTask => toTask(workTaskSchema.parse(value));

export const mapWorkTasks = (value: unknown): WorkTask[] =>
  workTaskListSchema.parse(value).map(toTask);

export function mapWorkReport(value: unknown): WorkReport {
  const report = workReportSchema.parse(value);
  return {
    ...report,
    doneTasks: report.doneTasks.map(toTask),
    openTasks: report.openTasks.map(toTask),
  };
}

/** Trimmed text; empty details and date are sent as null, empty step lines are dropped. */
export const toSaveWorkTaskBody = (input: WorkTaskInput): SaveWorkTaskBody => ({
  title: input.title.trim(),
  details: input.details.trim() || null,
  dueDate: input.dueDate || null,
  steps: input.steps
    .map((step) => ({ title: step.title.trim(), isDone: step.isDone }))
    .filter((step) => step.title),
});
