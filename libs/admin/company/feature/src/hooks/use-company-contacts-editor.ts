import { useUpdateCompanyContactsMutation } from '@admin/company/data-access';
import {
  contactsToDraft,
  isSameContactsDraft,
  validateCompanyContactsDraft,
} from '@admin/company/model';
import { useMemo, useState } from 'react';

import {
  companyContactsErrorMessage,
  companyContactsServerErrors,
} from '../errors/company-contacts-error-message';

import type {
  CompanyContacts,
  CompanyContactsDraft,
  CompanyContactsErrors,
} from '@admin/company/model';

/**
 * Draft of the loaded contacts. Validates before sending; server field errors land under their fields.
 * After a save the stored contacts become the new baseline.
 */
export function useCompanyContactsEditor(stored: CompanyContacts | undefined, onSaved: () => void) {
  const baseline = useMemo(() => (stored ? contactsToDraft(stored) : undefined), [stored]);
  const [draft, setDraft] = useState<CompanyContactsDraft | undefined>();
  const [errors, setErrors] = useState<CompanyContactsErrors | undefined>();
  const [saveError, setSaveError] = useState<string | undefined>();
  const [update, updateState] = useUpdateCompanyContactsMutation();

  const current = draft ?? baseline;
  const dirty = Boolean(draft && baseline && !isSameContactsDraft(draft, baseline));

  const change = (next: CompanyContactsDraft) => {
    setDraft(next);
    if (errors) setErrors(validateCompanyContactsDraft(next));
  };

  const reset = () => {
    setDraft(undefined);
    setErrors(undefined);
    setSaveError(undefined);
  };

  const save = async () => {
    if (!current) return;
    const validationErrors = validateCompanyContactsDraft(current);
    setErrors(validationErrors);
    if (validationErrors) return;

    setSaveError(undefined);
    try {
      await update(current).unwrap();
      setDraft(undefined);
      onSaved();
    } catch (error) {
      const fieldErrors = companyContactsServerErrors(error);
      if (fieldErrors) setErrors(fieldErrors);
      setSaveError(companyContactsErrorMessage(error));
    }
  };

  return {
    change,
    dirty,
    draft: current,
    errors,
    reset,
    save,
    saveError,
    saving: updateState.isLoading,
  };
}
