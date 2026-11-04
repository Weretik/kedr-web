import { useUpdateCompanyRequisitesMutation } from '@admin/company/data-access';
import {
  companyRequisitesFields,
  requisitesToDraft,
  isSameRequisitesDraft,
  validateCompanyRequisitesDraft,
} from '@admin/company/model';
import { useMemo, useState } from 'react';

import { companySaveErrorMessage, serverFieldErrors } from '../errors/company-save-errors';

import type {
  CompanyRequisites,
  CompanyRequisitesDraft,
  CompanyRequisitesErrors,
} from '@admin/company/model';

/**
 * Draft of the loaded requisites. Validates before sending; server field errors land under their fields.
 * After a save the stored requisites become the new baseline.
 */
export function useCompanyRequisitesEditor(
  stored: CompanyRequisites | undefined,
  onSaved: () => void,
) {
  const baseline = useMemo(() => (stored ? requisitesToDraft(stored) : undefined), [stored]);
  const [draft, setDraft] = useState<CompanyRequisitesDraft | undefined>();
  const [errors, setErrors] = useState<CompanyRequisitesErrors | undefined>();
  const [saveError, setSaveError] = useState<string | undefined>();
  const [update, updateState] = useUpdateCompanyRequisitesMutation();

  const current = draft ?? baseline;
  const dirty = Boolean(draft && baseline && !isSameRequisitesDraft(draft, baseline));

  const change = (next: CompanyRequisitesDraft) => {
    setDraft(next);
    if (errors) setErrors(validateCompanyRequisitesDraft(next));
  };

  const reset = () => {
    setDraft(undefined);
    setErrors(undefined);
    setSaveError(undefined);
  };

  const save = async () => {
    if (!current) return;
    const validationErrors = validateCompanyRequisitesDraft(current);
    setErrors(validationErrors);
    if (validationErrors) return;

    setSaveError(undefined);
    try {
      await update(current).unwrap();
      setDraft(undefined);
      onSaved();
    } catch (error) {
      const fieldErrors = serverFieldErrors(error, companyRequisitesFields);
      if (fieldErrors) setErrors(fieldErrors);
      setSaveError(companySaveErrorMessage(error));
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
