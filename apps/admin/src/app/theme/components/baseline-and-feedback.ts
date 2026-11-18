import { type Components, type Theme } from '@mui/material/styles';

/** Page baseline, alerts, badges, chips and tooltips. */
export const adminBaseComponents = {
  MuiCssBaseline: {
    styleOverrides: {
      body: { WebkitFontSmoothing: 'antialiased' },
      '@media (prefers-reduced-motion: reduce)': {
        '*, *::before, *::after': {
          animationDuration: '0.01ms !important',
          animationIterationCount: '1 !important',
          scrollBehavior: 'auto !important',
          transitionDuration: '0.01ms !important',
        },
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: { alignItems: 'center', borderRadius: 12, fontWeight: 500 },
      action: { paddingTop: 0 },
    },
    variants: (['success', 'info', 'warning', 'error'] as const).map((severity) => ({
      props: { severity, variant: 'standard' as const },
      style: ({ theme }: { theme: Theme }) => ({
        backgroundColor: (theme.vars ?? theme).palette[severity].light,
        color: (theme.vars ?? theme).palette.text.primary,
        '& .MuiAlert-icon': { color: (theme.vars ?? theme).palette[severity].main },
      }),
    })),
  },
  MuiAvatar: {
    styleOverrides: { root: { fontSize: '0.8125rem', fontWeight: 800, letterSpacing: 0 } },
  },
  MuiBadge: {
    styleOverrides: { badge: { fontWeight: 800 } },
  },
  MuiChip: {
    styleOverrides: { root: { borderRadius: 999, fontWeight: 700 } },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: (theme.vars ?? theme).palette.secondary.main,
        borderRadius: 8,
        color: (theme.vars ?? theme).palette.secondary.contrastText,
        fontSize: '0.8125rem',
        fontWeight: 600,
        padding: '6px 10px',
      }),
    },
  },
  MuiStack: { defaultProps: { useFlexGap: true } },
} satisfies Components<Theme>;
