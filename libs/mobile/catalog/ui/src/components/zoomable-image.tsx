import { createStyles, useStyles } from '@mobile/shared/ui';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface ZoomableImageProps {
  accessibilityLabel: string;
  height: number;
  /** Tells the pager to stop swiping while the image is zoomed in. */
  onZoomChange: (zoomed: boolean) => void;
  url: string;
  width: number;
}

const maxScale = 5;
const doubleTapScale = 2.5;

/** One image of the full-screen viewer: pinch zoom, double tap zoom, and drag while zoomed (R-008, SC-009). */
export function ZoomableImage({
  accessibilityLabel,
  height,
  onZoomChange,
  url,
  width,
}: Readonly<ZoomableImageProps>) {
  const styles = useStyles(stylesSheet);
  const [zoomed, setZoomed] = useState(false);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const report = (value: boolean) => {
    setZoomed(value);
    onZoomChange(value);
  };

  const reset = () => {
    'worklet';
    scale.value = withTiming(1);
    savedScale.value = 1;
    x.value = withTiming(0);
    y.value = withTiming(0);
    savedX.value = 0;
    savedY.value = 0;
    runOnJS(report)(false);
  };

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.min(maxScale, Math.max(1, savedScale.value * event.scale));
    })
    .onEnd(() => {
      if (scale.value <= 1.01) {
        reset();
        return;
      }
      savedScale.value = scale.value;
      runOnJS(report)(true);
    });

  const pan = Gesture.Pan()
    .enabled(zoomed)
    .onUpdate((event) => {
      x.value = savedX.value + event.translationX;
      y.value = savedY.value + event.translationY;
    })
    .onEnd(() => {
      savedX.value = x.value;
      savedY.value = y.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (savedScale.value > 1) {
        reset();
        return;
      }
      scale.value = withTiming(doubleTapScale);
      savedScale.value = doubleTapScale;
      runOnJS(report)(true);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={Gesture.Exclusive(doubleTap, Gesture.Simultaneous(pinch, pan))}>
      <Animated.View
        accessibilityHint="Збільшується двома пальцями або подвійним дотиком"
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="image"
        style={[styles.page, { height, width }]}
      >
        <Animated.View style={[styles.fill, animatedStyle]}>
          <Image
            cachePolicy="disk"
            contentFit="contain"
            source={{ uri: url }}
            style={styles.fill}
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const stylesSheet = createStyles((theme) => ({
  fill: { flex: 1 },
  page: { backgroundColor: theme.colors.photoFrame, overflow: 'hidden' },
}));
