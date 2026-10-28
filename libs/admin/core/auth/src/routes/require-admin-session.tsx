import { PageLoader } from '@admin/shared/ui';
import { Navigate, useLocation } from 'react-router-dom';

import { buildLoginPath } from './login-return-path';
import { NoAccessPage } from '../pages/no-access-page';
import { isStaff } from '../session/session-user';
import { useAdminSession } from '../session/use-admin-session';

import type { SessionUser } from '../session/session-user';
import type { ReactNode } from 'react';

interface RequireAdminSessionProps {
  children: (user: SessionUser) => ReactNode;
}

/** Renders the admin only for signed-in staff; otherwise the login page or "no access". */
export function RequireAdminSession({ children }: RequireAdminSessionProps) {
  const session = useAdminSession();
  const location = useLocation();

  if (session.status === 'loading') {
    return <PageLoader label="Перевірка сесії" />;
  }

  if (session.status === 'anonymous') {
    return <Navigate replace to={buildLoginPath(`${location.pathname}${location.search}`)} />;
  }

  if (!isStaff(session.user)) {
    return <NoAccessPage fullScreen />;
  }

  return <>{children(session.user)}</>;
}
