import { lazy } from 'react';

import type { WorkPerson } from '@admin/work/model';
import type { RouteObject } from 'react-router-dom';

const MyTasksPage = lazy(() => import('./pages/my-tasks-page'));
const WorkReportPage = lazy(() =>
  import('./pages/work-report-page').then((module) => ({ default: module.WorkReportPage })),
);

/** People an administrator may give a task to, and the administrator's own id. */
export interface WorkAssignees {
  people: readonly WorkPerson[];
  selfId: string;
}

interface MyTasksRoutesOptions {
  /** Administrator: the staff list for «Для кого»; everyone else: null. */
  useAssignees: () => WorkAssignees | null;
}

/** «Мої задачі»: every staff role, as the backend policy RequireManagerRole. */
export function createMyTasksRoutes({ useAssignees }: MyTasksRoutesOptions): RouteObject[] {
  function MyTasksRoute() {
    return <MyTasksPage assignees={useAssignees()} />;
  }

  return [{ path: 'my-tasks', element: <MyTasksRoute /> }];
}

interface WorkReportRoutesOptions {
  /** Staff members for the person picker; AppRouter reads them from the users list. */
  useStaffMembers: () => { staff: readonly WorkPerson[]; loading: boolean };
}

/** «Звіт роботи»: Admin only, as the backend policy RequireAdminRole; AppRouter wraps it in RequireRole. */
export function createWorkReportRoutes({
  useStaffMembers,
}: WorkReportRoutesOptions): RouteObject[] {
  function WorkReportRoute() {
    const { loading, staff } = useStaffMembers();
    return <WorkReportPage staff={staff} staffLoading={loading} />;
  }

  return [{ path: 'work-report', element: <WorkReportRoute /> }];
}
