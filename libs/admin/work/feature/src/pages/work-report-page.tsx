import { AdminPageHeader, NoticeSnackbar, SectionCard } from '@admin/shared/ui';
import {
  useCreateAdminWorkTaskMutation,
  useGetAdminWorkReportQuery,
} from '@admin/work/data-access';
import { emptyWorkTaskInput, lastDaysPeriod, workPeriodIssue } from '@admin/work/model';
import { WorkActivityList, WorkTaskPanel, WorkTaskSummaryList } from '@admin/work/ui';
import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

import { workErrorMessage } from '../errors/work-error-message';

import type { StaffMember } from '../work.routes';
import type { WorkPeriod, WorkTaskInput } from '@admin/work/model';

interface WorkReportPageProps {
  staff: readonly StaffMember[];
  staffLoading: boolean;
}

type Preset = '7' | '30' | 'custom';

/** «Звіт роботи» for the administrator: one person, one period, tasks and changes. */
export function WorkReportPage({ staff, staffLoading }: WorkReportPageProps) {
  const [userId, setUserId] = useState('');
  const [preset, setPreset] = useState<Preset>('7');
  const [custom, setCustom] = useState<WorkPeriod>(() => lastDaysPeriod(30));
  const [giving, setGiving] = useState(false);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string | null>(null);
  const [give, given] = useCreateAdminWorkTaskMutation();

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

  const save = async (input: WorkTaskInput) => {
    setError(undefined);
    try {
      await give({ ownerUserId: selected, input }).unwrap();
      setGiving(false);
      setNotice('Задачу додано в «План» цієї людини.');
    } catch (cause) {
      setError(workErrorMessage(cause));
    }
  };

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          <Button
            disabled={!person}
            onClick={() => {
              setError(undefined);
              setGiving(true);
            }}
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
      <Box
        sx={{
          alignItems: 'center',
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 320px) auto 1fr' },
        }}
      >
        <TextField
          disabled={staffLoading || staff.length === 0}
          label="Хто"
          onChange={(event) => setUserId(event.target.value)}
          select
          size="small"
          value={selected}
        >
          {staff.map((member) => (
            <MenuItem key={member.id} value={member.id}>
              {member.name} · {member.roleLabel}
            </MenuItem>
          ))}
        </TextField>
        <ToggleButtonGroup
          aria-label="Період"
          exclusive
          onChange={(_event, value: Preset | null) => value && setPreset(value)}
          size="small"
          value={preset}
        >
          <ToggleButton value="7">7 днів</ToggleButton>
          <ToggleButton value="30">30 днів</ToggleButton>
          <ToggleButton value="custom">Свій період</ToggleButton>
        </ToggleButtonGroup>
        {preset === 'custom' ? (
          <Stack direction="row" spacing={1}>
            <TextField
              label="З"
              onChange={(event) => setCustom({ ...custom, from: event.target.value })}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              type="date"
              value={custom.from}
            />
            <TextField
              label="По"
              onChange={(event) => setCustom({ ...custom, to: event.target.value })}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              type="date"
              value={custom.to}
            />
          </Stack>
        ) : null}
      </Box>
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
          <Box
            sx={{
              alignItems: 'start',
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 3fr)' },
            }}
          >
            <Stack spacing={2}>
              <SectionCard title={`Виконано · ${report.data.doneTasks.length}`}>
                <WorkTaskSummaryList
                  emptyText="За цей період виконаних задач немає."
                  tasks={report.data.doneTasks}
                />
              </SectionCard>
              <SectionCard title={`Відкриті задачі · ${report.data.openTasks.length}`}>
                <WorkTaskSummaryList
                  emptyText="Відкритих задач немає."
                  tasks={report.data.openTasks}
                />
              </SectionCard>
            </Stack>
            <SectionCard title={`Зміни в адмінці · ${report.data.activity.length}`}>
              <WorkActivityList
                activity={report.data.activity}
                emptyText="За цей період змін в адмінці немає."
                truncated={report.data.activityTruncated}
              />
            </SectionCard>
          </Box>
        )
      ) : null}
      {giving && person ? (
        <WorkTaskPanel
          error={error}
          initial={emptyWorkTaskInput}
          onCancel={() => setGiving(false)}
          onSave={(input) => void save(input)}
          saving={given.isLoading}
          subtitle={person.name}
          title="Нова задача"
        />
      ) : null}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}
