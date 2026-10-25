import { AdminPageHeader, StatusPill } from '@admin/shared/ui';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AddIcon from '@mui/icons-material/Add';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { Box, Button, Grid, Stack, keyframes } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { DashboardLatestOrders } from '../components/dashboard-latest-orders';
import { DashboardLatestProducts } from '../components/dashboard-latest-products';
import { DashboardSalesChart } from '../components/dashboard-sales-chart';
import { DashboardTrafficChart } from '../components/dashboard-traffic-chart';
import { StatisticCard } from '../components/statistic-card';

import type { ReactNode } from 'react';

const statistics = [
  {
    icon: <AccountBalanceWalletOutlinedIcon />,
    title: 'Бюджет',
    trend: { direction: 'up' as const, label: '+12% за місяць' },
    value: '₴ 84 200',
  },
  {
    icon: <PeopleAltOutlinedIcon />,
    title: 'Клієнти',
    trend: { direction: 'up' as const, label: '+16% за місяць' },
    value: '1 248',
  },
  { icon: <ChecklistOutlinedIcon />, progress: 75.5, title: 'Виконання завдань', value: '75,5%' },
  { icon: <CategoryOutlinedIcon />, title: 'Прибуток', value: '₴ 56 400' },
] as const;

const rise = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
`;

/** Grid cell that rises in after the previous ones; reduced motion turns it off globally. */
function Reveal({
  children,
  order,
  size,
}: {
  children: ReactNode;
  order: number;
  size: Record<string, number>;
}) {
  return (
    <Grid
      size={size}
      sx={(theme) => ({
        animation: `${rise} ${theme.transitions.duration.complex}ms ${theme.transitions.easing.easeOut} both`,
        animationDelay: `${order * 60}ms`,
      })}
    >
      {children}
    </Grid>
  );
}

export function DashboardPage() {
  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          <>
            <Button component={RouterLink} to="/catalog" variant="outlined">
              Каталог
            </Button>
            <Button
              component={RouterLink}
              startIcon={<AddIcon />}
              to="/orders/new"
              variant="contained"
            >
              Нове замовлення
            </Button>
          </>
        }
        title="Огляд"
      />
      <Box>
        <StatusPill label="Демо-дані: показники ще не підключені до API" tone="neutral" />
      </Box>
      <Grid container spacing={3}>
        {statistics.map((statistic, index) => (
          <Reveal key={statistic.title} order={index} size={{ lg: 3, sm: 6, xs: 12 }}>
            <StatisticCard {...statistic} />
          </Reveal>
        ))}
        <Reveal order={4} size={{ lg: 8, xs: 12 }}>
          <DashboardSalesChart />
        </Reveal>
        <Reveal order={5} size={{ lg: 4, md: 6, xs: 12 }}>
          <DashboardTrafficChart />
        </Reveal>
        <Reveal order={6} size={{ lg: 8, md: 12, xs: 12 }}>
          <DashboardLatestOrders />
        </Reveal>
        <Reveal order={7} size={{ lg: 4, md: 6, xs: 12 }}>
          <DashboardLatestProducts />
        </Reveal>
      </Grid>
    </Stack>
  );
}

export default DashboardPage;
