import { TextField } from '@mobile/shared/ui';

import { useDebouncedText } from '../../hooks/use-debounced-text';

/**
 * «Коментар до замовлення»: typing stays in the field and is saved a moment after the manager stops, or at once when
 * the field loses focus (a tap on «Відправити в 1С»), so every key does not write the calculation and redraw it.
 */
export function CommentField({
  onSave,
  value,
}: Readonly<{ onSave: (comment: string) => void; value: string }>) {
  const { flush, setText, text } = useDebouncedText(value, onSave);

  return (
    <TextField
      label="Коментар до замовлення"
      maxLength={1000}
      multiline
      onBlur={flush}
      onChangeText={setText}
      value={text}
    />
  );
}
