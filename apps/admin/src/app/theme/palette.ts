import type { PaletteColorOptions, PaletteOptions } from '@mui/material/styles';

/** Kedr brand colors taken from the logo. Do not change them without a brand decision. */
export const kedrBrand = {
  green: '#3FA435',
  ink: '#0F110F',
} as const;

const lightStatusColors: Record<string, PaletteColorOptions> = {
  info: { light: '#E3F0F8', main: '#1D6FA3', dark: '#155480', contrastText: '#FFFFFF' },
  success: { light: '#E8F3E4', main: '#2A7323', dark: '#1F5C1A', contrastText: '#FFFFFF' },
  warning: { light: '#FDF0DF', main: '#B45309', dark: '#8A3F06', contrastText: '#FFFFFF' },
  error: { light: '#FCE8E6', main: '#B42318', dark: '#8C1B12', contrastText: '#FFFFFF' },
};

const darkStatusColors: Record<string, PaletteColorOptions> = {
  info: { light: '#16303F', main: '#7CC0EA', dark: '#A9D6F2', contrastText: kedrBrand.ink },
  success: { light: '#1E3020', main: '#7BCB6F', dark: '#A3DC99', contrastText: kedrBrand.ink },
  warning: { light: '#3A2A17', main: '#F2A65A', dark: '#F7C48F', contrastText: kedrBrand.ink },
  error: { light: '#3B1F1C', main: '#F28B82', dark: '#F6B1AB', contrastText: kedrBrand.ink },
};

/**
 * «Кедровий ліс» palette. Brand green is the primary color; text on it uses brand ink,
 * because white on #3FA435 does not reach 4.5:1 contrast for regular text.
 */
export const lightPalette = {
  primary: {
    light: '#E8F3E4',
    main: kedrBrand.green,
    dark: '#2A7323',
    contrastText: kedrBrand.ink,
  },
  secondary: { light: '#5C6159', main: kedrBrand.ink, dark: '#000000', contrastText: '#F5F4EF' },
  ...lightStatusColors,
  background: { default: '#F5F4EF', paper: '#FFFFFF' },
  divider: '#E5E3DB',
  text: { primary: kedrBrand.ink, secondary: '#5C6159', disabled: '#9A9E96' },
  action: { hover: 'rgba(15, 17, 15, 0.04)', selected: 'rgba(63, 164, 53, 0.12)' },
} satisfies PaletteOptions;

export const darkPalette = {
  primary: {
    light: '#1E3020',
    main: kedrBrand.green,
    dark: '#7BCB6F',
    contrastText: kedrBrand.ink,
  },
  secondary: { light: '#A2A79D', main: '#EEF0EA', dark: '#FFFFFF', contrastText: kedrBrand.ink },
  ...darkStatusColors,
  background: { default: '#111310', paper: '#191C18' },
  divider: '#2A2E28',
  text: { primary: '#EEF0EA', secondary: '#A2A79D', disabled: '#6B7067' },
  action: { hover: 'rgba(238, 240, 234, 0.05)', selected: 'rgba(63, 164, 53, 0.18)' },
} satisfies PaletteOptions;
