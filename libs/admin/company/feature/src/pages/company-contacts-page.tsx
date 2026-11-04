import { useGetCompanyContactsQuery } from '@admin/company/data-access';
import { CompanyContactsForm } from '@admin/company/ui';
import { AdminPageHeader, NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useCompanyContactsEditor } from '../hooks/use-company-contacts-editor';

/** The sales contacts of the public site, edited in one form. */
export function CompanyContactsPage() {
  const query = useGetCompanyContactsQuery();
  const [notice, setNotice] = useState<string | null>(null);
  const editor = useCompanyContactsEditor(query.data, () =>
    setNotice('Контакти збережено. Сайт покаже їх протягом 10 хвилин.'),
  );

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Контакти компанії" />
      <Typography color="text.secondary" variant="body2">
        Телефон, email, месенджери, карта і місто, які сайт показує на всіх сторінках, у політиці
        конфіденційності та в даних для пошукових систем.
      </Typography>
      {query.isLoading ? (
        <PageLoader label="Завантаження контактів" />
      ) : query.isError || !editor.draft ? (
        <Alert action={<Button onClick={() => query.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити контакти. Спробуйте ще раз.
        </Alert>
      ) : (
        <CompanyContactsForm
          dirty={editor.dirty}
          draft={editor.draft}
          errors={editor.errors}
          onChange={editor.change}
          onReset={editor.reset}
          onSave={() => void editor.save()}
          saveError={editor.saveError}
          saving={editor.saving}
        />
      )}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default CompanyContactsPage;
