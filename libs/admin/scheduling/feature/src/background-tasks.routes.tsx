import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const BackgroundTasksPage = lazy(() => import('./pages/background-tasks-page'));
const BackgroundTaskPage = lazy(() => import('./pages/background-task-page'));

/** Admin only, as the backend policy RequireAdminRole; the app router wraps these in its role check. */
export const backgroundTasksRoutes: RouteObject[] = [
  { path: 'background-tasks', element: <BackgroundTasksPage /> },
  { path: 'background-tasks/:key', element: <BackgroundTaskPage /> },
];
