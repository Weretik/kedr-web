import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const saveDelayMs = 400;

/**
 * Text typed into a field and saved a moment after the person stops typing, or at once on `flush`, so every key does
 * not write the saved value and redraw everything that reads it.
 */
export function useDebouncedText(value: string, onSave: (text: string) => void) {
  const [text, setText] = useState(value);
  const save = useRef(onSave);
  useLayoutEffect(() => {
    save.current = onSave;
  });

  useEffect(() => {
    if (text === value) return;
    const timer = setTimeout(() => save.current(text), saveDelayMs);
    return () => clearTimeout(timer);
  }, [text, value]);

  return {
    text,
    setText,
    flush: () => {
      if (text !== value) onSave(text);
    },
  };
}
