import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { useReducedMotion } from './use-reduced-motion';
import { kedrMotion } from '../theme/motion';

/** Returns an animated scale that springs 1 → 1.2 → 1 whenever `value` changes. */
export function useBump(value: unknown): Animated.Value {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced) return;
    scale.setValue(1.2);
    Animated.spring(scale, {
      ...kedrMotion.spring.bouncy,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [reduced, scale, value]);

  return scale;
}
