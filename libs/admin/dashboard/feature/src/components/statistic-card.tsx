import { Avatar, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface StatisticCardProps {
  description?: string;
  icon: ReactNode;
  progress?: number;
  title: string;
  trend?: { direction: 'up' | 'down'; label: string };
  value: string;
}

export function StatisticCard({ description, icon, progress, title, trend, value }: StatisticCardProps) {
  const trendColor = trend?.direction === 'up' ? 'success.main' : 'error.main';

  return (
    <Card sx={{ height: '100%', minHeight: 184 }}>
      <CardContent sx={{ height: '100%' }}>
        <Stack spacing={3} sx={{ height: '100%', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                {title}
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar sx={{ bgcolor: 'primary.main', height: 56, width: 56 }}>{icon}</Avatar>
          </Stack>
          <Typography
            color={trend ? trendColor : 'text.secondary'}
            sx={{ minHeight: '22px', visibility: trend || description ? 'visible' : 'hidden' }}
            variant="body2"
          >
            {trend?.label ?? description ?? '—'}
          </Typography>
          {progress === undefined ? null : <LinearProgress aria-label={`${title}: ${progress}%`} value={progress} variant="determinate" />}
        </Stack>
      </CardContent>
    </Card>
  );
}
