import { useDeleteArticleMutation } from '@admin/articles/data-access';
import { useState } from 'react';

import { articleErrorMessage } from '../errors/article-error-message';

/** «Видалити» of one article: the confirmation dialog, the request, and its error. */
export function useArticleDelete(articleId: number, onDeleted: () => void) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [deleteArticle, state] = useDeleteArticleMutation();

  const confirm = async () => {
    setError(undefined);
    try {
      await deleteArticle(articleId).unwrap();
      onDeleted();
    } catch (failure) {
      setError(articleErrorMessage(failure));
    }
  };

  return {
    open,
    error,
    deleting: state.isLoading,
    ask: () => setOpen(true),
    cancel: () => {
      setOpen(false);
      setError(undefined);
    },
    confirm,
  };
}
