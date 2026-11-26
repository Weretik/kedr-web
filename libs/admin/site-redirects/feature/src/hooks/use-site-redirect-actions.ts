import {
  useCreateSiteRedirectMutation,
  useDeleteSiteRedirectMutation,
  useUpdateSiteRedirectMutation,
} from '@admin/site-redirects/data-access';
import { useState } from 'react';

import { siteRedirectErrorMessage } from '../errors/site-redirect-error-message';

import type { SiteRedirect, SiteRedirectDraft } from '@admin/site-redirects/model';

/** The edit panel (`null` = new, `undefined` = closed) and the delete question, with their requests. */
export function useSiteRedirectActions(current: (id: number) => SiteRedirect | undefined) {
  const [create, creating] = useCreateSiteRedirectMutation();
  const [update, updating] = useUpdateSiteRedirectMutation();
  const [remove, removing] = useDeleteSiteRedirectMutation();
  const [editing, setEditing] = useState<SiteRedirect | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<SiteRedirect | null>(null);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string | null>(null);

  const open = (redirect: SiteRedirect | null) => {
    setError(undefined);
    setEditing(redirect);
  };
  const close = () => {
    setError(undefined);
    setEditing(undefined);
    setDeleting(null);
  };

  const saving = creating.isLoading || updating.isLoading;

  const save = async (draft: SiteRedirectDraft) => {
    if (saving) return;
    setError(undefined);
    try {
      if (editing) {
        // After a 409 the list reloads; the panel keeps the typed addresses and sends the current version.
        const version = current(editing.id)?.version ?? editing.version;
        await update({ id: editing.id, draft, version }).unwrap();
      } else {
        await create(draft).unwrap();
      }
      close();
      setNotice('Збережено. Сайт почне переадресовувати протягом 5 хвилин.');
    } catch (cause) {
      setError(siteRedirectErrorMessage(cause));
    }
  };

  const confirmDelete = async () => {
    if (!deleting || removing.isLoading) return;
    setError(undefined);
    try {
      await remove(deleting.id).unwrap();
      close();
      setNotice('Переадресацію видалено.');
    } catch (cause) {
      setError(siteRedirectErrorMessage(cause, 'Не вдалося видалити. Спробуйте ще раз.'));
    }
  };

  return {
    close,
    confirmDelete,
    deleting,
    editing,
    error,
    notice,
    open,
    askDelete: (redirect: SiteRedirect) => {
      setError(undefined);
      setDeleting(redirect);
    },
    clearNotice: () => setNotice(null),
    removing: removing.isLoading,
    save,
    saving,
  };
}
