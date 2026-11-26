import { AdminPageHeader, NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { Button, Stack, Tab, Tabs } from '@mui/material';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { readSiteAttributesTab } from '../model/site-page-tabs';

import type { SiteAttributesTab, SiteDictionaryTabProps } from '../model/site-page-tabs';
import type { ReactNode } from 'react';

interface SiteAttributesPageProps {
  canEditCatalog: boolean;
  renderDictionaryTab: (props: SiteDictionaryTabProps) => ReactNode;
}

/**
 * «Ознаки та фільтри» (spec admin/site-models/001, R-009): the attributes dictionary and the filters each category
 * offers on the site, from the attributes feature. Admins change them; Managers see them.
 */
export function SiteAttributesPage({
  canEditCatalog,
  renderDictionaryTab,
}: SiteAttributesPageProps) {
  const [params, setParams] = useSearchParams();
  const tab = readSiteAttributesTab(params);
  const [notice, setNotice] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Ознаки та фільтри" />
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', borderBottom: 1, borderColor: 'divider', mt: -1 }}
      >
        <Tabs
          aria-label="Розділ ознак"
          onChange={(_event, value: SiteAttributesTab) => {
            setCreating(false);
            setParams({ tab: value });
          }}
          sx={{ flex: 1, minWidth: 0 }}
          value={tab}
          variant="scrollable"
        >
          <Tab label="Ознаки" value="attributes" />
          <Tab label="Фільтри категорій" value="filters" />
        </Tabs>
        {canEditCatalog && tab === 'attributes' ? (
          <Button
            onClick={() => setCreating(true)}
            startIcon={<AddOutlined />}
            sx={{ flexShrink: 0 }}
            variant="contained"
          >
            Нова ознака
          </Button>
        ) : null}
      </Stack>
      <Suspense fallback={<PageLoader label="Завантаження" />}>
        {renderDictionaryTab({
          tab,
          canEdit: canEditCatalog,
          creating,
          onCreatingChange: setCreating,
          onNotice: setNotice,
        })}
      </Suspense>
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default SiteAttributesPage;
