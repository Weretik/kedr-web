import { View } from 'react-native';

import { createStyles, useStyles } from '../../theme/styling/create-styles';
import { AppText } from '../text/app-text';

/** Green square with «К»: the rail and the login screen. */
export function BrandMark({ size = 44 }: Readonly<{ size?: number }>) {
  const styles = useStyles(stylesSheet);
  return (
    <View accessibilityLabel="Кедр" accessibilityRole="image" style={styles.mark(size)}>
      <AppText style={styles.letter(size)} variant="sectionTitle">
        К
      </AppText>
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  letter: (size: number) => ({
    color: '#FFFFFF',
    fontSize: Math.round(size * 0.5),
    lineHeight: Math.round(size * 0.62),
  }),
  mark: (size: number) => ({
    alignItems: 'center',
    backgroundColor: theme.colors.brand,
    borderRadius: theme.radius.md,
    height: size,
    justifyContent: 'center',
    width: size,
  }),
}));
