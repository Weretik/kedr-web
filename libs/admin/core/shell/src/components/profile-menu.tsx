import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Avatar, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import { useAdminShellLogout } from '../providers/admin-shell-session-provider';

import type { MouseEvent } from 'react';

export function ProfileMenu() {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const logout = useAdminShellLogout();
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
        sx={{ opacity: 1, p: 0 }}
      >
        <Avatar
          alt="Іконка менеджера"
          src="/assets/images/icons8-manager-100.png"
          sx={{ height: 48, width: 48, '& .MuiAvatar-img': { transform: 'scale(1.33)' } }}
        />
      </IconButton>
      <Menu anchorEl={anchorElement} id="profile-menu" onClose={handleClose} open={isOpen}>
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
