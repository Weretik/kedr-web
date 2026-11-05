import { AppText, IconButton } from '@mobile/shared/ui';
import { useState } from 'react';
import { FlatList, Modal, useWindowDimensions, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native-unistyles';

import { ZoomableImage } from './zoomable-image';

import type { ProductImage } from '@mobile/catalog/model';

export interface ZoomViewerProps {
  images: readonly ProductImage[];
  /** The image to start on; null keeps the viewer closed. */
  initialIndex: number | null;
  onClose: () => void;
}

/** Full screen on white: swipe between the photos and the scheme, each zoomable (R-008, SC-009). */
export function ZoomViewer({ images, initialIndex, onClose }: Readonly<ZoomViewerProps>) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      visible={initialIndex !== null}
    >
      {initialIndex !== null ? (
        <ViewerPages images={images} initialIndex={initialIndex} onClose={onClose} />
      ) : null}
    </Modal>
  );
}

function ViewerPages({
  images,
  initialIndex,
  onClose,
}: Readonly<ZoomViewerProps & { initialIndex: number }>) {
  const { height, width } = useWindowDimensions();
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const current = images[index];
  const photoCount = images.filter((image) => image.kind === 'photo').length;
  const label =
    current?.kind === 'scheme'
      ? 'Схема'
      : `Фото ${Math.min(index + 1, photoCount)} з ${photoCount}`;

  return (
    <GestureHandlerRootView style={styles.root}>
      <FlatList
        data={images}
        getItemLayout={(_, item) => ({ index: item, length: width, offset: width * item })}
        horizontal
        initialScrollIndex={initialIndex}
        keyExtractor={(image) => `${image.kind}-${image.url}`}
        onMomentumScrollEnd={(event) =>
          setIndex(Math.round(event.nativeEvent.contentOffset.x / width))
        }
        pagingEnabled
        renderItem={({ item }) => (
          <ZoomableImage
            accessibilityLabel={item.kind === 'scheme' ? 'Схема' : 'Фото товару'}
            height={height}
            onZoomChange={setZoomed}
            url={item.url}
            width={width}
          />
        )}
        scrollEnabled={!zoomed}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.top}>
        <View style={styles.labelBox}>
          <AppText style={styles.label} variant="bodyStrong">
            {label}
          </AppText>
        </View>
        <IconButton
          accessibilityLabel="Закрити"
          icon="close"
          onPress={onClose}
          variant="outlined"
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  label: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.xs,
  },
  labelBox: { alignItems: 'flex-start', flex: 1 },
  root: { backgroundColor: theme.colors.photoFrame, flex: 1 },
  top: {
    alignItems: 'center',
    flexDirection: 'row',
    left: theme.space.lg,
    position: 'absolute',
    right: theme.space.lg,
    top: rt.insets.top + theme.space.sm,
  },
}));
