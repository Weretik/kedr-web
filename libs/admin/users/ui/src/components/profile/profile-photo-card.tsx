import { SectionCard, UserAvatar } from '@admin/shared/ui';
import { avatarRulesHint } from '@admin/users/model';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Alert, Button, Stack, Typography } from '@mui/material';

import { AvatarPickerButton } from '../avatar-picker-button';

import type { StaffProfile } from '@admin/users/model';

interface ProfilePhotoCardProps {
  profile: StaffProfile;
  fileError: string | null;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
}

/** Large avatar with upload and remove actions and the photo limits. */
export function ProfilePhotoCard({
  fileError,
  onFileSelected,
  onRemove,
  profile,
}: ProfilePhotoCardProps) {
  return (
    <SectionCard title="Фото профілю">
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <UserAvatar
          avatarUrl={profile.avatarUrl}
          email={profile.email}
          name={profile.fullName}
          size={112}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <AvatarPickerButton onFileSelected={onFileSelected}>
            {profile.avatarUrl ? 'Замінити фото' : 'Завантажити фото'}
          </AvatarPickerButton>
          {profile.avatarUrl ? (
            <Button color="error" onClick={onRemove} startIcon={<DeleteOutlinedIcon />}>
              Видалити
            </Button>
          ) : null}
        </Stack>
        <Typography color="text.secondary" variant="caption">
          {avatarRulesHint}
        </Typography>
        {fileError ? (
          <Alert severity="warning" sx={{ textAlign: 'left', width: '100%' }}>
            {fileError}
          </Alert>
        ) : null}
      </Stack>
    </SectionCard>
  );
}
