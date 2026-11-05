import { productImages, type Product } from '@mobile/catalog/model';
import { IconButton, SegmentedControl } from '@mobile/shared/ui';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ProductImage } from './product-image';

export interface ProductGalleryProps {
  isOnline: boolean | null;
  /** Opens the full-screen viewer on that image (photos first, then the scheme). */
  onOpenFullScreen: (index: number) => void;
  product: Pick<Product, 'name' | 'photos' | 'scheme'>;
  /** Tablet: the photo and the scheme stand side by side instead of the «Фото | Схема» switch (SC-025). */
  sideBySide?: boolean;
}

type GalleryTab = 'photo' | 'scheme';

/** The large photo stage with «Фото N/M | Схема», thumbnails and a full-screen button (R-008). */
export function ProductGallery({
  isOnline,
  onOpenFullScreen,
  product,
  sideBySide = false,
}: Readonly<ProductGalleryProps>) {
  const images = productImages(product);
  const photoCount = product.photos.length;
  const schemeIndex = product.scheme ? photoCount : null;
  const [photoIndex, setPhotoIndex] = useState(0);
  const [tab, setTab] = useState<GalleryTab>(
    photoCount === 0 && product.scheme ? 'scheme' : 'photo',
  );

  if (images.length === 0) {
    return (
      <View style={styles.stage}>
        <ProductImage accessibilityLabel="Фото товару" isOnline={isOnline} url={null} />
      </View>
    );
  }

  const photoStage = photoCount > 0 && (
    <Stage
      index={photoIndex}
      label={`Фото ${photoIndex + 1} з ${photoCount}`}
      isOnline={isOnline}
      onOpenFullScreen={onOpenFullScreen}
      url={product.photos[photoIndex] ?? null}
    />
  );
  const schemeStage = schemeIndex !== null && (
    <Stage
      index={schemeIndex}
      label="Схема"
      isOnline={isOnline}
      onOpenFullScreen={onOpenFullScreen}
      url={product.scheme}
    />
  );

  const thumbs = photoCount > 1 && (sideBySide || tab === 'photo') && (
    <ScrollView
      contentContainerStyle={styles.thumbs}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {product.photos.map((url, index) => (
        <Pressable
          accessibilityLabel={`Фото ${index + 1}`}
          accessibilityRole="button"
          accessibilityState={{ selected: index === photoIndex }}
          key={url}
          onPress={() => setPhotoIndex(index)}
          style={styles.thumb(index === photoIndex)}
        >
          <ProductImage
            accessibilityLabel={`Фото ${index + 1}`}
            compact
            isOnline={isOnline}
            url={url}
          />
        </Pressable>
      ))}
    </ScrollView>
  );

  if (sideBySide) {
    return (
      <View style={styles.gallery}>
        <View style={styles.sideBySide}>
          {photoStage ? <View style={styles.half}>{photoStage}</View> : null}
          {schemeStage ? <View style={styles.half}>{schemeStage}</View> : null}
        </View>
        {thumbs}
      </View>
    );
  }

  return (
    <View style={styles.gallery}>
      {photoCount > 0 && schemeIndex !== null ? (
        <SegmentedControl
          accessibilityLabel="Фото або схема"
          onChange={setTab}
          segments={[
            { label: `Фото ${photoIndex + 1}/${photoCount}`, value: 'photo' },
            { label: 'Схема', value: 'scheme' },
          ]}
          value={tab}
        />
      ) : null}
      {tab === 'scheme' ? schemeStage : photoStage}
      {thumbs}
    </View>
  );
}

interface StageProps {
  index: number;
  isOnline: boolean | null;
  label: string;
  onOpenFullScreen: (index: number) => void;
  url: string | null;
}

function Stage({ index, isOnline, label, onOpenFullScreen, url }: Readonly<StageProps>) {
  return (
    <View style={styles.stage}>
      <Pressable
        accessibilityLabel={`${label}, на весь екран`}
        onPress={() => onOpenFullScreen(index)}
        style={styles.fill}
      >
        <ProductImage accessibilityLabel={label} isOnline={isOnline} url={url} />
      </Pressable>
      <View style={styles.fullScreen}>
        <IconButton
          accessibilityLabel={`${label} на весь екран`}
          icon="fullscreen"
          onPress={() => onOpenFullScreen(index)}
          variant="outlined"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  fill: { flex: 1 },
  fullScreen: { position: 'absolute', right: theme.space.sm, top: theme.space.sm },
  gallery: { gap: theme.space.sm },
  half: { flex: 1 },
  sideBySide: { flexDirection: 'row', gap: theme.space.md, height: 420 },
  stage: { height: 330 },
  thumb: (selected: boolean) => ({
    borderColor: selected ? theme.colors.brand : 'transparent',
    borderRadius: theme.radius.md,
    borderWidth: 2,
    height: 60,
    width: 60,
  }),
  thumbs: { gap: theme.space.sm },
}));
