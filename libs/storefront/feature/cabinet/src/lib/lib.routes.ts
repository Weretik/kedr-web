import { Route } from '@angular/router';
import { adminAuthGuard } from '@shared/auth';

export const storefrontFeatureCabinetRoutes: Route[] = [
  {
    path: 'cabinet',
    canMatch: [adminAuthGuard],
    loadComponent: () =>
      import('./layouts/cabinet-sidebar/cabinet-sidebar').then(
        (m) => m.CabinetSidebar,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/cabinet-dashboard/cabinet-dashboard.page').then(
            (m) => m.CabinetDashboardPage,
          ),
      },
    ],
  },
];
