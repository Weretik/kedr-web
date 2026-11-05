import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/** White surface, 1 px border, `radius.lg`; no shadow. */
export function Card({ style, ...props }: Readonly<ViewProps>) {
  return <View {...props} style={[styles.card, style]} />;
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.lg,
    borderWidth: theme.sizes.border,
    padding: theme.space.lg,
  },
}));
