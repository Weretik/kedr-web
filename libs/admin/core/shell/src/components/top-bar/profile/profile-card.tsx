import { StatusPill, UserAvatar } from '@admin/shared/ui';
import { Box, Stack, Typography } from '@mui/material';

import type { AdminShellUser } from '../../../providers/admin-shell-session-provider';

/** Who is signed in: photo, name, email, and role, at the top of the profile menu. */
export function ProfileCard({ user }: { user: AdminShellUser }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', px: 2, py: 1.5 }}>
      <UserAvatar avatarUrl={user.avatarUrl} email={user.email} name={user.fullName} size={48} />
      <Box sx={{ minWidth: 0 }}>
        <Typography noWrap sx={{ fontWeight: 700 }} variant="subtitle2">
          {user.fullName || user.email}
        </Typography>
        <Typography color="text.secondary" component="p" noWrap variant="caption">
          {user.email}
        </Typography>
        <Box sx={{ mt: 0.75 }}>
          <StatusPill label={user.roleLabel} tone={user.canManageUsers ? 'info' : 'success'} />
        </Box>
      </Box>
    </Stack>
  );
}
