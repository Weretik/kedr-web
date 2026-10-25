import { StatusPill } from '@admin/shared/ui';
import { Box, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface StatisticCardProps {
  description?: string;
  icon: ReactNode;
  progress?: number;
  title: string;
  trend?: { direction: 'up' | 'down'; label: string };
  value: string;
}

export function StatisticCard({
  description,
  icon,
  progress,
  title,
  trend,
  value,
}: StatisticCardProps) {
  return (
    <Card
      sx={(theme) => ({
        height: '100%',
        minHeight: 176,
        transition: theme.transitions.create(['transform', 'box-shadow']),
        '&:hover': { boxShadow: theme.shadows[2], transform: 'translateY(-2px)' },
      })}
    >
      <CardContent sx={{ height: '100%' }}>
        <Stack spacing={2.5} sx={{ height: '100%', justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
          >
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                {title}
              </Typography>
              <Typography sx={{ fontVariantNumeric: 'tabular-nums' }} variant="h4">
                {value}
              </Typography>
            </Stack>
            <Box
              aria-hidden="true"
              sx={{
                alignItems: 'center',
                bgcolor: 'primary.light',
                borderRadius: '14px',
                color: 'primary.dark',
                display: 'flex',
                flex: '0 0 auto',
                height: 48,
                justifyContent: 'center',
                width: 48,
              }}
            >
              {icon}
            </Box>
          </Stack>
          {trend ? (
            <Box>
              <StatusPill
                label={trend.label}
                tone={trend.direction === 'up' ? 'success' : 'error'}
              />
            </Box>
          ) : description ? (
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
          ) : null}
          {progress === undefined ? null : (
            <LinearProgress
              aria-label={`${title}: ${progress}%`}
              sx={{ borderRadius: 999, height: 8 }}
              value={progress}
              variant="determinate"
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
