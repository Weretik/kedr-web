import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import {
  useAdminShellLogout,
  useAdminShellUser,
} from '../../providers/admin-shell-session-provider';

import type { MouseEvent } from 'react';

export function ProfileMenu() {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const logout = useAdminShellLogout();
  const user = useAdminShellUser();
  const isOpen = Boolean(anchorElement);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleLogout = async () => {
    if (!logout) {
      return;
    }

    try {
      await logout();
    } catch {
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <IconButton
        aria-controls={isOpen ? 'profile-menu' : undefined}
        aria-expanded={isOpen ? 'true' : undefined}
        aria-haspopup="menu"
        aria-label="Відкрити меню профілю"
        onClick={handleOpen}
        sx={{ p: 0.5 }}
      >
        <Avatar
          alt="Іконка менеджера"
          src="/assets/images/icons8-manager-100.png"
          sx={{
            bgcolor: 'primary.light',
            borderRadius: '10px',
            height: 32,
            width: 32,
            '& .MuiAvatar-img': { transform: 'scale(1.33)' },
          }}
          variant="rounded"
        />
      </IconButton>
      <Menu anchorEl={anchorElement} id="profile-menu" onClose={handleClose} open={isOpen}>
        {user ? (
          <Box sx={{ maxWidth: 280, px: 2, py: 1 }}>
            <Typography noWrap sx={{ fontWeight: 700 }} variant="body2">
              {user.fullName || user.email}
            </Typography>
            <Typography color="text.secondary" noWrap variant="caption" component="p">
              {user.email} · {user.roleLabel}
            </Typography>
          </Box>
        ) : null}
        {user ? <Divider /> : null}
        <MenuItem disabled={!logout} onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Вийти
        </MenuItem>
      </Menu>
    </>
  );
}
