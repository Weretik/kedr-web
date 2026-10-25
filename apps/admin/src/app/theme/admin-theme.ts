import { ukUA as materialUkUA } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';
import { ukUA as dataGridUkUA } from '@mui/x-data-grid/locales';

import { adminComponents } from './components';
import { adminMotion } from './motion';
import { darkPalette, lightPalette } from './palette';
import { adminShadows } from './shadows';
import { adminTypography } from './typography';

export const adminTheme = createTheme(
  {
    breakpoints: {
      values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1440 },
    },
    colorSchemes: {
      light: { palette: lightPalette },
      dark: { palette: darkPalette },
    },
    components: adminComponents,
    cssVariables: { colorSchemeSelector: 'data' },
    shadows: adminShadows,
    shape: { borderRadius: 12 },
    transitions: {
      duration: {
        shortest: adminMotion.duration.fast,
        shorter: adminMotion.duration.fast,
        short: adminMotion.duration.base,
        standard: adminMotion.duration.base,
        complex: adminMotion.duration.slow,
        enteringScreen: adminMotion.duration.base,
        leavingScreen: adminMotion.duration.fast,
      },
      easing: {
        easeInOut: adminMotion.easing.inOut,
        easeOut: adminMotion.easing.out,
        easeIn: adminMotion.easing.in,
        sharp: adminMotion.easing.inOut,
      },
    },
    typography: adminTypography,
  },
  materialUkUA,
  dataGridUkUA,
  {
    components: {
      MuiDataGrid: {
        defaultProps: {
          localeText: {
            columnMenuAriaLabel: (columnName: string) => `Меню стовпця ${columnName}`,
          },
        },
      },
    },
  },
);
