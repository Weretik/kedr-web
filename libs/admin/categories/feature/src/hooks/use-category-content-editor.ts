import { useSaveCategoryContentMutation } from '@admin/categories/data-access';
import { isSameCategoryContent, validateCategoryContent } from '@admin/categories/model';
import { useEffect, useState } from 'react';

import { categoryContentErrorMessage } from '../errors/category-content-error-message';

import type { CategoryContentByLanguage } from '@admin/categories/data-access';
import type {
  CategoryContentDraft,
  CategoryContentErrors,
  ContentLanguage,
} from '@admin/categories/model';

type PerLanguage<T> = Partial<Record<ContentLanguage, T>>;

/**
 * Keeps an unsaved draft per language (R-007), validates before sending, and saves one language at a
 * time (R-005). After a save the stored content replaces the draft.
 */
export function useCategoryContentEditor(
  categoryId: number,
  stored: CategoryContentByLanguage | undefined,
  onSaved: (message: string) => void,
) {
  const [drafts, setDrafts] = useState<PerLanguage<CategoryContentDraft>>({});
  const [errors, setErrors] = useState<PerLanguage<CategoryContentErrors>>({});
  const [saveErrors, setSaveErrors] = useState<PerLanguage<string>>({});
  const [saveContent, saveState] = useSaveCategoryContentMutation();

  useEffect(() => {
    setDrafts({});
    setErrors({});
    setSaveErrors({});
  }, [categoryId]);

  const draftOf = (language: ContentLanguage): CategoryContentDraft | undefined =>
    drafts[language] ?? stored?.[language];

  const isDirty = (language: ContentLanguage) => {
    const draft = drafts[language];
    const saved = stored?.[language];
    return Boolean(draft && saved && !isSameCategoryContent(draft, saved));
  };

  const change = (language: ContentLanguage, draft: CategoryContentDraft) => {
    setDrafts((current) => ({ ...current, [language]: draft }));
    if (errors[language])
      setErrors((current) => ({ ...current, [language]: validateCategoryContent(draft) }));
  };

  const reset = (language: ContentLanguage) => {
    setDrafts((current) => ({ ...current, [language]: undefined }));
    setErrors((current) => ({ ...current, [language]: undefined }));
    setSaveErrors((current) => ({ ...current, [language]: undefined }));
  };

  const save = async (language: ContentLanguage) => {
    const draft = draftOf(language);
    if (!draft) return;

    const validationErrors = validateCategoryContent(draft);
    setErrors((current) => ({ ...current, [language]: validationErrors }));
    if (validationErrors) return;

    setSaveErrors((current) => ({ ...current, [language]: undefined }));
    try {
      await saveContent({ draft, id: categoryId, language }).unwrap();
      // The refetched content (with the sanitized text) becomes the new baseline.
      setDrafts((current) => ({ ...current, [language]: undefined }));
      onSaved(language === 'uk' ? 'Український текст збережено.' : 'Російський текст збережено.');
    } catch (error) {
      setSaveErrors((current) => ({ ...current, [language]: categoryContentErrorMessage(error) }));
    }
  };

  return {
    change,
    draftOf,
    errorsOf: (language: ContentLanguage) => errors[language],
    isDirty,
    reset,
    save,
    saveErrorOf: (language: ContentLanguage) => saveErrors[language],
    saving: saveState.isLoading,
  };
}
