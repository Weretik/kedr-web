import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** True when the system asks to reduce motion; decorative animation must be skipped then. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled?.().then((value) => {
      if (active) setReduced(value);
    });
    const subscription = AccessibilityInfo.addEventListener?.('reduceMotionChanged', setReduced);
    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  return reduced;
}
