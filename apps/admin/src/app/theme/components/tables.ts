import { type Components, type Theme } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { tableRowClasses } from '@mui/material/TableRow';

import type {} from '@mui/x-data-grid/themeAugmentation';

import { adminMotion } from '../foundation/motion';

/**
 * Every table scrolls inside itself so a laptop screen never needs a long page scroll:
 * the height follows the window, the width follows the card, and the header stays pinned.
 */
const tableViewportHeight = 'calc(100dvh - 140px)';

/** Data grids and tables. */
export const adminTableComponents = {
  MuiDataGrid: {
    styleOverrides: {
      root: ({ theme }) => ({
        '--DataGrid-containerBackground': (theme.vars ?? theme).palette.background.paper,
        '--DataGrid-rowBorderColor': (theme.vars ?? theme).palette.divider,
        backgroundColor: (theme.vars ?? theme).palette.background.paper,
        border: 0,
        borderRadius: 0,
        fontSize: '0.875rem',
        height: tableViewportHeight,
        maxWidth: '100%',
        minHeight: 320,
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
  MuiTableContainer: {
    styleOverrides: {
      root: { maxHeight: tableViewportHeight, maxWidth: '100%', overflow: 'auto' },
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
          position: 'sticky',
          top: 0,
          zIndex: 1,
          fontWeight: 700,
          letterSpacing: '0.06em',
          lineHeight: 1,
          textTransform: 'uppercase',
        },
      }),
    },
  },
} satisfies Components<Theme>;
