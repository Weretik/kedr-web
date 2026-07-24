import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { Grid } from '@mui/material';

import { DashboardLatestOrders } from '../components/dashboard-latest-orders';
import { DashboardLatestProducts } from '../components/dashboard-latest-products';
import { DashboardSalesChart } from '../components/dashboard-sales-chart';
import { DashboardTrafficChart } from '../components/dashboard-traffic-chart';
import { StatisticCard } from '../components/statistic-card';

const statistics = [
  { icon: <AccountBalanceWalletOutlinedIcon />, title: 'Бюджет', trend: { direction: 'up' as const, label: '+12% за місяць' }, value: '₴ 84 200' },
  { icon: <PeopleAltOutlinedIcon />, title: 'Клієнти', trend: { direction: 'up' as const, label: '+16% за місяць' }, value: '1 248' },
  { icon: <ChecklistOutlinedIcon />, progress: 75.5, title: 'Виконання завдань', value: '75,5%' },
  { icon: <CategoryOutlinedIcon />, title: 'Прибуток', value: '₴ 56 400' },
] as const;

export function DashboardPage() {
  return (
    <Grid component="section" container spacing={3}>

        <Grid size={{ lg: 4, md: 6, xs: 12 }}>
          <DashboardLatestProducts />
        </Grid>
        <Grid size={{ lg: 8, md: 12, xs: 12 }}>
          <DashboardLatestOrders />
        </Grid>
      {statistics.map((statistic) => (
        <Grid key={statistic.title} size={{ lg: 3, sm: 6, xs: 12 }}>
          <StatisticCard {...statistic} />
        </Grid>
      ))}
      <Grid size={{ lg: 8, xs: 12 }}>
        <DashboardSalesChart />
      </Grid>
      <Grid size={{ lg: 4, md: 6, xs: 12 }}>
        <DashboardTrafficChart />
      </Grid>
    </Grid>
  );
}
