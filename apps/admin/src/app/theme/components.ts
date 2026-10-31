import { routerLinkComponents } from '@admin/shared/routing';
import { type Components, type Theme } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { tableRowClasses } from '@mui/material/TableRow';

import type {} from '@mui/x-data-grid/themeAugmentation';

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
  MuiDataGrid: {
    styleOverrides: {
      root: ({ theme }) => ({
        '--DataGrid-containerBackground': (theme.vars ?? theme).palette.background.paper,
        '--DataGrid-rowBorderColor': (theme.vars ?? theme).palette.divider,
        backgroundColor: (theme.vars ?? theme).palette.background.paper,
        border: 0,
        borderRadius: 0,
        fontSize: '0.875rem',
        '& .MuiTablePagination-toolbar': { paddingInline: theme.spacing(2) },
        [theme.breakpoints.down('sm')]: {
          '& .MuiTablePagination-selectLabel': { display: 'none' },
          '& .MuiTablePagination-toolbar': { paddingInline: theme.spacing(1) },
        },
      }),
      columnHeader: ({ theme }) => ({
        color: (theme.vars ?? theme).palette.text.secondary,
        '&:focus, &:focus-within': {
          outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
          outlineOffset: -2,
        },
      }),
      columnHeaderTitle: {
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      },
      row: ({ theme }) => ({
        transition: `background-color ${adminMotion.duration.fast}ms ${adminMotion.easing.out}`,
        '&:hover': { backgroundColor: (theme.vars ?? theme).palette.action.hover },
      }),
      cell: ({ theme }) => ({
        '&:focus, &:focus-within': {
          outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
          outlineOffset: -2,
        },
      }),
      footerContainer: ({ theme }) => ({
        borderTopColor: (theme.vars ?? theme).palette.divider,
        flexWrap: 'wrap',
        minHeight: 56,
      }),
      toolbar: { gap: 8, minHeight: 64, padding: '12px 16px' },
      withBorderColor: ({ theme }) => ({ borderColor: (theme.vars ?? theme).palette.divider }),
    },
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
  MuiButtonBase: routerLinkComponents.MuiButtonBase,
  MuiLink: {
    defaultProps: {
      ...routerLinkComponents.MuiLink.defaultProps,
      color: 'primary.dark',
      underline: 'hover',
    },
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
      root: ({ theme }) => ({
        color: (theme.vars ?? theme).palette.text.secondary,
        minHeight: 52,
        '&.Mui-selected': { color: (theme.vars ?? theme).palette.text.primary },
        '& + &': { marginLeft: '24px' },
        fontSize: '0.875rem',
        fontWeight: 700,
        lineHeight: 1.71,
        minWidth: 'auto',
        paddingLeft: 0,
        paddingRight: 0,
        textTransform: 'none',
      }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: ({ theme }) => ({
        backgroundColor: (theme.vars ?? theme).palette.primary.main,
        borderRadius: '3px 3px 0 0',
        height: 3,
      }),
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
