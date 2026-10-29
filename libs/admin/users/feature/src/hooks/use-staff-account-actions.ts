import {
  useChangeStaffRoleMutation,
  useCreateStaffAccountMutation,
  useSetStaffBlockedMutation,
} from '@admin/users/data-access';
import { useState } from 'react';

import { describeConfirmation } from './staff-action-confirmation';
import { getStaffErrorMessage } from '../errors/staff-error-message';

import type { ConfirmableAction, PendingConfirmation } from './staff-action-confirmation';
import type { CreateStaffAccountInput, StaffAccount } from '@admin/users/model';

/** Create, role and blocking on the users page; each dialog shows its own server error. */
export function useStaffAccountActions(onSuccess: (message: string) => void) {
  const [createStaff, createState] = useCreateStaffAccountMutation();
  const [changeRole, changeRoleState] = useChangeStaffRoleMutation();
  const [setBlocked, setBlockedState] = useSetStaffBlockedMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<PendingConfirmation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const closeDialogs = () => {
    setIsCreateOpen(false);
    setConfirmation(null);
    setError(null);
  };

  const openCreate = () => {
    setError(null);
    setIsCreateOpen(true);
  };

  const startAction = (account: StaffAccount, action: ConfirmableAction) => {
    setError(null);
    setConfirmation(describeConfirmation(account, action));
  };

  const submitCreate = async (input: CreateStaffAccountInput): Promise<boolean> => {
    try {
      await createStaff(input).unwrap();
      setError(null);
      onSuccess(`Користувача ${input.email.trim()} створено.`);
      return true;
    } catch (createError) {
      setError(getStaffErrorMessage(createError));
      return false;
    }
  };

  const confirm = async () => {
    if (!confirmation) return;
    const { account, action } = confirmation;

    try {
      if (action.type === 'changeRole') {
        await changeRole({ userId: account.id, role: action.role }).unwrap();
      } else {
        await setBlocked({ userId: account.id, blocked: action.blocked }).unwrap();
      }

      onSuccess('Зміни збережено.');
      closeDialogs();
    } catch (actionError) {
      setError(getStaffErrorMessage(actionError));
    }
  };

  return {
    closeDialogs,
    confirm,
    confirmation,
    confirming: changeRoleState.isLoading || setBlockedState.isLoading,
    creating: createState.isLoading,
    error,
    isCreateOpen,
    openCreate,
    startAction,
    submitCreate,
  };
}
