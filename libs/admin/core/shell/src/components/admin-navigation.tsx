import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

export const adminDrawerWidth = 280;

const navigationItems = [
  { icon: <DashboardOutlinedIcon />, label: 'Огляд', to: '/dashboard' },
  { icon: <CategoryOutlinedIcon />, label: 'Каталог', to: '/catalog' },
] as const;

interface AdminNavigationProps {
  onNavigate?: () => void;
}

export function AdminNavigation({ onNavigate }: AdminNavigationProps) {
  const location = useLocation();

  return (
    <Box component="nav" sx={{ p: '12px' }}>
      <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: 1, listStyle: 'none', m: 0, p: 0 }}>
        {navigationItems.map(({ icon, label, to }) => {
          const isActive = location.pathname === to;

          return (
            <Box component="li" key={to}>
              <Box
                component={RouterLink}
                onClick={onNavigate}
                sx={{
                  alignItems: 'center',
                  borderRadius: 1,
                  color: 'secondary.contrastText',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: 1,
                  opacity: isActive ? 1 : 0.78,
                  p: '6px 16px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  '&:focus-visible': {
                    outline: '2px solid currentColor',
                    outlineOffset: 2,
                  },
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                  ...(isActive && {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }),
                }}
                to={to}
              >
                <Box sx={{ alignItems: 'center', display: 'flex', flex: '0 0 auto', opacity: 0.72 }}>{icon}</Box>
                <Typography component="span" sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}>
                  {label}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
