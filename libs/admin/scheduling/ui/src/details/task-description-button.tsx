import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import type { ScheduledTask } from '@admin/scheduling/model';

/** A prominent «Що робить?» button that opens the full task description in a dialog. */
export function TaskDescriptionButton({
  task,
}: {
  task: Pick<ScheduledTask, 'name' | 'description'>;
}) {
  const [open, setOpen] = useState(false);
  const titleId = 'task-description-title';

  return (
    <>
      <Button
        aria-label={`Що робить задача ${task.name}?`}
        onClick={() => setOpen(true)}
        size="small"
        startIcon={<HelpOutlineOutlinedIcon fontSize="small" />}
        sx={{ alignSelf: 'flex-start' }}
        variant="outlined"
      >
        Що робить?
      </Button>
      <Dialog
        aria-labelledby={titleId}
        fullWidth
        maxWidth="sm"
        onClose={() => setOpen(false)}
        open={open}
      >
        <DialogTitle id={titleId}>{task.name}</DialogTitle>
        <DialogContent>
          <Typography sx={{ whiteSpace: 'pre-line' }} variant="body2">
            {task.description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Закрити</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
