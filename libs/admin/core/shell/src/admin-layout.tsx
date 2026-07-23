import { Box, Container, Divider, Drawer } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AdminBreadcrumbs } from './components/admin-breadcrumbs';
import { AdminNavigation, adminDrawerWidth } from './components/admin-navigation';
import { AdminTopBar } from './components/admin-top-bar';

export function AdminLayout() {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);

  const closeMobileNavigation = () => {
    setIsMobileNavigationOpen(false);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Drawer
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'secondary.main',
              boxSizing: 'border-box',
              color: 'secondary.contrastText',
              width: adminDrawerWidth,
            },
          },
        }}
        sx={{ display: { xs: 'none', lg: 'block' }, width: adminDrawerWidth }}
        variant="permanent"
      >
        <Box sx={{ alignItems: 'center', display: 'flex', height: 112, px: 3 }}>
          <Box
            alt="Логотип Class Kedr"
            component="img"
            src="/assets/logo/main-logo.svg"
            sx={{
              maxHeight: 92,
              objectFit: 'contain',
              width: 180,
            }}
          />
        </Box>
        <Divider sx={{ borderColor: 'secondary.light', mx: 3, opacity: 0.6 }} />
        <AdminNavigation />
      </Drawer>

      <Drawer
        ModalProps={{ keepMounted: true }}
        onClose={closeMobileNavigation}
        open={isMobileNavigationOpen}
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'secondary.main',
              boxSizing: 'border-box',
              color: 'secondary.contrastText',
              width: adminDrawerWidth,
            },
          },
        }}
        sx={{ display: { lg: 'none' } }}
        variant="temporary"
      >
        <Box sx={{ alignItems: 'center', display: 'flex', height: 112, px: 3 }}>
          <Box
            alt="Логотип Class Kedr"
            component="img"
            src="/assets/logo/main-logo.svg"
            sx={{
              maxHeight: 92,
              objectFit: 'contain',
              width: 180,
            }}
          />
        </Box>
        <Divider sx={{ borderColor: 'secondary.light', mx: 3, opacity: 0.6 }} />
        <AdminNavigation onNavigate={closeMobileNavigation} />
      </Drawer>

      <Box sx={{ marginLeft: { lg: `${adminDrawerWidth}px` }, minWidth: 0 }}>
        <AdminTopBar onOpenNavigation={() => setIsMobileNavigationOpen(true)} />
        <Box component="main">
          <Container maxWidth="xl" sx={{ py: { xs: 4, lg: 8 } }}>
            <AdminBreadcrumbs />
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
