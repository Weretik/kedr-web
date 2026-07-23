import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import TabletMacOutlinedIcon from '@mui/icons-material/TabletMacOutlined';
import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';

const sources = [
  { icon: <DesktopWindowsOutlinedIcon />, label: 'Desktop', value: 63 },
  { icon: <TabletMacOutlinedIcon />, label: 'Tablet', value: 15 },
  { icon: <PhoneAndroidOutlinedIcon />, label: 'Phone', value: 22 },
];

export function DashboardTrafficChart() {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Джерела трафіку" />
      <CardContent>
        <Stack spacing={2}>
          <PieChart
            colors={[theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main]}
            height={300}
            hideLegend
            series={[
              {
                data: sources.map((source) => ({ id: source.label, label: source.label, value: source.value })),
                innerRadius: 72,
                outerRadius: 110,
                paddingAngle: 3,
              },
            ]}
          />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            {sources.map((source) => (
              <Stack key={source.label} spacing={1} sx={{ alignItems: 'center' }}>
                {source.icon}
                <Typography variant="subtitle2">{source.label}</Typography>
                <Typography color="text.secondary" variant="body2">{source.value}%</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
