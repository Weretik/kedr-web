import { AdminPageHeader, ChangedNote, NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import { useGetWholesalePageQuery } from '@admin/wholesale-content/data-access';
import { WholesaleForm } from '@admin/wholesale-content/ui';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useWholesaleEditor } from '../hooks/use-wholesale-editor';

/** The texts of the site page «Співпраця» in both languages, edited in one form. */
export function WholesaleContentPage() {
  const query = useGetWholesalePageQuery();
  const [notice, setNotice] = useState<string | null>(null);
  const editor = useWholesaleEditor(query.data, () =>
    setNotice('Тексти збережено. Сайт покаже їх протягом 10 хвилин.'),
  );

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Сторінка «Співпраця»" />
      <Typography color="text.secondary" variant="body2">
        Тексти оптової сторінки сайту українською та російською. Кнопки, розділи каталогу й контакти
        сайт бере сам.
      </Typography>
      {query.isLoading ? (
        <PageLoader label="Завантаження текстів" />
      ) : query.isError || !editor.draft ? (
        <Alert action={<Button onClick={() => query.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити тексти. Спробуйте ще раз.
        </Alert>
      ) : (
        <>
          {query.data ? <ChangedNote at={query.data.updatedAt} by={query.data.updatedBy} /> : null}
          <WholesaleForm
            dirty={editor.dirty}
            draft={editor.draft}
            errors={editor.errors}
            onChange={editor.change}
            onReset={editor.reset}
            onSave={() => void editor.save()}
            saveError={editor.saveError}
            saving={editor.saving}
          />
        </>
      )}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default WholesaleContentPage;
