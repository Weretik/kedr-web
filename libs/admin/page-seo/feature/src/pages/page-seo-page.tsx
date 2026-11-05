import { useGetPageSeoListQuery, useUpdatePageSeoMutation } from '@admin/page-seo/data-access';
import { PageSeoList, PageSeoPanel } from '@admin/page-seo/ui';
import { AdminPageHeader, NoticeSnackbar } from '@admin/shared/ui';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { pageSeoErrorMessage } from '../errors/page-seo-error-message';

import type { PageSeoEntry, PageSeoTexts } from '@admin/page-seo/model';

/** Search titles and descriptions of the site pages that exist once; categories and articles have their own. */
export function PageSeoPage() {
  const query = useGetPageSeoListQuery();
  const [update, saving] = useUpdatePageSeoMutation();
  const [editing, setEditing] = useState<PageSeoEntry | null>(null);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string | null>(null);

  const close = () => {
    setEditing(null);
    setError(undefined);
  };

  const save = async (texts: PageSeoTexts) => {
    if (!editing) return;
    setError(undefined);
    try {
      await update({ page: editing.page, texts }).unwrap();
      setEditing(null);
      setNotice('Збережено. Сайт покаже зміни протягом 10 хвилин.');
    } catch (cause) {
      setError(pageSeoErrorMessage(cause));
    }
  };

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="SEO сторінок" />
      <Typography color="text.secondary" variant="body2">
        Заголовок і опис сторінок сайту в пошуку Google. Порожні поля — сайт показує свої тексти.
        SEO категорій редагується в «Категорії», статей — у самій статті.
      </Typography>
      {query.isError ? (
        <Alert action={<Button onClick={() => query.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити сторінки. Спробуйте ще раз.
        </Alert>
      ) : (
        <PageSeoList
          entries={query.data ?? []}
          loading={query.isLoading}
          onEdit={(entry) => {
            setError(undefined);
            setEditing(entry);
          }}
        />
      )}
      {editing ? (
        <PageSeoPanel
          entry={editing}
          error={error}
          key={editing.page}
          onCancel={close}
          onSave={save}
          saving={saving.isLoading}
        />
      ) : null}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default PageSeoPage;
