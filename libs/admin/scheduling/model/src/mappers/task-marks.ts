import type { ScheduledTask } from '../entities/scheduled-task';

export type TaskMarkTone = 'error' | 'warning' | 'info' | 'neutral';

export interface TaskMark {
  label: string;
  tone: TaskMarkTone;
}

/** Backend R-09: only problems and states worth noticing; there is no «все добре» mark. */
export function taskMarks(task: ScheduledTask): TaskMark[] {
  const marks: TaskMark[] = [];
  if (task.lastRunFailed) marks.push({ label: 'Остання спроба з помилкою', tone: 'error' });
  if (task.overdue) marks.push({ label: 'Пропущено запуск', tone: 'warning' });
  if (task.isRunning) marks.push({ label: 'Виконується', tone: 'info' });
  else if (task.runRequestedAt) marks.push({ label: 'Запуск заплановано', tone: 'info' });
  if (!task.enabled) marks.push({ label: 'Вимкнено', tone: 'neutral' });
  return marks;
}

/** «Запустити зараз» is offered for a task that the admin may run and that is not already going. */
export const canRunNow = (task: ScheduledTask): boolean =>
  task.editable && !task.isRunning && !task.runRequestedAt;
