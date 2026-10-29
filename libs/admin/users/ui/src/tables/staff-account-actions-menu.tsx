import { avatarAcceptedTypes, staffRoleLabels } from '@admin/users/model';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import type { StaffAccount, StaffRole } from '@admin/users/model';
import type { ChangeEvent, MouseEvent } from 'react';

export type StaffAccountAction =
  | { type: 'changeRole'; role: StaffRole }
  | { type: 'setBlocked'; blocked: boolean }
  | { type: 'setPassword' }
  | { type: 'changeName' }
  | { type: 'changeEmail' }
  | { type: 'uploadAvatar'; file: File }
  | { type: 'removeAvatar' };

interface StaffAccountActionsMenuProps {
  account: StaffAccount;
  /** The signed-in admin cannot demote or block themselves. */
  isCurrentUser: boolean;
  onAction: (account: StaffAccount, action: StaffAccountAction) => void;
}

export function StaffAccountActionsMenu({
  account,
  isCurrentUser,
  onAction,
}: StaffAccountActionsMenuProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const otherRole: StaffRole = account.role === 'Admin' ? 'Manager' : 'Admin';
  const menuId = `staff-actions-${account.id}`;
  // Profile data and passwords are edited for managers only; an admin edits their own in the cabinet.
  const canEditProfile = account.role === 'Manager';

  const run = (action: StaffAccountAction) => {
    setAnchorElement(null);
    onAction(account, action);
  };

  // The menu stays open while the file picker is shown, so the input still exists when it fires.
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) run({ type: 'uploadAvatar', file });
  };

  return (
    <>
      <IconButton
        aria-controls={anchorElement ? menuId : undefined}
        aria-haspopup="menu"
        aria-label={`Дії для ${account.email}`}
        onClick={(event: MouseEvent<HTMLElement>) => setAnchorElement(event.currentTarget)}
        size="small"
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorElement}
        id={menuId}
        onClose={() => setAnchorElement(null)}
        open={Boolean(anchorElement)}
      >
        {canEditProfile
          ? [
              <MenuItem key="name" onClick={() => run({ type: 'changeName' })}>
                Змінити імʼя
              </MenuItem>,
              <MenuItem key="email" onClick={() => run({ type: 'changeEmail' })}>
                Змінити email
              </MenuItem>,
              <MenuItem component="label" key="photo">
                Змінити фото
                <input
                  accept={avatarAcceptedTypes.join(',')}
                  hidden
                  onChange={handleFile}
                  type="file"
                />
              </MenuItem>,
              account.avatarUrl ? (
                <MenuItem key="remove-photo" onClick={() => run({ type: 'removeAvatar' })}>
                  Видалити фото
                </MenuItem>
              ) : null,
              <MenuItem key="password" onClick={() => run({ type: 'setPassword' })}>
                Встановити новий пароль
              </MenuItem>,
              <Divider key="divider" />,
            ]
          : null}
        <MenuItem
          disabled={isCurrentUser}
          onClick={() => run({ type: 'changeRole', role: otherRole })}
        >
          Зробити: {staffRoleLabels[otherRole].toLowerCase()}
        </MenuItem>
        <MenuItem
          disabled={isCurrentUser && !account.isBlocked}
          onClick={() => run({ type: 'setBlocked', blocked: !account.isBlocked })}
          sx={account.isBlocked ? undefined : { color: 'error.main' }}
        >
          {account.isBlocked ? 'Розблокувати' : 'Заблокувати'}
        </MenuItem>
      </Menu>
    </>
  );
}
