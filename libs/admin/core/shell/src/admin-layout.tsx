import {
  AppBar,
  Box,
  Drawer,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';

import type { SelectChangeEvent } from '@mui/material';

const drawerWidth = 256;
const navigationItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Catalog', to: '/dashboard' },
] as const;

function ColorSchemeSelect() {
  const { mode, setMode } = useColorScheme();

  const handleModeChange = (event: SelectChangeEvent) => {
    setMode(event.target.value as 'dark' | 'light' | 'system');
  };

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 132,
        '& .MuiInputLabel-root': {
          color: 'secondary.contrastText',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'secondary.contrastText',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'secondary.contrastText',
        },
        '& .MuiOutlinedInput-root': {
          color: 'secondary.contrastText',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline':
            {
              borderColor: 'secondary.contrastText',
            },
        },
        '& .MuiSelect-icon': {
          color: 'secondary.contrastText',
        },
      }}
    >
      <InputLabel id="color-scheme-label">Theme</InputLabel>
      <Select
        id="color-scheme"
        label="Theme"
        labelId="color-scheme-label"
        onChange={handleModeChange}
        value={mode ?? 'system'}
      >
        <MenuItem value="system">System</MenuItem>
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
      </Select>
    </FormControl>
  );
}

export function AdminLayout() {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        color="secondary"
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography component="span" sx={{ flexGrow: 1 }} variant="h6">
            Kedr Admin
          </Typography>
          <ColorSchemeSelect />
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
