import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { AppBar, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { NotificationsMenu } from './notifications-menu';
import { ProfileMenu } from './profile/profile-menu';
import { ColorSchemeMenu } from '../theme/color-scheme-menu';

interface AdminTopBarProps {
  onOpenNavigation: () => void;
  currentOrderPositionCount: number;
}

export function AdminTopBar({ onOpenNavigation, currentOrderPositionCount }: AdminTopBarProps) {
  return (
    <AppBar
      color="transparent"
      elevation={0}
      position="sticky"
      sx={(theme) => ({
        backdropFilter: 'saturate(1.4) blur(12px)',
        bgcolor: theme.vars
          ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.82)`
          : theme.palette.background.default,
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary',
        '& .MuiIconButton-root': {
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          height: 42,
          width: 42,
          '&:hover': { bgcolor: 'action.hover' },
        },
      })}
    >
      <Toolbar sx={{ gap: 1, minHeight: '72px !important', px: { xs: 2, sm: 3, lg: 5 } }}>
        <IconButton
          aria-label="Відкрити меню навігації"
          edge="start"
          onClick={onOpenNavigation}
          sx={{ display: { lg: 'none' } }}
        >
          <MenuOutlinedIcon />
        </IconButton>
        <Typography component="span" noWrap sx={{ flexGrow: 1, minWidth: 0 }} variant="h6">
          Кабінет менеджера
        </Typography>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <Tooltip title="Поточне замовлення">
            <IconButton
              aria-label={`Відкрити оформлення замовлення, позицій: ${currentOrderPositionCount}`}
              component={RouterLink}
              to="/orders/new"
            >
              <Badge
                badgeContent={currentOrderPositionCount}
                color="primary"
                showZero
                sx={{ '& .MuiBadge-badge': { border: 2, borderColor: 'background.paper' } }}
              >
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <NotificationsMenu />
          <ColorSchemeMenu />
          <ProfileMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
