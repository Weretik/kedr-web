import { useSetCategorySearchSettingsMutation } from '@admin/categories/data-access';
import { useMediaPicker } from '@admin/media/data-access';
import { useState } from 'react';

import { categoryContentErrorMessage } from '../../errors/category-content-error-message';

import type { AdminCategory, CategorySharePicture } from '@admin/categories/model';

export interface SearchSettingsDraft {
  isClosedFromSearch: boolean;
  picture: CategorySharePicture | null;
}

const draftOf = (category: AdminCategory): SearchSettingsDraft => ({
  isClosedFromSearch: category.isClosedFromSearch,
  picture: category.sharePicture,
});

/**
 * «Закрити від пошуку» and the link-preview picture of one category in its edit panel. The picture comes from the
 * media library; the category keeps only its ID.
 */
export function useCategorySearchSettings(
  category: AdminCategory,
  onSaved: (message: string) => void,
) {
  const [draft, setDraft] = useState(() => draftOf(category));
  const [base, setBase] = useState(category);
  const [error, setError] = useState<string | undefined>();
  const [save, state] = useSetCategorySearchSettingsMutation();
  const picker = useMediaPicker((file) =>
    setDraft((current) => ({ ...current, picture: { mediaFileId: file.id, url: file.url } })),
  );

  if (base !== category) {
    setBase(category);
    setDraft(draftOf(category));
    setError(undefined);
  }

  const dirty =
    draft.isClosedFromSearch !== category.isClosedFromSearch ||
    (draft.picture?.mediaFileId ?? null) !== (category.sharePicture?.mediaFileId ?? null);

  const submit = async () => {
    if (state.isLoading) return;
    setError(undefined);
    try {
      await save({
        id: category.id,
        isClosedFromSearch: draft.isClosedFromSearch,
        shareImageMediaFileId: draft.picture?.mediaFileId ?? null,
      }).unwrap();
      onSaved('Налаштування пошуку збережено.');
    } catch (cause) {
      setError(categoryContentErrorMessage(cause));
    }
  };

  return {
    draft,
    dirty,
    error,
    saving: state.isLoading,
    picker,
    setClosed: (isClosedFromSearch: boolean) => setDraft({ ...draft, isClosedFromSearch }),
    removePicture: () => setDraft({ ...draft, picture: null }),
    reset: () => setDraft(draftOf(category)),
    submit,
  };
}
