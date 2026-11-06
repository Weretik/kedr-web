import { workTaskColumns } from '@admin/work/model';
import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';

import { WorkTaskCard } from './work-task-card';

import type { WorkTask, WorkTaskStatus } from '@admin/work/model';

interface WorkBoardProps {
  tasks: readonly WorkTask[];
  loading?: boolean;
  /** The task being moved; its buttons are disabled. */
  busyTaskId?: number | null;
  onEdit: (task: WorkTask) => void;
  onMove: (task: WorkTask, status: WorkTaskStatus) => void;
}

/** «План / В роботі / Готово» side by side from `md`, one under another on phones. */
export function WorkBoard({ busyTaskId, loading, onEdit, onMove, tasks }: WorkBoardProps) {
  return (
    <Box
      sx={{
        alignItems: 'start',
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
      }}
    >
      {workTaskColumns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);
        return (
          <Paper
            aria-label={column.label}
            component="section"
            key={column.status}
            sx={{ bgcolor: 'background.default', display: 'grid', gap: 1.5, p: 1.5 }}
            variant="outlined"
          >
            <Typography component="h2" variant="subtitle2">
              {column.label} · {loading ? '…' : columnTasks.length}
            </Typography>
            {loading ? (
              <Skeleton height={96} variant="rounded" />
            ) : columnTasks.length === 0 ? (
              <Typography color="text.secondary" variant="body2">
                Немає задач
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {columnTasks.map((task) => (
                  <WorkTaskCard
                    busy={busyTaskId === task.id}
                    key={task.id}
                    onEdit={onEdit}
                    onMove={onMove}
                    task={task}
                  />
                ))}
              </Stack>
            )}
          </Paper>
        );
      })}
    </Box>
  );
}
