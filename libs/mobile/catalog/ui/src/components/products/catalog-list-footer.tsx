import { useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

export interface CatalogListFooterProps {
  isLoading?: boolean;
  kind: 'load_more' | 'retry';
  onPress: () => void;
}

export function CatalogListFooter({
  isLoading = false,
  kind,
  onPress,
}: Readonly<CatalogListFooterProps>) {
  const theme = useKedrTheme();
  const isRetry = kind === 'retry';
  const label = isRetry ? 'Не вдалося завантажити наступну сторінку.' : 'Завантажити ще';

  return (
    <View style={styles.footer}>
      <Button
        accessibilityLabel={
          isRetry ? 'Повторити завантаження наступної сторінки' : 'Завантажити ще'
        }
        buttonColor={theme.colors.inverseSurface}
        contentStyle={styles.buttonContent}
        disabled={isLoading}
        mode="contained"
        onPress={onPress}
        style={styles.button}
        textColor={theme.colors.inverseOnSurface}
      >
        {isLoading ? 'Завантаження…' : label}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
  },
  buttonContent: {
    minHeight: 48,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});
