import { useUpdateWholesalePageMutation } from '@admin/wholesale-content/data-access';
import {
  isSameWholesaleDraft,
  validateWholesaleDraft,
  wholesaleToDraft,
} from '@admin/wholesale-content/model';
import { useMemo, useState } from 'react';

import { wholesaleSaveErrorMessage } from '../errors/wholesale-save-error';

import type {
  WholesaleDraft,
  WholesaleDraftErrors,
  WholesalePage,
} from '@admin/wholesale-content/model';

/** Draft of the loaded page: validated before sending; after a save the stored page is the new baseline. */
export function useWholesaleEditor(stored: WholesalePage | undefined, onSaved: () => void) {
  const baseline = useMemo(() => (stored ? wholesaleToDraft(stored) : undefined), [stored]);
  const [draft, setDraft] = useState<WholesaleDraft | undefined>();
  const [errors, setErrors] = useState<WholesaleDraftErrors | undefined>();
  const [saveError, setSaveError] = useState<string | undefined>();
  const [update, updateState] = useUpdateWholesalePageMutation();

  const current = draft ?? baseline;
  const dirty = Boolean(draft && baseline && !isSameWholesaleDraft(draft, baseline));

  const change = (next: WholesaleDraft) => {
    setDraft(next);
    if (errors) setErrors(validateWholesaleDraft(next));
  };

  const reset = () => {
    setDraft(undefined);
    setErrors(undefined);
    setSaveError(undefined);
  };

  const save = async () => {
    if (!current) return;
    const validationErrors = validateWholesaleDraft(current);
    setErrors(validationErrors);
    if (validationErrors) return;

    setSaveError(undefined);
    try {
      await update(current).unwrap();
      setDraft(undefined);
      onSaved();
    } catch (error) {
      setSaveError(wholesaleSaveErrorMessage(error));
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
