import { AdminPageHeader, NoticeSnackbar } from '@admin/shared/ui';
import { Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AttributesTab } from '../components/attributes-tab';
import { CategoryFiltersTab } from '../components/category-filters-tab';
import { UnresolvedCodesTab } from '../components/unresolved-codes-tab';

type AttributesPageTab = 'attributes' | 'codes' | 'filters';

const tabs: readonly AttributesPageTab[] = ['attributes', 'codes', 'filters'];

/** «Властивості» (spec catalog/006, phase 3): the dictionary of product properties. Admins change it. */
export function CatalogAttributesPage({ canEdit }: { canEdit: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('tab') as AttributesPageTab | null;
  const tab: AttributesPageTab = requested && tabs.includes(requested) ? requested : 'attributes';
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Властивості" />
      <Tabs
        aria-label="Розділ властивостей"
        onChange={(_event, value: AttributesPageTab) =>
          setSearchParams(value === 'attributes' ? {} : { tab: value })
        }
        sx={{ borderBottom: 1, borderColor: 'divider', mt: -1 }}
        value={tab}
        variant="scrollable"
      >
        <Tab label="Властивості" value="attributes" />
        <Tab label="Не розшифровані коди" value="codes" />
        <Tab label="Фільтри категорій" value="filters" />
      </Tabs>
      {tab === 'attributes' ? <AttributesTab canEdit={canEdit} onNotice={setNotice} /> : null}
      {tab === 'codes' ? <UnresolvedCodesTab canEdit={canEdit} onNotice={setNotice} /> : null}
      {tab === 'filters' ? <CategoryFiltersTab canEdit={canEdit} onNotice={setNotice} /> : null}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default CatalogAttributesPage;
