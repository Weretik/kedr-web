/** Brand colors from the logo. White text on brand green is only 3.2:1, so filled buttons use `action`. */
export const kedrBrand = { green: '#3FA435', ink: '#0F110F' } as const;

export type StatusKind = 'error' | 'informational' | 'success' | 'warning';

export interface StatusColors {
  background: string;
  text: string;
}

export interface ColorRoles {
  accentContainer: string;
  accentText: string;
  action: string;
  backdrop: string;
  background: string;
  brand: string;
  onAction: string;
  outline: string;
  outlineVariant: string;
  /** Always white: product photos and schemes are drawn on white, in both themes. */
  photoFrame: string;
  status: Readonly<Record<StatusKind, StatusColors>>;
  surface: string;
  surfaceMuted: string;
  text: string;
  textDisabled: string;
  textSecondary: string;
}

export const lightColors: ColorRoles = {
  accentContainer: '#E3F3E0',
  accentText: '#2A7323',
  action: '#2E7D26',
  backdrop: 'rgba(15,17,15,0.45)',
  background: '#F5F6F3',
  brand: kedrBrand.green,
  onAction: '#FFFFFF',
  outline: '#D6DAD1',
  outlineVariant: '#E3E6DF',
  photoFrame: '#FFFFFF',
  status: {
    error: { background: '#FBE5E2', text: '#B3261E' },
    informational: { background: '#E2EDF9', text: '#1F4F86' },
    success: { background: '#E3F3E0', text: '#2A7323' },
    warning: { background: '#FBF0D9', text: '#7A4D00' },
  },
  surface: '#FFFFFF',
  surfaceMuted: '#E9EBE6',
  text: kedrBrand.ink,
  textDisabled: '#A3AA9F',
  textSecondary: '#5B6358',
};

export const darkColors: ColorRoles = {
  accentContainer: '#1C3A1A',
  accentText: '#7DD06F',
  action: kedrBrand.green,
  backdrop: 'rgba(0,0,0,0.6)',
  background: kedrBrand.ink,
  brand: kedrBrand.green,
  onAction: kedrBrand.ink,
  outline: '#3A4138',
  outlineVariant: '#272C26',
  photoFrame: '#FFFFFF',
  status: {
    error: { background: '#3A1714', text: '#FF8A7F' },
    informational: { background: '#132539', text: '#7FB6F2' },
    success: { background: '#183019', text: '#7DD06F' },
    warning: { background: '#33270F', text: '#F0B44A' },
  },
  surface: '#181B17',
  surfaceMuted: '#20251F',
  text: '#EEF1EA',
  textDisabled: '#5E665B',
  textSecondary: '#A3AD9E',
};
