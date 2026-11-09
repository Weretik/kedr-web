import { View, type ViewProps } from 'react-native';

import { createStyles, useStyles } from '../../theme/create-styles';

/** White surface, 1 px border, `radius.lg`; no shadow. */
export function Card({ style, ...props }: Readonly<ViewProps>) {
  const styles = useStyles(stylesSheet);
  return <View {...props} style={[styles.card, style]} />;
}

const stylesSheet = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.lg,
    borderWidth: theme.sizes.border,
    padding: theme.space.lg,
  },
}));
