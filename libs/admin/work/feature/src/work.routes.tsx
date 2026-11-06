import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const MyTasksPage = lazy(() => import('./pages/my-tasks-page'));
const WorkReportPage = lazy(() =>
  import('./pages/work-report-page').then((module) => ({ default: module.WorkReportPage })),
);

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
  function WorkReportRoute() {
    const { loading, staff } = useStaffMembers();
    return <WorkReportPage staff={staff} staffLoading={loading} />;
  }

  return [{ path: 'work-report', element: <WorkReportRoute /> }];
}
