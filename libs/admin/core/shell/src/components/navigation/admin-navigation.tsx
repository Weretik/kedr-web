import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { Box, Tooltip, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { useAdminShellUser } from '../../providers/admin-shell-session-provider';

export const adminDrawerWidth = 264;
export const adminDrawerCollapsedWidth = 84;

const navigationItems = [
  { icon: <DashboardOutlinedIcon />, label: 'Огляд', to: '/dashboard' },
  { icon: <CategoryOutlinedIcon />, label: 'Товари', to: '/catalog' },
  { icon: <AccountTreeOutlinedIcon />, label: 'Категорії', to: '/categories' },
  { icon: <PeopleOutlinedIcon />, label: 'Клієнти', to: '/customers' },
  { icon: <ReceiptLongOutlinedIcon />, label: 'Замовлення', to: '/orders' },
];

const usersNavigationItem = {
  icon: <ManageAccountsOutlinedIcon />,
  label: 'Користувачі',
  to: '/users',
};

interface AdminNavigationProps {
  isCollapsed?: boolean;
  onNavigate?: () => void;
}

export function AdminNavigation({ isCollapsed = false, onNavigate }: AdminNavigationProps) {
  const location = useLocation();
  const user = useAdminShellUser();
  // Hidden for managers; the route itself also shows "no access".
  const items = user?.canManageUsers ? [...navigationItems, usersNavigationItem] : navigationItems;

  return (
    <Box aria-label="Основна навігація" component="nav" sx={{ px: 2 }}>
      <Typography
        component="span"
        sx={{ color: 'text.secondary', display: isCollapsed ? 'none' : 'block', px: 1.5, pb: 1 }}
        variant="overline"
      >
        Робота
      </Typography>
      <Box
        component="ul"
        sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, listStyle: 'none', m: 0, p: 0 }}
      >
        {items.map(({ icon, label, to }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

          return (
            <Box component="li" key={to}>
              <Tooltip
                disableHoverListener={!isCollapsed}
                disableFocusListener={!isCollapsed}
                disableTouchListener
                placement="right"
                title={label}
              >
                <Box
                  component={RouterLink}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={isCollapsed ? label : undefined}
                  onClick={onNavigate}
                  sx={(theme) => ({
                    alignItems: 'center',
                    borderRadius: '12px',
                    color: isActive ? 'primary.dark' : 'text.secondary',
                    bgcolor: isActive ? 'primary.light' : 'transparent',
                    display: 'flex',
                    gap: 1.5,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    minHeight: 44,
                    px: isCollapsed ? 0 : 1.5,
                    textDecoration: 'none',
                    transition: theme.transitions.create(['background-color', 'color'], {
                      duration: theme.transitions.duration.shorter,
                    }),
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.light' : 'action.hover',
                      color: isActive ? 'primary.dark' : 'text.primary',
                    },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: theme.palette.primary.main,
                      outlineOffset: 2,
                    },
                  })}
                  to={to}
                >
                  <Box sx={{ alignItems: 'center', display: 'flex', flex: '0 0 auto' }}>{icon}</Box>
                  {isCollapsed ? null : (
                    <Typography
                      component="span"
                      sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 700 }}
                    >
                      {label}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
