import { useGetScheduledTasksQuery } from '@admin/scheduling/data-access';
import { BackgroundTasksTable } from '@admin/scheduling/ui';
import { AdminPageHeader, NoticeSnackbar } from '@admin/shared/ui';
import { Card, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TaskScheduleEditor } from '../components/task-schedule-editor';

/** The list refreshes every 30 seconds, so a run's result appears without a reload. */
export const tasksRefreshMs = 30_000;

/**
 * «Система › Фонові задачі»: every background task with its schedule and last results. The eye
 * opens the task; the pencil opens «Змінити розклад» over the list.
 */
export function BackgroundTasksPage() {
  const query = useGetScheduledTasksQuery(undefined, { pollingInterval: tasksRefreshMs });
  const navigate = useNavigate();
  const [editKey, setEditKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const tasks = query.data ?? [];
  const editing = tasks.find((task) => task.key === editKey) ?? null;
  const attention = tasks.filter((task) => task.lastRunFailed || task.overdue).length;

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Фонові задачі" />
      <Typography color="text.secondary">
        Задачі задає код: тут змінюють лише розклад, вмикають чи вимикають задачу й запускають її
        вручну. Час — київський.
        {attention > 0 ? ` Потребують уваги: ${attention}.` : ''}
      </Typography>
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <BackgroundTasksTable
          error={query.isError}
          loading={query.isLoading}
          onEdit={(task) => setEditKey(task.key)}
          onRetry={() => void query.refetch()}
          onView={(task) => navigate(`/background-tasks/${encodeURIComponent(task.key)}`)}
          tasks={tasks}
        />
      </Card>
      {editing ? (
        <TaskScheduleEditor
          key={editing.key}
          onClose={() => setEditKey(null)}
          onSaved={() => {
            setEditKey(null);
            setNotice('Розклад збережено.');
          }}
          task={editing}
        />
      ) : null}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default BackgroundTasksPage;
