import { AdminPageHeader, PageLoader } from '@admin/shared/ui';
import { useGetMyProfileQuery } from '@admin/users/data-access';
import { validateFullName } from '@admin/users/model';
import {
  ChangeEmailDialog,
  ChangePasswordDialog,
  EditTextDialog,
  ProfileDetailsCard,
  ProfilePhotoCard,
} from '@admin/users/ui';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { ChangeConfirmationDialog } from '../components/change-confirmation-dialog';
import { SuccessSnackbar } from '../components/success-snackbar';
import { useProfileActions } from '../hooks/use-profile-actions';

interface ProfilePageProps {
  /** Re-reads the session so the header shows the change. */
  onProfileChanged: () => Promise<void>;
}

export default function ProfilePage({ onProfileChanged }: ProfilePageProps) {
  const profileQuery = useGetMyProfileQuery();
  const profile = profileQuery.currentData;
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const actions = useProfileActions(profile, onProfileChanged, setSuccessMessage);

  if (profileQuery.isError) {
    return (
      <Alert
        action={<Button onClick={() => void profileQuery.refetch()}>Повторити</Button>}
        severity="error"
      >
        Не вдалося завантажити профіль.
      </Alert>
    );
  }

  if (!profile) {
    return <PageLoader label="Завантаження профілю" />;
  }

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Мій кабінет" />
      <Typography color="text.secondary">
        Ваші дані в адмінці. Фото та імʼя бачать інші користувачі на сторінці «Користувачі».
      </Typography>
      <Box
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '320px minmax(0, 1fr)' },
        }}
      >
        <ProfilePhotoCard
          fileError={actions.fileError}
          onFileSelected={actions.chooseAvatar}
          onRemove={actions.requestRemoveAvatar}
          profile={profile}
        />
        <ProfileDetailsCard onEdit={actions.openDialog} profile={profile} />
      </Box>
      <EditTextDialog
        initialValue={profile.fullName}
        label="Імʼя"
        onClose={actions.closeDialog}
        onSubmit={actions.submitName}
        open={actions.dialog === 'name'}
        title="Змінити імʼя"
        validate={validateFullName}
      />
      <ChangeEmailDialog
        currentEmail={profile.email}
        onClose={actions.closeDialog}
        onSubmit={actions.submitEmail}
        open={actions.dialog === 'email'}
      />
      <ChangePasswordDialog
        onClose={actions.closeDialog}
        onSubmit={actions.submitPassword}
        open={actions.dialog === 'password'}
      />
      <ChangeConfirmationDialog change={actions.confirmation} />
      <SuccessSnackbar message={successMessage} onClose={() => setSuccessMessage(null)} />
    </Stack>
  );
}
