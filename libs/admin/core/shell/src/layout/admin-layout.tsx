import { Box, Container, Drawer, keyframes } from '@mui/material';
import { Suspense, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { AdminSidebar } from './admin-sidebar';
import { RouteLoadingFallback } from './route-loading-fallback';
import { RouteErrorBoundary } from '../error-pages/route-error-boundary';
import { adminDrawerCollapsedWidth, adminDrawerWidth } from '../navigation/admin-navigation';
import { sidebarColors } from '../navigation/sidebar-colors';
import { useNavigationCollapsed } from '../navigation/use-navigation-collapsed';
import { AdminTopBar } from '../top-bar/admin-top-bar';

import type { ReactNode } from 'react';

const pageEnter = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
`;

interface AdminLayoutProps {
  currentOrderPositionCount?: number;
  /** Domain buttons for the top bar, given by the app (the shell does not import domains). */
  topBarActions?: ReactNode;
}

const drawerPaperSx = {
  bgcolor: sidebarColors.background,
  borderRight: 1,
  borderColor: sidebarColors.border,
  boxSizing: 'border-box',
  // The drawer is dark in both themes, so its scrollbar must be dark and thin too.
  colorScheme: 'dark',
  scrollbarColor: `${sidebarColors.scrollbarThumb} transparent`,
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: sidebarColors.scrollbarThumb,
    borderRadius: 3,
    '&:hover': { backgroundColor: sidebarColors.scrollbarThumbHover },
  },
} as const;

export function AdminLayout({ currentOrderPositionCount = 0, topBarActions }: AdminLayoutProps) {
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
          actions={topBarActions}
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
              <RouteErrorBoundary>
                <Suspense fallback={<RouteLoadingFallback />}>
                  <Outlet />
                </Suspense>
              </RouteErrorBoundary>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
