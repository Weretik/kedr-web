import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { AppBar, Badge, IconButton, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { NotificationsMenu } from './notifications-menu';
import { ProfileMenu } from './profile-menu';
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
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary',
        '& .MuiIconButton-root': { color: 'text.primary' },
      }}
    >
      <Toolbar sx={{ gap: 1.5, minHeight: '64px !important', px: { xs: 2, sm: 3 } }}>
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
        <IconButton
          aria-label={`Відкрити оформлення замовлення, позицій: ${currentOrderPositionCount}`}
          component={RouterLink}
          to="/orders/new"
        >
          <Badge badgeContent={currentOrderPositionCount} color="primary" showZero>
            <ShoppingCartOutlinedIcon />
          </Badge>
        </IconButton>
        <NotificationsMenu />
        <ColorSchemeMenu />
        <ProfileMenu />
      </Toolbar>
    </AppBar>
  );
}
