import { SectionCard } from '@admin/shared/ui';
import { alpha, Box, Button, ButtonBase, Typography } from '@mui/material';

interface WorkTasksOverviewCardProps {
  /** Open tasks an administrator gave this person. */
  fromAdmin: number;
  planned: number;
  inProgress: number;
  /** Open tasks past their due day. */
  overdue: number;
  /** The «Мої задачі» page. */
  href: string;
}

/**
 * «Мої задачі» on «Огляд»: orange while open tasks wait, red with «Прострочено» once any is late.
 * The app shows it only when there is at least one open task.
 */
export function WorkTasksOverviewCard({
  fromAdmin,
  href,
  inProgress,
  overdue,
  planned,
}: WorkTasksOverviewCardProps) {
  const tone = overdue > 0 ? 'error' : 'warning';
  return (
    <SectionCard
      action={
        <Button color={tone} href={href} size="small">
          Відкрити задачі
        </Button>
      }
      sx={{
        bgcolor: (theme) => alpha(theme.palette[tone].main, 0.06),
        border: 2,
        borderColor: `${tone}.main`,
      }}
      title="Мої задачі"
    >
      {overdue > 0 ? (
        <Typography color="error" sx={{ fontWeight: 700, mb: 1.5 }} variant="body2">
          Прострочено: {overdue}
        </Typography>
      ) : null}
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: '1fr 1fr' }}>
        <Tile href={href} label="У плані" tone={tone} value={planned} />
        <Tile href={href} label="В роботі" tone={tone} value={inProgress} />
      </Box>
      {fromAdmin > 0 ? (
        <Typography color="text.secondary" sx={{ fontWeight: 600, mt: 1.5 }} variant="body2">
          Від адміністратора: {fromAdmin}
        </Typography>
      ) : null}
    </SectionCard>
  );
}

function Tile({
  href,
  label,
  tone,
  value,
}: {
  href: string;
  label: string;
  tone: 'error' | 'warning';
  value: number;
}) {
  return (
    <ButtonBase
      aria-label={`${label}: ${value}`}
      href={href}
      sx={{
        alignItems: 'flex-start',
        bgcolor: (theme) => alpha(theme.palette[tone].main, 0.12),
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        minHeight: 88,
        p: 1.75,
        textAlign: 'left',
      }}
    >
      <Typography color={`${tone}.dark`} sx={{ fontWeight: 600 }} variant="body2">
        {label}
      </Typography>
      <Typography component="span" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }} variant="h4">
        {value}
      </Typography>
    </ButtonBase>
  );
}
