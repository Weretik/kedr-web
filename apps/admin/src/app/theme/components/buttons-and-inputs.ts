import { routerLinkComponents } from '@admin/shared/routing';
import { type Components, type Theme } from '@mui/material/styles';

import { adminMotion } from '../foundation/motion';

/** Buttons, links, inputs and menus. */
export const adminInputComponents = {
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
} satisfies Components<Theme>;
