import { Navigate, Route, Routes } from 'react-router-dom';

import { DashboardPage } from '../../pages/dashboard/dashboard-page';
import { AdminLayout } from '../../widgets/layouts/admin-layout';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
