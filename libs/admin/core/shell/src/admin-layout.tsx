import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';

const drawerWidth = 256;
const navigationItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Catalog', to: '/dashboard' },
] as const;

export function AdminLayout() {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography component="span" sx={{ flexGrow: 1 }} variant="h6">
            Kedr Admin
          </Typography>
          <Typography variant="body2">Control surface</Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
          flexShrink: 0,
          width: drawerWidth,
        }}
        variant="permanent"
      >
        <Toolbar />
        <List aria-label="Admin navigation">
          {navigationItems.map(({ label, to }) => (
            <ListItemButton
              component={RouterLink}
              key={to}
              selected={location.pathname === to}
              to={to}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
