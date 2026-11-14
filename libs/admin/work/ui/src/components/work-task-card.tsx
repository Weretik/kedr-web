import { RowEditAction } from '@admin/shared/ui';
import { formatWorkDayTime, formatWorkShortDay, formatWorkShortDayOf } from '@admin/work/model';
import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material';

import { WorkTaskSteps } from './work-task-steps';

import type { WorkTask, WorkTaskStatus } from '@admin/work/model';

interface WorkTaskCardProps {
  task: WorkTask;
  busy?: boolean;
  onEdit: (task: WorkTask) => void;
  /** «Готово» opens the result panel; other moves happen at once. */
  onMove: (task: WorkTask, status: WorkTaskStatus) => void;
  /** Ticks a step at once; without it the steps are read-only. */
  onToggleStep?: (task: WorkTask, index: number, isDone: boolean) => void;
}

const moves: Record<
  WorkTaskStatus,
  { status: WorkTaskStatus; label: string; primary?: boolean }[]
> = {
  Planned: [{ status: 'InProgress', label: 'Почати', primary: true }],
  InProgress: [
    { status: 'Done', label: 'Готово', primary: true },
    { status: 'Planned', label: 'У план' },
  ],
  Done: [{ status: 'InProgress', label: 'Повернути в роботу' }],
};

/** One task on the board: title, details, who gave it, the result when done, and moves to other columns. */
export function WorkTaskCard({ busy, onEdit, onMove, onToggleStep, task }: WorkTaskCardProps) {
  return (
    <Card
      sx={{
        borderColor: task.isOverdue ? 'error.main' : undefined,
        borderLeftWidth: task.isOverdue ? 4 : undefined,
        display: 'grid',
        gap: 1,
        p: 2,
      }}
      variant="outlined"
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
        <Typography sx={{ flex: 1, fontWeight: 600, overflowWrap: 'anywhere' }} variant="body2">
          {task.title}
        </Typography>
        <RowEditAction
          label={`Редагувати задачу ${task.title}`}
          onEdit={() => onEdit(task)}
          title="Редагувати задачу"
        />
      </Stack>
      {task.details ? (
        <Typography
          color="text.secondary"
          sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-line' }}
          variant="body2"
        >
          {task.details}
        </Typography>
      ) : null}
      {task.dueDate || task.isOverdue ? (
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
          useFlexGap
        >
          {task.isOverdue ? <Chip color="error" label="Прострочено" size="small" /> : null}
          {task.dueDate ? (
            <Typography
              color={task.isOverdue ? 'error' : 'text.secondary'}
              sx={{ fontWeight: task.isOverdue ? 600 : undefined }}
              variant="caption"
            >
              Виконати до {formatWorkShortDay(task.dueDate)}
            </Typography>
          ) : null}
        </Stack>
      ) : null}
      <WorkTaskSteps
        busy={busy}
        onToggle={onToggleStep ? (index, done) => onToggleStep(task, index, done) : undefined}
        task={task}
      />
      {task.status === 'Done' && task.result ? (
        <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, px: 1.5, py: 1 }}>
          <Typography color="text.secondary" variant="caption">
            Що зроблено
          </Typography>
          <Typography sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-line' }} variant="body2">
            {task.result}
          </Typography>
        </Box>
      ) : null}
      <Typography color="text.secondary" variant="caption">
        {task.createdByOwner ? '' : 'Від адміністратора · '}
        Поставлено {formatWorkShortDayOf(task.createdAt)}
        {task.status === 'Done' && task.completedAt
          ? ` · Виконано ${formatWorkDayTime(task.completedAt)}`
          : ''}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }} useFlexGap>
        {moves[task.status].map((move) => (
          <Button
            disabled={busy}
            key={move.status}
            onClick={() => onMove(task, move.status)}
            size="small"
            variant={move.primary ? 'contained' : 'outlined'}
          >
            {move.label}
          </Button>
        ))}
      </Stack>
    </Card>
  );
}
