import { formatKyivDateTime } from '@admin/scheduling/model';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import type { ScheduledTask } from '@admin/scheduling/model';

type LastRunTask = Pick<
  ScheduledTask,
  | 'name'
  | 'lastRunFailed'
  | 'lastSuccessAt'
  | 'lastSuccessSummary'
  | 'lastFailureAt'
  | 'lastFailureReason'
>;

/** The latest run in one cell: a failure is marked with a «Детальніше» dialog, a success is plain. */
export function LastRunCell({ task }: { task: LastRunTask }) {
  const [open, setOpen] = useState(false);

  if (task.lastRunFailed) {
    return (
      <Stack alignItems="flex-start" spacing={0.5}>
        <Typography variant="body2">{formatKyivDateTime(task.lastFailureAt)}</Typography>
        <Typography color="error.main" sx={{ fontWeight: 600 }} variant="caption">
          Помилка
        </Typography>
        <Button
          aria-label={`Детальніше про помилку задачі ${task.name}`}
          onClick={() => setOpen(true)}
          size="small"
          variant="outlined"
        >
          Детальніше
        </Button>
        <Dialog fullWidth maxWidth="sm" onClose={() => setOpen(false)} open={open}>
          <DialogTitle>Помилка: {task.name}</DialogTitle>
          <DialogContent>
            <Typography sx={{ whiteSpace: 'pre-line' }} variant="body2">
              {task.lastFailureReason ?? 'Причину не вказано.'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Закрити</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    );
  }

  if (!task.lastSuccessAt) return <>—</>;

  return (
    <Stack spacing={0.25}>
      <Typography variant="body2">{formatKyivDateTime(task.lastSuccessAt)}</Typography>
      {task.lastSuccessSummary ? (
        <Typography color="text.secondary" variant="caption">
          {task.lastSuccessSummary}
        </Typography>
      ) : null}
    </Stack>
  );
}
