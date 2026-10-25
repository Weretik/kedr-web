import { type Components, type Theme } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { tableRowClasses } from '@mui/material/TableRow';

import { adminMotion } from './motion';

const surfaceTransition = `background-color ${adminMotion.duration.slow}ms ${adminMotion.easing.out}, border-color ${adminMotion.duration.slow}ms ${adminMotion.easing.out}, box-shadow ${adminMotion.duration.base}ms ${adminMotion.easing.out}`;

export const adminComponents = {
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
  MuiAvatar: {
    styleOverrides: { root: { fontSize: '0.8125rem', fontWeight: 800, letterSpacing: 0 } },
  },
  MuiBadge: {
    styleOverrides: { badge: { fontWeight: 800 } },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    variants: [
      // Default primary.dark is used as accent text, so contained primary hover gets its own shade.
      {
        props: { color: 'primary', variant: 'contained' },
        style: { '&:hover': { backgroundColor: '#389530' } },
      },
    ],
    styleOverrides: {
      root: {
        borderRadius: 12,
        transition: `background-color ${adminMotion.duration.fast}ms ${adminMotion.easing.out}, transform ${adminMotion.duration.fast}ms ${adminMotion.easing.out}`,
        '&:active': { transform: 'scale(0.98)' },
      },
      sizeSmall: { padding: '6px 14px' },
      sizeMedium: { minHeight: 42, padding: '8px 18px' },
      sizeLarge: { minHeight: 48, padding: '11px 24px' },
      outlined: ({ theme }) => ({
        backgroundColor: (theme.vars ?? theme).palette.background.paper,
        borderColor: (theme.vars ?? theme).palette.divider,
        color: (theme.vars ?? theme).palette.text.primary,
        '&:hover': {
          backgroundColor: (theme.vars ?? theme).palette.action.hover,
          borderColor: (theme.vars ?? theme).palette.divider,
        },
      }),
    },
  },
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
  MuiChip: {
    styleOverrides: { root: { borderRadius: 999, fontWeight: 700 } },
  },
  MuiDialog: {
    styleOverrides: { paper: { borderRadius: 20 } },
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
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 12,
        color: (theme.vars ?? theme).palette.text.primary,
        transition: `background-color ${adminMotion.duration.fast}ms ${adminMotion.easing.out}, transform ${adminMotion.duration.fast}ms ${adminMotion.easing.out}`,
        '&:active': { transform: 'scale(0.94)' },
      }),
    },
  },
  MuiLink: {
    defaultProps: { color: 'primary.dark', underline: 'hover' },
    styleOverrides: { root: { fontWeight: 700 } },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
        borderRadius: 14,
        boxShadow: theme.shadows[4],
        marginTop: 6,
      }),
      list: { padding: 6 },
    },
  },
  MuiMenuItem: {
    styleOverrides: { root: { borderRadius: 10, fontWeight: 600, minHeight: 40 } },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: (theme.vars ?? theme).palette.background.paper,
        borderRadius: 12,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: (theme.vars ?? theme).palette.divider,
        },
      }),
    },
  },
  MuiPaper: {
    styleOverrides: { rounded: { borderRadius: 18 } },
  },
  MuiStack: { defaultProps: { useFlexGap: true } },
  MuiTab: {
    styleOverrides: {
      root: {
        '& + &': { marginLeft: '24px' },
        fontSize: '0.875rem',
        fontWeight: 700,
        lineHeight: 1.71,
        minWidth: 'auto',
        paddingLeft: 0,
        paddingRight: 0,
        textTransform: 'none',
      },
    },
  },
  MuiTableBody: {
    styleOverrides: {
      root: {
        [`& .${tableRowClasses.root}:last-child .${tableCellClasses.root}`]: { borderBottom: 0 },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      paddingCheckbox: { padding: '0 0 0 24px' },
      root: ({ theme }) => ({ borderBottomColor: (theme.vars ?? theme).palette.divider }),
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${tableCellClasses.root}`]: {
          backgroundColor: (theme.vars ?? theme).palette.background.paper,
          color: (theme.vars ?? theme).palette.text.secondary,
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          lineHeight: 1,
          textTransform: 'uppercase',
        },
      }),
    },
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
} satisfies Components<Theme>;
