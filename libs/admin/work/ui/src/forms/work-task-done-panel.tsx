import { AdminEditPanel, CountedTextField } from '@admin/shared/ui';
import { workTaskResultIssue, workTaskResultMaxLength } from '@admin/work/model';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useState } from 'react';

import type { WorkTask } from '@admin/work/model';

interface WorkTaskDonePanelProps {
  task: WorkTask;
  saving: boolean;
  error?: string;
  onCancel: () => void;
  onDone: (result: string) => void;
}

/** «Готово»: what was done, for the administrator's report. Mount it per task (key). */
export function WorkTaskDonePanel({
  error,
  onCancel,
  onDone,
  saving,
  task,
}: WorkTaskDonePanelProps) {
  const [result, setResult] = useState(task.result ?? '');
  const issue = workTaskResultIssue(result);

  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={saving} onClick={onCancel}>
            Скасувати
          </Button>
          <Button disabled={saving || Boolean(issue)} type="submit" variant="contained">
            {saving ? 'Збереження…' : 'Готово'}
          </Button>
        </>
      }
      busy={saving}
      onClose={onCancel}
      onSubmit={(event) => {
        event.preventDefault();
        if (!issue) onDone(result);
      }}
      open
      subtitle={task.title}
      title="Задачу виконано"
    >
      <Box sx={{ display: 'grid', gap: 2 }}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Typography color="text.secondary" variant="body2">
          Адміністратор побачить це у звіті поруч зі списком змін, які ви зробили в адмінці.
        </Typography>
        <CountedTextField
          error={issue}
          hint="Наприклад: «Написав тексти для 12 категорій ручок, UK і RU»."
          label="Що зроблено"
          maxLength={workTaskResultMaxLength}
          multiline
          onChange={setResult}
          value={result}
        />
      </Box>
    </AdminEditPanel>
  );
}
