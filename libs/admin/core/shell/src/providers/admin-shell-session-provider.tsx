import { createContext, useContext } from 'react';

import type { PropsWithChildren } from 'react';

type LogoutAction = () => Promise<void>;

const AdminShellLogoutContext = createContext<LogoutAction | null>(null);

interface AdminShellSessionProviderProps extends PropsWithChildren {
  onLogout: LogoutAction;
}

export function AdminShellSessionProvider({ children, onLogout }: AdminShellSessionProviderProps) {
  return <AdminShellLogoutContext.Provider value={onLogout}>{children}</AdminShellLogoutContext.Provider>;
}

export function useAdminShellLogout() {
  return useContext(AdminShellLogoutContext);
}
