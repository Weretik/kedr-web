import { workTaskColumns, formatWorkDayTime } from '@admin/work/model';
import { Divider, Stack, Typography } from '@mui/material';

import type { WorkTask } from '@admin/work/model';

interface WorkTaskSummaryListProps {
  tasks: readonly WorkTask[];
  emptyText: string;
}

const columnLabel = (task: WorkTask) =>
  workTaskColumns.find((column) => column.status === task.status)?.label ?? task.status;

/** Read-only task lines for the report: title, column or completion time, and the result. */
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
          <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }} variant="body2">
            {task.title}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            {task.status === 'Done' && task.completedAt
              ? `Виконано ${formatWorkDayTime(task.completedAt)}`
              : `${columnLabel(task)} · змінено ${formatWorkDayTime(task.updatedAt)}`}
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
