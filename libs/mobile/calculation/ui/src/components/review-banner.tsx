import { AppText, IconButton } from '@mobile/shared/ui';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export interface ReviewBannerProps {
  reason: string;
  onClose: () => void;
}

/** Why the server returned the order or draft; changed lines are outlined below (R-012, SC-017). */
export function ReviewBanner({ onClose, reason }: Readonly<ReviewBannerProps>) {
  return (
    <View accessibilityRole="alert" style={styles.banner}>
      <View style={styles.text}>
        <AppText tone="warning" variant="bodyStrong">
          Сервер повернув розрахунок
        </AppText>
        <AppText variant="body">{reason}</AppText>
      </View>
      <IconButton
        accessibilityLabel="Сховати причину"
        icon="close"
        onPress={onClose}
        variant="plain"
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  banner: {
    alignItems: 'flex-start',
    backgroundColor: theme.colors.status.warning.background,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    gap: theme.space.sm,
    padding: theme.space.md,
  },
  text: { flex: 1, gap: 2 },
}));
