import { Image } from 'expo-image';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppText } from '../text/app-text';

export interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: number;
}

/** First letters of the first two words: «ТОВ «Будмаркет»» → «ТБ». */
export function initialsOf(name: string): string {
  const letters = name
    .replace(/[«»"'.,()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '');

  return letters.join('') || '?';
}

/** Photo, or initials on the accent container. */
export function Avatar({ name, photoUrl, size = 40 }: Readonly<AvatarProps>) {
  if (photoUrl) {
    return (
      <Image
        accessibilityIgnoresInvertColors
        accessibilityLabel={name}
        cachePolicy="disk"
        contentFit="cover"
        source={{ uri: photoUrl }}
        style={styles.photo(size)}
      />
    );
  }

  return (
    <View accessibilityLabel={name} style={styles.initials(size)}>
      <AppText style={styles.letters(size)} tone="accent" variant="bodyStrong">
        {initialsOf(name)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  initials: (size: number) => ({
    alignItems: 'center',
    backgroundColor: theme.colors.accentContainer,
    borderRadius: size / 2,
    height: size,
    justifyContent: 'center',
    width: size,
  }),
  letters: (size: number) => ({
    fontSize: Math.round(size * 0.38),
    lineHeight: Math.round(size * 0.5),
  }),
  photo: (size: number) => ({ borderRadius: size / 2, height: size, width: size }),
}));
