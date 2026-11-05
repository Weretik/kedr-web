import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { WholesaleFaqEditor } from './wholesale-faq-editor';

const items = [
  { question: 'Перше?', answer: 'Так.' },
  { question: 'Друге?', answer: 'Ні.' },
];

describe('WholesaleFaqEditor', () => {
  it('moves, removes and adds questions', () => {
    const onChange = vi.fn();
    render(<WholesaleFaqEditor items={items} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Перемістити питання 2 вище' }));
    expect(onChange).toHaveBeenLastCalledWith([items[1], items[0]]);
    fireEvent.click(screen.getByRole('button', { name: 'Прибрати питання 1' }));
    expect(onChange).toHaveBeenLastCalledWith([items[1]]);
    fireEvent.click(screen.getByRole('button', { name: 'Додати питання' }));
    expect(onChange).toHaveBeenLastCalledWith([...items, { question: '', answer: '' }]);
  });

  it('keeps the last question', () => {
    render(<WholesaleFaqEditor items={[items[0]]} onChange={vi.fn()} />);
    expect(
      (screen.getByRole('button', { name: 'Прибрати питання 1' }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });
});
