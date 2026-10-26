export const kedrBrand = { green: '#3FA435', ink: '#0F110F' } as const;

export type KedrStatusKind = 'error' | 'informational' | 'success' | 'warning';

export interface KedrStatusColors {
  background: string;
  foreground: string;
}

export interface KedrColors {
  accentText: string;
  backdrop: string;
  background: string;
  highlight: string;
  inverseOnSurface: string;
  inverseSurface: string;
  onBackground: string;
  onPrimary: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  primary: string;
  primaryContainer: string;
  status: Readonly<Record<KedrStatusKind, KedrStatusColors>>;
  surface: string;
  surfaceVariant: string;
}

export const kedrLightColors: KedrColors = {
  accentText: '#2A7323',
  backdrop: 'rgba(15, 17, 15, 0.45)',
  background: '#F6F7F2',
  highlight: '#E9F7C9',
  inverseOnSurface: '#F2F5EF',
  inverseSurface: kedrBrand.ink,
  onBackground: kedrBrand.ink,
  onPrimary: '#FFFFFF',
  onSurface: kedrBrand.ink,
  onSurfaceVariant: '#5D665A',
  outline: '#C9CFC4',
  outlineVariant: '#E6E9E1',
  primary: kedrBrand.green,
  primaryContainer: '#E3F3E0',
  status: {
    error: { background: '#FBE5E2', foreground: '#C2392F' },
    informational: { background: '#E2EDF9', foreground: '#2D6FB5' },
    success: { background: '#E3F3E0', foreground: '#2E8B2A' },
    warning: { background: '#FBF0D9', foreground: '#A86A00' },
  },
  surface: '#FFFFFF',
  surfaceVariant: '#EEF1E8',
};

export const kedrDarkColors: KedrColors = {
  accentText: '#7DD06F',
  backdrop: 'rgba(0, 0, 0, 0.6)',
  background: kedrBrand.ink,
  highlight: '#26331C',
  inverseOnSurface: kedrBrand.ink,
  inverseSurface: '#E9F7C9',
  onBackground: '#F0F3EC',
  onPrimary: kedrBrand.ink,
  onSurface: '#F0F3EC',
  onSurfaceVariant: '#9DA899',
  outline: '#3A4138',
  outlineVariant: '#272C26',
  primary: kedrBrand.green,
  primaryContainer: '#1C3A1A',
  status: {
    error: { background: '#3A1714', foreground: '#FF8A7F' },
    informational: { background: '#132539', foreground: '#7FB6F2' },
    success: { background: '#183019', foreground: '#6FD164' },
    warning: { background: '#33270F', foreground: '#F0B44A' },
  },
  surface: '#181B17',
  surfaceVariant: '#20251F',
};
