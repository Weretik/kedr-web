import { formatKyivDateTime } from '@admin/scheduling/model';
import { SectionCard } from '@admin/shared/ui';
import {
  Alert,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { ScheduledTaskRun } from '@admin/scheduling/model';

interface TaskRunHistoryProps {
  runs: readonly ScheduledTaskRun[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

const outcomes: Record<ScheduledTaskRun['outcome'], { label: string; color: string }> = {
  succeeded: { label: 'Успішно', color: 'text.secondary' },
  failed: { label: 'Помилка', color: 'error.main' },
  running: { label: 'Виконується', color: 'info.main' },
};

const how = (run: ScheduledTaskRun) =>
  run.trigger === 'schedule'
    ? 'За розкладом'
    : run.requestedBy
      ? `Вручну · ${run.requestedBy}`
      : 'Вручну';

function HistoryBody({ error, loading, onRetry, runs }: TaskRunHistoryProps) {
  if (loading) return <CircularProgress aria-label="Завантаження історії" size={20} />;
  if (error)
    return (
      <Alert action={<Button onClick={onRetry}>Повторити</Button>} severity="error">
        Не вдалося завантажити історію запусків.
      </Alert>
    );
  if (runs.length === 0)
    return (
      <Typography color="text.secondary" variant="body2">
        Запусків ще не було.
      </Typography>
    );
  return (
    <TableContainer>
      <Table aria-label="Історія запусків" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Коли</TableCell>
            <TableCell>Як</TableCell>
            <TableCell>Результат</TableCell>
            <TableCell>Повідомлення</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {runs.map((run) => (
            <TableRow key={run.id}>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {formatKyivDateTime(run.claimedAt)}
              </TableCell>
              <TableCell>{how(run)}</TableCell>
              <TableCell sx={{ color: outcomes[run.outcome].color, fontWeight: 600 }}>
                {outcomes[run.outcome].label}
              </TableCell>
              <TableCell>{run.message ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/** The last 50 runs, newest first: when, how it started, the result and its message. */
export function TaskRunHistory(props: TaskRunHistoryProps) {
  return (
    <SectionCard title="Історія запусків">
      <HistoryBody {...props} />
    </SectionCard>
  );
}
