import { type Components, type Theme } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { tableRowClasses } from '@mui/material/TableRow';

export const adminComponents = {
  MuiAvatar: {
    styleOverrides: { root: { fontSize: '0.875rem', fontWeight: 600, letterSpacing: 0 } },
  },
  MuiButton: {
    styleOverrides: {
      root: { borderRadius: 12, textTransform: 'none' },
      sizeSmall: { padding: '6px 16px' },
      sizeMedium: { padding: '8px 20px' },
      sizeLarge: { padding: '11px 24px' },
    },
  },
  MuiCard: {
    styleOverrides: { root: ({ theme }) => ({ borderRadius: 20, boxShadow: theme.shadows[1] }) },
  },
  MuiCardHeader: {
    defaultProps: { slotProps: { title: { variant: 'h6' } } },
    styleOverrides: { root: { padding: '32px 24px 16px' } },
  },
  MuiCardContent: {
    styleOverrides: {
      root: { '&:last-child': { paddingBottom: '32px' }, padding: '32px 24px' },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
        opacity: 0.64,
        '&:hover': {
          opacity: 1,
        },
      }),
    },
  },
  MuiLink: { defaultProps: { underline: 'hover' } },
  MuiStack: { defaultProps: { useFlexGap: true } },
  MuiTab: {
    styleOverrides: {
      root: {
        '& + &': { marginLeft: '24px' },
        fontSize: '0.875rem',
        fontWeight: 500,
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
      root: ({ theme }) => ({ borderBottomColor: theme.palette.divider }),
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${tableCellClasses.root}`]: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.secondary,
          lineHeight: 1,
        },
      }),
    },
  },
} satisfies Components<Theme>;
