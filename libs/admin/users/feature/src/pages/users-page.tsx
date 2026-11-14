import { AdminPageHeader } from '@admin/shared/ui';
import { useGetStaffAccountsQuery } from '@admin/users/data-access';
import { ConfirmActionDialog, CreateStaffPanel, StaffAccountsTable } from '@admin/users/ui';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Card, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { ChangeConfirmationDialog } from '../components/change-confirmation-dialog';
import { StaffEditPanels } from '../components/staff-edit-panels';
import { SuccessSnackbar } from '../components/success-snackbar';
import { useStaffAccountActions } from '../hooks/staff/use-staff-account-actions';
import { useStaffCandidateSearch } from '../hooks/staff/use-staff-candidate-search';
import {
  isStaffProfileAction,
  useStaffProfileActions,
} from '../hooks/staff/use-staff-profile-actions';

import type { StaffAccount } from '@admin/users/model';
import type { StaffAccountAction } from '@admin/users/ui';

interface UsersPageProps {
  currentUserId: string | null;
}

export default function UsersPage({ currentUserId }: UsersPageProps) {
  const accountsQuery = useGetStaffAccountsQuery();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const actions = useStaffAccountActions(setSuccessMessage);
  const profileActions = useStaffProfileActions(setSuccessMessage);
  const candidateSearch = useStaffCandidateSearch();

  const handleAction = (account: StaffAccount, action: StaffAccountAction) => {
    if (isStaffProfileAction(action)) {
      profileActions.start(account, action);
    } else {
      actions.startAction(account, action);
    }
  };

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
        Адміністратори керують користувачами та бачать усі розділи. SEO-спеціалісти бачать усе, крім
        розділу «Система», і змінюють адреси, тексти категорій та ознаки. Менеджери працюють із
        товарами, клієнтами та замовленнями. Імʼя, email, пароль і фото тут змінюються для
        менеджерів і SEO-спеціалістів; свої дані адміністратор змінює в «Моєму кабінеті».
      </Typography>
      {profileActions.fileError ? (
        <Alert onClose={profileActions.clearFileError} severity="warning">
          {profileActions.fileError}
        </Alert>
      ) : null}
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <StaffAccountsTable
          accounts={accountsQuery.currentData ?? []}
          currentUserId={currentUserId}
          error={accountsQuery.isError}
          loading={accountsQuery.isFetching}
          onAction={handleAction}
          onRetry={() => void accountsQuery.refetch()}
        />
      </Card>
      <CreateStaffPanel
        candidates={candidateSearch.candidates}
        candidatesLoading={candidateSearch.loading}
        error={actions.error}
        onCandidateSearch={candidateSearch.onSearch}
        onClose={actions.closeDialogs}
        onGrant={actions.submitGrant}
        onModeChange={actions.clearError}
        onSubmit={actions.submitCreate}
        open={actions.isCreateOpen}
        submitting={actions.creating}
      />
      <StaffEditPanels
        editPanel={profileActions.editPanel}
        onClose={profileActions.closeEdit}
        onSubmit={profileActions.submitEdit}
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
      <ChangeConfirmationDialog change={profileActions.confirmation} />
      <SuccessSnackbar message={successMessage} onClose={() => setSuccessMessage(null)} />
    </Stack>
  );
}
