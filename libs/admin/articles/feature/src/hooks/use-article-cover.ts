import {
  useRemoveArticleCoverMutation,
  useUploadArticleCoverMutation,
} from '@admin/articles/data-access';
import { articleCoverFileError } from '@admin/articles/model';
import { useEffect, useState } from 'react';

import { articleCoverErrorMessage } from '../errors/article-error-message';

/** Uploads or removes the cover of a saved article; the refetched article shows the new picture. */
export function useArticleCover(articleId: number, onDone: (message: string) => void) {
  const [error, setError] = useState<string | undefined>();
  const [upload, uploadState] = useUploadArticleCoverMutation();
  const [remove, removeState] = useRemoveArticleCoverMutation();

  useEffect(() => setError(undefined), [articleId]);

  const choose = async (file: File) => {
    const fileError = articleCoverFileError(file);
    setError(fileError);
    if (fileError) return;
    try {
      await upload({ id: articleId, file }).unwrap();
      onDone('Обкладинку оновлено.');
    } catch (cause) {
      setError(articleCoverErrorMessage(cause));
    }
  };

  const clear = async () => {
    setError(undefined);
    try {
      await remove(articleId).unwrap();
      onDone('Обкладинку прибрано.');
    } catch (cause) {
      setError(articleCoverErrorMessage(cause));
    }
  };

  return {
    busy: uploadState.isLoading || removeState.isLoading,
    choose,
    clear,
    error,
  };
}
