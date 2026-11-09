import { TextField } from '@mobile/shared/ui';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const saveDelayMs = 400;

/**
 * «Коментар до замовлення»: typing stays in the field and is saved a moment after the manager stops, or at once when
 * the field loses focus (a tap on «Відправити в 1С»), so every key does not write the calculation and redraw it.
 */
export function CommentField({
  onSave,
  value,
}: Readonly<{ onSave: (comment: string) => void; value: string }>) {
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

  return (
    <TextField
      label="Коментар до замовлення"
      maxLength={1000}
      multiline
      onBlur={() => {
        if (text !== value) onSave(text);
      }}
      onChangeText={setText}
      value={text}
    />
  );
}
