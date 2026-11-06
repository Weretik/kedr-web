import { greeting, kyivDate } from '@admin/dashboard/model';
import { AttentionList, LatestOrdersTable, SiteCard, TodayCard } from '@admin/dashboard/ui';
import { PageIssues, PageLoader } from '@admin/shared/ui';
import AddIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useDashboardOverview } from '../hooks/use-dashboard-overview';

import type { DashboardRouteOptions } from '../dashboard.routes';

const dayFormat = new Intl.DateTimeFormat('uk-UA', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'Europe/Kyiv',
});

/** «Огляд» («Робочий стіл»): what needs attention, today's orders, and the newest orders. */
export function DashboardPage({
  siteRefreshAction,
  useViewerName,
  workTasksCard,
}: DashboardRouteOptions) {
  const [now] = useState(() => new Date());
  const name = useViewerName();
  const { failed, isLoading, items, orders } = useDashboardOverview(now);
  const today = kyivDate(now);
  const day = dayFormat.format(now);

  return (
    <Stack component="section" spacing={3}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: { md: 'flex-end' }, justifyContent: 'space-between' }}
      >
        <Stack spacing={0.5}>
          <Typography color="text.secondary" sx={{ fontWeight: 600 }} variant="body2">
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </Typography>
          <Typography component="h1" variant="h4">
            {greeting(now, name)}
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button
            href="/orders/new"
            startIcon={<AddIcon />}
            sx={{ minHeight: 44 }}
            variant="contained"
          >
            Нове замовлення
          </Button>
          <Button
            href="/articles/new"
            startIcon={<AddIcon />}
            sx={{ minHeight: 44 }}
            variant="outlined"
          >
            Нова стаття
          </Button>
        </Stack>
      </Stack>

      {failed.length > 0 ? (
        <PageIssues
          messages={[`Не вдалося завантажити: ${failed.join(', ')}. Оновіть сторінку.`]}
        />
      ) : null}

      {isLoading ? (
        <PageLoader label="Завантаження огляду" />
      ) : (
        <Box
          sx={{
            alignItems: 'start',
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 2fr) minmax(0, 1fr)' },
          }}
        >
          <Stack spacing={3} sx={{ minWidth: 0 }}>
            <AttentionList items={items} />
            {orders ? <LatestOrdersTable orders={orders.latestOrders} /> : null}
          </Stack>
          <Stack spacing={3} sx={{ minWidth: 0 }}>
            {workTasksCard}
            {orders ? (
              <TodayCard
                draftCount={orders.draftCount}
                draftsHref="/orders?ordersTab=drafts"
                ordersHref={`/orders?ordersOFrom=${today}&ordersOTo=${today}`}
                ordersToday={orders.ordersToday}
              />
            ) : null}
            <SiteCard action={siteRefreshAction} />
          </Stack>
        </Box>
      )}
    </Stack>
  );
}

export default DashboardPage;
