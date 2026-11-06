import { AdminPageHeader, NoticeSnackbar, SectionCard } from '@admin/shared/ui';
import { useGetMyWorkReportQuery } from '@admin/work/data-access';
import { lastDaysPeriod } from '@admin/work/model';
import { WorkActivityList } from '@admin/work/ui';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Skeleton, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { MyTasksBoard } from '../components/my-tasks-board';

<<<<<<< HEAD
import type { WorkAssignees } from '../work.routes';

interface MyTasksPageProps {
  /** Administrator only: whom a new task may be given to. */
  assignees?: WorkAssignees | null;
}

/** «Мої задачі»: the own board and what the signed-in staff member changed in the last 7 days. */
export function MyTasksPage({ assignees = null }: MyTasksPageProps) {
=======
/** «Мої задачі»: the own board and what the signed-in staff member changed in the last 7 days. */
export function MyTasksPage() {
>>>>>>> origin/claude/project-thread-9r9gtc
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const period = useMemo(() => lastDaysPeriod(7), []);
  const report = useGetMyWorkReportQuery(period);

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          <Button onClick={() => setCreating(true)} startIcon={<AddIcon />} variant="contained">
            Нова задача
          </Button>
        }
        title="Мої задачі"
      />
      <Typography color="text.secondary" variant="body2">
        Ставте собі задачі й переносьте їх «План → В роботі → Готово». Коли закриваєте задачу,
        напишіть, що зроблено. Адміністратор бачить задачі та список ваших змін в адмінці.
      </Typography>
<<<<<<< HEAD
      <MyTasksBoard
        assignees={assignees}
        creating={creating} onCreatingChange={setCreating} onNotice={setNotice} />
=======
      <MyTasksBoard creating={creating} onCreatingChange={setCreating} onNotice={setNotice} />
>>>>>>> origin/claude/project-thread-9r9gtc
      <SectionCard title="Що я змінив за 7 днів">
        {report.isError ? (
          <Alert severity="error">Не вдалося завантажити зміни.</Alert>
        ) : report.isLoading ? (
          <Skeleton height={120} variant="rounded" />
        ) : (
          <WorkActivityList
            activity={report.data?.activity ?? []}
            emptyText="За 7 днів змін в адмінці ще немає."
            truncated={report.data?.activityTruncated}
          />
        )}
      </SectionCard>
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default MyTasksPage;
