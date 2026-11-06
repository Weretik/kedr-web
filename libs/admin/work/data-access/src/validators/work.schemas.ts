import { z } from 'zod';

const text = z.string().nullable();

/** Runtime shape of a task; mappers receive data that passed this schema. */
export const workTaskSchema = z.object({
  id: z.number(),
  ownerUserId: z.string(),
  createdByUserId: z.string(),
  createdByOwner: z.boolean(),
  title: z.string(),
  details: text,
  status: z.enum(['Planned', 'InProgress', 'Done']),
  result: text,
  createdAt: z.string(),
  updatedAt: z.string(),
  startedAt: text,
  completedAt: text,
});

export const workTaskListSchema = z.array(workTaskSchema);

export const workActivitySchema = z.object({
  id: z.number(),
  userId: z.string(),
  userEmail: z.string(),
  area: z.string(),
  operation: z.string(),
  method: z.enum(['POST', 'PUT', 'PATCH', 'DELETE']),
  target: z.string(),
  count: z.number(),
  firstAt: z.string(),
  occurredAt: z.string(),
});

export const workReportSchema = z.object({
  userId: z.string(),
  from: z.string(),
  to: z.string(),
  doneTasks: workTaskListSchema,
  openTasks: workTaskListSchema,
  activity: z.array(workActivitySchema),
  activityTruncated: z.boolean(),
});
