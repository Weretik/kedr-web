import { useSetCategorySiteNamesMutation } from '@admin/categories/data-access';
import { useState } from 'react';

import { categoryContentErrorMessage } from '../../errors/category-content-error-message';

import type { AdminCategory } from '@admin/categories/model';

export interface SiteNamesDraft {
  uk: string;
  ru: string;
}

const draftOf = (category: AdminCategory): SiteNamesDraft => ({
  uk: category.siteNameUk ?? '',
  ru: category.siteNameRu ?? '',
});

/** The site names of one category in its edit panel; a blank name goes back to the 1C name. */
export function useCategorySiteNames(category: AdminCategory, onSaved: (message: string) => void) {
  const [draft, setDraft] = useState(() => draftOf(category));
  const [base, setBase] = useState(category);
  const [error, setError] = useState<string | undefined>();
  const [save, state] = useSetCategorySiteNamesMutation();

  // A reloaded or another category becomes the new starting value.
  if (base !== category) {
    setBase(category);
    setDraft(draftOf(category));
    setError(undefined);
  }

  const saved = draftOf(category);
  const dirty = draft.uk.trim() !== saved.uk || draft.ru.trim() !== saved.ru;

  const submit = async () => {
    if (state.isLoading) return;
    setError(undefined);
    try {
      await save({
        id: category.id,
        nameUk: draft.uk.trim() || null,
        nameRu: draft.ru.trim() || null,
      }).unwrap();
      onSaved('Назви на сайті збережено.');
    } catch (cause) {
      setError(categoryContentErrorMessage(cause));
    }
  };

  return {
    draft,
    dirty,
    error,
    saving: state.isLoading,
    change: setDraft,
    reset: () => setDraft(saved),
    submit,
  };
}
