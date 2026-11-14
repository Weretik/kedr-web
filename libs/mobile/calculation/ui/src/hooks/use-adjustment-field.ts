import { formatAdjustment, parseAdjustment } from '@mobile/calculation/model';
import { useState } from 'react';

export type AdjustmentSign = 'minus' | 'plus';

/** «56» for both +56 and −56: the sign lives in the switch above the field. */
const amountText = (kopecks: number) => (kopecks === 0 ? '' : formatAdjustment(kopecks).slice(1));

/**
 * The discount or markup per piece as a sign switch and a typed amount: every change is parsed, a valid one that
 * differs from the line goes to `onChange`, and an invalid one stays as the typing error.
 */
export function useAdjustmentField(kopecks: number, onChange: (kopecks: number) => void) {
  const [sign, setSign] = useState<AdjustmentSign>(kopecks < 0 ? 'minus' : 'plus');
  const [text, setText] = useState(() => amountText(kopecks));
  const [typingError, setTypingError] = useState<string | null>(null);

  const apply = (nextSign: AdjustmentSign, nextText: string) => {
    const parsed = parseAdjustment(
      `${nextSign === 'minus' ? '-' : ''}${nextText.replace(/^[+−-]/, '')}`,
    );
    if (parsed.kind === 'invalid') {
      setTypingError(parsed.message);
      return;
    }
    setTypingError(null);
    if (parsed.kopecks !== kopecks) onChange(parsed.kopecks);
  };

  return {
    sign,
    text,
    typingError,
    changeSign: (next: AdjustmentSign) => {
      setSign(next);
      apply(next, text);
    },
    changeText: (next: string) => {
      setText(next);
      apply(sign, next);
    },
  };
}
