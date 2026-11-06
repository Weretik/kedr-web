import { lazy } from 'react';

<<<<<<< HEAD
import type { WorkPerson } from '@admin/work/model';
=======
>>>>>>> origin/claude/project-thread-9r9gtc
import type { RouteObject } from 'react-router-dom';

const MyTasksPage = lazy(() => import('./pages/my-tasks-page'));
const WorkReportPage = lazy(() =>
  import('./pages/work-report-page').then((module) => ({ default: module.WorkReportPage })),
);

<<<<<<< HEAD
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
export function createWorkReportRoutes({ useStaffMembers }: WorkReportRoutesOptions): RouteObject[] {
=======
/** A staff member the report can be read for; the app maps it from the users list. */
export interface StaffMember {
  id: string;
  name: string;
  roleLabel: string;
}

/** «Мої задачі»: every staff role, as the backend policy RequireManagerRole. */
export const myTasksRoutes: RouteObject[] = [{ path: 'my-tasks', element: <MyTasksPage /> }];

interface WorkReportRoutesOptions {
  /** Staff members for the person picker; AppRouter reads them from the users list. */
  useStaffMembers: () => { staff: readonly StaffMember[]; loading: boolean };
}

/** «Звіт роботи»: Admin only, as the backend policy RequireAdminRole; AppRouter wraps it in RequireRole. */
export function createWorkReportRoutes({
  useStaffMembers,
}: WorkReportRoutesOptions): RouteObject[] {
>>>>>>> origin/claude/project-thread-9r9gtc
  function WorkReportRoute() {
    const { loading, staff } = useStaffMembers();
    return <WorkReportPage staff={staff} staffLoading={loading} />;
  }

  return [{ path: 'work-report', element: <WorkReportRoute /> }];
}
