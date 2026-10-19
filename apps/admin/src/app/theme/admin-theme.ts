import { ukUA as materialUkUA } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';
import { ukUA as dataGridUkUA } from '@mui/x-data-grid/locales';

import { adminComponents } from './components';
import { darkCorporateColors, lightCorporateColors } from './palette';
import { adminShadows } from './shadows';
import { adminTypography } from './typography';

export const adminTheme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1440 },
  },
  colorSchemes: {
    light: {
      palette: {
        ...lightCorporateColors,
        background: { default: '#eeeeee', paper: '#ffffff' },
        divider: '#c3c3c3',
        text: { primary: '#272927', secondary: '#222422' },
      },
    },
    dark: {
      palette: {
        ...darkCorporateColors,
        background: { default: '#101010', paper: '#141514' },
        divider: '#272927',
        text: { primary: '#eeeeee', secondary: '#c3c3c3' },
      },
    },
  },
  components: adminComponents,
  cssVariables: { colorSchemeSelector: 'data' },
  shadows: adminShadows,
  shape: { borderRadius: 8 },
  typography: adminTypography,
}, materialUkUA, dataGridUkUA, {
  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: {
          columnMenuAriaLabel: (columnName: string) => `Меню стовпця ${columnName}`,
        },
      },
    },
  },
});
