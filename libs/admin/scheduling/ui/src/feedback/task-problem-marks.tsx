import { taskMarks } from '@admin/scheduling/model';
import { StatusPill } from '@admin/shared/ui';
import { Stack } from '@mui/material';

import type { ScheduledTask } from '@admin/scheduling/model';

/** The task's problems as pills; nothing at all for a healthy task. */
export function TaskProblemMarks({ task }: { task: ScheduledTask }) {
  const marks = taskMarks(task);
  if (marks.length === 0) return null;
  return (
    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
      {marks.map((mark) => (
        <StatusPill key={mark.label} label={mark.label} tone={mark.tone} />
      ))}
    </Stack>
  );
}
