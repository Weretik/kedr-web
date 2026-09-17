import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

interface ProductImageProps {
  onError: () => void;
  position?: number;
  productName: string;
  url: string;
}

export function ProductImage({ onError, position, productName, url }: Readonly<ProductImageProps>) {
  return (
    <Image
      accessibilityLabel={`Зображення товару ${productName}${position ? `, ${position}` : ''}`}
      cachePolicy="memory-disk"
      contentFit="contain"
      onError={onError}
      source={{ uri: url }}
      style={styles.image}
      transition={180}
    />
  );
}

const styles = StyleSheet.create({ image: { height: '100%', width: '100%' } });
