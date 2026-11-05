import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { useUnistyles } from 'react-native-unistyles';

import { toneColor, type Tone } from '../tone';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface IconProps {
  name: IconName;
  size?: number;
  tone?: Tone;
}

/** Decorative icon; the pressable around it carries the accessible label. */
export function Icon({ name, size = 22, tone = 'default' }: Readonly<IconProps>) {
  const { theme } = useUnistyles();

  return (
    <MaterialCommunityIcons
      accessibilityElementsHidden
      color={toneColor(theme.colors, tone)}
      importantForAccessibility="no"
      name={name}
      size={size}
    />
  );
}
