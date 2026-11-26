import { SiteModelsHelpDialog, SiteQueueList } from '@admin/site-models/ui';
import { Box, Card, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { SiteQueueToolbar } from './site-queue-toolbar';
import { useSiteModelsQueue } from '../../hooks/lists/use-site-models-queue';
import { SiteModelPane } from '../model-pane/site-model-pane';

const emptyText = 'Немає моделей на перевірку. Усе, що запропонувала система, переглянуто.';

/** Only the queue list scrolls, beside the page; the open model takes the height it needs. */
const queueListHeight = { xs: 360, md: 'calc(100vh - 140px)' };

/** «Нові моделі» of «Перевірка»: proposals on the left, the open one beside it, reviewed one by one. */
export function SiteModelsQueue({ onNotice }: { onNotice: (text: string) => void }) {
  const queue = useSiteModelsQueue();
  const { rows, selection, showcase, update } = queue;
  const { modelId, nextKey, selectedKey } = selection;
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
            emptyText={emptyText}
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
