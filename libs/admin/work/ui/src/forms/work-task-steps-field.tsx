import { workTaskStepMaxLength, workTaskStepsMaxCount } from '@admin/work/model';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Button, Checkbox, IconButton, Stack, TextField, Typography } from '@mui/material';

import type { WorkTaskStep } from '@admin/work/model';

interface WorkTaskStepsFieldProps {
  steps: readonly WorkTaskStep[];
  onChange: (steps: WorkTaskStep[]) => void;
  error?: string;
  disabled?: boolean;
}

/** «Кроки»: the task split into short lines; each can be ticked here or on the board. */
export function WorkTaskStepsField({ disabled, error, onChange, steps }: WorkTaskStepsFieldProps) {
  const change = (index: number, step: WorkTaskStep) =>
    onChange(steps.map((current, at) => (at === index ? step : current)));

  return (
    <Box component="fieldset" sx={{ border: 0, display: 'grid', gap: 1, m: 0, p: 0 }}>
      <Typography component="legend" sx={{ fontWeight: 600, mb: 0.5 }} variant="body2">
        Кроки
      </Typography>
      {steps.map((step, index) => (
        <Stack direction="row" key={index} spacing={0.5} sx={{ alignItems: 'center' }}>
          <Checkbox
            checked={step.isDone}
            disabled={disabled}
            onChange={(event) => change(index, { ...step, isDone: event.target.checked })}
            slotProps={{ input: { 'aria-label': `Крок ${index + 1} виконано` } }}
          />
          <TextField
            disabled={disabled}
            fullWidth
            onChange={(event) => change(index, { ...step, title: event.target.value })}
            placeholder="Що зробити"
            size="small"
            slotProps={{
              htmlInput: { 'aria-label': `Крок ${index + 1}`, maxLength: workTaskStepMaxLength },
            }}
            value={step.title}
          />
          <IconButton
            aria-label={`Прибрати крок ${index + 1}`}
            disabled={disabled}
            onClick={() => onChange(steps.filter((_, at) => at !== index))}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      ))}
      <Box>
        <Button
          disabled={disabled || steps.length >= workTaskStepsMaxCount}
          onClick={() => onChange([...steps, { title: '', isDone: false }])}
          size="small"
          startIcon={<AddIcon />}
        >
          Додати крок
        </Button>
      </Box>
      {error ? (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      ) : (
        <Typography color="text.secondary" variant="caption">
          Необовʼязково: розбийте задачу на кроки, до {workTaskStepsMaxCount}. Порожні рядки не
          зберігаються.
        </Typography>
      )}
    </Box>
  );
}
