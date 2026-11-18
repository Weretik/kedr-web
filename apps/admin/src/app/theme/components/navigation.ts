import { type Components, type Theme } from '@mui/material/styles';

import type {} from '@mui/x-tree-view/themeAugmentation';

/** Tabs and the category tree. */
export const adminNavigationComponents = {
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
  MuiTreeItem: {
    styleOverrides: {
      // The selected item looks like the active navigation item: soft green surface, accent text.
      content: ({ theme }) => ({
        borderRadius: 10,
        paddingBottom: theme.spacing(0.75),
        paddingTop: theme.spacing(0.75),
        '&[data-selected], &[data-selected]:hover, &[data-selected][data-focused]': {
          backgroundColor: (theme.vars ?? theme).palette.primary.light,
          color: (theme.vars ?? theme).palette.primary.dark,
        },
      }),
    },
  },
} satisfies Components<Theme>;
