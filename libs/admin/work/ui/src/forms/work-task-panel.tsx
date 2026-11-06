import { AdminEditPanel, CountedTextField } from '@admin/shared/ui';
import {
  workTaskDetailsMaxLength,
  workTaskIssues,
  workTaskTitleMaxLength,
} from '@admin/work/model';
import { Alert, Box, Button } from '@mui/material';
import { useState } from 'react';

import type { WorkTaskInput } from '@admin/work/model';
import type { ReactNode } from 'react';

interface WorkTaskPanelProps {
  title: string;
  subtitle?: ReactNode;
  initial: WorkTaskInput;
  saving: boolean;
  error?: string;
  onCancel: () => void;
  onSave: (input: WorkTaskInput) => void;
  /** Shown only for an existing own task. */
  onDelete?: () => void;
}

/** Title and details of a task in the right panel. Mount it per task (key). */
export function WorkTaskPanel({
  error,
  initial,
  onCancel,
  onDelete,
  onSave,
  saving,
  subtitle,
  title,
}: WorkTaskPanelProps) {
  const [input, setInput] = useState(initial);
  const [touched, setTouched] = useState(false);
  const issues = workTaskIssues(input);
  const valid = Object.keys(issues).length === 0;

  return (
    <AdminEditPanel
      actions={
        <>
          {onDelete ? (
            <Button color="error" disabled={saving} onClick={onDelete} sx={{ mr: 'auto' }}>
              Видалити
            </Button>
          ) : null}
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
        setTouched(true);
        if (valid) onSave(input);
      }}
      open
      subtitle={subtitle}
      title={title}
    >
      <Box sx={{ display: 'grid', gap: 2 }}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <CountedTextField
          error={touched ? issues.title : undefined}
          hint="Коротко: що треба зробити."
          label="Задача"
          maxLength={workTaskTitleMaxLength}
          onChange={(value) => setInput({ ...input, title: value })}
          value={input.title}
        />
        <CountedTextField
          error={issues.details}
          hint="Необовʼязково: посилання, список сторінок, деталі."
          label="Деталі"
          maxLength={workTaskDetailsMaxLength}
          multiline
          onChange={(value) => setInput({ ...input, details: value })}
          value={input.details}
        />
      </Box>
    </AdminEditPanel>
  );
}
