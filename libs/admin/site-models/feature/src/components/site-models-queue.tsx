import {
  useGetSiteModelCategoriesQuery,
  useGetSiteShowcaseQuery,
} from '@admin/site-models/data-access';
import { nextSiteQueueKey, siteQueueCounts, siteQueueFilter } from '@admin/site-models/model';
import {
  SiteCategoryPicker,
  SiteModelsHelpDialog,
  SiteQueueList,
  SiteQueueViews,
} from '@admin/site-models/ui';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box, Button, Card, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SiteLoneProductPane } from './site-lone-product-pane';
import { SiteModelPane } from './site-model-pane';
import { readSiteQueueState, writeSiteQueueState } from '../model/site-showcase-url-state';

import type { SiteQueueState } from '../model/site-showcase-url-state';
import type { SiteQueueView } from '@admin/site-models/model';

const emptyTexts: Record<SiteQueueView, string> = {
  review: 'Немає моделей на перевірку. Усе, що запропонувала система, переглянуто.',
  problems: 'Погоджених моделей з проблемами немає.',
  lone: 'Усі товари сайту входять у моделі.',
  all: 'У цій категорії немає товарів на сайті.',
};

/** Only the queue list scrolls, beside the page; the open model takes the height it needs. */
const queueListHeight = { xs: 360, md: 'calc(100vh - 140px)' };

/** «Моделі» of «Вітрина сайту»: the queue on the left, the open model beside it (canvas variant B). */
export function SiteModelsQueue({ onNotice }: { onNotice: (text: string) => void }) {
  const [params, setParams] = useSearchParams();
  const state = readSiteQueueState(params);
  const [search, setSearch] = useState(state.search ?? '');
  const [help, setHelp] = useState(false);
  const categories = useGetSiteModelCategoriesQuery();
  const showcase = useGetSiteShowcaseQuery({
    categoryId: state.categoryId,
    search: state.search,
    ...siteQueueFilter(state.view),
    page: 1,
    pageSize: 200,
  });

  const update = (change: Partial<SiteQueueState>, replace = false) =>
    setParams(writeSiteQueueState({ ...state, ...change }), { replace });

  // The search goes to the address after a pause in typing.
  useEffect(() => {
    const next = search.trim() || undefined;
    if (next === state.search) return;
    const timer = setTimeout(() => update({ search: next, item: undefined }, true), 350);
    return () => clearTimeout(timer);
  });

  const rows = showcase.data?.items ?? [];
  const keys = rows.map((row) => row.key);
  const selectedKey = state.item ?? keys[0];
  const next = nextSiteQueueKey(keys, selectedKey);
  const openNext = () => {
    if (next && next !== selectedKey) update({ item: next });
  };
  const counts = categories.data ? siteQueueCounts(categories.data, state.categoryId) : undefined;
  const lone = selectedKey?.startsWith('p')
    ? rows.find((row) => row.key === selectedKey)
    : undefined;
  const modelId = selectedKey?.startsWith('m') ? Number(selectedKey.slice(1)) : undefined;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: 'center', flexWrap: 'wrap' }}
        useFlexGap
      >
        <SiteCategoryPicker
          categories={categories.data ?? []}
          loading={categories.isLoading}
          onSelect={(categoryId) => update({ categoryId, item: undefined })}
          selectedId={state.categoryId}
        />
        <SiteQueueViews
          counts={counts}
          onChange={(view) => update({ view, item: undefined })}
          value={state.view}
        />
        <TextField
          aria-label="Пошук"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Модель, товар або код 1С"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flex: '1 1 220px', maxWidth: 360 }}
          type="search"
          value={search}
        />
        <Button onClick={() => setHelp(true)} startIcon={<HelpOutlineOutlinedIcon />}>
          Як це працює
        </Button>
      </Stack>
      <Box
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '320px minmax(0, 1fr)' },
        }}
      >
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight: queueListHeight,
            minHeight: 0,
            p: 1,
            position: { md: 'sticky' },
            top: { md: 16 },
          }}
          variant="outlined"
        >
          <SiteQueueList
            emptyText={emptyTexts[state.view]}
            error={showcase.isError}
            loading={showcase.isFetching}
            onRetry={() => void showcase.refetch()}
            onSelect={(item) => update({ item }, true)}
            rows={rows}
            selectedKey={selectedKey}
            totalCount={showcase.data?.totalCount ?? 0}
          />
        </Card>
        <Box sx={{ minWidth: 0 }}>
          {modelId ? (
            <SiteModelPane
              hasNext={next !== undefined && next !== selectedKey}
              key={modelId}
              modelId={modelId}
              onNext={openNext}
              onNotice={onNotice}
            />
          ) : lone ? (
            <SiteLoneProductPane
              key={lone.key}
              onCreated={(id) => update({ view: 'all', item: `m${id}` })}
              onNotice={onNotice}
              row={lone}
            />
          ) : rows.length > 0 || selectedKey ? (
            <Typography color="text.secondary" sx={{ p: 2 }} variant="body2">
              Виберіть модель у списку.
            </Typography>
          ) : null}
        </Box>
      </Box>
      {help ? <SiteModelsHelpDialog onClose={() => setHelp(false)} /> : null}
    </Stack>
  );
}
