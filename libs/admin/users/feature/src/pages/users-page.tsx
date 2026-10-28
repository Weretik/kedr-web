import { AdminPageHeader } from '@admin/shared/ui';
import { useGetStaffAccountsQuery } from '@admin/users/data-access';
import {
  ConfirmActionDialog,
  CreateStaffDialog,
  SetPasswordDialog,
  StaffAccountsTable,
} from '@admin/users/ui';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Card, Snackbar, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useStaffAccountActions } from '../hooks/use-staff-account-actions';

interface UsersPageProps {
  currentUserId: string | null;
}

export default function UsersPage({ currentUserId }: UsersPageProps) {
  const accountsQuery = useGetStaffAccountsQuery();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const actions = useStaffAccountActions(setSuccessMessage);

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          <Button onClick={actions.openCreate} startIcon={<AddIcon />} variant="contained">
            Додати користувача
          </Button>
        }
        title="Користувачі"
      />
      <Typography color="text.secondary">
        Адміністратори керують користувачами та бачать усі розділи. Менеджери працюють із товарами,
        клієнтами та замовленнями.
      </Typography>
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <StaffAccountsTable
          accounts={accountsQuery.currentData ?? []}
          currentUserId={currentUserId}
          error={accountsQuery.isError}
          loading={accountsQuery.isFetching}
          onAction={actions.startAction}
          onRetry={() => void accountsQuery.refetch()}
        />
      </Card>
      <CreateStaffDialog
        error={actions.error}
        onClose={actions.closeDialogs}
        onSubmit={actions.submitCreate}
        open={actions.isCreateOpen}
        submitting={actions.creating}
      />
      <SetPasswordDialog
        email={actions.passwordTarget?.email ?? null}
        error={actions.error}
        onClose={actions.closeDialogs}
        onSubmit={actions.submitPassword}
        submitting={actions.settingPassword}
      />
      <ConfirmActionDialog
        confirmLabel={actions.confirmation?.confirmLabel ?? ''}
        description={actions.confirmation?.description ?? ''}
        destructive={actions.confirmation?.destructive}
        error={actions.error}
        onCancel={actions.closeDialogs}
        onConfirm={() => void actions.confirm()}
        open={actions.confirmation !== null}
        submitting={actions.confirming}
        title={actions.confirmation?.title ?? ''}
      />
      <Snackbar
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        open={successMessage !== null}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
