import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';

import { ColorSchemeMenu } from './color-scheme-menu';
import { NotificationsMenu } from './notifications-menu';
import { ProfileMenu } from './profile-menu';

interface AdminTopBarProps {
  onOpenNavigation: () => void;
}

export function AdminTopBar({ onOpenNavigation }: AdminTopBarProps) {
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
        <NotificationsMenu />
        <ColorSchemeMenu />
        <ProfileMenu />
      </Toolbar>
    </AppBar>
  );
}
