import { createTheme, type PaletteColorOptions } from '@mui/material/styles';

const lightCorporateColors: Record<string, PaletteColorOptions> = {
  primary: {
    light: '#87d68e',
    main: '#18b125',
    dark: '#12871c',
    contrastText: '#ffffff',
  },
  secondary: {
    light: '#8f908f',
    main: '#272927',
    dark: '#101010',
    contrastText: '#ffffff',
  },
  info: {
    light: '#98ddfb',
    main: '#38bdf8',
    dark: '#2b90bc',
    contrastText: '#101010',
  },
  success: {
    light: '#8ce1ab',
    main: '#22c55e',
    dark: '#1a9647',
    contrastText: '#101010',
  },
  warning: {
    light: '#fdc69a',
    main: '#fb923c',
    dark: '#bf6f2e',
    contrastText: '#101010',
  },
  error: {
    light: '#f79e9e',
    main: '#ef4444',
    dark: '#b63434',
    contrastText: '#101010',
  },
};

const darkCorporateColors: Record<string, PaletteColorOptions> = {
  primary: {
    light: '#a3e0a8',
    main: '#18b125',
    dark: '#12871c',
    contrastText: '#101010',
  },
  secondary: {
    light: '#272927',
    main: '#1e1f1e',
    dark: '#101010',
    contrastText: '#eeeeee',
  },
  info: {
    light: '#afe5fc',
    main: '#38bdf8',
    dark: '#2b90bc',
    contrastText: '#101010',
  },
  success: {
    light: '#a7e8bf',
    main: '#22c55e',
    dark: '#1a9647',
    contrastText: '#101010',
  },
  warning: {
    light: '#fdd3b1',
    main: '#fb923c',
    dark: '#bf6f2e',
    contrastText: '#101010',
  },
  error: {
    light: '#f9b4b4',
    main: '#ef4444',
    dark: '#b63434',
    contrastText: '#101010',
  },
};

export const adminTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data',
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: 14,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.015em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.45,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.25,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.08em',
    },
  },
  colorSchemes: {
    light: {
      palette: {
        ...lightCorporateColors,
        background: {
          default: '#eeeeee',
          paper: '#ffffff',
        },
        divider: '#c3c3c3',
        text: {
          primary: '#272927',
          secondary: '#222422',
        },
      },
    },
    dark: {
      palette: {
        ...darkCorporateColors,
        background: {
          default: '#101010',
          paper: '#141514',
        },
        divider: '#272927',
        text: {
          primary: '#eeeeee',
          secondary: '#c3c3c3',
        },
      },
    },
  },
});
