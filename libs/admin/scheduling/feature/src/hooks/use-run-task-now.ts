import { useRunScheduledTaskNowMutation } from '@admin/scheduling/data-access';

import { schedulingErrorMessage } from '../errors/scheduling-error-message';

import type { ScheduledTask } from '@admin/scheduling/model';

export interface TaskNotice {
  text: string;
  ok: boolean;
}

/** «Запустити зараз»: the next tick, within a minute, starts the task. */
export function useRunTaskNow(onNotice: (notice: TaskNotice) => void) {
  const [runNow, state] = useRunScheduledTaskNowMutation();

  async function run(task: ScheduledTask) {
    try {
      await runNow(task.key).unwrap();
      onNotice({ text: 'Запуск заплановано: задача почнеться протягом хвилини.', ok: true });
    } catch (error) {
      onNotice({ text: schedulingErrorMessage(error, 'Не вдалося запустити задачу.'), ok: false });
    }
  }

  return { run, running: state.isLoading };
}
