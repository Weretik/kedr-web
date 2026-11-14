import { useCreateAdminWorkTaskMutation } from '@admin/work/data-access';
import { useState } from 'react';

import { workErrorMessage } from '../errors/work-error-message';

import type { WorkPerson, WorkTaskInput } from '@admin/work/model';

/** «Дати задачу» from the report: whom the task goes to, saving, and the notice after it. */
export function useGiveWorkTask(staff: readonly WorkPerson[]) {
  const [give, given] = useCreateAdminWorkTaskMutation();
  /** Null while the panel is closed. */
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string | null>(null);

  const save = async (input: WorkTaskInput) => {
    if (!assigneeId) return;
    setError(undefined);
    try {
      await give({ ownerUserId: assigneeId, input }).unwrap();
      const name = staff.find((member) => member.id === assigneeId)?.name;
      setAssigneeId(null);
      setNotice(name ? `Задачу додано в «План»: ${name}.` : 'Задачу додано в «План».');
    } catch (cause) {
      setError(workErrorMessage(cause));
    }
  };

  return {
    assigneeId,
    setAssigneeId,
    error,
    notice,
    clearNotice: () => setNotice(null),
    saving: given.isLoading,
    start: (personId: string) => {
      setError(undefined);
      setAssigneeId(personId);
    },
    cancel: () => setAssigneeId(null),
    save,
  };
}
