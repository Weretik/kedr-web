import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const UsersPage = lazy(() => import('./pages/users-page'));

export interface UsersRouteOptions {
  /** Hook from the app that returns the signed-in user's ID, so the page can protect the admin's own account. */
  useCurrentUserId: () => string | null;
}

export function createUsersRoutes({ useCurrentUserId }: UsersRouteOptions): RouteObject[] {
  function UsersRoute() {
    return <UsersPage currentUserId={useCurrentUserId()} />;
  }

  return [{ path: 'users', element: <UsersRoute /> }];
}
