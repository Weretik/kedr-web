import { useGetLegalDocumentsQuery } from '@admin/documents/data-access';
import { LegalDocumentsList } from '@admin/documents/ui';
import { AdminPageHeader, PageLoader } from '@admin/shared/ui';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/** The four site documents and what the site shows of each. */
export function LegalDocumentsPage() {
  const query = useGetLegalDocumentsQuery();
  const navigate = useNavigate();

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Документи" />
      <Typography color="text.secondary" variant="body2">
        Тексти сторінок оферти, політики конфіденційності, повернення та доставки. Зміни з’являються
        на сайті після публікації; попередні редакції зберігаються в історії.
      </Typography>
      {query.isLoading ? (
        <PageLoader label="Завантаження документів" />
      ) : query.isError || !query.data ? (
        <Alert action={<Button onClick={() => query.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити документи. Спробуйте ще раз.
        </Alert>
      ) : (
        <LegalDocumentsList
          documents={query.data}
          onOpen={(kind) => navigate(`/documents/${kind}`)}
        />
      )}
    </Stack>
  );
}

export default LegalDocumentsPage;
