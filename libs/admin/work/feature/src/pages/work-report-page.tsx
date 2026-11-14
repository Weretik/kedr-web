import { AdminPageHeader, NoticeSnackbar } from '@admin/shared/ui';
import { useGetAdminWorkReportQuery } from '@admin/work/data-access';
import { emptyWorkTaskInput, lastDaysPeriod, workPeriodIssue } from '@admin/work/model';
import { WorkAssigneeField, WorkTaskPanel } from '@admin/work/ui';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Skeleton, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { WorkReportFilters } from '../components/report/work-report-filters';
import { WorkReportResults } from '../components/report/work-report-results';
import { useGiveWorkTask } from '../hooks/use-give-work-task';

import type { WorkReportPreset } from '../components/report/work-report-filters';
import type { WorkPeriod, WorkPerson } from '@admin/work/model';

interface WorkReportPageProps {
  staff: readonly WorkPerson[];
  staffLoading: boolean;
}

/** «Звіт роботи» for the administrator: one person, one period, tasks and changes. */
export function WorkReportPage({ staff, staffLoading }: WorkReportPageProps) {
  const [userId, setUserId] = useState('');
  const [preset, setPreset] = useState<WorkReportPreset>('7');
  const [custom, setCustom] = useState<WorkPeriod>(() => lastDaysPeriod(30));
  const giving = useGiveWorkTask(staff);

  const selected = userId || staff[0]?.id || '';
  const person = staff.find((member) => member.id === selected);
  const period = useMemo(
    () => (preset === 'custom' ? custom : lastDaysPeriod(Number(preset))),
    [custom, preset],
  );
  const periodIssue = workPeriodIssue(period);
  const report = useGetAdminWorkReportQuery(
    { userId: selected, ...period },
    { skip: !selected || Boolean(periodIssue) },
  );

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          <Button
            disabled={!person}
            onClick={() => giving.start(selected)}
            startIcon={<AddIcon />}
            variant="contained"
          >
            Дати задачу
          </Button>
        }
        title="Звіт роботи"
      />
      <Typography color="text.secondary" variant="body2">
        Що людина зробила за період: виконані задачі з її коментарем, відкриті задачі та всі зміни,
        які вона зберегла в адмінці. Зміни записуються автоматично.
      </Typography>
      <WorkReportFilters
        custom={custom}
        onCustomChange={setCustom}
        onPersonChange={setUserId}
        onPresetChange={setPreset}
        preset={preset}
        selected={selected}
        staff={staff}
        staffLoading={staffLoading}
      />
      {periodIssue ? <Alert severity="warning">{periodIssue}</Alert> : null}
      {!staffLoading && staff.length === 0 ? (
        <Alert severity="info">Немає співробітників. Додайте їх у «Користувачі».</Alert>
      ) : null}
      {report.isError ? (
        <Alert
          action={<Button onClick={() => report.refetch()}>Повторити</Button>}
          severity="error"
        >
          Не вдалося завантажити звіт. Спробуйте ще раз.
        </Alert>
      ) : null}
      {selected && !periodIssue && !report.isError ? (
        report.isLoading || !report.data ? (
          <Skeleton height={240} variant="rounded" />
        ) : (
          <WorkReportResults report={report.data} />
        )
      ) : null}
      {giving.assigneeId ? (
        <WorkTaskPanel
          error={giving.error}
          initial={emptyWorkTaskInput}
          leadingFields={
            <WorkAssigneeField
              disabled={giving.saving}
              onChange={giving.setAssigneeId}
              people={staff}
              value={giving.assigneeId}
            />
          }
          onCancel={giving.cancel}
          onSave={(input) => void giving.save(input)}
          saving={giving.saving}
          title="Нова задача"
        />
      ) : null}
      <NoticeSnackbar message={giving.notice} onClose={giving.clearNotice} />
    </Stack>
  );
}
