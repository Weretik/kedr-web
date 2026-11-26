import { AdminPageHeader, NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import { useGetSiteModelCategoriesQuery } from '@admin/site-models/data-access';
import { siteReviewCounts } from '@admin/site-models/model';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SiteModelsQueue } from '../components/queue/site-models-queue';
import { LoneProductsTab } from '../components/review/lone-products-tab';
import { readSiteReviewTab, writeSiteReviewState } from '../model/site-review-url-state';

import type { SiteDictionaryTabProps } from '../model/site-page-tabs';
import type { SiteReviewTab } from '../model/site-review-url-state';
import type { ReactNode } from 'react';

interface SiteReviewPageProps {
  canEditCatalog: boolean;
  /** Undecoded 1C codes; unknown while they load. */
  codesCount: number | undefined;
  renderDictionaryTab: (props: SiteDictionaryTabProps) => ReactNode;
}

const withCount = (label: string, count: number | undefined) =>
  count === undefined ? label : `${label} · ${count}`;

/**
 * «Перевірка» (spec admin/site-models/001, R-007): what a 1C sync left to decide. New models are reviewed one by
 * one, products in no model are added to a model, and undecoded codes get their meaning.
 */
export function SiteReviewPage({
  canEditCatalog,
  codesCount,
  renderDictionaryTab,
}: SiteReviewPageProps) {
  const [params, setParams] = useSearchParams();
  const tab = readSiteReviewTab(params);
  const [notice, setNotice] = useState<string | null>(null);
  const categories = useGetSiteModelCategoriesQuery();
  const counts = categories.data ? siteReviewCounts(categories.data) : undefined;

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Перевірка" />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: -1 }}>
        <Tabs
          aria-label="Що перевірити"
          onChange={(_event, value: SiteReviewTab) => setParams(writeSiteReviewState(value))}
          value={tab}
          variant="scrollable"
        >
          <Tab label={withCount('Нові моделі', counts?.review)} value="new" />
          <Tab label={withCount('Товари без моделі', counts?.lone)} value="lone" />
          <Tab label={withCount('Коди з 1С', codesCount)} value="codes" />
        </Tabs>
      </Box>
      {tab === 'new' ? <SiteModelsQueue onNotice={setNotice} /> : null}
      {tab === 'lone' ? <LoneProductsTab onNotice={setNotice} /> : null}
      {tab === 'codes' ? (
        <Suspense fallback={<PageLoader label="Завантаження" />}>
          {renderDictionaryTab({
            tab: 'codes',
            canEdit: canEditCatalog,
            creating: false,
            onCreatingChange: () => undefined,
            onNotice: setNotice,
          })}
        </Suspense>
      ) : null}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default SiteReviewPage;
