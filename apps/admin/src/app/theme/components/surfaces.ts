import { type Components, type Theme } from '@mui/material/styles';

import { adminMotion } from '../foundation/motion';

const surfaceTransition = `background-color ${adminMotion.duration.slow}ms ${adminMotion.easing.out}, border-color ${adminMotion.duration.slow}ms ${adminMotion.easing.out}, box-shadow ${adminMotion.duration.base}ms ${adminMotion.easing.out}`;

/** Cards, paper, dialogs and drawers. */
export const adminSurfaceComponents = {
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
        borderRadius: 18,
        boxShadow: theme.shadows[1],
        transition: surfaceTransition,
      }),
    },
  },
  MuiCardHeader: {
    defaultProps: { slotProps: { title: { variant: 'h6' } } },
    styleOverrides: { root: { padding: '24px 24px 12px' } },
  },
  MuiCardContent: {
    styleOverrides: {
      root: { '&:last-child': { paddingBottom: '24px' }, padding: '20px 24px' },
    },
  },
  MuiPaper: {
    styleOverrides: { rounded: { borderRadius: 18 } },
  },
  MuiDialog: {
    styleOverrides: { paper: { borderRadius: 20 } },
  },
  MuiDialogActions: {
    styleOverrides: { root: { padding: '16px 24px 24px' } },
  },
  MuiDialogContent: {
    styleOverrides: { root: { padding: '8px 24px' } },
  },
  MuiDialogTitle: {
    styleOverrides: { root: { fontSize: '1.25rem', fontWeight: 800, padding: '24px 24px 8px' } },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundImage: 'none',
        transition: surfaceTransition,
        borderColor: (theme.vars ?? theme).palette.divider,
      }),
    },
  },
} satisfies Components<Theme>;
