import { createContext, useContext } from 'react';

import type { PropsWithChildren } from 'react';

type LogoutAction = () => Promise<void>;

/** Signed-in staff member as the shell shows them; the app maps it from the auth session. */
export interface AdminShellUser {
  email: string;
  fullName: string;
  roleLabel: string;
  canManageUsers: boolean;
}

interface AdminShellSession {
  user: AdminShellUser | null;
  onLogout: LogoutAction | null;
}

const AdminShellSessionContext = createContext<AdminShellSession>({ user: null, onLogout: null });

interface AdminShellSessionProviderProps extends PropsWithChildren {
  user: AdminShellUser;
  onLogout: LogoutAction;
}

export function AdminShellSessionProvider({
  children,
  onLogout,
  user,
}: AdminShellSessionProviderProps) {
  return (
    <AdminShellSessionContext.Provider value={{ onLogout, user }}>
      {children}
    </AdminShellSessionContext.Provider>
  );
}

export function useAdminShellLogout() {
  return useContext(AdminShellSessionContext).onLogout;
}

export function useAdminShellUser() {
  return useContext(AdminShellSessionContext).user;
}
