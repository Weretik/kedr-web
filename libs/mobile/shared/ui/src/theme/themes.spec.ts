import { breakpointFor } from './tokens/breakpoints';
import { darkColors, lightColors } from './tokens/palette';

const channel = (hex: string, offset: number) => {
  const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) =>
  0.2126 * channel(hex, 1) + 0.7152 * channel(hex, 3) + 0.0722 * channel(hex, 5);
const contrast = (a: string, b: string) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

describe('«Офіс» tokens', () => {
  it('gives every light role a dark role', () => {
    expect(Object.keys(darkColors).sort()).toEqual(Object.keys(lightColors).sort());
  });

  it.each([
    ['light', lightColors],
    ['dark', darkColors],
  ])('keeps text readable in the %s theme', (_name, colors) => {
    expect(contrast(colors.onAction, colors.action)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.text, colors.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.textSecondary, colors.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.accentText, colors.surface)).toBeGreaterThanOrEqual(4.5);
    for (const status of Object.values(colors.status)) {
      expect(contrast(status.text, status.background)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps photos and schemes on white in both themes', () => {
    expect(lightColors.photoFrame).toBe('#FFFFFF');
    expect(darkColors.photoFrame).toBe('#FFFFFF');
  });

  it.each([
    [390, 'phone'],
    [600, 'tablet'],
    [1023, 'tablet'],
    [1024, 'wide'],
  ])('puts a %i dp wide screen in %s', (width, expected) => {
    expect(breakpointFor(width)).toBe(expected);
  });
});
