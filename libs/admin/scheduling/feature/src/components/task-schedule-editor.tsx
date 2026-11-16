import { pauseWarning } from '@admin/scheduling/model';
import { TaskSchedulePanel } from '@admin/scheduling/ui';

import { useScheduleForm } from '../hooks/use-schedule-form';

import type { ScheduledTask } from '@admin/scheduling/model';

interface TaskScheduleEditorProps {
  task: ScheduledTask;
  onClose: () => void;
  onSaved: () => void;
}

/** The right-side «Змінити розклад» panel of one task; mount it per opening. */
export function TaskScheduleEditor({ onClose, onSaved, task }: TaskScheduleEditorProps) {
  const form = useScheduleForm(task, onSaved);
  return (
    <TaskSchedulePanel
      errors={form.errors}
      onCancel={onClose}
      onChange={form.change}
      onSave={() => void form.save()}
      pauseWarning={pauseWarning(task.key, form.values)}
      saving={form.saving}
      serverError={form.serverError}
      taskName={task.name}
      values={form.values}
    />
  );
}
