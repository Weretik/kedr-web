import { describeSchedule, formatKyivDateTime } from '@admin/scheduling/model';
import { RowEditAction } from '@admin/shared/ui';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Alert,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import { TaskDescriptionButton } from '../details/task-description-button';
import { LastRunCell } from '../feedback/last-run-cell';
import { TaskProblemMarks } from '../feedback/task-problem-marks';

import type { ScheduledTask } from '@admin/scheduling/model';

interface BackgroundTasksTableProps {
  tasks: readonly ScheduledTask[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onView: (task: ScheduledTask) => void;
  onEdit: (task: ScheduledTask) => void;
}

/** Every task in the backend's order with its schedule and last results; only problems are marked. */
export function BackgroundTasksTable({
  error,
  loading,
  onEdit,
  onRetry,
  onView,
  tasks,
}: BackgroundTasksTableProps) {
  if (error) {
    return (
      <Alert action={<Button onClick={onRetry}>Повторити</Button>} severity="error">
        Не вдалося завантажити фонові задачі.
      </Alert>
    );
  }

  return (
    <TableContainer>
      <Table aria-busy={loading} aria-label="Фонові задачі" sx={{ minWidth: 960 }}>
        <TableHead>
          <TableRow>
            <TableCell>Задача</TableCell>
            <TableCell>Розклад</TableCell>
            <TableCell>Наступний запуск</TableCell>
            <TableCell>Останній запуск</TableCell>
            <TableCell align="right">Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading && tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>Задач немає.</TableCell>
            </TableRow>
          ) : null}
          {tasks.map((task) => (
            <TableRow hover key={task.key}>
              <TableCell sx={{ maxWidth: 520 }}>
                <Stack spacing={0.5}>
                  <Typography sx={{ fontWeight: 600 }} variant="body2">
                    {task.name}
                  </Typography>
                  <TaskDescriptionButton task={task} />
                  <TaskProblemMarks task={task} />
                </Stack>
              </TableCell>
              <TableCell>{describeSchedule(task.schedule)}</TableCell>
              <TableCell>
                {task.enabled || task.runRequestedAt ? formatKyivDateTime(task.nextRunAt) : '—'}
              </TableCell>
              <TableCell>
                <LastRunCell task={task} />
              </TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                <Tooltip title="Переглянути задачу">
                  <IconButton
                    aria-label={`Переглянути задачу ${task.name}`}
                    onClick={() => onView(task)}
                    size="small"
                  >
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {task.editable ? (
                  <RowEditAction
                    label={`Змінити розклад задачі ${task.name}`}
                    onEdit={() => onEdit(task)}
                    title="Змінити розклад"
                  />
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
