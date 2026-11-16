import { AdminEditPanel } from '@admin/shared/ui';
import {
  Alert,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { ScheduleKindFields } from '../forms/schedule-kind-fields';

import type { ScheduleFormErrors, ScheduleFormValues, ScheduleKind } from '@admin/scheduling/model';

interface TaskSchedulePanelProps {
  taskName: string;
  values: ScheduleFormValues;
  errors: ScheduleFormErrors;
  serverError: string | null;
  /** Why switching the task off holds work back; shown while the form would pause it. */
  pauseWarning?: string | null;
  saving: boolean;
  onChange: (changes: Partial<ScheduleFormValues>) => void;
  onCancel: () => void;
  onSave: () => void;
}

const kinds: { value: ScheduleKind; label: string }[] = [
  { value: 'daily', label: 'За днями й часом' },
  { value: 'interval', label: 'Через інтервал' },
  { value: 'manual', label: 'Лише вручну' },
];

/** «Змінити розклад»: on/off, the kind with its fields, and an optional one-time next run. */
export function TaskSchedulePanel({
  errors,
  onCancel,
  onChange,
  onSave,
  pauseWarning = null,
  saving,
  serverError,
  taskName,
  values,
}: TaskSchedulePanelProps) {
  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={saving} onClick={onCancel}>
            Скасувати
          </Button>
          <Button disabled={saving} type="submit" variant="contained">
            {saving ? 'Збереження…' : 'Зберегти'}
          </Button>
        </>
      }
      busy={saving}
      onClose={onCancel}
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
      open
      subtitle={taskName}
      title="Змінити розклад"
    >
      <Stack spacing={3}>
        {serverError ? <Alert severity="error">{serverError}</Alert> : null}
        {pauseWarning ? <Alert severity="warning">{pauseWarning}</Alert> : null}
        <FormControlLabel
          control={
            <Switch
              checked={values.enabled}
              onChange={(event) => onChange({ enabled: event.target.checked })}
            />
          }
          label="Увімкнено"
        />
        <Stack spacing={1}>
          <Typography id="schedule-kind-label" variant="subtitle2">
            Як запускати
          </Typography>
          <RadioGroup
            aria-labelledby="schedule-kind-label"
            onChange={(event) => onChange({ kind: event.target.value as ScheduleKind })}
            value={values.kind}
          >
            {kinds.map((kind) => (
              <FormControlLabel
                control={<Radio />}
                key={kind.value}
                label={kind.label}
                value={kind.value}
              />
            ))}
          </RadioGroup>
        </Stack>
        <ScheduleKindFields errors={errors} onChange={onChange} values={values} />
        <TextField
          error={Boolean(errors.nextRunAt)}
          helperText={
            errors.nextRunAt ??
            'Необовʼязково: перенести один найближчий запуск. Далі — за розкладом.'
          }
          label="Наступний запуск (Київ)"
          onChange={(event) => onChange({ nextRunAt: event.target.value })}
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          type="datetime-local"
          value={values.nextRunAt}
        />
      </Stack>
    </AdminEditPanel>
  );
}
