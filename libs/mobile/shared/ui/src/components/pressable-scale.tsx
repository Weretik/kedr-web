import { useRef, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useReducedMotion } from '../hooks/use-reduced-motion';
import { kedrMotion } from '../theme/motion';

export type PressableScaleProps = Omit<PressableProps, 'children' | 'style'> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Pressable that shrinks slightly while pressed. */
export function PressableScale({
  children,
  onPressIn,
  onPressOut,
  style,
  ...props
}: Readonly<PressableScaleProps>) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  const animate = (toValue: number) => {
    if (reduced) return;
    Animated.timing(scale, {
      duration: kedrMotion.duration.fast,
      toValue,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      {...props}
      onPressIn={(event) => {
        animate(kedrMotion.pressScale);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animate(1);
        onPressOut?.(event);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
