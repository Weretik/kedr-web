import { AdminPageHeader, NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { Button, Stack, Tab, Tabs } from '@mui/material';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SiteModelsQueue } from '../components/queue/site-models-queue';
import { readSiteShowcaseTab } from '../model/site-showcase-url-state';

import type { SiteShowcaseTab } from '../model/site-showcase-url-state';
import type { ReactNode } from 'react';

/** What the app gives the «Ознаки», «Не розшифровані коди», and «Фільтри категорій» tabs. */
export interface SiteDictionaryTabProps {
  tab: Exclude<SiteShowcaseTab, 'models'>;
  canEdit: boolean;
  /** «Нова ознака» is pressed in the tabs row; the tab opens its panel. */
  creating: boolean;
  onCreatingChange: (creating: boolean) => void;
  onNotice: (text: string) => void;
}

interface SiteShowcasePageProps {
  canEditCatalog: boolean;
  renderDictionaryTab: (props: SiteDictionaryTabProps) => ReactNode;
}

/**
 * «Вітрина сайту» (spec catalog/007 stage 4c): everything that decides how the catalog looks on the site, on one page.
 * «Моделі» is a review queue with the open model beside it; the other tabs come from the attributes dictionary.
 */
export function SiteShowcasePage({ canEditCatalog, renderDictionaryTab }: SiteShowcasePageProps) {
  const [params, setParams] = useSearchParams();
  const tab = readSiteShowcaseTab(params);
  const [notice, setNotice] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Вітрина сайту" />
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', borderBottom: 1, borderColor: 'divider', mt: -1 }}
      >
        <Tabs
          aria-label="Розділ вітрини"
          onChange={(_event, value: SiteShowcaseTab) => {
            setCreating(false);
            setParams(value === 'models' ? {} : { tab: value });
          }}
          sx={{ flex: 1, minWidth: 0 }}
          value={tab}
          variant="scrollable"
        >
          <Tab label="Моделі" value="models" />
          <Tab label="Ознаки" value="attributes" />
          <Tab label="Не розшифровані коди" value="codes" />
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
      {tab === 'models' ? (
        <SiteModelsQueue onNotice={setNotice} />
      ) : (
        <Suspense fallback={<PageLoader label="Завантаження" />}>
          {renderDictionaryTab({
            tab,
            canEdit: canEditCatalog,
            creating,
            onCreatingChange: setCreating,
            onNotice: setNotice,
          })}
        </Suspense>
      )}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default SiteShowcasePage;
