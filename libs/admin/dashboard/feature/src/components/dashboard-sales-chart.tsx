import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { Button, Card, CardActions, CardContent, CardHeader, Divider } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';

const months = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];

export function DashboardSalesChart() {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        action={<Button color="inherit" size="small" startIcon={<RefreshOutlinedIcon />}>Синхронізувати</Button>}
        title="Продажі"
      />
      <CardContent>
        <BarChart
          colors={[theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)]}
          grid={{ horizontal: true }}
          height={350}
          series={[
            { data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20], label: 'Поточний рік' },
            { data: [12, 10, 7, 9, 5, 11, 9, 12, 13, 15, 14, 17], label: 'Минулий рік' },
          ]}
          xAxis={[{ data: months, scaleType: 'band' }]}
        />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" endIcon={<ArrowForwardOutlinedIcon />} size="small">Огляд</Button>
      </CardActions>
    </Card>
  );
}
