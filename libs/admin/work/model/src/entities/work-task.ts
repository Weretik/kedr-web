export type WorkTaskStatus = 'Planned' | 'InProgress' | 'Done';

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
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface WorkTaskInput {
  title: string;
  details: string;
}

export const workTaskTitleMaxLength = 200;
export const workTaskDetailsMaxLength = 4000;
export const workTaskResultMaxLength = 2000;

/** Board columns in their order. */
export const workTaskColumns: readonly { status: WorkTaskStatus; label: string }[] = [
  { status: 'Planned', label: 'План' },
  { status: 'InProgress', label: 'В роботі' },
  { status: 'Done', label: 'Готово' },
];

export const isWorkTaskStatus = (value: string): value is WorkTaskStatus =>
  workTaskColumns.some((column) => column.status === value);

export const emptyWorkTaskInput: WorkTaskInput = { title: '', details: '' };
