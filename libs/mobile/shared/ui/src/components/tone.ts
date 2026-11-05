import type { ColorRoles, StatusKind } from '../theme/palette';

/** Text and icon colors a component may ask for; status kinds use their text color. */
export type Tone = 'accent' | 'default' | 'disabled' | 'onAction' | 'secondary' | StatusKind;

export function toneColor(colors: ColorRoles, tone: Tone): string {
  switch (tone) {
    case 'accent':
      return colors.accentText;
    case 'default':
      return colors.text;
    case 'disabled':
      return colors.textDisabled;
    case 'onAction':
      return colors.onAction;
    case 'secondary':
      return colors.textSecondary;
    default:
      return colors.status[tone].text;
  }
}
