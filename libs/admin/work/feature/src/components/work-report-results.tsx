import { SectionCard } from '@admin/shared/ui';
import { WorkActivityList, WorkTaskSummaryList } from '@admin/work/ui';
import { Box, Stack } from '@mui/material';

import type { WorkReport } from '@admin/work/model';

const overdueText = (count: number) => (count > 0 ? `, прострочено ${count}` : '');

/** Done and open tasks beside every change the person saved in the admin. */
export function WorkReportResults({ report }: { report: WorkReport }) {
  return (
    <Box
      sx={{
        alignItems: 'start',
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 3fr)' },
      }}
    >
      <Stack spacing={2}>
        <SectionCard title={`Виконано · ${report.doneTasks.length}`}>
          <WorkTaskSummaryList
            emptyText="За цей період виконаних задач немає."
            tasks={report.doneTasks}
          />
        </SectionCard>
        <SectionCard
          title={`Відкриті задачі · ${report.openTasks.length}${overdueText(
            report.openTasks.filter((task) => task.isOverdue).length,
          )}`}
        >
          <WorkTaskSummaryList emptyText="Відкритих задач немає." tasks={report.openTasks} />
        </SectionCard>
      </Stack>
      <SectionCard title={`Зміни в адмінці · ${report.activity.length}`}>
        <WorkActivityList
          activity={report.activity}
          emptyText="За цей період змін в адмінці немає."
          truncated={report.activityTruncated}
        />
      </SectionCard>
    </Box>
  );
}
