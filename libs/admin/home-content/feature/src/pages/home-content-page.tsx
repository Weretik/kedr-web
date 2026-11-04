import { useGetHomeBlocksQuery } from '@admin/home-content/data-access';
import { AdminPageHeader, NoticeSnackbar } from '@admin/shared/ui';
import { Alert, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

import { HomeBrandsSection } from '../components/home-brands-section';
import { HomeFaqSection } from '../components/home-faq-section';

type HomeTab = 'faq' | 'brands';

/** The editable blocks of the site home page: «Часті запитання» and «Бренди». */
export function HomeContentPage() {
  const query = useGetHomeBlocksQuery();
  const [tab, setTab] = useState<HomeTab>('faq');
  const [notice, setNotice] = useState<string | null>(null);
  const faq = query.data?.faq ?? [];
  const brands = query.data?.brands ?? [];

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Головна сторінка" />
      <Typography color="text.secondary" variant="body2">
        Блоки головної сторінки сайту. Зміни з’являються на сайті за кілька хвилин.
      </Typography>
      <Tabs onChange={(_event, value: HomeTab) => setTab(value)} value={tab}>
        <Tab label={`Питання (${faq.length})`} value="faq" />
        <Tab label={`Бренди (${brands.length})`} value="brands" />
      </Tabs>
      {query.isError ? (
        <Alert action={<Button onClick={() => query.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити блоки головної. Спробуйте ще раз.
        </Alert>
      ) : tab === 'faq' ? (
        <HomeFaqSection items={faq} loading={query.isLoading} onNotice={setNotice} />
      ) : (
        <HomeBrandsSection brands={brands} loading={query.isLoading} onNotice={setNotice} />
      )}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default HomeContentPage;
