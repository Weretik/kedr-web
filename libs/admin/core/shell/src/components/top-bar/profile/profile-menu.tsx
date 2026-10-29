import { UserAvatar } from '@admin/shared/ui';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Divider, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProfileCard } from './profile-card';
import {
  useAdminShellLogout,
  useAdminShellProfileHref,
  useAdminShellUser,
} from '../../../providers/admin-shell-session-provider';

import type { MouseEvent } from 'react';

export function ProfileMenu() {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const logout = useAdminShellLogout();
  const profileHref = useAdminShellProfileHref();
  const user = useAdminShellUser();
  const navigate = useNavigate();
  const isOpen = Boolean(anchorElement);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleOpenProfile = () => {
    handleClose();
    if (profileHref) {
      navigate(profileHref);
    }
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
        <UserAvatar
          avatarUrl={user?.avatarUrl}
          email={user?.email}
          name={user?.fullName ?? ''}
          size={32}
        />
      </IconButton>
      <Menu
        anchorEl={anchorElement}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id="profile-menu"
        onClose={handleClose}
        open={isOpen}
        slotProps={{ paper: { sx: { minWidth: 260, maxWidth: 320 } } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {user ? <ProfileCard user={user} /> : null}
        {user ? <Divider /> : null}
        <MenuItem disabled={!profileHref} onClick={handleOpenProfile}>
          <ListItemIcon>
            <AccountCircleOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Мій кабінет
        </MenuItem>
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
