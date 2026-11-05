import { SectionCard } from '@admin/shared/ui';
import { Box, ButtonBase, Typography } from '@mui/material';

interface TodayCardProps {
  ordersToday: number;
  draftCount: number;
  /** Order list filtered to today. */
  ordersHref: string;
  draftsHref: string;
}

/** «Сьогодні»: today's orders and the drafts waiting to become orders. */
export function TodayCard({ draftCount, draftsHref, ordersHref, ordersToday }: TodayCardProps) {
  return (
    <SectionCard title="Сьогодні">
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: '1fr 1fr' }}>
        <Tile accent href={ordersHref} label="Замовлень" value={ordersToday} />
        <Tile href={draftsHref} label="Чернеток" value={draftCount} />
      </Box>
    </SectionCard>
  );
}

function Tile({
  accent = false,
  href,
  label,
  value,
}: {
  accent?: boolean;
  href: string;
  label: string;
  value: number;
}) {
  return (
    <ButtonBase
      aria-label={`${label}: ${value}`}
      href={href}
      sx={{
        alignItems: 'flex-start',
        bgcolor: accent ? 'primary.light' : 'action.hover',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        minHeight: 88,
        p: 1.75,
        textAlign: 'left',
      }}
    >
      <Typography
        color={accent ? 'primary.dark' : 'text.secondary'}
        sx={{ fontWeight: 600 }}
        variant="body2"
      >
        {label}
      </Typography>
      <Typography component="span" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }} variant="h4">
        {value}
      </Typography>
    </ButtonBase>
  );
}
