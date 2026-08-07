import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

export interface CatalogListFooterProps {
  isLoading?: boolean;
  kind: 'load_more' | 'retry';
  onPress: () => void;
}

export function CatalogListFooter({ isLoading = false, kind, onPress }: Readonly<CatalogListFooterProps>) {
  const theme = useTheme();
  const isRetry = kind === 'retry';
  const label = isRetry ? 'Не вдалося завантажити наступну сторінку.' : 'Завантажити ще';

  return (
    <View style={styles.footer}>
      <Button
        accessibilityLabel={isRetry ? 'Повторити завантаження наступної сторінки' : 'Завантажити ще'}
        buttonColor={theme.colors.primary}
        contentStyle={styles.buttonContent}
        disabled={isLoading}
        mode="contained"
        onPress={onPress}
        style={styles.button}
        textColor={theme.colors.onPrimary}
      >
        {isLoading ? 'Завантаження…' : label}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    minHeight: 48,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});
