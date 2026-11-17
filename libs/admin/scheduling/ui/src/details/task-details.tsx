import { describeSchedule, formatKyivDateTime } from '@admin/scheduling/model';
import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';
import { Box, Stack, Typography } from '@mui/material';

import { TaskProblemMarks } from '../feedback/task-problem-marks';

import type { ScheduledTask } from '@admin/scheduling/model';

function Result({ at, text, error }: { at: string | null; text: string | null; error?: boolean }) {
  if (!at) return <>Ще не було</>;
  return (
    <Stack component="span" spacing={0.25}>
      <span>{formatKyivDateTime(at)}</span>
      {text ? (
        <Typography color={error ? 'error.main' : 'text.primary'} component="span" variant="body2">
          {text}
        </Typography>
      ) : null}
    </Stack>
  );
}

/** Read-only task: what it does, its schedule, and the last success and failure with the reason. */
export function TaskDetails({ task }: { task: ScheduledTask }) {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
      <SectionCard title="Задача">
        <Stack spacing={2}>
          <TaskProblemMarks task={task} />
          <Typography sx={{ whiteSpace: 'pre-line' }} variant="body2">
            {task.description}
          </Typography>
          <DetailFieldList>
            <DetailField
              label="Розклад"
              value={`${describeSchedule(task.schedule)}${task.editable ? '' : ' · не змінюється'}`}
            />
            <DetailField
              label="Наступний запуск"
              value={
                task.enabled || task.runRequestedAt
                  ? formatKyivDateTime(task.nextRunAt)
                  : 'Вимкнено'
              }
            />
            {task.isRunning ? (
              <DetailField label="Виконується з" value={formatKyivDateTime(task.runningSince)} />
            ) : null}
          </DetailFieldList>
        </Stack>
      </SectionCard>
      <SectionCard title="Результати">
        <DetailFieldList>
          <DetailField
            label="Остання успішна"
            value={<Result at={task.lastSuccessAt} text={task.lastSuccessSummary} />}
          />
          <DetailField
            label="Остання помилка"
            value={<Result at={task.lastFailureAt} error text={task.lastFailureReason} />}
          />
        </DetailFieldList>
      </SectionCard>
    </Box>
  );
}
