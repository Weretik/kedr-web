import { useGetMyWorkTasksQuery } from '@admin/work/data-access';
import { WorkTasksOverviewCard } from '@admin/work/ui';

import { myTasksPath } from '../work.paths';

/**
 * «Мої задачі» card for «Огляд». Shown only while the signed-in person has open tasks;
 * a failed or empty load shows nothing, the board itself reports errors.
 */
export function MyTasksOverview() {
  const { data } = useGetMyWorkTasksQuery();
  const open = (data ?? []).filter((task) => task.status !== 'Done');
  if (open.length === 0) return null;

  return (
    <WorkTasksOverviewCard
      fromAdmin={open.filter((task) => !task.createdByOwner).length}
      href={myTasksPath}
      inProgress={open.filter((task) => task.status === 'InProgress').length}
      planned={open.filter((task) => task.status === 'Planned').length}
    />
  );
}
