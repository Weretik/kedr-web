import { useCreateArticleMutation, useUpdateArticleMutation } from '@admin/articles/data-access';
import {
  articleToDraft,
  isSameArticleDraft,
  newArticleDraft,
  validateArticleDraft,
} from '@admin/articles/model';
import { useEffect, useMemo, useState } from 'react';

import { articleErrorMessage, articleSlugServerError } from '../errors/article-error-message';

import type { Article, ArticleDraft, ArticleDraftErrors } from '@admin/articles/model';

/**
 * Draft of a new article (`stored` is `null`) or of a loaded one. Validates before sending; a taken address
 * comes back as a field error. After a save the stored article becomes the new baseline.
 */
export function useArticleEditor(
  stored: Article | null | undefined,
  onSaved: (article: Article, created: boolean) => void,
) {
  const isNew = stored === null;
  const baseline = useMemo(
    () => (stored ? articleToDraft(stored) : isNew ? newArticleDraft() : undefined),
    [isNew, stored],
  );
  const [draft, setDraft] = useState<ArticleDraft | undefined>();
  const [errors, setErrors] = useState<ArticleDraftErrors | undefined>();
  const [saveError, setSaveError] = useState<string | undefined>();
  const [create, createState] = useCreateArticleMutation();
  const [update, updateState] = useUpdateArticleMutation();

  useEffect(() => {
    setDraft(undefined);
    setErrors(undefined);
    setSaveError(undefined);
  }, [stored?.id]);

  const current = draft ?? baseline;
  const dirty = Boolean(draft && baseline && !isSameArticleDraft(draft, baseline));
  const validate = (next: ArticleDraft) => validateArticleDraft(next, { slugRequired: !isNew });

  const change = (next: ArticleDraft) => {
    setDraft(next);
    if (errors) setErrors(validate(next));
  };

  const reset = () => {
    setDraft(undefined);
    setErrors(undefined);
    setSaveError(undefined);
  };

  const save = async () => {
    if (!current) return;
    const validationErrors = validate(current);
    setErrors(validationErrors);
    if (validationErrors) return;

    setSaveError(undefined);
    try {
      const saved = stored
        ? await update({ id: stored.id, draft: current }).unwrap()
        : await create(current).unwrap();
      setDraft(undefined);
      onSaved(saved, !stored);
    } catch (error) {
      const slug = articleSlugServerError(error);
      if (slug) setErrors((existing) => ({ ...existing, slug }));
      else setSaveError(articleErrorMessage(error));
    }
  };

  return {
    change,
    dirty,
    draft: current,
    errors,
    isNew,
    reset,
    save,
    saveError,
    saving: createState.isLoading || updateState.isLoading,
  };
}
