import { AppText, createStyles, Icon, useStyles } from '@mobile/shared/ui';
import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';

export interface ProductImageProps {
  accessibilityLabel: string;
  isOnline: boolean | null;
  url: string | null;
  /** Small list thumbnails hide the explanation and keep only the icon. */
  compact?: boolean;
}

/**
 * A product photo or scheme on white, never cropped (R-008). Kept in the disk cache; when it is not there yet and
 * the device is offline, says the photo will come with the network (SC-010).
 */
export function ProductImage({
  accessibilityLabel,
  compact = false,
  isOnline,
  url,
}: Readonly<ProductImageProps>) {
  const styles = useStyles(stylesSheet);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const failed = url === null || failedUrl === url;

  return (
    <View accessibilityLabel={accessibilityLabel} accessibilityRole="image" style={styles.frame}>
      {failed ? (
        <View style={styles.missing}>
          <Icon name="image-off-outline" size={compact ? 20 : 32} tone="secondary" />
          {compact ? null : (
            <AppText align="center" tone="secondary" variant="secondary">
              {url === null
                ? 'Фото немає'
                : isOnline === false
                  ? 'Фото буде доступне з мережею'
                  : 'Фото не завантажилось'}
            </AppText>
          )}
        </View>
      ) : (
        <Image
          cachePolicy="disk"
          contentFit="contain"
          onError={() => setFailedUrl(url)}
          recyclingKey={url}
          source={{ uri: url }}
          testID="product-image"
          style={styles.image}
          transition={120}
        />
      )}
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  frame: {
    backgroundColor: theme.colors.photoFrame,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.md,
    borderWidth: theme.sizes.border,
    flex: 1,
    overflow: 'hidden',
  },
  image: { flex: 1 },
  missing: {
    alignItems: 'center',
    flex: 1,
    gap: theme.space.sm,
    justifyContent: 'center',
    padding: theme.space.md,
  },
}));
