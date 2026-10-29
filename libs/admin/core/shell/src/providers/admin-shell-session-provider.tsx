import { createContext, useContext } from 'react';

import type { PropsWithChildren } from 'react';

type LogoutAction = () => Promise<void>;

/** Signed-in staff member as the shell shows them; the app maps it from the auth session. */
export interface AdminShellUser {
  email: string;
  fullName: string;
  roleLabel: string;
  /** Admin sees "ADMIN" and "Кабінет адміністратора"; a manager sees the manager variants. */
  isAdmin: boolean;
  avatarUrl: string | null;
  canManageUsers: boolean;
}

interface AdminShellSession {
  user: AdminShellUser | null;
  onLogout: LogoutAction | null;
  /** Route of the signed-in user's own profile page ("Мій кабінет"). */
  profileHref: string | null;
}

const AdminShellSessionContext = createContext<AdminShellSession>({
  user: null,
  onLogout: null,
  profileHref: null,
});

interface AdminShellSessionProviderProps extends PropsWithChildren {
  user: AdminShellUser;
  onLogout: LogoutAction;
  profileHref: string;
}

export function AdminShellSessionProvider({
  children,
  onLogout,
  profileHref,
  user,
}: AdminShellSessionProviderProps) {
  return (
    <AdminShellSessionContext.Provider value={{ onLogout, profileHref, user }}>
      {children}
    </AdminShellSessionContext.Provider>
  );
}

export function useAdminShellLogout() {
  return useContext(AdminShellSessionContext).onLogout;
}

export function useAdminShellProfileHref() {
  return useContext(AdminShellSessionContext).profileHref;
}

export function useAdminShellUser() {
  return useContext(AdminShellSessionContext).user;
}
