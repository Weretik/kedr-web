import { SiteModelsHelpDialog, SiteQueueList } from '@admin/site-models/ui';
import { Box, Card, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { SiteQueueToolbar } from './site-queue-toolbar';
import { useSiteModelsQueue } from '../../hooks/use-site-models-queue';
import { SiteModelPane } from '../model-pane/site-model-pane';
import { SiteLoneProductPane } from '../product-pane/site-lone-product-pane';

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
  const queue = useSiteModelsQueue();
  const { rows, selection, showcase, state, update } = queue;
  const { lone, modelId, nextKey, selectedKey } = selection;
  const [help, setHelp] = useState(false);

  return (
    <Stack spacing={2}>
      <SiteQueueToolbar onHelp={() => setHelp(true)} queue={queue} />
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
              hasNext={nextKey !== undefined}
              key={modelId}
              modelId={modelId}
              onNext={queue.openNext}
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
