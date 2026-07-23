import type { PaletteColorOptions } from '@mui/material/styles';

export const lightCorporateColors: Record<string, PaletteColorOptions> = {
  primary: { light: '#87d68e', main: '#18b125', dark: '#12871c', contrastText: '#ffffff' },
  secondary: { light: '#8f908f', main: '#272927', dark: '#101010', contrastText: '#ffffff' },
  info: { light: '#98ddfb', main: '#38bdf8', dark: '#2b90bc', contrastText: '#101010' },
  success: { light: '#8ce1ab', main: '#22c55e', dark: '#1a9647', contrastText: '#101010' },
  warning: { light: '#fdc69a', main: '#fb923c', dark: '#bf6f2e', contrastText: '#101010' },
  error: { light: '#f79e9e', main: '#ef4444', dark: '#b63434', contrastText: '#101010' },
};

export const darkCorporateColors: Record<string, PaletteColorOptions> = {
  primary: { light: '#a3e0a8', main: '#18b125', dark: '#12871c', contrastText: '#101010' },
  secondary: { light: '#272927', main: '#1e1f1e', dark: '#101010', contrastText: '#eeeeee' },
  info: { light: '#afe5fc', main: '#38bdf8', dark: '#2b90bc', contrastText: '#101010' },
  success: { light: '#a7e8bf', main: '#22c55e', dark: '#1a9647', contrastText: '#101010' },
  warning: { light: '#fdd3b1', main: '#fb923c', dark: '#bf6f2e', contrastText: '#101010' },
  error: { light: '#f9b4b4', main: '#ef4444', dark: '#b63434', contrastText: '#101010' },
};
