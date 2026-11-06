export type WorkTaskStatus = 'Planned' | 'InProgress' | 'Done';

export interface WorkTaskStep {
  title: string;
  isDone: boolean;
}

export interface WorkTask {
  id: number;
  ownerUserId: string;
  /** False when an administrator gave the task («Від адміністратора»). */
  createdByOwner: boolean;
  title: string;
  details: string | null;
  status: WorkTaskStatus;
  /** What was done; only for `Done`. */
  result: string | null;
  /** Day the task should be done by (`YYYY-MM-DD`), or null. */
  dueDate: string | null;
  /** Open and past its due day in Kyiv; the server decides. */
  isOverdue: boolean;
  steps: WorkTaskStep[];
  /** When the task was set. */
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface WorkTaskInput {
  title: string;
  details: string;
  /** `YYYY-MM-DD`; empty means no deadline. */
  dueDate: string;
  steps: WorkTaskStep[];
}

export const workTaskTitleMaxLength = 200;
export const workTaskDetailsMaxLength = 4000;
export const workTaskResultMaxLength = 2000;
export const workTaskStepMaxLength = 200;
export const workTaskStepsMaxCount = 30;

/** Board columns in their order. */
export const workTaskColumns: readonly { status: WorkTaskStatus; label: string }[] = [
  { status: 'Planned', label: 'План' },
  { status: 'InProgress', label: 'В роботі' },
  { status: 'Done', label: 'Готово' },
];

export const isWorkTaskStatus = (value: string): value is WorkTaskStatus =>
  workTaskColumns.some((column) => column.status === value);

export const emptyWorkTaskInput: WorkTaskInput = { title: '', details: '', dueDate: '', steps: [] };

/** The panel's starting values for an existing task. */
export const workTaskInputOf = (task: WorkTask): WorkTaskInput => ({
  title: task.title,
  details: task.details ?? '',
  dueDate: task.dueDate ?? '',
  steps: task.steps.map((step) => ({ ...step })),
});

/** Done steps out of all, for «Кроки 2 / 5». */
export const workTaskStepProgress = (task: WorkTask) => ({
  done: task.steps.filter((step) => step.isDone).length,
  total: task.steps.length,
});
