import { SectionCard } from '@admin/shared/ui';
import { Box, Button, ButtonBase, Typography } from '@mui/material';

interface WorkTasksOverviewCardProps {
  /** Open tasks an administrator gave this person. */
  fromAdmin: number;
  planned: number;
  inProgress: number;
  /** The «Мої задачі» page. */
  href: string;
}

/** «Мої задачі» on «Огляд»: how many open tasks wait, with a way to the board. */
export function WorkTasksOverviewCard({
  fromAdmin,
  href,
  inProgress,
  planned,
}: WorkTasksOverviewCardProps) {
  return (
    <SectionCard
      action={
        <Button href={href} size="small">
          Відкрити задачі
        </Button>
      }
      title="Мої задачі"
    >
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: '1fr 1fr' }}>
        <Tile accent href={href} label="У плані" value={planned} />
        <Tile href={href} label="В роботі" value={inProgress} />
      </Box>
      {fromAdmin > 0 ? (
        <Typography color="primary.dark" sx={{ fontWeight: 600, mt: 1.5 }} variant="body2">
          Від адміністратора: {fromAdmin}
        </Typography>
      ) : null}
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
