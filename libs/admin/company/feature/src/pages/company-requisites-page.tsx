import {
  useGetCompanyRequisitesHistoryQuery,
  useGetCompanyRequisitesQuery,
} from '@admin/company/data-access';
import { CompanyRequisitesForm, CompanyRequisitesHistory } from '@admin/company/ui';
import { AdminPageHeader, ChangedNote, NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useCompanyRequisitesEditor } from '../hooks/use-company-requisites-editor';

/** The payment requisites of the public site with the log of every change; Admins only. */
export function CompanyRequisitesPage() {
  const query = useGetCompanyRequisitesQuery();
  const history = useGetCompanyRequisitesHistoryQuery();
  const [notice, setNotice] = useState<string | null>(null);
  const editor = useCompanyRequisitesEditor(query.data, () =>
    setNotice('Реквізити збережено. Сайт покаже їх протягом 10 хвилин.'),
  );

  const lastChange = history.data?.[0];

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Реквізити" />
      <Typography color="text.secondary" variant="body2">
        Дані для оплати на сторінці «Реквізити» сайту і в кнопках копіювання. Змінювати можуть лише
        адміністратори; кожне збереження потрапляє в історію.
      </Typography>
      {lastChange ? <ChangedNote at={lastChange.changedAt} by={lastChange.changedBy} /> : null}
      {query.isLoading ? (
        <PageLoader label="Завантаження реквізитів" />
      ) : query.isError || !editor.draft ? (
        <Alert action={<Button onClick={() => query.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити реквізити. Спробуйте ще раз.
        </Alert>
      ) : (
        <Box
          sx={{
            alignItems: 'start',
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 3fr) minmax(0, 2fr)' },
          }}
        >
          <CompanyRequisitesForm
            dirty={editor.dirty}
            draft={editor.draft}
            errors={editor.errors}
            onChange={editor.change}
            onReset={editor.reset}
            onSave={() => void editor.save()}
            saveError={editor.saveError}
            saving={editor.saving}
          />
          {history.isError ? (
            <Alert
              action={<Button onClick={() => history.refetch()}>Повторити</Button>}
              severity="warning"
            >
              Не вдалося завантажити історію змін.
            </Alert>
          ) : history.data ? (
            <CompanyRequisitesHistory entries={history.data} />
          ) : (
            <PageLoader label="Завантаження історії" />
          )}
        </Box>
      )}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default CompanyRequisitesPage;
