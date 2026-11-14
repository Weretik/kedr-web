import { workTaskStepProgress } from '@admin/work/model';
import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import type { WorkTask } from '@admin/work/model';

interface WorkTaskStepsProps {
  task: WorkTask;
  busy?: boolean;
  /** Without it the steps are read-only. */
  onToggle?: (index: number, done: boolean) => void;
}

/** The steps of a task with their progress; nothing when the task has no steps. */
export function WorkTaskSteps({ busy, onToggle, task }: WorkTaskStepsProps) {
  const progress = workTaskStepProgress(task);
  if (progress.total === 0) return null;
  return (
    <Box>
      <Typography color="text.secondary" variant="caption">
        Кроки {progress.done} / {progress.total}
      </Typography>
      <Stack>
        {task.steps.map((step, index) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={step.isDone}
                disabled={busy || !onToggle}
                onChange={(event) => onToggle?.(index, event.target.checked)}
                size="small"
              />
            }
            key={index}
            label={
              <Typography
                color={step.isDone ? 'text.secondary' : 'text.primary'}
                sx={{
                  overflowWrap: 'anywhere',
                  textDecoration: step.isDone ? 'line-through' : undefined,
                }}
                variant="body2"
              >
                {step.title}
              </Typography>
            }
            sx={{ alignItems: 'flex-start', mr: 0, '& .MuiCheckbox-root': { py: 0.25 } }}
          />
        ))}
      </Stack>
    </Box>
  );
}
