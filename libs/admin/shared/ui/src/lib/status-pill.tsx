import { Box } from '@mui/material';

export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusPillProps {
  label: string;
  tone: StatusTone;
}

/** Compact status label: soft tone background, tone text, and a dot. Always carries text. */
export function StatusPill({ label, tone }: StatusPillProps) {
  const neutral = tone === 'neutral';

  return (
    <Box
      component="span"
      sx={{
        alignItems: 'center',
        bgcolor: neutral ? 'action.hover' : `${tone}.light`,
        borderRadius: 999,
        color: neutral ? 'text.secondary' : `${tone}.main`,
        display: 'inline-flex',
        fontSize: '0.75rem',
        fontWeight: 700,
        gap: 0.75,
        lineHeight: 1.5,
        px: 1.25,
        py: 0.375,
        whiteSpace: 'nowrap',
      }}
    >
      <Box
        aria-hidden="true"
        component="span"
        sx={{ bgcolor: 'currentColor', borderRadius: '50%', flex: '0 0 auto', height: 6, width: 6 }}
      />
      {label}
    </Box>
  );
}
