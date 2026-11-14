import { validateGrantStaffAccessInput, validateStaffAccountInput } from '@admin/users/model';
import { useState } from 'react';

import type {
  CreateStaffAccountInput,
  GrantStaffAccessFieldErrors,
  GrantStaffAccessInput,
  StaffAccountFieldErrors,
  StaffCandidate,
} from '@admin/users/model';

/** «Новий» creates an account; «З бази» gives staff access to an existing one (usually a customer). */
export type CreateStaffMode = 'new' | 'existing';

const emptyInput: CreateStaffAccountInput = {
  email: '',
  fullName: '',
  role: 'Manager',
  password: '',
};

interface CreateStaffFormOptions {
  onClose: () => void;
  onSubmit: (input: CreateStaffAccountInput) => Promise<boolean>;
  onGrant?: (input: GrantStaffAccessInput) => Promise<boolean>;
  onModeChange?: (mode: CreateStaffMode) => void;
}

/** The «Новий користувач» form: mode, values, the picked account, field errors, and submit. */
export function useCreateStaffForm({
  onClose,
  onGrant,
  onModeChange,
  onSubmit,
}: CreateStaffFormOptions) {
  const [mode, setMode] = useState<CreateStaffMode>('new');
  const [input, setInput] = useState(emptyInput);
  const [candidate, setCandidate] = useState<StaffCandidate | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    StaffAccountFieldErrors & GrantStaffAccessFieldErrors
  >({});

  const update = (change: Partial<CreateStaffAccountInput>) =>
    setInput((current) => ({ ...current, ...change }));

  const changeMode = (next: CreateStaffMode) => {
    setMode(next);
    setFieldErrors({});
    onModeChange?.(next);
  };

  const pickCandidate = (next: StaffCandidate | null) => {
    setCandidate(next);
    if (next) update({ email: next.email, fullName: next.fullName });
  };

  const close = () => {
    setMode('new');
    setInput(emptyInput);
    setCandidate(null);
    setFieldErrors({});
    onClose();
  };

  const submit = async () => {
    if (mode === 'existing' && onGrant) {
      const grant: GrantStaffAccessInput = {
        userId: candidate?.id ?? '',
        fullName: input.fullName,
        role: input.role,
        password: input.password,
      };
      const errors = validateGrantStaffAccessInput(grant);
      setFieldErrors(errors);
      if (Object.keys(errors).length === 0 && (await onGrant(grant))) close();
      return;
    }

    const errors = validateStaffAccountInput(input);
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0 && (await onSubmit(input))) close();
  };

  return { candidate, changeMode, close, fieldErrors, input, mode, pickCandidate, submit, update };
}
