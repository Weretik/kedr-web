import { useKedrTheme, useReducedMotion } from '@mobile/shared/ui';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/** Animated 0 → 1 progress of a tab becoming active; snaps instantly under reduced motion. */
export function usePillTabProgress(focused: boolean): Animated.Value {
  const { kedr } = useKedrTheme();
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    if (reduced) progress.setValue(focused ? 1 : 0);
    else
      Animated.spring(progress, {
        ...kedr.motion.spring.snappy,
        toValue: focused ? 1 : 0,
        useNativeDriver: false,
      }).start();
  }, [focused, kedr.motion.spring.snappy, progress, reduced]);

  return progress;
}
