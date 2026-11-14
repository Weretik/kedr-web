import {
  useGetScheduledTaskRunsQuery,
  useGetScheduledTasksQuery,
} from '@admin/scheduling/data-access';
import { canRunNow } from '@admin/scheduling/model';
import { TaskDetails, TaskRunHistory } from '@admin/scheduling/ui';
import { AdminDetailHeader, NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { tasksRefreshMs } from './background-tasks-page';
import { TaskScheduleEditor } from '../components/task-schedule-editor';
import { useRunTaskNow } from '../hooks/use-run-task-now';

import type { TaskNotice } from '../hooks/use-run-task-now';

/** One task, read-only: what it does, its schedule, last results and history; «Редагувати» and «Запустити зараз». */
export function BackgroundTaskPage() {
  const { key = '' } = useParams();
  const tasks = useGetScheduledTasksQuery(undefined, { pollingInterval: tasksRefreshMs });
  const runs = useGetScheduledTaskRunsQuery(key, { pollingInterval: tasksRefreshMs, skip: !key });
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState<TaskNotice | null>(null);
  const runNow = useRunTaskNow(setNotice);
  const task = tasks.data?.find((item) => item.key === key) ?? null;

  const actions = task ? (
    <Stack direction="row" spacing={1}>
      {canRunNow(task) ? (
        <Button
          disabled={runNow.running}
          onClick={() => void runNow.run(task)}
          startIcon={<PlayArrowOutlinedIcon />}
          variant="outlined"
        >
          Запустити зараз
        </Button>
      ) : null}
      {task.editable ? (
        <Button
          onClick={() => setEditing(true)}
          startIcon={<EditOutlinedIcon />}
          variant="contained"
        >
          Редагувати
        </Button>
      ) : null}
    </Stack>
  ) : null;

  return (
    <Stack component="section" spacing={3}>
      <AdminDetailHeader
        actions={actions}
        backLabel="Фонові задачі"
        backTo="/background-tasks"
        title={task?.name ?? 'Фонова задача'}
      />
      {notice && !notice.ok ? (
        <Alert onClose={() => setNotice(null)} severity="error">
          {notice.text}
        </Alert>
      ) : null}
      {tasks.isLoading ? (
        <PageLoader label="Завантаження задачі" />
      ) : tasks.isError ? (
        <Alert action={<Button onClick={() => tasks.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити задачу. Спробуйте ще раз.
        </Alert>
      ) : !task ? (
        <Alert severity="warning">Такої задачі немає.</Alert>
      ) : (
        <>
          <TaskDetails task={task} />
          <TaskRunHistory
            error={runs.isError}
            loading={runs.isLoading}
            onRetry={() => void runs.refetch()}
            runs={runs.data ?? []}
          />
        </>
      )}
      {editing && task ? (
        <TaskScheduleEditor
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            setNotice({ text: 'Розклад збережено.', ok: true });
          }}
          task={task}
        />
      ) : null}
      <NoticeSnackbar message={notice?.ok ? notice.text : null} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default BackgroundTaskPage;
