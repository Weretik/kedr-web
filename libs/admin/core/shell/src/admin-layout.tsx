import { Box, Container, Drawer, keyframes } from '@mui/material';
import { Suspense, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { AdminSidebar } from './components/layout/admin-sidebar';
import { RouteLoadingFallback } from './components/layout/route-loading-fallback';
import {
  adminDrawerCollapsedWidth,
  adminDrawerWidth,
} from './components/navigation/admin-navigation';
import { useNavigationCollapsed } from './components/navigation/use-navigation-collapsed';
import { AdminTopBar } from './components/top-bar/admin-top-bar';

const pageEnter = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
`;

interface AdminLayoutProps {
  currentOrderPositionCount?: number;
}

const drawerPaperSx = {
  bgcolor: 'background.paper',
  borderRight: 1,
  borderColor: 'divider',
  boxSizing: 'border-box',
} as const;

export function AdminLayout({ currentOrderPositionCount = 0 }: AdminLayoutProps) {
  const { pathname } = useLocation();
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const { isCollapsed, toggleCollapsed } = useNavigationCollapsed();
  const desktopDrawerWidth = isCollapsed ? adminDrawerCollapsedWidth : adminDrawerWidth;

  const closeMobileNavigation = () => {
    setIsMobileNavigationOpen(false);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Drawer
        slotProps={{
          paper: {
            sx: (theme) => ({
              ...drawerPaperSx,
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                duration: theme.transitions.duration.complex,
              }),
              width: desktopDrawerWidth,
            }),
          },
        }}
        sx={{ display: { xs: 'none', lg: 'block' } }}
        variant="permanent"
      >
        <AdminSidebar
          currentOrderPositionCount={currentOrderPositionCount}
          isCollapsed={isCollapsed}
          onToggleCollapsed={toggleCollapsed}
        />
      </Drawer>

      <Drawer
        ModalProps={{ keepMounted: true }}
        onClose={closeMobileNavigation}
        open={isMobileNavigationOpen}
        slotProps={{ paper: { sx: { ...drawerPaperSx, width: adminDrawerWidth } } }}
        sx={{ display: { lg: 'none' } }}
        variant="temporary"
      >
        <AdminSidebar
          currentOrderPositionCount={currentOrderPositionCount}
          onNavigate={closeMobileNavigation}
        />
      </Drawer>

      <Box
        sx={(theme) => ({
          marginLeft: { lg: `${desktopDrawerWidth}px` },
          minWidth: 0,
          transition: theme.transitions.create('margin-left', {
            duration: theme.transitions.duration.complex,
          }),
        })}
      >
        <AdminTopBar
          currentOrderPositionCount={currentOrderPositionCount}
          onOpenNavigation={() => setIsMobileNavigationOpen(true)}
        />
        <Box component="main">
          <Container maxWidth="xl" sx={{ py: { xs: 3, lg: 5 }, px: { xs: 2, sm: 3, lg: 5 } }}>
            <Box
              key={pathname}
              sx={(theme) => ({
                animation: `${pageEnter} ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeOut} both`,
              })}
            >
              <Suspense fallback={<RouteLoadingFallback />}>
                <Outlet />
              </Suspense>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
