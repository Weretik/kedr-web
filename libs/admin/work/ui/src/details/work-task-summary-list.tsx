import {
  formatWorkDayTime,
  formatWorkShortDay,
  formatWorkShortDayOf,
  workTaskColumns,
  workTaskStepProgress,
} from '@admin/work/model';
import { Chip, Divider, Stack, Typography } from '@mui/material';

import type { WorkTask } from '@admin/work/model';

interface WorkTaskSummaryListProps {
  tasks: readonly WorkTask[];
  emptyText: string;
}

const columnLabel = (task: WorkTask) =>
  workTaskColumns.find((column) => column.status === task.status)?.label ?? task.status;

/** Read-only task lines for the report: title, dates, steps, overdue mark, and the result. */
export function WorkTaskSummaryList({ emptyText, tasks }: WorkTaskSummaryListProps) {
  if (tasks.length === 0)
    return (
      <Typography color="text.secondary" variant="body2">
        {emptyText}
      </Typography>
    );

  return (
    <Stack divider={<Divider flexItem />} spacing={1.5}>
      {tasks.map((task) => (
        <Stack key={task.id} spacing={0.5}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography sx={{ flex: 1, fontWeight: 600, overflowWrap: 'anywhere' }} variant="body2">
              {task.title}
            </Typography>
            {task.isOverdue ? <Chip color="error" label="Прострочено" size="small" /> : null}
          </Stack>
          <Typography color="text.secondary" variant="caption">
            {task.status === 'Done' && task.completedAt
              ? `Виконано ${formatWorkDayTime(task.completedAt)}`
              : columnLabel(task)}
            {` · поставлено ${formatWorkShortDayOf(task.createdAt)}`}
            {task.dueDate ? ` · до ${formatWorkShortDay(task.dueDate)}` : ''}
            {task.steps.length > 0
              ? ` · кроки ${workTaskStepProgress(task).done} / ${task.steps.length}`
              : ''}
            {task.createdByOwner ? '' : ' · від адміністратора'}
          </Typography>
          {task.result ? (
            <Typography sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-line' }} variant="body2">
              {task.result}
            </Typography>
          ) : null}
        </Stack>
      ))}
    </Stack>
  );
}
